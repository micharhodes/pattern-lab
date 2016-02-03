/*global jQuery */
/*!
 * debounce.js 1.0
 *
 * Copyright 2014, Ruben Vreeken https://github.com/rayraz
 * ----------------------------------------------------------------------------
 * "THE BEER-WARE LICENSE" (Revision 43):
 * <Ruben Vreeken> wrote this file. As long as you retain this notice you
 * can do whatever you want with this stuff. If we meet some day, and you think
 * this stuff is worth it, you can buy me a beer in return
 * ----------------------------------------------------------------------------
 *
 * Straight-up copy out of Undescore.js
 * So if you're gunna buy beer, buy one for Jeremy Ashkenas & Frends too pls ;-)
 *
 * Date: Wo May 06 13:37:00 2014 +0200
 * Usage:
 *     var lazyLayout = $.debounce(calculateLayout, 300);
 *     $(window).resize(lazyLayout);
 */

(function($) {

	$.debounce = function(func, wait, immediate) {
		var timeout, args, context, timestamp, result;

		var later = function() {
			var last = new Date().getTime() - timestamp;
			if (last < wait) {
				timeout = setTimeout(later, wait - last);
			} else {
				timeout = null;
				if (!immediate) {
					result = func.apply(context, args);
					context = args = null;
				}
			}
		};

		return function() {
			context = this;
			args = arguments;
			timestamp = new Date().getTime();
			var callNow = immediate && !timeout;
			if (!timeout) {
				timeout = setTimeout(later, wait);
			}
			if (callNow) {
				result = func.apply(context, args);
				context = args = null;
			}

			return result;
		};
	};

})(jQuery);