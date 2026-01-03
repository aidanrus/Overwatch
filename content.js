
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


function createEndTimeOverlay() {
    let overlay = document.createElement("div");
    overlay.id = "yt-endtime-overlay";
    overlay.textContent = "";
    return overlay;
}

function createCurrentTimeOverlay() {
    let overlay = document.createElement("div");
    overlay.id = "yt-currenttime-overlay";
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

    const player =  document.querySelector("#movie_player") || video.parentElement;
    if (!player) return;

    const endTimeOverlay = createEndTimeOverlay();
    const currentTimeOverlay = createCurrentTimeOverlay();

    // TODO: add fullscreen mode which scales text to match 
    /*
    const fullscreen = document.querySelector("#movie_player") || video.parentElement;
    const fullscreen = document.querySelector("ytd-watch-metadata");
    if (!fullscreen) return;

    #below > ytd-watch-metadata

    is-fullscreen
    */

    // 1. add overlays to DOM
    player.appendChild(endTimeOverlay);
    player.appendChild(currentTimeOverlay);

    //2. get original --scaled-text from css   
    const endStyle = getComputedStyle(endTimeOverlay);
    const currentStyles = getComputedStyle(currentTimeOverlay);

    const endTimeTextSize = parseFloat(endStyle.getPropertyValue('--scaled-text-endtime')); 
    const currentTimeTextSize = parseFloat(currentStyles.getPropertyValue('--scaled-text-currenttime')); 

    const scaleFactor = player.clientWidth / 1000

    // 3. set scaled text
    endTimeOverlay.style.setProperty('--scaled-text-endtime', (endTimeTextSize * scaleFactor) + 'px')
    currentTimeOverlay.style.setProperty('--scaled-text-currenttime', (currentTimeTextSize * scaleFactor) + 'px')



    // 4. update every 1 sec
    setInterval(() => {
        if (!video.duration) return;

        const remainingSeconds = video.duration - video.currentTime;
        const endTime = new Date(Date.now() + remainingSeconds * 1000);
        const currentTime = new Date(Date.now());

        endTimeOverlay.textContent = `Ends at ${formatTime(endTime)}`;
        // currentTimeOverlay.textContent = `Current time: ${formatTime(new Date(Date.now()))}`; 
        currentTimeOverlay.textContent = `Current time: ${formatTime(new Date(Date.now()))}`; 
    }, 1000);
}


init();
