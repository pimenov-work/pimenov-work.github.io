/**** Slider script *****/

window.addEventListener('load', initSliders);

function initSliders() {

	var initSlider = document.getElementById('initSlider');

	// Slider nodes
	var sliderControl = document.getElementsByClassName('sliderControl'),
			descriptionBlock = document.getElementsByClassName('descriptionBlock'),
			sliderIcon = document.getElementsByClassName('sliderIcon');

	// Arrays for slider nodes
	var sliderControls = [],
			descriptionBlocks = [],
			sliderIcons = [];

	// Variables for remembering last checked slide
	var activeControl,
			activeDescription,
			activeIcon;

	for( i = 0; i < sliderControl.length; i++ ) {
		// Save all nodes in array
		sliderControls.push(sliderControl[i]);
		descriptionBlocks.push(descriptionBlock[i]);
		sliderIcons.push(sliderIcon[i]);

		// Set click-listener for all controls
		sliderControl[i].addEventListener('click', changeSliderContent);

	}

	// Set current slider
	var currentSlider = 0;

	function setSliderState() {
		// Initial initial state for slider objects
		sliderControl[currentSlider].classList.add('active');
		descriptionBlocks[currentSlider].classList.add('currentDescription');
		sliderIcons[currentSlider].classList.add('currentIcon');

		// Set initial active objects
		activeControl = sliderControl[currentSlider];
		activeDescription = descriptionBlocks[currentSlider];
		activeIcon = sliderIcons[currentSlider];
	}

	setSliderState();

	function changeSliderContent(event) {
		// Detect count of slider that was clicked
    var target = event.target;
    var parent = target.parentNode;
    for ( var i = 0; i < parent.children.length; i++ ) {
    	if ( parent.children[i] == target ) {
    		currentSlider = i;
    	}
    }

		// Remove active/visible state from last checked slide
		activeControl.classList.remove('active');
    activeDescription.classList.remove('currentDescription');
    activeIcon.classList.remove('showIcon');

		// Add active state for control and show new slide content
		this.classList.add('active');
    descriptionBlocks[currentSlider].classList.add('currentDescription');

    // sliderIcons[currentSlider].classList.add('currentIcon');
    sliderIcon[currentSlider].classList.add('showIcon');

		// Remember checked slide control and slide content
		activeControl = this;
    activeDescription = descriptionBlocks[currentSlider];
    activeIcon = sliderIcons[currentSlider];
	}

	// Slider left-aside background
	var initSliderBg = document.getElementsByClassName('initSliderBg')[0];

	// Slider content nodes
	var sliderContent = document.querySelectorAll('.contentTitle, .sliderDescriptions')
	var sliderControls = document.getElementById('sliderControls');

	// Show slider content when user scroll to it
	detectVisibility(sliderControls, animateInitSlider, 'sliderControlsListener');

	function animateInitSlider() {
		for( i = 0; i < sliderContent.length; i++ ) {
			sliderContent[i].classList.add('showSlideContent');
		}
		// initSliderBg.classList.add('showSliderBg');
		sliderIcon[0].classList.add('showIcon');
		verticalLines[0].classList.add('showVerticalLines');
		iconWraper.classList.add('showWraper');

	}

	// Slider animation
	var sliderIcon = document.getElementsByClassName('sliderIcon'),
			verticalLines = document.getElementsByClassName('verticalLines'),
			iconWraper = document.getElementsByClassName('iconWraper')[0],
			sliderIconPaths = document.querySelectorAll('.sliderIcon *'),
			verticalLinesPaths = document.querySelectorAll('.verticalLines *'),
			pathLength;

	for( i = 0; i < sliderIconPaths.length; i++ ) {
		pathLength = sliderIconPaths[i].getTotalLength();
		sliderIconPaths[i].style.strokeDasharray = pathLength;
		sliderIconPaths[i].style.strokeDashoffset = pathLength;
	}

	for( i = 0; i < verticalLinesPaths.length; i++ ) {
		pathLength = verticalLinesPaths[i].getTotalLength();
		verticalLinesPaths[i].style.strokeDasharray = pathLength;
		verticalLinesPaths[i].style.strokeDashoffset = pathLength;
	}

	// document.addEventListener('click', function() {
	// 	for( i = 0; i < verticalLines.length; i++ ) {
	// 		verticalLines[i].classList.add('showVerticalLines');
	// 	}
	// });

}

/**** Slider script end *****/