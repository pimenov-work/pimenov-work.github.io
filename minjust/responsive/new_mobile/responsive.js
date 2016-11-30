if (window.innerWidth <= 980) {
  window.addEventListener('load', initResposiveScript);
}

function initResposiveScript() {
 
  var show_more = document.getElementsByClassName('show_more'); // show_more elements in navigation

  var sub_menu = document.querySelectorAll('.sub-menu'); // All sub-menu

  for( i = 0; i < show_more.length; i++ ) {
    show_more[i].addEventListener('click', openSubMenu); // show_more listener
  }

  var closedElement = 'none'; // State of closed element
  var openElement = 'block'; // State of open element

  function openSubMenu() {
    var current_sub_menu = this.nextElementSibling; // Sub-menu near show_more element
    var state_of_element = getComputedStyle(current_sub_menu).display; // Get state of sub-menu
    for( i = 0; i < sub_menu.length; i++ ) {
      sub_menu[i].style.display = closedElement; // At first close all sub-menu
    }
    for( i = 0; i < show_more.length; i++ ) {
      show_more[i].style.transform = 'rotateX(0)'; // Then reset all show_more elements
    }
    if (state_of_element == closedElement) {
      current_sub_menu.style.display = openElement; // And then open sub-menu under show_more element
      this.style.transform = 'rotateX(180deg)'; // and transform current show_more-element
    }
  }

  var slider_item = document.querySelectorAll('.main-slider .items .item'); // All slider items
  var item_content = document.querySelectorAll('.item .content'); // All content

  slider_item[0].classList.remove('active');

  for ( i = 0; i < slider_item .length; i++) {
    slider_item[i].addEventListener('click', openSliderItem)
  }

  function openSliderItem() {
    var current_slider_item = this.children[1];
    var state_of_slider_item = getComputedStyle(current_slider_item).display;
    for( i = 0; i < item_content.length; i++ ) {
      item_content[i].style.display = closedElement; // At first close all slider items
    }
    for( i = 0; i < slider_item.length; i++ ) {
      slider_item[i].style.fontWeight = 'normal'; // And reset font-weight of all titles
    }
    if ( state_of_slider_item == closedElement) {
      current_slider_item.style.display = openElement; // Then open current slider item 
      this.style.fontWeight = 'bold';
    }
  }

}


var links	= document.getElementsByClassName('links');

// links[0].removeChild(x_element[0]);

// list.insertBefore(newLi, list.children[1]);

// Desktop elements that need to replace
var mobile_title = document.querySelectorAll('.main-header .wrapper > a');

// Create mobile menu and mobile elements
var mobile_header = document.createElement('div'),
		mobile_menu_logo = document.createElement('div');

// Set all needed classes
mobile_header.classList.add('mobile-header');
mobile_menu_logo.classList.add('mobile-menu_logo');

// Add mobile_menu to page
document.body.appendChild(mobile_header);

// Add or replace elements to mobile_menu
mobile_header.appendChild(mobile_title[0]);
mobile_header.appendChild(mobile_menu_logo);

mobile_menu_logo.addEventListener('click', openMobileMenu);

function openMobileMenu() {
	alert("!");
}

// Replace header elements

var info = document.querySelectorAll('.info'),
		info_hotline = document.querySelectorAll('.info.hotline'),
		info_parent = document.querySelectorAll('.main-header .wrapper');

info_parent[0].insertBefore(info_hotline[0], info[0]);