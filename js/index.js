import { Scene, PerspectiveCamera, Raycaster, WebGLRenderer,Vector3, Color, TorusKnotGeometry, SphereGeometry } from 'three';
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import {particleSystem} from './particleSystem.js';
import {tapEvent} from './tap.js';
import { createSculpture, createSculptureWithGeometry } from 'shader-park-core';

import { spCode } from './spCode.js';


//TYPOGRAPHY
import Typography from 'typography'
import parnassusTheme from 'typography-theme-parnassus'
parnassusTheme.baseFontSize = '22px' // was 20px.
parnassusTheme.scaleRatio = 3;
const typography = new Typography(parnassusTheme)

// Or insert styles directly into the <head> (works well for client-only
// JS web apps.)
typography.injectStyles()

let scene = new Scene();
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

renderer.setClearColor( new Color(1,1,1), 1 );
function sizeCanvas(){
  renderer.setPixelRatio( window.devicePixelRatio  );
    renderer.setSize( stage.offsetWidth, stage.offsetWidth);
}
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


// Shader Park Setup
let mesh = createSculpture(spCode, () => ( {
  time: params.time,
    //mouse
} ));
scene.add(mesh);

// *** Uncomment to try using a custom geometry. Make sure to comment out likes 26-29 ***.

// let mesh = createSculptureWithGeometry(geometry, spCode, () => ( {
//   time: params.time,
// } ));
// scene.add(mesh);
 /*
let controls = new OrbitControls( camera, renderer.domElement, {
  enableDamping : true,
  dampingFactor : 0.25,
  zoomSpeed : 0.5,
  rotateSpeed : 0.5
} );
 */
particleSystem(scene);
tapEvent(stage);
let render = () => {
  requestAnimationFrame( render );
  params.time += 0.01;
  //controls.update();
  renderer.render( scene, camera );
};

render();
