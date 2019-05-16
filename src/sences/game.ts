import { CardFactory, CARD_TYPE } from "../controller/cardFactory";
import CardData from "../store/cardList";
import { Socket } from "../controller/socket";

export enum GAME_STATE {
    JOINED = 0,
    READY,
    START,
    STAND_BY,
    WAIT_OTHER,
}

export class GameScene extends Phaser.Scene{
    cardFactory : CardFactory;
    listCard : Array<string> = [];
    nowCard : number = 0;
    nowCardImage : Phaser.GameObjects.Image | undefined;
    socket: Socket;
    readyButton : Phaser.GameObjects.Image | undefined;
    drawButton : Phaser.GameObjects.Image | undefined;
    endButton : Phaser.GameObjects.Image | undefined;
    notifyText : Phaser.GameObjects.Text | undefined;
    yourInfo : Phaser.GameObjects.Text | undefined;
    _state : GAME_STATE = GAME_STATE.JOINED;
    score : number = 0;
    _name : string = '';
    constructor(socket: Socket){
        super({key: "game"});
        this.cardFactory = new CardFactory(this);
        this.socket = socket;
    }

    get state(){
        return this._state;
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
        this.load.image('draw', '/assets/UI/draw_button.png');
        this.load.image('end', '/assets/UI/end_button.png');
        this.notifyText = this.add.text(10,10, "welcome to game room", {color: 'white', fontFamily: 'Arial', fontSize: '32px'})
        // this.input.on("pointerdown", this.onClick);
    }

    setListener(){
        this.socket.resgistEventHandle("PLAYER_READY", this.onPlayerReady);
        this.socket.resgistEventHandle("START_GAME", this.onGameStart);
        this.socket.resgistEventHandle("END_DRAW_PHASE", this.endDrawPhase);
        this.socket.resgistEventHandle("END_TURN", this.endTurn);
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
        this.readyButton.setInteractive().on('pointerdown', this.ready);
        this._name = this.socket.name;
        this.yourInfo = this.add.text(10,40, `${this._name}: ${this.score}`, {color: 'white', fontFamily: 'Arial', fontSize: '32px'})
    }

    onReady = () => {
        if(this.notifyText){
            this.notifyText.setText("Wait for another player ready");
        }
        this._state = GAME_STATE.READY;
        this.socket.send("READY", this._name);
    }

    ready = () => {
        console.log("ready");
        this.onReady();
        if(this.readyButton) this.readyButton.setVisible(false);
    }

    draw = () => {
        if(this.state !== GAME_STATE.STAND_BY) return;
        console.log("draw");
        this.socket.send("DRAW")
    }

    end = () => {
        if(this.state !== GAME_STATE.STAND_BY) return;
        console.log("end");
        this.socket.send("END_TURN")
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

        this.drawButton = this.add.image(550, 700,'draw');
        this.endButton = this.add.image(900, 700, 'end');

        this.drawButton.setInteractive().on('pointerdown', this.draw);
        this.endButton.setInteractive().on('pointerdown', this.end);

        if(nowTurn === this._name){
            this._state = GAME_STATE.STAND_BY;
        }
        else{
            this._state = GAME_STATE.WAIT_OTHER;
        }
        
    }

    endDrawPhase = (data: string) => {
        const _data = JSON.parse(data);
        console.log(_data);
        const {type, name, value} = _data;
        let cardName = '';

        switch(type){
            case CARD_TYPE.ZODIAC: 
                cardName = `${name}_${value}`;
                break;
            case CARD_TYPE.PLANET:
                cardName = `${name}`;
                break;
            default: break;
        }

        console.log(cardName);

        if(!cardName) {
            return;
        }

        const cardIndex = this.findACard(cardName);
        console.log(cardIndex);
        if(cardIndex === -1){
            return;
        }

        this.hideNowCard();

        this.nowCard = cardIndex;
        this.showNowCard();
    }

    endTurn = (data: string) => {
        const _data = JSON.parse(data);
        console.log("end turn... ",_data);
        if(_data.now.name === this._name){
            this.score = _data.now.score;
            this._state = GAME_STATE.WAIT_OTHER;
            if(this.yourInfo) this.yourInfo.setText(`${this._name}: ${this.score}`);
        }

        if(_data.next.name){
            this._state = GAME_STATE.STAND_BY;
        }
    }

    showNowCard = () => {
        this.nowCardImage = this.add.image(300,400, this.listCard[this.nowCard])
    }

    hideNowCard = () => {
        if(this.nowCardImage) 
            this.nowCardImage.destroy();
    }

    findACard = (name: string) => {
        let index = -1;
        for(let i = 0; i < this.listCard.length; i++){
            // console.log(this.listCard[i]);
            if(this.listCard[i] === name){
                index = i;
                break;
            }
        }

        return index;
    }
}