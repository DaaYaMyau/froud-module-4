import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import * as CANNON from 'cannon-es';

document.addEventListener('DOMContentLoaded', () => {
    // Инициализация сцены, камеры и рендерера
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.set(0.5, 3, 6);
    camera.lookAt(1, 1, 0);

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

    // Физический мир
    const world = new CANNON.World({
        gravity: new CANNON.Vec3(0, -2.81, 0)
    });

    // Пол (физика)
    const groundBody = new CANNON.Body({
        shape: new CANNON.Plane(),
        type: CANNON.Body.STATIC,
        position: new CANNON.Vec3(0, 0, 0)
    });
    world.addBody(groundBody);
    groundBody.quaternion.setFromEuler(-Math.PI / 2, 0, 0);

    // Массивы для объектов
    const physicsBodies = [];
    const followMouseObjects = [];
    let logoModel = null;

    // Функция создания физического тела
    function createPhysicsBody(model, position, scale) {
        const shape = new CANNON.Box(new CANNON.Vec3(scale[0] / 2, scale[1] / 2, scale[2] / 2));
        const body = new CANNON.Body({
            mass: 1,
            shape: shape,
            position: new CANNON.Vec3(position[0], position[1], position[2]),
            velocity: new CANNON.Vec3(0, -1, 0)
        });
        world.addBody(body);
        physicsBodies.push({ body, model });
        return body;
    }

    // Загрузка моделей с увеличенной скоростью следования
    function loadModelWithPhysics(link, position, scale, followSpeed = 0) {
        const loader = new GLTFLoader();
        loader.load(
            link,
            (gltf) => {
                const model = gltf.scene;
                model.position.set(...position);
                model.scale.set(...scale);
                scene.add(model);

                const body = createPhysicsBody(model, position, scale);

                if (followSpeed > 0) {
                    followMouseObjects.push({
                        model,
                        body,
                        originalPosition: [...position],
                        followSpeed,
                        currentTarget: {
                            x: position[0],
                            y: position[1],
                            z: position[2]
                        }
                    });
                }
            },
            undefined,
            (error) => {
                console.error('Ошибка загрузки модели:', link, error);
            }
        );
    }

    // Загрузка логотипа (без физики)
    const logoLoader = new GLTFLoader();
    logoLoader.load(
        'threeD/froud_logo.glb',
        (gltf) => {
            logoModel = gltf.scene;
            logoModel.position.set(0.5, -1.2, 0);
            logoModel.scale.set(1.1, 1.1, 1.1);
            scene.add(logoModel);

            document.addEventListener("click", function () {
                window.location.href = "breeding.html";
            });
        },
        undefined,
        (error) => {
            console.error('Ошибка загрузки логотипа:', error);
        }
    );

    // Загрузка моделей с УВЕЛИЧЕННОЙ скоростью следования
    loadModelWithPhysics('threeD/bottle.glb', [0, 2, 3], [3, 3, 3], 0.05);  // Было 0.02
    loadModelWithPhysics('threeD/ice.glb', [3, 2, 3], [0.35, 0.35, 0.35], 0.08);  // Было 0.03
    loadModelWithPhysics('threeD/machine.glb', [-1, 2, 2.7], [1, 1, 1], 0.04);  // Было 0.015
    loadModelWithPhysics('threeD/tomato.glb', [0.1, 2, 2.8], [0.4, 0.4, 0.4], 0.07);  // Было 0.025
    loadModelWithPhysics('threeD/cow.glb', [1, 2, 3], [0.4, 0.4, 0.4], 0.09);  // Было 0.035

    // Управление вращением логотипа и позицией объектов
    let mouseX = 0;
    let mouseY = 0;
    // let mouseZ = 0;
    let targetRotationX = 0;
    let targetRotationY = 0;
    let windowHalfX = window.innerWidth / 2;
    let windowHalfY = window.innerHeight / 2;

    function onMouseMove(event) {
        mouseX = (event.clientX - windowHalfX) / windowHalfX;
        mouseY = (event.clientY - windowHalfY) / windowHalfY;
        mouseZ = (event.clientZ - windowHalfZ) / windowHalfZ;
        // Вращение логотипа
        targetRotationY = mouseX * 0.2;
        targetRotationX = -mouseY * 0.05;

        // Обновление целей для объектов с увеличенной амплитудой
        followMouseObjects.forEach(obj => {
            // Увеличиваем множитель с 1.5 до 3.0 для большего смещения
            obj.currentTarget.x = obj.originalPosition[0] + mouseX * 3.5;
            obj.currentTarget.y = obj.originalPosition[1] + mouseY * 2.0;
            obj.currentTarget.z = obj.originalPosition[2];
        });
    }
    document.addEventListener('mousemove', onMouseMove, false);

    // Обработчик изменения размера окна
    window.addEventListener('resize', () => {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
        windowHalfX = window.innerWidth / 2;
        windowHalfY = window.innerHeight / 2;
    });

    // Анимационный цикл
    function animate() {
        requestAnimationFrame(animate);

        // Обновление физики
        world.step(1 / 60);

        // Синхронизация физических тел
        for (const { body, model } of physicsBodies) {
            model.position.copy(body.position);
            model.quaternion.copy(body.quaternion);
        }

        // Анимация логотипа
        if (logoModel) {
            logoModel.rotation.y += (targetRotationY - logoModel.rotation.y) * 0.05;
            logoModel.rotation.x += (targetRotationX - logoModel.rotation.x) * 0.05;
        }

        // Анимация следования объектов за мышью с увеличенной скоростью
        followMouseObjects.forEach(obj => {
            // Увеличиваем силу воздействия (было 10, стало 20)
            const forceMultiplier = 20;

            const dx = (obj.currentTarget.x - obj.body.position.x) * obj.followSpeed;
            const dy = (obj.currentTarget.y - obj.body.position.y) * obj.followSpeed;
            const dz = (obj.currentTarget.z - obj.body.position.z) * obj.followSpeed;

            obj.body.velocity.x = dx * forceMultiplier;
            obj.body.velocity.y = dy * forceMultiplier;
            obj.body.velocity.z = dz * forceMultiplier;

            // Увеличиваем вращение для большей динамики
            obj.body.angularVelocity.set(
                Math.random() * 0.05 - 0.025,  // Было 0.02
                Math.random() * 0.05 - 0.025,
                Math.random() * 0.05 - 0.025
            );
        });

        renderer.render(scene, camera);
    }

    animate();
});