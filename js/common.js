"use strict";

/* *
 * global
 * */
if (typeof (site_url) === 'undefined') {
	var site_url = '';
	var theme_url = ''
	var path_media = 'images/';
} else var path_media = '/wp-content/uploads/';
var media_upload = site_url + path_media;

var viewportW = jQuery(window).width();
var viewportH = jQuery(window).height();
var documentH = 0;
var viewportSMP = 800;

var header = jQuery('#header');
// var navbox = jQuery('.navbox');

// template_new
var header_pc = jQuery('#header_pc');
var header_panel = jQuery('.header-panel');

jQuery(document).ready(function () {
	load_function();
	jQuery(window).resize(function () {
		viewportW = jQuery(window).width();
		viewportH = jQuery(window).height();
		height_menu();
	}).resize();
});

/* *
 * load-function
 * */

function load_function() {
	/* common */
	scroll_anchor();
	tel_link();
	detectSMP();
	viewport_size();
	reload_page_pcsmp();
	/* pages */
	template();
	toppage();
	jobdetail();
	job();
	howto();
	business();
}


/* *
 * common-function
 * */

/* scroll to with animation */
function scroll_anchor() {
	if (jQuery('.scrollTo').length > 0) {
		jQuery('.scrollTo').each(function () {
			jQuery(this).on('click', function (event) {
				event.preventDefault();
				var headerH = jQuery('#header').length > 0 ? jQuery('#header').height() : 0;
				var target = jQuery(this).attr('href');
				if (jQuery(target).length > 0) {
					jQuery('html, body').animate({
						scrollTop: jQuery(target).offset().top - headerH
					}, 500);
				}
			});
		});
	}
}

/* reload page when change viewport between pc <=> smp */
function reload_page_pcsmp() {
	tablet_layout();
	var is_device, get_device;
	is_device = viewportW > viewportSMP ? 'is_pc' : 'is_smp';
	jQuery(window).smartresize(function () {
		var get_viewportW = jQuery(window).width();
		get_device = get_viewportW > viewportSMP ? 'is_pc' : 'is_smp';
		if (is_device != get_device)
			window.location.href = window.location.href;
	});
	/* rotate device */
	window.addEventListener("orientationchange", function () {
		window.location.href = window.location.href;
	}, false);
}

/* set tel link for text-tel when mobile */
function tel_link() {
	var ua = navigator.userAgent;
	if (ua.indexOf('iPhone') > 0 && ua.indexOf('iPod') == -1 || ua.indexOf('Android') > 0 && ua.indexOf('Mobile') > 0 && ua.indexOf('SC-01C') == -1 && ua.indexOf('A1_07') == -1) {
		jQuery('.tel-link img').each(function () {
			var alt = jQuery(this).attr('alt');
			jQuery(this).wrap(jQuery('<a>').attr('href', 'tel:' + alt.replace(/-/g, '')));
		});
		jQuery('.tel-text').each(function () {
			var txt = jQuery(this).html();
			jQuery(this).wrap(jQuery('<a>').attr('href', 'tel:' + txt.replace(/-/g, '')));
		});
		jQuery('.fax-text').each(function () {
			if (jQuery(this).parent().is('a'))
				jQuery(this).unwrap();
		});
	}
};

/* detect device and add className to support layout (require detectmobile.js) */
function detectSMP() {
	if (DetectIos() != false) jQuery('html').addClass('ios');
	if (DetectAndroid() != false) jQuery('html').addClass('android');
	if (DetectSmartphone() != false) jQuery('html').addClass('smartphone');
	if (DetectIphone() != false) return jQuery('html').addClass('iphone');
	else if (DetectIpad() != false) return jQuery('html').addClass('tabletdevice ipad');
	else if (DetectAndroidPhone() != false) return jQuery('html').addClass('androidphone');
	else if (DetectAndroidTablet() != false) return jQuery('html').addClass('tabletdevice androidtablet');
	return jQuery('html').addClass('desktop');
}

/* device size */
function viewport_size() {
	if (viewportW > viewportSMP) return jQuery('html').addClass('desktop');
	if (viewportW <= 380) return jQuery('html').addClass('media-s');
	if (viewportW <= 600) return jQuery('html').addClass('media-m');
	if (viewportW <= 800) return jQuery('html').addClass('media-l');
}

