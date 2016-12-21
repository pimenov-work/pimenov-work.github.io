mainInit();

function mainInit() {

if (localStorage.getItem('accessibility_on') == 'on') {
	dhtmlLoadScript("accessibility/accessibility.js");
	dhtmlLoadStyles("accessibility/accessibility.css");
} else {
	var head = document.getElementsByTagName('head')[0];
	head.innerHTML += '<meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" /><link rel="stylesheet" href="responsive/responsive.css"><script src="responsive/responsive.js"></script>';
	dhtmlLoadScript("responsive/responsive.js");
	dhtmlLoadStyles("responsive/responsive.css");
}

var accessibility_scripts;
var accessibility_styles;

function dhtmlLoadScript(url)	{
   accessibility_scripts = document.createElement("script");
   accessibility_scripts.src = url;
   accessibility_scripts.type="text/javascript";
   document.getElementsByTagName("head")[0].appendChild(accessibility_scripts); 
}

function dhtmlLoadStyles(url)	{
   accessibility_styles = document.createElement("link");
   accessibility_styles.rel="stylesheet";
   accessibility_styles.href = url;
   document.getElementsByTagName("head")[0].appendChild(accessibility_styles); 
}

//var accessibility_on;

/*
if(accessibility_on == true) {
	var head = document.getElementsByTagName('head')[0];
	head.innerHTML += '<link rel="stylesheet" href="accessibility/accessibility.css"><script src="accessibility/accessibility.js"></script>';
} else if(accessibility_on != true) {
	var head = document.getElementsByTagName('head')[0];
	head.innerHTML += '<meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" /><link rel="stylesheet" href="responsive/responsive.css"><script src="responsive/responsive.js"></script>';
}
*/

var links_block = document.querySelectorAll('.main-header .links')[0];

links_block.innerHTML += '<button class="go-to-special-version" id="go-to-special-version"> Версия для слабовидящих </button>';
var go_to_special_version = document.getElementById('go-to-special-version');

go_to_special_version.addEventListener('click', goToSpecialVersion);

function goToSpecialVersion() {
	dhtmlLoadScript("accessibility/accessibility.js");
	dhtmlLoadStyles("accessibility/accessibility.css");
	localStorage.setItem('accessibility_on', 'on');
}

}