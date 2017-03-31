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
// Scroll to element
function doScrolling(elementY, duration) { 
  var startingY = window.pageYOffset;
  var diff = elementY.offsetTop - startingY;
  var start;

  // Bootstrap our animation - it will get called right before next frame shall be rendered.
  window.requestAnimationFrame(function step(timestamp) {
    if (!start) start = timestamp
    // Elapsed miilseconds since start of scrolling.
    var time = timestamp - start
    // Get percent of completion in range [0, 1].
    var percent = Math.min(time / duration, 1)

    window.scrollTo(0, startingY + diff * percent)

    // Proceed with animation as long as we wanted it to.
    if (time < duration) {
      window.requestAnimationFrame(step)
    }
  })
}


// Scroll to position
function doScrollingToPos(yPos, duration) { 
  var startingY = window.pageYOffset;
  var diff = yPos - startingY;
  var start;

  // Bootstrap our animation - it will get called right before next frame shall be rendered.
  window.requestAnimationFrame(function step(timestamp) {
    if (!start) start = timestamp
    // Elapsed miilseconds since start of scrolling.
    var time = timestamp - start
    // Get percent of completion in range [0, 1].
    var percent = Math.min(time / duration, 1)

    window.scrollTo(0, startingY + diff * percent)

    // Proceed with animation as long as we wanted it to.
    if (time < duration) {
      window.requestAnimationFrame(step)
    }
  })
}


// Reserve scroll func
/***
    Smoothly scroll element to the given target (element.scrollTop)
    for the given duration

    Returns a promise that's fulfilled when done, or rejected if
    interrupted
 ***/
var smooth_scroll_to = function(element, target, duration) {
    target = Math.round(target);
    duration = Math.round(duration);
    if (duration < 0) {
        return Promise.reject("bad duration");
    }
    if (duration === 0) {
        element.scrollTop = target;
        return Promise.resolve();
    }

    var start_time = Date.now();
    var end_time = start_time + duration;

    var start_top = element.scrollTop;
    var distance = target - start_top;

    // based on http://en.wikipedia.org/wiki/Smoothstep
    var smooth_step = function(start, end, point) {
        if(point <= start) { return 0; }
        if(point >= end) { return 1; }
        var x = (point - start) / (end - start); // interpolation
        return x*x*(3 - 2*x);
    }

    return new Promise(function(resolve, reject) {
        // This is to keep track of where the element's scrollTop is
        // supposed to be, based on what we're doing
        var previous_top = element.scrollTop;

        // This is like a think function from a game loop
        var scroll_frame = function() {
            if(element.scrollTop != previous_top) {
                reject("interrupted");
                return;
            }

            // set the scrollTop for this frame
            var now = Date.now();
            var point = smooth_step(start_time, end_time, now);
            var frameTop = Math.round(start_top + (distance * point));
            element.scrollTop = frameTop;

            // check if we're done!
            if(now >= end_time) {
                resolve();
                return;
            }

            // If we were supposed to scroll but didn't, then we
            // probably hit the limit, so consider it done; not
            // interrupted.
            if(element.scrollTop === previous_top
                && element.scrollTop !== frameTop) {
                resolve();
                return;
            }
            previous_top = element.scrollTop;

            // schedule next frame for execution
            setTimeout(scroll_frame, 0);
        }

        // boostrap the animation process
        setTimeout(scroll_frame, 0);
    });
}


// smooth_scroll_to(document.body, 3600, 2000);
// Disable/enable scroll

var keys = {37: 1, 38: 1, 39: 1, 40: 1};

function preventDefault(e) {
  e = e || window.event;
  if (e.preventDefault)
      e.preventDefault();
  e.returnValue = false;  
}

function preventDefaultForScrollKeys(e) {
    if (keys[e.keyCode]) {
        preventDefault(e);
        return false;
    }
}

function disableScroll() {
  if (window.addEventListener) // older FF
      window.addEventListener('DOMMouseScroll', preventDefault, false);
  window.onwheel = preventDefault; // modern standard
  window.onmousewheel = document.onmousewheel = preventDefault; // older browsers, IE
  window.ontouchmove  = preventDefault; // mobile
  document.onkeydown  = preventDefaultForScrollKeys;
}