/* heightline advance */
function _heightline(settings) {
	// generate random ID string
	var id_hl = 'HL' + Math.uuid(6, 16);
	// default settings
	var defaultSettings = {
		itemClsName: '.hl',
		itemPerRow: 0,
		supportTableCell: false,
		device: 'both',
		delayFunc: 500
	};
	// get settings
	var _settings = defaultSettings;
	for (var key in settings) {
		if (settings.hasOwnProperty(key))
			if (settings[key] !== undefined)
				_settings[key] = settings[key];
	}
	var _item = _settings.itemClsName,
		_number = _settings.itemPerRow,
		_supportTableCell = _settings.supportTableCell,
		_device = _settings.device,
		_delay = _settings.delayFunc;
	// process heightline if element exist
	if (jQuery(_item).length > 0) {
		setTimeout(function () {

			// heighline all item if itemPerRow = 0
			if (_number == 0) {
				if (_device == 'both' ||
					_device == 'pc' && viewportW > viewportSMP ||
					_device == 'smp' && viewportW <= viewportSMP) {
					// set height
					jQuery(_item).heightLine();
					// set width to support vertical-align width display:tale-cell
					if (_supportTableCell)
						jQuery(_item).css('width', jQuery(_item).width()).css('display', 'table-cell');
				}

			} else {
				// add class heightline
				var count = 0,
					row = 1;
				jQuery(_item).each(function () {
					count++;
					jQuery(this).addClass(id_hl + '-' + row);
					if (count >= _number) {
						row++;
						count = 0;
					}
				});
				// calc rows number max
				var totalItem = jQuery(_item).length;
				var maxRow = Math.floor(totalItem % _number > 0 ? (totalItem / _number) + 1 : totalItem / _number);
				// process heightline
				for (var i = 1; i <= maxRow; i++) {
					if (_device == 'both' ||
						_device == 'pc' && viewportW > viewportSMP ||
						_device == 'smp' && viewportW <= viewportSMP) {
						jQuery('.' + id_hl + '-' + i).heightLine();
						// set width to support vertical-align width display:tale-cell
						if (_supportTableCell)
							jQuery('.' + id_hl + '-' + i).css('width', jQuery(_item).width()).css('display', 'table-cell');
					}
				}
			}
		}, _delay);
	}
}


/* layout tablet */
function tablet_layout() {
	if (viewportW > viewportSMP && viewportW <= 1278)
		jQuery('meta[name=viewport]').attr('content', 'width=1400');
	else jQuery('meta[name=viewport]').attr('content', 'width=device-width, initial-scale=1.0, minimum-scale=1.0, maximum-scale=1.0, user-scalable=no');
}

/* *
 * pages-function
 * */

/* template */
function template() {
	if (viewportW > viewportSMP) {
		jQuery(window).on('scroll', function (e) {
			if (jQuery(window).scrollTop() > header.height())
				header.addClass('head_small');
			else header.removeClass('head_small');
		});
	} else {
		//menu button smp
		// jQuery('.click_smp').click(function () {
		// 	jQuery(this).toggleClass('is-act').find('span').toggleClass('hidden');
		// 	navbox.stop(true, true).fadeToggle(500);
		// 	height_menu();
		// });
	}

	// template_new
	if (viewportW > viewportSMP) {
		jQuery(window).on('scroll', function (e) {
			if (jQuery(window).scrollTop() > header_pc.height())
				header_pc.addClass('head_small');
			else header_pc.removeClass('head_small');
		});
	} else {
		//menu button smp
		jQuery('.menu__hamburger').click(function () {
			jQuery(this).toggleClass('is-act').find('span').toggleClass('hidden');
			header_panel.stop(true, true).fadeToggle(500);
			jQuery('#header_smp').toggleClass('clear-bg');
			height_menu();
		});
	}

	jQuery(window).on('scroll', function (e) {
		if (jQuery(window).scrollTop() > viewportH)
			jQuery('.scroll_top').addClass('active');
		else jQuery('.scroll_top').removeClass('active');
	});
}

function height_menu() {
	if (viewportW <= viewportSMP) {
		// navbox.height(viewportH - jQuery('#header .temp_logo').height());
		header_panel.height(viewportH - jQuery('#header_smp .header-menu').height() - 20);
	}
}

