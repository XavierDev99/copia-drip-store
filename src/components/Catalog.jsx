import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { icon, money } from '../data/catalog';

export function Section({ title, titleAlign = 'left', link, children }) {
  return <section className="section">
    <div className={'section-heading ' + titleAlign}>
      <h2>{title}</h2>
      {link && <Link to={link.href}>{link.text} <span aria-hidden="true">→</span></Link>}
    </div>
    {children}
  </section>;
}

function Price({ price, priceDiscount }) {
  return <div className="prices">
    {priceDiscount != null && <del>{money.format(price)}</del>}
    <strong>{money.format(priceDiscount ?? price)}</strong>
  </div>;
}

export function ProductCard({ id, image, name, category, price, priceDiscount }) {
  return <article className="card">
    <Link to={'/product/' + id}>
      <div className="card-image">
        {priceDiscount != null && <span className="discount">{Math.round((1 - priceDiscount / price) * 100)}% OFF</span>}
        <img src={image} alt={name} width="292" height="321" loading="lazy" />
      </div>
      <small>{category}</small>
      <h3>{name}</h3>
      <Price price={price} priceDiscount={priceDiscount} />
    </Link>
  </article>;
}

export function ProductListing({ products }) {
  return <div className="product-grid">{products.map(product => <ProductCard key={product.id} {...product} />)}</div>;
}

export function Gallery({ className = '', width, height, radius = '0px', showThumbs = false, images }) {
  const [active, setActive] = useState(0);
  return <div className={'gallery ' + className} style={{ maxWidth: width, '--gallery-radius': radius }}>
    <div className="gallery-window" style={{ aspectRatio: width + ' / ' + height }}>
      <div className="gallery-track" style={{ transform: 'translateX(-' + active * 100 + '%)' }}>
        {images.map(({ src, alt }, index) => <img key={src} src={src} alt={alt ?? 'Foto ' + (index + 1)} aria-hidden={index !== active} loading={index === 0 ? 'eager' : 'lazy'} />)}
      </div>
      <button className="gallery-arrow prev" type="button" aria-label="Imagem anterior" disabled={active === 0} onClick={() => setActive(active - 1)}><img src={icon('arrow-left')} alt="" /></button>
      <button className="gallery-arrow next" type="button" aria-label="Próxima imagem" disabled={active === images.length - 1} onClick={() => setActive(active + 1)}><img src={icon('arrow-right')} alt="" /></button>
    </div>
    {images.length > 1 && <div className={showThumbs ? 'thumbs' : 'dots'}>
      {images.map(({ src }, index) => <button key={src} type="button" aria-label={'Ver imagem ' + (index + 1)} aria-pressed={index === active} onClick={() => setActive(index)}>
        {showThumbs && <img src={src} alt="" loading="lazy" />}
      </button>)}
    </div>}
  </div>;
}

export function FilterGroup({ title, inputType, options, selected, onChange }) {
  return <fieldset className="filter-group"><legend>{title}</legend>
    {options.map(({ text, value = text }) => <label key={value}>
      <input type={inputType} name={title} value={value} checked={selected.includes(value)} onChange={() => onChange(value)} />
      {text}
    </label>)}
  </fieldset>;
}

export function ProductOptions({ title, options, radius, shape, type, selected, onChange }) {
  return <fieldset className="product-options"><legend>{title}</legend>
    {options.map(option => <button type="button" key={option} className={shape}
      style={{ borderRadius: shape === 'square' ? radius : undefined, backgroundColor: type === 'color' ? option : undefined }}
      aria-label={type === 'color' ? 'Cor ' + option : 'Tamanho ' + option} aria-pressed={selected === option}
      onClick={() => onChange(option)}>{type === 'text' && option}</button>)}
  </fieldset>;
}

export function BuyBox({ name, reference, stars, rating, price, priceDiscount, description, children, onBuy }) {
  return <section className="buy-box">
    <h1>{name}</h1>
    <p className="reference">Ref. {reference}</p>
    <div className="reviews"><span className="stars" aria-hidden="true">★★★★★</span>
      <span className="score">{stars.toLocaleString('pt-BR')} <img src={icon('star-icon')} alt="estrelas" /></span>
      <span>({rating} avaliações)</span>
    </div>
    <Price price={price} priceDiscount={priceDiscount} />
    <h2>Descrição do produto</h2>
    <p>{description}</p>
    {children}
    <button className="button buy" type="button" onClick={onBuy}>Comprar</button>
  </section>;
}
