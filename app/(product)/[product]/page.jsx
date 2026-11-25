import { products } from '../../../src/data.js'
export const dynamicParams = false
export const generateStaticParams = () => products.map(p => ({ product: p.path.slice(1) }))
export async function generateMetadata({ params }) {
  const { product } = await params
  return { title: `Appzeto | ${products.find(p => p.path === '/' + product).name}` }
}
export default function Page() { return null }
