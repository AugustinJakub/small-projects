const getUrl = "https://words.dev-apis.com/word-of-the-day"
const postUrl = "https://words.dev-apis.com/validate-word"

let word = ""
let puzzleNumber = 0
let guess = ""
let validWord = false
let currentRow = 0

const tiles = document.querySelectorAll(".tile")
const buttons = document.querySelectorAll(".keyboard-button")
const keyboardSection = document.querySelector(".keyboard-section")

async function getFetch(){
    const promise = await fetch(getUrl)
    const processedRespone = await promise.json()
    word = processedRespone.word
    puzzleNumber = processedRespone.puzzleNumber
}

async function postFetch(){
    const promise = await fetch(postUrl, {
        method: "POST",
        body: JSON.stringify({"word": guess })
    })
    const processedResponse = await promise.json()
    validWord = processedResponse.validWord
    return validWord

}

function isLetter(key) {
    return /^[a-zA-Z]$/.test(key)  
}

function updateScreen(){
    const startIndex = currentRow * 5

   
    for (let i = 0; i < 5; i++) {
        if(guess[i]!==""){
            tiles[startIndex + i].textContent = guess[i]
        } else{
            tiles[startIndex + i].textContent = ""
        }
    
    }
}

function colorTiles(){
    const startIndex = currentRow * 5
    let remainingLetters = []
    for(let l=0; l<5; l++){
        remainingLetters.push(word[l])
    }
    for(let i=0; i<5; i++){
        const currentTile = tiles[startIndex+i]
        const guessedLetter = guess[i]
        const correctLetter = word[i]
        if(guessedLetter === correctLetter){
            currentTile.classList.add("correct")
            let index = remainingLetters.indexOf(guessedLetter)
            remainingLetters.splice(index, 1)
            }
    }
     for(let i=0; i<5; i++){
        const currentTile = tiles[startIndex+i]
        const guessedLetter = guess[i]
        const correctLetter = word[i]
        if(word.includes(guessedLetter) && !currentTile.classList.contains("correct") && remainingLetters.includes(guessedLetter)){
            currentTile.classList.add("present")
            let index = remainingLetters.indexOf(guessedLetter)
            remainingLetters.splice(index, 1)
        }else if(!currentTile.classList.contains("correct") && !currentTile.classList.contains("present")){
            currentTile.classList.add("incorrect")
        }
    }

}

function colorButtons(){
    for(let i=0; i<5; i++){
        const guessedLetter = guess[i]
        const correctLetter = word[i]
        let targetButton 
        for(let j=0; j<buttons.length; j++){
            if(guessedLetter === buttons[j].textContent.toLowerCase() ){
                targetButton = buttons[j]
                break
            }
        }
        if(guessedLetter === correctLetter){
            targetButton.classList.remove("present") 
            targetButton.classList.add("correct")
        }else if(word.includes(guessedLetter) && !targetButton.classList.contains("correct")){
            targetButton.classList.add("present")           
        }else if(!targetButton.classList.contains("correct") && !targetButton.classList.contains("present")){
            targetButton.classList.add("incorrect")
        }

    }
}

async function keyboardListener(){
    document.addEventListener("keydown", async (event) =>{
        
        if(isLetter(event.key) && guess.length < 5){
            guess+=event.key
            updateScreen()
        }else if(event.key === "Enter" && guess.length===5){
            const isValid = await postFetch()
            if(!isValid){
                alert(`${guess} is not a valid word`)
            }else if(guess === word){
                colorTiles()
                colorButtons()
                alert("you won!!!!!")
                guess = ""
            }else if(currentRow < 5){
                colorTiles()
                colorButtons()
                currentRow += 1
                guess = ""
            }else{
                colorTiles()
                colorButtons()
                alert("you lost :(")
                guess = ""
            }
        }else if(event.key === "Backspace" && guess.length > 0){
            guess = guess.slice(0,-1)
            updateScreen()
        }
    })
}

async function buttonListener(){

    keyboardSection.addEventListener("pointerdown", async (event) =>{
        if(event.target.classList.contains("keyboard-button")){
            console.log(event.target.textContent)
        if(isLetter(event.target.textContent) && guess.length < 5){
            let smallLetter = event.target.textContent.toLowerCase()
            guess+=smallLetter
            updateScreen()
        }else if(event.target.textContent === "ENTER" && guess.length===5){
            const isValid = await postFetch()
            console.log(currentRow)
            if(!isValid){
                alert(`${guess} is not a valid word`)
            }else if(guess === word){
                colorTiles()
                colorButtons()
                alert("you won!!!!!")
                guess = ""
            }else if(currentRow < 5){
                colorTiles()
                colorButtons()
                currentRow += 1
                guess = ""
            }else{
                colorTiles()
                colorButtons()
                alert("you lost :(")
                guess = ""
            }
        }else if(event.target.classList.contains("backspace")&& guess.length > 0){
            guess = guess.slice(0,-1)
            updateScreen()
        }
        }
        
    })
}

function init(){
    getFetch()
    keyboardListener()
    buttonListener()
}

init()