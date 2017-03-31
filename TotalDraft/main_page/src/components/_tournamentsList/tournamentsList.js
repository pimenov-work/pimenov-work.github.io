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