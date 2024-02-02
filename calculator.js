const buttonsContainer = document.querySelector('.buttons-container');
const buttons = buttonsContainer.querySelectorAll('.button');
const minDisplay = document.querySelector('.min-display');
const paragraphs = Array.from(document.querySelectorAll('.button p'));





buttonsContainer.addEventListener('click', (event) => {
    const target = event.target;
    console.log(target.classList);
    if (target.classList.contains('button') || paragraphs.includes(target)) {
        console.log(target.textContent);
        if (target.textContent.trim() === 'CE') {
            minDisplay.textContent = '';
        } else {
            minDisplay.textContent += target.textContent.trim();
        }
    }
});