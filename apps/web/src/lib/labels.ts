/**
 * A dimension's name in the viewer's sentence case. The registry is the ground
 * layer and keeps its own casing. This file imports nothing, so a client chart
 * can read it without pulling in the lexicons.
 */
export function sentenceLabel(name: string): string {
  return name === 'Shared Purpose' ? 'Shared purpose' : name
}
