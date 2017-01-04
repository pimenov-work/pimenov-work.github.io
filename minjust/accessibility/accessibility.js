// Global
var root = document.getElementsByClassName('body')[0];
var doc_root = document.getElementsByTagName('html')[0];

window.addEventListener('load', changeContactBlock);
window.addEventListener('load', initSettings);

function initSettings() {

	var font_family = document.querySelectorAll('.font-family ul li');

	if (localStorage.getItem('font_family_state') == 'sans-serif') {
		for( i = 0; i < font_family.length; i++ ) {
			font_family[i].classList.remove('selected');
		}
		root.style.fontFamily = 'sans-serif';
		document.getElementsByClassName('sans-serif')[0].classList.add('selected');
	}

	if (localStorage.getItem('font_family_state') == 'serif') {
		for( i = 0; i < font_family.length; i++ ) {
			font_family[i].classList.remove('selected');
		}
		root.style.fontFamily = 'serif';
		document.getElementsByClassName('serif')[0].classList.add('selected');
	}

	var font_size = document.querySelectorAll('.font-size ul li');

	if (localStorage.getItem('font_size_state') == 'small') {
		for( i = 0; i < font_size.length; i++ ) {
			font_size[i].classList.remove('selected');
		}
		doc_root.style.fontSize = '18px';
		//root.classList.remove('big-font-mode');
		//root.classList.remove('medium-font-mode');
		root.classList.add('font-small');
		root.classList.remove('font-medium');
		root.classList.remove('font-big');
		document.getElementsByClassName('small')[0].classList.add('selected');
	}

	if (localStorage.getItem('font_size_state') == 'medium') {
		for( i = 0; i < font_size.length; i++ ) {
			font_size[i].classList.remove('selected');
		}
		doc_root.style.fontSize = '22px';
		//root.classList.add('medium-font-mode');
		root.classList.remove('font-small');
		root.classList.add('font-medium');
		root.classList.remove('font-big');
		//root.classList.remove('big-font-mode');
		document.getElementsByClassName('medium')[0].classList.add('selected');
	}

	if (localStorage.getItem('font_size_state') == 'big') {
		for( i = 0; i < font_size.length; i++ ) {
			font_size[i].classList.remove('selected');
		}
		doc_root.style.fontSize = '26px';
		//root.classList.add('big-font-mode');
		root.classList.remove('font-small');
		root.classList.remove('font-medium');
		root.classList.add('font-big');
		//root.classList.remove('medium-font-mode');
		document.getElementsByClassName('big')[0].classList.add('selected');
	}

	var letter_spacing = document.querySelectorAll('.letter-spacing ul li');

	if (localStorage.getItem('letter_spacing_state') == 'default') {
		for( i = 0; i < letter_spacing.length; i++ ) {
			letter_spacing[i].classList.remove('selected');
		}
		doc_root.style.letterSpacing = '0';
		document.getElementsByClassName('letter-spacing-default')[0].classList.add('selected');
	}

	if (localStorage.getItem('letter_spacing_state') == 'medium') {
		for( i = 0; i < letter_spacing.length; i++ ) {
			letter_spacing[i].classList.remove('selected');
		}
		doc_root.style.letterSpacing = '1px';
		document.getElementsByClassName('letter-spacing-medium')[0].classList.add('selected');
	}

	if (localStorage.getItem('letter_spacing_state') == 'big') {
		for( i = 0; i < letter_spacing.length; i++ ) {
			letter_spacing[i].classList.remove('selected');
		}
		doc_root.style.letterSpacing = '2px';
		document.getElementsByClassName('letter-spacing-big')[0].classList.add('selected');
	}

	var theme_color = document.querySelectorAll('.theme-color ul li');

	if (localStorage.getItem('theme_color_state') == 'black-on-white') {
		for( i = 0; i < theme_color.length; i++ ) {
			theme_color[i].classList.remove('selected');
		}
		document.body.classList.add('theme__black-on-white');
		document.body.classList.remove('theme__white-on-black');
		document.body.classList.remove('theme__lightblue-on-darkblue');
		document.getElementsByClassName('black-on-white')[0].classList.add('selected');
	}

	if (localStorage.getItem('theme_color_state') == 'white-on-black') {
		for( i = 0; i < theme_color.length; i++ ) {
			theme_color[i].classList.remove('selected');
		}
		document.body.classList.remove('theme__black-on-white');
		document.body.classList.add('theme__white-on-black');
		document.body.classList.remove('theme__lightblue-on-darkblue');
		document.getElementsByClassName('white-on-black')[0].classList.add('selected');
	}

	if (localStorage.getItem('theme_color_state') == 'lightblue-on-darkblue') {
		for( i = 0; i < theme_color.length; i++ ) {
			theme_color[i].classList.remove('selected');
		}
		document.body.classList.remove('theme__black-on-white');
		document.body.classList.remove('theme__white-on-black');
		document.body.classList.add('theme__lightblue-on-darkblue');
		document.getElementsByClassName('lightblue-on-darkblue')[0].classList.add('selected');
	}

}


