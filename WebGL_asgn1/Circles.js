class Circle{
    constructor(){
        this.type=`circle`;
        this.position = [0.0, 0.0, 0.0];
        this.color = [1.0, 1.0, 1.0, 1.0];
        this.size = 5.0;
        this.segments = 10;
    }
    render(){
        var xy = this.position;
        var rgba = this.color;
        var point_size = this.size;
        // Pass the position of a point to a_Position variable
        // not using
        // gl.vertexAttrib3f(a_Position, xy[0], xy[1], 0.0);
        // Pass the color of a point to u_FragColor variable
        gl.uniform4f(u_FragColor, rgba[0], rgba[1], rgba[2], rgba[3]);
        // pass in size of shape
        gl.uniform1f(u_Size, point_size); 
        // Draw
        var d = this.size/200.0;//delta

        // loop of triangles
        let angleStep = 360/this.segments;
        for (var angle = 0; angle < 360; angle = angle+angleStep){
            let centerPt = [xy[0], xy[1]];
            let angle1 = angle;
            let angle2 = angle+angleStep;
            let vec1 = [Math.cos(angle1*Math.PI/180)*d, 
                        Math.sin(angle1*Math.PI/180)*d,
            ];
            let vec2 = [Math.cos(angle2*Math.PI/180)*d, 
                        Math.sin(angle2*Math.PI/180)*d,
            ];
            let pt1 = [centerPt[0]+vec1[0], centerPt[1]+vec1[1]];
            let pt2 = [centerPt[0]+vec2[0], centerPt[1]+vec2[1]];
            drawTriangle( [xy[0], xy[1],  pt1[0],pt1[1],  pt2[0],pt2[1]] )
        }
    }
    renderCustom(myColor, myCenterPt, mySize){
        var xy = myCenterPt;
        this.color = myColor;
        var rgba = this.color;
        this.size = mySize;
        var point_size = this.size;
        this.segments = 10;
        console.log(this);
        // Pass the position of a point to a_Position variable
        // not using
        // gl.vertexAttrib3f(a_Position, xy[0], xy[1], 0.0);
        // Pass the color of a point to u_FragColor variable
        gl.uniform4f(u_FragColor, rgba[0], rgba[1], rgba[2], rgba[3]);
        // pass in size of shape
        gl.uniform1f(u_Size, point_size);
        // Draw
        var d = this.size/200.0;//delta

        // loop of triangles
        let angleStep = 360/this.segments;
        for (var angle = 0; angle < 360; angle = angle+angleStep){
            let centerPt = myCenterPt;
            let angle1 = angle;
            let angle2 = angle+angleStep;
            let vec1 = [Math.cos(angle1*Math.PI/180)*d,
                        Math.sin(angle1*Math.PI/180)*d,
            ];
            let vec2 = [Math.cos(angle2*Math.PI/180)*d,
                        Math.sin(angle2*Math.PI/180)*d,
            ];
            let pt1 = [centerPt[0]+vec1[0], centerPt[1]+vec1[1]];
            let pt2 = [centerPt[0]+vec2[0], centerPt[1]+vec2[1]];
            drawTriangle( [xy[0], xy[1],  pt1[0],pt1[1],  pt2[0],pt2[1]] )
        }
    }
}

function drawTriangle(vertices) { // lives on the CPU
    var n = 3; // The number of vertices
  
    // Create a buffer object on GPU
    var vertexBuffer = gl.createBuffer();
    if (!vertexBuffer) {
      console.log('Failed to create the buffer object');
      return -1;
    }
  
    // Bind the buffer object to target
    gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
    // Write date into the buffer object aka send to GPU
    //gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.DYNAMIC_DRAW);
  
    // connecting to variable living on GPU
    // dont need because colored points does this
    // in connectVariablestoGLSL
    // var a_Position = gl.getAttribLocation(gl.program, 'a_Position');
    // if (a_Position < 0) {
    //   console.log('Failed to get the storage location of a_Position');
    //   return -1;
    // }
    // Assign the buffer object to a_Position variable
    // atrib pointer makes it so you can pass multiple things
    gl.vertexAttribPointer(a_Position, 2, gl.FLOAT, false, 0, 0);
  
    // Enable the assignment to a_Position variable
    gl.enableVertexAttribArray(a_Position);
  
    gl.drawArrays(gl.TRIANGLES, 0, n); //was in main bef
}