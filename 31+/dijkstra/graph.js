var centerAnchor = new PIXI.Point(0.5, 0.5);
var distanceTextStyle = { font: "bold 25px Comic Sans MS", fill: "#cc9999", align: "left" };
var textureBallGreen = PIXI.Texture.fromImage("imgs/ball_green.png");

Node = function(stage, x, y, nodeName, nodeIndex){
    this.x=x;
    this.y=y;
    this.index=nodeIndex;
    this.sprite = new PIXI.Sprite(textureBall);
    stage.addChild(this.sprite);
    this.text = new Text(stage, x, y, nodeName);
    this.pathText = new Text(stage, x, y, "?", distanceTextStyle);
    this.pathText.text.anchor = new PIXI.Point(1,1);
    this.sprite.position = this.text.text.position;
    this.sprite.anchor = centerAnchor;
    this.text.text.anchor = centerAnchor;

    this.neighbours = [];
    this.distances = [];
    this.visited = false;

};

Node.prototype.addNeighbour = function(neighbourNode, neighbourDistance){
    this.neighbours.push(neighbourNode);
    this.distances.push(neighbourDistance);
};

Node.prototype.clearConnections = function(){
    this.neighbours = [];
    this.distances = [];
};

Node.prototype.makeVisited=function(){
    this.visited = true;
    this.sprite.setTexture(textureBallGolden);
};
Node.prototype.highlight=function(){
    this.visited = true;
    this.sprite.setTexture(textureBallGreen);
};

Node.prototype.clearVisited=function(){
    this.visited = false;
    this.sprite.setTexture(textureBall);
};

Node.prototype.setShortestDistanceText=function(distance){
    this.pathText.text.setText(distance);
}