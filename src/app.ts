import Player from "./controller/player";
import "phaser"
import { GameScene } from "./sences/game";
import { Login } from "./sences/login";
import { Socket } from "./controller/socket";

const socket = new Socket();

const gameSence = new GameScene(socket);
const loginSence = new Login(socket);

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