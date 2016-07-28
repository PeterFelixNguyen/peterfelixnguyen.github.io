/* Author: Peter "Felix" Nguyen */

$(document).ready(function() {
	
	if(location.hash) {
        $('a[href=' + location.hash + ']').tab('show');
    }
	
    $(document.body).on("click", "a[data-toggle]", function(event) {
        location.hash = this.getAttribute("href");
    });

	$('a[data-toggle=tab]').each(function () {
		var $this = $(this);
		
		$this.on('shown.bs.tab', function() {
			$('.mason').imagesLoaded(function() {
				$('.mason').masonry({
					transitionDuration: '0.1s',
					columnWidth: '.grid-sizer',
					itemSelector: '.item',
					percentPosition: true,
					gutter: '.gutter-sizer'
				});
			});
		});
	});
});

$(window).on('popstate', function() {
    var anchor = location.hash || $("a[data-toggle=tab]").first().attr("href");
    $('a[href=' + anchor + ']').tab('show');
});
