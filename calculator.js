const buttonsContainer = document.querySelector('.buttons-container');
const buttons = buttonsContainer.querySelectorAll('.button');
const minDisplay = document.querySelector('.min-display');
const paragraphs = Array.from(document.querySelectorAll('.button p'));
const equals = buttonsContainer.querySelector('#equals');



buttonsContainer.addEventListener('click', (event) => {
    const target = event.target;
    if (target.classList.contains('button') || paragraphs.includes(target)) {

        textContent = target.textContent.trim();
        //check whether the button clicked represents a function
        //eg. clearing the display
        if (isAFunctionButton(textContent)) {
            handleFunctionButtons(textContent);

        } else {
            updateMinDisplay(textContent);
        }

        
        
    }
});
function updateMinDisplay(content) {
    if (textContent === 'CE') {
        minDisplay.textContent = '';
    } else {
        minDisplay.textContent += textContent;
    }
}

function isAFunctionButton(text) {
    //function symbols here refer to symbols that represent some actions
    //and are not meant to be displayed
    const functionSymbols = ['CE', '+/-', '='];
    return functionSymbols.includes(text);
}

function handleFunctionButtons(functionSymbol) {
    switch (functionSymbol) {
        case 'CE':
            clearMinDisplay();
            break;
        case '+/-':
            toggleSign();
            break;
        case '=':
            const [operand1, operand2, operator] = parseExpression();
            operate();
            break;

    }
}

function clearMinDisplay() {
    minDisplay.textContent = '';
}
function toggleSign() {
    let minContent = minDisplay.textContent;
    if (minContent[0] !== '+') {
        minContent = minContent.replace(/-/g, '');
        minDisplay.textContent = '+' + minContent;
    } else {
        minDisplay.textContent = '-' + minContent.slice(1);
    }
}

function operate(operand1, operand2, operator) {
    switch (operator) {
        case '+':
            add(operand1, operand2);
            break;
        case '-':
            substract(operand1, operand2);
            break;
        case 'x':
            multiply(operand1, operand2);
            break;
        case '/':
            divide(operand1, operand2);
            break;
    }
}

function add(operand1, operand2) {
    return operand1 + operand2;
}

function substract(operand1, operand2) {
    return operand1 - operand2;
}

function multiply(operand1, operand2) {
    return operand1 * operand2;
}

function divide(operand1, operand2) {
    return operand1 / operand2;
}