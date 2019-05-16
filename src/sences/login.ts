export class Login extends Phaser.Scene{
    form : any;

    constructor(){
        super({key: 'login'});
    }
    preload(){
        this.load.html('loginForm', 'assets/dom/input.html');
    }

    create(){
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
                this.form.addListener('click');
                this.scene.start('game');
            }
        }
    }
}