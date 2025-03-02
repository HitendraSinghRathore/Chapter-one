import { Genre } from "./genre.model";

export interface Book {
    id: number;
    name: string;
    description: string;
    ISBN: string;
    pageCount: number;
    sellableQuantity: number;
    price: number;
    countryOfOrigin: string;
    publishedDate: Date;
    edition: string;
    image: string | null;
    authorId: number;
    createdAt: Date;
    updatedAt: Date;
    genres: Genre[];
  }
  
  export type BookListItem = Pick<Book, 'id' | 'name' | 'ISBN' | 'price' | 'updatedAt' | 'image'>;
  