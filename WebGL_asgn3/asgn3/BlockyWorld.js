// ColoredPoint.js (c) 2012 matsuda
// CITATIONS
// snow02 from https://polyhaven.com/a/snow_02
// powder snow and blue ice from Minecraft
// ocean from
// https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fimg.freepik.com%2Fpremium-photo%2Ffree-sea-texture-seamless-tileable-background_662214-2681.jpg&f=1&nofb=1&ipt=18b0275cc9ee1b1d118b2a13459cc806e4306d13120f966f5c7f66f2b034a7e9
// Vertex shader program
var VSHADER_SOURCE = `
  precision mediump float;
  attribute vec4 a_Position;
  attribute vec2 a_UV;
  varying vec2 v_UV;
  uniform mat4 u_ModelMatrix;
  uniform mat4 u_GlobalRotateMatrix;
  uniform mat4 u_ViewMatrix;
  uniform mat4 u_ProjectionMatrix;
  void main() {
    gl_Position = u_ProjectionMatrix * u_ViewMatrix * u_GlobalRotateMatrix * u_ModelMatrix * a_Position;
    v_UV = a_UV;
  }`;

// Fragment shader program
var FSHADER_SOURCE = `
  precision mediump float;
  varying vec2 v_UV;
  uniform vec4 u_FragColor;
  uniform sampler2D u_Sampler0;
  uniform sampler2D u_Sampler1;
  uniform int u_whichTexture;
  void main() {
    gl_FragColor = u_FragColor;
    gl_FragColor = vec4(v_UV, 1.0, 1.0);
    gl_FragColor = texture2D(u_Sampler0, v_UV);
    gl_FragColor = texture2D(u_Sampler1, v_UV);

    if(u_whichTexture == -2){
     gl_FragColor = u_FragColor; //Use color

    } else if(u_whichTexture == -1){
     gl_FragColor = vec4(v_UV, 1.0, 1.0); //Use UV debug color

    } else if(u_whichTexture == 0){
      gl_FragColor = texture2D(u_Sampler0, v_UV); //use texture0

    }  else if(u_whichTexture == 1){
      gl_FragColor = texture2D(u_Sampler1, v_UV); //use texture1
      //gl_FragColor = vec4(1,0.2,0.2,1);
    } else {
      gl_FragColor = vec4(1,0.2,0.2,1); 
    }
  }`;

// Global Variables
var canvas;
var gl;
var a_Position;
var a_UV;
var u_FragColor;
var u_Size;
var u_GlobalRotateMatrix;
var u_Sampler0;
var u_Sampler1;
var u_whichTexture;

var g_shapesList = [];

function setupWebGL(){
  // Retrieve <canvas> element
  canvas = document.getElementById('webgl');
  //console.log(canvas);

  // Get the rendering context for WebGL
  gl = getWebGLContext(canvas);
  // gl = getWebGLContext("webgl", { preserveDrawingBuffer: true});
  if (!gl) {
    console.log('Failed to get the rendering context for WebGL');
    return;
  }

  gl.enable(gl.DEPTH_TEST);
}

// make empty array
var textures_array = [];

