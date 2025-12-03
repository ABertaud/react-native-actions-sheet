import React, {RefObject, useCallback, useImperativeHandle, useMemo} from 'react';
import {FlatListProps} from 'react-native';
import {FlatList as RNGHFlatList} from 'react-native-gesture-handler';
import {useScrollBounce} from '../hooks/use-scroll-bounce';
import {useScrollHandlers} from '../hooks/use-scroll-handlers';

const DEFAULT_REFRESH_CONTROL_BOUNDARY = 0.15;

type Props<T = any> = FlatListProps<T> &
  React.RefAttributes<RNGHFlatList> & {
    /**
     * By default refresh control gesture will work in top 15% area of the ScrollView.
     * You can set a different value here.
     *
     * Accepts a value between 0-1.
     */
    refreshControlGestureArea?: number;
  };

function $FlatList<T>(props: Props<T>, ref: RefObject<RNGHFlatList>) {
  const handlers = useScrollHandlers<RNGHFlatList>({
    hasRefreshControl: !!props.refreshControl,
    refreshControlBoundary: props.refreshControlGestureArea ?? DEFAULT_REFRESH_CONTROL_BOUNDARY,
  });

  const bounceCallbacks = useMemo(
    () => ({
      onScrollBeginDrag: props.onScrollBeginDrag,
      onScrollEndDrag: props.onScrollEndDrag,
      onMomentumScrollEnd: props.onMomentumScrollEnd,
      onScroll: props.onScroll,
    }),
    [props.onScrollBeginDrag, props.onScrollEndDrag, props.onMomentumScrollEnd, props.onScroll],
  );

  const bounceHandlers = useScrollBounce(bounceCallbacks);

  useImperativeHandle(ref, () => handlers.ref.current);

  const handleScroll = useCallback(
    (event: Parameters<NonNullable<FlatListProps<T>['onScroll']>>[0]) => {
      handlers.onScroll(event);
      bounceHandlers.onScroll(event);
    },
    [handlers, bounceHandlers],
  );

  const handleLayout = useCallback(
    (event: Parameters<NonNullable<FlatListProps<T>['onLayout']>>[0]) => {
      handlers.onLayout();
      props.onLayout?.(event);
    },
    [handlers.onLayout, props.onLayout],
  );

  const isScrollEnabled = handlers.scrollEnabled && props.scrollEnabled !== false;

  return (
    <RNGHFlatList
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

export const FlatList = React.forwardRef($FlatList) as <T = any>(
  props: Props<T> & {ref?: React.Ref<RNGHFlatList>},
) => React.ReactElement;
