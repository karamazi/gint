var textureCell = PIXI.Texture.fromImage("imgs/socket.png");
var textureCellDisabled = PIXI.Texture.fromImage("imgs/socket_disabled.png");
var textureHead = PIXI.Texture.fromImage("imgs/ball.png");

var textureMiniButton = PIXI.Texture.fromImage("imgs/miniButton.png");
var textureMiniButtonOver = PIXI.Texture.fromImage("imgs/miniButtonOver.png");
var textureMiniButtonDown = PIXI.Texture.fromImage("imgs/miniButtonDown.png");
var defaultAnchor = new PIXI.Point(0.5, 0.5);
var possibleStates = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "#"];
var possibleValues = ["0", "1","E","#"];
var possibleActions = ["0", "1", "E", "N", "#"];
var possibleDirections = ["L", "R", "N"];

Cell = function (stage, x, y, value) {
    var self = this;
    this.stage = stage;
    
    this.isClicked = false;
    this.sprite = new PIXI.Sprite(textureCell);
    this.sprite.anchor = defaultAnchor;
    this.sprite.position.x = x;
    this.sprite.position.y = y;
    this.sprite.interactive = true;
    this.sprite.buttonMode = true;

    this.sprite.click = function (data) {
        self.isClicked = true;
    }
    this.stage.addChild(this.sprite);

    this.value = value;
    this.text = new Text(stage, x, y, value);
    this.text.text.anchor = defaultAnchor;


}
Cell.prototype.update = function () {
    this.isClicked = false;
}

