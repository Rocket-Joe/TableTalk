// [snowpack] add styles to the page (skip if no document exists)
if (typeof document !== 'undefined') {
  const code = ".title.svelte-yiky05{padding-top:10vh;padding-bottom:10vh}.playButton.svelte-yiky05{background-color:green;border:none;text-align:center;width:20vw;font-family:\"Roboto\", sans-serif;font-size:50px;color:black;border-radius:20px}";

  const styleEl = document.createElement("style");
  const codeEl = document.createTextNode(code);
  styleEl.type = 'text/css';
  styleEl.appendChild(codeEl);
  document.head.appendChild(styleEl);
}