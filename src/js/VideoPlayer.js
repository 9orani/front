import { Sender } from './WebRTC/Sender.js';
import { InputRemoting } from './WebRTC/input/InputRemoting.js';
import { isTouchDevice } from './WebRTC/utils/isTouchDevice.js';
import { WebSocketSignaling } from '../js/WebRTC/signaling/Signaling.js';
import { uuid4 } from './WebRTC/utils/uuid.js';
import { Observer } from './WebRTC/Observer.js';
import { ActionType } from './WebRTC/constants/ActionType.js';

import * as Config from '../js/config.js';

export class VideoPlayer {
    constructor(elements) {
        const _this = this;

        this.config = Config.getRTCConfiguration();
        this.peerConnection = null;
        this.multiPlayChannel = null;
        this.connectionId = null;

        this.sender = new Sender(elements[0]);
        this.sender.addMouse();
        this.sender.addKeyboard();
        if (isTouchDevice()) {
            this.sender.addTouchScreen();
        }
        this.sender.addGamepad();

        this.inputRemoting = new InputRemoting(this.sender);

        // main video
        this.localStream = new MediaStream();

        this.video = elements[0];
        this.video.playsInline = true;
        this.video.addEventListener(
            'loadedmetadata',
            () => {
                _this.video.play();
                _this.resizeVideo();
            },
            true
        );

        this.onDisconnect = (message) => {
            console.log(`Disconnect peer. ${message}`);
        };
    }

    setUpConnection = async () => {
        const _this = this;

        if (this.peerConnection) {
            this.peerConnection.close();
            this.peerConnection = null;
        }

        this.signaling = new WebSocketSignaling();
        this.peerConnection = new RTCPeerConnection(this.config);

        this.peerConnection.onsignalingstatechange = (e) => {
            console.log('signalingState changed: ', e);
        };

        this.peerConnection.oniceconnectionstatechange = (e) => {
            console.log('iceConnectionState changed: ', e);
            console.log(
                `pc.iceConnectionState: ${_this.peerConnection.iceConnectionState}`
            );

            if (_this.peerConnection.iceConnectionState === 'disconnected') {
                _this.onDisconnect(
                    `Receive disconnect message from peer. connectionId:${this.connectionId}`
                );
            }
        };

        this.peerConnection.onicegatheringstatechange = (e) => {
            console.log('iceGatheringState changed: ', e);
        };

        this.peerConnection.ontrack = (e) => {
            this.localStream.addTrack(e.track);
            this.video.srcObject = this.localStream;
        };

        this.peerConnection.onicecandidate = (e) => {
            if (e.candidate != null) {
                this.signaling.sendCandidate(
                    _this.connectionId,
                    e.candidate.candidate,
                    e.candidate.sdpMid,
                    e.candidate.sdpMLineIndex
                );
            }
        };

        this.signaling.addEventListener('answer', async (e) => {
            const answer = e.detail;
            const description = new RTCSessionDescription({
                sdp: answer.sdp,
                type: 'answer',
            });

            try {
                await _this.peerConnection.setRemoteDescription(description);
            } catch (e) {
                _this.onDisconnect(
                    `Error happen on setRemoteDescription.\nMessge: ${e}\nRTCSdpType: ${description.type}\nsdp: ${description.sdp}`
                );
            }
        });

        this.signaling.addEventListener('candidate', async (e) => {
            const { candidate, sdpMid, sdpMLineIndex } = e.detail;

            const iceCandidate = new RTCIceCandidate({
                candidate: candidate,
                sdpMid: sdpMid,
                sdpMLineIndex: sdpMLineIndex,
            });

            try {
                await _this.peerConnection.addIceCandidate(iceCandidate);
            } catch (e) {
                console.warn(e);
            }
        });

        // setup signaling
        await this.signaling.start();
        this.connectionId = uuid4();

        // register using connectionId
        this.signaling.createConnection(this.connectionId);

        // create data channel with proxy server and setup handlers
        this.inputSenderChannel =
            this.peerConnection.createDataChannel('input');
        this.inputSenderChannel.onopen =
            this._onOpenInputSenderChannel.bind(this);
        this.multiPlayChannel =
            this.peerConnection.createDataChannel('multiplay');
        this.multiPlayChannel.onopen = this._onOpenMultiplayChannel.bind(this);

        this.inputRemoting.subscribe(new Observer(this.inputSenderChannel));

        this.peerConnection.addTransceiver('video', { direction: 'recvonly' });

        // create offer
        const offer = await this.peerConnection.createOffer();

        // set local sdp
        const description = new RTCSessionDescription({
            sdp: offer.sdp,
            type: 'offer',
        });
        await this.peerConnection.setLocalDescription(description);
        this.signaling.sendOffer(this.connectionId, offer.sdp);
    };

    get videoWidth() {
        return this.video.videoWidth;
    }

    get videoHeight() {
        return this.video.videoHeight;
    }

    get videoOriginX() {
        return this._videoOriginX;
    }

    get videoOriginY() {
        return this._videoOriginY;
    }

    get videoScale() {
        return this._videoScale;
    }

    resizeVideo() {
        const clientRect = this.video.getBoundingClientRect();
        const videoRatio = this.videoWidth / this.videoHeight;
        const clientRatio = clientRect.width / clientRect.height;

        this._videoScale =
            videoRatio > clientRatio
                ? clientRect.width / this.videoWidth
                : clientRect.height / this.videoHeight;
        const videoOffsetX =
            videoRatio > clientRatio
                ? 0
                : (clientRect.width - this.videoWidth * this._videoScale) * 0.5;
        const videoOffsetY =
            videoRatio > clientRatio
                ? (clientRect.height - this.videoHeight * this._videoScale) *
                  0.5
                : 0;
        this._videoOriginX = clientRect.left + videoOffsetX;
        this._videoOriginY = clientRect.top + videoOffsetY;
    }

    close() {
        if (this.peerConnection) {
            this.peerConnection.close();
            this.peerConnection = null;
        }
    }

    _changeLabel(label) {
        const json = JSON.stringify({
            type: ActionType.ChangeLabel,
            argument: label,
        });
        this.multiPlayChannel.send(json);
    }

    async _onOpenInputSenderChannel() {
        await new Promise((resolve) => setTimeout(resolve, 100));
        this.inputRemoting.startSending();
    }

    async _onOpenMultiplayChannel() {
        await new Promise((resolve) => setTimeout(resolve, 100));
        const num = Math.floor(Math.random() * 100000);
        this._changeLabel(String(num));
        // this._changeLabel("seunghui"); 
    }

    async stop() {
        await this.signaling.stop();
    }
}
