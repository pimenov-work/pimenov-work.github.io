/***** Detect visibility *****/

function checkVisible(elm) {

  var rect = elm.getBoundingClientRect();
  var viewHeight = Math.max(document.documentElement.clientHeight, window.innerHeight);

  function detectVisible() {
  	return !(rect.bottom < 0 || rect.top - viewHeight >= 0);
  }

  return detectVisible();
}

function detectVisibility(element, doWhenVisible, listenerName) {
	var counterOfVeiw = 0;

	listenerName = window.addEventListener('scroll', function() {
    if(counterOfVeiw == 0 && checkVisible(element)) {
      doWhenVisible();
      counterOfVeiw = 1;
    } 
    if (counterOfVeiw > 0) {
    	window.removeEventListener('scroll', listenerName);
    }
  });
}

/***** Detect visibility end *****/

window.addEventListener('load', initScreen);

function initScreen() {

window.addEventListener('scroll', parallaxAnim);

	// Parallaxed nodes
	var player_1 = document.getElementsByClassName('player-1')[0],
			bg = document.getElementsByClassName('bg')[0],
			player_2 = document.getElementsByClassName('player-2')[0],
			ball = document.getElementsByClassName('ball')[0],
			bg_players = document.getElementsByClassName('bg-players')[0];

	// Set parallax for nodes
	function parallaxAnim() {
		parallax(ball, 60, -400, 60);
		parallax(player_1, 50, -400, 65);
		parallax(player_2, -30, 450, 80);
		parallax(bg_players, -70, 600, 200);
	}

	// Magic parallax function
	function parallax(element, x, y, z) {
		// Detect scroll
		var yOffset = window.pageYOffset;
		// Move elements x/y/z axis
		element.style.transform = 'translate3d('+ yOffset / x + 'px,' + yOffset / y + 'px,' + yOffset / z + 'px)';
	}

}
/**** Slider script *****/

window.addEventListener('load', initSlider);

function initSlider() {

	var initSlider = document.getElementById('initSlider');

	// Slider nodes
	var sliderControl = document.getElementsByClassName('sliderControl'),
			descriptionBlock = document.getElementsByClassName('descriptionBlock'),
			sliderIcon = document.getElementsByClassName('sliderIcon');

	// Arrays for slider noder
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
    activeIcon.classList.remove('currentIcon');

		// Add active state for control and show new slide content
		this.classList.add('active');
    descriptionBlocks[currentSlider].classList.add('currentDescription');
    sliderIcons[currentSlider].classList.add('currentIcon');

		// Remember checked slide control and slide content
		activeControl = this;
    activeDescription = descriptionBlocks[currentSlider];
    activeIcon = sliderIcons[currentSlider];
	}

	// Slider content nodes
	var sliderContent = document.querySelectorAll('.contentTitle, .sliderDescriptions')
	var sliderControls = document.getElementById('sliderControls');

	// Show slider content when user scroll to it
	detectVisibility(sliderControls, animateInitSlider, 'sliderControlsListener');

	function animateInitSlider() {
		console.log('animate')
		for( i = 0; i < sliderContent.length; i++ ) {
			sliderContent[i].classList.add('showSlideContent')
		}
	}

	console.log(sliderControls.getBoundingClientRect())
	console.log(Math.max(document.documentElement.clientHeight, window.innerHeight))

}

/**** Slider script end *****/


