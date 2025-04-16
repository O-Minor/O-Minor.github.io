class Point{
  constructor(){
    this.type = `point`;
    this.position = [0.0, 0.0, 0.0];
    this.color = [0.5, 0.5, 0.5, 1.0];
    this.size = 30.0;
  }
  render(){
    var xy         = this.position;
    var rgba       = this.color;
    var point_size = this.size;

    // quit using the buffer to send the attribute
    gl.disableVertexAttribArray(a_Position);
    // Pass the position of a point to a_Position variable
    gl.vertexAttrib3f(a_Position, xy[0], xy[1], 0.0);
    // Pass the color of a point to u_FragColor variable
    gl.uniform4f(u_FragColor, rgba[0], rgba[1], rgba[2], rgba[3]);
    // pass in size of shape
    gl.uniform1f(u_Size, point_size); 
    // ^pass size into pointer called u_Size which is set up for GLSL
    // Draw
    gl.drawArrays(gl.POINTS, 0, 1);
  }
}