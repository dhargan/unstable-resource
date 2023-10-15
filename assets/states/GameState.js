class GameState {
    constructor(props) {
        this.props = props;
        this.props["pumpButton"].setInteractive();
        this.props["pumpButton"].on("pointerup", () => {
            this.incrementBlueState();
        });

        this.props["stopButton"].setInteractive();
        this.props["stopButton"].on("pointerup", () => {
            this.#stopBlue();
            this.blueStoppedState();
        });

        this.props["restartButton"].setInteractive();
        this.props["restartButton"].on("pointerup", () => {
            this.initialState();
        });

        this.initialState();
    }

    // Helpers
    #showButtons() {
        this.props["stopButton"].setVisible(true);
        this.props["pumpButton"].setVisible(true);
    }

    #hideButtons() {
        this.props["stopButton"].setVisible(false);
        this.props["pumpButton"].setVisible(false);
    }

    #isBlueStopped() {
        return this.props["blueStopped"];
    }

    #isRedStopped() {
        return this.props["redStopped"];
    }

    #stopBlue() {
        this.props["blueStopped"] = true;
    }

    #stopRed() {
        this.props["redStopped"] = true;
    }

    #isGameOver() {
        if (this.props["blueScore"] > 100 || this.props["redScore"] > 100) {
            return true;
        }

        if (this.#isBlueStopped() && this.#isRedStopped()) {
            return true;
        }

        return false;
    }

    #pump(player) {
        let obj = this;
        function pumpBlue() {
            obj.props["blueScore"] += 1;
            obj.props["bluePump"].play();
            obj.props["blueScoreText"].setText(`${obj.props["blueScore"]}`);
        }

        function pumpRed() {
            obj.props["redScore"] += 1;
            obj.props["redPump"].play();
            obj.props["redScoreText"].setText(`${obj.props["redScore"]}`);
        }

        let incrementAmount = Phaser.Math.Between(1, 10);
        let incrementCounter = 0;

        const incrementInterval = setInterval(() => {
            incrementCounter++;
            player === "blue" ? pumpBlue() : pumpRed();
            if (incrementCounter >= incrementAmount) {
                clearInterval(incrementInterval);
                this.props["bluePump"].stop();
                this.props["redPump"].stop();

                if (this.#isGameOver()) {
                    this.gameOverState();
                } else {
                    player === "blue" ? this.redState() : this.blueState();
                }
            }
        }, 200);
    }

    #takeRisk() {
        if (
            this.props["redScore"] > this.props["blueScore"] &&
            this.#isBlueStopped()
        ) {
            return false;
        }

        if (this.props["redScore"] <= 90) {
            return true;
        }

        if (
            this.props["blueScore"] > this.props["redScore"] &&
            !this.#isBlueStopped()
        ) {
            return true;
        }

        let riskNumber = 100 - this.props["redScore"];
        let chance = Phaser.Math.Between(1, 10);

        if (chance <= riskNumber) {
            return true;
        }

        return false;
    }

    #isBlueExplode() {
        if (this.props["blueScore"] > 100) {
            this.props["tubes"].setVisible(false);
            this.props["blueDestroyed"].setVisible(true);
            this.props["explosion"].play();
            return true;
        }

        return false;
    }

    #isRedExplode() {
        if (this.props["redScore"] > 100) {
            this.props["tubes"].setVisible(false);
            this.props["redDestroyed"].setVisible(true);
            this.props["explosion"].play();
            return true;
        }

        return false;
    }

    #isBlueWin() {
        return (
            this.#isRedExplode() ||
            (this.props["blueScore"] <= 100 &&
                this.props["blueScore"] > this.props["redScore"])
        );
    }

    #isRedWin() {
        return (
            this.#isBlueExplode() ||
            (this.props["redScore"] <= 100 &&
                this.props["redScore"] > this.props["blueScore"])
        );
    }

    #setScoreTextsVisibility(visible) {
        if (visible) {
            this.props["blueScoreText"].setVisible(true);
            this.props["redScoreText"].setVisible(true);
        } else {
            this.props["blueScoreText"].setVisible(false);
            this.props["redScoreText"].setVisible(false);
        }
    }

    // States
    initialState() {
        this.props["blueScore"] = 0;
        this.props["redScore"] = 0;

        this.props["blueStopped"] = false;
        this.props["redStopped"] = false;

        this.props["tubes"].setVisible(true);
        this.props["blueDestroyed"].setVisible(false);
        this.props["redDestroyed"].setVisible(false);

        this.props["blueScoreText"].setColor("#306141");
        this.props["blueScoreText"].setFontSize(35);
        this.props["blueScoreText"].setText(0);

        this.props["redScoreText"].setColor("#306141");
        this.props["redScoreText"].setFontSize(35);
        this.props["redScoreText"].setText(0);

        this.props["blueWinsText"].setVisible(false);
        this.props["redWinsText"].setVisible(false);
        this.props["tieText"].setVisible(false);

        this.props["restartButton"].setVisible(false);

        this.#setScoreTextsVisibility(true);

        this.blueState();
    }

    blueState() {
        if (this.#isBlueStopped()) {
            this.blueStoppedState();
        } else {
            this.#showButtons();
        }
    }

    incrementBlueState() {
        this.#hideButtons();
        this.#pump("blue");
    }

    blueStoppedState() {
        this.#hideButtons();
        this.#stopBlue();
        this.#isGameOver() ? this.gameOverState() : this.redState();
    }

    redState() {
        this.#hideButtons();
        if (this.#takeRisk() && !this.#isRedStopped()) {
            this.incrementRedState();
        } else {
            this.redStoppedState();
        }
    }

    incrementRedState() {
        this.#hideButtons();
        this.#pump("red");
    }

    redStoppedState() {
        this.#hideButtons();
        this.#stopRed();
        this.#isGameOver() ? this.gameOverState() : this.blueState();
    }

    gameOverState() {
        this.#setScoreTextsVisibility(false);
        if (this.#isBlueWin()) {
            this.blueWinsState();
        } else if (this.#isRedWin()) {
            this.redWinsState();
        } else {
            this.tieState();
        }
    }

    blueWinsState() {
        this.props["blueWinsText"].setVisible(true);
        this.props["restartButton"].setVisible(true);
    }

    redWinsState() {
        this.props["redWinsText"].setVisible(true);
        this.props["restartButton"].setVisible(true);
    }

    tieState() {
        this.props["tieText"].setVisible(true);
        this.props["restartButton"].setVisible(true);
    }
}

export default GameState;
