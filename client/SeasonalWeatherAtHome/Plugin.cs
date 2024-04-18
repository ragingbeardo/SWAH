using BepInEx;
using System;
using System.Reflection;
using Aki.Reflection.Patching;
using BepInEx.Logging;
using EFT;
using SeasonalWeatherAtHome.Helper;

namespace SeasonalWeatherAtHome;

[BepInPlugin("com.ragingbeardo.swah", "Seasonal Weather At Home", "2.0.1")]
public class Plugin : BaseUnityPlugin
{
    public const int TarkovVersion = 29197;
    public static ManualLogSource? Log;

    internal void Awake()
    {
        Log = Logger;
            
        if (!VersionChecker.CheckEftVersion(Config))
        {
            throw new Exception("Invalid EFT Version");
        }
        
        // Patching
        new GameWorldPatch().Enable();
    }
}
    
internal class GameWorldPatch : ModulePatch
{
    protected override MethodBase? GetTargetMethod() => typeof(GameWorld).GetMethod(nameof(GameWorld.OnGameStarted));

    [PatchPrefix]
    internal static void PatchPrefix()
    {
        Plugin.Log?.LogDebug("Checking the weather...");
        LogicHelper.CheckTheForecast();
        Plugin.Log?.LogDebug("The weather was checked.");
    }
}