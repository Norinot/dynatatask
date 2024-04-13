import { IUser } from "./user";

export interface IComment {
  id: number;
  body: string;
  author: IUser;
  comments: IComment[];
}

export interface ITopic {
  id: number;
  author: IUser;
  title: string;
  body: string;
  comments: IComment[];
}

export interface IUserStatistics {
  topics: number;
  comments: number;
}


export interface INewTopic {
  title: string;
  author: IUser;
  body: string;
}
