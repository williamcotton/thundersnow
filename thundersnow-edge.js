/*

Edge
----

*/


Thundersnow.Edge = function(options) {
  
  if (Thundersnow.editor) { // EDITOR DEP
    this.ec = Thundersnow.editor.context;
  }
  else {
    this.draw = function() {};
  }
  
  Thundersnow.edges.push(this);
  
  // this constructor is a little weird, because it handles both a fully created edge and one that is in the process of completed by user interaction...
  
  if (options.output_node && options.output_attribute && options.input_node && options.input_attribute) {
    
    var output_node = options.output_node;
    var output_attribute = options.output_attribute;
    var input_node = options.input_node;
    var input_attribute = options.input_attribute;
    
    this.output = output_node.findOutput(output_attribute);
    
    var input = input_node.findInput(input_attribute);
    this.makeConnection(input);
    
  }
  else {
    this.output = options.output;
  }
  this.output.edge = this;
  this.uuid = Thundersnow.generateUUID();
}

Thundersnow.Edge.prototype = {
  
  makeConnection: function(input) {
    this.input = input;
    this.input.edge = this;
    this.draw(this.output.x, this.output.y, this.input.x, this.input.y);
  },
  
  update: function(x, y) {
    this.draw(this.output.x, this.output.y, x, y);
  },
  
  draw: function(x1, y1, x2, y2) {
    this.ec.strokeStyle = "rgba(255,0,0,0.7)";
    this.ec.lineWidth = this.lineWidth || 4;
    this.ec.beginPath();
    this.ec.moveTo(x1, y1);
    this.ec.lineTo(x2, y2);
    this.ec.stroke();
    this.ec.closePath();
  },
  
  redraw: function() {
    if (this.input && this.output) {
      this.draw(this.output.x, this.output.y, this.input.x, this.input.y);
    }
  },
  
  toJSON: function() {
    var json = {
      output_node_uuid: this.output.node.uuid,
      output_attribute: this.output.name,
      input_node_uuid: this.input.node.uuid,
      input_attribute: this.input.name,
    }
    return json;
  }
  
}