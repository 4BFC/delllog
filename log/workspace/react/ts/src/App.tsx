import { Suspense } from "react";
import { useRoutes } from "react-router-dom";
import routes from '~react-pages'

function App(){
  return (
    <Suspense fallback={<div>Loading...</div>}>
      {useRoutes(routes)}
    </Suspense>
  )
}

export default App