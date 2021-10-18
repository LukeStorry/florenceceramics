var modal = document.getElementById("modal")

function openModal(event, img) {
    if (event instanceof KeyboardEvent && event.key !== 'Enter' && event.key !== ' ') return;
    modal.firstChild.focus()
    modal.lastChild.setAttribute("src", img.src);
    modal.lastChild.setAttribute("srcset", img.srcset);
    modal.lastChild.setAttribute("alt", img.alt);
    modal.classList.add("active");
}

function closeModal(event) {
    if (event && event.target.tagName == "IMG") return;
    modal.classList.remove("active");
}

var pictures = document.getElementsByClassName("picture")
Array.prototype.forEach.call(pictures, function(element) {
    element.setAttribute("role", "button");
    element.setAttribute("tabindex", "0");
    element.setAttribute("onClick", "openModal(event, this.firstChild)");
    element.setAttribute("onKeyDown", "openModal(event, this.firstChild)");
    element.classList.add("pointer");

})

window.addEventListener('keydown', function(event) {
    if (event.key === 'Escape') {
        closeModal()
    }
})