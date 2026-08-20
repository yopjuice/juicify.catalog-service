
export const caseTransformer = {
  snaketoCamel(str: string): string {
    return str.replace(/([_][a-z])/gi, 
      ($1) => $1.toUpperCase().replace('_', ''));
  },
  camelToSnake(str: string): string {
    return str.replace(/([A-Z])/g,
    ($1) => `_${$1.toLowerCase()}`);
  },
}
