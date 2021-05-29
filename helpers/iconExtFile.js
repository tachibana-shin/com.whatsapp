import { extname } from "path";

export function exists(name) {
  try {
    require(`file-icon-vectors/dist/icons/vivid/${name}.svg`);

    return true;
  } catch {
    return false;
  }
}

export function _extname(path = "") {
  return extname(path).replace(/^\./, "");
}

export default function(fileName) {
  fileName = _extname(fileName);
  return exists(fileName) ? fileName : "blank";
}
