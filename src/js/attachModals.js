function openModal(src) {
    console.log(src);
}

var pictures = document.getElementsByClassName("picture")
Array.prototype.forEach.call(pictures, function(element) {
    element.setAttribute("role", "button");
    element.setAttribute("tabindex", "0");
    var src = element.firstChild.getAttribute("src");
    element.setAttribute("onclick", "openModal('" + src + "')");
})