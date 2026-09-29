# Fontes do conteúdo

Revisão: 28 de setembro de 2026.

## Experiências

Fonte principal: [LinkedIn de Douglas Oliveira](https://www.linkedin.com/in/douglas-oliveira-627088188/), incluindo as telas de experiências e projetos. Consulta de conteúdo profissional por meio do navegador autenticado. Não foram usados dados de mensagens ou análises privadas do perfil.

- Humana AI: Desenvolvedor Full-Stack, março de 2026 até o momento, remoto. Plataforma de IA, Node.js/Next.js, React/TypeScript, LLMs, agentes, Vitest, Playwright e suporte SQL.
- Appen Seguros: Desenvolvedor Full-Stack, novembro de 2025 a março de 2026, híbrido. Python, robôs de faturamento, Node.js/AdonisJS, React/TypeScript, integrações e suporte.
- Autônomo: Desenvolvedor Full-Stack, maio a novembro de 2025, remoto. Sistema de barbearia e manutenção em produção.
- Hospital e Maternidade Santa Joana: Assistente administrativo, janeiro de 2021 a maio de 2025.
- Pro Matre Paulista: Mensageiro, março a dezembro de 2020. Corrigido o período do currículo antigo.
- Santa Rita Industrial e Comercial: Jovem aprendiz, junho de 2018 a junho de 2019.
- FAM: Tecnólogo em Análise e Desenvolvimento de Sistemas, agosto de 2022 a dezembro de 2024.

## IA aplicada e desenvolvimento assistido

A pedido de Douglas, a descrição da atuação com IA foi complementada pela revisão de contribuições de sua autoria no histórico de desenvolvimento da Humana AI. As descrições públicas resumem competências: integração de provedores de LLMs, roteamento de modelos, agentes e ferramentas, execução isolada de Python, geração de arquivos, streaming, memória e histórico, permissões, PostgreSQL, contratos de API e testes automatizados. Também foram identificadas contribuições com Cursor, skills e instruções para agentes de desenvolvimento.

Não foram reproduzidos código privado, identificadores internos, clientes ou detalhes de infraestrutura. Douglas confirmou diretamente conhecimento em MCP, RAG, fine-tuning, engenharia de contexto e Spec-Driven Development. Esses tópicos foram incluídos como conhecimentos, sem atribuir implantações específicas à Humana AI. O LinkedIn continua sendo a fonte de cargos e períodos.

## Projetos e currículo

Projetos confirmados no LinkedIn: barbearia, First API, Número Secreto, Amigo Secreto e Portfólio. Detalhes funcionais foram resumidos a partir das descrições. A publicação sobre CI/CD da barbearia informa 250 testes e GitHub Actions. Não foram acrescentadas métricas de impacto sem fonte.

Os links dos repositórios foram preservados do portfólio anterior. As demonstrações de back-end antigas em Railway não foram apresentadas como ambientes ativos; os projetos têm código e galerias de telas reais. Os jogos continuam com os links de demonstração existentes.

O DOCX fornecido controla a apresentação do currículo: Cambria, títulos em negrito, links azuis, página Letter e margens de 0,5 polegada. A versão atual tem uma página (10 pt), com LinkedIn e portfólio escritos por extenso; `tmp/resume/one_page.py` gera a versão condensada e os DOCX ficam fora do repositório. Inglês B1 e participação no ONE foram mantidos do currículo. Os pacotes de estilos e demais partes do DOCX foram preservados; somente conteúdo e a relação do link do portfólio foram atualizados. Os arquivos originais fornecidos permanecem intactos.

## Imagens e design

- Referência visual: https://devmachado.com.br/ (composição, hierarquia, avatar e página contínua). Nenhum código ou avatar da referência foi copiado.
- Avatar: ferramenta nativa ImageGen, com as três fotos fornecidas como referências de identidade. Versão de entrega otimizada em `assets/avatar-douglas.webp`; prévia de links em `assets/og-image.jpg` e `assets/og-image-en.jpg`.
- Prompt final: transformar o retrato em avatar cartoon 3D, mantendo cabelo curto cacheado, sobrancelhas, formato do rosto e barba; camiseta preta, iluminação azul sutil, expressão amigável, enquadramento até a cintura e fundo transparente. A segunda geração foi usada como final.
- Foto da seção Além do código: `assets/Pindorama.jpg`, fornecida por Douglas. O relato sobre Ultimate Frisbee foi recuperado do portfólio anterior e ampliado com o título de campeão brasileiro confirmado diretamente por Douglas, sem acrescentar ano ou contagem de títulos. A cópia otimizada de `eu.jpg` permanece disponível em `assets/douglas-photo.webp`.
- Screenshots dos projetos: arquivos do repositório original.

## Validação

Build de produção e sintaxe JavaScript; validação de links locais, âncoras, IDs, textos alternativos e conteúdo do PDF; revisão visual de todas as páginas do currículo; verificações de navegação, filtro, galeria e tema pelo navegador. O renderizador padrão de DOCX não encontrou LibreOffice no runtime Windows, por isso o PDF foi exportado pelo Microsoft Word e renderizado com Poppler para inspeção.

## Versão em inglês

`en.html` contém a tradução integral do site; `scripts/i18n.js` traduz os controles e a galeria. O currículo inglês segue a mesma página única e a formatação do português. Os dois DOCX foram exportados pelo Word e todas as páginas dos PDFs foram inspecionadas. O idioma da página determina qual currículo é baixado.
