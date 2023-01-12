export function getDomain(input: string): string {
  try {
    const urlObj = new URL(input);

    return urlObj.hostname;
  } catch (e) {
    return input;
  }
}
