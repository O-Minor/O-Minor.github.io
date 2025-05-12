class Cube{
    constructor(copyMatrix){
        this.type=`cube`;
        //this.position = [0.0, 0.0, 0.0];
        this.color = [1.0, 1.0, 1.0, 1.0];
        //this.size = 5.0;
        //this.segments = 10;
        this.textureNum = -1; 
        //-2 coded color
        //-1 debug color
        // 0 texture 
        // other: red
        
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

        // Pass the texture number
        gl.uniform1i(u_whichTexture, this.textureNum);

        // Pass the color of a point to u_FragColor variable
        gl.uniform4f(u_FragColor, rgba[0], rgba[1], rgba[2], rgba[3]);

        // Pass the matrix to u_ModelMatrix attribute
        gl.uniformMatrix4fv(u_ModelMatrix, false, this.matrix.elements);
        
        // FAKE LIGHTING (not going to work for right now)
        let shadow = 1.0;
        // pass the color of a point to frag color uniform var
        gl.uniform4f(u_FragColor, rgba[0]*shadow, rgba[1]*shadow, rgba[2]*shadow, rgba[3]);

        // Front of cube for experomenting
        drawTriangle3DUV([0,0,0,  1,1,0,  1,0,0], [0,0,  1,1,  1,0]);
        drawTriangle3DUV( [0,0,0, 0,1,0,  1,1,0], [0,0,  0,1,  1,1] );
        var firstUVMat = [0,0,  1,1,  1,0];
        var secondUVMat = [0,0,  0,1,  1,1];

        drawTriangle3DUV([
            0.0, 0.0, 0.0,
            1.0, 1.0, 0.0,
            1.0, 0.0, 0.0], firstUVMat);
        drawTriangle3DUV([
            0.0, 0.0, 0.0,
            0.0, 1.0, 0.0,
            1.0, 1.0, 0.0], secondUVMat);




        // other sides of cube
            // your die in desmos has 1 on the table 6 facing up
            // dot away from you, 5 facing you upside down 
            // 3 the other visible face (glitter dice)
        
        gl.uniform4f(u_FragColor, rgba[0]*0.5, rgba[1]*0.5, rgba[2]*0.5, rgba[3]);
        shadow = 0.5;
        gl.uniform4f(u_FragColor, rgba[0]*shadow, rgba[1]*shadow, rgba[2]*shadow, rgba[3]);
        // // opposite face 6
        drawTriangle3DUV([
            0.0, 0.0, 1.0,
            1.0, 1.0, 1.0,
            1.0, 0.0, 1.0], firstUVMat);
            drawTriangle3DUV([
            0.0, 0.0, 1.0,
            0.0, 1.0, 1.0,
            1.0, 1.0, 1.0], secondUVMat);

        // // face 5
        shadow = 0.6;
        gl.uniform4f(u_FragColor, rgba[0]*shadow, rgba[1]*shadow, rgba[2]*shadow, rgba[3]);
        
        drawTriangle3DUV([
            0.0, 0.0, 0.0,
            1.0, 0.0, 1.0,
            1.0, 0.0, 0.0], firstUVMat);
            drawTriangle3DUV([
            0.0, 0.0, 0.0,
            0.0, 0.0, 1.0,
            1.0, 0.0, 1.0], secondUVMat);

        // // face 4 left side
        shadow = 0.7;
        gl.uniform4f(u_FragColor, rgba[0]*shadow, rgba[1]*shadow, rgba[2]*shadow, rgba[3]);
        
        drawTriangle3DUV([
            0.0, 0.0, 0.0,
            0.0, 1.0, 1.0,
            0.0, 1.0, 0.0], firstUVMat);
            drawTriangle3DUV([
            0.0, 0.0, 0.0,
            0.0, 0.0, 1.0,
            0.0, 1.0, 1.0], secondUVMat);
        
        // face 2 (opposite 5)
        shadow = 0.8;
        gl.uniform4f(u_FragColor, rgba[0]*shadow, rgba[1]*shadow, rgba[2]*shadow, rgba[3]);
        
        drawTriangle3DUV([
            0.0, 1.0, 0.0,
            1.0, 1.0, 1.0,
            1.0, 1.0, 0.0], firstUVMat);
            drawTriangle3DUV([
            0.0, 1.0, 0.0,
            0.0, 1.0, 1.0,
            1.0, 1.0, 1.0], secondUVMat);
        // // face 3 (opposite 4)
        shadow = 0.9;
        gl.uniform4f(u_FragColor, rgba[0]*shadow, rgba[1]*shadow, rgba[2]*shadow, rgba[3]);
        
        drawTriangle3DUV([
            1.0, 0.0, 0.0,
            1.0, 1.0, 1.0,
            1.0, 1.0, 0.0], firstUVMat);
        drawTriangle3DUV([
            1.0, 0.0, 0.0,
            1.0, 0.0, 1.0,
            1.0, 1.0, 1.0], secondUVMat);
        //end of normal render cube function
    }

    renderfast(){
        //console.log("in renderfast()");
        //var xy = this.position;
        var rgba = this.color;
        //var point_size = this.size;

        // Pass the texture number
        gl.uniform1i(u_whichTexture, this.textureNum);

        // Pass the color of a point to u_FragColor variable
        gl.uniform4f(u_FragColor, rgba[0], rgba[1], rgba[2], rgba[3]);

        // Pass the matrix to u_ModelMatrix attribute
        gl.uniformMatrix4fv(u_ModelMatrix, false, this.matrix.elements);
        let shadow = 1.0;
        // fake lighting
        // pass the color of a point to frag color uniform var
        gl.uniform4f(u_FragColor, rgba[0]*shadow, rgba[1]*shadow, rgba[2]*shadow, rgba[3]);

        var allverts = [];
        
        // START different attempt at all verts
        allverts = [
            0.0, 0.0, 0.0, 0,0,
            1.0, 1.0, 0.0, 1,1,
            1.0, 0.0, 0.0, 1,0,

            0.0, 0.0, 0.0, 0,0,
            0.0, 1.0, 0.0, 0,1,
            1.0, 1.0, 0.0, 1,1,
            
            0.0, 0.0, 1.0, 0,0,
            1.0, 1.0, 1.0, 1,1,
            1.0, 0.0, 1.0, 1,0,

            0.0, 0.0, 1.0, 0,0,
            0.0, 1.0, 1.0, 0,1,
            1.0, 1.0, 1.0, 1,1,

            0.0, 0.0, 0.0, 0,0,
            1.0, 0.0, 1.0, 1,1,
            1.0, 0.0, 0.0, 1,0,

            0.0, 0.0, 0.0, 0,0,
            0.0, 0.0, 1.0, 0,1,
            1.0, 0.0, 1.0, 1,1,

            0.0, 0.0, 0.0, 0,0,
            0.0, 1.0, 1.0, 1,1,
            0.0, 1.0, 0.0, 1,0,

            0.0, 0.0, 0.0, 0,0,
            0.0, 0.0, 1.0, 0,1,
            0.0, 1.0, 1.0, 1,1,

            0.0, 1.0, 0.0, 0,0,
            1.0, 1.0, 1.0, 1,1,
            1.0, 1.0, 0.0, 1,0,

            0.0, 1.0, 0.0, 0,0,
            0.0, 1.0, 1.0, 0,1,
            1.0, 1.0, 1.0, 1,1,

            1.0, 0.0, 0.0, 0,0,
            1.0, 1.0, 1.0, 1,1,
            1.0, 1.0, 0.0, 1,0,

            1.0, 0.0, 0.0, 0,0,
            1.0, 0.0, 1.0, 0,1,
            1.0, 1.0, 1.0, 1,1,
        ];
        //console.log(`${allverts.length/5} points`);
        drawTriangle3DUV_fast(allverts);
        //console.log(`end of renderfast()`);
    }
}

