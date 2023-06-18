import { CreaUserController } from './CreateUserController';
import { CreateUserUseCase } from './CreateUserUseCase';
import { MemoryUsersRepository } from './../../repositories/implementations/MemoryUsersRepository';
import { MailtrapMailProvider } from "../../providers/implementations/MailtrapMailProvider";

const mailtrapMailProvider = new MailtrapMailProvider();
const memoryUsersRepository = new MemoryUsersRepository();
const createUserUseCase =  new CreateUserUseCase(memoryUsersRepository, mailtrapMailProvider);

const createUserController = new CreaUserController(createUserUseCase);

export { createUserUseCase, createUserController }