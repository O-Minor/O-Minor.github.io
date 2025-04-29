// ColoredPoint.js (c) 2012 matsuda
// Vertex shader program
var VSHADER_SOURCE = `
  attribute vec4 a_Position;
  uniform mat4 u_ModelMatrix;
  uniform mat4 u_GlobalRotateMatrix;
  void main() {
    gl_Position = u_GlobalRotateMatrix * u_ModelMatrix * a_Position;
  }`;

// Fragment shader program
var FSHADER_SOURCE = `
  precision mediump float;
  uniform vec4 u_FragColor;
  void main() {
    gl_FragColor = u_FragColor;
  }`;

// global variables
var canvas;
var gl;
var a_Position;
var u_FragColor;
var u_Size;
var u_GlobalRotateMatrix;

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

  gl.enable(gl.DEPTH_TEST);
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

  u_ModelMatrix = gl.getUniformLocation(gl.program, `u_ModelMatrix`);
  if (!u_ModelMatrix) {
    console.log(`Failed to get the storage locaiton of u_ModelMatrix`);
    return;
  }

  u_GlobalRotateMatrix = gl.getUniformLocation(gl.program, `u_GlobalRotateMatrix`);
  if (!u_GlobalRotateMatrix) {
    console.log(`Failed to get the storage locaiton of u_GlobalRotateMatrix`);
    return;
  }

  // Set an initial value for this matrix to the identity matrix
  var identityM = new Matrix4();
  gl.uniformMatrix4fv(u_ModelMatrix, false, identityM.elements);


}
// constants
const POINT = 0;
const TRIANGLE = 1;
const CIRCLE = 2;

// UI globals
var g_selectedColor = [0.5, 0.5, 0.5, 1.0]
// var g_selectedSize = 30.0;
var g_selectedType = POINT;
var g_globalAngle = 0;


// animal angles
var g_headAngle = 0;
var g_leftArmAngle = 0;
var g_leftHandAngle = 0;
var g_rightArmAngle = 0;
var g_rightHandAngle = 0;

// animation options
var g_firstAnimation = true;

function addActionsForHtmlUI(){
  // FOR A2
  // animation buttons
  document.getElementById('firstAnimationOn').onclick = function() {g_firstAnimation = true;};
  document.getElementById('firstAnimationOff').onclick = function() {g_firstAnimation = false;};

  // camera
  //document.getElementById('angleSlide').addEventListener('mouseup',   function() {g_globalAngle = this.value; renderAllShapes(); });
  //document.getElementById('angleSlide').addEventListener('mousemove',   function() {g_globalAngle = this.value; renderScene(); });
  document.getElementById('angleSlide').addEventListener('mousemove',   function() {g_globalAngle = this.value;});
  
  // angle slider events
  document.getElementById('HeadSlide').addEventListener('mousemove',   function() {g_headAngle = -1*this.value;});
  // left
  document.getElementById('LeftArmSlide').addEventListener('mousemove',   function() {g_leftArmAngle = this.value;});
  document.getElementById('LeftHandSlide').addEventListener('mousemove',   function() {g_leftHandAngle = 1*this.value;});
  // right
  document.getElementById('RightArmSlide').addEventListener('mousemove',   function() {g_rightArmAngle = this.value;});
  document.getElementById('RightHandSlide').addEventListener('mousemove',   function() {g_rightHandAngle = 1*this.value;});
  // dual
  document.getElementById('ArmsSlide').addEventListener('mousemove',   function() {g_rightArmAngle = 1*this.value; g_leftArmAngle = this.value;  renderScene();});
  document.getElementById('HandsSlide').addEventListener('mousemove',   function() {g_rightHandAngle = 1*this.value; g_leftHandAngle = 1*this.value; renderScene();});

}

var g_secondAnimation = false;

function shiftClick(ev) { //pass in event
  console.error(`anim bool is: ${g_secondAnimation}`);
  //log.textContent = `In click. anim bool is: ${g_secondAnimation}`;
  if (!g_secondAnimation){
    g_secondAnimation = true;
  }else{
    g_secondAnimation = false;
  }
}