// CODE GRAVEYARD

// START FACE TRIANGLES IMPORT TO allverts *no uvs
        // // 1 FRONT
        // allverts = allverts.concat([
        //     0.0, 0.0, 0.0,
        //     1.0, 1.0, 0.0,
        //     1.0, 0.0, 0.0]);
        // allverts = allverts.concat([
        //     0.0, 0.0, 0.0,
        //     0.0, 1.0, 0.0,
        //     1.0, 1.0, 0.0]);
        // // 2 OPPOSITE/6
        // allverts = allverts.concat([
        //     0.0, 0.0, 1.0,
        //     1.0, 1.0, 1.0,
        //     1.0, 0.0, 1.0]);
        // allverts = allverts.concat([
        //     0.0, 0.0, 1.0,
        //     0.0, 1.0, 1.0,
        //     1.0, 1.0, 1.0]);
        // // 3 FACE 5
        // allverts = allverts.concat([
        //     0.0, 0.0, 0.0,
        //     1.0, 0.0, 1.0,
        //     1.0, 0.0, 0.0]);
        // allverts = allverts.concat([
        //     0.0, 0.0, 0.0,
        //     0.0, 0.0, 1.0,
        //     1.0, 0.0, 1.0]);
        // // 4 LEFT SIDE
        // allverts = allverts.concat([
        //     0.0, 0.0, 0.0,
        //     0.0, 1.0, 1.0,
        //     0.0, 1.0, 0.0]);
        // allverts = allverts.concat([
        //     0.0, 0.0, 0.0,
        //     0.0, 0.0, 1.0,
        //     0.0, 1.0, 1.0]);
        // // 5 FACE 2 OPPOSITE 5
        // allverts = allverts.concat([
        //     0.0, 1.0, 0.0,
        //     1.0, 1.0, 1.0,
        //     1.0, 1.0, 0.0]);
        // allverts = allverts.concat([
        //     0.0, 1.0, 0.0,
        //     0.0, 1.0, 1.0,
        //     1.0, 1.0, 1.0]);
        // // 6 FACE 3 OPPOSITE 4
        // allverts = allverts.concat([
        //     1.0, 0.0, 0.0,
        //     1.0, 1.0, 1.0,
        //     1.0, 1.0, 0.0]);
        // allverts = allverts.concat([
        //     1.0, 0.0, 0.0,
        //     1.0, 0.0, 1.0,
        //     1.0, 1.0, 1.0]);
        // END FACE TRIANGLES IMPORT TO allverts