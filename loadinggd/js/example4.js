$(function() { 

function scroll_fn(){

    document_height = $(document).height();
    scroll_so_far = $(window).scrollTop();
    window_height = $(window).height();
    
	max_scroll = document_height-window_height;

	scroll_percentage = scroll_so_far/(max_scroll/100);
    
   
$('#loading').width(scroll_percentage + '%');
	 
$('#header-inner-logo').css({background: "-webkit-gradient(linear, left top, left bottom, color-stop("+scroll_percentage+"%,#ef4848), color-stop("+scroll_percentage+"%,#FFF))" });
$('#header-inner-logo').css({background: "-webkit-linear-gradient(top, #ef4848 "+scroll_percentage+"%,#FFF "+scroll_percentage+"%)" });
$('#header-inner-logo').css({background: "-moz-linear-gradient(top, #ef4848 "+scroll_percentage+"%, #FFF "+scroll_percentage+"%)" });
$('#header-inner-logo').css({background: "-o-linear-gradient(top, #ef4848 "+scroll_percentage+"%,#FFF "+scroll_percentage+"%)" });
$('#header-inner-logo').css({background: "-ms-linear-gradient(top, #ef4848 "+scroll_percentage+"%,#FFF "+scroll_percentage+"%)" });
$('#header-inner-logo').css({background: "linear-gradient(to top, #ef4848 "+scroll_percentage+"%,#FFF "+scroll_percentage+"%)" });


}



$(window).scroll(function() {
scroll_fn();
});

$(window).resize(function() {
scroll_fn();
});

});