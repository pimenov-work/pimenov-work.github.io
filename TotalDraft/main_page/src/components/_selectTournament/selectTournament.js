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