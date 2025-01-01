/**
 * Application Identity (Brand)
 *
 * Also note that the 'Brand' is used in the following places:
 *  - README.md               all over
 *  - package.json            app-slug and version
 *  - [public/manifest.json]  name, short_name, description, theme_color, background_color
 */
export const Brand = {
  Title: {
    Base: 'alpha-AGI',
    Common: (process.env.NODE_ENV === 'development' ? '[DEV] ' : '') + 'Alpha-AGI',
  },
  Meta: {
    Description: 'Launch alpha-AGI to unlock the full potential of AI, with precise control over your data and models. Voice interface, AI personas, advanced features, and fun UX.',
    SiteName: 'alpha-AGI | Precision AI for You',
    ThemeColor: '#32383E',
    TwitterSite: '@alphabase',
  },
  URIs: {
    Home: 'https://alphabase.co',
    // App: 'https://get.big-agi.com',
    CardImage: '',
    OpenRepo: 'https://github.com/AlphabaseOfficial/alpha-AGI',
    OpenProject: 'https://github.com/AlphabaseOfficial/alpha-AGI',
    SupportInvite: '#',
    // Twitter: 'https://www.twitter.com/enricoros',
    PrivacyPolicy: 'https://alphabase.co/privacy',
    TermsOfService: 'https://alphabase.co/terms',
  },
  Docs: {
    Public: (docPage: string) => `https://alphabase.co/docs/${docPage}`,
  }
} as const;