"use strict";

document.addEventListener(`DOMContentLoaded`, function () {
    let modalTrigger = document.querySelector(`#js-triggers li:nth-child(2) a`);
    let modal = document.querySelector(`.modal-panel`);
    let modalBackground = document.createElement(`div`);
    modalBackground.classList.add(`modal-overlay`);

    document.body.appendChild(modal);
    document.body.appendChild(modalBackground);

    // Menu Elements
    let menuTrigger = document.querySelector(`#js-triggers li:first-child a`);
    let menuContainer = document.createElement(`nav`);
    menuContainer.classList.add(`dynamic-menu`);

    // Sample menu data
    let menus = [{
        title: `Menu 1`,
        items: [`1.1`, `1.2`, `1.3`]
    }, {
        title: `Menu 2`,
        items: [`2.1`, `2.2`, `2.3`]
    }];

    // Create menu structure
    menus.forEach(function (menuData) {
        let menu = document.createElement(`ul`);
        let menuTitle = document.createElement(`li`);
        let menuLink = document.createElement(`a`);
        menuLink.href = `#`;
        menuLink.textContent = menuData.title;
        menuTitle.appendChild(menuLink);
        menu.appendChild(menuTitle);

        let subMenu = document.createElement(`ul`);
        subMenu.classList.add(`submenu`);
        subMenu.style.display = `none`;

        menuData.items.forEach(function (subItem) {
            let subLi = document.createElement(`li`);
            let subLink = document.createElement(`a`);
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

    let isMenuOpen = false;

    // Toggle Menu (with smooth transition)
    function toggleMenu() {
        isMenuOpen = !isMenuOpen;

        if (isMenuOpen) {
            menuContainer.classList.add(`active`);
            menuTrigger.textContent = `Hide Menu`;
        } else {
            menuContainer.classList.remove(`active`);
            menuTrigger.textContent = `Show Menu`;
        }
    }

    menuTrigger.addEventListener(`click`, function (e) {
        e.preventDefault();
        toggleMenu();
    });

    // Modal Logic
    let isModalOpen = false;

    function toggleModal() {
        isModalOpen = !isModalOpen;
        modal.classList.toggle(`visible`, isModalOpen);
        modalBackground.classList.toggle(`visible`, isModalOpen);

        if (isModalOpen) {
            isMenuOpen = false;
            menuContainer.classList.remove(`active`);
            menuTrigger.textContent = `Show Menu`;
        }
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
