/* code goes here */
var stories = document.getElementById("stories");
for (i = 0; i < stories.childNodes.length; i++) {
    console.log("child " + i + " =" + stories.childNodes[i] +
        " nodeType=" + stories.childNodes[i].nodeType);

    // Bước 7: chỉ đổi màu nền các node không phải text (nodeType 1 = element)
    if (stories.childNodes[i].nodeType == 1) {
        stories.childNodes[i].style.backgroundColor = "lightblue";
    }
}