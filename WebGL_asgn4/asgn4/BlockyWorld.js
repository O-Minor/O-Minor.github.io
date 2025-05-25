// ColoredPoint.js (c) 2012 matsuda
// CITATIONS
// chess2 from https://threejs.org/examples/textures/uv_grid_opengl.jpg 
// Vertex shader program
var VSHADER_SOURCE = `
  precision mediump float;
  attribute vec4 a_Position;
  attribute vec2 a_UV;
  attribute vec3 a_Normal;

  varying vec2 v_UV;
  varying vec3 v_Normal;
  varying vec4 v_VertPos;

  uniform mat4 u_ModelMatrix;
  uniform mat4 u_GlobalRotateMatrix;
  uniform mat4 u_ViewMatrix;
  uniform mat4 u_ProjectionMatrix;
  void main() {
    gl_Position = u_ProjectionMatrix * u_ViewMatrix * u_GlobalRotateMatrix * u_ModelMatrix * a_Position;
    v_UV = a_UV;
    v_Normal = a_Normal;
    v_VertPos = u_ModelMatrix * a_Position;
  }`;

// Fragment shader program
var FSHADER_SOURCE = `
  precision mediump float;
  varying vec2 v_UV;
  varying vec3 v_Normal;

  uniform vec4 u_FragColor;
  uniform sampler2D u_Sampler0;
  uniform sampler2D u_Sampler1;
  uniform int u_whichTexture;

  uniform vec3 u_lightPos;
  uniform vec3 u_cameraPos;
  uniform bool u_lightOn;

  varying vec4 v_VertPos;

  void main() {

    if (u_whichTexture == -3){
      gl_FragColor = vec4((v_Normal+1.0)/2.0, 1.0); //use normal as color?
    
    } else if(u_whichTexture == -2){
     gl_FragColor = u_FragColor; //Use color

    } else if(u_whichTexture == -22){
     gl_FragColor = u_FragColor; //Use color but wont be specular
    }
     else if(u_whichTexture == -1){
     gl_FragColor = vec4(v_UV, 1.0, 1.0); //Use UV debug color

    } else if(u_whichTexture == 0){
      gl_FragColor = texture2D(u_Sampler0, v_UV); //use texture0

    }  else if(u_whichTexture == 1){
      gl_FragColor = texture2D(u_Sampler1, v_UV); //use texture1
      //gl_FragColor = vec4(1,0.2,0.2,1);
    } else {
      gl_FragColor = vec4(1,0.0,1,1); 
    }
    
    vec3 lightVector = u_lightPos - vec3(v_VertPos);
    float r = length(lightVector);

    // Red/Green Distance Visualization
    // if (r < 1.0){
    //   gl_FragColor = vec4(1, 0, 0, 1); //red
    // } else if (r < 2.0) {
    //   gl_FragColor = vec4(0, 1, 0, 1); //green
    // }

    // Light Falloff Visualization 1/r^2
    // gl_FragColor = vec4( vec3(gl_FragColor)/(r*r), 1);

    // N dot L
    vec3 L = normalize(lightVector);
    vec3 N = normalize(v_Normal);
    float nDotL = max(dot(N,L), 0.0); //max so that never goes into negs
    
    // Reflection
    vec3 R = reflect(-L, N);

    // eye //wont work til we have a camera
    vec3 E = normalize(u_cameraPos - vec3(v_VertPos) );

    // Specular
    float specular = pow( max( dot(E,R), 0.0 ),  100.0); //10 is specular exponent

    vec3 diffuse = vec3(gl_FragColor) * nDotL *0.7;
    vec3 ambient = vec3(gl_FragColor) * 0.3;

    vec3 specularVec = vec3(gl_FragColor) * specular; 
    // ^ my attempt at what he ignores at 8:50 in vid 4.6
    
    
    // Diff Lighting Combos
    if (u_lightOn) {
      if (u_whichTexture == -22){ //non specular plain color option
        gl_FragColor = vec4(diffuse+ambient, 1.0);
      } else if (u_whichTexture == 11){ //metalic specular
        gl_FragColor = vec4(specularVec+diffuse+ambient, 1.0);
      }
        else{
        gl_FragColor = vec4(specular+diffuse+ambient, 1.0);
      }
    }
    
  }`;

// Global Variables
let canvas;
let gl;

let a_Position;
let a_UV;
let a_Normal;

let u_FragColor;
let u_Size;

let u_ModelMatrix;
let u_ProjectionMatrix;
let u_ViewMatrix;

let u_GlobalRotateMatrix;

let u_Sampler0;
let u_Sampler1;
let u_whichTexture;
let u_lightPos = [0,0,-1];
let u_cameraPos;
let u_lightOn;

