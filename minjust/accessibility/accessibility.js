//function accessibilityInit() {

// Global
var root = document.getElementsByClassName('body')[0];
var doc_root = document.getElementsByTagName('html')[0];


function accessibility() {

	////// Set accessibility //////
	document.body.classList.add('accessibility');
	
	// Default styles
	document.body.classList.add('font-small');
	document.body.classList.add('theme__black-on-white');

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

	// Watch for state of settings
	var font_size_state;
	var letter_spacing_state;

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
					target.classList.add('selected');
					root.style.fontFamily = 'sans-serif';
				} else if(target.classList.contains('serif')) {
					target.classList.add('selected');
					root.style.fontFamily = 'serif';
				}
			}

			// Font-size
			else if(target.parentNode.parentNode.classList.contains('font-size')) {
				for( i = 0; i < font_size.length; i++ ) {
					font_size[i].classList.remove('selected');
				}
				if(target.classList.contains('small')) {
					target.classList.add('selected');
					doc_root.style.fontSize = '18px';
					root.classList.remove('big-font-mode');
					root.classList.remove('medium-font-mode');
					font_size_state = 'small';
					root.classList.add('font-small');
					root.classList.remove('font-medium');
					root.classList.remove('font-big');
				} else if(target.classList.contains('medium')) {
					target.classList.add('selected');
					doc_root.style.fontSize = '22px';
					root.classList.add('medium-font-mode');
					root.classList.remove('font-small');
					root.classList.add('font-medium');
					root.classList.remove('font-big');
					root.classList.remove('big-font-mode');
					font_size_state = 'medium';
				} else if(target.classList.contains('big')) {
					target.classList.add('selected');
					doc_root.style.fontSize = '26px';
					root.classList.add('big-font-mode');
					root.classList.remove('font-small');
					root.classList.remove('font-medium');
					root.classList.add('font-big');
					root.classList.remove('medium-font-mode');
					font_size_state = 'big';
				}
			}

			// Letter-spacing
			else if(target.parentNode.parentNode.classList.contains('letter-spacing')) {
				for( i = 0; i < letter_spacing.length; i++ ) {
					letter_spacing[i].classList.remove('selected');
				}
				if(target.classList.contains('letter-spacing-default')) {
					doc_root.style.letterSpacing = '0';
					target.classList.add('selected');
					letter_spacing_state = 'default';
				} else if(target.classList.contains('letter-spacing-medium')) {
					doc_root.style.letterSpacing = '1px';
					target.classList.add('selected');
					letter_spacing_state = 'medium';
				} else if(target.classList.contains('letter-spacing-big')) {
					doc_root.style.letterSpacing = '2px';
					target.classList.add('selected');
					letter_spacing_state = 'big';
				}
			}

			// Theme color
			else if(target.parentNode.parentNode.classList.contains('theme-color')) {
				for( i = 0; i < theme_color.length; i++ ) {
					theme_color[i].classList.remove('selected');
				}
				if(target.classList.contains('black-on-white')) {
					document.body.classList.add('theme__black-on-white');
					document.body.classList.remove('theme__white-on-black');
					document.body.classList.remove('theme__lightblue-on-darkblue');
					target.classList.add('selected');
				} else if(target.classList.contains('white-on-black')) {
					document.body.classList.add('theme__white-on-black');
					document.body.classList.remove('theme__black-on-white');
					document.body.classList.remove('theme__lightblue-on-darkblue');
					target.classList.add('selected');
				} else if(target.classList.contains('lightblue-on-darkblue')) {
					document.body.classList.remove('theme__white-on-black');
					document.body.classList.remove('theme__black-on-white');
					document.body.classList.add('theme__lightblue-on-darkblue');
					target.classList.add('selected');
				}
			}

			if(letter_spacing_state == 'medium' && font_size_state == 'medium') {
				accessibility_settings_block.classList.add('settings-fix');
			} else if(letter_spacing_state == 'big' && font_size_state == 'medium') {
				alert('!')
				accessibility_settings_block.classList.add('settings-fix__second');
			}
			 else {
				accessibility_settings_block.classList.remove('settings-fix');
				accessibility_settings_block.classList.remove('settings-fix__second');
			}

		}
	}

}

accessibilitySettingsInit();

}

accessibilityInit()