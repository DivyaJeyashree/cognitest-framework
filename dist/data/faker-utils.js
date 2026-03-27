"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.makeFakeUser = void 0;
const faker_1 = require("@faker-js/faker");
const makeFakeUser = () => ({
    username: faker_1.faker.internet.username(),
    password: faker_1.faker.internet.password({ length: 12 }),
    email: faker_1.faker.internet.email()
});
exports.makeFakeUser = makeFakeUser;
