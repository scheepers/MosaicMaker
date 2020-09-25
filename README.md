# MosaicMaker

Composes images using a palette of tile images to create mosaics representing
given target images.


## Dependencies

* GD Graphics library.
* NodeJS v12.18.2


## Installation


### GD Graphics library

* To install GD on debian systems:
```bash
sudo apt-get install libgd3
```

### NodeJS

* NodeJS 12 linux binaries are available at https://nodejs.org/en/download.


### MosaicMaker

From within this root directory:
```bash
npm install
```

## Running

From within this directory run:
```bash
npm run-script mosaic -- ./source/image.jpg ./path/to/palette/directory|paletteName columns rows [linear|quadratic]
```
Eg.
```bash
npm run-script mosaic -- ./mona.jpg accordion 30 10
npm run-script mosaic -- ./starry.jpg accordion 80 40
npm run-script mosaic -- ./mona.jpg ./palettes/accordion 120 40

```

Where:
  * ./source/image.jpg: Relative or absolute path to source image.
  * PaletteName: be any of the directory names within the ./palette
    directory, or a path to  directory containg palette images.
    (Only the accordion directory from the original resource pack is included to
    conserve space, please feel free to add more)
  * Columns determine the number of tiles on the x-axis.
  * Rows determine the number of tiles on the y-axis.
  * Averaging strategy may be one of:
    * linear - uses linear difference between channels to calculate average
      colors. (default)
    * Calculates the average RGB using square differences to compensate for loss
      of bright- and sharpness due to camera compression.


## Testing

From within this directory run:
```bash
npm test
```
If you're having issues running the test suite, patch the node GD binding module:

Apply .__/node-gd.patch__ inside of the
__node_modules/node-gd__ directory.

```bash
cd node_modules/node-gd
patch -p0 << ../../node-gd.patch
```
