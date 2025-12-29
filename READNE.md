# Projet Bibliothèque — Documentation & Test

## I. Présentation du projet

Ce projet est une application de gestion de bibliothèque construite avec Node.js, Express, Firestore, et un rendu côté serveur via EJS.
L’objectif est de proposer une API REST complète (CRUD) pour les livres, auteurs et utilisateurs, accompagnée d’une interface simple en EJS pour la consultation . d'autres principe scomme l'authentification, le haschage de données et autres sont également à l'ordre.

## II. Instruction d'installation

    1. Cloner le dépôt

    2. Installer les dépendances :

            npm install

    3. Configurer les variables d’environnement (voir ci-dessous)

    4. Lancer le serveur :

            npm run dev


## III. Variables d'environnement à configurer

            Créer un fichier .env à la racine :
            PORT=3000
            FIREBASE_PROJECT_ID=...
            FIREBASE_PRIVATE_KEY=...
            FIREBASE_CLIENT_EMAIL=...
            JWT_SECRET=...

## IV. Exemples d'appels API (curl)

    ### 1. Authentification

        curl -X POST http://localhost:3000/api/auth/login \
        -H "Content-Type: application/json" \
        -d '{"email":"user@example.com","password":"motdepasse"}'

    ### 2. Liste des Livres 
        curl http://localhost:3000/api/books

   ### 3. Création d'un livre (avec token)
        curl -X POST http://localhost:3000/api/books \
            -H "Authorization: Bearer <token>" \
            -H "Content-Type: application/json" \
            -d '{"title":"Titre","author_id":"123","isbn":"456","published_year":2020,"pages":300,"description":"Texte","available":true}'

## V. Exemples d’appels API (Postman)

    ### 1. Authentification

        POST http://localhost:3000/api/auth/login 

        Body (JSON) :

            {
            "email": "user@example.com",
            "password": "motdepasse"
            }

    ### 2. Utilisateurs

        GET http://localhost:3000/api/users
        Sans body.

        POST http://localhost:3000/api/users
        Body (JSON) :
            {
                "firstname": "Jean",
                "lastname": "Dupont",
                "email": "jean@example.com",
                "password": "123456"
            }

    ###3. Auteurs

        GET /api/authors
        Sans body.

        POST http://localhost:3000/api/authors
        Body (JSON) :
            {
            "firstname": "Victor",
            "lastname": "Hugo",
            "bio": "Auteur français"
            }




##  VI.  Structure des dossiers

    PROJET-BIBLIO/
    │
    ├── controllers/              # Logique métier
    ├── models/                   # Accès Firestore
    ├── schemas/                  # Validation Zod
    ├── routes/                   # Endpoints Express
    ├── middlewares/             # Sécurité, parsing, logs, EJS
    ├── views/                   # Templates EJS
    ├── firebase.js              # Connexion Firestore
    ├── biblio_credentials.json  # Clés Firebase
    ├── server.js                # Point d’entrée
    ├── .env                     # Configuration
    ├── README.md                # Documentation
