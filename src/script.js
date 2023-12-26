import './style.css';
import * as ms from "@magenta/sketch";
//const gui = new dat.GUI();

//Watercolor simplified simulation Pierre MARZIN 04/2017
var rimg, brush;
let model;
var inkels;
var drawing = false;
var w, h,brw,brh;
var x0, y0;
var a, r, g, b;
var dia=4;


const sketch = function(p) {
  //setup brush 
  const BASE_URL = 'https://storage.googleapis.com/quickdraw-models/sketchRNN/models/';
  const availableModels = [
    'bird', 
    'ant',
    'angel',
    'backpack',
    'barn',
    'basket',
    'bear',
    'bee',
    'beeflower',
    'bicycle',
    'book',
    'bus',
    'butterfly',
    'cactus',
    'castle',
    'cat',
    'catbus',
    'chair',
    'couch',
    'crab',
    'diving_board',
    'dog',
    'dogbunny',
    'dolphin',
    'duck',
    'elephant',
    'everything',
    'flamingo',
    'flower',
    'floweryoga',
    'frog',
    'frogsofa',
    'garden',
    'hand',
    'eye',
    'hedgeberry',
    'hedgehog',
    'kangaroo',
    'key',
    'lantern',
    'lighthouse',
    'lion',
    'lionsheep',
    'lobster',
    'map',
    'mermaid',
    'monkey',
    'octopus',
    'owl',
    'palm_tree',
    'parrot',
    'peas',
    'penguin',
    'pig',
    'pigsheep',
    'pineapple',
    'pool',
    'rabbit',
    'rabbitturtle',
    'rain',
    'rhinoceros',
    'sea_turtle',
    'sheep',
    'skull',
    'snail',
    'snowflake',
    'spider',
    'squirrel',
    'strawberry',
    'swan',
    'swing_set',
    'tractor',
    'trombone',
    'truck',
    'whale',
    'windmill',
    'yoga',
    'yogabicycle']; 

  //entry: [pixelsize, brush diameters]
  const modelpixelsizes = {
    bird:2.0,
    ant:0.5,
    angel:3.0,
    backpack:2.5,
    barn:10.0,
    basket:3.0,
    bear:5.0,
    bee:0.5,
    beeflower:1.0,
    bicycle:4.0,
    book:2.0,
    bus:6.0,
    butterfly:2.0,
    cactus:3.0,
    castle:10.0,
    cat:2.5,
    catbus:6.0,
    chair:3.5,
    couch:4.5,
    crab:1.5,
    diving_board:4.5,
    dog:3.5,
    dogbunny:2.5,
    dolphin:3.0,
    duck:3.0,
    elephant:6.0,
    everything:9.0,
    flamingo:3.0,
    flower:2.5,
    floweryoga:2.0,
    frog:2.5,
    frogsofa:4.0,
    garden:8.0,
    hand:3.0,
    eye:3.0,
    hedgeberry:4.0,
    hedgehog:3.0,
    kangaroo:3.0,
    key:2.0,
    lantern:3.0,
    lighthouse:7.0,
    lion:4.0,
    lionsheep:4.0,
    lobster:2.0,
    map:5.0,
    mermaid:4.5,
    monkey:3.5,
    octopus:3.0,
    owl:2.5,
    palm_tree:6.0,
    parrot:3.0,
    peas:2.0,
    penguin:4.0,
    pig:4.0,
    pigsheep:4.0,
    pineapple:2.0,
    pool:7.0,
    rabbit:2.0,
    rabbitturtle:2.0,
    rain:3.0,
    rhinoceros:5.0,
    sea_turtle:4.0,
    sheep:4.0,
    skull:3.0,
    snail:2.0,
    snowflake:3.0,
    spider:2.0,
    squirrel:2.0,
    strawberry:2.0,
    swan:3.5,
    swing_set:5.0,
    tractor:7.0,
    trombone:2.0,
    truck:8.0,
    whale:8.0,
    windmill:9.0,
    yoga:4.0,
    yogabicycle:4.0,
  }

  const modelbrushdiams = {
    bird:1.0,
    ant:0.5,
    angel:2.0,
    backpack:1.0,
    barn:2.0,
    basket:1.0,
    bear:3.0,
    bee:1.5,
    beeflower:1.0,
    bicycle:2.0,
    book:1.0,
    bus:3.0,
    butterfly:3.5,
    cactus:2.0,
    castle:3.0,
    cat:1.5,
    catbus:3.0,
    chair:1.5,
    couch:2.5,
    crab:1.5,
    diving_board:2.0,
    dog:1.5,
    dogbunny:1.0,
    dolphin:2.0,
    duck:3.0,
    elephant:3.0,
    everything:4.0,
    flamingo:2.0,
    flower:2.5,
    floweryoga:2.0,
    frog:1.0,
    frogsofa:4.0,
    garden:2.0,
    hand:2.0,
    eye:1.0,
    hedgeberry:4.0,
    hedgehog:2.0,
    kangaroo:2.0,
    key:2.0,
    lantern:1.0,
    lighthouse:2.0,
    lion:2.0,
    lionsheep:2.0,
    lobster:2.0,
    map:3.0,
    mermaid:1.5,
    monkey:1.5,
    octopus:2.0,
    owl:2.0,
    palm_tree:3.0,
    parrot:1.0,
    peas:4.0,
    penguin:1.0,
    pig:2.0,
    pigsheep:2.0,
    pineapple:2.0,
    pool:4.0,
    rabbit:1.0,
    rabbitturtle:1.0,
    rain:3.0,
    rhinoceros:1.0,
    sea_turtle:1.0,
    sheep:1.0,
    skull:2.0,
    snail:1.0,
    snowflake:1.0,
    spider:1.0,
    squirrel:1.0,
    strawberry:3.0,
    swan:1.0,
    swing_set:2.0,
    tractor:2.5,
    trombone:1.0,
    truck:3.0,
    whale:4.0,
    windmill:2.0,
    yoga:3.0,
    yogabicycle:2.0,
  }

  

  const nrmodels = availableModels.length;
  let modelState; // Store the hidden states of rnn's neurons.
  const temperature = 0.10; // Controls the amount of uncertainty of the model.
  let modelLoaded = false;

  let dx, dy; // Offsets of the pen strokes, in pixels.
  let x, y; // Absolute coordinates on the screen of where the pen is.
  let pen = [0,0,0]; // Current pen state, [pen_down, pen_up, pen_end].
  let previousPen = [1, 0, 0]; // Previous pen state.
  const PEN = {DOWN: 0, UP: 1, END: 2};

  // Load the model.
  //model = new ms.SketchRNN('https://storage.googleapis.com/quickdraw-models/sketchRNN/models/angel.gen.json');
  var choice = parseInt(Math.random() * nrmodels);
  model = new ms.SketchRNN(`${BASE_URL}${availableModels[choice]}.gen.json`);
  console.log(availableModels[choice]);
  /*
   * Main p5 code
   */
  p.preload = function(){
    brush = p.loadImage("brush-3.png");
  }


  p.setup = function() {

    const containerSize = document.getElementById('sketch').getBoundingClientRect();
    // Initialize the canvas.
    var screenWidth;
    console.log()
    if(detectMob()){
        console.log("mobile");
        screenWidth = window.innerWidth;
        console.log(screenWidth);
    }
    else{
        console.log("not mobile");
        screenWidth = window.innerWidth*0.997;
    }
    console.log(window.innerWidth);
    console.log(screenWidth);
    const screenHeight = window.innerHeight * 0.994;
    var canvas = p.createCanvas(screenWidth, screenHeight);
    console.log(canvas.id);
    canvas.id = "drawing"
    console.log(canvas.id)
    p.frameRate(20);

    brw=brush.width/10;
    brh=brush.height/10;
    console.log(brw);
    p.imageMode(p.CENTER);
    //p.rectMode(p.CENTER);

    w = window.innerWidth;
    h = window.innerHeight;

    p.noFill();
    x0 = y0 = 0;
    inkels = [];
    brush.resize(dia * brush.width / 0.01, dia * brush.height / 0.01);
    //Loads the pixel data of the current display window into the pixels[] array.
    brush.loadPixels();
    //Creates a new PImage (the datatype for storing images)
    rimg = p.createImage(w, h);
    rimg.loadPixels();

    for (let i = 0; i < w; i++) {
        for (let j = 0; j < h; j++) {
          var pos = j * w + i;
          inkels.push(new Inkel(pos, i, j));
        }
    }

    model.initialize().then(function() {
      // Initialize the scale factor for the model. Bigger -> large outputs
      model.setPixelFactor(modelpixelsizes[availableModels[choice]]/100);
      modelLoaded = true;
      restart();
    });
  };

  p.mousePressed = function() {  
    //brush.resize(int(dia * brw)+int(dia * brw)%2, 0);
    modelLoaded = false;
    if (model) {
        console.log("disposed");
        model.dispose();
    }
    var choice = parseInt(Math.random() * nrmodels);
    model = new ms.SketchRNN(`${BASE_URL}${availableModels[choice]}.gen.json`);
    Promise.all([model.initialize()]).then(function() {
        modelLoaded = true;
        console.log('SketchRNN model loaded.');
        // Initialize the scale factor for the model. Bigger -> large outputs
        model.setPixelFactor(modelpixelsizes[availableModels[choice]]);
        restart();
    });
    dia = modelbrushdiams[availableModels[choice]]
    brush.resize(dia * brw, dia * brh);
    brush.loadPixels();
    drawing = true;
    a = p.random(0.3, 0.9);
    r = p.random(1);
    g = p.random(1);
    b = p.random(1);
  }
  
  p.mouseReleased = function() {
    drawing = false;
    x0 = p.mouseX;
    y0 = p.mouseY;
  }

  // Drawing loop.
  p.draw = function() {
    //p.background(204, 204, 204); //remove if u dont want flashing
    //console.log(modelLoaded);
    if (!modelLoaded) {
      console.log("model not loaded");
      return;
    }

    // If we finished the previous drawing, start a new one.
    if (previousPen[PEN.END] === 1) {
      console.log("start new pls");
      restart();
    }

    // Only draw on the paper if the pen is still touching the paper.
    //if (previousPen[PEN.DOWN] == 1) {
    if(drawing & modelLoaded){
        // New state.
        [dx, dy, ...pen] = sampleNewState();
        var d = p.dist(x+dx, y+dy, x, y);
        for (var i = 1; i < d; i++) {
          soak(brush, x + dx - i * (dx / d), y + dy - i * (dy / d));
        }
        soak(brush, x+dx, y+dy);
        //p.line(x, y, x+dx, y+dy); // Draw line connecting prev point to current point.

      for (var i = 0; i < w * h; i++) {
		if (inkels[i].wetness >= 3) inkels[i].wetness -=3;
        else inkels[i].wetness = 0;
		if (inkels[i].wetness > 200) {  
            var n = 0;
            var Aa = inkels[i].a;
            var Ar = inkels[i].r;
            var Ag = inkels[i].g;
            var Ab = inkels[i].b;
            var wt = inkels[i].wetness;

            for (var j = -1; j < 2; j++) {
                for (var k = -1; k < 2; k++) {
                    if ((j != 0 || k != 0) && typeof inkels[i + j + k * w] != "undefined" && inkels[i + j + k * w].wetness < wt) {
						
					    var Ba = inkels[i + j + k * w].a;
					    var Ca = inkels[i + j + k * w].a = Aa * 0.05 + Ba * (1 - Aa * 0.05);
					
                        inkels[i + j + k * w].r = (Ar * Aa * 0.05 + inkels[i + j + k * w].r * Ba * (1 - Aa * 0.05)) / Ca;
                        inkels[i + j + k * w].g = (Ag * Aa * 0.05 + inkels[i + j + k * w].g * Ba * (1 - Aa * 0.05)) / Ca;
                        inkels[i + j + k * w].b = (Ab * Aa * 0.05 + inkels[i + j + k * w].b * Ba * (1 - Aa * 0.05)) / Ca;
						
                        inkels[i + j + k * w].wetness += wt * 0.05;
                        n++;
                    }
                } //j loop
            } //k loop
            inkels[i].a -= n * 0.01 * Aa; 
		    inkels[i].wetness -= n * 0.05 * wt;
          } //if(inkels[i].wetness > 200)
          rimg.pixels[4 * i] = 204 * inkels[i].r;
          rimg.pixels[4 * i + 1] = 204 * inkels[i].g;
          rimg.pixels[4 * i + 2] = 204 * inkels[i].b;
          rimg.pixels[4 * i + 3] = 204 * inkels[i].a;
        } 
      rimg.updatePixels();
      //console.log(rimg);
      p.image(rimg, w/2, h/2);
    }

    // Update the absolute coordinates from the offsets
    x += dx;
    y += dy;

    // Update the previous pen's state to the current one we just sampled.
    previousPen = pen;
    //p.filter(p.BLUR, 2.5);
  };

  /*
   * Helpers.
   */
  function sampleNewState() {
    // Using the previous pen states, and hidden state, get next hidden state
    // the below line takes the most CPU power, especially for large models.
    modelState = model.update([dx, dy, ...pen], modelState);

    // Get the parameters of the probability distribution (pdf) from hidden state.
    const pdf = model.getPDF(modelState, temperature);

    // Sample the next pen's states from our probability distribution.
    return model.sample(pdf);
  }

  function setupNewDrawing() {
    //p.background(255, 255, 255, 255);
    //p.background(204, 204, 204); //remove if u dont want flashing
    x = Math.random() * window.innerWidth / 2.0;
    y = Math.random() * window.innerHeight * 0.9;
    const lineColor = p.color(p.random(64, 224), p.random(64, 224), p.random(64, 224));

    p.strokeWeight(4.0);
    p.stroke(lineColor);
  }

  function restart() {
    //p.background(204, 204, 204); //remove if u dont want flashing
    modelLoaded = false;
    [dx, dy, ...pen] = model.zeroInput();  // Reset the pen state.
    modelState = model.zeroState();  // Reset the model state.
    if (model) {
        console.log("disposed");
        model.dispose();
    }
    var choice = parseInt(Math.random() * nrmodels);
    model = new ms.SketchRNN(`${BASE_URL}${availableModels[choice]}.gen.json`);
    Promise.all([model.initialize()]).then(function() {
        modelLoaded = true;
        console.log('SketchRNN model loaded.');
        // Initialize the scale factor for the model. Bigger -> large outputs
        // [dx, dy, ...pen] = model.zeroInput();  // Reset the pen state.
        // modelState = model.zeroState();  // Reset the model state. 
        model.setPixelFactor(modelpixelsizes[availableModels[choice]]*10);   
    });
    dia = modelbrushdiams[availableModels[choice]]
    //const multiplier = parseInt(Math.random() * 3);
    brush.resize(dia * brw, dia * brh);
    brush.loadPixels();
    drawing = true;
    a = p.random(0.3, 0.9);
    r = p.random(1);
    g = p.random(1);
    b = p.random(1);
    setupNewDrawing();
  }
};

