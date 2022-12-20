
// 캐릭터 만들기
var canvas = document.getElementById('canvas');
var ctx = canvas.getContext('2d');

canvas.width = 600;
canvas.height = 300;

// title
var defImg = new Image();
defImg.src = './img/title.png'
defImg.addEventListener('load', function(){ // 처음 로드되었을 때 캔버스에 기본 이미지 넣어주기
    ctx.drawImage(defImg, 165, 0, 260, 250);
    ctx.font = "20px 'Michroma', sans-serif";
    ctx.fillText("- Press start button to start -", 180, 275)
})




// 필요 이미지 선언
var cloud1 = new Image();
cloud1.src = './img/blackwhite/cloud1.png';

var cloud2 = new Image();
cloud2.src = './img/blackwhite/cloud2.png';


// idea => 배열에 넣어서 draw 파라미터 넣으면?
var dinosaur1 = new Image();
dinosaur1.src = './img/blackwhite/dino1.png'
var dinosaur2 = new Image();
dinosaur2.src = './img/blackwhite/dino2.png'
var dinosaur3 = new Image();
dinosaur3.src = './img/blackwhite/dinojump.png'
var dinosaurArr = [dinosaur1, dinosaur2, dinosaur3];


var cactusImg = new Image();
cactusImg.src = './img/cactus.png';

var earth = new Image();
earth.src = './img/earth.png';


// 요소 속성 정의
// 공룡
var dino = {
    x : 50,
    y : 200,
    width : 30,
    height : 50,
    draw(num = 1){
        //ctx.fillStyle = 'green'; // 이미지가 들어가면 이게 히트박스(실체)
        //ctx.fillRect(this.x, this.y, this.width, this.height);
        ctx.drawImage(dinosaurArr[num], this.x-8, this.y, 50, 50) // 이미지 넣기
        //                             히트박스의 위 그림 위치 조정
    }
}



// 장애물 
// 장애물 역시 속성 먼저 정리해두면 편리
// but 장애물마다 속성 다를 수 있음
// class로 만들어두자!!
class Cactus {
    constructor(){
        this.x = 550;
        this.y = 200;
        this.width = 20;
        this.height = 50;
    }
    draw(){
        //ctx.fillStyle = 'red';
        //ctx.fillRect(this.x, this.y, this.width, this.height);
        ctx.drawImage(cactusImg, this.x-4, this.y, 30, 50) // 이미지 넣기
    }
}
// var cactus = new Cactus();
// cactus.draw();


// 배경
class Cloud1 {
    constructor(){
        this.x = 600;
        this.y = 50;
        this.width = 50;
        this.height = 50;
    }
    draw(){
        ctx.drawImage(cloud1, this.x-4, this.y, 50, 50)
    }
}
class Cloud2 {
    constructor(){
        this.x = 600;
        this.y = 80;
        this.width = 50;
        this.height = 50;
    }
    draw(){
        ctx.drawImage(cloud2, this.x-4, this.y, 50, 50)
    }
}
class Earth {
    constructor(){
        this.x = 600;
        this.y = 235;
        this.width = 600;
        this.height = 20;
    }
    draw(){
        ctx.drawImage(earth, this.x-4, this.y, this.width, this.height)
    }
}



// 애니메이션 만드려면 한번에 순간이동이 아닌 초마다 조금씩 이동하는 반복이 필요
// 주요 변수
var timer = 0;
var cactusArr = []; // 장애물 여러개 관리하려면 배열로 관리해보쟈
var cloud1Arr = [];
var cloud2Arr = [];
var earthArr = [];
var jumpTimer = 0; // 점프 후 n프레임이 지나면 다시 내려오게 하기위한 변수
var animation;
var scoreCount = 0;


function frameWork(){
    animation = requestAnimationFrame(frameWork) // 웹브라우저 기본기능
    // 이렇게 하면 이 안의 실행문이 1초에 모니터 프레임 수만큼 실행
    // 모니터 환경과 무관하게 모두 60프레임 등으로 고정하는법은 구글링 해보쟈 
    timer++; // 프레임마다 1씩 올라감
    if(timer %10 == 0){ // 10프레임마다 점수 카운트
        scoreCount++;
    }
    

    ctx.clearRect(0,0,canvas.width, canvas.height);
    // 매번 지우고 새로 생성하지 않으면 잔상이 계속 남는다!

    ctx.font = "25px 'Michroma', sans-serif";
    ctx.fillText(`Score : ${scoreCount}`, 10, 30)    

    // 배경
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
    


    // 🌟 난수배열 밖에 선언하고 참조하면서 프레임 주기%10으로 조절할 수 있지 않을까?
    // if(timer%80 === 0 && timer != 80){  // 정해진 프레임마다 실행
    //     var cactus = new Cactus();
    //     cactusArr.push(cactus);
    // }

    let ranNum = Math.floor(Math.random()*10); // 0~9 사이의 난수
    if(timer%120 === 0 && timer != 120){ // 120프레임마다는 고정 실행
        var cactus = new Cactus();
        cactusArr.push(cactus);
    }else if(timer > 120 && timer % 60 == 0 && ranNum % 2 == 0){
        // 120 사이 프레임은      60프레임마다          난수 홀짝에 따라 실행
        var cactus = new Cactus();
        cactusArr.push(cactus);
    }
    
    


    cactusArr.forEach((a, i, o)=>{ // forEach 변수 사용법
        //                          (요소, 인덱스, 전체 배열) 로 추청 찾아보쟈.
        // x좌표가 0미만이면 배열에서 제거
        if(a.x < 40){
            o.splice(i,1)
        }
        a.x-=5 ;

        // 충돌 체크
        collisionDetect(dino, a)
        a.draw();
    })

    
    if(jump == true){
        dino.y -= 5  ; // 이걸로 점프속도 조절 가능
        jumpTimer++; // 프레임마다 +1
    }
    if(jump == false){
        if(dino.y < 200){
            dino.y += 5;
        }
    }
    if(jumpTimer > 20){  // 100프레임 지나면
        jump = false;  // 점프 false
        jumpTimer = 0;
    }
    if(timer%16 < 8 && dino.y == 200){
        dino.draw(0);
    }else if(timer%16 >= 8 && dino.y == 200){
        dino.draw(1);
    }else{
        dino.draw(2);
    }

}

// 버튼 ui
var start = document.getElementById('startButton');
var retry = document.getElementById('retryButton');
start.addEventListener('click', function(){
    frameWork();
    this.disabled = true;
})

// retry는 페이지 새로고침으로
retry.addEventListener('click', function(){
    location.reload(true)
})


// 충돌확인
function collisionDetect(dino, cactus){
    var xMinus = cactus.x - (dino.x+ dino.width);
    var yMinus = cactus.y - (dino.y + dino.height);
    if(xMinus < 0 && yMinus < 0){ // 충돌
        // 게임정지
        // ctx.clearRect(0,0, canvas.width, canvas.height); // 캔버스 클리어

        ctx.font = "25px 'Michroma', sans-serif";
        ctx.fillText(`Game Over`, 210, 283)   
        cancelAnimationFrame(animation); // 애니메이션 중지
        retry.disabled = false;
    }
}

// 스페이스바 누르면 점프
var jump = false;
document.addEventListener('keydown', function(e){
    if(e.code === 'Space' && dino.y == 200){ // 공중에서 떨어지는 도중 다시 점프가 가능한 현상 제거
        jump = true;
    }
})



