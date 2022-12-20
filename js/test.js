// Canvas Setting
var canvas = document.getElementById('canvas');
var ctx = canvas.getContext('2d');
canvas.width = 600;
canvas.height = 300;


// Main title
var defImg = new Image();
defImg.src = './img/title.png'
defImg.addEventListener('load', function(){
    ctx.drawImage(defImg, 165, 0, 260, 250);
})
ctx.font = "14px 'Michroma', sans-serif"; // 🔸 새로고침 해야만 폰트가 적용되는 에러
ctx.fillText("- Press start button to start -", 170, 275)


// Images
var cloud1 = new Image();
var cloud2 = new Image();
var dinosaur1 = new Image();
var dinosaur2 = new Image();
var dinosaur3 = new Image();
var cactusImg = new Image();
var earth = new Image();
cloud1.src = './img/blackwhite/cloud1.png';
cloud2.src = './img/blackwhite/cloud2.png';
dinosaur1.src = './img/blackwhite/dino1.png'
dinosaur2.src = './img/blackwhite/dino2.png'
dinosaur3.src = './img/blackwhite/dinojump.png'
cactusImg.src = './img/cactus.png';
earth.src = './img/earth.png';
var dinosaurArr = [dinosaur1, dinosaur2, dinosaur3];


// Characters
var dino = {
    x : 50,
    y : 200,
    width : 30,
    height : 50,
    draw(num = 1){
        ctx.drawImage(dinosaurArr[num], this.x-8, this.y, 50, 50)
    }
}
class Materials {
    constructor(x, y, width, height){
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
    }
}
class Cactus extends Materials{
    constructor(){
        super(600, 200, 20, 50);
    }
    draw(){
        ctx.drawImage(cactusImg, this.x-4, this.y, 30, 50)
    }
}
class Cloud1 extends Materials{
    constructor(){
        super(600, 50, 50, 50);
    }
    draw(){
        ctx.drawImage(cloud1, this.x, this.y, this.width, this.height)
    }
}
class Cloud2 extends Materials{
    constructor(){
        super(600, 80, 50, 50);
    }
    draw(){
        ctx.drawImage(cloud2, this.x, this.y, this.width, this.height)
    }
}
class Earth extends Materials{
    constructor(){
        super(600, 235, 600, 20);
    }
    draw(){
        ctx.drawImage(earth, this.x, this.y, this.width, this.height)
    }
}


// Variables
var timer = 0;
var cactusArr = [];
var cloud1Arr = [];
var cloud2Arr = [];
var earthArr = [];
var jumpTimer = 0;
var animation;
var scoreCount = 0;


// Framework
function frameWork(){
    animation = requestAnimationFrame(frameWork)
    timer++;
    if(timer %10 == 0){
        scoreCount++;
    }
    ctx.clearRect(0,0,canvas.width, canvas.height);

    // Score 
    ctx.font = "25px 'Michroma', sans-serif";
    ctx.fillText(`Score : ${scoreCount}`, 10, 30)    

    // Background
    if(timer%170 === 0){
        var cloud1 = new Cloud1();
        cloud1Arr.push(cloud1);
    }
    cloud1Arr.forEach((a, i, o)=>{
        if(a.x < 0){
            o.splice(i,1)
        }
        a.x-=2 ;
        a.draw();
    })
    if(timer%250 === 0){
        var cloud2 = new Cloud2();
        cloud2Arr.push(cloud2);
    }
    cloud2Arr.forEach((a, i, o)=>{
        if(a.x < 0){
            o.splice(i,1)
        }
        a.x-=2 ;

        a.draw();
    })
    if(timer%100 === 0){
        var earth = new Earth();
        earthArr.push(earth);
    }
    earthArr.forEach((a, i, o)=>{
        if(a.x+a.width < 0){
            o.splice(i,1)
        }
        a.x-=5 ;
        a.draw();
    })

    // Cactus
    let ranNum = Math.floor(Math.random()*10);
    if(timer%120 === 0 && timer != 120){
        var cactus = new Cactus();
        cactusArr.push(cactus);
    }else if(timer > 120 && timer % 60 == 0 && ranNum > 4){
        var cactus = new Cactus();
        cactusArr.push(cactus);
    }
    cactusArr.forEach((a, i, o)=>{
        if(a.x < 40){
            o.splice(i,1)
        }
        a.x-=5 ;
        collisionDetect(dino, a)
        a.draw();
    })

    // Jumping Dino
    if(jump == true){
        dino.y -= 5  ;
        jumpTimer++;
    }
    if(jump == false){
        if(dino.y < 200){
            dino.y += 5;
        }
    }
    if(jumpTimer > 20){
        jump = false;
        jumpTimer = 0;
    }
    // Running Dino
    if(timer%16 < 8 && dino.y == 200){
        dino.draw(0);
    }else if(timer%16 >= 8 && dino.y == 200){
        dino.draw(1);
    }else{
        dino.draw(2);
    }
}


// Button UI
var start = document.getElementById('startButton');
var retry = document.getElementById('retryButton');
start.addEventListener('click', function(){
    frameWork();
    this.disabled = true;
})
retry.addEventListener('click', function(){
    location.reload(true)
})


// Collision detect
function collisionDetect(dino, cactus){
    var xMinus = cactus.x - (dino.x+ dino.width);
    var yMinus = cactus.y - (dino.y + dino.height);
    if(xMinus < 0 && yMinus < 0){
        ctx.font = "25px 'Michroma', sans-serif";
        ctx.fillText(`Game Over`, 210, 283)   
        cancelAnimationFrame(animation);
        retry.disabled = false;
    }
}


// Jumping by pressing space key
var jump = false;
document.addEventListener('keydown', function(e){
    if(e.code === 'Space' && dino.y == 200){
        jump = true;
    }
})


function backgroundMotion(loop, objClass, objArr, speed){
    if(timer%loop === 0){
        var obj = new objClass
        objArr.push(obj);
    }
    objArr.forEach((a, i, o)=>{
        if(a.x < 0){
            o.splice(i,1)
        }
        a.x-=speed ;
        a.draw();
    })
}


