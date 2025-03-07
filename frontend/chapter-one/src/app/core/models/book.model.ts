import { Author } from "./author.model";
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
    author: Author;
    createdAt: Date;
    updatedAt: Date;
    genres: Genre[];
  }
  
  export type BookListItem = Pick<Book, 'id' | 'name' | 'ISBN' | 'price' | 'updatedAt' | 'image' | 'author'>;
  

  export interface BookFilter {
    minPrice?: number | null;
    maxPrice?: number | null;
    authorId?: number | null;
    genreIds?: number[] | null;
    searchQuery?: string | null;
  }