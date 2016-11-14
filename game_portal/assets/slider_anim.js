// IE fix

if (document.documentMode || /Edge/.test(navigator.userAgent)) {

	var animated_element = document.getElementsByClassName('animated-element');

	animated_element[0].classList.add('animated-element_1-ie');

	function getElementWidth(element, element_width) {
		element_width = element.offsetWidth;
		return element_width;
	}

	function setHeight() { /* The height, which depends on the width */
		animated_element[0].style.height = getElementWidth(animated_element[0]) / 1.142 + 'px';
	}

	setHeight();
	window.addEventListener('resize', setHeight); /* Reset height, when width change */

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