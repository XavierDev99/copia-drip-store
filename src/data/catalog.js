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

const entries = [
  ['K-Swiss V8 - Masculino', 'K-Swiss', 'Tênis', 200, 149.90, 1, 'Masculino'],
  ['Air Street - Branco', 'Nike', 'Tênis', 249.90, 189.90, 2, 'Unissex'],
  ['Runner Urban', 'Adidas', 'Tênis', 219.90, null, 3, 'Feminino'],
  ['Court Classic', 'Puma', 'Tênis', 299.90, 239.90, 4, 'Unissex'],
  ['Street Sport', 'K-Swiss', 'Tênis', 179.90, null, 5, 'Masculino'],
  ['Air Street - Edição urbana', 'Nike', 'Tênis', 279.90, 229.90, 2, 'Feminino'],
  ['Runner Urban - Clássico', 'Adidas', 'Tênis', 199.90, 159.90, 3, 'Unissex'],
  ['Court Classic - Casual', 'Puma', 'Tênis', 249.90, null, 4, 'Masculino'],
];

export const products = entries.map(([name, brand, category, price, priceDiscount, thumb, gender], i) => {
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

