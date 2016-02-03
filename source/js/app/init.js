(function(w, $){

	$(document).foundation();
	$(document).ready(function(){

		//Navigation toggle
		$('.nav-toggle-menu').click(function(e) {
			e.preventDefault();
			$(this).toggleClass('active');
			$('.nav').toggleClass('active');
		});
		
		//Navigation toggle
		$('.nav-toggle-search').click(function(e) {
			e.preventDefault();
			$(this).toggleClass('active');
			$('.header .search-form').toggleClass('active');
		});

		//Select box interaction
		$('select').on('blur', function(){
		   $(this).next('span').removeClass('select-focus');
		}).on('focus', function(){
		  $(this).next('span').addClass('select-focus');
		});

		//Sticky-Nav Events
		function initStickyNavEvents() {

			var $stickyNav = $('.sticky-nav');

	      	var $toggler = $stickyNav.find('.accordion-wrapper[data-toggler]');
	      	var $toggleCSS = $toggler.data('toggler');

			$stickyNav.on('sticky.zf.stuckto:top', function(){
				if (Foundation.MediaQuery.atLeast('large')) {
				  // True if medium or large
				  // False if small
	        		$toggler.addClass($toggleCSS);
				}
			});
			$stickyNav.on('sticky.zf.unstuckfrom:top', function(){
				if (Foundation.MediaQuery.atLeast('large')) {
				  // True if medium or large
				  // False if small
	          		$toggler.removeClass($toggleCSS);
				}
			});
		}

		
		// Fixing foundation equalizer + interchange bug
		Foundation.onImagesLoaded($('img[data-interchange]:visible'), function(){
			$('[data-equalizer]').each(function(){
				$(this).foundation('_reflow');
			});
		});

		//TODO JY: Move this to separate JS file and make it more oo.
		$('.sticky-tabs .tabs-title a').on ('click', function(e){
			e.preventDefault();
			var tabId = $(this).attr('href');
			$(this).parent('li').addClass('is-active').siblings().removeClass('is-active');
			$('.accordion').foundation('down', $(tabId)); //TODO: this is too greedy
			if ($('.sticky-tabs').hasClass('is-stuck')) {
				$('html, body').animate({scrollTop:$('.sticky-container').position().top}, 'slow');
			} 
		});
		$('.accordion-item a').on('click', function(e){
			e.preventDefault();
        	var accordionId = $(this).attr('href');
        	var tabLink = $('ul.tabs li a[href="'+accordionId+'"]');
        	$(tabLink).parent('li').addClass('is-active').siblings().removeClass('is-active');
        });
		var tabAccordionControl = $.debounce(function(){
			
			if (Foundation.MediaQuery.atLeast('medium')) {
				$('.accordion-tabs .accordion').each(function(){
					var $accTab = $(this);
					if ($accTab.find('.accordion-item.is-active').length === 0) {
						var $target = $accTab.find('.accordion-item:first-of-type a.accordion-title');
						$(this).parent('li');
						$('.sticky-tabs .tabs-title').has('a[href='+$target.attr('href')+']').addClass('is-active').siblings().removeClass('is-active');
						if ($target.length > 0 ) {
							 $accTab.foundation('down', $target);
							 // foundation uses $.slideDown() which leaves the element as inline-block
							 $target.css('display', '');	
						}
					}
				});

			}

		}, 300);

		tabAccordionControl();
		//faceted-filter checkbox function
		// make sure context is within the checkbox group
		$('input[type="checkbox"]').siblings('label').on('click', function(){
			var group = $(this).siblings('input[type="checkbox"]').attr('name');
			var allCheckbox = $(this).siblings('input[id^="all-"]').length != 0;
			if(allCheckbox){
				var allCheckboxChecked = !($(this).siblings('input[type="checkbox"]').is(':checked'));
				$(this).parent('li').siblings().each(function(){
					$(this).find('input[name="'+group+'"]').prop('checked', allCheckboxChecked);
				})
			}
			if(!allCheckbox){
				var checkboxChecked = !($(this).siblings('input[type="checkbox"]').is(':checked'));
				if(checkboxChecked == false){
					$(this).parent('li').siblings().each(function(){
						$(this).find('input[id^="all-"][name="'+group+'"]').prop('checked', false);
					});
				}
				if(checkboxChecked == true){
					var checkboxEachChecked = $(this).parent('li').siblings().find('input[name="'+group+'"]').is(':checked');
					if(checkboxEachChecked){
						$(this).parent('li').siblings().find('input[id^="all-"][name="'+group+'"]').prop('checked', true);
					}
				}
			}
		});
		

		//addthis
	  	var addthis_config = addthis_config || {
			data_track_clickback: true,
			data_track_textcopy: true,
			/*because these are included as full button, don't need them in drop down*/
			/*services_exclude:'facebook,facebook_like,twitter,google_plusone,google_plusone_share',*/
			services_exclude:'',
			data_ga_property: 'UA-1070615-1',
			pubid: 'ra-4fa933f618f88ea2'
		};
		var addthis_share = addthis_share || {};	

		/* It seems that Armstrong uses a variety of social sharing options including home grown solutions. Disabled until proper solution is ironed out. */
		// // $.getScript('http://s7.addthis.com/js/300/addthis_widget.js#username=XXX',
		// $.getScript('//s7.addthis.com/js/300/addthis_widget.js',
		// 	function(){
		// 		addthis.init(); //callback function for script loading
		// 	}
		// ); 

		// target an element (the height setter), find it's height after it's loaded on the page, match the match-height element's height to the target :)
		var matchHeight = $.debounce(function(){
			var $heightSetter = $('.height-setter');
			var $matchHeight = $('.match-height');
			$heightSetter.on('load', function() {
			    $matchHeight.css("height",$heightSetter.innerHeight());
			});
		});
		matchHeight();

		var shapeTable = $.debounce(function(){
			$('table.responsive').shapeTable();
		}, 300);

	    shapeTable();

	    $(window).on('changed.zf.mediaquery', function(event, name) {
		  // name is the name of the breakpoint
		  console.log('MQ', event, name, Foundation.MediaQuery.current);
		});

		$(window).resize(function() {
		    shapeTable();
		    tabAccordionControl();
			matchHeight();

		});

		$('.carousel').flickity({
		  // options
		  cellAlign: 'center',
		  contain: true,
		  /*wrapAround: true,*/
		  freeScroll: true,
		  cellSelector: '.block-carousel-item',
		  percentPosition: false,
		  pageDots: false,

		});

		$('.carousel-multi-rows').multiCarousel({
		  // options
		  cellAlign: 'center',
		  contain: true,
		  // wrapAround: true,
		  // freeScroll: true,
		  cellSelector: '.block-carousel-item',
		  percentPosition: false,
		  pageDots: false,

		});

		//Init Collapsable Footer Elements
		$('footer.footer [data-multi-toggle]').multiToggle();
		$('.mega-menu [data-multi-toggle]').multiToggle();

		/* FINDER WIDGETS - COLLAPSE IN MOBILE */
        var medBreak = 681; // Widget breakpoint in pixels
        if ($(window).width() < medBreak) {
            $( '.finder-widget h4' ).click(function() {
                $( 'div.widget-content').slideToggle( [400], 'swing', function() {});
                $(this).parent('div.finder-widget').toggleClass('active');
            });
        } else {
            $('.finder-widget').addClass('active');  
        }
        /* END FINDER WIDGETS */
		initStickyNavEvents();

		$('[data-image-previewer]').imagePreviewer();
		
			
		//Mega-Menu
		$('.mega-menu').megaMenu();

	});

})(this, jQuery);