// ColoredPoint.js (c) 2012 matsuda
// Vertex shader program
var VSHADER_SOURCE = `
  attribute vec4 a_Position;
  uniform float u_Size;
  void main() {
    gl_Position = a_Position;
    gl_PointSize = u_Size;
  }`;

// Fragment shader program
var FSHADER_SOURCE = `
  precision mediump float;
  uniform vec4 u_FragColor;\n
  void main() {
    gl_FragColor = u_FragColor;
  }`;

// global variables
let canvas;
let gl;
let a_Position;
let u_FragColor;
let u_Size;

var g_shapesList = [];

function setupWebGL(){
  // Retrieve <canvas> element
  canvas = document.getElementById('webgl');

  // Get the rendering context for WebGL
  gl = getWebGLContext(canvas);
  // gl = getWebGLContext("webgl", { preserveDrawingBuffer: true});
  if (!gl) {
    console.log('Failed to get the rendering context for WebGL');
    return;
  }
}

function connectVariablesToGLSL(){
  // Initialize shaders
  if (!initShaders(gl, VSHADER_SOURCE, FSHADER_SOURCE)) {
    console.log('Failed to intialize shaders.');
    return;
  }

  // // Get the storage location of a_Position
  a_Position = gl.getAttribLocation(gl.program, 'a_Position');
  if (a_Position < 0) {
    console.log('Failed to get the storage location of a_Position');
    return;
  }

  // Get the storage location of u_FragColor
  u_FragColor = gl.getUniformLocation(gl.program, 'u_FragColor');
  if (!u_FragColor) {
    console.log('Failed to get the storage location of u_FragColor');
    return;
  }

  u_Size = gl.getUniformLocation(gl.program, `u_Size`);
  if (!u_Size) {
    console.log('Failed to get the storage location of u_Size');
    return;
  }
}
// constants
const POINT = 0;
const TRIANGLE = 1;
const CIRCLE = 2;

// UI globals
let g_selectedColor = [0.5, 0.5, 0.5, 1.0]
let g_selectedSize = 30.0;
let g_selectedType = POINT;
let g_selectedSegs = 10;

function addActionsForHtmlUI(){
  // brush stamp shape button events
  document.getElementById(`pointButton`).onclick = function(){ g_selectedType = POINT};
  document.getElementById(`triangleButton`).onclick = function(){ g_selectedType = TRIANGLE};
  document.getElementById(`circleButton`).onclick = function(){ g_selectedType = CIRCLE};
  
  // color slider events
  document.getElementById('redSlide').addEventListener('mouseup',   function() {g_selectedColor[0] = this.value/100;});
  document.getElementById('greenSlide').addEventListener('mouseup', function() {g_selectedColor[1] = this.value/100;});
  document.getElementById('blueSlide').addEventListener('mouseup',  function() {g_selectedColor[2] = this.value/100;});
  document.getElementById('alphaSlide').addEventListener('mouseup', function() {g_selectedColor[3] = this.value/100;});
  // size slider events
  document.getElementById('sizeSlide').addEventListener('mouseup',  function() {g_selectedSize = this.value;});
  document.getElementById('segSlide').addEventListener('mouseup',  function() {g_selectedSegs = this.value;});
  
  // make clear button delete all the shapes from world state
  document.getElementById(`clearButton`).onclick = function() {g_shapesList=[]; renderAllShapes(); };
  document.getElementById(`drawPikachu`).onclick = function() {renderAllShapes(); choosePikachu(); };
  document.getElementById(`drawCustomTri`).onclick = function() {renderAllShapes(); customUITriangle(); };
}

function customUITriangle(){
  let x1 = document.getElementById("x1_coord").value;
  let y1 = document.getElementById("y1_coord").value;
  let x2 = document.getElementById("x2_coord").value;
  let y2 = document.getElementById("y2_coord").value;
  let x3 = document.getElementById("x3_coord").value;
  let y3 = document.getElementById("y3_coord").value;
  if (x1 && x2 && x3 && y1 && y2 && y3){
    var myCustomTriangle = new Triangle();
    myCustomTriangle.renderCustom(g_selectedColor,[x1,y1,x2,y2,x3,y3]);
  }
}

function click(ev) { //pass in event
  console.log("in click");
  // Extract the event click and return it in WebGL coordinates
  [x,y] = convertCoords(ev);
  console.log([x,y]);

  // create and store the new point
  let stamp;
  console.log(`type: ${g_selectedType}`);
  if (g_selectedType == POINT){
    stamp = new Point();
  }
  else if (g_selectedType == TRIANGLE){
    stamp = new Triangle();
    console.log("stamp:");
    console.log(stamp);
  }
  else if (g_selectedType == CIRCLE){
    stamp = new Circle();
  }
  else {
    console.log("in else of stamp shape");
    stamp = new Point();
  }
  console.log(stamp);
  console.log([x,y]);
  stamp.position = [x,y];
  stamp.color    = g_selectedColor.slice(); //slice makes a proper copy
  stamp.size     = g_selectedSize;
  if(g_selectedType == CIRCLE){
    stamp.segments = g_selectedSegs;
  }
  console.log("stamp bef push");
  console.log(stamp);
  g_shapesList.push(stamp);
  // draw everything
  renderAllShapes();
}
function main() {
  setupWebGL();
  connectVariablesToGLSL();

  // set up actions from the html ui elements
  addActionsForHtmlUI();

  // Register function (event handler) to be called on a mouse press
  canvas.onmousedown = click;
  canvas.onmousemove = function(ev) { if(ev.buttons == 1) { click(ev) } };

  // Specify the color for clearing <canvas>
  gl.clearColor(0.0, 0.0, 0.0, 1.0);

  // Clear <canvas>
  gl.clear(gl.COLOR_BUFFER_BIT);
  choosePikachu();
}

