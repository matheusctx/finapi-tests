import { InMemoryUsersRepository } from "../../../users/repositories/in-memory/InMemoryUsersRepository";
import { CreateUserUseCase } from "../../../users/useCases/createUser/CreateUserUseCase";
import { InMemoryStatementsRepository } from "../../repositories/in-memory/InMemoryStatementsRepository";
import { CreateStatementError } from "./CreateStatementError";
import { CreateStatementUseCase } from "./CreateStatementUseCase";

enum OperationType {
  DEPOSIT = "deposit",
  WITHDRAW = "withdraw",
}

let createStatementUseCase: CreateStatementUseCase;
let createUserUseCase: CreateUserUseCase;
let inMemoryUsersRepository: InMemoryUsersRepository;
let inMemoryStatementsRepository: InMemoryStatementsRepository;

describe('Create Statement', () => {
  beforeEach(() => {
    inMemoryStatementsRepository = new InMemoryStatementsRepository();
    inMemoryUsersRepository = new InMemoryUsersRepository();
    createUserUseCase = new CreateUserUseCase(inMemoryUsersRepository);
    createStatementUseCase = new CreateStatementUseCase(
      inMemoryUsersRepository,
      inMemoryStatementsRepository
    );
  });

  it('should be able to create a new statement', async () => {
    const user = await createUserUseCase.execute({
      name: 'Name Test',
      email: 'email@test.com',
      password: '123456'
    });

    const statement = await createStatementUseCase.execute({
      user_id: user.id!, 
      type: OperationType.DEPOSIT, 
      amount: 300, 
      description: 'Deposit description'
    });

    expect(statement).toHaveProperty('id');
  });

  it('should not be able to create a statement to a non-existent user', async () => {
    expect(async () => {
      await createStatementUseCase.execute({
        user_id: 'non-existent-id',
        type: OperationType.DEPOSIT,
        amount: 300,
        description: "Deposit description"
      });
    }).rejects.toBeInstanceOf(CreateStatementError.UserNotFound);
  });

  it('should not be able to create a statement if funds are insufficient', async () => {
    expect(async () => {
      const user = await createUserUseCase.execute({
        name: 'Name Test',
        email: 'email@test.com',
        password: '123456'
      });
  
      await createStatementUseCase.execute({
        user_id: user.id!, 
        type: OperationType.WITHDRAW, 
        amount: 300, 
        description: 'Withdraw description'
      });
    }).rejects.toBeInstanceOf(CreateStatementError.InsufficientFunds);
  });
});