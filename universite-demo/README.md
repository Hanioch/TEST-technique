# 📘 Projet – Épreuve technique (Université Demo)

## Architecture
Ce projet a été réalisé en utilisant Next.js, tant pour le backend que pour le frontend, avec Prisma pour la gestion de la base de données.

### Partie 1
**Objectif** :  
1. Créer des endpoints permettant d’interroger la base de données.

**Résolution** :  
1. La base de données a été importée dans Prisma en ajoutant dans le fichier schema.prisma :  
```
    datasource db {
    provider = "sqlite"
    url      = env("DATABASE_URL") // équivaut à file:./universite_demo.sqlite
  }
```
Ensuite, la commande suivante a été utilisée dans le terminal :  
```
npx prisma db pull 
```
2. Dans le dossier app, un dossier API a été créé pour contenir le backend, ainsi qu’une page partie1 pour afficher le résultat des requêtes.  
3. Dans api, un dossier docs a été ajouté pour disposer d’une documentation Swagger permettant de créer les endpoints automatiquement avec la librairie Orval.  
4. Des dossiers cours, inscriptions et notes ont été créés dans api, chacun gérant la logique de la table correspondante. La documentation a été ajoutée à chacun pour qu’Orval puisse générer les endpoints avec les bons types.  
5. Après l’installation d’Orval, la configuration dans orval.config.ts et l’ajout dans le script du package.json de :  
  ```
   "orval": "orval --config orval.config.ts"
  ```
  la commande 'pnpm orval' peut être lancée pour générer automatiquement les endpoints à partir de la documentation du backend.  
6. Les endpoints sont générés dans le dossier 'lib/api/partie1/'.

### Partie 2  
**Objectif** :  
1. Se connecter à l’API : https://b0s0kwos00g48ow8cg0skg4w.89.116.111.143.sslip.io/api  
2. Générer un bulletin par étudiant et par année (moyennes, crédits, réussite).  
3. Produire un rapport d’anomalies en JSON pour le contrôle qualité.

**Résolution** :  
1. Pour la connexion à l’API, la variable suivante a été ajoutée dans le fichier .env :  
```
NEXT_PUBLIC_API_BASE_URL=https://b0s0kwos00g48ow8cg0skg4w.89.116.111.143.sslip.io
```
2. Un dossier "partie2" a été créé dans lib/api, contenant un fichier client.ts servant de base aux autres fichiers pour leurs requêtes, ainsi qu’un fichier par table pour mieux organiser les fonctions d’appel à l’API.  
3. Dans le dossier app, un dossier partie2 a été créé, comprenant un dossier anomalies et un dossier bulletins. Ces deux dossiers correspondent à des routes backend exploitables répondant aux objectifs 2 et 3.  
   *(Pour des raisons de simplicité d’accès, ce dossier partie2 a été placé directement dans app plutôt que dans app/api.)*

### Partie 3  
**Objectif** :  
1. Créer une interface web permettant de consulter les données via l’API.

**Résolution** :  
1. Les fonctions développées dans lib/partie2 ont été réutilisées pour la connexion à l’API.  
2. Les bulletins et anomalies de la partie 2 sont également affichés avec une mise en forme améliorée.  
3. La librairie shadcn/ui a été utilisée pour le frontend, car elle est simple d’utilisation et permet de gagner du temps.  
4. Plusieurs composants de cette librairie ont été installés :  
  - Card : chaque donnée récupérée (cours, notes, inscriptions, bulletins) est affichée grâce à ce composant.  
  - Tabs : permet de naviguer entre différentes fenêtres (une pour chaque table).  
  - Accordion : permet d’agrandir les bulletins pour afficher les détails.  
  - ScrollArea et ScrollBar : améliorent la gestion du responsive, notamment pour éviter des bugs avec les tabs sur téléphone.

**Limitation de temps** :  
L’ajout du composant DataTable de shadcn, qui intègre une barre de recherche pour filtrer les valeurs des inscriptions, notes et cours, n’a pas pu être réalisé.

## ▶️ Comment démarrer le projet

1. Installer les dépendances :  
   ```bash
   npm install
   # ou
   pnpm install
   # ou
   yarn install
   ```
2. Créer un fichier .env à la racine du projet universite-demo avec les variables suivantes :  
```
DATABASE_URL="file:./universite_demo.sqlite"
NEXT_PUBLIC_API_BASE_URL=https://b0s0kwos00g48ow8cg0skg4w.89.116.111.143.sslip.io
```
3. Générer le client API avec Orval :  
   ```bash
   npm run orval
   # ou
   pnpm orval
   # ou
   yarn orval
   ```
4. Générer et appliquer les migrations Prisma :  
   ```bash
   npx prisma generate
   npx prisma migrate dev
   ```
5. Lancer le projet :  
   ```bash
   npm run dev
   # ou
   pnpm dev
   # ou
   yarn dev
   ```

## 🛠️ Outils utilisés
- **ChatGPT** : génération rapide de contenu (README, exemples de code), explications fonctionnelles et conseils sur l’organisation générale du projet.  
- **Visual Studio Code (VSCode)** : IDE principal avec extensions TypeScript, Prisma et Tailwind pour optimiser la productivité.  
- **Prisma Studio** : interface visuelle pour consulter et manipuler les données SQLite.  
- **Postman / Thunder Client** : tests rapides des endpoints API.  

## 🚀 Stack Technique

### Langage & Framework
- **TypeScript**  
- **Next.js (App Router)** – backend et frontend dans un seul framework, avec SSR/ISR.  

### Base de données
- **SQLite** – base fournie pour l’exercice.  
- **Prisma ORM** – gestion typée des modèles et migrations.  

### API & Data Fetching
- **REST API (Next.js API routes)** – endpoints pour exposer les données SQLite.  
- **Orval** – génération automatique de clients API TypeScript.  
- **TanStack Query (React Query)** – gestion des appels API (cache, retry, synchronisation).  
- **Axios** – client HTTP utilisé par Orval.  

### Interface Utilisateur
- **React 18 (via Next.js)**  
- **shadcn/ui** – librairie de composants réutilisables.  
- **Tailwind CSS** – design responsive et rapide.  
- **Radix UI** – accessibilité et composants bas-niveau.  

### Documentation
- **Swagger / OpenAPI** – documentation des endpoints API.  
- **Postman** – tests manuels des routes.  

---

## ✨ Pourquoi cette stack ?
- **Next.js** → framework avec lequel la maîtrise est la plus avancée.  
- **Prisma** → solution la plus adaptée compte tenu des connaissances.  
- **Orval + React Query** → automatisation et gestion propre des appels API.  
- **shadcn/ui + Tailwind** → UI cohérente, responsive, professionnelle et rapide à mettre en place.