# IGES test fixtures

| File | Source | Entities | Purpose |
|------|--------|----------|---------|
| `slot.iges` | [Wikipedia IGES slot](https://en.wikipedia.org/wiki/IGES) | 2×116, 2×100, 2×110 | Classic wireframe slot |
| `arc.iges` | Local minimal file | 1×100 | Unit-radius arc in XY |
| `../models/point.iges` | Open CASCADE export | 1×116 | Single point |
| `../models/line.iges` | Open CASCADE export | 1×110 | Single line |

All lines are **80 characters** with the section letter in **column 73** (index 72).

To add fixtures from the [IGES X-file library](https://web.archive.org/web/20100301144417/http://www.wiz-worx.com/iges5x/wysiwyg/f214x.shtml), download `.igs` files and verify line width before committing.
