import { DeepPartial, createConnection } from 'typeorm';
import { Category } from '../../modules/categories/entities/category.entity';

async function seed() {
  const connection = await createConnection();

  try {
    await connection.manager.save(Category, [
      { id: 1, name: 'Awaiting', color: '#FFFF00' },
      { id: 2, name: 'In Typing', color: '#0000FF' },
      { id: 3, name: 'Finished', color: '#008000' },
      { id: 4, name: 'Canceled', color: '#FF0000' },
    ] as DeepPartial<Category>[]);
    console.log('Seed successful');
  } catch (error) {
    console.error('Seed failed:', error);
  } finally {
    await connection.close();
  }
}

seed();
