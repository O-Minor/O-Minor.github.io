class Sphere{
    constructor(copyMatrix){
        this.type=`sphere`;
        this.color = [1.0, 1.0, 1.0, 1.0];
        this.textureNum = -1; 
        //-2 coded color, -1 debug color, 0 texture, other: red
        if (copyMatrix){
            this.matrix = new Matrix4(copyMatrix);
        }
        else{
            this.matrix = new Matrix4();
        }
    }
    renderlit(){
        //console.log('in render sphere');
        var rgba = this.color;

        // Pass the texture number
        gl.uniform1i(u_whichTexture, this.textureNum);

        // Pass the color of a point to u_FragColor variable
        gl.uniform4f(u_FragColor, rgba[0], rgba[1], rgba[2], rgba[3]);
        

        // Pass the matrix to u_ModelMatrix attribute
        gl.uniformMatrix4fv(u_ModelMatrix, false, this.matrix.elements);
        //FACES
        // x = r sin theta cos roh
        // y = r sin theta cos theta
        // z = r cos theta
        // ignore radius, 
        // in code
        // r is roh and t is theta
        function cos(x){
            return Math.cos(x);
        }
        function sin(x){
            return Math.sin(x);
        }
        var tau = (2*Math.PI);
        var pi = Math.PI;
        // CHANGE BACK TO TEN BEFORE SUBMITTING
        var dx = pi/5;
        var dy = pi/5;

        var t=0;
        var r=0;
        for (t=0; t<pi; t+=dx){
            // console.log('still sphere');
            for (r=0; r< (2*pi); r+=dx){
                var p1 = [sin(t)*cos(r), sin(t)*sin(r), cos(t)];
                var p2 = [sin(t+dy)*cos(r), sin(t+dy)*sin(r), cos(t+dy)];
                // console.log(p2);
                var p3 = [sin(t)*cos(r+dy), sin(t)*sin(r+dy), cos(t)];
                var p4 = [sin(t+dy)*cos(r+dy), sin(t+dy)*sin(r+dy), cos(t+dy)];
                // points of square that is face of sphere

                //uvs
                var uv1 = [(t)/pi, (r)/tau];
                var uv2 = [(t+dy)/pi, (r)/tau];
                var uv3 = [(t)/pi, (r+dy)/tau];
                var uv4 = [(t+dy)/pi, (r+dy)/tau];

                var v = [];
                var uv = [];
                //first triangle of square face
                //paused at 3:08 to get uvs
                v=v.concat(p1); uv=uv.concat(uv1);
                v=v.concat(p2); uv=uv.concat(uv2);
                v=v.concat(p4); uv=uv.concat(uv4);

                // console.log('about to draw sphere face');
                gl.uniform4f(u_FragColor, 0,1,1,1);
                drawTriangle3D_UV_Normal(v, uv, v);
                // console.log('drew sphere face');
                // in a sphere the normals and verticies happen
                // to be the same

                v = []; uv = [];
                v=v.concat(p1); uv=uv.concat(uv1);
                v=v.concat(p4); uv=uv.concat(uv4);
                v=v.concat(p3); uv=uv.concat(uv3);
                gl.uniform4f(u_FragColor, 1,1,1,1);
                drawTriangle3D_UV_Normal(v, uv, v);
            }
        }
    }
}