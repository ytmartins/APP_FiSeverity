# Changelog

## v0.1.0 — 2026-11-22

- Migrated both Earth Engine scripts from `COPERNICUS/S2_SR` to `COPERNICUS/S2_SR_HARMONIZED`. Replaced the `QA60` mask with `SCL` classes `1`, `3`, `8`, `9`, and `10`, and now apply the pixel mask once after filtering the collection by date, area, and scene cloud cover.
- Fixed the legend's horizontal layout and the pre-fire RGB `gamma` option. The area calculation now prints the hectares-by-class dictionary directly. The dNBR workflow still uses Sentinel-2 `B8` and `B12` and scales the pre-minus-post difference by `1,000` for classification.
- Added the archived demo GIF, the Code Editor setup guide, and the July 2020 Proença-a-Nova walkthrough. Organized the two presentation PDFs under `presentations/`.
- Validation covered JavaScript syntax and local checks of the collection, masking, and dNBR logic in both scripts. The documented Sentinel-2 map is an independent comparison against the ICNF perimeter. A live Code Editor run remains to be verified.

The 2021 implementation remains available in the repository history at `e0cba0d`.
