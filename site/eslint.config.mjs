// eslint-config-next v16 ships native flat configs; FlatCompat is not needed
// (and throws on this version).
import coreWebVitals from 'eslint-config-next/core-web-vitals';
import typescript from 'eslint-config-next/typescript';

const config = [
  { ignores: ['.next/**', 'node_modules/**', 'qa/**', 'next-env.d.ts'] },
  ...coreWebVitals,
  ...typescript,
];

export default config;
