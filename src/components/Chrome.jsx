import React, { useState } from 'react';
import { Link, NavLink, useLocation, useNavigate } from 'react-router-dom';
import { icon, money } from '../data/catalog';
import { useShop } from './ShopProvider';
import { payable } from '../data/shop';

export function Logo({ footer = false }) {
  return <Link to="/" aria-label="Digital Store, início">
    <img className="logo" src={icon(footer ? 'logo-footer' : 'logo-header')} width="253" height="44" alt="Digital Store" />
  </Link>;
}

export function Header() {
  const location = useLocation();
  const [panel, setPanel] = useState(null);
  const active = panel?.location === location.key ? panel.name : null;
  const toggle = name => setPanel(active === name ? null : { name, location: location.key });
  const navigate = useNavigate();
  const { cart, signedIn, profile } = useShop();
  const count = cart.reduce((sum, item) => sum + item.quantity, 0);
  function search(event) {
    event.preventDefault();
    const term = new FormData(event.currentTarget).get('search').trim();
    navigate(term ? '/products?' + new URLSearchParams({ filter: term }) : '/products');
  }
  if (['/entrar', '/cadastro'].includes(location.pathname)) {
    return <header className="site-header"><div className="container auth-header"><Logo /></div></header>;
  }
  return <header className="site-header" onKeyDown={event => { if (event.key === 'Escape') setPanel(null); }}>
    <div className="container header-top" data-panel={active ?? ''}>
      <button className="mobile-control" type="button" aria-label="Menu" aria-expanded={active === 'menu'} onClick={() => toggle('menu')}>☰</button>
      <Logo />
      <form className="search" role="search" onSubmit={search}>
        <input type="search" name="search" placeholder="Pesquisar produto..." aria-label="Pesquisar produto" />
        <button aria-label="Buscar"><svg viewBox="0 0 24 24" width="24" fill="none" stroke="currentColor" strokeWidth="1.7"><circle cx="10.5" cy="10.5" r="6.5" /><path d="m16 16 5 5" /></svg></button>
      </form>
      <div className="account-links">
        <button className="mobile-control" type="button" aria-label="Mostrar busca" aria-expanded={active === 'search'} onClick={() => toggle('search')}>⌕</button>
        {!signedIn && <Link className="signup" to="/cadastro">Cadastre-se</Link>}
        <Link className="button login" to={signedIn ? "/conta" : "/entrar"}>{signedIn ? ("Olá, " + profile.name.split(" ")[0]) : "Entrar"}</Link>
        <div className="mini-cart">
          <button className="cart-icon" type="button" aria-expanded={active === 'cart'} onClick={() => toggle('cart')} aria-label={'Carrinho de compras, ' + count + ' itens'}>
            <img width="24" height="24" src={icon('mini-cart')} alt="" />
            {count > 0 && <span>{count}</span>}
          </button>
          {active === 'cart' && <MiniCart cart={cart} close={() => setPanel(null)} />}
        </div>
      </div>
    </div>
    <nav className={"container nav" + (active === "menu" ? " is-open" : "")} aria-label="Navegação principal">
      <NavLink to="/" end>Home</NavLink>
      <NavLink to="/products">Produtos</NavLink>
      <NavLink to="/categorias">Categorias</NavLink>
      <NavLink to="/pedidos">Meus Pedidos</NavLink>
      <NavLink className="mobile-control" to={signedIn ? "/conta" : "/entrar"}>{signedIn ? "Minha conta" : "Entrar"}</NavLink>
      {!signedIn && <NavLink className="mobile-control" to="/cadastro">Cadastre-se</NavLink>}
    </nav>
  </header>;
}

function MiniCart({ cart, close }) {
  const { dispatch, coupon } = useShop();
  return <section className="mini-cart-panel" aria-label="Meu carrinho">
    <h2>Meu Carrinho</h2>
    {cart.length ? <ul>{cart.map(item => <li key={item.key}>
      <img src={item.image} alt="" />
      <div><Link to={'/product/' + item.id} onClick={close}>{item.name}</Link><p>{item.quantity} × {money.format(item.price)}</p></div>
    </li>)}</ul> : <p>Seu carrinho está vazio.</p>}
    <p className="mini-total">Valor total: <strong>{money.format(payable(cart, coupon))}</strong></p>
    <div className="mini-actions">
      {cart.length > 0 && <button type="button" className="plain-link" onClick={() => dispatch({ type: 'clear' })}>Esvaziar</button>}
      <Link className="button" to="/carrinho" onClick={close}>Ver carrinho</Link>
    </div>
  </section>;
}

export function Information({ title, informations }) {
  return <div><h2>{title}</h2><ul>{informations.map(({ text, link }) => (
    <li key={text}><Link to={link}>{text}</Link></li>
  ))}</ul></div>;
}

const info = ['Sobre Drip Store', 'Segurança', 'Wishlist', 'Blog', 'Trabalhe conosco', 'Meus Pedidos']
  .map((text, i) => ({ text, link: i === 5 ? '/pedidos' : '/informacoes/' + (i + 1) }));
const categories = ['Camisetas', 'Calças', 'Bonés', 'Headphones', 'Tênis']
  .map(text => ({ text, link: '/products?' + new URLSearchParams({ category: text }) }));
const social = [['facebook', 'https://www.facebook.com/'], ['instagram', 'https://www.instagram.com/'], ['twitter', 'https://x.com/']];

export function Footer() {
  return <footer className="site-footer"><div className="container">
    <div className="footer-columns">
      <div><Logo footer /><p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</p>
        <div className="social">{social.map(([name, href]) => <a key={name} href={href}><img src={icon(name)} alt={name} width="20" height="20" /></a>)}</div>
      </div>
      <Information title="Informação" informations={info} />
      <Information title="Categorias" informations={categories} />
      <div><h2>Contato</h2><p>Av. Santos Dumont, 1510<br />Aldeota, Fortaleza – CE</p><a href="tel:+558530513411">(85) 3051-3411</a></div>
    </div>
    <hr /><p className="copyright">© {new Date().getFullYear()} Digital Store</p>
  </div></footer>;
}






















