function accessibilityInit() {

// Global
var root = document.getElementsByClassName('body')[0];


function accessibility() {

	////// Set accessibility //////
	document.body.classList.add('accessibility');

	////// Find elements //////
	var header = document.querySelectorAll('.main-header .container')[0];
	var footer = document.querySelectorAll('.accessibility .footer')[0];
	var parent_of_page_up_button = document.querySelectorAll('.accessibility .footer .about ul')[0];
	var first_link_footer = document.querySelectorAll('.accessibility .footer .about ul li:first-of-type')[0];
	var logo_link = document.querySelectorAll('.main-header .wrapper a')[0];
	var page_up_button = document.querySelectorAll('.page-up-button')[0];

	////// Create or clone //////
	var menu_bar = document.createElement('section'); // Create menu element on top of the page
	var footer_logo = logo_link.cloneNode(true); // Clone header logo
	page_up_button.innerHTML = 'наверх';

	menu_bar.classList.add('menu-bar');

	////// Content and structure //////
	menu_bar.innerHTML = '<ul>' +
											 		'<li id="regular-version"> Обычная версия </li>' +
											 		'<li id="accessibility-settings" class="accessibility-settings"> Настройки </li>' +
											 		'<li> <a href="#"> Карта сайта </a> </li>' +
											 		'<li> <a href="#"> Поиск </a> </li>' +
											 '</ul>';

	header.insertBefore(menu_bar, header.firstChild);
	footer.appendChild(footer_logo);
	parent_of_page_up_button.insertBefore(page_up_button, first_link_footer);

}

accessibility();


function disableAccessibility() {

	var regular_version = document.getElementById('regular-version');
	regular_version.addEventListener('click', goToRegularVersion);
	function goToRegularVersion() {
		alert('Disable accessibility.');
	}

}

disableAccessibility(); // Go to regular version


function accessibilitySettingsInit() {

	var accessibility_settings = document.getElementById('accessibility-settings');
	accessibility_settings.addEventListener('click', showAccessibilitySettings);
	function showAccessibilitySettings() {
		accessibility_settings_block.classList.toggle('open-menu')
	}

	var accessibility_settings_block = document.createElement('div');
	accessibility_settings_block.classList.add('accessibility-settings-block');
	root.appendChild(accessibility_settings_block);

	accessibility_settings_block.innerHTML = '' +
												'<div class="font-family">' +
													'<h5> Шрифт: </h5>' +
													'<ul>' +
												 		'<li class="sans-serif selected"> Без засечек </li>' +
												 		'<li class="serif"> С засечками </li>' +
													'</ul>' +
												'</div>' +
												'<div class="font-size">' +
											 		'<h5> Размер: </h5>' +
													'<ul>' +
												 		'<li class="small selected"> A </li>' +
												 		'<li class="medium"> A </li>' +
												 		'<li class="big"> A </li>' +
													'</ul>' +
												'</div>' +
												'<div class="letter-spacing">' +
											 		'<h5> Межбуквенный интервал: </h5>' +
													'<ul>' +
												 		'<li class="letter-spacing-default selected"> Стандартный </li>' +
												 		'<li class="letter-spacing-medium"> Средний </li>' +
												 		'<li class="letter-spacing-big"> Большой </li>' +
													'</ul>' +
												'</div>' +
												'<div class="theme-color">' +
											 		'<h5> Цветовая схема: </h5>' +
													'<ul>' +
												 		'<li class="black-on-white selected"> Чёрным по белому </li>' +
												 		'<li class="white-on-black"> Белым по чёрному </li>' +
												 		'<li class="lightblue-on-darkblue"> Голубым по тёмно-синему </li>' +
													'</ul>' +
												'</div>';

	accessibilitySettingsActions();

	function accessibilitySettingsActions() {
		accessibility_settings_block.addEventListener('click', chooseStyle);

		var font_family = document.querySelectorAll('.font-family ul li');
		var font_size = document.querySelectorAll('.font-size ul li');
		var letter_spacing = document.querySelectorAll('.letter-spacing ul li');
		var theme_color = document.querySelectorAll('.theme-color ul li');

		function chooseStyle(event) {

			var target = event.target;

			// Font-family
			if(target.parentNode.parentNode.classList.contains('font-family')) {
				for( i = 0; i < font_family.length; i++ ) {
					font_family[i].classList.remove('selected');
				}
				if(target.classList.contains('sans-serif')) {
					alert("sans-serif")
					target.classList.add('selected');
				} else if(target.classList.contains('serif')) {
					alert("serif")
					target.classList.add('selected');
				}
			}

			// Font-size
			else if(target.parentNode.parentNode.classList.contains('font-size')) {
				for( i = 0; i < font_size.length; i++ ) {
					font_size[i].classList.remove('selected');
				}
				if(target.classList.contains('small')) {
					alert("small")
					target.classList.add('selected');
				} else if(target.classList.contains('medium')) {
					alert("medium")
					target.classList.add('selected');
				} else if(target.classList.contains('big')) {
					alert("big")
					target.classList.add('selected');
				}
			}

			// Letter-spacing
			else if(target.parentNode.parentNode.classList.contains('letter-spacing')) {
				for( i = 0; i < letter_spacing.length; i++ ) {
					letter_spacing[i].classList.remove('selected');
				}
				if(target.classList.contains('letter-spacing-default')) {
					alert("letter-spacing-default")
					target.classList.add('selected');
				} else if(target.classList.contains('letter-spacing-medium')) {
					alert("letter-spacing-medium")
					target.classList.add('selected');
				} else if(target.classList.contains('letter-spacing-big')) {
					alert("letter-spacing-big")
					target.classList.add('selected');
				}
			}

			// Theme color
			else if(target.parentNode.parentNode.classList.contains('theme-color')) {
				for( i = 0; i < theme_color.length; i++ ) {
					theme_color[i].classList.remove('selected');
				}
				if(target.classList.contains('black-on-white')) {
					alert("black-on-white")
					target.classList.add('selected');
				} else if(target.classList.contains('white-on-black')) {
					alert("white-on-black")
					target.classList.add('selected');
				} else if(target.classList.contains('lightblue-on-darkblue')) {
					alert("lightblue-on-darkblue")
					target.classList.add('selected');
				}
			}

		}
	}

}

accessibilitySettingsInit();

}