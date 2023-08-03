// #region Constants

const numberButtons = document.querySelectorAll(".number-container button");
const operatorButtons = document.querySelectorAll(".operator-container button");
const clearButton = document.getElementById("clear-button");
const equalsButton = document.getElementById("equals-button");
const typingButtons = new Set([...numberButtons, ...operatorButtons]);
const inputField = document.querySelector(".input");
const cursor = document.getElementById("customCursor");
const allButtons = [...document.querySelectorAll("button")];

// #endregion

// #region Variables

let inputText = "",
	num1,
	num2,
	operator;

// #endregion

// #region Display population functions

typingButtons.forEach((button) => {
	button.addEventListener("click", () => {
		appendDisplay(button.textContent);
		updateInputVariable();
		extractInput();
	});
});

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
	inputField.dispatchEvent(new Event("input"));
}

function writeDisplay(text) {
	inputField.value = text;
	inputField.dispatchEvent(new Event("input"));
}

function updateInputVariable() {
	inputText = inputField.value;
}

function clearDisplay() {
	inputField.value = "";
	inputText = "";
	inputField.dispatchEvent(new Event("input"));
}

// #endregion

// #region Input processing

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
	return nums.reduce((sum, num) => sum + num);
}

function subtract(...nums) {
	return nums.reduce((sum, num) => sum - num);
}

function multiply(...nums) {
	return nums.reduce((sum, num) => sum * num);
}

function divide(...nums) {
	return nums.reduce((sum, num) => sum / num);
}

function operate(num1, num2, operator) {
	let result;

	switch (operator) {
		case "+":
			result = add(num1, num2);
			break;
		case "−":
			result = subtract(num1, num2);
			break;
		case "×":
			result = multiply(num1, num2);
			break;
		case "÷":
			result = divide(num1, num2);
			break;
		default:
			return operator + " is an invalid operator";
	}

	return result
		.toLocaleString("fullwide", {
			useGrouping: false,
			minimumFractionDigits: 10,
		})
		.replace(/\.?0+$/, "");
}

// #endregion

// #region CSS interactivity

// Make input textarea expand automatically to text
inputField.addEventListener("input", updateInputAreaSize);

function updateInputAreaSize() {
	inputField.style.height = "1.8em";
	inputField.style.height = inputField.scrollHeight + "px";
}

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
