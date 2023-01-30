/*!
 * Variations Plugin Theme
 */

// ================================================================
// WooCommerce Variation Change
// ================================================================

!(function ($) {
    $('.variations_form .variations ul.variable-items-wrapper').each(function (i, el) {

        var select = $(this).prev('select');
        var li = $(this).find('li');
        $(this).on('click', 'li:not(.selected)', function () {
            var value = $(this).data('value');
            li.removeClass('selected');
            select.val(value).trigger('change');
            $(this).addClass('selected');
        });

        $(this).on('click', 'li.selected', function () {
            li.removeClass('selected');
            select.trigger('click');
            select.trigger('focusin');
            select.trigger('touchstart');
        });
    });

    $('.variations_form .variations').each(function (i, el) {
        $(this).on('click', '.reset_variations',function() {
            $('.variations_form .variations').find('li').removeClass('selected');
        });
    });
}(jQuery));