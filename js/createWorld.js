// this file consists of functions used in creating a world

let createSkybox = function (scene) {
	let material
	material = new THREE.MeshBasicMaterial({map: THREE.ImageUtils.loadTexture('textures/galaxy_test.jpg')});
	material.side = THREE.BackSide;

	let skyboxMaterial = new THREE.MeshFaceMaterial(material);
	const skyboxGeom = new THREE.BoxGeometry(3000, 3000, 3000, 64, 64, 64);
	let skybox = new THREE.Mesh(skyboxGeom, skyboxMaterial);
	scene.add(skybox);
};

let createLights = function(scene){
	let light = new THREE.DirectionalLight( 0xffffff, 2.5);
	light.position.set( 1, 1, 1 );
	scene.add( light );

	light = new THREE.DirectionalLight(0xffffff, 2.5);
	light.position.set( -1, - 0.5, -1 );
	scene.add( light );
}


let createCubes = function (scene, objects, box_inter, cubes_num) {
	geometry = new THREE.BoxGeometry(20, 20, 20);

	for (let i = 0; i < 12; i++) {
		let face = geometry.faces[i];
		face.vertexColors[0] = new THREE.Color().setHSL(Math.random(), Math.random(), Math.random());
		face.vertexColors[1] = new THREE.Color().setHSL(Math.random(), Math.random(), Math.random());
		face.vertexColors[2] = new THREE.Color().setHSL(Math.random(), Math.random(), Math.random());
	}

	for (let i = 0; i < cubes_num; i++) {
		material = new THREE.MeshPhongMaterial({
			specular: 0xffffff,
			shading: THREE.FlatShading,
			vertexColors: THREE.VertexColors
		});
		let mesh = new THREE.Mesh(geometry, material);
		mesh.position.x = Math.floor(Math.random() * 20 - 10) * -40;
		mesh.position.y = Math.floor(Math.random() * 20) * -20;
		mesh.position.z = Math.floor(Math.random() * 20) * -20;
		scene.add(mesh);
		material.color.setHSL(Math.random() * 0.2 + 0.5, 0.75, Math.random() * 0.25 + 0.75);
		box_inter[i] = new THREE.Box3(new THREE.Vector3(), new THREE.Vector3());
		box_inter[i].setFromObject(mesh);
		objects.push(mesh);
	}
};

let createMask = function(){
	const maskTexture = new THREE.TextureLoader().load("textures/sniper2.png");
	const maskGeometry = new THREE.PlaneGeometry(2.51, 1.3);
	const maskMaterial = new THREE.MeshBasicMaterial({map: maskTexture, transparent: true});
	const mask = new THREE.Mesh(maskGeometry, maskMaterial);
	mask.position.x = 0;
	mask.position.y = -0.03;
	mask.position.z = -2.3;
	return mask;
}

let createRenderer = function (){
	let renderer = new THREE.WebGLRenderer();
	renderer.setClearColor( 0x0c0c0c );
	renderer.setSize( window.innerWidth, window.innerHeight );
	return renderer
}