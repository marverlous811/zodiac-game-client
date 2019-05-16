export default class Player{
    private id: number = 0;
    private _name: string;
    private _score: number = 0;
    constructor(name: string){
        this._name = name;
    }

    get name(){
        return this._name;
    }

    get score(){
        return this._score;
    }
}