// app/providers.js
'use client';

import { ChakraProvider } from '@chakra-ui/react';
import { ErrorBoundary } from 'react-error-boundary';

function Fallback({ error }) {
  return <div>Something went wrong: {error.message}</div>;
}

export function Providers({ children }) {
  return (
    <ErrorBoundary FallbackComponent={Fallback}>
      <ChakraProvider>{children}</ChakraProvider>
    </ErrorBoundary>
  );
}