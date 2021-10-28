
// ===============CANVAS RENDERING=================
const ctx = game.getContext('2d');
game.setAttribute('class', 'main-game')
game.setAttribute("height", getComputedStyle(game)["height"]);
game.setAttribute("width", getComputedStyle(game)["width"]);

// ===============GLOBAL VARIABLES=================
let p = false;
let paddleSpeed = 5;
let paddleMove = 0;
let AD = [1, 1]
let arrBalls = [];
let arrPaddles = [];
let arrWalls = [];
let arrBlocks = [];
let globalCount = 0;
let blockWidth = 60;
let blockHeight = 25;
let score = 0;
// these are for the block numbers
let minNum = 1;
let maxNum = 2;

// =================INITIAL LOAD====================
document.addEventListener('DOMContentLoaded', function() {
    const runGame = setInterval(gameLoop, 20);
    paddle = new Paddle(230, 615, '#888', 140, 0);
    arrPaddles.push(paddle);
    //size 6 speed 3 seem to make happy 
    ball = new Ball(300, 400, 'white', 6, 3, -0.5*randAngle())
    arrBalls.push(ball);

    wall = new Wall(0, 0, 10, 650, 'rgb(53, 53, 113)')
    arrWalls.push(wall);
    
    wall2 = new Wall(590, 0, 10, 650, 'rgb(53, 53, 113)')
    arrWalls.push(wall2);

    wall3 = new Wall(-10, 0, 600, 10, 'rgb(53, 53, 113')
    arrWalls.push(wall3);

    /* block = new Block(100, 100, 60, 25, 'white', 3);
    arrBlocks.push(block);
    */ 
    //createGridBlocksRand(60, 100, 8, 8, 3)

// ===============EVENT LISTENERS===================



}) //this ends DOMContentLoaded

// Need a Paddle
class Paddle {
    constructor(x, y, color, width, speed) {
        this.x = x
        this.y = y
        this.color = color
        this.width = width
        this.speed = speed
        this.height = 15;
    }

    render() {

        //inner rectangle
        ctx.fillStyle = this.color;
        ctx.fillRect(this.x, this.y, this.width, this.height);
        ctx.beginPath();

        //inner border
        ctx.strokeStyle = '#555'; 
        ctx.lineWidth = 3;
        ctx.strokeRect(this.x, this.y, this.width, this.height)
        
        //outer border
        ctx.strokeStyle = '#222'; 
        ctx.lineWidth = 1;
        ctx.strokeRect(this.x, this.y, this.width, this.height)

        this.x += paddleMove;

    // keep paddle on the screen
        if (this.x < paddleSpeed+1 || this.x+this.width > (599-paddleSpeed)) {
            this.x -= paddleMove;
        }
    }
}
// Need Balls
class Ball {
    constructor (x, y, color, size, speed, angle) {
        this.x = x
        this.y = y
        this.color = color
        this.size = size
        this.speed = speed
        this.angle = angle

    }

    render() {
    // tried to implement cool down, just broke things :D 
    /*
        if (this.cooldown > 0) {
        this.cooldown--
        }
    */
        if (this.y < 15) {
            this.y += 5
        }
    // bottom black circle 
        ctx.beginPath();
        ctx.fillStyle = "black";
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2, true);
        ctx.fill();

    // top white circle
        ctx.beginPath();
        ctx.fillStyle = "white";
        ctx.arc(this.x, this.y, this.size-2, 0, Math.PI * 2, true);
        ctx.fill();
        this.x += this.speed * Math.cos(this.angle);
        this.y += +1 * this.speed * Math.sin(this.angle);


    }
}
// Need Walls 
class Wall {
    constructor (x, y, width, height, color) {
        this.x = x
        this.y = y
        this.width = width
        this.height = height
        this.color = color
    } 

    render() {
        ctx.fillStyle = this.color;
        ctx.fillRect(this.x, this.y, this.width, this.height);
    }
}

// Need Blocks 
class Block {
    constructor (x, y, width, height, color, hits, fallSpeed) {
        this.x = x
        this.y = y
        this.width = width
        this.height = height
        this.color = color
        this.hits = hits
        this.fallSpeed = fallSpeed
    } 
    render() {
        //give them some color 
        this.color = blockColor(this.hits)
        // inner rectangle
        ctx.fillStyle = this.color;
        ctx.fillRect(this.x, this.y, this.width, this.height);
        ctx.beginPath();
        
        // outer border
        ctx.strokeStyle = '#000'; 
        ctx.lineWidth = 1;
        ctx.strokeRect(this.x, this.y, this.width, this.height)

        // number of hits
        ctx.fillStyle = 'black'
        ctx.font = "20px Arial"
        ctx.fillText(this.hits, this.x + 24, this.y+19)

        this.y += this.fallSpeed;
    }
}


