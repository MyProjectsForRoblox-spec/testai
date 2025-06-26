// Use a relative path for Three.js, assuming three.min.js is in the js/ folder
import * as THREE from 'https://raw.githubusercontent.com/MyProjectsForRoblox-spec/testai/refs/heads/main/js/three.min.js';

// Define generateImage and attach it to the window object
function generateImage() {
    const prompt = document.getElementById('image-prompt').value.trim();
    const canvas = document.getElementById('image-canvas');
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, canvas.width / canvas.height, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ canvas: canvas, antialias: true });

    // Set up renderer
    renderer.setSize(canvas.width, canvas.height);

    // Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambientLight);
    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
    directionalLight.position.set(0, 5, 10);
    scene.add(directionalLight);

    // Camera position
    camera.position.z = 20;

    // Basic scene based on prompt
    let object;
    if (prompt.toLowerCase().includes('cat with a detective hat')) {
        // Simulate a cat with a detective hat
        const headGeometry = new THREE.SphereGeometry(2, 32, 32);
        const headMaterial = new THREE.MeshStandardMaterial({ color: 0xffb347 }); // Orange cat
        const head = new THREE.Mesh(headGeometry, headMaterial);
        scene.add(head);

        const hatGeometry = new THREE.ConeGeometry(1.5, 2, 32);
        const hatMaterial = new THREE.MeshStandardMaterial({ color: 0x000000 });
        const hat = new THREE.Mesh(hatGeometry, hatMaterial);
        hat.position.set(0, 2.5, 0);
        scene.add(hat);

        // Add text (e.g., "Detective Cat") using Canvas API
        const ctx = canvas.getContext('2d');
        ctx.font = '20px Courier New';
        ctx.fillStyle = '#00ffcc';
        ctx.fillText('Detective Cat', 10, canvas.height - 10);
    } else {
        // Default: Render a simple cube with prompt text
        const geometry = new THREE.BoxGeometry(5, 5, 5);
        const material = new THREE.MeshStandardMaterial({ color: 0x00ffcc });
        object = new THREE.Mesh(geometry, material);
        scene.add(object);

        // Add prompt text to canvas
        const ctx = canvas.getContext('2d');
        ctx.font = '20px Courier New';
        ctx.fillStyle = '#00ffcc';
        ctx.fillText(prompt || 'Generated Image', 10, canvas.height - 10);
    }

    // Animation loop
    function animate() {
        requestAnimationFrame(animate);
        if (object) object.rotation.y += 0.01;
        renderer.render(scene, camera);
    }
    animate();
}

// Expose generateImage to the global scope
window.generateImage = generateImage;
