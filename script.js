let cur_rand = 1; // intialize the random number
let lives = 3;

// Initial default Configuration
let configuration = {
        size: 3,       
        time: 2000,   
        gametime: 20   
}

// Cursor styles for different themes
let cursor = {
    mole: "mallet",
    trainer: "hit",
    python: "shell",
    golang: "shell",
    rust: "shell",
}

let total = configuration.size ** 2; // total number of boxes
createGrid(configuration.size);

function createGrid(s) {
    // Create a s by s grid of boxes 
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

// Customized Configuration
let config = document.getElementById("config"); // config menu
config.style.pointerEvents = "initial";
let start = document.getElementById("start");
let time = document.getElementById("time"); // idk why putting it here works but for size it doesn't
let gametime = document.getElementById("gametime");
// Initialize everything when clicking start button

//I broke start.addEventListener into functions to improve efficiency

//reads size, time, gametime
function getConfigValues() {
    return {
        size: parseInt(document.getElementById("size").value),
        time: parseInt(document.getElementById("time").value),
        gametime: parseInt(document.getElementById("gametime").value)
    };
}

//hides configuration when added to an eventListener function
function hideConfigMenu() {
    config.style.display = "none";
    config.style.pointerEvents = "none";
}

//changes lives values and resets them back to 3
function resetLives() {
    lives = 3;
    updateLives();
}

//choose whichever cursor/target you want
function setCursorAndTheme() {
    const moleTheme = document.getElementById("mole_theme").value;
    cursorStyle = cursor[moleTheme];
    grid.style.cursor = `url("${cursorStyle}.png"), auto`;
    updateTheme(moleTheme);
}

//initializes the game based on the player's preferences
function startGame(configValues) {
    createGrid(configValues.size);
    total = configValues.size ** 2;
    time = configValues.time;
    gametime = configValues.gametime;
    timeLeft = gametime;
    isPaused = false;

    startEventListener();
    gc();
    startTimer();

    resetLives();
    setCursorAndTheme();
}

//hides configuration when start is clicked
start.addEventListener("click", function() {
    const configValues = getConfigValues();
    hideConfigMenu();
    startGame(configValues);
});


// Initialize main game elements
let grid = document.querySelector(".grid");
let locked = false;
let boxes = document.getElementsByClassName("box");
let body = document.getElementsByTagName("body");
let shake = document.querySelector(".shake");

function updateTheme(moleStyle) {
    // update mole and cursor style using CSS variables
    var r = document.querySelector(':root');
    r.style.setProperty('--url', `url("${moleStyle}.png")`);
};

grid.addEventListener("click", function(e) {
    // Function when clicking on the grid
    // if it's not the right box, it's wrong
    grid.style.cursor = `url("${cursorStyle}-hit.png"), auto`;
    if (!e.target.className.includes("box")) {
        wrong(e.target);
    } 
    // When clicking on the grid, change the cursor to the hit cursor
    setTimeout(() => {
        grid.style.cursor = `url("${cursorStyle}.png"), auto`;
    }, 250);
})

function initiateClock() {
    // Mole appearance interval
    let gameClock = setInterval(() => {
        setRandom();
    }, time);
    return gameClock;
}

function gc() {
    gameClock = initiateClock();
}

function startEventListener() {
    // Event listener for each box
    for (let i = 0; i <  boxes.length; i++) {
        boxes[i].addEventListener("click", function(e) {
            // Only score if the box is right one and cursor is not locked
            if (boxes[i].id == "selected") {
                if (!locked) {
                correct();
                }
            } else {
                wrong(e.target);
            }
        } );
    }
    setRandom(); // begin re-randomization
}


function correct() {
    // What happens when the right box is clicked
    clearInterval(gameClock); // reset the clock
    setRandom(); // re-randomize
    gameClock = initiateClock();
    updateScore(1);
}

function generateRandom(){
    // Generate a random number
    for (let i = 0; i < boxes.length; i++) {
        if (boxes[i].id == "selected") {
            cur_rand = i;
            break;
        }
    }
    let random = cur_rand;
    while (cur_rand == random) {
        // prevent the same box from being selected again
        random = Math.floor(Math.random()*total);
    }
    return random;
}

function setRandom() {
    // Set a random box to be the selected one
    let random = generateRandom();
    Array.from(boxes).map(function(box) {
        box.removeAttribute("id");
    }) // clear game grid
    boxes[random].setAttribute("id", "selected"); // set the selected box
    boxes[random].classList.add("selected-ain"); // fade-in animation
    let dur = Math.min(time/2, 1000);
    setTimeout(() => {
        boxes[random].classList.remove("selected-ain");
    }, dur); // remove fade-in animation
}

function wrong(t) {
    // What happens when the wrong box is clicked
    if (locked) return; // not penalize if already locked
    lives--; // reduce lives
    updateLives();
    // shake the game grid and lock cursor
    shake.classList.add("shake-animation");
    t.setAttribute('id' , 'wrong');
    locked = true;
    shake.style.cursor = 'none';
    setTimeout(() => {
        shake.classList.remove("shake-animation");
        t.removeAttribute('id');
        locked = false;
        shake.style.cursor = `url("${cursorStyle}.png"), auto`;;
    }, 1000); // restore game grid after 1 second
    
    updateScore(-1);

    if (lives <= 0) {
        endGame(); // lives run out, end game
    }
}

function updateLives() {
    // Update the lives display
    let livesContainer = document.getElementById("lives");
    livesContainer.innerHTML = ""; // clear previous hearts

    for (let i = 0; i < lives; i++) {
        let img = document.createElement("img");
        img.src = "heart.png"; 
        img.classList.add("heartpic");
        livesContainer.appendChild(img);
    }
}

// Initialize game score
let thescore = 0;

function updateScore(s) {
    // Add or subtract score and display it
    let score = document.getElementById("score");
    let myscore = thescore += s;
    score.innerHTML = myscore;
}

// Initalize timer and menu
let timeLeft = "";
let isPaused = true;
let t = document.getElementById("timer");
let resume = document.getElementById("resume");
let pause = document.getElementById("pause");
let menuOuter = document.getElementById("menu-outer");

// Pause menu resume button
resume.addEventListener("click", function() {
    resumeGame();
})

function pauseAttribute(v) {
    // Switch between pause and resume
    if (v == "pause") {
        pause.style.opacity = 1;
        pause.style.pointerEvents= "initial";
        menuOuter.style.pointerEvents = "initial";
    } else if (v == "resume") {
        pause.style.opacity = 0;
        pause.style.pointerEvents= "none";
        menuOuter.style.pointerEvents = "none";
    }
}

let giantMoleAppeared = false;
let cdBar = document.getElementById("countdown-bar");

function startTimer(){
    // Start the countdown timer
    let timer = setInterval(() => {
        if (!isPaused) {
            timeLeft--;
        } else {
        };
        t.innerHTML = timeLeft;
        cdBar.style.width = `${(timeLeft / gametime) * 90}%`; // bar originally starts at width 90%
        if (timeLeft < 5) { // change color when less than 5 seconds left
            cdBar.style.backgroundColor = "red";
            cdBar.style.backgroundImage = "none";
        }
        if (timeLeft <= 0) {
            clearInterval(timer);
            endGame();
        }
        // Giant mole appear when score is between 10 and 15
        // fix bug where giant mole do not appear when score change from 10 to 11 before game clock update
        if (thescore >= 10 && thescore <= 15) {
            if (!giantMoleAppeared) {
                giantMoleAppeared = true; // prevent giant reappearing
                giantmoleappear();
            }
        }
    }, 1000)
}

function giantmoleappear() {
    // Make giant mole appear 
    clearInterval(gameClock); // 停止小地鼠 (stop the small mole)
    Array.from(boxes).forEach(box => box.removeAttribute("id"));

    // 显示大地鼠 (show the giant mole)
    let mole = document.getElementById("giant");
    mole.style.top = "0";
    mole.style.left = "0";

    // 3秒后隐藏大地鼠，恢复小地鼠 after 3s hide giant mole and resume small mole
    setTimeout(() => {
        mole.style.top = "-100vh";
        mole.style.left = "100vw";
        setRandom(); // 重新设置随机地鼠 re-randomize the mole
        gameClock = initiateClock(); // 重启刷新计时器 restart the clock
    }, 3000);
}

function resumeGame() {
    // Reume on button click
    isPaused = false;
    t.innerHTML = timeLeft;
    pauseAttribute("resume");
}

document.addEventListener("keydown", function(e) {
    if (e.key === "Escape") {
        // Escape to pause
        if (isPaused) {
            resumeGame();
        } else {
            isPaused = true;
            t.innerHTML = "PAUSED";
            pauseAttribute("pause");

        }
    }
    if (e.key === "F12") {
        // F12 to end game
        endGame();
        e.preventDefault(); // prevent dev tools from opening
    }
});

function endGame() {
    alert("The game is over! Your score is " + document.getElementById("score").innerHTML);
    window.location.reload();
}
