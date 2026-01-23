import type { FileEntity } from '../../domain/entities/FileEntity';

/**
 * Port abstracting file persistence responsibilities.
 * Use-cases depend on this interface to save domain entities without knowing FS details.
 */
export interface IFileRepository {
  /** Persist the `FileEntity` to the filesystem or other storage at `targetPath`. */
  save(entity: FileEntity, targetPath: string): Promise<void>;
}
