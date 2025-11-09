import React, { useRef, useEffect } from 'react';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';

interface FloatingCart3DProps {
  itemCount: number;
  onClick: () => void;
}

const FloatingCart3D: React.FC<FloatingCart3DProps> = ({ itemCount, onClick }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!canvasRef.current) return;

    const canvas = canvasRef.current;
    
    // Scene
    const scene = new THREE.Scene();

    // Camera
    const camera = new THREE.PerspectiveCamera(30, 1, 0.1, 100);
    camera.position.z = 5;

    // Renderer
    const renderer = new THREE.WebGLRenderer({ 
      canvas, 
      alpha: true, 
      antialias: true 
    });
    renderer.setSize(90, 90);
    renderer.setPixelRatio(window.devicePixelRatio);
    
    // Lights
    const ambient = new THREE.AmbientLight(0x404040, 1);
    scene.add(ambient);

    const light1 = new THREE.PointLight(0x00ffff, 2, 10);
    light1.position.set(2, 2, 5);
    scene.add(light1);

    const light2 = new THREE.PointLight(0xff00aa, 2, 10);
    light2.position.set(-2, -2, 5);
    scene.add(light2);

    // Model
    const loader = new GLTFLoader();
    let cartModel: THREE.Object3D | null = null;
    
    const disposables: { dispose: () => void }[] = [];

    const createFallbackCube = () => {
        const geometry = new THREE.BoxGeometry(1, 1, 1);
        disposables.push(geometry);
        const material = new THREE.MeshStandardMaterial({
            color: 0x00ffff,
            emissive: 0x00ffff,
            emissiveIntensity: 1,
            metalness: 1,
            roughness: 0,
        });
        disposables.push(material);
        const cube = new THREE.Mesh(geometry, material);
        cube.scale.set(1.2, 1.2, 1.2);
        cartModel = cube;
        scene.add(cartModel);
    };

    loader.load(
      'https://raw.githubusercontent.com/mrdoob/three.js/dev/examples/models/gltf/ShoppingCart/glTF-Binary/ShoppingCart.glb',
      (gltf) => {
        cartModel = gltf.scene;
        cartModel.scale.set(2.5, 2.5, 2.5);

        const neonMaterial = new THREE.MeshStandardMaterial({
          color: 0x00ffff,
          emissive: 0x00ffff,
          emissiveIntensity: 0.8,
          metalness: 0.9,
          roughness: 0.1,
        });
        disposables.push(neonMaterial);
        
        cartModel.traverse((child) => {
          if (child instanceof THREE.Mesh) {
            if (Array.isArray(child.material)) {
                child.material.forEach(m => disposables.push(m));
            } else {
                disposables.push(child.material);
            }
            child.material = neonMaterial;
          }
        });
        scene.add(cartModel);
      },
      undefined, // onProgress
      (error) => {
        console.error('Failed to load 3D cart model, creating fallback.', error);
        createFallbackCube();
      }
    );

    // Animation loop
    let animationFrameId: number;
    let time = 0;
    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      time += 0.01;

      if (cartModel) {
        cartModel.rotation.y = time * 0.5;
        cartModel.position.y = -1 + Math.sin(time * 2) * 0.2;
      }
      
      light1.intensity = 2 + Math.sin(time * 3) * 0.5;

      renderer.render(scene, camera);
    };
    animate();

    // Cleanup
    return () => {
      cancelAnimationFrame(animationFrameId);
      if (cartModel) {
        scene.remove(cartModel);
      }
      disposables.forEach(d => d.dispose());
      renderer.dispose();
    };

  }, []);

  return (
    <div id="cart-3d-container" onClick={onClick} aria-label="Abrir carrinho">
      <canvas ref={canvasRef} id="cart-3d-canvas" />
      {itemCount > 0 && (
        <div id="cart-3d-count">{itemCount}</div>
      )}
    </div>
  );
};

export default FloatingCart3D;