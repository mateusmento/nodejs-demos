const app = document.getElementById('app');
const meetingId = window.location.pathname.replace('/', '');
const socket = io();
const peer = new Peer({
    host: "localhost",
    port: 3001
});

const peers = {};

function getMediaStream(call) {
    return new Promise((res) => call.on('stream', (stream) => res(stream)));
}

async function joinMeeting() {
    const mycamera = await navigator.mediaDevices.getUserMedia({ video: true, audio: true})
    appendVideoCamera(mycamera);

    socket.emit('join-meeting', { meetingId, peerId: peer.id });

    socket.on('attendee-joined', async ({ peerId }) => {
        const call = peer.call(peerId, mycamera);
        const peerCamera = await getMediaStream(call);
        addCamera(peerId, call, peerCamera);
    });

    peer.on('call', async (call) => {
        call.answer(mycamera);
        const peerCamera = await getMediaStream(call);
        addCamera(call.peer, call, peerCamera);
    });

    socket.on('attendee-left', ({ peerId }) => {
        if (!(peerId in peers)) return;
        peers[peerId].call.close();
        peers[peerId].video.remove();
        delete peers[peerId];
    });
}

function leaveMeeting() {
    socket.emit('leave-meeting');
    for (const peer of Object.values(peers)) peer.call.close();
}

function appendVideoCamera(camera) {
    const video = document.createElement('video');
    video.autoplay = true;
    video.srcObject = camera;
    app.append(video);
    return video;
}

async function addCamera(peerId, call, camera) {
    if (peerId in peers) return;
    const video = appendVideoCamera(camera)
    peers[peerId] = { call, video };
}
