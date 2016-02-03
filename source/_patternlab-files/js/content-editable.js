/*!
 * Content Editable Toggle - v0.1
 *
 */

var contentEditable = {
	/**
	* add the onclick handler to the code link in the main nav
	*/
	onReady: function() {
		
		// not sure this is needed anymore...
		$('body').addClass('code-ready');

		$(window).resize(function() {
			if(!codeViewer.codeActive) {
				codeViewer.slideCode($('#sg-code-container').outerHeight());
			}
		});
		
		// add the onclick handler
		$('#sg-t-content-editable').click(function(e) {
			e.preventDefault();
            
			// remove the class from the "eye" nav item
			$('#sg-t-toggle').removeClass('active');
			
			if ($(this).hasClass('active')) {
				$('#sg-viewport').contents().find('body').attr('contenteditable', false);
			} else {
				$('#sg-viewport').contents().find('body').attr('contenteditable', true);
			}
			$('#sg-t-content-editable').toggleClass('active');
		});
	}
};

// when the document is ready make the content editable toggle ready
$(document).ready(function() { contentEditable.onReady(); });

// keep contenteditable attribute if iframe contents change
$('#sg-viewport').load(function() {
	if ($('#sg-t-content-editable').hasClass('active')) {
		$(this).contents().find('body').attr('contenteditable', true);
	} else {
        $(this).contents().find('body').attr('contenteditable', false);
    }
});