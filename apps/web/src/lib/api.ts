// API functions for fetching data from the backend

// Base URL for API requests - point this to your Express.js backend
const API_BASE_URL = 'http://localhost:8000/api/v1'; // Update this with your actual backend URL

// Define error type
interface ApiError {
  message: string;
  status?: number;
}

// Helper function for handling API responses
async function handleResponse<T>(response: Response): Promise<T> {
  if (!response.ok) {
    const errorData = (await response
      .json()
      .catch(() => ({ message: 'Unknown error' }))) as ApiError;
    throw new Error(errorData.message || `API error: ${response.status}`);
  }
  return response.json() as Promise<T>;
}

// Product API functions
export async function getProducts(search?: string): Promise<Product[]> {
  const url = search
    ? `${API_BASE_URL}/product/products?search=${encodeURIComponent(search)}`
    : `${API_BASE_URL}/product/products`;

  try {
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    return handleResponse<Product[]>(response);
  } catch (error) {
    console.error('Error fetching products:', error);
    throw new Error(
      error instanceof Error ? error.message : 'Failed to fetch products',
    );
  }
}

export async function getProductDetail(id: string | number): Promise<Product> {
  try {
    const response = await fetch(`${API_BASE_URL}/product/${id}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    return handleResponse<Product>(response);
  } catch (error) {
    console.error('Error fetching product details:', error);
    throw new Error(
      error instanceof Error
        ? error.message
        : 'Failed to fetch product details',
    );
  }
}

export interface CartResponse {
  id: number;
  cartId: number;
  productId: number;
  quantity: number;
}

export async function addToCart(
  userId: number,
  productId: number | string,
  quantity: number,
): Promise<CartResponse> {
  try {
    const response = await fetch(`${API_BASE_URL}/product/cart`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ userId, productId, quantity }),
    });
    return handleResponse<CartResponse>(response);
  } catch (error) {
    console.error('Error adding to cart:', error);
    throw new Error(
      error instanceof Error ? error.message : 'Failed to add product to cart',
    );
  }
}

// Admin Product API functions
export async function getProductsAdmin(): Promise<AdminProduct[]> {
  try {
    const response = await fetch(`${API_BASE_URL}/product/admin/products`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    return handleResponse<AdminProduct[]>(response);
  } catch (error) {
    console.error('Error fetching admin products:', error);
    throw new Error(
      error instanceof Error ? error.message : 'Failed to fetch admin products',
    );
  }
}

export async function createProduct(
  productData: Omit<AdminProduct, 'id'>,
): Promise<AdminProduct> {
  try {
    const response = await fetch(`${API_BASE_URL}/product/admin/product`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(productData),
    });
    return handleResponse<AdminProduct>(response);
  } catch (error) {
    console.error('Error creating product:', error);
    throw new Error(
      error instanceof Error ? error.message : 'Failed to create product',
    );
  }
}

export async function updateProduct(
  id: string | number,
  productData: Partial<{
    name: string;
    description: string;
    price: number;
    categoryId: number;
    storeId: number;
  }>,
): Promise<AdminProduct> {
  try {
    const response = await fetch(
      `${API_BASE_URL}/product/admin/product/${id}`,
      {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(productData),
      },
    );
    return handleResponse<AdminProduct>(response);
  } catch (error) {
    console.error('Error updating product:', error);
    throw new Error(
      error instanceof Error ? error.message : 'Failed to update product',
    );
  }
}

export interface DeleteResponse {
  message: string;
}

export async function deleteProduct(id: number): Promise<DeleteResponse> {
  try {
    const response = await fetch(
      `${API_BASE_URL}/product/admin/product/${id}`,
      {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
      },
    );
    return handleResponse<DeleteResponse>(response);
  } catch (error) {
    console.error('Error deleting product:', error);
    throw new Error(
      error instanceof Error ? error.message : 'Failed to delete product',
    );
  }
}

export interface UploadResponse {
  message: string;
  data: {
    count: number;
  };
}

export async function uploadProductImages(
  productId: number | string,
  images: File[],
): Promise<UploadResponse> {
  try {
    const formData = new FormData();
    formData.append('productId', productId.toString());

    // Append each image to the formData with the name "images"
    images.forEach((image) => {
      formData.append('images', image);
    });

    const response = await fetch(
      `${API_BASE_URL}/product/admin/product/upload-image`,
      {
        method: 'POST',
        body: formData,
        // Don't set Content-Type header when using FormData, browser will set it automatically with boundary
      },
    );
    return handleResponse<UploadResponse>(response);
  } catch (error) {
    console.error('Error uploading product images:', error);
    throw new Error(
      error instanceof Error
        ? error.message
        : 'Failed to upload product images',
    );
  }
}

export async function deleteProductImage(
  productId: number | string,
  imageId: string,
): Promise<DeleteResponse> {
  try {
    // This endpoint might need to be implemented in your backend
    const response = await fetch(
      `${API_BASE_URL}/product/admin/product/${productId}/image/${imageId}`,
      {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
      },
    );
    return handleResponse<DeleteResponse>(response);
  } catch (error) {
    console.error('Error deleting product image:', error);
    throw new Error(
      error instanceof Error ? error.message : 'Failed to delete product image',
    );
  }
}

// Admin Category API functions
export async function getCategoriesAdmin(): Promise<Category[]> {
  try {
    const response = await fetch(`${API_BASE_URL}/product/admin/categories`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    return handleResponse<Category[]>(response);
  } catch (error) {
    console.error('Error fetching categories:', error);
    throw new Error(
      error instanceof Error ? error.message : 'Failed to fetch categories',
    );
  }
}

export async function getCategoriesProduct(): Promise<Category[]> {
  try {
    const response = await fetch(`${API_BASE_URL}/product/categories`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    return handleResponse<Category[]>(response);
  } catch (error) {
    console.error('Error fetching product categories:', error);
    throw new Error(
      error instanceof Error
        ? error.message
        : 'Failed to fetch product categories',
    );
  }
}

export async function getCategory(id: string | number): Promise<Category> {
  try {
    const response = await fetch(
      `${API_BASE_URL}/product/admin/category/${id}`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      },
    );
    return handleResponse<Category>(response);
  } catch (error) {
    console.error('Error fetching category:', error);
    throw new Error(
      error instanceof Error ? error.message : 'Failed to fetch category',
    );
  }
}

export async function createCategory(categoryData: {
  name: string;
}): Promise<Category> {
  try {
    const response = await fetch(`${API_BASE_URL}/product/admin/category`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(categoryData),
    });
    return handleResponse<Category>(response);
  } catch (error) {
    console.error('Error creating category:', error);
    throw new Error(
      error instanceof Error ? error.message : 'Failed to create category',
    );
  }
}

export async function updateCategory(
  id: string | number,
  categoryData: { name: string },
): Promise<Category> {
  try {
    const response = await fetch(
      `${API_BASE_URL}/product/admin/category/${id}`,
      {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(categoryData),
      },
    );
    return handleResponse<Category>(response);
  } catch (error) {
    console.error('Error updating category:', error);
    throw new Error(
      error instanceof Error ? error.message : 'Failed to update category',
    );
  }
}

export async function deleteCategory(id: number): Promise<DeleteResponse> {
  try {
    const response = await fetch(
      `${API_BASE_URL}/product/admin/category/${id}`,
      {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
      },
    );
    return handleResponse<DeleteResponse>(response);
  } catch (error) {
    console.error('Error deleting category:', error);
    throw new Error(
      error instanceof Error ? error.message : 'Failed to delete category',
    );
  }
}

// Store API functions - this might need to be implemented in your backend
export async function getStores(): Promise<Store[]> {
  try {
    // If you don't have a specific endpoint for stores, you can use a mock implementation
    // for development purposes
    return [
      { id: 1, name: 'Main Store' },
      { id: 2, name: 'Branch Store' },
    ];

    // When you have the endpoint ready, uncomment this:
    // const response = await fetch(`${API_BASE_URL}/stores`, {
    //   method: "GET",
    //   headers: {
    //     "Content-Type": "application/json",
    //   },
    // });
    // return handleResponse<Store[]>(response);
  } catch (error) {
    console.error('Error fetching stores:', error);
    throw new Error(
      error instanceof Error ? error.message : 'Failed to fetch stores',
    );
  }
}

// Types
export interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  categoryId: number;
  categoryName?: string;
  images?: string[];
  createdAt?: string;
  updatedAt?: string;
}

export interface AdminProduct extends Product {
  storeId: number;
  storeName?: string;
  stock?: number;
}

export interface Category {
  id: number;
  name: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface Store {
  id: number;
  name: string;
  address?: string;
  createdAt?: string;
  updatedAt?: string;
}
