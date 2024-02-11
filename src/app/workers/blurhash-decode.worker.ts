import { decode } from 'blurhash';
/// <reference lib="webworker" />

declare const self: Worker;

addEventListener('message', ({ data }) => {
  const response = decodeBlurhash(data.blurhash, data.width, data.height);
  // if (data.canvas instanceof OffscreenCanvas) {
  //   var start = Date.now();
    // const bitmap = data.canvas.transferToImageBitmap();
    // console.log('Transfering canvas to bitmap took: ', Date.now() - start, 'ms');
    self.postMessage({pixels: response, width: data.width, height: data.height, uuid: data.uuid});
  }
);

function decodeBlurhash(blurhash: string, width: number, height: number): Uint8ClampedArray {
  // width = Math.floor(width/10);
  // height = Math.floor(height/10);
  var start = Date.now();
  const pixels = decode(blurhash, width, height);
  console.log('Decoding blurhash took: ', Date.now() - start, 'ms');
  return pixels;
  // start = Date.now();
  // const canvas = new OffscreenCanvas(width, height);
  // const canvas = document.createElement('canvas');
  // const ctx = canvas.getContext('2d')!;
  // canvas.width = width;
  // canvas.height = height;
  // console.log('Creating canvas took: ', Date.now() - start, 'ms');
  // start = Date.now();
  // const imageData = ctx.createImageData(width, height);
  // imageData.data.set(pixels);
  // ctx.putImageData(imageData, 0, 0);
  // console.log('Putting image data took: ', Date.now() - start, 'ms');
  // await createImageBitmap(imageData).then(imgBitmap => {
  //   ctx.clearRect(0, 0, canvas.width, canvas.height);
  //   ctx.drawImage(imgBitmap, 0, 0);
  // });
  // return canvas.transferToImageBitmap();
  // this.canvases.push(canvas);
  // return this.sanitizer.bypassSecurityTrustUrl(url);
}