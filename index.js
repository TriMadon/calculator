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

// #endregion

// #region Variables

let inputText = "",
	num1,
	num2,
	operator,
	currAns;

// #endregion

// #region Display population functions

typingButtons.forEach((button) => {
	button.addEventListener("click", (e) => {
		appendDisplay(button.textContent);
		updateInputVariable();
		extractInput();
	});
});

inputField.addEventListener("input", () => updateInputVariable());
clearButton.onclick = () => clearDisplay();
equalsButton.onclick = () => {
	if (isInputValid()) {
		writeDisplay(operate(num1, num2, operator));
	}
};
operatorButtons.forEach((button) => {
	button.onclick = () => {
		if (isInputValid()) {
			writeDisplay(operate(num1, num2, operator) + button.textContent);
		}
	};
});

function appendDisplay(text) {
	inputField.value += text;
}

function writeDisplay(text) {
	inputField.value = text;
}

function updateInputVariable() {
	inputText = inputField.value;
}

function clearDisplay() {
	inputField.value = "";
	inputText = "";
}

// #endregion

// #region I/O processing

function extractInput() {
	if (!inputText || inputText === "") {
		return;
	}
	nums = inputText.split(/[+−×÷]/);
	num1 = !nums[0] ? undefined : +nums[0];
	num2 = !nums[1] ? undefined : +nums[1];
	opMatch = inputText.match(/[+−×÷]/);
	operator = opMatch ? opMatch[0] : undefined;
}

function isInputValid() {
	return (!num1 && num1 !== 0) ||
		(!num2 && num2 !== 0) ||
		!operator ||
		operator.length > 1
		? false
		: true;
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
		case "−":
			return subtract(num1, num2);
		case "×":
			return multiply(num1, num2);
		case "÷":
			return divide(num1, num2);
		default:
			console.log(typeof operator);
			return operator + " is an invalid operator";
	}
}

// #endregion

// #region CSS interactivity

// Set the input field on focus at all times
let focusInterval;
inputField.addEventListener("mouseout", () => {
	setInputFieldOnFocus();
});
inputField.addEventListener("mouseover", () => {
	clearInterval(focusInterval);
});

function setInputFieldOnFocus() {
	focusInterval = setInterval(() => {
		inputField.setSelectionRange(
			inputField.value.length,
			inputField.value.length
		);
		inputField.focus();
	}, 500);
}

window.onload = () => setInputFieldOnFocus();

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

document.addEventListener("mousemove", (e) => {
	allButtons.forEach((button, index) => {
		let rect = rects[index];
		let x = e.clientX - (rect.left + rect.width / 2);
		let y = e.clientY - (rect.top + rect.height / 2);
		let distance = Math.sqrt(x * x + y * y) - 30;
		let scale = Math.min(100, Math.max(0, 100 - distance)) / 200;
		button.style.transform = `scale(${1 + scale})`;
	});
});

// #endregion
