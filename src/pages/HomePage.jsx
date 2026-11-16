import React from 'react';
import { Link } from 'react-router-dom';
import { Gallery, ProductListing, Section } from '../components/Catalog';
import { categories, homeSlides, media, products } from '../data/catalog';

export default function HomePage() {
  return <>
    
    <div className="home-hero">
      <Gallery className="home-gallery" images={homeSlides} width={1440} height={681} />
      <div className="hero-copy">
        <p>Melhores ofertas personalizadas</p>
        <h1>Queima de estoque</h1>
        <Link className="button" to="/products">Ver ofertas</Link>
      </div>
    </div>
    <div className="container page-content">
      <Section title="Coleções em destaque" titleAlign="center">
        <div className="collections">{[1, 2, 3].map(number => (
          <Link key={number} to="/products" aria-label={'Ver produtos da coleção ' + number}>
            <img src={media('collection-' + number + '.png')} alt={'Coleção ' + number} loading="lazy" />
          </Link>
        ))}</div>
        <div className="category-links">{categories.map((name, i) => (
          <Link key={name} to={'/products?' + new URLSearchParams({ category: name })}>
            <CategoryIcon index={i} />{name}
          </Link>
        ))}</div>
      </Section>
      <Section title="Produtos em alta" link={{ text: 'Ver todos', href: '/products' }}>
        <ProductListing products={products.slice(0, 8)} />
      </Section>
    </div>
  </>;
}

const paths = [
  'M8 4 3 7l2 5 3-1v9h8v-9l3 1 2-5-5-3c-1 3-7 3-8 0Z',
  'M7 3h10l3 17h-5l-3-10-3 10H4L7 3Z',
  'M3 14a9 9 0 0 1 18 0H3Zm0 0 2 3h13',
  'M4 14v-2a8 8 0 0 1 16 0v2M4 14h4v6H6a2 2 0 0 1-2-2v-4Zm16 0h-4v6h2a2 2 0 0 0 2-2v-4Z',
  'M4 14V7l4 2 4 4 7 2a2 2 0 0 1 1 2v2H4v-5Zm0 2h16m-8-3 2-2',
];

function CategoryIcon({ index }) {
  return <span className="category-icon"><svg viewBox="0 0 24 24" width="37" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d={paths[index]} /></svg></span>;
}

