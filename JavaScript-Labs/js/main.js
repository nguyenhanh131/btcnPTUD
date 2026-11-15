window.addEventListener("load", function () {
    // Chuyển tab kiến thức giữa Lab 08, 09, 10
    var tabs = document.querySelectorAll(".tab");
    var panels = document.querySelectorAll(".panel");

    tabs.forEach(function (tab) {
        tab.addEventListener("click", function () {
            tabs.forEach(function (t) { t.classList.remove("active"); });
            panels.forEach(function (p) { p.classList.remove("active"); });

            tab.classList.add("active");
            document.getElementById(tab.dataset.tab).classList.add("active");
        });
    });

    // Năm ở chân trang
    document.getElementById("year").textContent = new Date().getFullYear();
});