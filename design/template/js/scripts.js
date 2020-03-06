$(document).ready(function() {
    /* SEARCH */
    var typesSerch = {
        'product' : 'Товары',
        'category' : 'Каталог',
        'brand' : 'Бренды',
    };

    $(".js-autocomplete-search").devbridgeAutocomplete({
        serviceUrl:'ajax/search_products.php',
        minChars: 2,
        groupBy: 'type',
        width: 'auto',
        forceFixPosition: false,
        preserveInput: true,
        appendTo: '.js-autocomplete-search-results',
        noCache: false,
        onSelect: function(suggestion){
            //$(".input_search").closest('form').submit();
        },
        formatGroup: function (suggestion, category) {
            return '<div class="search__result-title">' + typesSerch[category] +'</div>';
        },
        formatResult: function(suggestion, currentValue){
            var reEscape = new RegExp('(\\' + ['/', '.', '*', '+', '?', '|', '(', ')', '[', ']', '{', '}', '\\'].join('|\\') + ')', 'g');
            var pattern = '(' + currentValue.replace(reEscape, '\\$1') + ')';

            if(suggestion.type === 'product'){
                return '<div class="item item_inline">' +
                    '\t\t<div class="item__content">' +
                    '\t\t\t<a href="'+suggestion.data.url+'" class="item__image-field">' +
                    '\t\t\t\t '+ (suggestion.data.image ? '<img src="'+suggestion.data.image+'" alt="'+suggestion.value+'" class="item__image">' : '') +
                    '\t\t\t</a>' +
                    '\t\t\t<div class="item__meta">' +
                    (suggestion.data.category ? '\t\t\t\t<div class="meta__item"><a href="'+ suggestion.data.category.url +'">'+ suggestion.data.category.name +'</a></div>' : '') +
                    '\t\t\t</div>' +
                    '\t\t\t<div class="item__title">' +
                    '\t\t\t\t<a href="'+ suggestion.data.url +'">'+ suggestion.value +'</a>' +
                    '\t\t\t</div>' +
                    '\t\t</div>' +

                    '\t\t<div class="item__footer">' +
                    '\t\t\t<div class="item__price">' +
                    '\t\t\t\t<div class="price">' +
                    '\t\t\t\t\t<div class="price__value">'+suggestion.data.price+'</div>' +
                    '\t\t\t\t</div>' +
                    '\t\t\t</div>' +
                    '\t\t</div>' +
                    '</div>';
            } else {
                return '<div class="search__result-item">' +
                    '<a href="'+suggestion.data.url+'" class="search__result-link">' + suggestion.value.replace(new RegExp(pattern, 'gi'), '<strong>$1<\/strong>') +'</a>' +
                    '</div>';
            }

            //return (suggestion.data.image?"<img align=absmiddle src='"+suggestion.data.image+"'> ":'') ;
        }
    });
    /* ! SEARCH */

    /**
     * Slick
     * @see  http://kenwheeler.github.io/slick/
     */
    $('.main-slider').slick({
        slidesToShow: 1,
        fade: true,
        autoplay: true,
        autoplaySpeed: 7000,
        speed: 1000,
    });

    $('.catalog-slider').slick({
        dots: true,
        slidesToShow: 4,
        responsive: [
            {
                breakpoint: 992,
                settings: {
                    slidesToShow: 3,
                }
            },
            {
                breakpoint: 768,
                settings: {
                    slidesToShow: 2,
                }
            },
            {
                breakpoint: 480,
                settings: {
                    slidesToShow: 1,
                }
            }
        ]
    });

    $('.product-gallery').each(function(i){
        var $gallery = $(this),
            $gallerySlider =  $gallery.find('.product-gallery__slider');
        $gallerySlider.addClass('product-gallery__slider_' + i);

        if($gallerySlider.children().length > 1){
            var $galleryThumbs = $('<div class="product-gallery__thumbs product-gallery__thumbs_'+ i +'" />');

            $gallerySlider.children().each(function(){
                $galleryThumbs.append($('<div class="product-gallery__thumbs-item"><span class="product-gallery__thumbs-item-inner"><img src="'+ ($(this).data('thumb') || $(this).find('img').attr('src')) +'" /></span></div>'));
            });

            $gallery.append($galleryThumbs);

            $gallerySlider.slick({
                fade: true,
                infinite: false,
                asNavFor: '.product-gallery__thumbs_' + i,
            });

            $galleryThumbs.slick({
                slidesToShow: 6,
                focusOnSelect: true,
                swipeToSlide: true,
                arrows: false,
                infinite: false,
                asNavFor: '.product-gallery__slider_' + i,
                responsive: [
                    {
                        breakpoint: 992,
                        settings: {
                            slidesToShow: 5,
                        }
                    },
                    {
                        breakpoint: 576,
                        settings: {
                            slidesToShow: 4,
                        }
                    }
                ]
            });
        }
    });

    $('.product__radio, .product__select').on('change', function(){
        var value = $(this).val();

        $('.product-gallery__slider').slick('slickGoTo', $('.product-gallery__item[data-value="'+ value +'"]').closest('.slick-slide').data('slick-index'));
    });

    $('.product__select').on('change', function(){
        var value = $(this).val();
        $(this).next('.product__select-thumbs').find('.variants__thumbs-item').removeClass('is-selected');
        $(this).next('.product__select-thumbs').find('.variants__thumbs-item[data-value="'+ value +'"]').addClass('is-selected');
    });

    $('.product__select-thumbs .variants__thumbs-item').on('click', function(){
        var value = $(this).data('value');
        $(this).closest('.product__select-thumbs').prev('.product__select').val(value).trigger('change');
    });

    /**
     * Sticky-Kit
     * @see  http://leafo.net/sticky-kit/
     */
    $('.header__menu-line').stick_in_parent({
        parent: 'body'
    });

    $('.tabs__nav').stick_in_parent({
        offset_top: $('.header__menu-line').outerHeight() - 1
    });

    /**
     *  Login form Validation
     * @see  http://jqueryvalidation.org/validate/
     */
    $('.js-validation-form-login').each(function() {
        var $form = $(this);
        $form.validate({
            errorPlacement: function(error, element) {
                if ($(element).is(':checkbox') || $(element).is(':radio')) {
                    error.insertAfter($(element).closest('label'));
                } else {
                    error.insertAfter(element);
                }
            }
        });
    });

    /**
     * Окно авторизации пользователя
     * FancyBox 3 - login form
     * @see  http://fancyapps.com/fancybox/3/
     */
    $(document).on('click', '.js-popup-open-login', function(e){
        e.preventDefault();
        $.fancybox.close();
        $.fancybox.open({
            src  : $(this).attr('href') || $(this).data('src'),
            type : $(this).data('type') || 'inline',
            opts : {
                afterShow : function(instance, current) {
                    $(current.$slide).find('.js-validation-form-login').each(function() {
                        $(this).validate({
                            errorPlacement: function(error, element) {
                                if ($(element).is(':checkbox') || $(element).is(':radio')) {
                                    error.insertAfter($(element).closest('label'));
                                } else {
                                    error.insertAfter(element);
                                }
                            },
                            submitHandler: function (form) {
                                $.ajax({
                                    url: "ajax/user_login.php",
                                    method : 'post',
                                    data: {
                                        email    : $('.js-validation-form-login').find('[name=email]').val(),
                                        password : $('.js-validation-form-login').find('[name=password]').val()},
                                    dataType: 'json',
                                    success: function(data){
                                        if (data.response.error) {
                                            $('#login-error').html(data.response.error);
                                        } else {
                                            window.location.href = data.response.redirect_url;
                                        }
                                    },
                                    error: function (request, status, error) {
                                        console.log(error);
                                    }
                                });
                            }
                        });
                    });
                }
            }
        });
    });

	
	
    /**
     *  Recovery pass form Validation
     * @see  http://jqueryvalidation.org/validate/
    */
    $('.js-validation-recovery-form').each(function() {
        var $form = $(this);
        $form.validate({
            errorPlacement: function(error, element) {
                if ($(element).is(':checkbox') || $(element).is(':radio')) {
                    error.insertAfter($(element).closest('label'));
                } else {
                    error.insertAfter(element);
                }
            }
        });
    });

    /**
     * Окно восстановления пароля пользователя
     * FancyBox 3 - login form
     * @see  http://fancyapps.com/fancybox/3/
     */
    $(document).on('click', '.js-popup-open-recovery', function(e){
        e.preventDefault();
        $.fancybox.close();
        $.fancybox.open({
            src  : $(this).attr('href') || $(this).data('src'),
            type : $(this).data('type') || 'inline',
            opts : {
                afterShow : function(instance, current) {
                    $(current.$slide).find('.js-validation-recovery-form').each(function() {
                        $(this).validate({
                            errorPlacement: function(error, element) {
                                if ($(element).is(':checkbox') || $(element).is(':radio')) {
                                    error.insertAfter($(element).closest('label'));
                                } else {
                                    error.insertAfter(element);
                                }
                            },
                            submitHandler: function (form) {
                                $.ajax({
                                    url: "ajax/user_login.php",
                                    method : 'post',
                                    data: {
                                        email: $('.js-validation-recovery-form').find('[name=email]').val(),
                                        password_remind: 1,
                                    },
                                    dataType: 'json',
                                    success: function(data){
                                        if (data.response.error) {
                                            $('#recovery-error').html(data.response.error);
                                        } else {
                                            $('#recovery-error').text('');
                                            $('#recovery-success').html(data.response.success);
                                            $('.js-validation-recovery-form').find('[name=email]').prop('disabled', true);
                                        }
                                    },
                                    error: function (request, status, error) {
                                        console.log(error);
                                    }
                                });
                            }
                        });
                    });
                }
            }
        });
    });





	
	
    /**
     *  Register form Validation
     * @see  http://jqueryvalidation.org/validate/
     */
    $('.js-validation-form-register').each(function() {
        var $form = $(this);
        $form.validate({
            errorPlacement: function(error, element) {
                if ($(element).is(':checkbox') || $(element).is(':radio')) {
                    error.insertAfter($(element).closest('label'));
                } else {
                    error.insertAfter(element);
                }
            }
        });
    });

    /**
     * Окно регистрации
     * FancyBox 3 - register form
     * @see  http://fancyapps.com/fancybox/3/
     */
    $(document).on('click', '.js-popup-open-register', function(e){
        e.preventDefault();
        $.fancybox.close();
        $.fancybox.open({
            src  : $(this).attr('href') || $(this).data('src'),
            type : $(this).data('type') || 'inline',
            opts : {
                afterShow : function(instance, current) {
                    $(current.$slide).find('.js-validation-form-register').each(function() {
                        $(this).validate({
                            errorPlacement: function(error, element) {
                                if ($(element).is(':checkbox') || $(element).is(':radio')) {
                                    error.insertAfter($(element).closest('label'));
                                } else {
                                    error.insertAfter(element);
                                }
                            },
                            submitHandler: function (form) {
                                $.ajax({
                                    url: "ajax/user_register.php",
                                    method : 'post',
                                    data: {
                                        name     : $('.js-validation-form-register').find('[name=name]').val(),
                                        email    : $('.js-validation-form-register').find('[name=email]').val(),
                                        password : $('.js-validation-form-register').find('[name=password]').val()
                                    },
                                    dataType: 'json',
                                    success: function(data){
                                        if (data.response.error) {
                                            $('#login-error').html(data.response.error);
                                        } else {
                                            window.location.href = data.response.redirect_url;
                                        }
                                    },
                                    error: function (request, status, error) {
                                        console.log(error);
                                    }
                                });
                            }
                        });
                    });

                }
            }
        });
    });

    /* USER PAGE */
    /**
     * редактирование пользователя
     */
    $(document).on('click', '.js-popup-open-user-edit', function(e){
        e.preventDefault();
        $.fancybox.close();
        $.fancybox.open({
            src  : $(this).attr('href') || $(this).data('src'),
            type : $(this).data('type') || 'inline',
            opts : {
                afterLoad : function(instance, current) {
                    $('[name=name]').val($('#current_user_name').text());
                    $('[name=phone]').val($('#current_user_phone').text());
                    $('[name=email]').val($('#current_user_email').text());
                    $('[name=address]').val($('#current_user_address').text());
                    $('[name=user_id]').val($('[name=id]').val());
                },
                afterShow : function(instance, current) {
                    $(current.$slide).find('.js-validation-form-user-edit').each(function() {
                        $(this).validate({
                            errorPlacement: function(error, element) {
                                if ($(element).is(':checkbox') || $(element).is(':radio')) {
                                    error.insertAfter($(element).closest('label'));
                                } else {
                                    error.insertAfter(element);
                                }
                            },
                            submitHandler: function (form) {
                                $.ajax({
                                    url: "ajax/user_update.php",
                                    method : 'post',
                                    data: {
                                        user_id       : $.trim($('[name=user_id]').val()),
                                        name     :  $.trim($('[name=name]').val()),
                                        email    :  $.trim($('[name=email]').val()),
                                        phone    :  $.trim($('[name=phone]').val()),
                                        address  :  $.trim($('[name=address]').val()),
                                    },
                                    dataType: 'json',
                                    success: function(){
                                        location.reload();
                                    },
                                    error: function (request, status, error) {
                                        console.log(error);
                                    }
                                });
                            }
                        });
                    });
                }
            }
        });
    });

    /**
     * изменения пароля пользователя
     */
    $(document).on('click', '.js-popup-open-psw-change', function(e){
        e.preventDefault();
        $.fancybox.close();
        $.fancybox.open({
            src  : $(this).attr('href') || $(this).data('src'),
            type : $(this).data('type') || 'inline',
            opts : {
                afterLoad : function(instance, current) {
                    $('[name=user_id]').val($('[name=id]').val());
                },
                afterShow : function(instance, current) {
                    $(current.$slide).find('.js-validation-form-user-password-edit').each(function() {
                        $(this).validate({
                            errorPlacement: function(error, element) {
                                if ($(element).is(':checkbox') || $(element).is(':radio')) {
                                    error.insertAfter($(element).closest('label'));
                                } else {
                                    error.insertAfter(element);
                                }
                            },
                            submitHandler: function (form) {
                                $.ajax({
                                    url: "ajax/user_update.php",
                                    method : 'post',
                                    data: {
                                        user_id       : $.trim($('[name=user_id]').val()),
                                        password     :  $.trim($('[name=password]').val()),

                                    },
                                    dataType: 'json',
                                    success: function(){
                                        location.reload();
                                    },
                                    error: function (request, status, error) {
                                        console.log(error);
                                    }
                                });
                            }
                        });
                    });
                }
            }
        });
    });
    /* ! USER PAGE */

    /**
     * Search
     */
    $('.header__search-btn, .control__btn_search').on('click', function(e){
        noscrollStart();
        $('html').addClass('is-search-open');
        $('.search__input').focus();
    });

    $('.header__search-input').on('input', function(e){
        noscrollStart();
        $('html').addClass('is-search-open');
        $('.search__input').val($(this).val()).focus();
    });

    $('.search__input').on('input', function(e){
        $('.header__search-input').val($(this).val());
    });

    $('.search__clear').on('click', function(e){
        $('html').removeClass('is-search-open');
        noscrollFinish();
    });

    /**
     * Mobile Menu
     */
    $('.control__btn_menu').on('click', function(e){
        noscrollStart();
        $('html').addClass('is-menu-open');
    });

    $('.menu-popup__close, .menu-popup__bg').on('click', function(e){
        $('html').removeClass('is-menu-open');
        noscrollFinish();
    });

    $('.menu__toggle-btn').on('click', function(e){
        e.preventDefault();
        if($(this).closest('.menu__group').length){
            $(this).closest('.menu__group').toggleClass('is-active');
        } else {
            $(this).closest('.menu__item').toggleClass('is-active');
        }
    });

    /**
     * Mobile Nav
     */
    $('.control__btn_nav').on('click', function(e){
        noscrollStart();
        $('html').addClass('is-nav-open');
    });

    $('.nav-popup__close, .nav-popup__bg').on('click', function(e){
        $('html').removeClass('is-nav-open');
        noscrollFinish();
    });

    /**
     * Mobile Filter
     */
    $('.filter-btn').on('click', function(e){
        noscrollStart();
        $('html').addClass('is-filter-open');
    });

    $('.filter-popup__close, .filter-popup__bg').on('click', function(e){
        $('html').removeClass('is-filter-open');
        noscrollFinish();
    });

    /**
     * Tabs
     */
    $(document).on('click','.tabs__nav-link', function(e){
        e.preventDefault();
        var $this = $(this);
        var $tabs = $this.closest('.tabs');
        var hash = this.hash;

        $tabs.find('.tabs__item.is-open').removeClass('is-open');
        $tabs.find('.tabs__item' + hash).addClass('is-open');

        $tabs.find('.tabs__nav-link.is-active').removeClass('is-active');
        $this.addClass('is-active');

        $(document.body).trigger('sticky_kit:recalc');
    });

    /**
     * Target Link
     */
    $('.js-target-link').on('click', function(e){
        e.preventDefault();

        var hash = this.hash,
            $target = $(hash),
            $tabLink = $('.tabs__nav-link[href="' + hash + '"]'),
            offsetTop = $('.header__menu-line').outerHeight();

        if($tabLink.length){
            $tabLink.trigger('click');
        } else if($target.length){
            $('html, body').animate({scrollTop: $target.offset().top - offsetTop}, 500, function (){
                if(history.pushState) {
                    history.pushState(null, null, hash);
                } else {
                    location.hash = hash;
                }
            });
        }
    });

    /**
     * Hash Scroll
     */
    if (window.location.hash) {
        var hash = window.location.hash,
            $target = $(hash),
            $tabLink = $('.tabs__nav-link[href="' + hash + '"]'),
            offsetTop = $('.header__menu-line').outerHeight();

        if($tabLink.length){
            $('.tabs__nav-link[href="' + hash + '"]').trigger('click');
        } else if($target.length){
            $('html, body').scrollTop($target.offset().top - offsetTop);
        }
    }

    /**
     * Rating
     */
    $('.rating__star').on('click', function(e){
        e.preventDefault();

        var self = $(this),
        product_id = self.closest('.rating').find('[name=productRating]').data('product-id'),
        user_id = self.closest('.rating').find('[name=productRating]').data('user-id'),
        rating = self.data('value') ;

        $.ajax({
            url: "ajax/add_rating.php",
            method: 'post',
            data: {
                product_id: product_id,
                user_id: user_id,
                rating: rating
            },
            dataType: 'json',
            success: function(data){

                //если пользователь не зарегистрирован
                if (data.msg.status == 3) {
                    self.closest('.rating').closest('.rating-area').find('.js-rating-msg').text(data.msg.text).show(0).delay(2000).hide(0);
                } else {
                    if(!self.hasClass('is-active')){
                        self.closest('.rating').find('.rating__star.is-active').removeClass('is-active');
                        // self.addClass('is-active');
                        self.closest('.rating').closest('.rating-area').find('.js-rating-msg').text(data.msg.text).show(0).delay(2000).hide(0);
                        self.closest('.rating').find('[data-value='+data.avg_rating+']').addClass('is-active');
                    }
                }
            },
            error: function (request, status, error) {
                console.log(error);
            }
        });
    });

    /**
     * Add Basket
     */
    $('.js-submit-to-cart').on('submit', function (e) {
        e.preventDefault();

        $(this).find(':submit').addClass('is-active');

        var variant, amount = 1, form = $(this);

        if(form.find('.js-add-to-cart-in-product-page').length > 0){
            form.find('.js-add-to-cart-in-product-page').text('В корзине');
        }

        if(form.find('input[name=variant]:checked').length>0) {
            variant = form.find('input[name=variant]:checked').val();
        } else if(form.find('select[name=variant]').length>0) {
            variant = form.find('select[name=variant]').val();
        } else if(form.find('input[name=variant]:hidden').length>0) {
            variant = form.find('input[name=variant]:hidden').val();
        }
        if(form.find('input[name=amount]').length>0) {
            amount = form.find('input[name=amount]').val();
        } else {
            amount =  $('input[name=amount]').val();
        }

		   $.ajax({
			url: "ajax/cart.php",
			data: {variant: variant, amount: amount},
			dataType: 'json',
			success: function(data){
				$('.js-cart-informer').html(data);

				//добавляем айдишник добавленного варианта, используется для вывода разных  кнопок добавления в корзину
				var cart_product_ids_el = $('[name=cart-product-ids]');

				if( cart_product_ids_el.length > 0) {
					var  arrIds;

					arrIds = cart_product_ids_el.val().split(',');
					arrIds.push(variant);
					cart_product_ids_el.val(arrIds.join(','));

			}

		},
		error: function (request, status, error) {
			console.log(error);
		}
        });


        var $this = $(this),
            $basketBtn = $('.control__btn_basket'),
            $img = $this.closest('.item').length ? $this.closest('.item').find('.item__image') : $this.closest('.product').find('.product-gallery__slider .slick-slide.slick-current img'),
            $tempImg = $img.clone().css({
                pointerEvents: 'none',
                position: 'absolute',
                zIndex: 10001,
            });

        $('body').append($tempImg);

        $tempImg.css({
            left: $img.offset().left,
            top: $img.offset().top,
            width: $img.width(),
            height: $img.height(),
        }).animate({
            left: $basketBtn.offset().left,
            top: $basketBtn.offset().top,
            width: $basketBtn.outerWidth(),
            height: $basketBtn.outerHeight(),
        }, 500, function() {
            $tempImg.remove();
        });
    });

    /**
     * Add Review
     */
    $('.add-review__open-btn').on('click', function(e){
        e.preventDefault();
        $('.add-review__header').hide();
        $('.add-review__content').show();

        $(document.body).trigger('sticky_kit:recalc');
    });

    /**
     * More Reviews
     */
    $('.reviews__more-btn').on('click', function(e){
        e.preventDefault();
        $(this).addClass('is-loading');
    });

    /**
     * Order Delivery
     */
    $('.order__delivery-type-input').on('change', function(e){
        $('.order__delivery-type-section').removeClass('is-open');
        $(this).closest('.order__delivery-type-section').addClass('is-open');
    });

    /**
     * History
     */
    $('.history__item-header').on('click', function(e){
        e.preventDefault();
        $(this).closest('.history__item').toggleClass('is-open');
    });

    /**
     * Payment Type
     */
    $('.js-payment-type-change-btn').on('click', function(e){
        $('.js-payment-type-list').show();
    });

    $('.js-payment-type-radio').on('change', function(e){
        $('.js-payment-type-text').text($(this).val());
        $('.js-payment-type-list').hide();
    });
});

