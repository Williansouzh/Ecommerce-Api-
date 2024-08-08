import { LoginUserDTO } from "@src/application/dtos/userDTO";

export type LoggedUserDTO = Omit<LoginUserDTO, "password">;
