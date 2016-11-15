window.addEventListener('load', sliderScriptInit);

function sliderScriptInit() {

	function getElementWidth(element, element_width) { /* Need for IE and correct proportions */
		element_width = element.offsetWidth;
		return element_width;
	}

	var animated_element = document.getElementsByClassName('animated-element');

	function setProperties(current_width) { /* Set dynamic properties */
		current_width = getElementWidth(animated_element[0]);
		animated_element[0].style.height = current_width / 1.142 + 'px';
		animated_element[0].style.fontSize = current_width / 19.5 + 'px';
	}

	setProperties();

	window.addEventListener('resize', setProperties); /* Reset properties, when resizing */

	// IE fix
	if (document.documentMode || /Edge/.test(navigator.userAgent)) {
		animated_element[0].classList.add('animated-element_1-ie');
	}

	var slider_lines = document.getElementsByClassName('line'),
			lenght_of_path;

	for( i = 0; i < slider_lines.length; i++) {
		lenght_of_path = slider_lines[i].getTotalLength();
		slider_lines[i].style.strokeDasharray = lenght_of_path;;

		if (!slider_lines[i].classList.contains('invert_path_moving')) {
			slider_lines[i].style.strokeDashoffset = lenght_of_path;
		} else {
			slider_lines[i].style.strokeDashoffset = lenght_of_path * -1;
		}
	}

}