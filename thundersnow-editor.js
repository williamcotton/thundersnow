/*

Editor Canvas
-------------

*/

Thundersnow.editor = {
  
  _width: 800,
  _height: 600,
  
  init: function() {
    this.cancelEdgeCreation();
    this.nodes = Thundersnow.nodes;
    this.edges = Thundersnow.edges;
    this.initCanvas();
    this.initEvents();
    this.previouslyCreatedNodePosition = {
      x: 10,
      y: 10
    }
  },
  
  initCanvas: function() {
    this.element = document.createElement('canvas');
    this.element.style.backgroundColor = "#333";
    this.element.width = this._width;
    this.element.height = this._height;
    this.context = this.element.getContext('2d');
    this.context.clearRect(0,0,this._width,this._height);
    document.body.appendChild(this.element);
    this.element.focus();
  },
  
  initEvents: function() {
    var that = this;
    this.element.onmousemove = function(event) {
      that.nodeAllMouseMove(event);
      that.edgeMouseMove(event);
      that.mouseMove(event);
    }
    this.element.onclick = function(event) {
      that.nodeClickEvent(event);
    }
    this.element.ondblclick = function(event) {
      that.nodeDblClickEvent(event);
    }
    this.element.onmousedown = function(event) {
      that.nodeMouseDownEvent(event);
    }
    this.element.onmouseup = function(event) {
      that.nodeMouseUpEvent(event);
    }
    window.onkeydown = function(event) {
      that.nodeKeyDownEvent(event);
      that.keyDown(event);
    }
    window.onkeyup = function(event) {
      that.nodeKeyUpEvent(event);
    }
  },
  
  redraw: function() {
    this.context.clearRect(0,0,this._width,this._height);
    for (var n in this.nodes) {
      var node = this.nodes[n];
      node.redraw();
    }
    for (var e in this.edges) {
      var edge = this.edges[e];
      edge.redraw();
    }

  },
  
  nodeKeyDownEvent: function(event) {
    node = this.activeNode;
    if (node) {
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
    }
  },
  
  nodeKeyUpEvent: function(event) {
    node = this.activeNode;
    if (node) {

    }
  },
  
  nodeInEvent: function(event) {
    for (var n in this.nodes) {
      var node = this.nodes[n];
      if (node.isCoordinateInside(event.offsetX,event.offsetY)) {
        return node;
      }
    }
  },
  
  nodeClickEvent: function(event) {
    var node = this.nodeInEvent(event);
    if (node) {
      
    }
  },
  
  nodeMouseDownEvent: function(event) {
    var node = this.nodeInEvent(event);
    if (node) {
      var output = node.isCoordinateInsideOutput(event.offsetX, event.offsetY);
      var input = node.isCoordinateInsideInput(event.offsetX, event.offsetY);

      if (output) {
        this.edgeMouseDownOutput(event, output);
        //this.nodeMouseDownOnOutputEvent(node, output, event);
        
        // CURRENTLY REFACTORING THIS STUPID IO RELATED STUFF
        
      }
      else if (input) {
        this.edgeMouseDownInput(event, input);
      }
      else {
        this.setActiveNode(node);
        node.isBeingMoved = true;
        node.startCoordinatesForMove = {
          clickX: event.offsetX,
          clickY: event.offsetY,
          nodeX: parseInt(node.x),
          nodeY: parseInt(node.y)
        }
      }
    }
  },
  
  nodeMouseUpEvent: function(event) {
    var node = this.nodeInEvent(event);
    if (node) {
      node.isBeingMoved = false;

      var input = node.isCoordinateInsideInput(event.offsetX, event.offsetY);
      var output = node.isCoordinateInsideOutput(event.offsetX, event.offsetY);

      if (input) {
        this.edgeMouseUpInput(event, input);
      }
      else if (output) {
        this.edgeMouseUpOutput(event, output);
      }
      else {
        this.mouseUp(event);
      }
    }
    else {
      this.mouseUp(event);
    }
  },
  
  nodeDblClickEvent: function(event) {
    var node = this.nodeInEvent(event);
    if (node) {
      var input = node.isCoordinateInsideInput(event.offsetX, event.offsetY);
    
      if (input) {
        this.edgeDblClickInput(event, input);
      }
      else {
        
      }
    }
  },
  
  nodeAllMouseMove: function(event) {
    var node = this.nodeInEvent(event);
    if (node) {
      if (!node._mouseWasOver) {
        this.nodeMouseEnterEvent(node, event);
      }
      this.nodeMouseOverEvent(node, event);
      this.nodeMouseMoveEvent(node, event);
      node._mouseWasOver = true;
    }
    else {
      for (var n in this.nodes) {
        var node = this.nodes[n];
        if (node._mouseWasOver) {
          this.nodeMouseLeaveEvent(node, event);
        }
        node._mouseWasOver = false;
      }
    }
  },
  
  nodeMouseEnterEvent: function(node, event) {
    
  },
  
  nodeMouseLeaveEvent: function(node, event) {
    
  },
  
  nodeMouseOverEvent: function(node, event) {
    
  },
  
  nodeMouseMoveEvent: function(node, event) {
    
  },
  
  edgeMouseMove: function(event) {
    if (this.edgeIsBeingCreated) {
      this.redraw();
      this.edgeBeingCreated.update(event.offsetX, event.offsetY);
    }
    else {
      
    }
  },
  
  nodeMouseDownOnOutputEvent: function(node, output, event) {
    var edge = new Thundersnow.Edge({
      output_node: node,
      output_attribute: output.name
    });
  },

  edgeMouseDownOutput: function(event, output) {
    var edge = new Thundersnow.Edge({
      output: output
    });
    this.startEdgeCreation(edge);
  },
  
  edgeMouseUpInput: function(event, input) {
    console.log(this.edgeIsBeingCreated);
    if (this.edgeIsBeingCreated && input != this.previousInputForEdgeBeingCreated) {
      console.log("make the connection!");
      this.edgeBeingCreated.makeConnection(input);
      this.previousInputForEdgeBeingCreated = null;
      this.redraw();
    }
    this.cancelEdgeCreation();
  },
  
  edgeMouseUpOutput: function(event, output) {

  },
  
  edgeMouseDownInput: function(event, input) {
    if (input.edge) {
      this.startEdgeCreation(input.edge);
      this.previousInputForEdgeBeingCreated = input;
      input.edge.input = null;
    }
  },
  
  startEdgeCreation: function(edge) {
    this.edgeIsBeingCreated = true;
    this.edgeBeingCreated = edge;
    this.previousInputForEdgeBeingCreated = null;
  },
  
  cancelEdgeCreation: function() {
    this.edgeIsBeingCreated = false;
    this.edgeBeingCreated = null;
  },
  
  edgeDblClickInput: function(event, input) {
    input.node.enableDirectInput(input);
    this.currentDirectInput = input;
  },
  
  mouseUp: function(event) {
    if (this.edgeIsBeingCreated) {
      this.edges.splice(this.edges.indexOf(this.edgeBeingCreated),1);
      this.cancelEdgeCreation();
      this.edgeBeingCreated = null;
      this.redraw();
    }
    
    for (var n in this.nodes) {
      var node = this.nodes[n];
      node.beingMoved = false;
    }
    
  },
  
  mouseMove: function(event) {
    var node = this.activeNode;
    if (node && node.isBeingMoved) {
      if (node.isBeingMoved) {
        node.moveBy(node.startCoordinatesForMove.nodeX, event.offsetX - node.startCoordinatesForMove.clickX, node.startCoordinatesForMove.nodeY, event.offsetY - node.startCoordinatesForMove.clickY);
        Thundersnow.editor.redraw();
      }
    }
  },
  
  setActiveNode: function(active_node) {
    for (var n in this.nodes) {
      var node = this.nodes[n];
      if (node == active_node) {
        node.setActive();
      }
      else {
        node.setInactive();
      }
    }
    
    this.nodes.splice(this.nodes.indexOf(active_node),1);
    this.nodes.push(active_node);
    
    this.activeNode = active_node;
    this.redraw();
  },
  
  removeNode: function(node) {
    this.nodes.splice(this.nodes.indexOf(node),1);
    for (var e in this.edges) {
      var edge = this.edges[e];
      if (edge.input.node == node || edge.output.node == node) {
        this.edges.splice(this.edges.indexOf(edge),1);
      }
    }
    delete(node);
    this.activeNode = false;
  },
  
  createNode: function(options) {
    if (Thundersnow.nodeTypes[options.nodeType]) {
      this.activeNode = new Thundersnow.Node({
        x: this.previouslyCreatedNodePosition.x + 10,
        y: this.previouslyCreatedNodePosition.y + 10,
        nodeType: options.nodeType
      });
    }    
  },
  
  copyActiveNode: function() {
    
  },
  
  pasteNode: function() {
    
  },
  
  keyDown: function(event) {
    
    switch(event.keyCode) {
      case 13:
        if (event.metaKey) {
          this.toggleAddNodeWindow();
        }
        break;
    }
  },
  
  toggleAddNodeWindow: function() {
    if (!this.addNodeWindowElement || this.addNodeWindowElement.style.display == "none") {
      this.showAddNodeWindow();
    }
    else {
      this.hideAddNodeWindow();
    }
  },
  
  showAddNodeWindow: function() {
    if (!this.addNodeWindowElement) {
      this.addNodeWindowElement = document.createElement('div');
      this.addNodeWindowElement.id = ""
      document.body.appendChild(this.addNodeWindowElement);
      this.addNodeWindowElement.style.backgroundColor = "#DDD";
      this.addNodeWindowElement.style.width = this._width + "px";
      this.addNodeInputElement = document.createElement('input');
      this.addNodeWindowElement.appendChild(this.addNodeInputElement);
      
      
      var editor = this;
      
      this.addNodeInputElement.onkeydown = function(event) {
        if (editor.addNodeWindowElement.style.display != "none") {
          if (event.keyCode == 13) { // Enter
            editor.createNode({
              nodeType: editor.addNodeInputElement.value
            });
            editor.hideAddNodeWindow();
          }
          if (event.keyCode == 27) { // Escape
            editor.hideAddNodeWindow();
          }
        }
      }
      
    }
    this.addNodeWindowElement.style.display = "block";
    this.addNodeInputElement.focus();
    this.addNodeInputElement.select();
  },
  
  hideAddNodeWindow: function() {
    this.addNodeWindowElement.style.display = "none";
  },
  
  roundRect: function(ctx, x, y, width, height, radius, fill, stroke) {
    if (typeof stroke == "undefined" ) {
      stroke = true;
    }
    if (typeof radius === "undefined") {
      radius = 5;
    }
    ctx.beginPath();
    ctx.moveTo(x + radius, y);
    ctx.lineTo(x + width - radius, y);
    ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
    ctx.lineTo(x + width, y + height - radius);
    ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
    ctx.lineTo(x + radius, y + height);
    ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
    ctx.lineTo(x, y + radius);
    ctx.quadraticCurveTo(x, y, x + radius, y);
    ctx.closePath();
    if (stroke) {
      ctx.stroke();
    }
    if (fill) {
      ctx.fill();
    }        
  }
  
}