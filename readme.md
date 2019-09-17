# image-to-pieces
This package takes an images and will cut it into multiple images.

## Install
```sh
$ npm install image-to-pieces
```

## Usage
### With image
```js
import ImageToPieces from 'image-to-pieces';
const img = new Image();

const rows = 5;
const columns = 5;

const Image = new ImageToPieces(img, columns, rows);

const tiles = Image.getTiles();

console.log(titles)
-> [{data: "data:image/png;base64,..", index: 2,x: 120,y: 0}, {...}]
```

### With image url
```js
import ImageToPieces from 'image-to-pieces';

const rows = 5;
const columns = 5;

const Image = new ImageToPieces(null, columns, rows);
Image.loadImageByUrl('https://picsum.photos/200');
const tiles = Image.getTiles();


console.log(titles)
-> [{data: "data:image/png;base64,..", index: 2,x: 120,y: 0}, {...}]
```


## Todo's
- Improve performance
- Create option to return the tiles in arrays by row