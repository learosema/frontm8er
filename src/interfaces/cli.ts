import { NodeParserAdapter } from '../infrastructure/parsers/NodeParserAdapter.ts';
import { makeProcessFrontmatterFiles } from '../application/use-cases/processFrontmatterFiles.ts';
import { ConsoleLogger } from '../infrastructure/logger/ConsoleLogger.ts';
import { NodeFileTimesProvider } from '../infrastructure/file-times/NodeFileTimesProvider.ts';

export const processFrontmatterFiles = makeProcessFrontmatterFiles(
	NodeParserAdapter,
	ConsoleLogger,
	NodeFileTimesProvider
);
