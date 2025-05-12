class Triangle{
    constructor(){
        this.type=`triangle`;
        this.position = [0.0, 0.0, 0.0];
        this.color = [1.0, 1.0, 1.0, 1.0];
        this.size = 5.0;

        this.buffer = null; // !
        this.vertices = null; // !
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
}

function drawTriangle(vertices) { // lives on the CPU
    var n = vertices.length/3; // The number of vertices
  
    // Create a buffer object on GPU
    var vertexBuffer = gl.createBuffer();
    if (!vertexBuffer) {
      console.log('Failed to create the buffer object');
      return -1;
    }

    // Bind the buffer object to target
    gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
    // Write date into the buffer object aka send to GPU
    gl.bufferData(
        gl.ARRAY_BUFFER, 
        new Float32Array(vertices), 
        gl.DYNAMIC_DRAW
    );
    // atrib pointer makes it so you can pass multiple things
    gl.vertexAttribPointer(a_Position, 2, gl.FLOAT, false, 0, 0);
    // Enable the assignment to a_Position variable
    gl.enableVertexAttribArray(a_Position);
  
    gl.drawArrays(gl.TRIANGLES, 0, n); //was in main bef
}

function drawTriangle3D(vertices) { 
    var n = vertices.length/3; // The number of vertices
    console.error(n);
    // Create a buffer object on GPU
    // ! means performance optimized
    if (!this.buffer){
        this.buffer = gl.createBuffer();
        if (!this.buffer) {
            console.log('Failed to create the buffer object');
            return -1;
        }
    }
    // $ means og that worked
    // var vertexBuffer = gl.createBuffer();
    // if (!vertexBuffer) {
    //   console.log('Failed to create the buffer object');
    //   return -1;
    // }

    // Bind the buffer object to target
    // gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer); // $ OLD
    gl.bindBuffer(gl.ARRAY_BUFFER, this.buffer); // ! NEW
    
    // Write date into the buffer object aka send to GPU
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.DYNAMIC_DRAW);
    // atrib pointer makes it so you can pass multiple things (now 3 for x y z)
    gl.vertexAttribPointer(a_Position, 3, gl.FLOAT, false, 0, 0);
    // Enable the assignment to a_Position variable
    gl.enableVertexAttribArray(a_Position);
  
    gl.drawArrays(gl.TRIANGLES, 0, n); //was in main bef
}

function drawTriangle3DUV(vertices, uv) { 
    var n = vertices.length/3; // The number of vertices

    // Create a buffer object on GPU
    // ! means performance optimized
    if (!this.buffer){
        this.buffer = gl.createBuffer();
        if (!this.buffer) {
            console.log('Failed to create the buffer object');
            return -1;
        }
    }

    // $ means og that worked
    // var vertexBuffer = gl.createBuffer();
    // if (!vertexBuffer) {
    //   console.log('Failed to create the buffer object');
    //   return -1;
    // }

    // Bind the buffer object to target               OLD-> 
    //gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer); // $
    gl.bindBuffer(gl.ARRAY_BUFFER, this.buffer); 
    
    // Write date into the buffer object
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.DYNAMIC_DRAW);
    // console.log(this.buffer);
    // console.log(vertices);
    var FSIZE = 4;
    // Assign the buffer object to a_Position variable
    gl.vertexAttribPointer(a_Position, 3, gl.FLOAT, false, 0, 0); //for normal render()
    //gl.vertexAttribPointer(a_Position, 3, gl.FLOAT, false, 5, 0);
    //gl.vertexAttribPointer(a_Position, 3, gl.FLOAT, false, FSIZE*5, 0);
    
    // Enable the assignment to a_Position variable
    gl.enableVertexAttribArray(a_Position);
  
    // --------------------------------------------
    // create buffer object for UV
    var uvBuffer = gl.createBuffer();
    if(!uvBuffer){
        console.log('falsied to make uv buffer');
        return -1
    }

    gl.bindBuffer(gl.ARRAY_BUFFER, uvBuffer); // !
    
    // Write date into the buffer object aka send to GPU
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(uv), gl.DYNAMIC_DRAW);
    // atrib pointer makes it so you can pass multiple things (now 3 for x y z)
    gl.vertexAttribPointer(a_UV, 2, gl.FLOAT, false, 0, 0); //for normal render()
    //gl.vertexAttribPointer(a_UV, 2, gl.FLOAT, false, 5, 2);
    //gl.vertexAttribPointer(a_UV, 2, gl.FLOAT, false, FSIZE*5, FSIZE*2);
    // Enable the assignment to a_Position variable
    gl.enableVertexAttribArray(a_UV);
  
    // draw the triangle
    gl.drawArrays(gl.TRIANGLES, 0, n); //was in main bef
}

function drawTriangle3DUV_fast(point_data) { 
    var n = point_data.length/5; // The number of vertices

    // Create a buffer object on GPU
    // ! means performance optimized
    if (!this.buffer){
        this.buffer = gl.createBuffer();
        if (!this.buffer) {
            console.log('Failed to create the buffer object');
            return -1;
        }
    }

    // $ means og that worked
    // var vertexBuffer = gl.createBuffer();
    // if (!vertexBuffer) {
    //   console.log('Failed to create the buffer object');
    //   return -1;
    // }

    // Bind the buffer object to target               OLD-> 
    //gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer); // $
    gl.bindBuffer(gl.ARRAY_BUFFER, this.buffer); 
    
    // Write date into the buffer object
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(point_data), gl.DYNAMIC_DRAW);
    // console.log(this.buffer);
    // console.log(point_data);
    // START MAIN differences
    var FSIZE = 4;
    // Assign the buffer object to a_Position variable
    //gl.vertexAttribPointer(a_Position, 3, gl.FLOAT, false, 0, 0); //for normal render()
    //gl.vertexAttribPointer(a_Position, 3, gl.FLOAT, false, 5, 0);
    gl.vertexAttribPointer(a_Position, 3, gl.FLOAT, false, FSIZE*5, 0); //for fast
    
    // Enable the assignment to a_Position variable
    gl.enableVertexAttribArray(a_Position);
  
    // --------------------------------------------
    // create buffer object for UV
    var uvBuffer = gl.createBuffer();
    if(!uvBuffer){
        console.log('failed to make uv buffer');
        return -1
    }

    gl.bindBuffer(gl.ARRAY_BUFFER, uvBuffer); // !

    // Write date into the buffer object aka send to GPU
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(point_data), gl.DYNAMIC_DRAW);
    // atrib pointer makes it so you can pass multiple things (now 3 for x y z)
    //gl.vertexAttribPointer(a_UV, 2, gl.FLOAT, false, 0, 0); //for normal render()
    //gl.vertexAttribPointer(a_UV, 2, gl.FLOAT, false, 5, 2);
    gl.vertexAttribPointer(a_UV, 2, gl.FLOAT, false, FSIZE*5, FSIZE*3); //for fast (might be 2 or 3)
    // Enable the assignment to a_Position variable
    gl.enableVertexAttribArray(a_UV);
  
    // draw the triangle
    gl.drawArrays(gl.TRIANGLES, 0, n); //was in main bef
}