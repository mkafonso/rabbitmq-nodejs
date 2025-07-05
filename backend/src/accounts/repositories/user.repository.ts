import { UserEntity } from '../entities/user.entity';

export abstract class IUserRepositoryInterface {
  abstract save(user: UserEntity): Promise<void>;

  abstract findByUsername(username: string): Promise<UserEntity | null>;

  abstract findById(id: string): Promise<UserEntity | null>;
}
