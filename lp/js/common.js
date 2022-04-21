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


jQuery(document).ready(function () {
	load_function();
	jQuery(window).resize(function () {
		viewportW = jQuery(window).width();
		viewportH = jQuery(window).height();
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
	landing_page();
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
function landing_page() {

}