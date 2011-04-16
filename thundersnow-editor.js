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
      that.nodeMouseMove(event);
      that.edgeMouseMove(event);
      that.mouseMove(event);
    }
    this.element.onclick = function(event) {
      that.nodeMouseEvent(event, "_clickCallbacks");
    }
    this.element.ondblclick = function(event) {
      that.nodeMouseEvent(event, "_dblClickCallbacks");
    }
    this.element.onmousedown = function(event) {
      that.nodeMouseEvent(event, "_mouseDownCallbacks");
    }
    this.element.onmouseup = function(event) {
      that.nodeMouseEvent(event, "_mouseUpCallbacks");
    }
    window.onkeydown = function(event) {
      that.nodeKeyEvent(event, "_keyDownCallbacks");
      that.keyDown(event);
    }
    window.onkeyup = function(event) {
      that.nodeKeyEvent(event, "_keyUpCallbacks");
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

  nodeKeyEvent: function(event, callback_list) {
    if (this.activeNode) {
      return this.nodeCallback(this.activeNode, callback_list);
    }
  },
  
  nodeMouseMove: function(event) {
    for (var n in this.nodes) {
      var node = this.nodes[n];
      if (node.isCoordinateInside(event.offsetX,event.offsetY)) {
        if (!node._mouseWasOver) {
          this.nodeCallback(node, "_mouseEnterCallbacks");
        }
        this.nodeCallback(node, "_mouseOverCallbacks");
        this.nodeCallback(node, "_mouseMoveCallbacks");
        node._mouseWasOver = true;
      }
      else {
        if (node._mouseWasOver) {
          this.nodeCallback(node, "_mouseLeaveCallbacks");
        }
        node._mouseWasOver = false;
      }
    }
  },
  
  nodeMouseEvent: function(event, callback_list) {
    for (var n in this.nodes.reverse()) { // reversed so we get the activeNode first..
      var node = this.nodes[n];
      if (node.isCoordinateInside(event.offsetX,event.offsetY)) {
        this.nodeCallback(node, callback_list);
        return;
      }
      else if ((callback_list == "_mouseUpCallbacks") && ((parseInt(n) + 1) >= this.nodes.length)) {
        this.mouseUp(event);
        return;
      }
    }
  },
  
  nodeCallback: function(node, callback_list) {
    for (var c in node[callback_list]) {
      var callback = node[callback_list][c];
      return callback(event);
    }
  },
  
  edgeMouseMove: function(event) {
    if (this.edgeIsBeingCreated) {
      this.redraw();
      this.edgeBeingCreated.update(event.offsetX, event.offsetY);
    }
    else {
      
    }
  },

  edgeMouseDownOutput: function(event, output) {
    var edge = new Thundersnow.Edge({
      output: output
    });
    this.startEdgeCreation(edge);
  },
  
  edgeMouseUpInput: function(event, input) {
    if (this.edgeIsBeingCreated && input != this.previousInputForEdgeBeingCreated) {
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
      this.cancelEdgeCreation();
      this.edges.splice(this.edges.indexOf(this.edgeBeingCreated),1);
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
  }
  
}