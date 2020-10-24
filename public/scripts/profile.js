$('a#campgrounds').click( function () {
    $('a.nav-link').removeClass("focused");
    $(this).addClass("focused");
    $('div#likedShow').hide();
    $('div#profileEdit').hide();
    $('div#campgroundsShow').show();

});
$('a#likes').click( function () {
    $('a.nav-link').removeClass("focused");
    $(this).addClass("focused");
    $('div#profileEdit').hide();
    $('div#campgroundsShow').hide();
    $('div#likedShow').show();
});
$('a#profileEdit').click( function () {
    $('a.nav-link').removeClass("focused");
    $(this).addClass("focused");
    $('div#likedShow').hide();
    $('div#campgroundsShow').hide();
    $('div#profileEdit').show();
});