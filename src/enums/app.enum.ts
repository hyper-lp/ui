export enum AppUrls {
    // App pages
    HOME = '/',

    // API routes - Account data
    API_SNAPSHOT = '/api/snapshot/:account',
    API_TRANSACTIONS = '/api/transactions/:account',
    API_TRADES = '/api/trades/:account',

    // API routes - Pools
    API_POOLS_TVL = '/api/pools/tvl',

    // API routes - Waitlist
    API_WAITLIST_JOIN = '/api/waitlist/join',
    API_WAITLIST_STATUS = '/api/waitlist/status',
    API_WAITLIST_USERS = '/api/waitlist/users',

    // External links
    TAIKAI = 'https://taikai.network/hl-hackathon-organizers/hackathons/hl-hackathon/projects/cmdnbxv990721dcc359icaqvr/idea',
    GITHUB = 'https://github.com/hyperlp',
    PRIVY = 'https://www.privy.io/',
    DOCS = 'https://en.wikipedia.org/wiki/PnL_explained',
    CONTACT_US = 'https://t.me/+rnRHBHo9QVBkMDY0',
    STATUS = 'https://merso.betteruptime.com/',

    // Authors
    MERSO_WEBSITE = 'https://merso.xyz',
    FBERGER_WEBSITE = 'https://fberger.xyz',
    KATALYSTER_TWITTER = 'https://x.com/Katalyster',
    ZARBOQ_TWITTER = 'https://x.com/zarboq',
}

export enum AppThemes {
    LIGHT = 'light',
    DARK = 'dark',
    SYSTEM = 'system',
}

export enum AppFontFamilies {
    TEODOR_LIGHT = 'teodor-light',
    LATO = 'lato',
    PVP_TRADE = 'pvp-trade',
}

export enum DexProtocol {
    HYPERSWAP = 'hyperswap',
    PRJTX = 'prjtx',
    HYBRA = 'hybra',
    HYPERBRICK = 'hyperbrick',
}
