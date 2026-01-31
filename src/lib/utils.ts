import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

/**
 * 클래스 이름을 병합하는 유틸리티 함수
 * Tailwind CSS 클래스 충돌을 해결하고 조건부 클래스를 쉽게 적용할 수 있게 해줍니다.
 * 
 * @example
 * cn('px-2 py-1', 'bg-red-500', isActive && 'bg-blue-500')
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
