 /*!========================================================================
  * Canvas 1.2.0
  * http://slickthemes.co/
  *
  * Copyright Slickthemes 2016
  * =======================================================================*/

_st.utils.debounce = function(fn, delay) {
	var timer = null;
	return function () {
	var context = this, args = arguments;
	clearTimeout(timer);
	timer = setTimeout(function () {
	  fn.apply(context, args);
	}, delay);
	};
}
_st.utils.throttle = function(fn, delay){
	if(typeof fn != 'function'){
		return false;
	}

    var wait = false;
	var d = (!delay) ? 500:delay;
    return function () {
        if (!wait) {
            fn.call();
            wait = true;
            setTimeout(function () {
                wait = false;
            }, d);
        }
    }
}
_st.utils.relPathToAbs = function(sRelPath){
    var nUpLn, sDir = "", sPath = location.pathname.replace(/[^\/]*$/, sRelPath.replace(/(\/|^)(?:\.?\/+)+/g, "$1"));
    for (var nEnd, nStart = 0; nEnd = sPath.indexOf("/../", nStart), nEnd > -1; nStart = nEnd + nUpLn) {
      nUpLn = /^\/(?:\.\.\/)*/.exec(sPath.slice(nEnd))[0].length;
      sDir = (sDir + sPath.substring(nStart, nEnd)).replace(new RegExp("(?:\\\/+[^\\\/]*){0," + ((nUpLn - 1) / 3) + "}$"), "/");
    }
    return sDir + sPath.substr(nStart);
}
_st.utils.htmlEscape = function(str){
	return String(str)
    .replace(/&/g, '&amp;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}
_st.utils.formatNumber = function(num) {
		return num.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,")
		//return num.toLocaleString('en');
}
_st.utils.htmlUnescape = function(str){
	return String(str)
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&amp;/g, '&');
}
_st.utils.youtubeID = function(url) {
	/**
	* JavaScript function to match (and return) the video Id
	* of any valid Youtube Url, given as input string.
	* @author: Stephan Schmitz <eyecatchup@gmail.com>
	* @url: http://stackoverflow.com/a/10315969/624466
	*/
	var p = /^(?:https?:\/\/)?(?:www\.)?(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))((\w|-){11})(?:\S+)?$/;
	return (url.match(p)) ? RegExp.$1 : false;
}

//disable textarea resizing
phpbb.resizeTextArea = function($items, options) {
	return false;
};

_st.version = "1.2.0";

