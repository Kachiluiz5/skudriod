(function($){
	'use strict';
	/**
	 * Create function validate password
	 */
		function yolo_validate_field( str, type ) {

			if ( str === '' ) return false;

			if ( type === undefined ) {
				type = 'password';
			}

			if ( type === 'password' ) {

				var strength = 0,
					password = str;

				if (password.length < 6) {
					$('#result').removeClass()
					$('#result').addClass('short')
					return 'Too short'
				}
				if (password.length > 7) strength += 1
				/**
				 * If password contains both lower and uppercase characters, increase strength value.
				 */
					if (password.match(/([a-z].*[A-Z])|([A-Z].*[a-z])/)) strength += 1
				/**
				 * If it has numbers and characters, increase strength value.
				 */
					if (password.match(/([a-zA-Z])/) && password.match(/([0-9])/)) strength += 1
				
				/**
				 * If it has one special character, increase strength value.
				 */
					if (password.match(/([!,%,&,@,#,$,^,*,?,_,~])/)) strength += 1
				
				/**
				 * If it has two special characters, increase strength value.
				 */
					if (password.match(/(.*[!,%,&,@,#,$,^,*,?,_,~].*[!,%,&,@,#,$,^,*,?,_,~])/)) strength += 1
				
				/**
				 * Calculated strength value, we can return messages
				 * If value is less than 2
				 */
				if (strength < 2) {
					$('#result').removeClass()
					$('#result').addClass('weak')
					return 'Weak'
				} else if (strength == 2) {
					$('#result').removeClass()
					$('#result').addClass('good')
					return 'Good'
				} else {
					$('#result').removeClass()
					$('#result').addClass('strong')
					return 'Strong'
				}

			} else if ( type === 'email' ) {

				var pattern = /^([a-z\d!#$%&'*+\-\/=?^_`{|}~\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]+(\.[a-z\d!#$%&'*+\-\/=?^_`{|}~\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]+)*|"((([ \t]*\r\n)?[ \t]+)?([\x01-\x08\x0b\x0c\x0e-\x1f\x7f\x21\x23-\x5b\x5d-\x7e\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]|\\[\x01-\x09\x0b\x0c\x0d-\x7f\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]))*(([ \t]*\r\n)?[ \t]+)?")@(([a-z\d\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]|[a-z\d\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF][a-z\d\-._~\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]*[a-z\d\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])\.)+([a-z\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]|[a-z\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF][a-z\d\-._~\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]*[a-z\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])\.?$/i;
			    return pattern.test( str );

			}

		}

	$(document).ready(function() {

		/**
		 * Event register
		 */
		if ( $('.yolo-register-member-container').length > 0 ) {

			$('.yolo-register-member-container').each(function(index, el) {
				
				var register_container = $(this);

				/**
				 * Find field and validate it
				 */
					register_container.find('.yolo-item-wrap > input.required').each(function(index, el) {
						$(this).keyup(function() {
							var $_$ 		= $(this),
								value_field = $_$.val(),
								name_field  = $_$.attr('name');

							if ( name_field !== 'email_address' && name_field !== 'confirm_password' ) {

								if ( value_field.length < 6 ) {
									$_$.closest('.yolo-item-wrap').addClass('validate-error');
								} else {
									$_$.closest('.yolo-item-wrap').removeClass('validate-error');
								}

							} else {

								if ( value_field.length > 1 ) {
									$_$.closest('.yolo-item-wrap').removeClass('validate-error');
								}

							}
						});
					});

				/**
				 * Process event when clicking button register
				 */
					register_container.on('click', '.yolo-button', function(event) {
						event.preventDefault();
						/**
						 * VAR
						 */
							var $_$ 	= $(this),
								data 	= register_container.serializeArray();

							data.push(
								{
									'name': 'action',
									'value': 'yolo_register_user'
								},
								{
									'name': 'security',
									'value': Yolo_Login.security
								}
							);

						/**
						 * Process data
						 */
							$.ajax({
								url: Yolo_Login.ajax_url,
								type: 'POST',
								dataType: 'html',
								data: data,
								beforeSend: function() {
									$_$.find('>i').removeClass('hide');
									$_$.find('.yolo-item-wrap').removeClass('validate-error').find('.notice').hide();
									$_$.closest('.yolo-register-member-action').find('.notice').php('').hide();
									/**
									 * Validate field
									 */
										var end_process = false;
										register_container.find('.yolo-item-wrap > input.required').each(function(index, el) {
											
											var $_$ 		= $(this),
												value_field = $_$.val(),
												name_field  = $_$.attr('name');

											if ( value_field === '' || value_field.length < 6 ) {
												$_$.closest('.yolo-item-wrap').addClass('validate-error');
												end_process = true;
											} else {
												$_$.closest('.yolo-item-wrap').removeClass('validate-error');
											}
											
										});

										if ( end_process ) {
											$_$.find('>i').addClass('hide');
											return false;
										}

									/**
									 * Validate email
									 */
										if ( !yolo_validate_field( $('#email_address').val(), 'email' ) ) {

											$('#email_address').closest('.yolo-item-wrap').addClass('validate-error').find('.notice').show();

											$_$.find('>i').addClass('hide');
											return false;

										} else {

											$('#email_address').closest('.yolo-item-wrap').removeClass('validate-error').find('.notice').hide();

										}

								},
								success: function( register_member ) {
									$_$.find('>i').addClass('hide');
									register_member = $.parseJSON(register_member);
									var class_error = '',
									    msg_error   = '',
										status      = register_member.status,
										msg         = register_member.msg;

									if ( typeof register_member.class_error !== 'undefined' && register_member.class_error !== '' ) {
										class_error = register_member.class_error;
										msg_error   = register_member.msg_error;

										$.each(class_error, function(index, class_div) {
											$('#' + class_div).closest('.yolo-item-wrap').addClass('validate-error').find('.notice').php(msg_error[index]).show();
										});

									}

									$_$.closest('.yolo-register-member-action').find('.notice').php( register_member.msg ).show().addClass(status);
									
									if ( status === 'success' ) {

										
										setTimeout(function() {

											window.location.href = register_member.url_redirect;

										}, 3000);

									}

								}
							});
							

					});

			});

		}

		/**
		 * Event login
		 */
		if ( $('.yolo-login-member-container').length > 0 ) {

			$('.yolo-login-member-container').each(function(index, el) {
				
				var login_container = $(this);

				/**
				 * Find field and validate it
				 */
					login_container.find('.yolo-item-wrap > input.required').each(function(index, el) {
						$(this).keyup(function() {
							var $_$ 		= $(this),
								value_field = $_$.val(),
								name_field  = $_$.attr('name');

								if ( value_field.length > 1 ) {
									$_$.closest('.yolo-item-wrap').removeClass('validate-error');
								}

						});
					});

				/**
				 * Process event when clicking button register
				 */
					login_container.on('click', '.yolo-button', function(event) {
						event.preventDefault();
						/**
						 * VAR
						 */
							var $_$ 	= $(this),
								data 	= login_container.serializeArray();

							data.push(
								{
									'name': 'action',
									'value': 'yolo_login_user'
								},
								{
									'name': 'security',
									'value': Yolo_Login.security
								}
							);

						/**
						 * Process data
						 */
							$.ajax({
								url: Yolo_Login.ajax_url,
								type: 'POST',
								dataType: 'html',
								data: data,
								beforeSend: function() {
									$_$.find('>i').removeClass('hide');
									$_$.find('.yolo-item-wrap').removeClass('validate-error').find('.notice').hide();
									$_$.closest('.yolo-login-member-action').find('.notice').php('').hide();
									/**
									 * Validate field
									 */
										var end_process = false;
										login_container.find('.yolo-item-wrap > input.required').each(function(index, el) {
											
											var $_$ 		= $(this),
												value_field = $_$.val(),
												name_field  = $_$.attr('name');

												$_$.closest('.yolo-item-wrap').removeClass('validate-error');
											
										});

										if ( end_process ) {
											$_$.find('>i').addClass('hide');
											return false;
										}

								},
								success: function( login_member ) {
									$_$.find('>i').addClass('hide');
									login_member = $.parseJSON(login_member);

									var class_error = '',
									    msg_error   = '',
										status      = login_member.status,
										msg         = login_member.msg;

									if ( typeof login_member.class_error !== 'undefined' && login_member.class_error !== '' ) {
										class_error = login_member.class_error;
										msg_error   = login_member.msg_error;

										$.each(class_error, function(index, class_div) {
											$('#' + class_div).closest('.yolo-item-wrap').addClass('validate-error').find('.notice').php(msg_error[index]).show();
										});

									}

									$_$.closest('.yolo-login-member-action').find('.notice').php( login_member.msg ).show().addClass(status);
									
									if ( status === 'success' ) {

										
										setTimeout(function() {

											window.location.href = login_member.url_redirect;

										}, 3000);

									}

								}
							});
							

					});

			});

		}

		/**
		 * Process popup
		 */
		if ( $('.yolo-popup-login').length > 0 ) {

			// Show popup
	        $('body').on('click', '.yolo-popup-login', function(event) {
	        	var effect = $(this).data('effect');
	            Custombox.open({
	                target:     '#yolo-box-login',
	                effect:     effect,
	                width: 		400,
	                overlayOpacity: 0.4,
	                position: 		['center', 'center' ],
	            });
	            event.preventDefault();
	        });

	    }
        // Event clicking tab/register
	    if( $(".yolo-box-login").length > 0 ){
	    	
		    $(".yolo-box-login").find('.yolo-login-action').on('click', '.open-form-toggle', function(event) {
		        event.preventDefault();
		        var yolo_box_login = $(this).parents('form').closest('.yolo-box-login'),
		            text = yolo_box_login.find('.title').text();

		        if( text == Yolo_Login['label_login'] ){
		            yolo_box_login.find('.title').php( Yolo_Login['label_register'] );
		        } else {
		            yolo_box_login.find('.title').php( Yolo_Login['label_login'] );
		        }                

		        yolo_box_login.find('.yolo-login-member-container').toggle();
		        yolo_box_login.find('.yolo-register-member-container').toggle();
		    });
		    
	    }

	});

})(jQuery);