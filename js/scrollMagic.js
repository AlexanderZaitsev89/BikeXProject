$(document).ready(function () {

    //Init ScrollMagic
    var controller=new ScrollMagic.Controller();

    // build a scenes
    var headerPage2Animation=new ScrollMagic.Scene({
        triggerElement:"#headerPage2"
    })
        .setClassToggle("#headerPage2","fade-in")
        .addTo(controller);

    var textPage3Animation=new ScrollMagic.Scene({
        triggerElement:"#textPage3"
    })
        .setClassToggle("#textPage3","fade-in2")
        .addTo(controller);

});

////////////ANIMATION for the navigation button
$("#customNavBtn ul li a[href^='#']").on('click', function(e) {

    // prevent default anchor click behavior
    e.preventDefault();

    // animate
    $('html, body').animate({
        scrollTop: $(this.hash).offset().top
    }, 600, function(){

        // when done, add hash to url
        // (default click behaviour)
        window.location.hash = this.hash;
    });

});

$(".arrowDown").on('click', function(e) {

    // prevent default anchor click behavior
    e.preventDefault();

    // animate
    $('html, body').animate({
        scrollTop: $("#page2").offset().top
    }, 600, function(){

        // when done, add hash to url
        // (default click behaviour)
        window.location.hash = this.hash;
    });

});