export function prelogger(content?: string): string {
  return `[ ng plugin manager ] ${content || '~'}`;
}