Cell.prototype.swapValue = function (value) {
    if (value == undefined) {
        var ind = possibleValues.indexOf(this.value);
        var newInd = (ind + 1) % possibleValues.length;
        value = possibleValues[newInd];
    }
        //value = this.value == "1" ? "0" : this.value=="0"?"E":this.value=="E"?"H":"1";

    this.value = value;
    this.text.text.setText(value);
}
Cell.prototype.foreverHalt = function () {
    this.swapValue("#");
    this.enable(false);
}
Cell.prototype.enable = function (enable) {
    this.sprite.interactive = enable;
    this.sprite.buttonMode = enable;
    if (enable)
        this.sprite.setTexture(textureCell);
    else
        this.sprite.setTexture(textureCellDisabled);
}
var STATE = 0;
var READ = 1;
var WRITE = 2;
var MOVE = 3;
var NEWSTATE = 4;
Head = function (stage, x, y, state) {
    this.stage = stage;
    this.state = state;
    this.dx = 0;
    this.tapeInitalPos = 1;
    this.tapePosition = 1;
    this.rules = [];
    this.tape = [];
    this.sprite = new PIXI.Sprite(textureHead);
    this.sprite.anchor = defaultAnchor;
    this.initialPosition=new PIXI.Point(x,y);
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
Head.prototype.setTape = function (tape) {
    this.tape = tape;
}
Head.prototype.reset = function () {
    this.tapePosition = this.tapeInitalPos;
    this.sprite.position.x = this.initialPosition.x;
    this.sprite.position.y = this.initialPosition.y;
    this.text.text.position.x = this.initialPosition.x;
    this.text.text.position.y = this.initialPosition.y;
    this.setState("A");
}
//przesuwa głowice o dx;
//xdir [-1,1]
Head.prototype.move = function (x_dir) {
    this.sprite.position.x += this.dx * x_dir;
    this.text.text.position.x += this.dx * x_dir;
}

Head.prototype.setInitalPos = function (x, y, ind) {
    this.initialPosition = new PIXI.Point(x, y);
    this.sprite.position.x = x;
    this.sprite.position.y = y;
    this.text.text.position.x = x;
    this.text.text.position.y = y;
    this.tapePosition = this.tapeInitalPos = ind;
}
//wykonuje jedną instrukcję na obecnym elemencie tasmy
//zwraca true jesli element to H(alt)
Head.prototype.step = function () {
    var cell = tape[this.tapePosition];
    if (cell.value == "#" || this.state=="#") {
        return true;
    }

    for (var i = 0; i < this.rules.length; i++) {
        if (this.rules[i][STATE]==this.state && this.rules[i][READ]==cell.value){
            var instruction = this.rules[i];
            if(instruction[WRITE]!="N")
                cell.swapValue(instruction[WRITE]);

            var moveDirection=1;
            if (instruction[MOVE] == "L")
                moveDirection = -1;
            this.move(moveDirection);
            this.tapePosition += moveDirection;

            this.setState(instruction[NEWSTATE]);
            return false;
        }
    }
    return true;
}

//parsuje instrukcje. 
//jesli wszystkie są ok, ustawia je
//zwraca stan walidacji 1 - ok, 0 - empty, -1 - błąd
//podane instrukcje muszą byc w uppercase
Head.prototype.parseRules = function (rawRules) {
    var outRules = [];
    var validationResults = [];
    var allValid = true;

    for (var i = 0; i < rawRules.length; i++) {
        
        //jesli to pusty string
        if (!rawRules[i]) {
            validationResults.push(0);
            continue;
        }

        //sprwawdzamy kazdy zestaw instrukcji
        var oneValid = true;
        var parsedRule=[];

        var instructions = rawRules[i].split(",");
        if (instructions.length != 5) {
            oneValid = false;
        } else {
            var state = instructions[STATE];
            var read = instructions[READ];
            var write = instructions[WRITE];
            var move = instructions[MOVE];
            var newState = instructions[NEWSTATE];

            oneValid &= inArray(state, possibleStates);
            oneValid &= inArray(read, possibleValues);
            oneValid &= inArray(write, possibleActions);
            oneValid &= inArray(move, possibleDirections)
            oneValid &= inArray(newState, possibleStates);

            parsedRule.push(state);
            parsedRule.push(read);
            parsedRule.push(write);
            parsedRule.push(move);
            parsedRule.push(newState);
        }
 
        if (oneValid) {
            outRules.push(parsedRule);
            validationResults.push(1);
        } else {
            validationResults.push(-1);
        }

        allValid &= oneValid;
        
    }
    if (allValid)
        this.setRules(outRules);

    return validationResults;
}
HeadButton = function (stage, x, y) {
    var self = this;
    this.isClicked = false;
    this.sprite = new PIXI.Sprite(textureHead);
    this.sprite.anchor = defaultAnchor;
    this.sprite.position.x = x;
    this.sprite.position.y = y;
    this.sprite.interactive = true;
    this.sprite.buttonMode = true;

    this.sprite.click = function (data) {
        self.isClicked = true;
    }

    stage.addChild(this.sprite);
}
HeadButton.prototype.update = function () {
    this.isClicked = false;
}

function inArray(needle, haystack) {
    var length = haystack.length;
    for (var i = 0; i < length; i++) {
        if (haystack[i] == needle) return true;
    }
    return false;
}

MiniButton = function (stage, x, y, text) {
    this.sprite = new PIXI.Sprite(textureMiniButton);
    this.text = new PIXI.Text(text, { font: "bold 20px Comic Sans MS", fill: "#ffffcc", align: "left" });
    this.isClicked = false;
    var self = this;
    this.sprite.buttonMode = true;

    this.sprite.position.x = x;
    this.sprite.position.y = y;
    this.sprite.anchor.x = 0.5;
    this.sprite.anchor.y = 0.5;

    this.text.position = this.sprite.position;
    this.text.anchor = this.sprite.anchor;

    // make the button interactive..
    this.sprite.interactive = true;

    // set the mousedown and touchstart callback..
    this.sprite.mousedown = this.sprite.touchstart = function (data) {

        this.isdown = true;
        this.setTexture(textureMiniButtonDown);
        this.alpha = 1;
    }

    // set the mouseup and touchend callback..
    this.sprite.mouseup = this.sprite.touchend = this.sprite.mouseupoutside = this.sprite.touchendoutside = function (data) {
        this.isdown = false;

        if (this.isOver) {
            this.setTexture(textureMiniButtonOver);
        }
        else {
            this.setTexture(textureMiniButton);
        }
    }

    // set the mouseover callback..
    this.sprite.mouseover = function (data) {

        this.isOver = true;

        if (this.isdown) return

        this.setTexture(textureMiniButtonOver)
    }

    // set the mouseout callback..
    this.sprite.mouseout = function (data) {

        this.isOver = false;

        if (this.isdown) return
        this.setTexture(textureMiniButton)
    }

    this.sprite.click = this.sprite.tap = function (data) {
        self.isClicked = true;
    }

    stage.addChild(this.sprite);
    stage.addChild(this.text);
}
MiniButton.prototype.update = function () {
    this.isClicked = false;
}