const buttonsContainer = document.querySelector('.buttons-container');
const buttons = buttonsContainer.querySelectorAll('.button');
const minDisplay = document.querySelector('.min-display');
const paragraphs = Array.from(document.querySelectorAll('.button p'));
const equals = buttonsContainer.querySelector('#equals');



buttonsContainer.addEventListener('click', (event) => {
    const target = event.target;
    if (target.classList.contains('button') || paragraphs.includes(target)) {

        textContent = target.textContent.trim();
        if (isAnOperator(textContent)) {
            
        }

        updateMinDisplay(textContent);
        
    }
});
function updateMinDisplay(content) {
    if (textContent === 'CE') {
        minDisplay.textContent = '';
    } else {
        minDisplay.textContent += textContent;
    }
}

function isAnOperator(character) {
    const operators = ['+', '-', '/', 'x', '%', '+/-', '='];
    return operators.includes(character);
}