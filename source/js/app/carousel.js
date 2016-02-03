// Dependencies: flickity.pkgd.js, foundation.util.touch.js

;(function($) {
    // "use strict";

    $.fn.multiCarousel = function(options, args) {
            this.each(function(){
            	var $this = $(this);
            	var $mask = $this.find('.carousel-wrap');
            	var $prev = $this.find('.button--previous');
            	var $next = $this.find('.button--next');
            	var tempID = 'multiCarousel-' + Foundation.GetYoDigits(6);
            	var overrideOptions = {
            		prevNextButtons: false,
            		pageDots: false,
            		sync: '.'+tempID
            	};
            	var newOptions = $.extend({}, options, overrideOptions);
            	// $this.addTouch();


            	$this.find('.carousel-row').each(function(){
            		var $row = $(this);
            		var flkty = new Flickity($(this)[0], newOptions);

            		$row.addClass(tempID);
				
				    // $mask.bind('swiperight', function(e) {
				    //   console.log(e, 'left');
				    //   e.stopPropagation();
				    //   // flkty.previous();
				    // });

				    // $mask.bind('swipeleft', function(e) {
				    //   console.log(e, 'right');
				    //   // flkty.next();
				    // });
				    


				    // $mask.bind('touchmove', function(e) {
				    // 	console.log('mousemove', e);
				    // })
				    $prev.on('click', function() {
				    	console.log('prev');
				      flkty.previous();
				    });

				    $next.on('click', function() {
				    	console.log('next');
				      flkty.next();
				    });

				    // $row.on('dragMove', function(e,p,v){
				    // 	console.log('dragMove', e,p,v);
				    // })

            	});

        	 });
        };
})(jQuery);