import { User } from "../../entities/User";
import { IEmailProvider } from "../../providers/IEmailProvider";
import { IUsersRepository } from "../../repositories/IUsersRepository";
import { ICreateUserRequestDTO } from "./CreateUserDTO";

export class CreateUserUseCase {

    constructor(
      private usersRepository: IUsersRepository,
      private emailProvider: IEmailProvider
      ) {

    }

    async execute(data: ICreateUserRequestDTO) {
      const userAlreadyExists = await this.usersRepository.findByEmail(data.email);

      if (userAlreadyExists) {
          throw new Error('User already exists!!');
      }

      const user = new User(data);

      await this.usersRepository.save(user);

      await this.emailProvider.sendMail({
        to: {
          name: data.name,
          email: data.email
        },
        from: {
          name: 'Equipe Assinatura',
          email: 'assinatura@rd.com.br'
        },
        subject: 'Email de teste para o cadastro',
        body: '<p>Cadastro efetuado com sucesso, na plataforma!</p>'
      })

    }


}