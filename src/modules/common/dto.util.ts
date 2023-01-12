import { ClassConstructor, plainToInstance } from 'class-transformer';

export function toDto<T, V>(cls: ClassConstructor<T>, instance: V): T {
  return plainToInstance(cls, instance, { excludeExtraneousValues: true });
}
