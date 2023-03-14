import { Test, TestingModule } from '@nestjs/testing';
import { ClientsService } from './clients.service';

describe('dd', () => {
  it('ffff', () => {
    expect({ id: 'ddd', name: 'dimych', age: 18 }).toBe({
      id: expect.any(String),
      name: 'dimych',
      age: 18,
    });
  });
});
