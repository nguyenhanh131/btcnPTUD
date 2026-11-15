/* add code below this */
// 1. String object và String literal
var stringOne = new String("Test");
var stringTwo = "Test";
var stringThree = "Test";
var stringFour = new String("Test");

// 2. Kiểm tra kiểu dữ liệu
document.write("typeof stringOne: " + typeof stringOne + "<br>");
document.write("typeof stringTwo: " + typeof stringTwo + "<br>");

// So sánh == (chỉ so giá trị) và === (so cả giá trị lẫn kiểu)
document.write("stringOne == stringTwo: " + (stringOne == stringTwo) + "<br>");
document.write("stringOne === stringTwo: " + (stringOne === stringTwo) + "<br>");
document.write("stringTwo == stringThree: " + (stringTwo == stringThree) + "<br>");
document.write("stringTwo === stringThree: " + (stringTwo === stringThree) + "<br>");
document.write("stringOne == stringFour: " + (stringOne == stringFour) + "<br>");
document.write("stringOne === stringFour: " + (stringOne === stringFour) + "<br>");

// 3. Đối tượng Date
var dateOne = new Date();
document.write("<br>Date: " + dateOne + "<br>");

// 4. Đối tượng Math
document.write("<br>Math.PI = " + Math.PI + "<br>");
document.write("Math.sqrt(4) = " + Math.sqrt(4) + "<br>");
document.write("Math.random() = " + Math.random() + "<br>");