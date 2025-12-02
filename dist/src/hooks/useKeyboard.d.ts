import React from 'react';
type ScreenRect = {
    screenX: number;
    screenY: number;
    width: number;
    height: number;
};
export declare function useKeyboard(enabled: boolean): {
    keyboardShown: boolean;
    coordinates: {
        start: ScreenRect | Readonly<{
            screenX: 0;
            screenY: 0;
            width: 0;
            height: 0;
        }>;
        end: ScreenRect | Readonly<{
            screenX: 0;
            screenY: 0;
            width: 0;
            height: 0;
        }>;
    };
    keyboardHeight: number;
    pauseKeyboardHandler: React.RefObject<boolean>;
    reset: () => void;
};
export {};
//# sourceMappingURL=useKeyboard.d.ts.map