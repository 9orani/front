import { VideoPlayer } from './js/VideoPlayer.js';

const playerDiv = document.getElementById('player');

let videoPlayer;
let playButton;

window.document.oncontextmenu = () => {
    return false;
};

window.addEventListener('resize', () => {
    videoPlayer.resizeVideo();
});

window.addEventListener(
    'beforeunload',
    async () => {
        await videoPlayer.stop();
    },
    true
);

const showPlayButton = () => {
    if (!document.getElementById('playButton')) {
        let elementPlayButton = document.createElement('img');

        elementPlayButton.id = 'playButton';
        elementPlayButton.src = 'images/Play.png';
        elementPlayButton.alt = 'Start Streaming';

        playButton = document
            .getElementById('player')
            .appendChild(elementPlayButton);
        playButton.addEventListener('click', onClickPlayButton);
    }
};

const onClickPlayButton = () => {
    playButton.style.display = 'none';

    // add video player
    const elementVideo = document.createElement('video');
    elementVideo.id = 'Video';
    elementVideo.style.touchAction = 'none';

    playerDiv.append(elementVideo);

    setUpVideoPlayer([elementVideo]).then((value) => (videoPlayer = value));

    // add fullscreen button
    const elementFullscreenButton = document.createElement('img');
    elementFullscreenButton.id = 'fullscreenButton';
    elementFullscreenButton.src = 'images/FullScreen.png';

    playerDiv.appendChild(elementFullscreenButton);

    elementFullscreenButton.addEventListener('click', function () {
        if (!document.fullscreenElement || !document.webkitFullscreenElement) {
            if (document.documentElement.requestFullscreen) {
                document.documentElement.requestFullscreen();
            } else if (document.documentElement.webkitRequestFullscreen) {
                document.documentElement.webkitRequestFullscreen(
                    Element.ALLOW_KEYBOARD_INPUT
                );
            } else {
                if (playerDiv.style.position == 'absolute') {
                    playerDiv.style.position = 'relative';
                } else {
                    playerDiv.style.position = 'absolute';
                }
            }
        }
    });

    const onFullScreenChange = () => {
        if (document.webkitFullscreenElement || document.fullscreenElement) {
            playerDiv.style.position = 'absolute';
            elementFullscreenButton.style.display = 'none';
        } else {
            playerDiv.style.position = 'relative';
            elementFullscreenButton.style.display = 'block';
        }
    };

    document.addEventListener('webkitfullscreenchange', onFullScreenChange);
    document.addEventListener('fullscreenchange', onFullScreenChange);
};

const setUpVideoPlayer = async (elements) => {
    const videoPlayer = new VideoPlayer(elements);

    await videoPlayer.setUpConnection();
    videoPlayer.ondisconnect = onDisconnect;

    return videoPlayer;
};

const onDisconnect = (message) => {
    if (message) {
        messageDiv.style.display = 'block';
        messageDiv.innerText = message;
    }

    clearChildren(playerDiv);
    videoPlayer = null;
    showPlayButton();
};

const clearChildren = (element) => {
    while (element.firstChild) {
        element.removeChild(element.firstChild);
    }
};

showPlayButton();
