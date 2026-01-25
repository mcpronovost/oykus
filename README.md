![Oykus](.github/assets/banner.jpg "Oykus")

<p align="center">
  <br/>
  <a href="https://github.com/mcpronovost/oykus">Oykus</a> &mdash; where every player is both author and adventurer
  <br/><br/>
</p>

<div align="center">

[![Version](https://img.shields.io/badge/Version-0.3.3-blue.svg)](./CHANGELOG.md)
[![License](https://img.shields.io/badge/License-BSD--3--Clause-red.svg)](./LICENSE)
[![made in Canada](https://img.shields.io/badge/Made%20in-Canada-FF0000)](#)
[![made in Québec](https://img.shields.io/badge/Fait%20au-Québec-003399)](#)

</div>

Oykus is an **experimental RPG project** blending story-creation with gameplay — letting players shape narratives while they play.  

- **Backend:** PHP  
- **Frontend:** Vite/React

> _This project is a work in progress — but the foundation is set and contributions are welcome!_

---

## 🌟 Features

- 🔨 **Core**: Core functionality and shared utilities
- ✅ **Auth**: User authentication, data, online users and guests, friends management
- ✅ **Planner**: Tasks management functionality
- 🔨 **Collectibles**: Collectibles management functionality
- ✅ **Achievements**: Achievements management functionality
- 🔨 **Blog**: Blogging functionality
- 🔨 **Forum**: Discussion board functionality
- 🔨 **Courrier**: Private messaging and alerts functionality

## 🌐 Internationalization

The platform supports multiple languages:

- French (default)
- English

## 🚀 Quick Start (Dev)

Get the project up and running locally with minimal friction (be sure to have Docker Desktop installed):

1. **Clone the repo**
   ```bash
   git clone https://github.com/mcpronovost/oykus.git
   cd oykus
    ```

2. **Build the containers**
   ```bash
   docker compose build
    ```

3. **Start the containers**
   ```bash
   docker compose up
    ```

4. **Run migrations inside backend container**
   ```bash
   php api/oyk/core/scripts/migrate.php
    ```

5. **Run sql statements inside database container**
   ```bash
   mysql -u DB_USER -p DB_NAME
   ```