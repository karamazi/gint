var textureButton = PIXI.Texture.fromImage("imgs/button.png");
var textureButtonDown = PIXI.Texture.fromImage("imgs/buttonDown.png");
var textureButtonOver = PIXI.Texture.fromImage("imgs/buttonOver.png");

var textureBall = PIXI.Texture.fromImage("imgs/ball.png");
var textureBallGolden = PIXI.Texture.fromImage("imgs/ball_golden.png");
//var textureBallInactive = PIXI.Texture.fromImage("imgs/ball_inactive.png");

var textureHelp = PIXI.Texture.fromImage("imgs/help.png");
var textureBackground = PIXI.Texture.fromImage("imgs/background.png");

var msgEnum = Object.freeze({"Ok":1, "Error":2, "Info":3, "Special":4})

var episodeEnum = Object.freeze({"SetGolden":0, "Divide":1, "FindGolden":2,"Finished":3})

//CONSTANTS---------START
var textStyle = { font: "bold 25px Comic Sans MS", fill: "#ffffcc", align: "left" };
var smallTextFont = "bold 20px Arial";

var textFont = "bold 20px Comic Sans MS";
var textFill = "#ffffcc";
//CONSTANTS-----------END
DefaultText = function (stage, x, y,text) {
    this.text = new PIXI.Text(text, textStyle);
    this.text.position.x = x;
    this.text.position.y = y;
    stage.addChild(this.text);
}
DefaultText.prototype.remove = function (stage) {
    stage.removeChild(this.text);
}
DefaultText.prototype.setText = function (text) {
    this.text.setText(text);
}
//PIXI.Sprite.prototype.spriteMetod=function(){};
Button=function(stage,x,y,text){
	this.sprite = new PIXI.Sprite(textureButton);
	this.text = new PIXI.Text(text,{font: "bold 25px Comic Sans MS", fill: "#ffffcc", align: "left"});
	this.isClicked=false;
	var self=this;
	this.sprite.buttonMode = true;

	this.sprite.position.x = x;
	this.sprite.position.y = y;
	this.sprite.anchor.x=0.5;
	this.sprite.anchor.y=0.5;

	this.text.position=this.sprite.position;
	this.text.anchor=this.sprite.anchor;

	// make the button interactive..
	this.sprite.interactive = true;

	// set the mousedown and touchstart callback..
	this.sprite.mousedown = this.sprite.touchstart = function(data){

		this.isdown = true;
		this.setTexture(textureButtonDown);
		this.alpha = 1;
	}

	// set the mouseup and touchend callback..
	this.sprite.mouseup = this.sprite.touchend = this.sprite.mouseupoutside = this.sprite.touchendoutside = function(data){
		this.isdown = false;

		if(this.isOver)
		{
			this.setTexture(textureButtonOver);
		}
		else
		{
			this.setTexture(textureButton);
		}
	}

	// set the mouseover callback..
	this.sprite.mouseover = function(data){

		this.isOver = true;

		if(this.isdown)return

		this.setTexture(textureButtonOver)
	}

	// set the mouseout callback..
	this.sprite.mouseout = function(data){

		this.isOver = false;
		
		if(this.isdown)return
		this.setTexture(textureButton)
	}

	this.sprite.click = this.sprite.tap = function(data){
		self.isClicked=true;
	}

	stage.addChild(this.sprite);
	stage.addChild(this.text);
}
Button.prototype.update=function(){
	this.isClicked=false;
}

Ball = function () {
    var self = this;

    this.value = 0;
    this.sprite = new PIXI.Sprite(textureBall);
    this.text = new PIXI.Text(this.value, { font: textFont, fill: textFill, align: "left" });


    this.isClicked = false;
    this.isChanged = false;
    this.isInactive = false;

    this.slowDown = 50;
    this.isMoving = false;
    this.movVect = null;
    this.movProgressVect = null;
    this.stepVect = null;

    this.sprite.interactive = true;
    this.sprite.buttonMode = true;
    this.sprite.anchor.x = 0.5;
    this.sprite.anchor.y = 0.5;
    this.text.position = this.sprite.position;
    this.text.anchor = this.sprite.anchor;

    this.sprite.click = this.sprite.tap = function (data) {
        self.isClicked = true;
    }
}

Ball.prototype.setValue = function (val) {
    this.value = val;
    this.text.setText(val);
}
Ball.prototype.init = function (stage, x, y, value) {
    this.value = value;
    this.text.setText(value);
    this.sprite.position.x = x;
    this.sprite.position.y = y;
    stage.addChild(this.sprite);
    stage.addChild(this.text);
}

