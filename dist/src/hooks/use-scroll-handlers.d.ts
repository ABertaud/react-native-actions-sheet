import { NativeScrollEvent, NativeSyntheticEvent } from 'react-native';
import { DraggableNodeOptions, LayoutRect } from '../context';
export declare const ScrollState: {
    END: number;
};
export declare function resolveScrollRef(ref: any): any;
export declare function useDraggable<T>(options?: DraggableNodeOptions): {
    nodeRef: import("react").RefObject<T>;
    offset: import("react").RefObject<{
        x: number;
        y: number;
    }>;
    draggableNodes: import("../context").DraggableNodes;
    layout: import("react").RefObject<LayoutRect>;
    gestureContext: {
        ref: import("react").RefObject<any>;
        eventManager: typeof import("../eventmanager").actionSheetEventManager;
        scrollEnabled?: import("react-native-reanimated").SharedValue<boolean>;
    };
};
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
export declare function useScrollHandlers<T>(options?: DraggableNodeOptions): {
    ref: import("react").RefObject<T>;
    simultaneousHandlers: import("react").RefObject<any>[];
    onScroll: (event: NativeSyntheticEvent<NativeScrollEvent>) => void;
    scrollEventThrottle: number;
    onLayout: () => void;
    scrollEnabled: boolean;
};
//# sourceMappingURL=use-scroll-handlers.d.ts.map