import { Metadata } from 'next'
import AccountClient from './AccountClient'

// Define the demo accounts mapping
const DEMO_ACCOUNTS = [
    {
        address: '0x10B4F7e91f045363714015374D2d9Ff58Fda3186',
        name: 'Alpha',
        description: 'Demo - Project X 500-250',
    },
    {
        address: '0x8466D5b78CaFc01fC1264D2D724751b70211D979',
        name: 'Bravo',
        description: 'Demo - Hyperswap 500-250',
    },
    {
        address: '0x3cEe139542222D0d15BdCB8fd519B2615662B1E3',
        name: 'Charlie',
        description: 'Demo - Hyperswap 1000-500',
    },
]

// Generate metadata for the page
export async function generateMetadata({ params }: { params: Promise<{ account: string }> }): Promise<Metadata> {
    const { account } = await params

    // Find the account name from the address
    const accountInfo = DEMO_ACCOUNTS.find((acc) => acc.address.toLowerCase() === account.toLowerCase())

    const accountName = accountInfo?.name || 'HyperLP Account'

    return {
        title: accountName,
    }
}

export default function AccountPage() {
    return <AccountClient />
}
