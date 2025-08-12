document.addEventListener("DOMContentLoaded", function() {
	

	document.onclick = function (event) {
		if (!event.target.closest('.header-main-panel .catalog-inner-wrap')) {
			document.querySelector('.header-main-panel .catalog-inner-wrap .btn-menus.active').classList.remove('active')
		}
	}
	
	
})