import '../../src/admin/admin.css'
import Shell from '../../src/admin/Shell.jsx'

export const metadata = { title: { default: 'Admin | Appzeto', template: '%s | Appzeto admin' }, robots: { index: false, follow: false } }
export default function AdminLayout({ children }) { return <Shell>{children}</Shell> }
