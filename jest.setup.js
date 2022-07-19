import fetch from 'node-fetch';

import PeerConnectionMock from './src/test/PeerConnectionMock';
import ResizeObserverMock from './src/test/ResizeObserverMock';

if (!window.fetch) {
    window.fetch = fetch;
}

if (!window.RTCPeerConnection) {
    window.RTCPeerConnection = PeerConnectionMock;
}

if (!window.ResizeObserver) {
    window.ResizeObserver = ResizeObserverMock;
}
