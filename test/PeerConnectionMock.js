import { sleep, getUniqueId } from './utils.js';

export default class PeerConnectionMock extends EventTarget {
    constructor(config) {
        super();

        this.delay = async () => await sleep(10);

        this.config = config;
        this.onTrack = undefined;
        this.onIceCandidate = undefined;
        this.onNegotiationNeeded = undefined;

        this.onSignalingStateChange = undefined;
        this.onIceConnectionStateChange = undefined;
        this.onIceGatheringStateChange = undefined;

        this.pendingLocalDescription = undefined;
        this.currentLocalDescription = undefined;
        this.pendingRemoteDescription = undefined;
        this.currnetRemoteDescription = undefined;

        this.candidates = [];

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

    close() {
        this.onTrack = undefined;
        this.onIceCandidate = undefined;
        this.onNegotiationNeeded = undefined;
        this.onSignalingStateChange = undefined;
        this.onIceConnectionStateChange = undefined;
        this.onIceGatheringStateChange = undefined;

        this.pendingLocalDescription = null;
        this.currentLocalDescription = null;
        this.pendingRemoteDescription = null;
        this.currnetRemoteDescription = null;

        this.candidates = [];
        this.signalingState = 'close';
        this.iceConnectionState = 'closed';

        this.audioTracks.clear();
        this.videoTracks.clear();
        this.channels.clear();

        this.transceiverCount = 0;
        this.transceivers.clear();
    }

    fireOnNegotiationNeeded() {
        if (this.onNegotiationNeeded) {
            this.onNegotiationNeeded();
        }
    }

    getTransceivers() {
        return Array.from(this.transceivers.values());
    }

    addTrack(track) {
        if (track.kind == 'audio') {
            this.audioTracks.set(track.id, track);
        } else {
            this.videoTracks.set(track.id, track);
        }

        const transceiver = { direction: 'sendrecv', sender: { track: track } };
        this.transceivers.set(this.transceiverCount++, transceiver);

        this.fireOnNegotiationNeeded();

        return transceiver.sender;
    }

    addTransceiver(trackOrKind) {
        if (typeof trackOrKind == 'string') {
            const track = { id: getUniqueId(), kind: trackOrKind };

            if (track.kind == 'audio') {
                this.audioTracks.set(track.id, track);
            } else {
                this.videoTracks.set(track.id, track);
            }

            const transceiver = {
                direction: 'sendrecv',
                sender: { track: track },
                receiver: null,
            };
            transceiver.set(this.transceiverCount++, transceiver);

            this.fireOnNegotiationNeeded();

            return transceiver;
        }
    }

    createDataChannel(label) {
        const channel = { id: getUniqueId(), label: label };
        this.channels.set(channel.id, channel);

        this.fireOnNegotiationNeeded();

        return channel;
    }

    createSessionDescription() {
        if (
            this.signalingState == 'stable' ||
            this.signalingState == 'have-local-offer' ||
            this.signalingState == 'have-remote-pranswer'
        ) {
            return { type: 'offer', sdp: 'lastcreatedoffer' };
        }
        return { type: 'answer', sdp: 'lastcreatedanswer' };
    }

    setSessionDescription(description, remote) {
        if (
            description.type == 'rollback' &&
            (this.signalingState == 'stable' ||
                this.signalingState == 'have-local-pranswer' ||
                this.signalingState == 'have-remote-pranswer')
        ) {
            throw 'InvalidStateError';
        }

        if (description.type != 'rollback') {
            if (remote) {
                if (description.type == 'offer') {
                    this.pendingRemoteDescription = description;
                    this.signalingState = 'have-remote-offer';
                    this.onSignalingStateChange(this.signalingState);

                    if (description.sdp.includes('track')) {
                        const track = { id: getUniqueId(), kind: 'video' };
                        this.videoTracks.set(track.id, track);
                    }
                }

                if (description.type == 'answer') {
                    this.currnetRemoteDescription = description;
                    this.currentLocalDescription = this.pendingLocalDescription;

                    this.pendingLocalDescription = null;
                    this.pendingRemoteDescription = null;

                    this.signalingState = 'stable';
                    this.onSignalingStateChange(this.signalingState);
                }

                if (description.type == 'pranswer') {
                    this.pendingRemoteDescription = description;
                    this.signalingState = 'have-remote-pranswer';
                    this.onSignalingStateChange(this.signalingState);
                }
            } else {
                if (description.type == 'offer') {
                    this.pendingLocalDescription = description;
                    this.signalingState = 'have-local-offer';
                    this.onSignalingStateChange(this.signalingState);
                }

                if (description.type == 'answer') {
                    this.currentLocalDescription = description;
                    this.currnetRemoteDescription =
                        this.pendingRemoteDescription;

                    this.pendingLocalDescription = null;
                    this.pendingRemoteDescription = null;

                    this.signalingState = 'stable';

                    this.onSignalingStateChange(this.signalingState);

                    if (description.type == 'track') {
                        const track = { id: getUniqueId(), kind: 'audio' };
                        this.audioTracks.set(track.id, track);
                    }
                }

                if (description.type == 'pranswer') {
                    this.pendingLocalDescription = description;
                    this.signalingState = 'have-local-pranswer';
                    this.onSignalingStateChange(this.signalingState);
                }
            }
        } else {
            this.pendingLocalDescription = null;
            this.pendingRemoteDescription = null;
            this.signalingState = 'stable';
            this.onSignalingStateChange(this.signalingState);
        }

        if (this.videoTracks.size != 0 || this.audioTracks.size != 0) {
            this.mockGatheringIceCandidate(
                this.videoTracks.size + this.audioTracks.size
            );
        }

        if (this.onTrack) {
            for (const track of this.videoTracks.values()) {
                this.onTrack({ track: track });
            }
            this.videoTracks.clear();
        }
    }

    async mockGatheringIceCandidate(count) {
        this.iceGatheringState = 'gathering';
        this.onIceGatheringStateChange(this.iceGatheringState);

        if (this.onIceCandidate) {
            for (let index = 0; index < count; index++) {
                await this.delay();
                const newCandidate = {
                    candidate: getUniqueId(),
                    sdpMLineIndex: index,
                    sdpMid: index,
                };
                this.onIceCandidate(newCandidate);
            }
        }
        this.iceGatheringState = 'complete';
        this.onIceGatheringStateChange(this.iceGatheringState);
        this.onIceCandidate({
            candidate: null,
            sdpMLineIndex: null,
            sdpMid: null,
        });
    }

    async addIceCandidate(candidate) {
        await this.delay();
        if (this.remoteDescription == null) {
            throw 'InvalidStateError';
        }
        this.candidates.push(candidate);
    }
}
