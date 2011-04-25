/*

Sprite
------

*/ 

Thundersnow.nodeTypes.sprite = {
    
  init: function() {
    
    this.createInput("x", 0);
    this.createInput("y", 0);
    this.createInput("width", 0.5);
    this.createInput("height", 0.5);
    this.createInput("color", "#FFF");
    this.createInput("image", null);
    
  },
  
  runLoop: function(time) {
    
    var t = {
      x: this.tX(this.inputAttributes.x) - this.tW(this.inputAttributes.width/2),
      y: this.tY(this.inputAttributes.y) - this.tH(this.inputAttributes.height/2),
      h: this.tH(this.inputAttributes.height),
      w: this.tW(this.inputAttributes.width)
    }
    
    if (this.inputAttributes.image) {
      this.vc.drawImage(this.inputAttributes.image, t.x, t.y, t.w, t.h);
    }
    else {
      this.vc.fillStyle = this.inputAttributes.color;
      this.vc.fillRect(t.x, t.y, t.w, t.h);
      
    }
  }
  
}