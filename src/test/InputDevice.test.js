import { FourCC } from '../js/WebRTC/utils/FourCC';

import { MouseState } from '../js/WebRTC/inputState/MouseState';

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
