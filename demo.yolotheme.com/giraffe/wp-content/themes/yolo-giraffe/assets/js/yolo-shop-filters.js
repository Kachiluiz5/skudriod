/** 
 * For Shop filter AJAX
 * 
 * @package    YoloTheme
 * @version    1.0.0
 * @created    15/3/2016
 * @author     Administrator <admin@yolotheme.com>
 * @copyright  Copyright (c) 2015, YoloTheme
 * @license    http://opensource.org/licenses/gpl-2.0.php GPL v2 or later
 * @link       http://yolotheme.com
*/

(function($) {
	'use strict';
	/* Click filter or search */
	$(document).on('click', '.yolo-filter-search .yolo-filter', function(e){
		e.preventDefault();
		if($('.yolo-search-field').hasClass('active')){
			$('.yolo-search-field').slideUp(function(){
				$('.yolo-filter-search .yolo-search, .yolo-search-field').removeClass('active');
				if ( $('.woocommerce-sidebar').hasClass('active') ) {
					$('.woocommerce-sidebar').removeClass('active');
					$('.woocommerce-sidebar').slideUp();
				} else {
					$('.woocommerce-sidebar').addClass('active');
					$('.woocommerce-sidebar').slideDown();
				}
			});
		}else{
			$('.woocommerce-sidebar').slideToggle();
			$('.woocommerce-sidebar').css({"display": "flex"});
		}
		if ( $(this).hasClass('active') ) {
			$(this).removeClass('active');

		} else {
			$(this).addClass('active');
		}
	});
	$(document).on('click', '.yolo-filter-search .yolo-search', function(e){
		e.preventDefault();
		$(this).toggleClass('active');
		if($('.yolo-filter-sidebar').length > 0){
				$('.yolo-search-field').slideToggle();
		}else{
			$('.yolo-filter-categories > li').removeClass('current-cat');
			$('.woocommerce-sidebar.top').slideUp(function () {
				$('.yolo-filter-search .yolo-filter, .woocommerce-sidebar.top').removeClass('active');
				if ( $('.yolo-search-field').hasClass('active') ) {
					$('.yolo-search-field').removeClass('active');
					$('.yolo-search-field').slideUp();
				} else {
					$('.yolo-search-field').addClass('active');
					$('.woocommerce-sidebar.top').removeClass('active');
					$('.yolo-search-field').slideDown();
				}
			});
			if ( $(this).hasClass('active') ) {
				$(this).removeClass('active');
			} else {
				$(this).addClass('active');
			}
		}
	});
	/* End */

	/* filter */
	var shop_ajax = $('.site-content-archive-product').attr('data-ajax');
	if ( typeof(shop_ajax) != "undefined" && shop_ajax == 'enable' ) {
		$(document).on('click', '.yolo-filter-categories li a, aside ul li a, .tagcloud a,.yolo-product-category > a,.yolo-shop-results-bar a', function(e){
			e.preventDefault();
			var auto_close = $('.yolo-filter-search .yolo-filter').data('auto-close');
			$('.archive-product-wrap').removeClass('yolo-loaded-product');
			$('.archive-product-wrap').addClass('yolo-loading-product');
			$('.yolo-filter-search .yolo-search').removeClass('active');
			if(auto_close == '1'){
				$('.woocommerce-sidebar.top').slideUp();
			}
			$('.yolo-search-field').slideUp();
			$('.archive-product-wrap .woocommerce-no-products').css('opacity', '0');
			$('.woocommerce-pagination .yolo-shop-loadmore').addClass('yolo-hide-loadmore');
			$('.tagcloud > a').removeClass('current-tag');
			if ( $(this).closest('.yolo-filter-categories').length > 0 ) {
				$('.yolo-filter-categories li').removeClass('current-cat');
				$(this).parent().addClass('current-cat');
			}else{
				$('.yolo-filter-categories li').removeClass('current-cat');
			}
			window.history.pushState({},'',$(this).attr('href'));
			e.preventDefault();
			$('.product-listing, .woocommerce-no-products').before('<div class="yolo-spinner"><i class="fa fa-spinner fa-spin"></i></div>');
			var url = $(this).attr('href');
			url = url.replace(/\/?(\?|#|$)/, "/$1");
			$.ajax({
				url: url,
				type: 'POST',
				data: {
					shop_load: 'full'
				},
				success: function(data){
					$('.yolo-spinner').remove();
					$('.archive-product-wrap').removeClass('yolo-loading-product');
					$('.archive-product-wrap').html(data);
					$('.archive-product-wrap').addClass('yolo-loaded-product');
					$('.woocommerce-pagination .yolo-shop-loadmore').addClass('yolo-show-loadmore');
					$('.tagcloud > a').each( function(){
						if ( $(this).attr('href') == window.location.href ) {
							$(this).addClass('current-tag');
						}
					});
					YOLO.woocommerce.init();
					YOLO.common.tooltip();
					setTimeout(function(){ 
						$('.archive-product-wrap').removeClass('yolo-loaded-product');
						$('.woocommerce-pagination .yolo-shop-loadmore').removeClass('yolo-show-loadmore'); }, 200);
				}
			})
		});
		/* end filter */

		/* Search: click = press enter if have button/input type=submit tag inside form */
		$(document).on('click', '.yolo-search-field button[type="submit"]', function (e) {
			$('.woocommerce-pagination .yolo-shop-loadmore').css('opacity','0');
			e.preventDefault();
			var keyword_search = $('.yolo-search-field .search-field').val();
			keyword_search = keyword_search.trim();
			if ( keyword_search.length ) {
				e.preventDefault();
				if ( $('.product-listing').length ) {
					$('.product-listing').html('<div class="yolo-spinner"><i class="fa fa-spinner fa-spin"></i></div>');
				} else if ( $('.woocommerce-no-products').length ) {
					$('.woocommerce-no-products').html('<div class="yolo-spinner"><i class="fa fa-spinner fa-spin"></i></div>');
				}
				$.ajax({
					url: yolo_framework_constant.get_search_url + encodeURIComponent(keyword_search),
					type: 'GET',
					data: {
                    shop_load: "full",
                    post_type: "product"
                },
					success: function(data){
						$('.yolo-filter-categories > li').removeClass('current-cat');
						$('.yolo-spinner').html();
						$('.archive-product-wrap').html(data);
						if ( $('.yolo-filter-search .yolo-search').hasClass('active') ) {
							$('.yolo-search-field .search-field').val(keyword_search);
						}
						YOLO.woocommerce.init();
						YOLO.common.tooltip();
					}
				});
				$('.search-message').html('');
			} else {
				$('.search-message').html(yolo_framework_constant.enter_keyword);
			}
		});
		/* End search */

		/* Load more*/
		$(document).on('click', '.yolo-shop-loadmore', function(e){
			e.preventDefault();
			var link 			= $(this).data('link');
			var current_page 	= $(this).data('page');
			var totalpage		= $(this).data('totalpage');
			if ( totalpage < current_page ) {
				$('.woocommerce-pagination').html('<div class="yolo-show-all giraffe-btn">' + yolo_framework_constant.yolo_all_products + '</div>').addClass('yolo-all-product');
			} else {
				$(this).attr('href', link.replace('%#%', current_page));
				$(this).data('page', current_page + 1 );
				$('.woocommerce-pagination .yolo-shop-loadmore').text('').append('<i class="fa fa-spinner fa-spin"></i>');
				$.ajax({
					url: $(this).attr('href'),
					type: 'POST',
					data: {
						shop_load: 'full',
						pagination: 'load_more'
					},
					success: function(data){
						$('.woocommerce-pagination .yolo-shop-loadmore').text('Load more');
						var newItems = (data);
						newItems = "<div>" + data + "</div>";
						newItems = $(newItems).children(".yolo-filter-result").children(".product-item-wrap");
						$('.product-listing').isotope();
						$('.product-listing').append( newItems ).isotope( 'appended', newItems );
						imagesLoaded($('.product-listing'), function(){
							$('.product-listing').isotope('layout');
						});
						YOLO.woocommerce.init();
						YOLO.common.tooltip();
					}
				});
			}
		});
		/* End load more*/
	}
	function mobile_cat_filter(){
		$('.yolo-filter-categories-mobile').click(function(){
			if ($(window).width() < 992) {
				$(this).toggleClass('active');
				$(this).parent().find('.yolo-filter-categories').slideToggle(300);
			}else{
				$('.yolo-filter-categories').css({"display": "block"});
				$('.yolo-filter-categories-mobile').removeClass('active');
			}
		});
		$('.yolo-filter-categories-mobile').click(function(){
			$(window).on('resize', function() {
				if ($(window).width() < 992) {
					$(this).toggleClass('active');
					$(this).parent().find('.yolo-filter-categories').slideToggle(300);
				}else{
					$('.yolo-filter-categories').css({"display": "block"});
					$('.yolo-filter-categories-mobile').removeClass('active');
				}
			});
		});
	}
	function close_accordion_section() {
		$('.yolo-filter-widget .widget-title').removeClass('active');
		$('.yolo-filter-widget .widget ul').slideUp(300).removeClass('open');
		$('.yolo-filter-widget .tagcloud').slideUp(300).removeClass('open');
	}
	function filter_toggles(){
		$('.yolo-filter-widget .widget-title').click(function(e) {
			// Grab current anchor value
			e.preventDefault();
			if ($(window).width() < 992) {
				$(this).parents('.yolo-filter-widget').addClass('filter-toggle');
				if($('.yolo-filter-widget').hasClass('filter-toggle')){
					var currentAttrValue = $(this).parent().attr('id');
					if($(this).is('.active')) {
						close_accordion_section();
					}else {
						close_accordion_section();

						// Add active class to section title
						$(this).addClass('active');
						// Open up the hidden content panel
						$('.yolo-filter-widget ' + '#' + currentAttrValue + ' ul').slideDown(300).addClass('open');
						$('.yolo-filter-widget ' + '#' + currentAttrValue + ' .tagcloud').slideDown(300).addClass('open');
					}
				}
			}else{
				$('.yolo-filter-widget').removeClass('filter-toggle');
                //$('.yolo-filter-widget .widget ul').css({"display": "block"});
			}
			$(window).on('resize', function() {
				if ($(window).width() < 992) {
					$('.yolo-filter-widget').addClass('filter-toggle');
                    if($('.yolo-filter-widget').hasClass('filter-toggle')){
						var currentAttrValue = $(this).parent().attr('id');
						if($(this).is('.active')) {
							close_accordion_section();
						}else {
							close_accordion_section();

							// Add active class to section title
							$(this).addClass('active');
							// Open up the hidden content panel
							$('.yolo-filter-widget ' + '#' + currentAttrValue + ' ul').slideDown(300).addClass('open');
						}
					}
				}else{
					$('.yolo-filter-widget').removeClass('filter-toggle');
                    $('.yolo-filter-widget .widget ul').css({"display": "block"});
				}
			});
		});
	}
	/* Add class for current tag */
	if ( $('.tagcloud').length == 1 ) {
		$('.tagcloud > a').each( function(){
			if ( $(this).attr('href') == window.location.href ) {
				$(this).addClass('current-tag');
			}
		});
	}

	/* Show filter search if url has '?s' */
	jQuery(document).ready(function($){
		if ( window.location.href.search('s=') != -1 ){
			$('.yolo-filter-search .yolo-search').addClass('active');
		}
		filter_toggles();
		mobile_cat_filter();
	});

})(jQuery);
