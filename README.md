# Sharma Scientific Instruments website

Static catalogue website generated from `products.json` with Node.js. It includes a responsive light-only design, product search and category filters, product detail pages, model comparison, and direct quotation requests by WhatsApp or email.

## Run locally

```sh
node build.js
python3 -m http.server 8080
```

Open `http://localhost:8080`. `node build.js` regenerates the HTML pages, sitemap and robots file from the source catalogue.

## Update catalogue data

Edit `products.json`, run `python3 scripts/generate_datasheets.py` to refresh the product PDFs, then run `node build.js` to regenerate the pages. The PDF generator uses ReportLab and Pillow. Product specifications are based on the supplied scanned catalogue brochures; some are image-only and have been transcribed into structured catalogue data. The redesigned PDFs are searchable summaries of that data, not signed or configuration-specific manufacturer certificates. Confirm the current model, operating range, utilities, options and documentation with the supplier before ordering. The vertical autoclave listing intentionally asks buyers to request current model-specific details because no matching autoclave specification sheet was supplied. Original PDFs that were in the project are preserved in `assets/docs/originals/`.

The catalogue contains 38 listings. A listing does not imply that every configuration is currently available.

## Contact and source notes

The catalogue prints Ahmedabad, Gujarat contact details. Phone and WhatsApp links follow the primary number published on the official company contact page, with its alternate number shown on the contact page and footer. Website records contain two postal codes (380023 and 380026); the contact page discloses the mismatch and asks visitors to confirm the current address before travelling. Public company pages also disagree on the establishment year, so the site no longer displays a date claim. Contact channels used for quote forms are maintained in `assets/js/config.js`.

Product selection guidance for steam sterilization links to the [CDC steam sterilization guidance](https://www.cdc.gov/infection-control/hcp/disinfection-sterilization/steam-sterilization.html). It explains that cycle selection depends on the load and process parameters; the website does not claim a particular autoclave is validated for a specific use.
# sharmascientific
