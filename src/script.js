/*
Made by Tian Breznik, 7th of January 2024
Running on HTML Energy, inspired by 
Laurel Schwulst

a garden doodle - a little framed webpage an ai trying to doodle a garden !

A machine learning model, trained on doodle prompts, drawn by people is
used to try to draw something resembling a painting of a garden. The system is 
based on SketchRNN, a recurrent neural network trained on doodles. There are 
multiple trained models on different prompts for the user, for example, "cat", 
"bus", "whale", "basket" and so on. This project aims to compose all of these 
doodles into one painting composition that tries to represent a garden. I focus
on detail, textures big and small to try to give the viewer a sense of richness
in the "painting". The viewer watches the painting being drawn in real time.

It works in two p5 instances. In the first the model doodles and in the second
little emojies of animals are being drawn as a bonus. 

See it running at:
https://tianbreznik.github.io/earthly-delights/
*/

import './style.css';
import * as ms from "@magenta/sketch";

//declare necessary variables
var rimg, brush;
let model;
var inkels;
var drawing = false;
var w, h,brw,brh;
var a, r, g, b;
var dia=4.0;
var previouschoice;
var tagpar;
var screenWidth, screenHeight;

//an array to keep track 
//of the tags used by the 
//model
const tagtrace = [];


const sketch1 = function(p) {

  //base url to the collection of models
  const BASE_URL = 'https://storage.googleapis.com/quickdraw-models/sketchRNN/models/';
  //list of available models
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

  //dictionary of the relative sizes at which the 
  //doodles should be drawn at
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
    frogsofa:15.0,
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
    map:15.0,
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
    pool:2.5,
    rabbit:18.3,
    rabbitturtle:17.6,
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

  //dictionary of the brush diameters
  //with which the model doodles are drawn
  const modelbrushdiams = {
    bird:1.0,
    ant:0.5,
    angel:2.0,
    backpack:1.0,
    barn:3.5,
    basket:1.0,
    bear:3.0,
    bee:0.8,
    beeflower:0.8,
    bicycle:2.0,
    book:1.0,
    bus:3.0,
    butterfly:3.5,
    cactus:2.0,
    castle:4.0,
    cat:1.5,
    catbus:1.4,
    chair:1.5,
    couch:2.5,
    crab:1.5,
    diving_board:2.0,
    dog:1.5,
    dogbunny:1.0,
    dolphin:2.0,
    duck:1.6,
    elephant:3.0,
    everything:4.0,
    flamingo:2.0,
    flower:1.1,
    floweryoga:2.0,
    frog:1.0,
    frogsofa:2.0,
    garden:2.0,
    hand:1.0,
    eye:1.0,
    hedgeberry:1.0,
    hedgehog:2.0,
    kangaroo:2.0,
    key:0.8,
    lantern:1.0,
    lighthouse:2.0,
    lion:2.0,
    lionsheep:1.5,
    lobster:1.4,
    map:3.0,
    mermaid:1.5,
    monkey:1.5,
    octopus:1.0,
    owl:1.4,
    palm_tree:2.0,
    parrot:1.0,
    peas:4.0,
    penguin:1.0,
    pig:2.0,
    pigsheep:2.0,
    pineapple:2.0,
    pool:20.0,
    rabbit:1.0,
    rabbitturtle:1.0,
    rhinoceros:1.0,
    sea_turtle:1.0,
    sheep:1.0,
    skull:1.0,
    snail:1.0,
    snowflake:1.0,
    spider:1.0,
    squirrel:1.0,
    strawberry:0.8,
    swan:1.0,
    swing_set:6.0,
    tractor:2.5,
    trombone:1.6,
    truck:3.0,
    whale:2.0,
    windmill:2.0,
    yoga:3.0,
    yogabicycle:2.0,
  }

  //the maximum number of times 
  //a doodle can be redrawn
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

  //the size of the region in which
  //a doodle can be drawn randomly
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

  //the locations at which the random field
  //in which a doodle appears can be anchored
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

  //the possible colors each model can have
  const htmlcoloroptions = {
    bird:["brown","black","gray","gold","indianred","snow","peru","rosybrown"],
    ant:["black","maroon", "darkred"],
    angel:["white", "oldlace","darkgoldenrod","gold","black","yellow"],
    backpack:["any"],
    barn:["brown","cadetblue","darkred","firebrick","saddlebrown","sienna"],
    basket:["wheat","tan","sienna","rosybrown","peachpuff","darksalmon"],
    bear:["brown","chocolate","saddlebrown","sienna","peru"],
    bee:["yellow","orange","black","khaki","gold","goldenrod","darkgoldenrod"],
    beeflower:["any"],
    bicycle:["any"],
    book:["any"],
    bus:["any"],
    butterfly:["any"],
    cactus:["darkgreen","darkkhaki","darkolivegreen","forestgreen","greenyellow","green","lightgreen"],
    castle:["lightgray","lightgrey","lightslategray","lightslategrey","slategray","slategrey","gray","grey","dimgray","dimgrey"],
    cat:["dimgray","dimgrey","darkorange","coral","chocolate","orange","orangered","seashell","snow","tan","sienna","wheat"],
    catbus:["any"],
    chair:["any"],
    couch:["any"],
    crab:["orange","tomato","tan","teal","thistle","slateblue","seagreen","plum","lightsteelblue","lightcoral"],
    diving_board:["beige","antiquewhite","azure","darkgray"],
    dog:["darkgoldenrod","darkgray","black","burlywood","chocolate","lightyellow","peru","saddlebrown","sandybrown","slategrey","slategray","snow","tan","wheat"],
    dogbunny:["any"],
    dolphin:["lightgray","lightgrey","lightslategray","lightslategrey","slategray","slategrey","gray","grey","dimgray","dimgrey","silver"],
    duck:["tomato","sienna","seagreen","saddlebrown","sandybrown","olive","green","forestgreen","darkgreen","darkgrey"],
    elephant:["any"],
    everything:["any"],
    flamingo:["deeppink"],
    flower:["coral","crimson","cornflowerblue","darkmagenta","darkorchid","darkorange","darkred","darkviolet","deeppink","gold","indigo","magenta","mediumvioletred","midnightblue","orchid","yellow"],
    floweryoga:["any"],
    frog:["black","darkgreen","darkolivegreen","darkkhaki","darkseagreen","forestgreen","grey","green","lawngreen","lightgreen","limegreen","lime","mediumaquamarine","mediumseagreen","mediumspringgreen","seagreen","yellowgreen"],
    frogsofa:["any"],
    garden:["darkgreen","darkolivegreen","darkkhaki","darkseagreen","forestgreen","grey","green","lawngreen","lightgreen","limegreen","lime","mediumaquamarine","mediumseagreen","mediumspringgreen","seagreen","yellowgreen"],
    hand:["any"],
    eye:["any"],
    hedgeberry:["any"],
    hedgehog:["wheat","tan","sienna","saddlebrown","rosybrown","navajowhite","moccasin","burlywood"],
    kangaroo: ["wheat","tan","sienna","saddlebrown","rosybrown","navajowhite","moccasin","burlywood"],
    key:["any"],
    lantern:["black"],
    lighthouse:["white","blue","yellow","gold","crimson","firebrick","floralwhite","ivory","lightsteelblue","navy"],
    lion:["orange","peachpuff","peru","sandybrown","sienna","tan","navajowhite","goldenrod"],
    lionsheep:["any"],
    lobster:["black","orange","tomato","tan","teal","thistle","slateblue","seagreen","plum","lightsteelblue","lightcoral"],
    map:["any"],
    mermaid:["any"],
    monkey:["wheat","tan","sienna","saddlebrown","rosybrown","navajowhite","moccasin","burlywood"],
    octopus:["darkorchid","darkslateblue","darkviolet","fuchsia","black","indigo","hotpink","lavender","mediumorchid","mediumpurple","rebeccapurple","purple"],
    owl:["black","wheat","tan","sienna","saddlebrown","rosybrown","navajowhite","moccasin","burlywood"],
    palm_tree:["any"],
    parrot:["any"],
    peas:["any"],
    penguin:["black"],
    pig:["black","rosybrown","salmon","thistle","pink","mistyrose","darksalmon"],
    pigsheep:["any"],
    pineapple:["any"],
    pool:["dodgerblue","lightseagreen","mediumaquamarine","mediumblue","mediumturquoise","royalblue","turquoise","aqua","aquamarine"],
    rabbit:["white","beige","floralwhite","burlywood","blanchedalmond","black","peru","pink","rosybrown","saddlebrown","sandybrown","gray","grey"],
    rabbitturtle:["any"],
    rhinoceros:["lightgray","lightgrey","lightslategray","lightslategrey","slategray","slategrey","gray","grey","dimgray","dimgrey"],
    sea_turtle:["darkgreen","darkolivegreen","darkkhaki","darkseagreen","forestgreen","grey","green"],
    sheep:["any"],
    skull:["black"],
    snail:["any"],
    snowflake:["white","snow","powderblue","mintcream","lightcyan","ivory","ghostwhite","aliceblue"],
    spider:["black"],
    squirrel:["wheat","tan","sienna","saddlebrown","rosybrown","navajowhite","moccasin","burlywood"],
    strawberry:["firebrick","deeppink","darkred","crimson","indianred","maroon","red"],
    swan:["white","whitesmoke","snow","black","silver","slategray","slategray","lightslategray","lightgray","ivory","gray","dimgray"],
    swing_set:["any"],
    tractor:["any"],
    trombone:["any"],
    truck:["any"],
    whale:["lightgray","lightgrey","lightslategray","lightslategrey","slategray","slategrey","gray","grey","dimgray","dimgrey"],
    windmill:["any"],
    yoga:["any"],
    yogabicycle:["any"],
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

  //always start painting by drawing the pool
  const choice = 56; //pool
  previouschoice = choice;

  // Load the model.
  model = new ms.SketchRNN(`${BASE_URL}${availableModels[choice]}.gen.json`);
  console.log(availableModels[choice]);
  
  // Main p5 code

  //load the brush sprite
  p.preload = function(){
    brush = p.loadImage("brush-3.png");
  }

  //setup
  p.setup = function() {

    //get paragraph element to inject tag name into
    tagpar = document.getElementById("tagname");

    // Initialize the canvas.
    screenWidth = window.innerWidth*0.81;
    screenHeight = window.innerHeight * 0.725;
    var canvas = p.createCanvas(screenWidth, screenHeight);
    p.frameRate(60);

    //set brush dimensions
    brw=brush.width;
    brh=brush.height;
    p.imageMode(p.CENTER);

    //set canvas dimensions and resolution
    w = window.innerWidth;
    h = window.innerHeight;

    //initialize inkels collection
    inkels = [];

    //resize brush according to diameter
    brush.resize(dia * brush.width, dia * brush.height);
    //Loads the pixel data of the current display window into the pixels[] array.
    brush.loadPixels();

    //Creates a new PImage (the datatype for storing images)
    rimg = p.createImage(w, h);
    rimg.loadPixels();

    //fill inkels
    for (let i = 0; i < w; i++) {
        for (let j = 0; j < h; j++) {
          var pos = j * w + i;
          inkels.push(new Inkel(pos, i, j));
        }
    }

    //initialize model
    model.initialize().then(function() {
      // Initialize the scale factor for the model. Bigger -> large outputs
      model.setPixelFactor(modelpixelsizes[availableModels[choice]]);
      modelLoaded = true;
      //restart to draw
      restart();
    });
  };

  //handling full screen
  var click = 0;
  p.mousePressed = function() { 
    console.log("pressed");
    // Set the value of fullscreen 
    // into the variable 
    if(click % 2 == 0){
      screenHeight *= 1.168;
    }
    else{
      screenHeight /= 1.168;
    }
  
    p.resizeCanvas(screenWidth, screenHeight, false); 


    let fs = p.fullscreen(); 
    // Call to fullscreen function 
    p.fullscreen(!fs);  
    click += 1;
  } 

  // Drawing loop.
  p.draw = function() {

    if (!modelLoaded) {
      console.log("model not loaded");
      return;
    }

    // If we finished the previous drawing, start a new one.
    if (previousPen[PEN.END] === 1) {
      restart();
    }

    // Only draw on the paper if the pen is still touching the paper.
    if(drawing & modelLoaded){
        
        //try getting new state.
        try{
          [dx, dy, ...pen] = sampleNewState();
        }
        catch(err){
          console.log(err);
          restart();
        }

        //get distance between points
        var d = p.dist(x+dx, y+dy, x, y);

        //set up bruch indicator (point)
        let c = p.color('red');
        p.fill(c); 
        p.strokeWeight(15);

        //soak the canvas at the points returned by the doodle model
        for (var i = 1; i < d; i++) {
          p.point(x + dx - i * (dx / d),y + dy - i * (dy / d));
          soak(brush, x + dx - i * (dx / d), y + dy - i * (dy / d));
        }
        p.point(x+dx, y+dy);
        soak(brush, x+dx, y+dy);

      /**
      *
      * Watercolor canvas algorithm adapted from sandyaa0313 on the openprocessing forum:
      * https://openprocessing.org/sketch/1207205
      * 
      */
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
          rimg.pixels[4 * i] = 255 * inkels[i].r;
          rimg.pixels[4 * i + 1] = 250 * inkels[i].g;
          rimg.pixels[4 * i + 2] = 240 * inkels[i].b;
          rimg.pixels[4 * i + 3] = 255 * inkels[i].a;
        } 
      //update image - update canvas
      rimg.updatePixels();
      p.image(rimg, w/2, h/2);
    }

    // Update the absolute coordinates from the offsets
    x += dx;
    y += dy;

    // Update the previous pen's state to the current one we just sampled.
    previousPen = pen;
  };

  // Helper function to get next state of model
  function sampleNewState() {

    //update model state
    modelState = model.update([dx, dy, ...pen], modelState);
    console.log("sampled");

    // Get the parameters of the probability distribution (pdf) from hidden state.
    const pdf = model.getPDF(modelState, temperature);

    // Sample the next pen's states from our probability distribution.
    return model.sample(pdf);
  }

  //helper function for the composition and aesthetics of the drawing 
  //takes the tag name (key) as a parameter
  function setupNewDrawing(choicekey) {

    //the number of possible doodlelocations
    const locationlen = modellocationsXY[choicekey].length;
    //the doodle location choice
    const lenchoice = getRandomInt(0, locationlen-1);
    //x and y factor components
    var fieldfactX = randomfielddim[choicekey][0];
    var fieldfactY = randomfielddim[choicekey][1];
    //random x and y coordinates based on random window dimensions 
    var randomX = getRandomFloat(fieldfactX*screenWidth*(-0.3), fieldfactX*screenWidth*0.7);
    var randomY = getRandomFloat(fieldfactY*screenHeight*(-0.5), fieldfactY*screenHeight*0.5);
    //actual x and y coordinates
    x = (modellocationsXY[choicekey][lenchoice][0]*screenWidth + randomX);
    y = (modellocationsXY[choicekey][lenchoice][1]*screenHeight + randomY);

    //in the same way a color is picked
    //number of possible colors
    const colorlength = htmlcoloroptions[choicekey].length;
    //color choice
    const colorchoice = getRandomInt(0, colorlength - 1);
    if(htmlcoloroptions[choicekey][colorchoice] === "any"){
     console.log("any")
      r = p.random(1);
      g = p.random(1);
      b = p.random(1);
    }
    else{
      //named color to hex
      var hexcolor = colourNameToHex(htmlcoloroptions[choicekey][colorchoice])
      console.log(htmlcoloroptions[choicekey][colorchoice]);
      //hex color to rgb
      var rgbcolor = hexToRgb(hexcolor);
      if(!rgbcolor || rgbcolor === 'undefined' || rgbcolor === null){
        console.log("no rgb");
        r = p.random(1);
        g = p.random(1);
        b = p.random(1);
      }else{
        r = rgbcolor.r/255.0;
        g = rgbcolor.g/255.0;
        b = rgbcolor.b/255.0;
      }
    }
  }

  //restart/start doodle
  function restart() {
    
    //clear model
    modelLoaded = false;
    [dx, dy, ...pen] = model.zeroInput();  // Reset the pen state.
    modelState = model.zeroState();  // Reset the model state.
    if (model) {
        console.log("disposed");
        model.dispose();
    }

    //check if model has been drawn already
    if(tagtrace.indexOf(availableModels[previouschoice]) < 0){
      //pick number of times it is going to be drawn
      maxnrofiterations[availableModels[previouschoice]] = getRandomInt(1, maxnrofiterations[availableModels[previouschoice]]);
      tagtrace.push(availableModels[previouschoice]);
    }

    //if doodle should still be drawn, decrease number of draws (and draw doodle)
    //else choose new doodle
    if(maxnrofiterations[availableModels[previouschoice]]>0){
      console.log(maxnrofiterations[availableModels[previouschoice]])
      maxnrofiterations[availableModels[previouschoice]] -= 1;
    }
    else{
      var choice = parseInt(Math.random() * nrmodels);
      previouschoice = choice;
    }
    console.log(availableModels[previouschoice]);
    //write doodle name
    tagpar.innerHTML = availableModels[previouschoice];
    //debug
    //console.log("brush: " + modelbrushdiams[availableModels[previouschoice]]);
    //console.log("size: " + modelpixelsizes[availableModels[previouschoice]]);

    //load new model
    model = new ms.SketchRNN(`${BASE_URL}${availableModels[previouschoice]}.gen.json`);
    Promise.all([model.initialize()]).then(function() {
      modelLoaded = true;
      console.log('SketchRNN model loaded.');
      // Initialize the scale factor for the model. Bigger -> large outputs
      [dx, dy, ...pen] = model.zeroInput();  // Reset the pen state.
      modelState = model.zeroState();  // Reset the model state. 
      //set the doodle size
      model.setPixelFactor(modelpixelsizes[availableModels[previouschoice]]);   
    });
  
    //set the brush diameter multiplier
    dia = modelbrushdiams[availableModels[previouschoice]]/4;
    brush.resize(dia * brw, dia * brh);
    brush.loadPixels();
    drawing = true;
    a = p.random(0.3, 0.9);
    setupNewDrawing(availableModels[previouschoice]);
  }
};

