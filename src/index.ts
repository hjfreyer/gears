// three.js

import * as shapes from './shapes';

import * as THREE from 'three'
import * as TrackballControls from 'three-trackballcontrols';
import * as gears from './gears';


// const canvas = document.createElement('canvas');
// canvas.width = 1200;
// canvas.height = 600;
//
// document.body.appendChild(canvas);
//
// const ctx = canvas.getContext('2d');
// const scale = 300;
//
// ctx.setTransform(scale, 0, 0, scale, 1*scale, 1*scale)
// ctx.lineWidth = 1/scale;
// ctx.stroke();
//
//
// const modulez= 1/32;
//
// const n1 = 7;
// const n2 = 30;
// const pressureAngle =  Math.PI/9;
// const backlash = 0.01
//
// const gear1 = shapes.getGear(n1, modulez, pressureAngle, backlash);
// const gear2 = shapes.getGear(n2, modulez, pressureAngle, backlash);
//
// let pitchRadius2 = (n1+n2) * modulez / 4;
//
// function animate() {
//   requestAnimationFrame(animate);
//
//   let pitchRadius = n1 * modulez / 2;
//
//     let rootRadius = pitchRadius - modulez * 1.157
//     let outerRadius = pitchRadius + modulez;
//     let baseRadius = pitchRadius * Math.cos(pressureAngle);
//
//       let t = -new Date().getTime() / 200;
//       t=0;
//       ctx.save();
//
//       // Use the identity matrix while clearing the canvas
//       ctx.setTransform(1, 0, 0, 1, 0, 0);
//       ctx.clearRect(0, 0, canvas.width, canvas.height);
//
//       // Restore the transform
//       ctx.restore();
//
//     ctx.strokeStyle = 'red';
//     ctx.beginPath();
//     ctx.arc(0, 0, rootRadius, 0, 2*Math.PI);
//     ctx.stroke();
//
//     ctx.strokeStyle = 'blue';
//     ctx.beginPath();
//     ctx.arc(0, 0, baseRadius, 0, 2*Math.PI);
//     ctx.stroke();
//
//     ctx.strokeStyle = 'purple';
//     ctx.beginPath();
//     ctx.arc(0, 0, pitchRadius, 0, 2*Math.PI);
//     ctx.stroke();
//
//     ctx.strokeStyle = 'orange';
//     ctx.beginPath();
//     ctx.arc(0, 0, outerRadius, 0, 2*Math.PI);
//     ctx.stroke();
//
//     ctx.strokeStyle = 'black';
//
//
//
//   ctx.beginPath();
//   for(const [r, theta] of gear1) {
//     ctx.lineTo(r * Math.cos(theta+t/n1), r * Math.sin(theta+t/n1));
//   }
//   ctx.stroke();
//
//   ctx.beginPath();
//   for(const [r, theta] of gear2) {
//     ctx.lineTo(r * Math.cos(Math.PI+theta-t/n2) + 2*pitchRadius2, r * Math.sin(Math.PI+theta- t/n2));
//   }
//   ctx.stroke();
//
// }
// animate();

  //
  // renderer = new THREE.WebGLRenderer( { antialias: true } );
  // renderer.setPixelRatio( window.devicePixelRatio );
  // renderer.setSize( window.innerWidth, window.innerHeight );
  // document.body.appendChild( renderer.domElement );


//import * as TrackballControls from './TrackballControls';
//var TrackballControls = require('three-trackballcontrols');

