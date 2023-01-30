(function ($) {
    "use strict";
	jQuery(document).ready(function($) {
		if($('div').hasClass('accessories')){
		function accessory_checked_count(){
			var product_count = 0;
			$('.accessory-checkbox .product-check').each(function() {
				if( $(this).is(':checked') ) {
					product_count++;
				}
			});
			return product_count;
		}

		function accessory_checked_total_price(){
			var total_price = 0;
			$('.accessory-checkbox .product-check').each(function() {
				if( $(this).is(':checked') ) {
					total_price += parseFloat( $(this).data( 'price' ) );
				}
			});
			return total_price;
		}

		function accessory_checked_product_ids(){
			var product_ids = [];
			$('.accessory-checkbox .product-check').each(function() {
				if( $(this).is(':checked') ) {
					product_ids.push( $(this).data( 'product-id' ) );
				}
			});
			return product_ids;
		}

		function accessory_unchecked_product_ids(){
			var product_ids = [];
			$('.accessory-checkbox .product-check').each(function() {
				if( ! $(this).is(':checked') ) {
					product_ids.push( $(this).data( 'product-id' ) );
				}
			});
			return product_ids;
		}

		function accessory_checked_variable_product_ids(){
			var variable_product_ids = [];
			$('.accessory-checkbox .product-check').each(function() {
				if( $(this).is(':checked') && $(this).data( 'product-type' ) == 'variable' ) {
					variable_product_ids.push( $(this).data( 'product-id' ) );
				}
			});
			return variable_product_ids;
		}

		function accessory_is_variation_selected(){
			if( $(".single_add_to_cart_button").is(":disabled") ) {
				return false;
			}
			return true;
		}

		function accessory_refresh_fragments( response ){
			var this_page = window.location.toString();
			var fragments = response.fragments;
			var cart_hash = response.cart_hash;

			// Block fragments class
			if ( fragments ) {
				$.each( fragments, function( key ) {
					$( key ).addClass( 'updating' );
				});
			}

			// Replace fragments
			if ( fragments ) {
				$.each( fragments, function( key, value ) {
					$( key ).replaceWith( value );
				});
			}

			// Cart page elements
			$( '.shop_table.cart' ).load( this_page + ' .shop_table.cart:eq(0) > *', function() {

				$( '.shop_table.cart' ).stop( true ).css( 'opacity', '1' ).unblock();

				$( document.body ).trigger( 'cart_page_refreshed' );
			});

			$( '.cart_totals' ).load( this_page + ' .cart_totals:eq(0) > *', function() {
				$( '.cart_totals' ).stop( true ).css( 'opacity', '1' ).unblock();
			});
		}

		$( 'body' ).on( 'found_variation', function( event, variation ) {
			$('.accessory-checkbox .product-check').each(function() {
				if( $(this).is(':checked') && $(this).data( 'product-type' ) == 'variable' ) {
					$(this).data( 'price', variation.display_price );
					$(this).siblings( 'span.accessory-price' ).html( $(variation.price_html).html() );
				}
			});
		});
		
		$( 'body' ).on( 'woocommerce_variation_has_changed', function( event ) {
			var total_price = accessory_checked_total_price();
			$.ajax({
				type: "POST",
				async: false,
				url: yolo_accessories_ajax_url,
				data: { 'action': "yolo_accessory_checked_total_price", 'price': total_price  },
				success : function( response ) {
					$( '.total-price-html .amount' ).html( response );
				}
			})
		});

		$( '.accessory-checkbox .product-check' ).on( "click", function() {
			var total_price = accessory_checked_total_price();
			$.ajax({
				type: "POST",
				async: false,
				url: yolo_accessories_ajax_url,
				data: { 'action': "yolo_accessory_checked_total_price", 'price': total_price  },
				success : function( response ) {
					$( '.total-price-html .amount' ).html( response );
					$( '.total-products' ).html( accessory_checked_count() );

					var unchecked_product_ids = accessory_unchecked_product_ids();
					var unchecked_product_ids = accessory_unchecked_product_ids();
					$( '.accessories .product-listing .product-item-wrap' ).each(function() {

						$(this).removeClass('product-not-checked');
						$(this).addClass('product-checked');
						for (var i = 0; i < unchecked_product_ids.length; i++ ) {
							if( $(this).hasClass( 'post-'+unchecked_product_ids[i] ) ) {
								$(this).removeClass('product-checked');
								$(this).addClass('product-not-checked');
							}
						}
					});
				}
			})
		});

		$('.accessories-add-to-cart .add-to-cart').click(function() {
			$(this).addClass('ac-loading');
			var accerories_all_product_ids = accessory_checked_product_ids();
			var accerories_variable_product_ids = accessory_checked_variable_product_ids();
			if( accerories_all_product_ids.length === 0 ) {
				var accerories_alert_msg = yolo_accessories_msg['empty'];
			} else if( accerories_variable_product_ids.length > 0 && accessory_is_variation_selected() === false ) {
				var accerories_alert_msg = yolo_accessories_msg['no_variation'];
			} else {
				for (var i = 0; i < accerories_all_product_ids.length; i++ ) {
					if( ! $.inArray( accerories_all_product_ids[i], accerories_variable_product_ids ) ) {
						var variation_id  = $('.variations_form .variations_button').find('input[name^=variation_id]').val();
						var variation = {};
						if( $( '.variations_form' ).find('select[name^=attribute]').length ) {
							$( '.variations_form' ).find('select[name^=attribute]').each(function() {
								var attribute = $(this).attr("name");
								var attributevalue = $(this).val();
								variation[attribute] = attributevalue;
							});

						} else {

							$( '.variations_form' ).find('.select').each(function() {
								var attribute = $(this).attr("data-attribute-name");
								var attributevalue = $(this).find('.selected').attr('data-name');
								variation[attribute] = attributevalue;
							});

						}
						$.ajax({
							type: "POST",
							async: false,
							url: yolo_accessories_ajax_url,
							data: { 'action': "yolo_add_to_cart", 'product_id': accerories_all_product_ids[i], 'variation_id': variation_id, 'variation': variation  },
							success : function( response ) {
								accessory_refresh_fragments( response );
							}
						})
					} else {
						$.ajax({
							type: "POST",
							async: false,
							url: yolo_accessories_ajax_url,
							data: { 'action': "woocommerce_add_to_cart", 'product_id': accerories_all_product_ids[i]  },
							success : function( response ) {
								accessory_refresh_fragments( response );
							}
						})
					}
				}
				var accerories_alert_msg = yolo_accessories_msg['success'];
				$(this).removeClass('ac-loading');
			}
			$( '.yolo-product-message' ).html(accerories_alert_msg);
		});
		}
	});
})(jQuery);