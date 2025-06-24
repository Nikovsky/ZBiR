import { LoginDto } from './auth.dto';

describe('LoginDto', () => {
  it('should be defined', () => {
    expect(new LoginDto()).toBeDefined();
  });
});
