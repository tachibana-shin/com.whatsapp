function deleteElementTmp() {
  document
    .querySelectorAll('input[type="file"][data-type="virual"]')
    .forEach(item => {
      item.remove();
    });
}

export default function selectFile(accept, multiple = false) {
  deleteElementTmp();
  const input = document.createElement("input");
  input.setAttribute("hidden", true);
  input.setAttribute("type", "file");
  input.setAttribute("data-type", "virual");

  if (accept) {
    input.setAttribute("accept", accept);
  }
  input.setAttribute("multiple", multiple);

  const promis = new Promise((resolve, reject) => {
    input.addEventListener(
      "change",
      () => {
        resolve(input.files);
        input.remove();
      },
      { once: true }
    );
    input.addEventListener(
      "blur",
      () => {
        if (input.files.length === 0) {
          resolve([]);
        }
        input.remove();
      },
      {
        once: true
      }
    );
  });

  document.body.appendChild(input);
  input.click();

  return promis;
}
