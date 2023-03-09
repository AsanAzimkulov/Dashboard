import { faker } from '@faker-js/faker';
import { sample } from 'lodash';

// ----------------------------------------------------------------------

const products = [...Array(24)].map((_, index) => ({
  id: faker.datatype.uuid(),
  avatarUrl: `/assets/images/avatars/avatar_sprout.jpg`,
  name: [
    'Abelia',
    'Begonia albopicta',
    'Cactus',
    'Dahlia',
    'Echeveria',
    'Fagus',
    'Gaillardia',
    'Haemanthus',
    'Iberis',
    'Jacaranda',
    'Kalanchoe',
    'Laburnum',
    'Magnolia',
    'Nandina',
    'Odontoglossum',
    'Pachypodium',
    'Quercus',
    'Radermachera',
    'Sagittaria',
    'Tagetes',
    'Vaccinium',
    'Washingtonia',
    'Yucca',
    'Zamioculcas'
  ][index],
  articul: faker.datatype.number({ min: 0, max: 9999 }),
  quantity: faker.datatype.number({ min: 1, max: 400 }),
  price: faker.datatype.number({ min: 5, max: 150 })
}));

export default products;


