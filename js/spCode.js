// This function will be converted into a string so
// the scope is limited to this function only.

// To pass external data use the 'input' function. See other examples.

export function spCode()  {
  backgroundColor(vec3(1));
  // Put your Shader Park Code here
 /*
  rotateY(mouse.x * PI / 2 + time*.5);
  rotateX(mouse.y * PI / 2);
  metal(.5);
  shine(.4);
  color(getRayDirection()+.2);
  rotateY(getRayDirection().y*4+time)
  boxFrame(vec3(.4), .02);
  expand(.02);
  blend(nsin(time)*.6)
  sphere(.2);
  */
  //displace(mouse)

  let wand = {width: .04, height: .2}
  let wandShape = shape(() => {

    // displace(0,wand.height/2,0)

    // displace(0,wand.height/2,0
    let s = getSpace();
    let n = noise(s);
    let multT = 0.2;
    displace(s.y*n*6*sin(n*6.3)*0.03*multT,2*s.z*sin(time*1)*0.11, sin(50*(s.y+(time*3)*.1)*0.3)*s.z*sin(n*0.5)*multT);
    let col1 = vec3(0.478,0.065,0.065);
    let col2 = vec3(0.278,0.035,0.035);
    let noiseScale = 28;
    let colorNoise = 0.5 * noise(noiseScale * s + time) + 0.5;
    colorNoise*=3;
    col1 *= colorNoise*2;
    col2 *= colorNoise;
    color(col1);
    cylinder(wand.width*.4, wand.height);
    displace(0,wand.height*.55,0);
    color(col2);
    cylinder(wand.width*.42, wand.height*.5);
    reset();
    displace(0,wand.height*1.2,0);
    color(vec3(0,0,0));

    cylinder(wand.width*.45+nsin(time*3)*.001, wand.height*.2);

  });
  let particleCyclinder = shape(() =>{
    displace(0,-0.3,0)
    rotateX(-PI/2)

    let n1Scale = 0.01;
    let width =0.3;
    let coneAngle =  .9;


    let ray = getRayDirection();
    rotateY(ray.y * 4);

    let size = max(n1Scale * abs(sin(time*.01)), 1100);
    let s = getSpace();

    let movement = vec3(cos(time*.1)*3, -1*time*5, sin(time*.1)*3);
    let n = noise(getRayDirection()*size*.1 + movement);
    let col = pow(abs(n), .3);

    color(vec3(0, 1, col)+normal*.5);
    let d = vec3(1,1.6,.6)
    displace(d);
    torus(width+s.y*coneAngle +n*.54 , n*2);
    displace(d*-1);
  })
  let wandMotion=function(){


    let motionTime = time*3 ;
    let MotionRadius = 0.5;
    let figure8Scale =1
    let motion = vec3(0);
    let xPos = figure8Scale * sin(2*motionTime) / 2;
    let yPos = figure8Scale * cos(motionTime);

    motion.x=xPos * 1.0;
    motion.y =yPos;
    motion*=MotionRadius;

    displace(0,0,wand.height*-1)
    rotateX(cos(motionTime)*.2+1)
    rotateZ(figure8Scale*sin(3*motionTime)*.02)
    displace(0,0,wand.height *1)

    displace(motion)
    wardInfo = [xPos,yPos,0];

    console.log(wardInfo);
    rotateX(PI*0.3)
    rotateZ(PI*0.2)
    wandShape();
   // particleCyclinder();

  }
  wandMotion();
};
