var textureButton = PIXI.Texture.fromImage("imgs/button.png");
var textureButtonDown = PIXI.Texture.fromImage("imgs/buttonDown.png");
var textureButtonOver = PIXI.Texture.fromImage("imgs/buttonOver.png");
var textureDraggable = PIXI.Texture.fromImage("imgs/ball2.png");
var textureSocket = PIXI.Texture.fromImage("imgs/socket.jpg");
var textureSocketOver = PIXI.Texture.fromImage("imgs/socketOver.jpg");
var textureHelp = PIXI.Texture.fromImage("imgs/help.png");
var textureError = PIXI.Texture.fromImage("imgs/blink.png");
var textureBackground = PIXI.Texture.fromImage("imgs/background.png");

var centeredAnchor=new PIXI.Point(0.5,0.5);

var textureSwitch = PIXI.Texture.fromImage("imgs/switch.jpg");
var textureSwitchDown = PIXI.Texture.fromImage("imgs/switchDown.jpg");
var textureSwitchOver = PIXI.Texture.fromImage("imgs/switchOver.jpg");
var texuteSwitchDownOver = PIXI.Texture.fromImage("imgs/switchDownOver.jpg");

var msgEnum = Object.freeze({"Ok":1, "Error":2, "Info":3, "Special":4})
var swapEnum = Object.freeze({"FadeIn_toTemp":0, "FadeOut_toTemp":1, "FadeIn_toOne":2, "FadeOut_toOne":3, "FadeIn_fromTemp":4, "FadeOut_fromTemp":5})

//PIXI.Sprite.prototype.spriteMetod=function(){};
Button=function(stage,x,y,text){
	this.sprite = new PIXI.Sprite(textureButton);
	this.text = new PIXI.Text(text,{font: "bold 25px Comic Sans MS", fill: "#ffffcc", align: "left"});
	this.isClicked=false;
	var self=this;
	this.sprite.buttonMode = true;

	this.sprite.position.x = x;
	this.sprite.position.y = y;
	this.sprite.anchor=centeredAnchor;

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
//Button.prototype=Object.create(PIXI.Sprite.prototype)
//Button.prototype.constructor=Button
//Button.prototype.buttonMethod=function(){};

Draggable=function(stage,x,y){
	// create our little bunny friend..
	this.sprite = new PIXI.Sprite(textureDraggable);
	this.value=0;
	this.text=new PIXI.Text("",{font: "bold 25px Comic Sans MS", fill: "#ffffcc", align: "left"});
	//true jesli wlasnie zostalo opuszczone
	this.socket=null;
	this.isDropped=false;
	this.startingPoint = new PIXI.Point();

	//co to kurwa ma byc zeby nie mozna sie bylo po prostu odwołać do zakresu wyzej
	var self=this;
	var lastClick=0;
	var doubleClickTime=500;
	this.isDoubleClicked=false;

	// enable the bunny to be interactive.. this will allow it to respond to mouse and touch events
	this.sprite.interactive = true;
	// this button mode will mean the hand cursor appears when you rollover the bunny with your mouse
	this.sprite.buttonMode = true;

	this.sprite.anchor=centeredAnchor;


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
		
		//if(!this.dragging){
			self.startingPoint.x = self.sprite.position.x;
			self.startingPoint.y = self.sprite.position.y;
		//}
			
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
Draggable.prototype.dropTo=function(sockets){
		this.isDropped=false;
		var x=this.sprite.position.x;
		var y=this.sprite.position.y;
		for(var i=0;i<sockets.length;i++){
			if(sockets[i].plug==null && sockets[i].sprite.getBounds().contains(x,y)){
				this.bindWith(sockets[i])	
				return true;
			}
		}

		if(this.socket!=null){
			this.bindWith(this.socket);
		}else{
			var s_x=this.startingPoint.x;
			var s_y=this.startingPoint.y;
			this.sprite.position.x=s_x;
			this.sprite.position.y=s_y;
		}

		
		return false;
}
Draggable.prototype.bindWith=function(socket){
	if(socket!=null){
		if(this.socket!=null){
			this.socket.plug=null;			
		}
		this.socket=socket;
		this.socket.plug=this;
		this.sprite.position.x=socket.sprite.position.x;
		this.sprite.position.y=socket.sprite.position.y;	
	}else{
		this.socket.plug=null;
		this.socket=null;
	}
}
Draggable.prototype.setValue=function(value){
	this.value=value;
	this.text.setText(value);
}
Draggable.prototype.update=function(){
	this.isDoubleClicked=false;
}

Socket = function(stage, x, y){
	this.sprite = new PIXI.Sprite(textureSocket);
	this.plug=null;

	this.sprite.anchor=centeredAnchor;
	this.sprite.position.x=x;
	this.sprite.position.y=y;



	this.sprite.interactive = true;
	// set the mouseover callback..
	this.sprite.mouseover = function(data){
		this.setTexture(textureSocketOver)
	}

	// set the mouseout callback..
	this.sprite.mouseout = function(data){
		this.setTexture(textureSocket)
	}

	stage.addChild(this.sprite);
}

UIText = function(stage){
	this.msgText = new PIXI.Text("a",{font: "bold 20px Arial", fill: "#ffffff", align: "left"});
	this.msgTimeInit=0;
	this.msgTimePassedMs=0;
	this.msgTimeDurationMs=30000;

	this.msgText.position.x=320;
	this.msgText.position.y=50;
	this.msgText.anchor=centeredAnchor;
	stage.addChild(this.msgText);


	this.initTime = new Date().getTime();
	this.seconds = 0;
	this.penalty = 0;
	this.timeDisplay = new PIXI.Text("a",{font: "bold 20px Arial", fill: "#5566aa", align: "left"});
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

//bubble sort min>max
function bubbleSort(values){
	var array=values.slice();
	var iterations=[array.toString()];

	var isSorted=false;
	while(!isSorted){
		isSorted=true;
		for(var i=0;i<array.length-1;i++){
			if(array[i]>array[i+1]){
				isSorted=false;
				var tmp=array[i];
				array[i]=array[i+1];
				array[i+1]=tmp;

				var packed=array.toString();
				iterations.push(packed);
				console.log(packed);
			}
		}
	}
	return iterations;
}



