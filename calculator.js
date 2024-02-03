const buttonsContainer = document.querySelector('.buttons-container');
const buttons = buttonsContainer.querySelectorAll('.button');
const minDisplay = document.querySelector('.min-display');
const paragraphs = Array.from(document.querySelectorAll('.button p'));
const equals = buttonsContainer.querySelector('#equals');
const maxDisplay = document.querySelector('.max-display-content');
const equalSymbol = document.querySelector('.equals-symbol');
const MAX_NUMBER = 9999999999;




buttonsContainer.addEventListener('click', (event) => {
    const target = event.target;
    if (target.classList.contains('button') || paragraphs.includes(target)) {

        textContent = target.textContent.trim();
        if (maxDisplay.textContent !== '') {
            minDisplay.textContent = maxDisplay.textContent;
            clearMaxDisplay();
        }
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
    const functionSymbols = ['CE', '+/-', '=', '←'];
    return functionSymbols.includes(text);
}

function handleFunctionButtons(functionSymbol) {
    switch (functionSymbol) {
        case 'CE':
            clearMinDisplay();
            clearMaxDisplay();
            minDisplay.parentElement.style.borderTop = '';
            toggleEqualDisplay();
            break;
        case '+/-':
            toggleSign();
            break;
        case '=':
            if (isValidExpression(minDisplay.textContent)) {
                const [operand1, operand2, operator] = parseExpression();
                operate(operand1, operand2, operator);
                //creates a line between the min and max display
                createSeperationLine();
            }
            break;
        case '←':
            deleteLastCharacter();
            break;

    }
}

function isValidExpression(expression) {
    const regex = /(-?[.\d]+)([\+-\/x])(-?\+?[.\d+])/;
    return regex.test(expression);
    
}

function clearMinDisplay() {
    minDisplay.textContent = '';
}
function toggleSign() {
    let minContent = minDisplay.textContent;
    if (minContent[0] == '-') {
        // minContent = minContent.replace(/-/g, '');
        minDisplay.textContent = minContent.slice(1);

    } else {
        minDisplay.textContent = '-' + minContent;
    }
}

function operate(operand1, operand2, operator) {
    operand1 = +operand1;
    operand2 = +operand2;
    let result = '';
    switch (operator) {
        case '+':
            result += add(operand1, operand2);
            break;
        case '-':
            result += substract(operand1, operand2);
            break;
        case 'x':
            result += multiply(operand1, operand2);
            break;
        case '/':
            result += divide(operand1, operand2);
            break;
    }
    updateMaxDisplay(result);
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

function parseExpression() {
    let minContent = minDisplay.textContent;
    let regex = /(-?[.\d]+)([\+-\/x])(-?\+?[.\d+])/;
    let [, operand1, operator, operand2] = regex.exec(minContent);
    return [operand1, operand2, operator];
}

function updateMaxDisplay(content) {
    content = +content;
    if (content > MAX_NUMBER) {
        content = content.toExponential(3);
    } else {
        content = +content.toFixed(4);
    }
    
    maxDisplay.textContent = content;
    toggleEqualDisplay();
}

function clearMaxDisplay() {
    maxDisplay.textContent = '';

    toggleEqualDisplay();
}

function createSeperationLine() {
    minDisplay.parentElement.style.borderTop = '1px solid white';
}

function toggleEqualDisplay() {
    console.log(maxDisplay.textContent === '');
    if (maxDisplay.textContent === '') {
        equalSymbol.textContent = '';
    } else {
        equalSymbol.textContent = '=';
    }
}

function deleteLastCharacter() {
    let updatedMinContent = minDisplay.textContent.slice(0, -1);
    minDisplay.textContent = updatedMinContent;
}