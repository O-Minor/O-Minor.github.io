function main() {  
  // Retrieve <canvas> element
  var canvas = document.getElementById('example');  
  if (!canvas) { 
    console.log('Failed to retrieve the <canvas> element');
    return false; 
  } 

  // Get the rendering context for 2DCG
  var ctx = canvas.getContext('2d');
  // BEGIN MY CODE
  // Draw a bg black rectangle
  ctx.fillStyle = 'rgba(0, 0, 0, 1.0)'; // Set color to blue
  ctx.fillRect(0, 0, canvas.clientWidth, canvas.clientWidth);

  // testing html variable retrieval
  // let x1 = document.getElementById("x1_coord").value;
  // console.log(`x1: ${x1}`);
  // testing vector3 object init
  // v1 = new Vector3([2.25,2.25,0]);
  // console.log(`v1: ${v1}`);
  // console.log(`v1 elements: ${v1.elements}`);
  // console.log(`v1 0th element: ${v1.elements[0]}`);
  // console.log(`type of v1: ${typeof v1}`);

  // will draw a given vector in a given color
  function drawVector(v, color){
    ctx.beginPath();
    ctx.moveTo(canvas.clientWidth/2, canvas.clientWidth/2);
    // unsure why y should be *-1 im guessing its because y goes down
    // in html canvas?
    let m = [(v.elements[0]*20)+canvas.clientWidth/2, (-v.elements[1]*20)+canvas.clientWidth/2]
    ctx.lineTo(m[0], m[1]);
    ctx.strokeStyle = color;
    ctx.stroke();
  }

  // will draw v1 and v2 on draw button press
  function handleDrawEvent(){
    //manually clearing canvas in black
    ctx.fillStyle = 'rgba(0, 0, 0, 1.0)'; // Set color to blue
    ctx.fillRect(0, 0, canvas.clientWidth, canvas.clientWidth);

    let x1 = document.getElementById("x1_coord").value;
    let y1 = document.getElementById("y1_coord").value;
    let v1 = new Vector3([x1,y1,0]);

    let x2 = document.getElementById("x2_coord").value;
    let y2 = document.getElementById("y2_coord").value;
    let v2 = new Vector3([x2,y2,0]);

    drawVector(v1, "red");
    drawVector(v2, "blue");
  }

  // will redraw v1 and v2 and also draw v3 and optionally v4
  // as applicable
  function handleOperationDrawEvent(){
    // clear the canvas
    ctx.fillStyle = 'rgba(0, 0, 0, 1.0)'; // Set color to blue
    ctx.fillRect(0, 0, canvas.clientWidth, canvas.clientWidth);

    // know the current vectors
    let x1 = document.getElementById("x1_coord").value;
    let y1 = document.getElementById("y1_coord").value;
    let v1 = new Vector3([x1,y1,0]);

    let x2 = document.getElementById("x2_coord").value;
    let y2 = document.getElementById("y2_coord").value;
    let v2 = new Vector3([x2,y2,0]);

    // draw the known vectors
    drawVector(v1, "red");
    drawVector(v2, "blue");

    // know the chosen operation
    let operation = document.getElementById("operations").value;
    
    // set up that there will be one or two new vectors
    let v3;
    let v4;
    if (operation == "Add"){
      v3 = v1;
      v3.add(v2);
      drawVector(v3, "green");
    }
    else if (operation == "Subtract"){
      v3 = v1;
      v3.sub(v2);
      drawVector(v3, "green");
    }
    else if (operation == "Divide"){
      let scalar = document.getElementById("scalar").value;
      v3 = v1;
      v3.div(scalar);
      v4 = v2;
      v4.div(scalar);
      drawVector(v3, "green");
      drawVector(v4, "green");
    } 
    else if (operation == "Multiply"){
      let scalar = document.getElementById("scalar").value;
      v3 = v1;
      v3.mul(scalar);
      v4 = v2;
      v4.mul(scalar);
      drawVector(v3, "green");
      drawVector(v4, "green");
    }
    else if (operation == "Magnitude"){
      console.log(`Magnitude v1: ${v1.magnitude()}`)
      console.log(`Magnitude v2: ${v2.magnitude()}`)
    }
    else if (operation == "Normalize"){
      v3 = v1;
      v3.normalize();
      v4 = v2;
      v4.normalize();
      drawVector(v3, "green");
      drawVector(v4, "green");
    }
    else if (operation == "Angle Between"){
      let mag_v1 = v1.magnitude();
      let mag_v2 = v2.magnitude();
      let dot_v1v2 = Vector3.dot(v1,v2);
      let denominator = mag_v1*mag_v2;
      let alpha = Math.acos( (dot_v1v2 / denominator));
      var pi = Math.PI;
      alpha = alpha*(180/pi);
      console.log(`Angle: ${alpha}`);
    }
    else if (operation == "Area"){
      function areaTriangle(v1, v2){
        let cross_v1v2 = Vector3.cross(v1,v2);
        // console.log(cross_v1v2.elements);
        let mag_cross = cross_v1v2.magnitude();
        return mag_cross/2;
      }
      console.log(`Area of the triangle: ${areaTriangle(v1, v2)}`);
    }
    else {
      console.error(`Unknown operation menu option: ${operation}`);
    }
  }

  document.getElementById("draw_button").onclick = handleDrawEvent;
  document.getElementById("operation_draw").onclick = handleOperationDrawEvent;
  // END MY CODE 
}
