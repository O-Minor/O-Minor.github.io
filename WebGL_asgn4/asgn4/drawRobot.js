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

// animal angles
var g_headAngle = 0;
var g_leftArmAngle = 0;
var g_leftHandAngle = 0;
var g_rightArmAngle = 0;
var g_rightHandAngle = 0;

var robot_textureNum = -2;
if(g_normalsView){ 
    robot_textureNum = -3;
  }

function updateRobotAnimationAngles(){
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

function drawRobot(){
    // Draw a cube
    var body = new Cube();
    body.color = [0.5, 0.5, 0.6, 1];
    body.textureNum = robot_textureNum;
    body.matrix.setTranslate(-0.3, 0, 0);
    body.matrix.translate(0.8,-1.6,-3);
    body.matrix.rotate(-5,1,0,0);
    var bodCoordsMat = new Matrix4(body.matrix);
    body.matrix.scale(0.9, 0.6, 0.6); // happens first non uniform scale to make rect
    myrender(body);
    //body.render();

    var lump = new Cube(bodCoordsMat);
    lump.color = [0.5, 0.5, 0.6, 1];
    lump.textureNum = robot_textureNum;
    lump.matrix.translate(0.1,0.5,0.001);
    lump.matrix.scale(0.7,0.2,0.6);
    myrender(lump);

    var neck = new Cube(bodCoordsMat);
    neck.color = [0.6, 0.6, 0.7, 1];
    neck.textureNum = robot_textureNum;
    neck.matrix.translate(0.1,0.3,0.301,0.001);
    neck.matrix.rotate(r_neckAngle,0,1,0);
    neck.matrix.rotate(-180,0,0,1);
    var neckCoordsMat = new Matrix4 (neck.matrix);
    neck.matrix.scale(0.55,0.2,0.2);
    myrender(neck);

    //g_globalAngle = -77;
    var head = new Cube(neckCoordsMat);
    head.color = [0.6, 0.6, 0.7, 1];
    head.textureNum = robot_textureNum;
    head.matrix.rotate(r_headAngle,0,1,0);
    head.matrix.rotate(-180,0,0,1);
    head.matrix.translate(-0.7,-0.25,-0.151,0.001);
    head.matrix.scale(0.4,0.3,0.4);
    myrender(head);

    // draw left arm
    var leftArm = new Cube(bodCoordsMat);
    leftArm.color = [0.4, 0.4, 0.4, 1];
    leftArm.textureNum = robot_textureNum;
    leftArm.matrix.setTranslate(-0.1, -0.8, -0.0001); // ask what dif febwtween setTrasn and
    leftArm.matrix.rotate(180,0,0,1);
    leftArm.matrix.translate(-0.05,-0.901,0.001);
    leftArm.matrix.translate(-0.8,1.6,-3);
    leftArm.matrix.rotate(r_larmAngle, 0, 0, 1);
    var leftArmCoordsMat = new Matrix4(leftArm.matrix);
    // setting the shape of the box SCALES
    leftArm.matrix.scale(0.2, 0.5, 0.2);
    myrender(leftArm);

    // draw right arm
    var rightArm = new Cube(bodCoordsMat);
    rightArm.color = [0.4, 0.4, 0.4, 1];
    rightArm.textureNum = robot_textureNum;
    rightArm.matrix.setTranslate(0.5, -0.8, 0.0); // ask what dif febwtween setTrasn and
    rightArm.matrix.rotate(180,0,0,1);
    rightArm.matrix.translate(-0.05,-0.901,0.001);
    rightArm.matrix.translate(-0.8,1.6,-3);
    rightArm.matrix.rotate(r_rarmAngle, 0, 0, 1);
    var rightArmCoordsMat = new Matrix4(rightArm.matrix);
    // setting the shape of the box SCALES
    rightArm.matrix.scale(0.2, 0.5, 0.2);
    myrender(rightArm);

    var leftHand = new Cube(leftArmCoordsMat);
    leftHand.color = [0.6, 0.6, 0.7, 1];
    leftHand.textureNum = robot_textureNum;
    leftHand.matrix.translate(0.001, 0.44, -0.0001, 0);
    leftHand.matrix.rotate(r_lhandAngle,0,0,1);
    var leftHandCoordsMat = new Matrix4(leftHand.matrix);
    leftHand.matrix.scale(0.18,0.5,0.2);
    myrender(leftHand);

    var rightHand = new Cube();
    rightHand.color = [0.6, 0.6, 0.7,1];
    rightHand.textureNum = robot_textureNum;
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
    myrender(rightHand);

    var rightStomp = new Cube(rightHandCoordsMat);
    rightStomp.color = [0.7, 0.7, 0.85,1];
    rightStomp.textureNum = robot_textureNum;
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
    myrender(rightStomp);

    var leftStomp = new Cube(leftHandCoordsMat);
    leftStomp.color = [0.7, 0.7, 0.85,1];
    leftStomp.textureNum = robot_textureNum;
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
    myrender(leftStomp);
}