# Plateforme Collaborative - Frontend

Ce projet est le frontend du test technique pour Ikomobi, le sujet était la plateforme collaborative.\
Il est construit avec Nuxt 3 et utilise Nuxt UI pour l'interface.\
L'utilisateur peut se connecter, s'inscrire, consulter ses groupes, accéder aux détails d'un groupe, gérer ses invitations, etc.

## Table des matières

- [Technologies utilisées](#technologies-utilisées)
- [Installation](#installation)
- [Lancer l'application](#lancer-lapplication)
- [Structure du projet](#structure-du-projet)
- [Pages principales](#pages-principales)


## Technologies utilisées

- **Nuxt 3** – Frameworks de Vue 3 pour SSR/SSG.
- **Vue 3** en Composition API.
- **Nuxt UI** – Librairie de composants UI.
- **Tailwind CSS** pour le style ( via nuxtUI ).
- **fetch** – Pour la communication avec le backend.

## Installation

### Prérequis

- Node.js
- Yarn ou npm

### Cloner le dépôt

Cloner le dépôt sur votre machine locale :

```bash
git clone https://github.com/RoxBibopp/ikomobi-collab-front.git
cd ikomobi-collab-front
```

### Installer les dépendances

```bash
npm install
# ou
yarn install
```

### Configuration

Si nécessaire, modifiez l'url des appels de l'api dans le fichier `composables/useApi` :


## Lancer l'application

Pour démarrer l'application en mode développement :

```bash
npm run dev
# ou
yarn dev
```

L'application sera accessible sur [http://localhost:3000](http://localhost:3000).

## Structure du projet

- **pages/** – pages de l'application.
- **components/** – Composants réutilisables.
- **composables/** – Fonctions réutilisables.
- **middleware/** – middleware de redirection.

## Pages principales

### Login / Inscription

- **/login** – Page de connexion.
- **/register** – Page d'inscription.

### Affichage des groupes

- **/** – Affiche la liste des groupes, ainsi qu'un bouton pour créer un groupe.

### Détails d'un groupe

- **/group/[id]** – Affiche les détails d'un groupe et les actions possible.

### Mes invitations

- **Composant Invitations** – affiche la liste des invitations en attente.


