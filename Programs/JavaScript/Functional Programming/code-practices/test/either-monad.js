const Right = (x) => ({
  map: (f) => Right(f(x)),
  chain: (f) => f(x),
  fold: (f, g) => g(x),
  inspect: `Right(${x})`,
});

const Left = (x) => ({
  map: (f) => Left(x),
  chain: (f) => Left(x),
  fold: (f, g) => f(x),
  inspect: `Left(${x})`,
});

const fromNullable = (x) => (x != null ? Right(x) : Left(null));

const tryCatch = (f) => {
  try {
    return Right(f());
  } catch (e) {
    return Left(e);
  }
};

const logIt = x => {
  console.log(x);
  return x;
}

// 1. =====================================

const getUserById = (id) => {
  // Simulating an asynchronous operation
  return new Promise((resolve, reject) => {
    // Simulating a database lookup
    setTimeout(() => {
      const users = {
        1: { id: 1, name: "John" },
        2: { id: 2, name: "Jane" },
      };
      const user = users[id];
      user ? resolve(user) : reject("User not found");
    }, 1000);
  });
};

const findUserById = (id) =>
  fromNullable(id).chain((userId) => tryCatch(() => getUserById(userId)));

// (async () => {
//   await findUserById(1).fold(
//     (error) => console.log(`Error: ${error}`),
//     (user) => console.log(`User found: ${user.name}`)
//   );
// })();
// 2. =====================================

const fs = require("fs");

const getPort_ = () => {
  try {
    const str = fs.readFileSync("config.json");
    const config = JSON.parse(str);
    return config.port;
  } catch (e) {
    return 3000;
  }
};

const getPort_1 = () =>
  tryCatch(() => fs.readFileSync("config.json"))
    .map((contents) => JSON.parse(contents))
    .map((config) => config.port)
    .fold(
      () => 8080,
      (x) => x
    );

const readFileSync = (path) => tryCatch(() => fs.readFileSync(path));
const parseJSON = (contents) => tryCatch(() => JSON.parse(contents));

const getPort = () =>
  readFileSync("config.json") // Right
    .chain(parseJSON) // If using map then => Right(Right({})), so using `chain` instead.
    .map((config) => config.port)
    .fold(
      () => 8080,
      (x) => x
    );

const result = getPort();
console.log(result);
