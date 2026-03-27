import { faker } from "@faker-js/faker";

export interface FakeUser {
  username: string;
  password: string;
  email: string;
}

export const makeFakeUser = (): FakeUser => ({
  username: faker.internet.username(),
  password: faker.internet.password({ length: 12 }),
  email: faker.internet.email()
});
