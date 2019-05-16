import Player from "./controller/player";
import "phaser"
import { GameScene } from "./sences/game";
import { Login } from "./sences/login";

const player = new Player("marverlous");
console.log("hello ", player.getName());

const gameSence = new GameScene({key: "game"});
const loginSence = new Login();

const config: Phaser.Types.Core.GameConfig = {
    title: "Starfall",
    width: 1024,
    height: 768,
    parent: "game",
    scene: [loginSence, gameSence],
    backgroundColor: '#222288',
    dom: {
        createContainer: true
    },
};

const game = new Phaser.Game(config);