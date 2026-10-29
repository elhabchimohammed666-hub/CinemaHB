## License
   © 2026 Elhabchi Mohammed. All Rights Reserved.

# StreamVibe

StreamVibe est un monorepo de démarrage pour une expérience de découverte de films, séries et animés. Le client React/Vite fournit une page d’accueil responsive avec carrousels, recherche locale et détails en modale. L’API Express/Mongoose fournit les premiers modèles et routes d’authentification et de catalogue.

## Arborescence

```text
streamvibe/
├── client/
│   ├── src/
│   │   ├── components/       # Navbar, HeroBanner, MediaCarousel, MediaModal
│   │   ├── data/             # Catalogue de démonstration remplaçable par l’API
│   │   ├── App.jsx
│   │   ├── index.css
│   │   └── main.jsx
│   ├── index.html
│   ├── package.json
│   ├── postcss.config.js
│   ├── tailwind.config.js
│   └── vite.config.js
├── server/
│   ├── src/
│   │   ├── config/           # Connexion MongoDB
│   │   ├── controllers/      # Authentification et médias
│   │   ├── middleware/       # JWT, erreurs HTTP centralisées
│   │   ├── models/           # User, Media, Watchlist
│   │   ├── routes/
│   │   ├── utils/
│   │   ├── app.js
│   │   └── server.js
│   ├── .env.example
│   └── package.json
├── package.json
└── README.md
```

## Démarrage

Prérequis : Node.js 20 ou plus récent et une instance MongoDB.

1. Copier `server/.env.example` vers `server/.env`, puis définir `MONGODB_URI` et remplacer `JWT_SECRET` par une valeur aléatoire longue.
2. À la racine, exécuter `npm install`.
3. Démarrer l’API et Vite ensemble avec `npm run dev`.
4. Ouvrir `http://localhost:5173`. L’API écoute sur `http://localhost:5000`; son endpoint de santé est `/api/health`.
5. Pour vérifier le bundle du client : `npm run build`.

Le client utilise des données de démonstration dans `client/src/data/catalog.js`. Les images distantes de démonstration peuvent être remplacées par les URL d’affiches/backdrops enregistrées en base.

## Modèles MongoDB

- **User** : nom, e-mail unique, mot de passe haché avec bcrypt, rôle, jusqu’à cinq profils et historique de lecture avec progression.
- **Media** : slug, catégorie (`film`, `series`, `anime`), synopsis, affiches, bande-annonce, URL de lecture, genres, casting, année, note et statut de publication. Les champs privés `streamUrl` ne sont pas inclus dans la liste publique.
- **Watchlist** : relation utilisateur/média avec index unique composé pour empêcher les doublons.

La liste de suivi est normalisée dans sa propre collection. L’historique est embarqué dans `User`, ce qui facilite la récupération d’une petite liste par compte; pour un volume de visionnage élevé, déplacer cet historique dans une collection dédiée.

## API prête à étendre

- `GET /api/media/category/:category?page=1&limit=12&genre=Action&year=2025` : retourne les titres publiés, triés par note, avec pagination. Catégories permises : `film`, `series`, `anime`.
- `POST /api/auth/register` avec `{ "name", "email", "password" }` : crée un compte et pose un cookie JWT HttpOnly.
- `POST /api/auth/login` avec `{ "email", "password" }` : authentifie le compte.
- `POST /api/auth/logout` : invalide le cookie côté navigateur (route protégée)

Le middleware JWT accepte le cookie HttpOnly ou un en-tête `Authorization: Bearer <token>`. En production, utiliser HTTPS, une clé JWT robuste, des limites de débit sur les routes d’authentification et une politique de renouvellement/révocation des sessions.

## Suite recommandée

Ajouter les routes de recherche full-text, watchlist et historique protégées, puis brancher le client à l’API avec `fetch`/TanStack Query et états de chargement/erreur. Une intégration TMDB doit être faite côté serveur avec une clé conservée dans les variables d’environnement. Les URL de streaming doivent référencer des contenus autorisés et ne jamais être exposées dans une réponse publique.

## UI/UX

La base emploie un fond `#0f1014`, des panneaux `#17181e` et un accent rose-rouge `#f43f5e`, complétés par une touche violette. Manrope sert aux titres et DM Sans au texte. Les affiches utilisent des squelettes animés jusqu’au chargement, les carrousels sont tactiles et navigables au clavier , et la modale se ferme à l’échap ou au clic extérieur. Les animations respectent `prefers-reduced-motion`.
