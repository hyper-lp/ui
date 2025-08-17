/**
 * Schema versioning constants
 * Update CURRENT_SCHEMA_VERSION when making breaking changes to AccountSnapshot structure
 */

export const SCHEMA_VERSION = {
    CURRENT: '1.0.0',

    // Version history with descriptions of changes
    VERSIONS: {
        '1.0.0': {
            date: '2025-01-17',
            description: 'Initial schema with complete account snapshot structure',
            changes: [
                'Added positions (hyperEvm.lps, hyperEvm.balances, hyperCore.perps, hyperCore.spots)',
                'Added metrics (values, deltas, APRs)',
                'Added deployedAUM tracking',
                'Added unclaimed fees tracking',
                'Added market data and prices',
                'Added performance timings',
            ],
        },
    },
} as const

/**
 * Check if a schema version is compatible with the current version
 * For now, we only support exact matches, but this can be extended
 * to support backward compatibility ranges
 */
export function isSchemaVersionCompatible(version: string): boolean {
    return version === SCHEMA_VERSION.CURRENT
}

/**
 * Get the major version number from a semantic version string
 */
export function getMajorVersion(version: string): number {
    const [major] = version.split('.')
    return parseInt(major, 10)
}