function accessibilityInit() {


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
	page_up_button.innerHTML = gettext('To top');

	menu_bar.classList.add('menu-bar');

	////// Content and structure //////
	menu_bar.innerHTML = '<ul>' +
											 		'<li id="regular-version">' +
											 			gettext('Regular version')  +
											 		'</li>' +
											 		'<li id="accessibility-settings" class="accessibility-settings">' +
											 			gettext('Settings')  +
											 		'</li>' +
											 		'<li>' +
											 			'<a href="#">' + gettext('Site map') + '</a> </li>' +
											 		'<li>' +
											 			'<a href="http://minjust.gov.by/search/">' + gettext('Search')  + '</a>'
											 		'</li>' +
											 '</ul>';

	header.insertBefore(menu_bar, header.firstChild);
	footer.appendChild(footer_logo);
	parent_of_page_up_button.insertBefore(page_up_button, first_link_footer);

	footer.innerHTML += '<a href="http://minjust.gov.by" class="minf-link"> minjust.gov.by </a>';

}

accessibility();


function disableAccessibility() {

	var regular_version = document.getElementById('regular-version');
	regular_version.addEventListener('click', goToRegularVersion);
	function goToRegularVersion() {
		localStorage.setItem('accessibility_on', 'off');
		location.reload();
	}

}

disableAccessibility(); // Go to regular version


