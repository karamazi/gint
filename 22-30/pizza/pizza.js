Piece = function (stage) {
    var self = this;
    this.graphics = new PIXI.Graphics();
    this.stage = stage;
    this.isClicked = false;
    

    this.graphics.click = function (data) {
        self.isClicked = true;
    }
    stage.addChild(this.graphics);
}
Piece.prototype.update = function () {
    this.isClicked = false;
}