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
    var _a = useState(false), bounces = _a[0], setBounces = _a[1];
    return (<RNGHScrollView {...props} ref={handlers.ref} simultaneousHandlers={handlers.simultaneousHandlers} scrollEventThrottle={handlers.scrollEventThrottle} onScroll={function (event) {
            var _a;
            var offsetY = event.nativeEvent.contentOffset.y;
            if (offsetY > 0 && !bounces)
                setBounces(true);
            if (offsetY <= 0 && bounces)
                setBounces(false);
            handlers.onScroll(event);
            (_a = props.onScroll) === null || _a === void 0 ? void 0 : _a.call(props, event);
        }} onLayout={function (event) {
            var _a;
            handlers.onLayout();
            (_a = props.onLayout) === null || _a === void 0 ? void 0 : _a.call(props, event);
        }} bounces={bounces}/>);
}
export var ScrollView = React.forwardRef($ScrollView);
