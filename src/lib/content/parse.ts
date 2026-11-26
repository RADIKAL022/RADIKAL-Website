import type { z } from 'zod';

/**
 * Validates `data` against `schema` and throws an error that names the file and the exact
 * field that is wrong, so a bad CMS edit fails the build with a message an editor can act on.
 */
export function parseContent<T extends z.ZodType>(
  schema: T,
  data: unknown,
  source: string,
): z.output<T> {
  const result = schema.safeParse(data);
  if (result.success) return result.data;
  const details = describeIssues(result.error.issues)
    .map((line) => `  - ${line}`)
    .join('\n');
  throw new Error(`Content error in ${source}:\n${details}`);
}

/** One readable line per validation issue, e.g. `sections[2].heading: must not be empty`. */
export function describeIssues(issues: readonly z.core.$ZodIssue[]): string[] {
  return issues.map((issue) => `${formatPath(issue.path)}: ${issue.message}`);
}

function formatPath(issuePath: readonly PropertyKey[]): string {
  if (issuePath.length === 0) return '(root)';
  return issuePath
    .map((part, index) => {
      if (typeof part === 'number') return `[${part}]`;
      const key = String(part);
      return index === 0 ? key : `.${key}`;
    })
    .join('');
}
