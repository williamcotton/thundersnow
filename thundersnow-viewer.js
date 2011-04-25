/*

Viewer Canvas
-------------

*/

// it would be pretty amazing if the editor code and the viewer code were independent... AND THEY ARE!

Thundersnow.viewer = {
  
  _width: 800,
  _height: 600,
  
  init: function() {
    this.nodes = Thundersnow.nodes;
    this.edges = Thundersnow.edges;
    this.initCanvas();
    this.initRunLoop();
  },
  
  initCanvas: function() {
    this.element = document.createElement('canvas');
    this.element.style.backgroundColor = "#000";
    this.element.width = this._width;
    this.element.height = this._height;
    this.context = this.element.getContext('2d');
    this.context.clearRect(0,0,this._width,this._height);
    document.body.appendChild(this.element);
  },
  
  initTransport: function() {
    
  },
  
  initEvents: function() {
    
  },
  
  initRunLoop: function() {
    /* NON-SYSTEM CLOCK BASED */ Thundersnow.globalTime = 0.0;
    /* SYSTEM CLOCK BASED */ // Thundersnow.globalTimeStart = Date.now()/1000;
    this.play();
  },
  
  play: function() {
    var that = this;
    this.runLoopInterval = setInterval(function() {
      that.runLoop();
    }, 33);
  },
  
  pause: function() {
    clearInterval(this.runLoopInterval);
  },
  
  runLoop: function() {
    
    this.context.clearRect(0,0,this._width,this._height);
    /* NON-SYSTEM CLOCK BASED */ Thundersnow.globalTime += 0.033;
    /* SYSTEM CLOCK BASED */ // Thundersnow.globalTime = (Date.now()/1000) - Thundersnow.globalTimeStart;
    
    for (var e in this.edges) {
      var edge = this.edges[e];
      if (edge.input && edge.output) {
        edge.input.node.inputAttributes[edge.input.name] = edge.output.node.outputAttributes[edge.output.name];
      }
    }
    
    for (var n in this.nodes) {
      var node = this.nodes[n];
      if (node.runLoop) {
        this.context.save();
        node.runLoop(Thundersnow.globalTime);
        this.context.restore();
      }
    }
    
  },
  
  origin: function() {
    return {
      x: Thundersnow.viewer._width/2,
      y: Thundersnow.viewer._height/2
    }
  },
  
  tX: function(x) {
    return (parseFloat(x) + 1) * (Thundersnow.viewer._width/2);
  },
  
  tY: function(y) {
    return ((parseFloat(y) + 1) * Thundersnow.viewer._height/2);
  },
  
  tW: function(w) {
    return parseFloat(w) * Thundersnow.viewer._width/2;
  },
  
  tH: function(h) {
    return parseFloat(h) * Thundersnow.viewer._height/2 * Thundersnow.viewer._width/Thundersnow.viewer._height;
  },
  
  translate: function(x,y,w,h) {
    var t = {
      x: Thundersnow.viewer.tX(x) - Thundersnow.viewer.tW(w)/2,
      y: Thundersnow.viewer.tY(y) - Thundersnow.viewer.tH(h)/2,
      w: Thundersnow.viewer.tW(w),
      h: Thundersnow.viewer.tH(h)
    }
    return t;
  }
  
}