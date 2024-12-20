// src/recoil/atoms/authAtom.ts
import { atom } from "recoil";
import { User } from "../../models/user/user.model"; 

interface AuthState {
  isAuthenticated: boolean;
  user: User | null;
  token: string | null;
}

export const authState = atom<AuthState>({
  key: "authState", 
  default: {
    isAuthenticated: false,
    user: null,
    token: null,
  },
});
