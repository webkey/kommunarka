'use strict';

var $WINDOW = $(window), $DOC = $(document), $BODY = $('body');

/**
 * !resize only width
 * */
var resizeByWidth = true;

var prevWidth = -1;
$(window).resize(function () {
	var currentWidth = $('body').outerWidth();
	resizeByWidth = prevWidth !== currentWidth;
	if (resizeByWidth) {
		$(window).trigger('resizeByWidth');
		prevWidth = currentWidth;
	}
});

/**
 * !debouncedresize only width
 * */
var debouncedresizeByWidth = true;

var debouncedPrevWidth = -1;
$(window).on('debouncedresize', function () {
	var currentWidth = $('body').outerWidth();
	debouncedresizeByWidth = debouncedPrevWidth !== currentWidth;
	if (resizeByWidth) {
		$(window).trigger('debouncedresizeByWidth');
		debouncedPrevWidth = currentWidth;
	}
});

/**
 * !device detected
 * */
var DESKTOP = device.desktop();
var MOBILE = device.mobile();
var TABLET = device.tablet();

/**
 *  Add placeholder for old browsers
 * */
function placeholderInit() {
	$('[placeholder]').placeholder();
}

/**
 * !Show print page by click on the button
 * */
function printShow() {
	$('.view-print').on('click', function (e) {
		e.preventDefault();
		window.print();
	})
}

/**
 * !Get size of scroll
 * */

function getScrollSize() {
	// создадим элемент с прокруткой
	var div = document.createElement('div');

	div.style.overflow = 'scroll';
	div.style.width = '50px';
	div.style.height = '50px';
	div.style.position = 'fixed';
	div.style.left = '0px';
	div.style.bottom = '0px';
	div.style.visibility = 'hidden';

	// добавить элемент на страницу
	document.body.appendChild(div);

	// удалить элемент со страницы
	document.body.removeChild(div);

	// определить размеры скролла
	var scrollWidth = window.innerWidth - document.body.offsetWidth;
	var scrollHeight = window.innerHeight - document.body.offsetHeight;

	return {
		'width' : scrollWidth,
		'height' : scrollHeight
	};

	/** getScrollSize().width - получить ширину скролла */
	/** getScrollSize().height - получить высоту скролла */
}

/**
 * !Add class on scroll page
 * */
$(function () {
	// external js:
	// 1) resizeByWidth (resize only width);

	var $page = $('html'),
		currentScrollTop,
		headerIsTopClass = 'header-is-top',
		$header = $('.header');

	addClassScrollPosition();

	$(window).on('scroll resizeByWidth', function () {
		addClassScrollPosition();
	});

	function addClassScrollPosition() {
		currentScrollTop = $(window).scrollTop();

		$page.toggleClass(headerIsTopClass, $header.offset().top <= currentScrollTop);
	}
});

/**
 * !Sticky element on page
 * */
function stickyInit() {
	// aside sticky
	var $header = $('.header');

	if ($header.length) {
		stickybits('.header', {
			useStickyClasses: true,
			stickyBitStickyOffset: 0
		});
	}
}

/**
 * !Toggle shutters
 * */
function toggleShutters() {
	var $overlay = $('.shutter-overlay-js'),
		$html = $('html'),
		$elemens = $('.header, .main, .footer'),
		activeClass = 'active';

	var $nav = $('.shutter--nav-js');

	var $btnNav = $('.btn-nav-js');

	$btnNav.on('click', function (e) {
		var $curOpener = $(this);
		$curOpener.toggleClass(activeClass);

		$nav.toggleClass(activeClass);

		if ($curOpener.hasClass(activeClass)) {
			$elemens.css({
				'padding-right': getScrollSize().width,
				'padding-bottom': getScrollSize().height
			});
		} else {
			$elemens.css({
				'padding-right': '',
				'padding-bottom': ''
			});
		}

		$overlay.toggleClass(activeClass, $curOpener.hasClass(activeClass));
		$html.toggleClass('shutter-after-open css-scroll-fixed shutter-only-mob', $curOpener.hasClass(activeClass));

		e.preventDefault();
	});

	// close
	$('.shutter-overlay-js').on('click', function (e) {
		$btnNav.removeClass(activeClass);

		$nav.removeClass(activeClass);

		$overlay.removeClass(activeClass);

		$html.removeClass('shutter-after-open css-scroll-fixed shutter-only-mob');

		e.preventDefault();
	})
}

/**
 * !scroll to top
 * */
$(function () {
	var $btnToTop = $('.btn-to-top-js');

	if ($btnToTop.length) {
		var $page = $('html, body'),
			minScrollTop = 300;

		$(window).on('load scroll resizeByWidth', function () {
			var currentScrollTop = $(window).scrollTop();

			$btnToTop.toggleClass('btn-to-top--show', (currentScrollTop >= minScrollTop));
		});

		$btnToTop.on('click', function (e) {
			e.preventDefault();

			if (!$page.is(':animated')) {
				$page.stop().animate({scrollTop: 0}, 300);
			}
		})
	}
});

/**
 * !Testing form validation (for example). Do not use on release!
 * */
function formSuccessExample() {
	var $form = $('.user-form form');

	if ( $form.length ) {

		$form.submit(function (event) {
			var $thisForm = $(this);

			if ($thisForm.parent().hasClass('success-form')) return;

			event.preventDefault();

			testValidateForm($thisForm);
		});

	}

	function testValidateForm(form) {
		var $thisFormWrap = form.parent();

		var $inputs = $(':text, input[type="email"], input[type="password"], textarea', form);

		var inputsLength = $inputs.length;
		var inputsHasValueLength = $inputs.filter(function () {
			return $(this).val().length;
		}).length;

		$thisFormWrap.toggleClass('error-form', inputsLength !== inputsHasValueLength);
		$thisFormWrap.toggleClass('success-form', inputsLength === inputsHasValueLength);

		$.each($inputs, function () {
			var $thisInput = $(this);
			var thisInputVal = $thisInput.val();
			var $thisInputWrap = $thisInput.parent();

			$thisInput.toggleClass('error', !thisInputVal.length);
			$thisInput.toggleClass('success', !!thisInputVal.length);

			$thisInputWrap.toggleClass('error', !thisInputVal.length);
			$thisInputWrap.toggleClass('success', !!thisInputVal.length);
		});
	}
}

/**
 * =========== !ready document, load/resize window ===========
 */

$(window).on('load', function () {
	// add functions
});

$(window).on('debouncedresize', function () {
	// $(document.body).trigger("sticky_kit:recalc");
});

$(document).ready(function () {
	placeholderInit();
	printShow();
	objectFitImages(); // object-fit-images initial
	stickyInit();
	toggleShutters();

	formSuccessExample();
});