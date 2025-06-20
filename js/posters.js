document.addEventListener('DOMContentLoaded', function() {
    // Массивы с путями к изображениям
    const contentImages = [
        'img/colorPoster.png',
        'img/drawPosterMockup.png',
        'img/symbolPostersMockup.png',
        'img/bluePosterMockup.png',
        'img/realPosterMockup.png'
    ];
    
    const contentAllImages = [
        'img/colorPostersAll.png',
        'img/drawPostersAll.png',
        'img/symbolPostersAll.png',
        'img/photoPostersAll.png',
        'img/realPostersAll.png',
        'img/allPosters.png'
    ];

    // Функция для перемешивания массива (чтобы не было повторений)
    function shuffleArray(array) {
        return [...array].sort(() => Math.random() - 0.5);
    }

    // Обновляет изображения, гарантируя, что они не повторяются
    function updateImagesUnique() {
        // Перемешиваем массивы перед каждым обновлением
        const shuffledContent = shuffleArray(contentImages);
        const shuffledContentAll = shuffleArray(contentAllImages);

        // Обновляем .content (разные изображения для каждого элемента)
        const contentElements = document.querySelectorAll('.content');
        contentElements.forEach((el, index) => {
            const imgIndex = index % shuffledContent.length; // Циклический выбор
            el.style.backgroundImage = `url('${shuffledContent[imgIndex]}')`;
        });

        // Обновляем .contentAll (разные изображения для каждого элемента)
        const contentAllElements = document.querySelectorAll('.contentAll');
        contentAllElements.forEach((el, index) => {
            const imgIndex = index % shuffledContentAll.length; // Циклический выбор
            el.style.backgroundImage = `url('${shuffledContentAll[imgIndex]}')`;
        });
    }

    // Первая загрузка
    updateImagesUnique();

    // Обновляем изображения каждые 5 секунд (5000 мс)
    setInterval(updateImagesUnique, 1000);
});