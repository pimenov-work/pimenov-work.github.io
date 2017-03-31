window.addEventListener('load', initTutorial);

function initTutorial() {
	
	var howToButton = document.getElementsByClassName('howToButton')[0],
			tutorial = document.getElementsByClassName('tutorial')[0],
			close = document.getElementsByClassName('close')[0],
			parallaxBlock = document.getElementsByClassName('parallax')[0],
			tutorialOpen = false,
			slideContent = document.getElementsByClassName('slideContent');

	howToButton.addEventListener('click', showTutorial);
	close.addEventListener('click', hideTutorial);
	window.addEventListener('keydown', hideTutorialEsc);

	function showTutorial() {
		document.body.style.overflow = 'hidden';

		// Remove transition after pop-up open,
		// because with transition we see scroll lags
		// parallaxBlock.style.transition = 'none';

		tutorial.classList.add('showTutorial');
		tutorialOpen = true;

		// Anit animation
		setTimeout(function() {
			circleWrapper.classList.add('showCircleWrapper');
			linesWrapper.classList.add('showLinesWrapper');
			tutorialIcon[0].classList.add('showIcon');
			slideContent[0].style.opacity = '1';
			slideContent[0].style.transform = 'translateZ(0) translateY(0)';
		}, 500)
	}

	function hideTutorial() {
		document.body.style.overflow = 'visible';

		tutorial.classList.remove('showTutorial');
		tutorialOpen = false;

		circleWrapper.classList.remove('showCircleWrapper');
		linesWrapper.classList.remove('showLinesWrapper');
		tutorialIcon[0].classList.remove('showIcon');
	}

	function hideTutorialEsc(closeEvent) {
		// Do something only when tutorial open
		if(tutorialOpen == false) {
			return false;
		}
		if( closeEvent.keyCode == 27) {
			hideTutorial();
		}
	}

	var tutorial = document.getElementsByClassName('tutorial')[0],
			track = document.getElementsByClassName('track')[0],
			windowHeight = document.documentElement.clientHeight,
			scrollTotal = 0,
			itNotMove = true,
			trackHeight = parseInt(getComputedStyle(track).height, 10),
			sliderCounter = 0,
			indicator = document.getElementsByClassName('indicator'),
			slideBg = document.getElementsByClassName('slideBg'),
			tutorialIcon = document.getElementsByClassName('tutorialIcon');

	window.addEventListener('resize', refreshDynamicVariables);

	function refreshDynamicVariables() {
		windowHeight = document.documentElement.clientHeight;
	}

	tutorial.addEventListener('wheel', wheelChangeSlide);
	// Detect when slider stoped and unblocking scroll
	// track.addEventListener('transitionend', trackStoped);
	// Work only when slider open
	window.addEventListener('keydown', arrowChangeSlide);

	function wheelChangeSlide(wheelEvent) {
		// Do something only when tutorial open
		if(tutorialOpen == false) {
			return false;
		}
		// Manipulate slider only when slider not move
		if(itNotMove) {
			// If we scroll down
			if(wheelEvent.deltaY > 0 ) {
				if(sliderCounter >= 3) {
					return false;
				}
				// Block scroll when slider moving
				blockScroll();
				// Set actual slider number
				sliderCounter++;
				goAhead(sliderCounter);
			}
			// If we scroll up
			if(wheelEvent.deltaY < 0 ) {
				if(sliderCounter < 1) {
					return false;
				}
				// Block scroll when slider moving
				blockScroll();
				// Set actual slider number
				sliderCounter--;
				goBack(sliderCounter);
			}
		}
	}

	function arrowChangeSlide(arrowEvent) {
		// Do something only when tutorial open
		if(tutorialOpen == false) {
			return false;
		}
		// Manipulate slider only when slider not move
		if(itNotMove) {
			// When we scroll down
			if( arrowEvent.keyCode == 40) {
				// If we scroll more than bottom limit
				if(sliderCounter >= 3) {
					return false;
				}
				// Block scroll when slider moving
				blockScroll();
				// Set actual slider number
				sliderCounter++;
				goAhead(sliderCounter);
			}
			// When we scroll up
			if( arrowEvent.keyCode == 38 ) {
				// If we scroll more than top limit
				if(sliderCounter < 1) {
					return false;
				}
				// Block scroll when slider moving
				blockScroll();
				// Set actual slider number
				sliderCounter--;
				goBack(sliderCounter);
			}
		}
	}

	function blockScroll() {
		itNotMove = false;
		setTimeout(function() {
			itNotMove = true;
		}, 1000)
	}

	function scrollUp() {
		//scrollTotal = scrollTotal - windowHeight;
		//track.style.transform = 'translateY(-' + scrollTotal + 'px)';
	}

	function scrollDown() {
		//scrollTotal = scrollTotal + windowHeight;
		//track.style.transform = 'translateZ(0) translateY(-' + scrollTotal + 'px)';
	}

	function goAhead(i) {
		// Set active state for progress line
		indicator[i].classList.add('active');
		// Set state for current slide - 1
		indicator[i - 1].classList.add('previous');

		// Show current slide and hide previous
		slideBg[i].style.zIndex = '1';
		slideBg[i].style.opacity = '1';

		// Show current icon and hide previous
		tutorialIcon[i - 1].classList.remove('currentIcon');
		tutorialIcon[i].classList.add('currentIcon');
		tutorialIcon[i - 1].classList.remove('showIcon');
		tutorialIcon[i].classList.add('showIcon');

		// Some shit
		// setTimeout(function() {
		// 	slideContent[i].classList.add('show');
		// }, 500)
		// slideContent[i - 1].classList.remove('show');
		setTimeout(function() {
			slideContent[i].style.opacity = '1';
			slideContent[i].style.transform = 'translateZ(0) translateY(0)';
		}, 500);
		slideContent[i - 1].style.opacity = '0';
		setTimeout(function() {
			slideContent[i - 1].style.transform = 'translateZ(0) translateY(0px)';
		}, 500);
	}

	function goBack(i) {
		indicator[i].classList.add('active');
		indicator[i].classList.remove('previous');
		indicator[i + 1].classList.remove('active');
		indicator[i + 1].classList.remove('previous');

		// Timeout need for transition effect
		setTimeout(function() {
			slideBg[i + 1].style.zIndex = '0';
		}, 500)
		slideBg[i + 1].style.opacity = '0';

		tutorialIcon[i].classList.add('currentIcon');
		tutorialIcon[i].classList.add('showIcon');
		tutorialIcon[i + 1].classList.remove('currentIcon');
		tutorialIcon[i + 1].classList.remove('showIcon');

		// Some shit
		setTimeout(function() {
			slideContent[i].style.opacity = '1';
			slideContent[i].style.transform = 'translateZ(0) translateY(0)';
		}, 500)
		slideContent[i + 1].style.opacity = '0';
		setTimeout(function() {
			slideContent[i + 1].style.transform = 'translateZ(0) translateY(0px)';
		}, 500);
	}

	// Icon animation
	var tutorialIconPaths = document.querySelectorAll('.tutorialIcon *'),
			circleWrapper = document.getElementsByClassName('circleWrapper')[0],
			linesWrapper = document.getElementsByClassName('linesWrapper')[0],
			linesWrapperPaths = document.querySelectorAll('.linesWrapper *');

	for( i = 0; i < tutorialIconPaths.length; i++ ) {
		pathLength = tutorialIconPaths[i].getTotalLength();
		tutorialIconPaths[i].style.strokeDasharray = pathLength;
		tutorialIconPaths[i].style.strokeDashoffset = pathLength;
	}

	for( i = 0; i < linesWrapperPaths.length; i++ ) {
		pathLength = linesWrapperPaths[i].getTotalLength();
		linesWrapperPaths[i].style.strokeDasharray = pathLength;
		linesWrapperPaths[i].style.strokeDashoffset = pathLength;
	}

}