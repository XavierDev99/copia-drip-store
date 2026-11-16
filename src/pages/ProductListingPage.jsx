import React, { useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { FilterGroup, ProductListing, Section } from '../components/Catalog';
import { categories, products } from '../data/catalog';

const groups = [
  ['Marca', 'brand', 'checkbox', ['Adidas', 'K-Swiss', 'Nike', 'Puma']],
  ['Categoria', 'category', 'checkbox', categories],
  ['Gênero', 'gender', 'checkbox', ['Masculino', 'Feminino', 'Unissex']],
  ['Estado', 'condition', 'radio', ['Novo', 'Usado']],
];
const normalize = value => value.normalize('NFD').replace(/\p{Diacritic}/gu, '').toLowerCase();

export default function ProductListingPage() {
  const [params, setParams] = useSearchParams();
  const [order, setOrder] = useState('');
  const term = params.get('filter')?.trim() ?? '';
  const results = products.filter(product => {
    const matchesSearch = normalize([product.name, product.brand, product.category].join(' ')).includes(normalize(term));
    return matchesSearch && groups.every(([, field]) => {
      const selected = params.getAll(field);
      return selected.length === 0 || selected.includes(product[field]);
    });
  });
  if (order) {
    results.sort((a, b) => ((a.priceDiscount ?? a.price) - (b.priceDiscount ?? b.price)) * (order === 'asc' ? 1 : -1));
  }

  function updateFilter(field, type, value) {
    const next = new URLSearchParams(params);
    const current = next.getAll(field);
    next.delete(field);
    if (type === 'checkbox') current.filter(item => item !== value).forEach(item => next.append(field, item));
    if (!current.includes(value)) next.append(field, value);
    setParams(next);
  }

  const title = (term ? 'Resultados para “' + term + '”' : 'Resultados') + ' — ' + results.length + (results.length === 1 ? ' produto' : ' produtos');
  return <div className="container page-content">
    <h1 className="sr-only">Listagem de produtos</h1>
    <div className="listing-layout">
      <aside aria-label="Refinar resultados">
        <label className="sort"><b>Ordenar por</b>
          <select value={order} onChange={event => setOrder(event.target.value)}>
            <option value="">Padrão</option><option value="asc">Menor preço</option><option value="desc">Maior preço</option>
          </select>
        </label>
        <div className="filters"><h2>Filtrar por</h2><hr />
          {groups.map(([label, field, type, options]) => <FilterGroup key={field} title={label} inputType={type}
            options={options.map(text => ({ text }))} selected={params.getAll(field)}
            onChange={value => updateFilter(field, type, value)} />)}
          {params.size > 0 && <Link to="/products" className="text-link">Limpar busca e filtros</Link>}
        </div>
      </aside>
      <div>
        <Section title={title}>
          {results.length ? <ProductListing products={results} /> : <div className="empty">
            <p>Nenhum produto corresponde à sua busca.</p><Link to="/products" className="text-link">Ver todos os produtos</Link>
          </div>}
        </Section>
      </div>
    </div>
  </div>;
}
