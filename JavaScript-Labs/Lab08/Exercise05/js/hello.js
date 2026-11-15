document.write("this text was written from JS");
var count = 1;
document.write(" Count = " + count);
count++;
var output = "<br>Count = " + count;
document.write(output);

console.log("Giá trị của count là: " + count);
console.warn("Đây là cảnh báo: biến output đang chứa mã HTML");
console.error("Đây là thông báo lỗi giả lập để thử Console");