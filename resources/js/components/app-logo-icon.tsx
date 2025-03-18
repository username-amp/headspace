import { ImgHTMLAttributes } from 'react';
import { Moon } from 'lucide-react';

export default function AppLogoIcon(props: ImgHTMLAttributes<HTMLImageElement>) {
    return (
        <Moon 
            className={`h-full w-full ${props.className || ''}`}
            strokeWidth={2}
        />
    );
}
