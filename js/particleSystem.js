// Option 1: Import the entire three.js core library.
import * as THREE from 'three';
import * as Proton from "three.proton.js";
let clock = new THREE.Clock();
function initProton(scene) {
    proton = new Proton();
    tapEmmiter = createEmitter()
    coinEmitter = createCoinEmitter();
    proton.addEmitter(tapEmmiter);
    proton.addEmitter(coinEmitter);
    proton.addRender(new Proton.MeshRender(scene));

    scene.add(new THREE.AmbientLight(0xffffff, 2.5));


}
function createBox() {
    var geometry = new THREE.SphereGeometry(.15,6,2);
    var material = new THREE.MeshStandardMaterial({
      metalness: 0.758,
      roughness: 1,
      color: '#ebcb00',
      emissive:"#a93232",
       emissiveIntensity:.3
    });

    return new THREE.Mesh(geometry, material);
}

    function createEmitter(scene,renderer) {
      console.log('make emiter');
        emitter = new Proton.Emitter();
         emitter.rate = new Proton.Rate(new Proton.Span(80, 100), new Proton.Span(.6, 14.5));
        console.log(emitter);
        emitter.addInitialize(new Proton.Mass(.3));
        emitter.addInitialize(new Proton.Radius(.3));
        emitter.addInitialize(new Proton.Life(.8, 2));
        emitter.addInitialize(new Proton.Body(createBox()));
        emitter.addInitialize(new Proton.V(4, new Proton.Vector3D(4, -1, -4), -90));


        emitter.addBehaviour(new Proton.Rotate("random", "random"));
        emitter.addBehaviour(new Proton.Rotate());
            emitter.addBehaviour(new Proton.Gravity(.01));
        emitter.addBehaviour(new Proton.Scale(1, .1));
         let colors = [ "#fefa68","#e26222","#20a1f8","#49f759","#f049f3","#be1818"   ];
        emitter.addBehaviour(new Proton.Color(colors, 'random'));

        //
        // emitter.emit(999);

        return emitter;
    }
    function createCoinEmitter(scene,renderer) {
      console.log('make emiter');
        emitter = new Proton.Emitter();
         emitter.rate = new Proton.Rate(22, new Proton.Span(.6, 14.5));
        console.log(emitter);
        emitter.addInitialize(new Proton.Mass(.3));
        emitter.addInitialize(new Proton.Radius(.3));
        emitter.addInitialize(new Proton.Life(.8, 2));
        emitter.addInitialize(new Proton.Body(coin_geo()));
        emitter.addInitialize(new Proton.V(4, new Proton.Vector3D(0, 4, -4), -190));


        emitter.addBehaviour(new Proton.Rotate("random", "random"));

            emitter.addBehaviour(new Proton.Gravity(.02));
        emitter.addBehaviour(new Proton.Scale(1, .1));
         let colors = [ "#ebcb00","#d7ab0f"];
        emitter.addBehaviour(new Proton.Color(colors));
        var zone2 = new Proton.BoxZone(4);
       emitter.addBehaviour(new Proton.CrossZone(zone2, "bound"));
        // spring = new Proton.Spring(0, .8, 0);
         // emitter.addBehaviour(spring);

        emitter.p.x = 0;
        emitter.p.y = 0;
        //
        // emitter.emit(999);

        return emitter;
    }
    function animate(scene,renderer) {
        requestAnimationFrame(animate);
        render(scene,renderer);
    }


    let testRotation =0;
    function render(scene,renderer) {
        proton.update(clock.getDelta());
        //
        // tha += .005;
        let motionTime = threeTime*3 ;
        let MotionRadius = 0.5;
        let figure8Scale =1
           let xPos = figure8Scale * Math.sin(2*motionTime) / 2;
            let yPos = figure8Scale * Math.cos(motionTime);

        proton.emitters[0].p.x =xPos+.2;
        proton.emitters[0].p.y = yPos-.2;
        proton.emitters[0].p.z = -2;

        testRotation+=10;
        //rate
        let r = clickCount %2;
        proton.emitters[0].rate = new Proton.Rate(new Proton.Span(60, 120), new Proton.Span(11, 421));
        proton.emitters[0].damping=0.015 -  r*0.02;

        proton.emitters[0].rotation.y =testRotation /360 * Math.PI;
         // spring.reset(xPos*.2, yPos*.2, 0);
        // console.log(wardInfo[0]);

        // Proton.Debug.renderInfo(proton, 3);
    }


export function particleSystem(scene,renderer)  {

  initProton(scene,renderer);
  animate(scene, renderer);
  let render = function(){
    //particle render loop

  }
  return render;
}

function coin_geo(){
  var coinMat = new THREE.MeshStandardMaterial({
     metalness: 0.758,
     roughness: 0,
     color: '#ebcb00',
     emissive:"#a93232",
      emissiveIntensity:.3
   });
  var geometry = new THREE.CylinderGeometry(.25, .25, 0.09, 11);
  var coin = new THREE.Mesh(geometry, coinMat);

  return coin;
}
