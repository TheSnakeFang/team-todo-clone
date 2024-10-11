declare module 'react-wheel-of-fortune' {
  import React from 'react';

  interface WheelProps {
    items: string[];
    onSpinComplete: (selectedItem: string) => void;
    primaryColor: string;
    contrastColor: string;
    buttonText: string;
    buttonStyle: React.CSSProperties;
    fontSize: number;
  }

  export const Wheel: React.FC<WheelProps>;
}