/**
 * Русификатор Form Validation
 */
jQuery.extend(jQuery.validator.messages, {
    required: "Обязательное поле",
    remote: "Исправьте это поле",
    email: "Некорректный e-mail",
    url: "Некорректный url",
    date: "Некорректная дата",
    dateISO: "Некорректная дата (ISO)",
    number: "Некорректное число",
    digits: "Cимволы 0-9",
    creditcard: "Некорректный номер карты",
    equalTo: "Не совпадает с предыдущим значением",
    accept: "Недопустимое расширение",
    maxlength: jQuery.validator.format("Максимум {0} символов"),
    minlength: jQuery.validator.format("Минимум {0} символов"),
    rangelength: jQuery.validator.format("Минимум {0} и максимумт {1} символов"),
    range: jQuery.validator.format("Допустимо знаечение между {0} и {1}"),
    max: jQuery.validator.format("Допустимо значение меньше или равное {0}"),
    min: jQuery.validator.format("Допустимо значение больше или равное {0}")
});

$.extend(true, $.fancybox.defaults, {
    touch: false,
    autoFocus: false,
});

/**
 * Mobile Scroll Prevent
 */
var noscrollY = 0;

function noscrollStart(){
    noscrollY = $(document).scrollTop();
    $('body').css('top', - noscrollY + 'px');
    $('html').addClass('is-noscroll');
}