new p5(sketch1, 'sketch');

//second canvas
var sketch2 = function( p ) {

  //uper and lower limit of the emoji characters (animal range)
  const lower = 0x1F400;
  const upper = 0x1F441;

  p.setup = function() {

    screenWidth = window.innerWidth*0.81;
    screenHeight = window.innerHeight * 0.725;
    var canvas = p.createCanvas(screenWidth, screenHeight);
    canvas.id = "drawing";
    p.frameRate(0.1);
 }

  p.draw = function() {

    //pick random emoji (reuse r channel for the random number)
    let emojisize = p.random(0.5, 50);
    let code = p.int(p.map(p.random(1), 0, 1, lower, upper));
    let chr = String.fromCodePoint(code);
    //set text (emoji) size
    p.textSize(emojisize);
    //draw emoji
    p.text(chr, p.random(1)*screenWidth, p.random()*screenHeight);
 }

 //full screen handling
  var click = 0;
  p.mousePressed = function() { 
  
    console.log("pressed");
    // Set the value of fullscreen 
    // into the variable 
    if(click % 2 == 0){
      screenHeight *= 1.168;
    }
    else{
      screenHeight /= 1.168;
    }
  
    p.resizeCanvas(screenWidth, screenHeight, false); 


    let fs = p.fullscreen(); 
    // Call to fullscreen function 
    p.fullscreen(!fs);  
    click += 1;
  } 

};