function connectVariablesToGLSL(){
  // Initialize shaders
  if (!initShaders(gl, VSHADER_SOURCE, FSHADER_SOURCE)) {
    console.log('Failed to intialize shaders.');
    return;
  }

  // Get the storage location of a_Position
  a_Position = gl.getAttribLocation(gl.program, 'a_Position');
  if (a_Position < 0) {
    console.log('Failed to get the storage location of a_Position');
    return;
  }

  a_UV = gl.getAttribLocation(gl.program, 'a_UV');
  if (a_Position < 0) {
    console.log('Failed to get the storage location of a_UV');
    return;
  }

  // Get the storage location of u_FragColor
  u_FragColor = gl.getUniformLocation(gl.program, 'u_FragColor');
  if (!u_FragColor) {
    console.log('Failed to get the storage location of u_FragColor');
    return;
  }

  // Get the storage location of u_ModelMatrix
  u_ModelMatrix = gl.getUniformLocation(gl.program, `u_ModelMatrix`);
  if (!u_ModelMatrix) {
    console.log(`Failed to get the storage locaiton of u_ModelMatrix`);
    return;
  }

  // Get the storage location of u_GlobalRotateMatrix
  u_GlobalRotateMatrix = gl.getUniformLocation(gl.program, `u_GlobalRotateMatrix`);
  if (!u_GlobalRotateMatrix) {
    console.log(`Failed to get the storage locaiton of u_GlobalRotateMatrix`);
    return;
  }

  // Get the storage location of u_ViewMatrix
  u_ViewMatrix = gl.getUniformLocation(gl.program, `u_ViewMatrix`);
  if (!u_ViewMatrix) {
    console.log(`Failed to get the storage locaiton of u_ViewMatrix`);
    return;
  }

  // Get the storage location of u_ProjectionMatrix
  u_ProjectionMatrix = gl.getUniformLocation(gl.program, `u_ProjectionMatrix`);
  if (!u_ProjectionMatrix) {
    console.log(`Failed to get the storage locaiton of u_ProjectionMatrix`);
    return;
  }

  // Get the storage location of u_Sampler0
  
  // for loop of init the u_sampler and add to array
  var u_Sampler0 = gl.getUniformLocation(gl.program, 'u_Sampler0');
  if (!u_Sampler0) {
    console.log('Failed to get the storage location of u_Sampler0');
    return false;
  }
  textures_array.push(u_Sampler0);

  var u_Sampler1 = gl.getUniformLocation(gl.program, 'u_Sampler1');
  if (!u_Sampler1) {
    console.log('Failed to get the storage location of u_Sampler1');
    return false;
  }
  textures_array.push(u_Sampler1);
  //console.log(textures_array);

  u_whichTexture = gl.getUniformLocation(gl.program, 'u_whichTexture');
  if (!u_whichTexture) {
    console.log('Failed to get the storage location of u_whichTexture');
    return false;
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
var g_globalAngle = -40;
var g_won_already = false;

// animal angles
var g_headAngle = 0;
var g_leftArmAngle = 0;
var g_leftHandAngle = 0;
var g_rightArmAngle = 0;
var g_rightHandAngle = 0;

// animation options
var g_firstAnimation = true;

// source: developer.mozilla.org/en-US/docs/Web/API/Pointer_Lock_API 
// recomended by Daksh
function requestPointerLockWithUnadjustedMovement() {
  const promise = canvas.requestPointerLock({
    unadjustedMovement: true
  });

  if (!promise) {
    console.log("disabling mouse acceleration is not supported");
    return;
  }

  return promise
    .then(() => console.log("pointer is locked"))
    .catch((error) => {
      if (error.name === "NotSupportedError") {
        // Some platforms may not support unadjusted movement.
        // You can request again a regular pointer lock.
        return canvas.requestPointerLock();
      }
    });
}

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
  document.getElementById('ArmsSlide').addEventListener('mousemove',   function() {g_rightArmAngle = 1*this.value; g_leftArmAngle = this.value; });
  document.getElementById('HandsSlide').addEventListener('mousemove',   function() {g_rightHandAngle = 1*this.value; g_leftHandAngle = 1*this.value;});

  //MOUSE TURNING ASGN 3
  //requestPointerLockWithUnadjustedMovement();
  // canvas.addEventListener("click", async () =>{
  //   await canvas.requestPointerLock({
  //     unadjustedMovement: true,
  //   });
  // });
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

function initTextures(gl, n) { //image loading in JS
  
  var image0 = new Image(); // Create the image object
  if (!image0) {
    console.log('Failed to create image 0 object');
    return false;
  }
  // Register the event handler to be called when image loading is completed
  image0.onload = function(){ sendImagetoTEXTUREn( image0, 0); };
  // Tell the browser to load an Image

  var image1 = new Image(); // Create the image object
  if (!image1) {
    console.log('Failed to create image 1 object');
    return false;
  }
  // Register the event handler to be called when image loading is completed
  image1.onload = function(){ sendImagetoTEXTUREn( image1, 1); };

  // Tell the browser to load an Image
  // MATERIALS
  //image0.src = 'sea.jpg'; // ground
  image0.src = 'sea.jpg';
  image1.src = 'snow02_bright.jpg'; // main blocks
  //image2.src = 'storm2.jpg';
  //snow02_bright.jpg
  //console.log(image0.src);
  //console.log(image1.src);

  return true;
}

function sendImagetoTEXTUREn( image, textureIndex) { //GLSL stuff
  var texture = gl.createTexture();// Create a texture object on the GPU
  if (!texture) {
    console.log('Failed to create the texture object');
    return false;
  }

  gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, 1);  // Flip the image Y coordinate
  // Activate texture unit0
  gl.activeTexture(gl.TEXTURE0+textureIndex); //index in GLSL
  // Bind the texture object to the target
  gl.bindTexture(gl.TEXTURE_2D, texture);

  // Set the texture parameter
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
  // Set the image to texture
  gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, gl.RGB, gl.UNSIGNED_BYTE, image);
  
  // Set the texture unit 0 to the sampler
  //array for u_Samplers and index by textureIndex and second param is textureIndex
  //[u sampler0, usmpaler1...] for thing in that array uniform1i(that item, texture num)
  for (i = 0; i<=textures_array.length; i++){
    gl.uniform1i(textures_array[i], i);
  }
  // gl.uniform1i(u_Sampler0, 0);
  
  // gl.clear(gl.COLOR_BUFFER_BIT);  // Clear <canvas>

  // gl.drawArrays(gl.TRIANGLE_STRIP, 0, n);  // Draw the rectangle
  console.log(`finished loadTexture`);
}

