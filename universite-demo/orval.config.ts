import { defineConfig } from 'orval';

export default defineConfig({
  universiteDemo: {
    output: {
      mode: 'tags-split',
      target: './lib/api/partie1/generated.ts',
      schemas: './lib/api/partie1/model',
      client: 'react-query', 
    },
    input: {
      target: 'http://localhost:3000/api/docs', 
    },
  },
});