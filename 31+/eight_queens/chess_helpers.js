var textureBlack = PIXI.Texture.fromImage("imgs/block_black.jpg");
var textureWhite = PIXI.Texture.fromImage("imgs/block_white.jpg");
var textureQueen = PIXI.Texture.fromImage("imgs/queen.png");

Field = function (stage, xPos, yPos, xIndex, yIndex,  isWhite) {
    this.sprite = null;
    this.isVisited = false;
    this.isWhite = isWhite;
    this.boardIndexX = xIndex;
    this.boardIndexY = yIndex;

    if (this.isWhite) {
        this.sprite = new PIXI.Sprite(textureWhite);
    } else {
        this.sprite = new PIXI.Sprite(textureBlack);
    }

    this.sprite.position.x = xPos;
    this.sprite.position.y = yPos;
    this.sprite.anchor.x = 0.5;
    this.sprite.anchor.y = 0.5;

    stage.addChild(this.sprite);
};
Field.prototype.bindWith=function(draggableObject){
    //this.sprite.alpha=0.1;
    if(draggableObject.block!=null){
        draggableObject.block.swapColor();
        draggableObject.block.resident=null;
    }
    draggableObject.block=this;
    draggableObject.rotate(!this.isWhite);
};

Draggable=function(stage,x,y){
    this.sprite = new PIXI.Sprite(textureQueen);
    this.value=0;
    this.socket=null;
    this.isDropped=false;
    this.startingPoint = new PIXI.Point(x,y);
    this.field = null;

    var self=this;
    var lastClick=0;
    var doubleClickTime=500;
    this.isDoubleClicked=false;

    this.sprite.interactive = true;
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
        this.alpha = 1;
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
    };

    // set the callbacks for when the mouse or a touch moves
    this.sprite.mousemove = this.sprite.touchmove = function(data)
    {
        if(this.dragging)
        {
            var newPosition = this.data.getLocalPosition(this.parent);
            this.position.x = newPosition.x;
            this.position.y = newPosition.y;
        }
    };

    // move the sprite to its designated position
    this.sprite.position.x = x;
    this.sprite.position.y = y;

    // add it to the stage
    stage.addChild(this.sprite);
};
Draggable.prototype.update=function(){
    this.isDoubleClicked=false;
};

//either on block or not
Draggable.prototype.dropOn=function(field){
    this.isDropped=false;
    if(field!=null){
        this.sprite.position.x=field.sprite.position.x;
        this.sprite.position.y=field.sprite.position.y;
        this.field=field;
    }else{
        this.sprite.position.x=this.startingPoint.x;
        this.sprite.position.y=this.startingPoint.y;
        this.field=null;
    }

    return false;
};