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