function click(ev) { //pass in event
  console.log("in click");
  // Extract the event click and return it in WebGL coordinates
  [x,y] = convertCoords(ev);
  console.log([x,y]);
  // html actions line for refference
  // document.getElementById('angleSlide').addEventListener('mousemove',   function() {g_globalAngle = this.value; renderAllShapes(); });
  //document.getElementById('webgl').addEventListener('mousemove',   function() {g_globalAngle = x; renderAllShapes(); });
}
function main() {
  setupWebGL();
  connectVariablesToGLSL();

  // set up actions from the html ui elements
  addActionsForHtmlUI();

  // Register function (event handler) to be called on a mouse press
  canvas.onmousedown = click;
  canvas.onmousemove = function(ev) { if(ev.buttons == 1) { click(ev) } };

  // SHIFT SANDBOX
  let log = document.querySelector("#log");
  document.addEventListener("click", logKey);

  function logKey(ev) {
    log.textContent = `The shift key is pressed: ${ev.shiftKey}`;
      //canvas.onmousedown = click;
      //canvas.onmousemove = function(ev) { if(ev.buttons == 1) { click(ev) } };
  }
  canvas.onmousedown = function(ev) { if(ev.shiftKey) { shiftClick(ev); } };
  // END SHIFT SANDBOX

  // Specify the color for clearing <canvas>
  gl.clearColor(0.8, 0.9, 1.0, 1.0);

  // Clear <canvas>
  gl.clear(gl.COLOR_BUFFER_BIT);

  //renderAllShapes();
  requestAnimationFrame(tick);
}

// time globals
var g_startTime = performance.now()/1000.0;
var g_seconds = performance.now()/1000.0-g_startTime;

function tick(){
  g_seconds = performance.now()/1000.0-g_startTime;
  console.log(g_seconds);
  //console.log(performance.now());
  updateAnimationAngles();
  renderScene();
  requestAnimationFrame(tick);
}

function convertCoords(ev){
  var x = ev.clientX; // x coordinate of a mouse pointer
  var y = ev.clientY; // y coordinate of a mouse pointer
  var rect = ev.target.getBoundingClientRect();

  x = ((x - rect.left) - canvas.width/2)/(canvas.width/2);
  y = (canvas.height/2 - (y - rect.top))/(canvas.height/2);
  return [x,y];
}

// r for realtime
// cockpit
var r_headAngle;
var r_neckAngle;
// left leg
var r_larmAngle;
var r_lhandAngle;
var r_lstompAngle;
// right leg
var r_rarmAngle;
var r_rhandAngle;
var r_rstompAngle;

function updateAnimationAngles(){
  //console.error("angles updated");
  // cockpit angle options
  if (g_secondAnimation){
    // get maths
    r_neckAngle = 15*Math.sin(g_seconds);
    r_headAngle = -13*Math.sin(g_seconds);
  } else{
    // get sliders
    r_neckAngle = g_headAngle; // slider id wasnt renamed
    r_headAngle = 0;
  }

  // legs angle options
  if (g_firstAnimation){
    // get maths
    r_larmAngle = 15*Math.sin(g_seconds);
    r_rarmAngle = 15*Math.sin(g_seconds+20);
    r_lhandAngle = 9*Math.sin(g_seconds+20);
    r_rhandAngle = -9*Math.sin(g_seconds);

  } else{
    // get sliders
    r_larmAngle = g_leftArmAngle;
    r_rarmAngle = g_rightArmAngle;
    r_lhandAngle = g_leftHandAngle;
    r_rhandAngle = g_rightHandAngle;
  }
  
  // stomps were too complicated to 
  // move into this function with the
  // time i had
}

