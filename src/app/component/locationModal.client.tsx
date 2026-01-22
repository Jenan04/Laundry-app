'use client';
import dynamic from 'next/dynamic'
import { LocationModalProps } from './locationModal';

export default dynamic<LocationModalProps>(
  () => import('./locationModal'),
  { ssr: false }
);
