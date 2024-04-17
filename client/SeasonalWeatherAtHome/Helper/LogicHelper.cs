using Newtonsoft.Json;
using SeasonalWeatherAtHome.Model;

namespace SeasonalWeatherAtHome.Helper;

public abstract class LogicHelper
{
    public static SeasonResponse? CheckTheForecast()
    {
        var req = Aki.Common.Http.RequestHandler.GetJson("/swah/forecast");
        return JsonConvert.DeserializeObject<SeasonResponse>(req);
    }
}