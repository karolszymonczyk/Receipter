import Receipt from '../models/receipt';

const RECEIPTS = [
  new Receipt(
    '1',
    'https://kasyfiskalne.pl/wp-content/uploads/2018/06/paragon-fiskalny-nip.jpg',
    'u1',
    'food',
    'Biedronka',
    null,
    new Date(2020, 2, 2),
    12.59
  ),
  new Receipt(
    '2',
    'https://kasyfiskalne.pl/wp-content/uploads/2018/06/paragon-fiskalny-nip.jpg',
    'u1',
    'entertainment',
    'Sushi-Bar',
    null,
    new Date(2020, 3, 2),
    22.99
  ),
  new Receipt(
    '3',
    'https://kasyfiskalne.pl/wp-content/uploads/2018/06/paragon-fiskalny-nip.jpg',
    'u2',
    'travel',
    'Orlen',
    null,
    new Date(2020, 2, 4),
    2.5
  ),
  new Receipt(
    '4',
    'https://www.fakturaxl.pl/img/paragon-wzor.png',
    'u3',
    'clothes',
    'Zara',
    new Date(2022, 12, 12),
    new Date(2020, 12, 12),
    199.99
  ),
  new Receipt(
    '5',
    'https://i.piccy.info/i9/e51742456cc503ef28c74d69b234c67e/1418393845/288913/798759/paragon_bdr.jpg',
    'u3',
    'clothes',
    'Zara',
    new Date(2022, 12, 12),
    new Date(2020, 12, 12),
    199.99
  ),
];

export default RECEIPTS;
