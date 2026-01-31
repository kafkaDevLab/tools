import React from 'react';

export interface NavItem {
  label: string;
  href: string;
}

export interface ServiceCardProps {
  title: string;
  description: string;
  icon: React.ReactNode;
}

export interface ProjectCardProps {
  title: string;
  category: string;
  image: string;
}

export enum ThemeColors {
  Primary = '#8b5cf6', // Violet 500
  Secondary = '#06b6d4', // Cyan 500
  Background = '#020617', // Slate 950
}
