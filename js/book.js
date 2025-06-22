document.addEventListener('DOMContentLoaded', () => {
    const bookPages = document.querySelectorAll('.bookPage');
    let isDragging = false;
    let draggedPage = null;
    let offsetX = 0;
    let offsetY = 0;

    function startDrag(clientX, clientY, page) {
        isDragging = true;
        draggedPage = page;
        draggedPage.style.zIndex = 10;
        draggedPage.style.rotate = `${Math.floor(Math.random() * 21) - 10}deg`;

        // Получаем текущие стили элемента (учитывает transform, margin и т.д.)
        const rect = draggedPage.getBoundingClientRect();

        // Учитываем scroll страницы
        offsetX = clientX - rect.left + window.scrollX;
        offsetY = clientY - rect.top + window.scrollY;

        document.addEventListener("dragover", onMouseMove);
        document.addEventListener("drop", onMouseUp);
        document.addEventListener("touchmove", onTouchMove);
        document.addEventListener("touchend", onMouseUp);
    }

    function onMouseMove(event) {
        if (!isDragging || !draggedPage) return;

        // Учитываем scroll страницы
        const x = event.clientX - offsetX + window.scrollX;
        const y = event.clientY - offsetY + window.scrollY;

        draggedPage.style.transform = `translate(${x}px, ${y}px)`;
    }

    function onTouchMove(event) {
        if (!isDragging || !draggedPage) return;
        event.preventDefault(); // Блокируем скролл страницы при перетаскивании

        const touch = event.touches[0];
        const x = touch.clientX - offsetX + window.scrollX;
        const y = touch.clientY - offsetY + window.scrollY;

        draggedPage.style.transform = `translate(${x}px, ${y}px)`;
    }

    function onMouseUp() {
        if (!draggedPage) return;

        isDragging = false;
        draggedPage.style.cursor = "grab";
        draggedPage = null;

        document.removeEventListener("dragover", onMouseMove);
        document.removeEventListener("drop", onMouseUp);
        document.removeEventListener("touchmove", onTouchMove);
        document.removeEventListener("touchend", onMouseUp);
    }

    bookPages.forEach(page => {
        page.addEventListener('dragstart', (e) => {
            startDrag(e.clientX, e.clientY, page);
        });

        page.addEventListener('touchstart', (e) => {
            const touch = e.touches[0];
            startDrag(touch.clientX, touch.clientY, page);
        }, { passive: false });
    });

    
});