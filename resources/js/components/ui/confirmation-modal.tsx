import React from 'react';
import { AlertTriangle } from 'lucide-react';
import { Button } from './button';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from './dialog';

interface ConfirmationModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    title: string;
    description: string;
    confirmText?: string;
    cancelText?: string;
    variant?: 'default' | 'destructive';
}

const ConfirmationModal: React.FC<ConfirmationModalProps> = ({
    isOpen,
    onClose,
    onConfirm,
    title,
    description,
    confirmText = 'Confirm',
    cancelText = 'Cancel',
    variant = 'default',
}) => {
    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent>
                <DialogHeader>
                    <div className="flex items-center gap-3">
                        {variant === 'destructive' && (
                            <div className="rounded-full bg-destructive/10 p-1">
                                <AlertTriangle className="h-5 w-5 text-destructive" />
                            </div>
                        )}
                        <DialogTitle>{title}</DialogTitle>
                    </div>
                </DialogHeader>
                <DialogDescription className="py-4">{description}</DialogDescription>
                <DialogFooter>
                    <div className="flex w-full justify-end gap-2">
                        <Button variant="outline" onClick={onClose}>
                            {cancelText}
                        </Button>
                        <Button variant={variant} onClick={onConfirm}>
                            {confirmText}
                        </Button>
                    </div>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};

export default ConfirmationModal;
