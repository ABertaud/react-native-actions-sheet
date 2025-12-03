import {useCallback, useEffect, useRef, useState} from 'react';
import {
  NativeMethods,
  NativeScrollEvent,
  NativeSyntheticEvent,
  Platform,
} from 'react-native';
import {runOnJS, useAnimatedReaction} from 'react-native-reanimated';
import {
  DraggableNodeOptions,
  LayoutRect,
  useDraggableNodesContext,
  usePanGestureContext,
} from '../context';
import {EventHandlerSubscription} from '../eventmanager';

export const ScrollState = {
  END: -1,
};

const INITIAL_LAYOUT_RECT: LayoutRect = {
  w: 0,
  h: 0,
  x: 0,
  y: 0,
  px: 0,
  py: 0,
};

const LAYOUT_MEASURE_DEBOUNCE_MS = 100;
const LAYOUT_HEIGHT_PADDING = 10;

export function resolveScrollRef(ref: any) {
  if (ref.current?._listRef) {
    return ref.current._listRef?._scrollRef;
  }
  if (ref.current?.rlvRef) {
    return ref.current?.rlvRef?._scrollComponent?._scrollViewRef;
  }
  return ref.current;
}

export function useDraggable<T>(options?: DraggableNodeOptions) {
  const gestureContext = usePanGestureContext();
  const draggableNodes = useDraggableNodesContext();
  const nodeRef = useRef<T>(null);
  const offset = useRef({x: 0, y: 0});
  const layout = useRef<LayoutRect>(INITIAL_LAYOUT_RECT);

  useEffect(() => {
    const nodeIndex = draggableNodes.nodes.current?.findIndex(
      node => node.ref === nodeRef,
    );
    const nodeNotRegistered = nodeIndex === undefined || nodeIndex === -1;

    if (nodeNotRegistered) {
      draggableNodes.nodes.current?.push({
        ref: nodeRef,
        offset: offset,
        rect: layout,
        handlerConfig: options || ({} as DraggableNodeOptions),
      });
    }

    return () => {
      const index = draggableNodes.nodes.current?.findIndex(
        node => node.ref === nodeRef,
      );
      if (index !== undefined && index > -1) {
        draggableNodes.nodes.current?.splice(index, 1);
      }
    };
  }, [draggableNodes.nodes, options]);

  return {
    nodeRef,
    offset,
    draggableNodes,
    layout,
    gestureContext,
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
export function useScrollHandlers<T>(options?: DraggableNodeOptions) {
  const {nodeRef, gestureContext, offset, layout} = useDraggable<T>(options);
  const measureTimer = useRef<NodeJS.Timeout>(null);
  const offsetChangeSubscription = useRef<EventHandlerSubscription>(null);
  const [scrollEnabled, setScrollEnabled] = useState(true);

  const updateLayout = useCallback(
    (x: number, y: number, w: number, h: number, px: number, py: number) => {
      layout.current = {x, y, w, h: h + LAYOUT_HEIGHT_PADDING, px, py};
    },
    [layout],
  );

  const measureAndUpdateLayout = useCallback(() => {
    if (measureTimer.current) {
      clearTimeout(measureTimer.current);
    }

    measureTimer.current = setTimeout(() => {
      const scrollRef = resolveScrollRef(nodeRef);
      if (!scrollRef) return;

      if (Platform.OS === 'web') {
        const rect = (scrollRef as HTMLDivElement).getBoundingClientRect();
        (scrollRef as HTMLDivElement).style.overflow = 'auto';
        updateLayout(
          rect.x,
          rect.y,
          rect.width,
          rect.height,
          rect.left,
          rect.top,
        );
      } else {
        (scrollRef as NativeMethods)?.measure?.(updateLayout);
      }
    }, LAYOUT_MEASURE_DEBOUNCE_MS);
  }, [nodeRef, updateLayout]);

  const onLayout = useCallback(() => {
    measureAndUpdateLayout();
    offsetChangeSubscription.current?.unsubscribe();
    offsetChangeSubscription.current = gestureContext.eventManager.subscribe(
      'onoffsetchange',
      measureAndUpdateLayout,
    );
  }, [measureAndUpdateLayout, gestureContext.eventManager]);

  const onScroll = useCallback(
    (event: NativeSyntheticEvent<NativeScrollEvent>) => {
      const {x, y} = event.nativeEvent.contentOffset;
      const maxOffsetX = event.nativeEvent.contentSize.width - layout.current.w;
      const isAtHorizontalEnd = x >= maxOffsetX - 5;

      offset.current = {
        x: isAtHorizontalEnd ? ScrollState.END : x,
        y,
      };
    },
    [layout, offset],
  );

  useAnimatedReaction(
    () => gestureContext.scrollEnabled?.value ?? true,
    (isEnabled, previousValue) => {
      if (isEnabled !== previousValue) {
        runOnJS(setScrollEnabled)(isEnabled);
      }
    },
    [gestureContext.scrollEnabled],
  );

  useEffect(() => {
    return () => {
      offsetChangeSubscription.current?.unsubscribe();
      if (measureTimer.current) {
        clearTimeout(measureTimer.current);
      }
    };
  }, []);

  return {
    ref: nodeRef,
    simultaneousHandlers: [gestureContext.ref],
    onScroll,
    scrollEventThrottle: 1,
    onLayout,
    scrollEnabled,
  };
}
