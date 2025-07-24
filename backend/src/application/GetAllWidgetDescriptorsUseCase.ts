import { WidgetDescriptorRepository } from '../domain/repositories/WidgetDescriptorRepository';
import { WidgetDescriptor } from '../domain/entities/WidgetDescriptor';
import { Result } from './common/Result';

export class GetAllWidgetDescriptorsUseCase {
  constructor(private readonly repository: WidgetDescriptorRepository) {}

  public async execute(): Promise<Result<WidgetDescriptor[]>> {
    try {
      const descriptors = await this.repository.findAll();
      return Result.ok(descriptors);
    } catch (error) {
      return Result.fail('Failed to retrieve widget descriptors');
    }
  }
}