new p5(sketch, 'sketch');

//   function onWindowResize() {
          
//       camera.aspect = window.innerWidth / window.innerHeight;
//       camera.updateProjectionMatrix();
      
//   }

//   function onDocumentMouseDown(event) {
      
//       event.preventDefault();
//       var vector = new THREE.Vector3((event.clientX/ window.innerWidth) * 4 - 3, -(event.clientY / window.innerHeight) * 2 + 1, 0.5);
//       console.log(vector);
//       vector.unproject(camera);
//       var raycaster = new THREE.Raycaster(camera.position, vector.sub(camera.position).normalize());
//       var intersects = raycaster.intersectObjects(objects);
//       console.log(intersects)
//       if (intersects.length > 0) {
//           window.open(intersects[0].object.userData.URL,"_target");
//           intersects[0].object.material.color = new THREE.Color(0x551abb);
//           intersects[0].object.material.needsUpdate = true; 
//       } 
    
//   }

function Inkel(index, x, y) {
	//畫面上此位置對應的index(把畫面拉成直的)
    this.index = index;
	//不知道啥，顏料的量(amount)
    this.a = 1;
	//一開始畫布是乾的，wetness=0
    this.wetness = 0;
	//red, green, blue
    this.r = 1;
	this.g = 1;
	this.b = 1;
	//position
    this.x = x;
    this.y = y;
}

