'use client'

import { Order } from "@/types/order"

import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"

import DialogRecap from "../recap/dialogRecap"
import { Button } from "../ui/button"
import { Trash2 } from "lucide-react"
import { DialogAction } from "../ui/dialogAction"

interface OrderCardProps {
    order: Order
    value?: string
    adminView?: boolean,
    setOrders?: React.Dispatch<React.SetStateAction<Order[]>>
}

export default function OrderCard({ order, value = "", adminView = false, setOrders }: OrderCardProps) {

    function deleteOrder() {
        if (!setOrders) return;

        fetch(`/api/orders/${order.id}`, {
            method: "DELETE",
            credentials: "include"
        }).then(async res => {
            await res.json();
            if (res.ok) {
                setOrders(prev => prev.filter(o => o.id !== order.id));
            }
        })
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle className="flex flex-row place-content-between items-center">
                    {
                        value && order.customer.toLowerCase().includes(value.toLowerCase())
                            ?
                            <span className="bg-yellow-300 p-1 rounded-sm">{order.customer}</span>
                            :
                            <span>{order.customer}</span>
                    }
                    {
                        adminView
                            ?
                            <DialogAction
                                title="Are you sure you want to delete this order?"
                                variant={'destructive'}
                                action={() => deleteOrder()}
                                buttonText="Delete"
                                trigger={
                                    <Button variant={'destructive'} size={"icon"} className="size-7">
                                        <Trash2 />
                                    </Button>
                                }
                            >
                                <p className="font-normal text-sm">
                                    This action <span className="font-bold">cannot be undone</span>,
                                    if you delete the order the stats will change.
                                </p>
                            </DialogAction>
                            :
                            <></>
                    }
                </CardTitle>

                <CardDescription>
                    {new Date(order.dateTime).toLocaleString("it-IT", {
                        day: "2-digit",
                        month: "2-digit",
                        year: "numeric",
                        hour: "2-digit",
                        minute: "2-digit"
                    })}
                </CardDescription>
            </CardHeader>
            <CardContent>
                <p className="flex flex-row gap-1 items-center">
                    Order ID:
                    {
                        order.id.toLowerCase() === value.toLowerCase()
                            ?
                            <span className="bg-yellow-300 p-1 rounded-sm font-semibold font-mono">{order.id}</span>
                            :
                            <span className="font-semibold font-mono">{order.id}</span>
                    }
                </p>
                <p className="flex flex-row gap-1 items-center">
                    Table:
                    {
                        value && order.table.includes(value)
                            ?
                            <span className="bg-yellow-300 p-1 rounded-sm font-semibold">{order.table}</span>
                            :
                            <span className="font-semibold">{order.table}</span>
                    }
                </p>
            </CardContent>
            <CardFooter className="flex flex-row place-content-end">
                <DialogRecap order={order} />
            </CardFooter>
        </Card>
    )
}