// =================CORE LOOP======================

function gameLoop() {
    if (p === false) {
    // Clear the Cavas
    ctx.clearRect(0, 0, game.width, game.height);
    // render everything
    arrPaddles.forEach(element => element.render());
    arrBlocks.forEach(element => element.render());
    arrBalls.forEach(element => element.render());
    arrWalls.forEach(element => element.render());
    // despawn everything offscreen 

    despawn(arrBalls);
    despawn(arrBlocks);

    // collision detection everything 
    detectBallHit(arrPaddles);
    detectBallHit(arrWalls);
    detectBallHit(arrBlocks);
    document.addEventListener('keydown', startMovement)
    document.addEventListener('keyup', stopMovement)
    // arrSpinners.forEach(element => element.render());
    // arrSquares.forEach(element => element.render());
    createRandomFallingBlocks(30, minNum, maxNum, 0.3)

    // increase difficulty 
    difficulty();
    globalCount++;
    }
}
// ==================DEBUGGING=====================
document.addEventListener('keydown', function(evt) {
    if (evt.key === 'c' && arrBalls.length < 3000) {
        arrBalls.forEach(element => newRandomBall(element.x, element.y));
    }
})

// ==================FUNCTIONS=====================
function startMovement(e) {
    // up (w:87): y-=1; left (a:65): x-=1; down (s:83): y+=1; right (d:68): x+=1
    switch (e.keyCode) {

      case (65):
        paddleMove = -paddleSpeed;
        AD[0] = 0
        break;
      case (68):
        paddleMove = +paddleSpeed;
        AD[1] = 0
    } 

    // ternary operator 
    // hero.y - 10 >= 0 ? hero.y -= 10: null
}

// Keeps an array of the key presses, and stops it if both A and D are let go 
function stopMovement(e) {
    switch (e.keyCode) {
        case (65):
            AD[0] = 1
            break;
        case (68):
            AD[1] = 1
            break;
    }
    if (AD[0] === 1 && AD[1] === 1) {
        paddleMove = 0;
    }
}

function createGridBlocksRand(x, y, xNum, yNum, hitMax) {
    for (let i = 0; i < xNum; i++) {
        for (let j = 0; j < yNum; j++) {
            block = new Block(x + (i * 60), y + (j * 25), blockWidth, blockHeight , 'white', randomInt(hitMax), 0);
            arrBlocks.push(block);
        }
    }
}

function createRandomFallingBlocks(frequency, hitMin, hitMax, fallSpeed) {
    let hitAdd = 1 + hitMax - hitMin;
    if (globalCount % frequency === 0) {
        let escape = 0;
        while (escape < 15) {
            block = new Block(10+Math.random()*(580-blockWidth), -20, blockWidth, blockHeight, 'white', hitMin - 1 + randomInt(hitAdd), fallSpeed)
            let closest = findClosest(block.x, block.y, arrBlocks, 'distance')
        
            if (closest > blockWidth+15 || closest === undefined) {
                arrBlocks.push(block);
                escape = 1000000;
            } else {
                escape++
            }
        }
    }
}


