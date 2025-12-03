import React, { useCallback, useImperativeHandle } from 'react';
import { FlatList as RNGHFlatList } from 'react-native-gesture-handler';
import { useScrollBounce } from '../hooks/use-scroll-bounce';
import { useScrollHandlers } from '../hooks/use-scroll-handlers';
var DEFAULT_REFRESH_CONTROL_BOUNDARY = 0.15;
function $FlatList(props, ref) {
    var _a;
    var handlers = useScrollHandlers({
        hasRefreshControl: !!props.refreshControl,
        refreshControlBoundary: (_a = props.refreshControlGestureArea) !== null && _a !== void 0 ? _a : DEFAULT_REFRESH_CONTROL_BOUNDARY,
    });
    var bounceHandlers = useScrollBounce({
        onScrollBeginDrag: props.onScrollBeginDrag,
        onScrollEndDrag: props.onScrollEndDrag,
        onMomentumScrollEnd: props.onMomentumScrollEnd,
    });
    useImperativeHandle(ref, function () { return handlers.ref.current; });
    var handleScroll = useCallback(function (event) {
        var _a;
        handlers.onScroll(event);
        (_a = props.onScroll) === null || _a === void 0 ? void 0 : _a.call(props, event);
    }, [handlers, props]);
    var handleLayout = useCallback(function (event) {
        var _a;
        handlers.onLayout();
        (_a = props.onLayout) === null || _a === void 0 ? void 0 : _a.call(props, event);
    }, [handlers, props]);
    var isScrollEnabled = handlers.scrollEnabled && props.scrollEnabled !== false;
    return (<RNGHFlatList {...props} ref={handlers.ref} simultaneousHandlers={handlers.simultaneousHandlers} scrollEventThrottle={handlers.scrollEventThrottle} scrollEnabled={isScrollEnabled} onScrollBeginDrag={bounceHandlers.onScrollBeginDrag} onScrollEndDrag={bounceHandlers.onScrollEndDrag} onMomentumScrollEnd={bounceHandlers.onMomentumScrollEnd} onScroll={handleScroll} onLayout={handleLayout} bounces={bounceHandlers.bounces} alwaysBounceVertical={bounceHandlers.alwaysBounceVertical}/>);
}
export var FlatList = React.forwardRef($FlatList);
