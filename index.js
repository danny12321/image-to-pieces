"use strict";

class ImageToPieces {
    constructor(image, columns = 5, rows = 5) {
        this.columns = columns;
        this.rows = rows;
        this.tiles = [];
        this.imgData;

        if (image) {
            this.image = image;

            this.tileDimX = parseInt(this.image.width / columns);
            this.tileDimY = parseInt(this.image.height / rows);

            this.setImgData();
            this.setTiles();
        }
    }

    loadImageByUrl(url) {
        return new Promise((resolve, reject) => {
            let img = new Image;
            img.crossOrigin = "Anonymous";
            img.addEventListener("load", () => {
                this.image = img;

                this.tileDimX = parseInt(this.image.width / this.columns);
                this.tileDimY = parseInt(this.image.height / this.rows);

                this.setImgData();
                this.setTiles();
                resolve();
            }, false);
            img.src = url;
        })
    }

    setImgData() {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        canvas.width = this.image.width;
        canvas.height = this.image.height;

        ctx.drawImage(this.image, 0, 0);
        this.imgData = ctx.getImageData(0, 0, this.image.width, this.image.height).data;

        canvas.remove();
    }

    setTiles() {
        //get imgdata index from img px positions
        const indexX = (x) => {
            var i = x * 4;
            if (i > this.imgData.length) console.warn("X out of bounds");
            return i;
        }
        const indexY = (y) => {
            var i = this.image.width * 4 * y;
            if (i > this.imgData.length) console.warn("Y out of bounds");
            return i;
        }
        const getIndex = (x, y) => {
            var i = indexX(x) + indexY(y);
            if (i > this.imgData.length) console.warn("XY out of bounds");
            return i;
        }

        //get a tile of size tileDim*tileDim from position xy
        const getTile = (x, y, index) => {
            let tile = [];

            //loop over rows
            for (let i = 0; i < this.tileDimY; i++) {
                //slice original image from x to x + tileDim, concat
                tile.push(...this.imgData.slice(getIndex(x, y + i), getIndex(x + this.tileDimX, y + i)));
            }

            //convert back to typed array and to imgdata object
            tile = new ImageData(new Uint8ClampedArray(tile), this.tileDimX, this.tileDimY);

            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');
            canvas.width = this.tileDimX;
            canvas.height = this.tileDimY;

            ctx.putImageData(tile, 0, 0);

            //save original position
            tile.index = index;
            tile.x = x;
            tile.y = y;

            return {
                data: canvas.toDataURL('image/png'),
                x,
                y,
                index
            };
        }


        for (let yi = 0; yi < this.rows; yi++) {
            for (let xi = 0; xi < this.columns; xi++) {
                this.tiles.push(getTile(xi * this.tileDimX, yi * this.tileDimY, yi * this.columns + xi));
            }
        }
    }

    getTiles() {
        return this.tiles;
    }
}

module.exports = ImageToPieces