function accessibilitySettingsInit() {

	var accessibility_settings = document.getElementById('accessibility-settings');
	accessibility_settings.addEventListener('click', showAccessibilitySettings);
	document.addEventListener('click', settingsClose);

	var settings_state = 1;

	function showAccessibilitySettings() {
		if ( settings_state % 2 != 0) {
			accessibility_settings_block.classList.add('open-menu');
			accessibility_settings.classList.add('menu-open-style');
			alert(settings_state);
			alert('Open!');
			settings_state++;
			return;
		}
		if ( settings_state % 2 == 0 ) {
			accessibility_settings_block.classList.remove('open-menu');
			accessibility_settings.classList.remove('menu-open-style');
			alert(settings_state);
			alert('Close!');
			settings_state++;
			return;
		}
	}

	function settingsClose(e) {
	var target = e.target;
		if (target.id != 'about') {
			while(target.tagName != 'HTML') {
				if (target.id == 'settingsBlock' || target.id == 'accessibility-settings') {
					return;
				}
				if(target.tagName == 'BODY') {
					accessibility_settings_block.classList.remove('open-menu');
					accessibility_settings.classList.remove('menu-open-style');
					settings_state = 1;
					return;
				}
			target = target.parentNode;
			}
		}
	}

	var accessibility_settings_block = document.createElement('div');
	accessibility_settings_block.classList.add('accessibility-settings-block');
	accessibility_settings_block.setAttribute('id', 'settingsBlock');
	root.appendChild(accessibility_settings_block);

	accessibility_settings_block.innerHTML = '' +
												'<div class="font-family">' +
													'<h5>' + gettext('Font') + '</h5>' +
													'<ul>' +
												 		'<li class="sans-serif selected">' + gettext('Serif') + '</li>' +
												 		'<li class="serif">' + gettext('Sans-serif') + '</li>' +
													'</ul>' +
												'</div>' +
												'<div class="font-size">' +
											 		'<h5>' + gettext('Font size')  + '</h5>' +
													'<ul>' +
												 		'<li class="small selected"> A </li>' +
												 		'<li class="medium"> A </li>' +
												 		'<li class="big"> A </li>' +
													'</ul>' +
												'</div>' +
												'<div class="letter-spacing">' +
											 		'<h5>' + gettext('Letter spacing') + '</h5>' +
													'<ul>' +
												 		'<li class="letter-spacing-default selected">' + gettext('Default') + '</li>' +
												 		'<li class="letter-spacing-medium">' + gettext('Middle') + '</li>' +
												 		'<li class="letter-spacing-big">' + gettext('Big') + '</li>' +
													'</ul>' +
												'</div>' +
												'<div class="theme-color">' +
											 		'<h5>' + gettext('Theme') + '</h5>' +
													'<ul>' +
												 		'<li class="black-on-white selected">' + gettext('Black on white') + '</li>' +
												 		'<li class="white-on-black">' + gettext('White on black') + '</li>' +
												 		'<li class="lightblue-on-darkblue">' + gettext('Lightblue on darkblue') + '</li>' +
													'</ul>' +
													'<span id="close_element"></span>' +
												'</div>';

	accessibilitySettingsActions();



	var close_element = document.getElementById('close_element');
	close_element.addEventListener('click', closeSettingsWithIcon);

	function closeSettingsWithIcon() {
		accessibility_settings_block.classList.remove('open-menu');
		accessibility_settings.classList.remove('menu-open-style');
		settings_state = 1;
	}

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
					localStorage.setItem('font_family_state', 'sans-serif');
				} else if(target.classList.contains('serif')) {
					target.classList.add('selected');
					root.style.fontFamily = 'serif';
					localStorage.setItem('font_family_state', 'serif');
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
					//root.classList.remove('big-font-mode');
					//root.classList.remove('medium-font-mode');
					font_size_state = 'small';
					root.classList.add('font-small');
					root.classList.remove('font-medium');
					root.classList.remove('font-big');
					localStorage.setItem('font_size_state', 'small');
				} else if(target.classList.contains('medium')) {
					target.classList.add('selected');
					doc_root.style.fontSize = '22px';
					//root.classList.add('medium-font-mode');
					root.classList.remove('font-small');
					root.classList.add('font-medium');
					root.classList.remove('font-big');
					//root.classList.remove('big-font-mode');
					font_size_state = 'medium';
					localStorage.setItem('font_size_state', 'medium');
				} else if(target.classList.contains('big')) {
					target.classList.add('selected');
					doc_root.style.fontSize = '26px';
					//root.classList.add('big-font-mode');
					root.classList.remove('font-small');
					root.classList.remove('font-medium');
					root.classList.add('font-big');
					//root.classList.remove('medium-font-mode');
					font_size_state = 'big';
					localStorage.setItem('font_size_state', 'big');
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
					localStorage.setItem('letter_spacing_state', 'default');
				} else if(target.classList.contains('letter-spacing-medium')) {
					doc_root.style.letterSpacing = '1px';
					target.classList.add('selected');
					letter_spacing_state = 'medium';
					localStorage.setItem('letter_spacing_state', 'medium');
				} else if(target.classList.contains('letter-spacing-big')) {
					doc_root.style.letterSpacing = '2px';
					target.classList.add('selected');
					letter_spacing_state = 'big';
					localStorage.setItem('letter_spacing_state', 'big');
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
					localStorage.setItem('theme_color_state', 'black-on-white');
				} else if(target.classList.contains('white-on-black')) {
					document.body.classList.add('theme__white-on-black');
					document.body.classList.remove('theme__black-on-white');
					document.body.classList.remove('theme__lightblue-on-darkblue');
					target.classList.add('selected');
					localStorage.setItem('theme_color_state', 'white-on-black');
				} else if(target.classList.contains('lightblue-on-darkblue')) {
					document.body.classList.remove('theme__white-on-black');
					document.body.classList.remove('theme__black-on-white');
					document.body.classList.add('theme__lightblue-on-darkblue');
					target.classList.add('selected');
					localStorage.setItem('theme_color_state', 'lightblue-on-darkblue');
				}
			}

			if(letter_spacing_state == 'medium' && font_size_state == 'medium') {
				//accessibility_settings_block.classList.add('settings-fix');
			} else if(letter_spacing_state == 'big' && font_size_state == 'medium') {
				//accessibility_settings_block.classList.add('settings-fix__second');
			}
			 else {
				//accessibility_settings_block.classList.remove('settings-fix');
				//accessibility_settings_block.classList.remove('settings-fix__second');
			}

		}
	}

}

accessibilitySettingsInit();


}

accessibilityInit();

function changeContactBlock() {
	var contacts_and_schedule = document.querySelectorAll('.accessibility .info a')[0];
	contacts_and_schedule.innerHTML = gettext('Contacts and schedule');
}