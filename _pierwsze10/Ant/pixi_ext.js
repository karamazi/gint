//21:10-22:10
var textureButton = PIXI.Texture.fromImage("imgs/button.png");
var textureButtonDown = PIXI.Texture.fromImage("imgs/buttonDown.png");
var textureButtonOver = PIXI.Texture.fromImage("imgs/buttonOver.png");

var textureHelp = PIXI.Texture.fromImage("imgs/help.png");
var textureBackground = PIXI.Texture.fromImage("imgs/background.png");

var textureBlack = PIXI.Texture.fromImage("imgs/block_black.jpg");
var textureWhite = PIXI.Texture.fromImage("imgs/block_white.jpg");
var textureAnt = PIXI.Texture.fromImage("imgs/ant.png");

var texturePortalIn=PIXI.Texture.fromImage("imgs/portal_in.png");
var texturePortalOut=PIXI.Texture.fromImage("imgs/portal_out.png");

var textureDraggable = PIXI.Texture.fromImage("imgs/finish.png");

var textureSwitch = PIXI.Texture.fromImage("imgs/switch.jpg");
var textureSwitchDown = PIXI.Texture.fromImage("imgs/switchDown.jpg");
var textureSwitchOver = PIXI.Texture.fromImage("imgs/switchOver.jpg");
var texuteSwitchDownOver = PIXI.Texture.fromImage("imgs/switchDownOver.jpg");

var centeredAnchor = new PIXI.Point(0.5,0.5);
var msgEnum = Object.freeze({"Ok":1, "Error":2, "Info":3, "Special":4})

var episodeEnum = Object.freeze({"SetGolden":0, "Divide":1, "FindGolden":2,"Finished":3})



