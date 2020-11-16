import React from 'react';

export const arrowUp = (fill: string) => (
    <svg width="8" height="5" viewBox="0 0 8 5" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path
            d="M2.60002 1.42857L0.5 3.57143L1.9 5L4.00001 2.85713L6.1 4.99997L7.5 3.5714L5.40001 1.42857L4.00001 4.17373e-08L2.60002 1.42857Z"
            fill={fill}
        />
    </svg>
);

export const arrowDown = (fill: string) => (
    <svg width="8" height="5" viewBox="0 0 8 5" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path
            d="M5.39998 3.57143L7.5 1.42857L6.1 -6.11959e-08L3.99999 2.14287L1.9 2.91375e-05L0.5 1.4286L2.59999 3.57143L3.99999 5L5.39998 3.57143Z"
            fill={fill}
        />
    </svg>
);