function renderScene(){
  updateAnimationAngles();
  var startTime = performance.now();
  var duration;

  // pass the matric to u_ModelMatrix attriubte
  var globalRotMat=new Matrix4().rotate(g_globalAngle, 0, 1, 0);
  gl.uniformMatrix4fv(u_GlobalRotateMatrix, false, globalRotMat.elements);

  // Clear <canvas>
  gl.clear(gl.COLOR_BUFFER_BIT);

  // Draw a cube
  var body = new Cube();
  body.color = [0.5, 0.5, 0.6, 1];
  body.matrix.setTranslate(-0.3, 0, 0);
  body.matrix.rotate(-5,1,0,0);
  var bodCoordsMat = new Matrix4(body.matrix);
  body.matrix.scale(0.9, 0.6, 0.6); // happens first non uniform scale to make rect
  body.render();

  var lump = new Cube(bodCoordsMat);
  lump.color = [0.5, 0.5, 0.6, 1];
  lump.matrix.translate(0.1,0.5,0);
  lump.matrix.scale(0.7,0.2,0.6);
  lump.render();

  var neck = new Cube(bodCoordsMat);
  // if you make this into a neck then these transforms
  // are in the wrong order for making this a parent
  neck.color = [0.6, 0.6, 0.7, 1];
  neck.matrix.translate(0.1,0.3,0.301,0.001);
  // if (g_secondAnimation){
  //   neck.matrix.rotate(15*Math.sin(g_seconds),0,1,0);
  // }else{
  //   neck.matrix.rotate(g_headAngle,0,1,0);
  // }
  //console.error(r_neckAngle);
  neck.matrix.rotate(r_neckAngle,0,1,0);
  neck.matrix.rotate(-180,0,0,1);
  var neckCoordsMat = new Matrix4 (neck.matrix);
  neck.matrix.scale(0.55,0.2,0.2);
  neck.render();

  //g_globalAngle = -77;
  var head = new Cube(neckCoordsMat);
  // if you make this into a neck then these transforms
  // are in the wrong order for making this a parent
  head.color = [0.6, 0.6, 0.7, 1];
  // if (g_secondAnimation){
  //   head.matrix.rotate(-13*Math.sin(g_seconds),0,1,0);
  // }
  // head has no slider of its own
  //console.error(r_headAngle);
  head.matrix.rotate(r_headAngle,0,1,0);
  head.matrix.rotate(-180,0,0,1);
  head.matrix.translate(-0.7,-0.25,-0.151,0.001);
  head.matrix.scale(0.4,0.3,0.4);
  head.render();

  // draw left arm
  var leftArm = new Cube(bodCoordsMat);
  leftArm.color = [0.4, 0.4, 0.4, 1];
  // moving the block TRANS ROT
  //leftArm.matrix = bodCoordsMat;
  leftArm.matrix.setTranslate(-0.1, -0.8, 0.0); // ask what dif febwtween setTrasn and
  leftArm.matrix.rotate(180,0,0,1);
  leftArm.matrix.translate(-0.05,-0.901,0.001);
  // if (g_firstAnimation){
  //   leftArm.matrix.rotate(15*Math.sin(g_seconds), 0, 0, 1);
  // }else{
  //   leftArm.matrix.rotate(g_leftArmAngle, 0, 0, 1);
  // }
  leftArm.matrix.rotate(r_larmAngle, 0, 0, 1);
  var leftArmCoordsMat = new Matrix4(leftArm.matrix);
  // setting the shape of the box SCALES
  leftArm.matrix.scale(0.2, 0.5, 0.2);
  leftArm.render();

  // draw right arm
  var rightArm = new Cube(bodCoordsMat);
  rightArm.color = [0.4, 0.4, 0.4, 1];
  // moving the block TRANS ROT
  //rightArm.matrix = bodCoordsMat;
  rightArm.matrix.setTranslate(0.5, -0.8, 0.0); // ask what dif febwtween setTrasn and
  rightArm.matrix.rotate(180,0,0,1);
  rightArm.matrix.translate(-0.05,-0.901,0.001);
  // if (g_firstAnimation){
  //   rightArm.matrix.rotate(15*Math.sin(g_seconds+20), 0, 0, 1);
  // }else{
  //   rightArm.matrix.rotate(g_rightArmAngle, 0, 0, 1);
  // }
  rightArm.matrix.rotate(r_rarmAngle, 0, 0, 1);
  var rightArmCoordsMat = new Matrix4(rightArm.matrix);
  // setting the shape of the box SCALES
  rightArm.matrix.scale(0.2, 0.5, 0.2);
  rightArm.render();

  var leftHand = new Cube(leftArmCoordsMat);
  leftHand.color = [0.6, 0.6, 0.7, 1];
  //leftHand.matrix = leftArmCoordsMat;
  leftHand.matrix.translate(0.001, 0.44, -0.0001, 0);
  // if (g_firstAnimation){
  //   leftHand.matrix.rotate(9*Math.sin(g_seconds+20), 0, 0, 1);
  // }else{
  //   leftHand.matrix.rotate(g_leftHandAngle, 0, 0, 1);
  // }
  leftHand.matrix.rotate(r_lhandAngle,0,0,1);
  var leftHandCoordsMat = new Matrix4(leftHand.matrix);
  leftHand.matrix.scale(0.18,0.5,0.2);
  leftHand.render();

  var rightHand = new Cube();
  rightHand.color = [0.6, 0.6, 0.7,1];
  rightHand.matrix = rightArmCoordsMat;
  rightHand.matrix.translate(0.001, 0.44, -0.0001, 0);
  if (g_firstAnimation){
    rightHand.matrix.rotate(-9*Math.sin(g_seconds), 0, 0, 1);
  }else{
    rightHand.matrix.rotate(g_rightHandAngle, 0, 0, 1);
  }
  rightHand.matrix.rotate(r_rhandAngle,0,0,1);
  var rightHandCoordsMat = new Matrix4(rightHand.matrix);
  rightHand.matrix.scale(0.18,0.5,0.2);
  rightHand.render();

  var rightStomp = new Cube(rightHandCoordsMat);
  rightStomp.color = [0.8, 0.8, 0.9,1];
  if (g_firstAnimation){
    rightStomp.matrix.rotate(-(8*Math.cos(g_seconds)), 0, 0, 1);
  }else{
    //leftStomp.matrix.rotate(g_leftStompAngle, 0, 0, 1);
    if ((g_rightHandAngle-9)>0){
      rFlatAngle = -(g_rightHandAngle-9);
    } else{
      rFlatAngle = 0;
    }
  }
  rightStomp.matrix.translate(-0.1,0.4,-0.05);
  if (!g_firstAnimation){
    rightStomp.matrix.rotate(rFlatAngle,0,0,1);
  }
  rightStomp.matrix.scale(0.35,0.2,0.3);
  rightStomp.render();

  var leftStomp = new Cube(leftHandCoordsMat);
  leftStomp.color = [0.8, 0.8, 0.9,1];
  //console.log(g_rightHandAngle-9);
  if (g_firstAnimation){
    leftStomp.matrix.rotate(-(8*Math.cos(g_seconds)), 0, 0, 1);
  }else{
    //leftStomp.matrix.rotate(g_leftStompAngle, 0, 0, 1);
    if ((g_leftHandAngle-9)>0){
      lFlatAngle = -(g_leftHandAngle-9);
    } else{
      lFlatAngle = 0;
    }
  }
  leftStomp.matrix.translate(-0.1,0.4,-0.05);
  if (!g_firstAnimation){
    leftStomp.matrix.rotate(lFlatAngle,0,0,1);
  }
  leftStomp.matrix.scale(0.35,0.2,0.3);
  leftStomp.render();

  duration = performance.now() - startTime;
  sendTextToHTML(' ms: ' + Math.floor(duration) + ' fps: ' + Math.floor(10000/duration)/10,
   'numdot');
}

function sendTextToHTML(text, htmlID){
  var htmlElm = document.getElementById(htmlID);
  if (!htmlElm) {
    console.log('Could not get to element with id ' + htmlID + " from HTML");
  }
  htmlElm.innerHTML = text;
}

// SWITCHABLE GRAVEYARD

// function customUITriangle(){
//   var x1 = document.getElementById("x1_coord").value;
//   var y1 = document.getElementById("y1_coord").value;
//   var x2 = document.getElementById("x2_coord").value;
//   var y2 = document.getElementById("y2_coord").value;
//   var x3 = document.getElementById("x3_coord").value;
//   var y3 = document.getElementById("y3_coord").value;
//   if (x1 && x2 && x3 && y1 && y2 && y3){
//     var myCustomTriangle = new Triangle();
//     myCustomTriangle.renderCustom(g_selectedColor,[x1,y1,x2,y2,x3,y3]);
//   }
// }