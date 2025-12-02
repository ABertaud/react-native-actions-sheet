var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
import React, { forwardRef, Fragment, useCallback, useEffect, useImperativeHandle, useRef, useState, } from 'react';
import { BackHandler, Dimensions, Keyboard, Modal, PanResponder, Platform, Pressable, StyleSheet, } from 'react-native';
import { Gesture, GestureDetector, GestureHandlerRootView, } from 'react-native-gesture-handler';
import Animated, { Easing, runOnJS, runOnUI, useAnimatedStyle, useSharedValue, withSpring, withTiming, } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { DraggableNodesContext, PanGestureRefContext, } from './context';
import EventManager, { actionSheetEventManager } from './eventmanager';
import { useAccessibility } from './hooks/use-accessibility';
import { RouterContext, RouterParamsContext, useRouter, } from './hooks/use-router';
import { resolveScrollRef } from './hooks/use-scroll-handlers';
import useSheetManager from './hooks/use-sheet-manager';
import { useKeyboard } from './hooks/useKeyboard';
import { SheetProvider, useProviderContext, useSheetIDContext, useSheetPayload, useSheetRef, } from './provider';
import { getZIndexFromStack, SheetManager } from './sheetmanager';
import { styles } from './styles';
import { CloseRequestType } from './types';
import { getElevation, SUPPORTED_ORIENTATIONS } from './utils';
var AnimatedPressable = Animated.createAnimatedComponent(Pressable);
export default forwardRef(function ActionSheet(_a, ref) {
    var _this = this;
    var _b, _c;
    var _d = _a.animated, animated = _d === void 0 ? true : _d, _e = _a.closeOnPressBack, closeOnPressBack = _e === void 0 ? true : _e, _f = _a.springOffset, springOffset = _f === void 0 ? 50 : _f, _g = _a.elevation, elevation = _g === void 0 ? 5 : _g, _h = _a.disableElevation, disableElevation = _h === void 0 ? false : _h, _j = _a.defaultOverlayOpacity, defaultOverlayOpacity = _j === void 0 ? 0.3 : _j, _k = _a.overlayColor, overlayColor = _k === void 0 ? 'black' : _k, _l = _a.closable, closable = _l === void 0 ? true : _l, _m = _a.closeOnTouchBackdrop, closeOnTouchBackdrop = _m === void 0 ? true : _m, onTouchBackdrop = _a.onTouchBackdrop, _o = _a.drawUnderStatusBar, drawUnderStatusBar = _o === void 0 ? false : _o, _p = _a.gestureEnabled, gestureEnabled = _p === void 0 ? false : _p, _q = _a.isModal, isModal = _q === void 0 ? true : _q, _r = _a.snapPoints, snapPoints = _r === void 0 ? [100] : _r, _s = _a.initialSnapIndex, initialSnapIndex = _s === void 0 ? 0 : _s, _t = _a.overdrawEnabled, overdrawEnabled = _t === void 0 ? true : _t, _u = _a.overdrawFactor, overdrawFactor = _u === void 0 ? 15 : _u, _v = _a.overdrawSize, overdrawSize = _v === void 0 ? 100 : _v, _w = _a.zIndex, zIndex = _w === void 0 ? 999 : _w, _x = _a.keyboardHandlerEnabled, keyboardHandlerEnabled = _x === void 0 ? true : _x, ExtraOverlayComponent = _a.ExtraOverlayComponent, returnValue = _a.returnValue, routes = _a.routes, initialRoute = _a.initialRoute, onBeforeShow = _a.onBeforeShow, enableRouterBackNavigation = _a.enableRouterBackNavigation, onBeforeClose = _a.onBeforeClose, _y = _a.enableGesturesInScrollView, enableGesturesInScrollView = _y === void 0 ? true : _y, disableDragBeyondMinimumSnapPoint = _a.disableDragBeyondMinimumSnapPoint, _z = _a.useBottomSafeAreaPadding, useBottomSafeAreaPadding = _z === void 0 ? true : _z, _0 = _a.initialTranslateFactor, initialTranslateFactor = _0 === void 0 ? 1.1 : _0, _1 = _a.openAnimationConfig, openAnimationConfig = _1 === void 0 ? {
        damping: 110,
        mass: 4,
        stiffness: 900,
        overshootClamping: true,
    } : _1, onRequestClose = _a.onRequestClose, animatedPosition = _a.animatedPosition, props = __rest(_a, ["animated", "closeOnPressBack", "springOffset", "elevation", "disableElevation", "defaultOverlayOpacity", "overlayColor", "closable", "closeOnTouchBackdrop", "onTouchBackdrop", "drawUnderStatusBar", "gestureEnabled", "isModal", "snapPoints", "initialSnapIndex", "overdrawEnabled", "overdrawFactor", "overdrawSize", "zIndex", "keyboardHandlerEnabled", "ExtraOverlayComponent", "returnValue", "routes", "initialRoute", "onBeforeShow", "enableRouterBackNavigation", "onBeforeClose", "enableGesturesInScrollView", "disableDragBeyondMinimumSnapPoint", "useBottomSafeAreaPadding", "initialTranslateFactor", "openAnimationConfig", "onRequestClose", "animatedPosition"]);
    snapPoints =
        snapPoints[snapPoints.length - 1] !== 100
            ? __spreadArray(__spreadArray([], snapPoints, true), [100], false) : snapPoints;
    var initialValue = useRef(-1);
    var actionSheetHeight = useRef(0);
    var insets = useSafeAreaInsets();
    var internalEventManager = React.useMemo(function () { return new EventManager(); }, []);
    var currentContext = useProviderContext();
    var currentSnapIndex = useRef(initialSnapIndex);
    var accessibilityInfo = useAccessibility();
    var sheetRef = useSheetRef();
    var sheetHeightRef = useRef(0);
    var minTranslateValue = useRef(0);
    var keyboardWasVisible = useRef(false);
    var animationListenerId = 266786;
    var id = useSheetIDContext();
    var sheetId = props.id || id;
    var panViewRef = useRef(null);
    var rootViewContainerRef = useRef(null);
    var payload = useSheetPayload();
    var payloadRef = useRef(undefined);
    payloadRef.current = payload;
    var gestureBoundaries = useRef({});
    var hiding = useRef(false);
    var returnValueRef = useRef(returnValue);
    var sheetPayload = useSheetPayload();
    var panGestureRef = useRef(undefined);
    var closing = useRef(false);
    var draggableNodes = useRef([]);
    var _2 = useState({
        width: -1,
        height: -1,
    }), dimensions = _2[0], setDimensions = _2[1];
    var dimensionsRef = useRef(dimensions);
    dimensionsRef.current = dimensions;
    var containerStyle = StyleSheet.flatten(props.containerStyle);
    var _3 = useSheetManager({
        id: sheetId,
        onHide: function (data) {
            hideSheet(undefined, data, true);
        },
        onBeforeShow: function (data, snapIndex) {
            var _a;
            (_a = routerRef.current) === null || _a === void 0 ? void 0 : _a.initialNavigation();
            if (snapIndex !== undefined) {
                currentSnapIndex.current = snapIndex;
            }
            onBeforeShow === null || onBeforeShow === void 0 ? void 0 : onBeforeShow(data);
        },
        onContextUpdate: function () {
            if (sheetId) {
                SheetManager.add(sheetId, currentContext);
                SheetManager.registerRef(sheetId, currentContext, {
                    current: getRef(),
                });
            }
        },
    }), visible = _3.visible, setVisible = _3.setVisible, visibleRef = _3.visibleRef;
    var opacity = useSharedValue(0);
    var actionSheetOpacity = useSharedValue(1);
    var internalTranslateY = useSharedValue(Dimensions.get('window').height * 2);
    var translateY = animatedPosition || internalTranslateY;
    var underlayTranslateY = useSharedValue(130);
    var routeOpacity = useSharedValue(0);
    var router = useRouter({
        routes: routes,
        getRef: function () { return getRef(); },
        initialRoute: initialRoute,
        onNavigate: props.onNavigate,
        onNavigateBack: props.onNavigateBack,
        routeOpacity: routeOpacity,
    });
    var routerRef = useRef(router);
    returnValueRef.current = returnValue;
    routerRef.current = router;
    var keyboard = useKeyboard(keyboardHandlerEnabled);
    var prevSnapIndex = useRef(initialSnapIndex);
    var draggableNodesContext = React.useMemo(function () { return ({
        nodes: draggableNodes,
    }); }, []);
    var notifyOffsetChange = function (value) {
        internalEventManager.publish('onoffsetchange', value);
    };
    var notifySnapIndexChanged = React.useCallback(function () {
        var _a;
        if (prevSnapIndex.current !== currentSnapIndex.current) {
            prevSnapIndex.current = currentSnapIndex.current;
            (_a = props.onSnapIndexChange) === null || _a === void 0 ? void 0 : _a.call(props, currentSnapIndex.current);
        }
    }, [props.onSnapIndexChange]);
    var moveSheetWithAnimation = React.useCallback(function (velocity, value, min, gestureEnd) {
        var initial = value || initialValue.current;
        var minTranslate = min || minTranslateValue.current;
        if (!animated) {
            translateY.value = initial;
            return;
        }
        var config = openAnimationConfig;
        var correctedValue = initial > minTranslate ? initial : 0;
        notifyOffsetChange(correctedValue);
        if (accessibilityInfo.current.prefersCrossFadeTransitions &&
            !gestureEnd) {
            actionSheetOpacity.value = 0;
            translateY.value = initial;
            actionSheetOpacity.value = withTiming(1, {
                duration: 150,
                easing: Easing.in(Easing.ease),
            });
        }
        else {
            translateY.value = withSpring(initial, __assign(__assign({}, config), { velocity: typeof velocity !== 'number' ? undefined : velocity }));
        }
        notifySnapIndexChanged();
    }, [animated, openAnimationConfig]);
    var animationSheetOpacity = React.useCallback(function (value) {
        opacity.value = withTiming(value, {
            duration: 300,
            easing: Easing.in(Easing.ease),
        });
    }, []);
    var hideSheetWithAnimation = React.useCallback(function (vy, callback, gestureEnd) {
        if (!animated) {
            callback === null || callback === void 0 ? void 0 : callback();
            return;
        }
        var config = props.closeAnimationConfig;
        animationSheetOpacity(0);
        var endTranslateValue = dimensionsRef.current.height * 1.3;
        if (accessibilityInfo.current.prefersCrossFadeTransitions &&
            !gestureEnd) {
            actionSheetOpacity.value = withTiming(0, {
                duration: 200,
                easing: Easing.in(Easing.ease),
            }, function (finished) {
                if (finished) {
                    translateY.value = endTranslateValue;
                }
            });
        }
        else {
            translateY.value = withTiming(endTranslateValue, config || {
                velocity: typeof vy !== 'number' ? 3.0 : vy + 1,
                duration: 200,
            });
        }
        /**
         * Using setTimeout to ensure onClose is triggered when sheet is off screen
         * or is close to reaching off screen.
         */
        setTimeout(function () { return callback(); }, (config === null || config === void 0 ? void 0 : config.duration) || 200);
    }, [animated, animationSheetOpacity, props.closeAnimationConfig, setVisible]);
    var getCurrentPosition = React.useCallback(function () {
        return translateY.value <= minTranslateValue.current + 5
            ? 0
            : translateY.value;
    }, []);
    var getNextPosition = React.useCallback(function (snapIndex) {
        return (actionSheetHeight.current +
            minTranslateValue.current -
            (actionSheetHeight.current * snapPoints[snapIndex]) / 100);
    }, [snapPoints]);
    var hardwareBackPressEvent = useRef(null);
    var Root = isModal && !(props === null || props === void 0 ? void 0 : props.backgroundInteractionEnabled) ? Modal : Animated.View;
    useEffect(function () {
        if (drawUnderStatusBar || props.onChange) {
            var prevPercentage_1 = 0;
            var onValueChange_1 = function (value) {
                var _a;
                var correctedValue = value > minTranslateValue.current
                    ? value - minTranslateValue.current
                    : 0;
                var percentage = ((actionSheetHeight.current - correctedValue) /
                    actionSheetHeight.current) *
                    100;
                var rounded = Math.round(percentage);
                if (rounded !== prevPercentage_1 && rounded > -1) {
                    prevPercentage_1 = rounded;
                    (_a = props.onChange) === null || _a === void 0 ? void 0 : _a.call(props, Math.round(percentage));
                }
                var percentScreenCovered = (actionSheetHeight.current /
                    (dimensionsRef.current.height - insets.top)) *
                    100;
                if (drawUnderStatusBar) {
                    if (percentage > 85 && percentScreenCovered > 99) {
                        var distanceFromTop = 100 - percentage;
                        underlayTranslateY.value = Math.max((actionSheetHeight.current / 100) * distanceFromTop);
                    }
                    else {
                        underlayTranslateY.value = 130;
                    }
                }
                else {
                    underlayTranslateY.value = 130;
                }
            };
            runOnUI(function () {
                translateY.addListener(animationListenerId, function (value) {
                    runOnJS(onValueChange_1)(value);
                });
            })();
        }
        return function () {
            runOnUI(function (animationListener) {
                translateY.removeListener(animationListener);
            })(animationListenerId);
        };
    }, [
        props === null || props === void 0 ? void 0 : props.id,
        keyboard.keyboardShown,
        keyboard.keyboardHeight,
        dimensions,
    ]);
    var onSheetLayout = React.useCallback(function (height) { return __awaiter(_this, void 0, void 0, function () {
        var sheetHeight, rootViewHeight, minTranslate, initial, nextInitialValue, sheetBottomEdgePosition, sheetPositionWithKeyboard;
        var _a, _b;
        return __generator(this, function (_c) {
            sheetHeight = height;
            sheetHeightRef.current = sheetHeight;
            if (dimensionsRef.current.height === -1) {
                return [2 /*return*/];
            }
            if (closing.current)
                return [2 /*return*/];
            rootViewHeight = (_a = dimensionsRef.current) === null || _a === void 0 ? void 0 : _a.height;
            actionSheetHeight.current =
                sheetHeight > dimensionsRef.current.height
                    ? dimensionsRef.current.height
                    : sheetHeight;
            minTranslate = 0;
            initial = initialValue.current;
            minTranslate = rootViewHeight - actionSheetHeight.current;
            if (initial === -1) {
                translateY.value = rootViewHeight * initialTranslateFactor;
            }
            nextInitialValue = actionSheetHeight.current +
                minTranslate -
                (actionSheetHeight.current * snapPoints[currentSnapIndex.current]) /
                    100;
            initial =
                (keyboard.keyboardShown || keyboardWasVisible.current) &&
                    initial <= nextInitialValue &&
                    initial >= minTranslate
                    ? initial
                    : nextInitialValue;
            sheetBottomEdgePosition = initial +
                (actionSheetHeight.current * snapPoints[currentSnapIndex.current]) /
                    100;
            sheetPositionWithKeyboard = sheetBottomEdgePosition -
                (((_b = dimensionsRef.current) === null || _b === void 0 ? void 0 : _b.height) - keyboard.keyboardHeight);
            initial = keyboard.keyboardShown
                ? initial - sheetPositionWithKeyboard
                : initial;
            if (keyboard.keyboardShown) {
                minTranslate = minTranslate - keyboard.keyboardHeight;
            }
            minTranslateValue.current = minTranslate;
            initialValue.current = initial;
            animationSheetOpacity(defaultOverlayOpacity);
            moveSheetWithAnimation(undefined, initial, minTranslate);
            if (initial > 130) {
                underlayTranslateY.value = 130;
            }
            if (Platform.OS === 'web') {
                document.body.style.overflowY = 'hidden';
                document.documentElement.style.overflowY = 'hidden';
            }
            return [2 /*return*/];
        });
    }); }, [
        snapPoints,
        keyboard.keyboardShown,
        keyboard.keyboardHeight,
        animationSheetOpacity,
        translateY,
        underlayTranslateY,
        moveSheetWithAnimation,
    ]);
    var hideSheet = React.useCallback(function (vy, data, isSheetManagerOrRef, gestureEnd) {
        if (hiding.current)
            return;
        var closeRequestResult = true;
        if (gestureEnd) {
            if (onRequestClose) {
                closeRequestResult = onRequestClose === null || onRequestClose === void 0 ? void 0 : onRequestClose(CloseRequestType.SWIPE);
            }
        }
        if ((!closable || !closeRequestResult) && !isSheetManagerOrRef) {
            var next = getNextPosition(currentSnapIndex.current);
            moveSheetWithAnimation(vy, next, undefined, gestureEnd);
            initialValue.current = next;
            return;
        }
        hiding.current = true;
        onBeforeClose === null || onBeforeClose === void 0 ? void 0 : onBeforeClose((data || returnValueRef.current || data));
        if (closable) {
            closing.current = true;
            Keyboard.dismiss();
            runOnUI(function (animationListener) {
                translateY.removeListener(animationListener);
            })(animationListenerId);
        }
        var onCompleteAnimation = function () {
            var _a, _b;
            if (closable || isSheetManagerOrRef) {
                setVisible(false);
                visibleRef.current.value = false;
                if (props.onClose) {
                    (_a = props.onClose) === null || _a === void 0 ? void 0 : _a.call(props, (data || returnValueRef.current || data));
                    hiding.current = false;
                }
                (_b = hardwareBackPressEvent.current) === null || _b === void 0 ? void 0 : _b.remove();
                if (sheetId) {
                    SheetManager.remove(sheetId, currentContext);
                    hiding.current = false;
                    actionSheetEventManager.publish("onclose_".concat(sheetId), data || returnValueRef.current || data, currentContext || 'global');
                }
                else {
                    hiding.current = false;
                }
                currentSnapIndex.current = initialSnapIndex;
                closing.current = false;
                initialValue.current = -1;
                keyboard.reset();
            }
            else {
                opacity.value = 1;
                moveSheetWithAnimation(1, undefined, undefined, gestureEnd);
            }
        };
        hideSheetWithAnimation(vy, onCompleteAnimation, gestureEnd);
        if (Platform.OS === 'web') {
            document.body.style.overflowY = 'auto';
            document.documentElement.style.overflowY = 'auto';
        }
    }, [
        closable,
        hideSheetWithAnimation,
        props.onClose,
        moveSheetWithAnimation,
        keyboard,
        setVisible,
    ]);
    var onHardwareBackPress = React.useCallback(function () {
        var _a, _b;
        if (visible &&
            enableRouterBackNavigation &&
            ((_a = routerRef.current) === null || _a === void 0 ? void 0 : _a.canGoBack())) {
            (_b = routerRef.current) === null || _b === void 0 ? void 0 : _b.goBack();
            return true;
        }
        var closeRequestResult = true;
        if (onRequestClose) {
            closeRequestResult = onRequestClose === null || onRequestClose === void 0 ? void 0 : onRequestClose(CloseRequestType.BACK_PRESS);
        }
        if (visible && closable && closeOnPressBack && closeRequestResult) {
            hideSheet();
            return true;
        }
        return false;
    }, [
        closable,
        closeOnPressBack,
        hideSheet,
        enableRouterBackNavigation,
        visible,
    ]);
    /**
     * Snap towards the top
     */
    var snapForward = React.useCallback(function (vy, gestureEnd) {
        if (currentSnapIndex.current === snapPoints.length - 1) {
            var next_1 = getNextPosition(currentSnapIndex.current);
            moveSheetWithAnimation(vy, next_1, undefined, gestureEnd);
            initialValue.current = next_1;
            return;
        }
        var nextSnapPoint = 0;
        var nextSnapIndex = 0;
        if (getCurrentPosition() === 0) {
            nextSnapPoint = snapPoints[(nextSnapIndex = snapPoints.length - 1)];
        }
        else {
            for (var i = currentSnapIndex.current; i < snapPoints.length; i++) {
                if (getNextPosition(i) < getCurrentPosition()) {
                    nextSnapPoint = snapPoints[(nextSnapIndex = i)];
                    break;
                }
            }
        }
        if (nextSnapPoint > 100) {
            console.warn('Snap points should range between 0 to 100.');
            moveSheetWithAnimation(vy, undefined, undefined, gestureEnd);
            return;
        }
        currentSnapIndex.current = nextSnapIndex;
        var next = getNextPosition(currentSnapIndex.current);
        initialValue.current = next;
        moveSheetWithAnimation(vy, next, undefined, gestureEnd);
    }, [getCurrentPosition, getNextPosition, moveSheetWithAnimation, snapPoints]);
    /**
     * Snap towards the bottom
     */
    var snapBackward = React.useCallback(function (vy, gestureEnd) {
        if (currentSnapIndex.current === 0) {
            if (closable) {
                initialValue.current = dimensionsRef.current.height * 1.3;
                hideSheet(vy, undefined, false, gestureEnd);
            }
            else {
                var next_2 = getNextPosition(currentSnapIndex.current);
                moveSheetWithAnimation(vy, next_2, undefined, gestureEnd);
                initialValue.current = next_2;
            }
            return;
        }
        var nextSnapPoint = 0;
        var nextSnapIndex = 0;
        for (var i = currentSnapIndex.current; i > -1; i--) {
            if (getNextPosition(i) > getCurrentPosition()) {
                nextSnapPoint = snapPoints[(nextSnapIndex = i)];
                break;
            }
            if (i === 0 && getCurrentPosition() > getNextPosition(i)) {
                if (closable) {
                    initialValue.current = dimensionsRef.current.height * 1.3;
                    hideSheet(vy, undefined, undefined, gestureEnd);
                    return;
                }
            }
        }
        if (nextSnapPoint < 0) {
            console.warn('Snap points should range between 0 to 100.');
            moveSheetWithAnimation(vy, undefined, undefined, gestureEnd);
            return;
        }
        currentSnapIndex.current = nextSnapIndex;
        var next = getNextPosition(currentSnapIndex.current);
        initialValue.current = next;
        moveSheetWithAnimation(vy, next, undefined, gestureEnd);
    }, [
        closable,
        getCurrentPosition,
        getNextPosition,
        hideSheet,
        moveSheetWithAnimation,
        snapPoints,
    ]);
    function getRectBoundary(rect) {
        if (rect) {
            var w = rect.w, h = rect.h, px = rect.px, py = rect.py;
            return __assign(__assign({}, rect), { boundryX: px + w, boundryY: py + h });
        }
        return { w: 0, h: 0, px: 0, py: 0, x: 0, y: 0, boundryX: 0, boundryY: 0 };
    }
    function isTouchWithinNodeBounds(rectWithBoundary, touchY) {
        return (touchY >= rectWithBoundary.py && touchY <= rectWithBoundary.boundryY);
    }
    var getActiveDraggableNodes = React.useCallback(function (absoluteX, absoluteY, returnAllNodes) {
        var _a;
        if (((_a = draggableNodes.current) === null || _a === void 0 ? void 0 : _a.length) === 0)
            return [];
        var activeNodes = [];
        for (var _i = 0, _b = draggableNodes.current; _i < _b.length; _i++) {
            var node = _b[_i];
            var rect = getRectBoundary(node.rect.current);
            if (rect.boundryX === 0 && rect.boundryY === 0)
                continue;
            if (returnAllNodes) {
                activeNodes.push({
                    rectWithBoundary: rect,
                    node: node,
                });
            }
            else if (absoluteX > rect.px &&
                absoluteY > rect.py &&
                absoluteX < rect.boundryX &&
                absoluteY < rect.boundryY) {
                activeNodes.push({
                    rectWithBoundary: rect,
                    node: node,
                });
            }
        }
        return activeNodes;
    }, []);
    var panGesture = React.useMemo(function () {
        var prevDeltaY = 0;
        var deltaYOnGestureStart = 0;
        var velocity = 0;
        var start;
        var oldValue = 0;
        var isRefreshing = false;
        var offsets = [];
        var previousScrollOffsets = new Map();
        function scrollable(value) {
            var _a, _b, _c;
            for (var i = 0; i < draggableNodes.current.length; i++) {
                var node = draggableNodes.current[i];
                var scrollRef = resolveScrollRef(node.ref);
                if (Platform.OS === 'ios' || Platform.OS === 'web') {
                    if (!value) {
                        if (!offsets[i] || ((_a = node.offset.current) === null || _a === void 0 ? void 0 : _a.y) === 0) {
                            offsets[i] = ((_b = node.offset.current) === null || _b === void 0 ? void 0 : _b.y) || 0;
                        }
                        if (Platform.OS === 'web') {
                            scrollRef.scrollTop = offsets[i];
                        }
                        else {
                            scrollRef.scrollTo({
                                x: 0,
                                y: offsets[i],
                                animated: false,
                            });
                        }
                    }
                    else {
                        offsets[i] = ((_c = node.offset.current) === null || _c === void 0 ? void 0 : _c.y) || 0;
                    }
                }
                else if (Platform.OS === 'android') {
                    scrollRef === null || scrollRef === void 0 ? void 0 : scrollRef.setNativeProps({
                        scrollEnabled: value,
                    });
                }
            }
        }
        var blockPan = false;
        var onChange = function (absoluteX, absoluteY, translationY) {
            var _a, _b, _c;
            if (!gestureEnabled)
                return;
            var deltaY = translationY;
            var isSwipingDown = prevDeltaY < deltaY;
            prevDeltaY = deltaY;
            if (!start) {
                start = {
                    x: absoluteX,
                    y: absoluteY,
                };
                // Store scroll offsets at gesture start
                previousScrollOffsets = new Map(draggableNodes.current.map(function (node) { return [
                    node.ref,
                    node.offset.current.y || 0,
                ]; }));
            }
            var isFullOpen = getCurrentPosition() === 0;
            var returnAllNodes = !isFullOpen || (isFullOpen && !isSwipingDown);
            var activeDraggableNodes = getActiveDraggableNodes(start.x, start.y, returnAllNodes);
            // DEBUG: Log gesture state
            var allNodes = getActiveDraggableNodes(start.x, start.y, true);
            var touchInsideScrollable = allNodes.some(function (n) {
                return start.y >= n.rectWithBoundary.py &&
                    start.y <= n.rectWithBoundary.boundryY;
            });
            console.log('[GESTURE DEBUG]', {
                touchY: Math.round(start.y),
                scrollableArea: allNodes.length > 0
                    ? {
                        top: Math.round(allNodes[0].rectWithBoundary.py),
                        bottom: Math.round(allNodes[0].rectWithBoundary.boundryY),
                    }
                    : null,
                touchInsideScrollable: touchInsideScrollable,
                scrollOffset: (_c = (_b = (_a = allNodes[0]) === null || _a === void 0 ? void 0 : _a.node.offset.current) === null || _b === void 0 ? void 0 : _b.y) !== null && _c !== void 0 ? _c : 0,
                isFullOpen: isFullOpen,
            });
            if (enableGesturesInScrollView &&
                activeDraggableNodes.length > 0 &&
                !isRefreshing) {
                // Check if scroll is actively changing during the gesture (not just having an offset)
                var nodeIsScrolling = activeDraggableNodes.some(function (node) {
                    var _a;
                    var currentOffset = node.node.offset.current.y || 0;
                    var previousOffset = (_a = previousScrollOffsets.get(node.node.ref)) !== null && _a !== void 0 ? _a : currentOffset;
                    var isActuallyScrolling = currentOffset !== previousOffset;
                    previousScrollOffsets.set(node.node.ref, currentOffset);
                    return isActuallyScrolling;
                });
                /**
                 * Draggable nodes handling cases:
                 * 1. Sheet not fully open, swiping up: allow pan (sheet moves up)
                 * 2. Sheet fully open, swiping up: allow scroll (content scrolls)
                 * 3. Sheet not fully open OR fully open, swiping down:
                 *    - If scroll is active AND touch is in scrollable area: allow scroll
                 *    - Otherwise: allow pan (sheet moves down / closes)
                 * 4. Refresh control: if in refresh zone, allow scroll for pull-to-refresh
                 */
                if (!isSwipingDown) {
                    // Swiping up
                    if (isFullOpen) {
                        // Case 2: Sheet fully open, allow scroll
                        scrollable(true);
                        blockPan = true;
                    }
                    else {
                        // Case 1: Sheet not fully open, allow pan to expand sheet
                        scrollable(false);
                        blockPan = false;
                    }
                }
                else {
                    // Swiping down (cases 3 & 4)
                    var isTouchInScrollableArea = nodeIsScrolling &&
                        activeDraggableNodes.some(function (node) {
                            return isTouchWithinNodeBounds(node.rectWithBoundary, start.y);
                        });
                    // DEBUG: Log swiping down decision
                    console.log('[SWIPE DOWN DEBUG]', {
                        nodeIsScrolling: nodeIsScrolling,
                        isTouchInScrollableArea: isTouchInScrollableArea,
                        touchY: start.y,
                        willBlockPan: isTouchInScrollableArea,
                    });
                    if (isTouchInScrollableArea) {
                        scrollable(true);
                        blockPan = true;
                    }
                    else {
                        scrollable(false);
                        blockPan = false;
                        // Check for refresh control (only when sheet is fully open)
                        if (isFullOpen) {
                            if (!deltaYOnGestureStart && deltaY > 0) {
                                deltaYOnGestureStart = deltaY;
                            }
                            for (var _i = 0, activeDraggableNodes_1 = activeDraggableNodes; _i < activeDraggableNodes_1.length; _i++) {
                                var node = activeDraggableNodes_1[_i];
                                if (node.node.handlerConfig.hasRefreshControl) {
                                    var refreshControlBounds = node.rectWithBoundary.py +
                                        node.rectWithBoundary.h *
                                            node.node.handlerConfig.refreshControlBoundary;
                                    if (refreshControlBounds &&
                                        absoluteY < refreshControlBounds) {
                                        scrollable(true);
                                        blockPan = true;
                                        isRefreshing = true;
                                        break;
                                    }
                                }
                            }
                        }
                    }
                }
            }
            else if (!enableGesturesInScrollView &&
                activeDraggableNodes.length > 0) {
                blockPan = true;
            }
            else {
                // No active draggable nodes or gestures disabled - allow sheet to move
                blockPan = false;
            }
            if (isRefreshing) {
                blockPan = true;
                scrollable(true);
            }
            var value = oldValue;
            deltaY = deltaY - deltaYOnGestureStart;
            if (!blockPan) {
                value = initialValue.current + deltaY;
                oldValue = value;
            }
            if (blockPan) {
                return;
            }
            velocity = 1;
            var correctedValue = value <= minTranslateValue.current
                ? minTranslateValue.current - value
                : value;
            if (correctedValue / overdrawFactor >= overdrawSize && deltaY <= 0) {
                return;
            }
            var minSnapPoint = getNextPosition(0);
            var translateYValue = value <= minTranslateValue.current
                ? overdrawEnabled
                    ? minTranslateValue.current - correctedValue / overdrawFactor
                    : minTranslateValue.current
                : value;
            if (!closable && disableDragBeyondMinimumSnapPoint) {
                translateY.value =
                    translateYValue >= minSnapPoint ? minSnapPoint : translateYValue;
            }
            else {
                translateY.value = translateYValue;
            }
        };
        var onEnd = function () {
            if (!gestureEnabled)
                return;
            deltaYOnGestureStart = 0;
            var isMovingUp = getCurrentPosition() < initialValue.current;
            scrollable(true);
            if ((!isMovingUp &&
                getCurrentPosition() < initialValue.current + springOffset) ||
                (isMovingUp &&
                    getCurrentPosition() > initialValue.current - springOffset)) {
                moveSheetWithAnimation(1, undefined, undefined, true);
                velocity = 0;
                return;
            }
            if (!isMovingUp) {
                snapBackward(velocity, true);
            }
            else {
                snapForward(velocity, true);
            }
            velocity = 0;
        };
        return Platform.OS === 'web'
            ? PanResponder.create({
                onMoveShouldSetPanResponder: function (_event, _gesture) {
                    var activeDraggableNodes = getActiveDraggableNodes(_event.nativeEvent.pageX, _event.nativeEvent.pageY);
                    for (var _i = 0, activeDraggableNodes_2 = activeDraggableNodes; _i < activeDraggableNodes_2.length; _i++) {
                        var node = activeDraggableNodes_2[_i];
                        var scrollRef = resolveScrollRef(node.node.ref);
                        offsets.push(scrollRef.scrollTop);
                    }
                    return true;
                },
                onStartShouldSetPanResponder: function (_event, _gesture) {
                    var activeDraggableNodes = getActiveDraggableNodes(_event.nativeEvent.pageX, _event.nativeEvent.pageY);
                    for (var _i = 0, activeDraggableNodes_3 = activeDraggableNodes; _i < activeDraggableNodes_3.length; _i++) {
                        var node = activeDraggableNodes_3[_i];
                        var scrollRef = resolveScrollRef(node.node.ref);
                        offsets.push(scrollRef.scrollTop);
                    }
                    return true;
                },
                onPanResponderMove: function (_event, gesture) {
                    onChange(_event.nativeEvent.pageX, _event.nativeEvent.pageY, gesture.dy);
                },
                onPanResponderEnd: onEnd,
            })
            : Gesture.Pan()
                .withRef(panGestureRef)
                .onChange(function (event) {
                return onChange(event.absoluteX, event.absoluteY, event.translationY);
            })
                .runOnJS(true)
                .activeOffsetY([-5, 5])
                .failOffsetX([-5, 5])
                .onEnd(onEnd);
    }, [gestureEnabled]);
    var onTouch = function (event) {
        onTouchBackdrop === null || onTouchBackdrop === void 0 ? void 0 : onTouchBackdrop(event);
        if (enableRouterBackNavigation && router.canGoBack()) {
            router.goBack();
            return;
        }
        var closeRequestResult = true;
        if (onRequestClose) {
            closeRequestResult = onRequestClose === null || onRequestClose === void 0 ? void 0 : onRequestClose(CloseRequestType.TOUCH_BACKDROP);
        }
        if (closeOnTouchBackdrop && closable && closeRequestResult) {
            hideSheet();
        }
    };
    var getRef = useCallback(function () { return ({
        show: function (snapIndex) {
            var _a;
            if (typeof snapIndex === 'number') {
                currentSnapIndex.current = snapIndex;
            }
            onBeforeShow === null || onBeforeShow === void 0 ? void 0 : onBeforeShow();
            (_a = routerRef.current) === null || _a === void 0 ? void 0 : _a.initialNavigation();
            setVisible(true);
        },
        hide: function (data) {
            hideSheet(undefined, data, true);
        },
        setModalVisible: function (_visible) {
            if (_visible) {
                setVisible(true);
            }
            else {
                hideSheet();
            }
        },
        snapToOffset: function (offset) {
            initialValue.current =
                actionSheetHeight.current +
                    minTranslateValue.current -
                    (actionSheetHeight.current * offset) / 100;
            translateY.value = withSpring(initialValue.current, openAnimationConfig);
        },
        snapToRelativeOffset: function (offset) {
            if (offset === 0) {
                getRef().snapToIndex(currentSnapIndex.current);
                return;
            }
            var availableHeight = actionSheetHeight.current + minTranslateValue.current;
            initialValue.current =
                initialValue.current + initialValue.current * (offset / 100);
            if (initialValue.current > availableHeight) {
                getRef().snapToOffset(100);
                return;
            }
            translateY.value = withSpring(initialValue.current, openAnimationConfig);
        },
        snapToIndex: function (index) {
            if (index > snapPoints.length || index < 0)
                return;
            if (!visibleRef.current.value) {
                getRef().show(index);
                return;
            }
            currentSnapIndex.current = index;
            initialValue.current = getNextPosition(index);
            translateY.value = withSpring(initialValue.current, openAnimationConfig);
            notifySnapIndexChanged();
        },
        handleChildScrollEnd: function () {
            console.warn('handleChildScrollEnd has been removed. Please use `useScrollHandlers` hook to enable scrolling in ActionSheet');
        },
        modifyGesturesForLayout: function (_id, layout, scrollOffset) {
            gestureBoundaries.current[_id] = __assign(__assign({}, layout), { scrollOffset: scrollOffset });
        },
        currentSnapIndex: function () { return currentSnapIndex.current; },
        isGestureEnabled: function () { return gestureEnabled; },
        isOpen: function () { return visibleRef.current.value; },
        keyboardHandler: function (enabled) {
            keyboard.pauseKeyboardHandler.current = enabled;
        },
        ev: internalEventManager,
        currentPayload: function () { return payloadRef.current; },
    }); }, [
        internalEventManager,
        onBeforeShow,
        setVisible,
        hideSheet,
        translateY,
        openAnimationConfig,
        snapPoints.length,
        getNextPosition,
        notifySnapIndexChanged,
        gestureEnabled,
        visible,
        keyboard.pauseKeyboardHandler,
    ]);
    useImperativeHandle(ref, getRef, [getRef]);
    useEffect(function () {
        if (sheetId) {
            SheetManager.registerRef(sheetId, currentContext, {
                current: getRef(),
            });
        }
        sheetRef.current = getRef();
    }, [currentContext, getRef, sheetId, sheetRef]);
    var onModalRequestClose = React.useCallback(function () {
        var _a, _b;
        if (enableRouterBackNavigation && ((_a = routerRef.current) === null || _a === void 0 ? void 0 : _a.canGoBack())) {
            (_b = routerRef.current) === null || _b === void 0 ? void 0 : _b.goBack();
            return;
        }
        var closeRequestResult = true;
        if (onRequestClose) {
            closeRequestResult = onRequestClose === null || onRequestClose === void 0 ? void 0 : onRequestClose(CloseRequestType.BACK_PRESS);
        }
        if (visible && closable && closeOnPressBack && closeRequestResult) {
            hideSheet();
        }
    }, [hideSheet, enableRouterBackNavigation, closeOnPressBack, visible]);
    var rootProps = React.useMemo(function () {
        var _a, _b;
        return isModal && !props.backgroundInteractionEnabled
            ? {
                visible: true,
                animationType: 'none',
                testID: ((_a = props.testIDs) === null || _a === void 0 ? void 0 : _a.modal) || props.testID,
                supportedOrientations: SUPPORTED_ORIENTATIONS,
                onShow: props.onOpen,
                onRequestClose: onModalRequestClose,
                transparent: true,
                /**
                 * Always true, it causes issue with keyboard handling.
                 */
                statusBarTranslucent: true,
            }
            : {
                testID: ((_b = props.testIDs) === null || _b === void 0 ? void 0 : _b.root) || props.testID,
                onLayout: function () {
                    var _a;
                    hardwareBackPressEvent.current = BackHandler.addEventListener('hardwareBackPress', onHardwareBackPress);
                    (_a = props === null || props === void 0 ? void 0 : props.onOpen) === null || _a === void 0 ? void 0 : _a.call(props);
                },
                style: {
                    position: 'absolute',
                    zIndex: zIndex
                        ? zIndex
                        : sheetId
                            ? getZIndexFromStack(sheetId, currentContext)
                            : 999,
                    width: '100%',
                    height: '100%',
                },
                pointerEvents: (props === null || props === void 0 ? void 0 : props.backgroundInteractionEnabled)
                    ? 'box-none'
                    : 'auto',
            };
    }, [
        currentContext,
        isModal,
        onHardwareBackPress,
        onModalRequestClose,
        props,
        zIndex,
        sheetId,
    ]);
    var renderRoute = useCallback(function (route) {
        var _a;
        var RouteComponent = route.component;
        return (<Animated.View key={route.name} style={{
                display: route.name !== ((_a = router.currentRoute) === null || _a === void 0 ? void 0 : _a.name) ? 'none' : 'flex',
                opacity: routeOpacity,
            }}>
            <RouterParamsContext.Provider value={route === null || route === void 0 ? void 0 : route.params}>
              <RouteComponent router={router} params={route === null || route === void 0 ? void 0 : route.params} payload={sheetPayload}/>
            </RouterParamsContext.Provider>
          </Animated.View>);
    }, [routeOpacity, router, sheetPayload]);
    var context = {
        ref: panGestureRef,
        eventManager: internalEventManager,
    };
    var animatedOpacityStyle = useAnimatedStyle(function () {
        return {
            opacity: opacity.value,
        };
    }, [opacity]);
    var animatedActionSheetStyle = useAnimatedStyle(function () {
        return {
            transform: [
                {
                    translateY: translateY.value,
                },
            ],
            opacity: actionSheetOpacity.value,
        };
    }, [translateY]);
    var animatedUnderlayTranslateStyle = useAnimatedStyle(function () {
        return {
            transform: [
                {
                    translateY: underlayTranslateY.value,
                },
            ],
        };
    }, [underlayTranslateY]);
    var GestureMobileOnly = Platform.OS === 'web' ? Fragment : GestureDetector;
    return (<>
        {visible ? (<Root {...rootProps}>
            <GestureHandlerRoot isModal={isModal} style={styles.parentContainer} pointerEvents={(props === null || props === void 0 ? void 0 : props.backgroundInteractionEnabled) ? 'box-none' : 'auto'}>
              <PanGestureRefContext.Provider value={context}>
                <DraggableNodesContext.Provider value={draggableNodesContext}>
                  <Animated.View onLayout={function (event) {
                if (event.nativeEvent.layout.height < 10)
                    return;
                setDimensions({
                    width: event.nativeEvent.layout.width,
                    height: event.nativeEvent.layout.height,
                });
                if (sheetHeightRef.current) {
                    /**
                     * Android has a bug where it will fire multiple onLayout events with
                     * different values. Here we ensure that sheet is rendered at correct position
                     */
                    setTimeout(function () {
                        onSheetLayout(sheetHeightRef.current);
                    });
                }
            }} ref={rootViewContainerRef} pointerEvents={(props === null || props === void 0 ? void 0 : props.backgroundInteractionEnabled) ? 'box-none' : 'auto'} style={[
                styles.parentContainer,
                {
                    width: '100%',
                    justifyContent: 'flex-end',
                },
            ]}>
                    <>
                      {!(props === null || props === void 0 ? void 0 : props.backgroundInteractionEnabled) ? (<AnimatedPressable onPress={onTouch} testID={(_b = props.testIDs) === null || _b === void 0 ? void 0 : _b.backdrop} style={[
                    {
                        height: dimensions.height + insets.top + 100,
                        width: '100%',
                        position: 'absolute',
                        backgroundColor: overlayColor,
                    },
                    animatedOpacityStyle,
                ]} {...(props.backdropProps ? props.backdropProps : {})}/>) : null}

                      {dimensions.height === -1 &&
                Platform.OS === 'web' ? null : (<Animated.View pointerEvents="box-none" style={[
                    __assign(__assign({ borderTopRightRadius: (containerStyle === null || containerStyle === void 0 ? void 0 : containerStyle.borderTopRightRadius) || 10, borderTopLeftRadius: (containerStyle === null || containerStyle === void 0 ? void 0 : containerStyle.borderTopLeftRadius) || 10, backgroundColor: (containerStyle === null || containerStyle === void 0 ? void 0 : containerStyle.backgroundColor) || 'white', borderBottomLeftRadius: (containerStyle === null || containerStyle === void 0 ? void 0 : containerStyle.borderBottomLeftRadius) ||
                            undefined, borderBottomRightRadius: (containerStyle === null || containerStyle === void 0 ? void 0 : containerStyle.borderBottomRightRadius) ||
                            undefined, borderRadius: (containerStyle === null || containerStyle === void 0 ? void 0 : containerStyle.borderRadius) || undefined, width: (containerStyle === null || containerStyle === void 0 ? void 0 : containerStyle.width) || '100%' }, (!disableElevation
                        ? getElevation(typeof elevation === 'number'
                            ? elevation
                            : 5)
                        : {})), { height: dimensions.height, maxHeight: dimensions.height }),
                    animatedActionSheetStyle,
                ]}>
                          <GestureMobileOnly {...(Platform.OS === 'web'
                ? {}
                : {
                    gesture: panGesture,
                })}>
                            <Animated.View {...((panGesture === null || panGesture === void 0 ? void 0 : panGesture.panHandlers) || {})} onLayout={function (event) {
                    return onSheetLayout(event.nativeEvent.layout.height);
                }} ref={panViewRef} testID={(_c = props.testIDs) === null || _c === void 0 ? void 0 : _c.sheet} style={[
                    styles.container,
                    {
                        borderTopRightRadius: 10,
                        borderTopLeftRadius: 10,
                    },
                    props.containerStyle,
                    {
                        maxHeight: drawUnderStatusBar
                            ? keyboard.keyboardShown
                                ? dimensions.height -
                                    keyboard.keyboardHeight
                                : dimensions.height
                            : keyboard.keyboardShown
                                ? dimensions.height -
                                    insets.top -
                                    keyboard.keyboardHeight
                                : dimensions.height - insets.top,
                        // Using this to trigger layout when keyboard is shown
                        marginTop: keyboard.keyboardShown
                            ? 0.5
                            : drawUnderStatusBar
                                ? -2
                                : 0,
                        paddingBottom: (Platform.OS === 'ios' &&
                            keyboard.keyboardShown) ||
                            !useBottomSafeAreaPadding
                            ? 0
                            : insets.bottom,
                    },
                ]}>
                              {drawUnderStatusBar ? (<Animated.View style={[
                        {
                            height: 130,
                            position: 'absolute',
                            top: -80,
                            backgroundColor: (containerStyle === null || containerStyle === void 0 ? void 0 : containerStyle.backgroundColor) ||
                                'white',
                            width: '100%',
                            borderTopRightRadius: (containerStyle === null || containerStyle === void 0 ? void 0 : containerStyle.borderRadius) || 10,
                            borderTopLeftRadius: (containerStyle === null || containerStyle === void 0 ? void 0 : containerStyle.borderRadius) || 10,
                        },
                        animatedUnderlayTranslateStyle,
                    ]}/>) : null}
                              {gestureEnabled || props.headerAlwaysVisible ? (props.CustomHeaderComponent ? (props.CustomHeaderComponent) : (<Animated.View style={[
                        styles.indicator,
                        props.indicatorStyle,
                    ]}/>)) : null}

                              {(router === null || router === void 0 ? void 0 : router.hasRoutes()) ? (<RouterContext.Provider value={router}>
                                  {router === null || router === void 0 ? void 0 : router.stack.map(renderRoute)}
                                </RouterContext.Provider>) : (props === null || props === void 0 ? void 0 : props.children)}
                            </Animated.View>
                          </GestureMobileOnly>

                          {overdrawEnabled ? (<Animated.View style={{
                        position: 'absolute',
                        height: overdrawSize,
                        bottom: -overdrawSize,
                        backgroundColor: (containerStyle === null || containerStyle === void 0 ? void 0 : containerStyle.backgroundColor) || 'white',
                        width: (containerStyle === null || containerStyle === void 0 ? void 0 : containerStyle.width) || dimensions.width,
                    }}/>) : null}
                        </Animated.View>)}

                      {ExtraOverlayComponent}
                      {props.withNestedSheetProvider}
                      {sheetId ? (<SheetProvider context={"$$-auto-".concat(sheetId, "-").concat(currentContext, "-provider")}/>) : null}
                    </>
                  </Animated.View>
                </DraggableNodesContext.Provider>
              </PanGestureRefContext.Provider>
            </GestureHandlerRoot>
          </Root>) : null}
      </>);
});
var GestureHandlerRoot = function (props) {
    return props.isModal ? (<GestureHandlerRootView style={props.style} pointerEvents={props.pointerEvents}>
      {props.children}
    </GestureHandlerRootView>) : (<>{props.children}</>);
};
