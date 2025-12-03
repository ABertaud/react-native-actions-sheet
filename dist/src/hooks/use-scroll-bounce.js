import { useCallback, useRef, useState } from 'react';
var VELOCITY_THRESHOLD = 0.1;
var TOP_THRESHOLD = 5;
var BOUNCE_ACTIVATION_THRESHOLD = 10;
/**
 * Manages bounce behavior for scrollable components inside action sheets.
 * Disables bounce when scroll is at top to allow sheet gesture handling.
 */
export function useScrollBounce(callbacks) {
    var _a = useState(false), bounces = _a[0], setBounces = _a[1];
    var isInteracting = useRef(false);
    var startOffsetY = useRef(0);
    var onScrollBeginDrag = useCallback(function (event) {
        var _a;
        isInteracting.current = true;
        startOffsetY.current = event.nativeEvent.contentOffset.y;
        (_a = callbacks === null || callbacks === void 0 ? void 0 : callbacks.onScrollBeginDrag) === null || _a === void 0 ? void 0 : _a.call(callbacks, event);
    }, [callbacks]);
    var onScroll = useCallback(function (event) {
        var _a, _b;
        if (!isInteracting.current) {
            (_a = callbacks === null || callbacks === void 0 ? void 0 : callbacks.onScroll) === null || _a === void 0 ? void 0 : _a.call(callbacks, event);
            return;
        }
        var offsetY = event.nativeEvent.contentOffset.y;
        // Only enable bounce when user has scrolled down enough from a position above threshold
        // This prevents bounce from activating when at top and swiping down
        if (offsetY > BOUNCE_ACTIVATION_THRESHOLD && !bounces) {
            setBounces(true);
        }
        (_b = callbacks === null || callbacks === void 0 ? void 0 : callbacks.onScroll) === null || _b === void 0 ? void 0 : _b.call(callbacks, event);
    }, [callbacks, bounces]);
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
        onScroll: onScroll,
    };
}