function soak(brush, x, y) {
    x = parseInt(x);
    y = parseInt(y);
      //對於brush的每個位置
      for (var i = 0; i < brush.width; i++) {
        for (var j = 0; j < brush.height; j++) {
            var locb = 4 * (j * brush.width + i);
            var loc = (y + j - brush.height / 2) * w + (x + i - brush.width / 2);
        if (inkels[loc]) {  
          var Ba = inkels[loc].a;
                  //取得這次筆刷的比例
          var Aa = a * brush.pixels[locb + 3] / 255;
                  //融合的顏色比例
          var Ca = Aa + Ba * (1 - Aa);
                  //此次筆刷顏色
          var Ar = r; 
          var Ag = g;
          var Ab = b;
                  //原本screen上的顏色
          var Br = inkels[loc].r;
          var Bg = inkels[loc].g;
          var Bb = inkels[loc].b;
          inkels[loc].wetness += brush.pixels[locb + 3]; // = (inkels[loc].wetness * inkels[loc].amount + b.pixels[locb + 3] * b.pixels[locb + 3]) / (inkels[loc].amount + b.pixels[locb + 3]);
          inkels[loc].r = (Ar * Aa + Br * Ba * (1 - Aa)) / Ca;
          inkels[loc].g = (Ag * Aa + Bg * Ba * (1 - Aa)) / Ca;
          inkels[loc].b = (Ab * Aa + Bb * Ba * (1 - Aa)) / Ca;
          inkels[loc].a = Ca;
        }
      }
    }
      //筆刷顏色隨著時間變淺的效果
    if (inkels[y * w + x]) {
      var f = 0.01 * inkels[y * w + x].wetness + 1;
      r = (5000 * r + f*inkels[y * w + x].r) / (f+5000);
      g = (5000 * g + f*inkels[y * w + x].g) / (f+5000);
      b = (5000 * b + f*inkels[y * w + x].b) / (f+5000);
    }
      
  }  

  function makeTextSprite(message, parameters) {
            
    if (parameters === undefined) parameters = {};
    var fontface = parameters.hasOwnProperty("fontface") ? parameters["fontface"] : "Arial";
    var fontsize = parameters.hasOwnProperty("fontsize") ? parameters["fontsize"] : 32;
    var borderThickness = parameters.hasOwnProperty("borderThickness") ? parameters["borderThickness"] : 1;
    var borderColor = parameters.hasOwnProperty("borderColor") ?parameters["borderColor"] : { r:0, g:0, b:0, a:1.0 };
    var backgroundColor = parameters.hasOwnProperty("backgroundColor") ?parameters["backgroundColor"] : { r:255, g:255, b:255, a:1.0 };
    var textColor = parameters.hasOwnProperty("textColor") ?parameters["textColor"] : { r:0, g:0, b:0, a:1.0 };
    var canvas = document.createElement('canvas');
    var context = canvas.getContext('2d');
    context.font = fontsize + "px " + fontface;
    var metrics = context.measureText(message);
    var textWidth = metrics.width;
    context.fillStyle   = "rgba(" + backgroundColor.r + "," + backgroundColor.g + "," + backgroundColor.b + "," + backgroundColor.a + ")";
    context.strokeStyle = "rgba(" + borderColor.r + "," + borderColor.g + "," + borderColor.b + "," + borderColor.a + ")";
    context.lineWidth = borderThickness;
    context.fillStyle = "rgba("+textColor.r+", "+textColor.g+", "+textColor.b+", 1.0)";
    context.fillText( message, borderThickness, fontsize + borderThickness);
    var texture = new THREE.Texture(canvas) 
    texture.needsUpdate = true;
    var spriteMaterial = new THREE.SpriteMaterial({ map: texture, useScreenCoordinates: false });
    var sprite = new THREE.Sprite(spriteMaterial);
    sprite.scale.set(4 * fontsize, 2 * fontsize, 5 * fontsize);
    return sprite;  
        
}

function detectMob() {
    return ( ( window.innerWidth <= 500 ) && ( window.innerHeight <= 900 ) );
}


  
  


              