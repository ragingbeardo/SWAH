export class ModConfig
{

    public shutErDown: boolean;
    public surpriseMe: boolean;
    public initialWinterChancePercentage: number;
    public rollingWinterChancePercentage: number;

    constructor(shutErDown: boolean)
    {
        this.shutErDown = shutErDown;
    }
    
}