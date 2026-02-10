import { useUsers, useCreateUser } from "../../hooks/useUsers"

function Page(){
    const { data, isLoading, error } = useUsers(1)
    const createUser = useCreateUser()

    if (isLoading) return <div>Loading...</div>
    if (error) return <div>Error!</div>

    return (
      <div>
        <h1>Users</h1>
        <ul>
          {data?.data.map((user) => (
            <li key={user.id}>{user.first_name} {user.last_name}</li>
          ))}
        </ul>

        <button
          onClick={() => createUser.mutate({ name: 'poby', job: 'developer' })}
        >
          Add User
        </button>
      </div>
    )
}

export default Page