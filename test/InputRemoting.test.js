import { DOMRect } from './DOMRect';

import { Sender } from '../src/js/WebRTC/Sender';
import { Observer } from '../src/js/WebRTC/Observer';

import { InputRemoting } from '../src/js/WebRTC/input/InputRemoting';
import { InputDevice } from '../src/js/WebRTC/input/InputDevice';

import { NewDeviceMsg } from '../src/js/WebRTC/message/NewDeviceMsg';
import { NewEventsMsg } from '../src/js/WebRTC/message/NewEventsMsg';
import { RemoveDeviceMsg } from '../src/js/WebRTC/message/RemoveDeviceMsg';

import { MouseState } from '../src/js/WebRTC/inputState/MouseState';
import { KeyboardState } from '../src/js/WebRTC/inputState/KeyboardState';
import { TouchScreenState } from '../src/js/WebRTC/inputState/TouchScreenState';

import { MessageType } from '../src/js/WebRTC/constants/MessageType';

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

test('create NewDeviceMsg', () => {
    const device = new InputDevice('Keyboard', 'Keyboard', 0, null, null);
    const msg = NewDeviceMsg.create(device);

    expect(msg.participant_id).toBe(0);
    expect(msg.type).toBe(MessageType.NewDevice);
    expect(msg.data).toBeInstanceOf(ArrayBuffer);
    expect(msg.data.byteLength).toBeGreaterThan(0);
});

describe('create NewDeviceMsg', () => {
    test('using MouseState', () => {
        const event = new MouseEvent('click', {
            buttons: 0,
            clientX: 0,
            clientY: 0,
        });
        const state = new MouseState(event);
        const msg = NewEventsMsg.create(state);

        expect(msg.participant_id).toBe(0);
        expect(msg.type).toBe(MessageType.NewEvents);
        expect(msg.data).toBeInstanceOf(ArrayBuffer);
        expect(msg.data.byteLength).toBeGreaterThan(0);
    });

    test('using KeyboardState', () => {
        const event = new KeyboardEvent('keydown', { code: 'KeyA' });
        const state = new KeyboardState(event);
        const msg = NewEventsMsg.create(state);

        expect(msg.participant_id).toBe(0);
        expect(msg.type).toBe(MessageType.NewEvents);
        expect(msg.data).toBeInstanceOf(ArrayBuffer);
        expect(msg.data.byteLength).toBeGreaterThan(0);
    });

    test('using TouchScreenState', () => {
        const event = new TouchEvent('touchstart', {
            changedTouches: [
                {
                    identifier: 0,
                    target: null,
                    clientX: 0,
                    clientY: 0,
                    screenX: 0,
                    screenY: 0,
                    pageX: 0,
                    pageY: 0,
                    radiusX: 0,
                    radiusY: 0,
                    rotationAngle: 0,
                    force: 0,
                    altitudeAngle: 0,
                    azimuthAngle: 0,
                    touchType: 'direct',
                },
            ],
        });
        const state = new TouchScreenState(event);

        expect(state.touchData).not.toBeNull();
        expect(state.touchData).toHaveLength(1);

        const msg = NewEventsMsg.create(state.touchData[0]);

        expect(msg.participant_id).toBe(0);
        expect(msg.type).toBe(MessageType.NewEvents);
        expect(msg.data).toBeInstanceOf(ArrayBuffer);
        expect(msg.data.byteLength).toBeGreaterThan(0);
    });
});

test('create RemoveDeviceMsg', () => {
    const device = new InputDevice('Keyboard', 'Keyboard', 0, null, null);
    const msg = RemoveDeviceMsg.create(device);

    expect(msg.participant_id).toBe(0);
    expect(msg.type).toBe(MessageType.RemoveDevice);
    expect(msg.data).toBeInstanceOf(ArrayBuffer);
    expect(msg.data.byteLength).toBeGreaterThan(0);
});