function myrender(shape){
   //certainshape.myrender() called on all shapes (cubes and spheres)
  return shape.renderlit(); //change only this line to change all
}

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

  // Get the storage location of a_UV
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

  // Get the storage location of a_Normal
  a_Normal = gl.getAttribLocation(gl.program, 'a_Normal');
  if (a_Normal < 0) {
    console.log('Failed to get the storage location of a_Normal');
    return;
  }

  u_lightPos = gl.getUniformLocation(gl.program, 'u_lightPos');
  if (!u_lightPos) {
    console.log('Failed to get the storage location of u_lightPost');
    return;
  }

  u_cameraPos = gl.getUniformLocation(gl.program, 'u_cameraPos');
  if (!u_cameraPos) {
    console.log('Failed to get the storage location of u_cameraPos');
    return;
  }

  u_lightOn = gl.getUniformLocation(gl.program, 'u_lightOn');
  if (!u_lightOn) {
    console.log('Failed to get the storage location of u_lightOn');
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
var g_won_already = false;

// animation options
var g_firstAnimation = false;
var g_showFPS = false;
var g_normalsView = false;
var g_lightMoving = false;
var g_lightOn = true;

// light position globals
var g_lightPos=[0.5,0.3,2];

function addActionsForHtmlUI(){
  // controls buttons 
  document.getElementById('fpsButton').onclick = function() {g_showFPS = !g_showFPS;};
  document.getElementById('normalOnOff').onclick = function() {g_normalsView = !g_normalsView;};
  document.getElementById('lightMoving').onclick = function() {g_lightMoving = !g_lightMoving;};
  document.getElementById('lightOn').onclick = function() {g_lightOn = !g_lightOn;};

  // animation buttons
  document.getElementById('firstAnimationOn').onclick = function() {g_firstAnimation = true;};
  document.getElementById('firstAnimationOff').onclick = function() {g_firstAnimation = false;};
  // light movement controls
  document.getElementById('lightSlideX').addEventListener('mousemove', function(ev){if(ev.buttons == 1) { g_lightPos[0] = this.value/100;} });
  document.getElementById('lightSlideY').addEventListener('mousemove', function(ev){if(ev.buttons == 1) { g_lightPos[1] = this.value/100;} });
  document.getElementById('lightSlideZ').addEventListener('mousemove', function(ev){if(ev.buttons == 1) { g_lightPos[2] = -this.value/100;} });

  // camera
  //document.getElementById('angleSlide').addEventListener('mouseup',   function() {g_globalAngle = this.value; renderAllShapes(); });
  //document.getElementById('angleSlide').addEventListener('mousemove',   function() {g_globalAngle = this.value; renderScene(); });
  document.getElementById('angleSlide').addEventListener('mousemove',   function() {
    //g_globalAngle = this.value; 
    if (this.value > 180){
      g_camera.panRight(1); 
      this.value = 180;
    }
    if (this.value < 180){
      g_camera.panRight(-1); 
      this.value = 180;
    }
  });
  
  // angle slider events
  // document.getElementById('HeadSlide').addEventListener('mousemove',   function() {g_headAngle = -1*this.value;});
  // // left
  // document.getElementById('LeftArmSlide').addEventListener('mousemove',   function() {g_leftArmAngle = this.value;});
  // document.getElementById('LeftHandSlide').addEventListener('mousemove',   function() {g_leftHandAngle = 1*this.value;});
  // // right
  // document.getElementById('RightArmSlide').addEventListener('mousemove',   function() {g_rightArmAngle = this.value;});
  // document.getElementById('RightHandSlide').addEventListener('mousemove',   function() {g_rightHandAngle = 1*this.value;});
  // // dual
  // document.getElementById('ArmsSlide').addEventListener('mousemove',   function() {g_rightArmAngle = 1*this.value; g_leftArmAngle = this.value; });
  // document.getElementById('HandsSlide').addEventListener('mousemove',   function() {g_rightHandAngle = 1*this.value; g_leftHandAngle = 1*this.value;});

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
  image0.src = 'chess2.jpg';
  image1.src = 'target.png'; // main blocks
  //image2.src = 'storm2.jpg';
  //snow02_bright.jpg
  //sea.jpg
  //chess.jpg
  //target.png
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
  function panWithMouse(ev){
      //when positive -> panRight(movementx);
      console.log(`x movement ${ev.movementX}`);
      //when negative -> panLeft(-movementx);
      let delta = (ev.movementX)/1.5;
      if (delta < 0){
        g_camera.panLeft(-delta);
      } else{
        g_camera.panRight(delta);
      }
  };
  
  document.getElementById('webgl').addEventListener('mousemove',
    function (ev) {
      panWithMouse(ev);
  } );

  // Start ASGN 2 stuff
    // Register function (event handler) to be called on a mouse press
    canvas.onmousedown = click;
    canvas.onmousemove = function(ev) { 
      if(ev.buttons == 1) { click(ev) } 
    
    };

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
  gl.clearColor(0.8, 0.9, 1, 1.0);

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

function updateAnimationAngles(){
  if (g_lightMoving){
    g_lightPos[0] = 4*Math.cos(g_seconds);
  }
  updateRobotAnimationAngles();
}

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

function setUpView(){
  // pass the projection matrix
  var projMat = new Matrix4();
  projMat.setPerspective(g_camera.fov, canvas.width / canvas.height, 0.1, 150);
  gl.uniformMatrix4fv(u_ProjectionMatrix, false, projMat.elements);

  // pass the view matrix
  //console.log('in renderlit() scene')
  //console.log(g_camera.eye.elements);
  var viewMat = new Matrix4();
  viewMat.setLookAt(
    g_camera.eye.elements[0], g_camera.eye.elements[1], g_camera.eye.elements[2],
    g_camera.at.elements[0],  g_camera.at.elements[1],  g_camera.at.elements[2], 
    g_camera.up.elements[0],  g_camera.up.elements[1],  g_camera.up.elements[2]); //eye, at, up
  gl.uniformMatrix4fv(u_ViewMatrix, false, viewMat.elements);

  //console.log(g_camera.eye.elements[0], g_camera.eye.elements[2], "eye");
  //console.log(g_camera.at.elements[0], g_camera.at.elements[2]);
  // pass the matric to u_ModelMatrix attriubte
  var globalRotMat=new Matrix4().rotate(g_globalAngle, 0, 1, 0);
  gl.uniformMatrix4fv(u_GlobalRotateMatrix, false, globalRotMat.elements);
}

function drawLights(){
  // pass the light position to GLSL
  gl.uniform3f(u_lightPos, g_lightPos[0], g_lightPos[1], g_lightPos[2]);
  // pass camera position to GLSL
  gl.uniform3f(u_cameraPos, g_camera.eye.elements[0], g_camera.eye.elements[1], g_camera.eye.elements[2]);
  // pass light on/off to GLSL
  gl.uniform1i(u_lightOn, g_lightOn);
  //console.log(`z: ${g_lightPos[2]}`);
  // draw the light
  var light = new Cube();
  light.textureNum = -2;
  light.color = [2,2,0,1];
  light.matrix.translate(g_lightPos[0],g_lightPos[1],g_lightPos[2]);
  //light.matrix.rotate(90,1,0,0);
  light.matrix.scale(-1, -1, -1);
  light.matrix.scale(0.1, 0.1, 0.1);
  //light.renderlit();
  myrender(light);
}

//var g_camera = new Camera(canvas); <- moved to in main so it knows about canvas
function renderScene(){
  
  updateAnimationAngles();
  var startTime = performance.now();
  var duration;
  setUpView();
  // Clear <canvas>
  gl.clear(gl.COLOR_BUFFER_BIT);

  drawRoom();
  drawLights();
  drawTestCubes();
  //drawMap();
  drawRobot(); // warning this currently fucks the camera rotation

  duration = performance.now() - startTime;
  if (g_showFPS){
    sendTextToHTML(' ms: ' + Math.floor(duration) + ' fps: ' + Math.floor(10000/duration)/10,
    'numdot');
  }
  //console.log('still in render scene');
}

function sendTextToHTML(text, htmlID){
  var htmlElm = document.getElementById(htmlID);
  if (!htmlElm) {
    console.log('Could not get to element with id ' + htmlID + " from HTML");
  }
  htmlElm.innerHTML = text;
}

// GRAVEYARD

// // source: developer.mozilla.org/en-US/docs/Web/API/Pointer_Lock_API 
// // recomended by Daksh
// function requestPointerLockWithUnadjustedMovement() {
//   const promise = canvas.requestPointerLock({
//     unadjustedMovement: true
//   });

//   if (!promise) {
//     console.log("disabling mouse acceleration is not supported");
//     return;
//   }

//   return promise
//     .then(() => console.log("pointer is locked"))
//     .catch((error) => {
//       if (error.name === "NotSupportedError") {
//         // Some platforms may not support unadjusted movement.
//         // You can request again a regular pointer lock.
//         return canvas.requestPointerLock();
//       }
//     });
// }


// //failed alt version of keyboard movement
// function updateMovement(){ 
//   g_camera.moveForward(g_wspeed);
//   g_camera.moveLeft(g_aspeed);
//   g_camera.moveBackwards(g_sspeed);
//   g_camera.moveRight(g_dspeed);
//   g_camera.panLeft(g_qspeed);
//   g_camera.panRight(g_espeed);
// }

// function magicCubeGame(){
// // MAGIC CUBE GAME
//   if (g_camera.eye.elements[0]>3 && g_camera.eye.elements[0]<4 && g_camera.eye.elements[2]>22 && g_camera.eye.elements[2]<23){
//     if (!g_won_already){
//       alert("You found the magic cube!");
//       g_won_already = true;
//     }
//   } 
//   if (g_won_already == false){
//     var tester = new Cube();
//     tester.u_whichTexture=-1;
//     tester.matrix.translate(17,-.6,15);
//     tester.renderlit();
//   }
// }
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