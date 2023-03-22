// this file consists of gameplay functions
let shootBall = function (scene, camera, balls, balls_inter){
	let ball = new THREE.Mesh(new THREE.SphereGeometry(1, 32, 32), new THREE.MeshPhongMaterial({
                    color: "fuchsia", shininess: 80,
	}));
	ball.position.copy(emitter.getWorldPosition());
	ball.quaternion.copy(camera.quaternion);
	ball.direction = (camera.getWorldDirection()).clone();
	let ball_inter = new THREE.Sphere(ball.position, 1)
	scene.add(ball);
	balls.push(ball);
	balls_inter.push(ball_inter);
}

let updateBallsPos = function (clock, balls, balls_inter) {
	let delta = clock.getDelta();
	for (let i = 0; i < balls.length; i++) {
		balls[i].translateX(speed * delta * balls[i].direction.x);
		balls[i].translateY(speed * delta * balls[i].direction.y);
		balls[i].translateZ(speed * delta * balls[i].direction.z);
		balls_inter[i].position = balls[i].position;
		if (Math.abs(balls[i].position.x) > 2000 || Math.abs(balls[i].position.y) > 2000 || Math.abs(balls[i].position.z) > 2000) {
			scene.remove(balls[i]);
			scene.remove(balls_inter[i]);
			balls_inter.splice(i, 1);
			balls.splice(i, 1);
		}
	}
};

let checkShotCubes = function (scene, objects, box_inter, balls, balls_inter, score) {
	for (let i = 0; i < balls_inter.length; i++) {
		for (let j = 0; j < box_inter.length; j++) {
			if (balls_inter[i] && box_inter[i]) {
				if (balls_inter[i].intersectsBox(box_inter[j])) {
					scene.remove(objects[j]);
					scene.remove(box_inter[j]);
					box_inter.splice(j, 1);
					scene.remove(balls[i]);
					scene.remove(balls_inter[i]);
					balls_inter.splice(i, 1);
					objects.splice(j, 1);
					balls.splice(i, 1);
					++score;
				}
			}
		}
	}
	return score;
};

let addMask = function(camera){
	camera.zoom = 3;
	camera.add(mask);
	camera.add(emitter);
	camera.updateProjectionMatrix();
}

let removeMask = function(camera){
	camera.zoom = 1;
	camera.remove(mask);
	camera.updateProjectionMatrix();
}

// checks player intersections with cubes
let isPLayerOnCube = function(controls, ray, objects){
	let intersections = ray.intersectObjects(objects);
	if ( intersections.length > 0 ) {
		let distance = intersections[0].distance;
		if ( distance > 0 && distance < 10 ) {
			controls.isOnObject( true );
		}
	}
}
