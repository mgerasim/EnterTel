(window["webpackJsonp"] = window["webpackJsonp"] || []).push([["auth-auth-module"],{

/***/ "./node_modules/angular-google-recaptcha/angular-google-recaptcha.es5.js":
/*!*******************************************************************************!*\
  !*** ./node_modules/angular-google-recaptcha/angular-google-recaptcha.es5.js ***!
  \*******************************************************************************/
/*! exports provided: RecaptchaModule, ScriptLoaderService, RecaptchaComponent, RECAPTCHA_CONFIG */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "RecaptchaModule", function() { return RecaptchaModule; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "ScriptLoaderService", function() { return ScriptLoaderService; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "RecaptchaComponent", function() { return RecaptchaComponent; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "RECAPTCHA_CONFIG", function() { return RECAPTCHA_CONFIG; });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");
/* harmony import */ var _angular_forms__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/forms */ "./node_modules/@angular/forms/fesm5/forms.js");



var RECAPTCHA_CONFIG = new _angular_core__WEBPACK_IMPORTED_MODULE_0__["InjectionToken"]('angular-google-recaptcha siteKey');

var ScriptLoaderService = /** @class */ (function () {
    function ScriptLoaderService() {
    }
    /**
     * @param {?} config
     * @return {?}
     */
    ScriptLoaderService.prototype.injectAndLoadScript = function (config) {
        var /** @type {?} */ script = document.createElement('script');
        script.src = config.scriptSrc;
        script.async = true;
        script.defer = true;
        script.onload = function () { return config.onLoadCallback(); };
        script.onerror = function (err) { return config.onErrorCallback(err); };
        document.body.appendChild(script);
    };
    ScriptLoaderService.decorators = [
        { type: _angular_core__WEBPACK_IMPORTED_MODULE_0__["Injectable"] },
    ];
    /**
     * @nocollapse
     */
    ScriptLoaderService.ctorParameters = function () { return []; };
    return ScriptLoaderService;
}());
var RecaptchaComponent = /** @class */ (function () {
    /**
     * @param {?} recaptchaConfig
     * @param {?} controlDir
     * @param {?} scriptLoaderService
     * @param {?} zone
     * @param {?} cd
     */
    function RecaptchaComponent(recaptchaConfig, controlDir, scriptLoaderService, zone, cd) {
        this.recaptchaConfig = recaptchaConfig;
        this.controlDir = controlDir;
        this.scriptLoaderService = scriptLoaderService;
        this.zone = zone;
        this.cd = cd;
        this.scriptLoad = new _angular_core__WEBPACK_IMPORTED_MODULE_0__["EventEmitter"]();
        this.scriptError = new _angular_core__WEBPACK_IMPORTED_MODULE_0__["EventEmitter"]();
        this.GLOBAL_ON_LOAD_CALLBACK_NAME = '___recaptchaOnLoadCallback___';
        this.controlDir.valueAccessor = this;
    }
    /**
     * @return {?}
     */
    RecaptchaComponent.prototype.ngOnInit = function () {
        var _this = this;
        var /** @type {?} */ control = this.controlDir.control;
        if (!control) {
            return;
        }
        this.setGlobalHandlers();
        this.injectGoogleRecaptchaScript();
        /**
         * Only one validator (specifically our one below) makes sense for this Control, so we just overwrite
         * whatever was previously set
         */
        control.setValidators(function (ctrl) {
            if (typeof _this.activeRecaptchaId === 'undefined' || !_this.recaptchaAPI) {
                return {
                    invalidRecaptcha: true,
                };
            }
            var /** @type {?} */ recaptchaResponse = _this.recaptchaAPI.getResponse(_this.activeRecaptchaId);
            if (!recaptchaResponse) {
                return {
                    invalidRecaptcha: true,
                };
            }
            return null;
        });
        control.updateValueAndValidity();
    };
    /**
     * @return {?}
     */
    RecaptchaComponent.prototype.ngOnDestroy = function () {
        this.unsetGlobalHandlers();
    };
    /**
     * There is currently no way to programmatically set the value of
     * a visible reCAPTCHA, so this is a noop
     * @param {?} val
     * @return {?}
     */
    RecaptchaComponent.prototype.writeValue = function (val) { };
    /**
     * Required method of the ControlValueAccessor interface, we register the callback
     * function that should be called whenever the model value changes
     * @param {?} fn
     * @return {?}
     */
    RecaptchaComponent.prototype.registerOnChange = function (fn) {
        this.onChange = fn;
    };
    /**
     * Required method of the ControlValueAccessor interface, we register the callback
     * function that should be called whenever the control is "touched"
     * @param {?} fn
     * @return {?}
     */
    RecaptchaComponent.prototype.registerOnTouched = function (fn) {
        this.onTouched = fn;
    };
    /**
     * Unfortunately we have to register a global handler for the onload
     * event from the recaptcha lib
     * @return {?}
     */
    RecaptchaComponent.prototype.setGlobalHandlers = function () {
        var _this = this;
        ((window))[this.GLOBAL_ON_LOAD_CALLBACK_NAME] = function () {
            /**
             * Make it easier to add type information to, and work with, the recaptcha lib
             * by storing a single reference to it
             */
            _this.recaptchaAPI = ((window)).grecaptcha;
            _this.renderRecaptcha();
        };
    };
    /**
     * @return {?}
     */
    RecaptchaComponent.prototype.unsetGlobalHandlers = function () {
        delete ((window))[this.GLOBAL_ON_LOAD_CALLBACK_NAME];
    };
    /**
     * Create a <script> element and inject it into the page in order
     * to load the recaptcha lib. Emit load or error events from the relevant
     * Outputs to the component
     * @return {?}
     */
    RecaptchaComponent.prototype.injectGoogleRecaptchaScript = function () {
        var _this = this;
        this.scriptLoaderService.injectAndLoadScript({
            scriptSrc: "https://www.google.com/recaptcha/api.js?render=explicit&onload=" + this.GLOBAL_ON_LOAD_CALLBACK_NAME,
            onLoadCallback: function () { return _this.scriptLoad.emit(); },
            onErrorCallback: function (err) { return _this.scriptError.emit(err); },
        });
    };
    /**
     * Use the recaptcha lib to manually render a recaptcha widget with the ViewChild
     * container element, passing the relevant callbacks and configuration options
     * @return {?}
     */
    RecaptchaComponent.prototype.renderRecaptcha = function () {
        if (!this.recaptchaAPI) {
            return;
        }
        this.activeRecaptchaId = this.recaptchaAPI.render(this.container.nativeElement, {
            sitekey: this.recaptchaConfig.siteKey,
            callback: this.onRecaptchaValidCallback.bind(this),
            'expired-callback': this.onRecaptchaExpiredCallback.bind(this),
        });
    };
    /**
     * Handler which will be registered with the recaptcha lib to be called
     * whenever it has a valid status
     * @return {?}
     */
    RecaptchaComponent.prototype.onRecaptchaValidCallback = function () {
        var _this = this;
        this.zone.run(function () {
            _this.onChange(true);
            _this.onTouched();
            _this.cd.markForCheck();
        });
    };
    /**
     * Handler which will be registered with the recaptcha lib to be called
     * whenever its valid status expires
     * @return {?}
     */
    RecaptchaComponent.prototype.onRecaptchaExpiredCallback = function () {
        var _this = this;
        this.zone.run(function () {
            _this.onChange(false);
            _this.cd.markForCheck();
        });
    };
    RecaptchaComponent.decorators = [
        { type: _angular_core__WEBPACK_IMPORTED_MODULE_0__["Component"], args: [{
                    selector: 'recaptcha',
                    changeDetection: _angular_core__WEBPACK_IMPORTED_MODULE_0__["ChangeDetectionStrategy"].OnPush,
                    template: "\n    <div class=\"angular-google-recaptcha-container\" #container></div>\n  ",
                    providers: [ScriptLoaderService],
                },] },
    ];
    /**
     * @nocollapse
     */
    RecaptchaComponent.ctorParameters = function () { return [
        { type: undefined, decorators: [{ type: _angular_core__WEBPACK_IMPORTED_MODULE_0__["Inject"], args: [RECAPTCHA_CONFIG,] },] },
        { type: _angular_forms__WEBPACK_IMPORTED_MODULE_1__["NgControl"], decorators: [{ type: _angular_core__WEBPACK_IMPORTED_MODULE_0__["Self"] }, { type: _angular_core__WEBPACK_IMPORTED_MODULE_0__["Optional"] },] },
        { type: ScriptLoaderService, },
        { type: _angular_core__WEBPACK_IMPORTED_MODULE_0__["NgZone"], },
        { type: _angular_core__WEBPACK_IMPORTED_MODULE_0__["ChangeDetectorRef"], },
    ]; };
    RecaptchaComponent.propDecorators = {
        'scriptLoad': [{ type: _angular_core__WEBPACK_IMPORTED_MODULE_0__["Output"] },],
        'scriptError': [{ type: _angular_core__WEBPACK_IMPORTED_MODULE_0__["Output"] },],
        'container': [{ type: _angular_core__WEBPACK_IMPORTED_MODULE_0__["ViewChild"], args: ['container',] },],
    };
    return RecaptchaComponent;
}());

var RecaptchaModule = /** @class */ (function () {
    function RecaptchaModule() {
    }
    /**
     * @param {?} recaptchaConfig
     * @return {?}
     */
    RecaptchaModule.forRoot = function (recaptchaConfig) {
        return {
            ngModule: RecaptchaModule,
            providers: [{ provide: RECAPTCHA_CONFIG, useValue: recaptchaConfig }],
        };
    };
    RecaptchaModule.decorators = [
        { type: _angular_core__WEBPACK_IMPORTED_MODULE_0__["NgModule"], args: [{
                    declarations: [RecaptchaComponent],
                    exports: [RecaptchaComponent],
                },] },
    ];
    /**
     * @nocollapse
     */
    RecaptchaModule.ctorParameters = function () { return []; };
    return RecaptchaModule;
}());

/**
 * Generated bundle index. Do not edit.
 */




/***/ }),

/***/ "./node_modules/raw-loader/index.js!./src/app/auth/login/login.component.html":
/*!***************************************************************************!*\
  !*** ./node_modules/raw-loader!./src/app/auth/login/login.component.html ***!
  \***************************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "\n<div class=\"wrapper fadeInDown\">\n  <div id=\"formContent\">\n    <!-- Tabs Titles -->\n\n    <!-- Icon -->\n    <div class=\"fadeIn first\">\n      <img src=\"assets/logo.png\" id=\"icon\" alt=\"User Icon\" />\n    </div>\n\n    <!-- Login Form -->\n    <form (ngSubmit)=\"login()\">\n      <input type=\"text\" [(ngModel)]=\"auth.userName\" id=\"userName\" class=\"fadeIn third\" name=\"userName\" placeholder=\"Имя пользователя\">\n\n      <input type=\"password\" [(ngModel)]=\"auth.password\" id=\"password\" class=\"fadeIn third\" name=\"login\" placeholder=\"Пароль\">\n\n      <input type=\"submit\" class=\"fadeIn fourth\" value=\"Вход\">\n    </form>\n\n    <!-- Remind Passowrd -->\n    <div id=\"formFooter\">\n\n    </div>\n\n  </div>\n</div>\n"

/***/ }),

