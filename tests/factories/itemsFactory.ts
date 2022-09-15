import { prisma } from '../../src/database';
import { faker } from '@faker-js/faker';
import { TItemData } from '../../../my-shopping-list/src/types/ItemsTypes';

const defaultItem = {
  title: faker.internet.color(),
  amount: Math.floor(Math.random() * 100),
  url: faker.internet.url(),
  description: faker.internet.avatar()
} as TItemData;

export function newItem () {
  return defaultItem;
}

export async function insert (item: TItemData) {
  return await prisma.items.create({ data: item });
}