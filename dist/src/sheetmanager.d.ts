import { RefObject } from 'react';
import { ActionSheetProps, ActionSheetRef, Sheets } from './types';
/**
 * Get rendered action sheets stack
 * @returns
 */
export declare function getSheetStack(): {
    id: string;
    context: string;
}[];
/**
 * A function that checks whether the action sheet with the given id is rendered on top or not.
 * @param id
 * @param context
 * @returns
 */
export declare function isRenderedOnTop(id: string, context?: string): boolean;
/**
 * Set the base zIndex upon which action sheets will be stacked. Should be called once in the global space.
 *
 * Default `baseZIndex` is `999`.
 *
 * @param zIndex
 */
export declare function setBaseZIndexForActionSheets(zIndex: number): void;
/**
 * Since non modal based sheets are stacked one above the other, they need to have
 * different zIndex for gestures to work correctly.
 * @param id
 * @param context
 * @returns
 */
export declare function getZIndexFromStack(id: string, context: string): number;
declare class _SheetManager {
    context(options?: {
        context?: string;
        id?: string;
    }): string;
    /**
     * Show the ActionSheet with an id.
     *
     * @param id id of the ActionSheet to show
     * @param options
     */
    show<SheetId extends keyof Sheets>(id: SheetId | (string & {}), options?: {
        /**
         * Any data to pass to the ActionSheet. Will be available from the component `props` or in `onBeforeShow` prop on the action sheet.
         */
        payload?: Sheets[SheetId]['payload'];
        /**
         * Recieve payload from the Sheet when it closes
         */
        onClose?: (data: Sheets[SheetId]['returnValue'] | undefined) => void;
        /**
         * Provide `context` of the `SheetProvider` where you want to show the action sheet.
         */
        context?: string;
        /**
         * Override a ActionSheet's props that were defined when the component was declared.
         *
         * You need to forward these props to the ActionSheet component manually.
         * ```tsx
         * function ExampleSheet(props: SheetProps<'example-sheet'>) {
    return (
      <ActionSheet
        disableElevation={true}
        gestureEnabled
        {...props.overrideProps}
      />
    );
  }
         * ```
         */
        overrideProps?: ActionSheetProps<SheetId>;
        snapIndex?: number;
    }): Promise<Sheets[SheetId]['returnValue']>;
    /**
     * Update an active ActionSheet with new payload or override it's props.
     */
    update<SheetId extends keyof Sheets>(id: SheetId, options: {
        /**
         * Provide `context` of the `SheetProvider` where the action sheet is rendered.
         */
        context?: string;
        /**
         * Any data to pass to the ActionSheet. Will be available from the component `props` or in `onBeforeShow` prop on the action sheet.
         */
        payload: Sheets[SheetId]['payload'];
        /**
         * Override a ActionSheet's props that were defined when the component was declared.
         *
         * You need to forward these props to the ActionSheet component manually.
         * ```tsx
         * function ExampleSheet(props: SheetProps<'example-sheet'>) {
    return (
      <ActionSheet
        disableElevation={true}
        gestureEnabled
        {...props.overrideProps}
      />
    );
  }
         * ```
         */
        overrideProps?: ActionSheetProps<SheetId>;
        /**
         * If there are multiple sheets active with the same id, you can provide this function to select
         * which sheet to update based on current payload or other sheet data.
         */
        shouldUpdate?: (sheet: {
            id: SheetId;
            context: string;
            ref: RefObject<ActionSheetRef<SheetId>>;
        }) => Promise<boolean>;
    }): Promise<void>;
    /**
     * An async hide function. This is useful when you want to show one ActionSheet after closing another.
     *
     * @param id id of the ActionSheet to show
     * @param data
     */
    hide<SheetId extends keyof Sheets>(id: SheetId | (string & {}), options?: {
        /**
         * Return some data to the caller on closing the Sheet.
         */
        payload?: Sheets[SheetId]['returnValue'];
        /**
         * Provide `context` of the `SheetProvider` to hide the action sheet.
         */
        context?: string;
    }): Promise<Sheets[SheetId]['returnValue']>;
    /**
     * Hide all the opened ActionSheets.
     *
     * @param id Hide all sheets for the specific id.
     */
    hideAll<SheetId extends keyof Sheets>(id?: SheetId | (string & {})): void;
    registerRef: (id: string, context: string, instance: RefObject<ActionSheetRef>) => void;
    /**
     *
     * Get internal ref of a sheet by the given id.
     *
     * @param id Id of the sheet
     * @param context Context in which the sheet is rendered. Normally this function returns the top most rendered sheet ref automatically.
     */
    get: <SheetId extends keyof Sheets>(id: SheetId | (string & {}), context?: string) => RefObject<ActionSheetRef<SheetId>>;
    add: (id: string, context: string) => void;
    remove: (id: string, context: string) => void;
    /**
     * Get all rendered sheets for a Sheet Id.
     */
    getActiveSheets<SheetId extends keyof Sheets>(id: SheetId): {
        id: SheetId;
        context: string;
        ref: RefObject<ActionSheetRef<SheetId>>;
    }[];
}
/**
 * SheetManager is used to imperitively show/hide any ActionSheet with a
 * unique id prop.
 */
export declare const SheetManager: _SheetManager;
export {};
//# sourceMappingURL=sheetmanager.d.ts.map