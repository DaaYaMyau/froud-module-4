import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';

document.addEventListener('DOMContentLoaded', () => {
    // Сцена
    const scene = new THREE.Scene();

    // Камера
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.set(0, 0, 5); // Отодвигаем камеру назад

    // Рендерер
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    document.body.appendChild(renderer.domElement);

    // Освещение
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.3);
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 2.5);
    directionalLight.position.set(1, 3, 5);
    scene.add(directionalLight);

    // OrbitControls (теперь объявлены ДО загрузки модели)
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.minDistance = 0.3;
    controls.maxDistance = 200;

    // Загрузка модели
    const loader = new GLTFLoader();
    loader.load(
        '../3D/froud_logo.glb',
        (gltf) => {
            const model = gltf.scene;
            model.position.set(0, -2.5, 0); // Начинаем с центра
            model.scale.set(1, 1, 1); // Начинаем с масштаба 1
            model.rotateZ(0.1);
            scene.add(model);

            // Настройка OrbitControls после загрузки модели
            controls.minPolarAngle = Math.PI / 2; // Фиксируем наклон по X
            controls.maxPolarAngle = Math.PI / 2;
            controls.minAzimuthAngle = -0.2; // Ограничиваем вращение по Y
            controls.maxAzimuthAngle = 0.2;
            controls.minDistance = 5;
            controls.maxDistance = 5;
        },
        undefined,
        (error) => {
            console.error('Ошибка загрузки модели:', error);
        }
    );

    // Обработка ресайза окна
    window.addEventListener('resize', () => {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    });

    // Анимационный цикл
    function animate() {
        requestAnimationFrame(animate);
        controls.update();
        renderer.render(scene, camera);
    }
    animate();
});