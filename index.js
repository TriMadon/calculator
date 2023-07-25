function add(...nums) {
    for (const num of nums) {
        if ((typeof num) !== "number") {
            return num + " is an invalid input";
        }
    }
    return nums.reduce((sum, num) => sum + +num);
}

