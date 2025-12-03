import { useCallback, useRef, useState } from 'react';
var VELOCITY_THRESHOLD = 0.1;
var TOP_THRESHOLD = 5;
/**
 * Manages bounce behavior for scrollable components inside action sheets.
 * Disables bounce when scroll is at top to allow sheet gesture handling.
 */
export function useScrollBounce(callbacks) {
    var _a = useState(true), bounces = _a[0], setBounces = _a[1];
    var isInteracting = useRef(false);
    var onScrollBeginDrag = useCallback(function (event) {
        var _a;
        isInteracting.current = true;
        var offsetY = event.nativeEvent.contentOffset.y;
        // If we're in overscroll (bounce), keep bounce disabled to prevent conflicts
        if (offsetY >= 0) {
            setBounces(true);
        }
        (_a = callbacks === null || callbacks === void 0 ? void 0 : callbacks.onScrollBeginDrag) === null || _a === void 0 ? void 0 : _a.call(callbacks, event);
    }, [callbacks]);
    var onScrollEndDrag = useCallback(function (event) {
        var _a, _b, _c;
        var velocity = (_b = (_a = event.nativeEvent.velocity) === null || _a === void 0 ? void 0 : _a.y) !== null && _b !== void 0 ? _b : 0;
        var hasMomentum = Math.abs(velocity) > VELOCITY_THRESHOLD;
        if (!hasMomentum) {
            var offsetY = event.nativeEvent.contentOffset.y;
            if (offsetY <= TOP_THRESHOLD) {
                isInteracting.current = false;
                setBounces(false);
            }
        }
        (_c = callbacks === null || callbacks === void 0 ? void 0 : callbacks.onScrollEndDrag) === null || _c === void 0 ? void 0 : _c.call(callbacks, event);
    }, [callbacks]);
    var onMomentumScrollEnd = useCallback(function (event) {
        var _a;
        isInteracting.current = false;
        var offsetY = event.nativeEvent.contentOffset.y;
        if (offsetY <= TOP_THRESHOLD) {
            setBounces(false);
        }
        (_a = callbacks === null || callbacks === void 0 ? void 0 : callbacks.onMomentumScrollEnd) === null || _a === void 0 ? void 0 : _a.call(callbacks, event);
    }, [callbacks]);
    return {
        bounces: bounces,
        alwaysBounceVertical: false,
        onScrollBeginDrag: onScrollBeginDrag,
        onScrollEndDrag: onScrollEndDrag,
        onMomentumScrollEnd: onMomentumScrollEnd,
    };
}