function enableScroll() {
    if (window.removeEventListener)
        window.removeEventListener('DOMMouseScroll', preventDefault, false);
    window.onmousewheel = document.onmousewheel = null; 
    window.onwheel = null; 
    window.ontouchmove = null;  
    document.onkeydown = null;  
}

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
var selectButton = document.getElementsByClassName('selectButton')[0],
		close = document.getElementsByClassName('closeTournaments')[0],
		tournamentList = document.getElementsByClassName('tournamentList')[0];

close.addEventListener('click', closeTournaments);
selectButton.addEventListener('click', openTournaments);

function openTournaments() {
	tournamentList.classList.toggle('showTournamentList');
	if(tournamentList.classList.contains('showTournamentList')) {
		document.body.style.overflow = 'hidden';
	}
}

function closeTournaments() {
	tournamentList.classList.toggle('showTournamentList');
	if(!tournamentList.classList.contains('showTournamentList')) {
		document.body.style.overflow = 'visible';
	}
}

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
window.addEventListener('load', initTournamentList);

function initTournamentList() {
	var tournament = document.getElementsByClassName('tournament'),
			tournamentBlock = document.getElementsByClassName('tournamentBlock')[0],
			introText = document.getElementById('introText'),
			introduction = document.getElementsByClassName('introduction')[0],
			list = document.getElementsByClassName('list')[0],
			goBack = document.getElementsByClassName('goBack')[0],
			tournamentTitle = document.getElementsByClassName('tournamentTitle')[0];

	for ( i = 0; i < tournament.length; i++ ) {
		tournament[i].addEventListener('click', function() {
			tournamentBlock.style.display = 'block';
			introText.style.display = 'none';
			introduction.innerHTML += '<div class="tournamentTitle">' +
																	'<img class="icon" src="images/icon.png">' +
																	'<h3 class="name"> Английская премьер лига </h3>' +
																'</div>';
			list.style.overflow = 'hidden';

			// Redefine nodes
			tournament = document.getElementsByClassName('tournament'),
			tournamentBlock = document.getElementsByClassName('tournamentBlock')[0],
			introText = document.getElementById('introText'),
			introduction = document.getElementsByClassName('introduction')[0],
			list = document.getElementsByClassName('list')[0],
			goBack = document.getElementsByClassName('goBack')[0],
			tournamentTitle = document.getElementsByClassName('tournamentTitle')[0];

			goBack.style.display = 'block';

			goBack.addEventListener('click', function() {
				tournamentBlock.style.display = 'none';
				introText.style.display = 'block';
				tournamentTitle.remove();
				list.style.overflow = 'auto';
				goBack.style.display = 'none';
			})
		})
	}
}
window.addEventListener('load', initTournament);

function initTournament() {

	var windowHeight,
			elementHeight,
			tournamentBlock = document.getElementsByClassName('tournamentBlock')[0],
			tournament = document.getElementsByClassName('tournament'),
			line = document.getElementsByClassName('line')[0],
			lineHeightX = 0,
			scrollHeight,
			itemsWrapper = document.getElementById('itemsWrapper');

	tournamentBlock.addEventListener('wheel', function() {

		setTimeout(function() {
			windowHeight = document.documentElement.clientHeight;
			scrollHeight = tournamentBlock.scrollTop + windowHeight;

			lineHeightX = windowHeight * scrollHeight / parseInt(getComputedStyle(itemsWrapper).height, 10);

			line.style.height = lineHeightX + 'px';

			console.log(windowHeight);
			console.log(scrollHeight);
			console.log(parseInt(getComputedStyle(itemsWrapper).height, 10));
			console.log('========' + lineHeightX);
			console.log('-------------------------');

			// console.log(getComputedStyle(tournamentBlock).height);
			// tournamentBlock.style.backgroundColor = 'red';
			// console.log(windowHeight * windowHeight);

		}, 2000)

	});

}