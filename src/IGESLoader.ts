import { FileLoader, Group, Loader, LoadingManager } from "three";
import { parseAndResolveIGES } from "iges-core";
import { toThreeGroup, type ToThreeOptions } from "./three/toThree.js";

export interface IGESLoaderOptions extends ToThreeOptions {
  /** Pass through to iges-core parseIGES. */
  validateLineCounts?: boolean;
}

/**
 * Three.js loader for IGES files.
 *
 * Parsing is delegated to `iges-core`; tessellation to Three.js objects
 * happens in {@link toThreeGroup}.
 *
 * @see docs/ARCHITECTURE.md
 */
class IGESLoader extends Loader<Group> {
  options: IGESLoaderOptions;

  constructor(manager?: LoadingManager, options: IGESLoaderOptions = {}) {
    super(manager);
    this.options = options;
  }

  override load(
    url: string,
    onLoad: (group: Group) => void,
    onProgress?: (event: ProgressEvent) => void,
    onError?: (event: unknown) => void
  ): void {
    const loader = new FileLoader(this.manager);
    loader.setPath(this.path);
    loader.setResponseType("text");

    loader.load(
      url,
      (text: unknown) => {
        try {
          onLoad(this.parse(text as string));
        } catch (e) {
          if (onError) {
            onError(e instanceof Error ? e : new Error(String(e)));
          } else {
            console.error(e);
          }
          this.manager.itemError(url);
        }
      },
      onProgress,
      onError
    );
  }

  parse(data: string): Group {
    const model = parseAndResolveIGES(data, {
      validateLineCounts: this.options.validateLineCounts,
    });

    if (model.warnings.length > 0) {
      console.warn("[IGESLoader]", model.warnings.join("; "));
    }

    return toThreeGroup(model, this.options);
  }
}

export { IGESLoader };
export type { ToThreeOptions };
