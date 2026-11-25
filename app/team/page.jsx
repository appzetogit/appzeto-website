import { Navigate } from '../../src/routes.jsx'
export const metadata = { title: 'Appzeto | Page not found' }
export default function Page() { return <Navigate to="/about" replace /> }