_st.init = function(conf){
	var initStart, initEnd;
	if(window.performance && console.groupCollapsed){
		initStart = window.performance.now();
	}

	//default configuration
	var config = _st.config = {
		stickyheader: true,
		timestamps: true,
		quickscroll: true,
		prettycode: true,
		fastclick: true,
		quickScroll_animFactor: 23,
		quickScroll_CSSAnimFactor: 10
	};
	//import configuration passed as argument
	for(var option in conf){
		if(conf[option] != ''){
			var val = (conf[option] == '1') ? true:val;
					val = (conf[option] == '0') ? false:val;

			config[option] = val;
		}
	}


	var
	$html       			= $('html'),
	$body       			= $('body'),
	$page_body 				= $('#page-body'),
	$window     			= $(window),
	$wrapper    			= $('#wrap'),
	$darkenwrapper  	= $('#darkenwrapper'),
	$loadingIndicator = $('#loading_indicator'),
	lang      				= document.documentElement.lang,
	contentDirection		= (document.dir == 'ltr') ? 'right':'left';
	deviceWidth 			= document.documentElement.clientWidth || window.innerWidth;

	$wrapper._offset    = $wrapper.offset();
	$wrapper._width     = $wrapper.outerWidth();

	phpbb.alertTime = 150;

	var $loadingIndicator;

	_st.featureClass = function(feature, state){
		var
		toAdd 		= (state) ? '-enabled' : '-disabled',
		toRemove	= (state) ? '-disabled' : '-enabled';

		$html.removeClass(feature+toRemove).addClass(feature+toAdd)
	}


	_st.grayscale = (function(){

		var grayscale = function(image){
			var imgObj, canvas, canvasContext, imgW, imgH, imgPixels;

			imgObj = image[0];
			canvas = document.createElement('canvas');
			canvasContext = canvas.getContext('2d');

			imgW = imgObj.naturalWidth;
			imgH = imgObj.naturalHeight;

			canvas.width = imgW;
			canvas.height = imgH;

			canvasContext.drawImage(imgObj, 0, 0);

			imgPixels = canvasContext.getImageData(0, 0, imgW, imgH);


			for(var y = 0; y < imgPixels.height; y++){
				 for(var x = 0; x < imgPixels.width; x++){
						var i = (y * 4) * imgPixels.width + x * 4;
						var avg = (imgPixels.data[i] + imgPixels.data[i + 1] + imgPixels.data[i + 2]) / 3;
						imgPixels.data[i] = avg;
						imgPixels.data[i + 1] = avg;
						imgPixels.data[i + 2] = avg;
				 }
			}

			canvasContext.putImageData(imgPixels, 0, 0, 0, 0, imgPixels.width, imgPixels.height);

			image.attr('src', canvas.toDataURL());
		}

		//run if css filters aren't supported
		if(!Modernizr.cssfilters && _st.config.grayScaleIcons){
			$('[class*=_read]').each(function(){
				var forumIMG = $(this).find('.forum-image img');
				if (forumIMG.length) {
					try { grayscale(forumIMG) }
					catch(e) {}
				}
			});
		}

		return grayscale;

	})();

  _st.ui = function(){

    if (window.devicePixelRatio && devicePixelRatio >= 2) {
			//support for half-pixel borders
      document.querySelector('html').classList.add('hairlines');
    }

    //Prevent dropdown from hiding if dropdown header is clicked (not a link inside it)
    $('.dropdown-header, .dropdown-page-jump').click(function(e) {
      var target = $(e.target);
      if (target.attr('href')==undefined && target.parent().attr('href')==undefined) {
          return false;
      }
    });

    //focus notification-list when dropdown is shown
    //Allows mouse-in and scroll
    $('.user-view-notifications').on('show.bs.dropdown', function(){
      setTimeout(function(){
        $('.notifications-dropdown').hide().show();//reflow
        $('.notifications-list').focus();
      }, 100);
    });

    //Progress bar animation
    $('.progress-bar').each(function(){
      var $this = $(this);
      setTimeout(function(){
        $this.css('width',$this.data('progress'));
      },1000);
    })

    //online list total count
    var olt = $('.online-list-total');
	var olt_text = olt.text();
    var olt_count = Number(olt.find('strong').first().text());
    if (typeof olt_count == 'number') {
      olt.html('<span class="formatted-numcounter">'+olt_count+'</span>').css('display','inline-block');
	  olt.attr('title', olt_text);
	  if (olt_count == 0) {
		//olt.addClass('zero');
		olt.hide();
	  }
    }
	else {
		olt.parents('.sidebar-widget').find('.widget-content').prepend('<div class="wol-total">'+olt.html()+'</div>');
	}

		$('.simplepage__return').on('click', function(){
			history.back();
			return false;
		})

		$('.rank-legend').each(function(){
			var
			$this = $(this),
			legend = {};
			$links = $this.find('a');

			$links.each(function(){
				legend[this.innerHTML] = [this.style.color, this.href];
			})
			$this.html('');
			for(var rank in legend){
				$this.append('<a href="'+legend[rank][1]+'"><em style="background-color:'+legend[rank][0]+'"></em><span>'+rank+'</span></a>')
			}
			$this.show();
		});

		$('#review').on('click', function(){
			var review = document.getElementById('topicreview');
			review.style.width = 0;
			setTimeout(function(){
				review.style.width = '';
			},10)
		})

		//dropdown click-close
		$('.quicklogin-dropdown').on('click', function(e){
			console.log(e.target)
			if( e.target.tagName.toLowerCase() != "a" && e.target.type != 'submit' ) {
				e.stopPropagation();
			}
		})

		//disable fastclick on reset buttons
		$('input[type=reset]').each(function(){
			$(this).addClass('needsclick');
		})

		//Permissions block
		$('.forum-permissions__rule').each(function(){
			for (var rule in _st.fpermissions) {
				if (this.innerHTML == _st.fpermissions[rule]) {
					$(this).addClass('can');
				}
			}
		});

		//Search placeholder
		if ($('.quicksearch').length) {
			var
			quickSearch = $('.quicksearch fieldset'),
			qsInput = quickSearch.find('input[name=keywords]'),
			qsph = $('.quicksearch__placeholder'),
			qsPlaceholder =  qsph.html();

			if (qsInput[0].value != undefined && qsInput[0].value != '') {
				qsph.text('');
			}

			qsInput.on('input', function(){
				if (this.value != undefined && this.value != '') {
					qsph.text('');
				}
				else {
					qsph.text(qsPlaceholder)
				}
			})

			qsInput.on('focus', function(){
				quickSearch.addClass('quicksearch--focus');
			}).on('blur', function(){
				quickSearch.removeClass('quicksearch--focus');
			})
		}


		//Convert display options submit button
		$('.display-options input[type=submit]').each(function(){
			$this = $(this);
			$this.after('<button type="submit" name="'+$this.attr('name')+'" value="'+$this.attr('value')+'" class="btn btn-link"><i class="fi fi-arrow-'+contentDirection+'"></i></button>')
			$this.remove();
		})

		//post display
		$('.display_post').on('click', function(){
			$(this).parents('.post').removeClass('deleted');
		})

		//topic solved
		$('.post').each(function(){
			var $this = $(this);
			if($this.find('.icon_solved_post').length) {
				$this.addClass('topicsolved-answer');
				$this.find('.author').prepend('<span class="topicsolved-answer__icon" title="'+_st.lang.topic_solved+'"><i class="imageset icon_solved_head"></i></span>')
			} else if (_st.TOPIC_SOLVED_TITLE && $this.find('h3 a span').text() == _st.TOPIC_SOLVED_TITLE){
				$this.addClass('topicsolved-answer');
				$this.find('.author').prepend('<span class="topicsolved-answer__icon" title="'+_st.lang.topic_solved+'" style="color:#'+_st.TOPIC_SOLVED_STYLE+'">'+_st.TOPIC_SOLVED_TITLE+' &nbsp;</span>')
			};
		})
  }


	_st.totalTopicsCounter = function(){
		$('.category-wrapper').each(function(){
            var $this = $(this);
            var $this_title = $this.find('.category-title');
            var totalTopics = 0;
            $this.find('.item-stat--topics .item-stat__count').each(function(){
                totalTopics += Number($(this).text());
            })
            if (totalTopics>0) {
                //Decice Singular or plural for topic
                var label = (totalTopics==1) ? _st.lang.topic : _st.lang.topics;

                $this_title.after('<span class="totaltopics formatted-numcounter">&mdash; '+totalTopics+' '+label+'</span>');
            }
        });
	}


	_st.postImages = function(){
		var fn = function(){
			//make resized images clickable
			$('.postimage').each(function(){
				if(this.complete){
					if(this.width < this.naturalWidth){
						this.setAttribute('onclick','location.href=this.src');
					}
				}
				else {
					$(this).on('load', function(){
						if(this.width < this.naturalWidth){
							this.setAttribute('onclick','location.href=this.src');
						}
					})
				}
			});
		}
		fn();
		//re-check on viewport size change
		$window.on('resize.postimages', _st.utils.throttle(fn, 1000)); //every 1 secon on resize
		$window.on('orientationchange', fn);

	}


	_st.marklist = (function(){
		var fn = {};


		//highlight row when marked
		$('.item-mark input').on('change', function(){
			var row = $(this).parents('.st-itemlist__item');

			if (row.length) {
				if (this.checked) 	{ row.addClass('marked') }
				else 				{ row.removeClass('marked') }
			}

		});
		$('.item-col-mark input').on('change', function(){
			var row = $(this).parents('.itemlist__item');

			if (row.length) {
				if (this.checked) 	{ row.addClass('marked') }
				else 				{ row.removeClass('marked') }
			}

		});

		$('.post input[type=checkbox]').on('change', function(){
			var post = $(this).parents('.post');

			if (post.length) {
				if (this.checked) 	{ post.addClass('marked') }
				else 				{ post.removeClass('marked') }
			}
		})

		fn.checkMarked = function(){
			$('.item-mark input').each(function(){
				var row = $(this).parents('.st-itemlist__item');
				if (row.length && this.checked) {
					row.addClass('marked')
				}
				else if (row.length) {
					row.removeClass('marked')
				}
			})
			$('.item-col-mark input').each(function(){
				var row = $(this).parents('.itemlist__item');
				if (row.length && this.checked) {
					row.addClass('marked')
				}
				else if (row.length) {
					row.removeClass('marked')
				}
			})
		};

		//check on load
		fn.checkMarked();

		fn.markAll = function(id, s, val){
			marklist('ucp', 't', true);
			marklist('ucp', 'f', true);
			$('#ucp input[type=checkbox][name]').trigger('change');
			return false;
		}

		fn.mark = function(id, s, val){

			if (typeof s == 'object') {
				s.forEach(function(i){
					marklist(id, i, val);
				});
			}
			else {
				marklist(id, s, val);
			}

			$('#'+id+' input[type=checkbox][name]').trigger('change');
		}

		fn.unmarkAll = function(id, s, val){
			marklist('ucp', 't', false);
			marklist('ucp', 'f', false);
			$('#ucp input[type=checkbox][name]').trigger('change');
			return false;
		}

		//attach functions
		$('.marklist-markall').on('click', function(e){
			var data = $(this).data('marklist');
			fn.mark(data[0], data[1], true);
			e.preventDefault();
		})
		$('.marklist-unmarkall').on('click', function(e){
			var data = $(this).data('marklist');
			fn.mark(data[0], data[1], false);
			e.preventDefault();
		})

		//Click rows to mark
		$('.st-itemlist__item').on('click', function(e){
			var row = $(this);
			var checkbox = row.find('.item-mark input');
			if (e.target.href == undefined && e.target != checkbox[0] && checkbox.length && e.target.className != 'st-fancyCheckbox' && !checkbox[0].disabled) {
				if (checkbox[0].checked) {
					checkbox[0].checked = false;
				}
				else {
					checkbox[0].checked = true;
				}
				checkbox.trigger('change');
			}
		})
		$('.itemlist__item').on('click', function(e){
			var row = $(this);
			var checkbox = row.find('.item-col-mark input');
			if (e.target.href == undefined && e.target != checkbox[0] && checkbox.length && e.target.className != 'st-fancyCheckbox' && !checkbox[0].disabled) {
				if (checkbox[0].checked) {
					checkbox[0].checked = false;
				}
				else {
					checkbox[0].checked = true;
				}
				checkbox.trigger('change');
			}
		})

		return fn;
	})();

	_st.cleanString = function(){
		var cleanStrings = $('.st__cleanstring');
		if (cleanStrings.length) {
			cleanStrings.each(function(){
				var text = $(this).text().replace(/\:/g,'');
				text = text.replace(/\./g,'');
				//text = text.replace(' ','')
				$(this).text(text);
			})
		}
	}

  _st.breadcrumbs = function(){
		//prev link
		var check = function(){
			var prev_crumb = (phpbb.SCRIPT_NAME == 'viewforum') ? $('.nav-breadcrumbs .crumb:nth-last-child(2)') : $('.nav-breadcrumbs .crumb:last-child');
			prev_crumb = (phpbb.SCRIPT_NAME == 'index') ? $('.nav-breadcrumbs .crumb:first-child') : prev_crumb;
			prev_crumb.addClass('crumb--previous');
		}
		check();
		$window.on('orientationchange.breadcrumbs', check);
  }

  _st.quicklogin = function(){
    $('.quicklogin').on('click', '[data-toggle=quicklogin]',function (e) {
        e.preventDefault();
        var $this = $(this);
        $this.parent('.quicklogin').toggleClass('open')
    });
  }

  //Make header sticky based on its distance from window's top-edge
  _st.sticky = (function(){
      var
      fn = {},
      stickyContainer,
      allowSticky = true,
      item = $('.utility-bar');

		if (item.length) {

	      item.wrap('<div class="stickyContainer"></div>');
	      stickyContainer = $('.stickyContainer');
	      coveredArea = item.outerHeight(true);
	      item.originalOffset = item.offset();
	      item._offset = stickyContainer.offset();
	      item._height = item.outerHeight();

	      if (Modernizr.touch && item._offset.top != 0) {
	          allowSticky = false;
	      }

	      fn.checkzoom = function(){
	          if (window.innerWidth == deviceWidth) {
	              _st.sticky.reset();
	          }
	          else {
	              _st.sticky.unstick();
	          }
	      }

	      fn.stick = function(){
	          $html.addClass('stickyheader');
	          item.addClass('stuck');
	          //container
	          item.css({
	              left: $wrapper.offset().left,
	              width: $wrapper.width()
	          });

	          //fill empty space
	          stickyContainer.css('height', coveredArea);
	      }

	      fn.unstick = function(){
	          $html.removeClass('stickyheader');
	          item.removeClass('stuck');
	          //container
	          item.css({
	              left: '',
	              width: ''
	          });

	          //remove extra space
	          stickyContainer.css('height', '');
	      }

	      fn.check = function(){
			var scrollY = window.scrollY || document.documentElement.scrollTop;
	          if ((item._offset.top - scrollY)<=0 && window.innerHeight > 400) {
	              if (!item.hasClass('stuck')) {
	                  fn.stick()
	              }
	          }
	          else {
	              if (item.hasClass('stuck')) {
	                  fn.unstick()
	              }
	          }
	      }

	      //for layout changes
	      fn.reset = function(){
	          fn.unstick();
	          coveredArea = item.outerHeight(true);
	          item.originalOffset = item.offset();
	          item._offset = stickyContainer.offset();
	          item._height = item.outerHeight();
			if (config.stickyheader) {
				if (!Modernizr.touch) {
					fn.check();
				}
				else if(item.offset().top == 0 && window.innerWidth == document.documentElement.clientWidth && window.innerHeight > 400){
					fn.stick();
				}
			}
			else {
				$(window).off('scroll.stickycheck');//stop watching
			}
	      }

	      fn.init = function(){
	          if (config.stickyheader) {
				_st.featureClass('stickyheader',true);
	          //Normal devices
	          if (item.length && !Modernizr.touch) {
	              fn.check();
	              $window.on('scroll.stickycheck', fn.check);
	              $window.on('resize.stickyresize', function(){
	                  $wrapper._offset = $wrapper.offset();
	                  $wrapper._width = $wrapper.outerWidth();
	                  item._offset = stickyContainer.offset();
	                  fn.unstick();
	                  fn.check()
	              })
			}

	          //touch devices
	          else if(item.length){
	              if (item._offset.top == 0 && window.innerWidth == document.documentElement.clientWidth && window.innerHeight > 400) {
	                  fn.stick();
	              }
	              $window.on('orientationchange.stickychange', function(){
	                  setTimeout(function(){
	                      fn.reset();
	                      deviceWidth = document.documentElement.clientWidth;
	                  },400);
	              })
	          }

	          //ZoomChecker
	          //Disable fixed navbar if not in default zoom level
	          //$body.on('gestureend.zoomlevel', function(event){
	          //    //delay for animation
	          //    setTimeout(function(){
	          //        fn.checkzoom();
	          //    },300)
	          //    //window.setTimeout(checkscale, 100, true, null)
	          //})
	          }
			else {
				_st.featureClass('stickyheader',false);
			}
	      }
		}

    return fn;

  })();

  _st.offcanvas = function(){
      var fn = {},
      wrapper = $('.offcanvas-wrapper'),
      oc_content = $('.offcanvas-content');

      fn.close = function(){

          //enable page scroll
          $html.removeClass('noscroll');

          //restore scroll position
          $window.scrollTop(_st.scrollPosOncanvas);

          $html.removeClass('offcanvas-open');
      }

      fn.open = function(){

          //save scroll position
          _st.scrollPosOncanvas = window.scrollY || document.documentElement.scrollTop;

          //grab animation duration
          var animdelay = parseFloat(oc_content.css('transition-duration')) * 1000;

          setTimeout(function(){

              //scroll to top (avoid jumping on input focus)
              $window.scrollTop(0);

          }, animdelay); //wait till animation complete

          $html.addClass('offcanvas-open');
      }

      fn.toggle = function(direction){
          if ($html.hasClass('offcanvas-open')) {
              fn.close()
          }
          else {
              fn.open()
          }
      }

      if (wrapper.length) {
          $('.offcanvas-toggle').on('click', function(){
              fn.toggle()
          })
          $('.close-offcanvas').on('mousedown touchstart', function(){
              fn.close()
              return false;
          });

          oc_content.on('touchmove', function(e){
              if ($(this)[0].scrollHeight <= $(this).outerHeight()) {
                  e.preventDefault();
              }
          })
      }

      return fn;
  }

  //Fight iOS input zooming
  _st.inputZoom = function(){
      var viewportMETA = $('meta[name=viewport]');
      var vpTimer;
      viewportMETA.original = viewportMETA[0].content;
      $('input, select').on('touchstart', function(){

          window.clearTimeout(vpTimer);
              //$('.logo h1').text(window.outerWidth+" - "+document.documentElement.clientWidth)
          if (window.innerWidth == document.documentElement.clientWidth) {
              viewportMETA[0].content = 'width=device-width, initial-scale=1.0, maximum-scale=1, user-scalable=no';
              vpTimer = setTimeout(function(){
                  viewportMETA[0].content = 'width=device-width, initial-scale=1.0, maximum-scale=10, user-scalable=yes';
              },100);
          }
      })
  }

	_st.inputPlaceholder = (function(){
		var fn = {};
		return fn;
	})();

  //Remember closed alerts
  _st.alerts = function(){
    $('.alert-dismissible').on('close.bs.alert', function(){
      if (this.id.length) {
        //save state
        localStorage.setItem('st_canvas_Alert_'+this.id, 'hidden')
      }
    })
  }

  //Presistent bootstrap.collapsible
  //For Forum nodes and sidebar widgets
  _st.collapsible = function(){
    var collapsibles = $('.collapse');

    collapsibles.on('hidden.bs.collapse shown.bs.collapse', function () {
      var state = ($(this).hasClass('in')) ? 'visible':'hidden';

			//save state
			localStorage.setItem('st_canvas_collapsible_'+this.id, state);
    });

    //Forum collapsible nodes
    $('.collapse')
    .on('hide.bs.collapse', function () {
        $(this).parent().addClass('transforming')
    })
    .on('show.bs.collapse', function () {
        $(this).parent().addClass('transforming')
    })
    .on('shown.bs.collapse', function () {
        $(this).parent().removeClass('transforming')
        $(this).parent().removeClass('collapsed')
    })
    .on('hidden.bs.collapse', function () {
        $(this).parent().removeClass('transforming')
        $(this).parent().addClass('collapsed')
    });
  }

  //Relative timestamps
  //
  _st.relativeTimestamps = function(){
	if(!(config.timestamps && (lang == 'en' || lang == 'en-gb' || lang == 'en-us'))){
		$('.timestamp').each(function(){
			$(this).show();
		})
		return false;
	}

    var AMPM = function(date) {
      var hours = date.getHours();
      var minutes = date.getMinutes();
      var ampm = hours >= 12 ? 'pm' : 'am';
      hours = hours % 12;
      hours = hours ? hours : 12; // the hour '0' should be '12'
      minutes = minutes < 10 ? '0'+minutes : minutes;
      var strTime = hours + ':' + minutes + ' ' + ampm;
      return strTime;
    };
    var relativeTime = function($diff, $date){

      if ($diff < 60){
          return ($diff > 10) ? 'less than a minute ago' : 'moments ago';
      }

      //minutes
      $diff = Math.floor($diff/60);

      if ($diff < 60){
          return ($diff > 1) ? $diff+' minutes ago' : 'a minute ago';
      }

      //hours
      $diff = Math.floor($diff/60);

      //today
      if ($diff <= 24){
          return ($diff > 1) ? $diff+' hours ago' : 'an hour ago';
      }

      //yesterday
      if ($diff <= 48) {
          return 'Yesterday, '+AMPM($date)
      }

      //month-day format

      var monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
      //return monthNames[$date.getMonth()] + ' ' + $date.getDate()

      //days
      $diff = Math.floor($diff/24);

      if ($diff < 7){
          return ($diff > 1) ? $diff+' days ago' : 'yesterday';
      }

      if ($diff < 30)
      {
          $diff = Math.floor($diff / 7);

          return ($diff > 1) ? $diff+' weeks ago' : 'one week ago';
      }

      //months
      $diff = Math.floor($diff/30);

      if ($diff < 12){
          return ($diff > 1) ? $diff+' months ago' : 'one month ago';
      }

      $diff = new Date().getFullYear() - new Date($date).getFullYear();

      return ($diff > 1) ? $diff+' years ago' : 'last year';
    }

    var unsupportedFormat = 0;
    $('.timestamp').each(function(){
        var
        $this = $(this),
        currentTime = new Date(),
        time = new Date($this.text()), //make date object from date string
        timeDiff = function(a,b){
            return (a-b)/1000;
        };

		if (time) {
			try{
					$this.attr('title',$this.text()); //show original string on hover.
					$this.text(relativeTime(timeDiff(currentTime,time), time));
					//$this.addClass('parsed');
					$this.prev('.string_POSTED_ON_DATE').hide();
			}
			catch(e){
					//console.error(e)
			}
		}
		else {
			unsupportedFormat = 1;
		}

		$this.fadeIn();
    });
	if (unsupportedFormat) {
		console.error('Unsupported datetime format. Please use "d M Y, H:i" or similar format')
	}
  }

  //Comma-sepearte big numbers
  _st.formattedNumbers = function(){
    $('.formatted-numcounter').each(function(){
      var match = this.innerHTML.match(/\d+/);

      if (match && Number(match[0]) != NaN) {//valid number
        this.innerHTML = this.innerHTML.replace(/(\d+)/g, _st.utils.formatNumber(match[0]));
      }

    });
  }

  _st.editorSetup = (function(){
		//insertText
		if(_st.config.wysiwyg && $.sceditor) {
			window.insert_text = function(text, spaces, popup) {

				if (spaces) {
					text = ' ' + text + ' ';
				}

				_st.sceditor.insert(text);

				if (!popup) {
					_st.sceditor.focus();
				}
			}
			//file-delete button
			$(document).on('click', '.file-delete', function(){
				var
				AttachId = $(this).parents('.attach-row').attr('data-attach-id'),
				index = phpbb.plupload.getIndex(AttachId),
				filename = phpbb.plupload.data[index].real_filename,
				string = '[attachment='+index+']'+filename+'[/attachment]';
				var newval = _st.sceditor.val().replace(new RegExp(string.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, "\\$&"), 'g'), '');
				_st.sceditor.val(newval);
			})
		}


		//Unsaved data alert
		_st.leavingPage = true;
		$('[name=preview], [name=post], [name=save]').on('click', function(){
			_st.leavingPage = false;
		})
		$(window).on('beforeunload', function(){
			if(_st.config.wysiwyg && _st.sceditor){
				if (_st.sceditor.val().length > 3 && _st.leavingPage) {
					return 'You have started writing/editing a post.';
				}
			} else if($('textarea[name=message]').length && $('textarea[name=message]').val().length > 3 && _st.leavingPage){
				return 'You have started writing/editing a post.';
			}
		});
  })(),

  _st.sceSetup = function(){
		if(!$.sceditor){
			return false;
		}
		$.sceditor.plugins.bbcode.bbcode
		.set("list", {
			html: function(element, attrs, content) {
				var type = (attrs.defaultattr === '1' ? 'ol' : 'ul');

				return '<' + type + '>' + content + '</' + type + '>';
			},
			breakAfter: false
		})

		.set("ul", { format: function($elm, content) { return '[list]' + content +'[/list]'; }})
		.set("ol", { format: function($elm, content) { return '[list=1]' + content +'[/list]'; }})
		.set("li", { format: function($elm, content) { return '[*]' + content; }})
		.set("li", { format: function($elm, content) { return '[*]' + content; }})
		.set("*", { excludeClosing: true, isInline: false });

		$.sceditor.command
		.set("bulletlist", { txtExec: ["[list]\n[*]", "\n[/list]"] })
		.set("orderedlist", { txtExec: ["[list=1]\n[*]", "\n[/list]"] });


		var sizes = ['65', '85', '100', '120', '150', '175', '200'];

		$.sceditor.plugins.bbcode.bbcode.set('size', {
			format: function ($elem, content) {
				var fontSize,
					sizesIdx = 0,
					size = $elem.data('scefontsize');

				if (!size) {
					fontSize = $elem.css('fontSize');

					// Most browsers return px value but IE returns 1-7
					if (fontSize.indexOf('px') > -1) {
						// convert size to an int
						fontSize = ~~(fontSize.replace('px', ''));

						if (fontSize > 31) {
							sizesIdx = 6;
						}
						else if (fontSize > 23) {
							sizesIdx = 5;
						}
						else if (fontSize > 17) {
							sizesIdx = 4;
						}
						else if (fontSize > 15) {
							sizesIdx = 3;
						}
						else if (fontSize > 12) {
							sizesIdx = 2;
						}
						else if (fontSize > 9) {
							sizesIdx = 1;
						}
					}
					else {
						sizesIdx = ~~fontSize;
					}

					if (sizesIdx > 6) {
						sizesIdx = 6;
					}
					else if (sizesIdx < 0) {
						sizesIdx = 0;
					}

					size = sizes[sizesIdx];
				}

				return '[size=' + size + ']' + content + '[/size]';
			},
			html: function (token, attrs, content) {
				return '<span data-scefontsize="' + attrs.defaultattr + '" style="font-size:' + attrs.defaultattr + '%">' + content + '</span>';
			}
		});
    console.log('vimeo')
    $.sceditor.command.set('vimeo', {
      exec: function (caller) {
          var matches,
              vimeoHtml = '<iframe src="//player.vimeo.com/video/{0}" data-vimeo-id="{0}" width="560" height="315" frameborder="0" webkitallowfullscreen mozallowfullscreen allowfullscreen></iframe>',
              editor = this,
              content = $('<div><label for="link">Video URL:</label> <input type="text" id="link" placeholder="http://" /></div>' +
                  '<div><input type="button" class="button" value="Insert" /></div>');

          content.find('.button').click(function (e) {
              var val = content.find("#link").val().replace("http://", "");

              if (val !== "") {
                  matches = val.match(/vimeo\..*\/(\d+)(?:$|\/)/);

                  if (matches)
                      val = matches[1];

                  if (/^\d+$/.test(val))
                          editor.insert('[vimeo]' + val + '[/vimeo]');
                  else
                      alert('Invalid Viemo video');
              }

              editor.closeDropDown(true);
              e.preventDefault();
          });

          editor.createDropDown(caller, "insertlink", content);
      },
      txtExec: function (caller) {
          $.sceditor.command.get('vimeo').exec(caller);
      },
      tooltip: "Insert a Vimeo video"
    });

    $.sceditorBBCodePlugin.bbcode.set('vimeo', {
        allowsEmpty: true,
        tags: {
            iframe: {
                'data-vimeo-id': null
            }
        },
        format: function(element, content) {
            if(!(element = element.attr('data-vimeo-id')))
                return content;

            return '[vimeo]' + element + '[/vimeo]';
        },
        html: '<iframe src="//player.vimeo.com/video/{0}" data-vimeo-id="{0}" width="560" height="315" frameborder="0" webkitallowfullscreen mozallowfullscreen allowfullscreen></iframe>'
    });

		$.sceditor.command.set('size', {
			_dropDown: function (editor, caller, callback) {
				var content = $('<div />'),
					clickFunc = function (e) {
						callback($(this).data('size'));
						editor.closeDropDown(true);
						e.preventDefault();
					},
					size;

				for (var i = 1; i < 7; i++) {
					// Only consider maxsize when set greater 0
					content.append($('<a class="sceditor-fontsize-option" data-size="' + i + '" href="#"><font size="' + i + '">' + i + '</font></a>').click(clickFunc));
				}

				editor.createDropDown(caller, 'fontsize-picker', content);
			},
			txtExec: function (caller) {
				var editor = this;

				$.sceditor.command.get('size')._dropDown(
					editor,
					caller,
					function (sizesIdx) {
						sizesIdx = ~~sizesIdx;
						if (sizesIdx > 6) {
							sizesIdx = 6;
						}
						else if (sizesIdx < 0) {
							sizesIdx = 0;
						}

						editor.insertText('[size=' + sizes[sizesIdx] + ']', '[/size]');
					}
				);
			}
		});

		$.sceditor.plugins.bbcode.bbcode.set('font', {
    format: function ($element, content) {
        var font;

        // Get the raw font value from the DOM
        if (!$element.is('font') || !(font = $element.attr('face'))) {
            font = $element.css('font-family');
        }

        // Strip all quotes
        font = font.replace(/['"]/g, '');

        return '[font=' + font + ']' + content + '[/font]';
    }
});

		$.sceditor.plugins.bbcode.bbcode.set('quote', {
			format: function (element, content) {
				var author = '',
					$element = $(element),
					$cite = $element.children('cite').first();

				if (1 === $cite.length || $element.data('author')) {
					author = $element.data('author') || $cite.text().replace(/(^\s+|\s+$)/g, '').replace(/:$/, '');

					$element.data('author', author);
					$cite.remove();

					content = this.elementToBbcode($element);
					author = '=' + author;

					$element.prepend($cite);
				}

				return '[quote' + author + ']' + content + '[/quote]';
			},
			html: function (token, attrs, content) {
				var addition = '';

				if ("undefined" !== typeof attrs.defaultattr) {
					content = '<cite>' + attrs.defaultattr + ':</cite>' + content;
					addition = ' data-author="' + attrs.defaultattr + '"';
				}
				else {
					addition = ' class="uncited"'
				}

				return '<blockquote' + addition + '>' + content + '</blockquote>';
			},
			quoteType: function (val, name) {
				return '"' + val.replace('"', '\\"') + '"';
			},
			breakStart: false,
			breakEnd: false
		});



		_st.sceInit();

		if(document.dir == 'rtl'){
			_st.sceditor.rtl(true)
		}

		/*replaces unnecessary nonbreaking whitespaces
		$('textarea[name=message]').parents('form').on('submit', function(e){
			var txtarea = $(this).find('textarea[name=message]');
			txtarea[0].innerHTML = txtarea[0].innerHTML.replace(/(&nbsp;)([^ ])/g,' $2');
			console.log(txtarea.html())
			console.log(txtarea.val())
		})*/

		$('.sceditor-button-maximize').on('click', function(){
			if ($(this).hasClass('active')) {
				$html.addClass('sceditor-maximized')
			}else {
				$html.removeClass('sceditor-maximized')
			}
		})


		if ($('#disable_smilies').length && $('#disable_smilies')[0].checked) {
			_st.sceditor.emoticons(false);
		}
		if (!_st.sceditor.val().length) {
			_st.sceditor.setWysiwygEditorValue(' ');
		}
		//Toggle smilies
		$('#disable_smilies').on('change.sce', function(){
			if (this.checked) {
				_st.sceditor.emoticons(false);
				$('.sceditor-button-emoticon').hide()
			} else {
				_st.sceditor.emoticons(true);
				$('.sceditor-button-emoticon').show()
			}
		});

	};

  //Themepanel Modalbox
  _st.themepanelModal = function(){
    var
		box = $('#themepanel-modalbox'),
		boxsize = [box.outerHeight(),box.outerWidth()],
		tpmb_moving = false;
		box.on('mousedown.tpmbmove','.tpmb-header', function(e){
			$body.addClass('tpmb-dragging');
			e.preventDefault();
			tpmb_moving = true;
			var header = $('.tpmb-header'),
			boxpos = box.position(),
			mouseX = e.clientX,
			mouseY = e.clientY,
			topoffset = e.clientY - boxpos.top,
			leftoffset = e.clientX - boxpos.left,
			startpos = header.offset();

			$window.on('mousemove.tpmbmove', function(e){
				var
				fromtop = e.clientY - topoffset,
				fromleft = e.clientX - leftoffset;
				//make sure it doesn't fall out of window
				//fromtop = (fromtop<0) ? 0:fromtop;
				//fromtop = (fromtop>(window.innerHeight + boxsize[0])) ? 0:fromtop;
				//fromleft = (fromleft<0) ? 0:fromleft;
				//fromleft = (fromtop>(window.innerHeight + boxsize[1])) ? 0:fromleft;
				box.css({
					'top': fromtop,
					'left': fromleft
				})
			});
		})

		var stopdragging = function(){
			if (tpmb_moving) {
			$body.removeClass('tpmb-dragging');
			$window.off('mousemove.tpmbmove');
			tpmb_moving = false;
			var boxpos = box.position();
			var fromtop, fromleft,
			maxfromtop = window.innerHeight - box.outerHeight();
			maxfromleft = window.innerWidth - box.outerWidth();

			fromtop = (boxpos.top < 0) ? 0 : boxpos.top;
			fromtop = (boxpos.top > maxfromtop) ? maxfromtop : fromtop;
			fromleft = (boxpos.left < 0) ? 0 : boxpos.left;
			fromleft = (boxpos.left > maxfromleft) ? maxfromleft : fromleft;

			box.css({
				top: fromtop,
				left: fromleft
			})
			}
		}

		$body.on('mouseup.tpmbmove', function(){
			stopdragging();
		})

		$(document).on('mouseout.tpmbmove', function(e){
			e = e ? e : window.event;
			var from = e.relatedTarget || e.toElement;
			if (!from || from.nodeName == "HTML") {
				stopdragging();
			}
		})
      $('.themepanel-link').on('click', function(e){
          e.preventDefault();

		if (window.innerWidth < 600) {
			window.location.href = window.location.origin + _st.THEMEPANEL_LINK;
		}
		else {
			box.show();

			if(box.attr('data-loaded') != 'true') {
				var boxcontainer = box.find('.tpmb-container');
				$.ajax({
					url:_st.THEMEPANEL_PAGE_LINK,
					timeout:20000
				})
				.done(function(data, textStatus, jqXHR) {
					boxcontainer.html(data);
					box.css({
							left: (window.innerWidth/2) - 400
						})

					box.css({
						'height':'386px',
						'width': '800px'
					});
					box.attr('data-loaded','true');
					setTimeout(function(){
						boxcontainer.addClass('visible');
					}, 600)
					setTimeout(function(){
						box.css({
						'height':'',
						'width': '800px'
						});
						box.find('.submit-section').addClass('visible');
					}, 1400)
					box.find('link[rel=stylesheet]').each(function(){
						var path = $(this).attr('href');
						$(this).attr('href', _st.themePath+path)
					});

					box.find('[data-ajax]').each(function(){
						var $this = $(this);
						var ajax = $this.attr('data-ajax');
						var filter = $this.attr('data-filter');

						if (ajax !== 'false') {
							var fn = (ajax !== 'true') ? ajax : null;
							filter = (filter !== undefined) ? phpbb.getFunctionByName(filter) : null;

							phpbb.ajaxify({
								selector: this,
								refresh: $this.attr('data-refresh') !== undefined,
								filter: filter,
								callback: fn
							});
						}
					})

					_st.skinpanel();
					_st.fancyInput.checkbox();
					//enable tooltips
					boxcontainer.find('.has-tooltip').tooltip({
						container: 'body'
					});
					//Modernizr.load(_st.themePath+'/js/themepanel.js');
				})
				.fail(function(data, textStatus, jqXHR){
					if (textStatus=='timeout') {
						boxcontainer.html('<div class="alert alert-danger">'+textStatus+'<br>Request timed out. Please check your connection, reload the page and try again.</div>');
					} else {
						boxcontainer.html('<div class="alert alert-danger">'+textStatus+'<br>Unable to load. Please check permissions and extension configuration</div>');
					}

					box.attr('data-loaded','true');
				});
			}
		}

      });

      $('.tpmb-close').on('click', function(){
          box.hide();
      })
  }

	//quickly scroll to top or bottom
	_st.quickScroll = (function(){
		var fn = {};
		var blockhomeend = function(e){
			if (e.keyCode == 36 || e.keyCode == 35) {
				e.preventDefault();
			}
		}
		var keyScroll = function(e){
			$('.quickScroll-toTop').removeClass('active')
			$('.quickScroll-toBottom').removeClass('active')
			if (e.keyCode == 36) {
				fn.toTop();
				e.preventDefault();
			}
			else if (e.keyCode == 35) {
				fn.toBottom();
				e.preventDefault();
			}
		}

		fn.to = function(scrollPosition, direction){
			var
			diff = (direction == 'top') ? $window.scrollTop() - scrollPosition : scrollPosition - $window.scrollTop(),
			duration,
			elm = (direction == 'top') ? $('.quickScroll-toTop'): $('.quickScroll-toBottom'),
			scrollDiff = $window.scrollTop() - scrollPosition;

			//Do not run if scrolling isn't required
			if (scrollDiff == 0) { return false; }

			if (Modernizr.csstransforms && Modernizr.touch) {
				duration = diff / config.quickScroll_CSSAnimFactor;
				duration = (duration < 500) ? 500:duration;
				duration = (duration > 1200) ? 1200:duration;
				elm.addClass('active');
				$body.css({'transition-property':'transform','transition-duration':duration +'ms', 'transition-timing-function': 'cubic-bezier(0.19, 1, 0.22, 1)'}).css({'transform': 'translate3d(0, ' + scrollDiff + 'px, 0)'});
				setTimeout(function(){
					$('html, body').scrollTop(scrollPosition).css({'transition': '', 'transform': '', 'transition-timing-function': ''});
					elm.removeClass('active');
				}, duration)
			}
			else {
				duration = diff / config.quickScroll_animFactor;
				duration = (duration < 300) ? 300:duration;
				elm.addClass('active');
				$('html, body').stop().animate({scrollTop: scrollPosition}, duration, 'swing');
				setTimeout(function(){
					elm.removeClass('active');
				}, (duration+50))

			}

			return duration;
		}

		fn.toTop = function(){
			if ($html.hasClass('stickyheader')) {
				var pagebodyfromtop = $page_body.offset().top - $('.utility-bar').height() + 1;
				if($window.scrollTop() <= pagebodyfromtop){
					fn.to(0, 'top');
				} else {
					fn.to(pagebodyfromtop, 'top');
				}
			} else {
				if($window.scrollTop() <= $page_body.offset().top + 1){
					fn.to(0, 'top');
				} else {
					fn.to($page_body.offset().top, 'top');
				}
			}

		}

		fn.toBottom = function(){
			fn.to(document.body.scrollHeight - window.innerHeight, 'bottom');
		}

		fn.init = function(){
			var qsContainer = $('.quickScroll-container');
			if(qsContainer.length){
				console.warn('Skipping quickscroll insertion. Instance found on page. %o ', qsContainer[0]);
				return;
			}

			$body.append('<div class="quickScroll-container"></div>')
			var container = $('.quickScroll-container');

			container
			.append('<a href="javascript:void(0)" class="quickScroll-toTop"><i class="fi fi-chevron-up"></i></a>')
			.append('<a href="javascript:void(0)" class="quickScroll-toBottom"><i class="fi fi-chevron-down"></i></a>');

			//bind
			$('.quickScroll-toTop').on('click', fn.toTop);
			$('.quickScroll-toBottom').on('click', fn.toBottom);

			//keyboard binding
			if (config.quickScroll_bindHomeEnd) {
				$body.on('keydown.quickscroll', keyScroll);
			}
		}

		var quickscroll_condition = (config.quickscroll && (document.body.scrollHeight > window.innerHeight*2) );
		if (phpbb.SCRIPT_NAME == 'faq' || quickscroll_condition) {
			fn.init();
		}

		return fn;
	})();

  //hide outline on mouse events
  _st.mouseOutline = function(){
      $(document).ready(function() {
          $("body").on("mousedown", "*", function(e) {
              if (($(this).is(":focus") || $(this).is(e.target)) && $(this).css("outline-style") == "none") {
                  $(this).css("outline", "none").on("blur", function() {
                      $(this).off("blur").css("outline", "");
                  });
              }
          });
      });
  }

	//Replace native input elements
	_st.fancyInput = (function(){
		var fn = {};

		fn.checkbox_check = function(el){
			var cb = $(el).children('input');
			if (!cb[0].disabled) {
				cb[0].checked = (cb[0].checked) ? false:true;
				cb.trigger('change');
			}
		}

		fn.select = function(){

			//process select menus
			$('select').each(function(){
				var $this = $(this);

				if ($this.attr('multiple') || $this.parents('.input-group').length) {
					return;
				}

				//check existing
				var fc = $this.parents('.fancyInput');
				if (fc.length) {
					return;
				}

				$this.wrap('<span class="fancyInput fancyInput--select"></span>');

				fc = $this.parents('.fancyInput--select');

				fc
				.append('<span class="fancyInput__text"></span>')
				.append('<span class="fancyInput__icon"></span>');

				fc.attr('style', $this.attr('style'))

				fc.find('.fancyInput__text').text(this.options[this.options.selectedIndex].text);

				//change text onchange
				$this.on('change', function(){

					fc.find('.fancyInput__text').text(this.options[this.options.selectedIndex].text);

				});
			})

		}

		fn.checkbox = function(){

			//process checkboxes
			$('input[type=checkbox]').each(function(){
				var $this = $(this);

				//check existing
				var fc = $this.parents('.fancyInput');
				if (fc.length) {
					return;
				}

				$this.wrap('<span class="fancyInput fancyInput--checkbox"></span>');

				fc = $this.parents('.fancyInput--checkbox');

				fc
				.append('<span class="fancyInput__base"></span>')
				.append('<span class="fancyInput__check"></span>');

				if (this.disabled) 	{ fc.addClass('disabled') }
				if (this.checked) 	{ fc.addClass('checked') }

				var label = fc.parent('label');
				if (label.length) {
					label.addClass('fancyInput_label')
				}

				//change fancycheck onchange
				$this.on('change.fancyInput', function(){

					if (this.disabled) 	{ fc.addClass('disabled') }
					else 								{ fc.removeClass('disabled') }

					if (this.checked) 	{ fc.addClass('checked') }
					else 								{ fc.removeClass('checked') }

				});

			})
		}

		fn.radio = function(){
			//process checkboxes
			$('input[type=radio]').each(function(){
				var $this = $(this);

				//check existing
				var fancycontainer = $this.parents('.fancyInput');
				if (fancycontainer.length) {
					return;
				}


				$this.wrap('<span class="fancyInput fancyInput--radio"></span>');

				fancycontainer = $this.parents('.fancyInput--radio');

				fancycontainer
				.append('<span class="fancyInput__base"></span>')
				.append('<span class="fancyInput__check"></span>');

				if (this.disabled) 	{ fancycontainer.addClass('disabled') }
				if (this.checked) 	{ fancycontainer.addClass('checked') }

				//label setup
				var label = fancycontainer.parent('label');
				if (label.length) {
					label.addClass('fancyInput_label')
				}

				//change fancyradio onchange
				$this.on('change.fancyInput', function(){

					if (this.disabled) 	{ fancycontainer.addClass('disabled') }
					else 								{ fancycontainer.removeClass('disabled') }

					var name = $this.attr('name');
					if (name) {
						$('input[name="'+name+'"]').each(function(){
							var fc = $(this.parentNode);
							if (this.checked) 	{
								fc.addClass('checked')
							}
							else {
								fc.removeClass('checked')
							}
						})
					}

					if (this.checked) 	{ fancycontainer.addClass('checked') }
					else 								{ fancycontainer.removeClass('checked') }

				});

			})
		}

		//trigger change on form reset
		$('form').on('reset', function(){
			$(this).find('input[type=checkbox], input[type=radio], select').each(function(){
				var t = this;
				setTimeout(function(){
					$(t).trigger('change');
				}, 10);
			})
		})

		fn.checkbox();
		fn.radio();
		fn.select();

		return fn;

	})();

	_st.codePrettify = (function(){
		if ($('.codebox').length && config.prettycode) {
			Modernizr.load('https://cdn.rawgit.com/google/code-prettify/master/loader/run_prettify.js')
		}
	})();

  _st.scrollFix = (function(){
		if (Modernizr.touch) {
			var ScrollFix = function(elem) {
				var startY, startTopScroll;
				elem = document.querySelector(elem);
				if(!elem)
					return;

				elem.addEventListener('touchstart', function(event){
					startY = event.touches[0].pageY;
					startTopScroll = elem.scrollTop;

					if(startTopScroll <= 0)
						elem.scrollTop = 1;

					if(startTopScroll + elem.offsetHeight >= elem.scrollHeight)
						elem.scrollTop = elem.scrollHeight - elem.offsetHeight - 1;
				}, false);
			};

	    ScrollFix('.notifications-list');
	    ScrollFix('.offcanvas-content');
		}
  })();

	_st.fastClick = (function(){

		//enable tap highlight
		if (!config.fastclick) {
			$html.addClass('taphighlight');
			return false;
		}

		//load fastclick.JS
		Modernizr.load({
			test: Modernizr.touch,
			yep: _st.themePath + '/bower_components/fastclick/lib/fastclick.js',
			complete : function () {
				//Attach Fastclick
				if (typeof FastClick != 'undefined') {
						FastClick.attach(document.body);
				};
			}
		});
		return true;

	})();

  //Run Modules
  //All modules are independant and each line can be safely commented out as needed
  _st.ui();
  _st.relativeTimestamps();

  _st.formattedNumbers();
  _st.collapsible();
  _st.alerts();
  _st.offcanvas();
	if ($('.utility-bar').length) {
		_st.sticky.init();
	}
  _st.themepanelModal();
	_st.breadcrumbs();
	_st.cleanString();
	_st.postImages();

  if (!Modernizr.touch && $.fn.tooltip) {
  		$('.post-buttons > li > a').addClass('has-tooltip');
		$('.has-tooltip').tooltip({
			container: 'body',
			animation: false
		});
  }

  //run external onload functions
  for(var x=0;x<_st.onloadfunctions.length;x++){
    _st.onloadfunctions[x]();
  }

	if(window.performance && console.groupCollapsed) {
		initEnd = window.performance.now()
		console.log('_st.init(); %c'+Math.ceil(initEnd-initStart)+'ms', 'font-weight:bold')
		//console.log('configuration: %o', config);
	}
}
