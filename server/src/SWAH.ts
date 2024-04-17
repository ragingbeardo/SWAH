import type { ProbabilityHelper } from "@spt-aki/helpers/ProbabilityHelper";
import type { IWeatherConfig } from "@spt-aki/models/spt/config/IWeatherConfig";

import type { LoggingUtil } from "./util/LoggingUtil";
import type { ModConfig } from "./model/ModConfig";
import { inject, injectable } from "tsyringe";
import { Season } from "./model/Season";

@injectable()
export class SWAH
{
    constructor(
        @inject("SWAHLoggingUtil") private loggingUtil: LoggingUtil
    ) 
    {
    }

    public determineSeason(probabilityHelper: ProbabilityHelper, weatherConfig: IWeatherConfig, modConfig: ModConfig): Season
    {
        if ( modConfig.shutErDown )
        {
            this.loggingUtil.red("SWAH disabled due to shutErDown being true.", false);
            return Season.SPRING;
        }

        if ( weatherConfig.forceWinterEvent )
        {
            this.loggingUtil.cyan("Winter is here to stay...", modConfig.surpriseMe);
            return Season.WINTER;
        }

        if ( probabilityHelper.rollChance(modConfig.rollingWinterChancePercentage, 100) )
        {
            weatherConfig.forceWinterEvent = true;
            this.loggingUtil.cyan("Winter is coming...", modConfig.surpriseMe);
            return Season.WINTER;
        }

        this.loggingUtil.green("The gopher or whatever said spring is still here.", modConfig.surpriseMe);
        return Season.SPRING;

    }

    public preRaidForecastCheck(probabilityHelper: ProbabilityHelper, weatherConfig: IWeatherConfig, modConfig: ModConfig): Season
    {
        if ( modConfig.shutErDown )
        {
            this.loggingUtil.red("SWAH disabled due to shutErDown being true.", false);
            return Season.SPRING;
        }

        if ( probabilityHelper.rollChance(modConfig.initialWinterChancePercentage, 100) )
        {
            weatherConfig.forceWinterEvent = true;
            this.loggingUtil.cyan("Hopefully you packed some cold weather gear...", modConfig.surpriseMe);
            return Season.WINTER;
        }

        this.loggingUtil.green("The weather is looking warm and breezy out there.", modConfig.surpriseMe);
        return Season.SPRING;

    }

}