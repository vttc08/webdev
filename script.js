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

function endGame() {
    alert("The game is over! Your score is " + document.getElementById("score").innerHTML);
}

// startGame();
