"use server"

import { UserList } from "@/components/admin/components/user/userList";
import { AdminHeader } from "@/components/admin/layout/header"
import { getRoles } from "@/services/roles.service";
import { getUsers } from "@/services/users.service";

export default async function Users() {
    const roles = await getRoles();
    const users = await getUsers();

    return (
        <>
            <AdminHeader title={"Users management"} />
            <div className="flex flex-1 flex-col">
                <div className="@container/main flex flex-1 flex-col gap-2">
                    <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
                        <UserList initialUsers={users} roles={roles} />
                    </div>
                </div>
            </div>
        </>
    )
}
