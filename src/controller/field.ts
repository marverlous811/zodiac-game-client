import { Scene } from "phaser";

export class Field{
    listCard : Array<Phaser.GameObjects.Image> = [];
    scene : Scene;
    startX: number = 800;
    startY: number = 300;
    deltaX: number = 50;
    constructor(scene: Scene){
        this.scene = scene;
    }

    addCard(cardkey: string){
        this.movingOldCard();
        const image = this.scene.add.image(this.startX, this.startY, cardkey);
        this.listCard.push(image);
    }

    movingOldCard(){
        for(let i = 0; i < this.listCard.length; i++){
            const card = this.listCard[i];
            card.setX(card.x - this.deltaX);
        }
    }

    removeAllCard(){
        while(this.listCard.length > 0){
            const card = this.listCard.pop();
            if(card) card.destroy();
        }
    }
}