// Start asgn 2 stuff
function click(ev) { //pass in event
  console.log("in click");
  // Extract the event click and return it in WebGL coordinates
  [x,y] = convertCoords(ev);
  // console.log([x,y]);
  // html actions line for refference
  // document.getElementById('angleSlide').addEventListener('mousemove',   function() {g_globalAngle = this.value; renderAllShapes(); });
  // // MOUSE ROTATION CONTROL
  // document.getElementById('webgl').addEventListener('mousemove',
  //   function () {
  //     //g_globalAngle = x*-180; 
  //     //when positive -> panRight(movementx);
  //     console.log(`x movement ${ev.movementX}`);
  //     //when negative -> panLeft(-movementx);
  //   } );
}
//end asgn 2 stuff

function main() {
  setupWebGL();
  connectVariablesToGLSL();

  // set up actions from the html ui elements
  addActionsForHtmlUI();

  document.onkeydown = keydown;

  // MOUSE ROTATION CONTROL
  document.getElementById('webgl').addEventListener('mousemove',
    function (ev) {
      //g_globalAngle = x*-180; 
      //when positive -> panRight(movementx);
      console.log(`x movement ${ev.movementX}`);
      //when negative -> panLeft(-movementx);
      let delta = ev.movementX;
      if (delta < 0){
        g_camera.panLeft(-delta);
      } else{
        g_camera.panRight(delta);
      }
  } );

  // Start ASGN 2 stuff
    // Register function (event handler) to be called on a mouse press
    canvas.onmousedown = click;
    canvas.onmousemove = function(ev) { 
      if(ev.buttons == 1) { click(ev) } };

    let log = document.querySelector("#log");
    document.addEventListener("click", logKey);

    function logKey(ev) {
      log.textContent = `The shift key is pressed: ${ev.shiftKey}`;
        //canvas.onmousedown = click;
        //canvas.onmousemove = function(ev) { if(ev.buttons == 1) { click(ev) } };
    }
    canvas.onmousedown = function(ev) { 
      if(ev.shiftKey) { shiftClick(ev); } };
  // End ASGN2 Stuff

  g_camera = new Camera(canvas);
  initTextures();

  // Specify the color for clearing <canvas>
  gl.clearColor(1, 1, 1.0, 1.0);

  // Clear <canvas>
  gl.clear(gl.COLOR_BUFFER_BIT);

  //renderAllShapes();
  requestAnimationFrame(tick);
}

