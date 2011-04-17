/*

LFO
---

*/ 


Thundersnow.nodeTypes.hsl_color = {
  
  init: function() {
    
    this.createInput("hue", 0);
    this.createInput("saturation", 1);
    this.createInput("lightness", 0.5);
    this.createInput("alpha", 1.0);
    
    this.createOutput("output", 0);
    
  },
  
  runLoop: function(time) {
    
    var output = Math.sin(time);
    this.outputAttributes.output = "hsla(" + parseFloat(this.inputAttributes.hue) + "," + (parseFloat(this.inputAttributes.saturation) * 100) + "%," +  (parseFloat(this.inputAttributes.lightness) * 100) + "%," + parseFloat(this.inputAttributes.alpha) + ")";
    
  }
  
}