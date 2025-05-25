// just the asng 4 drawing functions

function drawRoom(){
  var ground = new Cube();
  ground.color = [1.0, 0.0, 0.0, 1.0];
  ground.textureNum = 1;
  ground.matrix.translate(0,-2.49,0);
  ground.matrix.scale(10, 0, 10);
  ground.matrix.translate(-0.5,0,-0.5);
  if(g_normalsView){ 
    ground.textureNum = -3;
  }
  myrender(ground);

  var skybox = new Cube();
  skybox.color = [0.8,0.8,0.8,1];
  skybox.textureNum = -2;
  if(g_normalsView) skybox.textureNum = -3;
  skybox.matrix.scale(5,5,10);
  skybox.matrix.scale(-1,-1,-1);
  skybox.matrix.translate(-0.5, -0.5, -0.5);
  myrender(skybox);
}

function drawTestCubes(){
  var ball1 = new Sphere();
  ball1.textureNum = 0;
  if (g_normalsView) ball1.textureNum = -3;
  ball1.matrix.translate(-0.9,-1.6,-4);
  myrender(ball1);

  var tester = new Cube();
  tester.textureNum= -22;
  if(g_normalsView){ 
    tester.textureNum = -3;
  }
  tester.color=[0.9,0,0,1];
  tester.matrix.translate(1.2, -2, -1.2);
  tester.matrix.scale(0.5,0.5,0.5);
  // var testerAngle = 360*Math.sin(g_seconds+8/2);
  // testerAngle = 0;
  // tester.matrix.rotate(testerAngle,1,0,0);
  myrender(tester);
  
  var tester2 = new Cube();
  tester2.textureNum = -1;
  tester2.color=[0.9,0,0,1];
  if(g_normalsView) tester2.textureNum = -3;
  tester2.matrix.translate(-1.5, -2, -1.7);
  tester2.matrix.scale(0.5,0.5,0.5);
  var testerAngle2 = 360*Math.sin(g_seconds/2);
  testerAngle2 = 0;
  //tester2.matrix.rotate(testerAngle2,1,0,0);
  myrender(tester2);

  var tester3 = new Cube();
  tester3.textureNum= 0;
  if(g_normalsView){ 
    tester3.textureNum = -3;
  }
  tester3.color=[0.9,0,0,1];
  tester3.matrix.translate(-0.5, -1.9, 2.5);
  // var testerAngle = 360*Math.sin(g_seconds+8/2);
  // testerAngle = 0;
  // tester.matrix.rotate(testerAngle,1,0,0);
  myrender(tester3);
}