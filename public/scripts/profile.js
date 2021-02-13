$("a#campgrounds").click(function () {
    $("a.nav-link").removeClass("focused");
    $(this).addClass("focused");
    $("div#likedShow").hide();
    $("div#profileEdit").hide();
    $("div#campgroundsShow").show();
});

$("a#likes").click(function () {
    $("a.nav-link").removeClass("focused");
    $(this).addClass("focused");
    $("div#profileEdit").hide();
    $("div#campgroundsShow").hide();
    $("div#likedShow").show();
});

$("i.icon-unlike").click(function () {
    const campgroundId = $(this).attr("campgroundId");
    $.ajax({
        method: "POST",
        url: `/campgrounds/${campgroundId}/unlike/${userId}`,
    })
        .done((res) => {
            $(this).parent().parent().parent().fadeOut(1000);
        })
        .fail(function (err) {
            alert("Sorry Something went wrong, Please Try Again!");
        });
});
