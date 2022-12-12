 export type User = {
   username: string;
   password: string;
   birthdate: string;
   gender: string;
   createddate: string;
   email: string;
  id: string;
  confirm_password: string;
 };

 export type Todo = {
  id: string;
  userId: string;
  title: string;
  deadline: string;
  late: boolean;

  completed: boolean;

   created_at: string;
 };
