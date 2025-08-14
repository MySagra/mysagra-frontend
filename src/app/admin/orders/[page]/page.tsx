import { AdminHeader } from "@/components/admin/layout/header"
import { getOrders } from "@/services/orders.service";
import OrderList from "../_components/orderList";

export default async function Orders({
    params
}: {
    params: Promise<{ page: number }>
}) {
    const { page } = await params
    const { pagination, orders } = await getOrders(page);

    return (
        <>
            <AdminHeader title={"Orders management"} />
            <div className="flex flex-1 flex-col">
                <div className="@container/main flex flex-1 flex-col gap-2">
                    <OrderList initialOrders={orders} pagination={pagination} />
                </div>
            </div>
        </>
    )
}
