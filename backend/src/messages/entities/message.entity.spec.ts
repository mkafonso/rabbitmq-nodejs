import * as encryptModule from '../utils/encrypt';
import { MessageEntity } from './message.entity';

describe('[messages] MessageEntity', () => {
  beforeAll(() => {
    jest
      .spyOn(encryptModule, 'encrypt')
      .mockImplementation((text: string) => `encrypted(${text})`);
  });

  afterAll(() => {
    jest.restoreAllMocks();
  });

  it('should create a valid message with encrypted content', () => {
    const senderId = 'id-mkafonso-123';
    const content = 'Minha mensagem enviada em algum chat';

    const message = MessageEntity.createNew(senderId, content);

    expect(message.getSenderId()).toBe(senderId);
    expect(message.getEncryptedContent()).toBe(`encrypted(${content})`);
    expect(message.getId()).toBeDefined();
  });

  it('should throw error if message content is too short', () => {
    expect(() => {
      MessageEntity.createNew('id-mkafonso-123', '');
    }).toThrow('Message too short');
  });
});