var camera, controls, scene, renderer, stats;
init();
animate();
var theScene;
function init() {
  camera = new THREE.PerspectiveCamera( 20, window.innerWidth / window.innerHeight, 1, 1000 );
  camera.position.z = 100;
  camera.position.y = 20;
  controls = new TrackballControls( camera );
  controls.rotateSpeed = 1.0;
  controls.zoomSpeed = 1.2;
  controls.panSpeed = 0.8;
  controls.noZoom = false;
  controls.noPan = false;
  controls.staticMoving = true;
  controls.dynamicDampingFactor = 0.3;
  controls.keys = [ 65, 83, 68 ];
  controls.addEventListener( 'change', render );
  // world
  scene = new THREE.Scene();
  theScene = gears.buildScene(scene);
  scene.background = new THREE.Color( 0xcccccc );
//				scene.fog = new THREE.FogExp2( 0xcccccc, 0.002 );
  var geometry = new THREE.CylinderBufferGeometry( 0, 10, 30, 4, 1 );
  var material = new THREE.MeshPhongMaterial( { color: 0xffffff, flatShading: true } );
/*				for ( var i = 0; i < 500; i ++ ) {
    var mesh = new THREE.Mesh( geometry, material );
    mesh.position.x = ( Math.random() - 0.5 ) * 1000;
    mesh.position.y = ( Math.random() - 0.5 ) * 1000;
    mesh.position.z = ( Math.random() - 0.5 ) * 1000;
    mesh.updateMatrix();
    mesh.matrixAutoUpdate = false;
    scene.add( mesh );
  }*/

    const boxWidth = 100
    const boxHeight = 50
    const boxDepth = 20
    const thickness = 1

  // lights
  var light = new THREE.DirectionalLight( 0xffffff );
  light.position.set( 20, 20, 20 );
  scene.add( light );
  var light2 = new THREE.DirectionalLight( 0x332288 );
  light2.position.set( -20, -20, -20 );
  scene.add( light2 );
  var light3 = new THREE.AmbientLight( 0x222222 );
  scene.add( light3 );
  // renderer
  renderer = new THREE.WebGLRenderer( { antialias: true } );
  renderer.setPixelRatio( window.devicePixelRatio );
  renderer.setSize( window.innerWidth, window.innerHeight );
  document.body.appendChild( renderer.domElement );
  //
  window.addEventListener( 'resize', onWindowResize, false );
  //
  // Create a 2D triangular shape
  // The Shape() class has methods for drawing a 2D shape



  //ob.position.z = -boxDepth/2;

  render();
}
function onWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize( window.innerWidth, window.innerHeight );
  controls.handleResize();
  render();
}
function animate() {
  requestAnimationFrame( animate );
  controls.update();
  render();
}
function render() {
  gears.updateRotation(theScene,
    new Date().getTime() / 3000,
    new Date().getTime() / 1000
  );
  renderer.render( scene, camera );
}

//
// // create the scene
// let scene = new THREE.Scene()
//
// // create the camera
// let camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000)
//
// let controls = new TrackballControls( camera );
// controls.rotateSpeed = 1.0;
// controls.zoomSpeed = 1.2;
// controls.panSpeed = 0.8;
// controls.noZoom = false;
// controls.noPan = false;
// controls.staticMoving = true;
// controls.dynamicDampingFactor = 0.3;
// controls.keys = [ 65, 83, 68 ];
// controls.addEventListener( 'change', render );
//
// let renderer = new THREE.WebGLRenderer()
//
// // set size
// renderer.setSize(window.innerWidth, window.innerHeight)
//
// // add canvas to dom
// document.body.appendChild(renderer.domElement)
//
// // add axis to the scene
// let axis = new THREE.AxesHelper(10)
//
// scene.add(axis)
//
// // add lights
// let light = new THREE.DirectionalLight(0xffffff, 1.0)
//
// light.position.set(100, 100, 100)
//
// scene.add(light)
//
// let light2 = new THREE.DirectionalLight(0xffffff, 1.0)
//
// light2.position.set(-100, 100, -100)
//
// scene.add(light2)
//
// let material = new THREE.MeshBasicMaterial({
// 	color: 0xaaaaaa,
// 	wireframe: true
// })
// var clock = new THREE.Clock();
// // create a box and add it to the scene
// let box = new THREE.Mesh(new THREE.BoxGeometry(1, 1, 1), material)
//
// scene.add(box)
//
// box.position.x = 0.5
// box.rotation.y = 0.5
//
// camera.position.x = 5
// camera.position.y = 5
// camera.position.z = 5
//
// camera.lookAt(scene.position)
//
// function animate(): void {
//   controls.update(clock.getDelta());
// 	requestAnimationFrame(animate)
// 	render()
// }
//
// function render(): void {
// 	let timer = 0.002 * Date.now()
// 	box.position.y = 0.5 + 0.5 * Math.sin(timer)
// 	box.rotation.x += 0.1
// 	renderer.render(scene, camera)
// }
//
// animate()
