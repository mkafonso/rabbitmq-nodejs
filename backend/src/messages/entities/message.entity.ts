import { randomUUID } from 'crypto';
import { encrypt } from '../utils/encrypt';

export class MessageEntity {
  private readonly id: string;
  private readonly encryptedContent: string;
  private readonly senderId: string;
  private readonly createdAt: Date;

  constructor(
    id: string,
    senderId: string,
    content: string,
    createdAt = new Date(),
  ) {
    if (content.length < 1) throw new Error('Message too short');

    this.id = id;
    this.senderId = senderId;
    this.encryptedContent = encrypt(content);
    this.createdAt = createdAt;
  }

  public static createNew(senderId: string, content: string): MessageEntity {
    return new MessageEntity(randomUUID(), senderId, content);
  }

  public getId(): string {
    return this.id;
  }

  public getEncryptedContent() {
    return this.encryptedContent;
  }

  public getSenderId() {
    return this.senderId;
  }

  public getCreatedAt() {
    return this.createdAt;
  }
}
