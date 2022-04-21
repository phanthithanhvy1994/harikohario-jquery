"use strict";

/* global */
var viewportH = jQuery(window).height();
var header = jQuery('#header');
var sidebar = jQuery('#sidebar');
var wrapper = jQuery('#wrapper');

/* init */
jQuery(document).ready(function () {
	scroll_anchor();
	checkbox_all();
	template();
	init_tinymce();
});

/* *
 * common function
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

/* checkbox all */
function checkbox_all() {
	var checkboxAll = jQuery('.checkall');
	if (checkboxAll.length > 0) {
		checkboxAll.on('change', function () {
			var all_checkbox_child = jQuery(this).parents('table').find('tbody input[type="checkbox"]');
			if (this.checked) all_checkbox_child.prop('checked', true);
			else all_checkbox_child.prop('checked', false);
		});
	}
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


/* *
 * pages-function
 * */

/* template */
function template() {
	/* sidebar height */
	sidebar.height(viewportH - 112);

	/* side menu active */
	var page_title = jQuery('title').text();
	sidebar.find('a').each(function () {
		if (jQuery(this).text() == page_title.split('｜')[0])
			jQuery(this).addClass('active');
	});

	/* layout when page scroll */
	jQuery(window).scroll(function () {
		if (jQuery(window).scrollTop() > header.height()) {
			header.addClass('head_small');
			wrapper.addClass('head_small');
			sidebar.height(viewportH - 80);
		} else {
			header.removeClass('head_small');
			wrapper.removeClass('head_small');
			sidebar.height(viewportH - 112);
		}
	});

	/* date picker */
	jQuery('input.date_picker').datepicker({
		dateFormat: "yy.mm.dd",
		dayNamesMin: ["日", "月", "火", "水", "木", "金", "土"],
		firstDay: 1,
		monthNames: ["1月", "2月", "3月", "4月,", "5月", "6月", "7月", "8月", "9月", "10月", "11月", "12月"],
	});

}

function init_tinymce() {
	var tiny_mce = jQuery('.tiny_mce');
	if (tiny_mce.length > 0) {
		tinymce.init({
			selector: '.tiny_mce',
			width: 635,
			height: 275,
			plugins: [
				'advlist autolink lists link image charmap print preview anchor textcolor',
				'searchreplace visualblocks code fullscreen',
				'insertdatetime media table paste code help wordcount'
			],
			toolbar: 'formatselect | bold italic backcolor | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent'
		});
	}
}