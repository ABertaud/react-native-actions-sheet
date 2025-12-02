import React, { ReactNode, RefObject } from 'react';
import { ActionSheetProps, ActionSheetRef, Sheets } from './types';
export declare const providerRegistryStack: string[];
/**
 * An object that holds all the sheet components against their ids.
 */
export declare const sheetsRegistry: {
    [id: string]: React.ElementType;
};
export interface SheetProps<SheetId extends keyof Sheets = never> {
    sheetId: SheetId | (string & {});
    payload?: Sheets[SheetId]['payload'];
    overrideProps?: ActionSheetProps;
}
export declare function registerSheet<SheetId extends keyof Sheets = never>(id: SheetId | (string & {}), Sheet: React.ElementType, 
/**
 * @deprecated Does nothing
 */
..._contexts: string[]): void;
/**
 * The SheetProvider makes available the sheets in a given context. The default context is
 * `global`. However if you want to render a Sheet within another sheet or if you want to render
 * Sheets in a modal. You can use a seperate Provider with a custom context value.
 *
 * For example
```ts
// Define your SheetProvider in the component/modal where
// you want to show some Sheets.
<SheetProvider context="local-context" />

// Then register your sheet when for example the
// Modal component renders.

registerSheet('local-sheet', LocalSheet,'local-context');

```
 * @returns
 */
export declare function SheetProvider({ context, children, }: {
    context?: string;
    children?: ReactNode;
}): React.JSX.Element;
export declare const SheetRefContext: React.Context<React.RefObject<ActionSheetRef>>;
/**
 * Get id of the current context in which this component is rendered.
 */
export declare const useProviderContext: () => string;
/**
 * Get id of the current sheet in which the current component is rendered.
 */
export declare const useSheetIDContext: () => string;
/**
 * Get the current Sheet's internal ref.
 * @returns
 */
export declare function useSheetRef<SheetId extends keyof Sheets = never>(_id?: SheetId | (string & {})): RefObject<ActionSheetRef<SheetId>>;
/**
 * Get the payload this sheet was opened with.
 * @returns
 */
export declare function useSheetPayload<SheetId extends keyof Sheets = never>(_id?: SheetId | (string & {})): Sheets[SheetId]["payload"];
export type SheetRegisterProps = {
    sheets: {
        [K in keyof Sheets]: React.ElementType;
    };
};
/**
 * Registers the sheet components with the global Sheet registery allowing
 * you to open sheets from anywhere in the app.
 *
 * We recommend you to use this once in your app in your `<App/>` component.
 *
 * @example
 * ```tsx
 * import {SheetProvider, SheetDefinition} from "react-native-actions-sheet";
 *
 * declare module 'react-native-actions-sheet' {
 *  export interface Sheets {
 *    'example-sheet': SheetDefinition;
 *    }
 * }
 *
 * const App = () => {
 *  return <View>
 *    <SheetRegister
 *      sheets={
 *      "example-sheet": ExampleSheet
 *    }
 *    />
 * </View>
 * }
 * ```
 */
export declare function SheetRegister(props: SheetRegisterProps): React.JSX.Element;
//# sourceMappingURL=provider.d.ts.map