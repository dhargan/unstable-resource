class MainMenuScene extends Phaser.Scene {
    constructor() {
        super({ key: "MainMenuScene" });
        loadFont();
    }

    preload() {
        this.load.image("mainmenubackground", "assets/sprites/mainmenu.png");
    }

    create() {
        this.add.image(512, 384, "mainmenubackground");

        const playButton = this.add.text(400, 500, "PLAY", {
            fontSize: "72px",
            fontFamily: "ArcadeClassic",
            fill: "#fff",
            align: "center",
        });

        playButton.setInteractive();
        playButton.on("pointerup", () => {
            this.scene.start("GameScene");
        });
    }
}

export default MainMenuScene;
