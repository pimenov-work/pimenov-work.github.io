window.addEventListener('load', initWidgetScript);

function initWidgetScript() {

	function widgetWidth() {
		var widget_width = document.getElementById('widget_width'),
				widget_component = document.getElementById('widget_component');

		widget_width.addEventListener('input', setWidgetWidth);

		function setWidgetWidth() {
			widget_component.style.width = this.value + 'px';
		}
	}

	// Global
	var tab_counter = 0;

	function tabSwitch() {
		var native_tab = document.getElementById('native_tab'),
				native_code = document.getElementById('native_code'),
				iframe_tab = document.getElementById('iframe_tab'),
				iframe_code = document.getElementById('iframe_code'),
				tab = document.getElementsByClassName('tab');

		for( i = 0; i < tab.length; i++ ) {
			tab[i].addEventListener('click', openTabBlock);
		}

		function openTabBlock(event) {
			var tab = event.target.getAttribute('id');
			switch (tab) {
				case 'iframe_tab':
					this.classList.add('active');
					native_tab.classList.remove('active');
					native_tab.classList.remove('translate-tab');
					iframe_code.classList.remove('hide_code');
					native_code.classList.remove('show_code');
					break;
				case 'native_tab':
					this.classList.add('active');
					iframe_tab.classList.remove('active');
					native_tab.classList.add('translate-tab');
					iframe_code.classList.add('hide_code');
					native_code.classList.add('show_code');
					break;
				default:
					console.log('widget_module: tab error')
			}
			tab_counter++;
		}
	}

	function sectionSwitch() {
		var select_counter = 1;

		var more_options = document.getElementById('more_options'),
			preview = document.getElementById('preview'),
			button_initial_data = more_options.innerHTML;


		more_options.addEventListener('click', switchBlock);

		function switchBlock(event) {
			var button = event.target;
			if(select_counter % 2) {
				more_options.style.color = 'transparent';
				setTimeout(function() {
					more_options.innerHTML = more_options.dataset.other_button;
					more_options.style.color = 'black';
				}, 50)
				options.classList.add('show-more-options');
				options.classList.remove('hide-more-options');
			} else {
				options.classList.add('hide-more-options');
				more_options.style.color = 'transparent';
				setTimeout(function() {
					more_options.innerHTML = button_initial_data;
					more_options.style.color = 'black';
				}, 50)
			}
			select_counter++;
		}
	}

	function checkboxTransitionFix() {
		var checkboxes = document.querySelectorAll('input[type="checkbox"]');

		for( i = 0; i < checkboxes.length; i++ ) {
			checkboxes[i].addEventListener('click', checkTransitionFix);
		}

		function checkTransitionFix(event) {
			var target = event.target;
			if (target.checked) {
		      setTimeout(function() {
		      	target.classList.add('checked');
		      }, 100)
		   } else {
		   		setTimeout(function() {
		      	target.classList.remove('checked');
		      }, 100)
		   }
		}
	}

	function copyCodeAlert() {
		var copy_code = document.getElementById('copy_code'),
			iframe_code = document.getElementById('iframe_code'),
			native_code = document.getElementById('native_code');

		copy_code.addEventListener('click', showCopiedAlert);

		function showCopiedAlert() {
			if( tab_counter % 2 ) { // Copy code
				copyTextToClipboard(native_code.value);
			} else {
				copyTextToClipboard(iframe_code.value);
			}
			copy_code.classList.add('show-copy-allert');
			setTimeout(function() {
				copy_code.classList.remove('show-copy-allert');
			}, 2000	)
		}
	}


	// Init modules
	// widgetWidth(); // Raw width-control module
	tabSwitch();
	sectionSwitch();
	checkboxTransitionFix();
	copyCodeAlert();



	///****** Copy code module ******//
	// source: http://stackoverflow.com/questions/400212/how-do-i-copy-to-the-clipboard-in-javascript
    // enhancement with special case for IEs, otherwise the temp textarea will be visible

    function detectIE() {
        var ua = window.navigator.userAgent;

        var msie = ua.indexOf('MSIE ');
        if (msie > 0) {
            // IE 10 or older => return version number
            return parseInt(ua.substring(msie + 5, ua.indexOf('.', msie)), 10);
        }

        var trident = ua.indexOf('Trident/');
        if (trident > 0) {
            // IE 11 => return version number
            var rv = ua.indexOf('rv:');
            return parseInt(ua.substring(rv + 3, ua.indexOf('.', rv)), 10);
        }

        // other browser or edge
        return false;
    }

    function copyTextToClipboard(text) {
        if (detectIE()) {
            try {
                window.clipboardData.setData('Text', text);
                console.log('Copying text command via IE-setData');
            } catch (err) {
                console.log('Oops, unable to copy via IE-setData');
            }
        }
        else {

            var textArea = document.createElement("textarea");

            //
            //  This styling is an extra step which is likely not required. 
            //
            // Why is it here? To ensure:
            // 1. the element is able to have focus and selection.
            // 2. if element was to flash render it has minimal visual impact.
            // 3. less flakyness with selection and copying which might occur if
            //    the textarea element is not visible.
            //
            // The likelihood is the element won't even render, not even a flash,
            // so some of these are just precautions. 
            // 
            // However in IE the element
            // is visible whilst the popup box asking the user for permission for
            // the web page to copy to the clipboard. To prevent this, we are using 
            // the detectIE workaround.

            // Place in top-left corner of screen regardless of scroll position.
            textArea.style.position = 'fixed';
            textArea.style.top = 0;
            textArea.style.left = 0;

            // Ensure it has a small width and height. Setting to 1px / 1em
            // doesn't work as this gives a negative w/h on some browsers.
            textArea.style.width = '2em';
            textArea.style.height = '2em';

            // We don't need padding, reducing the size if it does flash render.
            textArea.style.padding = 0;

            // Clean up any borders.
            textArea.style.border = 'none';
            textArea.style.outline = 'none';
            textArea.style.boxShadow = 'none';

            // Avoid flash of white box if rendered for any reason.
            textArea.style.background = 'transparent';


            textArea.value = text;

            document.body.appendChild(textArea);

            textArea.select();

            try {
                var successful = document.execCommand('copy');
                var msg = successful ? 'successful' : 'unsuccessful';
                console.log('Copying text command was ' + msg);
            } catch (err) {
                console.log('Oops, unable to copy');
            }

            document.body.removeChild(textArea);
        }

    }

}