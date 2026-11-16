import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { categories, media } from '../data/catalog';
import { useShop } from '../components/ShopProvider';
import { AddressFields, ProfileFields } from './ShopPages';

export function MessagePage({ title, children }) {
  return <div className="container page-content message-page">
    <h1>{title}</h1>{children && <p>{children}</p>}
    <Link className="button" to="/products">Ver produtos</Link>
  </div>;
}

export function CategoriesPage() {
  return <div className="container page-content message-page">
    <h1>Categorias</h1>
    <ul className="category-menu">{categories.map(category => <li key={category}>
      <Link to={'/products?' + new URLSearchParams({ category })}>{category}</Link>
    </li>)}</ul>
  </div>;
}

export function AccountPage({ signup = false }) {
  const { profile, dispatch } = useShop();
  const navigate = useNavigate();
  const [message, setMessage] = useState('');
  function submit(event) {
    event.preventDefault();
    const fields = Object.fromEntries(new FormData(event.currentTarget));
    if (signup) {
      dispatch({ type: 'profile', profile: fields });
    } else {
      if (profile?.email.toLowerCase() !== fields.email.trim().toLowerCase()) {
        setMessage('Use o e-mail do perfil criado neste navegador.');
        return;
      }
      dispatch({ type: 'sign-in' });
    }
    navigate('/conta');
  }

  return <div className="account-page">
    <div className="container auth-layout"><div className="account-panel">
      <h1>{signup ? 'Crie sua conta' : 'Acesse sua conta'}</h1>
      <p>{signup ? 'Já tem uma conta?' : 'Novo cliente?'}{' '}
        <Link className="text-link" to={signup ? '/entrar' : '/cadastro'}>{signup ? 'Faça login' : 'Crie sua conta'}</Link>
      </p>
      <p>Conta demonstrativa neste navegador. Use dados fictícios.</p>
      <form onSubmit={submit}>
        {signup ? <>
          <h2>Informações pessoais</h2><ProfileFields />
          <h2>Informações de entrega</h2><AddressFields />
          <label><span><input type="checkbox" name="offers" /> Quero receber ofertas</span></label>
        </> : <label>E-mail<input name="email" type="email" required autoComplete="email" /></label>}
        <button className="button">{signup ? 'Criar conta' : 'Acessar conta'}</button>
      </form>
      {message && <p role="status">{message}</p>}
    </div><div className="auth-art" aria-hidden="true">
      <img src={media('product-thumb-2.jpeg')} alt="" />
      <img src={media('product-thumb-3.jpeg')} alt="" />
    </div></div>
  </div>;
}



