/**
 * Sharma Scientific Instruments (SSI) - 3D WebGL Viewer Engine
 * Manages Three.js scenes for both Hero animation and Product Detail viewers.
 * Features: PBR lighting, studio environment, touch/mouse orbit, pinch zoom,
 * door opening lerp, exploded view animation, lazy loading, and WebGL fallback.
 */

(function () {
  'use strict';

  const SSI_Viewer = {
    activeViewer: null,
    heroViewer: null,
  };
  window.SSI_Viewer = SSI_Viewer;

  /**
   * Check WebGL support
   */
  SSI_Viewer.isWebGLAvailable = function () {
    try {
      const canvas = document.createElement('canvas');
      return !!(window.WebGLRenderingContext && (canvas.getContext('webgl') || canvas.getContext('experimental-webgl')));
    } catch (e) {
      return false;
    }
  };

  /**
   * Helper to clean up any active WebGL context
   */
  SSI_Viewer.disposeActiveViewer = function () {
    if (SSI_Viewer.activeViewer) {
      SSI_Viewer.activeViewer.dispose();
      SSI_Viewer.activeViewer = null;
    }
  };

  /* =========================================================================
     PRODUCT 3D VIEWER
     ========================================================================= */

  SSI_Viewer.createProductViewer = function (container, modelType, options) {
    if (!SSI_Viewer.isWebGLAvailable()) {
      console.warn('WebGL is not available in this environment. Falling back to 2D photo.');
      if (options && options.onFallback) options.onFallback();
      return null;
    }

    // Dispose any previously running single-context viewer
    SSI_Viewer.disposeActiveViewer();

    options = options || {};
    const autoRotate = options.autoRotate !== undefined ? options.autoRotate : true;
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const width = container.clientWidth || 600;
    const height = container.clientHeight || 450;

    // Renderer
    const renderer = new THREE.WebGLRenderer({
      antialias: window.devicePixelRatio < 2,
      alpha: true,
      powerPreference: 'high-performance',
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.outputEncoding = THREE.sRGBEncoding;

    // Clear previous canvas
    const oldCanvas = container.querySelector('canvas');
    if (oldCanvas) oldCanvas.remove();
    container.appendChild(renderer.domElement);

    // Scene
    const scene = new THREE.Scene();

    // Camera
    const camera = new THREE.PerspectiveCamera(40, width / height, 0.1, 50);
    camera.position.set(2.4, 1.8, 3.2);

    // Studio Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.65);
    scene.add(ambientLight);

    const keyLight = new THREE.DirectionalLight(0xfff8ee, 1.2);
    keyLight.position.set(4, 6, 4);
    keyLight.castShadow = true;
    keyLight.shadow.mapSize.width = 1024;
    keyLight.shadow.mapSize.height = 1024;
    keyLight.shadow.camera.near = 0.5;
    keyLight.shadow.camera.far = 15;
    keyLight.shadow.bias = -0.001;
    scene.add(keyLight);

    const fillLight = new THREE.DirectionalLight(0xe0f2fe, 0.65);
    fillLight.position.set(-4, 3, -2);
    scene.add(fillLight);

    const rimLight = new THREE.DirectionalLight(0xffffff, 0.85);
    rimLight.position.set(0, 5, -5);
    scene.add(rimLight);

    // Subtle Ground Shadow Plane
    const shadowGeo = new THREE.PlaneGeometry(8, 8);
    const shadowMat = new THREE.ShadowMaterial({ opacity: 0.22 });
    const shadowPlane = new THREE.Mesh(shadowGeo, shadowMat);
    shadowPlane.rotation.x = -Math.PI / 2;
    shadowPlane.position.y = -0.01;
    shadowPlane.receiveShadow = true;
    scene.add(shadowPlane);

    // Build Model
    const model = window.SSI_3D ? window.SSI_3D.createModel(modelType) : new THREE.Group();
    scene.add(model);

    // Camera look target
    const target = new THREE.Vector3(0, 0.65, 0);
    camera.lookAt(target);

    // Interaction State
    let isDragging = false;
    let prevMouseX = 0, prevMouseY = 0;
    let sphRadius = camera.position.distanceTo(target);
    let sphTheta = Math.atan2(camera.position.x - target.x, camera.position.z - target.z);
    let sphPhi = Math.acos((camera.position.y - target.y) / sphRadius);

    let isAutoRotating = autoRotate && !prefersReducedMotion;
    let doorTargetProgress = 0;
    let doorCurrentProgress = 0;
    let explodedTargetProgress = 0;
    let explodedCurrentProgress = 0;

    let isRunning = true;
    let animationFrameId = null;

    // Touch Pinch Zoom Tracking
    let initialPinchDist = 0;
    let initialSphRadius = sphRadius;

    function updateCamera() {
      sphPhi = Math.max(0.1, Math.min(Math.PI * 0.48, sphPhi)); // Don't flip under floor
      sphRadius = Math.max(1.5, Math.min(7.0, sphRadius));

      camera.position.x = target.x + sphRadius * Math.sin(sphPhi) * Math.sin(sphTheta);
      camera.position.y = target.y + sphRadius * Math.cos(sphPhi);
      camera.position.z = target.z + sphRadius * Math.sin(sphPhi) * Math.cos(sphTheta);
      camera.lookAt(target);
    }

    // Pointer Events
    const dom = renderer.domElement;
    dom.style.cursor = 'grab';

    dom.addEventListener('pointerdown', function (e) {
      isDragging = true;
      prevMouseX = e.clientX;
      prevMouseY = e.clientY;
      dom.style.cursor = 'grabbing';
      dom.setPointerCapture(e.pointerId);
    });

    dom.addEventListener('pointermove', function (e) {
      if (!isDragging) return;
      const dx = e.clientX - prevMouseX;
      const dy = e.clientY - prevMouseY;
      prevMouseX = e.clientX;
      prevMouseY = e.clientY;

      sphTheta -= dx * 0.008;
      sphPhi -= dy * 0.008;
      updateCamera();
    });

    const endDrag = function (e) {
      if (isDragging) {
        isDragging = false;
        dom.style.cursor = 'grab';
        try { dom.releasePointerCapture(e.pointerId); } catch (_) {}
      }
    };
    dom.addEventListener('pointerup', endDrag);
    dom.addEventListener('pointercancel', endDrag);

    // Wheel Zoom
    dom.addEventListener('wheel', function (e) {
      e.preventDefault();
      sphRadius += e.deltaY * 0.003;
      updateCamera();
    }, { passive: false });

    // Touch pinch events
    dom.addEventListener('touchstart', function (e) {
      if (e.touches.length === 2) {
        initialPinchDist = Math.hypot(
          e.touches[0].clientX - e.touches[1].clientX,
          e.touches[0].clientY - e.touches[1].clientY
        );
        initialSphRadius = sphRadius;
      }
    }, { passive: true });

    dom.addEventListener('touchmove', function (e) {
      if (e.touches.length === 2 && initialPinchDist > 0) {
        const currentDist = Math.hypot(
          e.touches[0].clientX - e.touches[1].clientX,
          e.touches[0].clientY - e.touches[1].clientY
        );
        const factor = initialPinchDist / currentDist;
        sphRadius = initialSphRadius * factor;
        updateCamera();
      }
    }, { passive: true });

    // Resize Handler
    function onResize() {
      const w = container.clientWidth || 600;
      const h = container.clientHeight || 450;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    }
    window.addEventListener('resize', onResize);

    // Pause rendering when off-screen
    let isVisible = true;
    const observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        isVisible = entry.isIntersecting;
      });
    }, { threshold: 0.1 });
    observer.observe(container);

    // Animation Loop
    function animate() {
      if (!isRunning) return;
      animationFrameId = requestAnimationFrame(animate);

      if (!isVisible) return;

      // Auto-rotation
      if (isAutoRotating && !isDragging) {
        sphTheta += 0.004;
        updateCamera();
      }

      // Smooth Door Animation (Lerp)
      if (Math.abs(doorTargetProgress - doorCurrentProgress) > 0.001) {
        doorCurrentProgress += (doorTargetProgress - doorCurrentProgress) * 0.12;
        if (model.userData && model.userData.openDoor) {
          model.userData.openDoor(doorCurrentProgress);
        }
      }

      // Smooth Exploded View Animation (Lerp)
      if (Math.abs(explodedTargetProgress - explodedCurrentProgress) > 0.001) {
        explodedCurrentProgress += (explodedTargetProgress - explodedCurrentProgress) * 0.1;
        if (model.userData && model.userData.setExploded) {
          model.userData.setExploded(explodedCurrentProgress);
        }
      }

      renderer.render(scene, camera);
    }
    animate();

    // Viewer API object
    const viewerObj = {
      container: container,
      renderer: renderer,
      scene: scene,
      camera: camera,
      model: model,
      toggleAutoRotate: function () {
        isAutoRotating = !isAutoRotating;
        return isAutoRotating;
      },
      setAutoRotate: function (val) {
        isAutoRotating = val;
      },
      toggleDoor: function () {
        doorTargetProgress = doorTargetProgress === 0 ? 1 : 0;
        return doorTargetProgress === 1;
      },
      toggleExploded: function () {
        explodedTargetProgress = explodedTargetProgress === 0 ? 1 : 0;
        return explodedTargetProgress === 1;
      },
      resetCamera: function () {
        sphRadius = 4.2;
        sphTheta = 0.75;
        sphPhi = 1.15;
        updateCamera();
      },
      toggleFullscreen: function () {
        if (!document.fullscreenElement) {
          container.requestFullscreen().catch(function (err) {
            console.error('Fullscreen request error:', err);
          });
        } else {
          document.exitFullscreen();
        }
      },
      dispose: function () {
        isRunning = false;
        if (animationFrameId) cancelAnimationFrame(animationFrameId);
        window.removeEventListener('resize', onResize);
        observer.disconnect();

        // Traverse scene and dispose geometries/materials
        scene.traverse(function (node) {
          if (node.geometry) node.geometry.dispose();
          if (node.material) {
            if (Array.isArray(node.material)) {
              node.material.forEach(m => m.dispose());
            } else {
              node.material.dispose();
            }
          }
        });

        renderer.dispose();
        if (renderer.domElement && renderer.domElement.parentNode) {
          renderer.domElement.parentNode.removeChild(renderer.domElement);
        }
      }
    };

    SSI_Viewer.activeViewer = viewerObj;
    return viewerObj;
  };

  /* =========================================================================
     HOME HERO 3D SCENE
     ========================================================================= */

  SSI_Viewer.initHeroViewer = function (containerId) {
    const container = document.getElementById(containerId);
    if (!container || !SSI_Viewer.isWebGLAvailable()) return null;

    const width = container.clientWidth || window.innerWidth;
    const height = container.clientHeight || window.innerHeight;

    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      powerPreference: 'high-performance',
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.outputEncoding = THREE.sRGBEncoding;
    container.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(42, width / height, 0.1, 60);
    camera.position.set(3.2, 2.2, 4.2);

    // Studio Lights
    const amb = new THREE.AmbientLight(0xffffff, 0.7);
    scene.add(amb);

    const dir = new THREE.DirectionalLight(0xfff5ea, 1.4);
    dir.position.set(5, 7, 5);
    dir.castShadow = true;
    dir.shadow.mapSize.width = 1024;
    dir.shadow.mapSize.height = 1024;
    scene.add(dir);

    const blueLight = new THREE.PointLight(0x0284c7, 1.5, 12);
    blueLight.position.set(-4, 3, 2);
    scene.add(blueLight);

    const plumLight = new THREE.PointLight(0x8b123d, 1.2, 10);
    plumLight.position.set(4, 1, -3);
    scene.add(plumLight);

    // Featured Equipment in Hero: Vertical Autoclave or BOD Incubator
    const modelGroup = new THREE.Group();
    scene.add(modelGroup);

    const heroModel = window.SSI_3D ? window.SSI_3D.createModel('vertical-autoclave') : new THREE.Group();
    heroModel.scale.set(0.9, 0.9, 0.9);
    modelGroup.add(heroModel);

    // Floating Scientific Particle Field
    const particleCount = 75;
    const particleGeo = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    for (let i = 0; i < particleCount * 3; i += 3) {
      positions[i] = (Math.random() - 0.5) * 14;
      positions[i + 1] = Math.random() * 8 - 1;
      positions[i + 2] = (Math.random() - 0.5) * 14;
    }
    particleGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    const particleMat = new THREE.PointsMaterial({
      color: 0x38bdf8,
      size: 0.06,
      transparent: true,
      opacity: 0.55,
    });
    const particles = new THREE.Points(particleGeo, particleMat);
    scene.add(particles);

    // Ground Shadow Plane
    const shadowGeo = new THREE.PlaneGeometry(12, 12);
    const shadowMat = new THREE.ShadowMaterial({ opacity: 0.18 });
    const shadowPlane = new THREE.Mesh(shadowGeo, shadowMat);
    shadowPlane.rotation.x = -Math.PI / 2;
    shadowPlane.receiveShadow = true;
    scene.add(shadowPlane);

    // Interaction & Scroll Link
    let scrollProgress = 0;
    window.addEventListener('scroll', function () {
      const scrollY = window.scrollY || window.pageYOffset;
      scrollProgress = Math.min(1.0, scrollY / (window.innerHeight * 1.2));
    }, { passive: true });

    let isVisible = true;
    const observer = new IntersectionObserver(function (entries) {
      entries.forEach(entry => isVisible = entry.isIntersecting);
    }, { threshold: 0.05 });
    observer.observe(container);

    function onResize() {
      const w = container.clientWidth || window.innerWidth;
      const h = container.clientHeight || window.innerHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    }
    window.addEventListener('resize', onResize);

    let angle = 0;
    function animate() {
      requestAnimationFrame(animate);
      if (!isVisible) return;

      angle += 0.005;
      modelGroup.rotation.y = angle;

      // Scroll-linked camera push
      const targetCamZ = 4.2 + scrollProgress * 2.5;
      const targetCamY = 2.2 + scrollProgress * 1.2;
      camera.position.z += (targetCamZ - camera.position.z) * 0.08;
      camera.position.y += (targetCamY - camera.position.y) * 0.08;
      camera.lookAt(0, 0.75 + scrollProgress * 0.5, 0);

      // Particle slow drift
      particles.rotation.y = angle * 0.2;

      renderer.render(scene, camera);
    }
    animate();

    SSI_Viewer.heroViewer = {
      container: container,
      renderer: renderer,
      scene: scene,
      camera: camera
    };
    return SSI_Viewer.heroViewer;
  };

})();
