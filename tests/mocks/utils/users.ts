import { HttpResponse } from "next/experimental/testmode/playwright/msw";
import { LoginUserRequestDto, LoginUserResponseDto } from "../../../api";
import {
  UserType,
  UserToken,
  existingUserCredentials,
  existingUser,
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
      error: "Nieprawidłowe dane. Sprawdź email lub hasło i spróbuj ponownie",
    },
    { status: 401 }
  );
};
