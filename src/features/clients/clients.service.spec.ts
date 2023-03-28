import { Test, TestingModule } from '@nestjs/testing';
import { ClientsService } from './clients.service';

describe('dd', () => {
  it('ffff', () => {
    expect({ id: 'ddd', firstName: 'dimych', age: 18 }).toBe({
      id: expect.any(String),
      firstName: 'dimych',
      age: 18,
    });
  });
});
