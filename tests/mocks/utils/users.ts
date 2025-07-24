import { HttpResponse } from "next/experimental/testmode/playwright/msw";
import {
  LoginUserRequestDto,
  LoginUserResponseDto,
  RegisterUserRequestDto,
  RegisterUserResponseDto,
} from "../../../api";
import {
  UserType,
  UserToken,
  existingUserCredentials,
  existingUser,
  newUserCredentials,
  newUser,
} from "../../constants/user";

export const getUserFromRequest = (req: { headers: Headers }) => {
  const auth = req.headers.get("authorization");

  switch (auth) {
    case `Bearer ${UserToken.EXISTING_USER_TOKEN}`:
      return UserType.EXISTING_USER;
    case `Bearer ${UserToken.NEW_USER_TOKEN}`:
      return UserType.NEW_USER;
    default:
      return null;
  }
};

export const getUserMeResponse = (user: UserType | null) => {
  switch (user) {
    case UserType.EXISTING_USER:
      return HttpResponse.json(existingUser);
    case UserType.NEW_USER:
      return HttpResponse.json(newUser);
    default:
      return HttpResponse.json(
        {
          error: "User unauthorized",
        },
        { status: 401 }
      );
  }
};

export const getLoginUserResponse = ({
  email,
  password,
}: LoginUserRequestDto): HttpResponse<
  LoginUserResponseDto | { error: string }
> => {
  if (
    email === existingUserCredentials.email &&
    password === existingUserCredentials.password
  ) {
    const response: LoginUserResponseDto = {
      token: UserToken.EXISTING_USER_TOKEN,
      user: existingUser,
    };

    return HttpResponse.json(response);
  }

  if (email === "servererror@example.com") {
    return HttpResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }

  return HttpResponse.json(
    {
      error: "Invalid email or password.",
    },
    { status: 401 }
  );
};

export const getRegisterUserResponse = ({
  name,
  surname,
  email,
  password,
}: RegisterUserRequestDto): HttpResponse<
  RegisterUserResponseDto | { error: string }
> => {
  if (
    name === newUserCredentials.name &&
    surname === newUserCredentials.surname &&
    email === newUserCredentials.email &&
    password === newUserCredentials.password
  ) {
    const response: RegisterUserResponseDto = {
      token: UserToken.NEW_USER_TOKEN,
      user: newUser,
    };

    return HttpResponse.json(response);
  }

  if (email === existingUser.email) {
    return HttpResponse.json(
      {
        error: `Email: ${existingUser.email} already registered.`,
      },
      { status: 400 }
    );
  }

  return HttpResponse.json(
    {
      error: "Internal Server Error",
    },
    { status: 500 }
  );
};
