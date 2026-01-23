import type { FileEntity } from '../../domain/entities/FileEntity';

export interface IFileRepository {
  save(entity: FileEntity, targetPath: string): Promise<void>;
}
