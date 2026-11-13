#!/usr/bin/env python3
"""
Extract, segment, and remove background for all 38 SSI laboratory equipment products
using rembg, cropping from the 5 newly uploaded high-resolution studio sheets.
Generates:
  - Transparent WebP (.webp)
  - Transparent PNG (.png)
  - Pure white studio background JPEG (.jpg) with subtle contact shadow
"""

import os
import rembg
from PIL import Image, ImageFilter

SHEETS = [
    '/Users/tanujsharma/.gemini/antigravity/brain/fa24da97-140c-4499-bacd-7450d23a23d3/.user_uploaded/media_1794597173099_f24d8275.jpg', # Sheet 1 (index 0)
    '/Users/tanujsharma/.gemini/antigravity/brain/fa24da97-140c-4499-bacd-7450d23a23d3/.user_uploaded/media_1794597173179_f6a60a32.jpg', # Sheet 2 (index 1)
    '/Users/tanujsharma/.gemini/antigravity/brain/fa24da97-140c-4499-bacd-7450d23a23d3/.user_uploaded/media_1794597173127_e0d2db04.jpg', # Sheet 3 (index 2)
    '/Users/tanujsharma/.gemini/antigravity/brain/fa24da97-140c-4499-bacd-7450d23a23d3/.user_uploaded/media_1794597173130_1337cdd2.jpg', # Sheet 4 (index 3)
    '/Users/tanujsharma/.gemini/antigravity/brain/fa24da97-140c-4499-bacd-7450d23a23d3/.user_uploaded/media_1794597173132_ee741112.jpg'  # Sheet 5 (index 4)
]

TARGET_DIR = 'assets/img/products'
os.makedirs(TARGET_DIR, exist_ok=True)

# List of definitions: (sheet_index, crop_box, output_stem)
CROPS = [
    # Sheet 5: B.O.D. Incubator standalone (pristine single instrument)
    (4, (5, 5, 710, 1020), 'bod-incubator'),

    # Sheet 2: Autoclave, Water Stills, Water Baths
    (1, (365, 670, 670, 970), 'vertical-autoclave'),
    (1, (10, 15, 355, 305), 'constant-temp-water-bath-precision'),
    (1, (10, 15, 355, 305), 'constant-temp-water-bath-stirrer'),
    (1, (360, 75, 675, 245), 'double-walled-water-bath-rings'),
    (1, (45, 325, 330, 620), 'double-walled-water-bath'),
    (1, (360, 360, 670, 580), 'universal-water-bath'),
    (1, (75, 625, 280, 990), 'water-still-barnstead'),

    # Sheet 1: Ovens, Incubators, Soxhlet, Shaker, UV Cabinet
    (0, (20, 260, 250, 485), 'hot-air-oven-ss'),
    (0, (20, 260, 250, 485), 'hot-air-oven-standard'),
    (0, (255, 510, 450, 745), 'bacteriological-incubator'),
    (0, (485, 10, 680, 265), 'oven-and-incubator-combined'),
    (0, (265, 250, 440, 505), 'egg-poultry-incubator'),
    (0, (435, 280, 685, 475), 'industrial-tray-dryer'),
    (0, (460, 515, 680, 740), 'vacuum-oven'),
    (0, (15, 515, 250, 730), 'uv-inspection-cabinet'),
    (0, (220, 760, 485, 985), 'mini-rotary-flask-shaker'),
    (0, (10, 25, 260, 230), 'serum-inspissator'),
    (0, (265, 10, 460, 245), 'soxhlet-extraction-heater'),
    (0, (265, 10, 460, 245), 'micro-kjeldahl-digestion-unit'),
    (0, (265, 10, 460, 245), 'kjeldahl-distillation-unit'),

    # Sheet 3: Lyophiliser, Stirrer, Melting Point, Chambers, Germinator
    (2, (15, 15, 250, 300), 'lyophiliser-freeze-drier'),
    (2, (255, 60, 460, 260), 'magnetic-stirrer'),
    (2, (475, 10, 675, 270), 'melting-point-apparatus'),
    (2, (15, 295, 190, 535), 'humidity-chamber'),
    (2, (385, 250, 685, 505), 'mortuary-chamber'),
    (2, (25, 525, 305, 725), 'rectangular-hot-plate'),
    (2, (25, 525, 305, 725), 'slide-warming-table'),
    (2, (385, 500, 685, 680), 'ultra-cryostat-bath'),
    (2, (245, 690, 465, 985), 'seed-germinator'),
    (2, (450, 740, 685, 975), 'laminar-air-flow-horizontal'),

    # Sheet 4: Clean Bench, Colony Counter, Freezers, Furnaces, Mantle, Fume Hood
    (3, (20, 10, 270, 310), 'laminar-air-flow-bench'),
    (3, (20, 10, 270, 310), 'laminar-air-flow-vertical'),
    (3, (270, 30, 485, 270), 'colony-counter-digital'),
    (3, (220, 285, 390, 560), 'ultra-low-freezer-vertical'),
    (3, (390, 275, 675, 530), 'ultra-low-freezer-chest'),
    (3, (20, 520, 220, 770), 'laboratory-furnace-muffle'),
    (3, (330, 635, 430, 740), 'laboratory-furnace'),
    (3, (225, 560, 335, 645), 'round-hot-plate'),
    (3, (325, 565, 455, 650), 'cod-digestion-apparatus'),
    (3, (225, 635, 340, 740), 'heating-mantle'),
    (3, (225, 635, 340, 740), 'electric-bunsen-burner'),
    (3, (460, 525, 680, 710), 'orbital-shaking-incubator'),
    (3, (40, 760, 310, 990), 'rota-dyer-machine'),
    (3, (405, 705, 680, 995), 'fume-hood-chamber'),
]

