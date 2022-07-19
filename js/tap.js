import gsap from "gsap";
let gE=function(e){return document.getElementById(e)};
let rules;
let numScore;
let numNextUnlock; // left side unlock info
let tapBonusBtn; //right side bonus button
let tapBonusBtnText = gE('sideBtn_bonus_txt').innerHTML;

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
let bonusAnimation;
let bonusTimeoutAnimation;
let bonusDisabledAnimation;
function updateScore(){
  currentScore+= (rules.score.increments * currentScoreMultiplier );
  numScore.innerHTML = "Score: "+currentScore;



}

function tap(){
  clickCount++;
  tapTimeline.restart();
  tapEmmiter.emit("once")

  //used to check if you've hit the max.. game over stage of rule limits
  hitRulesLimit = nextScoreStage>=unlockCount;


  updateScore();

  if(hitRulesLimit == false ){ // check if you've hit the limit
    if(currentScore>= nextScoreInfo.value ){ // if youve passed the threshold for unlocking a new goal
      currentScoreInfo =  rules.unlocks[nextScoreStage];
      //threshold hit, next unlock unlocked
      nextScoreStage++; //update goals
      if(rules.unlocks[nextScoreStage]){ //if there is a next level, update the goals
        nextScoreInfo = rules.unlocks[nextScoreStage];
        updateGoals();

      }
      if(nextScoreStage==1){
        console.log('init bonus');
        bonusOn=1;
      } // on unlock your first nextScore Stage, enable the bonus

    };

  }

}
function tapBonus(){
  if(bonusOn){ //enabled after first unlock is reached

      document.getElementById("score").style.color = "green";
    if(bonusAnimation.isActive() == false && bonusTimeoutAnimation.isActive()==false ){

      bonusAnimation.restart();
       currentScoreMultiplier =currentScoreInfo.tapBoostMultiplier;// TEMP, this shouod be currentScoreInfo not nextScoreInfo
    }
    tap(); //Temporarily turn htis button into a tap button for convenience
  }else{


    gE('sideBtn_bonus_txt').innerHTML = "NOT YET! "

    bonusDisabledAnimation.restart();
  }

}
function bonusTimeOut(){
  bonusTimeoutAnimation.restart();
  currentScoreMultiplier = 1;
}
function updateGoals(){
  numNextUnlock.innerHTML = nextScoreInfo.value;
}
export function tapEvent(stage){

  rules = require('./rules.json');
  numScore = gE('score');
  numNextUnlock = gE('numNextUnlock');
  tapBonusBtn = gE('sideBtn_bonus');

  nextScoreInfo = rules.unlocks[nextScoreStage];
  unlockCount = rules.unlocks.length;
   updateGoals();
   setupAnimations();

     stage.addEventListener("click", tap, false)
    tapBonusBtn.addEventListener("click", tapBonus, false)






}
function setupAnimations(){
  //setup animation for bonus
  //bonus kicked in
  bonusAnimation =   gsap.timeline({onComplete: bonusTimeOut})
  .add(function(){ bonusSpeedOn =true;},0)
    .to("#bonus_timer", rules.bonusTimerSeconds,{width:"0%"})
  bonusAnimation.pause();
  //timer kicked in after bonus
  bonusTimeoutAnimation = gsap.timeline()
  .add(function(){ bonusSpeedOn =false; document.getElementById("score").style.color = "white"; },0)
    .set("#bonus_timer",{backgroundColor:"gray",width:"100%"},0)
    .add( function(){   gE('sideBtn_bonus_txt').innerHTML = "Bonus Resetting " } ,0)
    .to("#bonus_timer", rules.bonusTimerTimeoutSeconds*0.98,{width:"0%"})
    .set("#bonus_timer",{backgroundColor:"green",width:"100%",scale:0.5},rules.bonusTimerTimeoutSeconds*0.98)
    .to("#bonus_timer", rules.bonusTimerTimeoutSeconds*0.02,{scale:1, ease:"QuadOut"},rules.bonusTimerTimeoutSeconds*0.98)

    .add( function(){   gE('sideBtn_bonus_txt').innerHTML =tapBonusBtnText} ,rules.bonusTimerTimeoutSeconds)

    bonusTimeoutAnimation.pause();


  bonusDisabledAnimation =   gsap.timeline({onComplete: ()=>{  gE('sideBtn_bonus_txt').innerHTML = tapBonusBtnText }})
  .to("#bonus_timer",.05,{backgroundColor:"red",scale:0.9,ease:"ExpoOut"},0)
  .to("#bonus_timer",.3,{scale:1,backgroundColor:"green",ease:"CircOut"},0.05)
  bonusDisabledAnimation.pause();



}
