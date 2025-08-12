document.addEventListener("DOMContentLoaded", function () {

	
	//header mobile fixed
	let lastScrollTop = 0;
	window.addEventListener("scroll", function () {
		let currentScroll = window.pageYOffset || document.documentElement.scrollTop;
		if (currentScroll > 200) {
			if (currentScroll > lastScrollTop) {
				document.querySelector("body").classList.remove("header-show");
			} else {
				document.querySelector("body").classList.add("header-show");
			}
			lastScrollTop = currentScroll <= 0 ? 0 : currentScroll;
		}
		if (currentScroll == 0) {
			document.querySelector("body").classList.add("header-show-top");
		} else {
			document.querySelector("body").classList.remove("header-show-top");
		}
	});

  //js popup wrap
  const togglePopupButtons = document.querySelectorAll(".js-btn-popup-toggle");
  const closePopupButtons = document.querySelectorAll(".js-btn-popup-close");
  const popupElements = document.querySelectorAll(".js-popup-wrap");
  function popupElementsClear() {
    document.body.classList.remove("menu-show");
    document.body.classList.remove("filter-show");
    document.body.classList.remove("search-show");
  }
  function popupElementsClose() {
    togglePopupButtons.forEach((element) => {
      if (!element.closest(".no-close")) {
        element.classList.remove("active");
      }
    });
  }
  for (i = 0; i < togglePopupButtons.length; i++) {
    togglePopupButtons[i].addEventListener("click", function (e) {
      popupElementsClear();
      if (this.classList.contains("active")) {
        this.classList.remove("active");
      } else {
        popupElementsClose();
        this.classList.add("active");
        if (this.closest(".popup-menu-wrap")) {
          document.body.classList.add("menu-show");
        }
        if (this.closest(".popup-search-wrap")) {
          document.body.classList.add("search-show");
        }
        if (this.closest(".popup-filter-wrap")) {
          document.body.classList.add("filter-show");
        }
      }
      e.preventDefault();
      e.stopPropagation();
      return false;
    });
  }
  for (i = 0; i < closePopupButtons.length; i++) {
    closePopupButtons[i].addEventListener("click", function (e) {
      popupElementsClear();
      popupElementsClose();
      e.preventDefault();
      e.stopPropagation();
      return false;
    });
  }
  document.onclick = function (event) {
    if (!event.target.closest(".js-popup-block")) {
      popupElementsClear();
      popupElementsClose();
    }
  };

  //js tabs
  const tabsNav = document.querySelectorAll(".js-tabs-nav");
  const tabsBlocks = document.querySelectorAll(".js-tab-block");
  const tabsButtonTitle = document.querySelectorAll(".js-tab-title");
  const tabsButtonContent = document.querySelectorAll(".js-tab-content");
  function tabsActiveStart() {
    for (iTab = 0; iTab < tabsBlocks.length; iTab++) {
      if (tabsBlocks[iTab].classList.contains("active")) {
        tabsBlocks[iTab].classList.remove("active");
      }
    }
    for (i = 0; i < tabsNav.length; i++) {
      let tabsNavElements = tabsNav[i].querySelectorAll("[data-tab]");
      for (iElements = 0; iElements < tabsNavElements.length; iElements++) {
        if (tabsNavElements[iElements].classList.contains("active")) {
          let tabsNavElementActive = tabsNavElements[iElements].dataset.tab;
          for (j = 0; j < tabsBlocks.length; j++) {
            if (
              tabsBlocks[j].dataset.tab
                .toString()
                .indexOf(tabsNavElementActive) > -1
            ) {
              console.log(
                tabsBlocks[j].dataset.tab
                  .toString()
                  .indexOf(tabsNavElementActive)
              );
              tabsBlocks[j].classList.add("active");
            }
          }
        }
      }
    }
  }
  for (i = 0; i < tabsButtonTitle.length; i++) {
    tabsButtonTitle[i].addEventListener("click", function (e) {
      this.classList.toggle("active");
      e.preventDefault();
      e.stopPropagation();
      return false;
    });
  }
  for (i = 0; i < tabsNav.length; i++) {
    tabsNav[i].addEventListener("click", function (e) {
      if (e.target.closest("[data-tab]")) {
        let tabsNavElements = this.querySelector("[data-tab].active");
        tabsNavElements ? tabsNavElements.classList.remove("active") : false;
        e.target.closest("[data-tab]").classList.add("active");
        tabsActiveStart();
        e.preventDefault();
        e.stopPropagation();
        return false;
      }
    });
  }
  tabsActiveStart();

  // Popups
  let popupCurrent;
  let popupsList = document.querySelectorAll(".popup-outer-box");

  document.querySelectorAll(".js-popup-open").forEach(function (element) {
    element.addEventListener("click", function (e) {
      document.querySelector(".popup-outer-box").classList.remove("active");
      document.body.classList.add("popup-open");

      popupCurrent = this.getAttribute("data-popup");
      document
        .querySelector(
          `.popup-outer-box[id="${popupCurrent}"
			]`
        )
        .classList.add("active");

      e.preventDefault();
      e.stopPropagation();
      return false;
    });
  });
  document.querySelectorAll(".js-popup-close").forEach(function (element) {
    element.addEventListener("click", function (event) {
      document.body.classList.remove("popup-open");
      for (i = 0; i < popupsList.length; i++) {
        popupsList[i].classList.remove("active");
      }
      event.preventDefault();
      event.stopPropagation();
    });
  });
  document.querySelectorAll(".popup-outer-box").forEach(function (element) {
    element.addEventListener("click", function (event) {
      if (!event.target.closest(".popup-box")) {
        document.body.classList.remove("popup-open");
        document.body.classList.remove("popup-open-scroll");
        document.querySelectorAll(".popup-outer-box").forEach(function (e) {
          e.classList.remove("active");
        });
        return false;
      }
    });
  });

  //btn tgl
  let tglButtons = document.querySelectorAll(".js-btn-tgl");
  for (i = 0; i < tglButtons.length; i++) {
    tglButtons[i].addEventListener("click", function (e) {

      this.classList.contains("active")
        ? this.classList.remove("active")
        : this.classList.add("active");
      e.preventDefault();
      return false;
    });
  }
  

});