import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

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

    const modelBlock = document.querySelector('.modelBlock');
    const canvas = modelBlock.querySelector('canvas');

    // Убедимся, что блок имеет размеры
    if (modelBlock.clientWidth === 0 || modelBlock.clientHeight === 0) {
        console.warn('Model block has zero size - check CSS');
    }

    const scene = new THREE.Scene();
    scene.background = new THREE.Color('#FFFFFF');

    // Установим начальные размеры
    const width = modelBlock.clientWidth;
    const height = modelBlock.clientHeight;

    const camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);
    camera.position.set(1, 0, 2); // Отодвинем камеру назад

    const renderer = new THREE.WebGLRenderer({
        canvas: canvas,
        antialias: true
    });

    renderer.setSize(width, height, false);
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.toneMapping = THREE.LinearToneMapping;
    renderer.toneMappingExposure = 1;

    const ambientLight = new THREE.AmbientLight(0xffffff, 0.9);
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 2.5);
    directionalLight.position.set(1, 1, 1);
    scene.add(directionalLight);

    const directionalLight2 = new THREE.DirectionalLight(0xffffff, 2.5);
    directionalLight2.position.set(-1, -1, -1);
    scene.add(directionalLight2);

    let model; // Будем хранить ссылку на модель

    const loader = new GLTFLoader();
    loader.load(
        'threeD/book.glb',
        (gltf) => {
            model = gltf.scene;
            model.position.set(0, 0, 0);
            model.scale.set(1, 1, 1);
            scene.add(model);
        },
        undefined,
        (error) => {
            console.error('Ошибка загрузки модели:', error);
        }
    );

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.minDistance = 0.3;
    controls.maxDistance = 200;

    function animate() {
        requestAnimationFrame(animate);
        controls.update();

        if (model) {
            model.rotation.y += 0;
            model.rotation.z -= 0;
        }
        renderer.render(scene, camera);
    }

    animate();

    function onWindowResize() {
        // Получаем актуальные размеры
        const newWidth = modelBlock.clientWidth;
        const newHeight = modelBlock.clientHeight;

        camera.aspect = newWidth / newHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(newWidth, newHeight, false);
    }

    window.addEventListener('resize', onWindowResize);
});
