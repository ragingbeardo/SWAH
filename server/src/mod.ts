import type { IPreAkiLoadMod } from "@spt-aki/models/external/IPreAkiLoadMod";
import type { IPostDBLoadMod } from "@spt-aki/models/external/IPostDBLoadMod";
import type { IWeatherConfig } from "@spt-aki/models/spt/config/IWeatherConfig";
import type { ProbabilityHelper } from "@spt-aki/helpers/ProbabilityHelper";
import type { ConfigServer } from "@spt-aki/servers/ConfigServer";
import { ConfigTypes } from "@spt-aki/models/enums/ConfigTypes";
import type {StaticRouterModService} from "@spt-aki/services/mod/staticRouter/StaticRouterModService";

import { ConfigUtil } from "./util/ConfigUtil";
import { LoggingUtil } from "./util/LoggingUtil";
import type { ModConfig } from "./model/ModConfig";
import { SWAH } from "./SWAH";
import { type DependencyContainer, Lifecycle } from "tsyringe";

class Mod implements IPreAkiLoadMod, IPostDBLoadMod
{
    private modConfig: ModConfig;
    private probabilityHelper: ProbabilityHelper;
    private weatherConfig: IWeatherConfig;

    public preAkiLoad(container: DependencyContainer): void
    {
        container.register<SWAH>("SWAH", SWAH, {lifecycle: Lifecycle.Singleton});
        container.register<ConfigUtil>("SWAHConfigUtil", ConfigUtil, {lifecycle: Lifecycle.Singleton});
        container.register<LoggingUtil>("SWAHLoggingUtil", LoggingUtil, {lifecycle: Lifecycle.Singleton});

        this.probabilityHelper = container.resolve<ProbabilityHelper>("ProbabilityHelper");
        this.weatherConfig = container.resolve<ConfigServer>("ConfigServer").getConfig<IWeatherConfig>(ConfigTypes.WEATHER);
        this.modConfig = container.resolve<ConfigUtil>("SWAHConfigUtil").parseModConfig();
        const staticRouterModService = container.resolve<StaticRouterModService>("StaticRouterModService");

        staticRouterModService.registerStaticRouter(
            "SwahGetForecast",
            [
                {
                    url: "/swah/forecast",
                    action: (url, info, sessionId, output) => 
                    {
                        const result = container.resolve<SWAH>("SWAH").determineSeason(this.probabilityHelper, this.weatherConfig, this.modConfig);
                        if ( result )
                        {
                            return JSON.stringify({season: "WINTER"});
                        }

                        return JSON.stringify({season: "SPRING"});
                    }
                }
            ],
            "swah-get"
        );
    }
    
    public postDBLoad(container: DependencyContainer): void 
    {
        container.resolve<SWAH>("SWAH").preRaidForecastCheck(this.probabilityHelper, this.weatherConfig, this.modConfig);
    }
}

module.exports = { mod: new Mod() }