function noscrollFinish(){
    $('html').removeClass('is-noscroll');
    $(document).scrollTop(noscrollY);
    $('body').css('top', 'auto');
}

//---иконки категорий, конертируем в правильную кодировку
$( ".cat-icon" ).each(function() {
    $(this).parent().html( '<i data-icomoon="&#x' + parseInt($(this).val(), 10).toString(16) + ';"></i>');
});

//----------------------------------ORDER PAGE------------------------------------------
$(document).ready(function() {
    $('input[name=payment_method_id]').change(function(){
        $('.change-payment-type-form').submit();
    });
});

//----------------------------------PRODUCT PAGE----------------------------------------
$(document).on('change', '.js-change-variant', function(){
    $('.price_lg').empty();

    /**
     * получаем айдишники вариантов товаров в корзине
     */
    var cart_product_ids = $('[name=cart-product-ids]').val().split(',');
    var price, compare_price, sku;
    var currency = $('input[name=currency]').val();

    //если варианты товара выводятся списком
    if ($(this).is('select')) {
        var selected = $(this).find('option:selected');

        console.log(selected.data('variant-infinity'));

        sku = selected.data('sku');
        price = selected.data('price');
        compare_price = selected.data('compare-price');

        renderPrices(price, compare_price, currency, sku);
        renderCartButton(cart_product_ids,selected.data('variant-id'), selected.data('variant-infinity'), selected.data('variant-stock'))
    }

    //если варианты товара выводятся радиокнопками
    if ($(this).is('input')) {
        var checked = $(this).filter(':checked');

        sku = checked.data('sku');
        price = checked.data('price');
        compare_price = checked.data('compare-price');

        renderPrices(price, compare_price, currency, sku);
        renderCartButton(cart_product_ids,$(this).data('variant-id'), $(this).data('variant-infinity'), $(this).data('variant-stock'))
    }
});

