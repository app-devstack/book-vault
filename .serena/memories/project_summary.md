# Project Summary: book-vault

This is a native application built with Expo and React Native for managing books purchased from various stores.

## Tech Stack

* **Framework:** React Native with Expo
* **UI:** Tamagui and React Navigation
* **State Management:** TanStack Query
* **Database:** Drizzle ORM with Expo SQLite
* **Linting & Formatting:** ESLint and Prettier
* **Typing:** TypeScript with strict mode enabled
* **Forms:** React Hook Form
* **Schema Validation:** Zod

## Architecture

* **Monolithic Expo App:** The project is a single Expo application.
* **File-based Routing:** Uses Expo Router for navigation. The routes are defined in the `src/app` directory.
* **Component-based:** Follows a standard component-based architecture with components, hooks, and services separated into their own directories.
* **Database:** Uses Drizzle ORM to interact with a local SQLite database.
* **State Management:** Migrating towards using TanStack Query to manage server state (data from the local database), replacing a previous context-based approach.
