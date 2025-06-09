document.addEventListener('DOMContentLoaded', () => {
    const logo = document.querySelector('.logo');
    const burgerClosed = document.querySelector('.closed-burger');
    const burgerOpened = document.querySelector('.opened-burger');
    const close = document.querySelector('.close');
    const webs = document.querySelector('.webs');
    const firstWebPoster = document.querySelector('.firstWebPoster');
    const secondWebPoster = document.querySelector('.secondWebPoster');



    logo.addEventListener('click', function () {
        window.location.href = "index.html";
    });

    burgerClosed.addEventListener('click', function () {
        if (window.getComputedStyle(burgerOpened).display === 'none') {
            burgerClosed.style.display = 'none';
            burgerOpened.style.display = 'flex';
        }
    });

    close.addEventListener('click', function () {
        if (window.getComputedStyle(burgerClosed).display === 'none') {
            burgerOpened.style.display = 'none';
            burgerClosed.style.display = 'flex';
        }
    });

    webs.addEventListener('click', function () {
        window.location.href = "webBreeding.html";
    });

    firstWebPoster.addEventListener('click', function () {
        window.location.href = "firstWebPoster.html";
    });

});