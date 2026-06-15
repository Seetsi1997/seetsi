function dateFooter() {
    const year = document.getElementById('dateFooter');
    if (year) {
        year.innerText = new Date().getFullYear();
    }
}

function startClock() {
    const timeEl = document.getElementById('navTime');
    if (!timeEl) return;

    function updateTime() {
        const now = new Date();
        timeEl.innerText = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    }
    updateTime(); // show immediately
    setInterval(updateTime, 1000); // update every second
}

// Wait until all partials are injected into the DOM
window.addEventListener('partialsLoaded', () => {
    dateFooter();
    startClock();
});
