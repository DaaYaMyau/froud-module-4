document.addEventListener('DOMContentLoaded', function () {
    const quantityInner = document.querySelector('.quantity_inner');
    const basicButton = document.querySelectorAll('.basicButton');
    // const activeButton = document.querySelectorAll('.activeButton');

    basicButton.forEach((button) => {
        button.addEventListener('click', function () {
           button.classList.add(" activeButton");

        })
    });

    quantityInner.querySelector('.bt_minus').addEventListener('click', function () {
        const input = this.parentNode.querySelector('.quantity');
        let count = parseInt(input.value) - 1;
        count = count < 1 ? 1 : count;
        input.value = count;
    });


    quantityInner.querySelector('.bt_plus').addEventListener('click', function () {
        const input = this.parentNode.querySelector('.quantity');
        const maxCount = parseInt(input.dataset.maxCount);
        let count = parseInt(input.value) + 1;
        count = count > maxCount ? maxCount : count;
        input.value = count;
    });

    quantityInner.querySelector('.quantity').addEventListener('input', function () {
        this.value = this.value.replace(/[^0-9]/g, '');

        if (this.value === "") {
            this.value = 1;
        }

        const maxCount = parseInt(this.dataset.maxCount);
        if (parseInt(this.value) > maxCount) {
            this.value = maxCount;
        }
    });

    quantityInner.querySelector('.quantity').addEventListener('change', function () {
        const maxCount = parseInt(this.dataset.maxCount);
        let value = parseInt(this.value) || 1;

        if (value < 1) value = 1;
        if (value > maxCount) value = maxCount;

        this.value = value;
    });
})