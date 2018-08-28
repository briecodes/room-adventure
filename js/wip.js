document.addEventListener('DOMContentLoaded', function() {
  let camera, scene, renderer, controls, raycaster, room;

  let havePointerLock = 'pointerLockElement' in document || 'mozPointerLockElement' in document || 'webkitPointerLockElement' in document;

  if ( havePointerLock ) {
    var element = document.body;
    var pointerlockchange = function ( event ) {
      if ( document.pointerLockElement === element || document.mozPointerLockElement === element || document.webkitPointerLockElement === element ) {
        controlsEnabled = true;
        controls.enabled = true;
        blocker.style.display = 'none';
      } else {
        controls.enabled = false;
        blocker.style.display = 'block';
        instructions.style.display = '';
      }
    };
  }

  document.addEventListener( 'pointerlockchange', pointerlockchange, false );
  document.addEventListener( 'mozpointerlockchange', pointerlockchange, false );
  document.addEventListener( 'webkitpointerlockchange', pointerlockchange, false );

  let controlsEnabled = true;
  let moveForward = false;
  let moveBackward = false;
  let moveLeft = false;
  let moveRight = false;
  let canJump = false;
  let prevTime = performance.now();
  let velocity = new THREE.Vector3();
  let direction = new THREE.Vector3();

  init();
  animate();

  function init() {
    camera = new THREE.PerspectiveCamera( 70, window.innerWidth / window.innerHeight, 0.01, 10 );
    camera.position.z = 2;
    
    scene = new THREE.Scene();
    scene.fog = new THREE.Fog( 0xffffff, 0, 750 );

    controls = new THREE.PointerLockControls( camera );
    // scene.add( controls.getObject() );

    // ADD LIGHTS
    scene.add( new THREE.AmbientLight( 0x443333, .75 ) );
    let light1 = new THREE.DirectionalLight( 0xffddcc, .75 );
    let light2 = new THREE.DirectionalLight( 0xccccff, .75 );
    light1.position.set( 1, 0.75, 0.5 );
    light2.position.set( -1, 0.75, -0.5 );
    scene.add( light1 );
    scene.add( light2 );

    let loader = new THREE.OBJLoader();
    loader.setPath('./3D/Restaurant/');
    loader.load('General.obj', (object) => {
      object.position.y -= 2;
      scene.add(object);
      room = object;
    });

    renderer = new THREE.WebGLRenderer( { antialias: true } );
    renderer.setPixelRatio( window.devicePixelRatio );
    renderer.setSize( window.innerWidth, window.innerHeight );
    document.body.appendChild( renderer.domElement );

    window.addEventListener( 'resize', onWindowResize, false );
    function onWindowResize() {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize( window.innerWidth, window.innerHeight );
    }

    let onKeyDown = function ( event ) {
      switch ( event.keyCode ) {
        case 38: // up
        case 87: // w
          moveForward = true;
          break;
        case 37: // left
        case 65: // a
          moveLeft = true; break;
        case 40: // down
        case 83: // s
          moveBackward = true;
          break;
        case 39: // right
        case 68: // d
          moveRight = true;
          break;
        case 32: // space
          if ( canJump === true ) velocity.y += 350;
          canJump = false;
          break;
      }
    };

    let onKeyUp = function ( event ) {
      switch( event.keyCode ) {
        case 38: // up
        case 87: // w
          moveForward = false;
          break;
        case 37: // left
        case 65: // a
          moveLeft = false;
          break;
        case 40: // down
        case 83: // s
          moveBackward = false;
          break;
        case 39: // right
        case 68: // d
          moveRight = false;
          break;
      }
    };

    document.addEventListener( 'keydown', onKeyDown, false );
    document.addEventListener( 'keyup', onKeyUp, false );
    document.addEventListener( 'click', moveCamera, false);
    raycaster = new THREE.Raycaster( new THREE.Vector3(), new THREE.Vector3( 0, - 1, 0 ), 0, 10 );

  };

  function moveCamera() {
    console.log('room', room.position.y);
    room.position.y += 0.05;
    renderer.render(scene, camera);
    console.log('room', room.position.y);
  };

  function animate() {
    requestAnimationFrame( animate );
    if ( controlsEnabled === true ) {
      raycaster.ray.origin.copy( controls.getObject().position );
      raycaster.ray.origin.y -= 10;
      // var intersections = raycaster.intersectObjects( objects );
      // var onObject = intersections.length > 0;
      var time = performance.now();
      var delta = ( time - prevTime ) / 1000;
      velocity.x -= velocity.x * 10.0 * delta;
      velocity.z -= velocity.z * 10.0 * delta;
      velocity.y -= 9.8 * 100.0 * delta; // 100.0 = mass
      direction.z = Number( moveForward ) - Number( moveBackward );
      direction.x = Number( moveLeft ) - Number( moveRight );
      direction.normalize(); // this ensures consistent movements in all directions
      if ( moveForward || moveBackward ) velocity.z -= direction.z * 400.0 * delta;
      if ( moveLeft || moveRight ) velocity.x -= direction.x * 400.0 * delta;
      // if ( onObject === true ) {
      //   velocity.y = Math.max( 0, velocity.y );
      //   canJump = true;
      // }
      controls.getObject().translateX( velocity.x * delta );
      controls.getObject().translateY( velocity.y * delta );
      controls.getObject().translateZ( velocity.z * delta );
      if ( controls.getObject().position.y < 10 ) {
        velocity.y = 0;
        controls.getObject().position.y = 10;
        canJump = true;
      }
      prevTime = time;
    }
    renderer.render(scene, camera);
  };
   
  animate();

});