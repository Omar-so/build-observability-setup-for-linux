import { use } from 'react';
import { z } from 'zod';

// Base User Schema
export const userSchema = z.object({
  id: z.string().uuid(),
  createdAt: z.date(),
  email: z.string().email(),
  name: z.string().min(2).nullable(),
  image: z.string().url().nullable(),
});

// Post Schema
export const postSchema = z.object({
  id: z.string().uuid(),
  createdAt: z.date(),
  title: z.string().min(1).max(255),
  content: z.string().nullable(),
  likes: z.number().min(0).default(0),
  image: z.string().url().nullable(),
  published: z.boolean().default(false),
  authorId: z.string().uuid(),
});

// Comment Schema
export const commentSchema = z.object({
  id: z.string().uuid(),
  createdAt: z.date(),
  content: z.string().min(1),
  postId: z.string().uuid(),
  authorId: z.string().uuid(),
});

// Bookmark Schema
export const bookmarkSchema = z.object({
  id: z.string().uuid(),
  createdAt: z.date(),
  postId: z.string().uuid(),
  userId: z.string().uuid(),
});

// Request Validation Schemas
export const createPostSchema = z.object({
  title: z.string().min(1).max(255),
  content: z.string().optional(),
  image: z.string().url().nullable().optional(),
  authorId: z.string()
});


export const updatePostSchema = createPostSchema.partial();

export const createCommentSchema = z.object({
  content: z.string().min(1),
  postId: z.string(),
  authorId: z.string(),
});
export const updateCommentSchema = z.object({
  content: z.string().min(1)
});
export const createBookmarkSchema = z.object({
  postId: z.string(),
  userId: z.string(),
});



// Response Types
export type User = z.infer<typeof userSchema>;
export type Post = z.infer<typeof postSchema>;
export type Comment = z.infer<typeof commentSchema>;
export type Bookmark = z.infer<typeof bookmarkSchema>;

export type POSTSGETPAGINATED = {
  id: string;
  name: string | null;
  email: string;
  image: string | null;
  createdAt: Date;
  posts: {
    id: string;
    title: string;
    content: string | null;
    image: string | null;
    published: boolean;
    createdAt: Date;
    comments: {
      id: string;
      content: string;
      createdAt: Date;
      author: {
        id: string;
        name: string | null;
        email: string;
        image: string | null;
        createdAt: Date;
      };
    }[];
  }[];
  _count: {
    postLikes: number;
  };
} | null;

export type TopHashtag = {
  tag: string;
  count: number;
};



// bookmark
export type BookmarkPost = {
  id: string;
  title: string;
  content: string;
  image: string | null;
  createdAt: string;
};

export type BookmarkItem = {
  postId: string;
  userId: string;
  createdAt: string;
  post: BookmarkPost;
};

export type UserBookmarksResponse = {
  status: number;
  message: string;
  data: BookmarkItem[];
  pagination: {
    currentPage: number;
    totalPages: number;
    totalBookmarks: number;
    limit: number;
  };
};

//comment
export type CommentType = {
  id: string;
  content: string;
  createdAt: string;
  author: {
    id: string;
    name: string | null;
    email: string | null;
    image: string | null;
  };
};

export type CreateCommentInput = {
  content: string;
  postId: string;
  authorId: string;
};

export type PaginatedCommentsResponse = {
  status: number;
  message: string;
  data: CommentType[];
  pagination: {
    currentPage: number;
    totalPages: number;
    totalComments: number;
    limit: number;
  };
};


//user profile

// types.ts
export type Post = {
  id: string;
  title: string;
  content: string | null;
  image: string | null;
  published: boolean;
  createdAt: string;
};

export type UserProfile = {
  id: string;
  name: string;
  email: string;
  image: string | null;
  createdAt: string;
  posts: Post[];
  _count: {
    followers: number;
    posts: number;
  };
};

export type Pagination = {
  currentPage: number;
  totalPages: number;
  totalPosts: number;
  limit: number;
};

export type UserProfileResponse = {
  status: number;
  message: string;
  data: UserProfile;
  pagination: Pagination;
};
