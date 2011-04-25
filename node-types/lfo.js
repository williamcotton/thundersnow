/*

LFO
---

*/ 


Thundersnow.nodeTypes.lfo = {
  
  init: function() {
    
    this.createInput("period", 0.5);
    this.createInput("amplitude", 1);
    this.createInput("offset", 0);
    
    this.createOutput("output", 0);
    
  },
  
  runLoop: function(time) {
    
    var output = Math.sin(time);
    this.outputAttributes.output = (Math.sin(time * (1/this.inputAttributes.period)) * this.inputAttributes.amplitude) + this.inputAttributes.offset;
    
  }
  
}