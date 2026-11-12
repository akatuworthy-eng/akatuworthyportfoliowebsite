/**
 * akatuworthy — Three.js Immersive 3D Experience
 *
 * Architecture:
 * - Living Intelligence Nucleus: Faceted translucent icosahedron + wireframe lattice + vertex nodes
 * - Inner Resonant Core: Counter-rotating energetic octahedron
 * - Gyroscopic Data Rings: Multi-axis orbital rings with satellite beacon
 * - Neural Constellation Field: Volumetric particle swarm with harmonic wave drift
 * - Lighting: Deep olive ambience, lime key, warm ivory rim, and interactive cursor light
 * - Performance: Capped pixel ratio, mobile LOD scaling, visibilitychange pause, full resource disposal
 * - Accessibility: WebGL capability detection with clean graceful fallback
 */

(function () {
  "use strict";

  // Check WebGL availability
  function isWebGLAvailable() {
    try {
      var canvas = document.createElement("canvas");
      return !!(
        window.WebGLRenderingContext &&
        (canvas.getContext("webgl") ||
          canvas.getContext("experimental-webgl"))
      );
    } catch (e) {
      return false;
    }
  }

  var Portfolio3D = {
    isSupported: false,
    isInitialized: false,
    isPaused: false,
    container: null,
    scene: null,
    camera: null,
    renderer: null,
    rafId: null,

    // Hierarchy
    rootGroup: null,
    coreGroup: null,
    outerMesh: null,
    wireMesh: null,
    nodeMesh: null,
    innerMesh: null,
    rings: [],
    satelliteOrb: null,
    satelliteAngle: 0,

    // Particles
    particles: null,
    particleGeo: null,
    particleInitialPositions: null,
    particlePhases: null,
    particleCount: 800,

    // Lights
    ambientLight: null,
    keyLight: null,
    rimLight: null,
    interactiveLight: null,

    // Pointer Parallax
    pointer: { x: 0, y: 0, targetX: 0, targetY: 0 },
    isTouchDevice: false,

    // Scroll state targets (interpolated or GSAP driven)
    scrollProgress: 0,

    // Disposables
    disposables: [],

    getPixelRatio: function () {
      var deviceRatio = window.devicePixelRatio || 1;
      var lowPower = (navigator.hardwareConcurrency && navigator.hardwareConcurrency <= 4) ||
        (navigator.deviceMemory && navigator.deviceMemory <= 4);
      var cap = lowPower ? 1.15 : 1.5;
      return Math.min(deviceRatio, cap);
    },

    init: function (containerSelector) {
      if (!isWebGLAvailable()) {
        console.warn("WebGL not supported or disabled. Portfolio 3D fallback active.");
        document.documentElement.classList.add("no-webgl");
        var fallback = document.getElementById("webgl-fallback");
        if (fallback) fallback.classList.add("is-active");
        return false;
      }

      this.isSupported = true;
      this.container =
        typeof containerSelector === "string"
          ? document.querySelector(containerSelector)
          : containerSelector;

      if (!this.container) {
        console.error("3D Container element not found:", containerSelector);
        return false;
      }

      var width = window.innerWidth;
      var height = window.innerHeight;
      this.isTouchDevice =
        "ontouchstart" in window || navigator.maxTouchPoints > 0;

      // 1. Scene
      this.scene = new THREE.Scene();

      // 2. Camera
      var fov = width < 768 ? 52 : 45;
      this.camera = new THREE.PerspectiveCamera(fov, width / height, 0.1, 100);
      this.camera.position.set(0, 0, width < 768 ? 8.5 : 7.2);

      // 3. Renderer
      this.renderer = new THREE.WebGLRenderer({
        antialias: true,
        alpha: true,
        powerPreference: "high-performance",
      });
      this.renderer.setSize(width, height);
      this.renderer.setPixelRatio(this.getPixelRatio());
      this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
      this.renderer.toneMappingExposure = 1.15;
      this.container.appendChild(this.renderer.domElement);

      // 4. Groups
      this.rootGroup = new THREE.Group();
      this.coreGroup = new THREE.Group();
      this.rootGroup.add(this.coreGroup);
      this.scene.add(this.rootGroup);

      // Default desktop placement: slightly offset to the right to frame hero copy
      this.updateLayoutPlacement(width);

      // 5. Construct 3D Elements
      this.buildLighting();
      this.buildLivingCore();
      this.buildGyroscopicRings();
      this.buildNeuralParticleField(width);

      // 6. Event Listeners
      this.bindEvents();

      // 7. Start Animation Loop
      this.isInitialized = true;
      this.lastTime = performance.now();
      this.animate = this.animate.bind(this);
      this.prefersReducedMotion = window.matchMedia &&
        window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      if (this.prefersReducedMotion) {
        this.renderStaticFrame();
      } else {
        this.rafId = requestAnimationFrame(this.animate);
      }

      document.documentElement.classList.add("webgl-active");
      return true;
    },

    updateLayoutPlacement: function (width) {
      if (!this.rootGroup) return;
      if (width < 900) {
        // Centered behind text on mobile/tablet
        this.rootGroup.position.set(0, -0.2, 0);
        this.coreGroup.scale.set(0.85, 0.85, 0.85);
      } else {
        // Shifted right on desktop to frame hero text
        this.rootGroup.position.set(2.2, 0.1, 0);
        this.coreGroup.scale.set(1.0, 1.0, 1.0);
      }
    },

    buildLighting: function () {
      // Deep slate ambient base
      this.ambientLight = new THREE.AmbientLight(0x171d0d, 1.6);
      this.scene.add(this.ambientLight);

      // Key light: vivid lime
      this.keyLight = new THREE.DirectionalLight(0xd5ff45, 2.8);
      this.keyLight.position.set(6, 8, 7);
      this.scene.add(this.keyLight);

      // Rim light: warm ivory
      this.rimLight = new THREE.DirectionalLight(0xf1f3d1, 2.2);
      this.rimLight.position.set(-7, -6, -5);
      this.scene.add(this.rimLight);

      // Interactive point light tracking mouse pointer
      this.interactiveLight = new THREE.PointLight(0xd5ff45, 2.5, 16, 1.6);
      this.interactiveLight.position.set(0, 0, 4);
      this.scene.add(this.interactiveLight);

      // Ambient warm indigo fill
      var accentFill = new THREE.PointLight(0x92ad37, 1.4, 20, 2);
      accentFill.position.set(0, -4, 2);
      this.scene.add(accentFill);
    },

    buildLivingCore: function () {
      // A. Outer translucent faceted shell
      var outerGeo = new THREE.IcosahedronGeometry(2.1, 1);
      var outerMat = new THREE.MeshStandardMaterial({
        color: 0x252b18,
        emissive: 0x596b22,
        emissiveIntensity: 0.62,
        roughness: 0.18,
        metalness: 0.88,
        transparent: true,
        opacity: 0.45,
        flatShading: true,
        side: THREE.DoubleSide,
      });
      this.outerMesh = new THREE.Mesh(outerGeo, outerMat);
      this.coreGroup.add(this.outerMesh);
      this.disposables.push(outerGeo, outerMat);

      // B. Luminous wireframe cage
      var wireGeo = new THREE.WireframeGeometry(outerGeo);
      var wireMat = new THREE.LineBasicMaterial({
        color: 0xd5ff45,
        transparent: true,
        opacity: 0.55,
        blending: THREE.AdditiveBlending,
      });
      this.wireMesh = new THREE.LineSegments(wireGeo, wireMat);
      this.coreGroup.add(this.wireMesh);
      this.disposables.push(wireGeo, wireMat);

      // C. Vertex knowledge nodes (Instanced Spheres at unique vertices)
      var positions = outerGeo.attributes.position;
      var uniqueMap = {};
      var uniqueVerts = [];
      for (var i = 0; i < positions.count; i++) {
        var x = Math.round(positions.getX(i) * 100) / 100;
        var y = Math.round(positions.getY(i) * 100) / 100;
        var z = Math.round(positions.getZ(i) * 100) / 100;
        var key = x + "_" + y + "_" + z;
        if (!uniqueMap[key]) {
          uniqueMap[key] = true;
          uniqueVerts.push(new THREE.Vector3(x, y, z));
        }
      }

      var nodeGeo = new THREE.SphereGeometry(0.045, 8, 8);
      var nodeMat = new THREE.MeshBasicMaterial({ color: 0xe6ff8e });
      var nodeMesh = new THREE.InstancedMesh(
        nodeGeo,
        nodeMat,
        uniqueVerts.length
      );
      var dummy = new THREE.Object3D();
      for (var j = 0; j < uniqueVerts.length; j++) {
        dummy.position.copy(uniqueVerts[j]);
        dummy.scale.set(1, 1, 1);
        dummy.updateMatrix();
        nodeMesh.setMatrixAt(j, dummy.matrix);
      }
      nodeMesh.instanceMatrix.needsUpdate = true;
      this.coreGroup.add(nodeMesh);
      this.nodeMesh = nodeMesh;
      this.disposables.push(nodeGeo, nodeMat);

      // D. Inner resonant energy core (counter-rotating octahedron)
      var innerGeo = new THREE.OctahedronGeometry(1.05, 0);
      var innerMat = new THREE.MeshStandardMaterial({
        color: 0xb4ce56,
        emissive: 0xd5ff45,
        emissiveIntensity: 1.15,
        roughness: 0.2,
        metalness: 0.8,
        wireframe: true,
      });
      this.innerMesh = new THREE.Mesh(innerGeo, innerMat);
      this.coreGroup.add(this.innerMesh);
      this.disposables.push(innerGeo, innerMat);
    },

    buildGyroscopicRings: function () {
      var ringSpecs = [
        {
          radius: 3.1,
          tube: 0.018,
          rotation: [Math.PI / 3.2, 0.2, 0.4],
          rotSpeed: { x: 0.003, y: 0.005, z: 0.002 },
        },
        {
          radius: 3.65,
          tube: 0.014,
          rotation: [-Math.PI / 3.8, 0.5, -0.3],
          rotSpeed: { x: -0.004, y: 0.003, z: -0.004 },
        },
        {
          radius: 4.15,
          tube: 0.011,
          rotation: [0.35, Math.PI / 2.3, 0.25],
          rotSpeed: { x: 0.002, y: -0.005, z: 0.003 },
        },
      ];

      for (var i = 0; i < ringSpecs.length; i++) {
        var spec = ringSpecs[i];
        var ringGeo = new THREE.TorusGeometry(spec.radius, spec.tube, 16, 120);
        var ringMat = new THREE.MeshStandardMaterial({
          color: 0xe0edab,
          emissive: 0xa7c844,
          emissiveIntensity: 0.6,
          roughness: 0.25,
          metalness: 0.85,
        });
        var ring = new THREE.Mesh(ringGeo, ringMat);
        ring.rotation.set(spec.rotation[0], spec.rotation[1], spec.rotation[2]);
        ring.userData = {
          baseRotation: [spec.rotation[0], spec.rotation[1], spec.rotation[2]],
          rotSpeed: spec.rotSpeed,
          radius: spec.radius,
        };
        this.coreGroup.add(ring);
        this.rings.push(ring);
        this.disposables.push(ringGeo, ringMat);
      }

      // Orbital satellite orb on first ring
      var orbGeo = new THREE.SphereGeometry(0.08, 16, 16);
      var orbMat = new THREE.MeshBasicMaterial({ color: 0xf0ffb0 });
      this.satelliteOrb = new THREE.Mesh(orbGeo, orbMat);
      this.coreGroup.add(this.satelliteOrb);
      this.disposables.push(orbGeo, orbMat);
    },

    createParticleTexture: function () {
      var canvas = document.createElement("canvas");
      canvas.width = 64;
      canvas.height = 64;
      var ctx = canvas.getContext("2d");

      var gradient = ctx.createRadialGradient(32, 32, 0, 32, 32, 32);
      gradient.addColorStop(0, "rgba(255, 255, 255, 1)");
      gradient.addColorStop(0.25, "rgba(213, 255, 69, 0.8)");
      gradient.addColorStop(0.6, "rgba(190, 211, 111, 0.32)");
      gradient.addColorStop(1, "rgba(0, 0, 0, 0)");

      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, 64, 64);

      var texture = new THREE.CanvasTexture(canvas);
      this.disposables.push(texture);
      return texture;
    },

    buildNeuralParticleField: function (width) {
      var lowPower = (navigator.hardwareConcurrency && navigator.hardwareConcurrency <= 4) || (navigator.deviceMemory && navigator.deviceMemory <= 4);\n      var count = lowPower ? (width < 768 ? 140 : 260) : (width < 768 ? 260 : 620);
      this.particleCount = count;

      var particleGeo = new THREE.BufferGeometry();
      var positions = new Float32Array(count * 3);
      var colors = new Float32Array(count * 3);
      var initialPositions = new Float32Array(count * 3);
      var phases = new Float32Array(count);

      var colorTeal = new THREE.Color(0xe7f6ac);
      var colorCyan = new THREE.Color(0xd5ff45);
      var colorMuted = new THREE.Color(0x475629);

      for (var i = 0; i < count; i++) {
        var i3 = i * 3;
        // Distribute in a spherical cylinder
        var radius = 2.5 + Math.random() * 11.5;
        var theta = Math.random() * Math.PI * 2;
        var y = (Math.random() - 0.5) * 20;

        var x = Math.cos(theta) * radius;
        var z = Math.sin(theta) * radius * 0.75 + (Math.random() - 0.5) * 4;

        positions[i3] = x;
        positions[i3 + 1] = y;
        positions[i3 + 2] = z;

        initialPositions[i3] = x;
        initialPositions[i3 + 1] = y;
        initialPositions[i3 + 2] = z;

        phases[i] = Math.random() * Math.PI * 2;

        // Color blend
        var mixFactor = Math.random();
        var chosenColor = new THREE.Color();
        if (mixFactor < 0.5) {
          chosenColor.lerpColors(colorTeal, colorCyan, mixFactor * 2);
        } else {
          chosenColor.lerpColors(colorCyan, colorMuted, (mixFactor - 0.5) * 2);
        }

        colors[i3] = chosenColor.r;
        colors[i3 + 1] = chosenColor.g;
        colors[i3 + 2] = chosenColor.b;
      }

      particleGeo.setAttribute(
        "position",
        new THREE.BufferAttribute(positions, 3)
      );
      particleGeo.setAttribute("color", new THREE.BufferAttribute(colors, 3));

      var particleTexture = this.createParticleTexture();
      var particleMat = new THREE.PointsMaterial({
        size: width < 768 ? 0.22 : 0.18,
        map: particleTexture,
        vertexColors: true,
        transparent: true,
        opacity: 0.8,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
      });

      this.particles = new THREE.Points(particleGeo, particleMat);
      this.scene.add(this.particles);

      this.particleGeo = particleGeo;
      this.particleInitialPositions = initialPositions;
      this.particlePhases = phases;
      this.disposables.push(particleGeo, particleMat);
    },

    bindEvents: function () {
      var self = this;

      this._onResize = function () {
        self.handleResize();
      };
      window.addEventListener("resize", this._onResize, { passive: true });

      this._onPointerMove = function (e) {
        self.handlePointerMove(e);
      };
      window.addEventListener("pointermove", this._onPointerMove, {
        passive: true,
      });

      this._onVisibilityChange = function () {
        if (document.hidden) {
          self.isPaused = true;
          if (self.rafId) cancelAnimationFrame(self.rafId);
        } else {
          self.isPaused = false;
          self.lastTime = performance.now();
          if (self.prefersReducedMotion) {
            self.renderStaticFrame();
          } else {
            self.rafId = requestAnimationFrame(self.animate);
          }
        }
      };
      document.addEventListener(
        "visibilitychange",
        this._onVisibilityChange,
        false
      );
    },

    handleResize: function () {
      if (!this.renderer || !this.camera) return;
      var width = window.innerWidth;
      var height = window.innerHeight;

      this.camera.aspect = width / height;
      this.camera.fov = width < 768 ? 52 : 45;
      this.camera.updateProjectionMatrix();

      this.renderer.setSize(width, height);
      this.renderer.setPixelRatio(this.getPixelRatio());

      this.updateLayoutPlacement(width);
      if (this.prefersReducedMotion) this.renderStaticFrame();
    },

    handlePointerMove: function (e) {
      if (this.isTouchDevice && e.pointerType === "touch") return;
      var normX = (e.clientX / window.innerWidth) * 2 - 1;
      var normY = -(e.clientY / window.innerHeight) * 2 + 1;
      this.pointer.targetX = normX;
      this.pointer.targetY = normY;
    },

    animate: function (time) {
      if (this.isPaused) return;

      var delta = (time - this.lastTime) * 0.001;
      this.lastTime = time;
      if (delta > 0.1) delta = 0.1; // Avoid jumps on tab focus return

      var t = time * 0.001;

      // 1. Mouse Lerping (Damped Parallax)
      var reducedMotion =
        window.matchMedia &&
        window.matchMedia("(prefers-reduced-motion: reduce)").matches;

      var easeFactor = 0.055;
      this.pointer.x += (this.pointer.targetX - this.pointer.x) * easeFactor;
      this.pointer.y += (this.pointer.targetY - this.pointer.y) * easeFactor;

      // 2. Idle Object Rotations
      if (!reducedMotion) {
        var baseRotY = 0.35 * delta;
        var baseRotX = 0.18 * delta;

        if (this.coreGroup) {
          this.coreGroup.rotation.y += baseRotY;
          this.coreGroup.rotation.x += baseRotX;
        }

        if (this.innerMesh) {
          this.innerMesh.rotation.y -= baseRotY * 2.2;
          this.innerMesh.rotation.z += baseRotX * 1.8;
          // Core harmonic pulse
          var pulse = 1.0 + Math.sin(t * 2.6) * 0.08;
          this.innerMesh.scale.set(pulse, pulse, pulse);
        }

        // Gyro Rings
        for (var r = 0; r < this.rings.length; r++) {
          var ring = this.rings[r];
          var speed = ring.userData.rotSpeed;
          ring.rotation.x += speed.x * delta * 2;
          ring.rotation.y += speed.y * delta * 2;
          ring.rotation.z += speed.z * delta * 2;
        }

        // Satellite Orb Orbit
        if (this.satelliteOrb && this.rings[0]) {
          this.satelliteAngle += 1.4 * delta;
          var radius = this.rings[0].userData.radius;
          var orbX = Math.cos(this.satelliteAngle) * radius;
          var orbY = Math.sin(this.satelliteAngle) * radius;
          this.satelliteOrb.position.set(orbX, orbY, 0);
          this.satelliteOrb.position.applyEuler(this.rings[0].rotation);
        }

        // 3. Particle Harmonic Float
        if (this.particleGeo && this.particleInitialPositions) {
          var positions = this.particleGeo.attributes.position.array;
          var count = this.particleCount;
          for (var i = 0; i < count; i++) {
            var i3 = i * 3;
            var phase = this.particlePhases[i];
            positions[i3 + 1] =
              this.particleInitialPositions[i3 + 1] +
              Math.sin(t * 0.75 + phase) * 0.45;
          }
          this.particleGeo.attributes.position.needsUpdate = true;
        }

        // Subtle Parallax Tilt on Root Group
        if (this.rootGroup) {
          this.rootGroup.rotation.y = this.pointer.x * 0.28;
          this.rootGroup.rotation.x = -this.pointer.y * 0.2;
        }

        // Interactive Light Track
        if (this.interactiveLight) {
          this.interactiveLight.position.x = this.pointer.x * 5.5;
          this.interactiveLight.position.y = this.pointer.y * 4.0;
        }
      }

      // 4. Render
      if (this.renderer && this.scene && this.camera) {
        this.renderer.render(this.scene, this.camera);
      }

      this.rafId = requestAnimationFrame(this.animate);
    },

    renderStaticFrame: function () {
      if (this.renderer && this.scene && this.camera) {
        this.renderer.render(this.scene, this.camera);
      }
    },

    destroy: function () {
      if (this.rafId) {
        cancelAnimationFrame(this.rafId);
        this.rafId = null;
      }

      window.removeEventListener("resize", this._onResize);
      window.removeEventListener("pointermove", this._onPointerMove);
      document.removeEventListener(
        "visibilitychange",
        this._onVisibilityChange
      );

      // Dispose all collected geometries, materials, textures
      for (var i = 0; i < this.disposables.length; i++) {
        var item = this.disposables[i];
        if (item && typeof item.dispose === "function") {
          item.dispose();
        }
      }
      this.disposables = [];

      if (this.renderer) {
        if (
          this.renderer.domElement &&
          this.renderer.domElement.parentNode
        ) {
          this.renderer.domElement.parentNode.removeChild(
            this.renderer.domElement
          );
        }
        this.renderer.dispose();
        this.renderer = null;
      }

      this.scene = null;
      this.camera = null;
      this.isInitialized = false;
    },
  };

  // Expose globally
  window.Portfolio3D = Portfolio3D;
})();
