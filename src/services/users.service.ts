import { getJwtFromCookie } from "@/lib/auth/verifyjwt";
import { User } from "@/types/user";

export async function getUsers(): Promise<Array<User>> {
    return await fetch(`${process.env.API_URL}/users`, {
        method: "GET",
        headers: {
            "Authorization": `Bearer ${await getJwtFromCookie()}`
        }
    }).then(res => res.json());
}