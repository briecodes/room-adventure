document.addEventListener('DOMContentLoaded', function() {
  let meshes = [], mixers = [], hemisphereLight, camera, scene, renderer, controls;

  init();
  animate();


  function init() {
    const container = document.getElementById('container');

    camera = new THREE.PerspectiveCamera( 70, window.innerWidth / window.innerHeight, 0.01, 10 );
    camera.position.z = 1;
    
    scene = new THREE.Scene();

    geometry = new THREE.BoxGeometry( 0.2, 0.2, 0.2 );
    material = new THREE.MeshNormalMaterial();

    mesh = new THREE.Mesh( geometry, material );
    scene.add( mesh );

    // ADD LIGHTS
    scene.add( new THREE.AmbientLight( 0x443333, 0.1 ) );
    let light1 = new THREE.DirectionalLight( 0xffddcc, 0.1 );
    let light2 = new THREE.DirectionalLight( 0xccccff, 0.1 );
    light1.position.set( 1, 0.75, 0.5 );
    light2.position.set( -1, 0.75, -0.5 );
    scene.add( light1 );
    scene.add( light2 );

    let loader = new THREE.OBJLoader();
    loader.setPath('./3D/Restaurant');
    loader.load('General.obj', (object) => {
      object.position.y -= 60;
      scene.add(object);
    });

    renderer = new THREE.WebGLRenderer( { antialias: true } );
    renderer.setSize( window.innerWidth, window.innerHeight );
    document.body.appendChild( renderer.domElement );
  };

  function animate() {
    requestAnimationFrame( animate );
    mesh.rotation.x += 0.01;
    mesh.rotation.y += 0.02;
    renderer.render( scene, camera );
  };

});