import api from "./api";

export const authService = {
  async login(email: string, password: string) {
    const { data } = await api.post("/login", { email, password });
    return data;
  },
  async register(body: {
    name: string;
    email: string;
    password: string;
    role: string;
    organisation?: string;
    region?: string;
    phone?: string;
  }) {
    const { data } = await api.post("/register", body);
    return data;
  },
  async getMe() {
    const { data } = await api.get("/me");
    return data;
  },
  async updateProfile(id: string, body: any) {
    const { data } = await api.patch(`/users/${id}`, body);
    return data;
  },
};
