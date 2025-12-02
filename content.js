//detect where the youtube player is by waiting for it to spawn in
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

// the overlay object itself
function createOverlay() {
    let overlay = document.createElement("div");
    overlay.id = "yt-endtime-overlay";
    overlay.textContent = "";
    return overlay;
}

//calculate end time and format it correctly
function formatTime(date) {
    let hours = date.getHours();
    let minutes = date.getMinutes().toString().padStart(2, "0");

    let ampm = hours >= 12 ? "PM" : "AM";
    hours = (hours % 12) || 12;
    
    return `${hours}:${minutes} ${ampm}`;
}

async function init() {
    const video = await waitForVideo();

    // find YouTube’s player container
    const player = document.querySelector("#movie_player") || video.parentElement;
    if (!player) return;

    const overlay = createOverlay();
    player.appendChild(overlay);

    //repeat every 1 seconds
    setInterval(() => {
        if (!video.duration) return;

        const remainingSeconds = video.duration - video.currentTime;
        const endTime = new Date(Date.now() + remainingSeconds * 1000);

        overlay.textContent = `Ends at ${formatTime(endTime)}`;
    }, 1000);
}

//run   
init();
