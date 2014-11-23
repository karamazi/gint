var textureWhite = PIXI.Texture.fromImage("imgs/block_white_10.jpg");
var textureBlack = PIXI.Texture.fromImage("imgs/block_black_10.jpg");

Block = function (stage, x, y, isAlive) {
    this.stage = stage;
    this.isAlive = isAlive;
    this.isClicked = false;

    if (isAlive) {
        this.sprite = new PIXI.Sprite(textureWhite);
    } else {
        this.sprite = new PIXI.Sprite(textureBlack);
    }
    this.sprite.position.x = x;
    this.sprite.position.y = y;
    this.sprite.interactive = true;
    this.stage.addChild(this.sprite);

    this.sprite.click = function (data) {
        self.isClicked = true;
    }
}
Block.prototype.update = function () {
    this.isClicked = false;
}
Block.prototype.setLife=function(isAlive){
    if (isAlive) {
        this.sprite.setTexture(textureWhite);
    } else {
        this.sprite.setTexture(textureBlack);
    }
    this.isAlive = isAlive;
}