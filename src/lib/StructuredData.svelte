<script lang="ts">
  import { siteConfig } from './siteConfig';

  type Props = { type?: 'Person' | 'ProfilePage' };
  let { type = 'Person' }: Props = $props();

  const personSchema = {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: siteConfig.name,
    description: siteConfig.description,
    url: siteConfig.url,
    email: siteConfig.contact.email,
    jobTitle: 'Hardware & Software Developer · 11× Hackathon Winner',
    alumniOf: [
      { '@type': 'CollegeOrUniversity', name: 'San Jose State University' },
      { '@type': 'CollegeOrUniversity', name: 'De Anza College' }
    ],
    sameAs: [
      siteConfig.contact.linkedin,
      siteConfig.contact.x,
      siteConfig.contact.github,
      'https://enkhy.medium.com/',
      'https://oshwlab.com/enkhbold470'
    ],
    knowsAbout: [
      'Computer Science',
      'Software Development',
      'Hackathons',
      'Open Source Development',
      'Web Development'
    ],
    award: [
      'YC Agent Hack Winner',
      'Stanford TreeHacks Winner',
      'HackMIT Winner',
      'MIT Energy Hacks Winner',
      'Harvard Hack Winner'
    ]
  };

  const profilePageSchema = {
    '@context': 'https://schema.org',
    '@type': 'ProfilePage',
    dateCreated: '2025-01-01T00:00:00+00:00',
    // static (not `new Date()`) so SSR and client render identical markup —
    // a non-deterministic value here causes a hydration mismatch
    dateModified: '2026-05-30T00:00:00+00:00',
    mainEntity: personSchema,
    about: personSchema,
    url: siteConfig.url,
    name: siteConfig.title,
    description: siteConfig.description
  };

  const schema = $derived(type === 'ProfilePage' ? profilePageSchema : personSchema);
</script>

<svelte:head>
  {@html `<script type="application/ld+json">${JSON.stringify(schema)}</script>`}
</svelte:head>