/**
 * Меняем кнопку добавления корзину в зависимости от ситуаций
 * 1. Товаров бесконечность, значить выводим Под Заказ
 * 2. Если выбранный вариант товара уже находится в корзине, то выводим сообщение в корзине
 * @param variant_id
 * @param variant_infinity
 * @param variant_stock
 */
function renderCartButton(cart_product_ids,variant_id, variant_infinity, variant_stock) {

    var btn_area = $('.js-cart_button-render-area');

    if (variant_stock == 0) {
        btn_area.html('<button disabled type="submit" class="basket-btn btn btn-warning " > <span class="basket-btn__text ">Нет в наличии</span></button>');
    }  else  {

        var btn_name = '';
        var is_active = '';

        if (variant_infinity == 1) {
            btn_name = 'Под Заказ';
        }  else {
            btn_name= 'Добавить в корзину';
        }


        if ( cart_product_ids.indexOf(variant_id.toString()) >= 0 ) {
            btn_name = 'В корзине';
            is_active = 'is-active';
        }

        btn_area.html(
            ' <button type="submit" class="basket-btn btn btn-warning ' + is_active + '" data-alt-text="В корзине">\n' +
            ' <i class="fal fa-shopping-cart"></i>\n' +
            ' <span class="basket-btn__text js-add-to-cart-in-product-page">'+ btn_name +'</span>\n' +
            ' </button>'
        );

    }
}

