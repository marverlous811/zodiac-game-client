import { Socket } from "../controller/socket";

export class Login extends Phaser.Scene{
    form : any;
    text : Phaser.GameObjects.Text | undefined;
    socket : Socket;

    constructor(socket: Socket){
        super({key: 'login'});
        this.socket = socket;
    }
    preload(){
        this.load.html('loginForm', 'assets/dom/input.html');
    }

    create(){
        this.text = this.add.text(10, 10, 'Please enter your name', {color: 'white', fontFamily: 'Arial', fontSize: '32px'});
        this.form = this.add.dom(525, 375).createFromCache('loginForm');
        this.form.setPerspective(800);
        this.form.addListener('click');
        this.form.on('click', this.onFormClick)
    }

    onFormClick = (event: any) => {
        console.log("click ", event);
        if(event.target.name === 'loginButton'){
            const inputName = this.form.getChildByName('name');
            const inputRoom = this.form.getChildByName('room');

            if(inputName.value !== '' && inputRoom.value !== ''){
                this.form.removeListener('click');
                this.socket.setName(inputName.value);
                this.socket.setRoom(inputRoom.value);
                if(this.text){
                    this.text.setText("waiting for connect...");
                    this.socket.connect();
                    this.socket.on("connected", () => {
                        this.scene.start('game');
                    })
                }
            }
        }
        else{
            
        }
    }
}