/*RESPONSIVE TABLES*/


;(function($) {
    // "use strict";

    var smallBreak = 1056; // Your table breakpoint in pixels
    // TODO: namspace and abstraction. 

    $.fn.shapeTable = function(options, args) {
        if ($(window).width() < smallBreak) {
            this.each(function(){
                var $this = $(this);
                var $headerRow = $this.find('tr:has(th):first'); // Cannot rely on existance of thead :P
                var $dataRows = $this.find('tr').not($headerRow); // cannot rely on existance of tbody.  Could get ugly if data row leads with th
                var $headers = $headerRow.find('>th');
                var maxDepth = Math.min.apply(null, $dataRows.map(function(){return $(this).parents().length;}).get()) || 0;
                $dataRows = $dataRows.not(
                    function(){
                        return $(this).parents().length > maxDepth ? true : false;; 
                    });
                
                $headers.each(function(i, el){
                    var $header = $(el);
                    var $col = $dataRows.find('>td:nth-of-type(' + (i+1) + ')');
                    $header.css('min-height', '');
                    $col.css('min-height', '');
                    var maxHeight = Math.max.apply(null, $col.map(function(){return $(this).outerHeight();}).get()) || 0;
                    $header.data('shaped', $header.css('min-height'));
                    $header.css('min-height', maxHeight);
                    $col.data('shaped', $header.css('min-height'));
                    $col.css('min-height', maxHeight);
                });
            });
        } else {
            $('td[data-shaped], th[data-shaped]').removeAttr('style');
        }
    };
})(jQuery);
