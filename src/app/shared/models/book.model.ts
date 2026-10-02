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
  price?: number;
  postDate?: string;
  description?: string;
  rackCode?: string;
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
  description?: string;
  rackCode?: string;
}

export interface Page<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
}
