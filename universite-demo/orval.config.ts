import { defineConfig } from 'orval';

export default defineConfig({
  universiteDemo: {
    output: {
      mode: 'tags-split',
      target: './lib/api/generated.ts',
      schemas: './lib/api/model',
      client: 'react-query', 
    },
    input: {
      target: './openapi.json', 
    },
  },
});