/***/ "./src/app/auth/auth-routing.module.ts":
/*!*********************************************!*\
  !*** ./src/app/auth/auth-routing.module.ts ***!
  \*********************************************/
/*! exports provided: AuthRoutingModule */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "AuthRoutingModule", function() { return AuthRoutingModule; });
/* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! tslib */ "./node_modules/tslib/tslib.es6.js");
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");
/* harmony import */ var _angular_router__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @angular/router */ "./node_modules/@angular/router/fesm5/router.js");
/* harmony import */ var _login_login_component__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./login/login.component */ "./src/app/auth/login/login.component.ts");




var routes = [
    {
        path: '',
        component: _login_login_component__WEBPACK_IMPORTED_MODULE_3__["LoginComponent"]
    },
    {
        path: 'login',
        component: _login_login_component__WEBPACK_IMPORTED_MODULE_3__["LoginComponent"]
    }
];
var AuthRoutingModule = /** @class */ (function () {
    function AuthRoutingModule() {
    }
    AuthRoutingModule = tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_1__["NgModule"])({
            imports: [_angular_router__WEBPACK_IMPORTED_MODULE_2__["RouterModule"].forChild(routes)],
            exports: [_angular_router__WEBPACK_IMPORTED_MODULE_2__["RouterModule"]]
        })
    ], AuthRoutingModule);
    return AuthRoutingModule;
}());



/***/ }),

/***/ "./src/app/auth/auth.module.ts":
/*!*************************************!*\
  !*** ./src/app/auth/auth.module.ts ***!
  \*************************************/
/*! exports provided: AuthModule */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "AuthModule", function() { return AuthModule; });
/* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! tslib */ "./node_modules/tslib/tslib.es6.js");
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");
/* harmony import */ var _angular_common__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @angular/common */ "./node_modules/@angular/common/fesm5/common.js");
/* harmony import */ var _auth_routing_module__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./auth-routing.module */ "./src/app/auth/auth-routing.module.ts");
/* harmony import */ var _login_login_component__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./login/login.component */ "./src/app/auth/login/login.component.ts");
/* harmony import */ var _angular_forms__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! @angular/forms */ "./node_modules/@angular/forms/fesm5/forms.js");
/* harmony import */ var angular_google_recaptcha__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! angular-google-recaptcha */ "./node_modules/angular-google-recaptcha/angular-google-recaptcha.es5.js");







var AuthModule = /** @class */ (function () {
    function AuthModule() {
    }
    AuthModule = tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_1__["NgModule"])({
            declarations: [_login_login_component__WEBPACK_IMPORTED_MODULE_4__["LoginComponent"]],
            imports: [
                _angular_common__WEBPACK_IMPORTED_MODULE_2__["CommonModule"],
                _auth_routing_module__WEBPACK_IMPORTED_MODULE_3__["AuthRoutingModule"],
                angular_google_recaptcha__WEBPACK_IMPORTED_MODULE_6__["RecaptchaModule"].forRoot({
                    siteKey: '6LcYqcEUAAAAAAOjgEZHR7UTEf9tQvuUsiPCifUb',
                }),
                _angular_forms__WEBPACK_IMPORTED_MODULE_5__["FormsModule"]
            ]
        })
    ], AuthModule);
    return AuthModule;
}());



/***/ }),

