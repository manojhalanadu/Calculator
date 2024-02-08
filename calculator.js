const buttonsContainer = document.querySelector(".buttons-container");
const buttons = buttonsContainer.querySelectorAll(".button");
const minDisplay = document.querySelector(".min-display");
const paragraphs = Array.from(document.querySelectorAll(".button p"));
const equals = buttonsContainer.querySelector("#equals");
const maxDisplay = document.querySelector(".max-display-content");
const equalSymbol = document.querySelector(".equals-symbol");
const MAX_NUMBER = 9999999999;
const keysToBeMapped = ["Backspace", "Delete", "Enter", "*"];
const validKeys = [
  "0",
  "1",
  "2",
  "3",
  "4",
  "5",
  "6",
  "7",
  "8",
  "9",
  "+",
  "-",
  "/",
  "x",
  "CE",
  ".",
  "←",
];

buttonsContainer.addEventListener("click", (event) => {
  const target = event.target;
  let textContent = target.textContent.trim();
  if (target.classList.contains("button") || paragraphs.includes(target)) {
    if (isAnOperator(textContent)) {
      return handleAnOperator(textContent);
    }

    // if (maxDisplay.textContent !== "") {
    //   minDisplay.textContent = maxDisplay.textContent;
    //   clearMaxDisplay();
    // }
    //check whether the button clicked represents a function
    //eg. clearing the display
    if (isAFunctionButton(textContent)) {
      handleFunctionButtons(textContent);
    } else {
      updateMinDisplay(textContent);
    }
  }
});

function handleAnOperator(operator) {
  let expression = minDisplay.textContent;

  if (isValidExpression(expression)) {
    updateMinDisplay(operator);
    return handleValidExpression(expression);
  } else {
    return updateMinDisplay(operator);
  }
}

function mapKey(key) {
  switch (key) {
    case "Delete":
      return "CE";
    case "Enter":
      return "=";
    case "Backspace":
      return "←";
    case "*":
      return "x";
  }
}

document.body.addEventListener("keydown", (event) => {
  let key = event.key;

  // if (maxDisplay.textContent !== "") {
  //   minDisplay.textContent = maxDisplay.textContent;
  //   clearMaxDisplay();
  // }
  if (keysToBeMapped.includes(key)) {
    key = mapKey(key);
  }

  if (isAnOperator(key)) {
    return handleAnOperator(key);
  }
  //check whether the button clicked represents a function
  //eg. clearing the display
  if (isAFunctionButton(key)) {
    handleFunctionButtons(key);
  } else if (validKeys.includes(key)) {
    updateMinDisplay(key);
  }
});

function isAnOperator(string) {
  const operators = ["+", "-", "/", "x"];

  return operators.includes(string);
}

function updateMinDisplay(content) {
  if ( isMinDisplayContentExceeding() ) {
    return;
  }

  if (content === "CE") {
    minDisplay.textContent = "";
  } else {
    minDisplay.textContent += content;
  }
}

function isMinDisplayContentExceeding() {
  const minContentLength = minDisplay.textContent.length;
  return minContentLength > 20;
}

function isAFunctionButton(text) {
  //function symbols here refer to symbols that represent some actions
  //and are not meant to be displayed
  const functionSymbols = ["CE", "+/-", "=", "←"];
  return functionSymbols.includes(text);
}

function handleFunctionButtons(functionSymbol) {
  switch (functionSymbol) {
    case "CE":
      clearMinDisplay();
      clearMaxDisplay();
      removeSeperationLine();
      toggleEqualDisplay();
      break;
    case "+/-":
      toggleSign();
      break;
    case "=":
      if (isValidExpression(minDisplay.textContent)) {
        handleValidExpression(minDisplay.textContent);
      } else if (minDisplay.textContent != '') {
        handleInvalidExpression();
      }
      break;
    case "←":
      deleteLastCharacter();
      break;
  }
}

