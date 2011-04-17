/*

Node
----

*/

Thundersnow.Node = function(options) {
  
  this._inputs = [];
  this._outputs = [];
  
  this.inputAttributes = {};
  this.outputAttributes = {};
  
  if (Thundersnow.editor) { // EDITOR DEP
    this.ec = Thundersnow.editor.context;
  }
  else {
    this.redraw = function() {};
    this.draw = function() {};
    this.drawIO = function() {};
  }
  if (Thundersnow.viewer) { // VIEWER DEP
    this.vc = Thundersnow.viewer.context; 
  }
  
  Thundersnow.nodes.push(this);
  this.init(options);
  
}

Thundersnow.Node.prototype = {
  
  _backgroundColor: "rgba(10,100,149,0.75)",
  _borderColor: "rgba(0,0,0,0.45)",
  _borderColorActive: "rgba(255,255,0,0.45)",
  _drawBackgroundColor: "rgba(125,25,115,0.75)",
  _width: 200,
  _height: 200,
  
  init: function(options) {
    this.x = options.x;
    this.y = options.y;
    this.width = this._width;
    this.height = this._height;
    this.nodeType = options.nodeType;
    this.uuid = options.uuid || Thundersnow.generateUUID();
    this.borderColor = this._borderColor;
    this.backgroundColor = this._backgroundColor;
    this.initNodeType(options);
    this.redraw();
  },
  
  initNodeType: function(options) {
    var nodeType = Thundersnow.nodeTypes[options.nodeType];
    nodeType.node = this;
    
    nodeType.createInput = function(name, initialValue) {
      nodeType.node.createInput(name, initialValue);
    }
    nodeType.createOutput = function(name, initialValue) {
      nodeType.node.createOutput(name, initialValue);
    }
    
    nodeType.init();
    
    if (this.vc) {
      nodeType.vc = this.vc;
    }
    if (nodeType.runLoop) {
      this.runLoop = nodeType.runLoop;
    }
    
    var inputCount = 0;
    var outputCount = 0;
    var maxIOCount;
    
    for (var i in this.inputAttributes) {
      inputCount += 1;
    }
    for (var i in this.outputAttributes) {
      outputCount += 1;
    }
    
    if (inputCount >= outputCount) {
      maxIOCount = inputCount;
    }
    else {
      maxIOCount = outputCount;
    }
    
    this.height = this._ioOffsetY(maxIOCount) - this._ioPadding;
    
    if (nodeType.runLoop.toString().indexOf("this.vc") != -1) {
      this.backgroundColor = this._drawBackgroundColor;
    }
    
  },
  
  remove: function() {
    Thundersnow.editor.removeNode(this);
  },
  
  draw: function() {
    
    var lingrad = this.ec.createLinearGradient(this.x,this.y,this.x + this.width,this.y + this.height);
    lingrad.addColorStop(0, this.backgroundColor);
    lingrad.addColorStop(1, '#000');
    this.ec.fillStyle = lingrad;
    
    
    //this.ec.fillStyle = this.backgroundFill;
    this.ec.strokeStyle = this.borderColor;
    
    // this.ec.fillRect(this.x, this.y, this.width, this.height);
    Thundersnow.editor.roundRect(this.ec, this.x, this.y, this.width, this.height, 5, this.ec.fillStyle, this.ec.strokeStyle);
    
    this.ec.fillStyle = "#fff";
    this.ec.font = '15px sans-serif';
    this.ec.fillText(this.nodeType, this.x + 5, this.y + 15);
  },
  
  redraw: function() {
    this.draw();
    var input_and_outputs = this._inputs.concat(this._outputs);
    for (var io in input_and_outputs) {
      var input_or_output = input_and_outputs[io];
      this.drawIO(input_or_output);
    }
    
  },
  
  moveBy: function(startX, dx, startY, dy) {
    this.x = startX + dx;
    this.y = startY + dy;
    for (o in this._outputs) {
      var output = this._outputs[o];
      output.x = this._outputX(parseInt(o));
      output.y = this._outputY(parseInt(o));
    }
    for (i in this._inputs) {
      var input = this._inputs[i];
      input.x = this._inputX(parseInt(i));
      input.y = this._inputY(parseInt(i));
    }
  },
  
  setActive: function() {
    this.borderColor = this._borderColorActive;
    this.isActive = true;
  },
  
  setInactive: function() {
    this.borderColor = this._borderColor;
    this.isActive = false;
  },
  
  toJSON: function() {
    var json = {
      x: this.x,
      y: this.y,
      nodeType: this.nodeType,
      uuid: this.uuid
    };
    return json;
  },
  
  /*
  
  Inputs and Outputs
  
  */
  
  // move this input and output stuff in to it's own thing?
  
  _ioMarginX: 10,
  _ioMarginY: 30,
  _ioPadding: 10,
  _ioRadius: 5,
  
  createInput: function(name, initialValue) {
    
    var x = this._inputX(this._inputs.length);
    var y = this._inputY(this._inputs.length);
    
    var input = {
      node: this,
      x: x,
      y: y,
      initialValue: initialValue,
      name: name,
      ioType: "input"
    }
    
    this.drawIO(input);
    
    this._inputs.push(input);
    
    this.inputAttributes[name] = initialValue;
    
  },
  
  _inputX: function(i) {
    return this.x + this._ioMarginX;
  },
  
  _inputY: function(i) {
    return this.y + this._ioOffsetY(i)
  },
  

  
  createOutput: function(name, initialValue) {
    
    var x = this._outputX(this._outputs.length);
    var y = this._outputY(this._outputs.length);
    
    var output = {
      node: this,
      x: x,
      y: y,
      initialValue: initialValue,
      name: name,
      ioType: "output"
    }
    
    this.drawIO(output);
    
    this._outputs.push(output);
    
    this.outputAttributes[name] = initialValue;
    
  },
  
  _outputX: function(i) {
    return (this.x + this.width) - this._ioMarginX;
  },
  
  _outputY: function(i) {
    return this.y + this._ioOffsetY(i);
  },
  
  drawIO: function(options) {
    this.ec.strokeStyle = "rgba(0,0,0,0.75)";
    this.ec.fillStyle = "rgba(255,255,0,0.75)";
    this.ec.lineWidth = 3;
    this.ec.beginPath();
    this.ec.arc(options.x,options.y,this._ioRadius,0,Math.PI*2,true);
    this.ec.closePath();
    this.ec.stroke();
    this.ec.fill();
    this.ec.fillStyle = "#fff";
    this.ec.font = '10px sans-serif';
    if (options.ioType == "input") {
      var x = options.x + 12;
    }
    else {
      var x = options.x - 50;
    }
    this.ec.fillText(options.name, x, options.y + 3);
  },
  
  _ioOffsetY: function(i) {
    return this._ioMarginY + (i * (this._ioRadius * 2)) + (i * this._ioPadding);
  },
  
  isCoordinateInsideInput: function(x,y) {
    for (var i in this._inputs) {
      var input = this._inputs[i];
      var centerX = this._inputX(i);
      var centerY = this._inputY(i);
      
      if ( (Math.pow(x - centerX,2) + Math.pow(y - centerY,2)) < Math.pow(this._ioRadius, 2) ) {
        return input;
      } 
    }
  },
  
  isCoordinateInsideOutput: function (x,y) {
    for (var o in this._outputs) {
      var output = this._outputs[o];
      var centerX = this._outputX(o);
      var centerY = this._outputY(o);
      
      if ( (Math.pow(x - centerX,2) + Math.pow(y - centerY,2)) < Math.pow(this._ioRadius, 2) ) {
        return output;
      }
      
    }
  },
  
  findOutput: function(output_name) {
    for (o in this._outputs) {
      var output = this._outputs[o];
      if (output.name == output_name) {
        return output;
      }
    }
  },
  
  findInput: function(input_name) {
    for (i in this._inputs) {
      var input = this._inputs[i];
      if (input.name == input_name) {
        return input;
      }
    }
  },
  
  enableDirectInput: function(input) {
    var node = this;
    input.element = document.createElement('input');
    input.element.style.position = "absolute";
    input.element.style.left = input.x + "px";
    input.element.style.top = input.y - 4 + "px";
    input.element.style.backgroundColor = "rgba(255, 255, 255, 0.96)";
    input.element.style.width = "50px";
    input.element.value =  this.inputAttributes[input.name]
    document.body.appendChild(input.element);
    input.element.focus();
    
    input.element.onkeydown = function(event) {
      if (event.keyCode == 13) { // Enter
        node.inputAttributes[input.name] = input.element.value;
        node.disableDirectInput(input);
      }
      if (event.keyCode == 27) { // Escape
        node.disableDirectInput(input);
      }
    }
    
    return input.element;
  },
  
  disableDirectInput: function(input) {
    document.body.removeChild(input.element);
  },
  
  areDirectInputsEnabled: function() {
    
  },
  
  isCoordinateInside: function(x, y) {
    if ( (x >= this.x) && (x <= (this.x + this.width)) && (y >= this.y) && (y <= (this.y + this.height)) ) {
      return true;
    }
    else {
      return false;
    }
  },
  
  // this is pretty genaric event stuff, this could be moved out and then the class could be "extended"
  
  _mouseWasOver: false
  
}