function renderPrices(price, compare_price, currency, sku) {
    if (compare_price !== undefined) {
        $('.price_lg').html("<div class='price__old'>" + compare_price +' ' + currency + "</div><div class='price__discount'>" + (compare_price - price) + currency + "</div>");
    }
    $('.price_lg').append("<div class='price__value'>" +price+ ' ' + currency + "</div>");
    $('.sku').text('Арт. ' + sku);
}
//----------------------------------/PRODUCT PAGE------------------------------------------



/**
 * Add Favorite
 */
$(document).on('click', '.js-add-favorites', function(event) {
    event.preventDefault();
    /* Act on the event */
    var product_id = $(this).data('product-id'),
        $this = $(this);
    $.ajax({
        url: 'ajax/favorites.php',
        data: { product_id: product_id, action: ($this.hasClass('is-active') ? 'remove' : 'add')},
        dataType: 'json',
        cache: false,
        success: function(data) {


            if($this.hasClass('is-active')) {
                $('.is-active.js-favorites-'+product_id).removeClass('is-active');
                $this.removeClass('is-active');
            } else {
                $('.js-favorites-'+product_id).addClass('is-active');
            }


            $('.js-favorites-count').html(data.count);
        }
    });
});


//----------------------------------CART PAGE----------------------------------------

