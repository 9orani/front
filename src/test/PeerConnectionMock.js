import { sleep, getUniqueId } from './utils.js';

export default class PeerConnectionMock extends EventTarget {
    constructor(config) {
        super();

        this.delay = async () => await sleep(10);

        this.config = config;
        this.onTrack = undefined;
        this.onIcecandidate = undefined;
        this.onNegotiationNeeded = undefined;

        this.signalingStateChange = undefined;
        this.onIceConnectionStateChange = undefined;
        this.onIceGatheringStateChange = undefined;

        this.pendingLocalDescription = undefined;
        this.currentLocalDescription = undefined;
        this.pendingRemoteDescription = undefined;
        this.currnetRemoteDescription = undefined;

        this.candadates = [];

        this.signalingState = 'stable';
        this.iceConnectionState = 'new';
        this.iceGatheringState = 'new';

        this.audioTracks = new Map();
        this.videoTracks = new Map();
        this.channels = new Map();

        this.transceiverCount = 0;
        this.transceivers = new Map();
    }

    get localDescription() {
        if (this.pendingLocalDescription) {
            return this.pendingLocalDescription;
        }

        return this.currentLocalDescription;
    }

    get remoteDescription() {
        if (this.pendingRemoteDescription) {
            return this.pendingRemoteDescription;
        }

        return this.currnetRemoteDescription;
    }
}