function choosePikachu(){
  // START DRAWING PIKACHU
  // left ear
  var one = new Triangle();
  one.renderCustom([0.3,0.3,0.3,1.0], [-0.7,0.5,  -0.5,0.2,  -0.5,0.4]);
  var two = new Triangle;
  two.renderCustom([1.0,0.8,0.1,1.0], [-0.5,0.2,  -0.5,0.4,  -0.2,0.1]);
  var three = new Triangle();
  // face base
  three.renderCustom([1.0,0.8,0.1,1.0], [-0.5,0.2,  -0.2,0.1, -0.3,0.0]);
  var four = new Triangle();
  four.renderCustom([1.0,0.8,0.1,1.0], [-0.2,0.1,  -0.3,0.0, -0.4,-0.3]);
  var five = new Triangle();
  five.renderCustom([1.0,0.8,0.1,1.0], [-0.2,0.1, -0.4,-0.3, 0.3,-0.5]);
  var six = new Triangle();
  six.renderCustom([1.0,0.8,0.1,1.0], [-0.4,-0.3, 0.3,-0.5, -0.3, -0.5]);
  var seven = new Triangle();
  seven.renderCustom([1.0,0.8,0.1,1.0], [-0.2,0.1, 0.3,-0.5, 0.3,0.0]);
  var seven = new Triangle();
  seven.renderCustom([1.0,0.8,0.1,1.0], [0.3,-0.5, 0.3,0.0, 0.4,-0.3]);
  var eight = new Triangle();
  eight.renderCustom([1.0,0.8,0.1,1.0], [-0.2,0.1, 0.2,0.1, 0.3,0.0]);
  // right ear
  var nine = new Triangle();
  nine.renderCustom([1.0,0.8,0.1,1.0], [0.2,0.1, 0.3,0.0, 0.5,0.2]);
  var ten = new Triangle();
  ten.renderCustom([1.0,0.8,0.1,1.0], [0.2,0.1,  0.5,0.2, 0.5,0.4]);
  var eleven = new Triangle();
  eleven.renderCustom([0.3,0.3,0.3,1.0], [0.7,0.5,  0.5,0.2, 0.5,0.4]);
  // nose
  var twelve = new Triangle();
  twelve.renderCustom([0.3,0.3,0.3,1.0], [-0.05,-0.3, 0.05,-0.3, 0.0,-0.34]);
  // cheeks
  var circle1 = new Circle();
  circle1.renderCustom([0.9, 0.2, 0.2, 1.0],[-0.25,-0.35],20);
  var circle2 = new Circle();
  circle2.renderCustom([0.9, 0.2, 0.2, 1.0],[0.25,-0.35],20);
  // eyes black
  var circle3 = new Circle();
  circle3.renderCustom([0.0, 0.0, 0.0, 1.0],[0.2,-0.12],15);
  var circle4 = new Circle();
  circle4.renderCustom([0.0, 0.0, 0.0, 1.0],[-0.2,-0.12],15);
  // eyes white
  var circle5 = new Circle();
  circle5.renderCustom([1.0, 1.0, 1.0, 1.0],[0.17,-0.1],5);
  var circle6 = new Circle();
  circle6.renderCustom([1.0, 1.0, 1.0, 1.0],[-0.24,-0.1],5);
  //mouth outline
  var circle7 = new Circle();
  circle7.renderCustom([0.3,0.3,0.3,1.0],[0.0,-0.4],13);
  // mouth
  var circle7 = new Circle();
  circle7.renderCustom([1, 0.63, 0.43, 1.0],[0.0,-0.4],12);
}
function convertCoords(ev){
  var x = ev.clientX; // x coordinate of a mouse pointer
  var y = ev.clientY; // y coordinate of a mouse pointer
  var rect = ev.target.getBoundingClientRect();

  x = ((x - rect.left) - canvas.width/2)/(canvas.width/2);
  y = (canvas.height/2 - (y - rect.top))/(canvas.height/2);
  return [x,y];
}

function renderAllShapes(){
  // Clear <canvas>
  gl.clear(gl.COLOR_BUFFER_BIT);

  var len = g_shapesList.length;
  for(var i = 0; i < len; i++) {
    g_shapesList[i].render();
  }
}