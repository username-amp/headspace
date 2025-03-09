import { Page as InertiaPage } from '@inertiajs/core';
import { ReactNode } from 'react';

export type PageProps = {
  [key: string]: unknown;
};

export type Page<P extends PageProps = PageProps> = InertiaPage<P> & {
  default?: (props: P) => ReactNode;
  layout?: (page: ReactNode) => ReactNode;
};
