$dJ.NS('nflpbo.Comp').ActiveToggle = $dJ.Comp.Base.extend(function () {
	"use strict";

	return {
		$el: null,
        $activeToggleSection: null,
		$activeTrigger: null,
        $independentTrigger: null,
        $independentSections: null,
        allowNone: true,

		init: function (cfg) {
			var _this = this,
				DBG = $dJ.Debug;

			// Call superclass to call shared init and config
			this._super(cfg);

			// Validate the el parameter
			DBG('[nflpbo.Comp.ActiveToggle.init] typeof $el:', typeof _this.$el);
			if (typeof _this.$el === 'object' && _this.$el !== null && _this.$el !== 'undefined') {
                //attach extra processing for navigation menu on tablet
                //this is done on first call to prevent visible content repositioning (it looks ugly)
                _this.processTabletNavigation();
                //also attach to window resize (so we can remove any positioning styles)
                var tabletNavigationDebounce = $dJ.Functions.debounce(function () {
                    _this.processTabletNavigation();
                }, 250);
                $(window).on('resize', tabletNavigationDebounce);

                _this.$activeTrigger.each(function () {
                    if ($(this).parents('[data-activetoggle]').first()[0] != _this.$el[0]) {
                        _this.$activeTrigger = _this.$activeTrigger.not($(this));
                    }
                });
                
                _this.$independentTrigger.each(function () {
                    if ($(this).parents('[data-activetoggle]').first()[0] != _this.$el[0]) {
                        _this.$independentTrigger = _this.$independentTrigger.not($(this));
                    }
                });
                
                _this.$activeToggleSection.each(function () {
                    if ($(this).parents('[data-activetoggle]').first()[0] != _this.$el[0]) {
                        _this.$activeToggleSection = _this.$activeToggleSection.not($(this));
                    }
                });
                
                _this.$independentSections.each(function () {
                    if ($(this).parents('[data-activetoggle]').first()[0] != _this.$el[0] && $(this).first()[0] != _this.$el[0]) {
                        _this.$independentSections = _this.$independentSections.not($(this));
                    }
                });
                    
                _this.$activeTrigger.click(function(e) {
                    e.preventDefault();
                    
                    var index = _this.$activeTrigger.index(this);
                    if (_this.allowNone === false) {
                        _this.$activeTrigger.removeClass('active');
                        $(this).toggleClass('active');
                    }
                    _this.$activeToggleSection.not(':eq(' + index + ')').removeClass('active');
                    if (_this.allowNone || _this.allowNone == undefined) {
                        _this.$activeToggleSection.eq(index).toggleClass('active');
                    } else {
                        var $activeSection = _this.$activeToggleSection.eq(index);
                        $activeSection.addClass('active');
                        //check if we need to match the height for any elements
                        var $heightMatchingElements = $activeSection.find('[data-heightMatch]');
                        if ($heightMatchingElements.length > 0) {
                            var contentHeightMatcher = new nflpbo.Comp.HeightMatcher({
                                $el: $heightMatchingElements,
                                attachWindowEvents: false //don't attach to resize or load (the main height matcher is already doing this)
                            });
                            contentHeightMatcher.heightMatcher();
                        }
                    }
                });
                
                _this.$independentTrigger.click(function() {
                    var index = _this.$independentTrigger.index(this);
                    _this.$independentSections.eq(index).toggleClass('active');
                    
                    if ($(this).parents('.main-nav').length) {
                        if ($('html').hasClass('mobile-nav-active')) {
                            $('html').delay(500).queue(function () {
                                $(this).toggleClass('mobile-nav-active').dequeue();
                            });
                        } else {
                            $('html').toggleClass('mobile-nav-active');
                        }
                    }
                });
                
                $(document).click(function (e) {
					if (_this.$activeToggleSection.hasClass('active') && _this.allowNone) {
						// Ignore element/child clicks
                        /*
						if (!_this.$activeToggleSection.is(e.target) && _this.$activeToggleSection.has(e.target).length === 0) {
                            if (!_this.$independentSections || (!_this.$independentSections.is(e.target) && _this.$independentSections.has(e.target).length === 0)) {
				                _this.$activeToggleSection.removeClass('active');
                            }
						}
                        */
                        var $activeSection = _this.$activeToggleSection.filter('.active');
                        if ($activeSection.length === 1 && !$(e.target).closest($activeSection).length) {
                            $activeSection.removeClass('active');
                        }
					}
				});
			}
		},
        /**
         * @function processTabletNavigation
         * @description preforms additional processing for navigation sub menu, for tablets
         */
        processTabletNavigation: function () {
            var _this = this;            
            if($dJ.ViewPort.isTablet() === true) {
                _this.$activeToggleSection.each(function () {
                    var menuPanelPositionLeft = -30; //from css
                    var menuPanelWidth = 672; //again from css (panels are hidden and we don't get the correct width)
                    var $toggleSection = $(this);
                    if ($toggleSection.data('subnav') === true) {
                        var $menuPanel = $toggleSection.find('[data-subnavcontainer]');
                        if($menuPanel.length === 1) {
                            //reset the positioning
                            $menuPanel.css({
                                'left': ''
                            });
                            var parentOffsetLeft = $toggleSection.offset().left;
                            var menuOffsetLeft = parentOffsetLeft - menuPanelPositionLeft;
                            var menuOffsetRight = menuOffsetLeft + menuPanelWidth;
                            //check if we are outside of the viewport on the left
                            if (menuOffsetLeft < 0) {
                                $menuPanel.css({
                                    'left': 0
                                });
                            } else {
                                //check if we are outside of the viewport on the right
                                var viewportWidth = $dJ.ViewPort.width();
                                if(menuOffsetRight > viewportWidth) {
                                    var widthDiff = menuOffsetRight - viewportWidth;
                                    $menuPanel.css({
                                        'left': (menuPanelPositionLeft - widthDiff)
                                    });
                                }
                            }
                        }
                    }                
                });
            } else {
                //remove any applied styles
                _this.$activeToggleSection.each(function () {
                    var $toggleSection = $(this);
                    if ($toggleSection.data('subnav') === true) {
                        var $menuPanel = $toggleSection.find('[data-subnavcontainer]');
                        if($menuPanel.length === 1) {
                            $menuPanel.css({
                                'left': ''
                            });
                        }
                    }
                });
            }
        }
	};
}());