Ball.prototype.makeGolden = function () {
    this.isChanged = true;
    this.sprite.setTexture(textureBallGolden);
}
Ball.prototype.makeEmpty = function () {
    this.sprite.setTexture(textureBallEmpty);
    this.text.setText("");
}
Ball.prototype.makeInactive = function () {
    this.isInactive = true;
    this.text.alpha = 0.3;
    this.sprite.alpha = 0.3;
    //this.sprite.setTexture(textureBallInactive)
}
Ball.prototype.moveBy = function (x, y) {
    this.isMoving = true;
    this.movVect = new PIXI.Point(x, y);
    this.stepVect = new PIXI.Point(x / this.slowDown, y / this.slowDown);
    this.movProgressVect = new PIXI.Point(0, 0);
}
Ball.prototype.moveTo = function (x, y) {
    var direction = new PIXI.Point(x - this.sprite.x, y - this.sprite.y);
    this.moveBy(direction.x, direction.y);
    console.log("Moving #" + this.value + " by " + direction.x + " " + direction.y + " with slowdown " + this.slowDown);
}

Ball.prototype.update = function () {
    this.isClicked = false;
    if (this.isMoving) {
        this.sprite.position.x += this.stepVect.x;
        this.sprite.position.y += this.stepVect.y;
        this.movProgressVect.x += this.stepVect.x;
        this.movProgressVect.y += this.stepVect.y;
        if (Math.abs(this.movProgressVect.x) >= Math.abs(this.movVect.x)
			&& Math.abs(this.movProgressVect.y) >= Math.abs(this.movVect.y)) {
            this.isMoving = false;
        }
    }
}
Ball.prototype.reset = function (x, y, val) {
    this.sprite.position.x = x;
    this.sprite.position.y = y;
    this.isMoving = false;
    this.isChanged = false;
    this.setValue(val);
    this.isInactive = false;
    this.text.alpha = 1;
    this.sprite.alpha = 1;
    this.sprite.setTexture(textureBall);
}
Ball.prototype.setPosition = function (x, y) {
    var p = new PIXI.Point(x, y);
    this.sprite.position = p;
    this.text.position = p;
}
Ball.prototype.remove = function (stage) {
    stage.removeChild(this.sprite);
    stage.removeChild(this.text);
}


Leaf = function () {
    Ball.call(this);
    this.parent = null;
    this.left = null;
    this.right = null;
}
Leaf.prototype = Object.create(Ball.prototype);
Leaf.prototype.constructor = Leaf;

Leaf.prototype.clearNodes = function () {
    this.parent = null;
    this.left = null;
    this.right = null;
}



UIText = function(stage){
    this.msgText = new PIXI.Text("", { font: smallTextFont, fill: "#ffffff", align: "left" });
	this.msgTimeInit=0;
	this.msgTimePassedMs=0;
	this.msgTimeDurationMs=0;

	this.msgText.position.x=320;
	this.msgText.position.y=50;
	this.msgText.anchor.x=0.5;
	this.msgText.anchor.y=0.5;
	stage.addChild(this.msgText);


	this.initTime = new Date().getTime();
	this.seconds = 0;
	this.timeDisplay = new PIXI.Text("", { font: smallTextFont, fill: "#5566aa", align: "left" });
	this.timeDisplay.position.x=5;
	this.timeDisplay.position.y=5;
	stage.addChild(this.timeDisplay);
}
UIText.prototype.clear=function(){
	this.initTime=Date.now();
}
UIText.prototype.update=function(){
	var time=new Date().getTime();
	this.seconds=Math.floor((time-this.initTime)/1000);
	this.timeDisplay.setText("Time: "+(this.seconds+this.penalty));

	if(this.msgTimePassedMs<this.msgTimeDurationMs){
		this.msgTimePassedMs+=time-this.msgTimeInit;
		if(this.msgTimePassedMs>=this.msgTimeDurationMs){
			this.msgText.setText("");
		}
	}

}
UIText.prototype.displayMsg=function(msg,type){
	this.msgText.setText(msg);
	if(type==msgEnum.Ok){
		this.msgText.setStyle({fill: "#00ff00"});
	}else if(type==msgEnum.Info){
		this.msgText.setStyle({fill: "#ffffff"});
	}else if(type==msgEnum.Error){
		this.msgText.setStyle({fill: "#ff0000"});
	}else if(type==msgEnum.Special){
		this.msgText.setStyle({fill: "#ff00ff"});
	}

	this.msgTimePassedMs=0;
	this.msgTimeInit=new Date().getTime();
}


