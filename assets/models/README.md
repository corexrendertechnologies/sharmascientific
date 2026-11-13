# Procedural 3D Models Architecture

All 3D models for Sharma Scientific Instruments (SSI) are generated procedurally in real-time in the browser via `assets/js/models3d.js` using Three.js (r128 UMD).

### Why Procedural Geometry?
1. **Instant Loading & Zero Latency**: No multi-megabyte binary GLTF/GLB files to download over mobile networks. The procedural geometry initializes in milliseconds.
2. **Dynamic PBR Materials**: Accurate physical materials including brushed stainless steel (SS-304), epoxy powder-coated blue/cream steel, tempered glass, glowing Kanthal heating coils, and chrome fittings.
3. **Interactive Control**: Dedicated pivot groups for realistic door/lid opening animations and exploded-view vector displacement of internal shelves, heating coils, and gaskets.
4. **Procedural Canvas Textures**: Real-time canvas-generated digital PID temperature displays (dual PV/SV readouts), analog dial pressure gauges with PSI/kg/cm² markings, illuminated power switches, Wolffhuegel colony counter grids, and engraved SSI metallic badges.
5. **Universal Coverage**: Every single instrument in `products.json` (all 38 items across 9 categories) is mapped to an interactive 3D procedural model.
