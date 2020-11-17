// I defined formula behavior to not change even after we change the cells it depends on.
// for example, if C4 = A1 + A2 where initially A1 = 2 and A2 = 3, but later on we modify A1 = 4, C4 remains 5
// If we wanted to implement the other method, we would need to store each expression as a string and each time we change a cell,
// in order to display the spreadsheet accurately, we would need to recalculate all expressions that use the cell we're using. 
// A hashmap would be helpful to keep track of which cells depend on other cells so we don't need to check all 26 * 50 cells each time 
// we reload, but only the expressions that depend on the cell we changed. This choice also mitigated another problem that we would 
// have possibly had such as when A1 = SUM(A2, A3) where A2 = SUM(A1, A3) and A3 = 2. 

// There are definitely some adversarial user inputs that I didn't catch because I was running out of time but I am aware exist.
// An inexhaustive list of inputs this program will not behave the way expected '=SUM(A1,,,A6)', '=SUM(A1).

// If math function finds a string, I chose to alert the user, but not crash. 

// Apologies for the interface. Given more time, I would have implemented a grid with two headers so that the user can see the 
// indices of the grid without needing to put the indices as strings in the array. I think implementing this would have screwed up
// some indexing, so I chose not to. As is, it is confusing/ambiguous if the user inputted a string A5 in the A4 square or if the 
// user actually wanted to store the string A5 in the A5 square. 

// Make sure there is a way to delete numbers. If we wanted to delete A5, we can type in A5 as the expression.

// Finally, about the test cases. I tested as I went to make sure my functions were doing what I intended them to do, but I wasn't
// able to figure out how node.js worked. This is my first time touching Javascript, so any feedback is much appreciated. 

// This was super fun. There's nothing quite like banging your head against code and seeing the page load the way you intended it to. 
// I never thought I'd be so excited to see a for loop of numbers show up on the screen. 

// Things left to do: 
// - parse the inputs for SUM/AVG
// - take into account the strings
// - check when things are NULL
// - clean up redundant code

// contains strings, floats, integers, formulas (but we can represent everything as a string for consistency)
let tableArr = Array.from(Array(26), () => new Array(50));


// works the way python ranges work start = starting point, end = end - 1
function range(start, end){
    var ans = []
    for (let i = start; i < end; i++){
        ans.push(i);
    }
    return ans
}

function parseIndex(cellIndex){
    // function takes in a string and returns the array indices or alerts
    let row = cellIndex[0]; // should be A-Z
    if (!row){
        alert('Blank Cell index');
        return false;
    }
    else if (row.charCodeAt(0) < 65 || row.charCodeAt(0) > 90){
        alert('Please enter a letter between A and Z');
        return false
    } 
    
    let column = parseInt(cellIndex.slice(1));
    if (!column){ // case where someone enters AA50, applying parseInt on a not int outputs a NaN
        alert('Please enter a Cell Index in the format {A-Z} {1-50}');
        return false;
    }
    else if (column < 1 || column > 50 ){
        alert('Please enter a number between 1 and 50');
        return false;
    }

    return [row.charCodeAt(0) - 'A'.charCodeAt(0), column-1]
}

function parseIndices(expression){
    // either a range, or adding a series of values (split by commas)
    // enter in 10:20
    if (expression.includes(':')){
        let parts = expression.split(':');
        if (parts.length !== 2){
            alert('Invalid input. For a range of values, the inner expression should be \'cell:cell\'');
            return false;
        }
        else {
            if (!parseIndex(parts[0])){
                return false;
            } else{
                [row0, col0] = parseIndex(parts[0]);
            }

            if (!parseIndex(parts[1])){
                return false;
            } else {
                [row1, col1] = parseIndex(parts[1]);
            }

            if (row0 === row1 & col0 < col1){
                let arr = [];
                for (let col of range(col0, col1)){
                    let elt = queryTableArr(row0, col);
                    if (!Number.isNaN(Number(elt))){ // is a number
                        arr.push(elt);
                    }
                    else {
                        alert('Table array contains a string or is empty.');
                        return false;
                    }
                }
                return arr;
            } else if (col0 === col1 & row0 < row1){
                let arr = [];
                for (let row of range(row0, row1)){
                    let elt = queryTableArr(row, col0);
                    if (!Number.isNaN(Number(elt))){ // is a number
                        arr.push(elt);
                    }
                    else {
                        alert('Table array contains a string or is empty.');
                        return false;
                    }
                }
                return arr;
            } else {
                alert('Invalid range. Make sure matches in either row and column and indices go from small to large.');
                return false;
            }
        }
    } else if (expression.includes(',')) { 
        let parts = expression.split(',');
        let arr = []
        for (let part of parts){
            if (Number.isNaN(Number(part))){ // if it isn't a number 
                if (parseIndex(part)){ // returns false if input has bugs, will alert
                    [i,j] = parseIndex(part);
                    if (!Number.isNaN(Number(queryTableArr(i, j)))){ // check if the queried value is a number
                        arr.push(Number(queryTableArr(i,j)));
                    } else {
                        alert('Table array contains a string or is empty') 
                        return false;
                    }
                } 
            } else {
                arr.push(Number(part));
            }
        }
        return arr;
    }
}

