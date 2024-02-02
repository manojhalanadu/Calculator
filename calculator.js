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