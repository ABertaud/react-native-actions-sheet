import React, { createContext, useContext, useEffect, useRef, useState, } from 'react';
import { actionSheetEventManager } from './eventmanager';
export var providerRegistryStack = [];
/**
 * An object that holds all the sheet components against their ids.
 */
export var sheetsRegistry = {};
// Registers your Sheet with the SheetProvider.
export function registerSheet(id, Sheet) {
    /**
     * @deprecated Does nothing
     */
    var _contexts = [];
    for (
    /**
     * @deprecated Does nothing
     */
    var _i = 2; 
    /**
     * @deprecated Does nothing
     */
    _i < arguments.length; 
    /**
     * @deprecated Does nothing
     */
    _i++) {
        /**
         * @deprecated Does nothing
         */
        _contexts[_i - 2] = arguments[_i];
    }
    if (!id || !Sheet)
        return;
    sheetsRegistry[id] = Sheet;
    actionSheetEventManager.publish('context-on-register');
}
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
export function SheetProvider(_a) {
    var _b = _a.context, context = _b === void 0 ? 'global' : _b, children = _a.children;
    var _c = useState(Object.keys(sheetsRegistry)), sheetIds = _c[0], setSheetIds = _c[1];
    useEffect(function () {
        if (providerRegistryStack.indexOf(context) === -1) {
            providerRegistryStack.push(context);
        }
        else {
            if (__DEV__) {
                console.warn("You are trying to register multiple SheetProviders with the same context id: ".concat(context, ". Use a unique context id for each SheetProvider in your app."));
            }
        }
        var onRegister = function () {
            setSheetIds(Object.keys(sheetsRegistry));
        };
        var sub = actionSheetEventManager.subscribe("context-on-register", onRegister);
        setSheetIds(Object.keys(sheetsRegistry));
        return function () {
            providerRegistryStack.splice(providerRegistryStack.indexOf(context), 1);
            sub === null || sub === void 0 ? void 0 : sub.unsubscribe();
        };
    }, [context]);
    var renderSheet = React.useCallback(function (sheetId) { return (<RenderSheet key={sheetId + context} id={sheetId} context={context}/>); }, [context]);
    return (<ProviderContext.Provider value={context}>
      {children}
      {sheetIds.map(renderSheet)}
    </ProviderContext.Provider>);
}
var ProviderContext = createContext('global');
var SheetIDContext = createContext(undefined);
export var SheetRefContext = createContext({});
var SheetPayloadContext = createContext(undefined);
/**
 * Get id of the current context in which this component is rendered.
 */
export var useProviderContext = function () { return useContext(ProviderContext); };
/**
 * Get id of the current sheet in which the current component is rendered.
 */
export var useSheetIDContext = function () { return useContext(SheetIDContext); };
/**
 * Get the current Sheet's internal ref.
 * @returns
 */
export function useSheetRef(_id) {
    return useContext(SheetRefContext);
}
/**
 * Get the payload this sheet was opened with.
 * @returns
 */
export function useSheetPayload(_id) {
    return useContext(SheetPayloadContext);
}
var RenderSheet = function (_a) {
    var id = _a.id, context = _a.context;
    var _b = useState(), payload = _b[0], setPayload = _b[1];
    var _c = useState(null), overrideProps = _c[0], setOverrideProps = _c[1];
    var _d = useState(false), visible = _d[0], setVisible = _d[1];
    var ref = useRef(null);
    var clearPayloadTimeoutRef = useRef(null);
    var Sheet = sheetsRegistry[id] || null;
    var visibleRef = useRef(false);
    visibleRef.current = visible;
    var snapIndex = useRef(undefined);
    useEffect(function () {
        if (visible) {
            actionSheetEventManager.publish("show_".concat(id), payload, context, snapIndex.current);
        }
    }, [context, id, payload, visible]);
    useEffect(function () {
        var onShow = function (data, ctx, overrideProps, snapIndexValue) {
            if (ctx === void 0) { ctx = 'global'; }
            if (ctx !== context)
                return;
            clearTimeout(clearPayloadTimeoutRef.current);
            setPayload(data);
            setOverrideProps(overrideProps);
            snapIndex.current = snapIndexValue;
            setVisible(true);
        };
        var onClose = function (_data, ctx) {
            if (ctx === void 0) { ctx = 'global'; }
            if (context !== ctx)
                return;
            setVisible(false);
            clearTimeout(clearPayloadTimeoutRef.current);
            clearPayloadTimeoutRef.current = setTimeout(function () {
                setPayload(undefined);
            }, 50);
        };
        var onHide = function (data, ctx) {
            if (ctx === void 0) { ctx = 'global'; }
            actionSheetEventManager.publish("hide_".concat(id), data, ctx);
        };
        var onUpdate = function (data, ctx, overrideProps) {
            if (ctx === void 0) { ctx = 'global'; }
            if (ctx !== context || !visibleRef.current)
                return;
            clearTimeout(clearPayloadTimeoutRef.current);
            setPayload(data);
            setOverrideProps(overrideProps);
        };
        var subs = [
            actionSheetEventManager.subscribe("update_".concat(id), onUpdate),
            actionSheetEventManager.subscribe("show_wrap_".concat(id), onShow),
            actionSheetEventManager.subscribe("onclose_".concat(id), onClose),
            actionSheetEventManager.subscribe("hide_wrap_".concat(id), onHide),
        ];
        return function () {
            subs.forEach(function (s) { return s.unsubscribe(); });
        };
    }, []);
    if (!Sheet)
        return null;
    return !visible ? null : (<SheetIDContext.Provider value={id}>
      <SheetRefContext.Provider value={ref}>
        <SheetPayloadContext.Provider value={payload}>
          <Sheet sheetId={id} payload={payload} overrideProps={overrideProps}/>
        </SheetPayloadContext.Provider>
      </SheetRefContext.Provider>
    </SheetIDContext.Provider>);
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
export function SheetRegister(props) {
    useEffect(function () {
        Object.keys(props.sheets).forEach(function (id) {
            if (!props.sheets[id]) {
                throw new Error("SheetRegistry trying to register ".concat(id, " that is not a React Component."));
            }
            if (sheetsRegistry[id]) {
                if (__DEV__) {
                    console.warn("SheetRegistry tried to register sheet with the same id ".concat(id, " multiple times. If you are registering Sheets will multiple SheetRegistery components, make sure the ids are unique."));
                }
                return;
            }
            sheetsRegistry[id] = props.sheets[id];
        });
        actionSheetEventManager.publish('context-on-register');
        return function () {
            Object.keys(props.sheets).forEach(function (id) {
                delete sheetsRegistry[id];
            });
            actionSheetEventManager.publish('context-on-register');
        };
    }, [props.sheets]);
    return null;
}
