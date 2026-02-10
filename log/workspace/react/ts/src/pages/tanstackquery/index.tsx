import { useUsers, useCreateUser } from "../../hooks/useUsers"

function Page(){
    const { data, isLoading, error } = useUsers()
    const createUser = useCreateUser()

    if (isLoading) return <div>Loading...</div>
    if (error) return <div>Error!</div>

    return (
      <div>
        <h1>Users</h1>
        <ul>
          {data?.map((user) => (
            <li key={user.id}>{user.name}</li>
          ))}
        </ul>

        <button
          onClick={() => createUser.mutate({ name: 'poby', email: 'poby@test.com' })}
        >
          Add User
        </button>
      </div>
    )
}

export default Page