document.addEventListener('DOMContentLoaded', function () {
    const basicButtons = document.querySelectorAll('.basicButton');
    const all_prod = document.querySelector('.all_prod');
    const cartEmpty = document.querySelector('.cart-empty');
    const card_mobile = document.querySelector('.card_mobile');
    const circle = document.querySelector('.circle');

    card_mobile.addEventListener('click', function () {
        if (window.getComputedStyle(card_mobile).display === 'none') {
            card_mobile.style.display = 'flex';
        }
    });

    // closeCart.addEventListener('click', function () {
    //     if (window.getComputedStyle(burgerClosed).display === 'none') {
    //         burgerOpened.style.display = 'none';
    //         burgerClosed.style.display = 'flex';
    //     }
    // });
    let mobile_count = 0

    basicButtons.forEach((button) => {
        button.addEventListener('click', function () {
            // Проверяем, не добавлен ли уже товар
            if (button.classList.contains('activeButton')) return;

            cartEmpty.classList.remove('cart-empty');

            const img = button.getAttribute('img');
            const price = button.getAttribute('price');
            const name = this.closest('.productCard').querySelector('.name').textContent;

            // Меняем состояние кнопки
            button.classList.add("activeButton");
            button.textContent = 'добавлено в корзину';

            // Создаем карточку товара для корзины
            const productCart = document.createElement('div');
            productCart.className = 'product';
            productCart.dataset.productId = img; // Сохраняем идентификатор товара
            productCart.innerHTML = `
                <div class="imgSmall ${img}"></div>
                <div class="info">
                    <div class="nameCart">${name}</div>
                    <div class="bottom_info">
                        <div class="priceCart">${price} руб.</div>
                        <div class="quantity_inner">
                            <button class="bt_minus">-</button>
                            <input type="text" class="quantity" value="1" data-price="${price}" data-max-count="20">
                            <button class="bt_plus">+</button>
                        </div>
                    </div>
                </div>
            `;

            all_prod.appendChild(productCart);
            updateTotalPrice();
            setupQuantityControls(productCart, button);


            circle.style.display = 'flex';
            mobile_count++
            circle.innerHTML = "+" + mobile_count;
        });
    });


    // Настройка обработчиков для счётчиков
    function setupQuantityControls(container, button) {
        const minusBtn = container.querySelector('.bt_minus');
        const plusBtn = container.querySelector('.bt_plus');
        const quantityInput = container.querySelector('.quantity');
        const priceElement = container.querySelector('.priceCart');

        minusBtn.addEventListener('click', function () {
            let value = parseInt(quantityInput.value) - 1;

            if (value <= 0) {
                // Удаляем товар из корзины
                container.remove();

                // Возвращаем кнопку в исходное состояние
                button.classList.remove("activeButton");
                button.textContent = 'добавить в корзину';

                // Проверяем, есть ли еще товары в корзине
                if (all_prod.children.length === 0) {
                    cartEmpty.classList.add('cart-empty');
                }
            } else {
                quantityInput.value = value;
            }

            updateItemPrice(quantityInput, priceElement);
            updateTotalPrice();
        });

        plusBtn.addEventListener('click', function () {
            const maxCount = parseInt(quantityInput.dataset.maxCount);
            let value = parseInt(quantityInput.value) + 1;
            value = value > maxCount ? maxCount : value;
            quantityInput.value = value;
            updateItemPrice(quantityInput, priceElement);
            updateTotalPrice();
        });

        quantityInput.addEventListener('input', function () {
            this.value = this.value.replace(/[^0-9]/g, '');
            if (this.value === "") this.value = 1;
            updateItemPrice(this, priceElement);
            updateTotalPrice();
        });

        quantityInput.addEventListener('change', function () {
            const maxCount = parseInt(this.dataset.maxCount);
            let value = parseInt(this.value) || 1;

            if (value <= 0) {
                // Удаляем товар из корзины
                container.remove();

                // Возвращаем кнопку в исходное состояние
                button.classList.remove("activeButton");
                button.textContent = 'добавить в корзину';

                // Проверяем, есть ли еще товары в корзине
                if (all_prod.children.length === 0) {
                    cartEmpty.classList.add('cart-empty');
                }
            } else {
                if (value > maxCount) value = maxCount;
                this.value = value;
                updateItemPrice(this, priceElement);
                updateTotalPrice();
            }
        });
    }

    // Обновление цены одного товара
    function updateItemPrice(input, priceElement) {
        const pricePerItem = parseInt(input.dataset.price);
        const quantity = parseInt(input.value);
        const totalPrice = pricePerItem * quantity;
        priceElement.textContent = totalPrice + ' руб.';
    }

    // Обновление общей суммы
    function updateTotalPrice() {
        const priceElements = document.querySelectorAll('.priceCart');
        let total = 0;

        priceElements.forEach(el => {
            const priceText = el.textContent;
            total += parseInt(priceText.replace(' руб.', ''));
        });

        document.querySelector('.count').textContent = total + ' руб.';
    }
});