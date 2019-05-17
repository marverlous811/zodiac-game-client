import { CardFactory, CARD_TYPE } from "../controller/cardFactory";
import CardData from "../store/cardList";
import { Socket } from "../controller/socket";
import { Field } from "../controller/field";
import Player from "../controller/player";
import { Notify } from "../controller/notify";

export enum GAME_STATE {
    JOINED = 0,
    READY,
    START,
    STAND_BY,
    WAIT_OTHER,
    END_GAME
}

export class GameScene extends Phaser.Scene{
    cardFactory : CardFactory;
    listCard : Array<string> = [];
    socket: Socket;
    readyButton : Phaser.GameObjects.Image | undefined;
    drawButton : Phaser.GameObjects.Image | undefined;
    endButton : Phaser.GameObjects.Image | undefined;
    _state : GAME_STATE = GAME_STATE.JOINED;
    isActive: boolean = false;
    _name : string = '';
    field : Field;
    listPlayer : Map<string, Player> = new Map();
    notify : Notify;
    you: Player | undefined;
    constructor(socket: Socket){
        super({key: "game"});
        this.cardFactory = new CardFactory(this);
        this.field = new Field(this);
        this.notify = new Notify(this);
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
        this.notify.create(10,10);
        this.notify.setText("welcome to game room");
        // this.input.on("pointerdown", this.onClick);
    }

    setListener(){
        this.socket.resgistEventHandle("PLAYER_READY", this.onPlayerReady);
        this.socket.resgistEventHandle("START_GAME", this.onGameStart);
        this.socket.resgistEventHandle("END_DRAW_PHASE", this.endDrawPhase);
        this.socket.resgistEventHandle("END_TURN", this.endTurn);
        this.socket.resgistEventHandle("END_GAME", this.endGame);
    }

    create(){
        this.setListener();
        this.readyButton = this.add.image(550,400,'ready');
        this.readyButton.setInteractive().on('pointerdown', this.ready);
        this._name = this.socket.name;

        this.you = new Player(this.socket.name, this, true);
        this.you.create(10, 40);
    }

    onReady = () => {
        this.notify.setText("Wait for another player ready");
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
        if(this.isActive) return;

        this.isActive = true;
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
        const {max, ready, name} = _data;

        this.notify.setText(`Wait for another player ready: ${ready}/${max}`);
    }

    onGameStart = (data: string) => {
        const _data=  JSON.parse(data);
        const { nowTurn } = _data;
        
        // console.log(`game start: ${nowTurn}`);

        this.drawButton = this.add.image(550, 700,'draw');
        this.endButton = this.add.image(900, 700, 'end');

        this.drawButton.setInteractive().on('pointerdown', this.draw);
        this.endButton.setInteractive().on('pointerdown', this.end);

        if(nowTurn === this._name){
            this.notify.setText("Your turn");
            this._state = GAME_STATE.STAND_BY;
        }
        else{
            this.notify.setText(`${nowTurn}'s turn`);
            this._state = GAME_STATE.WAIT_OTHER;
        }
        
    }

    endDrawPhase = (data: string) => {
        const _data = JSON.parse(data);
        // console.log(_data);
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

        if(!cardName) {
            return;
        }

        this.field.addCard(cardName);

        this.isActive = false;
    }

    endTurn = (data: string) => {
        const _data = JSON.parse(data);
        console.log("end turn... ",_data);
        this.field.removeAllCard();
        if(_data.now.name === this._name){
            this._state = GAME_STATE.WAIT_OTHER;
            if(this.you) this.you.setScore(_data.now.score);
        }

        if(_data.next.name === this._name){
            this._state = GAME_STATE.STAND_BY;
            this.notify.setText("Your turn");
        }
        else{
            this.notify.setText(`${_data.next.name}'s turn`);
            this._state = GAME_STATE.WAIT_OTHER;
        }
    }

    endGame = (data: string) => {
        const _data = JSON.parse(data);
        console.log("end game... ",_data);

        this.notify.setText(`winner is ${_data.winner.name}`);
        this.field.removeAllCard();
        if(_data.now.name === this._name){
            if(this.you) this.you.setScore(_data.now.score);
        }
        this._state = GAME_STATE.END_GAME;
    }
}