import { LogTextColor } from "@spt-aki/models/spt/logging/LogTextColor";
import type { ILogger } from "@spt-aki/models/spt/utils/ILogger";

import { inject, injectable } from "tsyringe";

@injectable()
export class LoggingUtil
{

    constructor(
        @inject("WinstonLogger") private logger: ILogger) 
    {
    }

    public green(message: string, surpriseMe: boolean) : void
    {
        if ( !surpriseMe ) this.logger.log(`SeasonalWeatherAtHome: ${message}`, LogTextColor.GREEN);
    }

    public cyan(message: string, surpriseMe: boolean) : void
    {
        if ( !surpriseMe ) this.logger.log(`SeasonalWeatherAtHome: ${message}`, LogTextColor.CYAN);
    }

    public error(message: string) : void
    {
        this.logger.error(`SeasonalWeatherAtHome: ${message}`);
    }

}