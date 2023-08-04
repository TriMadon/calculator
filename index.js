// #region Constants

const mainContainer = document.querySelector(".container");
const numberButtons = document.querySelectorAll(".number-container button");
const operatorButtons = document.querySelectorAll(".operator-container button");
const clearButton = document.getElementById("clear-button");
const backButton = document.getElementById("back-button");
const equalsButton = document.getElementById("equals-button");
const typingButtons = new Set([...numberButtons, ...operatorButtons]);
const inputField = document.querySelector(".input");
const answerDiv = document.querySelector(".answer");
const cursor = document.getElementById("customCursor");
const allButtons = [...document.querySelectorAll(".button-container button")];
const deathDialog = document.getElementById("death-dialog");
const retryButton = document.getElementById("retry-button");
const deathSound = document.getElementById("death-sound");
const allowedKeysMap = {
	0: 0,
	1: 1,
	2: 2,
	3: 3,
	4: 4,
	5: 5,
	6: 6,
	7: 7,
	8: 8,
	9: 9,
	".": ".",
	"*": "×",
	"/": "÷",
	"+": "+",
	"-": "−",
	"^": "^",
	"%": "%",
};
const allowedOperatorKeys = ["*", "/", "+", "-", "^", "%"];
const operators = ["×", "÷", "+", "−", "^", "%"];
const nonStackables = [...operators, "."];
const nonDuplicables = [...operators, ".", "-"];

// #endregion

// #region Variables

let inputText = "",
	num1,
	num2,
	operator;

// #endregion

// #region Keyboard functions

document.addEventListener("keydown", (e) => {
	let key = allowedKeysMap[e.key];
	if (
		e.key === "-" &&
		(!inputText || operators.includes(inputText[inputText.length - 1]))
	) {
		key = "-";
	}
	if (e.key in allowedKeysMap) {
		if (isCharValid(key)) {
			typeChar(key);
		}
	}
	if (allowedOperatorKeys.includes(e.key)) {
		calculate(allowedKeysMap[e.key]);
	} else if (e.key === "Delete") {
		clearDisplay();
		clearData();
	} else if (e.key === "Backspace") {
		writeDisplay(inputText.slice(0, -1));
		updateInputVariable();
	} else if (e.key === "Enter") {
		calculate();
	}
});
// #endregion

// #region Display population functions

typingButtons.forEach((button) => {
	button.addEventListener("click", () => {
		if (isCharValid(button.value)) {
			typeChar(button.value);
		}
	});
});

clearButton.onclick = () => {
	clearDisplay();
	clearData();
};

backButton.onclick = () => {
	writeDisplay(inputText.slice(0, -1));
	updateInputVariable();
	extractInput();
};

equalsButton.onclick = () => calculate();

operatorButtons.forEach((button) => {
	button.onclick = () => calculate(button.textContent);
});

function typeChar(char) {
	appendDisplay(char);
	updateInputVariable();
	extractInput();
	inputField.classList.remove("animate-slide-in");
}

function calculate(appendText = "") {
	if (isInputValid()) {
		writeDisplay(operate(num1, num2, operator) + appendText);
		updateInputVariable();
		answerDiv.textContent = "";
		answerDiv.classList.remove("animate-slide-in");
		inputField.classList.add("animate-slide-in");
	}
	let isDividedByZero = num2 === 0 && (operator === "÷" || operator === "%");
	if (isDividedByZero) {
		showDeathDialog();
	}
}

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
	inputField.dispatchEvent(new Event("input"));
	answerDiv.textContent = "";
}

function clearData() {
	inputText = "";
	(num1 = undefined), (num2 = undefined), (operator = undefined);
}

// #endregion

// #region Input processing

function extractInput() {
	if (!inputText || inputText === "") {
		return;
	}
	nums = inputText.split(/[+−×÷^%]/);
	num1 = !nums[0] ? undefined : +nums[0];
	num2 = !nums[1] ? undefined : +nums[1];
	opMatch = inputText.match(/[+−×÷^%]/);
	operator = opMatch ? opMatch[0] : undefined;
	if (isInputValid()) {
		answerDiv.textContent = "= " + +operate(num1, num2, operator);
		answerDiv.classList.add("animate-slide-in");
	} else {
		answerDiv.textContent = "";
		answerDiv.classList.remove("animate-slide-in");
	}
}

function isInputValid() {
	return (!num1 && num1 !== 0) ||
		(!num2 && num2 !== 0) ||
		!operator ||
		operator.length > 1
		? false
		: true;
}

function isCharValid(char) {
	if (
		(nonStackables.includes(char) &&
			nonStackables.includes(inputText[inputText.length - 1])) ||
		(operators.includes(char) &&
			(inputText === "" ||
				operators.some((operator) => inputText.includes(operator)))) ||
		(nonDuplicables.includes(char) &&
			char === inputText[inputText.length - 1])
	) {
		return false;
	}
	return true;
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

function power(...nums) {
	return nums.reduce((sum, num) => sum ** num);
}

function modulo(...nums) {
	return nums.reduce((sum, num) => sum % num);
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
		case "^":
			result = power(num1, num2);
			break;
		case "%":
			result = modulo(num1, num2);
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
	mainContainer.style.height = 370 + inputField.scrollHeight + "px";
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

window.addEventListener("resize", () => {
	rects = allButtons.map((button) => button.getBoundingClientRect());
});

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

// Display the division by zero message
retryButton.addEventListener("click", () => {
	deathDialog.close();
	clearDisplay();
	clearData();
});

deathDialog.addEventListener("cancel", () => {
	deathDialog.close();
	clearDisplay();
	clearData();
});

function showDeathDialog() {
	deathDialog.showModal();
	deathSound.play();
}

// #endregion
