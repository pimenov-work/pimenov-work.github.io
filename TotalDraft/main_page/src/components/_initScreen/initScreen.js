window.addEventListener('load', initScreen);

function initScreen() {

	// Parallaxed nodes
	var player_1 = document.getElementsByClassName('player-1')[0],
			bg = document.getElementsByClassName('bg')[0],
			player_2 = document.getElementsByClassName('player-2')[0],
			ball = document.getElementsByClassName('ball')[0],
			bg_players = document.getElementsByClassName('bg-players')[0],
			grass = document.getElementsByClassName('grass')[0],
			parallaxBlock = document.getElementsByClassName('parallax')[0];

	var yOffset;
	var currentScale, defaultScale = 0;
	var windowHeight = document.documentElement.clientHeight;
	var start = 0;
	var end = windowHeight * 4;


	window.addEventListener('scroll', parallaxAnim);

	// Set parallax for nodes
	function parallaxAnim() {
		yOffset = window.pageYOffset;
		// parallax(ball, 42, -300, 500);
		// parallax(player_1, 50, -300, 500);
		// parallax(player_2, 180, -450, 500);
		// parallax(bg_players, 250, -600, 500);
		// parallax(bg, 80, -600, 500);

		scaleElement(grass, 0.1);
		scaleElement(ball, 0.11);
		scaleElement(player_1, 0.09);
		scaleElement(player_2, 0.05);
		scaleElement(bg_players, 0.01);

		// Init again scroll to slider
		// if ( window.pageYOffset <= (document.documentElement.clientHeight * 3)) {
		// 	if(scrollState == true) {
		// 		scrollState = false;
		// 	}
		// }

	}

	function scaleElement(element, scaleShift) {
		shift = (yOffset - start) * (scaleShift - defaultScale) / end;
		currentScale = defaultScale + shift;
		// Magic value '5px' need for fix bug in FF
		element.style.transform = 'translateZ(0) scale(' + (1 + currentScale) + ')';
	}

	// Magic parallax function
	function parallax(element, x, y, z) {
		// Detect scroll
		yOffset = window.pageYOffset;
		// Move elements x/y/z axis
		element.style.transform = 'translate3d('+ yOffset / x + 'px,' + yOffset / y + 'px,' + yOffset / z + 'px)';
	}

	setTimeout(function() {
			window.scrollTo(0, document.documentElement.clientHeight);
			setTimeout(function() {
				parallaxBlock.style.transition = 'transform 0.25s ease-out';
			}, 2300);
	}, 0);

	// Hide slider
	var initSlider = document.getElementById('initSlider'),
			initScreen = document.getElementsByClassName('initScreen')[0],
			toning = document.getElementsByClassName('toning')[0],
			currentYOffset,
			scrollPosition = 'onSlider';

	detectVisibility(initSlider, hideInitScreen, 'initSliderListener');

	function hideInitScreen() {
		window.addEventListener('scroll', hideScreen);
		// window.addEventListener('scroll', showScreen);
	}

	var currentOpacity, defaultOpacity = 0.5, finalOpacity = 0.9;
	var windowHeight = document.documentElement.clientHeight;
	var fadeOutStartYOffset = windowHeight * 2.5;
	var fadeOutDurationOffset = windowHeight * 1.5;
	var yStep = 0;
	var scrollState = false;

	function hideScreen() {
		currentYOffset = window.pageYOffset;
		opacityShift = (currentYOffset - fadeOutStartYOffset) * (finalOpacity - defaultOpacity) / fadeOutDurationOffset;
		currentOpacity = defaultOpacity + opacityShift;
		if( currentOpacity >= defaultOpacity) {
			toning.style.opacity = currentOpacity;
		}

		// // Scroll once time
		// if( scrollState == false) {
		// 	scrollToSlider();
		// }
		// // Disable scroll func
		// scrollState = true;

	}

	// var scrollPos = document.getElementById('scrollPos');

	// function showScreen() {
	// 	if( window.pageYOffset < windowHeight * 4 ) {
	// 		doScrolling(scrollPos, 1800);
	// 		console.log('SOOOOOOOOOO')
	// 	}
	// }

	// function scrollToSlider() {
	// 	// doScrolling(initSlider, 800);

	// 	// // Disable scroll
	// 	// disableScroll();
	// 	// setTimeout(enableScroll, 800);
	// }

	// var scrollIcon = document.getElementsByClassName('scrollIcon')[0];

	// scrollIcon.addEventListener('click', function(){
	// 	// Disable scroll
	// 	disableScroll();
	// 	setTimeout(enableScroll, 3000);
	// 	alert('1')
	// 	doScrolling(initSlider, 3000);

	// });

	// var counterX = 0;

	// window.addEventListener('click', function() {

	//   if( counterX % 2 ) {
	//   	scrollUnderSlider();
	//   } else scrollToSlider();

	//   counterX++;

	// })

	var currentYScroll,
			stateOfScrollX = 'init';

	function scrollAboveSlider() {
		doScrollingToPos(initSlider.offsetTop - windowHeight, 500);
	}

	function scrollToSlider() {
			doScrollingToPos(initSlider.offsetTop, 500);
	}

	// window.addEventListener('scroll', scrollSwitcher);

	// function scrollSwitcher() {
	// 	currentYScroll = window.pageYOffset;

	// 	if(currentYScroll < initSlider.offsetTop) {
	// 		scrollAboveSlider();
	// 	}

	// 	// if(currentYScroll > initSlider.offsetTop - initSlider.getBoundingClientRect().height) {
	// 	// 	console.log('123123')
	// 	// }

	// 	// We see slider and scroll to it
	// 	if(currentYScroll > initSlider.offsetTop - initSlider.getBoundingClientRect().height) {
	// 		scrollToSlider();
	// 		console.log(stateOfScrollX);
	// 	}
	// }

	window.addEventListener('wheel', swithScrollPos);

	function swithScrollPos(wheelEvent) {
		currentYScroll = window.pageYOffset;
		if(currentYScroll > initSlider.offsetTop - windowHeight - 100 && currentYScroll < initSlider.offsetTop) {
			if(wheelEvent.deltaY > 0 ) {
				scrollToSlider();
				disableScroll();
				setTimeout(function() {
					enableScroll();
				}, 1000)
			}
		}

		if(currentYScroll > initSlider.offsetTop - windowHeight && currentYScroll < initSlider.offsetTop + 100) {
			if(wheelEvent.deltaY < 0 ) {
				scrollAboveSlider();
				disableScroll();
				setTimeout(function() {
					enableScroll();
				}, 1000)
			}
		}
		// if(currentYScroll > initSlider.offsetTop - initSlider.getBoundingClientRect().height) {

		// 	if(wheelEvent.deltaY > 0 ) {
		// 		scrollToSlider();
		// 	}
		// 	if(wheelEvent.deltaY < 0 ) {
		// 		scrollAboveSlider();
		// 	}

		// }
	}

}