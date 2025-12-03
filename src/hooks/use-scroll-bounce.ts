import {useCallback, useRef, useState} from 'react';
import {NativeScrollEvent, NativeSyntheticEvent} from 'react-native';

const VELOCITY_THRESHOLD = 0.1;
const TOP_THRESHOLD = 5;
const BOUNCE_ACTIVATION_THRESHOLD = 10;

type ScrollEvent = NativeSyntheticEvent<NativeScrollEvent>;

type BounceCallbacks = {
  onScrollBeginDrag?: (event: ScrollEvent) => void;
  onScrollEndDrag?: (event: ScrollEvent) => void;
  onMomentumScrollEnd?: (event: ScrollEvent) => void;
  onScroll?: (event: ScrollEvent) => void;
};

/**
 * Manages bounce behavior for scrollable components inside action sheets.
 * Disables bounce when scroll is at top to allow sheet gesture handling.
 */
export function useScrollBounce(callbacks?: BounceCallbacks) {
  const [bounces, setBounces] = useState(false);
  const isInteracting = useRef(false);
  const startOffsetY = useRef(0);

  const onScrollBeginDrag = useCallback(
    (event: ScrollEvent) => {
      isInteracting.current = true;
      startOffsetY.current = event.nativeEvent.contentOffset.y;
      callbacks?.onScrollBeginDrag?.(event);
    },
    [callbacks],
  );

  const onScroll = useCallback(
    (event: ScrollEvent) => {
      if (!isInteracting.current) {
        callbacks?.onScroll?.(event);
        return;
      }

      const offsetY = event.nativeEvent.contentOffset.y;

      // Only enable bounce when user has scrolled down enough from a position above threshold
      // This prevents bounce from activating when at top and swiping down
      if (offsetY > BOUNCE_ACTIVATION_THRESHOLD && !bounces) {
        setBounces(true);
      }

      callbacks?.onScroll?.(event);
    },
    [callbacks, bounces],
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
    onScroll,
  };
}
