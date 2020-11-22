import Receipt from '../models/receipt';
import Tag from '../models/tag';

// export const RECEIPTS = [
//   new Receipt(
//     '1',
//     'u1',
//     'https://kasyfiskalne.pl/wp-content/uploads/2018/06/paragon-fiskalny-nip.jpg',
//     'Biedronka',
//     new Date(2020, 2, 2),
//     29.21,
//     null,
//     'grocery',
//     null
//   ),
//   new Receipt(
//     '2',
//     'u1',
//     'https://kasyfiskalne.pl/wp-content/uploads/2018/06/paragon-fiskalny-nip.jpg',
//     'Sushi-Bar',
//     new Date(2020, 3, 2),
//     10.87,
//     null,
//     'retail',
//     null
//   ),
//   new Receipt(
//     '3',
//     'u2',
//     'https://kasyfiskalne.pl/wp-content/uploads/2018/06/paragon-fiskalny-nip.jpg',
//     'Orlen',
//     new Date(2020, 2, 4),
//     7.25,
//     null,
//     'travel',
//     null
//   ),
//   new Receipt(
//     '4',
//     'u3',
//     'https://www.fakturaxl.pl/img/paragon-wzor.png',
//     'Zara',
//     new Date(2020, 8, 12),
//     23.24,
//     new Date(2020, 8, 12),
//     'clothes',
//     null
//   ),
//   new Receipt(
//     '5',
//     'u3',
//     'https://i.piccy.info/i9/e51742456cc503ef28c74d69b234c67e/1418393845/288913/798759/paragon_bdr.jpg',
//     'Zara',
//     new Date(2020, 2, 12),
//     5.12,
//     new Date(2020, 2, 12),
//     'services',
//     null
//   ),
//   new Receipt(
//     '6',
//     'u3',
//     'https://i.piccy.info/i9/e51742456cc503ef28c74d69b234c67e/1418393845/288913/798759/paragon_bdr.jpg',
//     'Zara',
//     new Date(2022, 1, 12),
//     12.15,
//     null,
//     'restaurants',
//     null
//   ),
//   new Receipt(
//     '7',
//     'u3',
//     'https://i.piccy.info/i9/e51742456cc503ef28c74d69b234c67e/1418393845/288913/798759/paragon_bdr.jpg',
//     'Zara',
//     new Date(2023, 10, 12),
//     3.62,
//     null,
//     'health',
//     null
//   ),
//   new Receipt(
//     '8',
//     'u3',
//     'https://i.piccy.info/i9/e51742456cc503ef28c74d69b234c67e/1418393845/288913/798759/paragon_bdr.jpg',
//     'Zara',
//     new Date(2022, 11, 14),
//     3.62,
//     null,
//     'miscellaneous',
//     null
//   ),
//   new Receipt(
//     '9',
//     'u3',
//     'https://i.piccy.info/i9/e51742456cc503ef28c74d69b234c67e/1418393845/288913/798759/paragon_bdr.jpg',
//     'Zara',
//     new Date(2022, 11, 14),
//     4.9,
//     null,
//     'home',
//     null
//   ),
// ];

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
        randomDate(new Date(2001, 0, 1), new Date()),
        // randomDate(new Date(2020, 0, 2), new Date()),
        randomTotal(500, 450),
        null,
        categories[Math.floor(Math.random() * categories.length)],
        []
      )
    );
  }
  return receipts;
};

export const RECEIPTS = fillRandomReceipts(100);

export const TAGS = [
  new Tag(1, 'beer'),
  new Tag(2, 'shoes'),
  new Tag(3, 'sweets'),
  new Tag(4, 'water'),
  new Tag(5, 'nail care'),
];
