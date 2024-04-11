import { IPreAkiLoadMod } from "@spt-aki/models/external/IPreAkiLoadMod";
import { IPostDBLoadMod } from "@spt-aki/models/external/IPostDBLoadMod";
import { IWeatherConfig } from "@spt-aki/models/spt/config/IWeatherConfig";
import { ProbabilityHelper } from "@spt-aki/helpers/ProbabilityHelper";
import { ConfigServer } from "@spt-aki/servers/ConfigServer";
import { ConfigTypes } from "@spt-aki/models/enums/ConfigTypes";

import { ConfigUtil } from "./util/ConfigUtil";
import { LoggingUtil } from "./util/LoggingUtil";
import { ModConfig } from "./model/ModConfig";
import { SWAH } from "./SWAH";
import { DependencyContainer, Lifecycle } from "tsyringe";

class Mod implements IPreAkiLoadMod, IPostDBLoadMod
{
    private modConfig: ModConfig;

    public preAkiLoad(container: DependencyContainer): void
    {
        container.register<SWAH>("SWAH", SWAH, {lifecycle: Lifecycle.Singleton});
        container.register<ConfigUtil>("ConfigUtil", ConfigUtil, {lifecycle: Lifecycle.Singleton});
        container.register<LoggingUtil>("LoggingUtil", LoggingUtil, {lifecycle: Lifecycle.Singleton});

        //parse the config and store the values
        this.modConfig = container.resolve<ConfigUtil>("ConfigUtil").parseModConfig();
    }
    
    public postDBLoad(container: DependencyContainer): void 
    {
        const probabilityHelper = container.resolve<ProbabilityHelper>("ProbabilityHelper");
        const weatherConfig: IWeatherConfig = container.resolve<ConfigServer>("ConfigServer").getConfig<IWeatherConfig>(ConfigTypes.WEATHER);

        container.resolve<SWAH>("SWAH").determineSeason(probabilityHelper, weatherConfig, this.modConfig);
    }
}

module.exports = { mod: new Mod() }