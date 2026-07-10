# RBAC System - Role Based Access Control

## 1. Description du projet

RBAC System est une application web de gestion des utilisateurs basée sur le concept **Role-Based Access Control (RBAC)**.

Le projet permet de gérer les accès aux ressources d'une application selon les rôles attribués aux utilisateurs. Chaque utilisateur possède des permissions spécifiques permettant de contrôler les fonctionnalités accessibles.

L'objectif principal est de mettre en place un système sécurisé d'authentification et d'autorisation avec une architecture moderne basée sur une application MERN Stack.

Le système utilise une séparation claire entre :
- le frontend responsable de l'interface utilisateur ;
- le backend fournissant les APIs REST ;
- la base de données MongoDB assurant la persistance des données.


---

# 2. Fonctionnalités

## Authentification

- Inscription des utilisateurs.
- Connexion sécurisée.
- Gestion des sessions utilisateurs.
- Authentification basée sur JWT (JSON Web Token).
- Protection des routes backend.

## Gestion des utilisateurs

- Création des comptes utilisateurs.
- Consultation des profils.
- Modification des informations utilisateurs.
- Suppression des utilisateurs.
- Gestion des rôles.

## Gestion des rôles et permissions

- Attribution des rôles aux utilisateurs.
- Contrôle d'accès selon les permissions.
- Restriction des fonctionnalités selon le rôle.

Exemples de rôles :

- Administrateur :
  - Gestion complète du système.

- Employé :
  - Accès aux fonctionnalités autorisées.

- Utilisateur :
  - Accès limité aux ressources.


## Interface utilisateur

- Interface responsive.
- Navigation dynamique.
- Dashboard utilisateur.
- Design moderne.


---

# 3. Architecture

Le projet suit une architecture **Client-Server** basée sur MERN Stack.

             Client
               |
               |
          React Frontend
               |
               |
          REST API
               |
               |
        Node.js + Express
               |
               |
          MongoDB Database



---

# 4. Technologies utilisées


## Frontend

- React.js
- React Router
- JavaScript
- HTML5
- CSS3
- Axios


## Backend

- Node.js
- Express.js
- MongoDB
- Mongoose
- JWT Authentication
- bcrypt


## Outils

- Git / GitHub
- Visual Studio Code
- Postman
- MongoDB Atlas
<img width="1854" height="1082" alt="Capture d’écran du 2026-07-10 22-29-03" src="https://github.com/user-attachments/assets/5af08622-30fa-4449-9a09-bde6715e2a46" />
<img width="1854" height="1082" alt="Capture d’écran du 2026-07-10 22-29-34" src="https://github.com/user-attachments/assets/157adb8c-f9b2-415c-af2a-6aa93cd8e74a" />
<img width="1854" height="1082" alt="Capture d’écran du 2026-07-10 22-27-36" src="https://github.com/user-attachments/assets/989fb0db-98e1-4dac-8a90-7a16f0204122" />

