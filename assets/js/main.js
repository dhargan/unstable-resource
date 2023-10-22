import MainMenuScene from "/assets/scenes/MainMenuScene.js";
import GameScene from "/assets/scenes/GameScene.js";

const config = {
    type: Phaser.AUTO,
    width: 1024,
    height: 768,
    scene: [MainMenuScene, GameScene],
};

const game = new Phaser.Game(config);
