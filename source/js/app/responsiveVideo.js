/*global $dJ:true */
/**
 * @class nflpbo.Comp.ResponsiveVideo
 * @augments nflpbo
 * @description Switches an Video source or background as the page responds
 * @memberof nflpbo
 * @param {object} cfg Configuration for the instance
 * @returns {object}
 */
$dJ.NS('nflpbo.Comp').ResponsiveVideo = $dJ.Comp.Base.extend(function () {
	"use strict";

	return {
		/**
		 * @property {object} $el jQuery reference to Video element.
		 * @memberof nflpbo.Comp.ResponsiveVideo
		 */
		$el: null,
		/**
		 * @property {string} videolURL Large Video source.
		 * @memberof nflpbo.Comp.ResponsiveVideo
		 */
		videolURL: '',
		/**
		 * @property {string} videomURL Medium Video source.
		 * @memberof nflpbo.Comp.ResponsiveVideo
		 */
		videomURL: '',
		/**
		 * @property {string} videosURL Small Video source.
		 * @memberof nflpbo.Comp.ResponsiveVideo
		 */
		videosURL: '',
		/**
		 * @property {string} currentSrc
		 * @memberof nflpbo.Comp.ResponsiveVideo
		 */
		currentSrc: '',
		/**
		 * @property {object} $play jQuery reference to next element.
		 * @memberof nflpbo.Comp.ResponsiveVideo
		 */
		$playPause: null,
		/**
		 * @function nflpbo.Comp.ResponsiveVideo.init
		 * @description Initializes responsive Video class.
		 * @memberof nflpbo.Comp.ResponsiveVideo
		 * @param {object} cfg Configuration object for this instance
		 * @returns {void}
		 */
		init: function (cfg) {
			var _this = this,
				DBG = $dJ.Debug;

			// Call superclass to call shared init and config
			this._super(cfg);

			// Validate the el parameter
			DBG('[nflpbo.Comp.ResponsiveVideo.init] typeof $el:', typeof _this.$el);
			if (typeof _this.$el === 'object' && _this.$el !== null && _this.$el !== 'undefined') {
				var test = true;
                _this.setVideo();
                // Bind play/pause events
                _this.$playPause = $('.play-pause-button', _this.$el.parent());
                _this.$playPause.click(function() {
                    if (_this.$el.get(0).paused) {
                        _this.$el.get(0).play();
                    } else {
                        _this.$el.get(0).pause();
                    }
                });

                _this.$el.click(function() {
                    if (_this.$el.get(0).paused) {
                        _this.$el.get(0).play();
                        _this.$el.unbind('click');
                        _this.$el.find('.click-zone').click(function() {
                            if (_this.$el.get(0).paused) {
                                _this.$el.get(0).play();
                            } else {
                                _this.$el.get(0).pause();
                            }
                        });
                    }
                });

                _this.$el.bind('play', function() {
                    if (_this.$el.attr('controls') == undefined) {
                        _this.$el.attr('controls', '');
                    }
                    _this.$playPause.addClass('clicked');
                });

                _this.$el.bind('pause', function() {
                    _this.$playPause.removeClass('clicked');
                });
			}
			DBG('[nflpbo.Comp.ResponsiveVideo.init] configured instance:', _this);
		},
		/**
		 * @method nflpbo.Comp.ResponsiveVideo.setVideo
		 * @description Sets the current Video.
		 * @memberof nflpbo.Comp.ResponsiveVideo
		 * @returns {void}
		 */
		setVideo: function () {
			var _this = this,
				DBG = $dJ.Debug,
				breakpoints = nflpbo.Enums.Breakpoints,
				currentBreakpoint = nflpbo.Enums.getBreakpoint(),
				newSrc = '';

			// Determine the new source
			DBG('[nflpbo.Comp.ResponsiveVideo.setVideo] breakpoint:', currentBreakpoint);
			if (currentBreakpoint === breakpoints.xs || currentBreakpoint === breakpoints.s) {
				DBG('[nflpbo.Comp.ResponsiveVideo.setVideo] breakpoint xs-s.');
				newSrc = _this.chooseVideo(_this.videosURL, _this.videomURL, _this.videolURL);
			} else if (currentBreakpoint === breakpoints.m || currentBreakpoint === breakpoints.l) {
				DBG('[nflpbo.Comp.ResponsiveVideo.setVideo] breakpoint m-l.');
				newSrc = _this.chooseVideo(_this.videomURL, _this.videolURL, _this.videosURL);
			} else {
				DBG('[nflpbo.Comp.ResponsiveVideo.setVideo] breakpoint xl or greater.');
				newSrc = _this.chooseVideo(_this.videolURL, _this.videomURL, _this.videosURL);
			}

			// Set the Video
			if (newSrc !== '' && newSrc !== _this.currentSrc) {
				DBG('[nflpbo.Comp.ResponsiveVideo.setVideo] new src:', newSrc);
				// Set current source
				_this.currentSrc = newSrc;

				DBG('[nflpbo.Comp.ResponsiveVideo.setVideo] setting video.');
				_this.$el.attr('src', newSrc);
				_this.$el.html('<source src="' + newSrc + '" type="video/mp4">');
			}
		},
		/**
		 * @method nflpbo.Comp.ResponsiveVideo.chooseVideo
		 * @description Validates videosURL to select the best.
		 * @memberof nflpbo.Comp.ResponsiveVideo
		 * @param {string} best The ideal Video wanted.
		 * @param {string} middle The second best Video wanted.
		 * @param {string} worst The worst Video wanted.
		 * @returns {string}
		 */
		chooseVideo: function (best, middle, worst) {
			var _this = this,
				DBG = $dJ.Debug,
				str = $dJ.Strings.validString;

			// Validate them all as strings
			if (str(best) !== '') {
				DBG('[nflpbo.Comp.ResponsiveVideo.chooseVideo] best Video selected.');
				return best;
			} else if (str(middle) !== '') {
				DBG('[nflpbo.Comp.ResponsiveVideo.chooseVideo] middle Video selected.');
				return middle;
			} else {
				DBG('[nflpbo.Comp.ResponsiveVideo.chooseVideo] worst Video selected.');
				return str(worst);
			}
		}
	};
}());