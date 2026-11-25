import { Navigate } from '../../../src/routes.jsx'
// Web apps was folded into the other services; old links land on the list.
export const metadata = { title: 'Appzeto | Services' }
export default function Page() { return <Navigate to="/services" replace /> }
