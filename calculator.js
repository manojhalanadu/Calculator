const buttonsContainer = document.querySelector(".buttons-container");
const buttons = buttonsContainer.querySelectorAll(".button");
const minDisplay = document.querySelector(".min-display");
const paragraphs = Array.from(document.querySelectorAll(".button p"));
const equals = buttonsContainer.querySelector("#equals");
const maxDisplay = document.querySelector(".max-display-content");
const equalSymbol = document.querySelector(".equals-symbol");
const MAX_NUMBER = 999999999;
const keysToBeMapped = ["Backspace", "Delete", "Enter", "*"];
const operators = ["+", "-", "/", "x"];
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
  let characterEntered = target.textContent.trim();

  //making sure the element clicked is either the inner most
  //paragraph element or it's container div element
  if (target.classList.contains("button") || paragraphs.includes(target)) {
    if (isAnOperator(characterEntered)) {
      const minContent = minDisplay.textContent;

      //if minContent ends with a digit and not an operator,
      //we simply handle the operator without concerning ourselves
      //about operator chaining
      if (/\d/.test(minContent.slice(-1))) {
        return handleAnOperator(characterEntered);
      } else {
        return handleOperatorChaining(characterEntered);
      }
    }
    if (isAFunctionButton(characterEntered)) {
      handleFunctionButtons(characterEntered);
    } else {
      updateMinDisplay(characterEntered);
    }
  }
});

function handleOperatorChaining(operator) {
  let minContent = minDisplay.textContent;

  if (isInvalidOperatorChaining(operator)) {
    //if the character entered is an operator and the
    //expression is already waiting for an operand (i.e invalid
    //operator chaining e.g 8 x /.), we simply
    //return from the function
    return;
  } else {
    minDisplay.innerHTML = minDisplay.innerHTML + "-";
    return;
  }
}

function isInvalidOperatorChaining(operator) {
  const minContent = minDisplay.textContent;

  if (
    (/\s[+x/-]\s/.test(minContent.slice(-3)) && operator != "-") ||
    /\s[+/x-]\s\-/.test(minContent.slice(-4))
  ) {
    return true;
  }
  //if unary '-' is used in order to negate the sign of
  //the second operator, this is not considered as an invalid
  //operator chaining. e.g 8 x -1
  else if (/\s[+x/-]\s/.test(minContent.slice(-3))
  && operator === "-") {
    return false;
  }
}

function handleAnOperator(operator) {
  let expression = minDisplay.textContent;

  if (isValidExpression(expression)) {
    updateMinDisplay(operator);
    return handleValidExpression(expression);
  } else {
    return updateMinDisplay(operator);
  }
}

document.body.addEventListener("keydown", (event) => {
  let key = event.key;
  let minContent = minDisplay.textContent;

  if (keysToBeMapped.includes(key)) {
    key = mapKey(key);
  }

  if (isAnOperator(key)) {
    if (/\d/.test(minContent.slice(-1))) {
      return handleAnOperator(key);
    } else {
      return handleOperatorChaining(key);
    }
  }

  //check whether the button clicked represents a function
  //eg. clearing the display
  if (isAFunctionButton(key)) {
    handleFunctionButtons(key);
  } else if (validKeys.includes(key)) {
    updateMinDisplay(key);
  }
});

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

function isAnOperator(string) {
  return operators.includes(string);
}

function updateMinDisplay(content) {
  //return from the function if the minDisplay is completely
  //filled
  if (isMinDisplayContentExceeding()) {
    return;
  }

  if (content === "CE") {
    minDisplay.textContent = "";
  } else if (operators.includes(content)) {
    //wrap the operator within the span element so that styles
    //pertaining to operators can be applied
    minDisplay.innerHTML += `<span> ${content} </span>`;
  } else {
    minDisplay.innerHTML += content;
  }
}

function isMinDisplayContentExceeding() {
  const minContentLength = minDisplay.textContent.length;
  return minContentLength > 20;
}

