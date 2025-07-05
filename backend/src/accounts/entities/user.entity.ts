import { randomUUID } from 'crypto';

export class UserEntity {
  private readonly id: string;
  private readonly username: string;
  private readonly passwordHash: string;
  private readonly createdAt: Date;

  constructor(
    id: string,
    username: string,
    passwordHash: string,
    createdAt = new Date(),
  ) {
    if (username.length < 2) throw new Error('Username too short');
    if (passwordHash.length < 6) throw new Error('Password too short');

    this.id = id;
    this.username = username;
    this.passwordHash = passwordHash;
    this.createdAt = createdAt;
  }

  public static createNew(username: string, passwordHash: string): UserEntity {
    return new UserEntity(randomUUID(), username, passwordHash);
  }

  public getId(): string {
    return this.id;
  }

  public getUsername(): string {
    return this.username;
  }

  public getPasswordHash(): string {
    return this.passwordHash;
  }
}
