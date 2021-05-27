export const REGEXP_IMAGE = /image\//;
export const REGEXP_VIDEO = /(?:video|stream|m3u8)\//;
export const REGEXP_AUDIO = /audio\//;

export default function typeofType(fileOrType) {
  const type = fileOrType?.type || fileOrType || "";

  if (typeof type.match === "function") {
    if (type?.match(REGEXP_IMAGE)) {
      return "image";
    }

    if (type?.match(REGEXP_VIDEO)) {
      return "video";
    }

    if (type?.match(REGEXP_AUDIO)) {
      return "audio";
    }
  }

  return "other";
}

export function isFileOther(name) {
  return typeofType(name) === "other";
}
