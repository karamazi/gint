var textureHelp = PIXI.Texture.fromImage("imgs/help.png");
var textureBackground = PIXI.Texture.fromImage("imgs/background.png");

var textureButton = PIXI.Texture.fromImage("imgs/button.png");
var textureButtonDown = PIXI.Texture.fromImage("imgs/buttonDown.png");
var textureButtonOver = PIXI.Texture.fromImage("imgs/buttonOver.png");

var textFont = "bold 25px Comic Sans MS";
var textFill = "#ffffcc";
Button=function(stage,x,y,text){
	this.sprite = new PIXI.Sprite(textureButton);
	this.text = new PIXI.Text(text, { font: textFont, fill: textFill, align: "left" });
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
Button.prototype.setActive=function(active){
	this.sprite.buttonMode = active;
	this.sprite.interactive = active;
}

var textureBall = PIXI.Texture.fromImage("imgs/ball.png");
var textureBallGolden = PIXI.Texture.fromImage("imgs/ball_golden.png");
var textureBallEmpty = PIXI.Texture.fromImage("imgs/ball_empty.png");
Ball=function(){
	var self=this;

	this.value=0;
	this.sprite = new PIXI.Sprite(textureBall);
	this.text=new PIXI.Text(this.value ,{font: textFont, fill: textFill, align: "left"});
	

	this.isClicked=false;
	this.isChanged=false;
	this.isInactive=false;

	this.slowDown=50;
	this.isMoving=false;
	this.movVect=null;
	this.movProgressVect=null;
	this.stepVect=null;

	this.sprite.interactive=true;
	this.sprite.buttonMode=true;
	this.sprite.anchor.x=0.5;
	this.sprite.anchor.y=0.5;
	this.text.position=this.sprite.position;
	this.text.anchor=this.sprite.anchor;

	this.sprite.click=this.sprite.tap=function(data){
		self.isClicked=true;
	}
}

Ball.prototype.setValue=function(val){
	this.value=val;
	this.text.setText(val);
}
Ball.prototype.init=function(stage,x,y,value){
	this.value=value;
	this.text.setText(value);
	this.sprite.position.x=x;
	this.sprite.position.y=y;
	stage.addChild(this.sprite);
	stage.addChild(this.text);
}

Ball.prototype.makeGolden=function(){
	this.isChanged=true;
	this.sprite.setTexture(textureBallGolden);
}
Ball.prototype.makeEmpty = function () {
    this.sprite.setTexture(textureBallEmpty);
    this.text.setText("");
}
Ball.prototype.makeInactive=function(){
	this.isInactive=true;
	this.text.alpha=0.3;
	this.sprite.alpha=0.3;
	//this.sprite.setTexture(textureBallInactive)
}
Ball.prototype.moveBy=function(x,y){
	this.isMoving=true;
	this.movVect=new PIXI.Point(x,y);
	this.stepVect=new PIXI.Point(x/this.slowDown,y/this.slowDown);
	this.movProgressVect=new PIXI.Point(0,0);
}
Ball.prototype.moveTo=function(x,y){
	var direction=new PIXI.Point(x-this.sprite.x,y-this.sprite.y);
	this.moveBy(direction.x,direction.y);
	console.log("Moving #"+this.value+" by "+direction.x+" "+direction.y+" with slowdown "+this.slowDown);
}

Ball.prototype.update=function(){
	this.isClicked=false;
	if(this.isMoving){
		this.sprite.position.x+=this.stepVect.x;
		this.sprite.position.y+=this.stepVect.y;
		this.movProgressVect.x+=this.stepVect.x;
		this.movProgressVect.y+=this.stepVect.y;
		if(Math.abs(this.movProgressVect.x)>=Math.abs(this.movVect.x) 
			&& Math.abs(this.movProgressVect.y)>=Math.abs(this.movVect.y)){
			this.isMoving=false;
		}
	}
}
Ball.prototype.reset=function(x,y,val){
	this.sprite.position.x=x;
	this.sprite.position.y=y;
	this.isMoving=false;
	this.isChanged=false;
	this.setValue(val);
	this.isInactive=false;
	this.text.alpha=1;
	this.sprite.alpha=1;
	this.sprite.setTexture(textureBall);
}
Ball.prototype.setPosition=function(x,y){
	var p=new PIXI.Point(x,y);
	this.sprite.position=p;
	this.text.position=p;
}


Leaf = function(){
	Ball.call(this);
	this.parent=null;
	this.left=null;
	this.right=null;
}
Leaf.prototype=Object.create(Ball.prototype);
Leaf.prototype.constructor=Leaf;

Leaf.prototype.clearNodes=function(){
	this.parent=null;
	this.left=null;
	this.right=null;
}

Tree = function(stage,graphics,x,y,values){
    this.graphics=graphics;
    this.stage=stage;
    this.leafVals=values;
    this.leaves=[];
    this.rootPos=new PIXI.Point(x,y);
    //this.levels=0;

    this.ind=0;
    this.ballMoves=false;
    this.isAddingNext=false;
    this.foundNext=false;
    this.currentNext=null;
    this.depth=0;
    this.parent = null;
    this.isInstantBuild = false;
    this.isBuilt = false;

    this.sign=new PIXI.Text("",{font: textFont, fill: textFill, align: "left"});
    this.sign.visible=false;
    this.sign.anchor.x=0.3;
    this.isPaused=false;
    this.pauseTime=1000;
    this.pauseTimeStart=0;

 
    this.valueSearchLeaf = null;
    this.foundLeaf = null;
    this.isSearching = false;
    this.currentSearched = null;
    this.displayResult = new PIXI.Text("", { font: textFont, fill: textFill, align: "left" });
    this.displayResult.position = new PIXI.Point(400, 400);
    this.displayResult.anchor = new PIXI.Point(0.5, 0.5);
    this.searchResult = "";

    this.yOffset=35;

    this.isRemoving = false;
    this.replacementSearch = false;
    this.foundReplacement = false;
    this.replaceSearchBall = null;
    this.lookingRight = false;
    this.lookngLeft = false;

    this.isReshaping = false;
    this.reshapingList = [];

	for(var i=0;i<this.leafVals.length;i++){
		var b=new Leaf();
		b.init(stage,200+i*50,25,this.leafVals[i]);
		this.leaves.push(b);
	}
	this.root=this.leaves[0];
	stage.addChild(this.sign);
	stage.addChild(this.displayResult);
}
Tree.prototype.clean = function () {
    for (var i = 0; i < this.leaves.length; i++) {
        this.stage.removeChild(this.leaves[i].sprite);
        this.stage.removeChild(this.leaves[i].text);

        if (this.valueSearchLeaf != null) {
            this.stage.removeChild(this.valueSearchLeaf.sprite);
            this.stage.removeChild(this.valueSearchLeaf.text);
            this.valueSearchLeaf = null;
        }
        if (this.replaceSearchBall != null) {
            this.stage.removeChild(this.replaceSearchBall.sprite);
            this.stage.removeChild(this.replaceSearchBall.text);
            this.replaceSearchBall = null;
        }
    };
}

//deprecated
Tree.prototype.clear=function(values){
	this.leafVals=values;
	for(var i=0;i<this.leaves.length;i++){
		this.leaves[i].reset(200+i*50,25,this.leafVals[i]);
		this.leaves[i].clearNodes();
	};
	this.root=this.leaves[0];
	this.ind = 0;
	this.isBuilt = false;
	this.isAddingNext = false;

	this.displayResult.setText("");
	this.isSearching = false;
	if (this.valueSearchLeaf != null) {
	    this.stage.removeChild(this.valueSearchLeaf.sprite);
	    this.stage.removeChild(this.valueSearchLeaf.text);
	    this.valueSearchLeaf = null;
	}
	if (this.replaceSearchBall != null) {
	    this.stage.removeChild(this.replaceSearchBall.sprite);
	    this.stage.removeChild(this.replaceSearchBall.text);
	    this.replaceSearchBall = null;
	}
	this.isRemoving = false;
	this.replacementSearch = false;
	this.lookingRight = false;
	this.lookingRight = false;
}

Tree.prototype.displaySign=function(sign, x,y){

	this.sign.setText(sign);
	this.sign.position=new PIXI.Point(x,y);

	this.sign.visible=true;
	this.isPaused=true;
	this.pauseTimeStart=Date.now();
}

Tree.prototype.remove = function (value, stage) {
    this.isRemoving = true;
    this.replacementSearch = false;
    this.foundReplacement = false;
    this.searchFor(value);
}

Tree.prototype.searchFor=function(value)
{
    //usun poprzedni szukajacy leaf
    if (this.valueSearchLeaf != null) {
        this.stage.removeChild(this.valueSearchLeaf.sprite);
        this.stage.removeChild(this.valueSearchLeaf.text);
    }

    this.valueSearchLeaf = new Leaf();
    this.valueSearchLeaf.init(this.stage, this.rootPos.x, this.rootPos.y - 50, value);
    this.valueSearchLeaf.makeGolden();
    this.foundLeaf = null;
    this.isSearching = true;
    this.currentSearched = this.root;
    this.searchResult = "";
    this.pauseTime = 500;
    this.stage.removeChild(this.sign);
    this.stage.addChild(this.sign);
}

Tree.prototype.orderAddNext=function(){
	if(this.isAddingNext)
		return -1;

	if(this.ind==this.leaves.length)
		return 1;

	if(this.ind==0){
		this.root.setPosition(this.rootPos.x, this.rootPos.y);
		this.ind++;
		return 0;
	}

	this.isAddingNext=true;
	this.foundNext=false;
	this.currentNext=this.leaves[this.ind];
	this.currentNext.setPosition(this.rootPos.x,this.rootPos.y-40);
	this.depth=0;
	this.parent=this.root;


	return 0;
}

Tree.prototype.instantBuild=function()
{
    this.isInstantBuild = true;
    this.pauseTime = 0;
    for (var i = 0; i < this.leaves.length; i++) {
        this.leaves[i].slowDown = 5;
    }
    this.orderAddNext();
    this.orderAddNext();
}

Tree.prototype.reshape = function () {
    this.depth = 0;
    this.root.slowDown = 20;
    this.graphics.clear();
    this.root.moveTo(this.rootPos.x, this.rootPos.y);
    this.isReshaping = true;
    this.reshapingList.push(this.root);
}
Tree.prototype.reshapeChildren = function (leaf) {
    var mult = (7 / 2 - this.depth); //7 - oryginalna liczba elementow drzewka
    if (mult < 1) mult = 1;
    
    //if (leaf.parent != null) {
    //    this.drawLineBetween(leaf.parent, leaf);
    //    console.log("drawing line",leaf, leaf.parent);
    //}

    var p = leaf.sprite.position;
    if (leaf.right != null) {
        leaf.right.slowDown = 20;
        leaf.right.moveTo(p.x + 50 * mult, p.y + 50);
        console.log("Leaf #" + leaf.value + " ordered #" + leaf.right.value);
        
    }
    if (leaf.left != null) {
        leaf.left.slowDown = 20;
        leaf.left.moveTo(p.x - 50 * mult, p.y + 50);
        console.log("Leaf #" + leaf.value + " ordered #" + leaf.left.value);
    }
    
}
Tree.prototype.drawLineBetween = function (parent, current) {
    var p = parent.sprite.position;
    var c = current.sprite.position;
    this.graphics.beginFill(0x000000);
    this.graphics.lineStyle(1, 0xaacccaa);
    this.graphics.moveTo(p.x, p.y);
    this.graphics.lineTo(c.x, c.y);
    this.graphics.endFill();
}

Tree.prototype.redrawLines = function (root) {
    if (root.parent != null)
        this.drawLineBetween(root.parent, root);

    if (root.right != null)
        this.redrawLines(root.right);

    if (root.left != null)
        this.redrawLines(root.left);
}

Tree.prototype._removeAndReplace=function(){
//derp
}

Tree.prototype.update=function(){
	if(this.isPaused){
		if(Date.now()-this.pauseTimeStart>=this.pauseTime){
			this.isPaused=false;
			this.sign.visible=false;
		}else{
			return;
		}
	}

	this.ballMoves=false;
	for(var i=0;i<this.leaves.length;i++){
		this.leaves[i].update();
		this.ballMoves=this.ballMoves || this.leaves[i].isMoving;
	}

	if (this.isReshaping) {
	    if (!this.ballMoves) {
	        this.depth++;
	        var newList = [];
           // console.log("Num of finished elements: ",this.reshapingList.length)
	        for (var i = 0; i < this.reshapingList.length; i++) {
	            var leaf = this.reshapingList[i];
	            this.reshapeChildren(leaf);

	            if (leaf.right != null) {
	                newList.push(leaf.right);
	            }
	                
	            if (leaf.left != null) {
	                newList.push(leaf.left);
	            }
	                
	        }
	        this.reshapingList = newList;
	        if (this.reshapingList.length == 0)
	        {
	            this.isReshaping = false;
	            this.redrawLines(this.root);
	        }
	              
	    }
	}

	if (this.isRemoving) {
        //jesli w searchu znaleziono szukany element
	    if (this.foundLeaf != null) {

	        //zacznij szukanie nastepcy
	        if (!this.replacementSearch) {
                
	            var spawn_pos = this.foundLeaf.sprite.position;
	            this.replaceSearchBall = new Leaf();
	            this.replaceSearchBall.init(this.stage, spawn_pos.x, spawn_pos.y + this.yOffset, 0);
	            this.replaceSearchBall.makeEmpty();
	            this.replacementSearch = true;

	            //jesli nie ma lisci - usun i skoncz
	            if (this.foundLeaf.left == null && this.foundLeaf.right == null) {
	                this.currentSearched = this.foundLeaf;
	                //jesli ma jakies liscie, zacznij isc do najblizszej wartosci
	            } else if (this.foundLeaf.left != null || this.foundLeaf.right != null) {
	                
	                //idz jeden w prawo
	                if (this.foundLeaf.right != null) {
	                    this.lookingRight = true;
	                    var p=this.foundLeaf.right.sprite.position;
	                    this.replaceSearchBall.moveTo(p.x, p.y+this.yOffset);
	                    this.currentSearched = this.foundLeaf.right;
                       
	                    //idz od razu w lewo
	                } else {
	                    this.lookngLeft = true;
	                    var p=this.foundLeaf.left.sprite.position;
	                    this.replaceSearchBall.moveTo(p.x, p.y + this.yOffset);
	                    this.currentSearched = this.foundLeaf.left;
	                }
	            }

	        //szukanie nowej kulki na miejsce usunietej
	        }else if(!this.foundReplacement){
	            this.replaceSearchBall.update();
	            this.ballMoves = this.replaceSearchBall.isMoving; //this.ballMoves || 
                    
	            //jesli kulka sie zatrzymala
	            if (!this.ballMoves) {
	                //searchleaf zjebal sie z currentsearchem i zle podpina



	                //jesli doszlismy maksymalnie w lewo po uprzednim pójsciu w prawo
	                //przepmnij prawe dziecko zamiennika w miejsce zamiennika
	                //przepnij zamiennik za usuwany element
	                if (this.lookingRight && this.lookngLeft && this.currentSearched.left == null) {
	                    this.foundReplacement = true;

	                    //jesli ma prawe dziecko
	                    if (this.currentSearched.right != null) {
	                        //przepnij prawe poddrzewo do rodzica znalezionego elementu
	                        this.currentSearched.right.parent = this.currentSearched.parent;
	                        this.currentSearched.parent.left = this.currentSearched.right;;


	                        //usun powiazanie od rodzica
	                    } else
	                        this.currentSearched.parent.left = null;

	                    //przepnij zamiennik za usuwany element
	                    //przepnij rodzica
	                    if (this.foundLeaf.parent != null){
	                        if (this.foundLeaf.parent.left == this.foundLeaf) {
	                            this.foundLeaf.parent.left = this.currentSearched;
	                        } else if (this.foundLeaf.parent.right == this.foundLeaf) {
	                            this.foundLeaf.parent.right = this.currentSearched;
	                        }
	                    }           
	                    else
	                        this.root = this.currentSearched;
	                    this.currentSearched.parent = this.foundLeaf.parent;


                        //przepnij dzieci
	                    if (this.foundLeaf.right != null)
	                        this.foundLeaf.right.parent = this.currentSearched;

	                    if (this.foundLeaf.left != null)
	                        this.foundLeaf.left.parent = this.currentSearched;

	                    this.currentSearched.right = this.foundLeaf.right;
	                    this.currentSearched.left = this.foundLeaf.left;
	                }


	                //jesli szlismy tylko raz w lewo
	                if (!this.lookingRight && this.lookngLeft) {
	                    //przepnij nowy element na miejse usuwanego elementu
	                    //przepnij rodzica
	                    this.foundReplacement = true;
	                    if (this.foundLeaf.parent != null) {
	                        if (this.foundLeaf.parent.left == this.foundLeaf) {
	                            this.foundLeaf.parent.left = this.currentSearched;
	                        } else if (this.foundLeaf.parent.right == this.foundLeaf) {
	                            this.foundLeaf.parent.right = this.currentSearched;
	                        }
	                    } else
	                        this.root = this.currentSearched;
	                    this.currentSearched.parent = this.foundLeaf.parent;
	                }

	                //jesli szlismy tylko raz w prawo
	                if (this.lookingRight && !this.lookngLeft && this.currentSearched.left == null) {
	                    this.foundReplacement = true;

	                    //przepnij rodzica
	                    this.currentSearched.parent = this.foundLeaf.parent;
	                    if (this.foundLeaf.parent != null) {

	                        if (this.foundLeaf.parent.left == this.foundLeaf) {
	                            this.foundLeaf.parent.left = this.currentSearched;
	                        } else if (this.foundLeaf.parent.right == this.foundLeaf) {
	                            this.foundLeaf.parent.right = this.currentSearched;
	                        }
	                    } else {
	                        this.root = this.currentSearched;
	                    }


	                    //przepnij lewe dziecko
	                    this.currentSearched.left = this.foundLeaf.left;
	                    if (this.currentSearched.left != null)
	                        this.currentSearched.left.parent = this.currentSearched;
	                }

	                //jesli nigdzie nie szlismy
	                if (!this.lookingRight && !this.lookngLeft)
	                {
	                    this.foundReplacement=true;
	                    if (this.foundLeaf.parent != null) {
	                        if (this.foundLeaf.parent.left == this.foundLeaf) {
	                            this.foundLeaf.parent.left = null;
	                        } else if (this.foundLeaf.parent.right == this.foundLeaf) {
	                            this.foundLeaf.parent.right = null;
	                        }
	                    } else {
	                        this.root = null;
	                    }
	                }
                    


                    

	                //jesli usunieto cos w tym loopie, usun stary element
	                if (this.foundReplacement) {
	                    this.displayResult.setText("Znaleziono zamiennik.")

	                    this.leafVals.splice(this.leafVals.indexOf(this.foundLeaf.value), 1);
	                    this.leaves.splice(this.leaves.indexOf(this.foundLeaf), 1);

	                    this.stage.removeChild(this.replaceSearchBall.sprite);
	                    this.stage.removeChild(this.replaceSearchBall.text);
	                    this.replaceSearchBall = null;

	                    this.stage.removeChild(this.valueSearchLeaf.sprite);
	                    this.stage.removeChild(this.valueSearchLeaf.text);
	                    this.valueSearchLeaf = null;

	                    this.stage.removeChild(this.foundLeaf.sprite);
	                    this.stage.removeChild(this.foundLeaf.text);
	                    this.lookingRight = false;
	                    this.lookngLeft = false;
	                    this.isRemoving = false;
	                    this.reshape();
	                }

                    //sprawdzamy czy w miedzyczasie stan sie nie zmienil
	                if (!this.foundReplacement) {

	                    //jesli idziemy w prawo, idz w lewo

	                    //jesli idziemy TYLKO w lewo, zakoncz
	                    if (this.lookngLeft && !this.lookingRight) {

	                    }

	                    //jesli na poczatku poszlismy w prawo, idz w lewo do oporu
	                    if (this.lookingRight && this.currentSearched.left != null) {
	                        this.lookngLeft = true;

	                        var p = this.currentSearched.left.sprite.position;
	                        this.replaceSearchBall.moveTo(p.x, p.y + this.yOffset);
	                        this.currentSearched = this.currentSearched.left;
	                    }
	                }
	            }                   
	        } //END OF else if(!this.foundReplacement)
	            
	    }
	}

	if (this.isSearching) {
	    this.valueSearchLeaf.update();
	    this.ballMoves=this.ballMoves || this.valueSearchLeaf.isMoving;

        //jesli sie nie rusza i nie ma jeszcze rozwiazania
	    if (!this.ballMoves && !this.searchResult) {
	        var sign = "!=";
	        var dstNode = null;
	        if (this.currentSearched.value == this.valueSearchLeaf.value) {
	            sign = "=";
	            this.searchResult = "Znaleziono szukany wezel!";
	            this.isSearching = false;
	            this.foundLeaf = this.currentSearched;
	        }
	        //znajdz nastepny node
            else if (this.currentSearched.value < this.valueSearchLeaf.value && this.currentSearched.right != null) {
                dstNode = this.currentSearched.right;
                sign = ">";
            } else if (this.currentSearched.value > this.valueSearchLeaf.value && this.currentSearched.left != null) {
                dstNode = this.currentSearched.left;
                sign = "<";
            }
	        if (dstNode == null) {
	            if (!this.searchResult) {
	                this.searchResult = "Nie mozna znalezc " + this.valueSearchLeaf.value + "!";
	                this.isSearching = false;
	            }
	        } else {
	            var p = dstNode.sprite.position;
	            
	            this.valueSearchLeaf.moveTo(p.x, p.y - this.yOffset)
	            this.currentSearched = dstNode;
	        }
	        this.displaySign(sign, this.valueSearchLeaf.sprite.position.x, this.valueSearchLeaf.sprite.position.y);
	    }
	    this.displayResult.setText(this.searchResult);

	}

	if(this.isAddingNext){
		//zakoncz caly proces dodawania
		if(!this.ballMoves && this.foundNext){
			var p=this.parent.sprite.position;
			var c = this.currentNext.sprite.position;
			this.currentNext.parent = this.parent;
			this.drawLineBetween(this.parent, this.currentNext);

			this.ind++;
			this.isAddingNext = false;
			this.currentNext = null;

			if (this.isInstantBuild && !this.isBuilt)
			    this.isBuilt=this.orderAddNext();
		}

		

		if(!this.ballMoves && !this.foundNext){
			this.depth++;
			var mult=(this.leaves.length/2-this.depth);
			if(mult<1)mult=1;
			var c=this.currentNext.sprite.position;
			if(this.currentNext.value<this.parent.value){
				if(this.parent.left!=null){
					this.parent=this.parent.left;
					var p=this.parent.sprite.position;
					this.currentNext.moveTo(p.x,p.y-40);
				}else{
					this.foundNext=true;
					var p=this.parent.sprite.position;
					this.currentNext.moveTo(p.x-50*mult,p.y+50)
					this.parent.left=this.currentNext;
				}
				this.displaySign("<",c.x,c.y);
			}
			else{
				if(this.parent.right!=null){
					this.parent=this.parent.right;
					var p=this.parent.sprite.position;
					this.currentNext.moveTo(p.x,p.y-40);
				}else{
					this.foundNext=true;
					this.parent.right=this.currentNext;
					var p=this.parent.sprite.position;
					this.currentNext.moveTo(p.x+50*mult,p.y+50)
				}
				this.displaySign(">=",c.x,c.y);
			}
			
		}
	}

}
