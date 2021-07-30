import { InMemoryUsersRepository } from '../../../users/repositories/in-memory/InMemoryUsersRepository';
import { CreateUserUseCase } from '../../../users/useCases/createUser/CreateUserUseCase';
import { InMemoryStatementsRepository } from '../../repositories/in-memory/InMemoryStatementsRepository';
import { GetBalanceError } from './GetBalanceError';
import { GetBalanceUseCase } from './GetBalanceUseCase';

let createUserUseCase: CreateUserUseCase;
let getBalanceUseCase: GetBalanceUseCase;
let inMemoryUsersRepository: InMemoryUsersRepository;
let inMemoryStatementsRepository: InMemoryStatementsRepository;

describe('Get Balance', () => {
  beforeEach(() => {
    inMemoryStatementsRepository = new InMemoryStatementsRepository();
    inMemoryUsersRepository = new InMemoryUsersRepository();
    getBalanceUseCase = new GetBalanceUseCase(
      inMemoryStatementsRepository,
      inMemoryUsersRepository,
    );
    createUserUseCase = new CreateUserUseCase(inMemoryUsersRepository);
  });

  it('should be able to get balance', async () => {
    const user = await createUserUseCase.execute({
      name: 'Name Test',
      email: 'email@test.com',
      password: '123456',
    });

    const statementBalance = await getBalanceUseCase.execute({
      user_id: user.id!,
    });

    expect(statementBalance.balance).toBe(0);
  });

  it('should not be able to get balance of a non-existent user', async () => {
    expect(async () => {
      await getBalanceUseCase.execute({
        user_id: 'non-existent-user-id',
      });
    }).rejects.toBeInstanceOf(GetBalanceError);
  });
});