var g_wspeed;
var g_aspeed;
var g_sspeed;
var g_dspeed;
var g_qspeed;
var g_espeed;

function keydown(ev){
  if (ev.keyCode == 87){ // W key
    console.log('W pressed');
    g_camera.moveForward(0.5);
    //g_wspeed = 0.5;
  } else
  if (ev.keyCode == 65){ // A key
    console.log('A pressed');
    g_camera.moveLeft(0.5);
    //g_aspeed = 0.5;
  }
  else
  if (ev.keyCode == 83){ // S key
    console.log('S pressed');
    g_camera.moveBackwards(0.5);
    //g_sspeed = 0.5;
  }
  else
  if (ev.keyCode == 68){ // D key
    console.log('D pressed');
    g_camera.moveRight(0.5);
    //g_dspeed = 0.5;
  }
  else
  if (ev.keyCode == 81){ // Q key
    console.log('Q pressed');
    g_camera.panLeft(10);
    //g_qspeed = 10;
  }
  else
  if (ev.keyCode == 69){ // E key
    console.log('E pressed');
    g_camera.panRight(10);
    //g_espeed = 10;
  }
}

// time globals
var g_startTime = performance.now()/1000.0;
var g_seconds = performance.now()/1000.0-g_startTime;

function tick(){
  g_seconds = performance.now()/1000.0-g_startTime;
  // console.log(g_seconds);
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

var g_map = bigmap;

function drawMap(){
  x_len = g_map[0].length;
  //console.log(x_len);
  y_len = g_map.length;
  //console.log(y_len);
  var block = new Cube();
  block.color = [0.9, 0.9, 1.0, 1.0];
  
  
  for (x = 0; x<x_len; x++){
    for (y=0; y<y_len; y++){
      //console.log(x,y);
      let mapdot = g_map[x][y];
      if (mapdot > 0){
        block.textureNum = 1;
        for(i = 1; i<=mapdot; i++){
          //console.log('block matrix');
          //console.log(block.matrix);
          let h = -0.99;
          if (i > 1){
            h +=i*(0.5);
          }
          //block.matrix.setTranslate(x-6, h, y-6);
          block.matrix.setTranslate(x-9, h, y-9);
          //block.matrix.scale(0.5,0.5,0.5);
          block.renderfast();
        }
      }
      if (mapdot < 0){
        //console.log("neg block");
        block.matrix.setTranslate(x-9, -1.99, y-9);
        block.renderfast();
      }
    }
  }
}

// this is a non class way to set up camera instead make camera obj
// var g_eye = new Vector3([0,0,3]);//[0,0,3]
// var g_at = new Vector3([0,0,-100]);
// var g_up = new Vector3([0, 1, 0]);
// replace these with g_camera.thing
function updateMovement(){
  g_camera.moveForward(g_wspeed);
  g_camera.moveLeft(g_aspeed);
  g_camera.moveBackwards(g_sspeed);
  g_camera.moveRight(g_dspeed);
  g_camera.panLeft(g_qspeed);
  g_camera.panRight(g_espeed);
}
//var g_camera = new Camera(canvas); <- moved to in main so it knows about canvas
function renderScene(){
  
  updateAnimationAngles();
  var startTime = performance.now();
  var duration;
  //console.log(canvas);

  // move forward by forward speed

  // pass the projection matrix
  var projMat = new Matrix4();
  projMat.setPerspective(g_camera.fov, canvas.width / canvas.height, 0.1, 150);
  gl.uniformMatrix4fv(u_ProjectionMatrix, false, projMat.elements);

  // pass the view matrix
  //console.log('in renderfast() scene')
  //console.log(g_camera.eye.elements);
  var viewMat = new Matrix4();
  viewMat.setLookAt(
    g_camera.eye.elements[0], g_camera.eye.elements[1], g_camera.eye.elements[2],
    g_camera.at.elements[0],  g_camera.at.elements[1],  g_camera.at.elements[2], 
    g_camera.up.elements[0],  g_camera.up.elements[1],  g_camera.up.elements[2]); //eye, at, up
  gl.uniformMatrix4fv(u_ViewMatrix, false, viewMat.elements);

  console.log(g_camera.eye.elements[0], g_camera.eye.elements[2], "eye");
  console.log(g_camera.at.elements[0], g_camera.at.elements[2]);
  // pass the matric to u_ModelMatrix attriubte
  var globalRotMat=new Matrix4().rotate(g_globalAngle, 0, 1, 0);
  gl.uniformMatrix4fv(u_GlobalRotateMatrix, false, globalRotMat.elements);

  // Clear <canvas>
  gl.clear(gl.COLOR_BUFFER_BIT);

  if (g_camera.eye.elements[0]>3 && g_camera.eye.elements[0]<4 && g_camera.eye.elements[2]>22 && g_camera.eye.elements[2]<23){
    if (!g_won_already){
      alert("You found the magic cube!");
      g_won_already = true;
    }
  } 
  if (g_won_already == false){
    var tester = new Cube();
    tester.u_whichTexture=-1;
    tester.matrix.translate(17,-.6,15);
    tester.renderfast();
  }
  

  var ground = new Cube();
  //console.log('ground matrix');
  //console.log(ground.matrix);
  ground.textureNum = 0;
  ground.matrix.translate(-10,-1.1,-10,0);
  ground.matrix.scale(32,0.1,32,1);
  ground.renderfast();

  var skybox = new Cube();
  //console.log('sky matrix');
  //console.log(skybox.matrix);
  skybox.color = [0.7,0.7,0.75,1];
  skybox.textureNum = -2;

  //skybox.matrix.translate(-50,-5,-50);
  skybox.matrix.translate(-15,-5,-15);
  skybox.matrix.scale(100,10,100);
  skybox.renderfast();

  drawMap();

  drawRobot();

  function sendTextToHTML(text, htmlID){
    var htmlElm = document.getElementById(htmlID);
    if (!htmlElm) {
      console.log('Could not get to element with id ' + htmlID + " from HTML");
    }
    htmlElm.innerHTML = text;
  }

  function drawRobot(){
    // Draw a cube
    var body = new Cube();
    body.color = [0.5, 0.5, 0.6, 1];
    body.textureNum = -2;
    body.matrix.setTranslate(-0.3, 0, 0);
    body.matrix.rotate(-5,1,0,0);
    var bodCoordsMat = new Matrix4(body.matrix);
    body.matrix.scale(0.9, 0.6, 0.6); // happens first non uniform scale to make rect
    body.renderfast();
    //body.renderfast();

    var lump = new Cube(bodCoordsMat);
    lump.color = [0.5, 0.5, 0.6, 1];
    lump.textureNum = -2;
    lump.matrix.translate(0.1,0.5,0.001);
    lump.matrix.scale(0.7,0.2,0.6);
    lump.renderfast();

    var neck = new Cube(bodCoordsMat);
    neck.color = [0.6, 0.6, 0.7, 1];
    neck.textureNum = -2;
    neck.matrix.translate(0.1,0.3,0.301,0.001);
    neck.matrix.rotate(r_neckAngle,0,1,0);
    neck.matrix.rotate(-180,0,0,1);
    var neckCoordsMat = new Matrix4 (neck.matrix);
    neck.matrix.scale(0.55,0.2,0.2);
    neck.renderfast();

    //g_globalAngle = -77;
    var head = new Cube(neckCoordsMat);
    head.color = [0.6, 0.6, 0.7, 1];
    head.textureNum = -2;
    head.matrix.rotate(r_headAngle,0,1,0);
    head.matrix.rotate(-180,0,0,1);
    head.matrix.translate(-0.7,-0.25,-0.151,0.001);
    head.matrix.scale(0.4,0.3,0.4);
    head.renderfast();

    // draw left arm
    var leftArm = new Cube(bodCoordsMat);
    leftArm.color = [0.4, 0.4, 0.4, 1];
    leftArm.textureNum = -2;
    leftArm.matrix.setTranslate(-0.1, -0.8, -0.0001); // ask what dif febwtween setTrasn and
    leftArm.matrix.rotate(180,0,0,1);
    leftArm.matrix.translate(-0.05,-0.901,0.001);
    leftArm.matrix.rotate(r_larmAngle, 0, 0, 1);
    var leftArmCoordsMat = new Matrix4(leftArm.matrix);
    // setting the shape of the box SCALES
    leftArm.matrix.scale(0.2, 0.5, 0.2);
    leftArm.renderfast();

    // draw right arm
    var rightArm = new Cube(bodCoordsMat);
    rightArm.color = [0.4, 0.4, 0.4, 1];
    rightArm.textureNum = -2;
    rightArm.matrix.setTranslate(0.5, -0.8, 0.0); // ask what dif febwtween setTrasn and
    rightArm.matrix.rotate(180,0,0,1);
    rightArm.matrix.translate(-0.05,-0.901,0.001);
    rightArm.matrix.rotate(r_rarmAngle, 0, 0, 1);
    var rightArmCoordsMat = new Matrix4(rightArm.matrix);
    // setting the shape of the box SCALES
    rightArm.matrix.scale(0.2, 0.5, 0.2);
    rightArm.renderfast();

    var leftHand = new Cube(leftArmCoordsMat);
    leftHand.color = [0.6, 0.6, 0.7, 1];
    leftHand.textureNum = -2;
    leftHand.matrix.translate(0.001, 0.44, -0.0001, 0);
    leftHand.matrix.rotate(r_lhandAngle,0,0,1);
    var leftHandCoordsMat = new Matrix4(leftHand.matrix);
    leftHand.matrix.scale(0.18,0.5,0.2);
    leftHand.renderfast();

    var rightHand = new Cube();
    rightHand.color = [0.6, 0.6, 0.7,1];
    rightHand.textureNum = -2;
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
    rightHand.renderfast();

    var rightStomp = new Cube(rightHandCoordsMat);
    rightStomp.color = [0.7, 0.7, 0.85,1];
    rightStomp.textureNum = -2;
    if (g_firstAnimation){
      rightStomp.matrix.rotate(-(8*Math.cos(g_seconds)), 0, 0, 1);
    }else{
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
    rightStomp.renderfast();

    var leftStomp = new Cube(leftHandCoordsMat);
    leftStomp.color = [0.7, 0.7, 0.85,1];
    leftStomp.textureNum = -2;
    if (g_firstAnimation){
      leftStomp.matrix.rotate(-(8*Math.cos(g_seconds)), 0, 0, 1);
    }else{
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
    leftStomp.renderfast();

    
  }
  duration = performance.now() - startTime;
    sendTextToHTML(' ms: ' + Math.floor(duration) + ' fps: ' + Math.floor(10000/duration)/10,
    'numdot');
  //console.log('still in render scene');
}

// GRAVEYARD
// ASGN 2
// function click(ev) { //pass in event
//   console.log("in click");
//   // Extract the event click and return it in WebGL coordinates
//   [x,y] = convertCoords(ev);
//   // console.log([x,y]);
//   // html actions line for refference
//   // document.getElementById('angleSlide').addEventListener('mousemove',   function() {g_globalAngle = this.value; renderAllShapes(); });
//   document.getElementById('webgl').addEventListener('mousemove',   function() {g_globalAngle = x*-180; } );
// }

// ASGN 1
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