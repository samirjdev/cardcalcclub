# iOS Home Screen Icon

To add the iOS home screen icon:

1. Convert `app/apple-icon.svg` to PNG format
2. Save it as `apple-icon.png` at 180x180px (or 512x512px for retina)
3. Place it in this `public` folder
4. The icon will be automatically available at `/apple-icon.png`

You can use online tools like:
- https://cloudconvert.com/svg-to-png
- https://convertio.co/svg-png/
- Or use ImageMagick: `magick apple-icon.svg -resize 180x180 apple-icon.png`

The dark teal background color is: #1a3d47

