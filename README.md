# 📘 Projet – Épreuve technique (Université Demo)

## ▶️ Comment démarrer le projet

1. Installer les dépendances :  
   ```bash
   npm install
   # ou
   pnpm install
   # ou
   yarn install
   
2. Générer le client API avec Orval :  
   ```bash
   npm run orval
   # ou
   pnpm orval
   # ou
   yarn orval
   
3. Générer et appliquer les migrations Prisma : 
   ```bash
   npx prisma generate
   npx prisma migrate dev

4. Lancer le projet :
   ```bash
   npm run dev
   # ou
   pnpm dev
   # ou
   yarn dev
   
## 🛠️ Outils utilisés
- **ChatGPT** : génération rapide de contenu (README, exemples de code), demandes d’explications pour certaines fonctions et conseils sur l’organisation générale du projet.  
- **Visual Studio Code (VSCode)** : IDE principal pour le développement, avec des extensions TypeScript, Prisma et Tailwind pour gagner en productivité.  
- **Prisma Studio** : interface visuelle pour consulter et manipuler les données de la base SQLite.  
- **Postman / Thunder Client** : tests rapides des endpoints API.  

## 🚀 Stack Technique

### **Langage & Framework**
- **TypeScript**  
- **Next.js (App Router)** – backend + frontend dans un seul framework, avec SSR/ISR.  

### **Base de données**
- **SQLite** – base fournie pour l’exercice.  
- **Prisma ORM** – gestion typée des modèles et migrations.  

### **Validation & Sérialisation**
- **Zod** – validation des schémas (inputs/outputs).  
- **zod-resolver** – intégration avec React Hook Form.  

### **API & Data Fetching**
- **REST API (Next.js API routes)** – endpoints pour exposer les données SQLite.  
- **Orval** – génération automatique de clients API TypeScript.  
- **TanStack Query (React Query)** – gestion des appels API (cache, retry, synchronisation).  
- **Axios** – client HTTP (utilisé par Orval).  

### **Interface Utilisateur**
- **React 18 (via Next.js)**  
- **shadcn/ui** – librairie de composants réutilisables.  
- **Tailwind CSS** – design responsive et rapide.  
- **Radix UI** – accessibilité et composants bas-niveau.  
- **React Hook Form** – gestion ergonomique des formulaires.  
- **clsx + tailwind-variants** – gestion conditionnelle des classes CSS.  

### **Export & Rapports**
- **papaparse** – export CSV des bulletins.  
- **xlsx** – export Excel des bulletins.  
- **date-fns** – manipulation des dates.  

### **Documentation**
- **Swagger / OpenAPI** – documentation des endpoints API.  
- **Postman** – tests manuels des routes.  

---

## ✨ Pourquoi cette stack ?
- **Next.js** → framework avec lequelle je suis le plus à l'aise.
- **Prisma** → solutions la plus adapté au vue de mes connaissances.  
- **Orval + React Query** → automatisation + gestion propre des appels API.  
- **shadcn/ui + Tailwind** → UI cohérente, responsive, pro et rapide à mettre en place.  
