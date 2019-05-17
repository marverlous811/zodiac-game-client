export default class Player{
    private id: number = 0;
    private _name: string;
    private _score: number = 0;
    private scene : Phaser.Scene;
    private startPosX: number = 0;
    private startPosY: number = 0;
    private info : Phaser.GameObjects.Text | undefined;
    private infoText: string = '';
    private _isYou : boolean = false;

    constructor(name: string, scene: Phaser.Scene, isYou?: boolean){
        this._name = name;
        this.scene = scene;
        this._isYou = isYou || false;
        this.setText();
    }

    create(x: number, y: number){
        this.startPosX = x;
        this.startPosY = y;

        this.info = this.scene.add.text(
            this.startPosX, 
            this.startPosY, 
            this.infoText, 
            {
                color: 'white',
                fontFamily: 'Arial', 
                fontSize: '25px'
            });
    }

    setText(){
        this.infoText = `${this.name} ${this.isYou ? '( you )' : ''} : ${this.score}`;
    }

    update(){
        this.setText();
        if(this.info) this.info.setText(this.infoText);
    }

    setScore(number: number){
        this._score = number;
        this.update();
    }

    get name(){
        return this._name;
    }

    get score(){
        return this._score;
    }

    get isYou(){
        return this._isYou;
    }
}