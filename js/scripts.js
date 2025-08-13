document.addEventListener("DOMContentLoaded", function() {
	

	document.onclick = function (event) {
		if (!event.target.closest('.header-main-panel .catalog-inner-wrap')) {
			document.querySelector('.header-main-panel .catalog-inner-wrap .btn-menus.active').classList.remove('active')
		}
	}


	//files add
	const fileBlocks = document.querySelectorAll('.js-field-file');
	
	fileBlocks.forEach(fileBlock => {
		const fileInput = fileBlock.querySelector('.js-field-input');
		const fileAttachButton = fileBlock.querySelector('.js-file-button-attach');
		const fileDeleteButton = fileBlock.querySelector('.js-file-button-del');
		const fileName = fileBlock.querySelector('.file-name');
	
		fileAttachButton.addEventListener('click', function() {
			fileInput.click();
		});
	
		fileInput.addEventListener('change', function() {
			if (fileInput.files.length > 0) {
				fileName.textContent = fileInput.files[0].name;
				fileBlock.classList.add('file-active');
			} else {
				fileName.textContent = '';
				fileBlock.classList.remove('file-active');
			}
		});
	
		fileDeleteButton.addEventListener('click', function(e) {
			e.preventDefault();
			fileName.textContent = '';
			fileBlock.classList.remove('file-active');
			fileInput.value = null;
		});
	});
	
	
})