// #region Constants

const numberButtons = document.querySelectorAll(".number-container button");
const operatorButtons = document.querySelectorAll(".operator-container button");
const clearButton = document.getElementById("clear-button");
const equalsButton = document.getElementById("equals-button");
const typingButtons = new Set([...numberButtons, ...operatorButtons]);
const inputField = document.querySelector(".input");
const outputField = document.querySelector(".output");
const textFieldContainer = document.querySelector(".text-field-container");
const cursor = document.getElementById("customCursor");
const allButtons = [...document.querySelectorAll("button")];

const operatorPriority = {
	"+": 0,
	"-": 0,
	"−": 0,
	"*": 1,
	"×": 1,
	x: 1,
	"/": 1,
	"÷": 1,
};

// #endregion

// #region Variables

let inputText = "";
let operands = [];
let operators = [];
let currentAns = 0;
let inputIsValid = false;
let errorMessage = "";

// #endregion

// #region Display setters & getters

typingButtons.forEach((button) => {
	button.addEventListener("click", (e) => {
		populateInput(e);
		updateInput();
	});
});

inputField.addEventListener("input", () => updateInput());
// inputField.addEventListener("keypress", preventInvalidChars);
inputField.addEventListener("paste", (e) => e.preventDefault());

clearButton.addEventListener("click", () => clearInput());

equalsButton.addEventListener("click", () => {
	if (inputIsValid) {
		displayOutput(calculateString(inputText.replace(/\s+/g, "")));
	} else {
		displayOutput(ans)
	}
});

function populateInput(e) {
	inputField.value += e.target.textContent;
}

function updateInput() {
	inputText = inputField.value;
	inputIsValid = validateExpression(inputText);
}

function clearInput() {
	inputField.value = "";
	inputText = "";
}

function validateExpression(str) {
	return str === "" ? false : true;
}

function displayOutput(text) {
	outputField.textContent = `ans = ${text}`;
}

// #endregion

// #region Input/Output processing

function calculateString(cleanedStr) {
	operands = extractOperands(cleanedStr);
	operators = extractOperators(cleanedStr);
	let ans = operateInSequence(operands, operators);
	currentAns = ans;
	return ans;
}

function extractOperands(str) {
	return str.split(/[+\-*/−×x÷]/).map((operand) => +operand);
}

function extractOperators(str) {
	return str.match(/[+\-*/−×x÷]+/g);
}



// #endregion

// #region Calculation functions

function add(...nums) {
	if (checkInvalidNum(nums)) return "Addition Error";
	return nums.reduce((sum, num) => sum + num);
}

function subtract(...nums) {
	if (checkInvalidNum(nums)) return "Subtraction Error";
	return nums.reduce((sum, num) => sum - num);
}

function multiply(...nums) {
	if (checkInvalidNum(nums)) return "Multiplication Error";
	return nums.reduce((sum, num) => sum * num);
}

function divide(...nums) {
	if (checkInvalidNum(nums)) return "Division Error";
	return nums.reduce((sum, num) => sum / num);
}

function checkInvalidNum(nums) {
	for (const num of nums) {
		if (typeof num !== "number") {
			console.log(num + " is an invalid input");
			return true;
		}
	}
	return false;
}

function operate(num1, num2, operator) {
	switch (operator) {
		case "+":
			return add(num1, num2);
		case "-":
		case "−":
			return subtract(num1, num2);
		case "*":
		case "×":
		case "x":
			return multiply(num1, num2);
		case "/":
		case "÷":
			return divide(num1, num2);
		default:
			return `"${operator}" is an invalid operator`;
	}
}

function operateInSequence(operands, operators) {
	let operatorOrderIndex = getOperatorOrder(operators);
	let ans;
	operatorOrderIndex.forEach((index) => {
		let num1 = operands[index],
			num2 = operands[index + 1];
		ans = operate(num1, num2, operators[index]);
		operands[index] = ans;
		operands[index + 1] = ans;
	});
	return ans;
}

function getOperatorOrder(operators) {
	return operators
		.slice()
		.map((item, index) => index)
		.sort(
			(i1, i2) =>
				operatorPriority[operators[i2]] -
				operatorPriority[operators[i1]]
		);
}

// #endregion

// #region CSS interactivity

// Make input textarea expand automatically to text
inputField.addEventListener("input", function () {
	this.style.height = "auto";
	this.style.height = this.scrollHeight + "px";
});

// Set the input field on focus at all times
let focusInterval;
textFieldContainer.addEventListener("mouseout", () => {
	focusInterval = setInterval(() => {
		inputField.setSelectionRange(
			inputField.value.length,
			inputField.value.length
		);
		inputField.focus();
	}, 500);
});
textFieldContainer.addEventListener("mouseover", () => {
	clearInterval(focusInterval);
});

// Create a custom cursor to track its location on page
document.addEventListener("mousemove", (e) => {
	cursor.setAttribute(
		"style",
		"top:" + (e.pageY - 5) + "px; left:" + (e.pageX - 5) + "px;"
	);
});

// Increase font size based on the distance
// from the custom cursor to the button
let rects = allButtons.map((button) => button.getBoundingClientRect());
let prevFontSizes = allButtons.map(() => 0);

document.addEventListener("mousemove", (e) => {
	allButtons.forEach((button, index) => {
		let rect = rects[index];
		let x = e.clientX - (rect.left + rect.width / 2);
		let y = e.clientY - (rect.top + rect.height / 2);
		let distance = Math.sqrt(x * x + y * y) - 100;
		let scale = Math.min(100, Math.max(0, 100 - distance)) / 140;
		let newFontSize = scale + 1.2;
		if (newFontSize !== prevFontSizes[index]) {
			button.style.fontSize = `${newFontSize}em`;
			prevFontSizes[index] = newFontSize;
		}
	});
});
// #endregion