/***/ "./src/app/auth/login/login.component.scss":
/*!*************************************************!*\
  !*** ./src/app/auth/login/login.component.scss ***!
  \*************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "/* BASIC */\nhtml {\n  background-color: #56baed;\n}\nbody {\n  font-family: \"Poppins\", sans-serif;\n  height: 100vh;\n}\na {\n  color: #92badd;\n  display: inline-block;\n  text-decoration: none;\n  font-weight: 400;\n}\nh2 {\n  text-align: center;\n  font-size: 16px;\n  font-weight: 600;\n  text-transform: uppercase;\n  display: inline-block;\n  margin: 40px 8px 10px 8px;\n  color: #cccccc;\n}\n/* STRUCTURE */\n.wrapper {\n  display: -webkit-box;\n  display: flex;\n  -webkit-box-align: center;\n          align-items: center;\n  -webkit-box-orient: vertical;\n  -webkit-box-direction: normal;\n          flex-direction: column;\n  -webkit-box-pack: center;\n          justify-content: center;\n  width: 100%;\n  min-height: 100%;\n  padding: 20px;\n}\n#formContent {\n  border-radius: 10px 10px 10px 10px;\n  background: #fff;\n  padding: 30px;\n  width: 90%;\n  max-width: 450px;\n  position: relative;\n  padding: 0px;\n  box-shadow: 0 30px 60px 0 rgba(0, 0, 0, 0.3);\n  text-align: center;\n}\n#formFooter {\n  background-color: #f6f6f6;\n  border-top: 1px solid #dce8f1;\n  padding: 25px;\n  text-align: center;\n  border-radius: 0 0 10px 10px;\n}\n/* TABS */\nh2.inactive {\n  color: #cccccc;\n}\nh2.active {\n  color: #0d0d0d;\n  border-bottom: 2px solid #5fbae9;\n}\n/* FORM TYPOGRAPHY*/\ninput[type=button], input[type=submit], input[type=reset] {\n  background-color: #56baed;\n  border: none;\n  color: white;\n  padding: 15px 80px;\n  text-align: center;\n  text-decoration: none;\n  display: inline-block;\n  text-transform: uppercase;\n  font-size: 13px;\n  box-shadow: 0 10px 30px 0 rgba(95, 186, 233, 0.4);\n  border-radius: 5px 5px 5px 5px;\n  margin: 5px 20px 40px 20px;\n  -webkit-transition: all 0.3s ease-in-out;\n  transition: all 0.3s ease-in-out;\n}\ninput[type=button]:hover, input[type=submit]:hover, input[type=reset]:hover {\n  background-color: #39ace7;\n}\ninput[type=button]:active, input[type=submit]:active, input[type=reset]:active {\n  -webkit-transform: scale(0.95);\n  transform: scale(0.95);\n}\ninput[type=text], .center-block {\n  background-color: #f6f6f6;\n  border: none;\n  color: #0d0d0d;\n  padding: 15px;\n  text-align: center;\n  text-decoration: none;\n  display: inline-block;\n  font-size: 16px;\n  margin: 5px;\n  width: 85%;\n  border: 2px solid #f6f6f6;\n  -webkit-transition: all 0.5s ease-in-out;\n  transition: all 0.5s ease-in-out;\n  border-radius: 5px 5px 5px 5px;\n}\ninput[type=password] {\n  background-color: #f6f6f6;\n  border: none;\n  color: #0d0d0d;\n  padding: 15px;\n  text-align: center;\n  text-decoration: none;\n  display: inline-block;\n  font-size: 16px;\n  margin: 5px;\n  width: 85%;\n  border: 2px solid #f6f6f6;\n  -webkit-transition: all 0.5s ease-in-out;\n  transition: all 0.5s ease-in-out;\n  border-radius: 5px 5px 5px 5px;\n}\ninput[type=text]:focus {\n  background-color: #fff;\n  border-bottom: 2px solid #5fbae9;\n}\ninput[type=text]:placeholder {\n  color: #cccccc;\n}\ninput[type=password]:focus {\n  background-color: #fff;\n  border-bottom: 2px solid #5fbae9;\n}\ninput[type=password]:placeholder {\n  color: #cccccc;\n}\n/* ANIMATIONS */\n/* Simple CSS3 Fade-in-down Animation */\n.fadeInDown {\n  -webkit-animation-name: fadeInDown;\n  animation-name: fadeInDown;\n  -webkit-animation-duration: 1s;\n  animation-duration: 1s;\n  -webkit-animation-fill-mode: both;\n  animation-fill-mode: both;\n}\n@-webkit-keyframes fadeInDown {\n  0% {\n    opacity: 0;\n    -webkit-transform: translate3d(0, -100%, 0);\n    transform: translate3d(0, -100%, 0);\n  }\n  100% {\n    opacity: 1;\n    -webkit-transform: none;\n    transform: none;\n  }\n}\n@keyframes fadeInDown {\n  0% {\n    opacity: 0;\n    -webkit-transform: translate3d(0, -100%, 0);\n    transform: translate3d(0, -100%, 0);\n  }\n  100% {\n    opacity: 1;\n    -webkit-transform: none;\n    transform: none;\n  }\n}\n/* Simple CSS3 Fade-in Animation */\n@-webkit-keyframes fadeIn {\n  from {\n    opacity: 0;\n  }\n  to {\n    opacity: 1;\n  }\n}\n@keyframes fadeIn {\n  from {\n    opacity: 0;\n  }\n  to {\n    opacity: 1;\n  }\n}\n.fadeIn {\n  opacity: 0;\n  -webkit-animation: fadeIn ease-in 1;\n  animation: fadeIn ease-in 1;\n  -webkit-animation-fill-mode: forwards;\n  animation-fill-mode: forwards;\n  -webkit-animation-duration: 1s;\n  animation-duration: 1s;\n}\n.fadeIn.first {\n  -webkit-animation-delay: 0.4s;\n  animation-delay: 0.4s;\n}\n.fadeIn.second {\n  -webkit-animation-delay: 0.6s;\n  animation-delay: 0.6s;\n}\n.fadeIn.third {\n  -webkit-animation-delay: 0.8s;\n  animation-delay: 0.8s;\n}\n.fadeIn.fourth {\n  -webkit-animation-delay: 1s;\n  animation-delay: 1s;\n}\n/* Simple CSS3 Fade-in Animation */\n.underlineHover:after {\n  display: block;\n  left: 0;\n  bottom: -10px;\n  width: 0;\n  height: 2px;\n  background-color: #56baed;\n  content: \"\";\n  -webkit-transition: width 0.2s;\n  transition: width 0.2s;\n}\n.underlineHover:hover {\n  color: #0d0d0d;\n}\n.underlineHover:hover:after {\n  width: 100%;\n}\n/* OTHERS */\n*:focus {\n  outline: none;\n}\n#icon {\n  width: 60%;\n}\n/*# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9Vc2Vycy9tZ2VyYXNpbS9Qcm9qZWN0cy9FbnRlclRlbFdlYi9zcmMvYXBwL2F1dGgvbG9naW4vbG9naW4uY29tcG9uZW50LnNjc3MiLCJzcmMvYXBwL2F1dGgvbG9naW4vbG9naW4uY29tcG9uZW50LnNjc3MiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQ0EsVUFBQTtBQUVBO0VBQ0UseUJBQUE7QUNERjtBRElBO0VBQ0Usa0NBQUE7RUFDQSxhQUFBO0FDREY7QURJQTtFQUNFLGNBQUE7RUFDQSxxQkFBQTtFQUNBLHFCQUFBO0VBQ0EsZ0JBQUE7QUNERjtBRElBO0VBQ0Usa0JBQUE7RUFDQSxlQUFBO0VBQ0EsZ0JBQUE7RUFDQSx5QkFBQTtFQUNBLHFCQUFBO0VBQ0EseUJBQUE7RUFDQSxjQUFBO0FDREY7QURNQSxjQUFBO0FBRUE7RUFDRSxvQkFBQTtFQUFBLGFBQUE7RUFDQSx5QkFBQTtVQUFBLG1CQUFBO0VBQ0EsNEJBQUE7RUFBQSw2QkFBQTtVQUFBLHNCQUFBO0VBQ0Esd0JBQUE7VUFBQSx1QkFBQTtFQUNBLFdBQUE7RUFDQSxnQkFBQTtFQUNBLGFBQUE7QUNKRjtBRE9BO0VBRUUsa0NBQUE7RUFDQSxnQkFBQTtFQUNBLGFBQUE7RUFDQSxVQUFBO0VBQ0EsZ0JBQUE7RUFDQSxrQkFBQTtFQUNBLFlBQUE7RUFFQSw0Q0FBQTtFQUNBLGtCQUFBO0FDSkY7QURPQTtFQUNFLHlCQUFBO0VBQ0EsNkJBQUE7RUFDQSxhQUFBO0VBQ0Esa0JBQUE7RUFFQSw0QkFBQTtBQ0pGO0FEU0EsU0FBQTtBQUVBO0VBQ0UsY0FBQTtBQ1BGO0FEVUE7RUFDRSxjQUFBO0VBQ0EsZ0NBQUE7QUNQRjtBRFlBLG1CQUFBO0FBRUE7RUFDRSx5QkFBQTtFQUNBLFlBQUE7RUFDQSxZQUFBO0VBQ0Esa0JBQUE7RUFDQSxrQkFBQTtFQUNBLHFCQUFBO0VBQ0EscUJBQUE7RUFDQSx5QkFBQTtFQUNBLGVBQUE7RUFFQSxpREFBQTtFQUVBLDhCQUFBO0VBQ0EsMEJBQUE7RUFDQSx3Q0FBQTtFQUlBLGdDQUFBO0FDVkY7QURhQTtFQUNFLHlCQUFBO0FDVkY7QURhQTtFQUVFLDhCQUFBO0VBR0Esc0JBQUE7QUNWRjtBRGFBO0VBQ0UseUJBQUE7RUFDQSxZQUFBO0VBQ0EsY0FBQTtFQUNBLGFBQUE7RUFDQSxrQkFBQTtFQUNBLHFCQUFBO0VBQ0EscUJBQUE7RUFDQSxlQUFBO0VBQ0EsV0FBQTtFQUNBLFVBQUE7RUFDQSx5QkFBQTtFQUNBLHdDQUFBO0VBSUEsZ0NBQUE7RUFFQSw4QkFBQTtBQ1ZGO0FEWUE7RUFDRSx5QkFBQTtFQUNBLFlBQUE7RUFDQSxjQUFBO0VBQ0EsYUFBQTtFQUNBLGtCQUFBO0VBQ0EscUJBQUE7RUFDQSxxQkFBQTtFQUNBLGVBQUE7RUFDQSxXQUFBO0VBQ0EsVUFBQTtFQUNBLHlCQUFBO0VBQ0Esd0NBQUE7RUFJQSxnQ0FBQTtFQUVBLDhCQUFBO0FDVEY7QURZQTtFQUNFLHNCQUFBO0VBQ0EsZ0NBQUE7QUNURjtBRFlBO0VBQ0UsY0FBQTtBQ1RGO0FEV0E7RUFDRSxzQkFBQTtFQUNBLGdDQUFBO0FDUkY7QURXQTtFQUNFLGNBQUE7QUNSRjtBRGFBLGVBQUE7QUFFQSx1Q0FBQTtBQUNBO0VBQ0Usa0NBQUE7RUFDQSwwQkFBQTtFQUNBLDhCQUFBO0VBQ0Esc0JBQUE7RUFDQSxpQ0FBQTtFQUNBLHlCQUFBO0FDWEY7QURjQTtFQUNFO0lBQ0UsVUFBQTtJQUNBLDJDQUFBO0lBQ0EsbUNBQUE7RUNYRjtFRGFBO0lBQ0UsVUFBQTtJQUNBLHVCQUFBO0lBQ0EsZUFBQTtFQ1hGO0FBQ0Y7QURjQTtFQUNFO0lBQ0UsVUFBQTtJQUNBLDJDQUFBO0lBQ0EsbUNBQUE7RUNaRjtFRGNBO0lBQ0UsVUFBQTtJQUNBLHVCQUFBO0lBQ0EsZUFBQTtFQ1pGO0FBQ0Y7QURlQSxrQ0FBQTtBQUNBO0VBQTRCO0lBQU8sVUFBQTtFQ1hqQztFRFc4QztJQUFLLFVBQUE7RUNSbkQ7QUFDRjtBRFNBO0VBQW9CO0lBQU8sVUFBQTtFQ0d6QjtFREhzQztJQUFLLFVBQUE7RUNNM0M7QUFDRjtBRExBO0VBQ0UsVUFBQTtFQUNBLG1DQUFBO0VBRUEsMkJBQUE7RUFFQSxxQ0FBQTtFQUVBLDZCQUFBO0VBRUEsOEJBQUE7RUFFQSxzQkFBQTtBQ0tGO0FERkE7RUFDRSw2QkFBQTtFQUVBLHFCQUFBO0FDS0Y7QURGQTtFQUNFLDZCQUFBO0VBRUEscUJBQUE7QUNLRjtBREZBO0VBQ0UsNkJBQUE7RUFFQSxxQkFBQTtBQ0tGO0FERkE7RUFDRSwyQkFBQTtFQUVBLG1CQUFBO0FDS0Y7QURGQSxrQ0FBQTtBQUNBO0VBQ0UsY0FBQTtFQUNBLE9BQUE7RUFDQSxhQUFBO0VBQ0EsUUFBQTtFQUNBLFdBQUE7RUFDQSx5QkFBQTtFQUNBLFdBQUE7RUFDQSw4QkFBQTtFQUFBLHNCQUFBO0FDS0Y7QURGQTtFQUNFLGNBQUE7QUNLRjtBREZBO0VBQ0UsV0FBQTtBQ0tGO0FEQUEsV0FBQTtBQUVBO0VBQ0UsYUFBQTtBQ0VGO0FEQ0E7RUFDRSxVQUFBO0FDRUYiLCJmaWxlIjoic3JjL2FwcC9hdXRoL2xvZ2luL2xvZ2luLmNvbXBvbmVudC5zY3NzIiwic291cmNlc0NvbnRlbnQiOlsiXG4vKiBCQVNJQyAqL1xuXG5odG1sIHtcbiAgYmFja2dyb3VuZC1jb2xvcjogIzU2YmFlZDtcbn1cblxuYm9keSB7XG4gIGZvbnQtZmFtaWx5OiBcIlBvcHBpbnNcIiwgc2Fucy1zZXJpZjtcbiAgaGVpZ2h0OiAxMDB2aDtcbn1cblxuYSB7XG4gIGNvbG9yOiAjOTJiYWRkO1xuICBkaXNwbGF5OmlubGluZS1ibG9jaztcbiAgdGV4dC1kZWNvcmF0aW9uOiBub25lO1xuICBmb250LXdlaWdodDogNDAwO1xufVxuXG5oMiB7XG4gIHRleHQtYWxpZ246IGNlbnRlcjtcbiAgZm9udC1zaXplOiAxNnB4O1xuICBmb250LXdlaWdodDogNjAwO1xuICB0ZXh0LXRyYW5zZm9ybTogdXBwZXJjYXNlO1xuICBkaXNwbGF5OmlubGluZS1ibG9jaztcbiAgbWFyZ2luOiA0MHB4IDhweCAxMHB4IDhweDtcbiAgY29sb3I6ICNjY2NjY2M7XG59XG5cblxuXG4vKiBTVFJVQ1RVUkUgKi9cblxuLndyYXBwZXIge1xuICBkaXNwbGF5OiBmbGV4O1xuICBhbGlnbi1pdGVtczogY2VudGVyO1xuICBmbGV4LWRpcmVjdGlvbjogY29sdW1uO1xuICBqdXN0aWZ5LWNvbnRlbnQ6IGNlbnRlcjtcbiAgd2lkdGg6IDEwMCU7XG4gIG1pbi1oZWlnaHQ6IDEwMCU7XG4gIHBhZGRpbmc6IDIwcHg7XG59XG5cbiNmb3JtQ29udGVudCB7XG4gIC13ZWJraXQtYm9yZGVyLXJhZGl1czogMTBweCAxMHB4IDEwcHggMTBweDtcbiAgYm9yZGVyLXJhZGl1czogMTBweCAxMHB4IDEwcHggMTBweDtcbiAgYmFja2dyb3VuZDogI2ZmZjtcbiAgcGFkZGluZzogMzBweDtcbiAgd2lkdGg6IDkwJTtcbiAgbWF4LXdpZHRoOiA0NTBweDtcbiAgcG9zaXRpb246IHJlbGF0aXZlO1xuICBwYWRkaW5nOiAwcHg7XG4gIC13ZWJraXQtYm94LXNoYWRvdzogMCAzMHB4IDYwcHggMCByZ2JhKDAsMCwwLDAuMyk7XG4gIGJveC1zaGFkb3c6IDAgMzBweCA2MHB4IDAgcmdiYSgwLDAsMCwwLjMpO1xuICB0ZXh0LWFsaWduOiBjZW50ZXI7XG59XG5cbiNmb3JtRm9vdGVyIHtcbiAgYmFja2dyb3VuZC1jb2xvcjogI2Y2ZjZmNjtcbiAgYm9yZGVyLXRvcDogMXB4IHNvbGlkICNkY2U4ZjE7XG4gIHBhZGRpbmc6IDI1cHg7XG4gIHRleHQtYWxpZ246IGNlbnRlcjtcbiAgLXdlYmtpdC1ib3JkZXItcmFkaXVzOiAwIDAgMTBweCAxMHB4O1xuICBib3JkZXItcmFkaXVzOiAwIDAgMTBweCAxMHB4O1xufVxuXG5cblxuLyogVEFCUyAqL1xuXG5oMi5pbmFjdGl2ZSB7XG4gIGNvbG9yOiAjY2NjY2NjO1xufVxuXG5oMi5hY3RpdmUge1xuICBjb2xvcjogIzBkMGQwZDtcbiAgYm9yZGVyLWJvdHRvbTogMnB4IHNvbGlkICM1ZmJhZTk7XG59XG5cblxuXG4vKiBGT1JNIFRZUE9HUkFQSFkqL1xuXG5pbnB1dFt0eXBlPWJ1dHRvbl0sIGlucHV0W3R5cGU9c3VibWl0XSwgaW5wdXRbdHlwZT1yZXNldF0gIHtcbiAgYmFja2dyb3VuZC1jb2xvcjogIzU2YmFlZDtcbiAgYm9yZGVyOiBub25lO1xuICBjb2xvcjogd2hpdGU7XG4gIHBhZGRpbmc6IDE1cHggODBweDtcbiAgdGV4dC1hbGlnbjogY2VudGVyO1xuICB0ZXh0LWRlY29yYXRpb246IG5vbmU7XG4gIGRpc3BsYXk6IGlubGluZS1ibG9jaztcbiAgdGV4dC10cmFuc2Zvcm06IHVwcGVyY2FzZTtcbiAgZm9udC1zaXplOiAxM3B4O1xuICAtd2Via2l0LWJveC1zaGFkb3c6IDAgMTBweCAzMHB4IDAgcmdiYSg5NSwxODYsMjMzLDAuNCk7XG4gIGJveC1zaGFkb3c6IDAgMTBweCAzMHB4IDAgcmdiYSg5NSwxODYsMjMzLDAuNCk7XG4gIC13ZWJraXQtYm9yZGVyLXJhZGl1czogNXB4IDVweCA1cHggNXB4O1xuICBib3JkZXItcmFkaXVzOiA1cHggNXB4IDVweCA1cHg7XG4gIG1hcmdpbjogNXB4IDIwcHggNDBweCAyMHB4O1xuICAtd2Via2l0LXRyYW5zaXRpb246IGFsbCAwLjNzIGVhc2UtaW4tb3V0O1xuICAtbW96LXRyYW5zaXRpb246IGFsbCAwLjNzIGVhc2UtaW4tb3V0O1xuICAtbXMtdHJhbnNpdGlvbjogYWxsIDAuM3MgZWFzZS1pbi1vdXQ7XG4gIC1vLXRyYW5zaXRpb246IGFsbCAwLjNzIGVhc2UtaW4tb3V0O1xuICB0cmFuc2l0aW9uOiBhbGwgMC4zcyBlYXNlLWluLW91dDtcbn1cblxuaW5wdXRbdHlwZT1idXR0b25dOmhvdmVyLCBpbnB1dFt0eXBlPXN1Ym1pdF06aG92ZXIsIGlucHV0W3R5cGU9cmVzZXRdOmhvdmVyICB7XG4gIGJhY2tncm91bmQtY29sb3I6ICMzOWFjZTc7XG59XG5cbmlucHV0W3R5cGU9YnV0dG9uXTphY3RpdmUsIGlucHV0W3R5cGU9c3VibWl0XTphY3RpdmUsIGlucHV0W3R5cGU9cmVzZXRdOmFjdGl2ZSAge1xuICAtbW96LXRyYW5zZm9ybTogc2NhbGUoMC45NSk7XG4gIC13ZWJraXQtdHJhbnNmb3JtOiBzY2FsZSgwLjk1KTtcbiAgLW8tdHJhbnNmb3JtOiBzY2FsZSgwLjk1KTtcbiAgLW1zLXRyYW5zZm9ybTogc2NhbGUoMC45NSk7XG4gIHRyYW5zZm9ybTogc2NhbGUoMC45NSk7XG59XG5cbmlucHV0W3R5cGU9dGV4dF0sIC5jZW50ZXItYmxvY2sge1xuICBiYWNrZ3JvdW5kLWNvbG9yOiAjZjZmNmY2O1xuICBib3JkZXI6IG5vbmU7XG4gIGNvbG9yOiAjMGQwZDBkO1xuICBwYWRkaW5nOiAxNXB4O1xuICB0ZXh0LWFsaWduOiBjZW50ZXI7XG4gIHRleHQtZGVjb3JhdGlvbjogbm9uZTtcbiAgZGlzcGxheTogaW5saW5lLWJsb2NrO1xuICBmb250LXNpemU6IDE2cHg7XG4gIG1hcmdpbjogNXB4O1xuICB3aWR0aDogODUlO1xuICBib3JkZXI6IDJweCBzb2xpZCAjZjZmNmY2O1xuICAtd2Via2l0LXRyYW5zaXRpb246IGFsbCAwLjVzIGVhc2UtaW4tb3V0O1xuICAtbW96LXRyYW5zaXRpb246IGFsbCAwLjVzIGVhc2UtaW4tb3V0O1xuICAtbXMtdHJhbnNpdGlvbjogYWxsIDAuNXMgZWFzZS1pbi1vdXQ7XG4gIC1vLXRyYW5zaXRpb246IGFsbCAwLjVzIGVhc2UtaW4tb3V0O1xuICB0cmFuc2l0aW9uOiBhbGwgMC41cyBlYXNlLWluLW91dDtcbiAgLXdlYmtpdC1ib3JkZXItcmFkaXVzOiA1cHggNXB4IDVweCA1cHg7XG4gIGJvcmRlci1yYWRpdXM6IDVweCA1cHggNXB4IDVweDtcbn1cbmlucHV0W3R5cGU9cGFzc3dvcmRdIHtcbiAgYmFja2dyb3VuZC1jb2xvcjogI2Y2ZjZmNjtcbiAgYm9yZGVyOiBub25lO1xuICBjb2xvcjogIzBkMGQwZDtcbiAgcGFkZGluZzogMTVweDtcbiAgdGV4dC1hbGlnbjogY2VudGVyO1xuICB0ZXh0LWRlY29yYXRpb246IG5vbmU7XG4gIGRpc3BsYXk6IGlubGluZS1ibG9jaztcbiAgZm9udC1zaXplOiAxNnB4O1xuICBtYXJnaW46IDVweDtcbiAgd2lkdGg6IDg1JTtcbiAgYm9yZGVyOiAycHggc29saWQgI2Y2ZjZmNjtcbiAgLXdlYmtpdC10cmFuc2l0aW9uOiBhbGwgMC41cyBlYXNlLWluLW91dDtcbiAgLW1vei10cmFuc2l0aW9uOiBhbGwgMC41cyBlYXNlLWluLW91dDtcbiAgLW1zLXRyYW5zaXRpb246IGFsbCAwLjVzIGVhc2UtaW4tb3V0O1xuICAtby10cmFuc2l0aW9uOiBhbGwgMC41cyBlYXNlLWluLW91dDtcbiAgdHJhbnNpdGlvbjogYWxsIDAuNXMgZWFzZS1pbi1vdXQ7XG4gIC13ZWJraXQtYm9yZGVyLXJhZGl1czogNXB4IDVweCA1cHggNXB4O1xuICBib3JkZXItcmFkaXVzOiA1cHggNXB4IDVweCA1cHg7XG59XG5cbmlucHV0W3R5cGU9dGV4dF06Zm9jdXMge1xuICBiYWNrZ3JvdW5kLWNvbG9yOiAjZmZmO1xuICBib3JkZXItYm90dG9tOiAycHggc29saWQgIzVmYmFlOTtcbn1cblxuaW5wdXRbdHlwZT10ZXh0XTpwbGFjZWhvbGRlciB7XG4gIGNvbG9yOiAjY2NjY2NjO1xufVxuaW5wdXRbdHlwZT1wYXNzd29yZF06Zm9jdXMge1xuICBiYWNrZ3JvdW5kLWNvbG9yOiAjZmZmO1xuICBib3JkZXItYm90dG9tOiAycHggc29saWQgIzVmYmFlOTtcbn1cblxuaW5wdXRbdHlwZT1wYXNzd29yZF06cGxhY2Vob2xkZXIge1xuICBjb2xvcjogI2NjY2NjYztcbn1cblxuXG5cbi8qIEFOSU1BVElPTlMgKi9cblxuLyogU2ltcGxlIENTUzMgRmFkZS1pbi1kb3duIEFuaW1hdGlvbiAqL1xuLmZhZGVJbkRvd24ge1xuICAtd2Via2l0LWFuaW1hdGlvbi1uYW1lOiBmYWRlSW5Eb3duO1xuICBhbmltYXRpb24tbmFtZTogZmFkZUluRG93bjtcbiAgLXdlYmtpdC1hbmltYXRpb24tZHVyYXRpb246IDFzO1xuICBhbmltYXRpb24tZHVyYXRpb246IDFzO1xuICAtd2Via2l0LWFuaW1hdGlvbi1maWxsLW1vZGU6IGJvdGg7XG4gIGFuaW1hdGlvbi1maWxsLW1vZGU6IGJvdGg7XG59XG5cbkAtd2Via2l0LWtleWZyYW1lcyBmYWRlSW5Eb3duIHtcbiAgMCUge1xuICAgIG9wYWNpdHk6IDA7XG4gICAgLXdlYmtpdC10cmFuc2Zvcm06IHRyYW5zbGF0ZTNkKDAsIC0xMDAlLCAwKTtcbiAgICB0cmFuc2Zvcm06IHRyYW5zbGF0ZTNkKDAsIC0xMDAlLCAwKTtcbiAgfVxuICAxMDAlIHtcbiAgICBvcGFjaXR5OiAxO1xuICAgIC13ZWJraXQtdHJhbnNmb3JtOiBub25lO1xuICAgIHRyYW5zZm9ybTogbm9uZTtcbiAgfVxufVxuXG5Aa2V5ZnJhbWVzIGZhZGVJbkRvd24ge1xuICAwJSB7XG4gICAgb3BhY2l0eTogMDtcbiAgICAtd2Via2l0LXRyYW5zZm9ybTogdHJhbnNsYXRlM2QoMCwgLTEwMCUsIDApO1xuICAgIHRyYW5zZm9ybTogdHJhbnNsYXRlM2QoMCwgLTEwMCUsIDApO1xuICB9XG4gIDEwMCUge1xuICAgIG9wYWNpdHk6IDE7XG4gICAgLXdlYmtpdC10cmFuc2Zvcm06IG5vbmU7XG4gICAgdHJhbnNmb3JtOiBub25lO1xuICB9XG59XG5cbi8qIFNpbXBsZSBDU1MzIEZhZGUtaW4gQW5pbWF0aW9uICovXG5ALXdlYmtpdC1rZXlmcmFtZXMgZmFkZUluIHsgZnJvbSB7IG9wYWNpdHk6MDsgfSB0byB7IG9wYWNpdHk6MTsgfSB9XG5ALW1vei1rZXlmcmFtZXMgZmFkZUluIHsgZnJvbSB7IG9wYWNpdHk6MDsgfSB0byB7IG9wYWNpdHk6MTsgfSB9XG5Aa2V5ZnJhbWVzIGZhZGVJbiB7IGZyb20geyBvcGFjaXR5OjA7IH0gdG8geyBvcGFjaXR5OjE7IH0gfVxuXG4uZmFkZUluIHtcbiAgb3BhY2l0eTowO1xuICAtd2Via2l0LWFuaW1hdGlvbjpmYWRlSW4gZWFzZS1pbiAxO1xuICAtbW96LWFuaW1hdGlvbjpmYWRlSW4gZWFzZS1pbiAxO1xuICBhbmltYXRpb246ZmFkZUluIGVhc2UtaW4gMTtcblxuICAtd2Via2l0LWFuaW1hdGlvbi1maWxsLW1vZGU6Zm9yd2FyZHM7XG4gIC1tb3otYW5pbWF0aW9uLWZpbGwtbW9kZTpmb3J3YXJkcztcbiAgYW5pbWF0aW9uLWZpbGwtbW9kZTpmb3J3YXJkcztcblxuICAtd2Via2l0LWFuaW1hdGlvbi1kdXJhdGlvbjoxcztcbiAgLW1vei1hbmltYXRpb24tZHVyYXRpb246MXM7XG4gIGFuaW1hdGlvbi1kdXJhdGlvbjoxcztcbn1cblxuLmZhZGVJbi5maXJzdCB7XG4gIC13ZWJraXQtYW5pbWF0aW9uLWRlbGF5OiAwLjRzO1xuICAtbW96LWFuaW1hdGlvbi1kZWxheTogMC40cztcbiAgYW5pbWF0aW9uLWRlbGF5OiAwLjRzO1xufVxuXG4uZmFkZUluLnNlY29uZCB7XG4gIC13ZWJraXQtYW5pbWF0aW9uLWRlbGF5OiAwLjZzO1xuICAtbW96LWFuaW1hdGlvbi1kZWxheTogMC42cztcbiAgYW5pbWF0aW9uLWRlbGF5OiAwLjZzO1xufVxuXG4uZmFkZUluLnRoaXJkIHtcbiAgLXdlYmtpdC1hbmltYXRpb24tZGVsYXk6IDAuOHM7XG4gIC1tb3otYW5pbWF0aW9uLWRlbGF5OiAwLjhzO1xuICBhbmltYXRpb24tZGVsYXk6IDAuOHM7XG59XG5cbi5mYWRlSW4uZm91cnRoIHtcbiAgLXdlYmtpdC1hbmltYXRpb24tZGVsYXk6IDFzO1xuICAtbW96LWFuaW1hdGlvbi1kZWxheTogMXM7XG4gIGFuaW1hdGlvbi1kZWxheTogMXM7XG59XG5cbi8qIFNpbXBsZSBDU1MzIEZhZGUtaW4gQW5pbWF0aW9uICovXG4udW5kZXJsaW5lSG92ZXI6YWZ0ZXIge1xuICBkaXNwbGF5OiBibG9jaztcbiAgbGVmdDogMDtcbiAgYm90dG9tOiAtMTBweDtcbiAgd2lkdGg6IDA7XG4gIGhlaWdodDogMnB4O1xuICBiYWNrZ3JvdW5kLWNvbG9yOiAjNTZiYWVkO1xuICBjb250ZW50OiBcIlwiO1xuICB0cmFuc2l0aW9uOiB3aWR0aCAwLjJzO1xufVxuXG4udW5kZXJsaW5lSG92ZXI6aG92ZXIge1xuICBjb2xvcjogIzBkMGQwZDtcbn1cblxuLnVuZGVybGluZUhvdmVyOmhvdmVyOmFmdGVye1xuICB3aWR0aDogMTAwJTtcbn1cblxuXG5cbi8qIE9USEVSUyAqL1xuXG4qOmZvY3VzIHtcbiAgb3V0bGluZTogbm9uZTtcbn1cblxuI2ljb24ge1xuICB3aWR0aDo2MCU7XG59XG4iLCIvKiBCQVNJQyAqL1xuaHRtbCB7XG4gIGJhY2tncm91bmQtY29sb3I6ICM1NmJhZWQ7XG59XG5cbmJvZHkge1xuICBmb250LWZhbWlseTogXCJQb3BwaW5zXCIsIHNhbnMtc2VyaWY7XG4gIGhlaWdodDogMTAwdmg7XG59XG5cbmEge1xuICBjb2xvcjogIzkyYmFkZDtcbiAgZGlzcGxheTogaW5saW5lLWJsb2NrO1xuICB0ZXh0LWRlY29yYXRpb246IG5vbmU7XG4gIGZvbnQtd2VpZ2h0OiA0MDA7XG59XG5cbmgyIHtcbiAgdGV4dC1hbGlnbjogY2VudGVyO1xuICBmb250LXNpemU6IDE2cHg7XG4gIGZvbnQtd2VpZ2h0OiA2MDA7XG4gIHRleHQtdHJhbnNmb3JtOiB1cHBlcmNhc2U7XG4gIGRpc3BsYXk6IGlubGluZS1ibG9jaztcbiAgbWFyZ2luOiA0MHB4IDhweCAxMHB4IDhweDtcbiAgY29sb3I6ICNjY2NjY2M7XG59XG5cbi8qIFNUUlVDVFVSRSAqL1xuLndyYXBwZXIge1xuICBkaXNwbGF5OiBmbGV4O1xuICBhbGlnbi1pdGVtczogY2VudGVyO1xuICBmbGV4LWRpcmVjdGlvbjogY29sdW1uO1xuICBqdXN0aWZ5LWNvbnRlbnQ6IGNlbnRlcjtcbiAgd2lkdGg6IDEwMCU7XG4gIG1pbi1oZWlnaHQ6IDEwMCU7XG4gIHBhZGRpbmc6IDIwcHg7XG59XG5cbiNmb3JtQ29udGVudCB7XG4gIC13ZWJraXQtYm9yZGVyLXJhZGl1czogMTBweCAxMHB4IDEwcHggMTBweDtcbiAgYm9yZGVyLXJhZGl1czogMTBweCAxMHB4IDEwcHggMTBweDtcbiAgYmFja2dyb3VuZDogI2ZmZjtcbiAgcGFkZGluZzogMzBweDtcbiAgd2lkdGg6IDkwJTtcbiAgbWF4LXdpZHRoOiA0NTBweDtcbiAgcG9zaXRpb246IHJlbGF0aXZlO1xuICBwYWRkaW5nOiAwcHg7XG4gIC13ZWJraXQtYm94LXNoYWRvdzogMCAzMHB4IDYwcHggMCByZ2JhKDAsIDAsIDAsIDAuMyk7XG4gIGJveC1zaGFkb3c6IDAgMzBweCA2MHB4IDAgcmdiYSgwLCAwLCAwLCAwLjMpO1xuICB0ZXh0LWFsaWduOiBjZW50ZXI7XG59XG5cbiNmb3JtRm9vdGVyIHtcbiAgYmFja2dyb3VuZC1jb2xvcjogI2Y2ZjZmNjtcbiAgYm9yZGVyLXRvcDogMXB4IHNvbGlkICNkY2U4ZjE7XG4gIHBhZGRpbmc6IDI1cHg7XG4gIHRleHQtYWxpZ246IGNlbnRlcjtcbiAgLXdlYmtpdC1ib3JkZXItcmFkaXVzOiAwIDAgMTBweCAxMHB4O1xuICBib3JkZXItcmFkaXVzOiAwIDAgMTBweCAxMHB4O1xufVxuXG4vKiBUQUJTICovXG5oMi5pbmFjdGl2ZSB7XG4gIGNvbG9yOiAjY2NjY2NjO1xufVxuXG5oMi5hY3RpdmUge1xuICBjb2xvcjogIzBkMGQwZDtcbiAgYm9yZGVyLWJvdHRvbTogMnB4IHNvbGlkICM1ZmJhZTk7XG59XG5cbi8qIEZPUk0gVFlQT0dSQVBIWSovXG5pbnB1dFt0eXBlPWJ1dHRvbl0sIGlucHV0W3R5cGU9c3VibWl0XSwgaW5wdXRbdHlwZT1yZXNldF0ge1xuICBiYWNrZ3JvdW5kLWNvbG9yOiAjNTZiYWVkO1xuICBib3JkZXI6IG5vbmU7XG4gIGNvbG9yOiB3aGl0ZTtcbiAgcGFkZGluZzogMTVweCA4MHB4O1xuICB0ZXh0LWFsaWduOiBjZW50ZXI7XG4gIHRleHQtZGVjb3JhdGlvbjogbm9uZTtcbiAgZGlzcGxheTogaW5saW5lLWJsb2NrO1xuICB0ZXh0LXRyYW5zZm9ybTogdXBwZXJjYXNlO1xuICBmb250LXNpemU6IDEzcHg7XG4gIC13ZWJraXQtYm94LXNoYWRvdzogMCAxMHB4IDMwcHggMCByZ2JhKDk1LCAxODYsIDIzMywgMC40KTtcbiAgYm94LXNoYWRvdzogMCAxMHB4IDMwcHggMCByZ2JhKDk1LCAxODYsIDIzMywgMC40KTtcbiAgLXdlYmtpdC1ib3JkZXItcmFkaXVzOiA1cHggNXB4IDVweCA1cHg7XG4gIGJvcmRlci1yYWRpdXM6IDVweCA1cHggNXB4IDVweDtcbiAgbWFyZ2luOiA1cHggMjBweCA0MHB4IDIwcHg7XG4gIC13ZWJraXQtdHJhbnNpdGlvbjogYWxsIDAuM3MgZWFzZS1pbi1vdXQ7XG4gIC1tb3otdHJhbnNpdGlvbjogYWxsIDAuM3MgZWFzZS1pbi1vdXQ7XG4gIC1tcy10cmFuc2l0aW9uOiBhbGwgMC4zcyBlYXNlLWluLW91dDtcbiAgLW8tdHJhbnNpdGlvbjogYWxsIDAuM3MgZWFzZS1pbi1vdXQ7XG4gIHRyYW5zaXRpb246IGFsbCAwLjNzIGVhc2UtaW4tb3V0O1xufVxuXG5pbnB1dFt0eXBlPWJ1dHRvbl06aG92ZXIsIGlucHV0W3R5cGU9c3VibWl0XTpob3ZlciwgaW5wdXRbdHlwZT1yZXNldF06aG92ZXIge1xuICBiYWNrZ3JvdW5kLWNvbG9yOiAjMzlhY2U3O1xufVxuXG5pbnB1dFt0eXBlPWJ1dHRvbl06YWN0aXZlLCBpbnB1dFt0eXBlPXN1Ym1pdF06YWN0aXZlLCBpbnB1dFt0eXBlPXJlc2V0XTphY3RpdmUge1xuICAtbW96LXRyYW5zZm9ybTogc2NhbGUoMC45NSk7XG4gIC13ZWJraXQtdHJhbnNmb3JtOiBzY2FsZSgwLjk1KTtcbiAgLW8tdHJhbnNmb3JtOiBzY2FsZSgwLjk1KTtcbiAgLW1zLXRyYW5zZm9ybTogc2NhbGUoMC45NSk7XG4gIHRyYW5zZm9ybTogc2NhbGUoMC45NSk7XG59XG5cbmlucHV0W3R5cGU9dGV4dF0sIC5jZW50ZXItYmxvY2sge1xuICBiYWNrZ3JvdW5kLWNvbG9yOiAjZjZmNmY2O1xuICBib3JkZXI6IG5vbmU7XG4gIGNvbG9yOiAjMGQwZDBkO1xuICBwYWRkaW5nOiAxNXB4O1xuICB0ZXh0LWFsaWduOiBjZW50ZXI7XG4gIHRleHQtZGVjb3JhdGlvbjogbm9uZTtcbiAgZGlzcGxheTogaW5saW5lLWJsb2NrO1xuICBmb250LXNpemU6IDE2cHg7XG4gIG1hcmdpbjogNXB4O1xuICB3aWR0aDogODUlO1xuICBib3JkZXI6IDJweCBzb2xpZCAjZjZmNmY2O1xuICAtd2Via2l0LXRyYW5zaXRpb246IGFsbCAwLjVzIGVhc2UtaW4tb3V0O1xuICAtbW96LXRyYW5zaXRpb246IGFsbCAwLjVzIGVhc2UtaW4tb3V0O1xuICAtbXMtdHJhbnNpdGlvbjogYWxsIDAuNXMgZWFzZS1pbi1vdXQ7XG4gIC1vLXRyYW5zaXRpb246IGFsbCAwLjVzIGVhc2UtaW4tb3V0O1xuICB0cmFuc2l0aW9uOiBhbGwgMC41cyBlYXNlLWluLW91dDtcbiAgLXdlYmtpdC1ib3JkZXItcmFkaXVzOiA1cHggNXB4IDVweCA1cHg7XG4gIGJvcmRlci1yYWRpdXM6IDVweCA1cHggNXB4IDVweDtcbn1cblxuaW5wdXRbdHlwZT1wYXNzd29yZF0ge1xuICBiYWNrZ3JvdW5kLWNvbG9yOiAjZjZmNmY2O1xuICBib3JkZXI6IG5vbmU7XG4gIGNvbG9yOiAjMGQwZDBkO1xuICBwYWRkaW5nOiAxNXB4O1xuICB0ZXh0LWFsaWduOiBjZW50ZXI7XG4gIHRleHQtZGVjb3JhdGlvbjogbm9uZTtcbiAgZGlzcGxheTogaW5saW5lLWJsb2NrO1xuICBmb250LXNpemU6IDE2cHg7XG4gIG1hcmdpbjogNXB4O1xuICB3aWR0aDogODUlO1xuICBib3JkZXI6IDJweCBzb2xpZCAjZjZmNmY2O1xuICAtd2Via2l0LXRyYW5zaXRpb246IGFsbCAwLjVzIGVhc2UtaW4tb3V0O1xuICAtbW96LXRyYW5zaXRpb246IGFsbCAwLjVzIGVhc2UtaW4tb3V0O1xuICAtbXMtdHJhbnNpdGlvbjogYWxsIDAuNXMgZWFzZS1pbi1vdXQ7XG4gIC1vLXRyYW5zaXRpb246IGFsbCAwLjVzIGVhc2UtaW4tb3V0O1xuICB0cmFuc2l0aW9uOiBhbGwgMC41cyBlYXNlLWluLW91dDtcbiAgLXdlYmtpdC1ib3JkZXItcmFkaXVzOiA1cHggNXB4IDVweCA1cHg7XG4gIGJvcmRlci1yYWRpdXM6IDVweCA1cHggNXB4IDVweDtcbn1cblxuaW5wdXRbdHlwZT10ZXh0XTpmb2N1cyB7XG4gIGJhY2tncm91bmQtY29sb3I6ICNmZmY7XG4gIGJvcmRlci1ib3R0b206IDJweCBzb2xpZCAjNWZiYWU5O1xufVxuXG5pbnB1dFt0eXBlPXRleHRdOnBsYWNlaG9sZGVyIHtcbiAgY29sb3I6ICNjY2NjY2M7XG59XG5cbmlucHV0W3R5cGU9cGFzc3dvcmRdOmZvY3VzIHtcbiAgYmFja2dyb3VuZC1jb2xvcjogI2ZmZjtcbiAgYm9yZGVyLWJvdHRvbTogMnB4IHNvbGlkICM1ZmJhZTk7XG59XG5cbmlucHV0W3R5cGU9cGFzc3dvcmRdOnBsYWNlaG9sZGVyIHtcbiAgY29sb3I6ICNjY2NjY2M7XG59XG5cbi8qIEFOSU1BVElPTlMgKi9cbi8qIFNpbXBsZSBDU1MzIEZhZGUtaW4tZG93biBBbmltYXRpb24gKi9cbi5mYWRlSW5Eb3duIHtcbiAgLXdlYmtpdC1hbmltYXRpb24tbmFtZTogZmFkZUluRG93bjtcbiAgYW5pbWF0aW9uLW5hbWU6IGZhZGVJbkRvd247XG4gIC13ZWJraXQtYW5pbWF0aW9uLWR1cmF0aW9uOiAxcztcbiAgYW5pbWF0aW9uLWR1cmF0aW9uOiAxcztcbiAgLXdlYmtpdC1hbmltYXRpb24tZmlsbC1tb2RlOiBib3RoO1xuICBhbmltYXRpb24tZmlsbC1tb2RlOiBib3RoO1xufVxuXG5ALXdlYmtpdC1rZXlmcmFtZXMgZmFkZUluRG93biB7XG4gIDAlIHtcbiAgICBvcGFjaXR5OiAwO1xuICAgIC13ZWJraXQtdHJhbnNmb3JtOiB0cmFuc2xhdGUzZCgwLCAtMTAwJSwgMCk7XG4gICAgdHJhbnNmb3JtOiB0cmFuc2xhdGUzZCgwLCAtMTAwJSwgMCk7XG4gIH1cbiAgMTAwJSB7XG4gICAgb3BhY2l0eTogMTtcbiAgICAtd2Via2l0LXRyYW5zZm9ybTogbm9uZTtcbiAgICB0cmFuc2Zvcm06IG5vbmU7XG4gIH1cbn1cbkBrZXlmcmFtZXMgZmFkZUluRG93biB7XG4gIDAlIHtcbiAgICBvcGFjaXR5OiAwO1xuICAgIC13ZWJraXQtdHJhbnNmb3JtOiB0cmFuc2xhdGUzZCgwLCAtMTAwJSwgMCk7XG4gICAgdHJhbnNmb3JtOiB0cmFuc2xhdGUzZCgwLCAtMTAwJSwgMCk7XG4gIH1cbiAgMTAwJSB7XG4gICAgb3BhY2l0eTogMTtcbiAgICAtd2Via2l0LXRyYW5zZm9ybTogbm9uZTtcbiAgICB0cmFuc2Zvcm06IG5vbmU7XG4gIH1cbn1cbi8qIFNpbXBsZSBDU1MzIEZhZGUtaW4gQW5pbWF0aW9uICovXG5ALXdlYmtpdC1rZXlmcmFtZXMgZmFkZUluIHtcbiAgZnJvbSB7XG4gICAgb3BhY2l0eTogMDtcbiAgfVxuICB0byB7XG4gICAgb3BhY2l0eTogMTtcbiAgfVxufVxuQC1tb3ota2V5ZnJhbWVzIGZhZGVJbiB7XG4gIGZyb20ge1xuICAgIG9wYWNpdHk6IDA7XG4gIH1cbiAgdG8ge1xuICAgIG9wYWNpdHk6IDE7XG4gIH1cbn1cbkBrZXlmcmFtZXMgZmFkZUluIHtcbiAgZnJvbSB7XG4gICAgb3BhY2l0eTogMDtcbiAgfVxuICB0byB7XG4gICAgb3BhY2l0eTogMTtcbiAgfVxufVxuLmZhZGVJbiB7XG4gIG9wYWNpdHk6IDA7XG4gIC13ZWJraXQtYW5pbWF0aW9uOiBmYWRlSW4gZWFzZS1pbiAxO1xuICAtbW96LWFuaW1hdGlvbjogZmFkZUluIGVhc2UtaW4gMTtcbiAgYW5pbWF0aW9uOiBmYWRlSW4gZWFzZS1pbiAxO1xuICAtd2Via2l0LWFuaW1hdGlvbi1maWxsLW1vZGU6IGZvcndhcmRzO1xuICAtbW96LWFuaW1hdGlvbi1maWxsLW1vZGU6IGZvcndhcmRzO1xuICBhbmltYXRpb24tZmlsbC1tb2RlOiBmb3J3YXJkcztcbiAgLXdlYmtpdC1hbmltYXRpb24tZHVyYXRpb246IDFzO1xuICAtbW96LWFuaW1hdGlvbi1kdXJhdGlvbjogMXM7XG4gIGFuaW1hdGlvbi1kdXJhdGlvbjogMXM7XG59XG5cbi5mYWRlSW4uZmlyc3Qge1xuICAtd2Via2l0LWFuaW1hdGlvbi1kZWxheTogMC40cztcbiAgLW1vei1hbmltYXRpb24tZGVsYXk6IDAuNHM7XG4gIGFuaW1hdGlvbi1kZWxheTogMC40cztcbn1cblxuLmZhZGVJbi5zZWNvbmQge1xuICAtd2Via2l0LWFuaW1hdGlvbi1kZWxheTogMC42cztcbiAgLW1vei1hbmltYXRpb24tZGVsYXk6IDAuNnM7XG4gIGFuaW1hdGlvbi1kZWxheTogMC42cztcbn1cblxuLmZhZGVJbi50aGlyZCB7XG4gIC13ZWJraXQtYW5pbWF0aW9uLWRlbGF5OiAwLjhzO1xuICAtbW96LWFuaW1hdGlvbi1kZWxheTogMC44cztcbiAgYW5pbWF0aW9uLWRlbGF5OiAwLjhzO1xufVxuXG4uZmFkZUluLmZvdXJ0aCB7XG4gIC13ZWJraXQtYW5pbWF0aW9uLWRlbGF5OiAxcztcbiAgLW1vei1hbmltYXRpb24tZGVsYXk6IDFzO1xuICBhbmltYXRpb24tZGVsYXk6IDFzO1xufVxuXG4vKiBTaW1wbGUgQ1NTMyBGYWRlLWluIEFuaW1hdGlvbiAqL1xuLnVuZGVybGluZUhvdmVyOmFmdGVyIHtcbiAgZGlzcGxheTogYmxvY2s7XG4gIGxlZnQ6IDA7XG4gIGJvdHRvbTogLTEwcHg7XG4gIHdpZHRoOiAwO1xuICBoZWlnaHQ6IDJweDtcbiAgYmFja2dyb3VuZC1jb2xvcjogIzU2YmFlZDtcbiAgY29udGVudDogXCJcIjtcbiAgdHJhbnNpdGlvbjogd2lkdGggMC4ycztcbn1cblxuLnVuZGVybGluZUhvdmVyOmhvdmVyIHtcbiAgY29sb3I6ICMwZDBkMGQ7XG59XG5cbi51bmRlcmxpbmVIb3Zlcjpob3ZlcjphZnRlciB7XG4gIHdpZHRoOiAxMDAlO1xufVxuXG4vKiBPVEhFUlMgKi9cbio6Zm9jdXMge1xuICBvdXRsaW5lOiBub25lO1xufVxuXG4jaWNvbiB7XG4gIHdpZHRoOiA2MCU7XG59Il19 */"

/***/ }),

