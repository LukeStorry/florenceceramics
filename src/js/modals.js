var modal = document.getElementById("modal")

function openModal(event, img) {
    if (event instanceof KeyboardEvent && event.key !== 'Enter' && event.key !== ' ') return;
    modal.firstChild.focus()
    modal.lastChild.setAttribute("src", img.dataset.largeSrc);
    modal.lastChild.setAttribute("alt", img.alt);
    modal.classList.add("active");
}

function closeModal(event) {
    if (event && event.target.tagName == "IMG") return;
    modal.classList.remove("active");
    modal.lastChild.setAttribute("alt", "");
    modal.lastChild.setAttribute("src", "");
}

window.addEventListener('keydown', function(event) {
    if (event.key === 'Escape') {
        closeModal()
    }
})