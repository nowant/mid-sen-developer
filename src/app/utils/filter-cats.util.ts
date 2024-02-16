import { Cat } from '../states/cats.model';

export function useToFilterByPriceRangeCats(
  cats: Cat[],
  min: number,
  max: number,
): Cat[] {
  return cats.filter((cat) => cat.price >= min && cat.price <= max);
}

export function useToFilterCatCategories(cats: Cat[]): string[] {
  return cats
    .filter(
      (cat, index) =>
        cats.findIndex((c) => c.category === cat.category) === index,
    )
    .map((cat) => cat.category);
}

export function useToFilterByCategoryCats(
  cats: Cat[],
  category: string,
): Cat[] {
  return cats.filter((cat) => cat.category.indexOf(category) > -1);
}
