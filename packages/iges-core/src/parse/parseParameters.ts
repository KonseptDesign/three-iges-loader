import { parseIgesInt } from "./hollerith.js";
import { splitParameterRecords, tokenizeFields, tokensToParamValues } from "./paramTokenizer.js";
import type { GlobalSection, ParamValue, RawEntity } from "../types.js";
import type { DirectoryEntry } from "../types.js";
import { IGESParseError } from "../errors.js";

export interface ParameterRecord {
  /** DE pointer from P-record columns 65–72 when present in source lines. */
  dePointer: number | null;
  entityType: number;
  raw: string;
  params: ParamValue[];
}

/**
 * Parse P-section into parameter records and attach to directory entries.
 */
export function parseParameterSection(
  parameterText: string,
  global: GlobalSection,
  directory: DirectoryEntry[]
): Map<number, RawEntity> {
  const records = splitParameterRecords(parameterText, global.recordDelimiter);
  const parsedRecords: ParameterRecord[] = [];

  for (const record of records) {
    const fields = tokenizeFields(record, global.fieldDelimiter);
    if (fields.length === 0) continue;

    const typeToken = fields[0] ?? "0";
    const entityType = parseIgesInt(typeToken);
    const paramTokens = fields.slice(1);
    const params = tokensToParamValues(paramTokens);

    parsedRecords.push({
      dePointer: null,
      entityType,
      raw: record,
      params,
    });
  }

  const entities = new Map<number, RawEntity>();

  // Primary mapping: by DE parameter pointer order (standard files)
  const sortedDe = [...directory].sort((a, b) => a.sequence - b.sequence);

  for (let i = 0; i < sortedDe.length; i++) {
    const de = sortedDe[i];
    if (!de) continue;

    const pd =
      parsedRecords.find((r) => r.dePointer === de.parameterDataPointer) ?? parsedRecords[i];

    if (!pd) {
      throw new IGESParseError(`Missing parameter data for DE sequence ${de.sequence}`, {
        code: "MISSING_PD",
        context: `entity type ${de.entityType}`,
      });
    }

    entities.set(de.sequence, {
      de,
      type: pd.entityType,
      form: de.formNumber,
      params: pd.params,
      rawParameter: pd.raw,
    });
  }

  return entities;
}
