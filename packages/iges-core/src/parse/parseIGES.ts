import { parseDirectorySection, validateDirectoryCounts } from "./parseDirectory.js";
import { parseGlobalSection } from "./parseGlobal.js";
import { parseParameterSection } from "./parseParameters.js";
import { parseTerminateSection, splitSections } from "./sections.js";
import { resolveReferences } from "../resolve/resolveReferences.js";
import type { IGESModel, ResolvedIGESModel } from "../types.js";

export interface ParseIGESOptions {
  /** Validate T-section line counts against parsed sections. */
  validateLineCounts?: boolean;
}

/**
 * Parse IGES file text into a structured model (no geometry decoding).
 */
export function parseIGES(fileText: string, options: ParseIGESOptions = {}): IGESModel {
  const validateLineCounts = options.validateLineCounts ?? true;
  const warnings: string[] = [];

  const sections = splitSections(fileText);
  const global = parseGlobalSection(sections.global);
  const directory = parseDirectorySection(sections.directory);
  const terminate = parseTerminateSection(sections.terminate);

  if (validateLineCounts) {
    try {
      validateDirectoryCounts(directory, terminate.directoryLineCount);
    } catch (e) {
      warnings.push(e instanceof Error ? e.message : String(e));
    }
  }

  const entities = parseParameterSection(sections.parameter, global, directory);

  return {
    start: sections.start,
    global,
    entities,
    terminate,
    warnings,
  };
}

/**
 * Parse and resolve references — primary entry point for consumers.
 */
export function parseAndResolveIGES(
  fileText: string,
  options?: ParseIGESOptions
): ResolvedIGESModel {
  const model = parseIGES(fileText, options);
  const resolved = resolveReferences(model);
  return {
    ...resolved,
    warnings: [...model.warnings, ...resolved.warnings],
  };
}
