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