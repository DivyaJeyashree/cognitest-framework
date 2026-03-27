export interface SecretsManager {
  getSecret(name: string): Promise<string>;
}
