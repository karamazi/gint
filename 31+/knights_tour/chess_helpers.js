var textureBlack = PIXI.Texture.fromImage("imgs/block_black.jpg");
var textureWhite = PIXI.Texture.fromImage("imgs/block_white.jpg");
var textureHorse = PIXI.Texture.fromImage("imgs/horse2.png");
var textureCross = PIXI.Texture.fromImage("imgs/cross.png");

var possibleMovesTextStyle = { font: "bold 25px Comic Sans MS", fill: "#00aa00", align: "left" };
Field = function (stage, xPos, yPos, isWhite) {
    this.sprite = null;
    this.isVisited = false;
    this.isWhite = isWhite;
    if (this.isWhite) {
        this.sprite = new PIXI.Sprite(textureWhite);
    } else {
        this.sprite = new PIXI.Sprite(textureBlack);
    }

    this.sprite.position.x = xPos;
    this.sprite.position.y = yPos;
    this.sprite.anchor.x = 0.5;
    this.sprite.anchor.y = 0.5;
    this.possibleMoves = 0;

    this.cross = new PIXI.Sprite(textureCross);
    this.cross.position = this.sprite.position;
    this.cross.anchor = this.sprite.anchor;
    this.cross.visible = false;

    this.text = new PIXI.Text("", possibleMovesTextStyle);
    this.text.position = this.sprite.position;
    this.text.anchor = this.sprite.anchor;

    stage.addChild(this.sprite);
    stage.addChild(this.cross);
    stage.addChild(this.text);




};
Field.prototype.setPossibleMoves = function(moves){
    this.possibleMoves = moves;
    this.text.setText(moves);
};
Field.prototype.clearPossibleMoves = function(){
    this.possibleMoves = 0;
    this.text.setText("");
};

Field.prototype.markAsVisited = function () {
    this.isVisited = true;
    this.cross.visible = true;
};
Field.prototype.reset = function () {
    this.isVisited = false;
    this.cross.visible = false;
    this.text.setText("");
};

Figure = function (stage, board, x, y) {
    this.sprite = new PIXI.Sprite(textureHorse);
    this.board = board;
    this.currentField = null;
    this.sprite.anchor.x = 0.5;
    this.sprite.anchor.y = 0.5;

    this.x = 0;
    this.y = 0;
    this.moveBy(x,y);

    stage.addChild(this.sprite);
};

Figure.prototype.moveBy = function (dx, dy) {
    if (this.currentField !== null)
        this.currentField.markAsVisited();
    this.x += dx;
    this.y += dy;
    this.currentField = this.board[this.y][this.x];
    this.sprite.position = this.board[this.y][this.x].sprite.position;
};
Figure.prototype.canMoveBy = function (dx, dy) {
    return (dx!=0 || dy!=0) &&
        this.x + dx >= 0 && this.x + dx < this.board.length &&
        this.y + dy >= 0 && this.y + dy < this.board[0].length &&
        !board[this.y + dy][this.x + dx].isVisited;
};