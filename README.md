# AutoLab

Site-jogo estático sobre Machine Learning, ambientado numa fábrica com esteira. Quem escaneia o QR code do cartaz percorre 5 estações com cards e um quiz em cada uma, e vê um robô sendo montado a cada acerto até a expedição.

🔗 **Acesse:** https://glaubershoity.github.io/AutoLab/

## Equipe

- Glauber Shoity Nakai (desenvolvimento)
- Kamilla Barros Silva
- Wellington Henrique da Silva Lima

8º período de Sistemas de Informação — **Estágio Supervisionado (PACEX VIII)**, UNIPAR, prof. Elyssandro Piffer.

## Stack

React + Vite, Tailwind CSS, GSAP. Fase extra opcional com Three.js (`@react-three/fiber`) para um fundo 3D leve, com fallback automático para 2.5D.

## Desenvolvimento

```bash
npm install
npm run dev      # ambiente local
npm run build    # build de produção em dist/
```

Publicação automática no GitHub Pages a cada push na branch `main` (ver `.github/workflows/deploy.yml`).

Plano de desenvolvimento completo em `PLANO.md`.
