import { UserType, UserToken } from "../../constants/tokens";

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
