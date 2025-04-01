"use strict";

document.addEventListener(`DOMContentLoaded`, function () {
    // Modal Elements
    var modalTrigger = document.querySelector(`#js-triggers li:nth-child(2) a`);
    var modal = document.querySelector(`.modal-panel`);
    var modalBackground = document.createElement(`div`);
    modalBackground.classList.add(`modal-overlay`);
    document.body.appendChild(modalBackground);

    // Menu Elements
    var menuTrigger = document.querySelector(`#js-triggers li:first-child a`);
    var menuContainer = document.createElement(`nav`);
    menuContainer.classList.add(`dynamic-menu`);
    var menus = [{
        title: `Menu 1`,
        items: [`1.1`, `1.2`, `1.3`]
    }, {
        title: `Menu 2`,
        items: [`2.1`, `2.2`, `2.3`]
    }];
    menus.forEach(function (menuData) {
        var menu = document.createElement(`ul`);
        var menuTitle = document.createElement(`li`);
        var menuLink = document.createElement(`a`);
        menuLink.href = `#`;
        menuLink.textContent = menuData.title;
        menuTitle.appendChild(menuLink);
        menu.appendChild(menuTitle);
        var subMenu = document.createElement(`ul`);
        subMenu.classList.add(`submenu`);
        subMenu.style.display = `none`;
        menuData.items.forEach(function (subItem) {
            var subLi = document.createElement(`li`);
            var subLink = document.createElement(`a`);
            subLink.href = `#`;
            subLink.textContent = subItem;
            subLi.appendChild(subLink);
            subMenu.appendChild(subLi);
        });
        menu.appendChild(subMenu);
        menuContainer.appendChild(menu);
        menuLink.addEventListener(`click`, function (e) {
            e.preventDefault();
            subMenu.style.display = subMenu.style.display === `none` ? `block` : `none`;
        });
    });
    document.body.appendChild(menuContainer);
    menuContainer.style.display = `none`;
    var isMenuOpen = false;
    function toggleMenu() {
        isMenuOpen = !isMenuOpen;
        menuContainer.style.display = isMenuOpen ? `block` : `none`;
    }
    menuTrigger.addEventListener(`click`, function (e) {
        e.preventDefault();
        toggleMenu();
    });

    // Modal Functionality
    var isModalOpen = false;
    function toggleModal() {
        isModalOpen = !isModalOpen;
        modal.classList.toggle(`visible`, isModalOpen);
        modalBackground.classList.toggle(`visible`, isModalOpen);
    }
    modalTrigger.addEventListener(`click`, function (e) {
        e.preventDefault();
        toggleModal();
    });
    modalBackground.addEventListener(`click`, toggleModal);
    document.addEventListener(`keydown`, function (e) {
        if (e.key === `Escape` && isModalOpen) {
            toggleModal();
        }
    });
});
