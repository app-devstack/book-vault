export function extractByMultipleSpaces(title: string): string {
  const match = title.match(/^[^\s\u3000]+/);
  return match ? match[0] : title;
}