/* top page */
function toppage() {
	jQuery('.ind_slider').slick({
		centerMode: true,
		variableWidth: true,
		dots: true,
		arrows: false,
		responsive: [{
			breakpoint: 800,
			settings: {
				slidesToShow: 1,
				slidesToScroll: 1,
				centerMode: false,
				variableWidth: false
			}
		}]
	});
	// tabs
	if (jQuery('.tabs_nav').length > 0) {
		jQuery('.tabs_nav li a').on('click', function (e) {
			e.preventDefault();
			var currentAttrValue = jQuery(this).attr('href');
			jQuery('.admiss_tab_main ' + currentAttrValue).fadeIn(400).siblings().hide();
			jQuery(this).parent('li').addClass('active').siblings().removeClass('active');
		});
	}
}

/*jobdetail*/
function jobdetail() {
	$('.jobdetail-slide').slick({
		dots: true,
		infinite: true,
		speed: 300,
		slidesToShow: 1,
		autoplay: true,
		adaptiveHeight: true
	});

	_heightline({
		itemClsName: '.jobdetail-bg01',
		itemPerRow: 3
	});

	_heightline({
		itemClsName: '.jobdetail-text03',
		itemPerRow: 3
	});

	_heightline({
		itemClsName: '.jobdetail-p04',
		itemPerRow: 2,
		device: 'pc'
	});

	jQuery('.jobdetail_footer-all').addClass('fixed');

	jQuery(window).scroll(function () {
		if (jQuery(window).scrollTop() + jQuery(window).height() > jQuery(document).height() - 100) {
			jQuery('.jobdetail_footer-all').addClass('notfixed').removeClass('fixed');
		} else jQuery('.jobdetail_footer-all').removeClass('notfixed').addClass('fixed');
	});

	if (jQuery('#jobdetail').length == 1) {
		jQuery('body').addClass('jobdetail_add');
	}
}

function job() {
	if (viewportW > viewportSMP) {
		jQuery(document).on("click", ".accordion", function () {
			if (jQuery(jQuery(this).next()).length > 0) {
				jQuery(jQuery(this).next()).slideToggle();
				jQuery(this).toggleClass('active');
			}
		});
	} else {
		var accordion = jQuery('.accordion');
		var btn_box_a = jQuery('.search_condition .btn_box a');
		var search_box = jQuery('.search_box');
		var search_box_row = jQuery('.search_box_row');
		var search_box_title = jQuery('.search_box .title');
		btn_box_a.removeAttr("data-fancybox").removeAttr("href").removeAttr("data-src");
		if (jQuery('.accordion').length > 0) {
			jQuery('.accordion').each(function () {
				jQuery(this).removeClass('active');
				jQuery(this).next().removeClass('active');
			});
		}
		if (jQuery('.panel_content').find('.btn_back').length <= 0) {
			jQuery('.panel_content').after("<p class='btn_back smp'><a href='#'>OK</a></p>");
		}
		btn_box_a.on('click', function (e) {
			e.preventDefault();
			search_box.addClass('-open');
			jQuery('.btn_back').hide();
			accordion.on('click', function () {
				if (jQuery(jQuery(this).next()).length > 0) {
					var title_tr = jQuery(this).parent().prev().text();
					search_box_title.text("検索条件 > " + title_tr);
					search_box_row.addClass('-parent');
					jQuery(this).next().addClass('-open');
					jQuery(this).next().append(jQuery('.acccccc'));
					jQuery('.btn_back').show();
					jQuery('.btn_link').hide();
					jQuery('.btn_back').on('click', function () {
						search_box_title.text("検索条件");
						search_box_row.removeClass('-parent');
						accordion.next().removeClass('-open');
						jQuery('.btn_back').hide();
						jQuery('.btn_link').show();
					});
				}
			});
			jQuery('.btn_link a').on('click', function (e) {
				e.preventDefault();
				search_box.removeClass('-open');
			});
		});


	}
}

function howto() {
	_heightline({
		itemClsName: '.howto-block__list .item .__title',
		itemPerRow: 3
	});

	_heightline({
		itemClsName: '.howto-report__title span',
		itemPerRow: 2
	});
}

function business() {
	if (jQuery('#text_circle').length > 0)
		new CircleType(document.getElementById('text_circle')).radius(500);
}