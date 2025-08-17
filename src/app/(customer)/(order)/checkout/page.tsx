'use client'

import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"

import { Button } from "@/components/ui/button";
import { Order } from "@/types/order";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import React from "react";

export default function Checkout() {
    const [order, setOrder] = useState<Order>();
    const router = useRouter();

    useEffect(() => {
        const orderStr = sessionStorage.getItem("createdOrder");
        if (orderStr) setOrder(JSON.parse(orderStr));
    }, []);

    return (
        <div className="min-h-screen w-full flex flex-col gap-16 place-content-start items-center p-12">
            <div className="flex flex-col gap-3 items-center">
                <h1 className="font-bold text-xl text-center">This is your order code, <span className="text-red-500">don&apos;t forget it:</span></h1>
                <span className="font-bold font-mono text-9xl text-yellow-800">{order?.id}</span>
            </div>

            <div className="flex flex-col gap-0.5 items-center">
                <h3 className="text-2xl font-semibold">You need to pay €{order?.price}</h3>
                <p className="py-5 text-gray-600 text-center">*Have your money ready to speed up the process😉</p>
            </div>


            <div className="flex flex-col gap-2.5 text-lg font-normal">
                <h1 className="font-semibold text-2xl text-center">What should I do now?</h1>
                <div className="flex flex-row gap-1">
                    👉
                    <p>Tell the cashier your order code</p>
                </div>
                <div className="flex flex-row gap-1">
                    🤑
                    <p>Make the payment</p>
                </div>
                <div className="flex flex-row gap-1">
                    🍸
                    <p>After paying, collect your drinks at the bar</p>
                </div>
                <div className="flex flex-row gap-1">
                    🍕
                    <p>Your food order will be served directly to your table</p>
                </div>
            </div>
            <div className="w-full inset-shadow-xs fixed bottom-0 p-3 bg-secondary flex place-content-center">
                <Dialog>
                    <DialogTrigger asChild>
                        <Button>
                            Create a New Order
                        </Button>
                    </DialogTrigger>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Are you sure you want to create a new order?</DialogTitle>
                            <DialogDescription>
                                By creating a new order you won&apos;t be able to return to this screen,
                                remember your
                                <span className="font-bold"> order code.</span><br />
                                But don&apos;t worry too much, it&apos;s always available from the cashiers😉
                            </DialogDescription>
                        </DialogHeader>
                        <DialogFooter>
                            <Button
                                onClick={() => {
                                    sessionStorage.removeItem("createdOrder");
                                    router.push("/");
                                }}
                            >
                                Confirm Creation
                            </Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            </div>

        </div>

    )

}