var JS = {};
JS.Globals = {}, JS.Classes = {}, JS.Helpers = {}, JS.Modules = {}, JS.Pages = {}, JS.Services = {}, JS.Inbox = {}, JS.Globals = {
    homepageChallengeAnswer: /^('|")[^'"]+\1;?$/,
    userNameCookie: "try_name",
    Vendor: {
        autosizeQuery: ".js-autosize"
    }
}, window.klipse_settings = {
    selector_eval_js: ".js-klipse"
}, jQuery(function($) {
    new JS.Classes.Dispatcher({
        events: [{
            page: "course",
            run: function() {
                JS.Pages.Course()
            }
        }, {
            page: "home",
            run: function() {
                JS.Pages.Home()
            }
        }]
    })
}), jQuery(function($) {
    jQuery(".js-codeMirror").each(function() {
        var $element = jQuery(this),
            text = $element.text();
        CodeMirror(this.parentNode, {
            mode: "javascript",
            readOnly: "nocursor",
            value: text
        }), $element.remove()
    })
}), JS.Classes.Dispatcher = function() {
    function Dispatcher(options) {
        this.options = options, this.init()
    }
    return Dispatcher.prototype._settings = {}, Dispatcher.prototype.init = function() {
        this._settings = jQuery.extend({
            $element: jQuery(".js-dispatcher"),
            dataAttr: "dispatcher-page",
            events: []
        }, this.options), this.dispatch()
    }, Dispatcher.prototype.dispatch = function(event) {
        var i, len, page, ref, results;
        if (null == event && (event = null), page = this._getCurrentPage(), !page) return !1;
        if (null == event) {
            for (ref = this._settings.events, results = [], i = 0, len = ref.length; i < len; i++) {
                switch (event = ref[i], event.page) {
                    case page:
                        event.run()
                }
                event.match && page.match(event.match) ? results.push(event.run()) : results.push(void 0)
            }
            return results
        }
        switch (event.page) {
            case page:
                return event.run()
        }
    }, Dispatcher.prototype._getCurrentPage = function() {
        return this._settings.$element.data(this._settings.dataAttr)
    }, Dispatcher
}(), JS.Pages.Course = function() {
    JS.Modules.Toggle.init({
        $element: jQuery(".js-courseLayout-toggle"),
        proximity: jQuery(".js-courseLayout"),
        toggleClass: "is-active"
    }), jQuery(".js-courseLayout").addClass("is-loaded"), jQuery(".js-preload").addClass("is-hidden")
}, JS.Pages.Home = function() {
    new JS.Modules.Console.init(), JS.Services.expel({
        $toggle: jQuery(".js-alert-close"),
        elementNode: ".js-alert"
    }), jQuery(".js-inlineConsole-btn").on("click", function(event) {
        var name = jQuery(".js-inlineConsole-input").val().replace(/['";]/g, "");
        document.cookie = JS.Globals.userNameCookie + "=" + name
    })
}, JS.Helpers.cleanUrl = function(url) {
    var anchor = document.createElement("a");
    return anchor.href = url, anchor.protocol + "//" + anchor.host + anchor.pathname
}, JS.Modules.Console = function() {
    var _settings = {},
        init = function(options) {
            _settings = jQuery.extend({
                $element: jQuery(".js-inlineConsole"),
                $input: jQuery(".js-inlineConsole-input"),
                correctClass: "is-correct",
                incorrectClass: "is-incorrect"
            }, options), _settings.$input.focus(), _setEventHandlers()
        },
        _setEventHandlers = function() {
            _settings.$element.on("submit", function(event) {
                event.preventDefault();
                var $element = jQuery(this),
                    value = _settings.$input.val();
                value.match(JS.Globals.homepageChallengeAnswer) ? ($element.removeClass(_settings.incorrectClass), $element.addClass(_settings.correctClass), ga("send", "event", "challenge", "success", 1)) : ($element.removeClass(_settings.correctClass), $element.addClass(_settings.incorrectClass), setTimeout(function() {
                    $element.removeClass(_settings.incorrectClass)
                }, 500))
            })
        };
    return {
        init: init
    }
}(), JS.Modules.Toggle = function() {
    var _settings = {},
        init = function(options) {
            _settings = jQuery.extend({
                $element: jQuery(".js-toggle"),
                proximity: "next",
                event: "click",
                toggleClass: "is-hidden",
                activeClass: "is-active",
                initialState: null,
                onClick: null,
                onMouseover: null,
                onMouseout: null
            }, options), _setEventHandlers()
        },
        _setEventHandlers = function() {
            switch (_settings.event) {
                case "click":
                    return void _handleClickEvent();
                case "hover":
                    _handleHoverEvent()
            }
        },
        _handleClickEvent = function() {
            _settings.$element.on("click", function(event) {
                event.preventDefault();
                var $element = jQuery(this);
                switch (null != _settings.onClick && _settings.onClick(_settings), _settings.$element.toggleClass(_settings.activeClass), _settings.proximity) {
                    case "next":
                        return $element.next().toggleClass(_settings.toggleClass);
                    case "prev":
                        return $element.prev().toggleClass(_settings.toggleClass);
                    case "nextParent":
                        return $element.parent().next().toggleClass(_settings.toggleClass);
                    case "prevParent":
                        return $element.parent().prev().toggleClass(_settings.toggleClass);
                    default:
                        return "object" == typeof _settings.proximity ? _settings.proximity.toggleClass(_settings.toggleClass) : $element.find(_settings.proximity).toggleClass(_settings.toggleClass)
                }
            })
        },
        _handleHoverEvent = function() {
            _settings.initialState && _settings.initialState(_settings), _settings.$element.on({
                mouseenter: function() {
                    _handleHoverStateEvent(jQuery(this), "on")
                },
                mouseleave: function() {
                    _handleHoverStateEvent(jQuery(this), "off")
                }
            })
        },
        _handleHoverStateEvent = function($element, state) {
            switch (state) {
                case "on":
                    null != _settings.onMouseover && _settings.onMouseover(_settings), $element.addClass(_settings.activeClass);
                    break;
                case "off":
                    null != _settings.onMouseout && _settings.onMouseout(_settings), $element.removeClass(_settings.activeClass)
            }
            switch (_settings.proximity) {
                case "next":
                    _toggleClass($element.next());
                case "prev":
                    _toggleClass($element.prev());
                case "nextParent":
                    _toggleClass($element.parent().next());
                case "prevParent":
                    _toggleClass($element.parent().prev());
                default:
                    _toggleClass("object" == typeof _settings.proximity ? _settings.proximity : $element.find(_settings.proximity))
            }
        },
        _toggleClass = function($element, classToToggle) {
            null == classToToggle && (classToToggle = _settings.toggleClass), $element.hasClass(classToToggle) ? $element.removeClass(classToToggle) : $element.addClass(classToToggle)
        };
    return {
        init: init
    }
}(), JS.Services.expel = function(options) {
    var settings = jQuery.extend({
        $toggle: jQuery(".js-expel-toggle"),
        elementNode: ".js-expel",
        expelClass: "is-dismissed"
    }, options);
    settings.$toggle.on("click", function(event) {
        event.preventDefault();
        var element = jQuery(this);
        element.closest(settings.elementNode).addClass(settings.expelClass), setTimeout(function() {
            element.closest(settings.elementNode).remove()
        }, 500)
    })
};