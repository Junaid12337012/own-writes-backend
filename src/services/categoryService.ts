import Category, { ICategory } from '../models/Category';

export async function createCategory(data: Partial<ICategory>) {
  return await Category.create(data);
}

export async function getCategories() {
  return await Category.find();
}

export async function updateCategory(id: string, data: Partial<ICategory>) {
  return await Category.findByIdAndUpdate(id, data, { new: true });
}

export async function deleteCategory(id: string) {
  return await Category.findByIdAndDelete(id);
}
