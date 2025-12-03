import React from 'react';
import { FlatListProps } from 'react-native';
import { FlatList as RNGHFlatList } from 'react-native-gesture-handler';
type Props<T = any> = FlatListProps<T> & React.RefAttributes<RNGHFlatList> & {
    /**
     * By default refresh control gesture will work in top 15% area of the ScrollView.
     * You can set a different value here.
     *
     * Accepts a value between 0-1.
     */
    refreshControlGestureArea?: number;
};
export declare const FlatList: <T = any>(props: Props<T> & {
    ref?: React.Ref<RNGHFlatList>;
}) => React.ReactElement;
export {};
//# sourceMappingURL=FlatList.d.ts.map