function isAFunctionButton(text) {
  //function symbols here refer to symbols that represent
  // some actions and are not meant to be displayed
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
      const minContent = minDisplay.textContent;

      if (isValidExpression(minContent)) {
        handleValidExpression(minContent);
        //if the input expression is not valid and it contains
        //operators, then execute handleInvalidExpression function
      } else if (minContent != "" && /[+/x-]/.test(minContent)) {
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
  maxDisplay.textContent = "Invalid";

  setTimeout(() => {
    clearMaxDisplay();
    removeSeperationLine();
  }, 2000);
}

function isValidExpression(expression) {
  expression = expression.trim();
  const regex = new RegExp(
    "^([+-]?((\\d+)|(\\d+\\.\\d+)|(\\.\\d+))(e[+-]?\\d+)?)" +
      " ([+\\/x-])" +
      " ([+-]?((\\d+)|(\\d+\\.\\d+)|(\\.\\d+)))$"
  );
  return regex.test(expression);
}

function clearMinDisplay() {
  minDisplay.innerHTML = "";
}

function toggleSign() {
  let minContent = minDisplay.textContent;

  if (minContent[0] == "-") {
    minDisplay.innerHTML = minDisplay.innerHTML.slice(1);
  } else {
    minDisplay.innerHTML = "-" + minDisplay.innerHTML;
  }
}

function operate(operand1, operand2, operator) {
  operand1 = +operand1;
  operand2 = +operand2;
  let result = "";
  let minContent = minDisplay.textContent.trim();

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

  if (isAnOperator(minContent.slice(-1))) {
    minDisplay.innerHTML = maxDisplay.textContent + minContent.slice(-1);
    encloseOperatorWithSpan();
  } else {
    minContent = maxDisplay.textContent;
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
    "^([+-]?((\\d+)|(\\d+\\.\\d+)|(\\.\\d+))(e[+-]?\\d+)?)" +
      " ([+\\/x-])" +
      " ([+-]?((\\d+)|(\\d+\\.\\d+)|(\\.\\d+)))$"
  );
  //skipping 0th, 2nd, 3rd, 4rth, 5th, and 6th element of the
  //object returned by the exec method because they are not needed
  let [, operand1, , , , , , operator, operand2] = regex.exec(expression);
  return [operand1, operand2, operator];
}

function updateMaxDisplay(content) {
  content = +content;

  //convert the number to its exponential counterpart
  //so as to prevent it from overflowing the maxDisplay
  if (content > MAX_NUMBER || -content > MAX_NUMBER) {
    content = content.toExponential(3);
  } else {
    //toFixed method returns a string, so type conversion to
    //number is necessary
    content = +content.toFixed(4);
  }

  if ((content + "").length > 10) {
    reduceMaxDisplayFontSize();
  } else {
    increaseMaxDisplayFontSize();
  }

  maxDisplay.textContent = content;
  toggleEqualDisplay();
}

function reduceMaxDisplayFontSize() {
  maxDisplay.style.fontSize = "1.5rem";
}

function increaseMaxDisplayFontSize() {
  maxDisplay.style.fontSize = "2rem";
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
  let minContent = minDisplay.textContent;
  let updatedMinContent = "";

  if (minContent.length === 1) {
    minDisplay.innerHTML = "";
    return;
  } else if (minContent === "") {
    return;
  }

  if (minContent.slice(-1) == " " && isAnOperator(minContent.slice(-2, -1))) {
    //this removes the operator and the two space characters
    //that surround it
    updatedMinContent = minContent.slice(0, -3);
  } else {
    updatedMinContent = minContent.slice(0, -1);
  }

  minDisplay.textContent = updatedMinContent;
  encloseOperatorWithSpan();
}

function encloseOperatorWithSpan() {
  const minContent = minDisplay.textContent;
  const regex = /\s*((\s)|(\d))([+x/-])\s*/;

  if (minContent.length === 2) {
    minDisplay.innerHTML = minContent.replace(regex, "$3<span> $4 </span>");
    return;
  }

  //Isolationg the first character ensures that '-' character
  //(as in -99) is not treated as an operator, preventing
  //it from being styled as one
  minDisplay.innerHTML =
    minContent[0] +
    minContent
      .slice(1).replace(regex, "$3<span> $4 </span>");
}

function throwSnarkyComment() {
  maxDisplay.textContent = "Hm... ";
  minDisplay.textContent = "Can't do that!";

  setTimeout(() => {
    clearMaxDisplay();
    clearMinDisplay();
  }, 2000);
}
