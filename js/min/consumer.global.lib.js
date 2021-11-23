$(document).on("hidden.bs.modal", function(e) {
    var $body = $("body");
    $(".modal").is(":visible") && !$body.hasClass("modal-open") && $body.addClass("modal-open")
});
var ml = ml || {};
ml.bootstrapHelpers = function() {
    var hideEmptyBootstrapRows = function() {
        $(".row:empty").hide()
    }
      , initTooltips = function() {
        $('[data-toggle="tooltip"]').tooltip()
    };
    return {
        init: function() {
            hideEmptyBootstrapRows(),
            initTooltips()
        }
    }
}(),
$(document).ready(function() {
    ml.bootstrapHelpers.init()
}),
function(factory) {
    "function" == typeof define && define.amd && define.amd.jQuery ? define(["jquery"], factory) : factory("undefined" != typeof module && module.exports ? require("jquery") : jQuery)
}(function($) {
    "use strict";
    function init(options) {
        return !options || void 0 !== options.allowPageScroll || void 0 === options.swipe && void 0 === options.swipeStatus || (options.allowPageScroll = NONE),
        void 0 !== options.click && void 0 === options.tap && (options.tap = options.click),
        options || (options = {}),
        options = $.extend({}, $.fn.swipe.defaults, options),
        this.each(function() {
            var $this = $(this)
              , plugin = $this.data(PLUGIN_NS);
            plugin || (plugin = new TouchSwipe(this,options),
            $this.data(PLUGIN_NS, plugin))
        })
    }
    function TouchSwipe(element, options) {
        function touchStart(jqEvent) {
            if (!(getTouchInProgress() || $(jqEvent.target).closest(options.excludedElements, $element).length > 0)) {
                var event = jqEvent.originalEvent ? jqEvent.originalEvent : jqEvent;
                if (!event.pointerType || "mouse" != event.pointerType || 0 != options.fallbackToMouseEvents) {
                    var ret, touches = event.touches, evt = touches ? touches[0] : event;
                    return phase = PHASE_START,
                    touches ? fingerCount = touches.length : !1 !== options.preventDefaultEvents && jqEvent.preventDefault(),
                    distance = 0,
                    direction = null,
                    currentDirection = null,
                    pinchDirection = null,
                    duration = 0,
                    startTouchesDistance = 0,
                    endTouchesDistance = 0,
                    pinchZoom = 1,
                    pinchDistance = 0,
                    maximumsMap = createMaximumsData(),
                    cancelMultiFingerRelease(),
                    createFingerData(0, evt),
                    !touches || fingerCount === options.fingers || options.fingers === ALL_FINGERS || hasPinches() ? (startTime = getTimeStamp(),
                    2 == fingerCount && (createFingerData(1, touches[1]),
                    startTouchesDistance = endTouchesDistance = calculateTouchesDistance(fingerData[0].start, fingerData[1].start)),
                    (options.swipeStatus || options.pinchStatus) && (ret = triggerHandler(event, phase))) : ret = !1,
                    !1 === ret ? (phase = PHASE_CANCEL,
                    triggerHandler(event, phase),
                    ret) : (options.hold && (holdTimeout = setTimeout($.proxy(function() {
                        $element.trigger("hold", [event.target]),
                        options.hold && (ret = options.hold.call($element, event, event.target))
                    }, this), options.longTapThreshold)),
                    setTouchInProgress(!0),
                    null)
                }
            }
        }
        function touchMove(jqEvent) {
            var event = jqEvent.originalEvent ? jqEvent.originalEvent : jqEvent;
            if (phase !== PHASE_END && phase !== PHASE_CANCEL && !inMultiFingerRelease()) {
                var ret, touches = event.touches, evt = touches ? touches[0] : event, currentFinger = updateFingerData(evt);
                if (endTime = getTimeStamp(),
                touches && (fingerCount = touches.length),
                options.hold && clearTimeout(holdTimeout),
                phase = PHASE_MOVE,
                2 == fingerCount && (0 == startTouchesDistance ? (createFingerData(1, touches[1]),
                startTouchesDistance = endTouchesDistance = calculateTouchesDistance(fingerData[0].start, fingerData[1].start)) : (updateFingerData(touches[1]),
                endTouchesDistance = calculateTouchesDistance(fingerData[0].end, fingerData[1].end),
                pinchDirection = calculatePinchDirection(fingerData[0].end, fingerData[1].end)),
                pinchZoom = calculatePinchZoom(startTouchesDistance, endTouchesDistance),
                pinchDistance = Math.abs(startTouchesDistance - endTouchesDistance)),
                fingerCount === options.fingers || options.fingers === ALL_FINGERS || !touches || hasPinches()) {
                    if (direction = calculateDirection(currentFinger.start, currentFinger.end),
                    currentDirection = calculateDirection(currentFinger.last, currentFinger.end),
                    validateDefaultEvent(jqEvent, currentDirection),
                    distance = calculateDistance(currentFinger.start, currentFinger.end),
                    duration = calculateDuration(),
                    setMaxDistance(direction, distance),
                    ret = triggerHandler(event, phase),
                    !options.triggerOnTouchEnd || options.triggerOnTouchLeave) {
                        var inBounds = !0;
                        if (options.triggerOnTouchLeave) {
                            var bounds = getbounds(this);
                            inBounds = isInBounds(currentFinger.end, bounds)
                        }
                        !options.triggerOnTouchEnd && inBounds ? phase = getNextPhase(PHASE_MOVE) : options.triggerOnTouchLeave && !inBounds && (phase = getNextPhase(PHASE_END)),
                        phase != PHASE_CANCEL && phase != PHASE_END || triggerHandler(event, phase)
                    }
                } else
                    phase = PHASE_CANCEL,
                    triggerHandler(event, phase);
                !1 === ret && (phase = PHASE_CANCEL,
                triggerHandler(event, phase))
            }
        }
        function touchEnd(jqEvent) {
            var event = jqEvent.originalEvent ? jqEvent.originalEvent : jqEvent
              , touches = event.touches;
            if (touches) {
                if (touches.length && !inMultiFingerRelease())
                    return startMultiFingerRelease(event),
                    !0;
                if (touches.length && inMultiFingerRelease())
                    return !0
            }
            return inMultiFingerRelease() && (fingerCount = fingerCountAtRelease),
            endTime = getTimeStamp(),
            duration = calculateDuration(),
            didSwipeBackToCancel() || !validateSwipeDistance() ? (phase = PHASE_CANCEL,
            triggerHandler(event, phase)) : options.triggerOnTouchEnd || !1 === options.triggerOnTouchEnd && phase === PHASE_MOVE ? (!1 !== options.preventDefaultEvents && jqEvent.preventDefault(),
            phase = PHASE_END,
            triggerHandler(event, phase)) : !options.triggerOnTouchEnd && hasTap() ? (phase = PHASE_END,
            triggerHandlerForGesture(event, phase, TAP)) : phase === PHASE_MOVE && (phase = PHASE_CANCEL,
            triggerHandler(event, phase)),
            setTouchInProgress(!1),
            null
        }
        function touchCancel() {
            fingerCount = 0,
            endTime = 0,
            startTime = 0,
            startTouchesDistance = 0,
            endTouchesDistance = 0,
            pinchZoom = 1,
            cancelMultiFingerRelease(),
            setTouchInProgress(!1)
        }
        function touchLeave(jqEvent) {
            var event = jqEvent.originalEvent ? jqEvent.originalEvent : jqEvent;
            options.triggerOnTouchLeave && (phase = getNextPhase(PHASE_END),
            triggerHandler(event, phase))
        }
        function removeListeners() {
            $element.unbind(START_EV, touchStart),
            $element.unbind(CANCEL_EV, touchCancel),
            $element.unbind(MOVE_EV, touchMove),
            $element.unbind(END_EV, touchEnd),
            LEAVE_EV && $element.unbind(LEAVE_EV, touchLeave),
            setTouchInProgress(!1)
        }
        function getNextPhase(currentPhase) {
            var nextPhase = currentPhase
              , validTime = validateSwipeTime()
              , validDistance = validateSwipeDistance()
              , didCancel = didSwipeBackToCancel();
            return !validTime || didCancel ? nextPhase = PHASE_CANCEL : !validDistance || currentPhase != PHASE_MOVE || options.triggerOnTouchEnd && !options.triggerOnTouchLeave ? !validDistance && currentPhase == PHASE_END && options.triggerOnTouchLeave && (nextPhase = PHASE_CANCEL) : nextPhase = PHASE_END,
            nextPhase
        }
        function triggerHandler(event, phase) {
            var ret, touches = event.touches;
            return (didSwipe() || hasSwipes()) && (ret = triggerHandlerForGesture(event, phase, SWIPE)),
            (didPinch() || hasPinches()) && !1 !== ret && (ret = triggerHandlerForGesture(event, phase, PINCH)),
            didDoubleTap() && !1 !== ret ? ret = triggerHandlerForGesture(event, phase, DOUBLE_TAP) : didLongTap() && !1 !== ret ? ret = triggerHandlerForGesture(event, phase, LONG_TAP) : didTap() && !1 !== ret && (ret = triggerHandlerForGesture(event, phase, TAP)),
            phase === PHASE_CANCEL && touchCancel(event),
            phase === PHASE_END && (touches ? touches.length || touchCancel(event) : touchCancel(event)),
            ret
        }
        function triggerHandlerForGesture(event, phase, gesture) {
            var ret;
            if (gesture == SWIPE) {
                if ($element.trigger("swipeStatus", [phase, direction || null, distance || 0, duration || 0, fingerCount, fingerData, currentDirection]),
                options.swipeStatus && !1 === (ret = options.swipeStatus.call($element, event, phase, direction || null, distance || 0, duration || 0, fingerCount, fingerData, currentDirection)))
                    return !1;
                if (phase == PHASE_END && validateSwipe()) {
                    if (clearTimeout(singleTapTimeout),
                    clearTimeout(holdTimeout),
                    $element.trigger("swipe", [direction, distance, duration, fingerCount, fingerData, currentDirection]),
                    options.swipe && !1 === (ret = options.swipe.call($element, event, direction, distance, duration, fingerCount, fingerData, currentDirection)))
                        return !1;
                    switch (direction) {
                    case LEFT:
                        $element.trigger("swipeLeft", [direction, distance, duration, fingerCount, fingerData, currentDirection]),
                        options.swipeLeft && (ret = options.swipeLeft.call($element, event, direction, distance, duration, fingerCount, fingerData, currentDirection));
                        break;
                    case RIGHT:
                        $element.trigger("swipeRight", [direction, distance, duration, fingerCount, fingerData, currentDirection]),
                        options.swipeRight && (ret = options.swipeRight.call($element, event, direction, distance, duration, fingerCount, fingerData, currentDirection));
                        break;
                    case UP:
                        $element.trigger("swipeUp", [direction, distance, duration, fingerCount, fingerData, currentDirection]),
                        options.swipeUp && (ret = options.swipeUp.call($element, event, direction, distance, duration, fingerCount, fingerData, currentDirection));
                        break;
                    case DOWN:
                        $element.trigger("swipeDown", [direction, distance, duration, fingerCount, fingerData, currentDirection]),
                        options.swipeDown && (ret = options.swipeDown.call($element, event, direction, distance, duration, fingerCount, fingerData, currentDirection))
                    }
                }
            }
            if (gesture == PINCH) {
                if ($element.trigger("pinchStatus", [phase, pinchDirection || null, pinchDistance || 0, duration || 0, fingerCount, pinchZoom, fingerData]),
                options.pinchStatus && !1 === (ret = options.pinchStatus.call($element, event, phase, pinchDirection || null, pinchDistance || 0, duration || 0, fingerCount, pinchZoom, fingerData)))
                    return !1;
                if (phase == PHASE_END && validatePinch())
                    switch (pinchDirection) {
                    case IN:
                        $element.trigger("pinchIn", [pinchDirection || null, pinchDistance || 0, duration || 0, fingerCount, pinchZoom, fingerData]),
                        options.pinchIn && (ret = options.pinchIn.call($element, event, pinchDirection || null, pinchDistance || 0, duration || 0, fingerCount, pinchZoom, fingerData));
                        break;
                    case OUT:
                        $element.trigger("pinchOut", [pinchDirection || null, pinchDistance || 0, duration || 0, fingerCount, pinchZoom, fingerData]),
                        options.pinchOut && (ret = options.pinchOut.call($element, event, pinchDirection || null, pinchDistance || 0, duration || 0, fingerCount, pinchZoom, fingerData))
                    }
            }
            return gesture == TAP ? phase !== PHASE_CANCEL && phase !== PHASE_END || (clearTimeout(singleTapTimeout),
            clearTimeout(holdTimeout),
            hasDoubleTap() && !inDoubleTap() ? (doubleTapStartTime = getTimeStamp(),
            singleTapTimeout = setTimeout($.proxy(function() {
                doubleTapStartTime = null,
                $element.trigger("tap", [event.target]),
                options.tap && (ret = options.tap.call($element, event, event.target))
            }, this), options.doubleTapThreshold)) : (doubleTapStartTime = null,
            $element.trigger("tap", [event.target]),
            options.tap && (ret = options.tap.call($element, event, event.target)))) : gesture == DOUBLE_TAP ? phase !== PHASE_CANCEL && phase !== PHASE_END || (clearTimeout(singleTapTimeout),
            clearTimeout(holdTimeout),
            doubleTapStartTime = null,
            $element.trigger("doubletap", [event.target]),
            options.doubleTap && (ret = options.doubleTap.call($element, event, event.target))) : gesture == LONG_TAP && (phase !== PHASE_CANCEL && phase !== PHASE_END || (clearTimeout(singleTapTimeout),
            doubleTapStartTime = null,
            $element.trigger("longtap", [event.target]),
            options.longTap && (ret = options.longTap.call($element, event, event.target)))),
            ret
        }
        function validateSwipeDistance() {
            var valid = !0;
            return null !== options.threshold && (valid = distance >= options.threshold),
            valid
        }
        function didSwipeBackToCancel() {
            var cancelled = !1;
            return null !== options.cancelThreshold && null !== direction && (cancelled = getMaxDistance(direction) - distance >= options.cancelThreshold),
            cancelled
        }
        function validatePinchDistance() {
            return null === options.pinchThreshold || pinchDistance >= options.pinchThreshold
        }
        function validateSwipeTime() {
            return !options.maxTimeThreshold || !(duration >= options.maxTimeThreshold)
        }
        function validateDefaultEvent(jqEvent, direction) {
            if (!1 !== options.preventDefaultEvents)
                if (options.allowPageScroll === NONE)
                    jqEvent.preventDefault();
                else {
                    var auto = options.allowPageScroll === AUTO;
                    switch (direction) {
                    case LEFT:
                        (options.swipeLeft && auto || !auto && options.allowPageScroll != HORIZONTAL) && jqEvent.preventDefault();
                        break;
                    case RIGHT:
                        (options.swipeRight && auto || !auto && options.allowPageScroll != HORIZONTAL) && jqEvent.preventDefault();
                        break;
                    case UP:
                        (options.swipeUp && auto || !auto && options.allowPageScroll != VERTICAL) && jqEvent.preventDefault();
                        break;
                    case DOWN:
                        (options.swipeDown && auto || !auto && options.allowPageScroll != VERTICAL) && jqEvent.preventDefault()
                    }
                }
        }
        function validatePinch() {
            var hasCorrectFingerCount = validateFingers()
              , hasEndPoint = validateEndPoint()
              , hasCorrectDistance = validatePinchDistance();
            return hasCorrectFingerCount && hasEndPoint && hasCorrectDistance
        }
        function hasPinches() {
            return !!(options.pinchStatus || options.pinchIn || options.pinchOut)
        }
        function didPinch() {
            return !(!validatePinch() || !hasPinches())
        }
        function validateSwipe() {
            var hasValidTime = validateSwipeTime()
              , hasValidDistance = validateSwipeDistance()
              , hasCorrectFingerCount = validateFingers()
              , hasEndPoint = validateEndPoint();
            return !didSwipeBackToCancel() && hasEndPoint && hasCorrectFingerCount && hasValidDistance && hasValidTime
        }
        function hasSwipes() {
            return !!(options.swipe || options.swipeStatus || options.swipeLeft || options.swipeRight || options.swipeUp || options.swipeDown)
        }
        function didSwipe() {
            return !(!validateSwipe() || !hasSwipes())
        }
        function validateFingers() {
            return fingerCount === options.fingers || options.fingers === ALL_FINGERS || !SUPPORTS_TOUCH
        }
        function validateEndPoint() {
            return 0 !== fingerData[0].end.x
        }
        function hasTap() {
            return !!options.tap
        }
        function hasDoubleTap() {
            return !!options.doubleTap
        }
        function hasLongTap() {
            return !!options.longTap
        }
        function validateDoubleTap() {
            if (null == doubleTapStartTime)
                return !1;
            var now = getTimeStamp();
            return hasDoubleTap() && now - doubleTapStartTime <= options.doubleTapThreshold
        }
        function inDoubleTap() {
            return validateDoubleTap()
        }
        function validateTap() {
            return (1 === fingerCount || !SUPPORTS_TOUCH) && (isNaN(distance) || distance < options.threshold)
        }
        function validateLongTap() {
            return duration > options.longTapThreshold && DOUBLE_TAP_THRESHOLD > distance
        }
        function didTap() {
            return !(!validateTap() || !hasTap())
        }
        function didDoubleTap() {
            return !(!validateDoubleTap() || !hasDoubleTap())
        }
        function didLongTap() {
            return !(!validateLongTap() || !hasLongTap())
        }
        function startMultiFingerRelease(event) {
            previousTouchEndTime = getTimeStamp(),
            fingerCountAtRelease = event.touches.length + 1
        }
        function cancelMultiFingerRelease() {
            previousTouchEndTime = 0,
            fingerCountAtRelease = 0
        }
        function inMultiFingerRelease() {
            var withinThreshold = !1;
            if (previousTouchEndTime) {
                getTimeStamp() - previousTouchEndTime <= options.fingerReleaseThreshold && (withinThreshold = !0)
            }
            return withinThreshold
        }
        function getTouchInProgress() {
            return !(!0 !== $element.data(PLUGIN_NS + "_intouch"))
        }
        function setTouchInProgress(val) {
            $element && (!0 === val ? ($element.bind(MOVE_EV, touchMove),
            $element.bind(END_EV, touchEnd),
            LEAVE_EV && $element.bind(LEAVE_EV, touchLeave)) : ($element.unbind(MOVE_EV, touchMove, !1),
            $element.unbind(END_EV, touchEnd, !1),
            LEAVE_EV && $element.unbind(LEAVE_EV, touchLeave, !1)),
            $element.data(PLUGIN_NS + "_intouch", !0 === val))
        }
        function createFingerData(id, evt) {
            var f = {
                start: {
                    x: 0,
                    y: 0
                },
                last: {
                    x: 0,
                    y: 0
                },
                end: {
                    x: 0,
                    y: 0
                }
            };
            return f.start.x = f.last.x = f.end.x = evt.pageX || evt.clientX,
            f.start.y = f.last.y = f.end.y = evt.pageY || evt.clientY,
            fingerData[id] = f,
            f
        }
        function updateFingerData(evt) {
            var id = void 0 !== evt.identifier ? evt.identifier : 0
              , f = getFingerData(id);
            return null === f && (f = createFingerData(id, evt)),
            f.last.x = f.end.x,
            f.last.y = f.end.y,
            f.end.x = evt.pageX || evt.clientX,
            f.end.y = evt.pageY || evt.clientY,
            f
        }
        function getFingerData(id) {
            return fingerData[id] || null
        }
        function setMaxDistance(direction, distance) {
            direction != NONE && (distance = Math.max(distance, getMaxDistance(direction)),
            maximumsMap[direction].distance = distance)
        }
        function getMaxDistance(direction) {
            return maximumsMap[direction] ? maximumsMap[direction].distance : void 0
        }
        function createMaximumsData() {
            var maxData = {};
            return maxData[LEFT] = createMaximumVO(LEFT),
            maxData[RIGHT] = createMaximumVO(RIGHT),
            maxData[UP] = createMaximumVO(UP),
            maxData[DOWN] = createMaximumVO(DOWN),
            maxData
        }
        function createMaximumVO(dir) {
            return {
                direction: dir,
                distance: 0
            }
        }
        function calculateDuration() {
            return endTime - startTime
        }
        function calculateTouchesDistance(startPoint, endPoint) {
            var diffX = Math.abs(startPoint.x - endPoint.x)
              , diffY = Math.abs(startPoint.y - endPoint.y);
            return Math.round(Math.sqrt(diffX * diffX + diffY * diffY))
        }
        function calculatePinchZoom(startDistance, endDistance) {
            return (endDistance / startDistance * 1).toFixed(2)
        }
        function calculatePinchDirection() {
            return 1 > pinchZoom ? OUT : IN
        }
        function calculateDistance(startPoint, endPoint) {
            return Math.round(Math.sqrt(Math.pow(endPoint.x - startPoint.x, 2) + Math.pow(endPoint.y - startPoint.y, 2)))
        }
        function calculateAngle(startPoint, endPoint) {
            var x = startPoint.x - endPoint.x
              , y = endPoint.y - startPoint.y
              , r = Math.atan2(y, x)
              , angle = Math.round(180 * r / Math.PI);
            return 0 > angle && (angle = 360 - Math.abs(angle)),
            angle
        }
        function calculateDirection(startPoint, endPoint) {
            if (comparePoints(startPoint, endPoint))
                return NONE;
            var angle = calculateAngle(startPoint, endPoint);
            return 45 >= angle && angle >= 0 ? LEFT : 360 >= angle && angle >= 315 ? LEFT : angle >= 135 && 225 >= angle ? RIGHT : angle > 45 && 135 > angle ? DOWN : UP
        }
        function getTimeStamp() {
            return (new Date).getTime()
        }
        function getbounds(el) {
            el = $(el);
            var offset = el.offset();
            return {
                left: offset.left,
                right: offset.left + el.outerWidth(),
                top: offset.top,
                bottom: offset.top + el.outerHeight()
            }
        }
        function isInBounds(point, bounds) {
            return point.x > bounds.left && point.x < bounds.right && point.y > bounds.top && point.y < bounds.bottom
        }
        function comparePoints(pointA, pointB) {
            return pointA.x == pointB.x && pointA.y == pointB.y
        }
        var options = $.extend({}, options)
          , useTouchEvents = SUPPORTS_TOUCH || SUPPORTS_POINTER || !options.fallbackToMouseEvents
          , START_EV = useTouchEvents ? SUPPORTS_POINTER ? SUPPORTS_POINTER_IE10 ? "MSPointerDown" : "pointerdown" : "touchstart" : "mousedown"
          , MOVE_EV = useTouchEvents ? SUPPORTS_POINTER ? SUPPORTS_POINTER_IE10 ? "MSPointerMove" : "pointermove" : "touchmove" : "mousemove"
          , END_EV = useTouchEvents ? SUPPORTS_POINTER ? SUPPORTS_POINTER_IE10 ? "MSPointerUp" : "pointerup" : "touchend" : "mouseup"
          , LEAVE_EV = useTouchEvents ? SUPPORTS_POINTER ? "mouseleave" : null : "mouseleave"
          , CANCEL_EV = SUPPORTS_POINTER ? SUPPORTS_POINTER_IE10 ? "MSPointerCancel" : "pointercancel" : "touchcancel"
          , distance = 0
          , direction = null
          , currentDirection = null
          , duration = 0
          , startTouchesDistance = 0
          , endTouchesDistance = 0
          , pinchZoom = 1
          , pinchDistance = 0
          , pinchDirection = 0
          , maximumsMap = null
          , $element = $(element)
          , phase = "start"
          , fingerCount = 0
          , fingerData = {}
          , startTime = 0
          , endTime = 0
          , previousTouchEndTime = 0
          , fingerCountAtRelease = 0
          , doubleTapStartTime = 0
          , singleTapTimeout = null
          , holdTimeout = null;
        try {
            $element.bind(START_EV, touchStart),
            $element.bind(CANCEL_EV, touchCancel)
        } catch (e) {
            $.error("events not supported " + START_EV + "," + CANCEL_EV + " on jQuery.swipe")
        }
        this.enable = function() {
            return this.disable(),
            $element.bind(START_EV, touchStart),
            $element.bind(CANCEL_EV, touchCancel),
            $element
        }
        ,
        this.disable = function() {
            return removeListeners(),
            $element
        }
        ,
        this.destroy = function() {
            removeListeners(),
            $element.data(PLUGIN_NS, null),
            $element = null
        }
        ,
        this.option = function(property, value) {
            if ("object" == typeof property)
                options = $.extend(options, property);
            else if (void 0 !== options[property]) {
                if (void 0 === value)
                    return options[property];
                options[property] = value
            } else {
                if (!property)
                    return options;
                $.error("Option " + property + " does not exist on jQuery.swipe.options")
            }
            return null
        }
    }
    var LEFT = "left"
      , RIGHT = "right"
      , UP = "up"
      , DOWN = "down"
      , IN = "in"
      , OUT = "out"
      , NONE = "none"
      , AUTO = "auto"
      , SWIPE = "swipe"
      , PINCH = "pinch"
      , TAP = "tap"
      , DOUBLE_TAP = "doubletap"
      , LONG_TAP = "longtap"
      , HORIZONTAL = "horizontal"
      , VERTICAL = "vertical"
      , ALL_FINGERS = "all"
      , DOUBLE_TAP_THRESHOLD = 10
      , PHASE_START = "start"
      , PHASE_MOVE = "move"
      , PHASE_END = "end"
      , PHASE_CANCEL = "cancel"
      , SUPPORTS_TOUCH = "ontouchstart"in window
      , SUPPORTS_POINTER_IE10 = window.navigator.msPointerEnabled && !window.navigator.pointerEnabled && !SUPPORTS_TOUCH
      , SUPPORTS_POINTER = (window.navigator.pointerEnabled || window.navigator.msPointerEnabled) && !SUPPORTS_TOUCH
      , PLUGIN_NS = "TouchSwipe"
      , defaults = {
        fingers: 1,
        threshold: 75,
        cancelThreshold: null,
        pinchThreshold: 20,
        maxTimeThreshold: null,
        fingerReleaseThreshold: 250,
        longTapThreshold: 500,
        doubleTapThreshold: 200,
        swipe: null,
        swipeLeft: null,
        swipeRight: null,
        swipeUp: null,
        swipeDown: null,
        swipeStatus: null,
        pinchIn: null,
        pinchOut: null,
        pinchStatus: null,
        click: null,
        tap: null,
        doubleTap: null,
        longTap: null,
        hold: null,
        triggerOnTouchEnd: !0,
        triggerOnTouchLeave: !1,
        allowPageScroll: "auto",
        fallbackToMouseEvents: !0,
        excludedElements: ".noSwipe",
        preventDefaultEvents: !0
    };
    $.fn.swipe = function(method) {
        var $this = $(this)
          , plugin = $this.data(PLUGIN_NS);
        if (plugin && "string" == typeof method) {
            if (plugin[method])
                return plugin[method].apply(plugin, Array.prototype.slice.call(arguments, 1));
            $.error("Method " + method + " does not exist on jQuery.swipe")
        } else if (plugin && "object" == typeof method)
            plugin.option.apply(plugin, arguments);
        else if (!(plugin || "object" != typeof method && method))
            return init.apply(this, arguments);
        return $this
    }
    ,
    $.fn.swipe.version = "1.6.18",
    $.fn.swipe.defaults = defaults,
    $.fn.swipe.phases = {
        PHASE_START: PHASE_START,
        PHASE_MOVE: PHASE_MOVE,
        PHASE_END: PHASE_END,
        PHASE_CANCEL: PHASE_CANCEL
    },
    $.fn.swipe.directions = {
        LEFT: LEFT,
        RIGHT: RIGHT,
        UP: UP,
        DOWN: DOWN,
        IN: IN,
        OUT: OUT
    },
    $.fn.swipe.pageScroll = {
        NONE: NONE,
        HORIZONTAL: HORIZONTAL,
        VERTICAL: VERTICAL,
        AUTO: AUTO
    },
    $.fn.swipe.fingers = {
        ONE: 1,
        TWO: 2,
        THREE: 3,
        FOUR: 4,
        FIVE: 5,
        ALL: ALL_FINGERS
    }
}),
function(a) {
    function f(a, b) {
        if (!(a.originalEvent.touches.length > 1)) {
            a.preventDefault();
            var c = a.originalEvent.changedTouches[0]
              , d = document.createEvent("MouseEvents");
            d.initMouseEvent(b, !0, !0, window, 1, c.screenX, c.screenY, c.clientX, c.clientY, !1, !1, !1, !1, 0, null),
            a.target.dispatchEvent(d)
        }
    }
    if (a.support.touch = "ontouchend"in document,
    a.support.touch) {
        var e, b = a.ui.mouse.prototype, c = b._mouseInit, d = b._mouseDestroy;
        b._touchStart = function(a) {
            var b = this;
            !e && b._mouseCapture(a.originalEvent.changedTouches[0]) && (e = !0,
            b._touchMoved = !1,
            f(a, "mouseover"),
            f(a, "mousemove"),
            f(a, "mousedown"))
        }
        ,
        b._touchMove = function(a) {
            e && (this._touchMoved = !0,
            f(a, "mousemove"))
        }
        ,
        b._touchEnd = function(a) {
            e && (f(a, "mouseup"),
            f(a, "mouseout"),
            this._touchMoved || f(a, "click"),
            e = !1)
        }
        ,
        b._mouseInit = function() {
            var b = this;
            b.element.bind({
                touchstart: a.proxy(b, "_touchStart"),
                touchmove: a.proxy(b, "_touchMove"),
                touchend: a.proxy(b, "_touchEnd")
            }),
            c.call(b)
        }
        ,
        b._mouseDestroy = function() {
            var b = this;
            b.element.unbind({
                touchstart: a.proxy(b, "_touchStart"),
                touchmove: a.proxy(b, "_touchMove"),
                touchend: a.proxy(b, "_touchEnd")
            }),
            d.call(b)
        }
    }
}(jQuery),
function($) {
    $.extend({
        debounce: function(fn, timeout, invokeAsap, ctx) {
            3 == arguments.length && "boolean" != typeof invokeAsap && (ctx = invokeAsap,
            invokeAsap = !1);
            var timer;
            return function() {
                var args = arguments;
                ctx = ctx || this,
                invokeAsap && !timer && fn.apply(ctx, args),
                clearTimeout(timer),
                timer = setTimeout(function() {
                    invokeAsap || fn.apply(ctx, args),
                    timer = null
                }, timeout)
            }
        },
        throttle: function(fn, timeout, ctx) {
            var timer, args, needInvoke;
            return function() {
                args = arguments,
                needInvoke = !0,
                ctx = ctx || this,
                timer || function() {
                    needInvoke ? (fn.apply(ctx, args),
                    needInvoke = !1,
                    timer = setTimeout(arguments.callee, timeout)) : timer = null
                }()
            }
        }
    })
}(jQuery),
function($) {
    $.fn.commaformat = function() {
        var _rgxDigit3Digit = /(\d+)(\d{3})/
          , _rgxNotDigitComma = /[^\d,]/
          , _rgxNotDigit = /[^\d]+/g;
        return _rgxKeyCodes = /^(9|13|16|17|18|19|20|27|33|34|35|36|37|38|39|40|45|91|92|93|144|145)$/,
        this.each(function() {
            var inputValue = $(this).val().replace(/[^0-9\.]/g, "");
            inputValue += "";
            for (var x = inputValue.split("."), x1 = x[0], x2 = x.length > 1 ? "." + x[1] : "", rgx = /(\d+)(\d{3})/; rgx.test(x1); )
                x1 = x1.replace(rgx, "$1,$2");
            inputValue = x1 + x2,
            $(this).val(inputValue),
            $(this).keyup($.throttle(function(e) {
                var self = $(this)
                  , str = self.val()
                  , orig = str
                  , pos = 0
                  , rem = 0
                  , keyCode = "" + e.keyCode;
                if (!_rgxKeyCodes.test(keyCode) && !_rgxNotDigitComma.test(str)) {
                    if (void 0 !== this.selectionStart)
                        pos = this.selectionStart;
                    else if (document.selection) {
                        var range = document.selection.createRange();
                        range.moveStart("character", -this.value.length),
                        pos = range.text.length
                    }
                    var first = str.slice(0, pos).replace(_rgxNotDigit, "");
                    for (pos = first.length,
                    str = str.replace(_rgxNotDigit, ""); _rgxDigit3Digit.test(str); )
                        str = str.replace(_rgxDigit3Digit, "$1,$2");
                    if (orig !== str) {
                        self.val(str);
                        for (var i = 0, n = str.length; i < n; i++) {
                            if (pos == rem) {
                                if (this.setSelectionRange)
                                    this.focus(),
                                    this.setSelectionRange(i, i);
                                else if (this.createTextRange) {
                                    var range = this.createTextRange();
                                    range.collapse(!0),
                                    range.moveEnd("character", i),
                                    range.moveStart("character", i),
                                    range.select()
                                }
                                break
                            }
                            "," != str.charAt(i) && rem++
                        }
                    }
                }
            }, 100))
        })
    }
}(jQuery),
$(document).ready(function() {
    $("input[type='text'].comma-format").commaformat()
}),
jQuery.validator.addMethod("noHTML", function(value, element) {
    return this.optional(element) || !/[<>]/.test(value)
}, "No HTML tags are allowed."),
jQuery.validator.addMethod("noHighAscii", function(value, element) {
    return this.optional(element) || !/[\x80-\xFF]/.test(value)
}, "Please enter only ASCII characters."),
jQuery.validator.addMethod("customPhoneUSandInternational", function(phoneNumber, element) {
    var REGEX_PHONE_US = /^(\+1?|[1]?)( | ?- ?|\.)?(\(?\d{3,3}\)?)?( | ?- ?|\.)?\d{3,3}( | ?- ?|\.)?\d{4,4}(( | ?- ?|\.)?x\d{1,5})?$/
      , REGEX_PHONE_INTL = /^\+[- .()\d]{6,20}$/
      , PHONE_BLACKLIST = ["1234567890", "0000000000", "1111111111", "2222222222", "3333333333", "4444444444", "5555555555", "6666666666", "7777777777", "8888888888", "9999999999"]
      , value = phoneNumber.toString().trim();
    if ("" === value)
        return !0;
    if ("+" === value.charAt(0)) {
        if (!REGEX_PHONE_INTL.test(value))
            return !1
    } else {
        if (!REGEX_PHONE_US.test(value))
            return !1;
        var digitsOnly = value.replace(/\D/g, "");
        if (-1 !== PHONE_BLACKLIST.indexOf(digitsOnly))
            return !1;
        if ("555" === digitsOnly.substring(3, 6))
            return !1
    }
    return !0
}, "Please specify a valid phone number"),
jQuery.validator.addMethod("firstAndLastSingleField", function(name, element) {
    return this.optional(element) || /.+\s+.{2,}/.test(name)
}, "Please provide both first and last name"),
jQuery.validator.addMethod("alphaNumCommaQuoteDash", function(value, element) {
    return this.optional(element) || /^[a-z0-9'",\s]+$/i.test(value)
}, "Keyword can include: A-Z, a-z, 0-9 and ', &quot;, - , and commas"),
jQuery.validator.addMethod("validEmailByRegex", function(value, element) {
    var EMAIL_VALIDATION_REGEX = /^([a-zA-Z0-9_\-\.]+)@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.)|(([a-zA-Z0-9\-]+\.)+))([a-zA-Z]{2,4}|[0-9]{1,3})(\]?)$/;
    return this.optional(element) || EMAIL_VALIDATION_REGEX.test(value)
}, "Please provide a valid email address"),
jQuery.validator.addMethod("requiredCellPhoneContactPreference", function(value, element, params) {
    if (value)
        return !0;
    var isVideoChatChecked = $(".js-video-chat-checkbox").is(":checked")
      , isTextChecked = $(".js-text-checkbox").is(":checked");
    return !isVideoChatChecked && !isTextChecked
}, "Mobile phone number needed for text or video chat."),
jQuery.validator.addMethod("requiredPhoneContactPreference", function(value, element, params) {
    for (var phones = $(".js-phone-input"), i = 0, len = phones.length; i < len; i++)
        if (phones[i].value)
            return !0;
    return !$(".js-phone-checkbox").is(":checked")
}, "Phone preference selected – please add phone number."),
jQuery.validator.addMethod("agentStrongPassword", function(value, element) {
    var strongPasswordCount = 0;
    value.match(/[a-z]/g) && strongPasswordCount++,
    value.match(/[A-Z]/g) && strongPasswordCount++,
    value.match(/[0-9]/g) && strongPasswordCount++,
    value.match(/[-_\W]/g) && strongPasswordCount++;
    var hasStrongPassword = strongPasswordCount >= 3;
    return this.optional(element) || hasStrongPassword
}, "The password does not meet complexity requirements."),
function(factory) {
    "use strict";
    "function" == typeof define && define.amd ? define(["jquery"], factory) : "undefined" != typeof exports ? module.exports = factory(require("jquery")) : factory(jQuery)
}(function($) {
    "use strict";
    var Slick = window.Slick || {};
    Slick = function() {
        function Slick(element, settings) {
            var dataSettings, _ = this;
            _.defaults = {
                accessibility: !0,
                adaptiveHeight: !1,
                appendArrows: $(element),
                appendDots: $(element),
                arrows: !0,
                asNavFor: null,
                prevArrow: '<button class="slick-prev" aria-label="Previous" type="button">Previous</button>',
                nextArrow: '<button class="slick-next" aria-label="Next" type="button">Next</button>',
                autoplay: !1,
                autoplaySpeed: 3e3,
                centerMode: !1,
                centerPadding: "50px",
                cssEase: "ease",
                customPaging: function(slider, i) {
                    return $('<button type="button" />').text(i + 1)
                },
                dots: !1,
                dotsClass: "slick-dots",
                draggable: !0,
                easing: "linear",
                edgeFriction: .35,
                fade: !1,
                focusOnSelect: !1,
                focusOnChange: !1,
                infinite: !0,
                initialSlide: 0,
                lazyLoad: "ondemand",
                mobileFirst: !1,
                pauseOnHover: !0,
                pauseOnFocus: !0,
                pauseOnDotsHover: !1,
                respondTo: "window",
                responsive: null,
                rows: 1,
                rtl: !1,
                slide: "",
                slidesPerRow: 1,
                slidesToShow: 1,
                slidesToScroll: 1,
                speed: 500,
                swipe: !0,
                swipeToSlide: !1,
                touchMove: !0,
                touchThreshold: 5,
                useCSS: !0,
                useTransform: !0,
                variableWidth: !1,
                vertical: !1,
                verticalSwiping: !1,
                waitForAnimate: !0,
                zIndex: 1e3
            },
            _.initials = {
                animating: !1,
                dragging: !1,
                autoPlayTimer: null,
                currentDirection: 0,
                currentLeft: null,
                currentSlide: 0,
                direction: 1,
                $dots: null,
                listWidth: null,
                listHeight: null,
                loadIndex: 0,
                $nextArrow: null,
                $prevArrow: null,
                scrolling: !1,
                slideCount: null,
                slideWidth: null,
                $slideTrack: null,
                $slides: null,
                sliding: !1,
                slideOffset: 0,
                swipeLeft: null,
                swiping: !1,
                $list: null,
                touchObject: {},
                transformsEnabled: !1,
                unslicked: !1
            },
            $.extend(_, _.initials),
            _.activeBreakpoint = null,
            _.animType = null,
            _.animProp = null,
            _.breakpoints = [],
            _.breakpointSettings = [],
            _.cssTransitions = !1,
            _.focussed = !1,
            _.interrupted = !1,
            _.hidden = "hidden",
            _.paused = !0,
            _.positionProp = null,
            _.respondTo = null,
            _.rowCount = 1,
            _.shouldClick = !0,
            _.$slider = $(element),
            _.$slidesCache = null,
            _.transformType = null,
            _.transitionType = null,
            _.visibilityChange = "visibilitychange",
            _.windowWidth = 0,
            _.windowTimer = null,
            dataSettings = $(element).data("slick") || {},
            _.options = $.extend({}, _.defaults, settings, dataSettings),
            _.currentSlide = _.options.initialSlide,
            _.originalSettings = _.options,
            void 0 !== document.mozHidden ? (_.hidden = "mozHidden",
            _.visibilityChange = "mozvisibilitychange") : void 0 !== document.webkitHidden && (_.hidden = "webkitHidden",
            _.visibilityChange = "webkitvisibilitychange"),
            _.autoPlay = $.proxy(_.autoPlay, _),
            _.autoPlayClear = $.proxy(_.autoPlayClear, _),
            _.autoPlayIterator = $.proxy(_.autoPlayIterator, _),
            _.changeSlide = $.proxy(_.changeSlide, _),
            _.clickHandler = $.proxy(_.clickHandler, _),
            _.selectHandler = $.proxy(_.selectHandler, _),
            _.setPosition = $.proxy(_.setPosition, _),
            _.swipeHandler = $.proxy(_.swipeHandler, _),
            _.dragHandler = $.proxy(_.dragHandler, _),
            _.keyHandler = $.proxy(_.keyHandler, _),
            _.instanceUid = instanceUid++,
            _.htmlExpr = /^(?:\s*(<[\w\W]+>)[^>]*)$/,
            _.registerBreakpoints(),
            _.init(!0)
        }
        var instanceUid = 0;
        return Slick
    }(),
    Slick.prototype.activateADA = function() {
        this.$slideTrack.find(".slick-active").attr({
            "aria-hidden": "false"
        }).find("a, input, button, select").attr({
            tabindex: "0"
        })
    }
    ,
    Slick.prototype.addSlide = Slick.prototype.slickAdd = function(markup, index, addBefore) {
        var _ = this;
        if ("boolean" == typeof index)
            addBefore = index,
            index = null;
        else if (index < 0 || index >= _.slideCount)
            return !1;
        _.unload(),
        "number" == typeof index ? 0 === index && 0 === _.$slides.length ? $(markup).appendTo(_.$slideTrack) : addBefore ? $(markup).insertBefore(_.$slides.eq(index)) : $(markup).insertAfter(_.$slides.eq(index)) : !0 === addBefore ? $(markup).prependTo(_.$slideTrack) : $(markup).appendTo(_.$slideTrack),
        _.$slides = _.$slideTrack.children(this.options.slide),
        _.$slideTrack.children(this.options.slide).detach(),
        _.$slideTrack.append(_.$slides),
        _.$slides.each(function(index, element) {
            $(element).attr("data-slick-index", index)
        }),
        _.$slidesCache = _.$slides,
        _.reinit()
    }
    ,
    Slick.prototype.animateHeight = function() {
        var _ = this;
        if (1 === _.options.slidesToShow && !0 === _.options.adaptiveHeight && !1 === _.options.vertical) {
            var targetHeight = _.$slides.eq(_.currentSlide).outerHeight(!0);
            _.$list.animate({
                height: targetHeight
            }, _.options.speed)
        }
    }
    ,
    Slick.prototype.animateSlide = function(targetLeft, callback) {
        var animProps = {}
          , _ = this;
        _.animateHeight(),
        !0 === _.options.rtl && !1 === _.options.vertical && (targetLeft = -targetLeft),
        !1 === _.transformsEnabled ? !1 === _.options.vertical ? _.$slideTrack.animate({
            left: targetLeft
        }, _.options.speed, _.options.easing, callback) : _.$slideTrack.animate({
            top: targetLeft
        }, _.options.speed, _.options.easing, callback) : !1 === _.cssTransitions ? (!0 === _.options.rtl && (_.currentLeft = -_.currentLeft),
        $({
            animStart: _.currentLeft
        }).animate({
            animStart: targetLeft
        }, {
            duration: _.options.speed,
            easing: _.options.easing,
            step: function(now) {
                now = Math.ceil(now),
                !1 === _.options.vertical ? (animProps[_.animType] = "translate(" + now + "px, 0px)",
                _.$slideTrack.css(animProps)) : (animProps[_.animType] = "translate(0px," + now + "px)",
                _.$slideTrack.css(animProps))
            },
            complete: function() {
                callback && callback.call()
            }
        })) : (_.applyTransition(),
        targetLeft = Math.ceil(targetLeft),
        !1 === _.options.vertical ? animProps[_.animType] = "translate3d(" + targetLeft + "px, 0px, 0px)" : animProps[_.animType] = "translate3d(0px," + targetLeft + "px, 0px)",
        _.$slideTrack.css(animProps),
        callback && setTimeout(function() {
            _.disableTransition(),
            callback.call()
        }, _.options.speed))
    }
    ,
    Slick.prototype.getNavTarget = function() {
        var _ = this
          , asNavFor = _.options.asNavFor;
        return asNavFor && null !== asNavFor && (asNavFor = $(asNavFor).not(_.$slider)),
        asNavFor
    }
    ,
    Slick.prototype.asNavFor = function(index) {
        var _ = this
          , asNavFor = _.getNavTarget();
        null !== asNavFor && "object" == typeof asNavFor && asNavFor.each(function() {
            var target = $(this).slick("getSlick");
            target.unslicked || target.slideHandler(index, !0)
        })
    }
    ,
    Slick.prototype.applyTransition = function(slide) {
        var _ = this
          , transition = {};
        !1 === _.options.fade ? transition[_.transitionType] = _.transformType + " " + _.options.speed + "ms " + _.options.cssEase : transition[_.transitionType] = "opacity " + _.options.speed + "ms " + _.options.cssEase,
        !1 === _.options.fade ? _.$slideTrack.css(transition) : _.$slides.eq(slide).css(transition)
    }
    ,
    Slick.prototype.autoPlay = function() {
        var _ = this;
        _.autoPlayClear(),
        _.slideCount > _.options.slidesToShow && (_.autoPlayTimer = setInterval(_.autoPlayIterator, _.options.autoplaySpeed))
    }
    ,
    Slick.prototype.autoPlayClear = function() {
        var _ = this;
        _.autoPlayTimer && clearInterval(_.autoPlayTimer)
    }
    ,
    Slick.prototype.autoPlayIterator = function() {
        var _ = this
          , slideTo = _.currentSlide + _.options.slidesToScroll;
        _.paused || _.interrupted || _.focussed || (!1 === _.options.infinite && (1 === _.direction && _.currentSlide + 1 === _.slideCount - 1 ? _.direction = 0 : 0 === _.direction && (slideTo = _.currentSlide - _.options.slidesToScroll,
        _.currentSlide - 1 == 0 && (_.direction = 1))),
        _.slideHandler(slideTo))
    }
    ,
    Slick.prototype.buildArrows = function() {
        var _ = this;
        !0 === _.options.arrows && (_.$prevArrow = $(_.options.prevArrow).addClass("slick-arrow"),
        _.$nextArrow = $(_.options.nextArrow).addClass("slick-arrow"),
        _.slideCount > _.options.slidesToShow ? (_.$prevArrow.removeClass("slick-hidden").removeAttr("aria-hidden tabindex"),
        _.$nextArrow.removeClass("slick-hidden").removeAttr("aria-hidden tabindex"),
        _.htmlExpr.test(_.options.prevArrow) && _.$prevArrow.prependTo(_.options.appendArrows),
        _.htmlExpr.test(_.options.nextArrow) && _.$nextArrow.appendTo(_.options.appendArrows),
        !0 !== _.options.infinite && _.$prevArrow.addClass("slick-disabled").attr("aria-disabled", "true")) : _.$prevArrow.add(_.$nextArrow).addClass("slick-hidden").attr({
            "aria-disabled": "true",
            tabindex: "-1"
        }))
    }
    ,
    Slick.prototype.buildDots = function() {
        var i, dot, _ = this;
        if (!0 === _.options.dots && _.slideCount > _.options.slidesToShow) {
            for (_.$slider.addClass("slick-dotted"),
            dot = $("<ul />").addClass(_.options.dotsClass),
            i = 0; i <= _.getDotCount(); i += 1)
                dot.append($("<li />").append(_.options.customPaging.call(this, _, i)));
            _.$dots = dot.appendTo(_.options.appendDots),
            _.$dots.find("li").first().addClass("slick-active")
        }
    }
    ,
    Slick.prototype.buildOut = function() {
        var _ = this;
        _.$slides = _.$slider.children(_.options.slide + ":not(.slick-cloned)").addClass("slick-slide"),
        _.slideCount = _.$slides.length,
        _.$slides.each(function(index, element) {
            $(element).attr("data-slick-index", index).data("originalStyling", $(element).attr("style") || "")
        }),
        _.$slider.addClass("slick-slider"),
        _.$slideTrack = 0 === _.slideCount ? $('<div class="slick-track"/>').appendTo(_.$slider) : _.$slides.wrapAll('<div class="slick-track"/>').parent(),
        _.$list = _.$slideTrack.wrap('<div class="slick-list"/>').parent(),
        _.$slideTrack.css("opacity", 0),
        !0 !== _.options.centerMode && !0 !== _.options.swipeToSlide || (_.options.slidesToScroll = 1),
        $("img[data-lazy]", _.$slider).not("[src]").addClass("slick-loading"),
        _.setupInfinite(),
        _.buildArrows(),
        _.buildDots(),
        _.updateDots(),
        _.setSlideClasses("number" == typeof _.currentSlide ? _.currentSlide : 0),
        !0 === _.options.draggable && _.$list.addClass("draggable")
    }
    ,
    Slick.prototype.buildRows = function() {
        var a, b, c, newSlides, numOfSlides, originalSlides, slidesPerSection, _ = this;
        if (newSlides = document.createDocumentFragment(),
        originalSlides = _.$slider.children(),
        _.options.rows > 0) {
            for (slidesPerSection = _.options.slidesPerRow * _.options.rows,
            numOfSlides = Math.ceil(originalSlides.length / slidesPerSection),
            a = 0; a < numOfSlides; a++) {
                var slide = document.createElement("div");
                for (b = 0; b < _.options.rows; b++) {
                    var row = document.createElement("div");
                    for (c = 0; c < _.options.slidesPerRow; c++) {
                        var target = a * slidesPerSection + (b * _.options.slidesPerRow + c);
                        originalSlides.get(target) && row.appendChild(originalSlides.get(target))
                    }
                    slide.appendChild(row)
                }
                newSlides.appendChild(slide)
            }
            _.$slider.empty().append(newSlides),
            _.$slider.children().children().children().css({
                width: 100 / _.options.slidesPerRow + "%",
                display: "inline-block"
            })
        }
    }
    ,
    Slick.prototype.checkResponsive = function(initial, forceUpdate) {
        var breakpoint, targetBreakpoint, respondToWidth, _ = this, triggerBreakpoint = !1, sliderWidth = _.$slider.width(), windowWidth = window.innerWidth || $(window).width();
        if ("window" === _.respondTo ? respondToWidth = windowWidth : "slider" === _.respondTo ? respondToWidth = sliderWidth : "min" === _.respondTo && (respondToWidth = Math.min(windowWidth, sliderWidth)),
        _.options.responsive && _.options.responsive.length && null !== _.options.responsive) {
            targetBreakpoint = null;
            for (breakpoint in _.breakpoints)
                _.breakpoints.hasOwnProperty(breakpoint) && (!1 === _.originalSettings.mobileFirst ? respondToWidth < _.breakpoints[breakpoint] && (targetBreakpoint = _.breakpoints[breakpoint]) : respondToWidth > _.breakpoints[breakpoint] && (targetBreakpoint = _.breakpoints[breakpoint]));
            null !== targetBreakpoint ? null !== _.activeBreakpoint ? (targetBreakpoint !== _.activeBreakpoint || forceUpdate) && (_.activeBreakpoint = targetBreakpoint,
            "unslick" === _.breakpointSettings[targetBreakpoint] ? _.unslick(targetBreakpoint) : (_.options = $.extend({}, _.originalSettings, _.breakpointSettings[targetBreakpoint]),
            !0 === initial && (_.currentSlide = _.options.initialSlide),
            _.refresh(initial)),
            triggerBreakpoint = targetBreakpoint) : (_.activeBreakpoint = targetBreakpoint,
            "unslick" === _.breakpointSettings[targetBreakpoint] ? _.unslick(targetBreakpoint) : (_.options = $.extend({}, _.originalSettings, _.breakpointSettings[targetBreakpoint]),
            !0 === initial && (_.currentSlide = _.options.initialSlide),
            _.refresh(initial)),
            triggerBreakpoint = targetBreakpoint) : null !== _.activeBreakpoint && (_.activeBreakpoint = null,
            _.options = _.originalSettings,
            !0 === initial && (_.currentSlide = _.options.initialSlide),
            _.refresh(initial),
            triggerBreakpoint = targetBreakpoint),
            initial || !1 === triggerBreakpoint || _.$slider.trigger("breakpoint", [_, triggerBreakpoint])
        }
    }
    ,
    Slick.prototype.changeSlide = function(event, dontAnimate) {
        var indexOffset, slideOffset, unevenOffset, _ = this, $target = $(event.currentTarget);
        switch ($target.is("a") && event.preventDefault(),
        $target.is("li") || ($target = $target.closest("li")),
        unevenOffset = _.slideCount % _.options.slidesToScroll != 0,
        indexOffset = unevenOffset ? 0 : (_.slideCount - _.currentSlide) % _.options.slidesToScroll,
        event.data.message) {
        case "previous":
            slideOffset = 0 === indexOffset ? _.options.slidesToScroll : _.options.slidesToShow - indexOffset,
            _.slideCount > _.options.slidesToShow && _.slideHandler(_.currentSlide - slideOffset, !1, dontAnimate);
            break;
        case "next":
            slideOffset = 0 === indexOffset ? _.options.slidesToScroll : indexOffset,
            _.slideCount > _.options.slidesToShow && _.slideHandler(_.currentSlide + slideOffset, !1, dontAnimate);
            break;
        case "index":
            var index = 0 === event.data.index ? 0 : event.data.index || $target.index() * _.options.slidesToScroll;
            _.slideHandler(_.checkNavigable(index), !1, dontAnimate),
            $target.children().trigger("focus");
            break;
        default:
            return
        }
    }
    ,
    Slick.prototype.checkNavigable = function(index) {
        var navigables, prevNavigable, _ = this;
        if (navigables = _.getNavigableIndexes(),
        prevNavigable = 0,
        index > navigables[navigables.length - 1])
            index = navigables[navigables.length - 1];
        else
            for (var n in navigables) {
                if (index < navigables[n]) {
                    index = prevNavigable;
                    break
                }
                prevNavigable = navigables[n]
            }
        return index
    }
    ,
    Slick.prototype.cleanUpEvents = function() {
        var _ = this;
        _.options.dots && null !== _.$dots && ($("li", _.$dots).off("click.slick", _.changeSlide).off("mouseenter.slick", $.proxy(_.interrupt, _, !0)).off("mouseleave.slick", $.proxy(_.interrupt, _, !1)),
        !0 === _.options.accessibility && _.$dots.off("keydown.slick", _.keyHandler)),
        _.$slider.off("focus.slick blur.slick"),
        !0 === _.options.arrows && _.slideCount > _.options.slidesToShow && (_.$prevArrow && _.$prevArrow.off("click.slick", _.changeSlide),
        _.$nextArrow && _.$nextArrow.off("click.slick", _.changeSlide),
        !0 === _.options.accessibility && (_.$prevArrow && _.$prevArrow.off("keydown.slick", _.keyHandler),
        _.$nextArrow && _.$nextArrow.off("keydown.slick", _.keyHandler))),
        _.$list.off("touchstart.slick mousedown.slick", _.swipeHandler),
        _.$list.off("touchmove.slick mousemove.slick", _.swipeHandler),
        _.$list.off("touchend.slick mouseup.slick", _.swipeHandler),
        _.$list.off("touchcancel.slick mouseleave.slick", _.swipeHandler),
        _.$list.off("click.slick", _.clickHandler),
        $(document).off(_.visibilityChange, _.visibility),
        _.cleanUpSlideEvents(),
        !0 === _.options.accessibility && _.$list.off("keydown.slick", _.keyHandler),
        !0 === _.options.focusOnSelect && $(_.$slideTrack).children().off("click.slick", _.selectHandler),
        $(window).off("orientationchange.slick.slick-" + _.instanceUid, _.orientationChange),
        $(window).off("resize.slick.slick-" + _.instanceUid, _.resize),
        $("[draggable!=true]", _.$slideTrack).off("dragstart", _.preventDefault),
        $(window).off("load.slick.slick-" + _.instanceUid, _.setPosition)
    }
    ,
    Slick.prototype.cleanUpSlideEvents = function() {
        var _ = this;
        _.$list.off("mouseenter.slick", $.proxy(_.interrupt, _, !0)),
        _.$list.off("mouseleave.slick", $.proxy(_.interrupt, _, !1))
    }
    ,
    Slick.prototype.cleanUpRows = function() {
        var originalSlides, _ = this;
        _.options.rows > 0 && (originalSlides = _.$slides.children().children(),
        originalSlides.removeAttr("style"),
        _.$slider.empty().append(originalSlides))
    }
    ,
    Slick.prototype.clickHandler = function(event) {
        !1 === this.shouldClick && (event.stopImmediatePropagation(),
        event.stopPropagation(),
        event.preventDefault())
    }
    ,
    Slick.prototype.destroy = function(refresh) {
        var _ = this;
        _.autoPlayClear(),
        _.touchObject = {},
        _.cleanUpEvents(),
        $(".slick-cloned", _.$slider).detach(),
        _.$dots && _.$dots.remove(),
        _.$prevArrow && _.$prevArrow.length && (_.$prevArrow.removeClass("slick-disabled slick-arrow slick-hidden").removeAttr("aria-hidden aria-disabled tabindex").css("display", ""),
        _.htmlExpr.test(_.options.prevArrow) && _.$prevArrow.remove()),
        _.$nextArrow && _.$nextArrow.length && (_.$nextArrow.removeClass("slick-disabled slick-arrow slick-hidden").removeAttr("aria-hidden aria-disabled tabindex").css("display", ""),
        _.htmlExpr.test(_.options.nextArrow) && _.$nextArrow.remove()),
        _.$slides && (_.$slides.removeClass("slick-slide slick-active slick-center slick-visible slick-current").removeAttr("aria-hidden").removeAttr("data-slick-index").each(function() {
            $(this).attr("style", $(this).data("originalStyling"))
        }),
        _.$slideTrack.children(this.options.slide).detach(),
        _.$slideTrack.detach(),
        _.$list.detach(),
        _.$slider.append(_.$slides)),
        _.cleanUpRows(),
        _.$slider.removeClass("slick-slider"),
        _.$slider.removeClass("slick-initialized"),
        _.$slider.removeClass("slick-dotted"),
        _.unslicked = !0,
        refresh || _.$slider.trigger("destroy", [_])
    }
    ,
    Slick.prototype.disableTransition = function(slide) {
        var _ = this
          , transition = {};
        transition[_.transitionType] = "",
        !1 === _.options.fade ? _.$slideTrack.css(transition) : _.$slides.eq(slide).css(transition)
    }
    ,
    Slick.prototype.fadeSlide = function(slideIndex, callback) {
        var _ = this;
        !1 === _.cssTransitions ? (_.$slides.eq(slideIndex).css({
            zIndex: _.options.zIndex
        }),
        _.$slides.eq(slideIndex).animate({
            opacity: 1
        }, _.options.speed, _.options.easing, callback)) : (_.applyTransition(slideIndex),
        _.$slides.eq(slideIndex).css({
            opacity: 1,
            zIndex: _.options.zIndex
        }),
        callback && setTimeout(function() {
            _.disableTransition(slideIndex),
            callback.call()
        }, _.options.speed))
    }
    ,
    Slick.prototype.fadeSlideOut = function(slideIndex) {
        var _ = this;
        !1 === _.cssTransitions ? _.$slides.eq(slideIndex).animate({
            opacity: 0,
            zIndex: _.options.zIndex - 2
        }, _.options.speed, _.options.easing) : (_.applyTransition(slideIndex),
        _.$slides.eq(slideIndex).css({
            opacity: 0,
            zIndex: _.options.zIndex - 2
        }))
    }
    ,
    Slick.prototype.filterSlides = Slick.prototype.slickFilter = function(filter) {
        var _ = this;
        null !== filter && (_.$slidesCache = _.$slides,
        _.unload(),
        _.$slideTrack.children(this.options.slide).detach(),
        _.$slidesCache.filter(filter).appendTo(_.$slideTrack),
        _.reinit())
    }
    ,
    Slick.prototype.focusHandler = function() {
        var _ = this;
        _.$slider.off("focus.slick blur.slick").on("focus.slick blur.slick", "*", function(event) {
            event.stopImmediatePropagation();
            var $sf = $(this);
            setTimeout(function() {
                _.options.pauseOnFocus && (_.focussed = $sf.is(":focus"),
                _.autoPlay())
            }, 0)
        })
    }
    ,
    Slick.prototype.getCurrent = Slick.prototype.slickCurrentSlide = function() {
        return this.currentSlide
    }
    ,
    Slick.prototype.getDotCount = function() {
        var _ = this
          , breakPoint = 0
          , counter = 0
          , pagerQty = 0;
        if (!0 === _.options.infinite)
            if (_.slideCount <= _.options.slidesToShow)
                ++pagerQty;
            else
                for (; breakPoint < _.slideCount; )
                    ++pagerQty,
                    breakPoint = counter + _.options.slidesToScroll,
                    counter += _.options.slidesToScroll <= _.options.slidesToShow ? _.options.slidesToScroll : _.options.slidesToShow;
        else if (!0 === _.options.centerMode)
            pagerQty = _.slideCount;
        else if (_.options.asNavFor)
            for (; breakPoint < _.slideCount; )
                ++pagerQty,
                breakPoint = counter + _.options.slidesToScroll,
                counter += _.options.slidesToScroll <= _.options.slidesToShow ? _.options.slidesToScroll : _.options.slidesToShow;
        else
            pagerQty = 1 + Math.ceil((_.slideCount - _.options.slidesToShow) / _.options.slidesToScroll);
        return pagerQty - 1
    }
    ,
    Slick.prototype.getLeft = function(slideIndex) {
        var targetLeft, verticalHeight, targetSlide, coef, _ = this, verticalOffset = 0;
        return _.slideOffset = 0,
        verticalHeight = _.$slides.first().outerHeight(!0),
        !0 === _.options.infinite ? (_.slideCount > _.options.slidesToShow && (_.slideOffset = _.slideWidth * _.options.slidesToShow * -1,
        coef = -1,
        !0 === _.options.vertical && !0 === _.options.centerMode && (2 === _.options.slidesToShow ? coef = -1.5 : 1 === _.options.slidesToShow && (coef = -2)),
        verticalOffset = verticalHeight * _.options.slidesToShow * coef),
        _.slideCount % _.options.slidesToScroll != 0 && slideIndex + _.options.slidesToScroll > _.slideCount && _.slideCount > _.options.slidesToShow && (slideIndex > _.slideCount ? (_.slideOffset = (_.options.slidesToShow - (slideIndex - _.slideCount)) * _.slideWidth * -1,
        verticalOffset = (_.options.slidesToShow - (slideIndex - _.slideCount)) * verticalHeight * -1) : (_.slideOffset = _.slideCount % _.options.slidesToScroll * _.slideWidth * -1,
        verticalOffset = _.slideCount % _.options.slidesToScroll * verticalHeight * -1))) : slideIndex + _.options.slidesToShow > _.slideCount && (_.slideOffset = (slideIndex + _.options.slidesToShow - _.slideCount) * _.slideWidth,
        verticalOffset = (slideIndex + _.options.slidesToShow - _.slideCount) * verticalHeight),
        _.slideCount <= _.options.slidesToShow && (_.slideOffset = 0,
        verticalOffset = 0),
        !0 === _.options.centerMode && _.slideCount <= _.options.slidesToShow ? _.slideOffset = _.slideWidth * Math.floor(_.options.slidesToShow) / 2 - _.slideWidth * _.slideCount / 2 : !0 === _.options.centerMode && !0 === _.options.infinite ? _.slideOffset += _.slideWidth * Math.floor(_.options.slidesToShow / 2) - _.slideWidth : !0 === _.options.centerMode && (_.slideOffset = 0,
        _.slideOffset += _.slideWidth * Math.floor(_.options.slidesToShow / 2)),
        targetLeft = !1 === _.options.vertical ? slideIndex * _.slideWidth * -1 + _.slideOffset : slideIndex * verticalHeight * -1 + verticalOffset,
        !0 === _.options.variableWidth && (targetSlide = _.slideCount <= _.options.slidesToShow || !1 === _.options.infinite ? _.$slideTrack.children(".slick-slide").eq(slideIndex) : _.$slideTrack.children(".slick-slide").eq(slideIndex + _.options.slidesToShow),
        targetLeft = !0 === _.options.rtl ? targetSlide[0] ? -1 * (_.$slideTrack.width() - targetSlide[0].offsetLeft - targetSlide.width()) : 0 : targetSlide[0] ? -1 * targetSlide[0].offsetLeft : 0,
        !0 === _.options.centerMode && (targetSlide = _.slideCount <= _.options.slidesToShow || !1 === _.options.infinite ? _.$slideTrack.children(".slick-slide").eq(slideIndex) : _.$slideTrack.children(".slick-slide").eq(slideIndex + _.options.slidesToShow + 1),
        targetLeft = !0 === _.options.rtl ? targetSlide[0] ? -1 * (_.$slideTrack.width() - targetSlide[0].offsetLeft - targetSlide.width()) : 0 : targetSlide[0] ? -1 * targetSlide[0].offsetLeft : 0,
        targetLeft += (_.$list.width() - targetSlide.outerWidth()) / 2)),
        targetLeft
    }
    ,
    Slick.prototype.getOption = Slick.prototype.slickGetOption = function(option) {
        return this.options[option]
    }
    ,
    Slick.prototype.getNavigableIndexes = function() {
        var max, _ = this, breakPoint = 0, counter = 0, indexes = [];
        for (!1 === _.options.infinite ? max = _.slideCount : (breakPoint = -1 * _.options.slidesToScroll,
        counter = -1 * _.options.slidesToScroll,
        max = 2 * _.slideCount); breakPoint < max; )
            indexes.push(breakPoint),
            breakPoint = counter + _.options.slidesToScroll,
            counter += _.options.slidesToScroll <= _.options.slidesToShow ? _.options.slidesToScroll : _.options.slidesToShow;
        return indexes
    }
    ,
    Slick.prototype.getSlick = function() {
        return this
    }
    ,
    Slick.prototype.getSlideCount = function() {
        var swipedSlide, centerOffset, _ = this;
        return centerOffset = !0 === _.options.centerMode ? _.slideWidth * Math.floor(_.options.slidesToShow / 2) : 0,
        !0 === _.options.swipeToSlide ? (_.$slideTrack.find(".slick-slide").each(function(index, slide) {
            if (slide.offsetLeft - centerOffset + $(slide).outerWidth() / 2 > -1 * _.swipeLeft)
                return swipedSlide = slide,
                !1
        }),
        Math.abs($(swipedSlide).attr("data-slick-index") - _.currentSlide) || 1) : _.options.slidesToScroll
    }
    ,
    Slick.prototype.goTo = Slick.prototype.slickGoTo = function(slide, dontAnimate) {
        this.changeSlide({
            data: {
                message: "index",
                index: parseInt(slide)
            }
        }, dontAnimate)
    }
    ,
    Slick.prototype.init = function(creation) {
        var _ = this;
        $(_.$slider).hasClass("slick-initialized") || ($(_.$slider).addClass("slick-initialized"),
        _.buildRows(),
        _.buildOut(),
        _.setProps(),
        _.startLoad(),
        _.loadSlider(),
        _.initializeEvents(),
        _.updateArrows(),
        _.updateDots(),
        _.checkResponsive(!0),
        _.focusHandler()),
        creation && _.$slider.trigger("init", [_]),
        !0 === _.options.accessibility && _.initADA(),
        _.options.autoplay && (_.paused = !1,
        _.autoPlay())
    }
    ,
    Slick.prototype.initADA = function() {
        var _ = this
          , numDotGroups = Math.ceil(_.slideCount / _.options.slidesToShow)
          , tabControlIndexes = _.getNavigableIndexes().filter(function(val) {
            return val >= 0 && val < _.slideCount
        });
        _.$slides.add(_.$slideTrack.find(".slick-cloned")).attr({
            "aria-hidden": "true",
            tabindex: "-1"
        }).find("a, input, button, select").attr({
            tabindex: "-1"
        }),
        null !== _.$dots && (_.$slides.not(_.$slideTrack.find(".slick-cloned")).each(function(i) {
            var slideControlIndex = tabControlIndexes.indexOf(i);
            if ($(this).attr({
                role: "tabpanel",
                id: "slick-slide" + _.instanceUid + i,
                tabindex: -1
            }),
            -1 !== slideControlIndex) {
                var ariaButtonControl = "slick-slide-control" + _.instanceUid + slideControlIndex;
                $("#" + ariaButtonControl).length && $(this).attr({
                    "aria-describedby": ariaButtonControl
                })
            }
        }),
        _.$dots.attr("role", "tablist").find("li").each(function(i) {
            var mappedSlideIndex = tabControlIndexes[i];
            $(this).attr({
                role: "presentation"
            }),
            $(this).find("button").first().attr({
                role: "tab",
                id: "slick-slide-control" + _.instanceUid + i,
                "aria-controls": "slick-slide" + _.instanceUid + mappedSlideIndex,
                "aria-label": i + 1 + " of " + numDotGroups,
                "aria-selected": null,
                tabindex: "-1"
            })
        }).eq(_.currentSlide).find("button").attr({
            "aria-selected": "true",
            tabindex: "0"
        }).end());
        for (var i = _.currentSlide, max = i + _.options.slidesToShow; i < max; i++)
            _.options.focusOnChange ? _.$slides.eq(i).attr({
                tabindex: "0"
            }) : _.$slides.eq(i).removeAttr("tabindex");
        _.activateADA()
    }
    ,
    Slick.prototype.initArrowEvents = function() {
        var _ = this;
        !0 === _.options.arrows && _.slideCount > _.options.slidesToShow && (_.$prevArrow.off("click.slick").on("click.slick", {
            message: "previous"
        }, _.changeSlide),
        _.$nextArrow.off("click.slick").on("click.slick", {
            message: "next"
        }, _.changeSlide),
        !0 === _.options.accessibility && (_.$prevArrow.on("keydown.slick", _.keyHandler),
        _.$nextArrow.on("keydown.slick", _.keyHandler)))
    }
    ,
    Slick.prototype.initDotEvents = function() {
        var _ = this;
        !0 === _.options.dots && _.slideCount > _.options.slidesToShow && ($("li", _.$dots).on("click.slick", {
            message: "index"
        }, _.changeSlide),
        !0 === _.options.accessibility && _.$dots.on("keydown.slick", _.keyHandler)),
        !0 === _.options.dots && !0 === _.options.pauseOnDotsHover && _.slideCount > _.options.slidesToShow && $("li", _.$dots).on("mouseenter.slick", $.proxy(_.interrupt, _, !0)).on("mouseleave.slick", $.proxy(_.interrupt, _, !1))
    }
    ,
    Slick.prototype.initSlideEvents = function() {
        var _ = this;
        _.options.pauseOnHover && (_.$list.on("mouseenter.slick", $.proxy(_.interrupt, _, !0)),
        _.$list.on("mouseleave.slick", $.proxy(_.interrupt, _, !1)))
    }
    ,
    Slick.prototype.initializeEvents = function() {
        var _ = this;
        _.initArrowEvents(),
        _.initDotEvents(),
        _.initSlideEvents(),
        _.$list.on("touchstart.slick mousedown.slick", {
            action: "start"
        }, _.swipeHandler),
        _.$list.on("touchmove.slick mousemove.slick", {
            action: "move"
        }, _.swipeHandler),
        _.$list.on("touchend.slick mouseup.slick", {
            action: "end"
        }, _.swipeHandler),
        _.$list.on("touchcancel.slick mouseleave.slick", {
            action: "end"
        }, _.swipeHandler),
        _.$list.on("click.slick", _.clickHandler),
        $(document).on(_.visibilityChange, $.proxy(_.visibility, _)),
        !0 === _.options.accessibility && _.$list.on("keydown.slick", _.keyHandler),
        !0 === _.options.focusOnSelect && $(_.$slideTrack).children().on("click.slick", _.selectHandler),
        $(window).on("orientationchange.slick.slick-" + _.instanceUid, $.proxy(_.orientationChange, _)),
        $(window).on("resize.slick.slick-" + _.instanceUid, $.proxy(_.resize, _)),
        $("[draggable!=true]", _.$slideTrack).on("dragstart", _.preventDefault),
        $(window).on("load.slick.slick-" + _.instanceUid, _.setPosition),
        $(_.setPosition)
    }
    ,
    Slick.prototype.initUI = function() {
        var _ = this;
        !0 === _.options.arrows && _.slideCount > _.options.slidesToShow && (_.$prevArrow.show(),
        _.$nextArrow.show()),
        !0 === _.options.dots && _.slideCount > _.options.slidesToShow && _.$dots.show()
    }
    ,
    Slick.prototype.keyHandler = function(event) {
        var _ = this;
        event.target.tagName.match("TEXTAREA|INPUT|SELECT") || (37 === event.keyCode && !0 === _.options.accessibility ? _.changeSlide({
            data: {
                message: !0 === _.options.rtl ? "next" : "previous"
            }
        }) : 39 === event.keyCode && !0 === _.options.accessibility && _.changeSlide({
            data: {
                message: !0 === _.options.rtl ? "previous" : "next"
            }
        }))
    }
    ,
    Slick.prototype.lazyLoad = function() {
        function loadImages(imagesScope) {
            $("img[data-lazy]", imagesScope).each(function() {
                var image = $(this)
                  , imageSource = $(this).attr("data-lazy")
                  , imageSrcSet = $(this).attr("data-srcset")
                  , imageSizes = $(this).attr("data-sizes") || _.$slider.attr("data-sizes")
                  , imageToLoad = document.createElement("img");
                imageToLoad.onload = function() {
                    image.animate({
                        opacity: 0
                    }, 100, function() {
                        imageSrcSet && (image.attr("srcset", imageSrcSet),
                        imageSizes && image.attr("sizes", imageSizes)),
                        image.attr("src", imageSource).animate({
                            opacity: 1
                        }, 200, function() {
                            image.removeAttr("data-lazy data-srcset data-sizes").removeClass("slick-loading")
                        }),
                        _.$slider.trigger("lazyLoaded", [_, image, imageSource])
                    })
                }
                ,
                imageToLoad.onerror = function() {
                    image.removeAttr("data-lazy").removeClass("slick-loading").addClass("slick-lazyload-error"),
                    _.$slider.trigger("lazyLoadError", [_, image, imageSource])
                }
                ,
                imageToLoad.src = imageSource
            })
        }
        var loadRange, cloneRange, rangeStart, rangeEnd, _ = this;
        if (!0 === _.options.centerMode ? !0 === _.options.infinite ? (rangeStart = _.currentSlide + (_.options.slidesToShow / 2 + 1),
        rangeEnd = rangeStart + _.options.slidesToShow + 2) : (rangeStart = Math.max(0, _.currentSlide - (_.options.slidesToShow / 2 + 1)),
        rangeEnd = _.options.slidesToShow / 2 + 1 + 2 + _.currentSlide) : (rangeStart = _.options.infinite ? _.options.slidesToShow + _.currentSlide : _.currentSlide,
        rangeEnd = Math.ceil(rangeStart + _.options.slidesToShow),
        !0 === _.options.fade && (rangeStart > 0 && rangeStart--,
        rangeEnd <= _.slideCount && rangeEnd++)),
        loadRange = _.$slider.find(".slick-slide").slice(rangeStart, rangeEnd),
        "anticipated" === _.options.lazyLoad)
            for (var prevSlide = rangeStart - 1, nextSlide = rangeEnd, $slides = _.$slider.find(".slick-slide"), i = 0; i < _.options.slidesToScroll; i++)
                prevSlide < 0 && (prevSlide = _.slideCount - 1),
                loadRange = loadRange.add($slides.eq(prevSlide)),
                loadRange = loadRange.add($slides.eq(nextSlide)),
                prevSlide--,
                nextSlide++;
        loadImages(loadRange),
        _.slideCount <= _.options.slidesToShow ? (cloneRange = _.$slider.find(".slick-slide"),
        loadImages(cloneRange)) : _.currentSlide >= _.slideCount - _.options.slidesToShow ? (cloneRange = _.$slider.find(".slick-cloned").slice(0, _.options.slidesToShow),
        loadImages(cloneRange)) : 0 === _.currentSlide && (cloneRange = _.$slider.find(".slick-cloned").slice(-1 * _.options.slidesToShow),
        loadImages(cloneRange))
    }
    ,
    Slick.prototype.loadSlider = function() {
        var _ = this;
        _.setPosition(),
        _.$slideTrack.css({
            opacity: 1
        }),
        _.$slider.removeClass("slick-loading"),
        _.initUI(),
        "progressive" === _.options.lazyLoad && _.progressiveLazyLoad()
    }
    ,
    Slick.prototype.next = Slick.prototype.slickNext = function() {
        this.changeSlide({
            data: {
                message: "next"
            }
        })
    }
    ,
    Slick.prototype.orientationChange = function() {
        var _ = this;
        _.checkResponsive(),
        _.setPosition()
    }
    ,
    Slick.prototype.pause = Slick.prototype.slickPause = function() {
        var _ = this;
        _.autoPlayClear(),
        _.paused = !0
    }
    ,
    Slick.prototype.play = Slick.prototype.slickPlay = function() {
        var _ = this;
        _.autoPlay(),
        _.options.autoplay = !0,
        _.paused = !1,
        _.focussed = !1,
        _.interrupted = !1
    }
    ,
    Slick.prototype.postSlide = function(index) {
        var _ = this;
        if (!_.unslicked && (_.$slider.trigger("afterChange", [_, index]),
        _.animating = !1,
        _.slideCount > _.options.slidesToShow && _.setPosition(),
        _.swipeLeft = null,
        _.options.autoplay && _.autoPlay(),
        !0 === _.options.accessibility && (_.initADA(),
        _.options.focusOnChange))) {
            $(_.$slides.get(_.currentSlide)).attr("tabindex", 0).focus()
        }
    }
    ,
    Slick.prototype.prev = Slick.prototype.slickPrev = function() {
        this.changeSlide({
            data: {
                message: "previous"
            }
        })
    }
    ,
    Slick.prototype.preventDefault = function(event) {
        event.preventDefault()
    }
    ,
    Slick.prototype.progressiveLazyLoad = function(tryCount) {
        tryCount = tryCount || 1;
        var image, imageSource, imageSrcSet, imageSizes, imageToLoad, _ = this, $imgsToLoad = $("img[data-lazy]", _.$slider);
        $imgsToLoad.length ? (image = $imgsToLoad.first(),
        imageSource = image.attr("data-lazy"),
        imageSrcSet = image.attr("data-srcset"),
        imageSizes = image.attr("data-sizes") || _.$slider.attr("data-sizes"),
        imageToLoad = document.createElement("img"),
        imageToLoad.onload = function() {
            imageSrcSet && (image.attr("srcset", imageSrcSet),
            imageSizes && image.attr("sizes", imageSizes)),
            image.attr("src", imageSource).removeAttr("data-lazy data-srcset data-sizes").removeClass("slick-loading"),
            !0 === _.options.adaptiveHeight && _.setPosition(),
            _.$slider.trigger("lazyLoaded", [_, image, imageSource]),
            _.progressiveLazyLoad()
        }
        ,
        imageToLoad.onerror = function() {
            tryCount < 3 ? setTimeout(function() {
                _.progressiveLazyLoad(tryCount + 1)
            }, 500) : (image.removeAttr("data-lazy").removeClass("slick-loading").addClass("slick-lazyload-error"),
            _.$slider.trigger("lazyLoadError", [_, image, imageSource]),
            _.progressiveLazyLoad())
        }
        ,
        imageToLoad.src = imageSource) : _.$slider.trigger("allImagesLoaded", [_])
    }
    ,
    Slick.prototype.refresh = function(initializing) {
        var currentSlide, lastVisibleIndex, _ = this;
        lastVisibleIndex = _.slideCount - _.options.slidesToShow,
        !_.options.infinite && _.currentSlide > lastVisibleIndex && (_.currentSlide = lastVisibleIndex),
        _.slideCount <= _.options.slidesToShow && (_.currentSlide = 0),
        currentSlide = _.currentSlide,
        _.destroy(!0),
        $.extend(_, _.initials, {
            currentSlide: currentSlide
        }),
        _.init(),
        initializing || _.changeSlide({
            data: {
                message: "index",
                index: currentSlide
            }
        }, !1)
    }
    ,
    Slick.prototype.registerBreakpoints = function() {
        var breakpoint, currentBreakpoint, l, _ = this, responsiveSettings = _.options.responsive || null;
        if ("array" === $.type(responsiveSettings) && responsiveSettings.length) {
            _.respondTo = _.options.respondTo || "window";
            for (breakpoint in responsiveSettings)
                if (l = _.breakpoints.length - 1,
                responsiveSettings.hasOwnProperty(breakpoint)) {
                    for (currentBreakpoint = responsiveSettings[breakpoint].breakpoint; l >= 0; )
                        _.breakpoints[l] && _.breakpoints[l] === currentBreakpoint && _.breakpoints.splice(l, 1),
                        l--;
                    _.breakpoints.push(currentBreakpoint),
                    _.breakpointSettings[currentBreakpoint] = responsiveSettings[breakpoint].settings
                }
            _.breakpoints.sort(function(a, b) {
                return _.options.mobileFirst ? a - b : b - a
            })
        }
    }
    ,
    Slick.prototype.reinit = function() {
        var _ = this;
        _.$slides = _.$slideTrack.children(_.options.slide).addClass("slick-slide"),
        _.slideCount = _.$slides.length,
        _.currentSlide >= _.slideCount && 0 !== _.currentSlide && (_.currentSlide = _.currentSlide - _.options.slidesToScroll),
        _.slideCount <= _.options.slidesToShow && (_.currentSlide = 0),
        _.registerBreakpoints(),
        _.setProps(),
        _.setupInfinite(),
        _.buildArrows(),
        _.updateArrows(),
        _.initArrowEvents(),
        _.buildDots(),
        _.updateDots(),
        _.initDotEvents(),
        _.cleanUpSlideEvents(),
        _.initSlideEvents(),
        _.checkResponsive(!1, !0),
        !0 === _.options.focusOnSelect && $(_.$slideTrack).children().on("click.slick", _.selectHandler),
        _.setSlideClasses("number" == typeof _.currentSlide ? _.currentSlide : 0),
        _.setPosition(),
        _.focusHandler(),
        _.paused = !_.options.autoplay,
        _.autoPlay(),
        _.$slider.trigger("reInit", [_])
    }
    ,
    Slick.prototype.resize = function() {
        var _ = this;
        $(window).width() !== _.windowWidth && (clearTimeout(_.windowDelay),
        _.windowDelay = window.setTimeout(function() {
            _.windowWidth = $(window).width(),
            _.checkResponsive(),
            _.unslicked || _.setPosition()
        }, 50))
    }
    ,
    Slick.prototype.removeSlide = Slick.prototype.slickRemove = function(index, removeBefore, removeAll) {
        var _ = this;
        if ("boolean" == typeof index ? (removeBefore = index,
        index = !0 === removeBefore ? 0 : _.slideCount - 1) : index = !0 === removeBefore ? --index : index,
        _.slideCount < 1 || index < 0 || index > _.slideCount - 1)
            return !1;
        _.unload(),
        !0 === removeAll ? _.$slideTrack.children().remove() : _.$slideTrack.children(this.options.slide).eq(index).remove(),
        _.$slides = _.$slideTrack.children(this.options.slide),
        _.$slideTrack.children(this.options.slide).detach(),
        _.$slideTrack.append(_.$slides),
        _.$slidesCache = _.$slides,
        _.reinit()
    }
    ,
    Slick.prototype.setCSS = function(position) {
        var x, y, _ = this, positionProps = {};
        !0 === _.options.rtl && (position = -position),
        x = "left" == _.positionProp ? Math.ceil(position) + "px" : "0px",
        y = "top" == _.positionProp ? Math.ceil(position) + "px" : "0px",
        positionProps[_.positionProp] = position,
        !1 === _.transformsEnabled ? _.$slideTrack.css(positionProps) : (positionProps = {},
        !1 === _.cssTransitions ? (positionProps[_.animType] = "translate(" + x + ", " + y + ")",
        _.$slideTrack.css(positionProps)) : (positionProps[_.animType] = "translate3d(" + x + ", " + y + ", 0px)",
        _.$slideTrack.css(positionProps)))
    }
    ,
    Slick.prototype.setDimensions = function() {
        var _ = this;
        !1 === _.options.vertical ? !0 === _.options.centerMode && _.$list.css({
            padding: "0px " + _.options.centerPadding
        }) : (_.$list.height(_.$slides.first().outerHeight(!0) * _.options.slidesToShow),
        !0 === _.options.centerMode && _.$list.css({
            padding: _.options.centerPadding + " 0px"
        })),
        _.listWidth = _.$list.width(),
        _.listHeight = _.$list.height(),
        !1 === _.options.vertical && !1 === _.options.variableWidth ? (_.slideWidth = Math.ceil(_.listWidth / _.options.slidesToShow),
        _.$slideTrack.width(Math.ceil(_.slideWidth * _.$slideTrack.children(".slick-slide").length))) : !0 === _.options.variableWidth ? _.$slideTrack.width(5e3 * _.slideCount) : (_.slideWidth = Math.ceil(_.listWidth),
        _.$slideTrack.height(Math.ceil(_.$slides.first().outerHeight(!0) * _.$slideTrack.children(".slick-slide").length)));
        var offset = _.$slides.first().outerWidth(!0) - _.$slides.first().width();
        !1 === _.options.variableWidth && _.$slideTrack.children(".slick-slide").width(_.slideWidth - offset)
    }
    ,
    Slick.prototype.setFade = function() {
        var targetLeft, _ = this;
        _.$slides.each(function(index, element) {
            targetLeft = _.slideWidth * index * -1,
            !0 === _.options.rtl ? $(element).css({
                position: "relative",
                right: targetLeft,
                top: 0,
                zIndex: _.options.zIndex - 2,
                opacity: 0
            }) : $(element).css({
                position: "relative",
                left: targetLeft,
                top: 0,
                zIndex: _.options.zIndex - 2,
                opacity: 0
            })
        }),
        _.$slides.eq(_.currentSlide).css({
            zIndex: _.options.zIndex - 1,
            opacity: 1
        })
    }
    ,
    Slick.prototype.setHeight = function() {
        var _ = this;
        if (1 === _.options.slidesToShow && !0 === _.options.adaptiveHeight && !1 === _.options.vertical) {
            var targetHeight = _.$slides.eq(_.currentSlide).outerHeight(!0);
            _.$list.css("height", targetHeight)
        }
    }
    ,
    Slick.prototype.setOption = Slick.prototype.slickSetOption = function() {
        var l, item, option, value, type, _ = this, refresh = !1;
        if ("object" === $.type(arguments[0]) ? (option = arguments[0],
        refresh = arguments[1],
        type = "multiple") : "string" === $.type(arguments[0]) && (option = arguments[0],
        value = arguments[1],
        refresh = arguments[2],
        "responsive" === arguments[0] && "array" === $.type(arguments[1]) ? type = "responsive" : void 0 !== arguments[1] && (type = "single")),
        "single" === type)
            _.options[option] = value;
        else if ("multiple" === type)
            $.each(option, function(opt, val) {
                _.options[opt] = val
            });
        else if ("responsive" === type)
            for (item in value)
                if ("array" !== $.type(_.options.responsive))
                    _.options.responsive = [value[item]];
                else {
                    for (l = _.options.responsive.length - 1; l >= 0; )
                        _.options.responsive[l].breakpoint === value[item].breakpoint && _.options.responsive.splice(l, 1),
                        l--;
                    _.options.responsive.push(value[item])
                }
        refresh && (_.unload(),
        _.reinit())
    }
    ,
    Slick.prototype.setPosition = function() {
        var _ = this;
        _.setDimensions(),
        _.setHeight(),
        !1 === _.options.fade ? _.setCSS(_.getLeft(_.currentSlide)) : _.setFade(),
        _.$slider.trigger("setPosition", [_])
    }
    ,
    Slick.prototype.setProps = function() {
        var _ = this
          , bodyStyle = document.body.style;
        _.positionProp = !0 === _.options.vertical ? "top" : "left",
        "top" === _.positionProp ? _.$slider.addClass("slick-vertical") : _.$slider.removeClass("slick-vertical"),
        void 0 === bodyStyle.WebkitTransition && void 0 === bodyStyle.MozTransition && void 0 === bodyStyle.msTransition || !0 === _.options.useCSS && (_.cssTransitions = !0),
        _.options.fade && ("number" == typeof _.options.zIndex ? _.options.zIndex < 3 && (_.options.zIndex = 3) : _.options.zIndex = _.defaults.zIndex),
        void 0 !== bodyStyle.OTransform && (_.animType = "OTransform",
        _.transformType = "-o-transform",
        _.transitionType = "OTransition",
        void 0 === bodyStyle.perspectiveProperty && void 0 === bodyStyle.webkitPerspective && (_.animType = !1)),
        void 0 !== bodyStyle.MozTransform && (_.animType = "MozTransform",
        _.transformType = "-moz-transform",
        _.transitionType = "MozTransition",
        void 0 === bodyStyle.perspectiveProperty && void 0 === bodyStyle.MozPerspective && (_.animType = !1)),
        void 0 !== bodyStyle.webkitTransform && (_.animType = "webkitTransform",
        _.transformType = "-webkit-transform",
        _.transitionType = "webkitTransition",
        void 0 === bodyStyle.perspectiveProperty && void 0 === bodyStyle.webkitPerspective && (_.animType = !1)),
        void 0 !== bodyStyle.msTransform && (_.animType = "msTransform",
        _.transformType = "-ms-transform",
        _.transitionType = "msTransition",
        void 0 === bodyStyle.msTransform && (_.animType = !1)),
        void 0 !== bodyStyle.transform && !1 !== _.animType && (_.animType = "transform",
        _.transformType = "transform",
        _.transitionType = "transition"),
        _.transformsEnabled = _.options.useTransform && null !== _.animType && !1 !== _.animType
    }
    ,
    Slick.prototype.setSlideClasses = function(index) {
        var centerOffset, allSlides, indexOffset, remainder, _ = this;
        if (allSlides = _.$slider.find(".slick-slide").removeClass("slick-active slick-center slick-current").attr("aria-hidden", "true"),
        _.$slides.eq(index).addClass("slick-current"),
        !0 === _.options.centerMode) {
            var evenCoef = _.options.slidesToShow % 2 == 0 ? 1 : 0;
            centerOffset = Math.floor(_.options.slidesToShow / 2),
            !0 === _.options.infinite && (index >= centerOffset && index <= _.slideCount - 1 - centerOffset ? _.$slides.slice(index - centerOffset + evenCoef, index + centerOffset + 1).addClass("slick-active").attr("aria-hidden", "false") : (indexOffset = _.options.slidesToShow + index,
            allSlides.slice(indexOffset - centerOffset + 1 + evenCoef, indexOffset + centerOffset + 2).addClass("slick-active").attr("aria-hidden", "false")),
            0 === index ? allSlides.eq(allSlides.length - 1 - _.options.slidesToShow).addClass("slick-center") : index === _.slideCount - 1 && allSlides.eq(_.options.slidesToShow).addClass("slick-center")),
            _.$slides.eq(index).addClass("slick-center")
        } else
            index >= 0 && index <= _.slideCount - _.options.slidesToShow ? _.$slides.slice(index, index + _.options.slidesToShow).addClass("slick-active").attr("aria-hidden", "false") : allSlides.length <= _.options.slidesToShow ? allSlides.addClass("slick-active").attr("aria-hidden", "false") : (remainder = _.slideCount % _.options.slidesToShow,
            indexOffset = !0 === _.options.infinite ? _.options.slidesToShow + index : index,
            _.options.slidesToShow == _.options.slidesToScroll && _.slideCount - index < _.options.slidesToShow ? allSlides.slice(indexOffset - (_.options.slidesToShow - remainder), indexOffset + remainder).addClass("slick-active").attr("aria-hidden", "false") : allSlides.slice(indexOffset, indexOffset + _.options.slidesToShow).addClass("slick-active").attr("aria-hidden", "false"));
        "ondemand" !== _.options.lazyLoad && "anticipated" !== _.options.lazyLoad || _.lazyLoad()
    }
    ,
    Slick.prototype.setupInfinite = function() {
        var i, slideIndex, infiniteCount, _ = this;
        if (!0 === _.options.fade && (_.options.centerMode = !1),
        !0 === _.options.infinite && !1 === _.options.fade && (slideIndex = null,
        _.slideCount > _.options.slidesToShow)) {
            for (infiniteCount = !0 === _.options.centerMode ? _.options.slidesToShow + 1 : _.options.slidesToShow,
            i = _.slideCount; i > _.slideCount - infiniteCount; i -= 1)
                slideIndex = i - 1,
                $(_.$slides[slideIndex]).clone(!0).attr("id", "").attr("data-slick-index", slideIndex - _.slideCount).prependTo(_.$slideTrack).addClass("slick-cloned");
            for (i = 0; i < infiniteCount + _.slideCount; i += 1)
                slideIndex = i,
                $(_.$slides[slideIndex]).clone(!0).attr("id", "").attr("data-slick-index", slideIndex + _.slideCount).appendTo(_.$slideTrack).addClass("slick-cloned");
            _.$slideTrack.find(".slick-cloned").find("[id]").each(function() {
                $(this).attr("id", "")
            })
        }
    }
    ,
    Slick.prototype.interrupt = function(toggle) {
        var _ = this;
        toggle || _.autoPlay(),
        _.interrupted = toggle
    }
    ,
    Slick.prototype.selectHandler = function(event) {
        var _ = this
          , targetElement = $(event.target).is(".slick-slide") ? $(event.target) : $(event.target).parents(".slick-slide")
          , index = parseInt(targetElement.attr("data-slick-index"));
        if (index || (index = 0),
        _.slideCount <= _.options.slidesToShow)
            return void _.slideHandler(index, !1, !0);
        _.slideHandler(index)
    }
    ,
    Slick.prototype.slideHandler = function(index, sync, dontAnimate) {
        var targetSlide, animSlide, oldSlide, slideLeft, navTarget, targetLeft = null, _ = this;
        if (sync = sync || !1,
        !(!0 === _.animating && !0 === _.options.waitForAnimate || !0 === _.options.fade && _.currentSlide === index)) {
            if (!1 === sync && _.asNavFor(index),
            targetSlide = index,
            targetLeft = _.getLeft(targetSlide),
            slideLeft = _.getLeft(_.currentSlide),
            _.currentLeft = null === _.swipeLeft ? slideLeft : _.swipeLeft,
            !1 === _.options.infinite && !1 === _.options.centerMode && (index < 0 || index > _.getDotCount() * _.options.slidesToScroll))
                return void (!1 === _.options.fade && (targetSlide = _.currentSlide,
                !0 !== dontAnimate && _.slideCount > _.options.slidesToShow ? _.animateSlide(slideLeft, function() {
                    _.postSlide(targetSlide)
                }) : _.postSlide(targetSlide)));
            if (!1 === _.options.infinite && !0 === _.options.centerMode && (index < 0 || index > _.slideCount - _.options.slidesToScroll))
                return void (!1 === _.options.fade && (targetSlide = _.currentSlide,
                !0 !== dontAnimate && _.slideCount > _.options.slidesToShow ? _.animateSlide(slideLeft, function() {
                    _.postSlide(targetSlide)
                }) : _.postSlide(targetSlide)));
            if (_.options.autoplay && clearInterval(_.autoPlayTimer),
            animSlide = targetSlide < 0 ? _.slideCount % _.options.slidesToScroll != 0 ? _.slideCount - _.slideCount % _.options.slidesToScroll : _.slideCount + targetSlide : targetSlide >= _.slideCount ? _.slideCount % _.options.slidesToScroll != 0 ? 0 : targetSlide - _.slideCount : targetSlide,
            _.animating = !0,
            _.$slider.trigger("beforeChange", [_, _.currentSlide, animSlide]),
            oldSlide = _.currentSlide,
            _.currentSlide = animSlide,
            _.setSlideClasses(_.currentSlide),
            _.options.asNavFor && (navTarget = _.getNavTarget(),
            navTarget = navTarget.slick("getSlick"),
            navTarget.slideCount <= navTarget.options.slidesToShow && navTarget.setSlideClasses(_.currentSlide)),
            _.updateDots(),
            _.updateArrows(),
            !0 === _.options.fade)
                return !0 !== dontAnimate ? (_.fadeSlideOut(oldSlide),
                _.fadeSlide(animSlide, function() {
                    _.postSlide(animSlide)
                })) : _.postSlide(animSlide),
                void _.animateHeight();
            !0 !== dontAnimate && _.slideCount > _.options.slidesToShow ? _.animateSlide(targetLeft, function() {
                _.postSlide(animSlide)
            }) : _.postSlide(animSlide)
        }
    }
    ,
    Slick.prototype.startLoad = function() {
        var _ = this;
        !0 === _.options.arrows && _.slideCount > _.options.slidesToShow && (_.$prevArrow.hide(),
        _.$nextArrow.hide()),
        !0 === _.options.dots && _.slideCount > _.options.slidesToShow && _.$dots.hide(),
        _.$slider.addClass("slick-loading")
    }
    ,
    Slick.prototype.swipeDirection = function() {
        var xDist, yDist, r, swipeAngle, _ = this;
        return xDist = _.touchObject.startX - _.touchObject.curX,
        yDist = _.touchObject.startY - _.touchObject.curY,
        r = Math.atan2(yDist, xDist),
        swipeAngle = Math.round(180 * r / Math.PI),
        swipeAngle < 0 && (swipeAngle = 360 - Math.abs(swipeAngle)),
        swipeAngle <= 45 && swipeAngle >= 0 ? !1 === _.options.rtl ? "left" : "right" : swipeAngle <= 360 && swipeAngle >= 315 ? !1 === _.options.rtl ? "left" : "right" : swipeAngle >= 135 && swipeAngle <= 225 ? !1 === _.options.rtl ? "right" : "left" : !0 === _.options.verticalSwiping ? swipeAngle >= 35 && swipeAngle <= 135 ? "down" : "up" : "vertical"
    }
    ,
    Slick.prototype.swipeEnd = function(event) {
        var slideCount, direction, _ = this;
        if (_.dragging = !1,
        _.swiping = !1,
        _.scrolling)
            return _.scrolling = !1,
            !1;
        if (_.interrupted = !1,
        _.shouldClick = !(_.touchObject.swipeLength > 10),
        void 0 === _.touchObject.curX)
            return !1;
        if (!0 === _.touchObject.edgeHit && _.$slider.trigger("edge", [_, _.swipeDirection()]),
        _.touchObject.swipeLength >= _.touchObject.minSwipe) {
            switch (direction = _.swipeDirection()) {
            case "left":
            case "down":
                slideCount = _.options.swipeToSlide ? _.checkNavigable(_.currentSlide + _.getSlideCount()) : _.currentSlide + _.getSlideCount(),
                _.currentDirection = 0;
                break;
            case "right":
            case "up":
                slideCount = _.options.swipeToSlide ? _.checkNavigable(_.currentSlide - _.getSlideCount()) : _.currentSlide - _.getSlideCount(),
                _.currentDirection = 1
            }
            "vertical" != direction && (_.slideHandler(slideCount),
            _.touchObject = {},
            _.$slider.trigger("swipe", [_, direction]))
        } else
            _.touchObject.startX !== _.touchObject.curX && (_.slideHandler(_.currentSlide),
            _.touchObject = {})
    }
    ,
    Slick.prototype.swipeHandler = function(event) {
        var _ = this;
        if (!(!1 === _.options.swipe || "ontouchend"in document && !1 === _.options.swipe || !1 === _.options.draggable && -1 !== event.type.indexOf("mouse")))
            switch (_.touchObject.fingerCount = event.originalEvent && void 0 !== event.originalEvent.touches ? event.originalEvent.touches.length : 1,
            _.touchObject.minSwipe = _.listWidth / _.options.touchThreshold,
            !0 === _.options.verticalSwiping && (_.touchObject.minSwipe = _.listHeight / _.options.touchThreshold),
            event.data.action) {
            case "start":
                _.swipeStart(event);
                break;
            case "move":
                _.swipeMove(event);
                break;
            case "end":
                _.swipeEnd(event)
            }
    }
    ,
    Slick.prototype.swipeMove = function(event) {
        var curLeft, swipeDirection, swipeLength, positionOffset, touches, verticalSwipeLength, _ = this;
        return touches = void 0 !== event.originalEvent ? event.originalEvent.touches : null,
        !(!_.dragging || _.scrolling || touches && 1 !== touches.length) && (curLeft = _.getLeft(_.currentSlide),
        _.touchObject.curX = void 0 !== touches ? touches[0].pageX : event.clientX,
        _.touchObject.curY = void 0 !== touches ? touches[0].pageY : event.clientY,
        _.touchObject.swipeLength = Math.round(Math.sqrt(Math.pow(_.touchObject.curX - _.touchObject.startX, 2))),
        verticalSwipeLength = Math.round(Math.sqrt(Math.pow(_.touchObject.curY - _.touchObject.startY, 2))),
        !_.options.verticalSwiping && !_.swiping && verticalSwipeLength > 4 ? (_.scrolling = !0,
        !1) : (!0 === _.options.verticalSwiping && (_.touchObject.swipeLength = verticalSwipeLength),
        swipeDirection = _.swipeDirection(),
        void 0 !== event.originalEvent && _.touchObject.swipeLength > 4 && (_.swiping = !0,
        event.preventDefault()),
        positionOffset = (!1 === _.options.rtl ? 1 : -1) * (_.touchObject.curX > _.touchObject.startX ? 1 : -1),
        !0 === _.options.verticalSwiping && (positionOffset = _.touchObject.curY > _.touchObject.startY ? 1 : -1),
        swipeLength = _.touchObject.swipeLength,
        _.touchObject.edgeHit = !1,
        !1 === _.options.infinite && (0 === _.currentSlide && "right" === swipeDirection || _.currentSlide >= _.getDotCount() && "left" === swipeDirection) && (swipeLength = _.touchObject.swipeLength * _.options.edgeFriction,
        _.touchObject.edgeHit = !0),
        !1 === _.options.vertical ? _.swipeLeft = curLeft + swipeLength * positionOffset : _.swipeLeft = curLeft + swipeLength * (_.$list.height() / _.listWidth) * positionOffset,
        !0 === _.options.verticalSwiping && (_.swipeLeft = curLeft + swipeLength * positionOffset),
        !0 !== _.options.fade && !1 !== _.options.touchMove && (!0 === _.animating ? (_.swipeLeft = null,
        !1) : void _.setCSS(_.swipeLeft))))
    }
    ,
    Slick.prototype.swipeStart = function(event) {
        var touches, _ = this;
        if (_.interrupted = !0,
        1 !== _.touchObject.fingerCount || _.slideCount <= _.options.slidesToShow)
            return _.touchObject = {},
            !1;
        void 0 !== event.originalEvent && void 0 !== event.originalEvent.touches && (touches = event.originalEvent.touches[0]),
        _.touchObject.startX = _.touchObject.curX = void 0 !== touches ? touches.pageX : event.clientX,
        _.touchObject.startY = _.touchObject.curY = void 0 !== touches ? touches.pageY : event.clientY,
        _.dragging = !0
    }
    ,
    Slick.prototype.unfilterSlides = Slick.prototype.slickUnfilter = function() {
        var _ = this;
        null !== _.$slidesCache && (_.unload(),
        _.$slideTrack.children(this.options.slide).detach(),
        _.$slidesCache.appendTo(_.$slideTrack),
        _.reinit())
    }
    ,
    Slick.prototype.unload = function() {
        var _ = this;
        $(".slick-cloned", _.$slider).remove(),
        _.$dots && _.$dots.remove(),
        _.$prevArrow && _.htmlExpr.test(_.options.prevArrow) && _.$prevArrow.remove(),
        _.$nextArrow && _.htmlExpr.test(_.options.nextArrow) && _.$nextArrow.remove(),
        _.$slides.removeClass("slick-slide slick-active slick-visible slick-current").attr("aria-hidden", "true").css("width", "")
    }
    ,
    Slick.prototype.unslick = function(fromBreakpoint) {
        var _ = this;
        _.$slider.trigger("unslick", [_, fromBreakpoint]),
        _.destroy()
    }
    ,
    Slick.prototype.updateArrows = function() {
        var _ = this;
        Math.floor(_.options.slidesToShow / 2),
        !0 === _.options.arrows && _.slideCount > _.options.slidesToShow && !_.options.infinite && (_.$prevArrow.removeClass("slick-disabled").attr("aria-disabled", "false"),
        _.$nextArrow.removeClass("slick-disabled").attr("aria-disabled", "false"),
        0 === _.currentSlide ? (_.$prevArrow.addClass("slick-disabled").attr("aria-disabled", "true"),
        _.$nextArrow.removeClass("slick-disabled").attr("aria-disabled", "false")) : _.currentSlide >= _.slideCount - _.options.slidesToShow && !1 === _.options.centerMode ? (_.$nextArrow.addClass("slick-disabled").attr("aria-disabled", "true"),
        _.$prevArrow.removeClass("slick-disabled").attr("aria-disabled", "false")) : _.currentSlide >= _.slideCount - 1 && !0 === _.options.centerMode && (_.$nextArrow.addClass("slick-disabled").attr("aria-disabled", "true"),
        _.$prevArrow.removeClass("slick-disabled").attr("aria-disabled", "false")))
    }
    ,
    Slick.prototype.updateDots = function() {
        var _ = this;
        null !== _.$dots && (_.$dots.find("li").removeClass("slick-active").end(),
        _.$dots.find("li").eq(Math.floor(_.currentSlide / _.options.slidesToScroll)).addClass("slick-active"))
    }
    ,
    Slick.prototype.visibility = function() {
        var _ = this;
        _.options.autoplay && (document[_.hidden] ? _.interrupted = !0 : _.interrupted = !1)
    }
    ,
    $.fn.slick = function() {
        var i, ret, _ = this, opt = arguments[0], args = Array.prototype.slice.call(arguments, 1), l = _.length;
        for (i = 0; i < l; i++)
            if ("object" == typeof opt || void 0 === opt ? _[i].slick = new Slick(_[i],opt) : ret = _[i].slick[opt].apply(_[i].slick, args),
            void 0 !== ret)
                return ret;
        return _
    }
}),
function(t, e) {
    "object" == typeof exports && "undefined" != typeof module ? e(exports, require("jquery")) : "function" == typeof define && define.amd ? define(["exports", "jquery"], e) : e((t = t || self).bootstrap = {}, t.jQuery)
}(this, function(t, p) {
    "use strict";
    function i(t, e) {
        for (var n = 0; n < e.length; n++) {
            var i = e[n];
            i.enumerable = i.enumerable || !1,
            i.configurable = !0,
            "value"in i && (i.writable = !0),
            Object.defineProperty(t, i.key, i)
        }
    }
    function s(t, e, n) {
        return e && i(t.prototype, e),
        n && i(t, n),
        t
    }
    function l(o) {
        for (var t = 1; t < arguments.length; t++) {
            var r = null != arguments[t] ? arguments[t] : {}
              , e = Object.keys(r);
            "function" == typeof Object.getOwnPropertySymbols && (e = e.concat(Object.getOwnPropertySymbols(r).filter(function(t) {
                return Object.getOwnPropertyDescriptor(r, t).enumerable
            }))),
            e.forEach(function(t) {
                var e, n, i;
                e = o,
                i = r[n = t],
                n in e ? Object.defineProperty(e, n, {
                    value: i,
                    enumerable: !0,
                    configurable: !0,
                    writable: !0
                }) : e[n] = i
            })
        }
        return o
    }
    function n(t) {
        var e = this
          , n = !1;
        return p(this).one(m.TRANSITION_END, function() {
            n = !0
        }),
        setTimeout(function() {
            n || m.triggerTransitionEnd(e)
        }, t),
        this
    }
    function Ot(t) {
        return t && "[object Function]" === {}.toString.call(t)
    }
    function Nt(t, e) {
        if (1 !== t.nodeType)
            return [];
        var n = t.ownerDocument.defaultView.getComputedStyle(t, null);
        return e ? n[e] : n
    }
    function kt(t) {
        return "HTML" === t.nodeName ? t : t.parentNode || t.host
    }
    function Lt(t) {
        if (!t)
            return document.body;
        switch (t.nodeName) {
        case "HTML":
        case "BODY":
            return t.ownerDocument.body;
        case "#document":
            return t.body
        }
        var e = Nt(t)
          , n = e.overflow
          , i = e.overflowX;
        return /(auto|scroll|overlay)/.test(n + e.overflowY + i) ? t : Lt(kt(t))
    }
    function Ht(t) {
        return 11 === t ? xt : 10 === t ? Pt : xt || Pt
    }
    function jt(t) {
        if (!t)
            return document.documentElement;
        for (var e = Ht(10) ? document.body : null, n = t.offsetParent || null; n === e && t.nextElementSibling; )
            n = (t = t.nextElementSibling).offsetParent;
        var i = n && n.nodeName;
        return i && "BODY" !== i && "HTML" !== i ? -1 !== ["TH", "TD", "TABLE"].indexOf(n.nodeName) && "static" === Nt(n, "position") ? jt(n) : n : t ? t.ownerDocument.documentElement : document.documentElement
    }
    function Rt(t) {
        return null !== t.parentNode ? Rt(t.parentNode) : t
    }
    function Ft(t, e) {
        if (!(t && t.nodeType && e && e.nodeType))
            return document.documentElement;
        var n = t.compareDocumentPosition(e) & Node.DOCUMENT_POSITION_FOLLOWING
          , i = n ? t : e
          , o = n ? e : t
          , r = document.createRange();
        r.setStart(i, 0),
        r.setEnd(o, 0);
        var s, a, l = r.commonAncestorContainer;
        if (t !== l && e !== l || i.contains(o))
            return "BODY" === (a = (s = l).nodeName) || "HTML" !== a && jt(s.firstElementChild) !== s ? jt(l) : l;
        var c = Rt(t);
        return c.host ? Ft(c.host, e) : Ft(t, Rt(e).host)
    }
    function Mt(t) {
        var e = "top" === (1 < arguments.length && void 0 !== arguments[1] ? arguments[1] : "top") ? "scrollTop" : "scrollLeft"
          , n = t.nodeName;
        if ("BODY" !== n && "HTML" !== n)
            return t[e];
        var i = t.ownerDocument.documentElement;
        return (t.ownerDocument.scrollingElement || i)[e]
    }
    function Wt(t, e) {
        var n = "x" === e ? "Left" : "Top"
          , i = "Left" === n ? "Right" : "Bottom";
        return parseFloat(t["border" + n + "Width"], 10) + parseFloat(t["border" + i + "Width"], 10)
    }
    function Ut(t, e, n, i) {
        return Math.max(e["offset" + t], e["scroll" + t], n["client" + t], n["offset" + t], n["scroll" + t], Ht(10) ? parseInt(n["offset" + t]) + parseInt(i["margin" + ("Height" === t ? "Top" : "Left")]) + parseInt(i["margin" + ("Height" === t ? "Bottom" : "Right")]) : 0)
    }
    function Bt(t) {
        var e = t.body
          , n = t.documentElement
          , i = Ht(10) && getComputedStyle(n);
        return {
            height: Ut("Height", e, n, i),
            width: Ut("Width", e, n, i)
        }
    }
    function Vt(t) {
        return Qt({}, t, {
            right: t.left + t.width,
            bottom: t.top + t.height
        })
    }
    function Yt(t) {
        var e = {};
        try {
            if (Ht(10)) {
                e = t.getBoundingClientRect();
                var n = Mt(t, "top")
                  , i = Mt(t, "left");
                e.top += n,
                e.left += i,
                e.bottom += n,
                e.right += i
            } else
                e = t.getBoundingClientRect()
        } catch (t) {}
        var o = {
            left: e.left,
            top: e.top,
            width: e.right - e.left,
            height: e.bottom - e.top
        }
          , r = "HTML" === t.nodeName ? Bt(t.ownerDocument) : {}
          , s = r.width || t.clientWidth || o.right - o.left
          , a = r.height || t.clientHeight || o.bottom - o.top
          , l = t.offsetWidth - s
          , c = t.offsetHeight - a;
        if (l || c) {
            var h = Nt(t);
            l -= Wt(h, "x"),
            c -= Wt(h, "y"),
            o.width -= l,
            o.height -= c
        }
        return Vt(o)
    }
    function zt(t, e) {
        var n = 2 < arguments.length && void 0 !== arguments[2] && arguments[2]
          , i = Ht(10)
          , o = "HTML" === e.nodeName
          , r = Yt(t)
          , s = Yt(e)
          , a = Lt(t)
          , l = Nt(e)
          , c = parseFloat(l.borderTopWidth, 10)
          , h = parseFloat(l.borderLeftWidth, 10);
        n && o && (s.top = Math.max(s.top, 0),
        s.left = Math.max(s.left, 0));
        var u = Vt({
            top: r.top - s.top - c,
            left: r.left - s.left - h,
            width: r.width,
            height: r.height
        });
        if (u.marginTop = 0,
        u.marginLeft = 0,
        !i && o) {
            var f = parseFloat(l.marginTop, 10)
              , d = parseFloat(l.marginLeft, 10);
            u.top -= c - f,
            u.bottom -= c - f,
            u.left -= h - d,
            u.right -= h - d,
            u.marginTop = f,
            u.marginLeft = d
        }
        return (i && !n ? e.contains(a) : e === a && "BODY" !== a.nodeName) && (u = function(t, e) {
            var n = 2 < arguments.length && void 0 !== arguments[2] && arguments[2]
              , i = Mt(e, "top")
              , o = Mt(e, "left")
              , r = n ? -1 : 1;
            return t.top += i * r,
            t.bottom += i * r,
            t.left += o * r,
            t.right += o * r,
            t
        }(u, e)),
        u
    }
    function Xt(t) {
        if (!t || !t.parentElement || Ht())
            return document.documentElement;
        for (var e = t.parentElement; e && "none" === Nt(e, "transform"); )
            e = e.parentElement;
        return e || document.documentElement
    }
    function Gt(t, e, n, i) {
        var o = 4 < arguments.length && void 0 !== arguments[4] && arguments[4]
          , r = {
            top: 0,
            left: 0
        }
          , s = o ? Xt(t) : Ft(t, e);
        if ("viewport" === i)
            r = function(t) {
                var e = 1 < arguments.length && void 0 !== arguments[1] && arguments[1]
                  , n = t.ownerDocument.documentElement
                  , i = zt(t, n)
                  , o = Math.max(n.clientWidth, window.innerWidth || 0)
                  , r = Math.max(n.clientHeight, window.innerHeight || 0)
                  , s = e ? 0 : Mt(n)
                  , a = e ? 0 : Mt(n, "left");
                return Vt({
                    top: s - i.top + i.marginTop,
                    left: a - i.left + i.marginLeft,
                    width: o,
                    height: r
                })
            }(s, o);
        else {
            var a = void 0;
            "scrollParent" === i ? "BODY" === (a = Lt(kt(e))).nodeName && (a = t.ownerDocument.documentElement) : a = "window" === i ? t.ownerDocument.documentElement : i;
            var l = zt(a, s, o);
            if ("HTML" !== a.nodeName || function t(e) {
                var n = e.nodeName;
                if ("BODY" === n || "HTML" === n)
                    return !1;
                if ("fixed" === Nt(e, "position"))
                    return !0;
                var i = kt(e);
                return !!i && t(i)
            }(s))
                r = l;
            else {
                var c = Bt(t.ownerDocument)
                  , h = c.height
                  , u = c.width;
                r.top += l.top - l.marginTop,
                r.bottom = h + l.top,
                r.left += l.left - l.marginLeft,
                r.right = u + l.left
            }
        }
        var f = "number" == typeof (n = n || 0);
        return r.left += f ? n : n.left || 0,
        r.top += f ? n : n.top || 0,
        r.right -= f ? n : n.right || 0,
        r.bottom -= f ? n : n.bottom || 0,
        r
    }
    function $t(t, e, i, n, o) {
        var r = 5 < arguments.length && void 0 !== arguments[5] ? arguments[5] : 0;
        if (-1 === t.indexOf("auto"))
            return t;
        var s = Gt(i, n, r, o)
          , a = {
            top: {
                width: s.width,
                height: e.top - s.top
            },
            right: {
                width: s.right - e.right,
                height: s.height
            },
            bottom: {
                width: s.width,
                height: s.bottom - e.bottom
            },
            left: {
                width: e.left - s.left,
                height: s.height
            }
        }
          , l = Object.keys(a).map(function(t) {
            return Qt({
                key: t
            }, a[t], {
                area: (e = a[t],
                e.width * e.height)
            });
            var e
        }).sort(function(t, e) {
            return e.area - t.area
        })
          , c = l.filter(function(t) {
            var e = t.width
              , n = t.height;
            return e >= i.clientWidth && n >= i.clientHeight
        })
          , h = 0 < c.length ? c[0].key : l[0].key
          , u = t.split("-")[1];
        return h + (u ? "-" + u : "")
    }
    function Jt(t, e, n) {
        var i = 3 < arguments.length && void 0 !== arguments[3] ? arguments[3] : null;
        return zt(n, i ? Xt(e) : Ft(e, n), i)
    }
    function Zt(t) {
        var e = t.ownerDocument.defaultView.getComputedStyle(t)
          , n = parseFloat(e.marginTop || 0) + parseFloat(e.marginBottom || 0)
          , i = parseFloat(e.marginLeft || 0) + parseFloat(e.marginRight || 0);
        return {
            width: t.offsetWidth + i,
            height: t.offsetHeight + n
        }
    }
    function te(t) {
        var e = {
            left: "right",
            right: "left",
            bottom: "top",
            top: "bottom"
        };
        return t.replace(/left|right|bottom|top/g, function(t) {
            return e[t]
        })
    }
    function ee(t, e, n) {
        n = n.split("-")[0];
        var i = Zt(t)
          , o = {
            width: i.width,
            height: i.height
        }
          , r = -1 !== ["right", "left"].indexOf(n)
          , s = r ? "top" : "left"
          , a = r ? "left" : "top"
          , l = r ? "height" : "width"
          , c = r ? "width" : "height";
        return o[s] = e[s] + e[l] / 2 - i[l] / 2,
        o[a] = n === a ? e[a] - i[c] : e[te(a)],
        o
    }
    function ne(t, e) {
        return Array.prototype.find ? t.find(e) : t.filter(e)[0]
    }
    function ie(t, n, e) {
        return (void 0 === e ? t : t.slice(0, function(t, e, n) {
            if (Array.prototype.findIndex)
                return t.findIndex(function(t) {
                    return t[e] === n
                });
            var i = ne(t, function(t) {
                return t[e] === n
            });
            return t.indexOf(i)
        }(t, "name", e))).forEach(function(t) {
            t.function && console.warn("`modifier.function` is deprecated, use `modifier.fn`!");
            var e = t.function || t.fn;
            t.enabled && Ot(e) && (n.offsets.popper = Vt(n.offsets.popper),
            n.offsets.reference = Vt(n.offsets.reference),
            n = e(n, t))
        }),
        n
    }
    function oe(t, n) {
        return t.some(function(t) {
            var e = t.name;
            return t.enabled && e === n
        })
    }
    function re(t) {
        for (var e = [!1, "ms", "Webkit", "Moz", "O"], n = t.charAt(0).toUpperCase() + t.slice(1), i = 0; i < e.length; i++) {
            var o = e[i]
              , r = o ? "" + o + n : t;
            if (void 0 !== document.body.style[r])
                return r
        }
        return null
    }
    function se(t) {
        var e = t.ownerDocument;
        return e ? e.defaultView : window
    }
    function ae(t, e, n, i) {
        n.updateBound = i,
        se(t).addEventListener("resize", n.updateBound, {
            passive: !0
        });
        var o = Lt(t);
        return function t(e, n, i, o) {
            var r = "BODY" === e.nodeName
              , s = r ? e.ownerDocument.defaultView : e;
            s.addEventListener(n, i, {
                passive: !0
            }),
            r || t(Lt(s.parentNode), n, i, o),
            o.push(s)
        }(o, "scroll", n.updateBound, n.scrollParents),
        n.scrollElement = o,
        n.eventsEnabled = !0,
        n
    }
    function le() {
        var t, e;
        this.state.eventsEnabled && (cancelAnimationFrame(this.scheduleUpdate),
        this.state = (t = this.reference,
        e = this.state,
        se(t).removeEventListener("resize", e.updateBound),
        e.scrollParents.forEach(function(t) {
            t.removeEventListener("scroll", e.updateBound)
        }),
        e.updateBound = null,
        e.scrollParents = [],
        e.scrollElement = null,
        e.eventsEnabled = !1,
        e))
    }
    function ce(t) {
        return "" !== t && !isNaN(parseFloat(t)) && isFinite(t)
    }
    function he(n, i) {
        Object.keys(i).forEach(function(t) {
            var e = "";
            -1 !== ["width", "height", "top", "right", "bottom", "left"].indexOf(t) && ce(i[t]) && (e = "px"),
            n.style[t] = i[t] + e
        })
    }
    function fe(t, e, n) {
        var i = ne(t, function(t) {
            return t.name === e
        })
          , o = !!i && t.some(function(t) {
            return t.name === n && t.enabled && t.order < i.order
        });
        if (!o) {
            var r = "`" + e + "`"
              , s = "`" + n + "`";
            console.warn(s + " modifier is required by " + r + " modifier in order to work, be sure to include it before " + r + "!")
        }
        return o
    }
    function me(t) {
        var e = 1 < arguments.length && void 0 !== arguments[1] && arguments[1]
          , n = pe.indexOf(t)
          , i = pe.slice(n + 1).concat(pe.slice(0, n));
        return e ? i.reverse() : i
    }
    function ye(t, o, r, e) {
        var s = [0, 0]
          , a = -1 !== ["right", "left"].indexOf(e)
          , n = t.split(/(\+|\-)/).map(function(t) {
            return t.trim()
        })
          , i = n.indexOf(ne(n, function(t) {
            return -1 !== t.search(/,|\s/)
        }));
        n[i] && -1 === n[i].indexOf(",") && console.warn("Offsets separated by white space(s) are deprecated, use a comma (,) instead.");
        var l = /\s*,\s*|\s+/
          , c = -1 !== i ? [n.slice(0, i).concat([n[i].split(l)[0]]), [n[i].split(l)[1]].concat(n.slice(i + 1))] : [n];
        return (c = c.map(function(t, e) {
            var n = (1 === e ? !a : a) ? "height" : "width"
              , i = !1;
            return t.reduce(function(t, e) {
                return "" === t[t.length - 1] && -1 !== ["+", "-"].indexOf(e) ? (t[t.length - 1] = e,
                i = !0,
                t) : i ? (t[t.length - 1] += e,
                i = !1,
                t) : t.concat(e)
            }, []).map(function(t) {
                return function(t, e, n, i) {
                    var o = t.match(/((?:\-|\+)?\d*\.?\d*)(.*)/)
                      , r = +o[1]
                      , s = o[2];
                    if (!r)
                        return t;
                    if (0 !== s.indexOf("%"))
                        return "vh" !== s && "vw" !== s ? r : ("vh" === s ? Math.max(document.documentElement.clientHeight, window.innerHeight || 0) : Math.max(document.documentElement.clientWidth, window.innerWidth || 0)) / 100 * r;
                    var a = void 0;
                    switch (s) {
                    case "%p":
                        a = n;
                        break;
                    case "%":
                    case "%r":
                    default:
                        a = i
                    }
                    return Vt(a)[e] / 100 * r
                }(t, n, o, r)
            })
        })).forEach(function(n, i) {
            n.forEach(function(t, e) {
                ce(t) && (s[i] += t * ("-" === n[e - 1] ? -1 : 1))
            })
        }),
        s
    }
    function bn(t, s, e) {
        if (0 === t.length)
            return t;
        if (e && "function" == typeof e)
            return e(t);
        for (var n = (new window.DOMParser).parseFromString(t, "text/html"), a = Object.keys(s), l = [].slice.call(n.body.querySelectorAll("*")), o = 0, r = l.length; o < r; o++)
            !function(t, e) {
                var n = l[t]
                  , i = n.nodeName.toLowerCase();
                if (-1 === a.indexOf(n.nodeName.toLowerCase()))
                    return n.parentNode.removeChild(n),
                    "continue";
                var o = [].slice.call(n.attributes)
                  , r = [].concat(s["*"] || [], s[i] || []);
                o.forEach(function(t) {
                    (function(t, e) {
                        var n = t.nodeName.toLowerCase();
                        if (-1 !== e.indexOf(n))
                            return -1 === _n.indexOf(n) || Boolean(t.nodeValue.match(yn) || t.nodeValue.match(En));
                        for (var i = e.filter(function(t) {
                            return t instanceof RegExp
                        }), o = 0, r = i.length; o < r; o++)
                            if (n.match(i[o]))
                                return !0;
                        return !1
                    }
                    )(t, r) || n.removeAttribute(t.nodeName)
                })
            }(o);
        return n.body.innerHTML
    }
    p = p && p.hasOwnProperty("default") ? p.default : p;
    var e = "transitionend"
      , m = {
        TRANSITION_END: "bsTransitionEnd",
        getUID: function(t) {
            for (; t += ~~(1e6 * Math.random()),
            document.getElementById(t); )
                ;
            return t
        },
        getSelectorFromElement: function(t) {
            var e = t.getAttribute("data-target");
            if (!e || "#" === e) {
                var n = t.getAttribute("href");
                e = n && "#" !== n ? n.trim() : ""
            }
            try {
                return document.querySelector(e) ? e : null
            } catch (t) {
                return null
            }
        },
        getTransitionDurationFromElement: function(t) {
            if (!t)
                return 0;
            var e = p(t).css("transition-duration")
              , n = p(t).css("transition-delay")
              , i = parseFloat(e)
              , o = parseFloat(n);
            return i || o ? (e = e.split(",")[0],
            n = n.split(",")[0],
            1e3 * (parseFloat(e) + parseFloat(n))) : 0
        },
        reflow: function(t) {
            return t.offsetHeight
        },
        triggerTransitionEnd: function(t) {
            p(t).trigger(e)
        },
        supportsTransitionEnd: function() {
            return Boolean(e)
        },
        isElement: function(t) {
            return (t[0] || t).nodeType
        },
        typeCheckConfig: function(t, e, n) {
            for (var i in n)
                if (Object.prototype.hasOwnProperty.call(n, i)) {
                    var o = n[i]
                      , r = e[i]
                      , s = r && m.isElement(r) ? "element" : (a = r,
                    {}.toString.call(a).match(/\s([a-z]+)/i)[1].toLowerCase());
                    if (!new RegExp(o).test(s))
                        throw new Error(t.toUpperCase() + ': Option "' + i + '" provided type "' + s + '" but expected type "' + o + '".')
                }
            var a
        },
        findShadowRoot: function(t) {
            if (!document.documentElement.attachShadow)
                return null;
            if ("function" != typeof t.getRootNode)
                return t instanceof ShadowRoot ? t : t.parentNode ? m.findShadowRoot(t.parentNode) : null;
            var e = t.getRootNode();
            return e instanceof ShadowRoot ? e : null
        }
    };
    p.fn.emulateTransitionEnd = n,
    p.event.special[m.TRANSITION_END] = {
        bindType: e,
        delegateType: e,
        handle: function(t) {
            if (p(t.target).is(this))
                return t.handleObj.handler.apply(this, arguments)
        }
    };
    var o = "alert"
      , r = "bs.alert"
      , a = "." + r
      , c = p.fn[o]
      , h = {
        CLOSE: "close" + a,
        CLOSED: "closed" + a,
        CLICK_DATA_API: "click" + a + ".data-api"
    }
      , g = function() {
        function i(t) {
            this._element = t
        }
        var t = i.prototype;
        return t.close = function(t) {
            var e = this._element;
            t && (e = this._getRootElement(t)),
            this._triggerCloseEvent(e).isDefaultPrevented() || this._removeElement(e)
        }
        ,
        t.dispose = function() {
            p.removeData(this._element, r),
            this._element = null
        }
        ,
        t._getRootElement = function(t) {
            var e = m.getSelectorFromElement(t)
              , n = !1;
            return e && (n = document.querySelector(e)),
            n || (n = p(t).closest(".alert")[0]),
            n
        }
        ,
        t._triggerCloseEvent = function(t) {
            var e = p.Event(h.CLOSE);
            return p(t).trigger(e),
            e
        }
        ,
        t._removeElement = function(e) {
            var n = this;
            if (p(e).removeClass("show"),
            p(e).hasClass("fade")) {
                var t = m.getTransitionDurationFromElement(e);
                p(e).one(m.TRANSITION_END, function(t) {
                    return n._destroyElement(e, t)
                }).emulateTransitionEnd(t)
            } else
                this._destroyElement(e)
        }
        ,
        t._destroyElement = function(t) {
            p(t).detach().trigger(h.CLOSED).remove()
        }
        ,
        i._jQueryInterface = function(n) {
            return this.each(function() {
                var t = p(this)
                  , e = t.data(r);
                e || (e = new i(this),
                t.data(r, e)),
                "close" === n && e[n](this)
            })
        }
        ,
        i._handleDismiss = function(e) {
            return function(t) {
                t && t.preventDefault(),
                e.close(this)
            }
        }
        ,
        s(i, null, [{
            key: "VERSION",
            get: function() {
                return "4.3.1"
            }
        }]),
        i
    }();
    p(document).on(h.CLICK_DATA_API, '[data-dismiss="alert"]', g._handleDismiss(new g)),
    p.fn[o] = g._jQueryInterface,
    p.fn[o].Constructor = g,
    p.fn[o].noConflict = function() {
        return p.fn[o] = c,
        g._jQueryInterface
    }
    ;
    var _ = "button"
      , v = "bs.button"
      , y = "." + v
      , E = ".data-api"
      , b = p.fn[_]
      , w = "active"
      , S = '[data-toggle^="button"]'
      , O = ".btn"
      , N = {
        CLICK_DATA_API: "click" + y + E,
        FOCUS_BLUR_DATA_API: "focus" + y + E + " blur" + y + E
    }
      , k = function() {
        function n(t) {
            this._element = t
        }
        var t = n.prototype;
        return t.toggle = function() {
            var t = !0
              , e = !0
              , n = p(this._element).closest('[data-toggle="buttons"]')[0];
            if (n) {
                var i = this._element.querySelector('input:not([type="hidden"])');
                if (i) {
                    if ("radio" === i.type)
                        if (i.checked && this._element.classList.contains(w))
                            t = !1;
                        else {
                            var o = n.querySelector(".active");
                            o && p(o).removeClass(w)
                        }
                    if (t) {
                        if (i.hasAttribute("disabled") || n.hasAttribute("disabled") || i.classList.contains("disabled") || n.classList.contains("disabled"))
                            return;
                        i.checked = !this._element.classList.contains(w),
                        p(i).trigger("change")
                    }
                    i.focus(),
                    e = !1
                }
            }
            e && this._element.setAttribute("aria-pressed", !this._element.classList.contains(w)),
            t && p(this._element).toggleClass(w)
        }
        ,
        t.dispose = function() {
            p.removeData(this._element, v),
            this._element = null
        }
        ,
        n._jQueryInterface = function(e) {
            return this.each(function() {
                var t = p(this).data(v);
                t || (t = new n(this),
                p(this).data(v, t)),
                "toggle" === e && t[e]()
            })
        }
        ,
        s(n, null, [{
            key: "VERSION",
            get: function() {
                return "4.3.1"
            }
        }]),
        n
    }();
    p(document).on(N.CLICK_DATA_API, S, function(t) {
        t.preventDefault();
        var e = t.target;
        p(e).hasClass("btn") || (e = p(e).closest(O)),
        k._jQueryInterface.call(p(e), "toggle")
    }).on(N.FOCUS_BLUR_DATA_API, S, function(t) {
        var e = p(t.target).closest(O)[0];
        p(e).toggleClass("focus", /^focus(in)?$/.test(t.type))
    }),
    p.fn[_] = k._jQueryInterface,
    p.fn[_].Constructor = k,
    p.fn[_].noConflict = function() {
        return p.fn[_] = b,
        k._jQueryInterface
    }
    ;
    var L = "carousel"
      , x = "bs.carousel"
      , P = "." + x
      , H = ".data-api"
      , j = p.fn[L]
      , R = {
        interval: 5e3,
        keyboard: !0,
        slide: !1,
        pause: "hover",
        wrap: !0,
        touch: !0
    }
      , F = {
        interval: "(number|boolean)",
        keyboard: "boolean",
        slide: "(boolean|string)",
        pause: "(string|boolean)",
        wrap: "boolean",
        touch: "boolean"
    }
      , M = "next"
      , W = "prev"
      , q = {
        SLIDE: "slide" + P,
        SLID: "slid" + P,
        KEYDOWN: "keydown" + P,
        MOUSEENTER: "mouseenter" + P,
        MOUSELEAVE: "mouseleave" + P,
        TOUCHSTART: "touchstart" + P,
        TOUCHMOVE: "touchmove" + P,
        TOUCHEND: "touchend" + P,
        POINTERDOWN: "pointerdown" + P,
        POINTERUP: "pointerup" + P,
        DRAG_START: "dragstart" + P,
        LOAD_DATA_API: "load" + P + H,
        CLICK_DATA_API: "click" + P + H
    }
      , Q = "active"
      , Z = ".active.carousel-item"
      , it = ".carousel-indicators"
      , st = {
        TOUCH: "touch",
        PEN: "pen"
    }
      , at = function() {
        function r(t, e) {
            this._items = null,
            this._interval = null,
            this._activeElement = null,
            this._isPaused = !1,
            this._isSliding = !1,
            this.touchTimeout = null,
            this.touchStartX = 0,
            this.touchDeltaX = 0,
            this._config = this._getConfig(e),
            this._element = t,
            this._indicatorsElement = this._element.querySelector(it),
            this._touchSupported = "ontouchstart"in document.documentElement || 0 < navigator.maxTouchPoints,
            this._pointerEvent = Boolean(window.PointerEvent || window.MSPointerEvent),
            this._addEventListeners()
        }
        var t = r.prototype;
        return t.next = function() {
            this._isSliding || this._slide(M)
        }
        ,
        t.nextWhenVisible = function() {
            !document.hidden && p(this._element).is(":visible") && "hidden" !== p(this._element).css("visibility") && this.next()
        }
        ,
        t.prev = function() {
            this._isSliding || this._slide(W)
        }
        ,
        t.pause = function(t) {
            t || (this._isPaused = !0),
            this._element.querySelector(".carousel-item-next, .carousel-item-prev") && (m.triggerTransitionEnd(this._element),
            this.cycle(!0)),
            clearInterval(this._interval),
            this._interval = null
        }
        ,
        t.cycle = function(t) {
            t || (this._isPaused = !1),
            this._interval && (clearInterval(this._interval),
            this._interval = null),
            this._config.interval && !this._isPaused && (this._interval = setInterval((document.visibilityState ? this.nextWhenVisible : this.next).bind(this), this._config.interval))
        }
        ,
        t.to = function(t) {
            var e = this;
            this._activeElement = this._element.querySelector(Z);
            var n = this._getItemIndex(this._activeElement);
            if (!(t > this._items.length - 1 || t < 0))
                if (this._isSliding)
                    p(this._element).one(q.SLID, function() {
                        return e.to(t)
                    });
                else {
                    if (n === t)
                        return this.pause(),
                        void this.cycle();
                    var i = n < t ? M : W;
                    this._slide(i, this._items[t])
                }
        }
        ,
        t.dispose = function() {
            p(this._element).off(P),
            p.removeData(this._element, x),
            this._items = null,
            this._config = null,
            this._element = null,
            this._interval = null,
            this._isPaused = null,
            this._isSliding = null,
            this._activeElement = null,
            this._indicatorsElement = null
        }
        ,
        t._getConfig = function(t) {
            return t = l({}, R, t),
            m.typeCheckConfig(L, t, F),
            t
        }
        ,
        t._handleSwipe = function() {
            var t = Math.abs(this.touchDeltaX);
            if (!(t <= 40)) {
                var e = t / this.touchDeltaX;
                0 < e && this.prev(),
                e < 0 && this.next()
            }
        }
        ,
        t._addEventListeners = function() {
            var e = this;
            this._config.keyboard && p(this._element).on(q.KEYDOWN, function(t) {
                return e._keydown(t)
            }),
            "hover" === this._config.pause && p(this._element).on(q.MOUSEENTER, function(t) {
                return e.pause(t)
            }).on(q.MOUSELEAVE, function(t) {
                return e.cycle(t)
            }),
            this._config.touch && this._addTouchEventListeners()
        }
        ,
        t._addTouchEventListeners = function() {
            var n = this;
            if (this._touchSupported) {
                var e = function(t) {
                    n._pointerEvent && st[t.originalEvent.pointerType.toUpperCase()] ? n.touchStartX = t.originalEvent.clientX : n._pointerEvent || (n.touchStartX = t.originalEvent.touches[0].clientX)
                }
                  , i = function(t) {
                    n._pointerEvent && st[t.originalEvent.pointerType.toUpperCase()] && (n.touchDeltaX = t.originalEvent.clientX - n.touchStartX),
                    n._handleSwipe(),
                    "hover" === n._config.pause && (n.pause(),
                    n.touchTimeout && clearTimeout(n.touchTimeout),
                    n.touchTimeout = setTimeout(function(t) {
                        return n.cycle(t)
                    }, 500 + n._config.interval))
                };
                p(this._element.querySelectorAll(".carousel-item img")).on(q.DRAG_START, function(t) {
                    return t.preventDefault()
                }),
                this._pointerEvent ? (p(this._element).on(q.POINTERDOWN, function(t) {
                    return e(t)
                }),
                p(this._element).on(q.POINTERUP, function(t) {
                    return i(t)
                }),
                this._element.classList.add("pointer-event")) : (p(this._element).on(q.TOUCHSTART, function(t) {
                    return e(t)
                }),
                p(this._element).on(q.TOUCHMOVE, function(t) {
                    var e;
                    (e = t).originalEvent.touches && 1 < e.originalEvent.touches.length ? n.touchDeltaX = 0 : n.touchDeltaX = e.originalEvent.touches[0].clientX - n.touchStartX
                }),
                p(this._element).on(q.TOUCHEND, function(t) {
                    return i(t)
                }))
            }
        }
        ,
        t._keydown = function(t) {
            if (!/input|textarea/i.test(t.target.tagName))
                switch (t.which) {
                case 37:
                    t.preventDefault(),
                    this.prev();
                    break;
                case 39:
                    t.preventDefault(),
                    this.next()
                }
        }
        ,
        t._getItemIndex = function(t) {
            return this._items = t && t.parentNode ? [].slice.call(t.parentNode.querySelectorAll(".carousel-item")) : [],
            this._items.indexOf(t)
        }
        ,
        t._getItemByDirection = function(t, e) {
            var n = t === M
              , i = t === W
              , o = this._getItemIndex(e)
              , r = this._items.length - 1;
            if ((i && 0 === o || n && o === r) && !this._config.wrap)
                return e;
            var s = (o + (t === W ? -1 : 1)) % this._items.length;
            return -1 === s ? this._items[this._items.length - 1] : this._items[s]
        }
        ,
        t._triggerSlideEvent = function(t, e) {
            var n = this._getItemIndex(t)
              , i = this._getItemIndex(this._element.querySelector(Z))
              , o = p.Event(q.SLIDE, {
                relatedTarget: t,
                direction: e,
                from: i,
                to: n
            });
            return p(this._element).trigger(o),
            o
        }
        ,
        t._setActiveIndicatorElement = function(t) {
            if (this._indicatorsElement) {
                var e = [].slice.call(this._indicatorsElement.querySelectorAll(".active"));
                p(e).removeClass(Q);
                var n = this._indicatorsElement.children[this._getItemIndex(t)];
                n && p(n).addClass(Q)
            }
        }
        ,
        t._slide = function(t, e) {
            var n, i, o, r = this, s = this._element.querySelector(Z), a = this._getItemIndex(s), l = e || s && this._getItemByDirection(t, s), c = this._getItemIndex(l), h = Boolean(this._interval);
            if (o = t === M ? (n = "carousel-item-left",
            i = "carousel-item-next",
            "left") : (n = "carousel-item-right",
            i = "carousel-item-prev",
            "right"),
            l && p(l).hasClass(Q))
                this._isSliding = !1;
            else if (!this._triggerSlideEvent(l, o).isDefaultPrevented() && s && l) {
                this._isSliding = !0,
                h && this.pause(),
                this._setActiveIndicatorElement(l);
                var u = p.Event(q.SLID, {
                    relatedTarget: l,
                    direction: o,
                    from: a,
                    to: c
                });
                if (p(this._element).hasClass("slide")) {
                    p(l).addClass(i),
                    m.reflow(l),
                    p(s).addClass(n),
                    p(l).addClass(n);
                    var f = parseInt(l.getAttribute("data-interval"), 10);
                    this._config.interval = f ? (this._config.defaultInterval = this._config.defaultInterval || this._config.interval,
                    f) : this._config.defaultInterval || this._config.interval;
                    var d = m.getTransitionDurationFromElement(s);
                    p(s).one(m.TRANSITION_END, function() {
                        p(l).removeClass(n + " " + i).addClass(Q),
                        p(s).removeClass(Q + " " + i + " " + n),
                        r._isSliding = !1,
                        setTimeout(function() {
                            return p(r._element).trigger(u)
                        }, 0)
                    }).emulateTransitionEnd(d)
                } else
                    p(s).removeClass(Q),
                    p(l).addClass(Q),
                    this._isSliding = !1,
                    p(this._element).trigger(u);
                h && this.cycle()
            }
        }
        ,
        r._jQueryInterface = function(i) {
            return this.each(function() {
                var t = p(this).data(x)
                  , e = l({}, R, p(this).data());
                "object" == typeof i && (e = l({}, e, i));
                var n = "string" == typeof i ? i : e.slide;
                if (t || (t = new r(this,e),
                p(this).data(x, t)),
                "number" == typeof i)
                    t.to(i);
                else if ("string" == typeof n) {
                    if (void 0 === t[n])
                        throw new TypeError('No method named "' + n + '"');
                    t[n]()
                } else
                    e.interval && e.ride && (t.pause(),
                    t.cycle())
            })
        }
        ,
        r._dataApiClickHandler = function(t) {
            var e = m.getSelectorFromElement(this);
            if (e) {
                var n = p(e)[0];
                if (n && p(n).hasClass("carousel")) {
                    var i = l({}, p(n).data(), p(this).data())
                      , o = this.getAttribute("data-slide-to");
                    o && (i.interval = !1),
                    r._jQueryInterface.call(p(n), i),
                    o && p(n).data(x).to(o),
                    t.preventDefault()
                }
            }
        }
        ,
        s(r, null, [{
            key: "VERSION",
            get: function() {
                return "4.3.1"
            }
        }, {
            key: "Default",
            get: function() {
                return R
            }
        }]),
        r
    }();
    p(document).on(q.CLICK_DATA_API, "[data-slide], [data-slide-to]", at._dataApiClickHandler),
    p(window).on(q.LOAD_DATA_API, function() {
        for (var t = [].slice.call(document.querySelectorAll('[data-ride="carousel"]')), e = 0, n = t.length; e < n; e++) {
            var i = p(t[e]);
            at._jQueryInterface.call(i, i.data())
        }
    }),
    p.fn[L] = at._jQueryInterface,
    p.fn[L].Constructor = at,
    p.fn[L].noConflict = function() {
        return p.fn[L] = j,
        at._jQueryInterface
    }
    ;
    var lt = "collapse"
      , ct = "bs.collapse"
      , ht = "." + ct
      , ut = p.fn[lt]
      , ft = {
        toggle: !0,
        parent: ""
    }
      , dt = {
        toggle: "boolean",
        parent: "(string|element)"
    }
      , pt = {
        SHOW: "show" + ht,
        SHOWN: "shown" + ht,
        HIDE: "hide" + ht,
        HIDDEN: "hidden" + ht,
        CLICK_DATA_API: "click" + ht + ".data-api"
    }
      , mt = "show"
      , gt = "collapse"
      , _t = "collapsing"
      , vt = "collapsed"
      , wt = '[data-toggle="collapse"]'
      , Ct = function() {
        function a(e, t) {
            this._isTransitioning = !1,
            this._element = e,
            this._config = this._getConfig(t),
            this._triggerArray = [].slice.call(document.querySelectorAll('[data-toggle="collapse"][href="#' + e.id + '"],[data-toggle="collapse"][data-target="#' + e.id + '"]'));
            for (var n = [].slice.call(document.querySelectorAll(wt)), i = 0, o = n.length; i < o; i++) {
                var r = n[i]
                  , s = m.getSelectorFromElement(r)
                  , a = [].slice.call(document.querySelectorAll(s)).filter(function(t) {
                    return t === e
                });
                null !== s && 0 < a.length && (this._selector = s,
                this._triggerArray.push(r))
            }
            this._parent = this._config.parent ? this._getParent() : null,
            this._config.parent || this._addAriaAndCollapsedClass(this._element, this._triggerArray),
            this._config.toggle && this.toggle()
        }
        var t = a.prototype;
        return t.toggle = function() {
            p(this._element).hasClass(mt) ? this.hide() : this.show()
        }
        ,
        t.show = function() {
            var t, e, n = this;
            if (!(this._isTransitioning || p(this._element).hasClass(mt) || (this._parent && 0 === (t = [].slice.call(this._parent.querySelectorAll(".show, .collapsing")).filter(function(t) {
                return "string" == typeof n._config.parent ? t.getAttribute("data-parent") === n._config.parent : t.classList.contains(gt)
            })).length && (t = null),
            t && (e = p(t).not(this._selector).data(ct)) && e._isTransitioning))) {
                var i = p.Event(pt.SHOW);
                if (p(this._element).trigger(i),
                !i.isDefaultPrevented()) {
                    t && (a._jQueryInterface.call(p(t).not(this._selector), "hide"),
                    e || p(t).data(ct, null));
                    var o = this._getDimension();
                    p(this._element).removeClass(gt).addClass(_t),
                    this._element.style[o] = 0,
                    this._triggerArray.length && p(this._triggerArray).removeClass(vt).attr("aria-expanded", !0),
                    this.setTransitioning(!0);
                    var r = "scroll" + (o[0].toUpperCase() + o.slice(1))
                      , s = m.getTransitionDurationFromElement(this._element);
                    p(this._element).one(m.TRANSITION_END, function() {
                        p(n._element).removeClass(_t).addClass(gt).addClass(mt),
                        n._element.style[o] = "",
                        n.setTransitioning(!1),
                        p(n._element).trigger(pt.SHOWN)
                    }).emulateTransitionEnd(s),
                    this._element.style[o] = this._element[r] + "px"
                }
            }
        }
        ,
        t.hide = function() {
            var t = this;
            if (!this._isTransitioning && p(this._element).hasClass(mt)) {
                var e = p.Event(pt.HIDE);
                if (p(this._element).trigger(e),
                !e.isDefaultPrevented()) {
                    var n = this._getDimension();
                    this._element.style[n] = this._element.getBoundingClientRect()[n] + "px",
                    m.reflow(this._element),
                    p(this._element).addClass(_t).removeClass(gt).removeClass(mt);
                    var i = this._triggerArray.length;
                    if (0 < i)
                        for (var o = 0; o < i; o++) {
                            var r = this._triggerArray[o]
                              , s = m.getSelectorFromElement(r);
                            null !== s && (p([].slice.call(document.querySelectorAll(s))).hasClass(mt) || p(r).addClass(vt).attr("aria-expanded", !1))
                        }
                    this.setTransitioning(!0),
                    this._element.style[n] = "";
                    var a = m.getTransitionDurationFromElement(this._element);
                    p(this._element).one(m.TRANSITION_END, function() {
                        t.setTransitioning(!1),
                        p(t._element).removeClass(_t).addClass(gt).trigger(pt.HIDDEN)
                    }).emulateTransitionEnd(a)
                }
            }
        }
        ,
        t.setTransitioning = function(t) {
            this._isTransitioning = t
        }
        ,
        t.dispose = function() {
            p.removeData(this._element, ct),
            this._config = null,
            this._parent = null,
            this._element = null,
            this._triggerArray = null,
            this._isTransitioning = null
        }
        ,
        t._getConfig = function(t) {
            return (t = l({}, ft, t)).toggle = Boolean(t.toggle),
            m.typeCheckConfig(lt, t, dt),
            t
        }
        ,
        t._getDimension = function() {
            return p(this._element).hasClass("width") ? "width" : "height"
        }
        ,
        t._getParent = function() {
            var t, n = this;
            m.isElement(this._config.parent) ? (t = this._config.parent,
            void 0 !== this._config.parent.jquery && (t = this._config.parent[0])) : t = document.querySelector(this._config.parent);
            var e = '[data-toggle="collapse"][data-parent="' + this._config.parent + '"]'
              , i = [].slice.call(t.querySelectorAll(e));
            return p(i).each(function(t, e) {
                n._addAriaAndCollapsedClass(a._getTargetFromElement(e), [e])
            }),
            t
        }
        ,
        t._addAriaAndCollapsedClass = function(t, e) {
            var n = p(t).hasClass(mt);
            e.length && p(e).toggleClass(vt, !n).attr("aria-expanded", n)
        }
        ,
        a._getTargetFromElement = function(t) {
            var e = m.getSelectorFromElement(t);
            return e ? document.querySelector(e) : null
        }
        ,
        a._jQueryInterface = function(i) {
            return this.each(function() {
                var t = p(this)
                  , e = t.data(ct)
                  , n = l({}, ft, t.data(), "object" == typeof i && i ? i : {});
                if (!e && n.toggle && /show|hide/.test(i) && (n.toggle = !1),
                e || (e = new a(this,n),
                t.data(ct, e)),
                "string" == typeof i) {
                    if (void 0 === e[i])
                        throw new TypeError('No method named "' + i + '"');
                    e[i]()
                }
            })
        }
        ,
        s(a, null, [{
            key: "VERSION",
            get: function() {
                return "4.3.1"
            }
        }, {
            key: "Default",
            get: function() {
                return ft
            }
        }]),
        a
    }();
    p(document).on(pt.CLICK_DATA_API, wt, function(t) {
        "A" === t.currentTarget.tagName && t.preventDefault();
        var n = p(this)
          , e = m.getSelectorFromElement(this)
          , i = [].slice.call(document.querySelectorAll(e));
        p(i).each(function() {
            var t = p(this)
              , e = t.data(ct) ? "toggle" : n.data();
            Ct._jQueryInterface.call(t, e)
        })
    }),
    p.fn[lt] = Ct._jQueryInterface,
    p.fn[lt].Constructor = Ct,
    p.fn[lt].noConflict = function() {
        return p.fn[lt] = ut,
        Ct._jQueryInterface
    }
    ;
    for (var Tt = "undefined" != typeof window && "undefined" != typeof document, St = ["Edge", "Trident", "Firefox"], Dt = 0, It = 0; It < St.length; It += 1)
        if (Tt && 0 <= navigator.userAgent.indexOf(St[It])) {
            Dt = 1;
            break
        }
    var At = Tt && window.Promise ? function(t) {
        var e = !1;
        return function() {
            e || (e = !0,
            window.Promise.resolve().then(function() {
                e = !1,
                t()
            }))
        }
    }
    : function(t) {
        var e = !1;
        return function() {
            e || (e = !0,
            setTimeout(function() {
                e = !1,
                t()
            }, Dt))
        }
    }
      , xt = Tt && !(!window.MSInputMethodContext || !document.documentMode)
      , Pt = Tt && /MSIE 10/.test(navigator.userAgent)
      , qt = function() {
        function i(t, e) {
            for (var n = 0; n < e.length; n++) {
                var i = e[n];
                i.enumerable = i.enumerable || !1,
                i.configurable = !0,
                "value"in i && (i.writable = !0),
                Object.defineProperty(t, i.key, i)
            }
        }
        return function(t, e, n) {
            return e && i(t.prototype, e),
            n && i(t, n),
            t
        }
    }()
      , Kt = function(t, e, n) {
        return e in t ? Object.defineProperty(t, e, {
            value: n,
            enumerable: !0,
            configurable: !0,
            writable: !0
        }) : t[e] = n,
        t
    }
      , Qt = Object.assign || function(t) {
        for (var e = 1; e < arguments.length; e++) {
            var n = arguments[e];
            for (var i in n)
                Object.prototype.hasOwnProperty.call(n, i) && (t[i] = n[i])
        }
        return t
    }
      , ue = Tt && /Firefox/i.test(navigator.userAgent)
      , de = ["auto-start", "auto", "auto-end", "top-start", "top", "top-end", "right-start", "right", "right-end", "bottom-end", "bottom", "bottom-start", "left-end", "left", "left-start"]
      , pe = de.slice(3)
      , Ee = {
        placement: "bottom",
        positionFixed: !1,
        eventsEnabled: !0,
        removeOnDestroy: !1,
        onCreate: function() {},
        onUpdate: function() {},
        modifiers: {
            shift: {
                order: 100,
                enabled: !0,
                fn: function(t) {
                    var e = t.placement
                      , n = e.split("-")[0]
                      , i = e.split("-")[1];
                    if (i) {
                        var o = t.offsets
                          , r = o.reference
                          , s = o.popper
                          , a = -1 !== ["bottom", "top"].indexOf(n)
                          , l = a ? "left" : "top"
                          , c = a ? "width" : "height"
                          , h = {
                            start: Kt({}, l, r[l]),
                            end: Kt({}, l, r[l] + r[c] - s[c])
                        };
                        t.offsets.popper = Qt({}, s, h[i])
                    }
                    return t
                }
            },
            offset: {
                order: 200,
                enabled: !0,
                fn: function(t, e) {
                    var n = e.offset
                      , i = t.placement
                      , o = t.offsets
                      , r = o.popper
                      , s = o.reference
                      , a = i.split("-")[0]
                      , l = void 0;
                    return l = ce(+n) ? [+n, 0] : ye(n, r, s, a),
                    "left" === a ? (r.top += l[0],
                    r.left -= l[1]) : "right" === a ? (r.top += l[0],
                    r.left += l[1]) : "top" === a ? (r.left += l[0],
                    r.top -= l[1]) : "bottom" === a && (r.left += l[0],
                    r.top += l[1]),
                    t.popper = r,
                    t
                },
                offset: 0
            },
            preventOverflow: {
                order: 300,
                enabled: !0,
                fn: function(t, i) {
                    var e = i.boundariesElement || jt(t.instance.popper);
                    t.instance.reference === e && (e = jt(e));
                    var n = re("transform")
                      , o = t.instance.popper.style
                      , r = o.top
                      , s = o.left
                      , a = o[n];
                    o.top = "",
                    o.left = "",
                    o[n] = "";
                    var l = Gt(t.instance.popper, t.instance.reference, i.padding, e, t.positionFixed);
                    o.top = r,
                    o.left = s,
                    o[n] = a,
                    i.boundaries = l;
                    var c = i.priority
                      , h = t.offsets.popper
                      , u = {
                        primary: function(t) {
                            var e = h[t];
                            return h[t] < l[t] && !i.escapeWithReference && (e = Math.max(h[t], l[t])),
                            Kt({}, t, e)
                        },
                        secondary: function(t) {
                            var e = "right" === t ? "left" : "top"
                              , n = h[e];
                            return h[t] > l[t] && !i.escapeWithReference && (n = Math.min(h[e], l[t] - ("right" === t ? h.width : h.height))),
                            Kt({}, e, n)
                        }
                    };
                    return c.forEach(function(t) {
                        var e = -1 !== ["left", "top"].indexOf(t) ? "primary" : "secondary";
                        h = Qt({}, h, u[e](t))
                    }),
                    t.offsets.popper = h,
                    t
                },
                priority: ["left", "right", "top", "bottom"],
                padding: 5,
                boundariesElement: "scrollParent"
            },
            keepTogether: {
                order: 400,
                enabled: !0,
                fn: function(t) {
                    var e = t.offsets
                      , n = e.popper
                      , i = e.reference
                      , o = t.placement.split("-")[0]
                      , r = Math.floor
                      , s = -1 !== ["top", "bottom"].indexOf(o)
                      , a = s ? "right" : "bottom"
                      , l = s ? "left" : "top"
                      , c = s ? "width" : "height";
                    return n[a] < r(i[l]) && (t.offsets.popper[l] = r(i[l]) - n[c]),
                    n[l] > r(i[a]) && (t.offsets.popper[l] = r(i[a])),
                    t
                }
            },
            arrow: {
                order: 500,
                enabled: !0,
                fn: function(t, e) {
                    var n;
                    if (!fe(t.instance.modifiers, "arrow", "keepTogether"))
                        return t;
                    var i = e.element;
                    if ("string" == typeof i) {
                        if (!(i = t.instance.popper.querySelector(i)))
                            return t
                    } else if (!t.instance.popper.contains(i))
                        return console.warn("WARNING: `arrow.element` must be child of its popper element!"),
                        t;
                    var o = t.placement.split("-")[0]
                      , r = t.offsets
                      , s = r.popper
                      , a = r.reference
                      , l = -1 !== ["left", "right"].indexOf(o)
                      , c = l ? "height" : "width"
                      , h = l ? "Top" : "Left"
                      , u = h.toLowerCase()
                      , f = l ? "left" : "top"
                      , d = l ? "bottom" : "right"
                      , p = Zt(i)[c];
                    a[d] - p < s[u] && (t.offsets.popper[u] -= s[u] - (a[d] - p)),
                    a[u] + p > s[d] && (t.offsets.popper[u] += a[u] + p - s[d]),
                    t.offsets.popper = Vt(t.offsets.popper);
                    var m = a[u] + a[c] / 2 - p / 2
                      , g = Nt(t.instance.popper)
                      , _ = parseFloat(g["margin" + h], 10)
                      , v = parseFloat(g["border" + h + "Width"], 10)
                      , y = m - t.offsets.popper[u] - _ - v;
                    return y = Math.max(Math.min(s[c] - p, y), 0),
                    t.arrowElement = i,
                    t.offsets.arrow = (Kt(n = {}, u, Math.round(y)),
                    Kt(n, f, ""),
                    n),
                    t
                },
                element: "[x-arrow]"
            },
            flip: {
                order: 600,
                enabled: !0,
                fn: function(p, m) {
                    if (oe(p.instance.modifiers, "inner"))
                        return p;
                    if (p.flipped && p.placement === p.originalPlacement)
                        return p;
                    var g = Gt(p.instance.popper, p.instance.reference, m.padding, m.boundariesElement, p.positionFixed)
                      , _ = p.placement.split("-")[0]
                      , v = te(_)
                      , y = p.placement.split("-")[1] || ""
                      , E = [];
                    switch (m.behavior) {
                    case "flip":
                        E = [_, v];
                        break;
                    case "clockwise":
                        E = me(_);
                        break;
                    case "counterclockwise":
                        E = me(_, !0);
                        break;
                    default:
                        E = m.behavior
                    }
                    return E.forEach(function(t, e) {
                        if (_ !== t || E.length === e + 1)
                            return p;
                        _ = p.placement.split("-")[0],
                        v = te(_);
                        var n, i = p.offsets.popper, o = p.offsets.reference, r = Math.floor, s = "left" === _ && r(i.right) > r(o.left) || "right" === _ && r(i.left) < r(o.right) || "top" === _ && r(i.bottom) > r(o.top) || "bottom" === _ && r(i.top) < r(o.bottom), a = r(i.left) < r(g.left), l = r(i.right) > r(g.right), c = r(i.top) < r(g.top), h = r(i.bottom) > r(g.bottom), u = "left" === _ && a || "right" === _ && l || "top" === _ && c || "bottom" === _ && h, f = -1 !== ["top", "bottom"].indexOf(_), d = !!m.flipVariations && (f && "start" === y && a || f && "end" === y && l || !f && "start" === y && c || !f && "end" === y && h);
                        (s || u || d) && (p.flipped = !0,
                        (s || u) && (_ = E[e + 1]),
                        d && (y = "end" === (n = y) ? "start" : "start" === n ? "end" : n),
                        p.placement = _ + (y ? "-" + y : ""),
                        p.offsets.popper = Qt({}, p.offsets.popper, ee(p.instance.popper, p.offsets.reference, p.placement)),
                        p = ie(p.instance.modifiers, p, "flip"))
                    }),
                    p
                },
                behavior: "flip",
                padding: 5,
                boundariesElement: "viewport"
            },
            inner: {
                order: 700,
                enabled: !1,
                fn: function(t) {
                    var e = t.placement
                      , n = e.split("-")[0]
                      , i = t.offsets
                      , o = i.popper
                      , r = i.reference
                      , s = -1 !== ["left", "right"].indexOf(n)
                      , a = -1 === ["top", "left"].indexOf(n);
                    return o[s ? "left" : "top"] = r[n] - (a ? o[s ? "width" : "height"] : 0),
                    t.placement = te(e),
                    t.offsets.popper = Vt(o),
                    t
                }
            },
            hide: {
                order: 800,
                enabled: !0,
                fn: function(t) {
                    if (!fe(t.instance.modifiers, "hide", "preventOverflow"))
                        return t;
                    var e = t.offsets.reference
                      , n = ne(t.instance.modifiers, function(t) {
                        return "preventOverflow" === t.name
                    }).boundaries;
                    if (e.bottom < n.top || e.left > n.right || e.top > n.bottom || e.right < n.left) {
                        if (!0 === t.hide)
                            return t;
                        t.hide = !0,
                        t.attributes["x-out-of-boundaries"] = ""
                    } else {
                        if (!1 === t.hide)
                            return t;
                        t.hide = !1,
                        t.attributes["x-out-of-boundaries"] = !1
                    }
                    return t
                }
            },
            computeStyle: {
                order: 850,
                enabled: !0,
                fn: function(t, e) {
                    var n = e.x
                      , i = e.y
                      , o = t.offsets.popper
                      , r = ne(t.instance.modifiers, function(t) {
                        return "applyStyle" === t.name
                    }).gpuAcceleration;
                    void 0 !== r && console.warn("WARNING: `gpuAcceleration` option moved to `computeStyle` modifier and will not be supported in future versions of Popper.js!");
                    var s, a, l, c, h, u, f, d, p, m, g, _, v, y, E = void 0 !== r ? r : e.gpuAcceleration, b = jt(t.instance.popper), w = Yt(b), C = {
                        position: o.position
                    }, T = (s = t,
                    a = window.devicePixelRatio < 2 || !ue,
                    l = s.offsets,
                    c = l.popper,
                    h = l.reference,
                    u = Math.round,
                    f = Math.floor,
                    d = function(t) {
                        return t
                    }
                    ,
                    p = u(h.width),
                    m = u(c.width),
                    g = -1 !== ["left", "right"].indexOf(s.placement),
                    _ = -1 !== s.placement.indexOf("-"),
                    y = a ? u : d,
                    {
                        left: (v = a ? g || _ || p % 2 == m % 2 ? u : f : d)(p % 2 == 1 && m % 2 == 1 && !_ && a ? c.left - 1 : c.left),
                        top: y(c.top),
                        bottom: y(c.bottom),
                        right: v(c.right)
                    }), S = "bottom" === n ? "top" : "bottom", D = "right" === i ? "left" : "right", I = re("transform"), A = void 0, O = void 0;
                    if (O = "bottom" === S ? "HTML" === b.nodeName ? -b.clientHeight + T.bottom : -w.height + T.bottom : T.top,
                    A = "right" === D ? "HTML" === b.nodeName ? -b.clientWidth + T.right : -w.width + T.right : T.left,
                    E && I)
                        C[I] = "translate3d(" + A + "px, " + O + "px, 0)",
                        C[S] = 0,
                        C[D] = 0,
                        C.willChange = "transform";
                    else {
                        var N = "bottom" === S ? -1 : 1
                          , k = "right" === D ? -1 : 1;
                        C[S] = O * N,
                        C[D] = A * k,
                        C.willChange = S + ", " + D
                    }
                    var L = {
                        "x-placement": t.placement
                    };
                    return t.attributes = Qt({}, L, t.attributes),
                    t.styles = Qt({}, C, t.styles),
                    t.arrowStyles = Qt({}, t.offsets.arrow, t.arrowStyles),
                    t
                },
                gpuAcceleration: !0,
                x: "bottom",
                y: "right"
            },
            applyStyle: {
                order: 900,
                enabled: !0,
                fn: function(t) {
                    var e, n;
                    return he(t.instance.popper, t.styles),
                    e = t.instance.popper,
                    n = t.attributes,
                    Object.keys(n).forEach(function(t) {
                        !1 !== n[t] ? e.setAttribute(t, n[t]) : e.removeAttribute(t)
                    }),
                    t.arrowElement && Object.keys(t.arrowStyles).length && he(t.arrowElement, t.arrowStyles),
                    t
                },
                onLoad: function(t, e, n, i, o) {
                    var r = Jt(o, e, t, n.positionFixed)
                      , s = $t(n.placement, r, e, t, n.modifiers.flip.boundariesElement, n.modifiers.flip.padding);
                    return e.setAttribute("x-placement", s),
                    he(e, {
                        position: n.positionFixed ? "fixed" : "absolute"
                    }),
                    n
                },
                gpuAcceleration: void 0
            }
        }
    }
      , be = function() {
        function r(t, e) {
            var n = this
              , i = 2 < arguments.length && void 0 !== arguments[2] ? arguments[2] : {};
            !function(t, e) {
                if (!(t instanceof e))
                    throw new TypeError("Cannot call a class as a function")
            }(this, r),
            this.scheduleUpdate = function() {
                return requestAnimationFrame(n.update)
            }
            ,
            this.update = At(this.update.bind(this)),
            this.options = Qt({}, r.Defaults, i),
            this.state = {
                isDestroyed: !1,
                isCreated: !1,
                scrollParents: []
            },
            this.reference = t && t.jquery ? t[0] : t,
            this.popper = e && e.jquery ? e[0] : e,
            this.options.modifiers = {},
            Object.keys(Qt({}, r.Defaults.modifiers, i.modifiers)).forEach(function(t) {
                n.options.modifiers[t] = Qt({}, r.Defaults.modifiers[t] || {}, i.modifiers ? i.modifiers[t] : {})
            }),
            this.modifiers = Object.keys(this.options.modifiers).map(function(t) {
                return Qt({
                    name: t
                }, n.options.modifiers[t])
            }).sort(function(t, e) {
                return t.order - e.order
            }),
            this.modifiers.forEach(function(t) {
                t.enabled && Ot(t.onLoad) && t.onLoad(n.reference, n.popper, n.options, t, n.state)
            }),
            this.update();
            var o = this.options.eventsEnabled;
            o && this.enableEventListeners(),
            this.state.eventsEnabled = o
        }
        return qt(r, [{
            key: "update",
            value: function() {
                return function() {
                    if (!this.state.isDestroyed) {
                        var t = {
                            instance: this,
                            styles: {},
                            arrowStyles: {},
                            attributes: {},
                            flipped: !1,
                            offsets: {}
                        };
                        t.offsets.reference = Jt(this.state, this.popper, this.reference, this.options.positionFixed),
                        t.placement = $t(this.options.placement, t.offsets.reference, this.popper, this.reference, this.options.modifiers.flip.boundariesElement, this.options.modifiers.flip.padding),
                        t.originalPlacement = t.placement,
                        t.positionFixed = this.options.positionFixed,
                        t.offsets.popper = ee(this.popper, t.offsets.reference, t.placement),
                        t.offsets.popper.position = this.options.positionFixed ? "fixed" : "absolute",
                        t = ie(this.modifiers, t),
                        this.state.isCreated ? this.options.onUpdate(t) : (this.state.isCreated = !0,
                        this.options.onCreate(t))
                    }
                }
                .call(this)
            }
        }, {
            key: "destroy",
            value: function() {
                return function() {
                    return this.state.isDestroyed = !0,
                    oe(this.modifiers, "applyStyle") && (this.popper.removeAttribute("x-placement"),
                    this.popper.style.position = "",
                    this.popper.style.top = "",
                    this.popper.style.left = "",
                    this.popper.style.right = "",
                    this.popper.style.bottom = "",
                    this.popper.style.willChange = "",
                    this.popper.style[re("transform")] = ""),
                    this.disableEventListeners(),
                    this.options.removeOnDestroy && this.popper.parentNode.removeChild(this.popper),
                    this
                }
                .call(this)
            }
        }, {
            key: "enableEventListeners",
            value: function() {
                return function() {
                    this.state.eventsEnabled || (this.state = ae(this.reference, this.options, this.state, this.scheduleUpdate))
                }
                .call(this)
            }
        }, {
            key: "disableEventListeners",
            value: function() {
                return le.call(this)
            }
        }]),
        r
    }();
    be.Utils = ("undefined" != typeof window ? window : global).PopperUtils,
    be.placements = de,
    be.Defaults = Ee;
    var we = "dropdown"
      , Ce = "bs.dropdown"
      , Te = "." + Ce
      , Se = ".data-api"
      , De = p.fn[we]
      , Ie = new RegExp("38|40|27")
      , Ae = {
        HIDE: "hide" + Te,
        HIDDEN: "hidden" + Te,
        SHOW: "show" + Te,
        SHOWN: "shown" + Te,
        CLICK: "click" + Te,
        CLICK_DATA_API: "click" + Te + Se,
        KEYDOWN_DATA_API: "keydown" + Te + Se,
        KEYUP_DATA_API: "keyup" + Te + Se
    }
      , Oe = "disabled"
      , Ne = "show"
      , Pe = "dropdown-menu-right"
      , je = '[data-toggle="dropdown"]'
      , Fe = ".dropdown-menu"
      , Ye = {
        offset: 0,
        flip: !0,
        boundary: "scrollParent",
        reference: "toggle",
        display: "dynamic"
    }
      , ze = {
        offset: "(number|string|function)",
        flip: "boolean",
        boundary: "(string|element)",
        reference: "(string|element)",
        display: "string"
    }
      , Xe = function() {
        function c(t, e) {
            this._element = t,
            this._popper = null,
            this._config = this._getConfig(e),
            this._menu = this._getMenuElement(),
            this._inNavbar = this._detectNavbar(),
            this._addEventListeners()
        }
        var t = c.prototype;
        return t.toggle = function() {
            if (!this._element.disabled && !p(this._element).hasClass(Oe)) {
                var t = c._getParentFromElement(this._element)
                  , e = p(this._menu).hasClass(Ne);
                if (c._clearMenus(),
                !e) {
                    var n = {
                        relatedTarget: this._element
                    }
                      , i = p.Event(Ae.SHOW, n);
                    if (p(t).trigger(i),
                    !i.isDefaultPrevented()) {
                        if (!this._inNavbar) {
                            if (void 0 === be)
                                throw new TypeError("Bootstrap's dropdowns require Popper.js (https://popper.js.org/)");
                            var o = this._element;
                            "parent" === this._config.reference ? o = t : m.isElement(this._config.reference) && (o = this._config.reference,
                            void 0 !== this._config.reference.jquery && (o = this._config.reference[0])),
                            "scrollParent" !== this._config.boundary && p(t).addClass("position-static"),
                            this._popper = new be(o,this._menu,this._getPopperConfig())
                        }
                        "ontouchstart"in document.documentElement && 0 === p(t).closest(".navbar-nav").length && p(document.body).children().on("mouseover", null, p.noop),
                        this._element.focus(),
                        this._element.setAttribute("aria-expanded", !0),
                        p(this._menu).toggleClass(Ne),
                        p(t).toggleClass(Ne).trigger(p.Event(Ae.SHOWN, n))
                    }
                }
            }
        }
        ,
        t.show = function() {
            if (!(this._element.disabled || p(this._element).hasClass(Oe) || p(this._menu).hasClass(Ne))) {
                var t = {
                    relatedTarget: this._element
                }
                  , e = p.Event(Ae.SHOW, t)
                  , n = c._getParentFromElement(this._element);
                p(n).trigger(e),
                e.isDefaultPrevented() || (p(this._menu).toggleClass(Ne),
                p(n).toggleClass(Ne).trigger(p.Event(Ae.SHOWN, t)))
            }
        }
        ,
        t.hide = function() {
            if (!this._element.disabled && !p(this._element).hasClass(Oe) && p(this._menu).hasClass(Ne)) {
                var t = {
                    relatedTarget: this._element
                }
                  , e = p.Event(Ae.HIDE, t)
                  , n = c._getParentFromElement(this._element);
                p(n).trigger(e),
                e.isDefaultPrevented() || (p(this._menu).toggleClass(Ne),
                p(n).toggleClass(Ne).trigger(p.Event(Ae.HIDDEN, t)))
            }
        }
        ,
        t.dispose = function() {
            p.removeData(this._element, Ce),
            p(this._element).off(Te),
            this._element = null,
            (this._menu = null) !== this._popper && (this._popper.destroy(),
            this._popper = null)
        }
        ,
        t.update = function() {
            this._inNavbar = this._detectNavbar(),
            null !== this._popper && this._popper.scheduleUpdate()
        }
        ,
        t._addEventListeners = function() {
            var e = this;
            p(this._element).on(Ae.CLICK, function(t) {
                t.preventDefault(),
                t.stopPropagation(),
                e.toggle()
            })
        }
        ,
        t._getConfig = function(t) {
            return t = l({}, this.constructor.Default, p(this._element).data(), t),
            m.typeCheckConfig(we, t, this.constructor.DefaultType),
            t
        }
        ,
        t._getMenuElement = function() {
            if (!this._menu) {
                var t = c._getParentFromElement(this._element);
                t && (this._menu = t.querySelector(Fe))
            }
            return this._menu
        }
        ,
        t._getPlacement = function() {
            var t = p(this._element.parentNode)
              , e = "bottom-start";
            return t.hasClass("dropup") ? (e = "top-start",
            p(this._menu).hasClass(Pe) && (e = "top-end")) : t.hasClass("dropright") ? e = "right-start" : t.hasClass("dropleft") ? e = "left-start" : p(this._menu).hasClass(Pe) && (e = "bottom-end"),
            e
        }
        ,
        t._detectNavbar = function() {
            return 0 < p(this._element).closest(".navbar").length
        }
        ,
        t._getOffset = function() {
            var e = this
              , t = {};
            return "function" == typeof this._config.offset ? t.fn = function(t) {
                return t.offsets = l({}, t.offsets, e._config.offset(t.offsets, e._element) || {}),
                t
            }
            : t.offset = this._config.offset,
            t
        }
        ,
        t._getPopperConfig = function() {
            var t = {
                placement: this._getPlacement(),
                modifiers: {
                    offset: this._getOffset(),
                    flip: {
                        enabled: this._config.flip
                    },
                    preventOverflow: {
                        boundariesElement: this._config.boundary
                    }
                }
            };
            return "static" === this._config.display && (t.modifiers.applyStyle = {
                enabled: !1
            }),
            t
        }
        ,
        c._jQueryInterface = function(e) {
            return this.each(function() {
                var t = p(this).data(Ce);
                if (t || (t = new c(this,"object" == typeof e ? e : null),
                p(this).data(Ce, t)),
                "string" == typeof e) {
                    if (void 0 === t[e])
                        throw new TypeError('No method named "' + e + '"');
                    t[e]()
                }
            })
        }
        ,
        c._clearMenus = function(t) {
            if (!t || 3 !== t.which && ("keyup" !== t.type || 9 === t.which))
                for (var e = [].slice.call(document.querySelectorAll(je)), n = 0, i = e.length; n < i; n++) {
                    var o = c._getParentFromElement(e[n])
                      , r = p(e[n]).data(Ce)
                      , s = {
                        relatedTarget: e[n]
                    };
                    if (t && "click" === t.type && (s.clickEvent = t),
                    r) {
                        var a = r._menu;
                        if (p(o).hasClass(Ne) && !(t && ("click" === t.type && /input|textarea/i.test(t.target.tagName) || "keyup" === t.type && 9 === t.which) && p.contains(o, t.target))) {
                            var l = p.Event(Ae.HIDE, s);
                            p(o).trigger(l),
                            l.isDefaultPrevented() || ("ontouchstart"in document.documentElement && p(document.body).children().off("mouseover", null, p.noop),
                            e[n].setAttribute("aria-expanded", "false"),
                            p(a).removeClass(Ne),
                            p(o).removeClass(Ne).trigger(p.Event(Ae.HIDDEN, s)))
                        }
                    }
                }
        }
        ,
        c._getParentFromElement = function(t) {
            var e, n = m.getSelectorFromElement(t);
            return n && (e = document.querySelector(n)),
            e || t.parentNode
        }
        ,
        c._dataApiKeydownHandler = function(t) {
            if ((/input|textarea/i.test(t.target.tagName) ? !(32 === t.which || 27 !== t.which && (40 !== t.which && 38 !== t.which || p(t.target).closest(Fe).length)) : Ie.test(t.which)) && (t.preventDefault(),
            t.stopPropagation(),
            !this.disabled && !p(this).hasClass(Oe))) {
                var e = c._getParentFromElement(this)
                  , n = p(e).hasClass(Ne);
                if (n && (!n || 27 !== t.which && 32 !== t.which)) {
                    var i = [].slice.call(e.querySelectorAll(".dropdown-menu .dropdown-item:not(.disabled):not(:disabled)"));
                    if (0 !== i.length) {
                        var o = i.indexOf(t.target);
                        38 === t.which && 0 < o && o--,
                        40 === t.which && o < i.length - 1 && o++,
                        o < 0 && (o = 0),
                        i[o].focus()
                    }
                } else {
                    if (27 === t.which) {
                        var r = e.querySelector(je);
                        p(r).trigger("focus")
                    }
                    p(this).trigger("click")
                }
            }
        }
        ,
        s(c, null, [{
            key: "VERSION",
            get: function() {
                return "4.3.1"
            }
        }, {
            key: "Default",
            get: function() {
                return Ye
            }
        }, {
            key: "DefaultType",
            get: function() {
                return ze
            }
        }]),
        c
    }();
    p(document).on(Ae.KEYDOWN_DATA_API, je, Xe._dataApiKeydownHandler).on(Ae.KEYDOWN_DATA_API, Fe, Xe._dataApiKeydownHandler).on(Ae.CLICK_DATA_API + " " + Ae.KEYUP_DATA_API, Xe._clearMenus).on(Ae.CLICK_DATA_API, je, function(t) {
        t.preventDefault(),
        t.stopPropagation(),
        Xe._jQueryInterface.call(p(this), "toggle")
    }).on(Ae.CLICK_DATA_API, ".dropdown form", function(t) {
        t.stopPropagation()
    }),
    p.fn[we] = Xe._jQueryInterface,
    p.fn[we].Constructor = Xe,
    p.fn[we].noConflict = function() {
        return p.fn[we] = De,
        Xe._jQueryInterface
    }
    ;
    var Ge = "modal"
      , $e = "bs.modal"
      , Je = "." + $e
      , Ze = p.fn[Ge]
      , tn = {
        backdrop: !0,
        keyboard: !0,
        focus: !0,
        show: !0
    }
      , en = {
        backdrop: "(boolean|string)",
        keyboard: "boolean",
        focus: "boolean",
        show: "boolean"
    }
      , nn = {
        HIDE: "hide" + Je,
        HIDDEN: "hidden" + Je,
        SHOW: "show" + Je,
        SHOWN: "shown" + Je,
        FOCUSIN: "focusin" + Je,
        RESIZE: "resize" + Je,
        CLICK_DISMISS: "click.dismiss" + Je,
        KEYDOWN_DISMISS: "keydown.dismiss" + Je,
        MOUSEUP_DISMISS: "mouseup.dismiss" + Je,
        MOUSEDOWN_DISMISS: "mousedown.dismiss" + Je,
        CLICK_DATA_API: "click" + Je + ".data-api"
    }
      , an = "modal-open"
      , ln = "fade"
      , cn = "show"
      , hn = ".modal-dialog"
      , pn = ".fixed-top, .fixed-bottom, .is-fixed, .sticky-top"
      , mn = ".sticky-top"
      , gn = function() {
        function o(t, e) {
            this._config = this._getConfig(e),
            this._element = t,
            this._dialog = t.querySelector(hn),
            this._backdrop = null,
            this._isShown = !1,
            this._isBodyOverflowing = !1,
            this._ignoreBackdropClick = !1,
            this._isTransitioning = !1,
            this._scrollbarWidth = 0
        }
        var t = o.prototype;
        return t.toggle = function(t) {
            return this._isShown ? this.hide() : this.show(t)
        }
        ,
        t.show = function(t) {
            var e = this;
            if (!this._isShown && !this._isTransitioning) {
                p(this._element).hasClass(ln) && (this._isTransitioning = !0);
                var n = p.Event(nn.SHOW, {
                    relatedTarget: t
                });
                p(this._element).trigger(n),
                this._isShown || n.isDefaultPrevented() || (this._isShown = !0,
                this._checkScrollbar(),
                this._setScrollbar(),
                this._adjustDialog(),
                this._setEscapeEvent(),
                this._setResizeEvent(),
                p(this._element).on(nn.CLICK_DISMISS, '[data-dismiss="modal"]', function(t) {
                    return e.hide(t)
                }),
                p(this._dialog).on(nn.MOUSEDOWN_DISMISS, function() {
                    p(e._element).one(nn.MOUSEUP_DISMISS, function(t) {
                        p(t.target).is(e._element) && (e._ignoreBackdropClick = !0)
                    })
                }),
                this._showBackdrop(function() {
                    return e._showElement(t)
                }))
            }
        }
        ,
        t.hide = function(t) {
            var e = this;
            if (t && t.preventDefault(),
            this._isShown && !this._isTransitioning) {
                var n = p.Event(nn.HIDE);
                if (p(this._element).trigger(n),
                this._isShown && !n.isDefaultPrevented()) {
                    this._isShown = !1;
                    var i = p(this._element).hasClass(ln);
                    if (i && (this._isTransitioning = !0),
                    this._setEscapeEvent(),
                    this._setResizeEvent(),
                    p(document).off(nn.FOCUSIN),
                    p(this._element).removeClass(cn),
                    p(this._element).off(nn.CLICK_DISMISS),
                    p(this._dialog).off(nn.MOUSEDOWN_DISMISS),
                    i) {
                        var o = m.getTransitionDurationFromElement(this._element);
                        p(this._element).one(m.TRANSITION_END, function(t) {
                            return e._hideModal(t)
                        }).emulateTransitionEnd(o)
                    } else
                        this._hideModal()
                }
            }
        }
        ,
        t.dispose = function() {
            [window, this._element, this._dialog].forEach(function(t) {
                return p(t).off(Je)
            }),
            p(document).off(nn.FOCUSIN),
            p.removeData(this._element, $e),
            this._config = null,
            this._element = null,
            this._dialog = null,
            this._backdrop = null,
            this._isShown = null,
            this._isBodyOverflowing = null,
            this._ignoreBackdropClick = null,
            this._isTransitioning = null,
            this._scrollbarWidth = null
        }
        ,
        t.handleUpdate = function() {
            this._adjustDialog()
        }
        ,
        t._getConfig = function(t) {
            return t = l({}, tn, t),
            m.typeCheckConfig(Ge, t, en),
            t
        }
        ,
        t._showElement = function(t) {
            var e = this
              , n = p(this._element).hasClass(ln);
            this._element.parentNode && this._element.parentNode.nodeType === Node.ELEMENT_NODE || document.body.appendChild(this._element),
            this._element.style.display = "block",
            this._element.removeAttribute("aria-hidden"),
            this._element.setAttribute("aria-modal", !0),
            p(this._dialog).hasClass("modal-dialog-scrollable") ? this._dialog.querySelector(".modal-body").scrollTop = 0 : this._element.scrollTop = 0,
            n && m.reflow(this._element),
            p(this._element).addClass(cn),
            this._config.focus && this._enforceFocus();
            var i = p.Event(nn.SHOWN, {
                relatedTarget: t
            })
              , o = function() {
                e._config.focus && e._element.focus(),
                e._isTransitioning = !1,
                p(e._element).trigger(i)
            };
            if (n) {
                var r = m.getTransitionDurationFromElement(this._dialog);
                p(this._dialog).one(m.TRANSITION_END, o).emulateTransitionEnd(r)
            } else
                o()
        }
        ,
        t._enforceFocus = function() {
            var e = this;
            p(document).off(nn.FOCUSIN).on(nn.FOCUSIN, function(t) {
                document !== t.target && e._element !== t.target && 0 === p(e._element).has(t.target).length && e._element.focus()
            })
        }
        ,
        t._setEscapeEvent = function() {
            var e = this;
            this._isShown && this._config.keyboard ? p(this._element).on(nn.KEYDOWN_DISMISS, function(t) {
                27 === t.which && (t.preventDefault(),
                e.hide())
            }) : this._isShown || p(this._element).off(nn.KEYDOWN_DISMISS)
        }
        ,
        t._setResizeEvent = function() {
            var e = this;
            this._isShown ? p(window).on(nn.RESIZE, function(t) {
                return e.handleUpdate(t)
            }) : p(window).off(nn.RESIZE)
        }
        ,
        t._hideModal = function() {
            var t = this;
            this._element.style.display = "none",
            this._element.setAttribute("aria-hidden", !0),
            this._element.removeAttribute("aria-modal"),
            this._isTransitioning = !1,
            this._showBackdrop(function() {
                p(document.body).removeClass(an),
                t._resetAdjustments(),
                t._resetScrollbar(),
                p(t._element).trigger(nn.HIDDEN)
            })
        }
        ,
        t._removeBackdrop = function() {
            this._backdrop && (p(this._backdrop).remove(),
            this._backdrop = null)
        }
        ,
        t._showBackdrop = function(t) {
            var e = this
              , n = p(this._element).hasClass(ln) ? ln : "";
            if (this._isShown && this._config.backdrop) {
                if (this._backdrop = document.createElement("div"),
                this._backdrop.className = "modal-backdrop",
                n && this._backdrop.classList.add(n),
                p(this._backdrop).appendTo(document.body),
                p(this._element).on(nn.CLICK_DISMISS, function(t) {
                    e._ignoreBackdropClick ? e._ignoreBackdropClick = !1 : t.target === t.currentTarget && ("static" === e._config.backdrop ? e._element.focus() : e.hide())
                }),
                n && m.reflow(this._backdrop),
                p(this._backdrop).addClass(cn),
                !t)
                    return;
                if (!n)
                    return void t();
                var i = m.getTransitionDurationFromElement(this._backdrop);
                p(this._backdrop).one(m.TRANSITION_END, t).emulateTransitionEnd(i)
            } else if (!this._isShown && this._backdrop) {
                p(this._backdrop).removeClass(cn);
                var o = function() {
                    e._removeBackdrop(),
                    t && t()
                };
                if (p(this._element).hasClass(ln)) {
                    var r = m.getTransitionDurationFromElement(this._backdrop);
                    p(this._backdrop).one(m.TRANSITION_END, o).emulateTransitionEnd(r)
                } else
                    o()
            } else
                t && t()
        }
        ,
        t._adjustDialog = function() {
            var t = this._element.scrollHeight > document.documentElement.clientHeight;
            !this._isBodyOverflowing && t && (this._element.style.paddingLeft = this._scrollbarWidth + "px"),
            this._isBodyOverflowing && !t && (this._element.style.paddingRight = this._scrollbarWidth + "px")
        }
        ,
        t._resetAdjustments = function() {
            this._element.style.paddingLeft = "",
            this._element.style.paddingRight = ""
        }
        ,
        t._checkScrollbar = function() {
            var t = document.body.getBoundingClientRect();
            this._isBodyOverflowing = t.left + t.right < window.innerWidth,
            this._scrollbarWidth = this._getScrollbarWidth()
        }
        ,
        t._setScrollbar = function() {
            var o = this;
            if (this._isBodyOverflowing) {
                var t = [].slice.call(document.querySelectorAll(pn))
                  , e = [].slice.call(document.querySelectorAll(mn));
                p(t).each(function(t, e) {
                    var n = e.style.paddingRight
                      , i = p(e).css("padding-right");
                    p(e).data("padding-right", n).css("padding-right", parseFloat(i) + o._scrollbarWidth + "px")
                }),
                p(e).each(function(t, e) {
                    var n = e.style.marginRight
                      , i = p(e).css("margin-right");
                    p(e).data("margin-right", n).css("margin-right", parseFloat(i) - o._scrollbarWidth + "px")
                });
                var n = document.body.style.paddingRight
                  , i = p(document.body).css("padding-right");
                p(document.body).data("padding-right", n).css("padding-right", parseFloat(i) + this._scrollbarWidth + "px")
            }
            p(document.body).addClass(an)
        }
        ,
        t._resetScrollbar = function() {
            var t = [].slice.call(document.querySelectorAll(pn));
            p(t).each(function(t, e) {
                var n = p(e).data("padding-right");
                p(e).removeData("padding-right"),
                e.style.paddingRight = n || ""
            });
            var e = [].slice.call(document.querySelectorAll("" + mn));
            p(e).each(function(t, e) {
                var n = p(e).data("margin-right");
                void 0 !== n && p(e).css("margin-right", n).removeData("margin-right")
            });
            var n = p(document.body).data("padding-right");
            p(document.body).removeData("padding-right"),
            document.body.style.paddingRight = n || ""
        }
        ,
        t._getScrollbarWidth = function() {
            var t = document.createElement("div");
            t.className = "modal-scrollbar-measure",
            document.body.appendChild(t);
            var e = t.getBoundingClientRect().width - t.clientWidth;
            return document.body.removeChild(t),
            e
        }
        ,
        o._jQueryInterface = function(n, i) {
            return this.each(function() {
                var t = p(this).data($e)
                  , e = l({}, tn, p(this).data(), "object" == typeof n && n ? n : {});
                if (t || (t = new o(this,e),
                p(this).data($e, t)),
                "string" == typeof n) {
                    if (void 0 === t[n])
                        throw new TypeError('No method named "' + n + '"');
                    t[n](i)
                } else
                    e.show && t.show(i)
            })
        }
        ,
        s(o, null, [{
            key: "VERSION",
            get: function() {
                return "4.3.1"
            }
        }, {
            key: "Default",
            get: function() {
                return tn
            }
        }]),
        o
    }();
    p(document).on(nn.CLICK_DATA_API, '[data-toggle="modal"]', function(t) {
        var e, n = this, i = m.getSelectorFromElement(this);
        i && (e = document.querySelector(i));
        var o = p(e).data($e) ? "toggle" : l({}, p(e).data(), p(this).data());
        "A" !== this.tagName && "AREA" !== this.tagName || t.preventDefault();
        var r = p(e).one(nn.SHOW, function(t) {
            t.isDefaultPrevented() || r.one(nn.HIDDEN, function() {
                p(n).is(":visible") && n.focus()
            })
        });
        gn._jQueryInterface.call(p(e), o, this)
    }),
    p.fn[Ge] = gn._jQueryInterface,
    p.fn[Ge].Constructor = gn,
    p.fn[Ge].noConflict = function() {
        return p.fn[Ge] = Ze,
        gn._jQueryInterface
    }
    ;
    var _n = ["background", "cite", "href", "itemtype", "longdesc", "poster", "src", "xlink:href"]
      , vn = {
        "*": ["class", "dir", "id", "lang", "role", /^aria-[\w-]*$/i],
        a: ["target", "href", "title", "rel"],
        area: [],
        b: [],
        br: [],
        col: [],
        code: [],
        div: [],
        em: [],
        hr: [],
        h1: [],
        h2: [],
        h3: [],
        h4: [],
        h5: [],
        h6: [],
        i: [],
        img: ["src", "alt", "title", "width", "height"],
        li: [],
        ol: [],
        p: [],
        pre: [],
        s: [],
        small: [],
        span: [],
        sub: [],
        sup: [],
        strong: [],
        u: [],
        ul: []
    }
      , yn = /^(?:(?:https?|mailto|ftp|tel|file):|[^&:\/?#]*(?:[\/?#]|$))/gi
      , En = /^data:(?:image\/(?:bmp|gif|jpeg|jpg|png|tiff|webp)|video\/(?:mpeg|mp4|ogg|webm)|audio\/(?:mp3|oga|ogg|opus));base64,[a-z0-9+\/]+=*$/i
      , wn = "tooltip"
      , Cn = "bs.tooltip"
      , Tn = "." + Cn
      , Sn = p.fn[wn]
      , Dn = "bs-tooltip"
      , In = new RegExp("(^|\\s)" + Dn + "\\S+","g")
      , An = ["sanitize", "whiteList", "sanitizeFn"]
      , On = {
        animation: "boolean",
        template: "string",
        title: "(string|element|function)",
        trigger: "string",
        delay: "(number|object)",
        html: "boolean",
        selector: "(string|boolean)",
        placement: "(string|function)",
        offset: "(number|string|function)",
        container: "(string|element|boolean)",
        fallbackPlacement: "(string|array)",
        boundary: "(string|element)",
        sanitize: "boolean",
        sanitizeFn: "(null|function)",
        whiteList: "object"
    }
      , Nn = {
        AUTO: "auto",
        TOP: "top",
        RIGHT: "right",
        BOTTOM: "bottom",
        LEFT: "left"
    }
      , kn = {
        animation: !0,
        template: '<div class="tooltip" role="tooltip"><div class="arrow"></div><div class="tooltip-inner"></div></div>',
        trigger: "hover focus",
        title: "",
        delay: 0,
        html: !1,
        selector: !1,
        placement: "top",
        offset: 0,
        container: !1,
        fallbackPlacement: "flip",
        boundary: "scrollParent",
        sanitize: !0,
        sanitizeFn: null,
        whiteList: vn
    }
      , Ln = "show"
      , Pn = {
        HIDE: "hide" + Tn,
        HIDDEN: "hidden" + Tn,
        SHOW: "show" + Tn,
        SHOWN: "shown" + Tn,
        INSERTED: "inserted" + Tn,
        CLICK: "click" + Tn,
        FOCUSIN: "focusin" + Tn,
        FOCUSOUT: "focusout" + Tn,
        MOUSEENTER: "mouseenter" + Tn,
        MOUSELEAVE: "mouseleave" + Tn
    }
      , Hn = "fade"
      , jn = "show"
      , Mn = "hover"
      , Wn = "focus"
      , qn = function() {
        function i(t, e) {
            if (void 0 === be)
                throw new TypeError("Bootstrap's tooltips require Popper.js (https://popper.js.org/)");
            this._isEnabled = !0,
            this._timeout = 0,
            this._hoverState = "",
            this._activeTrigger = {},
            this._popper = null,
            this.element = t,
            this.config = this._getConfig(e),
            this.tip = null,
            this._setListeners()
        }
        var t = i.prototype;
        return t.enable = function() {
            this._isEnabled = !0
        }
        ,
        t.disable = function() {
            this._isEnabled = !1
        }
        ,
        t.toggleEnabled = function() {
            this._isEnabled = !this._isEnabled
        }
        ,
        t.toggle = function(t) {
            if (this._isEnabled)
                if (t) {
                    var e = this.constructor.DATA_KEY
                      , n = p(t.currentTarget).data(e);
                    n || (n = new this.constructor(t.currentTarget,this._getDelegateConfig()),
                    p(t.currentTarget).data(e, n)),
                    n._activeTrigger.click = !n._activeTrigger.click,
                    n._isWithActiveTrigger() ? n._enter(null, n) : n._leave(null, n)
                } else {
                    if (p(this.getTipElement()).hasClass(jn))
                        return void this._leave(null, this);
                    this._enter(null, this)
                }
        }
        ,
        t.dispose = function() {
            clearTimeout(this._timeout),
            p.removeData(this.element, this.constructor.DATA_KEY),
            p(this.element).off(this.constructor.EVENT_KEY),
            p(this.element).closest(".modal").off("hide.bs.modal"),
            this.tip && p(this.tip).remove(),
            this._isEnabled = null,
            this._timeout = null,
            this._hoverState = null,
            (this._activeTrigger = null) !== this._popper && this._popper.destroy(),
            this._popper = null,
            this.element = null,
            this.config = null,
            this.tip = null
        }
        ,
        t.show = function() {
            var e = this;
            if ("none" === p(this.element).css("display"))
                throw new Error("Please use show on visible elements");
            var t = p.Event(this.constructor.Event.SHOW);
            if (this.isWithContent() && this._isEnabled) {
                p(this.element).trigger(t);
                var n = m.findShadowRoot(this.element)
                  , i = p.contains(null !== n ? n : this.element.ownerDocument.documentElement, this.element);
                if (t.isDefaultPrevented() || !i)
                    return;
                var o = this.getTipElement()
                  , r = m.getUID(this.constructor.NAME);
                o.setAttribute("id", r),
                this.element.setAttribute("aria-describedby", r),
                this.setContent(),
                this.config.animation && p(o).addClass(Hn);
                var s = "function" == typeof this.config.placement ? this.config.placement.call(this, o, this.element) : this.config.placement
                  , a = this._getAttachment(s);
                this.addAttachmentClass(a);
                var l = this._getContainer();
                p(o).data(this.constructor.DATA_KEY, this),
                p.contains(this.element.ownerDocument.documentElement, this.tip) || p(o).appendTo(l),
                p(this.element).trigger(this.constructor.Event.INSERTED),
                this._popper = new be(this.element,o,{
                    placement: a,
                    modifiers: {
                        offset: this._getOffset(),
                        flip: {
                            behavior: this.config.fallbackPlacement
                        },
                        arrow: {
                            element: ".arrow"
                        },
                        preventOverflow: {
                            boundariesElement: this.config.boundary
                        }
                    },
                    onCreate: function(t) {
                        t.originalPlacement !== t.placement && e._handlePopperPlacementChange(t)
                    },
                    onUpdate: function(t) {
                        return e._handlePopperPlacementChange(t)
                    }
                }),
                p(o).addClass(jn),
                "ontouchstart"in document.documentElement && p(document.body).children().on("mouseover", null, p.noop);
                var c = function() {
                    e.config.animation && e._fixTransition();
                    var t = e._hoverState;
                    e._hoverState = null,
                    p(e.element).trigger(e.constructor.Event.SHOWN),
                    "out" === t && e._leave(null, e)
                };
                if (p(this.tip).hasClass(Hn)) {
                    var h = m.getTransitionDurationFromElement(this.tip);
                    p(this.tip).one(m.TRANSITION_END, c).emulateTransitionEnd(h)
                } else
                    c()
            }
        }
        ,
        t.hide = function(t) {
            var e = this
              , n = this.getTipElement()
              , i = p.Event(this.constructor.Event.HIDE)
              , o = function() {
                e._hoverState !== Ln && n.parentNode && n.parentNode.removeChild(n),
                e._cleanTipClass(),
                e.element.removeAttribute("aria-describedby"),
                p(e.element).trigger(e.constructor.Event.HIDDEN),
                null !== e._popper && e._popper.destroy(),
                t && t()
            };
            if (p(this.element).trigger(i),
            !i.isDefaultPrevented()) {
                if (p(n).removeClass(jn),
                "ontouchstart"in document.documentElement && p(document.body).children().off("mouseover", null, p.noop),
                this._activeTrigger.click = !1,
                this._activeTrigger[Wn] = !1,
                this._activeTrigger[Mn] = !1,
                p(this.tip).hasClass(Hn)) {
                    var r = m.getTransitionDurationFromElement(n);
                    p(n).one(m.TRANSITION_END, o).emulateTransitionEnd(r)
                } else
                    o();
                this._hoverState = ""
            }
        }
        ,
        t.update = function() {
            null !== this._popper && this._popper.scheduleUpdate()
        }
        ,
        t.isWithContent = function() {
            return Boolean(this.getTitle())
        }
        ,
        t.addAttachmentClass = function(t) {
            p(this.getTipElement()).addClass(Dn + "-" + t)
        }
        ,
        t.getTipElement = function() {
            return this.tip = this.tip || p(this.config.template)[0],
            this.tip
        }
        ,
        t.setContent = function() {
            var t = this.getTipElement();
            this.setElementContent(p(t.querySelectorAll(".tooltip-inner")), this.getTitle()),
            p(t).removeClass(Hn + " " + jn)
        }
        ,
        t.setElementContent = function(t, e) {
            "object" != typeof e || !e.nodeType && !e.jquery ? this.config.html ? (this.config.sanitize && (e = bn(e, this.config.whiteList, this.config.sanitizeFn)),
            t.html(e)) : t.text(e) : this.config.html ? p(e).parent().is(t) || t.empty().append(e) : t.text(p(e).text())
        }
        ,
        t.getTitle = function() {
            var t = this.element.getAttribute("data-original-title");
            return t || (t = "function" == typeof this.config.title ? this.config.title.call(this.element) : this.config.title),
            t
        }
        ,
        t._getOffset = function() {
            var e = this
              , t = {};
            return "function" == typeof this.config.offset ? t.fn = function(t) {
                return t.offsets = l({}, t.offsets, e.config.offset(t.offsets, e.element) || {}),
                t
            }
            : t.offset = this.config.offset,
            t
        }
        ,
        t._getContainer = function() {
            return !1 === this.config.container ? document.body : m.isElement(this.config.container) ? p(this.config.container) : p(document).find(this.config.container)
        }
        ,
        t._getAttachment = function(t) {
            return Nn[t.toUpperCase()]
        }
        ,
        t._setListeners = function() {
            var i = this;
            this.config.trigger.split(" ").forEach(function(t) {
                if ("click" === t)
                    p(i.element).on(i.constructor.Event.CLICK, i.config.selector, function(t) {
                        return i.toggle(t)
                    });
                else if ("manual" !== t) {
                    var e = t === Mn ? i.constructor.Event.MOUSEENTER : i.constructor.Event.FOCUSIN
                      , n = t === Mn ? i.constructor.Event.MOUSELEAVE : i.constructor.Event.FOCUSOUT;
                    p(i.element).on(e, i.config.selector, function(t) {
                        return i._enter(t)
                    }).on(n, i.config.selector, function(t) {
                        return i._leave(t)
                    })
                }
            }),
            p(this.element).closest(".modal").on("hide.bs.modal", function() {
                i.element && i.hide()
            }),
            this.config.selector ? this.config = l({}, this.config, {
                trigger: "manual",
                selector: ""
            }) : this._fixTitle()
        }
        ,
        t._fixTitle = function() {
            var t = typeof this.element.getAttribute("data-original-title");
            (this.element.getAttribute("title") || "string" !== t) && (this.element.setAttribute("data-original-title", this.element.getAttribute("title") || ""),
            this.element.setAttribute("title", ""))
        }
        ,
        t._enter = function(t, e) {
            var n = this.constructor.DATA_KEY;
            (e = e || p(t.currentTarget).data(n)) || (e = new this.constructor(t.currentTarget,this._getDelegateConfig()),
            p(t.currentTarget).data(n, e)),
            t && (e._activeTrigger["focusin" === t.type ? Wn : Mn] = !0),
            p(e.getTipElement()).hasClass(jn) || e._hoverState === Ln ? e._hoverState = Ln : (clearTimeout(e._timeout),
            e._hoverState = Ln,
            e.config.delay && e.config.delay.show ? e._timeout = setTimeout(function() {
                e._hoverState === Ln && e.show()
            }, e.config.delay.show) : e.show())
        }
        ,
        t._leave = function(t, e) {
            var n = this.constructor.DATA_KEY;
            (e = e || p(t.currentTarget).data(n)) || (e = new this.constructor(t.currentTarget,this._getDelegateConfig()),
            p(t.currentTarget).data(n, e)),
            t && (e._activeTrigger["focusout" === t.type ? Wn : Mn] = !1),
            e._isWithActiveTrigger() || (clearTimeout(e._timeout),
            e._hoverState = "out",
            e.config.delay && e.config.delay.hide ? e._timeout = setTimeout(function() {
                "out" === e._hoverState && e.hide()
            }, e.config.delay.hide) : e.hide())
        }
        ,
        t._isWithActiveTrigger = function() {
            for (var t in this._activeTrigger)
                if (this._activeTrigger[t])
                    return !0;
            return !1
        }
        ,
        t._getConfig = function(t) {
            var e = p(this.element).data();
            return Object.keys(e).forEach(function(t) {
                -1 !== An.indexOf(t) && delete e[t]
            }),
            "number" == typeof (t = l({}, this.constructor.Default, e, "object" == typeof t && t ? t : {})).delay && (t.delay = {
                show: t.delay,
                hide: t.delay
            }),
            "number" == typeof t.title && (t.title = t.title.toString()),
            "number" == typeof t.content && (t.content = t.content.toString()),
            m.typeCheckConfig(wn, t, this.constructor.DefaultType),
            t.sanitize && (t.template = bn(t.template, t.whiteList, t.sanitizeFn)),
            t
        }
        ,
        t._getDelegateConfig = function() {
            var t = {};
            if (this.config)
                for (var e in this.config)
                    this.constructor.Default[e] !== this.config[e] && (t[e] = this.config[e]);
            return t
        }
        ,
        t._cleanTipClass = function() {
            var t = p(this.getTipElement())
              , e = t.attr("class").match(In);
            null !== e && e.length && t.removeClass(e.join(""))
        }
        ,
        t._handlePopperPlacementChange = function(t) {
            var e = t.instance;
            this.tip = e.popper,
            this._cleanTipClass(),
            this.addAttachmentClass(this._getAttachment(t.placement))
        }
        ,
        t._fixTransition = function() {
            var t = this.getTipElement()
              , e = this.config.animation;
            null === t.getAttribute("x-placement") && (p(t).removeClass(Hn),
            this.config.animation = !1,
            this.hide(),
            this.show(),
            this.config.animation = e)
        }
        ,
        i._jQueryInterface = function(n) {
            return this.each(function() {
                var t = p(this).data(Cn)
                  , e = "object" == typeof n && n;
                if ((t || !/dispose|hide/.test(n)) && (t || (t = new i(this,e),
                p(this).data(Cn, t)),
                "string" == typeof n)) {
                    if (void 0 === t[n])
                        throw new TypeError('No method named "' + n + '"');
                    t[n]()
                }
            })
        }
        ,
        s(i, null, [{
            key: "VERSION",
            get: function() {
                return "4.3.1"
            }
        }, {
            key: "Default",
            get: function() {
                return kn
            }
        }, {
            key: "NAME",
            get: function() {
                return wn
            }
        }, {
            key: "DATA_KEY",
            get: function() {
                return Cn
            }
        }, {
            key: "Event",
            get: function() {
                return Pn
            }
        }, {
            key: "EVENT_KEY",
            get: function() {
                return Tn
            }
        }, {
            key: "DefaultType",
            get: function() {
                return On
            }
        }]),
        i
    }();
    p.fn[wn] = qn._jQueryInterface,
    p.fn[wn].Constructor = qn,
    p.fn[wn].noConflict = function() {
        return p.fn[wn] = Sn,
        qn._jQueryInterface
    }
    ;
    var Kn = "popover"
      , Qn = "bs.popover"
      , Vn = "." + Qn
      , Yn = p.fn[Kn]
      , zn = "bs-popover"
      , Xn = new RegExp("(^|\\s)" + zn + "\\S+","g")
      , Gn = l({}, qn.Default, {
        placement: "right",
        trigger: "click",
        content: "",
        template: '<div class="popover" role="tooltip"><div class="arrow"></div><h3 class="popover-header"></h3><div class="popover-body"></div></div>'
    })
      , $n = l({}, qn.DefaultType, {
        content: "(string|element|function)"
    })
      , ni = {
        HIDE: "hide" + Vn,
        HIDDEN: "hidden" + Vn,
        SHOW: "show" + Vn,
        SHOWN: "shown" + Vn,
        INSERTED: "inserted" + Vn,
        CLICK: "click" + Vn,
        FOCUSIN: "focusin" + Vn,
        FOCUSOUT: "focusout" + Vn,
        MOUSEENTER: "mouseenter" + Vn,
        MOUSELEAVE: "mouseleave" + Vn
    }
      , ii = function(t) {
        function i() {
            return t.apply(this, arguments) || this
        }
        var e, n;
        n = t,
        (e = i).prototype = Object.create(n.prototype),
        (e.prototype.constructor = e).__proto__ = n;
        var o = i.prototype;
        return o.isWithContent = function() {
            return this.getTitle() || this._getContent()
        }
        ,
        o.addAttachmentClass = function(t) {
            p(this.getTipElement()).addClass(zn + "-" + t)
        }
        ,
        o.getTipElement = function() {
            return this.tip = this.tip || p(this.config.template)[0],
            this.tip
        }
        ,
        o.setContent = function() {
            var t = p(this.getTipElement());
            this.setElementContent(t.find(".popover-header"), this.getTitle());
            var e = this._getContent();
            "function" == typeof e && (e = e.call(this.element)),
            this.setElementContent(t.find(".popover-body"), e),
            t.removeClass("fade show")
        }
        ,
        o._getContent = function() {
            return this.element.getAttribute("data-content") || this.config.content
        }
        ,
        o._cleanTipClass = function() {
            var t = p(this.getTipElement())
              , e = t.attr("class").match(Xn);
            null !== e && 0 < e.length && t.removeClass(e.join(""))
        }
        ,
        i._jQueryInterface = function(n) {
            return this.each(function() {
                var t = p(this).data(Qn)
                  , e = "object" == typeof n ? n : null;
                if ((t || !/dispose|hide/.test(n)) && (t || (t = new i(this,e),
                p(this).data(Qn, t)),
                "string" == typeof n)) {
                    if (void 0 === t[n])
                        throw new TypeError('No method named "' + n + '"');
                    t[n]()
                }
            })
        }
        ,
        s(i, null, [{
            key: "VERSION",
            get: function() {
                return "4.3.1"
            }
        }, {
            key: "Default",
            get: function() {
                return Gn
            }
        }, {
            key: "NAME",
            get: function() {
                return Kn
            }
        }, {
            key: "DATA_KEY",
            get: function() {
                return Qn
            }
        }, {
            key: "Event",
            get: function() {
                return ni
            }
        }, {
            key: "EVENT_KEY",
            get: function() {
                return Vn
            }
        }, {
            key: "DefaultType",
            get: function() {
                return $n
            }
        }]),
        i
    }(qn);
    p.fn[Kn] = ii._jQueryInterface,
    p.fn[Kn].Constructor = ii,
    p.fn[Kn].noConflict = function() {
        return p.fn[Kn] = Yn,
        ii._jQueryInterface
    }
    ;
    var oi = "scrollspy"
      , ri = "bs.scrollspy"
      , si = "." + ri
      , ai = p.fn[oi]
      , li = {
        offset: 10,
        method: "auto",
        target: ""
    }
      , ci = {
        offset: "number",
        method: "string",
        target: "(string|element)"
    }
      , hi = {
        ACTIVATE: "activate" + si,
        SCROLL: "scroll" + si,
        LOAD_DATA_API: "load" + si + ".data-api"
    }
      , fi = "active"
      , pi = ".nav, .list-group"
      , mi = ".nav-link"
      , _i = ".list-group-item"
      , yi = ".dropdown-item"
      , wi = "position"
      , Ci = function() {
        function n(t, e) {
            var n = this;
            this._element = t,
            this._scrollElement = "BODY" === t.tagName ? window : t,
            this._config = this._getConfig(e),
            this._selector = this._config.target + " " + mi + "," + this._config.target + " " + _i + "," + this._config.target + " " + yi,
            this._offsets = [],
            this._targets = [],
            this._activeTarget = null,
            this._scrollHeight = 0,
            p(this._scrollElement).on(hi.SCROLL, function(t) {
                return n._process(t)
            }),
            this.refresh(),
            this._process()
        }
        var t = n.prototype;
        return t.refresh = function() {
            var e = this
              , t = this._scrollElement === this._scrollElement.window ? "offset" : wi
              , o = "auto" === this._config.method ? t : this._config.method
              , r = o === wi ? this._getScrollTop() : 0;
            this._offsets = [],
            this._targets = [],
            this._scrollHeight = this._getScrollHeight(),
            [].slice.call(document.querySelectorAll(this._selector)).map(function(t) {
                var e, n = m.getSelectorFromElement(t);
                if (n && (e = document.querySelector(n)),
                e) {
                    var i = e.getBoundingClientRect();
                    if (i.width || i.height)
                        return [p(e)[o]().top + r, n]
                }
                return null
            }).filter(function(t) {
                return t
            }).sort(function(t, e) {
                return t[0] - e[0]
            }).forEach(function(t) {
                e._offsets.push(t[0]),
                e._targets.push(t[1])
            })
        }
        ,
        t.dispose = function() {
            p.removeData(this._element, ri),
            p(this._scrollElement).off(si),
            this._element = null,
            this._scrollElement = null,
            this._config = null,
            this._selector = null,
            this._offsets = null,
            this._targets = null,
            this._activeTarget = null,
            this._scrollHeight = null
        }
        ,
        t._getConfig = function(t) {
            if ("string" != typeof (t = l({}, li, "object" == typeof t && t ? t : {})).target) {
                var e = p(t.target).attr("id");
                e || (e = m.getUID(oi),
                p(t.target).attr("id", e)),
                t.target = "#" + e
            }
            return m.typeCheckConfig(oi, t, ci),
            t
        }
        ,
        t._getScrollTop = function() {
            return this._scrollElement === window ? this._scrollElement.pageYOffset : this._scrollElement.scrollTop
        }
        ,
        t._getScrollHeight = function() {
            return this._scrollElement.scrollHeight || Math.max(document.body.scrollHeight, document.documentElement.scrollHeight)
        }
        ,
        t._getOffsetHeight = function() {
            return this._scrollElement === window ? window.innerHeight : this._scrollElement.getBoundingClientRect().height
        }
        ,
        t._process = function() {
            var t = this._getScrollTop() + this._config.offset
              , e = this._getScrollHeight()
              , n = this._config.offset + e - this._getOffsetHeight();
            if (this._scrollHeight !== e && this.refresh(),
            n <= t) {
                var i = this._targets[this._targets.length - 1];
                this._activeTarget !== i && this._activate(i)
            } else {
                if (this._activeTarget && t < this._offsets[0] && 0 < this._offsets[0])
                    return this._activeTarget = null,
                    void this._clear();
                for (var o = this._offsets.length; o--; )
                    this._activeTarget !== this._targets[o] && t >= this._offsets[o] && (void 0 === this._offsets[o + 1] || t < this._offsets[o + 1]) && this._activate(this._targets[o])
            }
        }
        ,
        t._activate = function(e) {
            this._activeTarget = e,
            this._clear();
            var t = this._selector.split(",").map(function(t) {
                return t + '[data-target="' + e + '"],' + t + '[href="' + e + '"]'
            })
              , n = p([].slice.call(document.querySelectorAll(t.join(","))));
            n.hasClass("dropdown-item") ? (n.closest(".dropdown").find(".dropdown-toggle").addClass(fi),
            n.addClass(fi)) : (n.addClass(fi),
            n.parents(pi).prev(mi + ", " + _i).addClass(fi),
            n.parents(pi).prev(".nav-item").children(mi).addClass(fi)),
            p(this._scrollElement).trigger(hi.ACTIVATE, {
                relatedTarget: e
            })
        }
        ,
        t._clear = function() {
            [].slice.call(document.querySelectorAll(this._selector)).filter(function(t) {
                return t.classList.contains(fi)
            }).forEach(function(t) {
                return t.classList.remove(fi)
            })
        }
        ,
        n._jQueryInterface = function(e) {
            return this.each(function() {
                var t = p(this).data(ri);
                if (t || (t = new n(this,"object" == typeof e && e),
                p(this).data(ri, t)),
                "string" == typeof e) {
                    if (void 0 === t[e])
                        throw new TypeError('No method named "' + e + '"');
                    t[e]()
                }
            })
        }
        ,
        s(n, null, [{
            key: "VERSION",
            get: function() {
                return "4.3.1"
            }
        }, {
            key: "Default",
            get: function() {
                return li
            }
        }]),
        n
    }();
    p(window).on(hi.LOAD_DATA_API, function() {
        for (var t = [].slice.call(document.querySelectorAll('[data-spy="scroll"]')), e = t.length; e--; ) {
            var n = p(t[e]);
            Ci._jQueryInterface.call(n, n.data())
        }
    }),
    p.fn[oi] = Ci._jQueryInterface,
    p.fn[oi].Constructor = Ci,
    p.fn[oi].noConflict = function() {
        return p.fn[oi] = ai,
        Ci._jQueryInterface
    }
    ;
    var Ti = "bs.tab"
      , Si = "." + Ti
      , Di = p.fn.tab
      , Ii = {
        HIDE: "hide" + Si,
        HIDDEN: "hidden" + Si,
        SHOW: "show" + Si,
        SHOWN: "shown" + Si,
        CLICK_DATA_API: "click" + Si + ".data-api"
    }
      , Oi = "active"
      , Hi = ".active"
      , ji = "> li > .active"
      , Wi = function() {
        function i(t) {
            this._element = t
        }
        var t = i.prototype;
        return t.show = function() {
            var n = this;
            if (!(this._element.parentNode && this._element.parentNode.nodeType === Node.ELEMENT_NODE && p(this._element).hasClass(Oi) || p(this._element).hasClass("disabled"))) {
                var t, i, e = p(this._element).closest(".nav, .list-group")[0], o = m.getSelectorFromElement(this._element);
                if (e) {
                    var r = "UL" === e.nodeName || "OL" === e.nodeName ? ji : Hi;
                    i = (i = p.makeArray(p(e).find(r)))[i.length - 1]
                }
                var s = p.Event(Ii.HIDE, {
                    relatedTarget: this._element
                })
                  , a = p.Event(Ii.SHOW, {
                    relatedTarget: i
                });
                if (i && p(i).trigger(s),
                p(this._element).trigger(a),
                !a.isDefaultPrevented() && !s.isDefaultPrevented()) {
                    o && (t = document.querySelector(o)),
                    this._activate(this._element, e);
                    var l = function() {
                        var t = p.Event(Ii.HIDDEN, {
                            relatedTarget: n._element
                        })
                          , e = p.Event(Ii.SHOWN, {
                            relatedTarget: i
                        });
                        p(i).trigger(t),
                        p(n._element).trigger(e)
                    };
                    t ? this._activate(t, t.parentNode, l) : l()
                }
            }
        }
        ,
        t.dispose = function() {
            p.removeData(this._element, Ti),
            this._element = null
        }
        ,
        t._activate = function(t, e, n) {
            var i = this
              , o = (!e || "UL" !== e.nodeName && "OL" !== e.nodeName ? p(e).children(Hi) : p(e).find(ji))[0]
              , r = n && o && p(o).hasClass("fade")
              , s = function() {
                return i._transitionComplete(t, o, n)
            };
            if (o && r) {
                var a = m.getTransitionDurationFromElement(o);
                p(o).removeClass("show").one(m.TRANSITION_END, s).emulateTransitionEnd(a)
            } else
                s()
        }
        ,
        t._transitionComplete = function(t, e, n) {
            if (e) {
                p(e).removeClass(Oi);
                var i = p(e.parentNode).find("> .dropdown-menu .active")[0];
                i && p(i).removeClass(Oi),
                "tab" === e.getAttribute("role") && e.setAttribute("aria-selected", !1)
            }
            if (p(t).addClass(Oi),
            "tab" === t.getAttribute("role") && t.setAttribute("aria-selected", !0),
            m.reflow(t),
            t.classList.contains("fade") && t.classList.add("show"),
            t.parentNode && p(t.parentNode).hasClass("dropdown-menu")) {
                var o = p(t).closest(".dropdown")[0];
                if (o) {
                    var r = [].slice.call(o.querySelectorAll(".dropdown-toggle"));
                    p(r).addClass(Oi)
                }
                t.setAttribute("aria-expanded", !0)
            }
            n && n()
        }
        ,
        i._jQueryInterface = function(n) {
            return this.each(function() {
                var t = p(this)
                  , e = t.data(Ti);
                if (e || (e = new i(this),
                t.data(Ti, e)),
                "string" == typeof n) {
                    if (void 0 === e[n])
                        throw new TypeError('No method named "' + n + '"');
                    e[n]()
                }
            })
        }
        ,
        s(i, null, [{
            key: "VERSION",
            get: function() {
                return "4.3.1"
            }
        }]),
        i
    }();
    p(document).on(Ii.CLICK_DATA_API, '[data-toggle="tab"], [data-toggle="pill"], [data-toggle="list"]', function(t) {
        t.preventDefault(),
        Wi._jQueryInterface.call(p(this), "show")
    }),
    p.fn.tab = Wi._jQueryInterface,
    p.fn.tab.Constructor = Wi,
    p.fn.tab.noConflict = function() {
        return p.fn.tab = Di,
        Wi._jQueryInterface
    }
    ;
    var Ui = "toast"
      , Bi = "bs.toast"
      , qi = "." + Bi
      , Ki = p.fn[Ui]
      , Qi = {
        CLICK_DISMISS: "click.dismiss" + qi,
        HIDE: "hide" + qi,
        HIDDEN: "hidden" + qi,
        SHOW: "show" + qi,
        SHOWN: "shown" + qi
    }
      , zi = "show"
      , Xi = "showing"
      , Gi = {
        animation: "boolean",
        autohide: "boolean",
        delay: "number"
    }
      , $i = {
        animation: !0,
        autohide: !0,
        delay: 500
    }
      , Zi = function() {
        function i(t, e) {
            this._element = t,
            this._config = this._getConfig(e),
            this._timeout = null,
            this._setListeners()
        }
        var t = i.prototype;
        return t.show = function() {
            var t = this;
            p(this._element).trigger(Qi.SHOW),
            this._config.animation && this._element.classList.add("fade");
            var e = function() {
                t._element.classList.remove(Xi),
                t._element.classList.add(zi),
                p(t._element).trigger(Qi.SHOWN),
                t._config.autohide && t.hide()
            };
            if (this._element.classList.remove("hide"),
            this._element.classList.add(Xi),
            this._config.animation) {
                var n = m.getTransitionDurationFromElement(this._element);
                p(this._element).one(m.TRANSITION_END, e).emulateTransitionEnd(n)
            } else
                e()
        }
        ,
        t.hide = function(t) {
            var e = this;
            this._element.classList.contains(zi) && (p(this._element).trigger(Qi.HIDE),
            t ? this._close() : this._timeout = setTimeout(function() {
                e._close()
            }, this._config.delay))
        }
        ,
        t.dispose = function() {
            clearTimeout(this._timeout),
            this._timeout = null,
            this._element.classList.contains(zi) && this._element.classList.remove(zi),
            p(this._element).off(Qi.CLICK_DISMISS),
            p.removeData(this._element, Bi),
            this._element = null,
            this._config = null
        }
        ,
        t._getConfig = function(t) {
            return t = l({}, $i, p(this._element).data(), "object" == typeof t && t ? t : {}),
            m.typeCheckConfig(Ui, t, this.constructor.DefaultType),
            t
        }
        ,
        t._setListeners = function() {
            var t = this;
            p(this._element).on(Qi.CLICK_DISMISS, '[data-dismiss="toast"]', function() {
                return t.hide(!0)
            })
        }
        ,
        t._close = function() {
            var t = this
              , e = function() {
                t._element.classList.add("hide"),
                p(t._element).trigger(Qi.HIDDEN)
            };
            if (this._element.classList.remove(zi),
            this._config.animation) {
                var n = m.getTransitionDurationFromElement(this._element);
                p(this._element).one(m.TRANSITION_END, e).emulateTransitionEnd(n)
            } else
                e()
        }
        ,
        i._jQueryInterface = function(n) {
            return this.each(function() {
                var t = p(this)
                  , e = t.data(Bi);
                if (e || (e = new i(this,"object" == typeof n && n),
                t.data(Bi, e)),
                "string" == typeof n) {
                    if (void 0 === e[n])
                        throw new TypeError('No method named "' + n + '"');
                    e[n](this)
                }
            })
        }
        ,
        s(i, null, [{
            key: "VERSION",
            get: function() {
                return "4.3.1"
            }
        }, {
            key: "DefaultType",
            get: function() {
                return Gi
            }
        }, {
            key: "Default",
            get: function() {
                return $i
            }
        }]),
        i
    }();
    p.fn[Ui] = Zi._jQueryInterface,
    p.fn[Ui].Constructor = Zi,
    p.fn[Ui].noConflict = function() {
        return p.fn[Ui] = Ki,
        Zi._jQueryInterface
    }
    ,
    function() {
        if (void 0 === p)
            throw new TypeError("Bootstrap's JavaScript requires jQuery. jQuery must be included before Bootstrap's JavaScript.");
        var t = p.fn.jquery.split(" ")[0].split(".");
        if (t[0] < 2 && t[1] < 9 || 1 === t[0] && 9 === t[1] && t[2] < 1 || 4 <= t[0])
            throw new Error("Bootstrap's JavaScript requires at least jQuery v1.9.1 but less than v4.0.0")
    }(),
    t.Util = m,
    t.Alert = g,
    t.Button = k,
    t.Carousel = at,
    t.Collapse = Ct,
    t.Dropdown = Xe,
    t.Modal = gn,
    t.Popover = ii,
    t.Scrollspy = Ci,
    t.Tab = Wi,
    t.Toast = Zi,
    t.Tooltip = qn,
    Object.defineProperty(t, "__esModule", {
        value: !0
    })
});
