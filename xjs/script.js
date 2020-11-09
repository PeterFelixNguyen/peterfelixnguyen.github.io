/* Author: Peter "Felix" Nguyen */

/*
  Scroll function for Bootstrap tabs 
*/
function scrollToAnchor(anchor_id){
    /* Get the anchor id to determine which anchor to scroll to */
    var aTag = $("a[name='"+ anchor_id +"']");
    /* Perform the desired scrolling animation */
    $('html,body').animate({scrollTop: aTag.offset().top},'fast');
}

/*
  Initialize (this function calls on page load and refresh) 
*/
$(document).ready(function() {
	/* Initialize the LazyLoader (Thank you, Mika Tuupola for creating this) */
    if ($.isFunction($.fn.lazyload)) {
        $("img.lazyload").lazyload();
    }
    
    /* If location.hash is in URL, then show the associated tab */
	if(location.hash) {
        /* Show the specific tab based on the anchor specified in the url */
        $('a[href=' + location.hash + ']').tab('show');
    }
	
    /* Handle the click event on the vertical tabs */
    $(document.body).on("click", "a[data-toggle]", function(event) {
        /* Update the anchor (location.hash) in the url to keep track of which tab is active */
        location.hash = this.getAttribute("href");
        /*alert("debug");*/
    });
});

/* 
  The Masonry Function

  Putting the Masonry function outside the .ready() function 
  solves the following problem: failure to load masonry on subsequent page refresh 
*/
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

/*
  Specify which screenshot to popup on modal action
*/
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
    /* Hover enter */
    $(this).css('background-color', 'rgba(60,190,120,1)'); // green
}, function() {
    /* Hover leave */
    var is_selected = $(this).hasClass('selected');
    if (is_selected) {
        $(this).css('background-color', 'rgba(60,190,120,1)'); // green
    } else {
        $(this).css('background-color', 'rgba(59,89,152,1)'); // blue
    }
});

/* 
  Function for the copy button in the Contact page.
*/
function copy(element) {
    /* Copy to clipboard */
    var $temp = $("<input>");
    $("body").append($temp);
    $temp.val($(element).text()).select();
    document.execCommand("copy")
    $temp.remove();

    /* Toast notification of copy */
    if (element == '#phone') {
        $('div#toast').text('Phone copied');  
    } else if (element == '#email') {
        $('div#toast').text('Email copied');  
    } else {
        $('div#toast').text('Content copied');  
    }

    /* Get the toast element to display */
    var toast = document.getElementById('toast');

    /* Show the toast message */
    toast.className = 'show';

    /* Hide the toast message after a short time */
    setTimeout(function() { 
        toast.className = toast.className.replace('show', ''); 
    }, 3000);
}
