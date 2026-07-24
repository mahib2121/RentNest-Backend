export interface IPropertyFilterParams {
  searchTerm?: string;
  city?: string;
  division?: string;
  categoryId?: string;
  minPrice?: number;
  maxPrice?: number;
  bedrooms?: number;
  bathrooms?: number;
}

export interface IPaginationOptions {
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
}

export interface CreatePropertyPayload {
  categoryId: string;

  title: string;
  description: string;

  rentPrice: number;

  bedrooms: number;
  bathrooms: number;
  areaSqft: number;

  address: string;
  city: string;
  division: string;
  postalCode?: string;

  latitude?: number;
  longitude?: number;

  availableFrom: Date;
}

export interface UpdatePropertyPayload {
  categoryId?: string;

  title?: string;
  description?: string;

  rentPrice?: number;

  bedrooms?: number;
  bathrooms?: number;
  areaSqft?: number;

  address?: string;
  city?: string;
  division?: string;
  postalCode?: string;

  latitude?: number;
  longitude?: number;

  availableFrom?: Date;
}
