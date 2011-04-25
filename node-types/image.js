/*

Image
-----

*/ 

Thundersnow.nodeTypes.image = {
    
  init: function() {
    
    this.createInput("url", null);
    
    this.createOutput("image", null);
    
  },
  
  runLoop: function(time) {
    if (!this.previousUrl) {
      this.previousUrl = null;
    }
    if (this.previousUrl != this.inputAttributes.url) {
      this.previousUrl = this.inputAttributes.url;
      image = new Image();
      image.src = this.inputAttributes.url;
      this.outputAttributes.image = image;
    }
  }
  
}