//PIXI.Sprite.prototype.spriteMetod=function(){};
Button=function(stage,x,y,text){
	this.sprite = new PIXI.Sprite(textureButton);
	this.text = new PIXI.Text(text,{font: "bold 25px Comic Sans MS", fill: "#ffffcc", align: "left"});
	this.isClicked=false;
	var self=this;

	this.sprite.buttonMode = true;
	this.sprite.interactive = true;

	this.sprite.position.x = x;
	this.sprite.position.y = y;
	this.sprite.anchor.x=0.5;
	this.sprite.anchor.y=0.5;

	this.text.position=this.sprite.position;
	this.text.anchor=this.sprite.anchor;

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
Switch=function(stage,x,y){
	this.sprite=new PIXI.Sprite(textureSwitch);
	this.sprite.position.x=x;
	this.sprite.position.y=y;
	this.sprite.anchor=centeredAnchor;
	this.isClicked=false;
	var self=this;

	this.sprite.buttonMode = true;
	this.sprite.interactive = true;

	this.sprite.mouseup = this.sprite.touchend = this.sprite.mouseupoutside = this.sprite.touchendoutside = function(data){
		this.isdown = false;

		if(this.isOver)
		{
			//to sie wydaje glupie ale najpierw idzie ten event a potem click
			if(!self.isClicked)
				this.setTexture(texuteSwitchDownOver);
			else
				this.setTexture(textureSwitchOver);
		}
		else
		{
			if(!self.isClicked)
				this.setTexture(textureSwitchDown);
			else
				this.setTexture(textureSwitch);
		}
	}

	this.sprite.mousedown = this.sprite.touchstart = function(data){
		this.isdown = true;
		this.setTexture(textureSwitchDown);
		this.alpha = 1;
	}
	this.sprite.mouseover = function(data){
		this.isOver = true;
		if(this.isdown)return
		if(self.	isClicked)
				this.setTexture(texuteSwitchDownOver);
			else
				this.setTexture(textureSwitchOver);
	}

	// set the mouseout callback..
	this.sprite.mouseout = function(data){
		this.isOver = false;
		if(this.isdown)return

		if(self.isClicked)
			this.setTexture(textureSwitchDown)
		else 
			this.setTexture(textureSwitch)
	}

	this.sprite.click = this.sprite.tap = function(data){
		self.isClicked=!self.isClicked;
	}
	stage.addChild(this.sprite);
}
Switch.prototype.deactivate=function(){
	this.isClicked=false;
	this.sprite.setTexture(textureSwitch);
}
Draggable=function(stage,x,y){
	// create our little bunny friend..
	this.sprite = new PIXI.Sprite(textureDraggable);
	this.value=0;
	this.text=new PIXI.Text("",{font: "bold 25px Comic Sans MS", fill: "#ffffcc", align: "left"});
	//true jesli wlasnie zostalo opuszczone
	this.socket=null;
	this.isDropped=false;
	this.startingPoint = new PIXI.Point(x,y);

	//co to kurwa ma byc zeby nie mozna sie bylo po prostu odwołać do zakresu wyzej
	var self=this;
	var lastClick=0;
	var doubleClickTime=500;
	this.isDoubleClicked=false;

	// enable the bunny to be interactive.. this will allow it to respond to mouse and touch events
	this.sprite.interactive = true;
	// this button mode will mean the hand cursor appears when you rollover the bunny with your mouse
	this.sprite.buttonMode = true;

	this.sprite.anchor.x=0.5;
	this.sprite.anchor.y=0.5;


	// use the mousedown and touchstart
	this.sprite.mousedown = this.sprite.touchstart = function(data)
	{
		// stop the default event...
		data.originalEvent.preventDefault();

		// store a reference to the data
		// The reason for this is because of multitouch
		// we want to track the movement of this particular touch
		this.data = data;
		this.alpha = 0.9;
			
		this.dragging = true;
	};

	// set the events for when the mouse is released or a touch is released
	this.sprite.mouseup = this.sprite.mouseupoutside = this.sprite.touchend = this.sprite.touchendoutside = function(data)
	{
		this.alpha = 1
		this.dragging = false;
		// set the interaction data to null
		this.data = null;
	};
	this.sprite.click=this.sprite.tap=function(data){
		self.isDropped = true;
		self.isDoubleClicked=false;	

		var now=Date.now();
		var diff=now-lastClick;
		if(lastClick && diff<doubleClickTime){
			lastClick=0;
			self.isDoubleClicked=true;
			//self.bindWith(freeSocket);
		}else{
			lastClick=now;
		}
	}

	// set the callbacks for when the mouse or a touch moves
	this.sprite.mousemove = this.sprite.touchmove = function(data)
	{
		if(this.dragging)
		{
			var newPosition = this.data.getLocalPosition(this.parent);
			this.position.x = newPosition.x;
			this.position.y = newPosition.y;
		}
	}

	// move the sprite to its designated position
	this.sprite.position.x = x;
	this.sprite.position.y = y;
	this.text.position = this.sprite.position;
	this.text.anchor = this.sprite.anchor;

	// add it to the stage
	stage.addChild(this.sprite);
	stage.addChild(this.text);
}
Draggable.prototype.update=function(){
	this.isDoubleClicked=false;
}
//either on block or not
Draggable.prototype.dropOn=function(block){
		this.isDropped=false;
		if(block!=null){
			this.sprite.position.x=block.sprite.position.x;
			this.sprite.position.y=block.sprite.position.y;			
		}else{
			this.sprite.position.x=this.startingPoint.x;
			this.sprite.position.y=this.startingPoint.y;
		}
		
		return false;
}

Movable=function(stage,x,y){
	this.sprite = new PIXI.Sprite(textureAnt);
	this.text=new PIXI.Text("",{font: "bold 25px Comic Sans MS", fill: "#ffffcc", align: "left"});
	this.isClicked=false;
	this.block=null;
	this.movX=0;
	this.movY=-1;

	var self=this;

	this.isMoving=false;
	this.movVect=null;
	this.movProgressVect=null;
	this.stepVect=null;

	this.sprite.interactive=true;
	this.sprite.buttonMode=true;

	this.sprite.position.x=x;
	this.sprite.position.y=y;
	this.sprite.anchor.x=0.5;
	this.sprite.anchor.y=0.5;
	this.text.position=this.sprite.position;
	this.text.anchor=this.sprite.anchor;

	this.sprite.click=this.sprite.tap=function(data){
		self.isClicked=true;
		console.log("derp");
	}

	stage.addChild(this.sprite);
	stage.addChild(this.text);
}
Movable.prototype.rotate=function(rotateRight){
	if(rotateRight){
		this.sprite.rotation+=Math.PI/2;
		var tmp=this.movX;
		this.movX=-this.movY;
		this.movY=tmp;
	}else{
		this.sprite.rotation-=Math.PI/2;
		var tmp=this.movX;
		this.movX=this.movY;
		this.movY=-tmp
	}
}
Movable.prototype.moveBy=function(x,y){
	this.isMoving=true;
	this.movVect=new PIXI.Point(x,y);
	this.stepVect=new PIXI.Point(x/20,y/20);
	this.movProgressVect=new PIXI.Point(0,0);
	this.sprite.interactive=false;
	this.sprite.buttonMode=false;
}
//do poruszania się w pionie LUB poziomie, zaleznie od kierunku
Movable.prototype.moveXY=function(distance){
	this.moveBy(this.movX*distance,this.movY*distance);
}

Movable.prototype.update=function(){
	this.isClicked=false;
	if(this.isMoving){
		this.sprite.position.x+=this.stepVect.x;
		this.sprite.position.y+=this.stepVect.y;
		this.movProgressVect.x+=this.stepVect.x;
		this.movProgressVect.y+=this.stepVect.y;
		if(Math.abs(this.movProgressVect.x)>=Math.abs(this.movVect.x) 
			&& Math.abs(this.movProgressVect.y)>=Math.abs(this.movVect.y)){
			this.isMoving=false;
			this.sprite.interactive=true;
			this.sprite.buttonMode=true;
		}
	}
}
Movable.prototype.reset=function(x,y){
	this.sprite.position.x=x;
	this.sprite.position.y=y;
}

Block=function(stage,x,y,isWhite){
	this.sprite=null;
	this.resident=null;

	if(isWhite){
		this.sprite = new PIXI.Sprite(textureWhite);
	}else{
		this.sprite = new PIXI.Sprite(textureBlack);
	}


	this.sprite.position.x=x;
	this.sprite.position.y=y;
	this.sprite.anchor.x=0.5;
	this.sprite.anchor.y=0.5;
	this.isWhite=isWhite;

	stage.addChild(this.sprite);
}

Block.prototype.bindWith=function(object){
	//this.sprite.alpha=0.1;
	if(object.block!=null){
		object.block.swapColor();
		object.block.resident=null;
	}
	object.block=this;
	this.resident=object;
	object.rotate(!this.isWhite);
}
Block.prototype.swapColor=function(){
	this.isWhite=!this.isWhite;
	if(this.isWhite){
		this.sprite.setTexture(textureWhite);
	}else{
		this.sprite.setTexture(textureBlack);
	}
}

UIText = function(stage){
	this.msgText = new PIXI.Text("",{font: "bold 20px Arial", fill: "#ffffff", align: "left"});
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
	this.timeDisplay = new PIXI.Text("",{font: "bold 20px Arial", fill: "#5566aa", align: "left"});
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


