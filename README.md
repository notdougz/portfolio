# Portfólio · Douglas Oliveira

Meu espaço para mostrar o que construo, por onde passei e o que me move dentro e fora da tecnologia. Sou desenvolvedor full-stack com foco em back-end e IA aplicada a produtos. A versão atual do site está em **[techdoug.me](https://www.techdoug.me/)**, também disponível [em inglês](https://www.techdoug.me/en.html).

O portfólio reúne minha trajetória na Humana AI, Appen Seguros e em projetos independentes; apresenta trabalhos como o sistema de agendamentos para barbearia e a First API; e conta um pouco da minha relação com o Ultimate Frisbee. O avatar ilustrado, a timeline e a navegação por projetos foram desenhados para dar personalidade à página sem atrapalhar a leitura.

## Rodando localmente

Requer Node.js 22.12+ ou 24 LTS.

```sh
npm ci
npm run dev
```

Para conferir a versão de produção:

```sh
npm run check
npm run build
npm run preview
```

O build fica em `dist/`. O projeto usa Vite e pode ser publicado como site estático; `vercel.json` define o build na Vercel.

## Como foi feito

- **Base:** HTML semântico, CSS responsivo e JavaScript em módulos. Há páginas completas em português (`index.html`) e inglês (`en.html`), além de currículos nos dois idiomas.
- **Movimento:** GSAP e ScrollTrigger ligam o progresso da timeline à rolagem e iluminam cada marco ao alcançá-lo. Lenis suaviza a rolagem no desktop com mouse. O movimento respeita a preferência por animações reduzidas.
- **Projetos:** em telas grandes, a galeria horizontal acompanha a rolagem; em telas menores, usa rolagem nativa, botões e teclado.
- **Imagens:** PhotoSwipe abre as galerias de telas com zoom, gestos, legendas e navegação por teclado. O diálogo nativo serve como alternativa.
- **Interface:** tema claro/escuro persistente, navegação por âncoras, estados de foco visíveis e confirmação acessível ao copiar o e-mail.

## Onde está cada parte

| Caminho | Conteúdo |
| :-- | :-- |
| `index.html`, `en.html` | Conteúdo, estrutura e links dos dois idiomas |
| `styles/style.css` | Identidade visual e layouts responsivos |
| `scripts/main.js` | Tema, menu e interações gerais |
| `scripts/animations.js` | Timeline, entradas e sincronização da rolagem |
| `scripts/projects.js`, `scripts/gallery.js` | Navegação dos projetos e galerias |
| `assets/` | Avatar, imagens dos projetos e currículos |
| `docs/content-sources.md` | Fontes usadas para revisar experiências e conteúdo |

As URLs antigas `about.html`, `curriculo.html` e `projects.html` continuam direcionando às seções atuais. Ao atualizar experiências, revise também `index.html`, `en.html` e os currículos.

## Sobre o conteúdo visual

O avatar é uma ilustração criada a partir de fotos fornecidas por mim. Os screenshots dos projetos são das aplicações reais. A composição visual teve como referência o [portfólio de Gabriel Machado](https://devmachado.com.br/); código, conteúdo e ilustração são próprios. Mais detalhes sobre a procedência do conteúdo estão em [`docs/content-sources.md`](docs/content-sources.md).

Se quiser conversar sobre o projeto ou sobre desenvolvimento full-stack e IA aplicada, pode me encontrar no [LinkedIn](https://www.linkedin.com/in/douglas-oliveira-627088188/) ou por [e-mail](mailto:doug.dev@hotmail.com).
