# logging_middleware

Reusable logger for the Affordmed evaluation Log API.

## Install

From the repository root:

```bash
cd logging_middleware
npm install
```

## Setup

Use your token received from the auth API:

```bash
export AFFORDMED_AUTH_TOKEN="<your_access_token>"
```

or initialize directly:

```js
const { initLogger } = require("./src");
initLogger({ token: "<your_access_token>" });
```

## Usage

```js
const { Log, initLogger } = require("./src");

initLogger({
  token: process.env.AFFORDMED_AUTH_TOKEN
});

async function run() {
  const response = await Log(
    "backend",
    "error",
    "handler",
    "received string, expected bool"
  );

  console.log(response);
}

run().catch(console.error);
```

## Notes

- `Log(stack, level, package, message)` validates fields before making the API call.
- Allowed values match the constraints in the problem statement.
- The log API is protected, so a bearer token is mandatory.
