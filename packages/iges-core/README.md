# iges-core

IGES 5.3 parser and display-neutral geometry model. **No Three.js dependency.**

## Usage

```ts
import { parseAndResolveIGES } from "iges-core";

const text = await fetch("/model.igs").then((r) => r.text());
const model = parseAndResolveIGES(text);

for (const g of model.geometry) {
  if (g.kind === "line") {
    console.log(g.start, g.end);
  }
}
```

## API

| Export | Description |
|--------|-------------|
| `parseIGES` | Parse file → `IGESModel` |
| `parseAndResolveIGES` | Parse + transforms + geometry |
| `resolveReferences` | Resolve transforms on existing model |
| `ENTITY_DECODERS` | Registry map for extension |

See [docs/ARCHITECTURE.md](../../docs/ARCHITECTURE.md) in the repo root.
