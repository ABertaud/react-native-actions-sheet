import { useCallback, useEffect, useRef, useState } from 'react';
import { Platform, } from 'react-native';
import { runOnJS, useAnimatedReaction } from 'react-native-reanimated';
import { useDraggableNodesContext, usePanGestureContext, } from '../context';
export var ScrollState = {
    END: -1,
};
var INITIAL_LAYOUT_RECT = {
    w: 0,
    h: 0,
    x: 0,
    y: 0,
    px: 0,
    py: 0,
};
var LAYOUT_MEASURE_DEBOUNCE_MS = 100;
var LAYOUT_HEIGHT_PADDING = 10;
export function resolveScrollRef(ref) {
    var _a, _b, _c, _d, _e, _f;
    if ((_a = ref.current) === null || _a === void 0 ? void 0 : _a._listRef) {
        return (_b = ref.current._listRef) === null || _b === void 0 ? void 0 : _b._scrollRef;
    }
    if ((_c = ref.current) === null || _c === void 0 ? void 0 : _c.rlvRef) {
        return (_f = (_e = (_d = ref.current) === null || _d === void 0 ? void 0 : _d.rlvRef) === null || _e === void 0 ? void 0 : _e._scrollComponent) === null || _f === void 0 ? void 0 : _f._scrollViewRef;
    }
    return ref.current;
}
export function useDraggable(options) {
    var gestureContext = usePanGestureContext();
    var draggableNodes = useDraggableNodesContext();
    var nodeRef = useRef(null);
    var offset = useRef({ x: 0, y: 0 });
    var layout = useRef(INITIAL_LAYOUT_RECT);
    useEffect(function () {
        var _a, _b;
        var nodeIndex = (_a = draggableNodes.nodes.current) === null || _a === void 0 ? void 0 : _a.findIndex(function (node) { return node.ref === nodeRef; });
        var nodeNotRegistered = nodeIndex === undefined || nodeIndex === -1;
        if (nodeNotRegistered) {
            (_b = draggableNodes.nodes.current) === null || _b === void 0 ? void 0 : _b.push({
                ref: nodeRef,
                offset: offset,
                rect: layout,
                handlerConfig: options || {},
            });
        }
        return function () {
            var _a, _b;
            var index = (_a = draggableNodes.nodes.current) === null || _a === void 0 ? void 0 : _a.findIndex(function (node) { return node.ref === nodeRef; });
            if (index !== undefined && index > -1) {
                (_b = draggableNodes.nodes.current) === null || _b === void 0 ? void 0 : _b.splice(index, 1);
            }
        };
    }, [draggableNodes.nodes, options]);
    return {
        nodeRef: nodeRef,
        offset: offset,
        draggableNodes: draggableNodes,
        layout: layout,
        gestureContext: gestureContext,
    };
}
/**
 * Creates scroll handlers for a scrollable view inside an action sheet.
 * Automatically manages scroll enabling based on sheet snap position.
 *
 * @example
 * ```tsx
 * const handlers = useScrollHandlers<RNScrollView>();
 * return (
 *   <NativeViewGestureHandler simultaneousHandlers={handlers.simultaneousHandlers}>
 *     <ScrollableView {...handlers} />
 *   </NativeViewGestureHandler>
 * );
 * ```
 */
export function useScrollHandlers(options) {
    var _a = useDraggable(options), nodeRef = _a.nodeRef, gestureContext = _a.gestureContext, offset = _a.offset, layout = _a.layout;
    var measureTimer = useRef(null);
    var offsetChangeSubscription = useRef(null);
    var _b = useState(true), scrollEnabled = _b[0], setScrollEnabled = _b[1];
    var updateLayout = useCallback(function (x, y, w, h, px, py) {
        layout.current = { x: x, y: y, w: w, h: h + LAYOUT_HEIGHT_PADDING, px: px, py: py };
    }, [layout]);
    var measureAndUpdateLayout = useCallback(function () {
        if (measureTimer.current) {
            clearTimeout(measureTimer.current);
        }
        measureTimer.current = setTimeout(function () {
            var _a;
            var scrollRef = resolveScrollRef(nodeRef);
            if (!scrollRef)
                return;
            if (Platform.OS === 'web') {
                var rect = scrollRef.getBoundingClientRect();
                scrollRef.style.overflow = 'auto';
                updateLayout(rect.x, rect.y, rect.width, rect.height, rect.left, rect.top);
            }
            else {
                (_a = scrollRef === null || scrollRef === void 0 ? void 0 : scrollRef.measure) === null || _a === void 0 ? void 0 : _a.call(scrollRef, updateLayout);
            }
        }, LAYOUT_MEASURE_DEBOUNCE_MS);
    }, [nodeRef, updateLayout]);
    var onLayout = useCallback(function () {
        var _a;
        measureAndUpdateLayout();
        (_a = offsetChangeSubscription.current) === null || _a === void 0 ? void 0 : _a.unsubscribe();
        offsetChangeSubscription.current = gestureContext.eventManager.subscribe('onoffsetchange', measureAndUpdateLayout);
    }, [measureAndUpdateLayout, gestureContext.eventManager]);
    var onScroll = useCallback(function (event) {
        var _a = event.nativeEvent.contentOffset, x = _a.x, y = _a.y;
        var maxOffsetX = event.nativeEvent.contentSize.width - layout.current.w;
        var isAtHorizontalEnd = x >= maxOffsetX - 5;
        offset.current = {
            x: isAtHorizontalEnd ? ScrollState.END : x,
            y: y,
        };
        // DEBUG: Log when near top
        if (y <= 10 && y >= -50) {
            console.log('[ScrollHandler Debug] offsetY:', y.toFixed(2));
        }
    }, [layout, offset]);
    useAnimatedReaction(function () { var _a, _b; return (_b = (_a = gestureContext.scrollEnabled) === null || _a === void 0 ? void 0 : _a.value) !== null && _b !== void 0 ? _b : true; }, function (isEnabled, previousValue) {
        if (isEnabled !== previousValue) {
            runOnJS(setScrollEnabled)(isEnabled);
        }
    }, [gestureContext.scrollEnabled]);
    useEffect(function () {
        return function () {
            var _a;
            (_a = offsetChangeSubscription.current) === null || _a === void 0 ? void 0 : _a.unsubscribe();
            if (measureTimer.current) {
                clearTimeout(measureTimer.current);
            }
        };
    }, []);
    return {
        ref: nodeRef,
        simultaneousHandlers: [gestureContext.ref],
        onScroll: onScroll,
        scrollEventThrottle: 1,
        onLayout: onLayout,
        scrollEnabled: scrollEnabled,
    };
}
