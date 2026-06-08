# TODO - LLM-viz integration

- [ ] Verify how curriculum lessons mount `content/.../LLM.tsx` (loader exports, client/server boundaries).
- [ ] Add `llm-viz` as embedded client component inside `content/artificial-intelligence/natural-language-processing/LLM.tsx`.
- [ ] Import `LayerView` from `llm-viz/src/llm/LayerView` (or equivalent) and render it in a full-height container.
- [ ] Ensure required assets are available at `/native.wasm`, `/fonts/*`, `/gpt-nano-sort-*.json` by wiring/copying `llm-viz/public` into app `public`.
- [ ] If bundler pathing fails (scss/css/fonts/module resolution), adjust imports/aliases or copy minimal CSS.
- [ ] Run `npm run dev` (or existing dev server) and verify LLM visualization works on the lesson page.

