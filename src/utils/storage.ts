import AsyncStorage from '@react-native-async-storage/async-storage';

const KEYS = {
  TOKEN: '@cc_token',
  USER: '@cc_user',
};

export const storage = {
  async setToken(token: string) {
    await AsyncStorage.setItem(KEYS.TOKEN, token);
  },
  async getToken(): Promise<string | null> {
    return AsyncStorage.getItem(KEYS.TOKEN);
  },
  async setUser(user: any) {
    await AsyncStorage.setItem(KEYS.USER, JSON.stringify(user));
  },
  async getUser(): Promise<any | null> {
    const data = await AsyncStorage.getItem(KEYS.USER);
    return data ? JSON.parse(data) : null;
  },
  async clearAll() {
    await AsyncStorage.multiRemove([KEYS.TOKEN, KEYS.USER]);
  },
};