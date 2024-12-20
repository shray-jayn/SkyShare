import { LoginRequest, LoginResponce } from "../models/auth/login.model";
import { SignInResponce, SignUpRequest } from "../models/auth/signup.model";
import apiClient from "./api.service";


export const authService = {
  async register(payload: SignUpRequest): Promise<SignInResponce> {
    try {
      const response = await apiClient.post("/users/register", payload);
      const { token } = response.data;
      localStorage.setItem("token", token);
      return response.data;
    } catch (error) {
      console.error("Registration failed:", error);
      throw new Error("Unable to register. Please try again.");
    }
  },

  async login(payload: LoginRequest): Promise<LoginResponce> {
    try {
      const response = await apiClient.post("/users/login", payload);

      // Check for non-200 status code
      if (response.status !== 200) {
        throw new Error("Invalid credentials");
      }

      const { token } = response.data;
      localStorage.setItem("token", token);
      return response.data;
    } catch (error:any) {
      console.error("Login failed:", error);

      // Customize the error message
      if (error.response && error.response.status === 401) {
        throw new Error("Email or password is incorrect!");
      }
      throw new Error("Unable to login. Please try again later.");
    }
  },

  logout() {
    localStorage.removeItem("token");
  },
};
