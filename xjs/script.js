/* Author: Peter "Felix" Nguyen */

/* Scroll function for Bootstrap tabs */
function scrollToAnchor(anchor_id){
    var aTag = $("a[name='"+ anchor_id +"']");
    $('html,body').animate({scrollTop: aTag.offset().top},'fast');
}

/* Initialize */
$(document).ready(function() {
	
	if(location.hash) {
        $('a[href=' + location.hash + ']').tab('show');
    }
	
    /* Tabs event handling */
    $(document.body).on("click", "a[data-toggle]", function(event) {
        location.hash = this.getAttribute("href");
        /*alert("debug");*/
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
            var $this = $(this).attr('id') ;
            scrollToAnchor($this);
		});
	});
});

/* Bootstrap Tabs */
$(window).on('popstate', function() {
    var anchor = location.hash || $('a[data-toggle=tab]').first().attr('href');
    $('a[href=' + anchor + ']').tab('show');
});

/* Specify which screenshot to popup on modal action */
$('#screenshotModal').on('show.bs.modal', function (event) {
  var button = $(event.relatedTarget) // Button that triggered the modal
  var popup = button.data('screenshot') // Extract info from data-* attributes
  var modal = $(this)
  $('img.modal-screenshot').attr('src', popup);
  $('a.modal-screenshot').attr('href', popup);
})

/*
  jQuery hover function for hovered links/tabs
  Works much better then CSS-only method.

  We need this function because "a:hover" does not behave correctly with touch input
  Sometimes, a touch will cause the link to stay highlighted even after release. 
  
  This fixes it.
*/
$("a.hoverable").hover(function() {
    // hover enter
    $(this).css('background-color', 'rgba(60,190,120,1)'); // green
}, function() {
    // hover leave
    var is_selected = $(this).hasClass('selected');
    if (is_selected) {
        $(this).css('background-color', 'rgba(60,190,120,1)'); // green
    } else {
        $(this).css('background-color', 'rgba(59,89,152,1)'); // blue
    }
});