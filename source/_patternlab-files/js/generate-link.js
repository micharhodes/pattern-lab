/*!
 * Content Editable Toggle - v0.1
 *
 */

var generateLink = {
	/**
	* add the onclick handler to the code link in the main nav
	*/
	onReady: function() {
        $('#sg-l-toggle').click(function(e) {
            // check to see if annotations or code view are active
            if (codeViewer.codeActive) {
                $('#sg-link-code').addClass('active');
            } else {
                $('#sg-link-code').removeClass('active');
            }

            if (annotationsViewer.commentsActive) {
                $('#sg-link-annotations').addClass('active');
            } else {
                $('#sg-link-annotations').removeClass('active');
            }
        });
        
		// add the onclick handler
		$('#sg-copy-link').click(function(e) {
			e.preventDefault();
            var url = window.location.href,
                addWidth = $('#sg-link-width').hasClass('active'),
                addCode = $('#sg-link-code').hasClass('active'),
                addAnnotations = $('#sg-link-annotations').hasClass('active'),
                temp = document.createElement('input');     // Create a "hidden" input
            
            url = generateLink.removeURLParam(url, 'w');
            url = generateLink.removeURLParam(url, 'view');
            
            if (addWidth) {
                if (url.indexOf('?') > -1) {
                    url += '&w=' + document.getElementById('sg-viewport').clientWidth + 'px';
                } else {
                    url += '?w=' + document.getElementById('sg-viewport').clientWidth + 'px';
                }
            }
            
            if (addCode) {
                if (url.indexOf('?') > -1) {
                    url += '&view=c';
                } else {
                    url += '?view=c';
                }
            }
            
            if (addAnnotations) {
                if (url.indexOf('?') > -1) {
                    url += '&view=a';
                } else {
                    url += '?view=a';
                }
            }
            
            // Assign it the value of the specified element
            temp.setAttribute('value', url);
            
            // Append it to the body
            document.body.appendChild(temp);

            // Highlight its content
            temp.select();

            // Copy the highlighted text
            document.execCommand("copy");

            // Remove it from the body
            document.body.removeChild(temp);
		});
        
        $('#sg-link-width').click(function (e) {
            e.preventDefault();
            generateLink.toggleWidth();
        });
        
        $('#sg-link-code').click(function (e) {
            e.preventDefault();
            generateLink.toggleCodeView();
        });
        
        $('#sg-link-annotations').click(function (e) {
            e.preventDefault();
            generateLink.toggleAnnotationsView();
        });
	},
    
    /**
    * remove url params so they won't be doubled
    */
    
    removeURLParam: function (url, parameter) {
        //prefer to use l.search if you have a location/link object
        var urlparts= url.split('?');   
        if (urlparts.length>=2) {
            var prefix= encodeURIComponent(parameter)+'=';
            var pars= urlparts[1].split(/[&;]/g);

            //reverse iteration as may be destructive
            for (var i= pars.length; i-- > 0;) {    
                //idiom for string.startsWith
                if (pars[i].lastIndexOf(prefix, 0) !== -1) {  
                    pars.splice(i, 1);
                }
            }

            url= urlparts[0] + (pars.length > 0 ? '?' + pars.join('&') : "");
            return url;
        } else {
            return url;
        }
    },
    
    /**
    * toggle active state of width control
    */
    
    toggleWidth: function () {
        $('#sg-link-width').toggleClass('active');
    },
    
    /**
    * toggle active state of code control.  Remove active state of annotations
    */
    
    toggleCodeView: function () {
        $('#sg-link-code').toggleClass('active');
        $('#sg-link-annotations').removeClass('active');
    },
    
    /**
    * toggle active state of code control.  Remove active state of annotations
    */
    
    toggleAnnotationsView: function () {
        $('#sg-link-annotations').toggleClass('active');
        $('#sg-link-code').removeClass('active');
    }
};

// when the document is ready make the content editable toggle ready
$(document).ready(function() { generateLink.onReady(); });