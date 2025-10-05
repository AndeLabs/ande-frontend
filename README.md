# Ande Frontend

## 🚀 Overview

This is the official frontend for the AndeChain ecosystem. It is a decentralized application (dApp) built with Next.js and TypeScript, designed to provide a seamless user experience for interacting with the AndeChain blockchain and its various features.

The application integrates wallet connections, smart contract interactions, and AI-powered features to deliver a robust and intuitive interface for users.

## 🛠️ Key Technologies

- **Framework**: [Next.js](https://nextjs.org/)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Blockchain Interaction**: [wagmi](https://wagmi.sh/) & [viem](https://viem.sh/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **UI Components**: [Shadcn/UI](https://ui.shadcn.com/)
- **AI Features**: [Google Genkit](https://firebase.google.com/docs/genkit)
- **Testing**: [Jest](https://jestjs.io/)

## 📂 Folder Structure

The project follows a standard Next.js App Router structure with some additions:

```
/
├── src/
│   ├── app/          # Main application routes, layouts, and pages
│   ├── components/   # Reusable React components (UI, layout, blockchain)
│   ├── lib/          # Utility functions, blockchain helpers, and constants
│   └── ai/           # Google Genkit implementation for AI flows
├── public/           # Static assets
└── ...               # Configuration files
```

- **`src/app`**: Contains all the application's routes. Each folder represents a URL segment.
- **`src/components`**: Organized into subdirectories for UI elements, layout components, and specific blockchain-related components.
- **`src/lib`**: Home to helper functions, wagmi configuration, and other shared utilities.
- **`src/ai`**: Contains the Genkit flows and tools for the AI-assisted features within the dApp.

## 🏁 Getting Started

Follow these steps to get the development environment running.

### Prerequisites

- [Node.js](https://nodejs.org/en/) (v20 or later)
- [npm](https://www.npmjs.com/)

### 1. Installation

Clone the repository and install the dependencies:

```bash
npm install
```

### 2. Running the Development Server

Start the Next.js development server:

```bash
npm run dev
```

The application will be available at [http://localhost:9002](http://localhost:9002).

## 📜 Available Scripts

- **`npm run dev`**: Starts the development server with Turbopack.
- **`npm run build`**: Creates a production-ready build of the application.
- **`npm run start`**: Starts the production server.
- **`npm run lint`**: Lints the codebase using Next.js's built-in ESLint configuration.
- **`npm run typecheck`**: Runs the TypeScript compiler to check for type errors.
- **`npm run test`**: Executes the test suite using Jest.