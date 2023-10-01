const Phaser = require("phaser");

let playerScore = 0;
let enemyScore = 0;
let isGameOver = false;
let isGameOverShown = false;
let playerStopped = false;
let enemyStopped = false;

class GameScene extends Phaser.Scene {
    constructor() {
        super({ key: "GameScene" });
    }

    preload() {
        this.load.image("background", "assets/sprites/background.png");
        this.load.image("tubes", "assets/sprites/tubes.png");
        this.load.image("blueDestroyed", "assets/sprites/bluedestroyed.png");
        this.load.image("redDestroyed", "assets/sprites/reddestroyed.png");
        this.load.audio("playerPump", "assets/sounds/pump_player.wav");
        this.load.audio("enemyPump", "assets/sounds/pump_enemy.wav");
        this.load.audio("explosion", "assets/sounds/explosion.wav");
    }

    create() {
        this.add.image(512, 384, "background");

        this.tubes = this.add.image(512, 484, "tubes");
        this.blueDestroyed = this.add.image(512, 484, "blueDestroyed");
        this.blueDestroyed.setVisible(false);

        this.redDestroyed = this.add.image(512, 484, "redDestroyed");
        this.redDestroyed.setVisible(false);

        this.playerScoreText = this.add.text(200, 568, playerScore, {
            fontFamily: "ArcadeClassic",
            align: "center",
        });

        this.playerScoreText.setColor("#306141");
        this.playerScoreText.setFontSize(35);

        this.blueWinsText = this.add.text(250, 100, "BLUE COMPANY WINS!", {
            fontFamily: "ArcadeClassic",
            align: "center",
            fontSize: 70,
            color: "#305182",
        });

        this.blueWinsText.setVisible(false);

        this.redWinsText = this.add.text(260, 100, "RED COMPANY WINS!", {
            fontFamily: "ArcadeClassic",
            align: "center",
            fontSize: 70,
            color: "#B21030",
        });

        this.redWinsText.setVisible(false);

        this.tieText = this.add.text(360, 100, "IT'S A TIE!", {
            fontFamily: "ArcadeClassic",
            align: "center",
            fontSize: 70,
            color: "#FFFFFF",
        });

        this.tieText.setVisible(false);

        this.enemyScoreText = this.add.text(800, 568, enemyScore, {
            fontFamily: "ArcadeClassic",
            align: "center",
        });

        this.enemyScoreText.setColor("#306141");
        this.enemyScoreText.setFontSize(35);

        const playerPump = this.sound.add("playerPump", { loop: true });
        const enemyPump = this.sound.add("enemyPump", { loop: true });

        this.explosion = this.sound.add("explosion", { loop: false });

        const pumpButton = this.add.text(185, 620, "Pump", {
            fontSize: "32px",
            fill: "#fff",
            fontFamily: "ArcadeClassic",
            align: "center",
        });

        pumpButton.setInteractive();

        pumpButton.on("pointerup", () => {
            incrementPlayerScore(this);
        });

        this.restartButton = this.add.text(450, 200, "PLAY AGAIN", {
            fontSize: "32px",
            fill: "#fff",
            fontFamily: "ArcadeClassic",
            align: "center",
        });

        this.restartButton.setInteractive();

        this.restartButton.on("pointerup", () => {
            this.redDestroyed.setVisible(false);
            this.blueDestroyed.setVisible(false);
            this.tubes.setVisible(true);
            playerScore = 0;
            enemyScore = 0;
            this.playerScoreText.setText(0);
            this.enemyScoreText.setText(0);
            this.playerScoreText.setVisible(true);
            this.enemyScoreText.setVisible(true);
            pumpButton.setVisible(true);
            stopButton.setVisible(true);
            isGameOver = false;
            isGameOverShown = false;
            playerStopped = false;
            enemyStopped = false;
            this.scene.restart();
        });

        this.restartButton.setVisible(false);

        const stopButton = this.add.text(185, 650, "Stop", {
            fontSize: "32px",
            fill: "#fff",
            fontFamily: "ArcadeClassic",
            align: "center",
        });

        stopButton.setInteractive();

        stopButton.on("pointerup", () => {
            playerStopped = true;
            hideButtons();
            incrementEnemyScore(this);
        });

        function showButtons() {
            pumpButton.setVisible(true);
            stopButton.setVisible(true);
        }

        function hideButtons() {
            pumpButton.setVisible(false);
            stopButton.setVisible(false);
        }

        function incrementPlayerScore(obj) {
            if (!isGameOver && playerStopped) {
                incrementEnemyScore(obj);
                return;
            }

            let incrementAmount = Phaser.Math.Between(1, 10);
            hideButtons();
            let incrementCounter = 0;

            const incrementInterval = setInterval(() => {
                incrementCounter++;
                playerScore += 1;
                playerPump.play();
                obj.playerScoreText.setText(`${playerScore}`);

                if (incrementCounter >= incrementAmount) {
                    clearInterval(incrementInterval);
                    playerPump.stop();
                    if (checkGameOver()) {
                        return 0;
                    }

                    incrementEnemyScore(obj);
                }
            }, 200);
        }

        function takeRisk() {
            if (enemyScore > playerScore && playerStopped) {
                return false;
            }

            if (enemyScore <= 90) {
                return true;
            }

            if (playerScore > enemyScore && !playerStopped) {
                return true;
            }

            let riskNumber = 100 - enemyScore;
            let chance = Phaser.Math.Between(1, 10);

            if (chance <= riskNumber) {
                return true;
            }

            return false;
        }

        function checkGameOver() {
            if (playerScore > 100) {
                isGameOver = true;
                return true;
            }

            if (enemyScore > 100) {
                isGameOver = true;
                return true;
            }

            if (playerStopped && enemyStopped) {
                isGameOver = true;
                return true;
            }

            return false;
        }

        function incrementEnemyScore(obj) {
            if (takeRisk() && !enemyStopped) {
                let incrementAmount = Phaser.Math.Between(1, 10);
                hideButtons();
                let incrementCounter = 0;

                const incrementInterval = setInterval(() => {
                    incrementCounter++;
                    enemyScore += 1;

                    obj.enemyScoreText.setText(`${enemyScore}`);
                    enemyPump.play();

                    if (incrementCounter >= incrementAmount) {
                        clearInterval(incrementInterval);
                        enemyPump.stop();
                        if (checkGameOver()) {
                            return 0;
                        }

                        if (!playerStopped) {
                            showButtons();
                        } else {
                            incrementEnemyScore(obj);
                        }
                    }
                }, 200);
            } else {
                enemyStopped = true;
                if (!playerStopped) {
                    pumpButton.setVisible(true);
                    stopButton.setVisible(true);
                } else {
                    isGameOver = true;
                }
            }
        }
    }

    update() {
        if (isGameOver && !isGameOverShown) {
            console.log("Game Over");

            if (playerScore > 100) {
                this.tubes.setVisible(false);
                this.blueDestroyed.setVisible(true);
                this.playerScoreText.setVisible(false);
                this.explosion.play();
                this.redWinsText.setVisible(true);
            } else if (enemyScore > 100) {
                this.tubes.setVisible(false);
                this.redDestroyed.setVisible(true);
                this.enemyScoreText.setVisible(false);
                this.explosion.play();
                this.blueWinsText.setVisible(true);
            } else if (playerScore > enemyScore) {
                this.blueWinsText.setVisible(true);
            } else if (enemyScore > playerScore) {
                this.redWinsText.setVisible(true);
            } else {
                this.tieText.setVisible(true);
            }

            isGameOverShown = true;
            this.restartButton.setVisible(true);
        }
    }
}

module.exports = GameScene;
