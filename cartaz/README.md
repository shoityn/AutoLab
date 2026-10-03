# Cartaz

Material de divulgação para distribuição física (Fase 4/5 do `PLANO.md`).

- `qrcode.png` / `qrcode.svg`: QR code (correção de erro alta) apontando para `https://shoityn.github.io/AutoLab/`
- `cartaz.html`: fonte editável da arte do cartaz (tamanho A4 a 150 dpi, 1240×1754px)
- `cartaz.png`: arte renderizada, pronta para revisão/impressão

Para gerar novamente após editar `cartaz.html`:

```bash
"C:\Program Files\Google\Chrome\Application\chrome.exe" --headless=new --disable-gpu --no-sandbox ^
  --screenshot="cartaz.png" --window-size=1240,1754 "http://localhost:PORTA/cartaz.html"
```

(sirva a pasta por HTTP antes, ex. `npx http-server .`, e aponte a URL para a porta usada)

**Pendências antes de imprimir:** confirmar a URL final do site (depende do repositório ficar público — ver documento de status), revisar o texto com o grupo, e Kamilla/Wellington podem querer refinar o design (`cartaz.html` é só um rascunho funcional).
