import { entries } from './catalogEntries.js';

const source = import.meta.env.BASE_URL;
export const media = (name) => source + name;
export const icon = (name) => source + 'assets/' + name + '.svg';
export const money = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' });
export const categories = ['Camisetas', 'Calças', 'Bonés', 'Headphones', 'Tênis'];
export const homeSlides = Array.from({ length: 8 }, (_, i) => ({
  src: media('home-slide-' + (i + 1) + '.jpeg'),
  alt: 'Campanha Drip Store ' + (i + 1),
}));
const gallery = Array.from({ length: 5 }, (_, i) => ({
  src: media('produc-image-' + (i + 1) + '.jpeg'),
}));

const buildProducts = rows => rows.map(([name, brand, category, price, priceDiscount, thumb, gender], i) => {
  const image = media('product-thumb-' + thumb + '.jpeg');
  return {
    id: String(i + 1), name, brand, category, price, priceDiscount, image, gender,
    condition: i === 6 ? 'Usado' : 'Novo',
    reference: 'DRIP-' + String(i + 1).padStart(3, '0'),
    stars: 4.7, rating: 90 - i * 5,
    description: 'Tênis casual com visual urbano, fechamento em cadarço e solado para uso no dia a dia.',
    images: [{ src: image, alt: name }, ...(i === 0 ? gallery : [])],
    sizes: ['39', '40', '41', '42', '43'],
    colors: ['#6FEEFF', '#FF6969', '#5E5E5E', '#6D70B7'],
  };
});

export let products = buildProducts(entries);

export async function loadCatalog() {
  try {
    const response = await fetch('/api/products', { signal: AbortSignal.timeout(3500) });
    if (!response.ok) throw new Error('HTTP ' + response.status);
    const { entries: rows } = await response.json();
    if (!Array.isArray(rows) || !rows.length || rows.some(row => !Array.isArray(row) || row.length !== 7)) {
      throw new Error('Formato de catálogo inválido');
    }
    products = buildProducts(rows);
    return true;
  } catch (error) {
    console.warn('API de produtos indisponível. Usando o catálogo local.', error);
    return false;
  }
}
