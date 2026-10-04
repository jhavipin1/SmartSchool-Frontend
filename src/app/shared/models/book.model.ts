export interface RackDto {
  id?: number;
  rackCode: string;
  location?: string;
}

export interface BookRequestDto {
  title: string;
  bookNumber: string;
  isbnNumber?: string;
  publisher?: string;
  author?: string;
  subject?: string;
  qty: number;
  availableQty: number;
  price?: number | null;
  postDate?: string;
  rackCode?: string;
  description?: string;
}

export interface BookResponseDto {
  id: number;
  title: string;
  bookNumber: string;
  isbnNumber?: string;
  publisher?: string;
  author?: string;
  subject?: string;
  qty: number;
  availableQty: number;
  price?: number;
  postDate?: string;
  rackCode?: string;
  description?: string;
}

export interface Page<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
  first: boolean;
  last: boolean;
  empty: boolean;
}
