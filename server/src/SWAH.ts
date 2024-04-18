import type { ProbabilityHelper } from "@spt-aki/helpers/ProbabilityHelper";
import type { IWeatherConfig } from "@spt-aki/models/spt/config/IWeatherConfig";

import type { LoggingUtil } from "./util/LoggingUtil";
import type { ModConfig } from "./model/ModConfig";
import { inject, injectable } from "tsyringe";

@injectable()
export class SWAH
{
    constructor(
        @inject("SWAHLoggingUtil") private loggingUtil: LoggingUtil
    ) 
    {
    }

    public determineSeason(probabilityHelper: ProbabilityHelper, weatherConfig: IWeatherConfig, modConfig: ModConfig): boolean
    {
        if ( modConfig.shutErDown )
        {
            this.loggingUtil.red("SWAH disabled due to shutErDown being true.", false);
            return false;
        }

        if ( weatherConfig.forceWinterEvent )
        {
            this.loggingUtil.cyan("Winter is here to stay...", modConfig.surpriseMe);
            return weatherConfig.forceWinterEvent;
        }

        if ( probabilityHelper.rollChance(modConfig.rollingWinterChancePercentage, 100) )
        {
            weatherConfig.forceWinterEvent = true;
            this.loggingUtil.cyan("Winter is coming...", modConfig.surpriseMe);\
            return weatherConfig.forceWinterEvent;
        }

        this.loggingUtil.green("The gopher or whatever said spring is still here.", modConfig.surpriseMe);
        return weatherConfig.forceWinterEvent;
    }

    public preRaidForecastCheck(probabilityHelper: ProbabilityHelper, weatherConfig: IWeatherConfig, modConfig: ModConfig): boolean
    {
        if ( modConfig.shutErDown )
        {
            this.loggingUtil.red("SWAH disabled due to shutErDown being true.", false);
            return false;
        }

        if ( probabilityHelper.rollChance(modConfig.initialWinterChancePercentage, 100) )
        {
            weatherConfig.forceWinterEvent = true;
            this.loggingUtil.cyan("Hopefully you packed some cold weather gear...", modConfig.surpriseMe);
            return weatherConfig.forceWinterEvent;
        }

        this.loggingUtil.green("The weather is looking warm and breezy out there.", modConfig.surpriseMe);
        return weatherConfig.forceWinterEvent;
    }

}