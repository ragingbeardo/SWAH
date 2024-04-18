using Newtonsoft.Json;
using SeasonalWeatherAtHome.Model;

namespace SeasonalWeatherAtHome.Helper;

public abstract class LogicHelper
{
    public static void CheckTheForecast()
    {
        Aki.Common.Http.RequestHandler.GetJson("/swah/forecast");
    }
}