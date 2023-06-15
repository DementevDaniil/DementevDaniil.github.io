let factTable = [];
let used = [];

function factorial(number) {
    factTable = [];
    let n = 1;
    let res = 1;
    factTable.unshift(1);
    while (n < number) {
        res *= n;
        n++;
        factTable.unshift(res);
    }
    return res;
}

function findMax(n) {
    for (let n = 0; factorial(n) < number; n++) {
        if (!used.includes(n))
            number -= factTable(n);
        else if (n == 0)
            return true;
        else
            return false;
        findMax(number);
}

let fs = require('fs');
let buffer = fs.readFileSync(0) + "";
const lines = buffer.split("\n");
const casesNum = parseInt(lines[0]);

for (let i = 0; i < casesNum; i++) {
    console.log("Case: " + i);
    let number = parseInt(lines[i + 1]);
    if (findMax(number))
        console.log(1);
    else
        console.log("impossible");
    }
}