var textureComputer = PIXI.Texture.fromImage("imgs/ball.png");
var defaultAnchor = new PIXI.Point(0.5, 0.5);

ButtonGroup = function (stage, x, y) {
    this.buttons = [];
    this.activeInd = 0;
    this.value = 0.1;
    this.buttons.push(new ComputerButton(stage, x, y, 0.001, textureComputer));
    this.buttons.push(new ComputerButton(stage, x+50, y, 0.000001, textureComputer));
    this.buttons.push(new ComputerButton(stage, x + 100, y, 0.000000001, textureComputer));
    this.updateColors();
}
ButtonGroup.prototype.update = function () {
    var swap=false;
    for (var i = 0; i < this.buttons.length; i++) {
        if (this.buttons[i].isClicked) {
            this.activeInd = i;
            this.value = this.buttons[i].value;
            swap=true;
        }   
        this.buttons[i].update();
    }
    if (swap)
        this.updateColors();
    
}
ButtonGroup.prototype.updateColors=function(){
    for (var i = 0; i < this.buttons.length; i++) {
        if (i == this.activeInd)
            this.buttons[i].sprite.alpha = 1;
        else
            this.buttons[i].sprite.alpha = 0.5;
    }
}

ComputerButton = function (stage, x, y, value, texture) {
    this.value = value;
    this.isClicked = false;
    var self = this;

    this.sprite = new PIXI.Sprite(texture);
    this.sprite.position.x = x;
    this.sprite.position.y = y;
    this.sprite.anchor = defaultAnchor;
    this.sprite.interactive = true;
    this.sprite.buttonMode = true;
    this.sprite.click = function (data) {
        self.isClicked = true;
    }

    stage.addChild(this.sprite);
}
ComputerButton.prototype.update = function () {
    this.isClicked = false;
}

var data = {
    labels: [""],
    name: "eee",
    datasets: [
        {
            label: "Count Sort",
            fillColor: "rgba(220,220,220,0.1)",
            strokeColor: "rgba(220,220,220,1)",
            pointColor: "rgba(220,220,220,1)",
            pointStrokeColor: "#fff",
            pointHighlightFill: "#fff",
            pointHighlightStroke: "rgba(220,220,220,1)",
            data: [0]
        },
        {
            label: "Bubble Sort",
            fillColor: "rgba(30,220,30,0.2)",
            strokeColor: "rgba(30,220,30,1)",
            pointColor: "rgba(30,220,30,1)",
            pointStrokeColor: "#1f1",
            pointHighlightFill: "#1f1",
            pointHighlightStroke: "rgba(151,187,205,1)",
            data: [0]
        },
        {
            label: "Quick Sort",
            fillColor: "rgba(220,220,30,0.2)",
            strokeColor: "rgba(220,220,30,1)",
            pointColor: "rgba(220,220,30,1)",
            pointStrokeColor: "#ff1",
            pointHighlightFill: "#ff1",
            pointHighlightStroke: "rgba(151,187,205,1)",
            data: [0]
        }

    ]
};

var options = {
    //Boolean - Whether the scale should start at zero, or an order of magnitude down from the lowest value
    scaleBeginAtZero: true,

    //Boolean - Whether grid lines are shown across the chart
    scaleShowGridLines: true,

    //String - Colour of the grid lines
    scaleGridLineColor: "rgba(0,0,0,.05)",

    //Number - Width of the grid lines
    scaleGridLineWidth: 1,

    //Boolean - If there is a stroke on each bar
    barShowStroke: true,

    //Number - Pixel width of the bar stroke
    barStrokeWidth: 2,

    //Number - Spacing between each of the X value sets
    barValueSpacing: 5,

    //Number - Spacing between data sets within X values
    barDatasetSpacing: 1,

    //String - A legend template
    legendTemplate: "<ul class=\"<%=name.toLowerCase()%>-legend\"><% for (var i=0; i<datasets.length; i++){%><li><span style=\"background-color:<%=datasets[i].lineColor%>\"></span><%if(datasets[i].label){%><%=datasets[i].label%><%}%></li><%}%>"+
        "</ul>"
    //scaleOverride: true,
    //scaleStartValue: 0,
    //scaleStepWidth: 15, 
    //scaleSteps: 30
}

