// JUST DOING SOME REFACTORING HERE!

Thundersnow.Node.IO = function(options) {
  this.init(options);
}

Thundersnow.Node.IO.prototype = {
  
  init: function(options) {
    this.node = options.node;
    this.inputs_count = options.inputs_count;
    this.outputs_count = options.outputs_count;
    this.initialValue = options.initialValue;
    this.name = options.name;
    this.ioType = options.ioType
    
    if (Thundersnow.editor) {
      this.c = Thundersnow.editor.context;
    }
    
    this.x = this.inputX(this.inputs_count);
    this.y = this.inputY(this.inputs_count);
    
    if (Thundersnow.editor) { // EDITOR DEP
      this.drawIO();
    }
    
    // MOVE THIS TO THE INSTANTIATING OBJECT
    /*
    this._inputs.push(input);
    this.inputAttributes[options.name] = options.initialValue;
    */
    
  },
  
  // Styles
  
  inputMarginX: 10,
  inputMarginY: 30,
  inputPadding: 10,
  inputRadius: 5,
  outputMarginX: 10,
  outputMarginY: 30,
  outputPadding: 10,
  outputRadius: 5,
  
  inputX: function(i) {
    return this.x + this.inputMarginX;
  },
  
  inputY: function(i) {
    return this.inputMarginY + this.y + (i * (this.inputRadius * 2)) + (i * this.inputPadding);
  },
  
  outputX: function(i) {
    return (this.x + this.width) - this.outputMarginX;
  },
  
  outputY: function(i) {
    return this.outputMarginY + this.y + (i * (this.outputRadius * 2)) + (i * this.outputPadding);
  },
  
  drawIO: function() {
    
    // circle
    this.c.strokeStyle = "#000000";
    this.c.fillStyle = "#FFFF00";
    this.c.lineWidth = 3;
    this.c.beginPath();
    this.c.arc(this.x,this.y,this.inputRadius,0,Math.PI*2,true);
    this.c.closePath();
    this.c.stroke();
    this.c.fill();
    
    // text
    this.c.fillStyle = "#000";
    this.c.font = '10px sans-serif';
    if (options.ioType == "input") {
      var x = this.x + 12;
    }
    else {
      var x = this.x - 50;
    }
    this.c.fillText(this.name, x, this.y + 3);
  }
  
}