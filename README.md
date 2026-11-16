# Drip Store

Vitrine responsiva de uma loja de moda, desenvolvida em React para o projeto front end do curso fullstack online da iel.

**Integrante:** Jessé Almeida Medeiros

## Como executar

Instale o Node.js 22 LTS ou mais recente e abra um terminal na pasta que contém o arquivo `package.json`.

```sh
npm install
npm run dev
se não rodar com os dois comandos acima, use esses: 
npm.cmd install
npm.cmd run dev

```

Abra o endereço exibido no terminal. Para gerar uma versão de produção, execute `npm run build`. Para conferir essa versão localmente, execute `npm run preview`.

## Como testar

1. Na página inicial, navegue pelas imagens, veja as coleções e os oito produtos em alta.
2. Digite **Nike** na busca do cabeçalho e pressione Enter. A rota muda para `/products?filter=Nike`.
3. Em **Produtos**, veja como os filtros mudam a quantidade de resultados e ordene pelo menor preço. Limpe a busca para voltar ao catálogo inteiro.
4. Abra o primeiro tênis e alterne entre as miniaturas. Escolha o tamanho e a cor e clique em **Comprar** para demonstrar a validação.
5. Teste no celular

## Como o código funciona

- `src/App.jsx` associa cada endereço a uma página. A documentação usa tanto `/products` quanto `/produtos`, então ambos abrem o catálogo.
- `src/pages/Layout.jsx` renderiza o cabeçalho, a página atual e o rodapé. O conteúdo da página chega ao layout pela prop `children`.
- `src/pages/ProductListingPage.jsx` lê a busca e os filtros da URL. A lista usa `filter` e a ordenação considera o preço com desconto quando disponível.
- `src/components/Catalog.jsx` reúne os componentes de seção, cartão, listagem, galeria, filtros, opções e caixa de compra. A galeria guarda a imagem atual com `useState`.
- `src/data/catalog.js` transforma os dados da API nos produtos da vitrine. O catálogo de exemplo fica em `src/data/catalogEntries.js`. Para praticar, altere o nome ou preço de um produto e confira a mudança nas três páginas.

O carrinho, o perfil e os pedidos persistem neste navegador via localStorage. O cupom de teste DRIP10 aplica 10% de desconto. O frete é gratuito na simulação. O acesso é uma simulação por e-mail e o pagamento é demonstrativo. Use dados fictícios. A vitrine consulta o endpoint HTTP `GET /api/products`. No desenvolvimento, o Vite serve esse endpoint. No deploy, a Vercel executa a função em `api/products.js`. Se a API ficar indisponível, a loja usa os mesmos dados de exemplo como reserva.


## Referências

- [Documentação e imagens fornecidas pelo curso](https://github.com/digitalcollegebr/projeto-digital-store)
- [Design do projeto no Figma](https://www.figma.com/design/nUk0ihM3x4u8JQtxUoAEJf/DRIP-STORE---DIGITAL-COLLEGE--Copy-?node-id=22-30&p=f)
- [Documentação do React](https://react.dev/)


