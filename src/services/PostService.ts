import { PostData, Post } from 'interfaces/posts';

import { apiSecondary as api } from '../config/api';

export const deletePost = (id: string) => api.delete<any>(`posts/${id}`);

export const createPost = (body: PostData) => api.post<any>('posts', body);

export const editPost = (body: Post) => api.put<any>(`posts/${body.id}`, body);
