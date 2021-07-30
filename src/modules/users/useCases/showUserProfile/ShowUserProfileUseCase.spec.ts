import { InMemoryUsersRepository } from "../../repositories/in-memory/InMemoryUsersRepository";
import { CreateUserUseCase } from "../createUser/CreateUserUseCase";
import { ShowUserProfileError } from "./ShowUserProfileError";
import { ShowUserProfileUseCase } from "./ShowUserProfileUseCase";

let showUserProfileUseCase: ShowUserProfileUseCase;
let createUserUseCase: CreateUserUseCase;
let inMemoryUsersRepository: InMemoryUsersRepository;

describe('Show User Profile', () => {
  beforeEach(() => {
    inMemoryUsersRepository = new InMemoryUsersRepository();
    createUserUseCase = new CreateUserUseCase(inMemoryUsersRepository);
    showUserProfileUseCase = new ShowUserProfileUseCase(inMemoryUsersRepository);
  });

  it('should be able to show a user profile', async () => {    
    const userCreated = await createUserUseCase.execute({
      name: 'User Test',
      email: 'user@test.com',
      password: '1234'
    });
    
    const result = await showUserProfileUseCase.execute(userCreated.id!);

    expect(userCreated).toEqual(result);
  });

  it('should not be able to show a non-existent user', async () => {    
    expect(async () => {
      await showUserProfileUseCase.execute('non-existent-user');
    }).rejects.toBeInstanceOf(ShowUserProfileError);
  });
});