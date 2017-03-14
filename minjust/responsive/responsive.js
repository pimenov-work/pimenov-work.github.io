function detectAndInit() { // If it's mobile device init mobile script
  if (window.innerWidth <= 980) {
    initResposiveScript() 
  }
}

window.addEventListener('load', detectAndInit); // Wait before all content load

window.addEventListener('resize', initIfMobile); // If user resize and 

function initIfMobile() {
  detectAndInit();
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

  // Replace header elements

  var info = document.querySelectorAll('.info'),
      info_hotline = document.querySelectorAll('.info.hotline'),
      info_parent = document.querySelectorAll('.main-header .wrapper');

  info_parent[0].insertBefore(info_hotline[0], info[0]);


  //var disabled_links = document.querySelectorAll('.schedule-list a.button');

  //for ( i = 0; i < disabled_links.length; i++ ) {
    //disabled_links[i].addEventListener('click', regOnDesktopVersion);
    //disabled_links[i].removeAttribute('href');
  //}

  //function regOnDesktopVersion() {
    //alert('Записаться возможно лишь после регистрации на полной версии сайта.')
  //}


  var slider_item = document.querySelectorAll('.main-slider .items .item'); // All slider items
  var item_content = document.querySelectorAll('.item .content'); // All content

  slider_item[0].classList.remove('active');

  for ( i = 0; i < slider_item .length; i++) {
    slider_item[i].addEventListener('click', openSliderItem)
    //slider_item[i].addEventListener('click', stateIcon)
  }

  function openSliderItem(e) {
    var current_element = e.target;
    var current_slider_item = this.children[1];
    var state_of_slider_item = getComputedStyle(current_slider_item).display;
    for( i = 0; i < item_content.length; i++ ) {
      item_content[i].style.display = closedElement; // At first close all slider items
    }
    for( i = 0; i < slider_item.length; i++ ) {
      slider_item[i].style.fontWeight = 'normal'; // And reset font-weight of all titles
      slider_item[i].style.backgroundImage = openIcon;
    }
    if ( state_of_slider_item == closedElement) {
      current_slider_item.style.display = openElement; // Then open current slider item 
      this.style.fontWeight = 'bold';
      current_element.style.backgroundImage = closeIcon;
    } else {
      current_element.style.backgroundImage = openIcon;
    }
  }

  var state_of_item = 0;

  function stateIcon(e) {
    var current_element = e.target;
    for ( i = 0; i < slider_item.length; i++) {
      slider_item[i].style.backgroundImage = openIcon;
    }
    //if(current_element.style.opacity == '0.3') {
      //alert("It's some transparent")
    //}
    //current_element.style.opacity = '0.3'
    //this.classList.add('openState');
    //alert(current_element.style.backgroundImage)
    //alert(current_element.style.backgroundImage);
    if (state_of_item % 2 == 0) {
      current_element.style.backgroundImage = closeIcon;
    } else if (state_of_item % 2 !== 0) {
      current_element.style.backgroundImage = openIcon;
    }
    state_of_item++;
  }

  var openIcon = 'url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABkAAAAPCAMAAAAmuJTXAAAA/1BMVEUARHz///8ARHwARHwARHwARHwARHwARHwARHwARHwARHwARHwARHwARHwARHwARHwARHwARHwARHwARHwARHwARHwARHwARHwARHwARHwARHwARHwARHwARHwARHwARHwARHwARHwARHwARHwARHwARHwARHwARHwARHwARHwARHwARHwARHwARHwARHwARHwARHwARHwARHwARHwARHwARHwARHwARHwARHwARHwARHwARHwARHwARHwARHwARHwARHwARHwARHwARHwARHwARHwARHwARHwARHwARHwARHwARHwARHwARHwARHwARHwARHwARHwARHwARHwARHwUmZU3AAAAVHRSTlMAAAECAwQGBwkKDA0QERQXGBkaICImKiwtMDU3OTw/Q0hMTlVaX2JqbXN3foSJjZWZn6KorLGzur2+wMHCxcrM0dPZ3ODi5ufq7O7v8vT19/n7/P6Kf5m9AAAAsElEQVR4AW3JZXKDYBhF4ftS6kK91N1dmkDcXQjf3f9aMiGCkPPrzDww01sIJl6GbSLF3FpM1vO0sF1mcikiyzZLBrBf5+9CSPQ/1vYEwHGbnyH5YutIRoKLPl8D8sbeuYwFNy4fZ/LEwbVMBQ/KvZ3InVL34gte6Fx6c+XwWYKCD3ZOAJx2+S5h0X7YOMBhk99aRLCYYOWsyn9dooLVLBUzKxIXbBZZ2MA8wa61A1+G8aEXwaReDXAAAAAASUVORK5CYII=")';

  var closeIcon = 'url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABkAAAAPCAMAAAAmuJTXAAAA/1BMVEUARHz///8ARHwARHwARHwARHwARHwARHwARHwARHwARHwARHwARHwARHwARHwARHwARHwARHwARHwARHwARHwARHwARHwARHwARHwARHwARHwARHwARHwARHwARHwARHwARHwARHwARHwARHwARHwARHwARHwARHwARHwARHwARHwARHwARHwARHwARHwARHwARHwARHwARHwARHwARHwARHwARHwARHwARHwARHwARHwARHwARHwARHwARHwARHwARHwARHwARHwARHwARHwARHwARHwARHwARHwARHwARHwARHwARHwARHwARHwARHwARHwARHwARHwARHwARHwUmZU3AAAAVHRSTlMAAAECAwQGBwkKDA0QERQXGBkaICImKiwtMDU3OTw/Q0hMTlVaX2JqbXN3foSJjZWZn6KorLGzur2+wMHCxcrM0dPZ3ODi5ufq7O7v8vT19/n7/P6Kf5m9AAAArklEQVR4AW3J5ZaCUABF4XMZpoPpYbo7xhbs7kDuef9ncakggfvfXh+EG3BkHMOXJ3sVVvdXyVaBksXtqKhpNm8azKyHRYmze46zDhNKSH45vAZwNeBfUD5pPcz33uKXX16lfHH+2ZZvnjxO+CEcwTvtJ1duR/wRS8E3x3cLuegxJnyCf/YvZ3LSYkoNyFqS7VNAq9HcFAHBRpb1Qxgs74qQYKfEHHRTExHBQV6fAkH4F8FZLJX6AAAAAElFTkSuQmCC")';

}