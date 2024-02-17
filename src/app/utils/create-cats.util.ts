// eslint-disable-next-line node/no-unpublished-import
import { SexType, faker } from '@faker-js/faker';
import { Cat } from '../states/cats.model';

export function useToCreateCats(amount: number): Cat[] {
  const data: Cat[] = [];

  for (let i = 0; i < amount; i++) {
    data.push(createRandomCat());
  }

  return data;
}

const catCategories: string[] = new Array(20)
  .fill(undefined)
  .map(() => faker.animal.cat());

function createRandomCat(): Cat {
  return {
    id: faker.string.uuid(),
    avatar: faker.image.urlLoremFlickr({ category: 'cats' }),
    name: faker.person.firstName(faker.person.sex() as SexType),
    category: catCategories[Math.floor(Math.random() * catCategories.length)],
    price: faker.number.float({ min: 10, max: 500, fractionDigits: 3 }),
  };
}
