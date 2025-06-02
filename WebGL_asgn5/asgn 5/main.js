import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { GUI } from 'three/addons/libs/lil-gui.module.min.js';
import {OBJLoader} from 'three/addons/loaders/OBJLoader.js';
import {MTLLoader} from 'three/addons/loaders/MTLLoader.js';

function main() {

	const canvas = document.querySelector( '#c' );
	const renderer = new THREE.WebGLRenderer( { antialias: true, canvas } );

	const fov = 45;
	const aspect = 2; // the canvas default
	const near = 0.1;
	const far = 100;
	const camera = new THREE.PerspectiveCamera( fov, aspect, near, far );
	camera.position.set( 0, 10, 20 );

    console.log(camera);
    console.log(canvas);
	const controls = new OrbitControls( camera, canvas );
	controls.target.set( 0, 5, 0 );
	controls.update();

	const scene = new THREE.Scene();
	scene.background = new THREE.Color( 'black' );

    // GROUND PLANE
	{

		const planeSize = 40;

		const loader = new THREE.TextureLoader();
		const texture = loader.load( 'resources/images/checker.png' );
		texture.wrapS = THREE.RepeatWrapping;
		texture.wrapT = THREE.RepeatWrapping;
		texture.magFilter = THREE.NearestFilter;
		texture.colorSpace = THREE.SRGBColorSpace;
		const repeats = planeSize / 2;
		texture.repeat.set( repeats, repeats );

		const planeGeo = new THREE.PlaneGeometry( planeSize, planeSize );
		const planeMat = new THREE.MeshPhongMaterial( {
			map: texture,
			side: THREE.DoubleSide,
		} );
		const mesh = new THREE.Mesh( planeGeo, planeMat );
		mesh.rotation.x = Math.PI * - .5;
		scene.add( mesh );

	}

    // SKYBOX
    {

		const loader = new THREE.CubeTextureLoader();
		const texture = loader.load( [
			'resources/skybox/sky1.png',
            'resources/skybox/sky2.png',
            'resources/skybox/sky3.png',
            'resources/skybox/sky4.png',
            'resources/skybox/sky5.png',
            'resources/skybox/sky6.png',
    	] );
		scene.background = texture;

	}

    // TEST CUBE
	{

		const cubeSize = 4;
		const cubeGeo = new THREE.BoxGeometry( cubeSize, cubeSize, cubeSize );
		const cubeMat = new THREE.MeshPhongMaterial( { color: '#8AC' } );
		const mesh = new THREE.Mesh( cubeGeo, cubeMat );
		mesh.position.set( cubeSize + 1, cubeSize / 2, 0 );
		scene.add( mesh );

	}

	{

		const sphereRadius = 3;
		const sphereWidthDivisions = 32;
		const sphereHeightDivisions = 16;
		const sphereGeo = new THREE.SphereGeometry( sphereRadius, sphereWidthDivisions, sphereHeightDivisions );
		const sphereMat = new THREE.MeshPhongMaterial( { color: '#CA8' } );
		const mesh = new THREE.Mesh( sphereGeo, sphereMat );
		mesh.position.set( - sphereRadius - 1, sphereRadius + 2, 0 );
		scene.add( mesh );

	}

    {
        const cylSize = 4;
		const cylGeo = new THREE.CylinderGeometry( 0.75, 0.75, 4, 12 );
		const cylMat = new THREE.MeshPhongMaterial( { color: '#9FC' } );
		const mesh = new THREE.Mesh(cylGeo, cylMat );
		mesh.position.set( cylSize + 1, cylSize / 2, 4 );
		scene.add( mesh );

	}

    // MULTIPLE CUBES

    // define what a box is
    const boxWidth = 1;
    const boxHeight = 1;
    const boxDepth = 1;
    const geometry = new THREE.BoxGeometry(boxWidth, boxHeight, boxDepth);

    function makeInstance(geometry, color, x, z) {
      const material = new THREE.MeshPhongMaterial({color});
     
      const cube = new THREE.Mesh(geometry, material);
      scene.add(cube);
     
      cube.position.x = x+2;
      cube.position.y = 6;
      cube.position.z = z;
     
      return cube;
    }

    const cubes = [
      //makeInstance(geometry, 0x8844aa, -2),
      //makeInstance(geometry, 0x44aa88,  0),
      //makeInstance(geometry, 0xaa8844,  2),
    ];

    for (let i = -11; i <11; i+=2){
        cubes.push(makeInstance(geometry, 0x8844aa, i, -4));
        cubes.push(makeInstance(geometry, 0x8844aa, i, -8));
    }

    

    // TINY BIRD
    {
		const mtlLoader = new MTLLoader();
		mtlLoader.load( 'resources/tiny-bird/textures/tiny-bird.mtl', ( mtl ) => {

			mtl.preload();
			const objLoader = new OBJLoader();
			objLoader.setMaterials( mtl );
			objLoader.load( 'resources/tiny-bird/textures/tiny-bird.obj', ( root ) => {
                root.scale.set(4,4,4);
				scene.add( root );

			} );

		} );

	}

    // guis from tuts
	class ColorGUIHelper {

		constructor( object, prop ) {

			this.object = object;
			this.prop = prop;

		}
		get value() {

			return `#${this.object[ this.prop ].getHexString()}`;

		}
		set value( hexString ) {

			this.object[ this.prop ].set( hexString );

		}

	}

    {
        // ambient
        const ambcolor = 0xFFFFFF;
        const ambintensity = 0.4;
        const amblight = new THREE.AmbientLight( ambcolor, ambintensity );
		scene.add( amblight );

        // hemispheric
		const skyColor = 0xB1E1FF;  // light blue
        const groundColor = 0xB97A20;  // brownish orange
		const intensity = 1;
        const light = new THREE.HemisphereLight(skyColor, groundColor, intensity);
        scene.add( light );

		const gui = new GUI();
		gui.addColor(new ColorGUIHelper(light, 'color'), 'value').name('skyColor');
        gui.addColor(new ColorGUIHelper(light, 'groundColor'), 'value').name('groundColor');
		gui.add( light, 'intensity', 0, 5, 0.01 );

	}
    // directional
	{

        const color = 0xFFFFFF;
        const intensity = 1;
        const light = new THREE.DirectionalLight(color, intensity);
        light.position.set(0, 10, 0);
        light.target.position.set(-5, 0, 0);
        scene.add(light);
        scene.add(light.target);

	    const gui = new GUI();
        gui.addColor(new ColorGUIHelper(light, 'color'), 'value').name('color');
        gui.add(light, 'intensity', 0, 5, 0.01);
        gui.add(light.target.position, 'x', -10, 10);
        gui.add(light.target.position, 'z', -10, 10);
        gui.add(light.target.position, 'y', 0, 10);
	}

    // FLOWER FACES CUBE
    const loadManager = new THREE.LoadingManager();
    const loader = new THREE.TextureLoader(loadManager);
 
    const materials = [
    new THREE.MeshBasicMaterial({map: loader.load('resources/images/flower-1.jpg')}),
    new THREE.MeshBasicMaterial({map: loader.load('resources/images/flower-2.jpg')}),
    new THREE.MeshBasicMaterial({map: loader.load('resources/images/flower-3.jpg')}),
    new THREE.MeshBasicMaterial({map: loader.load('resources/images/flower-4.jpg')}),
    new THREE.MeshBasicMaterial({map: loader.load('resources/images/flower-5.jpg')}),
    new THREE.MeshBasicMaterial({map: loader.load('resources/images/flower-6.jpg')}),
    ];

    loadManager.onLoad = () => {
        const cube = new THREE.Mesh(geometry, materials);
        //const cube = new THREE.MeshPhongMaterial(materials);
        cube.position.set(0,5,0);
        scene.add(cube);
        cubes.push(cube);  // add to our list of cubes to rotate
    };

	function resizeRendererToDisplaySize( renderer ) {

		const canvas = renderer.domElement;
		const width = canvas.clientWidth;
		const height = canvas.clientHeight;
		const needResize = canvas.width !== width || canvas.height !== height;
		if ( needResize ) {

			renderer.setSize( width, height, false );

		}

		return needResize;

	}

	function render(time) {
        time *= 0.001;  // convert time to seconds
		if ( resizeRendererToDisplaySize( renderer ) ) {

			const canvas = renderer.domElement;
			camera.aspect = canvas.clientWidth / canvas.clientHeight;
			camera.updateProjectionMatrix();

		}

        cubes.forEach((cube, ndx) => {
            const speed = 1  * .99; // + ndx after the 1 to add randomness
            const rot = time * speed;
            cube.rotation.x = rot;
            cube.rotation.y = rot;
        });

		renderer.render( scene, camera );

		requestAnimationFrame( render );

	}

	requestAnimationFrame( render );

}

