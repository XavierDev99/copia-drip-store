import React, { useState } from 'react';
import { Link, NavLink, useNavigate, useParams } from 'react-router-dom';
import { useShop } from '../components/ShopProvider';
import { money, products } from '../data/catalog';
import { couponDiscount, payable, total } from '../data/shop';

import { ProductListing, Section } from '../components/Catalog';

function Summary({ cart, children }) {
  const { coupon } = useShop();
  return <aside className="shop-panel summary">
    <h2>Resumo</h2>
    <p><span>Subtotal</span><span>{money.format(total(cart))}</span></p>
    <p><span>Frete</span><span>Grátis</span></p>
    <p><span>Desconto</span><span>{money.format(couponDiscount(cart, coupon))}</span></p>
    <p className="shop-total"><strong>Total</strong><strong>{money.format(payable(cart, coupon))}</strong></p>
    {children}
  </aside>;
}

export function CartPage() {
  const { cart, coupon, dispatch } = useShop();
  const [couponMessage, setCouponMessage] = useState('');
  const [shippingMessage, setShippingMessage] = useState('');
  function applyCoupon(event) {
    event.preventDefault();
    const valid = new FormData(event.currentTarget).get('coupon').trim().toUpperCase() === 'DRIP10';
    dispatch({ type: 'coupon', applied: valid });
    setCouponMessage(valid ? 'Cupom DRIP10 aplicado.' : 'Cupom inválido. Teste DRIP10.');
  }
  function quantity(item, value) {
    dispatch({ type: 'quantity', key: item.key, quantity: value });
  }
  return <div className="container page-content shop-layout">
    <section className="shop-panel">
      <div className="cart-head"><h1>Meu carrinho</h1>{cart.length > 0 && <><span>Quantidade</span><span>Unitário</span><span>Total</span></>}</div>
      {cart.length ? <ul className="cart-list">{cart.map(item => <li className="cart-line" key={item.key}>
        <img src={item.image} alt="" />
        <div><Link to={'/product/' + item.id}><strong>{item.name}</strong></Link>
          <p>Tamanho {item.size} · <span className="swatch" style={{ background: item.color }} aria-label={'Cor ' + item.color} /></p>
          <button className="plain-link" onClick={() => quantity(item, 0)}>Remover</button>
        </div>
        <div className="quantity" aria-label={'Quantidade de ' + item.name}>
          <button disabled={item.quantity === 1} onClick={() => quantity(item, item.quantity - 1)} aria-label="Diminuir quantidade">−</button>
          <span>{item.quantity}</span>
          <button onClick={() => quantity(item, item.quantity + 1)} aria-label="Aumentar quantidade">+</button>
        </div>
        <span className="unit-price">{money.format(item.price)}</span>
        <strong>{money.format(total([item]))}</strong>
      </li>)}</ul> : <p>Seu carrinho está vazio.</p>}
      {cart.length ? <div className="cart-tools">
        <form onSubmit={applyCoupon}><label htmlFor="coupon">Cupom de desconto</label>
          <div><input id="coupon" name="coupon" placeholder="Insira seu código" defaultValue={coupon ? 'DRIP10' : ''} required /><button>OK</button></div>
          <p role="status">{couponMessage}</p>
        </form>
        <form onSubmit={event => { event.preventDefault(); setShippingMessage('Frete grátis para o CEP informado nesta simulação.'); }}>
          <label htmlFor="shipping">Calcular frete</label>
          <div><input id="shipping" placeholder="Insira seu CEP" inputMode="numeric" pattern="[0-9]{5}-?[0-9]{3}" required /><button>OK</button></div>
          <p role="status">{shippingMessage}</p>
        </form>
      </div> : <Link className="text-link" to="/products">Continuar comprando</Link>}
    </section>
    {cart.length > 0 && <Summary cart={cart}><Link className="button amber" to="/finalizar-compra">Continuar</Link></Summary>}
    <div className="cart-related"><Section title="Produtos relacionados" link={{ text: 'Ver todos', href: '/products' }}>
      <ProductListing products={products.filter(product => !cart.some(item => item.id === product.id)).slice(0, 4)} />
    </Section></div>
  </div>;
}

export function ProfileFields({ profile = {} }) {
  return <div className="fields">
    <label>Nome completo<input name="name" defaultValue={profile.name} autoComplete="name" required /></label>
    <label>CPF<input name="cpf" defaultValue={profile.cpf} inputMode="numeric" placeholder="000.000.000-00" pattern="[0-9]{3}[.]?[0-9]{3}[.]?[0-9]{3}-?[0-9]{2}" required /></label>
    <label>E-mail<input name="email" type="email" defaultValue={profile.email} autoComplete="email" required /></label>
    <label>Celular<input name="phone" type="tel" defaultValue={profile.phone} autoComplete="tel" required /></label>
  </div>;
}

