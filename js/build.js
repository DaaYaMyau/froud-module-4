import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

document.addEventListener('DOMContentLoaded', () => {
    // Получаем контейнер для модели
    const modelBlock = document.querySelector('.modelBlock');
    const canvas = modelBlock.querySelector('canvas');
    
    const scene = new THREE.Scene();
    scene.background = new THREE.Color('#FFFFFF'); 

    const camera = new THREE.PerspectiveCamera(75, modelBlock.clientWidth / modelBlock.clientHeight, 0.1, 1000);
    camera.position.set(0, 0, 0);
   
    const renderer = new THREE.WebGLRenderer({
        canvas: canvas,
        antialias: true
    });
    renderer.setSize(modelBlock.clientWidth, modelBlock.clientHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.toneMapping = THREE.LinearToneMapping; 
    renderer.toneMappingExposure = 1; 

    const ambientLight = new THREE.AmbientLight(0xffffff, 0.3); 
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
        'threeD/build.glb',
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
            model.rotation.y += 0.001; 
            model.rotation.z -= 0.001;
        }
        renderer.render(scene, camera);
    }
    
    animate();

    function onWindowResize() {
        // Обновляем размеры с учетом размеров контейнера
        camera.aspect = modelBlock.clientWidth / modelBlock.clientHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(modelBlock.clientWidth, modelBlock.clientHeight);
    }

    window.addEventListener('resize', onWindowResize);
});