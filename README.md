# 📘 Projet – Épreuve technique (Université Demo)

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

### **Tests & Qualité**
- **Jest** – tests unitaires.  
- **React Testing Library** – tests de composants.  
- **ESLint + Prettier** – qualité et cohérence du code.  

### **Documentation**
- **Swagger / OpenAPI** – documentation des endpoints API.  
- **Postman** – tests manuels des routes.  

---

## 🗂️ Organisation du Projet (prévue)
📦 universite-demo
┣ 📂 prisma            # Schéma et migrations Prisma
┣ 📂 src
┃ ┣ 📂 app
┃ ┃ ┣ 📂 api
┃ ┃ ┃ ┣ 📂 inscriptions   # Endpoints API (Next.js)
┃ ┃ ┃ ┣ 📂 cours
┃ ┃ ┃ ┣ 📂 notes
┃ ┃ ┃ ┗ 📂 bulletins
┃ ┃ ┣ 📂 (frontend pages & UI components)
┃ ┣ 📂 components     # Composants UI (shadcn, formulaires, tables, etc.)
┃ ┣ 📂 lib            # Fonctions utilitaires (validation, calculs ECTS, etc.)
┃ ┣ 📂 services       # Clients API générés par Orval
┃ ┗ 📂 hooks          # Hooks React (useBulletins, useAnomalies, etc.)
┣ 📂 tests            # Tests unitaires & e2e
┣ .eslintrc.json
┣ package.json
┣ tsconfig.json
┣ README.md
┗ schema.prisma
---

## ✨ Pourquoi cette stack ?
- **Next.js** → framework avec lequelle je suis le plus à l'aise.
- **Prisma** → solutions la plus adapté au vue de mes connaissances.  
- **Orval + React Query** → automatisation + gestion propre des appels API.  
- **shadcn/ui + Tailwind** → UI cohérente, responsive, pro et rapide à mettre en place.  
- **Zod + RHF** → validation fiable et formulaires ergonomiques.  
- **papaparse/xlsx** → production de bulletins en formats standards (CSV/Excel).  
- **Tests + CI/CD** → montre la rigueur et la qualité.  
