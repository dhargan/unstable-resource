function loadFont() {
    var newFont = new FontFace(
        "arcadeclassic",
        `url("./assets/fonts/ARCADECLASSIC.TTF")`
    );
    newFont
        .load()
        .then(function (loaded) {
            document.fonts.add(loaded);
        })
        .catch(function (error) {
            return error;
        });
}
