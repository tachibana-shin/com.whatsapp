export function sizeofImage(src) {
  const img = new Image();
  const promise = new Promise((resolve, reject) => {
    img.addEventListener(
      "load",
      () => {
        resolve({ width: img.width, height: img.height });
      },
      { once: true }
    );
    img.addEventListener(
      "error",
      () => {
        reject("GET_SIZEOF_IMAGE_ERROR");
      },
      { once: true }
    );

    setTimeout(() => resolve({}), 60000);
  });
  img.src = src;

  return promise;
}
export function sizeofVideo(src) {
  const img = document.createElement("video");
  img.setAttribute("preload", "metadata");
  const promise = new Promise((resolve, reject) => {
    img.addEventListener(
      "loadedmetadata",
      () => {
        resolve({
          width: img.videoWidth,
          height: img.videoHeight,
          duration: img.duration
        });
      },
      { once: true }
    );
    img.addEventListener(
      "error",
      () => {
        reject("GET_SIZEOF_VIDEO_ERROR");
      },
      { once: true }
    );

    setTimeout(() => resolve({}), 60000);
  });
  img.src = src;

  return promise;
}
export function durationAudio(src) {
  const img = document.createElement("audio");
  img.setAttribute("preload", "metadata");
  const promise = new Promise((resolve, reject) => {
    img.addEventListener(
      "loadedmetadata",
      () => {
        resolve({
          duration: img.duration
        });
      },
      { once: true }
    );
    img.addEventListener(
      "error",
      () => {
        reject("GET_SIZEOF_VIDEO_ERROR");
      },
      { once: true }
    );

    setTimeout(() => resolve({}), 60000);
  });
  img.src = src;

  return promise;
}
