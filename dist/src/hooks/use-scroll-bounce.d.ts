import { NativeScrollEvent, NativeSyntheticEvent } from 'react-native';
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
export declare function useScrollBounce(callbacks?: BounceCallbacks): {
    bounces: boolean;
    alwaysBounceVertical: boolean;
    onScrollBeginDrag: (event: ScrollEvent) => void;
    onScrollEndDrag: (event: ScrollEvent) => void;
    onMomentumScrollEnd: (event: ScrollEvent) => void;
};
export {};
//# sourceMappingURL=use-scroll-bounce.d.ts.map