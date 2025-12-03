import {useCallback, useRef, useState} from 'react';
import {NativeScrollEvent, NativeSyntheticEvent} from 'react-native';

const VELOCITY_THRESHOLD = 0.1;
const TOP_THRESHOLD = 5;

type ScrollEvent = NativeSyntheticEvent<NativeScrollEvent>;

type BounceCallbacks = {
  onScrollBeginDrag?: (event: ScrollEvent) => void;
  onScrollEndDrag?: (event: ScrollEvent) => void;
  onMomentumScrollEnd?: (event: ScrollEvent) => void;
};

/**
 * Manages bounce behavior for scrollable components inside action sheets.
 * Disables bounce when scroll is at top to allow sheet gesture handling.
 */
export function useScrollBounce(callbacks?: BounceCallbacks) {
  const [bounces, setBounces] = useState(true);
  const isInteracting = useRef(false);

  const onScrollBeginDrag = useCallback(
    (event: ScrollEvent) => {
      isInteracting.current = true;
      const offsetY = event.nativeEvent.contentOffset.y;
      // If we're in overscroll (bounce), keep bounce disabled to prevent conflicts
      if (offsetY >= 0) {
        setBounces(true);
      }
      callbacks?.onScrollBeginDrag?.(event);
    },
    [callbacks],
  );

  const onScrollEndDrag = useCallback(
    (event: ScrollEvent) => {
      const velocity = event.nativeEvent.velocity?.y ?? 0;
      const hasMomentum = Math.abs(velocity) > VELOCITY_THRESHOLD;

      if (!hasMomentum) {
        const offsetY = event.nativeEvent.contentOffset.y;
        if (offsetY <= TOP_THRESHOLD) {
          isInteracting.current = false;
          setBounces(false);
        }
      }
      callbacks?.onScrollEndDrag?.(event);
    },
    [callbacks],
  );

  const onMomentumScrollEnd = useCallback(
    (event: ScrollEvent) => {
      isInteracting.current = false;
      const offsetY = event.nativeEvent.contentOffset.y;
      if (offsetY <= TOP_THRESHOLD) {
        setBounces(false);
      }
      callbacks?.onMomentumScrollEnd?.(event);
    },
    [callbacks],
  );

  return {
    bounces,
    alwaysBounceVertical: false,
    onScrollBeginDrag,
    onScrollEndDrag,
    onMomentumScrollEnd,
  };
}
