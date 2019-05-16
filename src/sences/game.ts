import { CardFactory, CARD_TYPE } from "../controller/cardFactory";
import CardData from "../store/cardList";
import { Socket } from "../controller/socket";

export class GameScene extends Phaser.Scene{
    cardFactory : CardFactory;
    listCard : Array<string> = [];
    nowCard : number = 0;
    nowCardImage : Phaser.GameObjects.Image | undefined;
    socket: Socket;
    readyButton : Phaser.GameObjects.Image | undefined;
    notifyText : Phaser.GameObjects.Text | undefined;
    yourInfo : Phaser.GameObjects.Text | undefined;
    score : number = 0;
    _name : string = '';
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

        this.load.image('ready', '/assets/UI/ready_button.png');
        this.notifyText = this.add.text(10,10, "welcome to game room", {color: 'white', fontFamily: 'Arial', fontSize: '32px'})
        this.input.on("pointerdown", this.onClick);
        this.input.on("gameobjectdown", this.onObjectClicked);
    }

    setListener(){
        this.socket.resgistEventHandle("PLAYER_READY", this.onPlayerReady);
        this.socket.resgistEventHandle("START_GAME", this.onGameStart);
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
        this.setListener();
        this.readyButton = this.add.image(550,400,'ready');
        this.readyButton.setInteractive()
        this._name = this.socket.name;
        this.yourInfo = this.add.text(10,40, `${this._name}: ${this.score}`, {color: 'white', fontFamily: 'Arial', fontSize: '32px'})
    }

    onReady = () => {
        if(this.notifyText){
            this.notifyText.setText("Wait for another player ready");
        }
        this.socket.send("READY", this._name);
    }

    onObjectClicked = (pointer: any, gameObject: any) => {
        console.log(pointer, gameObject);
        if(gameObject === this.readyButton){
            this.onReady();
            if(this.readyButton) this.readyButton.setVisible(false);
        }
    }

    update(){
    
    }    

    onPlayerReady = (data: string) => {
        const _data = JSON.parse(data);
        const {max, ready} = _data;

        if(this.notifyText) this.notifyText.setText(`Wait for another player ready: ${ready}/${max}`);
    }

    onGameStart = (data: string) => {
        const _data=  JSON.parse(data);
        const { nowTurn } = _data;
        
        console.log(`game start: ${nowTurn}`);
    }
}