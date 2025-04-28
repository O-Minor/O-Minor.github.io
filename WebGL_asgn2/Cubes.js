class Cube{
    constructor(copyMatrix){
        this.type=`cube`;
        //this.position = [0.0, 0.0, 0.0];
        this.color = [1.0, 1.0, 1.0, 1.0];
        //this.size = 5.0;
        //this.segments = 10;
        if (copyMatrix){
            this.matrix = new Matrix4(copyMatrix);
        }
        else{
        this.matrix = new Matrix4();
        }
    }
    render(){
        //var xy = this.position;
        var rgba = this.color;
        //var point_size = this.size;

        // Pass the color of a point to u_FragColor variable
        gl.uniform4f(u_FragColor, rgba[0], rgba[1], rgba[2], rgba[3]);

        // Pass the matrix to u_ModelMatrix attribute
        gl.uniformMatrix4fv(u_ModelMatrix, false, this.matrix.elements);

        // fake lighting
        // pass the color of a point to frag color uniform var
        let shadow;
            // your die in desmos has 1 on the table 6 facing up
            // dot away from you, 5 facing you upside down 
            // 3 the other visible face (glitter dice)
        // Front of cube 1
        shadow = 1.0;
        gl.uniform4f(u_FragColor, rgba[0]*shadow, rgba[1]*shadow, rgba[2]*shadow, rgba[3]);

        drawTriangle3D([
            0.0, 0.0, 0.0,
            1.0, 1.0, 0.0,
            1.0, 0.0, 0.0]);
        drawTriangle3D([
            0.0, 0.0, 0.0,
            0.0, 1.0, 0.0,
            1.0, 1.0, 0.0]);
        // other sides of cube
        gl.uniform4f(u_FragColor, rgba[0]*0.5, rgba[1]*0.5, rgba[2]*0.5, rgba[3]);
        shadow = 0.1;
        gl.uniform4f(u_FragColor, rgba[0]*shadow, rgba[1]*shadow, rgba[2]*shadow, rgba[3]);
        // // opposite face 6
        drawTriangle3D([
            0.0, 0.0, 1.0,
            1.0, 1.0, 1.0,
            1.0, 0.0, 1.0]);
        drawTriangle3D([
            0.0, 0.0, 1.0,
            0.0, 1.0, 1.0,
            1.0, 1.0, 1.0]);

        // // face 5
        shadow = 0.2;
        gl.uniform4f(u_FragColor, rgba[0]*shadow, rgba[1]*shadow, rgba[2]*shadow, rgba[3]);
        
        drawTriangle3D([
            0.0, 0.0, 0.0,
            1.0, 0.0, 1.0,
            1.0, 0.0, 0.0]);
        drawTriangle3D([
            0.0, 0.0, 0.0,
            0.0, 0.0, 1.0,
            1.0, 0.0, 1.0]);

        // // face 4 left side
        shadow = 0.4;
        gl.uniform4f(u_FragColor, rgba[0]*shadow, rgba[1]*shadow, rgba[2]*shadow, rgba[3]);
        
        drawTriangle3D([
            0.0, 0.0, 0.0,
            0.0, 1.0, 1.0,
            0.0, 1.0, 0.0]);
        drawTriangle3D([
            0.0, 0.0, 0.0,
            0.0, 0.0, 1.0,
            0.0, 1.0, 1.0]);
        
        // face 2 (opposite 5)
        shadow = 0.6;
        gl.uniform4f(u_FragColor, rgba[0]*shadow, rgba[1]*shadow, rgba[2]*shadow, rgba[3]);
        
        drawTriangle3D([
            0.0, 1.0, 0.0,
            1.0, 1.0, 1.0,
            1.0, 1.0, 0.0]);
        drawTriangle3D([
            0.0, 1.0, 0.0,
            0.0, 1.0, 1.0,
            1.0, 1.0, 1.0]);
        // // face 3 (opposite 4)
        shadow = 0.8;
        gl.uniform4f(u_FragColor, rgba[0]*shadow, rgba[1]*shadow, rgba[2]*shadow, rgba[3]);
        
        drawTriangle3D([
            1.0, 0.0, 0.0,
            1.0, 1.0, 1.0,
            1.0, 1.0, 0.0]);
        drawTriangle3D([
            1.0, 0.0, 0.0,
            1.0, 0.0, 1.0,
            1.0, 1.0, 1.0]);
    }
}


