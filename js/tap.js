import gsap from "gsap";
import {Howl, Howler} from 'howler';
let gE=function(e){return document.getElementById(e)};
let rules;
let numScore;
let numNextUnlock; // left side unlock info
let tapBonusBtn; //right side bonus button
let currentScore =0; //tracker
let currentScoreMultiplier = 1;
let nextScoreStage  = 0; //TODO: Link this to some external cookie
let currentScoreInfo={value:0,name:"",tapBoostMultiplier:1}; //current goal info
let nextScoreInfo={}; //current goal to aim for
let unlockCount; //ised to track the length of the unlocks
let hitRulesLimit =false;

//internal values
let bonusCountdown = 1;
let bonusTimeout;
let bonusOn = 0;
let extraCoins = 0;

let bonus_button = gE("sideBtn_bonus"),
    bonus_on = gE("bonus_on"),
    bonus_reloading = gE("bonus_reloading"),
    bonus_off = gE("bonus_off"),
    audio_btn = gE("audio");

let achievement_bar = gE('achievement_bar');

//audio


let sound = 1;
let bgSound = 0;
function soundOnOff(){
    if(sound==1){

      console.log('sound off');
      if(bg){ bg.stop();}
      audio_btn.classList.add('audio_off');
      audio_btn.classList.remove('audio_on');


      }else{
      bgSound = 0;
      audioBG();
      console.log('sound on');
      audio_btn.classList.add('audio_on');
      audio_btn.classList.remove('audio_off');

    }
    sound = sound==1? 0 : 1;
}
function audioBG(){
  if(bgSound==0){
      bg  = new Howl({src: ['/bg.mp3', '/bg.webm'],  volume:0.5,loop:true,preload: true});
    bg.play();
    bgSound = 1;
   console.log('starting bg audio');
  }
}
function randInt(min, max) { // min and max included
  return Math.floor(Math.random() * (max - min + 1) + min)
}
function audioBtnOn(){
  if(!buttonTap_1){
    buttonTap_1  = new Howl({src: ['/btn_1.mp3', '/btn_1.webm'], volume:0.5, preload: true});
    buttonTap_2  = new Howl({src: ['/btn_2.mp3', '/btn_2.webm'], volume:0.5, preload: true});
    buttonTap_3  = new Howl({src: ['/btn_3.mp3', '/btn_3.webm'], volume:0.5, preload: true});
    buttonTap_4  = new Howl({src: ['/btn_4.mp3', '/btn_4.webm'], volume:0.5, preload: true});
    buttonTap_5  = new Howl({src: ['/btn_5.mp3', '/btn_5.webm'], volume:0.5, preload: true});
    buttonTapOff  = new Howl({src: ['/btn_off.mp3', '/btn_off.webm'],volume:0.4, preload: true});

  }
  if(sound==1){
    buttonsAudio = [ buttonTap_1,buttonTap_2,buttonTap_3,buttonTap_4,buttonTap_5];
    let randSound = randInt(0,4);
    console.log('AUDIO TAP BUTTON');
    buttonsAudio[randSound].play();

  }
}
Howler.autoUnlock = true;
Howler.html5PoolSize=100; // It's because I play a lot of sounds

var buttonTap_1,buttonTap_2,buttonTap_3,buttonTap_4,buttonTap_5,buttonTapOff,bg, sparkle_1, sonic, sparkle_2, sparkle_3;

