import { DOMRect } from './DOMRect';

import { Sender } from '../src/js/WebRTC/Sender';
import { InputRemoting } from '../src/js/WebRTC/input/InputRemoting';
import { Observer } from '../src/js/WebRTC/Observer';

describe('InputRemoting', () => {
    let sender = null;
    let inputRemoting = null;
    let observer = null;

    beforeEach(async () => {
        document.getBoundingClientRect = function () {
            return new DOMRect(0, 0, 0, 0);
        };

        sender = new Sender(document);
        inputRemoting = new InputRemoting(sender);

        let channel = null;
        observer = new Observer(channel);
    });

    test('startSending', () => {
        expect.assertions(0);
        inputRemoting.startSending();
    });

    test('stopSending', () => {
        expect.assertions(0);
        inputRemoting.stopSending();
    });

    test('subscribe', () => {
        expect.assertions(0);
        inputRemoting.subscribe(observer);
    });
});
