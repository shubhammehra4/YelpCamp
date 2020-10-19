$('a#campgrounds').click( function () {
    $('a.nav-link').removeClass("focused");
    $(this).addClass("focused");
    $('div#likedShow').hide();
    $('div#info').hide();
    $('div#campgroundsShow').show();

});
$('a#likes').click( function () {
    $('a.nav-link').removeClass("focused");
    $(this).addClass("focused");
    $('div#info').hide();
    $('div#campgroundsShow').hide();
    $('div#likedShow').show();
});
$('a#info').click( function () {
    $('a.nav-link').removeClass("focused");
    $(this).addClass("focused");
    $('div#likedShow').hide();
    $('div#campgroundsShow').hide();
    $('div#info').show();
});