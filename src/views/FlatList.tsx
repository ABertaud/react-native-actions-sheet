/* eslint-disable curly */
import React, {RefObject, useImperativeHandle, useState} from 'react';
import {FlatList as RNGHFlatList} from 'react-native-gesture-handler';
import {useScrollHandlers} from '../hooks/use-scroll-handlers';
import {FlatListProps} from 'react-native';
type Props<T = any> = FlatListProps<T> &
  React.RefAttributes<RNGHFlatList> & {
    /**
     * By default refresh control gesture will work in top 15% area of the ScrollView. You can set a different value here.
     *
     * Accepts a value between 0-1.
     */
    refreshControlGestureArea?: number;
  };

function $FlatList<T>(props: Props<T>, ref: RefObject<RNGHFlatList>) {
  const handlers = useScrollHandlers<any>({
    hasRefreshControl: !!props.refreshControl,
    refreshControlBoundary: props.refreshControlGestureArea || 0.15,
  });
  useImperativeHandle(ref, () => handlers.ref.current);
  const [bounces, setBounces] = useState(true);
  const isInteractingRef = React.useRef(false);

  return (
    <RNGHFlatList
      {...props}
      ref={handlers.ref}
      simultaneousHandlers={handlers.simultaneousHandlers}
      scrollEventThrottle={handlers.scrollEventThrottle}
      onScrollBeginDrag={event => {
        isInteractingRef.current = true;
        // Enable bounces whenever we start scrolling
        setBounces(true);
        props.onScrollBeginDrag?.(event);
      }}
      onScrollEndDrag={event => {
        const velocity = event.nativeEvent.velocity?.y || 0;
        const hasNegativeVelocity = Math.abs(velocity) > 0.1;
        
        // If no momentum, interaction might be ending
        if (!hasNegativeVelocity) {
          const offsetY = event.nativeEvent.contentOffset.y;
          if (offsetY <= 0) {
            isInteractingRef.current = false;
            setBounces(false);
          }
        }
        props.onScrollEndDrag?.(event);
      }}
      onMomentumScrollEnd={event => {
        isInteractingRef.current = false;
        const offsetY = event.nativeEvent.contentOffset.y;
        // Disable bounce only if we're at the top
        if (offsetY <= 0) {
          setBounces(false);
        }
        props.onMomentumScrollEnd?.(event);
      }}
      onScroll={event => {
        handlers.onScroll(event);
        props.onScroll?.(event);
      }}
      onLayout={event => {
        handlers.onLayout();
        props.onLayout?.(event);
      }}
      bounces={bounces}
      alwaysBounceVertical={false}
    />
  );
}

export const FlatList = React.forwardRef($FlatList) as <T = any>(
  props: Props<T> & { ref?: React.Ref<RNGHFlatList> }
) => React.ReactElement;
