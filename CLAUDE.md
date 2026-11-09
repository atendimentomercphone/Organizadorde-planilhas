# Regra do projeto: manual sempre atualizado

Sempre que o painel mudar (nova aba, regra, botão, texto, correção visível), na MESMA entrega:
1. Rodar `node tests/shots.js` (a partir de /home/claude/painel) para refazer os prints em docs/img.
2. Atualizar docs/manual.html (passo a passo, tabelas, FAQ) e a tabela "Histórico do manual" (versão, data, mudança).
3. Publicar o manual no artefato "Manual do Organizador Mercadophone" (mesmo file_path/url, com `files` das imagens).
4. Copiar src.html e docs/ para este repositório e commitar.
