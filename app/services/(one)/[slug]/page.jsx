import { allServices } from '../../../../src/data.js'
export const dynamicParams = false
export const generateStaticParams = () => allServices.map(v => ({ slug: v.slug }))
export async function generateMetadata({ params }) {
  const { slug } = await params
  return { title: `Appzeto | ${allServices.find(v => v.slug === slug).name}` }
}
export default function Page() { return null }
