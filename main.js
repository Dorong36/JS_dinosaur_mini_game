
// 캐릭터 만들기
var canvas = document.getElementById('canvas');
var ctx = canvas.getContext('2d');

// canvas.width = window.innerWidth - 100;
// canvas.height = window.innerHeight - 100;
canvas.width = 600;
canvas.height = 300;

// 필요 이미지 선언
var backgroundImg = new Image();
backgroundImg.src = './img/background.jpg'

var cloud1 = new Image();
cloud1.src = './img/cloud1.png';

var cloud2 = new Image();
cloud2.src = './img/cloud2.png';

var img1 = new Image();
var src1 = './img/dino1.png'
var src2 = './img/dino2.png'
img1.src = src1

var img2 = new Image();
img2.src = './img/cactus.png';


// 요소 속성 정의

var background = {
    x:0,
    y:0,
    width : 550,
    height : 300,
    draw(){
        ctx.drawImage(backgroundImg, this.x, this.y, this.width, this.height);
    }
}

var dino = {
    x : 50,
    y : 200,
    width : 20,
    height : 50,
    draw(){
        ctx.fillStyle = 'green'; // 이미지가 들어가면 이게 히트박스(실체)
        ctx.fillRect(this.x, this.y, this.width, this.height);
        ctx.drawImage(img1, this.x-13, this.y, 50, 50) // 이미지 넣기
    }
}


// 장애물 
// 장애물 역시 속성 먼저 정리해두면 편리
// but 장애물마다 속성 다를 수 있음
// class로 만들어두자!!
class Cactus {
    constructor(){
        this.x = 500;
        this.y = 200;
        this.width = 20;
        this.height = 50;
    }
    draw(){
        ctx.fillStyle = 'red';
        ctx.fillRect(this.x, this.y, this.width, this.height);
        ctx.drawImage(img2, this.x-4, this.y, 30, 50) // 이미지 넣기
    }
}
// var cactus = new Cactus();
// cactus.draw();


// 구름
class Cloud1 {
    constructor(){
        this.x = 600;
        this.y = 50;
        this.width = 50;
        this.height = 50;
    }
    draw(){
        ctx.fillStyle = 'red';
        // ctx.fillRect(this.x, this.y, this.width, this.height);
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
        ctx.fillStyle = 'red';
        // ctx.fillRect(this.x, this.y, this.width, this.height);
        ctx.drawImage(cloud2, this.x-4, this.y, 50, 50)
    }
}



// 애니메이션 만드려면 한번에 순간이동이 아닌 초마다 조금씩 이동하는 반복이 필요

var timer = 0;
var cactusArr = []; // 장애물 여러개 관리하려면 배열로 관리해보쟈
var cloud1Arr = [];
var cloud2Arr = [];
var jumpTimer = 0; // 점프 후 n프레임이 지나면 다시 내려오게 하기위한 변수
var animation;


function frameWork(){
    animation = requestAnimationFrame(frameWork) // 웹브라우저 기본기능
    // 이렇게 하면 이 안의 실행문이 1초에 모니터 프레임 수만큼 실행
    // 모니터 환경과 무관하게 모두 60프레임 등으로 고정하는법은 구글링 해보쟈 
    timer++; // 프레임마다 1씩 올라감


    ctx.clearRect(0,0,canvas.width, canvas.height);
    // 매번 지우고 새로 생성하지 않으면 잔상이 계속 남는다!


    // 🟥
    background.x--;
    background.draw();


    // cloud
    if(timer%150 === 0){
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
    



    if(timer%150 === 0){  // 정해진 프레임마다 실행
        var cactus = new Cactus();
        cactusArr.push(cactus);
    }
    cactusArr.forEach((a, i, o)=>{ // forEach 변수 사용법
        //                          (요소, 인덱스, 전체 배열) 로 추청 찾아보쟈.
        // x좌표가 0미만이면 배열에서 제거
        if(a.x < 0){
            o.splice(i,1)
        }
        a.x-=2 ;

        // 충돌 체크
        collisionDetect(dino, a)
        a.draw();
    })

    
    if(jump == true){
        dino.y -= 2  ; // 이걸로 점프속도 조절 가능
        jumpTimer++; // 프레임마다 +1
    }
    if(jump == false){
        if(dino.y < 200){
            dino.y += 2;
        }
    }
    if(jumpTimer > 50){  // 100프레임 지나면
        jump = false;  // 점프 false
        jumpTimer = 0;
    }

    dino.draw();

    
    
    
}
frameWork();


// 충돌확인
function collisionDetect(dino, cactus){
    var xMinus = cactus.x - (dino.x+ dino.width);
    var yMinus = cactus.y - (dino.y + dino.height);
    if(xMinus < 0 && yMinus < 0){ // 충돌
        // 게임정지
        ctx.clearRect(0,0, canvas.width, canvas.height); // 캔버스 클리어
        cancelAnimationFrame(animation); // 애니메이션 중지
    }
}




// 스페이스바 누르면 점프
var jump = false;
document.addEventListener('keydown', function(e){
    if(e.code === 'Space' && dino.y == 200){ // 공중에서 떨어지는 도중 다시 점프가 가능한 현상 제거
        jump = true;
    }
})
