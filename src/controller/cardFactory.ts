const assetCardPath = '/assets/cards';
export enum CARD_TYPE {
    ZODIAC,
    PLANET,
    CHAR,
    EVENT
}

export class CardFactory{
    constructor(private sence : Phaser.Scene){}

    makeCard = (type: CARD_TYPE, name: string, value: number) => {
        let cardPath = '';
        let key = '';
        switch(type){
            case CARD_TYPE.ZODIAC:
                key = `${name}_${value}`;
                cardPath = `${assetCardPath}/${key}.png`;
                break;
            case CARD_TYPE.PLANET:
                key = `${name}`;
                cardPath = `${assetCardPath}/${key}.png`;
                break;
            default:
                break;
        }

        if(cardPath === '')
            return;

        // console.log(cardPath);
        this.sence.load.image(`${key}`, cardPath );
        return key;
    }

}