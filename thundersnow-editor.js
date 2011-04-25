/*

Editor Canvas
-------------

*/

Thundersnow.editor = {
  
  _width: 800,
  _height: 600,
  activeNodes: [],
  
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
    this.rootElement = this.element;
    this.rootContext = this.context;
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
      Thundersnow.onChange();
    }
    window.onkeydown = function(event) {
      that.nodeKeyDownEvent(event);
      that.keyDown(event);
    }
    window.onkeyup = function(event) {
      that.keyUp(event);
      that.nodeKeyUpEvent(event);
      Thundersnow.onChange();
    }
    
    
    if (typeof(FileReader) != "undefined") {
      var stopDropAndRoll = function(event) {
        event.stopPropagation();
        event.preventDefault();
      }
      this.element.addEventListener("dragenter", stopDropAndRoll, false);
      this.element.addEventListener("dragexit", stopDropAndRoll, false);
      this.element.addEventListener("dragover", stopDropAndRoll, false);
      this.element.addEventListener("drop", function(event) {
        stopDropAndRoll(event);
        that.dropEvent(event);
      }, false);
    }
    
  },
  
  
  
  redraw: function() {
    if (this.currentCanvas && this.currentCanvas != this.rootCanvas) {
      this.context.clearRect(0,0,this._width,this._height);
      this.context.drawImage(this.currentCanvas, 0, 0);
    }
    else {
      this.context.clearRect(0,0,this._width,this._height);
      for (var n in this.nodes) {
        var node = this.nodes[n];
        node.redraw();
      }
      for (var e in this.edges) {
        var edge = this.edges[e];
        edge.redraw();
      }
    }
    


  },
  
  nodeKeyDownEvent: function(event) {
    for (var n in this.activeNodes) {
      var node = this.activeNodes[n];
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
    }
  },
  
  nodeKeyUpEvent: function(event) {

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
        
        // REFACTOR THIS STUPID IO RELATED STUFF
        
      }
      else if (input) {
        this.edgeMouseDownInput(event, input);
      }
      else {        
        if (this.shiftKey) {
          this.addToActiveNodes(node);
        }
        else if (this.activeNodes.length < 2) {
          this.setActiveNode(node);
        }
        this.nodesAreBeingMoved = true;
        
        for (var n in this.activeNodes) {
          var node = this.activeNodes[n];
          node.startCoordinatesForMove = {
            clickX: event.offsetX,
            clickY: event.offsetY,
            nodeX: parseInt(node.x),
            nodeY: parseInt(node.y)
          }
        }
        

      }
    }
    else {
      this.mouseDown(event);
    }
  },
  
  nodeMouseUpEvent: function(event) {
    var node = this.nodeInEvent(event);
    if (node) {
      this.nodesAreBeingMoved = false;

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
  
  mouseDown: function(event) {
    this.inactivateAllNodes();
    this.startSelectionBox(event);
  },
  
  mouseUp: function(event) {
    if (this.edgeIsBeingCreated) {
      this.edges.splice(this.edges.indexOf(this.edgeBeingCreated),1);
      this.cancelEdgeCreation();
      this.edgeBeingCreated = null;
    }
    
    for (var n in this.nodes) {
      var node = this.nodes[n];
      node.beingMoved = false;
    }
    
    this.isSelecting = false;
    this.redraw();
    
  },
  
  mouseMove: function(event) {
    for (var n in this.activeNodes) {
      var node = this.activeNodes[n];
      if (node && this.nodesAreBeingMoved) {
        node.moveBy(node.startCoordinatesForMove.nodeX, event.offsetX - node.startCoordinatesForMove.clickX, node.startCoordinatesForMove.nodeY, event.offsetY - node.startCoordinatesForMove.clickY);
        Thundersnow.editor.redraw();
      }
    }
    if (this.isSelecting) {
      this.updateSelectionBox(event);
    }
  },
  
  startSelectionBox: function(event) {
    this.isSelecting = true;
    this.selectX = event.offsetX;
    this.selectY = event.offsetY;
  },
  
  updateSelectionBox: function(event) {
    var box = {
      x: event.offsetX,
      y: event.offsetY,
      width: this.selectX - event.offsetX,
      height: this.selectY - event.offsetY
    }
    this.checkForSelectionBoxNodeIntersection(box);
    this.drawSelectionBox(box);    
  },
  
  drawSelectionBox: function(box) {
    this.redraw();
    this.context.fillStyle = "rgba(230,230,230,0.1)";
    this.context.fillRect(box.x,box.y,box.width,box.height);
  },
  
  checkForSelectionBoxNodeIntersection: function(selection_box) {
    
    var isIntersecting = function(box1, box2) {
      
      console.log(box2.x, box2.y, box2.width, box2.height);
      
      //Thundersnow.editor.redraw();
      
      // Thundersnow.editor.context.fillStyle = "rgba(230,0,0,1)";
      // Thundersnow.editor.context.fillRect(box1.x,box1.y,box1.width,box1.height);
      // 
      // Thundersnow.editor.context.fillStyle = "rgba(230,0,230,1)";
      // Thundersnow.editor.context.fillRect(box2.x,box2.y,box2.width,box2.height);
      
      
      if (!((box1.x + box1.width) >= box2.x)) {
        console.log("!box1.x + box1.width >= box2.x", box1.x + box1.width, box2.x);
        return false;
      }
      if (!(box1.x <= (box2.x + box2.width))) {
        console.log("!box1.x <= box2.x + box2.width", box1.x, box2.x + box2.width);
        return false;
      }
      if (!((box1.y - box1.height) <= box2.y)) {
        console.log("!box1.y - box1.height <= box2.y", box1.y - box1.height, box2.y);
        return false;
      }
      if (!(box1.y >= (box2.y - box2.height))) {
        console.log("!box1.y >= box2.y - box2.height", box1.y, box2.y - box2.height);
        return 0;
      }
      return true;
    }
    
    for (var n in this.nodes) {
      var node = this.nodes[n];
      
      console.log(n, node.x, node.y);
      if (isIntersecting(node, selection_box)) {
        if (!this.isNodeActive(node)) {
          this.addToActiveNodes(node);
        }
      }
      else {
        if (this.isNodeActive(node)) {
          this.removeFromActiveNodes(node);
        }
      }
    }
  },
  
  
  addToActiveNodes: function(node) {
    this.nodes.splice(this.nodes.indexOf(node),1);
    this.nodes.push(node);
    node.setActive();
    this.activeNodes.push(node);
    this.redraw();
  },
  
  removeFromActiveNodes: function(node) {
    this.activeNodes.splice(this.activeNodes.indexOf(node),1);
    node.setInactive();
    this.redraw();
  },
  
  isNodeActive: function(node) {
    for (var n in this.activeNodes) {
      var active_node = this.activeNodes[n];
      if (node == active_node) {
        return true;
      }
    }
    return false;
  },
  
  inactivateAllNodes: function() {
    this.activeNodes = [];
    for (var n in this.nodes) {
      var node = this.nodes[n];
      node.setInactive();
    }
    this.redraw();
  },
  
  setActiveNode: function(active_node) {
    this.inactivateAllNodes();
    this.addToActiveNodes(active_node);
    this.redraw();
  },
  
  removeNode: function(node) {
    this.removeFromActiveNodes(node);
    this.nodes.splice(this.nodes.indexOf(node),1);
    for (var e in this.edges) {
      var edge = this.edges[e];
      if (edge.input.node == node || edge.output.node == node) {
        this.edges.splice(this.edges.indexOf(edge),1);
      }
    }
    delete(node);
  },
  
  createNode: function(options) {
    if (Thundersnow.nodeTypes[options.nodeType]) {
      node = new Thundersnow.Node({
        x: this.previouslyCreatedNodePosition.x + 10,
        y: this.previouslyCreatedNodePosition.y + 10,
        nodeType: options.nodeType
      });
      this.setActiveNode(node);
    }    
  },
  
  copyActiveNode: function() {
    
  },
  
  pasteNode: function() {
    
  },
  
  keyUp: function(event) {
    switch(event.keyCode) {
      case 16:
        this.shiftKey = false;
        break;
    }
  },
  
  keyDown: function(event) {
    
    switch(event.keyCode) {
      case 13:
        if (event.metaKey) {
          this.toggleAddNodeWindow();
        }
        break;
      case 16:
        this.shiftKey = true;
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
  
  dropEvent: function(event) { 
    
    var drop = event;
       
    var files = event.dataTransfer.files;
  	var count = files.length;
  	
  	var file = files[0];
  	
  	var reader = new FileReader();

  	// init the reader event handlers
  	reader.onloadend = function(event) {
    	var img = new Image();
    	img.src = event.target.result;
    	
    	var image = new Thundersnow.Node({
        inputAttributes: {
          url: event.target.result
        },
        x: drop.offsetX,
        y: drop.offsetY,
        nodeType: "image",
        name: file.name
      });
    	
  	};

  	// begin the read operation
  	reader.readAsDataURL(file);
    
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
  },
  
  createMacro: function(event) {
    macro = new Thundersnow.Node({
      x: 10,
      y: 10,
      nodeType: "macro"
    });
    var cc = this.createNewEditorCanvasAndContext();
    macro.canvas = cc.canvas;
    macro.context = cc.context;
    for (var n in this.activeNodes) {
      var node = this.activeNodes[n];
      node.ec = macro.context;
      for (var e in this.edges) {
        var edge = this.edges[e];
        if (edge.input.node == node || edge.output.node == node) {
          edge.ec = macro.context;
        }
      }
    }

    this.redraw();
    
  },
  
  createNewEditorCanvasAndContext: function() {
    var canvas = document.createElement('canvas');
    canvas.style.backgroundColor = "#333";
    canvas.width = this._width;
    canvas.height = this._height;
    var context = canvas.getContext('2d');
    context.clearRect(0,0,this._width,this._height);
    return {
      context: context,
      canvas: canvas
    }
  }
  
}