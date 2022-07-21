import { Scene, PerspectiveCamera, Raycaster, AmbientLight, PointLight, WebGLRenderer,Vector3, Color, TorusKnotGeometry, SphereGeometry } from 'three';
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import {particleSystem} from './particleSystem.js';
import {tapEvent} from './tap.js';
import { createSculpture, createSculptureWithGeometry } from 'shader-park-core';
import gsap from "gsap";
let wandPos=0;
import { spCode } from './spCode.js';



// Or insert styles directly into the <head> (works well for client-only
// JS web apps.)
// typography.injectStyles()

let scene = new Scene();
scene.background = new Color( '#FFFFFF' );
let renderParticle  ;
let params = { time: 0 };
//let canvasSize = { width: document.get}
let canvas = document.getElementById("mainCanvas");
let stage = document.getElementById("mainStage");
let stageRatio = 1;
let camera = new PerspectiveCamera( 90, stageRatio, 0.1, 22 );

camera.position.x = 0.3045067164595385;
camera.position.y =  0.0;
camera.position.z =  3.175945569919342;
camera.updateProjectionMatrix();
let renderer = new WebGLRenderer({ antialias: false ,
  powerPreference: "high-performance",canvas:canvas});

function sizeCanvas(){
  renderer.setPixelRatio( window.devicePixelRatio  );
    renderer.setSize( stage.offsetWidth, stage.offsetWidth);
}
// // lighting
// var ambientLight = new AmbientLight(0x110011);
// scene.add(ambientLight);
const aLight = new AmbientLight( 0xffffff, 1.6,  2, 120 );
scene.add( aLight )
var pointLight = new PointLight(0xffffff, .4, 100, 0.06);
pointLight.position.set(-1.3, 1, 0);
scene.add(pointLight);
//scaling
sizeCanvas();
window.addEventListener( 'resize', sizeCanvas, false );

let mouse = new Vector3();
//
// canvas.addEventListener('pointermove', (e) => {
//       const devicePixelRatio = window.devicePixelRatio || 1;
//       const canvasX = (e.pageX - canvas.offsetLeft) * devicePixelRatio;
//       const canvasY = (e.pageY - canvas.offsetTop) * devicePixelRatio;
//       mouse.set(
//           (2.0 * canvasX) / canvas.width - 1.0,
//           2.0 * (1.0 - canvasY / canvas.height) - 1.0,
//           0);
//     },
//     false
// );



let geometry = new TorusKnotGeometry( 3, .3, 100, 9.6);
geometry.computeBoundingSphere();
geometry.center();
// gsap.to(geometry,1,{p:2})
// Shader Park Setup
let mesh = createSculpture(spCode, () => ( {
  time: params.time,
    //mouse
} ));
console.log(wandPos);
scene.add(mesh);

  tapTimeline = gsap.timeline();
tapTimeline.to(mesh.position,.1,{x:-.5,y:0.1,z:.2,ease:"power4.out"})
tapTimeline.to(mesh.position,1,{x:0,y:0,z:0,ease:"power3.out"})

tapTimeline.pause();

// *** Uncomment to try using a custom geometry. Make sure to comment out likes 26-29 ***.

// let mesh = createSculptureWithGeometry(geometry, spCode, () => ( {
//   time: params.time,
// } ));
// scene.add(mesh);

let controls = new OrbitControls( camera, renderer.domElement, {
  enableDamping : true,
  dampingFactor : 0.25,
  zoomSpeed : 0,
  rotateSpeed : 0.5
} );

   renderParticle = particleSystem(scene, renderer);
tapEvent(stage);
let render = () => {
  requestAnimationFrame( render );
  params.time += 0.01;
  threeTime = params.time ;
  controls.update();
  renderParticle();
  renderer.render( scene, camera );
};

render();
document.addEventListener('touchmove', function (event) {
  if (event.scale !== 1) { event.preventDefault(); }
}, { passive: false });
