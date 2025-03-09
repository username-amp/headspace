import { ImgHTMLAttributes } from 'react';

export default function AppLogoIcon(props: ImgHTMLAttributes<HTMLImageElement>) {
  return (
    <img
      {...props}
      src="https://w7.pngwing.com/pngs/222/993/png-transparent-bitcoin-cash-ethereum-cryptocurrency-logo-meditation-physical-fitness-orange-investment.png"
      alt="App Logo"
    />
  );
}
