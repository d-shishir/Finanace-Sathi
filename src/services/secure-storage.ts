import * as SecureStore from 'expo-secure-store';

const KEYS = {
  AUTH_TOKEN: 'auth_token',
  USER_PROFILE: 'user_profile',
  APP_STATE: 'app_state',
} as const;

export async function saveAuthToken(token: string): Promise<void> {
  await SecureStore.setItemAsync(KEYS.AUTH_TOKEN, token);
}

export async function getAuthToken(): Promise<string | null> {
  return SecureStore.getItemAsync(KEYS.AUTH_TOKEN);
}

export async function removeAuthToken(): Promise<void> {
  await SecureStore.deleteItemAsync(KEYS.AUTH_TOKEN);
}

export async function saveSecureData(key: string, data: string): Promise<void> {
  await SecureStore.setItemAsync(key, data);
}

export async function getSecureData(key: string): Promise<string | null> {
  return SecureStore.getItemAsync(key);
}

export async function removeSecureData(key: string): Promise<void> {
  await SecureStore.deleteItemAsync(key);
}
