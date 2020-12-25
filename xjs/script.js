/* Author: Peter "Felix" Nguyen */

/* Set the variable for the page body */
var page = $("html, body");
/*
   Set desired speed for the scroll function
   Scroll speeds: 'fast' ~= 200 ms, 'slow' ~= 600 ms, 
   or any number like 500 (i.e. 500 ms) without the quotes ' or " */
var scrollDuration = 1000;
/* For some reason, need to delay (timeout) to guarantee scroll on "ctrl+r". 
   Strangely clicking on the refresh button works. 
   This problem occurs on all browsers.
   This problem only happens on About.html */
var scrollDelay = 200;
/*
  Scroll function for Bootstrap tabs
*/
function scrollToAnchor(anchor_id){
  /* Get the destination id to determine which id to scroll to */
  var destinationLargeScreens = $("span[name='"+ anchor_id +"']");
  var destinationSmallScreens = $("span[name='destination_small_screens']");
  
  /* Final destination to scroll to */
  var finalDestination;
  
  /* Set the final destination based on the screen size */
  if ($(window).width() < 768) {
    /* Destination on small screens */
    finalDestination = destinationSmallScreens;
  } else {
    /* Destination on large screens */
    finalDestination = destinationLargeScreens;
  }
  
  setTimeout(function() {
    /* Add a listener to stop scroll animation when interrupted by user actions */
    page.on("scroll mousedown wheel DOMMouseScroll mousewheel keyup touchmove", function(){
      page.stop(); // Stop the scrolling animation
      /* Remove event handlers when interrupt signal sent */
      page.off("scroll mousedown wheel DOMMouseScroll mousewheel keyup touchmove");
    });
    /* Perform the scroll animation */
    page.animate({ // Arg1
      scrollTop: finalDestination.offset().top // Scroll to the destination
    }, { // Arg2
      queue: false, // Options: turn off queue
      duration: scrollDuration, // Options: set animation duration
      complete: function(){ // Remove event handlers at end of animation
        page.off("scroll mousedown wheel DOMMouseScroll mousewheel keyup touchmove"); 
      }       
    });
  }, scrollDelay);
}

/*
  Initialize (this function calls on page load and refresh) 
*/
$(document).ready(function() {
  /* Initialize the LazyLoader (Thank you, Mika Tuupola for creating this) */
    if ($.isFunction($.fn.lazyload)) {
      $("img.lazyload").lazyload();
    }
    
    /* On some browsers like Chrome (87.0.4280.88 Official Build 64-Bit), the browser will attempt to 
        load the previous scroll position on page refresh. This breaks my scroll-to-top functionality, 
        which is supposed to happen on every on page-refresh 
        
       The result: the page will initially scroll to the top, but then it will attempt to scroll 
       back down to the previous position before the refresh.
       
       This code below disables this auto-scrolling if it is a feature enabled in the browser
    */
    if ('scrollRestoration' in history) {
      history.scrollRestoration = 'manual';
    }
    
    /* If location.hash is in URL, then show the associated tab */
  if(location.hash) {
    /* Show the specific tab based on the anchor specified in the URL */
    $('a[href=' + location.hash + ']').tab('show');
  } else {
    var firstTab;
    /* If location.hash is missing, then set the hash associated with the first tab */
    if (document.URL.includes("about.html")) {
      /* The first tab in about.html is #summary */
      firstTab = '#summary';
    } else if (document.URL.includes("portfolio.html")) {
      /* The first tab in portfolio.html is #floating-point-calculator-android */
      firstTab = '#floating-point-calculator-android';
    }
    /* To prevent auto-scroll: DO NOT update it via the "location.hash = <value>" method */
    history.pushState(null, null, firstTab);
    /* Mark the first tab active */
    $( "li.first-tab" ).addClass( "active" );
  }

  /* Handle the click event on the vertical tabs */
  $(document.body).on("click", "a[data-toggle]", function(event) {
    /* Get the hash and store in a var (DO NOT update it to location.hash) */
    var new_hash = this.getAttribute("href");
    /* Get the parent container for later use */
    var parentContainer = $(this).parent();
    /* Update URL only if the parent container is the active tab
       (prevents adding duplicates to the URL history) */
    if (!parentContainer.hasClass('active')) {
      /* Update the hash in the URL to keep track of which tab is active */
      history.pushState(null,null,new_hash);
    }
  });
  
  /* Perform one time Masonry loading ONLY for attribution.html */
  if (document.URL.includes("attribution.html")) {
    $('.mason').imagesLoaded(function() {
      $('.mason').masonry({
        transitionDuration: '0.1s',
        columnWidth: '.grid-sizer',
        itemSelector: '.item',
        percentPosition: true,
        gutter: '.gutter-sizer'
      });
    });
  }
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
    /* Get the desired destination to auto-scroll to */
    var $this = $(this).attr('id');
    /* After tab clicked, scroll to the desired destination */
    scrollToAnchor($this);
  });
});

