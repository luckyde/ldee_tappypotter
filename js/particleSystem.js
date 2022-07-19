// Option 1: Import the entire three.js core library.
import * as THREE from 'three';
import * as Proton from "three.proton.js";
let clock = new THREE.Clock(); 
function initProton(scene) {
    proton = new Proton();
    tapEmmiter = createEmitter()
    proton.addEmitter(tapEmmiter);
    proton.addRender(new Proton.MeshRender(scene));
}
function createBox() {
    var geometry = new THREE.SphereGeometry(.06,6,2);
    var material = new THREE.MeshLambertMaterial({
        color: "#ff0000"
    });
    material.blendEquation =  THREE.AddEquation;

    return new THREE.Mesh(geometry, material);
}

    function createEmitter(scene,renderer) {
        emitter = new Proton.Emitter();
         emitter.rate = new Proton.Rate(new Proton.Span(80, 100), new Proton.Span(.6, 14.5));
        console.log(emitter);
        emitter.addInitialize(new Proton.Mass(.3));
        emitter.addInitialize(new Proton.Radius(.3));
        emitter.addInitialize(new Proton.Life(.8, 2));
        emitter.addInitialize(new Proton.Body(createBox()));
        emitter.addInitialize(new Proton.V(4, new Proton.Vector3D(4, -1, -4), -90));


        // emitter.addBehaviour(new Proton.Rotate("random", "random"));
        emitter.addBehaviour(new Proton.Rotate());
            emitter.addBehaviour(new Proton.Gravity(.01));
        emitter.addBehaviour(new Proton.Scale(1.5, .1));
        // var zone2 = new Proton.BoxZone(4);
       // emitter.addBehaviour(new Proton.CrossZone(zone2, "bound"));
        // spring = new Proton.Spring(0, .8, 0);
         // emitter.addBehaviour(spring);
         let colors = [ "#fefa68","#e26222","#20a1f8","#49f759","#f049f3","#be1818"   ];
        emitter.addBehaviour(new Proton.Color(colors, 'random'));

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
        if(bonusSpeedOn){
          proton.emitters[0].rate = new Proton.Rate(new Proton.Span(120, 240), new Proton.Span(11, 421));
          proton.emitters[0].damping=0.005;
        }else{
          let r = clickCount %2;
          proton.emitters[0].rate = new Proton.Rate(new Proton.Span(60, 120), new Proton.Span(11, 421));
          proton.emitters[0].damping=0.015 -  r*0.02;
        }
        proton.emitters[0].rotation.y =testRotation /360 * Math.PI;
         // spring.reset(xPos*.2, yPos*.2, 0);
        // console.log(wardInfo[0]);

        Proton.Debug.renderInfo(proton, 3);
    }


export function particleSystem(scene,renderer)  {
  console.log('particle sy2stem start');
  initProton(scene,renderer);
  animate(scene, renderer);
  let render = function(){
    //particle render loop

  }
  return render;
}
