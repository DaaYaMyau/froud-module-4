// import * as THREE from 'three';
// import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
// import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
// import * as CANNON from 'cannon-es';

// document.addEventListener('DOMContentLoaded', () => {
//     // 1. Инициализация физического мира (с минимальной гравитацией)
//     const world = new CANNON.World();
//     world.gravity.set(0, -0.1, 0); // Очень слабая гравитация
//     world.broadphase = new CANNON.NaiveBroadphase();
//     world.solver.iterations = 5;

//     world.defaultContactMaterial.contactEquationStiffness = 1e6; // Увеличиваем жесткость контактов
//     world.defaultContactMaterial.contactEquationRelaxation = 4;

//     // 2. Настройка сцены Three.js
//     const scene = new THREE.Scene();
//     scene.background = new THREE.Color(0x000000);

//     const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
//     camera.position.set(0, 0, 10);

//     const renderer = new THREE.WebGLRenderer({ antialias: true });
//     renderer.setSize(window.innerWidth, window.innerHeight);
//     document.body.appendChild(renderer.domElement);

//     // 3. Освещение
//     const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
//     scene.add(ambientLight);

//     const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
//     directionalLight.position.set(1, 2, 3);
//     scene.add(directionalLight);

//     // 4. OrbitControls с ограничениями
//     const controls = new OrbitControls(camera, renderer.domElement);
//     controls.enableDamping = true;
//     controls.dampingFactor = 0.05;
//     controls.minPolarAngle = Math.PI / 2;
//     controls.maxPolarAngle = Math.PI / 2;
//     controls.minAzimuthAngle = -0.2;
//     controls.maxAzimuthAngle = 0.2;
//     controls.minDistance = 5;
//     controls.maxDistance = 5;

//     // 5. Параметры анимации
//     const settings = {
//         mouseIntensity: 0.8,
//         randomFactor: 0.3,
//         moveSpeed: 0.1,
//         rotationSpeed: 0.03,
//         physicsScale: 0.8,
//         bounds: { x: 6, y: 4, z: 3 }
//     };

//     // 6. Система мыши
//     const mouse = new THREE.Vector2();
//     const mouseTarget = new THREE.Vector2();
//     window.addEventListener('mousemove', (e) => {
//         mouse.x = (e.clientX / window.innerWidth) * 2 - 1;
//         mouse.y = -(e.clientY / window.innerHeight) * 2 + 1;
//         mouseTarget.x += (mouse.x - mouseTarget.x) * settings.moveSpeed;
//         mouseTarget.y += (mouse.y - mouseTarget.y) * settings.moveSpeed;
//     });

//     // 7. Загрузка статичного лого
//     new GLTFLoader().load('threeD/froud_logo.glb', (gltf) => {
//         const logo = gltf.scene;
//         logo.position.set(0, -2.5, 0);
//         logo.scale.set(1, 1, 1);
//         scene.add(logo);

//         document.addEventListener("click", function () {
//             const targetScale = { x: 2, y: 2, z: 2 };
//             const targetPosition = { x: 0, y: -5, z: 0 };
//             const duration = 500; // 1 секунда (1000 мс)
//             const startTime = Date.now();

//             function animate() {
//                 const currentTime = Date.now();
//                 const elapsedTime = currentTime - startTime;
//                 const progress = Math.min(elapsedTime / duration, 1); // 0 → 1

//                 // Плавное изменение scale и position
//                 logo.scale.set(
//                     1 + (targetScale.x - 1) * progress,
//                     1 + (targetScale.y - 1) * progress,
//                     1 + (targetScale.z - 1) * progress
//                 );

//                 logo.position.set(
//                     0,
//                     -2.5 + (targetPosition.y - (-2.5)) * progress,
//                     0
//                 );

//                 if (progress < 1) {
//                     requestAnimationFrame(animate); // Продолжаем анимацию
//                 } else {
//                     window.location.href = "breeding.html"; // Переход после завершения
//                 }
//             }

//             animate(); // Запускаем анимацию
//         });
//     });
//     // 8. Класс для интерактивных объектов
//     class InteractiveObject {
//         constructor(model, position, scale) {
//             this.model = model;
//             this.originalPosition = new THREE.Vector3(...position);
//             this.currentPosition = new THREE.Vector3(...position);
//             this.scale = new THREE.Vector3(...scale);

