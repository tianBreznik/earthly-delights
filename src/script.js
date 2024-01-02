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
var dia=30.0;
var previouschoice;


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
    bird:14.0,
    ant:35.5,
    angel:10.8,
    backpack:13.5,
    barn:2.8,
    basket:14.0,
    bear:5.8,
    bee:18.0,
    beeflower:25.0,
    bicycle:6.0,
    book:23.0,
    bus:4.0,
    butterfly:22.0,
    cactus:16.0,
    castle:1.8,
    cat:20.5,
    catbus:22.0,
    chair:9.5,
    couch:6.5,
    crab:25.5,
    diving_board:15.5,
    dog:16.5,
    dogbunny:19.5,
    dolphin:13.0,
    duck:22.5,
    elephant:2.0,
    everything:1.0,
    flamingo:23.0,
    flower:24.5,
    floweryoga:25.0,
    frog:24.5,
    frogsofa:25.0,
    garden:8.0,
    hand:20.0,
    eye:25.0,
    hedgeberry:35.0,
    hedgehog:23.0,
    kangaroo:18.0,
    key:38.0,
    lantern:33.0,
    lighthouse:7.0,
    lion:7.0,
    lionsheep:9.8,
    lobster:23.0,
    map:2.0,
    mermaid:10.5,
    monkey:15.9,
    octopus:20.5,
    owl:22.2,
    palm_tree:12.7,
    parrot:22.2,
    peas:60.5,
    penguin:15.5,
    pig:8.3,
    pigsheep:10.6,
    pineapple:30.2,
    pool:1.2,
    rabbit:18.3,
    rabbitturtle:17.6,
    rain:15.0,
    rhinoceros:5.0,
    sea_turtle:16.0,
    sheep:13.0,
    skull:18.0,
    snail:19.5,
    snowflake:18.0,
    spider:22.0,
    squirrel:20.0,
    strawberry:20.0,
    swan:12.5,
    swing_set:4.0,
    tractor:4.0,
    trombone:24.2,
    truck:4.0,
    whale:5.5,
    windmill:3.0,
    yoga:15.0,
    yogabicycle:18.0,
  }

  const maxnrofiterations = {
    bird:5,
    ant:10,
    angel:2,
    backpack:2,
    barn:1,
    basket:1,
    bear:1,
    bee:10,
    beeflower:5,
    bicycle:3,
    book:7,
    bus:1,
    butterfly:1,
    cactus:3,
    castle:1,
    cat:3,
    catbus:1,
    chair:4,
    couch:1,
    crab:3,
    diving_board:1,
    dog:3,
    dogbunny:1,
    dolphin:2,
    duck:6,
    elephant:1,
    everything:1,
    flamingo:3,
    flower:10,
    floweryoga:1,
    frog:3,
    frogsofa:1,
    garden:1,
    hand:1,
    eye:1,
    hedgeberry:3,
    hedgehog:1,
    kangaroo:1,
    key:1,
    lantern:1,
    lighthouse:1,
    lion:2,
    lionsheep:1,
    lobster:4,
    map:1,
    mermaid:1,
    monkey:3,
    octopus:1,
    owl:1,
    palm_tree:5,
    parrot:5,
    peas:5,
    penguin:7,
    pig:4,
    pigsheep:1,
    pineapple:2,
    pool:1,
    rabbit:3,
    rabbitturtle:1,
    rain:15,
    rhinoceros:1,
    sea_turtle:1,
    sheep:10,
    skull:1,
    snail:3,
    snowflake:10,
    spider:2,
    squirrel:3,
    strawberry:5,
    swan:2,
    swing_set:1,
    tractor:1,
    trombone:4,
    truck:1,
    whale:1,
    windmill:1,
    yoga:1,
    yogabicycle:1,
  }

  const randomfielddim = {
    bird:[0.4, 0.2],
    ant:[0.3, 0.3],
    angel:[0.9, 0.25],
    backpack:[0.3, 0.3],
    barn:[0.3, 0.2],
    basket:[0.3, 0.2],
    bear:[0.1, 0.1],
    bee:[0.4, 0.4],
    beeflower:[0.3, 0.3],
    bicycle:[0.35, 0.35],
    book:[0.2, 0.2],
    bus:[0.2, 0.5],
    butterfly:[0.6, 0.2],
    cactus:[0.3, 0.3],
    castle:[0.1, 0.1],
    cat:[0.4, 0.4],
    catbus:[0.2, 0.2],
    chair:[0.25, 0.25],
    couch:[0.15, 0.15],
    crab:[0.05, 0.4],
    diving_board:[0.005, 0.005],
    dog:[0.4, 0.4],
    dogbunny:[0.3, 0.3],
    dolphin:[0.1, 0.3],
    duck:[0.3, 0.3],
    elephant:[0.1, 0.1],
    everything:[0.1, 0.1],
    flamingo:[0.3, 0.2],
    flower:[0.2, 0.2],
    floweryoga:[0.2, 0.2],
    frog:[0.3, 0.3],
    frogsofa:[0.3, 0.3],
    garden:[0.1, 0.1],
    hand:[0.6, 0.2],
    eye:[0.6, 0.2],
    hedgeberry:[0.3, 0.3],
    hedgehog:[0.3, 0.3],
    kangaroo:[0.2, 0.2],
    key:[0.4, 0.4],
    lantern:[0.3, 0.2],
    lighthouse:[0.35, 0.35],
    lion:[0.3, 0.3],
    lionsheep:[0.3, 0.3],
    lobster:[0.3, 0.3],
    map:[0.3, 0.3],
    mermaid:[0.2, 0.2],
    monkey:[0.1, 0.1],
    octopus:[0.05, 0.35],
    owl:[0.15, 0.15],
    palm_tree:[0.25, 0.25],
    parrot:[0.1, 0.1],
    peas:[0.5, 0.5],
    penguin:[0.05, 0.3],
    pig:[0.25, 0.25],
    pigsheep:[0.2, 0.2],
    pineapple:[0.2, 0.2],
    pool:[0.005, 0.005],
    rabbit:[0.25, 0.25],
    rabbitturtle:[0.2, 0.2],
    rain:[0.1, 0.1],
    rhinoceros:[0.15, 0.15],
    sea_turtle:[0.1, 0.3],
    sheep:[0.35, 0.2],
    skull:[0.5, 0.2],
    snail:[0.3, 0.25],
    snowflake:[0.3, 0.3],
    spider:[0.3, 0.3],
    squirrel:[0.15, 0.15],
    strawberry:[0.35, 0.35],
    swan:[0.1, 0.3],
    swing_set:[0.25, 0.15],
    tractor:[0.25, 0.25],
    trombone:[0.2, 0.2],
    truck:[0.35, 0.2],
    whale:[0.05, 0.05],
    windmill:[0.35, 0.35],
    yoga:[0.4, 0.4],
    yogabicycle:[0.4, 0.4],
  }

  //redundancy
  const modellocationsXY = {
    bird:[[0.1, 0.3], [0.7, 0.1], [0.05, 0.1]],
    ant:[[0.9, 0.8], [0.6, 0.8], [0.5, 0.75]],
    angel:[[0.1,0.1]],
    backpack:[[0.7, 0.8]],
    barn:[[0.5, 0.7]],
    basket:[[0.5,0.7]],
    bear:[[0.7, 0.7]],
    bee:[[0.1, 0.6], [0.2, 0.5], [0.3, 0.6], [0.4, 0.7], [0.6, 0.8], [0.8, 0.9], [0.2, 0.2],[0.7, 0.3]], //region 0.2
    beeflower:[[0.1, 0.6], [0.2, 0.5], [0.3, 0.6], [0.4, 0.7], [0.6, 0.8], [0.8, 0.9], [0.2, 0.2],[0.7, 0.3]],
    bicycle:[[0.55, 0.6]],
    book:[[0.1, 0.6], [0.4, 0.85], [0.6, 0.6], [0.4, 0.7]],
    bus:[[0.6, 0.65]],
    butterfly:[[0.2, 0.4], [0.6, 0.5], [0.4, 0.8]],
    cactus:[[0.5, 0.5], [0.8, 0.8]],
    castle:[[0.8, 0.1], [0.7, 0.55]],
    cat:[[0.1, 0.5],[0.5, 0.5], [0.7, 0.6]],
    catbus:[[0.4, 0.8]],
    chair:[[0.4, 0.85], [0.6, 0.6]],
    couch:[[0.6, 0.8], [0.4, 0.6], [0.8, 0.5]],
    crab:[[0.2, 0.65]],
    diving_board:[[0.1, 0.7]],
    dog:[[0.5, 0.5]],
    dogbunny:[[0.5, 0.5]],
    dolphin:[[0.1, 0.5]],
    duck:[[0.1, 0.5]],
    elephant:[[0.6, 0.8]],
    everything:[[0.1, 0.1]],
    flamingo:[[0.2, 0.65]],
    flower:[[0.1, 0.6], [0.2, 0.5], [0.3, 0.6], [0.4, 0.7], [0.6, 0.8], [0.8, 0.9]],//region needs to be v small like 0.1, 0.1
    floweryoga:[[0.5, 0.5]],
    frog:[[0.1, 0.5]],
    frogsofa:[[0.1, 0.5]],
    garden:[[0.5, 0.5]],
    hand:[[0.1, 0.1]],// dimensions need to be long and thin 0.8 on x and 0.3 on y
    eye:[[0.1, 0.1]], // same w dimensions 
    hedgeberry:[[0.5, 0.5]],
    hedgehog:[[0.5, 0.5]],
    kangaroo:[[0.5, 0.5]],
    key:[[0.5, 0.5]],
    lantern:[[0.5, 0.5]],
    lighthouse:[[0.1, 0.6], [0.3, 0.5], [0.4, 0.6]],
    lion:[[0.5, 0.5]],
    lionsheep:[[0.5, 0.5]],
    lobster:[[0.1, 0.5]],
    map:[[0.5, 0.5]],
    mermaid:[[0.1, 0.5]],
    monkey:[[0.1, 0.6], [0.3, 0.5], [0.4, 0.6]],
    octopus:[[0.1, 0.5]],
    owl:[[0.1, 0.3], [0.7, 0.1], [0.05, 0.1]],
    palm_tree:[[0.1, 0.6], [0.3, 0.5], [0.4, 0.6]],
    parrot:[[0.1, 0.6], [0.3, 0.5], [0.4, 0.6]],
    peas:[[0.5, 0.5]],
    penguin:[[0.1, 0.5]],
    pig:[[0.4, 0.6],[0.65, 0.8]],
    pigsheep:[[0.4, 0.6],[0.65, 0.8]],
    pineapple:[[0.1, 0.6], [0.3, 0.5], [0.4, 0.6]],
    pool:[[0.1, 0.7]],
    rabbit:[[0.5, 0.5]],
    rabbitturtle:[[0.5, 0.5]],
    rain:[[0.1, 0.1], [0.5, 0.1], [0.8, 0.1]],
    rhinoceros:[[0.5, 0.5]],
    sea_turtle:[[0.1, 0.5]],
    sheep:[[0.35, 0.5],[0.5, 0.7]],
    skull:[[0.1, 0.1]],//everywhere
    snail:[[0.1, 0.6], [0.2, 0.5], [0.3, 0.6], [0.4, 0.7], [0.6, 0.8], [0.8, 0.9]], //bigger region 0.25
    snowflake:[[0.1, 0.1], [0.5, 0.1], [0.8, 0.1]],
    spider:[[0.5, 0.5]],
    squirrel:[[0.5, 0.5]],
    strawberry:[[0.5, 0.5]],
    swan:[[0.1, 0.5]],
    swing_set:[[0.4, 0.8],[0.5, 0.7],[0.6, 0.5],[0.8, 0.55]],
    tractor:[[0.55, 0.6],[0.5, 0.6],[0.8, 0.7],[0.8, 0.6]],
    trombone:[[0.3, 0.4]],
    truck:[[0.55, 0.6],[0.5, 0.6],[0.8, 0.7],[0.8, 0.6]],
    whale:[[0.1, 0.5]],
    windmill:[[0.5, 0.7],[0.6, 0.6], [0.8, 0.6]],
    yoga:[[0.5, 0.5]],
    yogabicycle:[[0.5, 0.5]],
  }

  const modelbrushdiams = {
    bird:1.0,
    ant:0.5,
    angel:2.0,
    backpack:1.0,
    barn:10.0,
    basket:1.0,
    bear:3.0,
    bee:1.5,
    beeflower:1.0,
    bicycle:2.0,
    book:1.0,
    bus:10.0,
    butterfly:3.5,
    cactus:2.0,
    castle:10.0,
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
    hedgeberry:1.0,
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
    pool:30.0,
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
    swing_set:7.0,
    tractor:5.5,
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
  //var choice = parseInt(Math.random() * nrmodels);
  var choice = 56; //pool
  previouschoice = 56;
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
    if(detectMob()){
        //console.log("mobile");
        screenWidth = window.innerWidth;
        console.log(screenWidth);
    }
    else{
        //console.log("not mobile");
        screenWidth = window.innerWidth*0.997;
    }

    const screenHeight = window.innerHeight * 0.994;
    var canvas = p.createCanvas(screenWidth, screenHeight);
    canvas.id = "drawing"
    p.frameRate(60);

    brw=brush.width/10;
    brh=brush.height/10;
    p.imageMode(p.CENTER);

    w = window.innerWidth;
    h = window.innerHeight;

    p.noFill();
    x0 = y0 = 0;
    inkels = [];
    brush.resize(dia * brush.width, dia * brush.height);
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
    modelLoaded = false;
    if (model) {
        //console.log("disposed");
        model.dispose();
    }
    var choice = parseInt(Math.random() * nrmodels);
    model = new ms.SketchRNN(`${BASE_URL}${availableModels[choice]}.gen.json`);
    Promise.all([model.initialize()]).then(function() {
        modelLoaded = true;
        //console.log('SketchRNN model loaded.');
        // Initialize the scale factor for the model. Bigger -> large outputs
        model.setPixelFactor(modelpixelsizes[availableModels[choice]]);
        restart();
    });
    dia = modelbrushdiams[availableModels[choice]]
    brush.resize(dia * brw, dia * brh); //add parameters here
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
      //console.log("model not loaded");
      return;
    }

    // If we finished the previous drawing, start a new one.
    if (previousPen[PEN.END] === 1) {
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

  function setupNewDrawing(choicekey) {
    //p.background(255, 255, 255, 255);
    //p.background(204, 204, 204); //remove if u dont want flashing
    const locationlen = modellocationsXY[choicekey].length;
    const lenchoice = getRandomInt(0, locationlen-1);
    //console.log("length: " + locationlen);
    //console.log(choicekey);
    //console.log(modellocationsXY[choicekey]);
    //console.log("index: " + lenchoice);
    var fieldfactX = randomfielddim[choicekey][0];
    var fieldfactY = randomfielddim[choicekey][1];
    var randomX = getRandomFloat(fieldfactX*window.innerWidth*(-0.3), fieldfactX*window.innerWidth*0.7);
    var randomY = getRandomFloat(fieldfactY*window.innerHeight*(-0.3), fieldfactY*window.innerHeight*0.7);
    x = (modellocationsXY[choicekey][lenchoice][0]*window.innerWidth + randomX);
    y = (modellocationsXY[choicekey][lenchoice][1]*window.innerHeight + randomY);
    console.log(y);
    console.log(modellocationsXY[choicekey][lenchoice][1]);
    const lineColor = p.color(p.random(64, 224), p.random(64, 224), p.random(64, 224));

    //p.strokeWeight(4.0);
    p.stroke(lineColor);
  }

  function restart() {
    //p.background(204, 204, 204); //remove if u dont want flashing
    modelLoaded = false;
    [dx, dy, ...pen] = model.zeroInput();  // Reset the pen state.
    modelState = model.zeroState();  // Reset the model state.
    if (model) {
        //console.log("disposed");
        model.dispose();
    }
    var choice = parseInt(Math.random() * nrmodels);
    // if(maxnrofiterations[availableModels[previouschoice]]>0){
    //   maxnrofiterations[prev]
    // }
    // else{
    //   previouschoice = choice;
    // }
    //var choice = 72;
    console.log(availableModels[choice]);
    console.log(modelbrushdiams[availableModels[choice]]);
    model = new ms.SketchRNN(`${BASE_URL}${availableModels[choice]}.gen.json`);
    Promise.all([model.initialize()]).then(function() {
      modelLoaded = true;
      console.log('SketchRNN model loaded.');
      // Initialize the scale factor for the model. Bigger -> large outputs
      // [dx, dy, ...pen] = model.zeroInput();  // Reset the pen state.
      // modelState = model.zeroState();  // Reset the model state. 
      //*10 reduntant - change source data
      model.setPixelFactor(modelpixelsizes[availableModels[choice]]);   
    });
  

    dia = modelbrushdiams[availableModels[choice]]
    brush.resize(dia * brw, dia * brh);
    brush.loadPixels();
    drawing = true;
    a = p.random(0.3, 0.9);
    r = p.random(1);
    g = p.random(1);
    b = p.random(1);
    setupNewDrawing(availableModels[choice]);
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

function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function getRandomFloat(min, max, decimals) {
  const str = (Math.random() * (max - min) + min).toFixed(
    decimals,
  );

  return parseFloat(str);
}


  
  


              