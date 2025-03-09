import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { UserMenuContent } from '@/components/user-menu-content';
import { useInitials } from '@/hooks/use-initials';
import { type SharedData } from '@/types';
import { Link, usePage } from '@inertiajs/react';
import { Search } from 'lucide-react';
import AppLogo from './app-logo';

export function AppHeader() {
    const page = usePage<SharedData>();
    const { auth } = page.props;
    const getInitials = useInitials();

    return (
        <div className="border-b bg-white shadow-sm dark:bg-slate-900">
            <div className="mx-auto flex h-16 items-center justify-between px-4 md:max-w-7xl">
                {/* Logo */}
                <Link href="/dashboard" prefetch className="flex items-center">
                    <AppLogo />
                </Link>

                {/* Search and User */}
                <div className="flex items-center space-x-4">
                    {/* Search Button */}
                    <Button variant="ghost" size="icon" className="group h-9 w-9">
                        <Search className="size-5 opacity-80 group-hover:opacity-100" />
                    </Button>

                    {/* User Menu */}
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="size-10 rounded-full p-1">
                                <Avatar className="size-8 overflow-hidden rounded-full">
                                    <AvatarImage src={auth.user.avatar} alt={auth.user.name} />
                                    <AvatarFallback className="rounded-lg bg-neutral-200 text-black dark:bg-neutral-700 dark:text-white">
                                        {getInitials(auth.user.name)}
                                    </AvatarFallback>
                                </Avatar>
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent className="w-56" align="end">
                            <UserMenuContent user={auth.user} />
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            </div>
        </div>
    );
}
