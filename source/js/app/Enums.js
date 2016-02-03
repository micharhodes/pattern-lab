/*global window:true, $dJ:true, $:true */
/**
 * @namespace nflpbo.Enums
 * @augments nflpbo
 * @description A collection of enums and helper methods.
 * @memberof nflpbo
 */
$dJ.NS('nflpbo').Enums = {
	/**
	 * @property {object} Breakpoint Collection of breakpoints
	 * @memberOf nflpbo.Enums
	 */
	Breakpoints: {
		xs: 0,
		s: 1,
		m: 2,
		l: 3,
		xl: 4
	},
	/**
	 * @property {object} BreakpointBounds Collection of breakpoint bounds
	 * @memberOf nflpbo.Enums
	 */
	BreakpointBounds: {
		xsMin: 0,
		xsMax: 479,
		sMin: 480,
		sMax: 629,
		mMin: 630,
		mMax: 767,
		lMin: 768,
		lMax: 959,
		xlMin: 960
	},
	/**
	 * @function nflpbo.Enums.getBreakpoint
	 * @description Returns the enum for the current breakpoint
	 * @memberOf nflpbo.Enums
	 * @returns {number}
	 */
	getBreakpoint: function () {
		var windowWidth = $(window).width(),
			bounds = nflpbo.Enums.BreakpointBounds,
			between = function (a, b, c) {
				return (parseInt(a, 10) >= parseInt(b, 10) && parseInt(a, 10) <= parseInt(c, 10) ? true : false);
			};

		// Parse the breakpoints
		if (between(windowWidth, bounds.xsMin, bounds.xsMax)) {
			$dJ.Debug('[nflpbo.Enums.getBreakpoint] current breakpoint is xs.');
			return 0;
		} else if (between(windowWidth, bounds.sMin, bounds.sMax)) {
			$dJ.Debug('[nflpbo.Enums.getBreakpoint] current breakpoint is s.');
			return 1;
		} else if (between(windowWidth, bounds.mMin, bounds.mMax)) {
			$dJ.Debug('[nflpbo.Enums.getBreakpoint] current breakpoint is m.');
			return 2;
		} else if (between(windowWidth, bounds.lMin, bounds.lMax)) {
			$dJ.Debug('[nflpbo.Enums.getBreakpoint] current breakpoint is l.');
			return 3;
		} else {
			$dJ.Debug('[nflpbo.Enums.getBreakpoint] current breakpoint is xl.');
			return 4;
		}
	}
};