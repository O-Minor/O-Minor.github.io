//Camera.js
// store and control View and Projection matrixes

// define a class called Camera
class Camera{
    constructor(canvas){
        console.log('camera object being made');
        this.fov = 60;
        this.eye = new Vector3([0,0,3]);
        //console.log(this.eye.elements);
        this.at = new Vector3([0,0,-1]);
        this.up = new Vector3([0,1,0]);
        this.viewMatrix = new Matrix4();
        this.speed = 0.5
        this.viewMatrix.setLookAt(
            this.eye.elements[0], this.eye.elements[1], this.eye.elements[2],
            this.at.elements[0],this.at.elements[1],this.at.elements[2], 
            this.up.elements[0],this.up.elements[1],this.up.elements[2]
        ); //eye, at, up
        this.projectionMatrix = new Matrix4();
        this.projectionMatrix.setPerspective(
            this.fov, canvas.width / canvas.height, 0.1, 1000
        );
    }
    moveForward(f_speed){
        console.log(`move forward`);
        console.log(this.eye.elements);
        var v_f = new Vector3();
        v_f.set(this.at);
        v_f.sub(this.eye);
        v_f.normalize();
        v_f.mul(f_speed);
        this.eye = this.eye.add(v_f);
        this.at = this.at.add(v_f);
    }
    moveBackwards(b_speed){
        console.log(`move backwards`);
        var v_f = new Vector3();
        v_f.set(this.eye);
        v_f.sub(this.at); //swotched for sub
        v_f.normalize();
        v_f.mul(b_speed);
        this.eye = this.eye.add(v_f);
        this.at = this.at.add(v_f);
    }
    moveLeft(l_speed){
        console.log(`move left`);
        var v_f = new Vector3();
        v_f.set(this.at); //f = at - eye
        v_f.sub(this.eye);
        var v_s = new Vector3();
        v_s = Vector3.cross(this.up, v_f);
        v_s.normalize();
        v_f.mul(l_speed);
        this.eye = this.eye.add(v_s);
        this.at = this.at.add(v_s);
    }
    moveRight(r_speed){
        console.log(`move right`);
        // but compute the opposite side vector s = f x up.
        var v_f = new Vector3();
        v_f.set(this.at); //f = at - eye
        v_f.sub(this.eye);
        var v_s = new Vector3();
        v_s = Vector3.cross(v_f, this.up);
        v_s.normalize();
        v_f.mul(r_speed);
        this.eye = this.eye.add(v_s);
        this.at = this.at.add(v_s);
    }
    panLeft(angle){
        console.log(`pan left`);
        var f = new Vector3();
        f.set(this.at);
        f.sub(this.eye);
        //var alpha = 10;
        let rotationMatrix = new Matrix4();
        rotationMatrix.setRotate(angle, 
            this.up.elements[0], 
            this.up.elements[1], 
            this.up.elements[2]);
        var f_prime = rotationMatrix.multiplyVector3(f);
        this.at.set(this.eye);
        this.at.add(f_prime);
    }
    panRight(angle){
        console.log(`pan right`);
        var f = new Vector3();
        f.set(this.at);
        f.sub(this.eye);
        //var angle = 10;
        let rotationMatrix = new Matrix4();
        rotationMatrix.setRotate(-angle, 
            this.up.elements[0],
            this.up.elements[1],
            this.up.elements[2]);
        var f_prime = rotationMatrix.multiplyVector3(f);
        this.at.set(this.eye);
        this.at.add(f_prime); //this.eye + f_prime
    }
}