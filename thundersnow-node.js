/*

Node
----

*/

Thundersnow.Node = function(options) {
  
  this._inputs = [];
  this._outputs = [];
  
  this.inputAttributes = {};
  this.outputAttributes = {};
  
  this._mouseOverCallbacks = [];
  this._mouseEnterCallbacks = [];
  this._mouseLeaveCallbacks = [];
  this._clickCallbacks = [];
  this._dblClickCallbacks = [];
  this._mouseUpCallbacks = [];
  this._mouseDownCallbacks = [];
  this._mouseMoveCallbacks = [];
  this._keyDownCallbacks = [];
  this._keyUpCallbacks = [];
  
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
  
  _backgroundFill: "rgba(255,255,255,0.95)",
  _backgroundFillActive: "rgba(255,255,200,0.95)",
  _width: 200,
  _height: 200,
  
  init: function(options) {
    this.x = options.x;
    this.y = options.y;
    this.width = this._width;
    this.height = this._height;
    this.nodeType = options.nodeType;
    this.uuid = options.uuid || Thundersnow.generateUUID();
    this.backgroundFill = this._backgroundFill;
    this.initNodeType(options);
    if (Thundersnow.editor) {
      this.initIOCreationEvents();
    }
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
    
  },
  
  remove: function() {
    Thundersnow.editor.removeNode(this);
  },
  
  draw: function() {
    this.ec.fillStyle = this.backgroundFill;
    this.ec.fillRect(this.x, this.y, this.width, this.height);
    this.ec.fillStyle = "#000";
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
    this.backgroundFill = this._backgroundFillActive;
    this.isActive = true;
  },
  
  setInactive: function() {
    this.backgroundFill = this._backgroundFill;
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
    this.ec.strokeStyle = "#000000";
    this.ec.fillStyle = "#FFFF00";
    this.ec.lineWidth = 3;
    this.ec.beginPath();
    this.ec.arc(options.x,options.y,this._ioRadius,0,Math.PI*2,true);
    this.ec.closePath();
    this.ec.stroke();
    this.ec.fill();
    this.ec.fillStyle = "#000";
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
  
  /*
  
  Events
  
  */
  
  initIOCreationEvents: function() {
    
    // it sort of feels like this shouldn't be in here and that this event related code should be up with all the other event related code...
    // if that's the case, these input and output objects should be in the global scope of things... they can still be (and are) associated with nodes...
    
    // but then again, this is nicely encapsulated, right? inputs and outputs are still under the umbrella of nodes...
    
    
    var node = this;

    this.mouseDown(function(event) {

      var output = node.isCoordinateInsideOutput(event.offsetX, event.offsetY);
      var input = node.isCoordinateInsideInput(event.offsetX, event.offsetY);

      if (output) {
        Thundersnow.editor.edgeMouseDownOutput(event, output);
      }
      else if (input) {
        Thundersnow.editor.edgeMouseDownInput(event, input);
      }
      else {
        Thundersnow.editor.setActiveNode(node);
        node.isBeingMoved = true;
        node.startCoordinatesForMove = {
          clickX: event.offsetX,
          clickY: event.offsetY,
          nodeX: parseInt(node.x),
          nodeY: parseInt(node.y)
        }
      }


    });

    this.mouseUp(function(event) {
      
      node.isBeingMoved = false;

      var input = node.isCoordinateInsideInput(event.offsetX, event.offsetY);
      var output = node.isCoordinateInsideOutput(event.offsetX, event.offsetY);

      if (input) {
        Thundersnow.editor.edgeMouseUpInput(event, input);
      }
      else if (output) {
        Thundersnow.editor.edgeMouseUpOutput(event, output);
      }
      else {
        Thundersnow.editor.mouseUp(event);
      }

    });
    
    this.dblClick(function(event) {
      
      var input = node.isCoordinateInsideInput(event.offsetX, event.offsetY);
    
      if (input) {
        Thundersnow.editor.edgeDblClickInput(event, input);
      }
      else {
        
      }
      
    });
    
    this.keyDown(function(event) {
      
      switch(event.keyCode) {
        case 38: // up
          node.moveBy(node.x, 0, node.y, -5);
          break;
        case 39: // right
          node.moveBy(node.x, 5, node.y, 0);
          break;
        case 40: // down
          node.moveBy(node.x, 0, node.y, 5);
          break;
        case 37: // left
          node.moveBy(node.x, -5, node.y, 0);
          break;
        case 68: // d
          node.remove();
          break;
      }
      Thundersnow.editor.redraw();

    });
    
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
  
  _mouseWasOver: false,
  
  mouseOver: function(callback) {
    this._mouseOverCallbacks.push(callback);
  },
  
  mouseEnter: function(callback) {
    this._mouseEnterCallbacks.push(callback);
  },
  
  mouseLeave: function(callback) {
    this._mouseLeaveCallbacks.push(callback);
  },
  
  mouseMove: function(callback) {
    this._mouseMoveCallbacks.push(callback);
  },
  
  click: function(callback) {
    this._clickCallbacks.push(callback);
  },
  
  dblClick: function(callback) {
    this._dblClickCallbacks.push(callback);
  },
  
  mouseDown: function(callback) {
    this._mouseDownCallbacks.push(callback);
  },
  
  mouseUp: function(callback) {
    this._mouseUpCallbacks.push(callback);
  },
  
  keyDown: function(callback) {
    this._keyDownCallbacks.push(callback);
  },
  
  keyUp: function(callback) {
    this._keyUpCallbacks.push(callback);
  }
  
}