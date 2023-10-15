import GameState from "../states/GameState.js";

class GameScene extends Phaser.Scene {
    constructor() {
        super({ key: "GameScene" });
        loadFont();
        this.stateProps = {};
    }

    preload() {
        // Images
        this.load.image("background", "assets/sprites/background.png");
        this.load.image("tubes", "assets/sprites/tubes.png");
        this.load.image("blueDestroyed", "assets/sprites/bluedestroyed.png");
        this.load.image("redDestroyed", "assets/sprites/reddestroyed.png");

        // Audio
        this.load.audio("bluePump", "assets/sounds/pump_player.wav");
        this.load.audio("redPump", "assets/sounds/pump_enemy.wav");
        this.load.audio("explosion", "assets/sounds/explosion.wav");
    }

    create() {
        this.stateProps["background"] = this.add.image(512, 384, "background");
        this.stateProps["tubes"] = this.add.image(512, 484, "tubes");
        this.stateProps["blueDestroyed"] = this.add.image(
            512,
            484,
            "blueDestroyed"
        );

        this.stateProps["redDestroyed"] = this.add.image(
            512,
            484,
            "redDestroyed"
        );

        this.stateProps["blueScoreText"] = this.add.text(200, 568, 0, {
            fontFamily: "ArcadeClassic",
            align: "center",
        });

        this.stateProps["blueWinsText"] = this.add.text(
            250,
            100,
            "BLUE COMPANY WINS!",
            {
                fontFamily: "ArcadeClassic",
                align: "center",
                fontSize: 70,
                color: "#305182",
            }
        );

        this.stateProps["redWinsText"] = this.add.text(
            260,
            100,
            "RED COMPANY WINS!",
            {
                fontFamily: "ArcadeClassic",
                align: "center",
                fontSize: 70,
                color: "#B21030",
            }
        );

        this.stateProps["tieText"] = this.add.text(360, 100, "IT'S A TIE!", {
            fontFamily: "ArcadeClassic",
            align: "center",
            fontSize: 70,
            color: "#FFFFFF",
        });

        this.stateProps["redScoreText"] = this.add.text(800, 568, 0, {
            fontFamily: "ArcadeClassic",
            align: "center",
        });

        this.stateProps["bluePump"] = this.sound.add("bluePump", {
            loop: true,
        });
        this.stateProps["redPump"] = this.sound.add("redPump", {
            loop: true,
        });

        this.stateProps["explosion"] = this.sound.add("explosion", {
            loop: false,
        });

        this.stateProps["pumpButton"] = this.add.text(185, 620, "Pump", {
            fontSize: "32px",
            fill: "#fff",
            fontFamily: "ArcadeClassic",
            align: "center",
        });

        this.stateProps["restartButton"] = this.add.text(
            450,
            200,
            "PLAY AGAIN",
            {
                fontSize: "32px",
                fill: "#fff",
                fontFamily: "ArcadeClassic",
                align: "center",
            }
        );

        this.stateProps["stopButton"] = this.add.text(185, 670, "Stop", {
            fontSize: "32px",
            fill: "#fff",
            fontFamily: "ArcadeClassic",
            align: "center",
        });

        this.state = new GameState(this.stateProps);
    }
}

export default GameScene;
