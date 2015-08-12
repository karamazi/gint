var basketballTexture = PIXI.Texture.fromImage("imgs/basketball.png");
var basketTexture = PIXI.Texture.fromImage("imgs/basket.png");

Basketball = function(stage,x,y){
    this.sprite = new PIXI.Sprite(basketballTexture);
    this.sprite.alpha = 0.5;
    this.sprite.anchor = new PIXI.Point(0.5,0.5);
    this.sprite.position = new PIXI.Point(x,y);
    stage.addChild(this.sprite)
};
Basket = function(stage,x,y){
    this.sprite = new PIXI.Sprite(basketTexture);
    this.sprite.anchor = new PIXI.Point(0.5,0);
    this.sprite.position = new PIXI.Point(x,y);
    stage.addChild(this.sprite)
};
