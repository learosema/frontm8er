import type { IFileRepository } from '../../application/ports/IFileRepository';
import type { FileEntity } from '../../domain/entities/FileEntity';

export const NodeFileRepository: IFileRepository = {
  async save(entity: FileEntity, targetPath: string) {
    // Delegate to the entity's save implementation (thin adapter)
    await entity.save(targetPath);
  },
};
