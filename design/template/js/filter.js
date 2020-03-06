$(document).ready(function(){
    /**
    * Filter
    */
    var $tags = $('.filter__tags'),
    $tags_content = $('.filter__tags-content');



    $(document).on('change','.js-filter-checkbox', function(e){
        var $input = $(this),
        id = $input.attr('id'),
        text = $input.next('.form-check__text').find('.filter__check-text').text();

        if($input.is(':checked')){
            createTag('checkbox', id, text);
        } else {
            removeTag(id);
        }

        updateCatalog();
    });

    $(document).on('change','.js-filter-select', function(e){
        var $input = $(this),
        id = $input.attr('id'),
        text = $input.val();
        
        if($input.val()){
            createTag('select', id, text);
        } else {
            removeTag(id);
        }

        updateCatalog();
    });

    $('.js-filter-range').each(function(){
        var $range = $(this),
        $range_slider = $range.find('.js-filter-range-slider'),
        $range_start = $range.find('.js-filter-range-start'),
        $range_end = $range.find('.js-filter-range-end');

        var range_min_value = $range_slider.data('range-min') || 0,
        range_max_value = $range_slider.data('range-max') || 100,
        range_values = $range_slider.data('range-values') || [range_min_value, range_max_value],
        range_step = $range_slider.data('range-step') || 1;


        $range_slider.slider({
            range: true,
            min: range_min_value,
            max: range_max_value,
            values: range_values,
            step: range_step,
            slide: function(event, ui) {
                $range_start.val(numberFormat(ui.values[0]));
                $range_end.val(numberFormat(ui.values[1]));
            },
            stop: function(){
                filterRangeChange($range);
                updateCatalog();
            }
        });

        $range_start.val(numberFormat($range_slider.slider('values', 0)));
        $range_end.val(numberFormat($range_slider.slider('values', 1)));

        $range_start.change(function() {
            var start_value = numberFormatClear($range_start.val()),
            end_value = numberFormatClear($range_end.val());

            if(start_value > end_value)
                start_value = end_value;

            if(start_value < range_min_value)
                start_value = range_min_value;

            $range_slider.slider('values', 0, start_value);
            $range_start.val(numberFormat($range_slider.slider('values', 0)));

            filterRangeChange($range);
            updateCatalog();
        }).keydown(function(e) {
            if (e.which == 13)
                $(this).blur();
        });

        $range_end.change(function() {
            var start_value = numberFormatClear($range_start.val()),
            end_value = numberFormatClear($range_end.val());

            if(end_value < start_value)
                end_value = start_value;

            if(end_value > range_max_value)
                end_value = range_max_value;

            $range_slider.slider('values', 1, end_value);
            $range_end.val(numberFormat($range_slider.slider('values', 1)));

            filterRangeChange($range);
            updateCatalog();
        }).keydown(function(e) {
            if (e.which == 13)
                $(this).blur();
        });
    });

    $(document).on('click', '.js-tags-check-label', function(e){
        $('.js-filter-checkbox#'+ $(this).attr('for')).prop('checked', false).trigger('change');
    });

    $(document).on('click', '.js-tags-select-label', function(e){
        $('.js-filter-select#' + $(this).attr('for')).val('').trigger('change');
    });

    $(document).on('click', '.js-tags-range-label', function(e){
        filterRangeReset($('.js-filter-range#' + $(this).attr('for')));
        
        updateCatalog();
    });

    $('.filter__form').on('reset', function(){
        var $form = $(this);
        setTimeout(function(){
            $('.filter__tags-content').empty();

            $('.js-filter-range').each(function(){
                filterRangeReset($(this));
            });

            updateCatalog();
        });
    });

    $(document).on('click','.filter__section-title', function(e){
        $(this).closest('.filter__section').toggleClass('is-open');
    });

    $('.filter__expand-btn').on('click', function(e){
        e.preventDefault();
        var $this = $(this),
        text = $this.text(),
        altText = $this.data('alt-text');

        $this.data('alt-text', text).text(altText);

        $(this).closest('.filter__section-content').find('.is-hidden').toggleClass('is-visible');
    });

    $('.js-integar-input').on('keypress', function (e) {
        if (e.which !== 8 && e.which !== 0 && (e.which < 48 || e.which > 57)) {
            return false;
        }
    });

    $('.js-integar-input').on('keyup', function (e) {
        if (e.which !== 37 && e.which !== 39) {
            $(this).val(numberFormat($(this).val()));
        }
    });

    function createTag(type, id, text){
        if($tags_content.find('.filter__tag[for="'+ id +'"]').length) {
            $tags_content.find('.filter__tag[for="'+ id +'"] .filter__tag-text').text(text);
        } else {
            var className = 
            type == 'checkbox' ? 'js-tags-check-label' : 
            type == 'select' ? 'js-tags-select-label' : 
            type == 'range' ? 'js-tags-range-label' : '',
            $tag = $('<span class="filter__tag '+ className +'" for="'+ id +'"><span class="filter__tag-text">'+ text +'</span><span class="filter__tag-remove"><i class="fal fa-times"></i></span></span>');
            $tags_content.append($tag);
        }
    };

    function removeTag(id){
        $tags_content.find('.filter__tag[for='+ id +']').remove();
    }

    function filterRangeChange($range){
        var $range_start = $range.find('.js-filter-range-start'),
        $range_end = $range.find('.js-filter-range-end'),
        id = $range.attr('id'),
        text = 'от ' + $range_start.val() + ' до ' + $range_end.val();

        createTag('range', id, text);
    }

    function filterRangeReset($range){
        var $range_slider = $range.find('.js-filter-range-slider'),
        $range_start = $range.find('.js-filter-range-start'),
        $range_end = $range.find('.js-filter-range-end');

        var range_min_value = $range_slider.data('range-min') || 0,
        range_max_value = $range_slider.data('range-max') || 100,
        range_values = $range_slider.data('range-values') || [range_min_value, range_max_value];

        $range_slider.slider('values', 0, range_values[0]);
        $range_slider.slider('values', 1, range_values[1]);

        $range_start.val(numberFormat($range_slider.slider('values', 0)));
        $range_end.val(numberFormat($range_slider.slider('values', 1)));

        removeTag($range.attr('id'));
    }

    function updateCatalog(){

        filterSubmit();

        if(!$tags_content.find('.filter__tag').length){
            $tags.removeClass('is-visible');
        } else {
            $tags.addClass('is-visible');
        }



        $('.preloader').remove();
        $('body').append($('<div class="preloader" />'));

        setTimeout(function(){
            $('.preloader').remove();
        },1000);
    }

    function numberFormat(str) {
        return str.toString().replace(/(\s)+/g, '').replace(/(\d{1,3})(?=(?:\d{3})+$)/g, '$1 ');
    }

    function numberFormatClear(str) {
        return parseInt(str.replace(/ /g, ''));
    }



    function filterSubmit()
    {
        $('.js-filter').submit();
    }

    function filterSubmitHandler()
    {
        $(document).on('submit', '.js-filter',  function (e) {
            e.preventDefault();

            var form = $(this);
            var form_values = form.serializeArray();

            form_values.forEach(function(v) {
                if (v.name === "max_price" || v.name === "min_price" ) {
                    v.value = v.value.replace(/\s+/g, '');
                }
            });

            var url = form.attr('action') + '?' + $.param(form_values);

            window.history.replaceState(1, '', url);


            $.ajax({
                beforeSend: function() { },
                headers: {'X-PAJAX-Header': true},
                type: 'POST',
                url: url,
                cache: false,
                dataType: 'html',
                success: function(data) {

                    $('[data-ajax-products]').html( $(data).find('[data-ajax-products]').html() );
                    $('[data-ajax-pagination]').html( $(data).find('[data-ajax-pagination]').html() );
                    $('[data-ajax-filter]').html( $(data).find('[data-ajax-filter]').html() );
                },
                fail: function() {
                    window.location = url;
                }
            });

        });
    }

    function sort() {

        $(document).on('click', '.js-sort', function (e) {
            e.preventDefault();

            // убираем активность всем сортировкам
            $('.js-sort').removeClass('is-active');

            var form = $('.js-filter');
            var name  = $(this).data('name');
            var value = $(this).data('value') ;

            // добавляем активность нажатой
            $(this).addClass('is-active');

            // удаляем из формы инпут сортировки если уже добавляли
            form.find('.sort').remove();

            // добавляем в форму инпут сортировки
            $('<input>').attr({
                type: 'hidden',
                value: value,
                name: name,
                class : "sort"
            }).appendTo(form);

            // обновляем каталог
            updateCatalog();
        });
    }

    function sortLimitChange(){

        $(document).on('click', '.js-sort-limit', function (e) {
            e.preventDefault();

            // убираем активность всем сортировкам
            $('.js-sort-limit').removeClass('is-active');

            var form = $('.js-filter');
            var name  = $(this).data('name');
            var value = $(this).data('value') ;

            // добавляем активность нажатой
            $(this).addClass('is-active');

            // удаляем из формы инпут сортировки если уже добавляли
            form.find('.sort-limit').remove();

            // добавляем в форму инпут сортировки
            $('<input>').attr({
                type: 'hidden',
                value: value,
                name: name,
                class : "sort-limit"
            }).appendTo(form);

            // обновляем каталог
            updateCatalog();
        });

    }

    function __init() {
        sort();
        sortLimitChange();
        filterSubmitHandler();
    }

    __init();

});
