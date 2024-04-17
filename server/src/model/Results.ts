import type { Season } from "./Season";

export class Results
{
    public season: Season;
    constructor(season: Season)
    {
        this.season = season;
    }
}