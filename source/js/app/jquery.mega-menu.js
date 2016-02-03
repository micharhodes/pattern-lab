// Dependencies: JQUERY; Foundation 6 (for ease)


;(function($) {
	'use strict';
	var namespaceCSS = 'mega-menu';
	var namespaceJS = 'megaMenu';

	$.fn[namespaceJS] = function(Options) {
			var defaults = { 
				itemSelector: namespaceCSS + '__menu-item',
				captionSelector: namespaceCSS + '__caption',
				dropdownSelector: namespaceCSS + '__dropdown',
				closeSelector: namespaceCSS + '__close',
				activeClass: namespaceCSS + '--is-open'
			};
			
			this.each(function(){
				// var el = this;
				var $this = $(this);
				var dataOptions = $this.data('options') || {};
				dataOptions.targetViewer = $this.data(namespaceCSS) || dataOptions.targetViewer;

				var options = $.extend({}, defaults, Options, dataOptions);

				var $menuPanels = $this.find('.' + options.dropdownSelector);

				var $menuItems = $this.find('.' + options.itemSelector).add($menuPanels.find('.' + options.itemSelector));


				// $menuItems.each(function(){
					$this.on('click.' + namespaceJS, '.' + options.captionSelector + ', .' + options.closeSelector, function(e){
						var $el = $(e.currentTarget);
						if ($el.data(namespaceCSS)) {
							// $this = $this.closest('[data-mega-menu]');
						}
						var $menuItem = $menuItems.has($el);
						// console.log(e, 'this:', $this, 'items:', $menuItems, 'item:', $menuItem);
						var targetID = $menuItem.data(namespaceCSS);
						$menuItem = $menuItems.filter('[data-' + namespaceCSS + '=' + targetID +']');
						//console.log('targetID', targetID);
						//console.log('mi', $menuItem, '[data-' + namespaceCSS + '=' + targetID +']');
						var $menuDropdown = $menuPanels.filter('#' + targetID);
						e.preventDefault();
						$menuPanels.not($menuDropdown).removeClass(options.activeClass);
						$menuItems.not($menuItem).removeClass(options.activeClass);
						$menuDropdown.toggleClass(options.activeClass);
						$menuItem.toggleClass(options.activeClass);
					});
				// });
			});
		};
	}
)(jQuery);