'use client';

import { useRouter } from 'next/navigation';
import { ErrorComponent } from '@/components/ErrorComponent'

export default function NotFound() {
  const router = useRouter()

  return (
    <ErrorComponent topText="Page not found" explaination='The page you are trying to access is not available.' style={{
      position: 'absolute',
      left: '50%',
      top: '50%',
      transform: `translate(-50%,50%)`,
    }} callback={() => router.replace('/')} />
  )
}