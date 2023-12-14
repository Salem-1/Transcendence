! function(window, document, undefined) {
    "use strict";

    function minErr(module, ErrorConstructor) {
        return ErrorConstructor = ErrorConstructor || Error,
            function() {
                var paramPrefix, i, SKIP_INDEXES = 2,
                    templateArgs = arguments,
                    code = templateArgs[0],
                    message = "[" + (module ? module + ":" : "") + code + "] ",
                    template = templateArgs[1];
                for (message += template.replace(/\{\d+\}/g, function(match) {
                        var index = +match.slice(1, -1),
                            shiftedIndex = index + SKIP_INDEXES;
                        return shiftedIndex < templateArgs.length ? toDebugString(templateArgs[shiftedIndex]) : match
                    }), message += "\nhttp://errors.angularjs.org/1.4.0-beta.6/" + (module ? module + "/" : "") + code, i = SKIP_INDEXES, paramPrefix = "?"; i < templateArgs.length; i++, paramPrefix = "&") message += paramPrefix + "p" + (i - SKIP_INDEXES) + "=" + encodeURIComponent(toDebugString(templateArgs[i]));
                return new ErrorConstructor(message)
            }
    }

    function isArrayLike(obj) {
        if (null == obj || isWindow(obj)) return !1;
        var length = obj.length;
        return !(obj.nodeType !== NODE_TYPE_ELEMENT || !length) || (isString(obj) || isArray(obj) || 0 === length || "number" == typeof length && length > 0 && length - 1 in obj)
    }

    function forEach(obj, iterator, context) {
        var key, length;
        if (obj)
            if (isFunction(obj))
                for (key in obj) "prototype" == key || "length" == key || "name" == key || obj.hasOwnProperty && !obj.hasOwnProperty(key) || iterator.call(context, obj[key], key, obj);
            else if (isArray(obj) || isArrayLike(obj)) {
            var isPrimitive = "object" != typeof obj;
            for (key = 0, length = obj.length; key < length; key++)(isPrimitive || key in obj) && iterator.call(context, obj[key], key, obj)
        } else if (obj.forEach && obj.forEach !== forEach) obj.forEach(iterator, context, obj);
        else
            for (key in obj) obj.hasOwnProperty(key) && iterator.call(context, obj[key], key, obj);
        return obj
    }

    function forEachSorted(obj, iterator, context) {
        for (var keys = Object.keys(obj).sort(), i = 0; i < keys.length; i++) iterator.call(context, obj[keys[i]], keys[i]);
        return keys
    }

    function reverseParams(iteratorFn) {
        return function(value, key) {
            iteratorFn(key, value)
        }
    }

    function nextUid() {
        return ++uid
    }

    function setHashKey(obj, h) {
        h ? obj.$$hashKey = h : delete obj.$$hashKey
    }

    function baseExtend(dst, objs, deep) {
        for (var h = dst.$$hashKey, i = 0, ii = objs.length; i < ii; ++i) {
            var obj = objs[i];
            if (isObject(obj) || isFunction(obj))
                for (var keys = Object.keys(obj), j = 0, jj = keys.length; j < jj; j++) {
                    var key = keys[j],
                        src = obj[key];
                    deep && isObject(src) ? (isObject(dst[key]) || (dst[key] = isArray(src) ? [] : {}), baseExtend(dst[key], [src], !0)) : dst[key] = src
                }
        }
        return setHashKey(dst, h), dst
    }

    function extend(dst) {
        return baseExtend(dst, slice.call(arguments, 1), !1)
    }

    function merge(dst) {
        return baseExtend(dst, slice.call(arguments, 1), !0)
    }

    function toInt(str) {
        return parseInt(str, 10)
    }

    function inherit(parent, extra) {
        return extend(Object.create(parent), extra)
    }

    function noop() {}

    function identity($) {
        return $
    }

    function valueFn(value) {
        return function() {
            return value
        }
    }

    function isUndefined(value) {
        return "undefined" == typeof value
    }

    function isDefined(value) {
        return "undefined" != typeof value
    }

    function isObject(value) {
        return null !== value && "object" == typeof value
    }

    function isString(value) {
        return "string" == typeof value
    }

    function isNumber(value) {
        return "number" == typeof value
    }

    function isDate(value) {
        return "[object Date]" === toString.call(value)
    }

    function isFunction(value) {
        return "function" == typeof value
    }

    function isRegExp(value) {
        return "[object RegExp]" === toString.call(value)
    }

    function isWindow(obj) {
        return obj && obj.window === obj
    }

    function isScope(obj) {
        return obj && obj.$evalAsync && obj.$watch
    }

    function isFile(obj) {
        return "[object File]" === toString.call(obj)
    }

    function isFormData(obj) {
        return "[object FormData]" === toString.call(obj)
    }

    function isBlob(obj) {
        return "[object Blob]" === toString.call(obj)
    }

    function isBoolean(value) {
        return "boolean" == typeof value
    }

    function isPromiseLike(obj) {
        return obj && isFunction(obj.then)
    }

    function isTypedArray(value) {
        return TYPED_ARRAY_REGEXP.test(toString.call(value))
    }

    function isElement(node) {
        return !(!node || !(node.nodeName || node.prop && node.attr && node.find))
    }

    function makeMap(str) {
        var i, obj = {},
            items = str.split(",");
        for (i = 0; i < items.length; i++) obj[items[i]] = !0;
        return obj
    }

    function nodeName_(element) {
        return lowercase(element.nodeName || element[0] && element[0].nodeName)
    }

    function arrayRemove(array, value) {
        var index = array.indexOf(value);
        return index >= 0 && array.splice(index, 1), index
    }

    function copy(source, destination, stackSource, stackDest) {
        if (isWindow(source) || isScope(source)) throw ngMinErr("cpws", "Can't copy! Making copies of Window or Scope instances is not supported.");
        if (isTypedArray(destination)) throw ngMinErr("cpta", "Can't copy! TypedArray destination cannot be mutated.");
        if (destination) {
            if (source === destination) throw ngMinErr("cpi", "Can't copy! Source and destination are identical.");
            if (stackSource = stackSource || [], stackDest = stackDest || [], isObject(source)) {
                var index = stackSource.indexOf(source);
                if (index !== -1) return stackDest[index];
                stackSource.push(source), stackDest.push(destination)
            }
            var result;
            if (isArray(source)) {
                destination.length = 0;
                for (var i = 0; i < source.length; i++) result = copy(source[i], null, stackSource, stackDest), isObject(source[i]) && (stackSource.push(source[i]), stackDest.push(result)), destination.push(result)
            } else {
                var h = destination.$$hashKey;
                isArray(destination) ? destination.length = 0 : forEach(destination, function(value, key) {
                    delete destination[key]
                });
                for (var key in source) source.hasOwnProperty(key) && (result = copy(source[key], null, stackSource, stackDest), isObject(source[key]) && (stackSource.push(source[key]), stackDest.push(result)), destination[key] = result);
                setHashKey(destination, h)
            }
        } else if (destination = source, source)
            if (isArray(source)) destination = copy(source, [], stackSource, stackDest);
            else if (isTypedArray(source)) destination = new source.constructor(source);
        else if (isDate(source)) destination = new Date(source.getTime());
        else if (isRegExp(source)) destination = new RegExp(source.source, source.toString().match(/[^\/]*$/)[0]), destination.lastIndex = source.lastIndex;
        else if (isObject(source)) {
            var emptyObject = Object.create(Object.getPrototypeOf(source));
            destination = copy(source, emptyObject, stackSource, stackDest)
        }
        return destination
    }

    function shallowCopy(src, dst) {
        if (isArray(src)) {
            dst = dst || [];
            for (var i = 0, ii = src.length; i < ii; i++) dst[i] = src[i]
        } else if (isObject(src)) {
            dst = dst || {};
            for (var key in src) "$" === key.charAt(0) && "$" === key.charAt(1) || (dst[key] = src[key])
        }
        return dst || src
    }

    function equals(o1, o2) {
        if (o1 === o2) return !0;
        if (null === o1 || null === o2) return !1;
        if (o1 !== o1 && o2 !== o2) return !0;
        var length, key, keySet, t1 = typeof o1,
            t2 = typeof o2;
        if (t1 == t2 && "object" == t1) {
            if (!isArray(o1)) {
                if (isDate(o1)) return !!isDate(o2) && equals(o1.getTime(), o2.getTime());
                if (isRegExp(o1)) return !!isRegExp(o2) && o1.toString() == o2.toString();
                if (isScope(o1) || isScope(o2) || isWindow(o1) || isWindow(o2) || isArray(o2) || isDate(o2) || isRegExp(o2)) return !1;
                keySet = {};
                for (key in o1)
                    if ("$" !== key.charAt(0) && !isFunction(o1[key])) {
                        if (!equals(o1[key], o2[key])) return !1;
                        keySet[key] = !0
                    }
                for (key in o2)
                    if (!keySet.hasOwnProperty(key) && "$" !== key.charAt(0) && o2[key] !== undefined && !isFunction(o2[key])) return !1;
                return !0
            }
            if (!isArray(o2)) return !1;
            if ((length = o1.length) == o2.length) {
                for (key = 0; key < length; key++)
                    if (!equals(o1[key], o2[key])) return !1;
                return !0
            }
        }
        return !1
    }

    function concat(array1, array2, index) {
        return array1.concat(slice.call(array2, index))
    }

    function sliceArgs(args, startIndex) {
        return slice.call(args, startIndex || 0)
    }

    function bind(self, fn) {
        var curryArgs = arguments.length > 2 ? sliceArgs(arguments, 2) : [];
        return !isFunction(fn) || fn instanceof RegExp ? fn : curryArgs.length ? function() {
            return arguments.length ? fn.apply(self, concat(curryArgs, arguments, 0)) : fn.apply(self, curryArgs)
        } : function() {
            return arguments.length ? fn.apply(self, arguments) : fn.call(self)
        }
    }

    function toJsonReplacer(key, value) {
        var val = value;
        return "string" == typeof key && "$" === key.charAt(0) && "$" === key.charAt(1) ? val = undefined : isWindow(value) ? val = "$WINDOW" : value && document === value ? val = "$DOCUMENT" : isScope(value) && (val = "$SCOPE"), val
    }

    function toJson(obj, pretty) {
        return "undefined" == typeof obj ? undefined : (isNumber(pretty) || (pretty = pretty ? 2 : null), JSON.stringify(obj, toJsonReplacer, pretty))
    }

    function fromJson(json) {
        return isString(json) ? JSON.parse(json) : json
    }

    function timezoneToOffset(timezone, fallback) {
        var requestedTimezoneOffset = Date.parse("Jan 01, 1970 00:00:00 " + timezone) / 6e4;
        return isNaN(requestedTimezoneOffset) ? fallback : requestedTimezoneOffset
    }

    function addDateMinutes(date, minutes) {
        return date = new Date(date.getTime()), date.setMinutes(date.getMinutes() + minutes), date
    }

    function convertTimezoneToLocal(date, timezone, reverse) {
        reverse = reverse ? -1 : 1;
        var timezoneOffset = timezoneToOffset(timezone, date.getTimezoneOffset());
        return addDateMinutes(date, reverse * (timezoneOffset - date.getTimezoneOffset()))
    }

    function startingTag(element) {
        element = jqLite(element).clone();
        try {
            element.empty()
        } catch (e) {}
        var elemHtml = jqLite("<div>").append(element).html();
        try {
            return element[0].nodeType === NODE_TYPE_TEXT ? lowercase(elemHtml) : elemHtml.match(/^(<[^>]+>)/)[1].replace(/^<([\w\-]+)/, function(match, nodeName) {
                return "<" + lowercase(nodeName)
            })
        } catch (e) {
            return lowercase(elemHtml)
        }
    }

    function tryDecodeURIComponent(value) {
        try {
            return decodeURIComponent(value)
        } catch (e) {}
    }

    function parseKeyValue(keyValue) {
        var key_value, key, obj = {};
        return forEach((keyValue || "").split("&"), function(keyValue) {
            if (keyValue && (key_value = keyValue.replace(/\+/g, "%20").split("="), key = tryDecodeURIComponent(key_value[0]), isDefined(key))) {
                var val = !isDefined(key_value[1]) || tryDecodeURIComponent(key_value[1]);
                hasOwnProperty.call(obj, key) ? isArray(obj[key]) ? obj[key].push(val) : obj[key] = [obj[key], val] : obj[key] = val
            }
        }), obj
    }

    function toKeyValue(obj) {
        var parts = [];
        return forEach(obj, function(value, key) {
            isArray(value) ? forEach(value, function(arrayValue) {
                parts.push(encodeUriQuery(key, !0) + (arrayValue === !0 ? "" : "=" + encodeUriQuery(arrayValue, !0)))
            }) : parts.push(encodeUriQuery(key, !0) + (value === !0 ? "" : "=" + encodeUriQuery(value, !0)))
        }), parts.length ? parts.join("&") : ""
    }

    function encodeUriSegment(val) {
        return encodeUriQuery(val, !0).replace(/%26/gi, "&").replace(/%3D/gi, "=").replace(/%2B/gi, "+")
    }

    function encodeUriQuery(val, pctEncodeSpaces) {
        return encodeURIComponent(val).replace(/%40/gi, "@").replace(/%3A/gi, ":").replace(/%24/g, "$").replace(/%2C/gi, ",").replace(/%3B/gi, ";").replace(/%20/g, pctEncodeSpaces ? "%20" : "+")
    }

    function getNgAttribute(element, ngAttr) {
        var attr, i, ii = ngAttrPrefixes.length;
        for (i = 0; i < ii; ++i)
            if (attr = ngAttrPrefixes[i] + ngAttr, isString(attr = element.getAttribute(attr))) return attr;
        return null
    }

    function angularInit(element, bootstrap) {
        var appElement, module, config = {};
        forEach(ngAttrPrefixes, function(prefix) {
            var name = prefix + "app";
            !appElement && element.hasAttribute && element.hasAttribute(name) && (appElement = element, module = element.getAttribute(name))
        }), forEach(ngAttrPrefixes, function(prefix) {
            var candidate, name = prefix + "app";
            !appElement && (candidate = element.querySelector("[" + name.replace(":", "\\:") + "]")) && (appElement = candidate, module = candidate.getAttribute(name))
        }), appElement && (config.strictDi = null !== getNgAttribute(appElement, "strict-di"), bootstrap(appElement, module ? [module] : [], config))
    }

    function bootstrap(element, modules, config) {
        isObject(config) || (config = {});
        var defaultConfig = {
            strictDi: !1
        };
        config = extend(defaultConfig, config);
        var doBootstrap = function() {
                if (element = jqLite(element), element.injector()) {
                    var tag = element[0] === document ? "document" : startingTag(element);
                    throw ngMinErr("btstrpd", "App Already Bootstrapped with this Element '{0}'", tag.replace(/</, "&lt;").replace(/>/, "&gt;"))
                }
                modules = modules || [], modules.unshift(["$provide", function($provide) {
                    $provide.value("$rootElement", element)
                }]), config.debugInfoEnabled && modules.push(["$compileProvider", function($compileProvider) {
                    $compileProvider.debugInfoEnabled(!0)
                }]), modules.unshift("ng");
                var injector = createInjector(modules, config.strictDi);
                return injector.invoke(["$rootScope", "$rootElement", "$compile", "$injector", function(scope, element, compile, injector) {
                    scope.$apply(function() {
                        element.data("$injector", injector), compile(element)(scope)
                    })
                }]), injector
            },
            NG_ENABLE_DEBUG_INFO = /^NG_ENABLE_DEBUG_INFO!/,
            NG_DEFER_BOOTSTRAP = /^NG_DEFER_BOOTSTRAP!/;
        return window && NG_ENABLE_DEBUG_INFO.test(window.name) && (config.debugInfoEnabled = !0, window.name = window.name.replace(NG_ENABLE_DEBUG_INFO, "")), window && !NG_DEFER_BOOTSTRAP.test(window.name) ? doBootstrap() : (window.name = window.name.replace(NG_DEFER_BOOTSTRAP, ""), angular.resumeBootstrap = function(extraModules) {
            return forEach(extraModules, function(module) {
                modules.push(module)
            }), doBootstrap()
        }, void(isFunction(angular.resumeDeferredBootstrap) && angular.resumeDeferredBootstrap()))
    }

    function reloadWithDebugInfo() {
        window.name = "NG_ENABLE_DEBUG_INFO!" + window.name, window.location.reload()
    }

    function getTestability(rootElement) {
        var injector = angular.element(rootElement).injector();
        if (!injector) throw ngMinErr("test", "no injector found for element argument to getTestability");
        return injector.get("$$testability")
    }

    function snake_case(name, separator) {
        return separator = separator || "_", name.replace(SNAKE_CASE_REGEXP, function(letter, pos) {
            return (pos ? separator : "") + letter.toLowerCase()
        })
    }

    function bindJQuery() {
        var originalCleanData;
        if (!bindJQueryFired) {
            var jqName = jq();
            jQuery = window.jQuery, isDefined(jqName) && (jQuery = null === jqName ? undefined : window[jqName]), jQuery && jQuery.fn.on ? (jqLite = jQuery, extend(jQuery.fn, {
                scope: JQLitePrototype.scope,
                isolateScope: JQLitePrototype.isolateScope,
                controller: JQLitePrototype.controller,
                injector: JQLitePrototype.injector,
                inheritedData: JQLitePrototype.inheritedData
            }), originalCleanData = jQuery.cleanData, jQuery.cleanData = function(elems) {
                var events;
                if (skipDestroyOnNextJQueryCleanData) skipDestroyOnNextJQueryCleanData = !1;
                else
                    for (var elem, i = 0; null != (elem = elems[i]); i++) events = jQuery._data(elem, "events"), events && events.$destroy && jQuery(elem).triggerHandler("$destroy");
                originalCleanData(elems)
            }) : jqLite = JQLite, angular.element = jqLite, bindJQueryFired = !0
        }
    }

    function assertArg(arg, name, reason) {
        if (!arg) throw ngMinErr("areq", "Argument '{0}' is {1}", name || "?", reason || "required");
        return arg
    }

    function assertArgFn(arg, name, acceptArrayAnnotation) {
        return acceptArrayAnnotation && isArray(arg) && (arg = arg[arg.length - 1]), assertArg(isFunction(arg), name, "not a function, got " + (arg && "object" == typeof arg ? arg.constructor.name || "Object" : typeof arg)), arg
    }

    function assertNotHasOwnProperty(name, context) {
        if ("hasOwnProperty" === name) throw ngMinErr("badname", "hasOwnProperty is not a valid {0} name", context)
    }

    function getter(obj, path, bindFnToScope) {
        if (!path) return obj;
        for (var key, keys = path.split("."), lastInstance = obj, len = keys.length, i = 0; i < len; i++) key = keys[i], obj && (obj = (lastInstance = obj)[key]);
        return !bindFnToScope && isFunction(obj) ? bind(lastInstance, obj) : obj
    }

    function getBlockNodes(nodes) {
        var node = nodes[0],
            endNode = nodes[nodes.length - 1],
            blockNodes = [node];
        do {
            if (node = node.nextSibling, !node) break;
            blockNodes.push(node)
        } while (node !== endNode);
        return jqLite(blockNodes)
    }

    function createMap() {
        return Object.create(null)
    }

    function setupModuleLoader(window) {
        function ensure(obj, name, factory) {
            return obj[name] || (obj[name] = factory())
        }
        var $injectorMinErr = minErr("$injector"),
            ngMinErr = minErr("ng"),
            angular = ensure(window, "angular", Object);
        return angular.$$minErr = angular.$$minErr || minErr, ensure(angular, "module", function() {
            var modules = {};
            return function(name, requires, configFn) {
                var assertNotHasOwnProperty = function(name, context) {
                    if ("hasOwnProperty" === name) throw ngMinErr("badname", "hasOwnProperty is not a valid {0} name", context)
                };
                return assertNotHasOwnProperty(name, "module"), requires && modules.hasOwnProperty(name) && (modules[name] = null), ensure(modules, name, function() {
                    function invokeLater(provider, method, insertMethod, queue) {
                        return queue || (queue = invokeQueue),
                            function() {
                                return queue[insertMethod || "push"]([provider, method, arguments]), moduleInstance
                            }
                    }
                    if (!requires) throw $injectorMinErr("nomod", "Module '{0}' is not available! You either misspelled the module name or forgot to load it. If registering a module ensure that you specify the dependencies as the second argument.", name);
                    var invokeQueue = [],
                        configBlocks = [],
                        runBlocks = [],
                        config = invokeLater("$injector", "invoke", "push", configBlocks),
                        moduleInstance = {
                            _invokeQueue: invokeQueue,
                            _configBlocks: configBlocks,
                            _runBlocks: runBlocks,
                            requires: requires,
                            name: name,
                            provider: invokeLater("$provide", "provider"),
                            factory: invokeLater("$provide", "factory"),
                            service: invokeLater("$provide", "service"),
                            value: invokeLater("$provide", "value"),
                            constant: invokeLater("$provide", "constant", "unshift"),
                            animation: invokeLater("$animateProvider", "register"),
                            filter: invokeLater("$filterProvider", "register"),
                            controller: invokeLater("$controllerProvider", "register"),
                            directive: invokeLater("$compileProvider", "directive"),
                            config: config,
                            run: function(block) {
                                return runBlocks.push(block), this
                            }
                        };
                    return configFn && config(configFn), moduleInstance
                })
            }
        })
    }

    function serializeObject(obj) {
        var seen = [];
        return JSON.stringify(obj, function(key, val) {
            if (val = toJsonReplacer(key, val), isObject(val)) {
                if (seen.indexOf(val) >= 0) return "<<already seen>>";
                seen.push(val)
            }
            return val
        })
    }

    function toDebugString(obj) {
        return "function" == typeof obj ? obj.toString().replace(/ \{[\s\S]*$/, "") : "undefined" == typeof obj ? "undefined" : "string" != typeof obj ? serializeObject(obj) : obj
    }

    function publishExternalAPI(angular) {
        extend(angular, {
            bootstrap: bootstrap,
            copy: copy,
            extend: extend,
            merge: merge,
            equals: equals,
            element: jqLite,
            forEach: forEach,
            injector: createInjector,
            noop: noop,
            bind: bind,
            toJson: toJson,
            fromJson: fromJson,
            identity: identity,
            isUndefined: isUndefined,
            isDefined: isDefined,
            isString: isString,
            isFunction: isFunction,
            isObject: isObject,
            isNumber: isNumber,
            isElement: isElement,
            isArray: isArray,
            version: version,
            isDate: isDate,
            lowercase: lowercase,
            uppercase: uppercase,
            callbacks: {
                counter: 0
            },
            getTestability: getTestability,
            $$minErr: minErr,
            $$csp: csp,
            reloadWithDebugInfo: reloadWithDebugInfo
        }), angularModule = setupModuleLoader(window);
        try {
            angularModule("ngLocale")
        } catch (e) {
            angularModule("ngLocale", []).provider("$locale", $LocaleProvider)
        }
        angularModule("ng", ["ngLocale"], ["$provide", function($provide) {
            $provide.provider({
                $$sanitizeUri: $$SanitizeUriProvider
            }), $provide.provider("$compile", $CompileProvider).directive({
                a: htmlAnchorDirective,
                input: inputDirective,
                textarea: inputDirective,
                form: formDirective,
                script: scriptDirective,
                select: selectDirective,
                style: styleDirective,
                option: optionDirective,
                ngBind: ngBindDirective,
                ngBindHtml: ngBindHtmlDirective,
                ngBindTemplate: ngBindTemplateDirective,
                ngClass: ngClassDirective,
                ngClassEven: ngClassEvenDirective,
                ngClassOdd: ngClassOddDirective,
                ngCloak: ngCloakDirective,
                ngController: ngControllerDirective,
                ngForm: ngFormDirective,
                ngHide: ngHideDirective,
                ngIf: ngIfDirective,
                ngInclude: ngIncludeDirective,
                ngInit: ngInitDirective,
                ngNonBindable: ngNonBindableDirective,
                ngPluralize: ngPluralizeDirective,
                ngRepeat: ngRepeatDirective,
                ngShow: ngShowDirective,
                ngStyle: ngStyleDirective,
                ngSwitch: ngSwitchDirective,
                ngSwitchWhen: ngSwitchWhenDirective,
                ngSwitchDefault: ngSwitchDefaultDirective,
                ngOptions: ngOptionsDirective,
                ngTransclude: ngTranscludeDirective,
                ngModel: ngModelDirective,
                ngList: ngListDirective,
                ngChange: ngChangeDirective,
                pattern: patternDirective,
                ngPattern: patternDirective,
                required: requiredDirective,
                ngRequired: requiredDirective,
                minlength: minlengthDirective,
                ngMinlength: minlengthDirective,
                maxlength: maxlengthDirective,
                ngMaxlength: maxlengthDirective,
                ngValue: ngValueDirective,
                ngModelOptions: ngModelOptionsDirective
            }).directive({
                ngInclude: ngIncludeFillContentDirective
            }).directive(ngAttributeAliasDirectives).directive(ngEventDirectives), $provide.provider({
                $anchorScroll: $AnchorScrollProvider,
                $animate: $AnimateProvider,
                $browser: $BrowserProvider,
                $cacheFactory: $CacheFactoryProvider,
                $controller: $ControllerProvider,
                $document: $DocumentProvider,
                $exceptionHandler: $ExceptionHandlerProvider,
                $filter: $FilterProvider,
                $interpolate: $InterpolateProvider,
                $interval: $IntervalProvider,
                $http: $HttpProvider,
                $httpBackend: $HttpBackendProvider,
                $location: $LocationProvider,
                $log: $LogProvider,
                $parse: $ParseProvider,
                $rootScope: $RootScopeProvider,
                $q: $QProvider,
                $$q: $$QProvider,
                $sce: $SceProvider,
                $sceDelegate: $SceDelegateProvider,
                $sniffer: $SnifferProvider,
                $templateCache: $TemplateCacheProvider,
                $templateRequest: $TemplateRequestProvider,
                $$testability: $$TestabilityProvider,
                $timeout: $TimeoutProvider,
                $window: $WindowProvider,
                $$rAF: $$RAFProvider,
                $$asyncCallback: $$AsyncCallbackProvider,
                $$jqLite: $$jqLiteProvider,
                $$HashMap: $$HashMapProvider,
                $$cookieReader: $$CookieReaderProvider
            })
        }])
    }

    function jqNextId() {
        return ++jqId
    }

    function camelCase(name) {
        return name.replace(SPECIAL_CHARS_REGEXP, function(_, separator, letter, offset) {
            return offset ? letter.toUpperCase() : letter
        }).replace(MOZ_HACK_REGEXP, "Moz$1")
    }

    function jqLiteIsTextNode(html) {
        return !HTML_REGEXP.test(html)
    }

    function jqLiteAcceptsData(node) {
        var nodeType = node.nodeType;
        return nodeType === NODE_TYPE_ELEMENT || !nodeType || nodeType === NODE_TYPE_DOCUMENT
    }

    function jqLiteBuildFragment(html, context) {
        var tmp, tag, wrap, i, fragment = context.createDocumentFragment(),
            nodes = [];
        if (jqLiteIsTextNode(html)) nodes.push(context.createTextNode(html));
        else {
            for (tmp = tmp || fragment.appendChild(context.createElement("div")), tag = (TAG_NAME_REGEXP.exec(html) || ["", ""])[1].toLowerCase(), wrap = wrapMap[tag] || wrapMap._default, tmp.innerHTML = wrap[1] + html.replace(XHTML_TAG_REGEXP, "<$1></$2>") + wrap[2], i = wrap[0]; i--;) tmp = tmp.lastChild;
            nodes = concat(nodes, tmp.childNodes), tmp = fragment.firstChild, tmp.textContent = ""
        }
        return fragment.textContent = "", fragment.innerHTML = "", forEach(nodes, function(node) {
            fragment.appendChild(node)
        }), fragment
    }

    function jqLiteParseHTML(html, context) {
        context = context || document;
        var parsed;
        return (parsed = SINGLE_TAG_REGEXP.exec(html)) ? [context.createElement(parsed[1])] : (parsed = jqLiteBuildFragment(html, context)) ? parsed.childNodes : []
    }

    function JQLite(element) {
        if (element instanceof JQLite) return element;
        var argIsString;
        if (isString(element) && (element = trim(element), argIsString = !0), !(this instanceof JQLite)) {
            if (argIsString && "<" != element.charAt(0)) throw jqLiteMinErr("nosel", "Looking up elements via selectors is not supported by jqLite! See: http://docs.angularjs.org/api/angular.element");
            return new JQLite(element)
        }
        argIsString ? jqLiteAddNodes(this, jqLiteParseHTML(element)) : jqLiteAddNodes(this, element)
    }

    function jqLiteClone(element) {
        return element.cloneNode(!0)
    }

    function jqLiteDealoc(element, onlyDescendants) {
        if (onlyDescendants || jqLiteRemoveData(element), element.querySelectorAll)
            for (var descendants = element.querySelectorAll("*"), i = 0, l = descendants.length; i < l; i++) jqLiteRemoveData(descendants[i])
    }

    function jqLiteOff(element, type, fn, unsupported) {
        if (isDefined(unsupported)) throw jqLiteMinErr("offargs", "jqLite#off() does not support the `selector` argument");
        var expandoStore = jqLiteExpandoStore(element),
            events = expandoStore && expandoStore.events,
            handle = expandoStore && expandoStore.handle;
        if (handle)
            if (type) forEach(type.split(" "), function(type) {
                if (isDefined(fn)) {
                    var listenerFns = events[type];
                    if (arrayRemove(listenerFns || [], fn), listenerFns && listenerFns.length > 0) return
                }
                removeEventListenerFn(element, type, handle), delete events[type]
            });
            else
                for (type in events) "$destroy" !== type && removeEventListenerFn(element, type, handle), delete events[type]
    }

    function jqLiteRemoveData(element, name) {
        var expandoId = element.ng339,
            expandoStore = expandoId && jqCache[expandoId];
        if (expandoStore) {
            if (name) return void delete expandoStore.data[name];
            expandoStore.handle && (expandoStore.events.$destroy && expandoStore.handle({}, "$destroy"), jqLiteOff(element)), delete jqCache[expandoId], element.ng339 = undefined
        }
    }

    function jqLiteExpandoStore(element, createIfNecessary) {
        var expandoId = element.ng339,
            expandoStore = expandoId && jqCache[expandoId];
        return createIfNecessary && !expandoStore && (element.ng339 = expandoId = jqNextId(), expandoStore = jqCache[expandoId] = {
            events: {},
            data: {},
            handle: undefined
        }), expandoStore
    }

    function jqLiteData(element, key, value) {
        if (jqLiteAcceptsData(element)) {
            var isSimpleSetter = isDefined(value),
                isSimpleGetter = !isSimpleSetter && key && !isObject(key),
                massGetter = !key,
                expandoStore = jqLiteExpandoStore(element, !isSimpleGetter),
                data = expandoStore && expandoStore.data;
            if (isSimpleSetter) data[key] = value;
            else {
                if (massGetter) return data;
                if (isSimpleGetter) return data && data[key];
                extend(data, key)
            }
        }
    }

    function jqLiteHasClass(element, selector) {
        return !!element.getAttribute && (" " + (element.getAttribute("class") || "") + " ").replace(/[\n\t]/g, " ").indexOf(" " + selector + " ") > -1
    }

    function jqLiteRemoveClass(element, cssClasses) {
        cssClasses && element.setAttribute && forEach(cssClasses.split(" "), function(cssClass) {
            element.setAttribute("class", trim((" " + (element.getAttribute("class") || "") + " ").replace(/[\n\t]/g, " ").replace(" " + trim(cssClass) + " ", " ")))
        })
    }

    function jqLiteAddClass(element, cssClasses) {
        if (cssClasses && element.setAttribute) {
            var existingClasses = (" " + (element.getAttribute("class") || "") + " ").replace(/[\n\t]/g, " ");
            forEach(cssClasses.split(" "), function(cssClass) {
                cssClass = trim(cssClass), existingClasses.indexOf(" " + cssClass + " ") === -1 && (existingClasses += cssClass + " ")
            }), element.setAttribute("class", trim(existingClasses))
        }
    }

    function jqLiteAddNodes(root, elements) {
        if (elements)
            if (elements.nodeType) root[root.length++] = elements;
            else {
                var length = elements.length;
                if ("number" == typeof length && elements.window !== elements) {
                    if (length)
                        for (var i = 0; i < length; i++) root[root.length++] = elements[i]
                } else root[root.length++] = elements
            }
    }

    function jqLiteController(element, name) {
        return jqLiteInheritedData(element, "$" + (name || "ngController") + "Controller")
    }

    function jqLiteInheritedData(element, name, value) {
        element.nodeType == NODE_TYPE_DOCUMENT && (element = element.documentElement);
        for (var names = isArray(name) ? name : [name]; element;) {
            for (var i = 0, ii = names.length; i < ii; i++)
                if ((value = jqLite.data(element, names[i])) !== undefined) return value;
            element = element.parentNode || element.nodeType === NODE_TYPE_DOCUMENT_FRAGMENT && element.host
        }
    }

    function jqLiteEmpty(element) {
        for (jqLiteDealoc(element, !0); element.firstChild;) element.removeChild(element.firstChild)
    }

    function jqLiteRemove(element, keepData) {
        keepData || jqLiteDealoc(element);
        var parent = element.parentNode;
        parent && parent.removeChild(element)
    }

    function jqLiteDocumentLoaded(action, win) {
        win = win || window, "complete" === win.document.readyState ? win.setTimeout(action) : jqLite(win).on("load", action)
    }

    function getBooleanAttrName(element, name) {
        var booleanAttr = BOOLEAN_ATTR[name.toLowerCase()];
        return booleanAttr && BOOLEAN_ELEMENTS[nodeName_(element)] && booleanAttr
    }

    function getAliasedAttrName(element, name) {
        var nodeName = element.nodeName;
        return ("INPUT" === nodeName || "TEXTAREA" === nodeName) && ALIASED_ATTR[name]
    }

    function createEventHandler(element, events) {
        var eventHandler = function(event, type) {
            event.isDefaultPrevented = function() {
                return event.defaultPrevented
            };
            var eventFns = events[type || event.type],
                eventFnsLength = eventFns ? eventFns.length : 0;
            if (eventFnsLength) {
                if (isUndefined(event.immediatePropagationStopped)) {
                    var originalStopImmediatePropagation = event.stopImmediatePropagation;
                    event.stopImmediatePropagation = function() {
                        event.immediatePropagationStopped = !0, event.stopPropagation && event.stopPropagation(), originalStopImmediatePropagation && originalStopImmediatePropagation.call(event)
                    }
                }
                event.isImmediatePropagationStopped = function() {
                    return event.immediatePropagationStopped === !0
                }, eventFnsLength > 1 && (eventFns = shallowCopy(eventFns));
                for (var i = 0; i < eventFnsLength; i++) event.isImmediatePropagationStopped() || eventFns[i].call(element, event)
            }
        };
        return eventHandler.elem = element, eventHandler
    }

    function $$jqLiteProvider() {
        this.$get = function() {
            return extend(JQLite, {
                hasClass: function(node, classes) {
                    return node.attr && (node = node[0]), jqLiteHasClass(node, classes)
                },
                addClass: function(node, classes) {
                    return node.attr && (node = node[0]), jqLiteAddClass(node, classes)
                },
                removeClass: function(node, classes) {
                    return node.attr && (node = node[0]), jqLiteRemoveClass(node, classes)
                }
            })
        }
    }

    function hashKey(obj, nextUidFn) {
        var key = obj && obj.$$hashKey;
        if (key) return "function" == typeof key && (key = obj.$$hashKey()), key;
        var objType = typeof obj;
        return key = "function" == objType || "object" == objType && null !== obj ? obj.$$hashKey = objType + ":" + (nextUidFn || nextUid)() : objType + ":" + obj
    }

    function HashMap(array, isolatedUid) {
        if (isolatedUid) {
            var uid = 0;
            this.nextUid = function() {
                return ++uid
            }
        }
        forEach(array, this.put, this)
    }

    function anonFn(fn) {
        var fnText = fn.toString().replace(STRIP_COMMENTS, ""),
            args = fnText.match(FN_ARGS);
        return args ? "function(" + (args[1] || "").replace(/[\s\r\n]+/, " ") + ")" : "fn"
    }

    function annotate(fn, strictDi, name) {
        var $inject, fnText, argDecl, last;
        if ("function" == typeof fn) {
            if (!($inject = fn.$inject)) {
                if ($inject = [], fn.length) {
                    if (strictDi) throw isString(name) && name || (name = fn.name || anonFn(fn)), $injectorMinErr("strictdi", "{0} is not using explicit annotation and cannot be invoked in strict mode", name);
                    fnText = fn.toString().replace(STRIP_COMMENTS, ""), argDecl = fnText.match(FN_ARGS), forEach(argDecl[1].split(FN_ARG_SPLIT), function(arg) {
                        arg.replace(FN_ARG, function(all, underscore, name) {
                            $inject.push(name)
                        })
                    })
                }
                fn.$inject = $inject
            }
        } else isArray(fn) ? (last = fn.length - 1, assertArgFn(fn[last], "fn"), $inject = fn.slice(0, last)) : assertArgFn(fn, "fn", !0);
        return $inject
    }

    function createInjector(modulesToLoad, strictDi) {
        function supportObject(delegate) {
            return function(key, value) {
                return isObject(key) ? void forEach(key, reverseParams(delegate)) : delegate(key, value)
            }
        }

        function provider(name, provider_) {
            if (assertNotHasOwnProperty(name, "service"), (isFunction(provider_) || isArray(provider_)) && (provider_ = providerInjector.instantiate(provider_)), !provider_.$get) throw $injectorMinErr("pget", "Provider '{0}' must define $get factory method.", name);
            return providerCache[name + providerSuffix] = provider_
        }

        function enforceReturnValue(name, factory) {
            return function() {
                var result = instanceInjector.invoke(factory, this);
                if (isUndefined(result)) throw $injectorMinErr("undef", "Provider '{0}' must return a value from $get factory method.", name);
                return result
            }
        }

        function factory(name, factoryFn, enforce) {
            return provider(name, {
                $get: enforce !== !1 ? enforceReturnValue(name, factoryFn) : factoryFn
            })
        }

        function service(name, constructor) {
            return factory(name, ["$injector", function($injector) {
                return $injector.instantiate(constructor)
            }])
        }

        function value(name, val) {
            return factory(name, valueFn(val), !1)
        }

        function constant(name, value) {
            assertNotHasOwnProperty(name, "constant"), providerCache[name] = value, instanceCache[name] = value
        }

        function decorator(serviceName, decorFn) {
            var origProvider = providerInjector.get(serviceName + providerSuffix),
                orig$get = origProvider.$get;
            origProvider.$get = function() {
                var origInstance = instanceInjector.invoke(orig$get, origProvider);
                return instanceInjector.invoke(decorFn, null, {
                    $delegate: origInstance
                })
            }
        }

        function loadModules(modulesToLoad) {
            var moduleFn, runBlocks = [];
            return forEach(modulesToLoad, function(module) {
                function runInvokeQueue(queue) {
                    var i, ii;
                    for (i = 0, ii = queue.length; i < ii; i++) {
                        var invokeArgs = queue[i],
                            provider = providerInjector.get(invokeArgs[0]);
                        provider[invokeArgs[1]].apply(provider, invokeArgs[2])
                    }
                }
                if (!loadedModules.get(module)) {
                    loadedModules.put(module, !0);
                    try {
                        isString(module) ? (moduleFn = angularModule(module), runBlocks = runBlocks.concat(loadModules(moduleFn.requires)).concat(moduleFn._runBlocks), runInvokeQueue(moduleFn._invokeQueue), runInvokeQueue(moduleFn._configBlocks)) : isFunction(module) ? runBlocks.push(providerInjector.invoke(module)) : isArray(module) ? runBlocks.push(providerInjector.invoke(module)) : assertArgFn(module, "module")
                    } catch (e) {
                        throw isArray(module) && (module = module[module.length - 1]), e.message && e.stack && e.stack.indexOf(e.message) == -1 && (e = e.message + "\n" + e.stack), $injectorMinErr("modulerr", "Failed to instantiate module {0} due to:\n{1}", module, e.stack || e.message || e)
                    }
                }
            }), runBlocks
        }

        function createInternalInjector(cache, factory) {
            function getService(serviceName, caller) {
                if (cache.hasOwnProperty(serviceName)) {
                    if (cache[serviceName] === INSTANTIATING) throw $injectorMinErr("cdep", "Circular dependency found: {0}", serviceName + " <- " + path.join(" <- "));
                    return cache[serviceName]
                }
                try {
                    return path.unshift(serviceName), cache[serviceName] = INSTANTIATING, cache[serviceName] = factory(serviceName, caller)
                } catch (err) {
                    throw cache[serviceName] === INSTANTIATING && delete cache[serviceName], err
                } finally {
                    path.shift()
                }
            }

            function invoke(fn, self, locals, serviceName) {
                "string" == typeof locals && (serviceName = locals, locals = null);
                var length, i, key, args = [],
                    $inject = createInjector.$$annotate(fn, strictDi, serviceName);
                for (i = 0, length = $inject.length; i < length; i++) {
                    if (key = $inject[i], "string" != typeof key) throw $injectorMinErr("itkn", "Incorrect injection token! Expected service name as string, got {0}", key);
                    args.push(locals && locals.hasOwnProperty(key) ? locals[key] : getService(key, serviceName))
                }
                return isArray(fn) && (fn = fn[length]), fn.apply(self, args)
            }

            function instantiate(Type, locals, serviceName) {
                var instance = Object.create((isArray(Type) ? Type[Type.length - 1] : Type).prototype || null),
                    returnedValue = invoke(Type, instance, locals, serviceName);
                return isObject(returnedValue) || isFunction(returnedValue) ? returnedValue : instance
            }
            return {
                invoke: invoke,
                instantiate: instantiate,
                get: getService,
                annotate: createInjector.$$annotate,
                has: function(name) {
                    return providerCache.hasOwnProperty(name + providerSuffix) || cache.hasOwnProperty(name)
                }
            }
        }
        strictDi = strictDi === !0;
        var INSTANTIATING = {},
            providerSuffix = "Provider",
            path = [],
            loadedModules = new HashMap([], (!0)),
            providerCache = {
                $provide: {
                    provider: supportObject(provider),
                    factory: supportObject(factory),
                    service: supportObject(service),
                    value: supportObject(value),
                    constant: supportObject(constant),
                    decorator: decorator
                }
            },
            providerInjector = providerCache.$injector = createInternalInjector(providerCache, function(serviceName, caller) {
                throw angular.isString(caller) && path.push(caller), $injectorMinErr("unpr", "Unknown provider: {0}", path.join(" <- "))
            }),
            instanceCache = {},
            instanceInjector = instanceCache.$injector = createInternalInjector(instanceCache, function(serviceName, caller) {
                var provider = providerInjector.get(serviceName + providerSuffix, caller);
                return instanceInjector.invoke(provider.$get, provider, undefined, serviceName)
            });
        return forEach(loadModules(modulesToLoad), function(fn) {
            instanceInjector.invoke(fn || noop)
        }), instanceInjector
    }

    function $AnchorScrollProvider() {
        var autoScrollingEnabled = !0;
        this.disableAutoScrolling = function() {
            autoScrollingEnabled = !1
        }, this.$get = ["$window", "$location", "$rootScope", function($window, $location, $rootScope) {
            function getFirstAnchor(list) {
                var result = null;
                return Array.prototype.some.call(list, function(element) {
                    if ("a" === nodeName_(element)) return result = element, !0
                }), result
            }

            function getYOffset() {
                var offset = scroll.yOffset;
                if (isFunction(offset)) offset = offset();
                else if (isElement(offset)) {
                    var elem = offset[0],
                        style = $window.getComputedStyle(elem);
                    offset = "fixed" !== style.position ? 0 : elem.getBoundingClientRect().bottom
                } else isNumber(offset) || (offset = 0);
                return offset
            }

            function scrollTo(elem) {
                if (elem) {
                    elem.scrollIntoView();
                    var offset = getYOffset();
                    if (offset) {
                        var elemTop = elem.getBoundingClientRect().top;
                        $window.scrollBy(0, elemTop - offset)
                    }
                } else $window.scrollTo(0, 0)
            }

            function scroll() {
                var elm, hash = $location.hash();
                hash ? (elm = document.getElementById(hash)) ? scrollTo(elm) : (elm = getFirstAnchor(document.getElementsByName(hash))) ? scrollTo(elm) : "top" === hash && scrollTo(null) : scrollTo(null)
            }
            var document = $window.document;
            return autoScrollingEnabled && $rootScope.$watch(function() {
                return $location.hash()
            }, function(newVal, oldVal) {
                newVal === oldVal && "" === newVal || jqLiteDocumentLoaded(function() {
                    $rootScope.$evalAsync(scroll)
                })
            }), scroll
        }]
    }

    function $$AsyncCallbackProvider() {
        this.$get = ["$$rAF", "$timeout", function($$rAF, $timeout) {
            return $$rAF.supported ? function(fn) {
                return $$rAF(fn)
            } : function(fn) {
                return $timeout(fn, 0, !1)
            }
        }]
    }

    function Browser(window, document, $log, $sniffer) {
        function completeOutstandingRequest(fn) {
            try {
                fn.apply(null, sliceArgs(arguments, 1))
            } finally {
                if (outstandingRequestCount--, 0 === outstandingRequestCount)
                    for (; outstandingRequestCallbacks.length;) try {
                        outstandingRequestCallbacks.pop()()
                    } catch (e) {
                        $log.error(e)
                    }
            }
        }

        function getHash(url) {
            var index = url.indexOf("#");
            return index === -1 ? "" : url.substr(index + 1)
        }

        function cacheStateAndFireUrlChange() {
            cacheState(), fireUrlChange()
        }

        function getCurrentState() {
            try {
                return history.state
            } catch (e) {}
        }

        function cacheState() {
            cachedState = getCurrentState(), cachedState = isUndefined(cachedState) ? null : cachedState, equals(cachedState, lastCachedState) && (cachedState = lastCachedState), lastCachedState = cachedState
        }

        function fireUrlChange() {
            lastBrowserUrl === self.url() && lastHistoryState === cachedState || (lastBrowserUrl = self.url(), lastHistoryState = cachedState, forEach(urlChangeListeners, function(listener) {
                listener(self.url(), cachedState)
            }))
        }
        var self = this,
            location = (document[0], window.location),
            history = window.history,
            setTimeout = window.setTimeout,
            clearTimeout = window.clearTimeout,
            pendingDeferIds = {};
        self.isMock = !1;
        var outstandingRequestCount = 0,
            outstandingRequestCallbacks = [];
        self.$$completeOutstandingRequest = completeOutstandingRequest, self.$$incOutstandingRequestCount = function() {
            outstandingRequestCount++
        }, self.notifyWhenNoOutstandingRequests = function(callback) {
            0 === outstandingRequestCount ? callback() : outstandingRequestCallbacks.push(callback)
        };
        var cachedState, lastHistoryState, lastBrowserUrl = location.href,
            baseElement = document.find("base"),
            reloadLocation = null;
        cacheState(), lastHistoryState = cachedState, self.url = function(url, replace, state) {
            if (isUndefined(state) && (state = null), location !== window.location && (location = window.location), history !== window.history && (history = window.history), url) {
                var sameState = lastHistoryState === state;
                if (lastBrowserUrl === url && (!$sniffer.history || sameState)) return self;
                var sameBase = lastBrowserUrl && stripHash(lastBrowserUrl) === stripHash(url);
                return lastBrowserUrl = url, lastHistoryState = state, !$sniffer.history || sameBase && sameState ? (sameBase || (reloadLocation = url), replace ? location.replace(url) : sameBase ? location.hash = getHash(url) : location.href = url) : (history[replace ? "replaceState" : "pushState"](state, "", url), cacheState(), lastHistoryState = cachedState), self
            }
            return reloadLocation || location.href.replace(/%27/g, "'")
        }, self.state = function() {
            return cachedState
        };
        var urlChangeListeners = [],
            urlChangeInit = !1,
            lastCachedState = null;
        self.onUrlChange = function(callback) {
            return urlChangeInit || ($sniffer.history && jqLite(window).on("popstate", cacheStateAndFireUrlChange), jqLite(window).on("hashchange", cacheStateAndFireUrlChange), urlChangeInit = !0), urlChangeListeners.push(callback), callback
        }, self.$$checkUrlChange = fireUrlChange, self.baseHref = function() {
            var href = baseElement.attr("href");
            return href ? href.replace(/^(https?\:)?\/\/[^\/]*/, "") : ""
        }, self.defer = function(fn, delay) {
            var timeoutId;
            return outstandingRequestCount++, timeoutId = setTimeout(function() {
                delete pendingDeferIds[timeoutId], completeOutstandingRequest(fn)
            }, delay || 0), pendingDeferIds[timeoutId] = !0, timeoutId
        }, self.defer.cancel = function(deferId) {
            return !!pendingDeferIds[deferId] && (delete pendingDeferIds[deferId], clearTimeout(deferId), completeOutstandingRequest(noop), !0)
        }
    }

    function $BrowserProvider() {
        this.$get = ["$window", "$log", "$sniffer", "$document", function($window, $log, $sniffer, $document) {
            return new Browser($window, $document, $log, $sniffer)
        }]
    }

    function $CacheFactoryProvider() {
        this.$get = function() {
            function cacheFactory(cacheId, options) {
                function refresh(entry) {
                    entry != freshEnd && (staleEnd ? staleEnd == entry && (staleEnd = entry.n) : staleEnd = entry, link(entry.n, entry.p), link(entry, freshEnd), freshEnd = entry, freshEnd.n = null)
                }

                function link(nextEntry, prevEntry) {
                    nextEntry != prevEntry && (nextEntry && (nextEntry.p = prevEntry), prevEntry && (prevEntry.n = nextEntry))
                }
                if (cacheId in caches) throw minErr("$cacheFactory")("iid", "CacheId '{0}' is already taken!", cacheId);
                var size = 0,
                    stats = extend({}, options, {
                        id: cacheId
                    }),
                    data = {},
                    capacity = options && options.capacity || Number.MAX_VALUE,
                    lruHash = {},
                    freshEnd = null,
                    staleEnd = null;
                return caches[cacheId] = {
                    put: function(key, value) {
                        if (!isUndefined(value)) {
                            if (capacity < Number.MAX_VALUE) {
                                var lruEntry = lruHash[key] || (lruHash[key] = {
                                    key: key
                                });
                                refresh(lruEntry)
                            }
                            return key in data || size++, data[key] = value, size > capacity && this.remove(staleEnd.key), value
                        }
                    },
                    get: function(key) {
                        if (capacity < Number.MAX_VALUE) {
                            var lruEntry = lruHash[key];
                            if (!lruEntry) return;
                            refresh(lruEntry)
                        }
                        return data[key]
                    },
                    remove: function(key) {
                        if (capacity < Number.MAX_VALUE) {
                            var lruEntry = lruHash[key];
                            if (!lruEntry) return;
                            lruEntry == freshEnd && (freshEnd = lruEntry.p), lruEntry == staleEnd && (staleEnd = lruEntry.n), link(lruEntry.n, lruEntry.p), delete lruHash[key]
                        }
                        delete data[key], size--
                    },
                    removeAll: function() {
                        data = {}, size = 0, lruHash = {}, freshEnd = staleEnd = null
                    },
                    destroy: function() {
                        data = null, stats = null, lruHash = null, delete caches[cacheId]
                    },
                    info: function() {
                        return extend({}, stats, {
                            size: size
                        })
                    }
                }
            }
            var caches = {};
            return cacheFactory.info = function() {
                var info = {};
                return forEach(caches, function(cache, cacheId) {
                    info[cacheId] = cache.info()
                }), info
            }, cacheFactory.get = function(cacheId) {
                return caches[cacheId]
            }, cacheFactory
        }
    }

    function $TemplateCacheProvider() {
        this.$get = ["$cacheFactory", function($cacheFactory) {
            return $cacheFactory("templates")
        }]
    }

    function $CompileProvider($provide, $$sanitizeUriProvider) {
        function parseIsolateBindings(scope, directiveName, isController) {
            var LOCAL_REGEXP = /^\s*([@&]|=(\*?))(\??)\s*(\w*)\s*$/,
                bindings = {};
            return forEach(scope, function(definition, scopeName) {
                var match = definition.match(LOCAL_REGEXP);
                if (!match) throw $compileMinErr("iscp", "Invalid {3} for directive '{0}'. Definition: {... {1}: '{2}' ...}", directiveName, scopeName, definition, isController ? "controller bindings definition" : "isolate scope definition");
                bindings[scopeName] = {
                    mode: match[1][0],
                    collection: "*" === match[2],
                    optional: "?" === match[3],
                    attrName: match[4] || scopeName
                }
            }), bindings
        }

        function parseDirectiveBindings(directive, directiveName) {
            var bindings = {
                isolateScope: null,
                bindToController: null
            };
            if (isObject(directive.scope) && (directive.bindToController === !0 ? (bindings.bindToController = parseIsolateBindings(directive.scope, directiveName, !0), bindings.isolateScope = {}) : bindings.isolateScope = parseIsolateBindings(directive.scope, directiveName, !1)), isObject(directive.bindToController) && (bindings.bindToController = parseIsolateBindings(directive.bindToController, directiveName, !0)), isObject(bindings.bindToController)) {
                var controller = directive.controller,
                    controllerAs = directive.controllerAs;
                if (!controller) throw $compileMinErr("noctrl", "Cannot bind to controller without directive '{0}'s controller.", directiveName);
                if (!identifierForController(controller, controllerAs)) throw $compileMinErr("noident", "Cannot bind to controller without identifier for directive '{0}'.", directiveName)
            }
            return bindings
        }
        var hasDirectives = {},
            Suffix = "Directive",
            COMMENT_DIRECTIVE_REGEXP = /^\s*directive\:\s*([\w\-]+)\s+(.*)$/,
            CLASS_DIRECTIVE_REGEXP = /(([\w\-]+)(?:\:([^;]+))?;?)/,
            ALL_OR_NOTHING_ATTRS = makeMap("ngSrc,ngSrcset,src,srcset"),
            REQUIRE_PREFIX_REGEXP = /^(?:(\^\^?)?(\?)?(\^\^?)?)?/,
            EVENT_HANDLER_ATTR_REGEXP = /^(on[a-z]+|formaction)$/;
        this.directive = function registerDirective(name, directiveFactory) {
            return assertNotHasOwnProperty(name, "directive"), isString(name) ? (assertArg(directiveFactory, "directiveFactory"), hasDirectives.hasOwnProperty(name) || (hasDirectives[name] = [], $provide.factory(name + Suffix, ["$injector", "$exceptionHandler", function($injector, $exceptionHandler) {
                var directives = [];
                return forEach(hasDirectives[name], function(directiveFactory, index) {
                    try {
                        var directive = $injector.invoke(directiveFactory);
                        isFunction(directive) ? directive = {
                            compile: valueFn(directive)
                        } : !directive.compile && directive.link && (directive.compile = valueFn(directive.link)), directive.priority = directive.priority || 0, directive.index = index, directive.name = directive.name || name, directive.require = directive.require || directive.controller && directive.name, directive.restrict = directive.restrict || "EA";
                        var bindings = directive.$$bindings = parseDirectiveBindings(directive, directive.name);
                        isObject(bindings.isolateScope) && (directive.$$isolateBindings = bindings.isolateScope), directives.push(directive)
                    } catch (e) {
                        $exceptionHandler(e)
                    }
                }), directives
            }])), hasDirectives[name].push(directiveFactory)) : forEach(name, reverseParams(registerDirective)), this
        }, this.aHrefSanitizationWhitelist = function(regexp) {
            return isDefined(regexp) ? ($$sanitizeUriProvider.aHrefSanitizationWhitelist(regexp), this) : $$sanitizeUriProvider.aHrefSanitizationWhitelist()
        }, this.imgSrcSanitizationWhitelist = function(regexp) {
            return isDefined(regexp) ? ($$sanitizeUriProvider.imgSrcSanitizationWhitelist(regexp), this) : $$sanitizeUriProvider.imgSrcSanitizationWhitelist()
        };
        var debugInfoEnabled = !0;
        this.debugInfoEnabled = function(enabled) {
            return isDefined(enabled) ? (debugInfoEnabled = enabled, this) : debugInfoEnabled
        }, this.$get = ["$injector", "$interpolate", "$exceptionHandler", "$templateRequest", "$parse", "$controller", "$rootScope", "$document", "$sce", "$animate", "$$sanitizeUri", function($injector, $interpolate, $exceptionHandler, $templateRequest, $parse, $controller, $rootScope, $document, $sce, $animate, $$sanitizeUri) {
            function safeAddClass($element, className) {
                try {
                    $element.addClass(className)
                } catch (e) {}
            }

            function compile($compileNodes, transcludeFn, maxPriority, ignoreDirective, previousCompileContext) {
                $compileNodes instanceof jqLite || ($compileNodes = jqLite($compileNodes)), forEach($compileNodes, function(node, index) {
                    node.nodeType == NODE_TYPE_TEXT && node.nodeValue.match(/\S+/) && ($compileNodes[index] = jqLite(node).wrap("<span></span>").parent()[0])
                });
                var compositeLinkFn = compileNodes($compileNodes, transcludeFn, $compileNodes, maxPriority, ignoreDirective, previousCompileContext);
                compile.$$addScopeClass($compileNodes);
                var namespace = null;
                return function(scope, cloneConnectFn, options) {
                    assertArg(scope, "scope"), options = options || {};
                    var parentBoundTranscludeFn = options.parentBoundTranscludeFn,
                        transcludeControllers = options.transcludeControllers,
                        futureParentElement = options.futureParentElement;
                    parentBoundTranscludeFn && parentBoundTranscludeFn.$$boundTransclude && (parentBoundTranscludeFn = parentBoundTranscludeFn.$$boundTransclude), namespace || (namespace = detectNamespaceForChildElements(futureParentElement));
                    var $linkNode;
                    if ($linkNode = "html" !== namespace ? jqLite(wrapTemplate(namespace, jqLite("<div>").append($compileNodes).html())) : cloneConnectFn ? JQLitePrototype.clone.call($compileNodes) : $compileNodes, transcludeControllers)
                        for (var controllerName in transcludeControllers) $linkNode.data("$" + controllerName + "Controller", transcludeControllers[controllerName].instance);
                    return compile.$$addScopeInfo($linkNode, scope), cloneConnectFn && cloneConnectFn($linkNode, scope), compositeLinkFn && compositeLinkFn(scope, $linkNode, $linkNode, parentBoundTranscludeFn), $linkNode
                }
            }

            function detectNamespaceForChildElements(parentElement) {
                var node = parentElement && parentElement[0];
                return node && "foreignobject" !== nodeName_(node) && node.toString().match(/SVG/) ? "svg" : "html"
            }

            function compileNodes(nodeList, transcludeFn, $rootElement, maxPriority, ignoreDirective, previousCompileContext) {
                function compositeLinkFn(scope, nodeList, $rootElement, parentBoundTranscludeFn) {
                    var nodeLinkFn, childLinkFn, node, childScope, i, ii, idx, childBoundTranscludeFn, stableNodeList;
                    if (nodeLinkFnFound) {
                        var nodeListLength = nodeList.length;
                        for (stableNodeList = new Array(nodeListLength), i = 0; i < linkFns.length; i += 3) idx = linkFns[i], stableNodeList[idx] = nodeList[idx]
                    } else stableNodeList = nodeList;
                    for (i = 0, ii = linkFns.length; i < ii;)
                        if (node = stableNodeList[linkFns[i++]], nodeLinkFn = linkFns[i++], childLinkFn = linkFns[i++], nodeLinkFn) {
                            if (nodeLinkFn.scope) {
                                childScope = scope.$new(), compile.$$addScopeInfo(jqLite(node), childScope);
                                var destroyBindings = nodeLinkFn.$$destroyBindings;
                                destroyBindings && (nodeLinkFn.$$destroyBindings = null, childScope.$on("$destroyed", destroyBindings))
                            } else childScope = scope;
                            childBoundTranscludeFn = nodeLinkFn.transcludeOnThisElement ? createBoundTranscludeFn(scope, nodeLinkFn.transclude, parentBoundTranscludeFn, nodeLinkFn.elementTranscludeOnThisElement) : !nodeLinkFn.templateOnThisElement && parentBoundTranscludeFn ? parentBoundTranscludeFn : !parentBoundTranscludeFn && transcludeFn ? createBoundTranscludeFn(scope, transcludeFn) : null, nodeLinkFn(childLinkFn, childScope, node, $rootElement, childBoundTranscludeFn, nodeLinkFn)
                        } else childLinkFn && childLinkFn(scope, node.childNodes, undefined, parentBoundTranscludeFn)
                }
                for (var attrs, directives, nodeLinkFn, childNodes, childLinkFn, linkFnFound, nodeLinkFnFound, linkFns = [], i = 0; i < nodeList.length; i++) attrs = new Attributes, directives = collectDirectives(nodeList[i], [], attrs, 0 === i ? maxPriority : undefined, ignoreDirective), nodeLinkFn = directives.length ? applyDirectivesToNode(directives, nodeList[i], attrs, transcludeFn, $rootElement, null, [], [], previousCompileContext) : null, nodeLinkFn && nodeLinkFn.scope && compile.$$addScopeClass(attrs.$$element), childLinkFn = nodeLinkFn && nodeLinkFn.terminal || !(childNodes = nodeList[i].childNodes) || !childNodes.length ? null : compileNodes(childNodes, nodeLinkFn ? (nodeLinkFn.transcludeOnThisElement || !nodeLinkFn.templateOnThisElement) && nodeLinkFn.transclude : transcludeFn), (nodeLinkFn || childLinkFn) && (linkFns.push(i, nodeLinkFn, childLinkFn), linkFnFound = !0, nodeLinkFnFound = nodeLinkFnFound || nodeLinkFn), previousCompileContext = null;
                return linkFnFound ? compositeLinkFn : null
            }

            function createBoundTranscludeFn(scope, transcludeFn, previousBoundTranscludeFn, elementTransclusion) {
                var boundTranscludeFn = function(transcludedScope, cloneFn, controllers, futureParentElement, containingScope) {
                    return transcludedScope || (transcludedScope = scope.$new(!1, containingScope), transcludedScope.$$transcluded = !0), transcludeFn(transcludedScope, cloneFn, {
                        parentBoundTranscludeFn: previousBoundTranscludeFn,
                        transcludeControllers: controllers,
                        futureParentElement: futureParentElement
                    })
                };
                return boundTranscludeFn
            }

            function collectDirectives(node, directives, attrs, maxPriority, ignoreDirective) {
                var match, className, nodeType = node.nodeType,
                    attrsMap = attrs.$attr;
                switch (nodeType) {
                    case NODE_TYPE_ELEMENT:
                        addDirective(directives, directiveNormalize(nodeName_(node)), "E", maxPriority, ignoreDirective);
                        for (var attr, name, nName, ngAttrName, value, isNgAttr, nAttrs = node.attributes, j = 0, jj = nAttrs && nAttrs.length; j < jj; j++) {
                            var attrStartName = !1,
                                attrEndName = !1;
                            attr = nAttrs[j], name = attr.name, value = trim(attr.value), ngAttrName = directiveNormalize(name), (isNgAttr = NG_ATTR_BINDING.test(ngAttrName)) && (name = name.replace(PREFIX_REGEXP, "").substr(8).replace(/_(.)/g, function(match, letter) {
                                return letter.toUpperCase()
                            }));
                            var directiveNName = ngAttrName.replace(/(Start|End)$/, "");
                            directiveIsMultiElement(directiveNName) && ngAttrName === directiveNName + "Start" && (attrStartName = name, attrEndName = name.substr(0, name.length - 5) + "end", name = name.substr(0, name.length - 6)), nName = directiveNormalize(name.toLowerCase()), attrsMap[nName] = name, !isNgAttr && attrs.hasOwnProperty(nName) || (attrs[nName] = value, getBooleanAttrName(node, nName) && (attrs[nName] = !0)), addAttrInterpolateDirective(node, directives, value, nName, isNgAttr), addDirective(directives, nName, "A", maxPriority, ignoreDirective, attrStartName, attrEndName)
                        }
                        if (className = node.className, isObject(className) && (className = className.animVal), isString(className) && "" !== className)
                            for (; match = CLASS_DIRECTIVE_REGEXP.exec(className);) nName = directiveNormalize(match[2]), addDirective(directives, nName, "C", maxPriority, ignoreDirective) && (attrs[nName] = trim(match[3])), className = className.substr(match.index + match[0].length);
                        break;
                    case NODE_TYPE_TEXT:
                        addTextInterpolateDirective(directives, node.nodeValue);
                        break;
                    case NODE_TYPE_COMMENT:
                        try {
                            match = COMMENT_DIRECTIVE_REGEXP.exec(node.nodeValue), match && (nName = directiveNormalize(match[1]), addDirective(directives, nName, "M", maxPriority, ignoreDirective) && (attrs[nName] = trim(match[2])))
                        } catch (e) {}
                }
                return directives.sort(byPriority), directives
            }

            function groupScan(node, attrStart, attrEnd) {
                var nodes = [],
                    depth = 0;
                if (attrStart && node.hasAttribute && node.hasAttribute(attrStart)) {
                    do {
                        if (!node) throw $compileMinErr("uterdir", "Unterminated attribute, found '{0}' but no matching '{1}' found.", attrStart, attrEnd);
                        node.nodeType == NODE_TYPE_ELEMENT && (node.hasAttribute(attrStart) && depth++, node.hasAttribute(attrEnd) && depth--), nodes.push(node), node = node.nextSibling
                    } while (depth > 0)
                } else nodes.push(node);
                return jqLite(nodes)
            }

            function groupElementsLinkFnWrapper(linkFn, attrStart, attrEnd) {
                return function(scope, element, attrs, controllers, transcludeFn) {
                    return element = groupScan(element[0], attrStart, attrEnd), linkFn(scope, element, attrs, controllers, transcludeFn)
                }
            }

            function applyDirectivesToNode(directives, compileNode, templateAttrs, transcludeFn, jqCollection, originalReplaceDirective, preLinkFns, postLinkFns, previousCompileContext) {
                function addLinkFns(pre, post, attrStart, attrEnd) {
                    pre && (attrStart && (pre = groupElementsLinkFnWrapper(pre, attrStart, attrEnd)), pre.require = directive.require, pre.directiveName = directiveName, (newIsolateScopeDirective === directive || directive.$$isolateScope) && (pre = cloneAndAnnotateFn(pre, {
                        isolateScope: !0
                    })), preLinkFns.push(pre)), post && (attrStart && (post = groupElementsLinkFnWrapper(post, attrStart, attrEnd)), post.require = directive.require, post.directiveName = directiveName, (newIsolateScopeDirective === directive || directive.$$isolateScope) && (post = cloneAndAnnotateFn(post, {
                        isolateScope: !0
                    })), postLinkFns.push(post))
                }

                function getControllers(directiveName, require, $element, elementControllers) {
                    var value;
                    if (isString(require)) {
                        var match = require.match(REQUIRE_PREFIX_REGEXP),
                            name = require.substring(match[0].length),
                            inheritType = match[1] || match[3],
                            optional = "?" === match[2];
                        if ("^^" === inheritType ? $element = $element.parent() : (value = elementControllers && elementControllers[name], value = value && value.instance), !value) {
                            var dataName = "$" + name + "Controller";
                            value = inheritType ? $element.inheritedData(dataName) : $element.data(dataName)
                        }
                        if (!value && !optional) throw $compileMinErr("ctreq", "Controller '{0}', required by directive '{1}', can't be found!", name, directiveName)
                    } else if (isArray(require)) {
                        value = [];
                        for (var i = 0, ii = require.length; i < ii; i++) value[i] = getControllers(directiveName, require[i], $element, elementControllers)
                    }
                    return value || null
                }

                function setupControllers($element, attrs, transcludeFn, controllerDirectives, isolateScope, scope) {
                    var elementControllers = createMap();
                    for (var controllerKey in controllerDirectives) {
                        var directive = controllerDirectives[controllerKey],
                            locals = {
                                $scope: directive === newIsolateScopeDirective || directive.$$isolateScope ? isolateScope : scope,
                                $element: $element,
                                $attrs: attrs,
                                $transclude: transcludeFn
                            },
                            controller = directive.controller;
                        "@" == controller && (controller = attrs[directive.name]);
                        var controllerInstance = $controller(controller, locals, !0, directive.controllerAs);
                        elementControllers[directive.name] = controllerInstance, hasElementTranscludeDirective || $element.data("$" + directive.name + "Controller", controllerInstance.instance)
                    }
                    return elementControllers
                }

                function nodeLinkFn(childLinkFn, scope, linkNode, $rootElement, boundTranscludeFn, thisLinkFn) {
                    function controllersBoundTransclude(scope, cloneAttachFn, futureParentElement) {
                        var transcludeControllers;
                        return isScope(scope) || (futureParentElement = cloneAttachFn, cloneAttachFn = scope, scope = undefined), hasElementTranscludeDirective && (transcludeControllers = elementControllers), futureParentElement || (futureParentElement = hasElementTranscludeDirective ? $element.parent() : $element), boundTranscludeFn(scope, cloneAttachFn, transcludeControllers, futureParentElement, scopeToChild)
                    }
                    var i, ii, linkFn, controller, isolateScope, elementControllers, transcludeFn, $element, attrs;
                    if (compileNode === linkNode ? (attrs = templateAttrs, $element = templateAttrs.$$element) : ($element = jqLite(linkNode), attrs = new Attributes($element, templateAttrs)), newIsolateScopeDirective && (isolateScope = scope.$new(!0)), boundTranscludeFn && (transcludeFn = controllersBoundTransclude, transcludeFn.$$boundTransclude = boundTranscludeFn), controllerDirectives && (elementControllers = setupControllers($element, attrs, transcludeFn, controllerDirectives, isolateScope, scope)), newIsolateScopeDirective && (compile.$$addScopeInfo($element, isolateScope, !0, !(templateDirective && (templateDirective === newIsolateScopeDirective || templateDirective === newIsolateScopeDirective.$$originalDirective))), compile.$$addScopeClass($element, !0), isolateScope.$$isolateBindings = newIsolateScopeDirective.$$isolateBindings, initializeDirectiveBindings(scope, attrs, isolateScope, isolateScope.$$isolateBindings, newIsolateScopeDirective, isolateScope)), elementControllers) {
                        var bindings, controllerForBindings, scopeDirective = newIsolateScopeDirective || newScopeDirective;
                        scopeDirective && elementControllers[scopeDirective.name] && (bindings = scopeDirective.$$bindings.bindToController, controller = elementControllers[scopeDirective.name], controller && controller.identifier && bindings && (controllerForBindings = controller, thisLinkFn.$$destroyBindings = initializeDirectiveBindings(scope, attrs, controller.instance, bindings, scopeDirective)));
                        for (i in elementControllers) {
                            controller = elementControllers[i];
                            var controllerResult = controller();
                            controllerResult !== controller.instance && controller === controllerForBindings && (thisLinkFn.$$destroyBindings(), thisLinkFn.$$destroyBindings = initializeDirectiveBindings(scope, attrs, controllerResult, bindings, scopeDirective))
                        }
                    }
                    for (i = 0, ii = preLinkFns.length; i < ii; i++) linkFn = preLinkFns[i], invokeLinkFn(linkFn, linkFn.isolateScope ? isolateScope : scope, $element, attrs, linkFn.require && getControllers(linkFn.directiveName, linkFn.require, $element, elementControllers), transcludeFn);
                    var scopeToChild = scope;
                    for (newIsolateScopeDirective && (newIsolateScopeDirective.template || null === newIsolateScopeDirective.templateUrl) && (scopeToChild = isolateScope), childLinkFn && childLinkFn(scopeToChild, linkNode.childNodes, undefined, boundTranscludeFn), i = postLinkFns.length - 1; i >= 0; i--) linkFn = postLinkFns[i], invokeLinkFn(linkFn, linkFn.isolateScope ? isolateScope : scope, $element, attrs, linkFn.require && getControllers(linkFn.directiveName, linkFn.require, $element, elementControllers), transcludeFn)
                }
                previousCompileContext = previousCompileContext || {};
                for (var newScopeDirective, directive, directiveName, $template, linkFn, directiveValue, terminalPriority = -Number.MAX_VALUE, controllerDirectives = previousCompileContext.controllerDirectives, newIsolateScopeDirective = previousCompileContext.newIsolateScopeDirective, templateDirective = previousCompileContext.templateDirective, nonTlbTranscludeDirective = previousCompileContext.nonTlbTranscludeDirective, hasTranscludeDirective = !1, hasTemplate = !1, hasElementTranscludeDirective = previousCompileContext.hasElementTranscludeDirective, $compileNode = templateAttrs.$$element = jqLite(compileNode), replaceDirective = originalReplaceDirective, childTranscludeFn = transcludeFn, i = 0, ii = directives.length; i < ii; i++) {
                    directive = directives[i];
                    var attrStart = directive.$$start,
                        attrEnd = directive.$$end;
                    if (attrStart && ($compileNode = groupScan(compileNode, attrStart, attrEnd)), $template = undefined, terminalPriority > directive.priority) break;
                    if ((directiveValue = directive.scope) && (directive.templateUrl || (isObject(directiveValue) ? (assertNoDuplicate("new/isolated scope", newIsolateScopeDirective || newScopeDirective, directive, $compileNode), newIsolateScopeDirective = directive) : assertNoDuplicate("new/isolated scope", newIsolateScopeDirective, directive, $compileNode)), newScopeDirective = newScopeDirective || directive), directiveName = directive.name, !directive.templateUrl && directive.controller && (directiveValue = directive.controller, controllerDirectives = controllerDirectives || createMap(), assertNoDuplicate("'" + directiveName + "' controller", controllerDirectives[directiveName], directive, $compileNode), controllerDirectives[directiveName] = directive), (directiveValue = directive.transclude) && (hasTranscludeDirective = !0, directive.$$tlb || (assertNoDuplicate("transclusion", nonTlbTranscludeDirective, directive, $compileNode), nonTlbTranscludeDirective = directive), "element" == directiveValue ? (hasElementTranscludeDirective = !0, terminalPriority = directive.priority, $template = $compileNode, $compileNode = templateAttrs.$$element = jqLite(document.createComment(" " + directiveName + ": " + templateAttrs[directiveName] + " ")), compileNode = $compileNode[0], replaceWith(jqCollection, sliceArgs($template), compileNode), childTranscludeFn = compile($template, transcludeFn, terminalPriority, replaceDirective && replaceDirective.name, {
                            nonTlbTranscludeDirective: nonTlbTranscludeDirective
                        })) : ($template = jqLite(jqLiteClone(compileNode)).contents(), $compileNode.empty(), childTranscludeFn = compile($template, transcludeFn))), directive.template)
                        if (hasTemplate = !0, assertNoDuplicate("template", templateDirective, directive, $compileNode), templateDirective = directive, directiveValue = isFunction(directive.template) ? directive.template($compileNode, templateAttrs) : directive.template, directiveValue = denormalizeTemplate(directiveValue), directive.replace) {
                            if (replaceDirective = directive, $template = jqLiteIsTextNode(directiveValue) ? [] : removeComments(wrapTemplate(directive.templateNamespace, trim(directiveValue))), compileNode = $template[0], 1 != $template.length || compileNode.nodeType !== NODE_TYPE_ELEMENT) throw $compileMinErr("tplrt", "Template for directive '{0}' must have exactly one root element. {1}", directiveName, "");
                            replaceWith(jqCollection, $compileNode, compileNode);
                            var newTemplateAttrs = {
                                    $attr: {}
                                },
                                templateDirectives = collectDirectives(compileNode, [], newTemplateAttrs),
                                unprocessedDirectives = directives.splice(i + 1, directives.length - (i + 1));
                            newIsolateScopeDirective && markDirectivesAsIsolate(templateDirectives), directives = directives.concat(templateDirectives).concat(unprocessedDirectives), mergeTemplateAttributes(templateAttrs, newTemplateAttrs), ii = directives.length
                        } else $compileNode.html(directiveValue);
                    if (directive.templateUrl) hasTemplate = !0, assertNoDuplicate("template", templateDirective, directive, $compileNode), templateDirective = directive, directive.replace && (replaceDirective = directive), nodeLinkFn = compileTemplateUrl(directives.splice(i, directives.length - i), $compileNode, templateAttrs, jqCollection, hasTranscludeDirective && childTranscludeFn, preLinkFns, postLinkFns, {
                        controllerDirectives: controllerDirectives,
                        newIsolateScopeDirective: newIsolateScopeDirective,
                        templateDirective: templateDirective,
                        nonTlbTranscludeDirective: nonTlbTranscludeDirective
                    }), ii = directives.length;
                    else if (directive.compile) try {
                        linkFn = directive.compile($compileNode, templateAttrs, childTranscludeFn), isFunction(linkFn) ? addLinkFns(null, linkFn, attrStart, attrEnd) : linkFn && addLinkFns(linkFn.pre, linkFn.post, attrStart, attrEnd)
                    } catch (e) {
                        $exceptionHandler(e, startingTag($compileNode))
                    }
                    directive.terminal && (nodeLinkFn.terminal = !0, terminalPriority = Math.max(terminalPriority, directive.priority))
                }
                return nodeLinkFn.scope = newScopeDirective && newScopeDirective.scope === !0, nodeLinkFn.transcludeOnThisElement = hasTranscludeDirective, nodeLinkFn.elementTranscludeOnThisElement = hasElementTranscludeDirective, nodeLinkFn.templateOnThisElement = hasTemplate, nodeLinkFn.transclude = childTranscludeFn, previousCompileContext.hasElementTranscludeDirective = hasElementTranscludeDirective, nodeLinkFn
            }

            function markDirectivesAsIsolate(directives) {
                for (var j = 0, jj = directives.length; j < jj; j++) directives[j] = inherit(directives[j], {
                    $$isolateScope: !0
                })
            }

            function addDirective(tDirectives, name, location, maxPriority, ignoreDirective, startAttrName, endAttrName) {
                if (name === ignoreDirective) return null;
                var match = null;
                if (hasDirectives.hasOwnProperty(name))
                    for (var directive, directives = $injector.get(name + Suffix), i = 0, ii = directives.length; i < ii; i++) try {
                        directive = directives[i], (maxPriority === undefined || maxPriority > directive.priority) && directive.restrict.indexOf(location) != -1 && (startAttrName && (directive = inherit(directive, {
                            $$start: startAttrName,
                            $$end: endAttrName
                        })), tDirectives.push(directive), match = directive)
                    } catch (e) {
                        $exceptionHandler(e)
                    }
                return match
            }

            function directiveIsMultiElement(name) {
                if (hasDirectives.hasOwnProperty(name))
                    for (var directive, directives = $injector.get(name + Suffix), i = 0, ii = directives.length; i < ii; i++)
                        if (directive = directives[i], directive.multiElement) return !0;
                return !1
            }

            function mergeTemplateAttributes(dst, src) {
                var srcAttr = src.$attr,
                    dstAttr = dst.$attr,
                    $element = dst.$$element;
                forEach(dst, function(value, key) {
                    "$" != key.charAt(0) && (src[key] && src[key] !== value && (value += ("style" === key ? ";" : " ") + src[key]), dst.$set(key, value, !0, srcAttr[key]))
                }), forEach(src, function(value, key) {
                    "class" == key ? (safeAddClass($element, value), dst["class"] = (dst["class"] ? dst["class"] + " " : "") + value) : "style" == key ? ($element.attr("style", $element.attr("style") + ";" + value), dst.style = (dst.style ? dst.style + ";" : "") + value) : "$" == key.charAt(0) || dst.hasOwnProperty(key) || (dst[key] = value, dstAttr[key] = srcAttr[key])
                })
            }

            function compileTemplateUrl(directives, $compileNode, tAttrs, $rootElement, childTranscludeFn, preLinkFns, postLinkFns, previousCompileContext) {
                var afterTemplateNodeLinkFn, afterTemplateChildLinkFn, linkQueue = [],
                    beforeTemplateCompileNode = $compileNode[0],
                    origAsyncDirective = directives.shift(),
                    derivedSyncDirective = inherit(origAsyncDirective, {
                        templateUrl: null,
                        transclude: null,
                        replace: null,
                        $$originalDirective: origAsyncDirective
                    }),
                    templateUrl = isFunction(origAsyncDirective.templateUrl) ? origAsyncDirective.templateUrl($compileNode, tAttrs) : origAsyncDirective.templateUrl,
                    templateNamespace = origAsyncDirective.templateNamespace;
                return $compileNode.empty(), $templateRequest($sce.getTrustedResourceUrl(templateUrl)).then(function(content) {
                        var compileNode, tempTemplateAttrs, $template, childBoundTranscludeFn;
                        if (content = denormalizeTemplate(content), origAsyncDirective.replace) {
                            if ($template = jqLiteIsTextNode(content) ? [] : removeComments(wrapTemplate(templateNamespace, trim(content))),
                                compileNode = $template[0], 1 != $template.length || compileNode.nodeType !== NODE_TYPE_ELEMENT) throw $compileMinErr("tplrt", "Template for directive '{0}' must have exactly one root element. {1}", origAsyncDirective.name, templateUrl);
                            tempTemplateAttrs = {
                                $attr: {}
                            }, replaceWith($rootElement, $compileNode, compileNode);
                            var templateDirectives = collectDirectives(compileNode, [], tempTemplateAttrs);
                            isObject(origAsyncDirective.scope) && markDirectivesAsIsolate(templateDirectives), directives = templateDirectives.concat(directives), mergeTemplateAttributes(tAttrs, tempTemplateAttrs)
                        } else compileNode = beforeTemplateCompileNode, $compileNode.html(content);
                        for (directives.unshift(derivedSyncDirective), afterTemplateNodeLinkFn = applyDirectivesToNode(directives, compileNode, tAttrs, childTranscludeFn, $compileNode, origAsyncDirective, preLinkFns, postLinkFns, previousCompileContext), forEach($rootElement, function(node, i) {
                                node == compileNode && ($rootElement[i] = $compileNode[0])
                            }), afterTemplateChildLinkFn = compileNodes($compileNode[0].childNodes, childTranscludeFn); linkQueue.length;) {
                            var scope = linkQueue.shift(),
                                beforeTemplateLinkNode = linkQueue.shift(),
                                linkRootElement = linkQueue.shift(),
                                boundTranscludeFn = linkQueue.shift(),
                                linkNode = $compileNode[0];
                            if (!scope.$$destroyed) {
                                if (beforeTemplateLinkNode !== beforeTemplateCompileNode) {
                                    var oldClasses = beforeTemplateLinkNode.className;
                                    previousCompileContext.hasElementTranscludeDirective && origAsyncDirective.replace || (linkNode = jqLiteClone(compileNode)), replaceWith(linkRootElement, jqLite(beforeTemplateLinkNode), linkNode), safeAddClass(jqLite(linkNode), oldClasses)
                                }
                                childBoundTranscludeFn = afterTemplateNodeLinkFn.transcludeOnThisElement ? createBoundTranscludeFn(scope, afterTemplateNodeLinkFn.transclude, boundTranscludeFn) : boundTranscludeFn, afterTemplateNodeLinkFn(afterTemplateChildLinkFn, scope, linkNode, $rootElement, childBoundTranscludeFn, afterTemplateNodeLinkFn)
                            }
                        }
                        linkQueue = null
                    }),
                    function(ignoreChildLinkFn, scope, node, rootElement, boundTranscludeFn) {
                        var childBoundTranscludeFn = boundTranscludeFn;
                        scope.$$destroyed || (linkQueue ? linkQueue.push(scope, node, rootElement, childBoundTranscludeFn) : (afterTemplateNodeLinkFn.transcludeOnThisElement && (childBoundTranscludeFn = createBoundTranscludeFn(scope, afterTemplateNodeLinkFn.transclude, boundTranscludeFn)), afterTemplateNodeLinkFn(afterTemplateChildLinkFn, scope, node, rootElement, childBoundTranscludeFn, afterTemplateNodeLinkFn)))
                    }
            }

            function byPriority(a, b) {
                var diff = b.priority - a.priority;
                return 0 !== diff ? diff : a.name !== b.name ? a.name < b.name ? -1 : 1 : a.index - b.index
            }

            function assertNoDuplicate(what, previousDirective, directive, element) {
                if (previousDirective) throw $compileMinErr("multidir", "Multiple directives [{0}, {1}] asking for {2} on: {3}", previousDirective.name, directive.name, what, startingTag(element))
            }

            function addTextInterpolateDirective(directives, text) {
                var interpolateFn = $interpolate(text, !0);
                interpolateFn && directives.push({
                    priority: 0,
                    compile: function(templateNode) {
                        var templateNodeParent = templateNode.parent(),
                            hasCompileParent = !!templateNodeParent.length;
                        return hasCompileParent && compile.$$addBindingClass(templateNodeParent),
                            function(scope, node) {
                                var parent = node.parent();
                                hasCompileParent || compile.$$addBindingClass(parent), compile.$$addBindingInfo(parent, interpolateFn.expressions), scope.$watch(interpolateFn, function(value) {
                                    node[0].nodeValue = value
                                })
                            }
                    }
                })
            }

            function wrapTemplate(type, template) {
                switch (type = lowercase(type || "html")) {
                    case "svg":
                    case "math":
                        var wrapper = document.createElement("div");
                        return wrapper.innerHTML = "<" + type + ">" + template + "</" + type + ">", wrapper.childNodes[0].childNodes;
                    default:
                        return template
                }
            }

            function getTrustedContext(node, attrNormalizedName) {
                if ("srcdoc" == attrNormalizedName) return $sce.HTML;
                var tag = nodeName_(node);
                return "xlinkHref" == attrNormalizedName || "form" == tag && "action" == attrNormalizedName || "img" != tag && ("src" == attrNormalizedName || "ngSrc" == attrNormalizedName) ? $sce.RESOURCE_URL : void 0
            }

            function addAttrInterpolateDirective(node, directives, value, name, allOrNothing) {
                var trustedContext = getTrustedContext(node, name);
                allOrNothing = ALL_OR_NOTHING_ATTRS[name] || allOrNothing;
                var interpolateFn = $interpolate(value, !0, trustedContext, allOrNothing);
                if (interpolateFn) {
                    if ("multiple" === name && "select" === nodeName_(node)) throw $compileMinErr("selmulti", "Binding to the 'multiple' attribute is not supported. Element: {0}", startingTag(node));
                    directives.push({
                        priority: 100,
                        compile: function() {
                            return {
                                pre: function(scope, element, attr) {
                                    var $$observers = attr.$$observers || (attr.$$observers = {});
                                    if (EVENT_HANDLER_ATTR_REGEXP.test(name)) throw $compileMinErr("nodomevents", "Interpolations for HTML DOM event attributes are disallowed.  Please use the ng- versions (such as ng-click instead of onclick) instead.");
                                    var newValue = attr[name];
                                    newValue !== value && (interpolateFn = newValue && $interpolate(newValue, !0, trustedContext, allOrNothing), value = newValue), interpolateFn && (attr[name] = interpolateFn(scope), ($$observers[name] || ($$observers[name] = [])).$$inter = !0, (attr.$$observers && attr.$$observers[name].$$scope || scope).$watch(interpolateFn, function(newValue, oldValue) {
                                        "class" === name && newValue != oldValue ? attr.$updateClass(newValue, oldValue) : attr.$set(name, newValue)
                                    }))
                                }
                            }
                        }
                    })
                }
            }

            function replaceWith($rootElement, elementsToRemove, newNode) {
                var i, ii, firstElementToRemove = elementsToRemove[0],
                    removeCount = elementsToRemove.length,
                    parent = firstElementToRemove.parentNode;
                if ($rootElement)
                    for (i = 0, ii = $rootElement.length; i < ii; i++)
                        if ($rootElement[i] == firstElementToRemove) {
                            $rootElement[i++] = newNode;
                            for (var j = i, j2 = j + removeCount - 1, jj = $rootElement.length; j < jj; j++, j2++) j2 < jj ? $rootElement[j] = $rootElement[j2] : delete $rootElement[j];
                            $rootElement.length -= removeCount - 1, $rootElement.context === firstElementToRemove && ($rootElement.context = newNode);
                            break
                        }
                parent && parent.replaceChild(newNode, firstElementToRemove);
                var fragment = document.createDocumentFragment();
                fragment.appendChild(firstElementToRemove), jqLite(newNode).data(jqLite(firstElementToRemove).data()), jQuery ? (skipDestroyOnNextJQueryCleanData = !0, jQuery.cleanData([firstElementToRemove])) : delete jqLite.cache[firstElementToRemove[jqLite.expando]];
                for (var k = 1, kk = elementsToRemove.length; k < kk; k++) {
                    var element = elementsToRemove[k];
                    jqLite(element).remove(), fragment.appendChild(element), delete elementsToRemove[k]
                }
                elementsToRemove[0] = newNode, elementsToRemove.length = 1
            }

            function cloneAndAnnotateFn(fn, annotation) {
                return extend(function() {
                    return fn.apply(null, arguments)
                }, fn, annotation)
            }

            function invokeLinkFn(linkFn, scope, $element, attrs, controllers, transcludeFn) {
                try {
                    linkFn(scope, $element, attrs, controllers, transcludeFn)
                } catch (e) {
                    $exceptionHandler(e, startingTag($element))
                }
            }

            function initializeDirectiveBindings(scope, attrs, destination, bindings, directive, newScope) {
                var onNewScopeDestroyed;
                forEach(bindings, function(definition, scopeName) {
                    var lastValue, parentGet, parentSet, compare, attrName = definition.attrName,
                        optional = definition.optional,
                        mode = definition.mode;
                    switch (mode) {
                        case "@":
                            attrs.$observe(attrName, function(value) {
                                destination[scopeName] = value
                            }), attrs.$$observers[attrName].$$scope = scope, attrs[attrName] && (destination[scopeName] = $interpolate(attrs[attrName])(scope));
                            break;
                        case "=":
                            if (optional && !attrs[attrName]) return;
                            parentGet = $parse(attrs[attrName]), compare = parentGet.literal ? equals : function(a, b) {
                                return a === b || a !== a && b !== b
                            }, parentSet = parentGet.assign || function() {
                                throw lastValue = destination[scopeName] = parentGet(scope), $compileMinErr("nonassign", "Expression '{0}' used with directive '{1}' is non-assignable!", attrs[attrName], directive.name)
                            }, lastValue = destination[scopeName] = parentGet(scope);
                            var parentValueWatch = function(parentValue) {
                                return compare(parentValue, destination[scopeName]) || (compare(parentValue, lastValue) ? parentSet(scope, parentValue = destination[scopeName]) : destination[scopeName] = parentValue), lastValue = parentValue
                            };
                            parentValueWatch.$stateful = !0;
                            var unwatch;
                            unwatch = definition.collection ? scope.$watchCollection(attrs[attrName], parentValueWatch) : scope.$watch($parse(attrs[attrName], parentValueWatch), null, parentGet.literal), onNewScopeDestroyed = onNewScopeDestroyed || [], onNewScopeDestroyed.push(unwatch);
                            break;
                        case "&":
                            if (!attrs.hasOwnProperty(attrName) && optional) break;
                            if (parentGet = $parse(attrs[attrName]), parentGet === noop && optional) break;
                            destination[scopeName] = function(locals) {
                                return parentGet(scope, locals)
                            }
                    }
                });
                var destroyBindings = onNewScopeDestroyed ? function() {
                    for (var i = 0, ii = onNewScopeDestroyed.length; i < ii; ++i) onNewScopeDestroyed[i]()
                } : noop;
                return newScope && destroyBindings !== noop ? (newScope.$on("$destroy", destroyBindings), noop) : destroyBindings
            }
            var Attributes = function(element, attributesToCopy) {
                if (attributesToCopy) {
                    var i, l, key, keys = Object.keys(attributesToCopy);
                    for (i = 0, l = keys.length; i < l; i++) key = keys[i], this[key] = attributesToCopy[key]
                } else this.$attr = {};
                this.$$element = element
            };
            Attributes.prototype = {
                $normalize: directiveNormalize,
                $addClass: function(classVal) {
                    classVal && classVal.length > 0 && $animate.addClass(this.$$element, classVal)
                },
                $removeClass: function(classVal) {
                    classVal && classVal.length > 0 && $animate.removeClass(this.$$element, classVal)
                },
                $updateClass: function(newClasses, oldClasses) {
                    var toAdd = tokenDifference(newClasses, oldClasses);
                    toAdd && toAdd.length && $animate.addClass(this.$$element, toAdd);
                    var toRemove = tokenDifference(oldClasses, newClasses);
                    toRemove && toRemove.length && $animate.removeClass(this.$$element, toRemove)
                },
                $set: function(key, value, writeAttr, attrName) {
                    var nodeName, node = this.$$element[0],
                        booleanKey = getBooleanAttrName(node, key),
                        aliasedKey = getAliasedAttrName(node, key),
                        observer = key;
                    if (booleanKey ? (this.$$element.prop(key, value), attrName = booleanKey) : aliasedKey && (this[aliasedKey] = value, observer = aliasedKey), this[key] = value, attrName ? this.$attr[key] = attrName : (attrName = this.$attr[key], attrName || (this.$attr[key] = attrName = snake_case(key, "-"))), nodeName = nodeName_(this.$$element), "a" === nodeName && "href" === key || "img" === nodeName && "src" === key) this[key] = value = $$sanitizeUri(value, "src" === key);
                    else if ("img" === nodeName && "srcset" === key) {
                        for (var result = "", trimmedSrcset = trim(value), srcPattern = /(\s+\d+x\s*,|\s+\d+w\s*,|\s+,|,\s+)/, pattern = /\s/.test(trimmedSrcset) ? srcPattern : /(,)/, rawUris = trimmedSrcset.split(pattern), nbrUrisWith2parts = Math.floor(rawUris.length / 2), i = 0; i < nbrUrisWith2parts; i++) {
                            var innerIdx = 2 * i;
                            result += $$sanitizeUri(trim(rawUris[innerIdx]), !0), result += " " + trim(rawUris[innerIdx + 1])
                        }
                        var lastTuple = trim(rawUris[2 * i]).split(/\s/);
                        result += $$sanitizeUri(trim(lastTuple[0]), !0), 2 === lastTuple.length && (result += " " + trim(lastTuple[1])), this[key] = value = result
                    }
                    writeAttr !== !1 && (null === value || value === undefined ? this.$$element.removeAttr(attrName) : this.$$element.attr(attrName, value));
                    var $$observers = this.$$observers;
                    $$observers && forEach($$observers[observer], function(fn) {
                        try {
                            fn(value)
                        } catch (e) {
                            $exceptionHandler(e)
                        }
                    })
                },
                $observe: function(key, fn) {
                    var attrs = this,
                        $$observers = attrs.$$observers || (attrs.$$observers = createMap()),
                        listeners = $$observers[key] || ($$observers[key] = []);
                    return listeners.push(fn), $rootScope.$evalAsync(function() {
                            !listeners.$$inter && attrs.hasOwnProperty(key) && fn(attrs[key])
                        }),
                        function() {
                            arrayRemove(listeners, fn)
                        }
                }
            };
            var startSymbol = $interpolate.startSymbol(),
                endSymbol = $interpolate.endSymbol(),
                denormalizeTemplate = "{{" == startSymbol || "}}" == endSymbol ? identity : function(template) {
                    return template.replace(/\{\{/g, startSymbol).replace(/}}/g, endSymbol)
                },
                NG_ATTR_BINDING = /^ngAttr[A-Z]/;
            return compile.$$addBindingInfo = debugInfoEnabled ? function($element, binding) {
                var bindings = $element.data("$binding") || [];
                isArray(binding) ? bindings = bindings.concat(binding) : bindings.push(binding), $element.data("$binding", bindings)
            } : noop, compile.$$addBindingClass = debugInfoEnabled ? function($element) {
                safeAddClass($element, "ng-binding")
            } : noop, compile.$$addScopeInfo = debugInfoEnabled ? function($element, scope, isolated, noTemplate) {
                var dataName = isolated ? noTemplate ? "$isolateScopeNoTemplate" : "$isolateScope" : "$scope";
                $element.data(dataName, scope)
            } : noop, compile.$$addScopeClass = debugInfoEnabled ? function($element, isolated) {
                safeAddClass($element, isolated ? "ng-isolate-scope" : "ng-scope")
            } : noop, compile
        }]
    }

    function directiveNormalize(name) {
        return camelCase(name.replace(PREFIX_REGEXP, ""))
    }

    function tokenDifference(str1, str2) {
        var values = "",
            tokens1 = str1.split(/\s+/),
            tokens2 = str2.split(/\s+/);
        outer: for (var i = 0; i < tokens1.length; i++) {
            for (var token = tokens1[i], j = 0; j < tokens2.length; j++)
                if (token == tokens2[j]) continue outer;
            values += (values.length > 0 ? " " : "") + token
        }
        return values
    }

    function removeComments(jqNodes) {
        jqNodes = jqLite(jqNodes);
        var i = jqNodes.length;
        if (i <= 1) return jqNodes;
        for (; i--;) {
            var node = jqNodes[i];
            node.nodeType === NODE_TYPE_COMMENT && splice.call(jqNodes, i, 1)
        }
        return jqNodes
    }

    function identifierForController(controller, ident) {
        if (ident && isString(ident)) return ident;
        if (isString(controller)) {
            var match = CNTRL_REG.exec(controller);
            if (match) return match[3]
        }
    }

    function $ControllerProvider() {
        var controllers = {},
            globals = !1;
        this.register = function(name, constructor) {
            assertNotHasOwnProperty(name, "controller"), isObject(name) ? extend(controllers, name) : controllers[name] = constructor
        }, this.allowGlobals = function() {
            globals = !0
        }, this.$get = ["$injector", "$window", function($injector, $window) {
            function addIdentifier(locals, identifier, instance, name) {
                if (!locals || !isObject(locals.$scope)) throw minErr("$controller")("noscp", "Cannot export controller '{0}' as '{1}'! No $scope object provided via `locals`.", name, identifier);
                locals.$scope[identifier] = instance
            }
            return function(expression, locals, later, ident) {
                var instance, match, constructor, identifier;
                if (later = later === !0, ident && isString(ident) && (identifier = ident), isString(expression)) {
                    if (match = expression.match(CNTRL_REG), !match) throw $controllerMinErr("ctrlfmt", "Badly formed controller string '{0}'. Must match `__name__ as __id__` or `__name__`.", expression);
                    constructor = match[1], identifier = identifier || match[3], expression = controllers.hasOwnProperty(constructor) ? controllers[constructor] : getter(locals.$scope, constructor, !0) || (globals ? getter($window, constructor, !0) : undefined), assertArgFn(expression, constructor, !0)
                }
                if (later) {
                    var controllerPrototype = (isArray(expression) ? expression[expression.length - 1] : expression).prototype;
                    instance = Object.create(controllerPrototype || null), identifier && addIdentifier(locals, identifier, instance, constructor || expression.name);
                    var instantiate;
                    return instantiate = extend(function() {
                        var result = $injector.invoke(expression, instance, locals, constructor);
                        return result !== instance && (isObject(result) || isFunction(result)) && (instance = result, identifier && addIdentifier(locals, identifier, instance, constructor || expression.name)), instance
                    }, {
                        instance: instance,
                        identifier: identifier
                    })
                }
                return instance = $injector.instantiate(expression, locals, constructor), identifier && addIdentifier(locals, identifier, instance, constructor || expression.name), instance
            }
        }]
    }

    function $DocumentProvider() {
        this.$get = ["$window", function(window) {
            return jqLite(window.document)
        }]
    }

    function $ExceptionHandlerProvider() {
        this.$get = ["$log", function($log) {
            return function(exception, cause) {
                $log.error.apply($log, arguments)
            }
        }]
    }

    function defaultHttpResponseTransform(data, headers) {
        if (isString(data)) {
            var tempData = data.replace(JSON_PROTECTION_PREFIX, "").trim();
            if (tempData) {
                var contentType = headers("Content-Type");
                (contentType && 0 === contentType.indexOf(APPLICATION_JSON) || isJsonLike(tempData)) && (data = fromJson(tempData))
            }
        }
        return data
    }

    function isJsonLike(str) {
        var jsonStart = str.match(JSON_START);
        return jsonStart && JSON_ENDS[jsonStart[0]].test(str)
    }

    function parseHeaders(headers) {
        function fillInParsed(key, val) {
            key && (parsed[key] = parsed[key] ? parsed[key] + ", " + val : val)
        }
        var i, parsed = createMap();
        return isString(headers) ? forEach(headers.split("\n"), function(line) {
            i = line.indexOf(":"), fillInParsed(lowercase(trim(line.substr(0, i))), trim(line.substr(i + 1)))
        }) : isObject(headers) && forEach(headers, function(headerVal, headerKey) {
            fillInParsed(lowercase(headerKey), trim(headerVal))
        }), parsed
    }

    function headersGetter(headers) {
        var headersObj;
        return function(name) {
            if (headersObj || (headersObj = parseHeaders(headers)), name) {
                var value = headersObj[lowercase(name)];
                return void 0 === value && (value = null), value
            }
            return headersObj
        }
    }

    function transformData(data, headers, status, fns) {
        return isFunction(fns) ? fns(data, headers, status) : (forEach(fns, function(fn) {
            data = fn(data, headers, status)
        }), data)
    }

    function isSuccess(status) {
        return 200 <= status && status < 300
    }

    function $HttpProvider() {
        var defaults = this.defaults = {
                transformResponse: [defaultHttpResponseTransform],
                transformRequest: [function(d) {
                    return !isObject(d) || isFile(d) || isBlob(d) || isFormData(d) ? d : toJson(d)
                }],
                headers: {
                    common: {
                        Accept: "application/json, text/plain, */*"
                    },
                    post: shallowCopy(CONTENT_TYPE_APPLICATION_JSON),
                    put: shallowCopy(CONTENT_TYPE_APPLICATION_JSON),
                    patch: shallowCopy(CONTENT_TYPE_APPLICATION_JSON)
                },
                xsrfCookieName: "XSRF-TOKEN",
                xsrfHeaderName: "X-XSRF-TOKEN"
            },
            useApplyAsync = !1;
        this.useApplyAsync = function(value) {
            return isDefined(value) ? (useApplyAsync = !!value, this) : useApplyAsync
        };
        var interceptorFactories = this.interceptors = [];
        this.$get = ["$httpBackend", "$$cookieReader", "$cacheFactory", "$rootScope", "$q", "$injector", function($httpBackend, $$cookieReader, $cacheFactory, $rootScope, $q, $injector) {
            function $http(requestConfig) {
                function transformResponse(response) {
                    var resp = extend({}, response);
                    return response.data ? resp.data = transformData(response.data, response.headers, response.status, config.transformResponse) : resp.data = response.data, isSuccess(response.status) ? resp : $q.reject(resp)
                }

                function executeHeaderFns(headers, config) {
                    var headerContent, processedHeaders = {};
                    return forEach(headers, function(headerFn, header) {
                        isFunction(headerFn) ? (headerContent = headerFn(config), null != headerContent && (processedHeaders[header] = headerContent)) : processedHeaders[header] = headerFn
                    }), processedHeaders
                }

                function mergeHeaders(config) {
                    var defHeaderName, lowercaseDefHeaderName, reqHeaderName, defHeaders = defaults.headers,
                        reqHeaders = extend({}, config.headers);
                    defHeaders = extend({}, defHeaders.common, defHeaders[lowercase(config.method)]);
                    defaultHeadersIteration: for (defHeaderName in defHeaders) {
                        lowercaseDefHeaderName = lowercase(defHeaderName);
                        for (reqHeaderName in reqHeaders)
                            if (lowercase(reqHeaderName) === lowercaseDefHeaderName) continue defaultHeadersIteration;
                        reqHeaders[defHeaderName] = defHeaders[defHeaderName]
                    }
                    return executeHeaderFns(reqHeaders, shallowCopy(config))
                }
                if (!angular.isObject(requestConfig)) throw minErr("$http")("badreq", "Http request configuration must be an object.  Received: {0}", requestConfig);
                var config = extend({
                    method: "get",
                    transformRequest: defaults.transformRequest,
                    transformResponse: defaults.transformResponse
                }, requestConfig);
                config.headers = mergeHeaders(requestConfig), config.method = uppercase(config.method);
                var serverRequest = function(config) {
                        var headers = config.headers,
                            reqData = transformData(config.data, headersGetter(headers), undefined, config.transformRequest);
                        return isUndefined(reqData) && forEach(headers, function(value, header) {
                            "content-type" === lowercase(header) && delete headers[header]
                        }), isUndefined(config.withCredentials) && !isUndefined(defaults.withCredentials) && (config.withCredentials = defaults.withCredentials), sendReq(config, reqData).then(transformResponse, transformResponse)
                    },
                    chain = [serverRequest, undefined],
                    promise = $q.when(config);
                for (forEach(reversedInterceptors, function(interceptor) {
                        (interceptor.request || interceptor.requestError) && chain.unshift(interceptor.request, interceptor.requestError), (interceptor.response || interceptor.responseError) && chain.push(interceptor.response, interceptor.responseError)
                    }); chain.length;) {
                    var thenFn = chain.shift(),
                        rejectFn = chain.shift();
                    promise = promise.then(thenFn, rejectFn)
                }
                return promise.success = function(fn) {
                    return promise.then(function(response) {
                        fn(response.data, response.status, response.headers, config)
                    }), promise
                }, promise.error = function(fn) {
                    return promise.then(null, function(response) {
                        fn(response.data, response.status, response.headers, config)
                    }), promise
                }, promise
            }

            function createShortMethods(names) {
                forEach(arguments, function(name) {
                    $http[name] = function(url, config) {
                        return $http(extend(config || {}, {
                            method: name,
                            url: url
                        }))
                    }
                })
            }

            function createShortMethodsWithData(name) {
                forEach(arguments, function(name) {
                    $http[name] = function(url, data, config) {
                        return $http(extend(config || {}, {
                            method: name,
                            url: url,
                            data: data
                        }))
                    }
                })
            }

            function sendReq(config, reqData) {
                function done(status, response, headersString, statusText) {
                    function resolveHttpPromise() {
                        resolvePromise(response, status, headersString, statusText)
                    }
                    cache && (isSuccess(status) ? cache.put(url, [status, response, parseHeaders(headersString), statusText]) : cache.remove(url)), useApplyAsync ? $rootScope.$applyAsync(resolveHttpPromise) : (resolveHttpPromise(), $rootScope.$$phase || $rootScope.$apply())
                }

                function resolvePromise(response, status, headers, statusText) {
                    status = Math.max(status, 0), (isSuccess(status) ? deferred.resolve : deferred.reject)({
                        data: response,
                        status: status,
                        headers: headersGetter(headers),
                        config: config,
                        statusText: statusText
                    })
                }

                function resolvePromiseWithResult(result) {
                    resolvePromise(result.data, result.status, shallowCopy(result.headers()), result.statusText)
                }

                function removePendingReq() {
                    var idx = $http.pendingRequests.indexOf(config);
                    idx !== -1 && $http.pendingRequests.splice(idx, 1)
                }
                var cache, cachedResp, deferred = $q.defer(),
                    promise = deferred.promise,
                    reqHeaders = config.headers,
                    url = buildUrl(config.url, config.params);
                if ($http.pendingRequests.push(config), promise.then(removePendingReq, removePendingReq), !config.cache && !defaults.cache || config.cache === !1 || "GET" !== config.method && "JSONP" !== config.method || (cache = isObject(config.cache) ? config.cache : isObject(defaults.cache) ? defaults.cache : defaultCache), cache && (cachedResp = cache.get(url), isDefined(cachedResp) ? isPromiseLike(cachedResp) ? cachedResp.then(resolvePromiseWithResult, resolvePromiseWithResult) : isArray(cachedResp) ? resolvePromise(cachedResp[1], cachedResp[0], shallowCopy(cachedResp[2]), cachedResp[3]) : resolvePromise(cachedResp, 200, {}, "OK") : cache.put(url, promise)), isUndefined(cachedResp)) {
                    var xsrfValue = urlIsSameOrigin(config.url) ? $$cookieReader()[config.xsrfCookieName || defaults.xsrfCookieName] : undefined;
                    xsrfValue && (reqHeaders[config.xsrfHeaderName || defaults.xsrfHeaderName] = xsrfValue), $httpBackend(config.method, url, reqData, done, reqHeaders, config.timeout, config.withCredentials, config.responseType)
                }
                return promise
            }

            function buildUrl(url, params) {
                if (!params) return url;
                var parts = [];
                return forEachSorted(params, function(value, key) {
                    null === value || isUndefined(value) || (isArray(value) || (value = [value]), forEach(value, function(v) {
                        isObject(v) && (v = isDate(v) ? v.toISOString() : toJson(v)), parts.push(encodeUriQuery(key) + "=" + encodeUriQuery(v))
                    }))
                }), parts.length > 0 && (url += (url.indexOf("?") == -1 ? "?" : "&") + parts.join("&")), url
            }
            var defaultCache = $cacheFactory("$http"),
                reversedInterceptors = [];
            return forEach(interceptorFactories, function(interceptorFactory) {
                reversedInterceptors.unshift(isString(interceptorFactory) ? $injector.get(interceptorFactory) : $injector.invoke(interceptorFactory))
            }), $http.pendingRequests = [], createShortMethods("get", "delete", "head", "jsonp"), createShortMethodsWithData("post", "put", "patch"), $http.defaults = defaults, $http
        }]
    }

    function createXhr() {
        return new window.XMLHttpRequest
    }

    function $HttpBackendProvider() {
        this.$get = ["$browser", "$window", "$document", function($browser, $window, $document) {
            return createHttpBackend($browser, createXhr, $browser.defer, $window.angular.callbacks, $document[0])
        }]
    }

    function createHttpBackend($browser, createXhr, $browserDefer, callbacks, rawDocument) {
        function jsonpReq(url, callbackId, done) {
            var script = rawDocument.createElement("script"),
                callback = null;
            return script.type = "text/javascript", script.src = url, script.async = !0, callback = function(event) {
                removeEventListenerFn(script, "load", callback), removeEventListenerFn(script, "error", callback), rawDocument.body.removeChild(script), script = null;
                var status = -1,
                    text = "unknown";
                event && ("load" !== event.type || callbacks[callbackId].called || (event = {
                    type: "error"
                }), text = event.type, status = "error" === event.type ? 404 : 200), done && done(status, text)
            }, addEventListenerFn(script, "load", callback), addEventListenerFn(script, "error", callback), rawDocument.body.appendChild(script), callback
        }
        return function(method, url, post, callback, headers, timeout, withCredentials, responseType) {
            function timeoutRequest() {
                jsonpDone && jsonpDone(), xhr && xhr.abort()
            }

            function completeRequest(callback, status, response, headersString, statusText) {
                timeoutId !== undefined && $browserDefer.cancel(timeoutId), jsonpDone = xhr = null, callback(status, response, headersString, statusText), $browser.$$completeOutstandingRequest(noop)
            }
            if ($browser.$$incOutstandingRequestCount(), url = url || $browser.url(), "jsonp" == lowercase(method)) {
                var callbackId = "_" + (callbacks.counter++).toString(36);
                callbacks[callbackId] = function(data) {
                    callbacks[callbackId].data = data, callbacks[callbackId].called = !0
                };
                var jsonpDone = jsonpReq(url.replace("JSON_CALLBACK", "angular.callbacks." + callbackId), callbackId, function(status, text) {
                    completeRequest(callback, status, callbacks[callbackId].data, "", text), callbacks[callbackId] = noop
                })
            } else {
                var xhr = createXhr();
                xhr.open(method, url, !0), forEach(headers, function(value, key) {
                    isDefined(value) && xhr.setRequestHeader(key, value)
                }), xhr.onload = function() {
                    var statusText = xhr.statusText || "",
                        response = "response" in xhr ? xhr.response : xhr.responseText,
                        status = 1223 === xhr.status ? 204 : xhr.status;
                    0 === status && (status = response ? 200 : "file" == urlResolve(url).protocol ? 404 : 0), completeRequest(callback, status, response, xhr.getAllResponseHeaders(), statusText)
                };
                var requestError = function() {
                    completeRequest(callback, -1, null, null, "")
                };
                if (xhr.onerror = requestError, xhr.onabort = requestError, withCredentials && (xhr.withCredentials = !0), responseType) try {
                    xhr.responseType = responseType
                } catch (e) {
                    if ("json" !== responseType) throw e
                }
                xhr.send(post || null)
            }
            if (timeout > 0) var timeoutId = $browserDefer(timeoutRequest, timeout);
            else isPromiseLike(timeout) && timeout.then(timeoutRequest)
        }
    }

    function $InterpolateProvider() {
        var startSymbol = "{{",
            endSymbol = "}}";
        this.startSymbol = function(value) {
            return value ? (startSymbol = value, this) : startSymbol
        }, this.endSymbol = function(value) {
            return value ? (endSymbol = value, this) : endSymbol
        }, this.$get = ["$parse", "$exceptionHandler", "$sce", function($parse, $exceptionHandler, $sce) {
            function escape(ch) {
                return "\\\\\\" + ch
            }

            function unescapeText(text) {
                return text.replace(escapedStartRegexp, startSymbol).replace(escapedEndRegexp, endSymbol)
            }

            function stringify(value) {
                if (null == value) return "";
                switch (typeof value) {
                    case "string":
                        break;
                    case "number":
                        value = "" + value;
                        break;
                    default:
                        value = toJson(value)
                }
                return value
            }

            function $interpolate(text, mustHaveExpression, trustedContext, allOrNothing) {
                function parseStringifyInterceptor(value) {
                    try {
                        return value = getValue(value), allOrNothing && !isDefined(value) ? value : stringify(value)
                    } catch (err) {
                        var newErr = $interpolateMinErr("interr", "Can't interpolate: {0}\n{1}", text, err.toString());
                        $exceptionHandler(newErr)
                    }
                }
                allOrNothing = !!allOrNothing;
                for (var startIndex, endIndex, exp, index = 0, expressions = [], parseFns = [], textLength = text.length, concat = [], expressionPositions = []; index < textLength;) {
                    if ((startIndex = text.indexOf(startSymbol, index)) == -1 || (endIndex = text.indexOf(endSymbol, startIndex + startSymbolLength)) == -1) {
                        index !== textLength && concat.push(unescapeText(text.substring(index)));
                        break
                    }
                    index !== startIndex && concat.push(unescapeText(text.substring(index, startIndex))), exp = text.substring(startIndex + startSymbolLength, endIndex), expressions.push(exp), parseFns.push($parse(exp, parseStringifyInterceptor)), index = endIndex + endSymbolLength, expressionPositions.push(concat.length), concat.push("")
                }
                if (trustedContext && concat.length > 1) throw $interpolateMinErr("noconcat", "Error while interpolating: {0}\nStrict Contextual Escaping disallows interpolations that concatenate multiple expressions when a trusted value is required.  See http://docs.angularjs.org/api/ng.$sce", text);
                if (!mustHaveExpression || expressions.length) {
                    var compute = function(values) {
                            for (var i = 0, ii = expressions.length; i < ii; i++) {
                                if (allOrNothing && isUndefined(values[i])) return;
                                concat[expressionPositions[i]] = values[i]
                            }
                            return concat.join("")
                        },
                        getValue = function(value) {
                            return trustedContext ? $sce.getTrusted(trustedContext, value) : $sce.valueOf(value)
                        };
                    return extend(function(context) {
                        var i = 0,
                            ii = expressions.length,
                            values = new Array(ii);
                        try {
                            for (; i < ii; i++) values[i] = parseFns[i](context);
                            return compute(values)
                        } catch (err) {
                            var newErr = $interpolateMinErr("interr", "Can't interpolate: {0}\n{1}", text, err.toString());
                            $exceptionHandler(newErr)
                        }
                    }, {
                        exp: text,
                        expressions: expressions,
                        $$watchDelegate: function(scope, listener) {
                            var lastValue;
                            return scope.$watchGroup(parseFns, function(values, oldValues) {
                                var currValue = compute(values);
                                isFunction(listener) && listener.call(this, currValue, values !== oldValues ? lastValue : currValue, scope), lastValue = currValue
                            })
                        }
                    })
                }
            }
            var startSymbolLength = startSymbol.length,
                endSymbolLength = endSymbol.length,
                escapedStartRegexp = new RegExp(startSymbol.replace(/./g, escape), "g"),
                escapedEndRegexp = new RegExp(endSymbol.replace(/./g, escape), "g");
            return $interpolate.startSymbol = function() {
                return startSymbol
            }, $interpolate.endSymbol = function() {
                return endSymbol
            }, $interpolate
        }]
    }

    function $IntervalProvider() {
        this.$get = ["$rootScope", "$window", "$q", "$$q", function($rootScope, $window, $q, $$q) {
            function interval(fn, delay, count, invokeApply) {
                var hasParams = arguments.length > 4,
                    args = hasParams ? sliceArgs(arguments, 4) : [],
                    setInterval = $window.setInterval,
                    clearInterval = $window.clearInterval,
                    iteration = 0,
                    skipApply = isDefined(invokeApply) && !invokeApply,
                    deferred = (skipApply ? $$q : $q).defer(),
                    promise = deferred.promise;
                return count = isDefined(count) ? count : 0, promise.then(null, null, hasParams ? function() {
                    fn.apply(null, args)
                } : fn), promise.$$intervalId = setInterval(function() {
                    deferred.notify(iteration++), count > 0 && iteration >= count && (deferred.resolve(iteration), clearInterval(promise.$$intervalId), delete intervals[promise.$$intervalId]), skipApply || $rootScope.$apply()
                }, delay), intervals[promise.$$intervalId] = deferred, promise
            }
            var intervals = {};
            return interval.cancel = function(promise) {
                return !!(promise && promise.$$intervalId in intervals) && (intervals[promise.$$intervalId].reject("canceled"), $window.clearInterval(promise.$$intervalId), delete intervals[promise.$$intervalId], !0)
            }, interval
        }]
    }

    function $LocaleProvider() {
        this.$get = function() {
            return {
                id: "en-us",
                NUMBER_FORMATS: {
                    DECIMAL_SEP: ".",
                    GROUP_SEP: ",",
                    PATTERNS: [{
                        minInt: 1,
                        minFrac: 0,
                        maxFrac: 3,
                        posPre: "",
                        posSuf: "",
                        negPre: "-",
                        negSuf: "",
                        gSize: 3,
                        lgSize: 3
                    }, {
                        minInt: 1,
                        minFrac: 2,
                        maxFrac: 2,
                        posPre: "¤",
                        posSuf: "",
                        negPre: "(¤",
                        negSuf: ")",
                        gSize: 3,
                        lgSize: 3
                    }],
                    CURRENCY_SYM: "$"
                },
                DATETIME_FORMATS: {
                    MONTH: "January,February,March,April,May,June,July,August,September,October,November,December".split(","),
                    SHORTMONTH: "Jan,Feb,Mar,Apr,May,Jun,Jul,Aug,Sep,Oct,Nov,Dec".split(","),
                    DAY: "Sunday,Monday,Tuesday,Wednesday,Thursday,Friday,Saturday".split(","),
                    SHORTDAY: "Sun,Mon,Tue,Wed,Thu,Fri,Sat".split(","),
                    AMPMS: ["AM", "PM"],
                    medium: "MMM d, y h:mm:ss a",
                    "short": "M/d/yy h:mm a",
                    fullDate: "EEEE, MMMM d, y",
                    longDate: "MMMM d, y",
                    mediumDate: "MMM d, y",
                    shortDate: "M/d/yy",
                    mediumTime: "h:mm:ss a",
                    shortTime: "h:mm a",
                    ERANAMES: ["Before Christ", "Anno Domini"],
                    ERAS: ["BC", "AD"]
                },
                pluralCat: function(num) {
                    return 1 === num ? "one" : "other"
                }
            }
        }
    }

    function encodePath(path) {
        for (var segments = path.split("/"), i = segments.length; i--;) segments[i] = encodeUriSegment(segments[i]);
        return segments.join("/")
    }

    function parseAbsoluteUrl(absoluteUrl, locationObj) {
        var parsedUrl = urlResolve(absoluteUrl);
        locationObj.$$protocol = parsedUrl.protocol, locationObj.$$host = parsedUrl.hostname, locationObj.$$port = toInt(parsedUrl.port) || DEFAULT_PORTS[parsedUrl.protocol] || null
    }

    function parseAppUrl(relativeUrl, locationObj) {
        var prefixed = "/" !== relativeUrl.charAt(0);
        prefixed && (relativeUrl = "/" + relativeUrl);
        var match = urlResolve(relativeUrl);
        locationObj.$$path = decodeURIComponent(prefixed && "/" === match.pathname.charAt(0) ? match.pathname.substring(1) : match.pathname), locationObj.$$search = parseKeyValue(match.search), locationObj.$$hash = decodeURIComponent(match.hash), locationObj.$$path && "/" != locationObj.$$path.charAt(0) && (locationObj.$$path = "/" + locationObj.$$path)
    }

    function beginsWith(begin, whole) {
        if (0 === whole.indexOf(begin)) return whole.substr(begin.length)
    }

    function stripHash(url) {
        var index = url.indexOf("#");
        return index == -1 ? url : url.substr(0, index)
    }

    function trimEmptyHash(url) {
        return url.replace(/(#.+)|#$/, "$1")
    }

    function stripFile(url) {
        return url.substr(0, stripHash(url).lastIndexOf("/") + 1)
    }

    function serverBase(url) {
        return url.substring(0, url.indexOf("/", url.indexOf("//") + 2))
    }

    function LocationHtml5Url(appBase, basePrefix) {
        this.$$html5 = !0,
            basePrefix = basePrefix || "";
        var appBaseNoFile = stripFile(appBase);
        parseAbsoluteUrl(appBase, this), this.$$parse = function(url) {
            var pathUrl = beginsWith(appBaseNoFile, url);
            if (!isString(pathUrl)) throw $locationMinErr("ipthprfx", 'Invalid url "{0}", missing path prefix "{1}".', url, appBaseNoFile);
            parseAppUrl(pathUrl, this), this.$$path || (this.$$path = "/"), this.$$compose()
        }, this.$$compose = function() {
            var search = toKeyValue(this.$$search),
                hash = this.$$hash ? "#" + encodeUriSegment(this.$$hash) : "";
            this.$$url = encodePath(this.$$path) + (search ? "?" + search : "") + hash, this.$$absUrl = appBaseNoFile + this.$$url.substr(1)
        }, this.$$parseLinkUrl = function(url, relHref) {
            if (relHref && "#" === relHref[0]) return this.hash(relHref.slice(1)), !0;
            var appUrl, prevAppUrl, rewrittenUrl;
            return (appUrl = beginsWith(appBase, url)) !== undefined ? (prevAppUrl = appUrl, rewrittenUrl = (appUrl = beginsWith(basePrefix, appUrl)) !== undefined ? appBaseNoFile + (beginsWith("/", appUrl) || appUrl) : appBase + prevAppUrl) : (appUrl = beginsWith(appBaseNoFile, url)) !== undefined ? rewrittenUrl = appBaseNoFile + appUrl : appBaseNoFile == url + "/" && (rewrittenUrl = appBaseNoFile), rewrittenUrl && this.$$parse(rewrittenUrl), !!rewrittenUrl
        }
    }

    function LocationHashbangUrl(appBase, hashPrefix) {
        var appBaseNoFile = stripFile(appBase);
        parseAbsoluteUrl(appBase, this), this.$$parse = function(url) {
            function removeWindowsDriveName(path, url, base) {
                var firstPathSegmentMatch, windowsFilePathExp = /^\/[A-Z]:(\/.*)/;
                return 0 === url.indexOf(base) && (url = url.replace(base, "")), windowsFilePathExp.exec(url) ? path : (firstPathSegmentMatch = windowsFilePathExp.exec(path), firstPathSegmentMatch ? firstPathSegmentMatch[1] : path)
            }
            var withoutHashUrl, withoutBaseUrl = beginsWith(appBase, url) || beginsWith(appBaseNoFile, url);
            "#" === withoutBaseUrl.charAt(0) ? (withoutHashUrl = beginsWith(hashPrefix, withoutBaseUrl), isUndefined(withoutHashUrl) && (withoutHashUrl = withoutBaseUrl)) : withoutHashUrl = this.$$html5 ? withoutBaseUrl : "", parseAppUrl(withoutHashUrl, this), this.$$path = removeWindowsDriveName(this.$$path, withoutHashUrl, appBase), this.$$compose()
        }, this.$$compose = function() {
            var search = toKeyValue(this.$$search),
                hash = this.$$hash ? "#" + encodeUriSegment(this.$$hash) : "";
            this.$$url = encodePath(this.$$path) + (search ? "?" + search : "") + hash, this.$$absUrl = appBase + (this.$$url ? hashPrefix + this.$$url : "")
        }, this.$$parseLinkUrl = function(url, relHref) {
            return stripHash(appBase) == stripHash(url) && (this.$$parse(url), !0)
        }
    }

    function LocationHashbangInHtml5Url(appBase, hashPrefix) {
        this.$$html5 = !0, LocationHashbangUrl.apply(this, arguments);
        var appBaseNoFile = stripFile(appBase);
        this.$$parseLinkUrl = function(url, relHref) {
            if (relHref && "#" === relHref[0]) return this.hash(relHref.slice(1)), !0;
            var rewrittenUrl, appUrl;
            return appBase == stripHash(url) ? rewrittenUrl = url : (appUrl = beginsWith(appBaseNoFile, url)) ? rewrittenUrl = appBase + hashPrefix + appUrl : appBaseNoFile === url + "/" && (rewrittenUrl = appBaseNoFile), rewrittenUrl && this.$$parse(rewrittenUrl), !!rewrittenUrl
        }, this.$$compose = function() {
            var search = toKeyValue(this.$$search),
                hash = this.$$hash ? "#" + encodeUriSegment(this.$$hash) : "";
            this.$$url = encodePath(this.$$path) + (search ? "?" + search : "") + hash, this.$$absUrl = appBase + hashPrefix + this.$$url
        }
    }

    function locationGetter(property) {
        return function() {
            return this[property]
        }
    }

    function locationGetterSetter(property, preprocess) {
        return function(value) {
            return isUndefined(value) ? this[property] : (this[property] = preprocess(value), this.$$compose(), this)
        }
    }

    function $LocationProvider() {
        var hashPrefix = "",
            html5Mode = {
                enabled: !1,
                requireBase: !0,
                rewriteLinks: !0
            };
        this.hashPrefix = function(prefix) {
            return isDefined(prefix) ? (hashPrefix = prefix, this) : hashPrefix
        }, this.html5Mode = function(mode) {
            return isBoolean(mode) ? (html5Mode.enabled = mode, this) : isObject(mode) ? (isBoolean(mode.enabled) && (html5Mode.enabled = mode.enabled), isBoolean(mode.requireBase) && (html5Mode.requireBase = mode.requireBase), isBoolean(mode.rewriteLinks) && (html5Mode.rewriteLinks = mode.rewriteLinks), this) : html5Mode
        }, this.$get = ["$rootScope", "$browser", "$sniffer", "$rootElement", "$window", function($rootScope, $browser, $sniffer, $rootElement, $window) {
            function setBrowserUrlWithFallback(url, replace, state) {
                var oldUrl = $location.url(),
                    oldState = $location.$$state;
                try {
                    $browser.url(url, replace, state), $location.$$state = $browser.state()
                } catch (e) {
                    throw $location.url(oldUrl), $location.$$state = oldState, e
                }
            }

            function afterLocationChange(oldUrl, oldState) {
                $rootScope.$broadcast("$locationChangeSuccess", $location.absUrl(), oldUrl, $location.$$state, oldState)
            }
            var $location, LocationMode, appBase, baseHref = $browser.baseHref(),
                initialUrl = $browser.url();
            if (html5Mode.enabled) {
                if (!baseHref && html5Mode.requireBase) throw $locationMinErr("nobase", "$location in HTML5 mode requires a <base> tag to be present!");
                appBase = serverBase(initialUrl) + (baseHref || "/"), LocationMode = $sniffer.history ? LocationHtml5Url : LocationHashbangInHtml5Url
            } else appBase = stripHash(initialUrl), LocationMode = LocationHashbangUrl;
            $location = new LocationMode(appBase, "#" + hashPrefix), $location.$$parseLinkUrl(initialUrl, initialUrl), $location.$$state = $browser.state();
            var IGNORE_URI_REGEXP = /^\s*(javascript|mailto):/i;
            $rootElement.on("click", function(event) {
                if (html5Mode.rewriteLinks && !event.ctrlKey && !event.metaKey && !event.shiftKey && 2 != event.which && 2 != event.button) {
                    for (var elm = jqLite(event.target);
                        "a" !== nodeName_(elm[0]);)
                        if (elm[0] === $rootElement[0] || !(elm = elm.parent())[0]) return;
                    var absHref = elm.prop("href"),
                        relHref = elm.attr("href") || elm.attr("xlink:href");
                    isObject(absHref) && "[object SVGAnimatedString]" === absHref.toString() && (absHref = urlResolve(absHref.animVal).href), IGNORE_URI_REGEXP.test(absHref) || !absHref || elm.attr("target") || event.isDefaultPrevented() || $location.$$parseLinkUrl(absHref, relHref) && (event.preventDefault(), $location.absUrl() != $browser.url() && ($rootScope.$apply(), $window.angular["ff-684208-preventDefault"] = !0))
                }
            }), trimEmptyHash($location.absUrl()) != trimEmptyHash(initialUrl) && $browser.url($location.absUrl(), !0);
            var initializing = !0;
            return $browser.onUrlChange(function(newUrl, newState) {
                $rootScope.$evalAsync(function() {
                    var defaultPrevented, oldUrl = $location.absUrl(),
                        oldState = $location.$$state;
                    $location.$$parse(newUrl), $location.$$state = newState, defaultPrevented = $rootScope.$broadcast("$locationChangeStart", newUrl, oldUrl, newState, oldState).defaultPrevented, $location.absUrl() === newUrl && (defaultPrevented ? ($location.$$parse(oldUrl), $location.$$state = oldState, setBrowserUrlWithFallback(oldUrl, !1, oldState)) : (initializing = !1, afterLocationChange(oldUrl, oldState)))
                }), $rootScope.$$phase || $rootScope.$digest()
            }), $rootScope.$watch(function() {
                var oldUrl = trimEmptyHash($browser.url()),
                    newUrl = trimEmptyHash($location.absUrl()),
                    oldState = $browser.state(),
                    currentReplace = $location.$$replace,
                    urlOrStateChanged = oldUrl !== newUrl || $location.$$html5 && $sniffer.history && oldState !== $location.$$state;
                (initializing || urlOrStateChanged) && (initializing = !1, $rootScope.$evalAsync(function() {
                    var newUrl = $location.absUrl(),
                        defaultPrevented = $rootScope.$broadcast("$locationChangeStart", newUrl, oldUrl, $location.$$state, oldState).defaultPrevented;
                    $location.absUrl() === newUrl && (defaultPrevented ? ($location.$$parse(oldUrl), $location.$$state = oldState) : (urlOrStateChanged && setBrowserUrlWithFallback(newUrl, currentReplace, oldState === $location.$$state ? null : $location.$$state), afterLocationChange(oldUrl, oldState)))
                })), $location.$$replace = !1
            }), $location
        }]
    }

    function $LogProvider() {
        var debug = !0,
            self = this;
        this.debugEnabled = function(flag) {
            return isDefined(flag) ? (debug = flag, this) : debug
        }, this.$get = ["$window", function($window) {
            function formatError(arg) {
                return arg instanceof Error && (arg.stack ? arg = arg.message && arg.stack.indexOf(arg.message) === -1 ? "Error: " + arg.message + "\n" + arg.stack : arg.stack : arg.sourceURL && (arg = arg.message + "\n" + arg.sourceURL + ":" + arg.line)), arg
            }

            function consoleLog(type) {
                var console = $window.console || {},
                    logFn = console[type] || console.log || noop,
                    hasApply = !1;
                try {
                    hasApply = !!logFn.apply
                } catch (e) {}
                return hasApply ? function() {
                    var args = [];
                    return forEach(arguments, function(arg) {
                        args.push(formatError(arg))
                    }), logFn.apply(console, args)
                } : function(arg1, arg2) {
                    logFn(arg1, null == arg2 ? "" : arg2)
                }
            }
            return {
                log: consoleLog("log"),
                info: consoleLog("info"),
                warn: consoleLog("warn"),
                error: consoleLog("error"),
                debug: function() {
                    var fn = consoleLog("debug");
                    return function() {
                        debug && fn.apply(self, arguments)
                    }
                }()
            }
        }]
    }

    function ensureSafeMemberName(name, fullExpression) {
        if ("__defineGetter__" === name || "__defineSetter__" === name || "__lookupGetter__" === name || "__lookupSetter__" === name || "__proto__" === name) throw $parseMinErr("isecfld", "Attempting to access a disallowed field in Angular expressions! Expression: {0}", fullExpression);
        return name
    }

    function ensureSafeObject(obj, fullExpression) {
        if (obj) {
            if (obj.constructor === obj) throw $parseMinErr("isecfn", "Referencing Function in Angular expressions is disallowed! Expression: {0}", fullExpression);
            if (obj.window === obj) throw $parseMinErr("isecwindow", "Referencing the Window in Angular expressions is disallowed! Expression: {0}", fullExpression);
            if (obj.children && (obj.nodeName || obj.prop && obj.attr && obj.find)) throw $parseMinErr("isecdom", "Referencing DOM nodes in Angular expressions is disallowed! Expression: {0}", fullExpression);
            if (obj === Object) throw $parseMinErr("isecobj", "Referencing Object in Angular expressions is disallowed! Expression: {0}", fullExpression)
        }
        return obj
    }

    function ensureSafeFunction(obj, fullExpression) {
        if (obj) {
            if (obj.constructor === obj) throw $parseMinErr("isecfn", "Referencing Function in Angular expressions is disallowed! Expression: {0}", fullExpression);
            if (obj === CALL || obj === APPLY || obj === BIND) throw $parseMinErr("isecff", "Referencing call, apply or bind in Angular expressions is disallowed! Expression: {0}", fullExpression)
        }
    }

    function ifDefined(v, d) {
        return "undefined" != typeof v ? v : d
    }

    function plusFn(l, r) {
        return "undefined" == typeof l ? r : "undefined" == typeof r ? l : l + r
    }

    function isStateless($filter, filterName) {
        var fn = $filter(filterName);
        return !fn.$stateful
    }

    function findConstantAndWatchExpressions(ast, $filter) {
        var allConstants, argsToWatch;
        switch (ast.type) {
            case AST.Program:
                allConstants = !0, forEach(ast.body, function(expr) {
                    findConstantAndWatchExpressions(expr.expression, $filter), allConstants = allConstants && expr.expression.constant
                }), ast.constant = allConstants;
                break;
            case AST.Literal:
                ast.constant = !0, ast.toWatch = [];
                break;
            case AST.UnaryExpression:
                findConstantAndWatchExpressions(ast.argument, $filter), ast.constant = ast.argument.constant, ast.toWatch = ast.argument.toWatch;
                break;
            case AST.BinaryExpression:
                findConstantAndWatchExpressions(ast.left, $filter), findConstantAndWatchExpressions(ast.right, $filter), ast.constant = ast.left.constant && ast.right.constant, ast.toWatch = ast.left.toWatch.concat(ast.right.toWatch);
                break;
            case AST.LogicalExpression:
                findConstantAndWatchExpressions(ast.left, $filter), findConstantAndWatchExpressions(ast.right, $filter), ast.constant = ast.left.constant && ast.right.constant, ast.toWatch = ast.constant ? [] : [ast];
                break;
            case AST.ConditionalExpression:
                findConstantAndWatchExpressions(ast.test, $filter), findConstantAndWatchExpressions(ast.alternate, $filter), findConstantAndWatchExpressions(ast.consequent, $filter), ast.constant = ast.test.constant && ast.alternate.constant && ast.consequent.constant, ast.toWatch = ast.constant ? [] : [ast];
                break;
            case AST.Identifier:
                ast.constant = !1, ast.toWatch = [ast];
                break;
            case AST.MemberExpression:
                findConstantAndWatchExpressions(ast.object, $filter), ast.computed && findConstantAndWatchExpressions(ast.property, $filter), ast.constant = ast.object.constant && (!ast.computed || ast.property.constant), ast.toWatch = [ast];
                break;
            case AST.CallExpression:
                allConstants = !!ast.filter && isStateless($filter, ast.callee.name), argsToWatch = [], forEach(ast.arguments, function(expr) {
                    findConstantAndWatchExpressions(expr, $filter), allConstants = allConstants && expr.constant, expr.constant || argsToWatch.push.apply(argsToWatch, expr.toWatch)
                }), ast.constant = allConstants, ast.toWatch = ast.filter && isStateless($filter, ast.callee.name) ? argsToWatch : [ast];
                break;
            case AST.AssignmentExpression:
                findConstantAndWatchExpressions(ast.left, $filter), findConstantAndWatchExpressions(ast.right, $filter), ast.constant = ast.left.constant && ast.right.constant, ast.toWatch = [ast];
                break;
            case AST.ArrayExpression:
                allConstants = !0, argsToWatch = [], forEach(ast.elements, function(expr) {
                    findConstantAndWatchExpressions(expr, $filter), allConstants = allConstants && expr.constant, expr.constant || argsToWatch.push.apply(argsToWatch, expr.toWatch)
                }), ast.constant = allConstants, ast.toWatch = argsToWatch;
                break;
            case AST.ObjectExpression:
                allConstants = !0, argsToWatch = [], forEach(ast.properties, function(property) {
                    findConstantAndWatchExpressions(property.value, $filter), allConstants = allConstants && property.value.constant, property.value.constant || argsToWatch.push.apply(argsToWatch, property.value.toWatch)
                }), ast.constant = allConstants, ast.toWatch = argsToWatch;
                break;
            case AST.ThisExpression:
                ast.constant = !1, ast.toWatch = []
        }
    }

    function getInputs(body) {
        if (1 == body.length) {
            var lastExpression = body[0].expression,
                candidate = lastExpression.toWatch;
            return 1 !== candidate.length ? candidate : candidate[0] !== lastExpression ? candidate : undefined
        }
    }

    function isAssignable(ast) {
        return ast.type === AST.Identifier || ast.type === AST.MemberExpression
    }

    function assignableAST(ast) {
        if (1 === ast.body.length && isAssignable(ast.body[0].expression)) return {
            type: AST.AssignmentExpression,
            left: ast.body[0].expression,
            right: {
                type: AST.NGValueParameter
            },
            operator: "="
        }
    }

    function isLiteral(ast) {
        return 0 === ast.body.length || 1 === ast.body.length && (ast.body[0].expression.type === AST.Literal || ast.body[0].expression.type === AST.ArrayExpression || ast.body[0].expression.type === AST.ObjectExpression)
    }

    function isConstant(ast) {
        return ast.constant
    }

    function ASTCompiler(astBuilder, $filter) {
        this.astBuilder = astBuilder, this.$filter = $filter
    }

    function ASTInterpreter(astBuilder, $filter) {
        this.astBuilder = astBuilder, this.$filter = $filter
    }

    function setter(obj, path, setValue, fullExp) {
        ensureSafeObject(obj, fullExp);
        for (var key, element = path.split("."), i = 0; element.length > 1; i++) {
            key = ensureSafeMemberName(element.shift(), fullExp);
            var propertyObj = ensureSafeObject(obj[key], fullExp);
            propertyObj || (propertyObj = {}, obj[key] = propertyObj), obj = propertyObj
        }
        return key = ensureSafeMemberName(element.shift(), fullExp), ensureSafeObject(obj[key], fullExp), obj[key] = setValue, setValue
    }

    function isPossiblyDangerousMemberName(name) {
        return "constructor" == name
    }

    function getValueOf(value) {
        return isFunction(value.valueOf) ? value.valueOf() : objectValueOf.call(value)
    }

    function $ParseProvider() {
        var cacheDefault = createMap(),
            cacheExpensive = createMap();
        this.$get = ["$filter", "$sniffer", function($filter, $sniffer) {
            function expressionInputDirtyCheck(newValue, oldValueOfValue) {
                return null == newValue || null == oldValueOfValue ? newValue === oldValueOfValue : ("object" != typeof newValue || (newValue = getValueOf(newValue), "object" != typeof newValue)) && (newValue === oldValueOfValue || newValue !== newValue && oldValueOfValue !== oldValueOfValue)
            }

            function inputsWatchDelegate(scope, listener, objectEquality, parsedExpression, prettyPrintExpression) {
                var lastResult, inputExpressions = parsedExpression.inputs;
                if (1 === inputExpressions.length) {
                    var oldInputValueOf = expressionInputDirtyCheck;
                    return inputExpressions = inputExpressions[0], scope.$watch(function(scope) {
                        var newInputValue = inputExpressions(scope);
                        return expressionInputDirtyCheck(newInputValue, oldInputValueOf) || (lastResult = parsedExpression(scope, undefined, undefined, [newInputValue]), oldInputValueOf = newInputValue && getValueOf(newInputValue)), lastResult
                    }, listener, objectEquality, prettyPrintExpression)
                }
                for (var oldInputValueOfValues = [], oldInputValues = [], i = 0, ii = inputExpressions.length; i < ii; i++) oldInputValueOfValues[i] = expressionInputDirtyCheck, oldInputValues[i] = null;
                return scope.$watch(function(scope) {
                    for (var changed = !1, i = 0, ii = inputExpressions.length; i < ii; i++) {
                        var newInputValue = inputExpressions[i](scope);
                        (changed || (changed = !expressionInputDirtyCheck(newInputValue, oldInputValueOfValues[i]))) && (oldInputValues[i] = newInputValue, oldInputValueOfValues[i] = newInputValue && getValueOf(newInputValue))
                    }
                    return changed && (lastResult = parsedExpression(scope, undefined, undefined, oldInputValues)), lastResult
                }, listener, objectEquality, prettyPrintExpression)
            }

            function oneTimeWatchDelegate(scope, listener, objectEquality, parsedExpression) {
                var unwatch, lastValue;
                return unwatch = scope.$watch(function(scope) {
                    return parsedExpression(scope)
                }, function(value, old, scope) {
                    lastValue = value, isFunction(listener) && listener.apply(this, arguments), isDefined(value) && scope.$$postDigest(function() {
                        isDefined(lastValue) && unwatch()
                    })
                }, objectEquality)
            }

            function oneTimeLiteralWatchDelegate(scope, listener, objectEquality, parsedExpression) {
                function isAllDefined(value) {
                    var allDefined = !0;
                    return forEach(value, function(val) {
                        isDefined(val) || (allDefined = !1)
                    }), allDefined
                }
                var unwatch, lastValue;
                return unwatch = scope.$watch(function(scope) {
                    return parsedExpression(scope)
                }, function(value, old, scope) {
                    lastValue = value, isFunction(listener) && listener.call(this, value, old, scope), isAllDefined(value) && scope.$$postDigest(function() {
                        isAllDefined(lastValue) && unwatch()
                    })
                }, objectEquality)
            }

            function constantWatchDelegate(scope, listener, objectEquality, parsedExpression) {
                var unwatch;
                return unwatch = scope.$watch(function(scope) {
                    return parsedExpression(scope)
                }, function(value, old, scope) {
                    isFunction(listener) && listener.apply(this, arguments), unwatch()
                }, objectEquality)
            }

            function addInterceptor(parsedExpression, interceptorFn) {
                if (!interceptorFn) return parsedExpression;
                var watchDelegate = parsedExpression.$$watchDelegate,
                    regularWatch = watchDelegate !== oneTimeLiteralWatchDelegate && watchDelegate !== oneTimeWatchDelegate,
                    fn = regularWatch ? function(scope, locals, assign, inputs) {
                        var value = parsedExpression(scope, locals, assign, inputs);
                        return interceptorFn(value, scope, locals)
                    } : function(scope, locals, assign, inputs) {
                        var value = parsedExpression(scope, locals, assign, inputs),
                            result = interceptorFn(value, scope, locals);
                        return isDefined(value) ? result : value
                    };
                return parsedExpression.$$watchDelegate && parsedExpression.$$watchDelegate !== inputsWatchDelegate ? fn.$$watchDelegate = parsedExpression.$$watchDelegate : interceptorFn.$stateful || (fn.$$watchDelegate = inputsWatchDelegate, fn.inputs = parsedExpression.inputs ? parsedExpression.inputs : [parsedExpression]), fn
            }
            var $parseOptions = {
                    csp: $sniffer.csp,
                    expensiveChecks: !1
                },
                $parseOptionsExpensive = {
                    csp: $sniffer.csp,
                    expensiveChecks: !0
                };
            return function(exp, interceptorFn, expensiveChecks) {
                var parsedExpression, oneTime, cacheKey;
                switch (typeof exp) {
                    case "string":
                        exp = exp.trim(), cacheKey = exp;
                        var cache = expensiveChecks ? cacheExpensive : cacheDefault;
                        if (parsedExpression = cache[cacheKey], !parsedExpression) {
                            ":" === exp.charAt(0) && ":" === exp.charAt(1) && (oneTime = !0, exp = exp.substring(2));
                            var parseOptions = expensiveChecks ? $parseOptionsExpensive : $parseOptions,
                                lexer = new Lexer(parseOptions),
                                parser = new Parser(lexer, $filter, parseOptions);
                            parsedExpression = parser.parse(exp), parsedExpression.constant ? parsedExpression.$$watchDelegate = constantWatchDelegate : oneTime ? parsedExpression.$$watchDelegate = parsedExpression.literal ? oneTimeLiteralWatchDelegate : oneTimeWatchDelegate : parsedExpression.inputs && (parsedExpression.$$watchDelegate = inputsWatchDelegate), cache[cacheKey] = parsedExpression
                        }
                        return addInterceptor(parsedExpression, interceptorFn);
                    case "function":
                        return addInterceptor(exp, interceptorFn);
                    default:
                        return noop
                }
            }
        }]
    }

    function $QProvider() {
        this.$get = ["$rootScope", "$exceptionHandler", function($rootScope, $exceptionHandler) {
            return qFactory(function(callback) {
                $rootScope.$evalAsync(callback)
            }, $exceptionHandler)
        }]
    }

    function $$QProvider() {
        this.$get = ["$browser", "$exceptionHandler", function($browser, $exceptionHandler) {
            return qFactory(function(callback) {
                $browser.defer(callback)
            }, $exceptionHandler)
        }]
    }

    function qFactory(nextTick, exceptionHandler) {
        function callOnce(self, resolveFn, rejectFn) {
            function wrap(fn) {
                return function(value) {
                    called || (called = !0, fn.call(self, value))
                }
            }
            var called = !1;
            return [wrap(resolveFn), wrap(rejectFn)]
        }

        function Promise() {
            this.$$state = {
                status: 0
            }
        }

        function simpleBind(context, fn) {
            return function(value) {
                fn.call(context, value)
            }
        }

        function processQueue(state) {
            var fn, deferred, pending;
            pending = state.pending, state.processScheduled = !1, state.pending = undefined;
            for (var i = 0, ii = pending.length; i < ii; ++i) {
                deferred = pending[i][0], fn = pending[i][state.status];
                try {
                    isFunction(fn) ? deferred.resolve(fn(state.value)) : 1 === state.status ? deferred.resolve(state.value) : deferred.reject(state.value)
                } catch (e) {
                    deferred.reject(e), exceptionHandler(e)
                }
            }
        }

        function scheduleProcessQueue(state) {
            !state.processScheduled && state.pending && (state.processScheduled = !0, nextTick(function() {
                processQueue(state)
            }))
        }

        function Deferred() {
            this.promise = new Promise, this.resolve = simpleBind(this, this.resolve), this.reject = simpleBind(this, this.reject), this.notify = simpleBind(this, this.notify)
        }

        function all(promises) {
            var deferred = new Deferred,
                counter = 0,
                results = isArray(promises) ? [] : {};
            return forEach(promises, function(promise, key) {
                counter++, when(promise).then(function(value) {
                    results.hasOwnProperty(key) || (results[key] = value, --counter || deferred.resolve(results))
                }, function(reason) {
                    results.hasOwnProperty(key) || deferred.reject(reason)
                })
            }), 0 === counter && deferred.resolve(results), deferred.promise
        }
        var $qMinErr = minErr("$q", TypeError),
            defer = function() {
                return new Deferred
            };
        Promise.prototype = {
            then: function(onFulfilled, onRejected, progressBack) {
                var result = new Deferred;
                return this.$$state.pending = this.$$state.pending || [], this.$$state.pending.push([result, onFulfilled, onRejected, progressBack]), this.$$state.status > 0 && scheduleProcessQueue(this.$$state), result.promise
            },
            "catch": function(callback) {
                return this.then(null, callback)
            },
            "finally": function(callback, progressBack) {
                return this.then(function(value) {
                    return handleCallback(value, !0, callback)
                }, function(error) {
                    return handleCallback(error, !1, callback)
                }, progressBack)
            }
        }, Deferred.prototype = {
            resolve: function(val) {
                this.promise.$$state.status || (val === this.promise ? this.$$reject($qMinErr("qcycle", "Expected promise to be resolved with value other than itself '{0}'", val)) : this.$$resolve(val))
            },
            $$resolve: function(val) {
                var then, fns;
                fns = callOnce(this, this.$$resolve, this.$$reject);
                try {
                    (isObject(val) || isFunction(val)) && (then = val && val.then), isFunction(then) ? (this.promise.$$state.status = -1, then.call(val, fns[0], fns[1], this.notify)) : (this.promise.$$state.value = val, this.promise.$$state.status = 1, scheduleProcessQueue(this.promise.$$state))
                } catch (e) {
                    fns[1](e), exceptionHandler(e)
                }
            },
            reject: function(reason) {
                this.promise.$$state.status || this.$$reject(reason)
            },
            $$reject: function(reason) {
                this.promise.$$state.value = reason, this.promise.$$state.status = 2, scheduleProcessQueue(this.promise.$$state)
            },
            notify: function(progress) {
                var callbacks = this.promise.$$state.pending;
                this.promise.$$state.status <= 0 && callbacks && callbacks.length && nextTick(function() {
                    for (var callback, result, i = 0, ii = callbacks.length; i < ii; i++) {
                        result = callbacks[i][0], callback = callbacks[i][3];
                        try {
                            result.notify(isFunction(callback) ? callback(progress) : progress)
                        } catch (e) {
                            exceptionHandler(e)
                        }
                    }
                })
            }
        };
        var reject = function(reason) {
                var result = new Deferred;
                return result.reject(reason), result.promise
            },
            makePromise = function(value, resolved) {
                var result = new Deferred;
                return resolved ? result.resolve(value) : result.reject(value), result.promise
            },
            handleCallback = function(value, isResolved, callback) {
                var callbackOutput = null;
                try {
                    isFunction(callback) && (callbackOutput = callback())
                } catch (e) {
                    return makePromise(e, !1)
                }
                return isPromiseLike(callbackOutput) ? callbackOutput.then(function() {
                    return makePromise(value, isResolved)
                }, function(error) {
                    return makePromise(error, !1)
                }) : makePromise(value, isResolved)
            },
            when = function(value, callback, errback, progressBack) {
                var result = new Deferred;
                return result.resolve(value), result.promise.then(callback, errback, progressBack)
            },
            $Q = function Q(resolver) {
                function resolveFn(value) {
                    deferred.resolve(value)
                }

                function rejectFn(reason) {
                    deferred.reject(reason)
                }
                if (!isFunction(resolver)) throw $qMinErr("norslvr", "Expected resolverFn, got '{0}'", resolver);
                if (!(this instanceof Q)) return new Q(resolver);
                var deferred = new Deferred;
                return resolver(resolveFn, rejectFn), deferred.promise
            };
        return $Q.defer = defer, $Q.reject = reject, $Q.when = when, $Q.all = all, $Q
    }

    function $$RAFProvider() {
        this.$get = ["$window", "$timeout", function($window, $timeout) {
            var requestAnimationFrame = $window.requestAnimationFrame || $window.webkitRequestAnimationFrame,
                cancelAnimationFrame = $window.cancelAnimationFrame || $window.webkitCancelAnimationFrame || $window.webkitCancelRequestAnimationFrame,
                rafSupported = !!requestAnimationFrame,
                raf = rafSupported ? function(fn) {
                    var id = requestAnimationFrame(fn);
                    return function() {
                        cancelAnimationFrame(id)
                    }
                } : function(fn) {
                    var timer = $timeout(fn, 16.66, !1);
                    return function() {
                        $timeout.cancel(timer)
                    }
                };
            return raf.supported = rafSupported, raf
        }]
    }

    function $RootScopeProvider() {
        function createChildScopeClass(parent) {
            function ChildScope() {
                this.$$watchers = this.$$nextSibling = this.$$childHead = this.$$childTail = null, this.$$listeners = {}, this.$$listenerCount = {}, this.$$watchersCount = 0, this.$id = nextUid(), this.$$ChildScope = null
            }
            return ChildScope.prototype = parent, ChildScope
        }
        var TTL = 10,
            $rootScopeMinErr = minErr("$rootScope"),
            lastDirtyWatch = null,
            applyAsyncId = null;
        this.digestTtl = function(value) {
            return arguments.length && (TTL = value), TTL
        }, this.$get = ["$injector", "$exceptionHandler", "$parse", "$browser", function($injector, $exceptionHandler, $parse, $browser) {
            function destroyChildScope($event) {
                $event.currentScope.$$destroyed = !0
            }

            function Scope() {
                this.$id = nextUid(), this.$$phase = this.$parent = this.$$watchers = this.$$nextSibling = this.$$prevSibling = this.$$childHead = this.$$childTail = null, this.$root = this, this.$$destroyed = !1, this.$$listeners = {}, this.$$listenerCount = {}, this.$$watchersCount = 0, this.$$isolateBindings = null
            }

            function beginPhase(phase) {
                if ($rootScope.$$phase) throw $rootScopeMinErr("inprog", "{0} already in progress", $rootScope.$$phase);
                $rootScope.$$phase = phase
            }

            function clearPhase() {
                $rootScope.$$phase = null
            }

            function incrementWatchersCount(current, count) {
                do current.$$watchersCount += count; while (current = current.$parent)
            }

            function decrementListenerCount(current, count, name) {
                do current.$$listenerCount[name] -= count, 0 === current.$$listenerCount[name] && delete current.$$listenerCount[name]; while (current = current.$parent)
            }

            function initWatchVal() {}

            function flushApplyAsync() {
                for (; applyAsyncQueue.length;) try {
                    applyAsyncQueue.shift()()
                } catch (e) {
                    $exceptionHandler(e)
                }
                applyAsyncId = null
            }

            function scheduleApplyAsync() {
                null === applyAsyncId && (applyAsyncId = $browser.defer(function() {
                    $rootScope.$apply(flushApplyAsync)
                }))
            }
            Scope.prototype = {
                constructor: Scope,
                $new: function(isolate, parent) {
                    var child;
                    return parent = parent || this, isolate ? (child = new Scope, child.$root = this.$root) : (this.$$ChildScope || (this.$$ChildScope = createChildScopeClass(this)), child = new this.$$ChildScope), child.$parent = parent, child.$$prevSibling = parent.$$childTail, parent.$$childHead ? (parent.$$childTail.$$nextSibling = child, parent.$$childTail = child) : parent.$$childHead = parent.$$childTail = child, (isolate || parent != this) && child.$on("$destroy", destroyChildScope), child
                },
                $watch: function(watchExp, listener, objectEquality, prettyPrintExpression) {
                    var get = $parse(watchExp);
                    if (get.$$watchDelegate) return get.$$watchDelegate(this, listener, objectEquality, get, watchExp);
                    var scope = this,
                        array = scope.$$watchers,
                        watcher = {
                            fn: listener,
                            last: initWatchVal,
                            get: get,
                            exp: prettyPrintExpression || watchExp,
                            eq: !!objectEquality
                        };
                    return lastDirtyWatch = null, isFunction(listener) || (watcher.fn = noop), array || (array = scope.$$watchers = []), array.unshift(watcher), incrementWatchersCount(this, 1),
                        function() {
                            arrayRemove(array, watcher) >= 0 && incrementWatchersCount(scope, -1), lastDirtyWatch = null
                        }
                },
                $watchGroup: function(watchExpressions, listener) {
                    function watchGroupAction() {
                        changeReactionScheduled = !1, firstRun ? (firstRun = !1, listener(newValues, newValues, self)) : listener(newValues, oldValues, self)
                    }
                    var oldValues = new Array(watchExpressions.length),
                        newValues = new Array(watchExpressions.length),
                        deregisterFns = [],
                        self = this,
                        changeReactionScheduled = !1,
                        firstRun = !0;
                    if (!watchExpressions.length) {
                        var shouldCall = !0;
                        return self.$evalAsync(function() {
                                shouldCall && listener(newValues, newValues, self)
                            }),
                            function() {
                                shouldCall = !1
                            }
                    }
                    return 1 === watchExpressions.length ? this.$watch(watchExpressions[0], function(value, oldValue, scope) {
                        newValues[0] = value, oldValues[0] = oldValue, listener(newValues, value === oldValue ? newValues : oldValues, scope)
                    }) : (forEach(watchExpressions, function(expr, i) {
                        var unwatchFn = self.$watch(expr, function(value, oldValue) {
                            newValues[i] = value, oldValues[i] = oldValue, changeReactionScheduled || (changeReactionScheduled = !0, self.$evalAsync(watchGroupAction))
                        });
                        deregisterFns.push(unwatchFn)
                    }), function() {
                        for (; deregisterFns.length;) deregisterFns.shift()()
                    })
                },
                $watchCollection: function(obj, listener) {
                    function $watchCollectionInterceptor(_value) {
                        newValue = _value;
                        var newLength, key, bothNaN, newItem, oldItem;
                        if (!isUndefined(newValue)) {
                            if (isObject(newValue))
                                if (isArrayLike(newValue)) {
                                    oldValue !== internalArray && (oldValue = internalArray, oldLength = oldValue.length = 0, changeDetected++), newLength = newValue.length, oldLength !== newLength && (changeDetected++, oldValue.length = oldLength = newLength);
                                    for (var i = 0; i < newLength; i++) oldItem = oldValue[i], newItem = newValue[i], bothNaN = oldItem !== oldItem && newItem !== newItem, bothNaN || oldItem === newItem || (changeDetected++, oldValue[i] = newItem)
                                } else {
                                    oldValue !== internalObject && (oldValue = internalObject = {}, oldLength = 0, changeDetected++), newLength = 0;
                                    for (key in newValue) newValue.hasOwnProperty(key) && (newLength++, newItem = newValue[key], oldItem = oldValue[key], key in oldValue ? (bothNaN = oldItem !== oldItem && newItem !== newItem, bothNaN || oldItem === newItem || (changeDetected++, oldValue[key] = newItem)) : (oldLength++, oldValue[key] = newItem, changeDetected++));
                                    if (oldLength > newLength) {
                                        changeDetected++;
                                        for (key in oldValue) newValue.hasOwnProperty(key) || (oldLength--, delete oldValue[key])
                                    }
                                }
                            else oldValue !== newValue && (oldValue = newValue, changeDetected++);
                            return changeDetected
                        }
                    }

                    function $watchCollectionAction() {
                        if (initRun ? (initRun = !1, listener(newValue, newValue, self)) : listener(newValue, veryOldValue, self), trackVeryOldValue)
                            if (isObject(newValue))
                                if (isArrayLike(newValue)) {
                                    veryOldValue = new Array(newValue.length);
                                    for (var i = 0; i < newValue.length; i++) veryOldValue[i] = newValue[i]
                                } else {
                                    veryOldValue = {};
                                    for (var key in newValue) hasOwnProperty.call(newValue, key) && (veryOldValue[key] = newValue[key])
                                }
                        else veryOldValue = newValue
                    }
                    $watchCollectionInterceptor.$stateful = !0;
                    var newValue, oldValue, veryOldValue, self = this,
                        trackVeryOldValue = listener.length > 1,
                        changeDetected = 0,
                        changeDetector = $parse(obj, $watchCollectionInterceptor),
                        internalArray = [],
                        internalObject = {},
                        initRun = !0,
                        oldLength = 0;
                    return this.$watch(changeDetector, $watchCollectionAction)
                },
                $digest: function() {
                    var watch, value, last, watchers, length, dirty, next, current, logIdx, asyncTask, ttl = TTL,
                        target = this,
                        watchLog = [];
                    beginPhase("$digest"), $browser.$$checkUrlChange(), this === $rootScope && null !== applyAsyncId && ($browser.defer.cancel(applyAsyncId), flushApplyAsync()), lastDirtyWatch = null;
                    do {
                        for (dirty = !1, current = target; asyncQueue.length;) {
                            try {
                                asyncTask = asyncQueue.shift(), asyncTask.scope.$eval(asyncTask.expression, asyncTask.locals)
                            } catch (e) {
                                $exceptionHandler(e)
                            }
                            lastDirtyWatch = null
                        }
                        traverseScopesLoop: do {
                            if (watchers = current.$$watchers)
                                for (length = watchers.length; length--;) try {
                                    if (watch = watchers[length])
                                        if ((value = watch.get(current)) === (last = watch.last) || (watch.eq ? equals(value, last) : "number" == typeof value && "number" == typeof last && isNaN(value) && isNaN(last))) {
                                            if (watch === lastDirtyWatch) {
                                                dirty = !1;
                                                break traverseScopesLoop
                                            }
                                        } else dirty = !0, lastDirtyWatch = watch, watch.last = watch.eq ? copy(value, null) : value, watch.fn(value, last === initWatchVal ? value : last, current), ttl < 5 && (logIdx = 4 - ttl, watchLog[logIdx] || (watchLog[logIdx] = []), watchLog[logIdx].push({
                                            msg: isFunction(watch.exp) ? "fn: " + (watch.exp.name || watch.exp.toString()) : watch.exp,
                                            newVal: value,
                                            oldVal: last
                                        }))
                                } catch (e) {
                                    $exceptionHandler(e)
                                }
                            if (!(next = current.$$watchersCount && current.$$childHead || current !== target && current.$$nextSibling))
                                for (; current !== target && !(next = current.$$nextSibling);) current = current.$parent
                        } while (current = next);
                        if ((dirty || asyncQueue.length) && !ttl--) throw clearPhase(), $rootScopeMinErr("infdig", "{0} $digest() iterations reached. Aborting!\nWatchers fired in the last 5 iterations: {1}", TTL, watchLog)
                    } while (dirty || asyncQueue.length);
                    for (clearPhase(); postDigestQueue.length;) try {
                        postDigestQueue.shift()()
                    } catch (e) {
                        $exceptionHandler(e)
                    }
                },
                $destroy: function() {
                    if (!this.$$destroyed) {
                        var parent = this.$parent;
                        if (this.$broadcast("$destroy"), this.$$destroyed = !0, this !== $rootScope) {
                            incrementWatchersCount(this, -this.$$watchersCount);
                            for (var eventName in this.$$listenerCount) decrementListenerCount(this, this.$$listenerCount[eventName], eventName);
                            parent.$$childHead == this && (parent.$$childHead = this.$$nextSibling), parent.$$childTail == this && (parent.$$childTail = this.$$prevSibling), this.$$prevSibling && (this.$$prevSibling.$$nextSibling = this.$$nextSibling), this.$$nextSibling && (this.$$nextSibling.$$prevSibling = this.$$prevSibling), this.$destroy = this.$digest = this.$apply = this.$evalAsync = this.$applyAsync = noop, this.$on = this.$watch = this.$watchGroup = function() {
                                return noop
                            }, this.$$listeners = {}, this.$parent = this.$$nextSibling = this.$$prevSibling = this.$$childHead = this.$$childTail = this.$root = this.$$watchers = null
                        }
                    }
                },
                $eval: function(expr, locals) {
                    return $parse(expr)(this, locals)
                },
                $evalAsync: function(expr, locals) {
                    $rootScope.$$phase || asyncQueue.length || $browser.defer(function() {
                        asyncQueue.length && $rootScope.$digest()
                    }), asyncQueue.push({
                        scope: this,
                        expression: expr,
                        locals: locals
                    })
                },
                $$postDigest: function(fn) {
                    postDigestQueue.push(fn)
                },
                $apply: function(expr) {
                    try {
                        return beginPhase("$apply"), this.$eval(expr)
                    } catch (e) {
                        $exceptionHandler(e)
                    } finally {
                        clearPhase();
                        try {
                            $rootScope.$digest()
                        } catch (e) {
                            throw $exceptionHandler(e), e
                        }
                    }
                },
                $applyAsync: function(expr) {
                    function $applyAsyncExpression() {
                        scope.$eval(expr)
                    }
                    var scope = this;
                    expr && applyAsyncQueue.push($applyAsyncExpression), scheduleApplyAsync()
                },
                $on: function(name, listener) {
                    var namedListeners = this.$$listeners[name];
                    namedListeners || (this.$$listeners[name] = namedListeners = []), namedListeners.push(listener);
                    var current = this;
                    do current.$$listenerCount[name] || (current.$$listenerCount[name] = 0), current.$$listenerCount[name]++; while (current = current.$parent);
                    var self = this;
                    return function() {
                        var indexOfListener = namedListeners.indexOf(listener);
                        indexOfListener !== -1 && (namedListeners[indexOfListener] = null, decrementListenerCount(self, 1, name))
                    }
                },
                $emit: function(name, args) {
                    var namedListeners, i, length, empty = [],
                        scope = this,
                        stopPropagation = !1,
                        event = {
                            name: name,
                            targetScope: scope,
                            stopPropagation: function() {
                                stopPropagation = !0
                            },
                            preventDefault: function() {
                                event.defaultPrevented = !0
                            },
                            defaultPrevented: !1
                        },
                        listenerArgs = concat([event], arguments, 1);
                    do {
                        for (namedListeners = scope.$$listeners[name] || empty, event.currentScope = scope, i = 0, length = namedListeners.length; i < length; i++)
                            if (namedListeners[i]) try {
                                namedListeners[i].apply(null, listenerArgs)
                            } catch (e) {
                                $exceptionHandler(e)
                            } else namedListeners.splice(i, 1), i--, length--;
                        if (stopPropagation) return event.currentScope = null, event;
                        scope = scope.$parent
                    } while (scope);
                    return event.currentScope = null, event
                },
                $broadcast: function(name, args) {
                    var target = this,
                        current = target,
                        next = target,
                        event = {
                            name: name,
                            targetScope: target,
                            preventDefault: function() {
                                event.defaultPrevented = !0
                            },
                            defaultPrevented: !1
                        };
                    if (!target.$$listenerCount[name]) return event;
                    for (var listeners, i, length, listenerArgs = concat([event], arguments, 1); current = next;) {
                        for (event.currentScope = current, listeners = current.$$listeners[name] || [], i = 0, length = listeners.length; i < length; i++)
                            if (listeners[i]) try {
                                listeners[i].apply(null, listenerArgs)
                            } catch (e) {
                                $exceptionHandler(e)
                            } else listeners.splice(i, 1), i--, length--;
                        if (!(next = current.$$listenerCount[name] && current.$$childHead || current !== target && current.$$nextSibling))
                            for (; current !== target && !(next = current.$$nextSibling);) current = current.$parent
                    }
                    return event.currentScope = null, event
                }
            };
            var $rootScope = new Scope,
                asyncQueue = $rootScope.$$asyncQueue = [],
                postDigestQueue = $rootScope.$$postDigestQueue = [],
                applyAsyncQueue = $rootScope.$$applyAsyncQueue = [];
            return $rootScope
        }]
    }

    function $$SanitizeUriProvider() {
        var aHrefSanitizationWhitelist = /^\s*(https?|ftp|mailto|tel|file):/,
            imgSrcSanitizationWhitelist = /^\s*((https?|ftp|file|blob):|data:image\/)/;
        this.aHrefSanitizationWhitelist = function(regexp) {
            return isDefined(regexp) ? (aHrefSanitizationWhitelist = regexp, this) : aHrefSanitizationWhitelist
        }, this.imgSrcSanitizationWhitelist = function(regexp) {
            return isDefined(regexp) ? (imgSrcSanitizationWhitelist = regexp, this) : imgSrcSanitizationWhitelist
        }, this.$get = function() {
            return function(uri, isImage) {
                var normalizedVal, regex = isImage ? imgSrcSanitizationWhitelist : aHrefSanitizationWhitelist;
                return normalizedVal = urlResolve(uri).href, "" === normalizedVal || normalizedVal.match(regex) ? uri : "unsafe:" + normalizedVal
            }
        }
    }

    function adjustMatcher(matcher) {
        if ("self" === matcher) return matcher;
        if (isString(matcher)) {
            if (matcher.indexOf("***") > -1) throw $sceMinErr("iwcard", "Illegal sequence *** in string matcher.  String: {0}", matcher);
            return matcher = escapeForRegexp(matcher).replace("\\*\\*", ".*").replace("\\*", "[^:/.?&;]*"), new RegExp("^" + matcher + "$")
        }
        if (isRegExp(matcher)) return new RegExp("^" + matcher.source + "$");
        throw $sceMinErr("imatcher", 'Matchers may only be "self", string patterns or RegExp objects')
    }

    function adjustMatchers(matchers) {
        var adjustedMatchers = [];
        return isDefined(matchers) && forEach(matchers, function(matcher) {
            adjustedMatchers.push(adjustMatcher(matcher))
        }), adjustedMatchers
    }

    function $SceDelegateProvider() {
        this.SCE_CONTEXTS = SCE_CONTEXTS;
        var resourceUrlWhitelist = ["self"],
            resourceUrlBlacklist = [];
        this.resourceUrlWhitelist = function(value) {
            return arguments.length && (resourceUrlWhitelist = adjustMatchers(value)), resourceUrlWhitelist
        }, this.resourceUrlBlacklist = function(value) {
            return arguments.length && (resourceUrlBlacklist = adjustMatchers(value)), resourceUrlBlacklist
        }, this.$get = ["$injector", function($injector) {
            function matchUrl(matcher, parsedUrl) {
                return "self" === matcher ? urlIsSameOrigin(parsedUrl) : !!matcher.exec(parsedUrl.href)
            }

            function isResourceUrlAllowedByPolicy(url) {
                var i, n, parsedUrl = urlResolve(url.toString()),
                    allowed = !1;
                for (i = 0, n = resourceUrlWhitelist.length; i < n; i++)
                    if (matchUrl(resourceUrlWhitelist[i], parsedUrl)) {
                        allowed = !0;
                        break
                    }
                if (allowed)
                    for (i = 0, n = resourceUrlBlacklist.length; i < n; i++)
                        if (matchUrl(resourceUrlBlacklist[i], parsedUrl)) {
                            allowed = !1;
                            break
                        }
                return allowed
            }

            function generateHolderType(Base) {
                var holderType = function(trustedValue) {
                    this.$$unwrapTrustedValue = function() {
                        return trustedValue
                    }
                };
                return Base && (holderType.prototype = new Base), holderType.prototype.valueOf = function() {
                    return this.$$unwrapTrustedValue()
                }, holderType.prototype.toString = function() {
                    return this.$$unwrapTrustedValue().toString()
                }, holderType
            }

            function trustAs(type, trustedValue) {
                var Constructor = byType.hasOwnProperty(type) ? byType[type] : null;
                if (!Constructor) throw $sceMinErr("icontext", "Attempted to trust a value in invalid context. Context: {0}; Value: {1}", type, trustedValue);
                if (null === trustedValue || trustedValue === undefined || "" === trustedValue) return trustedValue;
                if ("string" != typeof trustedValue) throw $sceMinErr("itype", "Attempted to trust a non-string value in a content requiring a string: Context: {0}", type);
                return new Constructor(trustedValue)
            }

            function valueOf(maybeTrusted) {
                return maybeTrusted instanceof trustedValueHolderBase ? maybeTrusted.$$unwrapTrustedValue() : maybeTrusted
            }

            function getTrusted(type, maybeTrusted) {
                if (null === maybeTrusted || maybeTrusted === undefined || "" === maybeTrusted) return maybeTrusted;
                var constructor = byType.hasOwnProperty(type) ? byType[type] : null;
                if (constructor && maybeTrusted instanceof constructor) return maybeTrusted.$$unwrapTrustedValue();
                if (type === SCE_CONTEXTS.RESOURCE_URL) {
                    if (isResourceUrlAllowedByPolicy(maybeTrusted)) return maybeTrusted;
                    throw $sceMinErr("insecurl", "Blocked loading resource from url not allowed by $sceDelegate policy.  URL: {0}", maybeTrusted.toString())
                }
                if (type === SCE_CONTEXTS.HTML) return htmlSanitizer(maybeTrusted);
                throw $sceMinErr("unsafe", "Attempting to use an unsafe value in a safe context.")
            }
            var htmlSanitizer = function(html) {
                throw $sceMinErr("unsafe", "Attempting to use an unsafe value in a safe context.")
            };
            $injector.has("$sanitize") && (htmlSanitizer = $injector.get("$sanitize"));
            var trustedValueHolderBase = generateHolderType(),
                byType = {};
            return byType[SCE_CONTEXTS.HTML] = generateHolderType(trustedValueHolderBase), byType[SCE_CONTEXTS.CSS] = generateHolderType(trustedValueHolderBase), byType[SCE_CONTEXTS.URL] = generateHolderType(trustedValueHolderBase), byType[SCE_CONTEXTS.JS] = generateHolderType(trustedValueHolderBase), byType[SCE_CONTEXTS.RESOURCE_URL] = generateHolderType(byType[SCE_CONTEXTS.URL]), {
                trustAs: trustAs,
                getTrusted: getTrusted,
                valueOf: valueOf
            }
        }]
    }

    function $SceProvider() {
        var enabled = !0;
        this.enabled = function(value) {
            return arguments.length && (enabled = !!value), enabled
        }, this.$get = ["$parse", "$sceDelegate", function($parse, $sceDelegate) {
            if (enabled && msie < 8) throw $sceMinErr("iequirks", "Strict Contextual Escaping does not support Internet Explorer version < 11 in quirks mode.  You can fix this by adding the text <!doctype html> to the top of your HTML document.  See http://docs.angularjs.org/api/ng.$sce for more information.");
            var sce = shallowCopy(SCE_CONTEXTS);
            sce.isEnabled = function() {
                return enabled
            }, sce.trustAs = $sceDelegate.trustAs, sce.getTrusted = $sceDelegate.getTrusted, sce.valueOf = $sceDelegate.valueOf, enabled || (sce.trustAs = sce.getTrusted = function(type, value) {
                return value
            }, sce.valueOf = identity), sce.parseAs = function(type, expr) {
                var parsed = $parse(expr);
                return parsed.literal && parsed.constant ? parsed : $parse(expr, function(value) {
                    return sce.getTrusted(type, value)
                })
            };
            var parse = sce.parseAs,
                getTrusted = sce.getTrusted,
                trustAs = sce.trustAs;
            return forEach(SCE_CONTEXTS, function(enumValue, name) {
                var lName = lowercase(name);
                sce[camelCase("parse_as_" + lName)] = function(expr) {
                    return parse(enumValue, expr)
                }, sce[camelCase("get_trusted_" + lName)] = function(value) {
                    return getTrusted(enumValue, value)
                }, sce[camelCase("trust_as_" + lName)] = function(value) {
                    return trustAs(enumValue, value)
                }
            }), sce
        }]
    }

    function $SnifferProvider() {
        this.$get = ["$window", "$document", function($window, $document) {
            var vendorPrefix, match, eventSupport = {},
                android = toInt((/android (\d+)/.exec(lowercase(($window.navigator || {}).userAgent)) || [])[1]),
                boxee = /Boxee/i.test(($window.navigator || {}).userAgent),
                document = $document[0] || {},
                vendorRegex = /^(Moz|webkit|ms)(?=[A-Z])/,
                bodyStyle = document.body && document.body.style,
                transitions = !1,
                animations = !1;
            if (bodyStyle) {
                for (var prop in bodyStyle)
                    if (match = vendorRegex.exec(prop)) {
                        vendorPrefix = match[0], vendorPrefix = vendorPrefix.substr(0, 1).toUpperCase() + vendorPrefix.substr(1);
                        break
                    }
                vendorPrefix || (vendorPrefix = "WebkitOpacity" in bodyStyle && "webkit"), transitions = !!("transition" in bodyStyle || vendorPrefix + "Transition" in bodyStyle), animations = !!("animation" in bodyStyle || vendorPrefix + "Animation" in bodyStyle), !android || transitions && animations || (transitions = isString(bodyStyle.webkitTransition), animations = isString(bodyStyle.webkitAnimation))
            }
            return {
                history: !(!$window.history || !$window.history.pushState || android < 4 || boxee),
                hasEvent: function(event) {
                    if ("input" === event && msie <= 11) return !1;
                    if (isUndefined(eventSupport[event])) {
                        var divElm = document.createElement("div");
                        eventSupport[event] = "on" + event in divElm
                    }
                    return eventSupport[event]
                },
                csp: csp(),
                vendorPrefix: vendorPrefix,
                transitions: transitions,
                animations: animations,
                android: android
            }
        }]
    }

    function $TemplateRequestProvider() {
        this.$get = ["$templateCache", "$http", "$q", function($templateCache, $http, $q) {
            function handleRequestFn(tpl, ignoreRequestError) {
                function handleError(resp) {
                    if (!ignoreRequestError) throw $compileMinErr("tpload", "Failed to load template: {0} (HTTP status: {1} {2})", tpl, resp.status, resp.statusText);
                    return $q.reject(resp)
                }
                handleRequestFn.totalPendingRequests++;
                var transformResponse = $http.defaults && $http.defaults.transformResponse;
                isArray(transformResponse) ? transformResponse = transformResponse.filter(function(transformer) {
                    return transformer !== defaultHttpResponseTransform
                }) : transformResponse === defaultHttpResponseTransform && (transformResponse = null);
                var httpOptions = {
                    cache: $templateCache,
                    transformResponse: transformResponse
                };
                return $http.get(tpl, httpOptions)["finally"](function() {
                    handleRequestFn.totalPendingRequests--
                }).then(function(response) {
                    return $templateCache.put(tpl, response.data), response.data
                }, handleError)
            }
            return handleRequestFn.totalPendingRequests = 0, handleRequestFn
        }]
    }

    function $$TestabilityProvider() {
        this.$get = ["$rootScope", "$browser", "$location", function($rootScope, $browser, $location) {
            var testability = {};
            return testability.findBindings = function(element, expression, opt_exactMatch) {
                var bindings = element.getElementsByClassName("ng-binding"),
                    matches = [];
                return forEach(bindings, function(binding) {
                    var dataBinding = angular.element(binding).data("$binding");
                    dataBinding && forEach(dataBinding, function(bindingName) {
                        if (opt_exactMatch) {
                            var matcher = new RegExp("(^|\\s)" + escapeForRegexp(expression) + "(\\s|\\||$)");
                            matcher.test(bindingName) && matches.push(binding)
                        } else bindingName.indexOf(expression) != -1 && matches.push(binding)
                    })
                }), matches
            }, testability.findModels = function(element, expression, opt_exactMatch) {
                for (var prefixes = ["ng-", "data-ng-", "ng\\:"], p = 0; p < prefixes.length; ++p) {
                    var attributeEquals = opt_exactMatch ? "=" : "*=",
                        selector = "[" + prefixes[p] + "model" + attributeEquals + '"' + expression + '"]',
                        elements = element.querySelectorAll(selector);
                    if (elements.length) return elements
                }
            }, testability.getLocation = function() {
                return $location.url()
            }, testability.setLocation = function(url) {
                url !== $location.url() && ($location.url(url), $rootScope.$digest())
            }, testability.whenStable = function(callback) {
                $browser.notifyWhenNoOutstandingRequests(callback)
            }, testability
        }]
    }

    function $TimeoutProvider() {
        this.$get = ["$rootScope", "$browser", "$q", "$$q", "$exceptionHandler", function($rootScope, $browser, $q, $$q, $exceptionHandler) {
            function timeout(fn, delay, invokeApply) {
                isFunction(fn) || (invokeApply = delay, delay = fn, fn = noop);
                var timeoutId, args = sliceArgs(arguments, 3),
                    skipApply = isDefined(invokeApply) && !invokeApply,
                    deferred = (skipApply ? $$q : $q).defer(),
                    promise = deferred.promise;
                return timeoutId = $browser.defer(function() {
                    try {
                        deferred.resolve(fn.apply(null, args))
                    } catch (e) {
                        deferred.reject(e), $exceptionHandler(e)
                    } finally {
                        delete deferreds[promise.$$timeoutId]
                    }
                    skipApply || $rootScope.$apply()
                }, delay), promise.$$timeoutId = timeoutId, deferreds[timeoutId] = deferred, promise
            }
            var deferreds = {};
            return timeout.cancel = function(promise) {
                return !!(promise && promise.$$timeoutId in deferreds) && (deferreds[promise.$$timeoutId].reject("canceled"), delete deferreds[promise.$$timeoutId], $browser.defer.cancel(promise.$$timeoutId))
            }, timeout
        }]
    }

    function urlResolve(url) {
        var href = url;
        return msie && (urlParsingNode.setAttribute("href", href), href = urlParsingNode.href), urlParsingNode.setAttribute("href", href), {
            href: urlParsingNode.href,
            protocol: urlParsingNode.protocol ? urlParsingNode.protocol.replace(/:$/, "") : "",
            host: urlParsingNode.host,
            search: urlParsingNode.search ? urlParsingNode.search.replace(/^\?/, "") : "",
            hash: urlParsingNode.hash ? urlParsingNode.hash.replace(/^#/, "") : "",
            hostname: urlParsingNode.hostname,
            port: urlParsingNode.port,
            pathname: "/" === urlParsingNode.pathname.charAt(0) ? urlParsingNode.pathname : "/" + urlParsingNode.pathname
        }
    }

    function urlIsSameOrigin(requestUrl) {
        var parsed = isString(requestUrl) ? urlResolve(requestUrl) : requestUrl;
        return parsed.protocol === originUrl.protocol && parsed.host === originUrl.host
    }

    function $WindowProvider() {
        this.$get = valueFn(window)
    }

    function $$CookieReader($document) {
        function safeDecodeURIComponent(str) {
            try {
                return decodeURIComponent(str)
            } catch (e) {
                return str
            }
        }
        var rawDocument = $document[0],
            lastCookies = {},
            lastCookieString = "";
        return function() {
            var cookieArray, cookie, i, index, name;
            if (rawDocument.cookie !== lastCookieString)
                for (lastCookieString = rawDocument.cookie, cookieArray = lastCookieString.split("; "), lastCookies = {}, i = 0; i < cookieArray.length; i++) cookie = cookieArray[i], index = cookie.indexOf("="), index > 0 && (name = safeDecodeURIComponent(cookie.substring(0, index)), lastCookies[name] === undefined && (lastCookies[name] = safeDecodeURIComponent(cookie.substring(index + 1))));
            return lastCookies
        }
    }

    function $$CookieReaderProvider() {
        this.$get = $$CookieReader
    }

    function $FilterProvider($provide) {
        function register(name, factory) {
            if (isObject(name)) {
                var filters = {};
                return forEach(name, function(filter, key) {
                    filters[key] = register(key, filter)
                }), filters
            }
            return $provide.factory(name + suffix, factory)
        }
        var suffix = "Filter";
        this.register = register, this.$get = ["$injector", function($injector) {
            return function(name) {
                return $injector.get(name + suffix)
            }
        }], register("currency", currencyFilter), register("date", dateFilter), register("filter", filterFilter), register("json", jsonFilter), register("limitTo", limitToFilter), register("lowercase", lowercaseFilter), register("number", numberFilter), register("orderBy", orderByFilter), register("uppercase", uppercaseFilter)
    }

    function filterFilter() {
        return function(array, expression, comparator) {
            if (!isArray(array)) {
                if (null == array) return array;
                throw minErr("filter")("notarray", "Expected array but received: {0}", array)
            }
            var predicateFn, matchAgainstAnyProp;
            switch (typeof expression) {
                case "function":
                    predicateFn = expression;
                    break;
                case "boolean":
                case "number":
                case "string":
                    matchAgainstAnyProp = !0;
                case "object":
                    predicateFn = createPredicateFn(expression, comparator, matchAgainstAnyProp);
                    break;
                default:
                    return array
            }
            return array.filter(predicateFn)
        }
    }

    function hasCustomToString(obj) {
        return isFunction(obj.toString) && obj.toString !== Object.prototype.toString
    }

    function createPredicateFn(expression, comparator, matchAgainstAnyProp) {
        var predicateFn, shouldMatchPrimitives = isObject(expression) && "$" in expression;
        return comparator === !0 ? comparator = equals : isFunction(comparator) || (comparator = function(actual, expected) {
            return !(isObject(expected) || isObject(actual) && !hasCustomToString(actual)) && (actual = lowercase("" + actual), expected = lowercase("" + expected), actual.indexOf(expected) !== -1)
        }), predicateFn = function(item) {
            return shouldMatchPrimitives && !isObject(item) ? deepCompare(item, expression.$, comparator, !1) : deepCompare(item, expression, comparator, matchAgainstAnyProp)
        }
    }

    function deepCompare(actual, expected, comparator, matchAgainstAnyProp, dontMatchWholeObject) {
        var actualType = null !== actual ? typeof actual : "null",
            expectedType = null !== expected ? typeof expected : "null";
        if ("string" === expectedType && "!" === expected.charAt(0)) return !deepCompare(actual, expected.substring(1), comparator, matchAgainstAnyProp);
        if (isArray(actual)) return actual.some(function(item) {
            return deepCompare(item, expected, comparator, matchAgainstAnyProp)
        });
        switch (actualType) {
            case "object":
                var key;
                if (matchAgainstAnyProp) {
                    for (key in actual)
                        if ("$" !== key.charAt(0) && deepCompare(actual[key], expected, comparator, !0)) return !0;
                    return !dontMatchWholeObject && deepCompare(actual, expected, comparator, !1)
                }
                if ("object" === expectedType) {
                    for (key in expected) {
                        var expectedVal = expected[key];
                        if (!isFunction(expectedVal) && !isUndefined(expectedVal)) {
                            var matchAnyProperty = "$" === key,
                                actualVal = matchAnyProperty ? actual : actual[key];
                            if (!deepCompare(actualVal, expectedVal, comparator, matchAnyProperty, matchAnyProperty)) return !1
                        }
                    }
                    return !0
                }
                return comparator(actual, expected);
            case "function":
                return !1;
            default:
                return comparator(actual, expected)
        }
    }

    function currencyFilter($locale) {
        var formats = $locale.NUMBER_FORMATS;
        return function(amount, currencySymbol, fractionSize) {
            return isUndefined(currencySymbol) && (currencySymbol = formats.CURRENCY_SYM), isUndefined(fractionSize) && (fractionSize = formats.PATTERNS[1].maxFrac), null == amount ? amount : formatNumber(amount, formats.PATTERNS[1], formats.GROUP_SEP, formats.DECIMAL_SEP, fractionSize).replace(/\u00A4/g, currencySymbol)
        }
    }

    function numberFilter($locale) {
        var formats = $locale.NUMBER_FORMATS;
        return function(number, fractionSize) {
            return null == number ? number : formatNumber(number, formats.PATTERNS[0], formats.GROUP_SEP, formats.DECIMAL_SEP, fractionSize)
        }
    }

    function formatNumber(number, pattern, groupSep, decimalSep, fractionSize) {
        if (isObject(number)) return "";
        var isNegative = number < 0;
        number = Math.abs(number);
        var isInfinity = number === 1 / 0;
        if (!isInfinity && !isFinite(number)) return "";
        var numStr = number + "",
            formatedText = "",
            hasExponent = !1,
            parts = [];
        if (isInfinity && (formatedText = "∞"), !isInfinity && numStr.indexOf("e") !== -1) {
            var match = numStr.match(/([\d\.]+)e(-?)(\d+)/);
            match && "-" == match[2] && match[3] > fractionSize + 1 ? number = 0 : (formatedText = numStr, hasExponent = !0)
        }
        if (isInfinity || hasExponent) fractionSize > 0 && number < 1 && (formatedText = number.toFixed(fractionSize), number = parseFloat(formatedText));
        else {
            var fractionLen = (numStr.split(DECIMAL_SEP)[1] || "").length;
            isUndefined(fractionSize) && (fractionSize = Math.min(Math.max(pattern.minFrac, fractionLen), pattern.maxFrac)), number = +(Math.round(+(number.toString() + "e" + fractionSize)).toString() + "e" + -fractionSize);
            var fraction = ("" + number).split(DECIMAL_SEP),
                whole = fraction[0];
            fraction = fraction[1] || "";
            var i, pos = 0,
                lgroup = pattern.lgSize,
                group = pattern.gSize;
            if (whole.length >= lgroup + group)
                for (pos = whole.length - lgroup, i = 0; i < pos; i++)(pos - i) % group === 0 && 0 !== i && (formatedText += groupSep), formatedText += whole.charAt(i);
            for (i = pos; i < whole.length; i++)(whole.length - i) % lgroup === 0 && 0 !== i && (formatedText += groupSep), formatedText += whole.charAt(i);
            for (; fraction.length < fractionSize;) fraction += "0";
            fractionSize && "0" !== fractionSize && (formatedText += decimalSep + fraction.substr(0, fractionSize))
        }
        return 0 === number && (isNegative = !1), parts.push(isNegative ? pattern.negPre : pattern.posPre, formatedText, isNegative ? pattern.negSuf : pattern.posSuf), parts.join("")
    }

    function padNumber(num, digits, trim) {
        var neg = "";
        for (num < 0 && (neg = "-", num = -num), num = "" + num; num.length < digits;) num = "0" + num;
        return trim && (num = num.substr(num.length - digits)), neg + num
    }

    function dateGetter(name, size, offset, trim) {
        return offset = offset || 0,
            function(date) {
                var value = date["get" + name]();
                return (offset > 0 || value > -offset) && (value += offset), 0 === value && offset == -12 && (value = 12), padNumber(value, size, trim)
            }
    }

    function dateStrGetter(name, shortForm) {
        return function(date, formats) {
            var value = date["get" + name](),
                get = uppercase(shortForm ? "SHORT" + name : name);
            return formats[get][value]
        }
    }

    function timeZoneGetter(date, formats, offset) {
        var zone = -1 * offset,
            paddedZone = zone >= 0 ? "+" : "";
        return paddedZone += padNumber(Math[zone > 0 ? "floor" : "ceil"](zone / 60), 2) + padNumber(Math.abs(zone % 60), 2)
    }

    function getFirstThursdayOfYear(year) {
        var dayOfWeekOnFirst = new Date(year, 0, 1).getDay();
        return new Date(year, 0, (dayOfWeekOnFirst <= 4 ? 5 : 12) - dayOfWeekOnFirst)
    }

    function getThursdayThisWeek(datetime) {
        return new Date(datetime.getFullYear(), datetime.getMonth(), datetime.getDate() + (4 - datetime.getDay()))
    }

    function weekGetter(size) {
        return function(date) {
            var firstThurs = getFirstThursdayOfYear(date.getFullYear()),
                thisThurs = getThursdayThisWeek(date),
                diff = +thisThurs - +firstThurs,
                result = 1 + Math.round(diff / 6048e5);
            return padNumber(result, size)
        }
    }

    function ampmGetter(date, formats) {
        return date.getHours() < 12 ? formats.AMPMS[0] : formats.AMPMS[1]
    }

    function eraGetter(date, formats) {
        return date.getFullYear() <= 0 ? formats.ERAS[0] : formats.ERAS[1]
    }

    function longEraGetter(date, formats) {
        return date.getFullYear() <= 0 ? formats.ERANAMES[0] : formats.ERANAMES[1]
    }

    function dateFilter($locale) {
        function jsonStringToDate(string) {
            var match;
            if (match = string.match(R_ISO8601_STR)) {
                var date = new Date(0),
                    tzHour = 0,
                    tzMin = 0,
                    dateSetter = match[8] ? date.setUTCFullYear : date.setFullYear,
                    timeSetter = match[8] ? date.setUTCHours : date.setHours;
                match[9] && (tzHour = toInt(match[9] + match[10]), tzMin = toInt(match[9] + match[11])), dateSetter.call(date, toInt(match[1]), toInt(match[2]) - 1, toInt(match[3]));
                var h = toInt(match[4] || 0) - tzHour,
                    m = toInt(match[5] || 0) - tzMin,
                    s = toInt(match[6] || 0),
                    ms = Math.round(1e3 * parseFloat("0." + (match[7] || 0)));
                return timeSetter.call(date, h, m, s, ms), date
            }
            return string
        }
        var R_ISO8601_STR = /^(\d{4})-?(\d\d)-?(\d\d)(?:T(\d\d)(?::?(\d\d)(?::?(\d\d)(?:\.(\d+))?)?)?(Z|([+-])(\d\d):?(\d\d))?)?$/;
        return function(date, format, timezone) {
            var fn, match, text = "",
                parts = [];
            if (format = format || "mediumDate", format = $locale.DATETIME_FORMATS[format] || format, isString(date) && (date = NUMBER_STRING.test(date) ? toInt(date) : jsonStringToDate(date)), isNumber(date) && (date = new Date(date)), !isDate(date) || !isFinite(date.getTime())) return date;
            for (; format;) match = DATE_FORMATS_SPLIT.exec(format), match ? (parts = concat(parts, match, 1), format = parts.pop()) : (parts.push(format), format = null);
            var dateTimezoneOffset = date.getTimezoneOffset();
            return timezone && (dateTimezoneOffset = timezoneToOffset(timezone, date.getTimezoneOffset()), date = convertTimezoneToLocal(date, timezone, !0)), forEach(parts, function(value) {
                fn = DATE_FORMATS[value], text += fn ? fn(date, $locale.DATETIME_FORMATS, dateTimezoneOffset) : value.replace(/(^'|'$)/g, "").replace(/''/g, "'")
            }), text
        }
    }

    function jsonFilter() {
        return function(object, spacing) {
            return isUndefined(spacing) && (spacing = 2), toJson(object, spacing)
        }
    }

    function limitToFilter() {
        return function(input, limit, begin) {
            return limit = Math.abs(Number(limit)) === 1 / 0 ? Number(limit) : toInt(limit), isNaN(limit) ? input : (isNumber(input) && (input = input.toString()), isArray(input) || isString(input) ? (begin = !begin || isNaN(begin) ? 0 : toInt(begin), begin = begin < 0 && begin >= -input.length ? input.length + begin : begin, limit >= 0 ? input.slice(begin, begin + limit) : 0 === begin ? input.slice(limit, input.length) : input.slice(Math.max(0, begin + limit), begin)) : input)
        }
    }

    function orderByFilter($parse) {
        return function(array, sortPredicate, reverseOrder) {
            function comparator(o1, o2) {
                for (var i = 0; i < sortPredicate.length; i++) {
                    var comp = sortPredicate[i](o1, o2);
                    if (0 !== comp) return comp
                }
                return 0
            }

            function reverseComparator(comp, descending) {
                return descending ? function(a, b) {
                    return comp(b, a)
                } : comp
            }

            function isPrimitive(value) {
                switch (typeof value) {
                    case "number":
                    case "boolean":
                    case "string":
                        return !0;
                    default:
                        return !1
                }
            }

            function objectToString(value) {
                return null === value ? "null" : "function" == typeof value.valueOf && (value = value.valueOf(), isPrimitive(value)) ? value : "function" == typeof value.toString && (value = value.toString(), isPrimitive(value)) ? value : ""
            }

            function compare(v1, v2) {
                var t1 = typeof v1,
                    t2 = typeof v2;
                return t1 === t2 && "object" === t1 && (v1 = objectToString(v1), v2 = objectToString(v2)), t1 === t2 ? ("string" === t1 && (v1 = v1.toLowerCase(), v2 = v2.toLowerCase()), v1 === v2 ? 0 : v1 < v2 ? -1 : 1) : t1 < t2 ? -1 : 1
            }
            return isArrayLike(array) ? (sortPredicate = isArray(sortPredicate) ? sortPredicate : [sortPredicate], 0 === sortPredicate.length && (sortPredicate = ["+"]), sortPredicate = sortPredicate.map(function(predicate) {
                var descending = !1,
                    get = predicate || identity;
                if (isString(predicate)) {
                    if ("+" != predicate.charAt(0) && "-" != predicate.charAt(0) || (descending = "-" == predicate.charAt(0), predicate = predicate.substring(1)), "" === predicate) return reverseComparator(compare, descending);
                    if (get = $parse(predicate), get.constant) {
                        var key = get();
                        return reverseComparator(function(a, b) {
                            return compare(a[key], b[key])
                        }, descending)
                    }
                }
                return reverseComparator(function(a, b) {
                    return compare(get(a), get(b))
                }, descending)
            }), slice.call(array).sort(reverseComparator(comparator, reverseOrder))) : array
        }
    }

    function ngDirective(directive) {
        return isFunction(directive) && (directive = {
            link: directive
        }), directive.restrict = directive.restrict || "AC", valueFn(directive)
    }

    function nullFormRenameControl(control, name) {
        control.$name = name
    }

    function FormController(element, attrs, $scope, $animate, $interpolate) {
        var form = this,
            controls = [],
            parentForm = form.$$parentForm = element.parent().controller("form") || nullFormCtrl;
        form.$error = {}, form.$$success = {}, form.$pending = undefined, form.$name = $interpolate(attrs.name || attrs.ngForm || "")($scope), form.$dirty = !1, form.$pristine = !0, form.$valid = !0, form.$invalid = !1, form.$submitted = !1, parentForm.$addControl(form), form.$rollbackViewValue = function() {
            forEach(controls, function(control) {
                control.$rollbackViewValue()
            })
        }, form.$commitViewValue = function() {
            forEach(controls, function(control) {
                control.$commitViewValue()
            })
        }, form.$addControl = function(control) {
            assertNotHasOwnProperty(control.$name, "input"), controls.push(control), control.$name && (form[control.$name] = control)
        }, form.$$renameControl = function(control, newName) {
            var oldName = control.$name;
            form[oldName] === control && delete form[oldName], form[newName] = control, control.$name = newName
        }, form.$removeControl = function(control) {
            control.$name && form[control.$name] === control && delete form[control.$name], forEach(form.$pending, function(value, name) {
                form.$setValidity(name, null, control)
            }), forEach(form.$error, function(value, name) {
                form.$setValidity(name, null, control)
            }), forEach(form.$$success, function(value, name) {
                form.$setValidity(name, null, control)
            }), arrayRemove(controls, control)
        }, addSetValidityMethod({
            ctrl: this,
            $element: element,
            set: function(object, property, controller) {
                var list = object[property];
                if (list) {
                    var index = list.indexOf(controller);
                    index === -1 && list.push(controller)
                } else object[property] = [controller]
            },
            unset: function(object, property, controller) {
                var list = object[property];
                list && (arrayRemove(list, controller), 0 === list.length && delete object[property])
            },
            parentForm: parentForm,
            $animate: $animate
        }), form.$setDirty = function() {
            $animate.removeClass(element, PRISTINE_CLASS), $animate.addClass(element, DIRTY_CLASS), form.$dirty = !0, form.$pristine = !1, parentForm.$setDirty()
        }, form.$setPristine = function() {
            $animate.setClass(element, PRISTINE_CLASS, DIRTY_CLASS + " " + SUBMITTED_CLASS), form.$dirty = !1, form.$pristine = !0, form.$submitted = !1, forEach(controls, function(control) {
                control.$setPristine()
            })
        }, form.$setUntouched = function() {
            forEach(controls, function(control) {
                control.$setUntouched()
            })
        }, form.$setSubmitted = function() {
            $animate.addClass(element, SUBMITTED_CLASS), form.$submitted = !0, parentForm.$setSubmitted()
        }
    }

    function stringBasedInputType(ctrl) {
        ctrl.$formatters.push(function(value) {
            return ctrl.$isEmpty(value) ? value : value.toString()
        })
    }

    function textInputType(scope, element, attr, ctrl, $sniffer, $browser) {
        baseInputType(scope, element, attr, ctrl, $sniffer, $browser), stringBasedInputType(ctrl)
    }

    function baseInputType(scope, element, attr, ctrl, $sniffer, $browser) {
        var type = lowercase(element[0].type);
        if (!$sniffer.android) {
            var composing = !1;
            element.on("compositionstart", function(data) {
                composing = !0
            }), element.on("compositionend", function() {
                composing = !1, listener()
            })
        }
        var listener = function(ev) {
            if (timeout && ($browser.defer.cancel(timeout), timeout = null), !composing) {
                var value = element.val(),
                    event = ev && ev.type;
                "password" === type || attr.ngTrim && "false" === attr.ngTrim || (value = trim(value)), (ctrl.$viewValue !== value || "" === value && ctrl.$$hasNativeValidators) && ctrl.$setViewValue(value, event)
            }
        };
        if ($sniffer.hasEvent("input")) element.on("input", listener);
        else {
            var timeout, deferListener = function(ev, input, origValue) {
                timeout || (timeout = $browser.defer(function() {
                    timeout = null, input && input.value === origValue || listener(ev)
                }))
            };
            element.on("keydown", function(event) {
                var key = event.keyCode;
                91 === key || 15 < key && key < 19 || 37 <= key && key <= 40 || deferListener(event, this, this.value)
            }), $sniffer.hasEvent("paste") && element.on("paste cut", deferListener)
        }
        element.on("change", listener), ctrl.$render = function() {
            element.val(ctrl.$isEmpty(ctrl.$viewValue) ? "" : ctrl.$viewValue)
        }
    }

    function weekParser(isoWeek, existingDate) {
        if (isDate(isoWeek)) return isoWeek;
        if (isString(isoWeek)) {
            WEEK_REGEXP.lastIndex = 0;
            var parts = WEEK_REGEXP.exec(isoWeek);
            if (parts) {
                var year = +parts[1],
                    week = +parts[2],
                    hours = 0,
                    minutes = 0,
                    seconds = 0,
                    milliseconds = 0,
                    firstThurs = getFirstThursdayOfYear(year),
                    addDays = 7 * (week - 1);
                return existingDate && (hours = existingDate.getHours(), minutes = existingDate.getMinutes(), seconds = existingDate.getSeconds(), milliseconds = existingDate.getMilliseconds()), new Date(year, 0, firstThurs.getDate() + addDays, hours, minutes, seconds, milliseconds)
            }
        }
        return NaN
    }

    function createDateParser(regexp, mapping) {
        return function(iso, date) {
            var parts, map;
            if (isDate(iso)) return iso;
            if (isString(iso)) {
                if ('"' == iso.charAt(0) && '"' == iso.charAt(iso.length - 1) && (iso = iso.substring(1, iso.length - 1)), ISO_DATE_REGEXP.test(iso)) return new Date(iso);
                if (regexp.lastIndex = 0, parts = regexp.exec(iso)) return parts.shift(), map = date ? {
                    yyyy: date.getFullYear(),
                    MM: date.getMonth() + 1,
                    dd: date.getDate(),
                    HH: date.getHours(),
                    mm: date.getMinutes(),
                    ss: date.getSeconds(),
                    sss: date.getMilliseconds() / 1e3
                } : {
                    yyyy: 1970,
                    MM: 1,
                    dd: 1,
                    HH: 0,
                    mm: 0,
                    ss: 0,
                    sss: 0
                }, forEach(parts, function(part, index) {
                    index < mapping.length && (map[mapping[index]] = +part)
                }), new Date(map.yyyy, map.MM - 1, map.dd, map.HH, map.mm, map.ss || 0, 1e3 * map.sss || 0)
            }
            return NaN
        }
    }

    function createDateInputType(type, regexp, parseDate, format) {
        return function(scope, element, attr, ctrl, $sniffer, $browser, $filter) {
            function isValidDate(value) {
                return value && !(value.getTime && value.getTime() !== value.getTime())
            }

            function parseObservedDateValue(val) {
                return isDefined(val) ? isDate(val) ? val : parseDate(val) : undefined
            }
            badInputChecker(scope, element, attr, ctrl), baseInputType(scope, element, attr, ctrl, $sniffer, $browser);
            var previousDate, timezone = ctrl && ctrl.$options && ctrl.$options.timezone;
            if (ctrl.$$parserName = type, ctrl.$parsers.push(function(value) {
                    if (ctrl.$isEmpty(value)) return null;
                    if (regexp.test(value)) {
                        var parsedDate = parseDate(value, previousDate);
                        return timezone && (parsedDate = convertTimezoneToLocal(parsedDate, timezone)), parsedDate
                    }
                    return undefined
                }), ctrl.$formatters.push(function(value) {
                    if (value && !isDate(value)) throw $ngModelMinErr("datefmt", "Expected `{0}` to be a date", value);
                    return isValidDate(value) ? (previousDate = value, previousDate && timezone && (previousDate = convertTimezoneToLocal(previousDate, timezone, !0)), $filter("date")(value, format, timezone)) : (previousDate = null, "")
                }), isDefined(attr.min) || attr.ngMin) {
                var minVal;
                ctrl.$validators.min = function(value) {
                    return !isValidDate(value) || isUndefined(minVal) || parseDate(value) >= minVal
                }, attr.$observe("min", function(val) {
                    minVal = parseObservedDateValue(val), ctrl.$validate()
                })
            }
            if (isDefined(attr.max) || attr.ngMax) {
                var maxVal;
                ctrl.$validators.max = function(value) {
                    return !isValidDate(value) || isUndefined(maxVal) || parseDate(value) <= maxVal
                }, attr.$observe("max", function(val) {
                    maxVal = parseObservedDateValue(val), ctrl.$validate()
                })
            }
        }
    }

    function badInputChecker(scope, element, attr, ctrl) {
        var node = element[0],
            nativeValidation = ctrl.$$hasNativeValidators = isObject(node.validity);
        nativeValidation && ctrl.$parsers.push(function(value) {
            var validity = element.prop(VALIDITY_STATE_PROPERTY) || {};
            return validity.badInput && !validity.typeMismatch ? undefined : value
        })
    }

    function numberInputType(scope, element, attr, ctrl, $sniffer, $browser) {
        if (badInputChecker(scope, element, attr, ctrl), baseInputType(scope, element, attr, ctrl, $sniffer, $browser), ctrl.$$parserName = "number", ctrl.$parsers.push(function(value) {
                return ctrl.$isEmpty(value) ? null : NUMBER_REGEXP.test(value) ? parseFloat(value) : undefined
            }), ctrl.$formatters.push(function(value) {
                if (!ctrl.$isEmpty(value)) {
                    if (!isNumber(value)) throw $ngModelMinErr("numfmt", "Expected `{0}` to be a number", value);
                    value = value.toString()
                }
                return value
            }), isDefined(attr.min) || attr.ngMin) {
            var minVal;
            ctrl.$validators.min = function(value) {
                return ctrl.$isEmpty(value) || isUndefined(minVal) || value >= minVal
            }, attr.$observe("min", function(val) {
                isDefined(val) && !isNumber(val) && (val = parseFloat(val, 10)), minVal = isNumber(val) && !isNaN(val) ? val : undefined, ctrl.$validate()
            })
        }
        if (isDefined(attr.max) || attr.ngMax) {
            var maxVal;
            ctrl.$validators.max = function(value) {
                return ctrl.$isEmpty(value) || isUndefined(maxVal) || value <= maxVal
            }, attr.$observe("max", function(val) {
                isDefined(val) && !isNumber(val) && (val = parseFloat(val, 10)), maxVal = isNumber(val) && !isNaN(val) ? val : undefined, ctrl.$validate()
            })
        }
    }

    function urlInputType(scope, element, attr, ctrl, $sniffer, $browser) {
        baseInputType(scope, element, attr, ctrl, $sniffer, $browser), stringBasedInputType(ctrl), ctrl.$$parserName = "url", ctrl.$validators.url = function(modelValue, viewValue) {
            var value = modelValue || viewValue;
            return ctrl.$isEmpty(value) || URL_REGEXP.test(value)
        }
    }

    function emailInputType(scope, element, attr, ctrl, $sniffer, $browser) {
        baseInputType(scope, element, attr, ctrl, $sniffer, $browser), stringBasedInputType(ctrl), ctrl.$$parserName = "email", ctrl.$validators.email = function(modelValue, viewValue) {
            var value = modelValue || viewValue;
            return ctrl.$isEmpty(value) || EMAIL_REGEXP.test(value)
        }
    }

    function radioInputType(scope, element, attr, ctrl) {
        isUndefined(attr.name) && element.attr("name", nextUid());
        var listener = function(ev) {
            element[0].checked && ctrl.$setViewValue(attr.value, ev && ev.type)
        };
        element.on("click", listener), ctrl.$render = function() {
            var value = attr.value;
            element[0].checked = value == ctrl.$viewValue
        }, attr.$observe("value", ctrl.$render)
    }

    function parseConstantExpr($parse, context, name, expression, fallback) {
        var parseFn;
        if (isDefined(expression)) {
            if (parseFn = $parse(expression), !parseFn.constant) throw minErr("ngModel")("constexpr", "Expected constant expression for `{0}`, but saw `{1}`.", name, expression);
            return parseFn(context)
        }
        return fallback
    }

    function checkboxInputType(scope, element, attr, ctrl, $sniffer, $browser, $filter, $parse) {
        var trueValue = parseConstantExpr($parse, scope, "ngTrueValue", attr.ngTrueValue, !0),
            falseValue = parseConstantExpr($parse, scope, "ngFalseValue", attr.ngFalseValue, !1),
            listener = function(ev) {
                ctrl.$setViewValue(element[0].checked, ev && ev.type)
            };
        element.on("click", listener), ctrl.$render = function() {
            element[0].checked = ctrl.$viewValue
        }, ctrl.$isEmpty = function(value) {
            return value === !1
        }, ctrl.$formatters.push(function(value) {
            return equals(value, trueValue)
        }), ctrl.$parsers.push(function(value) {
            return value ? trueValue : falseValue
        })
    }

    function classDirective(name, selector) {
        return name = "ngClass" + name, ["$animate", function($animate) {
            function arrayDifference(tokens1, tokens2) {
                var values = [];
                outer: for (var i = 0; i < tokens1.length; i++) {
                    for (var token = tokens1[i], j = 0; j < tokens2.length; j++)
                        if (token == tokens2[j]) continue outer;
                    values.push(token)
                }
                return values
            }

            function arrayClasses(classVal) {
                if (isArray(classVal)) return classVal.join(" ").split(" ");
                if (isString(classVal)) return classVal.split(" ");
                if (isObject(classVal)) {
                    var classes = [];
                    return forEach(classVal, function(v, k) {
                        v && (classes = classes.concat(k.split(" ")))
                    }), classes
                }
                return classVal
            }
            return {
                restrict: "AC",
                link: function(scope, element, attr) {
                    function addClasses(classes) {
                        var newClasses = digestClassCounts(classes, 1);
                        attr.$addClass(newClasses)
                    }

                    function removeClasses(classes) {
                        var newClasses = digestClassCounts(classes, -1);
                        attr.$removeClass(newClasses)
                    }

                    function digestClassCounts(classes, count) {
                        var classCounts = element.data("$classCounts") || {},
                            classesToUpdate = [];
                        return forEach(classes, function(className) {
                            (count > 0 || classCounts[className]) && (classCounts[className] = (classCounts[className] || 0) + count, classCounts[className] === +(count > 0) && classesToUpdate.push(className))
                        }), element.data("$classCounts", classCounts), classesToUpdate.join(" ")
                    }

                    function updateClasses(oldClasses, newClasses) {
                        var toAdd = arrayDifference(newClasses, oldClasses),
                            toRemove = arrayDifference(oldClasses, newClasses);
                        toAdd = digestClassCounts(toAdd, 1), toRemove = digestClassCounts(toRemove, -1), toAdd && toAdd.length && $animate.addClass(element, toAdd), toRemove && toRemove.length && $animate.removeClass(element, toRemove)
                    }

                    function ngClassWatchAction(newVal) {
                        if (selector === !0 || scope.$index % 2 === selector) {
                            var newClasses = arrayClasses(newVal || []);
                            if (oldVal) {
                                if (!equals(newVal, oldVal)) {
                                    var oldClasses = arrayClasses(oldVal);
                                    updateClasses(oldClasses, newClasses)
                                }
                            } else addClasses(newClasses)
                        }
                        oldVal = shallowCopy(newVal)
                    }
                    var oldVal;
                    scope.$watch(attr[name], ngClassWatchAction, !0), attr.$observe("class", function(value) {
                        ngClassWatchAction(scope.$eval(attr[name]))
                    }), "ngClass" !== name && scope.$watch("$index", function($index, old$index) {
                        var mod = 1 & $index;
                        if (mod !== (1 & old$index)) {
                            var classes = arrayClasses(scope.$eval(attr[name]));
                            mod === selector ? addClasses(classes) : removeClasses(classes)
                        }
                    })
                }
            }
        }]
    }

    function addSetValidityMethod(context) {
        function setValidity(validationErrorKey, state, controller) {
            state === undefined ? createAndSet("$pending", validationErrorKey, controller) : unsetAndCleanup("$pending", validationErrorKey, controller), isBoolean(state) ? state ? (unset(ctrl.$error, validationErrorKey, controller), set(ctrl.$$success, validationErrorKey, controller)) : (set(ctrl.$error, validationErrorKey, controller), unset(ctrl.$$success, validationErrorKey, controller)) : (unset(ctrl.$error, validationErrorKey, controller), unset(ctrl.$$success, validationErrorKey, controller)), ctrl.$pending ? (cachedToggleClass(PENDING_CLASS, !0), ctrl.$valid = ctrl.$invalid = undefined, toggleValidationCss("", null)) : (cachedToggleClass(PENDING_CLASS, !1), ctrl.$valid = isObjectEmpty(ctrl.$error), ctrl.$invalid = !ctrl.$valid, toggleValidationCss("", ctrl.$valid));
            var combinedState;
            combinedState = ctrl.$pending && ctrl.$pending[validationErrorKey] ? undefined : !ctrl.$error[validationErrorKey] && (!!ctrl.$$success[validationErrorKey] || null), toggleValidationCss(validationErrorKey, combinedState), parentForm.$setValidity(validationErrorKey, combinedState, ctrl)
        }

        function createAndSet(name, value, controller) {
            ctrl[name] || (ctrl[name] = {}), set(ctrl[name], value, controller)
        }

        function unsetAndCleanup(name, value, controller) {
            ctrl[name] && unset(ctrl[name], value, controller), isObjectEmpty(ctrl[name]) && (ctrl[name] = undefined)
        }

        function cachedToggleClass(className, switchValue) {
            switchValue && !classCache[className] ? ($animate.addClass($element, className), classCache[className] = !0) : !switchValue && classCache[className] && ($animate.removeClass($element, className), classCache[className] = !1)
        }

        function toggleValidationCss(validationErrorKey, isValid) {
            validationErrorKey = validationErrorKey ? "-" + snake_case(validationErrorKey, "-") : "", cachedToggleClass(VALID_CLASS + validationErrorKey, isValid === !0), cachedToggleClass(INVALID_CLASS + validationErrorKey, isValid === !1)
        }
        var ctrl = context.ctrl,
            $element = context.$element,
            classCache = {},
            set = context.set,
            unset = context.unset,
            parentForm = context.parentForm,
            $animate = context.$animate;
        classCache[INVALID_CLASS] = !(classCache[VALID_CLASS] = $element.hasClass(VALID_CLASS)), ctrl.$setValidity = setValidity
    }

    function isObjectEmpty(obj) {
        if (obj)
            for (var prop in obj) return !1;
        return !0
    }
    var REGEX_STRING_REGEXP = /^\/(.+)\/([a-z]*)$/,
        VALIDITY_STATE_PROPERTY = "validity",
        lowercase = function(string) {
            return isString(string) ? string.toLowerCase() : string
        },
        hasOwnProperty = Object.prototype.hasOwnProperty,
        uppercase = function(string) {
            return isString(string) ? string.toUpperCase() : string
        },
        manualLowercase = function(s) {
            return isString(s) ? s.replace(/[A-Z]/g, function(ch) {
                return String.fromCharCode(32 | ch.charCodeAt(0))
            }) : s
        },
        manualUppercase = function(s) {
            return isString(s) ? s.replace(/[a-z]/g, function(ch) {
                return String.fromCharCode(ch.charCodeAt(0) & -33)
            }) : s
        };
    "i" !== "I".toLowerCase() && (lowercase = manualLowercase, uppercase = manualUppercase);
    var msie, jqLite, jQuery, angularModule, slice = [].slice,
        splice = [].splice,
        push = [].push,
        toString = Object.prototype.toString,
        ngMinErr = minErr("ng"),
        angular = window.angular || (window.angular = {}),
        uid = 0;
    msie = document.documentMode, noop.$inject = [], identity.$inject = [];
    var skipDestroyOnNextJQueryCleanData, isArray = Array.isArray,
        TYPED_ARRAY_REGEXP = /^\[object (Uint8(Clamped)?)|(Uint16)|(Uint32)|(Int8)|(Int16)|(Int32)|(Float(32)|(64))Array\]$/,
        trim = function(value) {
            return isString(value) ? value.trim() : value
        },
        escapeForRegexp = function(s) {
            return s.replace(/([-()\[\]{}+?*.$\^|,:#<!\\])/g, "\\$1").replace(/\x08/g, "\\x08")
        },
        csp = function() {
            if (isDefined(csp.isActive_)) return csp.isActive_;
            var active = !(!document.querySelector("[ng-csp]") && !document.querySelector("[data-ng-csp]"));
            if (!active) try {
                new Function("")
            } catch (e) {
                active = !0
            }
            return csp.isActive_ = active
        },
        jq = function() {
            if (isDefined(jq.name_)) return jq.name_;
            var el, i, prefix, name, ii = ngAttrPrefixes.length;
            for (i = 0; i < ii; ++i)
                if (prefix = ngAttrPrefixes[i], el = document.querySelector("[" + prefix.replace(":", "\\:") + "jq]")) {
                    name = el.getAttribute(prefix + "jq");
                    break
                }
            return jq.name_ = name
        },
        ngAttrPrefixes = ["ng-", "data-ng-", "ng:", "x-ng-"],
        SNAKE_CASE_REGEXP = /[A-Z]/g,
        bindJQueryFired = !1,
        NODE_TYPE_ELEMENT = 1,
        NODE_TYPE_ATTRIBUTE = 2,
        NODE_TYPE_TEXT = 3,
        NODE_TYPE_COMMENT = 8,
        NODE_TYPE_DOCUMENT = 9,
        NODE_TYPE_DOCUMENT_FRAGMENT = 11,
        version = {
            full: "1.4.0-beta.6",
            major: 1,
            minor: 4,
            dot: 0,
            codeName: "cookie-liberation"
        };
    JQLite.expando = "ng339";
    var jqCache = JQLite.cache = {},
        jqId = 1,
        addEventListenerFn = function(element, type, fn) {
            element.addEventListener(type, fn, !1)
        },
        removeEventListenerFn = function(element, type, fn) {
            element.removeEventListener(type, fn, !1)
        };
    JQLite._data = function(node) {
        return this.cache[node[this.expando]] || {}
    };
    var SPECIAL_CHARS_REGEXP = /([\:\-\_]+(.))/g,
        MOZ_HACK_REGEXP = /^moz([A-Z])/,
        MOUSE_EVENT_MAP = {
            mouseleave: "mouseout",
            mouseenter: "mouseover"
        },
        jqLiteMinErr = minErr("jqLite"),
        SINGLE_TAG_REGEXP = /^<(\w+)\s*\/?>(?:<\/\1>|)$/,
        HTML_REGEXP = /<|&#?\w+;/,
        TAG_NAME_REGEXP = /<([\w:]+)/,
        XHTML_TAG_REGEXP = /<(?!area|br|col|embed|hr|img|input|link|meta|param)(([\w:]+)[^>]*)\/>/gi,
        wrapMap = {
            option: [1, '<select multiple="multiple">', "</select>"],
            thead: [1, "<table>", "</table>"],
            col: [2, "<table><colgroup>", "</colgroup></table>"],
            tr: [2, "<table><tbody>", "</tbody></table>"],
            td: [3, "<table><tbody><tr>", "</tr></tbody></table>"],
            _default: [0, "", ""]
        };
    wrapMap.optgroup = wrapMap.option, wrapMap.tbody = wrapMap.tfoot = wrapMap.colgroup = wrapMap.caption = wrapMap.thead, wrapMap.th = wrapMap.td;
    var JQLitePrototype = JQLite.prototype = {
            ready: function(fn) {
                function trigger() {
                    fired || (fired = !0, fn())
                }
                var fired = !1;
                "complete" === document.readyState ? setTimeout(trigger) : (this.on("DOMContentLoaded", trigger), JQLite(window).on("load", trigger))
            },
            toString: function() {
                var value = [];
                return forEach(this, function(e) {
                    value.push("" + e)
                }), "[" + value.join(", ") + "]"
            },
            eq: function(index) {
                return jqLite(index >= 0 ? this[index] : this[this.length + index])
            },
            length: 0,
            push: push,
            sort: [].sort,
            splice: [].splice
        },
        BOOLEAN_ATTR = {};
    forEach("multiple,selected,checked,disabled,readOnly,required,open".split(","), function(value) {
        BOOLEAN_ATTR[lowercase(value)] = value
    });
    var BOOLEAN_ELEMENTS = {};
    forEach("input,select,option,textarea,button,form,details".split(","), function(value) {
        BOOLEAN_ELEMENTS[value] = !0
    });
    var ALIASED_ATTR = {
        ngMinlength: "minlength",
        ngMaxlength: "maxlength",
        ngMin: "min",
        ngMax: "max",
        ngPattern: "pattern"
    };
    forEach({
        data: jqLiteData,
        removeData: jqLiteRemoveData
    }, function(fn, name) {
        JQLite[name] = fn
    }), forEach({
        data: jqLiteData,
        inheritedData: jqLiteInheritedData,
        scope: function(element) {
            return jqLite.data(element, "$scope") || jqLiteInheritedData(element.parentNode || element, ["$isolateScope", "$scope"])
        },
        isolateScope: function(element) {
            return jqLite.data(element, "$isolateScope") || jqLite.data(element, "$isolateScopeNoTemplate")
        },
        controller: jqLiteController,
        injector: function(element) {
            return jqLiteInheritedData(element, "$injector")
        },
        removeAttr: function(element, name) {
            element.removeAttribute(name)
        },
        hasClass: jqLiteHasClass,
        css: function(element, name, value) {
            return name = camelCase(name), isDefined(value) ? void(element.style[name] = value) : element.style[name]
        },
        attr: function(element, name, value) {
            var nodeType = element.nodeType;
            if (nodeType !== NODE_TYPE_TEXT && nodeType !== NODE_TYPE_ATTRIBUTE && nodeType !== NODE_TYPE_COMMENT) {
                var lowercasedName = lowercase(name);
                if (BOOLEAN_ATTR[lowercasedName]) {
                    if (!isDefined(value)) return element[name] || (element.attributes.getNamedItem(name) || noop).specified ? lowercasedName : undefined;
                    value ? (element[name] = !0, element.setAttribute(name, lowercasedName)) : (element[name] = !1, element.removeAttribute(lowercasedName))
                } else if (isDefined(value)) element.setAttribute(name, value);
                else if (element.getAttribute) {
                    var ret = element.getAttribute(name, 2);
                    return null === ret ? undefined : ret
                }
            }
        },
        prop: function(element, name, value) {
            return isDefined(value) ? void(element[name] = value) : element[name]
        },
        text: function() {
            function getText(element, value) {
                if (isUndefined(value)) {
                    var nodeType = element.nodeType;
                    return nodeType === NODE_TYPE_ELEMENT || nodeType === NODE_TYPE_TEXT ? element.textContent : ""
                }
                element.textContent = value
            }
            return getText.$dv = "", getText
        }(),
        val: function(element, value) {
            if (isUndefined(value)) {
                if (element.multiple && "select" === nodeName_(element)) {
                    var result = [];
                    return forEach(element.options, function(option) {
                        option.selected && result.push(option.value || option.text)
                    }), 0 === result.length ? null : result
                }
                return element.value
            }
            element.value = value
        },
        html: function(element, value) {
            return isUndefined(value) ? element.innerHTML : (jqLiteDealoc(element, !0), void(element.innerHTML = value))
        },
        empty: jqLiteEmpty
    }, function(fn, name) {
        JQLite.prototype[name] = function(arg1, arg2) {
            var i, key, nodeCount = this.length;
            if (fn !== jqLiteEmpty && (2 == fn.length && fn !== jqLiteHasClass && fn !== jqLiteController ? arg1 : arg2) === undefined) {
                if (isObject(arg1)) {
                    for (i = 0; i < nodeCount; i++)
                        if (fn === jqLiteData) fn(this[i], arg1);
                        else
                            for (key in arg1) fn(this[i], key, arg1[key]);
                    return this
                }
                for (var value = fn.$dv, jj = value === undefined ? Math.min(nodeCount, 1) : nodeCount, j = 0; j < jj; j++) {
                    var nodeValue = fn(this[j], arg1, arg2);
                    value = value ? value + nodeValue : nodeValue
                }
                return value
            }
            for (i = 0; i < nodeCount; i++) fn(this[i], arg1, arg2);
            return this
        }
    }), forEach({
        removeData: jqLiteRemoveData,
        on: function jqLiteOn(element, type, fn, unsupported) {
            if (isDefined(unsupported)) throw jqLiteMinErr("onargs", "jqLite#on() does not support the `selector` or `eventData` parameters");
            if (jqLiteAcceptsData(element)) {
                var expandoStore = jqLiteExpandoStore(element, !0),
                    events = expandoStore.events,
                    handle = expandoStore.handle;
                handle || (handle = expandoStore.handle = createEventHandler(element, events));
                for (var types = type.indexOf(" ") >= 0 ? type.split(" ") : [type], i = types.length; i--;) {
                    type = types[i];
                    var eventFns = events[type];
                    eventFns || (events[type] = [], "mouseenter" === type || "mouseleave" === type ? jqLiteOn(element, MOUSE_EVENT_MAP[type], function(event) {
                        var target = this,
                            related = event.relatedTarget;
                        related && (related === target || target.contains(related)) || handle(event, type)
                    }) : "$destroy" !== type && addEventListenerFn(element, type, handle), eventFns = events[type]), eventFns.push(fn)
                }
            }
        },
        off: jqLiteOff,
        one: function(element, type, fn) {
            element = jqLite(element), element.on(type, function onFn() {
                element.off(type, fn), element.off(type, onFn)
            }), element.on(type, fn)
        },
        replaceWith: function(element, replaceNode) {
            var index, parent = element.parentNode;
            jqLiteDealoc(element), forEach(new JQLite(replaceNode), function(node) {
                index ? parent.insertBefore(node, index.nextSibling) : parent.replaceChild(node, element), index = node
            })
        },
        children: function(element) {
            var children = [];
            return forEach(element.childNodes, function(element) {
                element.nodeType === NODE_TYPE_ELEMENT && children.push(element)
            }), children
        },
        contents: function(element) {
            return element.contentDocument || element.childNodes || []
        },
        append: function(element, node) {
            var nodeType = element.nodeType;
            if (nodeType === NODE_TYPE_ELEMENT || nodeType === NODE_TYPE_DOCUMENT_FRAGMENT) {
                node = new JQLite(node);
                for (var i = 0, ii = node.length; i < ii; i++) {
                    var child = node[i];
                    element.appendChild(child)
                }
            }
        },
        prepend: function(element, node) {
            if (element.nodeType === NODE_TYPE_ELEMENT) {
                var index = element.firstChild;
                forEach(new JQLite(node), function(child) {
                    element.insertBefore(child, index)
                })
            }
        },
        wrap: function(element, wrapNode) {
            wrapNode = jqLite(wrapNode).eq(0).clone()[0];
            var parent = element.parentNode;
            parent && parent.replaceChild(wrapNode, element), wrapNode.appendChild(element)
        },
        remove: jqLiteRemove,
        detach: function(element) {
            jqLiteRemove(element, !0)
        },
        after: function(element, newElement) {
            var index = element,
                parent = element.parentNode;
            newElement = new JQLite(newElement);
            for (var i = 0, ii = newElement.length; i < ii; i++) {
                var node = newElement[i];
                parent.insertBefore(node, index.nextSibling), index = node
            }
        },
        addClass: jqLiteAddClass,
        removeClass: jqLiteRemoveClass,
        toggleClass: function(element, selector, condition) {
            selector && forEach(selector.split(" "), function(className) {
                var classCondition = condition;
                isUndefined(classCondition) && (classCondition = !jqLiteHasClass(element, className)), (classCondition ? jqLiteAddClass : jqLiteRemoveClass)(element, className)
            })
        },
        parent: function(element) {
            var parent = element.parentNode;
            return parent && parent.nodeType !== NODE_TYPE_DOCUMENT_FRAGMENT ? parent : null
        },
        next: function(element) {
            return element.nextElementSibling
        },
        find: function(element, selector) {
            return element.getElementsByTagName ? element.getElementsByTagName(selector) : []
        },
        clone: jqLiteClone,
        triggerHandler: function(element, event, extraParameters) {
            var dummyEvent, eventFnsCopy, handlerArgs, eventName = event.type || event,
                expandoStore = jqLiteExpandoStore(element),
                events = expandoStore && expandoStore.events,
                eventFns = events && events[eventName];
            eventFns && (dummyEvent = {
                preventDefault: function() {
                    this.defaultPrevented = !0
                },
                isDefaultPrevented: function() {
                    return this.defaultPrevented === !0
                },
                stopImmediatePropagation: function() {
                    this.immediatePropagationStopped = !0
                },
                isImmediatePropagationStopped: function() {
                    return this.immediatePropagationStopped === !0
                },
                stopPropagation: noop,
                type: eventName,
                target: element
            }, event.type && (dummyEvent = extend(dummyEvent, event)), eventFnsCopy = shallowCopy(eventFns), handlerArgs = extraParameters ? [dummyEvent].concat(extraParameters) : [dummyEvent], forEach(eventFnsCopy, function(fn) {
                dummyEvent.isImmediatePropagationStopped() || fn.apply(element, handlerArgs)
            }))
        }
    }, function(fn, name) {
        JQLite.prototype[name] = function(arg1, arg2, arg3) {
            for (var value, i = 0, ii = this.length; i < ii; i++) isUndefined(value) ? (value = fn(this[i], arg1, arg2, arg3), isDefined(value) && (value = jqLite(value))) : jqLiteAddNodes(value, fn(this[i], arg1, arg2, arg3));
            return isDefined(value) ? value : this
        }, JQLite.prototype.bind = JQLite.prototype.on, JQLite.prototype.unbind = JQLite.prototype.off
    }), HashMap.prototype = {
        put: function(key, value) {
            this[hashKey(key, this.nextUid)] = value
        },
        get: function(key) {
            return this[hashKey(key, this.nextUid)]
        },
        remove: function(key) {
            var value = this[key = hashKey(key, this.nextUid)];
            return delete this[key], value
        }
    };
    var $$HashMapProvider = [function() {
            this.$get = [function() {
                return HashMap
            }]
        }],
        FN_ARGS = /^function\s*[^\(]*\(\s*([^\)]*)\)/m,
        FN_ARG_SPLIT = /,/,
        FN_ARG = /^\s*(_?)(\S+?)\1\s*$/,
        STRIP_COMMENTS = /((\/\/.*$)|(\/\*[\s\S]*?\*\/))/gm,
        $injectorMinErr = minErr("$injector");
    createInjector.$$annotate = annotate;
    var $animateMinErr = minErr("$animate"),
        $AnimateProvider = ["$provide", function($provide) {
            this.$$selectors = {}, this.register = function(name, factory) {
                var key = name + "-animation";
                if (name && "." != name.charAt(0)) throw $animateMinErr("notcsel", "Expecting class selector starting with '.' got '{0}'.", name);
                this.$$selectors[name.substr(1)] = key, $provide.factory(key, factory)
            }, this.classNameFilter = function(expression) {
                return 1 === arguments.length && (this.$$classNameFilter = expression instanceof RegExp ? expression : null), this.$$classNameFilter
            }, this.$get = ["$$q", "$$asyncCallback", "$rootScope", function($$q, $$asyncCallback, $rootScope) {
                function runAnimationPostDigest(fn) {
                    var cancelFn, defer = $$q.defer();
                    return defer.promise.$$cancelFn = function() {
                        cancelFn && cancelFn()
                    }, $rootScope.$$postDigest(function() {
                        cancelFn = fn(function() {
                            defer.resolve()
                        })
                    }), defer.promise
                }

                function resolveElementClasses(element, classes) {
                    var toAdd = [],
                        toRemove = [],
                        hasClasses = createMap();
                    return forEach((element.attr("class") || "").split(/\s+/), function(className) {
                        hasClasses[className] = !0
                    }), forEach(classes, function(status, className) {
                        var hasClass = hasClasses[className];
                        status === !1 && hasClass ? toRemove.push(className) : status !== !0 || hasClass || toAdd.push(className)
                    }), toAdd.length + toRemove.length > 0 && [toAdd.length ? toAdd : null, toRemove.length ? toRemove : null]
                }

                function cachedClassManipulation(cache, classes, op) {
                    for (var i = 0, ii = classes.length; i < ii; ++i) {
                        var className = classes[i];
                        cache[className] = op
                    }
                }

                function asyncPromise() {
                    return currentDefer || (currentDefer = $$q.defer(), $$asyncCallback(function() {
                        currentDefer.resolve(), currentDefer = null
                    })), currentDefer.promise
                }

                function applyStyles(element, options) {
                    if (angular.isObject(options)) {
                        var styles = extend(options.from || {}, options.to || {});
                        element.css(styles)
                    }
                }
                var currentDefer;
                return {
                    animate: function(element, from, to) {
                        return applyStyles(element, {
                            from: from,
                            to: to
                        }), asyncPromise()
                    },
                    enter: function(element, parent, after, options) {
                        return applyStyles(element, options), after ? after.after(element) : parent.prepend(element), asyncPromise()
                    },
                    leave: function(element, options) {
                        return applyStyles(element, options), element.remove(), asyncPromise()
                    },
                    move: function(element, parent, after, options) {
                        return this.enter(element, parent, after, options)
                    },
                    addClass: function(element, className, options) {
                        return this.setClass(element, className, [], options)
                    },
                    $$addClassImmediately: function(element, className, options) {
                        return element = jqLite(element), className = isString(className) ? className : isArray(className) ? className.join(" ") : "", forEach(element, function(element) {
                            jqLiteAddClass(element, className)
                        }), applyStyles(element, options), asyncPromise()
                    },
                    removeClass: function(element, className, options) {
                        return this.setClass(element, [], className, options)
                    },
                    $$removeClassImmediately: function(element, className, options) {
                        return element = jqLite(element), className = isString(className) ? className : isArray(className) ? className.join(" ") : "", forEach(element, function(element) {
                            jqLiteRemoveClass(element, className)
                        }), applyStyles(element, options), asyncPromise()
                    },
                    setClass: function(element, add, remove, options) {
                        var self = this,
                            STORAGE_KEY = "$$animateClasses",
                            createdCache = !1;
                        element = jqLite(element);
                        var cache = element.data(STORAGE_KEY);
                        cache ? options && cache.options && (cache.options = angular.extend(cache.options || {}, options)) : (cache = {
                            classes: {},
                            options: options
                        }, createdCache = !0);
                        var classes = cache.classes;
                        return add = isArray(add) ? add : add.split(" "), remove = isArray(remove) ? remove : remove.split(" "), cachedClassManipulation(classes, add, !0), cachedClassManipulation(classes, remove, !1), createdCache && (cache.promise = runAnimationPostDigest(function(done) {
                            var cache = element.data(STORAGE_KEY);
                            if (element.removeData(STORAGE_KEY), cache) {
                                var classes = resolveElementClasses(element, cache.classes);
                                classes && self.$$setClassImmediately(element, classes[0], classes[1], cache.options)
                            }
                            done()
                        }), element.data(STORAGE_KEY, cache)), cache.promise
                    },
                    $$setClassImmediately: function(element, add, remove, options) {
                        return add && this.$$addClassImmediately(element, add), remove && this.$$removeClassImmediately(element, remove), applyStyles(element, options), asyncPromise()
                    },
                    enabled: noop,
                    cancel: noop
                }
            }]
        }],
        $compileMinErr = minErr("$compile");
    $CompileProvider.$inject = ["$provide", "$$sanitizeUriProvider"];
    var PREFIX_REGEXP = /^((?:x|data)[\:\-_])/i,
        $controllerMinErr = minErr("$controller"),
        CNTRL_REG = /^(\S+)(\s+as\s+(\w+))?$/,
        APPLICATION_JSON = "application/json",
        CONTENT_TYPE_APPLICATION_JSON = {
            "Content-Type": APPLICATION_JSON + ";charset=utf-8"
        },
        JSON_START = /^\[|^\{(?!\{)/,
        JSON_ENDS = {
            "[": /]$/,
            "{": /}$/
        },
        JSON_PROTECTION_PREFIX = /^\)\]\}',?\n/,
        $interpolateMinErr = minErr("$interpolate"),
        PATH_MATCH = /^([^\?#]*)(\?([^#]*))?(#(.*))?$/,
        DEFAULT_PORTS = {
            http: 80,
            https: 443,
            ftp: 21
        },
        $locationMinErr = minErr("$location"),
        locationPrototype = {
            $$html5: !1,
            $$replace: !1,
            absUrl: locationGetter("$$absUrl"),
            url: function(url) {
                if (isUndefined(url)) return this.$$url;
                var match = PATH_MATCH.exec(url);
                return (match[1] || "" === url) && this.path(decodeURIComponent(match[1])), (match[2] || match[1] || "" === url) && this.search(match[3] || ""), this.hash(match[5] || ""), this
            },
            protocol: locationGetter("$$protocol"),
            host: locationGetter("$$host"),
            port: locationGetter("$$port"),
            path: locationGetterSetter("$$path", function(path) {
                return path = null !== path ? path.toString() : "", "/" == path.charAt(0) ? path : "/" + path
            }),
            search: function(search, paramValue) {
                switch (arguments.length) {
                    case 0:
                        return this.$$search;
                    case 1:
                        if (isString(search) || isNumber(search)) search = search.toString(), this.$$search = parseKeyValue(search);
                        else {
                            if (!isObject(search)) throw $locationMinErr("isrcharg", "The first argument of the `$location#search()` call must be a string or an object.");
                            search = copy(search, {}), forEach(search, function(value, key) {
                                null == value && delete search[key]
                            }), this.$$search = search
                        }
                        break;
                    default:
                        isUndefined(paramValue) || null === paramValue ? delete this.$$search[search] : this.$$search[search] = paramValue
                }
                return this.$$compose(), this
            },
            hash: locationGetterSetter("$$hash", function(hash) {
                return null !== hash ? hash.toString() : ""
            }),
            replace: function() {
                return this.$$replace = !0, this
            }
        };
    forEach([LocationHashbangInHtml5Url, LocationHashbangUrl, LocationHtml5Url], function(Location) {
        Location.prototype = Object.create(locationPrototype), Location.prototype.state = function(state) {
            if (!arguments.length) return this.$$state;
            if (Location !== LocationHtml5Url || !this.$$html5) throw $locationMinErr("nostate", "History API state support is available only in HTML5 mode and only in browsers supporting HTML5 History API");
            return this.$$state = isUndefined(state) ? null : state, this
        }
    });
    var $parseMinErr = minErr("$parse"),
        CALL = Function.prototype.call,
        APPLY = Function.prototype.apply,
        BIND = Function.prototype.bind,
        OPERATORS = createMap();
    forEach("+ - * / % === !== == != < > <= >= && || ! = |".split(" "), function(operator) {
        OPERATORS[operator] = !0
    });
    var ESCAPE = {
            n: "\n",
            f: "\f",
            r: "\r",
            t: "\t",
            v: "\x0B",
            "'": "'",
            '"': '"'
        },
        Lexer = function(options) {
            this.options = options
        };
    Lexer.prototype = {
        constructor: Lexer,
        lex: function(text) {
            for (this.text = text, this.index = 0, this.tokens = []; this.index < this.text.length;) {
                var ch = this.text.charAt(this.index);
                if ('"' === ch || "'" === ch) this.readString(ch);
                else if (this.isNumber(ch) || "." === ch && this.isNumber(this.peek())) this.readNumber();
                else if (this.isIdent(ch)) this.readIdent();
                else if (this.is(ch, "(){}[].,;:?")) this.tokens.push({
                    index: this.index,
                    text: ch
                }), this.index++;
                else if (this.isWhitespace(ch)) this.index++;
                else {
                    var ch2 = ch + this.peek(),
                        ch3 = ch2 + this.peek(2),
                        op1 = OPERATORS[ch],
                        op2 = OPERATORS[ch2],
                        op3 = OPERATORS[ch3];
                    if (op1 || op2 || op3) {
                        var token = op3 ? ch3 : op2 ? ch2 : ch;
                        this.tokens.push({
                            index: this.index,
                            text: token,
                            operator: !0
                        }), this.index += token.length
                    } else this.throwError("Unexpected next character ", this.index, this.index + 1)
                }
            }
            return this.tokens
        },
        is: function(ch, chars) {
            return chars.indexOf(ch) !== -1
        },
        peek: function(i) {
            var num = i || 1;
            return this.index + num < this.text.length && this.text.charAt(this.index + num)
        },
        isNumber: function(ch) {
            return "0" <= ch && ch <= "9" && "string" == typeof ch
        },
        isWhitespace: function(ch) {
            return " " === ch || "\r" === ch || "\t" === ch || "\n" === ch || "\x0B" === ch || " " === ch
        },
        isIdent: function(ch) {
            return "a" <= ch && ch <= "z" || "A" <= ch && ch <= "Z" || "_" === ch || "$" === ch
        },
        isExpOperator: function(ch) {
            return "-" === ch || "+" === ch || this.isNumber(ch)
        },
        throwError: function(error, start, end) {
            end = end || this.index;
            var colStr = isDefined(start) ? "s " + start + "-" + this.index + " [" + this.text.substring(start, end) + "]" : " " + end;
            throw $parseMinErr("lexerr", "Lexer Error: {0} at column{1} in expression [{2}].", error, colStr, this.text)
        },
        readNumber: function() {
            for (var number = "", start = this.index; this.index < this.text.length;) {
                var ch = lowercase(this.text.charAt(this.index));
                if ("." == ch || this.isNumber(ch)) number += ch;
                else {
                    var peekCh = this.peek();
                    if ("e" == ch && this.isExpOperator(peekCh)) number += ch;
                    else if (this.isExpOperator(ch) && peekCh && this.isNumber(peekCh) && "e" == number.charAt(number.length - 1)) number += ch;
                    else {
                        if (!this.isExpOperator(ch) || peekCh && this.isNumber(peekCh) || "e" != number.charAt(number.length - 1)) break;
                        this.throwError("Invalid exponent")
                    }
                }
                this.index++
            }
            this.tokens.push({
                index: start,
                text: number,
                constant: !0,
                value: Number(number)
            })
        },
        readIdent: function() {
            for (var start = this.index; this.index < this.text.length;) {
                var ch = this.text.charAt(this.index);
                if (!this.isIdent(ch) && !this.isNumber(ch)) break;
                this.index++
            }
            this.tokens.push({
                index: start,
                text: this.text.slice(start, this.index),
                identifier: !0
            })
        },
        readString: function(quote) {
            var start = this.index;
            this.index++;
            for (var string = "", rawString = quote, escape = !1; this.index < this.text.length;) {
                var ch = this.text.charAt(this.index);
                if (rawString += ch, escape) {
                    if ("u" === ch) {
                        var hex = this.text.substring(this.index + 1, this.index + 5);
                        hex.match(/[\da-f]{4}/i) || this.throwError("Invalid unicode escape [\\u" + hex + "]"), this.index += 4, string += String.fromCharCode(parseInt(hex, 16))
                    } else {
                        var rep = ESCAPE[ch];
                        string += rep || ch
                    }
                    escape = !1
                } else if ("\\" === ch) escape = !0;
                else {
                    if (ch === quote) return this.index++, void this.tokens.push({
                        index: start,
                        text: rawString,
                        constant: !0,
                        value: string
                    });
                    string += ch
                }
                this.index++
            }
            this.throwError("Unterminated quote", start)
        }
    };
    var AST = function(lexer, options) {
        this.lexer = lexer, this.options = options
    };
    AST.Program = "Program", AST.ExpressionStatement = "ExpressionStatement", AST.AssignmentExpression = "AssignmentExpression", AST.ConditionalExpression = "ConditionalExpression", AST.LogicalExpression = "LogicalExpression", AST.BinaryExpression = "BinaryExpression", AST.UnaryExpression = "UnaryExpression", AST.CallExpression = "CallExpression", AST.MemberExpression = "MemberExpression", AST.Identifier = "Identifier", AST.Literal = "Literal", AST.ArrayExpression = "ArrayExpression", AST.Property = "Property", AST.ObjectExpression = "ObjectExpression", AST.ThisExpression = "ThisExpression", AST.NGValueParameter = "NGValueParameter", AST.prototype = {
        ast: function(text) {
            this.text = text, this.tokens = this.lexer.lex(text);
            var value = this.program();
            return 0 !== this.tokens.length && this.throwError("is an unexpected token", this.tokens[0]), value
        },
        program: function() {
            for (var body = [];;)
                if (this.tokens.length > 0 && !this.peek("}", ")", ";", "]") && body.push(this.expressionStatement()), !this.expect(";")) return {
                    type: AST.Program,
                    body: body
                }
        },
        expressionStatement: function() {
            return {
                type: AST.ExpressionStatement,
                expression: this.filterChain()
            }
        },
        filterChain: function() {
            for (var token, left = this.expression(); token = this.expect("|");) left = this.filter(left);
            return left
        },
        expression: function() {
            return this.assignment()
        },
        assignment: function() {
            var result = this.ternary();
            return this.expect("=") && (result = {
                type: AST.AssignmentExpression,
                left: result,
                right: this.assignment(),
                operator: "="
            }), result
        },
        ternary: function() {
            var alternate, consequent, test = this.logicalOR();
            return this.expect("?") && (alternate = this.expression(), this.consume(":")) ? (consequent = this.expression(), {
                type: AST.ConditionalExpression,
                test: test,
                alternate: alternate,
                consequent: consequent
            }) : test
        },
        logicalOR: function() {
            for (var left = this.logicalAND(); this.expect("||");) left = {
                type: AST.LogicalExpression,
                operator: "||",
                left: left,
                right: this.logicalAND()
            };
            return left
        },
        logicalAND: function() {
            for (var left = this.equality(); this.expect("&&");) left = {
                type: AST.LogicalExpression,
                operator: "&&",
                left: left,
                right: this.equality()
            };
            return left
        },
        equality: function() {
            for (var token, left = this.relational(); token = this.expect("==", "!=", "===", "!==");) left = {
                type: AST.BinaryExpression,
                operator: token.text,
                left: left,
                right: this.relational()
            };
            return left
        },
        relational: function() {
            for (var token, left = this.additive(); token = this.expect("<", ">", "<=", ">=");) left = {
                type: AST.BinaryExpression,
                operator: token.text,
                left: left,
                right: this.additive()
            };
            return left
        },
        additive: function() {
            for (var token, left = this.multiplicative(); token = this.expect("+", "-");) left = {
                type: AST.BinaryExpression,
                operator: token.text,
                left: left,
                right: this.multiplicative()
            };
            return left
        },
        multiplicative: function() {
            for (var token, left = this.unary(); token = this.expect("*", "/", "%");) left = {
                type: AST.BinaryExpression,
                operator: token.text,
                left: left,
                right: this.unary()
            };
            return left
        },
        unary: function() {
            var token;
            return (token = this.expect("+", "-", "!")) ? {
                type: AST.UnaryExpression,
                operator: token.text,
                prefix: !0,
                argument: this.unary()
            } : this.primary()
        },
        primary: function() {
            var primary;
            this.expect("(") ? (primary = this.filterChain(), this.consume(")")) : this.expect("[") ? primary = this.arrayDeclaration() : this.expect("{") ? primary = this.object() : this.constants.hasOwnProperty(this.peek().text) ? primary = copy(this.constants[this.consume().text]) : this.peek().identifier ? primary = this.identifier() : this.peek().constant ? primary = this.constant() : this.throwError("not a primary expression", this.peek());
            for (var next; next = this.expect("(", "[", ".");) "(" === next.text ? (primary = {
                type: AST.CallExpression,
                callee: primary,
                arguments: this.parseArguments()
            }, this.consume(")")) : "[" === next.text ? (primary = {
                type: AST.MemberExpression,
                object: primary,
                property: this.expression(),
                computed: !0
            }, this.consume("]")) : "." === next.text ? primary = {
                type: AST.MemberExpression,
                object: primary,
                property: this.identifier(),
                computed: !1
            } : this.throwError("IMPOSSIBLE");
            return primary
        },
        filter: function(baseExpression) {
            for (var args = [baseExpression], result = {
                    type: AST.CallExpression,
                    callee: this.identifier(),
                    arguments: args,
                    filter: !0
                }; this.expect(":");) args.push(this.expression());
            return result
        },
        parseArguments: function() {
            var args = [];
            if (")" !== this.peekToken().text)
                do args.push(this.expression()); while (this.expect(","));
            return args
        },
        identifier: function() {
            var token = this.consume();
            return token.identifier || this.throwError("is not a valid identifier", token), {
                type: AST.Identifier,
                name: token.text
            }
        },
        constant: function() {
            return {
                type: AST.Literal,
                value: this.consume().value
            }
        },
        arrayDeclaration: function() {
            var elements = [];
            if ("]" !== this.peekToken().text)
                do {
                    if (this.peek("]")) break;
                    elements.push(this.expression())
                } while (this.expect(","));
            return this.consume("]"), {
                type: AST.ArrayExpression,
                elements: elements
            }
        },
        object: function() {
            var property, properties = [];
            if ("}" !== this.peekToken().text)
                do {
                    if (this.peek("}")) break;
                    property = {
                        type: AST.Property,
                        kind: "init"
                    }, this.peek().constant ? property.key = this.constant() : this.peek().identifier ? property.key = this.identifier() : this.throwError("invalid key", this.peek()), this.consume(":"), property.value = this.expression(), properties.push(property)
                } while (this.expect(","));
            return this.consume("}"), {
                type: AST.ObjectExpression,
                properties: properties
            }
        },
        throwError: function(msg, token) {
            throw $parseMinErr("syntax", "Syntax Error: Token '{0}' {1} at column {2} of the expression [{3}] starting at [{4}].", token.text, msg, token.index + 1, this.text, this.text.substring(token.index))
        },
        consume: function(e1) {
            if (0 === this.tokens.length) throw $parseMinErr("ueoe", "Unexpected end of expression: {0}", this.text);
            var token = this.expect(e1);
            return token || this.throwError("is unexpected, expecting [" + e1 + "]", this.peek()), token
        },
        peekToken: function() {
            if (0 === this.tokens.length) throw $parseMinErr("ueoe", "Unexpected end of expression: {0}", this.text);
            return this.tokens[0]
        },
        peek: function(e1, e2, e3, e4) {
            return this.peekAhead(0, e1, e2, e3, e4)
        },
        peekAhead: function(i, e1, e2, e3, e4) {
            if (this.tokens.length > i) {
                var token = this.tokens[i],
                    t = token.text;
                if (t === e1 || t === e2 || t === e3 || t === e4 || !e1 && !e2 && !e3 && !e4) return token
            }
            return !1
        },
        expect: function(e1, e2, e3, e4) {
            var token = this.peek(e1, e2, e3, e4);
            return !!token && (this.tokens.shift(), token)
        },
        constants: {
            "true": {
                type: AST.Literal,
                value: !0
            },
            "false": {
                type: AST.Literal,
                value: !1
            },
            "null": {
                type: AST.Literal,
                value: null
            },
            undefined: {
                type: AST.Literal,
                value: undefined
            },
            "this": {
                type: AST.ThisExpression
            }
        }
    }, ASTCompiler.prototype = {
        compile: function(expression, expensiveChecks) {
            var self = this,
                ast = this.astBuilder.ast(expression);
            this.state = {
                nextId: 0,
                filters: {},
                expensiveChecks: expensiveChecks,
                fn: {
                    vars: [],
                    body: [],
                    own: {}
                },
                assign: {
                    vars: [],
                    body: [],
                    own: {}
                },
                inputs: []
            }, findConstantAndWatchExpressions(ast, self.$filter);
            var assignable, extra = "";
            if (this.stage = "assign", assignable = assignableAST(ast)) {
                this.state.computing = "assign";
                var result = this.nextId();
                this.recurse(assignable, result), extra = "fn.assign=" + this.generateFunction("assign", "s,v,l")
            }
            var toWatch = getInputs(ast.body);
            self.stage = "inputs", forEach(toWatch, function(watch, key) {
                var fnKey = "fn" + key;
                self.state[fnKey] = {
                    vars: [],
                    body: [],
                    own: {}
                }, self.state.computing = fnKey;
                var intoId = self.nextId();
                self.recurse(watch, intoId), self["return"](intoId), self.state.inputs.push(fnKey), watch.watchId = key
            }), this.state.computing = "fn", this.stage = "main", this.recurse(ast);
            var fnString = '"' + this.USE + " " + this.STRICT + '";\n' + this.filterPrefix() + "var fn=" + this.generateFunction("fn", "s,l,a,i") + extra + this.watchFns() + "return fn;",
                fn = new Function("$filter", "ensureSafeMemberName", "ensureSafeObject", "ensureSafeFunction", "ifDefined", "plus", "text", fnString)(this.$filter, ensureSafeMemberName, ensureSafeObject, ensureSafeFunction, ifDefined, plusFn, expression);
            return this.state = this.stage = undefined, fn.literal = isLiteral(ast), fn.constant = isConstant(ast), fn
        },
        USE: "use",
        STRICT: "strict",
        watchFns: function() {
            var result = [],
                fns = this.state.inputs,
                self = this;
            return forEach(fns, function(name) {
                result.push("var " + name + "=" + self.generateFunction(name, "s"))
            }), fns.length && result.push("fn.inputs=[" + fns.join(",") + "];"), result.join("")
        },
        generateFunction: function(name, params) {
            return "function(" + params + "){" + this.varsPrefix(name) + this.body(name) + "};"
        },
        filterPrefix: function() {
            var parts = [],
                self = this;
            return forEach(this.state.filters, function(id, filter) {
                parts.push(id + "=$filter(" + self.escape(filter) + ")")
            }), parts.length ? "var " + parts.join(",") + ";" : ""
        },
        varsPrefix: function(section) {
            return this.state[section].vars.length ? "var " + this.state[section].vars.join(",") + ";" : ""
        },
        body: function(section) {
            return this.state[section].body.join("")
        },
        recurse: function(ast, intoId, nameId, recursionFn, create, skipWatchIdCheck) {
            var left, right, args, expression, self = this;
            if (recursionFn = recursionFn || noop, !skipWatchIdCheck && isDefined(ast.watchId)) return intoId = intoId || this.nextId(), void this["if"]("i", this.lazyAssign(intoId, this.computedMember("i", ast.watchId)), this.lazyRecurse(ast, intoId, nameId, recursionFn, create, !0));
            switch (ast.type) {
                case AST.Program:
                    forEach(ast.body, function(expression, pos) {
                        self.recurse(expression.expression, undefined, undefined, function(expr) {
                            right = expr
                        }), pos !== ast.body.length - 1 ? self.current().body.push(right, ";") : self["return"](right)
                    });
                    break;
                case AST.Literal:
                    expression = this.escape(ast.value), this.assign(intoId, expression), recursionFn(expression);
                    break;
                case AST.UnaryExpression:
                    this.recurse(ast.argument, undefined, undefined, function(expr) {
                        right = expr
                    }), expression = ast.operator + "(" + this.ifDefined(right, 0) + ")", this.assign(intoId, expression), recursionFn(expression);
                    break;
                case AST.BinaryExpression:
                    this.recurse(ast.left, undefined, undefined, function(expr) {
                        left = expr
                    }), this.recurse(ast.right, undefined, undefined, function(expr) {
                        right = expr
                    }), expression = "+" === ast.operator ? this.plus(left, right) : "-" === ast.operator ? this.ifDefined(left, 0) + ast.operator + this.ifDefined(right, 0) : "(" + left + ")" + ast.operator + "(" + right + ")", this.assign(intoId, expression), recursionFn(expression);
                    break;
                case AST.LogicalExpression:
                    intoId = intoId || this.nextId(), self.recurse(ast.left, intoId), self["if"]("&&" === ast.operator ? intoId : self.not(intoId), self.lazyRecurse(ast.right, intoId)), recursionFn(intoId);
                    break;
                case AST.ConditionalExpression:
                    intoId = intoId || this.nextId(), self.recurse(ast.test, intoId), self["if"](intoId, self.lazyRecurse(ast.alternate, intoId), self.lazyRecurse(ast.consequent, intoId)), recursionFn(intoId);
                    break;
                case AST.Identifier:
                    intoId = intoId || this.nextId(), nameId && (nameId.context = "inputs" === self.stage ? "s" : this.assign(this.nextId(), this.getHasOwnProperty("l", ast.name) + "?l:s"), nameId.computed = !1, nameId.name = ast.name), ensureSafeMemberName(ast.name), self["if"]("inputs" === self.stage || self.not(self.getHasOwnProperty("l", ast.name)), function() {
                        self["if"]("inputs" === self.stage || "s", function() {
                            create && 1 !== create && self["if"](self.not(self.nonComputedMember("s", ast.name)), self.lazyAssign(self.nonComputedMember("s", ast.name), "{}")), self.assign(intoId, self.nonComputedMember("s", ast.name))
                        })
                    }, intoId && self.lazyAssign(intoId, self.nonComputedMember("l", ast.name))), (self.state.expensiveChecks || isPossiblyDangerousMemberName(ast.name)) && self.addEnsureSafeObject(intoId), recursionFn(intoId);
                    break;
                case AST.MemberExpression:
                    left = nameId && (nameId.context = this.nextId()) || this.nextId(), intoId = intoId || this.nextId(), self.recurse(ast.object, left, undefined, function() {
                        self["if"](self.notNull(left), function() {
                            ast.computed ? (right = self.nextId(), self.recurse(ast.property, right), self.addEnsureSafeMemberName(right), create && 1 !== create && self["if"](self.not(self.computedMember(left, right)), self.lazyAssign(self.computedMember(left, right), "{}")), expression = self.ensureSafeObject(self.computedMember(left, right)), self.assign(intoId, expression), nameId && (nameId.computed = !0, nameId.name = right)) : (ensureSafeMemberName(ast.property.name), create && 1 !== create && self["if"](self.not(self.nonComputedMember(left, ast.property.name)), self.lazyAssign(self.nonComputedMember(left, ast.property.name), "{}")), expression = self.nonComputedMember(left, ast.property.name), (self.state.expensiveChecks || isPossiblyDangerousMemberName(ast.property.name)) && (expression = self.ensureSafeObject(expression)), self.assign(intoId, expression), nameId && (nameId.computed = !1, nameId.name = ast.property.name)), recursionFn(intoId)
                        })
                    }, !!create);
                    break;
                case AST.CallExpression:
                    intoId = intoId || this.nextId(), ast.filter ? (right = self.filter(ast.callee.name), args = [], forEach(ast.arguments, function(expr) {
                        var argument = self.nextId();
                        self.recurse(expr, argument), args.push(argument)
                    }), expression = right + "(" + args.join(",") + ")", self.assign(intoId, expression), recursionFn(intoId)) : (right = self.nextId(), left = {}, args = [], self.recurse(ast.callee, right, left, function() {
                        self["if"](self.notNull(right), function() {
                            self.addEnsureSafeFunction(right), forEach(ast.arguments, function(expr) {
                                self.recurse(expr, self.nextId(), undefined, function(argument) {
                                    args.push(self.ensureSafeObject(argument))
                                })
                            }), left.name ? (self.state.expensiveChecks || self.addEnsureSafeObject(left.context), expression = self.member(left.context, left.name, left.computed) + "(" + args.join(",") + ")") : expression = right + "(" + args.join(",") + ")", expression = self.ensureSafeObject(expression), self.assign(intoId, expression), recursionFn(intoId)
                        })
                    }));
                    break;
                case AST.AssignmentExpression:
                    if (right = this.nextId(), left = {}, !isAssignable(ast.left)) throw $parseMinErr("lval", "Trying to assing a value to a non l-value");
                    this.recurse(ast.left, undefined, left, function() {
                        self["if"](self.notNull(left.context), function() {
                            self.recurse(ast.right, right), self.addEnsureSafeObject(self.member(left.context, left.name, left.computed)), expression = self.member(left.context, left.name, left.computed) + ast.operator + right, self.assign(intoId, expression), recursionFn(intoId || expression)
                        })
                    }, 1);
                    break;
                case AST.ArrayExpression:
                    args = [], forEach(ast.elements, function(expr) {
                        self.recurse(expr, self.nextId(), undefined, function(argument) {
                            args.push(argument)
                        })
                    }), expression = "[" + args.join(",") + "]", this.assign(intoId, expression), recursionFn(expression);
                    break;
                case AST.ObjectExpression:
                    args = [], forEach(ast.properties, function(property) {
                        self.recurse(property.value, self.nextId(), undefined, function(expr) {
                            args.push(self.escape(property.key.type === AST.Identifier ? property.key.name : "" + property.key.value) + ":" + expr)
                        })
                    }), expression = "{" + args.join(",") + "}", this.assign(intoId, expression), recursionFn(expression);
                    break;
                case AST.ThisExpression:
                    this.assign(intoId, "s"), recursionFn("s");
                    break;
                case AST.NGValueParameter:
                    this.assign(intoId, "v"), recursionFn("v")
            }
        },
        getHasOwnProperty: function(element, property) {
            var key = element + "." + property,
                own = this.current().own;
            return own.hasOwnProperty(key) || (own[key] = this.nextId(!1, element + "&&(" + this.escape(property) + " in " + element + ")")), own[key]
        },
        assign: function(id, value) {
            if (id) return this.current().body.push(id, "=", value, ";"), id
        },
        filter: function(filterName) {
            return this.state.filters.hasOwnProperty(filterName) || (this.state.filters[filterName] = this.nextId(!0)), this.state.filters[filterName]
        },
        ifDefined: function(id, defaultValue) {
            return "ifDefined(" + id + "," + this.escape(defaultValue) + ")"
        },
        plus: function(left, right) {
            return "plus(" + left + "," + right + ")"
        },
        "return": function(id) {
            this.current().body.push("return ", id, ";")
        },
        "if": function(test, alternate, consequent) {
            if (test === !0) alternate();
            else {
                var body = this.current().body;
                body.push("if(", test, "){"), alternate(), body.push("}"), consequent && (body.push("else{"), consequent(), body.push("}"))
            }
        },
        not: function(expression) {
            return "!(" + expression + ")"
        },
        notNull: function(expression) {
            return expression + "!=null"
        },
        nonComputedMember: function(left, right) {
            return left + "." + right
        },
        computedMember: function(left, right) {
            return left + "[" + right + "]"
        },
        member: function(left, right, computed) {
            return computed ? this.computedMember(left, right) : this.nonComputedMember(left, right)
        },
        addEnsureSafeObject: function(item) {
            this.current().body.push(this.ensureSafeObject(item), ";")
        },
        addEnsureSafeMemberName: function(item) {
            this.current().body.push(this.ensureSafeMemberName(item), ";")
        },
        addEnsureSafeFunction: function(item) {
            this.current().body.push(this.ensureSafeFunction(item), ";")
        },
        ensureSafeObject: function(item) {
            return "ensureSafeObject(" + item + ",text)"
        },
        ensureSafeMemberName: function(item) {
            return "ensureSafeMemberName(" + item + ",text)"
        },
        ensureSafeFunction: function(item) {
            return "ensureSafeFunction(" + item + ",text)"
        },
        lazyRecurse: function(ast, intoId, nameId, recursionFn, create, skipWatchIdCheck) {
            var self = this;
            return function() {
                self.recurse(ast, intoId, nameId, recursionFn, create, skipWatchIdCheck)
            }
        },
        lazyAssign: function(id, value) {
            var self = this;
            return function() {
                self.assign(id, value)
            }
        },
        stringEscapeRegex: /[^ a-zA-Z0-9]/g,
        stringEscapeFn: function(c) {
            return "\\u" + ("0000" + c.charCodeAt(0).toString(16)).slice(-4)
        },
        escape: function(value) {
            if (isString(value)) return "'" + value.replace(this.stringEscapeRegex, this.stringEscapeFn) + "'";
            if (isNumber(value)) return value.toString();
            if (value === !0) return "true";
            if (value === !1) return "false";
            if (null === value) return "null";
            if ("undefined" == typeof value) return "undefined";
            throw $parseMinErr("esc", "IMPOSSIBLE")
        },
        nextId: function(skip, init) {
            var id = "v" + this.state.nextId++;
            return skip || this.current().vars.push(id + (init ? "=" + init : "")), id
        },
        current: function() {
            return this.state[this.state.computing]
        }
    }, ASTInterpreter.prototype = {
        compile: function(expression, expensiveChecks) {
            var self = this,
                ast = this.astBuilder.ast(expression);
            this.expression = expression, this.expensiveChecks = expensiveChecks, findConstantAndWatchExpressions(ast, self.$filter);
            var assignable, assign;
            (assignable = assignableAST(ast)) && (assign = this.recurse(assignable));
            var inputs, toWatch = getInputs(ast.body);
            toWatch && (inputs = [], forEach(toWatch, function(watch, key) {
                var input = self.recurse(watch);
                watch.input = input, inputs.push(input), watch.watchId = key
            }));
            var expressions = [];
            forEach(ast.body, function(expression) {
                expressions.push(self.recurse(expression.expression))
            });
            var fn = 0 === ast.body.length ? function() {} : 1 === ast.body.length ? expressions[0] : function(scope, locals) {
                var lastValue;
                return forEach(expressions, function(exp) {
                    lastValue = exp(scope, locals)
                }), lastValue
            };
            return assign && (fn.assign = function(scope, value, locals) {
                return assign(scope, locals, value)
            }), inputs && (fn.inputs = inputs), fn.literal = isLiteral(ast), fn.constant = isConstant(ast), fn
        },
        recurse: function(ast, context, create) {
            var left, right, args, self = this;
            if (ast.input) return this.inputs(ast.input, ast.watchId);
            switch (ast.type) {
                case AST.Literal:
                    return this.value(ast.value, context);
                case AST.UnaryExpression:
                    return right = this.recurse(ast.argument), this["unary" + ast.operator](right, context);
                case AST.BinaryExpression:
                    return left = this.recurse(ast.left), right = this.recurse(ast.right), this["binary" + ast.operator](left, right, context);
                case AST.LogicalExpression:
                    return left = this.recurse(ast.left), right = this.recurse(ast.right), this["binary" + ast.operator](left, right, context);
                case AST.ConditionalExpression:
                    return this["ternary?:"](this.recurse(ast.test), this.recurse(ast.alternate), this.recurse(ast.consequent), context);
                case AST.Identifier:
                    return ensureSafeMemberName(ast.name, self.expression), self.identifier(ast.name, self.expensiveChecks || isPossiblyDangerousMemberName(ast.name), context, create, self.expression);
                case AST.MemberExpression:
                    return left = this.recurse(ast.object, !1, !!create), ast.computed || (ensureSafeMemberName(ast.property.name, self.expression), right = ast.property.name), ast.computed && (right = this.recurse(ast.property)), ast.computed ? this.computedMember(left, right, context, create, self.expression) : this.nonComputedMember(left, right, self.expensiveChecks, context, create, self.expression);
                case AST.CallExpression:
                    return args = [], forEach(ast.arguments, function(expr) {
                        args.push(self.recurse(expr))
                    }), ast.filter && (right = this.$filter(ast.callee.name)), ast.filter || (right = this.recurse(ast.callee, !0)), ast.filter ? function(scope, locals, assign, inputs) {
                        for (var values = [], i = 0; i < args.length; ++i) values.push(args[i](scope, locals, assign, inputs));
                        var value = right.apply(undefined, values, inputs);
                        return context ? {
                            context: undefined,
                            name: undefined,
                            value: value
                        } : value
                    } : function(scope, locals, assign, inputs) {
                        var value, rhs = right(scope, locals, assign, inputs);
                        if (null != rhs.value) {
                            ensureSafeObject(rhs.context, self.expression), ensureSafeFunction(rhs.value, self.expression);
                            for (var values = [], i = 0; i < args.length; ++i) values.push(ensureSafeObject(args[i](scope, locals, assign, inputs), self.expression));
                            value = ensureSafeObject(rhs.value.apply(rhs.context, values), self.expression)
                        }
                        return context ? {
                            value: value
                        } : value
                    };
                case AST.AssignmentExpression:
                    return left = this.recurse(ast.left, !0, 1), right = this.recurse(ast.right),
                        function(scope, locals, assign, inputs) {
                            var lhs = left(scope, locals, assign, inputs),
                                rhs = right(scope, locals, assign, inputs);
                            return ensureSafeObject(lhs.value, self.expression), lhs.context[lhs.name] = rhs, context ? {
                                value: rhs
                            } : rhs
                        };
                case AST.ArrayExpression:
                    return args = [], forEach(ast.elements, function(expr) {
                            args.push(self.recurse(expr))
                        }),
                        function(scope, locals, assign, inputs) {
                            for (var value = [], i = 0; i < args.length; ++i) value.push(args[i](scope, locals, assign, inputs));
                            return context ? {
                                value: value
                            } : value
                        };
                case AST.ObjectExpression:
                    return args = [], forEach(ast.properties, function(property) {
                            args.push({
                                key: property.key.type === AST.Identifier ? property.key.name : "" + property.key.value,
                                value: self.recurse(property.value)
                            })
                        }),
                        function(scope, locals, assign, inputs) {
                            for (var value = {}, i = 0; i < args.length; ++i) value[args[i].key] = args[i].value(scope, locals, assign, inputs);
                            return context ? {
                                value: value
                            } : value
                        };
                case AST.ThisExpression:
                    return function(scope) {
                        return context ? {
                            value: scope
                        } : scope
                    };
                case AST.NGValueParameter:
                    return function(scope, locals, assign, inputs) {
                        return context ? {
                            value: assign
                        } : assign
                    }
            }
        },
        "unary+": function(argument, context) {
            return function(scope, locals, assign, inputs) {
                var arg = argument(scope, locals, assign, inputs);
                return arg = isDefined(arg) ? +arg : 0, context ? {
                    value: arg
                } : arg
            }
        },
        "unary-": function(argument, context) {
            return function(scope, locals, assign, inputs) {
                var arg = argument(scope, locals, assign, inputs);
                return arg = isDefined(arg) ? -arg : 0, context ? {
                    value: arg
                } : arg
            }
        },
        "unary!": function(argument, context) {
            return function(scope, locals, assign, inputs) {
                var arg = !argument(scope, locals, assign, inputs);
                return context ? {
                    value: arg
                } : arg
            }
        },
        "binary+": function(left, right, context) {
            return function(scope, locals, assign, inputs) {
                var lhs = left(scope, locals, assign, inputs),
                    rhs = right(scope, locals, assign, inputs),
                    arg = plusFn(lhs, rhs);
                return context ? {
                    value: arg
                } : arg
            }
        },
        "binary-": function(left, right, context) {
            return function(scope, locals, assign, inputs) {
                var lhs = left(scope, locals, assign, inputs),
                    rhs = right(scope, locals, assign, inputs),
                    arg = (isDefined(lhs) ? lhs : 0) - (isDefined(rhs) ? rhs : 0);
                return context ? {
                    value: arg
                } : arg
            }
        },
        "binary*": function(left, right, context) {
            return function(scope, locals, assign, inputs) {
                var arg = left(scope, locals, assign, inputs) * right(scope, locals, assign, inputs);
                return context ? {
                    value: arg
                } : arg
            }
        },
        "binary/": function(left, right, context) {
            return function(scope, locals, assign, inputs) {
                var arg = left(scope, locals, assign, inputs) / right(scope, locals, assign, inputs);
                return context ? {
                    value: arg
                } : arg
            }
        },
        "binary%": function(left, right, context) {
            return function(scope, locals, assign, inputs) {
                var arg = left(scope, locals, assign, inputs) % right(scope, locals, assign, inputs);
                return context ? {
                    value: arg
                } : arg
            }
        },
        "binary===": function(left, right, context) {
            return function(scope, locals, assign, inputs) {
                var arg = left(scope, locals, assign, inputs) === right(scope, locals, assign, inputs);
                return context ? {
                    value: arg
                } : arg
            }
        },
        "binary!==": function(left, right, context) {
            return function(scope, locals, assign, inputs) {
                var arg = left(scope, locals, assign, inputs) !== right(scope, locals, assign, inputs);
                return context ? {
                    value: arg
                } : arg
            }
        },
        "binary==": function(left, right, context) {
            return function(scope, locals, assign, inputs) {
                var arg = left(scope, locals, assign, inputs) == right(scope, locals, assign, inputs);
                return context ? {
                    value: arg
                } : arg
            }
        },
        "binary!=": function(left, right, context) {
            return function(scope, locals, assign, inputs) {
                var arg = left(scope, locals, assign, inputs) != right(scope, locals, assign, inputs);
                return context ? {
                    value: arg
                } : arg
            }
        },
        "binary<": function(left, right, context) {
            return function(scope, locals, assign, inputs) {
                var arg = left(scope, locals, assign, inputs) < right(scope, locals, assign, inputs);
                return context ? {
                    value: arg
                } : arg
            }
        },
        "binary>": function(left, right, context) {
            return function(scope, locals, assign, inputs) {
                var arg = left(scope, locals, assign, inputs) > right(scope, locals, assign, inputs);
                return context ? {
                    value: arg
                } : arg
            }
        },
        "binary<=": function(left, right, context) {
            return function(scope, locals, assign, inputs) {
                var arg = left(scope, locals, assign, inputs) <= right(scope, locals, assign, inputs);
                return context ? {
                    value: arg
                } : arg
            }
        },
        "binary>=": function(left, right, context) {
            return function(scope, locals, assign, inputs) {
                var arg = left(scope, locals, assign, inputs) >= right(scope, locals, assign, inputs);
                return context ? {
                    value: arg
                } : arg
            }
        },
        "binary&&": function(left, right, context) {
            return function(scope, locals, assign, inputs) {
                var arg = left(scope, locals, assign, inputs) && right(scope, locals, assign, inputs);
                return context ? {
                    value: arg
                } : arg
            }
        },
        "binary||": function(left, right, context) {
            return function(scope, locals, assign, inputs) {
                var arg = left(scope, locals, assign, inputs) || right(scope, locals, assign, inputs);
                return context ? {
                    value: arg
                } : arg
            }
        },
        "ternary?:": function(test, alternate, consequent, context) {
            return function(scope, locals, assign, inputs) {
                var arg = test(scope, locals, assign, inputs) ? alternate(scope, locals, assign, inputs) : consequent(scope, locals, assign, inputs);
                return context ? {
                    value: arg
                } : arg
            }
        },
        value: function(value, context) {
            return function() {
                return context ? {
                    context: undefined,
                    name: undefined,
                    value: value
                } : value
            }
        },
        identifier: function(name, expensiveChecks, context, create, expression) {
            return function(scope, locals, assign, inputs) {
                var base = locals && name in locals ? locals : scope;
                create && 1 !== create && base && !base[name] && (base[name] = {});
                var value = base ? base[name] : undefined;
                return expensiveChecks && ensureSafeObject(value, expression), context ? {
                    context: base,
                    name: name,
                    value: value
                } : value
            }
        },
        computedMember: function(left, right, context, create, expression) {
            return function(scope, locals, assign, inputs) {
                var rhs, value, lhs = left(scope, locals, assign, inputs);
                return null != lhs && (rhs = right(scope, locals, assign, inputs), ensureSafeMemberName(rhs, expression), create && 1 !== create && lhs && !lhs[rhs] && (lhs[rhs] = {}), value = lhs[rhs], ensureSafeObject(value, expression)), context ? {
                    context: lhs,
                    name: rhs,
                    value: value
                } : value
            }
        },
        nonComputedMember: function(left, right, expensiveChecks, context, create, expression) {
            return function(scope, locals, assign, inputs) {
                var lhs = left(scope, locals, assign, inputs);
                create && 1 !== create && lhs && !lhs[right] && (lhs[right] = {});
                var value = null != lhs ? lhs[right] : undefined;
                return (expensiveChecks || isPossiblyDangerousMemberName(right)) && ensureSafeObject(value, expression), context ? {
                    context: lhs,
                    name: right,
                    value: value
                } : value
            }
        },
        inputs: function(input, watchId) {
            return function(scope, value, locals, inputs) {
                return inputs ? inputs[watchId] : input(scope, value, locals)
            }
        }
    };
    var Parser = function(lexer, $filter, options) {
        this.lexer = lexer, this.$filter = $filter, this.options = options, this.ast = new AST(this.lexer), this.astCompiler = options.csp ? new ASTInterpreter(this.ast, $filter) : new ASTCompiler(this.ast, $filter)
    };
    Parser.prototype = {
        constructor: Parser,
        parse: function(text) {
            return this.astCompiler.compile(text, this.options.expensiveChecks)
        }
    };
    var objectValueOf = (createMap(), createMap(), Object.prototype.valueOf),
        $sceMinErr = minErr("$sce"),
        SCE_CONTEXTS = {
            HTML: "html",
            CSS: "css",
            URL: "url",
            RESOURCE_URL: "resourceUrl",
            JS: "js"
        },
        $compileMinErr = minErr("$compile"),
        urlParsingNode = document.createElement("a"),
        originUrl = urlResolve(window.location.href);
    $$CookieReader.$inject = ["$document"], $FilterProvider.$inject = ["$provide"], currencyFilter.$inject = ["$locale"], numberFilter.$inject = ["$locale"];
    var DECIMAL_SEP = ".",
        DATE_FORMATS = {
            yyyy: dateGetter("FullYear", 4),
            yy: dateGetter("FullYear", 2, 0, !0),
            y: dateGetter("FullYear", 1),
            MMMM: dateStrGetter("Month"),
            MMM: dateStrGetter("Month", !0),
            MM: dateGetter("Month", 2, 1),
            M: dateGetter("Month", 1, 1),
            dd: dateGetter("Date", 2),
            d: dateGetter("Date", 1),
            HH: dateGetter("Hours", 2),
            H: dateGetter("Hours", 1),
            hh: dateGetter("Hours", 2, -12),
            h: dateGetter("Hours", 1, -12),
            mm: dateGetter("Minutes", 2),
            m: dateGetter("Minutes", 1),
            ss: dateGetter("Seconds", 2),
            s: dateGetter("Seconds", 1),
            sss: dateGetter("Milliseconds", 3),
            EEEE: dateStrGetter("Day"),
            EEE: dateStrGetter("Day", !0),
            a: ampmGetter,
            Z: timeZoneGetter,
            ww: weekGetter(2),
            w: weekGetter(1),
            G: eraGetter,
            GG: eraGetter,
            GGG: eraGetter,
            GGGG: longEraGetter
        },
        DATE_FORMATS_SPLIT = /((?:[^yMdHhmsaZEwG']+)|(?:'(?:[^']|'')*')|(?:E+|y+|M+|d+|H+|h+|m+|s+|a|Z|G+|w+))(.*)/,
        NUMBER_STRING = /^\-?\d+$/;
    dateFilter.$inject = ["$locale"];
    var lowercaseFilter = valueFn(lowercase),
        uppercaseFilter = valueFn(uppercase);
    orderByFilter.$inject = ["$parse"];
    var htmlAnchorDirective = valueFn({
            restrict: "E",
            compile: function(element, attr) {
                if (!attr.href && !attr.xlinkHref) return function(scope, element) {
                    if ("a" === element[0].nodeName.toLowerCase()) {
                        var href = "[object SVGAnimatedString]" === toString.call(element.prop("href")) ? "xlink:href" : "href";
                        element.on("click", function(event) {
                            element.attr(href) || event.preventDefault()
                        })
                    }
                }
            }
        }),
        ngAttributeAliasDirectives = {};
    forEach(BOOLEAN_ATTR, function(propName, attrName) {
        function defaultLinkFn(scope, element, attr) {
            scope.$watch(attr[normalized], function(value) {
                attr.$set(attrName, !!value)
            })
        }
        if ("multiple" != propName) {
            var normalized = directiveNormalize("ng-" + attrName),
                linkFn = defaultLinkFn;
            "checked" === propName && (linkFn = function(scope, element, attr) {
                attr.ngModel !== attr[normalized] && defaultLinkFn(scope, element, attr)
            }), ngAttributeAliasDirectives[normalized] = function() {
                return {
                    restrict: "A",
                    priority: 100,
                    link: linkFn
                }
            }
        }
    }), forEach(ALIASED_ATTR, function(htmlAttr, ngAttr) {
        ngAttributeAliasDirectives[ngAttr] = function() {
            return {
                priority: 100,
                link: function(scope, element, attr) {
                    if ("ngPattern" === ngAttr && "/" == attr.ngPattern.charAt(0)) {
                        var match = attr.ngPattern.match(REGEX_STRING_REGEXP);
                        if (match) return void attr.$set("ngPattern", new RegExp(match[1], match[2]))
                    }
                    scope.$watch(attr[ngAttr], function(value) {
                        attr.$set(ngAttr, value)
                    })
                }
            }
        }
    }), forEach(["src", "srcset", "href"], function(attrName) {
        var normalized = directiveNormalize("ng-" + attrName);
        ngAttributeAliasDirectives[normalized] = function() {
            return {
                priority: 99,
                link: function(scope, element, attr) {
                    var propName = attrName,
                        name = attrName;
                    "href" === attrName && "[object SVGAnimatedString]" === toString.call(element.prop("href")) && (name = "xlinkHref", attr.$attr[name] = "xlink:href", propName = null), attr.$observe(normalized, function(value) {
                        return value ? (attr.$set(name, value), void(msie && propName && element.prop(propName, attr[name]))) : void("href" === attrName && attr.$set(name, null))
                    })
                }
            }
        }
    });
    var nullFormCtrl = {
            $addControl: noop,
            $$renameControl: nullFormRenameControl,
            $removeControl: noop,
            $setValidity: noop,
            $setDirty: noop,
            $setPristine: noop,
            $setSubmitted: noop
        },
        SUBMITTED_CLASS = "ng-submitted";
    FormController.$inject = ["$element", "$attrs", "$scope", "$animate", "$interpolate"];
    var formDirectiveFactory = function(isNgForm) {
            return ["$timeout", function($timeout) {
                var formDirective = {
                    name: "form",
                    restrict: isNgForm ? "EAC" : "E",
                    controller: FormController,
                    compile: function(formElement, attr) {
                        formElement.addClass(PRISTINE_CLASS).addClass(VALID_CLASS);
                        var nameAttr = attr.name ? "name" : !(!isNgForm || !attr.ngForm) && "ngForm";
                        return {
                            pre: function(scope, formElement, attr, controller) {
                                if (!("action" in attr)) {
                                    var handleFormSubmission = function(event) {
                                        scope.$apply(function() {
                                            controller.$commitViewValue(), controller.$setSubmitted()
                                        }), event.preventDefault()
                                    };
                                    addEventListenerFn(formElement[0], "submit", handleFormSubmission), formElement.on("$destroy", function() {
                                        $timeout(function() {
                                            removeEventListenerFn(formElement[0], "submit", handleFormSubmission)
                                        }, 0, !1)
                                    })
                                }
                                var parentFormCtrl = controller.$$parentForm;
                                nameAttr && (setter(scope, controller.$name, controller, controller.$name), attr.$observe(nameAttr, function(newValue) {
                                    controller.$name !== newValue && (setter(scope, controller.$name, undefined, controller.$name), parentFormCtrl.$$renameControl(controller, newValue), setter(scope, controller.$name, controller, controller.$name))
                                })), formElement.on("$destroy", function() {
                                    parentFormCtrl.$removeControl(controller), nameAttr && setter(scope, attr[nameAttr], undefined, controller.$name), extend(controller, nullFormCtrl)
                                })
                            }
                        }
                    }
                };
                return formDirective
            }]
        },
        formDirective = formDirectiveFactory(),
        ngFormDirective = formDirectiveFactory(!0),
        ISO_DATE_REGEXP = /\d{4}-[01]\d-[0-3]\dT[0-2]\d:[0-5]\d:[0-5]\d\.\d+([+-][0-2]\d:[0-5]\d|Z)/,
        URL_REGEXP = /^(ftp|http|https):\/\/(\w+:{0,1}\w*@)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-\/]))?$/,
        EMAIL_REGEXP = /^[a-z0-9!#$%&'*+\/=?^_`{|}~.-]+@[a-z0-9]([a-z0-9-]*[a-z0-9])?(\.[a-z0-9]([a-z0-9-]*[a-z0-9])?)*$/i,
        NUMBER_REGEXP = /^\s*(\-|\+)?(\d+|(\d*(\.\d*)))\s*$/,
        DATE_REGEXP = /^(\d{4})-(\d{2})-(\d{2})$/,
        DATETIMELOCAL_REGEXP = /^(\d{4})-(\d\d)-(\d\d)T(\d\d):(\d\d)(?::(\d\d)(\.\d{1,3})?)?$/,
        WEEK_REGEXP = /^(\d{4})-W(\d\d)$/,
        MONTH_REGEXP = /^(\d{4})-(\d\d)$/,
        TIME_REGEXP = /^(\d\d):(\d\d)(?::(\d\d)(\.\d{1,3})?)?$/,
        inputType = {
            text: textInputType,
            date: createDateInputType("date", DATE_REGEXP, createDateParser(DATE_REGEXP, ["yyyy", "MM", "dd"]), "yyyy-MM-dd"),
            "datetime-local": createDateInputType("datetimelocal", DATETIMELOCAL_REGEXP, createDateParser(DATETIMELOCAL_REGEXP, ["yyyy", "MM", "dd", "HH", "mm", "ss", "sss"]), "yyyy-MM-ddTHH:mm:ss.sss"),
            time: createDateInputType("time", TIME_REGEXP, createDateParser(TIME_REGEXP, ["HH", "mm", "ss", "sss"]), "HH:mm:ss.sss"),
            week: createDateInputType("week", WEEK_REGEXP, weekParser, "yyyy-Www"),
            month: createDateInputType("month", MONTH_REGEXP, createDateParser(MONTH_REGEXP, ["yyyy", "MM"]), "yyyy-MM"),
            number: numberInputType,
            url: urlInputType,
            email: emailInputType,
            radio: radioInputType,
            checkbox: checkboxInputType,
            hidden: noop,
            button: noop,
            submit: noop,
            reset: noop,
            file: noop
        },
        inputDirective = ["$browser", "$sniffer", "$filter", "$parse", function($browser, $sniffer, $filter, $parse) {
            return {
                restrict: "E",
                require: ["?ngModel"],
                link: {
                    pre: function(scope, element, attr, ctrls) {
                        ctrls[0] && (inputType[lowercase(attr.type)] || inputType.text)(scope, element, attr, ctrls[0], $sniffer, $browser, $filter, $parse)
                    }
                }
            }
        }],
        CONSTANT_VALUE_REGEXP = /^(true|false|\d+)$/,
        ngValueDirective = function() {
            return {
                restrict: "A",
                priority: 100,
                compile: function(tpl, tplAttr) {
                    return CONSTANT_VALUE_REGEXP.test(tplAttr.ngValue) ? function(scope, elm, attr) {
                        attr.$set("value", scope.$eval(attr.ngValue))
                    } : function(scope, elm, attr) {
                        scope.$watch(attr.ngValue, function(value) {
                            attr.$set("value", value)
                        })
                    }
                }
            }
        },
        ngBindDirective = ["$compile", function($compile) {
            return {
                restrict: "AC",
                compile: function(templateElement) {
                    return $compile.$$addBindingClass(templateElement),
                        function(scope, element, attr) {
                            $compile.$$addBindingInfo(element, attr.ngBind), element = element[0], scope.$watch(attr.ngBind, function(value) {
                                element.textContent = value === undefined ? "" : value
                            })
                        }
                }
            }
        }],
        ngBindTemplateDirective = ["$interpolate", "$compile", function($interpolate, $compile) {
            return {
                compile: function(templateElement) {
                    return $compile.$$addBindingClass(templateElement),
                        function(scope, element, attr) {
                            var interpolateFn = $interpolate(element.attr(attr.$attr.ngBindTemplate));
                            $compile.$$addBindingInfo(element, interpolateFn.expressions), element = element[0], attr.$observe("ngBindTemplate", function(value) {
                                element.textContent = value === undefined ? "" : value
                            })
                        }
                }
            }
        }],
        ngBindHtmlDirective = ["$sce", "$parse", "$compile", function($sce, $parse, $compile) {
            return {
                restrict: "A",
                compile: function(tElement, tAttrs) {
                    var ngBindHtmlGetter = $parse(tAttrs.ngBindHtml),
                        ngBindHtmlWatch = $parse(tAttrs.ngBindHtml, function(value) {
                            return (value || "").toString()
                        });
                    return $compile.$$addBindingClass(tElement),
                        function(scope, element, attr) {
                            $compile.$$addBindingInfo(element, attr.ngBindHtml), scope.$watch(ngBindHtmlWatch, function() {
                                element.html($sce.getTrustedHtml(ngBindHtmlGetter(scope)) || "")
                            })
                        }
                }
            }
        }],
        ngChangeDirective = valueFn({
            restrict: "A",
            require: "ngModel",
            link: function(scope, element, attr, ctrl) {
                ctrl.$viewChangeListeners.push(function() {
                    scope.$eval(attr.ngChange)
                })
            }
        }),
        ngClassDirective = classDirective("", !0),
        ngClassOddDirective = classDirective("Odd", 0),
        ngClassEvenDirective = classDirective("Even", 1),
        ngCloakDirective = ngDirective({
            compile: function(element, attr) {
                attr.$set("ngCloak", undefined), element.removeClass("ng-cloak")
            }
        }),
        ngControllerDirective = [function() {
            return {
                restrict: "A",
                scope: !0,
                controller: "@",
                priority: 500
            }
        }],
        ngEventDirectives = {},
        forceAsyncEvents = {
            blur: !0,
            focus: !0
        };
    forEach("click dblclick mousedown mouseup mouseover mouseout mousemove mouseenter mouseleave keydown keyup keypress submit focus blur copy cut paste".split(" "), function(eventName) {
        var directiveName = directiveNormalize("ng-" + eventName);
        ngEventDirectives[directiveName] = ["$parse", "$rootScope", function($parse, $rootScope) {
            return {
                restrict: "A",
                compile: function($element, attr) {
                    var fn = $parse(attr[directiveName], null, !0);
                    return function(scope, element) {
                        element.on(eventName, function(event) {
                            var callback = function() {
                                fn(scope, {
                                    $event: event
                                })
                            };
                            forceAsyncEvents[eventName] && $rootScope.$$phase ? scope.$evalAsync(callback) : scope.$apply(callback)
                        })
                    }
                }
            }
        }]
    });
    var ngIfDirective = ["$animate", function($animate) {
            return {
                multiElement: !0,
                transclude: "element",
                priority: 600,
                terminal: !0,
                restrict: "A",
                $$tlb: !0,
                link: function($scope, $element, $attr, ctrl, $transclude) {
                    var block, childScope, previousElements;
                    $scope.$watch($attr.ngIf, function(value) {
                        value ? childScope || $transclude(function(clone, newScope) {
                            childScope = newScope, clone[clone.length++] = document.createComment(" end ngIf: " + $attr.ngIf + " "), block = {
                                clone: clone
                            }, $animate.enter(clone, $element.parent(), $element)
                        }) : (previousElements && (previousElements.remove(), previousElements = null), childScope && (childScope.$destroy(), childScope = null), block && (previousElements = getBlockNodes(block.clone), $animate.leave(previousElements).then(function() {
                            previousElements = null
                        }), block = null))
                    })
                }
            }
        }],
        ngIncludeDirective = ["$templateRequest", "$anchorScroll", "$animate", "$sce", function($templateRequest, $anchorScroll, $animate, $sce) {
            return {
                restrict: "ECA",
                priority: 400,
                terminal: !0,
                transclude: "element",
                controller: angular.noop,
                compile: function(element, attr) {
                    var srcExp = attr.ngInclude || attr.src,
                        onloadExp = attr.onload || "",
                        autoScrollExp = attr.autoscroll;
                    return function(scope, $element, $attr, ctrl, $transclude) {
                        var currentScope, previousElement, currentElement, changeCounter = 0,
                            cleanupLastIncludeContent = function() {
                                previousElement && (previousElement.remove(), previousElement = null), currentScope && (currentScope.$destroy(), currentScope = null), currentElement && ($animate.leave(currentElement).then(function() {
                                    previousElement = null
                                }), previousElement = currentElement, currentElement = null)
                            };
                        scope.$watch($sce.parseAsResourceUrl(srcExp), function(src) {
                            var afterAnimation = function() {
                                    !isDefined(autoScrollExp) || autoScrollExp && !scope.$eval(autoScrollExp) || $anchorScroll()
                                },
                                thisChangeId = ++changeCounter;
                            src ? ($templateRequest(src, !0).then(function(response) {
                                if (thisChangeId === changeCounter) {
                                    var newScope = scope.$new();
                                    ctrl.template = response;
                                    var clone = $transclude(newScope, function(clone) {
                                        cleanupLastIncludeContent(), $animate.enter(clone, null, $element).then(afterAnimation)
                                    });
                                    currentScope = newScope, currentElement = clone, currentScope.$emit("$includeContentLoaded", src), scope.$eval(onloadExp)
                                }
                            }, function() {
                                thisChangeId === changeCounter && (cleanupLastIncludeContent(), scope.$emit("$includeContentError", src))
                            }), scope.$emit("$includeContentRequested", src)) : (cleanupLastIncludeContent(), ctrl.template = null)
                        })
                    }
                }
            }
        }],
        ngIncludeFillContentDirective = ["$compile", function($compile) {
            return {
                restrict: "ECA",
                priority: -400,
                require: "ngInclude",
                link: function(scope, $element, $attr, ctrl) {
                    return /SVG/.test($element[0].toString()) ? ($element.empty(), void $compile(jqLiteBuildFragment(ctrl.template, document).childNodes)(scope, function(clone) {
                        $element.append(clone)
                    }, {
                        futureParentElement: $element
                    })) : ($element.html(ctrl.template), void $compile($element.contents())(scope))
                }
            }
        }],
        ngInitDirective = ngDirective({
            priority: 450,
            compile: function() {
                return {
                    pre: function(scope, element, attrs) {
                        scope.$eval(attrs.ngInit)
                    }
                }
            }
        }),
        ngListDirective = function() {
            return {
                restrict: "A",
                priority: 100,
                require: "ngModel",
                link: function(scope, element, attr, ctrl) {
                    var ngList = element.attr(attr.$attr.ngList) || ", ",
                        trimValues = "false" !== attr.ngTrim,
                        separator = trimValues ? trim(ngList) : ngList,
                        parse = function(viewValue) {
                            if (!isUndefined(viewValue)) {
                                var list = [];
                                return viewValue && forEach(viewValue.split(separator), function(value) {
                                    value && list.push(trimValues ? trim(value) : value)
                                }), list
                            }
                        };
                    ctrl.$parsers.push(parse), ctrl.$formatters.push(function(value) {
                        return isArray(value) ? value.join(ngList) : undefined
                    }), ctrl.$isEmpty = function(value) {
                        return !value || !value.length
                    }
                }
            }
        },
        VALID_CLASS = "ng-valid",
        INVALID_CLASS = "ng-invalid",
        PRISTINE_CLASS = "ng-pristine",
        DIRTY_CLASS = "ng-dirty",
        UNTOUCHED_CLASS = "ng-untouched",
        TOUCHED_CLASS = "ng-touched",
        PENDING_CLASS = "ng-pending",
        $ngModelMinErr = new minErr("ngModel"),
        NgModelController = ["$scope", "$exceptionHandler", "$attrs", "$element", "$parse", "$animate", "$timeout", "$rootScope", "$q", "$interpolate", function($scope, $exceptionHandler, $attr, $element, $parse, $animate, $timeout, $rootScope, $q, $interpolate) {
            this.$viewValue = Number.NaN, this.$modelValue = Number.NaN, this.$$rawModelValue = undefined, this.$validators = {}, this.$asyncValidators = {}, this.$parsers = [], this.$formatters = [], this.$viewChangeListeners = [], this.$untouched = !0, this.$touched = !1, this.$pristine = !0, this.$dirty = !1, this.$valid = !0, this.$invalid = !1, this.$error = {}, this.$$success = {}, this.$pending = undefined, this.$name = $interpolate($attr.name || "", !1)($scope);
            var parserValid, parsedNgModel = $parse($attr.ngModel),
                parsedNgModelAssign = parsedNgModel.assign,
                ngModelGet = parsedNgModel,
                ngModelSet = parsedNgModelAssign,
                pendingDebounce = null,
                ctrl = this;
            this.$$setOptions = function(options) {
                if (ctrl.$options = options, options && options.getterSetter) {
                    var invokeModelGetter = $parse($attr.ngModel + "()"),
                        invokeModelSetter = $parse($attr.ngModel + "($$$p)");
                    ngModelGet = function($scope) {
                        var modelValue = parsedNgModel($scope);
                        return isFunction(modelValue) && (modelValue = invokeModelGetter($scope)), modelValue
                    }, ngModelSet = function($scope, newValue) {
                        isFunction(parsedNgModel($scope)) ? invokeModelSetter($scope, {
                            $$$p: ctrl.$modelValue
                        }) : parsedNgModelAssign($scope, ctrl.$modelValue)
                    }
                } else if (!parsedNgModel.assign) throw $ngModelMinErr("nonassign", "Expression '{0}' is non-assignable. Element: {1}", $attr.ngModel, startingTag($element))
            }, this.$render = noop, this.$isEmpty = function(value) {
                return isUndefined(value) || "" === value || null === value || value !== value
            };
            var parentForm = $element.inheritedData("$formController") || nullFormCtrl,
                currentValidationRunId = 0;
            addSetValidityMethod({
                ctrl: this,
                $element: $element,
                set: function(object, property) {
                    object[property] = !0
                },
                unset: function(object, property) {
                    delete object[property]
                },
                parentForm: parentForm,
                $animate: $animate
            }), this.$setPristine = function() {
                ctrl.$dirty = !1, ctrl.$pristine = !0, $animate.removeClass($element, DIRTY_CLASS), $animate.addClass($element, PRISTINE_CLASS)
            }, this.$setDirty = function() {
                ctrl.$dirty = !0, ctrl.$pristine = !1, $animate.removeClass($element, PRISTINE_CLASS), $animate.addClass($element, DIRTY_CLASS), parentForm.$setDirty()
            }, this.$setUntouched = function() {
                ctrl.$touched = !1, ctrl.$untouched = !0, $animate.setClass($element, UNTOUCHED_CLASS, TOUCHED_CLASS)
            }, this.$setTouched = function() {
                ctrl.$touched = !0, ctrl.$untouched = !1, $animate.setClass($element, TOUCHED_CLASS, UNTOUCHED_CLASS)
            }, this.$rollbackViewValue = function() {
                $timeout.cancel(pendingDebounce), ctrl.$viewValue = ctrl.$$lastCommittedViewValue, ctrl.$render()
            }, this.$validate = function() {
                if (!isNumber(ctrl.$modelValue) || !isNaN(ctrl.$modelValue)) {
                    var viewValue = ctrl.$$lastCommittedViewValue,
                        modelValue = ctrl.$$rawModelValue,
                        prevValid = ctrl.$valid,
                        prevModelValue = ctrl.$modelValue,
                        allowInvalid = ctrl.$options && ctrl.$options.allowInvalid;
                    ctrl.$$runValidators(modelValue, viewValue, function(allValid) {
                        allowInvalid || prevValid === allValid || (ctrl.$modelValue = allValid ? modelValue : undefined, ctrl.$modelValue !== prevModelValue && ctrl.$$writeModelToScope())
                    })
                }
            }, this.$$runValidators = function(modelValue, viewValue, doneCallback) {
                function processParseErrors() {
                    var errorKey = ctrl.$$parserName || "parse";
                    return parserValid !== undefined ? (parserValid || (forEach(ctrl.$validators, function(v, name) {
                        setValidity(name, null)
                    }), forEach(ctrl.$asyncValidators, function(v, name) {
                        setValidity(name, null)
                    })), setValidity(errorKey, parserValid), parserValid) : (setValidity(errorKey, null), !0)
                }

                function processSyncValidators() {
                    var syncValidatorsValid = !0;
                    return forEach(ctrl.$validators, function(validator, name) {
                        var result = validator(modelValue, viewValue);
                        syncValidatorsValid = syncValidatorsValid && result, setValidity(name, result)
                    }), !!syncValidatorsValid || (forEach(ctrl.$asyncValidators, function(v, name) {
                        setValidity(name, null)
                    }), !1)
                }

                function processAsyncValidators() {
                    var validatorPromises = [],
                        allValid = !0;
                    forEach(ctrl.$asyncValidators, function(validator, name) {
                        var promise = validator(modelValue, viewValue);
                        if (!isPromiseLike(promise)) throw $ngModelMinErr("$asyncValidators", "Expected asynchronous validator to return a promise but got '{0}' instead.", promise);
                        setValidity(name, undefined), validatorPromises.push(promise.then(function() {
                            setValidity(name, !0)
                        }, function(error) {
                            allValid = !1, setValidity(name, !1)
                        }))
                    }), validatorPromises.length ? $q.all(validatorPromises).then(function() {
                        validationDone(allValid)
                    }, noop) : validationDone(!0)
                }

                function setValidity(name, isValid) {
                    localValidationRunId === currentValidationRunId && ctrl.$setValidity(name, isValid)
                }

                function validationDone(allValid) {
                    localValidationRunId === currentValidationRunId && doneCallback(allValid)
                }
                currentValidationRunId++;
                var localValidationRunId = currentValidationRunId;
                return processParseErrors() && processSyncValidators() ? void processAsyncValidators() : void validationDone(!1)
            }, this.$commitViewValue = function() {
                var viewValue = ctrl.$viewValue;
                $timeout.cancel(pendingDebounce), (ctrl.$$lastCommittedViewValue !== viewValue || "" === viewValue && ctrl.$$hasNativeValidators) && (ctrl.$$lastCommittedViewValue = viewValue, ctrl.$pristine && this.$setDirty(), this.$$parseAndValidate())
            }, this.$$parseAndValidate = function() {
                function writeToModelIfNeeded() {
                    ctrl.$modelValue !== prevModelValue && ctrl.$$writeModelToScope()
                }
                var viewValue = ctrl.$$lastCommittedViewValue,
                    modelValue = viewValue;
                if (parserValid = !isUndefined(modelValue) || undefined)
                    for (var i = 0; i < ctrl.$parsers.length; i++)
                        if (modelValue = ctrl.$parsers[i](modelValue), isUndefined(modelValue)) {
                            parserValid = !1;
                            break
                        }
                isNumber(ctrl.$modelValue) && isNaN(ctrl.$modelValue) && (ctrl.$modelValue = ngModelGet($scope));
                var prevModelValue = ctrl.$modelValue,
                    allowInvalid = ctrl.$options && ctrl.$options.allowInvalid;
                ctrl.$$rawModelValue = modelValue, allowInvalid && (ctrl.$modelValue = modelValue, writeToModelIfNeeded()), ctrl.$$runValidators(modelValue, ctrl.$$lastCommittedViewValue, function(allValid) {
                    allowInvalid || (ctrl.$modelValue = allValid ? modelValue : undefined, writeToModelIfNeeded())
                })
            }, this.$$writeModelToScope = function() {
                ngModelSet($scope, ctrl.$modelValue), forEach(ctrl.$viewChangeListeners, function(listener) {
                    try {
                        listener()
                    } catch (e) {
                        $exceptionHandler(e)
                    }
                })
            }, this.$setViewValue = function(value, trigger) {
                ctrl.$viewValue = value, ctrl.$options && !ctrl.$options.updateOnDefault || ctrl.$$debounceViewValueCommit(trigger)
            }, this.$$debounceViewValueCommit = function(trigger) {
                var debounce, debounceDelay = 0,
                    options = ctrl.$options;
                options && isDefined(options.debounce) && (debounce = options.debounce, isNumber(debounce) ? debounceDelay = debounce : isNumber(debounce[trigger]) ? debounceDelay = debounce[trigger] : isNumber(debounce["default"]) && (debounceDelay = debounce["default"])), $timeout.cancel(pendingDebounce), debounceDelay ? pendingDebounce = $timeout(function() {
                    ctrl.$commitViewValue()
                }, debounceDelay) : $rootScope.$$phase ? ctrl.$commitViewValue() : $scope.$apply(function() {
                    ctrl.$commitViewValue()
                })
            }, $scope.$watch(function() {
                var modelValue = ngModelGet($scope);
                if (modelValue !== ctrl.$modelValue) {
                    ctrl.$modelValue = ctrl.$$rawModelValue = modelValue, parserValid = undefined;
                    for (var formatters = ctrl.$formatters, idx = formatters.length, viewValue = modelValue; idx--;) viewValue = formatters[idx](viewValue);
                    ctrl.$viewValue !== viewValue && (ctrl.$viewValue = ctrl.$$lastCommittedViewValue = viewValue, ctrl.$render(), ctrl.$$runValidators(modelValue, viewValue, noop))
                }
                return modelValue
            })
        }],
        ngModelDirective = ["$rootScope", function($rootScope) {
            return {
                restrict: "A",
                require: ["ngModel", "^?form", "^?ngModelOptions"],
                controller: NgModelController,
                priority: 1,
                compile: function(element) {
                    return element.addClass(PRISTINE_CLASS).addClass(UNTOUCHED_CLASS).addClass(VALID_CLASS), {
                        pre: function(scope, element, attr, ctrls) {
                            var modelCtrl = ctrls[0],
                                formCtrl = ctrls[1] || nullFormCtrl;
                            modelCtrl.$$setOptions(ctrls[2] && ctrls[2].$options), formCtrl.$addControl(modelCtrl), attr.$observe("name", function(newValue) {
                                modelCtrl.$name !== newValue && formCtrl.$$renameControl(modelCtrl, newValue)
                            }), scope.$on("$destroy", function() {
                                formCtrl.$removeControl(modelCtrl)
                            })
                        },
                        post: function(scope, element, attr, ctrls) {
                            var modelCtrl = ctrls[0];
                            modelCtrl.$options && modelCtrl.$options.updateOn && element.on(modelCtrl.$options.updateOn, function(ev) {
                                modelCtrl.$$debounceViewValueCommit(ev && ev.type)
                            }), element.on("blur", function(ev) {
                                modelCtrl.$touched || ($rootScope.$$phase ? scope.$evalAsync(modelCtrl.$setTouched) : scope.$apply(modelCtrl.$setTouched))
                            })
                        }
                    }
                }
            }
        }],
        DEFAULT_REGEXP = /(\s+|^)default(\s+|$)/,
        ngModelOptionsDirective = function() {
            return {
                restrict: "A",
                controller: ["$scope", "$attrs", function($scope, $attrs) {
                    var that = this;
                    this.$options = copy($scope.$eval($attrs.ngModelOptions)), this.$options.updateOn !== undefined ? (this.$options.updateOnDefault = !1, this.$options.updateOn = trim(this.$options.updateOn.replace(DEFAULT_REGEXP, function() {
                        return that.$options.updateOnDefault = !0, " "
                    }))) : this.$options.updateOnDefault = !0
                }]
            }
        },
        ngNonBindableDirective = ngDirective({
            terminal: !0,
            priority: 1e3
        }),
        ngOptionsMinErr = minErr("ngOptions"),
        NG_OPTIONS_REGEXP = /^\s*([\s\S]+?)(?:\s+as\s+([\s\S]+?))?(?:\s+group\s+by\s+([\s\S]+?))?(?:\s+disable\s+when\s+([\s\S]+?))?\s+for\s+(?:([\$\w][\$\w]*)|(?:\(\s*([\$\w][\$\w]*)\s*,\s*([\$\w][\$\w]*)\s*\)))\s+in\s+([\s\S]+?)(?:\s+track\s+by\s+([\s\S]+?))?$/,
        ngOptionsDirective = ["$compile", "$parse", function($compile, $parse) {
            function parseOptionsExpression(optionsExp, selectElement, scope) {
                function Option(selectValue, viewValue, label, group, disabled) {
                    this.selectValue = selectValue, this.viewValue = viewValue, this.label = label, this.group = group, this.disabled = disabled
                }
                var match = optionsExp.match(NG_OPTIONS_REGEXP);
                if (!match) throw ngOptionsMinErr("iexp", "Expected expression in form of '_select_ (as _label_)? for (_key_,)?_value_ in _collection_' but got '{0}'. Element: {1}", optionsExp, startingTag(selectElement));
                var valueName = match[5] || match[7],
                    keyName = match[6],
                    selectAs = / as /.test(match[0]) && match[1],
                    trackBy = match[9],
                    valueFn = $parse(match[2] ? match[1] : valueName),
                    selectAsFn = selectAs && $parse(selectAs),
                    viewValueFn = selectAsFn || valueFn,
                    trackByFn = trackBy && $parse(trackBy),
                    getTrackByValue = trackBy ? function(viewValue, locals) {
                        return trackByFn(scope, locals)
                    } : function(viewValue) {
                        return hashKey(viewValue)
                    },
                    displayFn = $parse(match[2] || match[1]),
                    groupByFn = $parse(match[3] || ""),
                    disableWhenFn = $parse(match[4] || ""),
                    valuesFn = $parse(match[8]),
                    locals = {},
                    getLocals = keyName ? function(value, key) {
                        return locals[keyName] = key, locals[valueName] = value, locals
                    } : function(value) {
                        return locals[valueName] = value, locals
                    };
                return {
                    getWatchables: $parse(valuesFn, function(values) {
                        var watchedArray = [];
                        return values = values || [], Object.keys(values).forEach(function(key) {
                            var locals = getLocals(values[key], key),
                                selectValue = getTrackByValue(values[key], locals);
                            if (watchedArray.push(selectValue), match[2]) {
                                var label = displayFn(scope, locals);
                                watchedArray.push(label)
                            }
                            if (match[4]) {
                                var disableWhen = disableWhenFn(scope, locals);
                                watchedArray.push(disableWhen)
                            }
                        }), watchedArray
                    }),
                    getOptions: function() {
                        var optionItems = [],
                            selectValueMap = {},
                            optionValues = valuesFn(scope) || [],
                            keys = Object.keys(optionValues);
                        return keys.forEach(function(key) {
                            if ("$" !== key.charAt(0)) {
                                var value = optionValues[key],
                                    locals = getLocals(value, key),
                                    viewValue = viewValueFn(scope, locals),
                                    selectValue = getTrackByValue(viewValue, locals),
                                    label = displayFn(scope, locals),
                                    group = groupByFn(scope, locals),
                                    disabled = disableWhenFn(scope, locals),
                                    optionItem = new Option(selectValue, viewValue, label, group, disabled);
                                optionItems.push(optionItem), selectValueMap[selectValue] = optionItem
                            }
                        }), {
                            items: optionItems,
                            selectValueMap: selectValueMap,
                            getOptionFromViewValue: function(value) {
                                return selectValueMap[getTrackByValue(value, getLocals(value))]
                            },
                            getViewValueFromOption: function(option) {
                                return trackBy ? angular.copy(option.viewValue) : option.viewValue
                            }
                        }
                    }
                }
            }
            var optionTemplate = document.createElement("option"),
                optGroupTemplate = document.createElement("optgroup");
            return {
                restrict: "A",
                terminal: !0,
                require: ["select", "?ngModel"],
                link: function(scope, selectElement, attr, ctrls) {
                    function updateOptionElement(option, element) {
                        option.element = element, element.disabled = option.disabled, option.value !== element.value && (element.value = option.selectValue), option.label !== element.label && (element.label = option.label, element.textContent = option.label)
                    }

                    function addOrReuseElement(parent, current, type, templateElement) {
                        var element;
                        return current && lowercase(current.nodeName) === type ? element = current : (element = templateElement.cloneNode(!1), current ? parent.insertBefore(element, current) : parent.appendChild(element)), element
                    }

                    function removeExcessElements(current) {
                        for (var next; current;) next = current.nextSibling, jqLiteRemove(current), current = next
                    }

                    function skipEmptyAndUnknownOptions(current) {
                        var emptyOption_ = emptyOption && emptyOption[0],
                            unknownOption_ = unknownOption && unknownOption[0];
                        if (emptyOption_ || unknownOption_)
                            for (; current && (current === emptyOption_ || current === unknownOption_);) current = current.nextSibling;
                        return current
                    }

                    function updateOptions() {
                        var previousValue = options && selectCtrl.readValue();
                        options = ngOptions.getOptions();
                        var groupMap = {},
                            currentElement = selectElement[0].firstChild;
                        if (providedEmptyOption && selectElement.prepend(emptyOption), currentElement = skipEmptyAndUnknownOptions(currentElement), options.items.forEach(function(option) {
                                var group, groupElement, optionElement;
                                option.group ? (group = groupMap[option.group], group || (groupElement = addOrReuseElement(selectElement[0], currentElement, "optgroup", optGroupTemplate), currentElement = groupElement.nextSibling, groupElement.label = option.group, group = groupMap[option.group] = {
                                    groupElement: groupElement,
                                    currentOptionElement: groupElement.firstChild
                                }), optionElement = addOrReuseElement(group.groupElement, group.currentOptionElement, "option", optionTemplate), updateOptionElement(option, optionElement), group.currentOptionElement = optionElement.nextSibling) : (optionElement = addOrReuseElement(selectElement[0], currentElement, "option", optionTemplate), updateOptionElement(option, optionElement), currentElement = optionElement.nextSibling)
                            }), Object.keys(groupMap).forEach(function(key) {
                                removeExcessElements(groupMap[key].currentOptionElement)
                            }), removeExcessElements(currentElement), ngModelCtrl.$render(), !ngModelCtrl.$isEmpty(previousValue)) {
                            var nextValue = selectCtrl.readValue();
                            equals(previousValue, nextValue) || ngModelCtrl.$setViewValue(nextValue)
                        }
                    }
                    var ngModelCtrl = ctrls[1];
                    if (ngModelCtrl) {
                        var selectCtrl = ctrls[0],
                            multiple = attr.multiple,
                            emptyOption = selectCtrl.emptyOption,
                            providedEmptyOption = !!emptyOption,
                            unknownOption = jqLite(optionTemplate.cloneNode(!1));
                        unknownOption.val("?");
                        var options, ngOptions = parseOptionsExpression(attr.ngOptions, selectElement, scope),
                            renderEmptyOption = function() {
                                providedEmptyOption || selectElement.prepend(emptyOption), selectElement.val(""), emptyOption.prop("selected", !0), emptyOption.attr("selected", !0)
                            },
                            removeEmptyOption = function() {
                                providedEmptyOption || emptyOption.remove()
                            },
                            renderUnknownOption = function() {
                                selectElement.prepend(unknownOption), selectElement.val("?"), unknownOption.prop("selected", !0), unknownOption.attr("selected", !0)
                            },
                            removeUnknownOption = function() {
                                unknownOption.remove()
                            };
                        selectCtrl.writeValue = function(value) {
                            var option = options.getOptionFromViewValue(value);
                            option && !option.disabled ? selectElement[0].value !== option.selectValue && (removeUnknownOption(), removeEmptyOption(), selectElement[0].value = option.selectValue, option.element.selected = !0, option.element.setAttribute("selected", "selected")) : null === value || providedEmptyOption ? (removeUnknownOption(), renderEmptyOption()) : (removeEmptyOption(), renderUnknownOption())
                        }, selectCtrl.readValue = function() {
                            var selectedOption = options.selectValueMap[selectElement.val()];
                            return selectedOption && !selectedOption.disabled ? (removeEmptyOption(), removeUnknownOption(), options.getViewValueFromOption(selectedOption)) : null
                        }, multiple && (ngModelCtrl.$isEmpty = function(value) {
                            return !value || 0 === value.length
                        }, selectCtrl.writeValue = function(value) {
                            options.items.forEach(function(option) {
                                option.element.selected = !1
                            }), value && value.forEach(function(item) {
                                var option = options.getOptionFromViewValue(item);
                                option && !option.disabled && (option.element.selected = !0)
                            })
                        }, selectCtrl.readValue = function() {
                            var selectedValues = selectElement.val() || [],
                                selections = [];
                            return forEach(selectedValues, function(value) {
                                var option = options.selectValueMap[value];
                                option.disabled || selections.push(options.getViewValueFromOption(option))
                            }), selections
                        }), providedEmptyOption ? (emptyOption.remove(), $compile(emptyOption)(scope), emptyOption.removeClass("ng-scope")) : emptyOption = jqLite(optionTemplate.cloneNode(!1)), updateOptions(), scope.$watchCollection(ngOptions.getWatchables, updateOptions), scope.$watch(attr.ngModel, function() {
                            ngModelCtrl.$render()
                        }, !0)
                    }
                }
            }
        }],
        ngPluralizeDirective = ["$locale", "$interpolate", "$log", function($locale, $interpolate, $log) {
            var BRACE = /{}/g,
                IS_WHEN = /^when(Minus)?(.+)$/;
            return {
                link: function(scope, element, attr) {
                    function updateElementText(newText) {
                        element.text(newText || "")
                    }
                    var lastCount, numberExp = attr.count,
                        whenExp = attr.$attr.when && element.attr(attr.$attr.when),
                        offset = attr.offset || 0,
                        whens = scope.$eval(whenExp) || {},
                        whensExpFns = {},
                        startSymbol = $interpolate.startSymbol(),
                        endSymbol = $interpolate.endSymbol(),
                        braceReplacement = startSymbol + numberExp + "-" + offset + endSymbol,
                        watchRemover = angular.noop;
                    forEach(attr, function(expression, attributeName) {
                        var tmpMatch = IS_WHEN.exec(attributeName);
                        if (tmpMatch) {
                            var whenKey = (tmpMatch[1] ? "-" : "") + lowercase(tmpMatch[2]);
                            whens[whenKey] = element.attr(attr.$attr[attributeName])
                        }
                    }), forEach(whens, function(expression, key) {
                        whensExpFns[key] = $interpolate(expression.replace(BRACE, braceReplacement))
                    }), scope.$watch(numberExp, function(newVal) {
                        var count = parseFloat(newVal),
                            countIsNaN = isNaN(count);
                        if (countIsNaN || count in whens || (count = $locale.pluralCat(count - offset)), count !== lastCount && !(countIsNaN && isNumber(lastCount) && isNaN(lastCount))) {
                            watchRemover();
                            var whenExpFn = whensExpFns[count];
                            isUndefined(whenExpFn) ? (null != newVal && $log.debug("ngPluralize: no rule defined for '" + count + "' in " + whenExp), watchRemover = noop, updateElementText()) : watchRemover = scope.$watch(whenExpFn, updateElementText), lastCount = count
                        }
                    })
                }
            }
        }],
        ngRepeatDirective = ["$parse", "$animate", function($parse, $animate) {
            var NG_REMOVED = "$$NG_REMOVED",
                ngRepeatMinErr = minErr("ngRepeat"),
                updateScope = function(scope, index, valueIdentifier, value, keyIdentifier, key, arrayLength) {
                    scope[valueIdentifier] = value, keyIdentifier && (scope[keyIdentifier] = key), scope.$index = index, scope.$first = 0 === index, scope.$last = index === arrayLength - 1, scope.$middle = !(scope.$first || scope.$last), scope.$odd = !(scope.$even = 0 === (1 & index))
                },
                getBlockStart = function(block) {
                    return block.clone[0]
                },
                getBlockEnd = function(block) {
                    return block.clone[block.clone.length - 1]
                };
            return {
                restrict: "A",
                multiElement: !0,
                transclude: "element",
                priority: 1e3,
                terminal: !0,
                $$tlb: !0,
                compile: function($element, $attr) {
                    var expression = $attr.ngRepeat,
                        ngRepeatEndComment = document.createComment(" end ngRepeat: " + expression + " "),
                        match = expression.match(/^\s*([\s\S]+?)\s+in\s+([\s\S]+?)(?:\s+as\s+([\s\S]+?))?(?:\s+track\s+by\s+([\s\S]+?))?\s*$/);
                    if (!match) throw ngRepeatMinErr("iexp", "Expected expression in form of '_item_ in _collection_[ track by _id_]' but got '{0}'.", expression);
                    var lhs = match[1],
                        rhs = match[2],
                        aliasAs = match[3],
                        trackByExp = match[4];
                    if (match = lhs.match(/^(?:(\s*[\$\w]+)|\(\s*([\$\w]+)\s*,\s*([\$\w]+)\s*\))$/), !match) throw ngRepeatMinErr("iidexp", "'_item_' in '_item_ in _collection_' should be an identifier or '(_key_, _value_)' expression, but got '{0}'.", lhs);
                    var valueIdentifier = match[3] || match[1],
                        keyIdentifier = match[2];
                    if (aliasAs && (!/^[$a-zA-Z_][$a-zA-Z0-9_]*$/.test(aliasAs) || /^(null|undefined|this|\$index|\$first|\$middle|\$last|\$even|\$odd|\$parent|\$root|\$id)$/.test(aliasAs))) throw ngRepeatMinErr("badident", "alias '{0}' is invalid --- must be a valid JS identifier which is not a reserved name.", aliasAs);
                    var trackByExpGetter, trackByIdExpFn, trackByIdArrayFn, trackByIdObjFn, hashFnLocals = {
                        $id: hashKey
                    };
                    return trackByExp ? trackByExpGetter = $parse(trackByExp) : (trackByIdArrayFn = function(key, value) {
                            return hashKey(value)
                        }, trackByIdObjFn = function(key) {
                            return key
                        }),
                        function($scope, $element, $attr, ctrl, $transclude) {
                            trackByExpGetter && (trackByIdExpFn = function(key, value, index) {
                                return keyIdentifier && (hashFnLocals[keyIdentifier] = key), hashFnLocals[valueIdentifier] = value, hashFnLocals.$index = index, trackByExpGetter($scope, hashFnLocals)
                            });
                            var lastBlockMap = createMap();
                            $scope.$watchCollection(rhs, function(collection) {
                                var index, length, nextNode, collectionLength, key, value, trackById, trackByIdFn, collectionKeys, block, nextBlockOrder, elementsToRemove, previousNode = $element[0],
                                    nextBlockMap = createMap();
                                if (aliasAs && ($scope[aliasAs] = collection), isArrayLike(collection)) collectionKeys = collection, trackByIdFn = trackByIdExpFn || trackByIdArrayFn;
                                else {
                                    trackByIdFn = trackByIdExpFn || trackByIdObjFn, collectionKeys = [];
                                    for (var itemKey in collection) collection.hasOwnProperty(itemKey) && "$" !== itemKey.charAt(0) && collectionKeys.push(itemKey)
                                }
                                for (collectionLength = collectionKeys.length, nextBlockOrder = new Array(collectionLength), index = 0; index < collectionLength; index++)
                                    if (key = collection === collectionKeys ? index : collectionKeys[index], value = collection[key], trackById = trackByIdFn(key, value, index), lastBlockMap[trackById]) block = lastBlockMap[trackById], delete lastBlockMap[trackById], nextBlockMap[trackById] = block, nextBlockOrder[index] = block;
                                    else {
                                        if (nextBlockMap[trackById]) throw forEach(nextBlockOrder, function(block) {
                                            block && block.scope && (lastBlockMap[block.id] = block)
                                        }), ngRepeatMinErr("dupes", "Duplicates in a repeater are not allowed. Use 'track by' expression to specify unique keys. Repeater: {0}, Duplicate key: {1}, Duplicate value: {2}", expression, trackById, value);
                                        nextBlockOrder[index] = {
                                            id: trackById,
                                            scope: undefined,
                                            clone: undefined
                                        }, nextBlockMap[trackById] = !0
                                    }
                                for (var blockKey in lastBlockMap) {
                                    if (block = lastBlockMap[blockKey], elementsToRemove = getBlockNodes(block.clone), $animate.leave(elementsToRemove), elementsToRemove[0].parentNode)
                                        for (index = 0, length = elementsToRemove.length; index < length; index++) elementsToRemove[index][NG_REMOVED] = !0;
                                    block.scope.$destroy()
                                }
                                for (index = 0; index < collectionLength; index++)
                                    if (key = collection === collectionKeys ? index : collectionKeys[index], value = collection[key], block = nextBlockOrder[index], block.scope) {
                                        nextNode = previousNode;
                                        do nextNode = nextNode.nextSibling; while (nextNode && nextNode[NG_REMOVED]);
                                        getBlockStart(block) != nextNode && $animate.move(getBlockNodes(block.clone), null, jqLite(previousNode)), previousNode = getBlockEnd(block), updateScope(block.scope, index, valueIdentifier, value, keyIdentifier, key, collectionLength)
                                    } else $transclude(function(clone, scope) {
                                        block.scope = scope;
                                        var endNode = ngRepeatEndComment.cloneNode(!1);
                                        clone[clone.length++] = endNode, $animate.enter(clone, null, jqLite(previousNode)), previousNode = endNode, block.clone = clone, nextBlockMap[block.id] = block, updateScope(block.scope, index, valueIdentifier, value, keyIdentifier, key, collectionLength)
                                    });
                                lastBlockMap = nextBlockMap
                            })
                        }
                }
            }
        }],
        NG_HIDE_CLASS = "ng-hide",
        NG_HIDE_IN_PROGRESS_CLASS = "ng-hide-animate",
        ngShowDirective = ["$animate", function($animate) {
            return {
                restrict: "A",
                multiElement: !0,
                link: function(scope, element, attr) {
                    scope.$watch(attr.ngShow, function(value) {
                        $animate[value ? "removeClass" : "addClass"](element, NG_HIDE_CLASS, {
                            tempClasses: NG_HIDE_IN_PROGRESS_CLASS
                        })
                    })
                }
            }
        }],
        ngHideDirective = ["$animate", function($animate) {
            return {
                restrict: "A",
                multiElement: !0,
                link: function(scope, element, attr) {
                    scope.$watch(attr.ngHide, function(value) {
                        $animate[value ? "addClass" : "removeClass"](element, NG_HIDE_CLASS, {
                            tempClasses: NG_HIDE_IN_PROGRESS_CLASS
                        })
                    })
                }
            }
        }],
        ngStyleDirective = ngDirective(function(scope, element, attr) {
            scope.$watchCollection(attr.ngStyle, function(newStyles, oldStyles) {
                oldStyles && newStyles !== oldStyles && forEach(oldStyles, function(val, style) {
                    element.css(style, "")
                }), newStyles && element.css(newStyles)
            })
        }),
        ngSwitchDirective = ["$animate", function($animate) {
            return {
                require: "ngSwitch",
                controller: ["$scope", function() {
                    this.cases = {}
                }],
                link: function(scope, element, attr, ngSwitchController) {
                    var watchExpr = attr.ngSwitch || attr.on,
                        selectedTranscludes = [],
                        selectedElements = [],
                        previousLeaveAnimations = [],
                        selectedScopes = [],
                        spliceFactory = function(array, index) {
                            return function() {
                                array.splice(index, 1)
                            }
                        };
                    scope.$watch(watchExpr, function(value) {
                        var i, ii;
                        for (i = 0, ii = previousLeaveAnimations.length; i < ii; ++i) $animate.cancel(previousLeaveAnimations[i]);
                        for (previousLeaveAnimations.length = 0, i = 0, ii = selectedScopes.length; i < ii; ++i) {
                            var selected = getBlockNodes(selectedElements[i].clone);
                            selectedScopes[i].$destroy();
                            var promise = previousLeaveAnimations[i] = $animate.leave(selected);
                            promise.then(spliceFactory(previousLeaveAnimations, i))
                        }
                        selectedElements.length = 0, selectedScopes.length = 0, (selectedTranscludes = ngSwitchController.cases["!" + value] || ngSwitchController.cases["?"]) && forEach(selectedTranscludes, function(selectedTransclude) {
                            selectedTransclude.transclude(function(caseElement, selectedScope) {
                                selectedScopes.push(selectedScope);
                                var anchor = selectedTransclude.element;
                                caseElement[caseElement.length++] = document.createComment(" end ngSwitchWhen: ");
                                var block = {
                                    clone: caseElement
                                };
                                selectedElements.push(block), $animate.enter(caseElement, anchor.parent(), anchor)
                            })
                        })
                    })
                }
            }
        }],
        ngSwitchWhenDirective = ngDirective({
            transclude: "element",
            priority: 1200,
            require: "^ngSwitch",
            multiElement: !0,
            link: function(scope, element, attrs, ctrl, $transclude) {
                ctrl.cases["!" + attrs.ngSwitchWhen] = ctrl.cases["!" + attrs.ngSwitchWhen] || [], ctrl.cases["!" + attrs.ngSwitchWhen].push({
                    transclude: $transclude,
                    element: element
                })
            }
        }),
        ngSwitchDefaultDirective = ngDirective({
            transclude: "element",
            priority: 1200,
            require: "^ngSwitch",
            multiElement: !0,
            link: function(scope, element, attr, ctrl, $transclude) {
                ctrl.cases["?"] = ctrl.cases["?"] || [], ctrl.cases["?"].push({
                    transclude: $transclude,
                    element: element
                })
            }
        }),
        ngTranscludeDirective = ngDirective({
            restrict: "EAC",
            link: function($scope, $element, $attrs, controller, $transclude) {
                if (!$transclude) throw minErr("ngTransclude")("orphan", "Illegal use of ngTransclude directive in the template! No parent directive that requires a transclusion found. Element: {0}", startingTag($element));
                $transclude(function(clone) {
                    $element.empty(), $element.append(clone)
                })
            }
        }),
        scriptDirective = ["$templateCache", function($templateCache) {
            return {
                restrict: "E",
                terminal: !0,
                compile: function(element, attr) {
                    if ("text/ng-template" == attr.type) {
                        var templateUrl = attr.id,
                            text = element[0].text;
                        $templateCache.put(templateUrl, text)
                    }
                }
            }
        }],
        noopNgModelController = {
            $setViewValue: noop,
            $render: noop
        },
        SelectController = ["$element", "$scope", "$attrs", function($element, $scope, $attrs) {
            var self = this,
                optionsMap = new HashMap;
            self.ngModelCtrl = noopNgModelController, self.unknownOption = jqLite(document.createElement("option")), self.renderUnknownOption = function(val) {
                var unknownVal = "? " + hashKey(val) + " ?";
                self.unknownOption.val(unknownVal), $element.prepend(self.unknownOption), $element.val(unknownVal)
            }, $scope.$on("$destroy", function() {
                self.renderUnknownOption = noop
            }), self.removeUnknownOption = function() {
                self.unknownOption.parent() && self.unknownOption.remove()
            };
            for (var i = 0, children = $element.children(), ii = children.length; i < ii; i++)
                if ("" === children[i].value) {
                    self.emptyOption = children.eq(i);
                    break
                }
            self.readValue = function() {
                return self.removeUnknownOption(), $element.val()
            }, self.writeValue = function(value) {
                self.hasOption(value) ? (self.removeUnknownOption(), $element.val(value), "" === value && self.emptyOption.prop("selected", !0)) : isUndefined(value) && self.emptyOption ? (self.removeUnknownOption(), $element.val("")) : self.renderUnknownOption(value)
            }, self.addOption = function(value) {
                assertNotHasOwnProperty(value, '"option value"');
                var count = optionsMap.get(value) || 0;
                optionsMap.put(value, count + 1)
            }, self.removeOption = function(value) {
                var count = optionsMap.get(value);
                count && (1 === count ? optionsMap.remove(value) : optionsMap.put(value, count - 1))
            }, self.hasOption = function(value) {
                return !!optionsMap.get(value)
            }
        }],
        selectDirective = function() {
            var lastView;
            return {
                restrict: "E",
                require: ["select", "?ngModel"],
                controller: SelectController,
                link: function(scope, element, attr, ctrls) {
                    var ngModelCtrl = ctrls[1];
                    if (ngModelCtrl) {
                        var selectCtrl = ctrls[0];
                        selectCtrl.ngModelCtrl = ngModelCtrl, ngModelCtrl.$render = function() {
                            selectCtrl.writeValue(ngModelCtrl.$viewValue)
                        }, element.on("change", function() {
                            scope.$apply(function() {
                                ngModelCtrl.$setViewValue(selectCtrl.readValue())
                            })
                        }), attr.multiple && (selectCtrl.readValue = function() {
                            var array = [];
                            return forEach(element.find("option"), function(option) {
                                option.selected && array.push(option.value)
                            }), array
                        }, selectCtrl.writeValue = function(value) {
                            var items = new HashMap(value);
                            forEach(element.find("option"), function(option) {
                                option.selected = isDefined(items.get(option.value))
                            })
                        }, scope.$watch(function() {
                            equals(lastView, ngModelCtrl.$viewValue) || (lastView = shallowCopy(ngModelCtrl.$viewValue), ngModelCtrl.$render())
                        }), ngModelCtrl.$isEmpty = function(value) {
                            return !value || 0 === value.length
                        })
                    }
                }
            }
        },
        optionDirective = ["$interpolate", function($interpolate) {
            function chromeHack(optionElement) {
                optionElement[0].hasAttribute("selected") && (optionElement[0].selected = !0)
            }
            return {
                restrict: "E",
                priority: 100,
                compile: function(element, attr) {
                    if (isUndefined(attr.value)) {
                        var interpolateFn = $interpolate(element.text(), !0);
                        interpolateFn || attr.$set("value", element.text())
                    }
                    return function(scope, element, attr) {
                        var selectCtrlName = "$selectController",
                            parent = element.parent(),
                            selectCtrl = parent.data(selectCtrlName) || parent.parent().data(selectCtrlName);
                        selectCtrl && selectCtrl.ngModelCtrl && (interpolateFn ? scope.$watch(interpolateFn, function(newVal, oldVal) {
                            attr.$set("value", newVal), oldVal !== newVal && selectCtrl.removeOption(oldVal), selectCtrl.addOption(newVal, element), selectCtrl.ngModelCtrl.$render(), chromeHack(element)
                        }) : (selectCtrl.addOption(attr.value, element), selectCtrl.ngModelCtrl.$render(), chromeHack(element)), element.on("$destroy", function() {
                            selectCtrl.removeOption(attr.value), selectCtrl.ngModelCtrl.$render()
                        }))
                    }
                }
            }
        }],
        styleDirective = valueFn({
            restrict: "E",
            terminal: !1
        }),
        requiredDirective = function() {
            return {
                restrict: "A",
                require: "?ngModel",
                link: function(scope, elm, attr, ctrl) {
                    ctrl && (attr.required = !0, ctrl.$validators.required = function(modelValue, viewValue) {
                        return !attr.required || !ctrl.$isEmpty(viewValue)
                    }, attr.$observe("required", function() {
                        ctrl.$validate()
                    }))
                }
            }
        },
        patternDirective = function() {
            return {
                restrict: "A",
                require: "?ngModel",
                link: function(scope, elm, attr, ctrl) {
                    if (ctrl) {
                        var regexp, patternExp = attr.ngPattern || attr.pattern;
                        attr.$observe("pattern", function(regex) {
                            if (isString(regex) && regex.length > 0 && (regex = new RegExp("^" + regex + "$")), regex && !regex.test) throw minErr("ngPattern")("noregexp", "Expected {0} to be a RegExp but was {1}. Element: {2}", patternExp, regex, startingTag(elm));
                            regexp = regex || undefined, ctrl.$validate()
                        }), ctrl.$validators.pattern = function(value) {
                            return ctrl.$isEmpty(value) || isUndefined(regexp) || regexp.test(value)
                        }
                    }
                }
            }
        },
        maxlengthDirective = function() {
            return {
                restrict: "A",
                require: "?ngModel",
                link: function(scope, elm, attr, ctrl) {
                    if (ctrl) {
                        var maxlength = -1;
                        attr.$observe("maxlength", function(value) {
                            var intVal = toInt(value);
                            maxlength = isNaN(intVal) ? -1 : intVal, ctrl.$validate()
                        }), ctrl.$validators.maxlength = function(modelValue, viewValue) {
                            return maxlength < 0 || ctrl.$isEmpty(viewValue) || viewValue.length <= maxlength
                        }
                    }
                }
            }
        },
        minlengthDirective = function() {
            return {
                restrict: "A",
                require: "?ngModel",
                link: function(scope, elm, attr, ctrl) {
                    if (ctrl) {
                        var minlength = 0;
                        attr.$observe("minlength", function(value) {
                            minlength = toInt(value) || 0, ctrl.$validate()
                        }), ctrl.$validators.minlength = function(modelValue, viewValue) {
                            return ctrl.$isEmpty(viewValue) || viewValue.length >= minlength
                        }
                    }
                }
            }
        };
    return window.angular.bootstrap ? void console.log("WARNING: Tried to load angular more than once.") : (bindJQuery(), publishExternalAPI(angular), void jqLite(document).ready(function() {
        angularInit(document, bootstrap)
    }))
}(window, document), !window.angular.$$csp() && window.angular.element(document).find("head").prepend('<style type="text/css">@charset "UTF-8";[ng\\:cloak],[ng-cloak],[data-ng-cloak],[x-ng-cloak],.ng-cloak,.x-ng-cloak,.ng-hide:not(.ng-hide-animate){display:none !important;}ng\\:form{display:block;}</style>'),
    function(window, angular, undefined) {
        "use strict";

        function isValidDottedPath(path) {
            return null != path && "" !== path && "hasOwnProperty" !== path && MEMBER_NAME_REGEX.test("." + path)
        }

        function lookupDottedPath(obj, path) {
            if (!isValidDottedPath(path)) throw $resourceMinErr("badmember", 'Dotted member path "@{0}" is invalid.', path);
            for (var keys = path.split("."), i = 0, ii = keys.length; i < ii && obj !== undefined; i++) {
                var key = keys[i];
                obj = null !== obj ? obj[key] : undefined
            }
            return obj
        }

        function shallowClearAndCopy(src, dst) {
            dst = dst || {}, angular.forEach(dst, function(value, key) {
                delete dst[key]
            });
            for (var key in src) !src.hasOwnProperty(key) || "$" === key.charAt(0) && "$" === key.charAt(1) || (dst[key] = src[key]);
            return dst
        }
        var $resourceMinErr = angular.$$minErr("$resource"),
            MEMBER_NAME_REGEX = /^(\.[a-zA-Z_$][0-9a-zA-Z_$]*)+$/;
        angular.module("ngResource", ["ng"]).provider("$resource", function() {
            var provider = this;
            this.defaults = {
                stripTrailingSlashes: !0,
                actions: {
                    get: {
                        method: "GET"
                    },
                    save: {
                        method: "POST"
                    },
                    query: {
                        method: "GET",
                        isArray: !0
                    },
                    remove: {
                        method: "DELETE"
                    },
                    "delete": {
                        method: "DELETE"
                    }
                }
            }, this.$get = ["$http", "$q", function($http, $q) {
                function encodeUriSegment(val) {
                    return encodeUriQuery(val, !0).replace(/%26/gi, "&").replace(/%3D/gi, "=").replace(/%2B/gi, "+")
                }

                function encodeUriQuery(val, pctEncodeSpaces) {
                    return encodeURIComponent(val).replace(/%40/gi, "@").replace(/%3A/gi, ":").replace(/%24/g, "$").replace(/%2C/gi, ",").replace(/%20/g, pctEncodeSpaces ? "%20" : "+")
                }

                function Route(template, defaults) {
                    this.template = template, this.defaults = extend({}, provider.defaults, defaults), this.urlParams = {}
                }

                function resourceFactory(url, paramDefaults, actions, options) {
                    function extractParams(data, actionParams) {
                        var ids = {};
                        return actionParams = extend({}, paramDefaults, actionParams), forEach(actionParams, function(value, key) {
                            isFunction(value) && (value = value()), ids[key] = value && value.charAt && "@" == value.charAt(0) ? lookupDottedPath(data, value.substr(1)) : value
                        }), ids
                    }

                    function defaultResponseInterceptor(response) {
                        return response.resource
                    }

                    function Resource(value) {
                        shallowClearAndCopy(value || {}, this)
                    }
                    var route = new Route(url, options);
                    return actions = extend({}, provider.defaults.actions, actions), Resource.prototype.toJSON = function() {
                        var data = extend({}, this);
                        return delete data.$promise, delete data.$resolved, data
                    }, forEach(actions, function(action, name) {
                        var hasBody = /^(POST|PUT|PATCH)$/i.test(action.method);
                        Resource[name] = function(a1, a2, a3, a4) {
                            var data, success, error, params = {};
                            switch (arguments.length) {
                                case 4:
                                    error = a4, success = a3;
                                case 3:
                                case 2:
                                    if (!isFunction(a2)) {
                                        params = a1, data = a2, success = a3;
                                        break
                                    }
                                    if (isFunction(a1)) {
                                        success = a1, error = a2;
                                        break
                                    }
                                    success = a2, error = a3;
                                case 1:
                                    isFunction(a1) ? success = a1 : hasBody ? data = a1 : params = a1;
                                    break;
                                case 0:
                                    break;
                                default:
                                    throw $resourceMinErr("badargs", "Expected up to 4 arguments [params, data, success, error], got {0} arguments", arguments.length)
                            }
                            var isInstanceCall = this instanceof Resource,
                                value = isInstanceCall ? data : action.isArray ? [] : new Resource(data),
                                httpConfig = {},
                                responseInterceptor = action.interceptor && action.interceptor.response || defaultResponseInterceptor,
                                responseErrorInterceptor = action.interceptor && action.interceptor.responseError || undefined;
                            forEach(action, function(value, key) {
                                "params" != key && "isArray" != key && "interceptor" != key && (httpConfig[key] = copy(value))
                            }), hasBody && (httpConfig.data = data), route.setUrlParams(httpConfig, extend({}, extractParams(data, action.params || {}), params), action.url);
                            var promise = $http(httpConfig).then(function(response) {
                                var data = response.data,
                                    promise = value.$promise;
                                if (data) {
                                    if (angular.isArray(data) !== !!action.isArray) throw $resourceMinErr("badcfg", "Error in resource configuration for action `{0}`. Expected response to contain an {1} but got an {2}", name, action.isArray ? "array" : "object", angular.isArray(data) ? "array" : "object");
                                    action.isArray ? (value.length = 0, forEach(data, function(item) {
                                        "object" == typeof item ? value.push(new Resource(item)) : value.push(item)
                                    })) : (shallowClearAndCopy(data, value), value.$promise = promise)
                                }
                                return value.$resolved = !0, response.resource = value, response
                            }, function(response) {
                                return value.$resolved = !0, (error || noop)(response), $q.reject(response)
                            });
                            return promise = promise.then(function(response) {
                                var value = responseInterceptor(response);
                                return (success || noop)(value, response.headers), value
                            }, responseErrorInterceptor), isInstanceCall ? promise : (value.$promise = promise, value.$resolved = !1, value)
                        }, Resource.prototype["$" + name] = function(params, success, error) {
                            isFunction(params) && (error = success, success = params, params = {});
                            var result = Resource[name].call(this, params, this, success, error);
                            return result.$promise || result
                        }
                    }), Resource.bind = function(additionalParamDefaults) {
                        return resourceFactory(url, extend({}, paramDefaults, additionalParamDefaults), actions)
                    }, Resource
                }
                var noop = angular.noop,
                    forEach = angular.forEach,
                    extend = angular.extend,
                    copy = angular.copy,
                    isFunction = angular.isFunction;
                return Route.prototype = {
                    setUrlParams: function(config, params, actionUrl) {
                        var val, encodedVal, self = this,
                            url = actionUrl || self.template,
                            urlParams = self.urlParams = {};
                        forEach(url.split(/\W/), function(param) {
                            if ("hasOwnProperty" === param) throw $resourceMinErr("badname", "hasOwnProperty is not a valid parameter name.");
                            !new RegExp("^\\d+$").test(param) && param && new RegExp("(^|[^\\\\]):" + param + "(\\W|$)").test(url) && (urlParams[param] = !0)
                        }), url = url.replace(/\\:/g, ":"), params = params || {}, forEach(self.urlParams, function(_, urlParam) {
                            val = params.hasOwnProperty(urlParam) ? params[urlParam] : self.defaults[urlParam], angular.isDefined(val) && null !== val ? (encodedVal = encodeUriSegment(val), url = url.replace(new RegExp(":" + urlParam + "(\\W|$)", "g"), function(match, p1) {
                                return encodedVal + p1
                            })) : url = url.replace(new RegExp("(/?):" + urlParam + "(\\W|$)", "g"), function(match, leadingSlashes, tail) {
                                return "/" == tail.charAt(0) ? tail : leadingSlashes + tail
                            })
                        }), self.defaults.stripTrailingSlashes && (url = url.replace(/\/+$/, "") || "/"), url = url.replace(/\/\.(?=\w+($|\?))/, "."), config.url = url.replace(/\/\\\./, "/."), forEach(params, function(value, key) {
                            self.urlParams[key] || (config.params = config.params || {}, config.params[key] = value)
                        })
                    }
                }, resourceFactory
            }]
        })
    }(window, window.angular),
    function(window, angular, undefined) {
        "use strict";
        angular.module("ngAnimate", ["ng"]).directive("ngAnimateChildren", function() {
            var NG_ANIMATE_CHILDREN = "$$ngAnimateChildren";
            return function(scope, element, attrs) {
                var val = attrs.ngAnimateChildren;
                angular.isString(val) && 0 === val.length ? element.data(NG_ANIMATE_CHILDREN, !0) : scope.$watch(val, function(value) {
                    element.data(NG_ANIMATE_CHILDREN, !!value)
                })
            }
        }).factory("$$animateReflow", ["$$rAF", "$document", function($$rAF, $document) {
            var bod = $document[0].body;
            return function(fn) {
                return $$rAF(function() {
                    bod.offsetWidth + 1;
                    fn()
                })
            }
        }]).config(["$provide", "$animateProvider", function($provide, $animateProvider) {
            function extractElementNode(element) {
                for (var i = 0; i < element.length; i++) {
                    var elm = element[i];
                    if (elm.nodeType == ELEMENT_NODE) return elm
                }
            }

            function prepareElement(element) {
                return element && angular.element(element)
            }

            function stripCommentsFromElement(element) {
                return angular.element(extractElementNode(element))
            }

            function isMatchingElement(elm1, elm2) {
                return extractElementNode(elm1) == extractElementNode(elm2)
            }
            var $$jqLite, noop = angular.noop,
                forEach = angular.forEach,
                selectors = $animateProvider.$$selectors,
                isArray = angular.isArray,
                isString = angular.isString,
                isObject = angular.isObject,
                ELEMENT_NODE = 1,
                NG_ANIMATE_STATE = "$$ngAnimateState",
                NG_ANIMATE_CHILDREN = "$$ngAnimateChildren",
                NG_ANIMATE_CLASS_NAME = "ng-animate",
                rootAnimateState = {
                    running: !0
                };
            $provide.decorator("$animate", ["$delegate", "$$q", "$injector", "$sniffer", "$rootElement", "$$asyncCallback", "$rootScope", "$document", "$templateRequest", "$$jqLite", function($delegate, $$q, $injector, $sniffer, $rootElement, $$asyncCallback, $rootScope, $document, $templateRequest, $$$jqLite) {
                function classBasedAnimationsBlocked(element, setter) {
                    var data = element.data(NG_ANIMATE_STATE) || {};
                    return setter && (data.running = !0, data.structural = !0, element.data(NG_ANIMATE_STATE, data)), data.disabled || data.running && data.structural
                }

                function runAnimationPostDigest(fn) {
                    var cancelFn, defer = $$q.defer();
                    return defer.promise.$$cancelFn = function() {
                        cancelFn && cancelFn()
                    }, $rootScope.$$postDigest(function() {
                        cancelFn = fn(function() {
                            defer.resolve()
                        })
                    }), defer.promise
                }

                function parseAnimateOptions(options) {
                    if (isObject(options)) return options.tempClasses && isString(options.tempClasses) && (options.tempClasses = options.tempClasses.split(/\s+/)), options
                }

                function resolveElementClasses(element, cache, runningAnimations) {
                    runningAnimations = runningAnimations || {};
                    var lookup = {};
                    forEach(runningAnimations, function(data, selector) {
                        forEach(selector.split(" "), function(s) {
                            lookup[s] = data
                        })
                    });
                    var hasClasses = Object.create(null);
                    forEach((element.attr("class") || "").split(/\s+/), function(className) {
                        hasClasses[className] = !0
                    });
                    var toAdd = [],
                        toRemove = [];
                    return forEach(cache && cache.classes || [], function(status, className) {
                        var hasClass = hasClasses[className],
                            matchingAnimation = lookup[className] || {};
                        status === !1 ? (hasClass || "addClass" == matchingAnimation.event) && toRemove.push(className) : status === !0 && (hasClass && "removeClass" != matchingAnimation.event || toAdd.push(className))
                    }), toAdd.length + toRemove.length > 0 && [toAdd.join(" "), toRemove.join(" ")]
                }

                function lookup(name) {
                    if (name) {
                        var matches = [],
                            flagMap = {},
                            classes = name.substr(1).split(".");
                        ($sniffer.transitions || $sniffer.animations) && matches.push($injector.get(selectors[""]));
                        for (var i = 0; i < classes.length; i++) {
                            var klass = classes[i],
                                selectorFactoryName = selectors[klass];
                            selectorFactoryName && !flagMap[klass] && (matches.push($injector.get(selectorFactoryName)), flagMap[klass] = !0)
                        }
                        return matches
                    }
                }

                function animationRunner(element, animationEvent, className, options) {
                    function registerAnimation(animationFactory, event) {
                        var afterFn = animationFactory[event],
                            beforeFn = animationFactory["before" + event.charAt(0).toUpperCase() + event.substr(1)];
                        if (afterFn || beforeFn) return "leave" == event && (beforeFn = afterFn, afterFn = null), after.push({
                            event: event,
                            fn: afterFn
                        }), before.push({
                            event: event,
                            fn: beforeFn
                        }), !0
                    }

                    function run(fns, cancellations, allCompleteFn) {
                        function afterAnimationComplete(index) {
                            if (cancellations) {
                                if ((cancellations[index] || noop)(), ++count < animations.length) return;
                                cancellations = null
                            }
                            allCompleteFn()
                        }
                        var animations = [];
                        forEach(fns, function(animation) {
                            animation.fn && animations.push(animation)
                        });
                        var count = 0;
                        forEach(animations, function(animation, index) {
                            var progress = function() {
                                afterAnimationComplete(index)
                            };
                            switch (animation.event) {
                                case "setClass":
                                    cancellations.push(animation.fn(element, classNameAdd, classNameRemove, progress, options));
                                    break;
                                case "animate":
                                    cancellations.push(animation.fn(element, className, options.from, options.to, progress));
                                    break;
                                case "addClass":
                                    cancellations.push(animation.fn(element, classNameAdd || className, progress, options));
                                    break;
                                case "removeClass":
                                    cancellations.push(animation.fn(element, classNameRemove || className, progress, options));
                                    break;
                                default:
                                    cancellations.push(animation.fn(element, progress, options))
                            }
                        }), cancellations && 0 === cancellations.length && allCompleteFn()
                    }
                    var node = element[0];
                    if (node) {
                        options && (options.to = options.to || {}, options.from = options.from || {});
                        var classNameAdd, classNameRemove;
                        isArray(className) && (classNameAdd = className[0], classNameRemove = className[1], classNameAdd ? classNameRemove ? className = classNameAdd + " " + classNameRemove : (className = classNameAdd, animationEvent = "addClass") : (className = classNameRemove, animationEvent = "removeClass"));
                        var isSetClassOperation = "setClass" == animationEvent,
                            isClassBased = isSetClassOperation || "addClass" == animationEvent || "removeClass" == animationEvent || "animate" == animationEvent,
                            currentClassName = element.attr("class"),
                            classes = currentClassName + " " + className;
                        if (isAnimatableClassName(classes)) {
                            var beforeComplete = noop,
                                beforeCancel = [],
                                before = [],
                                afterComplete = noop,
                                afterCancel = [],
                                after = [],
                                animationLookup = (" " + classes).replace(/\s+/g, ".");
                            return forEach(lookup(animationLookup), function(animationFactory) {
                                var created = registerAnimation(animationFactory, animationEvent);
                                !created && isSetClassOperation && (registerAnimation(animationFactory, "addClass"), registerAnimation(animationFactory, "removeClass"))
                            }), {
                                node: node,
                                event: animationEvent,
                                className: className,
                                isClassBased: isClassBased,
                                isSetClassOperation: isSetClassOperation,
                                applyStyles: function() {
                                    options && element.css(angular.extend(options.from || {}, options.to || {}))
                                },
                                before: function(allCompleteFn) {
                                    beforeComplete = allCompleteFn, run(before, beforeCancel, function() {
                                        beforeComplete = noop, allCompleteFn()
                                    })
                                },
                                after: function(allCompleteFn) {
                                    afterComplete = allCompleteFn, run(after, afterCancel, function() {
                                        afterComplete = noop, allCompleteFn()
                                    })
                                },
                                cancel: function() {
                                    beforeCancel && (forEach(beforeCancel, function(cancelFn) {
                                        (cancelFn || noop)(!0)
                                    }), beforeComplete(!0)), afterCancel && (forEach(afterCancel, function(cancelFn) {
                                        (cancelFn || noop)(!0)
                                    }), afterComplete(!0))
                                }
                            }
                        }
                    }
                }

                function performAnimation(animationEvent, className, element, parentElement, afterElement, domOperation, options, doneCallback) {
                    function fireDOMCallback(animationPhase) {
                        var eventName = "$animate:" + animationPhase;
                        elementEvents && elementEvents[eventName] && elementEvents[eventName].length > 0 && $$asyncCallback(function() {
                            element.triggerHandler(eventName, {
                                event: animationEvent,
                                className: className
                            })
                        })
                    }

                    function fireBeforeCallbackAsync() {
                        fireDOMCallback("before")
                    }

                    function fireAfterCallbackAsync() {
                        fireDOMCallback("after")
                    }

                    function fireDoneCallbackAsync() {
                        fireDOMCallback("close"), doneCallback()
                    }

                    function fireDOMOperation() {
                        fireDOMOperation.hasBeenRun || (fireDOMOperation.hasBeenRun = !0, domOperation())
                    }

                    function closeAnimation() {
                        if (!closeAnimation.hasBeenRun) {
                            runner && runner.applyStyles(), closeAnimation.hasBeenRun = !0, options && options.tempClasses && forEach(options.tempClasses, function(className) {
                                $$jqLite.removeClass(element, className)
                            });
                            var data = element.data(NG_ANIMATE_STATE);
                            data && (runner && runner.isClassBased ? cleanup(element, className) : ($$asyncCallback(function() {
                                var data = element.data(NG_ANIMATE_STATE) || {};
                                localAnimationCount == data.index && cleanup(element, className, animationEvent)
                            }), element.data(NG_ANIMATE_STATE, data))), fireDoneCallbackAsync()
                        }
                    }
                    var noopCancel = noop,
                        runner = animationRunner(element, animationEvent, className, options);
                    if (!runner) return fireDOMOperation(), fireBeforeCallbackAsync(), fireAfterCallbackAsync(), closeAnimation(), noopCancel;
                    animationEvent = runner.event, className = runner.className;
                    var elementEvents = angular.element._data(runner.node);
                    if (elementEvents = elementEvents && elementEvents.events, parentElement || (parentElement = afterElement ? afterElement.parent() : element.parent()), animationsDisabled(element, parentElement)) return fireDOMOperation(), fireBeforeCallbackAsync(), fireAfterCallbackAsync(), closeAnimation(), noopCancel;
                    var ngAnimateState = element.data(NG_ANIMATE_STATE) || {},
                        runningAnimations = ngAnimateState.active || {},
                        totalActiveAnimations = ngAnimateState.totalActive || 0,
                        lastAnimation = ngAnimateState.last,
                        skipAnimation = !1;
                    if (totalActiveAnimations > 0) {
                        var animationsToCancel = [];
                        if (runner.isClassBased) {
                            if ("setClass" == lastAnimation.event) animationsToCancel.push(lastAnimation), cleanup(element, className);
                            else if (runningAnimations[className]) {
                                var current = runningAnimations[className];
                                current.event == animationEvent ? skipAnimation = !0 : (animationsToCancel.push(current), cleanup(element, className))
                            }
                        } else if ("leave" == animationEvent && runningAnimations["ng-leave"]) skipAnimation = !0;
                        else {
                            for (var klass in runningAnimations) animationsToCancel.push(runningAnimations[klass]);
                            ngAnimateState = {}, cleanup(element, !0)
                        }
                        animationsToCancel.length > 0 && forEach(animationsToCancel, function(operation) {
                            operation.cancel()
                        })
                    }
                    if (!runner.isClassBased || runner.isSetClassOperation || "animate" == animationEvent || skipAnimation || (skipAnimation = "addClass" == animationEvent == element.hasClass(className)), skipAnimation) return fireDOMOperation(), fireBeforeCallbackAsync(), fireAfterCallbackAsync(), fireDoneCallbackAsync(), noopCancel;
                    runningAnimations = ngAnimateState.active || {}, totalActiveAnimations = ngAnimateState.totalActive || 0, "leave" == animationEvent && element.one("$destroy", function(e) {
                        var element = angular.element(this),
                            state = element.data(NG_ANIMATE_STATE);
                        if (state) {
                            var activeLeaveAnimation = state.active["ng-leave"];
                            activeLeaveAnimation && (activeLeaveAnimation.cancel(), cleanup(element, "ng-leave"))
                        }
                    }), $$jqLite.addClass(element, NG_ANIMATE_CLASS_NAME), options && options.tempClasses && forEach(options.tempClasses, function(className) {
                        $$jqLite.addClass(element, className)
                    });
                    var localAnimationCount = globalAnimationCounter++;
                    return totalActiveAnimations++, runningAnimations[className] = runner, element.data(NG_ANIMATE_STATE, {
                        last: runner,
                        active: runningAnimations,
                        index: localAnimationCount,
                        totalActive: totalActiveAnimations
                    }), fireBeforeCallbackAsync(), runner.before(function(cancelled) {
                        var data = element.data(NG_ANIMATE_STATE);
                        cancelled = cancelled || !data || !data.active[className] || runner.isClassBased && data.active[className].event != animationEvent, fireDOMOperation(), cancelled === !0 ? closeAnimation() : (fireAfterCallbackAsync(), runner.after(closeAnimation))
                    }), runner.cancel
                }

                function cancelChildAnimations(element) {
                    var node = extractElementNode(element);
                    if (node) {
                        var nodes = angular.isFunction(node.getElementsByClassName) ? node.getElementsByClassName(NG_ANIMATE_CLASS_NAME) : node.querySelectorAll("." + NG_ANIMATE_CLASS_NAME);
                        forEach(nodes, function(element) {
                            element = angular.element(element);
                            var data = element.data(NG_ANIMATE_STATE);
                            data && data.active && forEach(data.active, function(runner) {
                                runner.cancel()
                            })
                        })
                    }
                }

                function cleanup(element, className) {
                    if (isMatchingElement(element, $rootElement)) rootAnimateState.disabled || (rootAnimateState.running = !1, rootAnimateState.structural = !1);
                    else if (className) {
                        var data = element.data(NG_ANIMATE_STATE) || {},
                            removeAnimations = className === !0;
                        !removeAnimations && data.active && data.active[className] && (data.totalActive--, delete data.active[className]), !removeAnimations && data.totalActive || ($$jqLite.removeClass(element, NG_ANIMATE_CLASS_NAME), element.removeData(NG_ANIMATE_STATE))
                    }
                }

                function animationsDisabled(element, parentElement) {
                    if (rootAnimateState.disabled) return !0;
                    if (isMatchingElement(element, $rootElement)) return rootAnimateState.running;
                    var allowChildAnimations, parentRunningAnimation, hasParent;
                    do {
                        if (0 === parentElement.length) break;
                        var isRoot = isMatchingElement(parentElement, $rootElement),
                            state = isRoot ? rootAnimateState : parentElement.data(NG_ANIMATE_STATE) || {};
                        if (state.disabled) return !0;
                        if (isRoot && (hasParent = !0), allowChildAnimations !== !1) {
                            var animateChildrenFlag = parentElement.data(NG_ANIMATE_CHILDREN);
                            angular.isDefined(animateChildrenFlag) && (allowChildAnimations = animateChildrenFlag)
                        }
                        parentRunningAnimation = parentRunningAnimation || state.running || state.last && !state.last.isClassBased
                    } while (parentElement = parentElement.parent());
                    return !hasParent || !allowChildAnimations && parentRunningAnimation
                }
                $$jqLite = $$$jqLite, $rootElement.data(NG_ANIMATE_STATE, rootAnimateState);
                var deregisterWatch = $rootScope.$watch(function() {
                        return $templateRequest.totalPendingRequests
                    }, function(val, oldVal) {
                        0 === val && (deregisterWatch(), $rootScope.$$postDigest(function() {
                            $rootScope.$$postDigest(function() {
                                rootAnimateState.running = !1
                            })
                        }))
                    }),
                    globalAnimationCounter = 0,
                    classNameFilter = $animateProvider.classNameFilter(),
                    isAnimatableClassName = classNameFilter ? function(className) {
                        return classNameFilter.test(className)
                    } : function() {
                        return !0
                    };
                return {
                    animate: function(element, from, to, className, options) {
                        return className = className || "ng-inline-animate", options = parseAnimateOptions(options) || {}, options.from = to ? from : null, options.to = to ? to : from, runAnimationPostDigest(function(done) {
                            return performAnimation("animate", className, stripCommentsFromElement(element), null, null, noop, options, done)
                        })
                    },
                    enter: function(element, parentElement, afterElement, options) {
                        return options = parseAnimateOptions(options), element = angular.element(element), parentElement = prepareElement(parentElement), afterElement = prepareElement(afterElement), classBasedAnimationsBlocked(element, !0), $delegate.enter(element, parentElement, afterElement), runAnimationPostDigest(function(done) {
                            return performAnimation("enter", "ng-enter", stripCommentsFromElement(element), parentElement, afterElement, noop, options, done)
                        })
                    },
                    leave: function(element, options) {
                        return options = parseAnimateOptions(options), element = angular.element(element), cancelChildAnimations(element), classBasedAnimationsBlocked(element, !0), runAnimationPostDigest(function(done) {
                            return performAnimation("leave", "ng-leave", stripCommentsFromElement(element), null, null, function() {
                                $delegate.leave(element)
                            }, options, done)
                        })
                    },
                    move: function(element, parentElement, afterElement, options) {
                        return options = parseAnimateOptions(options), element = angular.element(element), parentElement = prepareElement(parentElement), afterElement = prepareElement(afterElement), cancelChildAnimations(element), classBasedAnimationsBlocked(element, !0), $delegate.move(element, parentElement, afterElement), runAnimationPostDigest(function(done) {
                            return performAnimation("move", "ng-move", stripCommentsFromElement(element), parentElement, afterElement, noop, options, done)
                        })
                    },
                    addClass: function(element, className, options) {
                        return this.setClass(element, className, [], options)
                    },
                    removeClass: function(element, className, options) {
                        return this.setClass(element, [], className, options)
                    },
                    setClass: function(element, add, remove, options) {
                        options = parseAnimateOptions(options);
                        var STORAGE_KEY = "$$animateClasses";
                        if (element = angular.element(element), element = stripCommentsFromElement(element), classBasedAnimationsBlocked(element)) return $delegate.$$setClassImmediately(element, add, remove, options);
                        var classes, cache = element.data(STORAGE_KEY),
                            hasCache = !!cache;
                        return cache || (cache = {}, cache.classes = {}), classes = cache.classes, add = isArray(add) ? add : add.split(" "), forEach(add, function(c) {
                            c && c.length && (classes[c] = !0)
                        }), remove = isArray(remove) ? remove : remove.split(" "), forEach(remove, function(c) {
                            c && c.length && (classes[c] = !1)
                        }), hasCache ? (options && cache.options && (cache.options = angular.extend(cache.options || {}, options)), cache.promise) : (element.data(STORAGE_KEY, cache = {
                            classes: classes,
                            options: options
                        }), cache.promise = runAnimationPostDigest(function(done) {
                            var parentElement = element.parent(),
                                elementNode = extractElementNode(element),
                                parentNode = elementNode.parentNode;
                            if (!parentNode || parentNode.$$NG_REMOVED || elementNode.$$NG_REMOVED) return void done();
                            var cache = element.data(STORAGE_KEY);
                            element.removeData(STORAGE_KEY);
                            var state = element.data(NG_ANIMATE_STATE) || {},
                                classes = resolveElementClasses(element, cache, state.active);
                            return classes ? performAnimation("setClass", classes, element, parentElement, null, function() {
                                classes[0] && $delegate.$$addClassImmediately(element, classes[0]), classes[1] && $delegate.$$removeClassImmediately(element, classes[1])
                            }, cache.options, done) : done()
                        }))
                    },
                    cancel: function(promise) {
                        promise.$$cancelFn()
                    },
                    enabled: function(value, element) {
                        switch (arguments.length) {
                            case 2:
                                if (value) cleanup(element);
                                else {
                                    var data = element.data(NG_ANIMATE_STATE) || {};
                                    data.disabled = !0, element.data(NG_ANIMATE_STATE, data)
                                }
                                break;
                            case 1:
                                rootAnimateState.disabled = !value;
                                break;
                            default:
                                value = !rootAnimateState.disabled
                        }
                        return !!value
                    }
                }
            }]), $animateProvider.register("", ["$window", "$sniffer", "$timeout", "$$animateReflow", function($window, $sniffer, $timeout, $$animateReflow) {
                function clearCacheAfterReflow() {
                    cancelAnimationReflow || (cancelAnimationReflow = $$animateReflow(function() {
                        animationReflowQueue = [], cancelAnimationReflow = null, lookupCache = {}
                    }))
                }

                function afterReflow(element, callback) {
                    cancelAnimationReflow && cancelAnimationReflow(), animationReflowQueue.push(callback), cancelAnimationReflow = $$animateReflow(function() {
                        forEach(animationReflowQueue, function(fn) {
                            fn()
                        }), animationReflowQueue = [], cancelAnimationReflow = null, lookupCache = {}
                    })
                }

                function animationCloseHandler(element, totalTime) {
                    var node = extractElementNode(element);
                    element = angular.element(node), animationElementQueue.push(element);
                    var futureTimestamp = Date.now() + totalTime;
                    futureTimestamp <= closingTimestamp || ($timeout.cancel(closingTimer), closingTimestamp = futureTimestamp, closingTimer = $timeout(function() {
                        closeAllAnimations(animationElementQueue), animationElementQueue = []
                    }, totalTime, !1))
                }

                function closeAllAnimations(elements) {
                    forEach(elements, function(element) {
                        var elementData = element.data(NG_ANIMATE_CSS_DATA_KEY);
                        elementData && forEach(elementData.closeAnimationFns, function(fn) {
                            fn()
                        })
                    })
                }

                function getElementAnimationDetails(element, cacheKey) {
                    var data = cacheKey ? lookupCache[cacheKey] : null;
                    if (!data) {
                        var transitionDuration = 0,
                            transitionDelay = 0,
                            animationDuration = 0,
                            animationDelay = 0;
                        forEach(element, function(element) {
                            if (element.nodeType == ELEMENT_NODE) {
                                var elementStyles = $window.getComputedStyle(element) || {},
                                    transitionDurationStyle = elementStyles[TRANSITION_PROP + DURATION_KEY];
                                transitionDuration = Math.max(parseMaxTime(transitionDurationStyle), transitionDuration);
                                var transitionDelayStyle = elementStyles[TRANSITION_PROP + DELAY_KEY];
                                transitionDelay = Math.max(parseMaxTime(transitionDelayStyle), transitionDelay);
                                elementStyles[ANIMATION_PROP + DELAY_KEY];
                                animationDelay = Math.max(parseMaxTime(elementStyles[ANIMATION_PROP + DELAY_KEY]), animationDelay);
                                var aDuration = parseMaxTime(elementStyles[ANIMATION_PROP + DURATION_KEY]);
                                aDuration > 0 && (aDuration *= parseInt(elementStyles[ANIMATION_PROP + ANIMATION_ITERATION_COUNT_KEY], 10) || 1), animationDuration = Math.max(aDuration, animationDuration)
                            }
                        }), data = {
                            total: 0,
                            transitionDelay: transitionDelay,
                            transitionDuration: transitionDuration,
                            animationDelay: animationDelay,
                            animationDuration: animationDuration
                        }, cacheKey && (lookupCache[cacheKey] = data)
                    }
                    return data
                }

                function parseMaxTime(str) {
                    var maxValue = 0,
                        values = isString(str) ? str.split(/\s*,\s*/) : [];
                    return forEach(values, function(value) {
                        maxValue = Math.max(parseFloat(value) || 0, maxValue)
                    }), maxValue
                }

                function getCacheKey(element) {
                    var parentElement = element.parent(),
                        parentID = parentElement.data(NG_ANIMATE_PARENT_KEY);
                    return parentID || (parentElement.data(NG_ANIMATE_PARENT_KEY, ++parentCounter), parentID = parentCounter), parentID + "-" + extractElementNode(element).getAttribute("class")
                }

                function animateSetup(animationEvent, element, className, styles) {
                    var structural = ["ng-enter", "ng-leave", "ng-move"].indexOf(className) >= 0,
                        cacheKey = getCacheKey(element),
                        eventCacheKey = cacheKey + " " + className,
                        itemIndex = lookupCache[eventCacheKey] ? ++lookupCache[eventCacheKey].total : 0,
                        stagger = {};
                    if (itemIndex > 0) {
                        var staggerClassName = className + "-stagger",
                            staggerCacheKey = cacheKey + " " + staggerClassName,
                            applyClasses = !lookupCache[staggerCacheKey];
                        applyClasses && $$jqLite.addClass(element, staggerClassName), stagger = getElementAnimationDetails(element, staggerCacheKey), applyClasses && $$jqLite.removeClass(element, staggerClassName)
                    }
                    $$jqLite.addClass(element, className);
                    var formerData = element.data(NG_ANIMATE_CSS_DATA_KEY) || {},
                        timings = getElementAnimationDetails(element, eventCacheKey),
                        transitionDuration = timings.transitionDuration,
                        animationDuration = timings.animationDuration;
                    if (structural && 0 === transitionDuration && 0 === animationDuration) return $$jqLite.removeClass(element, className), !1;
                    var blockTransition = styles || structural && transitionDuration > 0,
                        blockAnimation = animationDuration > 0 && stagger.animationDelay > 0 && 0 === stagger.animationDuration,
                        closeAnimationFns = formerData.closeAnimationFns || [];
                    element.data(NG_ANIMATE_CSS_DATA_KEY, {
                        stagger: stagger,
                        cacheKey: eventCacheKey,
                        running: formerData.running || 0,
                        itemIndex: itemIndex,
                        blockTransition: blockTransition,
                        closeAnimationFns: closeAnimationFns
                    });
                    var node = extractElementNode(element);
                    return blockTransition && (blockTransitions(node, !0), styles && element.css(styles)), blockAnimation && blockAnimations(node, !0), !0
                }

                function animateRun(animationEvent, element, className, activeAnimationComplete, styles) {
                    function onEnd() {
                        element.off(css3AnimationEvents, onAnimationProgress), $$jqLite.removeClass(element, activeClassName), $$jqLite.removeClass(element, pendingClassName), staggerTimeout && $timeout.cancel(staggerTimeout), animateClose(element, className);
                        var node = extractElementNode(element);
                        for (var i in appliedStyles) node.style.removeProperty(appliedStyles[i])
                    }

                    function onAnimationProgress(event) {
                        event.stopPropagation();
                        var ev = event.originalEvent || event,
                            timeStamp = ev.$manualTimeStamp || ev.timeStamp || Date.now(),
                            elapsedTime = parseFloat(ev.elapsedTime.toFixed(ELAPSED_TIME_MAX_DECIMAL_PLACES));
                        Math.max(timeStamp - startTime, 0) >= maxDelayTime && elapsedTime >= maxDuration && activeAnimationComplete()
                    }
                    var node = extractElementNode(element),
                        elementData = element.data(NG_ANIMATE_CSS_DATA_KEY);
                    if (node.getAttribute("class").indexOf(className) == -1 || !elementData) return void activeAnimationComplete();
                    var activeClassName = "",
                        pendingClassName = "";
                    forEach(className.split(" "), function(klass, i) {
                        var prefix = (i > 0 ? " " : "") + klass;
                        activeClassName += prefix + "-active", pendingClassName += prefix + "-pending"
                    });
                    var style = "",
                        appliedStyles = [],
                        itemIndex = elementData.itemIndex,
                        stagger = elementData.stagger,
                        staggerTime = 0;
                    if (itemIndex > 0) {
                        var transitionStaggerDelay = 0;
                        stagger.transitionDelay > 0 && 0 === stagger.transitionDuration && (transitionStaggerDelay = stagger.transitionDelay * itemIndex);
                        var animationStaggerDelay = 0;
                        stagger.animationDelay > 0 && 0 === stagger.animationDuration && (animationStaggerDelay = stagger.animationDelay * itemIndex, appliedStyles.push(CSS_PREFIX + "animation-play-state")), staggerTime = Math.round(100 * Math.max(transitionStaggerDelay, animationStaggerDelay)) / 100
                    }
                    staggerTime || ($$jqLite.addClass(element, activeClassName), elementData.blockTransition && blockTransitions(node, !1));
                    var eventCacheKey = elementData.cacheKey + " " + activeClassName,
                        timings = getElementAnimationDetails(element, eventCacheKey),
                        maxDuration = Math.max(timings.transitionDuration, timings.animationDuration);
                    if (0 === maxDuration) return $$jqLite.removeClass(element, activeClassName), animateClose(element, className), void activeAnimationComplete();
                    !staggerTime && styles && Object.keys(styles).length > 0 && (timings.transitionDuration || (element.css("transition", timings.animationDuration + "s linear all"), appliedStyles.push("transition")), element.css(styles));
                    var maxDelay = Math.max(timings.transitionDelay, timings.animationDelay),
                        maxDelayTime = maxDelay * ONE_SECOND;
                    if (appliedStyles.length > 0) {
                        var oldStyle = node.getAttribute("style") || "";
                        ";" !== oldStyle.charAt(oldStyle.length - 1) && (oldStyle += ";"), node.setAttribute("style", oldStyle + " " + style)
                    }
                    var staggerTimeout, startTime = Date.now(),
                        css3AnimationEvents = ANIMATIONEND_EVENT + " " + TRANSITIONEND_EVENT,
                        animationTime = (maxDelay + maxDuration) * CLOSING_TIME_BUFFER,
                        totalTime = (staggerTime + animationTime) * ONE_SECOND;
                    return staggerTime > 0 && ($$jqLite.addClass(element, pendingClassName), staggerTimeout = $timeout(function() {
                        staggerTimeout = null, timings.transitionDuration > 0 && blockTransitions(node, !1), timings.animationDuration > 0 && blockAnimations(node, !1), $$jqLite.addClass(element, activeClassName), $$jqLite.removeClass(element, pendingClassName), styles && (0 === timings.transitionDuration && element.css("transition", timings.animationDuration + "s linear all"), element.css(styles), appliedStyles.push("transition"))
                    }, staggerTime * ONE_SECOND, !1)), element.on(css3AnimationEvents, onAnimationProgress), elementData.closeAnimationFns.push(function() {
                        onEnd(), activeAnimationComplete()
                    }), elementData.running++, animationCloseHandler(element, totalTime), onEnd
                }

                function blockTransitions(node, bool) {
                    node.style[TRANSITION_PROP + PROPERTY_KEY] = bool ? "none" : ""
                }

                function blockAnimations(node, bool) {
                    node.style[ANIMATION_PROP + ANIMATION_PLAYSTATE_KEY] = bool ? "paused" : ""
                }

                function animateBefore(animationEvent, element, className, styles) {
                    if (animateSetup(animationEvent, element, className, styles)) return function(cancelled) {
                        cancelled && animateClose(element, className)
                    }
                }

                function animateAfter(animationEvent, element, className, afterAnimationComplete, styles) {
                    return element.data(NG_ANIMATE_CSS_DATA_KEY) ? animateRun(animationEvent, element, className, afterAnimationComplete, styles) : (animateClose(element, className), void afterAnimationComplete())
                }

                function animate(animationEvent, element, className, animationComplete, options) {
                    var preReflowCancellation = animateBefore(animationEvent, element, className, options.from);
                    if (!preReflowCancellation) return clearCacheAfterReflow(), void animationComplete();
                    var cancel = preReflowCancellation;
                    return afterReflow(element, function() {
                            cancel = animateAfter(animationEvent, element, className, animationComplete, options.to)
                        }),
                        function(cancelled) {
                            (cancel || noop)(cancelled)
                        }
                }

                function animateClose(element, className) {
                    $$jqLite.removeClass(element, className);
                    var data = element.data(NG_ANIMATE_CSS_DATA_KEY);
                    data && (data.running && data.running--, data.running && 0 !== data.running || element.removeData(NG_ANIMATE_CSS_DATA_KEY))
                }

                function suffixClasses(classes, suffix) {
                    var className = "";
                    return classes = isArray(classes) ? classes : classes.split(/\s+/), forEach(classes, function(klass, i) {
                        klass && klass.length > 0 && (className += (i > 0 ? " " : "") + klass + suffix)
                    }), className
                }
                var TRANSITION_PROP, TRANSITIONEND_EVENT, ANIMATION_PROP, ANIMATIONEND_EVENT, CSS_PREFIX = "";
                window.ontransitionend === undefined && window.onwebkittransitionend !== undefined ? (CSS_PREFIX = "-webkit-", TRANSITION_PROP = "WebkitTransition", TRANSITIONEND_EVENT = "webkitTransitionEnd transitionend") : (TRANSITION_PROP = "transition", TRANSITIONEND_EVENT = "transitionend"), window.onanimationend === undefined && window.onwebkitanimationend !== undefined ? (CSS_PREFIX = "-webkit-", ANIMATION_PROP = "WebkitAnimation", ANIMATIONEND_EVENT = "webkitAnimationEnd animationend") : (ANIMATION_PROP = "animation", ANIMATIONEND_EVENT = "animationend");
                var cancelAnimationReflow, DURATION_KEY = "Duration",
                    PROPERTY_KEY = "Property",
                    DELAY_KEY = "Delay",
                    ANIMATION_ITERATION_COUNT_KEY = "IterationCount",
                    ANIMATION_PLAYSTATE_KEY = "PlayState",
                    NG_ANIMATE_PARENT_KEY = "$$ngAnimateKey",
                    NG_ANIMATE_CSS_DATA_KEY = "$$ngAnimateCSS3Data",
                    ELAPSED_TIME_MAX_DECIMAL_PLACES = 3,
                    CLOSING_TIME_BUFFER = 1.5,
                    ONE_SECOND = 1e3,
                    lookupCache = {},
                    parentCounter = 0,
                    animationReflowQueue = [],
                    closingTimer = null,
                    closingTimestamp = 0,
                    animationElementQueue = [];
                return {
                    animate: function(element, className, from, to, animationCompleted, options) {
                        return options = options || {}, options.from = from, options.to = to, animate("animate", element, className, animationCompleted, options)
                    },
                    enter: function(element, animationCompleted, options) {
                        return options = options || {}, animate("enter", element, "ng-enter", animationCompleted, options)
                    },
                    leave: function(element, animationCompleted, options) {
                        return options = options || {}, animate("leave", element, "ng-leave", animationCompleted, options)
                    },
                    move: function(element, animationCompleted, options) {
                        return options = options || {}, animate("move", element, "ng-move", animationCompleted, options)
                    },
                    beforeSetClass: function(element, add, remove, animationCompleted, options) {
                        options = options || {};
                        var className = suffixClasses(remove, "-remove") + " " + suffixClasses(add, "-add"),
                            cancellationMethod = animateBefore("setClass", element, className, options.from);
                        return cancellationMethod ? (afterReflow(element, animationCompleted), cancellationMethod) : (clearCacheAfterReflow(), void animationCompleted())
                    },
                    beforeAddClass: function(element, className, animationCompleted, options) {
                        options = options || {};
                        var cancellationMethod = animateBefore("addClass", element, suffixClasses(className, "-add"), options.from);
                        return cancellationMethod ? (afterReflow(element, animationCompleted), cancellationMethod) : (clearCacheAfterReflow(), void animationCompleted())
                    },
                    beforeRemoveClass: function(element, className, animationCompleted, options) {
                        options = options || {};
                        var cancellationMethod = animateBefore("removeClass", element, suffixClasses(className, "-remove"), options.from);
                        return cancellationMethod ? (afterReflow(element, animationCompleted), cancellationMethod) : (clearCacheAfterReflow(), void animationCompleted())
                    },
                    setClass: function(element, add, remove, animationCompleted, options) {
                        options = options || {}, remove = suffixClasses(remove, "-remove"), add = suffixClasses(add, "-add");
                        var className = remove + " " + add;
                        return animateAfter("setClass", element, className, animationCompleted, options.to)
                    },
                    addClass: function(element, className, animationCompleted, options) {
                        return options = options || {}, animateAfter("addClass", element, suffixClasses(className, "-add"), animationCompleted, options.to)
                    },
                    removeClass: function(element, className, animationCompleted, options) {
                        return options = options || {}, animateAfter("removeClass", element, suffixClasses(className, "-remove"), animationCompleted, options.to)
                    }
                }
            }])
        }])
    }(window, window.angular),
    function(window, angular, undefined) {
        "use strict";

        function $$CookieWriter($document, $log, $browser) {
            function buildCookieString(name, value, options) {
                var path, expires;
                options = options || {}, expires = options.expires, path = angular.isDefined(options.path) ? options.path : cookiePath, value === undefined && (expires = "Thu, 01 Jan 1970 00:00:00 GMT", value = ""), angular.isString(expires) && (expires = new Date(expires));
                var str = encodeURIComponent(name) + "=" + encodeURIComponent(value);
                str += path ? ";path=" + path : "", str += options.domain ? ";domain=" + options.domain : "", str += expires ? ";expires=" + expires.toUTCString() : "", str += options.secure ? ";secure" : "";
                var cookieLength = str.length + 1;
                return cookieLength > 4096 && $log.warn("Cookie '" + name + "' possibly not set or overflowed because it was too large (" + cookieLength + " > 4096 bytes)!"), str
            }
            var cookiePath = $browser.baseHref(),
                rawDocument = $document[0];
            return function(name, value, options) {
                rawDocument.cookie = buildCookieString(name, value, options)
            }
        }
        angular.module("ngCookies", ["ng"]).provider("$cookies", [function() {
            function calcOptions(options) {
                return options ? angular.extend({}, defaults, options) : defaults
            }
            var defaults = this.defaults = {};
            this.$get = ["$$cookieReader", "$$cookieWriter", function($$cookieReader, $$cookieWriter) {
                return {
                    get: function(key) {
                        return $$cookieReader()[key]
                    },
                    getObject: function(key) {
                        var value = this.get(key);
                        return value ? angular.fromJson(value) : value
                    },
                    getAll: function() {
                        return $$cookieReader()
                    },
                    put: function(key, value, options) {
                        $$cookieWriter(key, value, calcOptions(options))
                    },
                    putObject: function(key, value, options) {
                        this.put(key, angular.toJson(value), options)
                    },
                    remove: function(key, options) {
                        $$cookieWriter(key, undefined, calcOptions(options))
                    }
                }
            }]
        }]), angular.module("ngCookies").factory("$cookieStore", ["$cookies", function($cookies) {
            return {
                get: function(key) {
                    return $cookies.getObject(key)
                },
                put: function(key, value) {
                    $cookies.putObject(key, value)
                },
                remove: function(key) {
                    $cookies.remove(key)
                }
            }
        }]), $$CookieWriter.$inject = ["$document", "$log", "$browser"], angular.module("ngCookies").provider("$$cookieWriter", function() {
            this.$get = $$CookieWriter
        })
    }(window, window.angular),
    function() {
        function baseCompareAscending(value, other) {
            if (value !== other) {
                var valIsReflexive = value === value,
                    othIsReflexive = other === other;
                if (value > other || !valIsReflexive || "undefined" == typeof value && othIsReflexive) return 1;
                if (value < other || !othIsReflexive || "undefined" == typeof other && valIsReflexive) return -1
            }
            return 0
        }

        function baseIndexOf(array, value, fromIndex) {
            if (value !== value) return indexOfNaN(array, fromIndex);
            for (var index = fromIndex - 1, length = array.length; ++index < length;)
                if (array[index] === value) return index;
            return -1
        }

        function baseIsFunction(value) {
            return "function" == typeof value || !1
        }

        function baseToString(value) {
            return "string" == typeof value ? value : null == value ? "" : value + ""
        }

        function charAtCallback(string) {
            return string.charCodeAt(0)
        }

        function charsLeftIndex(string, chars) {
            for (var index = -1, length = string.length; ++index < length && chars.indexOf(string.charAt(index)) > -1;);
            return index
        }

        function charsRightIndex(string, chars) {
            for (var index = string.length; index-- && chars.indexOf(string.charAt(index)) > -1;);
            return index
        }

        function compareAscending(object, other) {
            return baseCompareAscending(object.criteria, other.criteria) || object.index - other.index
        }

        function compareMultiple(object, other, orders) {
            for (var index = -1, objCriteria = object.criteria, othCriteria = other.criteria, length = objCriteria.length, ordersLength = orders.length; ++index < length;) {
                var result = baseCompareAscending(objCriteria[index], othCriteria[index]);
                if (result) return index >= ordersLength ? result : result * (orders[index] ? 1 : -1)
            }
            return object.index - other.index
        }

        function deburrLetter(letter) {
            return deburredLetters[letter]
        }

        function escapeHtmlChar(chr) {
            return htmlEscapes[chr]
        }

        function escapeStringChar(chr) {
            return "\\" + stringEscapes[chr]
        }

        function indexOfNaN(array, fromIndex, fromRight) {
            for (var length = array.length, index = fromIndex + (fromRight ? 0 : -1); fromRight ? index-- : ++index < length;) {
                var other = array[index];
                if (other !== other) return index
            }
            return -1
        }

        function isObjectLike(value) {
            return value && "object" == typeof value || !1
        }

        function isSpace(charCode) {
            return charCode <= 160 && charCode >= 9 && charCode <= 13 || 32 == charCode || 160 == charCode || 5760 == charCode || 6158 == charCode || charCode >= 8192 && (charCode <= 8202 || 8232 == charCode || 8233 == charCode || 8239 == charCode || 8287 == charCode || 12288 == charCode || 65279 == charCode)
        }

        function replaceHolders(array, placeholder) {
            for (var index = -1, length = array.length, resIndex = -1, result = []; ++index < length;) array[index] === placeholder && (array[index] = PLACEHOLDER, result[++resIndex] = index);
            return result
        }

        function sortedUniq(array, iteratee) {
            for (var seen, index = -1, length = array.length, resIndex = -1, result = []; ++index < length;) {
                var value = array[index],
                    computed = iteratee ? iteratee(value, index, array) : value;
                index && seen === computed || (seen = computed, result[++resIndex] = value)
            }
            return result
        }

        function trimmedLeftIndex(string) {
            for (var index = -1, length = string.length; ++index < length && isSpace(string.charCodeAt(index)););
            return index
        }

        function trimmedRightIndex(string) {
            for (var index = string.length; index-- && isSpace(string.charCodeAt(index)););
            return index
        }

        function unescapeHtmlChar(chr) {
            return htmlUnescapes[chr]
        }

        function runInContext(context) {
            function lodash(value) {
                if (isObjectLike(value) && !isArray(value) && !(value instanceof LazyWrapper)) {
                    if (value instanceof LodashWrapper) return value;
                    if (hasOwnProperty.call(value, "__chain__") && hasOwnProperty.call(value, "__wrapped__")) return wrapperClone(value)
                }
                return new LodashWrapper(value)
            }

            function baseLodash() {}

            function LodashWrapper(value, chainAll, actions) {
                this.__wrapped__ = value, this.__actions__ = actions || [], this.__chain__ = !!chainAll
            }

            function LazyWrapper(value) {
                this.__wrapped__ = value, this.__actions__ = null, this.__dir__ = 1, this.__dropCount__ = 0, this.__filtered__ = !1, this.__iteratees__ = null, this.__takeCount__ = POSITIVE_INFINITY, this.__views__ = null
            }

            function lazyClone() {
                var actions = this.__actions__,
                    iteratees = this.__iteratees__,
                    views = this.__views__,
                    result = new LazyWrapper(this.__wrapped__);
                return result.__actions__ = actions ? arrayCopy(actions) : null, result.__dir__ = this.__dir__, result.__filtered__ = this.__filtered__, result.__iteratees__ = iteratees ? arrayCopy(iteratees) : null, result.__takeCount__ = this.__takeCount__, result.__views__ = views ? arrayCopy(views) : null, result
            }

            function lazyReverse() {
                if (this.__filtered__) {
                    var result = new LazyWrapper(this);
                    result.__dir__ = -1, result.__filtered__ = !0
                } else result = this.clone(), result.__dir__ *= -1;
                return result
            }

            function lazyValue() {
                var array = this.__wrapped__.value();
                if (!isArray(array)) return baseWrapperValue(array, this.__actions__);
                var dir = this.__dir__,
                    isRight = dir < 0,
                    view = getView(0, array.length, this.__views__),
                    start = view.start,
                    end = view.end,
                    length = end - start,
                    index = isRight ? end : start - 1,
                    takeCount = nativeMin(length, this.__takeCount__),
                    iteratees = this.__iteratees__,
                    iterLength = iteratees ? iteratees.length : 0,
                    resIndex = 0,
                    result = [];
                outer: for (; length-- && resIndex < takeCount;) {
                    index += dir;
                    for (var iterIndex = -1, value = array[index]; ++iterIndex < iterLength;) {
                        var data = iteratees[iterIndex],
                            iteratee = data.iteratee,
                            type = data.type;
                        if (type == LAZY_DROP_WHILE_FLAG) {
                            if (data.done && (isRight ? index > data.index : index < data.index) && (data.count = 0, data.done = !1), data.index = index, !data.done) {
                                var limit = data.limit;
                                if (!(data.done = limit > -1 ? data.count++ >= limit : !iteratee(value))) continue outer
                            }
                        } else {
                            var computed = iteratee(value);
                            if (type == LAZY_MAP_FLAG) value = computed;
                            else if (!computed) {
                                if (type == LAZY_FILTER_FLAG) continue outer;
                                break outer
                            }
                        }
                    }
                    result[resIndex++] = value
                }
                return result
            }

            function MapCache() {
                this.__data__ = {}
            }

            function mapDelete(key) {
                return this.has(key) && delete this.__data__[key]
            }

            function mapGet(key) {
                return "__proto__" == key ? undefined : this.__data__[key]
            }

            function mapHas(key) {
                return "__proto__" != key && hasOwnProperty.call(this.__data__, key)
            }

            function mapSet(key, value) {
                return "__proto__" != key && (this.__data__[key] = value), this
            }

            function SetCache(values) {
                var length = values ? values.length : 0;
                for (this.data = {
                        hash: nativeCreate(null),
                        set: new Set
                    }; length--;) this.push(values[length])
            }

            function cacheIndexOf(cache, value) {
                var data = cache.data,
                    result = "string" == typeof value || isObject(value) ? data.set.has(value) : data.hash[value];
                return result ? 0 : -1
            }

            function cachePush(value) {
                var data = this.data;
                "string" == typeof value || isObject(value) ? data.set.add(value) : data.hash[value] = !0
            }

            function arrayCopy(source, array) {
                var index = -1,
                    length = source.length;
                for (array || (array = Array(length)); ++index < length;) array[index] = source[index];
                return array
            }

            function arrayEach(array, iteratee) {
                for (var index = -1, length = array.length; ++index < length && iteratee(array[index], index, array) !== !1;);
                return array
            }

            function arrayEachRight(array, iteratee) {
                for (var length = array.length; length-- && iteratee(array[length], length, array) !== !1;);
                return array
            }

            function arrayEvery(array, predicate) {
                for (var index = -1, length = array.length; ++index < length;)
                    if (!predicate(array[index], index, array)) return !1;
                return !0
            }

            function arrayFilter(array, predicate) {
                for (var index = -1, length = array.length, resIndex = -1, result = []; ++index < length;) {
                    var value = array[index];
                    predicate(value, index, array) && (result[++resIndex] = value)
                }
                return result
            }

            function arrayMap(array, iteratee) {
                for (var index = -1, length = array.length, result = Array(length); ++index < length;) result[index] = iteratee(array[index], index, array);
                return result
            }

            function arrayMax(array) {
                for (var index = -1, length = array.length, result = NEGATIVE_INFINITY; ++index < length;) {
                    var value = array[index];
                    value > result && (result = value)
                }
                return result
            }

            function arrayMin(array) {
                for (var index = -1, length = array.length, result = POSITIVE_INFINITY; ++index < length;) {
                    var value = array[index];
                    value < result && (result = value)
                }
                return result
            }

            function arrayReduce(array, iteratee, accumulator, initFromArray) {
                var index = -1,
                    length = array.length;
                for (initFromArray && length && (accumulator = array[++index]); ++index < length;) accumulator = iteratee(accumulator, array[index], index, array);
                return accumulator
            }

            function arrayReduceRight(array, iteratee, accumulator, initFromArray) {
                var length = array.length;
                for (initFromArray && length && (accumulator = array[--length]); length--;) accumulator = iteratee(accumulator, array[length], length, array);
                return accumulator
            }

            function arraySome(array, predicate) {
                for (var index = -1, length = array.length; ++index < length;)
                    if (predicate(array[index], index, array)) return !0;
                return !1
            }

            function assignDefaults(objectValue, sourceValue) {
                return "undefined" == typeof objectValue ? sourceValue : objectValue
            }

            function assignOwnDefaults(objectValue, sourceValue, key, object) {
                return "undefined" != typeof objectValue && hasOwnProperty.call(object, key) ? objectValue : sourceValue
            }

            function baseAssign(object, source, customizer) {
                var props = keys(source);
                if (!customizer) return baseCopy(source, object, props);
                for (var index = -1, length = props.length; ++index < length;) {
                    var key = props[index],
                        value = object[key],
                        result = customizer(value, source[key], key, object, source);
                    (result === result ? result === value : value !== value) && ("undefined" != typeof value || key in object) || (object[key] = result)
                }
                return object
            }

            function baseAt(collection, props) {
                for (var index = -1, length = collection.length, isArr = isLength(length), propsLength = props.length, result = Array(propsLength); ++index < propsLength;) {
                    var key = props[index];
                    isArr ? (key = parseFloat(key), result[index] = isIndex(key, length) ? collection[key] : undefined) : result[index] = collection[key]
                }
                return result
            }

            function baseCopy(source, object, props) {
                props || (props = object, object = {});
                for (var index = -1, length = props.length; ++index < length;) {
                    var key = props[index];
                    object[key] = source[key]
                }
                return object
            }

            function baseBindAll(object, methodNames) {
                for (var index = -1, length = methodNames.length; ++index < length;) {
                    var key = methodNames[index];
                    object[key] = createWrapper(object[key], BIND_FLAG, object)
                }
                return object
            }

            function baseCallback(func, thisArg, argCount) {
                var type = typeof func;
                return "function" == type ? "undefined" != typeof thisArg && isBindable(func) ? bindCallback(func, thisArg, argCount) : func : null == func ? identity : "object" == type ? baseMatches(func) : "undefined" == typeof thisArg ? baseProperty(func + "") : baseMatchesProperty(func + "", thisArg)
            }

            function baseClone(value, isDeep, customizer, key, object, stackA, stackB) {
                var result;
                if (customizer && (result = object ? customizer(value, key, object) : customizer(value)), "undefined" != typeof result) return result;
                if (!isObject(value)) return value;
                var isArr = isArray(value);
                if (isArr) {
                    if (result = initCloneArray(value), !isDeep) return arrayCopy(value, result)
                } else {
                    var tag = objToString.call(value),
                        isFunc = tag == funcTag;
                    if (tag != objectTag && tag != argsTag && (!isFunc || object)) return cloneableTags[tag] ? initCloneByTag(value, tag, isDeep) : object ? value : {};
                    if (result = initCloneObject(isFunc ? {} : value), !isDeep) return baseCopy(value, result, keys(value))
                }
                stackA || (stackA = []), stackB || (stackB = []);
                for (var length = stackA.length; length--;)
                    if (stackA[length] == value) return stackB[length];
                return stackA.push(value), stackB.push(result), (isArr ? arrayEach : baseForOwn)(value, function(subValue, key) {
                    result[key] = baseClone(subValue, isDeep, customizer, key, value, stackA, stackB)
                }), result
            }

            function baseDelay(func, wait, args, fromIndex) {
                if ("function" != typeof func) throw new TypeError(FUNC_ERROR_TEXT);
                return setTimeout(function() {
                    func.apply(undefined, baseSlice(args, fromIndex))
                }, wait)
            }

            function baseDifference(array, values) {
                var length = array ? array.length : 0,
                    result = [];
                if (!length) return result;
                var index = -1,
                    indexOf = getIndexOf(),
                    isCommon = indexOf == baseIndexOf,
                    cache = isCommon && values.length >= 200 ? createCache(values) : null,
                    valuesLength = values.length;
                cache && (indexOf = cacheIndexOf, isCommon = !1, values = cache);
                outer: for (; ++index < length;) {
                    var value = array[index];
                    if (isCommon && value === value) {
                        for (var valuesIndex = valuesLength; valuesIndex--;)
                            if (values[valuesIndex] === value) continue outer;
                        result.push(value)
                    } else indexOf(values, value, 0) < 0 && result.push(value)
                }
                return result
            }

            function baseEach(collection, iteratee) {
                var length = collection ? collection.length : 0;
                if (!isLength(length)) return baseForOwn(collection, iteratee);
                for (var index = -1, iterable = toObject(collection); ++index < length && iteratee(iterable[index], index, iterable) !== !1;);
                return collection
            }

            function baseEachRight(collection, iteratee) {
                var length = collection ? collection.length : 0;
                if (!isLength(length)) return baseForOwnRight(collection, iteratee);
                for (var iterable = toObject(collection); length-- && iteratee(iterable[length], length, iterable) !== !1;);
                return collection
            }

            function baseEvery(collection, predicate) {
                var result = !0;
                return baseEach(collection, function(value, index, collection) {
                    return result = !!predicate(value, index, collection)
                }), result
            }

            function baseFill(array, value, start, end) {
                var length = array.length;
                for (start = null == start ? 0 : +start || 0, start < 0 && (start = -start > length ? 0 : length + start), end = "undefined" == typeof end || end > length ? length : +end || 0, end < 0 && (end += length), length = start > end ? 0 : end >>> 0, start >>>= 0; start < length;) array[start++] = value;
                return array
            }

            function baseFilter(collection, predicate) {
                var result = [];
                return baseEach(collection, function(value, index, collection) {
                    predicate(value, index, collection) && result.push(value)
                }), result
            }

            function baseFind(collection, predicate, eachFunc, retKey) {
                var result;
                return eachFunc(collection, function(value, key, collection) {
                    if (predicate(value, key, collection)) return result = retKey ? key : value, !1
                }), result
            }

            function baseFlatten(array, isDeep, isStrict, fromIndex) {
                for (var index = fromIndex - 1, length = array.length, resIndex = -1, result = []; ++index < length;) {
                    var value = array[index];
                    if (isObjectLike(value) && isLength(value.length) && (isArray(value) || isArguments(value))) {
                        isDeep && (value = baseFlatten(value, isDeep, isStrict, 0));
                        var valIndex = -1,
                            valLength = value.length;
                        for (result.length += valLength; ++valIndex < valLength;) result[++resIndex] = value[valIndex]
                    } else isStrict || (result[++resIndex] = value)
                }
                return result
            }

            function baseFor(object, iteratee, keysFunc) {
                for (var index = -1, iterable = toObject(object), props = keysFunc(object), length = props.length; ++index < length;) {
                    var key = props[index];
                    if (iteratee(iterable[key], key, iterable) === !1) break
                }
                return object
            }

            function baseForRight(object, iteratee, keysFunc) {
                for (var iterable = toObject(object), props = keysFunc(object), length = props.length; length--;) {
                    var key = props[length];
                    if (iteratee(iterable[key], key, iterable) === !1) break
                }
                return object
            }

            function baseForIn(object, iteratee) {
                return baseFor(object, iteratee, keysIn)
            }

            function baseForOwn(object, iteratee) {
                return baseFor(object, iteratee, keys)
            }

            function baseForOwnRight(object, iteratee) {
                return baseForRight(object, iteratee, keys)
            }

            function baseFunctions(object, props) {
                for (var index = -1, length = props.length, resIndex = -1, result = []; ++index < length;) {
                    var key = props[index];
                    isFunction(object[key]) && (result[++resIndex] = key)
                }
                return result
            }

            function baseInvoke(collection, methodName, args) {
                var index = -1,
                    isFunc = "function" == typeof methodName,
                    length = collection ? collection.length : 0,
                    result = isLength(length) ? Array(length) : [];
                return baseEach(collection, function(value) {
                    var func = isFunc ? methodName : null != value && value[methodName];
                    result[++index] = func ? func.apply(value, args) : undefined
                }), result
            }

            function baseIsEqual(value, other, customizer, isWhere, stackA, stackB) {
                if (value === other) return 0 !== value || 1 / value == 1 / other;
                var valType = typeof value,
                    othType = typeof other;
                return "function" != valType && "object" != valType && "function" != othType && "object" != othType || null == value || null == other ? value !== value && other !== other : baseIsEqualDeep(value, other, baseIsEqual, customizer, isWhere, stackA, stackB)
            }

            function baseIsEqualDeep(object, other, equalFunc, customizer, isWhere, stackA, stackB) {
                var objIsArr = isArray(object),
                    othIsArr = isArray(other),
                    objTag = arrayTag,
                    othTag = arrayTag;
                objIsArr || (objTag = objToString.call(object), objTag == argsTag ? objTag = objectTag : objTag != objectTag && (objIsArr = isTypedArray(object))), othIsArr || (othTag = objToString.call(other), othTag == argsTag ? othTag = objectTag : othTag != objectTag && (othIsArr = isTypedArray(other)));
                var objIsObj = objTag == objectTag,
                    othIsObj = othTag == objectTag,
                    isSameTag = objTag == othTag;
                if (isSameTag && !objIsArr && !objIsObj) return equalByTag(object, other, objTag);
                var valWrapped = objIsObj && hasOwnProperty.call(object, "__wrapped__"),
                    othWrapped = othIsObj && hasOwnProperty.call(other, "__wrapped__");
                if (valWrapped || othWrapped) return equalFunc(valWrapped ? object.value() : object, othWrapped ? other.value() : other, customizer, isWhere, stackA, stackB);
                if (!isSameTag) return !1;
                stackA || (stackA = []), stackB || (stackB = []);
                for (var length = stackA.length; length--;)
                    if (stackA[length] == object) return stackB[length] == other;
                stackA.push(object), stackB.push(other);
                var result = (objIsArr ? equalArrays : equalObjects)(object, other, equalFunc, customizer, isWhere, stackA, stackB);
                return stackA.pop(), stackB.pop(), result
            }

            function baseIsMatch(object, props, values, strictCompareFlags, customizer) {
                var length = props.length;
                if (null == object) return !length;
                for (var index = -1, noCustomizer = !customizer; ++index < length;)
                    if (noCustomizer && strictCompareFlags[index] ? values[index] !== object[props[index]] : !hasOwnProperty.call(object, props[index])) return !1;
                for (index = -1; ++index < length;) {
                    var key = props[index];
                    if (noCustomizer && strictCompareFlags[index]) var result = hasOwnProperty.call(object, key);
                    else {
                        var objValue = object[key],
                            srcValue = values[index];
                        result = customizer ? customizer(objValue, srcValue, key) : undefined, "undefined" == typeof result && (result = baseIsEqual(srcValue, objValue, customizer, !0))
                    }
                    if (!result) return !1
                }
                return !0
            }

            function baseMap(collection, iteratee) {
                var result = [];
                return baseEach(collection, function(value, key, collection) {
                    result.push(iteratee(value, key, collection))
                }), result
            }

            function baseMatches(source) {
                var props = keys(source),
                    length = props.length;
                if (1 == length) {
                    var key = props[0],
                        value = source[key];
                    if (isStrictComparable(value)) return function(object) {
                        return null != object && object[key] === value && hasOwnProperty.call(object, key)
                    }
                }
                for (var values = Array(length), strictCompareFlags = Array(length); length--;) value = source[props[length]], values[length] = value, strictCompareFlags[length] = isStrictComparable(value);
                return function(object) {
                    return baseIsMatch(object, props, values, strictCompareFlags)
                }
            }

            function baseMatchesProperty(key, value) {
                return isStrictComparable(value) ? function(object) {
                    return null != object && object[key] === value
                } : function(object) {
                    return null != object && baseIsEqual(value, object[key], null, !0)
                }
            }

            function baseMerge(object, source, customizer, stackA, stackB) {
                if (!isObject(object)) return object;
                var isSrcArr = isLength(source.length) && (isArray(source) || isTypedArray(source));
                return (isSrcArr ? arrayEach : baseForOwn)(source, function(srcValue, key, source) {
                    if (isObjectLike(srcValue)) return stackA || (stackA = []), stackB || (stackB = []), baseMergeDeep(object, source, key, baseMerge, customizer, stackA, stackB);
                    var value = object[key],
                        result = customizer ? customizer(value, srcValue, key, object, source) : undefined,
                        isCommon = "undefined" == typeof result;
                    isCommon && (result = srcValue), !isSrcArr && "undefined" == typeof result || !isCommon && (result === result ? result === value : value !== value) || (object[key] = result)
                }), object
            }

            function baseMergeDeep(object, source, key, mergeFunc, customizer, stackA, stackB) {
                for (var length = stackA.length, srcValue = source[key]; length--;)
                    if (stackA[length] == srcValue) return void(object[key] = stackB[length]);
                var value = object[key],
                    result = customizer ? customizer(value, srcValue, key, object, source) : undefined,
                    isCommon = "undefined" == typeof result;
                isCommon && (result = srcValue, isLength(srcValue.length) && (isArray(srcValue) || isTypedArray(srcValue)) ? result = isArray(value) ? value : value ? arrayCopy(value) : [] : isPlainObject(srcValue) || isArguments(srcValue) ? result = isArguments(value) ? toPlainObject(value) : isPlainObject(value) ? value : {} : isCommon = !1), stackA.push(srcValue), stackB.push(result), isCommon ? object[key] = mergeFunc(result, srcValue, customizer, stackA, stackB) : (result === result ? result !== value : value === value) && (object[key] = result)
            }

            function baseProperty(key) {
                return function(object) {
                    return null == object ? undefined : object[key]
                }
            }

            function basePullAt(array, indexes) {
                var length = indexes.length,
                    result = baseAt(array, indexes);
                for (indexes.sort(baseCompareAscending); length--;) {
                    var index = parseFloat(indexes[length]);
                    if (index != previous && isIndex(index)) {
                        var previous = index;
                        splice.call(array, index, 1)
                    }
                }
                return result
            }

            function baseRandom(min, max) {
                return min + floor(nativeRandom() * (max - min + 1))
            }

            function baseReduce(collection, iteratee, accumulator, initFromCollection, eachFunc) {
                return eachFunc(collection, function(value, index, collection) {
                    accumulator = initFromCollection ? (initFromCollection = !1, value) : iteratee(accumulator, value, index, collection)
                }), accumulator
            }

            function baseSlice(array, start, end) {
                var index = -1,
                    length = array.length;
                start = null == start ? 0 : +start || 0, start < 0 && (start = -start > length ? 0 : length + start), end = "undefined" == typeof end || end > length ? length : +end || 0, end < 0 && (end += length), length = start > end ? 0 : end - start >>> 0, start >>>= 0;
                for (var result = Array(length); ++index < length;) result[index] = array[index + start];
                return result
            }

            function baseSome(collection, predicate) {
                var result;
                return baseEach(collection, function(value, index, collection) {
                    return result = predicate(value, index, collection), !result
                }), !!result
            }

            function baseSortBy(array, comparer) {
                var length = array.length;
                for (array.sort(comparer); length--;) array[length] = array[length].value;
                return array
            }

            function baseSortByOrder(collection, props, orders) {
                var index = -1,
                    length = collection.length,
                    result = isLength(length) ? Array(length) : [];
                return baseEach(collection, function(value) {
                    for (var length = props.length, criteria = Array(length); length--;) criteria[length] = null == value ? undefined : value[props[length]];
                    result[++index] = {
                        criteria: criteria,
                        index: index,
                        value: value
                    }
                }), baseSortBy(result, function(object, other) {
                    return compareMultiple(object, other, orders)
                })
            }

            function baseUniq(array, iteratee) {
                var index = -1,
                    indexOf = getIndexOf(),
                    length = array.length,
                    isCommon = indexOf == baseIndexOf,
                    isLarge = isCommon && length >= 200,
                    seen = isLarge ? createCache() : null,
                    result = [];
                seen ? (indexOf = cacheIndexOf, isCommon = !1) : (isLarge = !1, seen = iteratee ? [] : result);
                outer: for (; ++index < length;) {
                    var value = array[index],
                        computed = iteratee ? iteratee(value, index, array) : value;
                    if (isCommon && value === value) {
                        for (var seenIndex = seen.length; seenIndex--;)
                            if (seen[seenIndex] === computed) continue outer;
                        iteratee && seen.push(computed), result.push(value)
                    } else indexOf(seen, computed, 0) < 0 && ((iteratee || isLarge) && seen.push(computed), result.push(value))
                }
                return result
            }

            function baseValues(object, props) {
                for (var index = -1, length = props.length, result = Array(length); ++index < length;) result[index] = object[props[index]];
                return result
            }

            function baseWrapperValue(value, actions) {
                var result = value;
                result instanceof LazyWrapper && (result = result.value());
                for (var index = -1, length = actions.length; ++index < length;) {
                    var args = [result],
                        action = actions[index];
                    push.apply(args, action.args), result = action.func.apply(action.thisArg, args)
                }
                return result
            }

            function binaryIndex(array, value, retHighest) {
                var low = 0,
                    high = array ? array.length : low;
                if ("number" == typeof value && value === value && high <= HALF_MAX_ARRAY_LENGTH) {
                    for (; low < high;) {
                        var mid = low + high >>> 1,
                            computed = array[mid];
                        (retHighest ? computed <= value : computed < value) ? low = mid + 1: high = mid
                    }
                    return high
                }
                return binaryIndexBy(array, value, identity, retHighest)
            }

            function binaryIndexBy(array, value, iteratee, retHighest) {
                value = iteratee(value);
                for (var low = 0, high = array ? array.length : 0, valIsNaN = value !== value, valIsUndef = "undefined" == typeof value; low < high;) {
                    var mid = floor((low + high) / 2),
                        computed = iteratee(array[mid]),
                        isReflexive = computed === computed;
                    if (valIsNaN) var setLow = isReflexive || retHighest;
                    else setLow = valIsUndef ? isReflexive && (retHighest || "undefined" != typeof computed) : retHighest ? computed <= value : computed < value;
                    setLow ? low = mid + 1 : high = mid
                }
                return nativeMin(high, MAX_ARRAY_INDEX)
            }

            function bindCallback(func, thisArg, argCount) {
                if ("function" != typeof func) return identity;
                if ("undefined" == typeof thisArg) return func;
                switch (argCount) {
                    case 1:
                        return function(value) {
                            return func.call(thisArg, value)
                        };
                    case 3:
                        return function(value, index, collection) {
                            return func.call(thisArg, value, index, collection)
                        };
                    case 4:
                        return function(accumulator, value, index, collection) {
                            return func.call(thisArg, accumulator, value, index, collection)
                        };
                    case 5:
                        return function(value, other, key, object, source) {
                            return func.call(thisArg, value, other, key, object, source)
                        }
                }
                return function() {
                    return func.apply(thisArg, arguments)
                }
            }

            function bufferClone(buffer) {
                return bufferSlice.call(buffer, 0)
            }

            function composeArgs(args, partials, holders) {
                for (var holdersLength = holders.length, argsIndex = -1, argsLength = nativeMax(args.length - holdersLength, 0), leftIndex = -1, leftLength = partials.length, result = Array(argsLength + leftLength); ++leftIndex < leftLength;) result[leftIndex] = partials[leftIndex];
                for (; ++argsIndex < holdersLength;) result[holders[argsIndex]] = args[argsIndex];
                for (; argsLength--;) result[leftIndex++] = args[argsIndex++];
                return result
            }

            function composeArgsRight(args, partials, holders) {
                for (var holdersIndex = -1, holdersLength = holders.length, argsIndex = -1, argsLength = nativeMax(args.length - holdersLength, 0), rightIndex = -1, rightLength = partials.length, result = Array(argsLength + rightLength); ++argsIndex < argsLength;) result[argsIndex] = args[argsIndex];
                for (var pad = argsIndex; ++rightIndex < rightLength;) result[pad + rightIndex] = partials[rightIndex];
                for (; ++holdersIndex < holdersLength;) result[pad + holders[holdersIndex]] = args[argsIndex++];
                return result
            }

            function createAggregator(setter, initializer) {
                return function(collection, iteratee, thisArg) {
                    var result = initializer ? initializer() : {};
                    if (iteratee = getCallback(iteratee, thisArg, 3), isArray(collection))
                        for (var index = -1, length = collection.length; ++index < length;) {
                            var value = collection[index];
                            setter(result, value, iteratee(value, index, collection), collection)
                        } else baseEach(collection, function(value, key, collection) {
                            setter(result, value, iteratee(value, key, collection), collection)
                        });
                    return result
                }
            }

            function createAssigner(assigner) {
                return function() {
                    var args = arguments,
                        length = args.length,
                        object = args[0];
                    if (length < 2 || null == object) return object;
                    var customizer = args[length - 2],
                        thisArg = args[length - 1],
                        guard = args[3];
                    length > 3 && "function" == typeof customizer ? (customizer = bindCallback(customizer, thisArg, 5), length -= 2) : (customizer = length > 2 && "function" == typeof thisArg ? thisArg : null, length -= customizer ? 1 : 0), guard && isIterateeCall(args[1], args[2], guard) && (customizer = 3 == length ? null : customizer, length = 2);
                    for (var index = 0; ++index < length;) {
                        var source = args[index];
                        source && assigner(object, source, customizer)
                    }
                    return object
                }
            }

            function createBindWrapper(func, thisArg) {
                function wrapper() {
                    var fn = this && this !== root && this instanceof wrapper ? Ctor : func;
                    return fn.apply(thisArg, arguments)
                }
                var Ctor = createCtorWrapper(func);
                return wrapper
            }

            function createComposer(fromRight) {
                return function() {
                    var length = arguments.length,
                        index = length,
                        fromIndex = fromRight ? length - 1 : 0;
                    if (!length) return function() {
                        return arguments[0]
                    };
                    for (var funcs = Array(length); index--;)
                        if (funcs[index] = arguments[index], "function" != typeof funcs[index]) throw new TypeError(FUNC_ERROR_TEXT);
                    return function() {
                        for (var index = fromIndex, result = funcs[index].apply(this, arguments); fromRight ? index-- : ++index < length;) result = funcs[index].call(this, result);
                        return result
                    }
                }
            }

            function createCompounder(callback) {
                return function(string) {
                    for (var index = -1, array = words(deburr(string)), length = array.length, result = ""; ++index < length;) result = callback(result, array[index], index);
                    return result
                }
            }

            function createCtorWrapper(Ctor) {
                return function() {
                    var thisBinding = baseCreate(Ctor.prototype),
                        result = Ctor.apply(thisBinding, arguments);
                    return isObject(result) ? result : thisBinding
                }
            }

            function createExtremum(arrayFunc, isMin) {
                return function(collection, iteratee, thisArg) {
                    thisArg && isIterateeCall(collection, iteratee, thisArg) && (iteratee = null);
                    var func = getCallback(),
                        noIteratee = null == iteratee;
                    if (func === baseCallback && noIteratee || (noIteratee = !1, iteratee = func(iteratee, thisArg, 3)), noIteratee) {
                        var isArr = isArray(collection);
                        if (isArr || !isString(collection)) return arrayFunc(isArr ? collection : toIterable(collection));
                        iteratee = charAtCallback
                    }
                    return extremumBy(collection, iteratee, isMin)
                }
            }

            function createHybridWrapper(func, bitmask, thisArg, partials, holders, partialsRight, holdersRight, argPos, ary, arity) {
                function wrapper() {
                    for (var length = arguments.length, index = length, args = Array(length); index--;) args[index] = arguments[index];
                    if (partials && (args = composeArgs(args, partials, holders)), partialsRight && (args = composeArgsRight(args, partialsRight, holdersRight)), isCurry || isCurryRight) {
                        var placeholder = wrapper.placeholder,
                            argsHolders = replaceHolders(args, placeholder);
                        if (length -= argsHolders.length, length < arity) {
                            var newArgPos = argPos ? arrayCopy(argPos) : null,
                                newArity = nativeMax(arity - length, 0),
                                newsHolders = isCurry ? argsHolders : null,
                                newHoldersRight = isCurry ? null : argsHolders,
                                newPartials = isCurry ? args : null,
                                newPartialsRight = isCurry ? null : args;
                            bitmask |= isCurry ? PARTIAL_FLAG : PARTIAL_RIGHT_FLAG, bitmask &= ~(isCurry ? PARTIAL_RIGHT_FLAG : PARTIAL_FLAG), isCurryBound || (bitmask &= ~(BIND_FLAG | BIND_KEY_FLAG));
                            var result = createHybridWrapper(func, bitmask, thisArg, newPartials, newsHolders, newPartialsRight, newHoldersRight, newArgPos, ary, newArity);
                            return result.placeholder = placeholder, result
                        }
                    }
                    var thisBinding = isBind ? thisArg : this;
                    isBindKey && (func = thisBinding[key]), argPos && (args = reorder(args, argPos)), isAry && ary < args.length && (args.length = ary);
                    var fn = this && this !== root && this instanceof wrapper ? Ctor || createCtorWrapper(func) : func;
                    return fn.apply(thisBinding, args)
                }
                var isAry = bitmask & ARY_FLAG,
                    isBind = bitmask & BIND_FLAG,
                    isBindKey = bitmask & BIND_KEY_FLAG,
                    isCurry = bitmask & CURRY_FLAG,
                    isCurryBound = bitmask & CURRY_BOUND_FLAG,
                    isCurryRight = bitmask & CURRY_RIGHT_FLAG,
                    Ctor = !isBindKey && createCtorWrapper(func),
                    key = func;
                return wrapper
            }

            function createPad(string, length, chars) {
                var strLength = string.length;
                if (length = +length, strLength >= length || !nativeIsFinite(length)) return "";
                var padLength = length - strLength;
                return chars = null == chars ? " " : chars + "", repeat(chars, ceil(padLength / chars.length)).slice(0, padLength)
            }

            function createPartialWrapper(func, bitmask, thisArg, partials) {
                function wrapper() {
                    for (var argsIndex = -1, argsLength = arguments.length, leftIndex = -1, leftLength = partials.length, args = Array(argsLength + leftLength); ++leftIndex < leftLength;) args[leftIndex] = partials[leftIndex];
                    for (; argsLength--;) args[leftIndex++] = arguments[++argsIndex];
                    var fn = this && this !== root && this instanceof wrapper ? Ctor : func;
                    return fn.apply(isBind ? thisArg : this, args)
                }
                var isBind = bitmask & BIND_FLAG,
                    Ctor = createCtorWrapper(func);
                return wrapper
            }

            function createWrapper(func, bitmask, thisArg, partials, holders, argPos, ary, arity) {
                var isBindKey = bitmask & BIND_KEY_FLAG;
                if (!isBindKey && "function" != typeof func) throw new TypeError(FUNC_ERROR_TEXT);
                var length = partials ? partials.length : 0;
                if (length || (bitmask &= ~(PARTIAL_FLAG | PARTIAL_RIGHT_FLAG), partials = holders = null), length -= holders ? holders.length : 0, bitmask & PARTIAL_RIGHT_FLAG) {
                    var partialsRight = partials,
                        holdersRight = holders;
                    partials = holders = null
                }
                var data = !isBindKey && getData(func),
                    newData = [func, bitmask, thisArg, partials, holders, partialsRight, holdersRight, argPos, ary, arity];
                if (data && data !== !0 && (mergeData(newData, data), bitmask = newData[1], arity = newData[9]), newData[9] = null == arity ? isBindKey ? 0 : func.length : nativeMax(arity - length, 0) || 0, bitmask == BIND_FLAG) var result = createBindWrapper(newData[0], newData[2]);
                else result = bitmask != PARTIAL_FLAG && bitmask != (BIND_FLAG | PARTIAL_FLAG) || newData[4].length ? createHybridWrapper.apply(undefined, newData) : createPartialWrapper.apply(undefined, newData);
                var setter = data ? baseSetData : setData;
                return setter(result, newData)
            }

            function equalArrays(array, other, equalFunc, customizer, isWhere, stackA, stackB) {
                var index = -1,
                    arrLength = array.length,
                    othLength = other.length,
                    result = !0;
                if (arrLength != othLength && !(isWhere && othLength > arrLength)) return !1;
                for (; result && ++index < arrLength;) {
                    var arrValue = array[index],
                        othValue = other[index];
                    if (result = undefined, customizer && (result = isWhere ? customizer(othValue, arrValue, index) : customizer(arrValue, othValue, index)), "undefined" == typeof result)
                        if (isWhere)
                            for (var othIndex = othLength; othIndex-- && (othValue = other[othIndex], !(result = arrValue && arrValue === othValue || equalFunc(arrValue, othValue, customizer, isWhere, stackA, stackB))););
                        else result = arrValue && arrValue === othValue || equalFunc(arrValue, othValue, customizer, isWhere, stackA, stackB)
                }
                return !!result
            }

            function equalByTag(object, other, tag) {
                switch (tag) {
                    case boolTag:
                    case dateTag:
                        return +object == +other;
                    case errorTag:
                        return object.name == other.name && object.message == other.message;
                    case numberTag:
                        return object != +object ? other != +other : 0 == object ? 1 / object == 1 / other : object == +other;
                    case regexpTag:
                    case stringTag:
                        return object == other + ""
                }
                return !1
            }

            function equalObjects(object, other, equalFunc, customizer, isWhere, stackA, stackB) {
                var objProps = keys(object),
                    objLength = objProps.length,
                    othProps = keys(other),
                    othLength = othProps.length;
                if (objLength != othLength && !isWhere) return !1;
                for (var hasCtor, index = -1; ++index < objLength;) {
                    var key = objProps[index],
                        result = hasOwnProperty.call(other, key);
                    if (result) {
                        var objValue = object[key],
                            othValue = other[key];
                        result = undefined, customizer && (result = isWhere ? customizer(othValue, objValue, key) : customizer(objValue, othValue, key)), "undefined" == typeof result && (result = objValue && objValue === othValue || equalFunc(objValue, othValue, customizer, isWhere, stackA, stackB))
                    }
                    if (!result) return !1;
                    hasCtor || (hasCtor = "constructor" == key)
                }
                if (!hasCtor) {
                    var objCtor = object.constructor,
                        othCtor = other.constructor;
                    if (objCtor != othCtor && "constructor" in object && "constructor" in other && !("function" == typeof objCtor && objCtor instanceof objCtor && "function" == typeof othCtor && othCtor instanceof othCtor)) return !1
                }
                return !0
            }

            function extremumBy(collection, iteratee, isMin) {
                var exValue = isMin ? POSITIVE_INFINITY : NEGATIVE_INFINITY,
                    computed = exValue,
                    result = computed;
                return baseEach(collection, function(value, index, collection) {
                    var current = iteratee(value, index, collection);
                    ((isMin ? current < computed : current > computed) || current === exValue && current === result) && (computed = current, result = value)
                }), result
            }

            function getCallback(func, thisArg, argCount) {
                var result = lodash.callback || callback;
                return result = result === callback ? baseCallback : result, argCount ? result(func, thisArg, argCount) : result
            }

            function getIndexOf(collection, target, fromIndex) {
                var result = lodash.indexOf || indexOf;
                return result = result === indexOf ? baseIndexOf : result, collection ? result(collection, target, fromIndex) : result
            }

            function getView(start, end, transforms) {
                for (var index = -1, length = transforms ? transforms.length : 0; ++index < length;) {
                    var data = transforms[index],
                        size = data.size;
                    switch (data.type) {
                        case "drop":
                            start += size;
                            break;
                        case "dropRight":
                            end -= size;
                            break;
                        case "take":
                            end = nativeMin(end, start + size);
                            break;
                        case "takeRight":
                            start = nativeMax(start, end - size)
                    }
                }
                return {
                    start: start,
                    end: end
                }
            }

            function initCloneArray(array) {
                var length = array.length,
                    result = new array.constructor(length);
                return length && "string" == typeof array[0] && hasOwnProperty.call(array, "index") && (result.index = array.index, result.input = array.input), result
            }

            function initCloneObject(object) {
                var Ctor = object.constructor;
                return "function" == typeof Ctor && Ctor instanceof Ctor || (Ctor = Object), new Ctor
            }

            function initCloneByTag(object, tag, isDeep) {
                var Ctor = object.constructor;
                switch (tag) {
                    case arrayBufferTag:
                        return bufferClone(object);
                    case boolTag:
                    case dateTag:
                        return new Ctor((+object));
                    case float32Tag:
                    case float64Tag:
                    case int8Tag:
                    case int16Tag:
                    case int32Tag:
                    case uint8Tag:
                    case uint8ClampedTag:
                    case uint16Tag:
                    case uint32Tag:
                        var buffer = object.buffer;
                        return new Ctor(isDeep ? bufferClone(buffer) : buffer, object.byteOffset, object.length);
                    case numberTag:
                    case stringTag:
                        return new Ctor(object);
                    case regexpTag:
                        var result = new Ctor(object.source, reFlags.exec(object));
                        result.lastIndex = object.lastIndex
                }
                return result
            }

            function isBindable(func) {
                var support = lodash.support,
                    result = !(support.funcNames ? func.name : support.funcDecomp);
                if (!result) {
                    var source = fnToString.call(func);
                    support.funcNames || (result = !reFuncName.test(source)), result || (result = reThis.test(source) || isNative(func), baseSetData(func, result))
                }
                return result
            }

            function isIndex(value, length) {
                return value = +value, length = null == length ? MAX_SAFE_INTEGER : length, value > -1 && value % 1 == 0 && value < length
            }

            function isIterateeCall(value, index, object) {
                if (!isObject(object)) return !1;
                var type = typeof index;
                if ("number" == type) var length = object.length,
                    prereq = isLength(length) && isIndex(index, length);
                else prereq = "string" == type && index in object;
                if (prereq) {
                    var other = object[index];
                    return value === value ? value === other : other !== other
                }
                return !1
            }

            function isLength(value) {
                return "number" == typeof value && value > -1 && value % 1 == 0 && value <= MAX_SAFE_INTEGER
            }

            function isStrictComparable(value) {
                return value === value && (0 === value ? 1 / value > 0 : !isObject(value))
            }

            function mergeData(data, source) {
                var bitmask = data[1],
                    srcBitmask = source[1],
                    newBitmask = bitmask | srcBitmask,
                    arityFlags = ARY_FLAG | REARG_FLAG,
                    bindFlags = BIND_FLAG | BIND_KEY_FLAG,
                    comboFlags = arityFlags | bindFlags | CURRY_BOUND_FLAG | CURRY_RIGHT_FLAG,
                    isAry = bitmask & ARY_FLAG && !(srcBitmask & ARY_FLAG),
                    isRearg = bitmask & REARG_FLAG && !(srcBitmask & REARG_FLAG),
                    argPos = (isRearg ? data : source)[7],
                    ary = (isAry ? data : source)[8],
                    isCommon = !(bitmask >= REARG_FLAG && srcBitmask > bindFlags || bitmask > bindFlags && srcBitmask >= REARG_FLAG),
                    isCombo = newBitmask >= arityFlags && newBitmask <= comboFlags && (bitmask < REARG_FLAG || (isRearg || isAry) && argPos.length <= ary);
                if (!isCommon && !isCombo) return data;
                srcBitmask & BIND_FLAG && (data[2] = source[2], newBitmask |= bitmask & BIND_FLAG ? 0 : CURRY_BOUND_FLAG);
                var value = source[3];
                if (value) {
                    var partials = data[3];
                    data[3] = partials ? composeArgs(partials, value, source[4]) : arrayCopy(value), data[4] = partials ? replaceHolders(data[3], PLACEHOLDER) : arrayCopy(source[4])
                }
                return value = source[5], value && (partials = data[5], data[5] = partials ? composeArgsRight(partials, value, source[6]) : arrayCopy(value), data[6] = partials ? replaceHolders(data[5], PLACEHOLDER) : arrayCopy(source[6])), value = source[7], value && (data[7] = arrayCopy(value)), srcBitmask & ARY_FLAG && (data[8] = null == data[8] ? source[8] : nativeMin(data[8], source[8])), null == data[9] && (data[9] = source[9]), data[0] = source[0], data[1] = newBitmask, data
            }

            function pickByArray(object, props) {
                object = toObject(object);
                for (var index = -1, length = props.length, result = {}; ++index < length;) {
                    var key = props[index];
                    key in object && (result[key] = object[key])
                }
                return result
            }

            function pickByCallback(object, predicate) {
                var result = {};
                return baseForIn(object, function(value, key, object) {
                    predicate(value, key, object) && (result[key] = value)
                }), result
            }

            function reorder(array, indexes) {
                for (var arrLength = array.length, length = nativeMin(indexes.length, arrLength), oldArray = arrayCopy(array); length--;) {
                    var index = indexes[length];
                    array[length] = isIndex(index, arrLength) ? oldArray[index] : undefined
                }
                return array
            }

            function shimIsPlainObject(value) {
                var Ctor;
                lodash.support;
                if (!isObjectLike(value) || objToString.call(value) != objectTag || !hasOwnProperty.call(value, "constructor") && (Ctor = value.constructor, "function" == typeof Ctor && !(Ctor instanceof Ctor))) return !1;
                var result;
                return baseForIn(value, function(subValue, key) {
                    result = key
                }), "undefined" == typeof result || hasOwnProperty.call(value, result)
            }

            function shimKeys(object) {
                for (var props = keysIn(object), propsLength = props.length, length = propsLength && object.length, support = lodash.support, allowIndexes = length && isLength(length) && (isArray(object) || support.nonEnumArgs && isArguments(object)), index = -1, result = []; ++index < propsLength;) {
                    var key = props[index];
                    (allowIndexes && isIndex(key, length) || hasOwnProperty.call(object, key)) && result.push(key)
                }
                return result
            }

            function toIterable(value) {
                return null == value ? [] : isLength(value.length) ? isObject(value) ? value : Object(value) : values(value)
            }

            function toObject(value) {
                return isObject(value) ? value : Object(value)
            }

            function wrapperClone(wrapper) {
                return wrapper instanceof LazyWrapper ? wrapper.clone() : new LodashWrapper(wrapper.__wrapped__, wrapper.__chain__, arrayCopy(wrapper.__actions__))
            }

            function chunk(array, size, guard) {
                size = (guard ? isIterateeCall(array, size, guard) : null == size) ? 1 : nativeMax(+size || 1, 1);
                for (var index = 0, length = array ? array.length : 0, resIndex = -1, result = Array(ceil(length / size)); index < length;) result[++resIndex] = baseSlice(array, index, index += size);
                return result
            }

            function compact(array) {
                for (var index = -1, length = array ? array.length : 0, resIndex = -1, result = []; ++index < length;) {
                    var value = array[index];
                    value && (result[++resIndex] = value)
                }
                return result
            }

            function difference() {
                for (var args = arguments, index = -1, length = args.length; ++index < length;) {
                    var value = args[index];
                    if (isArray(value) || isArguments(value)) break
                }
                return baseDifference(value, baseFlatten(args, !1, !0, ++index))
            }

            function drop(array, n, guard) {
                var length = array ? array.length : 0;
                return length ? ((guard ? isIterateeCall(array, n, guard) : null == n) && (n = 1), baseSlice(array, n < 0 ? 0 : n)) : []
            }

            function dropRight(array, n, guard) {
                var length = array ? array.length : 0;
                return length ? ((guard ? isIterateeCall(array, n, guard) : null == n) && (n = 1), n = length - (+n || 0), baseSlice(array, 0, n < 0 ? 0 : n)) : []
            }

            function dropRightWhile(array, predicate, thisArg) {
                var length = array ? array.length : 0;
                if (!length) return [];
                for (predicate = getCallback(predicate, thisArg, 3); length-- && predicate(array[length], length, array););
                return baseSlice(array, 0, length + 1)
            }

            function dropWhile(array, predicate, thisArg) {
                var length = array ? array.length : 0;
                if (!length) return [];
                var index = -1;
                for (predicate = getCallback(predicate, thisArg, 3); ++index < length && predicate(array[index], index, array););
                return baseSlice(array, index)
            }

            function fill(array, value, start, end) {
                var length = array ? array.length : 0;
                return length ? (start && "number" != typeof start && isIterateeCall(array, value, start) && (start = 0, end = length), baseFill(array, value, start, end)) : []
            }

            function findIndex(array, predicate, thisArg) {
                var index = -1,
                    length = array ? array.length : 0;
                for (predicate = getCallback(predicate, thisArg, 3); ++index < length;)
                    if (predicate(array[index], index, array)) return index;
                return -1
            }

            function findLastIndex(array, predicate, thisArg) {
                var length = array ? array.length : 0;
                for (predicate = getCallback(predicate, thisArg, 3); length--;)
                    if (predicate(array[length], length, array)) return length;
                return -1
            }

            function first(array) {
                return array ? array[0] : undefined
            }

            function flatten(array, isDeep, guard) {
                var length = array ? array.length : 0;
                return guard && isIterateeCall(array, isDeep, guard) && (isDeep = !1), length ? baseFlatten(array, isDeep, !1, 0) : []
            }

            function flattenDeep(array) {
                var length = array ? array.length : 0;
                return length ? baseFlatten(array, !0, !1, 0) : []
            }

            function indexOf(array, value, fromIndex) {
                var length = array ? array.length : 0;
                if (!length) return -1;
                if ("number" == typeof fromIndex) fromIndex = fromIndex < 0 ? nativeMax(length + fromIndex, 0) : fromIndex;
                else if (fromIndex) {
                    var index = binaryIndex(array, value),
                        other = array[index];
                    return (value === value ? value === other : other !== other) ? index : -1
                }
                return baseIndexOf(array, value, fromIndex || 0)
            }

            function initial(array) {
                return dropRight(array, 1)
            }

            function intersection() {
                for (var args = [], argsIndex = -1, argsLength = arguments.length, caches = [], indexOf = getIndexOf(), isCommon = indexOf == baseIndexOf; ++argsIndex < argsLength;) {
                    var value = arguments[argsIndex];
                    (isArray(value) || isArguments(value)) && (args.push(value), caches.push(isCommon && value.length >= 120 ? createCache(argsIndex && value) : null))
                }
                argsLength = args.length;
                var array = args[0],
                    index = -1,
                    length = array ? array.length : 0,
                    result = [],
                    seen = caches[0];
                outer: for (; ++index < length;)
                    if (value = array[index], (seen ? cacheIndexOf(seen, value) : indexOf(result, value, 0)) < 0) {
                        for (argsIndex = argsLength; --argsIndex;) {
                            var cache = caches[argsIndex];
                            if ((cache ? cacheIndexOf(cache, value) : indexOf(args[argsIndex], value, 0)) < 0) continue outer
                        }
                        seen && seen.push(value), result.push(value)
                    }
                return result
            }

            function last(array) {
                var length = array ? array.length : 0;
                return length ? array[length - 1] : undefined
            }

            function lastIndexOf(array, value, fromIndex) {
                var length = array ? array.length : 0;
                if (!length) return -1;
                var index = length;
                if ("number" == typeof fromIndex) index = (fromIndex < 0 ? nativeMax(length + fromIndex, 0) : nativeMin(fromIndex || 0, length - 1)) + 1;
                else if (fromIndex) {
                    index = binaryIndex(array, value, !0) - 1;
                    var other = array[index];
                    return (value === value ? value === other : other !== other) ? index : -1
                }
                if (value !== value) return indexOfNaN(array, index, !0);
                for (; index--;)
                    if (array[index] === value) return index;
                return -1
            }

            function pull() {
                var args = arguments,
                    array = args[0];
                if (!array || !array.length) return array;
                for (var index = 0, indexOf = getIndexOf(), length = args.length; ++index < length;)
                    for (var fromIndex = 0, value = args[index];
                        (fromIndex = indexOf(array, value, fromIndex)) > -1;) splice.call(array, fromIndex, 1);
                return array
            }

            function pullAt(array) {
                return basePullAt(array || [], baseFlatten(arguments, !1, !1, 1))
            }

            function remove(array, predicate, thisArg) {
                var index = -1,
                    length = array ? array.length : 0,
                    result = [];
                for (predicate = getCallback(predicate, thisArg, 3); ++index < length;) {
                    var value = array[index];
                    predicate(value, index, array) && (result.push(value), splice.call(array, index--, 1), length--)
                }
                return result
            }

            function rest(array) {
                return drop(array, 1)
            }

            function slice(array, start, end) {
                var length = array ? array.length : 0;
                return length ? (end && "number" != typeof end && isIterateeCall(array, start, end) && (start = 0, end = length), baseSlice(array, start, end)) : []
            }

            function sortedIndex(array, value, iteratee, thisArg) {
                var func = getCallback(iteratee);
                return func === baseCallback && null == iteratee ? binaryIndex(array, value) : binaryIndexBy(array, value, func(iteratee, thisArg, 1))
            }

            function sortedLastIndex(array, value, iteratee, thisArg) {
                var func = getCallback(iteratee);
                return func === baseCallback && null == iteratee ? binaryIndex(array, value, !0) : binaryIndexBy(array, value, func(iteratee, thisArg, 1), !0)
            }

            function take(array, n, guard) {
                var length = array ? array.length : 0;
                return length ? ((guard ? isIterateeCall(array, n, guard) : null == n) && (n = 1), baseSlice(array, 0, n < 0 ? 0 : n)) : []
            }

            function takeRight(array, n, guard) {
                var length = array ? array.length : 0;
                return length ? ((guard ? isIterateeCall(array, n, guard) : null == n) && (n = 1), n = length - (+n || 0), baseSlice(array, n < 0 ? 0 : n)) : []
            }

            function takeRightWhile(array, predicate, thisArg) {
                var length = array ? array.length : 0;
                if (!length) return [];
                for (predicate = getCallback(predicate, thisArg, 3); length-- && predicate(array[length], length, array););
                return baseSlice(array, length + 1)
            }

            function takeWhile(array, predicate, thisArg) {
                var length = array ? array.length : 0;
                if (!length) return [];
                var index = -1;
                for (predicate = getCallback(predicate, thisArg, 3); ++index < length && predicate(array[index], index, array););
                return baseSlice(array, 0, index)
            }

            function union() {
                return baseUniq(baseFlatten(arguments, !1, !0, 0))
            }

            function uniq(array, isSorted, iteratee, thisArg) {
                var length = array ? array.length : 0;
                if (!length) return [];
                null != isSorted && "boolean" != typeof isSorted && (thisArg = iteratee, iteratee = isIterateeCall(array, isSorted, thisArg) ? null : isSorted, isSorted = !1);
                var func = getCallback();
                return func === baseCallback && null == iteratee || (iteratee = func(iteratee, thisArg, 3)), isSorted && getIndexOf() == baseIndexOf ? sortedUniq(array, iteratee) : baseUniq(array, iteratee)
            }

            function unzip(array) {
                for (var index = -1, length = (array && array.length && arrayMax(arrayMap(array, getLength))) >>> 0, result = Array(length); ++index < length;) result[index] = arrayMap(array, baseProperty(index));
                return result
            }

            function without(array) {
                return baseDifference(array, baseSlice(arguments, 1))
            }

            function xor() {
                for (var index = -1, length = arguments.length; ++index < length;) {
                    var array = arguments[index];
                    if (isArray(array) || isArguments(array)) var result = result ? baseDifference(result, array).concat(baseDifference(array, result)) : array
                }
                return result ? baseUniq(result) : []
            }

            function zip() {
                for (var length = arguments.length, array = Array(length); length--;) array[length] = arguments[length];
                return unzip(array)
            }

            function zipObject(props, values) {
                var index = -1,
                    length = props ? props.length : 0,
                    result = {};
                for (!length || values || isArray(props[0]) || (values = []); ++index < length;) {
                    var key = props[index];
                    values ? result[key] = values[index] : key && (result[key[0]] = key[1])
                }
                return result
            }

            function chain(value) {
                var result = lodash(value);
                return result.__chain__ = !0, result
            }

            function tap(value, interceptor, thisArg) {
                return interceptor.call(thisArg, value), value
            }

            function thru(value, interceptor, thisArg) {
                return interceptor.call(thisArg, value)
            }

            function wrapperChain() {
                return chain(this)
            }

            function wrapperCommit() {
                return new LodashWrapper(this.value(), this.__chain__)
            }

            function wrapperPlant(value) {
                for (var result, parent = this; parent instanceof baseLodash;) {
                    var clone = wrapperClone(parent);
                    result ? previous.__wrapped__ = clone : result = clone;
                    var previous = clone;
                    parent = parent.__wrapped__
                }
                return previous.__wrapped__ = value, result
            }

            function wrapperReverse() {
                var value = this.__wrapped__;
                return value instanceof LazyWrapper ? (this.__actions__.length && (value = new LazyWrapper(this)), new LodashWrapper(value.reverse(), this.__chain__)) : this.thru(function(value) {
                    return value.reverse()
                })
            }

            function wrapperToString() {
                return this.value() + ""
            }

            function wrapperValue() {
                return baseWrapperValue(this.__wrapped__, this.__actions__)
            }

            function at(collection) {
                var length = collection ? collection.length : 0;
                return isLength(length) && (collection = toIterable(collection)), baseAt(collection, baseFlatten(arguments, !1, !1, 1))
            }

            function every(collection, predicate, thisArg) {
                var func = isArray(collection) ? arrayEvery : baseEvery;
                return "function" == typeof predicate && "undefined" == typeof thisArg || (predicate = getCallback(predicate, thisArg, 3)), func(collection, predicate)
            }

            function filter(collection, predicate, thisArg) {
                var func = isArray(collection) ? arrayFilter : baseFilter;
                return predicate = getCallback(predicate, thisArg, 3), func(collection, predicate)
            }

            function find(collection, predicate, thisArg) {
                if (isArray(collection)) {
                    var index = findIndex(collection, predicate, thisArg);
                    return index > -1 ? collection[index] : undefined
                }
                return predicate = getCallback(predicate, thisArg, 3), baseFind(collection, predicate, baseEach)
            }

            function findLast(collection, predicate, thisArg) {
                return predicate = getCallback(predicate, thisArg, 3), baseFind(collection, predicate, baseEachRight)
            }

            function findWhere(collection, source) {
                return find(collection, baseMatches(source))
            }

            function forEach(collection, iteratee, thisArg) {
                return "function" == typeof iteratee && "undefined" == typeof thisArg && isArray(collection) ? arrayEach(collection, iteratee) : baseEach(collection, bindCallback(iteratee, thisArg, 3))
            }

            function forEachRight(collection, iteratee, thisArg) {
                return "function" == typeof iteratee && "undefined" == typeof thisArg && isArray(collection) ? arrayEachRight(collection, iteratee) : baseEachRight(collection, bindCallback(iteratee, thisArg, 3))
            }

            function includes(collection, target, fromIndex) {
                var length = collection ? collection.length : 0;
                return isLength(length) || (collection = values(collection), length = collection.length), !!length && (fromIndex = "number" == typeof fromIndex ? fromIndex < 0 ? nativeMax(length + fromIndex, 0) : fromIndex || 0 : 0, "string" == typeof collection || !isArray(collection) && isString(collection) ? fromIndex < length && collection.indexOf(target, fromIndex) > -1 : getIndexOf(collection, target, fromIndex) > -1)
            }

            function invoke(collection, methodName) {
                return baseInvoke(collection, methodName, baseSlice(arguments, 2))
            }

            function map(collection, iteratee, thisArg) {
                var func = isArray(collection) ? arrayMap : baseMap;
                return iteratee = getCallback(iteratee, thisArg, 3), func(collection, iteratee)
            }

            function pluck(collection, key) {
                return map(collection, baseProperty(key))
            }

            function reduce(collection, iteratee, accumulator, thisArg) {
                var func = isArray(collection) ? arrayReduce : baseReduce;
                return func(collection, getCallback(iteratee, thisArg, 4), accumulator, arguments.length < 3, baseEach)
            }

            function reduceRight(collection, iteratee, accumulator, thisArg) {
                var func = isArray(collection) ? arrayReduceRight : baseReduce;
                return func(collection, getCallback(iteratee, thisArg, 4), accumulator, arguments.length < 3, baseEachRight)
            }

            function reject(collection, predicate, thisArg) {
                var func = isArray(collection) ? arrayFilter : baseFilter;
                return predicate = getCallback(predicate, thisArg, 3), func(collection, function(value, index, collection) {
                    return !predicate(value, index, collection)
                })
            }

            function sample(collection, n, guard) {
                if (guard ? isIterateeCall(collection, n, guard) : null == n) {
                    collection = toIterable(collection);
                    var length = collection.length;
                    return length > 0 ? collection[baseRandom(0, length - 1)] : undefined
                }
                var result = shuffle(collection);
                return result.length = nativeMin(n < 0 ? 0 : +n || 0, result.length), result
            }

            function shuffle(collection) {
                collection = toIterable(collection);
                for (var index = -1, length = collection.length, result = Array(length); ++index < length;) {
                    var rand = baseRandom(0, index);
                    index != rand && (result[index] = result[rand]), result[rand] = collection[index]
                }
                return result
            }

            function size(collection) {
                var length = collection ? collection.length : 0;
                return isLength(length) ? length : keys(collection).length
            }

            function some(collection, predicate, thisArg) {
                var func = isArray(collection) ? arraySome : baseSome;
                return "function" == typeof predicate && "undefined" == typeof thisArg || (predicate = getCallback(predicate, thisArg, 3)), func(collection, predicate)
            }

            function sortBy(collection, iteratee, thisArg) {
                if (null == collection) return [];
                var index = -1,
                    length = collection.length,
                    result = isLength(length) ? Array(length) : [];
                return thisArg && isIterateeCall(collection, iteratee, thisArg) && (iteratee = null), iteratee = getCallback(iteratee, thisArg, 3), baseEach(collection, function(value, key, collection) {
                    result[++index] = {
                        criteria: iteratee(value, key, collection),
                        index: index,
                        value: value
                    }
                }), baseSortBy(result, compareAscending)
            }

            function sortByAll(collection) {
                if (null == collection) return [];
                var args = arguments,
                    guard = args[3];
                return guard && isIterateeCall(args[1], args[2], guard) && (args = [collection, args[1]]), baseSortByOrder(collection, baseFlatten(args, !1, !1, 1), [])
            }

            function sortByOrder(collection, props, orders, guard) {
                return null == collection ? [] : (guard && isIterateeCall(props, orders, guard) && (orders = null), isArray(props) || (props = null == props ? [] : [props]), isArray(orders) || (orders = null == orders ? [] : [orders]), baseSortByOrder(collection, props, orders))
            }

            function where(collection, source) {
                return filter(collection, baseMatches(source))
            }

            function after(n, func) {
                if ("function" != typeof func) {
                    if ("function" != typeof n) throw new TypeError(FUNC_ERROR_TEXT);
                    var temp = n;
                    n = func, func = temp
                }
                return n = nativeIsFinite(n = +n) ? n : 0,
                    function() {
                        if (--n < 1) return func.apply(this, arguments)
                    }
            }

            function ary(func, n, guard) {
                return guard && isIterateeCall(func, n, guard) && (n = null), n = func && null == n ? func.length : nativeMax(+n || 0, 0), createWrapper(func, ARY_FLAG, null, null, null, null, n)
            }

            function before(n, func) {
                var result;
                if ("function" != typeof func) {
                    if ("function" != typeof n) throw new TypeError(FUNC_ERROR_TEXT);
                    var temp = n;
                    n = func, func = temp
                }
                return function() {
                    return --n > 0 ? result = func.apply(this, arguments) : func = null, result
                }
            }

            function bind(func, thisArg) {
                var bitmask = BIND_FLAG;
                if (arguments.length > 2) {
                    var partials = baseSlice(arguments, 2),
                        holders = replaceHolders(partials, bind.placeholder);
                    bitmask |= PARTIAL_FLAG
                }
                return createWrapper(func, bitmask, thisArg, partials, holders);
            }

            function bindAll(object) {
                return baseBindAll(object, arguments.length > 1 ? baseFlatten(arguments, !1, !1, 1) : functions(object))
            }

            function bindKey(object, key) {
                var bitmask = BIND_FLAG | BIND_KEY_FLAG;
                if (arguments.length > 2) {
                    var partials = baseSlice(arguments, 2),
                        holders = replaceHolders(partials, bindKey.placeholder);
                    bitmask |= PARTIAL_FLAG
                }
                return createWrapper(key, bitmask, object, partials, holders)
            }

            function curry(func, arity, guard) {
                guard && isIterateeCall(func, arity, guard) && (arity = null);
                var result = createWrapper(func, CURRY_FLAG, null, null, null, null, null, arity);
                return result.placeholder = curry.placeholder, result
            }

            function curryRight(func, arity, guard) {
                guard && isIterateeCall(func, arity, guard) && (arity = null);
                var result = createWrapper(func, CURRY_RIGHT_FLAG, null, null, null, null, null, arity);
                return result.placeholder = curryRight.placeholder, result
            }

            function debounce(func, wait, options) {
                function cancel() {
                    timeoutId && clearTimeout(timeoutId), maxTimeoutId && clearTimeout(maxTimeoutId), maxTimeoutId = timeoutId = trailingCall = undefined
                }

                function delayed() {
                    var remaining = wait - (now() - stamp);
                    if (remaining <= 0 || remaining > wait) {
                        maxTimeoutId && clearTimeout(maxTimeoutId);
                        var isCalled = trailingCall;
                        maxTimeoutId = timeoutId = trailingCall = undefined, isCalled && (lastCalled = now(), result = func.apply(thisArg, args), timeoutId || maxTimeoutId || (args = thisArg = null))
                    } else timeoutId = setTimeout(delayed, remaining)
                }

                function maxDelayed() {
                    timeoutId && clearTimeout(timeoutId), maxTimeoutId = timeoutId = trailingCall = undefined, (trailing || maxWait !== wait) && (lastCalled = now(), result = func.apply(thisArg, args), timeoutId || maxTimeoutId || (args = thisArg = null))
                }

                function debounced() {
                    if (args = arguments, stamp = now(), thisArg = this, trailingCall = trailing && (timeoutId || !leading), maxWait === !1) var leadingCall = leading && !timeoutId;
                    else {
                        maxTimeoutId || leading || (lastCalled = stamp);
                        var remaining = maxWait - (stamp - lastCalled),
                            isCalled = remaining <= 0 || remaining > maxWait;
                        isCalled ? (maxTimeoutId && (maxTimeoutId = clearTimeout(maxTimeoutId)), lastCalled = stamp, result = func.apply(thisArg, args)) : maxTimeoutId || (maxTimeoutId = setTimeout(maxDelayed, remaining))
                    }
                    return isCalled && timeoutId ? timeoutId = clearTimeout(timeoutId) : timeoutId || wait === maxWait || (timeoutId = setTimeout(delayed, wait)), leadingCall && (isCalled = !0, result = func.apply(thisArg, args)), !isCalled || timeoutId || maxTimeoutId || (args = thisArg = null), result
                }
                var args, maxTimeoutId, result, stamp, thisArg, timeoutId, trailingCall, lastCalled = 0,
                    maxWait = !1,
                    trailing = !0;
                if ("function" != typeof func) throw new TypeError(FUNC_ERROR_TEXT);
                if (wait = wait < 0 ? 0 : +wait || 0, options === !0) {
                    var leading = !0;
                    trailing = !1
                } else isObject(options) && (leading = options.leading, maxWait = "maxWait" in options && nativeMax(+options.maxWait || 0, wait), trailing = "trailing" in options ? options.trailing : trailing);
                return debounced.cancel = cancel, debounced
            }

            function defer(func) {
                return baseDelay(func, 1, arguments, 1)
            }

            function delay(func, wait) {
                return baseDelay(func, wait, arguments, 2)
            }

            function memoize(func, resolver) {
                if ("function" != typeof func || resolver && "function" != typeof resolver) throw new TypeError(FUNC_ERROR_TEXT);
                var memoized = function() {
                    var args = arguments,
                        cache = memoized.cache,
                        key = resolver ? resolver.apply(this, args) : args[0];
                    if (cache.has(key)) return cache.get(key);
                    var result = func.apply(this, args);
                    return cache.set(key, result), result
                };
                return memoized.cache = new memoize.Cache, memoized
            }

            function negate(predicate) {
                if ("function" != typeof predicate) throw new TypeError(FUNC_ERROR_TEXT);
                return function() {
                    return !predicate.apply(this, arguments)
                }
            }

            function once(func) {
                return before(func, 2)
            }

            function partial(func) {
                var partials = baseSlice(arguments, 1),
                    holders = replaceHolders(partials, partial.placeholder);
                return createWrapper(func, PARTIAL_FLAG, null, partials, holders)
            }

            function partialRight(func) {
                var partials = baseSlice(arguments, 1),
                    holders = replaceHolders(partials, partialRight.placeholder);
                return createWrapper(func, PARTIAL_RIGHT_FLAG, null, partials, holders)
            }

            function rearg(func) {
                var indexes = baseFlatten(arguments, !1, !1, 1);
                return createWrapper(func, REARG_FLAG, null, null, null, indexes)
            }

            function spread(func) {
                if ("function" != typeof func) throw new TypeError(FUNC_ERROR_TEXT);
                return function(array) {
                    return func.apply(this, array)
                }
            }

            function throttle(func, wait, options) {
                var leading = !0,
                    trailing = !0;
                if ("function" != typeof func) throw new TypeError(FUNC_ERROR_TEXT);
                return options === !1 ? leading = !1 : isObject(options) && (leading = "leading" in options ? !!options.leading : leading, trailing = "trailing" in options ? !!options.trailing : trailing), debounceOptions.leading = leading, debounceOptions.maxWait = +wait, debounceOptions.trailing = trailing, debounce(func, wait, debounceOptions)
            }

            function wrap(value, wrapper) {
                return wrapper = null == wrapper ? identity : wrapper, createWrapper(wrapper, PARTIAL_FLAG, null, [value], [])
            }

            function clone(value, isDeep, customizer, thisArg) {
                return isDeep && "boolean" != typeof isDeep && isIterateeCall(value, isDeep, customizer) ? isDeep = !1 : "function" == typeof isDeep && (thisArg = customizer, customizer = isDeep, isDeep = !1), customizer = "function" == typeof customizer && bindCallback(customizer, thisArg, 1), baseClone(value, isDeep, customizer)
            }

            function cloneDeep(value, customizer, thisArg) {
                return customizer = "function" == typeof customizer && bindCallback(customizer, thisArg, 1), baseClone(value, !0, customizer)
            }

            function isArguments(value) {
                var length = isObjectLike(value) ? value.length : undefined;
                return isLength(length) && objToString.call(value) == argsTag || !1
            }

            function isBoolean(value) {
                return value === !0 || value === !1 || isObjectLike(value) && objToString.call(value) == boolTag || !1
            }

            function isDate(value) {
                return isObjectLike(value) && objToString.call(value) == dateTag || !1
            }

            function isElement(value) {
                return value && 1 === value.nodeType && isObjectLike(value) && objToString.call(value).indexOf("Element") > -1 || !1
            }

            function isEmpty(value) {
                if (null == value) return !0;
                var length = value.length;
                return isLength(length) && (isArray(value) || isString(value) || isArguments(value) || isObjectLike(value) && isFunction(value.splice)) ? !length : !keys(value).length
            }

            function isEqual(value, other, customizer, thisArg) {
                if (customizer = "function" == typeof customizer && bindCallback(customizer, thisArg, 3), !customizer && isStrictComparable(value) && isStrictComparable(other)) return value === other;
                var result = customizer ? customizer(value, other) : undefined;
                return "undefined" == typeof result ? baseIsEqual(value, other, customizer) : !!result
            }

            function isError(value) {
                return isObjectLike(value) && "string" == typeof value.message && objToString.call(value) == errorTag || !1
            }

            function isObject(value) {
                var type = typeof value;
                return "function" == type || value && "object" == type || !1
            }

            function isMatch(object, source, customizer, thisArg) {
                var props = keys(source),
                    length = props.length;
                if (customizer = "function" == typeof customizer && bindCallback(customizer, thisArg, 3), !customizer && 1 == length) {
                    var key = props[0],
                        value = source[key];
                    if (isStrictComparable(value)) return null != object && value === object[key] && hasOwnProperty.call(object, key)
                }
                for (var values = Array(length), strictCompareFlags = Array(length); length--;) value = values[length] = source[props[length]], strictCompareFlags[length] = isStrictComparable(value);
                return baseIsMatch(object, props, values, strictCompareFlags, customizer)
            }

            function isNaN(value) {
                return isNumber(value) && value != +value
            }

            function isNative(value) {
                return null != value && (objToString.call(value) == funcTag ? reNative.test(fnToString.call(value)) : isObjectLike(value) && reHostCtor.test(value) || !1)
            }

            function isNull(value) {
                return null === value
            }

            function isNumber(value) {
                return "number" == typeof value || isObjectLike(value) && objToString.call(value) == numberTag || !1
            }

            function isRegExp(value) {
                return isObjectLike(value) && objToString.call(value) == regexpTag || !1
            }

            function isString(value) {
                return "string" == typeof value || isObjectLike(value) && objToString.call(value) == stringTag || !1
            }

            function isTypedArray(value) {
                return isObjectLike(value) && isLength(value.length) && typedArrayTags[objToString.call(value)] || !1
            }

            function isUndefined(value) {
                return "undefined" == typeof value
            }

            function toArray(value) {
                var length = value ? value.length : 0;
                return isLength(length) ? length ? arrayCopy(value) : [] : values(value)
            }

            function toPlainObject(value) {
                return baseCopy(value, keysIn(value))
            }

            function create(prototype, properties, guard) {
                var result = baseCreate(prototype);
                return guard && isIterateeCall(prototype, properties, guard) && (properties = null), properties ? baseCopy(properties, result, keys(properties)) : result
            }

            function defaults(object) {
                if (null == object) return object;
                var args = arrayCopy(arguments);
                return args.push(assignDefaults), assign.apply(undefined, args)
            }

            function findKey(object, predicate, thisArg) {
                return predicate = getCallback(predicate, thisArg, 3), baseFind(object, predicate, baseForOwn, !0)
            }

            function findLastKey(object, predicate, thisArg) {
                return predicate = getCallback(predicate, thisArg, 3), baseFind(object, predicate, baseForOwnRight, !0)
            }

            function forIn(object, iteratee, thisArg) {
                return "function" == typeof iteratee && "undefined" == typeof thisArg || (iteratee = bindCallback(iteratee, thisArg, 3)), baseFor(object, iteratee, keysIn)
            }

            function forInRight(object, iteratee, thisArg) {
                return iteratee = bindCallback(iteratee, thisArg, 3), baseForRight(object, iteratee, keysIn)
            }

            function forOwn(object, iteratee, thisArg) {
                return "function" == typeof iteratee && "undefined" == typeof thisArg || (iteratee = bindCallback(iteratee, thisArg, 3)), baseForOwn(object, iteratee)
            }

            function forOwnRight(object, iteratee, thisArg) {
                return iteratee = bindCallback(iteratee, thisArg, 3), baseForRight(object, iteratee, keys)
            }

            function functions(object) {
                return baseFunctions(object, keysIn(object))
            }

            function has(object, key) {
                return !!object && hasOwnProperty.call(object, key)
            }

            function invert(object, multiValue, guard) {
                guard && isIterateeCall(object, multiValue, guard) && (multiValue = null);
                for (var index = -1, props = keys(object), length = props.length, result = {}; ++index < length;) {
                    var key = props[index],
                        value = object[key];
                    multiValue ? hasOwnProperty.call(result, value) ? result[value].push(key) : result[value] = [key] : result[value] = key
                }
                return result
            }

            function keysIn(object) {
                if (null == object) return [];
                isObject(object) || (object = Object(object));
                var length = object.length;
                length = length && isLength(length) && (isArray(object) || support.nonEnumArgs && isArguments(object)) && length || 0;
                for (var Ctor = object.constructor, index = -1, isProto = "function" == typeof Ctor && Ctor.prototype === object, result = Array(length), skipIndexes = length > 0; ++index < length;) result[index] = index + "";
                for (var key in object) skipIndexes && isIndex(key, length) || "constructor" == key && (isProto || !hasOwnProperty.call(object, key)) || result.push(key);
                return result
            }

            function mapValues(object, iteratee, thisArg) {
                var result = {};
                return iteratee = getCallback(iteratee, thisArg, 3), baseForOwn(object, function(value, key, object) {
                    result[key] = iteratee(value, key, object)
                }), result
            }

            function omit(object, predicate, thisArg) {
                if (null == object) return {};
                if ("function" != typeof predicate) {
                    var props = arrayMap(baseFlatten(arguments, !1, !1, 1), String);
                    return pickByArray(object, baseDifference(keysIn(object), props))
                }
                return predicate = bindCallback(predicate, thisArg, 3), pickByCallback(object, function(value, key, object) {
                    return !predicate(value, key, object)
                })
            }

            function pairs(object) {
                for (var index = -1, props = keys(object), length = props.length, result = Array(length); ++index < length;) {
                    var key = props[index];
                    result[index] = [key, object[key]]
                }
                return result
            }

            function pick(object, predicate, thisArg) {
                return null == object ? {} : "function" == typeof predicate ? pickByCallback(object, bindCallback(predicate, thisArg, 3)) : pickByArray(object, baseFlatten(arguments, !1, !1, 1))
            }

            function result(object, key, defaultValue) {
                var value = null == object ? undefined : object[key];
                return "undefined" == typeof value && (value = defaultValue), isFunction(value) ? value.call(object) : value
            }

            function transform(object, iteratee, accumulator, thisArg) {
                var isArr = isArray(object) || isTypedArray(object);
                if (iteratee = getCallback(iteratee, thisArg, 4), null == accumulator)
                    if (isArr || isObject(object)) {
                        var Ctor = object.constructor;
                        accumulator = isArr ? isArray(object) ? new Ctor : [] : baseCreate(isFunction(Ctor) && Ctor.prototype)
                    } else accumulator = {};
                return (isArr ? arrayEach : baseForOwn)(object, function(value, index, object) {
                    return iteratee(accumulator, value, index, object)
                }), accumulator
            }

            function values(object) {
                return baseValues(object, keys(object))
            }

            function valuesIn(object) {
                return baseValues(object, keysIn(object))
            }

            function inRange(value, start, end) {
                return start = +start || 0, "undefined" == typeof end ? (end = start, start = 0) : end = +end || 0, value >= start && value < end
            }

            function random(min, max, floating) {
                floating && isIterateeCall(min, max, floating) && (max = floating = null);
                var noMin = null == min,
                    noMax = null == max;
                if (null == floating && (noMax && "boolean" == typeof min ? (floating = min, min = 1) : "boolean" == typeof max && (floating = max, noMax = !0)), noMin && noMax && (max = 1, noMax = !1), min = +min || 0, noMax ? (max = min, min = 0) : max = +max || 0, floating || min % 1 || max % 1) {
                    var rand = nativeRandom();
                    return nativeMin(min + rand * (max - min + parseFloat("1e-" + ((rand + "").length - 1))), max)
                }
                return baseRandom(min, max)
            }

            function capitalize(string) {
                return string = baseToString(string), string && string.charAt(0).toUpperCase() + string.slice(1)
            }

            function deburr(string) {
                return string = baseToString(string), string && string.replace(reLatin1, deburrLetter)
            }

            function endsWith(string, target, position) {
                string = baseToString(string), target += "";
                var length = string.length;
                return position = "undefined" == typeof position ? length : nativeMin(position < 0 ? 0 : +position || 0, length), position -= target.length, position >= 0 && string.indexOf(target, position) == position
            }

            function escape(string) {
                return string = baseToString(string), string && reHasUnescapedHtml.test(string) ? string.replace(reUnescapedHtml, escapeHtmlChar) : string
            }

            function escapeRegExp(string) {
                return string = baseToString(string), string && reHasRegExpChars.test(string) ? string.replace(reRegExpChars, "\\$&") : string
            }

            function pad(string, length, chars) {
                string = baseToString(string), length = +length;
                var strLength = string.length;
                if (strLength >= length || !nativeIsFinite(length)) return string;
                var mid = (length - strLength) / 2,
                    leftLength = floor(mid),
                    rightLength = ceil(mid);
                return chars = createPad("", rightLength, chars), chars.slice(0, leftLength) + string + chars
            }

            function padLeft(string, length, chars) {
                return string = baseToString(string), string && createPad(string, length, chars) + string
            }

            function padRight(string, length, chars) {
                return string = baseToString(string), string && string + createPad(string, length, chars)
            }

            function parseInt(string, radix, guard) {
                return guard && isIterateeCall(string, radix, guard) && (radix = 0), nativeParseInt(string, radix)
            }

            function repeat(string, n) {
                var result = "";
                if (string = baseToString(string), n = +n, n < 1 || !string || !nativeIsFinite(n)) return result;
                do n % 2 && (result += string), n = floor(n / 2), string += string; while (n);
                return result
            }

            function startsWith(string, target, position) {
                return string = baseToString(string), position = null == position ? 0 : nativeMin(position < 0 ? 0 : +position || 0, string.length), string.lastIndexOf(target, position) == position
            }

            function template(string, options, otherOptions) {
                var settings = lodash.templateSettings;
                otherOptions && isIterateeCall(string, options, otherOptions) && (options = otherOptions = null), string = baseToString(string), options = baseAssign(baseAssign({}, otherOptions || options), settings, assignOwnDefaults);
                var isEscaping, isEvaluating, imports = baseAssign(baseAssign({}, options.imports), settings.imports, assignOwnDefaults),
                    importsKeys = keys(imports),
                    importsValues = baseValues(imports, importsKeys),
                    index = 0,
                    interpolate = options.interpolate || reNoMatch,
                    source = "__p += '",
                    reDelimiters = RegExp((options.escape || reNoMatch).source + "|" + interpolate.source + "|" + (interpolate === reInterpolate ? reEsTemplate : reNoMatch).source + "|" + (options.evaluate || reNoMatch).source + "|$", "g"),
                    sourceURL = "//# sourceURL=" + ("sourceURL" in options ? options.sourceURL : "lodash.templateSources[" + ++templateCounter + "]") + "\n";
                string.replace(reDelimiters, function(match, escapeValue, interpolateValue, esTemplateValue, evaluateValue, offset) {
                    return interpolateValue || (interpolateValue = esTemplateValue), source += string.slice(index, offset).replace(reUnescapedString, escapeStringChar), escapeValue && (isEscaping = !0, source += "' +\n__e(" + escapeValue + ") +\n'"), evaluateValue && (isEvaluating = !0, source += "';\n" + evaluateValue + ";\n__p += '"), interpolateValue && (source += "' +\n((__t = (" + interpolateValue + ")) == null ? '' : __t) +\n'"), index = offset + match.length, match
                }), source += "';\n";
                var variable = options.variable;
                variable || (source = "with (obj) {\n" + source + "\n}\n"), source = (isEvaluating ? source.replace(reEmptyStringLeading, "") : source).replace(reEmptyStringMiddle, "$1").replace(reEmptyStringTrailing, "$1;"), source = "function(" + (variable || "obj") + ") {\n" + (variable ? "" : "obj || (obj = {});\n") + "var __t, __p = ''" + (isEscaping ? ", __e = _.escape" : "") + (isEvaluating ? ", __j = Array.prototype.join;\nfunction print() { __p += __j.call(arguments, '') }\n" : ";\n") + source + "return __p\n}";
                var result = attempt(function() {
                    return Function(importsKeys, sourceURL + "return " + source).apply(undefined, importsValues)
                });
                if (result.source = source, isError(result)) throw result;
                return result
            }

            function trim(string, chars, guard) {
                var value = string;
                return (string = baseToString(string)) ? (guard ? isIterateeCall(value, chars, guard) : null == chars) ? string.slice(trimmedLeftIndex(string), trimmedRightIndex(string) + 1) : (chars += "", string.slice(charsLeftIndex(string, chars), charsRightIndex(string, chars) + 1)) : string
            }

            function trimLeft(string, chars, guard) {
                var value = string;
                return string = baseToString(string), string ? (guard ? isIterateeCall(value, chars, guard) : null == chars) ? string.slice(trimmedLeftIndex(string)) : string.slice(charsLeftIndex(string, chars + "")) : string
            }

            function trimRight(string, chars, guard) {
                var value = string;
                return string = baseToString(string), string ? (guard ? isIterateeCall(value, chars, guard) : null == chars) ? string.slice(0, trimmedRightIndex(string) + 1) : string.slice(0, charsRightIndex(string, chars + "") + 1) : string
            }

            function trunc(string, options, guard) {
                guard && isIterateeCall(string, options, guard) && (options = null);
                var length = DEFAULT_TRUNC_LENGTH,
                    omission = DEFAULT_TRUNC_OMISSION;
                if (null != options)
                    if (isObject(options)) {
                        var separator = "separator" in options ? options.separator : separator;
                        length = "length" in options ? +options.length || 0 : length, omission = "omission" in options ? baseToString(options.omission) : omission
                    } else length = +options || 0;
                if (string = baseToString(string), length >= string.length) return string;
                var end = length - omission.length;
                if (end < 1) return omission;
                var result = string.slice(0, end);
                if (null == separator) return result + omission;
                if (isRegExp(separator)) {
                    if (string.slice(end).search(separator)) {
                        var match, newEnd, substring = string.slice(0, end);
                        for (separator.global || (separator = RegExp(separator.source, (reFlags.exec(separator) || "") + "g")), separator.lastIndex = 0; match = separator.exec(substring);) newEnd = match.index;
                        result = result.slice(0, null == newEnd ? end : newEnd)
                    }
                } else if (string.indexOf(separator, end) != end) {
                    var index = result.lastIndexOf(separator);
                    index > -1 && (result = result.slice(0, index))
                }
                return result + omission
            }

            function unescape(string) {
                return string = baseToString(string), string && reHasEscapedHtml.test(string) ? string.replace(reEscapedHtml, unescapeHtmlChar) : string
            }

            function words(string, pattern, guard) {
                return guard && isIterateeCall(string, pattern, guard) && (pattern = null), string = baseToString(string), string.match(pattern || reWords) || []
            }

            function attempt() {
                for (var func = arguments[0], length = arguments.length, args = Array(length ? length - 1 : 0); --length > 0;) args[length - 1] = arguments[length];
                try {
                    return func.apply(undefined, args)
                } catch (e) {
                    return isError(e) ? e : new Error(e)
                }
            }

            function callback(func, thisArg, guard) {
                return guard && isIterateeCall(func, thisArg, guard) && (thisArg = null), isObjectLike(func) ? matches(func) : baseCallback(func, thisArg)
            }

            function constant(value) {
                return function() {
                    return value
                }
            }

            function identity(value) {
                return value
            }

            function matches(source) {
                return baseMatches(baseClone(source, !0))
            }

            function matchesProperty(key, value) {
                return baseMatchesProperty(key + "", baseClone(value, !0))
            }

            function mixin(object, source, options) {
                if (null == options) {
                    var isObj = isObject(source),
                        props = isObj && keys(source),
                        methodNames = props && props.length && baseFunctions(source, props);
                    (methodNames ? methodNames.length : isObj) || (methodNames = !1, options = source, source = object, object = this)
                }
                methodNames || (methodNames = baseFunctions(source, keys(source)));
                var chain = !0,
                    index = -1,
                    isFunc = isFunction(object),
                    length = methodNames.length;
                options === !1 ? chain = !1 : isObject(options) && "chain" in options && (chain = options.chain);
                for (; ++index < length;) {
                    var methodName = methodNames[index],
                        func = source[methodName];
                    object[methodName] = func, isFunc && (object.prototype[methodName] = function(func) {
                        return function() {
                            var chainAll = this.__chain__;
                            if (chain || chainAll) {
                                var result = object(this.__wrapped__);
                                return (result.__actions__ = arrayCopy(this.__actions__)).push({
                                    func: func,
                                    args: arguments,
                                    thisArg: object
                                }), result.__chain__ = chainAll, result
                            }
                            var args = [this.value()];
                            return push.apply(args, arguments), func.apply(object, args)
                        }
                    }(func))
                }
                return object
            }

            function noConflict() {
                return context._ = oldDash, this
            }

            function noop() {}

            function property(key) {
                return baseProperty(key + "")
            }

            function propertyOf(object) {
                return function(key) {
                    return null == object ? undefined : object[key]
                }
            }

            function range(start, end, step) {
                step && isIterateeCall(start, end, step) && (end = step = null), start = +start || 0, step = null == step ? 1 : +step || 0, null == end ? (end = start, start = 0) : end = +end || 0;
                for (var index = -1, length = nativeMax(ceil((end - start) / (step || 1)), 0), result = Array(length); ++index < length;) result[index] = start, start += step;
                return result
            }

            function times(n, iteratee, thisArg) {
                if (n = +n, n < 1 || !nativeIsFinite(n)) return [];
                var index = -1,
                    result = Array(nativeMin(n, MAX_ARRAY_LENGTH));
                for (iteratee = bindCallback(iteratee, thisArg, 1); ++index < n;) index < MAX_ARRAY_LENGTH ? result[index] = iteratee(index) : iteratee(index);
                return result
            }

            function uniqueId(prefix) {
                var id = ++idCounter;
                return baseToString(prefix) + id
            }

            function add(augend, addend) {
                return augend + addend
            }

            function sum(collection) {
                isArray(collection) || (collection = toIterable(collection));
                for (var length = collection.length, result = 0; length--;) result += +collection[length] || 0;
                return result
            }
            context = context ? _.defaults(root.Object(), context, _.pick(root, contextProps)) : root;
            var Array = context.Array,
                Date = context.Date,
                Error = context.Error,
                Function = context.Function,
                Math = context.Math,
                Number = context.Number,
                Object = context.Object,
                RegExp = context.RegExp,
                String = context.String,
                TypeError = context.TypeError,
                arrayProto = Array.prototype,
                objectProto = Object.prototype,
                stringProto = String.prototype,
                document = (document = context.window) && document.document,
                fnToString = Function.prototype.toString,
                getLength = baseProperty("length"),
                hasOwnProperty = objectProto.hasOwnProperty,
                idCounter = 0,
                objToString = objectProto.toString,
                oldDash = context._,
                reNative = RegExp("^" + escapeRegExp(objToString).replace(/toString|(function).*?(?=\\\()| for .+?(?=\\\])/g, "$1.*?") + "$"),
                ArrayBuffer = isNative(ArrayBuffer = context.ArrayBuffer) && ArrayBuffer,
                bufferSlice = isNative(bufferSlice = ArrayBuffer && new ArrayBuffer(0).slice) && bufferSlice,
                ceil = Math.ceil,
                clearTimeout = context.clearTimeout,
                floor = Math.floor,
                getPrototypeOf = isNative(getPrototypeOf = Object.getPrototypeOf) && getPrototypeOf,
                push = arrayProto.push,
                propertyIsEnumerable = objectProto.propertyIsEnumerable,
                Set = isNative(Set = context.Set) && Set,
                setTimeout = context.setTimeout,
                splice = arrayProto.splice,
                Uint8Array = isNative(Uint8Array = context.Uint8Array) && Uint8Array,
                WeakMap = isNative(WeakMap = context.WeakMap) && WeakMap,
                Float64Array = function() {
                    try {
                        var func = isNative(func = context.Float64Array) && func,
                            result = new func(new ArrayBuffer(10), 0, 1) && func
                    } catch (e) {}
                    return result
                }(),
                nativeIsArray = isNative(nativeIsArray = Array.isArray) && nativeIsArray,
                nativeCreate = isNative(nativeCreate = Object.create) && nativeCreate,
                nativeIsFinite = context.isFinite,
                nativeKeys = isNative(nativeKeys = Object.keys) && nativeKeys,
                nativeMax = Math.max,
                nativeMin = Math.min,
                nativeNow = isNative(nativeNow = Date.now) && nativeNow,
                nativeNumIsFinite = isNative(nativeNumIsFinite = Number.isFinite) && nativeNumIsFinite,
                nativeParseInt = context.parseInt,
                nativeRandom = Math.random,
                NEGATIVE_INFINITY = Number.NEGATIVE_INFINITY,
                POSITIVE_INFINITY = Number.POSITIVE_INFINITY,
                MAX_ARRAY_LENGTH = Math.pow(2, 32) - 1,
                MAX_ARRAY_INDEX = MAX_ARRAY_LENGTH - 1,
                HALF_MAX_ARRAY_LENGTH = MAX_ARRAY_LENGTH >>> 1,
                FLOAT64_BYTES_PER_ELEMENT = Float64Array ? Float64Array.BYTES_PER_ELEMENT : 0,
                MAX_SAFE_INTEGER = Math.pow(2, 53) - 1,
                metaMap = WeakMap && new WeakMap,
                support = lodash.support = {};
            ! function(x) {
                support.funcDecomp = !isNative(context.WinRTError) && reThis.test(runInContext), support.funcNames = "string" == typeof Function.name;
                try {
                    support.dom = 11 === document.createDocumentFragment().nodeType
                } catch (e) {
                    support.dom = !1
                }
                try {
                    support.nonEnumArgs = !propertyIsEnumerable.call(arguments, 1)
                } catch (e) {
                    support.nonEnumArgs = !0
                }
            }(0, 0), lodash.templateSettings = {
                escape: reEscape,
                evaluate: reEvaluate,
                interpolate: reInterpolate,
                variable: "",
                imports: {
                    _: lodash
                }
            };
            var baseCreate = function() {
                    function Object() {}
                    return function(prototype) {
                        if (isObject(prototype)) {
                            Object.prototype = prototype;
                            var result = new Object;
                            Object.prototype = null
                        }
                        return result || context.Object()
                    }
                }(),
                baseSetData = metaMap ? function(func, data) {
                    return metaMap.set(func, data), func
                } : identity;
            bufferSlice || (bufferClone = ArrayBuffer && Uint8Array ? function(buffer) {
                var byteLength = buffer.byteLength,
                    floatLength = Float64Array ? floor(byteLength / FLOAT64_BYTES_PER_ELEMENT) : 0,
                    offset = floatLength * FLOAT64_BYTES_PER_ELEMENT,
                    result = new ArrayBuffer(byteLength);
                if (floatLength) {
                    var view = new Float64Array(result, 0, floatLength);
                    view.set(new Float64Array(buffer, 0, floatLength))
                }
                return byteLength != offset && (view = new Uint8Array(result, offset), view.set(new Uint8Array(buffer, offset))), result
            } : constant(null));
            var createCache = nativeCreate && Set ? function(values) {
                    return new SetCache(values)
                } : constant(null),
                getData = metaMap ? function(func) {
                    return metaMap.get(func)
                } : noop,
                setData = function() {
                    var count = 0,
                        lastCalled = 0;
                    return function(key, value) {
                        var stamp = now(),
                            remaining = HOT_SPAN - (stamp - lastCalled);
                        if (lastCalled = stamp, remaining > 0) {
                            if (++count >= HOT_COUNT) return key
                        } else count = 0;
                        return baseSetData(key, value)
                    }
                }(),
                countBy = createAggregator(function(result, value, key) {
                    hasOwnProperty.call(result, key) ? ++result[key] : result[key] = 1
                }),
                groupBy = createAggregator(function(result, value, key) {
                    hasOwnProperty.call(result, key) ? result[key].push(value) : result[key] = [value]
                }),
                indexBy = createAggregator(function(result, value, key) {
                    result[key] = value
                }),
                partition = createAggregator(function(result, value, key) {
                    result[key ? 0 : 1].push(value)
                }, function() {
                    return [
                        [],
                        []
                    ]
                }),
                now = nativeNow || function() {
                    return (new Date).getTime()
                },
                flow = createComposer(),
                flowRight = createComposer(!0),
                isArray = nativeIsArray || function(value) {
                    return isObjectLike(value) && isLength(value.length) && objToString.call(value) == arrayTag || !1
                };
            support.dom || (isElement = function(value) {
                return value && 1 === value.nodeType && isObjectLike(value) && !isPlainObject(value) || !1
            });
            var isFinite = nativeNumIsFinite || function(value) {
                    return "number" == typeof value && nativeIsFinite(value)
                },
                isFunction = baseIsFunction(/x/) || Uint8Array && !baseIsFunction(Uint8Array) ? function(value) {
                    return objToString.call(value) == funcTag
                } : baseIsFunction,
                isPlainObject = getPrototypeOf ? function(value) {
                    if (!value || objToString.call(value) != objectTag) return !1;
                    var valueOf = value.valueOf,
                        objProto = isNative(valueOf) && (objProto = getPrototypeOf(valueOf)) && getPrototypeOf(objProto);
                    return objProto ? value == objProto || getPrototypeOf(value) == objProto : shimIsPlainObject(value)
                } : shimIsPlainObject,
                assign = createAssigner(baseAssign),
                keys = nativeKeys ? function(object) {
                    if (object) var Ctor = object.constructor,
                        length = object.length;
                    return "function" == typeof Ctor && Ctor.prototype === object || "function" != typeof object && length && isLength(length) ? shimKeys(object) : isObject(object) ? nativeKeys(object) : []
                } : shimKeys,
                merge = createAssigner(baseMerge),
                camelCase = createCompounder(function(result, word, index) {
                    return word = word.toLowerCase(), result + (index ? word.charAt(0).toUpperCase() + word.slice(1) : word)
                }),
                kebabCase = createCompounder(function(result, word, index) {
                    return result + (index ? "-" : "") + word.toLowerCase()
                });
            8 != nativeParseInt(whitespace + "08") && (parseInt = function(string, radix, guard) {
                return (guard ? isIterateeCall(string, radix, guard) : null == radix) ? radix = 0 : radix && (radix = +radix), string = trim(string), nativeParseInt(string, radix || (reHexPrefix.test(string) ? 16 : 10))
            });
            var snakeCase = createCompounder(function(result, word, index) {
                    return result + (index ? "_" : "") + word.toLowerCase()
                }),
                startCase = createCompounder(function(result, word, index) {
                    return result + (index ? " " : "") + (word.charAt(0).toUpperCase() + word.slice(1))
                }),
                max = createExtremum(arrayMax),
                min = createExtremum(arrayMin, !0);
            return lodash.prototype = baseLodash.prototype, LodashWrapper.prototype = baseCreate(baseLodash.prototype), LodashWrapper.prototype.constructor = LodashWrapper, LazyWrapper.prototype = baseCreate(baseLodash.prototype), LazyWrapper.prototype.constructor = LazyWrapper, MapCache.prototype["delete"] = mapDelete, MapCache.prototype.get = mapGet, MapCache.prototype.has = mapHas, MapCache.prototype.set = mapSet, SetCache.prototype.push = cachePush, memoize.Cache = MapCache, lodash.after = after, lodash.ary = ary, lodash.assign = assign, lodash.at = at, lodash.before = before, lodash.bind = bind, lodash.bindAll = bindAll, lodash.bindKey = bindKey, lodash.callback = callback, lodash.chain = chain, lodash.chunk = chunk, lodash.compact = compact, lodash.constant = constant, lodash.countBy = countBy, lodash.create = create, lodash.curry = curry, lodash.curryRight = curryRight, lodash.debounce = debounce, lodash.defaults = defaults, lodash.defer = defer, lodash.delay = delay, lodash.difference = difference, lodash.drop = drop, lodash.dropRight = dropRight, lodash.dropRightWhile = dropRightWhile, lodash.dropWhile = dropWhile, lodash.fill = fill, lodash.filter = filter, lodash.flatten = flatten, lodash.flattenDeep = flattenDeep, lodash.flow = flow, lodash.flowRight = flowRight, lodash.forEach = forEach, lodash.forEachRight = forEachRight, lodash.forIn = forIn, lodash.forInRight = forInRight, lodash.forOwn = forOwn, lodash.forOwnRight = forOwnRight, lodash.functions = functions, lodash.groupBy = groupBy, lodash.indexBy = indexBy, lodash.initial = initial, lodash.intersection = intersection, lodash.invert = invert, lodash.invoke = invoke, lodash.keys = keys, lodash.keysIn = keysIn, lodash.map = map, lodash.mapValues = mapValues, lodash.matches = matches, lodash.matchesProperty = matchesProperty, lodash.memoize = memoize, lodash.merge = merge, lodash.mixin = mixin, lodash.negate = negate, lodash.omit = omit, lodash.once = once, lodash.pairs = pairs, lodash.partial = partial, lodash.partialRight = partialRight, lodash.partition = partition, lodash.pick = pick, lodash.pluck = pluck, lodash.property = property, lodash.propertyOf = propertyOf, lodash.pull = pull, lodash.pullAt = pullAt, lodash.range = range, lodash.rearg = rearg, lodash.reject = reject, lodash.remove = remove, lodash.rest = rest, lodash.shuffle = shuffle, lodash.slice = slice, lodash.sortBy = sortBy, lodash.sortByAll = sortByAll, lodash.sortByOrder = sortByOrder, lodash.spread = spread, lodash.take = take, lodash.takeRight = takeRight, lodash.takeRightWhile = takeRightWhile, lodash.takeWhile = takeWhile, lodash.tap = tap, lodash.throttle = throttle, lodash.thru = thru, lodash.times = times, lodash.toArray = toArray, lodash.toPlainObject = toPlainObject, lodash.transform = transform, lodash.union = union, lodash.uniq = uniq, lodash.unzip = unzip, lodash.values = values, lodash.valuesIn = valuesIn, lodash.where = where, lodash.without = without, lodash.wrap = wrap, lodash.xor = xor, lodash.zip = zip, lodash.zipObject = zipObject, lodash.backflow = flowRight, lodash.collect = map, lodash.compose = flowRight, lodash.each = forEach, lodash.eachRight = forEachRight, lodash.extend = assign, lodash.iteratee = callback, lodash.methods = functions, lodash.object = zipObject, lodash.select = filter, lodash.tail = rest, lodash.unique = uniq, mixin(lodash, lodash), lodash.add = add, lodash.attempt = attempt, lodash.camelCase = camelCase, lodash.capitalize = capitalize, lodash.clone = clone, lodash.cloneDeep = cloneDeep, lodash.deburr = deburr, lodash.endsWith = endsWith, lodash.escape = escape, lodash.escapeRegExp = escapeRegExp, lodash.every = every, lodash.find = find, lodash.findIndex = findIndex, lodash.findKey = findKey, lodash.findLast = findLast, lodash.findLastIndex = findLastIndex, lodash.findLastKey = findLastKey, lodash.findWhere = findWhere, lodash.first = first, lodash.has = has, lodash.identity = identity, lodash.includes = includes, lodash.indexOf = indexOf, lodash.inRange = inRange, lodash.isArguments = isArguments, lodash.isArray = isArray, lodash.isBoolean = isBoolean, lodash.isDate = isDate, lodash.isElement = isElement, lodash.isEmpty = isEmpty, lodash.isEqual = isEqual, lodash.isError = isError, lodash.isFinite = isFinite, lodash.isFunction = isFunction, lodash.isMatch = isMatch, lodash.isNaN = isNaN, lodash.isNative = isNative, lodash.isNull = isNull, lodash.isNumber = isNumber, lodash.isObject = isObject, lodash.isPlainObject = isPlainObject, lodash.isRegExp = isRegExp, lodash.isString = isString, lodash.isTypedArray = isTypedArray, lodash.isUndefined = isUndefined, lodash.kebabCase = kebabCase, lodash.last = last, lodash.lastIndexOf = lastIndexOf,
                lodash.max = max, lodash.min = min, lodash.noConflict = noConflict, lodash.noop = noop, lodash.now = now, lodash.pad = pad, lodash.padLeft = padLeft, lodash.padRight = padRight, lodash.parseInt = parseInt, lodash.random = random, lodash.reduce = reduce, lodash.reduceRight = reduceRight, lodash.repeat = repeat, lodash.result = result, lodash.runInContext = runInContext, lodash.size = size, lodash.snakeCase = snakeCase, lodash.some = some, lodash.sortedIndex = sortedIndex, lodash.sortedLastIndex = sortedLastIndex, lodash.startCase = startCase, lodash.startsWith = startsWith, lodash.sum = sum, lodash.template = template, lodash.trim = trim, lodash.trimLeft = trimLeft, lodash.trimRight = trimRight, lodash.trunc = trunc, lodash.unescape = unescape, lodash.uniqueId = uniqueId, lodash.words = words, lodash.all = every, lodash.any = some, lodash.contains = includes, lodash.detect = find, lodash.foldl = reduce, lodash.foldr = reduceRight, lodash.head = first, lodash.include = includes, lodash.inject = reduce, mixin(lodash, function() {
                    var source = {};
                    return baseForOwn(lodash, function(func, methodName) {
                        lodash.prototype[methodName] || (source[methodName] = func)
                    }), source
                }(), !1), lodash.sample = sample, lodash.prototype.sample = function(n) {
                    return this.__chain__ || null != n ? this.thru(function(value) {
                        return sample(value, n)
                    }) : sample(this.value())
                }, lodash.VERSION = VERSION, arrayEach(["bind", "bindKey", "curry", "curryRight", "partial", "partialRight"], function(methodName) {
                    lodash[methodName].placeholder = lodash
                }), arrayEach(["dropWhile", "filter", "map", "takeWhile"], function(methodName, type) {
                    var isFilter = type != LAZY_MAP_FLAG,
                        isDropWhile = type == LAZY_DROP_WHILE_FLAG;
                    LazyWrapper.prototype[methodName] = function(iteratee, thisArg) {
                        var filtered = this.__filtered__,
                            result = filtered && isDropWhile ? new LazyWrapper(this) : this.clone(),
                            iteratees = result.__iteratees__ || (result.__iteratees__ = []);
                        return iteratees.push({
                            done: !1,
                            count: 0,
                            index: 0,
                            iteratee: getCallback(iteratee, thisArg, 1),
                            limit: -1,
                            type: type
                        }), result.__filtered__ = filtered || isFilter, result
                    }
                }), arrayEach(["drop", "take"], function(methodName, index) {
                    var whileName = methodName + "While";
                    LazyWrapper.prototype[methodName] = function(n) {
                        var filtered = this.__filtered__,
                            result = filtered && !index ? this.dropWhile() : this.clone();
                        if (n = null == n ? 1 : nativeMax(floor(n) || 0, 0), filtered) index ? result.__takeCount__ = nativeMin(result.__takeCount__, n) : last(result.__iteratees__).limit = n;
                        else {
                            var views = result.__views__ || (result.__views__ = []);
                            views.push({
                                size: n,
                                type: methodName + (result.__dir__ < 0 ? "Right" : "")
                            })
                        }
                        return result
                    }, LazyWrapper.prototype[methodName + "Right"] = function(n) {
                        return this.reverse()[methodName](n).reverse()
                    }, LazyWrapper.prototype[methodName + "RightWhile"] = function(predicate, thisArg) {
                        return this.reverse()[whileName](predicate, thisArg).reverse()
                    }
                }), arrayEach(["first", "last"], function(methodName, index) {
                    var takeName = "take" + (index ? "Right" : "");
                    LazyWrapper.prototype[methodName] = function() {
                        return this[takeName](1).value()[0]
                    }
                }), arrayEach(["initial", "rest"], function(methodName, index) {
                    var dropName = "drop" + (index ? "" : "Right");
                    LazyWrapper.prototype[methodName] = function() {
                        return this[dropName](1)
                    }
                }), arrayEach(["pluck", "where"], function(methodName, index) {
                    var operationName = index ? "filter" : "map",
                        createCallback = index ? baseMatches : baseProperty;
                    LazyWrapper.prototype[methodName] = function(value) {
                        return this[operationName](createCallback(value))
                    }
                }), LazyWrapper.prototype.compact = function() {
                    return this.filter(identity)
                }, LazyWrapper.prototype.reject = function(predicate, thisArg) {
                    return predicate = getCallback(predicate, thisArg, 1), this.filter(function(value) {
                        return !predicate(value)
                    })
                }, LazyWrapper.prototype.slice = function(start, end) {
                    start = null == start ? 0 : +start || 0;
                    var result = start < 0 ? this.takeRight(-start) : this.drop(start);
                    return "undefined" != typeof end && (end = +end || 0, result = end < 0 ? result.dropRight(-end) : result.take(end - start)), result
                }, LazyWrapper.prototype.toArray = function() {
                    return this.drop(0)
                }, baseForOwn(LazyWrapper.prototype, function(func, methodName) {
                    var lodashFunc = lodash[methodName],
                        checkIteratee = /^(?:filter|map|reject)|While$/.test(methodName),
                        retUnwrapped = /^(?:first|last)$/.test(methodName);
                    lodash.prototype[methodName] = function() {
                        var args = arguments,
                            chainAll = (args.length, this.__chain__),
                            value = this.__wrapped__,
                            isHybrid = !!this.__actions__.length,
                            isLazy = value instanceof LazyWrapper,
                            iteratee = args[0],
                            useLazy = isLazy || isArray(value);
                        useLazy && checkIteratee && "function" == typeof iteratee && 1 != iteratee.length && (isLazy = useLazy = !1);
                        var onlyLazy = isLazy && !isHybrid;
                        if (retUnwrapped && !chainAll) return onlyLazy ? func.call(value) : lodashFunc.call(lodash, this.value());
                        var interceptor = function(value) {
                            var otherArgs = [value];
                            return push.apply(otherArgs, args), lodashFunc.apply(lodash, otherArgs)
                        };
                        if (useLazy) {
                            var wrapper = onlyLazy ? value : new LazyWrapper(this),
                                result = func.apply(wrapper, args);
                            if (!retUnwrapped && (isHybrid || result.__actions__)) {
                                var actions = result.__actions__ || (result.__actions__ = []);
                                actions.push({
                                    func: thru,
                                    args: [interceptor],
                                    thisArg: lodash
                                })
                            }
                            return new LodashWrapper(result, chainAll)
                        }
                        return this.thru(interceptor)
                    }
                }), arrayEach(["concat", "join", "pop", "push", "replace", "shift", "sort", "splice", "split", "unshift"], function(methodName) {
                    var func = (/^(?:replace|split)$/.test(methodName) ? stringProto : arrayProto)[methodName],
                        chainName = /^(?:push|sort|unshift)$/.test(methodName) ? "tap" : "thru",
                        retUnwrapped = /^(?:join|pop|replace|shift)$/.test(methodName);
                    lodash.prototype[methodName] = function() {
                        var args = arguments;
                        return retUnwrapped && !this.__chain__ ? func.apply(this.value(), args) : this[chainName](function(value) {
                            return func.apply(value, args)
                        })
                    }
                }), LazyWrapper.prototype.clone = lazyClone, LazyWrapper.prototype.reverse = lazyReverse, LazyWrapper.prototype.value = lazyValue, lodash.prototype.chain = wrapperChain, lodash.prototype.commit = wrapperCommit, lodash.prototype.plant = wrapperPlant, lodash.prototype.reverse = wrapperReverse, lodash.prototype.toString = wrapperToString, lodash.prototype.run = lodash.prototype.toJSON = lodash.prototype.valueOf = lodash.prototype.value = wrapperValue, lodash.prototype.collect = lodash.prototype.map, lodash.prototype.head = lodash.prototype.first, lodash.prototype.select = lodash.prototype.filter, lodash.prototype.tail = lodash.prototype.rest, lodash
        }
        var undefined, VERSION = "3.5.0",
            BIND_FLAG = 1,
            BIND_KEY_FLAG = 2,
            CURRY_BOUND_FLAG = 4,
            CURRY_FLAG = 8,
            CURRY_RIGHT_FLAG = 16,
            PARTIAL_FLAG = 32,
            PARTIAL_RIGHT_FLAG = 64,
            REARG_FLAG = 128,
            ARY_FLAG = 256,
            DEFAULT_TRUNC_LENGTH = 30,
            DEFAULT_TRUNC_OMISSION = "...",
            HOT_COUNT = 150,
            HOT_SPAN = 16,
            LAZY_DROP_WHILE_FLAG = 0,
            LAZY_FILTER_FLAG = 1,
            LAZY_MAP_FLAG = 2,
            FUNC_ERROR_TEXT = "Expected a function",
            PLACEHOLDER = "__lodash_placeholder__",
            argsTag = "[object Arguments]",
            arrayTag = "[object Array]",
            boolTag = "[object Boolean]",
            dateTag = "[object Date]",
            errorTag = "[object Error]",
            funcTag = "[object Function]",
            mapTag = "[object Map]",
            numberTag = "[object Number]",
            objectTag = "[object Object]",
            regexpTag = "[object RegExp]",
            setTag = "[object Set]",
            stringTag = "[object String]",
            weakMapTag = "[object WeakMap]",
            arrayBufferTag = "[object ArrayBuffer]",
            float32Tag = "[object Float32Array]",
            float64Tag = "[object Float64Array]",
            int8Tag = "[object Int8Array]",
            int16Tag = "[object Int16Array]",
            int32Tag = "[object Int32Array]",
            uint8Tag = "[object Uint8Array]",
            uint8ClampedTag = "[object Uint8ClampedArray]",
            uint16Tag = "[object Uint16Array]",
            uint32Tag = "[object Uint32Array]",
            reEmptyStringLeading = /\b__p \+= '';/g,
            reEmptyStringMiddle = /\b(__p \+=) '' \+/g,
            reEmptyStringTrailing = /(__e\(.*?\)|\b__t\)) \+\n'';/g,
            reEscapedHtml = /&(?:amp|lt|gt|quot|#39|#96);/g,
            reUnescapedHtml = /[&<>"'`]/g,
            reHasEscapedHtml = RegExp(reEscapedHtml.source),
            reHasUnescapedHtml = RegExp(reUnescapedHtml.source),
            reEscape = /<%-([\s\S]+?)%>/g,
            reEvaluate = /<%([\s\S]+?)%>/g,
            reInterpolate = /<%=([\s\S]+?)%>/g,
            reEsTemplate = /\$\{([^\\}]*(?:\\.[^\\}]*)*)\}/g,
            reFlags = /\w*$/,
            reFuncName = /^\s*function[ \n\r\t]+\w/,
            reHexPrefix = /^0[xX]/,
            reHostCtor = /^\[object .+?Constructor\]$/,
            reLatin1 = /[\xc0-\xd6\xd8-\xde\xdf-\xf6\xf8-\xff]/g,
            reNoMatch = /($^)/,
            reRegExpChars = /[.*+?^${}()|[\]\/\\]/g,
            reHasRegExpChars = RegExp(reRegExpChars.source),
            reThis = /\bthis\b/,
            reUnescapedString = /['\n\r\u2028\u2029\\]/g,
            reWords = function() {
                var upper = "[A-Z\\xc0-\\xd6\\xd8-\\xde]",
                    lower = "[a-z\\xdf-\\xf6\\xf8-\\xff]+";
                return RegExp(upper + "+(?=" + upper + lower + ")|" + upper + "?" + lower + "|" + upper + "+|[0-9]+", "g")
            }(),
            whitespace = " \t\x0B\f \ufeff\n\r\u2028\u2029 ᠎             　",
            contextProps = ["Array", "ArrayBuffer", "Date", "Error", "Float32Array", "Float64Array", "Function", "Int8Array", "Int16Array", "Int32Array", "Math", "Number", "Object", "RegExp", "Set", "String", "_", "clearTimeout", "document", "isFinite", "parseInt", "setTimeout", "TypeError", "Uint8Array", "Uint8ClampedArray", "Uint16Array", "Uint32Array", "WeakMap", "window", "WinRTError"],
            templateCounter = -1,
            typedArrayTags = {};
        typedArrayTags[float32Tag] = typedArrayTags[float64Tag] = typedArrayTags[int8Tag] = typedArrayTags[int16Tag] = typedArrayTags[int32Tag] = typedArrayTags[uint8Tag] = typedArrayTags[uint8ClampedTag] = typedArrayTags[uint16Tag] = typedArrayTags[uint32Tag] = !0, typedArrayTags[argsTag] = typedArrayTags[arrayTag] = typedArrayTags[arrayBufferTag] = typedArrayTags[boolTag] = typedArrayTags[dateTag] = typedArrayTags[errorTag] = typedArrayTags[funcTag] = typedArrayTags[mapTag] = typedArrayTags[numberTag] = typedArrayTags[objectTag] = typedArrayTags[regexpTag] = typedArrayTags[setTag] = typedArrayTags[stringTag] = typedArrayTags[weakMapTag] = !1;
        var cloneableTags = {};
        cloneableTags[argsTag] = cloneableTags[arrayTag] = cloneableTags[arrayBufferTag] = cloneableTags[boolTag] = cloneableTags[dateTag] = cloneableTags[float32Tag] = cloneableTags[float64Tag] = cloneableTags[int8Tag] = cloneableTags[int16Tag] = cloneableTags[int32Tag] = cloneableTags[numberTag] = cloneableTags[objectTag] = cloneableTags[regexpTag] = cloneableTags[stringTag] = cloneableTags[uint8Tag] = cloneableTags[uint8ClampedTag] = cloneableTags[uint16Tag] = cloneableTags[uint32Tag] = !0, cloneableTags[errorTag] = cloneableTags[funcTag] = cloneableTags[mapTag] = cloneableTags[setTag] = cloneableTags[weakMapTag] = !1;
        var debounceOptions = {
                leading: !1,
                maxWait: 0,
                trailing: !1
            },
            deburredLetters = {
                "À": "A",
                "Á": "A",
                "Â": "A",
                "Ã": "A",
                "Ä": "A",
                "Å": "A",
                "à": "a",
                "á": "a",
                "â": "a",
                "ã": "a",
                "ä": "a",
                "å": "a",
                "Ç": "C",
                "ç": "c",
                "Ð": "D",
                "ð": "d",
                "È": "E",
                "É": "E",
                "Ê": "E",
                "Ë": "E",
                "è": "e",
                "é": "e",
                "ê": "e",
                "ë": "e",
                "Ì": "I",
                "Í": "I",
                "Î": "I",
                "Ï": "I",
                "ì": "i",
                "í": "i",
                "î": "i",
                "ï": "i",
                "Ñ": "N",
                "ñ": "n",
                "Ò": "O",
                "Ó": "O",
                "Ô": "O",
                "Õ": "O",
                "Ö": "O",
                "Ø": "O",
                "ò": "o",
                "ó": "o",
                "ô": "o",
                "õ": "o",
                "ö": "o",
                "ø": "o",
                "Ù": "U",
                "Ú": "U",
                "Û": "U",
                "Ü": "U",
                "ù": "u",
                "ú": "u",
                "û": "u",
                "ü": "u",
                "Ý": "Y",
                "ý": "y",
                "ÿ": "y",
                "Æ": "Ae",
                "æ": "ae",
                "Þ": "Th",
                "þ": "th",
                "ß": "ss"
            },
            htmlEscapes = {
                "&": "&amp;",
                "<": "&lt;",
                ">": "&gt;",
                '"': "&quot;",
                "'": "&#39;",
                "`": "&#96;"
            },
            htmlUnescapes = {
                "&amp;": "&",
                "&lt;": "<",
                "&gt;": ">",
                "&quot;": '"',
                "&#39;": "'",
                "&#96;": "`"
            },
            objectTypes = {
                "function": !0,
                object: !0
            },
            stringEscapes = {
                "\\": "\\",
                "'": "'",
                "\n": "n",
                "\r": "r",
                "\u2028": "u2028",
                "\u2029": "u2029"
            },
            freeExports = objectTypes[typeof exports] && exports && !exports.nodeType && exports,
            freeModule = objectTypes[typeof module] && module && !module.nodeType && module,
            freeGlobal = freeExports && freeModule && "object" == typeof global && global,
            freeWindow = objectTypes[typeof window] && window,
            moduleExports = freeModule && freeModule.exports === freeExports && freeExports,
            root = freeGlobal || freeWindow !== (this && this.window) && freeWindow || this,
            _ = runInContext();
        "function" == typeof define && "object" == typeof define.amd && define.amd ? (root._ = _, define(function() {
            return _
        })) : freeExports && freeModule ? moduleExports ? (freeModule.exports = _)._ = _ : freeExports._ = _ : root._ = _
    }.call(this), ! function() {
        "use strict";

        function t(t) {
            this.tokens = [], this.tokens.links = {}, this.options = t || d.defaults, this.rules = e.normal, this.options.gfm && (this.options.tables ? this.rules = e.tables : this.rules = e.gfm)
        }

        function r(e, t) {
            if (this.options = t || d.defaults, this.links = e, this.rules = n.normal, this.renderer = this.options.renderer || new s, this.renderer.options = this.options, !this.links) throw new Error("Tokens array requires a `links` property.");
            this.options.gfm ? this.options.breaks ? this.rules = n.breaks : this.rules = n.gfm : this.options.pedantic && (this.rules = n.pedantic)
        }

        function s(e) {
            this.options = e || {}
        }

        function i() {}

        function l(e) {
            this.tokens = [], this.token = null, this.options = e || d.defaults, this.options.renderer = this.options.renderer || new s, this.renderer = this.options.renderer, this.renderer.options = this.options
        }

        function o(e, t) {
            return e.replace(t ? /&/g : /&(?!#?\w+;)/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#39;")
        }

        function a(e) {
            return e.replace(/&(#(?:\d+)|(?:#x[0-9A-Fa-f]+)|(?:\w+));?/gi, function(e, t) {
                return "colon" === (t = t.toLowerCase()) ? ":" : "#" === t.charAt(0) ? "x" === t.charAt(1) ? String.fromCharCode(parseInt(t.substring(2), 16)) : String.fromCharCode(+t.substring(1)) : ""
            })
        }

        function h(e, t) {
            return e = e.source, t = t || "", {
                replace: function(t, n) {
                    return n = (n = n.source || n).replace(/(^|[^\[])\^/g, "$1"), e = e.replace(t, n), this
                },
                getRegex: function() {
                    return new RegExp(e, t)
                }
            }
        }

        function p(e, t) {
            return u[" " + e] || (/^[^:]+:\/*[^\/]*$/.test(e) ? u[" " + e] = e + "/" : u[" " + e] = e.replace(/[^\/]*$/, "")), e = u[" " + e], "//" === t.slice(0, 2) ? e.replace(/:[\s\S]*/, ":") + t : "/" === t.charAt(0) ? e.replace(/(:\/*[^\/]*)[\s\S]*/, "$1") + t : e + t
        }

        function g() {}

        function f(e) {
            for (var t, n, r = 1; r < arguments.length; r++)
                for (n in t = arguments[r]) Object.prototype.hasOwnProperty.call(t, n) && (e[n] = t[n]);
            return e
        }

        function d(e, n, r) {
            if (null == e) throw new Error("marked(): input parameter is undefined or null");
            if ("string" != typeof e) throw new Error("marked(): input parameter is of type " + Object.prototype.toString.call(e) + ", string expected");
            if (r || "function" == typeof n) {
                r || (r = n, n = null);
                var s, i, a = (n = f({}, d.defaults, n || {})).highlight,
                    h = 0;
                try {
                    s = t.lex(e, n)
                } catch (e) {
                    return r(e)
                }
                i = s.length;
                var p = function(e) {
                    if (e) return n.highlight = a, r(e);
                    var t;
                    try {
                        t = l.parse(s, n)
                    } catch (t) {
                        e = t
                    }
                    return n.highlight = a, e ? r(e) : r(null, t)
                };
                if (!a || a.length < 3) return p();
                if (delete n.highlight, !i) return p();
                for (; h < s.length; h++) ! function(e) {
                    "code" !== e.type ? --i || p() : a(e.text, e.lang, function(t, n) {
                        return t ? p(t) : null == n || n === e.text ? --i || p() : (e.text = n, e.escaped = !0, void(--i || p()))
                    })
                }(s[h])
            } else try {
                return n && (n = f({}, d.defaults, n)), l.parse(t.lex(e, n), n)
            } catch (e) {
                if (e.message += "\nPlease report this to https://github.com/chjj/marked.", (n || d.defaults).silent) return "<p>An error occurred:</p><pre>" + o(e.message + "", !0) + "</pre>";
                throw e
            }
        }
        var e = {
            newline: /^\n+/,
            code: /^( {4}[^\n]+\n*)+/,
            fences: g,
            hr: /^ {0,3}((?:- *){3,}|(?:_ *){3,}|(?:\* *){3,})(?:\n+|$)/,
            heading: /^ *(#{1,6}) *([^\n]+?) *#* *(?:\n+|$)/,
            nptable: g,
            blockquote: /^( {0,3}> ?(paragraph|[^\n]*)(?:\n|$))+/,
            list: /^( *)(bull) [\s\S]+?(?:hr|def|\n{2,}(?! )(?!\1bull )\n*|\s*$)/,
            html: /^ *(?:comment *(?:\n|\s*$)|closed *(?:\n{2,}|\s*$)|closing *(?:\n{2,}|\s*$))/,
            def: /^ {0,3}\[(label)\]: *\n? *<?([^\s>]+)>?(?:(?: +\n? *| *\n *)(title))? *(?:\n+|$)/,
            table: g,
            lheading: /^([^\n]+)\n *(=|-){2,} *(?:\n+|$)/,
            paragraph: /^([^\n]+(?:\n?(?!hr|heading|lheading| {0,3}>|tag)[^\n]+)+)/,
            text: /^[^\n]+/
        };
        e._label = /(?:\\[\[\]]|[^\[\]])+/, e._title = /(?:"(?:\\"|[^"]|"[^"\n]*")*"|'\n?(?:[^'\n]+\n?)*'|\([^()]*\))/, e.def = h(e.def).replace("label", e._label).replace("title", e._title).getRegex(), e.bullet = /(?:[*+-]|\d+\.)/, e.item = /^( *)(bull) [^\n]*(?:\n(?!\1bull )[^\n]*)*/, e.item = h(e.item, "gm").replace(/bull/g, e.bullet).getRegex(), e.list = h(e.list).replace(/bull/g, e.bullet).replace("hr", "\\n+(?=\\1?(?:(?:- *){3,}|(?:_ *){3,}|(?:\\* *){3,})(?:\\n+|$))").replace("def", "\\n+(?=" + e.def.source + ")").getRegex(), e._tag = "(?!(?:a|em|strong|small|s|cite|q|dfn|abbr|data|time|code|var|samp|kbd|sub|sup|i|b|u|mark|ruby|rt|rp|bdi|bdo|span|br|wbr|ins|del|img)\\b)\\w+(?!:|[^\\w\\s@]*@)\\b", e.html = h(e.html).replace("comment", /<!--[\s\S]*?-->/).replace("closed", /<(tag)[\s\S]+?<\/\1>/).replace("closing", /<tag(?:"[^"]*"|'[^']*'|\s[^'"\/>]*)*?\/?>/).replace(/tag/g, e._tag).getRegex(), e.paragraph = h(e.paragraph).replace("hr", e.hr).replace("heading", e.heading).replace("lheading", e.lheading).replace("tag", "<" + e._tag).getRegex(), e.blockquote = h(e.blockquote).replace("paragraph", e.paragraph).getRegex(), e.normal = f({}, e), e.gfm = f({}, e.normal, {
            fences: /^ *(`{3,}|~{3,})[ \.]*(\S+)? *\n([\s\S]*?)\n? *\1 *(?:\n+|$)/,
            paragraph: /^/,
            heading: /^ *(#{1,6}) +([^\n]+?) *#* *(?:\n+|$)/
        }), e.gfm.paragraph = h(e.paragraph).replace("(?!", "(?!" + e.gfm.fences.source.replace("\\1", "\\2") + "|" + e.list.source.replace("\\1", "\\3") + "|").getRegex(), e.tables = f({}, e.gfm, {
            nptable: /^ *(\S.*\|.*)\n *([-:]+ *\|[-| :]*)\n((?:.*\|.*(?:\n|$))*)\n*/,
            table: /^ *\|(.+)\n *\|( *[-:]+[-| :]*)\n((?: *\|.*(?:\n|$))*)\n*/
        }), t.rules = e, t.lex = function(e, n) {
            return new t(n).lex(e)
        }, t.prototype.lex = function(e) {
            return e = e.replace(/\r\n|\r/g, "\n").replace(/\t/g, "    ").replace(/\u00a0/g, " ").replace(/\u2424/g, "\n"), this.token(e, !0)
        }, t.prototype.token = function(t, n) {
            var r, s, i, l, o, a, h, p, u, c;
            for (t = t.replace(/^ +$/gm, ""); t;)
                if ((i = this.rules.newline.exec(t)) && (t = t.substring(i[0].length), i[0].length > 1 && this.tokens.push({
                        type: "space"
                    })), i = this.rules.code.exec(t)) t = t.substring(i[0].length), i = i[0].replace(/^ {4}/gm, ""), this.tokens.push({
                    type: "code",
                    text: this.options.pedantic ? i : i.replace(/\n+$/, "")
                });
                else if (i = this.rules.fences.exec(t)) t = t.substring(i[0].length), this.tokens.push({
                type: "code",
                lang: i[2],
                text: i[3] || ""
            });
            else if (i = this.rules.heading.exec(t)) t = t.substring(i[0].length), this.tokens.push({
                type: "heading",
                depth: i[1].length,
                text: i[2]
            });
            else if (n && (i = this.rules.nptable.exec(t))) {
                for (t = t.substring(i[0].length), a = {
                        type: "table",
                        header: i[1].replace(/^ *| *\| *$/g, "").split(/ *\| */),
                        align: i[2].replace(/^ *|\| *$/g, "").split(/ *\| */),
                        cells: i[3].replace(/\n$/, "").split("\n")
                    }, p = 0; p < a.align.length; p++) /^ *-+: *$/.test(a.align[p]) ? a.align[p] = "right" : /^ *:-+: *$/.test(a.align[p]) ? a.align[p] = "center" : /^ *:-+ *$/.test(a.align[p]) ? a.align[p] = "left" : a.align[p] = null;
                for (p = 0; p < a.cells.length; p++) a.cells[p] = a.cells[p].split(/ *\| */);
                this.tokens.push(a)
            } else if (i = this.rules.hr.exec(t)) t = t.substring(i[0].length), this.tokens.push({
                type: "hr"
            });
            else if (i = this.rules.blockquote.exec(t)) t = t.substring(i[0].length), this.tokens.push({
                type: "blockquote_start"
            }), i = i[0].replace(/^ *> ?/gm, ""), this.token(i, n), this.tokens.push({
                type: "blockquote_end"
            });
            else if (i = this.rules.list.exec(t)) {
                for (t = t.substring(i[0].length), l = i[2], this.tokens.push({
                        type: "list_start",
                        ordered: l.length > 1
                    }), r = !1, c = (i = i[0].match(this.rules.item)).length, p = 0; p < c; p++) h = (a = i[p]).length, ~(a = a.replace(/^ *([*+-]|\d+\.) +/, "")).indexOf("\n ") && (h -= a.length, a = this.options.pedantic ? a.replace(/^ {1,4}/gm, "") : a.replace(new RegExp("^ {1," + h + "}", "gm"), "")), this.options.smartLists && p !== c - 1 && (l === (o = e.bullet.exec(i[p + 1])[0]) || l.length > 1 && o.length > 1 || (t = i.slice(p + 1).join("\n") + t, p = c - 1)), s = r || /\n\n(?!\s*$)/.test(a), p !== c - 1 && (r = "\n" === a.charAt(a.length - 1), s || (s = r)), this.tokens.push({
                    type: s ? "loose_item_start" : "list_item_start"
                }), this.token(a, !1), this.tokens.push({
                    type: "list_item_end"
                });
                this.tokens.push({
                    type: "list_end"
                })
            } else if (i = this.rules.html.exec(t)) t = t.substring(i[0].length), this.tokens.push({
                type: this.options.sanitize ? "paragraph" : "html",
                pre: !this.options.sanitizer && ("pre" === i[1] || "script" === i[1] || "style" === i[1]),
                text: i[0]
            });
            else if (n && (i = this.rules.def.exec(t))) t = t.substring(i[0].length), i[3] && (i[3] = i[3].substring(1, i[3].length - 1)), u = i[1].toLowerCase(), this.tokens.links[u] || (this.tokens.links[u] = {
                href: i[2],
                title: i[3]
            });
            else if (n && (i = this.rules.table.exec(t))) {
                for (t = t.substring(i[0].length), a = {
                        type: "table",
                        header: i[1].replace(/^ *| *\| *$/g, "").split(/ *\| */),
                        align: i[2].replace(/^ *|\| *$/g, "").split(/ *\| */),
                        cells: i[3].replace(/(?: *\| *)?\n$/, "").split("\n")
                    }, p = 0; p < a.align.length; p++) /^ *-+: *$/.test(a.align[p]) ? a.align[p] = "right" : /^ *:-+: *$/.test(a.align[p]) ? a.align[p] = "center" : /^ *:-+ *$/.test(a.align[p]) ? a.align[p] = "left" : a.align[p] = null;
                for (p = 0; p < a.cells.length; p++) a.cells[p] = a.cells[p].replace(/^ *\| *| *\| *$/g, "").split(/ *\| */);
                this.tokens.push(a)
            } else if (i = this.rules.lheading.exec(t)) t = t.substring(i[0].length), this.tokens.push({
                type: "heading",
                depth: "=" === i[2] ? 1 : 2,
                text: i[1]
            });
            else if (n && (i = this.rules.paragraph.exec(t))) t = t.substring(i[0].length), this.tokens.push({
                type: "paragraph",
                text: "\n" === i[1].charAt(i[1].length - 1) ? i[1].slice(0, -1) : i[1]
            });
            else if (i = this.rules.text.exec(t)) t = t.substring(i[0].length), this.tokens.push({
                type: "text",
                text: i[0]
            });
            else if (t) throw new Error("Infinite loop on byte: " + t.charCodeAt(0));
            return this.tokens
        };
        var n = {
            escape: /^\\([\\`*{}\[\]()#+\-.!_>])/,
            autolink: /^<(scheme:[^\s\x00-\x1f<>]*|email)>/,
            url: g,
            tag: /^<!--[\s\S]*?-->|^<\/?[a-zA-Z0-9\-]+(?:"[^"]*"|'[^']*'|\s[^<'">\/]*)*?\/?>/,
            link: /^!?\[(inside)\]\(href\)/,
            reflink: /^!?\[(inside)\]\s*\[([^\]]*)\]/,
            nolink: /^!?\[((?:\[[^\]]*\]|\\[\[\]]|[^\[\]])*)\]/,
            strong: /^__([\s\S]+?)__(?!_)|^\*\*([\s\S]+?)\*\*(?!\*)/,
            em: /^_([^\s_](?:[^_]|__)+?[^\s_])_\b|^\*((?:\*\*|[^*])+?)\*(?!\*)/,
            code: /^(`+)(\s*)([\s\S]*?[^`]?)\2\1(?!`)/,
            br: /^ {2,}\n(?!\s*$)/,
            del: g,
            text: /^[\s\S]+?(?=[\\<!\[`*]|\b_| {2,}\n|$)/
        };
        n._scheme = /[a-zA-Z][a-zA-Z0-9+.-]{1,31}/, n._email = /[a-zA-Z0-9.!#$%&'*+\/=?^_`{|}~-]+(@)[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+(?![-_])/, n.autolink = h(n.autolink).replace("scheme", n._scheme).replace("email", n._email).getRegex(), n._inside = /(?:\[[^\]]*\]|\\[\[\]]|[^\[\]]|\](?=[^\[]*\]))*/, n._href = /\s*<?([\s\S]*?)>?(?:\s+['"]([\s\S]*?)['"])?\s*/, n.link = h(n.link).replace("inside", n._inside).replace("href", n._href).getRegex(), n.reflink = h(n.reflink).replace("inside", n._inside).getRegex(), n.normal = f({}, n), n.pedantic = f({}, n.normal, {
            strong: /^__(?=\S)([\s\S]*?\S)__(?!_)|^\*\*(?=\S)([\s\S]*?\S)\*\*(?!\*)/,
            em: /^_(?=\S)([\s\S]*?\S)_(?!_)|^\*(?=\S)([\s\S]*?\S)\*(?!\*)/
        }), n.gfm = f({}, n.normal, {
            escape: h(n.escape).replace("])", "~|])").getRegex(),
            url: h(/^((?:ftp|https?):\/\/|www\.)(?:[a-zA-Z0-9\-]+\.?)+[^\s<]*|^email/).replace("email", n._email).getRegex(),
            _backpedal: /(?:[^?!.,:;*_~()&]+|\([^)]*\)|&(?![a-zA-Z0-9]+;$)|[?!.,:;*_~)]+(?!$))+/,
            del: /^~~(?=\S)([\s\S]*?\S)~~/,
            text: h(n.text).replace("]|", "~]|").replace("|", "|https?://|ftp://|www\\.|[a-zA-Z0-9.!#$%&'*+/=?^_`{\\|}~-]+@|").getRegex()
        }), n.breaks = f({}, n.gfm, {
            br: h(n.br).replace("{2,}", "*").getRegex(),
            text: h(n.gfm.text).replace("{2,}", "*").getRegex()
        }), r.rules = n, r.output = function(e, t, n) {
            return new r(t, n).output(e)
        }, r.prototype.output = function(e) {
            for (var t, n, r, s, i = ""; e;)
                if (s = this.rules.escape.exec(e)) e = e.substring(s[0].length), i += s[1];
                else if (s = this.rules.autolink.exec(e)) e = e.substring(s[0].length), r = "@" === s[2] ? "mailto:" + (n = o(this.mangle(s[1]))) : n = o(s[1]), i += this.renderer.link(r, null, n);
            else if (this.inLink || !(s = this.rules.url.exec(e))) {
                if (s = this.rules.tag.exec(e)) !this.inLink && /^<a /i.test(s[0]) ? this.inLink = !0 : this.inLink && /^<\/a>/i.test(s[0]) && (this.inLink = !1), e = e.substring(s[0].length), i += this.options.sanitize ? this.options.sanitizer ? this.options.sanitizer(s[0]) : o(s[0]) : s[0];
                else if (s = this.rules.link.exec(e)) e = e.substring(s[0].length), this.inLink = !0, i += this.outputLink(s, {
                    href: s[2],
                    title: s[3]
                }), this.inLink = !1;
                else if ((s = this.rules.reflink.exec(e)) || (s = this.rules.nolink.exec(e))) {
                    if (e = e.substring(s[0].length), t = (s[2] || s[1]).replace(/\s+/g, " "), !(t = this.links[t.toLowerCase()]) || !t.href) {
                        i += s[0].charAt(0), e = s[0].substring(1) + e;
                        continue
                    }
                    this.inLink = !0, i += this.outputLink(s, t), this.inLink = !1
                } else if (s = this.rules.strong.exec(e)) e = e.substring(s[0].length), i += this.renderer.strong(this.output(s[2] || s[1]));
                else if (s = this.rules.em.exec(e)) e = e.substring(s[0].length), i += this.renderer.em(this.output(s[2] || s[1]));
                else if (s = this.rules.code.exec(e)) e = e.substring(s[0].length), i += this.renderer.codespan(o(s[3].trim(), !0));
                else if (s = this.rules.br.exec(e)) e = e.substring(s[0].length), i += this.renderer.br();
                else if (s = this.rules.del.exec(e)) e = e.substring(s[0].length), i += this.renderer.del(this.output(s[1]));
                else if (s = this.rules.text.exec(e)) e = e.substring(s[0].length), i += this.renderer.text(o(this.smartypants(s[0])));
                else if (e) throw new Error("Infinite loop on byte: " + e.charCodeAt(0))
            } else s[0] = this.rules._backpedal.exec(s[0])[0], e = e.substring(s[0].length), "@" === s[2] ? r = "mailto:" + (n = o(s[0])) : (n = o(s[0]), r = "www." === s[1] ? "http://" + n : n), i += this.renderer.link(r, null, n);
            return i
        }, r.prototype.outputLink = function(e, t) {
            var n = o(t.href),
                r = t.title ? o(t.title) : null;
            return "!" !== e[0].charAt(0) ? this.renderer.link(n, r, this.output(e[1])) : this.renderer.image(n, r, o(e[1]))
        }, r.prototype.smartypants = function(e) {
            return this.options.smartypants ? e.replace(/---/g, "—").replace(/--/g, "–").replace(/(^|[-\u2014\/(\[{"\s])'/g, "$1‘").replace(/'/g, "’").replace(/(^|[-\u2014\/(\[{\u2018\s])"/g, "$1“").replace(/"/g, "”").replace(/\.{3}/g, "…") : e
        }, r.prototype.mangle = function(e) {
            if (!this.options.mangle) return e;
            for (var t, n = "", r = e.length, s = 0; s < r; s++) t = e.charCodeAt(s), Math.random() > .5 && (t = "x" + t.toString(16)), n += "&#" + t + ";";
            return n
        }, s.prototype.code = function(e, t, n) {
            if (this.options.highlight) {
                var r = this.options.highlight(e, t);
                null != r && r !== e && (n = !0, e = r)
            }
            return t ? '<pre><code class="' + this.options.langPrefix + o(t, !0) + '">' + (n ? e : o(e, !0)) + "\n</code></pre>\n" : "<pre><code>" + (n ? e : o(e, !0)) + "\n</code></pre>"
        }, s.prototype.blockquote = function(e) {
            return "<blockquote>\n" + e + "</blockquote>\n"
        }, s.prototype.html = function(e) {
            return e
        }, s.prototype.heading = function(e, t, n) {
            return "<h" + t + ' id="' + this.options.headerPrefix + n.toLowerCase().replace(/[^\w]+/g, "-") + '">' + e + "</h" + t + ">\n"
        }, s.prototype.hr = function() {
            return this.options.xhtml ? "<hr/>\n" : "<hr>\n"
        }, s.prototype.list = function(e, t) {
            var n = t ? "ol" : "ul";
            return "<" + n + ">\n" + e + "</" + n + ">\n"
        }, s.prototype.listitem = function(e) {
            return "<li>" + e + "</li>\n"
        }, s.prototype.paragraph = function(e) {
            return "<p>" + e + "</p>\n"
        }, s.prototype.table = function(e, t) {
            return "<table>\n<thead>\n" + e + "</thead>\n<tbody>\n" + t + "</tbody>\n</table>\n"
        }, s.prototype.tablerow = function(e) {
            return "<tr>\n" + e + "</tr>\n"
        }, s.prototype.tablecell = function(e, t) {
            var n = t.header ? "th" : "td";
            return (t.align ? "<" + n + ' style="text-align:' + t.align + '">' : "<" + n + ">") + e + "</" + n + ">\n"
        }, s.prototype.strong = function(e) {
            return "<strong>" + e + "</strong>"
        }, s.prototype.em = function(e) {
            return "<em>" + e + "</em>"
        }, s.prototype.codespan = function(e) {
            return "<code>" + e + "</code>"
        }, s.prototype.br = function() {
            return this.options.xhtml ? "<br/>" : "<br>"
        }, s.prototype.del = function(e) {
            return "<del>" + e + "</del>"
        }, s.prototype.link = function(e, t, n) {
            if (this.options.sanitize) {
                try {
                    var r = decodeURIComponent(a(e)).replace(/[^\w:]/g, "").toLowerCase()
                } catch (e) {
                    return n
                }
                if (0 === r.indexOf("javascript:") || 0 === r.indexOf("vbscript:") || 0 === r.indexOf("data:")) return n
            }
            this.options.baseUrl && !c.test(e) && (e = p(this.options.baseUrl, e));
            var s = '<a href="' + e + '"';
            return t && (s += ' title="' + t + '"'), s += ">" + n + "</a>"
        }, s.prototype.image = function(e, t, n) {
            this.options.baseUrl && !c.test(e) && (e = p(this.options.baseUrl, e));
            var r = '<img src="' + e + '" alt="' + n + '"';
            return t && (r += ' title="' + t + '"'), r += this.options.xhtml ? "/>" : ">"
        }, s.prototype.text = function(e) {
            return e
        }, i.prototype.strong = i.prototype.em = i.prototype.codespan = i.prototype.del = i.prototype.text = function(e) {
            return e
        }, i.prototype.link = i.prototype.image = function(e, t, n) {
            return "" + n
        }, i.prototype.br = function() {
            return ""
        }, l.parse = function(e, t) {
            return new l(t).parse(e)
        }, l.prototype.parse = function(e) {
            this.inline = new r(e.links, this.options), this.inlineText = new r(e.links, f({}, this.options, {
                renderer: new i
            })), this.tokens = e.reverse();
            for (var t = ""; this.next();) t += this.tok();
            return t
        }, l.prototype.next = function() {
            return this.token = this.tokens.pop()
        }, l.prototype.peek = function() {
            return this.tokens[this.tokens.length - 1] || 0
        }, l.prototype.parseText = function() {
            for (var e = this.token.text;
                "text" === this.peek().type;) e += "\n" + this.next().text;
            return this.inline.output(e)
        }, l.prototype.tok = function() {
            switch (this.token.type) {
                case "space":
                    return "";
                case "hr":
                    return this.renderer.hr();
                case "heading":
                    return this.renderer.heading(this.inline.output(this.token.text), this.token.depth, a(this.inlineText.output(this.token.text)));
                case "code":
                    return this.renderer.code(this.token.text, this.token.lang, this.token.escaped);
                case "table":
                    var e, t, n, r, s = "",
                        i = "";
                    for (n = "", e = 0; e < this.token.header.length; e++) n += this.renderer.tablecell(this.inline.output(this.token.header[e]), {
                        header: !0,
                        align: this.token.align[e]
                    });
                    for (s += this.renderer.tablerow(n), e = 0; e < this.token.cells.length; e++) {
                        for (t = this.token.cells[e], n = "", r = 0; r < t.length; r++) n += this.renderer.tablecell(this.inline.output(t[r]), {
                            header: !1,
                            align: this.token.align[r]
                        });
                        i += this.renderer.tablerow(n)
                    }
                    return this.renderer.table(s, i);
                case "blockquote_start":
                    for (i = "";
                        "blockquote_end" !== this.next().type;) i += this.tok();
                    return this.renderer.blockquote(i);
                case "list_start":
                    i = "";
                    for (var l = this.token.ordered;
                        "list_end" !== this.next().type;) i += this.tok();
                    return this.renderer.list(i, l);
                case "list_item_start":
                    for (i = "";
                        "list_item_end" !== this.next().type;) i += "text" === this.token.type ? this.parseText() : this.tok();
                    return this.renderer.listitem(i);
                case "loose_item_start":
                    for (i = "";
                        "list_item_end" !== this.next().type;) i += this.tok();
                    return this.renderer.listitem(i);
                case "html":
                    var o = this.token.pre || this.options.pedantic ? this.token.text : this.inline.output(this.token.text);
                    return this.renderer.html(o);
                case "paragraph":
                    return this.renderer.paragraph(this.inline.output(this.token.text));
                case "text":
                    return this.renderer.paragraph(this.parseText())
            }
        };
        var u = {},
            c = /^$|^[a-z][a-z0-9+.-]*:|^[?#]/i;
        g.exec = g, d.options = d.setOptions = function(e) {
            return f(d.defaults, e), d
        }, d.defaults = {
            gfm: !0,
            tables: !0,
            breaks: !1,
            pedantic: !1,
            sanitize: !1,
            sanitizer: null,
            mangle: !0,
            smartLists: !1,
            silent: !1,
            highlight: null,
            langPrefix: "lang-",
            smartypants: !1,
            headerPrefix: "",
            renderer: new s,
            xhtml: !1,
            baseUrl: null
        }, d.Parser = l, d.parser = l.parse, d.Renderer = s, d.TextRenderer = i, d.Lexer = t, d.lexer = t.lex, d.InlineLexer = r, d.inlineLexer = r.output, d.parse = d, "undefined" != typeof module && "object" == typeof exports ? module.exports = d : "function" == typeof define && define.amd ? define(function() {
            return d
        }) : (this || ("undefined" != typeof window ? window : global)).marked = d
    }(), window.CodeMirror = function() {
        "use strict";

        function CodeMirror(place, options) {
            if (!(this instanceof CodeMirror)) return new CodeMirror(place, options);
            this.options = options = options || {};
            for (var opt in defaults) !options.hasOwnProperty(opt) && defaults.hasOwnProperty(opt) && (options[opt] = defaults[opt]);
            setGuttersForLineNumbers(options);
            var docStart = "string" == typeof options.value ? 0 : options.value.first,
                display = this.display = makeDisplay(place, docStart);
            display.wrapper.CodeMirror = this, updateGutters(this), options.autofocus && !mobile && focusInput(this), this.state = {
                keyMaps: [],
                overlays: [],
                modeGen: 0,
                overwrite: !1,
                focused: !1,
                suppressEdits: !1,
                pasteIncoming: !1,
                draggingText: !1,
                highlight: new Delayed
            }, themeChanged(this), options.lineWrapping && (this.display.wrapper.className += " CodeMirror-wrap");
            var doc = options.value;
            "string" == typeof doc && (doc = new Doc(options.value, options.mode)), operation(this, attachDoc)(this, doc), ie && setTimeout(bind(resetInput, this, !0), 20), registerEventHandlers(this);
            var hasFocus;
            try {
                hasFocus = document.activeElement == display.input
            } catch (e) {}
            hasFocus || options.autofocus && !mobile ? setTimeout(bind(onFocus, this), 20) : onBlur(this), operation(this, function() {
                for (var opt in optionHandlers) optionHandlers.propertyIsEnumerable(opt) && optionHandlers[opt](this, options[opt], Init);
                for (var i = 0; i < initHooks.length; ++i) initHooks[i](this)
            })()
        }

        function makeDisplay(place, docStart) {
            var d = {},
                input = d.input = elt("textarea", null, null, "position: absolute; padding: 0; width: 1px; height: 1em; outline: none; font-size: 4px;");
            return webkit ? input.style.width = "1000px" : input.setAttribute("wrap", "off"), ios && (input.style.border = "1px solid black"), input.setAttribute("autocorrect", "off"), input.setAttribute("autocapitalize", "off"), input.setAttribute("spellcheck", "false"), d.inputDiv = elt("div", [input], null, "overflow: hidden; position: relative; width: 3px; height: 0px;"), d.scrollbarH = elt("div", [elt("div", null, null, "height: 1px")], "CodeMirror-hscrollbar"), d.scrollbarV = elt("div", [elt("div", null, null, "width: 1px")], "CodeMirror-vscrollbar"), d.scrollbarFiller = elt("div", null, "CodeMirror-scrollbar-filler"), d.gutterFiller = elt("div", null, "CodeMirror-gutter-filler"), d.lineDiv = elt("div", null, "CodeMirror-code"), d.selectionDiv = elt("div", null, null, "position: relative; z-index: 1"), d.cursor = elt("div", " ", "CodeMirror-cursor"), d.otherCursor = elt("div", " ", "CodeMirror-cursor CodeMirror-secondarycursor"), d.measure = elt("div", null, "CodeMirror-measure"), d.lineSpace = elt("div", [d.measure, d.selectionDiv, d.lineDiv, d.cursor, d.otherCursor], null, "position: relative; outline: none"), d.mover = elt("div", [elt("div", [d.lineSpace], "CodeMirror-lines")], null, "position: relative"), d.sizer = elt("div", [d.mover], "CodeMirror-sizer"), d.heightForcer = elt("div", null, null, "position: absolute; height: " + scrollerCutOff + "px; width: 1px;"),
                d.gutters = elt("div", null, "CodeMirror-gutters"), d.lineGutter = null, d.scroller = elt("div", [d.sizer, d.heightForcer, d.gutters], "CodeMirror-scroll"), d.scroller.setAttribute("tabIndex", "-1"), d.wrapper = elt("div", [d.inputDiv, d.scrollbarH, d.scrollbarV, d.scrollbarFiller, d.gutterFiller, d.scroller], "CodeMirror"), ie_lt8 && (d.gutters.style.zIndex = -1, d.scroller.style.paddingRight = 0), place.appendChild ? place.appendChild(d.wrapper) : place(d.wrapper), ios && (input.style.width = "0px"), webkit || (d.scroller.draggable = !0), khtml ? (d.inputDiv.style.height = "1px", d.inputDiv.style.position = "absolute") : ie_lt8 && (d.scrollbarH.style.minWidth = d.scrollbarV.style.minWidth = "18px"), d.viewOffset = d.lastSizeC = 0, d.showingFrom = d.showingTo = docStart, d.lineNumWidth = d.lineNumInnerWidth = d.lineNumChars = null, d.prevInput = "", d.alignWidgets = !1, d.pollingFast = !1, d.poll = new Delayed, d.cachedCharWidth = d.cachedTextHeight = null, d.measureLineCache = [], d.measureLineCachePos = 0, d.inaccurateSelection = !1, d.maxLine = null, d.maxLineLength = 0, d.maxLineChanged = !1, d.wheelDX = d.wheelDY = d.wheelStartX = d.wheelStartY = null, d
        }

        function loadMode(cm) {
            cm.doc.mode = CodeMirror.getMode(cm.options, cm.doc.modeOption), cm.doc.iter(function(line) {
                line.stateAfter && (line.stateAfter = null), line.styles && (line.styles = null)
            }), cm.doc.frontier = cm.doc.first, startWorker(cm, 100), cm.state.modeGen++, cm.curOp && regChange(cm)
        }

        function wrappingChanged(cm) {
            cm.options.lineWrapping ? (cm.display.wrapper.className += " CodeMirror-wrap", cm.display.sizer.style.minWidth = "") : (cm.display.wrapper.className = cm.display.wrapper.className.replace(" CodeMirror-wrap", ""), computeMaxLength(cm)), estimateLineHeights(cm), regChange(cm), clearCaches(cm), setTimeout(function() {
                updateScrollbars(cm)
            }, 100)
        }

        function estimateHeight(cm) {
            var th = textHeight(cm.display),
                wrapping = cm.options.lineWrapping,
                perLine = wrapping && Math.max(5, cm.display.scroller.clientWidth / charWidth(cm.display) - 3);
            return function(line) {
                return lineIsHidden(cm.doc, line) ? 0 : wrapping ? (Math.ceil(line.text.length / perLine) || 1) * th : th
            }
        }

        function estimateLineHeights(cm) {
            var doc = cm.doc,
                est = estimateHeight(cm);
            doc.iter(function(line) {
                var estHeight = est(line);
                estHeight != line.height && updateLineHeight(line, estHeight)
            })
        }

        function keyMapChanged(cm) {
            var map = keyMap[cm.options.keyMap],
                style = map.style;
            cm.display.wrapper.className = cm.display.wrapper.className.replace(/\s*cm-keymap-\S+/g, "") + (style ? " cm-keymap-" + style : ""), cm.state.disableInput = map.disableInput
        }

        function themeChanged(cm) {
            cm.display.wrapper.className = cm.display.wrapper.className.replace(/\s*cm-s-\S+/g, "") + cm.options.theme.replace(/(^|\s)\s*/g, " cm-s-"), clearCaches(cm)
        }

        function guttersChanged(cm) {
            updateGutters(cm), regChange(cm), setTimeout(function() {
                alignHorizontally(cm)
            }, 20)
        }

        function updateGutters(cm) {
            var gutters = cm.display.gutters,
                specs = cm.options.gutters;
            removeChildren(gutters);
            for (var i = 0; i < specs.length; ++i) {
                var gutterClass = specs[i],
                    gElt = gutters.appendChild(elt("div", null, "CodeMirror-gutter " + gutterClass));
                "CodeMirror-linenumbers" == gutterClass && (cm.display.lineGutter = gElt, gElt.style.width = (cm.display.lineNumWidth || 1) + "px")
            }
            gutters.style.display = i ? "" : "none"
        }

        function lineLength(doc, line) {
            if (0 == line.height) return 0;
            for (var merged, len = line.text.length, cur = line; merged = collapsedSpanAtStart(cur);) {
                var found = merged.find();
                cur = getLine(doc, found.from.line), len += found.from.ch - found.to.ch
            }
            for (cur = line; merged = collapsedSpanAtEnd(cur);) {
                var found = merged.find();
                len -= cur.text.length - found.from.ch, cur = getLine(doc, found.to.line), len += cur.text.length - found.to.ch
            }
            return len
        }

        function computeMaxLength(cm) {
            var d = cm.display,
                doc = cm.doc;
            d.maxLine = getLine(doc, doc.first), d.maxLineLength = lineLength(doc, d.maxLine), d.maxLineChanged = !0, doc.iter(function(line) {
                var len = lineLength(doc, line);
                len > d.maxLineLength && (d.maxLineLength = len, d.maxLine = line)
            })
        }

        function setGuttersForLineNumbers(options) {
            for (var found = !1, i = 0; i < options.gutters.length; ++i) "CodeMirror-linenumbers" == options.gutters[i] && (options.lineNumbers ? found = !0 : options.gutters.splice(i--, 1));
            !found && options.lineNumbers && options.gutters.push("CodeMirror-linenumbers")
        }

        function updateScrollbars(cm) {
            var d = cm.display,
                docHeight = cm.doc.height,
                totalHeight = docHeight + paddingVert(d);
            d.sizer.style.minHeight = d.heightForcer.style.top = totalHeight + "px", d.gutters.style.height = Math.max(totalHeight, d.scroller.clientHeight - scrollerCutOff) + "px";
            var scrollHeight = Math.max(totalHeight, d.scroller.scrollHeight),
                needsH = d.scroller.scrollWidth > d.scroller.clientWidth + 1,
                needsV = scrollHeight > d.scroller.clientHeight + 1;
            needsV ? (d.scrollbarV.style.display = "block", d.scrollbarV.style.bottom = needsH ? scrollbarWidth(d.measure) + "px" : "0", d.scrollbarV.firstChild.style.height = scrollHeight - d.scroller.clientHeight + d.scrollbarV.clientHeight + "px") : (d.scrollbarV.style.display = "", d.scrollbarV.firstChild.style.height = "0"), needsH ? (d.scrollbarH.style.display = "block", d.scrollbarH.style.right = needsV ? scrollbarWidth(d.measure) + "px" : "0", d.scrollbarH.firstChild.style.width = d.scroller.scrollWidth - d.scroller.clientWidth + d.scrollbarH.clientWidth + "px") : (d.scrollbarH.style.display = "", d.scrollbarH.firstChild.style.width = "0"), needsH && needsV ? (d.scrollbarFiller.style.display = "block", d.scrollbarFiller.style.height = d.scrollbarFiller.style.width = scrollbarWidth(d.measure) + "px") : d.scrollbarFiller.style.display = "", needsH && cm.options.coverGutterNextToScrollbar && cm.options.fixedGutter ? (d.gutterFiller.style.display = "block", d.gutterFiller.style.height = scrollbarWidth(d.measure) + "px", d.gutterFiller.style.width = d.gutters.offsetWidth + "px") : d.gutterFiller.style.display = "", mac_geLion && 0 === scrollbarWidth(d.measure) && (d.scrollbarV.style.minWidth = d.scrollbarH.style.minHeight = mac_geMountainLion ? "18px" : "12px")
        }

        function visibleLines(display, doc, viewPort) {
            var top = display.scroller.scrollTop,
                height = display.wrapper.clientHeight;
            "number" == typeof viewPort ? top = viewPort : viewPort && (top = viewPort.top, height = viewPort.bottom - viewPort.top), top = Math.floor(top - paddingTop(display));
            var bottom = Math.ceil(top + height);
            return {
                from: lineAtHeight(doc, top),
                to: lineAtHeight(doc, bottom)
            }
        }

        function alignHorizontally(cm) {
            var display = cm.display;
            if (display.alignWidgets || display.gutters.firstChild && cm.options.fixedGutter) {
                for (var comp = compensateForHScroll(display) - display.scroller.scrollLeft + cm.doc.scrollLeft, gutterW = display.gutters.offsetWidth, l = comp + "px", n = display.lineDiv.firstChild; n; n = n.nextSibling)
                    if (n.alignable)
                        for (var i = 0, a = n.alignable; i < a.length; ++i) a[i].style.left = l;
                cm.options.fixedGutter && (display.gutters.style.left = comp + gutterW + "px")
            }
        }

        function maybeUpdateLineNumberWidth(cm) {
            if (!cm.options.lineNumbers) return !1;
            var doc = cm.doc,
                last = lineNumberFor(cm.options, doc.first + doc.size - 1),
                display = cm.display;
            if (last.length != display.lineNumChars) {
                var test = display.measure.appendChild(elt("div", [elt("div", last)], "CodeMirror-linenumber CodeMirror-gutter-elt")),
                    innerW = test.firstChild.offsetWidth,
                    padding = test.offsetWidth - innerW;
                return display.lineGutter.style.width = "", display.lineNumInnerWidth = Math.max(innerW, display.lineGutter.offsetWidth - padding), display.lineNumWidth = display.lineNumInnerWidth + padding, display.lineNumChars = display.lineNumInnerWidth ? last.length : -1, display.lineGutter.style.width = display.lineNumWidth + "px", !0
            }
            return !1
        }

        function lineNumberFor(options, i) {
            return String(options.lineNumberFormatter(i + options.firstLineNumber))
        }

        function compensateForHScroll(display) {
            return getRect(display.scroller).left - getRect(display.sizer).left
        }

        function updateDisplay(cm, changes, viewPort, forced) {
            for (var updated, oldFrom = cm.display.showingFrom, oldTo = cm.display.showingTo, visible = visibleLines(cm.display, cm.doc, viewPort); updateDisplayInner(cm, changes, visible, forced) && (forced = !1, updated = !0, updateSelection(cm), updateScrollbars(cm), viewPort && (viewPort = Math.min(cm.display.scroller.scrollHeight - cm.display.scroller.clientHeight, "number" == typeof viewPort ? viewPort : viewPort.top)), visible = visibleLines(cm.display, cm.doc, viewPort), !(visible.from >= cm.display.showingFrom && visible.to <= cm.display.showingTo));) changes = [];
            return updated && (signalLater(cm, "update", cm), cm.display.showingFrom == oldFrom && cm.display.showingTo == oldTo || signalLater(cm, "viewportChange", cm, cm.display.showingFrom, cm.display.showingTo)), updated
        }

        function updateDisplayInner(cm, changes, visible, forced) {
            var display = cm.display,
                doc = cm.doc;
            if (!display.wrapper.clientWidth) return display.showingFrom = display.showingTo = doc.first, void(display.viewOffset = 0);
            if (!(!forced && 0 == changes.length && visible.from > display.showingFrom && visible.to < display.showingTo)) {
                maybeUpdateLineNumberWidth(cm) && (changes = [{
                    from: doc.first,
                    to: doc.first + doc.size
                }]);
                var gutterW = display.sizer.style.marginLeft = display.gutters.offsetWidth + "px";
                display.scrollbarH.style.left = cm.options.fixedGutter ? gutterW : "0";
                var positionsChangedFrom = 1 / 0;
                if (cm.options.lineNumbers)
                    for (var i = 0; i < changes.length; ++i) changes[i].diff && changes[i].from < positionsChangedFrom && (positionsChangedFrom = changes[i].from);
                var end = doc.first + doc.size,
                    from = Math.max(visible.from - cm.options.viewportMargin, doc.first),
                    to = Math.min(end, visible.to + cm.options.viewportMargin);
                if (display.showingFrom < from && from - display.showingFrom < 20 && (from = Math.max(doc.first, display.showingFrom)), display.showingTo > to && display.showingTo - to < 20 && (to = Math.min(end, display.showingTo)), sawCollapsedSpans)
                    for (from = lineNo(visualLine(doc, getLine(doc, from))); to < end && lineIsHidden(doc, getLine(doc, to));) ++to;
                var intact = [{
                    from: Math.max(display.showingFrom, doc.first),
                    to: Math.min(display.showingTo, end)
                }];
                if (intact = intact[0].from >= intact[0].to ? [] : computeIntact(intact, changes), sawCollapsedSpans)
                    for (var i = 0; i < intact.length; ++i)
                        for (var merged, range = intact[i]; merged = collapsedSpanAtEnd(getLine(doc, range.to - 1));) {
                            var newTo = merged.find().from.line;
                            if (!(newTo > range.from)) {
                                intact.splice(i--, 1);
                                break
                            }
                            range.to = newTo
                        }
                for (var intactLines = 0, i = 0; i < intact.length; ++i) {
                    var range = intact[i];
                    range.from < from && (range.from = from), range.to > to && (range.to = to), range.from >= range.to ? intact.splice(i--, 1) : intactLines += range.to - range.from
                }
                if (!forced && intactLines == to - from && from == display.showingFrom && to == display.showingTo) return void updateViewOffset(cm);
                intact.sort(function(a, b) {
                    return a.from - b.from
                });
                try {
                    var focused = document.activeElement
                } catch (e) {}
                intactLines < .7 * (to - from) && (display.lineDiv.style.display = "none"), patchDisplay(cm, from, to, intact, positionsChangedFrom), display.lineDiv.style.display = "", focused && document.activeElement != focused && focused.offsetHeight && focused.focus();
                var different = from != display.showingFrom || to != display.showingTo || display.lastSizeC != display.wrapper.clientHeight;
                return different && (display.lastSizeC = display.wrapper.clientHeight, startWorker(cm, 400)), display.showingFrom = from, display.showingTo = to, updateHeightsInViewport(cm), updateViewOffset(cm), !0
            }
        }

        function updateHeightsInViewport(cm) {
            for (var height, display = cm.display, prevBottom = display.lineDiv.offsetTop, node = display.lineDiv.firstChild; node; node = node.nextSibling)
                if (node.lineObj) {
                    if (ie_lt8) {
                        var bot = node.offsetTop + node.offsetHeight;
                        height = bot - prevBottom, prevBottom = bot
                    } else {
                        var box = getRect(node);
                        height = box.bottom - box.top
                    }
                    var diff = node.lineObj.height - height;
                    if (height < 2 && (height = textHeight(display)), diff > .001 || diff < -.001) {
                        updateLineHeight(node.lineObj, height);
                        var widgets = node.lineObj.widgets;
                        if (widgets)
                            for (var i = 0; i < widgets.length; ++i) widgets[i].height = widgets[i].node.offsetHeight
                    }
                }
        }

        function updateViewOffset(cm) {
            var off = cm.display.viewOffset = heightAtLine(cm, getLine(cm.doc, cm.display.showingFrom));
            cm.display.mover.style.top = off + "px"
        }

        function computeIntact(intact, changes) {
            for (var i = 0, l = changes.length || 0; i < l; ++i) {
                for (var change = changes[i], intact2 = [], diff = change.diff || 0, j = 0, l2 = intact.length; j < l2; ++j) {
                    var range = intact[j];
                    change.to <= range.from && change.diff ? intact2.push({
                        from: range.from + diff,
                        to: range.to + diff
                    }) : change.to <= range.from || change.from >= range.to ? intact2.push(range) : (change.from > range.from && intact2.push({
                        from: range.from,
                        to: change.from
                    }), change.to < range.to && intact2.push({
                        from: change.to + diff,
                        to: range.to + diff
                    }))
                }
                intact = intact2
            }
            return intact
        }

        function getDimensions(cm) {
            for (var d = cm.display, left = {}, width = {}, n = d.gutters.firstChild, i = 0; n; n = n.nextSibling, ++i) left[cm.options.gutters[i]] = n.offsetLeft, width[cm.options.gutters[i]] = n.offsetWidth;
            return {
                fixedPos: compensateForHScroll(d),
                gutterTotalWidth: d.gutters.offsetWidth,
                gutterLeft: left,
                gutterWidth: width,
                wrapperWidth: d.wrapper.clientWidth
            }
        }

        function patchDisplay(cm, from, to, intact, updateNumbersFrom) {
            function rm(node) {
                var next = node.nextSibling;
                return webkit && mac && cm.display.currentWheelTarget == node ? (node.style.display = "none", node.lineObj = null) : node.parentNode.removeChild(node), next
            }
            var dims = getDimensions(cm),
                display = cm.display,
                lineNumbers = cm.options.lineNumbers;
            intact.length || webkit && cm.display.currentWheelTarget || removeChildren(display.lineDiv);
            var container = display.lineDiv,
                cur = container.firstChild,
                nextIntact = intact.shift(),
                lineN = from;
            for (cm.doc.iter(from, to, function(line) {
                    if (nextIntact && nextIntact.to == lineN && (nextIntact = intact.shift()), lineIsHidden(cm.doc, line)) {
                        if (0 != line.height && updateLineHeight(line, 0), line.widgets && cur && cur.previousSibling)
                            for (var i = 0; i < line.widgets.length; ++i) {
                                var w = line.widgets[i];
                                if (w.showIfHidden) {
                                    var prev = cur.previousSibling;
                                    if (/pre/i.test(prev.nodeName)) {
                                        var wrap = elt("div", null, null, "position: relative");
                                        prev.parentNode.replaceChild(wrap, prev), wrap.appendChild(prev), prev = wrap
                                    }
                                    var wnode = prev.appendChild(elt("div", [w.node], "CodeMirror-linewidget"));
                                    w.handleMouseEvents || (wnode.ignoreEvents = !0), positionLineWidget(w, wnode, prev, dims)
                                }
                            }
                    } else if (nextIntact && nextIntact.from <= lineN && nextIntact.to > lineN) {
                        for (; cur.lineObj != line;) cur = rm(cur);
                        lineNumbers && updateNumbersFrom <= lineN && cur.lineNumber && setTextContent(cur.lineNumber, lineNumberFor(cm.options, lineN)), cur = cur.nextSibling
                    } else {
                        if (line.widgets)
                            for (var reuse, j = 0, search = cur; search && j < 20; ++j, search = search.nextSibling)
                                if (search.lineObj == line && /div/i.test(search.nodeName)) {
                                    reuse = search;
                                    break
                                }
                        var lineNode = buildLineElement(cm, line, lineN, dims, reuse);
                        if (lineNode != reuse) container.insertBefore(lineNode, cur);
                        else {
                            for (; cur != reuse;) cur = rm(cur);
                            cur = cur.nextSibling
                        }
                        lineNode.lineObj = line
                    }++lineN
                }); cur;) cur = rm(cur)
        }

        function buildLineElement(cm, line, lineNo, dims, reuse) {
            var wrap, lineElement = lineContent(cm, line),
                markers = line.gutterMarkers,
                display = cm.display;
            if (!(cm.options.lineNumbers || markers || line.bgClass || line.wrapClass || line.widgets)) return lineElement;
            if (reuse) {
                reuse.alignable = null;
                for (var next, isOk = !0, widgetsSeen = 0, insertBefore = null, n = reuse.firstChild; n; n = next)
                    if (next = n.nextSibling, /\bCodeMirror-linewidget\b/.test(n.className)) {
                        for (var i = 0; i < line.widgets.length; ++i) {
                            var widget = line.widgets[i];
                            if (widget.node == n.firstChild) {
                                widget.above || insertBefore || (insertBefore = n), positionLineWidget(widget, n, reuse, dims), ++widgetsSeen;
                                break
                            }
                        }
                        if (i == line.widgets.length) {
                            isOk = !1;
                            break
                        }
                    } else reuse.removeChild(n);
                reuse.insertBefore(lineElement, insertBefore), isOk && widgetsSeen == line.widgets.length && (wrap = reuse, reuse.className = line.wrapClass || "")
            }
            if (wrap || (wrap = elt("div", null, line.wrapClass, "position: relative"), wrap.appendChild(lineElement)), line.bgClass && wrap.insertBefore(elt("div", null, line.bgClass + " CodeMirror-linebackground"), wrap.firstChild), cm.options.lineNumbers || markers) {
                var gutterWrap = wrap.insertBefore(elt("div", null, null, "position: absolute; left: " + (cm.options.fixedGutter ? dims.fixedPos : -dims.gutterTotalWidth) + "px"), wrap.firstChild);
                if (cm.options.fixedGutter && (wrap.alignable || (wrap.alignable = [])).push(gutterWrap), !cm.options.lineNumbers || markers && markers["CodeMirror-linenumbers"] || (wrap.lineNumber = gutterWrap.appendChild(elt("div", lineNumberFor(cm.options, lineNo), "CodeMirror-linenumber CodeMirror-gutter-elt", "left: " + dims.gutterLeft["CodeMirror-linenumbers"] + "px; width: " + display.lineNumInnerWidth + "px"))), markers)
                    for (var k = 0; k < cm.options.gutters.length; ++k) {
                        var id = cm.options.gutters[k],
                            found = markers.hasOwnProperty(id) && markers[id];
                        found && gutterWrap.appendChild(elt("div", [found], "CodeMirror-gutter-elt", "left: " + dims.gutterLeft[id] + "px; width: " + dims.gutterWidth[id] + "px"))
                    }
            }
            if (ie_lt8 && (wrap.style.zIndex = 2), line.widgets && wrap != reuse)
                for (var i = 0, ws = line.widgets; i < ws.length; ++i) {
                    var widget = ws[i],
                        node = elt("div", [widget.node], "CodeMirror-linewidget");
                    widget.handleMouseEvents || (node.ignoreEvents = !0), positionLineWidget(widget, node, wrap, dims), widget.above ? wrap.insertBefore(node, cm.options.lineNumbers && 0 != line.height ? gutterWrap : lineElement) : wrap.appendChild(node), signalLater(widget, "redraw")
                }
            return wrap
        }

        function positionLineWidget(widget, node, wrap, dims) {
            if (widget.noHScroll) {
                (wrap.alignable || (wrap.alignable = [])).push(node);
                var width = dims.wrapperWidth;
                node.style.left = dims.fixedPos + "px", widget.coverGutter || (width -= dims.gutterTotalWidth, node.style.paddingLeft = dims.gutterTotalWidth + "px"), node.style.width = width + "px"
            }
            widget.coverGutter && (node.style.zIndex = 5, node.style.position = "relative", widget.noHScroll || (node.style.marginLeft = -dims.gutterTotalWidth + "px"))
        }

        function updateSelection(cm) {
            var display = cm.display,
                collapsed = posEq(cm.doc.sel.from, cm.doc.sel.to);
            if (collapsed || cm.options.showCursorWhenSelecting ? updateSelectionCursor(cm) : display.cursor.style.display = display.otherCursor.style.display = "none", collapsed ? display.selectionDiv.style.display = "none" : updateSelectionRange(cm), cm.options.moveInputWithCursor) {
                var headPos = cursorCoords(cm, cm.doc.sel.head, "div"),
                    wrapOff = getRect(display.wrapper),
                    lineOff = getRect(display.lineDiv);
                display.inputDiv.style.top = Math.max(0, Math.min(display.wrapper.clientHeight - 10, headPos.top + lineOff.top - wrapOff.top)) + "px", display.inputDiv.style.left = Math.max(0, Math.min(display.wrapper.clientWidth - 10, headPos.left + lineOff.left - wrapOff.left)) + "px"
            }
        }

        function updateSelectionCursor(cm) {
            var display = cm.display,
                pos = cursorCoords(cm, cm.doc.sel.head, "div");
            display.cursor.style.left = pos.left + "px", display.cursor.style.top = pos.top + "px", display.cursor.style.height = Math.max(0, pos.bottom - pos.top) * cm.options.cursorHeight + "px", display.cursor.style.display = "", pos.other ? (display.otherCursor.style.display = "", display.otherCursor.style.left = pos.other.left + "px", display.otherCursor.style.top = pos.other.top + "px", display.otherCursor.style.height = .85 * (pos.other.bottom - pos.other.top) + "px") : display.otherCursor.style.display = "none"
        }

        function updateSelectionRange(cm) {
            function add(left, top, width, bottom) {
                top < 0 && (top = 0), fragment.appendChild(elt("div", null, "CodeMirror-selected", "position: absolute; left: " + left + "px; top: " + top + "px; width: " + (null == width ? clientWidth - left : width) + "px; height: " + (bottom - top) + "px"))
            }

            function drawForLine(line, fromArg, toArg) {
                function coords(ch, bias) {
                    return charCoords(cm, Pos(line, ch), "div", lineObj, bias)
                }
                var start, end, lineObj = getLine(doc, line),
                    lineLen = lineObj.text.length;
                return iterateBidiSections(getOrder(lineObj), fromArg || 0, null == toArg ? lineLen : toArg, function(from, to, dir) {
                    var rightPos, left, right, leftPos = coords(from, "left");
                    if (from == to) rightPos = leftPos, left = right = leftPos.left;
                    else {
                        if (rightPos = coords(to - 1, "right"), "rtl" == dir) {
                            var tmp = leftPos;
                            leftPos = rightPos, rightPos = tmp
                        }
                        left = leftPos.left, right = rightPos.right
                    }
                    null == fromArg && 0 == from && (left = pl), rightPos.top - leftPos.top > 3 && (add(left, leftPos.top, null, leftPos.bottom), left = pl, leftPos.bottom < rightPos.top && add(left, leftPos.bottom, null, rightPos.top)), null == toArg && to == lineLen && (right = clientWidth), (!start || leftPos.top < start.top || leftPos.top == start.top && leftPos.left < start.left) && (start = leftPos), (!end || rightPos.bottom > end.bottom || rightPos.bottom == end.bottom && rightPos.right > end.right) && (end = rightPos), left < pl + 1 && (left = pl), add(left, rightPos.top, right - left, rightPos.bottom)
                }), {
                    start: start,
                    end: end
                }
            }
            var display = cm.display,
                doc = cm.doc,
                sel = cm.doc.sel,
                fragment = document.createDocumentFragment(),
                clientWidth = display.lineSpace.offsetWidth,
                pl = paddingLeft(cm.display);
            if (sel.from.line == sel.to.line) drawForLine(sel.from.line, sel.from.ch, sel.to.ch);
            else {
                var fromLine = getLine(doc, sel.from.line),
                    toLine = getLine(doc, sel.to.line),
                    singleVLine = visualLine(doc, fromLine) == visualLine(doc, toLine),
                    leftEnd = drawForLine(sel.from.line, sel.from.ch, singleVLine ? fromLine.text.length : null).end,
                    rightStart = drawForLine(sel.to.line, singleVLine ? 0 : null, sel.to.ch).start;
                singleVLine && (leftEnd.top < rightStart.top - 2 ? (add(leftEnd.right, leftEnd.top, null, leftEnd.bottom), add(pl, rightStart.top, rightStart.left, rightStart.bottom)) : add(leftEnd.right, leftEnd.top, rightStart.left - leftEnd.right, leftEnd.bottom)), leftEnd.bottom < rightStart.top && add(pl, leftEnd.bottom, null, rightStart.top)
            }
            removeChildrenAndAdd(display.selectionDiv, fragment), display.selectionDiv.style.display = ""
        }

        function restartBlink(cm) {
            if (cm.state.focused) {
                var display = cm.display;
                clearInterval(display.blinker);
                var on = !0;
                display.cursor.style.visibility = display.otherCursor.style.visibility = "", cm.options.cursorBlinkRate > 0 && (display.blinker = setInterval(function() {
                    display.cursor.style.visibility = display.otherCursor.style.visibility = (on = !on) ? "" : "hidden"
                }, cm.options.cursorBlinkRate))
            }
        }

        function startWorker(cm, time) {
            cm.doc.mode.startState && cm.doc.frontier < cm.display.showingTo && cm.state.highlight.set(time, bind(highlightWorker, cm))
        }

        function highlightWorker(cm) {
            var doc = cm.doc;
            if (doc.frontier < doc.first && (doc.frontier = doc.first), !(doc.frontier >= cm.display.showingTo)) {
                var prevChange, end = +new Date + cm.options.workTime,
                    state = copyState(doc.mode, getStateBefore(cm, doc.frontier)),
                    changed = [];
                doc.iter(doc.frontier, Math.min(doc.first + doc.size, cm.display.showingTo + 500), function(line) {
                    if (doc.frontier >= cm.display.showingFrom) {
                        var oldStyles = line.styles;
                        line.styles = highlightLine(cm, line, state);
                        for (var ischange = !oldStyles || oldStyles.length != line.styles.length, i = 0; !ischange && i < oldStyles.length; ++i) ischange = oldStyles[i] != line.styles[i];
                        ischange && (prevChange && prevChange.end == doc.frontier ? prevChange.end++ : changed.push(prevChange = {
                            start: doc.frontier,
                            end: doc.frontier + 1
                        })), line.stateAfter = copyState(doc.mode, state)
                    } else processLine(cm, line, state), line.stateAfter = doc.frontier % 5 == 0 ? copyState(doc.mode, state) : null;
                    if (++doc.frontier, +new Date > end) return startWorker(cm, cm.options.workDelay), !0
                }), changed.length && operation(cm, function() {
                    for (var i = 0; i < changed.length; ++i) regChange(this, changed[i].start, changed[i].end)
                })()
            }
        }

        function findStartLine(cm, n, precise) {
            for (var minindent, minline, doc = cm.doc, maxScan = cm.doc.mode.innerMode ? 1e3 : 100, search = n, lim = n - maxScan; search > lim; --search) {
                if (search <= doc.first) return doc.first;
                var line = getLine(doc, search - 1);
                if (line.stateAfter && (!precise || search <= doc.frontier)) return search;
                var indented = countColumn(line.text, null, cm.options.tabSize);
                (null == minline || minindent > indented) && (minline = search - 1, minindent = indented)
            }
            return minline
        }

        function getStateBefore(cm, n, precise) {
            var doc = cm.doc,
                display = cm.display;
            if (!doc.mode.startState) return !0;
            var pos = findStartLine(cm, n, precise),
                state = pos > doc.first && getLine(doc, pos - 1).stateAfter;
            return state = state ? copyState(doc.mode, state) : startState(doc.mode), doc.iter(pos, n, function(line) {
                processLine(cm, line, state);
                var save = pos == n - 1 || pos % 5 == 0 || pos >= display.showingFrom && pos < display.showingTo;
                line.stateAfter = save ? copyState(doc.mode, state) : null, ++pos
            }), state
        }

        function paddingTop(display) {
            return display.lineSpace.offsetTop
        }

        function paddingVert(display) {
            return display.mover.offsetHeight - display.lineSpace.offsetHeight
        }

        function paddingLeft(display) {
            var e = removeChildrenAndAdd(display.measure, elt("pre", null, null, "text-align: left")).appendChild(elt("span", "x"));
            return e.offsetLeft
        }

        function measureChar(cm, line, ch, data, bias) {
            var dir = -1;
            data = data || measureLine(cm, line);
            for (var pos = ch;; pos += dir) {
                var r = data[pos];
                if (r) break;
                dir < 0 && 0 == pos && (dir = 1)
            }
            return bias = pos > ch ? "left" : pos < ch ? "right" : bias, "left" == bias && r.leftSide ? r = r.leftSide : "right" == bias && r.rightSide && (r = r.rightSide), {
                left: pos < ch ? r.right : r.left,
                right: pos > ch ? r.left : r.right,
                top: r.top,
                bottom: r.bottom
            }
        }

        function findCachedMeasurement(cm, line) {
            for (var cache = cm.display.measureLineCache, i = 0; i < cache.length; ++i) {
                var memo = cache[i];
                if (memo.text == line.text && memo.markedSpans == line.markedSpans && cm.display.scroller.clientWidth == memo.width && memo.classes == line.textClass + "|" + line.bgClass + "|" + line.wrapClass) return memo
            }
        }

        function clearCachedMeasurement(cm, line) {
            var exists = findCachedMeasurement(cm, line);
            exists && (exists.text = exists.measure = exists.markedSpans = null)
        }

        function measureLine(cm, line) {
            var cached = findCachedMeasurement(cm, line);
            if (cached) return cached.measure;
            var measure = measureLineInner(cm, line),
                cache = cm.display.measureLineCache,
                memo = {
                    text: line.text,
                    width: cm.display.scroller.clientWidth,
                    markedSpans: line.markedSpans,
                    measure: measure,
                    classes: line.textClass + "|" + line.bgClass + "|" + line.wrapClass
                };
            return 16 == cache.length ? cache[++cm.display.measureLineCachePos % 16] = memo : cache.push(memo), measure
        }

        function measureLineInner(cm, line) {
            function measureRect(rect) {
                var top = rect.top - outer.top,
                    bot = rect.bottom - outer.top;
                bot > maxBot && (bot = maxBot), top < 0 && (top = 0);
                for (var i = vranges.length - 2; i >= 0; i -= 2) {
                    var rtop = vranges[i],
                        rbot = vranges[i + 1];
                    if (!(rtop > bot || rbot < top) && (rtop <= top && rbot >= bot || top <= rtop && bot >= rbot || Math.min(bot, rbot) - Math.max(top, rtop) >= bot - top >> 1)) {
                        vranges[i] = Math.min(top, rtop), vranges[i + 1] = Math.max(bot, rbot);
                        break
                    }
                }
                return i < 0 && (i = vranges.length, vranges.push(top, bot)), {
                    left: rect.left - outer.left,
                    right: rect.right - outer.left,
                    top: i,
                    bottom: null
                }
            }

            function finishRect(rect) {
                rect.bottom = vranges[rect.top + 1], rect.top = vranges[rect.top]
            }
            var display = cm.display,
                measure = emptyArray(line.text.length),
                pre = lineContent(cm, line, measure, !0);
            if (ie && !ie_lt8 && !cm.options.lineWrapping && pre.childNodes.length > 100) {
                for (var fragment = document.createDocumentFragment(), chunk = 10, n = pre.childNodes.length, i = 0, chunks = Math.ceil(n / chunk); i < chunks; ++i) {
                    for (var wrap = elt("div", null, null, "display: inline-block"), j = 0; j < chunk && n; ++j) wrap.appendChild(pre.firstChild), --n;
                    fragment.appendChild(wrap)
                }
                pre.appendChild(fragment)
            }
            removeChildrenAndAdd(display.measure, pre);
            var outer = getRect(display.lineDiv),
                vranges = [],
                data = emptyArray(line.text.length),
                maxBot = pre.offsetHeight;
            ie_lt9 && display.measure.first != pre && removeChildrenAndAdd(display.measure, pre);
            for (var cur, i = 0; i < measure.length; ++i)
                if (cur = measure[i]) {
                    var node = cur,
                        rect = null;
                    if (/\bCodeMirror-widget\b/.test(cur.className) && cur.getClientRects) {
                        1 == cur.firstChild.nodeType && (node = cur.firstChild);
                        var rects = node.getClientRects();
                        rects.length > 1 && (rect = data[i] = measureRect(rects[0]), rect.rightSide = measureRect(rects[rects.length - 1]))
                    }
                    rect || (rect = data[i] = measureRect(getRect(node))), cur.measureRight && (rect.right = getRect(cur.measureRight).left), cur.leftSide && (rect.leftSide = measureRect(getRect(cur.leftSide)))
                }
            removeChildren(cm.display.measure);
            for (var cur, i = 0; i < data.length; ++i)(cur = data[i]) && (finishRect(cur), cur.leftSide && finishRect(cur.leftSide), cur.rightSide && finishRect(cur.rightSide));
            return data
        }

        function measureLineWidth(cm, line) {
            var hasBadSpan = !1;
            if (line.markedSpans)
                for (var i = 0; i < line.markedSpans; ++i) {
                    var sp = line.markedSpans[i];
                    !sp.collapsed || null != sp.to && sp.to != line.text.length || (hasBadSpan = !0)
                }
            var cached = !hasBadSpan && findCachedMeasurement(cm, line);
            if (cached) return measureChar(cm, line, line.text.length, cached.measure, "right").right;
            var pre = lineContent(cm, line, null, !0),
                end = pre.appendChild(zeroWidthElement(cm.display.measure));
            return removeChildrenAndAdd(cm.display.measure, pre), getRect(end).right - getRect(cm.display.lineDiv).left
        }

        function clearCaches(cm) {
            cm.display.measureLineCache.length = cm.display.measureLineCachePos = 0, cm.display.cachedCharWidth = cm.display.cachedTextHeight = null, cm.options.lineWrapping || (cm.display.maxLineChanged = !0), cm.display.lineNumChars = null
        }

        function pageScrollX() {
            return window.pageXOffset || (document.documentElement || document.body).scrollLeft
        }

        function pageScrollY() {
            return window.pageYOffset || (document.documentElement || document.body).scrollTop
        }

        function intoCoordSystem(cm, lineObj, rect, context) {
            if (lineObj.widgets)
                for (var i = 0; i < lineObj.widgets.length; ++i)
                    if (lineObj.widgets[i].above) {
                        var size = widgetHeight(lineObj.widgets[i]);
                        rect.top += size, rect.bottom += size
                    }
            if ("line" == context) return rect;
            context || (context = "local");
            var yOff = heightAtLine(cm, lineObj);
            if ("local" == context ? yOff += paddingTop(cm.display) : yOff -= cm.display.viewOffset, "page" == context || "window" == context) {
                var lOff = getRect(cm.display.lineSpace);
                yOff += lOff.top + ("window" == context ? 0 : pageScrollY());
                var xOff = lOff.left + ("window" == context ? 0 : pageScrollX());
                rect.left += xOff, rect.right += xOff
            }
            return rect.top += yOff, rect.bottom += yOff, rect
        }

        function fromCoordSystem(cm, coords, context) {
            if ("div" == context) return coords;
            var left = coords.left,
                top = coords.top;
            if ("page" == context) left -= pageScrollX(), top -= pageScrollY();
            else if ("local" == context || !context) {
                var localBox = getRect(cm.display.sizer);
                left += localBox.left, top += localBox.top
            }
            var lineSpaceBox = getRect(cm.display.lineSpace);
            return {
                left: left - lineSpaceBox.left,
                top: top - lineSpaceBox.top
            }
        }

        function charCoords(cm, pos, context, lineObj, bias) {
            return lineObj || (lineObj = getLine(cm.doc, pos.line)), intoCoordSystem(cm, lineObj, measureChar(cm, lineObj, pos.ch, null, bias), context)
        }

        function cursorCoords(cm, pos, context, lineObj, measurement) {
            function get(ch, right) {
                var m = measureChar(cm, lineObj, ch, measurement, right ? "right" : "left");
                return right ? m.left = m.right : m.right = m.left, intoCoordSystem(cm, lineObj, m, context)
            }

            function getBidi(ch, partPos) {
                var part = order[partPos],
                    right = part.level % 2;
                return ch == bidiLeft(part) && partPos && part.level < order[partPos - 1].level ? (part = order[--partPos], ch = bidiRight(part) - (part.level % 2 ? 0 : 1), right = !0) : ch == bidiRight(part) && partPos < order.length - 1 && part.level < order[partPos + 1].level && (part = order[++partPos], ch = bidiLeft(part) - part.level % 2, right = !1), right && ch == part.to && ch > part.from ? get(ch - 1) : get(ch, right)
            }
            lineObj = lineObj || getLine(cm.doc, pos.line), measurement || (measurement = measureLine(cm, lineObj));
            var order = getOrder(lineObj),
                ch = pos.ch;
            if (!order) return get(ch);
            var partPos = getBidiPartAt(order, ch),
                val = getBidi(ch, partPos);
            return null != bidiOther && (val.other = getBidi(ch, bidiOther)), val
        }

        function PosWithInfo(line, ch, outside, xRel) {
            var pos = new Pos(line, ch);
            return pos.xRel = xRel, outside && (pos.outside = !0), pos
        }

        function coordsChar(cm, x, y) {
            var doc = cm.doc;
            if (y += cm.display.viewOffset, y < 0) return PosWithInfo(doc.first, 0, !0, -1);
            var lineNo = lineAtHeight(doc, y),
                last = doc.first + doc.size - 1;
            if (lineNo > last) return PosWithInfo(doc.first + doc.size - 1, getLine(doc, last).text.length, !0, 1);
            for (x < 0 && (x = 0);;) {
                var lineObj = getLine(doc, lineNo),
                    found = coordsCharInner(cm, lineObj, lineNo, x, y),
                    merged = collapsedSpanAtEnd(lineObj),
                    mergedPos = merged && merged.find();
                if (!merged || !(found.ch > mergedPos.from.ch || found.ch == mergedPos.from.ch && found.xRel > 0)) return found;
                lineNo = mergedPos.to.line
            }
        }

        function coordsCharInner(cm, lineObj, lineNo, x, y) {
            function getX(ch) {
                var sp = cursorCoords(cm, Pos(lineNo, ch), "line", lineObj, measurement);
                return wrongLine = !0, innerOff > sp.bottom ? sp.left - adjust : innerOff < sp.top ? sp.left + adjust : (wrongLine = !1, sp.left)
            }
            var innerOff = y - heightAtLine(cm, lineObj),
                wrongLine = !1,
                adjust = 2 * cm.display.wrapper.clientWidth,
                measurement = measureLine(cm, lineObj),
                bidi = getOrder(lineObj),
                dist = lineObj.text.length,
                from = lineLeft(lineObj),
                to = lineRight(lineObj),
                fromX = getX(from),
                fromOutside = wrongLine,
                toX = getX(to),
                toOutside = wrongLine;
            if (x > toX) return PosWithInfo(lineNo, to, toOutside, 1);
            for (;;) {
                if (bidi ? to == from || to == moveVisually(lineObj, from, 1) : to - from <= 1) {
                    for (var ch = x < fromX || x - fromX <= toX - x ? from : to, xDiff = x - (ch == from ? fromX : toX); isExtendingChar.test(lineObj.text.charAt(ch));) ++ch;
                    var pos = PosWithInfo(lineNo, ch, ch == from ? fromOutside : toOutside, xDiff < 0 ? -1 : xDiff ? 1 : 0);
                    return pos
                }
                var step = Math.ceil(dist / 2),
                    middle = from + step;
                if (bidi) {
                    middle = from;
                    for (var i = 0; i < step; ++i) middle = moveVisually(lineObj, middle, 1)
                }
                var middleX = getX(middle);
                middleX > x ? (to = middle, toX = middleX, (toOutside = wrongLine) && (toX += 1e3), dist = step) : (from = middle, fromX = middleX, fromOutside = wrongLine, dist -= step)
            }
        }

        function textHeight(display) {
            if (null != display.cachedTextHeight) return display.cachedTextHeight;
            if (null == measureText) {
                measureText = elt("pre");
                for (var i = 0; i < 49; ++i) measureText.appendChild(document.createTextNode("x")), measureText.appendChild(elt("br"));
                measureText.appendChild(document.createTextNode("x"))
            }
            removeChildrenAndAdd(display.measure, measureText);
            var height = measureText.offsetHeight / 50;
            return height > 3 && (display.cachedTextHeight = height), removeChildren(display.measure), height || 1
        }

        function charWidth(display) {
            if (null != display.cachedCharWidth) return display.cachedCharWidth;
            var anchor = elt("span", "x"),
                pre = elt("pre", [anchor]);
            removeChildrenAndAdd(display.measure, pre);
            var width = anchor.offsetWidth;
            return width > 2 && (display.cachedCharWidth = width), width || 10
        }

        function startOperation(cm) {
            cm.curOp = {
                changes: [],
                forceUpdate: !1,
                updateInput: null,
                userSelChange: null,
                textChanged: null,
                selectionChanged: !1,
                cursorActivity: !1,
                updateMaxLine: !1,
                updateScrollPos: !1,
                id: ++nextOpId
            }, delayedCallbackDepth++ || (delayedCallbacks = [])
        }

        function endOperation(cm) {
            var op = cm.curOp,
                doc = cm.doc,
                display = cm.display;
            if (cm.curOp = null, op.updateMaxLine && computeMaxLength(cm), display.maxLineChanged && !cm.options.lineWrapping && display.maxLine) {
                var width = measureLineWidth(cm, display.maxLine);
                display.sizer.style.minWidth = Math.max(0, width + 3 + scrollerCutOff) + "px", display.maxLineChanged = !1;
                var maxScrollLeft = Math.max(0, display.sizer.offsetLeft + display.sizer.offsetWidth - display.scroller.clientWidth);
                maxScrollLeft < doc.scrollLeft && !op.updateScrollPos && setScrollLeft(cm, Math.min(display.scroller.scrollLeft, maxScrollLeft), !0)
            }
            var newScrollPos, updated;
            if (op.updateScrollPos) newScrollPos = op.updateScrollPos;
            else if (op.selectionChanged && display.scroller.clientHeight) {
                var coords = cursorCoords(cm, doc.sel.head);
                newScrollPos = calculateScrollPos(cm, coords.left, coords.top, coords.left, coords.bottom)
            }(op.changes.length || op.forceUpdate || newScrollPos && null != newScrollPos.scrollTop) && (updated = updateDisplay(cm, op.changes, newScrollPos && newScrollPos.scrollTop, op.forceUpdate), cm.display.scroller.offsetHeight && (cm.doc.scrollTop = cm.display.scroller.scrollTop)), !updated && op.selectionChanged && updateSelection(cm), op.updateScrollPos ? (display.scroller.scrollTop = display.scrollbarV.scrollTop = doc.scrollTop = newScrollPos.scrollTop, display.scroller.scrollLeft = display.scrollbarH.scrollLeft = doc.scrollLeft = newScrollPos.scrollLeft, alignHorizontally(cm), op.scrollToPos && scrollPosIntoView(cm, clipPos(cm.doc, op.scrollToPos), op.scrollToPosMargin)) : newScrollPos && scrollCursorIntoView(cm), op.selectionChanged && restartBlink(cm), cm.state.focused && op.updateInput && resetInput(cm, op.userSelChange);
            var hidden = op.maybeHiddenMarkers,
                unhidden = op.maybeUnhiddenMarkers;
            if (hidden)
                for (var i = 0; i < hidden.length; ++i) hidden[i].lines.length || signal(hidden[i], "hide");
            if (unhidden)
                for (var i = 0; i < unhidden.length; ++i) unhidden[i].lines.length && signal(unhidden[i], "unhide");
            var delayed;
            if (--delayedCallbackDepth || (delayed = delayedCallbacks, delayedCallbacks = null), op.textChanged && signal(cm, "change", cm, op.textChanged), op.cursorActivity && signal(cm, "cursorActivity", cm), delayed)
                for (var i = 0; i < delayed.length; ++i) delayed[i]()
        }

        function operation(cm1, f) {
            return function() {
                var cm = cm1 || this,
                    withOp = !cm.curOp;
                withOp && startOperation(cm);
                try {
                    var result = f.apply(cm, arguments)
                } finally {
                    withOp && endOperation(cm)
                }
                return result
            }
        }

        function docOperation(f) {
            return function() {
                var result, withOp = this.cm && !this.cm.curOp;
                withOp && startOperation(this.cm);
                try {
                    result = f.apply(this, arguments)
                } finally {
                    withOp && endOperation(this.cm)
                }
                return result
            }
        }

        function runInOp(cm, f) {
            var result, withOp = !cm.curOp;
            withOp && startOperation(cm);
            try {
                result = f()
            } finally {
                withOp && endOperation(cm)
            }
            return result
        }

        function regChange(cm, from, to, lendiff) {
            null == from && (from = cm.doc.first), null == to && (to = cm.doc.first + cm.doc.size), cm.curOp.changes.push({
                from: from,
                to: to,
                diff: lendiff
            })
        }

        function slowPoll(cm) {
            cm.display.pollingFast || cm.display.poll.set(cm.options.pollInterval, function() {
                readInput(cm), cm.state.focused && slowPoll(cm)
            })
        }

        function fastPoll(cm) {
            function p() {
                var changed = readInput(cm);
                changed || missed ? (cm.display.pollingFast = !1, slowPoll(cm)) : (missed = !0, cm.display.poll.set(60, p))
            }
            var missed = !1;
            cm.display.pollingFast = !0, cm.display.poll.set(20, p)
        }

        function readInput(cm) {
            var input = cm.display.input,
                prevInput = cm.display.prevInput,
                doc = cm.doc,
                sel = doc.sel;
            if (!cm.state.focused || hasSelection(input) || isReadOnly(cm) || cm.state.disableInput) return !1;
            cm.state.pasteIncoming && cm.state.fakedLastChar && (input.value = input.value.substring(0, input.value.length - 1), cm.state.fakedLastChar = !1);
            var text = input.value;
            if (text == prevInput && posEq(sel.from, sel.to)) return !1;
            if (ie && !ie_lt9 && cm.display.inputHasSelection === text) return resetInput(cm, !0), !1;
            var withOp = !cm.curOp;
            withOp && startOperation(cm), sel.shift = !1;
            for (var same = 0, l = Math.min(prevInput.length, text.length); same < l && prevInput.charCodeAt(same) == text.charCodeAt(same);) ++same;
            var from = sel.from,
                to = sel.to;
            same < prevInput.length ? from = Pos(from.line, from.ch - (prevInput.length - same)) : cm.state.overwrite && posEq(from, to) && !cm.state.pasteIncoming && (to = Pos(to.line, Math.min(getLine(doc, to.line).text.length, to.ch + (text.length - same))));
            var updateInput = cm.curOp.updateInput,
                changeEvent = {
                    from: from,
                    to: to,
                    text: splitLines(text.slice(same)),
                    origin: cm.state.pasteIncoming ? "paste" : "+input"
                };
            return makeChange(cm.doc, changeEvent, "end"), cm.curOp.updateInput = updateInput, signalLater(cm, "inputRead", cm, changeEvent), text.length > 1e3 || text.indexOf("\n") > -1 ? input.value = cm.display.prevInput = "" : cm.display.prevInput = text, withOp && endOperation(cm), cm.state.pasteIncoming = !1, !0
        }

        function resetInput(cm, user) {
            var minimal, selected, doc = cm.doc;
            if (posEq(doc.sel.from, doc.sel.to)) user && (cm.display.prevInput = cm.display.input.value = "", ie && !ie_lt9 && (cm.display.inputHasSelection = null));
            else {
                cm.display.prevInput = "", minimal = hasCopyEvent && (doc.sel.to.line - doc.sel.from.line > 100 || (selected = cm.getSelection()).length > 1e3);
                var content = minimal ? "-" : selected || cm.getSelection();
                cm.display.input.value = content, cm.state.focused && selectInput(cm.display.input), ie && !ie_lt9 && (cm.display.inputHasSelection = content)
            }
            cm.display.inaccurateSelection = minimal
        }

        function focusInput(cm) {
            "nocursor" == cm.options.readOnly || mobile && document.activeElement == cm.display.input || cm.display.input.focus()
        }

        function isReadOnly(cm) {
            return cm.options.readOnly || cm.doc.cantEdit
        }

        function registerEventHandlers(cm) {
            function reFocus() {
                cm.state.focused && setTimeout(bind(focusInput, cm), 0)
            }

            function onResize() {
                null == resizeTimer && (resizeTimer = setTimeout(function() {
                    resizeTimer = null, d.cachedCharWidth = d.cachedTextHeight = knownScrollbarWidth = null, clearCaches(cm), runInOp(cm, bind(regChange, cm))
                }, 100))
            }

            function unregister() {
                for (var p = d.wrapper.parentNode; p && p != document.body; p = p.parentNode);
                p ? setTimeout(unregister, 5e3) : off(window, "resize", onResize)
            }

            function drag_(e) {
                signalDOMEvent(cm, e) || cm.options.onDragEvent && cm.options.onDragEvent(cm, addStop(e)) || e_stop(e)
            }

            function prepareCopy() {
                d.inaccurateSelection && (d.prevInput = "", d.inaccurateSelection = !1, d.input.value = cm.getSelection(), selectInput(d.input))
            }
            var d = cm.display;
            on(d.scroller, "mousedown", operation(cm, onMouseDown)), ie ? on(d.scroller, "dblclick", operation(cm, function(e) {
                if (!signalDOMEvent(cm, e)) {
                    var pos = posFromMouse(cm, e);
                    if (pos && !clickInGutter(cm, e) && !eventInWidget(cm.display, e)) {
                        e_preventDefault(e);
                        var word = findWordAt(getLine(cm.doc, pos.line).text, pos);
                        extendSelection(cm.doc, word.from, word.to)
                    }
                }
            })) : on(d.scroller, "dblclick", function(e) {
                signalDOMEvent(cm, e) || e_preventDefault(e)
            }), on(d.lineSpace, "selectstart", function(e) {
                eventInWidget(d, e) || e_preventDefault(e)
            }), captureMiddleClick || on(d.scroller, "contextmenu", function(e) {
                onContextMenu(cm, e)
            }), on(d.scroller, "scroll", function() {
                d.scroller.clientHeight && (setScrollTop(cm, d.scroller.scrollTop), setScrollLeft(cm, d.scroller.scrollLeft, !0), signal(cm, "scroll", cm))
            }), on(d.scrollbarV, "scroll", function() {
                d.scroller.clientHeight && setScrollTop(cm, d.scrollbarV.scrollTop)
            }), on(d.scrollbarH, "scroll", function() {
                d.scroller.clientHeight && setScrollLeft(cm, d.scrollbarH.scrollLeft)
            }), on(d.scroller, "mousewheel", function(e) {
                onScrollWheel(cm, e)
            }), on(d.scroller, "DOMMouseScroll", function(e) {
                onScrollWheel(cm, e)
            }), on(d.scrollbarH, "mousedown", reFocus), on(d.scrollbarV, "mousedown", reFocus), on(d.wrapper, "scroll", function() {
                d.wrapper.scrollTop = d.wrapper.scrollLeft = 0
            });
            var resizeTimer;
            on(window, "resize", onResize), setTimeout(unregister, 5e3), on(d.input, "keyup", operation(cm, function(e) {
                signalDOMEvent(cm, e) || cm.options.onKeyEvent && cm.options.onKeyEvent(cm, addStop(e)) || 16 == e.keyCode && (cm.doc.sel.shift = !1)
            })), on(d.input, "input", bind(fastPoll, cm)), on(d.input, "keydown", operation(cm, onKeyDown)), on(d.input, "keypress", operation(cm, onKeyPress)), on(d.input, "focus", bind(onFocus, cm)), on(d.input, "blur", bind(onBlur, cm)), cm.options.dragDrop && (on(d.scroller, "dragstart", function(e) {
                onDragStart(cm, e)
            }), on(d.scroller, "dragenter", drag_), on(d.scroller, "dragover", drag_), on(d.scroller, "drop", operation(cm, onDrop))), on(d.scroller, "paste", function(e) {
                eventInWidget(d, e) || (focusInput(cm), fastPoll(cm))
            }), on(d.input, "paste", function() {
                if (webkit && !cm.state.fakedLastChar && !(new Date - cm.state.lastMiddleDown < 200)) {
                    var start = d.input.selectionStart,
                        end = d.input.selectionEnd;
                    d.input.value += "$", d.input.selectionStart = start, d.input.selectionEnd = end, cm.state.fakedLastChar = !0
                }
                cm.state.pasteIncoming = !0, fastPoll(cm)
            }), on(d.input, "cut", prepareCopy), on(d.input, "copy", prepareCopy), khtml && on(d.sizer, "mouseup", function() {
                document.activeElement == d.input && d.input.blur(), focusInput(cm)
            })
        }

        function eventInWidget(display, e) {
            for (var n = e_target(e); n != display.wrapper; n = n.parentNode)
                if (!n || n.ignoreEvents || n.parentNode == display.sizer && n != display.mover) return !0
        }

        function posFromMouse(cm, e, liberal) {
            var display = cm.display;
            if (!liberal) {
                var target = e_target(e);
                if (target == display.scrollbarH || target == display.scrollbarH.firstChild || target == display.scrollbarV || target == display.scrollbarV.firstChild || target == display.scrollbarFiller || target == display.gutterFiller) return null
            }
            var x, y, space = getRect(display.lineSpace);
            try {
                x = e.clientX, y = e.clientY
            } catch (e) {
                return null
            }
            return coordsChar(cm, x - space.left, y - space.top)
        }

        function onMouseDown(e) {
            function doSelect(cur) {
                if (!posEq(lastPos, cur)) {
                    if (lastPos = cur, "single" == type) return void extendSelection(cm.doc, clipPos(doc, start), cur);
                    if (startstart = clipPos(doc, startstart), startend = clipPos(doc, startend), "double" == type) {
                        var word = findWordAt(getLine(doc, cur.line).text, cur);
                        posLess(cur, startstart) ? extendSelection(cm.doc, word.from, startend) : extendSelection(cm.doc, startstart, word.to)
                    } else "triple" == type && (posLess(cur, startstart) ? extendSelection(cm.doc, startend, clipPos(doc, Pos(cur.line, 0))) : extendSelection(cm.doc, startstart, clipPos(doc, Pos(cur.line + 1, 0))))
                }
            }

            function extend(e) {
                var curCount = ++counter,
                    cur = posFromMouse(cm, e, !0);
                if (cur)
                    if (posEq(cur, last)) {
                        var outside = e.clientY < editorSize.top ? -20 : e.clientY > editorSize.bottom ? 20 : 0;
                        outside && setTimeout(operation(cm, function() {
                            counter == curCount && (display.scroller.scrollTop += outside, extend(e))
                        }), 50)
                    } else {
                        cm.state.focused || onFocus(cm), last = cur, doSelect(cur);
                        var visible = visibleLines(display, doc);
                        (cur.line >= visible.to || cur.line < visible.from) && setTimeout(operation(cm, function() {
                            counter == curCount && extend(e)
                        }), 150)
                    }
            }

            function done(e) {
                counter = 1 / 0, e_preventDefault(e), focusInput(cm), off(document, "mousemove", move), off(document, "mouseup", up)
            }
            if (!signalDOMEvent(this, e)) {
                var cm = this,
                    display = cm.display,
                    doc = cm.doc,
                    sel = doc.sel;
                if (sel.shift = e.shiftKey, eventInWidget(display, e)) return void(webkit || (display.scroller.draggable = !1, setTimeout(function() {
                    display.scroller.draggable = !0
                }, 100)));
                if (!clickInGutter(cm, e)) {
                    var start = posFromMouse(cm, e);
                    switch (e_button(e)) {
                        case 3:
                            return void(captureMiddleClick && onContextMenu.call(cm, cm, e));
                        case 2:
                            return webkit && (cm.state.lastMiddleDown = +new Date), start && extendSelection(cm.doc, start), setTimeout(bind(focusInput, cm), 20), void e_preventDefault(e)
                    }
                    if (!start) return void(e_target(e) == display.scroller && e_preventDefault(e));
                    cm.state.focused || onFocus(cm);
                    var now = +new Date,
                        type = "single";
                    if (lastDoubleClick && lastDoubleClick.time > now - 400 && posEq(lastDoubleClick.pos, start)) type = "triple", e_preventDefault(e), setTimeout(bind(focusInput, cm), 20), selectLine(cm, start.line);
                    else if (lastClick && lastClick.time > now - 400 && posEq(lastClick.pos, start)) {
                        type = "double", lastDoubleClick = {
                            time: now,
                            pos: start
                        }, e_preventDefault(e);
                        var word = findWordAt(getLine(doc, start.line).text, start);
                        extendSelection(cm.doc, word.from, word.to)
                    } else lastClick = {
                        time: now,
                        pos: start
                    };
                    var last = start;
                    if (cm.options.dragDrop && dragAndDrop && !isReadOnly(cm) && !posEq(sel.from, sel.to) && !posLess(start, sel.from) && !posLess(sel.to, start) && "single" == type) {
                        var dragEnd = operation(cm, function(e2) {
                            webkit && (display.scroller.draggable = !1), cm.state.draggingText = !1, off(document, "mouseup", dragEnd), off(display.scroller, "drop", dragEnd), Math.abs(e.clientX - e2.clientX) + Math.abs(e.clientY - e2.clientY) < 10 && (e_preventDefault(e2), extendSelection(cm.doc, start), focusInput(cm))
                        });
                        return webkit && (display.scroller.draggable = !0), cm.state.draggingText = dragEnd, display.scroller.dragDrop && display.scroller.dragDrop(), on(document, "mouseup", dragEnd), void on(display.scroller, "drop", dragEnd)
                    }
                    e_preventDefault(e), "single" == type && extendSelection(cm.doc, clipPos(doc, start));
                    var startstart = sel.from,
                        startend = sel.to,
                        lastPos = start,
                        editorSize = getRect(display.wrapper),
                        counter = 0,
                        move = operation(cm, function(e) {
                            ie || e_button(e) ? extend(e) : done(e)
                        }),
                        up = operation(cm, done);
                    on(document, "mousemove", move), on(document, "mouseup", up)
                }
            }
        }

        function clickInGutter(cm, e) {
            var display = cm.display;
            try {
                var mX = e.clientX,
                    mY = e.clientY
            } catch (e) {
                return !1
            }
            if (mX >= Math.floor(getRect(display.gutters).right)) return !1;
            if (e_preventDefault(e), !hasHandler(cm, "gutterClick")) return !0;
            var lineBox = getRect(display.lineDiv);
            if (mY > lineBox.bottom) return !0;
            mY -= lineBox.top - display.viewOffset;
            for (var i = 0; i < cm.options.gutters.length; ++i) {
                var g = display.gutters.childNodes[i];
                if (g && getRect(g).right >= mX) {
                    var line = lineAtHeight(cm.doc, mY),
                        gutter = cm.options.gutters[i];
                    signalLater(cm, "gutterClick", cm, line, gutter, e);
                    break
                }
            }
            return !0
        }

        function onDrop(e) {
            var cm = this;
            if (!(signalDOMEvent(cm, e) || eventInWidget(cm.display, e) || cm.options.onDragEvent && cm.options.onDragEvent(cm, addStop(e)))) {
                e_preventDefault(e), ie && (lastDrop = +new Date);
                var pos = posFromMouse(cm, e, !0),
                    files = e.dataTransfer.files;
                if (pos && !isReadOnly(cm))
                    if (files && files.length && window.FileReader && window.File)
                        for (var n = files.length, text = Array(n), read = 0, loadFile = function(file, i) {
                                var reader = new FileReader;
                                reader.onload = function() {
                                    text[i] = reader.result, ++read == n && (pos = clipPos(cm.doc, pos), makeChange(cm.doc, {
                                        from: pos,
                                        to: pos,
                                        text: splitLines(text.join("\n")),
                                        origin: "paste"
                                    }, "around"))
                                }, reader.readAsText(file)
                            }, i = 0; i < n; ++i) loadFile(files[i], i);
                    else {
                        if (cm.state.draggingText && !posLess(pos, cm.doc.sel.from) && !posLess(cm.doc.sel.to, pos)) return cm.state.draggingText(e), void setTimeout(bind(focusInput, cm), 20);
                        try {
                            var text = e.dataTransfer.getData("Text");
                            if (text) {
                                var curFrom = cm.doc.sel.from,
                                    curTo = cm.doc.sel.to;
                                setSelection(cm.doc, pos, pos), cm.state.draggingText && replaceRange(cm.doc, "", curFrom, curTo, "paste"), cm.replaceSelection(text, null, "paste"), focusInput(cm), onFocus(cm)
                            }
                        } catch (e) {}
                    }
            }
        }

        function onDragStart(cm, e) {
            if (ie && (!cm.state.draggingText || +new Date - lastDrop < 100)) return void e_stop(e);
            if (!signalDOMEvent(cm, e) && !eventInWidget(cm.display, e)) {
                var txt = cm.getSelection();
                if (e.dataTransfer.setData("Text", txt), e.dataTransfer.setDragImage && !safari) {
                    var img = elt("img", null, null, "position: fixed; left: 0; top: 0;");
                    opera && (img.width = img.height = 1, cm.display.wrapper.appendChild(img), img._top = img.offsetTop), e.dataTransfer.setDragImage(img, 0, 0), opera && img.parentNode.removeChild(img)
                }
            }
        }

        function setScrollTop(cm, val) {
            Math.abs(cm.doc.scrollTop - val) < 2 || (cm.doc.scrollTop = val, gecko || updateDisplay(cm, [], val), cm.display.scroller.scrollTop != val && (cm.display.scroller.scrollTop = val), cm.display.scrollbarV.scrollTop != val && (cm.display.scrollbarV.scrollTop = val), gecko && updateDisplay(cm, []), startWorker(cm, 100))
        }

        function setScrollLeft(cm, val, isScroller) {
            (isScroller ? val == cm.doc.scrollLeft : Math.abs(cm.doc.scrollLeft - val) < 2) || (val = Math.min(val, cm.display.scroller.scrollWidth - cm.display.scroller.clientWidth), cm.doc.scrollLeft = val, alignHorizontally(cm), cm.display.scroller.scrollLeft != val && (cm.display.scroller.scrollLeft = val), cm.display.scrollbarH.scrollLeft != val && (cm.display.scrollbarH.scrollLeft = val))
        }

        function onScrollWheel(cm, e) {
            var dx = e.wheelDeltaX,
                dy = e.wheelDeltaY;
            null == dx && e.detail && e.axis == e.HORIZONTAL_AXIS && (dx = e.detail), null == dy && e.detail && e.axis == e.VERTICAL_AXIS ? dy = e.detail : null == dy && (dy = e.wheelDelta);
            var display = cm.display,
                scroll = display.scroller;
            if (dx && scroll.scrollWidth > scroll.clientWidth || dy && scroll.scrollHeight > scroll.clientHeight) {
                if (dy && mac && webkit)
                    for (var cur = e.target; cur != scroll; cur = cur.parentNode)
                        if (cur.lineObj) {
                            cm.display.currentWheelTarget = cur;
                            break
                        }
                if (dx && !gecko && !opera && null != wheelPixelsPerUnit) return dy && setScrollTop(cm, Math.max(0, Math.min(scroll.scrollTop + dy * wheelPixelsPerUnit, scroll.scrollHeight - scroll.clientHeight))), setScrollLeft(cm, Math.max(0, Math.min(scroll.scrollLeft + dx * wheelPixelsPerUnit, scroll.scrollWidth - scroll.clientWidth))), e_preventDefault(e), void(display.wheelStartX = null);
                if (dy && null != wheelPixelsPerUnit) {
                    var pixels = dy * wheelPixelsPerUnit,
                        top = cm.doc.scrollTop,
                        bot = top + display.wrapper.clientHeight;
                    pixels < 0 ? top = Math.max(0, top + pixels - 50) : bot = Math.min(cm.doc.height, bot + pixels + 50), updateDisplay(cm, [], {
                        top: top,
                        bottom: bot
                    })
                }
                wheelSamples < 20 && (null == display.wheelStartX ? (display.wheelStartX = scroll.scrollLeft, display.wheelStartY = scroll.scrollTop, display.wheelDX = dx, display.wheelDY = dy, setTimeout(function() {
                    if (null != display.wheelStartX) {
                        var movedX = scroll.scrollLeft - display.wheelStartX,
                            movedY = scroll.scrollTop - display.wheelStartY,
                            sample = movedY && display.wheelDY && movedY / display.wheelDY || movedX && display.wheelDX && movedX / display.wheelDX;
                        display.wheelStartX = display.wheelStartY = null, sample && (wheelPixelsPerUnit = (wheelPixelsPerUnit * wheelSamples + sample) / (wheelSamples + 1), ++wheelSamples)
                    }
                }, 200)) : (display.wheelDX += dx, display.wheelDY += dy))
            }
        }

        function doHandleBinding(cm, bound, dropShift) {
            if ("string" == typeof bound && (bound = commands[bound], !bound)) return !1;
            cm.display.pollingFast && readInput(cm) && (cm.display.pollingFast = !1);
            var doc = cm.doc,
                prevShift = doc.sel.shift,
                done = !1;
            try {
                isReadOnly(cm) && (cm.state.suppressEdits = !0), dropShift && (doc.sel.shift = !1), done = bound(cm) != Pass
            } finally {
                doc.sel.shift = prevShift, cm.state.suppressEdits = !1
            }
            return done
        }

        function allKeyMaps(cm) {
            var maps = cm.state.keyMaps.slice(0);
            return cm.options.extraKeys && maps.push(cm.options.extraKeys), maps.push(cm.options.keyMap), maps
        }

        function handleKeyBinding(cm, e) {
            var startMap = getKeyMap(cm.options.keyMap),
                next = startMap.auto;
            clearTimeout(maybeTransition), next && !isModifierKey(e) && (maybeTransition = setTimeout(function() {
                getKeyMap(cm.options.keyMap) == startMap && (cm.options.keyMap = next.call ? next.call(null, cm) : next, keyMapChanged(cm))
            }, 50));
            var name = keyName(e, !0),
                handled = !1;
            if (!name) return !1;
            var keymaps = allKeyMaps(cm);
            return handled = e.shiftKey ? lookupKey("Shift-" + name, keymaps, function(b) {
                return doHandleBinding(cm, b, !0)
            }) || lookupKey(name, keymaps, function(b) {
                if ("string" == typeof b ? /^go[A-Z]/.test(b) : b.motion) return doHandleBinding(cm, b)
            }) : lookupKey(name, keymaps, function(b) {
                return doHandleBinding(cm, b)
            }), handled && (e_preventDefault(e), restartBlink(cm), ie_lt9 && (e.oldKeyCode = e.keyCode, e.keyCode = 0), signalLater(cm, "keyHandled", cm, name, e)), handled
        }

        function handleCharBinding(cm, e, ch) {
            var handled = lookupKey("'" + ch + "'", allKeyMaps(cm), function(b) {
                return doHandleBinding(cm, b, !0)
            });
            return handled && (e_preventDefault(e), restartBlink(cm), signalLater(cm, "keyHandled", cm, "'" + ch + "'", e)), handled
        }

        function onKeyDown(e) {
            var cm = this;
            if (cm.state.focused || onFocus(cm), !(signalDOMEvent(cm, e) || cm.options.onKeyEvent && cm.options.onKeyEvent(cm, addStop(e)))) {
                ie && 27 == e.keyCode && (e.returnValue = !1);
                var code = e.keyCode;
                cm.doc.sel.shift = 16 == code || e.shiftKey;
                var handled = handleKeyBinding(cm, e);
                opera && (lastStoppedKey = handled ? code : null, !handled && 88 == code && !hasCopyEvent && (mac ? e.metaKey : e.ctrlKey) && cm.replaceSelection(""))
            }
        }

        function onKeyPress(e) {
            var cm = this;
            if (!(signalDOMEvent(cm, e) || cm.options.onKeyEvent && cm.options.onKeyEvent(cm, addStop(e)))) {
                var keyCode = e.keyCode,
                    charCode = e.charCode;
                if (opera && keyCode == lastStoppedKey) return lastStoppedKey = null, void e_preventDefault(e);
                if (!(opera && (!e.which || e.which < 10) || khtml) || !handleKeyBinding(cm, e)) {
                    var ch = String.fromCharCode(null == charCode ? keyCode : charCode);
                    this.options.electricChars && this.doc.mode.electricChars && this.options.smartIndent && !isReadOnly(this) && this.doc.mode.electricChars.indexOf(ch) > -1 && setTimeout(operation(cm, function() {
                        indentLine(cm, cm.doc.sel.to.line, "smart")
                    }), 75), handleCharBinding(cm, e, ch) || (ie && !ie_lt9 && (cm.display.inputHasSelection = null), fastPoll(cm))
                }
            }
        }

        function onFocus(cm) {
            "nocursor" != cm.options.readOnly && (cm.state.focused || (signal(cm, "focus", cm), cm.state.focused = !0, cm.display.wrapper.className.search(/\bCodeMirror-focused\b/) == -1 && (cm.display.wrapper.className += " CodeMirror-focused"), cm.curOp || (resetInput(cm, !0), webkit && setTimeout(bind(resetInput, cm, !0), 0))), slowPoll(cm), restartBlink(cm))
        }

        function onBlur(cm) {
            cm.state.focused && (signal(cm, "blur", cm), cm.state.focused = !1, cm.display.wrapper.className = cm.display.wrapper.className.replace(" CodeMirror-focused", "")), clearInterval(cm.display.blinker), setTimeout(function() {
                cm.state.focused || (cm.doc.sel.shift = !1)
            }, 150)
        }

        function onContextMenu(cm, e) {
            function prepareSelectAllHack() {
                if (null != display.input.selectionStart) {
                    var extval = display.input.value = " " + (posEq(sel.from, sel.to) ? "" : display.input.value);
                    display.prevInput = " ", display.input.selectionStart = 1, display.input.selectionEnd = extval.length
                }
            }

            function rehide() {
                if (display.inputDiv.style.position = "relative", display.input.style.cssText = oldCSS, ie_lt9 && (display.scrollbarV.scrollTop = display.scroller.scrollTop = scrollPos), slowPoll(cm), null != display.input.selectionStart) {
                    ie && !ie_lt9 || prepareSelectAllHack(), clearTimeout(detectingSelectAll);
                    var i = 0,
                        poll = function() {
                            " " == display.prevInput && 0 == display.input.selectionStart ? operation(cm, commands.selectAll)(cm) : i++ < 10 ? detectingSelectAll = setTimeout(poll, 500) : resetInput(cm)
                        };
                    detectingSelectAll = setTimeout(poll, 200)
                }
            }
            if (!signalDOMEvent(cm, e, "contextmenu")) {
                var display = cm.display,
                    sel = cm.doc.sel;
                if (!eventInWidget(display, e)) {
                    var pos = posFromMouse(cm, e),
                        scrollPos = display.scroller.scrollTop;
                    if (pos && !opera) {
                        (posEq(sel.from, sel.to) || posLess(pos, sel.from) || !posLess(pos, sel.to)) && operation(cm, setSelection)(cm.doc, pos, pos);
                        var oldCSS = display.input.style.cssText;
                        if (display.inputDiv.style.position = "absolute", display.input.style.cssText = "position: fixed; width: 30px; height: 30px; top: " + (e.clientY - 5) + "px; left: " + (e.clientX - 5) + "px; z-index: 1000; background: white; outline: none;border-width: 0; outline: none; overflow: hidden; opacity: .05; -ms-opacity: .05; filter: alpha(opacity=5);", focusInput(cm), resetInput(cm, !0), posEq(sel.from, sel.to) && (display.input.value = display.prevInput = " "), ie && !ie_lt9 && prepareSelectAllHack(), captureMiddleClick) {
                            e_stop(e);
                            var mouseup = function() {
                                off(window, "mouseup", mouseup), setTimeout(rehide, 20)
                            };
                            on(window, "mouseup", mouseup)
                        } else setTimeout(rehide, 50)
                    }
                }
            }
        }

        function clipPostChange(doc, change, pos) {
            if (!posLess(change.from, pos)) return clipPos(doc, pos);
            var diff = change.text.length - 1 - (change.to.line - change.from.line);
            if (pos.line > change.to.line + diff) {
                var preLine = pos.line - diff,
                    lastLine = doc.first + doc.size - 1;
                return preLine > lastLine ? Pos(lastLine, getLine(doc, lastLine).text.length) : clipToLen(pos, getLine(doc, preLine).text.length)
            }
            if (pos.line == change.to.line + diff) return clipToLen(pos, lst(change.text).length + (1 == change.text.length ? change.from.ch : 0) + getLine(doc, change.to.line).text.length - change.to.ch);
            var inside = pos.line - change.from.line;
            return clipToLen(pos, change.text[inside].length + (inside ? 0 : change.from.ch))
        }

        function computeSelAfterChange(doc, change, hint) {
            if (hint && "object" == typeof hint) return {
                anchor: clipPostChange(doc, change, hint.anchor),
                head: clipPostChange(doc, change, hint.head)
            };
            if ("start" == hint) return {
                anchor: change.from,
                head: change.from
            };
            var end = changeEnd(change);
            if ("around" == hint) return {
                anchor: change.from,
                head: end
            };
            if ("end" == hint) return {
                anchor: end,
                head: end
            };
            var adjustPos = function(pos) {
                if (posLess(pos, change.from)) return pos;
                if (!posLess(change.to, pos)) return end;
                var line = pos.line + change.text.length - (change.to.line - change.from.line) - 1,
                    ch = pos.ch;
                return pos.line == change.to.line && (ch += end.ch - change.to.ch), Pos(line, ch)
            };
            return {
                anchor: adjustPos(doc.sel.anchor),
                head: adjustPos(doc.sel.head)
            }
        }

        function filterChange(doc, change, update) {
            var obj = {
                canceled: !1,
                from: change.from,
                to: change.to,
                text: change.text,
                origin: change.origin,
                cancel: function() {
                    this.canceled = !0
                }
            };
            return update && (obj.update = function(from, to, text, origin) {
                from && (this.from = clipPos(doc, from)), to && (this.to = clipPos(doc, to)), text && (this.text = text), void 0 !== origin && (this.origin = origin)
            }), signal(doc, "beforeChange", doc, obj), doc.cm && signal(doc.cm, "beforeChange", doc.cm, obj), obj.canceled ? null : {
                from: obj.from,
                to: obj.to,
                text: obj.text,
                origin: obj.origin
            }
        }

        function makeChange(doc, change, selUpdate, ignoreReadOnly) {
            if (doc.cm) {
                if (!doc.cm.curOp) return operation(doc.cm, makeChange)(doc, change, selUpdate, ignoreReadOnly);
                if (doc.cm.state.suppressEdits) return
            }
            if (!(hasHandler(doc, "beforeChange") || doc.cm && hasHandler(doc.cm, "beforeChange")) || (change = filterChange(doc, change, !0))) {
                var split = sawReadOnlySpans && !ignoreReadOnly && removeReadOnlyRanges(doc, change.from, change.to);
                if (split) {
                    for (var i = split.length - 1; i >= 1; --i) makeChangeNoReadonly(doc, {
                        from: split[i].from,
                        to: split[i].to,
                        text: [""]
                    });
                    split.length && makeChangeNoReadonly(doc, {
                        from: split[0].from,
                        to: split[0].to,
                        text: change.text
                    }, selUpdate)
                } else makeChangeNoReadonly(doc, change, selUpdate)
            }
        }

        function makeChangeNoReadonly(doc, change, selUpdate) {
            var selAfter = computeSelAfterChange(doc, change, selUpdate);
            addToHistory(doc, change, selAfter, doc.cm ? doc.cm.curOp.id : NaN), makeChangeSingleDoc(doc, change, selAfter, stretchSpansOverChange(doc, change));
            var rebased = [];
            linkedDocs(doc, function(doc, sharedHist) {
                sharedHist || indexOf(rebased, doc.history) != -1 || (rebaseHist(doc.history, change), rebased.push(doc.history)), makeChangeSingleDoc(doc, change, null, stretchSpansOverChange(doc, change))
            })
        }

        function makeChangeFromHistory(doc, type) {
            if (!doc.cm || !doc.cm.state.suppressEdits) {
                var hist = doc.history,
                    event = ("undo" == type ? hist.done : hist.undone).pop();
                if (event) {
                    var anti = {
                        changes: [],
                        anchorBefore: event.anchorAfter,
                        headBefore: event.headAfter,
                        anchorAfter: event.anchorBefore,
                        headAfter: event.headBefore,
                        generation: hist.generation
                    };
                    ("undo" == type ? hist.undone : hist.done).push(anti), hist.generation = event.generation || ++hist.maxGeneration;
                    for (var filter = hasHandler(doc, "beforeChange") || doc.cm && hasHandler(doc.cm, "beforeChange"), i = event.changes.length - 1; i >= 0; --i) {
                        var change = event.changes[i];
                        if (change.origin = type, filter && !filterChange(doc, change, !1)) return void(("undo" == type ? hist.done : hist.undone).length = 0);
                        anti.changes.push(historyChangeFromChange(doc, change));
                        var after = i ? computeSelAfterChange(doc, change, null) : {
                            anchor: event.anchorBefore,
                            head: event.headBefore
                        };
                        makeChangeSingleDoc(doc, change, after, mergeOldSpans(doc, change));
                        var rebased = [];
                        linkedDocs(doc, function(doc, sharedHist) {
                            sharedHist || indexOf(rebased, doc.history) != -1 || (rebaseHist(doc.history, change), rebased.push(doc.history)), makeChangeSingleDoc(doc, change, null, mergeOldSpans(doc, change))
                        })
                    }
                }
            }
        }

        function shiftDoc(doc, distance) {
            function shiftPos(pos) {
                return Pos(pos.line + distance, pos.ch)
            }
            doc.first += distance, doc.cm && regChange(doc.cm, doc.first, doc.first, distance), doc.sel.head = shiftPos(doc.sel.head), doc.sel.anchor = shiftPos(doc.sel.anchor), doc.sel.from = shiftPos(doc.sel.from), doc.sel.to = shiftPos(doc.sel.to)
        }

        function makeChangeSingleDoc(doc, change, selAfter, spans) {
            if (doc.cm && !doc.cm.curOp) return operation(doc.cm, makeChangeSingleDoc)(doc, change, selAfter, spans);
            if (change.to.line < doc.first) return void shiftDoc(doc, change.text.length - 1 - (change.to.line - change.from.line));
            if (!(change.from.line > doc.lastLine())) {
                if (change.from.line < doc.first) {
                    var shift = change.text.length - 1 - (doc.first - change.from.line);
                    shiftDoc(doc, shift), change = {
                        from: Pos(doc.first, 0),
                        to: Pos(change.to.line + shift, change.to.ch),
                        text: [lst(change.text)],
                        origin: change.origin
                    }
                }
                var last = doc.lastLine();
                change.to.line > last && (change = {
                    from: change.from,
                    to: Pos(last, getLine(doc, last).text.length),
                    text: [change.text[0]],
                    origin: change.origin
                }), change.removed = getBetween(doc, change.from, change.to), selAfter || (selAfter = computeSelAfterChange(doc, change, null)), doc.cm ? makeChangeSingleDocInEditor(doc.cm, change, spans, selAfter) : updateDoc(doc, change, spans, selAfter)
            }
        }

        function makeChangeSingleDocInEditor(cm, change, spans, selAfter) {
            var doc = cm.doc,
                display = cm.display,
                from = change.from,
                to = change.to,
                recomputeMaxLength = !1,
                checkWidthStart = from.line;
            cm.options.lineWrapping || (checkWidthStart = lineNo(visualLine(doc, getLine(doc, from.line))), doc.iter(checkWidthStart, to.line + 1, function(line) {
                if (line == display.maxLine) return recomputeMaxLength = !0, !0
            })), posLess(doc.sel.head, change.from) || posLess(change.to, doc.sel.head) || (cm.curOp.cursorActivity = !0), updateDoc(doc, change, spans, selAfter, estimateHeight(cm)), cm.options.lineWrapping || (doc.iter(checkWidthStart, from.line + change.text.length, function(line) {
                var len = lineLength(doc, line);
                len > display.maxLineLength && (display.maxLine = line, display.maxLineLength = len, display.maxLineChanged = !0, recomputeMaxLength = !1)
            }), recomputeMaxLength && (cm.curOp.updateMaxLine = !0)), doc.frontier = Math.min(doc.frontier, from.line), startWorker(cm, 400);
            var lendiff = change.text.length - (to.line - from.line) - 1;
            if (regChange(cm, from.line, to.line + 1, lendiff), hasHandler(cm, "change")) {
                var changeObj = {
                    from: from,
                    to: to,
                    text: change.text,
                    removed: change.removed,
                    origin: change.origin
                };
                if (cm.curOp.textChanged) {
                    for (var cur = cm.curOp.textChanged; cur.next; cur = cur.next);
                    cur.next = changeObj
                } else cm.curOp.textChanged = changeObj
            }
        }

        function replaceRange(doc, code, from, to, origin) {
            if (to || (to = from), posLess(to, from)) {
                var tmp = to;
                to = from, from = tmp
            }
            "string" == typeof code && (code = splitLines(code)), makeChange(doc, {
                from: from,
                to: to,
                text: code,
                origin: origin
            }, null)
        }

        function Pos(line, ch) {
            return this instanceof Pos ? (this.line = line, void(this.ch = ch)) : new Pos(line, ch)
        }

        function posEq(a, b) {
            return a.line == b.line && a.ch == b.ch
        }

        function posLess(a, b) {
            return a.line < b.line || a.line == b.line && a.ch < b.ch
        }

        function copyPos(x) {
            return Pos(x.line, x.ch)
        }

        function clipLine(doc, n) {
            return Math.max(doc.first, Math.min(n, doc.first + doc.size - 1))
        }

        function clipPos(doc, pos) {
            if (pos.line < doc.first) return Pos(doc.first, 0);
            var last = doc.first + doc.size - 1;
            return pos.line > last ? Pos(last, getLine(doc, last).text.length) : clipToLen(pos, getLine(doc, pos.line).text.length)
        }

        function clipToLen(pos, linelen) {
            var ch = pos.ch;
            return null == ch || ch > linelen ? Pos(pos.line, linelen) : ch < 0 ? Pos(pos.line, 0) : pos
        }

        function isLine(doc, l) {
            return l >= doc.first && l < doc.first + doc.size
        }

        function extendSelection(doc, pos, other, bias) {
            if (doc.sel.shift || doc.sel.extend) {
                var anchor = doc.sel.anchor;
                if (other) {
                    var posBefore = posLess(pos, anchor);
                    posBefore != posLess(other, anchor) ? (anchor = pos, pos = other) : posBefore != posLess(pos, other) && (pos = other)
                }
                setSelection(doc, anchor, pos, bias)
            } else setSelection(doc, pos, other || pos, bias);
            doc.cm && (doc.cm.curOp.userSelChange = !0)
        }

        function filterSelectionChange(doc, anchor, head) {
            var obj = {
                anchor: anchor,
                head: head
            };
            return signal(doc, "beforeSelectionChange", doc, obj), doc.cm && signal(doc.cm, "beforeSelectionChange", doc.cm, obj), obj.anchor = clipPos(doc, obj.anchor), obj.head = clipPos(doc, obj.head), obj
        }

        function setSelection(doc, anchor, head, bias, checkAtomic) {
            if (!checkAtomic && hasHandler(doc, "beforeSelectionChange") || doc.cm && hasHandler(doc.cm, "beforeSelectionChange")) {
                var filtered = filterSelectionChange(doc, anchor, head);
                head = filtered.head, anchor = filtered.anchor
            }
            var sel = doc.sel;
            if (sel.goalColumn = null, !checkAtomic && posEq(anchor, sel.anchor) || (anchor = skipAtomic(doc, anchor, bias, "push" != checkAtomic)), !checkAtomic && posEq(head, sel.head) || (head = skipAtomic(doc, head, bias, "push" != checkAtomic)), !posEq(sel.anchor, anchor) || !posEq(sel.head, head)) {
                sel.anchor = anchor, sel.head = head;
                var inv = posLess(head, anchor);
                sel.from = inv ? head : anchor, sel.to = inv ? anchor : head, doc.cm && (doc.cm.curOp.updateInput = doc.cm.curOp.selectionChanged = doc.cm.curOp.cursorActivity = !0), signalLater(doc, "cursorActivity", doc)
            }
        }

        function reCheckSelection(cm) {
            setSelection(cm.doc, cm.doc.sel.from, cm.doc.sel.to, null, "push")
        }

        function skipAtomic(doc, pos, bias, mayClear) {
            var flipped = !1,
                curPos = pos,
                dir = bias || 1;
            doc.cantEdit = !1;
            search: for (;;) {
                var line = getLine(doc, curPos.line);
                if (line.markedSpans)
                    for (var i = 0; i < line.markedSpans.length; ++i) {
                        var sp = line.markedSpans[i],
                            m = sp.marker;
                        if ((null == sp.from || (m.inclusiveLeft ? sp.from <= curPos.ch : sp.from < curPos.ch)) && (null == sp.to || (m.inclusiveRight ? sp.to >= curPos.ch : sp.to > curPos.ch))) {
                            if (mayClear && (signal(m, "beforeCursorEnter"), m.explicitlyCleared)) {
                                if (line.markedSpans) {
                                    --i;
                                    continue
                                }
                                break
                            }
                            if (!m.atomic) continue;
                            var newPos = m.find()[dir < 0 ? "from" : "to"];
                            if (posEq(newPos, curPos) && (newPos.ch += dir,
                                    newPos.ch < 0 ? newPos = newPos.line > doc.first ? clipPos(doc, Pos(newPos.line - 1)) : null : newPos.ch > line.text.length && (newPos = newPos.line < doc.first + doc.size - 1 ? Pos(newPos.line + 1, 0) : null), !newPos)) {
                                if (flipped) return mayClear ? (doc.cantEdit = !0, Pos(doc.first, 0)) : skipAtomic(doc, pos, bias, !0);
                                flipped = !0, newPos = pos, dir = -dir
                            }
                            curPos = newPos;
                            continue search
                        }
                    }
                return curPos
            }
        }

        function scrollCursorIntoView(cm) {
            var coords = scrollPosIntoView(cm, cm.doc.sel.head, cm.options.cursorScrollMargin);
            if (cm.state.focused) {
                var display = cm.display,
                    box = getRect(display.sizer),
                    doScroll = null;
                if (coords.top + box.top < 0 ? doScroll = !0 : coords.bottom + box.top > (window.innerHeight || document.documentElement.clientHeight) && (doScroll = !1), null != doScroll && !phantom) {
                    var hidden = "none" == display.cursor.style.display;
                    hidden && (display.cursor.style.display = "", display.cursor.style.left = coords.left + "px", display.cursor.style.top = coords.top - display.viewOffset + "px"), display.cursor.scrollIntoView(doScroll), hidden && (display.cursor.style.display = "none")
                }
            }
        }

        function scrollPosIntoView(cm, pos, margin) {
            for (null == margin && (margin = 0);;) {
                var changed = !1,
                    coords = cursorCoords(cm, pos),
                    scrollPos = calculateScrollPos(cm, coords.left, coords.top - margin, coords.left, coords.bottom + margin),
                    startTop = cm.doc.scrollTop,
                    startLeft = cm.doc.scrollLeft;
                if (null != scrollPos.scrollTop && (setScrollTop(cm, scrollPos.scrollTop), Math.abs(cm.doc.scrollTop - startTop) > 1 && (changed = !0)), null != scrollPos.scrollLeft && (setScrollLeft(cm, scrollPos.scrollLeft), Math.abs(cm.doc.scrollLeft - startLeft) > 1 && (changed = !0)), !changed) return coords
            }
        }

        function scrollIntoView(cm, x1, y1, x2, y2) {
            var scrollPos = calculateScrollPos(cm, x1, y1, x2, y2);
            null != scrollPos.scrollTop && setScrollTop(cm, scrollPos.scrollTop), null != scrollPos.scrollLeft && setScrollLeft(cm, scrollPos.scrollLeft)
        }

        function calculateScrollPos(cm, x1, y1, x2, y2) {
            var display = cm.display,
                snapMargin = textHeight(cm.display);
            y1 < 0 && (y1 = 0);
            var screen = display.scroller.clientHeight - scrollerCutOff,
                screentop = display.scroller.scrollTop,
                result = {},
                docBottom = cm.doc.height + paddingVert(display),
                atTop = y1 < snapMargin,
                atBottom = y2 > docBottom - snapMargin;
            if (y1 < screentop) result.scrollTop = atTop ? 0 : y1;
            else if (y2 > screentop + screen) {
                var newTop = Math.min(y1, (atBottom ? docBottom : y2) - screen);
                newTop != screentop && (result.scrollTop = newTop)
            }
            var screenw = display.scroller.clientWidth - scrollerCutOff,
                screenleft = display.scroller.scrollLeft;
            x1 += display.gutters.offsetWidth, x2 += display.gutters.offsetWidth;
            var gutterw = display.gutters.offsetWidth,
                atLeft = x1 < gutterw + 10;
            return x1 < screenleft + gutterw || atLeft ? (atLeft && (x1 = 0), result.scrollLeft = Math.max(0, x1 - 10 - gutterw)) : x2 > screenw + screenleft - 3 && (result.scrollLeft = x2 + 10 - screenw), result
        }

        function updateScrollPos(cm, left, top) {
            cm.curOp.updateScrollPos = {
                scrollLeft: null == left ? cm.doc.scrollLeft : left,
                scrollTop: null == top ? cm.doc.scrollTop : top
            }
        }

        function addToScrollPos(cm, left, top) {
            var pos = cm.curOp.updateScrollPos || (cm.curOp.updateScrollPos = {
                    scrollLeft: cm.doc.scrollLeft,
                    scrollTop: cm.doc.scrollTop
                }),
                scroll = cm.display.scroller;
            pos.scrollTop = Math.max(0, Math.min(scroll.scrollHeight - scroll.clientHeight, pos.scrollTop + top)), pos.scrollLeft = Math.max(0, Math.min(scroll.scrollWidth - scroll.clientWidth, pos.scrollLeft + left))
        }

        function indentLine(cm, n, how, aggressive) {
            var doc = cm.doc;
            if (null == how && (how = "add"), "smart" == how)
                if (cm.doc.mode.indent) var state = getStateBefore(cm, n);
                else how = "prev";
            var indentation, tabSize = cm.options.tabSize,
                line = getLine(doc, n),
                curSpace = countColumn(line.text, null, tabSize),
                curSpaceString = line.text.match(/^\s*/)[0];
            if ("smart" == how && (indentation = cm.doc.mode.indent(state, line.text.slice(curSpaceString.length), line.text), indentation == Pass)) {
                if (!aggressive) return;
                how = "prev"
            }
            "prev" == how ? indentation = n > doc.first ? countColumn(getLine(doc, n - 1).text, null, tabSize) : 0 : "add" == how ? indentation = curSpace + cm.options.indentUnit : "subtract" == how ? indentation = curSpace - cm.options.indentUnit : "number" == typeof how && (indentation = curSpace + how), indentation = Math.max(0, indentation);
            var indentString = "",
                pos = 0;
            if (cm.options.indentWithTabs)
                for (var i = Math.floor(indentation / tabSize); i; --i) pos += tabSize, indentString += "\t";
            pos < indentation && (indentString += spaceStr(indentation - pos)), indentString != curSpaceString && replaceRange(cm.doc, indentString, Pos(n, 0), Pos(n, curSpaceString.length), "+input"), line.stateAfter = null
        }

        function changeLine(cm, handle, op) {
            var no = handle,
                line = handle,
                doc = cm.doc;
            return "number" == typeof handle ? line = getLine(doc, clipLine(doc, handle)) : no = lineNo(handle), null == no ? null : op(line, no) ? (regChange(cm, no, no + 1), line) : null
        }

        function findPosH(doc, pos, dir, unit, visually) {
            function findNextLine() {
                var l = line + dir;
                return l < doc.first || l >= doc.first + doc.size ? possible = !1 : (line = l, lineObj = getLine(doc, l))
            }

            function moveOnce(boundToLine) {
                var next = (visually ? moveVisually : moveLogically)(lineObj, ch, dir, !0);
                if (null == next) {
                    if (boundToLine || !findNextLine()) return possible = !1;
                    ch = visually ? (dir < 0 ? lineRight : lineLeft)(lineObj) : dir < 0 ? lineObj.text.length : 0
                } else ch = next;
                return !0
            }
            var line = pos.line,
                ch = pos.ch,
                origDir = dir,
                lineObj = getLine(doc, line),
                possible = !0;
            if ("char" == unit) moveOnce();
            else if ("column" == unit) moveOnce(!0);
            else if ("word" == unit || "group" == unit)
                for (var sawType = null, group = "group" == unit, first = !0; !(dir < 0) || moveOnce(!first); first = !1) {
                    var cur = lineObj.text.charAt(ch) || "\n",
                        type = isWordChar(cur) ? "w" : group ? /\s/.test(cur) ? null : "p" : null;
                    if (sawType && sawType != type) {
                        dir < 0 && (dir = 1, moveOnce());
                        break
                    }
                    if (type && (sawType = type), dir > 0 && !moveOnce(!first)) break
                }
            var result = skipAtomic(doc, Pos(line, ch), origDir, !0);
            return possible || (result.hitSide = !0), result
        }

        function findPosV(cm, pos, dir, unit) {
            var y, doc = cm.doc,
                x = pos.left;
            if ("page" == unit) {
                var pageSize = Math.min(cm.display.wrapper.clientHeight, window.innerHeight || document.documentElement.clientHeight);
                y = pos.top + dir * (pageSize - (dir < 0 ? 1.5 : .5) * textHeight(cm.display))
            } else "line" == unit && (y = dir > 0 ? pos.bottom + 3 : pos.top - 3);
            for (;;) {
                var target = coordsChar(cm, x, y);
                if (!target.outside) break;
                if (dir < 0 ? y <= 0 : y >= doc.height) {
                    target.hitSide = !0;
                    break
                }
                y += 5 * dir
            }
            return target
        }

        function findWordAt(line, pos) {
            var start = pos.ch,
                end = pos.ch;
            if (line) {
                (pos.xRel < 0 || end == line.length) && start ? --start : ++end;
                for (var startChar = line.charAt(start), check = isWordChar(startChar) ? isWordChar : /\s/.test(startChar) ? function(ch) {
                        return /\s/.test(ch)
                    } : function(ch) {
                        return !/\s/.test(ch) && !isWordChar(ch)
                    }; start > 0 && check(line.charAt(start - 1));) --start;
                for (; end < line.length && check(line.charAt(end));) ++end
            }
            return {
                from: Pos(pos.line, start),
                to: Pos(pos.line, end)
            }
        }

        function selectLine(cm, line) {
            extendSelection(cm.doc, Pos(line, 0), clipPos(cm.doc, Pos(line + 1, 0)))
        }

        function option(name, deflt, handle, notOnInit) {
            CodeMirror.defaults[name] = deflt, handle && (optionHandlers[name] = notOnInit ? function(cm, val, old) {
                old != Init && handle(cm, val, old)
            } : handle)
        }

        function copyState(mode, state) {
            if (state === !0) return state;
            if (mode.copyState) return mode.copyState(state);
            var nstate = {};
            for (var n in state) {
                var val = state[n];
                val instanceof Array && (val = val.concat([])), nstate[n] = val
            }
            return nstate
        }

        function startState(mode, a1, a2) {
            return !mode.startState || mode.startState(a1, a2)
        }

        function getKeyMap(val) {
            return "string" == typeof val ? keyMap[val] : val
        }

        function lookupKey(name, maps, handle) {
            function lookup(map) {
                map = getKeyMap(map);
                var found = map[name];
                if (found === !1) return "stop";
                if (null != found && handle(found)) return !0;
                if (map.nofallthrough) return "stop";
                var fallthrough = map.fallthrough;
                if (null == fallthrough) return !1;
                if ("[object Array]" != Object.prototype.toString.call(fallthrough)) return lookup(fallthrough);
                for (var i = 0, e = fallthrough.length; i < e; ++i) {
                    var done = lookup(fallthrough[i]);
                    if (done) return done
                }
                return !1
            }
            for (var i = 0; i < maps.length; ++i) {
                var done = lookup(maps[i]);
                if (done) return "stop" != done
            }
        }

        function isModifierKey(event) {
            var name = keyNames[event.keyCode];
            return "Ctrl" == name || "Alt" == name || "Shift" == name || "Mod" == name
        }

        function keyName(event, noShift) {
            if (opera && 34 == event.keyCode && event["char"]) return !1;
            var name = keyNames[event.keyCode];
            return null != name && !event.altGraphKey && (event.altKey && (name = "Alt-" + name), (flipCtrlCmd ? event.metaKey : event.ctrlKey) && (name = "Ctrl-" + name), (flipCtrlCmd ? event.ctrlKey : event.metaKey) && (name = "Cmd-" + name), !noShift && event.shiftKey && (name = "Shift-" + name), name)
        }

        function StringStream(string, tabSize) {
            this.pos = this.start = 0, this.string = string, this.tabSize = tabSize || 8, this.lastColumnPos = this.lastColumnValue = 0
        }

        function TextMarker(doc, type) {
            this.lines = [], this.type = type, this.doc = doc
        }

        function markText(doc, from, to, options, type) {
            if (options && options.shared) return markTextShared(doc, from, to, options, type);
            if (doc.cm && !doc.cm.curOp) return operation(doc.cm, markText)(doc, from, to, options, type);
            var marker = new TextMarker(doc, type);
            if ("range" == type && !posLess(from, to)) return marker;
            options && copyObj(options, marker), marker.replacedWith && (marker.collapsed = !0, marker.replacedWith = elt("span", [marker.replacedWith], "CodeMirror-widget"), options.handleMouseEvents || (marker.replacedWith.ignoreEvents = !0)), marker.collapsed && (sawCollapsedSpans = !0), marker.addToHistory && addToHistory(doc, {
                from: from,
                to: to,
                origin: "markText"
            }, {
                head: doc.sel.head,
                anchor: doc.sel.anchor
            }, NaN);
            var collapsedAtStart, collapsedAtEnd, updateMaxLine, curLine = from.line,
                size = 0,
                cm = doc.cm;
            if (doc.iter(curLine, to.line + 1, function(line) {
                    cm && marker.collapsed && !cm.options.lineWrapping && visualLine(doc, line) == cm.display.maxLine && (updateMaxLine = !0);
                    var span = {
                        from: null,
                        to: null,
                        marker: marker
                    };
                    size += line.text.length, curLine == from.line && (span.from = from.ch, size -= from.ch), curLine == to.line && (span.to = to.ch, size -= line.text.length - to.ch), marker.collapsed && (curLine == to.line && (collapsedAtEnd = collapsedSpanAt(line, to.ch)), curLine == from.line ? collapsedAtStart = collapsedSpanAt(line, from.ch) : updateLineHeight(line, 0)), addMarkedSpan(line, span), ++curLine
                }), marker.collapsed && doc.iter(from.line, to.line + 1, function(line) {
                    lineIsHidden(doc, line) && updateLineHeight(line, 0)
                }), marker.clearOnEnter && on(marker, "beforeCursorEnter", function() {
                    marker.clear()
                }), marker.readOnly && (sawReadOnlySpans = !0, (doc.history.done.length || doc.history.undone.length) && doc.clearHistory()), marker.collapsed) {
                if (collapsedAtStart != collapsedAtEnd) throw new Error("Inserting collapsed marker overlapping an existing one");
                marker.size = size, marker.atomic = !0
            }
            return cm && (updateMaxLine && (cm.curOp.updateMaxLine = !0), (marker.className || marker.title || marker.startStyle || marker.endStyle || marker.collapsed) && regChange(cm, from.line, to.line + 1), marker.atomic && reCheckSelection(cm)), marker
        }

        function SharedTextMarker(markers, primary) {
            this.markers = markers, this.primary = primary;
            for (var i = 0, me = this; i < markers.length; ++i) markers[i].parent = this, on(markers[i], "clear", function() {
                me.clear()
            })
        }

        function markTextShared(doc, from, to, options, type) {
            options = copyObj(options), options.shared = !1;
            var markers = [markText(doc, from, to, options, type)],
                primary = markers[0],
                widget = options.replacedWith;
            return linkedDocs(doc, function(doc) {
                widget && (options.replacedWith = widget.cloneNode(!0)), markers.push(markText(doc, clipPos(doc, from), clipPos(doc, to), options, type));
                for (var i = 0; i < doc.linked.length; ++i)
                    if (doc.linked[i].isParent) return;
                primary = lst(markers)
            }), new SharedTextMarker(markers, primary)
        }

        function getMarkedSpanFor(spans, marker) {
            if (spans)
                for (var i = 0; i < spans.length; ++i) {
                    var span = spans[i];
                    if (span.marker == marker) return span
                }
        }

        function removeMarkedSpan(spans, span) {
            for (var r, i = 0; i < spans.length; ++i) spans[i] != span && (r || (r = [])).push(spans[i]);
            return r
        }

        function addMarkedSpan(line, span) {
            line.markedSpans = line.markedSpans ? line.markedSpans.concat([span]) : [span], span.marker.attachLine(line)
        }

        function markedSpansBefore(old, startCh, isInsert) {
            if (old)
                for (var nw, i = 0; i < old.length; ++i) {
                    var span = old[i],
                        marker = span.marker,
                        startsBefore = null == span.from || (marker.inclusiveLeft ? span.from <= startCh : span.from < startCh);
                    if (startsBefore || "bookmark" == marker.type && span.from == startCh && (!isInsert || !span.marker.insertLeft)) {
                        var endsAfter = null == span.to || (marker.inclusiveRight ? span.to >= startCh : span.to > startCh);
                        (nw || (nw = [])).push({
                            from: span.from,
                            to: endsAfter ? null : span.to,
                            marker: marker
                        })
                    }
                }
            return nw
        }

        function markedSpansAfter(old, endCh, isInsert) {
            if (old)
                for (var nw, i = 0; i < old.length; ++i) {
                    var span = old[i],
                        marker = span.marker,
                        endsAfter = null == span.to || (marker.inclusiveRight ? span.to >= endCh : span.to > endCh);
                    if (endsAfter || "bookmark" == marker.type && span.from == endCh && (!isInsert || span.marker.insertLeft)) {
                        var startsBefore = null == span.from || (marker.inclusiveLeft ? span.from <= endCh : span.from < endCh);
                        (nw || (nw = [])).push({
                            from: startsBefore ? null : span.from - endCh,
                            to: null == span.to ? null : span.to - endCh,
                            marker: marker
                        })
                    }
                }
            return nw
        }

        function stretchSpansOverChange(doc, change) {
            var oldFirst = isLine(doc, change.from.line) && getLine(doc, change.from.line).markedSpans,
                oldLast = isLine(doc, change.to.line) && getLine(doc, change.to.line).markedSpans;
            if (!oldFirst && !oldLast) return null;
            var startCh = change.from.ch,
                endCh = change.to.ch,
                isInsert = posEq(change.from, change.to),
                first = markedSpansBefore(oldFirst, startCh, isInsert),
                last = markedSpansAfter(oldLast, endCh, isInsert),
                sameLine = 1 == change.text.length,
                offset = lst(change.text).length + (sameLine ? startCh : 0);
            if (first)
                for (var i = 0; i < first.length; ++i) {
                    var span = first[i];
                    if (null == span.to) {
                        var found = getMarkedSpanFor(last, span.marker);
                        found ? sameLine && (span.to = null == found.to ? null : found.to + offset) : span.to = startCh
                    }
                }
            if (last)
                for (var i = 0; i < last.length; ++i) {
                    var span = last[i];
                    if (null != span.to && (span.to += offset), null == span.from) {
                        var found = getMarkedSpanFor(first, span.marker);
                        found || (span.from = offset, sameLine && (first || (first = [])).push(span))
                    } else span.from += offset, sameLine && (first || (first = [])).push(span)
                }
            if (sameLine && first) {
                for (var i = 0; i < first.length; ++i) null != first[i].from && first[i].from == first[i].to && "bookmark" != first[i].marker.type && first.splice(i--, 1);
                first.length || (first = null)
            }
            var newMarkers = [first];
            if (!sameLine) {
                var gapMarkers, gap = change.text.length - 2;
                if (gap > 0 && first)
                    for (var i = 0; i < first.length; ++i) null == first[i].to && (gapMarkers || (gapMarkers = [])).push({
                        from: null,
                        to: null,
                        marker: first[i].marker
                    });
                for (var i = 0; i < gap; ++i) newMarkers.push(gapMarkers);
                newMarkers.push(last)
            }
            return newMarkers
        }

        function mergeOldSpans(doc, change) {
            var old = getOldSpans(doc, change),
                stretched = stretchSpansOverChange(doc, change);
            if (!old) return stretched;
            if (!stretched) return old;
            for (var i = 0; i < old.length; ++i) {
                var oldCur = old[i],
                    stretchCur = stretched[i];
                if (oldCur && stretchCur) spans: for (var j = 0; j < stretchCur.length; ++j) {
                    for (var span = stretchCur[j], k = 0; k < oldCur.length; ++k)
                        if (oldCur[k].marker == span.marker) continue spans;
                    oldCur.push(span)
                } else stretchCur && (old[i] = stretchCur)
            }
            return old
        }

        function removeReadOnlyRanges(doc, from, to) {
            var markers = null;
            if (doc.iter(from.line, to.line + 1, function(line) {
                    if (line.markedSpans)
                        for (var i = 0; i < line.markedSpans.length; ++i) {
                            var mark = line.markedSpans[i].marker;
                            !mark.readOnly || markers && indexOf(markers, mark) != -1 || (markers || (markers = [])).push(mark)
                        }
                }), !markers) return null;
            for (var parts = [{
                    from: from,
                    to: to
                }], i = 0; i < markers.length; ++i)
                for (var mk = markers[i], m = mk.find(), j = 0; j < parts.length; ++j) {
                    var p = parts[j];
                    if (!posLess(p.to, m.from) && !posLess(m.to, p.from)) {
                        var newParts = [j, 1];
                        (posLess(p.from, m.from) || !mk.inclusiveLeft && posEq(p.from, m.from)) && newParts.push({
                            from: p.from,
                            to: m.from
                        }), (posLess(m.to, p.to) || !mk.inclusiveRight && posEq(p.to, m.to)) && newParts.push({
                            from: m.to,
                            to: p.to
                        }), parts.splice.apply(parts, newParts), j += newParts.length - 1
                    }
                }
            return parts
        }

        function collapsedSpanAt(line, ch) {
            var found, sps = sawCollapsedSpans && line.markedSpans;
            if (sps)
                for (var sp, i = 0; i < sps.length; ++i) sp = sps[i], sp.marker.collapsed && (null == sp.from || sp.from < ch) && (null == sp.to || sp.to > ch) && (!found || found.width < sp.marker.width) && (found = sp.marker);
            return found
        }

        function collapsedSpanAtStart(line) {
            return collapsedSpanAt(line, -1)
        }

        function collapsedSpanAtEnd(line) {
            return collapsedSpanAt(line, line.text.length + 1)
        }

        function visualLine(doc, line) {
            for (var merged; merged = collapsedSpanAtStart(line);) line = getLine(doc, merged.find().from.line);
            return line
        }

        function lineIsHidden(doc, line) {
            var sps = sawCollapsedSpans && line.markedSpans;
            if (sps)
                for (var sp, i = 0; i < sps.length; ++i)
                    if (sp = sps[i], sp.marker.collapsed) {
                        if (null == sp.from) return !0;
                        if (!sp.marker.replacedWith && 0 == sp.from && sp.marker.inclusiveLeft && lineIsHiddenInner(doc, line, sp)) return !0
                    }
        }

        function lineIsHiddenInner(doc, line, span) {
            if (null == span.to) {
                var end = span.marker.find().to,
                    endLine = getLine(doc, end.line);
                return lineIsHiddenInner(doc, endLine, getMarkedSpanFor(endLine.markedSpans, span.marker))
            }
            if (span.marker.inclusiveRight && span.to == line.text.length) return !0;
            for (var sp, i = 0; i < line.markedSpans.length; ++i)
                if (sp = line.markedSpans[i], sp.marker.collapsed && !sp.marker.replacedWith && sp.from == span.to && (sp.marker.inclusiveLeft || span.marker.inclusiveRight) && lineIsHiddenInner(doc, line, sp)) return !0
        }

        function detachMarkedSpans(line) {
            var spans = line.markedSpans;
            if (spans) {
                for (var i = 0; i < spans.length; ++i) spans[i].marker.detachLine(line);
                line.markedSpans = null
            }
        }

        function attachMarkedSpans(line, spans) {
            if (spans) {
                for (var i = 0; i < spans.length; ++i) spans[i].marker.attachLine(line);
                line.markedSpans = spans
            }
        }

        function widgetOperation(f) {
            return function() {
                var withOp = !this.cm.curOp;
                withOp && startOperation(this.cm);
                try {
                    var result = f.apply(this, arguments)
                } finally {
                    withOp && endOperation(this.cm)
                }
                return result
            }
        }

        function widgetHeight(widget) {
            return null != widget.height ? widget.height : (widget.node.parentNode && 1 == widget.node.parentNode.nodeType || removeChildrenAndAdd(widget.cm.display.measure, elt("div", [widget.node], null, "position: relative")), widget.height = widget.node.offsetHeight)
        }

        function addLineWidget(cm, handle, node, options) {
            var widget = new LineWidget(cm, node, options);
            return widget.noHScroll && (cm.display.alignWidgets = !0), changeLine(cm, handle, function(line) {
                var widgets = line.widgets || (line.widgets = []);
                if (null == widget.insertAt ? widgets.push(widget) : widgets.splice(Math.min(widgets.length - 1, Math.max(0, widget.insertAt)), 0, widget), widget.line = line, !lineIsHidden(cm.doc, line) || widget.showIfHidden) {
                    var aboveVisible = heightAtLine(cm, line) < cm.doc.scrollTop;
                    updateLineHeight(line, line.height + widgetHeight(widget)), aboveVisible && addToScrollPos(cm, 0, widget.height)
                }
                return !0
            }), widget
        }

        function updateLine(line, text, markedSpans, estimateHeight) {
            line.text = text, line.stateAfter && (line.stateAfter = null), line.styles && (line.styles = null), null != line.order && (line.order = null), detachMarkedSpans(line), attachMarkedSpans(line, markedSpans);
            var estHeight = estimateHeight ? estimateHeight(line) : 1;
            estHeight != line.height && updateLineHeight(line, estHeight)
        }

        function cleanUpLine(line) {
            line.parent = null, detachMarkedSpans(line)
        }

        function runMode(cm, text, mode, state, f) {
            var flattenSpans = mode.flattenSpans;
            null == flattenSpans && (flattenSpans = cm.options.flattenSpans);
            var style, curStart = 0,
                curStyle = null,
                stream = new StringStream(text, cm.options.tabSize);
            for ("" == text && mode.blankLine && mode.blankLine(state); !stream.eol();) stream.pos > cm.options.maxHighlightLength ? (flattenSpans = !1, stream.pos = Math.min(text.length, stream.start + 5e4), style = null) : style = mode.token(stream, state), flattenSpans && curStyle == style || (curStart < stream.start && f(stream.start, curStyle), curStart = stream.start, curStyle = style), stream.start = stream.pos;
            curStart < stream.pos && f(stream.pos, curStyle)
        }

        function highlightLine(cm, line, state) {
            var st = [cm.state.modeGen];
            runMode(cm, line.text, cm.doc.mode, state, function(end, style) {
                st.push(end, style)
            });
            for (var o = 0; o < cm.state.overlays.length; ++o) {
                var overlay = cm.state.overlays[o],
                    i = 1,
                    at = 0;
                runMode(cm, line.text, overlay.mode, !0, function(end, style) {
                    for (var start = i; at < end;) {
                        var i_end = st[i];
                        i_end > end && st.splice(i, 1, end, st[i + 1], i_end), i += 2, at = Math.min(end, i_end)
                    }
                    if (style)
                        if (overlay.opaque) st.splice(start, i - start, end, style), i = start + 2;
                        else
                            for (; start < i; start += 2) {
                                var cur = st[start + 1];
                                st[start + 1] = cur ? cur + " " + style : style
                            }
                })
            }
            return st
        }

        function getLineStyles(cm, line) {
            return line.styles && line.styles[0] == cm.state.modeGen || (line.styles = highlightLine(cm, line, line.stateAfter = getStateBefore(cm, lineNo(line)))), line.styles
        }

        function processLine(cm, line, state) {
            var mode = cm.doc.mode,
                stream = new StringStream(line.text, cm.options.tabSize);
            for ("" == line.text && mode.blankLine && mode.blankLine(state); !stream.eol() && stream.pos <= cm.options.maxHighlightLength;) mode.token(stream, state), stream.start = stream.pos
        }

        function styleToClass(style) {
            return style ? styleToClassCache[style] || (styleToClassCache[style] = "cm-" + style.replace(/ +/g, " cm-")) : null
        }

        function lineContent(cm, realLine, measure, copyWidgets) {
            for (var merged, line = realLine, empty = !0; merged = collapsedSpanAtStart(line);) line = getLine(cm.doc, merged.find().from.line);
            var builder = {
                pre: elt("pre"),
                col: 0,
                pos: 0,
                measure: null,
                measuredSomething: !1,
                cm: cm,
                copyWidgets: copyWidgets
            };
            line.textClass && (builder.pre.className = line.textClass);
            do {
                line.text && (empty = !1), builder.measure = line == realLine && measure, builder.pos = 0, builder.addToken = builder.measure ? buildTokenMeasure : buildToken, (ie || webkit) && cm.getOption("lineWrapping") && (builder.addToken = buildTokenSplitSpaces(builder.addToken));
                var next = insertLineContent(line, builder, getLineStyles(cm, line));
                measure && line == realLine && !builder.measuredSomething && (measure[0] = builder.pre.appendChild(zeroWidthElement(cm.display.measure)), builder.measuredSomething = !0), next && (line = getLine(cm.doc, next.to.line))
            } while (next);
            !measure || builder.measuredSomething || measure[0] || (measure[0] = builder.pre.appendChild(empty ? elt("span", " ") : zeroWidthElement(cm.display.measure))), builder.pre.firstChild || lineIsHidden(cm.doc, realLine) || builder.pre.appendChild(document.createTextNode(" "));
            var order;
            if (measure && ie && (order = getOrder(line))) {
                var l = order.length - 1;
                order[l].from == order[l].to && --l;
                var last = order[l],
                    prev = order[l - 1];
                if (last.from + 1 == last.to && prev && last.level < prev.level) {
                    var span = measure[builder.pos - 1];
                    span && span.parentNode.insertBefore(span.measureRight = zeroWidthElement(cm.display.measure), span.nextSibling)
                }
            }
            return signal(cm, "renderLine", cm, realLine, builder.pre), builder.pre
        }

        function buildToken(builder, text, style, startStyle, endStyle, title) {
            if (text) {
                if (tokenSpecialChars.test(text))
                    for (var content = document.createDocumentFragment(), pos = 0;;) {
                        tokenSpecialChars.lastIndex = pos;
                        var m = tokenSpecialChars.exec(text),
                            skipped = m ? m.index - pos : text.length - pos;
                        if (skipped && (content.appendChild(document.createTextNode(text.slice(pos, pos + skipped))), builder.col += skipped), !m) break;
                        if (pos += skipped + 1, "\t" == m[0]) {
                            var tabSize = builder.cm.options.tabSize,
                                tabWidth = tabSize - builder.col % tabSize;
                            content.appendChild(elt("span", spaceStr(tabWidth), "cm-tab")), builder.col += tabWidth
                        } else {
                            var token = elt("span", "•", "cm-invalidchar");
                            token.title = "\\u" + m[0].charCodeAt(0).toString(16), content.appendChild(token), builder.col += 1
                        }
                    } else {
                        builder.col += text.length;
                        var content = document.createTextNode(text)
                    }
                if (style || startStyle || endStyle || builder.measure) {
                    var fullStyle = style || "";
                    startStyle && (fullStyle += startStyle), endStyle && (fullStyle += endStyle);
                    var token = elt("span", [content], fullStyle);
                    return title && (token.title = title), builder.pre.appendChild(token)
                }
                builder.pre.appendChild(content)
            }
        }

        function buildTokenMeasure(builder, text, style, startStyle, endStyle) {
            for (var wrapping = builder.cm.options.lineWrapping, i = 0; i < text.length; ++i) {
                var ch = text.charAt(i),
                    start = 0 == i;
                ch >= "�" && ch < "�" && i < text.length - 1 ? (ch = text.slice(i, i + 2), ++i) : i && wrapping && spanAffectsWrapping(text, i) && builder.pre.appendChild(elt("wbr"));
                var old = builder.measure[builder.pos],
                    span = builder.measure[builder.pos] = buildToken(builder, ch, style, start && startStyle, i == text.length - 1 && endStyle);
                old && (span.leftSide = old.leftSide || old), ie && wrapping && " " == ch && i && !/\s/.test(text.charAt(i - 1)) && i < text.length - 1 && !/\s/.test(text.charAt(i + 1)) && (span.style.whiteSpace = "normal"), builder.pos += ch.length
            }
            text.length && (builder.measuredSomething = !0)
        }

        function buildTokenSplitSpaces(inner) {
            function split(old) {
                for (var out = " ", i = 0; i < old.length - 2; ++i) out += i % 2 ? " " : " ";
                return out += " "
            }
            return function(builder, text, style, startStyle, endStyle, title) {
                return inner(builder, text.replace(/ {3,}/, split), style, startStyle, endStyle, title)
            }
        }

        function buildCollapsedSpan(builder, size, marker, ignoreWidget) {
            var widget = !ignoreWidget && marker.replacedWith;
            if (widget && (builder.copyWidgets && (widget = widget.cloneNode(!0)), builder.pre.appendChild(widget), builder.measure)) {
                if (size) builder.measure[builder.pos] = widget;
                else {
                    var elt = zeroWidthElement(builder.cm.display.measure);
                    if ("bookmark" != marker.type || marker.insertLeft) {
                        if (builder.measure[builder.pos]) return;
                        builder.measure[builder.pos] = builder.pre.insertBefore(elt, widget)
                    } else builder.measure[builder.pos] = builder.pre.appendChild(elt)
                }
                builder.measuredSomething = !0
            }
            builder.pos += size
        }

        function insertLineContent(line, builder, styles) {
            var spans = line.markedSpans,
                allText = line.text,
                at = 0;
            if (spans)
                for (var style, spanStyle, spanEndStyle, spanStartStyle, title, collapsed, len = allText.length, pos = 0, i = 1, text = "", nextChange = 0;;) {
                    if (nextChange == pos) {
                        spanStyle = spanEndStyle = spanStartStyle = title = "", collapsed = null, nextChange = 1 / 0;
                        for (var foundBookmarks = [], j = 0; j < spans.length; ++j) {
                            var sp = spans[j],
                                m = sp.marker;
                            sp.from <= pos && (null == sp.to || sp.to > pos) ? (null != sp.to && nextChange > sp.to && (nextChange = sp.to, spanEndStyle = ""), m.className && (spanStyle += " " + m.className), m.startStyle && sp.from == pos && (spanStartStyle += " " + m.startStyle), m.endStyle && sp.to == nextChange && (spanEndStyle += " " + m.endStyle), m.title && !title && (title = m.title), m.collapsed && (!collapsed || collapsed.marker.size < m.size) && (collapsed = sp)) : sp.from > pos && nextChange > sp.from && (nextChange = sp.from), "bookmark" == m.type && sp.from == pos && m.replacedWith && foundBookmarks.push(m)
                        }
                        if (collapsed && (collapsed.from || 0) == pos && (buildCollapsedSpan(builder, (null == collapsed.to ? len : collapsed.to) - pos, collapsed.marker, null == collapsed.from), null == collapsed.to)) return collapsed.marker.find();
                        if (!collapsed && foundBookmarks.length)
                            for (var j = 0; j < foundBookmarks.length; ++j) buildCollapsedSpan(builder, 0, foundBookmarks[j])
                    }
                    if (pos >= len) break;
                    for (var upto = Math.min(len, nextChange);;) {
                        if (text) {
                            var end = pos + text.length;
                            if (!collapsed) {
                                var tokenText = end > upto ? text.slice(0, upto - pos) : text;
                                builder.addToken(builder, tokenText, style ? style + spanStyle : spanStyle, spanStartStyle, pos + tokenText.length == nextChange ? spanEndStyle : "", title)
                            }
                            if (end >= upto) {
                                text = text.slice(upto - pos), pos = upto;
                                break
                            }
                            pos = end, spanStartStyle = ""
                        }
                        text = allText.slice(at, at = styles[i++]), style = styleToClass(styles[i++])
                    }
                } else
                    for (var i = 1; i < styles.length; i += 2) builder.addToken(builder, allText.slice(at, at = styles[i]), styleToClass(styles[i + 1]))
        }

        function updateDoc(doc, change, markedSpans, selAfter, estimateHeight) {
            function spansFor(n) {
                return markedSpans ? markedSpans[n] : null
            }

            function update(line, text, spans) {
                updateLine(line, text, spans, estimateHeight), signalLater(line, "change", line, change)
            }
            var from = change.from,
                to = change.to,
                text = change.text,
                firstLine = getLine(doc, from.line),
                lastLine = getLine(doc, to.line),
                lastText = lst(text),
                lastSpans = spansFor(text.length - 1),
                nlines = to.line - from.line;
            if (0 == from.ch && 0 == to.ch && "" == lastText) {
                for (var i = 0, e = text.length - 1, added = []; i < e; ++i) added.push(new Line(text[i], spansFor(i), estimateHeight));
                update(lastLine, lastLine.text, lastSpans), nlines && doc.remove(from.line, nlines), added.length && doc.insert(from.line, added)
            } else if (firstLine == lastLine)
                if (1 == text.length) update(firstLine, firstLine.text.slice(0, from.ch) + lastText + firstLine.text.slice(to.ch), lastSpans);
                else {
                    for (var added = [], i = 1, e = text.length - 1; i < e; ++i) added.push(new Line(text[i], spansFor(i), estimateHeight));
                    added.push(new Line(lastText + firstLine.text.slice(to.ch), lastSpans, estimateHeight)), update(firstLine, firstLine.text.slice(0, from.ch) + text[0], spansFor(0)), doc.insert(from.line + 1, added)
                }
            else if (1 == text.length) update(firstLine, firstLine.text.slice(0, from.ch) + text[0] + lastLine.text.slice(to.ch), spansFor(0)), doc.remove(from.line + 1, nlines);
            else {
                update(firstLine, firstLine.text.slice(0, from.ch) + text[0], spansFor(0)), update(lastLine, lastText + lastLine.text.slice(to.ch), lastSpans);
                for (var i = 1, e = text.length - 1, added = []; i < e; ++i) added.push(new Line(text[i], spansFor(i), estimateHeight));
                nlines > 1 && doc.remove(from.line + 1, nlines - 1), doc.insert(from.line + 1, added)
            }
            signalLater(doc, "change", doc, change), setSelection(doc, selAfter.anchor, selAfter.head, null, !0)
        }

        function LeafChunk(lines) {
            this.lines = lines, this.parent = null;
            for (var i = 0, e = lines.length, height = 0; i < e; ++i) lines[i].parent = this, height += lines[i].height;
            this.height = height
        }

        function BranchChunk(children) {
            this.children = children;
            for (var size = 0, height = 0, i = 0, e = children.length; i < e; ++i) {
                var ch = children[i];
                size += ch.chunkSize(), height += ch.height, ch.parent = this
            }
            this.size = size, this.height = height, this.parent = null
        }

        function linkedDocs(doc, f, sharedHistOnly) {
            function propagate(doc, skip, sharedHist) {
                if (doc.linked)
                    for (var i = 0; i < doc.linked.length; ++i) {
                        var rel = doc.linked[i];
                        if (rel.doc != skip) {
                            var shared = sharedHist && rel.sharedHist;
                            sharedHistOnly && !shared || (f(rel.doc, shared), propagate(rel.doc, doc, shared))
                        }
                    }
            }
            propagate(doc, null, !0)
        }

        function attachDoc(cm, doc) {
            if (doc.cm) throw new Error("This document is already in use.");
            cm.doc = doc, doc.cm = cm, estimateLineHeights(cm), loadMode(cm), cm.options.lineWrapping || computeMaxLength(cm), cm.options.mode = doc.modeOption, regChange(cm)
        }

        function getLine(chunk, n) {
            for (n -= chunk.first; !chunk.lines;)
                for (var i = 0;; ++i) {
                    var child = chunk.children[i],
                        sz = child.chunkSize();
                    if (n < sz) {
                        chunk = child;
                        break
                    }
                    n -= sz
                }
            return chunk.lines[n]
        }

        function getBetween(doc, start, end) {
            var out = [],
                n = start.line;
            return doc.iter(start.line, end.line + 1, function(line) {
                var text = line.text;
                n == end.line && (text = text.slice(0, end.ch)), n == start.line && (text = text.slice(start.ch)), out.push(text), ++n
            }), out
        }

        function getLines(doc, from, to) {
            var out = [];
            return doc.iter(from, to, function(line) {
                out.push(line.text)
            }), out
        }

        function updateLineHeight(line, height) {
            for (var diff = height - line.height, n = line; n; n = n.parent) n.height += diff
        }

        function lineNo(line) {
            if (null == line.parent) return null;
            for (var cur = line.parent, no = indexOf(cur.lines, line), chunk = cur.parent; chunk; cur = chunk, chunk = chunk.parent)
                for (var i = 0; chunk.children[i] != cur; ++i) no += chunk.children[i].chunkSize();
            return no + cur.first
        }

        function lineAtHeight(chunk, h) {
            var n = chunk.first;
            outer: do {
                for (var i = 0, e = chunk.children.length; i < e; ++i) {
                    var child = chunk.children[i],
                        ch = child.height;
                    if (h < ch) {
                        chunk = child;
                        continue outer
                    }
                    h -= ch, n += child.chunkSize()
                }
                return n
            } while (!chunk.lines);
            for (var i = 0, e = chunk.lines.length; i < e; ++i) {
                var line = chunk.lines[i],
                    lh = line.height;
                if (h < lh) break;
                h -= lh
            }
            return n + i
        }

        function heightAtLine(cm, lineObj) {
            lineObj = visualLine(cm.doc, lineObj);
            for (var h = 0, chunk = lineObj.parent, i = 0; i < chunk.lines.length; ++i) {
                var line = chunk.lines[i];
                if (line == lineObj) break;
                h += line.height
            }
            for (var p = chunk.parent; p; chunk = p, p = chunk.parent)
                for (var i = 0; i < p.children.length; ++i) {
                    var cur = p.children[i];
                    if (cur == chunk) break;
                    h += cur.height
                }
            return h
        }

        function getOrder(line) {
            var order = line.order;
            return null == order && (order = line.order = bidiOrdering(line.text)), order
        }

        function makeHistory(startGen) {
            return {
                done: [],
                undone: [],
                undoDepth: 1 / 0,
                lastTime: 0,
                lastOp: null,
                lastOrigin: null,
                generation: startGen || 1,
                maxGeneration: startGen || 1
            }
        }

        function attachLocalSpans(doc, change, from, to) {
            var existing = change["spans_" + doc.id],
                n = 0;
            doc.iter(Math.max(doc.first, from), Math.min(doc.first + doc.size, to), function(line) {
                line.markedSpans && ((existing || (existing = change["spans_" + doc.id] = {}))[n] = line.markedSpans), ++n
            })
        }

        function historyChangeFromChange(doc, change) {
            var from = {
                    line: change.from.line,
                    ch: change.from.ch
                },
                histChange = {
                    from: from,
                    to: changeEnd(change),
                    text: getBetween(doc, change.from, change.to)
                };
            return attachLocalSpans(doc, histChange, change.from.line, change.to.line + 1), linkedDocs(doc, function(doc) {
                attachLocalSpans(doc, histChange, change.from.line, change.to.line + 1)
            }, !0), histChange
        }

        function addToHistory(doc, change, selAfter, opId) {
            var hist = doc.history;
            hist.undone.length = 0;
            var time = +new Date,
                cur = lst(hist.done);
            if (cur && (hist.lastOp == opId || hist.lastOrigin == change.origin && change.origin && ("+" == change.origin.charAt(0) && doc.cm && hist.lastTime > time - doc.cm.options.historyEventDelay || "*" == change.origin.charAt(0)))) {
                var last = lst(cur.changes);
                posEq(change.from, change.to) && posEq(change.from, last.to) ? last.to = changeEnd(change) : cur.changes.push(historyChangeFromChange(doc, change)), cur.anchorAfter = selAfter.anchor, cur.headAfter = selAfter.head
            } else
                for (cur = {
                        changes: [historyChangeFromChange(doc, change)],
                        generation: hist.generation,
                        anchorBefore: doc.sel.anchor,
                        headBefore: doc.sel.head,
                        anchorAfter: selAfter.anchor,
                        headAfter: selAfter.head
                    }, hist.done.push(cur), hist.generation = ++hist.maxGeneration; hist.done.length > hist.undoDepth;) hist.done.shift();
            hist.lastTime = time, hist.lastOp = opId, hist.lastOrigin = change.origin
        }

        function removeClearedSpans(spans) {
            if (!spans) return null;
            for (var out, i = 0; i < spans.length; ++i) spans[i].marker.explicitlyCleared ? out || (out = spans.slice(0, i)) : out && out.push(spans[i]);
            return out ? out.length ? out : null : spans
        }

        function getOldSpans(doc, change) {
            var found = change["spans_" + doc.id];
            if (!found) return null;
            for (var i = 0, nw = []; i < change.text.length; ++i) nw.push(removeClearedSpans(found[i]));
            return nw
        }

        function copyHistoryArray(events, newGroup) {
            for (var i = 0, copy = []; i < events.length; ++i) {
                var event = events[i],
                    changes = event.changes,
                    newChanges = [];
                copy.push({
                    changes: newChanges,
                    anchorBefore: event.anchorBefore,
                    headBefore: event.headBefore,
                    anchorAfter: event.anchorAfter,
                    headAfter: event.headAfter
                });
                for (var j = 0; j < changes.length; ++j) {
                    var m, change = changes[j];
                    if (newChanges.push({
                            from: change.from,
                            to: change.to,
                            text: change.text
                        }), newGroup)
                        for (var prop in change)(m = prop.match(/^spans_(\d+)$/)) && indexOf(newGroup, Number(m[1])) > -1 && (lst(newChanges)[prop] = change[prop], delete change[prop])
                }
            }
            return copy
        }

        function rebaseHistSel(pos, from, to, diff) {
            to < pos.line ? pos.line += diff : from < pos.line && (pos.line = from, pos.ch = 0)
        }

        function rebaseHistArray(array, from, to, diff) {
            for (var i = 0; i < array.length; ++i) {
                for (var sub = array[i], ok = !0, j = 0; j < sub.changes.length; ++j) {
                    var cur = sub.changes[j];
                    if (sub.copied || (cur.from = copyPos(cur.from), cur.to = copyPos(cur.to)), to < cur.from.line) cur.from.line += diff, cur.to.line += diff;
                    else if (from <= cur.to.line) {
                        ok = !1;
                        break
                    }
                }
                sub.copied || (sub.anchorBefore = copyPos(sub.anchorBefore), sub.headBefore = copyPos(sub.headBefore), sub.anchorAfter = copyPos(sub.anchorAfter), sub.readAfter = copyPos(sub.headAfter), sub.copied = !0), ok ? (rebaseHistSel(sub.anchorBefore), rebaseHistSel(sub.headBefore), rebaseHistSel(sub.anchorAfter), rebaseHistSel(sub.headAfter)) : (array.splice(0, i + 1), i = 0)
            }
        }

        function rebaseHist(hist, change) {
            var from = change.from.line,
                to = change.to.line,
                diff = change.text.length - (to - from) - 1;
            rebaseHistArray(hist.done, from, to, diff), rebaseHistArray(hist.undone, from, to, diff)
        }

        function stopMethod() {
            e_stop(this)
        }

        function addStop(event) {
            return event.stop || (event.stop = stopMethod), event
        }

        function e_preventDefault(e) {
            e.preventDefault ? e.preventDefault() : e.returnValue = !1
        }

        function e_stopPropagation(e) {
            e.stopPropagation ? e.stopPropagation() : e.cancelBubble = !0
        }

        function e_defaultPrevented(e) {
            return null != e.defaultPrevented ? e.defaultPrevented : 0 == e.returnValue
        }

        function e_stop(e) {
            e_preventDefault(e), e_stopPropagation(e)
        }

        function e_target(e) {
            return e.target || e.srcElement
        }

        function e_button(e) {
            var b = e.which;
            return null == b && (1 & e.button ? b = 1 : 2 & e.button ? b = 3 : 4 & e.button && (b = 2)), mac && e.ctrlKey && 1 == b && (b = 3), b
        }

        function on(emitter, type, f) {
            if (emitter.addEventListener) emitter.addEventListener(type, f, !1);
            else if (emitter.attachEvent) emitter.attachEvent("on" + type, f);
            else {
                var map = emitter._handlers || (emitter._handlers = {}),
                    arr = map[type] || (map[type] = []);
                arr.push(f)
            }
        }

        function off(emitter, type, f) {
            if (emitter.removeEventListener) emitter.removeEventListener(type, f, !1);
            else if (emitter.detachEvent) emitter.detachEvent("on" + type, f);
            else {
                var arr = emitter._handlers && emitter._handlers[type];
                if (!arr) return;
                for (var i = 0; i < arr.length; ++i)
                    if (arr[i] == f) {
                        arr.splice(i, 1);
                        break
                    }
            }
        }

        function signal(emitter, type) {
            var arr = emitter._handlers && emitter._handlers[type];
            if (arr)
                for (var args = Array.prototype.slice.call(arguments, 2), i = 0; i < arr.length; ++i) arr[i].apply(null, args)
        }

        function signalLater(emitter, type) {
            function bnd(f) {
                return function() {
                    f.apply(null, args)
                }
            }
            var arr = emitter._handlers && emitter._handlers[type];
            if (arr) {
                var args = Array.prototype.slice.call(arguments, 2);
                delayedCallbacks || (++delayedCallbackDepth, delayedCallbacks = [], setTimeout(fireDelayed, 0));
                for (var i = 0; i < arr.length; ++i) delayedCallbacks.push(bnd(arr[i]))
            }
        }

        function signalDOMEvent(cm, e, override) {
            return signal(cm, override || e.type, cm, e), e_defaultPrevented(e) || e.codemirrorIgnore
        }

        function fireDelayed() {
            --delayedCallbackDepth;
            var delayed = delayedCallbacks;
            delayedCallbacks = null;
            for (var i = 0; i < delayed.length; ++i) delayed[i]()
        }

        function hasHandler(emitter, type) {
            var arr = emitter._handlers && emitter._handlers[type];
            return arr && arr.length > 0
        }

        function eventMixin(ctor) {
            ctor.prototype.on = function(type, f) {
                on(this, type, f)
            }, ctor.prototype.off = function(type, f) {
                off(this, type, f)
            }
        }

        function Delayed() {
            this.id = null
        }

        function countColumn(string, end, tabSize, startIndex, startValue) {
            null == end && (end = string.search(/[^\s\u00a0]/), end == -1 && (end = string.length));
            for (var i = startIndex || 0, n = startValue || 0; i < end; ++i) "\t" == string.charAt(i) ? n += tabSize - n % tabSize : ++n;
            return n
        }

        function spaceStr(n) {
            for (; spaceStrs.length <= n;) spaceStrs.push(lst(spaceStrs) + " ");
            return spaceStrs[n]
        }

        function lst(arr) {
            return arr[arr.length - 1]
        }

        function selectInput(node) {
            if (ios) node.selectionStart = 0, node.selectionEnd = node.value.length;
            else try {
                node.select()
            } catch (_e) {}
        }

        function indexOf(collection, elt) {
            if (collection.indexOf) return collection.indexOf(elt);
            for (var i = 0, e = collection.length; i < e; ++i)
                if (collection[i] == elt) return i;
            return -1
        }

        function createObj(base, props) {
            function Obj() {}
            Obj.prototype = base;
            var inst = new Obj;
            return props && copyObj(props, inst), inst
        }

        function copyObj(obj, target) {
            target || (target = {});
            for (var prop in obj) obj.hasOwnProperty(prop) && (target[prop] = obj[prop]);
            return target
        }

        function emptyArray(size) {
            for (var a = [], i = 0; i < size; ++i) a.push(void 0);
            return a
        }

        function bind(f) {
            var args = Array.prototype.slice.call(arguments, 1);
            return function() {
                return f.apply(null, args)
            }
        }

        function isWordChar(ch) {
            return /\w/.test(ch) || ch > "" && (ch.toUpperCase() != ch.toLowerCase() || nonASCIISingleCaseWordChar.test(ch))
        }

        function isEmpty(obj) {
            for (var n in obj)
                if (obj.hasOwnProperty(n) && obj[n]) return !1;
            return !0
        }

        function elt(tag, content, className, style) {
            var e = document.createElement(tag);
            if (className && (e.className = className), style && (e.style.cssText = style), "string" == typeof content) setTextContent(e, content);
            else if (content)
                for (var i = 0; i < content.length; ++i) e.appendChild(content[i]);
            return e
        }

        function removeChildren(e) {
            for (var count = e.childNodes.length; count > 0; --count) e.removeChild(e.firstChild);
            return e
        }

        function removeChildrenAndAdd(parent, e) {
            return removeChildren(parent).appendChild(e)
        }

        function setTextContent(e, str) {
            ie_lt9 ? (e.innerHTML = "", e.appendChild(document.createTextNode(str))) : e.textContent = str
        }

        function getRect(node) {
            return node.getBoundingClientRect()
        }

        function spanAffectsWrapping() {
            return !1
        }

        function scrollbarWidth(measure) {
            if (null != knownScrollbarWidth) return knownScrollbarWidth;
            var test = elt("div", null, null, "width: 50px; height: 50px; overflow-x: scroll");
            return removeChildrenAndAdd(measure, test), test.offsetWidth && (knownScrollbarWidth = test.offsetHeight - test.clientHeight), knownScrollbarWidth || 0
        }

        function zeroWidthElement(measure) {
            if (null == zwspSupported) {
                var test = elt("span", "​");
                removeChildrenAndAdd(measure, elt("span", [test, document.createTextNode("x")])), 0 != measure.firstChild.offsetHeight && (zwspSupported = test.offsetWidth <= 1 && test.offsetHeight > 2 && !ie_lt8)
            }
            return zwspSupported ? elt("span", "​") : elt("span", " ", null, "display: inline-block; width: 1px; margin-right: -1px")
        }

        function iterateBidiSections(order, from, to, f) {
            if (!order) return f(from, to, "ltr");
            for (var found = !1, i = 0; i < order.length; ++i) {
                var part = order[i];
                (part.from < to && part.to > from || from == to && part.to == from) && (f(Math.max(part.from, from), Math.min(part.to, to), 1 == part.level ? "rtl" : "ltr"), found = !0)
            }
            found || f(from, to, "ltr")
        }

        function bidiLeft(part) {
            return part.level % 2 ? part.to : part.from
        }

        function bidiRight(part) {
            return part.level % 2 ? part.from : part.to
        }

        function lineLeft(line) {
            var order = getOrder(line);
            return order ? bidiLeft(order[0]) : 0
        }

        function lineRight(line) {
            var order = getOrder(line);
            return order ? bidiRight(lst(order)) : line.text.length
        }

        function lineStart(cm, lineN) {
            var line = getLine(cm.doc, lineN),
                visual = visualLine(cm.doc, line);
            visual != line && (lineN = lineNo(visual));
            var order = getOrder(visual),
                ch = order ? order[0].level % 2 ? lineRight(visual) : lineLeft(visual) : 0;
            return Pos(lineN, ch)
        }

        function lineEnd(cm, lineN) {
            for (var merged, line; merged = collapsedSpanAtEnd(line = getLine(cm.doc, lineN));) lineN = merged.find().to.line;
            var order = getOrder(line),
                ch = order ? order[0].level % 2 ? lineLeft(line) : lineRight(line) : line.text.length;
            return Pos(lineN, ch)
        }

        function compareBidiLevel(order, a, b) {
            var linedir = order[0].level;
            return a == linedir || b != linedir && a < b
        }

        function getBidiPartAt(order, pos) {
            for (var found, i = 0; i < order.length; ++i) {
                var cur = order[i];
                if (cur.from < pos && cur.to > pos) return bidiOther = null, i;
                if (cur.from == pos || cur.to == pos) {
                    if (null != found) return compareBidiLevel(order, cur.level, order[found].level) ? (bidiOther = found, i) : (bidiOther = i, found);
                    found = i
                }
            }
            return bidiOther = null, found
        }

        function moveInLine(line, pos, dir, byUnit) {
            if (!byUnit) return pos + dir;
            do pos += dir; while (pos > 0 && isExtendingChar.test(line.text.charAt(pos)));
            return pos
        }

        function moveVisually(line, start, dir, byUnit) {
            var bidi = getOrder(line);
            if (!bidi) return moveLogically(line, start, dir, byUnit);
            for (var pos = getBidiPartAt(bidi, start), part = bidi[pos], target = moveInLine(line, start, part.level % 2 ? -dir : dir, byUnit);;) {
                if (target > part.from && target < part.to) return target;
                if (target == part.from || target == part.to) return getBidiPartAt(bidi, target) == pos ? target : (part = bidi[pos += dir], dir > 0 == part.level % 2 ? part.to : part.from);
                if (part = bidi[pos += dir], !part) return null;
                target = dir > 0 == part.level % 2 ? moveInLine(line, part.to, -1, byUnit) : moveInLine(line, part.from, 1, byUnit)
            }
        }

        function moveLogically(line, start, dir, byUnit) {
            var target = start + dir;
            if (byUnit)
                for (; target > 0 && isExtendingChar.test(line.text.charAt(target));) target += dir;
            return target < 0 || target > line.text.length ? null : target
        }
        var gecko = /gecko\/\d/i.test(navigator.userAgent),
            ie = /MSIE \d/.test(navigator.userAgent),
            ie_lt8 = ie && (null == document.documentMode || document.documentMode < 8),
            ie_lt9 = ie && (null == document.documentMode || document.documentMode < 9),
            webkit = /WebKit\//.test(navigator.userAgent),
            qtwebkit = webkit && /Qt\/\d+\.\d+/.test(navigator.userAgent),
            chrome = /Chrome\//.test(navigator.userAgent),
            opera = /Opera\//.test(navigator.userAgent),
            safari = /Apple Computer/.test(navigator.vendor),
            khtml = /KHTML\//.test(navigator.userAgent),
            mac_geLion = /Mac OS X 1\d\D([7-9]|\d\d)\D/.test(navigator.userAgent),
            mac_geMountainLion = /Mac OS X 1\d\D([8-9]|\d\d)\D/.test(navigator.userAgent),
            phantom = /PhantomJS/.test(navigator.userAgent),
            ios = /AppleWebKit/.test(navigator.userAgent) && /Mobile\/\w+/.test(navigator.userAgent),
            mobile = ios || /Android|webOS|BlackBerry|Opera Mini|Opera Mobi|IEMobile/i.test(navigator.userAgent),
            mac = ios || /Mac/.test(navigator.platform),
            windows = /win/i.test(navigator.platform),
            opera_version = opera && navigator.userAgent.match(/Version\/(\d*\.\d*)/);
        opera_version && (opera_version = Number(opera_version[1])), opera_version && opera_version >= 15 && (opera = !1, webkit = !0);
        var measureText, lastClick, lastDoubleClick, flipCtrlCmd = mac && (qtwebkit || opera && (null == opera_version || opera_version < 12.11)),
            captureMiddleClick = gecko || ie && !ie_lt9,
            sawReadOnlySpans = !1,
            sawCollapsedSpans = !1,
            nextOpId = 0,
            lastDrop = 0,
            wheelSamples = 0,
            wheelPixelsPerUnit = null;
        ie ? wheelPixelsPerUnit = -.53 : gecko ? wheelPixelsPerUnit = 15 : chrome ? wheelPixelsPerUnit = -.7 : safari && (wheelPixelsPerUnit = -1 / 3);
        var maybeTransition, detectingSelectAll, lastStoppedKey = null,
            changeEnd = CodeMirror.changeEnd = function(change) {
                return change.text ? Pos(change.from.line + change.text.length - 1, lst(change.text).length + (1 == change.text.length ? change.from.ch : 0)) : change.to
            };
        CodeMirror.Pos = Pos, CodeMirror.prototype = {
            constructor: CodeMirror,
            focus: function() {
                window.focus(), focusInput(this), onFocus(this), fastPoll(this)
            },
            setOption: function(option, value) {
                var options = this.options,
                    old = options[option];
                options[option] == value && "mode" != option || (options[option] = value, optionHandlers.hasOwnProperty(option) && operation(this, optionHandlers[option])(this, value, old))
            },
            getOption: function(option) {
                return this.options[option]
            },
            getDoc: function() {
                return this.doc
            },
            addKeyMap: function(map, bottom) {
                this.state.keyMaps[bottom ? "push" : "unshift"](map)
            },
            removeKeyMap: function(map) {
                for (var maps = this.state.keyMaps, i = 0; i < maps.length; ++i)
                    if (maps[i] == map || "string" != typeof maps[i] && maps[i].name == map) return maps.splice(i, 1), !0
            },
            addOverlay: operation(null, function(spec, options) {
                var mode = spec.token ? spec : CodeMirror.getMode(this.options, spec);
                if (mode.startState) throw new Error("Overlays may not be stateful.");
                this.state.overlays.push({
                    mode: mode,
                    modeSpec: spec,
                    opaque: options && options.opaque
                }), this.state.modeGen++, regChange(this)
            }),
            removeOverlay: operation(null, function(spec) {
                for (var overlays = this.state.overlays, i = 0; i < overlays.length; ++i) {
                    var cur = overlays[i].modeSpec;
                    if (cur == spec || "string" == typeof spec && cur.name == spec) return overlays.splice(i, 1), this.state.modeGen++, void regChange(this)
                }
            }),
            indentLine: operation(null, function(n, dir, aggressive) {
                "string" != typeof dir && "number" != typeof dir && (dir = null == dir ? this.options.smartIndent ? "smart" : "prev" : dir ? "add" : "subtract"), isLine(this.doc, n) && indentLine(this, n, dir, aggressive)
            }),
            indentSelection: operation(null, function(how) {
                var sel = this.doc.sel;
                if (posEq(sel.from, sel.to)) return indentLine(this, sel.from.line, how);
                for (var e = sel.to.line - (sel.to.ch ? 0 : 1), i = sel.from.line; i <= e; ++i) indentLine(this, i, how)
            }),
            getTokenAt: function(pos, precise) {
                var doc = this.doc;
                pos = clipPos(doc, pos);
                for (var state = getStateBefore(this, pos.line, precise), mode = this.doc.mode, line = getLine(doc, pos.line), stream = new StringStream(line.text, this.options.tabSize); stream.pos < pos.ch && !stream.eol();) {
                    stream.start = stream.pos;
                    var style = mode.token(stream, state)
                }
                return {
                    start: stream.start,
                    end: stream.pos,
                    string: stream.current(),
                    className: style || null,
                    type: style || null,
                    state: state
                }
            },
            getTokenTypeAt: function(pos) {
                pos = clipPos(this.doc, pos);
                var styles = getLineStyles(this, getLine(this.doc, pos.line)),
                    before = 0,
                    after = (styles.length - 1) / 2,
                    ch = pos.ch;
                if (0 == ch) return styles[2];
                for (;;) {
                    var mid = before + after >> 1;
                    if ((mid ? styles[2 * mid - 1] : 0) >= ch) after = mid;
                    else {
                        if (!(styles[2 * mid + 1] < ch)) return styles[2 * mid + 2];
                        before = mid + 1
                    }
                }
            },
            getModeAt: function(pos) {
                var mode = this.doc.mode;
                return mode.innerMode ? CodeMirror.innerMode(mode, this.getTokenAt(pos).state).mode : mode
            },
            getHelper: function(pos, type) {
                if (helpers.hasOwnProperty(type)) {
                    var help = helpers[type],
                        mode = this.getModeAt(pos);
                    return mode[type] && help[mode[type]] || mode.helperType && help[mode.helperType] || help[mode.name]
                }
            },
            getStateAfter: function(line, precise) {
                var doc = this.doc;
                return line = clipLine(doc, null == line ? doc.first + doc.size - 1 : line), getStateBefore(this, line + 1, precise)
            },
            cursorCoords: function(start, mode) {
                var pos, sel = this.doc.sel;
                return pos = null == start ? sel.head : "object" == typeof start ? clipPos(this.doc, start) : start ? sel.from : sel.to, cursorCoords(this, pos, mode || "page")
            },
            charCoords: function(pos, mode) {
                return charCoords(this, clipPos(this.doc, pos), mode || "page")
            },
            coordsChar: function(coords, mode) {
                return coords = fromCoordSystem(this, coords, mode || "page"), coordsChar(this, coords.left, coords.top)
            },
            lineAtHeight: function(height, mode) {
                return height = fromCoordSystem(this, {
                    top: height,
                    left: 0
                }, mode || "page").top, lineAtHeight(this.doc, height + this.display.viewOffset)
            },
            heightAtLine: function(line, mode) {
                var end = !1,
                    last = this.doc.first + this.doc.size - 1;
                line < this.doc.first ? line = this.doc.first : line > last && (line = last, end = !0);
                var lineObj = getLine(this.doc, line);
                return intoCoordSystem(this, getLine(this.doc, line), {
                    top: 0,
                    left: 0
                }, mode || "page").top + (end ? lineObj.height : 0)
            },
            defaultTextHeight: function() {
                return textHeight(this.display)
            },
            defaultCharWidth: function() {
                return charWidth(this.display)
            },
            setGutterMarker: operation(null, function(line, gutterID, value) {
                return changeLine(this, line, function(line) {
                    var markers = line.gutterMarkers || (line.gutterMarkers = {});
                    return markers[gutterID] = value, !value && isEmpty(markers) && (line.gutterMarkers = null), !0
                })
            }),
            clearGutter: operation(null, function(gutterID) {
                var cm = this,
                    doc = cm.doc,
                    i = doc.first;
                doc.iter(function(line) {
                    line.gutterMarkers && line.gutterMarkers[gutterID] && (line.gutterMarkers[gutterID] = null, regChange(cm, i, i + 1), isEmpty(line.gutterMarkers) && (line.gutterMarkers = null)), ++i
                })
            }),
            addLineClass: operation(null, function(handle, where, cls) {
                return changeLine(this, handle, function(line) {
                    var prop = "text" == where ? "textClass" : "background" == where ? "bgClass" : "wrapClass";
                    if (line[prop]) {
                        if (new RegExp("(?:^|\\s)" + cls + "(?:$|\\s)").test(line[prop])) return !1;
                        line[prop] += " " + cls
                    } else line[prop] = cls;
                    return !0
                })
            }),
            removeLineClass: operation(null, function(handle, where, cls) {
                return changeLine(this, handle, function(line) {
                    var prop = "text" == where ? "textClass" : "background" == where ? "bgClass" : "wrapClass",
                        cur = line[prop];
                    if (!cur) return !1;
                    if (null == cls) line[prop] = null;
                    else {
                        var found = cur.match(new RegExp("(?:^|\\s+)" + cls + "(?:$|\\s+)"));
                        if (!found) return !1;
                        var end = found.index + found[0].length;
                        line[prop] = cur.slice(0, found.index) + (found.index && end != cur.length ? " " : "") + cur.slice(end) || null
                    }
                    return !0
                })
            }),
            addLineWidget: operation(null, function(handle, node, options) {
                return addLineWidget(this, handle, node, options)
            }),
            removeLineWidget: function(widget) {
                widget.clear()
            },
            lineInfo: function(line) {
                if ("number" == typeof line) {
                    if (!isLine(this.doc, line)) return null;
                    var n = line;
                    if (line = getLine(this.doc, line), !line) return null
                } else {
                    var n = lineNo(line);
                    if (null == n) return null
                }
                return {
                    line: n,
                    handle: line,
                    text: line.text,
                    gutterMarkers: line.gutterMarkers,
                    textClass: line.textClass,
                    bgClass: line.bgClass,
                    wrapClass: line.wrapClass,
                    widgets: line.widgets
                }
            },
            getViewport: function() {
                return {
                    from: this.display.showingFrom,
                    to: this.display.showingTo
                }
            },
            addWidget: function(pos, node, scroll, vert, horiz) {
                var display = this.display;
                pos = cursorCoords(this, clipPos(this.doc, pos));
                var top = pos.bottom,
                    left = pos.left;
                if (node.style.position = "absolute", display.sizer.appendChild(node), "over" == vert) top = pos.top;
                else if ("above" == vert || "near" == vert) {
                    var vspace = Math.max(display.wrapper.clientHeight, this.doc.height),
                        hspace = Math.max(display.sizer.clientWidth, display.lineSpace.clientWidth);
                    ("above" == vert || pos.bottom + node.offsetHeight > vspace) && pos.top > node.offsetHeight ? top = pos.top - node.offsetHeight : pos.bottom + node.offsetHeight <= vspace && (top = pos.bottom), left + node.offsetWidth > hspace && (left = hspace - node.offsetWidth)
                }
                node.style.top = top + "px", node.style.left = node.style.right = "", "right" == horiz ? (left = display.sizer.clientWidth - node.offsetWidth, node.style.right = "0px") : ("left" == horiz ? left = 0 : "middle" == horiz && (left = (display.sizer.clientWidth - node.offsetWidth) / 2), node.style.left = left + "px"), scroll && scrollIntoView(this, left, top, left + node.offsetWidth, top + node.offsetHeight)
            },
            triggerOnKeyDown: operation(null, onKeyDown),
            execCommand: function(cmd) {
                return commands[cmd](this)
            },
            findPosH: function(from, amount, unit, visually) {
                var dir = 1;
                amount < 0 && (dir = -1, amount = -amount);
                for (var i = 0, cur = clipPos(this.doc, from); i < amount && (cur = findPosH(this.doc, cur, dir, unit, visually), !cur.hitSide); ++i);
                return cur
            },
            moveH: operation(null, function(dir, unit) {
                var pos, sel = this.doc.sel;
                pos = sel.shift || sel.extend || posEq(sel.from, sel.to) ? findPosH(this.doc, sel.head, dir, unit, this.options.rtlMoveVisually) : dir < 0 ? sel.from : sel.to, extendSelection(this.doc, pos, pos, dir)
            }),
            deleteH: operation(null, function(dir, unit) {
                var sel = this.doc.sel;
                posEq(sel.from, sel.to) ? replaceRange(this.doc, "", sel.from, findPosH(this.doc, sel.head, dir, unit, !1), "+delete") : replaceRange(this.doc, "", sel.from, sel.to, "+delete"), this.curOp.userSelChange = !0
            }),
            findPosV: function(from, amount, unit, goalColumn) {
                var dir = 1,
                    x = goalColumn;
                amount < 0 && (dir = -1, amount = -amount);
                for (var i = 0, cur = clipPos(this.doc, from); i < amount; ++i) {
                    var coords = cursorCoords(this, cur, "div");
                    if (null == x ? x = coords.left : coords.left = x, cur = findPosV(this, coords, dir, unit), cur.hitSide) break
                }
                return cur
            },
            moveV: operation(null, function(dir, unit) {
                var sel = this.doc.sel,
                    pos = cursorCoords(this, sel.head, "div");
                null != sel.goalColumn && (pos.left = sel.goalColumn);
                var target = findPosV(this, pos, dir, unit);
                "page" == unit && addToScrollPos(this, 0, charCoords(this, target, "div").top - pos.top), extendSelection(this.doc, target, target, dir), sel.goalColumn = pos.left
            }),
            toggleOverwrite: function(value) {
                null != value && value == this.state.overwrite || ((this.state.overwrite = !this.state.overwrite) ? this.display.cursor.className += " CodeMirror-overwrite" : this.display.cursor.className = this.display.cursor.className.replace(" CodeMirror-overwrite", ""))
            },
            hasFocus: function() {
                return this.state.focused
            },
            scrollTo: operation(null, function(x, y) {
                updateScrollPos(this, x, y)
            }),
            getScrollInfo: function() {
                var scroller = this.display.scroller,
                    co = scrollerCutOff;
                return {
                    left: scroller.scrollLeft,
                    top: scroller.scrollTop,
                    height: scroller.scrollHeight - co,
                    width: scroller.scrollWidth - co,
                    clientHeight: scroller.clientHeight - co,
                    clientWidth: scroller.clientWidth - co
                }
            },
            scrollIntoView: operation(null, function(pos, margin) {
                "number" == typeof pos && (pos = Pos(pos, 0)), margin || (margin = 0);
                var coords = pos;
                pos && null == pos.line || (this.curOp.scrollToPos = pos ? clipPos(this.doc, pos) : this.doc.sel.head, this.curOp.scrollToPosMargin = margin, coords = cursorCoords(this, this.curOp.scrollToPos));
                var sPos = calculateScrollPos(this, coords.left, coords.top - margin, coords.right, coords.bottom + margin);
                updateScrollPos(this, sPos.scrollLeft, sPos.scrollTop)
            }),
            setSize: operation(null, function(width, height) {
                function interpret(val) {
                    return "number" == typeof val || /^\d+$/.test(String(val)) ? val + "px" : val
                }
                null != width && (this.display.wrapper.style.width = interpret(width)), null != height && (this.display.wrapper.style.height = interpret(height)), this.options.lineWrapping && (this.display.measureLineCache.length = this.display.measureLineCachePos = 0), this.curOp.forceUpdate = !0
            }),
            operation: function(f) {
                return runInOp(this, f)
            },
            refresh: operation(null, function() {
                clearCaches(this), updateScrollPos(this, this.doc.scrollLeft, this.doc.scrollTop), regChange(this)
            }),
            swapDoc: operation(null, function(doc) {
                var old = this.doc;
                return old.cm = null, attachDoc(this, doc), clearCaches(this), resetInput(this, !0), updateScrollPos(this, doc.scrollLeft, doc.scrollTop), old
            }),
            getInputField: function() {
                return this.display.input
            },
            getWrapperElement: function() {
                return this.display.wrapper
            },
            getScrollerElement: function() {
                return this.display.scroller
            },
            getGutterElement: function() {
                return this.display.gutters
            }
        }, eventMixin(CodeMirror);
        var optionHandlers = CodeMirror.optionHandlers = {},
            defaults = CodeMirror.defaults = {},
            Init = CodeMirror.Init = {
                toString: function() {
                    return "CodeMirror.Init"
                }
            };
        option("value", "", function(cm, val) {
            cm.setValue(val)
        }, !0), option("mode", null, function(cm, val) {
            cm.doc.modeOption = val, loadMode(cm)
        }, !0), option("indentUnit", 2, loadMode, !0), option("indentWithTabs", !1), option("smartIndent", !0), option("tabSize", 4, function(cm) {
            loadMode(cm), clearCaches(cm), regChange(cm)
        }, !0), option("electricChars", !0), option("rtlMoveVisually", !windows), option("theme", "default", function(cm) {
            themeChanged(cm), guttersChanged(cm)
        }, !0), option("keyMap", "default", keyMapChanged), option("extraKeys", null), option("onKeyEvent", null), option("onDragEvent", null), option("lineWrapping", !1, wrappingChanged, !0), option("gutters", [], function(cm) {
            setGuttersForLineNumbers(cm.options), guttersChanged(cm)
        }, !0), option("fixedGutter", !0, function(cm, val) {
            cm.display.gutters.style.left = val ? compensateForHScroll(cm.display) + "px" : "0", cm.refresh()
        }, !0), option("coverGutterNextToScrollbar", !1, updateScrollbars, !0), option("lineNumbers", !1, function(cm) {
            setGuttersForLineNumbers(cm.options), guttersChanged(cm)
        }, !0), option("firstLineNumber", 1, guttersChanged, !0), option("lineNumberFormatter", function(integer) {
            return integer
        }, guttersChanged, !0), option("showCursorWhenSelecting", !1, updateSelection, !0), option("readOnly", !1, function(cm, val) {
            "nocursor" == val ? (onBlur(cm), cm.display.input.blur()) : val || resetInput(cm, !0)
        }), option("dragDrop", !0), option("cursorBlinkRate", 530), option("cursorScrollMargin", 0), option("cursorHeight", 1), option("workTime", 100), option("workDelay", 100), option("flattenSpans", !0), option("pollInterval", 100), option("undoDepth", 40, function(cm, val) {
            cm.doc.history.undoDepth = val
        }), option("historyEventDelay", 500), option("viewportMargin", 10, function(cm) {
            cm.refresh()
        }, !0), option("maxHighlightLength", 1e4, function(cm) {
            loadMode(cm), cm.refresh()
        }, !0), option("moveInputWithCursor", !0, function(cm, val) {
            val || (cm.display.inputDiv.style.top = cm.display.inputDiv.style.left = 0)
        }), option("tabindex", null, function(cm, val) {
            cm.display.input.tabIndex = val || ""
        }), option("autofocus", null);
        var modes = CodeMirror.modes = {},
            mimeModes = CodeMirror.mimeModes = {};
        CodeMirror.defineMode = function(name, mode) {
            if (CodeMirror.defaults.mode || "null" == name || (CodeMirror.defaults.mode = name), arguments.length > 2) {
                mode.dependencies = [];
                for (var i = 2; i < arguments.length; ++i) mode.dependencies.push(arguments[i])
            }
            modes[name] = mode
        }, CodeMirror.defineMIME = function(mime, spec) {
            mimeModes[mime] = spec
        }, CodeMirror.resolveMode = function(spec) {
            if ("string" == typeof spec && mimeModes.hasOwnProperty(spec)) spec = mimeModes[spec];
            else if (spec && "string" == typeof spec.name && mimeModes.hasOwnProperty(spec.name)) {
                var found = mimeModes[spec.name];
                spec = createObj(found, spec), spec.name = found.name
            } else if ("string" == typeof spec && /^[\w\-]+\/[\w\-]+\+xml$/.test(spec)) return CodeMirror.resolveMode("application/xml");
            return "string" == typeof spec ? {
                name: spec
            } : spec || {
                name: "null"
            }
        }, CodeMirror.getMode = function(options, spec) {
            var spec = CodeMirror.resolveMode(spec),
                mfactory = modes[spec.name];
            if (!mfactory) return CodeMirror.getMode(options, "text/plain");
            var modeObj = mfactory(options, spec);
            if (modeExtensions.hasOwnProperty(spec.name)) {
                var exts = modeExtensions[spec.name];
                for (var prop in exts) exts.hasOwnProperty(prop) && (modeObj.hasOwnProperty(prop) && (modeObj["_" + prop] = modeObj[prop]), modeObj[prop] = exts[prop])
            }
            return modeObj.name = spec.name, modeObj
        }, CodeMirror.defineMode("null", function() {
            return {
                token: function(stream) {
                    stream.skipToEnd()
                }
            }
        }), CodeMirror.defineMIME("text/plain", "null");
        var modeExtensions = CodeMirror.modeExtensions = {};
        CodeMirror.extendMode = function(mode, properties) {
            var exts = modeExtensions.hasOwnProperty(mode) ? modeExtensions[mode] : modeExtensions[mode] = {};
            copyObj(properties, exts)
        }, CodeMirror.defineExtension = function(name, func) {
            CodeMirror.prototype[name] = func
        }, CodeMirror.defineDocExtension = function(name, func) {
            Doc.prototype[name] = func
        }, CodeMirror.defineOption = option;
        var initHooks = [];
        CodeMirror.defineInitHook = function(f) {
            initHooks.push(f)
        };
        var helpers = CodeMirror.helpers = {};
        CodeMirror.registerHelper = function(type, name, value) {
            helpers.hasOwnProperty(type) || (helpers[type] = CodeMirror[type] = {}), helpers[type][name] = value
        }, CodeMirror.isWordChar = isWordChar, CodeMirror.copyState = copyState, CodeMirror.startState = startState, CodeMirror.innerMode = function(mode, state) {
            for (; mode.innerMode;) {
                var info = mode.innerMode(state);
                if (!info || info.mode == mode) break;
                state = info.state, mode = info.mode
            }
            return info || {
                mode: mode,
                state: state
            }
        };
        var commands = CodeMirror.commands = {
                selectAll: function(cm) {
                    cm.setSelection(Pos(cm.firstLine(), 0), Pos(cm.lastLine()))
                },
                killLine: function(cm) {
                    var from = cm.getCursor(!0),
                        to = cm.getCursor(!1),
                        sel = !posEq(from, to);
                    sel || cm.getLine(from.line).length != from.ch ? cm.replaceRange("", from, sel ? to : Pos(from.line), "+delete") : cm.replaceRange("", from, Pos(from.line + 1, 0), "+delete")
                },
                deleteLine: function(cm) {
                    var l = cm.getCursor().line;
                    cm.replaceRange("", Pos(l, 0), Pos(l), "+delete")
                },
                delLineLeft: function(cm) {
                    var cur = cm.getCursor();
                    cm.replaceRange("", Pos(cur.line, 0), cur, "+delete")
                },
                undo: function(cm) {
                    cm.undo()
                },
                redo: function(cm) {
                    cm.redo()
                },
                goDocStart: function(cm) {
                    cm.extendSelection(Pos(cm.firstLine(), 0))
                },
                goDocEnd: function(cm) {
                    cm.extendSelection(Pos(cm.lastLine()))
                },
                goLineStart: function(cm) {
                    cm.extendSelection(lineStart(cm, cm.getCursor().line))
                },
                goLineStartSmart: function(cm) {
                    var cur = cm.getCursor(),
                        start = lineStart(cm, cur.line),
                        line = cm.getLineHandle(start.line),
                        order = getOrder(line);
                    if (order && 0 != order[0].level) cm.extendSelection(start);
                    else {
                        var firstNonWS = Math.max(0, line.text.search(/\S/)),
                            inWS = cur.line == start.line && cur.ch <= firstNonWS && cur.ch;
                        cm.extendSelection(Pos(start.line, inWS ? 0 : firstNonWS))
                    }
                },
                goLineEnd: function(cm) {
                    cm.extendSelection(lineEnd(cm, cm.getCursor().line))
                },
                goLineRight: function(cm) {
                    var top = cm.charCoords(cm.getCursor(), "div").top + 5;
                    cm.extendSelection(cm.coordsChar({
                        left: cm.display.lineDiv.offsetWidth + 100,
                        top: top
                    }, "div"))
                },
                goLineLeft: function(cm) {
                    var top = cm.charCoords(cm.getCursor(), "div").top + 5;
                    cm.extendSelection(cm.coordsChar({
                        left: 0,
                        top: top
                    }, "div"))
                },
                goLineUp: function(cm) {
                    cm.moveV(-1, "line")
                },
                goLineDown: function(cm) {
                    cm.moveV(1, "line")
                },
                goPageUp: function(cm) {
                    cm.moveV(-1, "page")
                },
                goPageDown: function(cm) {
                    cm.moveV(1, "page")
                },
                goCharLeft: function(cm) {
                    cm.moveH(-1, "char")
                },
                goCharRight: function(cm) {
                    cm.moveH(1, "char")
                },
                goColumnLeft: function(cm) {
                    cm.moveH(-1, "column")
                },
                goColumnRight: function(cm) {
                    cm.moveH(1, "column")
                },
                goWordLeft: function(cm) {
                    cm.moveH(-1, "word")
                },
                goGroupRight: function(cm) {
                    cm.moveH(1, "group")
                },
                goGroupLeft: function(cm) {
                    cm.moveH(-1, "group")
                },
                goWordRight: function(cm) {
                    cm.moveH(1, "word")
                },
                delCharBefore: function(cm) {
                    cm.deleteH(-1, "char")
                },
                delCharAfter: function(cm) {
                    cm.deleteH(1, "char")
                },
                delWordBefore: function(cm) {
                    cm.deleteH(-1, "word")
                },
                delWordAfter: function(cm) {
                    cm.deleteH(1, "word")
                },
                delGroupBefore: function(cm) {
                    cm.deleteH(-1, "group")
                },
                delGroupAfter: function(cm) {
                    cm.deleteH(1, "group")
                },
                indentAuto: function(cm) {
                    cm.indentSelection("smart")
                },
                indentMore: function(cm) {
                    cm.indentSelection("add")
                },
                indentLess: function(cm) {
                    cm.indentSelection("subtract")
                },
                insertTab: function(cm) {
                    cm.replaceSelection("\t", "end", "+input")
                },
                defaultTab: function(cm) {
                    cm.somethingSelected() ? cm.indentSelection("add") : cm.replaceSelection("\t", "end", "+input")
                },
                transposeChars: function(cm) {
                    var cur = cm.getCursor(),
                        line = cm.getLine(cur.line);
                    cur.ch > 0 && cur.ch < line.length - 1 && cm.replaceRange(line.charAt(cur.ch) + line.charAt(cur.ch - 1), Pos(cur.line, cur.ch - 1), Pos(cur.line, cur.ch + 1))
                },
                newlineAndIndent: function(cm) {
                    operation(cm, function() {
                        cm.replaceSelection("\n", "end", "+input"), cm.indentLine(cm.getCursor().line, null, !0)
                    })()
                },
                toggleOverwrite: function(cm) {
                    cm.toggleOverwrite()
                }
            },
            keyMap = CodeMirror.keyMap = {};
        keyMap.basic = {
            Left: "goCharLeft",
            Right: "goCharRight",
            Up: "goLineUp",
            Down: "goLineDown",
            End: "goLineEnd",
            Home: "goLineStartSmart",
            PageUp: "goPageUp",
            PageDown: "goPageDown",
            Delete: "delCharAfter",
            Backspace: "delCharBefore",
            Tab: "defaultTab",
            "Shift-Tab": "indentAuto",
            Enter: "newlineAndIndent",
            Insert: "toggleOverwrite"
        }, keyMap.pcDefault = {
            "Ctrl-A": "selectAll",
            "Ctrl-D": "deleteLine",
            "Ctrl-Z": "undo",
            "Shift-Ctrl-Z": "redo",
            "Ctrl-Y": "redo",
            "Ctrl-Home": "goDocStart",
            "Alt-Up": "goDocStart",
            "Ctrl-End": "goDocEnd",
            "Ctrl-Down": "goDocEnd",
            "Ctrl-Left": "goGroupLeft",
            "Ctrl-Right": "goGroupRight",
            "Alt-Left": "goLineStart",
            "Alt-Right": "goLineEnd",
            "Ctrl-Backspace": "delGroupBefore",
            "Ctrl-Delete": "delGroupAfter",
            "Ctrl-S": "save",
            "Ctrl-F": "find",
            "Ctrl-G": "findNext",
            "Shift-Ctrl-G": "findPrev",
            "Shift-Ctrl-F": "replace",
            "Shift-Ctrl-R": "replaceAll",
            "Ctrl-[": "indentLess",
            "Ctrl-]": "indentMore",
            fallthrough: "basic"
        }, keyMap.macDefault = {
            "Cmd-A": "selectAll",
            "Cmd-D": "deleteLine",
            "Cmd-Z": "undo",
            "Shift-Cmd-Z": "redo",
            "Cmd-Y": "redo",
            "Cmd-Up": "goDocStart",
            "Cmd-End": "goDocEnd",
            "Cmd-Down": "goDocEnd",
            "Alt-Left": "goGroupLeft",
            "Alt-Right": "goGroupRight",
            "Cmd-Left": "goLineStart",
            "Cmd-Right": "goLineEnd",
            "Alt-Backspace": "delGroupBefore",
            "Ctrl-Alt-Backspace": "delGroupAfter",
            "Alt-Delete": "delGroupAfter",
            "Cmd-S": "save",
            "Cmd-F": "find",
            "Cmd-G": "findNext",
            "Shift-Cmd-G": "findPrev",
            "Cmd-Alt-F": "replace",
            "Shift-Cmd-Alt-F": "replaceAll",
            "Cmd-[": "indentLess",
            "Cmd-]": "indentMore",
            "Cmd-Backspace": "delLineLeft",
            fallthrough: ["basic", "emacsy"]
        }, keyMap["default"] = mac ? keyMap.macDefault : keyMap.pcDefault, keyMap.emacsy = {
            "Ctrl-F": "goCharRight",
            "Ctrl-B": "goCharLeft",
            "Ctrl-P": "goLineUp",
            "Ctrl-N": "goLineDown",
            "Alt-F": "goWordRight",
            "Alt-B": "goWordLeft",
            "Ctrl-A": "goLineStart",
            "Ctrl-E": "goLineEnd",
            "Ctrl-V": "goPageDown",
            "Shift-Ctrl-V": "goPageUp",
            "Ctrl-D": "delCharAfter",
            "Ctrl-H": "delCharBefore",
            "Alt-D": "delWordAfter",
            "Alt-Backspace": "delWordBefore",
            "Ctrl-K": "killLine",
            "Ctrl-T": "transposeChars"
        }, CodeMirror.lookupKey = lookupKey, CodeMirror.isModifierKey = isModifierKey, CodeMirror.keyName = keyName, CodeMirror.fromTextArea = function(textarea, options) {
            function save() {
                textarea.value = cm.getValue()
            }
            if (options || (options = {}), options.value = textarea.value, !options.tabindex && textarea.tabindex && (options.tabindex = textarea.tabindex), !options.placeholder && textarea.placeholder && (options.placeholder = textarea.placeholder), null == options.autofocus) {
                var hasFocus = document.body;
                try {
                    hasFocus = document.activeElement
                } catch (e) {}
                options.autofocus = hasFocus == textarea || null != textarea.getAttribute("autofocus") && hasFocus == document.body
            }
            if (textarea.form && (on(textarea.form, "submit", save), !options.leaveSubmitMethodAlone)) {
                var form = textarea.form,
                    realSubmit = form.submit;
                try {
                    var wrappedSubmit = form.submit = function() {
                        save(), form.submit = realSubmit, form.submit(), form.submit = wrappedSubmit
                    }
                } catch (e) {}
            }
            textarea.style.display = "none";
            var cm = CodeMirror(function(node) {
                textarea.parentNode.insertBefore(node, textarea.nextSibling)
            }, options);
            return cm.save = save,
                cm.getTextArea = function() {
                    return textarea
                }, cm.toTextArea = function() {
                    save(), textarea.parentNode.removeChild(cm.getWrapperElement()), textarea.style.display = "", textarea.form && (off(textarea.form, "submit", save), "function" == typeof textarea.form.submit && (textarea.form.submit = realSubmit))
                }, cm
        }, StringStream.prototype = {
            eol: function() {
                return this.pos >= this.string.length
            },
            sol: function() {
                return 0 == this.pos
            },
            peek: function() {
                return this.string.charAt(this.pos) || void 0
            },
            next: function() {
                if (this.pos < this.string.length) return this.string.charAt(this.pos++)
            },
            eat: function(match) {
                var ch = this.string.charAt(this.pos);
                if ("string" == typeof match) var ok = ch == match;
                else var ok = ch && (match.test ? match.test(ch) : match(ch));
                if (ok) return ++this.pos, ch
            },
            eatWhile: function(match) {
                for (var start = this.pos; this.eat(match););
                return this.pos > start
            },
            eatSpace: function() {
                for (var start = this.pos;
                    /[\s\u00a0]/.test(this.string.charAt(this.pos));) ++this.pos;
                return this.pos > start
            },
            skipToEnd: function() {
                this.pos = this.string.length
            },
            skipTo: function(ch) {
                var found = this.string.indexOf(ch, this.pos);
                if (found > -1) return this.pos = found, !0
            },
            backUp: function(n) {
                this.pos -= n
            },
            column: function() {
                return this.lastColumnPos < this.start && (this.lastColumnValue = countColumn(this.string, this.start, this.tabSize, this.lastColumnPos, this.lastColumnValue), this.lastColumnPos = this.start), this.lastColumnValue
            },
            indentation: function() {
                return countColumn(this.string, null, this.tabSize)
            },
            match: function(pattern, consume, caseInsensitive) {
                if ("string" != typeof pattern) {
                    var match = this.string.slice(this.pos).match(pattern);
                    return match && match.index > 0 ? null : (match && consume !== !1 && (this.pos += match[0].length), match)
                }
                var cased = function(str) {
                        return caseInsensitive ? str.toLowerCase() : str
                    },
                    substr = this.string.substr(this.pos, pattern.length);
                if (cased(substr) == cased(pattern)) return consume !== !1 && (this.pos += pattern.length), !0
            },
            current: function() {
                return this.string.slice(this.start, this.pos)
            }
        }, CodeMirror.StringStream = StringStream, CodeMirror.TextMarker = TextMarker, eventMixin(TextMarker), TextMarker.prototype.clear = function() {
            if (!this.explicitlyCleared) {
                var cm = this.doc.cm,
                    withOp = cm && !cm.curOp;
                if (withOp && startOperation(cm), hasHandler(this, "clear")) {
                    var found = this.find();
                    found && signalLater(this, "clear", found.from, found.to)
                }
                for (var min = null, max = null, i = 0; i < this.lines.length; ++i) {
                    var line = this.lines[i],
                        span = getMarkedSpanFor(line.markedSpans, this);
                    null != span.to && (max = lineNo(line)), line.markedSpans = removeMarkedSpan(line.markedSpans, span), null != span.from ? min = lineNo(line) : this.collapsed && !lineIsHidden(this.doc, line) && cm && updateLineHeight(line, textHeight(cm.display))
                }
                if (cm && this.collapsed && !cm.options.lineWrapping)
                    for (var i = 0; i < this.lines.length; ++i) {
                        var visual = visualLine(cm.doc, this.lines[i]),
                            len = lineLength(cm.doc, visual);
                        len > cm.display.maxLineLength && (cm.display.maxLine = visual, cm.display.maxLineLength = len, cm.display.maxLineChanged = !0)
                    }
                null != min && cm && regChange(cm, min, max + 1), this.lines.length = 0, this.explicitlyCleared = !0, this.atomic && this.doc.cantEdit && (this.doc.cantEdit = !1, cm && reCheckSelection(cm)), withOp && endOperation(cm)
            }
        }, TextMarker.prototype.find = function() {
            for (var from, to, i = 0; i < this.lines.length; ++i) {
                var line = this.lines[i],
                    span = getMarkedSpanFor(line.markedSpans, this);
                if (null != span.from || null != span.to) {
                    var found = lineNo(line);
                    null != span.from && (from = Pos(found, span.from)), null != span.to && (to = Pos(found, span.to))
                }
            }
            return "bookmark" == this.type ? from : from && {
                from: from,
                to: to
            }
        }, TextMarker.prototype.changed = function() {
            var pos = this.find(),
                cm = this.doc.cm;
            if (pos && cm) {
                "bookmark" != this.type && (pos = pos.from);
                var line = getLine(this.doc, pos.line);
                if (clearCachedMeasurement(cm, line), pos.line >= cm.display.showingFrom && pos.line < cm.display.showingTo) {
                    for (var node = cm.display.lineDiv.firstChild; node; node = node.nextSibling)
                        if (node.lineObj == line) {
                            node.offsetHeight != line.height && updateLineHeight(line, node.offsetHeight);
                            break
                        }
                    runInOp(cm, function() {
                        cm.curOp.selectionChanged = cm.curOp.forceUpdate = cm.curOp.updateMaxLine = !0
                    })
                }
            }
        }, TextMarker.prototype.attachLine = function(line) {
            if (!this.lines.length && this.doc.cm) {
                var op = this.doc.cm.curOp;
                op.maybeHiddenMarkers && indexOf(op.maybeHiddenMarkers, this) != -1 || (op.maybeUnhiddenMarkers || (op.maybeUnhiddenMarkers = [])).push(this)
            }
            this.lines.push(line)
        }, TextMarker.prototype.detachLine = function(line) {
            if (this.lines.splice(indexOf(this.lines, line), 1), !this.lines.length && this.doc.cm) {
                var op = this.doc.cm.curOp;
                (op.maybeHiddenMarkers || (op.maybeHiddenMarkers = [])).push(this)
            }
        }, CodeMirror.SharedTextMarker = SharedTextMarker, eventMixin(SharedTextMarker), SharedTextMarker.prototype.clear = function() {
            if (!this.explicitlyCleared) {
                this.explicitlyCleared = !0;
                for (var i = 0; i < this.markers.length; ++i) this.markers[i].clear();
                signalLater(this, "clear")
            }
        }, SharedTextMarker.prototype.find = function() {
            return this.primary.find()
        };
        var LineWidget = CodeMirror.LineWidget = function(cm, node, options) {
            if (options)
                for (var opt in options) options.hasOwnProperty(opt) && (this[opt] = options[opt]);
            this.cm = cm, this.node = node
        };
        eventMixin(LineWidget), LineWidget.prototype.clear = widgetOperation(function() {
            var ws = this.line.widgets,
                no = lineNo(this.line);
            if (null != no && ws) {
                for (var i = 0; i < ws.length; ++i) ws[i] == this && ws.splice(i--, 1);
                ws.length || (this.line.widgets = null);
                var aboveVisible = heightAtLine(this.cm, this.line) < this.cm.doc.scrollTop;
                updateLineHeight(this.line, Math.max(0, this.line.height - widgetHeight(this))), aboveVisible && addToScrollPos(this.cm, 0, -this.height), regChange(this.cm, no, no + 1)
            }
        }), LineWidget.prototype.changed = widgetOperation(function() {
            var oldH = this.height;
            this.height = null;
            var diff = widgetHeight(this) - oldH;
            if (diff) {
                updateLineHeight(this.line, this.line.height + diff);
                var no = lineNo(this.line);
                regChange(this.cm, no, no + 1)
            }
        });
        var Line = CodeMirror.Line = function(text, markedSpans, estimateHeight) {
            this.text = text, attachMarkedSpans(this, markedSpans), this.height = estimateHeight ? estimateHeight(this) : 1
        };
        eventMixin(Line);
        var styleToClassCache = {},
            tokenSpecialChars = /[\t\u0000-\u0019\u00ad\u200b\u2028\u2029\uFEFF]/g;
        LeafChunk.prototype = {
            chunkSize: function() {
                return this.lines.length
            },
            removeInner: function(at, n) {
                for (var i = at, e = at + n; i < e; ++i) {
                    var line = this.lines[i];
                    this.height -= line.height, cleanUpLine(line), signalLater(line, "delete")
                }
                this.lines.splice(at, n)
            },
            collapse: function(lines) {
                lines.splice.apply(lines, [lines.length, 0].concat(this.lines))
            },
            insertInner: function(at, lines, height) {
                this.height += height, this.lines = this.lines.slice(0, at).concat(lines).concat(this.lines.slice(at));
                for (var i = 0, e = lines.length; i < e; ++i) lines[i].parent = this
            },
            iterN: function(at, n, op) {
                for (var e = at + n; at < e; ++at)
                    if (op(this.lines[at])) return !0
            }
        }, BranchChunk.prototype = {
            chunkSize: function() {
                return this.size
            },
            removeInner: function(at, n) {
                this.size -= n;
                for (var i = 0; i < this.children.length; ++i) {
                    var child = this.children[i],
                        sz = child.chunkSize();
                    if (at < sz) {
                        var rm = Math.min(n, sz - at),
                            oldHeight = child.height;
                        if (child.removeInner(at, rm), this.height -= oldHeight - child.height, sz == rm && (this.children.splice(i--, 1), child.parent = null), 0 == (n -= rm)) break;
                        at = 0
                    } else at -= sz
                }
                if (this.size - n < 25) {
                    var lines = [];
                    this.collapse(lines), this.children = [new LeafChunk(lines)], this.children[0].parent = this
                }
            },
            collapse: function(lines) {
                for (var i = 0, e = this.children.length; i < e; ++i) this.children[i].collapse(lines)
            },
            insertInner: function(at, lines, height) {
                this.size += lines.length, this.height += height;
                for (var i = 0, e = this.children.length; i < e; ++i) {
                    var child = this.children[i],
                        sz = child.chunkSize();
                    if (at <= sz) {
                        if (child.insertInner(at, lines, height), child.lines && child.lines.length > 50) {
                            for (; child.lines.length > 50;) {
                                var spilled = child.lines.splice(child.lines.length - 25, 25),
                                    newleaf = new LeafChunk(spilled);
                                child.height -= newleaf.height, this.children.splice(i + 1, 0, newleaf), newleaf.parent = this
                            }
                            this.maybeSpill()
                        }
                        break
                    }
                    at -= sz
                }
            },
            maybeSpill: function() {
                if (!(this.children.length <= 10)) {
                    var me = this;
                    do {
                        var spilled = me.children.splice(me.children.length - 5, 5),
                            sibling = new BranchChunk(spilled);
                        if (me.parent) {
                            me.size -= sibling.size, me.height -= sibling.height;
                            var myIndex = indexOf(me.parent.children, me);
                            me.parent.children.splice(myIndex + 1, 0, sibling)
                        } else {
                            var copy = new BranchChunk(me.children);
                            copy.parent = me, me.children = [copy, sibling], me = copy
                        }
                        sibling.parent = me.parent
                    } while (me.children.length > 10);
                    me.parent.maybeSpill()
                }
            },
            iterN: function(at, n, op) {
                for (var i = 0, e = this.children.length; i < e; ++i) {
                    var child = this.children[i],
                        sz = child.chunkSize();
                    if (at < sz) {
                        var used = Math.min(n, sz - at);
                        if (child.iterN(at, used, op)) return !0;
                        if (0 == (n -= used)) break;
                        at = 0
                    } else at -= sz
                }
            }
        };
        var nextDocId = 0,
            Doc = CodeMirror.Doc = function(text, mode, firstLine) {
                if (!(this instanceof Doc)) return new Doc(text, mode, firstLine);
                null == firstLine && (firstLine = 0), BranchChunk.call(this, [new LeafChunk([new Line("", null)])]), this.first = firstLine, this.scrollTop = this.scrollLeft = 0, this.cantEdit = !1, this.history = makeHistory(), this.cleanGeneration = 1, this.frontier = firstLine;
                var start = Pos(firstLine, 0);
                this.sel = {
                    from: start,
                    to: start,
                    head: start,
                    anchor: start,
                    shift: !1,
                    extend: !1,
                    goalColumn: null
                }, this.id = ++nextDocId, this.modeOption = mode, "string" == typeof text && (text = splitLines(text)), updateDoc(this, {
                    from: start,
                    to: start,
                    text: text
                }, null, {
                    head: start,
                    anchor: start
                })
            };
        Doc.prototype = createObj(BranchChunk.prototype, {
            constructor: Doc,
            iter: function(from, to, op) {
                op ? this.iterN(from - this.first, to - from, op) : this.iterN(this.first, this.first + this.size, from)
            },
            insert: function(at, lines) {
                for (var height = 0, i = 0, e = lines.length; i < e; ++i) height += lines[i].height;
                this.insertInner(at - this.first, lines, height)
            },
            remove: function(at, n) {
                this.removeInner(at - this.first, n)
            },
            getValue: function(lineSep) {
                var lines = getLines(this, this.first, this.first + this.size);
                return lineSep === !1 ? lines : lines.join(lineSep || "\n")
            },
            setValue: function(code) {
                var top = Pos(this.first, 0),
                    last = this.first + this.size - 1;
                makeChange(this, {
                    from: top,
                    to: Pos(last, getLine(this, last).text.length),
                    text: splitLines(code),
                    origin: "setValue"
                }, {
                    head: top,
                    anchor: top
                }, !0)
            },
            replaceRange: function(code, from, to, origin) {
                from = clipPos(this, from), to = to ? clipPos(this, to) : from, replaceRange(this, code, from, to, origin)
            },
            getRange: function(from, to, lineSep) {
                var lines = getBetween(this, clipPos(this, from), clipPos(this, to));
                return lineSep === !1 ? lines : lines.join(lineSep || "\n")
            },
            getLine: function(line) {
                var l = this.getLineHandle(line);
                return l && l.text
            },
            setLine: function(line, text) {
                isLine(this, line) && replaceRange(this, text, Pos(line, 0), clipPos(this, Pos(line)))
            },
            removeLine: function(line) {
                line ? replaceRange(this, "", clipPos(this, Pos(line - 1)), clipPos(this, Pos(line))) : replaceRange(this, "", Pos(0, 0), clipPos(this, Pos(1, 0)))
            },
            getLineHandle: function(line) {
                if (isLine(this, line)) return getLine(this, line)
            },
            getLineNumber: function(line) {
                return lineNo(line)
            },
            getLineHandleVisualStart: function(line) {
                return "number" == typeof line && (line = getLine(this, line)), visualLine(this, line)
            },
            lineCount: function() {
                return this.size
            },
            firstLine: function() {
                return this.first
            },
            lastLine: function() {
                return this.first + this.size - 1
            },
            clipPos: function(pos) {
                return clipPos(this, pos)
            },
            getCursor: function(start) {
                var pos, sel = this.sel;
                return pos = null == start || "head" == start ? sel.head : "anchor" == start ? sel.anchor : "end" == start || start === !1 ? sel.to : sel.from, copyPos(pos)
            },
            somethingSelected: function() {
                return !posEq(this.sel.head, this.sel.anchor)
            },
            setCursor: docOperation(function(line, ch, extend) {
                var pos = clipPos(this, "number" == typeof line ? Pos(line, ch || 0) : line);
                extend ? extendSelection(this, pos) : setSelection(this, pos, pos)
            }),
            setSelection: docOperation(function(anchor, head, bias) {
                setSelection(this, clipPos(this, anchor), clipPos(this, head || anchor), bias)
            }),
            extendSelection: docOperation(function(from, to, bias) {
                extendSelection(this, clipPos(this, from), to && clipPos(this, to), bias)
            }),
            getSelection: function(lineSep) {
                return this.getRange(this.sel.from, this.sel.to, lineSep)
            },
            replaceSelection: function(code, collapse, origin) {
                makeChange(this, {
                    from: this.sel.from,
                    to: this.sel.to,
                    text: splitLines(code),
                    origin: origin
                }, collapse || "around")
            },
            undo: docOperation(function() {
                makeChangeFromHistory(this, "undo")
            }),
            redo: docOperation(function() {
                makeChangeFromHistory(this, "redo")
            }),
            setExtending: function(val) {
                this.sel.extend = val
            },
            historySize: function() {
                var hist = this.history;
                return {
                    undo: hist.done.length,
                    redo: hist.undone.length
                }
            },
            clearHistory: function() {
                this.history = makeHistory(this.history.maxGeneration)
            },
            markClean: function() {
                this.cleanGeneration = this.changeGeneration()
            },
            changeGeneration: function() {
                return this.history.lastOp = this.history.lastOrigin = null, this.history.generation
            },
            isClean: function(gen) {
                return this.history.generation == (gen || this.cleanGeneration)
            },
            getHistory: function() {
                return {
                    done: copyHistoryArray(this.history.done),
                    undone: copyHistoryArray(this.history.undone)
                }
            },
            setHistory: function(histData) {
                var hist = this.history = makeHistory(this.history.maxGeneration);
                hist.done = histData.done.slice(0), hist.undone = histData.undone.slice(0)
            },
            markText: function(from, to, options) {
                return markText(this, clipPos(this, from), clipPos(this, to), options, "range")
            },
            setBookmark: function(pos, options) {
                var realOpts = {
                    replacedWith: options && (null == options.nodeType ? options.widget : options),
                    insertLeft: options && options.insertLeft
                };
                return pos = clipPos(this, pos), markText(this, pos, pos, realOpts, "bookmark")
            },
            findMarksAt: function(pos) {
                pos = clipPos(this, pos);
                var markers = [],
                    spans = getLine(this, pos.line).markedSpans;
                if (spans)
                    for (var i = 0; i < spans.length; ++i) {
                        var span = spans[i];
                        (null == span.from || span.from <= pos.ch) && (null == span.to || span.to >= pos.ch) && markers.push(span.marker.parent || span.marker)
                    }
                return markers
            },
            getAllMarks: function() {
                var markers = [];
                return this.iter(function(line) {
                    var sps = line.markedSpans;
                    if (sps)
                        for (var i = 0; i < sps.length; ++i) null != sps[i].from && markers.push(sps[i].marker)
                }), markers
            },
            posFromIndex: function(off) {
                var ch, lineNo = this.first;
                return this.iter(function(line) {
                    var sz = line.text.length + 1;
                    return sz > off ? (ch = off, !0) : (off -= sz, void++lineNo)
                }), clipPos(this, Pos(lineNo, ch))
            },
            indexFromPos: function(coords) {
                coords = clipPos(this, coords);
                var index = coords.ch;
                return coords.line < this.first || coords.ch < 0 ? 0 : (this.iter(this.first, coords.line, function(line) {
                    index += line.text.length + 1
                }), index)
            },
            copy: function(copyHistory) {
                var doc = new Doc(getLines(this, this.first, this.first + this.size), this.modeOption, this.first);
                return doc.scrollTop = this.scrollTop, doc.scrollLeft = this.scrollLeft, doc.sel = {
                    from: this.sel.from,
                    to: this.sel.to,
                    head: this.sel.head,
                    anchor: this.sel.anchor,
                    shift: this.sel.shift,
                    extend: !1,
                    goalColumn: this.sel.goalColumn
                }, copyHistory && (doc.history.undoDepth = this.history.undoDepth, doc.setHistory(this.getHistory())), doc
            },
            linkedDoc: function(options) {
                options || (options = {});
                var from = this.first,
                    to = this.first + this.size;
                null != options.from && options.from > from && (from = options.from), null != options.to && options.to < to && (to = options.to);
                var copy = new Doc(getLines(this, from, to), options.mode || this.modeOption, from);
                return options.sharedHist && (copy.history = this.history), (this.linked || (this.linked = [])).push({
                    doc: copy,
                    sharedHist: options.sharedHist
                }), copy.linked = [{
                    doc: this,
                    isParent: !0,
                    sharedHist: options.sharedHist
                }], copy
            },
            unlinkDoc: function(other) {
                if (other instanceof CodeMirror && (other = other.doc), this.linked)
                    for (var i = 0; i < this.linked.length; ++i) {
                        var link = this.linked[i];
                        if (link.doc == other) {
                            this.linked.splice(i, 1), other.unlinkDoc(this);
                            break
                        }
                    }
                if (other.history == this.history) {
                    var splitIds = [other.id];
                    linkedDocs(other, function(doc) {
                        splitIds.push(doc.id)
                    }, !0), other.history = makeHistory(), other.history.done = copyHistoryArray(this.history.done, splitIds), other.history.undone = copyHistoryArray(this.history.undone, splitIds)
                }
            },
            iterLinkedDocs: function(f) {
                linkedDocs(this, f)
            },
            getMode: function() {
                return this.mode
            },
            getEditor: function() {
                return this.cm
            }
        }), Doc.prototype.eachLine = Doc.prototype.iter;
        var dontDelegate = "iter insert remove copy getEditor".split(" ");
        for (var prop in Doc.prototype) Doc.prototype.hasOwnProperty(prop) && indexOf(dontDelegate, prop) < 0 && (CodeMirror.prototype[prop] = function(method) {
            return function() {
                return method.apply(this.doc, arguments)
            }
        }(Doc.prototype[prop]));
        eventMixin(Doc), CodeMirror.e_stop = e_stop, CodeMirror.e_preventDefault = e_preventDefault, CodeMirror.e_stopPropagation = e_stopPropagation;
        var delayedCallbacks, delayedCallbackDepth = 0;
        CodeMirror.on = on, CodeMirror.off = off, CodeMirror.signal = signal;
        var scrollerCutOff = 30,
            Pass = CodeMirror.Pass = {
                toString: function() {
                    return "CodeMirror.Pass"
                }
            };
        Delayed.prototype = {
            set: function(ms, f) {
                clearTimeout(this.id), this.id = setTimeout(f, ms)
            }
        }, CodeMirror.countColumn = countColumn;
        var spaceStrs = [""],
            nonASCIISingleCaseWordChar = /[\u3040-\u309f\u30a0-\u30ff\u3400-\u4db5\u4e00-\u9fcc\uac00-\ud7af]/,
            isExtendingChar = /[\u0300-\u036F\u0483-\u0487\u0488-\u0489\u0591-\u05BD\u05BF\u05C1-\u05C2\u05C4-\u05C5\u05C7\u0610-\u061A\u064B-\u065F\u0670\u06D6-\u06DC\u06DF-\u06E4\u06E7-\u06E8\u06EA-\u06ED\uA66F\uA670-\uA672\uA674-\uA67D\uA69F\udc00-\udfff]/;
        CodeMirror.replaceGetRect = function(f) {
            getRect = f
        };
        var dragAndDrop = function() {
            if (ie_lt9) return !1;
            var div = elt("div");
            return "draggable" in div || "dragDrop" in div
        }();
        gecko ? spanAffectsWrapping = function(str, i) {
            return 36 == str.charCodeAt(i - 1) && 39 == str.charCodeAt(i)
        } : safari && !/Version\/([6-9]|\d\d)\b/.test(navigator.userAgent) ? spanAffectsWrapping = function(str, i) {
            return /\-[^ \-?]|\?[^ !\'\"\),.\-\/:;\?\]\}]/.test(str.slice(i - 1, i + 1))
        } : webkit && !/Chrome\/(?:29|[3-9]\d|\d\d\d)\./.test(navigator.userAgent) && (spanAffectsWrapping = function(str, i) {
            if (i > 1 && 45 == str.charCodeAt(i - 1)) {
                if (/\w/.test(str.charAt(i - 2)) && /[^\-?\.]/.test(str.charAt(i))) return !0;
                if (i > 2 && /[\d\.,]/.test(str.charAt(i - 2)) && /[\d\.,]/.test(str.charAt(i))) return !1
            }
            return /[~!#%&*)=+}\]|\"\.>,:;][({[<]|-[^\-?\.\u2010-\u201f\u2026]|\?[\w~`@#$%\^&*(_=+{[|><]|…[\w~`@#$%\^&*(_=+{[><]/.test(str.slice(i - 1, i + 1))
        });
        var knownScrollbarWidth, zwspSupported, splitLines = 3 != "\n\nb".split(/\n/).length ? function(string) {
            for (var pos = 0, result = [], l = string.length; pos <= l;) {
                var nl = string.indexOf("\n", pos);
                nl == -1 && (nl = string.length);
                var line = string.slice(pos, "\r" == string.charAt(nl - 1) ? nl - 1 : nl),
                    rt = line.indexOf("\r");
                rt != -1 ? (result.push(line.slice(0, rt)), pos += rt + 1) : (result.push(line), pos = nl + 1)
            }
            return result
        } : function(string) {
            return string.split(/\r\n?|\n/)
        };
        CodeMirror.splitLines = splitLines;
        var hasSelection = window.getSelection ? function(te) {
                try {
                    return te.selectionStart != te.selectionEnd
                } catch (e) {
                    return !1
                }
            } : function(te) {
                try {
                    var range = te.ownerDocument.selection.createRange()
                } catch (e) {}
                return !(!range || range.parentElement() != te) && 0 != range.compareEndPoints("StartToEnd", range)
            },
            hasCopyEvent = function() {
                var e = elt("div");
                return "oncopy" in e || (e.setAttribute("oncopy", "return;"), "function" == typeof e.oncopy)
            }(),
            keyNames = {
                3: "Enter",
                8: "Backspace",
                9: "Tab",
                13: "Enter",
                16: "Shift",
                17: "Ctrl",
                18: "Alt",
                19: "Pause",
                20: "CapsLock",
                27: "Esc",
                32: "Space",
                33: "PageUp",
                34: "PageDown",
                35: "End",
                36: "Home",
                37: "Left",
                38: "Up",
                39: "Right",
                40: "Down",
                44: "PrintScrn",
                45: "Insert",
                46: "Delete",
                59: ";",
                91: "Mod",
                92: "Mod",
                93: "Mod",
                109: "-",
                107: "=",
                127: "Delete",
                186: ";",
                187: "=",
                188: ",",
                189: "-",
                190: ".",
                191: "/",
                192: "`",
                219: "[",
                220: "\\",
                221: "]",
                222: "'",
                63276: "PageUp",
                63277: "PageDown",
                63275: "End",
                63273: "Home",
                63234: "Left",
                63232: "Up",
                63235: "Right",
                63233: "Down",
                63302: "Insert",
                63272: "Delete"
            };
        CodeMirror.keyNames = keyNames,
            function() {
                for (var i = 0; i < 10; i++) keyNames[i + 48] = String(i);
                for (var i = 65; i <= 90; i++) keyNames[i] = String.fromCharCode(i);
                for (var i = 1; i <= 12; i++) keyNames[i + 111] = keyNames[i + 63235] = "F" + i
            }();
        var bidiOther, bidiOrdering = function() {
            function charType(code) {
                return code <= 255 ? lowTypes.charAt(code) : 1424 <= code && code <= 1524 ? "R" : 1536 <= code && code <= 1791 ? arabicTypes.charAt(code - 1536) : 1792 <= code && code <= 2220 ? "r" : "L"
            }
            var lowTypes = "bbbbbbbbbtstwsbbbbbbbbbbbbbbssstwNN%%%NNNNNN,N,N1111111111NNNNNNNLLLLLLLLLLLLLLLLLLLLLLLLLLNNNNNNLLLLLLLLLLLLLLLLLLLLLLLLLLNNNNbbbbbbsbbbbbbbbbbbbbbbbbbbbbbbbbb,N%%%%NNNNLNNNNN%%11NLNNN1LNNNNNLLLLLLLLLLLLLLLLLLLLLLLNLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLNLLLLLLLL",
                arabicTypes = "rrrrrrrrrrrr,rNNmmmmmmrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrmmmmmmmmmmmmmmrrrrrrrnnnnnnnnnn%nnrrrmrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrmmmmmmmmmmmmmmmmmmmNmmmmrrrrrrrrrrrrrrrrrr",
                bidiRE = /[\u0590-\u05f4\u0600-\u06ff\u0700-\u08ac]/,
                isNeutral = /[stwN]/,
                isStrong = /[LRr]/,
                countsAsLeft = /[Lb1n]/,
                countsAsNum = /[1n]/,
                outerType = "L";
            return function(str) {
                if (!bidiRE.test(str)) return !1;
                for (var type, len = str.length, types = [], i = 0; i < len; ++i) types.push(type = charType(str.charCodeAt(i)));
                for (var i = 0, prev = outerType; i < len; ++i) {
                    var type = types[i];
                    "m" == type ? types[i] = prev : prev = type
                }
                for (var i = 0, cur = outerType; i < len; ++i) {
                    var type = types[i];
                    "1" == type && "r" == cur ? types[i] = "n" : isStrong.test(type) && (cur = type, "r" == type && (types[i] = "R"))
                }
                for (var i = 1, prev = types[0]; i < len - 1; ++i) {
                    var type = types[i];
                    "+" == type && "1" == prev && "1" == types[i + 1] ? types[i] = "1" : "," != type || prev != types[i + 1] || "1" != prev && "n" != prev || (types[i] = prev), prev = type
                }
                for (var i = 0; i < len; ++i) {
                    var type = types[i];
                    if ("," == type) types[i] = "N";
                    else if ("%" == type) {
                        for (var end = i + 1; end < len && "%" == types[end]; ++end);
                        for (var replace = i && "!" == types[i - 1] || end < len - 1 && "1" == types[end] ? "1" : "N", j = i; j < end; ++j) types[j] = replace;
                        i = end - 1
                    }
                }
                for (var i = 0, cur = outerType; i < len; ++i) {
                    var type = types[i];
                    "L" == cur && "1" == type ? types[i] = "L" : isStrong.test(type) && (cur = type)
                }
                for (var i = 0; i < len; ++i)
                    if (isNeutral.test(types[i])) {
                        for (var end = i + 1; end < len && isNeutral.test(types[end]); ++end);
                        for (var before = "L" == (i ? types[i - 1] : outerType), after = "L" == (end < len - 1 ? types[end] : outerType), replace = before || after ? "L" : "R", j = i; j < end; ++j) types[j] = replace;
                        i = end - 1
                    }
                for (var m, order = [], i = 0; i < len;)
                    if (countsAsLeft.test(types[i])) {
                        var start = i;
                        for (++i; i < len && countsAsLeft.test(types[i]); ++i);
                        order.push({
                            from: start,
                            to: i,
                            level: 0
                        })
                    } else {
                        var pos = i,
                            at = order.length;
                        for (++i; i < len && "L" != types[i]; ++i);
                        for (var j = pos; j < i;)
                            if (countsAsNum.test(types[j])) {
                                pos < j && order.splice(at, 0, {
                                    from: pos,
                                    to: j,
                                    level: 1
                                });
                                var nstart = j;
                                for (++j; j < i && countsAsNum.test(types[j]); ++j);
                                order.splice(at, 0, {
                                    from: nstart,
                                    to: j,
                                    level: 2
                                }), pos = j
                            } else ++j;
                        pos < i && order.splice(at, 0, {
                            from: pos,
                            to: i,
                            level: 1
                        })
                    }
                return 1 == order[0].level && (m = str.match(/^\s+/)) && (order[0].from = m[0].length, order.unshift({
                    from: 0,
                    to: m[0].length,
                    level: 0
                })), 1 == lst(order).level && (m = str.match(/\s+$/)) && (lst(order).to -= m[0].length, order.push({
                    from: len - m[0].length,
                    to: len,
                    level: 0
                })), order[0].level != lst(order).level && order.push({
                    from: len,
                    to: len,
                    level: order[0].level
                }), order
            }
        }();
        return CodeMirror.version = "3.16.0", CodeMirror
    }(),
    function() {
        var Filter, STYLES, defaults, extend, toHexString, _i, _results, __slice = [].slice;
        STYLES = {
                ef0: "color:#000",
                ef1: "color:#A00",
                ef2: "color:#0A0",
                ef3: "color:#A50",
                ef4: "color:#00A",
                ef5: "color:#A0A",
                ef6: "color:#0AA",
                ef7: "color:#AAA",
                ef8: "color:#555",
                ef9: "color:#F55",
                ef10: "color:#5F5",
                ef11: "color:#FF5",
                ef12: "color:#55F",
                ef13: "color:#F5F",
                ef14: "color:#5FF",
                ef15: "color:#FFF",
                eb0: "background-color:#000",
                eb1: "background-color:#A00",
                eb2: "background-color:#0A0",
                eb3: "background-color:#A50",
                eb4: "background-color:#00A",
                eb5: "background-color:#A0A",
                eb6: "background-color:#0AA",
                eb7: "background-color:#AAA",
                eb8: "background-color:#555",
                eb9: "background-color:#F55",
                eb10: "background-color:#5F5",
                eb11: "background-color:#FF5",
                eb12: "background-color:#55F",
                eb13: "background-color:#F5F",
                eb14: "background-color:#5FF",
                eb15: "background-color:#FFF"
            }, toHexString = function(num) {
                for (num = num.toString(16); num.length < 2;) num = "0" + num;
                return num
            }, [0, 1, 2, 3, 4, 5].forEach(function(red) {
                return [0, 1, 2, 3, 4, 5].forEach(function(green) {
                    return [0, 1, 2, 3, 4, 5].forEach(function(blue) {
                        var b, c, g, n, r, rgb;
                        return c = 16 + 36 * red + 6 * green + blue, r = red > 0 ? 40 * red + 55 : 0, g = green > 0 ? 40 * green + 55 : 0, b = blue > 0 ? 40 * blue + 55 : 0, rgb = function() {
                            var _i, _len, _ref, _results;
                            for (_ref = [r, g, b], _results = [], _i = 0, _len = _ref.length; _i < _len; _i++) n = _ref[_i], _results.push(toHexString(n));
                            return _results
                        }().join(""), STYLES["ef" + c] = "color:#" + rgb, STYLES["eb" + c] = "background-color:#" + rgb
                    })
                })
            }),
            function() {
                for (_results = [], _i = 0; _i <= 23; _i++) _results.push(_i);
                return _results
            }.apply(this).forEach(function(gray) {
                var c, l;
                return c = gray + 232, l = toHexString(10 * gray + 8), STYLES["ef" + c] = "color:#" + l + l + l, STYLES["eb" + c] = "background-color:#" + l + l + l
            }), extend = function() {
                var dest, k, obj, objs, v, _j, _len;
                for (dest = arguments[0], objs = 2 <= arguments.length ? __slice.call(arguments, 1) : [], _j = 0, _len = objs.length; _j < _len; _j++) {
                    obj = objs[_j];
                    for (k in obj) v = obj[k], dest[k] = v
                }
                return dest
            }, defaults = {
                fg: "#FFF",
                bg: "#000"
            }, Filter = function() {
                function Filter(options) {
                    null == options && (options = {}), this.opts = extend({}, defaults, options), this.input = [], this.stack = []
                }
                return Filter.prototype.toHtml = function(input) {
                    var buf;
                    return this.input = "string" == typeof input ? [input] : input, buf = [], this.forEach(function(chunk) {
                        return buf.push(chunk)
                    }), this.input = [], buf.join("")
                }, Filter.prototype.forEach = function(callback) {
                    var buf, handleDisplay, _this = this;
                    if (buf = "", handleDisplay = function(code) {
                            if (code = parseInt(code, 10), code === -1 && callback("<br/>"), 0 === code && _this.stack.length && callback(_this.resetStyles()), 1 === code && callback(_this.pushTag("b")), 2 < code && code < 5 && callback(_this.pushTag("u")), 4 < code && code < 7 && callback(_this.pushTag("blink")), 8 === code && callback(_this.pushStyle("display:none")), 9 === code && callback(_this.pushTag("strike")), 24 === code && callback(_this.closeTag("u")), 29 < code && code < 38 && callback(_this.pushStyle("ef" + (code - 30))), 39 === code && callback(_this.pushStyle("color:" + _this.opts.fg)), 39 < code && code < 48 && callback(_this.pushStyle("eb" + (code - 40))), 49 === code && callback(_this.pushStyle("background-color:" + _this.opts.bg)), 89 < code && code < 98 && callback(_this.pushStyle("ef" + (8 + (code - 90)))), 99 < code && code < 108) return callback(_this.pushStyle("eb" + (8 + (code - 100))))
                        }, this.input.forEach(function(chunk) {
                            return buf += chunk, _this.tokenize(buf, function(tok, data) {
                                switch (tok) {
                                    case "text":
                                        return callback(data);
                                    case "display":
                                        return handleDisplay(data);
                                    case "xterm256":
                                        return callback(_this.pushStyle("ef" + data))
                                }
                            })
                        }), this.stack.length) return callback(this.resetStyles())
                }, Filter.prototype.pushTag = function(tag, style) {
                    return null == style && (style = ""), style.length && style.indexOf(":") === -1 && (style = STYLES[style]), this.stack.push(tag), ["<" + tag, style ? ' style="' + style + '"' : void 0, ">"].join("")
                }, Filter.prototype.pushStyle = function(style) {
                    return this.pushTag("span", style)
                }, Filter.prototype.closeTag = function(style) {
                    var last;
                    if (this.stack.slice(-1)[0] === style && (last = this.stack.pop()), null != last) return "</" + style + ">"
                }, Filter.prototype.resetStyles = function() {
                    var stack, _ref;
                    return _ref = [this.stack, []], stack = _ref[0], this.stack = _ref[1], stack.reverse().map(function(tag) {
                        return "</" + tag + ">"
                    }).join("")
                }, Filter.prototype.tokenize = function(text, callback) {
                    var ansiHandler, ansiMatch, ansiMess, handler, i, length, newline, process, realText, remove, removeXterm256, tokens, _j, _len, _results1, _this = this;
                    for (ansiMatch = !1, ansiHandler = 3, remove = function(m) {
                            return ""
                        }, removeXterm256 = function(m, g1) {
                            return callback("xterm256", g1), ""
                        }, newline = function(m) {
                            return _this.opts.newline ? callback("display", -1) : callback("text", m), ""
                        }, ansiMess = function(m, g1) {
                            var code, _j, _len;
                            for (ansiMatch = !0, 0 === g1.trim().length && (g1 = "0"), g1 = g1.trimRight(";").split(";"), _j = 0, _len = g1.length; _j < _len; _j++) code = g1[_j], callback("display", code);
                            return ""
                        }, realText = function(m) {
                            return callback("text", m), ""
                        }, tokens = [{
                            pattern: /^\x08+/,
                            sub: remove
                        }, {
                            pattern: /^\x1b\[38;5;(\d+)m/,
                            sub: removeXterm256
                        }, {
                            pattern: /^\n+/,
                            sub: newline
                        }, {
                            pattern: /^\x1b\[((?:\d{1,3};?)+|)m/,
                            sub: ansiMess
                        }, {
                            pattern: /^\x1b\[?[\d;]{0,3}/,
                            sub: remove
                        }, {
                            pattern: /^([^\x1b\x08\n]+)/,
                            sub: realText
                        }], process = function(handler, i) {
                            var matches;
                            i > ansiHandler && ansiMatch || (ansiMatch = !1, matches = text.match(handler.pattern), text = text.replace(handler.pattern, handler.sub))
                        }, _results1 = [];
                        (length = text.length) > 0;) {
                        for (i = _j = 0, _len = tokens.length; _j < _len; i = ++_j) handler = tokens[i], process(handler, i);
                        if (text.length === length) break;
                        _results1.push(void 0)
                    }
                    return _results1
                }, Filter
            }(), window.ansi_to_html = Filter
    }.call(this),
    function() {
        var __bind = function(fn, me) {
            return function() {
                return fn.apply(me, arguments)
            }
        };
        window.CSConsole = function() {
            function CSConsole(el, options) {
                this.moveInputForward = __bind(this.moveInputForward, this), this.addColors = __bind(this.addColors, this), this.formatWidgetElementText = __bind(this.formatWidgetElementText, this), this.buildWidget = __bind(this.buildWidget, this), this.renderResponse = __bind(this.renderResponse, this), this.responseObject = __bind(this.responseObject, this), this.lineNumber = __bind(this.lineNumber, this), this.inputLine = __bind(this.inputLine, this), this.promptLength = __bind(this.promptLength, this), this.submit = __bind(this.submit, this), this.initCallbacks = __bind(this.initCallbacks, this), this.showWelcomeMessage = __bind(this.showWelcomeMessage, this), this.previousHistory = __bind(this.previousHistory, this), this.nextHistory = __bind(this.nextHistory, this), this.focusInput = __bind(this.focusInput, this), this.innerConsole = __bind(this.innerConsole, this), this.reset = __bind(this.reset, this), this.getAllInput = __bind(this.getAllInput, this), this.setPrompt = __bind(this.setPrompt, this), this.getValue = __bind(this.getValue, this), this.setValue = __bind(this.setValue, this), this.options = options, this.options.prompt || (this.options.prompt = "> "), this.initCallbacks(options), this.initializeKeyMap(), this.initConsole(el), this.submitHistory = new CSConsoleHistory(this.options)
            }
            var CSConsoleHistory, KeyActions;
            return CSConsole.prototype.keyMap = {
                "Alt-Delete": "delGroupAfter",
                "Alt-Left": "goGroupLeft",
                "Alt-Right": "goGroupRight",
                "Cmd-Right": "goLineEnd",
                "Ctrl-E": "goLineEnd",
                "Ctrl-Alt-Backspace": "delGroupAfter",
                Delete: "delCharAfter",
                End: "goLineEnd",
                Home: "goLineStartSmart",
                PageDown: "goPageDown",
                PageUp: "goPageUp",
                Right: "goCharRight",
                "Ctrl-F": "goCharRight"
            }, CSConsole.prototype.outputWidgets = [], CSConsole.prototype.currentLine = 0, CSConsole.prototype.submitInProgress = !1, CSConsole.prototype.setValue = function(value) {
                return this.console.setLine(this.lineNumber(), "" + this.options.prompt + value)
            }, CSConsole.prototype.getValue = function() {
                return this.getAllInput()
            }, CSConsole.prototype.setPrompt = function(prompt) {
                return this.console.setLine(this.currentLine, this.console.getLine(this.currentLine).replace(new RegExp(this.options.prompt), prompt)), this.options.prompt = prompt
            }, CSConsole.prototype.focus = function() {
                return this.console.getInputField().focus()
            }, CSConsole.prototype.appendToInput = function(value) {
                return this.console.setLine(this.lineNumber(), "" + this.console.getLine(this.lineNumber()) + value)
            }, CSConsole.prototype.getAllInput = function() {
                var input, lineInput, startingInput;
                for (startingInput = this.currentLine, input = []; startingInput <= this.lineNumber();) startingInput === this.currentLine ? (lineInput = this.console.getLine(startingInput).substr(this.promptLength(), this.console.getLine(this.currentLine).length), input.push(lineInput)) : input.push(this.console.getLine(startingInput)), startingInput++;
                return input.join("\n")
            }, CSConsole.prototype.reset = function(welcomeMessage) {
                var widget, _i, _len, _ref;
                for (null == welcomeMessage && (welcomeMessage = !0), this.submitInProgress = !1, this.console.setValue(""), _ref = this.outputWidgets, _i = 0, _len = _ref.length; _i < _len; _i++) widget = _ref[_i], this.console.removeLineWidget(widget);
                return this.outputWidgets = [], this.options.welcomeMessage && welcomeMessage && (this.showWelcomeMessage(), this.moveInputForward()), this.console.refresh(), this.console.scrollIntoView()
            }, CSConsole.prototype.innerConsole = function() {
                return this.console
            }, CSConsole.prototype.initializeKeyMap = function() {
                return window.CodeMirror.keyMap.console = this.keyMap
            }, CSConsole.prototype.initConsole = function(el) {
                var keyActions, _this = this;
                return el.className += " cs-console cs-console-height cs-console-width", keyActions = new KeyActions(this.options), this.console = window.CodeMirror(el, {
                    mode: {
                        name: this.options.syntax,
                        useCPP: !0
                    },
                    gutter: this.options.lineNumbers,
                    lineNumbers: this.options.lineNumbers,
                    theme: this.options.theme || "vibrant-ink",
                    indentUnit: 2,
                    tabSize: 2,
                    keyMap: "console",
                    lineWrapping: !0,
                    onKeyEvent: this.focusInput,
                    undoDepth: 0,
                    autoFocus: this.options.autoFocus,
                    extraKeys: {
                        Enter: this.submit,
                        "Ctrl-M": this.submit,
                        Tab: this.noop,
                        Left: keyActions.goCharLeft,
                        "Ctrl-B": keyActions.goCharLeft,
                        Backspace: keyActions.delCharBefore,
                        "Cmd-Up": keyActions.goDocStart,
                        "Cmd-Down": keyActions.goDocEnd,
                        "Cmd-Left": keyActions.goLineStart,
                        Home: keyActions.goLineStart,
                        "Ctrl-A": keyActions.goLineStart,
                        "Alt-Backspace": keyActions.delGroupBefore,
                        "Ctrl-W": keyActions.delGroupBefore,
                        "Cmd-Backspace": keyActions.deleteLine,
                        Up: this.nextHistory,
                        Down: this.previousHistory,
                        "Ctrl-P": this.nextHistory,
                        "Ctrl-N": this.previousHistory,
                        "Shift-Cmd-Right": this.noop,
                        "Shift-Cmd-Left": this.noop,
                        "Shift-Right": this.noop,
                        "Shift-Alt-Right": this.noop,
                        "Shift-Alt-Left": this.noop,
                        "Ctrl-Enter": this.noop,
                        "Alt-Enter": this.noop,
                        "Shift-Tab": this.noop,
                        "Cmd-S": this.noop,
                        "Ctrl-Z": this.noop,
                        "Cmd-Z": this.noop
                    }
                }), keyActions.setConsole(this.console), setTimeout(function() {
                    return _this.console.refresh()
                }, 1), this.console.getScrollerElement().className += " cs-console-height", this.console.getWrapperElement().className += " cs-console-height cs-console-width", this.options.welcomeMessage && this.showWelcomeMessage(), this.options.initialValue && (this.setValue(this.options.initialValue), this.moveInputForward()), this.options.autoFocus && setTimeout(function() {
                    return _this.console.getInputField().focus()
                }, 10), this.moveInputForward()
            }, CSConsole.prototype.focusInput = function(cm, evt) {
                var cursorPos;
                return cursorPos = this.console.getCursor(), cursorPos.line === this.lineNumber() ? (this.storedCursorPosition = this.console.getCursor(), cursorPos.ch < this.promptLength() && this.console.setCursor({
                    line: cursorPos.line,
                    ch: this.promptLength()
                })) : this.console.setCursor(this.storedCursorPosition), !1
            }, CSConsole.prototype.nextHistory = function() {
                return this.setValue(this.submitHistory.nextHistory())
            }, CSConsole.prototype.previousHistory = function() {
                return this.setValue(this.submitHistory.previousHistory())
            }, CSConsole.prototype.showWelcomeMessage = function() {
                var line;
                return this.console.setValue(""), line = {
                    content: this.options.welcomeMessage
                }, this.buildWidget(1, line, {
                    above: !0
                })
            }, CSConsole.prototype.initCallbacks = function(options) {
                return this.commandValidate = options.commandValidate, this.commandHandle = options.commandHandle
            }, CSConsole.prototype.submit = function() {
                var input;
                return input = this.getAllInput(), void 0 !== this.options.commandValidate && !this.options.commandValidate(input) || this.submitInProgress ? this.submitInProgress ? this.nonReactingNewline() : this.moveInputForward() : (this.submitInProgress = !0, this.submitHistory.push(input), this.submitHistory.resetIndex(), this.commandHandle(input, this.responseObject(), this.options.prompt))
            }, CSConsole.prototype.nonReactingNewline = function() {
                return this.currentLine = this.lineNumber(), this.console.setLine(this.currentLine, "" + this.inputLine() + "\n")
            }, CSConsole.prototype.promptLength = function() {
                return this.options.prompt.length
            }, CSConsole.prototype.inputLine = function() {
                return this.console.getLine(this.lineNumber())
            }, CSConsole.prototype.lineNumber = function() {
                return this.console.lineCount() - 1
            }, CSConsole.prototype.responseObject = function() {
                var _this = this;
                return function(responseLines) {
                    return _this.renderResponse(responseLines)
                }
            }, CSConsole.prototype.renderResponse = function(responseLines) {
                var line, lineNumber, _i, _len;
                if (!responseLines) return this.moveInputForward(), void(this.submitInProgress = !1);
                if (lineNumber = this.lineNumber(), responseLines.constructor === Array)
                    for (_i = 0, _len = responseLines.length; _i < _len; _i++) line = responseLines[_i], this.buildWidget(lineNumber, line);
                else this.buildWidget(lineNumber, responseLines);
                return this.buildWidget(lineNumber, {
                    content: document.createElement("p"),
                    className: "cs-console-output-spacer bottom"
                }), this.moveInputForward(), this.submitInProgress = !1
            }, CSConsole.prototype.htmlEscape = function(string) {
                return ("" + string).replace(/&(?!\w+;|#\d+;|#x[\da-f]+;)/gi, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#x27;").replace(/\//g, "&#x2F;")
            }, CSConsole.prototype.buildWidget = function(lineNumber, responseLine, widgetOptions) {
                var widgetContent, widgetElement, _this = this;
                return null == widgetOptions && (widgetOptions = {}), widgetContent = responseLine ? responseLine.content : "", this.isHtmlElement(widgetContent) ? widgetElement = widgetContent : (widgetElement = document.createElement("div"), widgetElement.innerHTML = this.formatWidgetElementText(this.htmlEscape(widgetContent)), widgetElement.className = "cs-console-output-element", widgetElement.style.whiteSpace = "pre-wrap"), (null != responseLine ? responseLine.className : void 0) && (widgetElement.className += " " + responseLine.className), Object.keys(widgetOptions).indexOf("coverGutter") < 0 && (widgetOptions.coverGutter = !1), Object.keys(widgetOptions).indexOf("noHScroll") < 0 && (widgetOptions.noHScroll = !0), this.outputWidgets.push(this.console.addLineWidget(lineNumber, widgetElement, widgetOptions)), setTimeout(function() {
                    return _this.console.scrollIntoView({
                        line: _this.console.lineCount() - 1,
                        ch: 0
                    })
                }, 100)
            }, CSConsole.prototype.isHtmlElement = function(obj) {
                return obj && obj.constructor.toString().search(/HTML.+Element/) > 0
            }, CSConsole.prototype.formatWidgetElementText = function(message) {
                return message = message.replace(/^\s/, ""), message = "<p class='cs-console-output-spacer top'></p>" + message, this.addColors(message)
            }, CSConsole.prototype.addColors = function(message) {
                var filter;
                return filter = new window.ansi_to_html, filter.toHtml(message)
            }, CSConsole.prototype.moveInputForward = function() {
                return this.currentLine = this.lineNumber() + 1, this.console.setLine(this.currentLine - 1, "" + this.inputLine() + "\n" + this.options.prompt), this.storedCursorPosition = {
                    line: this.currentLine,
                    ch: this.promptLength()
                }, this.console.setCursor(this.storedCursorPosition)
            }, CSConsole.prototype.noop = function() {}, KeyActions = function() {
                function KeyActions(options) {
                    this.isCursorAtPrompt = __bind(this.isCursorAtPrompt, this), this.promptLength = __bind(this.promptLength, this), this.consoleLineCount = __bind(this.consoleLineCount, this), this.deleteLine = __bind(this.deleteLine, this), this.delGroupBefore = __bind(this.delGroupBefore, this), this.goLineStart = __bind(this.goLineStart, this), this.goDocEnd = __bind(this.goDocEnd, this), this.goDocStart = __bind(this.goDocStart, this), this.delCharBefore = __bind(this.delCharBefore, this), this.goCharLeft = __bind(this.goCharLeft, this), this.setConsole = __bind(this.setConsole, this), this.options = options
                }
                return KeyActions.prototype._defaultCommands = CodeMirror.commands, KeyActions.prototype.setConsole = function(console) {
                    return this.console = console
                }, KeyActions.prototype.goCharLeft = function() {
                    if (this.isCursorAtPrompt()) return this._defaultCommands.goCharLeft(this.console)
                }, KeyActions.prototype.delCharBefore = function() {
                    if (this.isCursorAtPrompt()) return this._defaultCommands.delCharBefore(this.console)
                }, KeyActions.prototype.goDocStart = function() {
                    return this.console.scrollIntoView({
                        line: 0,
                        ch: 0
                    })
                }, KeyActions.prototype.goDocEnd = function() {
                    return this.console.scrollIntoView({
                        line: this.consoleLineCount(),
                        ch: 0
                    })
                }, KeyActions.prototype.goLineStart = function() {
                    var cursorPos;
                    return cursorPos = this.console.getCursor(), this.console.setCursor({
                        line: cursorPos.line,
                        ch: this.promptLength()
                    })
                }, KeyActions.prototype.delGroupBefore = function() {
                    var cursorStartPos, futurePos;
                    if (cursorStartPos = this.console.getCursor(), this.console.moveH(-1, "group"), futurePos = this.console.getCursor().ch, this.console.setCursor(cursorStartPos), futurePos >= this.promptLength()) return this._defaultCommands.delGroupBefore(this.console)
                }, KeyActions.prototype.deleteLine = function() {
                    return this.console.setLine(this.console.getCursor().line, this.options.prompt)
                }, KeyActions.prototype.consoleLineCount = function() {
                    return this.console.lineCount() - 1
                }, KeyActions.prototype.promptLength = function() {
                    return this.options.prompt.length
                }, KeyActions.prototype.isCursorAtPrompt = function() {
                    return this.console.getCursor().ch > this.promptLength()
                }, KeyActions
            }(), CSConsoleHistory = function() {
                function CSConsoleHistory(options) {
                    this.previousHistory = __bind(this.previousHistory, this), this.nextHistory = __bind(this.nextHistory, this), this.getHistory = __bind(this.getHistory, this), this.push = __bind(this.push, this);
                    var localHistory;
                    this.options = options, this.options.historyLabel && (this.historyLabel = "cs-" + this.options.historyLabel + "-console-history"), this.options.maxEntries && (this.maxEntries = options.maxHistoryEntries), this.localStorageExists() && (this.storage = window.localStorage, localHistory = this.getHistory(), localHistory && (this.cachedHistory = localHistory), this.currentIndex = this.cachedHistory.length - 1)
                }
                return CSConsoleHistory.prototype.storage = {}, CSConsoleHistory.prototype.currentIndex = 0, CSConsoleHistory.prototype.historyLabel = "cs-console-history", CSConsoleHistory.prototype.cachedHistory = [], CSConsoleHistory.prototype.maxEntries = 25, CSConsoleHistory.prototype.localStorageExists = function() {
                    var e;
                    try {
                        return !(null === window.localStorage || !window.localStorage)
                    } catch (_error) {
                        return e = _error, !1
                    }
                }, CSConsoleHistory.prototype.push = function(item) {
                    var currentHistory, startSlice;
                    if (item && (currentHistory = this.getHistory(), currentHistory[currentHistory.length - 1] !== item)) return currentHistory.push(item), currentHistory.length >= this.maxEntries && (startSlice = currentHistory.length - this.maxEntries, currentHistory = currentHistory.slice(startSlice, currentHistory.length)), this.cachedHistory = currentHistory, this.storage[this.historyLabel] = JSON.stringify(currentHistory), this.currentIndex = currentHistory.length - 1
                }, CSConsoleHistory.prototype.getHistory = function() {
                    return this.storage[this.historyLabel] ? JSON.parse(this.storage[this.historyLabel]) : []
                }, CSConsoleHistory.prototype.nextHistory = function() {
                    var history;
                    return history = this.cachedHistory.length > 0 ? this.cachedHistory[this.currentIndex] : "", this.currentIndex > 0 && this.currentIndex--, history
                }, CSConsoleHistory.prototype.previousHistory = function() {
                    return this.currentIndex < this.cachedHistory.length - 1 ? (this.currentIndex++, this.cachedHistory[this.currentIndex]) : ""
                }, CSConsoleHistory.prototype.clearHistory = function() {
                    return this.storage[this.historyLabel] = "[]", this.cachedHistory = []
                }, CSConsoleHistory.prototype.resetIndex = function() {
                    return this.currentIndex = this.cachedHistory.length - 1
                }, CSConsoleHistory
            }(), CSConsole
        }.call(this)
    }.call(this), ! function(e) {
        if ("object" == typeof exports) module.exports = e();
        else if ("function" == typeof define && define.amd) define(e);
        else {
            var f;
            "undefined" != typeof window ? f = window : "undefined" != typeof global ? f = global : "undefined" != typeof self && (f = self), f.Abecedary = e()
        }
    }(function() {
        return function e(t, n, r) {
            function s(o, u) {
                if (!n[o]) {
                    if (!t[o]) {
                        var a = "function" == typeof require && require;
                        if (!u && a) return a(o, !0);
                        if (i) return i(o, !0);
                        throw new Error("Cannot find module '" + o + "'")
                    }
                    var f = n[o] = {
                        exports: {}
                    };
                    t[o][0].call(f.exports, function(e) {
                        var n = t[o][1][e];
                        return s(n ? n : e)
                    }, f, f.exports, e, t, n, r)
                }
                return n[o].exports
            }
            for (var i = "function" == typeof require && require, o = 0; o < r.length; o++) s(r[o]);
            return s
        }({
            1: [function(_dereq_, module, exports) {
                function Abecedary(iframeUrl, template, options) {
                    var generateElement = function() {
                        var element = document.createElement("div");
                        return element.style.cssText = "display:none;", document.body.appendChild(element), element
                    };
                    this.options = options || {}, this.iframeUrl = iframeUrl, this.template = template, this.options = extend({
                        ui: "bdd",
                        bail: !0,
                        ignoreLeaks: !0
                    }, this.options), this.element = this.options.element || generateElement(), delete this.options.element, this.sandbox = new Promise(function(resolve, reject) {
                        stuff(this.iframeUrl, {
                            el: this.element
                        }, function(context) {
                            context.on("finished", runComplete.bind(this)), context.on("loaded", loaded.bind(this, {
                                resolve: resolve,
                                reject: reject
                            })), context.on("error", error.bind(this)), context.load(this.template), this.context = context
                        }.bind(this))
                    }.bind(this));
                    var runComplete = function(report) {
                            this.emit("complete", report)
                        },
                        loaded = function(promise, report) {
                            this.context.evaljs("mocha.setup(" + JSON.stringify(this.options) + ");"), promise.resolve(this.context)
                        },
                        error = function(error) {
                            this.emit("error", error, this)
                        }
                }
                var component = _dereq_("./lib/component"),
                    runner = _dereq_("./lib/runner.js"),
                    stuff = component("adamfortuna-stuff.js"),
                    emitter = component("component-emitter"),
                    Promise = component("then-promise"),
                    extend = component("segmentio-extend");
                emitter(Abecedary.prototype), Abecedary.prototype.run = function(code, tests, globals) {
                    var _this = this;
                    this.sandbox.then(function(context) {
                        try {
                            context.evaljs(runner(code, tests || _this.tests, globals))
                        } catch (e) {
                            _this.emit("error", e)
                        }
                    })
                }, Abecedary.prototype.close = function(data) {
                    this.element.parentElement.removeChild(this.element)
                }, module.exports = Abecedary
            }, {
                "./lib/component": 2,
                "./lib/runner.js": 3
            }],
            2: [function(_dereq_, module, exports) {
                (function(global) {
                    function _require(path, parent, orig) {
                        var resolved = _require.resolve(path);
                        if (null == resolved) {
                            orig = orig || path, parent = parent || "root";
                            var err = new Error('Failed to require "' + orig + '" from "' + parent + '"');
                            throw err.path = orig, err.parent = parent, err._require = !0, err
                        }
                        var module = _require.modules[resolved];
                        if (!module._resolving && !module.exports) {
                            var mod = {};
                            mod.exports = {}, mod.client = mod.component = !0, module._resolving = !0, module.call(this, mod.exports, _require.relative(resolved), mod), delete module._resolving, module.exports = mod.exports
                        }
                        return module.exports
                    }
                    _require.modules = {}, _require.aliases = {}, _require.resolve = function(path) {
                        "/" === path.charAt(0) && (path = path.slice(1));
                        for (var paths = [path, path + ".js", path + ".json", path + "/index.js", path + "/index.json"], i = 0; i < paths.length; i++) {
                            var path = paths[i];
                            if (_require.modules.hasOwnProperty(path)) return path;
                            if (_require.aliases.hasOwnProperty(path)) return _require.aliases[path]
                        }
                    }, _require.normalize = function(curr, path) {
                        var segs = [];
                        if ("." != path.charAt(0)) return path;
                        curr = curr.split("/"), path = path.split("/");
                        for (var i = 0; i < path.length; ++i) ".." == path[i] ? curr.pop() : "." != path[i] && "" != path[i] && segs.push(path[i]);
                        return curr.concat(segs).join("/")
                    }, _require.register = function(path, definition) {
                        _require.modules[path] = definition
                    }, _require.alias = function(from, to) {
                        if (!_require.modules.hasOwnProperty(from)) throw new Error('Failed to alias "' + from + '", it does not exist');
                        _require.aliases[to] = from
                    }, _require.relative = function(parent) {
                        function lastIndexOf(arr, obj) {
                            for (var i = arr.length; i--;)
                                if (arr[i] === obj) return i;
                            return -1
                        }

                        function localRequire(path) {
                            var resolved = localRequire.resolve(path);
                            return _require(resolved, parent, path)
                        }
                        var p = _require.normalize(parent, "..");
                        return localRequire.resolve = function(path) {
                            var c = path.charAt(0);
                            if ("/" == c) return path.slice(1);
                            if ("." == c) return _require.normalize(p, path);
                            var segs = parent.split("/"),
                                i = lastIndexOf(segs, "deps") + 1;
                            return i || (i = 0), path = segs.slice(0, i + 1).join("/") + "/deps/" + path
                        }, localRequire.exists = function(path) {
                            return _require.modules.hasOwnProperty(localRequire.resolve(path))
                        }, localRequire
                    }, _require.register("component-emitter/index.js", function(exports, _require, module) {
                        function Emitter(obj) {
                            if (obj) return mixin(obj)
                        }

                        function mixin(obj) {
                            for (var key in Emitter.prototype) obj[key] = Emitter.prototype[key];
                            return obj
                        }
                        module.exports = Emitter, Emitter.prototype.on = Emitter.prototype.addEventListener = function(event, fn) {
                            return this._callbacks = this._callbacks || {}, (this._callbacks[event] = this._callbacks[event] || []).push(fn), this
                        }, Emitter.prototype.once = function(event, fn) {
                            function on() {
                                self.off(event, on), fn.apply(this, arguments)
                            }
                            var self = this;
                            return this._callbacks = this._callbacks || {}, on.fn = fn, this.on(event, on), this
                        }, Emitter.prototype.off = Emitter.prototype.removeListener = Emitter.prototype.removeAllListeners = Emitter.prototype.removeEventListener = function(event, fn) {
                            if (this._callbacks = this._callbacks || {}, 0 == arguments.length) return this._callbacks = {}, this;
                            var callbacks = this._callbacks[event];
                            if (!callbacks) return this;
                            if (1 == arguments.length) return delete this._callbacks[event], this;
                            for (var cb, i = 0; i < callbacks.length; i++)
                                if (cb = callbacks[i], cb === fn || cb.fn === fn) {
                                    callbacks.splice(i, 1);
                                    break
                                }
                            return this
                        }, Emitter.prototype.emit = function(event) {
                            this._callbacks = this._callbacks || {};
                            var args = [].slice.call(arguments, 1),
                                callbacks = this._callbacks[event];
                            if (callbacks) {
                                callbacks = callbacks.slice(0);
                                for (var i = 0, len = callbacks.length; i < len; ++i) callbacks[i].apply(this, args)
                            }
                            return this
                        }, Emitter.prototype.listeners = function(event) {
                            return this._callbacks = this._callbacks || {}, this._callbacks[event] || []
                        }, Emitter.prototype.hasListeners = function(event) {
                            return !!this.listeners(event).length
                        }
                    }), _require.register("johntron-asap/asap.js", function(exports, _require, module) {
                        "use strict";

                        function flush() {
                            for (; head.next;) {
                                head = head.next;
                                var task = head.task;
                                head.task = void 0;
                                try {
                                    task()
                                } catch (e) {
                                    if (isNodeJS) throw requestFlush(), e;
                                    setTimeout(function() {
                                        throw e
                                    }, 0)
                                }
                            }
                            flushing = !1
                        }

                        function asap(task) {
                            isNodeJS && process.domain && (task = process.domain.bind(task)), tail = tail.next = {
                                task: task,
                                next: null
                            }, flushing || (requestFlush(), flushing = !0)
                        }
                        var domain, head = {
                                task: void 0,
                                next: null
                            },
                            tail = head,
                            flushing = !1,
                            requestFlush = void 0,
                            hasSetImmediate = "function" == typeof setImmediate;
                        if ("undefined" != typeof global) var process = global.process;
                        var isNodeJS = !!process && "[object process]" === {}.toString.call(process);
                        if (isNodeJS) requestFlush = function() {
                            var currentDomain = process.domain;
                            currentDomain && (domain = domain || _require("domain"), domain.active = process.domain = null), flushing && hasSetImmediate ? setImmediate(flush) : process.nextTick(flush), currentDomain && (domain.active = process.domain = currentDomain)
                        };
                        else if (hasSetImmediate) requestFlush = function() {
                            setImmediate(flush)
                        };
                        else if ("undefined" != typeof MessageChannel) {
                            var channel = new MessageChannel;
                            channel.port1.onmessage = function() {
                                requestFlush = requestPortFlush, channel.port1.onmessage = flush, flush()
                            };
                            var requestPortFlush = function() {
                                channel.port2.postMessage(0)
                            };
                            requestFlush = function() {
                                setTimeout(flush, 0), requestPortFlush()
                            }
                        } else requestFlush = function() {
                            setTimeout(flush, 0)
                        };
                        module.exports = asap
                    }), _require.register("then-promise/index.js", function(exports, _require, module) {
                        "use strict";

                        function ValuePromise(value) {
                            this.then = function(onFulfilled) {
                                return "function" != typeof onFulfilled ? this : new Promise(function(resolve, reject) {
                                    asap(function() {
                                        try {
                                            resolve(onFulfilled(value))
                                        } catch (ex) {
                                            reject(ex)
                                        }
                                    })
                                })
                            }
                        }
                        var Promise = _require("./core.js"),
                            asap = _require("asap");
                        module.exports = Promise, ValuePromise.prototype = Object.create(Promise.prototype);
                        var TRUE = new ValuePromise((!0)),
                            FALSE = new ValuePromise((!1)),
                            NULL = new ValuePromise(null),
                            UNDEFINED = new ValuePromise((void 0)),
                            ZERO = new ValuePromise(0),
                            EMPTYSTRING = new ValuePromise("");
                        Promise.from = Promise.cast = function(value) {
                            if (value instanceof Promise) return value;
                            if (null === value) return NULL;
                            if (void 0 === value) return UNDEFINED;
                            if (value === !0) return TRUE;
                            if (value === !1) return FALSE;
                            if (0 === value) return ZERO;
                            if ("" === value) return EMPTYSTRING;
                            if ("object" == typeof value || "function" == typeof value) try {
                                var then = value.then;
                                if ("function" == typeof then) return new Promise(then.bind(value))
                            } catch (ex) {
                                return new Promise(function(resolve, reject) {
                                    reject(ex)
                                })
                            }
                            return new ValuePromise(value)
                        }, Promise.denodeify = function(fn, argumentCount) {
                            return argumentCount = argumentCount || 1 / 0,
                                function() {
                                    var self = this,
                                        args = Array.prototype.slice.call(arguments);
                                    return new Promise(function(resolve, reject) {
                                        for (; args.length && args.length > argumentCount;) args.pop();
                                        args.push(function(err, res) {
                                            err ? reject(err) : resolve(res)
                                        }), fn.apply(self, args)
                                    })
                                }
                        }, Promise.nodeify = function(fn) {
                            return function() {
                                var args = Array.prototype.slice.call(arguments),
                                    callback = "function" == typeof args[args.length - 1] ? args.pop() : null;
                                try {
                                    return fn.apply(this, arguments).nodeify(callback)
                                } catch (ex) {
                                    if (null === callback || "undefined" == typeof callback) return new Promise(function(resolve, reject) {
                                        reject(ex)
                                    });
                                    asap(function() {
                                        callback(ex)
                                    })
                                }
                            }
                        }, Promise.all = function() {
                            var args = Array.prototype.slice.call(1 === arguments.length && Array.isArray(arguments[0]) ? arguments[0] : arguments);
                            return new Promise(function(resolve, reject) {
                                function res(i, val) {
                                    try {
                                        if (val && ("object" == typeof val || "function" == typeof val)) {
                                            var then = val.then;
                                            if ("function" == typeof then) return void then.call(val, function(val) {
                                                res(i, val)
                                            }, reject)
                                        }
                                        args[i] = val, 0 === --remaining && resolve(args)
                                    } catch (ex) {
                                        reject(ex)
                                    }
                                }
                                if (0 === args.length) return resolve([]);
                                for (var remaining = args.length, i = 0; i < args.length; i++) res(i, args[i])
                            })
                        }, Promise.prototype.done = function(onFulfilled, onRejected) {
                            var self = arguments.length ? this.then.apply(this, arguments) : this;
                            self.then(null, function(err) {
                                asap(function() {
                                    throw err
                                })
                            })
                        }, Promise.prototype.nodeify = function(callback) {
                            return null === callback || "undefined" == typeof callback ? this : void this.then(function(value) {
                                asap(function() {
                                    callback(null, value)
                                })
                            }, function(err) {
                                asap(function() {
                                    callback(err)
                                })
                            })
                        }, Promise.prototype["catch"] = function(onRejected) {
                            return this.then(null, onRejected)
                        }, Promise.resolve = function(value) {
                            return new Promise(function(resolve) {
                                resolve(value)
                            })
                        }, Promise.reject = function(value) {
                            return new Promise(function(resolve, reject) {
                                reject(value)
                            })
                        }, Promise.race = function(values) {
                            return new Promise(function(resolve, reject) {
                                values.map(function(value) {
                                    Promise.cast(value).then(resolve, reject)
                                })
                            })
                        }
                    }), _require.register("then-promise/core.js", function(exports, _require, module) {
                        "use strict";

                        function Promise(fn) {
                            function handle(deferred) {
                                return null === state ? void deferreds.push(deferred) : void asap(function() {
                                    var cb = state ? deferred.onFulfilled : deferred.onRejected;
                                    if (null === cb) return void(state ? deferred.resolve : deferred.reject)(value);
                                    var ret;
                                    try {
                                        ret = cb(value)
                                    } catch (e) {
                                        return void deferred.reject(e)
                                    }
                                    deferred.resolve(ret)
                                })
                            }

                            function resolve(newValue) {
                                try {
                                    if (newValue === self) throw new TypeError("A promise cannot be resolved with itself.");
                                    if (newValue && ("object" == typeof newValue || "function" == typeof newValue)) {
                                        var then = newValue.then;
                                        if ("function" == typeof then) return void doResolve(then.bind(newValue), resolve, reject)
                                    }
                                    state = !0, value = newValue, finale()
                                } catch (e) {
                                    reject(e)
                                }
                            }

                            function reject(newValue) {
                                state = !1, value = newValue, finale()
                            }

                            function finale() {
                                for (var i = 0, len = deferreds.length; i < len; i++) handle(deferreds[i]);
                                deferreds = null
                            }
                            if ("object" != typeof this) throw new TypeError("Promises must be constructed via new");
                            if ("function" != typeof fn) throw new TypeError("not a function");
                            var state = null,
                                value = null,
                                deferreds = [],
                                self = this;
                            this.then = function(onFulfilled, onRejected) {
                                return new Promise(function(resolve, reject) {
                                    handle(new Handler(onFulfilled, onRejected, resolve, reject))
                                })
                            }, doResolve(fn, resolve, reject)
                        }

                        function Handler(onFulfilled, onRejected, resolve, reject) {
                            this.onFulfilled = "function" == typeof onFulfilled ? onFulfilled : null, this.onRejected = "function" == typeof onRejected ? onRejected : null, this.resolve = resolve, this.reject = reject
                        }

                        function doResolve(fn, onFulfilled, onRejected) {
                            var done = !1;
                            try {
                                fn(function(value) {
                                    done || (done = !0, onFulfilled(value))
                                }, function(reason) {
                                    done || (done = !0, onRejected(reason))
                                })
                            } catch (ex) {
                                if (done) return;
                                done = !0, onRejected(ex)
                            }
                        }
                        var asap = _require("asap");
                        module.exports = Promise
                    }), _require.register("segmentio-extend/index.js", function(exports, _require, module) {
                        module.exports = function(object) {
                            for (var source, args = Array.prototype.slice.call(arguments, 1), i = 0; source = args[i]; i++)
                                if (source)
                                    for (var property in source) object[property] = source[property];
                            return object
                        }
                    }), _require.register("adamfortuna-stuff.js/lib/stuff.js", function(exports, _require, module) {
                        ! function(global) {
                            "use strict";

                            function stuff(url, options, cb) {
                                function init() {
                                    context.handshake(), once || (cb(context), once = !0)
                                }
                                "function" == typeof options && (cb = options, options = {}), cb || (cb = noop);
                                var el = options && 1 === options.nodeType ? options : options.el || document.querySelector("body");
                                options.el = null;
                                var iframe = document.createElement("iframe"),
                                    context = new Context(iframe, options);
                                global.addEventListener("message", context.messageHandler.bind(context), !1), iframes.push(iframe), iframe.setAttribute("scrolling", "no"), iframe.setAttribute("src", url);
                                var once = !1;
                                iframe.addEventListener("load", init, !1), el.appendChild(iframe)
                            }

                            function Context(iframe, options) {
                                if (this.iframe = iframe, this.callbacks = {}, this.eventQ = {
                                        load: [],
                                        evaljs: [],
                                        html: []
                                    }, options.sandbox === !0) this.sandbox = "allow-scripts allow-same-origin";
                                else if ("string" == typeof options.sandbox) {
                                    var sandbox = options.sandbox;
                                    sandbox.indexOf("allow-scripts") === -1 && (sandbox += " allow-scripts"), sandbox.indexOf("allow-same-origin") === -1 && (sandbox += " allow-same-origin"), this.sandbox = sandbox
                                } else this.sandbox = null;
                                this.secret = Math.ceil(999999999 * Math.random()) + 1
                            }
                            var iframes = [],
                                noop = function() {};
                            stuff.clear = function() {
                                iframes.forEach(function(iframe) {
                                    var parent = iframe.parentElement;
                                    parent && parent.removeChild(iframe)
                                }), iframes = []
                            }, Context.prototype.handle = function(type, data) {
                                var callbacks, that = this;
                                if ("custom" === type) {
                                    var msg = data;
                                    callbacks = this.callbacks[msg.type] || [], callbacks.forEach(function(cb) {
                                        "function" == typeof cb && cb.call(cb.thisArg || that, msg.data)
                                    })
                                } else {
                                    if (callbacks = this.eventQ[type], !callbacks) return;
                                    var cb = callbacks.shift();
                                    "function" == typeof cb && cb.call(cb.thisArg || that, data)
                                }
                            }, Context.prototype.messageHandler = function(e) {
                                var msg;
                                try {
                                    msg = JSON.parse(e.data)
                                } catch (err) {
                                    return
                                }
                                if (msg.secret === this.secret) {
                                    var data = msg.data,
                                        type = msg.type;
                                    this.handle(type, data)
                                }
                            }, Context.prototype.post = function(type, data) {
                                this.iframe.contentWindow.postMessage(JSON.stringify({
                                    type: type,
                                    data: data,
                                    secret: this.secret
                                }), "*")
                            }, Context.prototype.evaljs = function(js, cb, thisArg) {
                                var callback = function(d) {
                                    var Type, e = d.error,
                                        error = e;
                                    e && (Type = global[e.__errorType__]) && (error = new Type(e.message), error.stack = e.stack, error.type = e.type, error.arguments = e.arguments), (cb || noop).call(this, error, d.result)
                                };
                                callback.thisArg = thisArg, this.eventQ.evaljs.push(callback), this.post("evaljs", js)
                            }, Context.prototype.load = function(html, cb, thisArg) {
                                cb = cb || noop, cb.thisArg = thisArg, this.eventQ.load.push(cb), this.post("load", html)
                            }, Context.prototype.html = function(cb, thisArg) {
                                cb = cb || noop, cb.thisArg = thisArg, this.eventQ.html.push(cb), this.post("html", null)
                            }, Context.prototype.handshake = function() {
                                this.post("handshake", this.sandbox)
                            }, Context.prototype.on = function(event, cb, thisArg) {
                                cb = cb || noop, cb.thisArg = thisArg, this.callbacks[event] ? this.callbacks[event].push(cb) : this.callbacks[event] = [cb]
                            }, Context.prototype.off = function(event, cb) {
                                var callbacks = this.callbacks[event];
                                if (callbacks) {
                                    var i = callbacks.indexOf(cb);
                                    i !== -1 && callbacks.splice(i, 1)
                                } else this.callbacks[event] = []
                            }, stuff.Context = Context, global.stuff = stuff, module.exports = stuff
                        }(this)
                    }), _require.alias("component-emitter/index.js", "abecedary/deps/emitter/index.js"), _require.alias("component-emitter/index.js", "emitter/index.js"), _require.alias("then-promise/index.js", "abecedary/deps/promise/index.js"), _require.alias("then-promise/core.js", "abecedary/deps/promise/core.js"), _require.alias("then-promise/index.js", "promise/index.js"), _require.alias("johntron-asap/asap.js", "then-promise/deps/asap/asap.js"), _require.alias("johntron-asap/asap.js", "then-promise/deps/asap/index.js"), _require.alias("johntron-asap/asap.js", "johntron-asap/index.js"), _require.alias("segmentio-extend/index.js", "abecedary/deps/extend/index.js"), _require.alias("segmentio-extend/index.js", "extend/index.js"), _require.alias("adamfortuna-stuff.js/lib/stuff.js", "abecedary/deps/stuff.js/lib/stuff.js"), _require.alias("adamfortuna-stuff.js/lib/stuff.js", "abecedary/deps/stuff.js/index.js"), _require.alias("adamfortuna-stuff.js/lib/stuff.js", "stuff.js/index.js"), _require.alias("adamfortuna-stuff.js/lib/stuff.js", "adamfortuna-stuff.js/index.js"), module.exports = _require
                }).call(this, "undefined" != typeof self ? self : "undefined" != typeof window ? window : {})
            }, {}],
            3: [function(_dereq_, module, exports) {
                module.exports = function(code, tests, globals) {
                    return globals || (globals = {}), ["try {", "  window.code = JSON.parse(" + JSON.stringify(JSON.stringify(code)) + ");", "  var globals = JSON.parse(" + JSON.stringify(JSON.stringify(globals)) + ");", "  for (var property in globals) {", "    window[property] = globals[property];", "  }", "  mocha.suite.suites.splice(0, mocha.suite.suites.length)", "", "// Begin Tests", tests, "// End Tests", "", "  window.mocha.run();", "} catch(e) {", "  rethrow(e, JSON.parse(" + JSON.stringify(JSON.stringify(tests)) + "), 6);", "}", !0].join("\n")
                }
            }, {}]
        }, {}, [1])(1)
    });