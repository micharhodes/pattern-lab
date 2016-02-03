/*global $:true, $dJ:true */
/**
 * @namespace $dJ
 * @version 0.0.1
 * @description <p>Avoid having too many plugins, polyfills, helpers and such like every new project.</p>
 <p>Keep your code clean and do things in a structured way.</p>
 <p>Force type safety throughout your code to avoid things exploding spectacularly.</p>
 * @requires jQuery
 * @type {object}
 */
(function (w) {
	"use strict";

	// Only initialize if we haven't already to avoid conflicts
	if (w && !w.$dJ) {
		w.$dJ = {
			/**
			 * @property {string} Version Current version number
			 * @memberof $dJ
			 */
			Version: '0.0.1',
			/**
			 * @function $dJ.Debug
			 * @description <p>Writes error messages to the console if debug is enabled and console exists.</p>
			 <p>Declare <em>$dJDebug = true;</em> at any time to enable it.<br />
			 <p>Declare <em>$dJDebug = false;</em> to disable it again.</p>
			 <p>Recommended logging format:</p>
			 <p><em>$dJ.Debug('[Namespace.Class.methodName] describe what you are logging:', objectReference);</em></p>
			 <p>This will allow you to filter the console logs to see only items you care about.</p>
			 <p>The object reference will be interactive in the log, helpful for browsing complex objects.</p>
			 * @memberof $dJ
			 * @returns {void}
			 */
			Debug: function () {
				var args = arguments;

				if (typeof console === "undefined"){
				    console = {};
				    console.log = function () {
				        return;
				    }
				}

				if($('html').hasClass('ie8')){
					console = false;
				}

				// Check the query string
				if (document.location.href.indexOf('djdebug=true') > -1) {
					w.$dJDebug = true;
				}
				// Only log if there is a console object and we're enabled
				if (console && w.$dJDebug === true) {

					switch (args.length) {
						case 1:
							console.log(args[0]);
							break;
						case 2:
							console.log(args[0], args[1]);
							break;
						default:
							break;
					}
				}
			},
			/**
			 * @function $dJ.NS
			 * @description <p>Generate a namespace tree from a dot-notated string, for example:</p>
			 <p><em>$dJ.NS('MySite.MyNamespace').MyClass = $dJ.Comp.Base.extend({ ... });</em></p>
			 <p>You can then access MySite.MyNamespace.MyClass directly in future JavaScript.</p>
			 * @memberof $dJ
			 * @param {string} tree Dot-notated tree to create
			 * @returns {object}
			 */
			NS: function (tree) {
				var _this = this,
					branches = tree.split('.'),
					lastObj = w,
					branch = null,
					i = 0;

				// Traverse the tree
				for (i = 0; i < branches.length; i = i + 1) {
					// Current branch
					branch = branches[i];

					// Validate branch exists and is a Namespace instance
					if (typeof lastObj[branch] !== 'undefined') {
						if (typeof lastObj[branch] !== 'object') {
							_this.Debug('[$dJ.NS] non-object exists:', branch);
							throw new Error();
						}
						// Assign
						lastObj = lastObj[branch];
						// Continue
						continue;
					}
					// Create new Namespace instance
					lastObj[branch] = {};
					// Assign
					lastObj = lastObj[branch];
				}
				// Return reference
				return lastObj;
			},
			/**
			 * @namespace $dJ.Arrays
			 * @description Helpers for array objects.
			 * @memberof $dJ
			 */
			Arrays: {
				/**
				 * @function $dJ.Arrays.isArray
				 * @description Is the object an array?
				 * @memberof $dJ.Arrays
				 * @param {object} arr Object to check
				 * @returns {boolean}
				 */
				isArray: function (arr) {
					// Prefer the native method where available
					if (Array.isArray) {
						return Array.isArray(arr);
					} else {
						return Object.prototype.toString.call(arr) === '[object Array]';
					}
				}
			},
			/**
			 * @namespace $dJ.Booleans
			 * @description Helpers for boolean objects.
			 * @memberof $dJ
			 */
			Booleans: {
				/**
				 * @function $dJ.Booleans.isBoolean
				 * @description Is the object a boolean?
				 * @memberof $dJ.Booleans
				 * @param {object} bool Object to check
				 * @returns {boolean}
				 */
				isBoolean: function (bool) {
					return typeof bool === 'boolean';
				},
			},
			/**
			 * @namespace $dJ.Functions
			 * @description Helpers for function objects.
			 * @memberof $dJ
			 */
			Functions: {
				/**
				 * @function $dJ.Functions.createScopedFunction
				 * @description <p>Returns a function with the correct scope to be called dynamically.</p>
				 <p>Ideal uses: setTimeout/setInterval, bound events.</p>
				 * @memberof $dJ.Functions
				 * @param {function} fn Function to call
				 * @param {object} scope Scope for function execution
				 * @param {array} args Arguments to pass to function
				 * @returns {function}
				 */
				createScopedFunction: function (fn, scope, args) {
					return function() {
						fn.apply(scope, args);
					};
				},
				/**
				 * @function $dJ.Functions.isFunction
				 * @description Is the object a function?
				 * @memberof $dJ.Functions
				 * @param {object} fn Object to check
				 * @returns {boolean}
				 */
				isFunction: function (fn) {
					return typeof fn === 'function';
				},

				/**
				 * @function $dJ.Functions.debounce
				 * @description returns a function that will only be called after a specific time interval (used in window resize)
				 * @memberof $dJ.Functions
				 * @param {function} func - function to execute
				 * @param {number} wait - interval in ms
				 * @param {boolean} immediate - set to true if you want to start execute the function once at start
				 * @returns {function}
				 */
				debounce: function (func, wait, immediate) {
					var timeout;
					return function() {
						var context = this, args = arguments;
						var later = function() {
							timeout = null;
							if (!immediate) func.apply(context, args);
						};
						var callNow = immediate && !timeout;
						clearTimeout(timeout);
						timeout = setTimeout(later, wait);
						if (callNow) func.apply(context, args);
					};
				}
			},
			/**
			 * @namespace $dJ.Numbers
			 * @description Helpers for number objects.
			 * @memberof $dJ
			 */
			Numbers: {
				/**
				 * @function $dJ.Numbers.isNumber
				 * @description Is the object a number?
				 * @memberof $dJ.Numbers
				 * @param {object} num Object to check
				 * @param {boolean} parsenum Should we try to parse the object?
				 * @returns {boolean}
				 */
				isNumber: function (num, parsenum) {
					if (parsenum !== true) {
						return typeof num === 'number';
					} else {
						return !isNaN(parseInt(num, 10));
					}
				},
				/**
				 * @function $dJ.Numbers.validNumber
				 * @description Validates a number or returns a default.
				 * @memberof $dJ.Numbers
				 * @param {object} num Object to check
				 * @param {number} retval Default value to fall back to
				 * @returns {number}
				 */
				validNumber: function (num, retval) {
					// Type check for speed
					if (w.$dJ.Numbers.isNumber(num)) {
						return num;
					} else if (isNaN(parseInt(num, 10)) === false) {
						return parseInt(num, 10);
					} else if (w.$dJ.Numbers.isNumber(retval)) {
						return retval;
					} else if (isNaN(parseInt(retval, 10)) === false) {
						return parseInt(retval, 10);
					} else {
						return 0;
					}
				}
			},
			/**
			 * @namespace $dJ.Strings
			 * @description Helpers for string objects
			 * @memberof $dJ
			 */
			Strings: {
				/**
				 * @function $dJ.Strings.isString
				 * @description Is the object a string?
				 * @memberof $dJ.Strings
				 * @param {object} str Object to check
				 * @param {boolean} parsestr Should we try to parse the object?
				 * @returns {boolean}
				 */
				isString: function (str, parsestr) {
					if (parsestr !== true) {
						return typeof str === 'string';
					} else {
						try {
							var newstr = str.toString();
							return typeof newstr === 'string';
						} catch(e) {
							return false;
						}
					}
				},
				/**
				 * @function $dJ.Strings.trim
				 * @description Trims the string, or returns an empty string if you passed invalid data.
				 * @memberof $dJ.Strings
				 * @param {object} str Object to check and trim
				 * @returns {string}
				 */
				trim: function (str) {
					// Only attempt to trim a valid string
					if (w.$dJ.Strings.isString(str)) {
						try {
							return str.trim();
						} catch (e) {
							return str.replace(/^\s+|\s+$/g, '');
						}
					} else {
						return '';
					}
				},
				/**
				 * @function $dJ.Strings.validString
				 * @description Validates a string or returns a default.
				 * @memberof $dJ.Strings
				 * @param {object} str Object to check
				 * @param {string} retval Default value to fall back to
				 * @returns {string}
				 */
				validString: function (str, retval) {
					// Type check for speed
					if (w.$dJ.Strings.isString(str)) {
						return str;
					} else if (w.$dJ.Strings.isString(retval)) {
						return retval;
					} else {
						return '';
					}
				 },
				 /**
				 * @function $dJ.Strings.addLeadingChars
				 * @description Adds leading charaters until a value reaches a desired length
				 * @memberof $dJ.Strings
				 * @param {string} val - the value that needs to be padded
				 * @param {number} desiredLength - the desired length
				 * @returns {string}
				 */
				 addLeadingZeros: function (val, desiredLength) {
				 	var workVal = val + '';
				 	if(workVal !== '' && workVal.length < desiredLength) {
				 		while (workVal.length < desiredLength) {
				 			workVal = '0' + workVal;
				 		}
				 	}
				 	return workVal;
				 },
				 /**
				 * @function $dJ.Strings.escapeSelector
				 * @description Escapes a specific string, so we can use id as a selector
				 * @memberof $dJ.Strings
				 * @param {object} str string to escape
				 * @returns {string}
				 */
				escapeSelector: function (str) {
					// Only attempt to escape a valid string
					if (w.$dJ.Strings.isString(str)) {
						return str.replace(/[!"#$%&'()*+,.\/:;<=>?@[\\\]^`{|}~]/g, "\\$&");
					} else {
						return '';
					}
				}
			 },
			 /**
			 * @namespace $dJ.URL
			 * @description Helpers for working with URLs
			 * @memberof $dJ
			 */
			 URL: {
			 	/**
				 * @function $dJ.URL.getQueryParameterValue
				 * @description Gets a query parameter's value
				 * @memberof $dJ.URL
				 * @param {string} key - parameter's key				 
				 * @returns {string} - empty string if the key is not found
				 */
			 	getQueryParameterValue: function (key) {
				    var parameters = new RegExp('[\?&]' + key + '=([^&#]*)').exec(window.location.href);
				    if (parameters == null) {
				        return '';
				    } else {
				        return parameters[1] || '';
				    }
				},
				/**
				 * @function $dJ.URL.redirectToUrl
				 * @description Redirects to a specific URL (using window.location.href)
				 * @memberof $dJ.URL
				 * @param {string} redirectUrl - the URL to redirect to
				 */
				redirectToUrl: function (redirectUrl) {
					if (redirectUrl !== '') {
						window.location.href = redirectUrl;
					}
				},
				/**
				 * @function $dJ.URL.getPageUrlWithoutQuerystring
				 * @description Gets the current page URL without the querystring
				 * @memberof $dJ.URL
				 * @return {string} page URL
				 */
				getPageUrlWithoutQuerystring: function () {
					var url = '',
						queryIndex = window.location.href.indexOf('?');
					if(queryIndex > 0) {
						url = window.location.href.substr(0, queryIndex);
					} else {
						url = window.location.href;
					}
					return url;
				},
				/**
				 * @function $dJ.URL.openUrlInNewWindow
				 * @description Opens a specific URL in a new window / tab
				 * @memberof $dJ.URL
				 * @param {string} url - the URL to opne
				 */
				openUrlInNewWindow: function (url) {
					if (url !== '') {
						window.open(url);
					}
				},
			 },
			/**
			 * @namespace $dJ.ViewPort
			 * @description Helpers for viewport size
			 * @memberof $dJ
			 */
			ViewPort: {
				mobileBreakPoint: 750,
				tabletBreakPoint: 1024,
				/**
				 * @function $dJ.ViewPort.width
				 * @description Gets the current window width
				 * @memberof $dJ.ViewPort
				 */
				width: function () {
					return $(window).width();
				},
				/**
				 * @function $dJ.ViewPort.height
				 * @description Gets the current window height
				 * @memberof $dJ.ViewPort
				 */
				height: function () {
					return $(window).height();
				},
				/**
				 * @function $dJ.ViewPort.isTablet
				 * @description Checks if the current view is tablet
				 * @memberof $dJ.ViewPort
				 */
				isTablet: function () {
					var isTablet = false;
					var viewWidth = $dJ.ViewPort.width();
					if (viewWidth > $dJ.ViewPort.mobileBreakPoint && viewWidth <= $dJ.ViewPort.tabletBreakPoint) {
						isTablet = true;
					}
					return isTablet;
				},
				/**
				 * @function $dJ.ViewPort.isMobile
				 * @description Checks if the current view is mobile
				 * @memberof $dJ.ViewPort
				 */
				isMobile: function () {
					var isMobile = false;
					var viewWidth = $dJ.ViewPort.width();
					if (viewWidth <= $dJ.ViewPort.mobileBreakPoint) {
						isMobile = true;
					}
					return isMobile;
				}
			} 
		};
	}
}(window));

/**
 * @class Class
 * @description John Resig's Class.js, because it is great.
 * @author John Resig
 * @returns {object}
 */
(function () {
	var initializing = false,
		fnTest = /xyz/.test(function() {
			xyz;
		}) ? /\b_super\b/ : /.*/;

	// The base Class implementation (does nothing)
	this.Class = function() {};

	// Create a new Class that inherits from this class
	Class.extend = function (prop) {
		var _super = this.prototype;

		// Instantiate a base class (but only create the instance,
		// don't run the init constructor)
		initializing = true;
		var prototype = new this();
		initializing = false;

		// Copy the properties over onto the new prototype
		for (var name in prop) {
			// Check if we're overwriting an existing function
			prototype[name] = typeof prop[name] == "function" &&
				typeof _super[name] == "function" && fnTest.test(prop[name]) ?
				(function(name, fn) {
					return function() {
						var tmp = this._super;

						// Add a new ._super() method that is the same method
						// but on the super-class
						this._super = _super[name];

						// The method only need to be bound temporarily, so we
						// remove it when we're done executing
						var ret = fn.apply(this, arguments);
						this._super = tmp;

						return ret;
					};
				})(name, prop[name]) :
				prop[name];
		}

		// The dummy class constructor
		function Class() {
			// All construction is actually done in the init method
			if (!initializing && this.init)
				this.init.apply(this, arguments);
		}

		// Populate our constructed prototype object
		Class.prototype = prototype;

		// Enforce the constructor to be what we expect
		Class.prototype.constructor = Class;

		// And make this class extendable
		Class.extend = arguments.callee;

		return Class;
	};
})();

/**
 * @class $dJ.Comp.Base
 * @augments $dJ
 * @description Creates the base component class
 * @memberof $dJ
 * @param {object} cfg Configuration for the instance
 * @returns {object}
 */
$dJ.NS('$dJ.Comp').Base = Class.extend(function () {
	"use strict";

	return {
		/**
		 * @function init
		 * @description The basic initialization method for all components
		 * @memberof $dJ.Comp.Base
		 * @param {object} cfg Configuration object cor the class instance
		 * @returns {void}
		 */
		init: function (cfg) {
			var _this = this;

			// Debug information
			$dJ.Debug('[$dJ.Comp.init] _this:', _this);
			$dJ.Debug('[$dJ.Comp.init] cfg:', cfg);

			// Configure the instance from the cfg object
			if (typeof cfg === 'object' && cfg !== null) {
				_this.config(cfg);
			}
		},
		/**
		 * @function config
		 * @description Configures the current instance from an object
		 * @memberof $dJ.Comp.Base
		 * @param {object} cfg Configuration object to transfer properties from
		 * @returns {void}
		 */
		config: function (cfg) {
			var _this = this,
				i;

			// Traverse the cfg object
			for (i in cfg) {
				// We prefix properties with $ to denote jQuery elements
				// If jQuery is available, force a property to be a jQuery element
				// Else transfer it as is
				if (i.indexOf('$') === 0 && $) {
					_this[i] = $(cfg[i]);
				} else {
					_this[i] = cfg[i];
				}
			}
		}
	};
}());