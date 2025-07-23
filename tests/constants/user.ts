import { LoginUserRequestDto, UserDTO } from "../../api";

export enum UserToken {
  EXISTING_USER_TOKEN = "existingUserToken",
  NEW_USER_TOKEN = "newUserToken",
}

export enum UserType {
  EXISTING_USER = "existingUser",
  NEW_USER = "newUser",
}

export const existingUser: UserDTO = {
  id: 1,
  name: "Jan",
  surname: "Kowalski",
  email: "existing@example.com",
};

export const existingUserCredentials: LoginUserRequestDto = {
  email: existingUser.email,
  password: "password123",
};