export function AddressFields({ profile = {} }) {
  return <div className="fields">
    <label>Endereço<input name="address" defaultValue={profile.address} autoComplete="address-line1" required /></label>
    <label>Bairro<input name="district" defaultValue={profile.district} required /></label>
    <label>Cidade<input name="city" defaultValue={profile.city} autoComplete="address-level2" required /></label>
    <label>CEP<input name="zip" defaultValue={profile.zip} inputMode="numeric" autoComplete="postal-code" pattern="[0-9]{5}-?[0-9]{3}" title="Digite um CEP com oito dígitos" required /></label>
    <label>Complemento<input name="extra" defaultValue={profile.extra} autoComplete="address-line2" /></label>
  </div>;
}

export function CheckoutPage() {
  const { cart, profile, signedIn, dispatch, payment: preferredPayment } = useShop();
  const navigate = useNavigate();
  const [payment, setPayment] = useState((signedIn && preferredPayment) || 'Cartão de crédito');
  function submit(event) {
    event.preventDefault();
    if (!cart.length) return;
    const form = new FormData(event.currentTarget);
    const id = Date.now().toString(36) + '-' + Math.random().toString(36).slice(2, 8);
    const details = Object.fromEntries(form);
    const { cardName, cardLast4, expiry, cvv, payment, ...customer } = details;
    dispatch({ type: 'order', order: { id, date: new Date().toISOString(), payment, customer, cardName, cardLast4 } });
    navigate('/compra-realizada/' + id, { replace: true });
  }
  if (!cart.length) return <div className="container page-content"><h1>Finalizar compra</h1><p>Seu carrinho está vazio.</p><Link className="text-link" to="/products">Ver produtos</Link></div>;
  const saved = signedIn ? profile ?? {} : {};
  return <div className="container page-content">
    <h1 className="shop-title">Finalizar compra</h1>
    <form onSubmit={submit} className="shop-layout checkout-layout">
      <div className="shop-flow">
        <section className="shop-panel"><h2>Informações pessoais</h2><p>Compra demonstrativa. Use dados fictícios.</p><ProfileFields profile={saved} /></section>
        <section className="shop-panel"><h2>Informações de entrega</h2><AddressFields profile={saved} /></section>
        <section className="shop-panel"><h2>Pagamento</h2><fieldset className="payments" onChange={event => setPayment(event.target.value)}>
          <legend>Forma de pagamento simulada</legend>
          <label><input type="radio" name="payment" value="Cartão de crédito" defaultChecked={payment === "Cartão de crédito"} /> Cartão de crédito</label>
          <label><input type="radio" name="payment" value="Boleto bancário" defaultChecked={payment === "Boleto bancário"} /> Boleto bancário</label>
          <label><input type="radio" name="payment" value="Pix" defaultChecked={payment === "Pix"} /> Pix</label>
        </fieldset>
        {payment === 'Cartão de crédito' && <>
          <p>Cartão de teste. Use dados fictícios.</p>
          <div className="fields card-fields">
            <label>Nome no cartão de teste<input name="cardName" placeholder="Insira o nome do cartão" required /></label>
            <label>Últimos 4 dígitos de teste<input name="cardLast4" inputMode="numeric" pattern="[0-9]{4}" maxLength="4" placeholder="0000" required /></label>
            <label>Validade de teste<input name="expiry" placeholder="MM/AA" pattern="(0[1-9]|1[0-2])/[0-9]{2}" required /></label>
            <label>CVV de teste<input name="cvv" inputMode="numeric" pattern="[0-9]{3}" maxLength="3" placeholder="000" required /></label>
          </div>
        </>}
        </section>
      </div>
      <Summary cart={cart}><button className="button amber">Realizar pagamento</button></Summary>
    </form>
  </div>;
}

function Order({ order }) {
  const first = order.items[0];
  return <article className="order">
    <img src={first.image} alt="" />
    <div><small>Pedido nº {order.id.toUpperCase()}</small>
      <Link to={'/compra-realizada/' + order.id}><strong>{first.name}</strong></Link>
      {order.items.length > 1 && <small> + {order.items.length - 1} produto(s)</small>}
    </div>
    <div className="order-status"><small>Status</small><span>Finalizado</span></div>
  </article>;
}
function CustomerDetails({ customer }) {
  const groups = [
    ['Informações pessoais', [['Nome', customer.name], ['CPF', customer.cpf], ['E-mail', customer.email], ['Celular', customer.phone]]],
    ['Informações de entrega', [['Endereço', customer.address], ['Bairro', customer.district], ['Cidade', customer.city], ['CEP', customer.zip], ['Complemento', customer.extra]]],
  ];
  return groups.map(([title, fields]) => <section className="receipt-section" key={title}>
    <h2>{title}</h2><dl className="info-pairs">{fields.filter(([, value]) => value).map(([label, value]) =>
      <React.Fragment key={label}><dt>{label}</dt><dd>{value}</dd></React.Fragment>
    )}</dl>
  </section>);
}

