(function(angular){
    'use strict';

    var module = angular.module('rcCookies', []);


    module.directive('rcCookie', [
        '$injector',
        '$log',
        '$parse',
        function ($injector, $log, $parse) {
            return {
                restrict: "A",
                require: ['?^form'],
                link: function (scope, elem, attrs, Ctrl) {

                    var cookie_name = attrs.rcCookie;
                    var cookie_days = attrs.rcCookieDays || 7;
                    var cookie_val = null;

                    /**
                     * Set the controllers for form
                     */
                    var formCtrl = Ctrl[0];

                    //Use the current scope.
                    //Only if attribute is set
                    if (cookie_name && formCtrl) {

                        var $cookies;

                        //Inject cookies
                        if ($injector.has('$cookies')) {
                            $cookies = $injector.get('$cookies');

                            try {
                                cookie_val = $cookies.getObject(cookie_name);
                            }
                            catch (e) {
                                cookie_val = $cookies.get(cookie_name);
                            }

                            if(!cookie_val) {
                                cookie_val = null;
                            }
                        }


                        /**
                         * Set the model change from object.
                         *
                         * @param value
                         */
                        var initForm = function (value) {

                            //Get fields form
                            var fields = scope.$eval(attrs.rcCookieFields);

                            if (angular.isObject(value) && angular.isObject(fields)) {
                                angular.extend(fields, value);
                            }
                            else {
                                fields = value;
                            }

                            var getter = $parse(attrs.rcCookieFields);
                            var setter = getter.assign;
                            setter(scope, fields);
                        };


                        /**
                         * Save Cookie
                         *
                         * @param name
                         * @param obj
                         */
                        var saveCookie = function (name, obj, days) {

                            if (!$cookies || !angular.isObject(obj) || !angular.isString(name) || !name.length || days <= 0) {
                                return false;
                            }

                            $cookies.remove(name);

                            var exipre_options;
                            var date = new Date();
                            date.setTime(date.getTime()+( days * (24 * 60 * 60 * 1000) ));
                            exipre_options = {
                                expires: date.toGMTString(),
                                path: '/'
                            };

                            $cookies.putObject(name, obj, exipre_options);
                        };


                        /**
                         * Event Submit Form
                         */
                        elem.on('submit', function() {

                            var fields = scope.$eval(attrs.rcCookieFields);
                            var form_name = attrs.name;
                            var form = scope.$eval(form_name);

                            if (fields && (!form || form.$valid)) {
                                saveCookie(cookie_name, fields, cookie_days);
                            }
                        });

                        //Init Form
                        initForm(cookie_val);
                    }
                }

            };
        }
    ]);


    module.filter('getCookie', ['$injector', function($injector) {

        return function( name ) {

            var cookie = null;

            //Inject cookies
            if (angular.isString(name) && name.length && $injector.has('$cookies')) {
                var $cookies = $injector.get('$cookies');


                try {
                    cookie = $cookies.getObject(name);
                }
                catch (e) {
                    cookie = $cookies.get(name);
                }

                if (!cookie) {
                    cookie = null;
                }
            }

            return cookie;
        };
    }]);


    module.filter('setCookie', ['$injector', '$filter', '$log', function($injector, $filter, $log) {

        return function( value, name, days, options ) {

            days = angular.isUndefined(days) ? 0 : parseInt(days, 10);
            options = angular.isObject(options) ? options : {};

            //Inject cookies
            if ( angular.isString(name) && name.length && $injector.has('$cookies') ) {

                var $cookies = $injector.get('$cookies');

                var exipre_options;
                var date = new Date();
                date.setTime(date.getTime()+( days * (24 * 60 * 60 * 1000) ));
                exipre_options = {
                    expires: date.toGMTString(),
                    path: '/'
                };

                angular.extend(options, exipre_options);

                $cookies.remove(name, options);

                if (days) {
                    if ( angular.isObject(value) ) {
                        $cookies.putObject(name, value, options);
                    }
                    else {
                        $cookies.put(name, value, options);
                    }
                }

                var cookie_value = $filter('getCookie')(name);

                if (!cookie_value) {
                    return value;
                }

                return cookie_value;
            }

            return null;
        };
    }]);

})(window.angular);
