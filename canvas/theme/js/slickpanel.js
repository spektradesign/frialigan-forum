$(document).ready(function(){
_st.skinpanel = function(){

    $('#tp-form input[type=checkbox]').each(function(){
        //checkbox value toggle
        var _this = this;
        var states = $(_this).data('togglestates');
        var updateVal = function(){
            if (states) {
            if (_this.checked)   { _this.value = states[1] }
                         else   { _this.value = states[0] }
            }
            else {
            if (_this.checked)   { _this.value = "1" }
                         else   { _this.value = "0" }
            }
        }
        updateVal();//initial update
        $(this).on('change', updateVal);
    });
    
    var liveInput_color = function(elm){
        var
        $this = $(elm),
        tochange = $this.data('colorchange'),
        transparency = $this.data('transparency'),
        originalValue = elm.value;

        defaultval = $this.data('default');

        //instantiate spectrum
        $this.spectrum({
            preferredFormat: "rgb",
            showInput: true,
            showInitial: true,
            showButtons: false
        });

        //enable transparency
        if (transparency) {
            $this.spectrum('option', 'showAlpha', true);
        }

        //set value
        if (originalValue) {    $this.spectrum("set", originalValue) }
        else if (defaultval) {  $this.spectrum("set", defaultval) }

        if (typeof tochange[0] == 'object') {
            //fetch value from targets
            if (!originalValue && !defaultval) {
                tochange.forEach(function(item){
                    $this.spectrum("set", $(item[0]).css(item[1]));
                })
            }
            
            //mutlitple selectors/properties
            $this.on('move.spectrum change.spectrum', function(e,color){

                tochange.forEach(function(item){
                    $(item[0]).css(item[1], color.toRgbString())
                })
            })
        }
        else {
            //fetch value from targets
            if (!originalValue && !defaultval) {
                $this.spectrum("set", $(tochange[0]).css(tochange[1]));
            }
            $this.on('move.spectrum change.spectrum', function(e,color){
                $(tochange[0]).css(tochange[1], color.toRgbString())
            })
        }
        
        $this.on('change.spectrum', function(e,color){
            $this.val(color.toRgbString())
        })
    }
    
    var liveInput_manipulate = function(elm){
        var $this = $(elm),
        arr = $this.data('manipulate'),
        targetselector = arr[0],
        defaultval = $this.data('default'),
        target = $(targetselector),
        type = arr[1],
        suffix = arr[3] || '';

        $this.attr('placeholder', defaultval)

        if (type == 'css') {
            var prop = arr[2];

            $this.on('change input', function(){
                if (this.value) {
                    $(targetselector).css(prop, this.value + '' + suffix)
                }
                else {
                    $(targetselector).css(prop, defaultval + '' + suffix)
                }
            })
        }

        else if (type == 'text') {
            $this.on('change keyup', function(){
                if (this.value) {
                    target.text(this.value + '' + suffix)
                }
                else {
                    target.text(defaultval + '' + suffix)
                }
            })
        }

        else if (type == 'bgimg') {
            $this.on('change keyup', function(){
                if (this.value) {
                    if (this.value == 'none') {
                        target.css('background-image','none')
                    }
                    else {
                        target.show()
                        target.css('background-image','url('+_st.themePath+'/images/backgrounds/'+this.value+')')
                    }
                }
                else {
                    if (defaultval == 'none') {
                        target.css('background-image','none')
                    }
                    else {
                        target.show()
                        target.css('background-image','url('+_st.themePath+'/images/backgrounds/'+defaultval+')')
                    }
                }
            })
        }

        else if (type == 'containerclass') {
            var classtoremove = '';
            $this.find('option').each(function(){
                classtoremove += 'layout-'+this.value+' ';
            });
            $this.on('change keyup', function(){
                $('.container, #wrap, .breadcrumbs-bar, .nav-breadcrumbs').css('max-width','');
                if (this.value) {
                    target.removeClass(classtoremove).addClass('layout-'+this.value)
                }
                else {
                    target.removeClass(classtoremove).addClass(defaultval)
                }
                _st.sticky.reset();
            })
        }
        else if (type == 'class') {
            var classNames = '';
            $this.find('option').each(function(){
                classNames += this.value+' ';
            });

            $this.on('change keyup', function(){
                target.removeClass(classNames).addClass(this.value);
            })
        }
        
        else if (type == 'navbar_pos') {

            $this.on('change keyup', function(){
                if (this.value == 'nb-h') {
                    target.insertBefore('.main-header');
                    $('body').removeClass('h-nb').addClass('nb-h');
                    _st.sticky.reset();
                }
                else if (this.value == 'h-nb') {
                    target.insertAfter('.main-header');
                    $('body').removeClass('nb-h').addClass('h-nb');
                    _st.sticky.reset();
                }
            })
        }
    }

    var liveInput = function(elm){
        if ($(elm).attr('data-colorchange')) {
            liveInput_color(elm);
        } else {
            liveInput_manipulate(elm);
        }
    }
    $('[data-manipulate], input[data-colorchange]').each(function(){
        liveInput(this);
    })

    $('input[data-toggleclass]').each(function(){
        var
        $this = $(this),
        tochange = $this.data('toggleclass'),
        target = $(tochange[0]),
        className = tochange[1];

        $this.on('change', function(){
            if (this.checked) {
                target.addClass(className);
            }
            else {
                target.removeClass(className);
            }
        })

    })
    
    $('input[name=ST_container__width]').on('change', function(){
        _st.sticky.reset();
    });
    
    
    //Logo type switcher
    var lts_container = $('.logotype-container');
    var lts_text = $('#logotype__text');
    var lts_image = $('#logotype__image');
    var lts_logo = $('.logo h1');
    
    if ($('select[name="ST_logo__type"]').val() == 'image') {
        lts_image.show();
    } else {
        lts_text.show();
    }
    
    $('select[name="ST_logo__type"]').on('change input', function(){
        if (this.value == 'text') {
            lts_image.hide();
            lts_text.fadeIn();
            var logotext_input = $('[name="ST_logo__text"]');
            var logotext = (logotext_input.val()) ? logotext_input.val() : logotext_input.attr('data-default');
            lts_logo.html(logotext);
            
        } else {
            lts_text.hide()
            lts_image.fadeIn();
            var logoimage_input = $('[name="ST_logo__image_filename"]');
            var logoimage_width_input = $('[name="ST_logo__image_width"]');
            var image = (logoimage_input.val()) ? logoimage_input.val() : logoimage_input.attr('data-default');
            var maxwidth = (logoimage_width_input.val()) ? logoimage_width_input.val() : logoimage_width_input.attr('data-default');
            
            lts_logo.html('<img src="'+_st.themePath+'/images/'+image+'" style="max-width:'+maxwidth+'px" />');
        }
    })

};

});