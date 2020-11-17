// I defined formula behavior to not change when we change the cells afterwards.
// for example, if C4 = A1 + A2 where initially A1 = 2 and A2 = 3, but later on we modify A1 = 4, C4 remains 5
// If we wanted to implement the other method, we would need to store each expression as a string and each time we change a cell,
// in order to display the spreadsheet accurately, we would need to recalculate all expressions that use the cell we're using. 
// A hashmap would be helpful to keep track of which cells depend on other cells so we don't need to check all 26 * 50 cells each time 
// we reload, but only the ones we change. This choice also mitigated another problem that we would have possibly had such as 
// when A1 = SUM(A2, A3) where A2 = SUM(A1, A3) and A3 = 2. 

// There are definitely some adversarial user inputs that I didn't catch because I was running out of time but I am aware exist.
// An inexhaustive list of inputs this program will not behave the way expected '=SUM(A1,,,A6)'. potentially, 

// If math function finds a string, I chose to alert the user, but not crash. 

// Apologies for the interface. Given more time, I would have implemented a grid with two headers so that the user can see the 
// indices of the grid without needing to put the indices as strings in the array. I think implementing this would have screwed up
// some indexing, so I chose not to. As is, it is confusing/ambiguous if the user inputted a string A5 in the A4 square or if the 
// user actually wanted to store the string A5 in the A5 square. 

// Make sure there is a way to delete numbers. If we wanted to delete A5, we can type in A5 as the expression.

// Finally, I deeply apologize for not writing test cases, but rest assured that I tested as I went to make sure my functions were
// doing what I intended them to do. Things got super crazy busy last week in school so I couldn't start working on this developer 
// challenge until pretty late. This is my first time touching Javascript (so learning that took some time) and I couldn't figure out 
// how to test the code in time. I'd love feedback on things I could have done better in writing this code. I'm sure there are some
// functions that would've made my life easier that I didn't know existed. 

// This was super fun. I loved the semi-open-endedness of this project.

// Things left to do: 
// - parse the inputs for SUM/AVG
// - take into account the strings
// - check when things are NULL

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
        alert('Blank Cell index')
    }
    else if (row.charCodeAt(0) < 65 || row.charCodeAt(0) > 90){
        alert('Please enter a letter between A and Z')
    } 
    
    let column = parseInt(cellIndex.slice(1));
    if (!column){ // case where someone enters AA50, applying parseInt on a not int outputs a NaN
        alert('Please enter a Cell Index in the format {A-Z} {1-50}');
    }
    else if (column < 1 || column > 50 ){
        alert('Please enter a number between 1 and 50');
    }

    return [row.charCodeAt(0) - 'A'.charCodeAt(0), column-1]
}

function parseIndices(expression){
    // either a range, or adding a series of values (split by commas)
}


function basicMathTwoCells(expression, operation){
    let [one, two] = expression.split(operation);
    let [row1, col1] = parseIndex(one);
    let [row2, col2] = parseIndex(two);
    return [Number(queryTableArr(row1, col1)), Number(queryTableArr(row2, col2))]
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
    if (Number(expression)){
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
    if (expression[0] === '='){
        // figure out which type of expression, call that function
        // any expression that requires evaluating 
        // switch statement 
        let newExpression = expression.slice(1);
        // switch (newExpression.slice(0, 3)){
        //     case 'SUM':

        //     case 'AVG':

        // }
    }
    else{
        if (expression.includes('+')) {
            let [a, b]= basicMathTwoCells(expression, '+');
            if (isNumber(a) & isNumber(b)) {
                let num = a + b;
                console.log('entered');
                setTableArr(i, j, num.toString()); 
            }
            else {
                alert('Either a specified index is unfilled or a string.')
            }
        }
        else if (expression.includes('-')){
            let [a, b]= basicMathTwoCells(expression, '-');
            if (isNumber(a) & isNumber(b)) {
                let num = a-b;
                setTableArr(i, j, num.toString());
            }
            else {
                alert('Either a specified index is unfilled or a string.')
            }
        } 
        else if (expression.includes('*')){
            let [a, b]= basicMathTwoCells(expression, '*');
            if (isNumber(a) & isNumber(b)) {
                let num =  a * b;
                setTableArr(i, j, num.toString());
            }
            else {
                alert('Either a specified index is unfilled or a string.')
            }
        } 
        else if (expression.includes('/')){
            let [a, b]= basicMathTwoCells(expression, '/');
            if (isNumber(a) & isNumber(b)) {
                let num = a / b 
                setTableArr(i, j, num.toString());; 
            }
            else {
                alert('Either a specified index is unfilled or a string.')
            }
        }
        else{ // when 
            setTableArr(i, j, expression);
        }
        console.log(tableArr[1])
    }
    
    // do DOM traversal to find what to alter
}

function initializeTable(){
    // tableArr[0] = ["", "A", "B"]
    let letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    // letters.charCodeAt(0) = 65, A-Z is 65-90

    for (let i of range(0, letters.length)){
        for (let j of range(1, 51)){
            tableArr[i][j-1] = letters.charAt(i) + j.toString();
        }
    }
    localStorage.setItem("spreadsheet", JSON.stringify(tableArr));
}

function createTable(){
    let table = document.createElement('table');
    tableArr = JSON.parse(localStorage.getItem("spreadsheet"))
    // create the table object
    for (let row of tableArr){
        let rowNode = table.insertRow() 
        for (let elt of row){
            let newCell = rowNode.insertCell();
            let text = document.createTextNode(elt);
            newCell.appendChild(text)
        }
    }
    document.body.appendChild(table);
}

document.body.onload = createTable;
// module.exports = range, initializeTable;