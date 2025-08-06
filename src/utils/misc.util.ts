export const isCurrentPath = (pathname: string, pagePath: string) => (pagePath === '/' ? pathname === pagePath : pathname.startsWith(pagePath))
