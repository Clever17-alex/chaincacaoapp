import AsyncStorage from '@react-native-async-storage/async-storage';

const KEYS = {
  TOKEN: '@chaincacao_token',
  USER: '@chaincacao_user',
  OFFLINE_QUEUE: '@chaincacao_offline_queue',
};

export const storage = {
  async setToken(token: string) {
    await AsyncStorage.setItem(KEYS.TOKEN, token);
  },
  async getToken(): Promise<string | null> {
    return AsyncStorage.getItem(KEYS.TOKEN);
  },
  async removeToken() {
    await AsyncStorage.removeItem(KEYS.TOKEN);
  },

  async setUser(user: any) {
    await AsyncStorage.setItem(KEYS.USER, JSON.stringify(user));
  },
  async getUser(): Promise<any | null> {
    const data = await AsyncStorage.getItem(KEYS.USER);
    return data ? JSON.parse(data) : null;
  },
  async removeUser() {
    await AsyncStorage.removeItem(KEYS.USER);
  },

  async clearAll() {
    await AsyncStorage.multiRemove([KEYS.TOKEN, KEYS.USER, KEYS.OFFLINE_QUEUE]);
  },
};