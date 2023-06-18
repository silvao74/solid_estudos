import { CreateUserUseCase } from "./CreateUserUseCase";
import { IUsersRepository } from "../../repositories/IUsersRepository";
import { IEmailProvider } from "../../providers/IEmailProvider";
import { ICreateUserRequestDTO } from "./CreateUserDTO";


describe("CreateUserUseCase", () => {
  let createUserUseCase: CreateUserUseCase;
  let usersRepository: IUsersRepository;
  let emailProvider: IEmailProvider;

  beforeEach(() => {
    usersRepository = {} as IUsersRepository;
    emailProvider = {} as IEmailProvider;
    createUserUseCase = new CreateUserUseCase(usersRepository, emailProvider);
  });

  it("should create a new user", async () => {
    const userDTO: ICreateUserRequestDTO = {
      name: "John Doe",
      email: "johndoe@example.com",
      password: "123456"
    };


    const sendMailData = {
        to: {
          name: userDTO.name,
          email: userDTO.email
        },
        from: {
          name: 'Equipe Assinatura',
          email: 'assinatura@rd.com.br'
        },
        subject: 'Email de teste para o cadastro',
        body: '<p>Cadastro efetuado com sucesso, na plataforma!</p>'
    }

    usersRepository.findByEmail = jest.fn().mockResolvedValueOnce(null);
    usersRepository.save = jest.fn().mockResolvedValueOnce(null);
    emailProvider.sendMail = jest.fn().mockResolvedValueOnce(null);

    await createUserUseCase.execute(userDTO);

    expect(usersRepository.findByEmail).toHaveBeenCalledWith(userDTO.email);
    expect(usersRepository.save).toHaveBeenCalled();
    expect(emailProvider.sendMail).toHaveBeenCalledWith(sendMailData);
  });

  it("should throw an error if user already exists", async () => {
    const userDTO: ICreateUserRequestDTO = {
      name: "John Doe",
      email: "johndoe@example.com",
      password: "teste123"
    };

    usersRepository.findByEmail = jest.fn().mockResolvedValueOnce(userDTO);
    usersRepository.save = jest.fn().mockResolvedValueOnce(null);
    emailProvider.sendMail = jest.fn().mockResolvedValueOnce(null);

    await expect(createUserUseCase.execute(userDTO)).rejects.toThrow(
      "User already exists!!"
    );

    expect(usersRepository.findByEmail).toHaveBeenCalledWith(userDTO.email);
    expect(usersRepository.save).not.toHaveBeenCalled();
    expect(emailProvider.sendMail).not.toHaveBeenCalled();
  });
});
