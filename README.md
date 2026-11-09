# Organizador Mercadophone

Painel de página única que organiza planilhas de clientes no padrão de importação do MercadoPhone.

- Detecta o tipo da planilha (similaridade com o modelo), padroniza nomes de produtos, valida e gera o Relatório de Validação.
- Converte arquivos de qualquer formato (xls, xlsx, csv, PDF, binários, imagens) e baixa por tipo e modelo.
- Envia os lotes ao Google Drive, avisa no Slack e marca o arquivo como migrado no Customer Center.
- Publicado como artefato no claude.ai; este repositório guarda o código-fonte.

## Manual
`index.html` é o manual do painel (publicado pelo GitHub Pages). A mesma fonte fica em `docs/manual.html`.

## Estrutura
- `src.html`: fonte da página (edite este arquivo).
- `build.py`: gera `painel.html` injetando os modelos de `models.json`.
- `painel.html`: página final publicada.
- `CHANGELOG.tsv` e `sync_manual.py`: histórico de versões e sincronia com o manual.
- `docs/`: manual e imagens. `templates/`: planilhas modelo. `tests/`: testes com Playwright (usam arquivos de exemplo em `/tmp`; ajuste os caminhos).

## Gerar
```
npm install
python3 sync_manual.py && python3 build.py
```
