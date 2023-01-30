jQuery(document).ready(function($) {

    // Class filters
    var grop_class_filters = {};
    if ($('.widget-class-filter').length && ($('.yolo-archive-class.grid').length || $('.yolo-archive-class.list').length)) {
        var class_filters = $('.widget-class-filter');
        var masonrycontainer = class_filters.closest('body').find('.yolo-archive-class .posts-loop-content');
        if (masonrycontainer.length) {
            var getFilterStr = function($filter_item) {
                class_filters.find(':input').each(function() {
                    var $filter_item = $(this);
                    var group = $filter_item.closest('.widget-class-filter').data('group');
                    var filterGroup = grop_class_filters[group];
                    if (!filterGroup)
                        filterGroup = grop_class_filters[group] = [];

                    if ($filter_item.is('select')) {
                        if ($filter_item.val() == '') {
                            delete grop_class_filters[group];
                        } else {
                            grop_class_filters[group] = '.' + $filter_item.val();
                        }
                    } else if ($filter_item.is('input[type="checkbox"]')) {
                        grop_class_filters[group] = [];
                        $filter_item.closest('.widget-class-filter').find('.widget-class-filter-control').each(function() {
                            if ($(this).is(':checked')) {
                                grop_class_filters[group].push('.' + $(this).val());
                            }
                        });
                    }
                });

                var filter_arr = [];
                var filter_arr2 = [];
                var filter_string = '';
                $.each(grop_class_filters, function(index, values) {
                    if ($.isArray(values)) {
                        filter_arr2 = values;
                    } else {
                        filter_arr.push(values);
                    }
                });
                filter_arr = filter_arr.join('');
                var new_filter_arr = [];
                if (filter_arr2.length) {
                    $.each(filter_arr2, function(k2, v2) {
                        new_filter_arr.push((v2 + '' + filter_arr));
                    });
                } else {
                    new_filter_arr.push(filter_arr);
                }
                if (new_filter_arr.length) {
                    filter_string = new_filter_arr.join(',');
                } else {
                    filter_string = '*';
                }
                if (filter_string == '') {
                    filter_string = '*';
                }

                return filter_string;
            };
            masonrycontainer.isotope();

            class_filters.find('.widget-class-filter-control').on('change', function() {
                var filter_string = getFilterStr();
                var options = {
                    layoutMode: 'fitRows',
                    transitionDuration: '0.8s',
                    'masonry': {
                        'gutter': 0
                    }
                }
                options['filter'] = filter_string;
                masonrycontainer.isotope(options);
            });

            imagesLoaded(masonrycontainer, function() {
                var filter_string = getFilterStr();
                var options = {
                    layoutMode: 'fitRows',
                    transitionDuration: '0.8s',
                    'masonry': {
                        'gutter': 0
                    }
                }
                options['filter'] = filter_string;
                masonrycontainer.isotope(options);
            });
        }
    }
});


jQuery(document).ready(function($) {
    "use strict";
    $('.content-tab-wrap .tab-header li:first-child').find('a').addClass('active');
    $('.content-tab-wrap .tab-header li a').click(function(event) {
        event.preventDefault();
        $('.tab-header li a').removeClass('active');
        $(this).addClass('active');
        var $class = $(this).data('name');
        $('.content-tab').slideUp();
        $($class).slideDown();
    });

    $('a#main_lesson').click(function(event) {
        event.preventDefault();
        $('.tab-header li a').removeClass('active');
        $('.tab-header li a.main-lesson-tab').addClass('active');
        var $class = $('.tab-header li a.main-lesson-tab').data('name');
        $('.content-tab').slideUp();
        $($class).slideDown();
    });

    function postsCarousel() {
        var checkWidth = jQuery(window).width();
        var owlPost = jQuery(".teacher .posts-loop-content");
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

                600: {
                    items: 2,
                },

            }
        });
    }

    postsCarousel();
    jQuery(window).resize(postsCarousel);
});