main();

// GRAVEYARD
// lives inside render for when theres mutliple cubes in cubes = []
// cubes.forEach( ( cube, ndx ) => {
        //     const speed = .2 + ndx * .1;
        //     const rot = time * speed;
        //     cube.rotation.x = rot;
        //     cube.rotation.y = rot;
        // } );
// the flower box w multi texture waiting
/*
// define what a box is
    const boxWidth = 1;
    const boxHeight = 1;
    const boxDepth = 1;
    const geometry = new THREE.BoxGeometry(boxWidth, boxHeight, boxDepth);

    const cubes = [];

    // loading  textures
    const loadManager = new THREE.LoadingManager();
    const loader = new THREE.TextureLoader(loadManager);
 
    const materials = [
    new THREE.MeshBasicMaterial({map: loader.load('resources/images/flower-1.jpg')}),
    new THREE.MeshBasicMaterial({map: loader.load('resources/images/flower-2.jpg')}),
    new THREE.MeshBasicMaterial({map: loader.load('resources/images/flower-3.jpg')}),
    new THREE.MeshBasicMaterial({map: loader.load('resources/images/flower-4.jpg')}),
    new THREE.MeshBasicMaterial({map: loader.load('resources/images/flower-5.jpg')}),
    new THREE.MeshBasicMaterial({map: loader.load('resources/images/flower-6.jpg')}),
    ];

    const loadingElem = document.querySelector('#loading');
    const progressBarElem = loadingElem.querySelector('.progressbar');

    loadManager.onLoad = () => {
        loadingElem.style.display = 'none';
        const cube = new THREE.Mesh(geometry, materials);
        scene.add(cube);
        cubes.push(cube);  // add to our list of cubes to rotate
    };

    loadManager.onProgress = (urlOfLastItemLoaded, itemsLoaded, itemsTotal) => {
        const progress = itemsLoaded / itemsTotal;
        progressBarElem.style.transform = `scaleX(${progress})`;
    };

*/


/*
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );

const renderer = new THREE.WebGLRenderer();
renderer.setSize( window.innerWidth, window.innerHeight );
renderer.setAnimationLoop( animate );
document.body.appendChild( renderer.domElement );

const geometry = new THREE.BoxGeometry( 1, 1, 1 );
const material = new THREE.MeshBasicMaterial( { color: 0x00ff00 } );
const cube = new THREE.Mesh( geometry, material );
scene.add( cube );

camera.position.z = 5;

function animate() {

	cube.rotation.x += 0.01;
	cube.rotation.y += 0.01;

	renderer.render( scene, camera );

}
*/

// TUTORIAL WINDMILL
    // {

	// 	const mtlLoader = new MTLLoader();
	// 	mtlLoader.load( 'https://threejs.org/manual/examples/resources/models/windmill/windmill.mtl', ( mtl ) => {

	// 		mtl.preload();
	// 		const objLoader = new OBJLoader();
	// 		objLoader.setMaterials( mtl );
	// 		objLoader.load( 'https://threejs.org/manual/examples/resources/models/windmill/windmill.obj', ( root ) => {

	// 			scene.add( root );

	// 		} );

	// 	} );

	// }