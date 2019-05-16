import { CardFactory, CARD_TYPE } from "../controller/cardFactory";
import CardData from "../store/cardList";
import { Socket } from "../controller/socket";

export class GameScene extends Phaser.Scene{
    cardFactory : CardFactory;
    listCard : Array<string> = [];
    nowCard : number = 0;
    nowCardImage : Phaser.GameObjects.Image | undefined;
    socket: Socket;
    constructor(socket: Socket){
        super({key: "game"});
        this.cardFactory = new CardFactory(this);
        this.socket = socket;
    }

    preload(){
        const zodiacCard = CardData.zodiacCard;
        const planetCard = CardData.planetCard;

        for(let i = 0; i < zodiacCard.length; i++){
            const cardInfo : any = zodiacCard[i];
            for(let j = 0; j < cardInfo.values.length; j++){
                const value = cardInfo.values[j];
                const key = this.cardFactory.makeCard(CARD_TYPE.ZODIAC, cardInfo.name, value);
                if(key){
                    this.listCard.push(key);
                }
            }
        }

        for(let i = 0; i < planetCard.length; i++){
            const cardInfo : any = planetCard[i];
            const key = this.cardFactory.makeCard(CARD_TYPE.PLANET, cardInfo.name, cardInfo.values);
            if(key){
                this.listCard.push(key);
            }
        }

        this.input.on("pointerdown", this.onClick);
    }

    onClick = () => {
        if(!this.nowCardImage) return;

        this.nowCardImage.destroy();
        
        if(this.nowCard + 1 >= this.listCard.length){
            this.nowCard = 0;
        }
        else{
            this.nowCard += 1;
        }

        console.log(this.listCard[this.nowCard]);

        this.nowCardImage = this.add.image(300,400, this.listCard[this.nowCard])
    }

    create(){
        this.nowCardImage = this.add.image(300,400, this.listCard[this.nowCard]);
        // console.log("create sence...");
        // setInterval(() => {
        //     this.onClick();
        // },1000);
    }

    update(){
    
    }    
}