import Player from "./controller/player";
import "phaser"
import { GameScene } from "./sences/game";

const player = new Player("marverlous");
console.log("hello ", player.getName());

const gameSence = new GameScene({});

const config: Phaser.Types.Core.GameConfig = {
    title: "Starfall",
    width: 1024,
    height: 768,
    scene: [gameSence],
};

const game = new Phaser.Game(config);