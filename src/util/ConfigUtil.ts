import type { VFS } from "@spt-aki/utils/VFS";

import { jsonc } from "jsonc";
import type { LoggingUtil } from "./LoggingUtil";
import { ModConfig } from "../model/ModConfig";
import { container, inject, injectable } from "tsyringe";

import path from "path";

@injectable()
export class ConfigUtil
{
    constructor(
        @inject("SWAHLoggingUtil") private loggingUtil: LoggingUtil
    )
    {}

    public parseModConfig(): ModConfig
    {
        const vfs = container.resolve<VFS>("VFS");

        // attempt to parse the config file
        let modConfig: ModConfig;
        try 
        {
            modConfig = jsonc.parse(vfs.readFile(path.resolve(__dirname, "../../config/config.jsonc")));
        } 
        catch (error) 
        {
            this.loggingUtil.error("Disabling mod due to an error parsing the config file. Make sure your values are set up correctly.");
            //returns a mod config with the shut down flag set to true
            return new ModConfig(true);
        }

        return modConfig;
    }
}