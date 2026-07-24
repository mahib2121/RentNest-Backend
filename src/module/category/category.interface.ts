export interface CreateCategoryPayload {
  name: string;
  slug: string;
  description?: string;
}

export interface UpdateCategoryPayload {
  name?: string;
  slug?: string;
  description?: string;
}
