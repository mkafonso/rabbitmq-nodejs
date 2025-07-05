import { UserEntity } from './user.entity';

describe('[accounts] UserEntity', () => {
  it('should create a valid user', () => {
    const user = UserEntity.createNew('mkafonso', 'MinhaSenhaSuperSegura@123');

    expect(user.getUsername()).toBe('mkafonso');
    expect(user.getPasswordHash()).toBe('MinhaSenhaSuperSegura@123');
    expect(user.getId()).toBeDefined();
  });

  it('should throw error if username is too short', () => {
    expect(() => {
      UserEntity.createNew('a', 'MinhaSenhaSuperSegura@123');
    }).toThrow('Username too short');
  });

  it('should throw error if passwordHash is too short', () => {
    expect(() => {
      UserEntity.createNew('mkafonso', '123');
    }).toThrow('Password too short');
  });
});
