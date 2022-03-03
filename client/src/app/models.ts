export interface User {
  _id?: string;
  firstName?: string;
  lastName?: string;
  email: string;
  password: string;
}
export interface BookMark {
  _id: string;
  title: string;
  link: string;
  description?: string;
}
