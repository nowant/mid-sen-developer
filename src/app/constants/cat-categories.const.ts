// eslint-disable-next-line node/no-unpublished-import
import { faker } from '@faker-js/faker';

export const catCategories: string[] = new Array(20)
  .fill(undefined)
  .map(() => faker.animal.cat());
