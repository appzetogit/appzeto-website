import { Careers } from '../../src/views/Inner.jsx'
import { openList } from '../../src/server/openings.js'

export const metadata = { title: 'Appzeto | Careers' }
// Openings change from the admin; read them on each request
export const dynamic = 'force-dynamic'

// Google Jobs listing data for each open role
const posting = o => ({
  '@context': 'https://schema.org', '@type': 'JobPosting', title: o.title,
  description: [o.summary, ...o.responsibilities, ...o.requirements].filter(Boolean).map(x => `<p>${x.replace(/</g, '&lt;')}</p>`).join('') || o.title,
  datePosted: new Date(o.posted || Date.now()).toISOString().slice(0, 10),
  employmentType: { 'Full-time': 'FULL_TIME', 'Part-time': 'PART_TIME', Internship: 'INTERN', Contract: 'CONTRACTOR' }[o.type] || 'FULL_TIME',
  hiringOrganization: { '@type': 'Organization', name: 'Appzeto', sameAs: 'https://appzeto.com' },
  jobLocation: { '@type': 'Place', address: { '@type': 'PostalAddress', addressLocality: 'Indore', addressRegion: 'Madhya Pradesh', addressCountry: 'IN' } },
  ...(o.experience ? { experienceRequirements: o.experience } : {}),
  ...(o.skills.length ? { skills: o.skills.join(', ') } : {}),
})

export default async function Page() {
  const openings = await openList()
  return <>
    {openings.map(o => <script key={o.id} type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(posting(o)).replace(/</g, '\\u003c') }} />)}
    <Careers openings={openings} />
  </>
}
