
/* add code here */
// Tạo mảng Thứ Hai → Thứ Sáu
var daysOfWeek = new Array("Mon", "Tues", "Wed", "Thur", "Fri");

// Thêm Sat vào cuối, Sun vào đầu
daysOfWeek.push("Sat");
daysOfWeek.unshift("Sun");

document.write("<table>");

// Hàng tiêu đề: duyệt mảng bằng for
document.write("<tr>");
for (var i = 0; i < daysOfWeek.length; i++) {
    // Tên dài hơn 3 ký tự (Tues, Thur) thì in nghiêng
    if (daysOfWeek[i].length > 3) {
        document.write("<th><em>" + daysOfWeek[i] + "</em></th>");
    } else {
        document.write("<th>" + daysOfWeek[i] + "</th>");
    }
}
document.write("</tr>");

// Các hàng ngày: in số từ 1 đến 30, mỗi hàng 7 ô
for (var day = 1; day <= 30; day++) {
    if ((day - 1) % 7 === 0) {
        document.write("<tr>");
    }
    document.write("<td>" + day + "</td>");
    if (day % 7 === 0) {
        document.write("</tr>");
    }
}
document.write("</tr>");
document.write("</table>");