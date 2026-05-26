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
    jobTitle: 'Computer Science Student & Open Source Contributor',
    affiliation: {
      '@type': 'EducationalOrganization',
      name: 'De Anza College'
    },
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
    dateModified: new Date().toISOString(),
    mainEntity: personSchema,
    about: personSchema,
    url: siteConfig.url,
    name: siteConfig.title,
    description: siteConfig.description
  };

  const schema = type === 'ProfilePage' ? profilePageSchema : personSchema;
</script>

<svelte:head>
  {@html `<script type="application/ld+json">${JSON.stringify(schema)}</script>`}
</svelte:head>