$('.js-validation-cart-form').each(function() {
    var $form = $(this);
    $form.validate({
        errorPlacement: function(error, element) {
            if ($(element).is(':checkbox') || $(element).is(':radio')) {
                error.insertAfter($(element).closest('label'));
            } else {
                error.insertAfter(element);
            }
        }
    });
});


/**
 * Корзина
 * FancyBox 3 - register form
 * @see  http://fancyapps.com/fancybox/3/
 */
// $(document).on('click', '.js-validation-cart-form', function(e){
//     e.preventDefault();
//     $(current.$slide).find('.js-validation-cart-form').each(function() {
//         $(this).validate({
//             errorPlacement: function(error, element) {
//                 if ($(element).is(':checkbox') || $(element).is(':radio')) {
//                     error.insertAfter($(element).closest('label'));
//                 } else {
//                     error.insertAfter(element);
//                 }
//             },
//             submitHandler: function (form) {
//                 // form.submit();
//             }
//         });
//     });
//
// });





$(document).ready(function () {
    $(document).on('click', '[name=delivery_id]' , function () {

        $.ajax({
            url: "ajax/delivery_discount.php",
            method: 'post',
            data: {
                delivery_id: $(this).val(),
                name    : $('#orderName').val(),
                email   : $('#orderEmail').val(),
                phone   : $('#orderPhone').val(),
                address : $('[name=address]').val(),
                comment : $('#order_comment').val(),
            },
            dataType: 'json',
            success: function () {


                location.reload();

            },
            error: function (request, status, error) {
                console.log(error);
            }
        });
    });
});


//---------------------------------------FEEDBACK PAGE ------------------------------
$('.js-feedback_form').each(function() {
    var $form = $(this);
    $form.validate({
        errorPlacement: function(error, element) {
            if ($(element).is(':checkbox') || $(element).is(':radio')) {
                error.insertAfter($(element).closest('label'));
            } else {
                error.insertAfter(element);
            }
        }
    });
});


function addAjaxFeedback(data, $btn) {

    $.ajax({
        url: "ajax/add_feedback.php",
        method : 'post',
        data: data,
        dataType: 'json',
        success: function(result){
            $btn.attr("disabled", true);

            if (result.success === true) {
                $btn.text('Сообщение отправлено');
            } else {
                $btn.text('Произошла ошибка отправки');
            }

        },
        error: function (request, status, error) {
            console.log(error);
        }
    });

}
















