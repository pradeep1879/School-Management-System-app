export interface User {
  id: string;
  name: string;
  email: string;
  role?: string;
}


export interface AuthContextType {
  user: User | null;
  setUser: React.Dispatch<React.SetStateAction<User | null >>;
  logout: () => void;
}