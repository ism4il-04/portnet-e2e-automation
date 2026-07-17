import 'dotenv/config';

export type LoginCredentials = {
  username: string;
  password: string;
};

export function hasRequiredCredentials(user: LoginCredentials): boolean {
  return Boolean(user?.username?.trim() && user?.password?.trim());
}

export async function getValidUserCredentials(): Promise<LoginCredentials> {
  return {
    username: process.env.E2E_USERNAME?.trim() || '',
    password: process.env.E2E_PASSWORD?.trim() || ''
  };
}

export async function getRoleCredentials(role: string): Promise<LoginCredentials> {
  const normalizedRole = role.toUpperCase().replace(/[^A-Z0-9]/g, '_');
  const roleUsername = process.env[`E2E_${normalizedRole}_USERNAME`]?.trim() || '';
  const rolePassword = process.env[`E2E_${normalizedRole}_PASSWORD`]?.trim() || '';

  if (roleUsername && rolePassword) {
    return {
      username: roleUsername,
      password: rolePassword
    };
  }

  return getValidUserCredentials();
}

export function hasRequiredEnvironment(): boolean {
  return Boolean(process.env.LOGIN_URL?.trim() && process.env.HOME_URL?.trim());
}