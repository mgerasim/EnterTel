(window["webpackJsonp"] = window["webpackJsonp"] || []).push([["default~auth-auth-module~employees-employees-module"],{

/***/ "./node_modules/devextreme/animation/easing.js":
/*!*****************************************************!*\
  !*** ./node_modules/devextreme/animation/easing.js ***!
  \*****************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/**
 * DevExtreme (animation/easing.js)
 * Version: 20.2.3
 * Build date: Tue Oct 20 2020
 *
 * Copyright (c) 2012 - 2020 Developer Express Inc. ALL RIGHTS RESERVED
 * Read about DevExtreme licensing here: https://js.devexpress.com/Licensing/
 */

exports.setEasing = setEasing;
exports.getEasing = getEasing;
exports.convertTransitionTimingFuncToEasing = void 0;
var _type = __webpack_require__(/*! ../core/utils/type */ "./node_modules/devextreme/core/utils/type.js");
var CSS_TRANSITION_EASING_REGEX = /cubic-bezier\((\d+(?:\.\d+)?)\s*,\s*(\d+(?:\.\d+)?)\s*,\s*(\d+(?:\.\d+)?)\s*,\s*(\d+(?:\.\d+)?)\)/;
var TransitionTimingFuncMap = {
    linear: "cubic-bezier(0, 0, 1, 1)",
    swing: "cubic-bezier(0.445, 0.05, 0.55, 0.95)",
    ease: "cubic-bezier(0.25, 0.1, 0.25, 1)",
    "ease-in": "cubic-bezier(0.42, 0, 1, 1)",
    "ease-out": "cubic-bezier(0, 0, 0.58, 1)",
    "ease-in-out": "cubic-bezier(0.42, 0, 0.58, 1)"
};
var polynomBezier = function(x1, y1, x2, y2) {
    var Cx = 3 * x1;
    var Bx = 3 * (x2 - x1) - Cx;
    var Ax = 1 - Cx - Bx;
    var Cy = 3 * y1;
    var By = 3 * (y2 - y1) - Cy;
    var Ay = 1 - Cy - By;
    var bezierX = function(t) {
        return t * (Cx + t * (Bx + t * Ax))
    };
    var bezierY = function(t) {
        return t * (Cy + t * (By + t * Ay))
    };
    var derivativeX = function(t) {
        return Cx + t * (2 * Bx + 3 * t * Ax)
    };
    var findXFor = function(t) {
        var x = t;
        var i = 0;
        var z;
        while (i < 14) {
            z = bezierX(x) - t;
            if (Math.abs(z) < .001) {
                break
            }
            x -= z / derivativeX(x);
            i++
        }
        return x
    };
    return function(t) {
        return bezierY(findXFor(t))
    }
};
var easing = {};
var convertTransitionTimingFuncToEasing = function(cssTransitionEasing) {
    cssTransitionEasing = TransitionTimingFuncMap[cssTransitionEasing] || cssTransitionEasing;
    var coeffs = cssTransitionEasing.match(CSS_TRANSITION_EASING_REGEX);
    var forceName;
    if (!coeffs) {
        forceName = "linear";
        coeffs = TransitionTimingFuncMap[forceName].match(CSS_TRANSITION_EASING_REGEX)
    }
    coeffs = coeffs.slice(1, 5);
    for (var i = 0; i < coeffs.length; i++) {
        coeffs[i] = parseFloat(coeffs[i])
    }
    var easingName = forceName || "cubicbezier_" + coeffs.join("_").replace(/\./g, "p");
    if (!(0, _type.isFunction)(easing[easingName])) {
        easing[easingName] = function(x, t, b, c, d) {
            return c * polynomBezier(coeffs[0], coeffs[1], coeffs[2], coeffs[3])(t / d) + b
        }
    }
    return easingName
};
exports.convertTransitionTimingFuncToEasing = convertTransitionTimingFuncToEasing;

function setEasing(value) {
    easing = value
}

function getEasing(name) {
    return easing[name]
}


/***/ }),

/***/ "./node_modules/devextreme/animation/frame.js":
/*!****************************************************!*\
  !*** ./node_modules/devextreme/animation/frame.js ***!
  \****************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/**
 * DevExtreme (animation/frame.js)
 * Version: 20.2.3
 * Build date: Tue Oct 20 2020
 *
 * Copyright (c) 2012 - 2020 Developer Express Inc. ALL RIGHTS RESERVED
 * Read about DevExtreme licensing here: https://js.devexpress.com/Licensing/
 */

exports.requestAnimationFrame = requestAnimationFrame;
exports.cancelAnimationFrame = cancelAnimationFrame;
var _window = __webpack_require__(/*! ../core/utils/window */ "./node_modules/devextreme/core/utils/window.js");
var _call_once = _interopRequireDefault(__webpack_require__(/*! ../core/utils/call_once */ "./node_modules/devextreme/core/utils/call_once.js"));

function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
        "default": obj
    }
}
var window = (0, _window.hasWindow)() ? (0, _window.getWindow)() : {};
var FRAME_ANIMATION_STEP_TIME = 1e3 / 60;
var request = function(callback) {
    return setTimeout(callback, FRAME_ANIMATION_STEP_TIME)
};
var cancel = function(requestID) {
    clearTimeout(requestID)
};
var setAnimationFrameMethods = (0, _call_once.default)(function() {
    var nativeRequest = window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame || window.oRequestAnimationFrame || window.msRequestAnimationFrame;
    var nativeCancel = window.cancelAnimationFrame || window.webkitCancelAnimationFrame || window.mozCancelAnimationFrame || window.oCancelAnimationFrame || window.msCancelAnimationFrame;
    if (nativeRequest && nativeCancel) {
        request = nativeRequest;
        cancel = nativeCancel
    }
    if (nativeRequest && !nativeCancel) {
        var canceledRequests = {};
        request = function(callback) {
            var requestId = nativeRequest.call(window, function() {
                try {
                    if (requestId in canceledRequests) {
                        return
                    }
                    callback.apply(this, arguments)
                } finally {
                    delete canceledRequests[requestId]
                }
            });
            return requestId
        };
        cancel = function(requestId) {
            canceledRequests[requestId] = true
        }
    }
});

function requestAnimationFrame() {
    setAnimationFrameMethods();
    return request.apply(window, arguments)
}

function cancelAnimationFrame() {
    setAnimationFrameMethods();
    cancel.apply(window, arguments)
}


/***/ }),

/***/ "./node_modules/devextreme/animation/fx.js":
/*!*************************************************!*\
  !*** ./node_modules/devextreme/animation/fx.js ***!
  \*************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/**
 * DevExtreme (animation/fx.js)
 * Version: 20.2.3
 * Build date: Tue Oct 20 2020
 *
 * Copyright (c) 2012 - 2020 Developer Express Inc. ALL RIGHTS RESERVED
 * Read about DevExtreme licensing here: https://js.devexpress.com/Licensing/
 */

exports.default = void 0;
var _renderer = _interopRequireDefault(__webpack_require__(/*! ../core/renderer */ "./node_modules/devextreme/core/renderer.js"));
var _window = __webpack_require__(/*! ../core/utils/window */ "./node_modules/devextreme/core/utils/window.js");
var _events_engine = _interopRequireDefault(__webpack_require__(/*! ../events/core/events_engine */ "./node_modules/devextreme/events/core/events_engine.js"));
var _errors = _interopRequireDefault(__webpack_require__(/*! ../core/errors */ "./node_modules/devextreme/core/errors.js"));
var _element = __webpack_require__(/*! ../core/element */ "./node_modules/devextreme/core/element.js");
var _extend = __webpack_require__(/*! ../core/utils/extend */ "./node_modules/devextreme/core/utils/extend.js");
var _type = __webpack_require__(/*! ../core/utils/type */ "./node_modules/devextreme/core/utils/type.js");
var _iterator = __webpack_require__(/*! ../core/utils/iterator */ "./node_modules/devextreme/core/utils/iterator.js");
var _translator = __webpack_require__(/*! ./translator */ "./node_modules/devextreme/animation/translator.js");
var _easing = __webpack_require__(/*! ./easing */ "./node_modules/devextreme/animation/easing.js");
var _frame = __webpack_require__(/*! ./frame */ "./node_modules/devextreme/animation/frame.js");
var _support = __webpack_require__(/*! ../core/utils/support */ "./node_modules/devextreme/core/utils/support.js");
var _position = _interopRequireDefault(__webpack_require__(/*! ./position */ "./node_modules/devextreme/animation/position.js"));
var _remove_event = _interopRequireDefault(__webpack_require__(/*! ../core/remove_event */ "./node_modules/devextreme/core/remove_event.js"));
var _index = __webpack_require__(/*! ../events/utils/index */ "./node_modules/devextreme/events/utils/index.js");
var _deferred = __webpack_require__(/*! ../core/utils/deferred */ "./node_modules/devextreme/core/utils/deferred.js");
var _common = __webpack_require__(/*! ../core/utils/common */ "./node_modules/devextreme/core/utils/common.js");

function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
        "default": obj
    }
}

function _typeof(obj) {
    "@babel/helpers - typeof";
    if ("function" === typeof Symbol && "symbol" === typeof Symbol.iterator) {
        _typeof = function(obj) {
            return typeof obj
        }
    } else {
        _typeof = function(obj) {
            return obj && "function" === typeof Symbol && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj
        }
    }
    return _typeof(obj)
}
var window = (0, _window.getWindow)();
var removeEventName = (0, _index.addNamespace)(_remove_event.default, "dxFX");
var RELATIVE_VALUE_REGEX = /^([+-])=(.*)/i;
var ANIM_DATA_KEY = "dxAnimData";
var ANIM_QUEUE_KEY = "dxAnimQueue";
var TRANSFORM_PROP = "transform";
var TransitionAnimationStrategy = {
    initAnimation: function($element, config) {
        $element.css({
            transitionProperty: "none"
        });
        if ("string" === typeof config.from) {
            $element.addClass(config.from)
        } else {
            setProps($element, config.from)
        }
        var that = this;
        var deferred = new _deferred.Deferred;
        var cleanupWhen = config.cleanupWhen;
        config.transitionAnimation = {
            deferred: deferred,
            finish: function() {
                that._finishTransition($element);
                if (cleanupWhen) {
                    (0, _deferred.when)(deferred, cleanupWhen).always(function() {
                        that._cleanup($element, config)
                    })
                } else {
                    that._cleanup($element, config)
                }
                deferred.resolveWith($element, [config, $element])
            }
        };
        this._completeAnimationCallback($element, config).done(function() {
            config.transitionAnimation.finish()
        }).fail(function() {
            deferred.rejectWith($element, [config, $element])
        });
        if (!config.duration) {
            config.transitionAnimation.finish()
        }
        $element.css("transform")
    },
    animate: function($element, config) {
        this._startAnimation($element, config);
        return config.transitionAnimation.deferred.promise()
    },
    _completeAnimationCallback: function($element, config) {
        var that = this;
        var startTime = Date.now() + config.delay;
        var deferred = new _deferred.Deferred;
        var transitionEndFired = new _deferred.Deferred;
        var simulatedTransitionEndFired = new _deferred.Deferred;
        var simulatedEndEventTimer;
        var transitionEndEventFullName = (0, _support.transitionEndEventName)() + ".dxFX";
        config.transitionAnimation.cleanup = function() {
            clearTimeout(simulatedEndEventTimer);
            clearTimeout(waitForJSCompleteTimer);
            _events_engine.default.off($element, transitionEndEventFullName);
            _events_engine.default.off($element, removeEventName)
        };
        _events_engine.default.one($element, transitionEndEventFullName, function() {
            if (Date.now() - startTime >= config.duration) {
                transitionEndFired.reject()
            }
        });
        _events_engine.default.off($element, removeEventName);
        _events_engine.default.on($element, removeEventName, function() {
            that.stop($element, config);
            deferred.reject()
        });
        var waitForJSCompleteTimer = setTimeout(function() {
            simulatedEndEventTimer = setTimeout(function() {
                simulatedTransitionEndFired.reject()
            }, config.duration + config.delay + fx._simulatedTransitionEndDelay);
            (0, _deferred.when)(transitionEndFired, simulatedTransitionEndFired).fail(function() {
                deferred.resolve()
            }.bind(this))
        });
        return deferred.promise()
    },
    _startAnimation: function($element, config) {
        $element.css({
            transitionProperty: "all",
            transitionDelay: config.delay + "ms",
            transitionDuration: config.duration + "ms",
            transitionTimingFunction: config.easing
        });
        if ("string" === typeof config.to) {
            $element[0].className += " " + config.to
        } else {
            if (config.to) {
                setProps($element, config.to)
            }
        }
    },
    _finishTransition: function($element) {
        $element.css("transition", "none")
    },
    _cleanup: function($element, config) {
        config.transitionAnimation.cleanup();
        if ("string" === typeof config.from) {
            $element.removeClass(config.from);
            $element.removeClass(config.to)
        }
    },
    stop: function($element, config, jumpToEnd) {
        if (!config) {
            return
        }
        if (jumpToEnd) {
            config.transitionAnimation.finish()
        } else {
            if ((0, _type.isPlainObject)(config.to)) {
                (0, _iterator.each)(config.to, function(key) {
                    $element.css(key, $element.css(key))
                })
            }
            this._finishTransition($element);
            this._cleanup($element, config)
        }
    }
};
var FrameAnimationStrategy = {
    initAnimation: function($element, config) {
        setProps($element, config.from)
    },
    animate: function($element, config) {
        var deferred = new _deferred.Deferred;
        var that = this;
        if (!config) {
            return deferred.reject().promise()
        }(0, _iterator.each)(config.to, function(prop) {
            if (void 0 === config.from[prop]) {
                config.from[prop] = that._normalizeValue($element.css(prop))
            }
        });
        if (config.to[TRANSFORM_PROP]) {
            config.from[TRANSFORM_PROP] = that._parseTransform(config.from[TRANSFORM_PROP]);
            config.to[TRANSFORM_PROP] = that._parseTransform(config.to[TRANSFORM_PROP])
        }
        config.frameAnimation = {
            to: config.to,
            from: config.from,
            currentValue: config.from,
            easing: (0, _easing.convertTransitionTimingFuncToEasing)(config.easing),
            duration: config.duration,
            startTime: (new Date).valueOf(),
            finish: function() {
                this.currentValue = this.to;
                this.draw();
                (0, _frame.cancelAnimationFrame)(config.frameAnimation.animationFrameId);
                deferred.resolve()
            },
            draw: function() {
                if (config.draw) {
                    config.draw(this.currentValue);
                    return
                }
                var currentValue = (0, _extend.extend)({}, this.currentValue);
                if (currentValue[TRANSFORM_PROP]) {
                    currentValue[TRANSFORM_PROP] = (0, _iterator.map)(currentValue[TRANSFORM_PROP], function(value, prop) {
                        if ("translate" === prop) {
                            return (0, _translator.getTranslateCss)(value)
                        } else {
                            if ("scale" === prop) {
                                return "scale(" + value + ")"
                            } else {
                                if ("rotate" === prop.substr(0, prop.length - 1)) {
                                    return prop + "(" + value + "deg)"
                                }
                            }
                        }
                    }).join(" ")
                }
                $element.css(currentValue)
            }
        };
        if (config.delay) {
            config.frameAnimation.startTime += config.delay;
            config.frameAnimation.delayTimeout = setTimeout(function() {
                that._startAnimation($element, config)
            }, config.delay)
        } else {
            that._startAnimation($element, config)
        }
        return deferred.promise()
    },
    _startAnimation: function($element, config) {
        _events_engine.default.off($element, removeEventName);
        _events_engine.default.on($element, removeEventName, function() {
            if (config.frameAnimation) {
                (0, _frame.cancelAnimationFrame)(config.frameAnimation.animationFrameId)
            }
        });
        this._animationStep($element, config)
    },
    _parseTransform: function(transformString) {
        var result = {};
        (0, _iterator.each)(transformString.match(/(\w|\d)+\([^)]*\)\s*/g), function(i, part) {
            var translateData = (0, _translator.parseTranslate)(part);
            var scaleData = part.match(/scale\((.+?)\)/);
            var rotateData = part.match(/(rotate.)\((.+)deg\)/);
            if (translateData) {
                result.translate = translateData
            }
            if (scaleData && scaleData[1]) {
                result.scale = parseFloat(scaleData[1])
            }
            if (rotateData && rotateData[1]) {
                result[rotateData[1]] = parseFloat(rotateData[2])
            }
        });
        return result
    },
    stop: function($element, config, jumpToEnd) {
        var frameAnimation = config && config.frameAnimation;
        if (!frameAnimation) {
            return
        }(0, _frame.cancelAnimationFrame)(frameAnimation.animationFrameId);
        clearTimeout(frameAnimation.delayTimeout);
        if (jumpToEnd) {
            frameAnimation.finish()
        }
        delete config.frameAnimation
    },
    _animationStep: function($element, config) {
        var frameAnimation = config && config.frameAnimation;
        if (!frameAnimation) {
            return
        }
        var now = (new Date).valueOf();
        if (now >= frameAnimation.startTime + frameAnimation.duration) {
            frameAnimation.finish();
            return
        }
        frameAnimation.currentValue = this._calcStepValue(frameAnimation, now - frameAnimation.startTime);
        frameAnimation.draw();
        var that = this;
        frameAnimation.animationFrameId = (0, _frame.requestAnimationFrame)(function() {
            that._animationStep($element, config)
        })
    },
    _calcStepValue: function(frameAnimation, currentDuration) {
        var calcValueRecursively = function calcValueRecursively(from, to) {
            var result = Array.isArray(to) ? [] : {};
            var calcEasedValue = function(propName) {
                var x = currentDuration / frameAnimation.duration;
                var t = currentDuration;
                var b = 1 * from[propName];
                var c = to[propName] - from[propName];
                var d = frameAnimation.duration;
                return (0, _easing.getEasing)(frameAnimation.easing)(x, t, b, c, d)
            };
            (0, _iterator.each)(to, function(propName, endPropValue) {
                if ("string" === typeof endPropValue && false === parseFloat(endPropValue, 10)) {
                    return true
                }
                result[propName] = "object" === _typeof(endPropValue) ? calcValueRecursively(from[propName], endPropValue) : calcEasedValue(propName)
            });
            return result
        };
        return calcValueRecursively(frameAnimation.from, frameAnimation.to)
    },
    _normalizeValue: function(value) {
        var numericValue = parseFloat(value, 10);
        if (false === numericValue) {
            return value
        }
        return numericValue
    }
};
var FallbackToNoAnimationStrategy = {
    initAnimation: function() {},
    animate: function() {
        return (new _deferred.Deferred).resolve().promise()
    },
    stop: _common.noop,
    isSynchronous: true
};
var getAnimationStrategy = function(config) {
    config = config || {};
    var animationStrategies = {
        transition: (0, _support.transition)() ? TransitionAnimationStrategy : FrameAnimationStrategy,
        frame: FrameAnimationStrategy,
        noAnimation: FallbackToNoAnimationStrategy
    };
    var strategy = config.strategy || "transition";
    if ("css" === config.type && !(0, _support.transition)()) {
        strategy = "noAnimation"
    }
    return animationStrategies[strategy]
};
var baseConfigValidator = function(config, animationType, validate, typeMessage) {
    (0, _iterator.each)(["from", "to"], function() {
        if (!validate(config[this])) {
            throw _errors.default.Error("E0010", animationType, this, typeMessage)
        }
    })
};
var isObjectConfigValidator = function(config, animationType) {
    return baseConfigValidator(config, animationType, function(target) {
        return (0, _type.isPlainObject)(target)
    }, "a plain object")
};
var isStringConfigValidator = function(config, animationType) {
    return baseConfigValidator(config, animationType, function(target) {
        return "string" === typeof target
    }, "a string")
};
var CustomAnimationConfigurator = {
    setup: function() {}
};
var CssAnimationConfigurator = {
    validateConfig: function(config) {
        isStringConfigValidator(config, "css")
    },
    setup: function() {}
};
var positionAliases = {
    top: {
        my: "bottom center",
        at: "top center"
    },
    bottom: {
        my: "top center",
        at: "bottom center"
    },
    right: {
        my: "left center",
        at: "right center"
    },
    left: {
        my: "right center",
        at: "left center"
    }
};
var SlideAnimationConfigurator = {
    validateConfig: function(config) {
        isObjectConfigValidator(config, "slide")
    },
    setup: function($element, config) {
        var location = (0, _translator.locate)($element);
        if ("slide" !== config.type) {
            var positioningConfig = "slideIn" === config.type ? config.from : config.to;
            positioningConfig.position = (0, _extend.extend)({
                of: window
            }, positionAliases[config.direction]);
            setupPosition($element, positioningConfig)
        }
        this._setUpConfig(location, config.from);
        this._setUpConfig(location, config.to);
        (0, _translator.clearCache)($element)
    },
    _setUpConfig: function(location, config) {
        config.left = "left" in config ? config.left : "+=0";
        config.top = "top" in config ? config.top : "+=0";
        this._initNewPosition(location, config)
    },
    _initNewPosition: function(location, config) {
        var position = {
            left: config.left,
            top: config.top
        };
        delete config.left;
        delete config.top;
        var relativeValue = this._getRelativeValue(position.left);
        if (void 0 !== relativeValue) {
            position.left = relativeValue + location.left
        } else {
            config.left = 0
        }
        relativeValue = this._getRelativeValue(position.top);
        if (void 0 !== relativeValue) {
            position.top = relativeValue + location.top
        } else {
            config.top = 0
        }
        config[TRANSFORM_PROP] = (0, _translator.getTranslateCss)({
            x: position.left,
            y: position.top
        })
    },
    _getRelativeValue: function(value) {
        var relativeValue;
        if ("string" === typeof value && (relativeValue = RELATIVE_VALUE_REGEX.exec(value))) {
            return parseInt(relativeValue[1] + "1") * relativeValue[2]
        }
    }
};
var FadeAnimationConfigurator = {
    setup: function($element, config) {
        var from = config.from;
        var fromOpacity = (0, _type.isPlainObject)(from) ? config.skipElementInitialStyles ? 0 : $element.css("opacity") : String(from);
        var toOpacity;
        switch (config.type) {
            case "fadeIn":
                toOpacity = 1;
                break;
            case "fadeOut":
                toOpacity = 0;
                break;
            default:
                toOpacity = String(config.to)
        }
        config.from = {
            visibility: "visible",
            opacity: fromOpacity
        };
        config.to = {
            opacity: toOpacity
        }
    }
};
var PopAnimationConfigurator = {
    validateConfig: function(config) {
        isObjectConfigValidator(config, "pop")
    },
    setup: function($element, config) {
        var from = config.from;
        var to = config.to;
        var fromOpacity = "opacity" in from ? from.opacity : $element.css("opacity");
        var toOpacity = "opacity" in to ? to.opacity : 1;
        var fromScale = "scale" in from ? from.scale : 0;
        var toScale = "scale" in to ? to.scale : 1;
        config.from = {
            opacity: fromOpacity
        };
        var translate = (0, _translator.getTranslate)($element);
        config.from[TRANSFORM_PROP] = this._getCssTransform(translate, fromScale);
        config.to = {
            opacity: toOpacity
        };
        config.to[TRANSFORM_PROP] = this._getCssTransform(translate, toScale)
    },
    _getCssTransform: function(translate, scale) {
        return (0, _translator.getTranslateCss)(translate) + "scale(" + scale + ")"
    }
};
var animationConfigurators = {
    custom: CustomAnimationConfigurator,
    slide: SlideAnimationConfigurator,
    slideIn: SlideAnimationConfigurator,
    slideOut: SlideAnimationConfigurator,
    fade: FadeAnimationConfigurator,
    fadeIn: FadeAnimationConfigurator,
    fadeOut: FadeAnimationConfigurator,
    pop: PopAnimationConfigurator,
    css: CssAnimationConfigurator
};
var getAnimationConfigurator = function(config) {
    var result = animationConfigurators[config.type];
    if (!result) {
        throw _errors.default.Error("E0011", config.type)
    }
    return result
};
var defaultJSConfig = {
    type: "custom",
    from: {},
    to: {},
    duration: 400,
    start: _common.noop,
    complete: _common.noop,
    easing: "ease",
    delay: 0
};
var defaultCssConfig = {
    duration: 400,
    easing: "ease",
    delay: 0
};

function setupAnimationOnElement() {
    var animation = this;
    var $element = animation.element;
    var config = animation.config;
    setupPosition($element, config.from);
    setupPosition($element, config.to);
    animation.configurator.setup($element, config);
    $element.data(ANIM_DATA_KEY, animation);
    if (fx.off) {
        config.duration = 0;
        config.delay = 0
    }
    animation.strategy.initAnimation($element, config);
    if (config.start) {
        var element = (0, _element.getPublicElement)($element);
        config.start.apply(this, [element, config])
    }
}
var onElementAnimationComplete = function(animation) {
    var $element = animation.element;
    var config = animation.config;
    $element.removeData(ANIM_DATA_KEY);
    if (config.complete) {
        var element = (0, _element.getPublicElement)($element);
        config.complete.apply(this, [element, config])
    }
    animation.deferred.resolveWith(this, [$element, config])
};
var startAnimationOnElement = function() {
    var animation = this;
    var $element = animation.element;
    var config = animation.config;
    animation.isStarted = true;
    return animation.strategy.animate($element, config).done(function() {
        onElementAnimationComplete(animation)
    }).fail(function() {
        animation.deferred.rejectWith(this, [$element, config])
    })
};
var stopAnimationOnElement = function(jumpToEnd) {
    var animation = this;
    var $element = animation.element;
    var config = animation.config;
    clearTimeout(animation.startTimeout);
    if (!animation.isStarted) {
        animation.start()
    }
    animation.strategy.stop($element, config, jumpToEnd)
};
var scopedRemoveEvent = (0, _index.addNamespace)(_remove_event.default, "dxFXStartAnimation");
var subscribeToRemoveEvent = function(animation) {
    _events_engine.default.off(animation.element, scopedRemoveEvent);
    _events_engine.default.on(animation.element, scopedRemoveEvent, function() {
        fx.stop(animation.element)
    });
    animation.deferred.always(function() {
        _events_engine.default.off(animation.element, scopedRemoveEvent)
    })
};
var createAnimation = function(element, initialConfig) {
    var defaultConfig = "css" === initialConfig.type ? defaultCssConfig : defaultJSConfig;
    var config = (0, _extend.extend)(true, {}, defaultConfig, initialConfig);
    var configurator = getAnimationConfigurator(config);
    var strategy = getAnimationStrategy(config);
    var animation = {
        element: (0, _renderer.default)(element),
        config: config,
        configurator: configurator,
        strategy: strategy,
        isSynchronous: strategy.isSynchronous,
        setup: setupAnimationOnElement,
        start: startAnimationOnElement,
        stop: stopAnimationOnElement,
        deferred: new _deferred.Deferred
    };
    if ((0, _type.isFunction)(configurator.validateConfig)) {
        configurator.validateConfig(config)
    }
    subscribeToRemoveEvent(animation);
    return animation
};
var animate = function(element, config) {
    var $element = (0, _renderer.default)(element);
    if (!$element.length) {
        return (new _deferred.Deferred).resolve().promise()
    }
    var animation = createAnimation($element, config);
    pushInAnimationQueue($element, animation);
    return animation.deferred.promise()
};

function pushInAnimationQueue($element, animation) {
    var queueData = getAnimQueueData($element);
    writeAnimQueueData($element, queueData);
    queueData.push(animation);
    if (!isAnimating($element)) {
        shiftFromAnimationQueue($element, queueData)
    }
}

function getAnimQueueData($element) {
    return $element.data(ANIM_QUEUE_KEY) || []
}

function writeAnimQueueData($element, queueData) {
    $element.data(ANIM_QUEUE_KEY, queueData)
}
var destroyAnimQueueData = function($element) {
    $element.removeData(ANIM_QUEUE_KEY)
};

function isAnimating($element) {
    return !!$element.data(ANIM_DATA_KEY)
}

function shiftFromAnimationQueue($element, queueData) {
    queueData = getAnimQueueData($element);
    if (!queueData.length) {
        return
    }
    var animation = queueData.shift();
    if (0 === queueData.length) {
        destroyAnimQueueData($element)
    }
    executeAnimation(animation).done(function() {
        if (!isAnimating($element)) {
            shiftFromAnimationQueue($element)
        }
    })
}

function executeAnimation(animation) {
    animation.setup();
    if (fx.off || animation.isSynchronous) {
        animation.start()
    } else {
        animation.startTimeout = setTimeout(function() {
            animation.start()
        })
    }
    return animation.deferred.promise()
}

function setupPosition($element, config) {
    if (!config || !config.position) {
        return
    }
    var win = (0, _renderer.default)(window);
    var left = 0;
    var top = 0;
    var position = _position.default.calculate($element, config.position);
    var offset = $element.offset();
    var currentPosition = $element.position();
    if (currentPosition.top > offset.top) {
        top = win.scrollTop()
    }
    if (currentPosition.left > offset.left) {
        left = win.scrollLeft()
    }(0, _extend.extend)(config, {
        left: position.h.location - offset.left + currentPosition.left - left,
        top: position.v.location - offset.top + currentPosition.top - top
    });
    delete config.position
}

function setProps($element, props) {
    (0, _iterator.each)(props, function(key, value) {
        try {
            $element.css(key, (0, _type.isFunction)(value) ? value() : value)
        } catch (e) {}
    })
}
var stop = function(element, jumpToEnd) {
    var $element = (0, _renderer.default)(element);
    var queueData = getAnimQueueData($element);
    (0, _iterator.each)(queueData, function(_, animation) {
        animation.config.delay = 0;
        animation.config.duration = 0;
        animation.isSynchronous = true
    });
    if (!isAnimating($element)) {
        shiftFromAnimationQueue($element, queueData)
    }
    var animation = $element.data(ANIM_DATA_KEY);
    if (animation) {
        animation.stop(jumpToEnd)
    }
    $element.removeData(ANIM_DATA_KEY);
    destroyAnimQueueData($element)
};
var fx = {
    off: false,
    animationTypes: animationConfigurators,
    animate: animate,
    createAnimation: createAnimation,
    isAnimating: isAnimating,
    stop: stop,
    _simulatedTransitionEndDelay: 100
};
var _default = fx;
exports.default = _default;
module.exports = exports.default;
module.exports.default = module.exports;


/***/ }),

/***/ "./node_modules/devextreme/animation/position.js":
/*!*******************************************************!*\
  !*** ./node_modules/devextreme/animation/position.js ***!
  \*******************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/**
 * DevExtreme (animation/position.js)
 * Version: 20.2.3
 * Build date: Tue Oct 20 2020
 *
 * Copyright (c) 2012 - 2020 Developer Express Inc. ALL RIGHTS RESERVED
 * Read about DevExtreme licensing here: https://js.devexpress.com/Licensing/
 */

exports.default = void 0;
var _renderer = _interopRequireDefault(__webpack_require__(/*! ../core/renderer */ "./node_modules/devextreme/core/renderer.js"));
var _common = __webpack_require__(/*! ../core/utils/common */ "./node_modules/devextreme/core/utils/common.js");
var _iterator = __webpack_require__(/*! ../core/utils/iterator */ "./node_modules/devextreme/core/utils/iterator.js");
var _window = __webpack_require__(/*! ../core/utils/window */ "./node_modules/devextreme/core/utils/window.js");
var _dom_adapter = _interopRequireDefault(__webpack_require__(/*! ../core/dom_adapter */ "./node_modules/devextreme/core/dom_adapter.js"));
var _type = __webpack_require__(/*! ../core/utils/type */ "./node_modules/devextreme/core/utils/type.js");
var _extend = __webpack_require__(/*! ../core/utils/extend */ "./node_modules/devextreme/core/utils/extend.js");
var _position = __webpack_require__(/*! ../core/utils/position */ "./node_modules/devextreme/core/utils/position.js");
var _browser = _interopRequireDefault(__webpack_require__(/*! ../core/utils/browser */ "./node_modules/devextreme/core/utils/browser.js"));
var _translator = __webpack_require__(/*! ./translator */ "./node_modules/devextreme/animation/translator.js");
var _support = __webpack_require__(/*! ../core/utils/support */ "./node_modules/devextreme/core/utils/support.js");
var _devices = _interopRequireDefault(__webpack_require__(/*! ../core/devices */ "./node_modules/devextreme/core/devices.js"));

function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
        "default": obj
    }
}
var window = (0, _window.getWindow)();
var horzRe = /left|right/;
var vertRe = /top|bottom/;
var collisionRe = /fit|flip|none/;
var IS_SAFARI = _browser.default.safari;
var normalizeAlign = function(raw) {
    var result = {
        h: "center",
        v: "center"
    };
    var pair = (0, _common.splitPair)(raw);
    if (pair) {
        (0, _iterator.each)(pair, function() {
            var w = String(this).toLowerCase();
            if (horzRe.test(w)) {
                result.h = w
            } else {
                if (vertRe.test(w)) {
                    result.v = w
                }
            }
        })
    }
    return result
};
var normalizeOffset = function(raw) {
    return (0, _common.pairToObject)(raw)
};
var normalizeCollision = function(raw) {
    var pair = (0, _common.splitPair)(raw);
    var h = String(pair && pair[0]).toLowerCase();
    var v = String(pair && pair[1]).toLowerCase();
    if (!collisionRe.test(h)) {
        h = "none"
    }
    if (!collisionRe.test(v)) {
        v = h
    }
    return {
        h: h,
        v: v
    }
};
var getAlignFactor = function(align) {
    switch (align) {
        case "center":
            return .5;
        case "right":
        case "bottom":
            return 1;
        default:
            return 0
    }
};
var inverseAlign = function(align) {
    switch (align) {
        case "left":
            return "right";
        case "right":
            return "left";
        case "top":
            return "bottom";
        case "bottom":
            return "top";
        default:
            return align
    }
};
var calculateOversize = function(data, bounds) {
    var oversize = 0;
    if (data.myLocation < bounds.min) {
        oversize += bounds.min - data.myLocation
    }
    if (data.myLocation > bounds.max) {
        oversize += data.myLocation - bounds.max
    }
    return oversize
};
var collisionSide = function(direction, data, bounds) {
    if (data.myLocation < bounds.min) {
        return "h" === direction ? "left" : "top"
    }
    if (data.myLocation > bounds.max) {
        return "h" === direction ? "right" : "bottom"
    }
    return "none"
};
var initMyLocation = function(data) {
    data.myLocation = data.atLocation + getAlignFactor(data.atAlign) * data.atSize - getAlignFactor(data.myAlign) * data.mySize + data.offset
};
var collisionResolvers = {
    fit: function(data, bounds) {
        var result = false;
        if (data.myLocation > bounds.max) {
            data.myLocation = bounds.max;
            result = true
        }
        if (data.myLocation < bounds.min) {
            data.myLocation = bounds.min;
            result = true
        }
        data.fit = result
    },
    flip: function(data, bounds) {
        data.flip = false;
        if ("center" === data.myAlign && "center" === data.atAlign) {
            return
        }
        if (data.myLocation < bounds.min || data.myLocation > bounds.max) {
            var inverseData = (0, _extend.extend)({}, data, {
                myAlign: inverseAlign(data.myAlign),
                atAlign: inverseAlign(data.atAlign),
                offset: -data.offset
            });
            initMyLocation(inverseData);
            inverseData.oversize = calculateOversize(inverseData, bounds);
            if (inverseData.myLocation >= bounds.min && inverseData.myLocation <= bounds.max || data.oversize > inverseData.oversize) {
                data.myLocation = inverseData.myLocation;
                data.oversize = inverseData.oversize;
                data.flip = true
            }
        }
    },
    flipfit: function(data, bounds) {
        this.flip(data, bounds);
        this.fit(data, bounds)
    },
    none: function(data) {
        data.oversize = 0
    }
};
var scrollbarWidth;
var calculateScrollbarWidth = function() {
    var $scrollDiv = (0, _renderer.default)("<div>").css({
        width: 100,
        height: 100,
        overflow: "scroll",
        position: "absolute",
        top: -9999
    }).appendTo((0, _renderer.default)("body"));
    var result = $scrollDiv.get(0).offsetWidth - $scrollDiv.get(0).clientWidth;
    $scrollDiv.remove();
    scrollbarWidth = result
};
var defaultPositionResult = {
    h: {
        location: 0,
        flip: false,
        fit: false,
        oversize: 0
    },
    v: {
        location: 0,
        flip: false,
        fit: false,
        oversize: 0
    }
};
var calculatePosition = function(what, options) {
    var $what = (0, _renderer.default)(what);
    var currentOffset = $what.offset();
    var result = (0, _extend.extend)(true, {}, defaultPositionResult, {
        h: {
            location: currentOffset.left
        },
        v: {
            location: currentOffset.top
        }
    });
    if (!options) {
        return result
    }
    var my = normalizeAlign(options.my);
    var at = normalizeAlign(options.at);
    var of = (0, _renderer.default)(options.of).length && options.of || window;
    var offset = normalizeOffset(options.offset);
    var collision = normalizeCollision(options.collision);
    var boundary = options.boundary;
    var boundaryOffset = normalizeOffset(options.boundaryOffset);
    var h = {
        mySize: $what.outerWidth(),
        myAlign: my.h,
        atAlign: at.h,
        offset: offset.h,
        collision: collision.h,
        boundaryOffset: boundaryOffset.h
    };
    var v = {
        mySize: $what.outerHeight(),
        myAlign: my.v,
        atAlign: at.v,
        offset: offset.v,
        collision: collision.v,
        boundaryOffset: boundaryOffset.v
    };
    if ( of .preventDefault) {
        h.atLocation = of .pageX;
        v.atLocation = of .pageY;
        h.atSize = 0;
        v.atSize = 0
    } else {
        of = (0, _renderer.default)( of );
        if ((0, _type.isWindow)( of [0])) {
            h.atLocation = of .scrollLeft();
            v.atLocation = of .scrollTop();
            if ("phone" === _devices.default.real().deviceType && of [0].visualViewport) {
                h.atLocation = Math.max(h.atLocation, of [0].visualViewport.offsetLeft);
                v.atLocation = Math.max(v.atLocation, of [0].visualViewport.offsetTop);
                h.atSize = of [0].visualViewport.width;
                v.atSize = of [0].visualViewport.height
            } else {
                h.atSize = of [0].innerWidth >= of [0].outerWidth ? of [0].innerWidth : of .width();
                v.atSize = of [0].innerHeight >= of [0].outerHeight || IS_SAFARI ? of [0].innerHeight : of .height()
            }
        } else {
            if (9 === of [0].nodeType) {
                h.atLocation = 0;
                v.atLocation = 0;
                h.atSize = of .width();
                v.atSize = of .height()
            } else {
                var ofRect = (0, _position.getBoundingRect)( of .get(0));
                var o = getOffsetWithoutScale( of );
                h.atLocation = o.left;
                v.atLocation = o.top;
                h.atSize = Math.max(ofRect.width, of .outerWidth());
                v.atSize = Math.max(ofRect.height, of .outerHeight())
            }
        }
    }
    initMyLocation(h);
    initMyLocation(v);
    var bounds = function() {
        var win = (0, _renderer.default)(window);
        var windowWidth = win.width();
        var windowHeight = win.height();
        var left = win.scrollLeft();
        var top = win.scrollTop();
        var documentElement = _dom_adapter.default.getDocumentElement();
        var hZoomLevel = _support.touch ? documentElement.clientWidth / windowWidth : 1;
        var vZoomLevel = _support.touch ? documentElement.clientHeight / windowHeight : 1;
        if (void 0 === scrollbarWidth) {
            calculateScrollbarWidth()
        }
        var boundaryWidth = windowWidth;
        var boundaryHeight = windowHeight;
        if (boundary) {
            var $boundary = (0, _renderer.default)(boundary);
            var boundaryPosition = $boundary.offset();
            left = boundaryPosition.left;
            top = boundaryPosition.top;
            boundaryWidth = $boundary.width();
            boundaryHeight = $boundary.height()
        }
        return {
            h: {
                min: left + h.boundaryOffset,
                max: left + boundaryWidth / hZoomLevel - h.mySize - h.boundaryOffset
            },
            v: {
                min: top + v.boundaryOffset,
                max: top + boundaryHeight / vZoomLevel - v.mySize - v.boundaryOffset
            }
        }
    }();
    h.oversize = calculateOversize(h, bounds.h);
    v.oversize = calculateOversize(v, bounds.v);
    h.collisionSide = collisionSide("h", h, bounds.h);
    v.collisionSide = collisionSide("v", v, bounds.v);
    if (collisionResolvers[h.collision]) {
        collisionResolvers[h.collision](h, bounds.h)
    }
    if (collisionResolvers[v.collision]) {
        collisionResolvers[v.collision](v, bounds.v)
    }
    var preciser = function(number) {
        return options.precise ? number : Math.round(number)
    };
    (0, _extend.extend)(true, result, {
        h: {
            location: preciser(h.myLocation),
            oversize: preciser(h.oversize),
            fit: h.fit,
            flip: h.flip,
            collisionSide: h.collisionSide
        },
        v: {
            location: preciser(v.myLocation),
            oversize: preciser(v.oversize),
            fit: v.fit,
            flip: v.flip,
            collisionSide: v.collisionSide
        },
        precise: options.precise
    });
    return result
};
var getOffsetWithoutScale = function getOffsetWithoutScale($startElement) {
    var $currentElement = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : $startElement;
    var currentElement = $currentElement.get(0);
    if (!currentElement || $currentElement.is("body")) {
        return $startElement.offset()
    }
    var transform = $currentElement.get(0).style.transform;
    var scale = (transform.match(/scale(.+)/) || [])[0];
    currentElement.style.transform = transform.replace(scale, "");
    var offset = getOffsetWithoutScale($startElement, $currentElement.parent());
    currentElement.style.transform = transform;
    return offset
};
var position = function(what, options) {
    var $what = (0, _renderer.default)(what);
    if (!options) {
        return $what.offset()
    }(0, _translator.resetPosition)($what, true);
    var offset = getOffsetWithoutScale($what);
    var targetPosition = options.h && options.v ? options : calculatePosition($what, options);
    var preciser = function(number) {
        return options.precise ? number : Math.round(number)
    };
    (0, _translator.move)($what, {
        left: targetPosition.h.location - preciser(offset.left),
        top: targetPosition.v.location - preciser(offset.top)
    });
    return targetPosition
};
var offset = function(element) {
    element = (0, _renderer.default)(element).get(0);
    if ((0, _type.isWindow)(element)) {
        return null
    } else {
        if (element && "pageY" in element && "pageX" in element) {
            return {
                top: element.pageY,
                left: element.pageX
            }
        }
    }
    return (0, _renderer.default)(element).offset()
};
if (!position.inverseAlign) {
    position.inverseAlign = inverseAlign
}
if (!position.normalizeAlign) {
    position.normalizeAlign = normalizeAlign
}
var _default = {
    calculateScrollbarWidth: calculateScrollbarWidth,
    calculate: calculatePosition,
    setup: position,
    offset: offset
};
exports.default = _default;
module.exports = exports.default;


/***/ }),

/***/ "./node_modules/devextreme/animation/translator.js":
/*!*********************************************************!*\
  !*** ./node_modules/devextreme/animation/translator.js ***!
  \*********************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/**
 * DevExtreme (animation/translator.js)
 * Version: 20.2.3
 * Build date: Tue Oct 20 2020
 *
 * Copyright (c) 2012 - 2020 Developer Express Inc. ALL RIGHTS RESERVED
 * Read about DevExtreme licensing here: https://js.devexpress.com/Licensing/
 */

exports.parseTranslate = exports.resetPosition = exports.move = exports.getTranslate = exports.getTranslateCss = exports.clearCache = exports.locate = void 0;
var _element_data = __webpack_require__(/*! ../core/element_data */ "./node_modules/devextreme/core/element_data.js");
var _type = __webpack_require__(/*! ../core/utils/type */ "./node_modules/devextreme/core/utils/type.js");
var TRANSLATOR_DATA_KEY = "dxTranslator";
var TRANSFORM_MATRIX_REGEX = /matrix(3d)?\((.+?)\)/;
var TRANSLATE_REGEX = /translate(?:3d)?\((.+?)\)/;
var locate = function($element) {
    var translate = getTranslate($element);
    return {
        left: translate.x,
        top: translate.y
    }
};
exports.locate = locate;

function isPercentValue(value) {
    return "string" === (0, _type.type)(value) && "%" === value[value.length - 1]
}

function cacheTranslate($element, translate) {
    if ($element.length) {
        (0, _element_data.data)($element.get(0), TRANSLATOR_DATA_KEY, translate)
    }
}
var clearCache = function($element) {
    if ($element.length) {
        (0, _element_data.removeData)($element.get(0), TRANSLATOR_DATA_KEY)
    }
};
exports.clearCache = clearCache;
var getTranslateCss = function(translate) {
    translate.x = translate.x || 0;
    translate.y = translate.y || 0;
    var xValueString = isPercentValue(translate.x) ? translate.x : translate.x + "px";
    var yValueString = isPercentValue(translate.y) ? translate.y : translate.y + "px";
    return "translate(" + xValueString + ", " + yValueString + ")"
};
exports.getTranslateCss = getTranslateCss;
var getTranslate = function($element) {
    var result = $element.length ? (0, _element_data.data)($element.get(0), TRANSLATOR_DATA_KEY) : null;
    if (!result) {
        var transformValue = $element.css("transform") || getTranslateCss({
            x: 0,
            y: 0
        });
        var matrix = transformValue.match(TRANSFORM_MATRIX_REGEX);
        var is3D = matrix && matrix[1];
        if (matrix) {
            matrix = matrix[2].split(",");
            if ("3d" === is3D) {
                matrix = matrix.slice(12, 15)
            } else {
                matrix.push(0);
                matrix = matrix.slice(4, 7)
            }
        } else {
            matrix = [0, 0, 0]
        }
        result = {
            x: parseFloat(matrix[0]),
            y: parseFloat(matrix[1]),
            z: parseFloat(matrix[2])
        };
        cacheTranslate($element, result)
    }
    return result
};
exports.getTranslate = getTranslate;
var move = function($element, position) {
    var left = position.left;
    var top = position.top;
    var translate;
    if (void 0 === left) {
        translate = getTranslate($element);
        translate.y = top || 0
    } else {
        if (void 0 === top) {
            translate = getTranslate($element);
            translate.x = left || 0
        } else {
            translate = {
                x: left || 0,
                y: top || 0,
                z: 0
            };
            cacheTranslate($element, translate)
        }
    }
    $element.css({
        transform: getTranslateCss(translate)
    });
    if (isPercentValue(left) || isPercentValue(top)) {
        clearCache($element)
    }
};
exports.move = move;
var resetPosition = function($element, finishTransition) {
    var originalTransition;
    var stylesConfig = {
        left: 0,
        top: 0,
        transform: "none"
    };
    if (finishTransition) {
        originalTransition = $element.css("transition");
        stylesConfig.transition = "none"
    }
    $element.css(stylesConfig);
    clearCache($element);
    if (finishTransition) {
        $element.get(0).offsetHeight;
        $element.css("transition", originalTransition)
    }
};
exports.resetPosition = resetPosition;
var parseTranslate = function(translateString) {
    var result = translateString.match(TRANSLATE_REGEX);
    if (!result || !result[1]) {
        return
    }
    result = result[1].split(",");
    result = {
        x: parseFloat(result[0]),
        y: parseFloat(result[1]),
        z: parseFloat(result[2])
    };
    return result
};
exports.parseTranslate = parseTranslate;


/***/ }),

/***/ "./node_modules/devextreme/core/action.js":
/*!************************************************!*\
  !*** ./node_modules/devextreme/core/action.js ***!
  \************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/**
 * DevExtreme (core/action.js)
 * Version: 20.2.3
 * Build date: Tue Oct 20 2020
 *
 * Copyright (c) 2012 - 2020 Developer Express Inc. ALL RIGHTS RESERVED
 * Read about DevExtreme licensing here: https://js.devexpress.com/Licensing/
 */

exports.default = void 0;
var _renderer = _interopRequireDefault(__webpack_require__(/*! ./renderer */ "./node_modules/devextreme/core/renderer.js"));
var _window = __webpack_require__(/*! ./utils/window */ "./node_modules/devextreme/core/utils/window.js");
var _type = __webpack_require__(/*! ./utils/type */ "./node_modules/devextreme/core/utils/type.js");
var _iterator = __webpack_require__(/*! ./utils/iterator */ "./node_modules/devextreme/core/utils/iterator.js");

function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
        "default": obj
    }
}

function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
        throw new TypeError("Cannot call a class as a function")
    }
}

function _defineProperties(target, props) {
    for (var i = 0; i < props.length; i++) {
        var descriptor = props[i];
        descriptor.enumerable = descriptor.enumerable || false;
        descriptor.configurable = true;
        if ("value" in descriptor) {
            descriptor.writable = true
        }
        Object.defineProperty(target, descriptor.key, descriptor)
    }
}

function _createClass(Constructor, protoProps, staticProps) {
    if (protoProps) {
        _defineProperties(Constructor.prototype, protoProps)
    }
    if (staticProps) {
        _defineProperties(Constructor, staticProps)
    }
    return Constructor
}
var Action = function() {
    function Action(action, config) {
        _classCallCheck(this, Action);
        config = config || {};
        this._action = action;
        this._context = config.context || (0, _window.getWindow)();
        this._beforeExecute = config.beforeExecute;
        this._afterExecute = config.afterExecute;
        this._component = config.component;
        this._validatingTargetName = config.validatingTargetName;
        var excludeValidators = this._excludeValidators = {};
        if (config.excludeValidators) {
            for (var i = 0; i < config.excludeValidators.length; i++) {
                excludeValidators[config.excludeValidators[i]] = true
            }
        }
    }
    _createClass(Action, [{
        key: "execute",
        value: function() {
            var e = {
                action: this._action,
                args: Array.prototype.slice.call(arguments),
                context: this._context,
                component: this._component,
                validatingTargetName: this._validatingTargetName,
                cancel: false,
                handled: false
            };
            var beforeExecute = this._beforeExecute;
            var afterExecute = this._afterExecute;
            var argsBag = e.args[0] || {};
            if (!this._validateAction(e)) {
                return
            }
            null === beforeExecute || void 0 === beforeExecute ? void 0 : beforeExecute.call(this._context, e);
            if (e.cancel) {
                return
            }
            var result = this._executeAction(e);
            if (argsBag.cancel) {
                return
            }
            null === afterExecute || void 0 === afterExecute ? void 0 : afterExecute.call(this._context, e);
            return result
        }
    }, {
        key: "_validateAction",
        value: function(e) {
            var excludeValidators = this._excludeValidators;
            var executors = Action.executors;
            for (var name in executors) {
                if (!excludeValidators[name]) {
                    var _executor$validate;
                    var executor = executors[name];
                    null === (_executor$validate = executor.validate) || void 0 === _executor$validate ? void 0 : _executor$validate.call(executor, e);
                    if (e.cancel) {
                        return false
                    }
                }
            }
            return true
        }
    }, {
        key: "_executeAction",
        value: function(e) {
            var result;
            var executors = Action.executors;
            for (var name in executors) {
                var _executor$execute;
                var executor = executors[name];
                null === (_executor$execute = executor.execute) || void 0 === _executor$execute ? void 0 : _executor$execute.call(executor, e);
                if (e.handled) {
                    result = e.result;
                    break
                }
            }
            return result
        }
    }], [{
        key: "registerExecutor",
        value: function(name, executor) {
            if ((0, _type.isPlainObject)(name)) {
                (0, _iterator.each)(name, Action.registerExecutor);
                return
            }
            Action.executors[name] = executor
        }
    }, {
        key: "unregisterExecutor",
        value: function() {
            for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
                args[_key] = arguments[_key]
            }(0, _iterator.each)(args, function() {
                delete Action.executors[this]
            })
        }
    }]);
    return Action
}();
exports.default = Action;
Action.executors = {};
var createValidatorByTargetElement = function(condition) {
    return function(e) {
        if (!e.args.length) {
            return
        }
        var args = e.args[0];
        var element = args[e.validatingTargetName] || args.element;
        if (element && condition((0, _renderer.default)(element))) {
            e.cancel = true
        }
    }
};
Action.registerExecutor({
    disabled: {
        validate: createValidatorByTargetElement(function($target) {
            return $target.is(".dx-state-disabled, .dx-state-disabled *")
        })
    },
    readOnly: {
        validate: createValidatorByTargetElement(function($target) {
            return $target.is(".dx-state-readonly, .dx-state-readonly *:not(.dx-state-independent)")
        })
    },
    undefined: {
        execute: function(e) {
            if (!e.action) {
                e.result = void 0;
                e.handled = true
            }
        }
    },
    func: {
        execute: function(e) {
            if ((0, _type.isFunction)(e.action)) {
                e.result = e.action.call(e.context, e.args[0]);
                e.handled = true
            }
        }
    }
});
module.exports = exports.default;


/***/ }),

/***/ "./node_modules/devextreme/core/class.js":
/*!***********************************************!*\
  !*** ./node_modules/devextreme/core/class.js ***!
  \***********************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/**
 * DevExtreme (core/class.js)
 * Version: 20.2.3
 * Build date: Tue Oct 20 2020
 *
 * Copyright (c) 2012 - 2020 Developer Express Inc. ALL RIGHTS RESERVED
 * Read about DevExtreme licensing here: https://js.devexpress.com/Licensing/
 */

exports.default = void 0;
var _errors = _interopRequireDefault(__webpack_require__(/*! ./errors */ "./node_modules/devextreme/core/errors.js"));
var _type = __webpack_require__(/*! ./utils/type */ "./node_modules/devextreme/core/utils/type.js");

function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
        "default": obj
    }
}
var wrapOverridden = function(baseProto, methodName, method) {
    return function() {
        var prevCallBase = this.callBase;
        this.callBase = baseProto[methodName];
        try {
            return method.apply(this, arguments)
        } finally {
            this.callBase = prevCallBase
        }
    }
};
var clonePrototype = function(obj) {
    var func = function() {};
    func.prototype = obj.prototype;
    return new func
};
var redefine = function(members) {
    var that = this;
    var overridden;
    var memberName;
    var member;
    if (!members) {
        return that
    }
    for (memberName in members) {
        member = members[memberName];
        overridden = "function" === typeof that.prototype[memberName] && "function" === typeof member;
        that.prototype[memberName] = overridden ? wrapOverridden(that.parent.prototype, memberName, member) : member
    }
    return that
};
var include = function() {
    var classObj = this;
    var argument;
    var name;
    var i;
    var hasClassObjOwnProperty = Object.prototype.hasOwnProperty.bind(classObj);
    var isES6Class = !hasClassObjOwnProperty("_includedCtors") && !hasClassObjOwnProperty("_includedPostCtors");
    if (isES6Class) {
        classObj._includedCtors = classObj._includedCtors.slice(0);
        classObj._includedPostCtors = classObj._includedPostCtors.slice(0)
    }
    for (i = 0; i < arguments.length; i++) {
        argument = arguments[i];
        if (argument.ctor) {
            classObj._includedCtors.push(argument.ctor)
        }
        if (argument.postCtor) {
            classObj._includedPostCtors.push(argument.postCtor)
        }
        for (name in argument) {
            if ("ctor" === name || "postCtor" === name) {
                continue
            }
            classObj.prototype[name] = argument[name]
        }
    }
    return classObj
};
var subclassOf = function(parentClass) {
    var hasParentProperty = Object.prototype.hasOwnProperty.bind(this)("parent");
    var isES6Class = !hasParentProperty && this.parent;
    if (isES6Class) {
        var baseClass = Object.getPrototypeOf(this);
        return baseClass === parentClass || baseClass.subclassOf(parentClass)
    } else {
        if (this.parent === parentClass) {
            return true
        }
        if (!this.parent || !this.parent.subclassOf) {
            return false
        }
        return this.parent.subclassOf(parentClass)
    }
};
var abstract = function() {
    throw _errors.default.Error("E0001")
};
var copyStatic = function() {
    var hasOwn = Object.prototype.hasOwnProperty;
    return function(source, destination) {
        for (var key in source) {
            if (!hasOwn.call(source, key)) {
                return
            }
            destination[key] = source[key]
        }
    }
}();
var classImpl = function() {};
classImpl.inherit = function(members) {
    var inheritor = function() {
        if (!this || (0, _type.isWindow)(this) || "function" !== typeof this.constructor) {
            throw _errors.default.Error("E0003")
        }
        var instance = this;
        var ctor = instance.ctor;
        var includedCtors = instance.constructor._includedCtors;
        var includedPostCtors = instance.constructor._includedPostCtors;
        var i;
        for (i = 0; i < includedCtors.length; i++) {
            includedCtors[i].call(instance)
        }
        if (ctor) {
            ctor.apply(instance, arguments)
        }
        for (i = 0; i < includedPostCtors.length; i++) {
            includedPostCtors[i].call(instance)
        }
    };
    inheritor.prototype = clonePrototype(this);
    copyStatic(this, inheritor);
    inheritor.inherit = this.inherit;
    inheritor.abstract = abstract;
    inheritor.redefine = redefine;
    inheritor.include = include;
    inheritor.subclassOf = subclassOf;
    inheritor.parent = this;
    inheritor._includedCtors = this._includedCtors ? this._includedCtors.slice(0) : [];
    inheritor._includedPostCtors = this._includedPostCtors ? this._includedPostCtors.slice(0) : [];
    inheritor.prototype.constructor = inheritor;
    inheritor.redefine(members);
    return inheritor
};
classImpl.abstract = abstract;
var _default = classImpl;
exports.default = _default;
module.exports = exports.default;


/***/ }),

/***/ "./node_modules/devextreme/core/component.js":
/*!***************************************************!*\
  !*** ./node_modules/devextreme/core/component.js ***!
  \***************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/**
 * DevExtreme (core/component.js)
 * Version: 20.2.3
 * Build date: Tue Oct 20 2020
 *
 * Copyright (c) 2012 - 2020 Developer Express Inc. ALL RIGHTS RESERVED
 * Read about DevExtreme licensing here: https://js.devexpress.com/Licensing/
 */

exports.default = void 0;
var _config = _interopRequireDefault(__webpack_require__(/*! ./config */ "./node_modules/devextreme/core/config.js"));
var _extend = __webpack_require__(/*! ./utils/extend */ "./node_modules/devextreme/core/utils/extend.js");
var _index = __webpack_require__(/*! ./options/index */ "./node_modules/devextreme/core/options/index.js");
var _utils = __webpack_require__(/*! ./options/utils */ "./node_modules/devextreme/core/options/utils.js");
var _class = _interopRequireDefault(__webpack_require__(/*! ./class */ "./node_modules/devextreme/core/class.js"));
var _action = _interopRequireDefault(__webpack_require__(/*! ./action */ "./node_modules/devextreme/core/action.js"));
var _errors = _interopRequireDefault(__webpack_require__(/*! ./errors */ "./node_modules/devextreme/core/errors.js"));
var _callbacks = _interopRequireDefault(__webpack_require__(/*! ./utils/callbacks */ "./node_modules/devextreme/core/utils/callbacks.js"));
var _events_strategy = __webpack_require__(/*! ./events_strategy */ "./node_modules/devextreme/core/events_strategy.js");
var _public_component = __webpack_require__(/*! ./utils/public_component */ "./node_modules/devextreme/core/utils/public_component.js");
var _postponed_operations = __webpack_require__(/*! ./postponed_operations */ "./node_modules/devextreme/core/postponed_operations.js");
var _type = __webpack_require__(/*! ./utils/type */ "./node_modules/devextreme/core/utils/type.js");
var _common = __webpack_require__(/*! ./utils/common */ "./node_modules/devextreme/core/utils/common.js");

function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
        "default": obj
    }
}
var getEventName = function(actionName) {
    return actionName.charAt(2).toLowerCase() + actionName.substr(3)
};
var isInnerOption = function(optionName) {
    return 0 === optionName.indexOf("_", 0)
};
var Component = _class.default.inherit({
    _setDeprecatedOptions: function() {
        this._deprecatedOptions = {}
    },
    _getDeprecatedOptions: function() {
        return this._deprecatedOptions
    },
    _getDefaultOptions: function() {
        return {
            onInitialized: null,
            onOptionChanged: null,
            onDisposing: null,
            defaultOptionsRules: null
        }
    },
    _defaultOptionsRules: function() {
        return []
    },
    _setOptionsByDevice: function(rules) {
        this._options.applyRules(rules)
    },
    _convertRulesToOptions: function(rules) {
        return (0, _utils.convertRulesToOptions)(rules)
    },
    _isInitialOptionValue: function(name) {
        return this._options.isInitial(name)
    },
    _setOptionsByReference: function() {
        this._optionsByReference = {}
    },
    _getOptionsByReference: function() {
        return this._optionsByReference
    },
    ctor: function() {
        var options = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : {};
        var _optionChangedCallbacks = options._optionChangedCallbacks,
            _disposingCallbacks = options._disposingCallbacks;
        this.NAME = (0, _public_component.name)(this.constructor);
        this._eventsStrategy = _events_strategy.EventsStrategy.create(this, options.eventsStrategy);
        this._updateLockCount = 0;
        this._optionChangedCallbacks = _optionChangedCallbacks || (0, _callbacks.default)();
        this._disposingCallbacks = _disposingCallbacks || (0, _callbacks.default)();
        this.postponedOperations = new _postponed_operations.PostponedOperations;
        this._createOptions(options)
    },
    _createOptions: function(options) {
        var _this = this;
        this.beginUpdate();
        try {
            this._setOptionsByReference();
            this._setDeprecatedOptions();
            this._options = new _index.Options(this._getDefaultOptions(), this._getDefaultOptions(), this._getOptionsByReference(), this._getDeprecatedOptions());
            this._options.onChanging(function(name, previousValue, value) {
                return _this._initialized && _this._optionChanging(name, previousValue, value)
            });
            this._options.onDeprecated(function(option, info) {
                return _this._logDeprecatedOptionWarning(option, info)
            });
            this._options.onChanged(function(name, value, previousValue) {
                return _this._notifyOptionChanged(name, value, previousValue)
            });
            this._options.onStartChange(function() {
                return _this.beginUpdate()
            });
            this._options.onEndChange(function() {
                return _this.endUpdate()
            });
            this._options.addRules(this._defaultOptionsRules());
            if (options && options.onInitializing) {
                options.onInitializing.apply(this, [options])
            }
            this._setOptionsByDevice(options.defaultOptionsRules);
            this._initOptions(options)
        } finally {
            this.endUpdate()
        }
    },
    _initOptions: function(options) {
        this.option(options)
    },
    _init: function() {
        var _this2 = this;
        this._createOptionChangedAction();
        this.on("disposing", function(args) {
            _this2._disposingCallbacks.fireWith(_this2, [args])
        })
    },
    _logDeprecatedOptionWarning: function(option, info) {
        var message = info.message || "Use the '".concat(info.alias, "' option instead");
        _errors.default.log("W0001", this.NAME, option, info.since, message)
    },
    _logDeprecatedComponentWarning: function(since, alias) {
        _errors.default.log("W0000", this.NAME, since, "Use the '".concat(alias, "' widget instead"))
    },
    _createOptionChangedAction: function() {
        this._optionChangedAction = this._createActionByOption("onOptionChanged", {
            excludeValidators: ["disabled", "readOnly"]
        })
    },
    _createDisposingAction: function() {
        this._disposingAction = this._createActionByOption("onDisposing", {
            excludeValidators: ["disabled", "readOnly"]
        })
    },
    _optionChanged: function(args) {
        switch (args.name) {
            case "onDisposing":
            case "onInitialized":
                break;
            case "onOptionChanged":
                this._createOptionChangedAction();
                break;
            case "defaultOptionsRules":
        }
    },
    _dispose: function() {
        this._optionChangedCallbacks.empty();
        this._createDisposingAction();
        this._disposingAction();
        this._eventsStrategy.dispose();
        this._options.dispose();
        this._disposed = true
    },
    _lockUpdate: function() {
        this._updateLockCount++
    },
    _unlockUpdate: function() {
        this._updateLockCount = Math.max(this._updateLockCount - 1, 0)
    },
    _isUpdateAllowed: function() {
        return 0 === this._updateLockCount
    },
    _isInitializingRequired: function() {
        return !this._initializing && !this._initialized
    },
    _commitUpdate: function() {
        this.postponedOperations.callPostponedOperations();
        this._isInitializingRequired() && this._initializeComponent()
    },
    _initializeComponent: function() {
        this._initializing = true;
        try {
            this._init()
        } finally {
            this._initializing = false;
            this._lockUpdate();
            this._createActionByOption("onInitialized", {
                excludeValidators: ["disabled", "readOnly"]
            })();
            this._unlockUpdate();
            this._initialized = true
        }
    },
    instance: function() {
        return this
    },
    beginUpdate: function() {
        this._lockUpdate()
    },
    endUpdate: function() {
        this._unlockUpdate();
        this._isUpdateAllowed() && this._commitUpdate()
    },
    _optionChanging: _common.noop,
    _notifyOptionChanged: function(option, value, previousValue) {
        if (this._initialized) {
            var optionNames = [option].concat(this._options.getAliasesByName(option));
            for (var i = 0; i < optionNames.length; i++) {
                var name = optionNames[i];
                var args = {
                    name: name.split(/[.[]/)[0],
                    fullName: name,
                    value: value,
                    previousValue: previousValue
                };
                if (!isInnerOption(name)) {
                    this._optionChangedCallbacks.fireWith(this, [(0, _extend.extend)(this._defaultActionArgs(), args)]);
                    this._optionChangedAction((0, _extend.extend)({}, args))
                }
                if (!this._disposed && this._cancelOptionChange !== name) {
                    this._optionChanged(args)
                }
            }
        }
    },
    initialOption: function(name) {
        return this._options.initial(name)
    },
    _defaultActionConfig: function() {
        return {
            context: this,
            component: this
        }
    },
    _defaultActionArgs: function() {
        return {
            component: this
        }
    },
    _createAction: function(actionSource, config) {
        var _this3 = this;
        var action;
        return function(e) {
            if (!(0, _type.isDefined)(e)) {
                e = {}
            }
            if (!(0, _type.isPlainObject)(e)) {
                e = {
                    actionValue: e
                }
            }
            action = action || new _action.default(actionSource, (0, _extend.extend)(config, _this3._defaultActionConfig()));
            return action.execute.call(action, (0, _extend.extend)(e, _this3._defaultActionArgs()))
        }
    },
    _createActionByOption: function(optionName, config) {
        var _this4 = this;
        var action;
        var eventName;
        var actionFunc;
        var result = function() {
            if (!eventName) {
                config = config || {};
                if ("string" !== typeof optionName) {
                    throw _errors.default.Error("E0008")
                }
                if (0 === optionName.indexOf("on")) {
                    eventName = getEventName(optionName)
                }
                actionFunc = _this4.option(optionName)
            }
            if (!action && !actionFunc && !config.beforeExecute && !config.afterExecute && !_this4._eventsStrategy.hasEvent(eventName)) {
                return
            }
            if (!action) {
                var beforeExecute = config.beforeExecute;
                config.beforeExecute = function() {
                    for (var _len2 = arguments.length, props = new Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
                        props[_key2] = arguments[_key2]
                    }
                    beforeExecute && beforeExecute.apply(_this4, props);
                    _this4._eventsStrategy.fireEvent(eventName, props[0].args)
                };
                action = _this4._createAction(actionFunc, config)
            }
            for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
                args[_key] = arguments[_key]
            }
            if ((0, _config.default)().wrapActionsBeforeExecute) {
                var beforeActionExecute = _this4.option("beforeActionExecute") || _common.noop;
                var wrappedAction = beforeActionExecute(_this4, action, config) || action;
                return wrappedAction.apply(_this4, args)
            }
            return action.apply(_this4, args)
        };
        if ((0, _config.default)().wrapActionsBeforeExecute) {
            return result
        }
        var onActionCreated = this.option("onActionCreated") || _common.noop;
        return onActionCreated(this, result, config) || result
    },
    on: function(eventName, eventHandler) {
        this._eventsStrategy.on(eventName, eventHandler);
        return this
    },
    off: function(eventName, eventHandler) {
        this._eventsStrategy.off(eventName, eventHandler);
        return this
    },
    hasActionSubscription: function(actionName) {
        return !!this._options.silent(actionName) || this._eventsStrategy.hasEvent(getEventName(actionName))
    },
    isOptionDeprecated: function(name) {
        return this._options.isDeprecated(name)
    },
    _setOptionWithoutOptionChange: function(name, value) {
        this._cancelOptionChange = name;
        this.option(name, value);
        this._cancelOptionChange = false
    },
    _getOptionValue: function(name, context) {
        var value = this.option(name);
        if ((0, _type.isFunction)(value)) {
            return value.bind(context)()
        }
        return value
    },
    option: function() {
        var _this$_options;
        return (_this$_options = this._options).option.apply(_this$_options, arguments)
    },
    resetOption: function(name) {
        this.beginUpdate();
        this._options.reset(name);
        this.endUpdate()
    }
});
var _default = Component;
exports.default = _default;
module.exports = exports.default;


/***/ }),

/***/ "./node_modules/devextreme/core/component_registrator.js":
/*!***************************************************************!*\
  !*** ./node_modules/devextreme/core/component_registrator.js ***!
  \***************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/**
 * DevExtreme (core/component_registrator.js)
 * Version: 20.2.3
 * Build date: Tue Oct 20 2020
 *
 * Copyright (c) 2012 - 2020 Developer Express Inc. ALL RIGHTS RESERVED
 * Read about DevExtreme licensing here: https://js.devexpress.com/Licensing/
 */

exports.default = void 0;
var _renderer = _interopRequireDefault(__webpack_require__(/*! ./renderer */ "./node_modules/devextreme/core/renderer.js"));
var _component_registrator_callbacks = _interopRequireDefault(__webpack_require__(/*! ./component_registrator_callbacks */ "./node_modules/devextreme/core/component_registrator_callbacks.js"));
var _errors = _interopRequireDefault(__webpack_require__(/*! ./errors */ "./node_modules/devextreme/core/errors.js"));
var _public_component = __webpack_require__(/*! ./utils/public_component */ "./node_modules/devextreme/core/utils/public_component.js");

function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
        "default": obj
    }
}
var registerComponent = function(name, namespace, componentClass) {
    if (!componentClass) {
        componentClass = namespace
    } else {
        namespace[name] = componentClass
    }(0, _public_component.name)(componentClass, name);
    _component_registrator_callbacks.default.fire(name, componentClass)
};
var registerRendererComponent = function(name, componentClass) {
    _renderer.default.fn[name] = function(options) {
        var isMemberInvoke = "string" === typeof options;
        var result;
        if (isMemberInvoke) {
            var memberName = options;
            var memberArgs = [].slice.call(arguments).slice(1);
            this.each(function() {
                var instance = componentClass.getInstance(this);
                if (!instance) {
                    throw _errors.default.Error("E0009", name)
                }
                var member = instance[memberName];
                var memberValue = member.apply(instance, memberArgs);
                if (void 0 === result) {
                    result = memberValue
                }
            })
        } else {
            this.each(function() {
                var instance = componentClass.getInstance(this);
                if (instance) {
                    instance.option(options)
                } else {
                    new componentClass(this, options)
                }
            });
            result = this
        }
        return result
    }
};
_component_registrator_callbacks.default.add(registerRendererComponent);
var _default = registerComponent;
exports.default = _default;
module.exports = exports.default;
module.exports.default = module.exports;


/***/ }),

/***/ "./node_modules/devextreme/core/component_registrator_callbacks.js":
/*!*************************************************************************!*\
  !*** ./node_modules/devextreme/core/component_registrator_callbacks.js ***!
  \*************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/**
 * DevExtreme (core/component_registrator_callbacks.js)
 * Version: 20.2.3
 * Build date: Tue Oct 20 2020
 *
 * Copyright (c) 2012 - 2020 Developer Express Inc. ALL RIGHTS RESERVED
 * Read about DevExtreme licensing here: https://js.devexpress.com/Licensing/
 */

exports.default = void 0;
var _memorized_callbacks = _interopRequireDefault(__webpack_require__(/*! ./memorized_callbacks */ "./node_modules/devextreme/core/memorized_callbacks.js"));

function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
        "default": obj
    }
}
var _default = new _memorized_callbacks.default;
exports.default = _default;
module.exports = exports.default;


/***/ }),

/***/ "./node_modules/devextreme/core/config.js":
/*!************************************************!*\
  !*** ./node_modules/devextreme/core/config.js ***!
  \************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/**
 * DevExtreme (core/config.js)
 * Version: 20.2.3
 * Build date: Tue Oct 20 2020
 *
 * Copyright (c) 2012 - 2020 Developer Express Inc. ALL RIGHTS RESERVED
 * Read about DevExtreme licensing here: https://js.devexpress.com/Licensing/
 */

exports.default = void 0;
var _extend = __webpack_require__(/*! ./utils/extend */ "./node_modules/devextreme/core/utils/extend.js");
var _errors = _interopRequireDefault(__webpack_require__(/*! ./errors */ "./node_modules/devextreme/core/errors.js"));

function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
        "default": obj
    }
}
var config = {
    rtlEnabled: false,
    defaultCurrency: "USD",
    oDataFilterToLower: true,
    serverDecimalSeparator: ".",
    decimalSeparator: ".",
    thousandsSeparator: ",",
    forceIsoDateParsing: true,
    wrapActionsBeforeExecute: true,
    useLegacyStoreResult: false,
    useJQuery: void 0,
    editorStylingMode: void 0,
    useLegacyVisibleIndex: false,
    floatingActionButtonConfig: {
        icon: "add",
        closeIcon: "close",
        label: "",
        position: {
            at: "right bottom",
            my: "right bottom",
            offset: {
                x: -16,
                y: -16
            }
        },
        maxSpeedDialActionCount: 5,
        shading: false,
        direction: "auto"
    },
    optionsParser: function(optionsString) {
        if ("{" !== optionsString.trim().charAt(0)) {
            optionsString = "{" + optionsString + "}"
        }
        try {
            return new Function("return " + optionsString)()
        } catch (ex) {
            throw _errors.default.Error("E3018", ex, optionsString)
        }
    }
};
var deprecatedFields = ["decimalSeparator", "thousandsSeparator"];
var configMethod = function() {
    if (!arguments.length) {
        return config
    }
    var newConfig = arguments.length <= 0 ? void 0 : arguments[0];
    deprecatedFields.forEach(function(deprecatedField) {
        if (newConfig[deprecatedField]) {
            var message = "Now, the ".concat(deprecatedField, " is selected based on the specified locale.");
            _errors.default.log("W0003", "config", deprecatedField, "19.2", message)
        }
    });
    (0, _extend.extend)(config, newConfig)
};
if ("undefined" !== typeof DevExpress && DevExpress.config) {
    configMethod(DevExpress.config)
}
var _default = configMethod;
exports.default = _default;
module.exports = exports.default;
module.exports.default = module.exports;


/***/ }),

/***/ "./node_modules/devextreme/core/devices.js":
/*!*************************************************!*\
  !*** ./node_modules/devextreme/core/devices.js ***!
  \*************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/**
 * DevExtreme (core/devices.js)
 * Version: 20.2.3
 * Build date: Tue Oct 20 2020
 *
 * Copyright (c) 2012 - 2020 Developer Express Inc. ALL RIGHTS RESERVED
 * Read about DevExtreme licensing here: https://js.devexpress.com/Licensing/
 */

exports.default = void 0;
var _renderer = _interopRequireDefault(__webpack_require__(/*! ../core/renderer */ "./node_modules/devextreme/core/renderer.js"));
var _window = __webpack_require__(/*! ./utils/window */ "./node_modules/devextreme/core/utils/window.js");
var _extend = __webpack_require__(/*! ./utils/extend */ "./node_modules/devextreme/core/utils/extend.js");
var _type = __webpack_require__(/*! ./utils/type */ "./node_modules/devextreme/core/utils/type.js");
var _iterator = __webpack_require__(/*! ./utils/iterator */ "./node_modules/devextreme/core/utils/iterator.js");
var _errors = _interopRequireDefault(__webpack_require__(/*! ./errors */ "./node_modules/devextreme/core/errors.js"));
var _callbacks = _interopRequireDefault(__webpack_require__(/*! ./utils/callbacks */ "./node_modules/devextreme/core/utils/callbacks.js"));
var _ready_callbacks = _interopRequireDefault(__webpack_require__(/*! ./utils/ready_callbacks */ "./node_modules/devextreme/core/utils/ready_callbacks.js"));
var _resize_callbacks = _interopRequireDefault(__webpack_require__(/*! ./utils/resize_callbacks */ "./node_modules/devextreme/core/utils/resize_callbacks.js"));
var _events_strategy = __webpack_require__(/*! ./events_strategy */ "./node_modules/devextreme/core/events_strategy.js");
var _storage = __webpack_require__(/*! ./utils/storage */ "./node_modules/devextreme/core/utils/storage.js");
var _view_port = __webpack_require__(/*! ./utils/view_port */ "./node_modules/devextreme/core/utils/view_port.js");
var _config = _interopRequireDefault(__webpack_require__(/*! ./config */ "./node_modules/devextreme/core/config.js"));

function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
        "default": obj
    }
}

function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
        throw new TypeError("Cannot call a class as a function")
    }
}

function _defineProperties(target, props) {
    for (var i = 0; i < props.length; i++) {
        var descriptor = props[i];
        descriptor.enumerable = descriptor.enumerable || false;
        descriptor.configurable = true;
        if ("value" in descriptor) {
            descriptor.writable = true
        }
        Object.defineProperty(target, descriptor.key, descriptor)
    }
}

function _createClass(Constructor, protoProps, staticProps) {
    if (protoProps) {
        _defineProperties(Constructor.prototype, protoProps)
    }
    if (staticProps) {
        _defineProperties(Constructor, staticProps)
    }
    return Constructor
}
var navigator = (0, _window.getNavigator)();
var window = (0, _window.getWindow)();
var KNOWN_UA_TABLE = {
    iPhone: "iPhone",
    iPhone5: "iPhone",
    iPhone6: "iPhone",
    iPhone6plus: "iPhone",
    iPad: "iPad",
    iPadMini: "iPad Mini",
    androidPhone: "Android Mobile",
    androidTablet: "Android",
    msSurface: "Windows ARM Tablet PC",
    desktop: "desktop"
};
var DEFAULT_DEVICE = {
    deviceType: "desktop",
    platform: "generic",
    version: [],
    phone: false,
    tablet: false,
    android: false,
    ios: false,
    generic: true,
    grade: "A",
    mac: false
};
var uaParsers = {
    generic: function(userAgent) {
        var isPhone = /windows phone/i.test(userAgent) || userAgent.match(/WPDesktop/);
        var isTablet = !isPhone && /Windows(.*)arm(.*)Tablet PC/i.test(userAgent);
        var isDesktop = !isPhone && !isTablet && /msapphost/i.test(userAgent);
        var isMac = /((intel|ppc) mac os x)/.test(userAgent.toLowerCase());
        if (!(isPhone || isTablet || isDesktop || isMac)) {
            return
        }
        return {
            deviceType: isPhone ? "phone" : isTablet ? "tablet" : "desktop",
            platform: "generic",
            version: [],
            grade: "A",
            mac: isMac
        }
    },
    ios: function(userAgent) {
        if (!/ip(hone|od|ad)/i.test(userAgent)) {
            return
        }
        var isPhone = /ip(hone|od)/i.test(userAgent);
        var matches = userAgent.match(/os (\d+)_(\d+)_?(\d+)?/i);
        var version = matches ? [parseInt(matches[1], 10), parseInt(matches[2], 10), parseInt(matches[3] || 0, 10)] : [];
        var isIPhone4 = 480 === window.screen.height;
        var grade = isIPhone4 ? "B" : "A";
        return {
            deviceType: isPhone ? "phone" : "tablet",
            platform: "ios",
            version: version,
            grade: grade
        }
    },
    android: function(userAgent) {
        if (!/android|htc_|silk/i.test(userAgent)) {
            return
        }
        var isPhone = /mobile/i.test(userAgent);
        var matches = userAgent.match(/android (\d+)\.?(\d+)?\.?(\d+)?/i);
        var version = matches ? [parseInt(matches[1], 10), parseInt(matches[2] || 0, 10), parseInt(matches[3] || 0, 10)] : [];
        var worseThan4_4 = version.length > 1 && (version[0] < 4 || 4 === version[0] && version[1] < 4);
        var grade = worseThan4_4 ? "B" : "A";
        return {
            deviceType: isPhone ? "phone" : "tablet",
            platform: "android",
            version: version,
            grade: grade
        }
    }
};
var Devices = function() {
    function Devices(options) {
        _classCallCheck(this, Devices);
        this._window = (null === options || void 0 === options ? void 0 : options.window) || window;
        this._realDevice = this._getDevice();
        this._currentDevice = void 0;
        this._currentOrientation = void 0;
        this._eventsStrategy = new _events_strategy.EventsStrategy(this);
        this.changed = (0, _callbacks.default)();
        if ((0, _window.hasWindow)()) {
            _ready_callbacks.default.add(this._recalculateOrientation.bind(this));
            _resize_callbacks.default.add(this._recalculateOrientation.bind(this))
        }
    }
    _createClass(Devices, [{
        key: "current",
        value: function(deviceOrName) {
            if (deviceOrName) {
                this._currentDevice = this._getDevice(deviceOrName);
                this._forced = true;
                this.changed.fire();
                return
            }
            if (!this._currentDevice) {
                deviceOrName = void 0;
                try {
                    deviceOrName = this._getDeviceOrNameFromWindowScope()
                } catch (e) {
                    deviceOrName = this._getDeviceNameFromSessionStorage()
                } finally {
                    if (!deviceOrName) {
                        deviceOrName = this._getDeviceNameFromSessionStorage()
                    }
                    if (deviceOrName) {
                        this._forced = true
                    }
                }
                this._currentDevice = this._getDevice(deviceOrName)
            }
            return this._currentDevice
        }
    }, {
        key: "real",
        value: function(forceDevice) {
            return (0, _extend.extend)({}, this._realDevice)
        }
    }, {
        key: "orientation",
        value: function() {
            return this._currentOrientation
        }
    }, {
        key: "isForced",
        value: function() {
            return this._forced
        }
    }, {
        key: "isRippleEmulator",
        value: function() {
            return !!this._window.tinyHippos
        }
    }, {
        key: "_getCssClasses",
        value: function(device) {
            var result = [];
            var realDevice = this._realDevice;
            device = device || this.current();
            if (device.deviceType) {
                result.push("dx-device-".concat(device.deviceType));
                if ("desktop" !== device.deviceType) {
                    result.push("dx-device-mobile")
                }
            }
            result.push("dx-device-".concat(realDevice.platform));
            if (realDevice.version && realDevice.version.length) {
                result.push("dx-device-".concat(realDevice.platform, "-").concat(realDevice.version[0]))
            }
            if (this.isSimulator()) {
                result.push("dx-simulator")
            }
            if ((0, _config.default)().rtlEnabled) {
                result.push("dx-rtl")
            }
            return result
        }
    }, {
        key: "attachCssClasses",
        value: function(element, device) {
            this._deviceClasses = this._getCssClasses(device).join(" ");
            (0, _renderer.default)(element).addClass(this._deviceClasses)
        }
    }, {
        key: "detachCssClasses",
        value: function(element) {
            (0, _renderer.default)(element).removeClass(this._deviceClasses)
        }
    }, {
        key: "isSimulator",
        value: function() {
            try {
                return this._isSimulator || (0, _window.hasWindow)() && this._window.top !== this._window.self && this._window.top["dx-force-device"] || this.isRippleEmulator()
            } catch (e) {
                return false
            }
        }
    }, {
        key: "forceSimulator",
        value: function() {
            this._isSimulator = true
        }
    }, {
        key: "_getDevice",
        value: function(deviceName) {
            if ("genericPhone" === deviceName) {
                deviceName = {
                    deviceType: "phone",
                    platform: "generic",
                    generic: true
                }
            }
            if ((0, _type.isPlainObject)(deviceName)) {
                return this._fromConfig(deviceName)
            } else {
                var ua;
                if (deviceName) {
                    ua = KNOWN_UA_TABLE[deviceName];
                    if (!ua) {
                        throw _errors.default.Error("E0005")
                    }
                } else {
                    ua = navigator.userAgent
                }
                return this._fromUA(ua)
            }
        }
    }, {
        key: "_getDeviceOrNameFromWindowScope",
        value: function() {
            var result;
            if ((0, _window.hasWindow)() && (this._window.top["dx-force-device-object"] || this._window.top["dx-force-device"])) {
                result = this._window.top["dx-force-device-object"] || this._window.top["dx-force-device"]
            }
            return result
        }
    }, {
        key: "_getDeviceNameFromSessionStorage",
        value: function() {
            var sessionStorage = (0, _storage.sessionStorage)();
            if (!sessionStorage) {
                return
            }
            var deviceOrName = sessionStorage.getItem("dx-force-device");
            try {
                return JSON.parse(deviceOrName)
            } catch (ex) {
                return deviceOrName
            }
        }
    }, {
        key: "_fromConfig",
        value: function(config) {
            var result = (0, _extend.extend)({}, DEFAULT_DEVICE, this._currentDevice, config);
            var shortcuts = {
                phone: "phone" === result.deviceType,
                tablet: "tablet" === result.deviceType,
                android: "android" === result.platform,
                ios: "ios" === result.platform,
                generic: "generic" === result.platform
            };
            return (0, _extend.extend)(result, shortcuts)
        }
    }, {
        key: "_fromUA",
        value: function(ua) {
            var config;
            (0, _iterator.each)(uaParsers, function(platform, parser) {
                config = parser(ua);
                return !config
            });
            if (config) {
                return this._fromConfig(config)
            }
            return DEFAULT_DEVICE
        }
    }, {
        key: "_changeOrientation",
        value: function() {
            var $window = (0, _renderer.default)(this._window);
            var orientation = $window.height() > $window.width() ? "portrait" : "landscape";
            if (this._currentOrientation === orientation) {
                return
            }
            this._currentOrientation = orientation;
            this._eventsStrategy.fireEvent("orientationChanged", [{
                orientation: orientation
            }])
        }
    }, {
        key: "_recalculateOrientation",
        value: function() {
            var windowWidth = (0, _renderer.default)(this._window).width();
            if (this._currentWidth === windowWidth) {
                return
            }
            this._currentWidth = windowWidth;
            this._changeOrientation()
        }
    }, {
        key: "on",
        value: function(eventName, eventHandler) {
            this._eventsStrategy.on(eventName, eventHandler);
            return this
        }
    }, {
        key: "off",
        value: function(eventName, eventHandler) {
            this._eventsStrategy.off(eventName, eventHandler);
            return this
        }
    }]);
    return Devices
}();
var devices = new Devices;
_view_port.changeCallback.add(function(viewPort, prevViewport) {
    devices.detachCssClasses(prevViewport);
    devices.attachCssClasses(viewPort)
});
var _default = devices;
exports.default = _default;
module.exports = exports.default;
module.exports.default = module.exports;


/***/ }),

/***/ "./node_modules/devextreme/core/dom_adapter.js":
/*!*****************************************************!*\
  !*** ./node_modules/devextreme/core/dom_adapter.js ***!
  \*****************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/**
 * DevExtreme (core/dom_adapter.js)
 * Version: 20.2.3
 * Build date: Tue Oct 20 2020
 *
 * Copyright (c) 2012 - 2020 Developer Express Inc. ALL RIGHTS RESERVED
 * Read about DevExtreme licensing here: https://js.devexpress.com/Licensing/
 */

exports.default = void 0;
var _dependency_injector = _interopRequireDefault(__webpack_require__(/*! ./utils/dependency_injector */ "./node_modules/devextreme/core/utils/dependency_injector.js"));
var _common = __webpack_require__(/*! ./utils/common */ "./node_modules/devextreme/core/utils/common.js");

function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
        "default": obj
    }
}

function _typeof(obj) {
    "@babel/helpers - typeof";
    if ("function" === typeof Symbol && "symbol" === typeof Symbol.iterator) {
        _typeof = function(obj) {
            return typeof obj
        }
    } else {
        _typeof = function(obj) {
            return obj && "function" === typeof Symbol && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj
        }
    }
    return _typeof(obj)
}
var ELEMENT_NODE = 1;
var TEXT_NODE = 3;
var DOCUMENT_NODE = 9;
var nativeDOMAdapterStrategy = {
    querySelectorAll: function(element, selector) {
        return element.querySelectorAll(selector)
    },
    elementMatches: function(element, selector) {
        var _this = this;
        var matches = element.matches || element.matchesSelector || element.mozMatchesSelector || element.msMatchesSelector || element.oMatchesSelector || element.webkitMatchesSelector || function(selector) {
            var doc = element.document || element.ownerDocument;
            if (!doc) {
                return false
            }
            var items = _this.querySelectorAll(doc, selector);
            for (var i = 0; i < items.length; i++) {
                if (items[i] === element) {
                    return true
                }
            }
        };
        return matches.call(element, selector)
    },
    createElement: function(tagName, context) {
        context = context || this._document;
        return context.createElement(tagName)
    },
    createElementNS: function(ns, tagName, context) {
        context = context || this._document;
        return context.createElementNS(ns, tagName)
    },
    createTextNode: function(text, context) {
        context = context || this._document;
        return context.createTextNode(text)
    },
    isNode: function(element) {
        return "object" === _typeof(element) && "nodeType" in element
    },
    isElementNode: function(element) {
        return element && element.nodeType === ELEMENT_NODE
    },
    isTextNode: function(element) {
        return element && element.nodeType === TEXT_NODE
    },
    isDocument: function(element) {
        return element && element.nodeType === DOCUMENT_NODE
    },
    removeElement: function(element) {
        var parentNode = element && element.parentNode;
        if (parentNode) {
            parentNode.removeChild(element)
        }
    },
    insertElement: function(parentElement, newElement, nextSiblingElement) {
        if (parentElement && newElement && parentElement !== newElement) {
            if (nextSiblingElement) {
                parentElement.insertBefore(newElement, nextSiblingElement)
            } else {
                parentElement.appendChild(newElement)
            }
        }
    },
    getAttribute: function(element, name) {
        return element.getAttribute(name)
    },
    setAttribute: function(element, name, value) {
        element.setAttribute(name, value)
    },
    removeAttribute: function(element, name) {
        element.removeAttribute(name)
    },
    setProperty: function(element, name, value) {
        element[name] = value
    },
    setText: function(element, text) {
        if (element) {
            element.textContent = text
        }
    },
    setClass: function(element, className, isAdd) {
        if (1 === element.nodeType && className) {
            if (element.classList) {
                if (isAdd) {
                    element.classList.add(className)
                } else {
                    element.classList.remove(className)
                }
            } else {
                var classNameSupported = "string" === typeof element.className;
                var elementClass = classNameSupported ? element.className : this.getAttribute(element, "class") || "";
                var classNames = elementClass.split(" ");
                var classIndex = classNames.indexOf(className);
                var resultClassName;
                if (isAdd && classIndex < 0) {
                    resultClassName = elementClass ? elementClass + " " + className : className
                }
                if (!isAdd && classIndex >= 0) {
                    classNames.splice(classIndex, 1);
                    resultClassName = classNames.join(" ")
                }
                if (void 0 !== resultClassName) {
                    if (classNameSupported) {
                        element.className = resultClassName
                    } else {
                        this.setAttribute(element, "class", resultClassName)
                    }
                }
            }
        }
    },
    setStyle: function(element, name, value) {
        element.style[name] = value || ""
    },
    _document: "undefined" === typeof document ? void 0 : document,
    getDocument: function() {
        return this._document
    },
    getActiveElement: function() {
        return this._document.activeElement
    },
    getBody: function() {
        return this._document.body
    },
    createDocumentFragment: function() {
        return this._document.createDocumentFragment()
    },
    getDocumentElement: function() {
        return this._document.documentElement
    },
    getLocation: function() {
        return this._document.location
    },
    getSelection: function() {
        return this._document.selection
    },
    getReadyState: function() {
        return this._document.readyState
    },
    getHead: function() {
        return this._document.head
    },
    hasDocumentProperty: function(property) {
        return property in this._document
    },
    listen: function(element, event, callback, options) {
        if (!element || !("addEventListener" in element)) {
            return _common.noop
        }
        element.addEventListener(event, callback, options);
        return function() {
            element.removeEventListener(event, callback)
        }
    }
};
var _default = (0, _dependency_injector.default)(nativeDOMAdapterStrategy);
exports.default = _default;
module.exports = exports.default;


/***/ }),

/***/ "./node_modules/devextreme/core/dom_component.js":
/*!*******************************************************!*\
  !*** ./node_modules/devextreme/core/dom_component.js ***!
  \*******************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/**
 * DevExtreme (core/dom_component.js)
 * Version: 20.2.3
 * Build date: Tue Oct 20 2020
 *
 * Copyright (c) 2012 - 2020 Developer Express Inc. ALL RIGHTS RESERVED
 * Read about DevExtreme licensing here: https://js.devexpress.com/Licensing/
 */

exports.default = void 0;
var _renderer = _interopRequireDefault(__webpack_require__(/*! ../core/renderer */ "./node_modules/devextreme/core/renderer.js"));
var _config = _interopRequireDefault(__webpack_require__(/*! ./config */ "./node_modules/devextreme/core/config.js"));
var _errors = _interopRequireDefault(__webpack_require__(/*! ./errors */ "./node_modules/devextreme/core/errors.js"));
var _resize_callbacks = _interopRequireDefault(__webpack_require__(/*! ../core/utils/resize_callbacks */ "./node_modules/devextreme/core/utils/resize_callbacks.js"));
var _component = _interopRequireDefault(__webpack_require__(/*! ./component */ "./node_modules/devextreme/core/component.js"));
var _template_manager = __webpack_require__(/*! ./template_manager */ "./node_modules/devextreme/core/template_manager.js");
var _public_component = __webpack_require__(/*! ./utils/public_component */ "./node_modules/devextreme/core/utils/public_component.js");
var _element_data = __webpack_require__(/*! ./element_data */ "./node_modules/devextreme/core/element_data.js");
var _iterator = __webpack_require__(/*! ./utils/iterator */ "./node_modules/devextreme/core/utils/iterator.js");
var _extend = __webpack_require__(/*! ./utils/extend */ "./node_modules/devextreme/core/utils/extend.js");
var _element = __webpack_require__(/*! ../core/element */ "./node_modules/devextreme/core/element.js");
var _common = __webpack_require__(/*! ./utils/common */ "./node_modules/devextreme/core/utils/common.js");
var _array = __webpack_require__(/*! ./utils/array */ "./node_modules/devextreme/core/utils/array.js");
var _type = __webpack_require__(/*! ./utils/type */ "./node_modules/devextreme/core/utils/type.js");
var _window = __webpack_require__(/*! ../core/utils/window */ "./node_modules/devextreme/core/utils/window.js");
var _short = __webpack_require__(/*! ../events/short */ "./node_modules/devextreme/events/short.js");

function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
        "default": obj
    }
}
var abstract = _component.default.abstract;
var DOMComponent = _component.default.inherit({
    _getDefaultOptions: function() {
        return (0, _extend.extend)(this.callBase(), {
            width: void 0,
            height: void 0,
            rtlEnabled: (0, _config.default)().rtlEnabled,
            elementAttr: {},
            disabled: false,
            integrationOptions: {}
        }, this._useTemplates() ? _template_manager.TemplateManager.createDefaultOptions() : {})
    },
    ctor: function(element, options) {
        this._createElement(element);
        (0, _public_component.attachInstanceToElement)(this._$element, this, this._dispose);
        this.callBase(options)
    },
    _createElement: function(element) {
        this._$element = (0, _renderer.default)(element)
    },
    _getSynchronizableOptionsForCreateComponent: function() {
        return ["rtlEnabled", "disabled", "templatesRenderAsynchronously"]
    },
    _visibilityChanged: abstract,
    _dimensionChanged: abstract,
    _init: function() {
        this.callBase();
        this._attachWindowResizeCallback();
        this._initTemplateManager()
    },
    _setOptionsByDevice: function(instanceCustomRules) {
        this.callBase([].concat(this.constructor._classCustomRules || [], instanceCustomRules || []))
    },
    _isInitialOptionValue: function(name) {
        var isCustomOption = this.constructor._classCustomRules && Object.prototype.hasOwnProperty.call(this._convertRulesToOptions(this.constructor._classCustomRules), name);
        return !isCustomOption && this.callBase(name)
    },
    _attachWindowResizeCallback: function() {
        if (this._isDimensionChangeSupported()) {
            var windowResizeCallBack = this._windowResizeCallBack = this._dimensionChanged.bind(this);
            _resize_callbacks.default.add(windowResizeCallBack)
        }
    },
    _isDimensionChangeSupported: function() {
        return this._dimensionChanged !== abstract
    },
    _renderComponent: function() {
        this._initMarkup();
        (0, _window.hasWindow)() && this._render()
    },
    _initMarkup: function() {
        var _ref = this.option() || {},
            rtlEnabled = _ref.rtlEnabled;
        this._renderElementAttributes();
        this._toggleRTLDirection(rtlEnabled);
        this._renderVisibilityChange();
        this._renderDimensions()
    },
    _render: function() {
        this._attachVisibilityChangeHandlers()
    },
    _renderElementAttributes: function() {
        var _ref2 = this.option() || {},
            elementAttr = _ref2.elementAttr;
        var attributes = (0, _extend.extend)({}, elementAttr);
        var classNames = attributes.class;
        delete attributes.class;
        this.$element().attr(attributes).addClass(classNames)
    },
    _renderVisibilityChange: function() {
        if (this._isDimensionChangeSupported()) {
            this._attachDimensionChangeHandlers()
        }
        if (this._isVisibilityChangeSupported()) {
            var $element = this.$element();
            $element.addClass("dx-visibility-change-handler")
        }
    },
    _renderDimensions: function() {
        var $element = this.$element();
        var element = $element.get(0);
        var width = this._getOptionValue("width", element);
        var height = this._getOptionValue("height", element);
        if (this._isCssUpdateRequired(element, height, width)) {
            $element.css({
                width: null === width ? "" : width,
                height: null === height ? "" : height
            })
        }
    },
    _isCssUpdateRequired: function(element, height, width) {
        return !!((0, _type.isDefined)(width) || (0, _type.isDefined)(height) || element.style.width || element.style.height)
    },
    _attachDimensionChangeHandlers: function() {
        var _this = this;
        var $el = this.$element();
        var namespace = "".concat(this.NAME, "VisibilityChange");
        _short.resize.off($el, {
            namespace: namespace
        });
        _short.resize.on($el, function() {
            return _this._dimensionChanged()
        }, {
            namespace: namespace
        })
    },
    _attachVisibilityChangeHandlers: function() {
        var _this2 = this;
        if (this._isVisibilityChangeSupported()) {
            var $el = this.$element();
            var namespace = "".concat(this.NAME, "VisibilityChange");
            this._isHidden = !this._isVisible();
            _short.visibility.off($el, {
                namespace: namespace
            });
            _short.visibility.on($el, function() {
                return _this2._checkVisibilityChanged("shown")
            }, function() {
                return _this2._checkVisibilityChanged("hiding")
            }, {
                namespace: namespace
            })
        }
    },
    _isVisible: function() {
        var $element = this.$element();
        return $element.is(":visible")
    },
    _checkVisibilityChanged: function(action) {
        var isVisible = this._isVisible();
        if (isVisible) {
            if ("hiding" === action && !this._isHidden) {
                this._visibilityChanged(false);
                this._isHidden = true
            } else {
                if ("shown" === action && this._isHidden) {
                    this._isHidden = false;
                    this._visibilityChanged(true)
                }
            }
        }
    },
    _isVisibilityChangeSupported: function() {
        return this._visibilityChanged !== abstract && (0, _window.hasWindow)()
    },
    _clean: _common.noop,
    _modelByElement: function() {
        var _this$option = this.option(),
            modelByElement = _this$option.modelByElement;
        var $element = this.$element();
        return modelByElement ? modelByElement($element) : void 0
    },
    _invalidate: function() {
        if (this._isUpdateAllowed()) {
            throw _errors.default.Error("E0007")
        }
        this._requireRefresh = true
    },
    _refresh: function() {
        this._clean();
        this._renderComponent()
    },
    _dispose: function() {
        this._templateManager && this._templateManager.dispose();
        this.callBase();
        this._clean();
        this._detachWindowResizeCallback()
    },
    _detachWindowResizeCallback: function() {
        if (this._isDimensionChangeSupported()) {
            _resize_callbacks.default.remove(this._windowResizeCallBack)
        }
    },
    _toggleRTLDirection: function(rtl) {
        var $element = this.$element();
        $element.toggleClass("dx-rtl", rtl)
    },
    _createComponent: function(element, component) {
        var _this3 = this;
        var config = arguments.length > 2 && void 0 !== arguments[2] ? arguments[2] : {};
        var synchronizableOptions = (0, _common.grep)(this._getSynchronizableOptionsForCreateComponent(), function(value) {
            return !(value in config)
        });
        var _this$option2 = this.option(),
            integrationOptions = _this$option2.integrationOptions;
        var _this$option3 = this.option(),
            nestedComponentOptions = _this$option3.nestedComponentOptions;
        nestedComponentOptions = nestedComponentOptions || _common.noop;
        var nestedComponentConfig = (0, _extend.extend)({
            integrationOptions: integrationOptions
        }, nestedComponentOptions(this));
        synchronizableOptions.forEach(function(optionName) {
            return nestedComponentConfig[optionName] = _this3.option(optionName)
        });
        this._extendConfig(config, nestedComponentConfig);
        var instance = void 0;
        if ((0, _type.isString)(component)) {
            var $element = (0, _renderer.default)(element)[component](config);
            instance = $element[component]("instance")
        } else {
            if (element) {
                instance = component.getInstance(element);
                if (instance) {
                    instance.option(config)
                } else {
                    instance = new component(element, config)
                }
            }
        }
        if (instance) {
            var optionChangedHandler = function(_ref3) {
                var name = _ref3.name,
                    value = _ref3.value;
                if ((0, _array.inArray)(name, synchronizableOptions) >= 0) {
                    instance.option(name, value)
                }
            };
            this.on("optionChanged", optionChangedHandler);
            instance.on("disposing", function() {
                return _this3.off("optionChanged", optionChangedHandler)
            })
        }
        return instance
    },
    _extendConfig: function(config, extendConfig) {
        (0, _iterator.each)(extendConfig, function(key, value) {
            !Object.prototype.hasOwnProperty.call(config, key) && (config[key] = value)
        })
    },
    _defaultActionConfig: function() {
        var $element = this.$element();
        var context = this._modelByElement($element);
        return (0, _extend.extend)(this.callBase(), {
            context: context
        })
    },
    _defaultActionArgs: function() {
        var $element = this.$element();
        var model = this._modelByElement($element);
        var element = this.element();
        return (0, _extend.extend)(this.callBase(), {
            element: element,
            model: model
        })
    },
    _optionChanged: function(args) {
        switch (args.name) {
            case "width":
            case "height":
                this._renderDimensions();
                break;
            case "rtlEnabled":
                this._invalidate();
                break;
            case "elementAttr":
                this._renderElementAttributes();
                break;
            case "disabled":
            case "integrationOptions":
                break;
            default:
                this.callBase(args)
        }
    },
    _removeAttributes: function(element) {
        var attrs = element.attributes;
        for (var i = attrs.length - 1; i >= 0; i--) {
            var attr = attrs[i];
            if (attr) {
                var name = attr.name;
                if (!name.indexOf("aria-") || name.indexOf("dx-") !== -1 || "role" === name || "style" === name || "tabindex" === name) {
                    element.removeAttribute(name)
                }
            }
        }
    },
    _removeClasses: function(element) {
        element.className = element.className.split(" ").filter(function(cssClass) {
            return 0 !== cssClass.lastIndexOf("dx-", 0)
        }).join(" ")
    },
    _updateDOMComponent: function(renderRequired) {
        if (renderRequired) {
            this._renderComponent()
        } else {
            if (this._requireRefresh) {
                this._requireRefresh = false;
                this._refresh()
            }
        }
    },
    endUpdate: function() {
        var renderRequired = this._isInitializingRequired();
        this.callBase();
        this._isUpdateAllowed() && this._updateDOMComponent(renderRequired)
    },
    $element: function() {
        return this._$element
    },
    element: function() {
        var $element = this.$element();
        return (0, _element.getPublicElement)($element)
    },
    dispose: function() {
        var element = this.$element().get(0);
        (0, _element_data.cleanDataRecursive)(element, true);
        element.textContent = "";
        this._removeAttributes(element);
        this._removeClasses(element)
    },
    resetOption: function(optionName) {
        this.callBase(optionName);
        if ("width" === optionName || "height" === optionName) {
            var initialOption = this.initialOption(optionName);
            !(0, _type.isDefined)(initialOption) && this.$element().css(optionName, "")
        }
    },
    _getAnonymousTemplateName: function() {
        return
    },
    _initTemplateManager: function() {
        if (this._templateManager || !this._useTemplates()) {
            return
        }
        var _this$option4 = this.option(),
            _this$option4$integra = _this$option4.integrationOptions,
            integrationOptions = void 0 === _this$option4$integra ? {} : _this$option4$integra;
        var createTemplate = integrationOptions.createTemplate;
        this._templateManager = new _template_manager.TemplateManager(createTemplate, this._getAnonymousTemplateName());
        this._initTemplates()
    },
    _initTemplates: function() {
        var _this4 = this;
        var _this$_templateManage = this._templateManager.extractTemplates(this.$element()),
            templates = _this$_templateManage.templates,
            anonymousTemplateMeta = _this$_templateManage.anonymousTemplateMeta;
        var anonymousTemplate = this.option("integrationOptions.templates.".concat(anonymousTemplateMeta.name));
        templates.forEach(function(_ref4) {
            var name = _ref4.name,
                template = _ref4.template;
            _this4._options.silent("integrationOptions.templates.".concat(name), template)
        });
        if (anonymousTemplateMeta.name && !anonymousTemplate) {
            this._options.silent("integrationOptions.templates.".concat(anonymousTemplateMeta.name), anonymousTemplateMeta.template);
            this._options.silent("_hasAnonymousTemplateContent", true)
        }
    },
    _getTemplateByOption: function(optionName) {
        return this._getTemplate(this.option(optionName))
    },
    _getTemplate: function(templateSource) {
        var templates = this.option("integrationOptions.templates");
        var isAsyncTemplate = this.option("templatesRenderAsynchronously");
        var skipTemplates = this.option("integrationOptions.skipTemplates");
        return this._templateManager.getTemplate(templateSource, templates, {
            isAsyncTemplate: isAsyncTemplate,
            skipTemplates: skipTemplates
        }, this)
    },
    _saveTemplate: function(name, template) {
        this._setOptionWithoutOptionChange("integrationOptions.templates." + name, this._templateManager._createTemplate(template))
    },
    _useTemplates: function() {
        return true
    }
});
DOMComponent.getInstance = function(element) {
    return (0, _public_component.getInstanceByElement)((0, _renderer.default)(element), this)
};
DOMComponent.defaultOptions = function(rule) {
    this._classCustomRules = this._classCustomRules || [];
    this._classCustomRules.push(rule)
};
var _default = DOMComponent;
exports.default = _default;
module.exports = exports.default;
module.exports.default = module.exports;


/***/ }),

/***/ "./node_modules/devextreme/core/element.js":
/*!*************************************************!*\
  !*** ./node_modules/devextreme/core/element.js ***!
  \*************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/**
 * DevExtreme (core/element.js)
 * Version: 20.2.3
 * Build date: Tue Oct 20 2020
 *
 * Copyright (c) 2012 - 2020 Developer Express Inc. ALL RIGHTS RESERVED
 * Read about DevExtreme licensing here: https://js.devexpress.com/Licensing/
 */

exports.getPublicElement = getPublicElement;
exports.setPublicElementWrapper = setPublicElementWrapper;
var strategy = function(element) {
    return element && element.get(0)
};

function getPublicElement(element) {
    return strategy(element)
}

function setPublicElementWrapper(newStrategy) {
    strategy = newStrategy
}


/***/ }),

/***/ "./node_modules/devextreme/core/element_data.js":
/*!******************************************************!*\
  !*** ./node_modules/devextreme/core/element_data.js ***!
  \******************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/**
 * DevExtreme (core/element_data.js)
 * Version: 20.2.3
 * Build date: Tue Oct 20 2020
 *
 * Copyright (c) 2012 - 2020 Developer Express Inc. ALL RIGHTS RESERVED
 * Read about DevExtreme licensing here: https://js.devexpress.com/Licensing/
 */

exports.getDataStrategy = getDataStrategy;
exports.data = data;
exports.beforeCleanData = beforeCleanData;
exports.afterCleanData = afterCleanData;
exports.cleanData = cleanData;
exports.removeData = removeData;
exports.cleanDataRecursive = cleanDataRecursive;
exports.setDataStrategy = exports.strategyChanging = void 0;
var _weak_map = _interopRequireDefault(__webpack_require__(/*! ./polyfills/weak_map */ "./node_modules/devextreme/core/polyfills/weak_map.js"));
var _dom_adapter = _interopRequireDefault(__webpack_require__(/*! ./dom_adapter */ "./node_modules/devextreme/core/dom_adapter.js"));
var _events_engine = _interopRequireDefault(__webpack_require__(/*! ../events/core/events_engine */ "./node_modules/devextreme/events/core/events_engine.js"));
var _memorized_callbacks = _interopRequireDefault(__webpack_require__(/*! ./memorized_callbacks */ "./node_modules/devextreme/core/memorized_callbacks.js"));

function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
        "default": obj
    }
}
var dataMap = new _weak_map.default;
var strategy;
var strategyChanging = new _memorized_callbacks.default;
exports.strategyChanging = strategyChanging;
var beforeCleanDataFunc = function() {};
var afterCleanDataFunc = function() {};
var setDataStrategy = function(value) {
    strategyChanging.fire(value);
    strategy = value;
    var cleanData = strategy.cleanData;
    strategy.cleanData = function(nodes) {
        beforeCleanDataFunc(nodes);
        var result = cleanData.call(this, nodes);
        afterCleanDataFunc(nodes);
        return result
    }
};
exports.setDataStrategy = setDataStrategy;
setDataStrategy({
    data: function() {
        var element = arguments[0];
        var key = arguments[1];
        var value = arguments[2];
        if (!element) {
            return
        }
        var elementData = dataMap.get(element);
        if (!elementData) {
            elementData = {};
            dataMap.set(element, elementData)
        }
        if (void 0 === key) {
            return elementData
        }
        if (2 === arguments.length) {
            return elementData[key]
        }
        elementData[key] = value;
        return value
    },
    removeData: function(element, key) {
        if (!element) {
            return
        }
        if (void 0 === key) {
            dataMap.delete(element)
        } else {
            var elementData = dataMap.get(element);
            if (elementData) {
                delete elementData[key]
            }
        }
    },
    cleanData: function(elements) {
        for (var i = 0; i < elements.length; i++) {
            _events_engine.default.off(elements[i]);
            dataMap.delete(elements[i])
        }
    }
});

function getDataStrategy() {
    return strategy
}

function data() {
    return strategy.data.apply(this, arguments)
}

function beforeCleanData(callback) {
    beforeCleanDataFunc = callback
}

function afterCleanData(callback) {
    afterCleanDataFunc = callback
}

function cleanData(nodes) {
    return strategy.cleanData.call(this, nodes)
}

function removeData(element, key) {
    return strategy.removeData.call(this, element, key)
}

function cleanDataRecursive(element, cleanSelf) {
    if (!_dom_adapter.default.isElementNode(element)) {
        return
    }
    var childElements = element.getElementsByTagName("*");
    strategy.cleanData(childElements);
    if (cleanSelf) {
        strategy.cleanData([element])
    }
}


/***/ }),

/***/ "./node_modules/devextreme/core/errors.js":
/*!************************************************!*\
  !*** ./node_modules/devextreme/core/errors.js ***!
  \************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/**
 * DevExtreme (core/errors.js)
 * Version: 20.2.3
 * Build date: Tue Oct 20 2020
 *
 * Copyright (c) 2012 - 2020 Developer Express Inc. ALL RIGHTS RESERVED
 * Read about DevExtreme licensing here: https://js.devexpress.com/Licensing/
 */

exports.default = void 0;
var _error = _interopRequireDefault(__webpack_require__(/*! ./utils/error */ "./node_modules/devextreme/core/utils/error.js"));

function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
        "default": obj
    }
}
var _default = (0, _error.default)({
    E0001: "Method is not implemented",
    E0002: "Member name collision: {0}",
    E0003: "A class must be instantiated using the 'new' keyword",
    E0004: "The NAME property of the component is not specified",
    E0005: "Unknown device",
    E0006: "Unknown endpoint key is requested",
    E0007: "'Invalidate' method is called outside the update transaction",
    E0008: "Type of the option name is not appropriate to create an action",
    E0009: "Component '{0}' has not been initialized for an element",
    E0010: "Animation configuration with the '{0}' type requires '{1}' configuration as {2}",
    E0011: "Unknown animation type '{0}'",
    E0012: "jQuery version is too old. Please upgrade jQuery to 1.10.0 or later",
    E0013: "KnockoutJS version is too old. Please upgrade KnockoutJS to 2.3.0 or later",
    E0014: "The 'release' method shouldn't be called for an unlocked Lock object",
    E0015: "Queued task returned an unexpected result",
    E0017: "Event namespace is not defined",
    E0018: "DevExpress.ui.DevExpressPopup widget is required",
    E0020: "Template engine '{0}' is not supported",
    E0021: "Unknown theme is set: {0}",
    E0022: "LINK[rel=DevExpress-theme] tags must go before DevExpress included scripts",
    E0023: "Template name is not specified",
    E0024: "DevExtreme bundle already included",
    E0025: "Unexpected argument type",
    E0100: "Unknown validation type is detected",
    E0101: "Misconfigured range validation rule is detected",
    E0102: "Misconfigured comparison validation rule is detected",
    E0103: "validationCallback of an asynchronous rule should return a jQuery or a native promise",
    E0110: "Unknown validation group is detected",
    E0120: "Adapter for a DevExpressValidator component cannot be configured",
    E0121: "The 'customItem' field of the 'onCustomItemCreating' function's parameter should contain a custom item or Promise that is resolved after the item is created.",
    W0000: "'{0}' is deprecated in {1}. {2}",
    W0001: "{0} - '{1}' option is deprecated in {2}. {3}",
    W0002: "{0} - '{1}' method is deprecated in {2}. {3}",
    W0003: "{0} - '{1}' property is deprecated in {2}. {3}",
    W0004: "Timeout for theme loading is over: {0}",
    W0005: "'{0}' event is deprecated in {1}. {2}",
    W0006: "Invalid recurrence rule: '{0}'",
    W0007: "'{0}' Globalize culture is not defined",
    W0008: "Invalid view name: '{0}'",
    W0009: "Invalid time zone name: '{0}'",
    W0010: "{0} is deprecated in {1}. {2}",
    W0011: "Number parsing is invoked while the parser is not defined",
    W0012: "Date parsing is invoked while the parser is not defined",
    W0013: "'{0}' file is deprecated in {1}. {2}",
    W0014: "{0} - '{1}' type is deprecated in {2}. {3}",
    W0015: "Instead of returning a value from the '{0}' function, write it into the '{1}' field of the function's parameter.",
    W0016: 'The "{0}" option does not accept the "{1}" value since v.{2}. {3}.'
});
exports.default = _default;
module.exports = exports.default;


/***/ }),

/***/ "./node_modules/devextreme/core/events_strategy.js":
/*!*********************************************************!*\
  !*** ./node_modules/devextreme/core/events_strategy.js ***!
  \*********************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/**
 * DevExtreme (core/events_strategy.js)
 * Version: 20.2.3
 * Build date: Tue Oct 20 2020
 *
 * Copyright (c) 2012 - 2020 Developer Express Inc. ALL RIGHTS RESERVED
 * Read about DevExtreme licensing here: https://js.devexpress.com/Licensing/
 */

exports.EventsStrategy = void 0;
var _callbacks = _interopRequireDefault(__webpack_require__(/*! ./utils/callbacks */ "./node_modules/devextreme/core/utils/callbacks.js"));
var _iterator = __webpack_require__(/*! ./utils/iterator */ "./node_modules/devextreme/core/utils/iterator.js");
var _type = __webpack_require__(/*! ./utils/type */ "./node_modules/devextreme/core/utils/type.js");

function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
        "default": obj
    }
}

function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
        throw new TypeError("Cannot call a class as a function")
    }
}

function _defineProperties(target, props) {
    for (var i = 0; i < props.length; i++) {
        var descriptor = props[i];
        descriptor.enumerable = descriptor.enumerable || false;
        descriptor.configurable = true;
        if ("value" in descriptor) {
            descriptor.writable = true
        }
        Object.defineProperty(target, descriptor.key, descriptor)
    }
}

function _createClass(Constructor, protoProps, staticProps) {
    if (protoProps) {
        _defineProperties(Constructor.prototype, protoProps)
    }
    if (staticProps) {
        _defineProperties(Constructor, staticProps)
    }
    return Constructor
}
var EventsStrategy = function() {
    function EventsStrategy(owner) {
        _classCallCheck(this, EventsStrategy);
        this._events = {};
        this._owner = owner
    }
    _createClass(EventsStrategy, [{
        key: "hasEvent",
        value: function(eventName) {
            var callbacks = this._events[eventName];
            return callbacks ? callbacks.has() : false
        }
    }, {
        key: "fireEvent",
        value: function(eventName, eventArgs) {
            var callbacks = this._events[eventName];
            if (callbacks) {
                callbacks.fireWith(this._owner, eventArgs)
            }
            return this._owner
        }
    }, {
        key: "on",
        value: function(eventName, eventHandler) {
            var _this = this;
            if ((0, _type.isPlainObject)(eventName)) {
                (0, _iterator.each)(eventName, function(e, h) {
                    _this.on(e, h)
                })
            } else {
                var callbacks = this._events[eventName];
                if (!callbacks) {
                    callbacks = (0, _callbacks.default)();
                    this._events[eventName] = callbacks
                }
                var addFn = callbacks.originalAdd || callbacks.add;
                addFn.call(callbacks, eventHandler)
            }
        }
    }, {
        key: "off",
        value: function(eventName, eventHandler) {
            var callbacks = this._events[eventName];
            if (callbacks) {
                if ((0, _type.isFunction)(eventHandler)) {
                    callbacks.remove(eventHandler)
                } else {
                    callbacks.empty()
                }
            }
        }
    }, {
        key: "dispose",
        value: function() {
            (0, _iterator.each)(this._events, function(eventName, event) {
                event.empty()
            })
        }
    }], [{
        key: "create",
        value: function(owner, strategy) {
            if (strategy) {
                return (0, _type.isFunction)(strategy) ? strategy(owner) : strategy
            } else {
                return new EventsStrategy(owner)
            }
        }
    }]);
    return EventsStrategy
}();
exports.EventsStrategy = EventsStrategy;


/***/ }),

/***/ "./node_modules/devextreme/core/guid.js":
/*!**********************************************!*\
  !*** ./node_modules/devextreme/core/guid.js ***!
  \**********************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/**
 * DevExtreme (core/guid.js)
 * Version: 20.2.3
 * Build date: Tue Oct 20 2020
 *
 * Copyright (c) 2012 - 2020 Developer Express Inc. ALL RIGHTS RESERVED
 * Read about DevExtreme licensing here: https://js.devexpress.com/Licensing/
 */

exports.default = void 0;
var _class = _interopRequireDefault(__webpack_require__(/*! ./class */ "./node_modules/devextreme/core/class.js"));

function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
        "default": obj
    }
}
var Guid = _class.default.inherit({
    ctor: function(value) {
        if (value) {
            value = String(value)
        }
        this._value = this._normalize(value || this._generate())
    },
    _normalize: function(value) {
        value = value.replace(/[^a-f0-9]/gi, "").toLowerCase();
        while (value.length < 32) {
            value += "0"
        }
        return [value.substr(0, 8), value.substr(8, 4), value.substr(12, 4), value.substr(16, 4), value.substr(20, 12)].join("-")
    },
    _generate: function() {
        var value = "";
        for (var i = 0; i < 32; i++) {
            value += Math.round(15 * Math.random()).toString(16)
        }
        return value
    },
    toString: function() {
        return this._value
    },
    valueOf: function() {
        return this._value
    },
    toJSON: function() {
        return this._value
    }
});
var _default = Guid;
exports.default = _default;
module.exports = exports.default;
module.exports.default = module.exports;


/***/ }),

/***/ "./node_modules/devextreme/core/memorized_callbacks.js":
/*!*************************************************************!*\
  !*** ./node_modules/devextreme/core/memorized_callbacks.js ***!
  \*************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/**
 * DevExtreme (core/memorized_callbacks.js)
 * Version: 20.2.3
 * Build date: Tue Oct 20 2020
 *
 * Copyright (c) 2012 - 2020 Developer Express Inc. ALL RIGHTS RESERVED
 * Read about DevExtreme licensing here: https://js.devexpress.com/Licensing/
 */

exports.default = void 0;
var _iterator = __webpack_require__(/*! ../core/utils/iterator */ "./node_modules/devextreme/core/utils/iterator.js");
var _callbacks = _interopRequireDefault(__webpack_require__(/*! ./utils/callbacks */ "./node_modules/devextreme/core/utils/callbacks.js"));

function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
        "default": obj
    }
}

function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
        throw new TypeError("Cannot call a class as a function")
    }
}

function _defineProperties(target, props) {
    for (var i = 0; i < props.length; i++) {
        var descriptor = props[i];
        descriptor.enumerable = descriptor.enumerable || false;
        descriptor.configurable = true;
        if ("value" in descriptor) {
            descriptor.writable = true
        }
        Object.defineProperty(target, descriptor.key, descriptor)
    }
}

function _createClass(Constructor, protoProps, staticProps) {
    if (protoProps) {
        _defineProperties(Constructor.prototype, protoProps)
    }
    if (staticProps) {
        _defineProperties(Constructor, staticProps)
    }
    return Constructor
}
var MemorizedCallbacks = function() {
    function MemorizedCallbacks() {
        _classCallCheck(this, MemorizedCallbacks);
        this.memory = [];
        this.callbacks = (0, _callbacks.default)()
    }
    _createClass(MemorizedCallbacks, [{
        key: "add",
        value: function(fn) {
            (0, _iterator.each)(this.memory, function(_, item) {
                return fn.apply(fn, item)
            });
            this.callbacks.add(fn)
        }
    }, {
        key: "remove",
        value: function(fn) {
            this.callbacks.remove(fn)
        }
    }, {
        key: "fire",
        value: function() {
            for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
                args[_key] = arguments[_key]
            }
            this.memory.push(args);
            this.callbacks.fire.apply(this.callbacks, args)
        }
    }]);
    return MemorizedCallbacks
}();
exports.default = MemorizedCallbacks;
module.exports = exports.default;


/***/ }),

/***/ "./node_modules/devextreme/core/options/index.js":
/*!*******************************************************!*\
  !*** ./node_modules/devextreme/core/options/index.js ***!
  \*******************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/**
 * DevExtreme (core/options/index.js)
 * Version: 20.2.3
 * Build date: Tue Oct 20 2020
 *
 * Copyright (c) 2012 - 2020 Developer Express Inc. ALL RIGHTS RESERVED
 * Read about DevExtreme licensing here: https://js.devexpress.com/Licensing/
 */

exports.Options = void 0;
var _type = __webpack_require__(/*! ../utils/type */ "./node_modules/devextreme/core/utils/type.js");
var _common = __webpack_require__(/*! ../utils/common */ "./node_modules/devextreme/core/utils/common.js");
var _option_manager = __webpack_require__(/*! ./option_manager */ "./node_modules/devextreme/core/options/option_manager.js");
var _object = __webpack_require__(/*! ../utils/object */ "./node_modules/devextreme/core/utils/object.js");
var _utils = __webpack_require__(/*! ./utils */ "./node_modules/devextreme/core/options/utils.js");
var _extend = __webpack_require__(/*! ../utils/extend */ "./node_modules/devextreme/core/utils/extend.js");

function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
        throw new TypeError("Cannot call a class as a function")
    }
}

function _defineProperties(target, props) {
    for (var i = 0; i < props.length; i++) {
        var descriptor = props[i];
        descriptor.enumerable = descriptor.enumerable || false;
        descriptor.configurable = true;
        if ("value" in descriptor) {
            descriptor.writable = true
        }
        Object.defineProperty(target, descriptor.key, descriptor)
    }
}

function _createClass(Constructor, protoProps, staticProps) {
    if (protoProps) {
        _defineProperties(Constructor.prototype, protoProps)
    }
    if (staticProps) {
        _defineProperties(Constructor, staticProps)
    }
    return Constructor
}
var Options = function() {
    function Options(options, defaultOptions, optionsByReference, deprecatedOptions) {
        var _this = this;
        _classCallCheck(this, Options);
        this._deprecatedCallback;
        this._startChangeCallback;
        this._endChangeCallback;
        this._default = defaultOptions;
        this._deprecated = deprecatedOptions;
        this._deprecatedNames = [];
        this._initDeprecatedNames();
        this._optionManager = new _option_manager.OptionManager(options, optionsByReference);
        this._optionManager.onRelevantNamesPrepared(function(options, name, value, silent) {
            return _this._setRelevantNames(options, name, value, silent)
        });
        this._cachedOptions = {};
        this._rules = []
    }
    _createClass(Options, [{
        key: "_initDeprecatedNames",
        value: function() {
            for (var optionName in this._deprecated) {
                this._deprecatedNames.push(optionName)
            }
        }
    }, {
        key: "_getByRules",
        value: function(rules) {
            rules = Array.isArray(rules) ? this._rules.concat(rules) : this._rules;
            return (0, _utils.convertRulesToOptions)(rules)
        }
    }, {
        key: "_notifyDeprecated",
        value: function(option) {
            var info = this._deprecated[option];
            if (info) {
                this._deprecatedCallback(option, info)
            }
        }
    }, {
        key: "_setRelevantNames",
        value: function(options, name, value, silent) {
            if (name) {
                var normalizedName = this._normalizeName(name, silent);
                if (normalizedName && normalizedName !== name) {
                    this._setField(options, normalizedName, value);
                    this._clearField(options, name)
                }
            }
        }
    }, {
        key: "_setField",
        value: function(options, fullName, value) {
            var fieldName = "";
            var fieldObject = null;
            do {
                fieldName = fieldName ? ".".concat(fieldName) : "";
                fieldName = (0, _utils.getFieldName)(fullName) + fieldName;
                fullName = (0, _utils.getParentName)(fullName);
                fieldObject = fullName ? this._optionManager.get(options, fullName, false) : options
            } while (!fieldObject);
            fieldObject[fieldName] = value
        }
    }, {
        key: "_clearField",
        value: function(options, name) {
            delete options[name];
            var previousFieldName = (0, _utils.getParentName)(name);
            var fieldObject = previousFieldName ? this._optionManager.get(options, previousFieldName, false) : options;
            if (fieldObject) {
                delete fieldObject[(0, _utils.getFieldName)(name)]
            }
        }
    }, {
        key: "_normalizeName",
        value: function(name, silent) {
            if (this._deprecatedNames.length && name) {
                for (var i = 0; i < this._deprecatedNames.length; i++) {
                    if (this._deprecatedNames[i] === name) {
                        var deprecate = this._deprecated[name];
                        if (deprecate) {
                            !silent && this._notifyDeprecated(name);
                            return deprecate.alias || name
                        }
                    }
                }
            }
            return name
        }
    }, {
        key: "addRules",
        value: function(rules) {
            this._rules = rules.concat(this._rules)
        }
    }, {
        key: "applyRules",
        value: function(rules) {
            var options = this._getByRules(rules);
            this.silent(options)
        }
    }, {
        key: "dispose",
        value: function() {
            this._deprecatedCallback = _common.noop;
            this._startChangeCallback = _common.noop;
            this._endChangeCallback = _common.noop;
            this._optionManager.dispose()
        }
    }, {
        key: "onChanging",
        value: function(callBack) {
            this._optionManager.onChanging(callBack)
        }
    }, {
        key: "onChanged",
        value: function(callBack) {
            this._optionManager.onChanged(callBack)
        }
    }, {
        key: "onDeprecated",
        value: function(callBack) {
            this._deprecatedCallback = callBack
        }
    }, {
        key: "onStartChange",
        value: function(callBack) {
            this._startChangeCallback = callBack
        }
    }, {
        key: "onEndChange",
        value: function(callBack) {
            this._endChangeCallback = callBack
        }
    }, {
        key: "isInitial",
        value: function(name) {
            var value = this.silent(name);
            var initialValue = this.initial(name);
            var areFunctions = (0, _type.isFunction)(value) && (0, _type.isFunction)(initialValue);
            return areFunctions ? value.toString() === initialValue.toString() : (0, _common.equalByValue)(value, initialValue)
        }
    }, {
        key: "initial",
        value: function(name) {
            return (0, _utils.getNestedOptionValue)(this._initial, name)
        }
    }, {
        key: "option",
        value: function(options, value) {
            var isGetter = arguments.length < 2 && "object" !== (0, _type.type)(options);
            if (isGetter) {
                return this._optionManager.get(void 0, this._normalizeName(options))
            } else {
                this._startChangeCallback();
                try {
                    this._optionManager.set(options, value)
                } finally {
                    this._endChangeCallback()
                }
            }
        }
    }, {
        key: "silent",
        value: function(options, value) {
            var isGetter = arguments.length < 2 && "object" !== (0, _type.type)(options);
            if (isGetter) {
                return this._optionManager.get(void 0, options, void 0, true)
            } else {
                this._optionManager.set(options, value, void 0, true)
            }
        }
    }, {
        key: "reset",
        value: function(name) {
            var _this2 = this;
            if (name) {
                var fullPath = name.replace(/\[([^\]])\]/g, ".$1").split(".");
                var value = fullPath.reduce(function(value, field) {
                    return value ? value[field] : _this2.initial(field)
                }, null);
                var defaultValue = (0, _type.isObject)(value) ? (0, _object.clone)(value) : value;
                this._optionManager.set(name, defaultValue, false)
            }
        }
    }, {
        key: "getAliasesByName",
        value: function(name) {
            var _this3 = this;
            return Object.keys(this._deprecated).filter(function(aliasName) {
                return name === _this3._deprecated[aliasName].alias
            })
        }
    }, {
        key: "isDeprecated",
        value: function(name) {
            return Object.prototype.hasOwnProperty.call(this._deprecated, name)
        }
    }, {
        key: "cache",
        value: function(name, options) {
            var isGetter = arguments.length < 2;
            if (isGetter) {
                return this._cachedOptions[name]
            } else {
                this._cachedOptions[name] = (0, _extend.extend)(this._cachedOptions[name], options)
            }
        }
    }, {
        key: "_initial",
        set: function(value) {
            this._initialOptions = value
        },
        get: function() {
            if (!this._initialOptions) {
                var rulesOptions = this._getByRules(this.silent("defaultOptionsRules"));
                this._initialOptions = this._default;
                this._optionManager._setByReference(this._initialOptions, rulesOptions)
            }
            return this._initialOptions
        }
    }]);
    return Options
}();
exports.Options = Options;


/***/ }),

/***/ "./node_modules/devextreme/core/options/option_manager.js":
/*!****************************************************************!*\
  !*** ./node_modules/devextreme/core/options/option_manager.js ***!
  \****************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/**
 * DevExtreme (core/options/option_manager.js)
 * Version: 20.2.3
 * Build date: Tue Oct 20 2020
 *
 * Copyright (c) 2012 - 2020 Developer Express Inc. ALL RIGHTS RESERVED
 * Read about DevExtreme licensing here: https://js.devexpress.com/Licensing/
 */

exports.OptionManager = void 0;
var _data = __webpack_require__(/*! ../utils/data */ "./node_modules/devextreme/core/utils/data.js");
var _common = __webpack_require__(/*! ../utils/common */ "./node_modules/devextreme/core/utils/common.js");
var _comparator = __webpack_require__(/*! ../utils/comparator */ "./node_modules/devextreme/core/utils/comparator.js");
var _extend = __webpack_require__(/*! ../utils/extend */ "./node_modules/devextreme/core/utils/extend.js");
var _type = __webpack_require__(/*! ../utils/type */ "./node_modules/devextreme/core/utils/type.js");
var _utils = __webpack_require__(/*! ./utils */ "./node_modules/devextreme/core/options/utils.js");

function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
        throw new TypeError("Cannot call a class as a function")
    }
}

function _defineProperties(target, props) {
    for (var i = 0; i < props.length; i++) {
        var descriptor = props[i];
        descriptor.enumerable = descriptor.enumerable || false;
        descriptor.configurable = true;
        if ("value" in descriptor) {
            descriptor.writable = true
        }
        Object.defineProperty(target, descriptor.key, descriptor)
    }
}

function _createClass(Constructor, protoProps, staticProps) {
    if (protoProps) {
        _defineProperties(Constructor.prototype, protoProps)
    }
    if (staticProps) {
        _defineProperties(Constructor, staticProps)
    }
    return Constructor
}
var cachedGetters = {};
var cachedSetters = {};
var OptionManager = function() {
    function OptionManager(options, optionsByReference) {
        _classCallCheck(this, OptionManager);
        this._options = options;
        this._optionsByReference = optionsByReference;
        this._changingCallback;
        this._changedCallback;
        this._namePreparedCallbacks
    }
    _createClass(OptionManager, [{
        key: "_setByReference",
        value: function(options, rulesOptions) {
            (0, _extend.extend)(true, options, rulesOptions);
            for (var fieldName in this._optionsByReference) {
                if (Object.prototype.hasOwnProperty.call(rulesOptions, fieldName)) {
                    options[fieldName] = rulesOptions[fieldName]
                }
            }
        }
    }, {
        key: "_setPreparedValue",
        value: function(name, value, merge, silent) {
            var previousValue = this.get(this._options, name, false);
            if (!(0, _comparator.equals)(previousValue, value)) {
                var path = name.split(/[.[]/);
                !silent && this._changingCallback(name, previousValue, value);
                cachedSetters[name] = cachedSetters[name] || (0, _data.compileSetter)(name);
                cachedSetters[name](this._options, value, {
                    functionsAsIs: true,
                    merge: (0, _type.isDefined)(merge) ? merge : !this._optionsByReference[name],
                    unwrapObservables: path.length > 1 && !!this._optionsByReference[path[0]]
                });
                !silent && this._changedCallback(name, value, previousValue)
            }
        }
    }, {
        key: "_prepareRelevantNames",
        value: function(options, name, value, silent) {
            if ((0, _type.isPlainObject)(value)) {
                for (var valueName in value) {
                    this._prepareRelevantNames(options, "".concat(name, ".").concat(valueName), value[valueName])
                }
            }
            this._namePreparedCallbacks(options, name, value, silent)
        }
    }, {
        key: "get",
        value: function() {
            var options = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : this._options;
            var name = arguments.length > 1 ? arguments[1] : void 0;
            var unwrapObservables = arguments.length > 2 ? arguments[2] : void 0;
            cachedGetters[name] = cachedGetters[name] || (0, _data.compileGetter)(name);
            return cachedGetters[name](options, {
                functionsAsIs: true,
                unwrapObservables: unwrapObservables
            })
        }
    }, {
        key: "set",
        value: function(options, value, merge, silent) {
            options = (0, _utils.normalizeOptions)(options, value);
            for (var name in options) {
                this._prepareRelevantNames(options, name, options[name], silent)
            }
            for (var _name in options) {
                this._setPreparedValue(_name, options[_name], merge, silent)
            }
        }
    }, {
        key: "onRelevantNamesPrepared",
        value: function(callBack) {
            this._namePreparedCallbacks = callBack
        }
    }, {
        key: "onChanging",
        value: function(callBack) {
            this._changingCallback = callBack
        }
    }, {
        key: "onChanged",
        value: function(callBack) {
            this._changedCallback = callBack
        }
    }, {
        key: "dispose",
        value: function() {
            this._changingCallback = _common.noop;
            this._changedCallback = _common.noop
        }
    }]);
    return OptionManager
}();
exports.OptionManager = OptionManager;


/***/ }),

/***/ "./node_modules/devextreme/core/options/utils.js":
/*!*******************************************************!*\
  !*** ./node_modules/devextreme/core/options/utils.js ***!
  \*******************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/**
 * DevExtreme (core/options/utils.js)
 * Version: 20.2.3
 * Build date: Tue Oct 20 2020
 *
 * Copyright (c) 2012 - 2020 Developer Express Inc. ALL RIGHTS RESERVED
 * Read about DevExtreme licensing here: https://js.devexpress.com/Licensing/
 */

exports.createDefaultOptionRules = exports.getNestedOptionValue = exports.getParentName = exports.getFieldName = exports.deviceMatch = exports.normalizeOptions = exports.convertRulesToOptions = void 0;
var _devices = _interopRequireDefault(__webpack_require__(/*! ../devices */ "./node_modules/devextreme/core/devices.js"));
var _type = __webpack_require__(/*! ../utils/type */ "./node_modules/devextreme/core/utils/type.js");
var _common = __webpack_require__(/*! ../utils/common */ "./node_modules/devextreme/core/utils/common.js");
var _extend = __webpack_require__(/*! ../utils/extend */ "./node_modules/devextreme/core/utils/extend.js");
var _data = __webpack_require__(/*! ../utils/data */ "./node_modules/devextreme/core/utils/data.js");

function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
        "default": obj
    }
}

function _defineProperty(obj, key, value) {
    if (key in obj) {
        Object.defineProperty(obj, key, {
            value: value,
            enumerable: true,
            configurable: true,
            writable: true
        })
    } else {
        obj[key] = value
    }
    return obj
}
var cachedGetters = {};
var convertRulesToOptions = function(rules) {
    var currentDevice = _devices.default.current();
    return rules.reduce(function(options, _ref) {
        var device = _ref.device,
            ruleOptions = _ref.options;
        var deviceFilter = device || {};
        var match = (0, _type.isFunction)(deviceFilter) ? deviceFilter(currentDevice) : deviceMatch(currentDevice, deviceFilter);
        if (match) {
            (0, _extend.extend)(true, options, ruleOptions)
        }
        return options
    }, {})
};
exports.convertRulesToOptions = convertRulesToOptions;
var normalizeOptions = function(options, value) {
    return "string" !== typeof options ? options : _defineProperty({}, options, value)
};
exports.normalizeOptions = normalizeOptions;
var deviceMatch = function(device, filter) {
    return (0, _type.isEmptyObject)(filter) || (0, _common.findBestMatches)(device, [filter]).length > 0
};
exports.deviceMatch = deviceMatch;
var getFieldName = function(fullName) {
    return fullName.substr(fullName.lastIndexOf(".") + 1)
};
exports.getFieldName = getFieldName;
var getParentName = function(fullName) {
    return fullName.substr(0, fullName.lastIndexOf("."))
};
exports.getParentName = getParentName;
var getNestedOptionValue = function(optionsObject, name) {
    cachedGetters[name] = cachedGetters[name] || (0, _data.compileGetter)(name);
    return cachedGetters[name](optionsObject, {
        functionsAsIs: true
    })
};
exports.getNestedOptionValue = getNestedOptionValue;
var createDefaultOptionRules = function() {
    var options = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : [];
    return options
};
exports.createDefaultOptionRules = createDefaultOptionRules;


/***/ }),

/***/ "./node_modules/devextreme/core/polyfills/promise.js":
/*!***********************************************************!*\
  !*** ./node_modules/devextreme/core/polyfills/promise.js ***!
  \***********************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/**
 * DevExtreme (core/polyfills/promise.js)
 * Version: 20.2.3
 * Build date: Tue Oct 20 2020
 *
 * Copyright (c) 2012 - 2020 Developer Express Inc. ALL RIGHTS RESERVED
 * Read about DevExtreme licensing here: https://js.devexpress.com/Licensing/
 */

exports.default = void 0;
var _deferred = __webpack_require__(/*! ../../core/utils/deferred */ "./node_modules/devextreme/core/utils/deferred.js");
var _window = __webpack_require__(/*! ../../core/utils/window */ "./node_modules/devextreme/core/utils/window.js");
var promise = (0, _window.hasWindow)() ? (0, _window.getWindow)().Promise : Promise;
if (!promise) {
    promise = function(resolver) {
        var d = new _deferred.Deferred;
        resolver(d.resolve.bind(this), d.reject.bind(this));
        return d.promise()
    };
    promise.resolve = function(val) {
        return (new _deferred.Deferred).resolve(val).promise()
    };
    promise.reject = function(val) {
        return (new _deferred.Deferred).reject(val).promise()
    };
    promise.all = function(promises) {
        return _deferred.when.apply(this, promises).then(function() {
            return [].slice.call(arguments)
        })
    }
}
var _default = promise;
exports.default = _default;
module.exports = exports.default;


/***/ }),

/***/ "./node_modules/devextreme/core/polyfills/weak_map.js":
/*!************************************************************!*\
  !*** ./node_modules/devextreme/core/polyfills/weak_map.js ***!
  \************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/**
 * DevExtreme (core/polyfills/weak_map.js)
 * Version: 20.2.3
 * Build date: Tue Oct 20 2020
 *
 * Copyright (c) 2012 - 2020 Developer Express Inc. ALL RIGHTS RESERVED
 * Read about DevExtreme licensing here: https://js.devexpress.com/Licensing/
 */

exports.default = void 0;
var _array = __webpack_require__(/*! ../utils/array */ "./node_modules/devextreme/core/utils/array.js");
var _window = __webpack_require__(/*! ../utils/window */ "./node_modules/devextreme/core/utils/window.js");
var weakMap = (0, _window.hasWindow)() ? (0, _window.getWindow)().WeakMap : WeakMap;
if (!weakMap) {
    weakMap = function() {
        var keys = [];
        var values = [];
        this.set = function(key, value) {
            var index = (0, _array.inArray)(key, keys);
            if (index === -1) {
                keys.push(key);
                values.push(value)
            } else {
                values[index] = value
            }
        };
        this.get = function(key) {
            var index = (0, _array.inArray)(key, keys);
            if (index === -1) {
                return
            }
            return values[index]
        };
        this.has = function(key) {
            var index = (0, _array.inArray)(key, keys);
            if (index === -1) {
                return false
            }
            return true
        };
        this.delete = function(key) {
            var index = (0, _array.inArray)(key, keys);
            if (index === -1) {
                return
            }
            keys.splice(index, 1);
            values.splice(index, 1)
        }
    }
}
var _default = weakMap;
exports.default = _default;
module.exports = exports.default;


/***/ }),

/***/ "./node_modules/devextreme/core/postponed_operations.js":
/*!**************************************************************!*\
  !*** ./node_modules/devextreme/core/postponed_operations.js ***!
  \**************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/**
 * DevExtreme (core/postponed_operations.js)
 * Version: 20.2.3
 * Build date: Tue Oct 20 2020
 *
 * Copyright (c) 2012 - 2020 Developer Express Inc. ALL RIGHTS RESERVED
 * Read about DevExtreme licensing here: https://js.devexpress.com/Licensing/
 */

exports.PostponedOperations = void 0;
var _deferred = __webpack_require__(/*! ./utils/deferred */ "./node_modules/devextreme/core/utils/deferred.js");
var _type = __webpack_require__(/*! ./utils/type */ "./node_modules/devextreme/core/utils/type.js");

function _toConsumableArray(arr) {
    return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _unsupportedIterableToArray(arr) || _nonIterableSpread()
}

function _nonIterableSpread() {
    throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")
}

function _unsupportedIterableToArray(o, minLen) {
    if (!o) {
        return
    }
    if ("string" === typeof o) {
        return _arrayLikeToArray(o, minLen)
    }
    var n = Object.prototype.toString.call(o).slice(8, -1);
    if ("Object" === n && o.constructor) {
        n = o.constructor.name
    }
    if ("Map" === n || "Set" === n) {
        return Array.from(o)
    }
    if ("Arguments" === n || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) {
        return _arrayLikeToArray(o, minLen)
    }
}

function _iterableToArray(iter) {
    if ("undefined" !== typeof Symbol && Symbol.iterator in Object(iter)) {
        return Array.from(iter)
    }
}

function _arrayWithoutHoles(arr) {
    if (Array.isArray(arr)) {
        return _arrayLikeToArray(arr)
    }
}

function _arrayLikeToArray(arr, len) {
    if (null == len || len > arr.length) {
        len = arr.length
    }
    for (var i = 0, arr2 = new Array(len); i < len; i++) {
        arr2[i] = arr[i]
    }
    return arr2
}

function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
        throw new TypeError("Cannot call a class as a function")
    }
}

function _defineProperties(target, props) {
    for (var i = 0; i < props.length; i++) {
        var descriptor = props[i];
        descriptor.enumerable = descriptor.enumerable || false;
        descriptor.configurable = true;
        if ("value" in descriptor) {
            descriptor.writable = true
        }
        Object.defineProperty(target, descriptor.key, descriptor)
    }
}

function _createClass(Constructor, protoProps, staticProps) {
    if (protoProps) {
        _defineProperties(Constructor.prototype, protoProps)
    }
    if (staticProps) {
        _defineProperties(Constructor, staticProps)
    }
    return Constructor
}
var PostponedOperations = function() {
    function PostponedOperations() {
        _classCallCheck(this, PostponedOperations);
        this._postponedOperations = {}
    }
    _createClass(PostponedOperations, [{
        key: "add",
        value: function(key, fn, postponedPromise) {
            if (key in this._postponedOperations) {
                postponedPromise && this._postponedOperations[key].promises.push(postponedPromise)
            } else {
                var completePromise = new _deferred.Deferred;
                this._postponedOperations[key] = {
                    fn: fn,
                    completePromise: completePromise,
                    promises: postponedPromise ? [postponedPromise] : []
                }
            }
            return this._postponedOperations[key].completePromise.promise()
        }
    }, {
        key: "callPostponedOperations",
        value: function() {
            for (var key in this._postponedOperations) {
                var operation = this._postponedOperations[key];
                if ((0, _type.isDefined)(operation)) {
                    if (operation.promises && operation.promises.length) {
                        _deferred.when.apply(void 0, _toConsumableArray(operation.promises)).done(operation.fn).then(operation.completePromise.resolve)
                    } else {
                        operation.fn().done(operation.completePromise.resolve)
                    }
                }
            }
            this._postponedOperations = {}
        }
    }]);
    return PostponedOperations
}();
exports.PostponedOperations = PostponedOperations;


/***/ }),

/***/ "./node_modules/devextreme/core/remove_event.js":
/*!******************************************************!*\
  !*** ./node_modules/devextreme/core/remove_event.js ***!
  \******************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/**
 * DevExtreme (core/remove_event.js)
 * Version: 20.2.3
 * Build date: Tue Oct 20 2020
 *
 * Copyright (c) 2012 - 2020 Developer Express Inc. ALL RIGHTS RESERVED
 * Read about DevExtreme licensing here: https://js.devexpress.com/Licensing/
 */

exports.default = void 0;
var _renderer = _interopRequireDefault(__webpack_require__(/*! ./renderer */ "./node_modules/devextreme/core/renderer.js"));
var _element_data = __webpack_require__(/*! ./element_data */ "./node_modules/devextreme/core/element_data.js");
var _events_engine = _interopRequireDefault(__webpack_require__(/*! ../events/core/events_engine */ "./node_modules/devextreme/events/core/events_engine.js"));
var _event_registrator = _interopRequireDefault(__webpack_require__(/*! ../events/core/event_registrator */ "./node_modules/devextreme/events/core/event_registrator.js"));

function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
        "default": obj
    }
}
var eventName = "dxremove";
var eventPropName = "dxRemoveEvent";
(0, _element_data.beforeCleanData)(function(elements) {
    elements = [].slice.call(elements);
    for (var i = 0; i < elements.length; i++) {
        var $element = (0, _renderer.default)(elements[i]);
        if ($element.prop(eventPropName)) {
            $element[0][eventPropName] = null;
            _events_engine.default.triggerHandler($element, eventName)
        }
    }
});
(0, _event_registrator.default)(eventName, {
    noBubble: true,
    setup: function(element) {
        (0, _renderer.default)(element).prop(eventPropName, true)
    }
});
var _default = eventName;
exports.default = _default;
module.exports = exports.default;


/***/ }),

/***/ "./node_modules/devextreme/core/renderer.js":
/*!**************************************************!*\
  !*** ./node_modules/devextreme/core/renderer.js ***!
  \**************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/**
 * DevExtreme (core/renderer.js)
 * Version: 20.2.3
 * Build date: Tue Oct 20 2020
 *
 * Copyright (c) 2012 - 2020 Developer Express Inc. ALL RIGHTS RESERVED
 * Read about DevExtreme licensing here: https://js.devexpress.com/Licensing/
 */

exports.default = void 0;
var _renderer_base = _interopRequireDefault(__webpack_require__(/*! ./renderer_base */ "./node_modules/devextreme/core/renderer_base.js"));

function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
        "default": obj
    }
}
var _default = _renderer_base.default.get();
exports.default = _default;
module.exports = exports.default;


/***/ }),

/***/ "./node_modules/devextreme/core/renderer_base.js":
/*!*******************************************************!*\
  !*** ./node_modules/devextreme/core/renderer_base.js ***!
  \*******************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/**
 * DevExtreme (core/renderer_base.js)
 * Version: 20.2.3
 * Build date: Tue Oct 20 2020
 *
 * Copyright (c) 2012 - 2020 Developer Express Inc. ALL RIGHTS RESERVED
 * Read about DevExtreme licensing here: https://js.devexpress.com/Licensing/
 */

exports.default = void 0;
var _element_data = __webpack_require__(/*! ./element_data */ "./node_modules/devextreme/core/element_data.js");
var _dom_adapter = _interopRequireDefault(__webpack_require__(/*! ./dom_adapter */ "./node_modules/devextreme/core/dom_adapter.js"));
var _window = __webpack_require__(/*! ./utils/window */ "./node_modules/devextreme/core/utils/window.js");
var _type = __webpack_require__(/*! ./utils/type */ "./node_modules/devextreme/core/utils/type.js");
var _style = __webpack_require__(/*! ./utils/style */ "./node_modules/devextreme/core/utils/style.js");
var _size = __webpack_require__(/*! ./utils/size */ "./node_modules/devextreme/core/utils/size.js");
var _html_parser = __webpack_require__(/*! ./utils/html_parser */ "./node_modules/devextreme/core/utils/html_parser.js");

function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
        "default": obj
    }
}
var window = (0, _window.getWindow)();
var renderer;
var initRender = function(selector, context) {
    if (!selector) {
        this.length = 0;
        return this
    }
    if ("string" === typeof selector) {
        if ("body" === selector) {
            this[0] = context ? context.body : _dom_adapter.default.getBody();
            this.length = 1;
            return this
        }
        context = context || _dom_adapter.default.getDocument();
        if ("<" === selector[0]) {
            this[0] = _dom_adapter.default.createElement(selector.slice(1, -1), context);
            this.length = 1;
            return this
        } [].push.apply(this, _dom_adapter.default.querySelectorAll(context, selector));
        return this
    } else {
        if (_dom_adapter.default.isNode(selector) || (0, _type.isWindow)(selector)) {
            this[0] = selector;
            this.length = 1;
            return this
        } else {
            if (Array.isArray(selector)) {
                [].push.apply(this, selector);
                return this
            }
        }
    }
    return renderer(selector.toArray ? selector.toArray() : [selector])
};
renderer = function(selector, context) {
    return new initRender(selector, context)
};
renderer.fn = {
    dxRenderer: true
};
initRender.prototype = renderer.fn;
var repeatMethod = function(methodName, args) {
    for (var i = 0; i < this.length; i++) {
        var item = renderer(this[i]);
        item[methodName].apply(item, args)
    }
    return this
};
var setAttributeValue = function(element, attrName, value) {
    if (void 0 !== value && null !== value) {
        _dom_adapter.default.setAttribute(element, attrName, value)
    } else {
        _dom_adapter.default.removeAttribute(element, attrName)
    }
};
initRender.prototype.show = function() {
    return this.toggle(true)
};
initRender.prototype.hide = function() {
    return this.toggle(false)
};
initRender.prototype.toggle = function(value) {
    if (this[0]) {
        this.toggleClass("dx-state-invisible", !value)
    }
    return this
};
initRender.prototype.attr = function(attrName, value) {
    if (this.length > 1 && arguments.length > 1) {
        return repeatMethod.call(this, "attr", arguments)
    }
    if (!this[0]) {
        if ((0, _type.isObject)(attrName) || void 0 !== value) {
            return this
        } else {
            return
        }
    }
    if (!this[0].getAttribute) {
        return this.prop(attrName, value)
    }
    if ("string" === typeof attrName && 1 === arguments.length) {
        var result = this[0].getAttribute(attrName);
        return null == result ? void 0 : result
    } else {
        if ((0, _type.isPlainObject)(attrName)) {
            for (var key in attrName) {
                this.attr(key, attrName[key])
            }
        } else {
            setAttributeValue(this[0], attrName, value)
        }
    }
    return this
};
initRender.prototype.removeAttr = function(attrName) {
    this[0] && _dom_adapter.default.removeAttribute(this[0], attrName);
    return this
};
initRender.prototype.prop = function(propName, value) {
    if (!this[0]) {
        return this
    }
    if ("string" === typeof propName && 1 === arguments.length) {
        return this[0][propName]
    } else {
        if ((0, _type.isPlainObject)(propName)) {
            for (var key in propName) {
                this.prop(key, propName[key])
            }
        } else {
            _dom_adapter.default.setProperty(this[0], propName, value)
        }
    }
    return this
};
initRender.prototype.addClass = function(className) {
    return this.toggleClass(className, true)
};
initRender.prototype.removeClass = function(className) {
    return this.toggleClass(className, false)
};
initRender.prototype.hasClass = function(className) {
    if (!this[0] || void 0 === this[0].className) {
        return false
    }
    var classNames = className.split(" ");
    for (var i = 0; i < classNames.length; i++) {
        if (this[0].classList) {
            if (this[0].classList.contains(classNames[i])) {
                return true
            }
        } else {
            var _className = (0, _type.isString)(this[0].className) ? this[0].className : _dom_adapter.default.getAttribute(this[0], "class");
            if ((_className || "").split(" ").indexOf(classNames[i]) >= 0) {
                return true
            }
        }
    }
    return false
};
initRender.prototype.toggleClass = function(className, value) {
    if (this.length > 1) {
        return repeatMethod.call(this, "toggleClass", arguments)
    }
    if (!this[0] || !className) {
        return this
    }
    value = void 0 === value ? !this.hasClass(className) : value;
    var classNames = className.split(" ");
    for (var i = 0; i < classNames.length; i++) {
        _dom_adapter.default.setClass(this[0], classNames[i], value)
    }
    return this
};
["width", "height", "outerWidth", "outerHeight", "innerWidth", "innerHeight"].forEach(function(methodName) {
    var partialName = methodName.toLowerCase().indexOf("width") >= 0 ? "Width" : "Height";
    var propName = partialName.toLowerCase();
    var isOuter = 0 === methodName.indexOf("outer");
    var isInner = 0 === methodName.indexOf("inner");
    initRender.prototype[methodName] = function(value) {
        if (this.length > 1 && arguments.length > 0) {
            return repeatMethod.call(this, methodName, arguments)
        }
        var element = this[0];
        if (!element) {
            return
        }
        if ((0, _type.isWindow)(element)) {
            return isOuter ? element["inner" + partialName] : _dom_adapter.default.getDocumentElement()["client" + partialName]
        }
        if (_dom_adapter.default.isDocument(element)) {
            var documentElement = _dom_adapter.default.getDocumentElement();
            var body = _dom_adapter.default.getBody();
            return Math.max(body["scroll" + partialName], body["offset" + partialName], documentElement["scroll" + partialName], documentElement["offset" + partialName], documentElement["client" + partialName])
        }
        if (0 === arguments.length || "boolean" === typeof value) {
            var include = {
                paddings: isInner || isOuter,
                borders: isOuter,
                margins: value
            };
            return (0, _size.getSize)(element, propName, include)
        }
        if (void 0 === value || null === value) {
            return this
        }
        if ((0, _type.isNumeric)(value)) {
            var elementStyles = window.getComputedStyle(element);
            var sizeAdjustment = (0, _size.getElementBoxParams)(propName, elementStyles);
            var isBorderBox = "border-box" === elementStyles.boxSizing;
            value = Number(value);
            if (isOuter) {
                value -= isBorderBox ? 0 : sizeAdjustment.border + sizeAdjustment.padding
            } else {
                if (isInner) {
                    value += isBorderBox ? sizeAdjustment.border : -sizeAdjustment.padding
                } else {
                    if (isBorderBox) {
                        value += sizeAdjustment.border + sizeAdjustment.padding
                    }
                }
            }
        }
        value += (0, _type.isNumeric)(value) ? "px" : "";
        _dom_adapter.default.setStyle(element, propName, value);
        return this
    }
});
initRender.prototype.html = function(value) {
    if (!arguments.length) {
        return this[0].innerHTML
    }
    this.empty();
    if ("string" === typeof value && !(0, _html_parser.isTablePart)(value) || "number" === typeof value) {
        this[0].innerHTML = value;
        return this
    }
    return this.append((0, _html_parser.parseHTML)(value))
};
var appendElements = function(element, nextSibling) {
    if (!this[0] || !element) {
        return
    }
    if ("string" === typeof element) {
        element = (0, _html_parser.parseHTML)(element)
    } else {
        if (element.nodeType) {
            element = [element]
        } else {
            if ((0, _type.isNumeric)(element)) {
                element = [_dom_adapter.default.createTextNode(element)]
            }
        }
    }
    for (var i = 0; i < element.length; i++) {
        var item = element[i];
        var container = this[0];
        var wrapTR = "TABLE" === container.tagName && "TR" === item.tagName;
        if (wrapTR && container.tBodies && container.tBodies.length) {
            container = container.tBodies[0]
        }
        _dom_adapter.default.insertElement(container, item.nodeType ? item : item[0], nextSibling)
    }
};
var setCss = function(name, value) {
    if (!this[0] || !this[0].style) {
        return
    }
    if (null === value || "number" === typeof value && isNaN(value)) {
        return
    }
    name = (0, _style.styleProp)(name);
    for (var i = 0; i < this.length; i++) {
        this[i].style[name] = (0, _style.normalizeStyleProp)(name, value)
    }
};
initRender.prototype.css = function(name, value) {
    if ((0, _type.isString)(name)) {
        if (2 === arguments.length) {
            setCss.call(this, name, value)
        } else {
            if (!this[0]) {
                return
            }
            name = (0, _style.styleProp)(name);
            var result = window.getComputedStyle(this[0])[name] || this[0].style[name];
            return (0, _type.isNumeric)(result) ? result.toString() : result
        }
    } else {
        if ((0, _type.isPlainObject)(name)) {
            for (var key in name) {
                setCss.call(this, key, name[key])
            }
        }
    }
    return this
};
initRender.prototype.prepend = function(element) {
    if (arguments.length > 1) {
        for (var i = 0; i < arguments.length; i++) {
            this.prepend(arguments[i])
        }
        return this
    }
    appendElements.apply(this, [element, this[0].firstChild]);
    return this
};
initRender.prototype.append = function(element) {
    if (arguments.length > 1) {
        for (var i = 0; i < arguments.length; i++) {
            this.append(arguments[i])
        }
        return this
    }
    appendElements.apply(this, [element]);
    return this
};
initRender.prototype.prependTo = function(element) {
    if (this.length > 1) {
        for (var i = this.length - 1; i >= 0; i--) {
            renderer(this[i]).prependTo(element)
        }
        return this
    }
    element = renderer(element);
    if (element[0]) {
        _dom_adapter.default.insertElement(element[0], this[0], element[0].firstChild)
    }
    return this
};
initRender.prototype.appendTo = function(element) {
    if (this.length > 1) {
        return repeatMethod.call(this, "appendTo", arguments)
    }
    _dom_adapter.default.insertElement(renderer(element)[0], this[0]);
    return this
};
initRender.prototype.insertBefore = function(element) {
    if (element && element[0]) {
        _dom_adapter.default.insertElement(element[0].parentNode, this[0], element[0])
    }
    return this
};
initRender.prototype.insertAfter = function(element) {
    if (element && element[0]) {
        _dom_adapter.default.insertElement(element[0].parentNode, this[0], element[0].nextSibling)
    }
    return this
};
initRender.prototype.before = function(element) {
    if (this[0]) {
        _dom_adapter.default.insertElement(this[0].parentNode, element[0], this[0])
    }
    return this
};
initRender.prototype.after = function(element) {
    if (this[0]) {
        _dom_adapter.default.insertElement(this[0].parentNode, element[0], this[0].nextSibling)
    }
    return this
};
initRender.prototype.wrap = function(wrapper) {
    if (this[0]) {
        var wrap = renderer(wrapper);
        wrap.insertBefore(this);
        wrap.append(this)
    }
    return this
};
initRender.prototype.wrapInner = function(wrapper) {
    var contents = this.contents();
    if (contents.length) {
        contents.wrap(wrapper)
    } else {
        this.append(wrapper)
    }
    return this
};
initRender.prototype.replaceWith = function(element) {
    if (!(element && element[0])) {
        return
    }
    if (element.is(this)) {
        return this
    }
    element.insertBefore(this);
    this.remove();
    return element
};
initRender.prototype.remove = function() {
    if (this.length > 1) {
        return repeatMethod.call(this, "remove", arguments)
    }(0, _element_data.cleanDataRecursive)(this[0], true);
    _dom_adapter.default.removeElement(this[0]);
    return this
};
initRender.prototype.detach = function() {
    if (this.length > 1) {
        return repeatMethod.call(this, "detach", arguments)
    }
    _dom_adapter.default.removeElement(this[0]);
    return this
};
initRender.prototype.empty = function() {
    if (this.length > 1) {
        return repeatMethod.call(this, "empty", arguments)
    }(0, _element_data.cleanDataRecursive)(this[0]);
    _dom_adapter.default.setText(this[0], "");
    return this
};
initRender.prototype.clone = function() {
    var result = [];
    for (var i = 0; i < this.length; i++) {
        result.push(this[i].cloneNode(true))
    }
    return renderer(result)
};
initRender.prototype.text = function(value) {
    if (!arguments.length) {
        var result = "";
        for (var i = 0; i < this.length; i++) {
            result += this[i] && this[i].textContent || ""
        }
        return result
    }
    var text = (0, _type.isFunction)(value) ? value() : value;
    (0, _element_data.cleanDataRecursive)(this[0], false);
    _dom_adapter.default.setText(this[0], (0, _type.isDefined)(text) ? text : "");
    return this
};
initRender.prototype.val = function(value) {
    if (1 === arguments.length) {
        return this.prop("value", (0, _type.isDefined)(value) ? value : "")
    }
    return this.prop("value")
};
initRender.prototype.contents = function() {
    if (!this[0]) {
        return renderer()
    }
    var result = [];
    result.push.apply(result, this[0].childNodes);
    return renderer(result)
};
initRender.prototype.find = function(selector) {
    var result = renderer();
    if (!selector) {
        return result
    }
    var nodes = [];
    var i;
    if ("string" === typeof selector) {
        selector = selector.trim();
        for (i = 0; i < this.length; i++) {
            var element = this[i];
            if (_dom_adapter.default.isElementNode(element)) {
                var elementId = element.getAttribute("id");
                var queryId = elementId || "dx-query-children";
                if (!elementId) {
                    setAttributeValue(element, "id", queryId)
                }
                queryId = "[id='" + queryId + "'] ";
                var querySelector = queryId + selector.replace(/([^\\])(,)/g, "$1, " + queryId);
                nodes.push.apply(nodes, _dom_adapter.default.querySelectorAll(element, querySelector));
                setAttributeValue(element, "id", elementId)
            } else {
                if (_dom_adapter.default.isDocument(element)) {
                    nodes.push.apply(nodes, _dom_adapter.default.querySelectorAll(element, selector))
                }
            }
        }
    } else {
        for (i = 0; i < this.length; i++) {
            selector = _dom_adapter.default.isNode(selector) ? selector : selector[0];
            if (this[i] !== selector && this[i].contains(selector)) {
                nodes.push(selector)
            }
        }
    }
    return result.add(nodes)
};
var isVisible = function(_, element) {
    if (!element.nodeType) {
        return true
    }
    return !!(element.offsetWidth || element.offsetHeight || element.getClientRects().length)
};
initRender.prototype.filter = function(selector) {
    if (!selector) {
        return renderer()
    }
    if (":visible" === selector) {
        return this.filter(isVisible)
    } else {
        if (":hidden" === selector) {
            return this.filter(function(_, element) {
                return !isVisible(_, element)
            })
        }
    }
    var result = [];
    for (var i = 0; i < this.length; i++) {
        var item = this[i];
        if (_dom_adapter.default.isElementNode(item) && "string" === (0, _type.type)(selector)) {
            _dom_adapter.default.elementMatches(item, selector) && result.push(item)
        } else {
            if (_dom_adapter.default.isNode(selector) || (0, _type.isWindow)(selector)) {
                selector === item && result.push(item)
            } else {
                if ((0, _type.isFunction)(selector)) {
                    selector.call(item, i, item) && result.push(item)
                } else {
                    for (var j = 0; j < selector.length; j++) {
                        selector[j] === item && result.push(item)
                    }
                }
            }
        }
    }
    return renderer(result)
};
initRender.prototype.not = function(selector) {
    var result = [];
    var nodes = this.filter(selector).toArray();
    for (var i = 0; i < this.length; i++) {
        if (nodes.indexOf(this[i]) === -1) {
            result.push(this[i])
        }
    }
    return renderer(result)
};
initRender.prototype.is = function(selector) {
    return !!this.filter(selector).length
};
initRender.prototype.children = function(selector) {
    var result = [];
    for (var i = 0; i < this.length; i++) {
        var nodes = this[i] ? this[i].childNodes : [];
        for (var j = 0; j < nodes.length; j++) {
            if (_dom_adapter.default.isElementNode(nodes[j])) {
                result.push(nodes[j])
            }
        }
    }
    result = renderer(result);
    return selector ? result.filter(selector) : result
};
initRender.prototype.siblings = function() {
    var element = this[0];
    if (!element || !element.parentNode) {
        return renderer()
    }
    var result = [];
    var parentChildNodes = element.parentNode.childNodes || [];
    for (var i = 0; i < parentChildNodes.length; i++) {
        var node = parentChildNodes[i];
        if (_dom_adapter.default.isElementNode(node) && node !== element) {
            result.push(node)
        }
    }
    return renderer(result)
};
initRender.prototype.each = function(callback) {
    for (var i = 0; i < this.length; i++) {
        if (false === callback.call(this[i], i, this[i])) {
            break
        }
    }
};
initRender.prototype.index = function(element) {
    if (!element) {
        return this.parent().children().index(this)
    }
    element = renderer(element);
    return this.toArray().indexOf(element[0])
};
initRender.prototype.get = function(index) {
    return this[index < 0 ? this.length + index : index]
};
initRender.prototype.eq = function(index) {
    index = index < 0 ? this.length + index : index;
    return renderer(this[index])
};
initRender.prototype.first = function() {
    return this.eq(0)
};
initRender.prototype.last = function() {
    return this.eq(-1)
};
initRender.prototype.parent = function(selector) {
    if (!this[0]) {
        return renderer()
    }
    var result = renderer(this[0].parentNode);
    return !selector || result.is(selector) ? result : renderer()
};
initRender.prototype.parents = function(selector) {
    var result = [];
    var parent = this.parent();
    while (parent && parent[0] && !_dom_adapter.default.isDocument(parent[0])) {
        if (_dom_adapter.default.isElementNode(parent[0])) {
            if (!selector || selector && parent.is(selector)) {
                result.push(parent.get(0))
            }
        }
        parent = parent.parent()
    }
    return renderer(result)
};
initRender.prototype.closest = function(selector) {
    if (this.is(selector)) {
        return this
    }
    var parent = this.parent();
    while (parent && parent.length) {
        if (parent.is(selector)) {
            return parent
        }
        parent = parent.parent()
    }
    return renderer()
};
initRender.prototype.next = function(selector) {
    if (!this[0]) {
        return renderer()
    }
    var next = renderer(this[0].nextSibling);
    if (!arguments.length) {
        return next
    }
    while (next && next.length) {
        if (next.is(selector)) {
            return next
        }
        next = next.next()
    }
    return renderer()
};
initRender.prototype.prev = function() {
    if (!this[0]) {
        return renderer()
    }
    return renderer(this[0].previousSibling)
};
initRender.prototype.add = function(selector) {
    var targets = renderer(selector);
    var result = this.toArray();
    for (var i = 0; i < targets.length; i++) {
        var target = targets[i];
        if (result.indexOf(target) === -1) {
            result.push(target)
        }
    }
    return renderer(result)
};
var emptyArray = [];
initRender.prototype.splice = function() {
    return renderer(emptyArray.splice.apply(this, arguments))
};
initRender.prototype.slice = function() {
    return renderer(emptyArray.slice.apply(this, arguments))
};
initRender.prototype.toArray = function() {
    return emptyArray.slice.call(this)
};
var getWindowByElement = function(element) {
    return (0, _type.isWindow)(element) ? element : element.defaultView
};
initRender.prototype.offset = function() {
    if (!this[0]) {
        return
    }
    if (!this[0].getClientRects().length) {
        return {
            top: 0,
            left: 0
        }
    }
    var rect = this[0].getBoundingClientRect();
    var win = getWindowByElement(this[0].ownerDocument);
    var docElem = this[0].ownerDocument.documentElement;
    return {
        top: rect.top + win.pageYOffset - docElem.clientTop,
        left: rect.left + win.pageXOffset - docElem.clientLeft
    }
};
initRender.prototype.offsetParent = function() {
    if (!this[0]) {
        return renderer()
    }
    var offsetParent = renderer(this[0].offsetParent);
    while (offsetParent[0] && "static" === offsetParent.css("position")) {
        offsetParent = renderer(offsetParent[0].offsetParent)
    }
    offsetParent = offsetParent[0] ? offsetParent : renderer(_dom_adapter.default.getDocumentElement());
    return offsetParent
};
initRender.prototype.position = function() {
    if (!this[0]) {
        return
    }
    var offset;
    var marginTop = parseFloat(this.css("marginTop"));
    var marginLeft = parseFloat(this.css("marginLeft"));
    if ("fixed" === this.css("position")) {
        offset = this[0].getBoundingClientRect();
        return {
            top: offset.top - marginTop,
            left: offset.left - marginLeft
        }
    }
    offset = this.offset();
    var offsetParent = this.offsetParent();
    var parentOffset = {
        top: 0,
        left: 0
    };
    if ("HTML" !== offsetParent[0].nodeName) {
        parentOffset = offsetParent.offset()
    }
    parentOffset = {
        top: parentOffset.top + parseFloat(offsetParent.css("borderTopWidth")),
        left: parentOffset.left + parseFloat(offsetParent.css("borderLeftWidth"))
    };
    return {
        top: offset.top - parentOffset.top - marginTop,
        left: offset.left - parentOffset.left - marginLeft
    }
};
[{
    name: "scrollLeft",
    offsetProp: "pageXOffset",
    scrollWindow: function(win, value) {
        win.scrollTo(value, win.pageYOffset)
    }
}, {
    name: "scrollTop",
    offsetProp: "pageYOffset",
    scrollWindow: function(win, value) {
        win.scrollTo(win.pageXOffset, value)
    }
}].forEach(function(directionStrategy) {
    var propName = directionStrategy.name;
    initRender.prototype[propName] = function(value) {
        if (!this[0]) {
            return
        }
        var window = getWindowByElement(this[0]);
        if (void 0 === value) {
            return window ? window[directionStrategy.offsetProp] : this[0][propName]
        }
        if (window) {
            directionStrategy.scrollWindow(window, value)
        } else {
            this[0][propName] = value
        }
        return this
    }
});
initRender.prototype.data = function(key, value) {
    if (!this[0]) {
        return
    }
    if (arguments.length < 2) {
        return _element_data.data.call(renderer, this[0], key)
    }
    _element_data.data.call(renderer, this[0], key, value);
    return this
};
initRender.prototype.removeData = function(key) {
    this[0] && (0, _element_data.removeData)(this[0], key);
    return this
};
var rendererWrapper = function() {
    return renderer.apply(this, arguments)
};
Object.defineProperty(rendererWrapper, "fn", {
    enumerable: true,
    configurable: true,
    get: function() {
        return renderer.fn
    },
    set: function(value) {
        renderer.fn = value
    }
});
var _default = {
    set: function(strategy) {
        renderer = strategy
    },
    get: function() {
        return rendererWrapper
    }
};
exports.default = _default;
module.exports = exports.default;


/***/ }),

/***/ "./node_modules/devextreme/core/template_manager.js":
/*!**********************************************************!*\
  !*** ./node_modules/devextreme/core/template_manager.js ***!
  \**********************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/**
 * DevExtreme (core/template_manager.js)
 * Version: 20.2.3
 * Build date: Tue Oct 20 2020
 *
 * Copyright (c) 2012 - 2020 Developer Express Inc. ALL RIGHTS RESERVED
 * Read about DevExtreme licensing here: https://js.devexpress.com/Licensing/
 */

exports.TemplateManager = void 0;
var _renderer = _interopRequireDefault(__webpack_require__(/*! ./renderer */ "./node_modules/devextreme/core/renderer.js"));
var _type = __webpack_require__(/*! ./utils/type */ "./node_modules/devextreme/core/utils/type.js");
var _common = __webpack_require__(/*! ./utils/common */ "./node_modules/devextreme/core/utils/common.js");
var _extend = __webpack_require__(/*! ./utils/extend */ "./node_modules/devextreme/core/utils/extend.js");
var _function_template = __webpack_require__(/*! ./templates/function_template */ "./node_modules/devextreme/core/templates/function_template.js");
var _empty_template = __webpack_require__(/*! ./templates/empty_template */ "./node_modules/devextreme/core/templates/empty_template.js");
var _template_manager = __webpack_require__(/*! ./utils/template_manager */ "./node_modules/devextreme/core/utils/template_manager.js");

function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
        "default": obj
    }
}

function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
        throw new TypeError("Cannot call a class as a function")
    }
}

function _defineProperties(target, props) {
    for (var i = 0; i < props.length; i++) {
        var descriptor = props[i];
        descriptor.enumerable = descriptor.enumerable || false;
        descriptor.configurable = true;
        if ("value" in descriptor) {
            descriptor.writable = true
        }
        Object.defineProperty(target, descriptor.key, descriptor)
    }
}

function _createClass(Constructor, protoProps, staticProps) {
    if (protoProps) {
        _defineProperties(Constructor.prototype, protoProps)
    }
    if (staticProps) {
        _defineProperties(Constructor, staticProps)
    }
    return Constructor
}
var TEXT_NODE = 3;
var ANONYMOUS_TEMPLATE_NAME = "template";
var TEMPLATE_OPTIONS_NAME = "dxTemplate";
var TEMPLATE_WRAPPER_CLASS = "dx-template-wrapper";
var DX_POLYMORPH_WIDGET_TEMPLATE = new _function_template.FunctionTemplate(function(_ref) {
    var model = _ref.model,
        parent = _ref.parent;
    var widgetName = model.widget;
    if (!widgetName) {
        return (0, _renderer.default)()
    }
    var widgetElement = (0, _renderer.default)("<div>");
    var widgetOptions = model.options || {};
    if (parent) {
        parent._createComponent(widgetElement, widgetName, widgetOptions)
    } else {
        widgetElement[widgetName](widgetOptions)
    }
    return widgetElement
});
var TemplateManager = function() {
    function TemplateManager(createElement, anonymousTemplateName) {
        _classCallCheck(this, TemplateManager);
        this._tempTemplates = [];
        this._defaultTemplates = {};
        this._anonymousTemplateName = anonymousTemplateName || ANONYMOUS_TEMPLATE_NAME;
        this._createElement = createElement || _template_manager.defaultCreateElement;
        this._createTemplateIfNeeded = this._createTemplateIfNeeded.bind(this)
    }
    _createClass(TemplateManager, [{
        key: "addDefaultTemplates",
        value: function(templates) {
            this._defaultTemplates = (0, _extend.extend)({}, this._defaultTemplates, templates)
        }
    }, {
        key: "dispose",
        value: function() {
            this._tempTemplates.forEach(function(tempTemplate) {
                tempTemplate.template.dispose && tempTemplate.template.dispose()
            });
            this._tempTemplates = []
        }
    }, {
        key: "extractTemplates",
        value: function($el) {
            var templates = this._extractTemplates($el);
            var anonymousTemplateMeta = this._extractAnonymousTemplate($el);
            return {
                templates: templates,
                anonymousTemplateMeta: anonymousTemplateMeta
            }
        }
    }, {
        key: "_extractTemplates",
        value: function($el) {
            var _this = this;
            var templates = (0, _template_manager.findTemplates)($el, TEMPLATE_OPTIONS_NAME);
            var suitableTemplates = (0, _template_manager.suitableTemplatesByName)(templates);
            templates.forEach(function(_ref2) {
                var element = _ref2.element,
                    name = _ref2.options.name;
                if (element === suitableTemplates[name]) {
                    (0, _renderer.default)(element).addClass(TEMPLATE_WRAPPER_CLASS).detach()
                } else {
                    (0, _renderer.default)(element).remove()
                }
            });
            return Object.keys(suitableTemplates).map(function(name) {
                return {
                    name: name,
                    template: _this._createTemplate(suitableTemplates[name])
                }
            })
        }
    }, {
        key: "_extractAnonymousTemplate",
        value: function($el) {
            var $anonymousTemplate = $el.contents().detach();
            var $notJunkTemplateContent = $anonymousTemplate.filter(function(_, element) {
                var isTextNode = element.nodeType === TEXT_NODE;
                var isEmptyText = (0, _renderer.default)(element).text().trim().length < 1;
                return !(isTextNode && isEmptyText)
            });
            return $notJunkTemplateContent.length > 0 ? {
                template: this._createTemplate($anonymousTemplate),
                name: this._anonymousTemplateName
            } : {}
        }
    }, {
        key: "_createTemplateIfNeeded",
        value: function(templateSource) {
            var cachedTemplate = this._tempTemplates.filter(function(tempTemplate) {
                return tempTemplate.source === (0, _template_manager.templateKey)(templateSource)
            })[0];
            if (cachedTemplate) {
                return cachedTemplate.template
            }
            var template = this._createTemplate(templateSource);
            this._tempTemplates.push({
                template: template,
                source: (0, _template_manager.templateKey)(templateSource)
            });
            return template
        }
    }, {
        key: "_createTemplate",
        value: function(templateSource) {
            return this._createElement((0, _template_manager.validateTemplateSource)(templateSource))
        }
    }, {
        key: "getTemplate",
        value: function(templateSource, templates, _ref3, context) {
            var _this2 = this;
            var isAsyncTemplate = _ref3.isAsyncTemplate,
                skipTemplates = _ref3.skipTemplates;
            if (!(0, _type.isFunction)(templateSource)) {
                return (0, _template_manager.acquireTemplate)(templateSource, this._createTemplateIfNeeded, templates, isAsyncTemplate, skipTemplates, this._defaultTemplates)
            }
            return new _function_template.FunctionTemplate(function(options) {
                var templateSourceResult = templateSource.apply(context, (0, _template_manager.getNormalizedTemplateArgs)(options));
                if (!(0, _type.isDefined)(templateSourceResult)) {
                    return new _empty_template.EmptyTemplate
                }
                var dispose = false;
                var template = (0, _template_manager.acquireTemplate)(templateSourceResult, function(templateSource) {
                    if (templateSource.nodeType || (0, _type.isRenderer)(templateSource) && !(0, _renderer.default)(templateSource).is("script")) {
                        return new _function_template.FunctionTemplate(function() {
                            return templateSource
                        })
                    }
                    dispose = true;
                    return _this2._createTemplate(templateSource)
                }, templates, isAsyncTemplate, skipTemplates, _this2._defaultTemplates);
                var result = template.render(options);
                dispose && template.dispose && template.dispose();
                return result
            })
        }
    }, {
        key: "anonymousTemplateName",
        get: function() {
            return this._anonymousTemplateName
        }
    }], [{
        key: "createDefaultOptions",
        value: function() {
            return {
                integrationOptions: {
                    watchMethod: function(fn, callback) {
                        var options = arguments.length > 2 && void 0 !== arguments[2] ? arguments[2] : {};
                        if (!options.skipImmediate) {
                            callback(fn())
                        }
                        return _common.noop
                    },
                    templates: {
                        "dx-polymorph-widget": DX_POLYMORPH_WIDGET_TEMPLATE
                    },
                    useDeferUpdateForTemplates: false
                }
            }
        }
    }]);
    return TemplateManager
}();
exports.TemplateManager = TemplateManager;


/***/ }),

/***/ "./node_modules/devextreme/core/templates/child_default_template.js":
/*!**************************************************************************!*\
  !*** ./node_modules/devextreme/core/templates/child_default_template.js ***!
  \**************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/**
 * DevExtreme (core/templates/child_default_template.js)
 * Version: 20.2.3
 * Build date: Tue Oct 20 2020
 *
 * Copyright (c) 2012 - 2020 Developer Express Inc. ALL RIGHTS RESERVED
 * Read about DevExtreme licensing here: https://js.devexpress.com/Licensing/
 */

exports.ChildDefaultTemplate = void 0;
var _template_base = __webpack_require__(/*! ./template_base */ "./node_modules/devextreme/core/templates/template_base.js");

function _typeof(obj) {
    "@babel/helpers - typeof";
    if ("function" === typeof Symbol && "symbol" === typeof Symbol.iterator) {
        _typeof = function(obj) {
            return typeof obj
        }
    } else {
        _typeof = function(obj) {
            return obj && "function" === typeof Symbol && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj
        }
    }
    return _typeof(obj)
}

function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
        throw new TypeError("Cannot call a class as a function")
    }
}

function _inherits(subClass, superClass) {
    if ("function" !== typeof superClass && null !== superClass) {
        throw new TypeError("Super expression must either be null or a function")
    }
    subClass.prototype = Object.create(superClass && superClass.prototype, {
        constructor: {
            value: subClass,
            writable: true,
            configurable: true
        }
    });
    if (superClass) {
        _setPrototypeOf(subClass, superClass)
    }
}

function _setPrototypeOf(o, p) {
    _setPrototypeOf = Object.setPrototypeOf || function(o, p) {
        o.__proto__ = p;
        return o
    };
    return _setPrototypeOf(o, p)
}

function _createSuper(Derived) {
    var hasNativeReflectConstruct = _isNativeReflectConstruct();
    return function() {
        var result, Super = _getPrototypeOf(Derived);
        if (hasNativeReflectConstruct) {
            var NewTarget = _getPrototypeOf(this).constructor;
            result = Reflect.construct(Super, arguments, NewTarget)
        } else {
            result = Super.apply(this, arguments)
        }
        return _possibleConstructorReturn(this, result)
    }
}

function _possibleConstructorReturn(self, call) {
    if (call && ("object" === _typeof(call) || "function" === typeof call)) {
        return call
    }
    return _assertThisInitialized(self)
}

function _assertThisInitialized(self) {
    if (void 0 === self) {
        throw new ReferenceError("this hasn't been initialised - super() hasn't been called")
    }
    return self
}

function _isNativeReflectConstruct() {
    if ("undefined" === typeof Reflect || !Reflect.construct) {
        return false
    }
    if (Reflect.construct.sham) {
        return false
    }
    if ("function" === typeof Proxy) {
        return true
    }
    try {
        Date.prototype.toString.call(Reflect.construct(Date, [], function() {}));
        return true
    } catch (e) {
        return false
    }
}

function _getPrototypeOf(o) {
    _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function(o) {
        return o.__proto__ || Object.getPrototypeOf(o)
    };
    return _getPrototypeOf(o)
}
var ChildDefaultTemplate = function(_TemplateBase) {
    _inherits(ChildDefaultTemplate, _TemplateBase);
    var _super = _createSuper(ChildDefaultTemplate);

    function ChildDefaultTemplate(name) {
        var _this;
        _classCallCheck(this, ChildDefaultTemplate);
        _this = _super.call(this);
        _this.name = name;
        return _this
    }
    return ChildDefaultTemplate
}(_template_base.TemplateBase);
exports.ChildDefaultTemplate = ChildDefaultTemplate;


/***/ }),

/***/ "./node_modules/devextreme/core/templates/empty_template.js":
/*!******************************************************************!*\
  !*** ./node_modules/devextreme/core/templates/empty_template.js ***!
  \******************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/**
 * DevExtreme (core/templates/empty_template.js)
 * Version: 20.2.3
 * Build date: Tue Oct 20 2020
 *
 * Copyright (c) 2012 - 2020 Developer Express Inc. ALL RIGHTS RESERVED
 * Read about DevExtreme licensing here: https://js.devexpress.com/Licensing/
 */

exports.EmptyTemplate = void 0;
var _renderer = _interopRequireDefault(__webpack_require__(/*! ../renderer */ "./node_modules/devextreme/core/renderer.js"));
var _template_base = __webpack_require__(/*! ./template_base */ "./node_modules/devextreme/core/templates/template_base.js");

function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
        "default": obj
    }
}

function _typeof(obj) {
    "@babel/helpers - typeof";
    if ("function" === typeof Symbol && "symbol" === typeof Symbol.iterator) {
        _typeof = function(obj) {
            return typeof obj
        }
    } else {
        _typeof = function(obj) {
            return obj && "function" === typeof Symbol && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj
        }
    }
    return _typeof(obj)
}

function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
        throw new TypeError("Cannot call a class as a function")
    }
}

function _defineProperties(target, props) {
    for (var i = 0; i < props.length; i++) {
        var descriptor = props[i];
        descriptor.enumerable = descriptor.enumerable || false;
        descriptor.configurable = true;
        if ("value" in descriptor) {
            descriptor.writable = true
        }
        Object.defineProperty(target, descriptor.key, descriptor)
    }
}

function _createClass(Constructor, protoProps, staticProps) {
    if (protoProps) {
        _defineProperties(Constructor.prototype, protoProps)
    }
    if (staticProps) {
        _defineProperties(Constructor, staticProps)
    }
    return Constructor
}

function _inherits(subClass, superClass) {
    if ("function" !== typeof superClass && null !== superClass) {
        throw new TypeError("Super expression must either be null or a function")
    }
    subClass.prototype = Object.create(superClass && superClass.prototype, {
        constructor: {
            value: subClass,
            writable: true,
            configurable: true
        }
    });
    if (superClass) {
        _setPrototypeOf(subClass, superClass)
    }
}

function _setPrototypeOf(o, p) {
    _setPrototypeOf = Object.setPrototypeOf || function(o, p) {
        o.__proto__ = p;
        return o
    };
    return _setPrototypeOf(o, p)
}

function _createSuper(Derived) {
    var hasNativeReflectConstruct = _isNativeReflectConstruct();
    return function() {
        var result, Super = _getPrototypeOf(Derived);
        if (hasNativeReflectConstruct) {
            var NewTarget = _getPrototypeOf(this).constructor;
            result = Reflect.construct(Super, arguments, NewTarget)
        } else {
            result = Super.apply(this, arguments)
        }
        return _possibleConstructorReturn(this, result)
    }
}

function _possibleConstructorReturn(self, call) {
    if (call && ("object" === _typeof(call) || "function" === typeof call)) {
        return call
    }
    return _assertThisInitialized(self)
}

function _assertThisInitialized(self) {
    if (void 0 === self) {
        throw new ReferenceError("this hasn't been initialised - super() hasn't been called")
    }
    return self
}

function _isNativeReflectConstruct() {
    if ("undefined" === typeof Reflect || !Reflect.construct) {
        return false
    }
    if (Reflect.construct.sham) {
        return false
    }
    if ("function" === typeof Proxy) {
        return true
    }
    try {
        Date.prototype.toString.call(Reflect.construct(Date, [], function() {}));
        return true
    } catch (e) {
        return false
    }
}

function _getPrototypeOf(o) {
    _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function(o) {
        return o.__proto__ || Object.getPrototypeOf(o)
    };
    return _getPrototypeOf(o)
}
var EmptyTemplate = function(_TemplateBase) {
    _inherits(EmptyTemplate, _TemplateBase);
    var _super = _createSuper(EmptyTemplate);

    function EmptyTemplate() {
        _classCallCheck(this, EmptyTemplate);
        return _super.apply(this, arguments)
    }
    _createClass(EmptyTemplate, [{
        key: "_renderCore",
        value: function() {
            return (0, _renderer.default)()
        }
    }]);
    return EmptyTemplate
}(_template_base.TemplateBase);
exports.EmptyTemplate = EmptyTemplate;


/***/ }),

/***/ "./node_modules/devextreme/core/templates/function_template.js":
/*!*********************************************************************!*\
  !*** ./node_modules/devextreme/core/templates/function_template.js ***!
  \*********************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/**
 * DevExtreme (core/templates/function_template.js)
 * Version: 20.2.3
 * Build date: Tue Oct 20 2020
 *
 * Copyright (c) 2012 - 2020 Developer Express Inc. ALL RIGHTS RESERVED
 * Read about DevExtreme licensing here: https://js.devexpress.com/Licensing/
 */

exports.FunctionTemplate = void 0;
var _template_base = __webpack_require__(/*! ./template_base */ "./node_modules/devextreme/core/templates/template_base.js");
var _dom = __webpack_require__(/*! ../utils/dom */ "./node_modules/devextreme/core/utils/dom.js");

function _typeof(obj) {
    "@babel/helpers - typeof";
    if ("function" === typeof Symbol && "symbol" === typeof Symbol.iterator) {
        _typeof = function(obj) {
            return typeof obj
        }
    } else {
        _typeof = function(obj) {
            return obj && "function" === typeof Symbol && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj
        }
    }
    return _typeof(obj)
}

function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
        throw new TypeError("Cannot call a class as a function")
    }
}

function _defineProperties(target, props) {
    for (var i = 0; i < props.length; i++) {
        var descriptor = props[i];
        descriptor.enumerable = descriptor.enumerable || false;
        descriptor.configurable = true;
        if ("value" in descriptor) {
            descriptor.writable = true
        }
        Object.defineProperty(target, descriptor.key, descriptor)
    }
}

function _createClass(Constructor, protoProps, staticProps) {
    if (protoProps) {
        _defineProperties(Constructor.prototype, protoProps)
    }
    if (staticProps) {
        _defineProperties(Constructor, staticProps)
    }
    return Constructor
}

function _inherits(subClass, superClass) {
    if ("function" !== typeof superClass && null !== superClass) {
        throw new TypeError("Super expression must either be null or a function")
    }
    subClass.prototype = Object.create(superClass && superClass.prototype, {
        constructor: {
            value: subClass,
            writable: true,
            configurable: true
        }
    });
    if (superClass) {
        _setPrototypeOf(subClass, superClass)
    }
}

function _setPrototypeOf(o, p) {
    _setPrototypeOf = Object.setPrototypeOf || function(o, p) {
        o.__proto__ = p;
        return o
    };
    return _setPrototypeOf(o, p)
}

function _createSuper(Derived) {
    var hasNativeReflectConstruct = _isNativeReflectConstruct();
    return function() {
        var result, Super = _getPrototypeOf(Derived);
        if (hasNativeReflectConstruct) {
            var NewTarget = _getPrototypeOf(this).constructor;
            result = Reflect.construct(Super, arguments, NewTarget)
        } else {
            result = Super.apply(this, arguments)
        }
        return _possibleConstructorReturn(this, result)
    }
}

function _possibleConstructorReturn(self, call) {
    if (call && ("object" === _typeof(call) || "function" === typeof call)) {
        return call
    }
    return _assertThisInitialized(self)
}

function _assertThisInitialized(self) {
    if (void 0 === self) {
        throw new ReferenceError("this hasn't been initialised - super() hasn't been called")
    }
    return self
}

function _isNativeReflectConstruct() {
    if ("undefined" === typeof Reflect || !Reflect.construct) {
        return false
    }
    if (Reflect.construct.sham) {
        return false
    }
    if ("function" === typeof Proxy) {
        return true
    }
    try {
        Date.prototype.toString.call(Reflect.construct(Date, [], function() {}));
        return true
    } catch (e) {
        return false
    }
}

function _getPrototypeOf(o) {
    _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function(o) {
        return o.__proto__ || Object.getPrototypeOf(o)
    };
    return _getPrototypeOf(o)
}
var FunctionTemplate = function(_TemplateBase) {
    _inherits(FunctionTemplate, _TemplateBase);
    var _super = _createSuper(FunctionTemplate);

    function FunctionTemplate(render) {
        var _this;
        _classCallCheck(this, FunctionTemplate);
        _this = _super.call(this);
        _this._render = render;
        return _this
    }
    _createClass(FunctionTemplate, [{
        key: "_renderCore",
        value: function(options) {
            return (0, _dom.normalizeTemplateElement)(this._render(options))
        }
    }]);
    return FunctionTemplate
}(_template_base.TemplateBase);
exports.FunctionTemplate = FunctionTemplate;


/***/ }),

/***/ "./node_modules/devextreme/core/templates/template.js":
/*!************************************************************!*\
  !*** ./node_modules/devextreme/core/templates/template.js ***!
  \************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/**
 * DevExtreme (core/templates/template.js)
 * Version: 20.2.3
 * Build date: Tue Oct 20 2020
 *
 * Copyright (c) 2012 - 2020 Developer Express Inc. ALL RIGHTS RESERVED
 * Read about DevExtreme licensing here: https://js.devexpress.com/Licensing/
 */

exports.Template = void 0;
var _renderer = _interopRequireDefault(__webpack_require__(/*! ../renderer */ "./node_modules/devextreme/core/renderer.js"));
var _template_base = __webpack_require__(/*! ./template_base */ "./node_modules/devextreme/core/templates/template_base.js");
var _dom = __webpack_require__(/*! ../utils/dom */ "./node_modules/devextreme/core/utils/dom.js");
var _template_engine_registry = __webpack_require__(/*! ./template_engine_registry */ "./node_modules/devextreme/core/templates/template_engine_registry.js");
__webpack_require__(/*! ./template_engines */ "./node_modules/devextreme/core/templates/template_engines.js");

function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
        "default": obj
    }
}

function _typeof(obj) {
    "@babel/helpers - typeof";
    if ("function" === typeof Symbol && "symbol" === typeof Symbol.iterator) {
        _typeof = function(obj) {
            return typeof obj
        }
    } else {
        _typeof = function(obj) {
            return obj && "function" === typeof Symbol && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj
        }
    }
    return _typeof(obj)
}

function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
        throw new TypeError("Cannot call a class as a function")
    }
}

function _defineProperties(target, props) {
    for (var i = 0; i < props.length; i++) {
        var descriptor = props[i];
        descriptor.enumerable = descriptor.enumerable || false;
        descriptor.configurable = true;
        if ("value" in descriptor) {
            descriptor.writable = true
        }
        Object.defineProperty(target, descriptor.key, descriptor)
    }
}

function _createClass(Constructor, protoProps, staticProps) {
    if (protoProps) {
        _defineProperties(Constructor.prototype, protoProps)
    }
    if (staticProps) {
        _defineProperties(Constructor, staticProps)
    }
    return Constructor
}

function _inherits(subClass, superClass) {
    if ("function" !== typeof superClass && null !== superClass) {
        throw new TypeError("Super expression must either be null or a function")
    }
    subClass.prototype = Object.create(superClass && superClass.prototype, {
        constructor: {
            value: subClass,
            writable: true,
            configurable: true
        }
    });
    if (superClass) {
        _setPrototypeOf(subClass, superClass)
    }
}

function _setPrototypeOf(o, p) {
    _setPrototypeOf = Object.setPrototypeOf || function(o, p) {
        o.__proto__ = p;
        return o
    };
    return _setPrototypeOf(o, p)
}

function _createSuper(Derived) {
    var hasNativeReflectConstruct = _isNativeReflectConstruct();
    return function() {
        var result, Super = _getPrototypeOf(Derived);
        if (hasNativeReflectConstruct) {
            var NewTarget = _getPrototypeOf(this).constructor;
            result = Reflect.construct(Super, arguments, NewTarget)
        } else {
            result = Super.apply(this, arguments)
        }
        return _possibleConstructorReturn(this, result)
    }
}

function _possibleConstructorReturn(self, call) {
    if (call && ("object" === _typeof(call) || "function" === typeof call)) {
        return call
    }
    return _assertThisInitialized(self)
}

function _assertThisInitialized(self) {
    if (void 0 === self) {
        throw new ReferenceError("this hasn't been initialised - super() hasn't been called")
    }
    return self
}

function _isNativeReflectConstruct() {
    if ("undefined" === typeof Reflect || !Reflect.construct) {
        return false
    }
    if (Reflect.construct.sham) {
        return false
    }
    if ("function" === typeof Proxy) {
        return true
    }
    try {
        Date.prototype.toString.call(Reflect.construct(Date, [], function() {}));
        return true
    } catch (e) {
        return false
    }
}

function _getPrototypeOf(o) {
    _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function(o) {
        return o.__proto__ || Object.getPrototypeOf(o)
    };
    return _getPrototypeOf(o)
}(0, _template_engine_registry.registerTemplateEngine)("default", {
    compile: function(element) {
        return (0, _dom.normalizeTemplateElement)(element)
    },
    render: function(template, model, index) {
        return template.clone()
    }
});
(0, _template_engine_registry.setTemplateEngine)("default");
var Template = function(_TemplateBase) {
    _inherits(Template, _TemplateBase);
    var _super = _createSuper(Template);

    function Template(element) {
        var _this;
        _classCallCheck(this, Template);
        _this = _super.call(this);
        _this._element = element;
        return _this
    }
    _createClass(Template, [{
        key: "_renderCore",
        value: function(options) {
            var transclude = options.transclude;
            if (!transclude && !this._compiledTemplate) {
                this._compiledTemplate = (0, _template_engine_registry.getCurrentTemplateEngine)().compile(this._element)
            }
            return (0, _renderer.default)("<div>").append(transclude ? this._element : (0, _template_engine_registry.getCurrentTemplateEngine)().render(this._compiledTemplate, options.model, options.index)).contents()
        }
    }, {
        key: "source",
        value: function() {
            return (0, _renderer.default)(this._element).clone()
        }
    }]);
    return Template
}(_template_base.TemplateBase);
exports.Template = Template;


/***/ }),

/***/ "./node_modules/devextreme/core/templates/template_base.js":
/*!*****************************************************************!*\
  !*** ./node_modules/devextreme/core/templates/template_base.js ***!
  \*****************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/**
 * DevExtreme (core/templates/template_base.js)
 * Version: 20.2.3
 * Build date: Tue Oct 20 2020
 *
 * Copyright (c) 2012 - 2020 Developer Express Inc. ALL RIGHTS RESERVED
 * Read about DevExtreme licensing here: https://js.devexpress.com/Licensing/
 */

exports.TemplateBase = exports.renderedCallbacks = void 0;
var _renderer = _interopRequireDefault(__webpack_require__(/*! ../renderer */ "./node_modules/devextreme/core/renderer.js"));
var _dom_adapter = _interopRequireDefault(__webpack_require__(/*! ../dom_adapter */ "./node_modules/devextreme/core/dom_adapter.js"));
var _callbacks = _interopRequireDefault(__webpack_require__(/*! ../utils/callbacks */ "./node_modules/devextreme/core/utils/callbacks.js"));
var _dom = __webpack_require__(/*! ../utils/dom */ "./node_modules/devextreme/core/utils/dom.js");
var _visibility_change = __webpack_require__(/*! ../../events/visibility_change */ "./node_modules/devextreme/events/visibility_change.js");
var _errors = _interopRequireDefault(__webpack_require__(/*! ../errors */ "./node_modules/devextreme/core/errors.js"));

function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
        "default": obj
    }
}

function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
        throw new TypeError("Cannot call a class as a function")
    }
}

function _defineProperties(target, props) {
    for (var i = 0; i < props.length; i++) {
        var descriptor = props[i];
        descriptor.enumerable = descriptor.enumerable || false;
        descriptor.configurable = true;
        if ("value" in descriptor) {
            descriptor.writable = true
        }
        Object.defineProperty(target, descriptor.key, descriptor)
    }
}

function _createClass(Constructor, protoProps, staticProps) {
    if (protoProps) {
        _defineProperties(Constructor.prototype, protoProps)
    }
    if (staticProps) {
        _defineProperties(Constructor, staticProps)
    }
    return Constructor
}
var renderedCallbacks = (0, _callbacks.default)({
    syncStrategy: true
});
exports.renderedCallbacks = renderedCallbacks;
var TemplateBase = function() {
    function TemplateBase() {
        _classCallCheck(this, TemplateBase)
    }
    _createClass(TemplateBase, [{
        key: "render",
        value: function(options) {
            options = options || {};
            var onRendered = options.onRendered;
            delete options.onRendered;
            var $result = this._renderCore(options);
            this._ensureResultInContainer($result, options.container);
            renderedCallbacks.fire($result, options.container);
            onRendered && onRendered();
            return $result
        }
    }, {
        key: "_ensureResultInContainer",
        value: function($result, container) {
            if (!container) {
                return
            }
            var $container = (0, _renderer.default)(container);
            var resultInContainer = (0, _dom.contains)($container.get(0), $result.get(0));
            $container.append($result);
            if (resultInContainer) {
                return
            }
            var resultInBody = _dom_adapter.default.getBody().contains($container.get(0));
            if (!resultInBody) {
                return
            }(0, _visibility_change.triggerShownEvent)($result)
        }
    }, {
        key: "_renderCore",
        value: function() {
            throw _errors.default.Error("E0001")
        }
    }]);
    return TemplateBase
}();
exports.TemplateBase = TemplateBase;


/***/ }),

/***/ "./node_modules/devextreme/core/templates/template_engine_registry.js":
/*!****************************************************************************!*\
  !*** ./node_modules/devextreme/core/templates/template_engine_registry.js ***!
  \****************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/**
 * DevExtreme (core/templates/template_engine_registry.js)
 * Version: 20.2.3
 * Build date: Tue Oct 20 2020
 *
 * Copyright (c) 2012 - 2020 Developer Express Inc. ALL RIGHTS RESERVED
 * Read about DevExtreme licensing here: https://js.devexpress.com/Licensing/
 */

exports.registerTemplateEngine = registerTemplateEngine;
exports.setTemplateEngine = setTemplateEngine;
exports.getCurrentTemplateEngine = getCurrentTemplateEngine;
var _type = __webpack_require__(/*! ../utils/type */ "./node_modules/devextreme/core/utils/type.js");
var _errors = _interopRequireDefault(__webpack_require__(/*! ../errors */ "./node_modules/devextreme/core/errors.js"));

function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
        "default": obj
    }
}
var templateEngines = {};
var currentTemplateEngine;

function registerTemplateEngine(name, templateEngine) {
    templateEngines[name] = templateEngine
}

function setTemplateEngine(templateEngine) {
    if ((0, _type.isString)(templateEngine)) {
        currentTemplateEngine = templateEngines[templateEngine];
        if (!currentTemplateEngine) {
            throw _errors.default.Error("E0020", templateEngine)
        }
    } else {
        currentTemplateEngine = templateEngine
    }
}

function getCurrentTemplateEngine() {
    return currentTemplateEngine
}


/***/ }),

/***/ "./node_modules/devextreme/core/templates/template_engines.js":
/*!********************************************************************!*\
  !*** ./node_modules/devextreme/core/templates/template_engines.js ***!
  \********************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/**
 * DevExtreme (core/templates/template_engines.js)
 * Version: 20.2.3
 * Build date: Tue Oct 20 2020
 *
 * Copyright (c) 2012 - 2020 Developer Express Inc. ALL RIGHTS RESERVED
 * Read about DevExtreme licensing here: https://js.devexpress.com/Licensing/
 */

var _dom = __webpack_require__(/*! ../utils/dom */ "./node_modules/devextreme/core/utils/dom.js");
var _template_engine_registry = __webpack_require__(/*! ./template_engine_registry */ "./node_modules/devextreme/core/templates/template_engine_registry.js");
(0, _template_engine_registry.registerTemplateEngine)("jquery-tmpl", {
    compile: function(element) {
        return (0, _dom.extractTemplateMarkup)(element)
    },
    render: function(template, data) {
        return jQuery.tmpl(template, data)
    }
});
(0, _template_engine_registry.registerTemplateEngine)("jsrender", {
    compile: function(element) {
        return (jQuery ? jQuery : jsrender).templates((0, _dom.extractTemplateMarkup)(element))
    },
    render: function(template, data) {
        return template.render(data)
    }
});
(0, _template_engine_registry.registerTemplateEngine)("mustache", {
    compile: function(element) {
        return (0, _dom.extractTemplateMarkup)(element)
    },
    render: function(template, data) {
        return Mustache.render(template, data)
    }
});
(0, _template_engine_registry.registerTemplateEngine)("hogan", {
    compile: function(element) {
        return Hogan.compile((0, _dom.extractTemplateMarkup)(element))
    },
    render: function(template, data) {
        return template.render(data)
    }
});
(0, _template_engine_registry.registerTemplateEngine)("underscore", {
    compile: function(element) {
        return _.template((0, _dom.extractTemplateMarkup)(element))
    },
    render: function(template, data) {
        return template(data)
    }
});
(0, _template_engine_registry.registerTemplateEngine)("handlebars", {
    compile: function(element) {
        return Handlebars.compile((0, _dom.extractTemplateMarkup)(element))
    },
    render: function(template, data) {
        return template(data)
    }
});
(0, _template_engine_registry.registerTemplateEngine)("doT", {
    compile: function(element) {
        return doT.template((0, _dom.extractTemplateMarkup)(element))
    },
    render: function(template, data) {
        return template(data)
    }
});


/***/ }),

/***/ "./node_modules/devextreme/core/utils/array.js":
/*!*****************************************************!*\
  !*** ./node_modules/devextreme/core/utils/array.js ***!
  \*****************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/**
 * DevExtreme (core/utils/array.js)
 * Version: 20.2.3
 * Build date: Tue Oct 20 2020
 *
 * Copyright (c) 2012 - 2020 Developer Express Inc. ALL RIGHTS RESERVED
 * Read about DevExtreme licensing here: https://js.devexpress.com/Licensing/
 */

exports.groupBy = exports.find = exports.merge = exports.normalizeIndexes = exports.removeDuplicates = exports.intersection = exports.inArray = exports.wrapToArray = exports.isEmpty = void 0;
var _type = __webpack_require__(/*! ./type */ "./node_modules/devextreme/core/utils/type.js");
var _iterator = __webpack_require__(/*! ./iterator */ "./node_modules/devextreme/core/utils/iterator.js");
var _object = __webpack_require__(/*! ./object */ "./node_modules/devextreme/core/utils/object.js");
var _config = _interopRequireDefault(__webpack_require__(/*! ../config */ "./node_modules/devextreme/core/config.js"));

function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
        "default": obj
    }
}

function _toConsumableArray(arr) {
    return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _unsupportedIterableToArray(arr) || _nonIterableSpread()
}

function _nonIterableSpread() {
    throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")
}

function _unsupportedIterableToArray(o, minLen) {
    if (!o) {
        return
    }
    if ("string" === typeof o) {
        return _arrayLikeToArray(o, minLen)
    }
    var n = Object.prototype.toString.call(o).slice(8, -1);
    if ("Object" === n && o.constructor) {
        n = o.constructor.name
    }
    if ("Map" === n || "Set" === n) {
        return Array.from(o)
    }
    if ("Arguments" === n || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) {
        return _arrayLikeToArray(o, minLen)
    }
}

function _iterableToArray(iter) {
    if ("undefined" !== typeof Symbol && Symbol.iterator in Object(iter)) {
        return Array.from(iter)
    }
}

function _arrayWithoutHoles(arr) {
    if (Array.isArray(arr)) {
        return _arrayLikeToArray(arr)
    }
}

function _arrayLikeToArray(arr, len) {
    if (null == len || len > arr.length) {
        len = arr.length
    }
    for (var i = 0, arr2 = new Array(len); i < len; i++) {
        arr2[i] = arr[i]
    }
    return arr2
}

function ownKeys(object, enumerableOnly) {
    var keys = Object.keys(object);
    if (Object.getOwnPropertySymbols) {
        var symbols = Object.getOwnPropertySymbols(object);
        if (enumerableOnly) {
            symbols = symbols.filter(function(sym) {
                return Object.getOwnPropertyDescriptor(object, sym).enumerable
            })
        }
        keys.push.apply(keys, symbols)
    }
    return keys
}

function _objectSpread(target) {
    for (var i = 1; i < arguments.length; i++) {
        var source = null != arguments[i] ? arguments[i] : {};
        if (i % 2) {
            ownKeys(Object(source), true).forEach(function(key) {
                _defineProperty(target, key, source[key])
            })
        } else {
            if (Object.getOwnPropertyDescriptors) {
                Object.defineProperties(target, Object.getOwnPropertyDescriptors(source))
            } else {
                ownKeys(Object(source)).forEach(function(key) {
                    Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key))
                })
            }
        }
    }
    return target
}

function _defineProperty(obj, key, value) {
    if (key in obj) {
        Object.defineProperty(obj, key, {
            value: value,
            enumerable: true,
            configurable: true,
            writable: true
        })
    } else {
        obj[key] = value
    }
    return obj
}
var isEmpty = function(entity) {
    return Array.isArray(entity) && !entity.length
};
exports.isEmpty = isEmpty;
var wrapToArray = function(entity) {
    return Array.isArray(entity) ? entity : [entity]
};
exports.wrapToArray = wrapToArray;
var inArray = function(value, object) {
    if (!object) {
        return -1
    }
    var array = Array.isArray(object) ? object : object.toArray();
    return array.indexOf(value)
};
exports.inArray = inArray;
var intersection = function(a, b) {
    if (!Array.isArray(a) || 0 === a.length || !Array.isArray(b) || 0 === b.length) {
        return []
    }
    var result = [];
    (0, _iterator.each)(a, function(_, value) {
        var index = inArray(value, b);
        if (index !== -1) {
            result.push(value)
        }
    });
    return result
};
exports.intersection = intersection;
var removeDuplicates = function(from, what) {
    if (!Array.isArray(from) || 0 === from.length) {
        return []
    }
    if (!Array.isArray(what) || 0 === what.length) {
        return from.slice()
    }
    var result = [];
    (0, _iterator.each)(from, function(_, value) {
        var index = inArray(value, what);
        if (index === -1) {
            result.push(value)
        }
    });
    return result
};
exports.removeDuplicates = removeDuplicates;
var normalizeIndexes = function(items, indexParameterName, currentItem, needIndexCallback) {
    var indexedItems = {};
    var parameterIndex = 0;
    var useLegacyVisibleIndex = (0, _config.default)().useLegacyVisibleIndex;
    (0, _iterator.each)(items, function(index, item) {
        index = item[indexParameterName];
        if (index >= 0) {
            indexedItems[index] = indexedItems[index] || [];
            if (item === currentItem) {
                indexedItems[index].unshift(item)
            } else {
                indexedItems[index].push(item)
            }
        } else {
            item[indexParameterName] = void 0
        }
    });
    if (!useLegacyVisibleIndex) {
        (0, _iterator.each)(items, function() {
            if (!(0, _type.isDefined)(this[indexParameterName]) && (!needIndexCallback || needIndexCallback(this))) {
                while (indexedItems[parameterIndex]) {
                    parameterIndex++
                }
                indexedItems[parameterIndex] = [this];
                parameterIndex++
            }
        })
    }
    parameterIndex = 0;
    (0, _object.orderEach)(indexedItems, function(index, items) {
        (0, _iterator.each)(items, function() {
            if (index >= 0) {
                this[indexParameterName] = parameterIndex++
            }
        })
    });
    if (useLegacyVisibleIndex) {
        (0, _iterator.each)(items, function() {
            if (!(0, _type.isDefined)(this[indexParameterName]) && (!needIndexCallback || needIndexCallback(this))) {
                this[indexParameterName] = parameterIndex++
            }
        })
    }
    return parameterIndex
};
exports.normalizeIndexes = normalizeIndexes;
var merge = function(array1, array2) {
    for (var i = 0; i < array2.length; i++) {
        array1[array1.length] = array2[i]
    }
    return array1
};
exports.merge = merge;
var find = function(array, condition) {
    for (var i = 0; i < array.length; i++) {
        if (condition(array[i])) {
            return array[i]
        }
    }
};
exports.find = find;
var groupBy = function(array, cb) {
    return array.reduce(function(result, item) {
        return _objectSpread(_objectSpread({}, result), {}, _defineProperty({}, cb(item), [].concat(_toConsumableArray(result[cb(item)] || []), [item])))
    }, {})
};
exports.groupBy = groupBy;


/***/ }),

/***/ "./node_modules/devextreme/core/utils/browser.js":
/*!*******************************************************!*\
  !*** ./node_modules/devextreme/core/utils/browser.js ***!
  \*******************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/**
 * DevExtreme (core/utils/browser.js)
 * Version: 20.2.3
 * Build date: Tue Oct 20 2020
 *
 * Copyright (c) 2012 - 2020 Developer Express Inc. ALL RIGHTS RESERVED
 * Read about DevExtreme licensing here: https://js.devexpress.com/Licensing/
 */

exports.default = void 0;
var _extend = __webpack_require__(/*! ./extend */ "./node_modules/devextreme/core/utils/extend.js");
var _window = __webpack_require__(/*! ./window */ "./node_modules/devextreme/core/utils/window.js");
var navigator = (0, _window.getNavigator)();
var webkitRegExp = /(webkit)[ /]([\w.]+)/;
var ieRegExp = /(msie) (\d{1,2}\.\d)/;
var ie11RegExp = /(trident).*rv:(\d{1,2}\.\d)/;
var msEdge = /(edge)\/((\d+)?[\w.]+)/;
var mozillaRegExp = /(mozilla)(?:.*? rv:([\w.]+))/;
var browserFromUA = function(ua) {
    ua = ua.toLowerCase();
    var result = {};
    var matches = ieRegExp.exec(ua) || ie11RegExp.exec(ua) || msEdge.exec(ua) || ua.indexOf("compatible") < 0 && mozillaRegExp.exec(ua) || webkitRegExp.exec(ua) || [];
    var browserName = matches[1];
    var browserVersion = matches[2];
    if ("webkit" === browserName) {
        result.webkit = true;
        if (ua.indexOf("chrome") >= 0 || ua.indexOf("crios") >= 0) {
            browserName = "chrome";
            browserVersion = /(?:chrome|crios)\/(\d+\.\d+)/.exec(ua);
            browserVersion = browserVersion && browserVersion[1]
        } else {
            if (ua.indexOf("fxios") >= 0) {
                browserName = "mozilla";
                browserVersion = /fxios\/(\d+\.\d+)/.exec(ua);
                browserVersion = browserVersion && browserVersion[1]
            } else {
                if (ua.indexOf("safari") >= 0 && /version|phantomjs/.test(ua)) {
                    browserName = "safari";
                    browserVersion = /(?:version|phantomjs)\/([0-9.]+)/.exec(ua);
                    browserVersion = browserVersion && browserVersion[1]
                } else {
                    browserName = "unknown";
                    browserVersion = /applewebkit\/([0-9.]+)/.exec(ua);
                    browserVersion = browserVersion && browserVersion[1]
                }
            }
        }
    }
    if ("trident" === browserName || "edge" === browserName) {
        browserName = "msie"
    }
    if (browserName) {
        result[browserName] = true;
        result.version = browserVersion
    }
    return result
};
var _default = (0, _extend.extend)({
    _fromUA: browserFromUA
}, browserFromUA(navigator.userAgent));
exports.default = _default;
module.exports = exports.default;


/***/ }),

/***/ "./node_modules/devextreme/core/utils/call_once.js":
/*!*********************************************************!*\
  !*** ./node_modules/devextreme/core/utils/call_once.js ***!
  \*********************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/**
 * DevExtreme (core/utils/call_once.js)
 * Version: 20.2.3
 * Build date: Tue Oct 20 2020
 *
 * Copyright (c) 2012 - 2020 Developer Express Inc. ALL RIGHTS RESERVED
 * Read about DevExtreme licensing here: https://js.devexpress.com/Licensing/
 */

exports.default = void 0;
var callOnce = function(handler) {
    var result;
    var _wrappedHandler = function() {
        result = handler.apply(this, arguments);
        _wrappedHandler = function() {
            return result
        };
        return result
    };
    return function() {
        return _wrappedHandler.apply(this, arguments)
    }
};
var _default = callOnce;
exports.default = _default;
module.exports = exports.default;


/***/ }),

/***/ "./node_modules/devextreme/core/utils/callbacks.js":
/*!*********************************************************!*\
  !*** ./node_modules/devextreme/core/utils/callbacks.js ***!
  \*********************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/**
 * DevExtreme (core/utils/callbacks.js)
 * Version: 20.2.3
 * Build date: Tue Oct 20 2020
 *
 * Copyright (c) 2012 - 2020 Developer Express Inc. ALL RIGHTS RESERVED
 * Read about DevExtreme licensing here: https://js.devexpress.com/Licensing/
 */

exports.default = void 0;
var Callback = function(options) {
    this._options = options || {};
    this._list = [];
    this._queue = [];
    this._firing = false;
    this._fired = false;
    this._firingIndexes = []
};
Callback.prototype._fireCore = function(context, args) {
    var firingIndexes = this._firingIndexes;
    var list = this._list;
    var stopOnFalse = this._options.stopOnFalse;
    var step = firingIndexes.length;
    for (firingIndexes[step] = 0; firingIndexes[step] < list.length; firingIndexes[step]++) {
        var result = list[firingIndexes[step]].apply(context, args);
        if (false === result && stopOnFalse) {
            break
        }
    }
    firingIndexes.pop()
};
Callback.prototype.add = function(fn) {
    if ("function" === typeof fn && (!this._options.unique || !this.has(fn))) {
        this._list.push(fn)
    }
    return this
};
Callback.prototype.remove = function(fn) {
    var list = this._list;
    var firingIndexes = this._firingIndexes;
    var index = list.indexOf(fn);
    if (index > -1) {
        list.splice(index, 1);
        if (this._firing && firingIndexes.length) {
            for (var step = 0; step < firingIndexes.length; step++) {
                if (index <= firingIndexes[step]) {
                    firingIndexes[step]--
                }
            }
        }
    }
    return this
};
Callback.prototype.has = function(fn) {
    var list = this._list;
    return fn ? list.indexOf(fn) > -1 : !!list.length
};
Callback.prototype.empty = function(fn) {
    this._list = [];
    return this
};
Callback.prototype.fireWith = function(context, args) {
    var queue = this._queue;
    args = args || [];
    args = args.slice ? args.slice() : args;
    if (this._options.syncStrategy) {
        this._firing = true;
        this._fireCore(context, args)
    } else {
        queue.push([context, args]);
        if (this._firing) {
            return
        }
        this._firing = true;
        while (queue.length) {
            var memory = queue.shift();
            this._fireCore(memory[0], memory[1])
        }
    }
    this._firing = false;
    this._fired = true;
    return this
};
Callback.prototype.fire = function() {
    this.fireWith(this, arguments)
};
Callback.prototype.fired = function() {
    return this._fired
};
var Callbacks = function(options) {
    return new Callback(options)
};
var _default = Callbacks;
exports.default = _default;
module.exports = exports.default;


/***/ }),

/***/ "./node_modules/devextreme/core/utils/common.js":
/*!******************************************************!*\
  !*** ./node_modules/devextreme/core/utils/common.js ***!
  \******************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/**
 * DevExtreme (core/utils/common.js)
 * Version: 20.2.3
 * Build date: Tue Oct 20 2020
 *
 * Copyright (c) 2012 - 2020 Developer Express Inc. ALL RIGHTS RESERVED
 * Read about DevExtreme licensing here: https://js.devexpress.com/Licensing/
 */

exports.equalByValue = exports.grep = exports.asyncNoop = exports.noop = exports.applyServerDecimalSeparator = exports.escapeRegExp = exports.getKeyHash = exports.pairToObject = exports.denormalizeKey = exports.normalizeKey = exports.splitPair = exports.findBestMatches = exports.deferUpdater = exports.deferRenderer = exports.deferUpdate = exports.deferRender = exports.executeAsync = exports.ensureDefined = void 0;
var _config = _interopRequireDefault(__webpack_require__(/*! ../config */ "./node_modules/devextreme/core/config.js"));
var _guid = _interopRequireDefault(__webpack_require__(/*! ../guid */ "./node_modules/devextreme/core/guid.js"));
var _deferred = __webpack_require__(/*! ../utils/deferred */ "./node_modules/devextreme/core/utils/deferred.js");
var _data = __webpack_require__(/*! ./data */ "./node_modules/devextreme/core/utils/data.js");
var _iterator = __webpack_require__(/*! ./iterator */ "./node_modules/devextreme/core/utils/iterator.js");
var _type = __webpack_require__(/*! ./type */ "./node_modules/devextreme/core/utils/type.js");

function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
        "default": obj
    }
}
var ensureDefined = function(value, defaultValue) {
    return (0, _type.isDefined)(value) ? value : defaultValue
};
exports.ensureDefined = ensureDefined;
var executeAsync = function(action, context) {
    var deferred = new _deferred.Deferred;
    var normalizedContext = context || this;
    var task = {
        promise: deferred.promise(),
        abort: function() {
            clearTimeout(timerId);
            deferred.rejectWith(normalizedContext)
        }
    };
    var callback = function() {
        var result = action.call(normalizedContext);
        if (result && result.done && (0, _type.isFunction)(result.done)) {
            result.done(function() {
                deferred.resolveWith(normalizedContext)
            })
        } else {
            deferred.resolveWith(normalizedContext)
        }
    };
    var timerId = (arguments[2] || setTimeout)(callback, "number" === typeof context ? context : 0);
    return task
};
exports.executeAsync = executeAsync;
var delayedFuncs = [];
var delayedNames = [];
var delayedDeferreds = [];
var executingName;
var deferExecute = function(name, func, deferred) {
    if (executingName && executingName !== name) {
        delayedFuncs.push(func);
        delayedNames.push(name);
        deferred = deferred || new _deferred.Deferred;
        delayedDeferreds.push(deferred);
        return deferred
    } else {
        var oldExecutingName = executingName;
        var currentDelayedCount = delayedDeferreds.length;
        executingName = name;
        var result = func();
        if (!result) {
            if (delayedDeferreds.length > currentDelayedCount) {
                result = _deferred.when.apply(this, delayedDeferreds.slice(currentDelayedCount))
            } else {
                if (deferred) {
                    deferred.resolve()
                }
            }
        }
        executingName = oldExecutingName;
        if (deferred && result && result.done) {
            result.done(deferred.resolve).fail(deferred.reject)
        }
        if (!executingName && delayedFuncs.length) {
            ("render" === delayedNames.shift() ? deferRender : deferUpdate)(delayedFuncs.shift(), delayedDeferreds.shift())
        }
        return result || (0, _deferred.when)()
    }
};
var deferRender = function(func, deferred) {
    return deferExecute("render", func, deferred)
};
exports.deferRender = deferRender;
var deferUpdate = function(func, deferred) {
    return deferExecute("update", func, deferred)
};
exports.deferUpdate = deferUpdate;
var deferRenderer = function(func) {
    return function() {
        var that = this;
        return deferExecute("render", function() {
            return func.call(that)
        })
    }
};
exports.deferRenderer = deferRenderer;
var deferUpdater = function(func) {
    return function() {
        var that = this;
        return deferExecute("update", function() {
            return func.call(that)
        })
    }
};
exports.deferUpdater = deferUpdater;
var findBestMatches = function(targetFilter, items, mapFn) {
    var bestMatches = [];
    var maxMatchCount = 0;
    (0, _iterator.each)(items, function(index, itemSrc) {
        var matchCount = 0;
        var item = mapFn ? mapFn(itemSrc) : itemSrc;
        (0, _iterator.each)(targetFilter, function(paramName, targetValue) {
            var value = item[paramName];
            if (void 0 === value) {
                return
            }
            if (match(value, targetValue)) {
                matchCount++;
                return
            }
            matchCount = -1;
            return false
        });
        if (matchCount < maxMatchCount) {
            return
        }
        if (matchCount > maxMatchCount) {
            bestMatches.length = 0;
            maxMatchCount = matchCount
        }
        bestMatches.push(itemSrc)
    });
    return bestMatches
};
exports.findBestMatches = findBestMatches;
var match = function(value, targetValue) {
    if (Array.isArray(value) && Array.isArray(targetValue)) {
        var mismatch = false;
        (0, _iterator.each)(value, function(index, valueItem) {
            if (valueItem !== targetValue[index]) {
                mismatch = true;
                return false
            }
        });
        if (mismatch) {
            return false
        }
        return true
    }
    if (value === targetValue) {
        return true
    }
    return false
};
var splitPair = function(raw) {
    var _raw$x, _raw$y;
    switch ((0, _type.type)(raw)) {
        case "string":
            return raw.split(/\s+/, 2);
        case "object":
            return [null !== (_raw$x = raw.x) && void 0 !== _raw$x ? _raw$x : raw.h, null !== (_raw$y = raw.y) && void 0 !== _raw$y ? _raw$y : raw.v];
        case "number":
            return [raw];
        case "array":
            return raw;
        default:
            return null
    }
};
exports.splitPair = splitPair;
var normalizeKey = function(id) {
    var key = (0, _type.isString)(id) ? id : id.toString();
    var arr = key.match(/[^a-zA-Z0-9_]/g);
    arr && (0, _iterator.each)(arr, function(_, sign) {
        key = key.replace(sign, "__" + sign.charCodeAt() + "__")
    });
    return key
};
exports.normalizeKey = normalizeKey;
var denormalizeKey = function(key) {
    var arr = key.match(/__\d+__/g);
    arr && arr.forEach(function(char) {
        var charCode = parseInt(char.replace("__", ""));
        key = key.replace(char, String.fromCharCode(charCode))
    });
    return key
};
exports.denormalizeKey = denormalizeKey;
var pairToObject = function(raw, preventRound) {
    var pair = splitPair(raw);
    var h = preventRound ? parseFloat(pair && pair[0]) : parseInt(pair && pair[0], 10);
    var v = preventRound ? parseFloat(pair && pair[1]) : parseInt(pair && pair[1], 10);
    if (!isFinite(h)) {
        h = 0
    }
    if (!isFinite(v)) {
        v = h
    }
    return {
        h: h,
        v: v
    }
};
exports.pairToObject = pairToObject;
var getKeyHash = function(key) {
    if (key instanceof _guid.default) {
        return key.toString()
    } else {
        if ((0, _type.isObject)(key) || Array.isArray(key)) {
            try {
                var keyHash = JSON.stringify(key);
                return "{}" === keyHash ? key : keyHash
            } catch (e) {
                return key
            }
        }
    }
    return key
};
exports.getKeyHash = getKeyHash;
var escapeRegExp = function(string) {
    return string.replace(/[[\]{}\-()*+?.\\^$|\s]/g, "\\$&")
};
exports.escapeRegExp = escapeRegExp;
var applyServerDecimalSeparator = function(value) {
    var separator = (0, _config.default)().serverDecimalSeparator;
    if ((0, _type.isDefined)(value)) {
        value = value.toString().replace(".", separator)
    }
    return value
};
exports.applyServerDecimalSeparator = applyServerDecimalSeparator;
var noop = function() {};
exports.noop = noop;
var asyncNoop = function() {
    return (new _deferred.Deferred).resolve().promise()
};
exports.asyncNoop = asyncNoop;
var grep = function(elements, checkFunction, invert) {
    var result = [];
    var check;
    var expectedCheck = !invert;
    for (var i = 0; i < elements.length; i++) {
        check = !!checkFunction(elements[i], i);
        if (check === expectedCheck) {
            result.push(elements[i])
        }
    }
    return result
};
exports.grep = grep;
var arraysEqualByValue = function(array1, array2, depth) {
    if (array1.length !== array2.length) {
        return false
    }
    for (var i = 0; i < array1.length; i++) {
        if (!equalByValue(array1[i], array2[i], depth + 1)) {
            return false
        }
    }
    return true
};
var objectsEqualByValue = function(object1, object2, depth, strict) {
    for (var propertyName in object1) {
        if (Object.prototype.hasOwnProperty.call(object1, propertyName) && !equalByValue(object1[propertyName], object2[propertyName], depth + 1, strict)) {
            return false
        }
    }
    for (var _propertyName in object2) {
        if (!(_propertyName in object1)) {
            return false
        }
    }
    return true
};
var maxEqualityDepth = 3;
var equalByValue = function(object1, object2) {
    var depth = arguments.length > 2 && void 0 !== arguments[2] ? arguments[2] : 0;
    var strict = arguments.length > 3 && void 0 !== arguments[3] ? arguments[3] : true;
    object1 = (0, _data.toComparable)(object1, true);
    object2 = (0, _data.toComparable)(object2, true);
    var comparisonResult = strict ? object1 === object2 : object1 == object2;
    if (comparisonResult || depth >= maxEqualityDepth) {
        return true
    }
    if ((0, _type.isObject)(object1) && (0, _type.isObject)(object2)) {
        return objectsEqualByValue(object1, object2, depth, strict)
    } else {
        if (Array.isArray(object1) && Array.isArray(object2)) {
            return arraysEqualByValue(object1, object2, depth)
        }
    }
    return false
};
exports.equalByValue = equalByValue;


/***/ }),

/***/ "./node_modules/devextreme/core/utils/comparator.js":
/*!**********************************************************!*\
  !*** ./node_modules/devextreme/core/utils/comparator.js ***!
  \**********************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/**
 * DevExtreme (core/utils/comparator.js)
 * Version: 20.2.3
 * Build date: Tue Oct 20 2020
 *
 * Copyright (c) 2012 - 2020 Developer Express Inc. ALL RIGHTS RESERVED
 * Read about DevExtreme licensing here: https://js.devexpress.com/Licensing/
 */

exports.equals = void 0;
var _dom_adapter = _interopRequireDefault(__webpack_require__(/*! ../dom_adapter */ "./node_modules/devextreme/core/dom_adapter.js"));
var _data = __webpack_require__(/*! ./data */ "./node_modules/devextreme/core/utils/data.js");
var _type = __webpack_require__(/*! ./type */ "./node_modules/devextreme/core/utils/type.js");

function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
        "default": obj
    }
}

function _typeof(obj) {
    "@babel/helpers - typeof";
    if ("function" === typeof Symbol && "symbol" === typeof Symbol.iterator) {
        _typeof = function(obj) {
            return typeof obj
        }
    } else {
        _typeof = function(obj) {
            return obj && "function" === typeof Symbol && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj
        }
    }
    return _typeof(obj)
}
var hasNegation = function(oldValue, newValue) {
    return 1 / oldValue === 1 / newValue
};
var equals = function(oldValue, newValue) {
    oldValue = (0, _data.toComparable)(oldValue, true);
    newValue = (0, _data.toComparable)(newValue, true);
    if (oldValue && newValue && (0, _type.isRenderer)(oldValue) && (0, _type.isRenderer)(newValue)) {
        return newValue.is(oldValue)
    }
    var oldValueIsNaN = oldValue !== oldValue;
    var newValueIsNaN = newValue !== newValue;
    if (oldValueIsNaN && newValueIsNaN) {
        return true
    }
    if (0 === oldValue && 0 === newValue) {
        return hasNegation(oldValue, newValue)
    }
    if (null === oldValue || "object" !== _typeof(oldValue) || _dom_adapter.default.isElementNode(oldValue)) {
        return oldValue === newValue
    }
    return false
};
exports.equals = equals;


/***/ }),

/***/ "./node_modules/devextreme/core/utils/console.js":
/*!*******************************************************!*\
  !*** ./node_modules/devextreme/core/utils/console.js ***!
  \*******************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/**
 * DevExtreme (core/utils/console.js)
 * Version: 20.2.3
 * Build date: Tue Oct 20 2020
 *
 * Copyright (c) 2012 - 2020 Developer Express Inc. ALL RIGHTS RESERVED
 * Read about DevExtreme licensing here: https://js.devexpress.com/Licensing/
 */

exports.debug = exports.logger = void 0;
var _type = __webpack_require__(/*! ./type */ "./node_modules/devextreme/core/utils/type.js");
var noop = function() {};
var getConsoleMethod = function(method) {
    if ("undefined" === typeof console || !(0, _type.isFunction)(console[method])) {
        return noop
    }
    return console[method].bind(console)
};
var logger = {
    info: getConsoleMethod("info"),
    warn: getConsoleMethod("warn"),
    error: getConsoleMethod("error")
};
exports.logger = logger;
var debug = function() {
    function assert(condition, message) {
        if (!condition) {
            throw new Error(message)
        }
    }

    function assertParam(parameter, message) {
        assert(null !== parameter && void 0 !== parameter, message)
    }
    return {
        assert: assert,
        assertParam: assertParam
    }
}();
exports.debug = debug;


/***/ }),

/***/ "./node_modules/devextreme/core/utils/data.js":
/*!****************************************************!*\
  !*** ./node_modules/devextreme/core/utils/data.js ***!
  \****************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/**
 * DevExtreme (core/utils/data.js)
 * Version: 20.2.3
 * Build date: Tue Oct 20 2020
 *
 * Copyright (c) 2012 - 2020 Developer Express Inc. ALL RIGHTS RESERVED
 * Read about DevExtreme licensing here: https://js.devexpress.com/Licensing/
 */

exports.toComparable = exports.compileSetter = exports.compileGetter = void 0;
var _errors = _interopRequireDefault(__webpack_require__(/*! ../errors */ "./node_modules/devextreme/core/errors.js"));
var _class = _interopRequireDefault(__webpack_require__(/*! ../class */ "./node_modules/devextreme/core/class.js"));
var _object = __webpack_require__(/*! ./object */ "./node_modules/devextreme/core/utils/object.js");
var _type = __webpack_require__(/*! ./type */ "./node_modules/devextreme/core/utils/type.js");
var _iterator = __webpack_require__(/*! ./iterator */ "./node_modules/devextreme/core/utils/iterator.js");
var _variable_wrapper = _interopRequireDefault(__webpack_require__(/*! ./variable_wrapper */ "./node_modules/devextreme/core/utils/variable_wrapper.js"));

function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
        "default": obj
    }
}
var unwrapVariable = _variable_wrapper.default.unwrap;
var isWrapped = _variable_wrapper.default.isWrapped;
var assign = _variable_wrapper.default.assign;
var bracketsToDots = function(expr) {
    return expr.replace(/\[/g, ".").replace(/\]/g, "")
};
var readPropValue = function(obj, propName, options) {
    options = options || {};
    if ("this" === propName) {
        return unwrap(obj, options)
    }
    return unwrap(obj[propName], options)
};
var assignPropValue = function(obj, propName, value, options) {
    if ("this" === propName) {
        throw new _errors.default.Error("E4016")
    }
    var propValue = obj[propName];
    if (options.unwrapObservables && isWrapped(propValue)) {
        assign(propValue, value)
    } else {
        obj[propName] = value
    }
};
var prepareOptions = function(options) {
    options = options || {};
    options.unwrapObservables = void 0 !== options.unwrapObservables ? options.unwrapObservables : true;
    return options
};

function unwrap(value, options) {
    return options.unwrapObservables ? unwrapVariable(value) : value
}
var compileGetter = function(expr) {
    if (arguments.length > 1) {
        expr = [].slice.call(arguments)
    }
    if (!expr || "this" === expr) {
        return function(obj) {
            return obj
        }
    }
    if ("string" === typeof expr) {
        expr = bracketsToDots(expr);
        var path = expr.split(".");
        return function(obj, options) {
            options = prepareOptions(options);
            var functionAsIs = options.functionsAsIs;
            var hasDefaultValue = "defaultValue" in options;
            var current = unwrap(obj, options);
            for (var i = 0; i < path.length; i++) {
                if (!current) {
                    if (null == current && hasDefaultValue) {
                        return options.defaultValue
                    }
                    break
                }
                var pathPart = path[i];
                if (hasDefaultValue && (0, _type.isObject)(current) && !(pathPart in current)) {
                    return options.defaultValue
                }
                var next = unwrap(current[pathPart], options);
                if (!functionAsIs && (0, _type.isFunction)(next)) {
                    next = next.call(current)
                }
                current = next
            }
            return current
        }
    }
    if (Array.isArray(expr)) {
        return combineGetters(expr)
    }
    if ((0, _type.isFunction)(expr)) {
        return expr
    }
};
exports.compileGetter = compileGetter;

function combineGetters(getters) {
    var compiledGetters = {};
    for (var i = 0, l = getters.length; i < l; i++) {
        var getter = getters[i];
        compiledGetters[getter] = compileGetter(getter)
    }
    return function(obj, options) {
        var result;
        (0, _iterator.each)(compiledGetters, function(name) {
            var value = this(obj, options);
            if (void 0 === value) {
                return
            }
            var current = result || (result = {});
            var path = name.split(".");
            var last = path.length - 1;
            for (var _i = 0; _i < last; _i++) {
                var pathItem = path[_i];
                if (!(pathItem in current)) {
                    current[pathItem] = {}
                }
                current = current[pathItem]
            }
            current[path[last]] = value
        });
        return result
    }
}
var ensurePropValueDefined = function(obj, propName, value, options) {
    if ((0, _type.isDefined)(value)) {
        return value
    }
    var newValue = {};
    assignPropValue(obj, propName, newValue, options);
    return newValue
};
var compileSetter = function(expr) {
    expr = bracketsToDots(expr || "this").split(".");
    var lastLevelIndex = expr.length - 1;
    return function(obj, value, options) {
        options = prepareOptions(options);
        var currentValue = unwrap(obj, options);
        expr.forEach(function(propertyName, levelIndex) {
            var propertyValue = readPropValue(currentValue, propertyName, options);
            var isPropertyFunc = !options.functionsAsIs && (0, _type.isFunction)(propertyValue) && !isWrapped(propertyValue);
            if (levelIndex === lastLevelIndex) {
                if (options.merge && (0, _type.isPlainObject)(value) && (!(0, _type.isDefined)(propertyValue) || (0, _type.isPlainObject)(propertyValue))) {
                    propertyValue = ensurePropValueDefined(currentValue, propertyName, propertyValue, options);
                    (0, _object.deepExtendArraySafe)(propertyValue, value, false, true)
                } else {
                    if (isPropertyFunc) {
                        currentValue[propertyName](value)
                    } else {
                        assignPropValue(currentValue, propertyName, value, options)
                    }
                }
            } else {
                propertyValue = ensurePropValueDefined(currentValue, propertyName, propertyValue, options);
                if (isPropertyFunc) {
                    propertyValue = propertyValue.call(currentValue)
                }
                currentValue = propertyValue
            }
        })
    }
};
exports.compileSetter = compileSetter;
var toComparable = function(value, caseSensitive) {
    if (value instanceof Date) {
        return value.getTime()
    }
    if (value && value instanceof _class.default && value.valueOf) {
        return value.valueOf()
    }
    if (!caseSensitive && "string" === typeof value) {
        return value.toLowerCase()
    }
    return value
};
exports.toComparable = toComparable;


/***/ }),

/***/ "./node_modules/devextreme/core/utils/deferred.js":
/*!********************************************************!*\
  !*** ./node_modules/devextreme/core/utils/deferred.js ***!
  \********************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/**
 * DevExtreme (core/utils/deferred.js)
 * Version: 20.2.3
 * Build date: Tue Oct 20 2020
 *
 * Copyright (c) 2012 - 2020 Developer Express Inc. ALL RIGHTS RESERVED
 * Read about DevExtreme licensing here: https://js.devexpress.com/Licensing/
 */

exports.fromPromise = fromPromise;
exports.setStrategy = setStrategy;
exports.Deferred = Deferred;
exports.when = when;
var _type = __webpack_require__(/*! ../utils/type */ "./node_modules/devextreme/core/utils/type.js");
var _extend = __webpack_require__(/*! ../utils/extend */ "./node_modules/devextreme/core/utils/extend.js");
var _callbacks = _interopRequireDefault(__webpack_require__(/*! ../utils/callbacks */ "./node_modules/devextreme/core/utils/callbacks.js"));

function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
        "default": obj
    }
}
var deferredConfig = [{
    method: "resolve",
    handler: "done",
    state: "resolved"
}, {
    method: "reject",
    handler: "fail",
    state: "rejected"
}, {
    method: "notify",
    handler: "progress"
}];
var _DeferredObj = function() {
    var that = this;
    this._state = "pending";
    this._promise = {};
    deferredConfig.forEach(function(config) {
        var methodName = config.method;
        this[methodName + "Callbacks"] = new _callbacks.default;
        this[methodName] = function() {
            return this[methodName + "With"](this._promise, arguments)
        }.bind(this);
        this._promise[config.handler] = function(handler) {
            if (!handler) {
                return this
            }
            var callbacks = that[methodName + "Callbacks"];
            if (callbacks.fired()) {
                handler.apply(that[methodName + "Context"], that[methodName + "Args"])
            } else {
                callbacks.add(function(context, args) {
                    handler.apply(context, args)
                }.bind(this))
            }
            return this
        }
    }.bind(this));
    this._promise.always = function(handler) {
        return this.done(handler).fail(handler)
    };
    this._promise.catch = function(handler) {
        return this.then(null, handler)
    };
    this._promise.then = function(resolve, reject) {
        var result = new _DeferredObj;
        ["done", "fail"].forEach(function(method) {
            var callback = "done" === method ? resolve : reject;
            this[method](function() {
                if (!callback) {
                    result["done" === method ? "resolve" : "reject"].apply(this, arguments);
                    return
                }
                var callbackResult = callback && callback.apply(this, arguments);
                if ((0, _type.isDeferred)(callbackResult)) {
                    callbackResult.done(result.resolve).fail(result.reject)
                } else {
                    if ((0, _type.isPromise)(callbackResult)) {
                        callbackResult.then(result.resolve, result.reject)
                    } else {
                        result.resolve.apply(this, (0, _type.isDefined)(callbackResult) ? [callbackResult] : arguments)
                    }
                }
            })
        }.bind(this));
        return result.promise()
    };
    this._promise.state = function() {
        return that._state
    };
    this._promise.promise = function(args) {
        return args ? (0, _extend.extend)(args, that._promise) : that._promise
    };
    this._promise.promise(this)
};
deferredConfig.forEach(function(config) {
    var methodName = config.method;
    var state = config.state;
    _DeferredObj.prototype[methodName + "With"] = function(context, args) {
        var callbacks = this[methodName + "Callbacks"];
        if ("pending" === this.state()) {
            this[methodName + "Args"] = args;
            this[methodName + "Context"] = context;
            if (state) {
                this._state = state
            }
            callbacks.fire(context, args)
        }
        return this
    }
});

function fromPromise(promise, context) {
    if ((0, _type.isDeferred)(promise)) {
        return promise
    } else {
        if ((0, _type.isPromise)(promise)) {
            var d = new _DeferredObj;
            promise.then(function() {
                d.resolveWith.apply(d, [context].concat([
                    [].slice.call(arguments)
                ]))
            }, function() {
                d.rejectWith.apply(d, [context].concat([
                    [].slice.call(arguments)
                ]))
            });
            return d
        }
    }
    return (new _DeferredObj).resolveWith(context, [promise])
}
var whenFunc = function() {
    if (1 === arguments.length) {
        return fromPromise(arguments[0])
    }
    var values = [].slice.call(arguments);
    var contexts = [];
    var resolvedCount = 0;
    var deferred = new _DeferredObj;
    var updateState = function(i) {
        return function(value) {
            contexts[i] = this;
            values[i] = arguments.length > 1 ? [].slice.call(arguments) : value;
            resolvedCount++;
            if (resolvedCount === values.length) {
                deferred.resolveWith(contexts, values)
            }
        }
    };
    for (var i = 0; i < values.length; i++) {
        if ((0, _type.isDeferred)(values[i])) {
            values[i].promise().done(updateState(i)).fail(deferred.reject)
        } else {
            resolvedCount++
        }
    }
    if (resolvedCount === values.length) {
        deferred.resolveWith(contexts, values)
    }
    return deferred.promise()
};

function setStrategy(value) {
    _DeferredObj = value.Deferred;
    whenFunc = value.when
}

function Deferred() {
    return new _DeferredObj
}

function when() {
    return whenFunc.apply(this, arguments)
}


/***/ }),

/***/ "./node_modules/devextreme/core/utils/dependency_injector.js":
/*!*******************************************************************!*\
  !*** ./node_modules/devextreme/core/utils/dependency_injector.js ***!
  \*******************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/**
 * DevExtreme (core/utils/dependency_injector.js)
 * Version: 20.2.3
 * Build date: Tue Oct 20 2020
 *
 * Copyright (c) 2012 - 2020 Developer Express Inc. ALL RIGHTS RESERVED
 * Read about DevExtreme licensing here: https://js.devexpress.com/Licensing/
 */

exports.default = _default;
var _extend = __webpack_require__(/*! ./extend */ "./node_modules/devextreme/core/utils/extend.js");
var _type = __webpack_require__(/*! ./type */ "./node_modules/devextreme/core/utils/type.js");
var _iterator = __webpack_require__(/*! ./iterator */ "./node_modules/devextreme/core/utils/iterator.js");
var _class = _interopRequireDefault(__webpack_require__(/*! ../class */ "./node_modules/devextreme/core/class.js"));

function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
        "default": obj
    }
}

function _default(object) {
    var BaseClass = _class.default.inherit(object);
    var InjectedClass = BaseClass;
    var instance = new InjectedClass(object);
    var initialFields = {};
    var injectFields = function(injectionObject, initial) {
        (0, _iterator.each)(injectionObject, function(key) {
            if ((0, _type.isFunction)(instance[key])) {
                if (initial || !object[key]) {
                    object[key] = function() {
                        return instance[key].apply(object, arguments)
                    }
                }
            } else {
                if (initial) {
                    initialFields[key] = object[key]
                }
                object[key] = instance[key]
            }
        })
    };
    injectFields(object, true);
    object.inject = function(injectionObject) {
        InjectedClass = InjectedClass.inherit(injectionObject);
        instance = new InjectedClass;
        injectFields(injectionObject)
    };
    object.resetInjection = function() {
        (0, _extend.extend)(object, initialFields);
        InjectedClass = BaseClass;
        instance = new BaseClass
    };
    return object
}
module.exports = exports.default;


/***/ }),

/***/ "./node_modules/devextreme/core/utils/dom.js":
/*!***************************************************!*\
  !*** ./node_modules/devextreme/core/utils/dom.js ***!
  \***************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/**
 * DevExtreme (core/utils/dom.js)
 * Version: 20.2.3
 * Build date: Tue Oct 20 2020
 *
 * Copyright (c) 2012 - 2020 Developer Express Inc. ALL RIGHTS RESERVED
 * Read about DevExtreme licensing here: https://js.devexpress.com/Licensing/
 */

exports.createTextElementHiddenCopy = exports.contains = exports.clipboardText = exports.normalizeTemplateElement = exports.extractTemplateMarkup = exports.closestCommonParent = exports.clearSelection = exports.resetActiveElement = void 0;
var _dom_adapter = _interopRequireDefault(__webpack_require__(/*! ../../core/dom_adapter */ "./node_modules/devextreme/core/dom_adapter.js"));
var _renderer = _interopRequireDefault(__webpack_require__(/*! ../../core/renderer */ "./node_modules/devextreme/core/renderer.js"));
var _type = __webpack_require__(/*! ./type */ "./node_modules/devextreme/core/utils/type.js");
var _window = __webpack_require__(/*! ./window */ "./node_modules/devextreme/core/utils/window.js");

function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
        "default": obj
    }
}
var window = (0, _window.getWindow)();
var resetActiveElement = function() {
    var activeElement = _dom_adapter.default.getActiveElement();
    var body = _dom_adapter.default.getBody();
    if (activeElement && activeElement !== body && activeElement.blur) {
        try {
            activeElement.blur()
        } catch (e) {
            body.blur()
        }
    }
};
exports.resetActiveElement = resetActiveElement;
var clearSelection = function() {
    var selection = window.getSelection();
    if (!selection) {
        return
    }
    if ("Caret" === selection.type) {
        return
    }
    if (selection.empty) {
        selection.empty()
    } else {
        if (selection.removeAllRanges) {
            try {
                selection.removeAllRanges()
            } catch (e) {}
        }
    }
};
exports.clearSelection = clearSelection;
var closestCommonParent = function(startTarget, endTarget) {
    var $startTarget = (0, _renderer.default)(startTarget);
    var $endTarget = (0, _renderer.default)(endTarget);
    if ($startTarget[0] === $endTarget[0]) {
        return $startTarget[0]
    }
    var $startParents = $startTarget.parents();
    var $endParents = $endTarget.parents();
    var startingParent = Math.min($startParents.length, $endParents.length);
    for (var i = -startingParent; i < 0; i++) {
        if ($startParents.get(i) === $endParents.get(i)) {
            return $startParents.get(i)
        }
    }
};
exports.closestCommonParent = closestCommonParent;
var extractTemplateMarkup = function(element) {
    element = (0, _renderer.default)(element);
    var templateTag = element.length && element.filter(function() {
        var $node = (0, _renderer.default)(this);
        return $node.is("script[type]") && $node.attr("type").indexOf("script") < 0
    });
    if (templateTag.length) {
        return templateTag.eq(0).html()
    } else {
        element = (0, _renderer.default)("<div>").append(element);
        return element.html()
    }
};
exports.extractTemplateMarkup = extractTemplateMarkup;
var normalizeTemplateElement = function normalizeTemplateElement(element) {
    var $element = (0, _type.isDefined)(element) && (element.nodeType || (0, _type.isRenderer)(element)) ? (0, _renderer.default)(element) : (0, _renderer.default)("<div>").html(element).contents();
    if (1 === $element.length) {
        if ($element.is("script")) {
            $element = normalizeTemplateElement($element.html().trim())
        } else {
            if ($element.is("table")) {
                $element = $element.children("tbody").contents()
            }
        }
    }
    return $element
};
exports.normalizeTemplateElement = normalizeTemplateElement;
var clipboardText = function(event, text) {
    var clipboard = event.originalEvent && event.originalEvent.clipboardData || window.clipboardData;
    if (1 === arguments.length) {
        return clipboard && clipboard.getData("Text")
    }
    clipboard && clipboard.setData("Text", text)
};
exports.clipboardText = clipboardText;
var contains = function contains(container, element) {
    if (!element) {
        return false
    }
    if (_dom_adapter.default.isTextNode(element)) {
        element = element.parentNode
    }
    if (_dom_adapter.default.isDocument(container)) {
        return container.documentElement.contains(element)
    }
    if ((0, _type.isWindow)(container)) {
        return contains(container.document, element)
    }
    return container.contains ? container.contains(element) : !!(element.compareDocumentPosition(container) & element.DOCUMENT_POSITION_CONTAINS)
};
exports.contains = contains;
var createTextElementHiddenCopy = function(element, text, options) {
    var elementStyles = window.getComputedStyle((0, _renderer.default)(element).get(0));
    var includePaddings = options && options.includePaddings;
    return (0, _renderer.default)("<div>").text(text).css({
        fontStyle: elementStyles.fontStyle,
        fontVariant: elementStyles.fontVariant,
        fontWeight: elementStyles.fontWeight,
        fontSize: elementStyles.fontSize,
        fontFamily: elementStyles.fontFamily,
        letterSpacing: elementStyles.letterSpacing,
        border: elementStyles.border,
        paddingTop: includePaddings ? elementStyles.paddingTop : "",
        paddingRight: includePaddings ? elementStyles.paddingRight : "",
        paddingBottom: includePaddings ? elementStyles.paddingBottom : "",
        paddingLeft: includePaddings ? elementStyles.paddingLeft : "",
        visibility: "hidden",
        whiteSpace: "pre",
        position: "absolute",
        "float": "left"
    })
};
exports.createTextElementHiddenCopy = createTextElementHiddenCopy;


/***/ }),

/***/ "./node_modules/devextreme/core/utils/error.js":
/*!*****************************************************!*\
  !*** ./node_modules/devextreme/core/utils/error.js ***!
  \*****************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/**
 * DevExtreme (core/utils/error.js)
 * Version: 20.2.3
 * Build date: Tue Oct 20 2020
 *
 * Copyright (c) 2012 - 2020 Developer Express Inc. ALL RIGHTS RESERVED
 * Read about DevExtreme licensing here: https://js.devexpress.com/Licensing/
 */

exports.default = _default;
var _extend = __webpack_require__(/*! ./extend */ "./node_modules/devextreme/core/utils/extend.js");
var _console = __webpack_require__(/*! ./console */ "./node_modules/devextreme/core/utils/console.js");
var _string = __webpack_require__(/*! ./string */ "./node_modules/devextreme/core/utils/string.js");
var _version = _interopRequireDefault(__webpack_require__(/*! ../version */ "./node_modules/devextreme/core/version.js"));

function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
        "default": obj
    }
}
var ERROR_URL = "http://js.devexpress.com/error/" + _version.default.split(".").slice(0, 2).join("_") + "/";

function _default(baseErrors, errors) {
    var exports = {
        ERROR_MESSAGES: (0, _extend.extend)(errors, baseErrors),
        Error: function() {
            return makeError([].slice.call(arguments))
        },
        log: function(id) {
            var method = "log";
            if (/^E\d+$/.test(id)) {
                method = "error"
            } else {
                if (/^W\d+$/.test(id)) {
                    method = "warn"
                }
            }
            _console.logger[method]("log" === method ? id : combineMessage([].slice.call(arguments)))
        }
    };

    function combineMessage(args) {
        var id = args[0];
        args = args.slice(1);
        return formatMessage(id, formatDetails(id, args))
    }

    function formatDetails(id, args) {
        args = [exports.ERROR_MESSAGES[id]].concat(args);
        return _string.format.apply(this, args).replace(/\.*\s*?$/, "")
    }

    function formatMessage(id, details) {
        return _string.format.apply(this, ["{0} - {1}. See:\n{2}", id, details, getErrorUrl(id)])
    }

    function makeError(args) {
        var id = args[0];
        args = args.slice(1);
        var details = formatDetails(id, args);
        var url = getErrorUrl(id);
        var message = formatMessage(id, details);
        return (0, _extend.extend)(new Error(message), {
            __id: id,
            __details: details,
            url: url
        })
    }

    function getErrorUrl(id) {
        return ERROR_URL + id
    }
    return exports
}
module.exports = exports.default;


/***/ }),

/***/ "./node_modules/devextreme/core/utils/extend.js":
/*!******************************************************!*\
  !*** ./node_modules/devextreme/core/utils/extend.js ***!
  \******************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/**
 * DevExtreme (core/utils/extend.js)
 * Version: 20.2.3
 * Build date: Tue Oct 20 2020
 *
 * Copyright (c) 2012 - 2020 Developer Express Inc. ALL RIGHTS RESERVED
 * Read about DevExtreme licensing here: https://js.devexpress.com/Licensing/
 */

exports.extend = exports.extendFromObject = void 0;
var _type = __webpack_require__(/*! ./type */ "./node_modules/devextreme/core/utils/type.js");
var extendFromObject = function(target, source, overrideExistingValues) {
    target = target || {};
    for (var prop in source) {
        if (Object.prototype.hasOwnProperty.call(source, prop)) {
            var value = source[prop];
            if (!(prop in target) || overrideExistingValues) {
                target[prop] = value
            }
        }
    }
    return target
};
exports.extendFromObject = extendFromObject;
var extend = function extend(target) {
    target = target || {};
    var i = 1;
    var deep = false;
    if ("boolean" === typeof target) {
        deep = target;
        target = arguments[1] || {};
        i++
    }
    for (; i < arguments.length; i++) {
        var source = arguments[i];
        if (null == source) {
            continue
        }
        for (var key in source) {
            var targetValue = target[key];
            var sourceValue = source[key];
            var sourceValueIsArray = false;
            var clone = void 0;
            if ("__proto__" === key || target === sourceValue) {
                continue
            }
            if (deep && sourceValue && ((0, _type.isPlainObject)(sourceValue) || (sourceValueIsArray = Array.isArray(sourceValue)))) {
                if (sourceValueIsArray) {
                    clone = targetValue && Array.isArray(targetValue) ? targetValue : []
                } else {
                    clone = targetValue && (0, _type.isPlainObject)(targetValue) ? targetValue : {}
                }
                target[key] = extend(deep, clone, sourceValue)
            } else {
                if (void 0 !== sourceValue) {
                    target[key] = sourceValue
                }
            }
        }
    }
    return target
};
exports.extend = extend;


/***/ }),

/***/ "./node_modules/devextreme/core/utils/html_parser.js":
/*!***********************************************************!*\
  !*** ./node_modules/devextreme/core/utils/html_parser.js ***!
  \***********************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/**
 * DevExtreme (core/utils/html_parser.js)
 * Version: 20.2.3
 * Build date: Tue Oct 20 2020
 *
 * Copyright (c) 2012 - 2020 Developer Express Inc. ALL RIGHTS RESERVED
 * Read about DevExtreme licensing here: https://js.devexpress.com/Licensing/
 */

exports.isTablePart = exports.parseHTML = void 0;
var _array = __webpack_require__(/*! ./array */ "./node_modules/devextreme/core/utils/array.js");
var _dom_adapter = _interopRequireDefault(__webpack_require__(/*! ../dom_adapter */ "./node_modules/devextreme/core/dom_adapter.js"));

function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
        "default": obj
    }
}
var isTagName = /<([a-z][^/\0>\x20\t\r\n\f]+)/i;
var tagWrappers = {
    "default": {
        tagsCount: 0,
        startTags: "",
        endTags: ""
    },
    thead: {
        tagsCount: 1,
        startTags: "<table>",
        endTags: "</table>"
    },
    td: {
        tagsCount: 3,
        startTags: "<table><tbody><tr>",
        endTags: "</tr></tbody></table>"
    },
    col: {
        tagsCount: 2,
        startTags: "<table><colgroup>",
        endTags: "</colgroup></table>"
    },
    tr: {
        tagsCount: 2,
        startTags: "<table><tbody>",
        endTags: "</tbody></table>"
    }
};
tagWrappers.tbody = tagWrappers.colgroup = tagWrappers.caption = tagWrappers.tfoot = tagWrappers.thead;
tagWrappers.th = tagWrappers.td;
var parseHTML = function(html) {
    if ("string" !== typeof html) {
        return null
    }
    var fragment = _dom_adapter.default.createDocumentFragment();
    var container = fragment.appendChild(_dom_adapter.default.createElement("div"));
    var tags = isTagName.exec(html);
    var firstRootTag = tags && tags[1].toLowerCase();
    var tagWrapper = tagWrappers[firstRootTag] || tagWrappers.default;
    container.innerHTML = tagWrapper.startTags + html + tagWrapper.endTags;
    for (var i = 0; i < tagWrapper.tagsCount; i++) {
        container = container.lastChild
    }
    return (0, _array.merge)([], container.childNodes)
};
exports.parseHTML = parseHTML;
var isTablePart = function(html) {
    var tags = isTagName.exec(html);
    return tags && tags[1] in tagWrappers
};
exports.isTablePart = isTablePart;


/***/ }),

/***/ "./node_modules/devextreme/core/utils/inflector.js":
/*!*********************************************************!*\
  !*** ./node_modules/devextreme/core/utils/inflector.js ***!
  \*********************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/**
 * DevExtreme (core/utils/inflector.js)
 * Version: 20.2.3
 * Build date: Tue Oct 20 2020
 *
 * Copyright (c) 2012 - 2020 Developer Express Inc. ALL RIGHTS RESERVED
 * Read about DevExtreme licensing here: https://js.devexpress.com/Licensing/
 */

exports.captionize = exports.titleize = exports.humanize = exports.camelize = exports.underscore = exports.dasherize = void 0;
var _iterator = __webpack_require__(/*! ./iterator */ "./node_modules/devextreme/core/utils/iterator.js");
var _normalize = function(text) {
    if (void 0 === text || null === text) {
        return ""
    }
    return String(text)
};
var _upperCaseFirst = function(text) {
    return _normalize(text).charAt(0).toUpperCase() + text.substr(1)
};
var _chop = function(text) {
    return _normalize(text).replace(/([a-z\d])([A-Z])/g, "$1 $2").split(/[\s_-]+/)
};
var dasherize = function(text) {
    return (0, _iterator.map)(_chop(text), function(p) {
        return p.toLowerCase()
    }).join("-")
};
exports.dasherize = dasherize;
var underscore = function(text) {
    return dasherize(text).replace(/-/g, "_")
};
exports.underscore = underscore;
var camelize = function(text, upperFirst) {
    return (0, _iterator.map)(_chop(text), function(p, i) {
        p = p.toLowerCase();
        if (upperFirst || i > 0) {
            p = _upperCaseFirst(p)
        }
        return p
    }).join("")
};
exports.camelize = camelize;
var humanize = function(text) {
    return _upperCaseFirst(dasherize(text).replace(/-/g, " "))
};
exports.humanize = humanize;
var titleize = function(text) {
    return (0, _iterator.map)(_chop(text), function(p) {
        return _upperCaseFirst(p.toLowerCase())
    }).join(" ")
};
exports.titleize = titleize;
var DIGIT_CHARS = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9"];
var captionize = function(name) {
    var captionList = [];
    var i;
    var char;
    var isPrevCharNewWord = false;
    var isNewWord = false;
    for (i = 0; i < name.length; i++) {
        char = name.charAt(i);
        isNewWord = char === char.toUpperCase() && "-" !== char && ")" !== char && "/" !== char || char in DIGIT_CHARS;
        if ("_" === char || "." === char) {
            char = " ";
            isNewWord = true
        } else {
            if (0 === i) {
                char = char.toUpperCase();
                isNewWord = true
            } else {
                if (!isPrevCharNewWord && isNewWord) {
                    if (captionList.length > 0) {
                        captionList.push(" ")
                    }
                }
            }
        }
        captionList.push(char);
        isPrevCharNewWord = isNewWord
    }
    return captionList.join("")
};
exports.captionize = captionize;


/***/ }),

/***/ "./node_modules/devextreme/core/utils/iterator.js":
/*!********************************************************!*\
  !*** ./node_modules/devextreme/core/utils/iterator.js ***!
  \********************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/**
 * DevExtreme (core/utils/iterator.js)
 * Version: 20.2.3
 * Build date: Tue Oct 20 2020
 *
 * Copyright (c) 2012 - 2020 Developer Express Inc. ALL RIGHTS RESERVED
 * Read about DevExtreme licensing here: https://js.devexpress.com/Licensing/
 */

exports.reverseEach = exports.each = exports.map = void 0;
var map = function(values, callback) {
    if (Array.isArray(values)) {
        return values.map(callback)
    }
    var result = [];
    for (var key in values) {
        result.push(callback(values[key], key))
    }
    return result
};
exports.map = map;
var each = function(values, callback) {
    if (!values) {
        return
    }
    if ("length" in values) {
        for (var i = 0; i < values.length; i++) {
            if (false === callback.call(values[i], i, values[i])) {
                break
            }
        }
    } else {
        for (var key in values) {
            if (false === callback.call(values[key], key, values[key])) {
                break
            }
        }
    }
    return values
};
exports.each = each;
var reverseEach = function(array, callback) {
    if (!array || !("length" in array) || 0 === array.length) {
        return
    }
    for (var i = array.length - 1; i >= 0; i--) {
        if (false === callback.call(array[i], i, array[i])) {
            break
        }
    }
};
exports.reverseEach = reverseEach;


/***/ }),

/***/ "./node_modules/devextreme/core/utils/math.js":
/*!****************************************************!*\
  !*** ./node_modules/devextreme/core/utils/math.js ***!
  \****************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/**
 * DevExtreme (core/utils/math.js)
 * Version: 20.2.3
 * Build date: Tue Oct 20 2020
 *
 * Copyright (c) 2012 - 2020 Developer Express Inc. ALL RIGHTS RESERVED
 * Read about DevExtreme licensing here: https://js.devexpress.com/Licensing/
 */

exports.adjust = adjust;
exports.getPrecision = getPrecision;
exports.getExponent = getExponent;
exports.getRoot = getRoot;
exports.solveCubicEquation = solveCubicEquation;
exports.trunc = trunc;
exports.inRange = exports.fitIntoRange = exports.sign = void 0;
var _type = __webpack_require__(/*! ./type */ "./node_modules/devextreme/core/utils/type.js");
var sign = function(value) {
    if (0 === value) {
        return 0
    }
    return value / Math.abs(value)
};
exports.sign = sign;
var fitIntoRange = function(value, minValue, maxValue) {
    var isMinValueUndefined = !minValue && 0 !== minValue;
    var isMaxValueUndefined = !maxValue && 0 !== maxValue;
    isMinValueUndefined && (minValue = !isMaxValueUndefined ? Math.min(value, maxValue) : value);
    isMaxValueUndefined && (maxValue = !isMinValueUndefined ? Math.max(value, minValue) : value);
    return Math.min(Math.max(value, minValue), maxValue)
};
exports.fitIntoRange = fitIntoRange;
var inRange = function(value, minValue, maxValue) {
    return value >= minValue && value <= maxValue
};
exports.inRange = inRange;

function getExponent(value) {
    return Math.abs(parseInt(value.toExponential().split("e")[1]))
}

function _isEdgeBug() {
    var value = 3e-4;
    var correctValue = "0.000300";
    var precisionValue = 3;
    return correctValue !== value.toPrecision(precisionValue)
}

function adjust(value, interval) {
    var precision = getPrecision(interval || 0) + 2;
    var separatedValue = value.toString().split(".");
    var sourceValue = value;
    var absValue = Math.abs(value);
    var separatedAdjustedValue;
    var isExponentValue = (0, _type.isExponential)(value);
    var integerPart = absValue > 1 ? 10 : 0;
    if (1 === separatedValue.length) {
        return value
    }
    if (!isExponentValue) {
        if ((0, _type.isExponential)(interval)) {
            precision = separatedValue[0].length + getExponent(interval)
        }
        value = absValue;
        value = value - Math.floor(value) + integerPart
    }
    precision = _isEdgeBug() && getExponent(value) > 6 || precision > 7 ? 15 : 7;
    if (!isExponentValue) {
        separatedAdjustedValue = parseFloat(value.toPrecision(precision)).toString().split(".");
        if (separatedAdjustedValue[0] === integerPart.toString()) {
            return parseFloat(separatedValue[0] + "." + separatedAdjustedValue[1])
        }
    }
    return parseFloat(sourceValue.toPrecision(precision))
}

function getPrecision(value) {
    var str = value.toString();
    if (str.indexOf(".") < 0) {
        return 0
    }
    var mantissa = str.split(".");
    var positionOfDelimiter = mantissa[1].indexOf("e");
    return positionOfDelimiter >= 0 ? positionOfDelimiter : mantissa[1].length
}

function getRoot(x, n) {
    if (x < 0 && n % 2 !== 1) {
        return NaN
    }
    var y = Math.pow(Math.abs(x), 1 / n);
    return n % 2 === 1 && x < 0 ? -y : y
}

function solveCubicEquation(a, b, c, d) {
    var min = 1e-8;
    if (Math.abs(a) < min) {
        a = b;
        b = c;
        c = d;
        if (Math.abs(a) < min) {
            a = b;
            b = c;
            if (Math.abs(a) < min) {
                return []
            }
            return [-b / a]
        }
        var D2 = b * b - 4 * a * c;
        if (Math.abs(D2) < min) {
            return [-b / (2 * a)]
        } else {
            if (D2 > 0) {
                return [(-b + Math.sqrt(D2)) / (2 * a), (-b - Math.sqrt(D2)) / (2 * a)]
            }
        }
        return []
    }
    var p = (3 * a * c - b * b) / (3 * a * a);
    var q = (2 * b * b * b - 9 * a * b * c + 27 * a * a * d) / (27 * a * a * a);
    var roots;
    var u;
    if (Math.abs(p) < min) {
        roots = [getRoot(-q, 3)]
    } else {
        if (Math.abs(q) < min) {
            roots = [0].concat(p < 0 ? [Math.sqrt(-p), -Math.sqrt(-p)] : [])
        } else {
            var D3 = q * q / 4 + p * p * p / 27;
            if (Math.abs(D3) < min) {
                roots = [-1.5 * q / p, 3 * q / p]
            } else {
                if (D3 > 0) {
                    u = getRoot(-q / 2 - Math.sqrt(D3), 3);
                    roots = [u - p / (3 * u)]
                } else {
                    u = 2 * Math.sqrt(-p / 3);
                    var t = Math.acos(3 * q / p / u) / 3;
                    var k = 2 * Math.PI / 3;
                    roots = [u * Math.cos(t), u * Math.cos(t - k), u * Math.cos(t - 2 * k)]
                }
            }
        }
    }
    for (var i = 0; i < roots.length; i++) {
        roots[i] -= b / (3 * a)
    }
    return roots
}

function trunc(value) {
    return Math.trunc ? Math.trunc(value) : value > 0 ? Math.floor(value) : Math.ceil(value)
}


/***/ }),

/***/ "./node_modules/devextreme/core/utils/object.js":
/*!******************************************************!*\
  !*** ./node_modules/devextreme/core/utils/object.js ***!
  \******************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/**
 * DevExtreme (core/utils/object.js)
 * Version: 20.2.3
 * Build date: Tue Oct 20 2020
 *
 * Copyright (c) 2012 - 2020 Developer Express Inc. ALL RIGHTS RESERVED
 * Read about DevExtreme licensing here: https://js.devexpress.com/Licensing/
 */

exports.deepExtendArraySafe = exports.orderEach = exports.clone = void 0;
var _type = __webpack_require__(/*! ./type */ "./node_modules/devextreme/core/utils/type.js");
var _variable_wrapper = _interopRequireDefault(__webpack_require__(/*! ./variable_wrapper */ "./node_modules/devextreme/core/utils/variable_wrapper.js"));

function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
        "default": obj
    }
}
var clone = function() {
    function Clone() {}
    return function(obj) {
        Clone.prototype = obj;
        return new Clone
    }
}();
exports.clone = clone;
var orderEach = function(map, func) {
    var keys = [];
    var key;
    var i;
    for (key in map) {
        if (Object.prototype.hasOwnProperty.call(map, key)) {
            keys.push(key)
        }
    }
    keys.sort(function(x, y) {
        var isNumberX = (0, _type.isNumeric)(x);
        var isNumberY = (0, _type.isNumeric)(y);
        if (isNumberX && isNumberY) {
            return x - y
        }
        if (isNumberX && !isNumberY) {
            return -1
        }
        if (!isNumberX && isNumberY) {
            return 1
        }
        if (x < y) {
            return -1
        }
        if (x > y) {
            return 1
        }
        return 0
    });
    for (i = 0; i < keys.length; i++) {
        key = keys[i];
        func(key, map[key])
    }
};
exports.orderEach = orderEach;
var assignValueToProperty = function(target, property, value, assignByReference) {
    if (!assignByReference && _variable_wrapper.default.isWrapped(target[property])) {
        _variable_wrapper.default.assign(target[property], value)
    } else {
        target[property] = value
    }
};
var deepExtendArraySafe = function deepExtendArraySafe(target, changes, extendComplexObject, assignByReference) {
    var prevValue;
    var newValue;
    for (var name in changes) {
        prevValue = target[name];
        newValue = changes[name];
        if ("__proto__" === name || target === newValue) {
            continue
        }
        if ((0, _type.isPlainObject)(newValue)) {
            var goDeeper = extendComplexObject ? (0, _type.isObject)(prevValue) : (0, _type.isPlainObject)(prevValue);
            newValue = deepExtendArraySafe(goDeeper ? prevValue : {}, newValue, extendComplexObject, assignByReference)
        }
        if (void 0 !== newValue && prevValue !== newValue) {
            assignValueToProperty(target, name, newValue, assignByReference)
        }
    }
    return target
};
exports.deepExtendArraySafe = deepExtendArraySafe;


/***/ }),

/***/ "./node_modules/devextreme/core/utils/position.js":
/*!********************************************************!*\
  !*** ./node_modules/devextreme/core/utils/position.js ***!
  \********************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/**
 * DevExtreme (core/utils/position.js)
 * Version: 20.2.3
 * Build date: Tue Oct 20 2020
 *
 * Copyright (c) 2012 - 2020 Developer Express Inc. ALL RIGHTS RESERVED
 * Read about DevExtreme licensing here: https://js.devexpress.com/Licensing/
 */

exports.getDefaultAlignment = exports.getBoundingRect = void 0;
var _config = _interopRequireDefault(__webpack_require__(/*! ../config */ "./node_modules/devextreme/core/config.js"));
var _type = __webpack_require__(/*! ../utils/type */ "./node_modules/devextreme/core/utils/type.js");

function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
        "default": obj
    }
}
var getDefaultAlignment = function(isRtlEnabled) {
    var rtlEnabled = null !== isRtlEnabled && void 0 !== isRtlEnabled ? isRtlEnabled : (0, _config.default)().rtlEnabled;
    return rtlEnabled ? "right" : "left"
};
exports.getDefaultAlignment = getDefaultAlignment;
var getBoundingRect = function(element) {
    if ((0, _type.isWindow)(element)) {
        return {
            width: element.outerWidth,
            height: element.outerHeight
        }
    }
    var rect;
    try {
        rect = element.getBoundingClientRect()
    } catch (e) {
        rect = {
            width: 0,
            height: 0,
            bottom: 0,
            top: 0,
            left: 0,
            right: 0
        }
    }
    return rect
};
exports.getBoundingRect = getBoundingRect;


/***/ }),

/***/ "./node_modules/devextreme/core/utils/public_component.js":
/*!****************************************************************!*\
  !*** ./node_modules/devextreme/core/utils/public_component.js ***!
  \****************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/**
 * DevExtreme (core/utils/public_component.js)
 * Version: 20.2.3
 * Build date: Tue Oct 20 2020
 *
 * Copyright (c) 2012 - 2020 Developer Express Inc. ALL RIGHTS RESERVED
 * Read about DevExtreme licensing here: https://js.devexpress.com/Licensing/
 */

exports.attachInstanceToElement = attachInstanceToElement;
exports.getInstanceByElement = getInstanceByElement;
exports.name = void 0;
var _element_data = __webpack_require__(/*! ../../core/element_data */ "./node_modules/devextreme/core/element_data.js");
var _events_engine = _interopRequireDefault(__webpack_require__(/*! ../../events/core/events_engine */ "./node_modules/devextreme/events/core/events_engine.js"));
var _weak_map = _interopRequireDefault(__webpack_require__(/*! ../polyfills/weak_map */ "./node_modules/devextreme/core/polyfills/weak_map.js"));
var _type = __webpack_require__(/*! ./type */ "./node_modules/devextreme/core/utils/type.js");
var _remove_event = _interopRequireDefault(__webpack_require__(/*! ../remove_event */ "./node_modules/devextreme/core/remove_event.js"));

function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
        "default": obj
    }
}
var COMPONENT_NAMES_DATA_KEY = "dxComponents";
var ANONYMOUS_COMPONENT_DATA_KEY = "dxPrivateComponent";
var componentNames = new _weak_map.default;
var nextAnonymousComponent = 0;
var getName = function(componentClass, newName) {
    if ((0, _type.isDefined)(newName)) {
        componentNames.set(componentClass, newName);
        return
    }
    if (!componentNames.has(componentClass)) {
        var generatedName = ANONYMOUS_COMPONENT_DATA_KEY + nextAnonymousComponent++;
        componentNames.set(componentClass, generatedName);
        return generatedName
    }
    return componentNames.get(componentClass)
};
exports.name = getName;

function attachInstanceToElement($element, componentInstance, disposeFn) {
    var data = (0, _element_data.data)($element.get(0));
    var name = getName(componentInstance.constructor);
    data[name] = componentInstance;
    if (disposeFn) {
        _events_engine.default.one($element, _remove_event.default, function() {
            disposeFn.call(componentInstance)
        })
    }
    if (!data[COMPONENT_NAMES_DATA_KEY]) {
        data[COMPONENT_NAMES_DATA_KEY] = []
    }
    data[COMPONENT_NAMES_DATA_KEY].push(name)
}

function getInstanceByElement($element, componentClass) {
    var name = getName(componentClass);
    return (0, _element_data.data)($element.get(0), name)
}


/***/ }),

/***/ "./node_modules/devextreme/core/utils/ready_callbacks.js":
/*!***************************************************************!*\
  !*** ./node_modules/devextreme/core/utils/ready_callbacks.js ***!
  \***************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/**
 * DevExtreme (core/utils/ready_callbacks.js)
 * Version: 20.2.3
 * Build date: Tue Oct 20 2020
 *
 * Copyright (c) 2012 - 2020 Developer Express Inc. ALL RIGHTS RESERVED
 * Read about DevExtreme licensing here: https://js.devexpress.com/Licensing/
 */

exports.default = void 0;
var _dom_adapter = _interopRequireDefault(__webpack_require__(/*! ../dom_adapter */ "./node_modules/devextreme/core/dom_adapter.js"));
var _dependency_injector = _interopRequireDefault(__webpack_require__(/*! ./dependency_injector */ "./node_modules/devextreme/core/utils/dependency_injector.js"));
var _window = __webpack_require__(/*! ./window */ "./node_modules/devextreme/core/utils/window.js");
var _call_once = _interopRequireDefault(__webpack_require__(/*! ./call_once */ "./node_modules/devextreme/core/utils/call_once.js"));

function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
        "default": obj
    }
}
var callbacks = [];
var isReady = function() {
    return "complete" === _dom_adapter.default.getReadyState() || "loading" !== _dom_adapter.default.getReadyState() && !_dom_adapter.default.getDocumentElement().doScroll
};
var subscribeReady = (0, _call_once.default)(function() {
    var removeListener = _dom_adapter.default.listen(_dom_adapter.default.getDocument(), "DOMContentLoaded", function() {
        readyCallbacks.fire();
        removeListener()
    })
});
var readyCallbacks = {
    add: function(callback) {
        var windowExists = (0, _window.hasWindow)();
        if (windowExists && isReady()) {
            callback()
        } else {
            callbacks.push(callback);
            windowExists && subscribeReady()
        }
    },
    fire: function() {
        callbacks.forEach(function(callback) {
            return callback()
        });
        callbacks = []
    }
};
var _default = (0, _dependency_injector.default)(readyCallbacks);
exports.default = _default;
module.exports = exports.default;


/***/ }),

/***/ "./node_modules/devextreme/core/utils/resize_callbacks.js":
/*!****************************************************************!*\
  !*** ./node_modules/devextreme/core/utils/resize_callbacks.js ***!
  \****************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/**
 * DevExtreme (core/utils/resize_callbacks.js)
 * Version: 20.2.3
 * Build date: Tue Oct 20 2020
 *
 * Copyright (c) 2012 - 2020 Developer Express Inc. ALL RIGHTS RESERVED
 * Read about DevExtreme licensing here: https://js.devexpress.com/Licensing/
 */

exports.default = void 0;
var _window = __webpack_require__(/*! ./window */ "./node_modules/devextreme/core/utils/window.js");
var _dom_adapter = _interopRequireDefault(__webpack_require__(/*! ../dom_adapter */ "./node_modules/devextreme/core/dom_adapter.js"));
var _callbacks = _interopRequireDefault(__webpack_require__(/*! ./callbacks */ "./node_modules/devextreme/core/utils/callbacks.js"));
var _ready_callbacks = _interopRequireDefault(__webpack_require__(/*! ./ready_callbacks */ "./node_modules/devextreme/core/utils/ready_callbacks.js"));
var _call_once = _interopRequireDefault(__webpack_require__(/*! ./call_once */ "./node_modules/devextreme/core/utils/call_once.js"));

function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
        "default": obj
    }
}
var resizeCallbacks = function() {
    var prevSize;
    var callbacks = (0, _callbacks.default)();
    var originalCallbacksAdd = callbacks.add;
    var originalCallbacksRemove = callbacks.remove;
    if (!(0, _window.hasWindow)()) {
        return callbacks
    }
    var formatSize = function() {
        var window = (0, _window.getWindow)();
        return {
            width: window.innerWidth,
            height: window.innerHeight
        }
    };
    var handleResize = function() {
        var now = formatSize();
        if (now.width === prevSize.width && now.height === prevSize.height) {
            return
        }
        var changedDimension;
        if (now.width === prevSize.width) {
            changedDimension = "height"
        }
        if (now.height === prevSize.height) {
            changedDimension = "width"
        }
        prevSize = now;
        callbacks.fire(changedDimension)
    };
    var setPrevSize = (0, _call_once.default)(function() {
        prevSize = formatSize()
    });
    var removeListener;
    callbacks.add = function() {
        var result = originalCallbacksAdd.apply(callbacks, arguments);
        setPrevSize();
        _ready_callbacks.default.add(function() {
            if (!removeListener && callbacks.has()) {
                removeListener = _dom_adapter.default.listen((0, _window.getWindow)(), "resize", handleResize)
            }
        });
        return result
    };
    callbacks.remove = function() {
        var result = originalCallbacksRemove.apply(callbacks, arguments);
        if (!callbacks.has() && removeListener) {
            removeListener();
            removeListener = void 0
        }
        return result
    };
    return callbacks
}();
var _default = resizeCallbacks;
exports.default = _default;
module.exports = exports.default;


/***/ }),

/***/ "./node_modules/devextreme/core/utils/size.js":
/*!****************************************************!*\
  !*** ./node_modules/devextreme/core/utils/size.js ***!
  \****************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/**
 * DevExtreme (core/utils/size.js)
 * Version: 20.2.3
 * Build date: Tue Oct 20 2020
 *
 * Copyright (c) 2012 - 2020 Developer Express Inc. ALL RIGHTS RESERVED
 * Read about DevExtreme licensing here: https://js.devexpress.com/Licensing/
 */

exports.parseHeight = exports.getVisibleHeight = exports.getVerticalOffsets = exports.addOffsetToMinHeight = exports.addOffsetToMaxHeight = exports.getElementBoxParams = exports.getSize = void 0;
var _window = __webpack_require__(/*! ../../core/utils/window */ "./node_modules/devextreme/core/utils/window.js");
var _type = __webpack_require__(/*! ../utils/type */ "./node_modules/devextreme/core/utils/type.js");
var window = (0, _window.getWindow)();
var SPECIAL_HEIGHT_VALUES = ["auto", "none", "inherit", "initial"];
var getSizeByStyles = function(elementStyles, styles) {
    var result = 0;
    styles.forEach(function(style) {
        result += parseFloat(elementStyles[style]) || 0
    });
    return result
};
var getElementBoxParams = function(name, elementStyles) {
    var beforeName = "width" === name ? "Left" : "Top";
    var afterName = "width" === name ? "Right" : "Bottom";
    return {
        padding: getSizeByStyles(elementStyles, ["padding" + beforeName, "padding" + afterName]),
        border: getSizeByStyles(elementStyles, ["border" + beforeName + "Width", "border" + afterName + "Width"]),
        margin: getSizeByStyles(elementStyles, ["margin" + beforeName, "margin" + afterName])
    }
};
exports.getElementBoxParams = getElementBoxParams;
var getBoxSizingOffset = function(name, elementStyles, boxParams) {
    var size = elementStyles[name];
    if ("border-box" === elementStyles.boxSizing && size.length && "%" !== size[size.length - 1]) {
        return boxParams.border + boxParams.padding
    }
    return 0
};
var getSize = function(element, name, include) {
    var elementStyles = window.getComputedStyle(element);
    var boxParams = getElementBoxParams(name, elementStyles);
    var clientRect = element.getClientRects().length;
    var boundingClientRect = element.getBoundingClientRect()[name];
    var result = clientRect ? boundingClientRect : 0;
    if (result <= 0) {
        result = parseFloat(elementStyles[name] || element.style[name]) || 0;
        result -= getBoxSizingOffset(name, elementStyles, boxParams)
    } else {
        result -= boxParams.padding + boxParams.border
    }
    if (include.paddings) {
        result += boxParams.padding
    }
    if (include.borders) {
        result += boxParams.border
    }
    if (include.margins) {
        result += boxParams.margin
    }
    return result
};
exports.getSize = getSize;
var getContainerHeight = function(container) {
    return (0, _type.isWindow)(container) ? container.innerHeight : container.offsetHeight
};
var parseHeight = function(value, container) {
    if (value.indexOf("px") > 0) {
        value = parseInt(value.replace("px", ""))
    } else {
        if (value.indexOf("%") > 0) {
            value = parseInt(value.replace("%", "")) * getContainerHeight(container) / 100
        } else {
            if (!isNaN(value)) {
                value = parseInt(value)
            }
        }
    }
    return value
};
exports.parseHeight = parseHeight;
var getHeightWithOffset = function(value, offset, container) {
    if (!value) {
        return null
    }
    if (SPECIAL_HEIGHT_VALUES.indexOf(value) > -1) {
        return offset ? null : value
    }
    if ((0, _type.isString)(value)) {
        value = parseHeight(value, container)
    }
    if ((0, _type.isNumeric)(value)) {
        return Math.max(0, value + offset)
    }
    var operationString = offset < 0 ? " - " : " ";
    return "calc(" + value + operationString + Math.abs(offset) + "px)"
};
var addOffsetToMaxHeight = function(value, offset, container) {
    var maxHeight = getHeightWithOffset(value, offset, container);
    return null !== maxHeight ? maxHeight : "none"
};
exports.addOffsetToMaxHeight = addOffsetToMaxHeight;
var addOffsetToMinHeight = function(value, offset, container) {
    var minHeight = getHeightWithOffset(value, offset, container);
    return null !== minHeight ? minHeight : 0
};
exports.addOffsetToMinHeight = addOffsetToMinHeight;
var getVerticalOffsets = function(element, withMargins) {
    if (!element) {
        return 0
    }
    var boxParams = getElementBoxParams("height", window.getComputedStyle(element));
    return boxParams.padding + boxParams.border + (withMargins ? boxParams.margin : 0)
};
exports.getVerticalOffsets = getVerticalOffsets;
var getVisibleHeight = function(element) {
    if (element) {
        var boundingClientRect = element.getBoundingClientRect();
        if (boundingClientRect.height) {
            return boundingClientRect.height
        }
    }
    return 0
};
exports.getVisibleHeight = getVisibleHeight;


/***/ }),

/***/ "./node_modules/devextreme/core/utils/storage.js":
/*!*******************************************************!*\
  !*** ./node_modules/devextreme/core/utils/storage.js ***!
  \*******************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/**
 * DevExtreme (core/utils/storage.js)
 * Version: 20.2.3
 * Build date: Tue Oct 20 2020
 *
 * Copyright (c) 2012 - 2020 Developer Express Inc. ALL RIGHTS RESERVED
 * Read about DevExtreme licensing here: https://js.devexpress.com/Licensing/
 */

exports.sessionStorage = void 0;
var _window = __webpack_require__(/*! ../../core/utils/window */ "./node_modules/devextreme/core/utils/window.js");
var window = (0, _window.getWindow)();
var getSessionStorage = function() {
    var sessionStorage;
    try {
        sessionStorage = window.sessionStorage
    } catch (e) {}
    return sessionStorage
};
exports.sessionStorage = getSessionStorage;


/***/ }),

/***/ "./node_modules/devextreme/core/utils/string.js":
/*!******************************************************!*\
  !*** ./node_modules/devextreme/core/utils/string.js ***!
  \******************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/**
 * DevExtreme (core/utils/string.js)
 * Version: 20.2.3
 * Build date: Tue Oct 20 2020
 *
 * Copyright (c) 2012 - 2020 Developer Express Inc. ALL RIGHTS RESERVED
 * Read about DevExtreme licensing here: https://js.devexpress.com/Licensing/
 */

exports.isEmpty = exports.replaceAll = exports.format = exports.quadToObject = exports.encodeHtml = void 0;
var _type = __webpack_require__(/*! ./type */ "./node_modules/devextreme/core/utils/type.js");

function _typeof(obj) {
    "@babel/helpers - typeof";
    if ("function" === typeof Symbol && "symbol" === typeof Symbol.iterator) {
        _typeof = function(obj) {
            return typeof obj
        }
    } else {
        _typeof = function(obj) {
            return obj && "function" === typeof Symbol && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj
        }
    }
    return _typeof(obj)
}
var encodeHtml = function() {
    var encodeRegExp = [new RegExp("&", "g"), new RegExp('"', "g"), new RegExp("'", "g"), new RegExp("<", "g"), new RegExp(">", "g")];
    return function(str) {
        return String(str).replace(encodeRegExp[0], "&amp;").replace(encodeRegExp[1], "&quot;").replace(encodeRegExp[2], "&#39;").replace(encodeRegExp[3], "&lt;").replace(encodeRegExp[4], "&gt;")
    }
}();
exports.encodeHtml = encodeHtml;
var splitQuad = function(raw) {
    switch (_typeof(raw)) {
        case "string":
            return raw.split(/\s+/, 4);
        case "object":
            return [raw.x || raw.h || raw.left, raw.y || raw.v || raw.top, raw.x || raw.h || raw.right, raw.y || raw.v || raw.bottom];
        case "number":
            return [raw];
        default:
            return raw
    }
};
var quadToObject = function(raw) {
    var quad = splitQuad(raw);
    var left = parseInt(quad && quad[0], 10);
    var top = parseInt(quad && quad[1], 10);
    var right = parseInt(quad && quad[2], 10);
    var bottom = parseInt(quad && quad[3], 10);
    if (!isFinite(left)) {
        left = 0
    }
    if (!isFinite(top)) {
        top = left
    }
    if (!isFinite(right)) {
        right = left
    }
    if (!isFinite(bottom)) {
        bottom = top
    }
    return {
        top: top,
        right: right,
        bottom: bottom,
        left: left
    }
};
exports.quadToObject = quadToObject;
var format = function() {
    var s = arguments[0];
    var values = [].slice.call(arguments).slice(1);
    var replaceDollarCount;
    var reg;
    var value;
    if ((0, _type.isFunction)(s)) {
        return s.apply(this, values)
    }
    for (var i = 0; i < values.length; i++) {
        reg = new RegExp("\\{" + i + "\\}", "gm");
        value = values[i];
        if ("string" === (0, _type.type)(value) && value.indexOf("$") >= 0) {
            replaceDollarCount = "$".replace("$", "$$").length;
            value = value.replace("$", 1 === replaceDollarCount ? "$$$$" : "$$")
        }
        s = s.replace(reg, value)
    }
    return s
};
exports.format = format;
var replaceAll = function() {
    var quote = function(str) {
        return (str + "").replace(/([+*?.[^\]$(){}><|=!:])/g, "\\$1")
    };
    return function(text, searchToken, replacementToken) {
        return text.replace(new RegExp("(" + quote(searchToken) + ")", "gi"), replacementToken)
    }
}();
exports.replaceAll = replaceAll;
var isEmpty = function() {
    var SPACE_REGEXP = /\s/g;
    return function(text) {
        return !text || !text.replace(SPACE_REGEXP, "")
    }
}();
exports.isEmpty = isEmpty;


/***/ }),

/***/ "./node_modules/devextreme/core/utils/style.js":
/*!*****************************************************!*\
  !*** ./node_modules/devextreme/core/utils/style.js ***!
  \*****************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/**
 * DevExtreme (core/utils/style.js)
 * Version: 20.2.3
 * Build date: Tue Oct 20 2020
 *
 * Copyright (c) 2012 - 2020 Developer Express Inc. ALL RIGHTS RESERVED
 * Read about DevExtreme licensing here: https://js.devexpress.com/Licensing/
 */

exports.setHeight = exports.setWidth = exports.normalizeStyleProp = exports.stylePropPrefix = exports.styleProp = void 0;
var _inflector = __webpack_require__(/*! ./inflector */ "./node_modules/devextreme/core/utils/inflector.js");
var _call_once = _interopRequireDefault(__webpack_require__(/*! ./call_once */ "./node_modules/devextreme/core/utils/call_once.js"));
var _type = __webpack_require__(/*! ./type */ "./node_modules/devextreme/core/utils/type.js");
var _dom_adapter = _interopRequireDefault(__webpack_require__(/*! ../dom_adapter */ "./node_modules/devextreme/core/dom_adapter.js"));

function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
        "default": obj
    }
}
var jsPrefixes = ["", "Webkit", "Moz", "O", "Ms"];
var cssPrefixes = {
    "": "",
    Webkit: "-webkit-",
    Moz: "-moz-",
    O: "-o-",
    ms: "-ms-"
};
var getStyles = (0, _call_once.default)(function() {
    return _dom_adapter.default.createElement("dx").style
});
var forEachPrefixes = function(prop, callBack) {
    prop = (0, _inflector.camelize)(prop, true);
    var result;
    for (var i = 0, cssPrefixesCount = jsPrefixes.length; i < cssPrefixesCount; i++) {
        var jsPrefix = jsPrefixes[i];
        var prefixedProp = jsPrefix + prop;
        var lowerPrefixedProp = (0, _inflector.camelize)(prefixedProp);
        result = callBack(lowerPrefixedProp, jsPrefix);
        if (void 0 === result) {
            result = callBack(prefixedProp, jsPrefix)
        }
        if (void 0 !== result) {
            break
        }
    }
    return result || ""
};
var styleProp = function(name) {
    if (name in getStyles()) {
        return name
    }
    var originalName = name;
    name = name.charAt(0).toUpperCase() + name.substr(1);
    for (var i = 1; i < jsPrefixes.length; i++) {
        var prefixedProp = jsPrefixes[i].toLowerCase() + name;
        if (prefixedProp in getStyles()) {
            return prefixedProp
        }
    }
    return originalName
};
exports.styleProp = styleProp;
var stylePropPrefix = function(prop) {
    return forEachPrefixes(prop, function(specific, jsPrefix) {
        if (specific in getStyles()) {
            return cssPrefixes[jsPrefix]
        }
    })
};
exports.stylePropPrefix = stylePropPrefix;
var pxExceptions = ["fillOpacity", "columnCount", "flexGrow", "flexShrink", "fontWeight", "lineHeight", "opacity", "zIndex", "zoom"];
var normalizeStyleProp = function(prop, value) {
    if ((0, _type.isNumeric)(value) && pxExceptions.indexOf(prop) === -1) {
        value += "px"
    }
    return value
};
exports.normalizeStyleProp = normalizeStyleProp;
var setDimensionProperty = function(elements, propertyName, value) {
    if (elements) {
        value = (0, _type.isNumeric)(value) ? value += "px" : value;
        for (var i = 0; i < elements.length; ++i) {
            elements[i].style[propertyName] = value
        }
    }
};
var setWidth = function(elements, value) {
    setDimensionProperty(elements, "width", value)
};
exports.setWidth = setWidth;
var setHeight = function(elements, value) {
    setDimensionProperty(elements, "height", value)
};
exports.setHeight = setHeight;


/***/ }),

/***/ "./node_modules/devextreme/core/utils/support.js":
/*!*******************************************************!*\
  !*** ./node_modules/devextreme/core/utils/support.js ***!
  \*******************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/**
 * DevExtreme (core/utils/support.js)
 * Version: 20.2.3
 * Build date: Tue Oct 20 2020
 *
 * Copyright (c) 2012 - 2020 Developer Express Inc. ALL RIGHTS RESERVED
 * Read about DevExtreme licensing here: https://js.devexpress.com/Licensing/
 */

Object.defineProperty(exports, "stylePropPrefix", {
    enumerable: true,
    get: function() {
        return _style.stylePropPrefix
    }
});
Object.defineProperty(exports, "styleProp", {
    enumerable: true,
    get: function() {
        return _style.styleProp
    }
});
exports.nativeScrolling = exports.animation = exports.transitionEndEventName = exports.transition = exports.touch = exports.inputType = exports.supportProp = exports.pointerEvents = exports.touchEvents = void 0;
var _array = __webpack_require__(/*! ./array */ "./node_modules/devextreme/core/utils/array.js");
var _dom_adapter = _interopRequireDefault(__webpack_require__(/*! ../dom_adapter */ "./node_modules/devextreme/core/dom_adapter.js"));
var _common = __webpack_require__(/*! ./common */ "./node_modules/devextreme/core/utils/common.js");
var _call_once = _interopRequireDefault(__webpack_require__(/*! ./call_once */ "./node_modules/devextreme/core/utils/call_once.js"));
var _window = __webpack_require__(/*! ./window */ "./node_modules/devextreme/core/utils/window.js");
var _devices = _interopRequireDefault(__webpack_require__(/*! ../devices */ "./node_modules/devextreme/core/devices.js"));
var _style = __webpack_require__(/*! ./style */ "./node_modules/devextreme/core/utils/style.js");

function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
        "default": obj
    }
}
var _getNavigator = (0, _window.getNavigator)(),
    maxTouchPoints = _getNavigator.maxTouchPoints,
    msMaxTouchPoints = _getNavigator.msMaxTouchPoints,
    pointerEnabled = _getNavigator.pointerEnabled;
var transitionEndEventNames = {
    webkitTransition: "webkitTransitionEnd",
    MozTransition: "transitionend",
    OTransition: "oTransitionEnd",
    msTransition: "MsTransitionEnd",
    transition: "transitionend"
};
var supportProp = function(prop) {
    return !!(0, _style.styleProp)(prop)
};
exports.supportProp = supportProp;
var isNativeScrollingSupported = function() {
    var _devices$real = _devices.default.real(),
        platform = _devices$real.platform,
        version = _devices$real.version,
        isMac = _devices$real.mac;
    var isObsoleteAndroid = version && version[0] < 4 && "android" === platform;
    var isNativeScrollDevice = !isObsoleteAndroid && (0, _array.inArray)(platform, ["ios", "android"]) > -1 || isMac;
    return isNativeScrollDevice
};
var inputType = function(type) {
    if ("text" === type) {
        return true
    }
    var input = _dom_adapter.default.createElement("input");
    try {
        input.setAttribute("type", type);
        input.value = "wrongValue";
        return !input.value
    } catch (e) {
        return false
    }
};
exports.inputType = inputType;
var detectTouchEvents = function(hasWindowProperty, maxTouchPoints) {
    return (hasWindowProperty("ontouchstart") || !!maxTouchPoints) && !hasWindowProperty("callPhantom")
};
var detectPointerEvent = function(hasWindowProperty, pointerEnabled) {
    var isPointerEnabled = (0, _common.ensureDefined)(pointerEnabled, true);
    var canUsePointerEvent = (0, _common.ensureDefined)(pointerEnabled, false);
    return hasWindowProperty("PointerEvent") && isPointerEnabled || canUsePointerEvent
};
var touchEvents = detectTouchEvents(_window.hasProperty, maxTouchPoints);
exports.touchEvents = touchEvents;
var pointerEvents = detectPointerEvent(_window.hasProperty, pointerEnabled);
exports.pointerEvents = pointerEvents;
var touchPointersPresent = !!maxTouchPoints || !!msMaxTouchPoints;
var touch = touchEvents || pointerEvents && touchPointersPresent;
exports.touch = touch;
var transition = (0, _call_once.default)(function() {
    return supportProp("transition")
});
exports.transition = transition;
var transitionEndEventName = (0, _call_once.default)(function() {
    return transitionEndEventNames[(0, _style.styleProp)("transition")]
});
exports.transitionEndEventName = transitionEndEventName;
var animation = (0, _call_once.default)(function() {
    return supportProp("animation")
});
exports.animation = animation;
var nativeScrolling = isNativeScrollingSupported();
exports.nativeScrolling = nativeScrolling;


/***/ }),

/***/ "./node_modules/devextreme/core/utils/template_manager.js":
/*!****************************************************************!*\
  !*** ./node_modules/devextreme/core/utils/template_manager.js ***!
  \****************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/**
 * DevExtreme (core/utils/template_manager.js)
 * Version: 20.2.3
 * Build date: Tue Oct 20 2020
 *
 * Copyright (c) 2012 - 2020 Developer Express Inc. ALL RIGHTS RESERVED
 * Read about DevExtreme licensing here: https://js.devexpress.com/Licensing/
 */

exports.acquireTemplate = exports.acquireIntegrationTemplate = exports.defaultCreateElement = exports.templateKey = exports.validateTemplateSource = exports.getNormalizedTemplateArgs = exports.addOneRenderedCall = exports.suitableTemplatesByName = exports.findTemplates = void 0;
var _config = _interopRequireDefault(__webpack_require__(/*! ../config */ "./node_modules/devextreme/core/config.js"));
var _devices = _interopRequireDefault(__webpack_require__(/*! ../devices */ "./node_modules/devextreme/core/devices.js"));
var _errors = _interopRequireDefault(__webpack_require__(/*! ../errors */ "./node_modules/devextreme/core/errors.js"));
var _renderer = _interopRequireDefault(__webpack_require__(/*! ../renderer */ "./node_modules/devextreme/core/renderer.js"));
var _child_default_template = __webpack_require__(/*! ../templates/child_default_template */ "./node_modules/devextreme/core/templates/child_default_template.js");
var _empty_template = __webpack_require__(/*! ../templates/empty_template */ "./node_modules/devextreme/core/templates/empty_template.js");
var _template = __webpack_require__(/*! ../templates/template */ "./node_modules/devextreme/core/templates/template.js");
var _template_base = __webpack_require__(/*! ../templates/template_base */ "./node_modules/devextreme/core/templates/template_base.js");
var _array = __webpack_require__(/*! ./array */ "./node_modules/devextreme/core/utils/array.js");
var _common = __webpack_require__(/*! ./common */ "./node_modules/devextreme/core/utils/common.js");
var _dom = __webpack_require__(/*! ./dom */ "./node_modules/devextreme/core/utils/dom.js");
var _extend = __webpack_require__(/*! ./extend */ "./node_modules/devextreme/core/utils/extend.js");
var _type = __webpack_require__(/*! ./type */ "./node_modules/devextreme/core/utils/type.js");

function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
        "default": obj
    }
}
var findTemplates = function(element, name) {
    var optionsAttributeName = "data-options";
    var templates = (0, _renderer.default)(element).contents().filter("[".concat(optionsAttributeName, '*="').concat(name, '"]'));
    return [].slice.call(templates).map(function(element) {
        var optionsString = (0, _renderer.default)(element).attr(optionsAttributeName) || "";
        return {
            element: element,
            options: (0, _config.default)().optionsParser(optionsString)[name]
        }
    }).filter(function(template) {
        return !!template.options
    })
};
exports.findTemplates = findTemplates;
var suitableTemplatesByName = function(rawTemplates) {
    var templatesMap = (0, _array.groupBy)(rawTemplates, function(template) {
        return template.options.name
    });
    if (templatesMap[void 0]) {
        throw _errors.default.Error("E0023")
    }
    var result = {};
    Object.keys(templatesMap).forEach(function(name) {
        var _findBestMatches$;
        var suitableTemplate = null === (_findBestMatches$ = (0, _common.findBestMatches)(_devices.default.current(), templatesMap[name], function(template) {
            return template.options
        })[0]) || void 0 === _findBestMatches$ ? void 0 : _findBestMatches$.element;
        if (suitableTemplate) {
            result[name] = suitableTemplate
        }
    });
    return result
};
exports.suitableTemplatesByName = suitableTemplatesByName;
var addOneRenderedCall = function(template) {
    var _render = template.render.bind(template);
    return (0, _extend.extend)({}, template, {
        render: function(options) {
            var templateResult = _render(options);
            options && options.onRendered && options.onRendered();
            return templateResult
        }
    })
};
exports.addOneRenderedCall = addOneRenderedCall;
var getNormalizedTemplateArgs = function(options) {
    var args = [];
    if ("model" in options) {
        args.push(options.model)
    }
    if ("index" in options) {
        args.push(options.index)
    }
    args.push(options.container);
    return args
};
exports.getNormalizedTemplateArgs = getNormalizedTemplateArgs;
var validateTemplateSource = function(templateSource) {
    return "string" === typeof templateSource ? (0, _dom.normalizeTemplateElement)(templateSource) : templateSource
};
exports.validateTemplateSource = validateTemplateSource;
var templateKey = function(templateSource) {
    return (0, _type.isRenderer)(templateSource) && templateSource[0] || templateSource
};
exports.templateKey = templateKey;
var defaultCreateElement = function(element) {
    return new _template.Template(element)
};
exports.defaultCreateElement = defaultCreateElement;
var acquireIntegrationTemplate = function(templateSource, templates, isAsyncTemplate, skipTemplates) {
    var integrationTemplate = null;
    if (!skipTemplates || skipTemplates.indexOf(templateSource) === -1) {
        integrationTemplate = templates[templateSource];
        if (integrationTemplate && !(integrationTemplate instanceof _template_base.TemplateBase) && !isAsyncTemplate) {
            integrationTemplate = addOneRenderedCall(integrationTemplate)
        }
    }
    return integrationTemplate
};
exports.acquireIntegrationTemplate = acquireIntegrationTemplate;
var acquireTemplate = function(templateSource, createTemplate, templates, isAsyncTemplate, skipTemplates, defaultTemplates) {
    if (null == templateSource) {
        return new _empty_template.EmptyTemplate
    }
    if (templateSource instanceof _child_default_template.ChildDefaultTemplate) {
        return defaultTemplates[templateSource.name]
    }
    if (templateSource instanceof _template_base.TemplateBase) {
        return templateSource
    }
    if ((0, _type.isFunction)(templateSource.render) && !(0, _type.isRenderer)(templateSource)) {
        return isAsyncTemplate ? templateSource : addOneRenderedCall(templateSource)
    }
    if (templateSource.nodeType || (0, _type.isRenderer)(templateSource)) {
        return createTemplate((0, _renderer.default)(templateSource))
    }
    return acquireIntegrationTemplate(templateSource, templates, isAsyncTemplate, skipTemplates) || defaultTemplates[templateSource] || createTemplate(templateSource)
};
exports.acquireTemplate = acquireTemplate;


/***/ }),

/***/ "./node_modules/devextreme/core/utils/type.js":
/*!****************************************************!*\
  !*** ./node_modules/devextreme/core/utils/type.js ***!
  \****************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/**
 * DevExtreme (core/utils/type.js)
 * Version: 20.2.3
 * Build date: Tue Oct 20 2020
 *
 * Copyright (c) 2012 - 2020 Developer Express Inc. ALL RIGHTS RESERVED
 * Read about DevExtreme licensing here: https://js.devexpress.com/Licensing/
 */

exports.type = exports.isDeferred = exports.isPromise = exports.isRenderer = exports.isWindow = exports.isPrimitive = exports.isPlainObject = exports.isEmptyObject = exports.isObject = exports.isNumeric = exports.isString = exports.isFunction = exports.isDefined = exports.isDate = exports.isExponential = exports.isBoolean = void 0;

function _typeof(obj) {
    "@babel/helpers - typeof";
    if ("function" === typeof Symbol && "symbol" === typeof Symbol.iterator) {
        _typeof = function(obj) {
            return typeof obj
        }
    } else {
        _typeof = function(obj) {
            return obj && "function" === typeof Symbol && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj
        }
    }
    return _typeof(obj)
}
var types = {
    "[object Array]": "array",
    "[object Date]": "date",
    "[object Object]": "object",
    "[object String]": "string",
    "[object Null]": "null"
};
var type = function(object) {
    var typeOfObject = Object.prototype.toString.call(object);
    return "object" === _typeof(object) ? types[typeOfObject] || "object" : _typeof(object)
};
exports.type = type;
var isBoolean = function(object) {
    return "boolean" === typeof object
};
exports.isBoolean = isBoolean;
var isExponential = function(value) {
    return isNumeric(value) && value.toString().indexOf("e") !== -1
};
exports.isExponential = isExponential;
var isDate = function(object) {
    return "date" === type(object)
};
exports.isDate = isDate;
var isDefined = function(object) {
    return null !== object && void 0 !== object
};
exports.isDefined = isDefined;
var isFunction = function(object) {
    return "function" === typeof object
};
exports.isFunction = isFunction;
var isString = function(object) {
    return "string" === typeof object
};
exports.isString = isString;
var isNumeric = function(object) {
    return "number" === typeof object && isFinite(object) || !isNaN(object - parseFloat(object))
};
exports.isNumeric = isNumeric;
var isObject = function(object) {
    return "object" === type(object)
};
exports.isObject = isObject;
var isEmptyObject = function(object) {
    var property;
    for (property in object) {
        return false
    }
    return true
};
exports.isEmptyObject = isEmptyObject;
var isPlainObject = function(object) {
    if (!object || "[object Object]" !== Object.prototype.toString.call(object)) {
        return false
    }
    var proto = Object.getPrototypeOf(object);
    var ctor = Object.hasOwnProperty.call(proto, "constructor") && proto.constructor;
    return "function" === typeof ctor && Object.toString.call(ctor) === Object.toString.call(Object)
};
exports.isPlainObject = isPlainObject;
var isPrimitive = function(value) {
    return ["object", "array", "function"].indexOf(type(value)) === -1
};
exports.isPrimitive = isPrimitive;
var isWindow = function(object) {
    return null != object && object === object.window
};
exports.isWindow = isWindow;
var isRenderer = function(object) {
    return !!(object.jquery || object.dxRenderer)
};
exports.isRenderer = isRenderer;
var isPromise = function(object) {
    return object && isFunction(object.then)
};
exports.isPromise = isPromise;
var isDeferred = function(object) {
    return object && isFunction(object.done) && isFunction(object.fail)
};
exports.isDeferred = isDeferred;


/***/ }),

/***/ "./node_modules/devextreme/core/utils/variable_wrapper.js":
/*!****************************************************************!*\
  !*** ./node_modules/devextreme/core/utils/variable_wrapper.js ***!
  \****************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/**
 * DevExtreme (core/utils/variable_wrapper.js)
 * Version: 20.2.3
 * Build date: Tue Oct 20 2020
 *
 * Copyright (c) 2012 - 2020 Developer Express Inc. ALL RIGHTS RESERVED
 * Read about DevExtreme licensing here: https://js.devexpress.com/Licensing/
 */

exports.default = void 0;
var _console = __webpack_require__(/*! ./console */ "./node_modules/devextreme/core/utils/console.js");
var _dependency_injector = _interopRequireDefault(__webpack_require__(/*! ./dependency_injector */ "./node_modules/devextreme/core/utils/dependency_injector.js"));

function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
        "default": obj
    }
}
var _default = (0, _dependency_injector.default)({
    isWrapped: function() {
        return false
    },
    isWritableWrapped: function() {
        return false
    },
    wrap: function(value) {
        return value
    },
    unwrap: function(value) {
        return value
    },
    assign: function() {
        _console.logger.error("Method 'assign' should not be used for not wrapped variables. Use 'isWrapped' method for ensuring.")
    }
});
exports.default = _default;
module.exports = exports.default;


/***/ }),

/***/ "./node_modules/devextreme/core/utils/version.js":
/*!*******************************************************!*\
  !*** ./node_modules/devextreme/core/utils/version.js ***!
  \*******************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/**
 * DevExtreme (core/utils/version.js)
 * Version: 20.2.3
 * Build date: Tue Oct 20 2020
 *
 * Copyright (c) 2012 - 2020 Developer Express Inc. ALL RIGHTS RESERVED
 * Read about DevExtreme licensing here: https://js.devexpress.com/Licensing/
 */

exports.compare = compare;

function compare(x, y, maxLevel) {
    function normalizeArg(value) {
        if ("string" === typeof value) {
            return value.split(".")
        }
        if ("number" === typeof value) {
            return [value]
        }
        return value
    }
    x = normalizeArg(x);
    y = normalizeArg(y);
    var length = Math.max(x.length, y.length);
    if (isFinite(maxLevel)) {
        length = Math.min(length, maxLevel)
    }
    for (var i = 0; i < length; i++) {
        var xItem = parseInt(x[i] || 0, 10);
        var yItem = parseInt(y[i] || 0, 10);
        if (xItem < yItem) {
            return -1
        }
        if (xItem > yItem) {
            return 1
        }
    }
    return 0
}


/***/ }),

/***/ "./node_modules/devextreme/core/utils/view_port.js":
/*!*********************************************************!*\
  !*** ./node_modules/devextreme/core/utils/view_port.js ***!
  \*********************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/**
 * DevExtreme (core/utils/view_port.js)
 * Version: 20.2.3
 * Build date: Tue Oct 20 2020
 *
 * Copyright (c) 2012 - 2020 Developer Express Inc. ALL RIGHTS RESERVED
 * Read about DevExtreme licensing here: https://js.devexpress.com/Licensing/
 */

exports.originalViewPort = originalViewPort;
exports.changeCallback = exports.value = void 0;
var _renderer = _interopRequireDefault(__webpack_require__(/*! ../renderer */ "./node_modules/devextreme/core/renderer.js"));
var _ready_callbacks = _interopRequireDefault(__webpack_require__(/*! ./ready_callbacks */ "./node_modules/devextreme/core/utils/ready_callbacks.js"));
var _callbacks = _interopRequireDefault(__webpack_require__(/*! ./callbacks */ "./node_modules/devextreme/core/utils/callbacks.js"));

function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
        "default": obj
    }
}
var ready = _ready_callbacks.default.add;
var changeCallback = (0, _callbacks.default)();
exports.changeCallback = changeCallback;
var $originalViewPort = (0, _renderer.default)();
var value = function() {
    var $current;
    return function(element) {
        if (!arguments.length) {
            return $current
        }
        var $element = (0, _renderer.default)(element);
        $originalViewPort = $element;
        var isNewViewportFound = !!$element.length;
        var prevViewPort = value();
        $current = isNewViewportFound ? $element : (0, _renderer.default)("body");
        changeCallback.fire(isNewViewportFound ? value() : (0, _renderer.default)(), prevViewPort)
    }
}();
exports.value = value;
ready(function() {
    value(".dx-viewport")
});

function originalViewPort() {
    return $originalViewPort
}


/***/ }),

/***/ "./node_modules/devextreme/core/utils/window.js":
/*!******************************************************!*\
  !*** ./node_modules/devextreme/core/utils/window.js ***!
  \******************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/**
 * DevExtreme (core/utils/window.js)
 * Version: 20.2.3
 * Build date: Tue Oct 20 2020
 *
 * Copyright (c) 2012 - 2020 Developer Express Inc. ALL RIGHTS RESERVED
 * Read about DevExtreme licensing here: https://js.devexpress.com/Licensing/
 */

exports.getNavigator = exports.getCurrentScreenFactor = exports.defaultScreenFactorFunc = exports.hasProperty = exports.getWindow = exports.hasWindow = void 0;
var _dom_adapter = _interopRequireDefault(__webpack_require__(/*! ../dom_adapter */ "./node_modules/devextreme/core/dom_adapter.js"));

function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
        "default": obj
    }
}
var hasWindow = function() {
    return "undefined" !== typeof window
};
exports.hasWindow = hasWindow;
var windowObject = hasWindow() && window;
if (!windowObject) {
    windowObject = {};
    windowObject.window = windowObject
}
var getWindow = function() {
    return windowObject
};
exports.getWindow = getWindow;
var hasProperty = function(prop) {
    return hasWindow() && prop in windowObject
};
exports.hasProperty = hasProperty;
var defaultScreenFactorFunc = function(width) {
    if (width < 768) {
        return "xs"
    } else {
        if (width < 992) {
            return "sm"
        } else {
            if (width < 1200) {
                return "md"
            } else {
                return "lg"
            }
        }
    }
};
exports.defaultScreenFactorFunc = defaultScreenFactorFunc;
var getCurrentScreenFactor = function(screenFactorCallback) {
    var screenFactorFunc = screenFactorCallback || defaultScreenFactorFunc;
    var windowWidth = _dom_adapter.default.getDocumentElement().clientWidth;
    return screenFactorFunc(windowWidth)
};
exports.getCurrentScreenFactor = getCurrentScreenFactor;
var getNavigator = function() {
    return hasWindow() ? windowObject.navigator : {
        userAgent: ""
    }
};
exports.getNavigator = getNavigator;


/***/ }),

/***/ "./node_modules/devextreme/core/version.js":
/*!*************************************************!*\
  !*** ./node_modules/devextreme/core/version.js ***!
  \*************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/**
 * DevExtreme (core/version.js)
 * Version: 20.2.3
 * Build date: Tue Oct 20 2020
 *
 * Copyright (c) 2012 - 2020 Developer Express Inc. ALL RIGHTS RESERVED
 * Read about DevExtreme licensing here: https://js.devexpress.com/Licensing/
 */

exports.default = void 0;
var _default = "20.2.3";
exports.default = _default;
module.exports = exports.default;


/***/ }),

/***/ "./node_modules/devextreme/events/click.js":
/*!*************************************************!*\
  !*** ./node_modules/devextreme/events/click.js ***!
  \*************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/**
 * DevExtreme (events/click.js)
 * Version: 20.2.3
 * Build date: Tue Oct 20 2020
 *
 * Copyright (c) 2012 - 2020 Developer Express Inc. ALL RIGHTS RESERVED
 * Read about DevExtreme licensing here: https://js.devexpress.com/Licensing/
 */

exports.name = void 0;
var _renderer = _interopRequireDefault(__webpack_require__(/*! ../core/renderer */ "./node_modules/devextreme/core/renderer.js"));
var _events_engine = _interopRequireDefault(__webpack_require__(/*! ../events/core/events_engine */ "./node_modules/devextreme/events/core/events_engine.js"));
var _devices = _interopRequireDefault(__webpack_require__(/*! ../core/devices */ "./node_modules/devextreme/core/devices.js"));
var _dom_adapter = _interopRequireDefault(__webpack_require__(/*! ../core/dom_adapter */ "./node_modules/devextreme/core/dom_adapter.js"));
var _dom = __webpack_require__(/*! ../core/utils/dom */ "./node_modules/devextreme/core/utils/dom.js");
var _frame = __webpack_require__(/*! ../animation/frame */ "./node_modules/devextreme/animation/frame.js");
var _index = __webpack_require__(/*! ./utils/index */ "./node_modules/devextreme/events/utils/index.js");
var _pointer = _interopRequireDefault(__webpack_require__(/*! ./pointer */ "./node_modules/devextreme/events/pointer.js"));
var _emitter = _interopRequireDefault(__webpack_require__(/*! ./core/emitter */ "./node_modules/devextreme/events/core/emitter.js"));
var _emitter_registrator = _interopRequireDefault(__webpack_require__(/*! ./core/emitter_registrator */ "./node_modules/devextreme/events/core/emitter_registrator.js"));
var _version = __webpack_require__(/*! ../core/utils/version */ "./node_modules/devextreme/core/utils/version.js");

function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
        "default": obj
    }
}
var CLICK_EVENT_NAME = "dxclick";
exports.name = CLICK_EVENT_NAME;
var TOUCH_BOUNDARY = 10;
var abs = Math.abs;
var isInput = function(element) {
    return (0, _renderer.default)(element).is("input, textarea, select, button ,:focus, :focus *")
};
var misc = {
    requestAnimationFrame: _frame.requestAnimationFrame,
    cancelAnimationFrame: _frame.cancelAnimationFrame
};
var ClickEmitter = _emitter.default.inherit({
    ctor: function(element) {
        this.callBase(element);
        this._makeElementClickable((0, _renderer.default)(element))
    },
    _makeElementClickable: function($element) {
        if (!$element.attr("onclick")) {
            $element.attr("onclick", "void(0)")
        }
    },
    start: function(e) {
        this._blurPrevented = e.isDefaultPrevented();
        this._startTarget = e.target;
        this._startEventData = (0, _index.eventData)(e)
    },
    end: function(e) {
        if (this._eventOutOfElement(e, this.getElement().get(0)) || e.type === _pointer.default.cancel) {
            this._cancel(e);
            return
        }
        if (!isInput(e.target) && !this._blurPrevented) {
            (0, _dom.resetActiveElement)()
        }
        this._accept(e);
        this._clickAnimationFrame = misc.requestAnimationFrame(function() {
            this._fireClickEvent(e)
        }.bind(this))
    },
    _eventOutOfElement: function(e, element) {
        var target = e.target;
        var targetChanged = !(0, _dom.contains)(element, target) && element !== target;
        var gestureDelta = (0, _index.eventDelta)((0, _index.eventData)(e), this._startEventData);
        var boundsExceeded = abs(gestureDelta.x) > TOUCH_BOUNDARY || abs(gestureDelta.y) > TOUCH_BOUNDARY;
        return targetChanged || boundsExceeded
    },
    _fireClickEvent: function(e) {
        this._fireEvent(CLICK_EVENT_NAME, e, {
            target: (0, _dom.closestCommonParent)(this._startTarget, e.target)
        })
    },
    dispose: function() {
        misc.cancelAnimationFrame(this._clickAnimationFrame)
    }
});
var realDevice = _devices.default.real();
var useNativeClick = realDevice.generic || realDevice.ios && (0, _version.compare)(realDevice.version, [9, 3]) >= 0 || realDevice.android && (0, _version.compare)(realDevice.version, [5]) >= 0;
! function() {
    var NATIVE_CLICK_CLASS = "dx-native-click";
    var isNativeClickEvent = function(target) {
        return useNativeClick || (0, _renderer.default)(target).closest("." + NATIVE_CLICK_CLASS).length
    };
    var prevented = null;
    var lastFiredEvent = null;
    var clickHandler = function(e) {
        var originalEvent = e.originalEvent;
        var eventAlreadyFired = lastFiredEvent === originalEvent || originalEvent && originalEvent.DXCLICK_FIRED;
        var leftButton = !e.which || 1 === e.which;
        if (leftButton && !prevented && isNativeClickEvent(e.target) && !eventAlreadyFired) {
            if (originalEvent) {
                originalEvent.DXCLICK_FIRED = true
            }
            lastFiredEvent = originalEvent;
            (0, _index.fireEvent)({
                type: CLICK_EVENT_NAME,
                originalEvent: e
            })
        }
    };
    ClickEmitter = ClickEmitter.inherit({
        _makeElementClickable: function($element) {
            if (!isNativeClickEvent($element)) {
                this.callBase($element)
            }
            _events_engine.default.on($element, "click", clickHandler)
        },
        configure: function(data) {
            this.callBase(data);
            if (data.useNative) {
                this.getElement().addClass(NATIVE_CLICK_CLASS)
            }
        },
        start: function(e) {
            prevented = null;
            if (!isNativeClickEvent(e.target)) {
                this.callBase(e)
            }
        },
        end: function(e) {
            if (!isNativeClickEvent(e.target)) {
                this.callBase(e)
            }
        },
        cancel: function() {
            prevented = true
        },
        dispose: function() {
            this.callBase();
            _events_engine.default.off(this.getElement(), "click", clickHandler)
        }
    })
}();
! function() {
    var desktopDevice = _devices.default.real().generic;
    if (!desktopDevice) {
        var startTarget = null;
        var blurPrevented = false;
        var pointerDownHandler = function(e) {
            startTarget = e.target;
            blurPrevented = e.isDefaultPrevented()
        };
        var clickHandler = function(e) {
            var $target = (0, _renderer.default)(e.target);
            if (!blurPrevented && startTarget && !$target.is(startTarget) && !(0, _renderer.default)(startTarget).is("label") && isInput($target)) {
                (0, _dom.resetActiveElement)()
            }
            startTarget = null;
            blurPrevented = false
        };
        var NATIVE_CLICK_FIXER_NAMESPACE = "NATIVE_CLICK_FIXER";
        var document = _dom_adapter.default.getDocument();
        _events_engine.default.subscribeGlobal(document, (0, _index.addNamespace)(_pointer.default.down, NATIVE_CLICK_FIXER_NAMESPACE), pointerDownHandler);
        _events_engine.default.subscribeGlobal(document, (0, _index.addNamespace)("click", NATIVE_CLICK_FIXER_NAMESPACE), clickHandler)
    }
}();
(0, _emitter_registrator.default)({
    emitter: ClickEmitter,
    bubble: true,
    events: [CLICK_EVENT_NAME]
});


/***/ }),

/***/ "./node_modules/devextreme/events/core/emitter.feedback.js":
/*!*****************************************************************!*\
  !*** ./node_modules/devextreme/events/core/emitter.feedback.js ***!
  \*****************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/**
 * DevExtreme (events/core/emitter.feedback.js)
 * Version: 20.2.3
 * Build date: Tue Oct 20 2020
 *
 * Copyright (c) 2012 - 2020 Developer Express Inc. ALL RIGHTS RESERVED
 * Read about DevExtreme licensing here: https://js.devexpress.com/Licensing/
 */

exports.inactive = exports.active = exports.lock = void 0;
var _class = _interopRequireDefault(__webpack_require__(/*! ../../core/class */ "./node_modules/devextreme/core/class.js"));
var _common = __webpack_require__(/*! ../../core/utils/common */ "./node_modules/devextreme/core/utils/common.js");
var _dom = __webpack_require__(/*! ../../core/utils/dom */ "./node_modules/devextreme/core/utils/dom.js");
var _devices = _interopRequireDefault(__webpack_require__(/*! ../../core/devices */ "./node_modules/devextreme/core/devices.js"));
var _index = __webpack_require__(/*! ../utils/index */ "./node_modules/devextreme/events/utils/index.js");
var _pointer = _interopRequireDefault(__webpack_require__(/*! ../pointer */ "./node_modules/devextreme/events/pointer.js"));
var _emitter = _interopRequireDefault(__webpack_require__(/*! ./emitter */ "./node_modules/devextreme/events/core/emitter.js"));
var _emitter_registrator = _interopRequireDefault(__webpack_require__(/*! ./emitter_registrator */ "./node_modules/devextreme/events/core/emitter_registrator.js"));

function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
        "default": obj
    }
}
var ACTIVE_EVENT_NAME = "dxactive";
exports.active = ACTIVE_EVENT_NAME;
var INACTIVE_EVENT_NAME = "dxinactive";
exports.inactive = INACTIVE_EVENT_NAME;
var ACTIVE_TIMEOUT = 30;
var INACTIVE_TIMEOUT = 400;
var FeedbackEvent = _class.default.inherit({
    ctor: function(timeout, fire) {
        this._timeout = timeout;
        this._fire = fire
    },
    start: function() {
        var that = this;
        this._schedule(function() {
            that.force()
        })
    },
    _schedule: function(fn) {
        this.stop();
        this._timer = setTimeout(fn, this._timeout)
    },
    stop: function() {
        clearTimeout(this._timer)
    },
    force: function() {
        if (this._fired) {
            return
        }
        this.stop();
        this._fire();
        this._fired = true
    },
    fired: function() {
        return this._fired
    }
});
var activeFeedback;
var FeedbackEmitter = _emitter.default.inherit({
    ctor: function() {
        this.callBase.apply(this, arguments);
        this._active = new FeedbackEvent(0, _common.noop);
        this._inactive = new FeedbackEvent(0, _common.noop)
    },
    configure: function(data, eventName) {
        switch (eventName) {
            case ACTIVE_EVENT_NAME:
                data.activeTimeout = data.timeout;
                break;
            case INACTIVE_EVENT_NAME:
                data.inactiveTimeout = data.timeout
        }
        this.callBase(data)
    },
    start: function(e) {
        if (activeFeedback) {
            var activeChildExists = (0, _dom.contains)(this.getElement().get(0), activeFeedback.getElement().get(0));
            var childJustActivated = !activeFeedback._active.fired();
            if (activeChildExists && childJustActivated) {
                this._cancel();
                return
            }
            activeFeedback._inactive.force()
        }
        activeFeedback = this;
        this._initEvents(e);
        this._active.start()
    },
    _initEvents: function(e) {
        var that = this;
        var eventTarget = this._getEmitterTarget(e);
        var mouseEvent = (0, _index.isMouseEvent)(e);
        var isSimulator = _devices.default.isSimulator();
        var deferFeedback = isSimulator || !mouseEvent;
        var activeTimeout = (0, _common.ensureDefined)(this.activeTimeout, ACTIVE_TIMEOUT);
        var inactiveTimeout = (0, _common.ensureDefined)(this.inactiveTimeout, INACTIVE_TIMEOUT);
        this._active = new FeedbackEvent(deferFeedback ? activeTimeout : 0, function() {
            that._fireEvent(ACTIVE_EVENT_NAME, e, {
                target: eventTarget
            })
        });
        this._inactive = new FeedbackEvent(deferFeedback ? inactiveTimeout : 0, function() {
            that._fireEvent(INACTIVE_EVENT_NAME, e, {
                target: eventTarget
            });
            activeFeedback = null
        })
    },
    cancel: function(e) {
        this.end(e)
    },
    end: function(e) {
        var skipTimers = e.type !== _pointer.default.up;
        if (skipTimers) {
            this._active.stop()
        } else {
            this._active.force()
        }
        this._inactive.start();
        if (skipTimers) {
            this._inactive.force()
        }
    },
    dispose: function() {
        this._active.stop();
        this._inactive.stop();
        this.callBase()
    },
    lockInactive: function() {
        this._active.force();
        this._inactive.stop();
        activeFeedback = null;
        this._cancel();
        return this._inactive.force.bind(this._inactive)
    }
});
FeedbackEmitter.lock = function(deferred) {
    var lockInactive = activeFeedback ? activeFeedback.lockInactive() : _common.noop;
    deferred.done(lockInactive)
};
(0, _emitter_registrator.default)({
    emitter: FeedbackEmitter,
    events: [ACTIVE_EVENT_NAME, INACTIVE_EVENT_NAME]
});
var lock = FeedbackEmitter.lock;
exports.lock = lock;


/***/ }),

/***/ "./node_modules/devextreme/events/core/emitter.js":
/*!********************************************************!*\
  !*** ./node_modules/devextreme/events/core/emitter.js ***!
  \********************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/**
 * DevExtreme (events/core/emitter.js)
 * Version: 20.2.3
 * Build date: Tue Oct 20 2020
 *
 * Copyright (c) 2012 - 2020 Developer Express Inc. ALL RIGHTS RESERVED
 * Read about DevExtreme licensing here: https://js.devexpress.com/Licensing/
 */

exports.default = void 0;
var _renderer = _interopRequireDefault(__webpack_require__(/*! ../../core/renderer */ "./node_modules/devextreme/core/renderer.js"));
var _common = __webpack_require__(/*! ../../core/utils/common */ "./node_modules/devextreme/core/utils/common.js");
var _class = _interopRequireDefault(__webpack_require__(/*! ../../core/class */ "./node_modules/devextreme/core/class.js"));
var _callbacks = _interopRequireDefault(__webpack_require__(/*! ../../core/utils/callbacks */ "./node_modules/devextreme/core/utils/callbacks.js"));
var _extend = __webpack_require__(/*! ../../core/utils/extend */ "./node_modules/devextreme/core/utils/extend.js");
var _index = __webpack_require__(/*! ../utils/index */ "./node_modules/devextreme/events/utils/index.js");

function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
        "default": obj
    }
}
var Emitter = _class.default.inherit({
    ctor: function(element) {
        this._$element = (0, _renderer.default)(element);
        this._cancelCallback = (0, _callbacks.default)();
        this._acceptCallback = (0, _callbacks.default)()
    },
    getElement: function() {
        return this._$element
    },
    validate: function(e) {
        return !(0, _index.isDxMouseWheelEvent)(e)
    },
    validatePointers: function(e) {
        return 1 === (0, _index.hasTouches)(e)
    },
    allowInterruptionByMouseWheel: function() {
        return true
    },
    configure: function(data) {
        (0, _extend.extend)(this, data)
    },
    addCancelCallback: function(callback) {
        this._cancelCallback.add(callback)
    },
    removeCancelCallback: function() {
        this._cancelCallback.empty()
    },
    _cancel: function(e) {
        this._cancelCallback.fire(this, e)
    },
    addAcceptCallback: function(callback) {
        this._acceptCallback.add(callback)
    },
    removeAcceptCallback: function() {
        this._acceptCallback.empty()
    },
    _accept: function(e) {
        this._acceptCallback.fire(this, e)
    },
    _requestAccept: function(e) {
        this._acceptRequestEvent = e
    },
    _forgetAccept: function() {
        this._accept(this._acceptRequestEvent);
        this._acceptRequestEvent = null
    },
    start: _common.noop,
    move: _common.noop,
    end: _common.noop,
    cancel: _common.noop,
    reset: function() {
        if (this._acceptRequestEvent) {
            this._accept(this._acceptRequestEvent)
        }
    },
    _fireEvent: function(eventName, e, params) {
        var eventData = (0, _extend.extend)({
            type: eventName,
            originalEvent: e,
            target: this._getEmitterTarget(e),
            delegateTarget: this.getElement().get(0)
        }, params);
        e = (0, _index.fireEvent)(eventData);
        if (e.cancel) {
            this._cancel(e)
        }
        return e
    },
    _getEmitterTarget: function(e) {
        return (this.delegateSelector ? (0, _renderer.default)(e.target).closest(this.delegateSelector) : this.getElement()).get(0)
    },
    dispose: _common.noop
});
var _default = Emitter;
exports.default = _default;
module.exports = exports.default;


/***/ }),

/***/ "./node_modules/devextreme/events/core/emitter_registrator.js":
/*!********************************************************************!*\
  !*** ./node_modules/devextreme/events/core/emitter_registrator.js ***!
  \********************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/**
 * DevExtreme (events/core/emitter_registrator.js)
 * Version: 20.2.3
 * Build date: Tue Oct 20 2020
 *
 * Copyright (c) 2012 - 2020 Developer Express Inc. ALL RIGHTS RESERVED
 * Read about DevExtreme licensing here: https://js.devexpress.com/Licensing/
 */

exports.default = void 0;
var _renderer = _interopRequireDefault(__webpack_require__(/*! ../../core/renderer */ "./node_modules/devextreme/core/renderer.js"));
var _ready_callbacks = _interopRequireDefault(__webpack_require__(/*! ../../core/utils/ready_callbacks */ "./node_modules/devextreme/core/utils/ready_callbacks.js"));
var _dom_adapter = _interopRequireDefault(__webpack_require__(/*! ../../core/dom_adapter */ "./node_modules/devextreme/core/dom_adapter.js"));
var _events_engine = _interopRequireDefault(__webpack_require__(/*! ../../events/core/events_engine */ "./node_modules/devextreme/events/core/events_engine.js"));
var _element_data = __webpack_require__(/*! ../../core/element_data */ "./node_modules/devextreme/core/element_data.js");
var _class = _interopRequireDefault(__webpack_require__(/*! ../../core/class */ "./node_modules/devextreme/core/class.js"));
var _extend = __webpack_require__(/*! ../../core/utils/extend */ "./node_modules/devextreme/core/utils/extend.js");
var _array = __webpack_require__(/*! ../../core/utils/array */ "./node_modules/devextreme/core/utils/array.js");
var _iterator = __webpack_require__(/*! ../../core/utils/iterator */ "./node_modules/devextreme/core/utils/iterator.js");
var _event_registrator = _interopRequireDefault(__webpack_require__(/*! ./event_registrator */ "./node_modules/devextreme/events/core/event_registrator.js"));
var _index = __webpack_require__(/*! ../utils/index */ "./node_modules/devextreme/events/utils/index.js");
var _pointer = _interopRequireDefault(__webpack_require__(/*! ../pointer */ "./node_modules/devextreme/events/pointer.js"));
var _wheel = __webpack_require__(/*! ./wheel */ "./node_modules/devextreme/events/core/wheel.js");

function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
        "default": obj
    }
}
var MANAGER_EVENT = "dxEventManager";
var EMITTER_DATA = "dxEmitter";
var EventManager = _class.default.inherit({
    ctor: function() {
        this._attachHandlers();
        this.reset();
        this._proxiedCancelHandler = this._cancelHandler.bind(this);
        this._proxiedAcceptHandler = this._acceptHandler.bind(this)
    },
    _attachHandlers: function() {
        _ready_callbacks.default.add(function() {
            var document = _dom_adapter.default.getDocument();
            _events_engine.default.subscribeGlobal(document, (0, _index.addNamespace)(_pointer.default.down, MANAGER_EVENT), this._pointerDownHandler.bind(this));
            _events_engine.default.subscribeGlobal(document, (0, _index.addNamespace)(_pointer.default.move, MANAGER_EVENT), this._pointerMoveHandler.bind(this));
            _events_engine.default.subscribeGlobal(document, (0, _index.addNamespace)([_pointer.default.up, _pointer.default.cancel].join(" "), MANAGER_EVENT), this._pointerUpHandler.bind(this));
            _events_engine.default.subscribeGlobal(document, (0, _index.addNamespace)(_wheel.name, MANAGER_EVENT), this._mouseWheelHandler.bind(this))
        }.bind(this))
    },
    _eachEmitter: function(callback) {
        var activeEmitters = this._activeEmitters || [];
        var i = 0;
        while (activeEmitters.length > i) {
            var emitter = activeEmitters[i];
            if (false === callback(emitter)) {
                break
            }
            if (activeEmitters[i] === emitter) {
                i++
            }
        }
    },
    _applyToEmitters: function(method, arg) {
        this._eachEmitter(function(emitter) {
            emitter[method].call(emitter, arg)
        })
    },
    reset: function() {
        this._eachEmitter(this._proxiedCancelHandler);
        this._activeEmitters = []
    },
    resetEmitter: function(emitter) {
        this._proxiedCancelHandler(emitter)
    },
    _pointerDownHandler: function(e) {
        if ((0, _index.isMouseEvent)(e) && e.which > 1) {
            return
        }
        this._updateEmitters(e)
    },
    _updateEmitters: function(e) {
        if (!this._isSetChanged(e)) {
            return
        }
        this._cleanEmitters(e);
        this._fetchEmitters(e)
    },
    _isSetChanged: function(e) {
        var currentSet = this._closestEmitter(e);
        var previousSet = this._emittersSet || [];
        var setChanged = currentSet.length !== previousSet.length;
        (0, _iterator.each)(currentSet, function(index, emitter) {
            setChanged = setChanged || previousSet[index] !== emitter;
            return !setChanged
        });
        this._emittersSet = currentSet;
        return setChanged
    },
    _closestEmitter: function(e) {
        var that = this;
        var result = [];
        var $element = (0, _renderer.default)(e.target);

        function handleEmitter(_, emitter) {
            if (!!emitter && emitter.validatePointers(e) && emitter.validate(e)) {
                emitter.addCancelCallback(that._proxiedCancelHandler);
                emitter.addAcceptCallback(that._proxiedAcceptHandler);
                result.push(emitter)
            }
        }
        while ($element.length) {
            var emitters = (0, _element_data.data)($element.get(0), EMITTER_DATA) || [];
            (0, _iterator.each)(emitters, handleEmitter);
            $element = $element.parent()
        }
        return result
    },
    _acceptHandler: function(acceptedEmitter, e) {
        var that = this;
        this._eachEmitter(function(emitter) {
            if (emitter !== acceptedEmitter) {
                that._cancelEmitter(emitter, e)
            }
        })
    },
    _cancelHandler: function(canceledEmitter, e) {
        this._cancelEmitter(canceledEmitter, e)
    },
    _cancelEmitter: function(emitter, e) {
        var activeEmitters = this._activeEmitters;
        if (e) {
            emitter.cancel(e)
        } else {
            emitter.reset()
        }
        emitter.removeCancelCallback();
        emitter.removeAcceptCallback();
        var emitterIndex = (0, _array.inArray)(emitter, activeEmitters);
        if (emitterIndex > -1) {
            activeEmitters.splice(emitterIndex, 1)
        }
    },
    _cleanEmitters: function(e) {
        this._applyToEmitters("end", e);
        this.reset(e)
    },
    _fetchEmitters: function(e) {
        this._activeEmitters = this._emittersSet.slice();
        this._applyToEmitters("start", e)
    },
    _pointerMoveHandler: function(e) {
        this._applyToEmitters("move", e)
    },
    _pointerUpHandler: function(e) {
        this._updateEmitters(e)
    },
    _mouseWheelHandler: function(e) {
        if (!this._allowInterruptionByMouseWheel()) {
            return
        }
        e.pointers = [null];
        this._pointerDownHandler(e);
        this._adjustWheelEvent(e);
        this._pointerMoveHandler(e);
        e.pointers = [];
        this._pointerUpHandler(e)
    },
    _allowInterruptionByMouseWheel: function() {
        var allowInterruption = true;
        this._eachEmitter(function(emitter) {
            allowInterruption = emitter.allowInterruptionByMouseWheel() && allowInterruption;
            return allowInterruption
        });
        return allowInterruption
    },
    _adjustWheelEvent: function(e) {
        var closestGestureEmitter = null;
        this._eachEmitter(function(emitter) {
            if (!emitter.gesture) {
                return
            }
            var direction = emitter.getDirection(e);
            if ("horizontal" !== direction && !e.shiftKey || "vertical" !== direction && e.shiftKey) {
                closestGestureEmitter = emitter;
                return false
            }
        });
        if (!closestGestureEmitter) {
            return
        }
        var direction = closestGestureEmitter.getDirection(e);
        var verticalGestureDirection = "both" === direction && !e.shiftKey || "vertical" === direction;
        var prop = verticalGestureDirection ? "pageY" : "pageX";
        e[prop] += e.delta
    },
    isActive: function(element) {
        var result = false;
        this._eachEmitter(function(emitter) {
            result = result || emitter.getElement().is(element)
        });
        return result
    }
});
var eventManager = new EventManager;
var EMITTER_SUBSCRIPTION_DATA = "dxEmitterSubscription";
var registerEmitter = function(emitterConfig) {
    var emitterClass = emitterConfig.emitter;
    var emitterName = emitterConfig.events[0];
    var emitterEvents = emitterConfig.events;
    (0, _iterator.each)(emitterEvents, function(_, eventName) {
        (0, _event_registrator.default)(eventName, {
            noBubble: !emitterConfig.bubble,
            setup: function(element) {
                var subscriptions = (0, _element_data.data)(element, EMITTER_SUBSCRIPTION_DATA) || {};
                var emitters = (0, _element_data.data)(element, EMITTER_DATA) || {};
                var emitter = emitters[emitterName] || new emitterClass(element);
                subscriptions[eventName] = true;
                emitters[emitterName] = emitter;
                (0, _element_data.data)(element, EMITTER_DATA, emitters);
                (0, _element_data.data)(element, EMITTER_SUBSCRIPTION_DATA, subscriptions)
            },
            add: function(element, handleObj) {
                var emitters = (0, _element_data.data)(element, EMITTER_DATA);
                var emitter = emitters[emitterName];
                emitter.configure((0, _extend.extend)({
                    delegateSelector: handleObj.selector
                }, handleObj.data), handleObj.type)
            },
            teardown: function(element) {
                var subscriptions = (0, _element_data.data)(element, EMITTER_SUBSCRIPTION_DATA);
                var emitters = (0, _element_data.data)(element, EMITTER_DATA);
                var emitter = emitters[emitterName];
                delete subscriptions[eventName];
                var disposeEmitter = true;
                (0, _iterator.each)(emitterEvents, function(_, eventName) {
                    disposeEmitter = disposeEmitter && !subscriptions[eventName];
                    return disposeEmitter
                });
                if (disposeEmitter) {
                    if (eventManager.isActive(element)) {
                        eventManager.resetEmitter(emitter)
                    }
                    emitter && emitter.dispose();
                    delete emitters[emitterName]
                }
            }
        })
    })
};
var _default = registerEmitter;
exports.default = _default;
module.exports = exports.default;


/***/ }),

/***/ "./node_modules/devextreme/events/core/event_registrator.js":
/*!******************************************************************!*\
  !*** ./node_modules/devextreme/events/core/event_registrator.js ***!
  \******************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/**
 * DevExtreme (events/core/event_registrator.js)
 * Version: 20.2.3
 * Build date: Tue Oct 20 2020
 *
 * Copyright (c) 2012 - 2020 Developer Express Inc. ALL RIGHTS RESERVED
 * Read about DevExtreme licensing here: https://js.devexpress.com/Licensing/
 */

exports.default = void 0;
var _iterator = __webpack_require__(/*! ../../core/utils/iterator */ "./node_modules/devextreme/core/utils/iterator.js");
var _event_registrator_callbacks = _interopRequireDefault(__webpack_require__(/*! ./event_registrator_callbacks */ "./node_modules/devextreme/events/core/event_registrator_callbacks.js"));

function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
        "default": obj
    }
}
var registerEvent = function(name, eventObject) {
    var strategy = {};
    if ("noBubble" in eventObject) {
        strategy.noBubble = eventObject.noBubble
    }
    if ("bindType" in eventObject) {
        strategy.bindType = eventObject.bindType
    }
    if ("delegateType" in eventObject) {
        strategy.delegateType = eventObject.delegateType
    }(0, _iterator.each)(["setup", "teardown", "add", "remove", "trigger", "handle", "_default", "dispose"], function(_, methodName) {
        if (!eventObject[methodName]) {
            return
        }
        strategy[methodName] = function() {
            var args = [].slice.call(arguments);
            args.unshift(this);
            return eventObject[methodName].apply(eventObject, args)
        }
    });
    _event_registrator_callbacks.default.fire(name, strategy)
};
registerEvent.callbacks = _event_registrator_callbacks.default;
var _default = registerEvent;
exports.default = _default;
module.exports = exports.default;


/***/ }),

/***/ "./node_modules/devextreme/events/core/event_registrator_callbacks.js":
/*!****************************************************************************!*\
  !*** ./node_modules/devextreme/events/core/event_registrator_callbacks.js ***!
  \****************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/**
 * DevExtreme (events/core/event_registrator_callbacks.js)
 * Version: 20.2.3
 * Build date: Tue Oct 20 2020
 *
 * Copyright (c) 2012 - 2020 Developer Express Inc. ALL RIGHTS RESERVED
 * Read about DevExtreme licensing here: https://js.devexpress.com/Licensing/
 */

exports.default = void 0;
var _memorized_callbacks = _interopRequireDefault(__webpack_require__(/*! ../../core/memorized_callbacks */ "./node_modules/devextreme/core/memorized_callbacks.js"));

function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
        "default": obj
    }
}
var _default = new _memorized_callbacks.default;
exports.default = _default;
module.exports = exports.default;


/***/ }),

/***/ "./node_modules/devextreme/events/core/events_engine.js":
/*!**************************************************************!*\
  !*** ./node_modules/devextreme/events/core/events_engine.js ***!
  \**************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/**
 * DevExtreme (events/core/events_engine.js)
 * Version: 20.2.3
 * Build date: Tue Oct 20 2020
 *
 * Copyright (c) 2012 - 2020 Developer Express Inc. ALL RIGHTS RESERVED
 * Read about DevExtreme licensing here: https://js.devexpress.com/Licensing/
 */

exports.default = void 0;
var _event_registrator_callbacks = _interopRequireDefault(__webpack_require__(/*! ./event_registrator_callbacks */ "./node_modules/devextreme/events/core/event_registrator_callbacks.js"));
var _extend = __webpack_require__(/*! ../../core/utils/extend */ "./node_modules/devextreme/core/utils/extend.js");
var _dom_adapter = _interopRequireDefault(__webpack_require__(/*! ../../core/dom_adapter */ "./node_modules/devextreme/core/dom_adapter.js"));
var _window = __webpack_require__(/*! ../../core/utils/window */ "./node_modules/devextreme/core/utils/window.js");
var _dependency_injector = _interopRequireDefault(__webpack_require__(/*! ../../core/utils/dependency_injector */ "./node_modules/devextreme/core/utils/dependency_injector.js"));
var _type = __webpack_require__(/*! ../../core/utils/type */ "./node_modules/devextreme/core/utils/type.js");
var _callbacks = _interopRequireDefault(__webpack_require__(/*! ../../core/utils/callbacks */ "./node_modules/devextreme/core/utils/callbacks.js"));
var _errors = _interopRequireDefault(__webpack_require__(/*! ../../core/errors */ "./node_modules/devextreme/core/errors.js"));
var _weak_map = _interopRequireDefault(__webpack_require__(/*! ../../core/polyfills/weak_map */ "./node_modules/devextreme/core/polyfills/weak_map.js"));
var _hook_touch_props = _interopRequireDefault(__webpack_require__(/*! ../../events/core/hook_touch_props */ "./node_modules/devextreme/events/core/hook_touch_props.js"));
var _call_once = _interopRequireDefault(__webpack_require__(/*! ../../core/utils/call_once */ "./node_modules/devextreme/core/utils/call_once.js"));

function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
        "default": obj
    }
}

function _typeof(obj) {
    "@babel/helpers - typeof";
    if ("function" === typeof Symbol && "symbol" === typeof Symbol.iterator) {
        _typeof = function(obj) {
            return typeof obj
        }
    } else {
        _typeof = function(obj) {
            return obj && "function" === typeof Symbol && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj
        }
    }
    return _typeof(obj)
}
var window = (0, _window.getWindow)();
var EMPTY_EVENT_NAME = "dxEmptyEventType";
var NATIVE_EVENTS_TO_SUBSCRIBE = {
    mouseenter: "mouseover",
    mouseleave: "mouseout",
    pointerenter: "pointerover",
    pointerleave: "pointerout"
};
var NATIVE_EVENTS_TO_TRIGGER = {
    focusin: "focus",
    focusout: "blur"
};
var NO_BUBBLE_EVENTS = ["blur", "focus", "load"];
var forcePassiveFalseEventNames = ["touchmove", "wheel", "mousewheel", "touchstart"];

function matchesSafe(target, selector) {
    return !(0, _type.isWindow)(target) && "#document" !== target.nodeName && _dom_adapter.default.elementMatches(target, selector)
}
var elementDataMap = new _weak_map.default;
var guid = 0;
var skipEvent;
var special = function() {
    var specialData = {};
    _event_registrator_callbacks.default.add(function(eventName, eventObject) {
        specialData[eventName] = eventObject
    });
    return {
        getField: function(eventName, field) {
            return specialData[eventName] && specialData[eventName][field]
        },
        callMethod: function(eventName, methodName, context, args) {
            return specialData[eventName] && specialData[eventName][methodName] && specialData[eventName][methodName].apply(context, args)
        }
    }
}();
var eventsEngine = (0, _dependency_injector.default)({
    on: getHandler(normalizeOnArguments(iterate(function(element, eventName, selector, data, handler) {
        var handlersController = getHandlersController(element, eventName);
        handlersController.addHandler(handler, selector, data)
    }))),
    one: getHandler(normalizeOnArguments(function(element, eventName, selector, data, handler) {
        var oneTimeHandler = function oneTimeHandler() {
            eventsEngine.off(element, eventName, selector, oneTimeHandler);
            handler.apply(this, arguments)
        };
        eventsEngine.on(element, eventName, selector, data, oneTimeHandler)
    })),
    off: getHandler(normalizeOffArguments(iterate(function(element, eventName, selector, handler) {
        var handlersController = getHandlersController(element, eventName);
        handlersController.removeHandler(handler, selector)
    }))),
    trigger: getHandler(normalizeTriggerArguments(function(element, event, extraParameters) {
        var eventName = event.type;
        var handlersController = getHandlersController(element, event.type);
        special.callMethod(eventName, "trigger", element, [event, extraParameters]);
        handlersController.callHandlers(event, extraParameters);
        var noBubble = special.getField(eventName, "noBubble") || event.isPropagationStopped() || NO_BUBBLE_EVENTS.indexOf(eventName) !== -1;
        if (!noBubble) {
            var parents = [];
            var getParents = function getParents(element) {
                var parent = element.parentNode;
                if (parent) {
                    parents.push(parent);
                    getParents(parent)
                }
            };
            getParents(element);
            parents.push(window);
            var i = 0;
            while (parents[i] && !event.isPropagationStopped()) {
                var parentDataByEvent = getHandlersController(parents[i], event.type);
                parentDataByEvent.callHandlers((0, _extend.extend)(event, {
                    currentTarget: parents[i]
                }), extraParameters);
                i++
            }
        }
        if (element.nodeType || (0, _type.isWindow)(element)) {
            special.callMethod(eventName, "_default", element, [event, extraParameters]);
            callNativeMethod(eventName, element)
        }
    })),
    triggerHandler: getHandler(normalizeTriggerArguments(function(element, event, extraParameters) {
        var handlersController = getHandlersController(element, event.type);
        handlersController.callHandlers(event, extraParameters)
    }))
});

function applyForEach(args, method) {
    var element = args[0];
    if (!element) {
        return
    }
    if (_dom_adapter.default.isNode(element) || (0, _type.isWindow)(element)) {
        method.apply(eventsEngine, args)
    } else {
        if (!(0, _type.isString)(element) && "length" in element) {
            var itemArgs = Array.prototype.slice.call(args, 0);
            Array.prototype.forEach.call(element, function(itemElement) {
                itemArgs[0] = itemElement;
                applyForEach(itemArgs, method)
            })
        } else {
            throw _errors.default.Error("E0025")
        }
    }
}

function getHandler(method) {
    return function() {
        applyForEach(arguments, method)
    }
}

function detectPassiveEventHandlersSupport() {
    var isSupported = false;
    try {
        var options = Object.defineProperty({}, "passive", {
            get: function() {
                isSupported = true;
                return true
            }
        });
        window.addEventListener("test", null, options)
    } catch (e) {}
    return isSupported
}
var passiveEventHandlersSupported = (0, _call_once.default)(detectPassiveEventHandlersSupport);
var contains = function contains(container, element) {
    if ((0, _type.isWindow)(container)) {
        return contains(container.document, element)
    }
    return container.contains ? container.contains(element) : !!(element.compareDocumentPosition(container) & element.DOCUMENT_POSITION_CONTAINS)
};

function getHandlersController(element, eventName) {
    var elementData = elementDataMap.get(element);
    eventName = eventName || "";
    var eventNameParts = eventName.split(".");
    var namespaces = eventNameParts.slice(1);
    var eventNameIsDefined = !!eventNameParts[0];
    eventName = eventNameParts[0] || EMPTY_EVENT_NAME;
    if (!elementData) {
        elementData = {};
        elementDataMap.set(element, elementData)
    }
    if (!elementData[eventName]) {
        elementData[eventName] = {
            handleObjects: [],
            nativeHandler: null
        }
    }
    var eventData = elementData[eventName];
    return {
        addHandler: function(handler, selector, data) {
            var callHandler = function(e, extraParameters) {
                var handlerArgs = [e];
                var target = e.currentTarget;
                var relatedTarget = e.relatedTarget;
                var secondaryTargetIsInside;
                var result;
                if (eventName in NATIVE_EVENTS_TO_SUBSCRIBE) {
                    secondaryTargetIsInside = relatedTarget && target && (relatedTarget === target || contains(target, relatedTarget))
                }
                if (void 0 !== extraParameters) {
                    handlerArgs.push(extraParameters)
                }
                special.callMethod(eventName, "handle", element, [e, data]);
                if (!secondaryTargetIsInside) {
                    result = handler.apply(target, handlerArgs)
                }
                if (false === result) {
                    e.preventDefault();
                    e.stopPropagation()
                }
            };
            var wrappedHandler = function(e, extraParameters) {
                if (skipEvent && e.type === skipEvent) {
                    return
                }
                e.data = data;
                e.delegateTarget = element;
                if (selector) {
                    var currentTarget = e.target;
                    while (currentTarget && currentTarget !== element) {
                        if (matchesSafe(currentTarget, selector)) {
                            e.currentTarget = currentTarget;
                            callHandler(e, extraParameters)
                        }
                        currentTarget = currentTarget.parentNode
                    }
                } else {
                    e.currentTarget = e.delegateTarget || e.target;
                    callHandler(e, extraParameters)
                }
            };
            var handleObject = {
                handler: handler,
                wrappedHandler: wrappedHandler,
                selector: selector,
                type: eventName,
                data: data,
                namespace: namespaces.join("."),
                namespaces: namespaces,
                guid: ++guid
            };
            eventData.handleObjects.push(handleObject);
            var firstHandlerForTheType = 1 === eventData.handleObjects.length;
            var shouldAddNativeListener = firstHandlerForTheType && eventNameIsDefined;
            var nativeListenerOptions;
            if (shouldAddNativeListener) {
                shouldAddNativeListener = !special.callMethod(eventName, "setup", element, [data, namespaces, handler])
            }
            if (shouldAddNativeListener) {
                eventData.nativeHandler = getNativeHandler(eventName);
                if (passiveEventHandlersSupported() && forcePassiveFalseEventNames.indexOf(eventName) > -1) {
                    nativeListenerOptions = {
                        passive: false
                    }
                }
                eventData.removeListener = _dom_adapter.default.listen(element, NATIVE_EVENTS_TO_SUBSCRIBE[eventName] || eventName, eventData.nativeHandler, nativeListenerOptions)
            }
            special.callMethod(eventName, "add", element, [handleObject])
        },
        removeHandler: function(handler, selector) {
            var removeByEventName = function(eventName) {
                var eventData = elementData[eventName];
                if (!eventData.handleObjects.length) {
                    delete elementData[eventName];
                    return
                }
                var removedHandler;
                eventData.handleObjects = eventData.handleObjects.filter(function(handleObject) {
                    var skip = namespaces.length && !isSubset(handleObject.namespaces, namespaces) || handler && handleObject.handler !== handler || selector && handleObject.selector !== selector;
                    if (!skip) {
                        removedHandler = handleObject.handler;
                        special.callMethod(eventName, "remove", element, [handleObject])
                    }
                    return skip
                });
                var lastHandlerForTheType = !eventData.handleObjects.length;
                var shouldRemoveNativeListener = lastHandlerForTheType && eventName !== EMPTY_EVENT_NAME;
                if (shouldRemoveNativeListener) {
                    special.callMethod(eventName, "teardown", element, [namespaces, removedHandler]);
                    if (eventData.nativeHandler) {
                        eventData.removeListener()
                    }
                    delete elementData[eventName]
                }
            };
            if (eventNameIsDefined) {
                removeByEventName(eventName)
            } else {
                for (var name in elementData) {
                    removeByEventName(name)
                }
            }
            var elementDataIsEmpty = 0 === Object.keys(elementData).length;
            if (elementDataIsEmpty) {
                elementDataMap.delete(element)
            }
        },
        callHandlers: function(event, extraParameters) {
            var forceStop = false;
            var handleCallback = function(handleObject) {
                if (forceStop) {
                    return
                }
                if (!namespaces.length || isSubset(handleObject.namespaces, namespaces)) {
                    handleObject.wrappedHandler(event, extraParameters);
                    forceStop = event.isImmediatePropagationStopped()
                }
            };
            eventData.handleObjects.forEach(handleCallback);
            if (namespaces.length && elementData[EMPTY_EVENT_NAME]) {
                elementData[EMPTY_EVENT_NAME].handleObjects.forEach(handleCallback)
            }
        }
    }
}

function getNativeHandler(subscribeName) {
    return function(event, extraParameters) {
        var handlersController = getHandlersController(this, subscribeName);
        event = eventsEngine.Event(event);
        handlersController.callHandlers(event, extraParameters)
    }
}

function isSubset(original, checked) {
    for (var i = 0; i < checked.length; i++) {
        if (original.indexOf(checked[i]) < 0) {
            return false
        }
    }
    return true
}

function normalizeOnArguments(callback) {
    return function(element, eventName, selector, data, handler) {
        if (!handler) {
            handler = data;
            data = void 0
        }
        if ("string" !== typeof selector) {
            data = selector;
            selector = void 0
        }
        if (!handler && "string" === typeof eventName) {
            handler = data || selector;
            selector = void 0;
            data = void 0
        }
        callback(element, eventName, selector, data, handler)
    }
}

function normalizeOffArguments(callback) {
    return function(element, eventName, selector, handler) {
        if ("function" === typeof selector) {
            handler = selector;
            selector = void 0
        }
        callback(element, eventName, selector, handler)
    }
}

function normalizeTriggerArguments(callback) {
    return function(element, src, extraParameters) {
        if ("string" === typeof src) {
            src = {
                type: src
            }
        }
        if (!src.target) {
            src.target = element
        }
        src.currentTarget = element;
        if (!src.delegateTarget) {
            src.delegateTarget = element
        }
        if (!src.type && src.originalEvent) {
            src.type = src.originalEvent.type
        }
        callback(element, src instanceof eventsEngine.Event ? src : eventsEngine.Event(src), extraParameters)
    }
}

function normalizeEventArguments(callback) {
    return function(src, config) {
        if (!(this instanceof eventsEngine.Event)) {
            return new eventsEngine.Event(src, config)
        }
        if (!src) {
            src = {}
        }
        if ("string" === typeof src) {
            src = {
                type: src
            }
        }
        if (!config) {
            config = {}
        }
        callback.call(this, src, config)
    }
}

function iterate(callback) {
    var iterateEventNames = function(element, eventName) {
        if (eventName && eventName.indexOf(" ") > -1) {
            var args = Array.prototype.slice.call(arguments, 0);
            eventName.split(" ").forEach(function(eventName) {
                args[1] = eventName;
                callback.apply(this, args)
            })
        } else {
            callback.apply(this, arguments)
        }
    };
    return function(element, eventName) {
        if ("object" === _typeof(eventName)) {
            var args = Array.prototype.slice.call(arguments, 0);
            for (var name in eventName) {
                args[1] = name;
                args[args.length - 1] = eventName[name];
                iterateEventNames.apply(this, args)
            }
        } else {
            iterateEventNames.apply(this, arguments)
        }
    }
}

function callNativeMethod(eventName, element) {
    var nativeMethodName = NATIVE_EVENTS_TO_TRIGGER[eventName] || eventName;
    var isLinkClickEvent = function(eventName, element) {
        return "click" === eventName && "a" === element.localName
    };
    if (isLinkClickEvent(eventName, element)) {
        return
    }
    if ((0, _type.isFunction)(element[nativeMethodName])) {
        skipEvent = eventName;
        element[nativeMethodName]();
        skipEvent = void 0
    }
}

function calculateWhich(event) {
    var setForMouseEvent = function(event) {
        var mouseEventRegex = /^(?:mouse|pointer|contextmenu|drag|drop)|click/;
        return !event.which && void 0 !== event.button && mouseEventRegex.test(event.type)
    };
    var setForKeyEvent = function(event) {
        return null == event.which && 0 === event.type.indexOf("key")
    };
    if (setForKeyEvent(event)) {
        return null != event.charCode ? event.charCode : event.keyCode
    }
    if (setForMouseEvent(event)) {
        var whichByButton = {
            1: 1,
            2: 3,
            3: 1,
            4: 2
        };
        return whichByButton[event.button]
    }
    return event.which
}

function initEvent(EventClass) {
    if (EventClass) {
        eventsEngine.Event = EventClass;
        eventsEngine.Event.prototype = EventClass.prototype
    }
}
initEvent(normalizeEventArguments(function(src, config) {
    var that = this;
    var propagationStopped = false;
    var immediatePropagationStopped = false;
    var defaultPrevented = false;
    (0, _extend.extend)(that, src);
    if (src instanceof eventsEngine.Event || (0, _window.hasWindow)() && src instanceof window.Event) {
        that.originalEvent = src;
        that.currentTarget = void 0
    }
    if (!(src instanceof eventsEngine.Event)) {
        (0, _extend.extend)(that, {
            isPropagationStopped: function() {
                return !!(propagationStopped || that.originalEvent && that.originalEvent.propagationStopped)
            },
            stopPropagation: function() {
                propagationStopped = true;
                that.originalEvent && that.originalEvent.stopPropagation()
            },
            isImmediatePropagationStopped: function() {
                return immediatePropagationStopped
            },
            stopImmediatePropagation: function() {
                this.stopPropagation();
                immediatePropagationStopped = true;
                that.originalEvent && that.originalEvent.stopImmediatePropagation()
            },
            isDefaultPrevented: function() {
                return !!(defaultPrevented || that.originalEvent && that.originalEvent.defaultPrevented)
            },
            preventDefault: function() {
                defaultPrevented = true;
                that.originalEvent && that.originalEvent.preventDefault()
            }
        })
    }
    addProperty("which", calculateWhich, that);
    if (0 === src.type.indexOf("touch")) {
        delete config.pageX;
        delete config.pageY
    }(0, _extend.extend)(that, config);
    that.guid = ++guid
}));

function addProperty(propName, hook, eventInstance) {
    Object.defineProperty(eventInstance || eventsEngine.Event.prototype, propName, {
        enumerable: true,
        configurable: true,
        get: function() {
            return this.originalEvent && hook(this.originalEvent)
        },
        set: function(value) {
            Object.defineProperty(this, propName, {
                enumerable: true,
                configurable: true,
                writable: true,
                value: value
            })
        }
    })
}(0, _hook_touch_props.default)(addProperty);
var beforeSetStrategy = (0, _callbacks.default)();
var afterSetStrategy = (0, _callbacks.default)();
eventsEngine.set = function(engine) {
    beforeSetStrategy.fire();
    eventsEngine.inject(engine);
    initEvent(engine.Event);
    afterSetStrategy.fire()
};
eventsEngine.subscribeGlobal = function() {
    applyForEach(arguments, normalizeOnArguments(function() {
        var args = arguments;
        eventsEngine.on.apply(this, args);
        beforeSetStrategy.add(function() {
            var offArgs = Array.prototype.slice.call(args, 0);
            offArgs.splice(3, 1);
            eventsEngine.off.apply(this, offArgs)
        });
        afterSetStrategy.add(function() {
            eventsEngine.on.apply(this, args)
        })
    }))
};
eventsEngine.forcePassiveFalseEventNames = forcePassiveFalseEventNames;
eventsEngine.passiveEventHandlersSupported = passiveEventHandlersSupported;
var _default = eventsEngine;
exports.default = _default;
module.exports = exports.default;


/***/ }),

/***/ "./node_modules/devextreme/events/core/hook_touch_props.js":
/*!*****************************************************************!*\
  !*** ./node_modules/devextreme/events/core/hook_touch_props.js ***!
  \*****************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/**
 * DevExtreme (events/core/hook_touch_props.js)
 * Version: 20.2.3
 * Build date: Tue Oct 20 2020
 *
 * Copyright (c) 2012 - 2020 Developer Express Inc. ALL RIGHTS RESERVED
 * Read about DevExtreme licensing here: https://js.devexpress.com/Licensing/
 */

exports.default = _default;
var touchPropsToHook = ["pageX", "pageY", "screenX", "screenY", "clientX", "clientY"];
var touchPropHook = function(name, event) {
    if (event[name] && !event.touches || !event.touches) {
        return event[name]
    }
    var touches = event.touches.length ? event.touches : event.changedTouches;
    if (!touches.length) {
        return
    }
    return touches[0][name]
};

function _default(callback) {
    touchPropsToHook.forEach(function(name) {
        callback(name, function(event) {
            return touchPropHook(name, event)
        })
    }, this)
}
module.exports = exports.default;


/***/ }),

/***/ "./node_modules/devextreme/events/core/keyboard_processor.js":
/*!*******************************************************************!*\
  !*** ./node_modules/devextreme/events/core/keyboard_processor.js ***!
  \*******************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/**
 * DevExtreme (events/core/keyboard_processor.js)
 * Version: 20.2.3
 * Build date: Tue Oct 20 2020
 *
 * Copyright (c) 2012 - 2020 Developer Express Inc. ALL RIGHTS RESERVED
 * Read about DevExtreme licensing here: https://js.devexpress.com/Licensing/
 */

exports.default = void 0;
var _renderer = _interopRequireDefault(__webpack_require__(/*! ../../core/renderer */ "./node_modules/devextreme/core/renderer.js"));
var _events_engine = _interopRequireDefault(__webpack_require__(/*! ../../events/core/events_engine */ "./node_modules/devextreme/events/core/events_engine.js"));
var _class = _interopRequireDefault(__webpack_require__(/*! ../../core/class */ "./node_modules/devextreme/core/class.js"));
var _array = __webpack_require__(/*! ../../core/utils/array */ "./node_modules/devextreme/core/utils/array.js");
var _index = __webpack_require__(/*! ../../events/utils/index */ "./node_modules/devextreme/events/utils/index.js");

function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
        "default": obj
    }
}
var COMPOSITION_START_EVENT = "compositionstart";
var COMPOSITION_END_EVENT = "compositionend";
var KEYDOWN_EVENT = "keydown";
var NAMESPACE = "KeyboardProcessor";
var KeyboardProcessor = _class.default.inherit({
    _keydown: (0, _index.addNamespace)(KEYDOWN_EVENT, NAMESPACE),
    _compositionStart: (0, _index.addNamespace)(COMPOSITION_START_EVENT, NAMESPACE),
    _compositionEnd: (0, _index.addNamespace)(COMPOSITION_END_EVENT, NAMESPACE),
    ctor: function(options) {
        var _this = this;
        options = options || {};
        if (options.element) {
            this._element = (0, _renderer.default)(options.element)
        }
        if (options.focusTarget) {
            this._focusTarget = options.focusTarget
        }
        this._handler = options.handler;
        if (this._element) {
            this._processFunction = function(e) {
                var isNotFocusTarget = _this._focusTarget && _this._focusTarget !== e.target && (0, _array.inArray)(e.target, _this._focusTarget) < 0;
                var shouldSkipProcessing = _this._isComposingJustFinished && 229 === e.which || _this._isComposing || isNotFocusTarget;
                _this._isComposingJustFinished = false;
                if (!shouldSkipProcessing) {
                    _this.process(e)
                }
            };
            this._toggleProcessingWithContext = this.toggleProcessing.bind(this);
            _events_engine.default.on(this._element, this._keydown, this._processFunction);
            _events_engine.default.on(this._element, this._compositionStart, this._toggleProcessingWithContext);
            _events_engine.default.on(this._element, this._compositionEnd, this._toggleProcessingWithContext)
        }
    },
    dispose: function() {
        if (this._element) {
            _events_engine.default.off(this._element, this._keydown, this._processFunction);
            _events_engine.default.off(this._element, this._compositionStart, this._toggleProcessingWithContext);
            _events_engine.default.off(this._element, this._compositionEnd, this._toggleProcessingWithContext)
        }
        this._element = void 0;
        this._handler = void 0
    },
    process: function(e) {
        this._handler({
            keyName: (0, _index.normalizeKeyName)(e),
            key: e.key,
            code: e.code,
            ctrl: e.ctrlKey,
            location: e.location,
            metaKey: e.metaKey,
            shift: e.shiftKey,
            alt: e.altKey,
            which: e.which,
            originalEvent: e
        })
    },
    toggleProcessing: function(_ref) {
        var type = _ref.type;
        this._isComposing = type === COMPOSITION_START_EVENT;
        this._isComposingJustFinished = !this._isComposing
    }
});
var _default = KeyboardProcessor;
exports.default = _default;
module.exports = exports.default;


/***/ }),

/***/ "./node_modules/devextreme/events/core/wheel.js":
/*!******************************************************!*\
  !*** ./node_modules/devextreme/events/core/wheel.js ***!
  \******************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/**
 * DevExtreme (events/core/wheel.js)
 * Version: 20.2.3
 * Build date: Tue Oct 20 2020
 *
 * Copyright (c) 2012 - 2020 Developer Express Inc. ALL RIGHTS RESERVED
 * Read about DevExtreme licensing here: https://js.devexpress.com/Licensing/
 */

exports.name = void 0;
var _renderer = _interopRequireDefault(__webpack_require__(/*! ../../core/renderer */ "./node_modules/devextreme/core/renderer.js"));
var _events_engine = _interopRequireDefault(__webpack_require__(/*! ../../events/core/events_engine */ "./node_modules/devextreme/events/core/events_engine.js"));
var _event_registrator = _interopRequireDefault(__webpack_require__(/*! ./event_registrator */ "./node_modules/devextreme/events/core/event_registrator.js"));
var _index = __webpack_require__(/*! ../utils/index */ "./node_modules/devextreme/events/utils/index.js");

function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
        "default": obj
    }
}
var EVENT_NAME = "dxmousewheel";
exports.name = EVENT_NAME;
var EVENT_NAMESPACE = "dxWheel";
var NATIVE_EVENT_NAME = "wheel";
var PIXEL_MODE = 0;
var DELTA_MUTLIPLIER = 30;
var wheel = {
    setup: function(element) {
        var $element = (0, _renderer.default)(element);
        _events_engine.default.on($element, (0, _index.addNamespace)(NATIVE_EVENT_NAME, EVENT_NAMESPACE), wheel._wheelHandler.bind(wheel))
    },
    teardown: function(element) {
        _events_engine.default.off(element, ".".concat(EVENT_NAMESPACE))
    },
    _wheelHandler: function(e) {
        var _e$originalEvent = e.originalEvent,
            deltaMode = _e$originalEvent.deltaMode,
            deltaY = _e$originalEvent.deltaY,
            deltaX = _e$originalEvent.deltaX,
            deltaZ = _e$originalEvent.deltaZ;
        (0, _index.fireEvent)({
            type: EVENT_NAME,
            originalEvent: e,
            delta: this._normalizeDelta(deltaY, deltaMode),
            deltaX: deltaX,
            deltaY: deltaY,
            deltaZ: deltaZ,
            deltaMode: deltaMode,
            pointerType: "mouse"
        });
        e.stopPropagation()
    },
    _normalizeDelta: function(delta) {
        var deltaMode = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : PIXEL_MODE;
        if (deltaMode === PIXEL_MODE) {
            return -delta
        } else {
            return -DELTA_MUTLIPLIER * delta
        }
    }
};
(0, _event_registrator.default)(EVENT_NAME, wheel);


/***/ }),

/***/ "./node_modules/devextreme/events/drag.js":
/*!************************************************!*\
  !*** ./node_modules/devextreme/events/drag.js ***!
  \************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/**
 * DevExtreme (events/drag.js)
 * Version: 20.2.3
 * Build date: Tue Oct 20 2020
 *
 * Copyright (c) 2012 - 2020 Developer Express Inc. ALL RIGHTS RESERVED
 * Read about DevExtreme licensing here: https://js.devexpress.com/Licensing/
 */


function _typeof(obj) {
    "@babel/helpers - typeof";
    if ("function" === typeof Symbol && "symbol" === typeof Symbol.iterator) {
        _typeof = function(obj) {
            return typeof obj
        }
    } else {
        _typeof = function(obj) {
            return obj && "function" === typeof Symbol && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj
        }
    }
    return _typeof(obj)
}
exports.drop = exports.leave = exports.enter = exports.end = exports.start = exports.move = void 0;
var _renderer = _interopRequireDefault(__webpack_require__(/*! ../core/renderer */ "./node_modules/devextreme/core/renderer.js"));
var _element_data = __webpack_require__(/*! ../core/element_data */ "./node_modules/devextreme/core/element_data.js");
var _array = __webpack_require__(/*! ../core/utils/array */ "./node_modules/devextreme/core/utils/array.js");
var iteratorUtils = _interopRequireWildcard(__webpack_require__(/*! ../core/utils/iterator */ "./node_modules/devextreme/core/utils/iterator.js"));
var _dom = __webpack_require__(/*! ../core/utils/dom */ "./node_modules/devextreme/core/utils/dom.js");
var _event_registrator = _interopRequireDefault(__webpack_require__(/*! ./core/event_registrator */ "./node_modules/devextreme/events/core/event_registrator.js"));
var _index = __webpack_require__(/*! ./utils/index */ "./node_modules/devextreme/events/utils/index.js");
var _emitter = _interopRequireDefault(__webpack_require__(/*! ./gesture/emitter.gesture */ "./node_modules/devextreme/events/gesture/emitter.gesture.js"));
var _emitter_registrator = _interopRequireDefault(__webpack_require__(/*! ./core/emitter_registrator */ "./node_modules/devextreme/events/core/emitter_registrator.js"));

function _getRequireWildcardCache() {
    if ("function" !== typeof WeakMap) {
        return null
    }
    var cache = new WeakMap;
    _getRequireWildcardCache = function() {
        return cache
    };
    return cache
}

function _interopRequireWildcard(obj) {
    if (obj && obj.__esModule) {
        return obj
    }
    if (null === obj || "object" !== _typeof(obj) && "function" !== typeof obj) {
        return {
            "default": obj
        }
    }
    var cache = _getRequireWildcardCache();
    if (cache && cache.has(obj)) {
        return cache.get(obj)
    }
    var newObj = {};
    var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor;
    for (var key in obj) {
        if (Object.prototype.hasOwnProperty.call(obj, key)) {
            var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null;
            if (desc && (desc.get || desc.set)) {
                Object.defineProperty(newObj, key, desc)
            } else {
                newObj[key] = obj[key]
            }
        }
    }
    newObj.default = obj;
    if (cache) {
        cache.set(obj, newObj)
    }
    return newObj
}

function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
        "default": obj
    }
}
var DRAG_START_EVENT = "dxdragstart";
exports.start = DRAG_START_EVENT;
var DRAG_EVENT = "dxdrag";
exports.move = DRAG_EVENT;
var DRAG_END_EVENT = "dxdragend";
exports.end = DRAG_END_EVENT;
var DRAG_ENTER_EVENT = "dxdragenter";
exports.enter = DRAG_ENTER_EVENT;
var DRAG_LEAVE_EVENT = "dxdragleave";
exports.leave = DRAG_LEAVE_EVENT;
var DROP_EVENT = "dxdrop";
exports.drop = DROP_EVENT;
var DX_DRAG_EVENTS_COUNT_KEY = "dxDragEventsCount";
var knownDropTargets = [];
var knownDropTargetSelectors = [];
var knownDropTargetConfigs = [];
var dropTargetRegistration = {
    setup: function(element, data) {
        var knownDropTarget = (0, _array.inArray)(element, knownDropTargets) !== -1;
        if (!knownDropTarget) {
            knownDropTargets.push(element);
            knownDropTargetSelectors.push([]);
            knownDropTargetConfigs.push(data || {})
        }
    },
    add: function(element, handleObj) {
        var index = (0, _array.inArray)(element, knownDropTargets);
        this.updateEventsCounter(element, handleObj.type, 1);
        var selector = handleObj.selector;
        if ((0, _array.inArray)(selector, knownDropTargetSelectors[index]) === -1) {
            knownDropTargetSelectors[index].push(selector)
        }
    },
    updateEventsCounter: function(element, event, value) {
        if ([DRAG_ENTER_EVENT, DRAG_LEAVE_EVENT, DROP_EVENT].indexOf(event) > -1) {
            var eventsCount = (0, _element_data.data)(element, DX_DRAG_EVENTS_COUNT_KEY) || 0;
            (0, _element_data.data)(element, DX_DRAG_EVENTS_COUNT_KEY, Math.max(0, eventsCount + value))
        }
    },
    remove: function(element, handleObj) {
        this.updateEventsCounter(element, handleObj.type, -1)
    },
    teardown: function(element) {
        var handlersCount = (0, _element_data.data)(element, DX_DRAG_EVENTS_COUNT_KEY);
        if (!handlersCount) {
            var index = (0, _array.inArray)(element, knownDropTargets);
            knownDropTargets.splice(index, 1);
            knownDropTargetSelectors.splice(index, 1);
            knownDropTargetConfigs.splice(index, 1);
            (0, _element_data.removeData)(element, DX_DRAG_EVENTS_COUNT_KEY)
        }
    }
};
(0, _event_registrator.default)(DRAG_ENTER_EVENT, dropTargetRegistration);
(0, _event_registrator.default)(DRAG_LEAVE_EVENT, dropTargetRegistration);
(0, _event_registrator.default)(DROP_EVENT, dropTargetRegistration);
var getItemDelegatedTargets = function($element) {
    var dropTargetIndex = (0, _array.inArray)($element.get(0), knownDropTargets);
    var dropTargetSelectors = knownDropTargetSelectors[dropTargetIndex].filter(function(selector) {
        return selector
    });
    var $delegatedTargets = $element.find(dropTargetSelectors.join(", "));
    if ((0, _array.inArray)(void 0, knownDropTargetSelectors[dropTargetIndex]) !== -1) {
        $delegatedTargets = $delegatedTargets.add($element)
    }
    return $delegatedTargets
};
var getItemConfig = function($element) {
    var dropTargetIndex = (0, _array.inArray)($element.get(0), knownDropTargets);
    return knownDropTargetConfigs[dropTargetIndex]
};
var getItemPosition = function(dropTargetConfig, $element) {
    if (dropTargetConfig.itemPositionFunc) {
        return dropTargetConfig.itemPositionFunc($element)
    } else {
        return $element.offset()
    }
};
var getItemSize = function(dropTargetConfig, $element) {
    if (dropTargetConfig.itemSizeFunc) {
        return dropTargetConfig.itemSizeFunc($element)
    }
    return {
        width: $element.get(0).getBoundingClientRect().width,
        height: $element.get(0).getBoundingClientRect().height
    }
};
var DragEmitter = _emitter.default.inherit({
    ctor: function(element) {
        this.callBase(element);
        this.direction = "both"
    },
    _init: function(e) {
        this._initEvent = e
    },
    _start: function(e) {
        e = this._fireEvent(DRAG_START_EVENT, this._initEvent);
        this._maxLeftOffset = e.maxLeftOffset;
        this._maxRightOffset = e.maxRightOffset;
        this._maxTopOffset = e.maxTopOffset;
        this._maxBottomOffset = e.maxBottomOffset;
        var dropTargets = (0, _array.wrapToArray)(e.targetElements || (null === e.targetElements ? [] : knownDropTargets));
        this._dropTargets = iteratorUtils.map(dropTargets, function(element) {
            return (0, _renderer.default)(element).get(0)
        })
    },
    _move: function(e) {
        var eventData = (0, _index.eventData)(e);
        var dragOffset = this._calculateOffset(eventData);
        e = this._fireEvent(DRAG_EVENT, e, {
            offset: dragOffset
        });
        this._processDropTargets(e);
        if (!e._cancelPreventDefault) {
            e.preventDefault()
        }
    },
    _calculateOffset: function(eventData) {
        return {
            x: this._calculateXOffset(eventData),
            y: this._calculateYOffset(eventData)
        }
    },
    _calculateXOffset: function(eventData) {
        if ("vertical" !== this.direction) {
            var offset = eventData.x - this._startEventData.x;
            return this._fitOffset(offset, this._maxLeftOffset, this._maxRightOffset)
        }
        return 0
    },
    _calculateYOffset: function(eventData) {
        if ("horizontal" !== this.direction) {
            var offset = eventData.y - this._startEventData.y;
            return this._fitOffset(offset, this._maxTopOffset, this._maxBottomOffset)
        }
        return 0
    },
    _fitOffset: function(offset, minOffset, maxOffset) {
        if (null != minOffset) {
            offset = Math.max(offset, -minOffset)
        }
        if (null != maxOffset) {
            offset = Math.min(offset, maxOffset)
        }
        return offset
    },
    _processDropTargets: function(e) {
        var target = this._findDropTarget(e);
        var sameTarget = target === this._currentDropTarget;
        if (!sameTarget) {
            this._fireDropTargetEvent(e, DRAG_LEAVE_EVENT);
            this._currentDropTarget = target;
            this._fireDropTargetEvent(e, DRAG_ENTER_EVENT)
        }
    },
    _fireDropTargetEvent: function(event, eventName) {
        if (!this._currentDropTarget) {
            return
        }
        var eventData = {
            type: eventName,
            originalEvent: event,
            draggingElement: this._$element.get(0),
            target: this._currentDropTarget
        };
        (0, _index.fireEvent)(eventData)
    },
    _findDropTarget: function(e) {
        var that = this;
        var result;
        iteratorUtils.each(knownDropTargets, function(_, target) {
            if (!that._checkDropTargetActive(target)) {
                return
            }
            var $target = (0, _renderer.default)(target);
            iteratorUtils.each(getItemDelegatedTargets($target), function(_, delegatedTarget) {
                var $delegatedTarget = (0, _renderer.default)(delegatedTarget);
                if (that._checkDropTarget(getItemConfig($target), $delegatedTarget, (0, _renderer.default)(result), e)) {
                    result = delegatedTarget
                }
            })
        });
        return result
    },
    _checkDropTargetActive: function(target) {
        var active = false;
        iteratorUtils.each(this._dropTargets, function(_, activeTarget) {
            active = active || activeTarget === target || (0, _dom.contains)(activeTarget, target);
            return !active
        });
        return active
    },
    _checkDropTarget: function(config, $target, $prevTarget, e) {
        var isDraggingElement = $target.get(0) === (0, _renderer.default)(e.target).get(0);
        if (isDraggingElement) {
            return false
        }
        var targetPosition = getItemPosition(config, $target);
        if (e.pageX < targetPosition.left) {
            return false
        }
        if (e.pageY < targetPosition.top) {
            return false
        }
        var targetSize = getItemSize(config, $target);
        if (e.pageX > targetPosition.left + targetSize.width) {
            return false
        }
        if (e.pageY > targetPosition.top + targetSize.height) {
            return false
        }
        if ($prevTarget.length && $prevTarget.closest($target).length) {
            return false
        }
        if (config.checkDropTarget && !config.checkDropTarget($target, e)) {
            return false
        }
        return $target
    },
    _end: function(e) {
        var eventData = (0, _index.eventData)(e);
        this._fireEvent(DRAG_END_EVENT, e, {
            offset: this._calculateOffset(eventData)
        });
        this._fireDropTargetEvent(e, DROP_EVENT);
        delete this._currentDropTarget
    }
});
(0, _emitter_registrator.default)({
    emitter: DragEmitter,
    events: [DRAG_START_EVENT, DRAG_EVENT, DRAG_END_EVENT]
});


/***/ }),

/***/ "./node_modules/devextreme/events/gesture/emitter.gesture.js":
/*!*******************************************************************!*\
  !*** ./node_modules/devextreme/events/gesture/emitter.gesture.js ***!
  \*******************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/**
 * DevExtreme (events/gesture/emitter.gesture.js)
 * Version: 20.2.3
 * Build date: Tue Oct 20 2020
 *
 * Copyright (c) 2012 - 2020 Developer Express Inc. ALL RIGHTS RESERVED
 * Read about DevExtreme licensing here: https://js.devexpress.com/Licensing/
 */

exports.default = void 0;
var _renderer = _interopRequireDefault(__webpack_require__(/*! ../../core/renderer */ "./node_modules/devextreme/core/renderer.js"));
var _events_engine = _interopRequireDefault(__webpack_require__(/*! ../../events/core/events_engine */ "./node_modules/devextreme/events/core/events_engine.js"));
var _devices = _interopRequireDefault(__webpack_require__(/*! ../../core/devices */ "./node_modules/devextreme/core/devices.js"));
var _style = __webpack_require__(/*! ../../core/utils/style */ "./node_modules/devextreme/core/utils/style.js");
var _call_once = _interopRequireDefault(__webpack_require__(/*! ../../core/utils/call_once */ "./node_modules/devextreme/core/utils/call_once.js"));
var _dom = __webpack_require__(/*! ../../core/utils/dom */ "./node_modules/devextreme/core/utils/dom.js");
var _ready_callbacks = _interopRequireDefault(__webpack_require__(/*! ../../core/utils/ready_callbacks */ "./node_modules/devextreme/core/utils/ready_callbacks.js"));
var _math = __webpack_require__(/*! ../../core/utils/math */ "./node_modules/devextreme/core/utils/math.js");
var _common = __webpack_require__(/*! ../../core/utils/common */ "./node_modules/devextreme/core/utils/common.js");
var _type = __webpack_require__(/*! ../../core/utils/type */ "./node_modules/devextreme/core/utils/type.js");
var _index = __webpack_require__(/*! ../utils/index */ "./node_modules/devextreme/events/utils/index.js");
var _emitter = _interopRequireDefault(__webpack_require__(/*! ../core/emitter */ "./node_modules/devextreme/events/core/emitter.js"));

function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
        "default": obj
    }
}
var ready = _ready_callbacks.default.add;
var abs = Math.abs;
var SLEEP = 0;
var INITED = 1;
var STARTED = 2;
var TOUCH_BOUNDARY = 10;
var IMMEDIATE_TOUCH_BOUNDARY = 0;
var IMMEDIATE_TIMEOUT = 180;
var supportPointerEvents = function() {
    return (0, _style.styleProp)("pointer-events")
};
var setGestureCover = (0, _call_once.default)(function() {
    var GESTURE_COVER_CLASS = "dx-gesture-cover";
    var isDesktop = "desktop" === _devices.default.real().deviceType;
    if (!supportPointerEvents() || !isDesktop) {
        return _common.noop
    }
    var $cover = (0, _renderer.default)("<div>").addClass(GESTURE_COVER_CLASS).css("pointerEvents", "none");
    _events_engine.default.subscribeGlobal($cover, "dxmousewheel", function(e) {
        e.preventDefault()
    });
    ready(function() {
        $cover.appendTo("body")
    });
    return function(toggle, cursor) {
        $cover.css("pointerEvents", toggle ? "all" : "none");
        toggle && $cover.css("cursor", cursor)
    }
});
var gestureCover = function(toggle, cursor) {
    var gestureCoverStrategy = setGestureCover();
    gestureCoverStrategy(toggle, cursor)
};
var GestureEmitter = _emitter.default.inherit({
    gesture: true,
    configure: function(data) {
        this.getElement().css("msTouchAction", data.immediate ? "pinch-zoom" : "");
        this.callBase(data)
    },
    allowInterruptionByMouseWheel: function() {
        return this._stage !== STARTED
    },
    getDirection: function() {
        return this.direction
    },
    _cancel: function() {
        this.callBase.apply(this, arguments);
        this._toggleGestureCover(false);
        this._stage = SLEEP
    },
    start: function(e) {
        if (e._needSkipEvent || (0, _index.needSkipEvent)(e)) {
            this._cancel(e);
            return
        }
        this._startEvent = (0, _index.createEvent)(e);
        this._startEventData = (0, _index.eventData)(e);
        this._stage = INITED;
        this._init(e);
        this._setupImmediateTimer()
    },
    _setupImmediateTimer: function() {
        clearTimeout(this._immediateTimer);
        this._immediateAccepted = false;
        if (!this.immediate) {
            return
        }
        this._immediateTimer = setTimeout(function() {
            this._immediateAccepted = true
        }.bind(this), IMMEDIATE_TIMEOUT)
    },
    move: function(e) {
        if (this._stage === INITED && this._directionConfirmed(e)) {
            this._stage = STARTED;
            this._resetActiveElement();
            this._toggleGestureCover(true);
            this._clearSelection(e);
            this._adjustStartEvent(e);
            this._start(this._startEvent);
            if (this._stage === SLEEP) {
                return
            }
            this._requestAccept(e);
            this._move(e);
            this._forgetAccept()
        } else {
            if (this._stage === STARTED) {
                this._clearSelection(e);
                this._move(e)
            }
        }
    },
    _directionConfirmed: function(e) {
        var touchBoundary = this._getTouchBoundary(e);
        var delta = (0, _index.eventDelta)(this._startEventData, (0, _index.eventData)(e));
        var deltaX = abs(delta.x);
        var deltaY = abs(delta.y);
        var horizontalMove = this._validateMove(touchBoundary, deltaX, deltaY);
        var verticalMove = this._validateMove(touchBoundary, deltaY, deltaX);
        var direction = this.getDirection(e);
        var bothAccepted = "both" === direction && (horizontalMove || verticalMove);
        var horizontalAccepted = "horizontal" === direction && horizontalMove;
        var verticalAccepted = "vertical" === direction && verticalMove;
        return bothAccepted || horizontalAccepted || verticalAccepted || this._immediateAccepted
    },
    _validateMove: function(touchBoundary, mainAxis, crossAxis) {
        return mainAxis && mainAxis >= touchBoundary && (this.immediate ? mainAxis >= crossAxis : true)
    },
    _getTouchBoundary: function(e) {
        return this.immediate || (0, _index.isDxMouseWheelEvent)(e) ? IMMEDIATE_TOUCH_BOUNDARY : TOUCH_BOUNDARY
    },
    _adjustStartEvent: function(e) {
        var touchBoundary = this._getTouchBoundary(e);
        var delta = (0, _index.eventDelta)(this._startEventData, (0, _index.eventData)(e));
        this._startEvent.pageX += (0, _math.sign)(delta.x) * touchBoundary;
        this._startEvent.pageY += (0, _math.sign)(delta.y) * touchBoundary
    },
    _resetActiveElement: function() {
        if ("ios" === _devices.default.real().platform && this.getElement().find(":focus").length) {
            (0, _dom.resetActiveElement)()
        }
    },
    _toggleGestureCover: function(toggle) {
        this._toggleGestureCoverImpl(toggle)
    },
    _toggleGestureCoverImpl: function(toggle) {
        var isStarted = this._stage === STARTED;
        if (isStarted) {
            gestureCover(toggle, this.getElement().css("cursor"))
        }
    },
    _clearSelection: function(e) {
        if ((0, _index.isDxMouseWheelEvent)(e) || (0, _index.isTouchEvent)(e)) {
            return
        }(0, _dom.clearSelection)()
    },
    end: function(e) {
        this._toggleGestureCover(false);
        if (this._stage === STARTED) {
            this._end(e)
        } else {
            if (this._stage === INITED) {
                this._stop(e)
            }
        }
        this._stage = SLEEP
    },
    dispose: function() {
        clearTimeout(this._immediateTimer);
        this.callBase.apply(this, arguments);
        this._toggleGestureCover(false)
    },
    _init: _common.noop,
    _start: _common.noop,
    _move: _common.noop,
    _stop: _common.noop,
    _end: _common.noop
});
GestureEmitter.initialTouchBoundary = TOUCH_BOUNDARY;
GestureEmitter.touchBoundary = function(newBoundary) {
    if ((0, _type.isDefined)(newBoundary)) {
        TOUCH_BOUNDARY = newBoundary;
        return
    }
    return TOUCH_BOUNDARY
};
var _default = GestureEmitter;
exports.default = _default;
module.exports = exports.default;


/***/ }),

/***/ "./node_modules/devextreme/events/hover.js":
/*!*************************************************!*\
  !*** ./node_modules/devextreme/events/hover.js ***!
  \*************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/**
 * DevExtreme (events/hover.js)
 * Version: 20.2.3
 * Build date: Tue Oct 20 2020
 *
 * Copyright (c) 2012 - 2020 Developer Express Inc. ALL RIGHTS RESERVED
 * Read about DevExtreme licensing here: https://js.devexpress.com/Licensing/
 */

exports.end = exports.start = void 0;
var _events_engine = _interopRequireDefault(__webpack_require__(/*! ../events/core/events_engine */ "./node_modules/devextreme/events/core/events_engine.js"));
var _element_data = __webpack_require__(/*! ../core/element_data */ "./node_modules/devextreme/core/element_data.js");
var _class = _interopRequireDefault(__webpack_require__(/*! ../core/class */ "./node_modules/devextreme/core/class.js"));
var _devices = _interopRequireDefault(__webpack_require__(/*! ../core/devices */ "./node_modules/devextreme/core/devices.js"));
var _event_registrator = _interopRequireDefault(__webpack_require__(/*! ./core/event_registrator */ "./node_modules/devextreme/events/core/event_registrator.js"));
var _index = __webpack_require__(/*! ./utils/index */ "./node_modules/devextreme/events/utils/index.js");
var _pointer = _interopRequireDefault(__webpack_require__(/*! ./pointer */ "./node_modules/devextreme/events/pointer.js"));

function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
        "default": obj
    }
}
var HOVERSTART_NAMESPACE = "dxHoverStart";
var HOVERSTART = "dxhoverstart";
exports.start = HOVERSTART;
var POINTERENTER_NAMESPACED_EVENT_NAME = (0, _index.addNamespace)(_pointer.default.enter, HOVERSTART_NAMESPACE);
var HOVEREND_NAMESPACE = "dxHoverEnd";
var HOVEREND = "dxhoverend";
exports.end = HOVEREND;
var POINTERLEAVE_NAMESPACED_EVENT_NAME = (0, _index.addNamespace)(_pointer.default.leave, HOVEREND_NAMESPACE);
var Hover = _class.default.inherit({
    noBubble: true,
    ctor: function() {
        this._handlerArrayKeyPath = this._eventNamespace + "_HandlerStore"
    },
    setup: function(element) {
        (0, _element_data.data)(element, this._handlerArrayKeyPath, {})
    },
    add: function(element, handleObj) {
        var that = this;
        var handler = function(e) {
            that._handler(e)
        };
        _events_engine.default.on(element, this._originalEventName, handleObj.selector, handler);
        (0, _element_data.data)(element, this._handlerArrayKeyPath)[handleObj.guid] = handler
    },
    _handler: function(e) {
        if ((0, _index.isTouchEvent)(e) || _devices.default.isSimulator()) {
            return
        }(0, _index.fireEvent)({
            type: this._eventName,
            originalEvent: e,
            delegateTarget: e.delegateTarget
        })
    },
    remove: function(element, handleObj) {
        var handler = (0, _element_data.data)(element, this._handlerArrayKeyPath)[handleObj.guid];
        _events_engine.default.off(element, this._originalEventName, handleObj.selector, handler)
    },
    teardown: function(element) {
        (0, _element_data.removeData)(element, this._handlerArrayKeyPath)
    }
});
var HoverStart = Hover.inherit({
    ctor: function() {
        this._eventNamespace = HOVERSTART_NAMESPACE;
        this._eventName = HOVERSTART;
        this._originalEventName = POINTERENTER_NAMESPACED_EVENT_NAME;
        this.callBase()
    },
    _handler: function(e) {
        var pointers = e.pointers || [];
        if (!pointers.length) {
            this.callBase(e)
        }
    }
});
var HoverEnd = Hover.inherit({
    ctor: function() {
        this._eventNamespace = HOVEREND_NAMESPACE;
        this._eventName = HOVEREND;
        this._originalEventName = POINTERLEAVE_NAMESPACED_EVENT_NAME;
        this.callBase()
    }
});
(0, _event_registrator.default)(HOVERSTART, new HoverStart);
(0, _event_registrator.default)(HOVEREND, new HoverEnd);


/***/ }),

/***/ "./node_modules/devextreme/events/pointer.js":
/*!***************************************************!*\
  !*** ./node_modules/devextreme/events/pointer.js ***!
  \***************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/**
 * DevExtreme (events/pointer.js)
 * Version: 20.2.3
 * Build date: Tue Oct 20 2020
 *
 * Copyright (c) 2012 - 2020 Developer Express Inc. ALL RIGHTS RESERVED
 * Read about DevExtreme licensing here: https://js.devexpress.com/Licensing/
 */


function _typeof(obj) {
    "@babel/helpers - typeof";
    if ("function" === typeof Symbol && "symbol" === typeof Symbol.iterator) {
        _typeof = function(obj) {
            return typeof obj
        }
    } else {
        _typeof = function(obj) {
            return obj && "function" === typeof Symbol && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj
        }
    }
    return _typeof(obj)
}
exports.default = void 0;
var support = _interopRequireWildcard(__webpack_require__(/*! ../core/utils/support */ "./node_modules/devextreme/core/utils/support.js"));
var _iterator = __webpack_require__(/*! ../core/utils/iterator */ "./node_modules/devextreme/core/utils/iterator.js");
var _browser = _interopRequireDefault(__webpack_require__(/*! ../core/utils/browser */ "./node_modules/devextreme/core/utils/browser.js"));
var _devices = _interopRequireDefault(__webpack_require__(/*! ../core/devices */ "./node_modules/devextreme/core/devices.js"));
var _event_registrator = _interopRequireDefault(__webpack_require__(/*! ./core/event_registrator */ "./node_modules/devextreme/events/core/event_registrator.js"));
var _touch = _interopRequireDefault(__webpack_require__(/*! ./pointer/touch */ "./node_modules/devextreme/events/pointer/touch.js"));
var _mspointer = _interopRequireDefault(__webpack_require__(/*! ./pointer/mspointer */ "./node_modules/devextreme/events/pointer/mspointer.js"));
var _mouse = _interopRequireDefault(__webpack_require__(/*! ./pointer/mouse */ "./node_modules/devextreme/events/pointer/mouse.js"));
var _mouse_and_touch = _interopRequireDefault(__webpack_require__(/*! ./pointer/mouse_and_touch */ "./node_modules/devextreme/events/pointer/mouse_and_touch.js"));

function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
        "default": obj
    }
}

function _getRequireWildcardCache() {
    if ("function" !== typeof WeakMap) {
        return null
    }
    var cache = new WeakMap;
    _getRequireWildcardCache = function() {
        return cache
    };
    return cache
}

function _interopRequireWildcard(obj) {
    if (obj && obj.__esModule) {
        return obj
    }
    if (null === obj || "object" !== _typeof(obj) && "function" !== typeof obj) {
        return {
            "default": obj
        }
    }
    var cache = _getRequireWildcardCache();
    if (cache && cache.has(obj)) {
        return cache.get(obj)
    }
    var newObj = {};
    var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor;
    for (var key in obj) {
        if (Object.prototype.hasOwnProperty.call(obj, key)) {
            var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null;
            if (desc && (desc.get || desc.set)) {
                Object.defineProperty(newObj, key, desc)
            } else {
                newObj[key] = obj[key]
            }
        }
    }
    newObj.default = obj;
    if (cache) {
        cache.set(obj, newObj)
    }
    return newObj
}
var getStrategy = function(support, device, browser) {
    if (support.pointerEvents && browser.msie) {
        return _mspointer.default
    }
    var tablet = device.tablet,
        phone = device.phone;
    if (support.touch && !(tablet || phone)) {
        return _mouse_and_touch.default
    }
    if (support.touch) {
        return _touch.default
    }
    return _mouse.default
};
var EventStrategy = getStrategy(support, _devices.default.real(), _browser.default);
(0, _iterator.each)(EventStrategy.map, function(pointerEvent, originalEvents) {
    (0, _event_registrator.default)(pointerEvent, new EventStrategy(pointerEvent, originalEvents))
});
var pointer = {
    down: "dxpointerdown",
    up: "dxpointerup",
    move: "dxpointermove",
    cancel: "dxpointercancel",
    enter: "dxpointerenter",
    leave: "dxpointerleave",
    over: "dxpointerover",
    out: "dxpointerout"
};
var _default = pointer;
exports.default = _default;
module.exports = exports.default;


/***/ }),

/***/ "./node_modules/devextreme/events/pointer/base.js":
/*!********************************************************!*\
  !*** ./node_modules/devextreme/events/pointer/base.js ***!
  \********************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/**
 * DevExtreme (events/pointer/base.js)
 * Version: 20.2.3
 * Build date: Tue Oct 20 2020
 *
 * Copyright (c) 2012 - 2020 Developer Express Inc. ALL RIGHTS RESERVED
 * Read about DevExtreme licensing here: https://js.devexpress.com/Licensing/
 */

exports.default = void 0;
var _events_engine = _interopRequireDefault(__webpack_require__(/*! ../../events/core/events_engine */ "./node_modules/devextreme/events/core/events_engine.js"));
var _browser = _interopRequireDefault(__webpack_require__(/*! ../../core/utils/browser */ "./node_modules/devextreme/core/utils/browser.js"));
var _dom_adapter = _interopRequireDefault(__webpack_require__(/*! ../../core/dom_adapter */ "./node_modules/devextreme/core/dom_adapter.js"));
var _class = _interopRequireDefault(__webpack_require__(/*! ../../core/class */ "./node_modules/devextreme/core/class.js"));
var _index = __webpack_require__(/*! ../utils/index */ "./node_modules/devextreme/events/utils/index.js");

function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
        "default": obj
    }
}
var POINTER_EVENTS_NAMESPACE = "dxPointerEvents";
var BaseStrategy = _class.default.inherit({
    ctor: function(eventName, originalEvents) {
        this._eventName = eventName;
        this._originalEvents = (0, _index.addNamespace)(originalEvents, POINTER_EVENTS_NAMESPACE);
        this._handlerCount = 0;
        this.noBubble = this._isNoBubble()
    },
    _isNoBubble: function() {
        var eventName = this._eventName;
        return "dxpointerenter" === eventName || "dxpointerleave" === eventName
    },
    _handler: function(e) {
        var delegateTarget = this._getDelegateTarget(e);
        return this._fireEvent({
            type: this._eventName,
            pointerType: e.pointerType || (0, _index.eventSource)(e),
            originalEvent: e,
            delegateTarget: delegateTarget,
            timeStamp: _browser.default.mozilla ? (new Date).getTime() : e.timeStamp
        })
    },
    _getDelegateTarget: function(e) {
        var delegateTarget;
        if (this.noBubble) {
            delegateTarget = e.delegateTarget
        }
        return delegateTarget
    },
    _fireEvent: function(args) {
        return (0, _index.fireEvent)(args)
    },
    _setSelector: function(handleObj) {
        this._selector = this.noBubble && handleObj ? handleObj.selector : null
    },
    _getSelector: function() {
        return this._selector
    },
    setup: function() {
        return true
    },
    add: function(element, handleObj) {
        if (this._handlerCount <= 0 || this.noBubble) {
            element = this.noBubble ? element : _dom_adapter.default.getDocument();
            this._setSelector(handleObj);
            var that = this;
            _events_engine.default.on(element, this._originalEvents, this._getSelector(), function(e) {
                that._handler(e)
            })
        }
        if (!this.noBubble) {
            this._handlerCount++
        }
    },
    remove: function(handleObj) {
        this._setSelector(handleObj);
        if (!this.noBubble) {
            this._handlerCount--
        }
    },
    teardown: function(element) {
        if (this._handlerCount && !this.noBubble) {
            return
        }
        element = this.noBubble ? element : _dom_adapter.default.getDocument();
        if (this._originalEvents !== "." + POINTER_EVENTS_NAMESPACE) {
            _events_engine.default.off(element, this._originalEvents, this._getSelector())
        }
    },
    dispose: function(element) {
        element = this.noBubble ? element : _dom_adapter.default.getDocument();
        _events_engine.default.off(element, this._originalEvents)
    }
});
var _default = BaseStrategy;
exports.default = _default;
module.exports = exports.default;


/***/ }),

/***/ "./node_modules/devextreme/events/pointer/mouse.js":
/*!*********************************************************!*\
  !*** ./node_modules/devextreme/events/pointer/mouse.js ***!
  \*********************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/**
 * DevExtreme (events/pointer/mouse.js)
 * Version: 20.2.3
 * Build date: Tue Oct 20 2020
 *
 * Copyright (c) 2012 - 2020 Developer Express Inc. ALL RIGHTS RESERVED
 * Read about DevExtreme licensing here: https://js.devexpress.com/Licensing/
 */

exports.default = void 0;
var _extend = __webpack_require__(/*! ../../core/utils/extend */ "./node_modules/devextreme/core/utils/extend.js");
var _base = _interopRequireDefault(__webpack_require__(/*! ./base */ "./node_modules/devextreme/events/pointer/base.js"));
var _observer = _interopRequireDefault(__webpack_require__(/*! ./observer */ "./node_modules/devextreme/events/pointer/observer.js"));

function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
        "default": obj
    }
}
var eventMap = {
    dxpointerdown: "mousedown",
    dxpointermove: "mousemove",
    dxpointerup: "mouseup",
    dxpointercancel: "",
    dxpointerover: "mouseover",
    dxpointerout: "mouseout",
    dxpointerenter: "mouseenter",
    dxpointerleave: "mouseleave"
};
var normalizeMouseEvent = function(e) {
    e.pointerId = 1;
    return {
        pointers: observer.pointers(),
        pointerId: 1
    }
};
var observer;
var activated = false;
var activateStrategy = function() {
    if (activated) {
        return
    }
    observer = new _observer.default(eventMap, function() {
        return true
    });
    activated = true
};
var MouseStrategy = _base.default.inherit({
    ctor: function() {
        this.callBase.apply(this, arguments);
        activateStrategy()
    },
    _fireEvent: function(args) {
        return this.callBase((0, _extend.extend)(normalizeMouseEvent(args.originalEvent), args))
    }
});
MouseStrategy.map = eventMap;
MouseStrategy.normalize = normalizeMouseEvent;
MouseStrategy.activate = activateStrategy;
MouseStrategy.resetObserver = function() {
    observer.reset()
};
var _default = MouseStrategy;
exports.default = _default;
module.exports = exports.default;


/***/ }),

/***/ "./node_modules/devextreme/events/pointer/mouse_and_touch.js":
/*!*******************************************************************!*\
  !*** ./node_modules/devextreme/events/pointer/mouse_and_touch.js ***!
  \*******************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/**
 * DevExtreme (events/pointer/mouse_and_touch.js)
 * Version: 20.2.3
 * Build date: Tue Oct 20 2020
 *
 * Copyright (c) 2012 - 2020 Developer Express Inc. ALL RIGHTS RESERVED
 * Read about DevExtreme licensing here: https://js.devexpress.com/Licensing/
 */

exports.default = void 0;
var _extend = __webpack_require__(/*! ../../core/utils/extend */ "./node_modules/devextreme/core/utils/extend.js");
var _base = _interopRequireDefault(__webpack_require__(/*! ./base */ "./node_modules/devextreme/events/pointer/base.js"));
var _mouse = _interopRequireDefault(__webpack_require__(/*! ./mouse */ "./node_modules/devextreme/events/pointer/mouse.js"));
var _touch = _interopRequireDefault(__webpack_require__(/*! ./touch */ "./node_modules/devextreme/events/pointer/touch.js"));
var _index = __webpack_require__(/*! ../utils/index */ "./node_modules/devextreme/events/utils/index.js");

function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
        "default": obj
    }
}
var eventMap = {
    dxpointerdown: "touchstart mousedown",
    dxpointermove: "touchmove mousemove",
    dxpointerup: "touchend mouseup",
    dxpointercancel: "touchcancel",
    dxpointerover: "mouseover",
    dxpointerout: "mouseout",
    dxpointerenter: "mouseenter",
    dxpointerleave: "mouseleave"
};
var activated = false;
var activateStrategy = function() {
    if (activated) {
        return
    }
    _mouse.default.activate();
    activated = true
};
var MouseAndTouchStrategy = _base.default.inherit({
    EVENT_LOCK_TIMEOUT: 100,
    ctor: function() {
        this.callBase.apply(this, arguments);
        activateStrategy()
    },
    _handler: function(e) {
        var isMouse = (0, _index.isMouseEvent)(e);
        if (!isMouse) {
            this._skipNextEvents = true
        }
        if (isMouse && this._mouseLocked) {
            return
        }
        if (isMouse && this._skipNextEvents) {
            this._skipNextEvents = false;
            this._mouseLocked = true;
            clearTimeout(this._unlockMouseTimer);
            var that = this;
            this._unlockMouseTimer = setTimeout(function() {
                that._mouseLocked = false
            }, this.EVENT_LOCK_TIMEOUT);
            return
        }
        return this.callBase(e)
    },
    _fireEvent: function(args) {
        var normalizer = (0, _index.isMouseEvent)(args.originalEvent) ? _mouse.default.normalize : _touch.default.normalize;
        return this.callBase((0, _extend.extend)(normalizer(args.originalEvent), args))
    },
    dispose: function() {
        this.callBase();
        this._skipNextEvents = false;
        this._mouseLocked = false;
        clearTimeout(this._unlockMouseTimer)
    }
});
MouseAndTouchStrategy.map = eventMap;
MouseAndTouchStrategy.resetObserver = _mouse.default.resetObserver;
var _default = MouseAndTouchStrategy;
exports.default = _default;
module.exports = exports.default;


/***/ }),

/***/ "./node_modules/devextreme/events/pointer/mspointer.js":
/*!*************************************************************!*\
  !*** ./node_modules/devextreme/events/pointer/mspointer.js ***!
  \*************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/**
 * DevExtreme (events/pointer/mspointer.js)
 * Version: 20.2.3
 * Build date: Tue Oct 20 2020
 *
 * Copyright (c) 2012 - 2020 Developer Express Inc. ALL RIGHTS RESERVED
 * Read about DevExtreme licensing here: https://js.devexpress.com/Licensing/
 */

exports.default = void 0;
var _base = _interopRequireDefault(__webpack_require__(/*! ./base */ "./node_modules/devextreme/events/pointer/base.js"));
var _observer = _interopRequireDefault(__webpack_require__(/*! ./observer */ "./node_modules/devextreme/events/pointer/observer.js"));
var _extend = __webpack_require__(/*! ../../core/utils/extend */ "./node_modules/devextreme/core/utils/extend.js");

function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
        "default": obj
    }
}
var eventMap = {
    dxpointerdown: "pointerdown",
    dxpointermove: "pointermove",
    dxpointerup: "pointerup",
    dxpointercancel: "pointercancel",
    dxpointerover: "pointerover",
    dxpointerout: "pointerout",
    dxpointerenter: "pointerenter",
    dxpointerleave: "pointerleave"
};
var observer;
var activated = false;
var activateStrategy = function() {
    if (activated) {
        return
    }
    observer = new _observer.default(eventMap, function(a, b) {
        return a.pointerId === b.pointerId
    }, function(e) {
        if (e.isPrimary) {
            observer.reset()
        }
    });
    activated = true
};
var MsPointerStrategy = _base.default.inherit({
    ctor: function() {
        this.callBase.apply(this, arguments);
        activateStrategy()
    },
    _fireEvent: function(args) {
        return this.callBase((0, _extend.extend)({
            pointers: observer.pointers(),
            pointerId: args.originalEvent.pointerId
        }, args))
    }
});
MsPointerStrategy.map = eventMap;
MsPointerStrategy.resetObserver = function() {
    observer.reset()
};
var _default = MsPointerStrategy;
exports.default = _default;
module.exports = exports.default;


/***/ }),

/***/ "./node_modules/devextreme/events/pointer/observer.js":
/*!************************************************************!*\
  !*** ./node_modules/devextreme/events/pointer/observer.js ***!
  \************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/**
 * DevExtreme (events/pointer/observer.js)
 * Version: 20.2.3
 * Build date: Tue Oct 20 2020
 *
 * Copyright (c) 2012 - 2020 Developer Express Inc. ALL RIGHTS RESERVED
 * Read about DevExtreme licensing here: https://js.devexpress.com/Licensing/
 */

exports.default = void 0;
var _iterator = __webpack_require__(/*! ../../core/utils/iterator */ "./node_modules/devextreme/core/utils/iterator.js");
var _ready_callbacks = _interopRequireDefault(__webpack_require__(/*! ../../core/utils/ready_callbacks */ "./node_modules/devextreme/core/utils/ready_callbacks.js"));
var _dom_adapter = _interopRequireDefault(__webpack_require__(/*! ../../core/dom_adapter */ "./node_modules/devextreme/core/dom_adapter.js"));

function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
        "default": obj
    }
}
var addEventsListener = function(events, handler) {
    _ready_callbacks.default.add(function() {
        events.split(" ").forEach(function(event) {
            _dom_adapter.default.listen(_dom_adapter.default.getDocument(), event, handler, true)
        })
    })
};
var Observer = function(eventMap, pointerEquals, onPointerAdding) {
    onPointerAdding = onPointerAdding || function() {};
    var pointers = [];
    var getPointerIndex = function(e) {
        var index = -1;
        (0, _iterator.each)(pointers, function(i, pointer) {
            if (!pointerEquals(e, pointer)) {
                return true
            }
            index = i;
            return false
        });
        return index
    };
    var addPointer = function(e) {
        if (getPointerIndex(e) === -1) {
            onPointerAdding(e);
            pointers.push(e)
        }
    };
    var removePointer = function(e) {
        var index = getPointerIndex(e);
        if (index > -1) {
            pointers.splice(index, 1)
        }
    };
    var updatePointer = function(e) {
        pointers[getPointerIndex(e)] = e
    };
    addEventsListener(eventMap.dxpointerdown, addPointer);
    addEventsListener(eventMap.dxpointermove, updatePointer);
    addEventsListener(eventMap.dxpointerup, removePointer);
    addEventsListener(eventMap.dxpointercancel, removePointer);
    this.pointers = function() {
        return pointers
    };
    this.reset = function() {
        pointers = []
    }
};
var _default = Observer;
exports.default = _default;
module.exports = exports.default;


/***/ }),

/***/ "./node_modules/devextreme/events/pointer/touch.js":
/*!*********************************************************!*\
  !*** ./node_modules/devextreme/events/pointer/touch.js ***!
  \*********************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/**
 * DevExtreme (events/pointer/touch.js)
 * Version: 20.2.3
 * Build date: Tue Oct 20 2020
 *
 * Copyright (c) 2012 - 2020 Developer Express Inc. ALL RIGHTS RESERVED
 * Read about DevExtreme licensing here: https://js.devexpress.com/Licensing/
 */

exports.default = void 0;
var _devices = _interopRequireDefault(__webpack_require__(/*! ../../core/devices */ "./node_modules/devextreme/core/devices.js"));
var _extend = __webpack_require__(/*! ../../core/utils/extend */ "./node_modules/devextreme/core/utils/extend.js");
var _iterator = __webpack_require__(/*! ../../core/utils/iterator */ "./node_modules/devextreme/core/utils/iterator.js");
var _base = _interopRequireDefault(__webpack_require__(/*! ./base */ "./node_modules/devextreme/events/pointer/base.js"));

function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
        "default": obj
    }
}
var eventMap = {
    dxpointerdown: "touchstart",
    dxpointermove: "touchmove",
    dxpointerup: "touchend",
    dxpointercancel: "touchcancel",
    dxpointerover: "",
    dxpointerout: "",
    dxpointerenter: "",
    dxpointerleave: ""
};
var normalizeTouchEvent = function(e) {
    var pointers = [];
    (0, _iterator.each)(e.touches, function(_, touch) {
        pointers.push((0, _extend.extend)({
            pointerId: touch.identifier
        }, touch))
    });
    return {
        pointers: pointers,
        pointerId: e.changedTouches[0].identifier
    }
};
var skipTouchWithSameIdentifier = function(pointerEvent) {
    return "ios" === _devices.default.real().platform && ("dxpointerdown" === pointerEvent || "dxpointerup" === pointerEvent)
};
var TouchStrategy = _base.default.inherit({
    ctor: function() {
        this.callBase.apply(this, arguments);
        this._pointerId = 0
    },
    _handler: function(e) {
        if (skipTouchWithSameIdentifier(this._eventName)) {
            var touch = e.changedTouches[0];
            if (this._pointerId === touch.identifier && 0 !== this._pointerId) {
                return
            }
            this._pointerId = touch.identifier
        }
        return this.callBase.apply(this, arguments)
    },
    _fireEvent: function(args) {
        return this.callBase((0, _extend.extend)(normalizeTouchEvent(args.originalEvent), args))
    }
});
TouchStrategy.map = eventMap;
TouchStrategy.normalize = normalizeTouchEvent;
var _default = TouchStrategy;
exports.default = _default;
module.exports = exports.default;


/***/ }),

/***/ "./node_modules/devextreme/events/short.js":
/*!*************************************************!*\
  !*** ./node_modules/devextreme/events/short.js ***!
  \*************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/**
 * DevExtreme (events/short.js)
 * Version: 20.2.3
 * Build date: Tue Oct 20 2020
 *
 * Copyright (c) 2012 - 2020 Developer Express Inc. ALL RIGHTS RESERVED
 * Read about DevExtreme licensing here: https://js.devexpress.com/Licensing/
 */

exports.keyboard = exports.click = exports.dxClick = exports.focus = exports.visibility = exports.hover = exports.resize = exports.active = void 0;
var _dom_adapter = _interopRequireDefault(__webpack_require__(/*! ../core/dom_adapter */ "./node_modules/devextreme/core/dom_adapter.js"));
var _events_engine = _interopRequireDefault(__webpack_require__(/*! ./core/events_engine */ "./node_modules/devextreme/events/core/events_engine.js"));
var _keyboard_processor = _interopRequireDefault(__webpack_require__(/*! ./core/keyboard_processor */ "./node_modules/devextreme/events/core/keyboard_processor.js"));
var _index = __webpack_require__(/*! ./utils/index */ "./node_modules/devextreme/events/utils/index.js");

function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
        "default": obj
    }
}

function addNamespace(event, namespace) {
    return namespace ? (0, _index.addNamespace)(event, namespace) : event
}

function executeAction(action, args) {
    return "function" === typeof action ? action(args) : action.execute(args)
}
var active = {
    on: function($el, active, inactive, opts) {
        var selector = opts.selector,
            showTimeout = opts.showTimeout,
            hideTimeout = opts.hideTimeout,
            namespace = opts.namespace;
        _events_engine.default.on($el, addNamespace("dxactive", namespace), selector, {
            timeout: showTimeout
        }, function(event) {
            return executeAction(active, {
                event: event,
                element: event.currentTarget
            })
        });
        _events_engine.default.on($el, addNamespace("dxinactive", namespace), selector, {
            timeout: hideTimeout
        }, function(event) {
            return executeAction(inactive, {
                event: event,
                element: event.currentTarget
            })
        })
    },
    off: function($el, _ref) {
        var namespace = _ref.namespace,
            selector = _ref.selector;
        _events_engine.default.off($el, addNamespace("dxactive", namespace), selector);
        _events_engine.default.off($el, addNamespace("dxinactive", namespace), selector)
    }
};
exports.active = active;
var resize = {
    on: function($el, resize) {
        var _ref2 = arguments.length > 2 && void 0 !== arguments[2] ? arguments[2] : {},
            namespace = _ref2.namespace;
        _events_engine.default.on($el, addNamespace("dxresize", namespace), resize)
    },
    off: function($el) {
        var _ref3 = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : {},
            namespace = _ref3.namespace;
        _events_engine.default.off($el, addNamespace("dxresize", namespace))
    }
};
exports.resize = resize;
var hover = {
    on: function($el, start, end, _ref4) {
        var selector = _ref4.selector,
            namespace = _ref4.namespace;
        _events_engine.default.on($el, addNamespace("dxhoverend", namespace), selector, function(event) {
            return end(event)
        });
        _events_engine.default.on($el, addNamespace("dxhoverstart", namespace), selector, function(event) {
            return executeAction(start, {
                element: event.target,
                event: event
            })
        })
    },
    off: function($el, _ref5) {
        var selector = _ref5.selector,
            namespace = _ref5.namespace;
        _events_engine.default.off($el, addNamespace("dxhoverstart", namespace), selector);
        _events_engine.default.off($el, addNamespace("dxhoverend", namespace), selector)
    }
};
exports.hover = hover;
var visibility = {
    on: function($el, shown, hiding, _ref6) {
        var namespace = _ref6.namespace;
        _events_engine.default.on($el, addNamespace("dxhiding", namespace), hiding);
        _events_engine.default.on($el, addNamespace("dxshown", namespace), shown)
    },
    off: function($el, _ref7) {
        var namespace = _ref7.namespace;
        _events_engine.default.off($el, addNamespace("dxhiding", namespace));
        _events_engine.default.off($el, addNamespace("dxshown", namespace))
    }
};
exports.visibility = visibility;
var focus = {
    on: function($el, focusIn, focusOut, _ref8) {
        var namespace = _ref8.namespace,
            isFocusable = _ref8.isFocusable;
        _events_engine.default.on($el, addNamespace("focusin", namespace), focusIn);
        _events_engine.default.on($el, addNamespace("focusout", namespace), focusOut);
        if (_dom_adapter.default.hasDocumentProperty("onbeforeactivate")) {
            _events_engine.default.on($el, addNamespace("beforeactivate", namespace), function(e) {
                return isFocusable(null, e.target) || e.preventDefault()
            })
        }
    },
    off: function($el, _ref9) {
        var namespace = _ref9.namespace;
        _events_engine.default.off($el, addNamespace("focusin", namespace));
        _events_engine.default.off($el, addNamespace("focusout", namespace));
        if (_dom_adapter.default.hasDocumentProperty("onbeforeactivate")) {
            _events_engine.default.off($el, addNamespace("beforeactivate", namespace))
        }
    },
    trigger: function($el) {
        return _events_engine.default.trigger($el, "focus")
    }
};
exports.focus = focus;
var dxClick = {
    on: function($el, click) {
        var _ref10 = arguments.length > 2 && void 0 !== arguments[2] ? arguments[2] : {},
            namespace = _ref10.namespace;
        _events_engine.default.on($el, addNamespace("dxclick", namespace), click)
    },
    off: function($el) {
        var _ref11 = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : {},
            namespace = _ref11.namespace;
        _events_engine.default.off($el, addNamespace("dxclick", namespace))
    }
};
exports.dxClick = dxClick;
var click = {
    on: function($el, click) {
        var _ref12 = arguments.length > 2 && void 0 !== arguments[2] ? arguments[2] : {},
            namespace = _ref12.namespace;
        _events_engine.default.on($el, addNamespace("click", namespace), click)
    },
    off: function($el) {
        var _ref13 = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : {},
            namespace = _ref13.namespace;
        _events_engine.default.off($el, addNamespace("click", namespace))
    }
};
exports.click = click;
var index = 0;
var keyboardProcessors = {};
var generateListenerId = function() {
    return "keyboardProcessorId".concat(index++)
};
var keyboard = {
    on: function(element, focusTarget, handler) {
        var listenerId = generateListenerId();
        keyboardProcessors[listenerId] = new _keyboard_processor.default({
            element: element,
            focusTarget: focusTarget,
            handler: handler
        });
        return listenerId
    },
    off: function(listenerId) {
        if (listenerId && keyboardProcessors[listenerId]) {
            keyboardProcessors[listenerId].dispose();
            delete keyboardProcessors[listenerId]
        }
    },
    _getProcessor: function(listenerId) {
        return keyboardProcessors[listenerId]
    }
};
exports.keyboard = keyboard;


/***/ }),

/***/ "./node_modules/devextreme/events/utils/add_namespace.js":
/*!***************************************************************!*\
  !*** ./node_modules/devextreme/events/utils/add_namespace.js ***!
  \***************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/**
 * DevExtreme (events/utils/add_namespace.js)
 * Version: 20.2.3
 * Build date: Tue Oct 20 2020
 *
 * Copyright (c) 2012 - 2020 Developer Express Inc. ALL RIGHTS RESERVED
 * Read about DevExtreme licensing here: https://js.devexpress.com/Licensing/
 */

exports.default = void 0;
var _errors = _interopRequireDefault(__webpack_require__(/*! ../../core/errors */ "./node_modules/devextreme/core/errors.js"));

function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
        "default": obj
    }
}
var addNamespace = function addNamespace(eventNames, namespace) {
    if (!namespace) {
        throw _errors.default.Error("E0017")
    }
    if (Array.isArray(eventNames)) {
        return eventNames.map(function(eventName) {
            return addNamespace(eventName, namespace)
        }).join(" ")
    }
    if (eventNames.indexOf(" ") !== -1) {
        return addNamespace(eventNames.split(/\s+/g), namespace)
    }
    return "".concat(eventNames, ".").concat(namespace)
};
var _default = addNamespace;
exports.default = _default;
module.exports = exports.default;


/***/ }),

/***/ "./node_modules/devextreme/events/utils/index.js":
/*!*******************************************************!*\
  !*** ./node_modules/devextreme/events/utils/index.js ***!
  \*******************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/**
 * DevExtreme (events/utils/index.js)
 * Version: 20.2.3
 * Build date: Tue Oct 20 2020
 *
 * Copyright (c) 2012 - 2020 Developer Express Inc. ALL RIGHTS RESERVED
 * Read about DevExtreme licensing here: https://js.devexpress.com/Licensing/
 */

exports.addNamespace = exports.getChar = exports.normalizeKeyName = exports.fireEvent = exports.createEvent = exports.setEventFixMethod = exports.needSkipEvent = exports.stopEventsSkipping = exports.forceSkipEvents = exports.hasTouches = exports.eventDelta = exports.eventData = exports.isFakeClickEvent = exports.isKeyboardEvent = exports.isTouchEvent = exports.isDxMouseWheelEvent = exports.isMouseEvent = exports.isPointerEvent = exports.eventSource = void 0;
var _renderer = _interopRequireDefault(__webpack_require__(/*! ../../core/renderer */ "./node_modules/devextreme/core/renderer.js"));
var _add_namespace = _interopRequireDefault(__webpack_require__(/*! ./add_namespace */ "./node_modules/devextreme/events/utils/add_namespace.js"));
var _events_engine = _interopRequireDefault(__webpack_require__(/*! ../core/events_engine */ "./node_modules/devextreme/events/core/events_engine.js"));
var _iterator = __webpack_require__(/*! ../../core/utils/iterator */ "./node_modules/devextreme/core/utils/iterator.js");
var _extend = __webpack_require__(/*! ../../core/utils/extend */ "./node_modules/devextreme/core/utils/extend.js");
var _selectors = __webpack_require__(/*! ../../ui/widget/selectors */ "./node_modules/devextreme/ui/widget/selectors.js");

function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
        "default": obj
    }
}
var KEY_MAP = {
    backspace: "backspace",
    tab: "tab",
    enter: "enter",
    escape: "escape",
    pageup: "pageUp",
    pagedown: "pageDown",
    end: "end",
    home: "home",
    arrowleft: "leftArrow",
    arrowup: "upArrow",
    arrowright: "rightArrow",
    arrowdown: "downArrow",
    "delete": "del",
    " ": "space",
    f: "F",
    a: "A",
    "*": "asterisk",
    "-": "minus",
    alt: "alt",
    control: "control",
    shift: "shift",
    left: "leftArrow",
    up: "upArrow",
    right: "rightArrow",
    down: "downArrow",
    multiply: "asterisk",
    spacebar: "space",
    del: "del",
    subtract: "minus",
    esc: "escape"
};
var LEGACY_KEY_CODES = {
    8: "backspace",
    9: "tab",
    13: "enter",
    27: "escape",
    33: "pageUp",
    34: "pageDown",
    35: "end",
    36: "home",
    37: "leftArrow",
    38: "upArrow",
    39: "rightArrow",
    40: "downArrow",
    46: "del",
    32: "space",
    70: "F",
    65: "A",
    106: "asterisk",
    109: "minus",
    189: "minus",
    173: "minus",
    16: "shift",
    17: "control",
    18: "alt"
};
var EVENT_SOURCES_REGEX = {
    dx: /^dx/i,
    mouse: /(mouse|wheel)/i,
    touch: /^touch/i,
    keyboard: /^key/i,
    pointer: /^(ms)?pointer/i
};
var fixMethod = function(e) {
    return e
};
var copyEvent = function(originalEvent) {
    return fixMethod(_events_engine.default.Event(originalEvent, originalEvent), originalEvent)
};
var isDxEvent = function(e) {
    return "dx" === eventSource(e)
};
var isNativeMouseEvent = function(e) {
    return "mouse" === eventSource(e)
};
var isNativeTouchEvent = function(e) {
    return "touch" === eventSource(e)
};
var eventSource = function(_ref) {
    var type = _ref.type;
    var result = "other";
    (0, _iterator.each)(EVENT_SOURCES_REGEX, function(key) {
        if (this.test(type)) {
            result = key;
            return false
        }
    });
    return result
};
exports.eventSource = eventSource;
var isPointerEvent = function(e) {
    return "pointer" === eventSource(e)
};
exports.isPointerEvent = isPointerEvent;
var isMouseEvent = function(e) {
    return isNativeMouseEvent(e) || (isPointerEvent(e) || isDxEvent(e)) && "mouse" === e.pointerType
};
exports.isMouseEvent = isMouseEvent;
var isDxMouseWheelEvent = function(e) {
    return e && "dxmousewheel" === e.type
};
exports.isDxMouseWheelEvent = isDxMouseWheelEvent;
var isTouchEvent = function(e) {
    return isNativeTouchEvent(e) || (isPointerEvent(e) || isDxEvent(e)) && "touch" === e.pointerType
};
exports.isTouchEvent = isTouchEvent;
var isKeyboardEvent = function(e) {
    return "keyboard" === eventSource(e)
};
exports.isKeyboardEvent = isKeyboardEvent;
var isFakeClickEvent = function(_ref2) {
    var screenX = _ref2.screenX,
        offsetX = _ref2.offsetX,
        pageX = _ref2.pageX;
    return 0 === screenX && !offsetX && 0 === pageX
};
exports.isFakeClickEvent = isFakeClickEvent;
var eventData = function(_ref3) {
    var pageX = _ref3.pageX,
        pageY = _ref3.pageY,
        timeStamp = _ref3.timeStamp;
    return {
        x: pageX,
        y: pageY,
        time: timeStamp
    }
};
exports.eventData = eventData;
var eventDelta = function(from, to) {
    return {
        x: to.x - from.x,
        y: to.y - from.y,
        time: to.time - from.time || 1
    }
};
exports.eventDelta = eventDelta;
var hasTouches = function(e) {
    var originalEvent = e.originalEvent,
        pointers = e.pointers;
    if (isNativeTouchEvent(e)) {
        return (originalEvent.touches || []).length
    }
    if (isDxEvent(e)) {
        return (pointers || []).length
    }
    return 0
};
exports.hasTouches = hasTouches;
var skipEvents = false;
var forceSkipEvents = function() {
    return skipEvents = true
};
exports.forceSkipEvents = forceSkipEvents;
var stopEventsSkipping = function() {
    return skipEvents = false
};
exports.stopEventsSkipping = stopEventsSkipping;
var needSkipEvent = function(e) {
    if (skipEvents) {
        return true
    }
    var target = e.target;
    var $target = (0, _renderer.default)(target);
    var touchInInput = $target.is("input, textarea, select");
    if ($target.is(".dx-skip-gesture-event *, .dx-skip-gesture-event")) {
        return true
    }
    if (isDxMouseWheelEvent(e)) {
        var isTextArea = $target.is("textarea") && $target.hasClass("dx-texteditor-input");
        if (isTextArea) {
            return false
        }
        var isContentEditable = target.isContentEditable || target.hasAttribute("contenteditable");
        if (isContentEditable) {
            return false
        }
        var isInputFocused = $target.is("input[type='number'], textarea, select") && $target.is(":focus");
        return isInputFocused
    }
    if (isMouseEvent(e)) {
        return touchInInput || e.which > 1
    }
    if (isTouchEvent(e)) {
        return touchInInput && (0, _selectors.focused)($target)
    }
};
exports.needSkipEvent = needSkipEvent;
var setEventFixMethod = function(func) {
    return fixMethod = func
};
exports.setEventFixMethod = setEventFixMethod;
var createEvent = function(originalEvent, args) {
    var event = copyEvent(originalEvent);
    args && (0, _extend.extend)(event, args);
    return event
};
exports.createEvent = createEvent;
var fireEvent = function(props) {
    var originalEvent = props.originalEvent,
        delegateTarget = props.delegateTarget;
    var event = createEvent(originalEvent, props);
    _events_engine.default.trigger(delegateTarget || event.target, event);
    return event
};
exports.fireEvent = fireEvent;
var normalizeKeyName = function(_ref4) {
    var key = _ref4.key,
        which = _ref4.which;
    var isKeySupported = !!key;
    key = isKeySupported ? key : which;
    if (key) {
        if (isKeySupported) {
            key = KEY_MAP[key.toLowerCase()] || key
        } else {
            key = LEGACY_KEY_CODES[key] || String.fromCharCode(key)
        }
        return key
    }
};
exports.normalizeKeyName = normalizeKeyName;
var getChar = function(_ref5) {
    var key = _ref5.key,
        which = _ref5.which;
    return key || String.fromCharCode(which)
};
exports.getChar = getChar;
var addNamespace = _add_namespace.default;
exports.addNamespace = addNamespace;


/***/ }),

/***/ "./node_modules/devextreme/events/visibility_change.js":
/*!*************************************************************!*\
  !*** ./node_modules/devextreme/events/visibility_change.js ***!
  \*************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/**
 * DevExtreme (events/visibility_change.js)
 * Version: 20.2.3
 * Build date: Tue Oct 20 2020
 *
 * Copyright (c) 2012 - 2020 Developer Express Inc. ALL RIGHTS RESERVED
 * Read about DevExtreme licensing here: https://js.devexpress.com/Licensing/
 */

exports.triggerResizeEvent = exports.triggerHidingEvent = exports.triggerShownEvent = void 0;
var _renderer = _interopRequireDefault(__webpack_require__(/*! ../core/renderer */ "./node_modules/devextreme/core/renderer.js"));
var _events_engine = _interopRequireDefault(__webpack_require__(/*! ./core/events_engine */ "./node_modules/devextreme/events/core/events_engine.js"));

function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
        "default": obj
    }
}
var triggerVisibilityChangeEvent = function(eventName) {
    var VISIBILITY_CHANGE_SELECTOR = ".dx-visibility-change-handler";
    return function(element) {
        var $element = (0, _renderer.default)(element || "body");
        var changeHandlers = $element.filter(VISIBILITY_CHANGE_SELECTOR).add($element.find(VISIBILITY_CHANGE_SELECTOR));
        for (var i = 0; i < changeHandlers.length; i++) {
            _events_engine.default.triggerHandler(changeHandlers[i], eventName)
        }
    }
};
var triggerShownEvent = triggerVisibilityChangeEvent("dxshown");
exports.triggerShownEvent = triggerShownEvent;
var triggerHidingEvent = triggerVisibilityChangeEvent("dxhiding");
exports.triggerHidingEvent = triggerHidingEvent;
var triggerResizeEvent = triggerVisibilityChangeEvent("dxresize");
exports.triggerResizeEvent = triggerResizeEvent;


/***/ }),

/***/ "./node_modules/devextreme/mobile/hide_callback.js":
/*!*********************************************************!*\
  !*** ./node_modules/devextreme/mobile/hide_callback.js ***!
  \*********************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/**
 * DevExtreme (mobile/hide_callback.js)
 * Version: 20.2.3
 * Build date: Tue Oct 20 2020
 *
 * Copyright (c) 2012 - 2020 Developer Express Inc. ALL RIGHTS RESERVED
 * Read about DevExtreme licensing here: https://js.devexpress.com/Licensing/
 */

exports.hideCallback = void 0;
var _array = __webpack_require__(/*! ../core/utils/array */ "./node_modules/devextreme/core/utils/array.js");
var hideCallback = function() {
    var callbacks = [];
    return {
        add: function(callback) {
            var indexOfCallback = (0, _array.inArray)(callback, callbacks);
            if (indexOfCallback === -1) {
                callbacks.push(callback)
            }
        },
        remove: function(callback) {
            var indexOfCallback = (0, _array.inArray)(callback, callbacks);
            if (indexOfCallback !== -1) {
                callbacks.splice(indexOfCallback, 1)
            }
        },
        fire: function() {
            var callback = callbacks.pop();
            var result = !!callback;
            if (result) {
                callback()
            }
            return result
        },
        hasCallback: function() {
            return callbacks.length > 0
        }
    }
}();
exports.hideCallback = hideCallback;


/***/ }),

/***/ "./node_modules/devextreme/ui/notify.js":
/*!**********************************************!*\
  !*** ./node_modules/devextreme/ui/notify.js ***!
  \**********************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/**
 * DevExtreme (ui/notify.js)
 * Version: 20.2.3
 * Build date: Tue Oct 20 2020
 *
 * Copyright (c) 2012 - 2020 Developer Express Inc. ALL RIGHTS RESERVED
 * Read about DevExtreme licensing here: https://js.devexpress.com/Licensing/
 */

exports.default = void 0;
var _renderer = _interopRequireDefault(__webpack_require__(/*! ../core/renderer */ "./node_modules/devextreme/core/renderer.js"));
var _action = _interopRequireDefault(__webpack_require__(/*! ../core/action */ "./node_modules/devextreme/core/action.js"));
var _view_port = __webpack_require__(/*! ../core/utils/view_port */ "./node_modules/devextreme/core/utils/view_port.js");
var _extend = __webpack_require__(/*! ../core/utils/extend */ "./node_modules/devextreme/core/utils/extend.js");
var _type = __webpack_require__(/*! ../core/utils/type */ "./node_modules/devextreme/core/utils/type.js");
var _toast = _interopRequireDefault(__webpack_require__(/*! ./toast */ "./node_modules/devextreme/ui/toast.js"));

function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
        "default": obj
    }
}
var $notify = null;
var notify = function(message, type, displayTime) {
    var options = (0, _type.isPlainObject)(message) ? message : {
        message: message
    };
    var userHiddenAction = options.onHidden;
    (0, _extend.extend)(options, {
        type: type,
        displayTime: displayTime,
        onHidden: function(args) {
            (0, _renderer.default)(args.element).remove();
            new _action.default(userHiddenAction, {
                context: args.model
            }).execute(arguments)
        }
    });
    $notify = (0, _renderer.default)("<div>").appendTo((0, _view_port.value)());
    new _toast.default($notify, options).show()
};
var _default = notify;
exports.default = _default;
module.exports = exports.default;
module.exports.default = module.exports;


/***/ }),

/***/ "./node_modules/devextreme/ui/overlay.js":
/*!***********************************************!*\
  !*** ./node_modules/devextreme/ui/overlay.js ***!
  \***********************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/**
 * DevExtreme (ui/overlay.js)
 * Version: 20.2.3
 * Build date: Tue Oct 20 2020
 *
 * Copyright (c) 2012 - 2020 Developer Express Inc. ALL RIGHTS RESERVED
 * Read about DevExtreme licensing here: https://js.devexpress.com/Licensing/
 */

exports.default = void 0;
var _ui = _interopRequireDefault(__webpack_require__(/*! ./overlay/ui.overlay */ "./node_modules/devextreme/ui/overlay/ui.overlay.js"));

function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
        "default": obj
    }
}
var _default = _ui.default;
exports.default = _default;
module.exports = exports.default;
module.exports.default = module.exports;


/***/ }),

/***/ "./node_modules/devextreme/ui/overlay/ui.overlay.js":
/*!**********************************************************!*\
  !*** ./node_modules/devextreme/ui/overlay/ui.overlay.js ***!
  \**********************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/**
 * DevExtreme (ui/overlay/ui.overlay.js)
 * Version: 20.2.3
 * Build date: Tue Oct 20 2020
 *
 * Copyright (c) 2012 - 2020 Developer Express Inc. ALL RIGHTS RESERVED
 * Read about DevExtreme licensing here: https://js.devexpress.com/Licensing/
 */

exports.default = void 0;
var _fx = _interopRequireDefault(__webpack_require__(/*! ../../animation/fx */ "./node_modules/devextreme/animation/fx.js"));
var _position = _interopRequireDefault(__webpack_require__(/*! ../../animation/position */ "./node_modules/devextreme/animation/position.js"));
var _translator = __webpack_require__(/*! ../../animation/translator */ "./node_modules/devextreme/animation/translator.js");
var _component_registrator = _interopRequireDefault(__webpack_require__(/*! ../../core/component_registrator */ "./node_modules/devextreme/core/component_registrator.js"));
var _devices = _interopRequireDefault(__webpack_require__(/*! ../../core/devices */ "./node_modules/devextreme/core/devices.js"));
var _dom_adapter = _interopRequireDefault(__webpack_require__(/*! ../../core/dom_adapter */ "./node_modules/devextreme/core/dom_adapter.js"));
var _element = __webpack_require__(/*! ../../core/element */ "./node_modules/devextreme/core/element.js");
var _renderer = _interopRequireDefault(__webpack_require__(/*! ../../core/renderer */ "./node_modules/devextreme/core/renderer.js"));
var _empty_template = __webpack_require__(/*! ../../core/templates/empty_template */ "./node_modules/devextreme/core/templates/empty_template.js");
var _array = __webpack_require__(/*! ../../core/utils/array */ "./node_modules/devextreme/core/utils/array.js");
var _browser = _interopRequireDefault(__webpack_require__(/*! ../../core/utils/browser */ "./node_modules/devextreme/core/utils/browser.js"));
var _common = __webpack_require__(/*! ../../core/utils/common */ "./node_modules/devextreme/core/utils/common.js");
var _deferred = __webpack_require__(/*! ../../core/utils/deferred */ "./node_modules/devextreme/core/utils/deferred.js");
var _dom = __webpack_require__(/*! ../../core/utils/dom */ "./node_modules/devextreme/core/utils/dom.js");
var _extend = __webpack_require__(/*! ../../core/utils/extend */ "./node_modules/devextreme/core/utils/extend.js");
var _iterator = __webpack_require__(/*! ../../core/utils/iterator */ "./node_modules/devextreme/core/utils/iterator.js");
var _math = __webpack_require__(/*! ../../core/utils/math */ "./node_modules/devextreme/core/utils/math.js");
var _ready_callbacks = _interopRequireDefault(__webpack_require__(/*! ../../core/utils/ready_callbacks */ "./node_modules/devextreme/core/utils/ready_callbacks.js"));
var _type = __webpack_require__(/*! ../../core/utils/type */ "./node_modules/devextreme/core/utils/type.js");
var _version = __webpack_require__(/*! ../../core/utils/version */ "./node_modules/devextreme/core/utils/version.js");
var _view_port = __webpack_require__(/*! ../../core/utils/view_port */ "./node_modules/devextreme/core/utils/view_port.js");
var _window = __webpack_require__(/*! ../../core/utils/window */ "./node_modules/devextreme/core/utils/window.js");
var _events_engine = _interopRequireDefault(__webpack_require__(/*! ../../events/core/events_engine */ "./node_modules/devextreme/events/core/events_engine.js"));
var _drag = __webpack_require__(/*! ../../events/drag */ "./node_modules/devextreme/events/drag.js");
var _pointer = _interopRequireDefault(__webpack_require__(/*! ../../events/pointer */ "./node_modules/devextreme/events/pointer.js"));
var _short = __webpack_require__(/*! ../../events/short */ "./node_modules/devextreme/events/short.js");
var _index = __webpack_require__(/*! ../../events/utils/index */ "./node_modules/devextreme/events/utils/index.js");
var _visibility_change = __webpack_require__(/*! ../../events/visibility_change */ "./node_modules/devextreme/events/visibility_change.js");
var _hide_callback = __webpack_require__(/*! ../../mobile/hide_callback */ "./node_modules/devextreme/mobile/hide_callback.js");
var _resizable = _interopRequireDefault(__webpack_require__(/*! ../resizable */ "./node_modules/devextreme/ui/resizable.js"));
var _selectors = __webpack_require__(/*! ../widget/selectors */ "./node_modules/devextreme/ui/widget/selectors.js");
var _swatch_container = _interopRequireDefault(__webpack_require__(/*! ../widget/swatch_container */ "./node_modules/devextreme/ui/widget/swatch_container.js"));
var _ui = _interopRequireDefault(__webpack_require__(/*! ../widget/ui.widget */ "./node_modules/devextreme/ui/widget/ui.widget.js"));
var zIndexPool = _interopRequireWildcard(__webpack_require__(/*! ./z_index */ "./node_modules/devextreme/ui/overlay/z_index.js"));

function _getRequireWildcardCache() {
    if ("function" !== typeof WeakMap) {
        return null
    }
    var cache = new WeakMap;
    _getRequireWildcardCache = function() {
        return cache
    };
    return cache
}

function _interopRequireWildcard(obj) {
    if (obj && obj.__esModule) {
        return obj
    }
    if (null === obj || "object" !== _typeof(obj) && "function" !== typeof obj) {
        return {
            "default": obj
        }
    }
    var cache = _getRequireWildcardCache();
    if (cache && cache.has(obj)) {
        return cache.get(obj)
    }
    var newObj = {};
    var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor;
    for (var key in obj) {
        if (Object.prototype.hasOwnProperty.call(obj, key)) {
            var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null;
            if (desc && (desc.get || desc.set)) {
                Object.defineProperty(newObj, key, desc)
            } else {
                newObj[key] = obj[key]
            }
        }
    }
    newObj.default = obj;
    if (cache) {
        cache.set(obj, newObj)
    }
    return newObj
}

function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
        "default": obj
    }
}

function _typeof(obj) {
    "@babel/helpers - typeof";
    if ("function" === typeof Symbol && "symbol" === typeof Symbol.iterator) {
        _typeof = function(obj) {
            return typeof obj
        }
    } else {
        _typeof = function(obj) {
            return obj && "function" === typeof Symbol && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj
        }
    }
    return _typeof(obj)
}
var ready = _ready_callbacks.default.add;
var window = (0, _window.getWindow)();
var navigator = (0, _window.getNavigator)();
var viewPortChanged = _view_port.changeCallback;
var OVERLAY_CLASS = "dx-overlay";
var OVERLAY_WRAPPER_CLASS = "dx-overlay-wrapper";
var OVERLAY_CONTENT_CLASS = "dx-overlay-content";
var OVERLAY_SHADER_CLASS = "dx-overlay-shader";
var OVERLAY_MODAL_CLASS = "dx-overlay-modal";
var INNER_OVERLAY_CLASS = "dx-inner-overlay";
var INVISIBLE_STATE_CLASS = "dx-state-invisible";
var ANONYMOUS_TEMPLATE_NAME = "content";
var RTL_DIRECTION_CLASS = "dx-rtl";
var ACTIONS = ["onShowing", "onShown", "onHiding", "onHidden", "onPositioning", "onPositioned", "onResizeStart", "onResize", "onResizeEnd"];
var OVERLAY_STACK = [];
var DISABLED_STATE_CLASS = "dx-state-disabled";
var PREVENT_SAFARI_SCROLLING_CLASS = "dx-prevent-safari-scrolling";
var TAB_KEY = "tab";
var POSITION_ALIASES = {
    top: {
        my: "top center",
        at: "top center"
    },
    bottom: {
        my: "bottom center",
        at: "bottom center"
    },
    right: {
        my: "right center",
        at: "right center"
    },
    left: {
        my: "left center",
        at: "left center"
    },
    center: {
        my: "center",
        at: "center"
    },
    "right bottom": {
        my: "right bottom",
        at: "right bottom"
    },
    "right top": {
        my: "right top",
        at: "right top"
    },
    "left bottom": {
        my: "left bottom",
        at: "left bottom"
    },
    "left top": {
        my: "left top",
        at: "left top"
    }
};
var realDevice = _devices.default.real();
var realVersion = realDevice.version;
var firefoxDesktop = _browser.default.mozilla && "desktop" === realDevice.deviceType;
var iOS = "ios" === realDevice.platform;
var hasSafariAddressBar = _browser.default.safari && "desktop" !== realDevice.deviceType;
var android4_0nativeBrowser = "android" === realDevice.platform && 0 === (0, _version.compare)(realVersion, [4, 0], 2) && navigator.userAgent.indexOf("Chrome") === -1;
var forceRepaint = function($element) {
    if (firefoxDesktop) {
        $element.width()
    }
    if (android4_0nativeBrowser) {
        var $parents = $element.parents();
        var inScrollView = $parents.is(".dx-scrollable-native");
        if (!inScrollView) {
            $parents.css("backfaceVisibility", "hidden");
            $parents.css("backfaceVisibility");
            $parents.css("backfaceVisibility", "visible")
        }
    }
};
var getElement = function(value) {
    return value && (0, _renderer.default)(value.target || value)
};
ready(function() {
    _events_engine.default.subscribeGlobal(_dom_adapter.default.getDocument(), _pointer.default.down, function(e) {
        for (var i = OVERLAY_STACK.length - 1; i >= 0; i--) {
            if (!OVERLAY_STACK[i]._proxiedDocumentDownHandler(e)) {
                return
            }
        }
    })
});
var Overlay = _ui.default.inherit({
    _supportedKeys: function() {
        var offsetSize = 5;
        var move = function(top, left, e) {
            if (!this.option("dragEnabled")) {
                return
            }
            e.preventDefault();
            e.stopPropagation();
            var allowedOffsets = this._allowedOffsets();
            var offset = {
                top: (0, _math.fitIntoRange)(top, -allowedOffsets.top, allowedOffsets.bottom),
                left: (0, _math.fitIntoRange)(left, -allowedOffsets.left, allowedOffsets.right)
            };
            this._changePosition(offset)
        };
        return (0, _extend.extend)(this.callBase(), {
            escape: function() {
                this.hide()
            },
            upArrow: move.bind(this, -offsetSize, 0),
            downArrow: move.bind(this, offsetSize, 0),
            leftArrow: move.bind(this, 0, -offsetSize),
            rightArrow: move.bind(this, 0, offsetSize)
        })
    },
    _getDefaultOptions: function() {
        var _this = this;
        return (0, _extend.extend)(this.callBase(), {
            activeStateEnabled: false,
            visible: false,
            deferRendering: true,
            shading: true,
            shadingColor: "",
            position: {
                my: "center",
                at: "center"
            },
            width: function() {
                return .8 * (0, _renderer.default)(window).width()
            },
            minWidth: null,
            maxWidth: null,
            height: function() {
                return .8 * (0, _renderer.default)(window).height()
            },
            minHeight: null,
            maxHeight: null,
            animation: {
                show: {
                    type: "pop",
                    duration: 300,
                    from: {
                        scale: .55
                    }
                },
                hide: {
                    type: "pop",
                    duration: 300,
                    to: {
                        opacity: 0,
                        scale: .55
                    },
                    from: {
                        opacity: 1,
                        scale: 1
                    }
                }
            },
            closeOnOutsideClick: false,
            onShowing: null,
            onShown: null,
            onHiding: null,
            onHidden: null,
            contentTemplate: "content",
            dragEnabled: false,
            resizeEnabled: false,
            onResizeStart: null,
            onResize: null,
            onResizeEnd: null,
            innerOverlay: false,
            target: void 0,
            container: void 0,
            hideTopOverlayHandler: function() {
                _this.hide()
            },
            closeOnTargetScroll: false,
            onPositioned: null,
            boundaryOffset: {
                h: 0,
                v: 0
            },
            propagateOutsideClick: false,
            ignoreChildEvents: true,
            _checkParentVisibility: true
        })
    },
    _defaultOptionsRules: function() {
        return this.callBase().concat([{
            device: function() {
                var realDevice = _devices.default.real();
                var realPlatform = realDevice.platform;
                var realVersion = realDevice.version;
                return "android" === realPlatform && (0, _version.compare)(realVersion, [4, 2]) < 0
            },
            options: {
                animation: {
                    show: {
                        type: "fade",
                        duration: 400
                    },
                    hide: {
                        type: "fade",
                        duration: 400,
                        to: {
                            opacity: 0
                        },
                        from: {
                            opacity: 1
                        }
                    }
                }
            }
        }, {
            device: function() {
                return !(0, _window.hasWindow)()
            },
            options: {
                width: null,
                height: null,
                animation: null,
                _checkParentVisibility: false
            }
        }])
    },
    _setOptionsByReference: function() {
        this.callBase();
        (0, _extend.extend)(this._optionsByReference, {
            animation: true
        })
    },
    _wrapper: function() {
        return this._$wrapper
    },
    _container: function() {
        return this._$content
    },
    _eventBindingTarget: function() {
        return this._$content
    },
    _init: function() {
        this.callBase();
        this._initActions();
        this._initCloseOnOutsideClickHandler();
        this._initTabTerminatorHandler();
        this._$wrapper = (0, _renderer.default)("<div>").addClass(OVERLAY_WRAPPER_CLASS);
        this._$content = (0, _renderer.default)("<div>").addClass(OVERLAY_CONTENT_CLASS);
        this._initInnerOverlayClass();
        var $element = this.$element();
        this._$wrapper.addClass($element.attr("class"));
        $element.addClass(OVERLAY_CLASS);
        this._$wrapper.attr("data-bind", "dxControlsDescendantBindings: true");
        _events_engine.default.on(this._$wrapper, "MSPointerDown", _common.noop);
        _events_engine.default.on(this._$wrapper, "focusin", function(e) {
            e.stopPropagation()
        });
        this._toggleViewPortSubscription(true);
        this._initHideTopOverlayHandler(this.option("hideTopOverlayHandler"))
    },
    _initOptions: function(options) {
        this._initTarget(options.target);
        var container = void 0 === options.container ? this.option("container") : options.container;
        this._initContainer(container);
        this.callBase(options)
    },
    _initInnerOverlayClass: function() {
        this._$content.toggleClass(INNER_OVERLAY_CLASS, this.option("innerOverlay"))
    },
    _initTarget: function(target) {
        if (!(0, _type.isDefined)(target)) {
            return
        }
        var options = this.option();
        (0, _iterator.each)(["position.of", "animation.show.from.position.of", "animation.show.to.position.of", "animation.hide.from.position.of", "animation.hide.to.position.of"], function(_, path) {
            var pathParts = path.split(".");
            var option = options;
            while (option) {
                if (1 === pathParts.length) {
                    if ((0, _type.isPlainObject)(option)) {
                        option[pathParts.shift()] = target
                    }
                    break
                } else {
                    option = option[pathParts.shift()]
                }
            }
        })
    },
    _initContainer: function(container) {
        container = void 0 === container ? (0, _view_port.value)() : container;
        var $element = this.$element();
        var $container = $element.closest(container);
        if (!$container.length) {
            $container = (0, _renderer.default)(container).first()
        }
        this._$container = $container.length ? $container : $element.parent()
    },
    _initHideTopOverlayHandler: function(handler) {
        this._hideTopOverlayHandler = handler
    },
    _initActions: function() {
        var _this2 = this;
        this._actions = {};
        (0, _iterator.each)(ACTIONS, function(_, action) {
            _this2._actions[action] = _this2._createActionByOption(action, {
                excludeValidators: ["disabled", "readOnly"]
            }) || _common.noop
        })
    },
    _initCloseOnOutsideClickHandler: function() {
        var that = this;
        this._proxiedDocumentDownHandler = function() {
            return that._documentDownHandler.apply(that, arguments)
        }
    },
    _documentDownHandler: function(e) {
        if (this._showAnimationProcessing) {
            this._stopAnimation()
        }
        var closeOnOutsideClick = this.option("closeOnOutsideClick");
        if ((0, _type.isFunction)(closeOnOutsideClick)) {
            closeOnOutsideClick = closeOnOutsideClick(e)
        }
        var $container = this._$content;
        var isAttachedTarget = (0, _renderer.default)(window.document).is(e.target) || (0, _dom.contains)(window.document, e.target);
        var isInnerOverlay = (0, _renderer.default)(e.target).closest("." + INNER_OVERLAY_CLASS).length;
        var outsideClick = isAttachedTarget && !isInnerOverlay && !($container.is(e.target) || (0, _dom.contains)($container.get(0), e.target));
        if (outsideClick && closeOnOutsideClick) {
            this._outsideClickHandler(e)
        }
        return this.option("propagateOutsideClick")
    },
    _outsideClickHandler: function(e) {
        if (this.option("shading")) {
            e.preventDefault()
        }
        this.hide()
    },
    _getAnonymousTemplateName: function() {
        return ANONYMOUS_TEMPLATE_NAME
    },
    _initTemplates: function() {
        this._templateManager.addDefaultTemplates({
            content: new _empty_template.EmptyTemplate
        });
        this.callBase()
    },
    _isTopOverlay: function() {
        var overlayStack = this._overlayStack();
        for (var i = overlayStack.length - 1; i >= 0; i--) {
            var tabbableElements = overlayStack[i]._findTabbableBounds();
            if (tabbableElements.first || tabbableElements.last) {
                return overlayStack[i] === this
            }
        }
        return false
    },
    _overlayStack: function() {
        return OVERLAY_STACK
    },
    _zIndexInitValue: function() {
        return Overlay.baseZIndex()
    },
    _toggleViewPortSubscription: function(toggle) {
        viewPortChanged.remove(this._viewPortChangeHandle);
        if (toggle) {
            this._viewPortChangeHandle = this._viewPortChangeHandler.bind(this);
            viewPortChanged.add(this._viewPortChangeHandle)
        }
    },
    _viewPortChangeHandler: function() {
        this._initContainer(this.option("container"));
        this._refresh()
    },
    _renderVisibilityAnimate: function(visible) {
        this._stopAnimation();
        return visible ? this._show() : this._hide()
    },
    _normalizePosition: function() {
        var position = this.option("position");
        this._position = "function" === typeof position ? position() : position
    },
    _getAnimationConfig: function() {
        var animation = this.option("animation");
        if ((0, _type.isFunction)(animation)) {
            animation = animation.call(this)
        }
        return animation
    },
    _show: function() {
        var _this3 = this;
        var that = this;
        var deferred = new _deferred.Deferred;
        this._parentHidden = this._isParentHidden();
        deferred.done(function() {
            delete that._parentHidden
        });
        if (this._parentHidden) {
            this._isHidden = true;
            return deferred.resolve()
        }
        if (this._currentVisible) {
            return (new _deferred.Deferred).resolve().promise()
        }
        this._currentVisible = true;
        this._isShown = false;
        this._normalizePosition();
        var animation = that._getAnimationConfig() || {};
        var showAnimation = this._normalizeAnimation(animation.show, "to");
        var startShowAnimation = showAnimation && showAnimation.start || _common.noop;
        var completeShowAnimation = showAnimation && showAnimation.complete || _common.noop;
        if (this._isHidingActionCanceled) {
            delete this._isHidingActionCanceled;
            deferred.resolve()
        } else {
            var show = function() {
                _this3._renderVisibility(true);
                if (_this3._isShowingActionCanceled) {
                    delete _this3._isShowingActionCanceled;
                    deferred.resolve();
                    return
                }
                _this3._animate(showAnimation, function() {
                    if (that.option("focusStateEnabled")) {
                        _events_engine.default.trigger(that._focusTarget(), "focus")
                    }
                    completeShowAnimation.apply(this, arguments);
                    that._showAnimationProcessing = false;
                    that._isShown = true;
                    that._actions.onShown();
                    that._toggleSafariScrolling(false);
                    deferred.resolve()
                }, function() {
                    startShowAnimation.apply(this, arguments);
                    that._showAnimationProcessing = true
                })
            };
            if (this.option("templatesRenderAsynchronously")) {
                this._stopShowTimer();
                this._asyncShowTimeout = setTimeout(show)
            } else {
                show()
            }
        }
        return deferred.promise()
    },
    _normalizeAnimation: function(animation, prop) {
        if (animation) {
            animation = (0, _extend.extend)({
                type: "slide"
            }, animation);
            if (animation[prop] && "object" === _typeof(animation[prop])) {
                (0, _extend.extend)(animation[prop], {
                    position: this._position
                })
            }
        }
        return animation
    },
    _hide: function() {
        if (!this._currentVisible) {
            return (new _deferred.Deferred).resolve().promise()
        }
        this._currentVisible = false;
        var that = this;
        var deferred = new _deferred.Deferred;
        var animation = that._getAnimationConfig() || {};
        var hideAnimation = this._normalizeAnimation(animation.hide, "from");
        var startHideAnimation = hideAnimation && hideAnimation.start || _common.noop;
        var completeHideAnimation = hideAnimation && hideAnimation.complete || _common.noop;
        var hidingArgs = {
            cancel: false
        };
        if (this._isShowingActionCanceled) {
            deferred.resolve()
        } else {
            this._actions.onHiding(hidingArgs);
            that._toggleSafariScrolling(true);
            if (hidingArgs.cancel) {
                this._isHidingActionCanceled = true;
                this.option("visible", true);
                deferred.resolve()
            } else {
                this._forceFocusLost();
                this._toggleShading(false);
                this._toggleSubscriptions(false);
                this._stopShowTimer();
                this._animate(hideAnimation, function() {
                    var _that$_actions;
                    that._$content.css("pointerEvents", "");
                    that._renderVisibility(false);
                    completeHideAnimation.apply(this, arguments);
                    null === (_that$_actions = that._actions) || void 0 === _that$_actions ? void 0 : _that$_actions.onHidden();
                    deferred.resolve()
                }, function() {
                    that._$content.css("pointerEvents", "none");
                    startHideAnimation.apply(this, arguments)
                })
            }
        }
        return deferred.promise()
    },
    _forceFocusLost: function() {
        var activeElement = _dom_adapter.default.getActiveElement();
        var shouldResetActiveElement = !!this._$content.find(activeElement).length;
        if (shouldResetActiveElement) {
            (0, _dom.resetActiveElement)()
        }
    },
    _animate: function(animation, completeCallback, startCallback) {
        if (animation) {
            startCallback = startCallback || animation.start || _common.noop;
            _fx.default.animate(this._$content, (0, _extend.extend)({}, animation, {
                start: startCallback,
                complete: completeCallback
            }))
        } else {
            completeCallback()
        }
    },
    _stopAnimation: function() {
        _fx.default.stop(this._$content, true)
    },
    _renderVisibility: function(visible) {
        if (visible && this._isParentHidden()) {
            return
        }
        this._currentVisible = visible;
        this._stopAnimation();
        if (!visible) {
            (0, _visibility_change.triggerHidingEvent)(this._$content)
        }
        this._toggleVisibility(visible);
        this._$content.toggleClass(INVISIBLE_STATE_CLASS, !visible);
        this._updateZIndexStackPosition(visible);
        if (visible) {
            this._renderContent();
            var showingArgs = {
                cancel: false
            };
            this._actions.onShowing(showingArgs);
            if (showingArgs.cancel) {
                this._toggleVisibility(false);
                this._$content.toggleClass(INVISIBLE_STATE_CLASS, true);
                this._updateZIndexStackPosition(false);
                this._moveFromContainer();
                this._isShowingActionCanceled = true;
                this.option("visible", false);
                return
            }
            this._moveToContainer();
            this._renderGeometry();
            (0, _visibility_change.triggerShownEvent)(this._$content);
            (0, _visibility_change.triggerResizeEvent)(this._$content)
        } else {
            this._moveFromContainer()
        }
        this._toggleShading(visible);
        this._toggleSubscriptions(visible)
    },
    _updateZIndexStackPosition: function(pushToStack) {
        var overlayStack = this._overlayStack();
        var index = (0, _array.inArray)(this, overlayStack);
        if (pushToStack) {
            if (index === -1) {
                this._zIndex = zIndexPool.create(this._zIndexInitValue());
                overlayStack.push(this)
            }
            this._$wrapper.css("zIndex", this._zIndex);
            this._$content.css("zIndex", this._zIndex)
        } else {
            if (index !== -1) {
                overlayStack.splice(index, 1);
                zIndexPool.remove(this._zIndex)
            }
        }
    },
    _toggleShading: function(visible) {
        this._$wrapper.toggleClass(OVERLAY_MODAL_CLASS, this.option("shading") && !this.option("container"));
        this._$wrapper.toggleClass(OVERLAY_SHADER_CLASS, visible && this.option("shading"));
        this._$wrapper.css("backgroundColor", this.option("shading") ? this.option("shadingColor") : "");
        this._toggleTabTerminator(visible && this.option("shading"))
    },
    _initTabTerminatorHandler: function() {
        var that = this;
        this._proxiedTabTerminatorHandler = function() {
            that._tabKeyHandler.apply(that, arguments)
        }
    },
    _toggleTabTerminator: function(enabled) {
        var eventName = (0, _index.addNamespace)("keydown", this.NAME);
        if (enabled) {
            _events_engine.default.on(_dom_adapter.default.getDocument(), eventName, this._proxiedTabTerminatorHandler)
        } else {
            _events_engine.default.off(_dom_adapter.default.getDocument(), eventName, this._proxiedTabTerminatorHandler)
        }
    },
    _findTabbableBounds: function() {
        var $elements = this._$wrapper.find("*");
        var elementsCount = $elements.length - 1;
        var result = {
            first: null,
            last: null
        };
        for (var i = 0; i <= elementsCount; i++) {
            if (!result.first && $elements.eq(i).is(_selectors.tabbable)) {
                result.first = $elements.eq(i)
            }
            if (!result.last && $elements.eq(elementsCount - i).is(_selectors.tabbable)) {
                result.last = $elements.eq(elementsCount - i)
            }
            if (result.first && result.last) {
                break
            }
        }
        return result
    },
    _tabKeyHandler: function(e) {
        if ((0, _index.normalizeKeyName)(e) !== TAB_KEY || !this._isTopOverlay()) {
            return
        }
        var tabbableElements = this._findTabbableBounds();
        var $firstTabbable = tabbableElements.first;
        var $lastTabbable = tabbableElements.last;
        var isTabOnLast = !e.shiftKey && e.target === $lastTabbable.get(0);
        var isShiftTabOnFirst = e.shiftKey && e.target === $firstTabbable.get(0);
        var isEmptyTabList = 0 === tabbableElements.length;
        var isOutsideTarget = !(0, _dom.contains)(this._$wrapper.get(0), e.target);
        if (isTabOnLast || isShiftTabOnFirst || isEmptyTabList || isOutsideTarget) {
            e.preventDefault();
            var $focusElement = e.shiftKey ? $lastTabbable : $firstTabbable;
            _events_engine.default.trigger($focusElement, "focusin");
            _events_engine.default.trigger($focusElement, "focus")
        }
    },
    _toggleSubscriptions: function(enabled) {
        if ((0, _window.hasWindow)()) {
            this._toggleHideTopOverlayCallback(enabled);
            this._toggleParentsScrollSubscription(enabled)
        }
    },
    _toggleHideTopOverlayCallback: function(subscribe) {
        if (!this._hideTopOverlayHandler) {
            return
        }
        if (subscribe) {
            _hide_callback.hideCallback.add(this._hideTopOverlayHandler)
        } else {
            _hide_callback.hideCallback.remove(this._hideTopOverlayHandler)
        }
    },
    _toggleParentsScrollSubscription: function(subscribe) {
        var _this4 = this;
        if (!this._position) {
            return
        }
        var target = this._position.of || (0, _renderer.default)();
        var closeOnScroll = this.option("closeOnTargetScroll");
        var $parents = getElement(target).parents();
        var scrollEvent = (0, _index.addNamespace)("scroll", this.NAME);
        if ("desktop" === _devices.default.real().deviceType) {
            $parents = $parents.add(window)
        }
        this._proxiedTargetParentsScrollHandler = this._proxiedTargetParentsScrollHandler || function(e) {
            _this4._targetParentsScrollHandler(e)
        };
        _events_engine.default.off((0, _renderer.default)().add(this._$prevTargetParents), scrollEvent, this._proxiedTargetParentsScrollHandler);
        if (subscribe && closeOnScroll) {
            _events_engine.default.on($parents, scrollEvent, this._proxiedTargetParentsScrollHandler);
            this._$prevTargetParents = $parents
        }
    },
    _targetParentsScrollHandler: function(e) {
        var closeHandled = false;
        var closeOnScroll = this.option("closeOnTargetScroll");
        if ((0, _type.isFunction)(closeOnScroll)) {
            closeHandled = closeOnScroll(e)
        }
        if (!closeHandled && !this._showAnimationProcessing) {
            this.hide()
        }
    },
    _render: function() {
        this.callBase();
        this._appendContentToElement();
        this._renderVisibilityAnimate(this.option("visible"))
    },
    _appendContentToElement: function() {
        if (!this._$content.parent().is(this.$element())) {
            this._$content.appendTo(this.$element())
        }
    },
    _renderContent: function() {
        var shouldDeferRendering = !this._currentVisible && this.option("deferRendering");
        var isParentHidden = this.option("visible") && this._isParentHidden();
        if (isParentHidden) {
            this._isHidden = true;
            return
        }
        if (this._contentAlreadyRendered || shouldDeferRendering) {
            return
        }
        this._contentAlreadyRendered = true;
        this._appendContentToElement();
        this.callBase()
    },
    _isParentHidden: function() {
        if (!this.option("_checkParentVisibility")) {
            return false
        }
        if (void 0 !== this._parentHidden) {
            return this._parentHidden
        }
        var $parent = this.$element().parent();
        if ($parent.is(":visible")) {
            return false
        }
        var isHidden = false;
        $parent.add($parent.parents()).each(function() {
            var $element = (0, _renderer.default)(this);
            if ("none" === $element.css("display")) {
                isHidden = true;
                return false
            }
        });
        return isHidden || !_dom_adapter.default.getBody().contains($parent.get(0))
    },
    _renderContentImpl: function() {
        var _this5 = this;
        var whenContentRendered = new _deferred.Deferred;
        var contentTemplateOption = this.option("contentTemplate");
        var contentTemplate = this._getTemplate(contentTemplateOption);
        var transclude = this._templateManager.anonymousTemplateName === contentTemplateOption;
        contentTemplate && contentTemplate.render({
            container: (0, _element.getPublicElement)(this.$content()),
            noModel: true,
            transclude: transclude,
            onRendered: function() {
                whenContentRendered.resolve()
            }
        });
        this._renderDrag();
        this._renderResize();
        this._renderScrollTerminator();
        whenContentRendered.done(function() {
            if (_this5.option("visible")) {
                _this5._moveToContainer()
            }
        });
        return whenContentRendered.promise()
    },
    _renderDrag: function() {
        var $dragTarget = this._getDragTarget();
        if (!$dragTarget) {
            return
        }
        var startEventName = (0, _index.addNamespace)(_drag.start, this.NAME);
        var updateEventName = (0, _index.addNamespace)(_drag.move, this.NAME);
        _events_engine.default.off($dragTarget, startEventName);
        _events_engine.default.off($dragTarget, updateEventName);
        if (!this.option("dragEnabled")) {
            return
        }
        _events_engine.default.on($dragTarget, startEventName, this._dragStartHandler.bind(this));
        _events_engine.default.on($dragTarget, updateEventName, this._dragUpdateHandler.bind(this))
    },
    _renderResize: function() {
        this._resizable = this._createComponent(this._$content, _resizable.default, {
            handles: this.option("resizeEnabled") ? "all" : "none",
            onResizeEnd: this._resizeEndHandler.bind(this),
            onResize: this._actions.onResize.bind(this),
            onResizeStart: this._actions.onResizeStart.bind(this),
            minHeight: 100,
            minWidth: 100,
            area: this._getDragResizeContainer()
        })
    },
    _resizeEndHandler: function() {
        this._positionChangeHandled = true;
        var width = this._resizable.option("width");
        var height = this._resizable.option("height");
        width && this.option("width", width);
        height && this.option("height", height);
        this._actions.onResizeEnd()
    },
    _renderScrollTerminator: function() {
        var $scrollTerminator = this._wrapper();
        var terminatorEventName = (0, _index.addNamespace)(_drag.move, this.NAME);
        _events_engine.default.off($scrollTerminator, terminatorEventName);
        _events_engine.default.on($scrollTerminator, terminatorEventName, {
            validate: function() {
                return true
            },
            getDirection: function() {
                return "both"
            },
            _toggleGestureCover: function(toggle) {
                if (!toggle) {
                    this._toggleGestureCoverImpl(toggle)
                }
            },
            _clearSelection: _common.noop,
            isNative: true
        }, function(e) {
            var originalEvent = e.originalEvent.originalEvent;
            e._cancelPreventDefault = true;
            if (originalEvent && "mousemove" !== originalEvent.type && false !== e.cancelable) {
                e.preventDefault()
            }
        })
    },
    _getDragTarget: function() {
        return this.$content()
    },
    _dragStartHandler: function(e) {
        e.targetElements = [];
        this._prevOffset = {
            x: 0,
            y: 0
        };
        var allowedOffsets = this._allowedOffsets();
        e.maxTopOffset = allowedOffsets.top;
        e.maxBottomOffset = allowedOffsets.bottom;
        e.maxLeftOffset = allowedOffsets.left;
        e.maxRightOffset = allowedOffsets.right
    },
    _getDragResizeContainer: function() {
        var isContainerDefined = (0, _view_port.originalViewPort)().get(0) || this.option("container");
        var $container = !isContainerDefined ? (0, _renderer.default)(window) : this._$container;
        return $container
    },
    _deltaSize: function() {
        var $content = this._$content;
        var $container = this._getDragResizeContainer();
        var contentWidth = $content.outerWidth();
        var contentHeight = $content.outerHeight();
        var containerWidth = $container.outerWidth();
        var containerHeight = $container.outerHeight();
        if (this._isWindow($container)) {
            var document = _dom_adapter.default.getDocument();
            var fullPageHeight = Math.max((0, _renderer.default)(document).outerHeight(), containerHeight);
            var fullPageWidth = Math.max((0, _renderer.default)(document).outerWidth(), containerWidth);
            containerHeight = fullPageHeight;
            containerWidth = fullPageWidth
        }
        return {
            width: containerWidth - contentWidth,
            height: containerHeight - contentHeight
        }
    },
    _dragUpdateHandler: function(e) {
        var offset = e.offset;
        var prevOffset = this._prevOffset;
        var targetOffset = {
            top: offset.y - prevOffset.y,
            left: offset.x - prevOffset.x
        };
        this._changePosition(targetOffset);
        this._prevOffset = offset
    },
    _changePosition: function(offset) {
        var position = (0, _translator.locate)(this._$content);
        (0, _translator.move)(this._$content, {
            left: position.left + offset.left,
            top: position.top + offset.top
        });
        this._positionChangeHandled = true
    },
    _allowedOffsets: function() {
        var position = (0, _translator.locate)(this._$content);
        var deltaSize = this._deltaSize();
        var isAllowedDrag = deltaSize.height >= 0 && deltaSize.width >= 0;
        var shaderOffset = this.option("shading") && !this.option("container") && !this._isWindow(this._getContainer()) ? (0, _translator.locate)(this._$wrapper) : {
            top: 0,
            left: 0
        };
        var boundaryOffset = this.option("boundaryOffset");
        return {
            top: isAllowedDrag ? position.top + shaderOffset.top + boundaryOffset.v : 0,
            bottom: isAllowedDrag ? -position.top - shaderOffset.top + deltaSize.height - boundaryOffset.v : 0,
            left: isAllowedDrag ? position.left + shaderOffset.left + boundaryOffset.h : 0,
            right: isAllowedDrag ? -position.left - shaderOffset.left + deltaSize.width - boundaryOffset.h : 0
        }
    },
    _moveFromContainer: function() {
        this._$content.appendTo(this.$element());
        this._detachWrapperToContainer()
    },
    _detachWrapperToContainer: function() {
        this._$wrapper.detach()
    },
    _moveToContainer: function() {
        this._attachWrapperToContainer();
        this._$content.appendTo(this._$wrapper)
    },
    _attachWrapperToContainer: function() {
        var $element = this.$element();
        var containerDefined = void 0 !== this.option("container");
        var renderContainer = containerDefined ? this._$container : _swatch_container.default.getSwatchContainer($element);
        if (renderContainer && renderContainer[0] === $element.parent()[0]) {
            renderContainer = $element
        }
        this._$wrapper.appendTo(renderContainer)
    },
    _fixHeightAfterSafariAddressBarResizing: function() {
        if (this._isWindow(this._getContainer()) && hasSafariAddressBar) {
            this._$wrapper.css("minHeight", window.innerHeight)
        }
    },
    _renderGeometry: function(isDimensionChanged) {
        if (this.option("visible") && (0, _window.hasWindow)()) {
            this._renderGeometryImpl(isDimensionChanged)
        }
    },
    _renderGeometryImpl: function(isDimensionChanged) {
        this._stopAnimation();
        this._normalizePosition();
        this._renderWrapper();
        this._fixHeightAfterSafariAddressBarResizing();
        this._renderDimensions();
        var resultPosition = this._renderPosition();
        this._actions.onPositioned({
            position: resultPosition
        })
    },
    _fixWrapperPosition: function() {
        this._$wrapper.css("position", this._useFixedPosition() ? "fixed" : "absolute")
    },
    _useFixedPosition: function() {
        var $container = this._getContainer();
        return this._isWindow($container) && (!iOS || void 0 !== this._bodyScrollTop)
    },
    _toggleSafariScrolling: function(scrollingEnabled) {
        if (iOS && this._useFixedPosition()) {
            var body = _dom_adapter.default.getBody();
            if (scrollingEnabled) {
                (0, _renderer.default)(body).removeClass(PREVENT_SAFARI_SCROLLING_CLASS);
                window.scrollTo(0, this._bodyScrollTop);
                this._bodyScrollTop = void 0
            } else {
                if (this.option("visible")) {
                    this._bodyScrollTop = window.pageYOffset;
                    (0, _renderer.default)(body).addClass(PREVENT_SAFARI_SCROLLING_CLASS)
                }
            }
        }
    },
    _renderWrapper: function() {
        this._fixWrapperPosition();
        this._renderWrapperDimensions();
        this._renderWrapperPosition()
    },
    _renderWrapperDimensions: function() {
        var wrapperWidth;
        var wrapperHeight;
        var $container = this._getContainer();
        if (!$container) {
            return
        }
        var isWindow = this._isWindow($container);
        wrapperWidth = isWindow ? "" : $container.outerWidth(), wrapperHeight = isWindow ? "" : $container.outerHeight();
        this._$wrapper.css({
            width: wrapperWidth,
            height: wrapperHeight
        })
    },
    _isWindow: function($element) {
        return !!$element && (0, _type.isWindow)($element.get(0))
    },
    _renderWrapperPosition: function() {
        var $container = this._getContainer();
        if ($container) {
            _position.default.setup(this._$wrapper, {
                my: "top left",
                at: "top left",
                of: $container
            })
        }
    },
    _getContainer: function() {
        var position = this._position;
        var container = this.option("container");
        var positionOf = null;
        if (!container && position) {
            var isEvent = !!(position.of && position.of.preventDefault);
            positionOf = isEvent ? window : position.of || window
        }
        return getElement(container || positionOf)
    },
    _renderDimensions: function() {
        var content = this._$content.get(0);
        this._$content.css({
            minWidth: this._getOptionValue("minWidth", content),
            maxWidth: this._getOptionValue("maxWidth", content),
            minHeight: this._getOptionValue("minHeight", content),
            maxHeight: this._getOptionValue("maxHeight", content),
            width: this._getOptionValue("width", content),
            height: this._getOptionValue("height", content)
        })
    },
    _renderPosition: function() {
        if (this._positionChangeHandled) {
            var allowedOffsets = this._allowedOffsets();
            this._changePosition({
                top: (0, _math.fitIntoRange)(0, -allowedOffsets.top, allowedOffsets.bottom),
                left: (0, _math.fitIntoRange)(0, -allowedOffsets.left, allowedOffsets.right)
            })
        } else {
            this._renderOverlayBoundaryOffset();
            (0, _translator.resetPosition)(this._$content);
            var position = this._transformStringPosition(this._position, POSITION_ALIASES);
            var resultPosition = _position.default.setup(this._$content, position);
            forceRepaint(this._$content);
            this._actions.onPositioning();
            return resultPosition
        }
    },
    _transformStringPosition: function(position, positionAliases) {
        if ((0, _type.isString)(position)) {
            position = (0, _extend.extend)({}, positionAliases[position])
        }
        return position
    },
    _renderOverlayBoundaryOffset: function() {
        var boundaryOffset = this.option("boundaryOffset");
        this._$content.css("margin", boundaryOffset.v + "px " + boundaryOffset.h + "px")
    },
    _focusTarget: function() {
        return this._$content
    },
    _attachKeyboardEvents: function() {
        var _this6 = this;
        this._keyboardListenerId = _short.keyboard.on(this._$content, null, function(opts) {
            return _this6._keyboardHandler(opts)
        })
    },
    _keyboardHandler: function(options) {
        var e = options.originalEvent;
        var $target = (0, _renderer.default)(e.target);
        if ($target.is(this._$content) || !this.option("ignoreChildEvents")) {
            this.callBase.apply(this, arguments)
        }
    },
    _isVisible: function() {
        return this.option("visible")
    },
    _visibilityChanged: function(visible) {
        if (visible) {
            if (this.option("visible")) {
                this._renderVisibilityAnimate(visible)
            }
        } else {
            this._renderVisibilityAnimate(visible)
        }
    },
    _dimensionChanged: function() {
        this._renderGeometry(true)
    },
    _clean: function() {
        if (!this._contentAlreadyRendered) {
            this.$content().empty()
        }
        this._renderVisibility(false);
        this._stopShowTimer();
        this._cleanFocusState()
    },
    _stopShowTimer: function() {
        if (this._asyncShowTimeout) {
            clearTimeout(this._asyncShowTimeout)
        }
        this._asyncShowTimeout = null
    },
    _dispose: function() {
        _fx.default.stop(this._$content, false);
        clearTimeout(this._deferShowTimer);
        this._toggleViewPortSubscription(false);
        this._toggleSubscriptions(false);
        this._updateZIndexStackPosition(false);
        this._toggleTabTerminator(false);
        this._toggleSafariScrolling(true);
        this._actions = null;
        this.callBase();
        zIndexPool.remove(this._zIndex);
        this._$wrapper.remove();
        this._$content.remove()
    },
    _toggleDisabledState: function(value) {
        this.callBase.apply(this, arguments);
        this._$content.toggleClass(DISABLED_STATE_CLASS, Boolean(value))
    },
    _toggleRTLDirection: function(rtl) {
        this._$content.toggleClass(RTL_DIRECTION_CLASS, rtl)
    },
    _optionChanged: function(args) {
        var _this7 = this;
        var value = args.value;
        if ((0, _array.inArray)(args.name, ACTIONS) > -1) {
            this._initActions();
            return
        }
        switch (args.name) {
            case "dragEnabled":
                this._renderDrag();
                this._renderGeometry();
                break;
            case "resizeEnabled":
                this._renderResize();
                this._renderGeometry();
                break;
            case "shading":
            case "shadingColor":
                this._toggleShading(this.option("visible"));
                break;
            case "width":
            case "height":
            case "minWidth":
            case "maxWidth":
            case "minHeight":
            case "maxHeight":
            case "boundaryOffset":
                this._renderGeometry();
                break;
            case "position":
                this._positionChangeHandled = false;
                this._renderGeometry();
                break;
            case "visible":
                this._renderVisibilityAnimate(value).done(function() {
                    if (!_this7._animateDeferred) {
                        return
                    }
                    _this7._animateDeferred.resolveWith(_this7)
                });
                break;
            case "target":
                this._initTarget(value);
                this._invalidate();
                break;
            case "container":
                this._initContainer(value);
                this._invalidate();
                break;
            case "innerOverlay":
                this._initInnerOverlayClass();
                break;
            case "deferRendering":
            case "contentTemplate":
                this._contentAlreadyRendered = false;
                this._clean();
                this._invalidate();
                break;
            case "hideTopOverlayHandler":
                this._toggleHideTopOverlayCallback(false);
                this._initHideTopOverlayHandler(args.value);
                this._toggleHideTopOverlayCallback(this.option("visible"));
                break;
            case "closeOnTargetScroll":
                this._toggleParentsScrollSubscription(this.option("visible"));
                break;
            case "closeOnOutsideClick":
            case "animation":
            case "propagateOutsideClick":
                break;
            case "rtlEnabled":
                this._contentAlreadyRendered = false;
                this.callBase(args);
                break;
            default:
                this.callBase(args)
        }
    },
    toggle: function(showing) {
        var _this8 = this;
        showing = void 0 === showing ? !this.option("visible") : showing;
        var result = new _deferred.Deferred;
        if (showing === this.option("visible")) {
            return result.resolveWith(this, [showing]).promise()
        }
        var animateDeferred = new _deferred.Deferred;
        this._animateDeferred = animateDeferred;
        this.option("visible", showing);
        animateDeferred.promise().done(function() {
            delete _this8._animateDeferred;
            result.resolveWith(_this8, [_this8.option("visible")])
        });
        return result.promise()
    },
    $content: function() {
        return this._$content
    },
    show: function() {
        return this.toggle(true)
    },
    hide: function() {
        return this.toggle(false)
    },
    content: function() {
        return (0, _element.getPublicElement)(this._$content)
    },
    repaint: function() {
        if (this._contentAlreadyRendered) {
            this._renderGeometry();
            (0, _visibility_change.triggerResizeEvent)(this._$content)
        } else {
            this.callBase()
        }
    }
});
Overlay.baseZIndex = function(zIndex) {
    return zIndexPool.base(zIndex)
};
(0, _component_registrator.default)("dxOverlay", Overlay);
var _default = Overlay;
exports.default = _default;
module.exports = exports.default;


/***/ }),

/***/ "./node_modules/devextreme/ui/overlay/z_index.js":
/*!*******************************************************!*\
  !*** ./node_modules/devextreme/ui/overlay/z_index.js ***!
  \*******************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/**
 * DevExtreme (ui/overlay/z_index.js)
 * Version: 20.2.3
 * Build date: Tue Oct 20 2020
 *
 * Copyright (c) 2012 - 2020 Developer Express Inc. ALL RIGHTS RESERVED
 * Read about DevExtreme licensing here: https://js.devexpress.com/Licensing/
 */

exports.clearStack = exports.remove = exports.create = exports.base = void 0;
var _common = __webpack_require__(/*! ../../core/utils/common */ "./node_modules/devextreme/core/utils/common.js");
var baseZIndex = 1500;
var zIndexStack = [];
var base = function(ZIndex) {
    baseZIndex = (0, _common.ensureDefined)(ZIndex, baseZIndex);
    return baseZIndex
};
exports.base = base;
var create = function() {
    var baseIndex = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : baseZIndex;
    var length = zIndexStack.length;
    var index = (length ? zIndexStack[length - 1] : baseIndex) + 1;
    zIndexStack.push(index);
    return index
};
exports.create = create;
var remove = function(zIndex) {
    var position = zIndexStack.indexOf(zIndex);
    if (position >= 0) {
        zIndexStack.splice(position, 1)
    }
};
exports.remove = remove;
var clearStack = function() {
    zIndexStack = []
};
exports.clearStack = clearStack;


/***/ }),

/***/ "./node_modules/devextreme/ui/resizable.js":
/*!*************************************************!*\
  !*** ./node_modules/devextreme/ui/resizable.js ***!
  \*************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/**
 * DevExtreme (ui/resizable.js)
 * Version: 20.2.3
 * Build date: Tue Oct 20 2020
 *
 * Copyright (c) 2012 - 2020 Developer Express Inc. ALL RIGHTS RESERVED
 * Read about DevExtreme licensing here: https://js.devexpress.com/Licensing/
 */

exports.default = void 0;
var _translator = __webpack_require__(/*! ../animation/translator */ "./node_modules/devextreme/animation/translator.js");
var _component_registrator = _interopRequireDefault(__webpack_require__(/*! ../core/component_registrator */ "./node_modules/devextreme/core/component_registrator.js"));
var _dom_component = _interopRequireDefault(__webpack_require__(/*! ../core/dom_component */ "./node_modules/devextreme/core/dom_component.js"));
var _renderer = _interopRequireDefault(__webpack_require__(/*! ../core/renderer */ "./node_modules/devextreme/core/renderer.js"));
var _array = __webpack_require__(/*! ../core/utils/array */ "./node_modules/devextreme/core/utils/array.js");
var _common = __webpack_require__(/*! ../core/utils/common */ "./node_modules/devextreme/core/utils/common.js");
var _extend = __webpack_require__(/*! ../core/utils/extend */ "./node_modules/devextreme/core/utils/extend.js");
var _iterator = __webpack_require__(/*! ../core/utils/iterator */ "./node_modules/devextreme/core/utils/iterator.js");
var _math = __webpack_require__(/*! ../core/utils/math */ "./node_modules/devextreme/core/utils/math.js");
var _type = __webpack_require__(/*! ../core/utils/type */ "./node_modules/devextreme/core/utils/type.js");
var _window = __webpack_require__(/*! ../core/utils/window */ "./node_modules/devextreme/core/utils/window.js");
var _events_engine = _interopRequireDefault(__webpack_require__(/*! ../events/core/events_engine */ "./node_modules/devextreme/events/core/events_engine.js"));
var _drag = __webpack_require__(/*! ../events/drag */ "./node_modules/devextreme/events/drag.js");
var _position = __webpack_require__(/*! ../core/utils/position */ "./node_modules/devextreme/core/utils/position.js");
var _index = __webpack_require__(/*! ../events/utils/index */ "./node_modules/devextreme/events/utils/index.js");
var _visibility_change = __webpack_require__(/*! ../events/visibility_change */ "./node_modules/devextreme/events/visibility_change.js");

function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
        "default": obj
    }
}
var RESIZABLE = "dxResizable";
var RESIZABLE_CLASS = "dx-resizable";
var RESIZABLE_RESIZING_CLASS = "dx-resizable-resizing";
var RESIZABLE_HANDLE_CLASS = "dx-resizable-handle";
var RESIZABLE_HANDLE_TOP_CLASS = "dx-resizable-handle-top";
var RESIZABLE_HANDLE_BOTTOM_CLASS = "dx-resizable-handle-bottom";
var RESIZABLE_HANDLE_LEFT_CLASS = "dx-resizable-handle-left";
var RESIZABLE_HANDLE_RIGHT_CLASS = "dx-resizable-handle-right";
var RESIZABLE_HANDLE_CORNER_CLASS = "dx-resizable-handle-corner";
var DRAGSTART_START_EVENT_NAME = (0, _index.addNamespace)(_drag.start, RESIZABLE);
var DRAGSTART_EVENT_NAME = (0, _index.addNamespace)(_drag.move, RESIZABLE);
var DRAGSTART_END_EVENT_NAME = (0, _index.addNamespace)(_drag.end, RESIZABLE);
var SIDE_BORDER_WIDTH_STYLES = {
    left: "borderLeftWidth",
    top: "borderTopWidth",
    right: "borderRightWidth",
    bottom: "borderBottomWidth"
};
var Resizable = _dom_component.default.inherit({
    _getDefaultOptions: function() {
        return (0, _extend.extend)(this.callBase(), {
            handles: "all",
            step: "1",
            stepPrecision: "simple",
            area: void 0,
            minWidth: 30,
            maxWidth: 1 / 0,
            minHeight: 30,
            maxHeight: 1 / 0,
            onResizeStart: null,
            onResize: null,
            onResizeEnd: null,
            roundStepValue: true
        })
    },
    _init: function() {
        this.callBase();
        this.$element().addClass(RESIZABLE_CLASS)
    },
    _initMarkup: function() {
        this.callBase();
        this._renderHandles()
    },
    _render: function() {
        this.callBase();
        this._renderActions()
    },
    _renderActions: function() {
        this._resizeStartAction = this._createActionByOption("onResizeStart");
        this._resizeEndAction = this._createActionByOption("onResizeEnd");
        this._resizeAction = this._createActionByOption("onResize")
    },
    _renderHandles: function() {
        var _this = this;
        this._handles = [];
        var handles = this.option("handles");
        if ("none" === handles) {
            return
        }
        var directions = "all" === handles ? ["top", "bottom", "left", "right"] : handles.split(" ");
        (0, _iterator.each)(directions, function(index, handleName) {
            _this._renderHandle(handleName)
        });
        (0, _array.inArray)("bottom", directions) + 1 && (0, _array.inArray)("right", directions) + 1 && this._renderHandle("corner-bottom-right");
        (0, _array.inArray)("bottom", directions) + 1 && (0, _array.inArray)("left", directions) + 1 && this._renderHandle("corner-bottom-left");
        (0, _array.inArray)("top", directions) + 1 && (0, _array.inArray)("right", directions) + 1 && this._renderHandle("corner-top-right");
        (0, _array.inArray)("top", directions) + 1 && (0, _array.inArray)("left", directions) + 1 && this._renderHandle("corner-top-left");
        this._attachEventHandlers()
    },
    _renderHandle: function(handleName) {
        var $handle = (0, _renderer.default)("<div>").addClass(RESIZABLE_HANDLE_CLASS).addClass(RESIZABLE_HANDLE_CLASS + "-" + handleName).appendTo(this.$element());
        this._handles.push($handle)
    },
    _attachEventHandlers: function() {
        if (this.option("disabled")) {
            return
        }
        var handlers = {};
        handlers[DRAGSTART_START_EVENT_NAME] = this._dragStartHandler.bind(this);
        handlers[DRAGSTART_EVENT_NAME] = this._dragHandler.bind(this);
        handlers[DRAGSTART_END_EVENT_NAME] = this._dragEndHandler.bind(this);
        this._handles.forEach(function(handleElement) {
            _events_engine.default.on(handleElement, handlers, {
                direction: "both",
                immediate: true
            })
        })
    },
    _detachEventHandlers: function() {
        this._handles.forEach(function(handleElement) {
            _events_engine.default.off(handleElement)
        })
    },
    _toggleEventHandlers: function(shouldAttachEvents) {
        shouldAttachEvents ? this._attachEventHandlers() : this._detachEventHandlers()
    },
    _dragStartHandler: function(e) {
        var $element = this.$element();
        if ($element.is(".dx-state-disabled, .dx-state-disabled *")) {
            e.cancel = true;
            return
        }
        this._toggleResizingClass(true);
        this._movingSides = this._getMovingSides(e);
        this._elementLocation = (0, _translator.locate)($element);
        var elementRect = (0, _position.getBoundingRect)($element.get(0));
        this._elementSize = {
            width: elementRect.width,
            height: elementRect.height
        };
        this._renderDragOffsets(e);
        this._resizeStartAction({
            event: e,
            width: this._elementSize.width,
            height: this._elementSize.height,
            handles: this._movingSides
        });
        e.targetElements = null
    },
    _toggleResizingClass: function(value) {
        this.$element().toggleClass(RESIZABLE_RESIZING_CLASS, value)
    },
    _renderDragOffsets: function(e) {
        var area = this._getArea();
        if (!area) {
            return
        }
        var $handle = (0, _renderer.default)(e.target).closest("." + RESIZABLE_HANDLE_CLASS);
        var handleWidth = $handle.outerWidth();
        var handleHeight = $handle.outerHeight();
        var handleOffset = $handle.offset();
        var areaOffset = area.offset;
        var scrollOffset = this._getAreaScrollOffset();
        e.maxLeftOffset = handleOffset.left - areaOffset.left - scrollOffset.scrollX;
        e.maxRightOffset = areaOffset.left + area.width - handleOffset.left - handleWidth + scrollOffset.scrollX;
        e.maxTopOffset = handleOffset.top - areaOffset.top - scrollOffset.scrollY;
        e.maxBottomOffset = areaOffset.top + area.height - handleOffset.top - handleHeight + scrollOffset.scrollY
    },
    _getBorderWidth: function($element, direction) {
        if ((0, _type.isWindow)($element.get(0))) {
            return 0
        }
        var borderWidth = $element.css(SIDE_BORDER_WIDTH_STYLES[direction]);
        return parseInt(borderWidth) || 0
    },
    _dragHandler: function(e) {
        var $element = this.$element();
        var sides = this._movingSides;
        var location = this._elementLocation;
        var size = this._elementSize;
        var offset = this._getOffset(e);
        var width = size.width + offset.x * (sides.left ? -1 : 1);
        var height = size.height + offset.y * (sides.top ? -1 : 1);
        if (offset.x || "strict" === this.option("stepPrecision")) {
            this._renderWidth(width)
        }
        if (offset.y || "strict" === this.option("stepPrecision")) {
            this._renderHeight(height)
        }
        var elementRect = (0, _position.getBoundingRect)($element.get(0));
        var offsetTop = offset.y - ((elementRect.height || height) - height);
        var offsetLeft = offset.x - ((elementRect.width || width) - width);
        (0, _translator.move)($element, {
            top: location.top + (sides.top ? offsetTop : 0),
            left: location.left + (sides.left ? offsetLeft : 0)
        });
        this._resizeAction({
            event: e,
            width: this.option("width") || width,
            height: this.option("height") || height,
            handles: this._movingSides
        });
        (0, _visibility_change.triggerResizeEvent)($element)
    },
    _getOffset: function(e) {
        var offset = e.offset;
        var steps = (0, _common.pairToObject)(this.option("step"), !this.option("roundStepValue"));
        var sides = this._getMovingSides(e);
        var strictPrecision = "strict" === this.option("stepPrecision");
        if (!sides.left && !sides.right) {
            offset.x = 0
        }
        if (!sides.top && !sides.bottom) {
            offset.y = 0
        }
        return strictPrecision ? this._getStrictOffset(offset, steps, sides) : this._getSimpleOffset(offset, steps)
    },
    _getSimpleOffset: function(offset, steps) {
        return {
            x: offset.x - offset.x % steps.h,
            y: offset.y - offset.y % steps.v
        }
    },
    _getStrictOffset: function(offset, steps, sides) {
        var location = this._elementLocation;
        var size = this._elementSize;
        var xPos = sides.left ? location.left : location.left + size.width;
        var yPos = sides.top ? location.top : location.top + size.height;
        var newXShift = (xPos + offset.x) % steps.h;
        var newYShift = (yPos + offset.y) % steps.v;
        var sign = Math.sign || function(x) {
            x = +x;
            if (0 === x || isNaN(x)) {
                return x
            }
            return x > 0 ? 1 : -1
        };
        var separatorOffset = function(steps, offset) {
            return (1 + .2 * sign(offset)) % 1 * steps
        };
        var isSmallOffset = function(offset, steps) {
            return Math.abs(offset) < .2 * steps
        };
        var newOffsetX = offset.x - newXShift;
        var newOffsetY = offset.y - newYShift;
        if (newXShift > separatorOffset(steps.h, offset.x)) {
            newOffsetX += steps.h
        }
        if (newYShift > separatorOffset(steps.v, offset.y)) {
            newOffsetY += steps.v
        }
        return {
            x: (sides.left || sides.right) && !isSmallOffset(offset.x, steps.h) ? newOffsetX : 0,
            y: (sides.top || sides.bottom) && !isSmallOffset(offset.y, steps.v) ? newOffsetY : 0
        }
    },
    _getMovingSides: function(e) {
        var $target = (0, _renderer.default)(e.target);
        var hasCornerTopLeftClass = $target.hasClass(RESIZABLE_HANDLE_CORNER_CLASS + "-top-left");
        var hasCornerTopRightClass = $target.hasClass(RESIZABLE_HANDLE_CORNER_CLASS + "-top-right");
        var hasCornerBottomLeftClass = $target.hasClass(RESIZABLE_HANDLE_CORNER_CLASS + "-bottom-left");
        var hasCornerBottomRightClass = $target.hasClass(RESIZABLE_HANDLE_CORNER_CLASS + "-bottom-right");
        return {
            top: $target.hasClass(RESIZABLE_HANDLE_TOP_CLASS) || hasCornerTopLeftClass || hasCornerTopRightClass,
            left: $target.hasClass(RESIZABLE_HANDLE_LEFT_CLASS) || hasCornerTopLeftClass || hasCornerBottomLeftClass,
            bottom: $target.hasClass(RESIZABLE_HANDLE_BOTTOM_CLASS) || hasCornerBottomLeftClass || hasCornerBottomRightClass,
            right: $target.hasClass(RESIZABLE_HANDLE_RIGHT_CLASS) || hasCornerTopRightClass || hasCornerBottomRightClass
        }
    },
    _getArea: function() {
        var area = this.option("area");
        if ((0, _type.isFunction)(area)) {
            area = area.call(this)
        }
        if ((0, _type.isPlainObject)(area)) {
            return this._getAreaFromObject(area)
        }
        return this._getAreaFromElement(area)
    },
    _getAreaScrollOffset: function() {
        var area = this.option("area");
        var isElement = !(0, _type.isFunction)(area) && !(0, _type.isPlainObject)(area);
        var scrollOffset = {
            scrollY: 0,
            scrollX: 0
        };
        if (isElement) {
            var areaElement = (0, _renderer.default)(area)[0];
            if ((0, _type.isWindow)(areaElement)) {
                scrollOffset.scrollX = areaElement.pageXOffset;
                scrollOffset.scrollY = areaElement.pageYOffset
            }
        }
        return scrollOffset
    },
    _getAreaFromObject: function(area) {
        var result = {
            width: area.right - area.left,
            height: area.bottom - area.top,
            offset: {
                left: area.left,
                top: area.top
            }
        };
        this._correctAreaGeometry(result);
        return result
    },
    _getAreaFromElement: function(area) {
        var $area = (0, _renderer.default)(area);
        var result;
        if ($area.length) {
            result = {
                width: $area.innerWidth(),
                height: $area.innerHeight(),
                offset: (0, _extend.extend)({
                    top: 0,
                    left: 0
                }, (0, _type.isWindow)($area[0]) ? {} : $area.offset())
            };
            this._correctAreaGeometry(result, $area)
        }
        return result
    },
    _correctAreaGeometry: function(result, $area) {
        var areaBorderLeft = $area ? this._getBorderWidth($area, "left") : 0;
        var areaBorderTop = $area ? this._getBorderWidth($area, "top") : 0;
        result.offset.left += areaBorderLeft + this._getBorderWidth(this.$element(), "left");
        result.offset.top += areaBorderTop + this._getBorderWidth(this.$element(), "top");
        result.width -= this.$element().outerWidth() - this.$element().innerWidth();
        result.height -= this.$element().outerHeight() - this.$element().innerHeight()
    },
    _dragEndHandler: function(e) {
        var $element = this.$element();
        this._resizeEndAction({
            event: e,
            width: $element.outerWidth(),
            height: $element.outerHeight(),
            handles: this._movingSides
        });
        this._toggleResizingClass(false)
    },
    _renderWidth: function(width) {
        this.option("width", (0, _math.fitIntoRange)(width, this.option("minWidth"), this.option("maxWidth")))
    },
    _renderHeight: function(height) {
        this.option("height", (0, _math.fitIntoRange)(height, this.option("minHeight"), this.option("maxHeight")))
    },
    _optionChanged: function(args) {
        switch (args.name) {
            case "disabled":
                this._toggleEventHandlers(!args.value);
                this.callBase(args);
                break;
            case "handles":
                this._invalidate();
                break;
            case "minWidth":
            case "maxWidth":
                (0, _window.hasWindow)() && this._renderWidth(this.$element().outerWidth());
                break;
            case "minHeight":
            case "maxHeight":
                (0, _window.hasWindow)() && this._renderHeight(this.$element().outerHeight());
                break;
            case "onResize":
            case "onResizeStart":
            case "onResizeEnd":
                this._renderActions();
                break;
            case "area":
            case "stepPrecision":
            case "step":
            case "roundStepValue":
                break;
            default:
                this.callBase(args)
        }
    },
    _clean: function() {
        this.$element().find("." + RESIZABLE_HANDLE_CLASS).remove()
    },
    _useTemplates: function() {
        return false
    }
});
(0, _component_registrator.default)(RESIZABLE, Resizable);
var _default = Resizable;
exports.default = _default;
module.exports = exports.default;
module.exports.default = module.exports;


/***/ }),

/***/ "./node_modules/devextreme/ui/themes.js":
/*!**********************************************!*\
  !*** ./node_modules/devextreme/ui/themes.js ***!
  \**********************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/**
 * DevExtreme (ui/themes.js)
 * Version: 20.2.3
 * Build date: Tue Oct 20 2020
 *
 * Copyright (c) 2012 - 2020 Developer Express Inc. ALL RIGHTS RESERVED
 * Read about DevExtreme licensing here: https://js.devexpress.com/Licensing/
 */

exports.waitForThemeLoad = waitForThemeLoad;
exports.init = init;
exports.current = current;
exports.attachCssClasses = attachCssClasses;
exports.detachCssClasses = detachCssClasses;
exports.isMaterial = isMaterial;
exports.isGeneric = isGeneric;
exports.isDark = isDark;
exports.isWebFontLoaded = isWebFontLoaded;
exports.waitWebFont = waitWebFont;
exports.ready = themeReady;
exports.resetTheme = resetTheme;
exports.initialized = initialized;
exports.setDefaultTimeout = setDefaultTimeout;
var _devices = _interopRequireDefault(__webpack_require__(/*! ../core/devices */ "./node_modules/devextreme/core/devices.js"));
var _dom_adapter = _interopRequireDefault(__webpack_require__(/*! ../core/dom_adapter */ "./node_modules/devextreme/core/dom_adapter.js"));
var _promise = _interopRequireDefault(__webpack_require__(/*! ../core/polyfills/promise */ "./node_modules/devextreme/core/polyfills/promise.js"));
var _renderer = _interopRequireDefault(__webpack_require__(/*! ../core/renderer */ "./node_modules/devextreme/core/renderer.js"));
var _deferred = __webpack_require__(/*! ../core/utils/deferred */ "./node_modules/devextreme/core/utils/deferred.js");
var _html_parser = __webpack_require__(/*! ../core/utils/html_parser */ "./node_modules/devextreme/core/utils/html_parser.js");
var _iterator = __webpack_require__(/*! ../core/utils/iterator */ "./node_modules/devextreme/core/utils/iterator.js");
var _ready_callbacks = _interopRequireDefault(__webpack_require__(/*! ../core/utils/ready_callbacks */ "./node_modules/devextreme/core/utils/ready_callbacks.js"));
var _view_port = __webpack_require__(/*! ../core/utils/view_port */ "./node_modules/devextreme/core/utils/view_port.js");
var _window = __webpack_require__(/*! ../core/utils/window */ "./node_modules/devextreme/core/utils/window.js");
var _themes_callback = __webpack_require__(/*! ./themes_callback */ "./node_modules/devextreme/ui/themes_callback.js");
var _ui = _interopRequireDefault(__webpack_require__(/*! ./widget/ui.errors */ "./node_modules/devextreme/ui/widget/ui.errors.js"));

function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
        "default": obj
    }
}
var window = (0, _window.getWindow)();
var ready = _ready_callbacks.default.add;
var viewPort = _view_port.value;
var viewPortChanged = _view_port.changeCallback;
var initDeferred = new _deferred.Deferred;
var DX_LINK_SELECTOR = "link[rel=dx-theme]";
var THEME_ATTR = "data-theme";
var ACTIVE_ATTR = "data-active";
var DX_HAIRLINES_CLASS = "dx-hairlines";
var ANY_THEME = "any";
var context;
var $activeThemeLink;
var knownThemes;
var currentThemeName;
var pendingThemeName;
var defaultTimeout = 15e3;
var THEME_MARKER_PREFIX = "dx.";

function readThemeMarker() {
    if (!(0, _window.hasWindow)()) {
        return null
    }
    var element = (0, _renderer.default)("<div>", context).addClass("dx-theme-marker").appendTo(context.documentElement);
    var result;
    try {
        result = element.css("fontFamily");
        if (!result) {
            return null
        }
        result = result.replace(/["']/g, "");
        if (result.substr(0, THEME_MARKER_PREFIX.length) !== THEME_MARKER_PREFIX) {
            return null
        }
        return result.substr(THEME_MARKER_PREFIX.length)
    } finally {
        element.remove()
    }
}

function waitForThemeLoad(themeName) {
    var waitStartTime;
    var timerId;
    var intervalCleared = true;
    pendingThemeName = themeName;

    function handleLoaded() {
        pendingThemeName = null;
        clearInterval(timerId);
        intervalCleared = true;
        _themes_callback.themeReadyCallback.fire();
        _themes_callback.themeReadyCallback.empty();
        initDeferred.resolve()
    }
    if (isPendingThemeLoaded() || !defaultTimeout) {
        handleLoaded()
    } else {
        if (!intervalCleared) {
            if (pendingThemeName) {
                pendingThemeName = themeName
            }
            return
        }
        waitStartTime = Date.now();
        intervalCleared = false;
        timerId = setInterval(function() {
            var isLoaded = isPendingThemeLoaded();
            var isTimeout = !isLoaded && Date.now() - waitStartTime > defaultTimeout;
            if (isTimeout) {
                _ui.default.log("W0004", pendingThemeName)
            }
            if (isLoaded || isTimeout) {
                handleLoaded()
            }
        }, 10)
    }
}

function isPendingThemeLoaded() {
    if (!pendingThemeName) {
        return true
    }
    var anyThemePending = pendingThemeName === ANY_THEME;
    if ("resolved" === initDeferred.state() && anyThemePending) {
        return true
    }
    var themeMarker = readThemeMarker();
    if (themeMarker && anyThemePending) {
        return true
    }
    return themeMarker === pendingThemeName
}

function processMarkup() {
    var $allThemeLinks = (0, _renderer.default)(DX_LINK_SELECTOR, context);
    if (!$allThemeLinks.length) {
        return
    }
    knownThemes = {};
    $activeThemeLink = (0, _renderer.default)((0, _html_parser.parseHTML)("<link rel=stylesheet>"), context);
    $allThemeLinks.each(function() {
        var link = (0, _renderer.default)(this, context);
        var fullThemeName = link.attr(THEME_ATTR);
        var url = link.attr("href");
        var isActive = "true" === link.attr(ACTIVE_ATTR);
        knownThemes[fullThemeName] = {
            url: url,
            isActive: isActive
        }
    });
    $allThemeLinks.last().after($activeThemeLink);
    $allThemeLinks.remove()
}

function resolveFullThemeName(desiredThemeName) {
    var desiredThemeParts = desiredThemeName ? desiredThemeName.split(".") : [];
    var result = null;
    if (knownThemes) {
        if (desiredThemeName in knownThemes) {
            return desiredThemeName
        }(0, _iterator.each)(knownThemes, function(knownThemeName, themeData) {
            var knownThemeParts = knownThemeName.split(".");
            if (desiredThemeParts[0] && knownThemeParts[0] !== desiredThemeParts[0]) {
                return
            }
            if (desiredThemeParts[1] && desiredThemeParts[1] !== knownThemeParts[1]) {
                return
            }
            if (desiredThemeParts[2] && desiredThemeParts[2] !== knownThemeParts[2]) {
                return
            }
            if (!result || themeData.isActive) {
                result = knownThemeName
            }
            if (themeData.isActive) {
                return false
            }
        })
    }
    return result
}

function initContext(newContext) {
    try {
        if (newContext !== context) {
            knownThemes = null
        }
    } catch (x) {
        knownThemes = null
    }
    context = newContext
}

function init(options) {
    options = options || {};
    initContext(options.context || _dom_adapter.default.getDocument());
    if (!context) {
        return
    }
    processMarkup();
    currentThemeName = void 0;
    current(options)
}

function current(options) {
    if (!arguments.length) {
        currentThemeName = currentThemeName || readThemeMarker();
        return currentThemeName
    }
    detachCssClasses(viewPort());
    options = options || {};
    if ("string" === typeof options) {
        options = {
            theme: options
        }
    }
    var isAutoInit = options._autoInit;
    var loadCallback = options.loadCallback;
    var currentThemeData;
    currentThemeName = resolveFullThemeName(options.theme || currentThemeName);
    if (currentThemeName) {
        currentThemeData = knownThemes[currentThemeName]
    }
    if (loadCallback) {
        _themes_callback.themeReadyCallback.add(loadCallback)
    }
    if (currentThemeData) {
        $activeThemeLink.attr("href", knownThemes[currentThemeName].url);
        if (_themes_callback.themeReadyCallback.has() || "resolved" !== initDeferred.state() || options._forceTimeout) {
            waitForThemeLoad(currentThemeName)
        }
    } else {
        if (isAutoInit) {
            waitForThemeLoad(ANY_THEME);
            _themes_callback.themeReadyCallback.fire();
            _themes_callback.themeReadyCallback.empty()
        } else {
            throw _ui.default.Error("E0021", currentThemeName)
        }
    }
    initDeferred.done(function() {
        return attachCssClasses((0, _view_port.originalViewPort)(), currentThemeName)
    })
}

function getCssClasses(themeName) {
    themeName = themeName || current();
    var result = [];
    var themeNameParts = themeName && themeName.split(".");
    if (themeNameParts) {
        result.push("dx-theme-" + themeNameParts[0], "dx-theme-" + themeNameParts[0] + "-typography");
        if (themeNameParts.length > 1) {
            result.push("dx-color-scheme-" + themeNameParts[1] + (isMaterial(themeName) ? "-" + themeNameParts[2] : ""))
        }
    }
    return result
}
var themeClasses;

function attachCssClasses(element, themeName) {
    themeClasses = getCssClasses(themeName).join(" ");
    (0, _renderer.default)(element).addClass(themeClasses);
    var activateHairlines = function() {
        var pixelRatio = (0, _window.hasWindow)() && window.devicePixelRatio;
        if (!pixelRatio || pixelRatio < 2) {
            return
        }
        var $tester = (0, _renderer.default)("<div>");
        $tester.css("border", ".5px solid transparent");
        (0, _renderer.default)("body").append($tester);
        if (1 === $tester.outerHeight()) {
            (0, _renderer.default)(element).addClass(DX_HAIRLINES_CLASS);
            themeClasses += " " + DX_HAIRLINES_CLASS
        }
        $tester.remove()
    };
    activateHairlines()
}

function detachCssClasses(element) {
    (0, _renderer.default)(element).removeClass(themeClasses)
}

function themeReady(callback) {
    _themes_callback.themeReadyCallback.add(callback)
}

function isTheme(themeRegExp, themeName) {
    if (!themeName) {
        themeName = currentThemeName || readThemeMarker()
    }
    return new RegExp(themeRegExp).test(themeName)
}

function isMaterial(themeName) {
    return isTheme("material", themeName)
}

function isGeneric(themeName) {
    return isTheme("generic", themeName)
}

function isDark(themeName) {
    return isTheme("dark", themeName)
}

function isWebFontLoaded(text, fontWeight) {
    var testedFont = "Roboto, RobotoFallback, Arial";
    var etalonFont = "Arial";
    var document = _dom_adapter.default.getDocument();
    var testElement = document.createElement("span");
    testElement.style.position = "absolute";
    testElement.style.top = "-9999px";
    testElement.style.left = "-9999px";
    testElement.style.visibility = "hidden";
    testElement.style.fontFamily = etalonFont;
    testElement.style.fontSize = "250px";
    testElement.style.fontWeight = fontWeight;
    testElement.innerHTML = text;
    document.body.appendChild(testElement);
    var etalonFontWidth = testElement.offsetWidth;
    testElement.style.fontFamily = testedFont;
    var testedFontWidth = testElement.offsetWidth;
    testElement.parentNode.removeChild(testElement);
    return etalonFontWidth !== testedFontWidth
}

function waitWebFont(text, fontWeight) {
    var interval = 15;
    var timeout = 2e3;
    return new _promise.default(function(resolve) {
        var check = function() {
            if (isWebFontLoaded(text, fontWeight)) {
                clear()
            }
        };
        var clear = function() {
            clearInterval(intervalId);
            clearTimeout(timeoutId);
            resolve()
        };
        var intervalId = setInterval(check, interval);
        var timeoutId = setTimeout(clear, timeout)
    })
}

function autoInit() {
    init({
        _autoInit: true,
        _forceTimeout: true
    });
    if ((0, _renderer.default)(DX_LINK_SELECTOR, context).length) {
        throw _ui.default.Error("E0022")
    }
}
if ((0, _window.hasWindow)()) {
    autoInit()
} else {
    ready(autoInit)
}
viewPortChanged.add(function(viewPort, prevViewPort) {
    initDeferred.done(function() {
        detachCssClasses(prevViewPort);
        attachCssClasses(viewPort)
    })
});
_devices.default.changed.add(function() {
    init({
        _autoInit: true
    })
});

function resetTheme() {
    $activeThemeLink && $activeThemeLink.attr("href", "about:blank");
    currentThemeName = null;
    pendingThemeName = null;
    initDeferred = new _deferred.Deferred
}

function initialized(callback) {
    initDeferred.done(callback)
}

function setDefaultTimeout(timeout) {
    defaultTimeout = timeout
}
module.exports.default = module.exports;


/***/ }),

/***/ "./node_modules/devextreme/ui/themes_callback.js":
/*!*******************************************************!*\
  !*** ./node_modules/devextreme/ui/themes_callback.js ***!
  \*******************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/**
 * DevExtreme (ui/themes_callback.js)
 * Version: 20.2.3
 * Build date: Tue Oct 20 2020
 *
 * Copyright (c) 2012 - 2020 Developer Express Inc. ALL RIGHTS RESERVED
 * Read about DevExtreme licensing here: https://js.devexpress.com/Licensing/
 */

exports.themeReadyCallback = void 0;
var _callbacks = _interopRequireDefault(__webpack_require__(/*! ../core/utils/callbacks */ "./node_modules/devextreme/core/utils/callbacks.js"));

function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
        "default": obj
    }
}
var themeReadyCallback = new _callbacks.default;
exports.themeReadyCallback = themeReadyCallback;


/***/ }),

/***/ "./node_modules/devextreme/ui/toast.js":
/*!*********************************************!*\
  !*** ./node_modules/devextreme/ui/toast.js ***!
  \*********************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/**
 * DevExtreme (ui/toast.js)
 * Version: 20.2.3
 * Build date: Tue Oct 20 2020
 *
 * Copyright (c) 2012 - 2020 Developer Express Inc. ALL RIGHTS RESERVED
 * Read about DevExtreme licensing here: https://js.devexpress.com/Licensing/
 */

exports.default = void 0;
var _renderer = _interopRequireDefault(__webpack_require__(/*! ../core/renderer */ "./node_modules/devextreme/core/renderer.js"));
var _window = __webpack_require__(/*! ../core/utils/window */ "./node_modules/devextreme/core/utils/window.js");
var _dom_adapter = _interopRequireDefault(__webpack_require__(/*! ../core/dom_adapter */ "./node_modules/devextreme/core/dom_adapter.js"));
var _events_engine = _interopRequireDefault(__webpack_require__(/*! ../events/core/events_engine */ "./node_modules/devextreme/events/core/events_engine.js"));
var _ready_callbacks = _interopRequireDefault(__webpack_require__(/*! ../core/utils/ready_callbacks */ "./node_modules/devextreme/core/utils/ready_callbacks.js"));
var _common = __webpack_require__(/*! ../core/utils/common */ "./node_modules/devextreme/core/utils/common.js");
var _type = __webpack_require__(/*! ../core/utils/type */ "./node_modules/devextreme/core/utils/type.js");
var _extend = __webpack_require__(/*! ../core/utils/extend */ "./node_modules/devextreme/core/utils/extend.js");
var _array = __webpack_require__(/*! ../core/utils/array */ "./node_modules/devextreme/core/utils/array.js");
var _pointer = _interopRequireDefault(__webpack_require__(/*! ../events/pointer */ "./node_modules/devextreme/events/pointer.js"));
var _component_registrator = _interopRequireDefault(__webpack_require__(/*! ../core/component_registrator */ "./node_modules/devextreme/core/component_registrator.js"));
var _overlay = _interopRequireDefault(__webpack_require__(/*! ./overlay */ "./node_modules/devextreme/ui/overlay.js"));
var _themes = __webpack_require__(/*! ./themes */ "./node_modules/devextreme/ui/themes.js");

function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
        "default": obj
    }
}
var window = (0, _window.getWindow)();
var ready = _ready_callbacks.default.add;
var TOAST_CLASS = "dx-toast";
var TOAST_CLASS_PREFIX = TOAST_CLASS + "-";
var TOAST_WRAPPER_CLASS = TOAST_CLASS_PREFIX + "wrapper";
var TOAST_CONTENT_CLASS = TOAST_CLASS_PREFIX + "content";
var TOAST_MESSAGE_CLASS = TOAST_CLASS_PREFIX + "message";
var TOAST_ICON_CLASS = TOAST_CLASS_PREFIX + "icon";
var WIDGET_NAME = "dxToast";
var toastTypes = ["info", "warning", "error", "success"];
var TOAST_STACK = [];
var FIRST_Z_INDEX_OFFSET = 8e3;
var visibleToastInstance = null;
var POSITION_ALIASES = {
    top: {
        my: "top",
        at: "top",
        of: null,
        offset: "0 0"
    },
    bottom: {
        my: "bottom",
        at: "bottom",
        of: null,
        offset: "0 -20"
    },
    center: {
        my: "center",
        at: "center",
        of: null,
        offset: "0 0"
    },
    right: {
        my: "center right",
        at: "center right",
        of: null,
        offset: "0 0"
    },
    left: {
        my: "center left",
        at: "center left",
        of: null,
        offset: "0 0"
    }
};
ready(function() {
    _events_engine.default.subscribeGlobal(_dom_adapter.default.getDocument(), _pointer.default.down, function(e) {
        for (var i = TOAST_STACK.length - 1; i >= 0; i--) {
            if (!TOAST_STACK[i]._proxiedDocumentDownHandler(e)) {
                return
            }
        }
    })
});
var Toast = _overlay.default.inherit({
    _getDefaultOptions: function() {
        return (0, _extend.extend)(this.callBase(), {
            message: "",
            type: "info",
            displayTime: 2e3,
            position: "bottom center",
            animation: {
                show: {
                    type: "fade",
                    duration: 400,
                    from: 0,
                    to: 1
                },
                hide: {
                    type: "fade",
                    duration: 400,
                    to: 0
                }
            },
            shading: false,
            height: "auto",
            hideTopOverlayHandler: null,
            closeOnSwipe: true,
            closeOnClick: false,
            resizeEnabled: false
        })
    },
    _defaultOptionsRules: function() {
        return this.callBase().concat([{
            device: {
                platform: "android"
            },
            options: {
                closeOnOutsideClick: true,
                width: "auto",
                position: {
                    at: "bottom left",
                    my: "bottom left",
                    offset: "20 -20"
                },
                animation: {
                    show: {
                        type: "slide",
                        duration: 200,
                        from: {
                            position: {
                                my: "top",
                                at: "bottom",
                                of: window
                            }
                        }
                    },
                    hide: {
                        type: "slide",
                        duration: 200,
                        to: {
                            position: {
                                my: "top",
                                at: "bottom",
                                of: window
                            }
                        }
                    }
                }
            }
        }, {
            device: function(_device) {
                var isPhone = "phone" === _device.deviceType;
                var isAndroid = "android" === _device.platform;
                return isPhone && isAndroid
            },
            options: {
                width: function() {
                    var _window$visualViewpor;
                    return (null === window || void 0 === window ? void 0 : null === (_window$visualViewpor = window.visualViewport) || void 0 === _window$visualViewpor ? void 0 : _window$visualViewpor.width) || (0, _renderer.default)(window).width()
                },
                position: {
                    at: "bottom center",
                    my: "bottom center",
                    offset: "0 0"
                }
            }
        }, {
            device: function(_device2) {
                return "phone" === _device2.deviceType
            },
            options: {
                width: function() {
                    var _window$visualViewpor2;
                    return (null === window || void 0 === window ? void 0 : null === (_window$visualViewpor2 = window.visualViewport) || void 0 === _window$visualViewpor2 ? void 0 : _window$visualViewpor2.width) || (0, _renderer.default)(window).width()
                }
            }
        }, {
            device: function() {
                return (0, _themes.isMaterial)()
            },
            options: {
                minWidth: 344,
                maxWidth: 568,
                displayTime: 4e3
            }
        }])
    },
    _init: function() {
        this.callBase();
        this._posStringToObject()
    },
    _renderContentImpl: function() {
        if (this.option("message")) {
            this._message = (0, _renderer.default)("<div>").addClass(TOAST_MESSAGE_CLASS).text(this.option("message")).appendTo(this.$content())
        }
        this.setAria("role", "alert", this._message);
        if ((0, _array.inArray)(this.option("type").toLowerCase(), toastTypes) > -1) {
            this.$content().prepend((0, _renderer.default)("<div>").addClass(TOAST_ICON_CLASS))
        }
        this.callBase()
    },
    _render: function() {
        this.callBase();
        this.$element().addClass(TOAST_CLASS);
        this._wrapper().addClass(TOAST_WRAPPER_CLASS);
        this._$content.addClass(TOAST_CLASS_PREFIX + String(this.option("type")).toLowerCase());
        this.$content().addClass(TOAST_CONTENT_CLASS);
        this._toggleCloseEvents("Swipe");
        this._toggleCloseEvents("Click")
    },
    _renderScrollTerminator: _common.noop,
    _toggleCloseEvents: function(event) {
        var dxEvent = "dx" + event.toLowerCase();
        _events_engine.default.off(this._$content, dxEvent);
        this.option("closeOn" + event) && _events_engine.default.on(this._$content, dxEvent, this.hide.bind(this))
    },
    _posStringToObject: function() {
        if (!(0, _type.isString)(this.option("position"))) {
            return
        }
        var verticalPosition = this.option("position").split(" ")[0];
        var horizontalPosition = this.option("position").split(" ")[1];
        this.option("position", (0, _extend.extend)({}, POSITION_ALIASES[verticalPosition]));
        switch (horizontalPosition) {
            case "center":
            case "left":
            case "right":
                this.option("position").at += " " + horizontalPosition;
                this.option("position").my += " " + horizontalPosition
        }
    },
    _show: function() {
        if (visibleToastInstance && visibleToastInstance !== this) {
            clearTimeout(visibleToastInstance._hideTimeout);
            visibleToastInstance.hide()
        }
        visibleToastInstance = this;
        return this.callBase.apply(this, arguments).done(function() {
            clearTimeout(this._hideTimeout);
            this._hideTimeout = setTimeout(this.hide.bind(this), this.option("displayTime"))
        }.bind(this))
    },
    _hide: function() {
        visibleToastInstance = null;
        return this.callBase.apply(this, arguments)
    },
    _overlayStack: function() {
        return TOAST_STACK
    },
    _zIndexInitValue: function() {
        return this.callBase() + FIRST_Z_INDEX_OFFSET
    },
    _dispose: function() {
        clearTimeout(this._hideTimeout);
        visibleToastInstance = null;
        this.callBase()
    },
    _optionChanged: function(args) {
        switch (args.name) {
            case "type":
                this._$content.removeClass(TOAST_CLASS_PREFIX + args.previousValue);
                this._$content.addClass(TOAST_CLASS_PREFIX + String(args.value).toLowerCase());
                break;
            case "message":
                if (this._message) {
                    this._message.text(args.value)
                }
                break;
            case "closeOnSwipe":
                this._toggleCloseEvents("Swipe");
                break;
            case "closeOnClick":
                this._toggleCloseEvents("Click");
                break;
            case "displayTime":
            case "position":
                break;
            default:
                this.callBase(args)
        }
    }
});
(0, _component_registrator.default)(WIDGET_NAME, Toast);
var _default = Toast;
exports.default = _default;
module.exports = exports.default;
module.exports.default = module.exports;


/***/ }),

/***/ "./node_modules/devextreme/ui/widget/selectors.js":
/*!********************************************************!*\
  !*** ./node_modules/devextreme/ui/widget/selectors.js ***!
  \********************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/**
 * DevExtreme (ui/widget/selectors.js)
 * Version: 20.2.3
 * Build date: Tue Oct 20 2020
 *
 * Copyright (c) 2012 - 2020 Developer Express Inc. ALL RIGHTS RESERVED
 * Read about DevExtreme licensing here: https://js.devexpress.com/Licensing/
 */

exports.focused = exports.tabbable = exports.focusable = void 0;
var _renderer = _interopRequireDefault(__webpack_require__(/*! ../../core/renderer */ "./node_modules/devextreme/core/renderer.js"));
var _dom_adapter = _interopRequireDefault(__webpack_require__(/*! ../../core/dom_adapter */ "./node_modules/devextreme/core/dom_adapter.js"));

function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
        "default": obj
    }
}
var focusableFn = function(element, tabIndex) {
    if (!visible(element)) {
        return false
    }
    var nodeName = element.nodeName.toLowerCase();
    var isTabIndexNotNaN = !isNaN(tabIndex);
    var isDisabled = element.disabled;
    var isDefaultFocus = /^(input|select|textarea|button|object|iframe)$/.test(nodeName);
    var isHyperlink = "a" === nodeName;
    var isFocusable = true;
    var isContentEditable = element.isContentEditable;
    if (isDefaultFocus || isContentEditable) {
        isFocusable = !isDisabled
    } else {
        if (isHyperlink) {
            isFocusable = element.href || isTabIndexNotNaN
        } else {
            isFocusable = isTabIndexNotNaN
        }
    }
    return isFocusable
};

function visible(element) {
    var $element = (0, _renderer.default)(element);
    return $element.is(":visible") && "hidden" !== $element.css("visibility") && "hidden" !== $element.parents().css("visibility")
}
var focusable = function(index, element) {
    return focusableFn(element, (0, _renderer.default)(element).attr("tabIndex"))
};
exports.focusable = focusable;
var tabbable = function(index, element) {
    var tabIndex = (0, _renderer.default)(element).attr("tabIndex");
    return (isNaN(tabIndex) || tabIndex >= 0) && focusableFn(element, tabIndex)
};
exports.tabbable = tabbable;
var focused = function($element) {
    var element = (0, _renderer.default)($element).get(0);
    return _dom_adapter.default.getActiveElement() === element
};
exports.focused = focused;


/***/ }),

/***/ "./node_modules/devextreme/ui/widget/swatch_container.js":
/*!***************************************************************!*\
  !*** ./node_modules/devextreme/ui/widget/swatch_container.js ***!
  \***************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/**
 * DevExtreme (ui/widget/swatch_container.js)
 * Version: 20.2.3
 * Build date: Tue Oct 20 2020
 *
 * Copyright (c) 2012 - 2020 Developer Express Inc. ALL RIGHTS RESERVED
 * Read about DevExtreme licensing here: https://js.devexpress.com/Licensing/
 */

exports.default = void 0;
var _renderer = _interopRequireDefault(__webpack_require__(/*! ../../core/renderer */ "./node_modules/devextreme/core/renderer.js"));
var _view_port = __webpack_require__(/*! ../../core/utils/view_port */ "./node_modules/devextreme/core/utils/view_port.js");

function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
        "default": obj
    }
}
var SWATCH_CONTAINER_CLASS_PREFIX = "dx-swatch-";
var getSwatchContainer = function(element) {
    var $element = (0, _renderer.default)(element);
    var swatchContainer = $element.closest('[class^="'.concat(SWATCH_CONTAINER_CLASS_PREFIX, '"], [class*=" ').concat(SWATCH_CONTAINER_CLASS_PREFIX, '"]'));
    var viewport = (0, _view_port.value)();
    if (!swatchContainer.length) {
        return viewport
    }
    var swatchClassRegex = new RegExp("(\\s|^)(".concat(SWATCH_CONTAINER_CLASS_PREFIX, ".*?)(\\s|$)"));
    var swatchClass = swatchContainer[0].className.match(swatchClassRegex)[2];
    var viewportSwatchContainer = viewport.children("." + swatchClass);
    if (!viewportSwatchContainer.length) {
        viewportSwatchContainer = (0, _renderer.default)("<div>").addClass(swatchClass).appendTo(viewport)
    }
    return viewportSwatchContainer
};
var _default = {
    getSwatchContainer: getSwatchContainer
};
exports.default = _default;
module.exports = exports.default;


/***/ }),

/***/ "./node_modules/devextreme/ui/widget/ui.errors.js":
/*!********************************************************!*\
  !*** ./node_modules/devextreme/ui/widget/ui.errors.js ***!
  \********************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/**
 * DevExtreme (ui/widget/ui.errors.js)
 * Version: 20.2.3
 * Build date: Tue Oct 20 2020
 *
 * Copyright (c) 2012 - 2020 Developer Express Inc. ALL RIGHTS RESERVED
 * Read about DevExtreme licensing here: https://js.devexpress.com/Licensing/
 */

exports.default = void 0;
var _error = _interopRequireDefault(__webpack_require__(/*! ../../core/utils/error */ "./node_modules/devextreme/core/utils/error.js"));
var _errors = _interopRequireDefault(__webpack_require__(/*! ../../core/errors */ "./node_modules/devextreme/core/errors.js"));

function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
        "default": obj
    }
}
var _default = (0, _error.default)(_errors.default.ERROR_MESSAGES, {
    E1001: "Module '{0}'. Controller '{1}' is already registered",
    E1002: "Module '{0}'. Controller '{1}' does not inherit from DevExpress.ui.dxDataGrid.Controller",
    E1003: "Module '{0}'. View '{1}' is already registered",
    E1004: "Module '{0}'. View '{1}' does not inherit from DevExpress.ui.dxDataGrid.View",
    E1005: "Public method '{0}' is already registered",
    E1006: "Public method '{0}.{1}' does not exist",
    E1007: "State storing cannot be provided due to the restrictions of the browser",
    E1010: "The template does not contain the TextBox widget",
    E1011: 'Items cannot be deleted from the List. Implement the "remove" function in the data store',
    E1012: "Editing type '{0}' with the name '{1}' is unsupported",
    E1016: "Unexpected type of data source is provided for a lookup column",
    E1018: "The 'collapseAll' method cannot be called if you use a remote data source",
    E1019: "Search mode '{0}' is unavailable",
    E1020: "The type cannot be changed after initialization",
    E1021: "{0} '{1}' you are trying to remove does not exist",
    E1022: 'The "markers" option is given an invalid value. Assign an array instead',
    E1023: 'The "routes" option is given an invalid value. Assign an array instead',
    E1025: "This layout is too complex to render",
    E1026: 'The "calculateCustomSummary" function is missing from a field whose "summaryType" option is set to "custom"',
    E1030: "Unknown ScrollView refresh strategy: '{0}'",
    E1031: "Unknown subscription in the Scheduler widget: '{0}'",
    E1032: "Unknown start date in an appointment: '{0}'",
    E1033: "Unknown step in the date navigator: '{0}'",
    E1034: "The browser does not implement an API for saving files",
    E1035: "The editor cannot be created because of an internal error: {0}",
    E1037: "Invalid structure of grouped data",
    E1038: "The browser does not support local storages for local web pages",
    E1039: "A cell's position cannot be calculated",
    E1040: "The '{0}' key value is not unique within the data array",
    E1041: "The '{0}' script is referenced after the DevExtreme scripts or not referenced at all",
    E1042: "{0} requires the key field to be specified",
    E1043: "Changes cannot be processed due to the incorrectly set key",
    E1044: "The key field specified by the keyExpr option does not match the key field specified in the data store",
    E1045: "Editing requires the key field to be specified in the data store",
    E1046: "The '{0}' key field is not found in data objects",
    E1047: 'The "{0}" field is not found in the fields array',
    E1048: 'The "{0}" operation is not found in the filterOperations array',
    E1049: "Column '{0}': filtering is allowed but the 'dataField' or 'name' option is not specified",
    E1050: "The validationRules option does not apply to third-party editors defined in the editCellTemplate",
    E1051: 'HtmlEditor\'s valueType is "{0}", but the {0} converter was not imported.',
    E1052: '{0} should have the "dataSource" option specified',
    E1053: 'The "buttons" option accepts an array that contains only objects or string values',
    E1054: "All text editor buttons must have names",
    E1055: 'One or several text editor buttons have invalid or non-unique "name" values',
    E1056: 'The {0} widget does not support buttons of the "{1}" type',
    E1058: 'The "startDayHour" must be earlier than the "endDayHour"',
    E1059: "All column names must be different",
    E1060: "All editable columns must have names",
    W1001: 'The "key" option cannot be modified after initialization',
    W1002: "An item with the key '{0}' does not exist",
    W1003: "A group with the key '{0}' in which you are trying to select items does not exist",
    W1004: "The item '{0}' you are trying to select in the group '{1}' does not exist",
    W1005: "Due to column data types being unspecified, data has been loaded twice in order to apply initial filter settings. To resolve this issue, specify data types for all grid columns.",
    W1006: "The map service returned the following error: '{0}'",
    W1007: "No item with key {0} was found in the data source, but this key was used as the parent key for item {1}",
    W1008: "Cannot scroll to the '{0}' date because it does not exist on the current view",
    W1009: "Searching works only if data is specified using the dataSource option",
    W1010: "The capability to select all items works with source data of plain structure only",
    W1011: 'The "keyExpr" option is not applied when dataSource is not an array',
    W1012: "The '{0}' key field is not found in data objects",
    W1013: 'The "message" field in the dialog component was renamed to "messageHtml". Change your code correspondingly. In addition, if you used HTML code in the message, make sure that it is secure',
    W1014: "The Floating Action Button exceeds the recommended speed dial action count. If you need to display more speed dial actions, increase the maxSpeedDialActionCount option value in the global config.",
    W1015: 'The "cellDuration" should divide the range from the "startDayHour" to the "endDayHour" into even intervals'
});
exports.default = _default;
module.exports = exports.default;


/***/ }),

/***/ "./node_modules/devextreme/ui/widget/ui.widget.js":
/*!********************************************************!*\
  !*** ./node_modules/devextreme/ui/widget/ui.widget.js ***!
  \********************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/**
 * DevExtreme (ui/widget/ui.widget.js)
 * Version: 20.2.3
 * Build date: Tue Oct 20 2020
 *
 * Copyright (c) 2012 - 2020 Developer Express Inc. ALL RIGHTS RESERVED
 * Read about DevExtreme licensing here: https://js.devexpress.com/Licensing/
 */

exports.default = void 0;
var _renderer = _interopRequireDefault(__webpack_require__(/*! ../../core/renderer */ "./node_modules/devextreme/core/renderer.js"));
var _action = _interopRequireDefault(__webpack_require__(/*! ../../core/action */ "./node_modules/devextreme/core/action.js"));
var _dom_component = _interopRequireDefault(__webpack_require__(/*! ../../core/dom_component */ "./node_modules/devextreme/core/dom_component.js"));
var _short = __webpack_require__(/*! ../../events/short */ "./node_modules/devextreme/events/short.js");
var _common = __webpack_require__(/*! ../../core/utils/common */ "./node_modules/devextreme/core/utils/common.js");
var _iterator = __webpack_require__(/*! ../../core/utils/iterator */ "./node_modules/devextreme/core/utils/iterator.js");
var _extend2 = __webpack_require__(/*! ../../core/utils/extend */ "./node_modules/devextreme/core/utils/extend.js");
var _selectors = __webpack_require__(/*! ./selectors */ "./node_modules/devextreme/ui/widget/selectors.js");
var _array = __webpack_require__(/*! ../../core/utils/array */ "./node_modules/devextreme/core/utils/array.js");
var _index = __webpack_require__(/*! ../../events/utils/index */ "./node_modules/devextreme/events/utils/index.js");
var _type = __webpack_require__(/*! ../../core/utils/type */ "./node_modules/devextreme/core/utils/type.js");
__webpack_require__(/*! ../../events/click */ "./node_modules/devextreme/events/click.js");
__webpack_require__(/*! ../../events/core/emitter.feedback */ "./node_modules/devextreme/events/core/emitter.feedback.js");
__webpack_require__(/*! ../../events/hover */ "./node_modules/devextreme/events/hover.js");

function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
        "default": obj
    }
}

function _defineProperty(obj, key, value) {
    if (key in obj) {
        Object.defineProperty(obj, key, {
            value: value,
            enumerable: true,
            configurable: true,
            writable: true
        })
    } else {
        obj[key] = value
    }
    return obj
}

function setAttribute(name, value, target) {
    name = "role" === name || "id" === name ? name : "aria-".concat(name);
    value = (0, _type.isDefined)(value) ? value.toString() : null;
    target.attr(name, value)
}
var Widget = _dom_component.default.inherit({
    _feedbackHideTimeout: 400,
    _feedbackShowTimeout: 30,
    _supportedKeys: function() {
        return {}
    },
    _getDefaultOptions: function() {
        return (0, _extend2.extend)(this.callBase(), {
            hoveredElement: null,
            isActive: false,
            disabled: false,
            visible: true,
            hint: void 0,
            activeStateEnabled: false,
            onContentReady: null,
            hoverStateEnabled: false,
            focusStateEnabled: false,
            tabIndex: 0,
            accessKey: null,
            onFocusIn: null,
            onFocusOut: null,
            onKeyboardHandled: null,
            ignoreParentReadOnly: false
        })
    },
    _init: function() {
        this.callBase();
        this._initContentReadyAction()
    },
    _innerWidgetOptionChanged: function(innerWidget, args) {
        var options = Widget.getOptionsFromContainer(args);
        innerWidget && innerWidget.option(options);
        this._options.cache(args.name, options)
    },
    _bindInnerWidgetOptions: function(innerWidget, optionsContainer) {
        var _this = this;
        var syncOptions = function() {
            return _this._options.silent(optionsContainer, (0, _extend2.extend)({}, innerWidget.option()))
        };
        syncOptions();
        innerWidget.on("optionChanged", syncOptions)
    },
    _getAriaTarget: function() {
        return this._focusTarget()
    },
    _initContentReadyAction: function() {
        this._contentReadyAction = this._createActionByOption("onContentReady", {
            excludeValidators: ["disabled", "readOnly"]
        })
    },
    _initMarkup: function() {
        var _this$option = this.option(),
            disabled = _this$option.disabled,
            visible = _this$option.visible;
        this.$element().addClass("dx-widget");
        this._toggleDisabledState(disabled);
        this._toggleVisibility(visible);
        this._renderHint();
        this._isFocusable() && this._renderFocusTarget();
        this.callBase()
    },
    _render: function() {
        this.callBase();
        this._renderContent();
        this._renderFocusState();
        this._attachFeedbackEvents();
        this._attachHoverEvents();
        this._toggleIndependentState()
    },
    _renderHint: function() {
        var _this$option2 = this.option(),
            hint = _this$option2.hint;
        this.$element().attr("title", hint || null)
    },
    _renderContent: function() {
        var _this2 = this;
        (0, _common.deferRender)(function() {
            return !_this2._disposed ? _this2._renderContentImpl() : void 0
        }).done(function() {
            return !_this2._disposed ? _this2._fireContentReadyAction() : void 0
        })
    },
    _renderContentImpl: _common.noop,
    _fireContentReadyAction: (0, _common.deferRenderer)(function() {
        return this._contentReadyAction()
    }),
    _dispose: function() {
        this._contentReadyAction = null;
        this._detachKeyboardEvents();
        this.callBase()
    },
    _resetActiveState: function() {
        this._toggleActiveState(this._eventBindingTarget(), false)
    },
    _clean: function() {
        this._cleanFocusState();
        this._resetActiveState();
        this.callBase();
        this.$element().empty()
    },
    _toggleVisibility: function(visible) {
        this.$element().toggleClass("dx-state-invisible", !visible);
        this.setAria("hidden", !visible || void 0)
    },
    _renderFocusState: function() {
        this._attachKeyboardEvents();
        if (this._isFocusable()) {
            this._renderFocusTarget();
            this._attachFocusEvents();
            this._renderAccessKey()
        }
    },
    _renderAccessKey: function() {
        var _this3 = this;
        var $el = this._focusTarget();
        var _this$option3 = this.option(),
            accessKey = _this$option3.accessKey;
        var namespace = "UIFeedback";
        $el.attr("accesskey", accessKey);
        _short.dxClick.off($el, {
            namespace: namespace
        });
        accessKey && _short.dxClick.on($el, function(e) {
            if ((0, _index.isFakeClickEvent)(e)) {
                e.stopImmediatePropagation();
                _this3.focus()
            }
        }, {
            namespace: namespace
        })
    },
    _isFocusable: function() {
        var _this$option4 = this.option(),
            focusStateEnabled = _this$option4.focusStateEnabled,
            disabled = _this$option4.disabled;
        return focusStateEnabled && !disabled
    },
    _eventBindingTarget: function() {
        return this.$element()
    },
    _focusTarget: function() {
        return this._getActiveElement()
    },
    _getActiveElement: function() {
        var activeElement = this._eventBindingTarget();
        if (this._activeStateUnit) {
            return activeElement.find(this._activeStateUnit).not(".dx-state-disabled")
        }
        return activeElement
    },
    _renderFocusTarget: function() {
        var _this$option5 = this.option(),
            tabIndex = _this$option5.tabIndex;
        this._focusTarget().attr("tabIndex", tabIndex)
    },
    _keyboardEventBindingTarget: function() {
        return this._eventBindingTarget()
    },
    _refreshFocusEvent: function() {
        this._detachFocusEvents();
        this._attachFocusEvents()
    },
    _focusEventTarget: function() {
        return this._focusTarget()
    },
    _focusInHandler: function(event) {
        var _this4 = this;
        if (!event.isDefaultPrevented()) {
            this._createActionByOption("onFocusIn", {
                beforeExecute: function() {
                    return _this4._updateFocusState(event, true)
                },
                excludeValidators: ["readOnly"]
            })({
                event: event
            })
        }
    },
    _focusOutHandler: function(event) {
        var _this5 = this;
        if (!event.isDefaultPrevented()) {
            this._createActionByOption("onFocusOut", {
                beforeExecute: function() {
                    return _this5._updateFocusState(event, false)
                },
                excludeValidators: ["readOnly", "disabled"]
            })({
                event: event
            })
        }
    },
    _updateFocusState: function(_ref, isFocused) {
        var target = _ref.target;
        if ((0, _array.inArray)(target, this._focusTarget()) !== -1) {
            this._toggleFocusClass(isFocused, (0, _renderer.default)(target))
        }
    },
    _toggleFocusClass: function(isFocused, $element) {
        var $focusTarget = $element && $element.length ? $element : this._focusTarget();
        $focusTarget.toggleClass("dx-state-focused", isFocused)
    },
    _hasFocusClass: function(element) {
        var $focusTarget = (0, _renderer.default)(element || this._focusTarget());
        return $focusTarget.hasClass("dx-state-focused")
    },
    _isFocused: function() {
        return this._hasFocusClass()
    },
    _getKeyboardListeners: function() {
        return []
    },
    _attachKeyboardEvents: function() {
        var _this6 = this;
        this._detachKeyboardEvents();
        var _this$option6 = this.option(),
            focusStateEnabled = _this$option6.focusStateEnabled,
            onKeyboardHandled = _this$option6.onKeyboardHandled;
        var hasChildListeners = this._getKeyboardListeners().length;
        var hasKeyboardEventHandler = !!onKeyboardHandled;
        var shouldAttach = focusStateEnabled || hasChildListeners || hasKeyboardEventHandler;
        if (shouldAttach) {
            this._keyboardListenerId = _short.keyboard.on(this._keyboardEventBindingTarget(), this._focusTarget(), function(opts) {
                return _this6._keyboardHandler(opts)
            })
        }
    },
    _keyboardHandler: function(options, onlyChildProcessing) {
        if (!onlyChildProcessing) {
            var originalEvent = options.originalEvent,
                keyName = options.keyName,
                which = options.which;
            var keys = this._supportedKeys(originalEvent);
            var func = keys[keyName] || keys[which];
            if (void 0 !== func) {
                var handler = func.bind(this);
                var result = handler(originalEvent, options);
                if (!result) {
                    return false
                }
            }
        }
        var keyboardListeners = this._getKeyboardListeners();
        var _this$option7 = this.option(),
            onKeyboardHandled = _this$option7.onKeyboardHandled;
        keyboardListeners.forEach(function(listener) {
            return listener && listener._keyboardHandler(options)
        });
        onKeyboardHandled && onKeyboardHandled(options);
        return true
    },
    _refreshFocusState: function() {
        this._cleanFocusState();
        this._renderFocusState()
    },
    _cleanFocusState: function() {
        var $element = this._focusTarget();
        $element.removeAttr("tabIndex");
        this._toggleFocusClass(false);
        this._detachFocusEvents();
        this._detachKeyboardEvents()
    },
    _detachKeyboardEvents: function() {
        _short.keyboard.off(this._keyboardListenerId);
        this._keyboardListenerId = null
    },
    _attachHoverEvents: function() {
        var _this7 = this;
        var _this$option8 = this.option(),
            hoverStateEnabled = _this$option8.hoverStateEnabled;
        var selector = this._activeStateUnit;
        var namespace = "UIFeedback";
        var $el = this._eventBindingTarget();
        _short.hover.off($el, {
            selector: selector,
            namespace: namespace
        });
        if (hoverStateEnabled) {
            _short.hover.on($el, new _action.default(function(_ref2) {
                var event = _ref2.event,
                    element = _ref2.element;
                _this7._hoverStartHandler(event);
                _this7.option("hoveredElement", (0, _renderer.default)(element))
            }, {
                excludeValidators: ["readOnly"]
            }), function(event) {
                _this7.option("hoveredElement", null);
                _this7._hoverEndHandler(event)
            }, {
                selector: selector,
                namespace: namespace
            })
        }
    },
    _attachFeedbackEvents: function() {
        var _this8 = this;
        var _this$option9 = this.option(),
            activeStateEnabled = _this$option9.activeStateEnabled;
        var selector = this._activeStateUnit;
        var namespace = "UIFeedback";
        var $el = this._eventBindingTarget();
        _short.active.off($el, {
            namespace: namespace,
            selector: selector
        });
        if (activeStateEnabled) {
            _short.active.on($el, new _action.default(function(_ref3) {
                var event = _ref3.event,
                    element = _ref3.element;
                return _this8._toggleActiveState((0, _renderer.default)(element), true, event)
            }), new _action.default(function(_ref4) {
                var event = _ref4.event,
                    element = _ref4.element;
                return _this8._toggleActiveState((0, _renderer.default)(element), false, event)
            }, {
                excludeValidators: ["disabled", "readOnly"]
            }), {
                showTimeout: this._feedbackShowTimeout,
                hideTimeout: this._feedbackHideTimeout,
                selector: selector,
                namespace: namespace
            })
        }
    },
    _detachFocusEvents: function() {
        var $el = this._focusEventTarget();
        _short.focus.off($el, {
            namespace: "".concat(this.NAME, "Focus")
        })
    },
    _attachFocusEvents: function() {
        var _this9 = this;
        var $el = this._focusEventTarget();
        _short.focus.on($el, function(e) {
            return _this9._focusInHandler(e)
        }, function(e) {
            return _this9._focusOutHandler(e)
        }, {
            namespace: "".concat(this.NAME, "Focus"),
            isFocusable: function(index, el) {
                return (0, _renderer.default)(el).is(_selectors.focusable)
            }
        })
    },
    _hoverStartHandler: _common.noop,
    _hoverEndHandler: _common.noop,
    _toggleActiveState: function($element, value) {
        this.option("isActive", value);
        $element.toggleClass("dx-state-active", value)
    },
    _updatedHover: function() {
        var hoveredElement = this._options.silent("hoveredElement");
        this._hover(hoveredElement, hoveredElement)
    },
    _findHoverTarget: function($el) {
        return $el && $el.closest(this._activeStateUnit || this._eventBindingTarget())
    },
    _hover: function($el, $previous) {
        var _this$option10 = this.option(),
            hoverStateEnabled = _this$option10.hoverStateEnabled,
            disabled = _this$option10.disabled,
            isActive = _this$option10.isActive;
        $previous = this._findHoverTarget($previous);
        $previous && $previous.toggleClass("dx-state-hover", false);
        if ($el && hoverStateEnabled && !disabled && !isActive) {
            var newHoveredElement = this._findHoverTarget($el);
            newHoveredElement && newHoveredElement.toggleClass("dx-state-hover", true)
        }
    },
    _toggleDisabledState: function(value) {
        this.$element().toggleClass("dx-state-disabled", Boolean(value));
        this.setAria("disabled", value || void 0)
    },
    _toggleIndependentState: function() {
        this.$element().toggleClass("dx-state-independent", this.option("ignoreParentReadOnly"))
    },
    _setWidgetOption: function(widgetName, args) {
        var _this10 = this;
        if (!this[widgetName]) {
            return
        }
        if ((0, _type.isPlainObject)(args[0])) {
            (0, _iterator.each)(args[0], function(option, value) {
                return _this10._setWidgetOption(widgetName, [option, value])
            });
            return
        }
        var optionName = args[0];
        var value = args[1];
        if (1 === args.length) {
            value = this.option(optionName)
        }
        var widgetOptionMap = this["".concat(widgetName, "OptionMap")];
        this[widgetName].option(widgetOptionMap ? widgetOptionMap(optionName) : optionName, value)
    },
    _optionChanged: function(args) {
        var name = args.name,
            value = args.value,
            previousValue = args.previousValue;
        switch (name) {
            case "disabled":
                this._toggleDisabledState(value);
                this._updatedHover();
                this._refreshFocusState();
                break;
            case "hint":
                this._renderHint();
                break;
            case "ignoreParentReadOnly":
                this._toggleIndependentState();
                break;
            case "activeStateEnabled":
                this._attachFeedbackEvents();
                break;
            case "hoverStateEnabled":
                this._attachHoverEvents();
                this._updatedHover();
                break;
            case "tabIndex":
            case "focusStateEnabled":
                this._refreshFocusState();
                break;
            case "onFocusIn":
            case "onFocusOut":
                break;
            case "accessKey":
                this._renderAccessKey();
                break;
            case "hoveredElement":
                this._hover(value, previousValue);
                break;
            case "isActive":
                this._updatedHover();
                break;
            case "visible":
                this._toggleVisibility(value);
                if (this._isVisibilityChangeSupported()) {
                    this._checkVisibilityChanged(value ? "shown" : "hiding")
                }
                break;
            case "onKeyboardHandled":
                this._attachKeyboardEvents();
                break;
            case "onContentReady":
                this._initContentReadyAction();
                break;
            default:
                this.callBase(args)
        }
    },
    _isVisible: function() {
        var _this$option11 = this.option(),
            visible = _this$option11.visible;
        return this.callBase() && visible
    },
    beginUpdate: function() {
        this._ready(false);
        this.callBase()
    },
    endUpdate: function() {
        this.callBase();
        if (this._initialized) {
            this._ready(true)
        }
    },
    _ready: function(value) {
        if (0 === arguments.length) {
            return this._isReady
        }
        this._isReady = value
    },
    setAria: function() {
        if (!(0, _type.isPlainObject)(arguments.length <= 0 ? void 0 : arguments[0])) {
            setAttribute(arguments.length <= 0 ? void 0 : arguments[0], arguments.length <= 1 ? void 0 : arguments[1], (arguments.length <= 2 ? void 0 : arguments[2]) || this._getAriaTarget())
        } else {
            var target = (arguments.length <= 1 ? void 0 : arguments[1]) || this._getAriaTarget();
            (0, _iterator.each)(arguments.length <= 0 ? void 0 : arguments[0], function(name, value) {
                return setAttribute(name, value, target)
            })
        }
    },
    isReady: function() {
        return this._ready()
    },
    repaint: function() {
        this._refresh()
    },
    focus: function() {
        _short.focus.trigger(this._focusTarget())
    },
    registerKeyHandler: function(key, handler) {
        var currentKeys = this._supportedKeys();
        this._supportedKeys = function() {
            return (0, _extend2.extend)(currentKeys, _defineProperty({}, key, handler))
        }
    }
});
Widget.getOptionsFromContainer = function(_ref5) {
    var name = _ref5.name,
        fullName = _ref5.fullName,
        value = _ref5.value;
    var options = {};
    if (name === fullName) {
        options = value
    } else {
        var option = fullName.split(".").pop();
        options[option] = value
    }
    return options
};
var _default = Widget;
exports.default = _default;
module.exports = exports.default;


/***/ }),

/***/ "./node_modules/util/node_modules/inherits/inherits_browser.js":
/*!*********************************************************************!*\
  !*** ./node_modules/util/node_modules/inherits/inherits_browser.js ***!
  \*********************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

if (typeof Object.create === 'function') {
  // implementation from standard node.js 'util' module
  module.exports = function inherits(ctor, superCtor) {
    ctor.super_ = superCtor
    ctor.prototype = Object.create(superCtor.prototype, {
      constructor: {
        value: ctor,
        enumerable: false,
        writable: true,
        configurable: true
      }
    });
  };
} else {
  // old school shim for old browsers
  module.exports = function inherits(ctor, superCtor) {
    ctor.super_ = superCtor
    var TempCtor = function () {}
    TempCtor.prototype = superCtor.prototype
    ctor.prototype = new TempCtor()
    ctor.prototype.constructor = ctor
  }
}


/***/ }),

/***/ "./node_modules/util/support/isBufferBrowser.js":
/*!******************************************************!*\
  !*** ./node_modules/util/support/isBufferBrowser.js ***!
  \******************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = function isBuffer(arg) {
  return arg && typeof arg === 'object'
    && typeof arg.copy === 'function'
    && typeof arg.fill === 'function'
    && typeof arg.readUInt8 === 'function';
}

/***/ }),

/***/ "./node_modules/util/util.js":
/*!***********************************!*\
  !*** ./node_modules/util/util.js ***!
  \***********************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

// Copyright Joyent, Inc. and other Node contributors.
//
// Permission is hereby granted, free of charge, to any person obtaining a
// copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to permit
// persons to whom the Software is furnished to do so, subject to the
// following conditions:
//
// The above copyright notice and this permission notice shall be included
// in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
// USE OR OTHER DEALINGS IN THE SOFTWARE.

var getOwnPropertyDescriptors = Object.getOwnPropertyDescriptors ||
  function getOwnPropertyDescriptors(obj) {
    var keys = Object.keys(obj);
    var descriptors = {};
    for (var i = 0; i < keys.length; i++) {
      descriptors[keys[i]] = Object.getOwnPropertyDescriptor(obj, keys[i]);
    }
    return descriptors;
  };

var formatRegExp = /%[sdj%]/g;
exports.format = function(f) {
  if (!isString(f)) {
    var objects = [];
    for (var i = 0; i < arguments.length; i++) {
      objects.push(inspect(arguments[i]));
    }
    return objects.join(' ');
  }

  var i = 1;
  var args = arguments;
  var len = args.length;
  var str = String(f).replace(formatRegExp, function(x) {
    if (x === '%%') return '%';
    if (i >= len) return x;
    switch (x) {
      case '%s': return String(args[i++]);
      case '%d': return Number(args[i++]);
      case '%j':
        try {
          return JSON.stringify(args[i++]);
        } catch (_) {
          return '[Circular]';
        }
      default:
        return x;
    }
  });
  for (var x = args[i]; i < len; x = args[++i]) {
    if (isNull(x) || !isObject(x)) {
      str += ' ' + x;
    } else {
      str += ' ' + inspect(x);
    }
  }
  return str;
};


// Mark that a method should not be used.
// Returns a modified function which warns once by default.
// If --no-deprecation is set, then it is a no-op.
exports.deprecate = function(fn, msg) {
  if (typeof process !== 'undefined' && process.noDeprecation === true) {
    return fn;
  }

  // Allow for deprecating things in the process of starting up.
  if (typeof process === 'undefined') {
    return function() {
      return exports.deprecate(fn, msg).apply(this, arguments);
    };
  }

  var warned = false;
  function deprecated() {
    if (!warned) {
      if (process.throwDeprecation) {
        throw new Error(msg);
      } else if (process.traceDeprecation) {
        console.trace(msg);
      } else {
        console.error(msg);
      }
      warned = true;
    }
    return fn.apply(this, arguments);
  }

  return deprecated;
};


var debugs = {};
var debugEnviron;
exports.debuglog = function(set) {
  if (isUndefined(debugEnviron))
    debugEnviron = process.env.NODE_DEBUG || '';
  set = set.toUpperCase();
  if (!debugs[set]) {
    if (new RegExp('\\b' + set + '\\b', 'i').test(debugEnviron)) {
      var pid = process.pid;
      debugs[set] = function() {
        var msg = exports.format.apply(exports, arguments);
        console.error('%s %d: %s', set, pid, msg);
      };
    } else {
      debugs[set] = function() {};
    }
  }
  return debugs[set];
};


/**
 * Echos the value of a value. Trys to print the value out
 * in the best way possible given the different types.
 *
 * @param {Object} obj The object to print out.
 * @param {Object} opts Optional options object that alters the output.
 */
/* legacy: obj, showHidden, depth, colors*/
function inspect(obj, opts) {
  // default options
  var ctx = {
    seen: [],
    stylize: stylizeNoColor
  };
  // legacy...
  if (arguments.length >= 3) ctx.depth = arguments[2];
  if (arguments.length >= 4) ctx.colors = arguments[3];
  if (isBoolean(opts)) {
    // legacy...
    ctx.showHidden = opts;
  } else if (opts) {
    // got an "options" object
    exports._extend(ctx, opts);
  }
  // set default options
  if (isUndefined(ctx.showHidden)) ctx.showHidden = false;
  if (isUndefined(ctx.depth)) ctx.depth = 2;
  if (isUndefined(ctx.colors)) ctx.colors = false;
  if (isUndefined(ctx.customInspect)) ctx.customInspect = true;
  if (ctx.colors) ctx.stylize = stylizeWithColor;
  return formatValue(ctx, obj, ctx.depth);
}
exports.inspect = inspect;


// http://en.wikipedia.org/wiki/ANSI_escape_code#graphics
inspect.colors = {
  'bold' : [1, 22],
  'italic' : [3, 23],
  'underline' : [4, 24],
  'inverse' : [7, 27],
  'white' : [37, 39],
  'grey' : [90, 39],
  'black' : [30, 39],
  'blue' : [34, 39],
  'cyan' : [36, 39],
  'green' : [32, 39],
  'magenta' : [35, 39],
  'red' : [31, 39],
  'yellow' : [33, 39]
};

// Don't use 'blue' not visible on cmd.exe
inspect.styles = {
  'special': 'cyan',
  'number': 'yellow',
  'boolean': 'yellow',
  'undefined': 'grey',
  'null': 'bold',
  'string': 'green',
  'date': 'magenta',
  // "name": intentionally not styling
  'regexp': 'red'
};


function stylizeWithColor(str, styleType) {
  var style = inspect.styles[styleType];

  if (style) {
    return '\u001b[' + inspect.colors[style][0] + 'm' + str +
           '\u001b[' + inspect.colors[style][1] + 'm';
  } else {
    return str;
  }
}


function stylizeNoColor(str, styleType) {
  return str;
}


function arrayToHash(array) {
  var hash = {};

  array.forEach(function(val, idx) {
    hash[val] = true;
  });

  return hash;
}


function formatValue(ctx, value, recurseTimes) {
  // Provide a hook for user-specified inspect functions.
  // Check that value is an object with an inspect function on it
  if (ctx.customInspect &&
      value &&
      isFunction(value.inspect) &&
      // Filter out the util module, it's inspect function is special
      value.inspect !== exports.inspect &&
      // Also filter out any prototype objects using the circular check.
      !(value.constructor && value.constructor.prototype === value)) {
    var ret = value.inspect(recurseTimes, ctx);
    if (!isString(ret)) {
      ret = formatValue(ctx, ret, recurseTimes);
    }
    return ret;
  }

  // Primitive types cannot have properties
  var primitive = formatPrimitive(ctx, value);
  if (primitive) {
    return primitive;
  }

  // Look up the keys of the object.
  var keys = Object.keys(value);
  var visibleKeys = arrayToHash(keys);

  if (ctx.showHidden) {
    keys = Object.getOwnPropertyNames(value);
  }

  // IE doesn't make error fields non-enumerable
  // http://msdn.microsoft.com/en-us/library/ie/dww52sbt(v=vs.94).aspx
  if (isError(value)
      && (keys.indexOf('message') >= 0 || keys.indexOf('description') >= 0)) {
    return formatError(value);
  }

  // Some type of object without properties can be shortcutted.
  if (keys.length === 0) {
    if (isFunction(value)) {
      var name = value.name ? ': ' + value.name : '';
      return ctx.stylize('[Function' + name + ']', 'special');
    }
    if (isRegExp(value)) {
      return ctx.stylize(RegExp.prototype.toString.call(value), 'regexp');
    }
    if (isDate(value)) {
      return ctx.stylize(Date.prototype.toString.call(value), 'date');
    }
    if (isError(value)) {
      return formatError(value);
    }
  }

  var base = '', array = false, braces = ['{', '}'];

  // Make Array say that they are Array
  if (isArray(value)) {
    array = true;
    braces = ['[', ']'];
  }

  // Make functions say that they are functions
  if (isFunction(value)) {
    var n = value.name ? ': ' + value.name : '';
    base = ' [Function' + n + ']';
  }

  // Make RegExps say that they are RegExps
  if (isRegExp(value)) {
    base = ' ' + RegExp.prototype.toString.call(value);
  }

  // Make dates with properties first say the date
  if (isDate(value)) {
    base = ' ' + Date.prototype.toUTCString.call(value);
  }

  // Make error with message first say the error
  if (isError(value)) {
    base = ' ' + formatError(value);
  }

  if (keys.length === 0 && (!array || value.length == 0)) {
    return braces[0] + base + braces[1];
  }

  if (recurseTimes < 0) {
    if (isRegExp(value)) {
      return ctx.stylize(RegExp.prototype.toString.call(value), 'regexp');
    } else {
      return ctx.stylize('[Object]', 'special');
    }
  }

  ctx.seen.push(value);

  var output;
  if (array) {
    output = formatArray(ctx, value, recurseTimes, visibleKeys, keys);
  } else {
    output = keys.map(function(key) {
      return formatProperty(ctx, value, recurseTimes, visibleKeys, key, array);
    });
  }

  ctx.seen.pop();

  return reduceToSingleString(output, base, braces);
}


function formatPrimitive(ctx, value) {
  if (isUndefined(value))
    return ctx.stylize('undefined', 'undefined');
  if (isString(value)) {
    var simple = '\'' + JSON.stringify(value).replace(/^"|"$/g, '')
                                             .replace(/'/g, "\\'")
                                             .replace(/\\"/g, '"') + '\'';
    return ctx.stylize(simple, 'string');
  }
  if (isNumber(value))
    return ctx.stylize('' + value, 'number');
  if (isBoolean(value))
    return ctx.stylize('' + value, 'boolean');
  // For some reason typeof null is "object", so special case here.
  if (isNull(value))
    return ctx.stylize('null', 'null');
}


function formatError(value) {
  return '[' + Error.prototype.toString.call(value) + ']';
}


function formatArray(ctx, value, recurseTimes, visibleKeys, keys) {
  var output = [];
  for (var i = 0, l = value.length; i < l; ++i) {
    if (hasOwnProperty(value, String(i))) {
      output.push(formatProperty(ctx, value, recurseTimes, visibleKeys,
          String(i), true));
    } else {
      output.push('');
    }
  }
  keys.forEach(function(key) {
    if (!key.match(/^\d+$/)) {
      output.push(formatProperty(ctx, value, recurseTimes, visibleKeys,
          key, true));
    }
  });
  return output;
}


function formatProperty(ctx, value, recurseTimes, visibleKeys, key, array) {
  var name, str, desc;
  desc = Object.getOwnPropertyDescriptor(value, key) || { value: value[key] };
  if (desc.get) {
    if (desc.set) {
      str = ctx.stylize('[Getter/Setter]', 'special');
    } else {
      str = ctx.stylize('[Getter]', 'special');
    }
  } else {
    if (desc.set) {
      str = ctx.stylize('[Setter]', 'special');
    }
  }
  if (!hasOwnProperty(visibleKeys, key)) {
    name = '[' + key + ']';
  }
  if (!str) {
    if (ctx.seen.indexOf(desc.value) < 0) {
      if (isNull(recurseTimes)) {
        str = formatValue(ctx, desc.value, null);
      } else {
        str = formatValue(ctx, desc.value, recurseTimes - 1);
      }
      if (str.indexOf('\n') > -1) {
        if (array) {
          str = str.split('\n').map(function(line) {
            return '  ' + line;
          }).join('\n').substr(2);
        } else {
          str = '\n' + str.split('\n').map(function(line) {
            return '   ' + line;
          }).join('\n');
        }
      }
    } else {
      str = ctx.stylize('[Circular]', 'special');
    }
  }
  if (isUndefined(name)) {
    if (array && key.match(/^\d+$/)) {
      return str;
    }
    name = JSON.stringify('' + key);
    if (name.match(/^"([a-zA-Z_][a-zA-Z_0-9]*)"$/)) {
      name = name.substr(1, name.length - 2);
      name = ctx.stylize(name, 'name');
    } else {
      name = name.replace(/'/g, "\\'")
                 .replace(/\\"/g, '"')
                 .replace(/(^"|"$)/g, "'");
      name = ctx.stylize(name, 'string');
    }
  }

  return name + ': ' + str;
}


function reduceToSingleString(output, base, braces) {
  var numLinesEst = 0;
  var length = output.reduce(function(prev, cur) {
    numLinesEst++;
    if (cur.indexOf('\n') >= 0) numLinesEst++;
    return prev + cur.replace(/\u001b\[\d\d?m/g, '').length + 1;
  }, 0);

  if (length > 60) {
    return braces[0] +
           (base === '' ? '' : base + '\n ') +
           ' ' +
           output.join(',\n  ') +
           ' ' +
           braces[1];
  }

  return braces[0] + base + ' ' + output.join(', ') + ' ' + braces[1];
}


// NOTE: These type checking functions intentionally don't use `instanceof`
// because it is fragile and can be easily faked with `Object.create()`.
function isArray(ar) {
  return Array.isArray(ar);
}
exports.isArray = isArray;

function isBoolean(arg) {
  return typeof arg === 'boolean';
}
exports.isBoolean = isBoolean;

function isNull(arg) {
  return arg === null;
}
exports.isNull = isNull;

function isNullOrUndefined(arg) {
  return arg == null;
}
exports.isNullOrUndefined = isNullOrUndefined;

function isNumber(arg) {
  return typeof arg === 'number';
}
exports.isNumber = isNumber;

function isString(arg) {
  return typeof arg === 'string';
}
exports.isString = isString;

function isSymbol(arg) {
  return typeof arg === 'symbol';
}
exports.isSymbol = isSymbol;

function isUndefined(arg) {
  return arg === void 0;
}
exports.isUndefined = isUndefined;

function isRegExp(re) {
  return isObject(re) && objectToString(re) === '[object RegExp]';
}
exports.isRegExp = isRegExp;

function isObject(arg) {
  return typeof arg === 'object' && arg !== null;
}
exports.isObject = isObject;

function isDate(d) {
  return isObject(d) && objectToString(d) === '[object Date]';
}
exports.isDate = isDate;

function isError(e) {
  return isObject(e) &&
      (objectToString(e) === '[object Error]' || e instanceof Error);
}
exports.isError = isError;

function isFunction(arg) {
  return typeof arg === 'function';
}
exports.isFunction = isFunction;

function isPrimitive(arg) {
  return arg === null ||
         typeof arg === 'boolean' ||
         typeof arg === 'number' ||
         typeof arg === 'string' ||
         typeof arg === 'symbol' ||  // ES6 symbol
         typeof arg === 'undefined';
}
exports.isPrimitive = isPrimitive;

exports.isBuffer = __webpack_require__(/*! ./support/isBuffer */ "./node_modules/util/support/isBufferBrowser.js");

function objectToString(o) {
  return Object.prototype.toString.call(o);
}


function pad(n) {
  return n < 10 ? '0' + n.toString(10) : n.toString(10);
}


var months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep',
              'Oct', 'Nov', 'Dec'];

// 26 Feb 16:19:34
function timestamp() {
  var d = new Date();
  var time = [pad(d.getHours()),
              pad(d.getMinutes()),
              pad(d.getSeconds())].join(':');
  return [d.getDate(), months[d.getMonth()], time].join(' ');
}


// log is just a thin wrapper to console.log that prepends a timestamp
exports.log = function() {
  console.log('%s - %s', timestamp(), exports.format.apply(exports, arguments));
};


/**
 * Inherit the prototype methods from one constructor into another.
 *
 * The Function.prototype.inherits from lang.js rewritten as a standalone
 * function (not on Function.prototype). NOTE: If this file is to be loaded
 * during bootstrapping this function needs to be rewritten using some native
 * functions as prototype setup using normal JavaScript does not work as
 * expected during bootstrapping (see mirror.js in r114903).
 *
 * @param {function} ctor Constructor function which needs to inherit the
 *     prototype.
 * @param {function} superCtor Constructor function to inherit prototype from.
 */
exports.inherits = __webpack_require__(/*! inherits */ "./node_modules/util/node_modules/inherits/inherits_browser.js");

exports._extend = function(origin, add) {
  // Don't do anything if add isn't an object
  if (!add || !isObject(add)) return origin;

  var keys = Object.keys(add);
  var i = keys.length;
  while (i--) {
    origin[keys[i]] = add[keys[i]];
  }
  return origin;
};

function hasOwnProperty(obj, prop) {
  return Object.prototype.hasOwnProperty.call(obj, prop);
}

var kCustomPromisifiedSymbol = typeof Symbol !== 'undefined' ? Symbol('util.promisify.custom') : undefined;

exports.promisify = function promisify(original) {
  if (typeof original !== 'function')
    throw new TypeError('The "original" argument must be of type Function');

  if (kCustomPromisifiedSymbol && original[kCustomPromisifiedSymbol]) {
    var fn = original[kCustomPromisifiedSymbol];
    if (typeof fn !== 'function') {
      throw new TypeError('The "util.promisify.custom" argument must be of type Function');
    }
    Object.defineProperty(fn, kCustomPromisifiedSymbol, {
      value: fn, enumerable: false, writable: false, configurable: true
    });
    return fn;
  }

  function fn() {
    var promiseResolve, promiseReject;
    var promise = new Promise(function (resolve, reject) {
      promiseResolve = resolve;
      promiseReject = reject;
    });

    var args = [];
    for (var i = 0; i < arguments.length; i++) {
      args.push(arguments[i]);
    }
    args.push(function (err, value) {
      if (err) {
        promiseReject(err);
      } else {
        promiseResolve(value);
      }
    });

    try {
      original.apply(this, args);
    } catch (err) {
      promiseReject(err);
    }

    return promise;
  }

  Object.setPrototypeOf(fn, Object.getPrototypeOf(original));

  if (kCustomPromisifiedSymbol) Object.defineProperty(fn, kCustomPromisifiedSymbol, {
    value: fn, enumerable: false, writable: false, configurable: true
  });
  return Object.defineProperties(
    fn,
    getOwnPropertyDescriptors(original)
  );
}

exports.promisify.custom = kCustomPromisifiedSymbol

function callbackifyOnRejected(reason, cb) {
  // `!reason` guard inspired by bluebird (Ref: https://goo.gl/t5IS6M).
  // Because `null` is a special error value in callbacks which means "no error
  // occurred", we error-wrap so the callback consumer can distinguish between
  // "the promise rejected with null" or "the promise fulfilled with undefined".
  if (!reason) {
    var newReason = new Error('Promise was rejected with a falsy value');
    newReason.reason = reason;
    reason = newReason;
  }
  return cb(reason);
}

function callbackify(original) {
  if (typeof original !== 'function') {
    throw new TypeError('The "original" argument must be of type Function');
  }

  // We DO NOT return the promise as it gives the user a false sense that
  // the promise is actually somehow related to the callback's execution
  // and that the callback throwing will reject the promise.
  function callbackified() {
    var args = [];
    for (var i = 0; i < arguments.length; i++) {
      args.push(arguments[i]);
    }

    var maybeCb = args.pop();
    if (typeof maybeCb !== 'function') {
      throw new TypeError('The last argument must be of type Function');
    }
    var self = this;
    var cb = function() {
      return maybeCb.apply(self, arguments);
    };
    // In true node style we process the callback on `nextTick` with all the
    // implications (stack, `uncaughtException`, `async_hooks`)
    original.apply(this, args)
      .then(function(ret) { process.nextTick(cb, null, ret) },
            function(rej) { process.nextTick(callbackifyOnRejected, rej, cb) });
  }

  Object.setPrototypeOf(callbackified, Object.getPrototypeOf(original));
  Object.defineProperties(callbackified,
                          getOwnPropertyDescriptors(original));
  return callbackified;
}
exports.callbackify = callbackify;


/***/ }),

/***/ "./src/app/api/api-configuration.ts":
/*!******************************************!*\
  !*** ./src/app/api/api-configuration.ts ***!
  \******************************************/
/*! exports provided: ApiConfiguration */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "ApiConfiguration", function() { return ApiConfiguration; });
/* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! tslib */ "./node_modules/tslib/tslib.es6.js");
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");

/* tslint:disable */

/**
 * Global configuration
 */
var ApiConfiguration = /** @class */ (function () {
    function ApiConfiguration() {
        this.rootUrl = '';
    }
    ApiConfiguration = tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_1__["Injectable"])({
            providedIn: 'root',
        })
    ], ApiConfiguration);
    return ApiConfiguration;
}());



/***/ }),

/***/ "./src/app/api/base-service.ts":
/*!*************************************!*\
  !*** ./src/app/api/base-service.ts ***!
  \*************************************/
/*! exports provided: BaseService */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "BaseService", function() { return BaseService; });
/* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! tslib */ "./node_modules/tslib/tslib.es6.js");
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");
/* harmony import */ var _angular_common_http__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @angular/common/http */ "./node_modules/@angular/common/fesm5/http.js");
/* harmony import */ var _api_configuration__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./api-configuration */ "./src/app/api/api-configuration.ts");

/* tslint:disable */



/**
 * Base class for services
 */
var BaseService = /** @class */ (function () {
    function BaseService(config, http) {
        this.config = config;
        this.http = http;
        this._rootUrl = '';
    }
    Object.defineProperty(BaseService.prototype, "rootUrl", {
        /**
         * Returns the root url for all operations in this service. If not set directly in this
         * service, will fallback to `ApiConfiguration.rootUrl`.
         */
        get: function () {
            return this._rootUrl || this.config.rootUrl;
        },
        /**
         * Sets the root URL for API operations in this service.
         */
        set: function (rootUrl) {
            this._rootUrl = rootUrl;
        },
        enumerable: true,
        configurable: true
    });
    BaseService.ctorParameters = function () { return [
        { type: _api_configuration__WEBPACK_IMPORTED_MODULE_3__["ApiConfiguration"] },
        { type: _angular_common_http__WEBPACK_IMPORTED_MODULE_2__["HttpClient"] }
    ]; };
    BaseService = tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_1__["Injectable"])()
    ], BaseService);
    return BaseService;
}());



/***/ }),

/***/ "./src/app/api/request-builder.ts":
/*!****************************************!*\
  !*** ./src/app/api/request-builder.ts ***!
  \****************************************/
/*! exports provided: RequestBuilder */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "RequestBuilder", function() { return RequestBuilder; });
/* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! tslib */ "./node_modules/tslib/tslib.es6.js");
/* harmony import */ var _angular_common_http__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/common/http */ "./node_modules/@angular/common/fesm5/http.js");

/* tslint:disable */

/**
 * Custom parameter codec to correctly handle the plus sign in parameter
 * values. See https://github.com/angular/angular/issues/18261
 */
var ParameterCodec = /** @class */ (function () {
    function ParameterCodec() {
    }
    ParameterCodec.prototype.encodeKey = function (key) {
        return encodeURIComponent(key);
    };
    ParameterCodec.prototype.encodeValue = function (value) {
        return encodeURIComponent(value);
    };
    ParameterCodec.prototype.decodeKey = function (key) {
        return decodeURIComponent(key);
    };
    ParameterCodec.prototype.decodeValue = function (value) {
        return decodeURIComponent(value);
    };
    return ParameterCodec;
}());
var ParameterCodecInstance = new ParameterCodec();
/**
 * Base class for a parameter
 */
var Parameter = /** @class */ (function () {
    function Parameter(name, value, options, defaultStyle, defaultExplode) {
        this.name = name;
        this.value = value;
        this.options = options;
        this.options = options || {};
        if (this.options.style === null || this.options.style === undefined) {
            this.options.style = defaultStyle;
        }
        if (this.options.explode === null || this.options.explode === undefined) {
            this.options.explode = defaultExplode;
        }
    }
    Parameter.prototype.serializeValue = function (value, separator) {
        var _this = this;
        var e_1, _a;
        if (separator === void 0) { separator = ','; }
        if (value === null || value === undefined) {
            return '';
        }
        else if (value instanceof Array) {
            return value.map(function (v) { return _this.serializeValue(v).split(separator).join(encodeURIComponent(separator)); }).join(separator);
        }
        else if (typeof value === 'object') {
            var array = [];
            try {
                for (var _b = tslib__WEBPACK_IMPORTED_MODULE_0__["__values"](Object.keys(value)), _c = _b.next(); !_c.done; _c = _b.next()) {
                    var key = _c.value;
                    var propVal = value[key];
                    if (propVal !== null && propVal !== undefined) {
                        propVal = this.serializeValue(propVal).split(separator).join(encodeURIComponent(separator));
                        if (this.options.explode) {
                            array.push(key + "=" + propVal);
                        }
                        else {
                            array.push(key);
                            array.push(propVal);
                        }
                    }
                }
            }
            catch (e_1_1) { e_1 = { error: e_1_1 }; }
            finally {
                try {
                    if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
                }
                finally { if (e_1) throw e_1.error; }
            }
            return array.join(separator);
        }
        else {
            return String(value);
        }
    };
    Parameter.ctorParameters = function () { return [
        { type: String },
        { type: undefined },
        { type: undefined },
        { type: String },
        { type: Boolean }
    ]; };
    return Parameter;
}());
/**
 * A parameter in the operation path
 */
var PathParameter = /** @class */ (function (_super) {
    tslib__WEBPACK_IMPORTED_MODULE_0__["__extends"](PathParameter, _super);
    function PathParameter(name, value, options) {
        return _super.call(this, name, value, options, 'simple', false) || this;
    }
    PathParameter.prototype.append = function (path) {
        var _this = this;
        var value = this.value;
        if (value === null || value === undefined) {
            value = '';
        }
        var prefix = this.options.style === 'label' ? '.' : '';
        var separator = this.options.explode ? prefix === '' ? ',' : prefix : ',';
        if (this.options.style === 'matrix') {
            // The parameter name is just used as prefix, except in some cases...
            prefix = ";" + this.name + "=";
            if (this.options.explode && typeof value === 'object') {
                prefix = ';';
                if (value instanceof Array) {
                    // For arrays we have to repeat the name for each element
                    value = value.map(function (v) { return _this.name + "=" + _this.serializeValue(v, ';'); });
                    separator = ';';
                }
                else {
                    // For objects we have to put each the key / value pairs
                    value = this.serializeValue(value, ';');
                }
            }
        }
        value = prefix + this.serializeValue(value, separator);
        // Replace both the plain variable and the corresponding variant taking in the prefix and explode into account
        path = path.replace("{" + this.name + "}", value);
        path = path.replace("{" + prefix + this.name + (this.options.explode ? '*' : '') + "}", value);
        return path;
    };
    PathParameter.ctorParameters = function () { return [
        { type: String },
        { type: undefined },
        { type: undefined }
    ]; };
    return PathParameter;
}(Parameter));
/**
 * A parameter in the query
 */
var QueryParameter = /** @class */ (function (_super) {
    tslib__WEBPACK_IMPORTED_MODULE_0__["__extends"](QueryParameter, _super);
    function QueryParameter(name, value, options) {
        return _super.call(this, name, value, options, 'form', true) || this;
    }
    QueryParameter.prototype.append = function (params) {
        var e_2, _a, e_3, _b, e_4, _c, e_5, _d;
        if (this.value instanceof Array) {
            // Array serialization
            if (this.options.explode) {
                try {
                    for (var _e = tslib__WEBPACK_IMPORTED_MODULE_0__["__values"](this.value), _f = _e.next(); !_f.done; _f = _e.next()) {
                        var v = _f.value;
                        params = params.append(this.name, this.serializeValue(v));
                    }
                }
                catch (e_2_1) { e_2 = { error: e_2_1 }; }
                finally {
                    try {
                        if (_f && !_f.done && (_a = _e.return)) _a.call(_e);
                    }
                    finally { if (e_2) throw e_2.error; }
                }
            }
            else {
                var separator = this.options.style === 'spaceDelimited'
                    ? ' ' : this.options.style === 'pipeDelimited'
                    ? '|' : ',';
                return params.append(this.name, this.serializeValue(this.value, separator));
            }
        }
        else if (this.value !== null && typeof this.value === 'object') {
            // Object serialization
            if (this.options.style === 'deepObject') {
                try {
                    // Append a parameter for each key, in the form `name[key]`
                    for (var _g = tslib__WEBPACK_IMPORTED_MODULE_0__["__values"](Object.keys(this.value)), _h = _g.next(); !_h.done; _h = _g.next()) {
                        var key = _h.value;
                        var propVal = this.value[key];
                        if (propVal !== null && propVal !== undefined) {
                            params = params.append(this.name + "[" + key + "]", this.serializeValue(propVal));
                        }
                    }
                }
                catch (e_3_1) { e_3 = { error: e_3_1 }; }
                finally {
                    try {
                        if (_h && !_h.done && (_b = _g.return)) _b.call(_g);
                    }
                    finally { if (e_3) throw e_3.error; }
                }
            }
            else if (this.options.explode) {
                try {
                    // Append a parameter for each key without using the parameter name
                    for (var _j = tslib__WEBPACK_IMPORTED_MODULE_0__["__values"](Object.keys(this.value)), _k = _j.next(); !_k.done; _k = _j.next()) {
                        var key = _k.value;
                        var propVal = this.value[key];
                        if (propVal !== null && propVal !== undefined) {
                            params = params.append(key, this.serializeValue(propVal));
                        }
                    }
                }
                catch (e_4_1) { e_4 = { error: e_4_1 }; }
                finally {
                    try {
                        if (_k && !_k.done && (_c = _j.return)) _c.call(_j);
                    }
                    finally { if (e_4) throw e_4.error; }
                }
            }
            else {
                // Append a single parameter whose values are a comma-separated list of key,value,key,value...
                var array = [];
                try {
                    for (var _l = tslib__WEBPACK_IMPORTED_MODULE_0__["__values"](Object.keys(this.value)), _m = _l.next(); !_m.done; _m = _l.next()) {
                        var key = _m.value;
                        var propVal = this.value[key];
                        if (propVal !== null && propVal !== undefined) {
                            array.push(key);
                            array.push(propVal);
                        }
                    }
                }
                catch (e_5_1) { e_5 = { error: e_5_1 }; }
                finally {
                    try {
                        if (_m && !_m.done && (_d = _l.return)) _d.call(_l);
                    }
                    finally { if (e_5) throw e_5.error; }
                }
                params = params.append(this.name, this.serializeValue(array));
            }
        }
        else if (this.value !== null && this.value !== undefined) {
            // Plain value
            params = params.append(this.name, this.serializeValue(this.value));
        }
        return params;
    };
    QueryParameter.ctorParameters = function () { return [
        { type: String },
        { type: undefined },
        { type: undefined }
    ]; };
    return QueryParameter;
}(Parameter));
/**
 * A parameter in the HTTP request header
 */
var HeaderParameter = /** @class */ (function (_super) {
    tslib__WEBPACK_IMPORTED_MODULE_0__["__extends"](HeaderParameter, _super);
    function HeaderParameter(name, value, options) {
        return _super.call(this, name, value, options, 'simple', false) || this;
    }
    HeaderParameter.prototype.append = function (headers) {
        var e_6, _a;
        if (this.value !== null && this.value !== undefined) {
            if (this.value instanceof Array) {
                try {
                    for (var _b = tslib__WEBPACK_IMPORTED_MODULE_0__["__values"](this.value), _c = _b.next(); !_c.done; _c = _b.next()) {
                        var v = _c.value;
                        headers = headers.append(this.name, this.serializeValue(v));
                    }
                }
                catch (e_6_1) { e_6 = { error: e_6_1 }; }
                finally {
                    try {
                        if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
                    }
                    finally { if (e_6) throw e_6.error; }
                }
            }
            else {
                headers = headers.append(this.name, this.serializeValue(this.value));
            }
        }
        return headers;
    };
    HeaderParameter.ctorParameters = function () { return [
        { type: String },
        { type: undefined },
        { type: undefined }
    ]; };
    return HeaderParameter;
}(Parameter));
/**
 * Helper to build http requests from parameters
 */
var RequestBuilder = /** @class */ (function () {
    function RequestBuilder(rootUrl, operationPath, method) {
        this.rootUrl = rootUrl;
        this.operationPath = operationPath;
        this.method = method;
        this._path = new Map();
        this._query = new Map();
        this._header = new Map();
    }
    /**
     * Sets a path parameter
     */
    RequestBuilder.prototype.path = function (name, value, options) {
        this._path.set(name, new PathParameter(name, value, options || {}));
    };
    /**
     * Sets a query parameter
     */
    RequestBuilder.prototype.query = function (name, value, options) {
        this._query.set(name, new QueryParameter(name, value, options || {}));
    };
    /**
     * Sets a header parameter
     */
    RequestBuilder.prototype.header = function (name, value, options) {
        this._header.set(name, new HeaderParameter(name, value, options || {}));
    };
    /**
     * Sets the body content, along with the content type
     */
    RequestBuilder.prototype.body = function (value, contentType) {
        var e_7, _a, e_8, _b, e_9, _c, e_10, _d;
        if (contentType === void 0) { contentType = 'application/json'; }
        if (value instanceof Blob) {
            this._bodyContentType = value.type;
        }
        else {
            this._bodyContentType = contentType;
        }
        if (this._bodyContentType === 'application/x-www-form-urlencoded' && value !== null && typeof value === 'object') {
            // Handle URL-encoded data
            var pairs = [];
            try {
                for (var _e = tslib__WEBPACK_IMPORTED_MODULE_0__["__values"](Object.keys(value)), _f = _e.next(); !_f.done; _f = _e.next()) {
                    var key = _f.value;
                    var val = value[key];
                    if (!(val instanceof Array)) {
                        val = [val];
                    }
                    try {
                        for (var val_1 = tslib__WEBPACK_IMPORTED_MODULE_0__["__values"](val), val_1_1 = val_1.next(); !val_1_1.done; val_1_1 = val_1.next()) {
                            var v = val_1_1.value;
                            var formValue = this.formDataValue(v);
                            if (formValue !== null) {
                                pairs.push([key, formValue]);
                            }
                        }
                    }
                    catch (e_8_1) { e_8 = { error: e_8_1 }; }
                    finally {
                        try {
                            if (val_1_1 && !val_1_1.done && (_b = val_1.return)) _b.call(val_1);
                        }
                        finally { if (e_8) throw e_8.error; }
                    }
                }
            }
            catch (e_7_1) { e_7 = { error: e_7_1 }; }
            finally {
                try {
                    if (_f && !_f.done && (_a = _e.return)) _a.call(_e);
                }
                finally { if (e_7) throw e_7.error; }
            }
            this._bodyContent = pairs.map(function (p) { return encodeURIComponent(p[0]) + "=" + encodeURIComponent(p[1]); }).join('&');
        }
        else if (this._bodyContentType === 'multipart/form-data') {
            // Handle multipart form data
            var formData = new FormData();
            if (value !== null && value !== undefined) {
                try {
                    for (var _g = tslib__WEBPACK_IMPORTED_MODULE_0__["__values"](Object.keys(value)), _h = _g.next(); !_h.done; _h = _g.next()) {
                        var key = _h.value;
                        var val = value[key];
                        if (val instanceof Array) {
                            try {
                                for (var val_2 = tslib__WEBPACK_IMPORTED_MODULE_0__["__values"](val), val_2_1 = val_2.next(); !val_2_1.done; val_2_1 = val_2.next()) {
                                    var v = val_2_1.value;
                                    var toAppend = this.formDataValue(v);
                                    if (toAppend !== null) {
                                        formData.append(key, toAppend);
                                    }
                                }
                            }
                            catch (e_10_1) { e_10 = { error: e_10_1 }; }
                            finally {
                                try {
                                    if (val_2_1 && !val_2_1.done && (_d = val_2.return)) _d.call(val_2);
                                }
                                finally { if (e_10) throw e_10.error; }
                            }
                        }
                        else {
                            var toAppend = this.formDataValue(val);
                            if (toAppend !== null) {
                                formData.set(key, toAppend);
                            }
                        }
                    }
                }
                catch (e_9_1) { e_9 = { error: e_9_1 }; }
                finally {
                    try {
                        if (_h && !_h.done && (_c = _g.return)) _c.call(_g);
                    }
                    finally { if (e_9) throw e_9.error; }
                }
            }
            this._bodyContent = formData;
        }
        else {
            // The body is the plain content
            this._bodyContent = value;
        }
    };
    RequestBuilder.prototype.formDataValue = function (value) {
        if (value === null || value === undefined) {
            return null;
        }
        if (value instanceof Blob) {
            return value;
        }
        if (typeof value === 'object') {
            return JSON.stringify(value);
        }
        return String(value);
    };
    /**
     * Builds the request with the current set parameters
     */
    RequestBuilder.prototype.build = function (options) {
        var e_11, _a, e_12, _b, e_13, _c;
        options = options || {};
        // Path parameters
        var path = this.operationPath;
        try {
            for (var _d = tslib__WEBPACK_IMPORTED_MODULE_0__["__values"](this._path.values()), _e = _d.next(); !_e.done; _e = _d.next()) {
                var pathParam = _e.value;
                path = pathParam.append(path);
            }
        }
        catch (e_11_1) { e_11 = { error: e_11_1 }; }
        finally {
            try {
                if (_e && !_e.done && (_a = _d.return)) _a.call(_d);
            }
            finally { if (e_11) throw e_11.error; }
        }
        var url = this.rootUrl + path;
        // Query parameters
        var httpParams = new _angular_common_http__WEBPACK_IMPORTED_MODULE_1__["HttpParams"]({
            encoder: ParameterCodecInstance
        });
        try {
            for (var _f = tslib__WEBPACK_IMPORTED_MODULE_0__["__values"](this._query.values()), _g = _f.next(); !_g.done; _g = _f.next()) {
                var queryParam = _g.value;
                httpParams = queryParam.append(httpParams);
            }
        }
        catch (e_12_1) { e_12 = { error: e_12_1 }; }
        finally {
            try {
                if (_g && !_g.done && (_b = _f.return)) _b.call(_f);
            }
            finally { if (e_12) throw e_12.error; }
        }
        // Header parameters
        var httpHeaders = new _angular_common_http__WEBPACK_IMPORTED_MODULE_1__["HttpHeaders"]();
        if (options.accept) {
            httpHeaders = httpHeaders.append('Accept', options.accept);
        }
        try {
            for (var _h = tslib__WEBPACK_IMPORTED_MODULE_0__["__values"](this._header.values()), _j = _h.next(); !_j.done; _j = _h.next()) {
                var headerParam = _j.value;
                httpHeaders = headerParam.append(httpHeaders);
            }
        }
        catch (e_13_1) { e_13 = { error: e_13_1 }; }
        finally {
            try {
                if (_j && !_j.done && (_c = _h.return)) _c.call(_h);
            }
            finally { if (e_13) throw e_13.error; }
        }
        // Request content headers
        if (this._bodyContentType && !(this._bodyContent instanceof FormData)) {
            httpHeaders = httpHeaders.set('Content-Type', this._bodyContentType);
        }
        // Perform the request
        return new _angular_common_http__WEBPACK_IMPORTED_MODULE_1__["HttpRequest"](this.method.toUpperCase(), url, this._bodyContent, {
            params: httpParams,
            headers: httpHeaders,
            responseType: options.responseType,
            reportProgress: options.reportProgress
        });
    };
    RequestBuilder.ctorParameters = function () { return [
        { type: String },
        { type: String },
        { type: String }
    ]; };
    return RequestBuilder;
}());



/***/ }),

/***/ "./src/app/api/services/auth.service.ts":
/*!**********************************************!*\
  !*** ./src/app/api/services/auth.service.ts ***!
  \**********************************************/
/*! exports provided: AuthService */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "AuthService", function() { return AuthService; });
/* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! tslib */ "./node_modules/tslib/tslib.es6.js");
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");
/* harmony import */ var _angular_common_http__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @angular/common/http */ "./node_modules/@angular/common/fesm5/http.js");
/* harmony import */ var _base_service__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../base-service */ "./src/app/api/base-service.ts");
/* harmony import */ var _api_configuration__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../api-configuration */ "./src/app/api/api-configuration.ts");
/* harmony import */ var _request_builder__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../request-builder */ "./src/app/api/request-builder.ts");
/* harmony import */ var rxjs_operators__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! rxjs/operators */ "./node_modules/rxjs/_esm5/operators/index.js");

/* tslint:disable */






var AuthService = /** @class */ (function (_super) {
    tslib__WEBPACK_IMPORTED_MODULE_0__["__extends"](AuthService, _super);
    function AuthService(config, http) {
        return _super.call(this, config, http) || this;
    }
    AuthService_1 = AuthService;
    /**
     * Авторизация.
     *
     *
     *
     * This method provides access to the full `HttpResponse`, allowing access to response headers.
     * To access only the response body, use `apiAuthLoginPost()` instead.
     *
     * This method sends `application/*+json` and handles request body of type `application/*+json`.
     */
    AuthService.prototype.apiAuthLoginPost$Response = function (params) {
        var rb = new _request_builder__WEBPACK_IMPORTED_MODULE_5__["RequestBuilder"](this.rootUrl, AuthService_1.ApiAuthLoginPostPath, 'post');
        if (params) {
            rb.body(params.body, 'application/*+json');
        }
        return this.http.request(rb.build({
            responseType: 'json',
            accept: 'application/json'
        })).pipe(Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_6__["filter"])(function (r) { return r instanceof _angular_common_http__WEBPACK_IMPORTED_MODULE_2__["HttpResponse"]; }), Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_6__["map"])(function (r) {
            return r;
        }));
    };
    /**
     * Авторизация.
     *
     *
     *
     * This method provides access to only to the response body.
     * To access the full response (for headers, for example), `apiAuthLoginPost$Response()` instead.
     *
     * This method sends `application/*+json` and handles request body of type `application/*+json`.
     */
    AuthService.prototype.apiAuthLoginPost = function (params) {
        return this.apiAuthLoginPost$Response(params).pipe(Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_6__["map"])(function (r) { return r.body; }));
    };
    var AuthService_1;
    AuthService.ctorParameters = function () { return [
        { type: _api_configuration__WEBPACK_IMPORTED_MODULE_4__["ApiConfiguration"] },
        { type: _angular_common_http__WEBPACK_IMPORTED_MODULE_2__["HttpClient"] }
    ]; };
    /**
     * Path part for operation apiAuthLoginPost
     */
    AuthService.ApiAuthLoginPostPath = '/api/Auth/login';
    AuthService = AuthService_1 = tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_1__["Injectable"])({
            providedIn: 'root',
        })
    ], AuthService);
    return AuthService;
}(_base_service__WEBPACK_IMPORTED_MODULE_3__["BaseService"]));



/***/ }),

/***/ "./src/app/api/services/employees.service.ts":
/*!***************************************************!*\
  !*** ./src/app/api/services/employees.service.ts ***!
  \***************************************************/
/*! exports provided: EmployeesService */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "EmployeesService", function() { return EmployeesService; });
/* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! tslib */ "./node_modules/tslib/tslib.es6.js");
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");
/* harmony import */ var _angular_common_http__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @angular/common/http */ "./node_modules/@angular/common/fesm5/http.js");
/* harmony import */ var _base_service__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../base-service */ "./src/app/api/base-service.ts");
/* harmony import */ var _api_configuration__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../api-configuration */ "./src/app/api/api-configuration.ts");
/* harmony import */ var _request_builder__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../request-builder */ "./src/app/api/request-builder.ts");
/* harmony import */ var rxjs_operators__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! rxjs/operators */ "./node_modules/rxjs/_esm5/operators/index.js");

/* tslint:disable */






var EmployeesService = /** @class */ (function (_super) {
    tslib__WEBPACK_IMPORTED_MODULE_0__["__extends"](EmployeesService, _super);
    function EmployeesService(config, http) {
        return _super.call(this, config, http) || this;
    }
    EmployeesService_1 = EmployeesService;
    /**
     * Возвращает список сотрудников.
     *
     *
     *
     * This method provides access to the full `HttpResponse`, allowing access to response headers.
     * To access only the response body, use `apiEmployeesGet()` instead.
     *
     * This method doesn't expect any request body.
     */
    EmployeesService.prototype.apiEmployeesGet$Response = function (params) {
        var rb = new _request_builder__WEBPACK_IMPORTED_MODULE_5__["RequestBuilder"](this.rootUrl, EmployeesService_1.ApiEmployeesGetPath, 'get');
        if (params) {
        }
        return this.http.request(rb.build({
            responseType: 'json',
            accept: 'application/json'
        })).pipe(Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_6__["filter"])(function (r) { return r instanceof _angular_common_http__WEBPACK_IMPORTED_MODULE_2__["HttpResponse"]; }), Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_6__["map"])(function (r) {
            return r;
        }));
    };
    /**
     * Возвращает список сотрудников.
     *
     *
     *
     * This method provides access to only to the response body.
     * To access the full response (for headers, for example), `apiEmployeesGet$Response()` instead.
     *
     * This method doesn't expect any request body.
     */
    EmployeesService.prototype.apiEmployeesGet = function (params) {
        return this.apiEmployeesGet$Response(params).pipe(Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_6__["map"])(function (r) { return r.body; }));
    };
    /**
     * Создает сотрудника.
     *
     *
     *
     * This method provides access to the full `HttpResponse`, allowing access to response headers.
     * To access only the response body, use `apiEmployeesPost()` instead.
     *
     * This method sends `application/*+json` and handles request body of type `application/*+json`.
     */
    EmployeesService.prototype.apiEmployeesPost$Response = function (params) {
        var rb = new _request_builder__WEBPACK_IMPORTED_MODULE_5__["RequestBuilder"](this.rootUrl, EmployeesService_1.ApiEmployeesPostPath, 'post');
        if (params) {
            rb.body(params.body, 'application/*+json');
        }
        return this.http.request(rb.build({
            responseType: 'text',
            accept: '*/*'
        })).pipe(Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_6__["filter"])(function (r) { return r instanceof _angular_common_http__WEBPACK_IMPORTED_MODULE_2__["HttpResponse"]; }), Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_6__["map"])(function (r) {
            return r.clone({ body: undefined });
        }));
    };
    /**
     * Создает сотрудника.
     *
     *
     *
     * This method provides access to only to the response body.
     * To access the full response (for headers, for example), `apiEmployeesPost$Response()` instead.
     *
     * This method sends `application/*+json` and handles request body of type `application/*+json`.
     */
    EmployeesService.prototype.apiEmployeesPost = function (params) {
        return this.apiEmployeesPost$Response(params).pipe(Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_6__["map"])(function (r) { return r.body; }));
    };
    /**
     * Возвращает список сотрудников по подразделению.
     *
     *
     *
     * This method provides access to the full `HttpResponse`, allowing access to response headers.
     * To access only the response body, use `apiEmployeesDivisionGet()` instead.
     *
     * This method doesn't expect any request body.
     */
    EmployeesService.prototype.apiEmployeesDivisionGet$Response = function (params) {
        var rb = new _request_builder__WEBPACK_IMPORTED_MODULE_5__["RequestBuilder"](this.rootUrl, EmployeesService_1.ApiEmployeesDivisionGetPath, 'get');
        if (params) {
            rb.query('divisionId', params.divisionId, {});
        }
        return this.http.request(rb.build({
            responseType: 'json',
            accept: 'application/json'
        })).pipe(Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_6__["filter"])(function (r) { return r instanceof _angular_common_http__WEBPACK_IMPORTED_MODULE_2__["HttpResponse"]; }), Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_6__["map"])(function (r) {
            return r;
        }));
    };
    /**
     * Возвращает список сотрудников по подразделению.
     *
     *
     *
     * This method provides access to only to the response body.
     * To access the full response (for headers, for example), `apiEmployeesDivisionGet$Response()` instead.
     *
     * This method doesn't expect any request body.
     */
    EmployeesService.prototype.apiEmployeesDivisionGet = function (params) {
        return this.apiEmployeesDivisionGet$Response(params).pipe(Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_6__["map"])(function (r) { return r.body; }));
    };
    /**
     * Возвращает список сотрудников по строке поиска.
     *
     *
     *
     * This method provides access to the full `HttpResponse`, allowing access to response headers.
     * To access only the response body, use `apiEmployeesSearchGet()` instead.
     *
     * This method doesn't expect any request body.
     */
    EmployeesService.prototype.apiEmployeesSearchGet$Response = function (params) {
        var rb = new _request_builder__WEBPACK_IMPORTED_MODULE_5__["RequestBuilder"](this.rootUrl, EmployeesService_1.ApiEmployeesSearchGetPath, 'get');
        if (params) {
            rb.query('search', params.search, {});
        }
        return this.http.request(rb.build({
            responseType: 'json',
            accept: 'application/json'
        })).pipe(Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_6__["filter"])(function (r) { return r instanceof _angular_common_http__WEBPACK_IMPORTED_MODULE_2__["HttpResponse"]; }), Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_6__["map"])(function (r) {
            return r;
        }));
    };
    /**
     * Возвращает список сотрудников по строке поиска.
     *
     *
     *
     * This method provides access to only to the response body.
     * To access the full response (for headers, for example), `apiEmployeesSearchGet$Response()` instead.
     *
     * This method doesn't expect any request body.
     */
    EmployeesService.prototype.apiEmployeesSearchGet = function (params) {
        return this.apiEmployeesSearchGet$Response(params).pipe(Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_6__["map"])(function (r) { return r.body; }));
    };
    /**
     * This method provides access to the full `HttpResponse`, allowing access to response headers.
     * To access only the response body, use `apiEmployeesIdGet()` instead.
     *
     * This method doesn't expect any request body.
     */
    EmployeesService.prototype.apiEmployeesIdGet$Response = function (params) {
        var rb = new _request_builder__WEBPACK_IMPORTED_MODULE_5__["RequestBuilder"](this.rootUrl, EmployeesService_1.ApiEmployeesIdGetPath, 'get');
        if (params) {
            rb.path('id', params.id, {});
        }
        return this.http.request(rb.build({
            responseType: 'json',
            accept: 'application/json'
        })).pipe(Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_6__["filter"])(function (r) { return r instanceof _angular_common_http__WEBPACK_IMPORTED_MODULE_2__["HttpResponse"]; }), Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_6__["map"])(function (r) {
            return r;
        }));
    };
    /**
     * This method provides access to only to the response body.
     * To access the full response (for headers, for example), `apiEmployeesIdGet$Response()` instead.
     *
     * This method doesn't expect any request body.
     */
    EmployeesService.prototype.apiEmployeesIdGet = function (params) {
        return this.apiEmployeesIdGet$Response(params).pipe(Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_6__["map"])(function (r) { return r.body; }));
    };
    /**
     * This method provides access to the full `HttpResponse`, allowing access to response headers.
     * To access only the response body, use `apiEmployeesIdPut()` instead.
     *
     * This method sends `application/*+json` and handles request body of type `application/*+json`.
     */
    EmployeesService.prototype.apiEmployeesIdPut$Response = function (params) {
        var rb = new _request_builder__WEBPACK_IMPORTED_MODULE_5__["RequestBuilder"](this.rootUrl, EmployeesService_1.ApiEmployeesIdPutPath, 'put');
        if (params) {
            rb.path('id', params.id, {});
            rb.body(params.body, 'application/*+json');
        }
        return this.http.request(rb.build({
            responseType: 'text',
            accept: '*/*'
        })).pipe(Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_6__["filter"])(function (r) { return r instanceof _angular_common_http__WEBPACK_IMPORTED_MODULE_2__["HttpResponse"]; }), Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_6__["map"])(function (r) {
            return r.clone({ body: undefined });
        }));
    };
    /**
     * This method provides access to only to the response body.
     * To access the full response (for headers, for example), `apiEmployeesIdPut$Response()` instead.
     *
     * This method sends `application/*+json` and handles request body of type `application/*+json`.
     */
    EmployeesService.prototype.apiEmployeesIdPut = function (params) {
        return this.apiEmployeesIdPut$Response(params).pipe(Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_6__["map"])(function (r) { return r.body; }));
    };
    /**
     * This method provides access to the full `HttpResponse`, allowing access to response headers.
     * To access only the response body, use `apiEmployeesIdDelete()` instead.
     *
     * This method doesn't expect any request body.
     */
    EmployeesService.prototype.apiEmployeesIdDelete$Response = function (params) {
        var rb = new _request_builder__WEBPACK_IMPORTED_MODULE_5__["RequestBuilder"](this.rootUrl, EmployeesService_1.ApiEmployeesIdDeletePath, 'delete');
        if (params) {
            rb.path('id', params.id, {});
        }
        return this.http.request(rb.build({
            responseType: 'text',
            accept: '*/*'
        })).pipe(Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_6__["filter"])(function (r) { return r instanceof _angular_common_http__WEBPACK_IMPORTED_MODULE_2__["HttpResponse"]; }), Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_6__["map"])(function (r) {
            return r.clone({ body: undefined });
        }));
    };
    /**
     * This method provides access to only to the response body.
     * To access the full response (for headers, for example), `apiEmployeesIdDelete$Response()` instead.
     *
     * This method doesn't expect any request body.
     */
    EmployeesService.prototype.apiEmployeesIdDelete = function (params) {
        return this.apiEmployeesIdDelete$Response(params).pipe(Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_6__["map"])(function (r) { return r.body; }));
    };
    /**
     * This method provides access to the full `HttpResponse`, allowing access to response headers.
     * To access only the response body, use `apiEmployeesAccountGet()` instead.
     *
     * This method doesn't expect any request body.
     */
    EmployeesService.prototype.apiEmployeesAccountGet$Response = function (params) {
        var rb = new _request_builder__WEBPACK_IMPORTED_MODULE_5__["RequestBuilder"](this.rootUrl, EmployeesService_1.ApiEmployeesAccountGetPath, 'get');
        if (params) {
            rb.query('id', params.id, {});
        }
        return this.http.request(rb.build({
            responseType: 'json',
            accept: 'application/json'
        })).pipe(Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_6__["filter"])(function (r) { return r instanceof _angular_common_http__WEBPACK_IMPORTED_MODULE_2__["HttpResponse"]; }), Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_6__["map"])(function (r) {
            return r;
        }));
    };
    /**
     * This method provides access to only to the response body.
     * To access the full response (for headers, for example), `apiEmployeesAccountGet$Response()` instead.
     *
     * This method doesn't expect any request body.
     */
    EmployeesService.prototype.apiEmployeesAccountGet = function (params) {
        return this.apiEmployeesAccountGet$Response(params).pipe(Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_6__["map"])(function (r) { return r.body; }));
    };
    /**
     * This method provides access to the full `HttpResponse`, allowing access to response headers.
     * To access only the response body, use `apiEmployeesAccountPost()` instead.
     *
     * This method sends `application/*+json` and handles request body of type `application/*+json`.
     */
    EmployeesService.prototype.apiEmployeesAccountPost$Response = function (params) {
        var rb = new _request_builder__WEBPACK_IMPORTED_MODULE_5__["RequestBuilder"](this.rootUrl, EmployeesService_1.ApiEmployeesAccountPostPath, 'post');
        if (params) {
            rb.body(params.body, 'application/*+json');
        }
        return this.http.request(rb.build({
            responseType: 'text',
            accept: '*/*'
        })).pipe(Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_6__["filter"])(function (r) { return r instanceof _angular_common_http__WEBPACK_IMPORTED_MODULE_2__["HttpResponse"]; }), Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_6__["map"])(function (r) {
            return r.clone({ body: undefined });
        }));
    };
    /**
     * This method provides access to only to the response body.
     * To access the full response (for headers, for example), `apiEmployeesAccountPost$Response()` instead.
     *
     * This method sends `application/*+json` and handles request body of type `application/*+json`.
     */
    EmployeesService.prototype.apiEmployeesAccountPost = function (params) {
        return this.apiEmployeesAccountPost$Response(params).pipe(Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_6__["map"])(function (r) { return r.body; }));
    };
    var EmployeesService_1;
    EmployeesService.ctorParameters = function () { return [
        { type: _api_configuration__WEBPACK_IMPORTED_MODULE_4__["ApiConfiguration"] },
        { type: _angular_common_http__WEBPACK_IMPORTED_MODULE_2__["HttpClient"] }
    ]; };
    /**
     * Path part for operation apiEmployeesGet
     */
    EmployeesService.ApiEmployeesGetPath = '/api/Employees';
    /**
     * Path part for operation apiEmployeesPost
     */
    EmployeesService.ApiEmployeesPostPath = '/api/Employees';
    /**
     * Path part for operation apiEmployeesDivisionGet
     */
    EmployeesService.ApiEmployeesDivisionGetPath = '/api/Employees/division';
    /**
     * Path part for operation apiEmployeesSearchGet
     */
    EmployeesService.ApiEmployeesSearchGetPath = '/api/Employees/search';
    /**
     * Path part for operation apiEmployeesIdGet
     */
    EmployeesService.ApiEmployeesIdGetPath = '/api/Employees/{id}';
    /**
     * Path part for operation apiEmployeesIdPut
     */
    EmployeesService.ApiEmployeesIdPutPath = '/api/Employees/{id}';
    /**
     * Path part for operation apiEmployeesIdDelete
     */
    EmployeesService.ApiEmployeesIdDeletePath = '/api/Employees/{id}';
    /**
     * Path part for operation apiEmployeesAccountGet
     */
    EmployeesService.ApiEmployeesAccountGetPath = '/api/Employees/Account';
    /**
     * Path part for operation apiEmployeesAccountPost
     */
    EmployeesService.ApiEmployeesAccountPostPath = '/api/Employees/Account';
    EmployeesService = EmployeesService_1 = tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_1__["Injectable"])({
            providedIn: 'root',
        })
    ], EmployeesService);
    return EmployeesService;
}(_base_service__WEBPACK_IMPORTED_MODULE_3__["BaseService"]));



/***/ }),

/***/ "./src/app/auth/auth.service.ts":
/*!**************************************!*\
  !*** ./src/app/auth/auth.service.ts ***!
  \**************************************/
/*! exports provided: AuthService */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "AuthService", function() { return AuthService; });
/* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! tslib */ "./node_modules/tslib/tslib.es6.js");
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");
/* harmony import */ var _api_services_auth_service__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../api/services/auth.service */ "./src/app/api/services/auth.service.ts");
/* harmony import */ var rxjs_operators__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! rxjs/operators */ "./node_modules/rxjs/_esm5/operators/index.js");
/* harmony import */ var rxjs__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! rxjs */ "./node_modules/rxjs/_esm5/index.js");
/* harmony import */ var util__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! util */ "./node_modules/util/util.js");
/* harmony import */ var util__WEBPACK_IMPORTED_MODULE_5___default = /*#__PURE__*/__webpack_require__.n(util__WEBPACK_IMPORTED_MODULE_5__);
/* harmony import */ var _api_services_employees_service__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ../api/services/employees.service */ "./src/app/api/services/employees.service.ts");







var AuthService = /** @class */ (function () {
    function AuthService(authApiService, employeesService) {
        var _this = this;
        this.authApiService = authApiService;
        this.employeesService = employeesService;
        this.employee$ = new rxjs__WEBPACK_IMPORTED_MODULE_4__["BehaviorSubject"](null);
        var employeeId = parseInt(localStorage.getItem('employee_id'), null);
        if (employeeId) {
            this.employeesService.apiEmployeesIdGet({ id: employeeId }).pipe(Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_3__["take"])(1), Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_3__["tap"])(function (employee) { return _this.employee$.next(employee); })).subscribe();
        }
    }
    AuthService.prototype.login = function (auth) {
        var _this = this;
        return this.authApiService.apiAuthLoginPost({ body: auth }).pipe(Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_3__["map"])(function (data) {
            localStorage.setItem('access_token', data.token);
            if (data.employeeId) {
                localStorage.setItem('employee_id', data.employeeId.toString());
            }
            localStorage.setItem('user_name', data.userName);
            return data.employeeId;
        }), Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_3__["switchMap"])(function (employeeId) {
            if (Object(util__WEBPACK_IMPORTED_MODULE_5__["isNullOrUndefined"])(employeeId)) {
                return Object(rxjs__WEBPACK_IMPORTED_MODULE_4__["of"])(undefined);
            }
            else {
                return _this.employeesService.apiEmployeesIdGet({ id: employeeId });
            }
        }), Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_3__["tap"])(function (employee) {
            _this.employee$.next(employee);
        }));
    };
    AuthService.ctorParameters = function () { return [
        { type: _api_services_auth_service__WEBPACK_IMPORTED_MODULE_2__["AuthService"] },
        { type: _api_services_employees_service__WEBPACK_IMPORTED_MODULE_6__["EmployeesService"] }
    ]; };
    AuthService = tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_1__["Injectable"])({
            providedIn: 'root'
        })
    ], AuthService);
    return AuthService;
}());



/***/ }),

/***/ "./src/app/shared/error-handle.ts":
/*!****************************************!*\
  !*** ./src/app/shared/error-handle.ts ***!
  \****************************************/
/*! exports provided: showError */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "showError", function() { return showError; });
/* harmony import */ var devextreme_ui_notify__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! devextreme/ui/notify */ "./node_modules/devextreme/ui/notify.js");
/* harmony import */ var devextreme_ui_notify__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(devextreme_ui_notify__WEBPACK_IMPORTED_MODULE_0__);

function showError(error) {
    console.error(error);
    var errorMessage = error.error ? error.error : error.message;
    devextreme_ui_notify__WEBPACK_IMPORTED_MODULE_0___default()(errorMessage, 'error');
}


/***/ })

}]);
//# sourceMappingURL=default~auth-auth-module~employees-employees-module-es5.js.map