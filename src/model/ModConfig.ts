export class ModConfig
{

    public shutErDown: boolean = false;
    public surpriseMe: boolean = false;
    public winterChancePercentage: number;

    constructor(shutErDown: boolean)
    {
        this.shutErDown = shutErDown;
    }
    
}