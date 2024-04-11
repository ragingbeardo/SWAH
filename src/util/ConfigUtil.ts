import { VFS } from "@spt-aki/utils/VFS";

import { container, inject, injectable } from "tsyringe";
import { ModConfig } from "src/model/ModConfig";
import { jsonc } from "jsonc";
import path from "path";
import { LoggingUtil } from "./LoggingUtil";

@injectable()
export class ConfigUtil
{
    constructor(
        @inject("LoggingUtil") private loggingUtil: LoggingUtil
    )
    {}

    public parseModConfig(): ModConfig
    {
        const vfs = container.resolve<VFS>("VFS");

        // attempt to parse the config file
        let modConfig = null;
        try 
        {
            modConfig = jsonc.parse(vfs.readFile(path.resolve(__dirname, "../config/config.jsonc")));
        } 
        catch (error) 
        {
            this.loggingUtil.error("SeasonalWeatherAtHome: Disabling mod due to an error parsing the config file. Make sure your values are set up correctly.");
            //returns a mod config with the shut down flag set to true
            return new ModConfig(true);
        }

        return modConfig;
    }
}