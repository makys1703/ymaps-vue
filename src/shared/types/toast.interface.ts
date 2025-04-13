export interface IToast {
  id: string;
  title: string;
  text: string;
  distance?: number;
  error?: boolean;
}