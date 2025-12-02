declare const useSheetManager: ({ id, onHide, onBeforeShow, onContextUpdate, }: {
    id?: string;
    onHide: (data?: any) => void;
    onBeforeShow?: (data?: any, snapIndex?: number) => void;
    onContextUpdate: () => void;
}) => {
    visible: boolean;
    setVisible: import("react").Dispatch<import("react").SetStateAction<boolean>>;
    visibleRef: import("react").RefObject<{
        value: boolean;
    }>;
};
export default useSheetManager;
//# sourceMappingURL=use-sheet-manager.d.ts.map