var buttonsAudio = [ buttonTap_1,buttonTap_2,buttonTap_3,buttonTap_4,buttonTap_5];
function audioBtnDisabled(){


  if(sound==1){


    audioBG();
    if(!buttonTap_1){
      buttonTap_1  = new Howl({src: ['/btn_1.webm', '/btn_1.mp3'],  volume:0.5, preload: true});
      buttonTap_2  = new Howl({src: ['/btn_2.webm', '/btn_2.mp3'],  volume:0.5, preload: true});
      buttonTap_3  = new Howl({src: ['/btn_3.webm', '/btn_3.mp3'],  volume:0.5, preload: true});
      buttonTap_4  = new Howl({src: ['/btn_4.webm', '/btn_4.mp3'],  volume:0.5, preload: true});
      buttonTap_5  = new Howl({src: ['/btn_5.webm', '/btn_5.mp3'],  volume:0.5, preload: true});
      buttonTapOff  = new Howl({src: ['/btn_off.webm', '/btn_off.mp3'], volume:0.4,preload: true});

    }
    buttonTapOff.play();
   console.log('AUDIO TAP DISdABLED',sound);
  };
}
function numberWithCommas(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

function updateScore(){
  currentScore+= (rules.score.increments * currentScoreMultiplier );

  numScore.innerHTML = numberWithCommas(currentScore);




}

function tap(){

  updateGoals();
  clickCount++;
  //audio sparkle
  if(sound==1){

      audioBG();
    if(!sparkle_1){
      sparkle_1  = new Howl({src: ['/sfx_lucky_pop_sparkle_1.webm', '/sfx_lucky_pop_sparkle_1.mp3'],  volume:0.5, preload: true});
      sparkle_2  = new Howl({src: ['/sfx_lucky_pop_sparkle_2.webm', '/sfx_lucky_pop_sparkle_2.mp3'],  volume:0.5, preload: true});
      sparkle_3  = new Howl({src: ['/sfx_lucky_pop_sparkle_3.webm', '/sfx_lucky_pop_sparkle_3.mp3'],  volume:0.5, preload: true});
      sonic  = new Howl({src: ['/sonic.webm', '/sonic.mp3'],  volume:0.1, preload: true});
  }
      let sparkles = [sparkle_1,sparkle_2,sparkle_3]
        sparkles[clickCount % 3].play();
      if(bonusOn==0 && nextScoreStage>1 ){
        sonic.play();
      }
      else{
      }
  }
  tapTimeline.restart();
  tapEmmiter.emit("once")
  if(bonusOn==0 && nextScoreStage>1 ){
    coinEmitter.emit("once")
  }

  //used to check if you've hit the max.. game over stage of rule limits
  hitRulesLimit = nextScoreStage>=unlockCount;


  updateScore();

  if(hitRulesLimit == false ){ // check if you've hit the limit
    if(currentScore>  nextScoreInfo.value ){ // if youve passed the threshold for unlocking a new goal
      currentScoreInfo =  rules.unlocks[nextScoreStage];
      //threshold hit, next unlock unlocked
      nextScoreStage++; //update goals
      if(rules.unlocks[nextScoreStage]){ //if there is a next level, update the goals
        nextScoreInfo = rules.unlocks[nextScoreStage];


      }
      if(nextScoreStage==2){
        bonus_enable_init();
      } // on unlock your first nextScore Stage, enable the bonus

    };

  }

}


let tapDisabledTL =gsap.timeline({})

tapDisabledTL.to(bonus_button,0.01,{scale:0.8,opacity:0.8})
tapDisabledTL.to(bonus_button,.5,{scale:1,opacity:1,ease:"power2.easeOut"});
tapDisabledTL.pause();
let tapTL =gsap.timeline({onComplete:tapWaitForCountdown});
tapTL.to(bonus_button,0.01,{scale:0.8,opacity:1},0)

tapTL.set(bonus_on,{display:"none"},.2)
tapTL.set(bonus_reloading,{display:"inherit"},.2)
tapTL.to(bonus_button,.6,{scale:1,ease:"elastic.out(2.7,.26)"},0.01);
tapTL.pause();


let countdownTL =gsap.timeline({repeat:-1});
countdownTL.to(bonus_button,1,{y:5, ease:"power1.easeOut"})
countdownTL.to(bonus_button,1,{y:0, ease:"power1.easeIn"})
countdownTL.pause();


let shakeABitTL =gsap.timeline({repeat:-1,repeatDelay:4});
shakeABitTL.set(bonus_button,{rotation:0})
shakeABitTL.to(bonus_button,.1,{rotation:-10,ease:'power2.easeOut'})
shakeABitTL.to(bonus_button,.1,{rotation:10,ease:'power2.easeOut'})
shakeABitTL.to(bonus_button,.2,{rotation:-5,ease:'power2.easeOut'})
shakeABitTL.to(bonus_button,.2,{rotation:5,ease:'power2.easeOut'})
shakeABitTL.to(bonus_button,.4,{rotation:-2.5,ease:'power2.easeOut'})
shakeABitTL.to(bonus_button,.4,{rotation:0,ease:'power2.easeOut'})
shakeABitTL.pause();

let enterRank = gsap.timeline()
.to("#enter_txt",.5,{opacity:0,y:"30%",ease:"ExpoIn"},0)
.to("#enter_txt",1,{opacity:1,y:"0%",ease:"elastic.out(0.6,0.3)"},.5)
.to("#enter_txt",.1,{rotate:-3.1,color:"yellow",ease:"power3Out"},.5)
.to("#enter_txt",1.6,{rotate:0,color:"white",ease:"elastic.out(0.6,0.5)"},.6)
enterRank.pause();

gsap.set("#extraChar",{rotation:45,transformOrigin:"20% 10%"})

// enterRank.progress(1);

function bonus_enable_init(){
  gsap.set(bonus_on,{display:"inherit"})
  gsap.set([bonus_off,bonus_reloading],{display:"none"})
  shakeABitTL.restart();
  countdownTL.pause(0);

  bonusOn=1;
  currentScoreMultiplier=1;
  console.log('reset of mult');

}
function tapWaitForCountdown( ){

    countdownTL.restart();
    gsap.delayedCall(rules.bonusTimerTimeoutSeconds, bonus_enable_init);
}
function tapBonus(){
  if(bonusOn){ //enabled after first unlock is reached
    audioBtnOn();
    bonusOn = 0;
    tapDisabledTL.progress(1);
    shakeABitTL.pause(0);
    tapTL.restart();
     currentScoreMultiplier =currentScoreInfo.tapBoostMultiplier;// TEMP, this shouod be currentScoreInfo not nextScoreInfo

    tap(); //Temporarily turn htis button into a tap button for convenience
  }else{
    if(countdownTL.isActive()){
      audioBtnOn();
    }else{
      audioBtnDisabled();
    }
    tapDisabledTL.restart();
  }

}
let oldWidth=0;
let rolloverTL;
function updateGoals(){
  let newWidth =  currentScore/nextScoreInfo.value;

  let levelRollOver = currentScore!=0 &&( newWidth<oldWidth || newWidth==oldWidth) ;
   if(!levelRollOver){
     if(rolloverTL){
       rolloverTL.progress(1)
     }

      gsap.to(achievement_bar,.5,{width: newWidth*90+"%" ,ease:"elastic.out(1.4,0.8)" })
   }else{
       rolloverTL = gsap.timeline()
     rolloverTL.to(achievement_bar,.2,{width: 90+"%" ,ease:"power4.out" })
       rolloverTL.to(achievement_bar,1,{width:newWidth*90+"%" ,ease:"elastic.out(1.4,0.8)"})

       // achievement_bar
       enterRank.restart();
       gsap.set("#enter_txt",{innerHTML:currentScoreInfo.name,delay:0.4 })
   }
  oldWidth = newWidth;


  //numNextUnlock.innerHTML = nextScoreInfo.value;
}
let extraCharEnter;
function extraCharSetup(){
  gE("extraChar").style.pointerEvents = 'auto';
  let extraCharTimeOnStage = rules.extraCharTimerSeconds
  let extraCharDelay = rules.extraCharTimerTimeoutSeconds
  gsap.set("#extraChar",{x:"-100%",y:"100%",ease:'expo.out'})
    if(!extraCharEnter){
      console.log('delay',extraCharDelay);
     extraCharEnter = gsap.timeline({repeat:-1,delay: extraCharDelay,repeatDelay:extraCharDelay})
      .set("#extraChar",{x:"-100%",y:"100%",ease:'expo.out'},0)
      .to("#extraChar",1,{x:"0%",y:"0%",ease:'expo.out'},0.01)
      .to("#extraChar",1,{x:"-100%",y:"100%",ease:'expo.out'},extraCharTimeOnStage)

      extraCharEnter.pause();
  }
  extraCharEnter.restart(true);

}
function extraCharTap(){
  console.log('extra char tap');
    gE("extraChar").style.pointerEvents = 'none';
    currentScore=Math.round(currentScore*1.1)
    tap();
  let extraChaTap = gsap.timeline({onComplete:extraCharSetup})
  .set("#score",{scale:1.3,color:"yellow",ease:"power2.in"},0)

  .to("#score",1,{scale:1,color:"white",ease:"power2.in"},0.04)
  .set("#extraChar",{scale:1.2,rotation:32,transformOrigin:"20% 10%"},0)
  .to("#extraChar",1,{scale:1,rotation: 45,transformOrigin:"20% 10%",ease:'elastic.out(0.6,0.56)'},0.01)
  .to("#extraChar",1,{x:"-100%",y:"100%",ease:'expo.out'},0.4)

}
export function tapEvent(stage){

  rules = require('./rules.json');
  numScore = gE('score');
  numNextUnlock = gE('numNextUnlock');
  tapBonusBtn = gE('sideBtn_bonus');

  nextScoreInfo = rules.unlocks[nextScoreStage];
  unlockCount = rules.unlocks.length;
   updateGoals();
   extraCharSetup();
   gE("extraChar").style.display = 'inherit';

     stage.addEventListener("click", tap, false)
     audio_btn.addEventListener("click", soundOnOff, false)
    tapBonusBtn.addEventListener("click", tapBonus, false)
    gE("extraChar").addEventListener("click", extraCharTap, false)






}
