function waitForVideo() {
    return new Promise(resolve => {
        const check = () => {
            const video = document.querySelector("video");
            if (video) resolve(video);
            else requestAnimationFrame(check);
        };
        check();
    });
}

function createOverlay() {
    let overlay = document.createElement("div");
    overlay.id = "yt-endtime-overlay";
    overlay.textContent = "";
    return overlay;
}

function formatTime(date) {
    let hours = date.getHours();
    let minutes = date.getMinutes().toString().padStart(2, "0");

    //let ampm = hours >= 12 ? "PM" : "AM";
    //hours = (hours % 12) || 12;
    
    
    

    return `${hours}:${minutes}`;
}

async function init() {
    const video = await waitForVideo();

    // Find YouTube’s player container
    const player = document.querySelector("#movie_player") || video.parentElement;
    if (!player) return;

    const overlay = createOverlay();
    player.appendChild(overlay);

    setInterval(() => {
        if (!video.duration) return;

        const remainingSeconds = video.duration - video.currentTime;
        const endTime = new Date(Date.now() + remainingSeconds * 1000);

        overlay.textContent = `Ends at ${formatTime(endTime)}`;
    }, 1000);
}

init();
