/**
 * Sharma Scientific Instruments (SSI) - Procedural 3D Models
 * Built with Three.js (r128) using geometric primitives and PBR materials.
 * Features: PBR stainless steel, powder coating, digital canvas textures, 
 * engraved SSI logo nameplates, animated doors/lids, and exploded view offsets.
 */

(function () {
  'use strict';

  const SSI_3D = {};
  window.SSI_3D = SSI_3D;

  // Cached procedural canvas textures
  let _ssiBadgeTexture = null;
  let _digitalDispTexture = null;
  let _pressureGaugeTexture = null;
  let _tempDispTexture = null;
  let _wolffhuegelTexture = null;

  /**
   * Procedural SSI Logo Nameplate Texture
   */
  SSI_3D.getSSINameplateTexture = function () {
    if (_ssiBadgeTexture) return _ssiBadgeTexture;
    const canvas = document.createElement('canvas');
    canvas.width = 512;
    canvas.height = 256;
    const ctx = canvas.getContext('2d');

    // Transparent background
    ctx.clearRect(0, 0, 512, 256);

    // Oval gradient
    const cx = 256, cy = 128, rx = 230, ry = 110;
    const grad = ctx.createLinearGradient(cx - rx, cy - ry, cx + rx, cy + ry);
    grad.addColorStop(0, '#8b123d');
    grad.addColorStop(0.5, '#600a29');
    grad.addColorStop(1, '#380417');

    // Outer gold rim
    ctx.save();
    ctx.beginPath();
    ctx.ellipse(cx, cy, rx, ry, 0, 0, Math.PI * 2);
    ctx.strokeStyle = '#e9b740';
    ctx.lineWidth = 14;
    ctx.stroke();

    // Inner gold line
    ctx.beginPath();
    ctx.ellipse(cx, cy, rx - 10, ry - 10, 0, 0, Math.PI * 2);
    ctx.fillStyle = grad;
    ctx.fill();
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 3;
    ctx.stroke();

    // Specular highlight
    ctx.beginPath();
    ctx.ellipse(cx, cy - 35, rx * 0.7, ry * 0.35, 0, 0, Math.PI * 2);
    ctx.fillStyle = 'rgba(255, 255, 255, 0.18)';
    ctx.fill();

    // "SSI" text
    ctx.fillStyle = '#ffffff';
    ctx.shadowColor = 'rgba(0, 0, 0, 0.75)';
    ctx.shadowBlur = 8;
    ctx.shadowOffsetX = 3;
    ctx.shadowOffsetY = 4;
    ctx.font = 'italic bold 110px "Times New Roman", Georgia, serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('SSI', cx, cy + 4);
    ctx.restore();

    _ssiBadgeTexture = new THREE.CanvasTexture(canvas);
    _ssiBadgeTexture.anisotropy = 4;
    return _ssiBadgeTexture;
  };

  /**
   * Procedural Digital Temperature Display Canvas Texture
   */
  SSI_3D.getDigitalDisplayTexture = function (tempStr, labelStr) {
    const canvas = document.createElement('canvas');
    canvas.width = 256;
    canvas.height = 128;
    const ctx = canvas.getContext('2d');

    // Bezel
    ctx.fillStyle = '#0f172a';
    ctx.fillRect(0, 0, 256, 128);

    // Screen cavity
    ctx.fillStyle = '#000000';
    ctx.fillRect(10, 10, 236, 108);

    // Grid lines
    ctx.strokeStyle = 'rgba(30, 41, 59, 0.5)';
    ctx.lineWidth = 1;
    for (let x = 20; x < 240; x += 20) {
      ctx.beginPath(); ctx.moveTo(x, 10); ctx.lineTo(x, 118); ctx.stroke();
    }

    // Process Value label
    ctx.fillStyle = '#94a3b8';
    ctx.font = 'bold 16px monospace';
    ctx.fillText(labelStr || 'PV °C', 20, 36);

    // Set Value label
    ctx.fillStyle = '#22c55e';
    ctx.font = 'bold 14px monospace';
    ctx.fillText('SV 37.0', 160, 36);

    // Digital LED Digits (Bright Red/Green 7-segment look)
    ctx.fillStyle = '#ef4444';
    ctx.shadowColor = '#ef4444';
    ctx.shadowBlur = 10;
    ctx.font = 'bold 44px monospace';
    ctx.fillText(tempStr || '037.0', 20, 92);

    const tex = new THREE.CanvasTexture(canvas);
    return tex;
  };

  /**
   * Procedural Dial Pressure Gauge Texture
   */
  SSI_3D.getPressureGaugeTexture = function () {
    if (_pressureGaugeTexture) return _pressureGaugeTexture;
    const canvas = document.createElement('canvas');
    canvas.width = 256;
    canvas.height = 256;
    const ctx = canvas.getContext('2d');

    // Dial background
    ctx.fillStyle = '#f8fafc';
    ctx.beginPath();
    ctx.arc(128, 128, 120, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = '#334155';
    ctx.lineWidth = 6;
    ctx.stroke();

    // Scale ticks
    ctx.save();
    ctx.translate(128, 128);
    for (let i = 0; i <= 24; i++) {
      const angle = (Math.PI * 0.75) + (i / 24) * (Math.PI * 1.5);
      const isMajor = i % 4 === 0;
      const len = isMajor ? 18 : 10;
      ctx.beginPath();
      ctx.moveTo(Math.cos(angle) * 110, Math.sin(angle) * 110);
      ctx.lineTo(Math.cos(angle) * (110 - len), Math.sin(angle) * (110 - len));
      ctx.strokeStyle = isMajor ? (i > 18 ? '#dc2626' : '#0f172a') : '#64748b';
      ctx.lineWidth = isMajor ? 3 : 1.5;
      ctx.stroke();
    }

    // Units label
    ctx.fillStyle = '#475569';
    ctx.font = 'bold 16px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('PSI / kg/cm²', 0, 45);
    ctx.fillText('SSI AUTOCLAVE', 0, 65);

    // Needle pointing to 15 PSI
    ctx.rotate(Math.PI * 1.45);
    ctx.beginPath();
    ctx.moveTo(-4, 0);
    ctx.lineTo(0, -95);
    ctx.lineTo(4, 0);
    ctx.fillStyle = '#dc2626';
    ctx.fill();

    // Center pivot
    ctx.beginPath();
    ctx.arc(0, 0, 10, 0, Math.PI * 2);
    ctx.fillStyle = '#0f172a';
    ctx.fill();
    ctx.restore();

    _pressureGaugeTexture = new THREE.CanvasTexture(canvas);
    return _pressureGaugeTexture;
  };

  /**
   * Procedural Wolffhuegel Colony Counter Grid Texture
   */
  SSI_3D.getWolffhuegelGridTexture = function () {
    if (_wolffhuegelTexture) return _wolffhuegelTexture;
    const canvas = document.createElement('canvas');
    canvas.width = 512;
    canvas.height = 512;
    const ctx = canvas.getContext('2d');

    // Translucent glowing background
    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.arc(256, 256, 240, 0, Math.PI * 2);
    ctx.fill();

    // Concentric circles
    ctx.strokeStyle = '#0284c7';
    ctx.lineWidth = 1.5;
    for (let r = 40; r <= 220; r += 35) {
      ctx.beginPath();
      ctx.arc(256, 256, r, 0, Math.PI * 2);
      ctx.stroke();
    }

    // Grid squares
    ctx.strokeStyle = 'rgba(2, 132, 199, 0.4)';
    ctx.lineWidth = 1;
    for (let x = 56; x <= 456; x += 25) {
      ctx.beginPath(); ctx.moveTo(x, 40); ctx.lineTo(x, 472); ctx.stroke();
    }
    for (let y = 56; y <= 472; y += 25) {
      ctx.beginPath(); ctx.moveTo(40, y); ctx.lineTo(472, y); ctx.stroke();
    }

    _wolffhuegelTexture = new THREE.CanvasTexture(canvas);
    return _wolffhuegelTexture;
  };

  /**
   * PBR Material Palette
   */
  SSI_3D.createMaterials = function () {
    return {
      ssBrushed: new THREE.MeshStandardMaterial({
        color: 0xd8dde3,
        roughness: 0.28,
        metalness: 0.88,
      }),
      ssMirror: new THREE.MeshStandardMaterial({
        color: 0xf1f5f9,
        roughness: 0.12,
        metalness: 0.95,
      }),
      powderBeige: new THREE.MeshStandardMaterial({
        color: 0xedebe4,
        roughness: 0.6,
        metalness: 0.08,
      }),
      powderBlue: new THREE.MeshStandardMaterial({
        color: 0x1e3a5f,
        roughness: 0.45,
        metalness: 0.15,
      }),
      powderTeal: new THREE.MeshStandardMaterial({
        color: 0x0284c7,
        roughness: 0.45,
        metalness: 0.12,
      }),
      darkChamber: new THREE.MeshStandardMaterial({
        color: 0x1e293b,
        roughness: 0.7,
        metalness: 0.3,
      }),
      gunmetal: new THREE.MeshStandardMaterial({
        color: 0x475569,
        roughness: 0.35,
        metalness: 0.85,
      }),
      brassGold: new THREE.MeshStandardMaterial({
        color: 0xd97706,
        roughness: 0.3,
        metalness: 0.75,
      }),
      rubberBlack: new THREE.MeshStandardMaterial({
        color: 0x0f172a,
        roughness: 0.85,
        metalness: 0.05,
      }),
      glassToughened: new THREE.MeshPhysicalMaterial ? new THREE.MeshPhysicalMaterial({
        color: 0xebf8ff,
        transmission: 0.9,
        opacity: 0.45,
        transparent: true,
        roughness: 0.06,
        ior: 1.52,
      }) : new THREE.MeshStandardMaterial({
        color: 0xa5f3fc,
        transparent: true,
        opacity: 0.4,
        roughness: 0.1,
      }),
      acrylicTranslucent: new THREE.MeshStandardMaterial({
        color: 0xcffafe,
        transparent: true,
        opacity: 0.65,
        roughness: 0.15,
      }),
      heatingGlow: new THREE.MeshStandardMaterial({
        color: 0xef4444,
        emissive: 0xd97706,
        emissiveIntensity: 0.8,
        roughness: 0.4,
      }),
      refractoryCeramic: new THREE.MeshStandardMaterial({
        color: 0xfef08a,
        roughness: 0.9,
        metalness: 0.02,
      }),
      ssiBadge: new THREE.MeshStandardMaterial({
        map: SSI_3D.getSSINameplateTexture(),
        transparent: true,
        roughness: 0.3,
        metalness: 0.4,
      }),
    };
  };

  /**
   * Helper to attach SSI Logo Plate onto a mesh
   */
  SSI_3D.attachSSIPlate = function (parent, pos, rot, scale) {
    const ssiMat = new THREE.MeshStandardMaterial({
      map: SSI_3D.getSSINameplateTexture(),
      transparent: true,
      roughness: 0.35,
      metalness: 0.25,
    });
    const ssiGeo = new THREE.PlaneGeometry(0.35, 0.175);
    const badge = new THREE.Mesh(ssiGeo, ssiMat);
    badge.position.copy(pos);
    if (rot) badge.rotation.copy(rot);
    if (scale) badge.scale.set(scale, scale, scale);
    parent.add(badge);
    return badge;
  };

  /**
   * Helper to add a digital control display panel
   */
  SSI_3D.createControlPanelMesh = function (w, h, temp, label) {
    const group = new THREE.Group();
    // Bezel plate
    const bezelGeo = new THREE.BoxGeometry(w, h, 0.04);
    const bezelMat = new THREE.MeshStandardMaterial({ color: 0x0f172a, roughness: 0.4 });
    const bezel = new THREE.Mesh(bezelGeo, bezelMat);
    group.add(bezel);

    // Display screen
    const dispGeo = new THREE.PlaneGeometry(w * 0.6, h * 0.55);
    const dispMat = new THREE.MeshBasicMaterial({
      map: SSI_3D.getDigitalDisplayTexture(temp, label),
    });
    const disp = new THREE.Mesh(dispGeo, dispMat);
    disp.position.z = 0.022;
    disp.position.x = -w * 0.15;
    group.add(disp);

    // Rocker switches & indicator lights
    const swGeo = new THREE.BoxGeometry(w * 0.12, h * 0.25, 0.03);
    const swMatRed = new THREE.MeshStandardMaterial({ color: 0xdc2626, roughness: 0.3 });
    const swMatGreen = new THREE.MeshStandardMaterial({ color: 0x16a34a, roughness: 0.3 });
    
    const sw1 = new THREE.Mesh(swGeo, swMatRed);
    sw1.position.set(w * 0.25, h * 0.15, 0.02);
    group.add(sw1);

    const sw2 = new THREE.Mesh(swGeo, swMatGreen);
    sw2.position.set(w * 0.25, -h * 0.15, 0.02);
    group.add(sw2);

    return group;
  };

  /**
   * Factory: Build 3D Model by Type
   */
  SSI_3D.createModel = function (modelType) {
    const m = SSI_3D.createMaterials();
    const root = new THREE.Group();

    // State hooks for animation and interactivity
    root.userData = {
      isSSIModel: true,
      modelType: modelType,
      doorGroup: null,
      explodedParts: [],
      isDoorOpen: false,
      isExploded: false,
      doorAngle: 0,
      openDoor: function (progress) {
        if (root.userData.doorGroup) {
          const maxAngle = Math.PI * 0.65;
          root.userData.doorGroup.rotation.y = -progress * maxAngle;
        }
      },
      setExploded: function (progress) {
        root.userData.explodedParts.forEach(function (item) {
          item.mesh.position.lerpVectors(item.origin, item.target, progress);
        });
      }
    };

    switch (modelType) {
      case 'bod-incubator':
        buildBODIncubator(root, m);
        break;
      case 'hot-air-oven':
        buildHotAirOven(root, m);
        break;
      case 'humidity-chamber':
        buildHumidityChamber(root, m);
        break;
      case 'vertical-autoclave':
        buildVerticalAutoclave(root, m);
        break;
      case 'constant-temp-water-bath':
      case 'water-bath':
      case 'water-bath-rings':
      case 'universal-water-bath':
        buildWaterBath(root, m, modelType);
        break;
      case 'laminar-air-flow-bench':
        buildLaminarAirFlow(root, m);
        break;
      case 'fume-hood-chamber':
        buildFumeHood(root, m);
        break;
      case 'laboratory-furnace':
        buildLaboratoryFurnace(root, m);
        break;
      case 'colony-counter':
        buildColonyCounter(root, m);
        break;
      case 'rectangular-hot-plate':
      case 'hot-plate':
        buildRectangularHotPlate(root, m);
        break;
      case 'round-hot-plate':
        buildRoundHotPlate(root, m);
        break;
      case 'heating-mantle':
        buildHeatingMantle(root, m);
        break;
      case 'ultra-low-freezers':
      case 'freezer-chest':
      case 'ultra-cryostat-bath':
        buildFreezer(root, m, modelType);
        break;
      case 'kjeldahl-unit':
      case 'micro-kjeldahl-unit':
        buildKjeldahlUnit(root, m, modelType === 'micro-kjeldahl-unit');
        break;
      case 'soxhlet-heater':
        buildSoxhletHeater(root, m);
        break;
      case 'water-still':
        buildWaterStill(root, m);
        break;
      case 'orbital-shaking-incubator':
      case 'rotary-flask-shaker':
        buildShaker(root, m, modelType === 'orbital-shaking-incubator');
        break;
      case 'cod-apparatus':
        buildCODApparatus(root, m);
        break;
      case 'rota-dyer':
        buildRotaDyer(root, m);
        break;
      case 'seed-germinator':
        buildSeedGerminator(root, m);
        break;
      case 'industrial-tray-dryer':
        buildTrayDryer(root, m);
        break;
      case 'uv-cabinet':
        buildUVCabinet(root, m);
        break;
      case 'vacuum-oven':
        buildVacuumOven(root, m);
        break;
      case 'freeze-drier':
        buildFreezeDrier(root, m);
        break;
      case 'magnetic-stirrer':
        buildMagneticStirrer(root, m);
        break;
      case 'melting-point-apparatus':
        buildMeltingPointApparatus(root, m);
        break;
      case 'mortuary-chamber':
        buildMortuaryChamber(root, m);
        break;
      case 'combo-oven-incubator':
        buildComboOvenIncubator(root, m);
        break;
      case 'egg-incubator':
        buildEggIncubator(root, m);
        break;
      case 'serum-inspissator':
        buildSerumInspissator(root, m);
        break;
      case 'electric-bunsen-burner':
        buildElectricBunsenBurner(root, m);
        break;
      case 'slide-warming-table':
        buildSlideWarmingTable(root, m);
        break;
      case 'bacteriological-incubator':
      default:
        buildBacteriologicalIncubator(root, m);
        break;
    }

    // Compute bounding box and center model at y=0
    const bbox = new THREE.Box3().setFromObject(root);
    const center = new THREE.Vector3();
    bbox.getCenter(center);
    root.position.x -= center.x;
    root.position.z -= center.z;
    root.position.y -= bbox.min.y; // Sit on ground plane

    // Enable shadows on all child meshes
    root.traverse(function (node) {
      if (node.isMesh) {
        node.castShadow = true;
        node.receiveShadow = true;
      }
    });

    return root;
  };

  /* =========================================================================
     INDIVIDUAL PROCEDURAL BUILDERS
     ========================================================================= */

  /**
   * B.O.D. Incubator (SSI / 005)
   */
  function buildBODIncubator(root, m) {
    const W = 1.1, H = 1.7, D = 1.0;

    // Main Outer Body (Powder Coated Teal/Blue Cabinet)
    const bodyGeo = new THREE.BoxGeometry(W, H, D);
    const body = new THREE.Mesh(bodyGeo, m.powderBlue);
    body.position.y = H / 2 + 0.12;
    root.add(body);

    // Inner Stainless Steel Chamber
    const innerGeo = new THREE.BoxGeometry(W - 0.16, H - 0.45, D - 0.16);
    const inner = new THREE.Mesh(innerGeo, m.ssBrushed);
    inner.position.set(0, H / 2 - 0.05, 0.06);
    root.add(inner);

    // 4 Perforated Stainless Wire Shelves
    for (let i = 0; i < 4; i++) {
      const shelfGeo = new THREE.BoxGeometry(W - 0.22, 0.015, D - 0.22);
      const shelf = new THREE.Mesh(shelfGeo, m.ssMirror);
      shelf.position.set(0, 0.45 + i * 0.28, 0.06);
      root.add(shelf);
      root.userData.explodedParts.push({
        mesh: shelf,
        origin: shelf.position.clone(),
        target: shelf.position.clone().add(new THREE.Vector3(0, 0, 0.35 + i * 0.1))
      });
    }

    // Top Fascia Control Panel (Beige / Off-White Header)
    const headerGeo = new THREE.BoxGeometry(W + 0.02, 0.3, D + 0.02);
    const header = new THREE.Mesh(headerGeo, m.powderBeige);
    header.position.set(0, H + 0.02, 0);
    root.add(header);

    // Digital Smart Controller & Rocker Switches on Header
    const cPanel = SSI_3D.createControlPanelMesh(0.55, 0.22, '020.0', 'BOD PV');
    cPanel.position.set(0, H + 0.02, D / 2 + 0.02);
    root.add(cPanel);

    // Outer Door with Hinge Group
    const doorHinge = new THREE.Group();
    doorHinge.position.set(-W / 2, H / 2 - 0.05, D / 2);
    root.add(doorHinge);
    root.userData.doorGroup = doorHinge;

    const doorGeo = new THREE.BoxGeometry(W, H - 0.34, 0.08);
    const doorMesh = new THREE.Mesh(doorGeo, m.powderBlue);
    doorMesh.position.set(W / 2, 0, 0.04);
    doorHinge.add(doorMesh);

    // Chrome Door Handle
    const handleGeo = new THREE.CylinderGeometry(0.015, 0.015, 0.35, 16);
    const handle = new THREE.Mesh(handleGeo, m.ssMirror);
    handle.position.set(W - 0.08, 0, 0.1);
    doorHinge.add(handle);

    // SSI Nameplate on Door
    SSI_3D.attachSSIPlate(doorHinge, new THREE.Vector3(W / 2, 0.25, 0.085), null, 1.1);

    // Inner Glass Door
    const glassGeo = new THREE.BoxGeometry(W - 0.14, H - 0.42, 0.015);
    const glass = new THREE.Mesh(glassGeo, m.glassToughened);
    glass.position.set(0, H / 2 - 0.05, D / 2 - 0.03);
    root.add(glass);

    // 4 Heavy-duty Castor Wheels
    [[-1, -1], [1, -1], [-1, 1], [1, 1]].forEach(function (dir) {
      const castorGeo = new THREE.CylinderGeometry(0.05, 0.05, 0.04, 16);
      const castor = new THREE.Mesh(castorGeo, m.rubberBlack);
      castor.rotation.z = Math.PI / 2;
      castor.position.set(dir[0] * (W / 2 - 0.1), 0.05, dir[1] * (D / 2 - 0.1));
      root.add(castor);
    });

    // Exploded View Setup
    root.userData.explodedParts.push({
      mesh: header,
      origin: header.position.clone(),
      target: header.position.clone().add(new THREE.Vector3(0, 0.4, 0))
    });
    root.userData.explodedParts.push({
      mesh: cPanel,
      origin: cPanel.position.clone(),
      target: cPanel.position.clone().add(new THREE.Vector3(0, 0.4, 0.2))
    });
  }

  /**
   * Hot Air Oven (SSI 027)
   */
  function buildHotAirOven(root, m) {
    const W = 1.0, H = 1.1, D = 0.9;

    // Body (Double-walled Cream/Stainless Cabinet)
    const bodyGeo = new THREE.BoxGeometry(W, H, D);
    const body = new THREE.Mesh(bodyGeo, m.powderBeige);
    body.position.y = H / 2 + 0.1;
    root.add(body);

    // Top Controller Housing
    const topBoxGeo = new THREE.BoxGeometry(W, 0.25, D);
    const topBox = new THREE.Mesh(topBoxGeo, m.powderBlue);
    topBox.position.set(0, H + 0.08, 0);
    root.add(topBox);

    const cPanel = SSI_3D.createControlPanelMesh(0.5, 0.18, '160.0', 'OVEN PV');
    cPanel.position.set(0, H + 0.08, D / 2 + 0.02);
    root.add(cPanel);

    // Side Ventilation Louvers
    [-1, 1].forEach(function (side) {
      for (let i = 0; i < 4; i++) {
        const ventGeo = new THREE.BoxGeometry(0.02, 0.015, 0.35);
        const vent = new THREE.Mesh(ventGeo, m.darkChamber);
        vent.position.set(side * (W / 2 + 0.005), H * 0.75 + i * 0.04, 0);
        root.add(vent);
      }
    });

    // Inner Polished Stainless Steel Chamber
    const innerGeo = new THREE.BoxGeometry(W - 0.18, H - 0.25, D - 0.18);
    const inner = new THREE.Mesh(innerGeo, m.ssBrushed);
    inner.position.set(0, H / 2 + 0.02, 0.06);
    root.add(inner);

    // Nichrome Heating Ribs & Stainless Shelves
    for (let i = 0; i < 3; i++) {
      const shelfGeo = new THREE.BoxGeometry(W - 0.24, 0.015, D - 0.24);
      const shelf = new THREE.Mesh(shelfGeo, m.ssMirror);
      shelf.position.set(0, 0.35 + i * 0.26, 0.06);
      root.add(shelf);
      root.userData.explodedParts.push({
        mesh: shelf,
        origin: shelf.position.clone(),
        target: shelf.position.clone().add(new THREE.Vector3(0, 0, 0.4 + i * 0.12))
      });
    }

    // Door with Chrome Latch
    const doorHinge = new THREE.Group();
    doorHinge.position.set(-W / 2, H / 2 + 0.02, D / 2);
    root.add(doorHinge);
    root.userData.doorGroup = doorHinge;

    const doorGeo = new THREE.BoxGeometry(W, H - 0.15, 0.07);
    const door = new THREE.Mesh(doorGeo, m.ssBrushed);
    door.position.set(W / 2, 0, 0.035);
    doorHinge.add(door);

    // Door Glass Viewing Window
    const winGeo = new THREE.BoxGeometry(0.35, 0.45, 0.08);
    const win = new THREE.Mesh(winGeo, m.glassToughened);
    win.position.set(W / 2 - 0.05, 0, 0.04);
    doorHinge.add(win);

    // Heavy Industrial Door Latch Handle
    const latchGeo = new THREE.BoxGeometry(0.04, 0.22, 0.08);
    const latch = new THREE.Mesh(latchGeo, m.ssMirror);
    latch.position.set(W - 0.08, 0, 0.08);
    doorHinge.add(latch);

    // SSI Nameplate
    SSI_3D.attachSSIPlate(doorHinge, new THREE.Vector3(W / 2, 0.35, 0.075), null, 0.9);

    // 4 Rubber Feet
    [[-1, -1], [1, -1], [-1, 1], [1, 1]].forEach(function (dir) {
      const footGeo = new THREE.CylinderGeometry(0.04, 0.04, 0.05, 16);
      const foot = new THREE.Mesh(footGeo, m.rubberBlack);
      foot.position.set(dir[0] * (W / 2 - 0.1), 0.025, dir[1] * (D / 2 - 0.1));
      root.add(foot);
    });

    root.userData.explodedParts.push({
      mesh: topBox,
      origin: topBox.position.clone(),
      target: topBox.position.clone().add(new THREE.Vector3(0, 0.35, 0))
    });
  }

  /**
   * Vertical Autoclave (Steam Sterilizer)
   */
  function buildVerticalAutoclave(root, m) {
    const R = 0.45, H = 1.1;

    // Cylindrical SS-304 Pressure Chamber
    const cylGeo = new THREE.CylinderGeometry(R, R, H, 32);
    const cyl = new THREE.Mesh(cylGeo, m.ssBrushed);
    cyl.position.y = H / 2 + 0.35;
    root.add(cyl);

    // Outer Jacket Lower Skirt with SSI Nameplate
    const skirtGeo = new THREE.CylinderGeometry(R + 0.02, R + 0.02, 0.3, 32);
    const skirt = new THREE.Mesh(skirtGeo, m.powderBlue);
    skirt.position.y = 0.5;
    root.add(skirt);
    SSI_3D.attachSSIPlate(skirt, new THREE.Vector3(0, 0, R + 0.025), null, 0.85);

    // Inner Perforated Stainless Steel Carrier Basket
    const basketGeo = new THREE.CylinderGeometry(R - 0.06, R - 0.06, H - 0.25, 24, 1, true);
    const basket = new THREE.Mesh(basketGeo, m.ssMirror);
    basket.position.y = H / 2 + 0.38;
    root.add(basket);

    root.userData.explodedParts.push({
      mesh: basket,
      origin: basket.position.clone(),
      target: basket.position.clone().add(new THREE.Vector3(0, 0.65, 0))
    });

    // Top Cast Stainless Lid / Dome Head
    const lidGroup = new THREE.Group();
    lidGroup.position.set(0, H + 0.35, 0);
    root.add(lidGroup);
    root.userData.doorGroup = lidGroup; // In autoclave, doorGroup controls lid lift/pivot

    const domeGeo = new THREE.SphereGeometry(R + 0.02, 32, 16, 0, Math.PI * 2, 0, Math.PI * 0.35);
    const dome = new THREE.Mesh(domeGeo, m.ssMirror);
    dome.position.y = 0;
    lidGroup.add(dome);

    // 6 Radial Gun-metal Clamp Screws / Lugs
    for (let i = 0; i < 6; i++) {
      const angle = (i / 6) * Math.PI * 2;
      const lugGeo = new THREE.BoxGeometry(0.08, 0.12, 0.06);
      const lug = new THREE.Mesh(lugGeo, m.brassGold);
      lug.position.set(Math.cos(angle) * (R + 0.03), 0.02, Math.sin(angle) * (R + 0.03));
      lug.rotation.y = -angle;
      lidGroup.add(lug);
    }

    // Dial Pressure Gauge on Top of Lid
    const gaugeStemGeo = new THREE.CylinderGeometry(0.015, 0.015, 0.12, 16);
    const gaugeStem = new THREE.Mesh(gaugeStemGeo, m.ssMirror);
    gaugeStem.position.set(-R * 0.35, 0.18, 0);
    lidGroup.add(gaugeStem);

    const gaugeDialGeo = new THREE.CylinderGeometry(0.08, 0.08, 0.03, 24);
    gaugeDialGeo.rotateX(Math.PI / 2);
    const gaugeMat = new THREE.MeshStandardMaterial({
      map: SSI_3D.getPressureGaugeTexture(),
      roughness: 0.25,
      metalness: 0.8,
    });
    const gaugeDial = new THREE.Mesh(gaugeDialGeo, gaugeMat);
    gaugeDial.position.set(-R * 0.35, 0.26, 0.02);
    lidGroup.add(gaugeDial);

    // Spring Loaded Safety Valve & Release Cock
    const valveGeo = new THREE.CylinderGeometry(0.02, 0.025, 0.14, 16);
    const valve = new THREE.Mesh(valveGeo, m.brassGold);
    valve.position.set(R * 0.35, 0.2, 0);
    lidGroup.add(valve);

    // Lifting Handle
    const lidHandleGeo = new THREE.TorusGeometry(0.08, 0.015, 12, 24, Math.PI);
    const lidHandle = new THREE.Mesh(lidHandleGeo, m.ssMirror);
    lidHandle.position.set(0, 0.16, 0);
    lidHandle.rotation.x = -Math.PI / 2;
    lidGroup.add(lidHandle);

    // 3 Heavy Tripod Stanchion Legs
    for (let i = 0; i < 3; i++) {
      const angle = (i / 3) * Math.PI * 2 + Math.PI / 6;
      const legGeo = new THREE.CylinderGeometry(0.03, 0.03, 0.45, 16);
      const leg = new THREE.Mesh(legGeo, m.gunmetal);
      leg.position.set(Math.cos(angle) * (R * 0.85), 0.18, Math.sin(angle) * (R * 0.85));
      root.add(leg);
    }

    // Exploded View Setup for Autoclave: Lid moves upwards!
    root.userData.explodedParts.push({
      mesh: lidGroup,
      origin: lidGroup.position.clone(),
      target: lidGroup.position.clone().add(new THREE.Vector3(0, 0.5, 0))
    });
  }

  /**
   * Humidity Chamber (Cool, Warm & Humid)
   */
  function buildHumidityChamber(root, m) {
    const W = 1.15, H = 1.8, D = 1.05;

    // Heavy Gauge Steel Body
    const bodyGeo = new THREE.BoxGeometry(W, H, D);
    const body = new THREE.Mesh(bodyGeo, m.powderBlue);
    body.position.y = H / 2 + 0.12;
    root.add(body);

    // Top Header with Dual Humidity & Temperature Digital Controllers
    const topGeo = new THREE.BoxGeometry(W + 0.02, 0.32, D + 0.02);
    const topMesh = new THREE.Mesh(topGeo, m.powderBeige);
    topMesh.position.set(0, H + 0.02, 0);
    root.add(topMesh);

    const cPanel = SSI_3D.createControlPanelMesh(0.65, 0.22, '90% RH', 'HUMIDITY');
    cPanel.position.set(0, H + 0.02, D / 2 + 0.02);
    root.add(cPanel);

    // Stainless Interior Chamber
    const innerGeo = new THREE.BoxGeometry(W - 0.18, H - 0.45, D - 0.18);
    const inner = new THREE.Mesh(innerGeo, m.ssBrushed);
    inner.position.set(0, H / 2 - 0.04, 0.06);
    root.add(inner);

    // Perforated Stainless Steel Shelves
    for (let i = 0; i < 4; i++) {
      const shelfGeo = new THREE.BoxGeometry(W - 0.24, 0.015, D - 0.24);
      const shelf = new THREE.Mesh(shelfGeo, m.ssMirror);
      shelf.position.set(0, 0.45 + i * 0.3, 0.06);
      root.add(shelf);
      root.userData.explodedParts.push({
        mesh: shelf,
        origin: shelf.position.clone(),
        target: shelf.position.clone().add(new THREE.Vector3(0, 0, 0.35 + i * 0.1))
      });
    }

    // Outer Insulated Door with Fullview Glass Inner Door
    const doorHinge = new THREE.Group();
    doorHinge.position.set(-W / 2, H / 2 - 0.04, D / 2);
    root.add(doorHinge);
    root.userData.doorGroup = doorHinge;

    const doorGeo = new THREE.BoxGeometry(W, H - 0.36, 0.08);
    const doorMesh = new THREE.Mesh(doorGeo, m.powderBlue);
    doorMesh.position.set(W / 2, 0, 0.04);
    doorHinge.add(doorMesh);

    // Heavy Rubber Gasket on Door Rim
    const gasketGeo = new THREE.BoxGeometry(W - 0.04, H - 0.4, 0.02);
    const gasket = new THREE.Mesh(gasketGeo, m.rubberBlack);
    gasket.position.set(W / 2, 0, -0.01);
    doorHinge.add(gasket);

    // Door Handle & Lock
    const handleGeo = new THREE.CylinderGeometry(0.018, 0.018, 0.4, 16);
    const handle = new THREE.Mesh(handleGeo, m.ssMirror);
    handle.position.set(W - 0.08, 0, 0.1);
    doorHinge.add(handle);

    // SSI Nameplate
    SSI_3D.attachSSIPlate(doorHinge, new THREE.Vector3(W / 2, 0.3, 0.085), null, 1.1);

    // Inner Full-View Toughened Glass Door
    const glassGeo = new THREE.BoxGeometry(W - 0.14, H - 0.42, 0.015);
    const glass = new THREE.Mesh(glassGeo, m.glassToughened);
    glass.position.set(0, H / 2 - 0.04, D / 2 - 0.03);
    root.add(glass);

    // 4 Castor Wheels
    [[-1, -1], [1, -1], [-1, 1], [1, 1]].forEach(function (dir) {
      const castorGeo = new THREE.CylinderGeometry(0.05, 0.05, 0.04, 16);
      const castor = new THREE.Mesh(castorGeo, m.rubberBlack);
      castor.rotation.z = Math.PI / 2;
      castor.position.set(dir[0] * (W / 2 - 0.1), 0.05, dir[1] * (D / 2 - 0.1));
      root.add(castor);
    });
  }

  /**
   * Water Bath (High Precision / Double Walled / Universal)
   */
  function buildWaterBath(root, m, type) {
    const W = 0.95, H = 0.48, D = 0.65;

    // Body
    const bodyGeo = new THREE.BoxGeometry(W, H, D);
    const bodyMat = type === 'water-bath-rings' ? m.powderBlue : m.ssBrushed;
    const body = new THREE.Mesh(bodyGeo, bodyMat);
    body.position.y = H / 2 + 0.06;
    root.add(body);

    // Inner Stainless Tank
    const tankGeo = new THREE.BoxGeometry(W - 0.15, H - 0.08, D - 0.15);
    const tank = new THREE.Mesh(tankGeo, m.ssMirror);
    tank.position.set(0, H / 2 + 0.08, 0);
    root.add(tank);

    // Water Surface Plane (translucent blue)
    const waterGeo = new THREE.PlaneGeometry(W - 0.16, D - 0.16);
    const waterMat = new THREE.MeshStandardMaterial({
      color: 0x38bdf8,
      transparent: true,
      opacity: 0.6,
      roughness: 0.1,
    });
    const water = new THREE.Mesh(waterGeo, waterMat);
    water.rotation.x = -Math.PI / 2;
    water.position.set(0, H + 0.02, 0);
    root.add(water);

    // SSI Nameplate on Front
    SSI_3D.attachSSIPlate(body, new THREE.Vector3(0, -0.05, D / 2 + 0.005), null, 0.85);

    // Side Control Panel
    const cPanel = SSI_3D.createControlPanelMesh(0.28, 0.32, '037.0', 'BATH PV');
    cPanel.position.set(W / 2 + 0.02, H / 2 + 0.06, 0);
    cPanel.rotation.y = Math.PI / 2;
    root.add(cPanel);

    // Lid or Stirrer depending on variant
    if (type === 'constant-temp-water-bath' || type === 'water-bath') {
      // Top Motorized Stirrer Column
      const stirrerGeo = new THREE.CylinderGeometry(0.045, 0.045, 0.22, 16);
      const stirrer = new THREE.Mesh(stirrerGeo, m.powderBlue);
      stirrer.position.set(-W * 0.35, H + 0.16, 0);
      root.add(stirrer);

      const shaftGeo = new THREE.CylinderGeometry(0.008, 0.008, 0.3, 16);
      const shaft = new THREE.Mesh(shaftGeo, m.ssMirror);
      shaft.position.set(-W * 0.35, H - 0.05, 0);
      root.add(shaft);

      // Gabled / Pyramidal SS Lid
      const lidGroup = new THREE.Group();
      lidGroup.position.set(0.1, H + 0.06, 0);
      root.add(lidGroup);
      root.userData.doorGroup = lidGroup;

      const roofGeo = new THREE.ConeGeometry(0.35, 0.15, 4);
      roofGeo.rotateY(Math.PI / 4);
      roofGeo.scale(1.2, 1, 1.4);
      const roof = new THREE.Mesh(roofGeo, m.ssBrushed);
      roof.position.y = 0.075;
      lidGroup.add(roof);

      root.userData.explodedParts.push({
        mesh: lidGroup,
        origin: lidGroup.position.clone(),
        target: lidGroup.position.clone().add(new THREE.Vector3(0, 0.35, 0))
      });
    } else {
      // Concentric Rings Lid (6 or 12 openings)
      const ringPlateGeo = new THREE.BoxGeometry(W - 0.12, 0.02, D - 0.12);
      const ringPlate = new THREE.Mesh(ringPlateGeo, m.ssBrushed);
      ringPlate.position.set(0, H + 0.07, 0);
      root.add(ringPlate);

      // Add 6 concentric ring holes
      [-0.24, 0, 0.24].forEach(function (x) {
        [-0.14, 0.14].forEach(function (z) {
          const ringGeo = new THREE.TorusGeometry(0.065, 0.01, 8, 24);
          ringGeo.rotateX(Math.PI / 2);
          const ring = new THREE.Mesh(ringGeo, m.ssMirror);
          ring.position.set(x, H + 0.082, z);
          root.add(ring);
        });
      });
    }
  }

  /**
   * Laminar Air Flow Clean Bench (SSI/043)
   */
  function buildLaminarAirFlow(root, m) {
    const W = 1.3, H = 1.7, D = 0.85;

    // Lower Tubular Stand
    const standMat = m.powderBlue;
    const standH = 0.75;
    [[-1, -1], [1, -1], [-1, 1], [1, 1]].forEach(function (dir) {
      const legGeo = new THREE.CylinderGeometry(0.025, 0.025, standH, 16);
      const leg = new THREE.Mesh(legGeo, standMat);
      leg.position.set(dir[0] * (W / 2 - 0.05), standH / 2, dir[1] * (D / 2 - 0.05));
      root.add(leg);
    });

    // Stainless Work Table
    const tableGeo = new THREE.BoxGeometry(W, 0.04, D);
    const table = new THREE.Mesh(tableGeo, m.ssMirror);
    table.position.set(0, standH, 0);
    root.add(table);

    // Upper Cabinet & HEPA Plenum Housing
    const upperH = 0.85;
    const upperGeo = new THREE.BoxGeometry(W, upperH, D);
    const upper = new THREE.Mesh(upperGeo, m.powderBeige);
    upper.position.set(0, standH + upperH / 2 + 0.02, 0);
    root.add(upper);

    // Front Open Work Cavity
    const cavityGeo = new THREE.BoxGeometry(W - 0.1, upperH - 0.25, D - 0.08);
    const cavity = new THREE.Mesh(cavityGeo, m.ssBrushed);
    cavity.position.set(0, standH + (upperH - 0.25) / 2 + 0.04, 0.04);
    root.add(cavity);

    // HEPA Filter Honeycomb Grille at back wall
    const hepaGeo = new THREE.PlaneGeometry(W - 0.12, upperH - 0.28);
    const hepaMat = new THREE.MeshStandardMaterial({
      color: 0xf1f5f9,
      roughness: 0.6,
      wireframe: true,
    });
    const hepa = new THREE.Mesh(hepaGeo, hepaMat);
    hepa.position.set(0, standH + (upperH - 0.25) / 2 + 0.04, -D / 2 + 0.08);
    root.add(hepa);

    // Side Transparent Acrylic Panels
    [-1, 1].forEach(function (side) {
      const sashGeo = new THREE.BoxGeometry(0.015, upperH - 0.26, D - 0.1);
      const sash = new THREE.Mesh(sashGeo, m.glassToughened);
      sash.position.set(side * (W / 2 - 0.04), standH + (upperH - 0.25) / 2 + 0.04, 0.04);
      root.add(sash);
    });

    // UV Germicidal Tube & Fluorescent Illuminator on ceiling
    const uvGeo = new THREE.CylinderGeometry(0.012, 0.012, W - 0.3, 16);
    uvGeo.rotateZ(Math.PI / 2);
    const uvMat = new THREE.MeshStandardMaterial({ color: 0x818cf8, emissive: 0x6366f1, emissiveIntensity: 0.6 });
    const uvTube = new THREE.Mesh(uvGeo, uvMat);
    uvTube.position.set(0, standH + upperH - 0.24, 0.15);
    root.add(uvTube);

    // SSI Nameplate on Top Header
    SSI_3D.attachSSIPlate(upper, new THREE.Vector3(0, upperH / 2 - 0.08, D / 2 + 0.005), null, 1.0);
  }

  /**
   * Fume Hood Chamber
   */
  function buildFumeHood(root, m) {
    const W = 1.3, H = 2.0, D = 0.9;

    // Lower Storage Base Cabinet with Double Doors
    const baseH = 0.75;
    const baseGeo = new THREE.BoxGeometry(W, baseH, D);
    const base = new THREE.Mesh(baseGeo, m.powderBlue);
    base.position.set(0, baseH / 2, 0);
    root.add(base);

    // Work Table Top (Black Granite / Chemical Ceramic)
    const workGeo = new THREE.BoxGeometry(W + 0.04, 0.05, D + 0.04);
    const workMat = new THREE.MeshStandardMaterial({ color: 0x1e293b, roughness: 0.3 });
    const work = new THREE.Mesh(workGeo, workMat);
    work.position.set(0, baseH + 0.025, 0);
    root.add(work);

    // Upper Hood Canopy
    const hoodH = 1.2;
    const hoodGeo = new THREE.BoxGeometry(W, hoodH, D);
    const hood = new THREE.Mesh(hoodGeo, m.powderBeige);
    hood.position.set(0, baseH + hoodH / 2 + 0.05, 0);
    root.add(hood);

    // Work Chamber Cavity with Epoxy Interior
    const cavGeo = new THREE.BoxGeometry(W - 0.12, hoodH - 0.3, D - 0.12);
    const cav = new THREE.Mesh(cavGeo, m.ssBrushed);
    cav.position.set(0, baseH + (hoodH - 0.3) / 2 + 0.08, 0.05);
    root.add(cav);

    // Sliding Glass Sash with Aluminum Frame
    const sashH = 0.65;
    const sashGeo = new THREE.BoxGeometry(W - 0.08, sashH, 0.02);
    const sash = new THREE.Mesh(sashGeo, m.glassToughened);
    sash.position.set(0, baseH + hoodH * 0.45, D / 2 - 0.02);
    root.add(sash);
    root.userData.doorGroup = sash; // In fume hood, door moves vertically!

    // Top Exhaust Duct Collar
    const ductGeo = new THREE.CylinderGeometry(0.12, 0.12, 0.25, 24);
    const duct = new THREE.Mesh(ductGeo, m.gunmetal);
    duct.position.set(0, baseH + hoodH + 0.15, 0);
    root.add(duct);

    // SSI Nameplate
    SSI_3D.attachSSIPlate(hood, new THREE.Vector3(0, hoodH / 2 - 0.08, D / 2 + 0.005), null, 1.1);

    root.userData.explodedParts.push({
      mesh: duct,
      origin: duct.position.clone(),
      target: duct.position.clone().add(new THREE.Vector3(0, 0.35, 0))
    });
  }

  /**
   * Laboratory Furnace / Muffle Furnace (SSI Make-049)
   */
  function buildLaboratoryFurnace(root, m) {
    const W = 0.85, H = 1.0, D = 0.85;

    // Outer Heavy Gauge CRC Steel Shell
    const bodyGeo = new THREE.BoxGeometry(W, H, D);
    const body = new THREE.Mesh(bodyGeo, m.powderBeige);
    body.position.y = H / 2 + 0.06;
    root.add(body);

    // Top Digital Temperature Programmer Housing
    const topGeo = new THREE.BoxGeometry(W * 0.8, 0.24, D * 0.7);
    const topBox = new THREE.Mesh(topGeo, m.powderBlue);
    topBox.position.set(0, H + 0.16, 0);
    root.add(topBox);

    const cPanel = SSI_3D.createControlPanelMesh(0.48, 0.18, '1150°C', 'FURNACE');
    cPanel.position.set(0, H + 0.16, D * 0.35 + 0.02);
    root.add(cPanel);

    // Internal Refractory Muffle (Glowing Red-Orange Kanthal Elements)
    const muffleGeo = new THREE.BoxGeometry(W * 0.45, H * 0.38, D * 0.5);
    const muffle = new THREE.Mesh(muffleGeo, m.heatingGlow);
    muffle.position.set(0, H / 2, 0.05);
    root.add(muffle);

    // Heavy Insulated Hinged Door
    const doorHinge = new THREE.Group();
    doorHinge.position.set(-W / 2 + 0.05, H / 2, D / 2);
    root.add(doorHinge);
    root.userData.doorGroup = doorHinge;

    const doorGeo = new THREE.BoxGeometry(W * 0.65, H * 0.55, 0.14);
    const door = new THREE.Mesh(doorGeo, m.ssBrushed);
    door.position.set(W * 0.32, 0, 0.07);
    doorHinge.add(door);

    // Heavy Handle Latch
    const handleGeo = new THREE.CylinderGeometry(0.015, 0.015, 0.25, 16);
    const handle = new THREE.Mesh(handleGeo, m.ssMirror);
    handle.position.set(W * 0.6, 0, 0.16);
    doorHinge.add(handle);

    // SSI Nameplate
    SSI_3D.attachSSIPlate(doorHinge, new THREE.Vector3(W * 0.32, 0.18, 0.145), null, 0.75);

    // 4 Heavy-duty Foot Pads
    [[-1, -1], [1, -1], [-1, 1], [1, 1]].forEach(function (dir) {
      const footGeo = new THREE.CylinderGeometry(0.04, 0.04, 0.06, 16);
      const foot = new THREE.Mesh(footGeo, m.gunmetal);
      foot.position.set(dir[0] * (W / 2 - 0.08), 0.03, dir[1] * (D / 2 - 0.08));
      root.add(foot);
    });
  }

  /**
   * Colony Counter (Digital SSI/013)
   */
  function buildColonyCounter(root, m) {
    const W = 0.65, H = 0.35, D = 0.55;

    // Angled Console Body
    const bodyGeo = new THREE.BoxGeometry(W, H, D);
    const body = new THREE.Mesh(bodyGeo, m.powderBeige);
    body.position.y = H / 2;
    body.rotation.x = 0.15; // Sloped work deck
    root.add(body);

    // Circular Illuminated Wolffhuegel Counting Plate
    const plateGeo = new THREE.CylinderGeometry(0.18, 0.18, 0.02, 32);
    plateGeo.rotateX(Math.PI / 2);
    const plateMat = new THREE.MeshStandardMaterial({
      map: SSI_3D.getWolffhuegelGridTexture(),
      roughness: 0.2,
      emissive: 0x38bdf8,
      emissiveIntensity: 0.3,
    });
    const plate = new THREE.Mesh(plateGeo, plateMat);
    plate.position.set(-0.08, H * 0.65, 0.04);
    plate.rotation.x = 0.15;
    root.add(plate);

    // 4-Digit Digital LED Display Window
    const dispGeo = new THREE.BoxGeometry(0.18, 0.08, 0.02);
    const dispMat = new THREE.MeshBasicMaterial({ color: 0xdc2626 });
    const disp = new THREE.Mesh(dispGeo, dispMat);
    disp.position.set(0.18, H * 0.72, 0.12);
    disp.rotation.x = 0.15;
    root.add(disp);

    // Magnifying Lens on Chrome Goose-neck Arm
    const armCurve = new THREE.QuadraticBezierCurve3(
      new THREE.Vector3(-W * 0.32, H * 0.6, -D * 0.2),
      new THREE.Vector3(-W * 0.35, H + 0.4, 0),
      new THREE.Vector3(-0.08, H + 0.32, 0.05)
    );
    const armGeo = new THREE.TubeGeometry(armCurve, 20, 0.012, 8, false);
    const arm = new THREE.Mesh(armGeo, m.ssMirror);
    root.add(arm);

    // Magnifying Lens Ring & Convex Glass
    const lensRingGeo = new THREE.TorusGeometry(0.12, 0.015, 12, 32);
    const lensRing = new THREE.Mesh(lensRingGeo, m.ssMirror);
    lensRing.position.set(-0.08, H + 0.32, 0.05);
    lensRing.rotation.x = Math.PI / 2 + 0.15;
    root.add(lensRing);

    const lensGlassGeo = new THREE.SphereGeometry(0.115, 24, 16);
    lensGlassGeo.scale(1, 0.08, 1);
    const lensGlass = new THREE.Mesh(lensGlassGeo, m.glassToughened);
    lensGlass.position.copy(lensRing.position);
    lensGlass.rotation.copy(lensRing.rotation);
    root.add(lensGlass);

    // Marking Pen Probe with Coil Cord
    const penGeo = new THREE.CylinderGeometry(0.01, 0.012, 0.22, 16);
    const pen = new THREE.Mesh(penGeo, m.ssBrushed);
    pen.position.set(0.22, H * 0.4, 0.22);
    pen.rotation.z = Math.PI / 4;
    root.add(pen);

    SSI_3D.attachSSIPlate(body, new THREE.Vector3(-0.15, -0.06, D / 2 + 0.005), null, 0.7);
  }

  /**
   * Rectangular Hot Plate (SSI 028 (A))
   */
  function buildRectangularHotPlate(root, m) {
    const W = 0.75, H = 0.22, D = 0.5;

    // Mild Steel Base Housing
    const baseGeo = new THREE.BoxGeometry(W, H, D);
    const base = new THREE.Mesh(baseGeo, m.powderBeige);
    base.position.y = H / 2 + 0.04;
    root.add(base);

    // Machined Cast Iron Top Plate with Thermal Standoffs
    const topPlateGeo = new THREE.BoxGeometry(W + 0.04, 0.045, D + 0.04);
    const topPlate = new THREE.Mesh(topPlateGeo, m.darkChamber);
    topPlate.position.set(0, H + 0.06, 0);
    root.add(topPlate);

    // Front Control Knobs (3-heat switches)
    [-0.15, 0.15].forEach(function (x) {
      const knobGeo = new THREE.CylinderGeometry(0.035, 0.035, 0.03, 24);
      knobGeo.rotateX(Math.PI / 2);
      const knob = new THREE.Mesh(knobGeo, m.rubberBlack);
      knob.position.set(x, H / 2 + 0.04, D / 2 + 0.02);
      root.add(knob);
    });

    // Indicator Lamps
    [-0.25, 0.25].forEach(function (x) {
      const lampGeo = new THREE.SphereGeometry(0.012, 16, 16);
      const lampMat = new THREE.MeshBasicMaterial({ color: x < 0 ? 0xdc2626 : 0x16a34a });
      const lamp = new THREE.Mesh(lampGeo, lampMat);
      lamp.position.set(x, H / 2 + 0.04, D / 2 + 0.01);
      root.add(lamp);
    });

    SSI_3D.attachSSIPlate(base, new THREE.Vector3(0, H / 2 + 0.04, D / 2 + 0.005), null, 0.75);

    root.userData.explodedParts.push({
      mesh: topPlate,
      origin: topPlate.position.clone(),
      target: topPlate.position.clone().add(new THREE.Vector3(0, 0.22, 0))
    });
  }

  /**
   * Round Hot Plate
   */
  function buildRoundHotPlate(root, m) {
    const R = 0.26, H = 0.24;

    // Circular Cast Iron Plate
    const plateGeo = new THREE.CylinderGeometry(R, R, 0.04, 32);
    const plate = new THREE.Mesh(plateGeo, m.darkChamber);
    plate.position.y = H + 0.02;
    root.add(plate);

    // Tripod / Cylindrical Base Housing
    const baseGeo = new THREE.CylinderGeometry(R - 0.02, R + 0.02, H, 32);
    const base = new THREE.Mesh(baseGeo, m.powderBeige);
    base.position.y = H / 2 + 0.01;
    root.add(base);

    // Front Knob
    const knobGeo = new THREE.CylinderGeometry(0.03, 0.03, 0.025, 20);
    knobGeo.rotateX(Math.PI / 2);
    const knob = new THREE.Mesh(knobGeo, m.rubberBlack);
    knob.position.set(0, H * 0.45, R + 0.02);
    root.add(knob);

    SSI_3D.attachSSIPlate(base, new THREE.Vector3(0, H * 0.75, R + 0.01), null, 0.55);
  }

  /**
   * Heating Mantle
   */
  function buildHeatingMantle(root, m) {
    const R = 0.32, H = 0.32;

    // Hemispherical Spun Aluminum Outer Housing (Blue)
    const shellGeo = new THREE.CylinderGeometry(R, R * 0.85, H, 32);
    const shell = new THREE.Mesh(shellGeo, m.powderBlue);
    shell.position.y = H / 2 + 0.04;
    root.add(shell);

    // Knitted Fiberglass Nest Cavity
    const nestGeo = new THREE.SphereGeometry(R * 0.75, 24, 16, 0, Math.PI * 2, Math.PI / 2, Math.PI / 2);
    const nestMat = new THREE.MeshStandardMaterial({
      color: 0xfef08a,
      roughness: 0.85,
      metalness: 0.05,
    });
    const nest = new THREE.Mesh(nestGeo, nestMat);
    nest.position.set(0, H + 0.04, 0);
    root.add(nest);

    // Energy Regulator Knob & Pilot Lamp
    const knobGeo = new THREE.CylinderGeometry(0.03, 0.03, 0.025, 20);
    knobGeo.rotateX(Math.PI / 2);
    const knob = new THREE.Mesh(knobGeo, m.rubberBlack);
    knob.position.set(0, H * 0.45, R * 0.95);
    root.add(knob);

    const lampGeo = new THREE.SphereGeometry(0.012, 16, 16);
    const lampMat = new THREE.MeshBasicMaterial({ color: 0xef4444 });
    const lamp = new THREE.Mesh(lampGeo, lampMat);
    lamp.position.set(0.1, H * 0.45, R * 0.94);
    root.add(lamp);

    SSI_3D.attachSSIPlate(shell, new THREE.Vector3(0, H * 0.75, R * 0.92), null, 0.65);
  }

  /**
   * Ultra Low Freezers (Chest or Upright)
   */
  function buildFreezer(root, m, type) {
    if (type === 'ultra-cryostat-bath') {
      buildWaterBath(root, m, 'constant-temp-water-bath');
      return;
    }

    // Default to Vertical Upright / Chest Freezer
    const isChest = type === 'freezer-chest';
    if (isChest) {
      const W = 1.4, H = 0.95, D = 0.85;
      const bodyGeo = new THREE.BoxGeometry(W, H, D);
      const body = new THREE.Mesh(bodyGeo, m.powderBeige);
      body.position.y = H / 2 + 0.06;
      root.add(body);

      // Hinged Top Counterbalanced Lid
      const lidHinge = new THREE.Group();
      lidHinge.position.set(0, H + 0.06, -D / 2);
      root.add(lidHinge);
      root.userData.doorGroup = lidHinge;

      const lidGeo = new THREE.BoxGeometry(W + 0.04, 0.09, D + 0.04);
      const lid = new THREE.Mesh(lidGeo, m.powderBeige);
      lid.position.set(0, 0.045, D / 2);
      lidHinge.add(lid);

      const handleGeo = new THREE.BoxGeometry(0.25, 0.04, 0.06);
      const handle = new THREE.Mesh(handleGeo, m.ssMirror);
      handle.position.set(0, 0.05, D - 0.02);
      lidHinge.add(handle);

      SSI_3D.attachSSIPlate(body, new THREE.Vector3(0, H * 0.65, D / 2 + 0.005), null, 1.1);
    } else {
      // Upright Vertical Freezer (-80°C)
      const W = 0.95, H = 1.7, D = 0.9;
      const bodyGeo = new THREE.BoxGeometry(W, H, D);
      const body = new THREE.Mesh(bodyGeo, m.powderBeige);
      body.position.y = H / 2 + 0.08;
      root.add(body);

      // Bottom Compressor Vent Grill
      const ventGeo = new THREE.BoxGeometry(W - 0.1, 0.35, 0.02);
      const vent = new THREE.Mesh(ventGeo, m.darkChamber);
      vent.position.set(0, 0.28, D / 2 + 0.01);
      root.add(vent);

      // Front Door
      const doorHinge = new THREE.Group();
      doorHinge.position.set(-W / 2, H * 0.6 + 0.08, D / 2);
      root.add(doorHinge);
      root.userData.doorGroup = doorHinge;

      const doorGeo = new THREE.BoxGeometry(W, H - 0.45, 0.08);
      const door = new THREE.Mesh(doorGeo, m.powderBlue);
      door.position.set(W / 2, 0, 0.04);
      doorHinge.add(door);

      SSI_3D.attachSSIPlate(doorHinge, new THREE.Vector3(W / 2, 0.25, 0.085), null, 1.0);
    }
  }

  /**
   * Kjeldahl Distillation & Digestion Unit
   */
  function buildKjeldahlUnit(root, m, isMicro) {
    const W = isMicro ? 0.8 : 1.3, H = 1.2, D = 0.55;

    // Heavy Tubular Stand
    const benchGeo = new THREE.BoxGeometry(W, 0.2, D);
    const bench = new THREE.Mesh(benchGeo, m.powderBlue);
    bench.position.set(0, 0.35, 0);
    root.add(bench);

    // 6 Mantle Recesses with Glass Flasks & Condensers
    const count = 6;
    const spacing = (W - 0.2) / count;
    for (let i = 0; i < count; i++) {
      const x = -W / 2 + 0.15 + i * spacing;

      // Mantle cup
      const cupGeo = new THREE.CylinderGeometry(0.065, 0.055, 0.08, 16);
      const cup = new THREE.Mesh(cupGeo, m.darkChamber);
      cup.position.set(x, 0.49, 0);
      root.add(cup);

      // Flask
      const flaskGeo = new THREE.SphereGeometry(0.06, 16, 16);
      const flask = new THREE.Mesh(flaskGeo, m.glassToughened);
      flask.position.set(x, 0.54, 0);
      root.add(flask);

      // Condenser Tube
      const tubeGeo = new THREE.CylinderGeometry(0.018, 0.018, 0.55, 16);
      const tube = new THREE.Mesh(tubeGeo, m.glassToughened);
      tube.position.set(x, 0.88, 0);
      root.add(tube);
    }

    // Top Manifold Water Header
    const manifoldGeo = new THREE.CylinderGeometry(0.02, 0.02, W - 0.1, 16);
    manifoldGeo.rotateZ(Math.PI / 2);
    const manifold = new THREE.Mesh(manifoldGeo, m.brassGold);
    manifold.position.set(0, 1.15, 0.08);
    root.add(manifold);

    SSI_3D.attachSSIPlate(bench, new THREE.Vector3(0, 0, D / 2 + 0.005), null, 0.85);
  }

  /**
   * Soxhlet Extraction Heater
   */
  function buildSoxhletHeater(root, m) {
    buildKjeldahlUnit(root, m, false);
  }

  /**
   * Water Still (Manesty / Barnstead)
   */
  function buildWaterStill(root, m) {
    const R = 0.28, H = 0.95;

    // Stainless Steel Boiling Chamber
    const boilerGeo = new THREE.CylinderGeometry(R, R, H * 0.45, 32);
    const boiler = new THREE.Mesh(boilerGeo, m.ssBrushed);
    boiler.position.y = H * 0.45;
    root.add(boiler);

    // Condenser Column Dome Top
    const domeGeo = new THREE.SphereGeometry(R, 32, 16, 0, Math.PI * 2, 0, Math.PI / 2);
    const dome = new THREE.Mesh(domeGeo, m.ssMirror);
    dome.position.y = H * 0.68;
    root.add(dome);

    // Vertical Condenser Tube & Baffle
    const condGeo = new THREE.CylinderGeometry(0.08, 0.08, H * 0.5, 24);
    const cond = new THREE.Mesh(condGeo, m.ssMirror);
    cond.position.set(R + 0.12, H * 0.5, 0);
    root.add(cond);

    // Wall Mounting Bracket
    const brackGeo = new THREE.BoxGeometry(0.1, H * 0.6, 0.05);
    const brack = new THREE.Mesh(brackGeo, m.powderBlue);
    brack.position.set(-R - 0.05, H * 0.5, 0);
    root.add(brack);

    SSI_3D.attachSSIPlate(boiler, new THREE.Vector3(0, 0, R + 0.005), null, 0.7);
  }

  /**
   * Shaker: Orbital Shaking Incubator / Mini Rotary Flask Shaker
   */
  function buildShaker(root, m, isIncubator) {
    const W = 0.85, H = isIncubator ? 0.65 : 0.35, D = 0.75;

    const bodyGeo = new THREE.BoxGeometry(W, 0.28, D);
    const body = new THREE.Mesh(bodyGeo, m.powderBlue);
    body.position.y = 0.18;
    root.add(body);

    // 450x450 mm Shaking Platform with Lotus Spring Clamps
    const platGeo = new THREE.BoxGeometry(0.65, 0.03, 0.55);
    const plat = new THREE.Mesh(platGeo, m.ssBrushed);
    plat.position.set(0, 0.34, 0);
    root.add(plat);

    // 9 Flask Clamps and Flasks
    [-0.2, 0, 0.2].forEach(function (x) {
      [-0.15, 0, 0.15].forEach(function (z) {
        const clampGeo = new THREE.CylinderGeometry(0.05, 0.055, 0.03, 16, 1, true);
        const clamp = new THREE.Mesh(clampGeo, m.brassGold);
        clamp.position.set(x, 0.36, z);
        root.add(clamp);

        const flaskGeo = new THREE.ConeGeometry(0.045, 0.09, 16);
        const flask = new THREE.Mesh(flaskGeo, m.glassToughened);
        flask.position.set(x, 0.41, z);
        root.add(flask);
      });
    });

    if (isIncubator) {
      // Clear Acrylic Dome Lid
      const domeHinge = new THREE.Group();
      domeHinge.position.set(0, 0.34, -D / 2);
      root.add(domeHinge);
      root.userData.doorGroup = domeHinge;

      const domeGeo = new THREE.BoxGeometry(W - 0.04, 0.32, D - 0.04);
      const dome = new THREE.Mesh(domeGeo, m.glassToughened);
      dome.position.set(0, 0.16, D / 2);
      domeHinge.add(dome);
    }

    SSI_3D.attachSSIPlate(body, new THREE.Vector3(0, 0.05, D / 2 + 0.005), null, 0.85);
  }

  /**
   * COD Digestion Apparatus
   */
  function buildCODApparatus(root, m) {
    const W = 0.75, H = 0.35, D = 0.45;

    // Base with Digital Controller
    const baseGeo = new THREE.BoxGeometry(W, H, D);
    const base = new THREE.Mesh(baseGeo, m.powderBeige);
    base.position.y = H / 2 + 0.04;
    root.add(base);

    // Solid Aluminum Heating Block
    const blockGeo = new THREE.BoxGeometry(W - 0.12, 0.1, D - 0.1);
    const block = new THREE.Mesh(blockGeo, m.ssMirror);
    block.position.set(0, H + 0.08, 0);
    root.add(block);

    // 15 Tall Glass Air Condensers (60 cm)
    for (let row = 0; row < 3; row++) {
      for (let col = 0; col < 5; col++) {
        const x = -0.24 + col * 0.12;
        const z = -0.1 + row * 0.1;
        const tubeGeo = new THREE.CylinderGeometry(0.014, 0.014, 0.75, 16);
        const tube = new THREE.Mesh(tubeGeo, m.glassToughened);
        tube.position.set(x, H + 0.5, z);
        root.add(tube);
      }
    }

    SSI_3D.attachSSIPlate(base, new THREE.Vector3(0, 0, D / 2 + 0.005), null, 0.75);
  }

  /**
   * Rota Dyer Machine
   */
  function buildRotaDyer(root, m) {
    const W = 0.95, H = 0.65, D = 0.65;
    const bodyGeo = new THREE.BoxGeometry(W, H, D);
    const body = new THREE.Mesh(bodyGeo, m.ssBrushed);
    body.position.y = H / 2 + 0.05;
    root.add(body);

    // Rotating Beaker Carousel Carriage
    const carGeo = new THREE.CylinderGeometry(0.25, 0.25, 0.35, 16);
    carGeo.rotateZ(Math.PI / 2);
    const car = new THREE.Mesh(carGeo, m.ssMirror);
    car.position.set(-0.1, H * 0.65, 0);
    root.add(car);

    // Side Drive Motor Box
    const motorGeo = new THREE.BoxGeometry(0.2, 0.35, 0.35);
    const motor = new THREE.Mesh(motorGeo, m.powderBlue);
    motor.position.set(W / 2 - 0.12, H * 0.65, 0);
    root.add(motor);

    SSI_3D.attachSSIPlate(body, new THREE.Vector3(0, -0.15, D / 2 + 0.005), null, 0.8);
  }

  /**
   * Seed Germinator (Single Chamber)
   */
  function buildSeedGerminator(root, m) {
    buildBODIncubator(root, m);
  }

  /**
   * Industrial Tray Dryer
   */
  function buildTrayDryer(root, m) {
    const W = 1.4, H = 1.6, D = 0.95;
    const bodyGeo = new THREE.BoxGeometry(W, H, D);
    const body = new THREE.Mesh(bodyGeo, m.powderBlue);
    body.position.y = H / 2 + 0.1;
    root.add(body);

    // Double Doors
    [-W / 4, W / 4].forEach(function (x) {
      const doorGeo = new THREE.BoxGeometry(W / 2 - 0.04, H - 0.15, 0.06);
      const door = new THREE.Mesh(doorGeo, m.ssBrushed);
      door.position.set(x, H / 2 + 0.1, D / 2 + 0.03);
      root.add(door);
    });

    SSI_3D.attachSSIPlate(body, new THREE.Vector3(0, H - 0.15, D / 2 + 0.005), null, 1.1);
  }

  /**
   * Ultra Violet Inspection Cabinet (SSI 072)
   */
  function buildUVCabinet(root, m) {
    const W = 0.6, H = 0.4, D = 0.45;
    const bodyGeo = new THREE.BoxGeometry(W, H, D);
    const body = new THREE.Mesh(bodyGeo, m.darkChamber);
    body.position.y = H / 2 + 0.04;
    root.add(body);

    // Top Viewing Visor / Eyepiece
    const visorGeo = new THREE.BoxGeometry(0.18, 0.1, 0.12);
    const visor = new THREE.Mesh(visorGeo, m.rubberBlack);
    visor.position.set(0, H + 0.08, 0.06);
    root.add(visor);

    SSI_3D.attachSSIPlate(body, new THREE.Vector3(0, 0, D / 2 + 0.005), null, 0.7);
  }

  /**
   * Vacuum Oven (SSI 075)
   */
  function buildVacuumOven(root, m) {
    const W = 0.85, H = 0.85, D = 0.75;
    const bodyGeo = new THREE.BoxGeometry(W, H, D);
    const body = new THREE.Mesh(bodyGeo, m.powderBeige);
    body.position.y = H / 2 + 0.08;
    root.add(body);

    // Heavy Cast Aluminum Circular Door
    const doorHinge = new THREE.Group();
    doorHinge.position.set(-W / 2 + 0.05, H / 2 + 0.08, D / 2);
    root.add(doorHinge);
    root.userData.doorGroup = doorHinge;

    const doorGeo = new THREE.CylinderGeometry(0.32, 0.32, 0.08, 32);
    doorGeo.rotateX(Math.PI / 2);
    const door = new THREE.Mesh(doorGeo, m.ssMirror);
    door.position.set(W * 0.42, 0, 0.04);
    doorHinge.add(door);

    // Round Glass Viewport
    const glassGeo = new THREE.CylinderGeometry(0.14, 0.14, 0.09, 24);
    glassGeo.rotateX(Math.PI / 2);
    const glass = new THREE.Mesh(glassGeo, m.glassToughened);
    glass.position.set(W * 0.42, 0, 0.04);
    doorHinge.add(glass);

    // Dial Vacuum Gauge on Top Corner
    const gaugeGeo = new THREE.CylinderGeometry(0.06, 0.06, 0.03, 24);
    gaugeGeo.rotateX(Math.PI / 2);
    const gauge = new THREE.Mesh(gaugeGeo, m.ssMirror);
    gauge.position.set(-W * 0.3, H + 0.14, 0.1);
    root.add(gauge);

    SSI_3D.attachSSIPlate(body, new THREE.Vector3(0, H - 0.12, D / 2 + 0.005), null, 0.75);
  }

  /**
   * Lyophiliser (Freeze Drier SSI 045)
   */
  function buildFreezeDrier(root, m) {
    const W = 0.85, H = 0.9, D = 0.75;
    const bodyGeo = new THREE.BoxGeometry(W, H * 0.6, D);
    const body = new THREE.Mesh(bodyGeo, m.powderBlue);
    body.position.y = H * 0.3;
    root.add(body);

    // Top Clear Acrylic Vacuum Drum
    const drumGeo = new THREE.CylinderGeometry(0.28, 0.28, 0.45, 32);
    const drum = new THREE.Mesh(drumGeo, m.glassToughened);
    drum.position.set(0, H * 0.6 + 0.22, 0);
    root.add(drum);

    SSI_3D.attachSSIPlate(body, new THREE.Vector3(0, 0, D / 2 + 0.005), null, 0.8);
  }

  /**
   * Magnetic Stirrer (SSI 046)
   */
  function buildMagneticStirrer(root, m) {
    const W = 0.38, H = 0.15, D = 0.38;
    const bodyGeo = new THREE.BoxGeometry(W, H, D);
    const body = new THREE.Mesh(bodyGeo, m.powderBlue);
    body.position.y = H / 2 + 0.02;
    root.add(body);

    // White Ceramic Top Heating Plate
    const plateGeo = new THREE.BoxGeometry(W - 0.04, 0.025, D - 0.04);
    const plate = new THREE.Mesh(plateGeo, m.ssMirror);
    plate.position.set(0, H + 0.03, 0);
    root.add(plate);

    // Dials
    [-0.08, 0.08].forEach(function (x) {
      const knobGeo = new THREE.CylinderGeometry(0.025, 0.025, 0.02, 16);
      knobGeo.rotateX(Math.PI / 2);
      const knob = new THREE.Mesh(knobGeo, m.rubberBlack);
      knob.position.set(x, H * 0.45, D / 2 + 0.015);
      root.add(knob);
    });

    SSI_3D.attachSSIPlate(body, new THREE.Vector3(0, H * 0.75, D / 2 + 0.005), null, 0.45);
  }

  /**
   * Melting Point Apparatus (SSI 047)
   */
  function buildMeltingPointApparatus(root, m) {
    const W = 0.35, H = 0.4, D = 0.35;
    const bodyGeo = new THREE.BoxGeometry(W, H, D);
    const body = new THREE.Mesh(bodyGeo, m.powderBlue);
    body.position.y = H / 2 + 0.02;
    root.add(body);

    // Tall Thermometer Arm
    const stemGeo = new THREE.CylinderGeometry(0.008, 0.008, 0.55, 16);
    const stem = new THREE.Mesh(stemGeo, m.glassToughened);
    stem.position.set(0, H + 0.28, 0);
    root.add(stem);

    SSI_3D.attachSSIPlate(body, new THREE.Vector3(0, H * 0.6, D / 2 + 0.005), null, 0.5);
  }

  /**
   * Mortuary Chamber (SSI 048)
   */
  function buildMortuaryChamber(root, m) {
    const W = 1.2, H = 1.3, D = 2.2;
    const bodyGeo = new THREE.BoxGeometry(W, H, D);
    const body = new THREE.Mesh(bodyGeo, m.ssBrushed);
    body.position.y = H / 2 + 0.12;
    root.add(body);

    // Sliding Stainless Body Tray on Telescopic Track
    const trayGeo = new THREE.BoxGeometry(W - 0.25, 0.05, D - 0.2);
    const tray = new THREE.Mesh(trayGeo, m.ssMirror);
    tray.position.set(0, H * 0.45, 0);
    root.add(tray);

    root.userData.explodedParts.push({
      mesh: tray,
      origin: tray.position.clone(),
      target: tray.position.clone().add(new THREE.Vector3(0, 0, 1.2))
    });

    SSI_3D.attachSSIPlate(body, new THREE.Vector3(0, H - 0.15, D / 2 + 0.005), null, 1.1);
  }

  /**
   * Combo Oven & Incubator
   */
  function buildComboOvenIncubator(root, m) {
    const W = 1.0, H = 1.85, D = 0.9;
    const bodyGeo = new THREE.BoxGeometry(W, H, D);
    const body = new THREE.Mesh(bodyGeo, m.powderBlue);
    body.position.y = H / 2 + 0.08;
    root.add(body);

    // Two stacked doors: upper oven door, lower incubator door
    [H * 0.28, H * 0.72].forEach(function (y) {
      const doorGeo = new THREE.BoxGeometry(W - 0.1, H * 0.4, 0.06);
      const door = new THREE.Mesh(doorGeo, m.ssBrushed);
      door.position.set(0, y + 0.08, D / 2 + 0.03);
      root.add(door);
    });

    SSI_3D.attachSSIPlate(body, new THREE.Vector3(0, H - 0.1, D / 2 + 0.005), null, 0.95);
  }

  /**
   * Egg / Poultry Incubator (SSI 018)
   */
  function buildEggIncubator(root, m) {
    buildBODIncubator(root, m);
  }

  /**
   * Serum Inspissator (SSI 51)
   */
  function buildSerumInspissator(root, m) {
    const W = 0.9, H = 0.35, D = 0.55;
    const bodyGeo = new THREE.BoxGeometry(W, H, D);
    const body = new THREE.Mesh(bodyGeo, m.powderBlue);
    body.position.y = H / 2 + 0.04;
    root.add(body);

    // Slanted Test Tube Sloping Rack
    const rackGeo = new THREE.BoxGeometry(W - 0.15, 0.08, D - 0.15);
    rackGeo.rotateX(0.25); // Slanted test tube angle
    const rack = new THREE.Mesh(rackGeo, m.ssMirror);
    rack.position.set(0, H + 0.02, 0);
    root.add(rack);

    // Full View Clear Perspex Cover
    const perspexGeo = new THREE.BoxGeometry(W - 0.08, 0.1, D - 0.08);
    const perspex = new THREE.Mesh(perspexGeo, m.glassToughened);
    perspex.position.set(0, H + 0.12, 0);
    root.add(perspex);

    SSI_3D.attachSSIPlate(body, new THREE.Vector3(0, 0, D / 2 + 0.005), null, 0.75);
  }

  /**
   * Electric Bunsen Burner
   */
  function buildElectricBunsenBurner(root, m) {
    const R = 0.14, H = 0.42;
    // Base
    const baseGeo = new THREE.CylinderGeometry(R, R, 0.1, 24);
    const base = new THREE.Mesh(baseGeo, m.darkChamber);
    base.position.y = 0.05;
    root.add(base);

    // Ceramic Heating Chimney
    const chimGeo = new THREE.CylinderGeometry(R * 0.65, R * 0.85, H - 0.1, 24);
    const chim = new THREE.Mesh(chimGeo, m.refractoryCeramic);
    chim.position.y = 0.05 + (H - 0.1) / 2;
    root.add(chim);

    // Top Glowing Grid
    const glowGeo = new THREE.CylinderGeometry(R * 0.6, R * 0.6, 0.02, 24);
    const glow = new THREE.Mesh(glowGeo, m.heatingGlow);
    glow.position.y = H + 0.01;
    root.add(glow);

    SSI_3D.attachSSIPlate(base, new THREE.Vector3(0, 0.05, R + 0.005), null, 0.45);
  }

  /**
   * Slide Warming Table
   */
  function buildSlideWarmingTable(root, m) {
    const W = 0.8, H = 0.14, D = 0.45;
    const bodyGeo = new THREE.BoxGeometry(W, H, D);
    const body = new THREE.Mesh(bodyGeo, m.powderBeige);
    body.position.y = H / 2 + 0.02;
    root.add(body);

    // Anodized Black Heating Surface
    const topGeo = new THREE.BoxGeometry(W - 0.04, 0.02, D - 0.04);
    const topMesh = new THREE.Mesh(topGeo, m.darkChamber);
    topMesh.position.set(0, H + 0.02, 0);
    root.add(topMesh);

    SSI_3D.attachSSIPlate(body, new THREE.Vector3(0, 0, D / 2 + 0.005), null, 0.65);
  }

  /**
   * Bacteriological Incubator (SSI 04 (A))
   */
  function buildBacteriologicalIncubator(root, m) {
    buildHotAirOven(root, m);
  }

})();
