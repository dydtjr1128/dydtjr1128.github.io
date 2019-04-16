var dydtjr1128_blog_animation = (function ($) {

    var indexPostClass = '.post-preview ',

    // post animations on homepage
    indexPostAnimate = function () {
        if ($(indexPostClass).length) {
            $(indexPostClass).each(function () {
            var postPos = $(this).offset().top;
            var topOfWindow = $(window).scrollTop(),
                windowHeight = $(window).height();
                if (postPos < topOfWindow + (windowHeight)/1.1) {
                    $(this).addClass('fadeInDown');
                }
            });
        }
    },

    // notepad javascripts initialization
    init = function () {
        indexPostAnimate();
        $(window).on('scroll', function() {
            indexPostAnimate();
        });
    };

    return {
        init: init
    };

})(jQuery);

(function () {
    dydtjr1128_blog_animation.init();
})();