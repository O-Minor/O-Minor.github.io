class Triangle{
    constructor(){
        this.type=`triangle`;
        this.position = [0.0, 0.0, 0.0];
        this.color = [1.0, 1.0, 1.0, 1.0];
        this.size = 5.0;
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
        var d = this.size/200.0;
        drawTriangle( [xy[0], xy[1],  xy[0]+d,xy[1],  xy[0],xy[1]+d] )
    }
    renderCustom(my_color, vertices){
        // var xy = this.position;
        this.color = my_color;
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
        drawTriangle( vertices );
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