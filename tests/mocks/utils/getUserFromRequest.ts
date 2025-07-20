import { UserToken } from "../../constants/tokens";

export const getUserFromRequest = (req: { headers: Headers }) => {
  const auth = req.headers.get("authorization");

  switch (auth) {
    case `Bearer ${UserToken.EXISTING_USER_TOKEN}`:
      return "existingUser";
    case `Bearer ${UserToken.NEW_USER_TOKEN}`:
      return "newUser";
    default:
      return null;
  }
};
