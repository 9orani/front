import { FourCC } from '../js/WebRTC/utils/FourCC';

import { MouseState } from '../js/WebRTC/inputState/MouseState';
import { KeyboardState } from '../js/WebRTC/inputState/KeyboardState';
import { TouchScreenState } from '../js/WebRTC/inputState/TouchScreenState';

describe('FourCC', () => {
    test('toInt32', () => {
        const number = new FourCC('A', 'A', 'A', 'A').toInt32();
        expect(number).toBe(0x41414141);
    });
});

describe('MouseState', () => {
    describe('with MouseEvent', () => {
        let event;

        beforeEach(() => {
            event = new MouseEvent('click', {
                buttons: 1,
                clientX: 0,
                clientY: 0,
            });
        });

        test('format', () => {
            const format = new MouseState(event).format;
            expect(format).toBe(0x4d4f5553);
        });

        test('buffer', () => {
            const state = new MouseState(event);
            expect(state.buffer.byteLength).toBeGreaterThan(0);
        });
    });

    describe('with WheelEvent', () => {
        let event;

        beforeEach(() => {
            event = new WheelEvent('wheel', { deltaX: 0, deltaY: 0 });
        });

        test('format', () => {
            const format = new MouseState(event).format;
            expect(format).toBe(0x4d4f5553);
        });

        test('buffer', () => {
            const state = new MouseState(event);
            expect(state.buffer.byteLength).toBeGreaterThan(0);
        });
    });
});

describe('KeyBoardState', () => {
    let event;

    beforeEach(() => {
        event = new KeyboardEvent('keydown', { code: 'KeyA' });
    });

    test('format', () => {
        const format = new KeyboardState(event).format;
        expect(format).toBe(0x4b455953);
    });

    test('buffer', () => {
        const state = new KeyboardState(event);
        expect(state.buffer.byteLength).toBeGreaterThan(0);
    });
});

describe('TouchScreenState', () => {
    let event;

    beforeEach(() => {
        event = new TouchEvent('touchstart', {
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
    });

    test('format', () => {
        const format = new TouchScreenState(event, null, Date.now()).format;
        expect(format).toBe(0x54534352);
    });

    test('buffer', () => {
        const state = new TouchScreenState(event, null, Date.now());
        expect(state.buffer.byteLength).toBeGreaterThan(0);
    });
});