function detectBallHit(arr) {

    // 
if (arrBalls.length > 0 && arr.length > 0)

    for (let i = 0; i < arrBalls.length; i++) {
        let circle = {
            x:arrBalls[i].x, //- 0.5*arrBalls[i].size, unsure if circle is properly centered
            y:arrBalls[i].y, //- 0.5*arrBalls[i].size, worry about it later
            r:arrBalls[i].size};

        for (let j = 0; j < arr.length; j++) {

            let rectangle = {x:arr[j].x, 
                y:arr[j].y, 
                w:arr[j].width, 
                h:arr[j].height};

           if (/*arrBalls[i].cooldown === 0 && */RectCircleColliding(circle, rectangle)) {
                //only check collision so often'
                //cooldown turns out to break some things and fix almost nothing 
                //arrBalls[i].cooldown = 5;
                
                if (arr === arrBlocks) {

                    arrBlocks[j].hits--
                    // increase score on block hit 
                    score += 1
                    document.getElementById('score').innerText = 'Score: ' + score;

                    if (arrBlocks[j].hits === 0) {
                        newRandomBall(
                            arrBlocks[j].x + 0.5*arrBlocks[j].width, 
                            arrBlocks[j].y + 0.5*arrBlocks[j].height
                            );

                            arrBlocks.splice(j, 1);
                    }
               }
                    //this first if checks if it hits the top or bottom 
                if (circle.x >= rectangle.x && circle.x <= rectangle.x + rectangle.w) {
                    //walls should only ever bounce a ball down 


                    // trying to move the ball back where it was when it hits things
                    // this.x += this.speed * Math.cos(this.angle);
                    // this.y += +1 * this.speed * Math.sin(this.angle);

                    arrBalls[i].x -= arrBalls[i].speed * Math.cos(arrBalls[i].angle) 
                    arrBalls[i].y -= arrBalls[i].speed * Math.sin(arrBalls[i].angle)
                    
                    if (arr === arrWalls) {
                        arrBalls[i].angle *= -1;
                        // console.log('arrWalls hit', arrBalls[i].angle)
                    } else {
                    arrBalls[i].angle *= -1
                    // +180 
                    }
                } else {
                    arrBalls[i].angle = Math.PI - arrBalls[i].angle 
                    if (arr === arrPaddles) {
                        arrBalls.splice(i, 1)
                    }
                    // 180 - current angle 
                }

            } 
        }
    }
}

function RectCircleColliding(circle,rect){
    let distX = Math.abs(circle.x - rect.x-rect.w/2);
    let distY = Math.abs(circle.y - rect.y-rect.h/2);

    if (distX > (rect.w/2 + circle.r)) {return false; }
    if (distY > (rect.h/2 + circle.r)) {return false; }

    if (distX <= (rect.w/2)) {return true; } 
    if (distY <= (rect.h/2)) {return true; }

    let dx=distX-rect.w/2;
    let dy=distY-rect.h/2;
    return (dx*dx+dy*dy<=(circle.r*circle.r));
}

function randomInt(x) {
    let ans = Math.random() * x;
    ans = Math.ceil(ans);
    return ans
}

function newRandomBall(x, y) {
    if (y < 25) {
        y = 25
        // console.log('AND WE PUSHED IT SOUTH')
    }
    ball = new Ball(x, y, 'white', 6, 3, randAngle())
    arrBalls.push(ball);
}

function randAngle() {
    let ans = Math.random() * Math.PI * 2 
    if ((ans > 0.2 && ans < Math.PI-0.2) || (ans > Math.PI+0.2 && ans < 2*Math.PI-0.2) ) {
    // playing with recursion like a moron 
    return ans;
    } else {
        return randAngle()
    }
}

function blockColor(num) {
    if (num % 4 === 1) {
            return '#FF8888' 
    } else if (num % 4 === 2) {
        return '#FF9D5C'
    } else if (num % 4 === 3) {
        return '#88FF88'
    } else if (num % 4 === 0) {
        return '#8888FF'
    }
}

function findClosest(x, y, arr, value) {
    //x = x + width/2;
    //y = y + width/2;
    let closest = [x, y, 10000]; // x, y, and distance

    // Make sure there are actually enemies 
    if (arr.length === 0 ) {
        return undefined
    }

    // Simple pythagorean theorem for distance 
    for (let i = 0; i < arr.length; i++) {
        let distance = ((arr[i].x - x) ** 2 + (arr[i].y - y) ** 2) ** 0.5;
        if (distance < closest[2]) {
            closest = [arr[i].x, arr[i].y, distance, arr[i].speed]
        }
    }
    if (value === 'distance') {
        return closest[2]; 
    } else {
        return closest;
    }
}

function despawn(arr) {
    for (let i = 0; i < arr.length; i++) {
        if (
            arr[i].x < -50  || 
            arr[i].x > 650 || 
            arr[i].y < -50 || 
            arr[i].y > 700  
        ) {
            arr.splice(i, 1);
            i--;
        }
    }
}

function difficulty() {
    /*
    // MANUAL AND BORING 

    if (score > 30 && score <= 60) {
        maxNum = 3;
    } else if (score > 60 && score <= 120) {
        maxNum = 4;
    } else if (score > 120 && score <= 200) {
        maxNum = 5;
    } else if (score > 200 && score <= 300) {
        minNum = 2;
        maxNum = 5;
    } else if (score > 300 && score <= 420) {
        maxNum = 6;
    }
    */

    // AUTOMATIC AND AWESOME
    minNum = Math.floor(1) + 1
    maxNum = Math.floor(Math.pow(score, 0.34)) + 2

}