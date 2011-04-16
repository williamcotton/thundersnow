/*

LFO
---

*/ 


Thundersnow.nodeTypes.rgb_color = {
  
  init: function() {
    
    this.createInput("red", 255);
    this.createInput("green", 255);
    this.createInput("blue", 255);
    this.createInput("alpha", 1.0);
    
    this.createOutput("output", 0);
    
  },
  
  runLoop: function(time) {
    
    var output = Math.sin(time);
    this.outputAttributes.output = "rgba(" + parseInt(this.inputAttributes.red) + "," + parseInt(this.inputAttributes.green) + "," + parseInt(this.inputAttributes.blue) + "," + parseFloat(this.inputAttributes.alpha) + ")";
    
  }
  
}