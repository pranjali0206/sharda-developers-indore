import { Suspense, type ReactNode } from 'react';

/**
 * Below-the-fold wrapper:
 *  - `content-visibility: auto` lets the browser skip layout/paint until the section
 *    nears the viewport (big win for first render on mid-range phones);
 *  - the Suspense boundary lets React 18 hydrate each section as its own,
 *    interruptible unit instead of one long main-thread task.
 */
export function Deferred({ children }: { children: ReactNode }) {
  return (
    <Suspense fallback={null}>
      <div className="cv-auto">{children}</div>
    </Suspense>
  );
}
