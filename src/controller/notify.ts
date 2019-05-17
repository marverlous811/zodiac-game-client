export class Notify{
    private _text: string = '';
    private scene: Phaser.Scene;
    private posX : number = 0;
    private posY : number = 0;
    private textObject : Phaser.GameObjects.Text | undefined;

    constructor(scene: Phaser.Scene) {
        this.scene = scene;
    }

    get text(){
        return this._text;
    }

    create(x: number, y: number){
        this.posX = x;
        this.posY = y;

        this.textObject = this.scene.add.text(this.posX, this.posY, this.text, {color: 'white', fontFamily: 'Arial', fontSize: '32px'});
    }

    setText(text: string){
        this._text = text;
        if(this.textObject) this.textObject.setText(this.text);
    }
}