/***/ "./src/app/auth/login/login.component.ts":
/*!***********************************************!*\
  !*** ./src/app/auth/login/login.component.ts ***!
  \***********************************************/
/*! exports provided: LoginComponent */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "LoginComponent", function() { return LoginComponent; });
/* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! tslib */ "./node_modules/tslib/tslib.es6.js");
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");
/* harmony import */ var devextreme_ui_notify__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! devextreme/ui/notify */ "./node_modules/devextreme/ui/notify.js");
/* harmony import */ var devextreme_ui_notify__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(devextreme_ui_notify__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var _shared_error_handle__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../../shared/error-handle */ "./src/app/shared/error-handle.ts");
/* harmony import */ var _shared_services_navigation_service__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../../shared/services/navigation.service */ "./src/app/shared/services/navigation.service.ts");
/* harmony import */ var _auth_service__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../auth.service */ "./src/app/auth/auth.service.ts");






var LoginComponent = /** @class */ (function () {
    function LoginComponent(authService, navigationService) {
        this.authService = authService;
        this.navigationService = navigationService;
        this.auth = {
            userName: '',
            password: ''
        };
    }
    LoginComponent.prototype.ngOnInit = function () {
    };
    LoginComponent.prototype.login = function () {
        var _this = this;
        this.authService.login(this.auth).subscribe(function (data) {
            devextreme_ui_notify__WEBPACK_IMPORTED_MODULE_2___default()('Авторизация успешна пройдена');
            _this.navigationService.toEmployees();
        }, function (error) {
            Object(_shared_error_handle__WEBPACK_IMPORTED_MODULE_3__["showError"])(error);
        });
    };
    LoginComponent.ctorParameters = function () { return [
        { type: _auth_service__WEBPACK_IMPORTED_MODULE_5__["AuthService"] },
        { type: _shared_services_navigation_service__WEBPACK_IMPORTED_MODULE_4__["NavigationService"] }
    ]; };
    LoginComponent = tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_1__["Component"])({
            selector: 'app-login',
            template: __webpack_require__(/*! raw-loader!./login.component.html */ "./node_modules/raw-loader/index.js!./src/app/auth/login/login.component.html"),
            styles: [__webpack_require__(/*! ./login.component.scss */ "./src/app/auth/login/login.component.scss")]
        })
    ], LoginComponent);
    return LoginComponent;
}());



/***/ }),

/***/ "./src/app/shared/services/navigation.service.ts":
/*!*******************************************************!*\
  !*** ./src/app/shared/services/navigation.service.ts ***!
  \*******************************************************/
/*! exports provided: NavigationService */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "NavigationService", function() { return NavigationService; });
/* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! tslib */ "./node_modules/tslib/tslib.es6.js");
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");
/* harmony import */ var _angular_router__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @angular/router */ "./node_modules/@angular/router/fesm5/router.js");



var NavigationService = /** @class */ (function () {
    function NavigationService(router) {
        this.router = router;
    }
    NavigationService.prototype.toEmployees = function () {
        this.router.navigate(['']).then();
    };
    NavigationService.ctorParameters = function () { return [
        { type: _angular_router__WEBPACK_IMPORTED_MODULE_2__["Router"] }
    ]; };
    NavigationService = tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_1__["Injectable"])({
            providedIn: 'root'
        })
    ], NavigationService);
    return NavigationService;
}());



/***/ })

}]);
//# sourceMappingURL=auth-auth-module-es5.js.map