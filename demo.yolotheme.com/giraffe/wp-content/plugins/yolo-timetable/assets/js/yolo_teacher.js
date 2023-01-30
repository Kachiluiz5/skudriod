jQuery(document).ready(function($) {
    "use strict";
    var $window = $(window),
        $body = $('body'),
        isRTL = $body.hasClass('rtl') ? true : false;

    function masonryTeacher() {
        var $teacher_masonry = $('.yolo-archive-teacher .posts-loop-content');
        if ($teacher_masonry.length > 0) {
            $teacher_masonry.imagesLoaded(function() {
                $teacher_masonry.isotope({
                    transitionDuration: '0.5s',
                    masonry: {
                        'gutter': 0
                    },

                    itemSelector: 'article',
                    layoutMode: "fitRows",
                    isOriginLeft: !isRTL
                });

                setTimeout(function() {
                    $teacher_masonry.isotope('layout');
                }, 500);
            });
        }
    }
    masonryTeacher();
});

jQuery(document).ready(function($) {
    "use strict";
    $('.tab-header li:first-child').find('a').addClass('active');
    $('.tab-header li a').click(function(event) {
        event.preventDefault();
        $('.tab-header li a').removeClass('active');
        $(this).addClass('active');
        var $class = $(this).data('name');
        $('.content-tab').slideUp();
        $($class).slideDown();
    });

    function postsCarousel() {
        var checkWidth = jQuery(window).width();
        var owlPost = jQuery(".my_coures .posts-loop-content");
        owlPost.addClass('owl-carousel');
        owlPost.owlCarousel({
            margin: 0,
            items: 2,
            autoHeight: true,
            slideSpeed: 5000,
            autoplay: false,
            autoplaySpeed: 1000,
            autoplayTimeout: 5000,
            dots: true,
            loop: false,
            responsive: {
                0: {
                    items: 1
                },

                670: {
                    items: 2,
                },
            }
        });
    }

    postsCarousel();
    jQuery(window).resize(postsCarousel);

    new WOW().init();
});