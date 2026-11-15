var countries = [
    { iso: "BS", name: "Bahamas",        capital: "Nassau",        population: 400000 },
    { iso: "CA", name: "Canada",         capital: "Ottawa",        population: 40000000 },
    { iso: "DE", name: "Germany",        capital: "Berlin",        population: 84000000 },
    { iso: "ES", name: "Spain",          capital: "Madrid",        population: 48000000 },
    { iso: "GB", name: "United Kingdom", capital: "London",        population: 68000000 },
    { iso: "GH", name: "Ghana",          capital: "Accra",         population: 34000000 },
    { iso: "GR", name: "Greece",         capital: "Athens",        population: 10400000 },
    { iso: "HU", name: "Hungary",        capital: "Budapest",      population: 9600000 },
    { iso: "IT", name: "Italy",          capital: "Rome",          population: 59000000 },
    { iso: "US", name: "United States",  capital: "Washington D.C.", population: 335000000 }
];
for (i = 0; i < countries.length; i++) {
    var c = countries[i];
    document.write("<div class='box'>");
    document.write("<img src='flags/" + c.iso + ".png' class='boxImg'>");
    for (var propertyName in c) {
        document.write("<strong>");
        document.write(propertyName + ": ");
        document.write("</strong>");
        document.write(c[propertyName]);
        document.write("<br>");
    }
    document.write("</div>");
}