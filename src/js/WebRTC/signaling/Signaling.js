export class WebSocketSignaling extends EventTarget {
    constructor() {
        super();

        this.sleep = (msec) =>
            new Promise((resolve) => setTimeout(resolve, msec));

        let websocketUrl;
        if (location.protocol === 'https:') {
            websocketUrl = `wss://${location.host}`;
        } else {
            websocketUrl = `ws://${location.host}`;
        }

        this.websocket = new WebSocket(websocketUrl);
        this.connectionId = null;

        this.websocket.onopen = () => {
            this.isWsOpen = true;
        };

        this.websocket.onclose = () => {
            this.isWsOpen = false;
        };

        this.websocket.onmessage = (event) => {
            const msg = JSON.parse(event.data);
            if (!msg || !this) {
                return;
            }

            console.log(msg);

            switch (msg.type) {
                case 'connect':
                    this.dispatchEvent(
                        new CustomEvent('connect', { detail: msg })
                    );
                    break;
                case 'disconnect':
                    this.dispatchEvent(
                        new CustomEvent('disconnect', { detail: msg })
                    );
                    break;
                case 'offer':
                    this.dispatchEvent(
                        new CustomEvent('offer', {
                            detail: {
                                connectionId: msg.from,
                                sdp: msg.data.sdp,
                                polite: msg.data.polite,
                            },
                        })
                    );
                    break;
                case 'answer':
                    this.dispatchEvent(
                        new CustomEvent('answer', {
                            detail: {
                                connectionId: msg.from,
                                sdp: msg.data.sdp,
                            },
                        })
                    );
                    break;
                case 'candidate':
                    this.dispatchEvent(
                        new CustomEvent('candidate', {
                            detail: {
                                connectionId: msg.from,
                                candidate: msg.data.candidate,
                                sdpMLineIndex: msg.data.sdpMLineIndex,
                                sdpMid: msg.data.sdpMid,
                            },
                        })
                    );
                    break;
                default:
                    break;
            }
        };
    }

    get interval() {
        return 100;
    }

    async start() {
        while (!this.isWsOpen) {
            await this.sleep(100);
        }
    }

    async stop() {
        this.websocket.close();
        while (this.isWsOpen) {
            await this.sleep(100);
        }
    }

    createConnection(connectionId) {
        const sendJson = JSON.stringify({
            type: 'connect',
            connectionId: connectionId,
        });
        console.log(sendJson);
        this.websocket.send(sendJson);
    }

    deleteConnection(connectionId) {
        const sendJson = JSON.stringify({
            type: 'disconnect',
            connectionId: connectionId,
        });
        console.log(sendJson);
        this.websocket.send(sendJson);
    }

    sendOffer(connectionId, sdp) {
        const data = { sdp: sdp, connectionId: connectionId };
        const sendJson = JSON.stringify({
            type: 'offer',
            from: connectionId,
            data: data,
        });
        console.log(sendJson);
        this.websocket.send(sendJson);
    }

    sendAnswer(connectionId, sdp) {
        const data = { sdp: sdp, connectionId: connectionId };
        const sendJson = JSON.stringify({
            type: 'answer',
            from: connectionId,
            data: data,
        });
        console.log(sendJson);
        this.websocket.send(sendJson);
    }

    sendCandidate(connectionId, candidate, sdpMLineIndex, sdpMid) {
        const data = {
            candidate: candidate,
            sdpMLineIndex: sdpMLineIndex,
            sdpMid: sdpMid,
            connectionId: connectionId,
        };
        const sendJson = JSON.stringify({
            type: 'candidate',
            from: connectionId,
            data: data,
        });
        console.log(sendJson);
        this.websocket.send(sendJson);
    }
}
