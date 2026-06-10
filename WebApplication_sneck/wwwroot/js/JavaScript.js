
// constants & variables
let inputdir = { x: 0, y: 0 };
let LastPaintTime = 0;
let speed = 4;
let sneckArr = [
    { x: 6, y: 8 },
  
];
let board = document.getElementById("board");
let food = { x: 16, y: 10 };
let score = 0;
let scoreBox = document.getElementById("scoreBox");
let isPaused = false;
const loosesound = new Audio("/sounds/freesound_community-game-over-arcade-6435.mp3");
const foodsound = new Audio("/sounds/food.mp3.mp3");
const pousesound = new Audio("/sounds/pouse.mp3");
const bgsound = new Audio("/sounds/backgroundmusicforsneck.mp3");
const turnsound = new Audio("/sounds/sneckturn.mp3");
bgsound.loop = true;
bgsound.volume = 0.3;
let musicStarted = false;
let gamestarted = false;
let isboost = false;

//functions
function main(ctime) {
    window.requestAnimationFrame(main);
    let currentSpeed = isboost ? speed * 2 : speed;
    if ((ctime - LastPaintTime) / 1000 < 1 / currentSpeed) {
        return;
    }
    LastPaintTime = ctime;
    if (isPaused) {
       
        return;
    } 
    gameEngine();
}

function isCollide(sneck) {
    //if sneck touch body
    for (let i = 1; i < sneck.length; i++) {
        if (sneck[i].x === sneck[0].x && sneck[i].y === sneck[0].y) {
            return true;
        }
    }

    // if sneck touch the wall
    if (sneck[0].x >= 20 || sneck[0].x <= 0 || sneck[0].y >= 20 || sneck[0].y <= 0) {
        return true;
    }
    return false; 
}

function gameEngine() {
    // if sneck touch the wall & body
    if (isCollide(sneckArr)) {
        inputdir = { x: 0, y: 0 };
         sneckArr = [
            { x: 6, y: 8 },
        ];
        bgsound.pause();
        musicStarted = false;
        loosesound.play();
        document.getElementById("gameOverPopup").style.display = "block";
        speed = 4;
        score = 0;
        scoreBox.innerHTML = score;
    }

    //If You Have Eaten The Food , Increment The Score And Regenerete The food.
    if (sneckArr[0].x === food.x && sneckArr[0].y === food.y) {
        sneckArr.unshift({ x: sneckArr[0].x + inputdir.x, y: sneckArr[0].y + inputdir.y });
        let a = 2;
        let b = 19;
        food = { x: Math.round(a + (b - a) * Math.random()), y: Math.round(a + (b - a) * Math.random()) };
        score += 1;
        // speed up
        //if (score % 4 === 0) {
        //    speed += 1;
        //}
        speed += 0.25;
        scoreBox.innerHTML = score;
        foodsound.play();
    }

    //Move The Sneck
    for (let i = sneckArr.length - 2; i >= 0; i--) {
        sneckArr[i + 1] = { ...sneckArr[i] };
    }
    sneckArr[0].x += inputdir.x;
    sneckArr[0].y += inputdir.y;


    //display sneck
    board.innerHTML = "";
    sneckArr.forEach((e, index) => {
        sneckElement = document.createElement('div');
        sneckElement.style.gridRowStart = e.y;
        sneckElement.style.gridColumnStart = e.x;
        if (index === 0) {
            sneckElement.classList.add('head');
        }
        else {
            sneckElement.classList.add('sneck');
        }
        
        board.appendChild(sneckElement);
    })


    //display food
    
    foodElement = document.createElement('div');
  
    foodElement.style.gridRowStart = food.y;
    foodElement.style.gridColumnStart = food.x;
    foodElement.classList.add('food');
    board.appendChild(foodElement);
    
}


window.requestAnimationFrame(main)
window.addEventListener('keydown', e => {
    if (
        e.code === "ArrowUp" ||
        e.code === "ArrowDown" ||
        e.code === "ArrowLeft" ||
        e.code === "ArrowRight"
    ) {
        isboost = true;
    }

    //code run only frist keydown
    if (!musicStarted &&
        (
            e.code === "ArrowUp" ||
            e.code === "ArrowDown" ||
            e.code === "ArrowLeft" ||
            e.code === "ArrowRight"
        )) {
        document.getElementById("gameOverPopup").style.display = "none";
        bgsound.currentTime = 0;
        bgsound.play();
        musicStarted = true;
    }
    switch (e.code) {
        case "ArrowUp":
            if (inputdir.y !== 1) {
                inputdir.x = 0;
                inputdir.y = -1;
                turnsound.play();
            }
            break;

        case "ArrowDown":
            if (inputdir.y !== -1) {
                inputdir.x = 0;
                inputdir.y = 1;
                turnsound.play();
            }
            break;

        case "ArrowLeft":
            if (inputdir.x !== 1) {
                inputdir.x = -1;
                inputdir.y = 0;
                turnsound.play();
            }
            break;

        case "ArrowRight":
            if (inputdir.x !== -1) {
                inputdir.x = 1;
                inputdir.y = 0;
                turnsound.play();
            }
            break;

        case "Space":
            if (!musicStarted) break; // don't pause before game starts  
            pousesound.play();
            isPaused = !isPaused;//it will reverse value 
            if (isPaused) {
                bgsound.pause()
            }
            else {
                bgsound.currentTime = 0;
                bgsound.play();
                musicStarted = true;
            }
            break;

       

        default:
            break;
    }
})

window.addEventListener("keyup", e => {

    if (
        e.code === "ArrowUp" ||
        e.code === "ArrowDown" ||
        e.code === "ArrowLeft" ||
        e.code === "ArrowRight"
    ) {
        isboost = false;
    }
});

