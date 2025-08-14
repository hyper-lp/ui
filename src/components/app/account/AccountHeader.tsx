'use client'

interface AccountHeaderProps {
    address: string
    name?: string | null
    onRefresh: () => void
    isFetching: boolean
}

export function AccountHeader({ address, name, onRefresh, isFetching }: AccountHeaderProps) {
    return (
        <div className="border-b pb-4">
            <h1 className="font-mono text-2xl">Account: {address}</h1>
            {name && <p className="text-gray-600">Name: {name}</p>}
            <button
                onClick={onRefresh}
                disabled={isFetching}
                className="mt-2 flex items-center gap-2 rounded border border-gray-300 px-4 py-1 text-sm hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
            >
                {isFetching ? (
                    <>
                        <span className="inline-block h-3 w-3 animate-spin rounded-full border-2 border-gray-400 border-t-transparent" />
                        Refreshing...
                    </>
                ) : (
                    'Refresh'
                )}
            </button>
        </div>
    )
}
