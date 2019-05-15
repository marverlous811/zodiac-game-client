import Player from "./controller/player";
import "phaser"

const player = new Player("marverlous");
console.log("hello ", player.getName());

const config: Phaser.Types.Core.GameConfig = {
    title: "Starfall",
    width: 800,
    height: 600,
    parent: "game",
    backgroundColor: "#18216D"
};

const game = new Phaser.Game(config);