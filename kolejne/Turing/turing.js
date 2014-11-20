var textureCell = PIXI.Texture.fromImage("imgs/socket.jpg");
var textureHead = PIXI.Texture.fromImage("imgs/ball.png");
var defaultAnchor = new PIXI.Point(0.5, 0.5);
var possibleStates = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J"];
var possibleValues = ["0", "1"];
var possibleActions = ["0", "1", "E", "H"];
var posibleDirections = ["L", "R"];

Cell = function (stage,x,y,value) {
    this.stage = stage;
    
    this.sprite = new PIXI.Sprite(textureCell);
    this.sprite.anchor = defaultAnchor;
    this.sprite.position.x = x;
    this.sprite.position.y = y;
    this.stage.addChild(this.sprite);

    this.value = value;
    this.text = new Text(stage, x, y, value);
    this.text.text.anchor = defaultAnchor;
}
Head = function (stage, x, y, state) {
    this.stage = stage;
    this.state = state;
    this.dx = 0;
    this.rules = [];

    this.sprite = new PIXI.Sprite(textureHead);
    this.sprite.anchor = defaultAnchor;
    this.sprite.position.x = x;
    this.sprite.position.y = y;
    this.stage.addChild(this.sprite);

    
    this.text = new Text(stage, x, y, state);
    this.text.text.anchor = defaultAnchor;
}

Head.prototype.setState=function(state){
    this.state = state;
    this.text.text.setText(state);
}
//ustawia zasady dla maszyny turinga w postaci tablicy tablic
//kazda zasada jest w postaci [stan, znak, akcja, ruch, nowy_stan]
Head.prototype.setRules = function (rules) {
    this.rules = rules;
}

Head.prototype.parseRules = function (rawRules) {
    var outRules = [];
    for (var i = 0; i < rawRules; i++) {

    }
}

function inArray(needle, haystack) {
    var length = haystack.length;
    for (var i = 0; i < length; i++) {
        if (haystack[i] == needle) return true;
    }
    return false;
}