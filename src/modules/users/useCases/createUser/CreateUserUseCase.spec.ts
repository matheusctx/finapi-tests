import { InMemoryUsersRepository } from '../../repositories/in-memory/InMemoryUsersRepository';
import { CreateUserError } from './CreateUserError';
import { CreateUserUseCase } from './CreateUserUseCase';

let createUserUseCase: CreateUserUseCase;
let inMemoryUsersRepository: InMemoryUsersRepository;

describe('Create User', () => {
  beforeEach(() => {
    inMemoryUsersRepository = new InMemoryUsersRepository();
    createUserUseCase = new CreateUserUseCase(inMemoryUsersRepository);
  });

  it('should be able to create a new user', async () => {
    const user = await createUserUseCase.execute({
      name: 'Name Test',
      email: 'Email Test',
      password: '123456',
    });

    expect(user).toHaveProperty('id');
  });

  it('should not be able to create a new user with a existent email', async () => {
    expect(async () => {
      await createUserUseCase.execute({
        name: 'Name Test 1',
        email: 'email@test.com',
        password: '1234',
      });

      await createUserUseCase.execute({
        name: 'Name Test 2',
        email: 'email@test.com',
        password: '123456',
      });
    }).rejects.toBeInstanceOf(CreateUserError);
  });
});
