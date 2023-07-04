export interface User {
  id: string;
  username: string;
  age: number;
  hobbies: string[];
}

export interface UserRequest {
  username: string;
  age: number;
  hobbies: string[];
}
