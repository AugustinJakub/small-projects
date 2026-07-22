// todo:
// implement % sign to have many use cases 
// make spanTotal maybe a bit bigger so more values are visible

//allows users on mobile to see animations
document.addEventListener("touchstart",function(){},true)

//global variables 
let currentValue = ""
let historyValue = ""
let tmp = ""

//buttons used for watching every button with eventlistener
const buttons = document.querySelectorAll(".btn")
//bigger number in calculator that displays total
const spanTotal = document.querySelector(".current-total")
//history of calculating displayed over total
const spanHistory = document.querySelector(".history")

function calculate(first,symbol,second){
    if (symbol === "+"){
        return +first + +second
    }
    if (symbol === "-"){
        return +first - +second
    }
    if (symbol === "×"){
        return +first * +second
    }
    if(symbol === "÷"){
        return +first / +second
    }
}


buttons.forEach(btn=> {
    btn.addEventListener("pointerdown", (e=>{
        console.log(e.currentTarget.classList)
        //numbers buttons implementation
        if(e.currentTarget.classList.contains("number")){
            if (currentValue === "0"){
                currentValue = ""
            }
            currentValue += e.currentTarget.textContent
            spanTotal.textContent = currentValue
            

        } 
        //equal sign implementation
        else if(e.currentTarget.classList.contains("eq-btn")){
            let tokens = []
            let currentNum = ""
            for(let i=0; i<currentValue.length; i++){
                if(!"1234567890.".includes(currentValue[i]) || i === 0 && currentValue[i]==="-"){
                    tokens.push(currentNum)
                    tokens.push(currentValue[i])
                    currentNum = ""
                }
                else{
                    currentNum += currentValue[i]
                }
            }
            if (currentNum !== ""){
                tokens.push(currentNum)
            }
            
            while(tokens.includes("×") || tokens.includes("÷")){
                let i = tokens.findIndex(t => t == "×" || t == "÷")
                tmp = calculate(tokens[i-1], tokens[i], tokens[i+1])
                tokens.splice(i-1, 3, tmp)
            }

            while(tokens.includes("+") || tokens.includes("-")){
                let i = tokens.findIndex(t => t == "+" || t == "-")
                tmp = calculate(tokens[i-1], tokens[i], tokens[i+1])
                tokens.splice(i-1, 3, tmp)
            }
            spanTotal.innerText = tokens[0]
            spanHistory.innerText = currentValue

        }
        //backspace button implementation
        else if(e.currentTarget.classList.contains("backspace-btn")){
            if (currentValue !== "0"){
                currentValue = currentValue.slice(0,-1)
                
            }
            if(currentValue === ""){
                currentValue = "0"
            }
            spanTotal.innerText = currentValue

        }
        //ac clear button implementation
        else if(e.currentTarget.classList.contains("ac-btn")){
            currentValue = "0"
            historyValue = "history"
            spanTotal.innerText = currentValue
            spanHistory.innerText = historyValue

        }
        //all sign opperations buttons implementation
        else if(e.currentTarget.classList.contains("sign")){
            if(!"-+×÷%".includes(currentValue.at(-1))){
                currentValue += e.currentTarget.textContent
            }
            spanTotal.textContent = currentValue

        }
        //coma button implementation
        else if(e.currentTarget.classList.contains("coma-btn")){
            let splitValues = currentValue.split(/[-+×÷%]/);
            if(!splitValues.at(-1).includes(".") && splitValues.at(-1) !== ""){
                currentValue+= "."
            }
            spanTotal.innerText = currentValue
        }
        //changing sign button at the begining button implementation
        else if(e.currentTarget.classList.contains("plus-minus-btn")){
            
            if(currentValue.at(0)==="-"){
                currentValue = currentValue.slice(1)
            }
            else{
                currentValue = "-" + currentValue
            }
            spanTotal.innerText = currentValue
        }

    }))
})