// create the second instance of p5 and pass in the function for sketch 2
new p5(sketch2, "emojiover");

/*
*
* A class that represents an inkel, a pixel that can be soaked in color.
* This was adapted from a post from sandyaa0313 on the openprocessing forum:
* https://openprocessing.org/sketch/1207205
* 
*/
function Inkel(index, x, y) {

  this.index = index;

  this.a = 1;

  this.wetness = 0;
	//red, green, blue
  this.r = 1;
	this.g = 1;
	this.b = 1;
	//position
  this.x = x;
  this.y = y;
}

/*
*
* A method that soaks the canvas with ink at point x, y with a brush of a given diameter.
* This was adapted from a post from sandyaa0313 on the openprocessing forum:
* https://openprocessing.org/sketch/1207205
* 
*/
function soak(brush, x, y) {
    x = parseInt(x);
    y = parseInt(y);

      for (var i = 0; i < brush.width; i++) {
        for (var j = 0; j < brush.height; j++) {
            var locb = 4 * (j * brush.width + i);
            var loc = (y + j - brush.height / 2) * w + (x + i - brush.width / 2);
        if (inkels[loc]) {  
          var Ba = inkels[loc].a;

          var Aa = a * brush.pixels[locb + 3] / 255;

          var Ca = Aa + Ba * (1 - Aa);

          var Ar = r; 
          var Ag = g;
          var Ab = b;

          var Br = inkels[loc].r;
          var Bg = inkels[loc].g;
          var Bb = inkels[loc].b;
          inkels[loc].wetness += brush.pixels[locb + 3]; 
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

//more helper functions
//get random integer within interval
function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

//get random float within range, specified to 
//a precision of decimals
function getRandomFloat(min, max, decimals) {
  const str = (Math.random() * (max - min) + min).toFixed(
    decimals,
  );

  return parseFloat(str);
}

//lookup table for color names to 
//their coresponding hex codes
function colourNameToHex(colour)
{
    var colours = {"aliceblue":"#f0f8ff","antiquewhite":"#faebd7","aqua":"#00ffff","aquamarine":"#7fffd4","azure":"#f0ffff",
    "beige":"#f5f5dc","bisque":"#ffe4c4","black":"#000000","blanchedalmond":"#ffebcd","blue":"#0000ff","blueviolet":"#8a2be2","brown":"#a52a2a","burlywood":"#deb887",
    "cadetblue":"#5f9ea0","chartreuse":"#7fff00","chocolate":"#d2691e","coral":"#ff7f50","cornflowerblue":"#6495ed","cornsilk":"#fff8dc","crimson":"#dc143c","cyan":"#00ffff",
    "darkblue":"#00008b","darkcyan":"#008b8b","darkgoldenrod":"#b8860b","darkgray":"#a9a9a9","darkgreen":"#006400","darkkhaki":"#bdb76b","darkmagenta":"#8b008b","darkolivegreen":"#556b2f",
    "darkorange":"#ff8c00","darkorchid":"#9932cc","darkred":"#8b0000","darksalmon":"#e9967a","darkseagreen":"#8fbc8f","darkslateblue":"#483d8b","darkslategray":"#2f4f4f","darkturquoise":"#00ced1",
    "darkviolet":"#9400d3","deeppink":"#ff1493","deepskyblue":"#00bfff","dimgray":"#696969","dodgerblue":"#1e90ff",
    "firebrick":"#b22222","floralwhite":"#fffaf0","forestgreen":"#228b22","fuchsia":"#ff00ff",
    "gainsboro":"#dcdcdc","ghostwhite":"#f8f8ff","gold":"#ffd700","goldenrod":"#daa520","gray":"#808080","green":"#008000","greenyellow":"#adff2f",
    "honeydew":"#f0fff0","hotpink":"#ff69b4",
    "indianred ":"#cd5c5c","indigo":"#4b0082","ivory":"#fffff0","khaki":"#f0e68c",
    "lavender":"#e6e6fa","lavenderblush":"#fff0f5","lawngreen":"#7cfc00","lemonchiffon":"#fffacd","lightblue":"#add8e6","lightcoral":"#f08080","lightcyan":"#e0ffff","lightgoldenrodyellow":"#fafad2",
    "lightgrey":"#d3d3d3","lightgreen":"#90ee90","lightpink":"#ffb6c1","lightsalmon":"#ffa07a","lightseagreen":"#20b2aa","lightskyblue":"#87cefa","lightslategray":"#778899","lightsteelblue":"#b0c4de",
    "lightyellow":"#ffffe0","lime":"#00ff00","limegreen":"#32cd32","linen":"#faf0e6",
    "magenta":"#ff00ff","maroon":"#800000","mediumaquamarine":"#66cdaa","mediumblue":"#0000cd","mediumorchid":"#ba55d3","mediumpurple":"#9370d8","mediumseagreen":"#3cb371","mediumslateblue":"#7b68ee",
    "mediumspringgreen":"#00fa9a","mediumturquoise":"#48d1cc","mediumvioletred":"#c71585","midnightblue":"#191970","mintcream":"#f5fffa","mistyrose":"#ffe4e1","moccasin":"#ffe4b5",
    "navajowhite":"#ffdead","navy":"#000080",
    "oldlace":"#fdf5e6","olive":"#808000","olivedrab":"#6b8e23","orange":"#ffa500","orangered":"#ff4500","orchid":"#da70d6",
    "palegoldenrod":"#eee8aa","palegreen":"#98fb98","paleturquoise":"#afeeee","palevioletred":"#d87093","papayawhip":"#ffefd5","peachpuff":"#ffdab9","peru":"#cd853f","pink":"#ffc0cb","plum":"#dda0dd","powderblue":"#b0e0e6","purple":"#800080",
    "rebeccapurple":"#663399","red":"#ff0000","rosybrown":"#bc8f8f","royalblue":"#4169e1",
    "saddlebrown":"#8b4513","salmon":"#fa8072","sandybrown":"#f4a460","seagreen":"#2e8b57","seashell":"#fff5ee","sienna":"#a0522d","silver":"#c0c0c0","skyblue":"#87ceeb","slateblue":"#6a5acd","slategray":"#708090","snow":"#fffafa","springgreen":"#00ff7f","steelblue":"#4682b4",
    "tan":"#d2b48c","teal":"#008080","thistle":"#d8bfd8","tomato":"#ff6347","turquoise":"#40e0d0",
    "violet":"#ee82ee",
    "wheat":"#f5deb3","white":"#ffffff","whitesmoke":"#f5f5f5",
    "yellow":"#ffff00","yellowgreen":"#9acd32"};

    if (typeof colours[colour.toLowerCase()] != 'undefined')
        return colours[colour.toLowerCase()];

    return false;
}

//hex to rgb conversion function
function hexToRgb(hex) {
  var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? {
    r: parseInt(result[1], 16),
    g: parseInt(result[2], 16),
    b: parseInt(result[3], 16)
  } : null;
}

  


              