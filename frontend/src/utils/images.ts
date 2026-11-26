const COVER_WIDTH = 400;
const COVER_HEIGHT = 568;

function loadImage(file: Blob) {
  return new Promise<HTMLImageElement>((resolve, reject) => {
    const url = URL.createObjectURL(file);
    const image = new Image();
    image.onload = () => {
      URL.revokeObjectURL(url);
      resolve(image);
    };
    image.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error("Could not load image"));
    };
    image.src = url;
  });
}

function blobToBase64(blob: Blob) {
  return new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result;
      if (typeof result !== "string") {
        reject(new Error("Could not encode image"));
        return;
      }
      const comma = result.indexOf(",");
      resolve(comma >= 0 ? result.slice(comma + 1) : result);
    };
    reader.onerror = () => reject(new Error("Could not encode image"));
    reader.readAsDataURL(blob);
  });
}

async function resizeToWebpBlob(file: Blob, width: number, height: number) {
  if (!(file instanceof Blob)) {
    throw new Error("Expected an image file");
  }

  const image = await loadImage(file);
  const sourceRatio = image.width / image.height;
  const targetRatio = width / height;

  let sx = 0;
  let sy = 0;
  let sw = image.width;
  let sh = image.height;

  if (sourceRatio > targetRatio) {
    sw = image.height * targetRatio;
    sx = (image.width - sw) / 2;
  } else if (sourceRatio < targetRatio) {
    sh = image.width / targetRatio;
    sy = (image.height - sh) / 2;
  }

  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const context = canvas.getContext("2d");
  if (!context) {
    throw new Error("Could not process image");
  }

  context.drawImage(image, sx, sy, sw, sh, 0, 0, width, height);

  return new Promise<Blob>((resolve, reject) => {
    canvas.toBlob(
      (next) => {
        if (next?.type !== "image/webp") {
          reject(new Error("Could not encode WebP"));
          return;
        }
        resolve(next);
      },
      "image/webp",
      0.9,
    );
  });
}

export async function resizeImageToWebpBase64(file: Blob, width: number, height: number) {
  return blobToBase64(await resizeToWebpBlob(file, width, height));
}

export async function resizeImageToCoverWebp(file: Blob, width = COVER_WIDTH, height = COVER_HEIGHT) {
  const blob = await resizeToWebpBlob(file, width, height);
  const base64 = await blobToBase64(blob);
  const previewUrl = URL.createObjectURL(blob);

  return { base64, previewUrl };
}
