angular.module("javascriptcom", ["ngResource", "ngAnimate", "ngCookies"]).config(["$httpProvider", function($httpProvider) {
    $httpProvider.defaults.cache = !0
}]), angular.module("javascriptcom").directive("jsChallenge", function() {
    return {
        templateUrl: "/etc.clientlibs/pluralsight/clientlibs/clientlib-main/resources/js/separates/javascript-intro/templates/challenge.html",
        replace: !0,
        scope: {
            challenge: "="
        },
        bindToController: !0,
        controllerAs: "ctrl",
        controller: function() {}
    }
}), angular.module("javascriptcom").directive("jsConsole", ["CSConsole", "jsCommand", "jsChallengeProgress", "jsSuccessCloud", function(CSConsole, jsCommand, jsChallengeProgress, jsSuccessCloud) {
    return {
        templateUrl: "/etc.clientlibs/pluralsight/clientlibs/clientlib-main/resources/js/separates/javascript-intro/templates/console.html",
        replace: !0,
        scope: !0,
        bindToController: !0,
        controllerAs: "ctrl",
        require: "^jsCourse",
        link: function(scope, element, attrs, ctrl) {
            element.on("click", function() {
                jsChallengeProgress.console.focus()
            });
            var onSuccess = function(challenge) {
                    challenge && (console.log("successful challenge!"), challenge.completed = !0, jsSuccessCloud.trigger(), jsChallengeProgress.next(), ga("send", "event", "challenge", "success", challenge.id))
                },
                onFailure = function(challenge) {
                    console.log("failed challenge!")
                },
                command = new jsCommand(onSuccess, onFailure),
                el = jQuery(element).find(".sb-console-ui")[0];
            jsChallengeProgress.console = new CSConsole(el, {
                prompt: "> ",
                syntax: "javascript",
                autoFocus: !0,
                welcomeMessage: jQuery("<p>Press <code>enter</code> to submit commands</p>")[0],
                commandValidate: command.validate,
                commandHandle: command.handler
            })
        }
    }
}]), angular.module("javascriptcom").directive("jsCourse", ["jsCourseChallengeResource", "jsChallengeProgress", "$cookies", "jsCourseState", "jsExecutor", function(jsCourseChallengeResource, jsChallengeProgress, $cookies, jsCourseState, jsExecutor) {
    return {
        replace: !0,
        templateUrl: "/etc.clientlibs/pluralsight/clientlibs/clientlib-main/resources/js/separates/javascript-intro/templates/course.html",
        scope: {
            course: "@"
        },
        bindToController: !0,
        controllerAs: "ctrl",
        controller: function(jsCourseChallengeResource, jsChallengeProgress, jsCourseState) {
            var _this = this;
            this.challenges = jsCourseChallengeResource.query({
                course: this.course
            }), this.challengeProgress = jsChallengeProgress, this.challenges.$promise.then(function() {
                var cookieCourseState = $cookies.getObject("course_state"),
                    cookieChallengeState = $cookies.get("course_challenge_state"),
                    tryName = $cookies.get("try_name");
                _this.challengeProgress.setChallenges(_this.challenges), jsCourseState.update(cookieCourseState || (tryName ? {
                    username: tryName
                } : {})), (cookieChallengeState || tryName) && _this.challengeProgress.fastForward(cookieChallengeState || 1)
            }), this.activateChallenge = function(_challenge) {
                this.challengeProgress.activate(_challenge), this.challenge = _challenge
            }, this.onWrapupPage = function() {
                return !jsChallengeProgress.activeChallenge()
            }, jsExecutor.run("0", "")
        }
    }
}]), angular.module("javascriptcom").directive("jsInstructions", ["jsChallengeProgress", "jsCourseState", function(jsChallengeProgress, jsCourseState) {
    return {
        templateUrl: "/etc.clientlibs/pluralsight/clientlibs/clientlib-main/resources/js/separates/javascript-intro/templates/instructions.html",
        replace: !0,
        scope: !0,
        bindToController: !0,
        controllerAs: "ctrl",
        require: "^jsChallenge",
        link: function(scope, element, attrs, ctrl) {
            ctrl.state = jsCourseState.state, jQuery(element).on("click", "code", function(e) {
                if (!jsChallengeProgress.console) return !0;
                var csConsole = jsChallengeProgress.console,
                    text = jQuery(this).text().split(""),
                    timer = text.length > 15 ? 35 : 70,
                    count = 0;
                return jQuery(this).text() === csConsole.getValue() ? void csConsole.focus() : (ctrl.ticker || (csConsole.setValue(""), ctrl.ticker = setInterval(function() {
                    var letter = text[count];
                    count += 1, letter ? csConsole.appendToInput(letter) : (clearInterval(ctrl.ticker), ctrl.ticker = !1)
                }, timer)), void csConsole.focus())
            })
        }
    }
}]), angular.module("javascriptcom").directive("jsSafeHtml", ["$sce", function($sce) {
    return {
        restrict: "A",
        scope: {
            jsSafeHtml: "@"
        },
        template: "<div ng-bind-html='safeHtml'></div>",
        link: function(scope, element, attrs) {
            function setHtml(value) {
                value && (scope.safeHtml = $sce.trustAsHtml(value.replace(/^\s+|\s+$/g, "")), unregister())
            }
            var unregister = scope.$watch("jsSafeHtml", setHtml)
        }
    }
}]), angular.module("javascriptcom").directive("tooltip", function() {
    return {
        restrict: "A",
        scope: {
            tooltip: "@"
        },
        link: function(scope, element, attrs) {
            jQuery(element).tooltip({
                animation: !1,
                container: "body",
                trigger: "hover",
                placement: "bottom",
                title: function() {
                    return scope.tooltip
                },
                viewport: {
                    selector: "body",
                    padding: 10
                }
            })
        }
    }
}), angular.module("javascriptcom").filter("markdown", ["marked", function(marked) {
    return function(text) {
        return marked(text)
    }
}]), angular.module("javascriptcom").filter("stateify", ["$interpolate", function($interpolate) {
    return function(text, scope) {
        return $interpolate(text)(scope)
    }
}]), angular.module("javascriptcom").factory("jsCourseChallengeResource", function($resource) {
    return $resource("/etc.clientlibs/pluralsight/clientlibs/clientlib-main/resources/js/separates/javascript-intro/challenges.json", {}, {})
}), angular.module("javascriptcom").factory("jsCourseResource", function($resource) {
    return $resource("/courses/:course.json", {}, {})
}), angular.module("javascriptcom").factory("jsCommand", ["_", "jsCommandFactory", "jsChallengeProgress", "$filter", function(_, jsCommandFactory, jsChallengeProgress, $filter) {
    return function(successCallback, errorCallback) {
        function filterMessage(content) {
            var marked = $filter("markdown")(content.textContent);
            return jQuery(content).html(marked)[0], {
                content: content
            }
        }

        function jsReportAdapter(content) {
            var messages = [];
            return _.isArray(content) ? _.each(content, function(obj) {
                "undefined" !== obj.content.textContent && messages.push(filterMessage(obj.content))
            }) : (content = filterMessage(_.isObject(content) && content.content ? content.content : content), messages.push(content)), messages
        }
        var vm = this;
        vm.handler = function(line, report) {
            var command = jsCommandFactory(line),
                challenge = jsChallengeProgress.activeChallenge();
            command(challenge, line).then(function(content) {
                report(jsReportAdapter(content)), successCallback(challenge)
            }, function(content) {
                report(jsReportAdapter(content)), errorCallback(challenge)
            })
        }, vm.validate = function(line) {
            return line.length > 0
        }
    }
}]), angular.module("javascriptcom").factory("jsCommandFactory", ["_", "jsJavaScriptCommand", function(_, jsJavaScriptCommand) {
    function jsCommandFactory(command) {
        return _.find(matchers, function(m) {
            return command.match(m.pattern)
        }).handler
    }
    var matchers = [{
        pattern: /[.|\s]*/,
        handler: jsJavaScriptCommand
    }];
    return jsCommandFactory
}]), angular.module("javascriptcom").factory("jsCommandReport", ["_", function(_) {
    function jsCommandReport(challenge, report) {
        this.challenge = challenge, this.report = report, this.isSuccess = function() {
            return 0 == this.report.failures.length
        }, this.state = function() {
            return this.report.details.state
        }, this.successMessage = function() {
            return "Correct!"
        }, this.failureMessage = function() {
            return this.failure() ? _.compact([this.failure().message, this.errorMessage()]).join(": ") : this.errorMessage()
        }, this.output = function() {
            return this.report.details.output
        }, this.failure = function() {
            return this.challenge.failures[this.failureName()]
        }, this.failureName = function() {
            return this.report.failures[0].title
        }, this.errorMessage = function() {
            if (this.isSuccess()) return null;
            var message = this.report.failures[0].err ? this.report.failures[0].err.message : null;
            return message && message.match(/Unspecified AssertionError/) ? null : message
        }
    }
    return jsCommandReport
}]), angular.module("javascriptcom").factory("jsExecutor", ["Abecedary", function(Abecedary) {
    var iframeTemplate = ["<!DOCTYPE html>", "<html>", "  <head>", "    <title>Abecedary Tests</title>", "  </head>", "  <body>", '    <script src="/etc.clientlibs/pluralsight/clientlibs/clientlib-main/resources/js/separates/javascript-intro/abecedary-javascript-com.js"></script>', "  </body>", "</html>"].join("\n"),
        sandbox = new Abecedary("/etc.clientlibs/pluralsight/clientlibs/clientlib-main/resources/js/separates/javascript-intro/templates/iframe.html", iframeTemplate);
    return sandbox
}]), angular.module("javascriptcom").factory("jsChallengeProgress", ["_", "$cookies", "jsCourseState", function(_, $cookies, jsCourseState) {
    var state = {
        courseCompleted: !1,
        challenges: [],
        console: null,
        setChallenges: function(challenges) {
            this.challenges = challenges
        },
        next: function() {
            var challengeIndex = _.findIndex(this.challenges, {
                active: !0
            });
            return this.setCookies(challengeIndex), challengeIndex + 1 == this.challenges.length ? (this.courseCompleted = !0, this.challenges[challengeIndex].active = !1, !0) : (this.challenges[challengeIndex].active = !1, this.challenges[challengeIndex + 1].active = !0, void(this.challenges[challengeIndex + 1].started = !0))
        },
        setCookies: function(challengeIndex) {
            $cookies.putObject("course_state", jsCourseState.state);
            var cookieChallengeState = $cookies.get("course_challenge_state");
            (cookieChallengeState <= challengeIndex + 1 || void 0 === cookieChallengeState) && $cookies.put("course_challenge_state", challengeIndex + 1)
        },
        fastForward: function(challengeIndex) {
            var _this = this;
            _.times(challengeIndex, function(n) {
                _this.challenges[n].completed = !0, _this.challenges[n].active = !1, _this.challenges[n].started = !0
            }), parseInt(challengeIndex) === this.challenges.length ? (this.challenges[challengeIndex - 1].active = !1, this.courseCompleted = !0) : (this.challenges[challengeIndex].active = !0, this.challenges[challengeIndex].started = !0)
        },
        activate: function(challenge) {
            return this.activeChallenge() == challenge || (this.deactivateAll(), void(challenge && !challenge.active && (challenge.active = !0, challenge.started = !0)))
        },
        deactivateAll: function() {
            _.each(this.challenges, function(challenge) {
                challenge.active = !1
            })
        },
        activeChallenge: function() {
            return _.find(this.challenges, {
                active: !0
            })
        }
    };
    return state
}]), angular.module("javascriptcom").factory("jsCourseState", ["_", function(_) {
    return {
        state: {},
        update: function(newState) {
            this.state = _.merge(this.state, newState)
        }
    }
}]), angular.module("javascriptcom").factory("jsSuccessCloud", ["jsChallengeProgress", function(jsChallengeProgress) {
    return {
        trigger: function() {
            for (var delay, scale, xOffset, zIndex, iconMarkup = "", i = 0; i < 12; i++) xOffset = _.random(18, 82), scale = _.random(.5, 1.4), zIndex = scale < 1 ? -1 : 1, delay = _.random(0, .5), iconMarkup += "<div class='sb-message-icon' style='left: " + xOffset + "vw; transform: scale(" + scale + "); z-index: " + zIndex + "'><div class='sb-message-icon-item has-handle tci' style='animation-delay: " + delay + "s'><svg width='70' height='70' class='sb-handle sb-icon'><use xlink:href='#icon-check'></use></svg></div></div>";
            jQuery("body").append("<div class='sb-message js-message'><p class='sb-message-text'>Success!</p>" + iconMarkup + "</div>"), setTimeout(function() {
                jQuery(".js-message").remove()
            }, 2e3)
        }
    }
}]), angular.module("javascriptcom").factory("Abecedary", ["$window", function($window) {
    return $window.Abecedary
}]), angular.module("javascriptcom").factory("CSConsole", ["$window", function($window) {
    return $window.CSConsole
}]), angular.module("javascriptcom").factory("$", ["$window", function($window) {
    return $window.$
}]), angular.module("javascriptcom").factory("_", ["$window", function($window) {
    return $window._
}]), angular.module("javascriptcom").factory("marked", ["$window", function($window) {
    return $window.marked
}]), angular.module("javascriptcom").factory("jsJavaScriptCommand", ["$", "$q", "jsExecutor", "jsCourseState", "jsCommandReport", function($, $q, jsExecutor, jsCourseState, jsCommandReport) {
    function generateResponse(content, className) {
        return {
            content: jQuery("<div class='sb-console-msg " + (className ? "sb-console-msg--" + className : "") + "'>" + content + "</div>")[0]
        }
    }

    function runJavaScriptCommand(challenge, line) {
        function onComplete(results) {
            var response = [],
                result = new jsCommandReport(challenge, results),
                output = result.output();
            jsCourseState.update(result.state()), response.push(generateResponse(output)), result.isSuccess() ? (jsExecutor.off("complete", onComplete), deferred.resolve(response)) : (response.push(generateResponse(result.failureMessage(), "error")), deferred.reject(response))
        }
        var deferred = $q.defer();
        jsExecutor.on("complete", onComplete), noTest = "      var js = require('/courses/helper/index.js');       describe('no tests', function() {         var message;        before(function() {           try { message = js.evaluate(code); } catch(e) {};         });         details(function() {           return { output: message }         });       });     ";
        var run = challenge ? challenge.tests : noTest;
        return jsExecutor.run(line, run), deferred.promise
    }
    return runJavaScriptCommand
}]);