//             // Настройки физического тела
//             this.body = new CANNON.Body({
//                 mass: 1,
//                 shape: new CANNON.Sphere(scale[0] * settings.physicsScale),
//                 position: new CANNON.Vec3(...position),
//                 material: new CANNON.Material({ restitution: 0.2 }), // Уменьшенный коэффициент отскока
//                 linearDamping: 0.5, // Сильное сопротивление движению
//                 angularDamping: 0.5 // Сопротивление вращению
//             });

//             // Жесткая привязь к исходной позиции
//             this.anchor = new CANNON.Vec3(...position);
//             this.springStrength = 20; // Сила притяжения к якорю

//             world.addBody(this.body);



//             // Фиксируем начальное положение (имитация "привязи")
//             this.body.sleepSpeedLimit = 0.1;
//             this.body.sleepTimeLimit = 1;
//             world.addBody(this.body);

//             // Параметры анимации
//             this.offset = new THREE.Vector3(
//                 Math.random() * 100,
//                 Math.random() * 100,
//                 Math.random() * 100
//             );
//             this.rotationSpeed = {
//                 x: settings.rotationSpeed * (0.5 + Math.random()),
//                 y: settings.rotationSpeed * (0.5 + Math.random()),
//                 z: settings.rotationSpeed * (0.2 + Math.random())
//             };
//         }

//         update(time) {
//             this.model.rotation.x += this.rotationSpeed.x;
//             this.model.rotation.y += this.rotationSpeed.y;
//             this.model.rotation.z += this.rotationSpeed.z;

//             // 2. Вычисляем все силы
//             // Сила притяжения к якорю (основная удерживающая сила)
//             const anchorForce = new CANNON.Vec3(
//                 (this.anchor.x - this.body.position.x) * this.springStrength,
//                 (this.anchor.y - this.body.position.y) * this.springStrength,
//                 (this.anchor.z - this.body.position.z) * this.springStrength
//             );

//             // Сила от мыши (влияние курсора)
//             const mouseX = this.originalPosition.x + mouseTarget.x * settings.mouseIntensity * settings.bounds.x;
//             const mouseY = this.originalPosition.y + mouseTarget.y * settings.mouseIntensity * settings.bounds.y;
//             const mouseForce = new CANNON.Vec3(
//                 (mouseX - this.body.position.x) * 0.5,
//                 (mouseY - this.body.position.y) * 0.5,
//                 0
//             );

//             // Случайные колебания (небольшие дополнительные движения)
//             const noiseForce = new CANNON.Vec3(
//                 Math.sin(time + this.offset.x) * settings.randomFactor * 0.2,
//                 Math.cos(time + this.offset.y) * settings.randomFactor * 0.2,
//                 0
//             );

//             // 3. Применяем все силы ОДИН раз
//             this.body.applyForce(anchorForce, new CANNON.Vec3());
//             this.body.applyForce(mouseForce, new CANNON.Vec3());
//             this.body.applyForce(noiseForce, new CANNON.Vec3());

//             // 4. Ограничение границ движения
//             this.body.position.x = THREE.MathUtils.clamp(
//                 this.body.position.x,
//                 -settings.bounds.x,
//                 settings.bounds.x
//             );
//             this.body.position.y = THREE.MathUtils.clamp(
//                 this.body.position.y,
//                 -settings.bounds.y,
//                 settings.bounds.y
//             );

//             // 5. Синхронизация физики с графикой
//             this.model.position.copy(this.body.position);
//             this.model.quaternion.copy(this.body.quaternion);

//             // 6. Пульсация масштаба (визуальный эффект)
//             const pulse = 1 + Math.sin(time * 2) * 0.05;
//             this.model.scale.set(
//                 this.scale.x * pulse,
//                 this.scale.y * pulse,
//                 this.scale.z * pulse
//             );
//         }
//     }

//     // 9. Загрузка интерактивных моделей (начальные позиции как в оригинале)
//     const objects = [];
//     const models = [
//         { path: 'threeD/bottle.glb', scale: [1, 1, 1], pos: [0, 0, 2] },
//         { path: 'threeD/ice.glb', scale: [0.5, 0.5, 0.5], pos: [1.5, 0, 2] },
//         { path: 'threeD/machine.glb', scale: [0.8, 0.8, 0.8], pos: [-1, 0, 2] },
//         { path: 'threeD/tomato.glb', scale: [0.35, 0.35, 0.35], pos: [0, -0.5, 2] },
//         { path: 'threeD/cow.glb', scale: [0.35, 0.35, 0.35], pos: [1.5, 1.5, 2] }
//     ];

