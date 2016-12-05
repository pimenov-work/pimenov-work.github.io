function accessibility() {

	document.body.classList.add('accessibility'); // At first set accessibility mode

	var root = document.getElementsByClassName('body')[0];

	var header = document.querySelectorAll('.main-header .container')[0];

	var menu_bar = document.createElement('section'); // Create menu element on top of the page

	menu_bar.classList.add('menu-bar');

	menu_bar.innerHTML = '<strong> Menu </strong>'; // Then add content to menu_bar

	header.insertBefore(menu_bar, header.firstChild); // At last add accessibility elements to the page

}

accessibility(); // Init accessibility