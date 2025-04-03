let cur_rand = 0;

function myfunc() {
    let selected = document.getElementById("selected");
    selected.removeAttribute("onclick");
    selected.setAttribute("onclick","wrong()")
    selected.removeAttribute("id");
    setrandom();
    updateScore();
}
let body = document.getElementsByTagName("body");

function wrong() {
    body[0].style.animationPlayState = 'running';
    setTimeout(() => {
        body[0].style.animationPlayState = 'paused';
    }, 300);
    body[0].style.cursor = 'none';
    setTimeout(() => {
        body[0].style.cursor = 'auto'
    }, 1000);
    
};

let boxes = document.getElementsByClassName("box");

function setrandom(){
    let random = cur_rand;
    while (random == cur_rand) {
        random = Math.floor(Math.random()*9);

    }
    boxes[random].setAttribute("onclick","myfunc()");
    boxes[random].setAttribute("id", "selected");
    cur_rand = random;
};

boxes[0].setAttribute("onclick","myfunc()");
boxes[0].setAttribute("id", "selected");

let thescore = 0

function updateScore() {
    let score = document.getElementById("score");
    let myscore = thescore += 1;
    score.innerHTML = myscore;
}

function startGame() {
    setTimeout(() => {
        endGame();
    }, 20000);
}


let timeLeft = 2000; // 20 seconds
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
