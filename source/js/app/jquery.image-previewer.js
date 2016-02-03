// Dependencies: JQUERY; Foundation 6 (for ease)


;(function($) {
	'use strict';
	var namespaceCSS = 'image-previewer';
	var namespaceJS = 'imagePreviewer';

	$.fn[namespaceJS] = function(Options) {
			var defaults = {
				  targetViewer: 'figure'
				, targetImage: 'img'
				, targetCaption: 'figcaption'
				, autoSize: true  
			};
			
			this.each(function(){
				var el = this;
				var $this = $(this);
				var dataOptions = $this.data('options') || {};
				dataOptions.targetViewer = $this.data(namespaceCSS) || dataOptions.targetViewer;

				var options = $.extend({}, defaults, Options, dataOptions);

				el._getViewerBox = function(){
					var $viewer = $(options.targetViewer).first();
					var box = { width: 0, height: 0 };
					if ($viewer.length < 1) {
						return '';
					}
					box.width = $viewer.data(namespaceCSS + '-width') || 0;
					box.height = $viewer.data(namespaceCSS + '-height') || 0;
					return box;
				};

				el._getImageURL = function(makeResponsive){
					// will return a 1px transparent gif if undefined.
					makeResponsive = makeResponsive || false;
					var box = el._getViewerBox();
					return ($this.data('url') === undefined ? 'data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==' : ($this.data('url') + (makeResponsive ? '?' + (options.autoSize ? 'wid=' + box.width + '&hei=' + box.height : '') + (el._isCrop() ? '&fit=crop' : '') : '')));
				};

				el._getCaption = function(){
					return $this.data('caption');
				};


				el._isCrop = function(){
					var $viewer = $(options.targetViewer).first();
					var isCrop = $viewer.data(namespaceCSS + '-crop') || true;
					isCrop = !(/^(false|0)$/i).test(isCrop) && !!isCrop;

					return isCrop;

				};


				$this.on('click.' + namespaceJS, function(e){
					if ($this.hasClass('active')) { return; }

					var $targetViewer = $(options.targetViewer).first();  /* There should only be one ;) */
					if ($targetViewer.length < 1) {
						console.warn('No viewer available for preview!');
						return;
					}
					var $targetImage = $targetViewer.find(options.targetImage); 
					if ($targetImage.length < 1) {
						console.warn('Incomplete Viewer>> Injecting image.');
						$targetViewer.prepend('<img >');
						$targetImage = $targetViewer.find(options.targetImage);
					}
					var $targetCaption = $targetViewer.find(options.targetCaption);
					if ($targetCaption.length < 1) {
						// console.warn('Incomplete Viewer>> Injecting Caption.');
						
						$targetCaption = $('<figcaption></figcaption>');
						// JY: Decided not to inject the caption when missing. If requirements change then swap previous line with following line.
						// $targetCaption = $('<figcaption></figcaption>').insertAfter($targetImage);

						if ($targetCaption.find('span.caption').length > 0) {
							$targetCaption = $targetCaption.find('span.caption');
						}
					}

					e.preventDefault();
					
					$targetImage.each(function(){
						var $_targetImage = $(this);
						// Check to see if this is a responsive image
						if ($_targetImage.is('[data-interchange]')) {
							// $_targetImage.foundation('replace', [el._getImageURL()]);	// Not Good Enough - images reset to the breakpoint alternates on resize
							var isFallback = false;
							var rules = [];

							try {
								rules = $_targetImage.data('zfPlugin').rules;

								if (!rules.length) { throw 'No usable breakpoints.'; }

								for (var i = rules.length - 1; i >= 0; i--) {
									var path = rules[i].path;
									var ndx = path.indexOf('?');
									if (path.toLowerCase().indexOf('scene7') && ndx) {
										rules[i].path = el._getImageURL() + path.substring(ndx);
									}
									else {
										rules[i].path = el._getImageURL();
									}
								}
							}
							catch(e) {
								console.warn('Problem supporting Foundation.Interchange:', e);
								isFallback = true;
							}

							if (isFallback) {
								// There was a problem supporting interchange. Falling back to legacy source swapping.
								$targetImage.attr('src', el._getImageURL(true));
							}
						}
						else {
							// This is not a responsive image.
							$targetImage.attr('src', el._getImageURL(true));
						}
					});


					$targetImage.attr('alt', el._getCaption());
					$targetCaption.text(el._getCaption());

					$('[data-' + namespaceCSS + '="' + options.targetViewer +'"]').removeClass('active');
					$this.addClass('active');

				});
			});
		};
})(jQuery);