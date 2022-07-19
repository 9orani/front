import fetch from 'node-fetch';

import PeerConnectionMock from './test/PeerConnectionMock';
import ResizeObserverMock from './test/ResizeObserverMock';

if (!window.fetch) {
    window.fetch = fetch;
}

if (!window.RTCPeerConnection) {
    window.RTCPeerConnection = PeerConnectionMock;
}

if (!window.ResizeObserver) {
    window.ResizeObserver = ResizeObserverMock;
}
