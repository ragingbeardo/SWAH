import { ProbabilityHelper } from "@spt-aki/helpers/ProbabilityHelper";
import { IWeatherConfig } from "@spt-aki/models/spt/config/IWeatherConfig";

import { LoggingUtil } from "./util/LoggingUtil";
import { ModConfig } from "./model/ModConfig";
import { inject, injectable } from "tsyringe";

@injectable()
export class SWAH
{
    constructor(
        @inject("LoggingUtil") private loggingUtil: LoggingUtil
    ) 
    {
    }

    public determineSeason(probabilityHelper: ProbabilityHelper, weatherConfig: IWeatherConfig, modConfig: ModConfig): void
    {
        if ( modConfig.shutErDown )
        {
            this.loggingUtil.red("SWAH disabled due to shutErDown being true.", false);
        }
        else
        {
            if ( probabilityHelper.rollChance(modConfig.winterChancePercentage, 100) )
            {
                weatherConfig.forceWinterEvent = true;
                this.loggingUtil.cyan("The weather is looking cold and snowy out there.", modConfig.surpriseMe);
            } 
            else 
            {
                this.loggingUtil.green("The weather is looking warm and breezy out there.", modConfig.surpriseMe);
            } 
        }
    }

}