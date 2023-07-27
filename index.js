// #region Constants

const numberButtons = document.querySelectorAll(".number-container button");
const operatorButtons = document.querySelectorAll(".operator-container button");
const clearButton = document.getElementById("clear-button");
const equalsButton = document.getElementById("equals-button");
const typingButtons = new Set([
	...numberButtons,
	...operatorButtons,
	equalsButton,
]);
const inputField = document.querySelector(".input");
const outputField = document.querySelector(".output");
const textFieldContainer = document.querySelector(".text-field-container");
const cursor = document.getElementById("customCursor");
const allButtons = document.querySelectorAll("button");

// #endregion

// #region Variables

let inputText = "";

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
			return operator + " is an invalid operator";
	}
}

// #endregion

// #region Display population functions

typingButtons.forEach((button) => {
	button.addEventListener("click", (e) => {
		populateInput(e);
		updateInputVariable();
	});
});

function populateInput(e) {
	inputField.value += e.target.textContent;
}

function updateInputVariable() {
	inputText = inputField.value;
}

inputField.addEventListener("input", () => updateInputVariable());

// #endregion

// #region CSS interactivity

// Make input textarea expand automatically to text
inputField.addEventListener("input", function () {
	this.style.height = "auto";
	this.style.height = this.scrollHeight + "px";
});

// Clicking anywhere within this container
// will only activate the input textarea
textFieldContainer.addEventListener("click", function () {
	document.querySelector(".input").focus();
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
document.addEventListener("mousemove", (e) => {
	allButtons.forEach((button) => {
		let rect = button.getBoundingClientRect();
		let x = e.clientX - (rect.left + rect.width / 2);
		let y = e.clientY - (rect.top + rect.height / 2);
		let distance = Math.sqrt(x * x + y * y) - 100;
		let scale = Math.min(100, Math.max(0, 100 - distance)) / 140;
		button.style.fontSize = `${scale + 1.2}em`;
	});
});

// #endregion
