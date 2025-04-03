let cur_rand = 1;

// Rewrite
let configuration = {
    size: 5,
    timebw: 10,
}

total = configuration.size ** 2;
createGrid(configuration.size);

function createGrid(s) {
    let grid = document.querySelector(".grid");
    grid.innerHTML = ""; // Clear previous grid
    grid.style.gridTemplateColumns = `repeat(${s}, 1fr)`;
    grid.style.gridTemplateRows = `repeat(${s}, 1fr)`;
    for (let i = 0; i < s ** 2; i++) {
        let box = document.createElement("div");
        box.classList.add("box");
        grid.appendChild(box);
    }
}

let config = document.getElementById("config");
config.style.opacity = 1;
config.style.pointerEvents = "initial";
let size = document.getElementById("size");
let time = document.getElementById("time");
time = parseInt(time.value);
size = parseInt(size.value);
let start = document.getElementById("start");
start.addEventListener("click", function() {
    config.style.opacity = 0.1;
    config.style.top = "-100%";
    config.style.pointerEvents = "none";
    createGrid(size);
    total = size ** 2;
    startEventListener();
    
})


let grid = document.querySelector(".grid");


let boxes = document.getElementsByClassName("box");

grid.addEventListener("click", function(e) {
    if (e.target.className !== "box") {
        wrong(e.target);
    }
})
function initiateClock() {
    let gameClock = setInterval(() => {
        setRandom();
    }, time);
    return gameClock;
}
let gameClock = initiateClock();
let locked = false;

function startEventListener() {
    for (let i = 0; i <  boxes.length; i++) {
        boxes[i].addEventListener("click", function(e) {
            if (boxes[i].id == "selected") {
                if (!locked) {
                correct();
                }
            } else {
                wrong(e.target);
            }
        } );
    }
    setRandom();
}


function correct() {
    clearInterval(gameClock);
    setRandom();
    gameClock = initiateClock();
    updateScore(1);
}

function generateRandom(){
    for (let i = 0; i < boxes.length; i++) {
        if (boxes[i].id == "selected") {
            cur_rand = i;
            break;
        }
    }
    let random = cur_rand;
    while (cur_rand == random) {
        random = Math.floor(Math.random()*total);
    }
    return random;
}

function setRandom() {
    let random = generateRandom();
    Array.from(boxes).map(function(box) {
        box.removeAttribute("id");
    })
    boxes[random].setAttribute("id", "selected");

}
// function myfunc() {
//     let selected = document.getElementById("selected");
//     selected.removeAttribute("onclick");
//     selected.setAttribute("onclick","wrong()")
//     selected.removeAttribute("id");
//     setrandom();
//     updateScore();
// }
let body = document.getElementsByTagName("body");
let shake = document.querySelector(".shake");

function wrong(t) {
    shake.classList.add("shake-animation");
    t.setAttribute('id' , 'wrong');
    locked = true;
    shake.style.cursor = 'none';
    setTimeout(() => {
        shake.classList.remove("shake-animation");
        t.removeAttribute('id');
        locked = false;
        shake.style.cursor = 'auto';
    }, 1000);
    // setTimeout(() => {
    //     body[0].style.animationPlayState = 'paused';
    // }, 300);
    // body[0].style.cursor = 'none';
    // setTimeout(() => {
    //     body[0].style.cursor = 'auto'
    // }, 1500);
    
};

// let boxes = document.getElementsByClassName("box");

// function setrandom(){
//     let random = cur_rand;
//     while (random == cur_rand) {
//         random = Math.floor(Math.random()*9);

//     }
//     boxes[random].setAttribute("onclick","myfunc()");
//     boxes[random].setAttribute("id", "selected");
//     cur_rand = random;
// };


let thescore = 0

function updateScore(s) {
    let score = document.getElementById("score");
    let myscore = thescore += s;
    score.innerHTML = myscore;
}



 // 20 seconds
let timeLeft = 2000;
let isPaused = false;
let t = document.getElementById("timer");
let resume = document.getElementById("resume");
let pause = document.getElementById("pause");
let menuOuter = document.getElementById("menu-outer");

resume.addEventListener("click", function() {
    resumeGame();
})

function pauseAttribute(v) {
    if (v == "pause") {
        pause.style.opacity = 1;
        pause.style.pointerEvents= "initial";
        menuOuter.style.pointerEvents = "initial";
    } else if (v == "resume") {
        pause.style.opacity = 0.1;
        pause.style.pointerEvents= "none";
        menuOuter.style.pointerEvents = "none";
    }
}

let timer = setInterval(() => {
    if (!isPaused) {
        timeLeft--;
        
    } else {
    }
    t.innerHTML = timeLeft;
    if (timeLeft <= 0) {
        clearInterval(timer);
        endGame();
    }
}, 1000)

function resumeGame() {
    isPaused = false;
    t.innerHTML = timeLeft;
    pauseAttribute("resume");
}

document.addEventListener("keydown", function(e) {
    if (e.key === "Escape") {
        if (isPaused) {
            resumeGame();
        } else {
            isPaused = true;
            t.innerHTML = "PAUSED";
            pauseAttribute("pause");

        }
    }
}
    
    );

function endGame() {
    alert("The game is over! Your score is " + document.getElementById("score").innerHTML);
}

// startGame();
