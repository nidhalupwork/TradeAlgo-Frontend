import { ReactNode } from 'react';

export const PageHeader = ({ children }: { children: ReactNode }) => {
  return <h1 className="text-base sm:text-xl md:text-3xl font-bold mb-2 tracking-tight">{children}</h1>;
};

export const PageDescription = ({ children }: { children: ReactNode }) => {
  return <p className="text-muted-foreground text-xs sm:text-sm md:text-base">{children}</p>;
};