//     models.forEach(modelData => {
//         new GLTFLoader().load(modelData.path, gltf => {
//             const obj = new InteractiveObject(
//                 gltf.scene.clone(),
//                 modelData.pos,
//                 modelData.scale
//             );
//             scene.add(obj.model);
//             objects.push(obj);
//         });
//     });

//     // 10. Анимационный цикл
//     function animate() {
//         requestAnimationFrame(animate);
//         const time = Date.now() * 0.001;

//         // Обновление физики
//         world.step(1 / 60);

//         // Обновление объектов
//         objects.forEach(obj => obj.update(time));

//         controls.update();
//         renderer.render(scene, camera);
//     }

//     // 11. Обработка ресайза
//     window.addEventListener('resize', () => {
//         camera.aspect = window.innerWidth / window.innerHeight;
//         camera.updateProjectionMatrix();
//         renderer.setSize(window.innerWidth, window.innerHeight);
//     });

//     animate();
// });
import * as THREE from 'three';
// import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import * as CANNON from 'cannon-es';

document.addEventListener('DOMContentLoaded', () => {
    const scene = new THREE.Scene();

    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.set(0, 0, 5);

    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    document.body.appendChild(renderer.domElement);

    const ambientLight = new THREE.AmbientLight(0xffffff, 0.3);
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 2.5);
    directionalLight.position.set(1, 3, 5);
    scene.add(directionalLight);

    // Убираем OrbitControls, так как будем управлять вручную
    // const controls = new OrbitControls(camera, renderer.domElement);
    // controls.enableDamping = true;
    // controls.dampingFactor = 0.05;
    // controls.minDistance = 0.3;
    // controls.maxDistance = 200;

    let model; // Будем хранить ссылку на модель

    const loader = new GLTFLoader();
    loader.load(
        'threeD/froud_logo.glb',
        (gltf) => {
            model = gltf.scene;
            model.position.set(0, -2.5, 0);
            model.scale.set(1, 1, 1);
            model.rotateZ(0.1);
            scene.add(model);

            document.addEventListener("click", function(){
                window.location.href = "breeding.html";
            })
        },
        undefined,
        (error) => {
            console.error('Ошибка загрузки модели:', error);
        }
    );

    // Переменные для отслеживания позиции мыши
    let mouseX = 0;
    let mouseY = 0;
    let targetRotationX = 0;
    let targetRotationY = 0;
    const windowHalfX = window.innerWidth / 2;
    const windowHalfY = window.innerHeight / 2;

    // Обработчик движения мыши
    function onMouseMove(event) {
        mouseX = (event.clientX - windowHalfX) / windowHalfX;
        mouseY = (event.clientY - windowHalfY) / windowHalfY;
        
        // Ограничиваем диапазон вращения
        targetRotationY = mouseX * 0.2; // -0.2 до 0.2 по Y
        targetRotationX = -mouseY * 0.05; // небольшой наклон по X
    }

    document.addEventListener('mousemove', onMouseMove, false);

    function loading(link, position, scale) {
        loader.load(
            link,
            (gltf) => {
                const model = gltf.scene;
                model.position.set(...position);
                model.scale.set(...scale);
                scene.add(model);
            },
            undefined,
            (error) => {
                console.error('Ошибка загрузки модели бутылки:', error);
            }
        );
    }

    loading('threeD/bottle.glb', [0, 0, 2], [10, 10, 10]);
    loading('threeD/ice.glb', [1.5, 0, 2], [0.5, 0.5, 0.5]);
    loading('threeD/machine.glb', [-1, 0, 2], [0.8, 0.8, 0.8]);
    loading('threeD/tomato.glb', [0, -0.5, 2], [0.35, 0.35, 0.35]);
    loading('threeD/cow.glb', [1.5, 1.5, 2], [0.35, 0.35, 0.35]);

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
        
        // Плавное перемещение к целевой позиции
        if (model) {
            model.rotation.y += (targetRotationY - model.rotation.y) * 0.05;
            model.rotation.x += (targetRotationX - model.rotation.x) * 0.05;
        }
        
        renderer.render(scene, camera);
    }
    
    animate();
});