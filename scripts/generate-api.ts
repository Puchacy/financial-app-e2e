import { generate } from "openapi-typescript-codegen";

generate({
  input: "http://localhost:5228/swagger/v1/swagger.json",
  output: "./api",
  useOptions: true,
});
