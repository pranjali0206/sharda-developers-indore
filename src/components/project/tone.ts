/** Per-project colour treatment (Paradise = navy + cream, Greens = teal + mint). */
export const PROJECT_TONE = {
  paradise: {
    accent: 'text-navy-700',
    bg: 'bg-cream',
    btn: 'primary' as const,
    border: 'border-navy-700',
    soft: 'bg-navy-100 text-navy-700',
  },
  greens: {
    accent: 'text-teal-650',
    bg: 'bg-mint',
    btn: 'teal' as const,
    border: 'border-teal-700',
    soft: 'bg-teal-100 text-teal-650',
  },
};
