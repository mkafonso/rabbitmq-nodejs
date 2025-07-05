import { UserEntity } from 'src/accounts/entities/user.entity';
import { IUserRepositoryInterface } from '../user.repository';

export class InMemoryUserRepository implements IUserRepositoryInterface {
  private users: UserEntity[] = [];

  async save(user: UserEntity): Promise<void> {
    this.users = this.users.filter((u) => u.getId() !== user.getId());
    this.users.unshift(user);
  }

  async findByUsername(username: string): Promise<UserEntity | null> {
    return this.users.find((u) => u.getUsername() === username) || null;
  }

  async findById(id: string): Promise<UserEntity | null> {
    return this.users.find((u) => u.getId() === id) || null;
  }

  reset(): void {
    this.users = [];
  }
}