export function SuccessPage() {
  const { id } = useParams();
  const { orders } = useShop();
  const order = orders.find(item => item.id === id);
  return <div className="container page-content">
    <section className="shop-panel success-panel">
      {order ? <><span className="success-mark" aria-hidden="true">🎉</span><h1>Compra realizada<br />com sucesso!</h1>
      <div className="receipt">
        {order.customer && <CustomerDetails customer={order.customer} />}
        <section className="receipt-section"><h2>Informações de pagamento</h2>
          <p>{order.payment}</p>{order.cardLast4 && <p>{order.cardName} · Final {order.cardLast4}</p>}
        </section>
        <section className="receipt-section"><h2>Resumo da compra</h2>
          <ul className="receipt-items">{order.items.map(item => <li key={item.key}>
            <img src={item.image} alt="" /><strong>{item.quantity} × {item.name}</strong>
          </li>)}</ul>
        </section>
        <div className="shop-total receipt-total"><strong>Total</strong><strong>{money.format(order.total)}</strong></div>
        <button type="button" className="plain-link print-receipt" onClick={() => window.print()}>Imprimir recibo</button>
      </div></> : <h1>Pedido não encontrado</h1>}
      <Link className="button amber receipt-home" to="/">Voltar para Home</Link>
      <Link className="text-link" to="/pedidos">Ver meus pedidos</Link>
    </section>
  </div>;
}

export function CustomerLayout({ title, children }) {
  const { signedIn, dispatch } = useShop();
  return <div className="container page-content shop-layout customer-layout">
    <nav className="shop-panel customer-nav" aria-label="Minha conta">
      <NavLink to="/conta" end>Meu perfil</NavLink>
      <NavLink to="/pedidos">Meus pedidos</NavLink>
      <NavLink to="/conta/informacoes">Minhas informações</NavLink>
      <NavLink to="/conta/pagamento">Métodos de pagamento</NavLink>
      {signedIn && <button className="plain-link" onClick={() => dispatch({ type: 'sign-out' })}>Sair</button>}
    </nav>
    <section className="shop-panel"><h1>{title}</h1>{children}</section>
  </div>;
}

export function OrdersPage() {
  const { orders } = useShop();
  return <CustomerLayout title="Meus pedidos">
    {orders.length ? orders.map(order => <Order key={order.id} order={order} />) : <p>Você ainda não fez nenhum pedido neste navegador.</p>}
  </CustomerLayout>;
}

export function ProfilePage({ information = false, edit = false }) {
  const { profile, signedIn, dispatch } = useShop();
  const navigate = useNavigate();
  function save(event) {
    event.preventDefault();
    dispatch({ type: 'profile', profile: Object.fromEntries(new FormData(event.currentTarget)) });
    navigate('/conta/informacoes');
  }

  return <CustomerLayout title={information ? 'Minhas informações' : 'Meu perfil'}>
    {!signedIn ? <p><Link className="text-link" to="/entrar">Entre</Link> ou <Link className="text-link" to="/cadastro">crie uma conta demonstrativa</Link> para editar seu perfil.</p> :
      edit ? <form className="shop-flow" onSubmit={save}>
        <p>Use dados fictícios. O perfil fica neste navegador.</p>
        <h2>Informações pessoais</h2><ProfileFields profile={profile} />
        <h2>Informações de entrega</h2><AddressFields profile={profile} />
        <button className="button">Salvar informações</button>
      </form> : <>
        <Link className="text-link profile-edit" to="/conta/informacoes/editar">Editar</Link>
        <CustomerDetails customer={profile} />
      </>}
  </CustomerLayout>;
}

































export function PaymentPage() {
  const { signedIn, payment, dispatch } = useShop();
  const [saved, setSaved] = useState(false);
  return <CustomerLayout title="Métodos de pagamento">
    {signedIn ? <form className="fields" onSubmit={event => {
      event.preventDefault();
      dispatch({ type: 'payment', payment: new FormData(event.currentTarget).get('method') });
      setSaved(true);
    }}>
      <label>Forma preferida<select name="method" defaultValue={payment ?? ''} required onChange={() => setSaved(false)}>
        <option value="">Selecione</option><option>Cartão de crédito</option><option>Boleto bancário</option><option>Pix</option>
      </select></label>
      <button className="button">Salvar preferência</button>
      {saved && <p role="status">Preferência salva.</p>}
    </form> : <Link className="text-link" to="/entrar">Acesse sua conta demonstrativa</Link>}
  </CustomerLayout>;
}






