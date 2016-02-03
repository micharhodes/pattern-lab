// Dependencies: JQUERY; Foundation 6 (for ease)


;(function($) {
	'use strict';
	var namespaceCSS = 'multi-toggle';
	var namespaceJS = 'multiToggle';

	$.fn.multiToggle = function(Options) {
			var defaults = {
				  toggleClass: namespaceCSS + '--toggled'
				, toggleSelector: 'h1,h2,h3,h4'
				, toggleGroup: ''
				, togglerClass: namespaceCSS + '__toggler'
				, panelClass: namespaceCSS + '__panel'
				, multiOpen: true
			};
			
			this.each(function(){
				var $this = $(this);
				var dataOptions = $this.data('options');

				dataOptions.toggleGroup = $this.data(namespaceCSS) || dataOptions.toggleGroup;

				var options = $.extend({}, defaults, Options, dataOptions);
				var groupID = options.toggleGroup + '-' + Foundation.GetYoDigits(6);

				var $toggleGroup = $this.find('[data-' + namespaceCSS + '-group="' + options.toggleGroup + '"]');

				$toggleGroup.addClass(groupID);
				$toggleGroup.each(function(){
					var $group = $(this);
					var $groupItem = $group.find($group.data(namespaceCSS + '-item') || options.toggleSelector).first();
					var $groupToggler = $('<div class="' + options.togglerClass +'"></div>').append($groupItem.clone());
					var $groupPanel = $('<div class="' + options.panelClass + '"></div');

					$group.children().wrap($groupPanel);
					$groupItem.hide();
					$group.prepend($groupToggler);
					// $group.on('click.multiToggle', options.toggleSelector, function(e){
					$groupToggler.on('click.' + namespaceJS, function(e){
						var isOpen = $group.hasClass(options.toggleClass);
						if(isOpen) {
							$group.removeClass(options.toggleClass);
							isOpen = false;
						}
						else {
							if(!options.multiOpen) {
								$toggleGroup.removeClass(options.toggleClass);
							}
							$group.addClass(options.toggleClass);
							isOpen = true;
						}
					});
				});


			 });
		};
})(jQuery);