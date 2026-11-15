/* code goes here */
var msg = document.getElementById("msgArea");
msg.value = "here is some text";

// Bước 3 đã được thay bằng cách viết ở bước 4 (không dùng biến tạm)
document.getElementById("pageTitle").innerHTML = "Even newer title";
// Bước 6 (thay cho bước 5)
msg.value = document.getElementById("first").innerText;

// Bước 7
msg.value = "My class is " + msg.getAttribute("class");

// Bước 8
var elem = document.getElementsByTagName("textarea");
elem[0].value = "selected by tag name";

// Bước 9
elem = document.getElementsByTagName("span");
for (i = 0; i < elem.length; i++) {
    document.getElementById("msgArea").value += "\n" + elem[i].innerText;
}

// Bước 10
document.getElementById("msgArea").value = "";
var counts = document.getElementsByClassName("count-number");
for (i = 0; i < counts.length; i++) {
    document.getElementById("msgArea").value += "\n" + counts[i].innerText;
}

// Bước 11
var ps = document.querySelector("#first p");
document.getElementById("msgArea").value = ps.innerHTML;

// Bước 12
ps = document.querySelectorAll("#first p");
for (i = 0; i < ps.length; i++) {
    document.getElementById("msgArea").value += ps[i].innerHTML + "\n";
}
// Bước 13
document.getElementById("msgArea").setAttribute("class", "hidden");

// Bước 14
document.getElementById("features").style.backgroundColor = "green";