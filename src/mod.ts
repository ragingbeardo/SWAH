import type { IPreAkiLoadMod } from "@spt-aki/models/external/IPreAkiLoadMod";
import type { IPostDBLoadMod } from "@spt-aki/models/external/IPostDBLoadMod";
import type { IWeatherConfig } from "@spt-aki/models/spt/config/IWeatherConfig";
import type { ProbabilityHelper } from "@spt-aki/helpers/ProbabilityHelper";
import type { ConfigServer } from "@spt-aki/servers/ConfigServer";
import { ConfigTypes } from "@spt-aki/models/enums/ConfigTypes";

import { ConfigUtil } from "./util/ConfigUtil";
import { LoggingUtil } from "./util/LoggingUtil";
import type { ModConfig } from "./model/ModConfig";
import { SWAH } from "./SWAH";
import { type DependencyContainer, Lifecycle } from "tsyringe";

class Mod implements IPreAkiLoadMod, IPostDBLoadMod
{
    private modConfig: ModConfig;

    public preAkiLoad(container: DependencyContainer): void
    {
        container.register<SWAH>("SWAH", SWAH, {lifecycle: Lifecycle.Singleton});
        container.register<ConfigUtil>("SWAHConfigUtil", ConfigUtil, {lifecycle: Lifecycle.Singleton});
        container.register<LoggingUtil>("SWAHLoggingUtil", LoggingUtil, {lifecycle: Lifecycle.Singleton});

        //parse the config and store the values
        this.modConfig = container.resolve<ConfigUtil>("SWAHConfigUtil").parseModConfig();
    }
    
    public postDBLoad(container: DependencyContainer): void 
    {
        const probabilityHelper = container.resolve<ProbabilityHelper>("ProbabilityHelper");
        const weatherConfig: IWeatherConfig = container.resolve<ConfigServer>("ConfigServer").getConfig<IWeatherConfig>(ConfigTypes.WEATHER);

        container.resolve<SWAH>("SWAH").determineSeason(probabilityHelper, weatherConfig, this.modConfig);
    }
}

module.exports = { mod: new Mod() }