/*
  jQuery hover function for hovered links/tabs
  Works much better then CSS-only method.

  We need this function because "a:hover" does not behave correctly with touch input
  Sometimes, a touch will cause the link to stay highlighted even after release. 
  
  This fixes it.
*/
$("a.hoverable").hover(function() {
  /* Hover enter */
  $(this).css('background-color', 'rgba(30,160,90,1)'); // Hover Green
}, function() {
  /* Hover leave */
  var is_selected = $(this).hasClass('selected');
  if (is_selected) {
    $(this).css('background-color', 'rgba(60,190,120,1)'); // Active Green
  } else {
    $(this).css('background-color', 'rgba(59,89,152,1)'); // Dark Blue
  }
});

/*
  Followup function to onHover to animate clicked tab
*/
$("a.hoverable").mousedown(function() {
  $(this).css('background-color', 'rgba(60,190,120,1)'); // Active Green
});

window.addEventListener("hashchange", function(e) {
  /* Dismiss the modal whenever the user navigates back/forward which changes the hash */
  $('#screenshotModal').modal('hide');
  
  /* Show the tab associated with the hash change of back/forward navigation */
  if (location.hash == "") {
    $('.tab a:first').tab('show');
  } else {
    $('a[href=' + location.hash + ']').tab('show');
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

/*
  Function to animate the collapse/expand controls
*/
$("h2.collapse-toggle").on('click', function(){
  /* Get the element we want to animate */
  var iSelector = $(this).find("span:last");
  if(iSelector.hasClass("glyphicon glyphicon-plus")) {
    /* Change icon from PLUS to MINUS */
    iSelector.removeClass("glyphicon glyphicon-plus")
    iSelector.addClass("glyphicon glyphicon-minus")
  } else {
    /* Change icon from MINUS to PLUS */
    iSelector.removeClass("glyphicon glyphicon-minus")
    iSelector.addClass("glyphicon glyphicon-plus")
  }
});

/*
  Modal Screenshot (Part 1)
  Specify which screenshot to popup on modal action
*/
$('#screenshotModal').on('show.bs.modal', function (event) {
  // Get the button that triggered the modal
  var button = $(event.relatedTarget)
  // Extract info from data-* attributes
  var imageURL = button.data('screenshot')
  // Insert the image content in the modal
  $('img.modal-screenshot').error(function() {
    /* If there is an error loading (file not found), use the "file not found" image as a substitute */
    $( this ).attr( "src", "ximages/image_not_found.png");
    /* If there is an error loading (file not found), change the destination of the "open" button to the substitute image */
    $('button.modal-floating-button.open').attr('onclick', 'window.open("' + "ximages/image_not_found.png" + '"), "_blank"');
  }).attr( "src", imageURL); // Attempt to insert the image into the modal placeholder/slot
  
  // Add listener to the "open" button
  $('button.modal-floating-button.open').attr('onclick', 'window.open("' + imageURL + '"), "_blank"');
})

/* 
  Modal Screenshot (Part 2)
  Makes the modal image fit the window (ensures the image width and height does not extend the container)
 */
var enabled = true;
$('#screenshotModal').on('shown.bs.modal', function (event) {
  if (enabled) {
    /* Even if CSS paddings/margins are 0, keep these variables for future adjustments */
    var verticalPaddingToSubtract = 0; /* If padding top/bottom = 10 and margin top/bottom = 10, then 10*4 = offsetVertical */
    var horizontalPaddingToSubtract = 0; /* Might need to add horizontal offset for things such as a scrollbar on the right */
    
    /* Get the window dimensions */
    var windowWidth = $(window).width();
    var windowHeight = $(window).height();
    
    /* The viewport should subtract modal paddings/margins from window dimensions */
    var viewportWidth = windowWidth - horizontalPaddingToSubtract;
    var viewportHeight = windowHeight - verticalPaddingToSubtract;
    
    /* Get the image we want to transform */
    var image = $('#original');
    
    /* Get the image's original dimensions */
    var imageWidth = image[0].naturalWidth;
    var imageHeight = image[0].naturalHeight;
    
    /* By default, the image scale is 1.0 */
    scale = 1.0;
    if (imageWidth < viewportWidth && imageHeight < viewportHeight) {
        /* If the image is smaller than the viewport, grow the image */
        while ((imageWidth * scale) < viewportWidth && (imageHeight * scale) < viewportHeight) {
            scale = scale + 0.005;
        }
    } else if (imageWidth > viewportWidth || imageHeight > viewportHeight) {
        /* If the image is bigger than the viewport, shrink the image */
        while ((imageWidth * scale) > viewportWidth || (imageHeight * scale) > viewportHeight) {
            scale = scale - 0.005;
        }
    }
    /* Adjust the new width based on the new scale */
    var newWidth = imageWidth * scale;
    
    /* Apply the new width to the image to fit the window (aspect ratio will be respected) */
    $("img.modal-screenshot").css("width", newWidth);
  }
})