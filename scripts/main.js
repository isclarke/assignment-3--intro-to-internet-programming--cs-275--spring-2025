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

        // Toggle submenu visibility
        menuLink.addEventListener(`click`, function (e) {
            e.preventDefault();
            subMenu.style.display = subMenu.style.display === `none` ? `block` : `none`;
        });
    });

    document.body.appendChild(menuContainer);
    menuContainer.classList.remove(`active`); // Initially hidden

    let isMenuOpen = false;

    // Function to toggle the side menu
    function toggleMenu() {
        isMenuOpen = !isMenuOpen;

        if (isMenuOpen) {
            menuContainer.classList.add(`active`); // Slide in
        } else {
            menuContainer.classList.remove(`active`); // Slide out
        }
    }

    // Event listener for the menu trigger
    menuTrigger.addEventListener(`click`, function (e) {
        e.preventDefault();
        toggleMenu();
    });

    // Modal functions
    let isModalOpen = false;

    // Function to toggle the modal
    function toggleModal() {
        isModalOpen = !isModalOpen;
        modal.classList.toggle(`visible`, isModalOpen);
        modalBackground.classList.toggle(`visible`, isModalOpen);

        if (isModalOpen) {
            menuContainer.classList.remove(`active`); // Close menu when modal is open
        } else {
            menuContainer.classList.toggle(`active`, isMenuOpen); // Keep menu state
        }
    }

    // Event listener for the modal trigger
    modalTrigger.addEventListener(`click`, function (e) {
        e.preventDefault();
        toggleModal();
    });

    // Close modal when clicking on the background
    modalBackground.addEventListener(`click`, toggleModal);

    // Close modal with Escape key
    document.addEventListener(`keydown`, function (e) {
        if (e.key === `Escape` && isModalOpen) {
            toggleModal();
        }
    });
});
