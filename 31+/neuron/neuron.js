var neuronTexture = PIXI.Texture.fromImage("imgs/neuron.png");

Neuron = function(stage, x, y){

    //this.neuronSprite = new PIXI.Sprite(neuronTexture);
    //this.neuronSprite.position = new PIXI.Point(x, y);
    //this.neuronSprite.anchor = new PIXI.Point(0.5,0.5);
    //stage.addChild(this.neuronSprite);

    this.weight1 = 0;
    this.weight2 = 0;
    this.input1 = 0;
    this.input2 = 0;
    this.output = 0;
    this.correction1 = 0;
    this.correction2 = 0;
    this.learningFactor = 0;

    var textSpacing = 30;
    var valuesDistance = 300;
    this.inputTextDesc = new Text(stage, x, y, "Sygnał wejściowy:" );
    this.inputText = new Text(stage, x+valuesDistance, y, "" );
    this.weightTextDesc = new Text(stage, x, y+textSpacing, "Wagi wejściowe:" );
    this.weightText = new Text(stage, x+valuesDistance, y+textSpacing, "");
    this.outputTextDesc = new Text(stage, x, y+textSpacing*3, "Syngał wyjściowy:" );
    this.outpuText = new Text(stage, x+valuesDistance, y+textSpacing*3, "" );

    this.learningFactorTextDesc = new Text(stage, x, y+textSpacing*5, "Współczynnik uczenia:" );
    this.learningFactorText = new Text(stage, x+valuesDistance, y+textSpacing*5, "" );
    this.correctionTextDesc = new Text(stage, x, y+textSpacing*6, "Korekcja wag:" );
    this.correctionText = new Text(stage, x+valuesDistance, y+textSpacing*6, "" );

    this.correctedWeightTextDesc = new Text(stage, x, y+textSpacing*7, "Skorygowane wagi:" );
    this.correctedWeightText = new Text(stage, x+valuesDistance, y+textSpacing*7, "" );

};

Neuron.prototype.setWeights = function(w1, w2){
    this.weight1=w1;
    this.weight2=w2;
    this.weightText.text.setText(round2(this.weight1)+"  "+round2(this.weight2));
};

Neuron.prototype.setLearningFactor = function(factor){
    this.learningFactor = factor;
    this.learningFactorText.text.setText(round2(this.learningFactor));
};

Neuron.prototype.setInputs = function(input1, input2){
    this.input1=input1;
    this.input2=input2;
    this.inputText.text.setText(round2(this.input1)+"  "+round2(this.input2));
};

Neuron.prototype.calculateOutput = function(){
    var y = this.input1 * this.weight1 + this.input2 * this.weight2;
    //this.output = 0.8*y+1;
    this.output = y>0 ? 1 : y<0 ? -1 : 0;
    this.outpuText.text.setText(round2(this.output));
};

Neuron.prototype.calculateCorrection = function(){
    this.correction1 = this.learningFactor*this.input1*this.output;
    this.correction2 = this.learningFactor*this.input2*this.output;
    this.correctionText.text.setText(round2(this.correction1)+"  "+round2(this.correction2));
};
Neuron.prototype.setCorrectedWeights = function(){
    var corrected1 = this.weight1+this.correction1;
    var corrected2 = this.weight2+this.correction2;
    this.correctedWeightText.text.setText(round2(corrected1)+"  "+round2(corrected2));
};
Neuron.prototype.correctWeights = function() {
    this.setWeights(this.weight1+this.correction1, this.weight2+this.correction2);
};

Neuron.prototype.processInputDataPair=function(input1,input2){
    this.setInputs(input1,input2);
    this.correctWeights();
    this.calculateOutput();
    this.calculateCorrection();
    this.setCorrectedWeights();

};
Neuron.prototype.clear=function(){
    this.inputText.text.setText("");
    this.outpuText.text.setText("");
    this.correctionText.text.setText("");
    this.correctedWeightText.text.setText("");
};

function round2(x){
    return parseFloat(Math.round(x * 100) / 100).toFixed(2);
}