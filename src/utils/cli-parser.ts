export type CliOptions = {
  addCreated: boolean;
  addModified: boolean;
  data: Record<string, any>;
  dataFilePatterns: string[];
  inputFilePatterns: string[];
};

/**
 * Parse command line
 * @param args arguments
 * @returns {object|null} options object or null if the user needs help
 */
export function parseCLI(args: string[]): CliOptions | null {
  const dataFileExtensions = /\.(json|json5|yml|yaml)$/;
  const options: CliOptions = {
    addCreated: false,
    addModified: false,
    data: {},
    dataFilePatterns: [],
    inputFilePatterns: [],
  };
  options.dataFilePatterns = args.filter((item) =>
    dataFileExtensions.test(item)
  );
  options.inputFilePatterns = args.filter((item) => item.endsWith('.md'));
  const filteredArgs = args.filter((item) => item.startsWith('-'));
  for (const item of filteredArgs) {
    if (item === '--help' || item === '-h') {
      return null;
    }
    if (item === '--add-created' || item === '-c') {
      options.addCreated = true;
      continue;
    }
    if (item === '--add-modified' || item === '-m') {
      options.addModified = true;
      continue;
    }
    if (/^--.+=.*$/.test(item)) {
      const eqSign = item.indexOf('=');
      const key = item.slice(2, eqSign);
      const val = item.slice(eqSign + 1);
      options.data[key] = val;
      continue;
    }
    // unknown option:
    return null;
  }
  if (
    options.dataFilePatterns.length === 0 ||
    options.inputFilePatterns.length === 0
  ) {
    return null;
  }
  return options;
}
