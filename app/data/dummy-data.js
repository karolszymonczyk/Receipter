import Receipt from '../models/receipt';
import Tag from '../models/tag';

const randomDate = (start, end) => new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));

const randomTotal = (max, min = 1) => Math.random() * (max - min) + min;

const categories = [
  'grocery',
  'retail',
  'travel',
  'clothes',
  'services',
  'health',
  'home',
  'miscellaneous',
  'restaurants',
];

const tags = [
  new Tag(1, 'beer'),
  new Tag(2, 'shoes'),
  new Tag(3, 'sweets'),
  new Tag(4, 'water'),
  new Tag(5, 'nail care'),
];

const randomTags = () => {
  const rn = Math.floor(Math.random() * tags.length);
  const rt = [{ ...tags[rn], value: randomTotal(5, 100) }];
  return tags[rn + 1] ? rt.concat({ ...tags[rn + 1], value: randomTotal(5, 100) }) : rt;
};

const fillRandomReceipts = (num) => {
  const receipts = [];
  for (let i = 0; i < num; i++) {
    receipts.push(
      new Receipt(
        `${i}`,
        `u${i}`,
        `Tytul paragonu ${i}`,
        'https://i.piccy.info/i9/e51742456cc503ef28c74d69b234c67e/1418393845/288913/798759/paragon_bdr.jpg',
        'Zara',
        randomDate(new Date(2020, 0, 2), new Date()),
        randomTotal(500, 450),
        null,
        categories[Math.floor(Math.random() * categories.length)],
        randomTags()
      )
    );
  }
  return receipts;
};

export const RECEIPTS = fillRandomReceipts(100);

export const TAGS = [
  new Tag(1, 'plants'),
  new Tag(2, 'shoes'),
  new Tag(3, 'sweets'),
  new Tag(4, 'cosmetics'),
  new Tag(5, 'work'),
];
