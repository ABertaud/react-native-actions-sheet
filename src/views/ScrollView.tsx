import React, {
  RefObject,
  useCallback,
  useImperativeHandle,
  useMemo,
} from 'react';
import {ScrollView as RNScrollView, ScrollViewProps} from 'react-native';
import {ScrollView as RNGHScrollView} from 'react-native-gesture-handler';
import {useScrollBounce} from '../hooks/use-scroll-bounce';
import {useScrollHandlers} from '../hooks/use-scroll-handlers';

const DEFAULT_REFRESH_CONTROL_BOUNDARY = 0.15;

type Props = ScrollViewProps &
  React.RefAttributes<RNScrollView> & {
    /**
     * By default refresh control gesture will work in top 15% area of the ScrollView.
     * You can set a different value here.
     *
     * Accepts a value between 0-1.
     */
    refreshControlGestureArea?: number;
  };

function $ScrollView(props: Props, ref: RefObject<RNScrollView>) {
  const handlers = useScrollHandlers<RNScrollView>({
    hasRefreshControl: !!props.refreshControl,
    refreshControlBoundary:
      props.refreshControlGestureArea ?? DEFAULT_REFRESH_CONTROL_BOUNDARY,
  });

  const bounceCallbacks = useMemo(
    () => ({
      onScrollBeginDrag: props.onScrollBeginDrag,
      onScrollEndDrag: props.onScrollEndDrag,
      onMomentumScrollEnd: props.onMomentumScrollEnd,
      onScroll: props.onScroll,
    }),
    [
      props.onScrollBeginDrag,
      props.onScrollEndDrag,
      props.onMomentumScrollEnd,
      props.onScroll,
    ],
  );

  const bounceHandlers = useScrollBounce(bounceCallbacks);

  useImperativeHandle(ref, () => handlers.ref.current);

  const handleScroll = useCallback(
    (event: Parameters<NonNullable<ScrollViewProps['onScroll']>>[0]) => {
      handlers.onScroll(event);
      bounceHandlers.onScroll(event);
    },
    [handlers, bounceHandlers],
  );

  const handleLayout = useCallback(
    (event: Parameters<NonNullable<ScrollViewProps['onLayout']>>[0]) => {
      handlers.onLayout();
      props.onLayout?.(event);
    },
    [handlers.onLayout, props.onLayout],
  );

  const isScrollEnabled =
    handlers.scrollEnabled && props.scrollEnabled !== false;

  return (
    <RNGHScrollView
      {...props}
      ref={handlers.ref}
      simultaneousHandlers={handlers.simultaneousHandlers}
      scrollEventThrottle={handlers.scrollEventThrottle}
      scrollEnabled={isScrollEnabled}
      onScrollBeginDrag={bounceHandlers.onScrollBeginDrag}
      onScrollEndDrag={bounceHandlers.onScrollEndDrag}
      onMomentumScrollEnd={bounceHandlers.onMomentumScrollEnd}
      onScroll={handleScroll}
      onLayout={handleLayout}
      bounces={bounceHandlers.bounces}
      alwaysBounceVertical={bounceHandlers.alwaysBounceVertical}
    />
  );
}

export const ScrollView = React.forwardRef(
  $ScrollView,
) as unknown as typeof RNScrollView;
