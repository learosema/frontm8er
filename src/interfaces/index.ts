export { processFrontmatterFiles } from './cli.ts';
export { NodeParserAdapter } from '../infrastructure/parsers/NodeParserAdapter.ts';
import { makeWatchFrontmatterFiles } from '../utils/file-watcher.ts';
import { NodeParserAdapter as _NodeParserAdapter } from '../infrastructure/parsers/NodeParserAdapter.ts';
import { ConsoleLogger as _ConsoleLogger } from '../infrastructure/logger/ConsoleLogger.ts';
export const watchFrontmatterFiles = makeWatchFrontmatterFiles(_NodeParserAdapter, _ConsoleLogger);
export { ConsoleLogger } from '../infrastructure/logger/ConsoleLogger.ts';
export { config } from './config.ts';
