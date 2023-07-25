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

function checkInvalidNum(...nums) {
	for (const num of nums) {
		if (typeof num !== "number") {
			console.log(num + " is an invalid input");
			return true;
		}
	}
	return false;
}
