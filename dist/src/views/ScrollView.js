/* eslint-disable curly */
import React, { useImperativeHandle, useState } from 'react';
import { ScrollView as RNGHScrollView } from 'react-native-gesture-handler';
import { useScrollHandlers } from '../hooks/use-scroll-handlers';
function $ScrollView(props, ref) {
    var handlers = useScrollHandlers({
        hasRefreshControl: !!props.refreshControl,
        refreshControlBoundary: props.refreshControlGestureArea || 0.15,
    });
    useImperativeHandle(ref, function () { return handlers.ref.current; });
    var _a = useState(true), bounces = _a[0], setBounces = _a[1];
    var isInteractingRef = React.useRef(false);
    return (<RNGHScrollView {...props} ref={handlers.ref} simultaneousHandlers={handlers.simultaneousHandlers} scrollEventThrottle={handlers.scrollEventThrottle} onScrollBeginDrag={function (event) {
            var _a;
            isInteractingRef.current = true;
            // Enable bounces whenever we start scrolling
            setBounces(true);
            (_a = props.onScrollBeginDrag) === null || _a === void 0 ? void 0 : _a.call(props, event);
        }} onScrollEndDrag={function (event) {
            var _a, _b;
            var velocity = ((_a = event.nativeEvent.velocity) === null || _a === void 0 ? void 0 : _a.y) || 0;
            var hasNegativeVelocity = Math.abs(velocity) > 0.1;
            // If no momentum, interaction might be ending
            if (!hasNegativeVelocity) {
                var offsetY = event.nativeEvent.contentOffset.y;
                if (offsetY <= 0) {
                    isInteractingRef.current = false;
                    setBounces(false);
                }
            }
            (_b = props.onScrollEndDrag) === null || _b === void 0 ? void 0 : _b.call(props, event);
        }} onMomentumScrollEnd={function (event) {
            var _a;
            isInteractingRef.current = false;
            var offsetY = event.nativeEvent.contentOffset.y;
            // Disable bounce only if we're at the top
            if (offsetY <= 0) {
                setBounces(false);
            }
            (_a = props.onMomentumScrollEnd) === null || _a === void 0 ? void 0 : _a.call(props, event);
        }} onScroll={function (event) {
            var _a;
            handlers.onScroll(event);
            (_a = props.onScroll) === null || _a === void 0 ? void 0 : _a.call(props, event);
        }} onLayout={function (event) {
            var _a;
            handlers.onLayout();
            (_a = props.onLayout) === null || _a === void 0 ? void 0 : _a.call(props, event);
        }} bounces={bounces} alwaysBounceVertical={false}/>);
}
export var ScrollView = React.forwardRef($ScrollView);
