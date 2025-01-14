export function flexibleSearch(query: string, name: string): boolean {
  const normalize = (text: string): string =>
    text
      .toLowerCase()
      .replace(/[^a-z0-9\s]/gi, "")
      .trim();

  const normalizedQuery = normalize(query);
  const normalizedName = normalize(name);

  const queryWords = normalizedQuery.split(/\s+/);
  const nameWords = normalizedName.split(/\s+/);

  let queryIndex = 0;

  for (const word of nameWords) {
    if (word.startsWith(queryWords[queryIndex])) {
      queryIndex++;
    }
    if (queryIndex === queryWords.length) {
      return true;
    }
  }

  return false;
}
