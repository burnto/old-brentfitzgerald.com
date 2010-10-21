/* --- COLOR -------------------------------------------------------------- */

function Color(r,g,b) {
  this.r = r;
  this.g = g;
  this.b = b;
}
Color.prototype = {
  toString: function() {
    return 'rgb(' + this.r + ',' + this.g + ',' + this.b + ')'
  },
  invert: function() {
    return(new Color(255 - this.r, 255 - this.g, 255 - this.b));
  }
}

/* --- Random ------------------------------------------------------------- */

var Random = {
  randomInt: function(max) {
    return Math.floor(Math.random()*max);
  }
}

/* --- GRID --------------------------------------------------------------- */

function Grid(defaultValue) {
  this.defaultValue = defaultValue;
  this.values = [[]];
  this.height = 0;
  this.width = 0;
}
Grid.prototype = {
  addRow: function(defaultValue) {
    if(defaultValue === undefined) {
      defaultValue = this.defaultValue;
    }
    for(var j = 0; j < this.width; j++) {
      this.values[j].append(defaultValue);
    }
    this.height += 1;
  },
  addCol: function(defaultValue) {
    if(defaultValue === undefined) {
      defaultValue = this.defaultValue;
    }
    var newCol = Array(this.height);
    for(var i = 0; i < this.height; i++) { 
      newCol[i] = defaultValue;
    }
    this.values[this.width] = newCol;
    this.width += 1;
  },
  get: function(x, y) {
    return this.values[x][y];
  },
  set: function(x, y, value) {
    this.values[x][y] = value;
  }
}

/* --- TINY --------------------------------------------------------------- */

var Tiny = function() {
    
  var inkColor = new Color(255,0,0)
  var pixSize = 32;
  var grid = new Grid(inkColor.invert());
  var drawing = false;
  var canvas;
  var ctx;
  var lastPos;
  
    
  function screen2Grid(x, y) {
    return {
      "x": Math.floor(x / pixSize),
      "y": Math.floor(y / pixSize)
    }
  }
  
  function mouseDown(e) {
    var pos = screen2Grid(e.pageX, e.pageY);
    if(lastPos === undefined) lastPos = pos;
    drawing = true;
    inkColor = grid.get(pos.x, pos.y).invert();
    drawPix(pos.x, pos.y, inkColor);
    return false;
  }
  function mouseUp(e) {
    var pos = screen2Grid(e.pageX, e.pageY);
    drawing = false;
    return false;
  }

  function mouseMove(e) {
    var pos = screen2Grid(e.pageX, e.pageY);
    
    if(drawing) {
      drawPix(pos.x, pos.y, inkColor)
    }
    return false;
  }

  function resizeGrid() {
    canvas.attr({"width": $(window).width(), "height": $("body").height()});
    var winWidth = $(window).width();
    var winHeight = $("body").height();
    var gridWidth = Math.ceil(winWidth / pixSize);
    var gridHeight = Math.ceil(winHeight / pixSize);
    while(grid.height < gridHeight) {
      grid.addRow();
    }
    while(grid.width < gridWidth) {
      grid.addCol();
    }
    drawGrid();
  }

  function drawPix(x, y, color) {
    ctx.fillStyle = color.toString();
    ctx.fillRect(x * pixSize, y * pixSize, pixSize, pixSize);
    grid.set(x, y, color);
  }

  function drawGrid() {
    for(var x = 0; x < grid.width; x++) {
      for(var y = 0; y < grid.height; y++) {
        drawPix(x, y, grid.get(x, y));
      }
    }
  }
  
  return {
    init: function() {
      canvas = $("canvas")
        .css({width: "100%", height: "100%"})
        .mousedown(mouseDown)
        .bind('touchstart', mouseDown)
        .mousemove(mouseMove)
        .bind('touchmove', mouseMove)
      ctx = canvas.get(0).getContext("2d");
      $(window)
        .mouseup(mouseUp)
        .bind('touchend', mouseUp)
        .resize(resizeGrid)
        .trigger("resize")
      drawGrid(grid, ctx);
      // .mousemove(function(e) {
      //   // bpf.draw(e.pageX, e.pageY);
      // }).mousedown(function(e) {
      //   // pixSize = 256;
      //   // bpf.draw(e.pageX, e.pageY);
      // }).mouseup(function(e) {
      //   // pixSize = 32;
      //   // bpf.draw(e.pageX, e.pageY);
      // })
    }
      // 
      // 
      // draw: function(pageX, pageY, size) {
      //   pageX = pageX || -1;
      //   pageY = pageY || -1;
      //   size = size || pixSize;
      //   var width = $(window).width();
      //   var height = $("body").height();
      //   var canvas = $("canvas")
      //     .attr({"width": width, "height": height});
      // 
      //   cv = canvas.get(0)
      //   if (typeof(G_vmlCanvasManager) != 'undefined') { // ie IE
      //     G_vmlCanvasManager.initElement(cv);
      //     alert(cv);
      //   }
      // 
      //   var ctx = cv.getContext("2d");
      //   for(var y = 0; y < height; y+=size) { 
      //     for(var x = 0; x < width; x+=size) {
      //       var color = [];
      //       if(pageX < x || pageX >= x + size || pageY < y || pageY >= y + size) {
      //         color.push(bpf.randomInt(255));
      //         color.push(bpf.randomInt(255));
      //         color.push(bpf.randomInt(255));
      //       }else{
      //         color = [255,255,255];
      //       }
      //       ctx.fillStyle = "rgb(" + color.join(',') + ")";
      //       ctx.fillRect(x, y, pixSize, pixSize);
      //     }
      //   }
      // },  
  }
}()