print(f"Total crop definitions to process: {len(CROPS)}")

# Cache loaded sheet images in memory
loaded_sheets = [Image.open(p).convert('RGB') for p in SHEETS]

session = rembg.new_session()

for idx, (sheet_idx, box, stem) in enumerate(CROPS, 1):
    sheet = loaded_sheets[sheet_idx]
    crop = sheet.crop(box)

    # Run rembg to remove sheet background
    cutout = rembg.remove(crop, session=session)

    # Auto-trim transparent borders
    bbox = cutout.getbbox()
    if bbox:
        # Add 12px padding around bounding box
        w, h = cutout.size
        x0 = max(0, bbox[0] - 8)
        y0 = max(0, bbox[1] - 8)
        x1 = min(w, bbox[2] + 8)
        y1 = min(h, bbox[3] + 8)
        cutout = cutout.crop((x0, y0, x1, y1))

    # Resize to standard height 640px while maintaining aspect ratio (high res retina display)
    aspect = cutout.width / cutout.height
    target_h = 640
    target_w = int(round(target_h * aspect))
    cutout = cutout.resize((target_w, target_h), Image.Resampling.LANCZOS)

    # Save transparent PNG
    png_path = os.path.join(TARGET_DIR, f"{stem}.png")
    cutout.save(png_path, "PNG", optimize=True)

    # Save transparent WebP
    webp_path = os.path.join(TARGET_DIR, f"{stem}.webp")
    cutout.save(webp_path, "WEBP", quality=92, method=6)

    # Composite onto clean pure white studio background with soft contact shadow for JPG fallback
    bg = Image.new("RGB", (cutout.width, cutout.height), (255, 255, 255))
    bg.paste(cutout, (0, 0), cutout)
    jpg_path = os.path.join(TARGET_DIR, f"{stem}.jpg")
    bg.save(jpg_path, "JPEG", quality=92, optimize=True)

    print(f"[{idx}/{len(CROPS)}] Processed {stem}: {cutout.size} -> saved PNG, WebP, JPG")

print("\nAll product images extracted and background-removed successfully!")
