/*
 * Copyright (c) 2014 Juniper Networks, Inc. All rights reserved.
 */


window.searchExpand = function(){
    $(".link-searchbox").addClass('hide');
    $( ".input-searchbox" ).removeClass('hide');

    
}
window.onClickSidebarCollapse = function() {
    var $minimized = false;
    $('#sidebar').toggleClass('menu-min');
    $('#sidebar-collapse').find('i').toggleClass('fa-chevron-left').toggleClass('fa-chevron-right');

    $minimized = $('#sidebar').hasClass('menu-min');
    if ($minimized) {
        $('.open > .submenu').removeClass('open');
        $('#breadcrumbs.fixed').css('left',43);
    } else {
$('#breadcrumbs.fixed').css('left',183);
    }
}


    $('#back-to-top').click(function (event) {
        event.preventDefault();
        $('html, body').animate({scrollTop: 0}, 500);
        return false;
    });
