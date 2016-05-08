var m3d = m3d || {};


m3d.audioContext = new AudioContext();
m3d.audioElement = new Audio();
m3d.audioElement.controls = true;
m3d.audioElement.crossOrigin = 'anonymous';

// SoundCloud details
m3d.clientID = "client_id=3b2585ef4a5eff04935abe84aad5f3f3";
m3d.soundcloudURL = 'https://api.soundcloud.com/tracks/293';

m3d.getStream = $.ajax({
  url: m3d.soundcloudURL + '?' + m3d.clientID
})
  .done(function(response) {
    m3d.streamURL = response.stream_url + '?' + m3d.clientID;
    m3d.audioElement.src = m3d.streamURL;
    m3d.source = m3d.audioContext.createMediaElementSource(m3d.audioElement);
    // connect: audioElement > destination
    m3d.source.connect(m3d.audioContext.destination);

    m3d.analyser = m3d.audioContext.createAnalyser();
    m3d.analyser.fftSize = 512;
    m3d.smoothingTimeConstant = 0.6;

    m3d.javascriptNode = m3d.audioContext.createScriptProcessor(2048, 1, 1);

    // connect: audioElement > analyser > jsNode > destination
    m3d.source.connect(m3d.analyser);
    m3d.analyser.connect(m3d.javascriptNode);
    m3d.javascriptNode.connect(m3d.audioContext.destination);



});

$('#play').on('click', function() {
  m3d.audioElement.play();
  console.log('play');
});

$('#pause').on('click', function() {
  m3d.audioElement.pause();
});

m3d.init = function() {


  ///////////////////////////////////////////////////////////////////////////
  // SCENE

  // create a scene
  m3d.scene = new THREE.Scene();

  // set scene size
  m3d.WIDTH = $('.main__container').width();
  m3d.HEIGHT = m3d.WIDTH * 9/16;


  ///////////////////////////////////////////////////////////////////////////
  // CAMERA

  // set camera attributes
  m3d.VIEW_ANGLE = 45;
  m3d.ASPECT = m3d.WIDTH / m3d.HEIGHT;
  m3d.NEAR = 0.1;
  m3d.FAR = 10000;

  // create a camera
  m3d.camera = new THREE.PerspectiveCamera(
    m3d.VIEW_ANGLE,
    m3d.ASPECT,
    m3d.NEAR,
    m3d.FAR
  );

  m3d.scene.add(m3d.camera);

  // the camera starts at 0,0,0 – so we pull back
  m3d.camera.position.z = 300;
  m3d.camera.lookAt( m3d.scene.position );


  ///////////////////////////////////////////////////////////////////////////
  // RENDERER

  // create a WebGL renderer
  m3d.renderer = new THREE.WebGLRenderer();

  // start the renderer
  m3d.renderer.setSize(m3d.WIDTH, m3d.HEIGHT);
  m3d.renderer.setClearColor( 0x000000 );


  // get the DOM element to attach things to
  m3d.$container = $('.sounds__container');


  // attach the DOM element supplied by renderer
  m3d.$container.append(m3d.renderer.domElement);

  // // // add visual axes
  // m3d.axes = THREE.AxisHelper(40);
  // m3d.scene.add( m3d.axes );


  ///////////////////////////////////////////////////////////////////////////
  // CREATE SPHERE

  // Primitives are geometric meshes, relatively basic ones like Spheres, Planes, Cubes and Cylinders.
  // Let's use primitives instead of importing models from Blender / Maya / C4D / Other
  m3d.radius = 50;
  m3d.segments = 16;
  m3d.rings = 16;

  // create a new mesh with sphere geometry
  m3d.sphereMaterial = new THREE.MeshLambertMaterial({
    color: 0xCC0000
  });

  m3d.sphereGeometry = new THREE.SphereGeometry(m3d.radius, m3d.segments, m3d.rings);

  m3d.sphereMesh = new THREE.Mesh( m3d.sphereGeometry, m3d.sphereMaterial );
  // add sphere to scene
  m3d.scene.add(m3d.sphereMesh);

  ///////////////////////////////////////////////////////////////////////////
  // CREATE LIGHT

  m3d.pointLight = new THREE.PointLight(0xffffff);

  m3d.pointLight.position.x = 10;
  m3d.pointLight.position.y = 50;
  m3d.pointLight.position.z = 130;

  m3d.scene.add( m3d.pointLight );

  ///////////////////////////////////////////////////////////////////////////
  // ADD CONTROLS
  // These allow us to zoom in etc

  m3d.controls = new THREE.OrbitControls( m3d.camera, m3d.renderer.domElement);

  ///////////////////////////////////////////////////////////////////////////
  // GO
  // (actually render, and keep rendering)

  m3d.animate();


};

m3d.animate = function() {

  // render the scene
  m3d.renderer.render( m3d.scene, m3d.camera );

  // let's go again
  requestAnimationFrame( m3d.animate );
};

m3d.onResize = function() {
  m3d.WIDTH = $('.main__container').width();
  m3d.HEIGHT = m3d.WIDTH * 9/16;
  m3d.camera.aspect = m3d.WIDTH / m3d.HEIGHT;

  m3d.camera.updateProjectionMatrix();

  m3d.renderer.setSize(m3d.WIDTH, m3d.HEIGHT);

};

window.addEventListener('resize', m3d.onResize, false);

$(document).ready(function() {
  m3d.init();
});

// window.onload = m3d.init();
