document.addEventListener('DOMContentLoaded', function() {
  let clickableObjects = [], meshes = [], mixers = [], hemisphereLight, camera, scene, renderer, controls;

  init();


  function init() {
    const container = document.getElementById('container');
    
    scene = new THREE.Scene();
    renderer = new THREE.WebGLRenderer();
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(window.innerWidth, window.innerHeight);
    this.keys = { LEFT: 37, UP: 38, RIGHT: 39, BOTTOM: 40, I:73 };
  }

});