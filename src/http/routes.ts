import { parse } from "node:url";

import { userRoutes } from "./routes/users/routes-users";
import { IncomingMessage, ServerResponse } from "node:http";
import { authenticationRoutes } from "./routes/authentication/routes-authenticaiton";

const DEFAULT_HEADER = { "content-type": "application/json" };

const heroUsers = userRoutes();
const auth = authenticationRoutes();

const allRoutes = {
  ...heroUsers,
  ...auth,
  default: (request: IncomingMessage, response: ServerResponse) => {
    response.writeHead(404, DEFAULT_HEADER);
    response.write("uuuuups, not found!");
    response.end();
  },
};

function appRoutes(request, response) {
  const { url, method } = request;

  const { pathname } = parse(url, true);

  const key = `${pathname}:${method.toLowerCase()}`; //users:post
  const chosen = allRoutes[key] || allRoutes.default;

  return Promise.resolve(chosen(request, response)).catch(
    handlerError(response)
  );
}

function handlerError(response: ServerResponse) {
  return (error) => {
    console.log("Something bad has  happened**", error.stack);
    response.writeHead(500, DEFAULT_HEADER);
    response.write(
      JSON.stringify({
        error: "internet server error!!",
      })
    );

    return response.end();
  };
}

export default appRoutes;
