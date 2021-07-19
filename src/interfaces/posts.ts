export interface PostData {
  title: string;
  body: string;
  userId: number;
}

export interface Post extends PostData {
  id: number;
}
