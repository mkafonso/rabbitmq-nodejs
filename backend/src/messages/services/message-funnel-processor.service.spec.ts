process.env.ENCRYPTION_KEY = '12345678123456781234567812345678';

import { MessageFunnelProcessorService } from './message-funnel-processor.service';

describe('[messages] MessageFunnelProcessorService', () => {
  let service: MessageFunnelProcessorService;
  let rabbitMQ: { consume: jest.Mock };

  beforeEach(() => {
    rabbitMQ = { consume: jest.fn() };

    service = new MessageFunnelProcessorService(rabbitMQ as any);
  });

  it('should analyze funnel status based on message content', async () => {
    const testCases = [
      { content: 'Tenho interesse no produto', expected: 'processing' },
      { content: 'Quero saber mais sobre o serviço', expected: 'processing' },
      { content: 'Gostaria de comprar agora', expected: 'completed' },
      { content: 'Vou adquirir o produto', expected: 'completed' },
      { content: 'Quero fechar o negócio', expected: 'completed' },
      { content: 'Não tenho interesse', expected: 'failed' },
      { content: 'Vou cancelar a compra', expected: 'failed' },
      { content: 'Desistir do produto', expected: 'failed' },
      { content: 'Olá, como vai?', expected: 'pending' },
    ];

    for (const testCase of testCases) {
      const result = await (service as any).analyzeFunnelStatus(
        testCase.content,
      );
      expect(result).toBe(testCase.expected);
    }
  });
});
