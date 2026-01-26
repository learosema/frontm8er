# frontm8er — Architecture and DDD Migration Guide

This document captures a minimal Domain-Driven Design (DDD) alignment for the repository and a safe, incremental migration plan.

## Goals
- Separate pure domain rules from I/O and orchestration.
- Make boundaries explicit (Ports & Adapters / Hexagonal).
- Migrate incrementally with tests after each change.

## Bounded Contexts & Ubiquitous Language

- File Processing: domain rules for reading, parsing and composing file metadata and content.
  - Concepts: FileAggregate, FileMetadata, FileContent, Timestamp, Path
- Parsing: parsing of front-matter and content into domain DTOs.
  - Concepts: Parser, FrontMatter, DataNode
- I/O & Watching: filesystem interactions and file system events.
  - Concepts: FileWatcher, FileRepository, FileSystemAdapter
- CLI / Composition: wiring and composing use-cases for end users.

Use the above terms consistently across code, docs, and tests.

## Proposed Folder Layout

- `src/domain/` — Entities, Value Objects, Domain Services, domain-level errors
- `src/application/` — Use-cases (commands/queries), DTOs, input validation
- `src/infrastructure/` — Adapters for FS, watchers, format parsers, concrete implementations
- `src/interfaces/` — CLI, HTTP adapters, composition roots (minimal code)
- `src/shared/` — cross-cutting types, small helpers (logging, test utils)

Example: `ProcessFileUseCase` (application) depends on `IFileRepository` (port defined near application) and `IParser` (port). Concrete `FsFileRepository` and `YamlParser` live in `src/infrastructure/`.

## Mapping (current → suggested)

- [src/utils/file-times.ts](src/utils/file-times.ts) → `src/domain/file-times` (domain logic: timestamps, comparisons)
- [src/utils/path-unjoin.ts](src/utils/path-unjoin.ts) → `src/domain/value-objects` (path parsing VO)
- [src/utils/data-parser.ts](src/utils/data-parser.ts) → `src/infrastructure/parsers` (format-specific parsing)
- [src/utils/matter-parser.ts](src/utils/matter-parser.ts) → `src/infrastructure/parsers`
- [src/utils/file-processor.ts](src/utils/file-processor.ts) → `src/application/use-cases` (orchestrator)
- [src/utils/file-watcher.ts](src/utils/file-watcher.ts) → `src/infrastructure/watchers`
- `src/frontm8er.ts` & [src/cli.ts](src/cli.ts) → `src/interfaces/cli` (composition root)

If a file contains pure business rules with no I/O, prefer moving it to `domain`. If it performs parsing or FS access, move it to `infrastructure` or create a thin adapter that delegates to the old function.

## Ports & Adapters — Examples

- Ports (interfaces defined near application/domain):
  - `IFileRepository { read(path: Path): Promise<FileAggregate>; write(...): Promise<void> }`
  - `IParser { parse(content: string): DomainDocument }`
  - `IFileWatcher { on(event, cb): Disposable }`
- Adapters (implement in `src/infrastructure/`): `FsFileRepository`, `YamlParser`, `ChokidarFileWatcher`

Keep interface signatures small and focused; return domain DTOs rather than raw FS shapes.

## Testing Strategy

- `domain`: unit tests only, no I/O — very fast.
- `application`: unit tests with mocked ports.
- `infrastructure`: integration tests that use real FS in temp directories.
- Keep tests next to the code (same folder) and convert current tests gradually.

## Incremental Migration Plan (safe, reversible)

1. Document this file in the repo (done).
2. Create the new folder skeleton (`src/domain`, `src/application`, `src/infrastructure`, `src/interfaces`, `src/shared`).
3. Move one pure module first — recommended: [src/utils/file-times.ts](src/utils/file-times.ts) → `src/domain/file-times`.
   - Update imports; run tests.
4. Introduce a single port (e.g., `IParser`) and adapt one consumer to use the interface.
5. Move `file-processor.ts` into `application` and make it depend on ports.
6. Replace call sites by wiring concrete adapters in `src/interfaces/cli` or `src/frontm8er.ts`.
7. Repeat for parsing and watching adapters; after each move run tests and adjust imports.
8. Remove `src/utils` after everything is migrated.

## Quick Migration Checklist for a single file

1. Create target file under the new folder and copy code.
2. Run tests; fix TypeScript import paths.
3. If code touches FS, introduce a port and a tiny adapter that calls original code.
4. Update consuming modules to import the port or new location.
5. Delete the old file and commit each step separately.

## Operational Notes

- Keep `src/frontm8er.ts` and `src/cli.ts` minimal — only DI and wiring.
- Prefer constructor injection for dependencies; avoid global singletons.
- Turn on `strict` TypeScript rules gradually and fix types during migration.

## Next Steps (pick one)

- Scaffold the proposed folder structure and move `file-times.ts` (safe first step).
- Create a `IParser` port and an adapter wrapper for `data-parser` and `matter-parser`.

---
Generated on 2026-01-22
