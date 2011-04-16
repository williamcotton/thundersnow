/*

Sprite
------

*/ 

Thundersnow.nodeTypes.sprite = {
    
  init: function() {
    
    this.createInput("x", 0);
    this.createInput("y", 0);
    this.createInput("width", 10);
    this.createInput("height", 10);
    this.createInput("color", "#FFF");
    
  },
  
  runLoop: function(time) {
    this.vc.fillStyle = this.inputAttributes.color;
    this.vc.fillRect(this.inputAttributes.x, this.inputAttributes.y, this.inputAttributes.width, this.inputAttributes.height);
  }
  
}