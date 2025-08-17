import { Button, buttonVariants } from "./button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
    DialogFooter,
    DialogClose
} from "@/components/ui/dialog"

import { VariantProps } from "class-variance-authority";

interface DialogActionProps {
    children?: React.ReactNode
    title: string
    buttonText: string
    variant?: VariantProps<typeof buttonVariants>['variant'];
    action?: () => void;
    trigger: React.ReactNode
}

export function DialogAction({ children, trigger, title, buttonText, variant, action }: DialogActionProps) {
    return (
        <Dialog>
            <DialogTrigger asChild>
                { trigger }
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>
                        {title}
                    </DialogTitle>
                    <DialogDescription />
                </DialogHeader>
                {children}
                <DialogFooter>
                    <DialogClose asChild>
                        <Button variant={"outline"}>
                            Cancel
                        </Button>
                    </DialogClose>
                    <DialogClose asChild>
                        <Button variant={variant} onClick={action}>
                            {buttonText}
                        </Button>
                    </DialogClose>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}