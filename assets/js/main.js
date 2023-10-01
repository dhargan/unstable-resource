const { Game } = require("phaser");
import MainMenuScene from "../scenes/MainMenuScene"; // MainMenuScene dosyasını içe aktarın
import GameScene from "../scenes/GameScene"; // GameScene dosyasını içe aktarın

const gameConfig = {
    type: Phaser.AUTO,
    width: 1024,
    height: 768,
    scene: [MainMenuScene, GameScene],
};

const game = new Game(gameConfig);
