export { processFrontmatterFiles } from './cli.ts';
export { NodeParserAdapter } from '../infrastructure/parsers/NodeParserAdapter.ts';
import { makeWatchFrontmatterFiles } from '../utils/file-watcher.ts';
import { NodeParserAdapter as _NodeParserAdapter } from '../infrastructure/parsers/NodeParserAdapter.ts';
import { ConsoleLogger as _ConsoleLogger } from '../infrastructure/logger/ConsoleLogger.ts';
import { NodeFileTimesProvider as _NodeFileTimesProvider } from '../infrastructure/file-times/NodeFileTimesProvider.ts';
import { NodeFileRepository as _NodeFileRepository } from '../infrastructure/file-repository/NodeFileRepository.ts';
export const watchFrontmatterFiles = makeWatchFrontmatterFiles(
	_NodeParserAdapter,
	_ConsoleLogger,
	_NodeFileTimesProvider,
	_NodeFileRepository
);
export { ConsoleLogger } from '../infrastructure/logger/ConsoleLogger.ts';
export { config } from './config.ts';
