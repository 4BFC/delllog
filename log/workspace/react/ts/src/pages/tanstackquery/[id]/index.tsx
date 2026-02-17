import { useState } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { useUser, useUpdateUser } from "../../../hooks/useUsers"

function Page() {
    const { id } = useParams<{ id: string }>()
    const navigate = useNavigate()
    const userId = Number(id)

    const { data: user, isLoading, error } = useUser(userId)
    const updateUser = useUpdateUser()

    const [name, setName] = useState("")

    if (isLoading) return <div>Loading...</div>
    if (error) return <div>Error!</div>
    if (!user) return <div>User not found</div>

    const handleUpdate = () => {
        if (!name.trim()) return
        updateUser.mutate(
            { id: userId, name },
            {
                onSuccess: () => {
                    navigate("/tanstackquery")
                }
            }
        )
    }

    return (
        <div>
            <h1>User Detail</h1>
            <div>
                <p><strong>ID:</strong> {user.id}</p>
                <p><strong>Name:</strong> {user.name}</p>
                <p><strong>Email:</strong> {user.email}</p>
            </div>

            <hr />

            <h2>Update Name</h2>
            <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="New name"
            />
            <button onClick={handleUpdate} disabled={updateUser.isPending}>
                {updateUser.isPending ? "Updating..." : "Update"}
            </button>

            <hr />

            <button onClick={() => navigate("/tanstackquery")}>
                Back to List
            </button>
        </div>
    )
}

export default Page