function handleValidExpression(expression) {
  const [operand1, operand2, operator] = parseExpression(expression);
  operate(operand1, operand2, operator);
  //creates a line between the min and max display
  createSeperationLine();
}

function handleInvalidExpression() {
  // maxDisplay.style.fontSize = "1rem";
  maxDisplay.textContent = "Invalid";

  setTimeout(() => {
    clearMaxDisplay();
    // clearMinDisplay();
    removeSeperationLine();
    // maxDisplay.style.fontSize = "2rem";
  }, 2000);
}

function isValidExpression(expression) {
  // let regex = /^([+-]?(\d+)?(\.\d+)?(e[+-]?\d+)?)([+/x-])([+-] ? (\d+)?(\.\d +)?)$/;
  const regex = new RegExp(
    "^([+-]?(\\d+)?(\\.\\d+)?(e[+-]?\\d+)?)" +
      "([+/x-])" +
      "([+-]?(\\d+)?(\\.\\d+)?)$"
  );
  return regex.test(expression);
}

function clearMinDisplay() {
  minDisplay.textContent = "";
}

function toggleSign() {
  let minContent = minDisplay.textContent;
  if (minContent[0] == "-") {
    // minContent = minContent.replace(/-/g, '');
    minDisplay.textContent = minContent.slice(1);
  } else {
    minDisplay.textContent = "-" + minContent;
  }
}

function operate(operand1, operand2, operator) {
  operand1 = +operand1;
  operand2 = +operand2;
  let result = "";
  if (operator === "/" && operand2 === 0) {
    return throwSnarkyComment();
  }
  switch (operator) {
    case "+":
      result += add(operand1, operand2);
      break;
    case "-":
      result += substract(operand1, operand2);
      break;
    case "x":
      result += multiply(operand1, operand2);
      break;
    case "/":
      result += divide(operand1, operand2);
      break;
  }
  updateMaxDisplay(result);

  if (isAnOperator(minDisplay.textContent.slice(-1))) {
    minDisplay.textContent =
      maxDisplay.textContent + minDisplay.textContent.slice(-1);
  } else {
    minDisplay.textContent = maxDisplay.textContent;
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

function parseExpression(expression) {
  const regex = new RegExp(
    "^([+-]?(\\d+)?(\\.\\d+)?(e[+-]?\\d+)?)" +
      "([+/x-])" +
      "([+-]?(\\d+)?(\\.\\d+)?)$"
  );
  let [, operand1, , , , operator, operand2] = regex.exec(expression);
  return [operand1, operand2, operator];
}

function updateMaxDisplay(content) {
  content = +content;

  if (content > MAX_NUMBER) {
    content = content.toExponential(3);
  } else {
    content = +content.toFixed(4);
  }

   if ((content+"").length > 10) {
     reduceMaxDisplayFontSize();
   } else {
     increaseMaxDisplayFontSize();
   }

  maxDisplay.textContent = content;
  toggleEqualDisplay();
}

function reduceMaxDisplayFontSize() {
  maxDisplay.style.fontSize = '1.5rem';
}

function increaseMaxDisplayFontSize() {
  maxDisplay.style.fontSize = '2rem';
}

function clearMaxDisplay() {
  maxDisplay.textContent = "";

  toggleEqualDisplay();
}

function createSeperationLine() {
  minDisplay.parentElement.style.borderTop = "1px solid white";
}

function removeSeperationLine() {
  minDisplay.parentElement.style.borderTop = "";
}

function toggleEqualDisplay() {
  if (maxDisplay.textContent === "") {
    equalSymbol.textContent = "";
  } else {
    equalSymbol.textContent = "=";
  }
}

function deleteLastCharacter() {
  let updatedMinContent = minDisplay.textContent.slice(0, -1);
  minDisplay.textContent = updatedMinContent;
}

function throwSnarkyComment() {
  maxDisplay.textContent = "Nice try!,but";
  minDisplay.textContent = "can't devide a number by 0";
  setTimeout(() => {
    clearMaxDisplay();
    clearMinDisplay();
  }, 2000);
}
