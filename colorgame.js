function fRandomColorNumber() {
    return Math.round(0 + Math.random()*254)
}
function fRandomColor(alpha = false) {
    if (!alpha) return `rgb(${fRandomColorNumber()}, ${fRandomColorNumber()}, ${fRandomColorNumber()})`
    else return `rgba(${fRandomColorNumber()}, ${fRandomColorNumber()}, ${fRandomColorNumber()}, ${parseFloat(Math.random().toFixed(2))})`;
}
function rgbInverter(color, array=false) { //pass in rgb(x,y,z) and returns rgb(255-x, 255-y, 255-z) or [255-x, 255-y, 255-z] array
    let rgbArray = color.slice(color.indexOf('(') + 1, color.indexOf(')')).split(',')
    rgbArray = rgbArray.map(x => Math.abs(255-parseInt(x)))
    if(array) return rgbArray
    else if(!array) return `rgb(${rgbArray.join(',')})`
}
//rgbInverter above is only used when flash is clicked to try make the color the opposite of background but is only going to work well with increasing variation from 127

//all html attributes selected
let mainBox_el = document.getElementById('body')
//buttons seleted
let easy_btn = document.getElementsByClassName('easy-btn')[0]
let hard_btn = document.getElementsByClassName('hard-btn')[0]
let insane_btn = document.getElementsByClassName('insane-btn')[0]
let blink_el = document.getElementById("morph")

let specialColor_el = document.getElementById('specialColor')
let gamecount_el = document.getElementById('gameCount')
let scorecount_el = document.getElementById('scoreCount')
let status_el = document.getElementById('status')
let main_el = document.getElementById('main')

//game variables are affected by functions as they are not pure functions
let game_count = 0
let score = 0
let box_num
let mode = 'hard'
let blink = false
let blinkId
console.log(easy_btn)
function updateDisplayColor(color) {
    specialColor_el.innerText = `Color to find: ${color}`
}
function updateScore(value) {
    score = value
    scorecount_el.innerText = `Score Count: ${score}`
}
function updateGameCount(value) {
    game_count = value
    gamecount_el.innerText = `Game Count: ${game_count}`
}
function resetGame() {
    updateScore(0)
    updateGameCount(0)
}
async function insertBoxes(restart = false) {
    if (restart) {
        resetGame()
    }
    if (mode === 'easy') box_num = 3
    else if (mode === 'hard') box_num = 6
    else if (mode === 'insane') {
        box_num = 9
        try {
            clearInterval(blinkId)
            //reset background color of body back to black
            document.getElementById('mainbody').style["background-color"] = "white"
        }
        finally {
            //do nothing
        }//to make sure the blinking stops when the insane option is chosen and cannot be used as long as it is on insane mode
    }
    let specialColor
    //removes whatever is left over
    mainBox_el.innerHTML = ""
    let randomNum = Math.round(Math.random()*box_num)
    let color_alpha = mode==='insane' ? true : false;
    for (let i = 0; i < box_num; i++) {
        let created_el = document.createElement('div')
        created_el.style['background-color'] = fRandomColor(color_alpha ? true : false)
        if (randomNum === i) {
            specialColor = created_el.style['background-color']
            updateDisplayColor(specialColor)
        }
        created_el.classList.add("box", `box${i}`);
        //line below highlights the color in each element
        /* created_el.innerText = created_el.style['background-color'] */
        //add event listener to each child
        created_el.addEventListener('click', () => {
            if (created_el.style['background-color'] == specialColor) {
                /* console.log('clicked the right one') */
                //do whatever here
                updateScore(score + 1)
                updateGameCount(game_count + 1)
                //call function insertBoxes again since it is an asynchronous function, the caller will continue and terminate without waiting for a return value
                insertBoxes()
            }
            else {
                updateGameCount(game_count + 1)
                insertBoxes()
            }
            status_el.innerText = created_el.style['background-color'] == specialColor ? 'Correct' : 'Incorrect'
            status_el.style['top'] = '40px'
            setTimeout(() => (status_el.style["top"] = "-100px"), 1300);
            
        })
        //add the child element to the main. this can be placed above the event listener definition
        mainBox_el.appendChild(created_el)
    }
}
//add event listener for color change component
function willBlink() {
    if (!blink && mode != "insane") {
      blink = true;
      blinkId = setInterval(() => {
        let color = fRandomColor();
        main_el.style["background-color"] = color;
        main_el.style["color"] = rgbInverter(color);
      }, 2400);
    } else {
      blink = false;
      clearInterval(blinkId);
    }
}
blink_el.addEventListener('click', willBlink)
easy_btn.addEventListener('click', () => { mode = 'easy'; insertBoxes(true) })
hard_btn.addEventListener('click', () => { mode = 'hard'; insertBoxes(true) })
insane_btn.addEventListener('click', () => { mode = 'insane'; insertBoxes(true) })
insertBoxes()//delete after completion

/* document.getElementById('body').innerText = fRandomColor() */ //A simple test for the output of the color component

