import type { CoreActions } from "../../core/core-actions";

export class LoginPage {
  constructor(private readonly actions: CoreActions) {}

  async login(username: string, password: string): Promise<void> {
    await this.actions.typeWithHealing(["#username", "[name='username']"], username);
    await this.actions.typeWithHealing(["#password", "[name='password']"], password);
    await this.actions.clickWithHealing(["button[type='submit']", "#loginBtn"]);
  }
}
