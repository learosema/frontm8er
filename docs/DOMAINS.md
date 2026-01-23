# Domains and Bounded Contexts — frontm8er

This document captures the primary domains, bounded contexts, and ubiquitous language for the repo. Use it to guide future refactors and PR descriptions.

## Overview
The application performs two core responsibilities:
- Process content files with front-matter (the "processor" use-case).
- Watch a folder and run the processor on file changes (the "watcher" use-case).

Both are application-layer use-cases that orchestrate parsing, metadata enrichment, and filesystem writes.

## Bounded Contexts

- Content Processing (Application)
  - Responsibility: orchestrate reading data files, parse input files, enrich with metadata, and write output files.
  - Key modules: `src/application/use-cases/*` (e.g. `processFrontmatterFiles`), `src/interfaces/cli.ts` (composition).
  - Ports used: `IParser`, `IFileTimesProvider` (recommended), `ILogger`.

- Watching / Automation (Infrastructure / Application boundary)
  - Responsibility: observe filesystem events and trigger application use-cases.
  - Key modules: `src/utils/file-watcher.ts` (factory `makeWatchFrontmatterFiles`), `chokidar` adapter usage.
  - Ports used: `IParser`, `ILogger`, `IFileTimesProvider`.

- Parsing / Data (Infrastructure)
  - Responsibility: parse front-matter and data files (yaml, json5), provide domain documents.
  - Key modules: `src/utils/data-parser.ts`, `src/utils/matter-parser.ts`, `src/infrastructure/parsers/NodeParserAdapter.ts`.
  - Port: `IParser` (adapter implements this port).

- Filesystem / IO (Infrastructure)
  - Responsibility: read/write files, report file metadata (timestamps).
  - Key modules: `src/infrastructure/*` (future `NodeFileTimesProvider`), current `stat` usage in `getFileTimes`.
  - Port: `IFileTimesProvider` (recommended) or `IFileSystem`.

- Composition / CLI (Interfaces)
  - Responsibility: wire ports to adapters and expose CLI functions.
  - Key modules: `src/interfaces/cli.ts`, `src/interfaces/index.ts`.

- Cross-cutting / Shared
  - Responsibility: small helpers, stable utilities, types.
  - Key modules: `src/shared/*` (e.g. `path-unjoin.ts`).

## Ubiquitous Language (short list)
- `InputFile`: source file with front-matter and content.
- `DataFile`: supplemental data files merged into processing inputs.
- `MatterDocument` / `IMatterDocument`: parsed document object with `withData()` and `save()`.
- `ProcessFrontmatterFiles`: main application use-case.
- `WatchFrontmatterFiles`: long-running watcher that triggers processing.
- `IParser`, `ILogger`, `IFileTimesProvider`: ports defining cross-layer contracts.

## Current mapping (where code lives → where it should be)
- `src/application/use-cases/processFrontmatterFiles.ts` — application use-case (OK)
- `src/utils/file-watcher.ts` — watcher factory; can live in `src/infrastructure/watchers` or remain in `src/utils` while migrating
- `src/utils/data-parser.ts`, `src/utils/matter-parser.ts` — infrastructure parsers; wrapped by `src/infrastructure/parsers/NodeParserAdapter.ts`
- `src/domain/file-times.ts` — currently present but performs `stat` (I/O). Recommended: introduce `IFileTimesProvider` port and move the `stat` implementation to `src/infrastructure`.
- `src/shared/path-unjoin.ts` — shared helper (moved here intentionally).

## Recommendations / Boundaries
- Keep I/O behind small ports (parsers, file times, file repository). Application and domain should not call `fs` or `chokidar` directly.
- Prefer returning domain DTOs from ports (e.g., `IMatterDocument`) rather than raw FS objects.
- Keep the `src/interfaces` folder as the single composition root used by CLI and any future HTTP adapters.

## Next actions (suggested immediate steps)
1. Define `IFileTimesProvider` in `src/application/ports` and implement `NodeFileTimesProvider` in `src/infrastructure`.
2. Replace direct `getFileTimes` calls in use-cases and watcher with the new port; wire via `src/interfaces/cli.ts`.
3. Optionally move `file-watcher` to `src/infrastructure/watchers` to clearly signal I/O.
4. Document the PR rationale and include the mapping table above in the PR description.

---
Generated on 2026-01-23