function basicMathTwoCells(expression, operation){
    let [one, two] = expression.split(operation);
    let [row1, col1] = parseIndex(one);
    let [row2, col2] = parseIndex(two);
    return [queryTableArr(row1, col1), queryTableArr(row2, col2)]
}

function queryTableArr(row, col){
    tableArr = JSON.parse(localStorage.getItem("spreadsheet"));
    return Number(tableArr[row][col]);
}

function setTableArr(row, col, val){
    tableArr = JSON.parse(localStorage.getItem("spreadsheet"));
    tableArr[row][col] = val;
    localStorage.setItem("spreadsheet", JSON.stringify(tableArr));
}

function isNumber(expression){
    if (expression){
        return true;
    } else {
        return false;
    }
}

function editContents(form){
    let cellIndex = form.cellindex.value.toUpperCase(); // make it more user friendly. case insensitive
    let [i, j] = parseIndex(cellIndex);
    let expression = form.expression.value;
    // let expression = prompt('Enter an expression for' + cellIndex);
    // parse the user input 
    console.log(expression);
    // expression
    if (!expression){
        alert('Enter an expression');
    }
    console.log(expression[0] === '=');
    if (expression[0] === '='){
        // figure out which type of expression, call that function
        // any expression that requires evaluating 
        // switch statement 
        let newExpression = expression.slice(1);
        if (expression.includes('+')) {
            let [a, b]= basicMathTwoCells(newExpression, '+');
            if (isNumber(a) & isNumber(b)) {
                let num = a + b;
                setTableArr(i, j, num.toString()); 
            }
            else {
                alert('Either a specified index is unfilled or a string.');
                return false;
            }
        }
        else if (expression.includes('-')){
            let [a, b]= basicMathTwoCells(newExpression, '-');
            if (isNumber(a) & isNumber(b)) {
                let num = a-b;
                setTableArr(i, j, num.toString());
            }
            else {
                alert('Either a specified index is unfilled or a string.');
                return false;
            }
        } 
        else if (expression.includes('*')){
            let [a, b]= basicMathTwoCells(newExpression, '*');
            if (isNumber(a) & isNumber(b)) {
                let num =  a * b;
                setTableArr(i, j, num.toString());
            }
            else {
                alert('Either a specified index is unfilled or a string.');
                return false;
            }
        } 
        else if (expression.includes('/')){
            let [a, b]= basicMathTwoCells(newExpression, '/');
            if (isNumber(a) & isNumber(b)) {
                if (b === 0){
                    alert('Can\'t divide by 0');
                    return false;
                }
                let num = a / b;
                setTableArr(i, j, num.toString());
            }
            else {
                alert('Either a specified index is unfilled or a string.');
            }
        }

        switch (newExpression.slice(0, 3)){
            case 'SUM':
                console.log(newExpression.slice(4, newExpression.length-1));
                if (parseIndices(newExpression.slice(4, newExpression.length-1))){
                    let toSumArr = parseIndices(newExpression.slice(4, newExpression.length-1));
                    setTableArr(i, j, toSumArr.reduce(function(a, b){return a+b;}));
                    console.log(toSumArr);
                    console.log(toSumArr.reduce(function(a, b){return a+b;}));
                }
                break;
            case 'AVG':
                if (parseIndices(newExpression.slice(4, expression.length-1))){
                    let toSumArr = parseIndices(newExpression.slice(4, expression.length-1));
                    setTableArr(i, j, toSumArr.reduce(function(a, b){return a+b;}) / toSumArr.length);
                }
                break;
        }
    }
    else{ // just a number or a string
        setTableArr(i, j, expression);
    }
}

function initializeTable(){
    // tableArr[0] = ["", "A", "B"]
    let letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    for (let i of range(0, letters.length)){
        for (let j of range(1, 51)){
            tableArr[i][j-1] = letters.charAt(i) + j.toString();
        }
    }
    localStorage.setItem("spreadsheet", JSON.stringify(tableArr));
}

function createTable(){
    let table = document.createElement('table');
    tableArr = JSON.parse(localStorage.getItem("spreadsheet"));
    // create the table object
    // is it possible to pick out specific DOM elements and change it instead of reloading the entire table each time?
    // definitely possible. I'm unsure about how page refreshes would work though. 
    for (let row of tableArr){
        let rowNode = table.insertRow() 
        for (let elt of row){
            let newCell = rowNode.insertCell();
            let text = document.createTextNode(elt);
            newCell.appendChild(text);
        }
    }
    document.body.appendChild(table);
}

function deleteTable(){
    let table = document.getElementsByTagName('table')[0];
    table.parentNode.removeChild(table);
}

document.body.onload = createTable;
// module.exports = range, initializeTable;