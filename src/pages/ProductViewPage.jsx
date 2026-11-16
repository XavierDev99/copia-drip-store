import React, { useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { BuyBox, Gallery, ProductListing, ProductOptions, Section } from '../components/Catalog';
import { products } from '../data/catalog';
import { useShop } from '../components/ShopProvider';
import { MessagePage } from './ExtraPages';

export default function ProductViewPage() {
  const { id } = useParams();
  const product = products.find(item => item.id === id);
  return product ? <ProductDetails key={id} product={product} /> : <MessagePage title="Produto não encontrado" />;
}

function ProductDetails({ product }) {
  const { dispatch } = useShop();
  const navigate = useNavigate();
  const [size, setSize] = useState('');
  const [color, setColor] = useState('');
  const [message, setMessage] = useState('');
  function buy() {
    if (!size || !color) {
      setMessage('Escolha um tamanho e uma cor.');
      return;
    }
    const { id, name, image, price, priceDiscount } = product;
    dispatch({ type: 'add', item: {
      key: [id, size, color].join(':'), id, name, image, price: priceDiscount ?? price, size, color,
    } });
    navigate('/carrinho');
  }

  return <div className="container page-content">
    <nav className="breadcrumb" aria-label="Caminho da página">
      <Link to="/">Home</Link><span aria-hidden="true">/</span><Link to="/products">Produtos</Link>
      <span aria-hidden="true">/</span><span aria-current="page">{product.name}</span>
    </nav>
    <div className="product-detail">
      <Gallery images={product.images} showThumbs width={700} height={570} radius="4px" />
      <div>
        <BuyBox {...product} onBuy={buy}>
          <ProductOptions title="Tamanho" options={product.sizes} radius="4px" shape="square" type="text" selected={size}
            onChange={value => { setSize(value); setMessage(''); }} />
          <ProductOptions title="Cor" options={product.colors} shape="circle" type="color" selected={color}
            onChange={value => { setColor(value); setMessage(''); }} />
        </BuyBox>
        <p role="status" className="buy-message">{message}</p>
      </div>
    </div>
    <Section title="Produtos recomendados" link={{ text: 'Ver todos', href: '/products' }}>
      <ProductListing products={products.filter(item => item.id !== product.id).slice(0, 4)} />
    </Section>
  </div>;
}




