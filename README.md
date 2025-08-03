# Code Visualization Editor

A web-based code editor that provides real-time visualization of code execution, including memory allocation, loop iterations, variable updates, and algorithm traversals like graph algorithms.

## Features

- **Multi-language Support**: Python, C, C++, and Java with appropriate syntax highlighting
- **Real-time Visualization**: Memory allocation, variable states, and execution flow
- **Interactive Debugging**: Step-by-step execution with breakpoints
- **Algorithm Visualization**: Graph traversal algorithms (DFS, BFS, shortest path)
- **Loop and Recursion Tracking**: Visual representation of iterations and recursive calls
- **Export and Sharing**: Save and share visualizations

## Tech Stack

- **Frontend**: Next.js 15 with TypeScript and React 19
- **Editor**: Monaco Editor (VS Code's web editor)
- **Visualization**: D3.js for data visualization, Cytoscape.js for graph algorithms
- **State Management**: Redux Toolkit
- **Styling**: Tailwind CSS
- **Testing**: Vitest with React Testing Library
- **Code Quality**: ESLint, Prettier

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Installation

1. Clone the repository
2. Install dependencies:

```bash
npm install
```

3. Run the development server:

```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm run lint:fix` - Fix ESLint issues
- `npm run format` - Format code with Prettier
- `npm run format:check` - Check code formatting
- `npm run test` - Run tests
- `npm run test:watch` - Run tests in watch mode
- `npm run test:ui` - Run tests with UI

## Project Structure

```
src/
├── app/                 # Next.js app directory
│   ├── api/            # API routes
│   ├── globals.css     # Global styles
│   ├── layout.tsx      # Root layout
│   └── page.tsx        # Home page
├── components/         # React components
│   ├── editor/         # Code editor components
│   ├── ui/             # UI components
│   └── visualization/  # Visualization components
├── hooks/              # Custom React hooks
├── lib/                # Utility libraries
├── store/              # Redux store and slices
├── test/               # Test setup and utilities
└── types/              # TypeScript type definitions
```

## Development

The project follows a modular architecture with separate components for:

- **Code Editor**: Monaco Editor integration with syntax highlighting
- **Execution Engine**: Multi-language code execution (Python via Pyodide, C/C++ via WebAssembly, Java via server-side execution)
- **Visualization Engine**: Real-time rendering of memory, variables, and algorithm states
- **State Management**: Redux store managing editor, execution, and visualization states

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Run tests and linting
5. Submit a pull request

## License

This project is licensed under the MIT License.
