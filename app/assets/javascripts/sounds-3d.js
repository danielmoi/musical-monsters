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

    m3d.arrFrequencyData = new Uint8Array(m3d.analyser.frequencyBinCount);



});

$('#play').on('click', function() {
  m3d.audioElement.play();
  console.log('play');

  m3d.javascriptNode.onaudioprocess = function() {
    m3d.analyser.getByteFrequencyData(m3d.arrFrequencyData);
  };

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
  m3d.NEAR = 1;
  m3d.FAR = 1000;

  // create a camera
  m3d.camera = new THREE.PerspectiveCamera(
    m3d.VIEW_ANGLE,
    m3d.ASPECT,
    m3d.NEAR,
    m3d.FAR
  );

  m3d.scene.add(m3d.camera);

  // the camera starts at 0,0,0 – so we pull back
  // m3d.camera.position.x = -20;
  // m3d.camera.position.y = -50;
  // m3d.camera.position.z = 60;
  // m3d.camera.position.set(40, -10, 50);
  m3d.camera.position.set(20, 10, 45);
  // m3d.camera.up = new THREE.Vector3(10,10,11);
  // m3d.camera.position.set( new THREE.Vector3(1.21, 7.5, 76.2));

  // m3d.camera.rotation.x = 1.15;
  // m3d.camera.rotation.y = 0;
  // m3d.camera.position.set(1.5, 0, 0);
  // m3d.camera.rotation.set(0.07, 0.015, -0.002);

  // Not using this
  // m3d.camera.lookAt( m3d.scene.position );

  // This is too early on in the code for this to be executed
  // m3d.camera.lookAt(new THREE.Vector3(10,15,-20));

  ///////////////////////////////////////////////////////////////////////////
  // GUI HELPER
  // m3d.gui = new dat.GUI();
  //
  // m3d.fl = m3d.gui.addFolder('camera.rotation');
  // m3d.fl.add(m3d.camera.rotation, 'x', -5, 5, 0.1).listen();
  // m3d.fl.add(m3d.camera.rotation, 'y', -5, 5, 0.1).listen();
  // m3d.fl.add(m3d.camera.rotation, 'z', -5, 5, 0.1).listen();
  // m3d.fl.open();
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

  // add visual axes
  m3d.axes = new THREE.AxisHelper(20);
  m3d.scene.add( m3d.axes );


  ///////////////////////////////////////////////////////////////////////////
  // CREATE CUBES
  m3d.arrCubes = [];
  m3d.textureLoader = new THREE.TextureLoader();
  m3d.texture1 = m3d.textureLoader.load('/images/monster-3d.png');
  //   function(texture) {
  //     m3d.material1 = new THREE.MeshLambertMaterial({
  //       map: m3d.texture1
  //     });
  //   }
  // );
  // m3d.material1 = new THREE.MeshBasicMaterial( { map: m3d.texture1 });
  // m3d.faceMaterial = new THREE.MeshFaceMaterial( m3d.material1 );

  var i = 0;
  for (var x = 0; x < 30; x += 2) {
    var j = 0;
    m3d.arrCubes[i] = [];
    for (var y = 0; y < 30; y += 2) {
      var geometry = new THREE.CubeGeometry(1.5, 1.5, 1.5);
      // var material = new THREE.MeshLambertMaterial({
      //   // color: 0x00ff00
      //   map: m3d.texture1
      // });
      var material = new THREE.MeshLambertMaterial({
        map: m3d.texture1
      });
      m3d.arrCubes[i][j] = new THREE.Mesh(geometry, material);

      // set positions here, no need to use Vector3
      m3d.arrCubes[i][j].position.set(x, y, 0);

      m3d.scene.add( m3d.arrCubes[i][j] );
      j += 1;
    }
    i += 1;

  }



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
  m3d.controls.center.set(10,15,-20);

  ///////////////////////////////////////////////////////////////////////////
  // This is repositioning the camera. It has to go here (not too much early in code)
  m3d.camera.lookAt(new THREE.Vector3(10,15,-20));

  ///////////////////////////////////////////////////////////////////////////
  // GO
  // (actually render, and keep rendering)

  m3d.animate();


}; // End init function

///////////////////////////////////////////////////////////////////////////

// The render function
m3d.animate = function() {

  m3d.arrFrequencyData = m3d.arrFrequencyData || [];
  var k = 0;
  for (var m = 0; m < m3d.arrCubes.length; m++) {
    for (var n = 0; n < m3d.arrCubes.length; n++) {
      var scale = m3d.arrFrequencyData[k] / 30;
      m3d.arrCubes[m][n].scale.z = scale < 1 ? 1 : scale;
      k += (k < m3d.arrFrequencyData.length ? 1 : 0);
      // console.log(scale);
    }
  }


  // render the scene
  m3d.renderer.render( m3d.scene, m3d.camera );



  // let's go again
  requestAnimationFrame( m3d.animate );
};

///////////////////////////////////////////////////////////////////////////
// Handle resizing
m3d.onResize = function() {
  m3d.WIDTH = $('.main__container').width();
  m3d.HEIGHT = m3d.WIDTH * 9/16;
  m3d.camera.aspect = m3d.WIDTH / m3d.HEIGHT;

  m3d.camera.updateProjectionMatrix();

  m3d.renderer.setSize(m3d.WIDTH, m3d.HEIGHT);

};

window.addEventListener('resize', m3d.onResize, false);


///////////////////////////////////////////////////////////////////////////
// Set up once page is ready
$(document).ready(function() {
  m3d.init();
});
