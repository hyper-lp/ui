import { AppSupportedChainIds } from '@/enums'
import { TokenConfig } from '@/interfaces'

const unknowToken = { address: 'unknown', decimals: 18, symbol: 'unknown' }
export const getTokenByAddress = (chainId: number, address: string): TokenConfig => {
    if (!TOKENS_CONFIG[chainId]) return unknowToken
    const token = TOKENS_CONFIG[chainId].find((token) => token.address.toLowerCase() === address.toLowerCase())
    if (!token) return unknowToken
    return token
}

export const getTokenBySymbol = (chainId: number, symbol: string): TokenConfig => {
    if (!TOKENS_CONFIG[chainId]) return unknowToken
    const token = TOKENS_CONFIG[chainId].find((token) => token.symbol.toLowerCase() === symbol.toLowerCase())
    if (!token) return unknowToken
    return token
}

export const TOKENS_CONFIG: Record<number, TokenConfig[]> = {
    [AppSupportedChainIds.ETHEREUM]: [
        {
            address: '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48',
            decimals: 6,
            symbol: 'USDC',
        },
        {
            address: '0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2',
            decimals: 18,
            symbol: 'WETH',
        },
        {
            address: '0x8e870d67f660d95d5be530380d0ec0bd388289e1',
            decimals: 18,
            symbol: 'USDP',
        },
        {
            address: '0x06af07097c9eeb7fd685c692751d5c66db49c215',
            decimals: 18,
            symbol: 'CHAI',
        },
        {
            address: '0x6b175474e89094c44da98b954eedeac495271d0f',
            decimals: 18,
            symbol: 'DAI',
        },
        {
            address: '0x408e41876cccdc0f92210600ef50372656052a38',
            decimals: 18,
            symbol: 'REN',
        },
        {
            address: '0xfa3e941d1f6b7b10ed84a0c211bfa8aee907965e',
            decimals: 18,
            symbol: 'HAY',
        },
        {
            address: '0x1f573d6fb3f13d689ff844b4ce37794d79a7ff1c',
            decimals: 18,
            symbol: 'BNT',
        },
        {
            address: '0x0d8775f648430679a709e98d2b0cb6250d2887ef',
            decimals: 18,
            symbol: 'BAT',
        },
        {
            address: '0x39aa39c021dfbae8fac545936693ac917d5e7563',
            decimals: 8,
            symbol: 'cUSDC',
        },
        {
            address: '0x5d3a536e4d6dbd6114cc1ead35777bab948e3643',
            decimals: 8,
            symbol: 'cDAI',
        },
        {
            address: '0x2260fac5e5542a773aa44fbcfedf7c193bc2c599',
            decimals: 8,
            symbol: 'WBTC',
        },
        {
            address: '0x5e74c9036fb86bd7ecdcb084a0673efc32ea31cb',
            decimals: 18,
            symbol: 'sETH',
        },
        {
            address: '0xc011a73ee8576fb46f5e1c5751ca3b9fe0af2a6f',
            decimals: 18,
            symbol: 'SNX',
        },
        {
            address: '0x1776e1f26f98b1a5df9cd347953a26dd3cb46671',
            decimals: 18,
            symbol: 'NMR',
        },
        {
            address: '0x514910771af9ca656af840dff83e8264ecf986ca',
            decimals: 18,
            symbol: 'LINK',
        },
        {
            address: '0xc0f9bd5fa5698b6505f643900ffa515ea5df54a9',
            decimals: 18,
            symbol: 'DONUT',
        },
        {
            address: '0x2b591e99afe9f32eaa6214f7b7629768c40eeb39',
            decimals: 8,
            symbol: 'HEX',
        },
        {
            address: '0xaaaebe6fe48e54f431b0c390cfaf0b017d09d42d',
            decimals: 4,
            symbol: 'CEL',
        },
        {
            address: '0xd46ba6d942050d489dbd938a2c909a5d5039a161',
            decimals: 9,
            symbol: 'AMPL',
        },
        {
            address: '0x57ab1ec28d129707052df4df418d58a2d46d5f51',
            decimals: 18,
            symbol: 'sUSD',
        },
        {
            address: '0x9cb2f26a23b8d89973f08c957c4d7cdf75cd341c',
            decimals: 6,
            symbol: 'DZAR',
        },
        {
            address: '0xb4efd85c19999d84251304bda99e90b92300bd93',
            decimals: 18,
            symbol: 'RPL',
        },
        {
            address: '0x0cf0ee63788a0849fe5297f3407f701e122cc023',
            decimals: 18,
            symbol: 'XDATA',
        },
        {
            address: '0x80fb784b7ed66730e8b1dbd9820afd29931aab03',
            decimals: 18,
            symbol: 'LEND',
        },
        {
            address: '0x0f7f961648ae6db43c75663ac7e5414eb79b5704',
            decimals: 18,
            symbol: 'XIO',
        },
        {
            address: '0xe41d2489571d322189246dafa5ebde1f4699f498',
            decimals: 18,
            symbol: 'ZRX',
        },
        {
            address: '0xea5f88e54d982cbb0c441cde4e79bc305e5b43bc',
            decimals: 18,
            symbol: 'PARETO',
        },
        {
            address: '0xdf2c7238198ad8b389666574f2d8bc411a4b7428',
            decimals: 18,
            symbol: 'MFT',
        },
        {
            address: '0xb6ed7644c69416d67b522e20bc294a9a9b405b31',
            decimals: 8,
            symbol: '0xBTC',
        },
        {
            address: '0x40fd72257597aa14c7231a7b1aaa29fce868f677',
            decimals: 18,
            symbol: 'XOR',
        },
        {
            address: '0x4575f41308ec1483f3d399aa9a2826d74da13deb',
            decimals: 18,
            symbol: 'OXT',
        },
        {
            address: '0xdac17f958d2ee523a2206206994597c13d831ec7',
            decimals: 6,
            symbol: 'USDT',
        },
        {
            address: '0x93ed3fbe21207ec2e8f2d3c3de6e058cb73bc04d',
            decimals: 18,
            symbol: 'PNK',
        },
        {
            address: '0x697ef32b4a3f5a4c39de1cb7563f24ca7bfc5947',
            decimals: 18,
            symbol: 'ISLA',
        },
        {
            address: '0x8400d94a5cb0fa0d041a3788e395285d61c9ee5e',
            decimals: 8,
            symbol: 'UBT',
        },
        {
            address: '0x0f5d2fb29fb7d3cfee444a200298f468908cc942',
            decimals: 18,
            symbol: 'MANA',
        },
        {
            address: '0xbf4a2ddaa16148a9d0fa2093ffac450adb7cd4aa',
            decimals: 2,
            symbol: 'ETHMNY',
        },
        {
            address: '0xdd974d5c2e2928dea5f71b9825b8b646686bd200',
            decimals: 18,
            symbol: 'KNC',
        },
        {
            address: '0x5228a22e72ccc52d415ecfd199f99d0665e7733b',
            decimals: 18,
            symbol: 'pBTC',
        },
        {
            address: '0x2f141ce366a2462f02cea3d12cf93e4dca49e4fd',
            decimals: 18,
            symbol: 'FREE',
        },
        {
            address: '0x4156d3342d5c385a87d264f90653733592000581',
            decimals: 8,
            symbol: 'SALT',
        },
        {
            address: '0x8a9c67fee641579deba04928c4bc45f66e26343a',
            decimals: 18,
            symbol: 'JRT',
        },
        {
            address: '0xad5fe5b0b8ec8ff4565204990e4405b2da117d8e',
            decimals: 0,
            symbol: 'TRXC',
        },
        {
            address: '0x4a57e687b9126435a9b19e4a802113e266adebde',
            decimals: 18,
            symbol: 'FXC',
        },
        {
            address: '0xcc394f10545aeef24483d2347b32a34a44f20e6f',
            decimals: 18,
            symbol: 'VGT',
        },
        {
            address: '0x1985365e9f78359a9b6ad760e32412f4a445e862',
            decimals: 18,
            symbol: 'REP',
        },
        {
            address: '0x607f4c5bb672230e8672085532f7e901544a7375',
            decimals: 9,
            symbol: 'RLC',
        },
        {
            address: '0x0000000000085d4780b73119b644ae5ecd22b376',
            decimals: 18,
            symbol: 'TUSD',
        },
        {
            address: '0xf970b8e36e23f7fc3fd752eea86f8be8d83375a6',
            decimals: 18,
            symbol: 'RCN',
        },
        {
            address: '0x255aa6df07540cb5d3d297f0d0d4d84cb52bc8e6',
            decimals: 18,
            symbol: 'RDN',
        },
        {
            address: '0x744d70fdbe2ba4cf95131626614a1763df805b9e',
            decimals: 18,
            symbol: 'SNT',
        },
        {
            address: '0xf629cbd94d3791c9250152bd8dfbdf380e2a3b9c',
            decimals: 18,
            symbol: 'ENJ',
        },
        {
            address: '0x8f8221afbb33998d8584a2b05749ba73c37a938a',
            decimals: 18,
            symbol: 'REQ',
        },
        {
            address: '0x7d1afa7b718fb893db30a3abc0cfc608aacfebb0',
            decimals: 18,
            symbol: 'MATIC',
        },
        {
            address: '0xb62132e35a6c13ee1ee0f84dc5d40bad8d815206',
            decimals: 18,
            symbol: 'NEXO',
        },
        {
            address: '0xb63b606ac810a52cca15e44bb630fd42d8d1d83d',
            decimals: 8,
            symbol: 'MCO',
        },
        {
            address: '0x55296f69f40ea6d20e478533c15a6b08b654e758',
            decimals: 18,
            symbol: 'XYO',
        },
        {
            address: '0x04fa0d235c4abf4bcf4787af4cf447de572ef828',
            decimals: 18,
            symbol: 'UMA',
        },
        {
            address: '0xb64ef51c888972c908cfacf59b47c1afbc0ab8ac',
            decimals: 8,
            symbol: 'STORJ',
        },
        {
            address: '0x8207c1ffc5b6804f6024322ccf34f29c3541ae26',
            decimals: 18,
            symbol: 'OGN',
        },
        {
            address: '0x58b6a8a3302369daec383334672404ee733ab239',
            decimals: 18,
            symbol: 'LPT',
        },
        {
            address: '0x4fbb350052bca5417566f188eb2ebce5b19bc964',
            decimals: 18,
            symbol: 'GRG',
        },
        {
            address: '0x970b9bb2c0444f5e81e9d0efb84c8ccdcdcaf84d',
            decimals: 18,
            symbol: 'FUSE',
        },
        {
            address: '0xd8912c10681d8b21fd3742244f44658dba12264e',
            decimals: 18,
            symbol: 'PLU',
        },
        {
            address: '0xba11d00c5f74255f56a5e366f4f77f5a186d7f55',
            decimals: 18,
            symbol: 'BAND',
        },
        {
            address: '0x7de91b204c1c737bcee6f000aaa6569cf7061cb7',
            decimals: 9,
            symbol: 'XRT',
        },
        {
            address: '0xaa7a9ca87d3694b5755f213b5d04094b8d0f0a6f',
            decimals: 18,
            symbol: 'TRAC',
        },
        {
            address: '0x1c5db575e2ff833e46a2e9864c22f4b22e0b37c2',
            decimals: 8,
            symbol: 'renZEC',
        },
        {
            address: '0x277697fa7c134a7fcc2aaaf812bdf1fd8b68b818',
            decimals: 18,
            symbol: 'JAKE',
        },
        {
            address: '0x7c5a0ce9267ed19b22f8cae653f198e3e8daf098',
            decimals: 18,
            symbol: 'SAN',
        },
        {
            address: '0xdb25f211ab05b1c97d595516f45794528a807ad8',
            decimals: 2,
            symbol: 'EURS',
        },
        {
            address: '0x0ae055097c6d159879521c384f1d2123d1f195e6',
            decimals: 18,
            symbol: 'STAKE',
        },
        {
            address: '0xc3761eb917cd790b30dad99f6cc5b4ff93c4f9ea',
            decimals: 18,
            symbol: 'ERC20',
        },
        {
            address: '0x7d29a64504629172a429e64183d6673b9dacbfce',
            decimals: 18,
            symbol: 'VXV',
        },
        {
            address: '0x6c6ee5e31d828de241282b9606c8e98ea48526e2',
            decimals: 18,
            symbol: 'HOT',
        },
        {
            address: '0xbbbbca6a901c926f240b89eacb641d8aec7aeafd',
            decimals: 18,
            symbol: 'LRC',
        },
        {
            address: '0xa4e8c3ec456107ea67d3075bf9e3df3a75823db0',
            decimals: 18,
            symbol: 'LOOM',
        },
        {
            address: '0x6810e776880c02933d47db1b9fc05908e5386b96',
            decimals: 18,
            symbol: 'GNO',
        },
        {
            address: '0x419d0d8bdd9af5e606ae2232ed285aff190e711b',
            decimals: 8,
            symbol: 'FUN',
        },
        {
            address: '0x85eee30c52b0b379b046fb0f85f4f3dc3009afec',
            decimals: 18,
            symbol: 'KEEP',
        },
        {
            address: '0x41e5560054824ea6b0732e656e3ad64e20e94e45',
            decimals: 8,
            symbol: 'CVC',
        },
        {
            address: '0x4a527d8fc13c5203ab24ba0944f4cb14658d1db6',
            decimals: 18,
            symbol: 'MITx',
        },
        {
            address: '0xc770eefad204b5180df6a14ee197d99d808ee52d',
            decimals: 18,
            symbol: 'FOX',
        },
        {
            address: '0xd7efb00d12c2c13131fd319336fdf952525da2af',
            decimals: 4,
            symbol: 'XPR',
        },
        {
            address: '0xf433089366899d83a9f26a773d59ec7ecf30355e',
            decimals: 8,
            symbol: 'MTL',
        },
        {
            address: '0xe48972fcd82a274411c01834e2f031d4377fa2c0',
            decimals: 18,
            symbol: '2KEY',
        },
        {
            address: '0xeb4c2781e4eba804ce9a9803c67d0893436bb27d',
            decimals: 8,
            symbol: 'renBTC',
        },
        {
            address: '0xf293d23bf2cdc05411ca0eddd588eb1977e8dcd4',
            decimals: 18,
            symbol: 'SYLO',
        },
        {
            address: '0x45804880de22913dafe09f4980848ece6ecbaf78',
            decimals: 18,
            symbol: 'PAXG',
        },
        {
            address: '0x27054b13b1b798b345b591a4d22e6562d47ea75a',
            decimals: 4,
            symbol: 'AST',
        },
        {
            address: '0x8f3470a7388c05ee4e7af3d01d8c722b0ff52374',
            decimals: 18,
            symbol: 'VERI',
        },
        {
            address: '0x035df12e0f3ac6671126525f1015e47d79dfeddf',
            decimals: 18,
            symbol: '0xMR',
        },
        {
            address: '0xa0b73e1ff0b80914ab6fe0444e65848c4c34450b',
            decimals: 8,
            symbol: 'CRO',
        },
        {
            address: '0xd26114cd6ee289accf82350c8d8487fedb8a0c07',
            decimals: 18,
            symbol: 'OMG',
        },
        {
            address: '0x48f07301e9e29c3c38a80ae8d9ae771f224f1054',
            decimals: 18,
            symbol: 'XZAR',
        },
        {
            address: '0x08d967bb0134f2d07f7cfb6e246680c53927dd30',
            decimals: 18,
            symbol: 'MATH',
        },
        {
            address: '0x446c9033e7516d820cc9a2ce2d0b7328b579406f',
            decimals: 8,
            symbol: 'SOLVE',
        },
        {
            address: '0x037a54aab062628c9bbae1fdb1583c195585fe41',
            decimals: 18,
            symbol: 'LCX',
        },
        {
            address: '0xd13c7342e1ef687c5ad21b27c2b65d772cab5c8c',
            decimals: 4,
            symbol: 'UOS',
        },
        {
            address: '0x9355372396e3f6daf13359b7b607a3374cc638e0',
            decimals: 4,
            symbol: 'WHALE',
        },
        {
            address: '0xba50933c268f567bdc86e1ac131be072c6b0b71a',
            decimals: 18,
            symbol: 'ARPA',
        },
        {
            address: '0xe25db4baa49ea3b8627986ffc22c7bd5e0c88d49',
            decimals: 18,
            symbol: 'PAS',
        },
        {
            address: '0x083a96c390c942def68b6343d1c651eeae604b50',
            decimals: 18,
            symbol: 'PASG',
        },
        {
            address: '0xfe75b71b348165f60b5be7f356b42da9b333b2b7',
            decimals: 18,
            symbol: 'PASS',
        },
        {
            address: '0xb4272071ecadd69d933adcd19ca99fe80664fc08',
            decimals: 18,
            symbol: 'XCHF',
        },
        {
            address: '0x4f9254c83eb525f9fcf346490bbb3ed28a81c667',
            decimals: 18,
            symbol: 'CELR',
        },
        {
            address: '0x763fa6806e1acf68130d2d0f0df754c93cc546b2',
            decimals: 18,
            symbol: 'LIT',
        },
        {
            address: '0x859a9c0b44cb7066d956a958b0b82e54c9e44b4b',
            decimals: 8,
            symbol: 'iETH',
        },
        {
            address: '0x0f71b8de197a1c84d31de0f1fa7926c365f052b3',
            decimals: 18,
            symbol: 'ARCONA',
        },
        {
            address: '0x9aab071b4129b083b01cb5a0cb513ce7eca26fa5',
            decimals: 18,
            symbol: 'HUNT',
        },
        {
            address: '0x558ec3152e2eb2174905cd19aea4e34a23de9ad6',
            decimals: 18,
            symbol: 'BRD',
        },
        {
            address: '0xb26631c6dda06ad89b93c71400d25692de89c068',
            decimals: 18,
            symbol: 'MINDS',
        },
        {
            address: '0x261efcdd24cea98652b9700800a13dfbca4103ff',
            decimals: 18,
            symbol: 'sXAU',
        },
        {
            address: '0x3db6ba6ab6f95efed1a6e794cad492faaabf294d',
            decimals: 8,
            symbol: 'LTO',
        },
        {
            address: '0x8b79656fc38a04044e495e22fad747126ca305c4',
            decimals: 18,
            symbol: 'AGVC',
        },
        {
            address: '0x23b608675a2b2fb1890d3abbd85c5775c51691d5',
            decimals: 18,
            symbol: 'SOCKS',
        },
        {
            address: '0xfc05987bd2be489accf0f509e44b0145d68240f7',
            decimals: 18,
            symbol: 'ESS',
        },
        {
            address: '0x26e75307fc0c021472feb8f727839531f112f317',
            decimals: 18,
            symbol: 'C20',
        },
        {
            address: '0x536381a8628dbcc8c70ac9a30a7258442eab4c92',
            decimals: 8,
            symbol: 'PAN',
        },
        {
            address: '0x5cf04716ba20127f1e2297addcf4b5035000c9eb',
            decimals: 18,
            symbol: 'NKN',
        },
        {
            address: '0xf2f9a7e93f845b3ce154efbeb64fb9346fcce509',
            decimals: 18,
            symbol: 'POWER',
        },
        {
            address: '0xbca3c97837a39099ec3082df97e28ce91be14472',
            decimals: 8,
            symbol: 'DUST',
        },
        {
            address: '0xe2f2a5c287993345a840db3b0845fbc70f5935a5',
            decimals: 18,
            symbol: 'mUSD',
        },
        {
            address: '0xdf574c24545e5ffecb9a659c229253d4111d87e1',
            decimals: 8,
            symbol: 'HUSD',
        },
        {
            address: '0xb6c4267c4877bb0d6b1685cfd85b0fbe82f105ec',
            decimals: 18,
            symbol: 'REL',
        },
        {
            address: '0x38a2fdc11f526ddd5a607c1f251c065f40fbf2f7',
            decimals: 18,
            symbol: 'PHNX',
        },
        {
            address: '0xe3818504c1b32bf1557b16c238b2e01fd3149c17',
            decimals: 18,
            symbol: 'PLR',
        },
        {
            address: '0xd4c435f5b09f855c3317c8524cb1f586e42795fa',
            decimals: 18,
            symbol: 'CND',
        },
        {
            address: '0xb6ee9668771a79be7967ee29a63d4184f8097143',
            decimals: 18,
            symbol: 'CXO',
        },
        {
            address: '0x419c4db4b9e25d6db2ad9691ccb832c8d9fda05e',
            decimals: 18,
            symbol: 'DRGN',
        },
        {
            address: '0xe5caef4af8780e59df925470b050fb23c43ca68c',
            decimals: 6,
            symbol: 'FRM',
        },
        {
            address: '0x8290333cef9e6d528dd5618fb97a76f268f3edd4',
            decimals: 18,
            symbol: 'ANKR',
        },
        {
            address: '0x8c2c8b49a74d3d9d513df995bd0131e543c5ea63',
            decimals: 8,
            symbol: 'UNIBITCOIN',
        },
        {
            address: '0x4c19596f5aaff459fa38b0f7ed92f11ae6543784',
            decimals: 8,
            symbol: 'TRU',
        },
        {
            address: '0xf80d589b3dbe130c270a69f1a69d050f268786df',
            decimals: 18,
            symbol: 'DAM',
        },
        {
            address: '0x1a5f9352af8af974bfc03399e3767df6370d82e4',
            decimals: 18,
            symbol: 'OWL',
        },
        {
            address: '0x4946fcea7c692606e8908002e55a582af44ac121',
            decimals: 18,
            symbol: 'FOAM',
        },
        {
            address: '0x8a854288a5976036a725879164ca3e91d30c6a1b',
            decimals: 18,
            symbol: 'GET',
        },
        {
            address: '0xb9ef770b6a5e12e45983c5d80545258aa38f3b78',
            decimals: 10,
            symbol: 'ZCN',
        },
        {
            address: '0x677fe4bd9ee5a3e36d3662505977cc387cee7b1a',
            decimals: 8,
            symbol: 'GNC',
        },
        {
            address: '0x99ea4db9ee77acd40b119bd1dc4e33e1c070b80d',
            decimals: 18,
            symbol: 'QSP',
        },
        {
            address: '0xb705268213d593b8fd88d3fdeff93aff5cbdcfae',
            decimals: 18,
            symbol: 'IDEX',
        },
        {
            address: '0x6ca88cc8d9288f5cad825053b6a1b179b05c76fc',
            decimals: 18,
            symbol: 'UPT',
        },
        {
            address: '0x3597bfd533a99c9aa083587b074434e61eb0a258',
            decimals: 8,
            symbol: 'DENT',
        },
        {
            address: '0xec67005c4e498ec7f55e092bd1d35cbc47c91892',
            decimals: 18,
            symbol: 'MLN',
        },
        {
            address: '0xc00e94cb662c3520282e6f5717214004a7f26888',
            decimals: 18,
            symbol: 'COMP',
        },
        {
            address: '0x41ab1b6fcbb2fa9dced81acbdec13ea6315f2bf2',
            decimals: 18,
            symbol: 'XDCE',
        },
        {
            address: '0x464ebe77c293e473b48cfe96ddcf88fcf7bfdac0',
            decimals: 18,
            symbol: 'KRL',
        },
        {
            address: '0x6de037ef9ad2725eb40118bb1702ebb27e4aeb24',
            decimals: 18,
            symbol: 'RNDR',
        },
        {
            address: '0x3affcca64c2a6f4e3b6bd9c64cd2c969efd1ecbe',
            decimals: 18,
            symbol: 'DSLA',
        },
        {
            address: '0x0affa06e7fbe5bc9a764c979aa66e8256a631f02',
            decimals: 6,
            symbol: 'PLBT',
        },
        {
            address: '0x0fcbc31c503b4a9ed90e87f8ff46c318a4a14260',
            decimals: 8,
            symbol: 'QTF',
        },
        {
            address: '0x8ce9137d39326ad0cd6491fb5cc0cba0e089b6a9',
            decimals: 18,
            symbol: 'SXP',
        },
        {
            address: '0x89ab32156e46f46d02ade3fecbe5fc4243b9aaed',
            decimals: 18,
            symbol: 'PNT',
        },
        {
            address: '0xb8366948b4a3f07bcbf14eb1739daa42a26b07c4',
            decimals: 18,
            symbol: 'VBIT',
        },
        {
            address: '0xba9d4199fab4f26efe3551d490e3821486f135ba',
            decimals: 8,
            symbol: 'CHSB',
        },
        {
            address: '0x4730fb1463a6f1f44aeb45f6c5c422427f37f4d0',
            decimals: 18,
            symbol: 'FOUR',
        },
        {
            address: '0x0488401c3f535193fa8df029d9ffe615a06e74e6',
            decimals: 18,
            symbol: 'SRK',
        },
        {
            address: '0xba100000625a3754423978a60c9317c58a424e3d',
            decimals: 18,
            symbol: 'BAL',
        },
        {
            address: '0x4a220e6096b25eadb88358cb44068a3248254675',
            decimals: 18,
            symbol: 'QNT',
        },
        {
            address: '0x08ad83d779bdf2bbe1ad9cc0f78aa0d24ab97802',
            decimals: 18,
            symbol: 'RWS',
        },
        {
            address: '0x261b45d85ccfeabb11f022eba346ee8d1cd488c0',
            decimals: 18,
            symbol: 'rDAI',
        },
        {
            address: '0x1fcdce58959f536621d76f5b7ffb955baa5a672f',
            decimals: 18,
            symbol: 'FOR',
        },
        {
            address: '0x178c820f862b14f316509ec36b13123da19a6054',
            decimals: 18,
            symbol: 'EWTB',
        },
        {
            address: '0x1961b3331969ed52770751fc718ef530838b6dee',
            decimals: 18,
            symbol: 'BDG',
        },
        {
            address: '0x2af5d2ad76741191d15dfe7bf6ac92d4bd912ca3',
            decimals: 18,
            symbol: 'LEO',
        },
        {
            address: '0x4ddc2d193948926d02f9b1fe9e1daa0718270ed5',
            decimals: 8,
            symbol: 'cETH',
        },
        {
            address: '0xfc82bb4ba86045af6f327323a46e80412b91b27d',
            decimals: 18,
            symbol: 'PROM',
        },
        {
            address: '0x4e15361fd6b4bb609fa63c81a2be19d873717870',
            decimals: 18,
            symbol: 'FTM',
        },
        {
            address: '0x8ab7404063ec4dbcfd4598215992dc3f8ec853d7',
            decimals: 18,
            symbol: 'AKRO',
        },
        {
            address: '0xfc4a2cd574bdcc385173f03a6a52cc3b853bb9d4',
            decimals: 18,
            symbol: 'LKSC',
        },
        {
            address: '0xc719d010b63e5bbf2c0551872cd5316ed26acd83',
            decimals: 18,
            symbol: 'DIP',
        },
        {
            address: '0xac3211a5025414af2866ff09c23fc18bc97e79b1',
            decimals: 18,
            symbol: 'DOV',
        },
        {
            address: '0x5197fbe1a86679ff1360e27862bf88b0c5119bd8',
            decimals: 18,
            symbol: 'BPF',
        },
        {
            address: '0x0abdace70d3790235af448c88547603b945604ea',
            decimals: 18,
            symbol: 'DNT',
        },
        {
            address: '0x5732046a883704404f284ce41ffadd5b007fd668',
            decimals: 18,
            symbol: 'BLZ',
        },
        {
            address: '0xd5930c307d7395ff807f2921f12c5eb82131a789',
            decimals: 18,
            symbol: 'BOLT',
        },
        {
            address: '0x4e352cf164e64adcbad318c3a1e222e9eba4ce42',
            decimals: 18,
            symbol: 'MCB',
        },
        {
            address: '0x6524b87960c2d573ae514fd4181777e7842435d4',
            decimals: 18,
            symbol: 'BZN',
        },
        {
            address: '0x846c66cf71c43f80403b51fe3906b3599d63336f',
            decimals: 18,
            symbol: 'PMA',
        },
        {
            address: '0xcc4304a31d09258b0029ea7fe63d032f52e44efe',
            decimals: 18,
            symbol: 'SWAP',
        },
        {
            address: '0x7b123f53421b1bf8533339bfbdc7c98aa94163db',
            decimals: 18,
            symbol: 'buidl',
        },
        {
            address: '0x467bccd9d29f223bce8043b84e8c8b282827790f',
            decimals: 2,
            symbol: 'TEL',
        },
        {
            address: '0xb9eefc4b0d472a44be93970254df4f4016569d27',
            decimals: 7,
            symbol: 'XDB',
        },
        {
            address: '0x6c972b70c533e2e045f333ee28b9ffb8d717be69',
            decimals: 18,
            symbol: 'FRY',
        },
        {
            address: '0x9b53e429b0badd98ef7f01f03702986c516a5715',
            decimals: 18,
            symbol: 'HY',
        },
        {
            address: '0x954b890704693af242613edef1b603825afcd708',
            decimals: 18,
            symbol: 'CARD',
        },
        {
            address: '0x355c665e101b9da58704a8fddb5feef210ef20c0',
            decimals: 18,
            symbol: 'GOLDx',
        },
        {
            address: '0x6781a0f84c7e9e846dcb84a9a5bd49333067b104',
            decimals: 18,
            symbol: 'ZAP',
        },
        {
            address: '0x6fb3e0a217407efff7ca062d46c26e5d60a14d69',
            decimals: 18,
            symbol: 'IOTX',
        },
        {
            address: '0x0bb217e40f8a5cb79adf04e1aab60e5abd0dfc1e',
            decimals: 8,
            symbol: 'SWFTC',
        },
        {
            address: '0xa8b919680258d369114910511cc87595aec0be6d',
            decimals: 18,
            symbol: 'LYXe',
        },
        {
            address: '0x5dc60c4d5e75d22588fa17ffeb90a63e535efce0',
            decimals: 18,
            symbol: 'DKA',
        },
        {
            address: '0xe875c61d4721424a6988e5fa2dfb8d6ca6af5c64',
            decimals: 18,
            symbol: 'Pi',
        },
        {
            address: '0x0d438f3b5175bebc262bf23753c1e53d03432bde',
            decimals: 18,
            symbol: 'wNXM',
        },
        {
            address: '0x0bc529c00c6401aef6d220be8c6ea1667f6ad93e',
            decimals: 18,
            symbol: 'YFI',
        },
        {
            address: '0xa3bed4e1c75d00fa6f4e5e6922db7261b5e9acd2',
            decimals: 18,
            symbol: 'MTA',
        },
        {
            address: '0xfca59cd816ab1ead66534d82bc21e7515ce441cf',
            decimals: 18,
            symbol: 'RARI',
        },
        {
            address: '0x95172ccbe8344fecd73d0a30f54123652981bd6f',
            decimals: 18,
            symbol: 'LOCK',
        },
        {
            address: '0xdf801468a808a32656d2ed2d2d80b72a129739f4',
            decimals: 8,
            symbol: 'CUBE',
        },
        {
            address: '0x196f4727526ea7fb1e17b2071b3d8eaa38486988',
            decimals: 18,
            symbol: 'RSV',
        },
        {
            address: '0x4574562e9310a94f9ca962bd23168d8a06875b1a',
            decimals: 18,
            symbol: 'TROY',
        },
        {
            address: '0x05079687d35b93538cbd59fe5596380cae9054a9',
            decimals: 18,
            symbol: 'BTSG',
        },
        {
            address: '0x4fabb145d64652a948d72533023f6e7a623c7c53',
            decimals: 18,
            symbol: 'BUSD',
        },
        {
            address: '0x0f8c45b896784a1e408526b9300519ef8660209c',
            decimals: 8,
            symbol: 'XMX',
        },
        {
            address: '0xd49ff13661451313ca1553fd6954bd1d9b6e02b9',
            decimals: 18,
            symbol: 'ELEC',
        },
        {
            address: '0x0508331c4883dc6a0ffc4e0b239a38a68787e21b',
            decimals: 18,
            symbol: 'LIQ',
        },
        {
            address: '0x0a913bead80f321e7ac35285ee10d9d922659cb7',
            decimals: 18,
            symbol: 'DOS',
        },
        {
            address: '0x00000000441378008ea67f4284a57932b1c000a5',
            decimals: 18,
            symbol: 'TGBP',
        },
        {
            address: '0x3a3a65aab0dd2a17e3f1947ba16138cd37d08c04',
            decimals: 18,
            symbol: 'aETH',
        },
        {
            address: '0xa1d0e215a23d7030842fc67ce582a6afa3ccab83',
            decimals: 18,
            symbol: 'YFII',
        },
        {
            address: '0x5d4d57cd06fa7fe99e26fdc481b468f77f05073c',
            decimals: 18,
            symbol: 'NTK',
        },
        {
            address: '0xc3dd23a0a854b4f9ae80670f528094e9eb607ccb',
            decimals: 18,
            symbol: 'TRND',
        },
        {
            address: '0xc28e931814725bbeb9e670676fabbcb694fe7df2',
            decimals: 18,
            symbol: 'eQUAD',
        },
        {
            address: '0xebf4ca5319f406602eeff68da16261f1216011b5',
            decimals: 18,
            symbol: 'YOT',
        },
        {
            address: '0x491604c0fdf08347dd1fa4ee062a822a5dd06b5d',
            decimals: 18,
            symbol: 'CTSI',
        },
        {
            address: '0x221657776846890989a759ba2973e427dff5c9bb',
            decimals: 18,
            symbol: 'REPv2',
        },
        {
            address: '0x4ecb692b0fedecd7b486b4c99044392784877e8c',
            decimals: 4,
            symbol: 'CHERRY',
        },
        {
            address: '0x986ee2b944c42d017f52af21c4c69b84dbea35d8',
            decimals: 18,
            symbol: 'BMC',
        },
        {
            address: '0x6368e1e18c4c419ddfc608a0bed1ccb87b9250fc',
            decimals: 18,
            symbol: 'XTP',
        },
        {
            address: '0xf83301c5cd1ccbb86f466a6b3c53316ed2f8465a',
            decimals: 6,
            symbol: 'CMS',
        },
        {
            address: '0xbe9375c6a420d2eeb258962efb95551a5b722803',
            decimals: 18,
            symbol: 'STMX',
        },
        {
            address: '0x75231f58b43240c9718dd58b4967c5114342a86c',
            decimals: 18,
            symbol: 'OKB',
        },
        {
            address: '0x0e8d6b471e332f140e7d9dbb99e5e3822f728da6',
            decimals: 18,
            symbol: 'ABYSS',
        },
        {
            address: '0xf911a7ec46a2c6fa49193212fe4a2a9b95851c27',
            decimals: 9,
            symbol: 'XAMP',
        },
        {
            address: '0x11eef04c884e24d9b7b4760e7476d06ddf797f36',
            decimals: 18,
            symbol: 'MX',
        },
        {
            address: '0x5ca381bbfb58f0092df149bd3d243b08b9a8386e',
            decimals: 18,
            symbol: 'MXC',
        },
        {
            address: '0x95ad61b0a150d79219dcf64e1e6cc01f0b64c4ce',
            decimals: 18,
            symbol: 'SHIB',
        },
        {
            address: '0xcee1d3c3a02267e37e6b373060f79d5d7b9e1669',
            decimals: 18,
            symbol: 'YFFI',
        },
        {
            address: '0x8a7b7b9b2f7d0c63f66171721339705a6188a7d5',
            decimals: 18,
            symbol: 'EDOGE',
        },
        {
            address: '0x6f87d756daf0503d08eb8993686c7fc01dc44fb1',
            decimals: 18,
            symbol: 'TRADE',
        },
        {
            address: '0x6f259637dcd74c767781e37bc6133cd6a68aa161',
            decimals: 18,
            symbol: 'HT',
        },
        {
            address: '0x3d3ab800d105fbd2f97102675a412da3dc934357',
            decimals: 18,
            symbol: 'MSV',
        },
        {
            address: '0x4d953cf077c0c95ba090226e59a18fcf97db44ec',
            decimals: 18,
            symbol: 'MINI',
        },
        {
            address: '0x84ca8bc7997272c7cfb4d0cd3d55cd942b3c9419',
            decimals: 18,
            symbol: 'DIA',
        },
        {
            address: '0x0763fdccf1ae541a5961815c0872a8c5bc6de4d7',
            decimals: 18,
            symbol: 'SUKU',
        },
        {
            address: '0x2ba592f78db6436527729929aaf6c908497cb200',
            decimals: 18,
            symbol: 'CREAM',
        },
        {
            address: '0x314bd765cab4774b2e547eb0aa15013e03ff74d2',
            decimals: 6,
            symbol: 'PARTY',
        },
        {
            address: '0x814e0908b12a99fecf5bc101bb5d0b8b5cdf7d26',
            decimals: 18,
            symbol: 'MDT',
        },
        {
            address: '0x9e46a38f5daabe8683e10793b06749eef7d733d1',
            decimals: 18,
            symbol: 'NCT',
        },
        {
            address: '0x6b9f031d718dded0d681c20cb754f97b3bb81b78',
            decimals: 18,
            symbol: 'GEEQ',
        },
        {
            address: '0x9992ec3cf6a55b00978cddf2b27bc6882d88d1ec',
            decimals: 18,
            symbol: 'POLY',
        },
        {
            address: '0x76306f029f8f99effe509534037ba7030999e3cf',
            decimals: 18,
            symbol: 'ACR',
        },
        {
            address: '0x8c15ef5b4b21951d50e53e4fbda8298ffad25057',
            decimals: 18,
            symbol: 'FX',
        },
        {
            address: '0x589891a198195061cb8ad1a75357a3b7dbadd7bc',
            decimals: 18,
            symbol: 'COS',
        },
        {
            address: '0x28cb7e841ee97947a86b06fa4090c8451f64c0be',
            decimals: 18,
            symbol: 'YFL',
        },
        {
            address: '0xa0cf46eb152656c7090e769916eb44a138aaa406',
            decimals: 18,
            symbol: 'SPH',
        },
        {
            address: '0xa15c7ebe1f07caf6bff097d8a589fb8ac49ae5b3',
            decimals: 18,
            symbol: 'NPXS',
        },
        {
            address: '0x990f341946a3fdb507ae7e52d17851b87168017c',
            decimals: 18,
            symbol: 'STRONG',
        },
        {
            address: '0x595832f8fc6bf59c85c527fec3740a1b7a361269',
            decimals: 6,
            symbol: 'POWR',
        },
        {
            address: '0xbd2949f67dcdc549c6ebe98696449fa79d988a9f',
            decimals: 18,
            symbol: 'eMTRG',
        },
        {
            address: '0x56015bbe3c01fe05bc30a8a9a9fd9a88917e7db3',
            decimals: 18,
            symbol: 'CAT',
        },
        {
            address: '0xc75f15ada581219c95485c578e124df3985e4ce0',
            decimals: 18,
            symbol: 'ZZZ',
        },
        {
            address: '0xfbeea1c75e4c4465cb2fccc9c6d6afe984558e20',
            decimals: 18,
            symbol: 'DDIM',
        },
        {
            address: '0x695106ad73f506f9d0a9650a78019a93149ae07c',
            decimals: 8,
            symbol: 'BNS',
        },
        {
            address: '0x6226caa1857afbc6dfb6ca66071eb241228031a1',
            decimals: 18,
            symbol: 'LAR',
        },
        {
            address: '0xade00c28244d5ce17d72e40330b1c318cd12b7c3',
            decimals: 18,
            symbol: 'ADX',
        },
        {
            address: '0x476c5e26a75bd202a9683ffd34359c0cc15be0ff',
            decimals: 6,
            symbol: 'SRM',
        },
        {
            address: '0xc6e64729931f60d2c8bc70a27d66d9e0c28d1bf9',
            decimals: 9,
            symbol: 'FLOW',
        },
        {
            address: '0xd533a949740bb3306d119cc777fa900ba034cd52',
            decimals: 18,
            symbol: 'CRV',
        },
        {
            address: '0xae697f994fc5ebc000f8e22ebffee04612f98a0d',
            decimals: 18,
            symbol: 'LGCY',
        },
        {
            address: '0xd5525d397898e5502075ea5e830d8914f6f0affe',
            decimals: 8,
            symbol: 'MEME',
        },
        {
            address: '0x012ba3ae1074ae43a34a14bca5c4ed0af01b6e53',
            decimals: 18,
            symbol: 'TRUMP',
        },
        {
            address: '0x4b1e80cac91e2216eeb63e29b957eb91ae9c2be8',
            decimals: 18,
            symbol: 'JUP',
        },
        {
            address: '0xc813ea5e3b48bebeedb796ab42a30c5599b01740',
            decimals: 4,
            symbol: 'NIOX',
        },
        {
            address: '0x45f24baeef268bb6d63aee5129015d69702bcdfa',
            decimals: 18,
            symbol: 'YFV',
        },
        {
            address: '0x0e29e5abbb5fd88e28b2d355774e73bd47de3bcd',
            decimals: 18,
            symbol: 'HAKKA',
        },
        {
            address: '0xfe2786d7d1ccab8b015f6ef7392f67d778f8d8d7',
            decimals: 18,
            symbol: 'PRQ',
        },
        {
            address: '0x2baecdf43734f22fd5c152db08e3c27233f0c7d2',
            decimals: 18,
            symbol: 'OM',
        },
        {
            address: '0xde7d85157d9714eadf595045cc12ca4a5f3e2adb',
            decimals: 18,
            symbol: 'STPT',
        },
        {
            address: '0x68a118ef45063051eac49c7e647ce5ace48a68a5',
            decimals: 18,
            symbol: '$BASED',
        },
        {
            address: '0x0ff6ffcfda92c53f615a4a75d982f399c989366b',
            decimals: 18,
            symbol: 'LAYER',
        },
        {
            address: '0xbae226690d7dce1da1823f0bf811529b8229134a',
            decimals: 18,
            symbol: 'IMO',
        },
        {
            address: '0xa65523dbb2a0408e90b72d1b72fd0e7e2e6053fc',
            decimals: 18,
            symbol: 'MDNS',
        },
        {
            address: '0xa02d0b6bfce1dbd02b9cbb70e6b480333e8a86ec',
            decimals: 18,
            symbol: 'IPWT',
        },
        {
            address: '0x8a6f3bf52a26a21531514e23016eeae8ba7e7018',
            decimals: 8,
            symbol: 'MXX',
        },
        {
            address: '0xb81d70802a816b5dacba06d708b5acf19dcd436d',
            decimals: 18,
            symbol: 'DEXG',
        },
        {
            address: '0xeca82185adce47f39c684352b0439f030f860318',
            decimals: 18,
            symbol: 'PERL',
        },
        {
            address: '0x3984dd8925892e34adf0a8d6f710651becf7fa3e',
            decimals: 8,
            symbol: 'ETF',
        },
        {
            address: '0x3505f494c3f0fed0b594e01fa41dd3967645ca39',
            decimals: 18,
            symbol: 'SWM',
        },
        {
            address: '0x3845badade8e6dff049820680d1f14bd3903a5d0',
            decimals: 18,
            symbol: 'SAND',
        },
        {
            address: '0x5b09a0371c1da44a8e24d36bf5deb1141a84d875',
            decimals: 18,
            symbol: 'MAD',
        },
        {
            address: '0x0af44e2784637218dd1d32a322d44e603a8f0c6a',
            decimals: 18,
            symbol: 'MTX',
        },
        {
            address: '0x4fe5851c9af07df9e5ad8217afae1ea72737ebda',
            decimals: 18,
            symbol: 'OPT',
        },
        {
            address: '0x3d658390460295fb963f54dc0899cfb1c30776df',
            decimals: 8,
            symbol: 'Coval',
        },
        {
            address: '0x3d3d35bb9bec23b06ca00fe472b50e7a4c692c30',
            decimals: 18,
            symbol: 'VIDYA',
        },
        {
            address: '0x43257ddcf6f22987062a7dbe032ffa67e4e0bb3a',
            decimals: 4,
            symbol: 'HBTT',
        },
        {
            address: '0xab37e1358b639fd877f015027bb62d3ddaa7557e',
            decimals: 8,
            symbol: 'LIEN',
        },
        {
            address: '0x73374ea518de7addd4c2b624c0e8b113955ee041',
            decimals: 18,
            symbol: 'JGN',
        },
        {
            address: '0xc93a59888e7e6f2849ba94acf767266299c4c415',
            decimals: 8,
            symbol: 'USDC',
        },
        {
            address: '0xbf2179859fc6d5bee9bf9158632dc51678a4100e',
            decimals: 18,
            symbol: 'ELF',
        },
        {
            address: '0x36f3fd68e7325a35eb768f1aedaae9ea0689d723',
            decimals: 18,
            symbol: 'ESD',
        },
        {
            address: '0x63f88a2298a5c4aee3c216aa6d926b184a4b2437',
            decimals: 18,
            symbol: 'GAME',
        },
        {
            address: '0x6b3595068778dd592e39a122f4f5a5cf09c90fe2',
            decimals: 18,
            symbol: 'SUSHI',
        },
        {
            address: '0xc4c2614e694cf534d407ee49f8e44d125e4681c4',
            decimals: 18,
            symbol: 'CHAIN',
        },
        {
            address: '0x147faf8de9d8d8daae129b187f0d02d819126750',
            decimals: 18,
            symbol: 'GEO',
        },
        {
            address: '0x6a126b1a4d6a66370930eca642eff93d8e1be321',
            decimals: 12,
            symbol: 'SXHC',
        },
        {
            address: '0x0316eb71485b0ab14103307bf65a021042c6d380',
            decimals: 18,
            symbol: 'HBTC',
        },
        {
            address: '0xddb3422497e61e13543bea06989c0789117555c5',
            decimals: 18,
            symbol: 'COTI',
        },
        {
            address: '0x38e4adb44ef08f22f5b5b76a8f0c2d0dcbe7dca1',
            decimals: 18,
            symbol: 'CVP',
        },
        {
            address: '0x73ee6d7e6b203125add89320e9f343d65ec7c39a',
            decimals: 18,
            symbol: 'AXI',
        },
        {
            address: '0x95da1e3eecae3771acb05c145a131dca45c67fd4',
            decimals: 18,
            symbol: 'ESC',
        },
        {
            address: '0xd3e8695d2bef061eab38b5ef526c0f714108119c',
            decimals: 18,
            symbol: 'YFIVE',
        },
        {
            address: '0x6a6c2ada3ce053561c2fbc3ee211f23d9b8c520a',
            decimals: 18,
            symbol: 'TON',
        },
        {
            address: '0x4b4f5286e0f93e965292b922b9cd1677512f1222',
            decimals: 18,
            symbol: 'YUNO',
        },
        {
            address: '0x056fd409e1d7a124bd7017459dfea2f387b6d5cd',
            decimals: 2,
            symbol: 'GUSD',
        },
        {
            address: '0xd9a947789974bad9be77e45c2b327174a9c59d71',
            decimals: 18,
            symbol: 'YSR',
        },
        {
            address: '0x1e18821e69b9faa8e6e75dffe54e7e25754beda0',
            decimals: 18,
            symbol: 'KIMCHI',
        },
        {
            address: '0xa0246c9032bc3a600820415ae600c6388619a14d',
            decimals: 18,
            symbol: 'FARM',
        },
        {
            address: '0x90d702f071d2af33032943137ad0ab4280705817',
            decimals: 18,
            symbol: 'YFFS',
        },
        {
            address: '0x3e780920601d61cedb860fe9c4a90c9ea6a35e78',
            decimals: 18,
            symbol: 'BOOST',
        },
        {
            address: '0xf4cd3d3fda8d7fd6c5a500203e38640a70bf9577',
            decimals: 18,
            symbol: 'Yf-DAI',
        },
        {
            address: '0x41efc0253ee7ea44400abb5f907fdbfdebc82bec',
            decimals: 18,
            symbol: '$AAPL',
        },
        {
            address: '0x59c3ba7a0a4c26955037710654f60d368303b3e1',
            decimals: 18,
            symbol: 'ZNA',
        },
        {
            address: '0x79ff677af16e0e173c55ae571e5d9852a1c8f2ff',
            decimals: 8,
            symbol: 'GAX',
        },
        {
            address: '0x5bc25f649fc4e26069ddf4cf4010f9f706c23831',
            decimals: 18,
            symbol: 'DUSD',
        },
        {
            address: '0xed0439eacf4c4965ae4613d77a5c2efe10e5f183',
            decimals: 18,
            symbol: 'SHROOM',
        },
        {
            address: '0x177ba0cac51bfc7ea24bad39d81dcefd59d74faa',
            decimals: 18,
            symbol: 'KIF',
        },
        {
            address: '0xf80b96baff90115fffa4fa312a5e8d8969948dbd',
            decimals: 18,
            symbol: 'YBFI',
        },
        {
            address: '0xaa19961b6b858d9f18a115f25aa1d98abc1fdba8',
            decimals: 18,
            symbol: 'LCS',
        },
        {
            address: '0x85eefb3126c35d47ef8fc5f6f01ecb1402e085a4',
            decimals: 18,
            symbol: 'VOTES',
        },
        {
            address: '0x27c70cd1946795b66be9d954418546998b546634',
            decimals: 18,
            symbol: 'LEASH',
        },
        {
            address: '0xa93d5cfaa41193b13321c035b4bdd2b534172762',
            decimals: 18,
            symbol: 'DREAM',
        },
        {
            address: '0x557b933a7c2c45672b610f8954a3deb39a51a8ca',
            decimals: 18,
            symbol: 'REVV',
        },
        {
            address: '0x668dbf100635f593a3847c0bdaf21f0a09380188',
            decimals: 18,
            symbol: 'BNSD',
        },
        {
            address: '0x94939d55000b31b7808904a80aa7bab05ef59ed6',
            decimals: 18,
            symbol: 'JIAOZI',
        },
        {
            address: '0x05fb86775fd5c16290f1e838f5caaa7342bd9a63',
            decimals: 8,
            symbol: 'HAI',
        },
        {
            address: '0xb8baa0e4287890a5f79863ab62b7f175cecbd433',
            decimals: 18,
            symbol: 'SWRV',
        },
        {
            address: '0x035bfe6057e15ea692c0dfdcab3bb41a64dd2ad4',
            decimals: 18,
            symbol: 'ULU',
        },
        {
            address: '0x226bb599a12c826476e3a771454697ea52e9e220',
            decimals: 8,
            symbol: 'PRO',
        },
        {
            address: '0xff56cc6b1e6ded347aa0b7676c85ab0b3d08b0fa',
            decimals: 18,
            symbol: 'ORBS',
        },
        {
            address: '0x6e36556b3ee5aa28def2a8ec3dae30ec2b208739',
            decimals: 18,
            symbol: 'BUILD',
        },
        {
            address: '0xdb5c3c46e28b53a39c255aa39a411dd64e5fed9c',
            decimals: 18,
            symbol: 'NCR',
        },
        {
            address: '0xdc38a4846d811572452cb4ce747dc9f5f509820f',
            decimals: 18,
            symbol: 'SYFI',
        },
        {
            address: '0x6369c3dadfc00054a42ba8b2c09c48131dd4aa38',
            decimals: 18,
            symbol: 'MPH',
        },
        {
            address: '0x666d875c600aa06ac1cf15641361dec3b00432ef',
            decimals: 8,
            symbol: 'BTSE',
        },
        {
            address: '0xb6ff96b8a8d214544ca0dbc9b33f7ad6503efd32',
            decimals: 18,
            symbol: 'SYNC',
        },
        {
            address: '0x50026ad58b338cf3eccc2b422deb8faa725f377f',
            decimals: 8,
            symbol: 'STEP',
        },
        {
            address: '0x00a8b738e453ffd858a7edf03bccfe20412f0eb0',
            decimals: 18,
            symbol: 'ALBT',
        },
        {
            address: '0xff20817765cb7f73d4bde2e66e067e58d11095c2',
            decimals: 18,
            symbol: 'AMP',
        },
        {
            address: '0xbc396689893d065f41bc2c6ecbee5e0085233447',
            decimals: 18,
            symbol: 'PERP',
        },
        {
            address: '0xc0e47007e084eef3ee58eb33d777b3b4ca98622f',
            decimals: 18,
            symbol: 'XSTAR',
        },
        {
            address: '0x488e0369f9bc5c40c002ea7c1fe4fd01a198801c',
            decimals: 18,
            symbol: 'GOF',
        },
        {
            address: '0x68a3637ba6e75c0f66b61a42639c4e9fcd3d4824',
            decimals: 18,
            symbol: 'MOON',
        },
        {
            address: '0x8eef5a82e6aa222a60f009ac18c24ee12dbf4b41',
            decimals: 18,
            symbol: 'TXL',
        },
        {
            address: '0xc34ef872a751a10e2a80243ef826ec0942fe3f14',
            decimals: 18,
            symbol: 'BTCu',
        },
        {
            address: '0xdea67845a51e24461d5fed8084e69b426af3d5db',
            decimals: 18,
            symbol: 'HTRE',
        },
        {
            address: '0x429881672b9ae42b8eba0e26cd9c73711b891ca5',
            decimals: 18,
            symbol: 'PICKLE',
        },
        {
            address: '0xc28e27870558cf22add83540d2126da2e4b464c2',
            decimals: 18,
            symbol: 'SASHIMI',
        },
        {
            address: '0x1494ca1f11d487c2bbe4543e90080aeba4ba3c2b',
            decimals: 18,
            symbol: 'DPI',
        },
        {
            address: '0xa974c709cfb4566686553a20790685a47aceaa33',
            decimals: 18,
            symbol: 'XIN',
        },
        {
            address: '0xea004e8fa3701b8e58e41b78d50996e0f7176cbd',
            decimals: 18,
            symbol: 'YFFC',
        },
        {
            address: '0x5befbb272290dd5b8521d4a938f6c4757742c430',
            decimals: 18,
            symbol: 'XFI',
        },
        {
            address: '0xe66747a101bff2dba3697199dcce5b743b454759',
            decimals: 18,
            symbol: 'GT',
        },
        {
            address: '0x7240ac91f01233baaf8b064248e80feaa5912ba3',
            decimals: 18,
            symbol: 'OCTO',
        },
        {
            address: '0x929d87a3aaabc18da7f34945c896f4500cdb0043',
            decimals: 18,
            symbol: 'HOC',
        },
        {
            address: '0x6c5ba91642f10282b576d91922ae6448c9d52f4e',
            decimals: 18,
            symbol: 'PHA',
        },
        {
            address: '0x2e1e15c44ffe4df6a0cb7371cd00d5028e571d14',
            decimals: 18,
            symbol: 'MTLX',
        },
        {
            address: '0x584bc13c7d411c00c01a62e8019472de68768430',
            decimals: 18,
            symbol: 'HEGIC',
        },
        {
            address: '0x7968bc6a03017ea2de509aaa816f163db0f35148',
            decimals: 6,
            symbol: 'HGET',
        },
        {
            address: '0xaa62a002ce856d9fe1874e7f8558a38fc1e49cca',
            decimals: 18,
            symbol: 'YEET',
        },
        {
            address: '0x3a8cccb969a61532d1e6005e2ce12c200caece87',
            decimals: 18,
            symbol: 'Titan',
        },
        {
            address: '0x15d4c048f83bd7e37d49ea4c83a07267ec4203da',
            decimals: 8,
            symbol: 'GALA',
        },
        {
            address: '0xce9afaf5b0da6ce0366ab40435a48ccff65d2ed7',
            decimals: 18,
            symbol: 'BOBA',
        },
        {
            address: '0x3f382dbd960e3a9bbceae22651e88158d2791550',
            decimals: 18,
            symbol: 'GHST',
        },
        {
            address: '0xa31b1767e09f842ecfd4bc471fe44f830e3891aa',
            decimals: 18,
            symbol: 'ROOBEE',
        },
        {
            address: '0x7b0f66fa5cf5cc28280c1e7051af881e06579362',
            decimals: 18,
            symbol: 'YFARMER',
        },
        {
            address: '0x5f64ab1544d28732f0a24f4713c2c8ec0da089f0',
            decimals: 18,
            symbol: 'DEXTF',
        },
        {
            address: '0xa91ac63d040deb1b7a5e4d4134ad23eb0ba07e14',
            decimals: 18,
            symbol: 'BEL',
        },
        {
            address: '0xf8c3527cc04340b208c854e985240c02f7b7793f',
            decimals: 18,
            symbol: 'FRONT',
        },
        {
            address: '0x81313f7c5c9c824236c9e4cba3ac4b049986e756',
            decimals: 18,
            symbol: 'HIPPO',
        },
        {
            address: '0x3931fb946089e8afb96d80059ace0871857c4762',
            decimals: 18,
            symbol: 'SLEEP',
        },
        {
            address: '0xf21661d0d1d76d3ecb8e1b9f1c923dbfffae4097',
            decimals: 18,
            symbol: 'RIO',
        },
        {
            address: '0x55a290f08bb4cae8dcf1ea5635a3fcfd4da60456',
            decimals: 18,
            symbol: 'BITTO',
        },
        {
            address: '0x1f9840a85d5af5bf1d1762f925bdaddc4201f984',
            decimals: 18,
            symbol: 'UNI',
        },
        {
            address: '0xca1207647ff814039530d7d35df0e1dd2e91fa84',
            decimals: 18,
            symbol: 'DHT',
        },
        {
            address: '0x3e9bc21c9b189c09df3ef1b824798658d5011937',
            decimals: 18,
            symbol: 'LINA',
        },
        {
            address: '0x4cf89ca06ad997bc732dc876ed2a7f26a9e7f361',
            decimals: 18,
            symbol: 'MYST',
        },
        {
            address: '0xdff8cd1313c6bde1b9282a24f8c996e487f74f80',
            decimals: 18,
            symbol: 'GOV',
        },
        {
            address: '0xb1dc9124c395c1e97773ab855d66e879f053a289',
            decimals: 18,
            symbol: 'YAX',
        },
        {
            address: '0xe33586055d39b7d2d17be6f2ae0671447e98c72b',
            decimals: 18,
            symbol: 'FXSWAP',
        },
        {
            address: '0x790ace920baf3af2b773d4556a69490e077f6b4a',
            decimals: 18,
            symbol: 'KANI',
        },
        {
            address: '0x49e833337ece7afe375e44f4e3e8481029218e5c',
            decimals: 18,
            symbol: 'VALUE',
        },
        {
            address: '0xbd74429c4991b1e9da8e747861447b570f503330',
            decimals: 3,
            symbol: 'DRAK',
        },
        {
            address: '0x41bc0913ed789428e107c4ea9ed007815c5a8230',
            decimals: 18,
            symbol: 'KOMP',
        },
        {
            address: '0x8daebade922df735c38c80c7ebd708af50815faa',
            decimals: 18,
            symbol: 'TBTC',
        },
        {
            address: '0x32a7c02e79c4ea1008dd6564b35f131428673c41',
            decimals: 18,
            symbol: 'CRU',
        },
        {
            address: '0xce7895c567dcf7b950890dea3360872524eeca41',
            decimals: 18,
            symbol: 'TRUMP',
        },
        {
            address: '0x9b06d48e0529ecf05905ff52dd426ebec0ea3011',
            decimals: 18,
            symbol: 'XSP',
        },
        {
            address: '0x86ed939b500e121c0c5f493f399084db596dad20',
            decimals: 18,
            symbol: 'SPC',
        },
        {
            address: '0x042afd3869a47e2d5d42cc787d5c9e19df32185f',
            decimals: 18,
            symbol: 'POT',
        },
        {
            address: '0xcae516aa57d04ebf9b92813050282333f7587d2f',
            decimals: 18,
            symbol: 'UNI',
        },
        {
            address: '0x653430560be843c4a3d143d0110e896c2ab8ac0d',
            decimals: 16,
            symbol: 'MOF',
        },
        {
            address: '0x60d64d8ff2b074578fd64998476a8554c6320869',
            decimals: 18,
            symbol: 'GST',
        },
        {
            address: '0x7c8155909cd385f120a56ef90728dd50f9ccbe52',
            decimals: 15,
            symbol: 'NII',
        },
        {
            address: '0xe63684bcf2987892cefb4caa79bd21b34e98a291',
            decimals: 18,
            symbol: 'KFC',
        },
        {
            address: '0xd075e95423c5c4ba1e122cae0f4cdfa19b82881b',
            decimals: 18,
            symbol: 'wPE',
        },
        {
            address: '0x70e8de73ce538da2beed35d14187f6959a8eca96',
            decimals: 6,
            symbol: 'XSGD',
        },
        {
            address: '0xcbcc9bd65218529065847b812e1451e9968452a9',
            decimals: 18,
            symbol: 'MILK',
        },
        {
            address: '0x2f6081e3552b1c86ce4479b80062a1dda8ef23e3',
            decimals: 9,
            symbol: 'USDx',
        },
        {
            address: '0x39795344cbcc76cc3fb94b9d1b15c23c2070c66d',
            decimals: 9,
            symbol: 'SHARE',
        },
        {
            address: '0x56ef04219a6afe82fa298023364ecfd84f137259',
            decimals: 18,
            symbol: 'DTO',
        },
        {
            address: '0x213c53c96a01a89e6dcc5683cf16473203e17513',
            decimals: 18,
            symbol: 'DSS',
        },
        {
            address: '0x2a8e1e676ec238d8a992307b495b45b3feaa5e86',
            decimals: 18,
            symbol: 'OUSD',
        },
        {
            address: '0xb2089a7069861c8d90c8da3aacab8e9188c0c531',
            decimals: 8,
            symbol: 'GREEN',
        },
        {
            address: '0x5218e472cfcfe0b64a064f055b43b4cdc9efd3a6',
            decimals: 18,
            symbol: 'eRSDL',
        },
        {
            address: '0xdb0f18081b505a7de20b18ac41856bcb4ba86a1a',
            decimals: 9,
            symbol: 'pWING',
        },
        {
            address: '0x829aa8e3455d0d6f18ed46121a64268ca0782465',
            decimals: 6,
            symbol: 'AUTU',
        },
        {
            address: '0xa150db9b1fa65b44799d4dd949d922c0a33ee606',
            decimals: 0,
            symbol: 'DRC',
        },
        {
            address: '0x058391e75ee8f675c7eeca35fd6d12b11e73b4b6',
            decimals: 18,
            symbol: 'SUPER',
        },
        {
            address: '0xb2d74b7a454eda300c6e633f5b593d128c0c0dcf',
            decimals: 18,
            symbol: 'QUB',
        },
        {
            address: '0x35e78b3982e87ecfd5b3f3265b601c046cdbe232',
            decimals: 18,
            symbol: 'XAI',
        },
        {
            address: '0x5da3e93fab0580bd7a532a741ac5f886376eff46',
            decimals: 8,
            symbol: 'GNEISS',
        },
        {
            address: '0x09a59b9b677cbaad89cd1ba37ea1d42d3449a6fc',
            decimals: 18,
            symbol: 'GALAXY',
        },
        {
            address: '0x05d3606d5c81eb9b7b18530995ec9b29da05faba',
            decimals: 18,
            symbol: 'TOMOE',
        },
        {
            address: '0x25e1474170c4c0aa64fa98123bdc8db49d7802fa',
            decimals: 18,
            symbol: 'BID',
        },
        {
            address: '0xa4f9cec920ca520a7feb2c3a63050e08967bc111',
            decimals: 4,
            symbol: 'DOOM',
        },
        {
            address: '0xc57d533c50bc22247d49a368880fb49a1caa39f7',
            decimals: 18,
            symbol: 'PTF',
        },
        {
            address: '0x155ff1a85f440ee0a382ea949f24ce4e0b751c65',
            decimals: 18,
            symbol: 'EYE',
        },
        {
            address: '0xa0bed124a09ac2bd941b10349d8d224fe3c955eb',
            decimals: 18,
            symbol: 'DEPAY',
        },
        {
            address: '0xecbf566944250dde88322581024e611419715f7a',
            decimals: 9,
            symbol: 'xBTC',
        },
        {
            address: '0x1b073382e63411e3bcffe90ac1b9a43fefa1ec6f',
            decimals: 8,
            symbol: 'BEST',
        },
        {
            address: '0x26cf82e4ae43d31ea51e72b663d26e26a75af729',
            decimals: 18,
            symbol: 'mbBASED',
        },
        {
            address: '0x1c478637deb86a26e14659211190104e70fc3091',
            decimals: 18,
            symbol: 'PUB',
        },
        {
            address: '0x0258f474786ddfd37abce6df6bbb1dd5dfc4434a',
            decimals: 8,
            symbol: 'ORN',
        },
        {
            address: '0x27702a26126e0b3702af63ee09ac4d1a084ef628',
            decimals: 18,
            symbol: 'ALEPH',
        },
        {
            address: '0x967da4048cd07ab37855c090aaf366e4ce1b9f48',
            decimals: 18,
            symbol: 'OCEAN',
        },
        {
            address: '0x3c1ee45e11e90fc20427be5e6db5fee557f1e07f',
            decimals: 18,
            symbol: 'SLEEP',
        },
        {
            address: '0xac1ec3143b89d5b263d9194db216ea068e0f3dc9',
            decimals: 0,
            symbol: 'BSC',
        },
        {
            address: '0xaf9f549774ecedbd0966c52f250acc548d3f36e5',
            decimals: 18,
            symbol: 'RFuel',
        },
        {
            address: '0xa8c8cfb141a3bb59fea1e2ea6b79b5ecbcd7b6ca',
            decimals: 18,
            symbol: 'NOIA',
        },
        {
            address: '0xcf3c8be2e2c42331da80ef210e9b1b307c03d36a',
            decimals: 18,
            symbol: 'BEPRO',
        },
        {
            address: '0x8c5e6fdfa54b0027e10d9438e8515b6fa6c38fcc',
            decimals: 18,
            symbol: 'ICET',
        },
        {
            address: '0x5ade7ae8660293f2ebfcefaba91d141d72d221e8',
            decimals: 18,
            symbol: 'EMN',
        },
        {
            address: '0xc237868a9c5729bdf3173dddacaa336a0a5bb6e0',
            decimals: 8,
            symbol: 'WWGR',
        },
        {
            address: '0x022057c3ef9166433750165bfda21d52988e0756',
            decimals: 18,
            symbol: 'AO',
        },
        {
            address: '0xe9a95d175a5f4c9369f3b74222402eb1b837693b',
            decimals: 8,
            symbol: 'NOW',
        },
        {
            address: '0xaba53e2d526c2b37eeb97da4e60da82bdcc0a7a7',
            decimals: 18,
            symbol: 'gDAI',
        },
        {
            address: '0x43dfc4159d86f3a37a5a4b3d4580b888ad7d4ddd',
            decimals: 18,
            symbol: 'DODO',
        },
        {
            address: '0xde4ee8057785a7e8e800db58f9784845a5c2cbd6',
            decimals: 18,
            symbol: 'DEXE',
        },
        {
            address: '0x83e6f1e41cdd28eaceb20cb649155049fac3d5aa',
            decimals: 18,
            symbol: 'POLS',
        },
        {
            address: '0xf6537fe0df7f0cc0985cf00792cc98249e73efa0',
            decimals: 8,
            symbol: 'GIV',
        },
        {
            address: '0x69051f5288bfb98d4471daace4c07dedddea1ee5',
            decimals: 2,
            symbol: 'DBBY',
        },
        {
            address: '0x83e2be8d114f9661221384b3a50d24b96a5653f5',
            decimals: 18,
            symbol: 'ZXC',
        },
        {
            address: '0x8e30ea2329d95802fd804f4291220b0e2f579812',
            decimals: 18,
            symbol: 'DVP',
        },
        {
            address: '0x4a64515e5e1d1073e83f30cb97bed20400b66e10',
            decimals: 18,
            symbol: 'WZEC',
        },
        {
            address: '0x9c2dc0c3cc2badde84b0025cf4df1c5af288d835',
            decimals: 18,
            symbol: 'COR',
        },
        {
            address: '0xdc9ac3c20d1ed0b540df9b1fedc10039df13f99c',
            decimals: 18,
            symbol: 'UTK',
        },
        {
            address: '0x06a01a4d579479dd5d884ebf61a31727a3d8d442',
            decimals: 8,
            symbol: 'Skey',
        },
        {
            address: '0xcf9c692f7e62af3c571d4173fd4abf9a3e5330d0',
            decimals: 18,
            symbol: 'ONIGIRI',
        },
        {
            address: '0x9393fdc77090f31c7db989390d43f454b1a6e7f3',
            decimals: 3,
            symbol: 'DEC',
        },
        {
            address: '0xd31695a1d35e489252ce57b129fd4b1b05e6acac',
            decimals: 18,
            symbol: 'TKP',
        },
        {
            address: '0xa7925aa2a6e4575ab0c74d169f3bc3e03d4c319a',
            decimals: 4,
            symbol: 'BETTER',
        },
        {
            address: '0x3383c5a8969dc413bfddc9656eb80a1408e4ba20',
            decimals: 18,
            symbol: 'wANATHA',
        },
        {
            address: '0x674c6ad92fd080e4004b2312b45f796a192d27a0',
            decimals: 18,
            symbol: 'USDN',
        },
        {
            address: '0x949bed886c739f1a3273629b3320db0c5024c719',
            decimals: 9,
            symbol: 'AMIS',
        },
        {
            address: '0x7dfb72a2aad08c937706f21421b15bfc34cba9ca',
            decimals: 18,
            symbol: '$MULAN',
        },
        {
            address: '0x454cb9d0845bb4a28462f98c21a4fafd16ceb25f',
            decimals: 18,
            symbol: 'YLAB',
        },
        {
            address: '0x7fc66500c84a76ad7e9c93437bfc5ac33e2ddae9',
            decimals: 18,
            symbol: 'AAVE',
        },
        {
            address: '0x4da27a545c0c5b758a6ba100e3a049001de870f5',
            decimals: 18,
            symbol: 'stkAAVE',
        },
        {
            address: '0x667102bd3413bfeaa3dffb48fa8288819e480a88',
            decimals: 8,
            symbol: 'TKX',
        },
        {
            address: '0x1c48f86ae57291f7686349f12601910bd8d470bb',
            decimals: 18,
            symbol: 'USDK',
        },
        {
            address: '0x16d85679defa6a120a6691bd575ba60f4e76ba69',
            decimals: 18,
            symbol: 'SNAP',
        },
        {
            address: '0xd9ec3ff1f8be459bb9369b4e79e9ebcf7141c093',
            decimals: 18,
            symbol: 'KAI',
        },
        {
            address: '0x8a2279d4a90b6fe1c4b30fa660cc9f926797baa2',
            decimals: 6,
            symbol: 'CHR',
        },
        {
            address: '0xa849eaae994fb86afa73382e9bd88c2b6b18dc71',
            decimals: 18,
            symbol: 'MVL',
        },
        {
            address: '0xdd16ec0f66e54d453e6756713e533355989040e4',
            decimals: 18,
            symbol: 'TEN',
        },
        {
            address: '0x892a6f9df0147e5f079b0993f486f9aca3c87881',
            decimals: 9,
            symbol: 'xFUND',
        },
        {
            address: '0x0954906da0bf32d5479e25f46056d22f08464cab',
            decimals: 18,
            symbol: 'INDEX',
        },
        {
            address: '0x40e7705254494a7e61d5b7c86da50225ddc3daae',
            decimals: 18,
            symbol: 'yPLT',
        },
        {
            address: '0x1d1dad28770ad8af00bbfc71fad222a3aaef7148',
            decimals: 18,
            symbol: 'LUCO',
        },
        {
            address: '0xccbf21ba6ef00802ab06637896b799f7101f54a2',
            decimals: 18,
            symbol: 'BUBO',
        },
        {
            address: '0x362bc847a3a9637d3af6624eec853618a43ed7d2',
            decimals: 18,
            symbol: 'PRQ',
        },
        {
            address: '0x9cf4679c67bee8da2d6f58c64592fff6bee79330',
            decimals: 18,
            symbol: 'Yfic',
        },
        {
            address: '0xfe9a29ab92522d14fc65880d817214261d8479ae',
            decimals: 18,
            symbol: 'SNOW',
        },
        {
            address: '0xe1406825186d63980fd6e2ec61888f7b91c4bae4',
            decimals: 18,
            symbol: 'VBTC',
        },
        {
            address: '0x03042482d64577a7bdb282260e2ea4c8a89c064b',
            decimals: 18,
            symbol: 'CNTR',
        },
        {
            address: '0xf8e386eda857484f5a12e4b5daa9984e06e73705',
            decimals: 18,
            symbol: 'IND',
        },
        {
            address: '0xb6ca7399b4f9ca56fc27cbff44f4d2e4eef1fc81',
            decimals: 18,
            symbol: 'MUSE',
        },
        {
            address: '0x25c7b64a93eb1261e130ec21a3e9918caa38b611',
            decimals: 18,
            symbol: 'WVG0',
        },
        {
            address: '0x33c2da7fd5b125e629b3950f3c38d7f721d7b30d',
            decimals: 18,
            symbol: 'Seal',
        },
        {
            address: '0x4dfae3690b93c47470b03036a17b23c1be05127c',
            decimals: 18,
            symbol: 'PEPE',
        },
        {
            address: '0xb0806a30b9a30a2186a0ca58d8219689ac84656a',
            decimals: 18,
            symbol: 'DGET',
        },
        {
            address: '0xf0b277645e6db1824781e98bff456c1f4ec38d26',
            decimals: 18,
            symbol: 'UYTY',
        },
        {
            address: '0x723cbfc05e2cfcc71d3d89e770d32801a5eef5ab',
            decimals: 8,
            symbol: 'BTCP',
        },
        {
            address: '0x33d0568941c0c64ff7e0fb4fba0b11bd37deed9f',
            decimals: 18,
            symbol: 'RAMP',
        },
        {
            address: '0xa1faa113cbe53436df28ff0aee54275c13b40975',
            decimals: 18,
            symbol: 'ALPHA',
        },
        {
            address: '0x40d063d409de5be4fe6aa45048ce68c7aec8c152',
            decimals: 0,
            symbol: 'COP',
        },
        {
            address: '0xff3401d00a225300d6dde2ee1968f4df795169f0',
            decimals: 18,
            symbol: 'NDL',
        },
        {
            address: '0xc4a11aaf6ea915ed7ac194161d2fc9384f15bff2',
            decimals: 27,
            symbol: 'WTON',
        },
        {
            address: '0x6e0dade58d2d89ebbe7afc384e3e4f15b70b14d8',
            decimals: 18,
            symbol: 'QRX',
        },
        {
            address: '0x72f020f8f3e8fd9382705723cd26380f8d0c66bb',
            decimals: 18,
            symbol: 'PLOT',
        },
        {
            address: '0x0202be363b8a4820f3f4de7faf5224ff05943ab1',
            decimals: 18,
            symbol: 'UFT',
        },
        {
            address: '0xeb7e037140c1e2815f892830721778131be0b0df',
            decimals: 18,
            symbol: 'WCDS',
        },
        {
            address: '0x87edffde3e14c7a66c9b9724747a1c5696b742e6',
            decimals: 18,
            symbol: 'SWAG',
        },
        {
            address: '0x96c520a79bf62c955eaa044f600f67e3ecfeff52',
            decimals: 18,
            symbol: 'LAND',
        },
        {
            address: '0x4fe83213d56308330ec302a8bd641f1d0113a4cc',
            decimals: 18,
            symbol: 'NU',
        },
        {
            address: '0x25fd87d79a9fbe31b40a04728e00406311ccc369',
            decimals: 2,
            symbol: 'EURO',
        },
        {
            address: '0x630d98424efe0ea27fb1b3ab7741907dffeaad78',
            decimals: 8,
            symbol: 'PEAK',
        },
        {
            address: '0xadb2437e6f65682b85f814fbc12fec0508a7b1d0',
            decimals: 18,
            symbol: 'UNCX',
        },
        {
            address: '0xeef9f339514298c6a857efcfc1a762af84438dee',
            decimals: 18,
            symbol: 'HEZ',
        },
        {
            address: '0xa58a4f5c4bb043d2cc1e170613b74e767c94189b',
            decimals: 18,
            symbol: 'UTU',
        },
        {
            address: '0xf1f955016ecbcd7321c7266bccfb96c68ea5e49b',
            decimals: 18,
            symbol: 'RLY',
        },
        {
            address: '0xd101dcc414f310268c37eeb4cd376ccfa507f571',
            decimals: 18,
            symbol: 'RSC',
        },
        {
            address: '0xec213f83defb583af3a000b1c0ada660b1902a0f',
            decimals: 18,
            symbol: 'PRE',
        },
        {
            address: '0xaea46a60368a7bd060eec7df8cba43b7ef41ad85',
            decimals: 18,
            symbol: 'FET',
        },
        {
            address: '0xf6ec87dfe1ed3a7256cc0c38e3c8139103e9af3b',
            decimals: 18,
            symbol: 'GENE',
        },
        {
            address: '0xb1df7ce84253ffcd01d92fa6662e761f86b61982',
            decimals: 4,
            symbol: 'DNA',
        },
        {
            address: '0x6a217345aec9f9e64928793716dbef15b8ffe90d',
            decimals: 8,
            symbol: 'ETP',
        },
        {
            address: '0x4c11249814f11b9346808179cf06e71ac328c1b5',
            decimals: 18,
            symbol: 'ORAI',
        },
        {
            address: '0x2edf094db69d6dcd487f1b3db9febe2eec0dd4c5',
            decimals: 18,
            symbol: 'ZEE',
        },
        {
            address: '0x0dafe2b22323dac2940d43cede16cd8790c5d4e6',
            decimals: 18,
            symbol: 'CHARGED',
        },
        {
            address: '0x8806926ab68eb5a7b909dcaf6fdbe5d93271d6e2',
            decimals: 18,
            symbol: 'UQC',
        },
        {
            address: '0xd291e7a03283640fdc51b121ac401383a46cc623',
            decimals: 18,
            symbol: 'RGT',
        },
        {
            address: '0x837010619aeb2ae24141605afc8f66577f6fb2e7',
            decimals: 18,
            symbol: 'zHEGIC',
        },
        {
            address: '0xe28b3b32b6c345a34ff64674606124dd5aceca30',
            decimals: 18,
            symbol: 'INJ',
        },
        {
            address: '0x47da5456bc2e1ce391b645ce80f2e97192e4976a',
            decimals: 18,
            symbol: 'PLUG',
        },
        {
            address: '0x1416946162b1c2c871a73b07e932d2fb6c932069',
            decimals: 18,
            symbol: 'NRG',
        },
        {
            address: '0xbbff34e47e559ef680067a6b1c980639eeb64d24',
            decimals: 18,
            symbol: 'L2',
        },
        {
            address: '0x18aaa7115705e8be94bffebde57af9bfc265b998',
            decimals: 18,
            symbol: 'AUDIO',
        },
        {
            address: '0x7eb4db4dddb16a329c5ade17a8a0178331267e28',
            decimals: 18,
            symbol: 'NAMI',
        },
        {
            address: '0x3c9d6c1c73b31c837832c72e04d3152f051fc1a9',
            decimals: 18,
            symbol: 'BOR',
        },
        {
            address: '0x1f6b579a672590ab6115de803ee4bc81ec4e79f1',
            decimals: 18,
            symbol: 'MT',
        },
        {
            address: '0x62faa8937f71b4896f9b250f675ff89a5f6875cc',
            decimals: 9,
            symbol: 'fedCash',
        },
        {
            address: '0xa8e7ad77c60ee6f30bac54e2e7c0617bd7b5a03e',
            decimals: 18,
            symbol: 'zLOT',
        },
        {
            address: '0xa1d6df714f91debf4e0802a542e13067f31b8262',
            decimals: 18,
            symbol: 'RFOX',
        },
        {
            address: '0x0391d2021f89dc339f60fff84546ea23e337750f',
            decimals: 18,
            symbol: 'BOND',
        },
        {
            address: '0xd794dd1cada4cf79c9eebaab8327a1b0507ef7d4',
            decimals: 18,
            symbol: 'HYVE',
        },
        {
            address: '0xb70835d7822ebb9426b56543e391846c107bd32c',
            decimals: 18,
            symbol: 'GTC',
        },
        {
            address: '0xa117000000f279d81a1d3cc75430faa017fa5a2e',
            decimals: 18,
            symbol: 'ANT',
        },
        {
            address: '0x91af0fbb28aba7e31403cb457106ce79397fd4e6',
            decimals: 18,
            symbol: 'AERGO',
        },
        {
            address: '0x1ceb5cb57c4d4e2b2433641b95dd330a33185a44',
            decimals: 18,
            symbol: 'KP3R',
        },
        {
            address: '0x961c8c0b1aad0c0b10a51fef6a867e3091bcef17',
            decimals: 18,
            symbol: 'DYP',
        },
        {
            address: '0x655af27fd486ac6acb67ccf760e180421930276f',
            decimals: 18,
            symbol: 'MDAO',
        },
        {
            address: '0x20945ca1df56d237fd40036d47e866c7dccd2114',
            decimals: 18,
            symbol: 'Nsure',
        },
        {
            address: '0x69cf3091c91eb72db05e45c76e58225177dea742',
            decimals: 18,
            symbol: 'ZOOM',
        },
        {
            address: '0x4691937a7508860f876c9c0a2a617e7d9e945d4b',
            decimals: 18,
            symbol: 'WOO',
        },
        {
            address: '0x15f0eedf9ce24fc4b6826e590a8292ce5524a1da',
            decimals: 18,
            symbol: 'DENA',
        },
        {
            address: '0x4e16a26e5a7dcba20c133ec1f019d1e440f64e0d',
            decimals: 18,
            symbol: 'WIOG',
        },
        {
            address: '0xeea9ae787f3a620072d13b2cdc8cabffb9c0ab96',
            decimals: 18,
            symbol: 'YSEC',
        },
        {
            address: '0x4dafe1db6b10a4cd82002798ad78b7ee3869c7c2',
            decimals: 18,
            symbol: 'TWIS',
        },
        {
            address: '0xaac41ec512808d64625576eddd580e7ea40ef8b2',
            decimals: 18,
            symbol: 'GSWAP',
        },
        {
            address: '0xa283aa7cfbb27ef0cfbcb2493dd9f4330e0fd304',
            decimals: 18,
            symbol: 'MM',
        },
        {
            address: '0xfa5047c9c78b8877af97bdcb85db743fd7313d4a',
            decimals: 18,
            symbol: 'ROOK',
        },
        {
            address: '0xdacd69347de42babfaecd09dc88958378780fb62',
            decimals: 0,
            symbol: 'ATRI',
        },
        {
            address: '0x7ca4408137eb639570f8e647d9bd7b7e8717514a',
            decimals: 18,
            symbol: 'ALPA',
        },
        {
            address: '0xa393473d64d2f9f026b60b6df7859a689715d092',
            decimals: 8,
            symbol: 'LTX',
        },
        {
            address: '0x509a38b7a1cc0dcd83aa9d06214663d9ec7c7f4a',
            decimals: 18,
            symbol: 'BST',
        },
        {
            address: '0xfecba472b2540c5a2d3700b2c9e06f0aa7dc6462',
            decimals: 18,
            symbol: 'PINT',
        },
        {
            address: '0x3a810ff7211b40c4fa76205a14efe161615d0385',
            decimals: 18,
            symbol: 'AIN',
        },
        {
            address: '0x4a6431be40c1aa36eaee17ce5010dddaf23f77a4',
            decimals: 18,
            symbol: 'PZ',
        },
        {
            address: '0x20c36f062a31865bed8a5b1e512d9a1a20aa333a',
            decimals: 18,
            symbol: 'DFD',
        },
        {
            address: '0x69d9905b2e5f6f5433212b7f3c954433f23c1572',
            decimals: 18,
            symbol: 'OOKS',
        },
        {
            address: '0x2f4eb47a1b1f4488c71fc10e39a4aa56af33dd49',
            decimals: 18,
            symbol: 'UNCL',
        },
        {
            address: '0xaa6c7d24d03769370e1c31f7c4edf3ebe10b7cf7',
            decimals: 18,
            symbol: 'MTR',
        },
        {
            address: '0x95a4492f028aa1fd432ea71146b433e7b4446611',
            decimals: 18,
            symbol: 'APY',
        },
        {
            address: '0xc5bddf9843308380375a611c18b50fb9341f502a',
            decimals: 18,
            symbol: 'yveCRV-DAO',
        },
        {
            address: '0xb3c61539af156438951ea6cd48756d22a48fce62',
            decimals: 18,
            symbol: 'TBE',
        },
        {
            address: '0xd98f75b1a3261dab9eed4956c93f33749027a964',
            decimals: 2,
            symbol: 'SHR',
        },
        {
            address: '0xf5b5efc906513b4344ebabcf47a04901f99f09f3',
            decimals: 0,
            symbol: 'UBX',
        },
        {
            address: '0xe7d324b2677440608fb871981b220eca062c3fbf',
            decimals: 18,
            symbol: 'BVL',
        },
        {
            address: '0x6468e79a80c0eab0f9a2b574c8d5bc374af59414',
            decimals: 18,
            symbol: 'eXRD',
        },
        {
            address: '0x135b810e48e4307ab2a59ea294a6f1724781bd3c',
            decimals: 18,
            symbol: 'WAN',
        },
        {
            address: '0x6e1a19f235be7ed8e3369ef73b196c07257494de',
            decimals: 18,
            symbol: 'WFIL',
        },
        {
            address: '0xe6fd75ff38adca4b97fbcd938c86b98772431867',
            decimals: 18,
            symbol: 'ELA',
        },
        {
            address: '0x485d17a6f1b8780392d53d64751824253011a260',
            decimals: 8,
            symbol: 'TIME',
        },
        {
            address: '0x9248c485b0b80f76da451f167a8db30f33c70907',
            decimals: 18,
            symbol: 'DEBASE',
        },
        {
            address: '0x71924a8d733ae1bbc18d243e1deb56e767440eb6',
            decimals: 18,
            symbol: 'MOON',
        },
        {
            address: '0x67b66c99d3eb37fa76aa3ed1ff33e8e39f0b9c7a',
            decimals: 18,
            symbol: 'ibETH',
        },
        {
            address: '0x8064d9ae6cdf087b1bcd5bdf3531bd5d8c537a68',
            decimals: 18,
            symbol: 'oBTC',
        },
        {
            address: '0x3aada3e213abf8529606924d8d1c55cbdc70bf74',
            decimals: 18,
            symbol: 'XMON',
        },
        {
            address: '0x903bef1736cddf2a537176cf3c64579c3867a881',
            decimals: 9,
            symbol: 'ICHI',
        },
        {
            address: '0xb753428af26e81097e7fd17f40c88aaa3e04902c',
            decimals: 18,
            symbol: 'SFI',
        },
        {
            address: '0xd387f0e62e3f123a54ae486056a5d859affed0c8',
            decimals: 18,
            symbol: 'yETH',
        },
        {
            address: '0x727bf8d6d01270f45e55beede70ab1bbfa73c66c',
            decimals: 8,
            symbol: 'TLYR',
        },
        {
            address: '0x2ef52ed7de8c5ce03a4ef0efbe9b7450f2d7edc9',
            decimals: 6,
            symbol: 'REV',
        },
        {
            address: '0x7dd9c5cba05e151c895fde1cf355c9a1d5da6429',
            decimals: 18,
            symbol: 'GLM',
        },
        {
            address: '0x8888801af4d980682e47f1a9036e589479e835c5',
            decimals: 18,
            symbol: 'MPH',
        },
        {
            address: '0x69e8b9528cabda89fe846c67675b5d73d463a916',
            decimals: 18,
            symbol: 'OPEN',
        },
        {
            address: '0x15e4132dcd932e8990e794d1300011a472819cbd',
            decimals: 18,
            symbol: 'GRPL',
        },
        {
            address: '0x7866e48c74cbfb8183cd1a929cd9b95a7a5cb4f4',
            decimals: 18,
            symbol: 'KIT',
        },
        {
            address: '0x8c168ef06b8baf8ad2236eef2286f7870ad50f9b',
            decimals: 18,
            symbol: 'SANTA',
        },
        {
            address: '0x67c597624b17b16fb77959217360b7cd18284253',
            decimals: 9,
            symbol: 'MARK',
        },
        {
            address: '0xb1f871ae9462f1b2c6826e88a7827e76f86751d4',
            decimals: 18,
            symbol: 'GNYerc20',
        },
        {
            address: '0x14da230d6726c50f759bc1838717f8ce6373509c',
            decimals: 18,
            symbol: 'KAT',
        },
        {
            address: '0xe88f8313e61a97cec1871ee37fbbe2a8bf3ed1e4',
            decimals: 18,
            symbol: 'VAL',
        },
        {
            address: '0xaf30d2a7e90d7dc361c8c4585e9bb7d2f6f15bc7',
            decimals: 18,
            symbol: '1ST',
        },
        {
            address: '0x70401dfd142a16dc7031c56e862fc88cb9537ce0',
            decimals: 18,
            symbol: 'BIRD',
        },
        {
            address: '0x90de74265a416e1393a450752175aed98fe11517',
            decimals: 18,
            symbol: 'UDT',
        },
        {
            address: '0x36ac219f90f5a6a3c77f2a7b660e3cc701f68e25',
            decimals: 18,
            symbol: 'XCM',
        },
        {
            address: '0xebf698ede71af52ab1acb12975472ba2e302e810',
            decimals: 18,
            symbol: 'Ferrari',
        },
        {
            address: '0x881a7e25d44591c467a37da96adf3c3705e7251b',
            decimals: 18,
            symbol: 'ELYX',
        },
        {
            address: '0x16980b3b4a3f9d89e33311b5aa8f80303e5ca4f8',
            decimals: 6,
            symbol: 'KEX',
        },
        {
            address: '0x340d2bde5eb28c1eed91b2f790723e3b160613b7',
            decimals: 18,
            symbol: 'VEE',
        },
        {
            address: '0xb683d83a532e2cb7dfa5275eed3698436371cc9f',
            decimals: 18,
            symbol: 'BTU',
        },
        {
            address: '0xce1298ef635326d9f197963e49e1e67422761897',
            decimals: 8,
            symbol: 'PIS',
        },
        {
            address: '0x3449fc1cd036255ba1eb19d65ff4ba2b8903a69a',
            decimals: 18,
            symbol: 'BAC',
        },
        {
            address: '0x0b38210ea11411557c13457d4da7dc6ea731b88a',
            decimals: 18,
            symbol: 'API3',
        },
        {
            address: '0x275f5ad03be0fa221b4c6649b8aee09a42d9412a',
            decimals: 18,
            symbol: 'MONA',
        },
        {
            address: '0x00c83aecc790e8a4453e5dd3b0b4b3680501a7a7',
            decimals: 18,
            symbol: 'SKL',
        },
        {
            address: '0x2bc8b955f6a0ed5a9d4146ded61aec0bb74ecf67',
            decimals: 18,
            symbol: 'LGC',
        },
        {
            address: '0x0c7d5ae016f806603cb1782bea29ac69471cab9c',
            decimals: 18,
            symbol: 'BFC',
        },
        {
            address: '0x1bbf25e71ec48b84d773809b4ba55b6f4be946fb',
            decimals: 18,
            symbol: 'VOW',
        },
        {
            address: '0xee06a81a695750e71a662b51066f2c74cf4478a0',
            decimals: 18,
            symbol: '$DG',
        },
        {
            address: '0x374cb8c27130e2c9e04f44303f3c8351b9de61c1',
            decimals: 18,
            symbol: 'BAO',
        },
        {
            address: '0x97f88fcc106dbea24c5f57ec4b65eb810f2ffe66',
            decimals: 10,
            symbol: 'IEC',
        },
        {
            address: '0xa47c8bf37f92abed4a126bda807a7b7498661acd',
            decimals: 18,
            symbol: 'UST',
        },
        {
            address: '0x3472a5a71965499acd81997a54bba8d852c6e53d',
            decimals: 18,
            symbol: 'BADGER',
        },
        {
            address: '0x09a3ecafa817268f77be1283176b946c4ff2e608',
            decimals: 18,
            symbol: 'MIR',
        },
        {
            address: '0x6febd6be8fa45be6a5eeb61a17c82d33b9addd41',
            decimals: 18,
            symbol: 'IDL',
        },
        {
            address: '0x06f3c323f0238c72bf35011071f2b5b7f43a054c',
            decimals: 18,
            symbol: 'MASQ',
        },
        {
            address: '0x34950ff2b487d9e5282c5ab342d08a2f712eb79f',
            decimals: 18,
            symbol: 'WOZX',
        },
        {
            address: '0xe2eaf3fc26630c5165464ce9fca0611a1eb1e421',
            decimals: 18,
            symbol: 'FXS',
        },
        {
            address: '0x0ab00eac17fb7b9138a9a2551b27e69418097447',
            decimals: 18,
            symbol: 'GREENT',
        },
        {
            address: '0xb5fe099475d3030dde498c3bb6f3854f762a48ad',
            decimals: 18,
            symbol: 'FNK',
        },
        {
            address: '0x6589fe1271a0f29346796c6baf0cdf619e25e58e',
            decimals: 18,
            symbol: 'GRAIN',
        },
        {
            address: '0xef3a930e1ffffacd2fc13434ac81bd278b0ecc8d',
            decimals: 18,
            symbol: 'FIS',
        },
        {
            address: '0xd2dda223b2617cb616c1580db421e4cfae6a8a85',
            decimals: 18,
            symbol: 'BONDLY',
        },
        {
            address: '0xb8647e90c0645152fccf4d9abb6b59eb4aa99052',
            decimals: 18,
            symbol: 'KEYFI',
        },
        {
            address: '0x2f7098696aac7c114a013229c3c752e41b07e80f',
            decimals: 9,
            symbol: 'DSA',
        },
        {
            address: '0x054d64b73d3d8a21af3d764efd76bcaa774f3bb2',
            decimals: 18,
            symbol: 'PPAY',
        },
        {
            address: '0x9be89d2a4cd102d8fecc6bf9da793be995c22541',
            decimals: 8,
            symbol: 'BBTC',
        },
        {
            address: '0x7c28310cc0b8d898c57b93913098e74a3ba23228',
            decimals: 18,
            symbol: 'PCE',
        },
        {
            address: '0x754b12394d06a6b9a3e6a21ab9d13c8ee563388e',
            decimals: 18,
            symbol: 'BE2020',
        },
        {
            address: '0x2620638eda99f9e7e902ea24a285456ee9438861',
            decimals: 18,
            symbol: 'CSM',
        },
        {
            address: '0x7fdcf60ee99811948f9ce7eed20761e6defb52fb',
            decimals: 10,
            symbol: 'DYO',
        },
        {
            address: '0x94ec918ddeecfdfcbf8c8d3e848b7c3e8d8ceaa1',
            decimals: 18,
            symbol: 'WZYN',
        },
        {
            address: '0x70d2b7c19352bb76e4409858ff5746e500f2b67c',
            decimals: 18,
            symbol: 'UPI',
        },
        {
            address: '0x2781246fe707bb15cee3e5ea354e2154a2877b16',
            decimals: 18,
            symbol: 'EL',
        },
        {
            address: '0x2ab6bb8408ca3199b8fa6c92d5b455f820af03c4',
            decimals: 18,
            symbol: 'TONE',
        },
        {
            address: '0xd084b83c305dafd76ae3e1b4e1f1fe2ecccb3988',
            decimals: 18,
            symbol: 'TVK',
        },
        {
            address: '0xab611fb6633e3736b22aee1d42c26211717975fe',
            decimals: 18,
            symbol: 'FEY',
        },
        {
            address: '0x92e187a03b6cd19cb6af293ba17f2745fd2357d5',
            decimals: 18,
            symbol: 'DUCK',
        },
        {
            address: '0xf94b5c5651c888d928439ab6514b93944eee6f48',
            decimals: 18,
            symbol: 'YLD',
        },
        {
            address: '0xfc98e825a2264d890f9a1e68ed50e1526abccacd',
            decimals: 18,
            symbol: 'MCO2',
        },
        {
            address: '0xbcd4b7de6fde81025f74426d43165a5b0d790fdd',
            decimals: 18,
            symbol: 'SPDR',
        },
        {
            address: '0xd4fa1460f537bb9085d22c7bccb5dd450ef28e3a',
            decimals: 8,
            symbol: 'PPT',
        },
        {
            address: '0x52d904eff2605463c2f0b338d34abc9b7c3e3b08',
            decimals: 18,
            symbol: 'BPP',
        },
        {
            address: '0x853d955acef822db058eb8505911ed77f175b99e',
            decimals: 18,
            symbol: 'FRAX',
        },
        {
            address: '0x3432b6a60d23ca0dfca7761b7ab56459d9c964d0',
            decimals: 18,
            symbol: 'FXS',
        },
        {
            address: '0x226f7b842e0f0120b7e194d05432b3fd14773a9d',
            decimals: 18,
            symbol: 'UNN',
        },
        {
            address: '0x3593d125a4f7849a1b059e64f4517a86dd60c95d',
            decimals: 18,
            symbol: 'OM',
        },
        {
            address: '0xc944e90c64b2c07662a292be6244bdf05cda44a7',
            decimals: 18,
            symbol: 'GRT',
        },
        {
            address: '0x6226e00bcac68b0fe55583b90a1d727c14fab77f',
            decimals: 18,
            symbol: 'MTV',
        },
        {
            address: '0x21b86c38b61463f36bae92d49e4c95fff419db53',
            decimals: 18,
            symbol: 'ICECREAM',
        },
        {
            address: '0xae7ab96520de3a18e5e111b5eaab095312d7fe84',
            decimals: 18,
            symbol: 'stETH',
        },
        {
            address: '0x77777feddddffc19ff86db637967013e6c6a116c',
            decimals: 18,
            symbol: 'TORN',
        },
        {
            address: '0xed04915c23f00a313a544955524eb7dbd823143d',
            decimals: 8,
            symbol: 'ACH',
        },
        {
            address: '0x21bfbda47a0b4b5b1248c767ee49f7caa9b23697',
            decimals: 18,
            symbol: 'OVR',
        },
        {
            address: '0x0000000000095413afc295d19edeb1ad7b71c952',
            decimals: 18,
            symbol: 'LON',
        },
        {
            address: '0xc0ba369c8db6eb3924965e5c4fd0b4c1b91e305f',
            decimals: 18,
            symbol: 'DUCK',
        },
        {
            address: '0xd83c569268930fadad4cde6d0cb64450fef32b65',
            decimals: 18,
            symbol: 'ICAP',
        },
        {
            address: '0xe0ad1806fd3e7edf6ff52fdb822432e847411033',
            decimals: 18,
            symbol: 'ONX',
        },
        {
            address: '0x57b946008913b82e4df85f501cbaed910e58d26c',
            decimals: 18,
            symbol: 'POND',
        },
        {
            address: '0x66a0f676479cee1d7373f3dc2e2952778bff5bd6',
            decimals: 18,
            symbol: 'WISE',
        },
        {
            address: '0x3a880652f47bfaa771908c07dd8673a787daed3a',
            decimals: 18,
            symbol: 'DDX',
        },
        {
            address: '0x32d5830f8d6d9cdb36965c521e0e638d24c6b889',
            decimals: 6,
            symbol: 'MMM',
        },
        {
            address: '0xd2877702675e6ceb975b4a1dff9fb7baf4c91ea9',
            decimals: 18,
            symbol: 'LUNA',
        },
        {
            address: '0xc75ae516daea8dc2384997c0a7357a38e8f56172',
            decimals: 18,
            symbol: 'MMBC',
        },
        {
            address: '0x7a2bc711e19ba6aff6ce8246c546e8c4b4944dfd',
            decimals: 8,
            symbol: 'WAXE',
        },
        {
            address: '0x111111111117dc0aa78b770fa6a738034120c302',
            decimals: 18,
            symbol: '1INCH',
        },
        {
            address: '0xfe3e6a25e6b192a42a44ecddcd13796471735acf',
            decimals: 18,
            symbol: 'REEF',
        },
        {
            address: '0xf0939011a9bb95c3b791f0cb546377ed2693a574',
            decimals: 18,
            symbol: 'ZERO',
        },
        {
            address: '0xa91c82b6933105c23298e631a0c1be751d239162',
            decimals: 18,
            symbol: 'SOTU',
        },
        {
            address: '0x7671904eed7f10808b664fc30bb8693fd7237abf',
            decimals: 18,
            symbol: 'BBR',
        },
        {
            address: '0x9b02dd390a603add5c07f9fd9175b7dabe8d63b7',
            decimals: 18,
            symbol: 'SPI',
        },
        {
            address: '0x6c3f90f043a72fa612cbac8115ee7e52bde6e490',
            decimals: 18,
            symbol: '3Crv',
        },
        {
            address: '0x834ce7ad163ab3be0c5fd4e0a81e67ac8f51e00c',
            decimals: 18,
            symbol: 'PIS',
        },
        {
            address: '0x71b6296174c5f07d37cafd6e9b72ab5bb3f14fac',
            decimals: 8,
            symbol: 'Xi',
        },
        {
            address: '0x9f9913853f749b3fe6d6d4e16a1cc3c1656b6d51',
            decimals: 18,
            symbol: 'BITT',
        },
        {
            address: '0x1c9ba9144505aaba12f4b126fda9807150b88f80',
            decimals: 18,
            symbol: 'XUSD',
        },
        {
            address: '0x875650dd46b60c592d5a69a6719e4e4187a3ca81',
            decimals: 18,
            symbol: 'XUS',
        },
        {
            address: '0xe4815ae53b124e7263f08dcdbbb757d41ed658c6',
            decimals: 18,
            symbol: 'ZKS',
        },
        {
            address: '0x2791bfd60d232150bff86b39b7146c0eaaa2ba81',
            decimals: 18,
            symbol: 'BiFi',
        },
        {
            address: '0xf0e3543744afced8042131582f2a19b6aeb82794',
            decimals: 18,
            symbol: 'VTD',
        },
        {
            address: '0x5a98fcbea516cf06857215779fd812ca3bef1b32',
            decimals: 18,
            symbol: 'LDO',
        },
        {
            address: '0x87d73e916d7057945c9bcd8cdd94e42a6f47f776',
            decimals: 18,
            symbol: 'NFTX',
        },
        {
            address: '0x465e07d6028830124be2e4aa551fbe12805db0f5',
            decimals: 18,
            symbol: 'WXMR',
        },
        {
            address: '0xd27af03cb73a29ee2f37194c70c4ee13b68fe8cb',
            decimals: 18,
            symbol: 'FSD',
        },
        {
            address: '0x66c0dded8433c9ea86c8cf91237b14e10b4d70b7',
            decimals: 18,
            symbol: 'Mars',
        },
        {
            address: '0x038a68ff68c393373ec894015816e33ad41bd564',
            decimals: 18,
            symbol: 'GLCH',
        },
        {
            address: '0xe8e06a5613dc86d459bc8fb989e173bb8b256072',
            decimals: 18,
            symbol: 'FEY',
        },
        {
            address: '0xad7ca17e23f13982796d27d1e6406366def6ee5f',
            decimals: 18,
            symbol: 'rHEGIC2',
        },
        {
            address: '0xbcda9e0658f4eecf56a0bd099e6dbc0c91f6a8c2',
            decimals: 8,
            symbol: 'sil',
        },
        {
            address: '0x817bbdbc3e8a1204f3691d14bb44992841e3db35',
            decimals: 18,
            symbol: 'CUDOS',
        },
        {
            address: '0xffffffff2ba8f66d4e51811c5190992176930278',
            decimals: 18,
            symbol: 'COMBO',
        },
        {
            address: '0xb34ab2f65c6e4f764ffe740ab83f982021faed6d',
            decimals: 18,
            symbol: 'BSG',
        },
        {
            address: '0xe0c8b298db4cffe05d1bea0bb1ba414522b33c1b',
            decimals: 18,
            symbol: 'NCDT',
        },
        {
            address: '0x87de305311d5788e8da38d19bb427645b09cb4e5',
            decimals: 18,
            symbol: 'VRX',
        },
        {
            address: '0x8642a849d0dcb7a15a974794668adcfbe4794b56',
            decimals: 18,
            symbol: 'PROS',
        },
        {
            address: '0x3155ba85d5f96b2d030a4966af206230e46849cb',
            decimals: 18,
            symbol: 'RUNE',
        },
        {
            address: '0x11e003e9ecc5a2320e8b11098acd550b928b6df2',
            decimals: 7,
            symbol: 'XXi',
        },
        {
            address: '0x831091da075665168e01898c6dac004a867f1e1b',
            decimals: 18,
            symbol: 'GFARM2',
        },
        {
            address: '0x9c78ee466d6cb57a4d01fd887d2b5dfb2d46288f',
            decimals: 18,
            symbol: 'MUST',
        },
        {
            address: '0xb12907dcd65e09871bbd6f1659436f3be310af65',
            decimals: 4,
            symbol: 'TXT',
        },
        {
            address: '0x798d1be841a82a273720ce31c822c61a67a601c3',
            decimals: 9,
            symbol: 'DIGG',
        },
        {
            address: '0x4d0528598f916fd1d8dc80e5f54a8feedcfd4b18',
            decimals: 18,
            symbol: 'ATOS',
        },
        {
            address: '0x4206931337dc273a630d328da6441786bfad668f',
            decimals: 8,
            symbol: 'DOGE',
        },
        {
            address: '0x16eccfdbb4ee1a85a33f3a9b21175cd7ae753db4',
            decimals: 18,
            symbol: 'ROUTE',
        },
        {
            address: '0xaebbd7b2eb03f84126f6849753b809755d7532f9',
            decimals: 18,
            symbol: 'CAIZ',
        },
        {
            address: '0x4b4d2e899658fb59b1d518b68fe836b100ee8958',
            decimals: 18,
            symbol: 'MIS',
        },
        {
            address: '0x73968b9a57c6e53d41345fd57a6e6ae27d6cdb2f',
            decimals: 18,
            symbol: 'SDT',
        },
        {
            address: '0x3c03b4ec9477809072ff9cc9292c9b25d4a8e6c6',
            decimals: 18,
            symbol: 'CVR',
        },
        {
            address: '0xfd09911130e6930bf87f2b0554c44f400bd80d3e',
            decimals: 18,
            symbol: 'ETHIX',
        },
        {
            address: '0xa1c7d450130bb77c6a23ddfaecbc4a060215384b',
            decimals: 18,
            symbol: 'XRGE',
        },
        {
            address: '0x1337def16f9b486faed0293eb623dc8395dfe46a',
            decimals: 18,
            symbol: 'ARMOR',
        },
        {
            address: '0x6758b7d441a9739b98552b373703d8d3d14f9e62',
            decimals: 18,
            symbol: 'POA20',
        },
        {
            address: '0x2b89bf8ba858cd2fcee1fada378d5cd6936968be',
            decimals: 6,
            symbol: 'WSCRT',
        },
        {
            address: '0xa92e7c82b11d10716ab534051b271d2f6aef7df5',
            decimals: 18,
            symbol: 'ARA',
        },
        {
            address: '0x888888888889c00c67689029d7856aac1065ec11',
            decimals: 18,
            symbol: 'OPIUM',
        },
        {
            address: '0x2370f9d504c7a6e775bf6e14b3f12846b594cd53',
            decimals: 18,
            symbol: 'JPYC',
        },
        {
            address: '0xb0a0a070640b450eb136dc377208469ee4f49fbc',
            decimals: 18,
            symbol: 'F1C',
        },
        {
            address: '0x517bab7661c315c63c6465eed1b4248e6f7fe183',
            decimals: 18,
            symbol: 'ESSAY',
        },
        {
            address: '0x725c263e32c72ddc3a19bea12c5a0479a81ee688',
            decimals: 18,
            symbol: 'BMI',
        },
        {
            address: '0xeeaa40b28a2d1b0b08f6f97bb1dd4b75316c6107',
            decimals: 18,
            symbol: 'GOVI',
        },
        {
            address: '0x3301ee63fb29f863f2333bd4466acb46cd8323e6',
            decimals: 18,
            symbol: 'AKITA',
        },
        {
            address: '0xac0104cca91d167873b8601d2e71eb3d4d8c33e0',
            decimals: 18,
            symbol: 'CWS',
        },
        {
            address: '0x2b915b505c017abb1547aa5ab355fbe69865cc6d',
            decimals: 6,
            symbol: 'MAPS',
        },
        {
            address: '0xe5a3229ccb22b6484594973a03a3851dcd948756',
            decimals: 18,
            symbol: 'RAE',
        },
        {
            address: '0x35de3eccaccb02e627062b5d63aa941b137288fe',
            decimals: 18,
            symbol: 'VSD',
        },
        {
            address: '0x4f5fa8f2d12e5eb780f6082dd656c565c48e0f24',
            decimals: 18,
            symbol: 'GUM',
        },
        {
            address: '0x4c6ec08cf3fc987c6c4beb03184d335a2dfc4042',
            decimals: 18,
            symbol: 'PAINT',
        },
        {
            address: '0xf56842af3b56fd72d17cb103f92d027bba912e89',
            decimals: 18,
            symbol: 'BAMBOO',
        },
        {
            address: '0x940a2db1b7008b6c776d4faaca729d6d4a4aa551',
            decimals: 18,
            symbol: 'DUSK',
        },
        {
            address: '0xb59490ab09a0f526cc7305822ac65f2ab12f9723',
            decimals: 18,
            symbol: 'LIT',
        },
        {
            address: '0xf99d58e463a2e07e5692127302c20a191861b4d6',
            decimals: 18,
            symbol: 'ANY',
        },
        {
            address: '0xaa4e3edb11afa93c41db59842b29de64b72e355b',
            decimals: 18,
            symbol: 'MFI',
        },
        {
            address: '0x50de6856358cc35f3a9a57eaaa34bd4cb707d2cd',
            decimals: 18,
            symbol: 'RAZOR',
        },
        {
            address: '0xf9fbe825bfb2bf3e387af0dc18cac8d87f29dea8',
            decimals: 18,
            symbol: 'RADAR',
        },
        {
            address: '0x24a6a37576377f63f194caa5f518a60f45b42921',
            decimals: 18,
            symbol: 'BANK',
        },
        {
            address: '0x8a40c222996f9f3431f63bf80244c36822060f12',
            decimals: 18,
            symbol: 'FXF',
        },
        {
            address: '0xebd9d99a3982d547c5bb4db7e3b1f9f14b67eb83',
            decimals: 18,
            symbol: 'ID',
        },
        {
            address: '0xc98a910ede52e7d5308525845f19e17470dbccf7',
            decimals: 8,
            symbol: 'WILC',
        },
        {
            address: '0xef6344de1fcfc5f48c30234c16c1389e8cdc572c',
            decimals: 18,
            symbol: 'DNA',
        },
        {
            address: '0x0f51bb10119727a7e5ea3538074fb341f56b09ad',
            decimals: 18,
            symbol: 'DAO',
        },
        {
            address: '0x6fc13eace26590b80cccab1ba5d51890577d83b2',
            decimals: 18,
            symbol: 'UMB',
        },
        {
            address: '0xa487bf43cf3b10dffc97a9a744cbb7036965d3b9',
            decimals: 18,
            symbol: 'DERI',
        },
        {
            address: '0xa9b1eb5908cfc3cdf91f9b8b3a74108598009096',
            decimals: 18,
            symbol: 'Auction',
        },
        {
            address: '0x094f00cb5e31ab6164e3cacb654e8d6c2b3b471c',
            decimals: 6,
            symbol: 'PROS',
        },
        {
            address: '0x89bd2e7e388fab44ae88bef4e1ad12b4f1e0911c',
            decimals: 18,
            symbol: 'NUX',
        },
        {
            address: '0xc014186cf1ba36032aaec7f96088f09eb3934347',
            decimals: 18,
            symbol: 'WCX',
        },
        {
            address: '0x6c28aef8977c9b773996d0e8376d2ee379446f2f',
            decimals: 18,
            symbol: 'QUICK',
        },
        {
            address: '0xf411903cbc70a74d22900a5de66a2dda66507255',
            decimals: 18,
            symbol: 'VRA',
        },
        {
            address: '0x8861cff2366c1128fd699b68304ad99a0764ef9a',
            decimals: 18,
            symbol: 'CYC',
        },
        {
            address: '0x738865301a9b7dd80dc3666dd48cf034ec42bdda',
            decimals: 8,
            symbol: 'AGRS',
        },
        {
            address: '0xf1ca9cb74685755965c7458528a36934df52a3ef',
            decimals: 18,
            symbol: 'AVINOC',
        },
        {
            address: '0x03ab458634910aad20ef5f1c8ee96f1d6ac54919',
            decimals: 18,
            symbol: 'RAI',
        },
        {
            address: '0x6e765d26388a17a6e86c49a8e41df3f58abcd337',
            decimals: 18,
            symbol: 'KANGAL',
        },
        {
            address: '0x6595b8fd9c920c81500dca94e53cdc712513fb1f',
            decimals: 18,
            symbol: 'OLY',
        },
        {
            address: '0xea1ea0972fa092dd463f2968f9bb51cc4c981d71',
            decimals: 18,
            symbol: 'MOD',
        },
        {
            address: '0x33e07f5055173cf8febede8b21b12d1e2b523205',
            decimals: 18,
            symbol: 'ELAND',
        },
        {
            address: '0x1b40183efb4dd766f11bda7a7c3ad8982e998421',
            decimals: 18,
            symbol: 'VSP',
        },
        {
            address: '0x0cec1a9154ff802e7934fc916ed7ca50bde6844e',
            decimals: 18,
            symbol: 'POOL',
        },
        {
            address: '0x5d285f735998f36631f678ff41fb56a10a4d0429',
            decimals: 18,
            symbol: 'MIX',
        },
        {
            address: '0x3506424f91fd33084466f402d5d97f05f8e3b4af',
            decimals: 18,
            symbol: 'CHZ',
        },
        {
            address: '0x067085aa0ff4e97a3c61bf06de618e0aae11dbc2',
            decimals: 18,
            symbol: 'YPRO',
        },
        {
            address: '0x466060dd07ea7914e1e8d22b9cd0e2f308c18045',
            decimals: 18,
            symbol: 'AOX',
        },
        {
            address: '0xaa8330fb2b4d5d07abfe7a72262752a8505c6b37',
            decimals: 18,
            symbol: 'POLC',
        },
        {
            address: '0xb98d4c97425d9908e66e53a6fdf673acca0be986',
            decimals: 18,
            symbol: 'ABT',
        },
        {
            address: '0x6149c26cd2f7b5ccdb32029af817123f6e37df5b',
            decimals: 18,
            symbol: 'LPOOL',
        },
        {
            address: '0xe53ec727dbdeb9e2d5456c3be40cff031ab40a55',
            decimals: 18,
            symbol: 'SUPER',
        },
        {
            address: '0x88df592f8eb5d7bd38bfef7deb0fbc02cf3778a0',
            decimals: 18,
            symbol: 'TRB',
        },
        {
            address: '0x865377367054516e17014ccded1e7d814edc9ce4',
            decimals: 18,
            symbol: 'DOLA',
        },
        {
            address: '0xf4d861575ecc9493420a3f5a14f85b13f0b50eb3',
            decimals: 18,
            symbol: 'FCL',
        },
        {
            address: '0xd478161c952357f05f0292b56012cd8457f1cfbf',
            decimals: 18,
            symbol: 'POLK',
        },
        {
            address: '0x69af81e73a73b40adf4f3d4223cd9b1ece623074',
            decimals: 18,
            symbol: 'MASK',
        },
        {
            address: '0xd1e2d5085b39b80c9948aeb1b9aa83af6756bcc5',
            decimals: 9,
            symbol: 'wOXEN',
        },
        {
            address: '0x888888435fde8e7d4c54cab67f206e4199454c60',
            decimals: 18,
            symbol: 'DFX',
        },
        {
            address: '0x57dbf6d9ed29241693ce9ac90816609dbe1832c5',
            decimals: 18,
            symbol: 'DSBTC',
        },
        {
            address: '0x1c9922314ed1415c95b9fd453c3818fd41867d0b',
            decimals: 18,
            symbol: 'TOWER',
        },
        {
            address: '0x1a3496c18d558bd9c6c8f609e1b129f67ab08163',
            decimals: 18,
            symbol: 'DEP',
        },
        {
            address: '0x0cdf9acd87e940837ff21bb40c9fd55f68bba059',
            decimals: 18,
            symbol: 'MINT',
        },
        {
            address: '0x31c8eacbffdd875c74b94b077895bd78cf1e64a3',
            decimals: 18,
            symbol: 'RAD',
        },
        {
            address: '0xf5581dfefd8fb0e4aec526be659cfab1f8c781da',
            decimals: 18,
            symbol: 'HOPR',
        },
        {
            address: '0x0aee8703d34dd9ae107386d3eff22ae75dd616d1',
            decimals: 18,
            symbol: 'SLICE',
        },
        {
            address: '0xdbdb4d16eda451d0503b854cf79d55697f90c8df',
            decimals: 18,
            symbol: 'ALCX',
        },
        {
            address: '0x7825e833d495f3d1c28872415a4aee339d26ac88',
            decimals: 18,
            symbol: 'TLOS',
        },
        {
            address: '0xf7413489c474ca4399eee604716c72879eea3615',
            decimals: 18,
            symbol: 'APYS',
        },
        {
            address: '0xa49d7499271ae71cd8ab9ac515e6694c755d400c',
            decimals: 18,
            symbol: 'MUTE',
        },
        {
            address: '0xa00f236ba4bdfa84caa1a7f8734ccb6b160be2ee',
            decimals: 18,
            symbol: 'ABU84',
        },
        {
            address: '0xea3983fc6d0fbbc41fb6f6091f68f3e08894dc06',
            decimals: 18,
            symbol: 'UDO',
        },
        {
            address: '0xfb5453340c03db5ade474b27e68b6a9c6b2823eb',
            decimals: 18,
            symbol: 'ROBOT',
        },
        {
            address: '0xf3dcbc6d72a4e1892f7917b7c43b74131df8480e',
            decimals: 18,
            symbol: 'BDP',
        },
        {
            address: '0x7a5ce6abd131ea6b148a022cb76fc180ae3315a6',
            decimals: 18,
            symbol: 'bALPHA',
        },
        {
            address: '0x41d5d79431a913c4ae7d69a668ecdfe5ff9dfb68',
            decimals: 18,
            symbol: 'INV',
        },
        {
            address: '0xa8b61cff52564758a204f841e636265bebc8db9b',
            decimals: 18,
            symbol: 'YIELD',
        },
        {
            address: '0xf9a2d7e60a3297e513317ad1d7ce101cc4c6c8f6',
            decimals: 18,
            symbol: 'rUSD',
        },
        {
            address: '0xd23ac27148af6a2f339bd82d0e3cff380b5093de',
            decimals: 18,
            symbol: 'SI',
        },
        {
            address: '0x43901e05f08f48546fff8d6f8df108f60570498b',
            decimals: 18,
            symbol: 'BSJ',
        },
        {
            address: '0x657b83a0336561c8f64389a6f5ade675c04b0c3b',
            decimals: 18,
            symbol: 'PCNT',
        },
        {
            address: '0xbbc2ae13b23d715c30720f079fcd9b4a74093505',
            decimals: 18,
            symbol: 'ERN',
        },
        {
            address: '0xd9c2d319cd7e6177336b0a9c93c21cb48d84fb54',
            decimals: 18,
            symbol: 'HAPI',
        },
        {
            address: '0x1fe24f25b1cf609b9c4e7e12d802e3640dfa5e43',
            decimals: 18,
            symbol: 'CGG',
        },
        {
            address: '0xdd1ad9a21ce722c151a836373babe42c868ce9a4',
            decimals: 18,
            symbol: 'UBI',
        },
        {
            address: '0x182f4c4c97cd1c24e1df8fc4c053e5c47bf53bef',
            decimals: 18,
            symbol: 'TANGO',
        },
        {
            address: '0xfbbe9b1142c699512545f47937ee6fae0e4b0aa9',
            decimals: 18,
            symbol: 'EDDA',
        },
        {
            address: '0x53c8395465a84955c95159814461466053dedede',
            decimals: 18,
            symbol: 'DG',
        },
        {
            address: '0x6fc2f1044a3b9bb3e43a43ec8f840843ed753061',
            decimals: 18,
            symbol: 'ROBO',
        },
        {
            address: '0xcbfef8fdd706cde6f208460f2bf39aa9c785f05d',
            decimals: 18,
            symbol: 'KINE',
        },
        {
            address: '0xbc6da0fe9ad5f3b0d58160288917aa56653660e9',
            decimals: 18,
            symbol: 'alUSD',
        },
        {
            address: '0xaa6e8127831c9de45ae56bb1b0d4d4da6e5665bd',
            decimals: 18,
            symbol: 'ETH2x-FLI',
        },
        {
            address: '0xac51066d7bec65dc4589368da368b212745d63e8',
            decimals: 6,
            symbol: 'ALICE',
        },
        {
            address: '0x8185bc4757572da2a610f887561c32298f1a5748',
            decimals: 18,
            symbol: 'ALN',
        },
        {
            address: '0x8b0e42f366ba502d787bb134478adfae966c8798',
            decimals: 18,
            symbol: 'LABS',
        },
        {
            address: '0xd5cd84d6f044abe314ee7e414d37cae8773ef9d3',
            decimals: 18,
            symbol: '1ONE',
        },
        {
            address: '0x298d492e8c1d909d3f63bc4a36c66c64acb3d695',
            decimals: 18,
            symbol: 'PBR',
        },
        {
            address: '0x8b39b70e39aa811b69365398e0aace9bee238aeb',
            decimals: 18,
            symbol: 'PKF',
        },
        {
            address: '0x850aab69f0e0171a9a49db8be3e71351c8247df4',
            decimals: 18,
            symbol: 'KONO',
        },
        {
            address: '0x965697b4ef02f0de01384d0d4f9f782b1670c163',
            decimals: 6,
            symbol: 'OXY',
        },
        {
            address: '0xeb953eda0dc65e3246f43dc8fa13f35623bdd5ed',
            decimals: 18,
            symbol: 'RAINI',
        },
        {
            address: '0xfc979087305a826c2b2a0056cfaba50aad3e6439',
            decimals: 18,
            symbol: 'DAFI',
        },
        {
            address: '0x26c8afbbfe1ebaca03c2bb082e69d0476bffe099',
            decimals: 18,
            symbol: 'CELL',
        },
        {
            address: '0xcd2828fc4d8e8a0ede91bb38cf64b1a81de65bf6',
            decimals: 18,
            symbol: 'ODDZ',
        },
        {
            address: '0xc08512927d12348f6620a698105e1baac6ecd911',
            decimals: 6,
            symbol: 'GYEN',
        },
        {
            address: '0x35bd01fc9d6d5d81ca9e055db88dc49aa2c699a8',
            decimals: 18,
            symbol: 'FWB',
        },
        {
            address: '0x9f9c8ec3534c3ce16f928381372bfbfbfb9f4d24',
            decimals: 18,
            symbol: 'GLQ',
        },
        {
            address: '0xb9d99c33ea2d86ec5ec6b8a4dd816ebba64404af',
            decimals: 18,
            symbol: 'K21',
        },
        {
            address: '0x000000000000d0151e748d25b766e77efe2a6c83',
            decimals: 18,
            symbol: 'XDEX',
        },
        {
            address: '0x8052327f1baf94a9dc8b26b9100f211ee3774f54',
            decimals: 18,
            symbol: 'ATD',
        },
        {
            address: '0xd4c220ccac0335334d425a90f58de7c667896a06',
            decimals: 18,
            symbol: 'kUSD',
        },
        {
            address: '0xe4cfe9eaa8cdb0942a80b7bc68fd8ab0f6d44903',
            decimals: 18,
            symbol: 'XEND',
        },
        {
            address: '0x0e192d382a36de7011f795acc4391cd302003606',
            decimals: 18,
            symbol: 'FST',
        },
        {
            address: '0x8fc8f8269ebca376d046ce292dc7eac40c8d358a',
            decimals: 8,
            symbol: 'DFI',
        },
        {
            address: '0x232fb065d9d24c34708eedbf03724f2e95abe768',
            decimals: 18,
            symbol: 'SHEESHA',
        },
        {
            address: '0xc834fa996fa3bec7aad3693af486ae53d8aa8b50',
            decimals: 18,
            symbol: 'CONV',
        },
        {
            address: '0x358aa737e033f34df7c54306960a38d09aabd523',
            decimals: 18,
            symbol: 'ARES',
        },
        {
            address: '0xe796d6ca1ceb1b022ece5296226bf784110031cd',
            decimals: 18,
            symbol: 'BLES',
        },
        {
            address: '0x747f564d258612ec5c4e24742c5fd4110bcbe46b',
            decimals: 18,
            symbol: 'NDS',
        },
        {
            address: '0xbed4ab0019ff361d83ddeb74883dac8a70f5ea1e',
            decimals: 18,
            symbol: 'MRCH',
        },
        {
            address: '0x29cbd0510eec0327992cd6006e63f9fa8e7f33b7',
            decimals: 18,
            symbol: 'TIDAL',
        },
        {
            address: '0x956f47f50a910163d8bf957cf5846d573e7f87ca',
            decimals: 18,
            symbol: 'FEI',
        },
        {
            address: '0xc7283b66eb1eb5fb86327f08e1b5816b0720212b',
            decimals: 18,
            symbol: 'TRIBE',
        },
        {
            address: '0xf16e81dce15b08f326220742020379b855b87df9',
            decimals: 18,
            symbol: 'ICE',
        },
        {
            address: '0x5a666c7d92e5fa7edcb6390e4efd6d0cdd69cf37',
            decimals: 18,
            symbol: 'MARSH',
        },
        {
            address: '0x94804dc4948184ffd7355f62ccbb221c9765886f',
            decimals: 18,
            symbol: 'RAGE',
        },
        {
            address: '0x1796ae0b0fa4862485106a0de9b654efe301d0b2',
            decimals: 18,
            symbol: 'PMON',
        },
        {
            address: '0x88d50b466be55222019d71f9e8fae17f5f45fca1',
            decimals: 8,
            symbol: 'CPT',
        },
        {
            address: '0xe66b3aa360bb78468c00bebe163630269db3324f',
            decimals: 18,
            symbol: 'MTO',
        },
        {
            address: '0x626e8036deb333b408be468f951bdb42433cbf18',
            decimals: 18,
            symbol: 'AIOZ',
        },
        {
            address: '0x767fe9edc9e0df98e07454847909b5e959d7ca0e',
            decimals: 18,
            symbol: 'ILV',
        },
        {
            address: '0x84ba4aecfde39d69686a841bab434c32d179a169',
            decimals: 18,
            symbol: 'MTHD',
        },
        {
            address: '0x0fd10b9899882a6f2fcb5c371e17e70fdee00c38',
            decimals: 18,
            symbol: 'PUNDIX',
        },
        {
            address: '0x9fd1d329bb687fef164f529f6f6dcd6f69e7b978',
            decimals: 18,
            symbol: 'xPPAY',
        },
        {
            address: '0xfeea0bdd3d07eb6fe305938878c0cadbfa169042',
            decimals: 18,
            symbol: '8PAY',
        },
        {
            address: '0x765f0c16d1ddc279295c1a7c24b0883f62d33f75',
            decimals: 18,
            symbol: 'DTX',
        },
        {
            address: '0x69fa8e7f6bf1ca1fb0de61e1366f7412b827cc51',
            decimals: 9,
            symbol: 'NRCH',
        },
        {
            address: '0x9275e8386a5bdda160c0e621e9a6067b8fd88ea2',
            decimals: 18,
            symbol: 'NBNG',
        },
        {
            address: '0x5f98805a4e8be255a32880fdec7f6728c6568ba0',
            decimals: 18,
            symbol: 'LUSD',
        },
        {
            address: '0x6dea81c8171d0ba574754ef6f8b412f2ed88c54d',
            decimals: 18,
            symbol: 'LQTY',
        },
        {
            address: '0x9534ad65fb398e27ac8f4251dae1780b989d136e',
            decimals: 18,
            symbol: 'PYR',
        },
        {
            address: '0x72e364f2abdc788b7e918bc238b21f109cd634d7',
            decimals: 18,
            symbol: 'MVI',
        },
        {
            address: '0x6dc02164d75651758ac74435806093e421b64605',
            decimals: 8,
            symbol: 'WCHI',
        },
        {
            address: '0xb2dbf14d0b47ed3ba02bdb7c954e05a72deb7544',
            decimals: 18,
            symbol: 'MoFi',
        },
        {
            address: '0x80ce3027a70e0a928d9268994e9b85d03bd4cdcf',
            decimals: 18,
            symbol: 'LKR',
        },
        {
            address: '0x99c6e435ec259a7e8d65e1955c9423db624ba54c',
            decimals: 18,
            symbol: 'FMT',
        },
        {
            address: '0x383518188c0c6d7730d91b2c03a03c837814a899',
            decimals: 9,
            symbol: 'OHM',
        },
        {
            address: '0x68037790a0229e9ce6eaa8a99ea92964106c4703',
            decimals: 18,
            symbol: 'PAR',
        },
        {
            address: '0x90b831fa3bebf58e9744a14d638e25b4ee06f9bc',
            decimals: 18,
            symbol: 'MIMO',
        },
        {
            address: '0xd9016a907dc0ecfa3ca425ab20b6b785b42f2373',
            decimals: 18,
            symbol: 'GMEE',
        },
        {
            address: '0x1d32916cfa6534d261ad53e2498ab95505bd2510',
            decimals: 6,
            symbol: 'YOU',
        },
        {
            address: '0x3843a61f2960108287a51806c683fc854dc00354',
            decimals: 18,
            symbol: '+ETH($1000)',
        },
        {
            address: '0x74232704659ef37c08995e386a2e26cc27a8d7b1',
            decimals: 18,
            symbol: 'STRK',
        },
        {
            address: '0x35a532d376ffd9a705d0bb319532837337a398e7',
            decimals: 18,
            symbol: 'WDOGE',
        },
        {
            address: '0xd947b0ceab2a8885866b9a04a06ae99de852a3d4',
            decimals: 18,
            symbol: 'TIOx',
        },
        {
            address: '0xc477d038d5420c6a9e0b031712f61c5120090de9',
            decimals: 18,
            symbol: 'BOSON',
        },
        {
            address: '0x15b543e986b8c34074dfc9901136d9355a537e7e',
            decimals: 18,
            symbol: 'STC',
        },
        {
            address: '0xf3ae5d769e153ef72b4e3591ac004e89f48107a1',
            decimals: 18,
            symbol: 'DPR',
        },
        {
            address: '0x728f30fa2f100742c7949d1961804fa8e0b1387d',
            decimals: 18,
            symbol: 'GHX',
        },
        {
            address: '0xf05626e2a8c360fbfaab0f595c4c463b5b30391f',
            decimals: 9,
            symbol: 'Gaia',
        },
        {
            address: '0x3d61e677944204cd1002202912a2b7a43a8e2823',
            decimals: 9,
            symbol: 'USDf',
        },
        {
            address: '0x16c52ceece2ed57dad87319d91b5e3637d50afa4',
            decimals: 18,
            symbol: 'TCAP',
        },
        {
            address: '0xa2762ba628b962f93498d8893b6e4346140fe96d',
            decimals: 18,
            symbol: 'INT',
        },
        {
            address: '0xb2f42a63db01bb14d4e34e2900845e80df4d274c',
            decimals: 10,
            symbol: 'TTT',
        },
        {
            address: '0x3f3cd642e81d030d7b514a2ab5e3a5536beb90ec',
            decimals: 18,
            symbol: 'RHO',
        },
        {
            address: '0x35f67c1d929e106fdff8d1a55226afe15c34dbe2',
            decimals: 18,
            symbol: 'BETA',
        },
        {
            address: '0x379ec11344929da69ddfd805d564608089c97e55',
            decimals: 18,
            symbol: 'DRF',
        },
        {
            address: '0xf418588522d5dd018b425e472991e52ebbeeeeee',
            decimals: 18,
            symbol: 'PUSH',
        },
        {
            address: '0x4aa41bc1649c9c3177ed16caaa11482295fc7441',
            decimals: 18,
            symbol: 'XFIT',
        },
        {
            address: '0xedadeb5faa413e6c8623461849dfd0b7c3790c32',
            decimals: 18,
            symbol: 'OBOT',
        },
        {
            address: '0x2f109021afe75b949429fe30523ee7c0d5b27207',
            decimals: 18,
            symbol: 'OCC',
        },
        {
            address: '0x57a60058768403674542c6df87fb436eded953a0',
            decimals: 8,
            symbol: 'CMX',
        },
        {
            address: '0x2ba64efb7a4ec8983e22a49c81fa216ac33f383a',
            decimals: 18,
            symbol: 'WBGL',
        },
        {
            address: '0x6243d8cea23066d098a15582d81a598b4e8391f4',
            decimals: 18,
            symbol: 'FLX',
        },
        {
            address: '0x321c2fe4446c7c963dc41dd58879af648838f98d',
            decimals: 18,
            symbol: 'CTX',
        },
        {
            address: '0x85f6eb2bd5a062f5f8560be93fb7147e16c81472',
            decimals: 4,
            symbol: 'FLy',
        },
        {
            address: '0xc52c326331e9ce41f04484d3b5e5648158028804',
            decimals: 18,
            symbol: 'ZCX',
        },
        {
            address: '0x2c974b2d0ba1716e644c1fc59982a89ddd2ff724',
            decimals: 18,
            symbol: 'VIB',
        },
        {
            address: '0xf59ae934f6fe444afc309586cc60a84a0f89aaea',
            decimals: 18,
            symbol: 'PDEX',
        },
        {
            address: '0x4abb9cc67bd3da9eb966d1159a71a0e68bd15432',
            decimals: 18,
            symbol: 'KEL',
        },
        {
            address: '0xf65b5c5104c4fafd4b709d9d60a185eae063276c',
            decimals: 18,
            symbol: 'TRU',
        },
        {
            address: '0xddf7fd345d54ff4b40079579d4c4670415dbfd0a',
            decimals: 18,
            symbol: 'SG',
        },
        {
            address: '0x62dc4817588d53a056cbbd18231d91ffccd34b2a',
            decimals: 18,
            symbol: 'DHV',
        },
        {
            address: '0x5e3346444010135322268a4630d2ed5f8d09446c',
            decimals: 18,
            symbol: 'LOC',
        },
        {
            address: '0x668c50b1c7f46effbe3f242687071d7908aab00a',
            decimals: 9,
            symbol: 'CoShi',
        },
        {
            address: '0x77fba179c79de5b7653f68b5039af940ada60ce0',
            decimals: 18,
            symbol: 'FORTH',
        },
        {
            address: '0xbb1ee07d6c7baeb702949904080eb61f5d5e7732',
            decimals: 18,
            symbol: 'DINU',
        },
        {
            address: '0x5cb3ce6d081fb00d5f6677d196f2d70010ea3f4a',
            decimals: 18,
            symbol: 'BUSY',
        },
        {
            address: '0xfa14fa6958401314851a17d6c5360ca29f74b57b',
            decimals: 18,
            symbol: 'SAITO',
        },
        {
            address: '0x761d38e5ddf6ccf6cf7c55759d5210750b5d60f3',
            decimals: 18,
            symbol: 'ELON',
        },
        {
            address: '0x43a96962254855f16b925556f9e97be436a43448',
            decimals: 18,
            symbol: 'HORD',
        },
        {
            address: '0xf1a91c7d44768070f711c68f33a7ca25c8d30268',
            decimals: 18,
            symbol: 'C3',
        },
        {
            address: '0x104e072f3a7447e803e451b2aec296c73c5ce668',
            decimals: 18,
            symbol: 'PYRENEES',
        },
        {
            address: '0x95a8a98727272ed6ee7b7834c081e55801dcd9e5',
            decimals: 18,
            symbol: 'MUSK',
        },
        {
            address: '0xa4ef4b0b23c1fc81d3f9ecf93510e64f58a4a016',
            decimals: 18,
            symbol: '1MIL',
        },
        {
            address: '0x48c3399719b582dd63eb5aadf12a40b4c3f52fa2',
            decimals: 18,
            symbol: 'SWISE',
        },
        {
            address: '0xfe2e637202056d30016725477c5da089ab0a043a',
            decimals: 18,
            symbol: 'sETH2',
        },
        {
            address: '0xaa99199d1e9644b588796f3215089878440d58e0',
            decimals: 18,
            symbol: 'ALPHR',
        },
        {
            address: '0xbf776e4fca664d791c4ee3a71e2722990e003283',
            decimals: 18,
            symbol: 'SMTY',
        },
        {
            address: '0x474021845c4643113458ea4414bdb7fb74a01a77',
            decimals: 18,
            symbol: 'UNO',
        },
        {
            address: '0xf4b5470523ccd314c6b9da041076e7d79e0df267',
            decimals: 18,
            symbol: 'BBANK',
        },
        {
            address: '0x72f0c5d7fb01506543c2880e1a7f808e0a81febf',
            decimals: 18,
            symbol: 'TDGF',
        },
        {
            address: '0xcc8fa225d80b9c7d42f96e9570156c65d6caaa25',
            decimals: 0,
            symbol: 'SLP',
        },
        {
            address: '0x9040e237c3bf18347bb00957dc22167d0f2b999d',
            decimals: 18,
            symbol: 'STND',
        },
        {
            address: '0x965d79f1a1016b574a62986e13ca8ab04dfdd15c',
            decimals: 18,
            symbol: 'M2',
        },
        {
            address: '0x7c84e62859d0715eb77d1b1c4154ecd6abb21bec',
            decimals: 18,
            symbol: 'SHPING',
        },
        {
            address: '0x4a615bb7166210cce20e6642a6f8fb5d4d044496',
            decimals: 18,
            symbol: 'NAOS',
        },
        {
            address: '0x983f6d60db79ea8ca4eb9968c6aff8cfa04b3c63',
            decimals: 18,
            symbol: 'SNM',
        },
        {
            address: '0x33349b282065b0284d756f0577fb39c158f935e6',
            decimals: 18,
            symbol: 'MPL',
        },
        {
            address: '0xbb0e17ef65f82ab018d8edd776e8dd940327b28b',
            decimals: 18,
            symbol: 'AXS',
        },
        {
            address: '0xcaabcaa4ca42e1d86de1a201c818639def0ba7a7',
            decimals: 18,
            symbol: 'TALK',
        },
        {
            address: '0x60eb57d085c59932d5faa6c6026268a4386927d0',
            decimals: 18,
            symbol: 'LOCG',
        },
        {
            address: '0x327673ae6b33bd3d90f0096870059994f30dc8af',
            decimals: 18,
            symbol: 'LMT',
        },
        {
            address: '0xcfcecfe2bd2fed07a9145222e8a7ad9cf1ccd22a',
            decimals: 11,
            symbol: 'ADS',
        },
        {
            address: '0x9196e18bc349b1f64bc08784eae259525329a1ad',
            decimals: 18,
            symbol: 'PUSSY',
        },
        {
            address: '0x808507121b80c02388fad14726482e061b8da827',
            decimals: 18,
            symbol: 'PENDLE',
        },
        {
            address: '0x471d113059324321749e097705197a2b44a070fc',
            decimals: 18,
            symbol: 'KNG',
        },
        {
            address: '0x579cea1889991f68acc35ff5c3dd0621ff29b0c9',
            decimals: 18,
            symbol: 'IQ',
        },
        {
            address: '0x2d94aa3e47d9d5024503ca8491fce9a2fb4da198',
            decimals: 18,
            symbol: 'BANK',
        },
        {
            address: '0x9b00e6e8d787b13756eb919786c9745054db64f9',
            decimals: 18,
            symbol: 'wSIENNA',
        },
        {
            address: '0xd2adc1c84443ad06f0017adca346bd9b6fc52cab',
            decimals: 18,
            symbol: 'DFND',
        },
        {
            address: '0x993864e43caa7f7f12953ad6feb1d1ca635b875f',
            decimals: 18,
            symbol: 'SDAO',
        },
        {
            address: '0x0c572544a4ee47904d54aaa6a970af96b6f00e1b',
            decimals: 18,
            symbol: 'WAS',
        },
        {
            address: '0x9695e0114e12c0d3a3636fab5a18e6b737529023',
            decimals: 18,
            symbol: 'DFYN',
        },
        {
            address: '0xc8807f0f5ba3fa45ffbdc66928d71c5289249014',
            decimals: 18,
            symbol: 'ISP',
        },
        {
            address: '0x3431f91b3a388115f00c5ba9fdb899851d005fb5',
            decimals: 18,
            symbol: 'GERO',
        },
        {
            address: '0x2a3bff78b79a009976eea096a51a948a3dc00e34',
            decimals: 18,
            symbol: 'WILD',
        },
        {
            address: '0xd6327ce1fb9d6020e8c2c0e124a1ec23dcab7536',
            decimals: 18,
            symbol: 'CUMINU',
        },
        {
            address: '0x4e90322c42aa039970e219e7a9c7328ce30dedc6',
            decimals: 18,
            symbol: 'AKA',
        },
        {
            address: '0x519c1001d550c0a1dae7d1fc220f7d14c2a521bb',
            decimals: 18,
            symbol: 'PSWAP',
        },
        {
            address: '0x0dd1989e4b0e82f154b729ff47f8c9a4f4b2cc1c',
            decimals: 18,
            symbol: 'MILF',
        },
        {
            address: '0x217ddead61a42369a266f1fb754eb5d3ebadc88a',
            decimals: 18,
            symbol: 'DON',
        },
        {
            address: '0x675bbc7514013e2073db7a919f6e4cbef576de37',
            decimals: 18,
            symbol: 'CLS',
        },
        {
            address: '0x9e32b13ce7f2e80a01932b42553652e053d6ed8e',
            decimals: 18,
            symbol: 'Metis',
        },
        {
            address: '0x6e8908cfa881c9f6f2c64d3436e7b80b1bf0093f',
            decimals: 18,
            symbol: 'BIST',
        },
        {
            address: '0xa9c6f8bfec48a6d64de01ff7ac46ee1299af9c04',
            decimals: 18,
            symbol: 'SHINJI',
        },
        {
            address: '0x321bd6fa7696e0e4ba082e454b6e87b6c8372b27',
            decimals: 18,
            symbol: 'SHIBA',
        },
        {
            address: '0x7ddc52c4de30e94be3a6a0a2b259b2850f421989',
            decimals: 18,
            symbol: 'GMT',
        },
        {
            address: '0x0e58ed58e150dba5fd8e5d4a49f54c7e1e880124',
            decimals: 18,
            symbol: 'RELI',
        },
        {
            address: '0x9506d37f70eb4c3d79c398d326c871abbf10521d',
            decimals: 18,
            symbol: 'MLT',
        },
        {
            address: '0x64d91f12ece7362f91a6f8e7940cd55f05060b92',
            decimals: 18,
            symbol: 'ASH',
        },
        {
            address: '0x5f474906637bdcda05f29c74653f6962bb0f8eda',
            decimals: 18,
            symbol: 'DEFX',
        },
        {
            address: '0x4297394c20800e8a38a619a243e9bbe7681ff24e',
            decimals: 18,
            symbol: 'HOTCROSS',
        },
        {
            address: '0xfc0d6cf33e38bce7ca7d89c0e292274031b7157a',
            decimals: 18,
            symbol: 'NTVRK',
        },
        {
            address: '0x3f5dd1a1538a4f9f82e543098f01f22480b0a3a8',
            decimals: 18,
            symbol: 'dKUMA',
        },
        {
            address: '0x24ec2ca132abf8f6f8a6e24a1b97943e31f256a7',
            decimals: 18,
            symbol: 'MOOV',
        },
        {
            address: '0xde30da39c46104798bb5aa3fe8b9e0e1f348163f',
            decimals: 18,
            symbol: 'GTC',
        },
        {
            address: '0xfb130d93e49dca13264344966a611dc79a456bc5',
            decimals: 18,
            symbol: 'DOGEGF',
        },
        {
            address: '0x7659ce147d0e714454073a5dd7003544234b6aa0',
            decimals: 18,
            symbol: 'XCAD',
        },
        {
            address: '0x29ceddcf0da3c1d8068a7dfbd0fb06c2e438ff70',
            decimals: 18,
            symbol: 'FREL',
        },
        {
            address: '0x887168120cb89fb06f3e74dc4af20d67df0977f6',
            decimals: 18,
            symbol: 'SKRT',
        },
        {
            address: '0x03be5c903c727ee2c8c4e9bc0acc860cca4715e2',
            decimals: 18,
            symbol: 'CAPS',
        },
        {
            address: '0x5eeaa2dcb23056f4e8654a349e57ebe5e76b5e6e',
            decimals: 18,
            symbol: 'VPP',
        },
        {
            address: '0xa02120696c7b8fe16c09c749e4598819b2b0e915',
            decimals: 18,
            symbol: 'WXT',
        },
        {
            address: '0x58e3755bf21d46d6e3416c287559ce85820368a3',
            decimals: 18,
            symbol: 'ROVIA',
        },
        {
            address: '0x93c9175e26f57d2888c7df8b470c9eea5c0b0a93',
            decimals: 18,
            symbol: 'BCUBE',
        },
        {
            address: '0x88a9a52f944315d5b4e917b9689e65445c401e83',
            decimals: 18,
            symbol: 'FEAR',
        },
        {
            address: '0x02d3a27ac3f55d5d91fb0f52759842696a864217',
            decimals: 18,
            symbol: 'IONX',
        },
        {
            address: '0xd85a6ae55a7f33b0ee113c234d2ee308edeaf7fd',
            decimals: 18,
            symbol: 'CBK',
        },
        {
            address: '0x852e5427c86a3b46dd25e5fe027bb15f53c4bcb8',
            decimals: 15,
            symbol: 'NIIFI',
        },
        {
            address: '0x8798249c2e607446efb7ad49ec89dd1865ff4272',
            decimals: 18,
            symbol: 'xSUSHI',
        },
        {
            address: '0x5b7533812759b45c2b44c19e320ba2cd2681b542',
            decimals: 8,
            symbol: 'AGIX',
        },
        {
            address: '0x3b9be07d622accaed78f479bc0edabfd6397e320',
            decimals: 18,
            symbol: 'LSS',
        },
        {
            address: '0x8287c7b963b405b7b8d467db9d79eec40625b13a',
            decimals: 18,
            symbol: 'SWINGBY',
        },
        {
            address: '0xe1fc4455f62a6e89476f1072530c20cf1a0622da',
            decimals: 18,
            symbol: 'PHTR',
        },
        {
            address: '0x72e5390edb7727e3d4e3436451dadaff675dbcc0',
            decimals: 12,
            symbol: 'HANU',
        },
        {
            address: '0x8cb924583681cbfe487a62140a994a49f833c244',
            decimals: 18,
            symbol: 'SWAPP',
        },
        {
            address: '0xb14ebf566511b9e6002bb286016ab2497b9b9c9d',
            decimals: 18,
            symbol: 'HID',
        },
        {
            address: '0x08c32b0726c5684024ea6e141c50ade9690bbdcc',
            decimals: 18,
            symbol: 'STOS',
        },
        {
            address: '0xbdab72602e9ad40fc6a6852caf43258113b8f7a5',
            decimals: 18,
            symbol: 'eSOV',
        },
        {
            address: '0x295b42684f90c77da7ea46336001010f2791ec8c',
            decimals: 18,
            symbol: 'XI',
        },
        {
            address: '0x99d8a9c45b2eca8864373a26d1459e3dff1e17f3',
            decimals: 18,
            symbol: 'MIM',
        },
        {
            address: '0xa2fcc180fa0cbc0983f9b6948d22df733273925b',
            decimals: 18,
            symbol: 'REMIT',
        },
        {
            address: '0xde52a16c6db7914e6953e27a7df4ce6a315f8b45',
            decimals: 18,
            symbol: 'OUCHI',
        },
        {
            address: '0x48c276e8d03813224bb1e55f953adb6d02fd3e02',
            decimals: 18,
            symbol: 'KUMA',
        },
        {
            address: '0xc91b523a59acc63a64f61fc7bbfb4bfc82dd25f2',
            decimals: 18,
            symbol: 'AI',
        },
        {
            address: '0x6f40d4a6237c257fff2db00fa0510deeecd303eb',
            decimals: 18,
            symbol: 'INST',
        },
        {
            address: '0x3a856d4effa670c54585a5d523e96513e148e95d',
            decimals: 18,
            symbol: 'TRIAS',
        },
        {
            address: '0xddaddd4f73abc3a6552de43aba325f506232fa8a',
            decimals: 9,
            symbol: 'MFUND',
        },
        {
            address: '0x19062190b1925b5b6689d7073fdfc8c2976ef8cb',
            decimals: 16,
            symbol: 'BZZ',
        },
        {
            address: '0xb26c4b3ca601136daf98593feaeff9e0ca702a8d',
            decimals: 18,
            symbol: 'ALD',
        },
        {
            address: '0xd85301d4ab345b901a0ef369f69f7e6ff06b97a3',
            decimals: 12,
            symbol: 'DCMC',
        },
        {
            address: '0xeec2be5c91ae7f8a338e1e5f3b5de49d07afdc81',
            decimals: 18,
            symbol: 'DPX',
        },
        {
            address: '0x82bd290afa5cc1b75f46822fec415e2be51d7d46',
            decimals: 18,
            symbol: 'TOMATO',
        },
        {
            address: '0xb17c88bda07d28b3838e0c1de6a30eafbcf52d85',
            decimals: 18,
            symbol: 'SHFT',
        },
        {
            address: '0x7420b4b9a0110cdc71fb720908340c03f9bc03ec',
            decimals: 18,
            symbol: 'JASMY',
        },
        {
            address: '0x249e38ea4102d0cf8264d3701f1a0e39c4f2dc3b',
            decimals: 18,
            symbol: 'UFO',
        },
        {
            address: '0x8e6cd950ad6ba651f6dd608dc70e5886b1aa6b24',
            decimals: 18,
            symbol: 'STARL',
        },
        {
            address: '0x6b4c7a5e3f0b99fcd83e9c089bddd6c7fce5c611',
            decimals: 18,
            symbol: 'MM',
        },
        {
            address: '0x38a94e92a19e970c144ded0b2dd47278ca11cc1f',
            decimals: 9,
            symbol: 'F9',
        },
        {
            address: '0xd417144312dbf50465b1c641d016962017ef6240',
            decimals: 18,
            symbol: 'CQT',
        },
        {
            address: '0xfb7b4564402e5500db5bb6d63ae671302777c75a',
            decimals: 18,
            symbol: 'DEXT',
        },
        {
            address: '0xba36c0fa780e53bb9a2ef1541945da32cd5d6e5f',
            decimals: 18,
            symbol: 'BOTB20',
        },
        {
            address: '0x9813037ee2218799597d83d4a5b6f3b6778218d9',
            decimals: 18,
            symbol: 'BONE',
        },
        {
            address: '0xfd957f21bd95e723645c07c48a2d8acb8ffb3794',
            decimals: 18,
            symbol: 'ETHM',
        },
        {
            address: '0xf34960d9d60be18cc1d5afc1a6f012a723a28811',
            decimals: 6,
            symbol: 'KCS',
        },
        {
            address: '0x80c62fe4487e1351b47ba49809ebd60ed085bf52',
            decimals: 18,
            symbol: 'CLV',
        },
        {
            address: '0x41a3dba3d677e573636ba691a70ff2d606c29666',
            decimals: 18,
            symbol: 'BLANK',
        },
        {
            address: '0x2c9aceb63181cd08a093d052ec041e191f229692',
            decimals: 18,
            symbol: 'ANB',
        },
        {
            address: '0xecd20f0ebc3da5e514b4454e3dc396e7da18ca6a',
            decimals: 18,
            symbol: 'CUDL',
        },
        {
            address: '0xff44b937788215eca197baaf9af69dbdc214aa04',
            decimals: 18,
            symbol: 'ROCKI',
        },
        {
            address: '0x9b99cca871be05119b2012fd4474731dd653febe',
            decimals: 18,
            symbol: 'MATTER',
        },
        {
            address: '0xc581b735a1688071a1746c968e0798d642ede491',
            decimals: 6,
            symbol: 'EURT',
        },
        {
            address: '0x32e6c34cd57087abbd59b5a4aecc4cb495924356',
            decimals: 18,
            symbol: 'BTBS',
        },
        {
            address: '0x33f391f4c4fe802b70b77ae37670037a92114a7c',
            decimals: 18,
            symbol: 'BURP',
        },
        {
            address: '0xcda4e840411c00a614ad9205caec807c7458a0e3',
            decimals: 18,
            symbol: 'UFI',
        },
        {
            address: '0x605d26fbd5be761089281d5cec2ce86eea667109',
            decimals: 18,
            symbol: 'DSU',
        },
        {
            address: '0x24ae124c4cc33d6791f8e8b63520ed7107ac8b3e',
            decimals: 18,
            symbol: 'ESS',
        },
        {
            address: '0x8d7a9452361b465247ec613ac8cc20758ceae06f',
            decimals: 18,
            symbol: 'EDA',
        },
        {
            address: '0xcbe771323587ea16dacb6016e269d7f08a7acc4e',
            decimals: 18,
            symbol: 'SPO',
        },
        {
            address: '0xa96f31f1c187c28980176c3a27ba7069f48abde4',
            decimals: 8,
            symbol: 'ETGP',
        },
        {
            address: '0x37fe0f067fa808ffbdd12891c0858532cfe7361d',
            decimals: 18,
            symbol: 'CIV',
        },
        {
            address: '0xb17548c7b510427baac4e267bea62e800b247173',
            decimals: 18,
            symbol: 'SMT',
        },
        {
            address: '0x9fa69536d1cda4a04cfb50688294de75b505a9ae',
            decimals: 18,
            symbol: 'DERC',
        },
        {
            address: '0x8db1d28ee0d822367af8d220c0dc7cb6fe9dc442',
            decimals: 18,
            symbol: 'ETHPAD',
        },
        {
            address: '0x188e817b02e635d482ae4d81e25dda98a97c4a42',
            decimals: 18,
            symbol: 'LITH',
        },
        {
            address: '0xbd3de9a069648c84d27d74d701c9fa3253098b15',
            decimals: 18,
            symbol: 'EQX',
        },
        {
            address: '0xdc59ac4fefa32293a95889dc396682858d52e5db',
            decimals: 6,
            symbol: 'BEAN',
        },
        {
            address: '0x61107a409fffe1965126aa456af679719695c69c',
            decimals: 18,
            symbol: 'UMI',
        },
        {
            address: '0x2e9d63788249371f1dfc918a52f8d799f4a38c94',
            decimals: 18,
            symbol: 'TOKE',
        },
        {
            address: '0xd567b5f02b9073ad3a982a099a23bf019ff11d1c',
            decimals: 5,
            symbol: 'GAME',
        },
        {
            address: '0x012e0e6342308b247f36ee500ecb14dc77a7a8c1',
            decimals: 8,
            symbol: 'SKT',
        },
        {
            address: '0x24e89bdf2f65326b94e36978a7edeac63623dafa',
            decimals: 18,
            symbol: 'TKING',
        },
        {
            address: '0x6c7b97c7e09e790d161769a52f155125fac6d5a1',
            decimals: 18,
            symbol: 'ANGEL',
        },
        {
            address: '0xba5bde662c17e2adff1075610382b9b691296350',
            decimals: 18,
            symbol: 'RARE',
        },
        {
            address: '0xa01199c61841fce3b3dafb83fefc1899715c8756',
            decimals: 18,
            symbol: 'CIRUS',
        },
        {
            address: '0x17e6616c45d267bc20a9892b58a01621c592b72d',
            decimals: 18,
            symbol: 'EMS',
        },
        {
            address: '0x7ae0d42f23c33338de15bfa89c7405c068d9dc0a',
            decimals: 18,
            symbol: 'VERSE',
        },
        {
            address: '0x00c2999c8b2adf4abc835cc63209533973718eb1',
            decimals: 18,
            symbol: 'STATE',
        },
        {
            address: '0x582d872a1b094fc48f5de31d3b73f2d9be47def1',
            decimals: 9,
            symbol: 'TONCOIN',
        },
        {
            address: '0x25f8087ead173b73d6e8b84329989a8eea16cf73',
            decimals: 18,
            symbol: 'YGG',
        },
        {
            address: '0x6e5970dbd6fc7eb1f29c6d2edf2bc4c36124c0c1',
            decimals: 18,
            symbol: 'TRADE',
        },
        {
            address: '0x3106a0a076bedae847652f42ef07fd58589e001f',
            decimals: 18,
            symbol: '$ADS',
        },
        {
            address: '0x6286a9e6f7e745a6d884561d88f94542d6715698',
            decimals: 18,
            symbol: 'TECH',
        },
        {
            address: '0xa3ee21c306a700e682abcdfe9baa6a08f3820419',
            decimals: 18,
            symbol: 'G-CRE',
        },
        {
            address: '0xf5cfbc74057c610c8ef151a439252680ac68c6dc',
            decimals: 18,
            symbol: 'OCT',
        },
        {
            address: '0x91dfbee3965baaee32784c2d546b7a0c62f268c9',
            decimals: 18,
            symbol: 'BONDLY',
        },
        {
            address: '0xf16cd087e1c2c747b2bdf6f9a5498aa400d99c24',
            decimals: 18,
            symbol: 'IBG',
        },
        {
            address: '0x9b932b4fdd6747c341a71a564c7073fd4d0354d5',
            decimals: 8,
            symbol: 'WHYD',
        },
        {
            address: '0x65ad6a2288b2dd23e466226397c8f5d1794e58fc',
            decimals: 18,
            symbol: 'GFX',
        },
        {
            address: '0xe7f72bc0252ca7b16dbb72eeee1afcdb2429f2dd',
            decimals: 18,
            symbol: 'NFTL',
        },
        {
            address: '0x9e10f61749c4952c320412a6b26901605ff6da1d',
            decimals: 18,
            symbol: 'THEOS',
        },
        {
            address: '0x7ae1d57b58fa6411f32948314badd83583ee0e8c',
            decimals: 18,
            symbol: 'PAPER',
        },
        {
            address: '0x32353a6c91143bfd6c7d363b546e62a9a2489a20',
            decimals: 18,
            symbol: 'AGLD',
        },
        {
            address: '0x8c543aed163909142695f2d2acd0d55791a9edb9',
            decimals: 18,
            symbol: 'VLX',
        },
        {
            address: '0xdb0170e2d0c1cc1b2e7a90313d9b9afa4f250289',
            decimals: 18,
            symbol: 'ADAPAD',
        },
        {
            address: '0xb0c7a3ba49c7a6eaba6cd4a96c55a1391070ac9a',
            decimals: 18,
            symbol: 'MAGIC',
        },
        {
            address: '0x7fa7df4996ac59f398476892cfb195ed38543520',
            decimals: 18,
            symbol: 'WAG',
        },
        {
            address: '0x4d4f3715050571a447fffa2cd4cf091c7014ca5c',
            decimals: 18,
            symbol: 'SUMMER',
        },
        {
            address: '0x73d7c860998ca3c01ce8c808f5577d94d545d1b4',
            decimals: 18,
            symbol: 'IXS',
        },
        {
            address: '0x923b83c26b3809d960ff80332ed00aa46d7ed375',
            decimals: 18,
            symbol: 'CTR',
        },
        {
            address: '0x3ea6bae5c10ff3f99925bdf29fd3f8bcae5aaa66',
            decimals: 18,
            symbol: 'SGLD',
        },
        {
            address: '0x4ec1b60b96193a64acae44778e51f7bff2007831',
            decimals: 18,
            symbol: 'EDGE',
        },
        {
            address: '0xc8d3dcb63c38607cb0c9d3f55e8ecce628a01c36',
            decimals: 18,
            symbol: 'MATRIX',
        },
        {
            address: '0x4123a133ae3c521fd134d7b13a2dec35b56c2463',
            decimals: 8,
            symbol: 'QRDO',
        },
        {
            address: '0x464fdb8affc9bac185a7393fd4298137866dcfb8',
            decimals: 18,
            symbol: 'REALM',
        },
        {
            address: '0x9b31bb425d8263fa1b8b9d090b83cf0c31665355',
            decimals: 18,
            symbol: 'CPD',
        },
        {
            address: '0x42dbbd5ae373fea2fc320f62d44c058522bb3758',
            decimals: 18,
            symbol: 'MEM',
        },
        {
            address: '0xd528cf2e081f72908e086f8800977df826b5a483',
            decimals: 18,
            symbol: 'PBX',
        },
        {
            address: '0xf9c53268e9de692ae1b2ea5216e24e1c3ad7cb1e',
            decimals: 18,
            symbol: 'IDO',
        },
        {
            address: '0x51cb253744189f11241becb29bedd3f1b5384fdb',
            decimals: 18,
            symbol: 'DMTR',
        },
        {
            address: '0x80d55c03180349fff4a229102f62328220a96444',
            decimals: 18,
            symbol: 'OPUL',
        },
        {
            address: '0xd7f0cc50ad69408ae58be033f4f85d2367c2e468',
            decimals: 18,
            symbol: 'VERA',
        },
        {
            address: '0xa2881f7f441267042f9778ffa0d4f834693426be',
            decimals: 18,
            symbol: 'HUSL',
        },
        {
            address: '0x1a57367c6194199e5d9aea1ce027431682dfb411',
            decimals: 18,
            symbol: 'MDF',
        },
        {
            address: '0x120a3879da835a5af037bb2d1456bebd6b54d4ba',
            decimals: 18,
            symbol: 'RVST',
        },
        {
            address: '0xb6adb74efb5801160ff749b1985fd3bd5000e938',
            decimals: 18,
            symbol: 'GZONE',
        },
        {
            address: '0xe62bab2c68b2d4c1f82a36d96b63e760295a52c2',
            decimals: 18,
            symbol: 'BRAINZ',
        },
        {
            address: '0x4740735aa98dc8aa232bd049f8f0210458e7fca3',
            decimals: 18,
            symbol: 'RDT',
        },
        {
            address: '0x3ec8798b81485a254928b70cda1cf0a2bb0b74d7',
            decimals: 18,
            symbol: 'GRO',
        },
        {
            address: '0x16cda4028e9e872a38acb903176719299beaed87',
            decimals: 18,
            symbol: 'MARS4',
        },
        {
            address: '0x727f064a78dc734d33eec18d5370aef32ffd46e4',
            decimals: 18,
            symbol: 'ORION',
        },
        {
            address: '0xf56408077487cb879c992909c5b5c66d68c02eb4',
            decimals: 18,
            symbol: 'RIOT',
        },
        {
            address: '0xde5ed76e7c05ec5e4572cfc88d1acea165109e44',
            decimals: 18,
            symbol: 'DEUS',
        },
        {
            address: '0xde12c7959e1a72bbe8a5f7a1dc8f8eef9ab011b3',
            decimals: 18,
            symbol: 'DEI',
        },
        {
            address: '0x96610186f3ab8d73ebee1cf950c750f3b1fb79c2',
            decimals: 18,
            symbol: 'EJS',
        },
        {
            address: '0x4da0c48376c277cdbd7fc6fdc6936dee3e4adf75',
            decimals: 18,
            symbol: 'EPIK',
        },
        {
            address: '0xa11bd36801d8fa4448f0ac4ea7a62e3634ce8c7c',
            decimals: 18,
            symbol: 'ABR',
        },
        {
            address: '0x12bb890508c125661e03b09ec06e404bc9289040',
            decimals: 18,
            symbol: 'RACA',
        },
        {
            address: '0x9dfad1b7102d46b1b197b90095b5c4e9f5845bba',
            decimals: 18,
            symbol: 'BOTTO',
        },
        {
            address: '0xe7f58a92476056627f9fdb92286778abd83b285f',
            decimals: 18,
            symbol: 'DWEB',
        },
        {
            address: '0xbe1a001fe942f96eea22ba08783140b9dcc09d28',
            decimals: 18,
            symbol: 'BETA',
        },
        {
            address: '0xc6065b9fc8171ad3d29bad510709249681758972',
            decimals: 18,
            symbol: 'WFAIR',
        },
        {
            address: '0x52a047ee205701895ee06a375492490ec9c597ce',
            decimals: 18,
            symbol: 'PULSE',
        },
        {
            address: '0x4f640f2529ee0cf119a2881485845fa8e61a782a',
            decimals: 18,
            symbol: 'ORE',
        },
        {
            address: '0x1e4e46b7bf03ece908c88ff7cc4975560010893a',
            decimals: 18,
            symbol: 'IOEN',
        },
        {
            address: '0x2ba8349123de45e931a8c8264c332e6e9cf593f9',
            decimals: 18,
            symbol: 'BCMC',
        },
        {
            address: '0x71ab77b7dbb4fa7e017bc15090b2163221420282',
            decimals: 18,
            symbol: 'HIGH',
        },
        {
            address: '0x384f6e0c98de722e4163e81f286335b96aa8b178',
            decimals: 18,
            symbol: 'FORT',
        },
        {
            address: '0x9e5bd9d9fad182ff0a93ba8085b664bcab00fa68',
            decimals: 9,
            symbol: 'DINGER',
        },
        {
            address: '0x0fd67b4ceb9b607ef206904ec73459c4880132c9',
            decimals: 18,
            symbol: 'SHOE',
        },
        {
            address: '0x5fa2e9ba5757504b3d6e8f6da03cc40d4ce19499',
            decimals: 18,
            symbol: 'NFTT',
        },
        {
            address: '0x090185f2135308bad17527004364ebcc2d37e5f6',
            decimals: 18,
            symbol: 'SPELL',
        },
        {
            address: '0x8530b66ca3ddf50e0447eae8ad7ea7d5e62762ed',
            decimals: 18,
            symbol: 'METADOGE',
        },
        {
            address: '0x505a84a03e382331a1be487b632cf357748b65d6',
            decimals: 18,
            symbol: 'SHIBGF',
        },
        {
            address: '0x07f9702ce093db82dfdc92c2c6e578d6ea8d5e22',
            decimals: 18,
            symbol: 'OBT',
        },
        {
            address: '0xb31ef9e52d94d4120eb44fe1ddfde5b4654a6515',
            decimals: 18,
            symbol: 'DOSE',
        },
        {
            address: '0x949d48eca67b17269629c7194f4b727d4ef9e5d6',
            decimals: 18,
            symbol: 'MC',
        },
        {
            address: '0x2e59d147962e2bb3fbdc52dc18cfba2653c06ccc',
            decimals: 18,
            symbol: 'ZENI',
        },
        {
            address: '0xf8e9f10c22840b613cda05a0c5fdb59a4d6cd7ef',
            decimals: 18,
            symbol: 'DOE',
        },
        {
            address: '0xf57e7e7c23978c3caec3c3548e3d615c346e79ff',
            decimals: 18,
            symbol: 'IMX',
        },
        {
            address: '0xedb171c18ce90b633db442f2a6f72874093b49ef',
            decimals: 18,
            symbol: 'WAMPL',
        },
        {
            address: '0xac57de9c1a09fec648e93eb98875b212db0d460b',
            decimals: 9,
            symbol: 'BabyDoge',
        },
        {
            address: '0x612e1726435fe38dd49a0b35b4065b56f49c8f11',
            decimals: 18,
            symbol: 'CCv2',
        },
        {
            address: '0x3ef389f264e07fff3106a3926f2a166d1393086f',
            decimals: 9,
            symbol: 'SAO',
        },
        {
            address: '0xc18360217d8f7ab5e7c516566761ea12ce7f9d72',
            decimals: 18,
            symbol: 'ENS',
        },
        {
            address: '0x92d6c1e31e14520e676a687f0a93788b716beff5',
            decimals: 18,
            symbol: 'DYDX',
        },
        {
            address: '0xd01409314acb3b245cea9500ece3f6fd4d70ea30',
            decimals: 8,
            symbol: 'LTO',
        },
        {
            address: '0x2da719db753dfa10a62e140f436e1d67f2ddb0d6',
            decimals: 10,
            symbol: 'CERE',
        },
        {
            address: '0x1a7e4e63778b4f12a199c062f3efdd288afcbce8',
            decimals: 18,
            symbol: 'EURA',
        },
        {
            address: '0xcafe001067cdef266afb7eb5a286dcfd277f3de5',
            decimals: 18,
            symbol: 'PSP',
        },
        {
            address: '0x9e24415d1e549ebc626a13a482bb117a2b43e9cf',
            decimals: 8,
            symbol: 'LOVELY',
        },
        {
            address: '0xe0a189c975e4928222978a74517442239a0b86ff',
            decimals: 9,
            symbol: 'KEYS',
        },
        {
            address: '0x3af33bef05c2dcb3c7288b77fe1c8d2aeba4d789',
            decimals: 18,
            symbol: 'KROM',
        },
        {
            address: '0x3496b523e5c00a4b4150d6721320cddb234c3079',
            decimals: 18,
            symbol: 'NUM',
        },
        {
            address: '0xc6e145421fd494b26dcf2bfeb1b02b7c5721978f',
            decimals: 18,
            symbol: 'CPRX',
        },
        {
            address: '0x8355dbe8b0e275abad27eb843f3eaf3fc855e525',
            decimals: 18,
            symbol: 'WOOL',
        },
        {
            address: '0xc7d9c108d4e1dd1484d3e2568d7f74bfd763d356',
            decimals: 18,
            symbol: 'XSTUSD',
        },
        {
            address: '0x2602278ee1882889b946eb11dc0e810075650983',
            decimals: 18,
            symbol: 'VADER',
        },
        {
            address: '0xf0d33beda4d734c72684b5f9abbebf715d0a7935',
            decimals: 6,
            symbol: 'NTX',
        },
        {
            address: '0xddd6a0ecc3c6f6c102e5ea3d8af7b801d1a77ac8',
            decimals: 18,
            symbol: 'UNIX',
        },
        {
            address: '0x3abf2a4f8452ccc2cf7b4c1e4663147600646f66',
            decimals: 18,
            symbol: 'JBX',
        },
        {
            address: '0x7a58c0be72be218b41c608b7fe7c5bb630736c71',
            decimals: 18,
            symbol: 'PEOPLE',
        },
        {
            address: '0x5f944b0c4315cb7c3a846b025ab4045da44abf6c',
            decimals: 18,
            symbol: 'GCAKE',
        },
        {
            address: '0x0f2d719407fdbeff09d87557abb7232601fd9f29',
            decimals: 18,
            symbol: 'SYN',
        },
        {
            address: '0xd47bdf574b4f76210ed503e0efe81b58aa061f3d',
            decimals: 18,
            symbol: 'TRVL',
        },
        {
            address: '0x186d0ba3dfc3386c464eecd96a61fbb1e2da00bf',
            decimals: 18,
            symbol: 'TRAVA',
        },
        {
            address: '0xcfeaead4947f0705a14ec42ac3d44129e1ef3ed5',
            decimals: 8,
            symbol: 'NOTE',
        },
        {
            address: '0xd38bb40815d2b0c2d2c866e0c72c5728ffc76dd9',
            decimals: 18,
            symbol: 'SIS',
        },
        {
            address: '0x7d5121505149065b562c789a0145ed750e6e8cdd',
            decimals: 18,
            symbol: 'VR',
        },
        {
            address: '0x85f17cf997934a597031b2e18a9ab6ebd4b9f6a4',
            decimals: 24,
            symbol: 'NEAR',
        },
        {
            address: '0x42bbfa2e77757c645eeaad1655e0911a7553efbc',
            decimals: 18,
            symbol: 'BOBA',
        },
        {
            address: '0x3ea8ea4237344c9931214796d9417af1a1180770',
            decimals: 18,
            symbol: 'FLX',
        },
        {
            address: '0x5cac718a3ae330d361e39244bf9e67ab17514ce8',
            decimals: 18,
            symbol: 'COT',
        },
        {
            address: '0x6123b0049f904d730db3c36a31167d9d4121fa6b',
            decimals: 18,
            symbol: 'RBN',
        },
        {
            address: '0xdac657ffd44a3b9d8aba8749830bf14beb66ff2d',
            decimals: 18,
            symbol: 'HDAO',
        },
        {
            address: '0x9f52c8ecbee10e00d9faaac5ee9ba0ff6550f511',
            decimals: 18,
            symbol: 'SIPHER',
        },
        {
            address: '0xae6e307c3fe9e922e5674dbd7f830ed49c014c6b',
            decimals: 18,
            symbol: 'CREDI',
        },
        {
            address: '0xae78736cd615f374d3085123a210448e74fc6393',
            decimals: 18,
            symbol: 'rETH',
        },
        {
            address: '0x0ec78ed49c2d27b315d462d43b5bab94d2c79bf8',
            decimals: 18,
            symbol: 'MEOW',
        },
        {
            address: '0xbd100d061e120b2c67a24453cf6368e63f1be056',
            decimals: 18,
            symbol: 'iDYP',
        },
        {
            address: '0xb2617246d0c6c0087f18703d576831899ca94f01',
            decimals: 18,
            symbol: 'ZIG',
        },
        {
            address: '0x8fac8031e079f409135766c7d5de29cf22ef897c',
            decimals: 18,
            symbol: 'HEART',
        },
        {
            address: '0x44709a920fccf795fbc57baa433cc3dd53c44dbe',
            decimals: 18,
            symbol: 'RADAR',
        },
        {
            address: '0x45c2f8c9b4c0bdc76200448cc26c48ab6ffef83f',
            decimals: 18,
            symbol: 'DOMI',
        },
        {
            address: '0x549020a9cb845220d66d3e9c6d9f9ef61c981102',
            decimals: 18,
            symbol: 'SIDUS',
        },
        {
            address: '0x34be5b8c30ee4fde069dc878989686abe9884470',
            decimals: 18,
            symbol: 'SENATE',
        },
        {
            address: '0x6b1a8f210ec6b7b6643cea3583fb0c079f367898',
            decimals: 18,
            symbol: 'BXX',
        },
        {
            address: '0x6069c9223e8a5da1ec49ac5525d4bb757af72cd8',
            decimals: 18,
            symbol: 'MUSK',
        },
        {
            address: '0xb8c77482e45f1f44de1745f52c74426c631bdd52',
            decimals: 18,
            symbol: 'BNB',
        },
        {
            address: '0x64aa3364f17a4d01c6f1751fd97c2bd3d7e7f1d5',
            decimals: 9,
            symbol: 'OHM',
        },
        {
            address: '0xc0d4ceb216b3ba9c3701b291766fdcba977cec3a',
            decimals: 9,
            symbol: 'BTRFLY',
        },
        {
            address: '0x08037036451c768465369431da5c671ad9b37dbc',
            decimals: 18,
            symbol: 'NFTS',
        },
        {
            address: '0x71fc1f555a39e0b698653ab0b475488ec3c34d57',
            decimals: 18,
            symbol: 'RAIN',
        },
        {
            address: '0xc67b12049c2d0cf6e476bc64c7f82fc6c63cffc5',
            decimals: 8,
            symbol: 'GDT',
        },
        {
            address: '0x2e85ae1c47602f7927bcabc2ff99c40aa222ae15',
            decimals: 18,
            symbol: 'KATA',
        },
        {
            address: '0x3b484b82567a09e2588a13d54d032153f0c0aee0',
            decimals: 18,
            symbol: 'SOS',
        },
        {
            address: '0x6adb2e268de2aa1abf6578e4a8119b960e02928f',
            decimals: 9,
            symbol: 'ShibDoge',
        },
        {
            address: '0xd5d86fc8d5c0ea1ac1ac5dfab6e529c9967a45e9',
            decimals: 18,
            symbol: 'WRLD',
        },
        {
            address: '0x6bba316c48b49bd1eac44573c5c871ff02958469',
            decimals: 18,
            symbol: 'GAS',
        },
        {
            address: '0x6bea7cfef803d1e3d5f7c0103f7ded065644e197',
            decimals: 18,
            symbol: 'GAMMA',
        },
        {
            address: '0x505b5eda5e25a67e1c24a2bf1a527ed9eb88bf04',
            decimals: 18,
            symbol: 'CWEB',
        },
        {
            address: '0xa41f142b6eb2b164f8164cae0716892ce02f311f',
            decimals: 18,
            symbol: 'AVG',
        },
        {
            address: '0x0ab87046fbb341d058f17cbc4c1133f25a20a52f',
            decimals: 18,
            symbol: 'gOHM',
        },
        {
            address: '0x13c99770694f07279607a6274f28a28c33086424',
            decimals: 18,
            symbol: 'MTRL',
        },
        {
            address: '0xf4d2888d29d722226fafa5d9b24f9164c092421e',
            decimals: 18,
            symbol: 'LOOKS',
        },
        {
            address: '0x9b83f827928abdf18cf1f7e67053572b9bceff3a',
            decimals: 18,
            symbol: 'ARTEM',
        },
        {
            address: '0xf34b1db61aca1a371fe97bad2606c9f534fb9d7d',
            decimals: 18,
            symbol: 'RBIS',
        },
        {
            address: '0x1e9d0bb190ac34492aa11b80d28c1c86487a341f',
            decimals: 18,
            symbol: 'NEKO',
        },
        {
            address: '0x20d4db1946859e2adb0e5acc2eac58047ad41395',
            decimals: 18,
            symbol: 'MOONEY',
        },
        {
            address: '0x3541a5c1b04adaba0b83f161747815cd7b1516bc',
            decimals: 18,
            symbol: 'KNIGHT',
        },
        {
            address: '0xcf0c122c6b73ff809c693db761e7baebe62b6a2e',
            decimals: 9,
            symbol: 'FLOKI',
        },
        {
            address: '0xbc6e06778708177a18210181b073da747c88490a',
            decimals: 18,
            symbol: 'SYNR',
        },
        {
            address: '0x721a1b990699ee9d90b6327faad0a3e840ae8335',
            decimals: 18,
            symbol: 'LOOT',
        },
        {
            address: '0xc9fe6e1c76210be83dc1b5b20ec7fd010b0b1d15',
            decimals: 18,
            symbol: 'FRIN',
        },
        {
            address: '0x3a0b022f32b3191d44e5847da12dc0b63fb07c91',
            decimals: 18,
            symbol: 'SPELLFIRE',
        },
        {
            address: '0xc669928185dbce49d2230cc9b0979be6dc797957',
            decimals: 18,
            symbol: 'BTT',
        },
        {
            address: '0x470ebf5f030ed85fc1ed4c2d36b9dd02e77cf1b7',
            decimals: 18,
            symbol: 'TEMPLE',
        },
        {
            address: '0x0c90c57aaf95a3a87eadda6ec3974c99d786511f',
            decimals: 18,
            symbol: 'HAN',
        },
        {
            address: '0xf66cd2f8755a21d3c8683a10269f795c0532dd58',
            decimals: 18,
            symbol: 'CoreDAO',
        },
        {
            address: '0x59d1e836f7b7210a978b25a855085cc46fd090b5',
            decimals: 18,
            symbol: 'JUSTICE',
        },
        {
            address: '0xaaaaaa20d9e0e2461697782ef11675f668207961',
            decimals: 18,
            symbol: 'AURORA',
        },
        {
            address: '0x7237c0b30b1355f1b76355582f182f6f04b08740',
            decimals: 18,
            symbol: 'MGG',
        },
        {
            address: '0xa6586e19ef681b1ac0ed3d46413d199a555dbb95',
            decimals: 18,
            symbol: 'LETSGO',
        },
        {
            address: '0xc6dddb5bc6e61e0841c54f3e723ae1f3a807260b',
            decimals: 18,
            symbol: 'URUS',
        },
        {
            address: '0x6b0b3a982b4634ac68dd83a4dbf02311ce324181',
            decimals: 18,
            symbol: 'ALI',
        },
        {
            address: '0x1e4ede388cbc9f4b5c79681b7f94d36a11abebc9',
            decimals: 18,
            symbol: 'X2Y2',
        },
        {
            address: '0x2217e5921b7edfb4bb193a6228459974010d2198',
            decimals: 18,
            symbol: 'QMALL',
        },
        {
            address: '0x9e976f211daea0d652912ab99b0dc21a7fd728e4',
            decimals: 18,
            symbol: 'MAP',
        },
        {
            address: '0xdab396ccf3d84cf2d07c4454e10c8a6f5b008d2b',
            decimals: 18,
            symbol: 'GFI',
        },
        {
            address: '0x8eedefe828a0f16c8fc80e46a87bc0f1de2d960c',
            decimals: 18,
            symbol: 'DGMV',
        },
        {
            address: '0x320623b8e4ff03373931769a31fc52a4e78b5d70',
            decimals: 18,
            symbol: 'RSR',
        },
        {
            address: '0x2596825a84888e8f24b747df29e11b5dd03c81d7',
            decimals: 18,
            symbol: 'FTRB',
        },
        {
            address: '0xc4f6e93aeddc11dc22268488465babcaf09399ac',
            decimals: 18,
            symbol: 'HI',
        },
        {
            address: '0x3819f64f282bf135d62168c1e513280daf905e06',
            decimals: 9,
            symbol: 'HDRN',
        },
        {
            address: '0xf1b99e3e573a1a9c5e6b2ce818b617f0e664e86b',
            decimals: 18,
            symbol: 'oSQTH',
        },
        {
            address: '0x005d1123878fc55fbd56b54c73963b234a64af3c',
            decimals: 18,
            symbol: 'KIBA',
        },
        {
            address: '0x1e0b2992079b620aa13a7c2e7c88d2e1e18e46e9',
            decimals: 10,
            symbol: 'KOMPETE',
        },
        {
            address: '0x661d0e19c70106e005e57ca28eb5cd034f9a82bb',
            decimals: 18,
            symbol: 'BUIT',
        },
        {
            address: '0xc82e3db60a52cf7529253b4ec688f631aad9e7c2',
            decimals: 18,
            symbol: 'ARC',
        },
        {
            address: '0xfb5c6815ca3ac72ce9f5006869ae67f18bf77006',
            decimals: 18,
            symbol: 'PSTAKE',
        },
        {
            address: '0xd0a69fd9da28840603fbd76a8a0bccf0adb979e8',
            decimals: 18,
            symbol: 'VVV',
        },
        {
            address: '0x30d20208d987713f46dfd34ef128bb16c404d10f',
            decimals: 18,
            symbol: 'SD',
        },
        {
            address: '0xa71d0588eaf47f12b13cf8ec750430d21df04974',
            decimals: 18,
            symbol: 'QOM',
        },
        {
            address: '0x4d224452801aced8b2f0aebe155379bb5d594381',
            decimals: 18,
            symbol: 'APE',
        },
        {
            address: '0xa2cd3d43c775978a96bdbf12d733d5a1ed94fb18',
            decimals: 18,
            symbol: 'XCN',
        },
        {
            address: '0x081131434f93063751813c619ecca9c4dc7862a3',
            decimals: 6,
            symbol: 'DAR',
        },
        {
            address: '0x4e3fbd56cd56c3e72c1403e103b45db9da5b9d2b',
            decimals: 18,
            symbol: 'CVX',
        },
        {
            address: '0x0d02755a5700414b26ff040e1de35d337df56218',
            decimals: 18,
            symbol: 'BEND',
        },
        {
            address: '0x430ef9263e76dae63c84292c3409d61c598e9682',
            decimals: 18,
            symbol: 'PYR',
        },
        {
            address: '0x900db999074d9277c5da2a43f252d74366230da0',
            decimals: 18,
            symbol: 'GIV',
        },
        {
            address: '0x68749665ff8d2d112fa859aa293f07a622782f38',
            decimals: 6,
            symbol: 'XAUt',
        },
        {
            address: '0xdef1ca1fb7fbcdc777520aa7f396b4e015f497ab',
            decimals: 18,
            symbol: 'COW',
        },
        {
            address: '0x01597e397605bf280674bf292623460b4204c375',
            decimals: 18,
            symbol: 'BENT',
        },
        {
            address: '0xaf5191b0de278c7286d6c7cc6ab6bb8a73ba2cd6',
            decimals: 18,
            symbol: 'STG',
        },
        {
            address: '0x38b0e3a59183814957d83df2a97492aed1f003e2',
            decimals: 18,
            symbol: 'ANML',
        },
        {
            address: '0x23894dc9da6c94ecb439911caf7d337746575a72',
            decimals: 18,
            symbol: 'JAM',
        },
        {
            address: '0x1fee5588cb1de19c70b6ad5399152d8c643fae7b',
            decimals: 18,
            symbol: 'PHTK',
        },
        {
            address: '0x4521c9ad6a3d4230803ab752ed238be11f8b342f',
            decimals: 18,
            symbol: 'SANI',
        },
        {
            address: '0xa693b19d2931d498c5b318df961919bb4aee87a5',
            decimals: 6,
            symbol: 'UST',
        },
        {
            address: '0x61e90a50137e1f645c9ef4a0d3a4f01477738406',
            decimals: 18,
            symbol: 'LOKA',
        },
        {
            address: '0xd13cfd3133239a3c73a9e535a5c4dadee36b395c',
            decimals: 18,
            symbol: 'VAI',
        },
        {
            address: '0xdc0327d50e6c73db2f8117760592c8bbf1cdcf38',
            decimals: 18,
            symbol: 'STRNGR',
        },
        {
            address: '0x823556202e86763853b40e9cde725f412e294689',
            decimals: 18,
            symbol: 'ASTO',
        },
        {
            address: '0x2b95a1dcc3d405535f9ed33c219ab38e8d7e0884',
            decimals: 18,
            symbol: 'aCRV',
        },
        {
            address: '0x4b1d0b9f081468d780ca1d5d79132b64301085d1',
            decimals: 8,
            symbol: 'LMR',
        },
        {
            address: '0xf3b9569f82b18aef890de263b84189bd33ebe452',
            decimals: 18,
            symbol: 'CAW',
        },
        {
            address: '0xe76c6c83af64e4c60245d8c7de953df673a7a33d',
            decimals: 18,
            symbol: 'RAIL',
        },
        {
            address: '0x4da34f8264cb33a5c9f17081b9ef5ff6091116f4',
            decimals: 18,
            symbol: 'ELFI',
        },
        {
            address: '0x525a8f6f3ba4752868cde25164382bfbae3990e1',
            decimals: 6,
            symbol: 'NYM',
        },
        {
            address: '0x418d75f65a02b3d53b2418fb8e1fe493759c7605',
            decimals: 18,
            symbol: 'WBNB',
        },
        {
            address: '0xa2fe5e51729be71261bcf42854012827bc44c044',
            decimals: 18,
            symbol: 'BURN',
        },
        {
            address: '0x39207d2e2feef178fbda8083914554c59d9f8c00',
            decimals: 18,
            symbol: 'INUS',
        },
        {
            address: '0x7e77dcb127f99ece88230a64db8d595f31f1b068',
            decimals: 18,
            symbol: 'sILV2',
        },
        {
            address: '0x0d86eb9f43c57f6ff3bc9e23d8f9d82503f0e84b',
            decimals: 8,
            symbol: 'MAXI',
        },
        {
            address: '0x436da116249044e8b4464f0cf21dd93311d88190',
            decimals: 18,
            symbol: 'ZEUM',
        },
        {
            address: '0x310c8f00b9de3c31ab95ea68feb6c877538f7947',
            decimals: 18,
            symbol: 'UNDEAD',
        },
        {
            address: '0xab846fb6c81370327e784ae7cbb6d6a6af6ff4bf',
            decimals: 18,
            symbol: 'PAL',
        },
        {
            address: '0x19e2a43fbbc643c3b2d9667d858d49cad17bc2b5',
            decimals: 8,
            symbol: 'BNS',
        },
        {
            address: '0xac27f7ac8dbb26b6105c2facdb6b827c3bc0a6c4',
            decimals: 18,
            symbol: 'AAPE',
        },
        {
            address: '0xd31a59c85ae9d8edefec411d448f90841571b89c',
            decimals: 9,
            symbol: 'SOL',
        },
        {
            address: '0xc87cee866ebdfc4f0e07e80157f0f4cbb7ad329e',
            decimals: 18,
            symbol: 'MPRINT',
        },
        {
            address: '0x78132543d8e20d2417d8a07d9ae199d458a0d581',
            decimals: 18,
            symbol: 'LINU',
        },
        {
            address: '0x0f644658510c95cb46955e55d7ba9dda9e9fbec6',
            decimals: 18,
            symbol: 'uAD',
        },
        {
            address: '0xb53ecf1345cabee6ea1a65100ebb153cebcac40f',
            decimals: 18,
            symbol: 'O',
        },
        {
            address: '0x246908bff0b1ba6ecadcf57fb94f6ae2fcd43a77',
            decimals: 8,
            symbol: 'DIVI',
        },
        {
            address: '0xb0d11cbf626d6a97a1a4e54000e6daa2214128b5',
            decimals: 18,
            symbol: 'REMN',
        },
        {
            address: '0xc5fb36dd2fb59d3b98deff88425a3f425ee469ed',
            decimals: 9,
            symbol: 'TSUKA',
        },
        {
            address: '0x71a28feaee902966dc8d355e7b8aa427d421e7e0',
            decimals: 18,
            symbol: 'LUNCH',
        },
        {
            address: '0x4e4a47cac6a28a62dcc20990ed2cda9bc659469f',
            decimals: 18,
            symbol: 'SHIT',
        },
        {
            address: '0x00813e3421e1367353bfe7615c7f7f133c89df74',
            decimals: 18,
            symbol: 'SPS',
        },
        {
            address: '0xc5102fe9359fd9a28f877a67e36b0f050d81a3cc',
            decimals: 18,
            symbol: 'HOP',
        },
        {
            address: '0x24ccedebf841544c9e6a62af4e8c2fa6e5a46fde',
            decimals: 9,
            symbol: 'BlueSparrow',
        },
        {
            address: '0x2a54ba2964c8cd459dc568853f79813a60761b58',
            decimals: 18,
            symbol: 'USDI',
        },
        {
            address: '0xc0c293ce456ff0ed870add98a0828dd4d2903dbf',
            decimals: 18,
            symbol: 'AURA',
        },
        {
            address: '0x66761fa41377003622aee3c7675fc7b5c1c2fac5',
            decimals: 18,
            symbol: 'CPOOL',
        },
        {
            address: '0xf6ee08fa550e1cb08c0821a4da8cea57b8909d2e',
            decimals: 18,
            symbol: 'RC',
        },
        {
            address: '0x050d94685c6b0477e1fc555888af6e2bb8dfbda5',
            decimals: 18,
            symbol: 'INU',
        },
        {
            address: '0x967ea106144ff482ca13d1ab1f7e3747ff590531',
            decimals: 18,
            symbol: 'MOONZ',
        },
        {
            address: '0xc6bdb96e29c38dc43f014eed44de4106a6a8eb5f',
            decimals: 18,
            symbol: 'INUINU',
        },
        {
            address: '0xbd31ea8212119f94a611fa969881cba3ea06fa3d',
            decimals: 6,
            symbol: 'LUNA',
        },
        {
            address: '0xccc8cb5229b0ac8069c51fd58367fd1e622afd97',
            decimals: 18,
            symbol: 'GODS',
        },
        {
            address: '0xdefa4e8a7bcba345f687a2f1456f5edd9ce97202',
            decimals: 18,
            symbol: 'KNC',
        },
        {
            address: '0x1c4853ec0d55e420002c5efabc7ed8e0ba7a4121',
            decimals: 9,
            symbol: 'Okinami',
        },
        {
            address: '0x42476f744292107e34519f9c357927074ea3f75d',
            decimals: 18,
            symbol: 'LOOM',
        },
        {
            address: '0xfeeeef4d7b4bf3cc8bd012d02d32ba5fd3d51e31',
            decimals: 18,
            symbol: 'TAIL',
        },
        {
            address: '0x3c8d2fce49906e11e71cb16fa0ffeb2b16c29638',
            decimals: 18,
            symbol: 'NFTL',
        },
        {
            address: '0x243cacb4d5ff6814ad668c3e225246efa886ad5a',
            decimals: 18,
            symbol: 'SHI',
        },
        {
            address: '0x0b452278223d3954f4ac050949d7998e373e7e43',
            decimals: 18,
            symbol: 'SUZUME',
        },
        {
            address: '0x97be09f2523b39b835da9ea3857cfa1d3c660cbb',
            decimals: 18,
            symbol: 'UNI-V2',
        },
        {
            address: '0xc7555f6410e983c867748879b2f6d2b0b0e100fd',
            decimals: 5,
            symbol: 'SDAX',
        },
        {
            address: '0x839e71613f9aa06e5701cf6de63e303616b0dde3',
            decimals: 18,
            symbol: 'VVS',
        },
        {
            address: '0x602f65bb8b8098ad804e99db6760fd36208cd967',
            decimals: 18,
            symbol: 'MOPS',
        },
        {
            address: '0xd9fcd98c322942075a5c3860693e9f4f03aae07b',
            decimals: 18,
            symbol: 'EUL',
        },
        {
            address: '0xfc4913214444af5c715cc9f7b52655e788a569ed',
            decimals: 9,
            symbol: 'ICSA',
        },
        {
            address: '0x7c16cb6c59b94ace56b915108ebf659096ef0fdb',
            decimals: 18,
            symbol: 'SHINIGAMI',
        },
        {
            address: '0x809e130e10e787139c54e1d12d3d1971b7a675bf',
            decimals: 18,
            symbol: 'MTD',
        },
        {
            address: '0x2559813bbb508c4c79e9ccce4703bcb1f149edd7',
            decimals: 9,
            symbol: 'WAIT',
        },
        {
            address: '0xbe9895146f7af43049ca1c1ae358b0541ea49704',
            decimals: 18,
            symbol: 'cbETH',
        },
        {
            address: '0xa888d9616c2222788fa19f05f77221a290eef704',
            decimals: 9,
            symbol: 'Daruma',
        },
        {
            address: '0x7b4328c127b85369d9f82ca0503b000d09cf9180',
            decimals: 18,
            symbol: 'DC',
        },
        {
            address: '0xe4b4c008ff36e3c50c4299c223504a480de9c833',
            decimals: 9,
            symbol: 'SS',
        },
        {
            address: '0x256d1fce1b1221e8398f65f9b36033ce50b2d497',
            decimals: 18,
            symbol: 'wALV',
        },
        {
            address: '0x38703dca3311e923da0de21dbf371c652b6b51b4',
            decimals: 18,
            symbol: 'HOPE',
        },
        {
            address: '0xe5a733681bbe6cd8c764bb8078ef8e13a576dd78',
            decimals: 18,
            symbol: 'DPAY',
        },
        {
            address: '0x5eb87caa0105a63aa87a36c7bd2573bd13e84fae',
            decimals: 18,
            symbol: 'BQT',
        },
        {
            address: '0x9d9e399e5385e2b9a58d4f775a1e16441b571afb',
            decimals: 18,
            symbol: 'METANO',
        },
        {
            address: '0x9e18d5bab2fa94a6a95f509ecb38f8f68322abd3',
            decimals: 9,
            symbol: 'OMIKAMI',
        },
        {
            address: '0x64df3aab3b21cc275bb76c4a581cf8b726478ee0',
            decimals: 18,
            symbol: 'CRAMER',
        },
        {
            address: '0x12b6893ce26ea6341919fe289212ef77e51688c8',
            decimals: 18,
            symbol: 'TAMA',
        },
        {
            address: '0xd8c978de79e12728e38aa952a6cb4166f891790f',
            decimals: 18,
            symbol: '$ROAR',
        },
        {
            address: '0x2b867efd2de4ad2b583ca0cb3df9c4040ef4d329',
            decimals: 9,
            symbol: 'LBlock',
        },
        {
            address: '0x4bdcb66b968060d9390c1d12bd29734496205581',
            decimals: 18,
            symbol: 'ACQ',
        },
        {
            address: '0x9625ce7753ace1fa1865a47aae2c5c2ce4418569',
            decimals: 18,
            symbol: 'KAP',
        },
        {
            address: '0x06450dee7fd2fb8e39061434babcfc05599a6fb8',
            decimals: 18,
            symbol: 'XEN',
        },
        {
            address: '0x9008064e6cf73e27a3aba4b10e69f855a4f8efcc',
            decimals: 18,
            symbol: 'GEM',
        },
        {
            address: '0x60c7aea107ea3cdab21455e187cfb7e54e09b760',
            decimals: 18,
            symbol: 'MEME',
        },
        {
            address: '0x1abaea1f7c830bd89acc67ec4af516284b1bc33c',
            decimals: 6,
            symbol: 'EURC',
        },
        {
            address: '0x0cba60ca5ef4d42f92a5070a8fedd13be93e2861',
            decimals: 18,
            symbol: 'THE',
        },
        {
            address: '0x2de509bf0014ddf697b220be628213034d320ece',
            decimals: 18,
            symbol: 'DBI',
        },
        {
            address: '0x8ee325ae3e54e83956ef2d5952d3c8bc1fa6ec27',
            decimals: 9,
            symbol: 'TYRANT',
        },
        {
            address: '0x3a95fffeebdc113820e8b940254637c8477f59ef',
            decimals: 18,
            symbol: 'FSBF',
        },
        {
            address: '0x26f45c6d6bfdd89d37a8856838c2141348334e0f',
            decimals: 18,
            symbol: 'MASYA',
        },
        {
            address: '0x1217f3bfdc324b4c7aa048a987673402d7143831',
            decimals: 18,
            symbol: 'SHIT',
        },
        {
            address: '0xfef4c6b56e011a684dc2054afd576d83817c2620',
            decimals: 18,
            symbol: 'SLACK',
        },
        {
            address: '0xda4dd9586d27202a338843dd6b9824d267006783',
            decimals: 9,
            symbol: 'ECT',
        },
        {
            address: '0x347a96a5bd06d2e15199b032f46fb724d6c73047',
            decimals: 12,
            symbol: 'ASIC',
        },
        {
            address: '0xade6fdaba1643e4d1eef68da7170f234470938c6',
            decimals: 18,
            symbol: 'HARAMBE',
        },
        {
            address: '0xba41ddf06b7ffd89d1267b5a93bfef2424eb2003',
            decimals: 18,
            symbol: 'MYTH',
        },
        {
            address: '0x141d747c237de7bcce3f2ea776e280235e1e06e0',
            decimals: 18,
            symbol: 'Dream',
        },
        {
            address: '0x9565c2036963697786705120fc59310f747bcfd0',
            decimals: 18,
            symbol: 'PP',
        },
        {
            address: '0xe5097d9baeafb89f9bcb78c9290d545db5f9e9cb',
            decimals: 18,
            symbol: 'HBOT',
        },
        {
            address: '0xe20b9e246db5a0d21bf9209e4858bc9a3ff7a034',
            decimals: 18,
            symbol: 'wBAN',
        },
        {
            address: '0x1ae7e1d0ce06364ced9ad58225a1705b3e5db92b',
            decimals: 9,
            symbol: 'LMEOW',
        },
        {
            address: '0x0c9c7712c83b3c70e7c5e11100d33d9401bdf9dd',
            decimals: 18,
            symbol: 'WOMBAT',
        },
        {
            address: '0x3557b3e70a893a4c814f9b15c477543099929c28',
            decimals: 18,
            symbol: 'HAPPY',
        },
        {
            address: '0x3739426e21d912b604c106f852d136ba58f61517',
            decimals: 18,
            symbol: 'DOGGO',
        },
        {
            address: '0x2a7e415c169ce3a580c6f374dc26f6aaad1eccfe',
            decimals: 18,
            symbol: 'HACHI',
        },
        {
            address: '0x24da31e7bb182cb2cabfef1d88db19c2ae1f5572',
            decimals: 18,
            symbol: 'SHIK',
        },
        {
            address: '0x9b2b931d6ab97b6a887b2c5d8529537e6fe73ebe',
            decimals: 9,
            symbol: 'AllIn',
        },
        {
            address: '0xbe1936a67f503e0eaf2434b0cf9f4e3d7100008a',
            decimals: 18,
            symbol: 'PROS',
        },
        {
            address: '0xb7135877cd5d40aa3b086ac6f21c51bbafbbb41f',
            decimals: 18,
            symbol: 'AUSD',
        },
        {
            address: '0x49642110b712c1fd7261bc074105e9e44676c68f',
            decimals: 18,
            symbol: 'DINO',
        },
        {
            address: '0xcb84d72e61e383767c4dfeb2d8ff7f4fb89abc6e',
            decimals: 18,
            symbol: 'VEGA',
        },
        {
            address: '0x80ed012ef8dcd8e3a347d9034487aebd991bfda5',
            decimals: 9,
            symbol: 'GIGA',
        },
        {
            address: '0x6291d951c5d68f47ed346042e2f86a94c253bec4',
            decimals: 18,
            symbol: 'BRL',
        },
        {
            address: '0x5ee84583f67d5ecea5420dbb42b462896e7f8d06',
            decimals: 12,
            symbol: 'PLSB',
        },
        {
            address: '0x24bcec1afda63e622a97f17cff9a61ffcfd9b735',
            decimals: 18,
            symbol: 'CRAB',
        },
        {
            address: '0x0880164084017b8d49baa0a33f545ad55914e9fd',
            decimals: 9,
            symbol: 'DTI',
        },
        {
            address: '0xce391315b414d4c7555956120461d21808a69f3a',
            decimals: 18,
            symbol: 'BAO',
        },
        {
            address: '0x2457bd98caaf1e2cfcd9fa8262805ef5327ad6f7',
            decimals: 18,
            symbol: 'ARII',
        },
        {
            address: '0xc5b3d3231001a776123194cf1290068e8b0c783b',
            decimals: 18,
            symbol: 'LIT',
        },
        {
            address: '0xe9b076b476d8865cdf79d1cf7df420ee397a7f75',
            decimals: 9,
            symbol: 'FUND',
        },
        {
            address: '0x4f9fcdae3950a033074b93e269b6c382109fae71',
            decimals: 18,
            symbol: 'UNI-V2',
        },
        {
            address: '0x6a6aa13393b7d1100c00a57c76c39e8b6c835041',
            decimals: 9,
            symbol: 'OPENAI',
        },
        {
            address: '0xd3ac016b1b8c80eeadde4d186a9138c9324e4189',
            decimals: 18,
            symbol: 'OK',
        },
        {
            address: '0x249ca82617ec3dfb2589c4c17ab7ec9765350a18',
            decimals: 18,
            symbol: 'VERSE',
        },
        {
            address: '0x02e7f808990638e9e67e1f00313037ede2362361',
            decimals: 18,
            symbol: 'KIBSHI',
        },
        {
            address: '0xa735a3af76cc30791c61c10d585833829d36cbe0',
            decimals: 9,
            symbol: 'imgnAI',
        },
        {
            address: '0x3330bfb7332ca23cd071631837dc289b09c33333',
            decimals: 18,
            symbol: 'RBC',
        },
        {
            address: '0x52ada28f70bc8ebe5dd4381120d3cd76863919a8',
            decimals: 0,
            symbol: 'PLD',
        },
        {
            address: '0x2d886570a0da04885bfd6eb48ed8b8ff01a0eb7e',
            decimals: 9,
            symbol: 'BCB',
        },
        {
            address: '0xe03b2642a5111ad0efc0cbce766498c2dd562ae9',
            decimals: 9,
            symbol: 'BC',
        },
        {
            address: '0xeee60c7fd355a6a9c87b4859cf14303b4a86be90',
            decimals: 18,
            symbol: 'PATH',
        },
        {
            address: '0x4159862bcf6b4393a80550b1ed03dffa6f90533c',
            decimals: 18,
            symbol: 'OHMI',
        },
        {
            address: '0x4aabbcbae739713e8dc3a6de2eeb5e3347570ac5',
            decimals: 9,
            symbol: 'ISHI',
        },
        {
            address: '0xcfcffe432a48db53f59c301422d2edd77b2a88d7',
            decimals: 18,
            symbol: 'TEXAN',
        },
        {
            address: '0xf33893de6eb6ae9a67442e066ae9abd228f5290c',
            decimals: 8,
            symbol: 'GRV',
        },
        {
            address: '0x80951fe785c49096463246ebb09e1d91f78b6de6',
            decimals: 18,
            symbol: 'AURORA',
        },
        {
            address: '0xaaef88cea01475125522e117bfe45cf32044e238',
            decimals: 18,
            symbol: 'GF',
        },
        {
            address: '0xab2a7b5876d707e0126b3a75ef7781c77c8877ee',
            decimals: 18,
            symbol: 'QUAD',
        },
        {
            address: '0x93eeb426782bd88fcd4b48d7b0368cf061044928',
            decimals: 18,
            symbol: 'TRG',
        },
        {
            address: '0x39fbbabf11738317a448031930706cd3e612e1b9',
            decimals: 18,
            symbol: 'WXRP',
        },
        {
            address: '0x02814f435dd04e254be7ae69f61fca19881a780d',
            decimals: 18,
            symbol: 'PINA',
        },
        {
            address: '0xadbbb02e20c44779e87f7ea90c47c9a7a8a93fee',
            decimals: 8,
            symbol: 'BCY',
        },
        {
            address: '0x1e4746dc744503b53b4a082cb3607b169a289090',
            decimals: 18,
            symbol: 'IPOR',
        },
        {
            address: '0xab22e79f2dfc2e572223780fa425c827b0892170',
            decimals: 18,
            symbol: 'HDWY',
        },
        {
            address: '0x562e362876c8aee4744fc2c6aac8394c312d215d',
            decimals: 9,
            symbol: 'OPTIMUS',
        },
        {
            address: '0x2be59db3a6030ac65cd3d286a4d7a122264f628a',
            decimals: 18,
            symbol: 'HACHI',
        },
        {
            address: '0xd33526068d116ce69f19a9ee46f0bd304f21a51f',
            decimals: 18,
            symbol: 'RPL',
        },
        {
            address: '0x45a2f5d4ab4ccb8d4e3c006774ace22860c77338',
            decimals: 18,
            symbol: 'SHIBA',
        },
        {
            address: '0xb603dfcbb1abe7b053ba3634d7e3192fbdbad56b',
            decimals: 18,
            symbol: 'MADOG',
        },
        {
            address: '0x41f7b8b9b897276b7aae926a9016935280b44e97',
            decimals: 6,
            symbol: 'USDC',
        },
        {
            address: '0x6bc08509b36a98e829dffad49fde5e412645d0a3',
            decimals: 18,
            symbol: 'WOOF',
        },
        {
            address: '0x444444444444c1a66f394025ac839a535246fcc8',
            decimals: 9,
            symbol: 'GENI',
        },
        {
            address: '0x2e516ba5bf3b7ee47fb99b09eadb60bde80a82e0',
            decimals: 18,
            symbol: 'EGGS',
        },
        {
            address: '0xdd69db25f6d620a7bad3023c5d32761d353d3de9',
            decimals: 18,
            symbol: 'GETH',
        },
        {
            address: '0xa9944c550a5a463045d7955d3ad505c107a37008',
            decimals: 18,
            symbol: 'CLAW',
        },
        {
            address: '0x122303734c898e9d233affc234271f04e42e77ad',
            decimals: 18,
            symbol: 'Cat',
        },
        {
            address: '0x0d3bf70123d8f85c5e405df5990ed9d93eec6fa9',
            decimals: 18,
            symbol: 'VCP',
        },
        {
            address: '0xe55d97a97ae6a17706ee281486e98a84095d8aaf',
            decimals: 18,
            symbol: 'AIPAD',
        },
        {
            address: '0xdfc5964141c018485b4d017634660f85aa667714',
            decimals: 18,
            symbol: 'ODIN',
        },
        {
            address: '0x537e7586be6c5a142d97c91e831b82c511caeb93',
            decimals: 18,
            symbol: 'SDG',
        },
        {
            address: '0x45cbdf200357539e08782472818e0b1e3c0d61a3',
            decimals: 18,
            symbol: 'SHI',
        },
        {
            address: '0x77e06c9eccf2e797fd462a92b6d7642ef85b0a44',
            decimals: 9,
            symbol: 'wTAO',
        },
        {
            address: '0x73c69d24ad28e2d43d03cbf35f79fe26ebde1011',
            decimals: 18,
            symbol: 'ARCH',
        },
        {
            address: '0x3446dd70b2d52a6bf4a5a192d9b0a161295ab7f9',
            decimals: 18,
            symbol: 'SUDO',
        },
        {
            address: '0xbe00734799a67a62af2819825580318ac1b1e4ec',
            decimals: 18,
            symbol: 'ORD',
        },
        {
            address: '0x370ba23cb5fb13a44688f60cdd38d11bb4c290dd',
            decimals: 18,
            symbol: 'AI',
        },
        {
            address: '0x5283d291dbcf85356a21ba090e6db59121208b44',
            decimals: 18,
            symbol: 'BLUR',
        },
        {
            address: '0x05fe069626543842439ef90d9fa1633640c50cf1',
            decimals: 18,
            symbol: 'EVEAI',
        },
        {
            address: '0xf7e945fce8f19302aacc7e1418b0a0bdef89327b',
            decimals: 8,
            symbol: 'IZE',
        },
        {
            address: '0x7f39c581f595b53c5cb19bd0b3f8da6c935e2ca0',
            decimals: 18,
            symbol: 'wstETH',
        },
        {
            address: '0xaef06250d07cb6389d730d0eec7d90a1549be812',
            decimals: 9,
            symbol: 'RLBZ',
        },
        {
            address: '0x785c34312dfa6b74f6f1829f79ade39042222168',
            decimals: 18,
            symbol: 'BUMP',
        },
        {
            address: '0x6c22910c6f75f828b305e57c6a54855d8adeabf8',
            decimals: 9,
            symbol: 'SATS',
        },
        {
            address: '0x3c56f49f282365d0025192293f6ef432ae8dbd32',
            decimals: 18,
            symbol: 'AIINU',
        },
        {
            address: '0x78a2809e8e2ef8e07429559f15703ee20e885588',
            decimals: 18,
            symbol: 'M3M3',
        },
        {
            address: '0x9d65ff81a3c488d585bbfb0bfe3c7707c7917f54',
            decimals: 18,
            symbol: 'SSV',
        },
        {
            address: '0x796a4503b444a71b331c9556bef0815237ddeabc',
            decimals: 18,
            symbol: 'oDOGE',
        },
        {
            address: '0x42b91f1d05afea671a2da3c780eda2abf0a2a366',
            decimals: 18,
            symbol: '$MNB',
        },
        {
            address: '0x1a4b46696b2bb4794eb3d4c26f1c55f9170fa4c5',
            decimals: 18,
            symbol: 'BIT',
        },
        {
            address: '0x6bf765c43030387a983f429c1438e9d2025b7e12',
            decimals: 18,
            symbol: 'PEPES',
        },
        {
            address: '0xb23d80f5fefcddaa212212f028021b41ded428cf',
            decimals: 18,
            symbol: 'PRIME',
        },
        {
            address: '0xed0172ed8942e37d9184174eedf107db3c5a99ba',
            decimals: 18,
            symbol: 'UNITY',
        },
        {
            address: '0xfbd5fd3f85e9f4c5e8b40eec9f8b8ab1caaa146b',
            decimals: 18,
            symbol: 'TREAT',
        },
        {
            address: '0x5d13ace25d4171fcf24c7e230320bfc6809b00f8',
            decimals: 18,
            symbol: 'WOOFME',
        },
        {
            address: '0xcdf7028ceab81fa0c6971208e83fa7872994bee5',
            decimals: 18,
            symbol: 'T',
        },
        {
            address: '0x6f222e04f6c53cc688ffb0abe7206aac66a8ff98',
            decimals: 18,
            symbol: 'ROKO',
        },
        {
            address: '0xc13f4f0f865bac08f62654b57e38669ebc4747a3',
            decimals: 18,
            symbol: 'CREDS',
        },
        {
            address: '0x54012cdf4119de84218f7eb90eeb87e25ae6ebd7',
            decimals: 9,
            symbol: 'LUFFY',
        },
        {
            address: '0x69b14e8d3cebfdd8196bfe530954a0c226e5008e',
            decimals: 9,
            symbol: 'SpacePi',
        },
        {
            address: '0xfd414e39155f91e94443a9fe97e856569d0f5eec',
            decimals: 9,
            symbol: 'SERP',
        },
        {
            address: '0x8f828a0644f12fa352888e645a90333d30f6fd7d',
            decimals: 9,
            symbol: 'RINIA',
        },
        {
            address: '0xcb56b52316041a62b6b5d0583dce4a8ae7a3c629',
            decimals: 18,
            symbol: 'CIG',
        },
        {
            address: '0x9eec1a4814323a7396c938bc86aec46b97f1bd82',
            decimals: 18,
            symbol: 'TOKU',
        },
        {
            address: '0xbadff0ef41d2a68f22de21eabca8a59aaf495cf0',
            decimals: 18,
            symbol: 'Kabosu',
        },
        {
            address: '0x819c1a1568934ee59d9f3c8b9640908556c44140',
            decimals: 18,
            symbol: 'HOBBES',
        },
        {
            address: '0x644192291cc835a93d6330b24ea5f5fedd0eef9e',
            decimals: 18,
            symbol: 'NXRA',
        },
        {
            address: '0xa876f27f13a9eb6e621202cefdd5afc4a90e6457',
            decimals: 9,
            symbol: 'IC',
        },
        {
            address: '0x2dff88a56767223a5529ea5960da7a3f5f766406',
            decimals: 18,
            symbol: 'ID',
        },
        {
            address: '0xb50721bcf8d664c30412cfbc6cf7a15145234ad1',
            decimals: 18,
            symbol: 'ARB',
        },
        {
            address: '0xd4ae236a5080a09c0f7bd6e6b84919523573a43b',
            decimals: 18,
            symbol: 'FUTURE',
        },
        {
            address: '0xd1f17b7a6bff962659ed608bcd6d318bb5fbb249',
            decimals: 18,
            symbol: 'ZUZALU',
        },
        {
            address: '0xf2a22b900dde3ba18ec2aef67d4c8c1a0dab6aac',
            decimals: 9,
            symbol: 'MONKEYS',
        },
        {
            address: '0x475a340c02a73d961da57eb1be0ac1d8e273e66a',
            decimals: 8,
            symbol: 'COOL',
        },
        {
            address: '0x667ba3d01123d6d435e93b4ae7d6f400fb1881da',
            decimals: 8,
            symbol: 'EGOD',
        },
        {
            address: '0xef3daa5fda8ad7aabff4658f1f78061fd626b8f0',
            decimals: 18,
            symbol: 'MUZZ',
        },
        {
            address: '0x1f18ba2cbfc9e5da6f2989d20ad81b4710556030',
            decimals: 18,
            symbol: 'TRUCK',
        },
        {
            address: '0x4561de8e0c2bba725d38d266ef62426e62678d82',
            decimals: 18,
            symbol: 'CONI',
        },
        {
            address: '0x5de8ab7e27f6e7a1fff3e5b337584aa43961beef',
            decimals: 18,
            symbol: 'SDEX',
        },
        {
            address: '0x80f0c1c49891dcfdd40b6e0f960f84e6042bcb6f',
            decimals: 18,
            symbol: 'DXN',
        },
        {
            address: '0x70edf1c215d0ce69e7f16fd4e6276ba0d99d4de7',
            decimals: 9,
            symbol: 'CHEQ',
        },
        {
            address: '0x04c17b9d3b29a78f7bd062a57cf44fc633e71f85',
            decimals: 18,
            symbol: 'IMPT',
        },
        {
            address: '0x5f18ea482ad5cc6bc65803817c99f477043dce85',
            decimals: 18,
            symbol: 'AGI',
        },
        {
            address: '0x6bdde71cf0c751eb6d5edb8418e43d3d9427e436',
            decimals: 18,
            symbol: 'BTREE',
        },
        {
            address: '0x20cdecbf5d56870b4068a255580a58d068446c92',
            decimals: 9,
            symbol: 'MONKEYS',
        },
        {
            address: '0x70eb04c764662c0a3d4867a23fe04770343f81d2',
            decimals: 18,
            symbol: 'HarryBolz',
        },
        {
            address: '0xd084944d3c05cd115c09d072b9f44ba3e0e45921',
            decimals: 18,
            symbol: 'FOLD',
        },
        {
            address: '0xe060031495658d7f1a1dbaaccf90fe870b4ffd58',
            decimals: 18,
            symbol: 'X',
        },
        {
            address: '0x975bbd66c60b54fedd24e59a241251e261f474df',
            decimals: 18,
            symbol: 'ANON',
        },
        {
            address: '0xf6b705510dc81e6fb150a8b4cd0cc6fb4717d100',
            decimals: 18,
            symbol: 'eCASH',
        },
        {
            address: '0x5fab9761d60419c9eeebe3915a8fa1ed7e8d2e1b',
            decimals: 18,
            symbol: 'DIMO',
        },
        {
            address: '0x6982508145454ce325ddbe47a25d4ec3d2311933',
            decimals: 18,
            symbol: 'PEPE',
        },
        {
            address: '0x0a13a5929e5f0ff0eaba4bd9e9512c91fce40280',
            decimals: 9,
            symbol: 'XAI',
        },
        {
            address: '0xda7c0810ce6f8329786160bb3d1734cf6661ca6e',
            decimals: 18,
            symbol: 'JAY',
        },
        {
            address: '0x53250b5dfa8c911547afeaf18db025024c8e919a',
            decimals: 9,
            symbol: 'KERMIT',
        },
        {
            address: '0x430d8fe6a177f0e2c7270b51adfdeacac9140a51',
            decimals: 9,
            symbol: '$WAGMI',
        },
        {
            address: '0xee772cec929d8430b4fa7a01cd7fbd159a68aa83',
            decimals: 18,
            symbol: 'SHANG',
        },
        {
            address: '0x5c559f3ee9a81da83e069c0093471cb05d84052a',
            decimals: 18,
            symbol: 'BABYPEPE',
        },
        {
            address: '0x18a8d75f70eaead79b5a55903d036ce337f623a5',
            decimals: 18,
            symbol: 'SIGMA',
        },
        {
            address: '0xf951e335afb289353dc249e82926178eac7ded78',
            decimals: 18,
            symbol: 'swETH',
        },
        {
            address: '0xec3dc9ba0226dd571786767bfc8df91e045cdc82',
            decimals: 18,
            symbol: 'MUMU',
        },
        {
            address: '0x2f573070e6090b3264fe707e2c9f201716f123c7',
            decimals: 18,
            symbol: 'MUMU',
        },
        {
            address: '0x7089108587c72efce36e0c7d38fc8e0ec389956c',
            decimals: 18,
            symbol: 'FROGGER',
        },
        {
            address: '0x5026f006b85729a8b14553fae6af249ad16c9aab',
            decimals: 18,
            symbol: 'WOJAK',
        },
        {
            address: '0x6b89b97169a797d94f057f4a0b01e2ca303155e4',
            decimals: 18,
            symbol: 'CHAD',
        },
        {
            address: '0x244f09d92971d03a779aa66d310579a6517ab9a4',
            decimals: 18,
            symbol: 'HARAMBE',
        },
        {
            address: '0x7683b37d7f7e0bd92734d8ab5b6c78521d3e6e9d',
            decimals: 18,
            symbol: 'BONGO',
        },
        {
            address: '0x5888641e3e6cbea6d84ba81edb217bd691d3be38',
            decimals: 9,
            symbol: 'BOBO',
        },
        {
            address: '0x51ef29d2f61f9abbb50624205f7b0946efb8853c',
            decimals: 9,
            symbol: 'KEK',
        },
        {
            address: '0x2718fedfc22cc6d727932c8424993218b0acb859',
            decimals: 18,
            symbol: 'TRAD',
        },
        {
            address: '0xe0151763455a8a021e64880c238ba1cff3787ff0',
            decimals: 18,
            symbol: 'APED',
        },
        {
            address: '0x1dff69d892d7a503088522b830eadcba9867f6bd',
            decimals: 8,
            symbol: 'WRY',
        },
        {
            address: '0x5efcea234f7547de4569aad1215fa5d2adaced38',
            decimals: 18,
            symbol: 'HONK',
        },
        {
            address: '0x9138c8779a0ac8a84d69617d5715bd8afa23c650',
            decimals: 18,
            symbol: 'FLRBRG',
        },
        {
            address: '0xf8ebf4849f1fa4faf0dff2106a173d3a6cb2eb3a',
            decimals: 18,
            symbol: 'TROLL',
        },
        {
            address: '0xd8e163967fed76806df0097b704ba721b9b37656',
            decimals: 18,
            symbol: 'COPE',
        },
        {
            address: '0x1f19d846d99a0e75581913b64510fe0e18bbc31f',
            decimals: 18,
            symbol: 'FGM',
        },
        {
            address: '0xad1a5b8538a866ecd56ddd328b50ed57ced5d936',
            decimals: 18,
            symbol: 'GENSLR',
        },
        {
            address: '0x208cf5b95b132a408698f07741427b8ec66b0a09',
            decimals: 18,
            symbol: 'HOPE',
        },
        {
            address: '0xeaf9a34b79a124df6f04d72a0855f6655132dc42',
            decimals: 18,
            symbol: 'BC',
        },
        {
            address: '0x7d8146cf21e8d7cbe46054e01588207b51198729',
            decimals: 18,
            symbol: 'BOB',
        },
        {
            address: '0x33abe795f9c1b6136608c36db211bd7590f5fdae',
            decimals: 18,
            symbol: 'WOLF',
        },
        {
            address: '0x1a963df363d01eebb2816b366d61c917f20e1ebe',
            decimals: 18,
            symbol: 'MEMEME',
        },
        {
            address: '0x9886844e50499e127708590e22b813d5d5aa8962',
            decimals: 18,
            symbol: '$PEPEPE',
        },
        {
            address: '0xe71e69c8b8c31a97c8e8ca65bffc95089b477858',
            decimals: 9,
            symbol: 'PEPEPE',
        },
        {
            address: '0x4fcba85032cd8c4035ed1b7adddb125491509d30',
            decimals: 18,
            symbol: 'VPEPE',
        },
        {
            address: '0xaa0de51deab3a9272b83a810056c2f4036e60475',
            decimals: 18,
            symbol: 'FKWOJAK',
        },
        {
            address: '0x551d0501cd5df92663c3d12c3201c9d70ba79998',
            decimals: 18,
            symbol: 'YOBASE',
        },
        {
            address: '0x15f20f9dfdf96ccf6ac96653b7c0abfe4a9c9f0f',
            decimals: 18,
            symbol: 'WSB',
        },
        {
            address: '0xc5dc20e3f6eac3f168da06022a46912ba19ed9cc',
            decimals: 9,
            symbol: 'PepeStoned',
        },
        {
            address: '0xfe8546f4ac4180638edbc9ef9a5820450788e2ea',
            decimals: 18,
            symbol: 'POPO',
        },
        {
            address: '0x109e942ac45ad733c4950d285d7ffa7de9f3c4bd',
            decimals: 18,
            symbol: 'SADPEPE',
        },
        {
            address: '0xb8c55c80a1cb7394088a36c6b634dc2bf3c6fb67',
            decimals: 18,
            symbol: 'PEPEDOGE',
        },
        {
            address: '0xad8d0de33c43eefe104a279cdb6ae250c12e6214',
            decimals: 9,
            symbol: 'NARUTO',
        },
        {
            address: '0xc4058f6a829ddd684e1b7589b33312827f0a47bb',
            decimals: 18,
            symbol: 'aNDY',
        },
        {
            address: '0x258d7a3f50b03a9f75263733fc0c2a155cf512b4',
            decimals: 18,
            symbol: 'RICHPEPE',
        },
        {
            address: '0x729dbd3e028e8ea0a253502de96b25c76819cf44',
            decimals: 9,
            symbol: 'FGM',
        },
        {
            address: '0x3d9a4d8ab4f5bd1d5d08ae3a95e8ed8bb4d7e3b9',
            decimals: 18,
            symbol: 'STONKS',
        },
        {
            address: '0x6c4c193bff0a117f0c2b516802abba961a1eeb12',
            decimals: 18,
            symbol: 'PAPA',
        },
        {
            address: '0xa21af1050f7b26e0cff45ee51548254c41ed6b5c',
            decimals: 18,
            symbol: 'OSAK',
        },
        {
            address: '0xddc6625feca10438857dd8660c021cd1088806fb',
            decimals: 18,
            symbol: 'RAD',
        },
        {
            address: '0xaada04204e9e1099daf67cf3d5d137e84e41cf41',
            decimals: 18,
            symbol: 'PEEPO',
        },
        {
            address: '0x1f17d72cbe65df609315df5c4f5f729efbd00ade',
            decimals: 18,
            symbol: 'GYOSHI',
        },
        {
            address: '0xbac39684a111330b7afd39d76728d6ab0be5be36',
            decimals: 18,
            symbol: 'STICK',
        },
        {
            address: '0x9778ac3d5a2f916aa9abf1eb85c207d990ca2655',
            decimals: 18,
            symbol: 'OGSM',
        },
        {
            address: '0x7cb683151a83c2b10a30cbb003cda9996228a2ba',
            decimals: 18,
            symbol: 'IYKYK',
        },
        {
            address: '0x4385328cc4d643ca98dfea734360c0f596c83449',
            decimals: 18,
            symbol: 'TOMI',
        },
        {
            address: '0xb69753c06bb5c366be51e73bfc0cc2e3dc07e371',
            decimals: 18,
            symbol: 'POOH',
        },
        {
            address: '0xba386a4ca26b85fd057ab1ef86e3dc7bdeb5ce70',
            decimals: 18,
            symbol: 'JESUS',
        },
        {
            address: '0x1ce270557c1f68cfb577b856766310bf8b47fd9c',
            decimals: 18,
            symbol: '$MONG',
        },
        {
            address: '0x433117819df60cb943ec57fbc885c894c5602e1e',
            decimals: 0,
            symbol: 'GME',
        },
        {
            address: '0x2d5aca3c4fdb6954461fbff71b12798756503970',
            decimals: 18,
            symbol: 'mPEPE',
        },
        {
            address: '0x4216663ddc7bd10eaf44609df4dd0f91cd2be7f2',
            decimals: 18,
            symbol: 'MPEPE',
        },
        {
            address: '0xadfbfa478240a2f323e9e2a98c6da70fcb2707b7',
            decimals: 18,
            symbol: 'BERA',
        },
        {
            address: '0xab306326bc72c2335bd08f42cbec383691ef8446',
            decimals: 18,
            symbol: 'PPIZZA',
        },
        {
            address: '0xd87d72248093597df8d56d2a53c1ab7c1a0cc8da',
            decimals: 18,
            symbol: 'HaHa',
        },
        {
            address: '0xa9e8acf069c58aec8825542845fd754e41a9489a',
            decimals: 18,
            symbol: 'pepecoin',
        },
        {
            address: '0x7463c17e3d91b17d9cd0b1e9fdfa18d4ddc3cf0e',
            decimals: 18,
            symbol: 'SHREK',
        },
        {
            address: '0x1eca6f227e42f12883350f8841463cc073f4c4a6',
            decimals: 18,
            symbol: 'dogecoin',
        },
        {
            address: '0x7c941a1262f5f67a294521663bf5ce58573de5f7',
            decimals: 18,
            symbol: 'ME',
        },
        {
            address: '0xa35923162c49cf95e6bf26623385eb431ad920d3',
            decimals: 18,
            symbol: 'TURBO',
        },
        {
            address: '0xaca55d5a5f58e29bd1e00e4b1bdeda62d2ecf33f',
            decimals: 18,
            symbol: 'MRSPEPE',
        },
        {
            address: '0x335f4e66b9b61cee5ceade4e727fcec20156b2f0',
            decimals: 18,
            symbol: 'ELMO',
        },
        {
            address: '0x064dec407bdaec145840149f8820020ab22eb999',
            decimals: 9,
            symbol: 'Laszlo',
        },
        {
            address: '0x8a944bb731e302fdb3571350513f149f15fcbe34',
            decimals: 18,
            symbol: 'RIZZ',
        },
        {
            address: '0xbdadbf796ad5098698bfb86f851705ff0b6a9ee5',
            decimals: 9,
            symbol: 'AMC',
        },
        {
            address: '0xcf2cfe0b96a2ece970d5619a8ad28d02d73b42db',
            decimals: 9,
            symbol: 'SPX',
        },
        {
            address: '0xa363d5d855a9798263ca4c889ce09c0f6910656f',
            decimals: 18,
            symbol: 'GECKO',
        },
        {
            address: '0x3684c1bedb884923a933c9ac95a487d5c38ab7e7',
            decimals: 18,
            symbol: 'KEKE',
        },
        {
            address: '0x77b4a0528c84990ccdcb3d4a8ce31ec7cb2a564f',
            decimals: 18,
            symbol: 'PEPEBILL',
        },
        {
            address: '0x86eab36585eddb7a949a0b4771ba733d942a8aa7',
            decimals: 9,
            symbol: 'REDDIT',
        },
        {
            address: '0xe0a458bf4acf353cb45e211281a334bb1d837885',
            decimals: 9,
            symbol: '4CHAN',
        },
        {
            address: '0x0414d8c87b271266a5864329fb4932bbe19c0c49',
            decimals: 18,
            symbol: 'WSB',
        },
        {
            address: '0x87dd7c4d897ebcb6f647ed334756fbd92085ef37',
            decimals: 9,
            symbol: 'KEK',
        },
        {
            address: '0xaee9ba9ce49fe810417a36408e34d9962b653e78',
            decimals: 9,
            symbol: 'SNIBBU',
        },
        {
            address: '0x816fd35443f56e1fc0ae74c19622a20cca1291cc',
            decimals: 9,
            symbol: 'PEEP',
        },
        {
            address: '0x34134ab45843b4915c1c28c5f802c375861002bd',
            decimals: 18,
            symbol: 'Trump',
        },
        {
            address: '0x48011585b026b451ab2902ff611f4ae82d1b1bc1',
            decimals: 9,
            symbol: 'WEN',
        },
        {
            address: '0x049e9f5369358786a1ce6483d668d062cfe547ec',
            decimals: 18,
            symbol: 'CHECKS',
        },
        {
            address: '0xe9a97b0798b1649045c1d7114f8c432846828404',
            decimals: 18,
            symbol: 'FROGE',
        },
        {
            address: '0x77e0e0c2baef16db6a8c137b55403fd008686bd2',
            decimals: 6,
            symbol: 'AIBABYDOGE',
        },
        {
            address: '0xf43f21384d03b5cbbddd58d2de64071e4ce76ab0',
            decimals: 18,
            symbol: 'GIGACHAD',
        },
        {
            address: '0xb5b2a1dbf9109d7d2e2504cd6cdd10e6287d926b',
            decimals: 9,
            symbol: 'BUTTCOIN',
        },
        {
            address: '0xe46091dce9c67691bcf22768bbee0bc9e20d4beb',
            decimals: 9,
            symbol: 'WSBC',
        },
        {
            address: '0x79d374423a7ee71ad332cf8d8bb596d739f4c30c',
            decimals: 18,
            symbol: 'RONI',
        },
        {
            address: '0x53e58c83cd9b94429cbc67c6f7fbf28d951adf8e',
            decimals: 9,
            symbol: 'FGM',
        },
        {
            address: '0x44aad22afbb2606d7828ca1f8f9e5af00e779ae1',
            decimals: 9,
            symbol: 'Simpson',
        },
        {
            address: '0x2c95d751da37a5c1d9c5a7fd465c1d50f3d96160',
            decimals: 18,
            symbol: 'WASSIE',
        },
        {
            address: '0xa15865d9de09cb96aaa3a9081b3dfc8481f07d33',
            decimals: 18,
            symbol: 'POPE',
        },
        {
            address: '0xd8e2d95c8614f28169757cd6445a71c291dec5bf',
            decimals: 18,
            symbol: 'GrumpyCat',
        },
        {
            address: '0xf7168c8abb0ff80116413a8d95396bbdc318a3ff',
            decimals: 7,
            symbol: 'KEKE',
        },
        {
            address: '0xe22f94e75b411257fa5dca7804f00e712db5350e',
            decimals: 18,
            symbol: 'BULLS',
        },
        {
            address: '0x18cc2ba8995c6307e355726244adb023cf00522f',
            decimals: 9,
            symbol: 'MONKE',
        },
        {
            address: '0x50a69cea809b4afed9a31a72f049a5b0b33bf5e3',
            decimals: 18,
            symbol: 'SKID',
        },
        {
            address: '0x878fcc2bdcccff8c56812607b9a58f29b274c4f0',
            decimals: 18,
            symbol: 'DERP',
        },
        {
            address: '0xf017d3690346eb8234b85f74cee5e15821fee1f4',
            decimals: 18,
            symbol: 'GEKKO',
        },
        {
            address: '0x8e235f491ae66b82296d58332adc2a021c449c10',
            decimals: 18,
            symbol: 'TIPJA',
        },
        {
            address: '0xcc08086af6458e8de650629fd706206764ac9eeb',
            decimals: 18,
            symbol: 'ZOGZ',
        },
        {
            address: '0xb794ad95317f75c44090f64955954c3849315ffe',
            decimals: 18,
            symbol: 'RIBBIT',
        },
        {
            address: '0x0ebe30595a44e5288c24161ddfc1e9fa08e33a0c',
            decimals: 18,
            symbol: 'NYAN',
        },
        {
            address: '0xe45f1587dc5f011a2b45a337208cfbf04ac029f0',
            decimals: 18,
            symbol: 'DANK',
        },
        {
            address: '0x00e13ff16d54619024ab3b861f25b84bd53e8ac1',
            decimals: 18,
            symbol: 'CNLT',
        },
        {
            address: '0x32b86b99441480a7e5bd3a26c124ec2373e3f015',
            decimals: 18,
            symbol: 'BAD',
        },
        {
            address: '0x370a366f402e2e41cdbbe54ecec12aae0cce1955',
            decimals: 18,
            symbol: 'TOAD',
        },
        {
            address: '0xf831938caf837cd505de196bbb408d81a06376ab',
            decimals: 18,
            symbol: 'JEFF',
        },
        {
            address: '0x378e1be15be6d6d1f23cfe7090b6a77660dbf14d',
            decimals: 18,
            symbol: 'FOXE',
        },
        {
            address: '0x04f518f4bd44c02255625f609bfbcbbf2d018089',
            decimals: 9,
            symbol: 'GARY',
        },
        {
            address: '0x5c2975269e74cb3a8514e5b800a1e66c694d4df8',
            decimals: 18,
            symbol: 'HER',
        },
        {
            address: '0x85a78ceaa2f9a139b4528bec7e6c9ccd36fd0f01',
            decimals: 9,
            symbol: 'NORMIE',
        },
        {
            address: '0x31555696dd1242b2ab67b9a53b6465c814502f2c',
            decimals: 18,
            symbol: 'KEVIN',
        },
        {
            address: '0xcbc52aac30b82c490d5ae6177e6c8600f8ca347e',
            decimals: 18,
            symbol: 'EPEP',
        },
        {
            address: '0xb939da54f9748440a1b279d42be1296942732288',
            decimals: 18,
            symbol: 'FONZY',
        },
        {
            address: '0xb1db53c3f00b4de29bea0c15a5a33b0ac0017348',
            decimals: 18,
            symbol: 'DOLAN',
        },
        {
            address: '0x8484e645a054586a6d6af60c0ee911d7b5180e64',
            decimals: 18,
            symbol: 'DYOR',
        },
        {
            address: '0xacb3f64aa4b8e25c07320b476342cd6152f561ae',
            decimals: 18,
            symbol: 'BOFA',
        },
        {
            address: '0x07609e3acd353fbdb53984b1c3e1d3553619eb74',
            decimals: 18,
            symbol: 'kalm',
        },
        {
            address: '0x471a202f69d6e975da55e363dab1bdb2e86e0c0f',
            decimals: 18,
            symbol: 'GEKE',
        },
        {
            address: '0x71f2ea5bdb50faf0a1060774a7f36a57b4a24b9b',
            decimals: 9,
            symbol: 'CHUNGUS',
        },
        {
            address: '0x6bc73c8243ff905f8c5cadb14b7f1474df9b0027',
            decimals: 9,
            symbol: 'Bluey',
        },
        {
            address: '0x8fe386ec7dc28d83e10b4f0981cab36195ee7300',
            decimals: 18,
            symbol: 'PEPED',
        },
        {
            address: '0x0d248ce39e26fb00f911fb1e7a45a00d8c94341c',
            decimals: 18,
            symbol: 'BUTTER',
        },
        {
            address: '0x977d51730e3d37a139f0306b25549fda33025657',
            decimals: 18,
            symbol: 'SNED',
        },
        {
            address: '0x516e2758b044433371076a48127b8cfa7b0bdb43',
            decimals: 18,
            symbol: 'SMUDGE',
        },
        {
            address: '0xd807f7e2818db8eda0d28b5be74866338eaedb86',
            decimals: 18,
            symbol: 'jim',
        },
        {
            address: '0xf03d5fc6e08de6ad886fca34abf9a59ef633b78a',
            decimals: 18,
            symbol: 'CAPY',
        },
        {
            address: '0x12970e6868f88f6557b76120662c1b3e50a646bf',
            decimals: 18,
            symbol: 'LADYS',
        },
        {
            address: '0x244b797d622d4dee8b188b03546acaabd0cf91a0',
            decimals: 18,
            symbol: 'FOUR',
        },
        {
            address: '0x271a66f8c4728b07a6a8d3895cf825f4a0791d3c',
            decimals: 18,
            symbol: 'Minions',
        },
        {
            address: '0x03c7f506cfb39494cbb4b7a207c1c04a08a2b927',
            decimals: 18,
            symbol: 'ARRKY',
        },
        {
            address: '0xea7b7dc089c9a4a916b5a7a37617f59fd54e37e4',
            decimals: 6,
            symbol: 'HyPC',
        },
        {
            address: '0x149d8290f653deb8e34c037d239d3d8eee9de5ad',
            decimals: 18,
            symbol: 'KING',
        },
        {
            address: '0xcc59244e976b98a4b05728794ba0d91e89a355e2',
            decimals: 18,
            symbol: 'WALRUS',
        },
        {
            address: '0x3fd00038bfd3eb22f51118468c9d43c1eb7210f3',
            decimals: 9,
            symbol: 'RIN',
        },
        {
            address: '0xe2ac4d20862eabe623e9ee07ae854d7cb9d3fd6d',
            decimals: 18,
            symbol: 'ZOE',
        },
        {
            address: '0x72e4f9f808c49a2a61de9c5896298920dc4eeea9',
            decimals: 8,
            symbol: 'BITCOIN',
        },
        {
            address: '0xe2f668f6166eda65620a01c4c116a5f6e5528614',
            decimals: 18,
            symbol: 'GUSTA',
        },
        {
            address: '0x1904dedb11be71268c74abdc6c24c1168bcbb72d',
            decimals: 9,
            symbol: 'LORDS',
        },
        {
            address: '0xffd822149fa6749176c7a1424e71a417f26189c8',
            decimals: 18,
            symbol: 'thing',
        },
        {
            address: '0xc5e6c0fa0a0b8fedac5e575c96f838fe37fc6c5a',
            decimals: 18,
            symbol: 'OOO',
        },
        {
            address: '0xb90b2a35c65dbc466b04240097ca756ad2005295',
            decimals: 18,
            symbol: 'BOBO',
        },
        {
            address: '0xa120199529228d39cffb62de9dfaddbd4ba9e337',
            decimals: 18,
            symbol: 'ETHEREUM',
        },
        {
            address: '0x9bf1d7d63dd7a4ce167cf4866388226eeefa702e',
            decimals: 18,
            symbol: 'BEN',
        },
        {
            address: '0xaca4fdeb63eed8d7392042508d1cacbcc41db64d',
            decimals: 18,
            symbol: 'BRETT',
        },
        {
            address: '0xa1abecc1b3958da78259fa2793653fc48e976420',
            decimals: 18,
            symbol: 'DOGGGO',
        },
        {
            address: '0x7f792db54b0e580cdc755178443f0430cf799aca',
            decimals: 9,
            symbol: 'VOLT',
        },
        {
            address: '0xa9d54f37ebb99f83b603cc95fc1a5f3907aaccfd',
            decimals: 18,
            symbol: 'PIKA',
        },
        {
            address: '0xc961da88bb5e8ee2ba7dfd4c62a875ef80f7202f',
            decimals: 9,
            symbol: 'HARAM',
        },
        {
            address: '0x0e48137a5e69859ef7d0652a3c43ea040c63c72e',
            decimals: 9,
            symbol: 'WORLD',
        },
        {
            address: '0xfe1ef2b469846d1832b25095ff51b004f090e0c6',
            decimals: 18,
            symbol: 'PEPE',
        },
        {
            address: '0x7163436b8efffb469f6bb81cc908b1661d4795e6',
            decimals: 18,
            symbol: 'ESCO',
        },
        {
            address: '0x26b17fc034b82a20563dbb02ec9e78b1d65d7a58',
            decimals: 18,
            symbol: 'PENGU',
        },
        {
            address: '0x50583dfa0fa5805712b1e6091a76515e8aae0ce0',
            decimals: 18,
            symbol: 'CF',
        },
        {
            address: '0x5dcd6272c3cbb250823f0b7e6c618bce11b21f90',
            decimals: 18,
            symbol: 'PEAR',
        },
        {
            address: '0x628a3b2e302c7e896acc432d2d0dd22b6cb9bc88',
            decimals: 18,
            symbol: 'LMWR',
        },
        {
            address: '0x8e6a593d82ee4cb4afaf8e08ea887ae15b039d3e',
            decimals: 18,
            symbol: 'SPOO',
        },
        {
            address: '0xd1d2eb1b1e90b638588728b4130137d262c87cae',
            decimals: 8,
            symbol: 'GALA',
        },
        {
            address: '0x97ac4a2439a47c07ad535bb1188c989dae755341',
            decimals: 18,
            symbol: 'WPLS',
        },
        {
            address: '0x27fc3baf0d2b14eabacff6a93890cd47520f20ff',
            decimals: 18,
            symbol: 'WEED',
        },
        {
            address: '0x4743a7a193cdf202035e9bc6830a07f1607630c4',
            decimals: 18,
            symbol: 'GUY',
        },
        {
            address: '0x25b2f1d04dd68f95f9ab5d511b92e21dbbb2d173',
            decimals: 18,
            symbol: 'MULE',
        },
        {
            address: '0x7dda472c943f83925e36f2ee5adf7815c351e433',
            decimals: 9,
            symbol: 'BASED',
        },
        {
            address: '0xb5bacca994ebce5f961930914a10110103b2260b',
            decimals: 18,
            symbol: 'DAN',
        },
        {
            address: '0xea81dab2e0ecbc6b5c4172de4c22b6ef6e55bd8f',
            decimals: 18,
            symbol: 'PLEB',
        },
        {
            address: '0xb2e96a63479c2edd2fd62b382c89d5ca79f572d3',
            decimals: 8,
            symbol: 'wZNN',
        },
        {
            address: '0x113c65707c530502fef959308197353f6df97867',
            decimals: 18,
            symbol: 'JOKER',
        },
        {
            address: '0xab5d6508e4726141d29c6074ab366afa03f4ec8d',
            decimals: 18,
            symbol: 'TRUCK',
        },
        {
            address: '0x9ff58067bd8d239000010c154c6983a325df138e',
            decimals: 18,
            symbol: 'PROPC',
        },
        {
            address: '0xef8e456967122db4c3c160314bde8d2602ad6199',
            decimals: 9,
            symbol: 'WAGMI',
        },
        {
            address: '0x7298d65dee4a57d5ce807fcc93d6e84247baf922',
            decimals: 18,
            symbol: 'TIF',
        },
        {
            address: '0xf4172630a656a47ece8616e75791290446fa41a0',
            decimals: 2,
            symbol: 'PEPPA',
        },
        {
            address: '0xb1e8df7e585b1ffed100843ea99b54324db49d67',
            decimals: 18,
            symbol: 'MUSK',
        },
        {
            address: '0x3007083eaa95497cd6b2b809fb97b6a30bdf53d3',
            decimals: 18,
            symbol: 'PSYOP',
        },
        {
            address: '0x745407c86df8db893011912d3ab28e68b62e49b0',
            decimals: 18,
            symbol: 'MAHA',
        },
        {
            address: '0xd64820317d3ec0caf139b69ff77a4bca5a26b020',
            decimals: 18,
            symbol: 'SEXY',
        },
        {
            address: '0x00c5ca160a968f47e7272a0cfcda36428f386cb6',
            decimals: 18,
            symbol: 'USDEBT',
        },
        {
            address: '0xb5f6f05bc86a9d62f7165f606dc149c4c5f04ed1',
            decimals: 18,
            symbol: 'XDOGE',
        },
        {
            address: '0x955d5c14c8d4944da1ea7836bd44d54a8ec35ba1',
            decimals: 18,
            symbol: 'RFD',
        },
        {
            address: '0x61a35258107563f6b6f102ae25490901c8760b12',
            decimals: 18,
            symbol: 'kitty',
        },
        {
            address: '0xe9da5e227e3fa4fc933b5f540be021e7ecc3fd81',
            decimals: 18,
            symbol: 'GMFAM',
        },
        {
            address: '0xc983c1bd8393dd5c630a3d6c4fe9e5c92e582328',
            decimals: 18,
            symbol: 'Kekya',
        },
        {
            address: '0xd0e23408bf35c5425a1ca7d37feca58eba693d92',
            decimals: 8,
            symbol: 'POPE',
        },
        {
            address: '0xff8c479134a18918059493243943150776cf8cf2',
            decimals: 18,
            symbol: 'RENQ',
        },
        {
            address: '0x15f370f9bdb6b51ed01a21d79e9212c7a6562103',
            decimals: 9,
            symbol: 'SLASHA',
        },
        {
            address: '0x9b9647431632af44be02ddd22477ed94d14aacaa',
            decimals: 18,
            symbol: 'KOK',
        },
        {
            address: '0xfb57a5e307aefb3e49aa83e1a2ecaba475a0b900',
            decimals: 18,
            symbol: 'hope',
        },
        {
            address: '0xe28027c99c7746ffb56b0113e5d9708ac86fae8f',
            decimals: 9,
            symbol: 'KING',
        },
        {
            address: '0x395e925834996e558bdec77cd648435d620afb5b',
            decimals: 7,
            symbol: 'TFT',
        },
        {
            address: '0x4a0552f34f2237ce3d15ca69d09f65b7d7aa00bb',
            decimals: 18,
            symbol: 'PAIN',
        },
        {
            address: '0x5c884f44dd80f6fddff813c068bbb571d6623260',
            decimals: 18,
            symbol: 'DOGETH',
        },
        {
            address: '0x2a08ef1cfd18f986bb2937d9b9e561159e9af599',
            decimals: 18,
            symbol: 'SPERM',
        },
        {
            address: '0x693c216aa181ebf776730d16c7ba06842548415e',
            decimals: 18,
            symbol: 'PAPI',
        },
        {
            address: '0x65ee1361596439664059d1a5ef44014d08c95693',
            decimals: 18,
            symbol: 'NEURALINK',
        },
        {
            address: '0x5052fa4a2a147eaaa4c0242e9cc54a10a4f42070',
            decimals: 18,
            symbol: 'HANeP',
        },
        {
            address: '0x00282fd551d03dc033256c4bf119532e8c735d8a',
            decimals: 2,
            symbol: 'BIAO',
        },
        {
            address: '0x10f0d8abab0c5ae6ed4fa33a9d1e8ac9ab518f1c',
            decimals: 18,
            symbol: 'DZILLA',
        },
        {
            address: '0xbddf903f43dc7d9801f3f0034ba306169074ef8e',
            decimals: 18,
            symbol: 'AGB',
        },
        {
            address: '0x40c3b81fb887016c0ad02436309c2b265d069a05',
            decimals: 18,
            symbol: 'CTO',
        },
        {
            address: '0x985e0df1f95729f054cf959a07362d33f22a6670',
            decimals: 9,
            symbol: 'PING',
        },
        {
            address: '0xb22c05cedbf879a661fcc566b5a759d005cf7b4c',
            decimals: 18,
            symbol: 'LOVE',
        },
        {
            address: '0x34f514a2721ba88caed2aa8f8e95084a300320d2',
            decimals: 18,
            symbol: 'TIMMY',
        },
        {
            address: '0xc3681a720605bd6f8fe9a2fabff6a7cdecdc605d',
            decimals: 18,
            symbol: 'NiHao',
        },
        {
            address: '0x0a44a7ccea34a7563ba1d45a5f757d0b02281124',
            decimals: 18,
            symbol: 'BBL',
        },
        {
            address: '0xc7a2572fa8fdb0f7e81d6d3c4e3ccf78fb0dc374',
            decimals: 18,
            symbol: 'FINALE',
        },
        {
            address: '0xae93dfbef7cfbbaca7c3a9e8b55ae1be34c3db16',
            decimals: 18,
            symbol: 'MOM',
        },
        {
            address: '0x2ad9addd0d97ec3cdba27f92bf6077893b76ab0b',
            decimals: 18,
            symbol: 'PLANET',
        },
        {
            address: '0x013062189dc3dcc99e9cee714c513033b8d99e3c',
            decimals: 18,
            symbol: 'INFRA',
        },
        {
            address: '0xaf4e629f231845e2c85701c846a43cb7135851ca',
            decimals: 9,
            symbol: 'BOC',
        },
        {
            address: '0x2ecba91da63c29ea80fbe7b52632ca2d1f8e5be0',
            decimals: 18,
            symbol: 'ferc',
        },
        {
            address: '0x445bd590a01fe6709d4f13a8f579c1e4846921db',
            decimals: 18,
            symbol: 'DUMMY',
        },
        {
            address: '0x50327c6c5a14dcade707abad2e27eb517df87ab5',
            decimals: 6,
            symbol: 'TRX',
        },
        {
            address: '0x934c072dd9e350098d7fe987900c8fc02c1ccc38',
            decimals: 18,
            symbol: 'HYPE',
        },
        {
            address: '0xebb2895bbe17f6a9b3f537d5363b3f1d067f8fb0',
            decimals: 18,
            symbol: 'CATGPT',
        },
        {
            address: '0xc76d53f988820fe70e01eccb0248b312c2f1c7ca',
            decimals: 18,
            symbol: 'INU',
        },
        {
            address: '0xe6f7e4dca367b0fa80e25d8f18a58b4cdcc21e62',
            decimals: 18,
            symbol: 'ANIME',
        },
        {
            address: '0x9eeb56d88f7e32557ef8e67ad16080a760ca3a15',
            decimals: 9,
            symbol: 'KENNEDY',
        },
        {
            address: '0xc785698504a70be37d0e939a4c5326f8eddd5beb',
            decimals: 9,
            symbol: 'QUBY',
        },
        {
            address: '0xb1c064c3f2908f741c9dea4afc5773238b53e6cc',
            decimals: 9,
            symbol: 'XRP',
        },
        {
            address: '0xd04e772bc0d591fbd288f2e2a86afa3d3cb647f8',
            decimals: 18,
            symbol: 'GPT',
        },
        {
            address: '0x13dbd5394c2c7e4bdb85b1838286faa66532a262',
            decimals: 18,
            symbol: 'TZU',
        },
        {
            address: '0x59f4f336bf3d0c49dbfba4a74ebd2a6ace40539a',
            decimals: 9,
            symbol: 'CAT',
        },
        {
            address: '0x24d86df61479982c90d2977f4ba839496895559d',
            decimals: 18,
            symbol: 'HYPE',
        },
        {
            address: '0x8a1822bf6889130b43572cdb3e41b015ba2197b0',
            decimals: 18,
            symbol: 'GOOSE',
        },
        {
            address: '0x6ac85b5698190a3b868f5d546bc50bf12c386094',
            decimals: 8,
            symbol: 'DOGECOIN',
        },
        {
            address: '0x357c915d7c12dc506d13332bb06c932af13e99a0',
            decimals: 18,
            symbol: 'LUCKYSLP',
        },
        {
            address: '0x8713457c4c4bc8e7e491b8f0b1f2e05f6c020213',
            decimals: 18,
            symbol: 'EDIBLE',
        },
        {
            address: '0x6f49694827d46a14baf2a7b1eac3e6eb3526a84f',
            decimals: 9,
            symbol: 'TUCKER',
        },
        {
            address: '0x409b46013c78c63cf376f17466aef87895617451',
            decimals: 18,
            symbol: 'ERUTA',
        },
        {
            address: '0xda8263d8ce3f726233f8b5585bcb86a3120a58b6',
            decimals: 18,
            symbol: 'DOGC',
        },
        {
            address: '0x92bd29a7dea8e5bfe4056992c6520b77b40af561',
            decimals: 9,
            symbol: 'ZILLA',
        },
        {
            address: '0x5de597849cf72c72f073e9085bdd0dadd8e6c199',
            decimals: 18,
            symbol: 'FBX',
        },
        {
            address: '0xf819d9cb1c2a819fd991781a822de3ca8607c3c9',
            decimals: 18,
            symbol: 'UNIBOT',
        },
        {
            address: '0x4ac429a7cdf2b533e2c0cff1b017f2c344e864e2',
            decimals: 18,
            symbol: 'PLSX',
        },
        {
            address: '0x4c6e2c495b974b8d4220e370f23c7e0e1da9b644',
            decimals: 9,
            symbol: 'SMILEY',
        },
        {
            address: '0x5f5166c4fdb9055efb24a7e75cc1a21ca8ca61a3',
            decimals: 9,
            symbol: 'X',
        },
        {
            address: '0x285db79fa7e0e89e822786f48a7c98c6c1dc1c7d',
            decimals: 18,
            symbol: 'MIC',
        },
        {
            address: '0x2779620435541d6487fe5691917c6f5bdbd1521c',
            decimals: 9,
            symbol: 'GOOSE',
        },
        {
            address: '0xa19f5264f7d7be11c451c093d8f92592820bea86',
            decimals: 18,
            symbol: 'BYTES',
        },
        {
            address: '0x8a0c816a52e71a1e9b6719580ebe754709c55198',
            decimals: 18,
            symbol: 'ZKLAB',
        },
        {
            address: '0x44971abf0251958492fee97da3e5c5ada88b9185',
            decimals: 18,
            symbol: 'basedAI',
        },
        {
            address: '0xd7504b0844694cfc34d7b89371b23c5c6e061eb1',
            decimals: 18,
            symbol: 'CHEEMS',
        },
        {
            address: '0x0e9cc0f7e550bd43bd2af2214563c47699f96479',
            decimals: 18,
            symbol: 'UNLEASH',
        },
        {
            address: '0x96546afe4a21515a3a30cd3fd64a70eb478dc174',
            decimals: 8,
            symbol: 'wQSR',
        },
        {
            address: '0x03b3d50b4fccf166502186b2af743fd1baa3e0d4',
            decimals: 18,
            symbol: 'PAAL',
        },
        {
            address: '0x53fffb19bacd44b82e204d036d579e86097e5d09',
            decimals: 18,
            symbol: 'BGBG',
        },
        {
            address: '0xd96e84ddbc7cbe1d73c55b6fe8c64f3a6550deea',
            decimals: 18,
            symbol: 'GMAC',
        },
        {
            address: '0x1e3778dd6dbfdc1c5b89f95f7c098b21e80ec4fa',
            decimals: 18,
            symbol: 'VIC',
        },
        {
            address: '0x55a380d134d722006a5ce2d510562e1239d225b1',
            decimals: 18,
            symbol: 'MARVIN',
        },
        {
            address: '0x1f1c8b8caa6d207c68f1bbf26b8f38ac83fab086',
            decimals: 18,
            symbol: 'UNIV',
        },
        {
            address: '0xfb66321d7c674995dfcc2cb67a30bc978dc862ad',
            decimals: 18,
            symbol: 'PEPE2.0',
        },
        {
            address: '0x046eee2cc3188071c02bfc1745a6b17c656e3f3d',
            decimals: 18,
            symbol: 'RLB',
        },
        {
            address: '0x7e83520c42d467b9d8a6997fcccc3af2bb6c316e',
            decimals: 18,
            symbol: 'EAGLE',
        },
        {
            address: '0xe3944ab788a60ca266f1eec3c26925b95f6370ad',
            decimals: 18,
            symbol: 'RAIN',
        },
        {
            address: '0x0d505c03d30e65f6e9b4ef88855a47a89e4b7676',
            decimals: 18,
            symbol: 'ZOOMER',
        },
        {
            address: '0x77a687d2dd0bbb797c674f9b7bb4a73f65e87663',
            decimals: 9,
            symbol: 'CR7',
        },
        {
            address: '0xf2b2f7b47715256ce4ea43363a867fdce9353e3a',
            decimals: 9,
            symbol: 'BRISE',
        },
        {
            address: '0x68a47fe1cf42eba4a030a10cd4d6a1031ca3ca0a',
            decimals: 8,
            symbol: 'TET',
        },
        {
            address: '0x4d138bec0f79b729be475443a1eeb8557294d536',
            decimals: 18,
            symbol: 'LOOT',
        },
        {
            address: '0x5ad45404b0cda6ff4d1ca774af43836bb3045898',
            decimals: 9,
            symbol: 'FP',
        },
        {
            address: '0x88417754ff7062c10f4e3a4ab7e9f9d9cbda6023',
            decimals: 18,
            symbol: 'PEEPA',
        },
        {
            address: '0x8661d142347d89e854fbcb228380bebbcfbf0311',
            decimals: 9,
            symbol: 'BULLY',
        },
        {
            address: '0xdfef6416ea3e6ce587ed42aa7cb2e586362cbbfa',
            decimals: 9,
            symbol: 'Shib2.0',
        },
        {
            address: '0xccccb68e1a848cbdb5b60a974e07aae143ed40c3',
            decimals: 18,
            symbol: 'TOPIA',
        },
        {
            address: '0x07ac6babfd89aa7d06d7ead6f2f9366b3716144d',
            decimals: 18,
            symbol: 'PEPET',
        },
        {
            address: '0x83a4dea0a138894f2783203380683aba09caf8c1',
            decimals: 18,
            symbol: 'ZuckPepe',
        },
        {
            address: '0x3feb4fea5132695542f8ede5076ac43296d17c6d',
            decimals: 8,
            symbol: 'BTC2.0',
        },
        {
            address: '0xe90cc7d807712b2b41632f3900c8bd19bdc502b1',
            decimals: 18,
            symbol: 'KUMA',
        },
        {
            address: '0xe8e385a06ad6b9e26f35b502411a6eff711bc2ec',
            decimals: 18,
            symbol: 'BEBE',
        },
        {
            address: '0x0001a500a6b18995b03f44bb040a5ffc28e45cb0',
            decimals: 18,
            symbol: 'OLAS',
        },
        {
            address: '0xde67d97b8770dc98c746a3fc0093c538666eb493',
            decimals: 9,
            symbol: 'BITROCK',
        },
        {
            address: '0x748509433ef209c4d11ada51347d5724a5da0ca5',
            decimals: 9,
            symbol: 'ANDY',
        },
        {
            address: '0xd2bdaaf2b9cc6981fd273dcb7c04023bfbe0a7fe',
            decimals: 18,
            symbol: 'AVI',
        },
        {
            address: '0x41b1f9dcd5923c9542b6957b9b72169595acbc5c',
            decimals: 18,
            symbol: 'CHEEMS',
        },
        {
            address: '0xc32db1d3282e872d98f6437d3bcfa57801ca6d5c',
            decimals: 18,
            symbol: 'ETHEREUM',
        },
        {
            address: '0x42379293f2b7a5b379abf54329a8cfdd0e518a9b',
            decimals: 18,
            symbol: 'GCH',
        },
        {
            address: '0x99ae91ea5bc4725b4d04aedf410a0802a374f9a2',
            decimals: 18,
            symbol: 'YYY',
        },
        {
            address: '0x6e2a43be0b1d33b726f0ca3b8de60b3482b8b050',
            decimals: 18,
            symbol: 'ARKM',
        },
        {
            address: '0xe1283567345349942acdfad3692924a1b16cf3cc',
            decimals: 18,
            symbol: 'AI',
        },
        {
            address: '0xaaee1a9723aadb7afa2810263653a34ba2c21c7a',
            decimals: 18,
            symbol: 'Mog',
        },
        {
            address: '0xe6dbeadd1823b0bcfeb27792500b71e510af55b3',
            decimals: 18,
            symbol: 'COCO',
        },
        {
            address: '0x728b3f6a79f226bc2108d21abd9b455d679ef725',
            decimals: 7,
            symbol: 'XRP2',
        },
        {
            address: '0xa62894d5196bc44e4c3978400ad07e7b30352372',
            decimals: 9,
            symbol: 'X',
        },
        {
            address: '0x163f8c2467924be0ae7b5347228cabf260318753',
            decimals: 18,
            symbol: 'WLD',
        },
        {
            address: '0xd2b274cfbf9534f56b59ad0fb7e645e0354f4941',
            decimals: 8,
            symbol: 'XDOGE',
        },
        {
            address: '0x73fbd93bfda83b111ddc092aa3a4ca77fd30d380',
            decimals: 18,
            symbol: 'SOPH',
        },
        {
            address: '0x0a638f07acc6969abf392bb009f216d22adea36d',
            decimals: 18,
            symbol: 'BKN',
        },
        {
            address: '0x566e95139e4de1bfa505a598ec3a9da4cfa879ec',
            decimals: 18,
            symbol: 'TCATI',
        },
        {
            address: '0xa9d0146388bdc91a252f39f309690633a242c0cf',
            decimals: 18,
            symbol: 'PEPAY',
        },
        {
            address: '0x3d806324b6df5af3c1a81acba14a8a62fe6d643f',
            decimals: 18,
            symbol: 'SOLANA',
        },
        {
            address: '0xe427ae8d1b5b5842a47b8980aeadddbde89bf1b4',
            decimals: 18,
            symbol: 'XPRO',
        },
        {
            address: '0xec21890967a8ceb3e55a3f79dac4e90673ba3c2e',
            decimals: 8,
            symbol: 'BEBE',
        },
        {
            address: '0x8ed97a637a790be1feff5e888d43629dc05408f6',
            decimals: 18,
            symbol: 'NPC',
        },
        {
            address: '0x696e108fd69ec5ea929b3586f001ddfea02b3008',
            decimals: 18,
            symbol: 'CHAD',
        },
        {
            address: '0x4309e88d1d511f3764ee0f154cee98d783b61f09',
            decimals: 18,
            symbol: 'OCAI',
        },
        {
            address: '0xc5170dd7386247cdb8c48545c803f5d0e3347022',
            decimals: 18,
            symbol: 'Ti',
        },
        {
            address: '0xabec00542d141bddf58649bfe860c6449807237c',
            decimals: 18,
            symbol: 'X',
        },
        {
            address: '0x807534b396919783b7e30383fe57d857bc084338',
            decimals: 18,
            symbol: 'TEST',
        },
        {
            address: '0x7bd44cf5c0566aab26150a0cd5c3d20c5535686f',
            decimals: 18,
            symbol: 'EVILPEPE',
        },
        {
            address: '0x1bef0d587dde09d4cee9b13d4d38b5bec57a1397',
            decimals: 8,
            symbol: 'NHI',
        },
        {
            address: '0xca9f9671765f8d1a7e19ae2639e01fff730f0d9b',
            decimals: 18,
            symbol: 'jUSDC',
        },
        {
            address: '0xf7920b0768ecb20a123fac32311d07d193381d6f',
            decimals: 18,
            symbol: 'TNB',
        },
        {
            address: '0xc52fafdc900cb92ae01e6e4f8979af7f436e2eb2',
            decimals: 18,
            symbol: 'SEXY',
        },
        {
            address: '0xfcaf0e4498e78d65526a507360f755178b804ba8',
            decimals: 18,
            symbol: 'SHIB',
        },
        {
            address: '0x423f4e6138e475d85cf7ea071ac92097ed631eea',
            decimals: 18,
            symbol: 'PNDC',
        },
        {
            address: '0x80122c6a83c8202ea365233363d3f4837d13e888',
            decimals: 18,
            symbol: 'M87',
        },
        {
            address: '0x6c3ea9036406852006290770bedfcaba0e23a0e8',
            decimals: 6,
            symbol: 'PYUSD',
        },
        {
            address: '0x1063181dc986f76f7ea2dd109e16fc596d0f522a',
            decimals: 9,
            symbol: 'CYBA',
        },
        {
            address: '0xac5b038058bcd0424c9c252c6487c25f032e5ddc',
            decimals: 18,
            symbol: 'AIEPK',
        },
        {
            address: '0x1117ac6ad6cdf1a3bc543bad3b133724620522d5',
            decimals: 18,
            symbol: 'MODA',
        },
        {
            address: '0x3e34eabf5858a126cb583107e643080cee20ca64',
            decimals: 18,
            symbol: 'LINQ',
        },
        {
            address: '0xe86df1970055e9caee93dae9b7d5fd71595d0e18',
            decimals: 18,
            symbol: 'BTC20',
        },
        {
            address: '0xe57425f1598f9b0d6219706b77f4b3da573a3695',
            decimals: 18,
            symbol: 'BTCBR',
        },
        {
            address: '0xc14b4d4ca66f40f352d7a50fd230ef8b2fb3b8d4',
            decimals: 18,
            symbol: 'TOOLS',
        },
        {
            address: '0x070e984fda37dd942f5c953f6b2375339adac308',
            decimals: 18,
            symbol: 'AXE',
        },
        {
            address: '0xe0f63a424a4439cbe457d80e4f4b51ad25b2c56c',
            decimals: 8,
            symbol: 'SPX',
        },
        {
            address: '0x73c6a7491d0db90bdb0060308cde0f49dfd1d0b0',
            decimals: 18,
            symbol: 'DOBO',
        },
        {
            address: '0x9a2975d97eef50caa685a6da445411a7c288a8db',
            decimals: 18,
            symbol: 'GCZG',
        },
        {
            address: '0x5582a479f0c403e207d2578963ccef5d03ba636f',
            decimals: 18,
            symbol: 'SALD',
        },
        {
            address: '0x3ed112ce225f82da03918827631703e616fa14fe',
            decimals: 9,
            symbol: 'DOGECOIN',
        },
        {
            address: '0x8dce83eca4af45dbe618da1779f9aaca43201084',
            decimals: 18,
            symbol: 'AIKEK',
        },
        {
            address: '0xa6ec49e06c25f63292bac1abc1896451a0f4cfb7',
            decimals: 18,
            symbol: 'CSCS',
        },
        {
            address: '0x43d7e65b8ff49698d9550a7f315c87e67344fb59',
            decimals: 18,
            symbol: 'SHIA',
        },
        {
            address: '0x2b1d36f5b61addaf7da7ebbd11b35fd8cfb0de31',
            decimals: 18,
            symbol: 'ITP',
        },
        {
            address: '0x5362ca75aa3c0e714bc628296640c43dc5cb9ed6',
            decimals: 9,
            symbol: 'HOSHI',
        },
        {
            address: '0xbe042e9d09cb588331ff911c2b46fd833a3e5bd6',
            decimals: 18,
            symbol: 'PEPE',
        },
        {
            address: '0xed1167b6dc64e8a366db86f2e952a482d0981ebd',
            decimals: 18,
            symbol: 'LBR',
        },
        {
            address: '0x80ee5c641a8ffc607545219a3856562f56427fe9',
            decimals: 9,
            symbol: 'BRETT',
        },
        {
            address: '0x354c8cda7e3b737d360513a0dc5abcee8ee1cea3',
            decimals: 18,
            symbol: 'BABYTRUMP',
        },
        {
            address: '0xa0117792d4b100fd329b37e8ab4181df8a5b3326',
            decimals: 18,
            symbol: 'BREPE',
        },
        {
            address: '0x4d5f47fa6a74757f35c14fd3a6ef8e3c9bc514e8',
            decimals: 18,
            symbol: 'aEthWETH',
        },
        {
            address: '0x84837471e08cc392493d6902e125c287920f023d',
            decimals: 9,
            symbol: 'BOBO',
        },
        {
            address: '0x411099c0b413f4feddb10edf6a8be63bd321311c',
            decimals: 18,
            symbol: 'HELLO',
        },
        {
            address: '0x8929e9dbd2785e3ba16175e596cdd61520fee0d1',
            decimals: 18,
            symbol: 'ALTD',
        },
        {
            address: '0x9863bcc2fb23dfdf5fe275aa4c5575a32a580911',
            decimals: 18,
            symbol: 'PEPURAI',
        },
        {
            address: '0x667210a731447f8b385e068205759be2311b86d4',
            decimals: 18,
            symbol: 'ETF',
        },
        {
            address: '0x4c45bbec2ff7810ef4a77ad7bd4757c446fe4155',
            decimals: 18,
            symbol: 'JNGL',
        },
        {
            address: '0xe07c41e9cdf7e0a7800e4bbf90d414654fd6413d',
            decimals: 9,
            symbol: 'CBDC',
        },
        {
            address: '0x75c97384ca209f915381755c582ec0e2ce88c1ba',
            decimals: 18,
            symbol: 'FINE',
        },
        {
            address: '0x762e8464e5e99d0ab7353f00c635f5b03b6f806e',
            decimals: 9,
            symbol: 'MATT',
        },
        {
            address: '0x9f891b5ecbd89dd8a5ee4d1d80efc3fe78b306cb',
            decimals: 18,
            symbol: 'SONIK',
        },
        {
            address: '0xba5b03381ffb4b4f58574ac50de70e8c74d8cc0c',
            decimals: 9,
            symbol: 'HEDZ',
        },
        {
            address: '0x6abaf438f098f75c5892e1fabf08b1896c805967',
            decimals: 9,
            symbol: 'BLOOD',
        },
        {
            address: '0x36d7aa5c67efd83992fc5cbc488cc2f9ba7689b8',
            decimals: 18,
            symbol: 'WAR3',
        },
        {
            address: '0x5fe72ed557d8a02fff49b3b826792c765d5ce162',
            decimals: 18,
            symbol: 'SHEZMU',
        },
        {
            address: '0x881762555bfc75568f85abff3e22e2b295f9d852',
            decimals: 9,
            symbol: 'HEDZ',
        },
        {
            address: '0xa85d20c9a61c9809fc5bc8056d231fe5170b6c68',
            decimals: 9,
            symbol: 'hullo',
        },
        {
            address: '0xc60d6662027f5797cf873bfe80bcf048e30fc35e',
            decimals: 18,
            symbol: 'XST',
        },
        {
            address: '0xcaeda9650ccd356af7776057a105f9e6ffe68213',
            decimals: 18,
            symbol: 'LOONG',
        },
        {
            address: '0x37dba54fdc402aff647ce06c66972f5d662c326d',
            decimals: 18,
            symbol: 'MELON',
        },
        {
            address: '0xcc09f34accdb36ee3ed98358a3b8a6ae5c29ea07',
            decimals: 18,
            symbol: 'AW3',
        },
        {
            address: '0x47b6fb1fcb69a9a673457d92457f2dc28f7a26bf',
            decimals: 8,
            symbol: 'HEART',
        },
        {
            address: '0x2de7b02ae3b1f11d51ca7b2495e9094874a064c0',
            decimals: 18,
            symbol: 'SHIB2',
        },
        {
            address: '0x38e68a37e401f7271568cecaac63c6b1e19130b4',
            decimals: 18,
            symbol: 'BANANA',
        },
        {
            address: '0x056c1d42fb1326f57da7f19ebb7dda4673f1ff55',
            decimals: 18,
            symbol: 'GAINS',
        },
        {
            address: '0x0176b898e92e814c06cc379e508ceb571f70bd40',
            decimals: 18,
            symbol: 'TIP',
        },
        {
            address: '0x40e9187078032afe1a30cfcf76e4fe3d7ab5c6c5',
            decimals: 18,
            symbol: 'AIX',
        },
        {
            address: '0xcc483d7f87708e49f4305bf35d2bbde1dae5c3ae',
            decimals: 9,
            symbol: 'MASYA',
        },
        {
            address: '0x61b57bdc01e3072fab3e9e2f3c7b88d482734e05',
            decimals: 18,
            symbol: 'MZM',
        },
        {
            address: '0xc698d4f087de20bb5667f3d65315f3fa9ef405e3',
            decimals: 9,
            symbol: 'STARWARS',
        },
        {
            address: '0x44a71d4a99e70d421c2e98953053c34e8614b293',
            decimals: 9,
            symbol: 'Oscar',
        },
        {
            address: '0x089453742936dd35134383aee9d78bee63a69b01',
            decimals: 18,
            symbol: 'GOLD',
        },
        {
            address: '0xed4e879087ebd0e8a77d66870012b5e0dffd0fa4',
            decimals: 18,
            symbol: 'APX',
        },
        {
            address: '0xc06caead870d3a8af2504637b6c5b7248bed6116',
            decimals: 8,
            symbol: 'BUSINESS',
        },
        {
            address: '0x10c8f0be5a2f658129b9af58a508253f12d70d82',
            decimals: 9,
            symbol: 'MEGA',
        },
        {
            address: '0x20561172f791f915323241e885b4f7d5187c36e1',
            decimals: 18,
            symbol: 'CAL',
        },
        {
            address: '0x4e47951508fd4a4126f8ff9cf5e6fa3b7cc8e073',
            decimals: 18,
            symbol: 'FLUID',
        },
        {
            address: '0x50b806c5fe274c07e46b96be8c68d2fd2d9597b4',
            decimals: 18,
            symbol: '$TUCKER',
        },
        {
            address: '0x75fa2a76e5ec2269cf507b9296ac108373c72a6e',
            decimals: 18,
            symbol: 'NUGX',
        },
        {
            address: '0x170dec83c7753aaad20c01a0016b5a2e143990d4',
            decimals: 18,
            symbol: 'WIGGER',
        },
        {
            address: '0x8d99569ef5febb19989892eee7f81f8f909d07f3',
            decimals: 4,
            symbol: 'KEL',
        },
        {
            address: '0xabaf9c47094b1a774432ffae5b6d92c78ee69bbb',
            decimals: 9,
            symbol: 'NOBODY',
        },
        {
            address: '0x68b36248477277865c64dfc78884ef80577078f3',
            decimals: 18,
            symbol: 'Hold',
        },
        {
            address: '0xb62e45c3df611dce236a6ddc7a493d79f9dfadef',
            decimals: 18,
            symbol: 'WSM',
        },
        {
            address: '0x1aa51bc7eb181ce48ce626bf62f8956fa9555136',
            decimals: 18,
            symbol: 'PAW',
        },
        {
            address: '0x0089fafdf609873734819254c9b4cb04109ded37',
            decimals: 18,
            symbol: 'EPEPE',
        },
        {
            address: '0xffe203b59393593965842439ce1e7d7c78109b46',
            decimals: 18,
            symbol: 'Doge-1',
        },
        {
            address: '0x53f5663c10d22bf84e0ebf262a6ccc511350e099',
            decimals: 9,
            symbol: 'COFFEE',
        },
        {
            address: '0x220e4201aa472262df2c24dd8069243cf4b76c12',
            decimals: 8,
            symbol: '4IR',
        },
        {
            address: '0xf89674f18309a2e97843c6e9b19c07c22caef6d5',
            decimals: 9,
            symbol: 'Gamer',
        },
        {
            address: '0xcbf4d5efa82e32a9187385480a7c74cb062b956c',
            decimals: 9,
            symbol: 'SATOSHI',
        },
        {
            address: '0x0058c8581b9fed6864faa654505bc89890cdb2dd',
            decimals: 9,
            symbol: 'BS9000',
        },
        {
            address: '0xee7e74c1dee8e0a394e3a857953c13c290be5ed8',
            decimals: 18,
            symbol: 'SPIRIT',
        },
        {
            address: '0xd721706581d97ecd202bbab5c71b5a85f0f78e69',
            decimals: 9,
            symbol: 'DOGE1',
        },
        {
            address: '0x91043eb3399cdc0e09a4055aa8611b18ebf6f763',
            decimals: 18,
            symbol: 'B3',
        },
        {
            address: '0xff541139c60bb38ce2159a13d656f0f38aa96ff4',
            decimals: 18,
            symbol: 'DI',
        },
        {
            address: '0xa66e5aabff2a9eb078e511ceb1e6089a4580393b',
            decimals: 9,
            symbol: 'CRUMP',
        },
        {
            address: '0xe9514a6eba63a0bbbe2faea919e773ebe0f527c1',
            decimals: 18,
            symbol: 'KEK',
        },
        {
            address: '0x67f4c72a50f8df6487720261e188f2abe83f57d7',
            decimals: 6,
            symbol: 'wPOKT',
        },
        {
            address: '0xdbf384db91b6bdd4d637a58ecc3fe3fb807fddcc',
            decimals: 9,
            symbol: 'FROGE',
        },
        {
            address: '0x76e222b07c53d28b89b0bac18602810fc22b49a8',
            decimals: 18,
            symbol: 'JOE',
        },
        {
            address: '0x64bc2ca1be492be7185faa2c8835d9b824c8a194',
            decimals: 18,
            symbol: 'BIGTIME',
        },
        {
            address: '0x03074305379783d0af59ce938a2349bd5ca94625',
            decimals: 9,
            symbol: 'PEACE',
        },
        {
            address: '0x33f289d91286535c47270c8479f6776fb3adeb3e',
            decimals: 18,
            symbol: 'BXBT',
        },
        {
            address: '0xd939212f16560447ed82ce46ca40a63db62419b5',
            decimals: 18,
            symbol: 'MYC',
        },
        {
            address: '0x3638c9e50437f00ae53a649697f288ba68888cc1',
            decimals: 18,
            symbol: 'SCHAP',
        },
        {
            address: '0xb58e26ac9cc14c0422c2b419b0ca555ee4dcb7cb',
            decimals: 9,
            symbol: 'Niza',
        },
        {
            address: '0x1151cb3d861920e07a38e03eead12c32178567f6',
            decimals: 5,
            symbol: 'Bonk',
        },
        {
            address: '0x0b9ae6b1d4f0eeed904d1cef68b9bd47499f3fff',
            decimals: 18,
            symbol: 'NATI',
        },
        {
            address: '0x83f20f44975d03b1b09e64809b757c47f942beea',
            decimals: 18,
            symbol: 'sDAI',
        },
        {
            address: '0x0ed024d39d55e486573ee32e583bc37eb5a6271f',
            decimals: 18,
            symbol: 'JCD',
        },
        {
            address: '0x283d480dfd6921055e9c335fc177bf8cb9c94184',
            decimals: 8,
            symbol: 'VIX',
        },
        {
            address: '0x718160052cfa530f9fc9ff5623ecfd05dc396c37',
            decimals: 9,
            symbol: 'BLASTAR',
        },
        {
            address: '0x5a3b594a65032f812eb31c405a243464b7e49a97',
            decimals: 9,
            symbol: '$LANDWOLF',
        },
        {
            address: '0xabd601423a2cd5723cb546acc5c40fb01c3422cf',
            decimals: 9,
            symbol: 'BABYX',
        },
        {
            address: '0xd7138b12f7f7866569197fb0b411ea0f3e456ff4',
            decimals: 9,
            symbol: 'TROLL',
        },
        {
            address: '0x34c8e19fb8700e9de2c8149bd3257c32d3c2f212',
            decimals: 9,
            symbol: 'BUGATTI',
        },
        {
            address: '0x7d3b4f8d5dd14a0c263c4bee7be434c15e188d3e',
            decimals: 18,
            symbol: 'Moe',
        },
        {
            address: '0x5250fc0f7c66cf9fb0462db50109f329dc575f79',
            decimals: 18,
            symbol: 'DAN',
        },
        {
            address: '0xaf05ce8a2cef336006e933c02fc89887f5b3c726',
            decimals: 18,
            symbol: 'LMI',
        },
        {
            address: '0x0b5a91a43cb798c45fd56bfb5d41c13c42a7afa8',
            decimals: 18,
            symbol: 'APU',
        },
        {
            address: '0x9b4a69de6ca0defdd02c0c4ce6cb84de5202944e',
            decimals: 9,
            symbol: 'PROOF',
        },
        {
            address: '0xdd66781d0e9a08d4fbb5ec7bac80b691be27f21d',
            decimals: 18,
            symbol: 'AXGT',
        },
        {
            address: '0x0590cc9232ebf68d81f6707a119898219342ecb9',
            decimals: 9,
            symbol: 'BCAT',
        },
        {
            address: '0x1a11ea9d61588d756d9f1014c3cf0d226aedd279',
            decimals: 18,
            symbol: 'MILEI',
        },
        {
            address: '0xa6c0c097741d55ecd9a3a7def3a8253fd022ceb9',
            decimals: 18,
            symbol: 'AVA',
        },
        {
            address: '0xa5ae7da8bf1eba8ca7edf91668c9562d02925e41',
            decimals: 9,
            symbol: 'MILADY',
        },
        {
            address: '0x96add417293a49e80f024734e96cfd8b355bcc14',
            decimals: 18,
            symbol: 'LILA',
        },
        {
            address: '0x2c8ea636345a231e4b1a28f6eeb2072ed909c406',
            decimals: 18,
            symbol: 'MemElon',
        },
        {
            address: '0x560363bda52bc6a44ca6c8c9b4a5fadbda32fa60',
            decimals: 18,
            symbol: 'SFUND',
        },
        {
            address: '0xbaac2b4491727d78d2b78815144570b9f2fe8899',
            decimals: 18,
            symbol: 'DOG',
        },
        {
            address: '0x62d0a8458ed7719fdaf978fe5929c6d342b0bfce',
            decimals: 18,
            symbol: 'BEAM',
        },
        {
            address: '0x4507cef57c46789ef8d1a19ea45f4216bae2b528',
            decimals: 9,
            symbol: 'TOKEN',
        },
        {
            address: '0x3676af24c39530ded93f538789cd2685ab179843',
            decimals: 18,
            symbol: 'PEPOKI',
        },
        {
            address: '0xfe6f2e70f30a0894d0aee79e11653275e89c7bd6',
            decimals: 18,
            symbol: '$KEPE',
        },
        {
            address: '0x8c7ac134ed985367eadc6f727d79e8295e11435c',
            decimals: 18,
            symbol: 'Kekec',
        },
        {
            address: '0x7cdbfc86a0bfa20f133748b0cf5cea5b787b182c',
            decimals: 18,
            symbol: 'TKST',
        },
        {
            address: '0x85614a474dbeed440d5bbdb8ac50b0f22367f997',
            decimals: 18,
            symbol: 'XVG',
        },
        {
            address: '0xf19308f923582a6f7c465e5ce7a9dc1bec6665b1',
            decimals: 18,
            symbol: 'TITANX',
        },
        {
            address: '0xff931a7946d2fa11cf9123ef0dc6f6c7c6cb60c4',
            decimals: 9,
            symbol: 'BABY',
        },
        {
            address: '0x137ddb47ee24eaa998a535ab00378d6bfa84f893',
            decimals: 18,
            symbol: 'RDNT',
        },
        {
            address: '0xf97e2a78f1f3d1fd438ff7cc3bb7de01e5945b83',
            decimals: 18,
            symbol: 'RIDE',
        },
        {
            address: '0xae3359ed3c567482fb0102c584c23daa2693eacf',
            decimals: 18,
            symbol: 'DORK',
        },
        {
            address: '0x0a5e677a6a24b2f1a2bf4f3bffc443231d2fdec8',
            decimals: 18,
            symbol: 'USX',
        },
        {
            address: '0x6923f9b683111dcc0e20124e9a031deeae5dad93',
            decimals: 18,
            symbol: 'HUB',
        },
        {
            address: '0x1a2eb478fa07125c9935a77b3c03a82470801e30',
            decimals: 18,
            symbol: 'AMO',
        },
        {
            address: '0x1e971b5b21367888239f00da16f0a6b0effecb03',
            decimals: 18,
            symbol: 'LEEROY',
        },
        {
            address: '0x176bc22e1855cd5cf5a840081c6c5b92b55e2210',
            decimals: 18,
            symbol: 'GBE',
        },
        {
            address: '0xda47862a83dac0c112ba89c6abc2159b95afd71c',
            decimals: 18,
            symbol: 'PRISMA',
        },
        {
            address: '0x7391a131ccb43a571a34e09f986080d117b4313c',
            decimals: 18,
            symbol: 'MICKEY',
        },
        {
            address: '0xb131f4a55907b10d1f0a50d8ab8fa09ec342cd74',
            decimals: 18,
            symbol: 'MEME',
        },
        {
            address: '0x8e3fa615392688ddd9bf8f25d1f8dc744ac1a12c',
            decimals: 9,
            symbol: 'GME',
        },
        {
            address: '0x8390a1da07e376ef7add4be859ba74fb83aa02d5',
            decimals: 9,
            symbol: 'GROK',
        },
        {
            address: '0xb61ebb6bceb7635ecd7e59884ee2e2bcdfd810ba',
            decimals: 9,
            symbol: 'XSHIB',
        },
        {
            address: '0x69cbaf6c147086c3c234385556f8a0c6488d3420',
            decimals: 9,
            symbol: '69420',
        },
        {
            address: '0xc1abb8c93be6811affc70675b0432926c4bfbb5d',
            decimals: 18,
            symbol: 'UERII',
        },
        {
            address: '0x9e13aa12cbc0b4caddacca26b6f7d397630cde93',
            decimals: 9,
            symbol: 'Grok3.0',
        },
        {
            address: '0x7468d234a8db6f1085dbf4e403553bfed41df95c',
            decimals: 18,
            symbol: 'IO',
        },
        {
            address: '0x0c21638d4bcb88568f88bc84a50e317715f8de8a',
            decimals: 18,
            symbol: 'GDX',
        },
        {
            address: '0xbe6be64e9e5042b6e84e4c27956cce6353efa5f5',
            decimals: 18,
            symbol: 'BEG',
        },
        {
            address: '0x0686635b21033ef6a53b6729cb3d498ab61bc026',
            decimals: 9,
            symbol: 'KWAK',
        },
        {
            address: '0xf6157f237e3cac485c032d91758d059c99d73cd9',
            decimals: 18,
            symbol: 'VYBN',
        },
        {
            address: '0x194779473b9964afd1ba05618d38ba8807c93f95',
            decimals: 9,
            symbol: 'GTA6',
        },
        {
            address: '0xaf2ca40d3fc4459436d11b94d21fa4b8a89fb51d',
            decimals: 18,
            symbol: 'gCOTI',
        },
        {
            address: '0x39b46b212bdf15b42b166779b9d1787a68b9d0c3',
            decimals: 18,
            symbol: 'DYP',
        },
        {
            address: '0xc162cc4fcce69c10dab92175de1d34387e3f9d1d',
            decimals: 9,
            symbol: 'ELIZA',
        },
        {
            address: '0x4a2e49e85d70c9cb964d85b93f909d820b9e7b38',
            decimals: 9,
            symbol: 'ET',
        },
        {
            address: '0x614da3b37b6f66f7ce69b4bbbcf9a55ce6168707',
            decimals: 18,
            symbol: 'MMX',
        },
        {
            address: '0x569424c5ee13884a193773fdc5d1c5f79c443a51',
            decimals: 18,
            symbol: 'PINE',
        },
        {
            address: '0x5d16c39bac1c15179979bcaaeee51d7715bbd4ae',
            decimals: 9,
            symbol: 'GPT-Bore',
        },
        {
            address: '0x473f4068073cd5b2ab0e4cc8e146f9edc6fb52cc',
            decimals: 18,
            symbol: 'NUT',
        },
        {
            address: '0x6b431b8a964bfcf28191b07c91189ff4403957d0',
            decimals: 18,
            symbol: 'CORGIAI',
        },
        {
            address: '0x41ea5d41eeacc2d5c4072260945118a13bb7ebce',
            decimals: 18,
            symbol: 'CRE',
        },
        {
            address: '0x8647ae4e646cd3ce37fdeb4591b0a7928254bb73',
            decimals: 9,
            symbol: 'CIMON',
        },
        {
            address: '0x6b985d38b1fc891bb57bff59573626b1896d4aa1',
            decimals: 9,
            symbol: 'FIDO',
        },
        {
            address: '0xe903ef588d72586ae3e8af8cf8b0d142a094b399',
            decimals: 9,
            symbol: 'GIZMO',
        },
        {
            address: '0xd649e34a4a0332e81fd644bcff36085f1febde8a',
            decimals: 9,
            symbol: 'BASE',
        },
        {
            address: '0xa06eb3e52dabf9aa7ff8ad1428b548c9a420aa20',
            decimals: 9,
            symbol: 'STARBASE',
        },
        {
            address: '0x19e7f342620a54c156d47053496f05885dcb28fd',
            decimals: 9,
            symbol: 'BASE',
        },
        {
            address: '0x69ef1a53c0bc94e285c5068aadebdd054894625d',
            decimals: 9,
            symbol: 'TSLA',
        },
        {
            address: '0x2b81945875f892aff04af0a298d35fb2cf848c7b',
            decimals: 9,
            symbol: 'WEB',
        },
        {
            address: '0x6046d75dfd36e9c108356f9b98ea267c4485f8a4',
            decimals: 9,
            symbol: 'GROOOOOK',
        },
        {
            address: '0x3df716bfa42bf7b1d33d58d8d77122a31964be8e',
            decimals: 9,
            symbol: '$grok',
        },
        {
            address: '0x407a12cf3f2f1a449cb0e1b91aba9a7478bbcf56',
            decimals: 10,
            symbol: 'FSD12',
        },
        {
            address: '0xc63232cfccfc7b2f5246e515f256c974a70f886e',
            decimals: 8,
            symbol: 'DogeAI',
        },
        {
            address: '0x1c09fa2b1acfb3b38a0c0745711c6b7b7faa8b81',
            decimals: 9,
            symbol: 'ELON',
        },
        {
            address: '0x319bcf115e35c18035bf1a405fe3c40c8b24533e',
            decimals: 9,
            symbol: 'STARSHIP',
        },
        {
            address: '0xa1f410f13b6007fca76833ee7eb58478d47bc5ef',
            decimals: 6,
            symbol: 'RJV',
        },
        {
            address: '0xfe4ef573ece6ec3fb402f3cf820f29765fac9daf',
            decimals: 9,
            symbol: 'GROQ',
        },
        {
            address: '0xcae0dd4bda7ff3e700355c7629b24d5d728bd2ce',
            decimals: 18,
            symbol: 'BOWIE',
        },
        {
            address: '0xa444ec96ee01bb219a44b285de47bf33c3447ad5',
            decimals: 18,
            symbol: 'LEOX',
        },
        {
            address: '0x112b08621e27e10773ec95d250604a041f36c582',
            decimals: 8,
            symbol: 'KAS',
        },
        {
            address: '0x13a483ab7045741cad4fc09c83ab082882f3ca5b',
            decimals: 9,
            symbol: 'CYBERTRUCK',
        },
        {
            address: '0xe30b3fd129f8e90a425a2d2e0027df160130b00a',
            decimals: 8,
            symbol: 'YILONG',
        },
        {
            address: '0x6ad252cb62f2c1fd589e37f6c07abf0cf3b81cd9',
            decimals: 9,
            symbol: 'LIVE',
        },
        {
            address: '0x3b32794fe9ea498752a3a24e43c3d99c864d1a09',
            decimals: 9,
            symbol: 'tsla',
        },
        {
            address: '0x60aec61166b4896de3f95cd98cd597168eeb3f96',
            decimals: 9,
            symbol: 'GrokFather',
        },
        {
            address: '0x8bf30e9f44e5d068a9d0c20da22660997a532e33',
            decimals: 18,
            symbol: 'GDAG',
        },
        {
            address: '0x1a3a8cf347b2bf5890d3d6a1b981c4f4432c8661',
            decimals: 18,
            symbol: 'FAC',
        },
        {
            address: '0x0800394f6e23dd539929c8b77a3d45c96f76aefc',
            decimals: 18,
            symbol: 'TURT',
        },
        {
            address: '0x4e9fcd48af4738e3bf1382009dc1e93ebfce698f',
            decimals: 18,
            symbol: 'TAONU',
        },
        {
            address: '0xc434268603ca8854e0be1a3ff15cad73bd6ec49a',
            decimals: 9,
            symbol: 'ZAPI',
        },
        {
            address: '0xc8dfb57d83bf561457b1a3f6ce22956bb554bcab',
            decimals: 18,
            symbol: 'TRDM',
        },
        {
            address: '0x6c3d78e55fc939da4ca94760f6b27c3425a7a865',
            decimals: 9,
            symbol: 'MEGADETH',
        },
        {
            address: '0xf327c89bf0769f0f2e99e50232557f03aad6cc17',
            decimals: 18,
            symbol: 'PEIPEI',
        },
        {
            address: '0xeb55ad3f84c75960aba35143bc7128f0bcdfc0ef',
            decimals: 18,
            symbol: 'rats',
        },
        {
            address: '0x4dcda2274899d9bba3bb6f5a852c107dd6e4fe1c',
            decimals: 18,
            symbol: 'XONE',
        },
        {
            address: '0x259186e64e35ce5df3ca31364bd521f665bee73d',
            decimals: 18,
            symbol: 'GTAVI',
        },
        {
            address: '0x5df8aaa5ee4ec452f335e5ab12c50f3a2a6ee887',
            decimals: 9,
            symbol: 'HULLO',
        },
        {
            address: '0xa3d4bee77b05d4a0c943877558ce21a763c4fa29',
            decimals: 6,
            symbol: 'ROOT',
        },
        {
            address: '0xc3960227e41c3f54e9b399ce216149dea5315c34',
            decimals: 9,
            symbol: 'CZ',
        },
        {
            address: '0x5314b3014e886a4fd4f9cdce68d02a8c94d26b63',
            decimals: 18,
            symbol: 'WZAP',
        },
        {
            address: '0xe588f65a8426ee9894b88d936ec56a5da5ab2cc2',
            decimals: 8,
            symbol: 'KABOCHAN',
        },
        {
            address: '0x6992efa26f7617dda2f436d13a03af168c86fe39',
            decimals: 9,
            symbol: 'KABO',
        },
        {
            address: '0x4f4a556361b8b4869f97b8709ff47c1b057ea13b',
            decimals: 9,
            symbol: 'TRUMP',
        },
        {
            address: '0x6862d2f41454c9e10b4dd108a87c703338408b09',
            decimals: 8,
            symbol: 'THOG',
        },
        {
            address: '0x9abfc0f085c82ec1be31d30843965fcc63053ffe',
            decimals: 9,
            symbol: 'Q*',
        },
        {
            address: '0x2ed918534345278508cf488630c348b848d757b5',
            decimals: 9,
            symbol: 'FROGE',
        },
        {
            address: '0xf47245e9a3ba3dca8b004e34afc1290b1d435a52',
            decimals: 18,
            symbol: 'MBLK',
        },
        {
            address: '0x451fd37983d494bce294295f78a426832376b7df',
            decimals: 9,
            symbol: 'Xeno',
        },
        {
            address: '0x26132b6866f7071ff3a38d143d7d7080c7029daf',
            decimals: 9,
            symbol: 'Gary',
        },
        {
            address: '0x28aefa23142a05401782f503c6a680eada432712',
            decimals: 9,
            symbol: 'HOPPY',
        },
        {
            address: '0xcc9e0bd9438ca0056653d134de794abeaff8c676',
            decimals: 9,
            symbol: 'LESLIE',
        },
        {
            address: '0xff8d20421cbf96a57dd829ce9fca667eb74e41c1',
            decimals: 9,
            symbol: 'GECKO',
        },
        {
            address: '0x42baf1f659d765c65ade5bb7e08eb2c680360d9d',
            decimals: 18,
            symbol: 'COPI',
        },
        {
            address: '0xb8d6d1b5083089a5587ad942b7c8298a17cdca86',
            decimals: 9,
            symbol: 'nuBTC',
        },
        {
            address: '0xeba6145367b33e9fb683358e0421e8b7337d435f',
            decimals: 18,
            symbol: 'WEN',
        },
        {
            address: '0x3d330b8d4eb25b0933e564d7284d462346d453ef',
            decimals: 9,
            symbol: 'GROQ',
        },
        {
            address: '0x7194816621ecf9d029069dc754d74796f5b58297',
            decimals: 18,
            symbol: 'SpaceX',
        },
        {
            address: '0x060720649dd16a907d05bcc9468446bda15836ac',
            decimals: 9,
            symbol: 'BMONEY',
        },
        {
            address: '0xc9eb61ffb66d5815d643bbb8195e17c49687ae1e',
            decimals: 18,
            symbol: 'MIND',
        },
        {
            address: '0x58cb30368ceb2d194740b144eab4c2da8a917dcb',
            decimals: 18,
            symbol: 'ZYN',
        },
        {
            address: '0x81db1949d0e888557bc632f7c0f6698b1f8c9106',
            decimals: 9,
            symbol: 'D/ACC',
        },
        {
            address: '0xc03d38f89b175596859c99eab231d31e1808358c',
            decimals: 9,
            symbol: 'E/ACC',
        },
        {
            address: '0x5c9081166e5be53dd6fc5adf40f920d1b9b47206',
            decimals: 9,
            symbol: 'c/acc',
        },
        {
            address: '0xaafec8e08d524d534327fa13fb306f440b5f88eb',
            decimals: 18,
            symbol: 'WCTC',
        },
        {
            address: '0x044d078f1c86508e13328842cc75ac021b272958',
            decimals: 6,
            symbol: 'wPPC',
        },
        {
            address: '0x9ce84f6a69986a83d92c324df10bc8e64771030f',
            decimals: 18,
            symbol: 'CHEX',
        },
        {
            address: '0x6ff3df9b20e0895bb3d742e127908f04d91678ee',
            decimals: 9,
            symbol: 'AWC',
        },
        {
            address: '0x4591dbff62656e7859afe5e45f6f47d3669fbb28',
            decimals: 18,
            symbol: 'mkUSD',
        },
        {
            address: '0xe73cec024b30a7195af80d13f3b6917d80af11d8',
            decimals: 9,
            symbol: 'GOAT',
        },
        {
            address: '0x2af4cd20faa8afc1c1fab474e618a54c36e6a78b',
            decimals: 9,
            symbol: 'CR7',
        },
        {
            address: '0x6af53c6ec427525f7240e211941223288a0e7c66',
            decimals: 18,
            symbol: 'WARPED',
        },
        {
            address: '0x2d9d7c64f6c00e16c28595ec4ebe4065ef3a250b',
            decimals: 9,
            symbol: 'GFY',
        },
        {
            address: '0x3001f57f8308b189eb412a64322aad5ef9951290',
            decimals: 18,
            symbol: 'GEC',
        },
        {
            address: '0x571d9b73dc04ed88b4e273e048c8d4848f83b779',
            decimals: 9,
            symbol: 'ClosedAI',
        },
        {
            address: '0xbef69b5568b417947e1485f1215aa65fdac8dead',
            decimals: 9,
            symbol: 'GROK2',
        },
        {
            address: '0x61be6063400aca5c35350438ed2c0ec0a6f18fe6',
            decimals: 9,
            symbol: 'ALIEN',
        },
        {
            address: '0xc4d63ec16cac683d76759fd10ace60d08051c43b',
            decimals: 18,
            symbol: 'GROK',
        },
        {
            address: '0x9b02d4b4f0002d2d96d5e053cd9c305445695cc6',
            decimals: 9,
            symbol: 'SMOON',
        },
        {
            address: '0x2a260926c19c0fbd92060cc5b2802bcc8462e6b1',
            decimals: 9,
            symbol: 'ELIZA',
        },
        {
            address: '0x1a9190a086efce49966bf3688bf7fcfafe175c8c',
            decimals: 9,
            symbol: 'ZHUSU',
        },
        {
            address: '0x8de5b80a0c1b02fe4976851d030b36122dbb8624',
            decimals: 18,
            symbol: 'VANRY',
        },
        {
            address: '0x12ed0641242e4c6c220e3ca8f616e9d5470ac99a',
            decimals: 18,
            symbol: 'EARN',
        },
        {
            address: '0x7d51888c5abb7cdfa9cdd6a50673c7f8afaccd7f',
            decimals: 18,
            symbol: 'DD',
        },
        {
            address: '0xd5fa38027462691769b8a8ba6c444890103b5b94',
            decimals: 9,
            symbol: 'DAWG',
        },
        {
            address: '0xd3210f246ae54c5a45a7b4a83315bf718f591bfc',
            decimals: 9,
            symbol: 'ARKI',
        },
        {
            address: '0xda5662afd87f8db517b85e207ab368f3b4a85486',
            decimals: 9,
            symbol: 'MOSES',
        },
        {
            address: '0xccd54912c93169efb1922a79cabe5e06f25d68f7',
            decimals: 8,
            symbol: 'TBOT',
        },
        {
            address: '0xdfa012c837438540b5cc6c8b61f98c278a276d43',
            decimals: 18,
            symbol: 'ANGEL',
        },
        {
            address: '0x678f01a0379cfd82e743f8f7191643d0af067bef',
            decimals: 8,
            symbol: 'MISSOR',
        },
        {
            address: '0x93ba8d07e39a46c9daf0037d81db348dbc76dfa6',
            decimals: 9,
            symbol: 'EAI',
        },
        {
            address: '0x20d811bee139168f7a1c960451ba7c5341b253cb',
            decimals: 9,
            symbol: 'YOLO',
        },
        {
            address: '0xbf173fbb1edbf42f64a8aae2869978564568a7ec',
            decimals: 18,
            symbol: 'BITGOLD',
        },
        {
            address: '0x6d0637a6b0018b304ceb4d08224b09749d1ebce8',
            decimals: 9,
            symbol: 'KEKW',
        },
        {
            address: '0x13f0f7095bae77fcde1f767d3c2ccae01a52b4f5',
            decimals: 9,
            symbol: 'FRONTIER',
        },
        {
            address: '0x1245fe8a8c63c789c3a699c2b883ba680823e1f9',
            decimals: 9,
            symbol: 'GAMEBOY',
        },
        {
            address: '0xe5acbb03d73267c03349c76ead672ee4d941f499',
            decimals: 8,
            symbol: 'WBEAM',
        },
        {
            address: '0xc3d2b3e23855001508e460a6dbe9f9e3116201af',
            decimals: 9,
            symbol: 'MARS',
        },
        {
            address: '0xad5fdc8c3c18d50315331fca7f66efe5033f6c4c',
            decimals: 18,
            symbol: 'CRAZY',
        },
        {
            address: '0x582dd5e7c8af79d45a96de4af5d1152a061abb50',
            decimals: 9,
            symbol: 'RIZZ',
        },
        {
            address: '0xd1284fafbf9f08959930b567fa165779ad381bc9',
            decimals: 9,
            symbol: 'TLOAI',
        },
        {
            address: '0x186ef81fd8e77eec8bffc3039e7ec41d5fc0b457',
            decimals: 18,
            symbol: 'INSP',
        },
        {
            address: '0xaea8e4313e4e9720fa5d7ce4437558648e94e3ae',
            decimals: 9,
            symbol: 'DOGE',
        },
        {
            address: '0xb954562066c71b3e6e7b2ac330b03c74c0dcd5ae',
            decimals: 9,
            symbol: 'GEMINI',
        },
        {
            address: '0xc8168d5665f4418353728ac970713e09c0b7c20e',
            decimals: 18,
            symbol: 'MONKE',
        },
        {
            address: '0x3017aed7da7c021440962ea2c1d26110ddb3e638',
            decimals: 9,
            symbol: 'Mistral',
        },
        {
            address: '0xd6e09ea85ebb7ff786cce11bc52fdaee1ba34085',
            decimals: 9,
            symbol: 'CRYPTO',
        },
        {
            address: '0x1258d60b224c0c5cd888d37bbf31aa5fcfb7e870',
            decimals: 18,
            symbol: 'GPU',
        },
        {
            address: '0xde342a3e269056fc3305f9e315f4c40d917ba521',
            decimals: 9,
            symbol: 'BYTE',
        },
        {
            address: '0xe5fefd27cd8f03e6301ea36760810f0467c3ed76',
            decimals: 9,
            symbol: 'DRUID',
        },
        {
            address: '0xa0dd6dd7775e93eb842db0aa142c9c581031ed3b',
            decimals: 18,
            symbol: 'MND',
        },
        {
            address: '0xba25b2281214300e4e649fead9a6d6acd25f1c0a',
            decimals: 18,
            symbol: 'TREE',
        },
        {
            address: '0x9b3a8159e119eb09822115ae08ee1526849e1116',
            decimals: 9,
            symbol: 'MMA',
        },
        {
            address: '0x9e5c080a17b8ba3713f76384cd3f6825d8f97ec3',
            decimals: 18,
            symbol: 'GROK',
        },
        {
            address: '0x059956483753947536204e89bfad909e1a434cc6',
            decimals: 18,
            symbol: 'ML',
        },
        {
            address: '0xb56aaac80c931161548a49181c9e000a19489c44',
            decimals: 18,
            symbol: 'ABDS',
        },
        {
            address: '0x19af07b52e5faa0c2b1e11721c52aa23172fe2f5',
            decimals: 9,
            symbol: 'MEMES',
        },
        {
            address: '0x6c5146e923ce3854ed3cf73aafee10fda770e92b',
            decimals: 18,
            symbol: 'Neuralink',
        },
        {
            address: '0x20a62aca58526836165ca53fe67dd884288c8abf',
            decimals: 18,
            symbol: 'RNB',
        },
        {
            address: '0xe6828d65bf5023ae1851d90d8783cc821ba7eee1',
            decimals: 18,
            symbol: 'ABOND',
        },
        {
            address: '0x11bac0c3c81838022327198aa46124cdb8ce6ab9',
            decimals: 18,
            symbol: 'CSAS',
        },
        {
            address: '0x30cf5e27b5ec3dd696e8f4beb3af3c793c34169c',
            decimals: 9,
            symbol: 'MOCHI',
        },
        {
            address: '0x02f92800f57bcd74066f5709f1daa1a4302df875',
            decimals: 18,
            symbol: 'PEAS',
        },
        {
            address: '0x6b66ccd1340c479b07b390d326eadcbb84e726ba',
            decimals: 18,
            symbol: 'SEAM',
        },
        {
            address: '0x50e366365b01bf575538212a0155af552120494e',
            decimals: 9,
            symbol: 'GTAVI',
        },
        {
            address: '0xdd7819eb2370d3f58b9435a5dd7738679ea72171',
            decimals: 9,
            symbol: 'RIBBITA',
        },
        {
            address: '0x3b43791d1ad10b2ae44bbb90c22178377ab7791a',
            decimals: 9,
            symbol: 'T.I.T.S.',
        },
        {
            address: '0x090993bcc9dd600d15805d5ff070941cac6a506f',
            decimals: 8,
            symbol: 'TITS',
        },
        {
            address: '0xe22e674d00a266fdfbf2644620445830a6589b5c',
            decimals: 9,
            symbol: 'GORK',
        },
        {
            address: '0x515e7fd1c29263dff8d987f15fa00c12cd10a49b',
            decimals: 18,
            symbol: 'ppPP',
        },
        {
            address: '0x808c16ace7404777fe24a6777a9cb2335aa82451',
            decimals: 18,
            symbol: 'JOTCHUA',
        },
        {
            address: '0x46a138e3a50a810c13a0dfc4c4332fd77e31c15e',
            decimals: 18,
            symbol: 'BABYBONK',
        },
        {
            address: '0xd7b2c1a7f3c67fb0ea57a7ef29bc1f18d7be3195',
            decimals: 18,
            symbol: 'vMINT',
        },
        {
            address: '0xd52ab2e20ddde9ad93c509a1f72d9ea80bcd4a44',
            decimals: 18,
            symbol: 'DOLAN',
        },
        {
            address: '0xe010ec500720be9ef3f82129e7ed2ee1fb7955f2',
            decimals: 6,
            symbol: 'USDG-GLOW',
        },
        {
            address: '0x21c46173591f39afc1d2b634b74c98f0576a272b',
            decimals: 18,
            symbol: 'GCC-BETA',
        },
        {
            address: '0xeaa63125dd63f10874f99cdbbb18410e7fc79dd3',
            decimals: 18,
            symbol: 'HEMULE',
        },
        {
            address: '0xf4fbc617a5733eaaf9af08e1ab816b103388d8b6',
            decimals: 18,
            symbol: 'GLW-BETA',
        },
        {
            address: '0x50d7ee9708fec39673c92e1aae048eb3685eea9b',
            decimals: 9,
            symbol: 'GINNAN',
        },
        {
            address: '0xa7f0c9e21dee78b4c99c78dbeda53724eb6af062',
            decimals: 9,
            symbol: 'ONIGIRI',
        },
        {
            address: '0x8b12bd54ca9b2311960057c8f3c88013e79316e3',
            decimals: 18,
            symbol: '$Reach',
        },
        {
            address: '0x6ead9a977624d16961823e07e55cd2b748ae3ba0',
            decimals: 9,
            symbol: 'HOBBES',
        },
        {
            address: '0x25cbb21a9da7c3c63bb77ccca5b2e2482aedb710',
            decimals: 9,
            symbol: 'HOBA',
        },
        {
            address: '0x0c5cb676e38d6973837b9496f6524835208145a2',
            decimals: 18,
            symbol: 'KABO',
        },
        {
            address: '0x85d19fb57ca7da715695fcf347ca2169144523a7',
            decimals: 9,
            symbol: 'CONAN',
        },
        {
            address: '0x6daa7069e4159d80cace0e19dc0ad72d46cbb91b',
            decimals: 9,
            symbol: 'IBIT',
        },
        {
            address: '0xba5803f4ce0beef6f1f62a5546a018baebb5da4e',
            decimals: 9,
            symbol: 'BO',
        },
        {
            address: '0xa882606494d86804b5514e07e6bd2d6a6ee6d68a',
            decimals: 18,
            symbol: 'WPLS',
        },
        {
            address: '0x569d0e52c3dbe95983bcc2434cb9f69d905be919',
            decimals: 9,
            symbol: 'roar',
        },
        {
            address: '0x12ef10a4fc6e1ea44b4ca9508760ff51c647bb71',
            decimals: 18,
            symbol: 'RSTK',
        },
        {
            address: '0xd5b22423c96a11c49de4e74a20e3591b45d8ba90',
            decimals: 9,
            symbol: 'NTC',
        },
        {
            address: '0x9e20461bc2c4c980f62f1b279d71734207a6a356',
            decimals: 18,
            symbol: 'OMNI',
        },
        {
            address: '0x508e00d5cef397b02d260d035e5ee80775e4c821',
            decimals: 18,
            symbol: '1CAT',
        },
        {
            address: '0x328a268b191ef593b72498a9e8a481c086eb21be',
            decimals: 18,
            symbol: 'MZERO',
        },
        {
            address: '0x38e382f74dfb84608f3c1f10187f6bef5951de93',
            decimals: 18,
            symbol: 'MUBI',
        },
        {
            address: '0x89d584a1edb3a70b3b07963f9a3ea5399e38b136',
            decimals: 18,
            symbol: 'AIT',
        },
        {
            address: '0x50739bd5b6aff093ba2371365727c48a420a060d',
            decimals: 18,
            symbol: 'CRGPT',
        },
        {
            address: '0x87777638a5579ab83e7d74659db4989fbc3d1462',
            decimals: 9,
            symbol: 'BIF',
        },
        {
            address: '0x5016878159e84dadb05bb04135f3eac339ae201f',
            decimals: 18,
            symbol: 'BDID',
        },
        {
            address: '0x1530b870afcacd24bf7430c345bc745544c43d50',
            decimals: 18,
            symbol: 'GOON',
        },
        {
            address: '0x5613a5ef70d311ad1c0bcb0d5fc10e78e0fb7f1d',
            decimals: 18,
            symbol: 'QUEER',
        },
        {
            address: '0x820802fa8a99901f52e39acd21177b0be6ee2974',
            decimals: 6,
            symbol: 'EUROe',
        },
        {
            address: '0xa2c2c937333165d4c5f2dc5f31a43e1239fecfeb',
            decimals: 18,
            symbol: 'HERA',
        },
        {
            address: '0x564a80d0123bdd750fb6a9993834968fc595c09a',
            decimals: 18,
            symbol: 'SUBF',
        },
        {
            address: '0x8ab2ff0116a279a99950c66a12298962d152b83c',
            decimals: 18,
            symbol: 'ORDS',
        },
        {
            address: '0x906e26f41d8816ef49c1a6bd36ba72cc2a48c9a0',
            decimals: 9,
            symbol: 'Dragon',
        },
        {
            address: '0x42b9897c37e575466b664cc1e2467e19358310c0',
            decimals: 9,
            symbol: 'HTE',
        },
        {
            address: '0x182cb4588c8042aed9860ba0ec7f4f05102ff191',
            decimals: 9,
            symbol: 'Cypherpunk',
        },
        {
            address: '0x4e899bc4eb3142e485450f4b24994c977ddfcbce',
            decimals: 9,
            symbol: 'MECA',
        },
        {
            address: '0x6f6382f241e3c6ee0e9bee2390d91a73adc0afff',
            decimals: 18,
            symbol: 'TMNT',
        },
        {
            address: '0x9609b540e5dedddb147abbf9812ade06b1e61b2c',
            decimals: 18,
            symbol: 'MICKEY',
        },
        {
            address: '0x2598c30330d5771ae9f983979209486ae26de875',
            decimals: 18,
            symbol: 'AI',
        },
        {
            address: '0x427a03fb96d9a94a6727fbcfbba143444090dd64',
            decimals: 18,
            symbol: 'PIXL',
        },
        {
            address: '0x25b4f5d4c314bcd5d7962734936c957b947cb7cf',
            decimals: 18,
            symbol: 'TGC',
        },
        {
            address: '0x1eb7bd905855c483db19f53c8c4d42db42a159fc',
            decimals: 18,
            symbol: '$NRDC',
        },
        {
            address: '0x4c3ab89a14509f206e2c3d74fbb9c161a380e3b7',
            decimals: 9,
            symbol: 'BGBlock',
        },
        {
            address: '0x8888888837f84a7a82668e0320ac454f5945d0b9',
            decimals: 18,
            symbol: 'WORK',
        },
        {
            address: '0xd69a0a9682f679f50e34de40105a93bebb2ff43d',
            decimals: 18,
            symbol: 'MACKE',
        },
        {
            address: '0xdde0df39558dedca13c330e7b55310430b7e7248',
            decimals: 9,
            symbol: 'Porky',
        },
        {
            address: '0xcefde37817da4fc51ddc24e3820ad316784ee04b',
            decimals: 18,
            symbol: 'SONA',
        },
        {
            address: '0x590f820444fa3638e022776752c5eef34e2f89a6',
            decimals: 18,
            symbol: 'ALPH',
        },
        {
            address: '0x686f2404e77ab0d9070a46cdfb0b7fecdd2318b0',
            decimals: 18,
            symbol: 'LORDS',
        },
        {
            address: '0x92cc36d66e9d739d50673d1f27929a371fb83a67',
            decimals: 18,
            symbol: 'WAGMI',
        },
        {
            address: '0xb9255e19047f08c67f2870734e0fc84284b0b1c9',
            decimals: 9,
            symbol: 'TMZ',
        },
        {
            address: '0x9a8b8de54d8a2caeade1f20810c7650e9350a68a',
            decimals: 9,
            symbol: 'FOMO',
        },
        {
            address: '0xe96938e0d086a241d03688dda697bf57859ee261',
            decimals: 18,
            symbol: 'BUCC',
        },
        {
            address: '0x30c59b32d701f06dddd833f8e6e344a1fdd02106',
            decimals: 9,
            symbol: 'SPUDD',
        },
        {
            address: '0x369733153e6e08d38f2bc72ae2432e855cfbe221',
            decimals: 18,
            symbol: 'XALPHA',
        },
        {
            address: '0xa6ac39ba1d41cbbe37136a657309c2862c20c9e2',
            decimals: 18,
            symbol: 'KIRBY',
        },
        {
            address: '0x3bd7d4f524d09f4e331577247a048d56e4b67a7f',
            decimals: 18,
            symbol: '5IRE',
        },
        {
            address: '0xbd6323a83b613f668687014e8a5852079494fb68',
            decimals: 18,
            symbol: 'BTC',
        },
        {
            address: '0x0000000000300dd8b0230efcfef136ecdf6abcde',
            decimals: 18,
            symbol: 'DGNX',
        },
        {
            address: '0xbbbbbbbb46a1da0f0c3f64522c275baa4c332636',
            decimals: 18,
            symbol: 'ZKB',
        },
        {
            address: '0xc5d27f27f08d1fd1e3ebbaa50b3442e6c0d50439',
            decimals: 18,
            symbol: 'APP',
        },
        {
            address: '0x0f5c78f152152dda52a2ea45b0a8c10733010748',
            decimals: 18,
            symbol: 'XOX',
        },
        {
            address: '0x511886907b683c8327d501850d44fa258ab82991',
            decimals: 9,
            symbol: 'DEDE',
        },
        {
            address: '0x5e21d1ee5cf0077b314c381720273ae82378d613',
            decimals: 18,
            symbol: 'ETH',
        },
        {
            address: '0xd6fd1fd730eee257e4e5ce179b0b63b89ff31808',
            decimals: 9,
            symbol: 'TROLL2.0',
        },
        {
            address: '0xeea5fb81328343984298819275bda5489e796e62',
            decimals: 9,
            symbol: 'DieHarder',
        },
        {
            address: '0x4e4990e997e1df3f6b39ff49384e2e7e99bc55fe',
            decimals: 18,
            symbol: 'SAUDIBONK',
        },
        {
            address: '0x108ce14704263c9e2db314e03929d5cf044756d3',
            decimals: 18,
            symbol: 'LUNARSPHINX',
        },
        {
            address: '0x17c50d62e6e8d20d2dc18e9ad79c43263d0720d9',
            decimals: 18,
            symbol: 'NFAi',
        },
        {
            address: '0x2f5fa8adf5f09a5f9de05b65fe82a404913f02c4',
            decimals: 18,
            symbol: 'TROLL2.0',
        },
        {
            address: '0xf4308b0263723b121056938c2172868e408079d0',
            decimals: 18,
            symbol: 'CRYO',
        },
        {
            address: '0x2f1ee92524285012c02a4e638ec010fa7f61fd94',
            decimals: 18,
            symbol: 'SLS',
        },
        {
            address: '0xe08ddc0f47a12fd998455e5ab4c08b04d8b7821d',
            decimals: 18,
            symbol: 'JOY',
        },
        {
            address: '0x9bb10062a113247c311f180c67db577467ce7026',
            decimals: 18,
            symbol: 'HARDCORE',
        },
        {
            address: '0x5d9f940eabc07633158532e62e79746af0a12e64',
            decimals: 9,
            symbol: 'SATASHI',
        },
        {
            address: '0x64d0f55cd8c7133a9d7102b13987235f486f2224',
            decimals: 18,
            symbol: 'BORG',
        },
        {
            address: '0x3c3b84e2cdb92d58c66986a341db725baa955952',
            decimals: 8,
            symbol: 'KUMA',
        },
        {
            address: '0x943af2ece93118b973c95c2f698ee9d15002e604',
            decimals: 18,
            symbol: 'DUEL',
        },
        {
            address: '0x3e4b43d8bf9d69d2f142c39575fad96e67c8dc05',
            decimals: 18,
            symbol: 'HWORLD',
        },
        {
            address: '0x15e6e0d4ebeac120f9a97e71faa6a0235b85ed12',
            decimals: 18,
            symbol: 'SAVM',
        },
        {
            address: '0xfb05694e79f78daaed23098adb61f2bea31ef55b',
            decimals: 9,
            symbol: 'BITGOLD',
        },
        {
            address: '0xea3eed8616877f5d3c4aebf5a799f2e8d6de9a5e',
            decimals: 18,
            symbol: '$RFRM',
        },
        {
            address: '0x8ccd897ca6160ed76755383b201c1948394328c7',
            decimals: 9,
            symbol: 'wBAI',
        },
        {
            address: '0xb15a5aab2a65745314fcd0d7f5080bfa65bd7c03',
            decimals: 9,
            symbol: 'TUPELO',
        },
        {
            address: '0xdaa7699352ac8709f3d2fd092226d3dd7da40474',
            decimals: 18,
            symbol: 'OPCAT',
        },
        {
            address: '0x5499b9a16df25ac8ced96cc2cf701b0ae6ef8878',
            decimals: 9,
            symbol: 'Xpayments',
        },
        {
            address: '0xb185004c836695b9102eebf1779e5a46b89248fe',
            decimals: 18,
            symbol: 'OSKY',
        },
        {
            address: '0xd1f3d2f5c12a205fc912358878b089eae48a557f',
            decimals: 18,
            symbol: 'SNOW',
        },
        {
            address: '0x861b1eb8be5b2937480764d9aa242b25adbdddc8',
            decimals: 18,
            symbol: 'GRAPE',
        },
        {
            address: '0xac11a6166d01f9ac28f708f9c4a973ed0e434877',
            decimals: 18,
            symbol: 'HYDRA',
        },
        {
            address: '0x88e08adb69f2618adf1a3ff6cc43c671612d1ca4',
            decimals: 18,
            symbol: 'pOHM',
        },
        {
            address: '0x027ce48b9b346728557e8d420fe936a72bf9b1c7',
            decimals: 18,
            symbol: 'pPEAS',
        },
        {
            address: '0x1ef846ce0da79d8d4e111bf8c5117cd1209a0478',
            decimals: 8,
            symbol: 'ETHINU',
        },
        {
            address: '0x584a4dd38d28fd1ea0e147ba7b70aed29a37e335',
            decimals: 18,
            symbol: 'BTCINU',
        },
        {
            address: '0xe73d53e3a982ab2750a0b76f9012e18b256cc243',
            decimals: 18,
            symbol: 'N',
        },
        {
            address: '0xea60cd69f2b9fd6eb067bddbbf86a5bdeffbbc55',
            decimals: 18,
            symbol: 'WECAN',
        },
        {
            address: '0x5dfe42eea70a3e6f93ee54ed9c321af07a85535c',
            decimals: 18,
            symbol: 'UNION',
        },
        {
            address: '0xfae103dc9cf190ed75350761e95403b7b8afa6c0',
            decimals: 18,
            symbol: 'rswETH',
        },
        {
            address: '0x5ea22ad5a8520bf631c5d9cd686e86b892621276',
            decimals: 9,
            symbol: 'BLINDSIGHT',
        },
        {
            address: '0x25d01b5b39e58843291586a5d8afddf744bdeb13',
            decimals: 9,
            symbol: 'MAGA',
        },
        {
            address: '0x1b154f1eb0f26240dc4ddb675fe08608505198c3',
            decimals: 9,
            symbol: 'CASINU',
        },
        {
            address: '0x1b54a6fa1360bd71a0f28f77a1d6fba215d498c3',
            decimals: 9,
            symbol: 'CASINU',
        },
        {
            address: '0xb9f599ce614feb2e1bbe58f180f370d05b39344e',
            decimals: 18,
            symbol: 'PORK',
        },
        {
            address: '0x30bcfae081dea6f1acd014947abbfab791cc2296',
            decimals: 18,
            symbol: 'SNIFF',
        },
        {
            address: '0x9e9fbde7c7a83c43913bddc8779158f1368f0413',
            decimals: 18,
            symbol: 'PANDORA',
        },
        {
            address: '0xda31d0d1bc934fc34f7189e38a413ca0a5e8b44f',
            decimals: 18,
            symbol: 'BSSB',
        },
        {
            address: '0x740a5ac14d0096c81d331adc1611cf2fd28ae317',
            decimals: 9,
            symbol: 'PLEB',
        },
        {
            address: '0xb30240d48c05a4b950c470e2d6aefc9117a50624',
            decimals: 18,
            symbol: 'RUBY',
        },
        {
            address: '0x8aec4bbdcfb451aa289bfbd3c2f4e34a44ada1be',
            decimals: 9,
            symbol: 'dogwifhat',
        },
        {
            address: '0xca530408c3e552b020a2300debc7bd18820fb42f',
            decimals: 18,
            symbol: 'RYU',
        },
        {
            address: '0xd60abfb751db36514a592963fd71dd50c6cf9ba9',
            decimals: 18,
            symbol: 'JAKEX',
        },
        {
            address: '0x8df5066cf67d909eb67b82854cf54026d31fffae',
            decimals: 18,
            symbol: 'KOI',
        },
        {
            address: '0x54e1a86e8f8b5ee1bcd9c36a66d0c386c24ac153',
            decimals: 9,
            symbol: 'FKSOL',
        },
        {
            address: '0x7d225c4cc612e61d26523b099b0718d03152edef',
            decimals: 18,
            symbol: 'FORK',
        },
        {
            address: '0x1f557fb2aa33dce484902695ca1374f413875519',
            decimals: 18,
            symbol: 'VES',
        },
        {
            address: '0x5a9261b023692405f2f680240c6b010638e416dd',
            decimals: 18,
            symbol: 'JAN',
        },
        {
            address: '0xbf5495efe5db9ce00f80364c8b423567e58d2110',
            decimals: 18,
            symbol: 'ezETH',
        },
        {
            address: '0x28300d1c687b1f982d67f8a74efded5427da6ec1',
            decimals: 18,
            symbol: 'GME',
        },
        {
            address: '0x79740d53eb3bc798ec8455816211c4d6d9212bbd',
            decimals: 18,
            symbol: 'NEMO',
        },
        {
            address: '0xd555498a524612c67f286df0e0a9a64a73a7cdc7',
            decimals: 18,
            symbol: 'DEFROGS',
        },
        {
            address: '0xf1c9acdc66974dfb6decb12aa385b9cd01190e38',
            decimals: 18,
            symbol: 'osETH',
        },
        {
            address: '0x9361adf2b72f413d96f81ff40d794b47ce13b331',
            decimals: 9,
            symbol: 'Barron',
        },
        {
            address: '0x2c06ba9e7f0daccbc1f6a33ea67e85bb68fbee3a',
            decimals: 18,
            symbol: 'LENDS',
        },
        {
            address: '0x13e1de067ff2f1e1335a48319afccdf8a995043c',
            decimals: 18,
            symbol: 'wNuni',
        },
        {
            address: '0x0cc488a3f6c9a569614912e421115995493fdfec',
            decimals: 18,
            symbol: 'BEFE',
        },
        {
            address: '0xcce4c7348a208aba0a5b1e3bfadb96222f051662',
            decimals: 18,
            symbol: 'pBASED',
        },
        {
            address: '0x6ae2a128cd07d672164ca9f2712ea737d198dd41',
            decimals: 18,
            symbol: 'GOAT',
        },
        {
            address: '0x413530a7beb9ff6c44e9e6c9001c93b785420c32',
            decimals: 18,
            symbol: 'PFPAsia',
        },
        {
            address: '0x40a7df3df8b56147b781353d379cb960120211d7',
            decimals: 18,
            symbol: 'MOBY',
        },
        {
            address: '0xcf91b70017eabde82c9671e30e5502d312ea6eb2',
            decimals: 9,
            symbol: 'puppies',
        },
        {
            address: '0x9f8b31e70cff4fbac1ef14547f33c6f2bc387754',
            decimals: 18,
            symbol: 'LOONG',
        },
        {
            address: '0x39de85301c78f4d623e5c05cde2fd119a3a92cd9',
            decimals: 9,
            symbol: 'blobs',
        },
        {
            address: '0xf6d038bd0bfd89057543e228d9c35368a9ab2c31',
            decimals: 9,
            symbol: 'SATOSHI',
        },
        {
            address: '0x0000000000ca73a6df4c58b84c5b4b847fe8ff39',
            decimals: 18,
            symbol: 'ASTX',
        },
        {
            address: '0xe92344b4edf545f3209094b192e46600a19e7c2d',
            decimals: 18,
            symbol: 'ZKML',
        },
        {
            address: '0x6930450a416252c7206fbce76c01ecc850a36cb9',
            decimals: 9,
            symbol: 'SHEB',
        },
        {
            address: '0x4e38b9654cc82ae8f1d5ffe22f93d5919c462c1a',
            decimals: 9,
            symbol: 'TONG',
        },
        {
            address: '0x46305b2ebcd92809d5fcef577c20c28a185af03c',
            decimals: 18,
            symbol: 'SHADOW',
        },
        {
            address: '0xe3dbc4f88eaa632ddf9708732e2832eeaa6688ab',
            decimals: 18,
            symbol: 'AIUS',
        },
        {
            address: '0x7d329eca91f11133e274ba2748af3ecd8ad38e32',
            decimals: 9,
            symbol: 'FROG',
        },
        {
            address: '0xb8a87405d9a4f2f866319b77004e88dff66c0d92',
            decimals: 18,
            symbol: 'SORA',
        },
        {
            address: '0x096deae23d5e58f47c6ffc0b48d015756a2b21d3',
            decimals: 18,
            symbol: 'FC',
        },
        {
            address: '0xee1c139ea09924a95b98b56a68efc1104f049f21',
            decimals: 9,
            symbol: 'SINU',
        },
        {
            address: '0xa2ce6108cdb64a96c3563601a3b32e8cc3ea9015',
            decimals: 9,
            symbol: 'FROGE',
        },
        {
            address: '0x92dcbc38b279f03e75a39bf8772bef7a08833ed4',
            decimals: 9,
            symbol: 'Babies',
        },
        {
            address: '0x9a96ec9b57fb64fbc60b423d1f4da7691bd35079',
            decimals: 18,
            symbol: 'AJNA',
        },
        {
            address: '0xdb32be67eef29f21b2a0452cf87ec44aef4d0350',
            decimals: 9,
            symbol: 'Midjourney',
        },
        {
            address: '0xcc8377dae20e2f13b9762cc9308fde45d66eaa56',
            decimals: 9,
            symbol: 'Farcaster',
        },
        {
            address: '0xdde68d9a42811ee902812634ccd4d61cb60108cc',
            decimals: 9,
            symbol: 'PLEB',
        },
        {
            address: '0xaa95f26e30001251fb905d264aa7b00ee9df6c18',
            decimals: 18,
            symbol: 'Kendu',
        },
        {
            address: '0x4f595bd9e67581e601025c12a4a70b0f111c8449',
            decimals: 9,
            symbol: 'GEMMA',
        },
        {
            address: '0x79349edd0b8e83ffaa1af2e6ba0c8ce87731c267',
            decimals: 9,
            symbol: 'WCD',
        },
        {
            address: '0x68d009f251ff3a271477f77acb704c3b0f32a0c0',
            decimals: 18,
            symbol: 'CHAD',
        },
        {
            address: '0x0bca4184c9eb88347452326fd66eaf3ef987f359',
            decimals: 9,
            symbol: 'DDUV',
        },
        {
            address: '0x74e9fee3fcb56bccac22e726cce7a78ca90185e1',
            decimals: 18,
            symbol: 'RIZO',
        },
        {
            address: '0x15ee3f09712f4715904e1923c1ad504a673e88ac',
            decimals: 18,
            symbol: 'NINU',
        },
        {
            address: '0xa4e523dfd6e0b1888dab974c324cf6047b9a60ac',
            decimals: 9,
            symbol: 'WOKE',
        },
        {
            address: '0x5de869e3e62b0fb2c15573246ba3bb3fd97a2275',
            decimals: 18,
            symbol: 'SHEB',
        },
        {
            address: '0x42f272726687340a914e28ccc5d8cd5680b93a98',
            decimals: 9,
            symbol: 'GTROK',
        },
        {
            address: '0xd78cb66b3affd27569782737fa5b842277e1add7',
            decimals: 9,
            symbol: 'GTROK',
        },
        {
            address: '0xdb82c0d91e057e05600c8f8dc836beb41da6df14',
            decimals: 18,
            symbol: 'SLN',
        },
        {
            address: '0x3dfa3a1126a851967bf2778089d276a5a05fc15c',
            decimals: 9,
            symbol: 'ABE',
        },
        {
            address: '0xbdba4b7707ceb9e3f025e6046d64b8ec8f3b8dcb',
            decimals: 9,
            symbol: 'Titcoin',
        },
        {
            address: '0xdc83bfca4aeb246bc2e812ec740d0112e6dcf144',
            decimals: 9,
            symbol: 'TTC',
        },
        {
            address: '0x23fac187fb15d13295dfa9486c83af5c1abd7b5a',
            decimals: 9,
            symbol: 'FIGURE',
        },
        {
            address: '0x8afe4055ebc86bd2afb3940c0095c9aca511d852',
            decimals: 18,
            symbol: 'AIUS',
        },
        {
            address: '0x6b0faca7ba905a86f221ceb5ca404f605e5b3131',
            decimals: 18,
            symbol: 'DEFI',
        },
        {
            address: '0xca14007eff0db1f8135f4c25b34de49ab0d42766',
            decimals: 18,
            symbol: 'STRK',
        },
        {
            address: '0x8cefbeb2172a9382753de431a493e21ba9694004',
            decimals: 9,
            symbol: 'MELANIA',
        },
        {
            address: '0xcb688a885bab4ba2f8a1ec9d6411037782d26348',
            decimals: 9,
            symbol: 'VINE',
        },
        {
            address: '0xe485e2f1bab389c08721b291f6b59780fec83fd7',
            decimals: 18,
            symbol: 'SHU',
        },
        {
            address: '0xd4f4d0a10bcae123bb6655e8fe93a30d01eebd04',
            decimals: 18,
            symbol: 'LNQ',
        },
        {
            address: '0x99fa1493c9193fe059a67b6e56f9787ae49e006d',
            decimals: 9,
            symbol: 'LINUX',
        },
        {
            address: '0xdedaee0e2cf7a2c8771855ce0e8a4ab2a18ba761',
            decimals: 9,
            symbol: 'ELON',
        },
        {
            address: '0x733ab41d79153842ff9ce1fcb7e3d2f8a3476749',
            decimals: 9,
            symbol: 'WASB',
        },
        {
            address: '0x23217072d82a6e90717828ce012f50aea9dab1c1',
            decimals: 8,
            symbol: 'TRUMPEPE',
        },
        {
            address: '0xaba16cda60b232174f672805790fa9ae9f2a2442',
            decimals: 9,
            symbol: 'X',
        },
        {
            address: '0x419586c41f164a82b9bb578ae1825a05fcea36ec',
            decimals: 9,
            symbol: 'PEPA',
        },
        {
            address: '0x963de544c2d2b796db0f33d9a2d67a72080edbca',
            decimals: 9,
            symbol: 'MILADY',
        },
        {
            address: '0x0026dfbd8dbb6f8d0c88303cc1b1596409fda542',
            decimals: 18,
            symbol: 'SANSHU!',
        },
        {
            address: '0x8a0a9b663693a22235b896f70a229c4a22597623',
            decimals: 18,
            symbol: 'SCALE',
        },
        {
            address: '0x15d94ec1c8e98812dac23bf6a341bd6c83e4cb11',
            decimals: 18,
            symbol: 'RICE',
        },
        {
            address: '0x62b119b19f1cf2a8d8fe18d1fde5ee46ded210fe',
            decimals: 18,
            symbol: 'FLARU',
        },
        {
            address: '0xe842e272a18625319cc36f64eb9f97e5ad0c32af',
            decimals: 9,
            symbol: 'YAK',
        },
        {
            address: '0x122b79cb4e867684e3f58bc370f18f128bbe93b4',
            decimals: 9,
            symbol: 'CLOSEDAI',
        },
        {
            address: '0xe2512a2f19f0388ad3d7a5263eaa82acd564827b',
            decimals: 18,
            symbol: 'SHIDO',
        },
        {
            address: '0x857ffc55b1aa61a7ff847c82072790cae73cd883',
            decimals: 18,
            symbol: 'EEFI',
        },
        {
            address: '0x8248270620aa532e4d64316017be5e873e37cc09',
            decimals: 18,
            symbol: 'DEVVE',
        },
        {
            address: '0xbe8eff45293598919c99d1cbe5297f2a6935bc64',
            decimals: 18,
            symbol: 'TIGRA',
        },
        {
            address: '0x78e3b2ee11950df78a35fd924e92fbb8d1403780',
            decimals: 18,
            symbol: 'HELGA',
        },
        {
            address: '0xb81408a1cc2f4be70a6a3178d351ca95a77c5a06',
            decimals: 18,
            symbol: 'XODEX',
        },
        {
            address: '0xda251891e21e6edb0e6828e77621c7b98ea4e8ba',
            decimals: 18,
            symbol: 'MGLS',
        },
        {
            address: '0x7f3b4b68ca0238f387d8b1a8fbc002d0e6d4cd5b',
            decimals: 18,
            symbol: 'KERMIT',
        },
        {
            address: '0xe4197374d8b0d7860c42e015f0be150729fc2403',
            decimals: 9,
            symbol: 'ashbie',
        },
        {
            address: '0x1cc7047e15825f639e0752eb1b89e4225f5327f2',
            decimals: 18,
            symbol: 'PLX',
        },
        {
            address: '0xa562912e1328eea987e04c2650efb5703757850c',
            decimals: 18,
            symbol: 'DROPS',
        },
        {
            address: '0x9fdfb933ee990955d3219d4f892fd1f786b47c9b',
            decimals: 18,
            symbol: 'MK',
        },
        {
            address: '0x9194337c06405623c0f374e63fa1cc94e2788c58',
            decimals: 18,
            symbol: 'CYBONK',
        },
        {
            address: '0xf938346d7117534222b48d09325a6b8162b3a9e7',
            decimals: 9,
            symbol: 'CHOPPY',
        },
        {
            address: '0x008faa8bc8157f8d19cd716e8cf1bae0ccad74be',
            decimals: 18,
            symbol: 'CHAPPY',
        },
        {
            address: '0x348478b7010cc4779618f4f779cb9fabf4f3b832',
            decimals: 9,
            symbol: 'PEPLICATOR',
        },
        {
            address: '0x829b6d840d87cef1e165e1d2563cb89b1b10bfea',
            decimals: 9,
            symbol: 'MELANIA',
        },
        {
            address: '0x21e5c85a5b1f38bddde68307af77e38f747cd530',
            decimals: 9,
            symbol: 'DOGS',
        },
        {
            address: '0xe3b9cfb8ea8a4f1279fbc28d3e15b4d2d86f18a0',
            decimals: 9,
            symbol: 'FOTTIE',
        },
        {
            address: '0x91fbb2503ac69702061f1ac6885759fc853e6eae',
            decimals: 18,
            symbol: 'KNINE',
        },
        {
            address: '0xb36cf340a35f9860d0bb59afb0355580f0000dad',
            decimals: 18,
            symbol: 'PADRE',
        },
        {
            address: '0x50b0696468f42cab1ddc76413a1312aff3cabdf6',
            decimals: 18,
            symbol: 'CLOSEDAI',
        },
        {
            address: '0x614577036f0a024dbc1c88ba616b394dd65d105a',
            decimals: 18,
            symbol: 'GNUS',
        },
        {
            address: '0x68bbed6a47194eff1cf514b50ea91895597fc91e',
            decimals: 18,
            symbol: 'ANDY',
        },
        {
            address: '0xaf10b7a37dfe7db24cf06df9d7e64fe59afe2daf',
            decimals: 9,
            symbol: 'PEPLICATION',
        },
        {
            address: '0xf5264e1673c9365e7c5d4d1d8b440bbf131ff435',
            decimals: 18,
            symbol: 'vitalek',
        },
        {
            address: '0xf6ce4be313ead51511215f1874c898239a331e37',
            decimals: 9,
            symbol: 'BIRDDOG',
        },
        {
            address: '0x2d9996f3b9d2e73540fdbfdfe81d71e9e08cbf03',
            decimals: 9,
            symbol: 'BOYSCLUB',
        },
        {
            address: '0x6e79b51959cf968d87826592f46f819f92466615',
            decimals: 9,
            symbol: 'HOPPY',
        },
        {
            address: '0xf94e7d0710709388bce3161c32b4eea56d3f91cc',
            decimals: 18,
            symbol: 'DSync',
        },
        {
            address: '0x594daad7d77592a2b97b725a7ad59d7e188b5bfa',
            decimals: 18,
            symbol: 'APU',
        },
        {
            address: '0xb29dc1703facd2967bb8ade2e392385644c6dca9',
            decimals: 18,
            symbol: 'GAGA',
        },
        {
            address: '0x35b6981eadffef9e858f6f5e54539adaa494bba4',
            decimals: 18,
            symbol: 'BIAO',
        },
        {
            address: '0x45c07f4bc68e491e065cd8c21a27d20d209264cb',
            decimals: 18,
            symbol: 'BABYFLOKI',
        },
        {
            address: '0xb3cf9f0c00050774724e234f5188311c58a8baee',
            decimals: 9,
            symbol: 'SBIDEN',
        },
        {
            address: '0xf70dcf88b74786d25a15f4843d63254a8662ef46',
            decimals: 9,
            symbol: 'DEVIN',
        },
        {
            address: '0xf8173a39c56a554837c4c7f104153a005d284d11',
            decimals: 18,
            symbol: 'EDU',
        },
        {
            address: '0xbc188b5dbb155b6ea693d46d98bf60b8482939b9',
            decimals: 18,
            symbol: 'FTW',
        },
        {
            address: '0x05c14b1b270a6017eeccf6962bc24ae894999d05',
            decimals: 9,
            symbol: 'WAT',
        },
        {
            address: '0x85e0b9d3e7e4dba7e59090c533906d0e9211d8b6',
            decimals: 9,
            symbol: 'ISHI',
        },
        {
            address: '0x7fd4d7737597e7b4ee22acbf8d94362343ae0a79',
            decimals: 2,
            symbol: 'WMC',
        },
        {
            address: '0x61ec85ab89377db65762e234c946b5c25a56e99e',
            decimals: 18,
            symbol: 'HTX',
        },
        {
            address: '0x03aa6298f1370642642415edc0db8b957783e8d6',
            decimals: 18,
            symbol: 'NMT',
        },
        {
            address: '0x599955aa9fbc197a1b717d8da6a7012cafe70ab3',
            decimals: 9,
            symbol: 'BOPE',
        },
        {
            address: '0x0eddb7de60c1320fd16effa5e927177fc2ba9724',
            decimals: 9,
            symbol: 'MOOSE',
        },
        {
            address: '0xfe0c30065b384f05761f15d0cc899d4f9f9cc0eb',
            decimals: 18,
            symbol: 'ETHFI',
        },
        {
            address: '0x00b78238925c320159023c2ac9ef89da8f16d007',
            decimals: 18,
            symbol: 'VPS',
        },
        {
            address: '0xb60acd2057067dc9ed8c083f5aa227a244044fd6',
            decimals: 9,
            symbol: 'stTAO',
        },
        {
            address: '0xc5ba042bf8832999b17c9036e8212f49dce0501a',
            decimals: 18,
            symbol: 'YOURAI',
        },
        {
            address: '0x2fb652314c3d850e9049057bbe9813f1eee882d3',
            decimals: 18,
            symbol: 'RVF',
        },
        {
            address: '0x9c2b4b0da5ebd20c29ef20758064554a55a88b68',
            decimals: 18,
            symbol: 'BYTE',
        },
        {
            address: '0x9028c2a7f8c8530450549915c5338841db2a5fea',
            decimals: 18,
            symbol: 'FOMO',
        },
        {
            address: '0x3b21418081528845a6df4e970bd2185545b712ba',
            decimals: 18,
            symbol: 'CHI',
        },
        {
            address: '0x32b053f2cba79f80ada5078cb6b305da92bde6e1',
            decimals: 18,
            symbol: 'NEURAL',
        },
        {
            address: '0x7ae0f19d2ae2f490e710579284a58000d4e8c85f',
            decimals: 18,
            symbol: 'SBEE',
        },
        {
            address: '0xcb19633b629c5b7e316096fa465b4f86250dbb55',
            decimals: 9,
            symbol: 'TRUMPSHIBA',
        },
        {
            address: '0x236501327e701692a281934230af0b6be8df3353',
            decimals: 18,
            symbol: 'FLT',
        },
        {
            address: '0xeb51b8dc2d43469c0f0b7365c8a18438907bdf21',
            decimals: 18,
            symbol: 'SHIV',
        },
        {
            address: '0x32c6f1c1731ff8f98ee2ede8954f696446307846',
            decimals: 18,
            symbol: 'BEARDY',
        },
        {
            address: '0x1e354f9ab5bcc9fb981f31b794c5fe13f7a89218',
            decimals: 18,
            symbol: 'NTD',
        },
        {
            address: '0xc06bf3589345a81f0c2845e4db76bdb64bbbbc9d',
            decimals: 18,
            symbol: 'MEGA',
        },
        {
            address: '0xebcd1cc56db8ce89b4a83c037103c870998034c7',
            decimals: 9,
            symbol: 'sGROK',
        },
        {
            address: '0x3e985250cb137fc1ff55922116934c5982d29f85',
            decimals: 18,
            symbol: 'ZENT',
        },
        {
            address: '0xebb1afb0a4ddc9b1f84d9aa72ff956cd1c1eb4be',
            decimals: 18,
            symbol: 'EMRLD',
        },
        {
            address: '0x477a3d269266994f15e9c43a8d9c0561c4928088',
            decimals: 18,
            symbol: 'YAI',
        },
        {
            address: '0x76bc677d444f1e9d57daf5187ee2b7dc852745ae',
            decimals: 18,
            symbol: 'XFT',
        },
        {
            address: '0x725024200cd4e1f259fcf2b7153d37fb477e139c',
            decimals: 9,
            symbol: 'FLOVI',
        },
        {
            address: '0x0a2b624aba3c35d7f88ac581f9b9306aec948512',
            decimals: 9,
            symbol: 'DOVE',
        },
        {
            address: '0xf3768d6e78e65fc64b8f12ffc824452130bd5394',
            decimals: 18,
            symbol: 'KEROSENE',
        },
        {
            address: '0xc28eb2250d1ae32c7e74cfb6d6b86afc9beb6509',
            decimals: 18,
            symbol: 'OPN',
        },
        {
            address: '0xc61edb127f58f42f47a8be8aebe83cf602a53878',
            decimals: 18,
            symbol: 'COBE',
        },
        {
            address: '0x61e24ce4efe61eb2efd6ac804445df65f8032955',
            decimals: 18,
            symbol: 'RTV',
        },
        {
            address: '0xd55210bb6898c021a19de1f58d27b71f095921ee',
            decimals: 18,
            symbol: 'CHKN',
        },
        {
            address: '0x4a029f7bcf33acb03547d8fa7be840347973e24e',
            decimals: 18,
            symbol: 'MAZZE',
        },
        {
            address: '0x9b8ce311b059df70ca11cdd10d1989b15edb1d60',
            decimals: 9,
            symbol: 'sPEPE',
        },
        {
            address: '0xcc2b3aad7571872914facf88915651e354973958',
            decimals: 9,
            symbol: 'DECOM',
        },
        {
            address: '0xbd941b2a39e3ff7a6e7bed9ea90d0b9334f35bc8',
            decimals: 9,
            symbol: 'DCM',
        },
        {
            address: '0x5ef3634745231878ad02878ad8c720b1ced0e98d',
            decimals: 9,
            symbol: 'sBRETT',
        },
        {
            address: '0x292fcdd1b104de5a00250febba9bc6a5092a0076',
            decimals: 18,
            symbol: 'HashAI',
        },
        {
            address: '0x82a605d6d9114f4ad6d5ee461027477eeed31e34',
            decimals: 18,
            symbol: 'SNSY',
        },
        {
            address: '0x420698ebc9b7c225731c02d887d0729057339d39',
            decimals: 18,
            symbol: 'CHUCK',
        },
        {
            address: '0x3fb3df9c5241d781f9b28196584d3636fa6d01d6',
            decimals: 18,
            symbol: 'VONE',
        },
        {
            address: '0x57e114b691db790c35207b2e685d4a43181e6061',
            decimals: 18,
            symbol: 'ENA',
        },
        {
            address: '0xca95a6b21a8101d8e34c153d31dc563ff897ebef',
            decimals: 18,
            symbol: 'FLASH',
        },
        {
            address: '0x033bbde722ea3cdcec73cffea6581df9f9c257de',
            decimals: 6,
            symbol: 'VELAR',
        },
        {
            address: '0xeff49b0f56a97c7fd3b51f0ecd2ce999a7861420',
            decimals: 9,
            symbol: 'FOFAR',
        },
        {
            address: '0x85f7cfe910393fb5593c65230622aa597e4223f1',
            decimals: 9,
            symbol: 'NITEFEEDER',
        },
        {
            address: '0xcdbb2498fa9e7b5849bed5d3661386d0ce2733b2',
            decimals: 18,
            symbol: 'FAI',
        },
        {
            address: '0x11bce3d6e2aec3bfaa4b47fb654c850418ce861b',
            decimals: 9,
            symbol: 'Robotaxi',
        },
        {
            address: '0x68aae81b4241ffe03d3552d42a69940604fe28bf',
            decimals: 9,
            symbol: 'MUFFIN',
        },
        {
            address: '0xb75256012cbb2030abfc8f55214569376aa4d302',
            decimals: 9,
            symbol: 'PAMBO',
        },
        {
            address: '0x6b15602f008a05d9694d777dead2f05586216cb4',
            decimals: 18,
            symbol: 'CYG',
        },
        {
            address: '0xe4042c7c1bf740b8ddb2ab43df6d9ed766b2513e',
            decimals: 9,
            symbol: 'BADCAT',
        },
        {
            address: '0x34df1be72e29fe21f7ddcbb81719e7ec2065051a',
            decimals: 9,
            symbol: 'GOOFY',
        },
        {
            address: '0x52cbbff6494ee140303268629e26123c8cd7a139',
            decimals: 9,
            symbol: 'HOTTIE',
        },
        {
            address: '0xe79031b5aaeb3ee8d0145e3d75b81b36bffe341d',
            decimals: 9,
            symbol: 'BOPPY',
        },
        {
            address: '0xba0dda8762c24da9487f5fa026a9b64b695a07ea',
            decimals: 18,
            symbol: 'OX',
        },
        {
            address: '0xdf8ef8fef6fa5489d097652dedfb6617ce28a0d6',
            decimals: 18,
            symbol: 'DUMP',
        },
        {
            address: '0x067def80d66fb69c276e53b641f37ff7525162f6',
            decimals: 18,
            symbol: 'oGPU',
        },
        {
            address: '0x0339f586230176a243dc9abc757ba1faa5242bd3',
            decimals: 18,
            symbol: 'w3ULL',
        },
        {
            address: '0x908ddb096bfb3acb19e2280aad858186ea4935c4',
            decimals: 18,
            symbol: 'ESE',
        },
        {
            address: '0x8fc17671d853341d9e8b001f5fc3c892d09cb53a',
            decimals: 18,
            symbol: 'BLOCK',
        },
        {
            address: '0x049bf3ffee713ab8bf91cbf4ce6747da01e87544',
            decimals: 9,
            symbol: 'TRUMPCAT',
        },
        {
            address: '0xdf09f5c6c2afc2cf50cbee1107b722620e69f8af',
            decimals: 9,
            symbol: 'POPE',
        },
        {
            address: '0x171120219d3223e008558654ec3254a0f206edb2',
            decimals: 9,
            symbol: 'WXX',
        },
        {
            address: '0x16c22a91c705ec3c2d5945dbe2aca37924f1d2ed',
            decimals: 9,
            symbol: 'ERIC',
        },
        {
            address: '0xc5f0f7b66764f6ec8c8dff7ba683102295e16409',
            decimals: 18,
            symbol: 'FDUSD',
        },
        {
            address: '0xe020b01b6fbd83066aa2e8ee0ccd1eb8d9cc70bf',
            decimals: 18,
            symbol: 'ARCD',
        },
        {
            address: '0xbc61e13ca6830fc7f035fd0e90a01cd08be6dcaa',
            decimals: 18,
            symbol: 'SHOOT',
        },
        {
            address: '0x5ac34c53a04b9aaa0bf047e7291fb4e8a48f2a18',
            decimals: 18,
            symbol: 'NAI',
        },
        {
            address: '0x49c35a8570697e206a2d7ebb598095a5899a4fd7',
            decimals: 9,
            symbol: 'BADCAT',
        },
        {
            address: '0x3ba925fdeae6b46d0bb4d424d829982cb2f7309e',
            decimals: 18,
            symbol: 'RBX',
        },
        {
            address: '0x69457a1c9ec492419344da01daf0df0e0369d5d0',
            decimals: 18,
            symbol: 'FJO',
        },
        {
            address: '0x67466be17df832165f8c80a5a120ccc652bd7e69',
            decimals: 18,
            symbol: 'WOLF',
        },
        {
            address: '0x66e564819340cc2f54abceb4e49941fa07e426b4',
            decimals: 9,
            symbol: 'BRETT',
        },
        {
            address: '0x6e2a0811b2af38e45451460485f081eb3fe2a864',
            decimals: 9,
            symbol: 'HEDZ',
        },
        {
            address: '0xe9a430d0dd451936ec8020186c40ecf700d52746',
            decimals: 9,
            symbol: 'ND',
        },
        {
            address: '0x70fd93fb088150e203d2243b9bd3190276f80c70',
            decimals: 9,
            symbol: 'BIRDDOG',
        },
        {
            address: '0x52602ad562d38a0839ba317e2e81defddb85515b',
            decimals: 9,
            symbol: 'BABYANDY',
        },
        {
            address: '0xa6eba1ed27b1a4ba00b020819264a70133b6e127',
            decimals: 9,
            symbol: 'DEMON',
        },
        {
            address: '0x5afe3855358e112b5647b952709e6165e1c1eeee',
            decimals: 18,
            symbol: 'SAFE',
        },
        {
            address: '0x0921799cb1d702148131024d18fcde022129dc73',
            decimals: 18,
            symbol: 'LL',
        },
        {
            address: '0x706987611c5d2052541d64ef8f036916807c916a',
            decimals: 18,
            symbol: 'BOYS',
        },
        {
            address: '0xa728aa2de568766e2fa4544ec7a77f79c0bf9f97',
            decimals: 18,
            symbol: 'JOK',
        },
        {
            address: '0x64424b26098d7c8ad8af1ba36c904c972aed92b9',
            decimals: 9,
            symbol: 'HOPPY',
        },
        {
            address: '0x6968676661ac9851c38907bdfcc22d5dd77b564d',
            decimals: 18,
            symbol: 'BOYSCLUB',
        },
        {
            address: '0x69420e3a3aa9e17dea102bb3a9b3b73dcddb9528',
            decimals: 9,
            symbol: 'ELON',
        },
        {
            address: '0x6940914b5d38610aa55d676e8124900caacc1ddd',
            decimals: 18,
            symbol: 'VITALIK',
        },
        {
            address: '0x42069caef15dbac7f4aad588197ae568cfe3323f',
            decimals: 9,
            symbol: 'MONKEYS',
        },
        {
            address: '0xd12a99dbc40036cec6f1b776dccd2d36f5953b94',
            decimals: 9,
            symbol: 'DRAGGY',
        },
        {
            address: '0x696969c0e7eb65bef6f066e5ba6e054e38f7eb6b',
            decimals: 9,
            symbol: '0x69',
        },
        {
            address: '0x0814796111e2be5efe9809cf2761cd72c3f7d7fc',
            decimals: 9,
            symbol: 'Furie',
        },
        {
            address: '0x289ff00235d2b98b0145ff5d4435d3e92f9540a6',
            decimals: 18,
            symbol: 'BOOE',
        },
        {
            address: '0x6148d33872ed8506feeb196144b2ccdfe7b14563',
            decimals: 9,
            symbol: 'RATTY',
        },
        {
            address: '0x1946614e70bd2da589d74d54d007c03f81f0c4e9',
            decimals: 9,
            symbol: 'Trump',
        },
        {
            address: '0x4116f14b6d462b32a1c10f98049e4b1765e34fa9',
            decimals: 18,
            symbol: 'MOOV',
        },
        {
            address: '0xb60fdf036f2ad584f79525b5da76c5c531283a1b',
            decimals: 9,
            symbol: 'NEMO',
        },
        {
            address: '0xa5d6abc273c114ef7071f86c834ee14ea63a1948',
            decimals: 18,
            symbol: 'BDAG',
        },
        {
            address: '0x064797ac7f833d01faeeae0e69f3af5a52a91fc8',
            decimals: 9,
            symbol: 'SU',
        },
        {
            address: '0x329c6e459ffa7475718838145e5e85802db2a303',
            decimals: 18,
            symbol: 'eMAID',
        },
        {
            address: '0x70b31d811fc38dbdd5f08f01a95a0c5221956cce',
            decimals: 9,
            symbol: 'POPCAT',
        },
        {
            address: '0xf35522d51a347dc1352848556cbd019bb176ccf0',
            decimals: 18,
            symbol: 'BDAG',
        },
        {
            address: '0x4e15c428ae06328769e666d032d2d2ccc6f6f904',
            decimals: 10,
            symbol: 'MRS',
        },
        {
            address: '0xa059b81568fee88791de88232e838465826cf419',
            decimals: 9,
            symbol: 'THREE',
        },
        {
            address: '0xb33522fa127a73ed4afc43500bbf56c5abbf45bb',
            decimals: 18,
            symbol: 'MTC',
        },
        {
            address: '0x700d0e92ea7db8362a4449696d2d84a658f7808d',
            decimals: 18,
            symbol: 'HOPPY',
        },
        {
            address: '0x8805792d41facb22b6f47d468b06af36ff3fc1c5',
            decimals: 18,
            symbol: 'MAX',
        },
        {
            address: '0x66bff695f3b16a824869a8018a3a6e3685241269',
            decimals: 18,
            symbol: 'BRETT',
        },
        {
            address: '0x7d4a23832fad83258b32ce4fd3109ceef4332af4',
            decimals: 9,
            symbol: 'STONKS',
        },
        {
            address: '0x1971628beffc84be31bc44e7a06faf2f520115ca',
            decimals: 9,
            symbol: 'MUSK',
        },
        {
            address: '0x91792f96d2ef065486e31a3ab06726ab03f8194f',
            decimals: 18,
            symbol: 'BDAG',
        },
        {
            address: '0xf5d791eebfc229c4fe976e8328ed2c261690cb34',
            decimals: 9,
            symbol: 'BOOB',
        },
        {
            address: '0x7e057d739b289ed99c97335b33fb53e8f4bfccec',
            decimals: 9,
            symbol: 'BOOI',
        },
        {
            address: '0x69628206c9642ba511d0f9fa53fb26ebe3592f2d',
            decimals: 18,
            symbol: 'BOOM',
        },
        {
            address: '0x420693134600b2762767cab88043ab386351851d',
            decimals: 9,
            symbol: 'BODO',
        },
        {
            address: '0xccc80ce58995baae4e5867e5cde3bd9f8b242376',
            decimals: 9,
            symbol: 'GOE',
        },
        {
            address: '0x329cae8c175ac6773d5e79bd30624b953c68a308',
            decimals: 18,
            symbol: 'MISTY',
        },
        {
            address: '0xa35bd2246978dfbb1980dff8ff0f5834335dfdbc',
            decimals: 18,
            symbol: 'REMIO',
        },
        {
            address: '0x034903494c8074604391e4acec7ad7a74bb001d1',
            decimals: 18,
            symbol: 'FKC',
        },
        {
            address: '0x4fbaf51b95b024d0d7cab575be2a1f0afedc9b64',
            decimals: 18,
            symbol: 'BONK',
        },
        {
            address: '0xe18ab3568fa19e0ed38bc1d974eddd501e61e12d',
            decimals: 18,
            symbol: 'BANK',
        },
        {
            address: '0x2f6f04c0c9241c85139c93506cf39e0fd7d963a8',
            decimals: 9,
            symbol: 'BOBC',
        },
        {
            address: '0x0243343ed4b660a57cca9a308731d9524922feec',
            decimals: 9,
            symbol: 'SLASHA',
        },
        {
            address: '0x2a961d752eaa791cbff05991e4613290aec0d9ac',
            decimals: 9,
            symbol: 'PATTON',
        },
        {
            address: '0x6e6973d3f3c37fa910234f0af51fade76ffda62f',
            decimals: 9,
            symbol: 'BORPA',
        },
        {
            address: '0xc1f33e0cf7e40a67375007104b929e49a581bafe',
            decimals: 9,
            symbol: 'SPOT',
        },
        {
            address: '0x7fbaeee0e3df8a2db4e419f15a2650d10b1cfd16',
            decimals: 9,
            symbol: 'TRUMPCAT',
        },
        {
            address: '0x8fe815417913a93ea99049fc0718ee1647a2a07c',
            decimals: 18,
            symbol: 'XSWAP',
        },
        {
            address: '0x8b4e42489383a3b20d5413f070d1353ba0d316dc',
            decimals: 9,
            symbol: 'DOGJAK',
        },
        {
            address: '0x6eef771ffc3311bd09090b99beffe00ac769eae0',
            decimals: 9,
            symbol: 'Charlie',
        },
        {
            address: '0x988f10193d3e88315e45d6c4356f2b9e357996f5',
            decimals: 9,
            symbol: 'RUBIO',
        },
        {
            address: '0x886c869cdc619214138c87f1db0ada522b16dfa3',
            decimals: 18,
            symbol: 'WIF',
        },
        {
            address: '0xc56c7a0eaa804f854b536a5f3d5f49d2ec4b12b8',
            decimals: 9,
            symbol: 'GME',
        },
        {
            address: '0xd40533fedb2c7a9c981e1c6e430c389230115bc7',
            decimals: 9,
            symbol: 'WOLVERINE',
        },
        {
            address: '0xe1e1e2dd585c0b10995c4ef292aa9a0795f95811',
            decimals: 18,
            symbol: 'ELE',
        },
        {
            address: '0xb3904a699037655028fac5010b5b4685b0195bdc',
            decimals: 9,
            symbol: 'KITTY',
        },
        {
            address: '0x0f6ccd97774687def68512e708c6b1d299cf0881',
            decimals: 9,
            symbol: 'HODL',
        },
        {
            address: '0xec39b4077d4c6a8c3113f648b6ab680e0cf445fc',
            decimals: 9,
            symbol: 'PEPE',
        },
        {
            address: '0x6977597bbbdcc453636bd67a161a96d85098f327',
            decimals: 9,
            symbol: 'PIPI',
        },
        {
            address: '0xdbcd57cc74b180f928258f7b1a32f6f7e64bf12e',
            decimals: 18,
            symbol: 'BEPE',
        },
        {
            address: '0x1dbdd6c57875a7dc8a665d4c27d082a78653415d',
            decimals: 9,
            symbol: 'SOPE',
        },
        {
            address: '0xdc7ac5d5d4a9c3b5d8f3183058a92776dc12f4f3',
            decimals: 9,
            symbol: 'MONKAS',
        },
        {
            address: '0xfa704148d516b209d52c2d75f239274c8f8eaf1a',
            decimals: 18,
            symbol: 'wOCTA',
        },
        {
            address: '0x4229725d41e2233d75b47675b55c6781df0b56a7',
            decimals: 18,
            symbol: 'wCADAI',
        },
        {
            address: '0xdd157bd06c1840fa886da18a138c983a7d74c1d7',
            decimals: 18,
            symbol: 'GSTOP',
        },
        {
            address: '0x6905f6a8e6445f57da1af16a6b1986d84a1f5fc9',
            decimals: 9,
            symbol: 'MMGA',
        },
        {
            address: '0x160fa340f9ccdf46b11e2c60475c8fbb1b543f58',
            decimals: 9,
            symbol: 'WAT',
        },
        {
            address: '0x03402aff31f8f2f5bad0a9702ead1032a3a2811c',
            decimals: 9,
            symbol: 'VANCE',
        },
        {
            address: '0xd29da236dd4aac627346e1bba06a619e8c22d7c5',
            decimals: 9,
            symbol: 'MAGA',
        },
        {
            address: '0x45e82579792dddf08cb3a037086604c262d78065',
            decimals: 18,
            symbol: 'IX',
        },
        {
            address: '0x34cc30e6d89fab7fb2b8aadf4f18355d1a723df8',
            decimals: 9,
            symbol: 'DONKEY',
        },
        {
            address: '0x0b7f0e51cd1739d6c96982d55ad8fa634dd43a9c',
            decimals: 18,
            symbol: 'DMT',
        },
        {
            address: '0x470c8950c0c3aa4b09654bc73b004615119a44b5',
            decimals: 18,
            symbol: 'KIZUNA',
        },
        {
            address: '0x9909e6b9b8c05636617763e5bb78c75e0ec45a85',
            decimals: 18,
            symbol: 'KERMIT',
        },
        {
            address: '0x79d9dcba5ef3a54357e4d10dbb07359770d5dd83',
            decimals: 9,
            symbol: 'KAG',
        },
        {
            address: '0x065b4e5dfd50ac12a81722fd0a0de81d78ddf7fb',
            decimals: 9,
            symbol: 'Trump',
        },
        {
            address: '0x16a3543fa6b32cac3b0a755f64a729e84f89a75c',
            decimals: 18,
            symbol: 'TENSOR',
        },
        {
            address: '0xb4a3b0faf0ab53df58001804dda5bfc6a3d59008',
            decimals: 18,
            symbol: 'SPA',
        },
        {
            address: '0x3d288a54e08fe41796556efdfc24c015fe47f74e',
            decimals: 18,
            symbol: 'WOLT',
        },
        {
            address: '0xb01cf1be9568f09449382a47cd5bf58e2a9d5922',
            decimals: 18,
            symbol: 'Speed',
        },
        {
            address: '0x3b37a9caf74ead14e521d46af0bf00737d827828',
            decimals: 18,
            symbol: 'HOPE',
        },
        {
            address: '0x393f1d49425d94f47b26e591a9d111df5cd61065',
            decimals: 18,
            symbol: 'GUA',
        },
        {
            address: '0x23f3d4625aef6f0b84d50db1d53516e6015c0c9b',
            decimals: 18,
            symbol: 'NUTS',
        },
        {
            address: '0x97ef400921406046440c07fb18109028c34ff970',
            decimals: 9,
            symbol: 'MBGA',
        },
        {
            address: '0x5640e0560e6afd6a9f4ddb41230d0201d181fea7',
            decimals: 9,
            symbol: 'DMAGA',
        },
        {
            address: '0xcf4c91ecafc43c9f382db723ba20b82efa852821',
            decimals: 18,
            symbol: 'TRUTH',
        },
        {
            address: '0x1888847b50bc1833e268348896dee58701fc06a9',
            decimals: 18,
            symbol: 'PIZZA',
        },
        {
            address: '0x8c617d32e2c08d63b03fa9cd2a569980efc2cc19',
            decimals: 9,
            symbol: 'MBGA',
        },
        {
            address: '0x851f679a5edfb16e7cf1ad157c6995b7e7f333f2',
            decimals: 9,
            symbol: 'TrumpBucks',
        },
        {
            address: '0xf8428a5a99cb452ea50b6ea70b052daa3df4934f',
            decimals: 18,
            symbol: 'ZERC',
        },
        {
            address: '0xdbb7a34bf10169d6d2d0d02a6cbb436cf4381bfa',
            decimals: 18,
            symbol: 'ZENT',
        },
        {
            address: '0x14064604d16ea6024f1cfa957174a8867df0b78c',
            decimals: 9,
            symbol: 'TRUMP',
        },
        {
            address: '0x6920cc4a22177b92a653200ff983eeba7f317e06',
            decimals: 9,
            symbol: 'PEPE2.0',
        },
        {
            address: '0x1fdd61ef9a5c31b9a2abc7d39c139c779e8412af',
            decimals: 9,
            symbol: 'JJ',
        },
        {
            address: '0x9634bdb20bbab07bb52d279fa6e0c53ccc89c879',
            decimals: 9,
            symbol: 'PEPEGA',
        },
        {
            address: '0xc9bd7011ee97a13dc07087e01499a769ab7e75b4',
            decimals: 9,
            symbol: 'PEEZY',
        },
        {
            address: '0x3927fb89f34bbee63351a6340558eebf51a19fb8',
            decimals: 18,
            symbol: 'SPURDO',
        },
        {
            address: '0x4ade2b180f65ed752b6f1296d0418ad21eb578c0',
            decimals: 9,
            symbol: 'KEK',
        },
        {
            address: '0xe95e7c4ad2c419af2a903e9fe8c45e66626aabaf',
            decimals: 18,
            symbol: 'KERMIT',
        },
        {
            address: '0x85cf7f10683c73359e7b06c082eef5851ff2956d',
            decimals: 18,
            symbol: 'LILAI',
        },
        {
            address: '0xfe8da990b8d66cf0fdf030c42acaff39ec13bd1d',
            decimals: 18,
            symbol: 'RUGZ',
        },
        {
            address: '0x69babe9811cc86dcfc3b8f9a14de6470dd18eda4',
            decimals: 9,
            symbol: 'BABYPEPE',
        },
        {
            address: '0x6942806d1b2d5886d95ce2f04314ece8eb825833',
            decimals: 18,
            symbol: 'Groyper',
        },
        {
            address: '0xceb67a66c2c8a90980da3a50a3f96c07525a26cb',
            decimals: 9,
            symbol: 'KABOSU',
        },
        {
            address: '0x996bedf3a0bedf126c70923db6499bf741291508',
            decimals: 9,
            symbol: 'KABOCHAN',
        },
        {
            address: '0x62acdef82dac67975a21c67c4639654091297a2e',
            decimals: 9,
            symbol: 'MOMO',
        },
        {
            address: '0xa27700e179d6c8064d7d5ba6f8ad98eedb70e0af',
            decimals: 9,
            symbol: 'HARAMBE',
        },
        {
            address: '0xc7bb03ddd9311fc0338be013e7b523254092fda9',
            decimals: 18,
            symbol: 'n',
        },
        {
            address: '0xc9e5dfe7186475d05974876ce63c660e6732bc10',
            decimals: 18,
            symbol: 'PEPEV2',
        },
        {
            address: '0x7dbb51553f8222885d6d9933ea14196feb57fd78',
            decimals: 9,
            symbol: 'IVANKA',
        },
        {
            address: '0xe794795084e06ab638ea207c6c7aebfdf4ab5319',
            decimals: 9,
            symbol: 'TCC',
        },
        {
            address: '0x30ae41d5f9988d359c733232c6c693c0e645c77e',
            decimals: 0,
            symbol: 'WAAC',
        },
        {
            address: '0xc555d625828c4527d477e595ff1dd5801b4a600e',
            decimals: 18,
            symbol: 'MON',
        },
        {
            address: '0x18b3236d6c6c1a79522696ee70b1c28932d8902f',
            decimals: 9,
            symbol: 'PEGA',
        },
        {
            address: '0xbb274c69c7114917d7f022c4ee90c1bd1f12884c',
            decimals: 9,
            symbol: 'PEEPEE',
        },
        {
            address: '0xf3c3745894d979f8f85761bd060520bddbc464e9',
            decimals: 9,
            symbol: 'LION',
        },
        {
            address: '0x69d26c4901765ffa6d7716045b680c9574cb00b5',
            decimals: 18,
            symbol: 'HONKLER',
        },
        {
            address: '0x03d98a1f822503ba2a447494ac6fbaf3f0a24c0f',
            decimals: 9,
            symbol: 'KAG',
        },
        {
            address: '0x266166426e20f83b4c7350daa2da716748207fb3',
            decimals: 9,
            symbol: 'BoysClub',
        },
        {
            address: '0x3c57dd9aec5c32095797a6b0cc5a0041b5b5938b',
            decimals: 18,
            symbol: 'FOG',
        },
        {
            address: '0xa7391a9ed64d42e14e30403fedef069341612b64',
            decimals: 18,
            symbol: 'JACK',
        },
        {
            address: '0x858dbaa689e4dc81d8da3677c4f9160c1aec2c7f',
            decimals: 9,
            symbol: 'STILTON',
        },
        {
            address: '0x6d68015171eaa7af9a5a0a103664cf1e506ff699',
            decimals: 9,
            symbol: 'TUZKI',
        },
        {
            address: '0x3bb1be077f3f96722ae92ec985ab37fd0a0c4c51',
            decimals: 18,
            symbol: 'MARV',
        },
        {
            address: '0x482702745260ffd69fc19943f70cffe2cacd70e9',
            decimals: 18,
            symbol: '$Jenner',
        },
        {
            address: '0x42069f488a707c86b97bc38038aa643091bfc798',
            decimals: 18,
            symbol: 'OKAYEG',
        },
        {
            address: '0xea3665e272f14052442e433fb0059424d16cc6c7',
            decimals: 18,
            symbol: 'Smidge',
        },
        {
            address: '0x069f01cdd1e32d7bab5fc81527df191835136c9d',
            decimals: 9,
            symbol: 'APUGURL',
        },
        {
            address: '0xcec17bf53095078d3ba9a7865fae60e2fb47372e',
            decimals: 9,
            symbol: 'BORPA',
        },
        {
            address: '0xbbaf6e2db5e96d6de0f5d9fc8872d28e26566b84',
            decimals: 9,
            symbol: 'MEWING',
        },
        {
            address: '0x716bb5e0839451068885250442a5b8377f582933',
            decimals: 9,
            symbol: 'FOFAR',
        },
        {
            address: '0x86b69f38bea3e02f68ff88534bc61ec60e772b19',
            decimals: 9,
            symbol: 'TRUMP',
        },
        {
            address: '0x3f9929fff0911c298b9d607b1623b721ee267a88',
            decimals: 9,
            symbol: 'SMUG',
        },
        {
            address: '0xceb805aed9bd1673a77a53dd579bbd2a2eea8478',
            decimals: 9,
            symbol: 'Q',
        },
        {
            address: '0x8e7bd91f7d51d58145365341fdb37e0edfc8397f',
            decimals: 9,
            symbol: 'MAGAPEPE',
        },
        {
            address: '0x67859a9314b9dca2642023ad8231beaa6cbf1933',
            decimals: 18,
            symbol: 'WOLF',
        },
        {
            address: '0xcf078da6e85389de507ceede0e3d217e457b9d49',
            decimals: 18,
            symbol: 'SKAI',
        },
        {
            address: '0x0e3855376e5db3dff1fa39fcd0b2d76142628426',
            decimals: 9,
            symbol: 'BMAGA',
        },
        {
            address: '0x2077d81d0c5258230d5a195233941547cb5f0989',
            decimals: 9,
            symbol: 'TROG',
        },
        {
            address: '0x2c0687215aca7f5e2792d956e170325e92a02aca',
            decimals: 18,
            symbol: 'ESS',
        },
        {
            address: '0xba42cbacc8a2ad0c8a964a79ee90d602fdf99670',
            decimals: 9,
            symbol: 'STUMP',
        },
        {
            address: '0xd8e8438cf7beed13cfabc82f300fb6573962c9e3',
            decimals: 9,
            symbol: 'HONK',
        },
        {
            address: '0xd1b89856d82f978d049116eba8b7f9df2f342ff3',
            decimals: 9,
            symbol: 'PEPO',
        },
        {
            address: '0x42e4249458c10c43b72655cd5eeb45feb417062f',
            decimals: 9,
            symbol: 'FROPE',
        },
        {
            address: '0x0e6fb2b070ad1a4499e8bb1c9223024b186d1e6b',
            decimals: 9,
            symbol: 'POG',
        },
        {
            address: '0xe9f57296d24e246c08b4d7bed008937a551ea9cf',
            decimals: 9,
            symbol: 'PEMO',
        },
        {
            address: '0xe97f6dde78b11b58cb3e394f15ab592cb2acd290',
            decimals: 18,
            symbol: 'MUNITY',
        },
        {
            address: '0xa4e6c595ea82cc85a30ca04426bfa96ec696ded4',
            decimals: 9,
            symbol: 'Garfielf',
        },
        {
            address: '0x385d65ed9241e415cfc689c3e0bcf5ab2f0505c2',
            decimals: 9,
            symbol: 'MOLLARS',
        },
        {
            address: '0x5b09299e171a167f35ee3a25e7111fd84a51fbdc',
            decimals: 9,
            symbol: 'Dumb',
        },
        {
            address: '0xbd32bec7c76d28aa054fc0c907d601b9263e22c7',
            decimals: 18,
            symbol: 'PE',
        },
        {
            address: '0x5408d3883ec28c2de205064ae9690142b035fed2',
            decimals: 9,
            symbol: 'RASTO',
        },
        {
            address: '0x420fbb6006fb251318414ffa530590c3d7618e33',
            decimals: 9,
            symbol: 'ICELAND',
        },
        {
            address: '0x95ed629b028cf6aadd1408bb988c6d1daabe4767',
            decimals: 9,
            symbol: 'DORKY',
        },
        {
            address: '0x00255e1947ab8d2eef26e8a9342042ba1db002ea',
            decimals: 9,
            symbol: 'DUCKY',
        },
        {
            address: '0x0a2c375553e6965b42c135bb8b15a8914b08de0c',
            decimals: 9,
            symbol: 'FROG',
        },
        {
            address: '0x772358ef6ed3e18bde1263f7d229601c5fa81875',
            decimals: 18,
            symbol: 'SNPAD',
        },
        {
            address: '0x989fa855ce126275bc269e0ec8f04a57b4af02b4',
            decimals: 18,
            symbol: 'XBLAZE',
        },
        {
            address: '0x35993371d5819714c66c299d42927fb9b39e09b0',
            decimals: 18,
            symbol: 'ERIC',
        },
        {
            address: '0xd149656c989b8298301e1e023204fd5daa8b1fea',
            decimals: 9,
            symbol: 'TOAD',
        },
        {
            address: '0x0d6b0a7807cd4bf0796cbc551dffe3b0986411c1',
            decimals: 9,
            symbol: 'TRUMPISM',
        },
        {
            address: '0x3ffeea07a27fab7ad1df5297fa75e77a43cb5790',
            decimals: 18,
            symbol: 'PEIPEI',
        },
        {
            address: '0x9ebb0895bd9c7c9dfab0d8d877c66ba613ac98ea',
            decimals: 18,
            symbol: 'MAGAA',
        },
        {
            address: '0x36ba7e6cf7d8370d44aeb545785b713d86335040',
            decimals: 9,
            symbol: 'PIPI',
        },
        {
            address: '0x19848077f45356b21164c412eff3d3e4ff6ebc31',
            decimals: 9,
            symbol: 'SPIKE',
        },
        {
            address: '0xa0bbbe391b0d0957f1d013381b643041d2ca4022',
            decimals: 18,
            symbol: 'SHIN',
        },
        {
            address: '0xf41dcf271887493e8a093a3d8cd38254c5b5e3f7',
            decimals: 9,
            symbol: 'CNTRUMP',
        },
        {
            address: '0x64766392ad32a6c94b965b5bf655e07371c23a1d',
            decimals: 9,
            symbol: 'Yilongma',
        },
        {
            address: '0x137322eb6c1f131a3e4dc9d31bfee42e8fe8013a',
            decimals: 9,
            symbol: 'BONKEI',
        },
        {
            address: '0x67c4d14861f9c975d004cfb3ac305bee673e996e',
            decimals: 9,
            symbol: 'LANDWU',
        },
        {
            address: '0x66c3d1072fc02959b871f4256da8729a2e6466cf',
            decimals: 9,
            symbol: 'FATHER',
        },
        {
            address: '0x9fd9278f04f01c6a39a9d1c1cd79f7782c6ade08',
            decimals: 9,
            symbol: 'BIAO',
        },
        {
            address: '0x3ada3bf9a5c5c59523d6193381c0d14787070e54',
            decimals: 18,
            symbol: 'NEVA',
        },
        {
            address: '0xd9a442856c234a39a81a089c06451ebaa4306a72',
            decimals: 18,
            symbol: 'pufETH',
        },
        {
            address: '0x57b96d4af698605563a4653d882635da59bf11af',
            decimals: 18,
            symbol: 'RCH',
        },
        {
            address: '0x6987e0304d1b26a311e68e3f3da26b1c885a4e83',
            decimals: 18,
            symbol: 'Kaeru',
        },
        {
            address: '0x68e1f815d2450cacc6d6e5861f2fd3c6324d6c5a',
            decimals: 9,
            symbol: 'ANDYWU',
        },
        {
            address: '0xe11733a9c69077bd2885d3910fa3905cd1a856af',
            decimals: 18,
            symbol: 'BDAG',
        },
        {
            address: '0xd43fba1f38d9b306aeef9d78ad177d51ef802b46',
            decimals: 9,
            symbol: 'GONDOLA',
        },
        {
            address: '0x4c9edd5852cd905f086c759e8383e09bff1e68b3',
            decimals: 18,
            symbol: 'USDe',
        },
        {
            address: '0x307857c29bc451e27dfa727a2b9365be4699c139',
            decimals: 9,
            symbol: 'OKAYEG',
        },
        {
            address: '0x3e51ab263e0472cb40ee352502ea7aada2b956bd',
            decimals: 9,
            symbol: 'ZINE',
        },
        {
            address: '0xc5903ced3c193b89cbbb5a0af584494c3d5d289d',
            decimals: 10,
            symbol: 'KIRO',
        },
        {
            address: '0x525574c899a7c877a11865339e57376092168258',
            decimals: 18,
            symbol: 'GURU',
        },
        {
            address: '0x069e4aa272d17d9625aa3b6f863c7ef6cfb96713',
            decimals: 9,
            symbol: 'BULEI',
        },
        {
            address: '0xd1a6616f56221a9f27eb9476867b5bdb2b2d101d',
            decimals: 18,
            symbol: 'AGI',
        },
        {
            address: '0x455e53cbb86018ac2b8092fdcd39d8444affc3f6',
            decimals: 18,
            symbol: 'POL',
        },
        {
            address: '0x53206bf5b6b8872c1bb0b3c533e06fde2f7e22e4',
            decimals: 18,
            symbol: 'BLEPE',
        },
        {
            address: '0xbe0ed4138121ecfc5c0e56b40517da27e6c5226b',
            decimals: 18,
            symbol: 'ATH',
        },
        {
            address: '0xa045fe936e26e1e1e1fb27c1f2ae3643acde0171',
            decimals: 9,
            symbol: 'KAI',
        },
        {
            address: '0x69bb12b8ee418e4833b8debe4a2bb997ab9ce18e',
            decimals: 9,
            symbol: 'SALMAN',
        },
        {
            address: '0x1e8da3cc9ff6d102dabb22992390f42a07d8ed80',
            decimals: 18,
            symbol: 'BOGEY',
        },
        {
            address: '0x2e2e7a1f05946ecb2b43b99e3fc2984fa7d7e3bc',
            decimals: 9,
            symbol: 'ANDWU',
        },
        {
            address: '0xd5f7838f5c461feff7fe49ea5ebaf7728bb0adfa',
            decimals: 18,
            symbol: 'mETH',
        },
        {
            address: '0x433f62964edd67d7349088fe44544f822f863a6c',
            decimals: 9,
            symbol: 'MOGE',
        },
        {
            address: '0x610dbd98a28ebba525e9926b6aaf88f9159edbfd',
            decimals: 18,
            symbol: 'NSTR',
        },
        {
            address: '0x66bff0d18513c648690edcdf5993c9da8c632ec8',
            decimals: 9,
            symbol: 'BRETTWU',
        },
        {
            address: '0x3010ccb5419f1ef26d40a7cd3f0d707a0fa127dc',
            decimals: 18,
            symbol: 'GEMS',
        },
        {
            address: '0xe73655272e93e04dfa3037a927b2253620d08a93',
            decimals: 9,
            symbol: 'MICHELLE',
        },
        {
            address: '0x808688c820ab080a6ff1019f03e5ec227d9b522b',
            decimals: 18,
            symbol: 'BAG',
        },
        {
            address: '0x426a688ee72811773eb64f5717a32981b56f10c1',
            decimals: 18,
            symbol: 'AMC',
        },
        {
            address: '0x054c9d4c6f4ea4e14391addd1812106c97d05690',
            decimals: 18,
            symbol: 'LLD',
        },
        {
            address: '0x66686a29d3dba55e6c2afce44c961dd2b87af79a',
            decimals: 9,
            symbol: 'DorkLord',
        },
        {
            address: '0x63e83de9fec8aa5e22f79a8428d23781e2687b63',
            decimals: 18,
            symbol: 'SPIKE',
        },
        {
            address: '0x80034f803afb1c6864e3ca481ef1362c54d094b9',
            decimals: 9,
            symbol: 'NPI',
        },
        {
            address: '0x888888ae2c4a298efd66d162ffc53b3f2a869888',
            decimals: 9,
            symbol: 'OMOCHI',
        },
        {
            address: '0x32b29705bb44c57f6a3dcca047fd55b460977c25',
            decimals: 8,
            symbol: 'HYBX',
        },
        {
            address: '0xa247c6d23c8c7d223420700d16d189cff9357f38',
            decimals: 9,
            symbol: 'CHEESED',
        },
        {
            address: '0xfb598cf36f48ded716b2349ef2f24500be1c2aba',
            decimals: 9,
            symbol: 'DOG',
        },
        {
            address: '0x66babee1e404dda4b4df468e7782d18d93296c73',
            decimals: 9,
            symbol: 'BBRETT',
        },
        {
            address: '0x64babea366d476e844876d79f910bcc17d802ccb',
            decimals: 9,
            symbol: 'BHOPPY',
        },
        {
            address: '0x873259322be8e50d80a4b868d186cc5ab148543a',
            decimals: 18,
            symbol: 'Ponzio',
        },
        {
            address: '0x2ca9242c1810029efed539f1c60d68b63ad01bfc',
            decimals: 18,
            symbol: 'ANVL',
        },
        {
            address: '0x590246bfbf89b113d8ac36faeea12b7589f7fe5b',
            decimals: 9,
            symbol: 'FLAPPY',
        },
        {
            address: '0x203e5b63394fd27180daf86ea80afe94253f8b94',
            decimals: 18,
            symbol: 'MOGU',
        },
        {
            address: '0x1e3370ee14d64d3291fd7c20e0ea0f769e773dc4',
            decimals: 18,
            symbol: 'RATTY',
        },
        {
            address: '0x61aaa9db15560bd2a050fa844ff6ec97ddf19641',
            decimals: 9,
            symbol: 'RATTY',
        },
        {
            address: '0x636bd98fc13908e475f56d8a38a6e03616ec5563',
            decimals: 18,
            symbol: 'WAT',
        },
        {
            address: '0x3256cade5f8cb1256ac2bd1e2d854dec6d667bdf',
            decimals: 18,
            symbol: 'MOGU',
        },
        {
            address: '0xcc1a9bafe8ad6eb3d0d8a6614035a86b832a1cd8',
            decimals: 9,
            symbol: 'Marshall',
        },
        {
            address: '0x281d0bbc59f96cbfab4ebe590c05a4d06b494ad6',
            decimals: 9,
            symbol: 'TF47',
        },
        {
            address: '0x7e744bbb1a49a44dfcc795014a4ba618e418fbbe',
            decimals: 9,
            symbol: 'MAGANOMICS',
        },
        {
            address: '0x7c7f3385464a21eee2884a0cf6411f5953b9f408',
            decimals: 9,
            symbol: 'AIYANA',
        },
        {
            address: '0xbeef698bd78139829e540622d5863e723e8715f1',
            decimals: 9,
            symbol: 'BEEF',
        },
        {
            address: '0x53136755d9416f6c8eca5acb84d59c4da6bbbce0',
            decimals: 9,
            symbol: 'LOG',
        },
        {
            address: '0x5e8422345238f34275888049021821e8e08caa1f',
            decimals: 18,
            symbol: 'frxETH',
        },
        {
            address: '0xa0385e7283c83e2871e9af49eec0966088421ddd',
            decimals: 18,
            symbol: 'APE',
        },
        {
            address: '0x579b0e025b98b11e14235f45d95feb491c9a55e4',
            decimals: 18,
            symbol: 'DAWGZ',
        },
        {
            address: '0x05a92541b8da763e7b6c395da5e5e1d008bdb9d1',
            decimals: 9,
            symbol: 'smol',
        },
        {
            address: '0xd9ebbc7970e26b4eced7323b9331763e8272d011',
            decimals: 18,
            symbol: 'TYBENG',
        },
        {
            address: '0xafb698e325bb77e01dd4b74f9bbac561e55cf06f',
            decimals: 9,
            symbol: 'PUPPY',
        },
        {
            address: '0xb6fe105ab68f9d38d61248f7b9042879a9e606c7',
            decimals: 9,
            symbol: 'CDOG',
        },
        {
            address: '0xd966f70fa6f9e3b3b1c159f45c6e795054d034cc',
            decimals: 18,
            symbol: 'SMUG',
        },
        {
            address: '0x420698cfdeddea6bc78d59bc17798113ad278f9d',
            decimals: 18,
            symbol: 'Toweli',
        },
        {
            address: '0x5108f417288f87e8bd39786029b23f9f245f315a',
            decimals: 9,
            symbol: 'SHAD',
        },
        {
            address: '0x3b991130eae3cca364406d718da22fa1c3e7c256',
            decimals: 18,
            symbol: 'SHRUB',
        },
        {
            address: '0xabb41328eb3b89465cc1d6638f6b6b828adcc96d',
            decimals: 9,
            symbol: 'PNOMICS',
        },
        {
            address: '0x384c60084bc92a8f6b5dc38320349af09122d959',
            decimals: 18,
            symbol: 'Shrub',
        },
        {
            address: '0x96d30605ea5ea3839916b6b32d0cc956aabf6b4e',
            decimals: 9,
            symbol: 'BAPE',
        },
        {
            address: '0x62e3b3c557c792c4a70765b3cdb5b56b1879f82d',
            decimals: 9,
            symbol: 'FOX',
        },
        {
            address: '0xa0ef786bf476fe0810408caba05e536ac800ff86',
            decimals: 18,
            symbol: 'MYRIA',
        },
        {
            address: '0x3e222ab6d7f648c9bb40cbe1c94e7fde920921bd',
            decimals: 9,
            symbol: 'FROGE',
        },
        {
            address: '0x444c21aedaf670502136bed85c7ad7d0a018c2a1',
            decimals: 9,
            symbol: 'PEXEL',
        },
        {
            address: '0xcd605ac26fa22a316148aca8fe0dae7c747dcb41',
            decimals: 18,
            symbol: 'MEMES',
        },
        {
            address: '0x9b465aab9e8f325418f222c37de474b1bd38ded2',
            decimals: 9,
            symbol: 'VANCE',
        },
        {
            address: '0x1a7661cff5c31aa8774c53defbd2b632d643a610',
            decimals: 9,
            symbol: 'KEK',
        },
        {
            address: '0xf976fc699eb81a302a29bac6590d1565e8e5da0d',
            decimals: 18,
            symbol: 'RKC',
        },
        {
            address: '0x906cc2ad139eb6637e28605f908903c8adce566a',
            decimals: 18,
            symbol: 'PEPU',
        },
        {
            address: '0xfcd7ccee4071aa4ecfac1683b7cc0afecaf42a36',
            decimals: 18,
            symbol: 'BLAZE',
        },
        {
            address: '0xd2fa2a742156904ee436a354a56f6a50b08dd329',
            decimals: 9,
            symbol: 'BIGDOG',
        },
        {
            address: '0x2139b785cf81f2d9eb68341175fd52bbb827a202',
            decimals: 9,
            symbol: 'BBIRD',
        },
        {
            address: '0x227952cb66aa9a4397d11654740baf1a40c20cc4',
            decimals: 6,
            symbol: 'BWS',
        },
        {
            address: '0x3a22338595beac548e6e86ad95641da218a1f8b3',
            decimals: 9,
            symbol: 'BTRUMP',
        },
        {
            address: '0x52c5bf585ad90b81e01914fec93ffb391319547f',
            decimals: 9,
            symbol: 'WOOF',
        },
        {
            address: '0x6096b8765eb48cd2193f840a977f3727e7800356',
            decimals: 18,
            symbol: 'CRAB',
        },
        {
            address: '0xc7e3b4ccb7d9683b85b32ebc636310232b401bb9',
            decimals: 9,
            symbol: 'VP',
        },
        {
            address: '0x420b879b0d18cc182e7e82ad16a13877c3a88420',
            decimals: 9,
            symbol: 'BUD',
        },
        {
            address: '0xa2400e2f0f4f70368fc00f339bd9bfc937e7d271',
            decimals: 9,
            symbol: 'JOEVER',
        },
        {
            address: '0x68ad75469db9181a1144e769c16adf47f2f32cae',
            decimals: 18,
            symbol: '$MaxETH',
        },
        {
            address: '0x23593f7fb29cdc71dfb03b467853356d8f22c809',
            decimals: 18,
            symbol: 'DORKL',
        },
        {
            address: '0xda987c655ebc38c801db64a8608bc1aa56cd9a31',
            decimals: 18,
            symbol: 'SYNT',
        },
        {
            address: '0x073a3b3e890a3aaeb061e50e92fffdd31197870b',
            decimals: 18,
            symbol: 'JEFFRY',
        },
        {
            address: '0xb1c9d42fa4ba691efe21656a7e6953d999b990c4',
            decimals: 18,
            symbol: 'KANG',
        },
        {
            address: '0xdb0238975ce84f89212ffa56c64c0f2b47f8f153',
            decimals: 18,
            symbol: 'Flork',
        },
        {
            address: '0x3fbabe48e137c9ef4f8cb517a4762add7e6242ae',
            decimals: 9,
            symbol: 'BABYPEIPEI',
        },
        {
            address: '0xea318541a292ab46e72722b02b3b060403cbbae0',
            decimals: 9,
            symbol: 'ERING',
        },
        {
            address: '0xababe51c38843f71e7b4b3139a67c39c909eb47f',
            decimals: 9,
            symbol: 'BABYMOG',
        },
        {
            address: '0x600d6777805f45e960c84726f721757a0bfd3125',
            decimals: 9,
            symbol: 'FEELSGM',
        },
        {
            address: '0x179c5bfb1f9ddd3a6895f4f15b9e52616f13673d',
            decimals: 18,
            symbol: 'Fog',
        },
        {
            address: '0x6942016b8de9d18a5831eeda915e48b27cc8e23d',
            decimals: 9,
            symbol: 'PICKLE',
        },
        {
            address: '0xb9d09bc374577dac1ab853de412a903408204ea8',
            decimals: 18,
            symbol: 'SHEI',
        },
        {
            address: '0xe6705367880b4d5d1aeae948fd620f55ef7413e4',
            decimals: 9,
            symbol: 'DOGEI',
        },
        {
            address: '0x2ac0cb20e0d4e39e4843317be7ce6546614fb85a',
            decimals: 9,
            symbol: 'ZOG',
        },
        {
            address: '0x696969205dd1517cf6ec0e5fc2ab43dd46175461',
            decimals: 9,
            symbol: 'HORNY',
        },
        {
            address: '0x694200465963898a9fef06a5b778d9e65721685c',
            decimals: 9,
            symbol: 'GECKY',
        },
        {
            address: '0x6942040b6d25d6207e98f8e26c6101755d67ac89',
            decimals: 9,
            symbol: 'MELLOW',
        },
        {
            address: '0x155788dd4b3ccd955a5b2d461c7d6504f83f71fa',
            decimals: 9,
            symbol: 'HARRIS',
        },
        {
            address: '0x6985884c4392d348587b19cb9eaaf157f13271cd',
            decimals: 18,
            symbol: 'ZRO',
        },
        {
            address: '0x7cb991b745d8179a03ef243de5ef1719e0b20b64',
            decimals: 18,
            symbol: 'DOOM',
        },
        {
            address: '0x6666666e0ffbcce9e59306fc0c2ab9aeb8d5f17a',
            decimals: 9,
            symbol: 'GHOST',
        },
        {
            address: '0x9f13240c95694f203a94e4670a5c5d742b318e58',
            decimals: 18,
            symbol: 'WYNN',
        },
        {
            address: '0x9ad204436656b71ce217297768812bb1d4ffd356',
            decimals: 9,
            symbol: 'DOLPHY',
        },
        {
            address: '0x696867660a84a3891b173f10a5d4ff102db6be5a',
            decimals: 9,
            symbol: 'CABAL',
        },
        {
            address: '0x2be8e422cb4a5a7f217a8f1b0658952a79132f28',
            decimals: 18,
            symbol: 'MSI',
        },
        {
            address: '0x69fdacbd91a30b99145a4ab2031fc8576526f0ef',
            decimals: 9,
            symbol: 'RSTAR',
        },
        {
            address: '0xbdbe9f26918918bd3f43a0219d54e5fda9ce1bb3',
            decimals: 9,
            symbol: 'MOLLY',
        },
        {
            address: '0x68aaa0d94ea163b9bbf659dc3766defb4c0ac7be',
            decimals: 9,
            symbol: 'ANDYMAN',
        },
        {
            address: '0x07040971246a73ebda9cf29ea1306bb47c7c4e76',
            decimals: 9,
            symbol: 'USPEPE',
        },
        {
            address: '0x60d71e313709e0f910e15b277608ba8acd4eaa56',
            decimals: 18,
            symbol: 'SNEKKY',
        },
        {
            address: '0x62ec0b3d5cfd383711acf370b74059e3cb035fcd',
            decimals: 18,
            symbol: 'ES',
        },
        {
            address: '0x80aa87b47da26b2dba301708046fe467575fc355',
            decimals: 18,
            symbol: 'GREMLY',
        },
        {
            address: '0x07ddacf367f0d40bd68b4b80b4709a37bdc9f847',
            decimals: 18,
            symbol: 'MOJO',
        },
        {
            address: '0x72b00e483a0ec40634f47043d3190be6ac210072',
            decimals: 18,
            symbol: 'OHARE',
        },
        {
            address: '0xc3d0dfcb657329859d266b514aa185b7b4c8e2bc',
            decimals: 18,
            symbol: 'THEPE',
        },
        {
            address: '0x00000003ad90aff5c178e29126514ef51c41db49',
            decimals: 9,
            symbol: 'SEER',
        },
        {
            address: '0x89fd2d8fd8d937f55c89b7da3ceed44fa27e4a81',
            decimals: 9,
            symbol: 'BUG',
        },
        {
            address: '0x407b574d34d1b967d1a6c927c58b6b76b7f9202f',
            decimals: 18,
            symbol: 'FROG',
        },
        {
            address: '0x80999b0276246db7e3869b7aaa23e349ddf9aba6',
            decimals: 9,
            symbol: 'RIPBIDEN',
        },
        {
            address: '0x9db97cf3b55dc7f8fb1b96c2e4344f7443cffca6',
            decimals: 18,
            symbol: 'TARS',
        },
        {
            address: '0xc8e3b78019feaca535062ef3001db06040defa1e',
            decimals: 9,
            symbol: 'LARRY',
        },
        {
            address: '0xa9393cf80572892c3c1b934ae212eb5c52bc7f80',
            decimals: 9,
            symbol: '$DICK',
        },
        {
            address: '0x90f5776c8a094449fa99d0173f17a29d13c7f9f7',
            decimals: 18,
            symbol: 'BDAG',
        },
        {
            address: '0x6e5e9afb201a2d8d46fa518ae598c629c5b970a3',
            decimals: 18,
            symbol: 'BICYCLE',
        },
        {
            address: '0x0101013d11e4320d29759f40508c61110f525211',
            decimals: 9,
            symbol: 'FROG',
        },
        {
            address: '0xeb15a54e462e1ec239c09f1e6aa322b45c8da225',
            decimals: 18,
            symbol: 'SHIBA',
        },
        {
            address: '0x2d51d6b635a79b23e832153e8be9cc698fbb8867',
            decimals: 9,
            symbol: 'OWL',
        },
        {
            address: '0x8277101643891e434162e08aa5c56efcbb5ea472',
            decimals: 18,
            symbol: 'DUSTY',
        },
        {
            address: '0x92408e203da8bfc3947c0b3b066ac3a68bab24a1',
            decimals: 9,
            symbol: 'BLUEY',
        },
        {
            address: '0xc1b4f431e0964a4549699ae0254a73a2677029b6',
            decimals: 9,
            symbol: 'ZOINK',
        },
        {
            address: '0x7022fe5fedbd54b40fdc52be30c1c578fb55c2bf',
            decimals: 18,
            symbol: 'SKULL',
        },
        {
            address: '0x000000000d00353e0116ba046ef3dd854ed06f07',
            decimals: 9,
            symbol: 'PLAYTIME',
        },
        {
            address: '0xc735d6793680bc8e0f58e10483dbfe15da19d6a0',
            decimals: 18,
            symbol: 'SLIPPY',
        },
        {
            address: '0x60a92e1b3b7de21b434732aa674c7b749c120f15',
            decimals: 9,
            symbol: 'MFURIE',
        },
        {
            address: '0x790814cd782983fab4d7b92cf155187a865d9f18',
            decimals: 9,
            symbol: 'MATT',
        },
        {
            address: '0xc7036bbaf044ac631724acb5c33e24fbc14af60d',
            decimals: 9,
            symbol: 'SHOGGOTH',
        },
        {
            address: '0xb7ac081dac36cc8cdf2fa81239b1f01781b5ce59',
            decimals: 9,
            symbol: 'CATAIYANA',
        },
        {
            address: '0x0000e3705d8735ee724a76f3440c0a7ea721ed00',
            decimals: 9,
            symbol: 'SAITAMA',
        },
        {
            address: '0x6542006e6b512c62bf043444cc0126f876af78c7',
            decimals: 8,
            symbol: 'GRINKLE',
        },
        {
            address: '0xcafed8b6b5fad004af614cd15b0ff81d8d57d679',
            decimals: 9,
            symbol: 'CAFE',
        },
        {
            address: '0x1f70300bce8c2302780bd0a153ebb75b8ca7efcb',
            decimals: 9,
            symbol: 'BARRON',
        },
        {
            address: '0xa8b229f7045192750a6aa25ccb088a196e713cd9',
            decimals: 10,
            symbol: '$BIKEY',
        },
        {
            address: '0x9c7beba8f6ef6643abd725e45a4e8387ef260649',
            decimals: 18,
            symbol: 'G',
        },
        {
            address: '0x99420584706e47b1c5198cd80fef64d09f94adf1',
            decimals: 9,
            symbol: 'FORG',
        },
        {
            address: '0x420110d74c4c3ea14043a09e81fad53e1932f54c',
            decimals: 18,
            symbol: 'GROGGO',
        },
        {
            address: '0x6439221d2b06a4cdf38f52a55294ddc28e1bed08',
            decimals: 18,
            symbol: 'GNOMY',
        },
        {
            address: '0x14a603ec54bb88fe6c1bf64e9c6f8f85fa6cb905',
            decimals: 9,
            symbol: 'COCKY',
        },
        {
            address: '0x53be7be0ce7f92bcbd2138305735160fb799be4f',
            decimals: 6,
            symbol: '$NTMPI',
        },
        {
            address: '0x1d07b9bf1960814ad868e3f1958700e7ca9430a4',
            decimals: 18,
            symbol: 'KERMIT',
        },
        {
            address: '0xe10adbd5d600b54f516e3197c45a7aca2ce5a41e',
            decimals: 18,
            symbol: 'STINKY',
        },
        {
            address: '0x5d942f9872863645bcb181aba66c7d9646a91378',
            decimals: 18,
            symbol: 'ASI',
        },
        {
            address: '0x7abc8a5768e6be61a6c693a6e4eacb5b60602c4d',
            decimals: 18,
            symbol: 'CXT',
        },
        {
            address: '0x0487fadbcfdc5cf96ed39c1f458e6ae6482a66a7',
            decimals: 9,
            symbol: 'BIKE',
        },
        {
            address: '0x44e18207b6e98f4a786957954e462ed46b8c95be',
            decimals: 9,
            symbol: 'Terminus',
        },
        {
            address: '0xf944e35f95e819e752f3ccb5faf40957d311e8c5',
            decimals: 18,
            symbol: 'MOCA',
        },
        {
            address: '0xa5f55bf3731f28cd503b8d544e2bb9aa150eb313',
            decimals: 9,
            symbol: 'EPENG',
        },
        {
            address: '0x2025f14377a300b9bf70a09dccd7aafa8cb1d56b',
            decimals: 9,
            symbol: '2025',
        },
        {
            address: '0x72420b3c2c284f92336d2334f514f84808e5cb16',
            decimals: 9,
            symbol: 'HOTTIE',
        },
        {
            address: '0x780dd41998bee9a8cbf15e6f7490e31c2828ca8a',
            decimals: 9,
            symbol: 'DOOGLE',
        },
        {
            address: '0x5b4d99e890e5210b88b4ef4c84cc2b92791c4d86',
            decimals: 9,
            symbol: 'GRAPE',
        },
        {
            address: '0x66668d69663e2e05c3612a79ed0f1da7c0af6f91',
            decimals: 9,
            symbol: 'PAUL',
        },
        {
            address: '0xb48ef10254c688ca0077f45c84459dc466bc83f6',
            decimals: 18,
            symbol: 'SAPO',
        },
        {
            address: '0xaa6ced803abcac1b63e59d5df020a0c22f4812a2',
            decimals: 18,
            symbol: '2030',
        },
        {
            address: '0x0c4651a40a0390c081979ce1ffd0755558aa87d9',
            decimals: 9,
            symbol: 'BOM',
        },
        {
            address: '0xf8fd0538aafe2c52a042e25ad773885c0a2b38a5',
            decimals: 9,
            symbol: '$HOGGIE',
        },
        {
            address: '0xc5d197513683fcfee4663b5b54f7de740e6247e9',
            decimals: 9,
            symbol: 'PIZZA',
        },
        {
            address: '0x8802269d1283cdb2a5a329649e5cb4cdcee91ab6',
            decimals: 9,
            symbol: 'FIGHT',
        },
        {
            address: '0x91f322e0d0bd688acd511a789431a2b672a28013',
            decimals: 18,
            symbol: 'FTP',
        },
        {
            address: '0x683a4ac99e65200921f556a19dadf4b0214b5938',
            decimals: 9,
            symbol: 'MAPE',
        },
        {
            address: '0x66bf81fcb083162a6e5834c37aeaf8dcac36be01',
            decimals: 9,
            symbol: 'FIST',
        },
        {
            address: '0x71151ff3b8e016204cca57722512e9998832b9dd',
            decimals: 18,
            symbol: 'SCALEY',
        },
        {
            address: '0xc0fd87252633862d59a9c919e0dd3ce57393d435',
            decimals: 9,
            symbol: 'ELEPHANT',
        },
        {
            address: '0x8143182a775c54578c8b7b3ef77982498866945d',
            decimals: 8,
            symbol: 'wQUIL',
        },
        {
            address: '0xfefe157c9d0ae025213092ff9a5cb56ab492bab8',
            decimals: 9,
            symbol: 'FEFE',
        },
        {
            address: '0xd6d9890e53939bcd628f6d659724f7de7de5afe5',
            decimals: 9,
            symbol: 'BOOKMAGA',
        },
        {
            address: '0x142ee28656d646ce1e27bdb1c7106da6b924f992',
            decimals: 9,
            symbol: 'MAWA',
        },
        {
            address: '0x6135177a17e02658df99a07a2841464deb5b8589',
            decimals: 9,
            symbol: 'FEARNOT',
        },
        {
            address: '0x5999f9572e4d6429dc7d37665026144de7524def',
            decimals: 18,
            symbol: 'MANDY',
        },
        {
            address: '0x04d87bb593bff8976e221c07bfa73e76b6016ed9',
            decimals: 9,
            symbol: 'KAG',
        },
        {
            address: '0x5484581038cbf8ef33b7f6daec7a2f01f71db3c2',
            decimals: 18,
            symbol: 'HARAMBEAI',
        },
        {
            address: '0x877b2e154b8b71512fc34f2c8a8877062c07afab',
            decimals: 9,
            symbol: 'MASA',
        },
        {
            address: '0x460040cdb49e26d0fe16977a765072e1aabde254',
            decimals: 9,
            symbol: 'JOEVER',
        },
        {
            address: '0xed090248d02715ef9b88d4d6b1e9434f7f8f640a',
            decimals: 9,
            symbol: 'MIGGLES',
        },
        {
            address: '0x69f137147025c63b7b523eefcc2cf587b9c19269',
            decimals: 18,
            symbol: 'PENDY',
        },
        {
            address: '0x87d7f727329f33bfb43dd24718d07f8ab810af64',
            decimals: 18,
            symbol: 'BMONEY',
        },
        {
            address: '0x47a5a5ac7646a7eb36e40247d2755db5afee6a4f',
            decimals: 9,
            symbol: 'MUG',
        },
        {
            address: '0x00380d12a12acf6f47481e8ca8be777931395200',
            decimals: 18,
            symbol: 'REPUBLICAN',
        },
        {
            address: '0x69ee720c120ec7c9c52a625c04414459b3185f23',
            decimals: 18,
            symbol: 'PEEZY',
        },
        {
            address: '0x36c7188d64c44301272db3293899507eabb8ed43',
            decimals: 9,
            symbol: 'SWAG',
        },
        {
            address: '0x80810a9c31e7243a0bfb9919b0b4020378d1c134',
            decimals: 9,
            symbol: 'GOP',
        },
        {
            address: '0xbbcc7c16d56fc3b0c0a9a2ced36c74bcf73e683e',
            decimals: 18,
            symbol: 'BBCC',
        },
        {
            address: '0x13b486cdad3cd5328c490779c8320ef4d8619568',
            decimals: 5,
            symbol: 'GBT',
        },
        {
            address: '0x70d70a716cdf5f5335e62d298a848f5a8228f473',
            decimals: 18,
            symbol: 'DUCK',
        },
        {
            address: '0x324c2c380312ef680a0029b4a8265411c66bdc91',
            decimals: 18,
            symbol: 'BirdDog',
        },
        {
            address: '0xb8a914a00664e9361eae187468eff94905dfbc15',
            decimals: 9,
            symbol: 'DRIP',
        },
        {
            address: '0x3fa55eb91be2c5d72890da11a4c0269e7f786555',
            decimals: 18,
            symbol: 'PROPHET',
        },
        {
            address: '0x116948051722d5df21fe31051372e6e29244e3e7',
            decimals: 18,
            symbol: 'GOWOKE',
        },
        {
            address: '0x43fd9de06bb69ad771556e171f960a91c42d2955',
            decimals: 9,
            symbol: 'BTC',
        },
        {
            address: '0xd5f58b528f810db3358b2aa52cbd93f94b3d8672',
            decimals: 9,
            symbol: '#MAGA',
        },
        {
            address: '0x36b25341b2ff1bbc1b019b041ec7423a6cb21969',
            decimals: 9,
            symbol: 'LAMBEAU',
        },
        {
            address: '0x0ad01d0f9ef9a6193ce8bf9715a748aded1a6081',
            decimals: 9,
            symbol: 'MCDON',
        },
        {
            address: '0xef3747225b9b8d0271c9d414cc068005670b2edb',
            decimals: 9,
            symbol: 'PIPI',
        },
        {
            address: '0xaaf2d31132d8094c9cafb523cf601cacf2734126',
            decimals: 18,
            symbol: 'DTRUMP',
        },
        {
            address: '0x209e77a8c21f0ccf8562a3130c34c9c6a107d2ec',
            decimals: 18,
            symbol: 'MAGABABES',
        },
        {
            address: '0x8e2128d2f2f2645c107916cfc62e0c1b1951fdb7',
            decimals: 9,
            symbol: '47',
        },
        {
            address: '0x5c1da32c9352c749357e8006fec0e350bc0ad8a8',
            decimals: 9,
            symbol: 'AMERICA',
        },
        {
            address: '0x97a9a15168c22b3c137e6381037e1499c8ad0978',
            decimals: 18,
            symbol: 'DOP',
        },
        {
            address: '0xee8268e6996f32de4db966b5fecffbd7ed93f512',
            decimals: 9,
            symbol: 'DARKMUSK',
        },
        {
            address: '0xb9633d2231dcd82216de99b6d561ff13222bc740',
            decimals: 9,
            symbol: 'DELON',
        },
        {
            address: '0x9e39f77925d212a3b2a01eb981eb278727b44b28',
            decimals: 9,
            symbol: 'DARKTRUMP',
        },
        {
            address: '0x9f48ba889c6fa309ae9bfb8da7e2ffdb037180ac',
            decimals: 9,
            symbol: 'PEPETH',
        },
        {
            address: '0xc3dc991f2e0d39b3f3c4f8aaedb30f81207974c6',
            decimals: 9,
            symbol: 'DELON',
        },
        {
            address: '0x4c44a8b7823b80161eb5e6d80c014024752607f2',
            decimals: 9,
            symbol: 'PAC',
        },
        {
            address: '0x5ebd0cdbd5bfa3bcbc101cc8fb39c3b6f3594ca3',
            decimals: 9,
            symbol: 'VITALIK',
        },
        {
            address: '0x87011c5a98b6752c3cde5ba78c4af5f6bdb8aeb5',
            decimals: 9,
            symbol: 'GROK3',
        },
        {
            address: '0xbf425be3625708add42f751abb85df6ec5c3c088',
            decimals: 9,
            symbol: 'MAG',
        },
        {
            address: '0xcd5fe23c85820f7b72d0926fc9b05b43e359b7ee',
            decimals: 18,
            symbol: 'weETH',
        },
        {
            address: '0xa787fbb8cf6e735493c237e2a095087fee91bbb3',
            decimals: 9,
            symbol: 'BIDEN',
        },
        {
            address: '0x9f5b677b880e15b61b803638f2d43c9df3f9f8e7',
            decimals: 9,
            symbol: 'ELLE',
        },
        {
            address: '0x75f71c3e5ea87c548ca935ea960cc5617e9800f4',
            decimals: 9,
            symbol: 'VITALIK',
        },
        {
            address: '0xeeb4d8400aeefafc1b2953e0094134a887c76bd8',
            decimals: 18,
            symbol: 'AVAIL',
        },
        {
            address: '0x777be1c6075c20184c4fd76344b7b0b7c858fe6b',
            decimals: 18,
            symbol: 'BAR',
        },
        {
            address: '0x79005a8c6a74d861137c8556fb379fd8ced8f134',
            decimals: 9,
            symbol: 'MIAO',
        },
        {
            address: '0x69420149f697d62699a2c7cb88a6c26d08fe456a',
            decimals: 9,
            symbol: 'WOJU',
        },
        {
            address: '0xe226486be554ae5b7bd1abbb07a9a8a341712a9c',
            decimals: 9,
            symbol: 'KHIVE',
        },
        {
            address: '0x0bc37bea9068a86c221b8bd71ea6228260dad5a2',
            decimals: 18,
            symbol: 'SPARKLET',
        },
        {
            address: '0x03dcee0d21ab39614c768dab67bfc33b0fc0a047',
            decimals: 18,
            symbol: 'TRUMPCOIN',
        },
        {
            address: '0x97aee01ed2aabad9f54692f94461ae761d225f17',
            decimals: 18,
            symbol: 'DEGA',
        },
        {
            address: '0x5b1543c4ea138efae5b0836265dff75e1ab6227d',
            decimals: 18,
            symbol: 'ASPIE',
        },
        {
            address: '0xda2641efc1caca3eb7b362d2940cdbae00d0be11',
            decimals: 9,
            symbol: 'BOOCHIE',
        },
        {
            address: '0xe657d49abae3ea21618bb481f1dab4322855f60e',
            decimals: 18,
            symbol: 'RAINBOW',
        },
        {
            address: '0x31ff138d090378e10846c623fab9e2042474fcfe',
            decimals: 9,
            symbol: 'MUFFIN',
        },
        {
            address: '0x777b6d4730a8a890dc64bf202514ce03ab001c02',
            decimals: 18,
            symbol: 'BARS',
        },
        {
            address: '0x812ba41e071c7b7fa4ebcfb62df5f45f6fa853ee',
            decimals: 9,
            symbol: 'Neiro',
        },
        {
            address: '0xa6180029845469e89c507fe3eafedfa242687822',
            decimals: 9,
            symbol: 'NEIRO',
        },
        {
            address: '0xee2a03aa6dacf51c18679c516ad5283d8e7c2637',
            decimals: 9,
            symbol: 'NEIRO',
        },
        {
            address: '0xd0630a2d243503591c84277342baff84854b14f8',
            decimals: 18,
            symbol: 'NEIRO',
        },
        {
            address: '0xf1ff59fa458bee12d6526dbd92290090bf670e29',
            decimals: 18,
            symbol: 'fluffy',
        },
        {
            address: '0x71da932ccda723ba3ab730c976bc66daaf9c598c',
            decimals: 18,
            symbol: 'MAG',
        },
        {
            address: '0xd4419c2d3daa986dc30444fa333a846be44fd1eb',
            decimals: 18,
            symbol: 'ZIK',
        },
        {
            address: '0xf6bf942401f5d18f33f80842c14674a8973ef377',
            decimals: 18,
            symbol: 'ITO',
        },
        {
            address: '0x465dbc39f46f9d43c581a5d90a43e4a0f2a6ff2d',
            decimals: 9,
            symbol: 'ITO',
        },
        {
            address: '0x69420b83b6189f954268f1167ca7c7f3b21711d2',
            decimals: 9,
            symbol: 'RATDOG',
        },
        {
            address: '0x8581998b905070b8984d99dc9af2c6800d97dce1',
            decimals: 18,
            symbol: 'BABYNEIRO',
        },
        {
            address: '0xed11c9bcf69fdd2eefd9fe751bfca32f171d53ae',
            decimals: 8,
            symbol: 'KOIN',
        },
        {
            address: '0x375e104af98872e5b4fe951919e504a47db1757c',
            decimals: 9,
            symbol: 'GINNAN',
        },
        {
            address: '0x8af8cce77d705b4ca1b0a627d705a33ff475af5e',
            decimals: 9,
            symbol: 'Neiro2',
        },
        {
            address: '0x876d4f16826cc8b602fe34af6de0de484ad1f73e',
            decimals: 18,
            symbol: 'BOW',
        },
        {
            address: '0xbebe69ccbbc1a9a41b22be4d31b55c6ce186b192',
            decimals: 9,
            symbol: 'BEBE',
        },
        {
            address: '0xcc524200264499d2434e071798a37e846cdd8d01',
            decimals: 9,
            symbol: 'Unicorn',
        },
        {
            address: '0xbc4f285aa4bc2c4e186311b46ca474916c62eae0',
            decimals: 9,
            symbol: 'AOCHAN',
        },
        {
            address: '0xa0ba1d2fc866a525728661faeaaa93a6b1d1989a',
            decimals: 9,
            symbol: 'AOBA',
        },
        {
            address: '0x7f911119435d8ded9f018194b4b6661331379a3d',
            decimals: 18,
            symbol: 'FWOG',
        },
        {
            address: '0xbabe3ce7835665464228df00b03246115c30730a',
            decimals: 9,
            symbol: 'BABYNEIRO',
        },
        {
            address: '0x2e6a60492fb5b58f5b5d08c7cafc75e740e6dc8e',
            decimals: 9,
            symbol: 'TSUJI',
        },
        {
            address: '0x65d2ae6ac5dfa4746f9d1e8f0923753fab702636',
            decimals: 18,
            symbol: 'GINNAN',
        },
        {
            address: '0x6aa56e1d98b3805921c170eb4b3fe7d4fda6d89b',
            decimals: 9,
            symbol: 'TRUMP',
        },
        {
            address: '0xcc5e0637c3b206b969adc3fa6c3effc88219a286',
            decimals: 18,
            symbol: 'RANDOM',
        },
        {
            address: '0x000006fd692d20d2404a334c22a404af3b2daac6',
            decimals: 9,
            symbol: 'DUCKY',
        },
        {
            address: '0x1d4fb9bfa1967be6ca74819e28b98c2aa5ae8b59',
            decimals: 9,
            symbol: 'NEIREI',
        },
        {
            address: '0x8a4bdd0133ab210c7dfe83a8c3824701c772c10f',
            decimals: 9,
            symbol: 'SATO',
        },
        {
            address: '0x48f5a8274ccae3b5ff42689024454b6f0d393ab4',
            decimals: 9,
            symbol: 'ITO',
        },
        {
            address: '0x0958d25520a49449106f6658434e53c231bdeaf4',
            decimals: 9,
            symbol: 'SATO',
        },
        {
            address: '0x61f053aa2e7726a4cbabc28ed5dde2a6919c2d58',
            decimals: 9,
            symbol: 'NEIRO2.0',
        },
        {
            address: '0xf4c492cbc2e73b251042264faa953c8c7a53c1a2',
            decimals: 9,
            symbol: 'KEN',
        },
        {
            address: '0x2024b207e7aa9d8e31de1fa2203eda3da35e484f',
            decimals: 9,
            symbol: 'AZALEA',
        },
        {
            address: '0xe636f94a71ec52cc61ef21787ae351ad832347b7',
            decimals: 18,
            symbol: 'CREO',
        },
        {
            address: '0x7316d973b0269863bbfed87302e11334e25ea565',
            decimals: 9,
            symbol: 'KEN',
        },
        {
            address: '0x7a55d2222d9138018ffdad69ffc3ebdb1c22dbab',
            decimals: 9,
            symbol: 'COLON',
        },
        {
            address: '0xde8ae95b1763d8fd23bd37d0eb30116ac60b0116',
            decimals: 18,
            symbol: 'XRPEPE',
        },
        {
            address: '0x7d4a7be025652995364e0e232063abd9e8d65e6e',
            decimals: 18,
            symbol: 'MONOPOLY',
        },
        {
            address: '0x283344eea472f0fe04d6f722595a2fffefe1901a',
            decimals: 13,
            symbol: 'CODE',
        },
        {
            address: '0xdade98c0ee0e729988fd87c9ffa6cba57635259e',
            decimals: 18,
            symbol: 'NEIRA',
        },
        {
            address: '0x8bcda22d51785a5540129feb90d47cb279826478',
            decimals: 9,
            symbol: 'ITO',
        },
        {
            address: '0x94ba38535f192cc1255736245dc3817369c4e18d',
            decimals: 9,
            symbol: 'LILY',
        },
        {
            address: '0xae6863bdded0638db6d2687b7105e014be53d1bf',
            decimals: 9,
            symbol: 'UKYO',
        },
        {
            address: '0xbbb79fa0a0cae499df090f253223a4c99fea33cc',
            decimals: 9,
            symbol: 'MIMI',
        },
        {
            address: '0x7777cec341e7434126864195adef9b05dcc3489c',
            decimals: 18,
            symbol: 'ONI',
        },
        {
            address: '0x393bf304dd474f48210f5ce741f19a2a851703ca',
            decimals: 18,
            symbol: 'BALL',
        },
        {
            address: '0x0b9c432bc6107f2992c43042d631682afcaf7a56',
            decimals: 9,
            symbol: 'MEIRO',
        },
        {
            address: '0xf9f3c901ccd97e0a9456849333094e7bf8543f58',
            decimals: 9,
            symbol: 'NEINEI',
        },
        {
            address: '0x810387d0cee0f693c3df8c25e0282d07a9a7c0a4',
            decimals: 9,
            symbol: 'Azalea',
        },
        {
            address: '0xa3c5f50deb5b23267e7752fcafaa04f42fb0eea4',
            decimals: 9,
            symbol: 'ASTRA',
        },
        {
            address: '0xd8adceefc97621a7085aec3c420a1cf3a37ac26a',
            decimals: 18,
            symbol: 'ASTRA',
        },
        {
            address: '0x17da41776313e205b3355f6e69d193f1dd99e434',
            decimals: 9,
            symbol: 'TRUTH+',
        },
        {
            address: '0x3fe988741791957ce1049c54a99e9fa9830eeca5',
            decimals: 9,
            symbol: 'TRUTH+',
        },
        {
            address: '0x94aad11f1e7ca2361156d6b0476a3b29b1836275',
            decimals: 18,
            symbol: 'CHIB',
        },
        {
            address: '0x04dff8a35bcb2b3539e27c85b58b5579c876028e',
            decimals: 18,
            symbol: 'KEPARAN',
        },
        {
            address: '0xde7d1492a9e22ce27c689d10caff5fea945d5b3a',
            decimals: 9,
            symbol: 'IZUMI',
        },
        {
            address: '0xa788cd7ade4a6ffdd98d1d1ccb77f4516bb0eaa9',
            decimals: 9,
            symbol: 'JEJE',
        },
        {
            address: '0x5114433bfe4d4c7cf4b5e99f79a5f31ce1b24062',
            decimals: 9,
            symbol: 'RIKOWAKO',
        },
        {
            address: '0x77791a1f85b8c67f17c43ba4a324f9bcd6e83113',
            decimals: 18,
            symbol: 'WAGMI',
        },
        {
            address: '0x65ac0d209356c419fe97589cfc894e11e22aacd9',
            decimals: 9,
            symbol: '$BALLTZE',
        },
        {
            address: '0xb929f141fcc789e69d583b1326d5b7a797ce22a9',
            decimals: 9,
            symbol: 'MAMA',
        },
        {
            address: '0xf93434b39f9f50516baa5b2fb81430a9bdd56ec3',
            decimals: 9,
            symbol: 'TOASTY',
        },
        {
            address: '0x69420f9ae8e702e9128893519b67d0dff259ec69',
            decimals: 9,
            symbol: 'SPEPE',
        },
        {
            address: '0x1fdb29ad49330b07ae5a87483f598aa6b292039e',
            decimals: 18,
            symbol: 'LTD',
        },
        {
            address: '0xda0c0d0a0ff8262f3ee9ee8a712b988df897be65',
            decimals: 9,
            symbol: 'WLF',
        },
        {
            address: '0xb7109df1a93f8fe2b8162c6207c9b846c1c68090',
            decimals: 18,
            symbol: 'MAX',
        },
        {
            address: '0x0255d663191e4d9bcd77ddeeab63f3dd4dc5dd96',
            decimals: 9,
            symbol: 'ELONTRUMP',
        },
        {
            address: '0x1001271083c249bd771e1bb76c22d935809a61ee',
            decimals: 9,
            symbol: 'FUKU',
        },
        {
            address: '0x9aa4751195e48ac3c15587c2ed02385e2f8100c1',
            decimals: 9,
            symbol: 'HACHI',
        },
        {
            address: '0x28ae4a13de3055a557f900e2e5307da4ea5761bb',
            decimals: 9,
            symbol: 'RTR',
        },
        {
            address: '0x6a159543abfc7baf816fdbc99efd48e4ee7acc63',
            decimals: 9,
            symbol: 'FUKU',
        },
        {
            address: '0x100891bf73ba8274c234aa34621bc626ed6eca8e',
            decimals: 9,
            symbol: 'HACHI',
        },
        {
            address: '0x934ac3ffdc82a3abcc71c1831bdf5c766f6ee8a9',
            decimals: 8,
            symbol: 'WX',
        },
        {
            address: '0x2bd1f344a2398340c2b1119da98816ea723f5f0f',
            decimals: 6,
            symbol: 'ROME',
        },
        {
            address: '0x39636b82c7d2e703baa093ef195ee5af81535954',
            decimals: 9,
            symbol: 'BONE',
        },
        {
            address: '0x8e42fe26fc1697f57076c9f2a8d1ff69cf7f6fda',
            decimals: 9,
            symbol: 'AGURI',
        },
        {
            address: '0x97b094e7485ab21f473ada183e96b362ba91a136',
            decimals: 9,
            symbol: 'AGURI',
        },
        {
            address: '0x420692f3f9d82341809fc2d0f3fb4a7664201f8f',
            decimals: 9,
            symbol: 'MASARU',
        },
        {
            address: '0x9a1d4f11428dc5a78558dac54b4d5daee6a30787',
            decimals: 18,
            symbol: 'wFUKU',
        },
        {
            address: '0xf84a4ab89ac8b5b55d891795258fe8b1aa420ccd',
            decimals: 9,
            symbol: 'AZALEA',
        },
        {
            address: '0x96a5399d07896f757bd4c6ef56461f58db951862',
            decimals: 18,
            symbol: 'DRAGONX',
        },
        {
            address: '0x53229609f907be495704fca99ad0835c5f3abd3a',
            decimals: 9,
            symbol: 'RINTARO',
        },
        {
            address: '0xd223a9e25c34bdf0339caa62b28b1e005081e1e7',
            decimals: 18,
            symbol: 'TrumpX',
        },
        {
            address: '0xeda7d2c70cd75d06947b7d0b0b0910ca9b07148a',
            decimals: 9,
            symbol: 'GATSBY',
        },
        {
            address: '0x4c02adc6165fa1f83556f202225faa87dffa822c',
            decimals: 18,
            symbol: 'USA',
        },
        {
            address: '0x30fffd4f8d8c2f09e0362e7a9eecff810ae2d4f3',
            decimals: 18,
            symbol: 'YEAH',
        },
        {
            address: '0x935eccc20a89e5745a2b0a1f5dc37430d3f00000',
            decimals: 18,
            symbol: 'SU',
        },
        {
            address: '0xed89fc0f41d8be2c98b13b7e3cd3e876d73f1d30',
            decimals: 9,
            symbol: 'GOU',
        },
        {
            address: '0x5de758bba013e58dae2693aea3f0b12b31a3023d',
            decimals: 18,
            symbol: 'SATO',
        },
        {
            address: '0x16c0829dd60124f2a7d49a5e768f7978a57c2393',
            decimals: 9,
            symbol: 'TOUSAN',
        },
        {
            address: '0x6f7977ad0d71e89a70e70816dd7a04928c9ece99',
            decimals: 9,
            symbol: 'USNEIRO',
        },
        {
            address: '0x215a29f7104fa675e2f46b8997fee6e0f50985ec',
            decimals: 9,
            symbol: 'GEN',
        },
        {
            address: '0xf34ca6b7fe3d6b1c8635a6bf2bd7bdd252f16426',
            decimals: 18,
            symbol: 'SNTZL',
        },
        {
            address: '0x9c9293f0ad42ae8f6f53c812f274ef91f7941026',
            decimals: 9,
            symbol: 'GROK3',
        },
        {
            address: '0xcbde0453d4e7d748077c1b0ac2216c011dd2f406',
            decimals: 9,
            symbol: 'TERMINUS',
        },
        {
            address: '0xd09eb9099fac55edcbf4965e0a866779ca365a0c',
            decimals: 9,
            symbol: 'COLON',
        },
        {
            address: '0x32f411f32dd14f142c087062335032f89bdecb0e',
            decimals: 9,
            symbol: 'SATO',
        },
        {
            address: '0x9e31337b49d57701940eb12e32c91658b6fd97b0',
            decimals: 18,
            symbol: 'GRACIE',
        },
        {
            address: '0xdd4017c1da32d91a09927609ad5c14bbfa25e0ab',
            decimals: 9,
            symbol: 'GRACIE',
        },
        {
            address: '0xbf3548d61d4dc57702f9898523b916074bb41a51',
            decimals: 9,
            symbol: 'PAGER',
        },
        {
            address: '0x9d1b70baebb6e13ce32b42f1ea3a37fd0607491c',
            decimals: 9,
            symbol: 'SAKURA',
        },
        {
            address: '0x100db67f41a2df3c32cc7c0955694b98339b7311',
            decimals: 18,
            symbol: 'MONEY',
        },
        {
            address: '0x7e21c12eb03a0d235d6c513762050e9f58828eca',
            decimals: 9,
            symbol: 'COLON',
        },
        {
            address: '0x7a2db92624fc80116cc209c9662ee2baa8adbeb1',
            decimals: 18,
            symbol: 'BabyNeiro',
        },
        {
            address: '0xf211b655431c10e72c1caeae37688ae9f7f7a549',
            decimals: 18,
            symbol: 'MAGA',
        },
        {
            address: '0x9999999840065a79d3a20575450eaa57b6a515fc',
            decimals: 9,
            symbol: 'BALLTZE',
        },
        {
            address: '0x58aea10748a00d1781d6651f9d78a414ea32ca46',
            decimals: 18,
            symbol: 'VSG',
        },
        {
            address: '0xcc54ac31164b5b3c39db4eef26d89275c468ec9d',
            decimals: 18,
            symbol: 'FUELX',
        },
        {
            address: '0x1121acc14c63f3c872bfca497d10926a6098aac5',
            decimals: 18,
            symbol: 'DOGE',
        },
        {
            address: '0x4c323732ef1d03a2b816f30d608019a5aaec0e83',
            decimals: 9,
            symbol: '$VENOM',
        },
        {
            address: '0x2019c2b166f30637d4c396c549f22d55b44de68f',
            decimals: 18,
            symbol: 'NYAN',
        },
        {
            address: '0x164ef8c38148d995571e69475cb71f67e4018667',
            decimals: 9,
            symbol: '$DOGE',
        },
        {
            address: '0x81fcc294d91bd8ffc8a822d7df0e2fd2f8526c39',
            decimals: 9,
            symbol: 'DOGE',
        },
        {
            address: '0x699d92ee97deeaffcf3f723a436bfaa29a264169',
            decimals: 18,
            symbol: 'YEPE',
        },
        {
            address: '0xaa6624d7363ef8284aa8ce4e18146ded5f421b2c',
            decimals: 18,
            symbol: '0dog',
        },
        {
            address: '0x901a020915bc3577d85d29f68024b4c5e240b8cd',
            decimals: 18,
            symbol: 'BLASTUP',
        },
        {
            address: '0xb17e388add8a7d057d0da853a2c28f7ec50bdb59',
            decimals: 9,
            symbol: 'BULL',
        },
        {
            address: '0x8cc439728de71e55cfa5ef9642aef1681219faeb',
            decimals: 9,
            symbol: 'BULL',
        },
        {
            address: '0x1d77c7d39212088b14671598222db6ef2f6af482',
            decimals: 9,
            symbol: 'BULL',
        },
        {
            address: '0x71297312753ea7a2570a5a3278ed70d9a75f4f44',
            decimals: 9,
            symbol: 'EBULL',
        },
        {
            address: '0x95f5670994960e041fd186bb1caa51c78c1a7fa8',
            decimals: 9,
            symbol: 'MONA',
        },
        {
            address: '0xa0be76135289aeb5781923ee0d47ca5527821f59',
            decimals: 18,
            symbol: 'HYDX',
        },
        {
            address: '0x6bd38fec6b121615cb6f202aa0a2d7b31c4d46a9',
            decimals: 9,
            symbol: '$ETHBULL',
        },
        {
            address: '0x427a13b9b28e912563774ef6772952e352cdcb80',
            decimals: 9,
            symbol: 'TTC',
        },
        {
            address: '0xffff894cb5c3d63ac2e021c68b21bab29fc1d154',
            decimals: 18,
            symbol: 'BLIND',
        },
        {
            address: '0x4c1b1302220d7de5c22b495e78b72f2dd2457d45',
            decimals: 9,
            symbol: 'BUFFI',
        },
        {
            address: '0x34404ae656603bd42ecf30b9aa8d2ce6434f6cfb',
            decimals: 9,
            symbol: 'BIGDOG',
        },
        {
            address: '0xa37b60b872d3bb34da661df0a9929f0f2d819229',
            decimals: 9,
            symbol: 'SONY',
        },
        {
            address: '0x78ecae7ec0ab4507e259ebb0a8c38e3a1e79fa61',
            decimals: 18,
            symbol: 'WLF',
        },
        {
            address: '0x870e184b7fb15a902dc9a93beb03c15a65977918',
            decimals: 9,
            symbol: 'LESLIE',
        },
        {
            address: '0x4c98c4626aabe18fb875b73e33e504497081bce7',
            decimals: 9,
            symbol: 'CASPER',
        },
        {
            address: '0x051fb509e4a775fabd257611eea1efaed8f91359',
            decimals: 9,
            symbol: 'CATE',
        },
        {
            address: '0x181f2cbda1ad44de56baacbb41c8fe448a2036fe',
            decimals: 18,
            symbol: 'WIWI',
        },
        {
            address: '0xbf8f582abfd701999d9fa822edd9a52a3d4f212d',
            decimals: 9,
            symbol: 'FREEPAVEL',
        },
        {
            address: '0xf17e65822b568b3903685a7c9f496cf7656cc6c2',
            decimals: 18,
            symbol: 'BICO',
        },
        {
            address: '0xba3335588d9403515223f109edc4eb7269a9ab5d',
            decimals: 18,
            symbol: 'GEAR',
        },
        {
            address: '0x9ab7bb7fdc60f4357ecfef43986818a2a3569c62',
            decimals: 18,
            symbol: 'GOG',
        },
        {
            address: '0xed35af169af46a02ee13b9d79eb57d6d68c1749e',
            decimals: 18,
            symbol: 'OMI',
        },
        {
            address: '0xfaba6f8e4a5e8ab82f62fe7c39859fa577269be3',
            decimals: 18,
            symbol: 'ONDO',
        },
        {
            address: '0xc98d64da73a6616c42117b582e832812e7b8d57f',
            decimals: 18,
            symbol: 'RSS3',
        },
        {
            address: '0x37f04733c7e1c762f0ed86533c9052be5822c1fd',
            decimals: 18,
            symbol: 'ETHM',
        },
        {
            address: '0xb4b9dc1c77bdbb135ea907fd5a08094d98883a35',
            decimals: 18,
            symbol: 'SWEAT',
        },
        {
            address: '0xb0ffa8000886e57f86dd5264b9582b2ad87b2b91',
            decimals: 18,
            symbol: 'W',
        },
        {
            address: '0x2a79324c19ef2b89ea98b23bc669b7e7c9f8a517',
            decimals: 8,
            symbol: 'WAXP',
        },
        {
            address: '0xc71b5f631354be6853efe9c3ab6b9590f8302e81',
            decimals: 18,
            symbol: 'ZK',
        },
        {
            address: '0x44108f0223a3c3028f5fe7aec7f9bb2e66bef82f',
            decimals: 18,
            symbol: 'ACX',
        },
        {
            address: '0xb1f1ee126e9c96231cc3d3fad7c08b4cf873b1f1',
            decimals: 18,
            symbol: 'BIFI',
        },
        {
            address: '0xae12c5930881c53715b369cec7606b70d8eb229f',
            decimals: 18,
            symbol: 'C98',
        },
        {
            address: '0x14778860e937f509e651192a90589de711fb88a9',
            decimals: 18,
            symbol: 'CYBER',
        },
        {
            address: '0x8f693ca8d21b157107184d29d398a8d082b38b76',
            decimals: 18,
            symbol: 'DATA',
        },
        {
            address: '0xe002bb309ee695c312bde293e29bd6ffe7de2d2b',
            decimals: 18,
            symbol: 'MAHA',
        },
        {
            address: '0xabd4c63d2616a5201454168269031355f4764337',
            decimals: 18,
            symbol: 'ORDER',
        },
        {
            address: '0x4b9278b94a1112cad404048903b8d343a810b07e',
            decimals: 18,
            symbol: 'HIFI',
        },
        {
            address: '0xac8bfbd2f99d6320977d6b08da38cfb9033e446e',
            decimals: 9,
            symbol: 'LESLIE',
        },
        {
            address: '0x6033f7f88332b8db6ad452b7c6d5bb643990ae3f',
            decimals: 18,
            symbol: 'LSK',
        },
        {
            address: '0x50f5fbb7697e7b975a1ab71875d52843afcc8cd2',
            decimals: 9,
            symbol: '$SAVEAMERICA',
        },
        {
            address: '0x36e66fbbce51e4cd5bd3c62b637eb411b18949d4',
            decimals: 18,
            symbol: 'OMNI',
        },
        {
            address: '0x0d3cbed3f69ee050668adf3d9ea57241cba33a2b',
            decimals: 18,
            symbol: 'PDA',
        },
        {
            address: '0x1bbe973bef3a977fc51cbed703e8ffdefe001fed',
            decimals: 18,
            symbol: 'PORTAL',
        },
        {
            address: '0x3b50805453023a91a8bf641e279401a0b23fa6f9',
            decimals: 18,
            symbol: 'REZ',
        },
        {
            address: '0xa62cc35625b0c8dc1faea39d33625bb4c15bd71c',
            decimals: 18,
            symbol: 'STMX',
        },
        {
            address: '0x888888848b652b3e3a0f34c96e00eec0f3a23f72',
            decimals: 4,
            symbol: 'TLM',
        },
        {
            address: '0x5ecaf4aadd8317d515d7345c46e242526b099151',
            decimals: 9,
            symbol: 'BOE',
        },
        {
            address: '0x3567aa22cd3ab9aef23d7e18ee0d7cf16974d7e6',
            decimals: 18,
            symbol: 'SAI',
        },
        {
            address: '0x03d7cd9b3016a44ab469c4ad0b3d551586b3d40a',
            decimals: 9,
            symbol: 'Brandy',
        },
        {
            address: '0xc328a59e7321747aebbc49fd28d1b32c1af8d3b2',
            decimals: 18,
            symbol: 'PHIL',
        },
        {
            address: '0xd7cfdb3cdc33dbeb9e9a4c95b61953cf12a008b3',
            decimals: 18,
            symbol: 'BRUH',
        },
        {
            address: '0x8457ca5040ad67fdebbcc8edce889a335bc0fbfb',
            decimals: 18,
            symbol: 'ALT',
        },
        {
            address: '0xa2120b9e674d3fc3875f415a7df52e382f141225',
            decimals: 18,
            symbol: 'ATA',
        },
        {
            address: '0x467719ad09025fcc6cf6f8311755809d45a5e5f3',
            decimals: 6,
            symbol: 'AXL',
        },
        {
            address: '0xc03fbf20a586fa89c2a5f6f941458e1fbc40c661',
            decimals: 18,
            symbol: 'COMBO',
        },
        {
            address: '0xe3c408bd53c31c085a1746af401a4042954ff740',
            decimals: 8,
            symbol: 'GMT',
        },
        {
            address: '0x3429d03c6f7521aec737a0bbf2e5ddcef2c3ae31',
            decimals: 18,
            symbol: 'PIXEL',
        },
        {
            address: '0x42069cac25603823aaf2bbcdd73449e535459bef',
            decimals: 9,
            symbol: 'QUAKK',
        },
        {
            address: '0x4f4e65339ae6ec09fb3441bbf765728cfd660244',
            decimals: 18,
            symbol: 'EXEX',
        },
        {
            address: '0x43d89a8c2f177df730c48dcc4882561bdbc0e512',
            decimals: 9,
            symbol: 'BRO',
        },
        {
            address: '0x52e6654aee5d59e13ae30b48f8f5dbeb97f708cd',
            decimals: 9,
            symbol: 'TSUJI',
        },
        {
            address: '0x5c3ed5d0a8b0871c075b124368155ae9e9142da0',
            decimals: 18,
            symbol: 'LEE',
        },
        {
            address: '0x63647852688d39fcd8429e5fca7080b25c532e1a',
            decimals: 9,
            symbol: '$FEPE',
        },
        {
            address: '0xaaaaaab7bcabd9c3997b5ba86c0937e037b0a6a3',
            decimals: 9,
            symbol: 'NUKI',
        },
        {
            address: '0xa6422e3e219ee6d4c1b18895275fe43556fd50ed',
            decimals: 18,
            symbol: 'STBU',
        },
        {
            address: '0x916a977ddee2c5c2711132f73e2a09e175eb49ce',
            decimals: 9,
            symbol: 'FLOPPY',
        },
        {
            address: '0xdc035d45d973e3ec169d2276ddab16f1e407384f',
            decimals: 18,
            symbol: 'USDS',
        },
        {
            address: '0x56072c95faa701256059aa122697b133aded9279',
            decimals: 18,
            symbol: 'SKY',
        },
        {
            address: '0xcb76314c2540199f4b844d4ebbc7998c604880ca',
            decimals: 18,
            symbol: 'BERRY',
        },
        {
            address: '0x88ce174c655b6d11210a069b2c106632dabdb068',
            decimals: 18,
            symbol: 'YAWN',
        },
        {
            address: '0xbc68ff3b062bc588603d71ec8d4273391edf152c',
            decimals: 18,
            symbol: 'OWCT',
        },
        {
            address: '0x15700b564ca08d9439c58ca5053166e8317aa138',
            decimals: 18,
            symbol: 'deUSD',
        },
        {
            address: '0x88022b7c8a397e1ef19a804e79d05b813b26f5ec',
            decimals: 9,
            symbol: 'WLFI',
        },
        {
            address: '0xec9333e7dadeebf82d290d6cb12e66cc30ce46b0',
            decimals: 18,
            symbol: 'LUSH',
        },
        {
            address: '0xcf01a5c02c9b9dd5bf73a5a56bcdbc9dca483d43',
            decimals: 18,
            symbol: 'TRUMP',
        },
        {
            address: '0xaaadcebe202a4ceb6f7e98164e84733586e66eda',
            decimals: 18,
            symbol: 'rpmm',
        },
        {
            address: '0x282db8ffed4515dae295a69a9b48e6d9fa2e5167',
            decimals: 9,
            symbol: 'STEVE',
        },
        {
            address: '0x46fdcddfad7c72a621e8298d231033cc00e067c6',
            decimals: 18,
            symbol: 'D.O.G.E',
        },
        {
            address: '0x0138fc6dec93cce7f4d5411b179bd5d99f3b72be',
            decimals: 18,
            symbol: 'DGE',
        },
        {
            address: '0x0ccf34d2233e5c203b7047aa57be82eea985d128',
            decimals: 18,
            symbol: 'D.O.G.E.',
        },
        {
            address: '0x9f278dc799bbc61ecb8e5fb8035cbfa29803623b',
            decimals: 18,
            symbol: 'BDX',
        },
        {
            address: '0xdb04fb08378129621634c151e9b61fef56947920',
            decimals: 18,
            symbol: 'LGNDX',
        },
        {
            address: '0xa00453052a36d43a99ac1ca145dfe4a952ca33b8',
            decimals: 9,
            symbol: 'CATE',
        },
        {
            address: '0xf9ab46d11728f3d973495afd6fb52cb63e755f4a',
            decimals: 9,
            symbol: 'DOGEFATHER',
        },
        {
            address: '0x23446eb2ed02ef76fe8ea249aab5701356ad2974',
            decimals: 9,
            symbol: 'MAGGY',
        },
        {
            address: '0x14442ff3e7c4fc549f27c87031a2035c6cf5e75b',
            decimals: 9,
            symbol: 'WOW',
        },
        {
            address: '0xf280b16ef293d8e534e370794ef26bf312694126',
            decimals: 9,
            symbol: 'ASTEROID',
        },
        {
            address: '0xcb4427d5a75defae1c606f4fa2af25c9c88c8cf1',
            decimals: 9,
            symbol: 'ITO',
        },
        {
            address: '0xb72e76ccf005313868db7b48070901a44629da98',
            decimals: 9,
            symbol: 'SQGROW',
        },
        {
            address: '0x69d0981fadffd225b93936d7436a412fa9821652',
            decimals: 18,
            symbol: 'POPO',
        },
        {
            address: '0x880226cbcce551eeafd18c9a9e883c85811b82fc',
            decimals: 9,
            symbol: 'TRUMP2024',
        },
        {
            address: '0xe49829a21adf5832585a3663fe6361c8ef0c3ce8',
            decimals: 9,
            symbol: 'WLFI',
        },
        {
            address: '0x70ef0df8b656403fc8c632c52661f19fc9934471',
            decimals: 18,
            symbol: 'SKULL',
        },
        {
            address: '0x88888e9c4984cfbe675fd066f2a87c697a8d7606',
            decimals: 9,
            symbol: 'DEV',
        },
        {
            address: '0xc0cfbe1602dd586349f60e4681bf4badca584ec9',
            decimals: 9,
            symbol: 'E',
        },
        {
            address: '0x05aa4817c17825281474ae2ee1ca492b89a16bce',
            decimals: 18,
            symbol: 'POPCAT',
        },
        {
            address: '0xd09e5d8607f2541e13c3f014c360f0ee2a25eb80',
            decimals: 9,
            symbol: 'DOGE',
        },
        {
            address: '0x8baf5d75cae25c7df6d1e0d26c52d19ee848301a',
            decimals: 18,
            symbol: 'CATALORIAN',
        },
        {
            address: '0x07bf2cc7e965d061ec3a408980d89f3e322d33b8',
            decimals: 18,
            symbol: 'CATALORIAN',
        },
        {
            address: '0x7391425ca7cee3ee03e09794b819291a572af83e',
            decimals: 18,
            symbol: 'MOG',
        },
        {
            address: '0x5ba4e34575771a5120cd90572f6f35fc9ae37452',
            decimals: 9,
            symbol: 'TrumpPets',
        },
        {
            address: '0xc8a0b32af6207bf022d9c5a1bf5787b236b01cdf',
            decimals: 9,
            symbol: 'FLOSSIE',
        },
        {
            address: '0xc9bd9b4f5e96644b9c5c525e99f655ff31ce5ce6',
            decimals: 9,
            symbol: 'WLFI',
        },
        {
            address: '0x4a4db86b80364ebcf33d862162b3ef08852468ad',
            decimals: 18,
            symbol: 'JACK',
        },
        {
            address: '0x28561b8a2360f463011c16b6cc0b0cbef8dbbcad',
            decimals: 9,
            symbol: 'MOODENG',
        },
        {
            address: '0xcbb7c0000ab88b473b1f5afd9ef808440eed33bf',
            decimals: 8,
            symbol: 'cbBTC',
        },
        {
            address: '0x5ee10a3b9be20a610aa99b30fb941e6879bf25c3',
            decimals: 9,
            symbol: 'DOPE',
        },
        {
            address: '0x6666fabe117c637d1bb2472ab0f23dfa4abfe712',
            decimals: 9,
            symbol: 'GIKO',
        },
        {
            address: '0x2f588f093e18b999741239432a58fc6bca7c7030',
            decimals: 9,
            symbol: 'GEN',
        },
        {
            address: '0x2cf0493eaf67e5dcd65e26b7204e440123252c85',
            decimals: 18,
            symbol: 'DINGER',
        },
        {
            address: '0x696733ce8f387c7a648443d9e21c6c1ee8519b94',
            decimals: 9,
            symbol: 'SUKI',
        },
        {
            address: '0x92d59efdb08664e1b2e3adcb5be7c9bb8e054232',
            decimals: 9,
            symbol: 'FIGHT',
        },
        {
            address: '0x32b77729cd87f1ef2bea4c650c16f89f08472c69',
            decimals: 18,
            symbol: 'BOX',
        },
        {
            address: '0xf3d1011496aed7ba7130972ff15f2c9ad0e8de4e',
            decimals: 9,
            symbol: 'BLINDSIGHT',
        },
        {
            address: '0x1bb4afbf2ce0c9ec86e6414ad4ba4d9aab1c0de4',
            decimals: 9,
            symbol: 'TORA',
        },
        {
            address: '0x04c293144acc45a19da9c2817c08d1352e5be70e',
            decimals: 9,
            symbol: 'MUGI',
        },
        {
            address: '0x4466ce2b0a25b68c241d881b9be10c700bd21bfe',
            decimals: 9,
            symbol: 'BORIS',
        },
        {
            address: '0x5fe73a15b09435f02c8967b9f8aa432d3549ddbe',
            decimals: 9,
            symbol: 'SON',
        },
        {
            address: '0x4298e4ad48be89bf63a6fdc470a4b4fe9ce633b1',
            decimals: 9,
            symbol: 'ESTEE',
        },
        {
            address: '0xdc90b2079f139ab14d98389dcfd044e360838eab',
            decimals: 9,
            symbol: 'deer',
        },
        {
            address: '0xa34215af6c049de266163af88fa0fef795dc311e',
            decimals: 9,
            symbol: 'NEILUO',
        },
        {
            address: '0x13063bed4bebbe542005e191c459d2cfa96b98e1',
            decimals: 9,
            symbol: 'IZUMI',
        },
        {
            address: '0xcf515fb84c02297391bf903d1e3ca39f75e519a0',
            decimals: 9,
            symbol: 'NEPE',
        },
        {
            address: '0x0c2e08e459fc43ddd1e2718c122f566473f59665',
            decimals: 9,
            symbol: 'BURGER',
        },
        {
            address: '0xbc9aec4b5f8677826a23117b6afd6e51dce48687',
            decimals: 18,
            symbol: 'SNAKE',
        },
        {
            address: '0x0ccae1bc46fb018dd396ed4c45565d4cb9d41098',
            decimals: 9,
            symbol: 'MISHA',
        },
        {
            address: '0x844b3a8167e90010a37e28f56874c8a715f90cf5',
            decimals: 9,
            symbol: '$Neirowif',
        },
        {
            address: '0x783f141d72cc9466eddf2d1ce5917aeb86a93d5c',
            decimals: 9,
            symbol: 'Boris',
        },
        {
            address: '0x4c553f8407209212e2725b986a065c67579fa4ca',
            decimals: 9,
            symbol: 'SASHA',
        },
        {
            address: '0x8bd8c3221f1476df7a058106f4ac0ac0e6397fb6',
            decimals: 9,
            symbol: 'BORIS',
        },
        {
            address: '0xe81c4a73bfddb1ddadf7d64734061be58d4c0b4c',
            decimals: 9,
            symbol: 'PESTO',
        },
        {
            address: '0xf25be332823b583d57cf05cd52a91f9bbd1a0b52',
            decimals: 9,
            symbol: 'EGOD',
        },
        {
            address: '0xea5fa7f2a95b3ad6bc5e1fbbf25d490472db4ade',
            decimals: 9,
            symbol: 'TRUMPE',
        },
        {
            address: '0xd96975d71568941915900ffb38fc31da3b61e410',
            decimals: 9,
            symbol: 'TECHNOKING',
        },
        {
            address: '0x5972169d49654dda92af57d11d4362fa72c15b03',
            decimals: 18,
            symbol: 'ZGEN',
        },
        {
            address: '0x240cd7b53d364a208ed41f8ced4965d11f571b7a',
            decimals: 9,
            symbol: 'DOGGO',
        },
        {
            address: '0x3abe404faa776d2a833d554a068ef1a58193f080',
            decimals: 9,
            symbol: 'KOZUE',
        },
        {
            address: '0x164d82afcc76287b5c1b291bffbfc3b8c0328799',
            decimals: 18,
            symbol: 'SHIBBO',
        },
        {
            address: '0x5ba5e84dc581edd60c7cb60c535be74a2c14a235',
            decimals: 18,
            symbol: 'GOOFY',
        },
        {
            address: '0x1dfe5988a77f3b10b06d355377abe779357500c4',
            decimals: 9,
            symbol: '$NEIRO',
        },
        {
            address: '0x92136516c42edbd732d2b6358ae1d3d7a5730daa',
            decimals: 9,
            symbol: 'MOOTOON',
        },
        {
            address: '0x1fdc01b71ac66a3a7de9e0f803480239f55a4ab7',
            decimals: 9,
            symbol: 'MOOCHI',
        },
        {
            address: '0x153ee06692fbdad4f868ef2e22737edf2c1b5c1a',
            decimals: 9,
            symbol: 'MONKEY',
        },
        {
            address: '0x70009029702e05c590863168629bc165a8439d0f',
            decimals: 9,
            symbol: 'TERMINUS',
        },
        {
            address: '0xa16927c7b9bafd7b6ddcaa73531b62e5b6fceeef',
            decimals: 9,
            symbol: 'KOTETSU',
        },
        {
            address: '0x7113a7166ab233eb0601b5ff982af8753b99a732',
            decimals: 9,
            symbol: 'TRUMP',
        },
        {
            address: '0x51aab1956062b1431805b8fa3cfa0a5aeb250836',
            decimals: 9,
            symbol: 'TRUMPCOINS',
        },
        {
            address: '0x224f261a4ec1c7562cca756985f05514c4364e3f',
            decimals: 9,
            symbol: 'DOUGHE',
        },
        {
            address: '0x6c38f26eaee4e1bdf7d2b4d42467b7a8a6082f5a',
            decimals: 9,
            symbol: 'SHIRO',
        },
        {
            address: '0xbb493890c5a30a047576f9114081cb65038c651c',
            decimals: 18,
            symbol: 'BOOB',
        },
        {
            address: '0x0f7fc7761d5b32496fbdfe2945c563cd3b1274d5',
            decimals: 9,
            symbol: 'CyberCab',
        },
        {
            address: '0x2224f1ef81a6ffe11c4f2c754f16e46076d66ecb',
            decimals: 9,
            symbol: 'Martians',
        },
        {
            address: '0xce927e2602dbe2e1d7488e589065282d512040bb',
            decimals: 9,
            symbol: 'DOGES',
        },
        {
            address: '0x11aad11873f8e3aa8ee33cc3ff66e06ffd901ee0',
            decimals: 9,
            symbol: 'MRAT',
        },
        {
            address: '0x786f112c9a6bc840cdc07cfd840105efd6ef2d4b',
            decimals: 9,
            symbol: 'EDOGE',
        },
        {
            address: '0x690420ff54bebbfd4c395a5c0de17633e8071ebe',
            decimals: 9,
            symbol: 'TOMATO',
        },
        {
            address: '0x0786aee2f6c9d25b9d158820a0c6d156ee72d21a',
            decimals: 9,
            symbol: 'EPANDA',
        },
        {
            address: '0x23a291bd9f273770b718d4b68d1e2c530f2f3672',
            decimals: 9,
            symbol: 'CDOGE',
        },
        {
            address: '0x1ce0ec13a0bca8a563ad9eef0a83f32b284c5188',
            decimals: 9,
            symbol: 'WINTER',
        },
        {
            address: '0x66666ff663dc1111a03ce253c272187d524bafa1',
            decimals: 9,
            symbol: 'ELESLIE',
        },
        {
            address: '0x3524ecb3e960cabd3accfb2231b40dc7504dc84f',
            decimals: 9,
            symbol: 'HEART',
        },
        {
            address: '0x70c29e99ca32592c0e88bb571b87444bb0e08e33',
            decimals: 9,
            symbol: 'MARVIN',
        },
        {
            address: '0x083a951ad1239ce35eb777664266d010f97bf1fc',
            decimals: 9,
            symbol: 'RUBBY',
        },
        {
            address: '0x05a0afe09a8dcd253e2531137b761084baedb71b',
            decimals: 9,
            symbol: 'eBUFF',
        },
        {
            address: '0x7afba6310f9c5b7e36b25986becb9f783e5b8c02',
            decimals: 18,
            symbol: 'LIBERTAD',
        },
        {
            address: '0x2e8f3ebc2aacc6df50823da82fc63b253a2272d1',
            decimals: 18,
            symbol: 'KERMIT',
        },
        {
            address: '0x8c013ea608c7853404eb8db78f2696f8b68e4ab5',
            decimals: 6,
            symbol: 'WIT',
        },
        {
            address: '0xa6929ee106f91f56628a959416002667a1bc344c',
            decimals: 9,
            symbol: 'BDoggo',
        },
        {
            address: '0xff284f2e8cce4cd2f4537d8a9369482b545908fb',
            decimals: 9,
            symbol: 'NODE',
        },
        {
            address: '0xb3912b20b3abc78c15e85e13ec0bf334fbb924f7',
            decimals: 9,
            symbol: 'HANA',
        },
        {
            address: '0x6008f4f4ae5df289323c1c4eef7e5a04c595366c',
            decimals: 9,
            symbol: 'Delphi',
        },
        {
            address: '0x72195b35511b83b7fc2f2b968a43d66d5df04fb7',
            decimals: 9,
            symbol: 'SDOGE',
        },
        {
            address: '0xb8d6196d71cdd7d90a053a7769a077772aaac464',
            decimals: 9,
            symbol: 'MARS',
        },
        {
            address: '0x00445d24c2bcd04c97d7defff9dae00854303f18',
            decimals: 9,
            symbol: 'MOOWAAN',
        },
        {
            address: '0x355c46eebbcbe1fc2844ade63ee565204addd37c',
            decimals: 9,
            symbol: 'URANUS',
        },
        {
            address: '0x339058ca41e17b55b6dd295373c5d3cbe8000cd9',
            decimals: 18,
            symbol: 'NEIRO',
        },
        {
            address: '0xb5b13753260a7784fe9f050b164e9f2d1d373ac2',
            decimals: 9,
            symbol: 'LESLIE',
        },
        {
            address: '0x643beef07d7aa57a9733503eee2da5f4efd04179',
            decimals: 18,
            symbol: 'LGCYX',
        },
        {
            address: '0x89d119f468e1abcdc42d62b92da37dd1f087ae9e',
            decimals: 9,
            symbol: 'JONA',
        },
        {
            address: '0xd537e3fc08f6d966a0f024c924f358fb15ed2dd9',
            decimals: 9,
            symbol: 'UHOSU',
        },
        {
            address: '0x71f68b5bdb0221639164647fbb34f3abe85eaf79',
            decimals: 9,
            symbol: 'MAO',
        },
        {
            address: '0x8ec5ee69878e791630ff798d4bcccac2a3a0060d',
            decimals: 18,
            symbol: 'KEN',
        },
        {
            address: '0x4207c3a6f819c45dab9f9a2740a97e56c3c877fb',
            decimals: 9,
            symbol: 'PHOBOS',
        },
        {
            address: '0x42069a030b0e3e83f80cceb10a52344518a11d95',
            decimals: 9,
            symbol: 'TARDIGRADES',
        },
        {
            address: '0xb9612ce2807de435a562b40a5ba9200ab86065e1',
            decimals: 9,
            symbol: 'FUUKA',
        },
        {
            address: '0x05f226755b11cb3666340551ebbaa615cdfefdd6',
            decimals: 18,
            symbol: 'MEME',
        },
        {
            address: '0x5c5b196abe0d54485975d1ec29617d42d9198326',
            decimals: 18,
            symbol: 'sdeUSD',
        },
        {
            address: '0xebb66a88cedd12bfe3a289df6dfee377f2963f12',
            decimals: 9,
            symbol: 'OSCAR',
        },
        {
            address: '0xefd6ea6df40c5f328cdc2f2f9d1cb68cc12b3356',
            decimals: 9,
            symbol: 'DIDDY',
        },
        {
            address: '0x322884d30b96220e4439a7fd7a0f0694014d2b51',
            decimals: 18,
            symbol: 'WR',
        },
        {
            address: '0x38c2a4a7330b22788374b8ff70bba513c8d848ca',
            decimals: 18,
            symbol: 'TRUF',
        },
        {
            address: '0xcc9d0f21d7cc189dfec6ab7e8e9df3a5a3caf637',
            decimals: 9,
            symbol: 'ROBOT',
        },
        {
            address: '0x81bf92803838431d35919a3c34e3e840358f6b00',
            decimals: 9,
            symbol: 'Maru',
        },
        {
            address: '0xed2d1ef84a6a07dd49e8ca934908e9de005b7824',
            decimals: 18,
            symbol: 'WICKED',
        },
        {
            address: '0x4444a0634b0829e0a38f59fe2cf2d5eb07748563',
            decimals: 9,
            symbol: 'CZ',
        },
        {
            address: '0x444456782a88d2c6abdec199118b770294644551',
            decimals: 9,
            symbol: 'Taylor',
        },
        {
            address: '0xc9a386d2b303621f40ae964b34d52bc105c4c2cb',
            decimals: 9,
            symbol: 'TOURBILLON',
        },
        {
            address: '0x242c1a66c1461f391eb6614312152a3830b1a35f',
            decimals: 9,
            symbol: 'CFA',
        },
        {
            address: '0xc8f69a9b46b235de8d0b77c355fff7994f1b090f',
            decimals: 18,
            symbol: '$SPEEDY',
        },
        {
            address: '0xc8f604f2376b7d284df65ee83dfa946223cd01c2',
            decimals: 9,
            symbol: 'MOOWAN',
        },
        {
            address: '0x76a30c79b0ef3c28913404531c0eaacb577ca1d1',
            decimals: 9,
            symbol: 'AZIZI',
        },
        {
            address: '0x038480645079e61b2852c04e1465da01928a6a20',
            decimals: 9,
            symbol: 'JOMA',
        },
        {
            address: '0x634769eb87542eaf41c0008c05d5d8f5d8bec3a5',
            decimals: 14,
            symbol: 'BOME',
        },
        {
            address: '0x6c8d8bea5607fb0d9c1d61b224c613328cca5e72',
            decimals: 9,
            symbol: 'SKUNK',
        },
        {
            address: '0x77b55e0388a1997cf91313f13697c9b7de487e5a',
            decimals: 9,
            symbol: 'MOOSE',
        },
        {
            address: '0x08d6e43e6ed0f1b13c477ac62ca98df866a187a2',
            decimals: 9,
            symbol: 'MOOSE',
        },
        {
            address: '0x7e331b55e4fbba7cb9c1fc855ed0dac2983e7798',
            decimals: 18,
            symbol: 'KOAI',
        },
        {
            address: '0x2bb84fd8f7ed0ffae3da36ad60d4d7840bdeeada',
            decimals: 18,
            symbol: 'GROK',
        },
        {
            address: '0xf4f27c583afdaacbbb669b162243209bd38286b3',
            decimals: 9,
            symbol: 'MATIC',
        },
        {
            address: '0xbcc14912eb50fe58bd22528458a03119a4b5dcdb',
            decimals: 18,
            symbol: 'Egorical',
        },
        {
            address: '0xf131c3646cffc8f43743cbb0528859bf03d436cf',
            decimals: 9,
            symbol: 'JONAH',
        },
        {
            address: '0x2de1218c31a04e1040fc5501b89e3a58793b3ddf',
            decimals: 18,
            symbol: '3AC',
        },
        {
            address: '0xc390db0f9efd65638d97105c2f9a4625bd742ca6',
            decimals: 18,
            symbol: 'kheowzoo',
        },
        {
            address: '0xaa7cccd79b4af66a11451bfa9305e7a584915e7b',
            decimals: 9,
            symbol: 'MOODENG',
        },
        {
            address: '0x11099821b900ff7d3a0dbeecdae4e90aee2eeadf',
            decimals: 6,
            symbol: 'NSA',
        },
        {
            address: '0x9a594f5ed8d119b73525dfe23adbceca77fd828d',
            decimals: 18,
            symbol: 'triangle',
        },
        {
            address: '0x0da2082905583cedfffd4847879d0f1cf3d25c36',
            decimals: 9,
            symbol: 'melo',
        },
        {
            address: '0x52fcf6928206705da7b4c836baa234abca2126fd',
            decimals: 9,
            symbol: 'MELO',
        },
        {
            address: '0x604ee97148ca9fe372b355ebe66e588654b5d023',
            decimals: 9,
            symbol: 'QUANTUM',
        },
        {
            address: '0x9b69667f602f15ef2d09a9a18489c788e327461e',
            decimals: 18,
            symbol: 'DOGS',
        },
        {
            address: '0xf5e63b4c9db61c35bb66462745f9a5e64604f0a9',
            decimals: 9,
            symbol: 'LAPUTA',
        },
        {
            address: '0x76ee1d6815235e41ceb7050710180ead5614672d',
            decimals: 8,
            symbol: 'ATH',
        },
        {
            address: '0x5981e98440e41fa993b26912b080922b8ed023c3',
            decimals: 18,
            symbol: 'MIHARU',
        },
        {
            address: '0x08495023d2d331c61195a47f0143ed4c43544ca0',
            decimals: 9,
            symbol: 'Archangel',
        },
        {
            address: '0xec12e2d7acd850fe3953d1dbf860f523914654a7',
            decimals: 18,
            symbol: '$MIRX',
        },
        {
            address: '0x968496dd59efc1caa11e94fda99ea67db7be5cd9',
            decimals: 18,
            symbol: 'DJT',
        },
        {
            address: '0x6969e5cfe7578ac5f06d313c1a25578927a5bbc9',
            decimals: 18,
            symbol: 'MORTI',
        },
        {
            address: '0x9cdf242ef7975d8c68d5c1f5b6905801699b1940',
            decimals: 18,
            symbol: 'WHITE',
        },
        {
            address: '0x1f2eb4440b8b3a4f7cef742ad731ca4f64c10278',
            decimals: 9,
            symbol: 'Azizi',
        },
        {
            address: '0x615987d46003cc37387dbe544ff4f16fa1200077',
            decimals: 9,
            symbol: 'NASDAQ420',
        },
        {
            address: '0x32b7fe111fcd329719deadaaab1905fa0476f9f4',
            decimals: 18,
            symbol: 'MOOSE',
        },
        {
            address: '0x3f66ae0c8e9fb57f661af4ba8c8445d36ec5d7f7',
            decimals: 18,
            symbol: 'CRAI',
        },
        {
            address: '0x4200c75077123bdd21f5303db16dc8baf7ab5307',
            decimals: 18,
            symbol: 'NASDAQ',
        },
        {
            address: '0x88888e06cf146107ae349e46f03dc09c27d60124',
            decimals: 9,
            symbol: 'LLAMA',
        },
        {
            address: '0x513349f8e49f46488f2bed248e956eb308cd5286',
            decimals: 9,
            symbol: 'PAWPEI',
        },
        {
            address: '0x7afd0d633e0a2b1db97506d97cadc880c894eca9',
            decimals: 9,
            symbol: 'MARU',
        },
        {
            address: '0xabd61a7ce5d387dcb03fa61aeb533c5ade24cf24',
            decimals: 9,
            symbol: 'QUANT',
        },
        {
            address: '0x4e6221c07dae8d3460a46fa01779cf17fdd72ad8',
            decimals: 9,
            symbol: 'POCHITA',
        },
        {
            address: '0x6969f3a3754ab674b48b7829a8572360e98132ba',
            decimals: 9,
            symbol: 'IZZY',
        },
        {
            address: '0x960dc6b91acedf3cb986893278fd43e27f5c95a7',
            decimals: 9,
            symbol: 'Muffin',
        },
        {
            address: '0xede738d071de2d52330f22404152aaa90e06aa63',
            decimals: 9,
            symbol: 'Ratty',
        },
        {
            address: '0xae85c48e04503fd8fc4e71dc87377b9bf4d7bde4',
            decimals: 9,
            symbol: 'VAGINA',
        },
        {
            address: '0xe93d1847a49b31c9708da0b66a5da78eb6b32611',
            decimals: 18,
            symbol: 'Atlas',
        },
        {
            address: '0x888c1a341ce9d9ae9c2d2a75a72a7f0d2551a2dc',
            decimals: 18,
            symbol: 'CSI',
        },
        {
            address: '0x7940d3d7eb6251fab1c4f02480bc558897c10844',
            decimals: 9,
            symbol: 'GPTPUP',
        },
        {
            address: '0x666666229a42b27364b3cafbf010554d41d84b3e',
            decimals: 9,
            symbol: 'Manyu',
        },
        {
            address: '0xe07b1aaff54e5b90096862888b0629036f584078',
            decimals: 9,
            symbol: 'LABUBU',
        },
        {
            address: '0x6942054f63750d6ee90387a84dd04c35a42330eb',
            decimals: 9,
            symbol: 'MELLOW',
        },
        {
            address: '0xc4027b9bf9a21cda5a03b6bb55d428d6d71638b9',
            decimals: 9,
            symbol: 'DOOGLE',
        },
        {
            address: '0x103143acf2e717acf8f021823e86a1dbfe944fb5',
            decimals: 9,
            symbol: 'CHEESEBALL',
        },
        {
            address: '0x5a12975bf0158c9c3b23622f44917d113f31842d',
            decimals: 9,
            symbol: 'KOMA',
        },
        {
            address: '0x69002bbe1e8e09f53374a8daf0e38dde61d77421',
            decimals: 9,
            symbol: 'DJIA',
        },
        {
            address: '0x14a6a478d00190a0fe0313723fd61975c985f2f3',
            decimals: 9,
            symbol: 'PDX',
        },
        {
            address: '0x96da47466cb83ed7c9f1c72fd46d170e876c8166',
            decimals: 18,
            symbol: 'ECASH',
        },
        {
            address: '0x93c2bd80cadcfeb541eb5af4052375bde8d6f24f',
            decimals: 18,
            symbol: 'SASHA',
        },
        {
            address: '0x7342af7ee22721a093359bbde57829712a4bd502',
            decimals: 9,
            symbol: 'SUGARBEAR',
        },
        {
            address: '0x4f87eff4f27be1b72bf03098630cc6fd9a4ac41d',
            decimals: 18,
            symbol: 'SATOSHI',
        },
        {
            address: '0x124386504d774979e1e9d2d19c6188391d7af8e3',
            decimals: 9,
            symbol: 'Hanabi',
        },
        {
            address: '0x49aac74491a4f5dc9463a85c434011b04464d418',
            decimals: 9,
            symbol: 'TCATI',
        },
        {
            address: '0xf4020e7b15c1e4f8e9ab14ce380926159dd02d15',
            decimals: 9,
            symbol: 'YUMI',
        },
        {
            address: '0xe5201e7e22cd7b1139d8b7f7df1d55facbce7c9a',
            decimals: 9,
            symbol: 'POPCAT',
        },
        {
            address: '0xd096947f98170ca412cfc033bab8bca27208decb',
            decimals: 9,
            symbol: 'WALTER',
        },
        {
            address: '0x2597342ff387b63846eb456419590781c4bfcdaf',
            decimals: 18,
            symbol: 'TAXI',
        },
        {
            address: '0x2cb84df2b7d1b4bd66f523fc43c0bf79edbf66c7',
            decimals: 18,
            symbol: 'CHDR',
        },
        {
            address: '0x119800a925217ba9a2d656e868483a050c2f919f',
            decimals: 9,
            symbol: 'ROBOTAXI',
        },
        {
            address: '0xb78398125f15227d977d78c094a872eb1a53de7a',
            decimals: 9,
            symbol: 'BabyMooDeng',
        },
        {
            address: '0x2bc46eb4ae80ddd9c8a6e064c74327c8244d88e2',
            decimals: 18,
            symbol: 'SVM',
        },
        {
            address: '0x9156b634fd5ca84e019fe00978358ac17c6fddc0',
            decimals: 9,
            symbol: 'Moodeng2.0',
        },
        {
            address: '0x69000f9c5790ff4403da64e6698acf864f285307',
            decimals: 9,
            symbol: 'KRX',
        },
        {
            address: '0x1634e10c9155be623b5a52d6ca01c7a904d89b0a',
            decimals: 18,
            symbol: 'FINE',
        },
        {
            address: '0x2bcbec0296cddda988ea88031e43fe247fa6d341',
            decimals: 9,
            symbol: 'MOOTUN',
        },
        {
            address: '0x6900f7b42fb4abb615c938db6a26d73a9afbed69',
            decimals: 18,
            symbol: 'DXY',
        },
        {
            address: '0xea0b4dee5e451b0f5ea65feb4a768f4024a35b6e',
            decimals: 9,
            symbol: 'PAC',
        },
        {
            address: '0xa5d366887c57a2791839286c3778d33a4b9b61d3',
            decimals: 9,
            symbol: 'BMONEY',
        },
        {
            address: '0x42069026eac8eee0fd9b5f7adfa4f6e6d69a2b39',
            decimals: 9,
            symbol: 'MSTR',
        },
        {
            address: '0x7e7ef0ee0305c1c195fcae22fd7b207a813eef86',
            decimals: 9,
            symbol: 'FIONA',
        },
        {
            address: '0xf54a37595e16ca6f4f6ca742f29dbebfec737fc3',
            decimals: 18,
            symbol: 'NEKON',
        },
        {
            address: '0x9e1ba99cef30b229621f4dc1e9c8cf808cc67e6b',
            decimals: 9,
            symbol: 'EMMY',
        },
        {
            address: '0x89c1da46d692d09814a88a27270d0dca21e4734d',
            decimals: 10,
            symbol: 'GM',
        },
        {
            address: '0x6532b3f1e4dbff542fbd6befe5ed7041c10b385a',
            decimals: 18,
            symbol: 'TINC',
        },
        {
            address: '0x06c84db1f9899e1203ef3c9f05b2300ba47e4023',
            decimals: 18,
            symbol: 'BB',
        },
        {
            address: '0x677354f7f6310489a732b90d2f283065b51b18e5',
            decimals: 9,
            symbol: 'DMT',
        },
        {
            address: '0x6e48507d9c6a280c521aaaef6060dda91635c6e4',
            decimals: 18,
            symbol: 'YAHA',
        },
        {
            address: '0x72310ba7a303951e7834266125bdd99f821e5f76',
            decimals: 9,
            symbol: 'NexFundAI',
        },
        {
            address: '0x616254b3c79639f89e756495ac687735b27b5e17',
            decimals: 18,
            symbol: 'RINO',
        },
        {
            address: '0xe52e5a00100538f9c43980717129d8c516fbef85',
            decimals: 18,
            symbol: 'NexF',
        },
        {
            address: '0xb612bfc5ce2fb1337bd29f5af24ca85dbb181ce2',
            decimals: 9,
            symbol: 'KLAUS',
        },
        {
            address: '0xba4816e34f4f0a95b0a4ec78a7b99d5d08562fe6',
            decimals: 9,
            symbol: '$DELPHI',
        },
        {
            address: '0xa5c45d48d36607741e90c0cca29545a46f5ee121',
            decimals: 9,
            symbol: 'CHIB',
        },
        {
            address: '0x355a393dc7990123f481f16adacfe9a017039f81',
            decimals: 9,
            symbol: 'JeffCoin',
        },
        {
            address: '0x02dcf420fe0bc0b3e02425f781a9f61ce0264b5b',
            decimals: 9,
            symbol: 'EATH',
        },
        {
            address: '0x15bf7e046e56a211ba17e6b98713b524d229dc5b',
            decimals: 9,
            symbol: 'LUPE',
        },
        {
            address: '0x6fcc900fe0dfa101526fe257e3e4a6293442d601',
            decimals: 9,
            symbol: 'MARUD',
        },
        {
            address: '0xa7f4195f10f1a62b102bd683eab131d657a6c6e4',
            decimals: 18,
            symbol: '$MBAG',
        },
        {
            address: '0x420690b6158ba4a4c9d8d6a4355308d7a54c625a',
            decimals: 9,
            symbol: 'BLK',
        },
        {
            address: '0xad86b91a1d1db15a4cd34d0634bbd4ecacb5b61a',
            decimals: 18,
            symbol: 'Daram',
        },
        {
            address: '0xa3bc09171c009f05df7f0b8aaa818ee42d8a91bc',
            decimals: 9,
            symbol: 'TSLA',
        },
        {
            address: '0x690031313d70c2545357f4487c6a3f134c434507',
            decimals: 9,
            symbol: 'QQQ',
        },
        {
            address: '0xee3f7083f0a29820f80b75bca47f825937e8568f',
            decimals: 18,
            symbol: 'KERMIT',
        },
        {
            address: '0xda4da6dc1dca253621a371ee2788951c90a9f117',
            decimals: 9,
            symbol: 'DOGIMUS',
        },
        {
            address: '0x6900e38a307cd4207e025a6ac7bdda62e86f0765',
            decimals: 9,
            symbol: 'BTC',
        },
        {
            address: '0x5950a5fb85eebf62d86a332854d201db719942ce',
            decimals: 9,
            symbol: 'ETH6900',
        },
        {
            address: '0x864cb5194722d5a1596f4be8b899916d30dad8d8',
            decimals: 18,
            symbol: 'DOG',
        },
        {
            address: '0x11a7c8c9e9d5fc47134c305c59cebfcd1a4a9943',
            decimals: 18,
            symbol: 'BOG',
        },
        {
            address: '0xe2cfd7a01ec63875cd9da6c7c1b7025166c2fa2f',
            decimals: 18,
            symbol: 'HYPER',
        },
        {
            address: '0x2614f29c39de46468a921fd0b41fdd99a01f2edf',
            decimals: 18,
            symbol: 'HLX',
        },
        {
            address: '0x00f116ac0c304c570daaa68fa6c30a86a04b5c5f',
            decimals: 18,
            symbol: 'INF',
        },
        {
            address: '0xcc7ed2ab6c3396ddbc4316d2d7c1b59ff9d2091f',
            decimals: 18,
            symbol: 'HYDRA',
        },
        {
            address: '0xa99afcc6aa4530d01dfff8e55ec66e4c424c048c',
            decimals: 18,
            symbol: 'AWX',
        },
        {
            address: '0xbfde5ac4f5adb419a931a5bf64b0f3bb5a623d06',
            decimals: 18,
            symbol: 'FLUX',
        },
        {
            address: '0x66b5228cfd34d9f4d9f03188d67816286c7c0b74',
            decimals: 18,
            symbol: 'VOLT',
        },
        {
            address: '0x690000781d1051eb8b2f439307a0614292d641dc',
            decimals: 9,
            symbol: 'SEX',
        },
        {
            address: '0x74ab072c91bf33479f959ce70561e785fd7391fd',
            decimals: 9,
            symbol: 'GBTC6900',
        },
        {
            address: '0x5200b34e6a519f289f5258de4554ebd3db12e822',
            decimals: 9,
            symbol: 'GOAT',
        },
        {
            address: '0x3d2c4f3789010a8c8d4b5bb566e5d0a91ffb8c3d',
            decimals: 9,
            symbol: 'CULT',
        },
        {
            address: '0x58128c9e1bb31d8c39162ae6521698ca52cd3f24',
            decimals: 9,
            symbol: 'MARIE',
        },
        {
            address: '0x846e57af29fd21391919318a044191b8725822c2',
            decimals: 9,
            symbol: 'ETHARDIO',
        },
        {
            address: '0x168168db04def453b7e8bfaff1e0102a3e810485',
            decimals: 10,
            symbol: 'LABUBU',
        },
        {
            address: '0x0e5ab05d86f03997e2de83764d013e0ea050bded',
            decimals: 9,
            symbol: '$BNB6900',
        },
        {
            address: '0xaaee85310ea1c7136eb1aa436f2a6a963be6e617',
            decimals: 9,
            symbol: 'JOYCAT',
        },
        {
            address: '0x66f85e3865d0cfdc009acf6280a8621f12e46ccf',
            decimals: 9,
            symbol: 'WLFI',
        },
        {
            address: '0x532472fa72b16cb38c365eb4c71f70ca8888b87f',
            decimals: 9,
            symbol: '$LESLIE',
        },
        {
            address: '0x50894d1fac57263f952165e43834a8ea74839fa4',
            decimals: 9,
            symbol: '$BODC',
        },
        {
            address: '0xb53f56aee2807de9c98fd0e761dd079fa75e288a',
            decimals: 18,
            symbol: 'NWIF',
        },
        {
            address: '0x237fb57bfa305f22fc76b216ab4027a8723cfd1a',
            decimals: 9,
            symbol: 'GARY000',
        },
        {
            address: '0x335bbe02dd578ce8edfe7b23af1283dc116ff6d7',
            decimals: 9,
            symbol: 'TYO',
        },
        {
            address: '0x4a7c9897ae01ff08d6e3820507a6b967bdbffa29',
            decimals: 18,
            symbol: 'WIZARD',
        },
        {
            address: '0x723abbea6e985fb21c57f550d9cceba1c676a6a9',
            decimals: 9,
            symbol: 'SCF',
        },
        {
            address: '0xe34ba9cbdf45c9d5dcc80e96424337365b6fe889',
            decimals: 9,
            symbol: 'MEDUSA',
        },
        {
            address: '0xaee5913ffd19dbca4fd1ef6f3925ed0414407d37',
            decimals: 18,
            symbol: 'YLAY',
        },
        {
            address: '0x4f987b0774e2b72ed731fef6993398ab364c1c64',
            decimals: 9,
            symbol: 'BLINKY',
        },
        {
            address: '0x7076de6ff1d91e00be7e92458089c833de99e22e',
            decimals: 9,
            symbol: 'BONE',
        },
        {
            address: '0x54509debeb87bcb3db955dd5b090fd618a334586',
            decimals: 9,
            symbol: 'GSI',
        },
        {
            address: '0xad0d02c564a87e48d06dc77d4f636a237ef290a3',
            decimals: 9,
            symbol: 'MEDUSA',
        },
        {
            address: '0xb3e41d6e0ea14b43bc5de3c314a408af171b03dd',
            decimals: 9,
            symbol: 'KABOSU',
        },
        {
            address: '0x4278a8944cf63753b13e9f726bbc1192412988d8',
            decimals: 18,
            symbol: '1984',
        },
        {
            address: '0xcc03674d4d39b99644fd2702a3a579148cda34f6',
            decimals: 9,
            symbol: 'CLANKER',
        },
        {
            address: '0xb3c1ae75ecd1d18d78c96d43954c525de0a5ad37',
            decimals: 9,
            symbol: 'PEPECULT',
        },
        {
            address: '0xfc0700bb2b1f46ef2affcca504aebc2670851453',
            decimals: 9,
            symbol: 'FRY',
        },
        {
            address: '0x2e4b4e75dbffa2bdcfed02f4ad1b8265b971014d',
            decimals: 9,
            symbol: 'BSPX',
        },
        {
            address: '0x69420d861b6dde76bb541b61a13222b4e904f8d0',
            decimals: 9,
            symbol: 'Remilia',
        },
        {
            address: '0x3e9c3dc19efe4271d1a65facfca55906045f7b08',
            decimals: 18,
            symbol: 'Frogs',
        },
        {
            address: '0xda2e903b0b67f30bf26bd3464f9ee1a383bbbe5f',
            decimals: 18,
            symbol: 'MAGA',
        },
        {
            address: '0xa6afb62a7e2ed8d66223493481e9fb2f64e7e850',
            decimals: 9,
            symbol: 'WLFI',
        },
        {
            address: '0xd3c5bdbc6de5ea3899a28f6cd419f29c09fa749f',
            decimals: 9,
            symbol: 'SANIN',
        },
        {
            address: '0xbfad028a7a4c9a47e619ba1f4d2ed6b963e3f256',
            decimals: 9,
            symbol: 'ELEPHANT',
        },
        {
            address: '0x306f140e0b8b2427214ca16e8603e9069c3c3431',
            decimals: 9,
            symbol: 'BOSE',
        },
        {
            address: '0x5f030b4c85c2751ac50591e2f058871c5cab8754',
            decimals: 9,
            symbol: 'STORK',
        },
        {
            address: '0x303c89f3a4a58872d8b6a3e64c14fdd9ec669c99',
            decimals: 18,
            symbol: 'BabyNeiro',
        },
        {
            address: '0x11a001dc777f5bf8a5d63f246664d3bb67be496c',
            decimals: 9,
            symbol: 'OGGIE',
        },
        {
            address: '0x70574bb88d2280f104875325e579790f9f5e33db',
            decimals: 9,
            symbol: 'MVGGA',
        },
        {
            address: '0x6f46c8888d5b594d90626043234547b4f31d4d20',
            decimals: 9,
            symbol: '$SANSHU',
        },
        {
            address: '0xfbb4f63821e706daf801e440a5893be59094f5cc',
            decimals: 18,
            symbol: 'FBB4',
        },
        {
            address: '0xca7940ff16ca177108cc5a9180bdde417c4d2c12',
            decimals: 18,
            symbol: 'EETH',
        },
        {
            address: '0x83c4845a1aa9142d9801352506f40d352878bea7',
            decimals: 9,
            symbol: 'TRUMP',
        },
        {
            address: '0x41c6fefbd85a7b90f42c183e6d63a65ff7e35a60',
            decimals: 18,
            symbol: 'SOLIS',
        },
        {
            address: '0x7f774112a18240fbedb4ead938c66b6f51496e89',
            decimals: 9,
            symbol: 'LAMDUAN',
        },
        {
            address: '0x7ce89243cc0d9e746609c57845eccbd9bb4b7315',
            decimals: 18,
            symbol: 'LILY',
        },
        {
            address: '0x58e25a12e729d0f41674c8a17ac4e07220ce51cb',
            decimals: 18,
            symbol: 'PZINC',
        },
        {
            address: '0xe457eac017bfc604db8c1479b28913a1cadce045',
            decimals: 9,
            symbol: 'VETH',
        },
        {
            address: '0x4e09ac09eb332f4dd167b8bfb90c7f247f7350ac',
            decimals: 18,
            symbol: 'MIKO',
        },
        {
            address: '0xa73b792906c79509d73fdfaaa78561e195010706',
            decimals: 18,
            symbol: 'PIPO',
        },
        {
            address: '0x614b209a7bfc64e21957cfa9c4b958f9b1e606b2',
            decimals: 9,
            symbol: 'BTCRCG',
        },
        {
            address: '0xe0936bae275fed05a01a5bf3490e59e0756aecb1',
            decimals: 9,
            symbol: 'Joe',
        },
        {
            address: '0x555907a0b5c32df0feb35401187aed60a9191d74',
            decimals: 18,
            symbol: 'TRUMP',
        },
        {
            address: '0x1848f29450f2c867c70f14d95f0367b470e35117',
            decimals: 9,
            symbol: 'TDS',
        },
        {
            address: '0xf63e309818e4ea13782678ce6c31c1234fa61809',
            decimals: 8,
            symbol: 'JANET',
        },
        {
            address: '0xd0c3c9ff7e0176be0632d26df730da90707fc52e',
            decimals: 18,
            symbol: 'SAI',
        },
        {
            address: '0x2e16c912164b74830be850cce9af856797d21237',
            decimals: 9,
            symbol: 'WhyCat',
        },
        {
            address: '0xf7f3e16f1f44a7b05f830c9e1a88dec69da44e02',
            decimals: 9,
            symbol: 'TARDO',
        },
        {
            address: '0x48fd84c0dfc47f1b61ed6a86367895aaa6ad2a45',
            decimals: 18,
            symbol: 'TWIN',
        },
        {
            address: '0x0ad5a92a5d79a903b23823431cdb07650a5e4a44',
            decimals: 9,
            symbol: 'GRIMACE',
        },
        {
            address: '0xd536e7a9543cf9867a580b45cec7f748a1fe11ec',
            decimals: 18,
            symbol: 'ORX',
        },
        {
            address: '0x8808434a831efea81170a56a9ddc57cc9e6de1d8',
            decimals: 18,
            symbol: 'BORK',
        },
        {
            address: '0xbe6bbe4cbb5c8dbf0d244367085ef2104e6f4157',
            decimals: 9,
            symbol: 'TRUMPT',
        },
        {
            address: '0x880eeea0637f91bb259dfd7bb261638a42bddb25',
            decimals: 9,
            symbol: 'BIAI',
        },
        {
            address: '0xba2a3dad197d6fee75471215efd5c30c8c854e11',
            decimals: 9,
            symbol: 'BELLS',
        },
        {
            address: '0x3f10330e917661054d3e88db3b50b7eb363f0368',
            decimals: 9,
            symbol: 'FLIP',
        },
        {
            address: '0x68e686bc641605877ad72ff76a7047d7325d8d3e',
            decimals: 18,
            symbol: 'MOODENG',
        },
        {
            address: '0xc69dcf99ac392514a7d582c017f92b70fa0e4d99',
            decimals: 9,
            symbol: 'HABIBI',
        },
        {
            address: '0x00f5b16c8d28e20dac8674fc96b232b72c6c6cfa',
            decimals: 18,
            symbol: 'MARVIN',
        },
        {
            address: '0x5e7f6e008c6d9d7ad4c7eb75bd4ce62864cc7454',
            decimals: 18,
            symbol: 'tap',
        },
        {
            address: '0x968be3f7bfef0f8edc3c1ad90232ebb0da0867aa',
            decimals: 18,
            symbol: 'SWORLD',
        },
        {
            address: '0x230ea9aed5d08afdb22cd3c06c47cf24ad501301',
            decimals: 18,
            symbol: 'SPX2.0',
        },
        {
            address: '0xe9689028ede16c2fdfe3d11855d28f8e3fc452a3',
            decimals: 18,
            symbol: 'BUBBLE',
        },
        {
            address: '0xa2e2a4ecd9f909262cc8628e8db90f8f5802be81',
            decimals: 18,
            symbol: 'DogeX',
        },
        {
            address: '0x3a6aa190de2c0e1f64478dd406b619d970af8ac3',
            decimals: 9,
            symbol: '$MAGAAI',
        },
        {
            address: '0x5ff0d2de4cd862149c6672c99b7edf3b092667a3',
            decimals: 18,
            symbol: 'SPX',
        },
        {
            address: '0x440572d0f561bd6510b9aec993dd745c45f691ec',
            decimals: 9,
            symbol: '$ETHGOAT',
        },
        {
            address: '0xab73f2bb41aef52e864d9b8dddaeb3c7ecf01dd8',
            decimals: 0,
            symbol: 'EGO',
        },
        {
            address: '0x2ba995544aa11fba857b269769320eabea041d2c',
            decimals: 9,
            symbol: 'GPT2',
        },
        {
            address: '0x37d299d9900209c3566254cfe59bfe6ff8f8c295',
            decimals: 18,
            symbol: 'BITCOIN',
        },
        {
            address: '0xc70fc23336548318eceffe89bf6da4036ca5fb99',
            decimals: 18,
            symbol: 'Fartcoin',
        },
        {
            address: '0xa2eb7e59bdf9941ba47f64c8f68638c79a80374c',
            decimals: 9,
            symbol: 'KEK',
        },
        {
            address: '0x19b0d4c77809bf5f69a1efda498a86df4b43c345',
            decimals: 10,
            symbol: 'BATBOY',
        },
        {
            address: '0xd1fad600b2eb277521b12a95c7d1bd5d614c2fe5',
            decimals: 9,
            symbol: 'FART',
        },
        {
            address: '0x6fd46112c8ec76e7940dbfdc150774ee6eff27b2',
            decimals: 18,
            symbol: 'RUNNER',
        },
        {
            address: '0x0d90e00379379c4f11b31ccdda008113958bd28f',
            decimals: 9,
            symbol: 'CALCULUS',
        },
        {
            address: '0x69000e11c86b4f61dbefd7dbcffd1c53fcd506e4',
            decimals: 9,
            symbol: 'MSFT',
        },
        {
            address: '0xfa6485bc2454bc5819ed7e46e52a431be1568ae5',
            decimals: 18,
            symbol: 'Fritz',
        },
        {
            address: '0x690007e0ca76325083002face101d7d6fbaa2bcb',
            decimals: 9,
            symbol: '$MEGA6900',
        },
        {
            address: '0xefe54156e6dfb456e33ad7b2b9743df0f9221cfa',
            decimals: 9,
            symbol: 'AI',
        },
        {
            address: '0xd34ef3cc025c203ea1742ee076f0a0bb5a6f08b0',
            decimals: 9,
            symbol: 'BabySPX',
        },
        {
            address: '0x470005727a680b19efbaeb9fe070f844bf8b0694',
            decimals: 9,
            symbol: '$DJT4700',
        },
        {
            address: '0xcc42b2b6d90e3747c2b8e62581183a88e3ca093a',
            decimals: 18,
            symbol: 'LOTUS',
        },
        {
            address: '0xa80fe529f2ca9a5e9da75c7c62524203be615078',
            decimals: 9,
            symbol: 'Simpson',
        },
        {
            address: '0x1764c07922a66cabbc79f99ce71565ddf430bf58',
            decimals: 18,
            symbol: 'BARY',
        },
        {
            address: '0xba62856e16cb3283d3b8e670b196b9bb02902f30',
            decimals: 9,
            symbol: 'LUCE',
        },
        {
            address: '0x90e3532cf06d567ef7e6385be532311f10c30096',
            decimals: 18,
            symbol: 'RSP',
        },
        {
            address: '0x698b1d54e936b9f772b8f58447194bbc82ec1933',
            decimals: 9,
            symbol: 'PEEZY',
        },
        {
            address: '0xe95076d9fe7155c17b455ac49497e78912c4ab65',
            decimals: 6,
            symbol: 'DOLLAR',
        },
        {
            address: '0xc234cb1b59d12c0c2f0e984ee9112a6311b86223',
            decimals: 9,
            symbol: 'DJT',
        },
        {
            address: '0xbd06e63d717362b5a8ed9b9db21b67bbbf2f24fa',
            decimals: 9,
            symbol: 'BDOGE',
        },
        {
            address: '0xaf4144cd943ed5362fed2bae6573184659cbe6ff',
            decimals: 18,
            symbol: 'LIZ',
        },
        {
            address: '0x1defbae826f731fd4a48a38baecf13f505008e3b',
            decimals: 9,
            symbol: 'TSUMA',
        },
        {
            address: '0x4720241495bba450e0a46cecbf6d9840672bc845',
            decimals: 9,
            symbol: '$PDJT',
        },
        {
            address: '0x3bcdc80541e487de1a27359301f1c7d6e491eac9',
            decimals: 9,
            symbol: 'TREMP',
        },
        {
            address: '0xa0335820dc549dbfae5b8d691331cadfca7026e0',
            decimals: 18,
            symbol: 'SHIBA2',
        },
        {
            address: '0x0b498ff89709d3838a063f1dfa463091f9801c2b',
            decimals: 18,
            symbol: 'BTC2x-FLI',
        },
        {
            address: '0x4e9e4ab99cfc14b852f552f5fb3aa68617825b6c',
            decimals: 18,
            symbol: 'SLR',
        },
        {
            address: '0xb05097849bca421a3f51b249ba6cca4af4b97cb9',
            decimals: 18,
            symbol: 'FLOAT',
        },
        {
            address: '0x87c22615435998d69aca34889d03155b694a94fc',
            decimals: 18,
            symbol: 'DLB',
        },
        {
            address: '0x8a732bc91c33c167f868e0af7e6f31e0776d0f71',
            decimals: 18,
            symbol: 'LTK',
        },
        {
            address: '0xe9f84de264e91529af07fa2c746e934397810334',
            decimals: 18,
            symbol: 'SAK3',
        },
        {
            address: '0x0ec9f76202a7061eb9b3a7d6b59d36215a7e37da',
            decimals: 18,
            symbol: 'BPT',
        },
        {
            address: '0x9d409a0a012cfba9b15f6d4b36ac57a46966ab9a',
            decimals: 18,
            symbol: 'yvBOOST',
        },
        {
            address: '0xbd9908b0cdd50386f92efcc8e1d71766c2782df0',
            decimals: 18,
            symbol: 'RICE',
        },
        {
            address: '0x677ddbd918637e5f2c79e164d402454de7da8619',
            decimals: 18,
            symbol: 'VUSD',
        },
        {
            address: '0x62b9c7356a2dc64a1969e19c23e4f579f9810aa7',
            decimals: 18,
            symbol: 'cvxCRV',
        },
        {
            address: '0x307d45afbb7e84f82ef3d251a6bb0f00edf632e4',
            decimals: 18,
            symbol: 'PLA',
        },
        {
            address: '0xcb86c6a22cb56b6cf40cafedb06ba0df188a416e',
            decimals: 18,
            symbol: 'SURE',
        },
        {
            address: '0x0100546f2cd4c9d97f798ffc9755e47865ff7ee6',
            decimals: 18,
            symbol: 'alETH',
        },
        {
            address: '0x7995ab36bb307afa6a683c24a25d90dc1ea83566',
            decimals: 6,
            symbol: 'HIT',
        },
        {
            address: '0x5cb888182fbffdb62c08fb4b5a343914f00fdfee',
            decimals: 18,
            symbol: 'BiPS',
        },
        {
            address: '0x618679df9efcd19694bb1daa8d00718eacfa2883',
            decimals: 18,
            symbol: 'XYZ',
        },
        {
            address: '0x720cd16b011b987da3518fbf38c3071d4f0d1495',
            decimals: 8,
            symbol: 'FLUX',
        },
        {
            address: '0x81f8f0bb1cb2a06649e51913a151f0e7ef6fa321',
            decimals: 18,
            symbol: 'VITA',
        },
        {
            address: '0x69fa0fee221ad11012bab0fdb45d444d3d2ce71c',
            decimals: 18,
            symbol: 'XRUNE',
        },
        {
            address: '0xa80505c408c4defd9522981cd77e026f5a49fe63',
            decimals: 18,
            symbol: 'NEUY',
        },
        {
            address: '0x56ee175fe37cd461486ce3c3166e0cafccd9843f',
            decimals: 9,
            symbol: 'EWIT',
        },
        {
            address: '0x2af1df3ab0ab157e1e2ad8f88a7d04fbea0c7dc6',
            decimals: 18,
            symbol: 'BED',
        },
        {
            address: '0xc221b7e65ffc80de234bbb6667abdd46593d34f0',
            decimals: 18,
            symbol: 'wCFG',
        },
        {
            address: '0x961dd84059505d59f82ce4fb87d3c09bec65301d',
            decimals: 8,
            symbol: 'TXJP',
        },
        {
            address: '0x9ac07635ddbde5db18648c360defb00f5f22537e',
            decimals: 18,
            symbol: 'MOCA',
        },
        {
            address: '0x65fd1fb6f0728c2744c44b54ec98448b05271ccf',
            decimals: 18,
            symbol: 'DPCN',
        },
        {
            address: '0x4e38d89362f7e5db0096ce44ebd021c3962aa9a0',
            decimals: 18,
            symbol: 'UBQ',
        },
        {
            address: '0xdffa3a7f5b40789c7a437dbe7b31b47f9b08fe75',
            decimals: 18,
            symbol: 'HOODIE',
        },
        {
            address: '0x1559fa1b8f28238fd5d76d9f434ad86fd20d1559',
            decimals: 18,
            symbol: 'EDEN',
        },
        {
            address: '0x656c00e1bcd96f256f224ad9112ff426ef053733',
            decimals: 18,
            symbol: 'EFI',
        },
        {
            address: '0x3c4b6e6e1ea3d4863700d7f76b36b7f3d3f13e3d',
            decimals: 8,
            symbol: 'VGX',
        },
        {
            address: '0xa5ef74068d04ba0809b7379dd76af5ce34ab7c57',
            decimals: 18,
            symbol: 'LUCHOW',
        },
        {
            address: '0xdfdb7f72c1f195c5951a234e8db9806eb0635346',
            decimals: 18,
            symbol: 'NFD',
        },
        {
            address: '0xdb792b1d8869a7cfc34916d6c845ff05a7c9b789',
            decimals: 8,
            symbol: 'ccBCH',
        },
        {
            address: '0x232afce9f1b3aae7cb408e482e847250843db931',
            decimals: 18,
            symbol: 'SHARK',
        },
        {
            address: '0xf04af3f4e4929f7cd25a751e6149a3318373d4fe',
            decimals: 18,
            symbol: 'SPRING',
        },
        {
            address: '0x4c3bae16c79c30eeb1004fb03c878d89695e3a99',
            decimals: 18,
            symbol: 'AUTUMN',
        },
        {
            address: '0xccba0b2bc4babe4cbfb6bd2f1edc2a9e86b7845f',
            decimals: 18,
            symbol: 'WINTER',
        },
        {
            address: '0x15b7c0c907e4c6b9adaaaabc300c08991d6cea05',
            decimals: 18,
            symbol: 'GEL',
        },
        {
            address: '0x5dd57da40e6866c9fcc34f4b6ddc89f1ba740dfe',
            decimals: 18,
            symbol: 'BRIGHT',
        },
        {
            address: '0x4104b135dbc9609fc1a9490e61369036497660c8',
            decimals: 18,
            symbol: 'APW',
        },
        {
            address: '0x3a1bda28adb5b0a812a7cf10a1950c920f79bcd3',
            decimals: 18,
            symbol: 'FLP',
        },
        {
            address: '0xdb298285fe4c5410b05390ca80e8fbe9de1f259b',
            decimals: 18,
            symbol: 'FOREX',
        },
        {
            address: '0xfb782396c9b20e564a64896181c7ac8d8979d5f4',
            decimals: 18,
            symbol: 'DIVER',
        },
        {
            address: '0x9d09bcf1784ec43f025d3ee071e5b632679a01ba',
            decimals: 9,
            symbol: 'TEE',
        },
        {
            address: '0x04f2694c8fcee23e8fd0dfea1d4f5bb8c352111f',
            decimals: 9,
            symbol: 'sOHM',
        },
        {
            address: '0x5c1d9aa868a30795f92fae903edc9eff269044bf',
            decimals: 18,
            symbol: 'CNG',
        },
        {
            address: '0xe4f726adc8e89c6a6017f01eada77865db22da14',
            decimals: 18,
            symbol: 'BCP',
        },
        {
            address: '0x3231cb76718cdef2155fc47b5286d82e6eda273f',
            decimals: 18,
            symbol: 'EURe',
        },
        {
            address: '0x4c2e59d098df7b6cbae0848d66de2f8a4889b9c3',
            decimals: 18,
            symbol: 'FODL',
        },
        {
            address: '0xd3e4ba569045546d09cf021ecc5dfe42b1d7f6e4',
            decimals: 18,
            symbol: 'MNW',
        },
        {
            address: '0x7d647b1a0dcd5525e9c6b3d14be58f27674f8c95',
            decimals: 18,
            symbol: 'BYTES',
        },
        {
            address: '0x89020f0d5c5af4f3407eb5fe185416c457b0e93e',
            decimals: 18,
            symbol: 'EDN',
        },
        {
            address: '0xba8a621b4a54e61c442f5ec623687e2a942225ef',
            decimals: 18,
            symbol: 'QUARTZ',
        },
        {
            address: '0x05be1d4c307c19450a6fd7ce7307ce72a3829a60',
            decimals: 18,
            symbol: 'IMF',
        },
        {
            address: '0x96e61422b6a9ba0e068b6c5add4ffabc6a4aae27',
            decimals: 18,
            symbol: 'ibEUR',
        },
        {
            address: '0x1cc481ce2bd2ec7bf67d1be64d4878b16078f309',
            decimals: 18,
            symbol: 'ibCHF',
        },
        {
            address: '0xb8919522331c59f5c16bdfaa6a121a6e03a91f62',
            decimals: 6,
            symbol: 'HOME',
        },
        {
            address: '0x566957ef80f9fd5526cd2bef8be67035c0b81130',
            decimals: 6,
            symbol: 'USDC',
        },
        {
            address: '0x55af5865807b196bd0197e0902746f31fbccfa58',
            decimals: 18,
            symbol: 'BOO',
        },
        {
            address: '0x930059af3fd7f898623d9436cc7a85bce960e907',
            decimals: 9,
            symbol: 'GARBAGE',
        },
        {
            address: '0x9ad37205d608b8b219e6a2573f922094cec5c200',
            decimals: 18,
            symbol: 'iZi',
        },
        {
            address: '0x85f138bfee4ef8e540890cfb48f620571d67eda3',
            decimals: 18,
            symbol: 'WAVAX',
        },
        {
            address: '0xd3ba270f82cadabd0596d3d30233448621d561bb',
            decimals: 18,
            symbol: 'BAE',
        },
        {
            address: '0xed1480d12be41d92f36f5f7bdd88212e381a3677',
            decimals: 18,
            symbol: 'FDT',
        },
        {
            address: '0x662b67d00a13faf93254714dd601f5ed49ef2f51',
            decimals: 18,
            symbol: 'ORC',
        },
        {
            address: '0x8a7adc1b690e81c758f1bd0f72dfe27ae6ec56a5',
            decimals: 18,
            symbol: 'BLID',
        },
        {
            address: '0x5c147e74d63b1d31aa3fd78eb229b65161983b2b',
            decimals: 18,
            symbol: 'WFLOW',
        },
        {
            address: '0x0642026e7f0b6ccac5925b4e7fa61384250e1701',
            decimals: 18,
            symbol: 'H2O',
        },
        {
            address: '0x09f098b155d561fc9f7bccc97038b7e3d20baf74',
            decimals: 18,
            symbol: 'ZOO',
        },
        {
            address: '0xea61e434859a38614787317b17427d692864546b',
            decimals: 9,
            symbol: 'MAGAEAGLE',
        },
        {
            address: '0x1031240e8cb1afc8167cac65272cf1a98b77cdb4',
            decimals: 9,
            symbol: 'TRUMPKIN',
        },
        {
            address: '0x7f3141c4d6b047fb930991b450f1ed996a51cb26',
            decimals: 18,
            symbol: 'X',
        },
        {
            address: '0x7cfea0dd176651e7b5a1ced9c4faf8ee295315fd',
            decimals: 18,
            symbol: 'PRNT',
        },
        {
            address: '0x351caa9045d65107b9d311d922d15887cfd634e4',
            decimals: 18,
            symbol: 'ARW',
        },
        {
            address: '0x82081822932cf22e39d2fbec8047feb6117cd2f6',
            decimals: 18,
            symbol: 'SCLM',
        },
        {
            address: '0x4cff49d0a19ed6ff845a9122fa912abcfb1f68a6',
            decimals: 18,
            symbol: 'WTK',
        },
        {
            address: '0x5ca135cb8527d76e932f34b5145575f9d8cbe08e',
            decimals: 18,
            symbol: 'FPI',
        },
        {
            address: '0x5c6d51ecba4d8e4f20373e3ce96a62342b125d6d',
            decimals: 18,
            symbol: 'ELFI',
        },
        {
            address: '0x000000007a58f5f58e697e51ab0357bc9e260a04',
            decimals: 18,
            symbol: 'CNV',
        },
        {
            address: '0x9669890e48f330acd88b78d63e1a6b3482652cd9',
            decimals: 18,
            symbol: 'BCNT',
        },
        {
            address: '0x111111517e4929d3dcbdfa7cce55d30d4b6bc4d6',
            decimals: 18,
            symbol: 'ICHI',
        },
        {
            address: '0xc2544a32872a91f4a553b404c6950e89de901fdb',
            decimals: 18,
            symbol: 'FPIS',
        },
        {
            address: '0x95392f142af1c12f6e39897ff9b09c599666b50c',
            decimals: 18,
            symbol: 'BLOOD',
        },
        {
            address: '0x8d96b4ab6c741a4c8679ae323a100d74f085ba8f',
            decimals: 18,
            symbol: 'BZR',
        },
        {
            address: '0x987fd7ab5001f31a893b1f6e44c61e02ccc6c47d',
            decimals: 18,
            symbol: 'IP',
        },
        {
            address: '0xf5f06ffa53ad7f5914f493f16e57b56c8dd2ea80',
            decimals: 18,
            symbol: 'JELLY',
        },
        {
            address: '0xcb8fb2438a805664cd8c3e640b85ac473da5be87',
            decimals: 18,
            symbol: 'CTI',
        },
        {
            address: '0x31429d1856ad1377a8a0079410b297e1a9e214c2',
            decimals: 18,
            symbol: 'ANGLE',
        },
        {
            address: '0xea01906843ea8d910658a2c485ffce7c104ab2b6',
            decimals: 18,
            symbol: 'QTO',
        },
        {
            address: '0x0e84296da31b6c475afc1a991db05e79633e67b0',
            decimals: 6,
            symbol: '20SML025',
        },
        {
            address: '0xa6787bcba1d1775906a64799a60df7b8011f3f46',
            decimals: 18,
            symbol: 'KSTND',
        },
        {
            address: '0x0a6b44fbdbcb0eab3f9df418b76c71565a6f2ec0',
            decimals: 9,
            symbol: 'RALPH',
        },
        {
            address: '0x41545f8b9472d758bb669ed8eaeeecd7a9c4ec29',
            decimals: 18,
            symbol: 'FORT',
        },
        {
            address: '0xafcdd4f666c84fed1d8bd825aa762e3714f652c9',
            decimals: 18,
            symbol: 'VINU',
        },
        {
            address: '0xba485b556399123261a5f9c95d413b4f93107407',
            decimals: 18,
            symbol: 'graviAURA',
        },
        {
            address: '0x1487bd704fa05a222b0adb50dc420f001f003045',
            decimals: 18,
            symbol: 'CCDAO',
        },
        {
            address: '0x227c7df69d3ed1ae7574a1a7685fded90292eb48',
            decimals: 18,
            symbol: 'MILADY',
        },
        {
            address: '0x3540abe4f288b280a0740ad5121aec337c404d15',
            decimals: 18,
            symbol: 'TPRO',
        },
        {
            address: '0x1f2efab635ec3ec8618101103db4e1f718434a71',
            decimals: 18,
            symbol: 'PHUNKYSOCKS',
        },
        {
            address: '0xc55126051b22ebb829d00368f4b12bde432de5da',
            decimals: 18,
            symbol: 'BTRFLY',
        },
        {
            address: '0x2ebd53d035150f328bd754d6dc66b99b0edb89aa',
            decimals: 18,
            symbol: 'MET',
        },
        {
            address: '0x55c08ca52497e2f1534b59e2917bf524d4765257',
            decimals: 18,
            symbol: 'UwU',
        },
        {
            address: '0x6b32022693210cd2cfc466b9ac0085de8fc34ea6',
            decimals: 8,
            symbol: 'DECI',
        },
        {
            address: '0x6b0956258ff7bd7645aa35369b55b61b8e6d6140',
            decimals: 8,
            symbol: 'LUCKY',
        },
        {
            address: '0x6d614686550b9e1c1df4b2cd8f91c9d4df66c810',
            decimals: 18,
            symbol: 'SKEB',
        },
        {
            address: '0xb3ad645db386d7f6d753b2b9c3f4b853da6890b8',
            decimals: 18,
            symbol: 'CTR',
        },
        {
            address: '0x881ba05de1e78f549cc63a8f6cabb1d4ad32250d',
            decimals: 18,
            symbol: '00',
        },
        {
            address: '0x0ed7787b6f5ee00976fa376d04d5b835e48fc42b',
            decimals: 18,
            symbol: 'BTC',
        },
        {
            address: '0xb0b195aefa3650a6908f15cdac7d92f8a5791b0b',
            decimals: 18,
            symbol: 'BOB',
        },
        {
            address: '0x431d5dff03120afa4bdf332c61a6e1766ef37bdb',
            decimals: 18,
            symbol: 'JPYC',
        },
        {
            address: '0x783c68814126b66b9242c4c6538ae47db5e33169',
            decimals: 2,
            symbol: 'RODO',
        },
        {
            address: '0x43d4a3cd90ddd2f8f4f693170c9c8098163502ad',
            decimals: 18,
            symbol: 'D2D',
        },
        {
            address: '0x88800092ff476844f74dc2fc427974bbee2794ae',
            decimals: 18,
            symbol: 'WALLET',
        },
        {
            address: '0xce20bb92ccf9bbf5091ef85649e71e552819ad8c',
            decimals: 18,
            symbol: 'SMART',
        },
        {
            address: '0xe0bceef36f3a6efdd5eebfacd591423f8549b9d5',
            decimals: 18,
            symbol: 'FACTR',
        },
        {
            address: '0xcccd1ba9f7acd6117834e0d28f25645decb1736a',
            decimals: 18,
            symbol: 'ECOx',
        },
        {
            address: '0xa0ed3c520dc0632657ad2eaaf19e26c4fd431a84',
            decimals: 18,
            symbol: 'HPO',
        },
        {
            address: '0x23352036e911a22cfc692b5e2e196692658aded9',
            decimals: 18,
            symbol: 'FDZ',
        },
        {
            address: '0x2c5dd9b1442e68f47a181d9c5d5ee7a80a1bcc9c',
            decimals: 18,
            symbol: 'anti',
        },
        {
            address: '0x2297aebd383787a160dd0d9f71508148769342e3',
            decimals: 8,
            symbol: 'BTC.b',
        },
        {
            address: '0xac3e018457b222d93114458476f3e3416abbe38f',
            decimals: 18,
            symbol: 'sfrxETH',
        },
        {
            address: '0xc56c2b7e71b54d38aab6d52e94a04cbfa8f604fa',
            decimals: 6,
            symbol: 'ZUSD',
        },
        {
            address: '0xb113c6cf239f60d380359b762e95c13817275277',
            decimals: 6,
            symbol: 'BMEX',
        },
        {
            address: '0xc691bc298a304d591ad9b352c7a8d216de9f2ced',
            decimals: 18,
            symbol: 'POLA',
        },
        {
            address: '0xfc1c93a2507975e98b9d0e9260ded61a00152bf1',
            decimals: 18,
            symbol: 'NAVI',
        },
        {
            address: '0x7945b0a6674b175695e5d1d08ae1e6f13744abb0',
            decimals: 18,
            symbol: 'BaoUSD',
        },
        {
            address: '0xa95c5ebb86e0de73b4fb8c47a45b792cfea28c23',
            decimals: 18,
            symbol: 'SDL',
        },
        {
            address: '0xf9ca9523e5b5a42c3018c62b084db8543478c400',
            decimals: 18,
            symbol: 'LAKE',
        },
        {
            address: '0x5f36cd50215c024cff1df4086311db7c8afe0dc1',
            decimals: 18,
            symbol: 'PPLR',
        },
        {
            address: '0x8bb08042c06fa0fc26cd2474c5f0c03a1056ad2f',
            decimals: 18,
            symbol: 'CPI',
        },
        {
            address: '0xdf4ef6ee483953fe3b84abd08c6a060445c01170',
            decimals: 8,
            symbol: 'WACME',
        },
        {
            address: '0x2f131c4dad4be81683abb966b4de05a549144443',
            decimals: 18,
            symbol: 'DOODLE',
        },
        {
            address: '0x79650799e7899a802cb96c0bc33a6a8d4ce4936c',
            decimals: 18,
            symbol: 'AIT',
        },
        {
            address: '0x24c19f7101c1731b85f1127eaa0407732e36ecdd',
            decimals: 18,
            symbol: 'SGT',
        },
        {
            address: '0xfd0205066521550d7d7ab19da8f72bb004b4c341',
            decimals: 18,
            symbol: 'LIT',
        },
        {
            address: '0xbea269038eb75bdab47a9c04d0f5c572d94b93d5',
            decimals: 9,
            symbol: 'wFIO',
        },
        {
            address: '0x0ad896863ce4cd84f10a9d30d4f509ceffd53c84',
            decimals: 18,
            symbol: 'CLB',
        },
        {
            address: '0xb39185e33e8c28e0bb3dbbce24da5dea6379ae91',
            decimals: 18,
            symbol: 'PHUNK',
        },
        {
            address: '0xcdb37a4fbc2da5b78aa4e41a432792f9533e85cc',
            decimals: 18,
            symbol: 'CDT',
        },
        {
            address: '0xc8d9871a79551ab4439c9e08f12962e3785f0437',
            decimals: 18,
            symbol: 'COC',
        },
        {
            address: '0x18084fba666a33d37592fa2633fd49a74dd93a88',
            decimals: 18,
            symbol: 'tBTC',
        },
        {
            address: '0x6ab4ce36260f201e4e2391eca2fd7538f71e4131',
            decimals: 18,
            symbol: 'AI',
        },
        {
            address: '0x98585dfc8d9e7d48f0b1ae47ce33332cf4237d96',
            decimals: 18,
            symbol: 'NEWO',
        },
        {
            address: '0x207e14389183a94343942de7afbc607f57460618',
            decimals: 18,
            symbol: 'THOL',
        },
        {
            address: '0xb012be90957d70d9a070918027655f998c123a88',
            decimals: 18,
            symbol: 'HMX',
        },
        {
            address: '0xaaa9214f675316182eaa21c85f0ca99160cc3aaa',
            decimals: 18,
            symbol: 'QANX',
        },
        {
            address: '0xb10cc888cb2cce7036f4c7ecad8a57da16161338',
            decimals: 8,
            symbol: 'SWITCH',
        },
        {
            address: '0xda6a3876ad460194cd7ba28062d838c98ee2fd1d',
            decimals: 18,
            symbol: 'KEL',
        },
        {
            address: '0x7690202e2c2297bcd03664e31116d1dffe7e3b73',
            decimals: 18,
            symbol: 'boxETH',
        },
        {
            address: '0x8c1bed5b9a0928467c9b1341da1d7bd5e10b6549',
            decimals: 18,
            symbol: 'LsETH',
        },
        {
            address: '0xe8a3bf796ca5a13283ec6b1c5b645b91d7cfef5d',
            decimals: 18,
            symbol: 'ZVT',
        },
        {
            address: '0xb0ed33f79d89541dfdcb04a8f04bc2c6be025ecc',
            decimals: 18,
            symbol: 'ZERO',
        },
        {
            address: '0x02de007d412266a2e0fa9287c103474170f06560',
            decimals: 18,
            symbol: 'EXD',
        },
        {
            address: '0x669c01caf0edcad7c2b8dc771474ad937a7ca4af',
            decimals: 18,
            symbol: 'WMINIMA',
        },
        {
            address: '0xb5b1b659da79a2507c27aad509f15b4874edc0cc',
            decimals: 9,
            symbol: 'DUST',
        },
        {
            address: '0x9ce115f0341ae5dabc8b477b74e83db2018a6f42',
            decimals: 18,
            symbol: 'HAIR',
        },
        {
            address: '0x488db574c77dd27a07f9c97bac673bc8e9fc6bf3',
            decimals: 12,
            symbol: 'CARN',
        },
        {
            address: '0xddfbe9173c90deb428fdd494cb16125653172919',
            decimals: 18,
            symbol: 'SWK',
        },
        {
            address: '0xb755506531786c8ac63b756bab1ac387bacb0c04',
            decimals: 18,
            symbol: 'ZARP',
        },
        {
            address: '0xfd78b26d1e5fcac01ba43479a44afb69a8073716',
            decimals: 18,
            symbol: 'DTL',
        },
        {
            address: '0xd77401a76d6cdb7ac3bb031bf25dec07615509e7',
            decimals: 18,
            symbol: 'METRO',
        },
        {
            address: '0x0c4785ee3ca8bf1fb90c772703210bd346aa3413',
            decimals: 18,
            symbol: 'BOME',
        },
        {
            address: '0xf190dbd849e372ff824e631a1fdf199f38358bcf',
            decimals: 18,
            symbol: 'BARA',
        },
        {
            address: '0x856c4efb76c1d1ae02e20ceb03a2a6a08b0b8dc3',
            decimals: 18,
            symbol: 'OETH',
        },
        {
            address: '0x15f74458ae0bfdaa1a96ca1aa779d715cc1eefe4',
            decimals: 18,
            symbol: 'GRAI',
        },
        {
            address: '0x600d601d8b9eb5de5ac90fefc68d0d08801bfd3f',
            decimals: 8,
            symbol: 'ELMT',
        },
        {
            address: '0xe9732d4b1e7d3789004ff029f032ba3034db059c',
            decimals: 18,
            symbol: 'PATRIOT',
        },
        {
            address: '0xf939e0a03fb07f59a73314e73794be0e57ac1b4e',
            decimals: 18,
            symbol: 'crvUSD',
        },
        {
            address: '0x9f90b457dea25ef802e38d470dda7343691d8fe1',
            decimals: 18,
            symbol: 'CIOTX',
        },
        {
            address: '0x9e3c6575f674bdee85731d23259971aa6dda7b9b',
            decimals: 18,
            symbol: 'BREWSKI',
        },
        {
            address: '0xd0d56273290d339aaf1417d9bfa1bb8cfe8a0933',
            decimals: 18,
            symbol: 'FOOM',
        },
        {
            address: '0x25931894a86d47441213199621f1f2994e1c39aa',
            decimals: 18,
            symbol: 'CGPT',
        },
        {
            address: '0xa35b1b31ce002fbf2058d22f30f95d405200a15b',
            decimals: 18,
            symbol: 'ETHx',
        },
        {
            address: '0xe71bdfe1df69284f00ee185cf0d95d0c7680c0d4',
            decimals: 18,
            symbol: 'SETH',
        },
        {
            address: '0xe973e453977195422b48e1852a207b7ee9c913c7',
            decimals: 18,
            symbol: 'AD',
        },
        {
            address: '0x6034e0d6999741f07cb6fb1162cbaa46a1d33d36',
            decimals: 18,
            symbol: 'VITA-FAST',
        },
        {
            address: '0x80008bcd713c38af90a9930288d446bc3bd2e684',
            decimals: 18,
            symbol: 'KARATE',
        },
        {
            address: '0xb48eb8368c9c6e9b0734de1ef4ceb9f484b80b9c',
            decimals: 18,
            symbol: 'VMPX',
        },
        {
            address: '0x5702a4487da07c827cde512e2d5969cb430cd839',
            decimals: 27,
            symbol: 'ERBB',
        },
        {
            address: '0x982b50e55394641ca975a0eec630b120b671391a',
            decimals: 9,
            symbol: 'ECOTERRA',
        },
        {
            address: '0x40d16fc0246ad3160ccc09b8d0d3a2cd28ae6c2f',
            decimals: 18,
            symbol: 'GHO',
        },
        {
            address: '0x3c3a81e81dc49a522a592e7622a7e711c06bf354',
            decimals: 18,
            symbol: 'MNT',
        },
        {
            address: '0xb5d730d442e1d5b119fb4e5c843c48a64202ef92',
            decimals: 18,
            symbol: 'SABAI',
        },
        {
            address: '0x148c7b609aabfb7d6b49f1beacacdf41e3f1dc7e',
            decimals: 18,
            symbol: 'PURPLE',
        },
        {
            address: '0x9abc68b33961268a3ea4116214d7039226de01e1',
            decimals: 18,
            symbol: 'USDC',
        },
        {
            address: '0xe04f47ff45576249bc5083dfdf987e03d0550113',
            decimals: 18,
            symbol: 'SAMA',
        },
        {
            address: '0x1cfa5641c01406ab8ac350ded7d735ec41298372',
            decimals: 18,
            symbol: 'CJPY',
        },
        {
            address: '0xbb3a8fd6ec4bf0fdc6cd2739b1e41192d12b1873',
            decimals: 18,
            symbol: 'OBI',
        },
        {
            address: '0x45f93404ae1e4f0411a7f42bc6a5dc395792738d',
            decimals: 18,
            symbol: 'DGEN',
        },
        {
            address: '0x672f4fa517894496b8a958b4b3fca068ce513a39',
            decimals: 18,
            symbol: 'DCK',
        },
        {
            address: '0xaabeb130b002e82b9ab37fbb90487e5b16364bae',
            decimals: 18,
            symbol: 'LK99',
        },
        {
            address: '0x21413c119b0c11c5d96ae1bd328917bc5c8ed67e',
            decimals: 18,
            symbol: 'GENE',
        },
        {
            address: '0x7b744eea1deca2f1b7b31f15ba036fa1759452d7',
            decimals: 18,
            symbol: 'HIPP',
        },
        {
            address: '0x61c6ebf443ad613c9648762585b3cfd3ba1f3fa8',
            decimals: 18,
            symbol: 'SIX',
        },
        {
            address: '0xd8f1460044925d2d5c723c7054cd9247027415b7',
            decimals: 18,
            symbol: 'SAIL',
        },
        {
            address: '0xc2bc2320d22d47d1e197e99d4a5dd3261ccf4a68',
            decimals: 18,
            symbol: 'SHEETp',
        },
        {
            address: '0x4554cc10898f92d45378b98d6d6c2dd54c687fb2',
            decimals: 18,
            symbol: 'JBX',
        },
        {
            address: '0x9b06f3c5de42d4623d7a2bd940ec735103c68a76',
            decimals: 18,
            symbol: 'Volta',
        },
        {
            address: '0x761a3557184cbc07b7493da0661c41177b2f97fa',
            decimals: 18,
            symbol: 'GROW',
        },
        {
            address: '0x07a24ca74a7592c16827d186b802e004cec33bb3',
            decimals: 0,
            symbol: 'CLPC',
        },
        {
            address: '0x168e209d7b2f58f1f24b8ae7b7d35e662bbf11cc',
            decimals: 18,
            symbol: 'LAI',
        },
        {
            address: '0x9ee91f9f426fa633d227f7a9b000e28b9dfd8599',
            decimals: 18,
            symbol: 'stMATIC',
        },
        {
            address: '0x2aeabde1ab736c59e9a19bed67681869eef39526',
            decimals: 8,
            symbol: 'DOVU[eth]',
        },
        {
            address: '0xed1ddc491a2c8b1f7d6e8933580a47e124ea38db',
            decimals: 18,
            symbol: 'IOC',
        },
        {
            address: '0x6f2495e244915b164df57ba135f8430fa01c4d25',
            decimals: 18,
            symbol: 'Toil',
        },
        {
            address: '0x57f5e098cad7a3d1eed53991d4d66c45c9af7812',
            decimals: 18,
            symbol: 'wUSDM',
        },
        {
            address: '0xb6fdd8a5b6069de409288bc30c69c5856dc67ac8',
            decimals: 2,
            symbol: 'ETHTC',
        },
        {
            address: '0xb10cb07ca2cdac77fbb5707f6690301f9d036f45',
            decimals: 8,
            symbol: 'WIN',
        },
        {
            address: '0x4cce605ed955295432958d8951d0b176c10720d5',
            decimals: 6,
            symbol: 'AUDD',
        },
        {
            address: '0x580e933d90091b9ce380740e3a4a39c67eb85b4c',
            decimals: 18,
            symbol: 'GSWIFT',
        },
        {
            address: '0x8af78f0c818302164f73b2365fe152c2d1fe80e1',
            decimals: 18,
            symbol: 'FNCT',
        },
        {
            address: '0xb9d27bc093ed0a3b7c18366266704cfe5e7af77b',
            decimals: 18,
            symbol: 'CBY',
        },
        {
            address: '0x3ed2933d572d3bd9ab541d05b168d4246fcd16d0',
            decimals: 18,
            symbol: 'FLECCA',
        },
        {
            address: '0x7c5b267ed81009aa7374b5ca7e5137da47045ba8',
            decimals: 18,
            symbol: 'TKAI',
        },
        {
            address: '0x31e4efe290973ebe91b3a875a7994f650942d28f',
            decimals: 18,
            symbol: 'SHRAP',
        },
        {
            address: '0x1df721d242e0783f8fcab4a9ffe4f35bdf329909',
            decimals: 18,
            symbol: 'OP',
        },
        {
            address: '0xc6cf2c4c998bf5ef3c6fee5dc50bbe2c3366e6b8',
            decimals: 18,
            symbol: 'Ushouldnot',
        },
        {
            address: '0x490bd60a5d3e1207fba9b699017561434cc8c675',
            decimals: 18,
            symbol: 'BUGS',
        },
        {
            address: '0x39d5313c3750140e5042887413ba8aa6145a9bd2',
            decimals: 18,
            symbol: 'EMP',
        },
        {
            address: '0x7da2641000cbb407c329310c461b2cb9c70c3046',
            decimals: 18,
            symbol: 'AGI',
        },
        {
            address: '0x826180541412d574cf1336d22c0c0a287822678a',
            decimals: 18,
            symbol: 'FLIP',
        },
        {
            address: '0xefc0ced4b3d536103e76a1c4c74f0385c8f4bdd3',
            decimals: 6,
            symbol: 'PYTH',
        },
        {
            address: '0xa4ffdf3208f46898ce063e25c1c43056fa754739',
            decimals: 18,
            symbol: 'ATH',
        },
        {
            address: '0x06a4385d11b64be7248db210eca0a04a558608a5',
            decimals: 18,
            symbol: 'DOVA',
        },
        {
            address: '0x4819ac09e4619748b1cdf657283a948731fa6ab6',
            decimals: 18,
            symbol: 'TAURUS',
        },
        {
            address: '0xd8c0b13b551718b808fc97ead59499d5ef862775',
            decimals: 8,
            symbol: '$MUSIC',
        },
        {
            address: '0x710287d1d39dcf62094a83ebb3e736e79400068a',
            decimals: 18,
            symbol: 'ENQAI',
        },
        {
            address: '0xbe03e60757f21f4b6fc8f16676ad9d5b1002e512',
            decimals: 18,
            symbol: 'RST',
        },
        {
            address: '0x6bfdb6f4e65ead27118592a41eb927cea6956198',
            decimals: 18,
            symbol: 'FMC',
        },
        {
            address: '0x04c154b66cb340f3ae24111cc767e0184ed00cc6',
            decimals: 18,
            symbol: 'pxETH',
        },
        {
            address: '0x75d86078625d1e2f612de2627d34c7bc411c18b8',
            decimals: 18,
            symbol: 'AGII',
        },
        {
            address: '0x08a1c30bbb26425c1031ee9e43fa0b9960742539',
            decimals: 6,
            symbol: 'LNDX',
        },
        {
            address: '0x6fc27f5cc0aafec8e2b8bc4e6393ac89e45232d3',
            decimals: 6,
            symbol: 'xBASKET',
        },
        {
            address: '0x1a90ea47888d8d152f8e91d530083b36a467e08f',
            decimals: 9,
            symbol: 'DOGPLANET',
        },
        {
            address: '0x44ff8620b8ca30902395a7bd3f2407e1a091bf73',
            decimals: 18,
            symbol: 'VIRTUAL',
        },
        {
            address: '0xee7527841a932d2912224e20a405e1a1ff747084',
            decimals: 7,
            symbol: 'SHX',
        },
        {
            address: '0x626c4a642ef114277ccddf7de3c0a021febb1963',
            decimals: 18,
            symbol: 'MiMi',
        },
        {
            address: '0x5b649c07e7ba0a1c529deaabed0b47699919b4a2',
            decimals: 8,
            symbol: 'SGT',
        },
        {
            address: '0x0808e6c4400bde1d70db0d02170b67de05e07ef5',
            decimals: 18,
            symbol: 'wLYX',
        },
        {
            address: '0x87cc45fff5c0933bb6af6bae7fc013b7ec7df2ee',
            decimals: 18,
            symbol: 'TRSY',
        },
        {
            address: '0x23fa3aa82858e7ad1f0f04352f4bb7f5e1bbfb68',
            decimals: 18,
            symbol: 'FRIC',
        },
        {
            address: '0xa1290d69c65a6fe4df752f95823fae25cb99e5a7',
            decimals: 18,
            symbol: 'rsETH',
        },
        {
            address: '0xce246eea10988c495b4a90a905ee9237a0f91543',
            decimals: 18,
            symbol: 'VCX',
        },
        {
            address: '0x52498f8d9791736f1d6398fe95ba3bd868114d10',
            decimals: 18,
            symbol: 'NETVR',
        },
        {
            address: '0x1fac00ccee478eced6a120a50ed2ab28ee7fe32b',
            decimals: 18,
            symbol: 'TUNE',
        },
        {
            address: '0x5eed99d066a8caf10f3e4327c1b3d8b673485eed',
            decimals: 18,
            symbol: 'SEED',
        },
        {
            address: '0x79f05c263055ba20ee0e814acd117c20caa10e0c',
            decimals: 18,
            symbol: 'ICE',
        },
        {
            address: '0xda1cb94aae93890ce66c79bb1d46be9411becb9a',
            decimals: 9,
            symbol: 'AMT',
        },
        {
            address: '0xe72b141df173b999ae7c1adcbf60cc9833ce56a8',
            decimals: 18,
            symbol: 'ETH+',
        },
        {
            address: '0xc78b628b060258300218740b1a7a5b3c82b3bd9f',
            decimals: 18,
            symbol: 'wCOMAI',
        },
        {
            address: '0x814a870726edb7dfc4798300ae1ce3e5da0ac467',
            decimals: 18,
            symbol: 'daCat',
        },
        {
            address: '0x4086e77c5e993fdb90a406285d00111a974f877a',
            decimals: 4,
            symbol: 'BRWL',
        },
        {
            address: '0xbe9f61555f50dd6167f2772e9cf7519790d96624',
            decimals: 18,
            symbol: 'SX',
        },
        {
            address: '0x31c5dec1f10dc084b95c239734dea0adb9c97c9c',
            decimals: 18,
            symbol: 'OJEE',
        },
        {
            address: '0x3419875b4d3bca7f3fdda2db7a476a79fd31b4fe',
            decimals: 18,
            symbol: 'DZHV',
        },
        {
            address: '0x321520f5b689406817a44d58b19ceb5b2b84f0f5',
            decimals: 18,
            symbol: 'SPCL',
        },
        {
            address: '0xb58e61c3098d85632df34eecfb899a1ed80921cb',
            decimals: 18,
            symbol: 'ZCHF',
        },
        {
            address: '0xe9572938bcbf08adcee86fd12a7c0d08dc4ab841',
            decimals: 18,
            symbol: 'INS',
        },
        {
            address: '0xf091867ec603a6628ed83d274e835539d82e9cc8',
            decimals: 18,
            symbol: 'ZETA',
        },
        {
            address: '0x922d8563631b03c2c4cf817f4d18f6883aba0109',
            decimals: 18,
            symbol: 'LOCK',
        },
        {
            address: '0xa2e3356610840701bdf5611a53974510ae27e2e1',
            decimals: 18,
            symbol: 'wBETH',
        },
        {
            address: '0x787b55fc90002bbb823262a698c0235f4813fb29',
            decimals: 18,
            symbol: 'TBTC',
        },
        {
            address: '0xe2634677493c134524f8c922681184723560a1be',
            decimals: 18,
            symbol: 'SharpeX',
        },
        {
            address: '0x857de36f92330e1b9a21e8745c692f2ce13866cb',
            decimals: 18,
            symbol: 'MEMAGX',
        },
        {
            address: '0x24fcfc492c1393274b6bcd568ac9e225bec93584',
            decimals: 18,
            symbol: 'MAVIA',
        },
        {
            address: '0xd9019d3ee5ec8faf6cba06c526f38ebcb7c3364f',
            decimals: 18,
            symbol: 'LPX',
        },
        {
            address: '0x01824357d7d7eaf4677bc17786abd26cbdec9ad7',
            decimals: 18,
            symbol: '$FORWARD',
        },
        {
            address: '0x89e8e084cc60e6988527f0904b4be71656e8bfa9',
            decimals: 6,
            symbol: 'SMOG',
        },
        {
            address: '0x893c47bc1ff55c2269236ac7a4288681532161e0',
            decimals: 18,
            symbol: 'ERR',
        },
        {
            address: '0x3d000462fb9826804a45c0ea869b83b69587f2db',
            decimals: 18,
            symbol: 'CMPT',
        },
        {
            address: '0x6733f0283711f225a447e759d859a70b0c0fd2bc',
            decimals: 18,
            symbol: 'svETH',
        },
        {
            address: '0xaeb3607ec434454ceb308f5cd540875efb54309a',
            decimals: 18,
            symbol: 'STRDY',
        },
        {
            address: '0xbef26bd568e421d6708cca55ad6e35f8bfa0c406',
            decimals: 18,
            symbol: 'BCUT',
        },
        {
            address: '0x65c4c0517025ec0843c9146af266a2c5a2d148a2',
            decimals: 18,
            symbol: 'ETH2X',
        },
        {
            address: '0x1223334444a7466fbf985b14e1f4edaf3883bca6',
            decimals: 18,
            symbol: 'GROW',
        },
        {
            address: '0x7068263eda099fb93bb3215c05e728c0b54b3137',
            decimals: 18,
            symbol: 'CHIB',
        },
        {
            address: '0x19373ecbb4b8cc2253d70f2a246fa299303227ba',
            decimals: 18,
            symbol: 'OCH',
        },
        {
            address: '0x09395a2a58db45db0da254c7eaa5ac469d8bdc85',
            decimals: 18,
            symbol: 'SQT',
        },
        {
            address: '0x95ccffae3eb8767d4a941ec43280961dde89f4de',
            decimals: 18,
            symbol: 'TBANK',
        },
        {
            address: '0x40a9a694197a0b4b92f2aad48da6bc1b6ff194e9',
            decimals: 18,
            symbol: '@LFG',
        },
        {
            address: '0x22514ffb0d7232a56f0c24090e7b68f179faa940',
            decimals: 18,
            symbol: 'QORPO',
        },
        {
            address: '0x8c282c35b5e1088bb208991c151182a782637699',
            decimals: 18,
            symbol: 'MONAI',
        },
        {
            address: '0xdda9ff241c7160be8295ef9eca2e782361467666',
            decimals: 18,
            symbol: 'BONZAI',
        },
        {
            address: '0x8e729198d1c59b82bd6bba579310c40d740a11c2',
            decimals: 18,
            symbol: 'ALVA',
        },
        {
            address: '0x000000000503be77a5ed27bef2c19943a8b5ae73',
            decimals: 18,
            symbol: 'XTREME',
        },
        {
            address: '0x069d89974f4edabde69450f9cf5cf7d8cbd2568d',
            decimals: 18,
            symbol: 'BVM',
        },
        {
            address: '0x423352f2c6e0e72422b69af03aba259310146d90',
            decimals: 18,
            symbol: 'RMV',
        },
        {
            address: '0x0447d3454b25935eed47f65b4bd22b9b23be326a',
            decimals: 18,
            symbol: 'GEM',
        },
        {
            address: '0x7c0ab59c422ed8ad154f21c254bc47fd12eba7f7',
            decimals: 18,
            symbol: 'RIPDOGE',
        },
        {
            address: '0xb299751b088336e165da313c33e3195b8c6663a6',
            decimals: 18,
            symbol: 'STAR',
        },
        {
            address: '0x255f1b39172f65dc6406b8bee8b08155c45fe1b6',
            decimals: 18,
            symbol: 'HARAMBE',
        },
        {
            address: '0x12652c6d93fdb6f4f37d48a8687783c782bb0d10',
            decimals: 18,
            symbol: 'NGL',
        },
        {
            address: '0xb528edbef013aff855ac3c50b381f253af13b997',
            decimals: 18,
            symbol: 'AEVO',
        },
        {
            address: '0x0000206329b97db379d5e1bf586bbdb969c63274',
            decimals: 18,
            symbol: 'USDA',
        },
        {
            address: '0x8881562783028f5c1bcb985d2283d5e170d88888',
            decimals: 18,
            symbol: 'SHFL',
        },
        {
            address: '0xf1376bcef0f78459c0ed0ba5ddce976f1ddf51f4',
            decimals: 18,
            symbol: 'uniETH',
        },
        {
            address: '0xfe18ae03741a5b84e39c295ac9c856ed7991c38e',
            decimals: 18,
            symbol: 'CDCETH',
        },
        {
            address: '0x225e5b78f289c6d7d7757ad2b9d23b6ab31a5eea',
            decimals: 18,
            symbol: 'MAGATRUMP',
        },
        {
            address: '0x1495bc9e44af1f8bcb62278d2bec4540cf0c05ea',
            decimals: 18,
            symbol: 'DEAI',
        },
        {
            address: '0xc0db17bc219c5ca8746c29ee47862ee3ad742f4a',
            decimals: 18,
            symbol: 'SCOTTY',
        },
        {
            address: '0xd3cc9d8f3689b83c91b7b59cab4946b063eb894a',
            decimals: 18,
            symbol: 'XVS',
        },
        {
            address: '0x899d774e0f8e14810d628db63e65dfacea682343',
            decimals: 18,
            symbol: 'SET',
        },
        {
            address: '0x661c70333aa1850ccdbae82776bb436a0fcfeefb',
            decimals: 18,
            symbol: 'EBTC',
        },
        {
            address: '0x2833a71144fe14fe9e21d25b0fd6cc004136b084',
            decimals: 18,
            symbol: 'FoDo',
        },
        {
            address: '0x8b9b95292f890df47fff5ac9cbe93d5fc242bd51',
            decimals: 18,
            symbol: 'BEFI',
        },
        {
            address: '0x7122985656e38bdc0302db86685bb972b145bd3c',
            decimals: 18,
            symbol: 'STONE',
        },
        {
            address: '0x868c65f1de3db5285ea533e07affd5e052711fd0',
            decimals: 18,
            symbol: 'BTS',
        },
        {
            address: '0x9d39a5de30e57443bff2a8307a4256c8797a3497',
            decimals: 18,
            symbol: 'sUSDe',
        },
        {
            address: '0x424c2b444f354fd8ad52a548fdbbd2c37735fb64',
            decimals: 18,
            symbol: 'BRB',
        },
        {
            address: '0x6715515f5aa98e8bd3624922e1ba91e6f5fc4402',
            decimals: 18,
            symbol: 'SSNC',
        },
        {
            address: '0x00000000e88649dd6aab90088ca25d772d4607d0',
            decimals: 18,
            symbol: 'UDW',
        },
        {
            address: '0xdc9cb148ecb70876db0abeb92f515a5e1dc9f580',
            decimals: 18,
            symbol: 'GBTC',
        },
        {
            address: '0x60e254e35dd712394b3aba7a1d19114732e143dd',
            decimals: 18,
            symbol: 'RIVUS',
        },
        {
            address: '0x0e186357c323c806c1efdad36d217f7a54b63d18',
            decimals: 18,
            symbol: 'CGT2.0',
        },
        {
            address: '0x944824290cc12f31ae18ef51216a223ba4063092',
            decimals: 18,
            symbol: 'MASA',
        },
        {
            address: '0x2be056e595110b30ddd5eaf674bdac54615307d9',
            decimals: 18,
            symbol: 'APUFF',
        },
        {
            address: '0xe5018913f2fdf33971864804ddb5fca25c539032',
            decimals: 18,
            symbol: 'OLM',
        },
        {
            address: '0xf0187b76be05c1fcaa24f39c0a3aab4434099c4f',
            decimals: 18,
            symbol: 'AEG',
        },
        {
            address: '0xf26289eca138dc8f76b52f61f4c05cfa5e56f03b',
            decimals: 18,
            symbol: 'DRAG',
        },
        {
            address: '0x4b7c762af92dbd917d159eb282b85aa13e955739',
            decimals: 18,
            symbol: 'POODL',
        },
        {
            address: '0x2903bd7db50f300b0884f7a15904baffc77f3ec7',
            decimals: 18,
            symbol: 'ARC',
        },
        {
            address: '0xfbe44cae91d7df8382208fcdc1fe80e40fbc7e9a',
            decimals: 18,
            symbol: 'GEMAI',
        },
        {
            address: '0x55cd6418afe170a91e0be03d7306ab4b755b7ee5',
            decimals: 18,
            symbol: 'QUBE',
        },
        {
            address: '0x49446a0874197839d15395b908328a74ccc96bc0',
            decimals: 18,
            symbol: 'mstETH',
        },
        {
            address: '0xc36983d3d9d379ddfb306dfb919099cb6730e355',
            decimals: 18,
            symbol: 'COLLE',
        },
        {
            address: '0x2541a36be4cd39286ed61a3e6afc2307602489d6',
            decimals: 18,
            symbol: 'DOGE20',
        },
        {
            address: '0xf6ccfd6ef2850e84b73adeace9a075526c5910d4',
            decimals: 18,
            symbol: 'RUNIX',
        },
        {
            address: '0xacd2c239012d17beb128b0944d49015104113650',
            decimals: 18,
            symbol: 'KARRAT',
        },
        {
            address: '0xe635efcfac44c5f44508f4d17c3a96cb4ce421dd',
            decimals: 18,
            symbol: 'SPOT',
        },
        {
            address: '0x963cd3e835d81ce8e4ae4836e654336dab4298e9',
            decimals: 18,
            symbol: 'TUIT',
        },
        {
            address: '0xf10c41ca085fc8d9326a65408d14dae28a3e69a5',
            decimals: 18,
            symbol: 'ISLM',
        },
        {
            address: '0x66d79b8f60ec93bfce0b56f5ac14a2714e509a99',
            decimals: 18,
            symbol: 'MAPO',
        },
        {
            address: '0x2ac29781547eb7501d3cfd9733ce11e38df5463a',
            decimals: 18,
            symbol: 'CT',
        },
        {
            address: '0x9afc975edb8a0b57f066e8e0a72a5e2adbdcb605',
            decimals: 18,
            symbol: 'FSN',
        },
        {
            address: '0x3b9b5ad79cbb7649143decd5afc749a75f8e6c7f',
            decimals: 18,
            symbol: 'GORA',
        },
        {
            address: '0x798bcb35d2d48c8ce7ef8171860b8d53a98b361d',
            decimals: 6,
            symbol: 'mpDAO',
        },
        {
            address: '0x60c19ef883c94be612d9d58e7becd3bc1d29442c',
            decimals: 18,
            symbol: 'FUMO404',
        },
        {
            address: '0xb11db272ebfabedf611a07684e82165db60dc70e',
            decimals: 18,
            symbol: 'BTCMTX',
        },
        {
            address: '0xa080b570bb207187a87afdb544e9f24ed0af1c62',
            decimals: 18,
            symbol: 'LPM',
        },
        {
            address: '0xadf7c35560035944e805d98ff17d58cde2449389',
            decimals: 18,
            symbol: 'SPEC',
        },
        {
            address: '0xea1a6307d9b18f8d1cbf1c3dd6aad8416c06a221',
            decimals: 18,
            symbol: 'LQIDETHFIV1',
        },
        {
            address: '0x1a88df1cfe15af22b3c4c783d4e6f7f9e0c1885d',
            decimals: 18,
            symbol: 'stkGHO',
        },
        {
            address: '0xaa3acc21d184cef6f7fc3385fbdb79575231afba',
            decimals: 18,
            symbol: 'HSAI',
        },
        {
            address: '0xf230b790e05390fc8295f4d3f60332c93bed42e2',
            decimals: 6,
            symbol: 'TRX',
        },
        {
            address: '0x423071774c43c0aaf4210b439e7cda8c797e2f26',
            decimals: 18,
            symbol: 'GALAXIS',
        },
        {
            address: '0x90685e300a4c4532efcefe91202dfe1dfd572f47',
            decimals: 18,
            symbol: 'CTA',
        },
        {
            address: '0xa84f95eb3dabdc1bbd613709ef5f2fd42ce5be8d',
            decimals: 18,
            symbol: 'EAI',
        },
        {
            address: '0xab814ce69e15f6b9660a3b184c0b0c97b9394a6b',
            decimals: 18,
            symbol: 'NEURON',
        },
        {
            address: '0xb34e17562e4f1f63a2d4cf684ed8bc124e519771',
            decimals: 6,
            symbol: 'NLS',
        },
        {
            address: '0x26ebb8213fb8d66156f1af8908d43f7e3e367c1d',
            decimals: 18,
            symbol: 'RETIK',
        },
        {
            address: '0x623cd3a3edf080057892aaf8d773bbb7a5c9b6e9',
            decimals: 18,
            symbol: 'SKYA',
        },
        {
            address: '0x740df024ce73f589acd5e8756b377ef8c6558bab',
            decimals: 18,
            symbol: 'HLG',
        },
        {
            address: '0xb712d62fe84258292d1961b5150a19bc4ab49026',
            decimals: 18,
            symbol: 'XCHNG',
        },
        {
            address: '0x60d91f6d394c5004a782e0d175e2b839e078fb83',
            decimals: 18,
            symbol: 'FDM',
        },
        {
            address: '0xec53bf9167f50cdeb3ae105f56099aaab9061f83',
            decimals: 18,
            symbol: 'EIGEN',
        },
        {
            address: '0xc0bc84e95864bdfdcd1ccfb8a3aa522e79ca1410',
            decimals: 8,
            symbol: 'btc',
        },
        {
            address: '0x382ea807a61a418479318efd96f1efbc5c1f2c21',
            decimals: 18,
            symbol: 'PEW',
        },
        {
            address: '0xaca40632c51c2a03209d2714b88aa0f1456a2101',
            decimals: 18,
            symbol: 'Q',
        },
        {
            address: '0x69a1e699f562d7af66fc6cc473d99f4430c3acd2',
            decimals: 18,
            symbol: 'PARAM',
        },
        {
            address: '0xc08e7e23c235073c6807c2efe7021304cb7c2815',
            decimals: 6,
            symbol: 'XUSD',
        },
        {
            address: '0xb8a4350edafd7af34164dd5870e49e28393ff3ec',
            decimals: 18,
            symbol: 'MMTR',
        },
        {
            address: '0xd0c30a2b5fe8904d625552a49c61f14b0a2d5b6c',
            decimals: 18,
            symbol: 'WAVX',
        },
        {
            address: '0xd3999188ff689b99d8097a4876f61e70b22f7881',
            decimals: 18,
            symbol: 'SPURDO',
        },
        {
            address: '0xe591293151ffdadd5e06487087d9b0e2743de92e',
            decimals: 18,
            symbol: 'MORSE',
        },
        {
            address: '0x76131b6d0ec94057e6dc6352adda76b8165e08ab',
            decimals: 18,
            symbol: 'OBICOIN',
        },
        {
            address: '0x75e88b8c2d34a52a6d36deada664d7dc9116e4ef',
            decimals: 18,
            symbol: 'ZRS',
        },
        {
            address: '0xcbb8f1bda10b9696c57e13bc128fe674769dcec0',
            decimals: 18,
            symbol: 'MOR',
        },
        {
            address: '0x482df7483a52496f4c65ab499966dfcdf4ddfdbc',
            decimals: 18,
            symbol: 'LDY',
        },
        {
            address: '0x62f03b52c377fea3eb71d451a95ad86c818755d1',
            decimals: 18,
            symbol: 'DOGEVERSE',
        },
        {
            address: '0x10dea67478c5f8c5e2d90e5e9b26dbe60c54d800',
            decimals: 18,
            symbol: 'TAIKO',
        },
        {
            address: '0x30b818b381e5b7fd7172f097a11b3b23656d4403',
            decimals: 18,
            symbol: 'INC',
        },
        {
            address: '0x09d6f0f5a21f5be4f59e209747e2d07f50bc694c',
            decimals: 18,
            symbol: 'NFTFI',
        },
        {
            address: '0xbac48abfd032a30cabba33e393616576462976af',
            decimals: 18,
            symbol: 'ELEPEPE',
        },
        {
            address: '0x45f2ab0ca2116b2e1a70bf5e13293947b25d0272',
            decimals: 18,
            symbol: 'GLOB',
        },
        {
            address: '0x7b66e84be78772a3afaf5ba8c1993a1b5d05f9c2',
            decimals: 18,
            symbol: 'VITARNA',
        },
        {
            address: '0x7613c48e0cd50e42dd9bf0f6c235063145f6f8dc',
            decimals: 18,
            symbol: 'PIRATE',
        },
        {
            address: '0x6a5a9f8c6192985aa8169686735c5c8f9ea150a6',
            decimals: 18,
            symbol: 'PANIK',
        },
        {
            address: '0x35f3bad2fcc8053869086885f7898a3d4309db4e',
            decimals: 18,
            symbol: 'EMBER',
        },
        {
            address: '0x904f36d74bed2ef2729eaa1c7a5b70dea2966a02',
            decimals: 18,
            symbol: 'BLB',
        },
        {
            address: '0x1780933e83b09371cf716f3630fe5a422a66a39e',
            decimals: 18,
            symbol: 'QDX',
        },
        {
            address: '0x3883f5e181fccaf8410fa61e12b59bad963fb645',
            decimals: 18,
            symbol: 'THETA',
        },
        {
            address: '0x4ff57e25eeb7affbbb060e0bad2e1759efc8bec4',
            decimals: 18,
            symbol: 'BLOCX',
        },
        {
            address: '0x8236a87084f8b84306f72007f36f2618a5634494',
            decimals: 8,
            symbol: 'LBTC',
        },
        {
            address: '0x74950fc112473caba58193c6bf6412a6f1e4d7d2',
            decimals: 18,
            symbol: 'wVTRS',
        },
        {
            address: '0x9e6be44cc1236eef7e1f197418592d363bedcd5a',
            decimals: 18,
            symbol: 'AZUR',
        },
        {
            address: '0x193f4a4a6ea24102f49b931deeeb931f6e32405d',
            decimals: 18,
            symbol: 'TLOS',
        },
        {
            address: '0xfeac2eae96899709a43e252b6b92971d32f9c0f9',
            decimals: 18,
            symbol: 'ANYONE',
        },
        {
            address: '0x3697ef48a298de1ddf7814d2e4a9d26f5d012446',
            decimals: 18,
            symbol: 'GOLD',
        },
        {
            address: '0x712bd4beb54c6b958267d9db0259abdbb0bff606',
            decimals: 18,
            symbol: 'UDS',
        },
        {
            address: '0xa75ad62a1b6b78eea6c54c22eb697ca0b125f97a',
            decimals: 18,
            symbol: 'MEOW',
        },
        {
            address: '0xa469b7ee9ee773642b3e93e842e5d9b5baa10067',
            decimals: 18,
            symbol: 'USDz',
        },
        {
            address: '0x547213367cfb08ab418e7b54d7883b2c2aa27fd7',
            decimals: 18,
            symbol: 'sUSDz',
        },
        {
            address: '0x3919e9e74bc0ba82d05f0b5334d06962c4b9e846',
            decimals: 18,
            symbol: 'EVENT',
        },
        {
            address: '0xec56840be7c495cbf98c0157b458cd207ff85da1',
            decimals: 6,
            symbol: 'wRUNI',
        },
        {
            address: '0x42c7cbc9839866d069da47430110addb92ae9ad3',
            decimals: 18,
            symbol: 'MR',
        },
        {
            address: '0x63696fc66795b51d02c1590b536484a41fbddf9a',
            decimals: 18,
            symbol: 'WELL',
        },
        {
            address: '0xe07ecc676daf0b24b24a1c46c966d9c463984b38',
            decimals: 18,
            symbol: 'USEU',
        },
        {
            address: '0xf50b24a5d079e6699bf6d7f50af7d8248fabcc38',
            decimals: 18,
            symbol: 'MATR',
        },
        {
            address: '0x1c0688377a7fe29105ba70c7d3c027fcfc16bd91',
            decimals: 18,
            symbol: 'KAI',
        },
        {
            address: '0xe091e9dc9b59a2e39b423f3cfca6da3cd5608ee0',
            decimals: 18,
            symbol: 'PUG',
        },
        {
            address: '0xd7fc610f6595b3aa6e24466b5ca166d10a0fbdcb',
            decimals: 18,
            symbol: 'KERN',
        },
        {
            address: '0xf0bb20865277abd641a307ece5ee04e79073416c',
            decimals: 18,
            symbol: 'liquidETH',
        },
        {
            address: '0xc74c6a0b1a7f6a41eca76659016155eae34fc5fa',
            decimals: 18,
            symbol: 'BABYGIRL',
        },
        {
            address: '0x00000000bdc126a7d8d0a6d3844843959fffa423',
            decimals: 18,
            symbol: 'fpDGOD',
        },
        {
            address: '0x00000000ac69b40134e31f02fb411703f51e7f43',
            decimals: 18,
            symbol: 'fpMIL',
        },
        {
            address: '0xc96de26018a54d51c097160568752c4e3bd6c364',
            decimals: 8,
            symbol: 'FBTC',
        },
        {
            address: '0x73a15fed60bf67631dc6cd7bc5b6e8da8190acf5',
            decimals: 18,
            symbol: 'USD0',
        },
        {
            address: '0x0f6d4d4643a514132f84f4a270946db3c7cb701c',
            decimals: 18,
            symbol: 'LOVELY',
        },
        {
            address: '0x3e5a19c91266ad8ce2477b91585d1856b84062df',
            decimals: 18,
            symbol: 'A8',
        },
        {
            address: '0x05aaaa829afa407d83315cded1d45eb16025910c',
            decimals: 18,
            symbol: 'SPX',
        },
        {
            address: '0x1161ab556baa457994b1d6a6cca3a7a6891009fd',
            decimals: 18,
            symbol: 'CHMPZ',
        },
        {
            address: '0xa0084063ea01d5f09e56ef3ff6232a9e18b0bacd',
            decimals: 18,
            symbol: 'CYDX',
        },
        {
            address: '0x6df0e641fc9847c0c6fde39be6253045440c14d3',
            decimals: 18,
            symbol: 'DINERO',
        },
        {
            address: '0x5fd13359ba15a84b76f7f87568309040176167cd',
            decimals: 18,
            symbol: 'amphrETH',
        },
        {
            address: '0x3742f3fcc56b2d46c7b8ca77c23be60cd43ca80a',
            decimals: 18,
            symbol: 'stAVAIL',
        },
        {
            address: '0x60f67e1015b3f069dd4358a78c38f83fe3a667a9',
            decimals: 18,
            symbol: 'ROUTE',
        },
        {
            address: '0xcee99db49fe7b6e2d3394d8df2989b564bb613db',
            decimals: 18,
            symbol: 'BSR',
        },
        {
            address: '0x66a1e37c9b0eaddca17d3662d6c05f4decf3e110',
            decimals: 18,
            symbol: 'USR',
        },
        {
            address: '0xd795eb12034c2b77d787a22292c26fab5f5c70aa',
            decimals: 18,
            symbol: 'PIXFI',
        },
        {
            address: '0x917cee801a67f933f2e6b33fc0cd1ed2d5909d88',
            decimals: 18,
            symbol: 'weETHs',
        },
        {
            address: '0x88909d489678dd17aa6d9609f89b0419bf78fd9a',
            decimals: 18,
            symbol: 'L3',
        },
        {
            address: '0xc70018680b0fa2c53349ab43277dafa18e3635db',
            decimals: 18,
            symbol: 'RWAC',
        },
        {
            address: '0x5fff1443cb859e17e9a6786f7e24c369f22fd002',
            decimals: 18,
            symbol: 'PND',
        },
        {
            address: '0x00000000efe302beaa2b3e6e1b18d08d69a9012a',
            decimals: 6,
            symbol: 'AUSD',
        },
        {
            address: '0xfe8526a77a2c3590e5973ba81308b90bea21fbff',
            decimals: 18,
            symbol: 'WAI',
        },
        {
            address: '0x925a1e0abe53d3ead9d08e2e0e4be4cf5e75e0c9',
            decimals: 18,
            symbol: 'HARRIS',
        },
        {
            address: '0x152649ea73beab28c5b49b26eb48f7ead6d4c898',
            decimals: 18,
            symbol: 'Cake',
        },
        {
            address: '0xc2eb40516ecaac04ae9964934983d1e9ebdf51fd',
            decimals: 18,
            symbol: '99BTC',
        },
        {
            address: '0x0e16bd2cd962fadb4a23ec961bb170ffa25208a8',
            decimals: 18,
            symbol: 'HONO',
        },
        {
            address: '0x73a740d256188395d9af56db31ab1e9bb2f2978d',
            decimals: 18,
            symbol: 'CUBE',
        },
        {
            address: '0x2196b84eace74867b73fb003aff93c11fce1d47a',
            decimals: 18,
            symbol: 'PSY',
        },
        {
            address: '0x84dad4e4a4d1510052d39e916330372db8cd1238',
            decimals: 18,
            symbol: 'DEEZNUTS',
        },
        {
            address: '0xc13c9862de7a4d2883707126a992b04511b0a06c',
            decimals: 9,
            symbol: 'BLIZZ',
        },
        {
            address: '0xc5433466471337a78c94c778ca555674e39aa2f9',
            decimals: 18,
            symbol: 'OURO',
        },
        {
            address: '0xd2f24e32ea5b6c3d91f5220f19ea11dddb181df9',
            decimals: 18,
            symbol: 'ASS',
        },
        {
            address: '0xe4887cf30ff3edb843369f2161fcb7e064ff28f0',
            decimals: 9,
            symbol: 'tTAO',
        },
        {
            address: '0xe1b4d34e8754600962cd944b535180bd758e6c2e',
            decimals: 18,
            symbol: 'agETH',
        },
        {
            address: '0x00b8a9bb1dcab2cf2375284d70b39e6ef7d86aae',
            decimals: 18,
            symbol: '$BURNA',
        },
        {
            address: '0x5bf87f90573af1de8caea4a466f251e913caaad3',
            decimals: 18,
            symbol: 'DAWGZ',
        },
        {
            address: '0x35d8949372d46b7a3d5a56006ae77b215fc69bc0',
            decimals: 18,
            symbol: 'USD0++',
        },
        {
            address: '0x004e9c3ef86bc1ca1f0bb5c7662861ee93350568',
            decimals: 8,
            symbol: 'uniBTC',
        },
        {
            address: '0x6551698ee65f5db726e49f9ab0ff1ce9419003a7',
            decimals: 18,
            symbol: 'PLAY',
        },
        {
            address: '0x388f32a7faa9eb79c3bf3412294370750bc9ffa6',
            decimals: 18,
            symbol: 'WNCN',
        },
        {
            address: '0x38f9bf9dce51833ec7f03c9dc218197999999999',
            decimals: 18,
            symbol: 'NYA',
        },
        {
            address: '0x000000000f8a255d589c49f5fefe2a87991fef04',
            decimals: 18,
            symbol: 'fpMNBD',
        },
        {
            address: '0x4c4d8fc4f42670d491ca5e6bcee8a62a9ea585c6',
            decimals: 18,
            symbol: 'Treat',
        },
        {
            address: '0x7a56e1c57c7475ccf742a1832b028f0456652f97',
            decimals: 18,
            symbol: 'SolvBTC',
        },
        {
            address: '0xd9d920aa40f578ab794426f5c90f6c731d159def',
            decimals: 18,
            symbol: 'SolvBTC.BBN',
        },
        {
            address: '0xcdb8fc4ef27dfeaba9b31899a9d165398bf97b9e',
            decimals: 18,
            symbol: 'ETHOS',
        },
        {
            address: '0x5401b8620e5fb570064ca9114fd1e135fd77d57c',
            decimals: 8,
            symbol: 'LBTCv',
        },
        {
            address: '0x306fd3e7b169aa4ee19412323e1a5995b8c1a1f4',
            decimals: 18,
            symbol: 'FTW',
        },
        {
            address: '0xe9abaa9d6f65a08f07aed9cb978001c88b9f4151',
            decimals: 18,
            symbol: 'DOGE',
        },
        {
            address: '0x437cc33344a0b27a429f795ff6b469c72698b291',
            decimals: 6,
            symbol: 'wM',
        },
        {
            address: '0x14e03a460550f6180b56979214396008619d5cb4',
            decimals: 18,
            symbol: 'P',
        },
        {
            address: '0x346b46280f559def274f80c5d16471b4b7ef2f14',
            decimals: 18,
            symbol: 'WSTOR',
        },
        {
            address: '0xf8206a19fca5999425358de4e4cdefc7f5c5d4ca',
            decimals: 9,
            symbol: 'WIGL',
        },
        {
            address: '0x31b6100f5f4466e6daeb1edb2f2ce6e548cf8938',
            decimals: 18,
            symbol: 'Puff',
        },
        {
            address: '0x19640000000ba88d36206beb10d0e86011c8d08c',
            decimals: 18,
            symbol: 'RALLY',
        },
        {
            address: '0x825459139c897d769339f295e962396c4f9e4a4d',
            decimals: 18,
            symbol: 'GAME',
        },
        {
            address: '0xf8e57ac2730d3088d98b79209739b0d5ba085a03',
            decimals: 18,
            symbol: 'OPAI',
        },
        {
            address: '0xa2db75354e3be2b2910f4486ea5ea612a14b8235',
            decimals: 18,
            symbol: 'Koinu',
        },
        {
            address: '0xf1a7000000950c7ad8aff13118bb7ab561a448ee',
            decimals: 18,
            symbol: 'FLAY',
        },
        {
            address: '0x6988a804c74fd04f37da1ea4781cea68c9c00f86',
            decimals: 18,
            symbol: 'TRIBL',
        },
        {
            address: '0x8be3460a480c80728a8c4d7a5d5303c85ba7b3b9',
            decimals: 18,
            symbol: 'sENA',
        },
        {
            address: '0xdbb5cf12408a3ac17d668037ce289f9ea75439d7',
            decimals: 6,
            symbol: 'WMTX',
        },
        {
            address: '0xf56bbe7dfbcf2a4b62b799e6f13f15738a82fd98',
            decimals: 18,
            symbol: 'X7',
        },
        {
            address: '0x906c012fa4c30d580537c2b72d1789f56f488a80',
            decimals: 18,
            symbol: 'POGS',
        },
        {
            address: '0xd0ebfe04adb5ef449ec5874e450810501dc53ed5',
            decimals: 18,
            symbol: 'BRUME',
        },
        {
            address: '0xf3d92374b902b3681b8ecae65e336a44a06cf22b',
            decimals: 8,
            symbol: 'DBCH',
        },
        {
            address: '0x791a5c2261823dbf69b27b63e851b7745532cfa2',
            decimals: 18,
            symbol: 'TUA',
        },
        {
            address: '0x00000000dc4d50275f55e47f596dac6061c04e0a',
            decimals: 18,
            symbol: 'fp0N1',
        },
        {
            address: '0x09d4214c03d01f49544c0448dbe3a27f768f2b34',
            decimals: 18,
            symbol: 'rUSD',
        },
        {
            address: '0x7f89f674b7d264944027e78e5f58eb2bbbb7cfa3',
            decimals: 18,
            symbol: 'BCRED',
        },
        {
            address: '0x0000000047c33cf8b5531d6b38d762763e47cf65',
            decimals: 18,
            symbol: 'fpNOBODY',
        },
        {
            address: '0x000000008ec81ae97c4f0d453b608b315c08f40e',
            decimals: 18,
            symbol: 'fpPOTZ',
        },
        {
            address: '0x8a462e6a0051d006e33152fbeadfb9a14198de30',
            decimals: 18,
            symbol: 'FYDE',
        },
        {
            address: '0x00000000914a8f4f1b79b5de6d324ca64350970d',
            decimals: 18,
            symbol: 'fpCKBB',
        },
        {
            address: '0x0000000030847b09b3d1d16a85fdc70717d13fb8',
            decimals: 18,
            symbol: 'fpMEEB',
        },
        {
            address: '0x4d1c297d39c5c1277964d0e3f8aa901493664530',
            decimals: 18,
            symbol: 'PUFFER',
        },
        {
            address: '0xe77076518a813616315eaaba6ca8e595e845eee9',
            decimals: 18,
            symbol: 'eEIGEN',
        },
        {
            address: '0xe50e009ddb1a4d8ec668eac9d8b2df1f96348707',
            decimals: 18,
            symbol: 'CTRL',
        },
        {
            address: '0x8f08b70456eb22f6109f57b8fafe862ed28e6040',
            decimals: 18,
            symbol: 'LRT2',
        },
        {
            address: '0xca7af58da871736994ce360f51ec6cd28351a3df',
            decimals: 18,
            symbol: 'GATSBY',
        },
        {
            address: '0x23a5a5ad7ac5fb8cbc71185f90ac831365698d5d',
            decimals: 18,
            symbol: 'DOGS',
        },
        {
            address: '0x6c060ba738af39a09f3b45ac6487dfc9ebb885f6',
            decimals: 9,
            symbol: 'rsERG',
        },
        {
            address: '0x9928a8600d14ac22c0be1e8d58909834d7ceaf13',
            decimals: 9,
            symbol: '0xDNX',
        },
        {
            address: '0x2f42b7d686ca3effc69778b6ed8493a7787b4d6e',
            decimals: 18,
            symbol: 'TARA',
        },
        {
            address: '0x1e762e1fac176bbb341656035daf5601b1c69be5',
            decimals: 18,
            symbol: 'WEL',
        },
        {
            address: '0x54d2252757e1672eead234d27b1270728ff90581',
            decimals: 18,
            symbol: 'BGB',
        },
        {
            address: '0x19247618d79e3fc4d4866169789e4b8eedef52e6',
            decimals: 18,
            symbol: 'CAI',
        },
        {
            address: '0x2d8ea194902bc55431420bd26be92b0782dce91d',
            decimals: 18,
            symbol: 'ZND',
        },
        {
            address: '0x243c9be13faba09f945ccc565547293337da0ad7',
            decimals: 18,
            symbol: 'TRUF',
        },
        {
            address: '0x4687f007da484efe20d7a17e5b1d105cdbfca0eb',
            decimals: 18,
            symbol: 'MORPH',
        },
        {
            address: '0xe957ea0b072910f508dd2009f4acb7238c308e29',
            decimals: 18,
            symbol: 'ETHC',
        },
        {
            address: '0x94a8b4ee5cd64c79d0ee816f467ea73009f51aa0',
            decimals: 18,
            symbol: 'RIO',
        },
        {
            address: '0x128f3e482f5bd5f08fe1b216e60ec0a6013deab9',
            decimals: 12,
            symbol: 'Daram',
        },
        {
            address: '0x975da7b2325f815f1de23c8b68f721fb483b8071',
            decimals: 18,
            symbol: 'LOOPIN',
        },
        {
            address: '0xb52aea9bd039edcba8263c6874419611de9d5929',
            decimals: 9,
            symbol: 'FNGY',
        },
        {
            address: '0x29be6cd779c7ddbf6cbe3efdef7ba6f9cd2c703d',
            decimals: 9,
            symbol: 'SHREW',
        },
        {
            address: '0x6b3d8cc084936fd12519169e5b6cb585bcdddb54',
            decimals: 9,
            symbol: 'PEANUT',
        },
        {
            address: '0x0bf53d6984e5678ee6d08ec48568ed8a6e207a9f',
            decimals: 9,
            symbol: 'PEANUT',
        },
        {
            address: '0x92d5942f468447f1f21c2092580f15544923b434',
            decimals: 18,
            symbol: 'VSTR',
        },
        {
            address: '0x2025bf4e0c1117685b1bf2ea2be56c7deb11bc99',
            decimals: 18,
            symbol: '$Robie',
        },
        {
            address: '0xac8370c77756aa0bf0748e2ccff27d225a995b99',
            decimals: 9,
            symbol: 'BORPA',
        },
        {
            address: '0x9d1a7a3191102e9f900faa10540837ba84dcbae7',
            decimals: 18,
            symbol: 'EURI',
        },
        {
            address: '0xe69ccaaaea33ebfe5b76e0dd373cd9a1a31fd410',
            decimals: 9,
            symbol: 'PNUT',
        },
        {
            address: '0xd4ce921933be20c17b89a6ab708749fca862ba1a',
            decimals: 9,
            symbol: 'PNUT',
        },
        {
            address: '0xd9dcd5a6b95b2f34ffdb8abf84fdad86629d95ff',
            decimals: 9,
            symbol: 'Fred',
        },
        {
            address: '0x54e43f06c5f974efdaddce8122060814e3881a45',
            decimals: 18,
            symbol: 'USDX',
        },
        {
            address: '0x4947b72fed037ade3365da050a9be5c063e605a7',
            decimals: 9,
            symbol: 'PEANUT',
        },
        {
            address: '0xcab254f1a32343f11ab41fbde90ecb410cde348a',
            decimals: 18,
            symbol: 'FROGE',
        },
        {
            address: '0x0dbb4b96a23ea7943bb72a8f16cc2c248f372935',
            decimals: 18,
            symbol: 'LIGHT',
        },
        {
            address: '0x8a60e489004ca22d775c5f2c657598278d17d9c2',
            decimals: 18,
            symbol: 'USDa',
        },
        {
            address: '0x4b91dfa774acde7ed70e93a6438363feaaa40f54',
            decimals: 9,
            symbol: 'SPE',
        },
        {
            address: '0x556c3cbdca77a7f21afe15b17e644e0e98e64df4',
            decimals: 18,
            symbol: 'MAO',
        },
        {
            address: '0x641927e970222b10b2e8cdbc96b1b4f427316f16',
            decimals: 18,
            symbol: 'MEEB',
        },
        {
            address: '0x6670cab726c55db4c68948c69c077484642bfdf3',
            decimals: 18,
            symbol: 'PNUT',
        },
        {
            address: '0x0f23059a8c0c5af7656bdd0c4206d09636c6cc75',
            decimals: 9,
            symbol: 'FRED',
        },
        {
            address: '0x67f9e469b44c471d3cd945122a28547e76b79820',
            decimals: 18,
            symbol: 'AWOKE',
        },
        {
            address: '0x5252b55a9c2a129bbb18fa359c25454faa82a749',
            decimals: 9,
            symbol: 'Pnut',
        },
        {
            address: '0x5485a469faea1492191cfce7528ab6e58135aa4d',
            decimals: 18,
            symbol: 'OSMI',
        },
        {
            address: '0x0a6e7ba5042b38349e437ec6db6214aec7b35676',
            decimals: 18,
            symbol: 'SWELL',
        },
        {
            address: '0xcc886c93c4d06b0fb69741d0dcd0f566c926e827',
            decimals: 18,
            symbol: 'SOY',
        },
        {
            address: '0x03787e502cc8e5dbdc0d4b44f888802719dc5165',
            decimals: 18,
            symbol: 'ASTGG',
        },
        {
            address: '0x523a389cab051a78d6af2c5b3af51aada7b06abb',
            decimals: 9,
            symbol: 'OPK',
        },
        {
            address: '0x643c4e15d7d62ad0abec4a9bd4b001aa3ef52d66',
            decimals: 18,
            symbol: 'SYRUP',
        },
        {
            address: '0xd6203889c22d9fe5e938a9200f50fdffe9dd8e02',
            decimals: 9,
            symbol: 'SBR',
        },
        {
            address: '0x59a529070fbb61e6d6c91f952ccb7f35c34cf8aa',
            decimals: 18,
            symbol: 'ASF',
        },
        {
            address: '0x39903a1a6f289a67e0de94096915c4ccd506ab2a',
            decimals: 18,
            symbol: 'MAIV',
        },
        {
            address: '0x5c47902c8c80779cb99235e42c354e53f38c3b0d',
            decimals: 18,
            symbol: 'X28',
        },
        {
            address: '0xa17af34d1888f3a837fb6c505ec50d8d5521d23d',
            decimals: 9,
            symbol: 'HAGGIS',
        },
        {
            address: '0x2d20c88ba34dd5746e1db8a8221153ce440ebe4a',
            decimals: 9,
            symbol: 'HAGGIS',
        },
        {
            address: '0xd7fa4cfc22ea07dfced53033fbe59d8b62b8ee9e',
            decimals: 18,
            symbol: 'VYPER',
        },
        {
            address: '0x18925c88372c0958b0eaa33ffbe6a9e5d2ff563e',
            decimals: 9,
            symbol: 'XSHOP',
        },
        {
            address: '0x7d26ad6f6ba9d6ba1de0218ae5e20cd3a273a55a',
            decimals: 18,
            symbol: 'VT',
        },
        {
            address: '0xc88f47067db2e25851317a2fdae73a22c0777c37',
            decimals: 9,
            symbol: 'oneBTC',
        },
        {
            address: '0xd6f6458fe37154f1f6b470ba17c06e9ddd785700',
            decimals: 9,
            symbol: 'GoldenAmerica',
        },
        {
            address: '0xb55719af062ef64c933fe6061a9f331fbe3dd5e2',
            decimals: 9,
            symbol: 'Haggis',
        },
        {
            address: '0xee4386076c45cd928de64d44074baa62b05eebad',
            decimals: 9,
            symbol: '$TRUMP47',
        },
        {
            address: '0x48b847cf774a5710f36f594b11fc10e2e59bba72',
            decimals: 18,
            symbol: 'UNIT0',
        },
        {
            address: '0x554fb3b6c1cf4a3cef49779ced321ca51c667d7d',
            decimals: 18,
            symbol: 'ARATA',
        },
        {
            address: '0xb4c42d3ecb9cf5811e7cf21a81d0bf3fee21a6f3',
            decimals: 9,
            symbol: 'NWO',
        },
        {
            address: '0xa4cde5e695ecf2cbdcbc5715c5069d91b1929f39',
            decimals: 18,
            symbol: 'REDWAVE',
        },
        {
            address: '0x8be8c50e7d7acff6084899e71a6db085ff7134c8',
            decimals: 18,
            symbol: 'OPSEC',
        },
        {
            address: '0x309850e0f7d5191b708ebac76b14161dc3046385',
            decimals: 9,
            symbol: 'SER',
        },
        {
            address: '0x53a4e5fe35ab273937fa97bd925b6675be411157',
            decimals: 9,
            symbol: 'GOLDEN',
        },
        {
            address: '0xc69996612249417db3407d98ea5b534faa0e90a7',
            decimals: 18,
            symbol: 'DXS',
        },
        {
            address: '0x720ca1fffbcb9e8c7577963d0a5be67abd3b92f1',
            decimals: 9,
            symbol: 'GUNTRA',
        },
        {
            address: '0x68575f1bd11e96bfd920be891a8941d2226033b9',
            decimals: 9,
            symbol: 'CMO',
        },
        {
            address: '0x6ee2f71049dde9a93b7c0ee1091b72acf9b46810',
            decimals: 18,
            symbol: 'MERC',
        },
        {
            address: '0x58d97b57bb95320f9a05dc918aef65434969c2b2',
            decimals: 18,
            symbol: 'MORPHO',
        },
        {
            address: '0x5b5f4a883626e75f29060c4ffde0057dd3a57f62',
            decimals: 18,
            symbol: '$CFLP',
        },
        {
            address: '0x355a510cdf8aa3e7654b988c6bd8788fa93173e6',
            decimals: 6,
            symbol: 'sendit',
        },
        {
            address: '0xac1d3d7a8878e655cbb063d58e453540641f4117',
            decimals: 18,
            symbol: 'TOAD',
        },
        {
            address: '0xe28a8a4153f0a58aafb581460936f71b5a40c28f',
            decimals: 14,
            symbol: 'Giraffey',
        },
        {
            address: '0x06561dc5cedcc012a4ea68609b17d41499622e4c',
            decimals: 18,
            symbol: 'NOOB',
        },
        {
            address: '0x079d0150cc21e127898db0f51f18ca54db56b1ba',
            decimals: 9,
            symbol: 'BTCACT',
        },
        {
            address: '0x9533c01a95bd93c8dc933a8d912e8badcdf4ea6a',
            decimals: 9,
            symbol: 'TARDO',
        },
        {
            address: '0xc9fcebae9e9419bf24a520a8a25242c4c7cd6bcd',
            decimals: 9,
            symbol: 'VIPER',
        },
        {
            address: '0x017e71e96f2ae777c679740d2d8dc15ed4231981',
            decimals: 18,
            symbol: 'wYFI',
        },
        {
            address: '0x9d9535dae62f5f12ab83f1183dca1ead244b0db3',
            decimals: 18,
            symbol: 'YBR',
        },
        {
            address: '0xf203ca1769ca8e9e8fe1da9d147db68b6c919817',
            decimals: 18,
            symbol: 'WNCG',
        },
        {
            address: '0x40d4e93b888d5ee9ec61a29a018b199070ffc280',
            decimals: 18,
            symbol: 'DELAY',
        },
        {
            address: '0x69000f187c87d89462e02aeb9ff62cb815267015',
            decimals: 9,
            symbol: 'SPR',
        },
        {
            address: '0x19e1f2f837a3b90ebd0730cb6111189be0e1b6d6',
            decimals: 18,
            symbol: 'LAIKA',
        },
        {
            address: '0xf67e2dc041b8a3c39d066037d29f500757b1e886',
            decimals: 18,
            symbol: 'sUSDN',
        },
        {
            address: '0x699ec925118567b6475fe495327ba0a778234aaa',
            decimals: 9,
            symbol: 'DUCKY',
        },
        {
            address: '0x4955f6641bf9c8c163604c321f4b36e988698f75',
            decimals: 9,
            symbol: 'DOGECAST',
        },
        {
            address: '0x65278f702019078e9ab196c0da0a6ee55e7248b7',
            decimals: 18,
            symbol: 'DIONE',
        },
        {
            address: '0x5c6ee304399dbdb9c8ef030ab642b10820db8f56',
            decimals: 18,
            symbol: 'B-80BAL-20WETH',
        },
        {
            address: '0x5a797bb09911bb792d9e92aa7d4ecfab56e03f97',
            decimals: 9,
            symbol: 'SHIBA',
        },
        {
            address: '0x210028b5a1e9effb93ce31006a18629f31131093',
            decimals: 9,
            symbol: '$BLK',
        },
        {
            address: '0x095052403404b60ca345c0d519cc254b336866da',
            decimals: 9,
            symbol: 'MARSLINK',
        },
        {
            address: '0x47a7dbc2644b20231c45fb3399023cd522ddb1c4',
            decimals: 9,
            symbol: 'BULL',
        },
        {
            address: '0x52560ffb5b79df920be4744df135d1dafe7303f3',
            decimals: 9,
            symbol: 'BTC',
        },
        {
            address: '0x38aa2ee9fe2cb3c16038a0166a790d1d79264e5d',
            decimals: 9,
            symbol: 'Neiluo',
        },
        {
            address: '0xbeac671ee661461b7fcd786ece1b2f37af2a99f8',
            decimals: 9,
            symbol: 'BEAK',
        },
        {
            address: '0x66d5c66e7c83e0682d947176534242c9f19b3365',
            decimals: 9,
            symbol: 'sVEC',
        },
        {
            address: '0x8958b13a5df95a1d5220eb9e748fc600c4405e9a',
            decimals: 9,
            symbol: 'ASS',
        },
        {
            address: '0x618151f1928965747389c87c77ee52608fff52b3',
            decimals: 9,
            symbol: 'BAKKT',
        },
        {
            address: '0x2b117f0a9a56dddaaf0257b476bfc39ca7e6fda1',
            decimals: 18,
            symbol: 'CNW',
        },
        {
            address: '0x34a95ba052abe7d5a33d7ba8820cc35d54880a59',
            decimals: 9,
            symbol: 'ETH',
        },
        {
            address: '0xe6a5b2c5488e9e1f942e01add3625969bda68bef',
            decimals: 9,
            symbol: 'B.O.N.K',
        },
        {
            address: '0x26607ac599266b21d13c7acf7942c7701a8b699c',
            decimals: 18,
            symbol: 'PIPT',
        },
        {
            address: '0xf0430bd971ee4a63674a2103e21129e9ccf29686',
            decimals: 9,
            symbol: 'GARY',
        },
        {
            address: '0xeeb18e00734069c1a22af6e9342852cc4275a481',
            decimals: 9,
            symbol: 'WINTER',
        },
        {
            address: '0x8154056c3fc1eaa2078190f9f6558d6122a0f372',
            decimals: 9,
            symbol: 'Chiitan',
        },
        {
            address: '0xc6ccfc6a4e7c61371adbf0ca0430e428cc309c2a',
            decimals: 9,
            symbol: 'gloop',
        },
        {
            address: '0x69420cb71f5fa439a84545e79557977c0600c46e',
            decimals: 9,
            symbol: 'TRUMP',
        },
        {
            address: '0xff241e3aa3c428bcb30ae688b3c0aa6b028b4037',
            decimals: 9,
            symbol: 'LOCKIN',
        },
        {
            address: '0xd1439d69ee5b2cb667c9a9a620bd304aa6724e84',
            decimals: 9,
            symbol: 'X',
        },
        {
            address: '0x9d696dc16bc0d49daadb80d9bf312cec2c3f7501',
            decimals: 9,
            symbol: 'NEIRO2.0',
        },
        {
            address: '0x65ef703f5594d2573eb71aaf55bc0cb548492df4',
            decimals: 18,
            symbol: 'MULTI',
        },
        {
            address: '0x8e6819273e71203b5e15689086aceabb912bc075',
            decimals: 9,
            symbol: 'SUBTARDED',
        },
        {
            address: '0x0cef5784c4d3cfdf0f411cbfc35c1056124cc0c6',
            decimals: 9,
            symbol: 'BUDDY',
        },
        {
            address: '0xef8615f7a79df5e7baad4d8442ded27cf78faee8',
            decimals: 18,
            symbol: 'SPOTTY',
        },
        {
            address: '0xd323e5804b5e240aba36bc30885ebf090fcc821a',
            decimals: 9,
            symbol: 'MOMO',
        },
        {
            address: '0x90720671a0436cc35718a89dc8aba7dcee4deb08',
            decimals: 18,
            symbol: 'DXAI',
        },
        {
            address: '0xa0d41396ead7c679f8961f0cddf752e7e5505f4a',
            decimals: 9,
            symbol: 'WDK',
        },
        {
            address: '0x95640f59e29aa7c46dc287c8afb29dc71a41eb19',
            decimals: 18,
            symbol: 'WEAVER',
        },
        {
            address: '0xcdbddbdefb0ee3ef03a89afcd714aa4ef310d567',
            decimals: 18,
            symbol: 'VERTAI',
        },
        {
            address: '0xb4a975ffef5c1ad660a3f2a50dbe68c84f957466',
            decimals: 9,
            symbol: 'DogeOS',
        },
        {
            address: '0xf4386c587b0daff9664bac4377287b626ae438a1',
            decimals: 9,
            symbol: 'DOME',
        },
        {
            address: '0x5da42c37dea61d1c31e7a810e7d2aff736a41643',
            decimals: 18,
            symbol: 'YES',
        },
        {
            address: '0x9562e2063122eaa4d7c2d786e7ca2610d70ca8b8',
            decimals: 18,
            symbol: 'SHIBC',
        },
        {
            address: '0x7eeab3de47a475fd2dec438aef05b128887c6105',
            decimals: 11,
            symbol: 'TROPPY',
        },
        {
            address: '0x1b2729cb60a2ca8228f0a1cb70f2f90b5a0a121c',
            decimals: 9,
            symbol: 'MGR',
        },
        {
            address: '0x06f114c92f34a7f65f7084e107ed3f98bdf84094',
            decimals: 9,
            symbol: 'DEFAPE',
        },
        {
            address: '0xcfbca579d8f8e5281cd25cf0d9a8be7226764625',
            decimals: 9,
            symbol: 'ELON',
        },
        {
            address: '0x3b991fac7721ec047853d1945ef4b092f72e1635',
            decimals: 9,
            symbol: 'BSHRUB',
        },
        {
            address: '0x2ce2ba5f34df40eea645b81cc4b46b7797503645',
            decimals: 9,
            symbol: 'MOPE',
        },
        {
            address: '0x520140d71129434635899eca07f845bb23b27987',
            decimals: 18,
            symbol: 'VIRTU',
        },
        {
            address: '0x2e44f3f609ff5aa4819b323fd74690f07c3607c4',
            decimals: 18,
            symbol: 'Pin',
        },
        {
            address: '0xde0a515d133397d62eb3fcdfcc68ba4904ac49c0',
            decimals: 9,
            symbol: 'SHNJ',
        },
        {
            address: '0x42069f39c71816cea208451598425b492dd2b380',
            decimals: 9,
            symbol: 'GOOMPY',
        },
        {
            address: '0x71959dcfc45b235efcb516f10a1b69a423a68e7a',
            decimals: 9,
            symbol: 'D/aDDy',
        },
        {
            address: '0x0cc8b7eb1d23a00314ca33de01d8fc1c2afcaaf0',
            decimals: 9,
            symbol: 'NDR',
        },
        {
            address: '0x79c58f70905f734641735bc61e45c19dd9ad60bc',
            decimals: 18,
            symbol: 'USDC-DAI-USDT',
        },
        {
            address: '0x7a78c790250fef60ce7e8ef85557d67cc4216a52',
            decimals: 18,
            symbol: 'GLUTEU',
        },
        {
            address: '0x198d7387fa97a73f05b8578cdeff8f2a1f34cd1f',
            decimals: 18,
            symbol: 'wjAURA',
        },
        {
            address: '0xcf0c1c32fed558dbb7d46fd9384a2005799dc4a4',
            decimals: 9,
            symbol: 'FLOKIC',
        },
        {
            address: '0xd9de10b3e9c6644160d0880e3249e0de75f11b33',
            decimals: 9,
            symbol: 'VIVEK',
        },
        {
            address: '0x7e9afd25f5ec0eb24d7d4b089ae7ecb9651c8b1f',
            decimals: 18,
            symbol: 'B-baoUSD-LUSD-BPT',
        },
        {
            address: '0x1a44e35d5451e0b78621a1b3e7a53dfaa306b1d0',
            decimals: 18,
            symbol: 'B-baoETH-ETH-BPT',
        },
        {
            address: '0x8390aa80a8e8035f7c95399f456cedd5a7e814bd',
            decimals: 9,
            symbol: 'Grok3',
        },
        {
            address: '0x5de5aca787818a2d485e278727ce575d54fedbe4',
            decimals: 9,
            symbol: 'BUCK',
        },
        {
            address: '0xb37464bb81c9d1496966c43348664634d4ecec39',
            decimals: 9,
            symbol: '@SBR',
        },
        {
            address: '0xee171200691a57d08aa62df2dd7f63337eca2a91',
            decimals: 9,
            symbol: 'COKE',
        },
        {
            address: '0x67830ddad189071b017573d0a35a3a054d88a817',
            decimals: 9,
            symbol: 'Pepe#6783',
        },
        {
            address: '0x0d384035c54a11428fe4e70a6a4e0c56041ffc75',
            decimals: 9,
            symbol: 'BANANA',
        },
        {
            address: '0x93d199263632a4ef4bb438f1feb99e57b4b5f0bd',
            decimals: 18,
            symbol: 'wstETH-WETH-BPT',
        },
        {
            address: '0x4eae1ecb8e333618810dd556773467c87ea5fe18',
            decimals: 9,
            symbol: 'BAKKT',
        },
        {
            address: '0x694207f4677579ab01d3b55be436c62750d81e49',
            decimals: 9,
            symbol: 'Starbase',
        },
        {
            address: '0xbf2e353f5db1a01e4e7f051222c666afc81b2574',
            decimals: 9,
            symbol: 'DOGEFATHER',
        },
        {
            address: '0x05ff47afada98a98982113758878f9a8b9fdda0a',
            decimals: 18,
            symbol: 'weETH/rETH',
        },
        {
            address: '0x596192bb6e41802428ac943d2f1476c1af25cc0e',
            decimals: 18,
            symbol: 'ezETH-WETH-BPT',
        },
        {
            address: '0x9deb0fc809955b79c85e82918e8586d3b7d2695a',
            decimals: 18,
            symbol: 'GOLD',
        },
        {
            address: '0x87931e7ad81914e7898d07c68f145fc0a553d8fb',
            decimals: 18,
            symbol: 'WIZARD',
        },
        {
            address: '0x583019ff0f430721ada9cfb4fac8f06ca104d0b4',
            decimals: 18,
            symbol: 'st-yETH',
        },
        {
            address: '0x33333333fede34409fb7f67c6585047e1f653333',
            decimals: 18,
            symbol: 'ORA',
        },
        {
            address: '0x85122dc2c0ac24e8aacaff4a4ccfcbdf36e80f60',
            decimals: 9,
            symbol: 'DOPE',
        },
        {
            address: '0xfd418e42783382e86ae91e445406600ba144d162',
            decimals: 18,
            symbol: 'ZRC',
        },
        {
            address: '0x69098cc635967fa33615b280deb5090d136d553b',
            decimals: 18,
            symbol: 'DODGE',
        },
        {
            address: '0xebd9dc65c723cadc0ee4ee5a8013ddd3db98f250',
            decimals: 18,
            symbol: 'FANG',
        },
        {
            address: '0x84d821f7fbdd595c4c4a50842913e6b1e07d7a53',
            decimals: 18,
            symbol: 'BNPL',
        },
        {
            address: '0xe97e496e8494232ee128c1a8cae0b2b7936f3caa',
            decimals: 18,
            symbol: 'CURIO',
        },
        {
            address: '0xa5f2211b9b8170f694421f2046281775e8468044',
            decimals: 18,
            symbol: 'THOR',
        },
        {
            address: '0x030ed557a0775e110394c1a543f3eb181aeea05f',
            decimals: 18,
            symbol: 'MKRETHDOOM',
        },
        {
            address: '0xe3cb486f3f5c639e98ccbaf57d95369375687f80',
            decimals: 8,
            symbol: 'renDGB',
        },
        {
            address: '0x6bd599a8b945074a375bf6bdbb7abe3126603cb6',
            decimals: 18,
            symbol: 'COMMA',
        },
        {
            address: '0x88536c9b2c4701b8db824e6a16829d5b5eb84440',
            decimals: 9,
            symbol: 'USV',
        },
        {
            address: '0x0acc0fee1d86d2cd5af372615bf59b298d50cd69',
            decimals: 18,
            symbol: 'ILSI',
        },
        {
            address: '0x70bef3bb2f001da2fddb207dae696cd9faff3f5d',
            decimals: 18,
            symbol: 'NST',
        },
        {
            address: '0x60be1e1fe41c1370adaf5d8e66f07cf1c2df2268',
            decimals: 18,
            symbol: 'PERC',
        },
        {
            address: '0x1f104e7b11a6f5b4a15a438e0a107954afd7769f',
            decimals: 18,
            symbol: 'GALS',
        },
        {
            address: '0xe218a21d03dea706d114d9c4490950375f3b7c05',
            decimals: 18,
            symbol: 'WARRIOR',
        },
        {
            address: '0x471ea49dd8e60e697f4cac262b5fafcc307506e4',
            decimals: 10,
            symbol: 'xcRMRK',
        },
        {
            address: '0x1f57da732a77636d913c9a75d685b26cc85dcc3a',
            decimals: 18,
            symbol: 'OL',
        },
        {
            address: '0xbc91a632e78db7c74508ea26e91b266aa235f051',
            decimals: 18,
            symbol: 'PXLDY',
        },
        {
            address: '0xb21a7f37970043e66bf38bd18afaf0c6265735f7',
            decimals: 18,
            symbol: 'BUFF',
        },
        {
            address: '0x394da067dffded9c8865e7191d181c6f3cde6277',
            decimals: 18,
            symbol: 'ELITE',
        },
        {
            address: '0xa9543ee7d176f0308f4745d27dddafa0169fe2ee',
            decimals: 18,
            symbol: 'DEVIANT',
        },
        {
            address: '0x0c0eea10fa1ce165d0cbe7eb86181bd6eea6f250',
            decimals: 18,
            symbol: 'SHIHSI',
        },
        {
            address: '0x770d4007d48fcfb22deffdee722c74c22d289940',
            decimals: 18,
            symbol: 'TRIBE',
        },
        {
            address: '0x60215db40b04fe029c42c56ff2e02221c1f288ef',
            decimals: 9,
            symbol: 'CHILLGUY',
        },
        {
            address: '0x6e6b7adfc7db9feeb8896418ac3422966f65d0a5',
            decimals: 18,
            symbol: 'NET',
        },
        {
            address: '0x4f7d2d728ce137dd01ec63ef7b225805c7b54575',
            decimals: 9,
            symbol: 'WALLY',
        },
        {
            address: '0xd0ae648ece22db01345234a6f36166a77585f4e5',
            decimals: 9,
            symbol: 'HAGGIS',
        },
        {
            address: '0x01aac2b594f7bdbec740f0f1aa22910ebb4b74ab',
            decimals: 18,
            symbol: 'UNIO',
        },
        {
            address: '0xc539f8e194569b3db935d70fa2e7cadd7dad7f35',
            decimals: 18,
            symbol: 'Czar',
        },
        {
            address: '0x76ef3a34f697e6ad17f918c880837e8a9424ffb6',
            decimals: 9,
            symbol: 'NEWERA',
        },
        {
            address: '0xdd3b11ef34cd511a2da159034a05fcb94d806686',
            decimals: 18,
            symbol: 'REKT',
        },
        {
            address: '0xf107edabf59ba696e38de62ad5327415bd4d4236',
            decimals: 18,
            symbol: 'SLAP',
        },
        {
            address: '0x69420e3651045bf9455a23a859439d56be14b637',
            decimals: 9,
            symbol: 'ELONOMICS',
        },
        {
            address: '0x9ae63205f675ed66d3c80c4b7739976c195abb4a',
            decimals: 9,
            symbol: 'TRUTHFI',
        },
        {
            address: '0x306227d964511a260d14563fbfa82aa75db404b2',
            decimals: 18,
            symbol: 'MSTR',
        },
        {
            address: '0x69825b4f306bda1285d09fa9119e1ddf086ed588',
            decimals: 9,
            symbol: 'ChillPepe',
        },
        {
            address: '0x960692640ac4986ffce41620b7e3aa03cf1a0e8f',
            decimals: 18,
            symbol: 'MTT',
        },
        {
            address: '0x31b2c59d760058cfe57e59472e7542f776d987fb',
            decimals: 18,
            symbol: 'EDEN',
        },
        {
            address: '0xc3291556a19295ce524fad70054152cf581d8889',
            decimals: 18,
            symbol: 'BASI',
        },
        {
            address: '0x44d34975bf7fe025007e236ce4e0b0395687773b',
            decimals: 18,
            symbol: 'MONET',
        },
        {
            address: '0x000000980d0be42ce4354a67458805f50578fa00',
            decimals: 18,
            symbol: 'ETHGUY',
        },
        {
            address: '0x3c1e2cce6af05d4adf0a9d40a64f1a3dbb47a7b0',
            decimals: 18,
            symbol: 'PIZZA',
        },
        {
            address: '0xba2ae5daebc08a6068533334fbfbe056aa5aad4f',
            decimals: 9,
            symbol: 'DAW',
        },
        {
            address: '0x23aa66620a88af47612a16571a57dc1d2fee79d0',
            decimals: 9,
            symbol: 'MXNBC',
        },
        {
            address: '0xe6829d9a7ee3040e1276fa75293bde931859e8fa',
            decimals: 18,
            symbol: 'cmETH',
        },
        {
            address: '0x6942019ac5d367cb692f8ab5241306a5e048d858',
            decimals: 9,
            symbol: 'STARSHIPHLS',
        },
        {
            address: '0xb7b37b81d4497ab317fc9d4a370cf243043d6bbe',
            decimals: 18,
            symbol: 'VAIX',
        },
        {
            address: '0x4c838d2af967c7e66877e760c4ddf59d4b17cb11',
            decimals: 9,
            symbol: 'Ironyman',
        },
        {
            address: '0xd012ae95934c4ca60348f0f92f5c53b8f56c082d',
            decimals: 9,
            symbol: 'IRONYMAN',
        },
        {
            address: '0xe7c6bf469e97eeb0bfb74c8dbff5bd47d4c1c98a',
            decimals: 18,
            symbol: 'HSK',
        },
        {
            address: '0x95cef13441be50d20ca4558cc0a27b601ac544e5',
            decimals: 18,
            symbol: 'MANTA',
        },
        {
            address: '0x07b8c2805d3aa0477bb7d379fbc72d2b7a5858b8',
            decimals: 9,
            symbol: 'PSUMO',
        },
        {
            address: '0x362033a25b37603d4c99442501fa7b2852ddb435',
            decimals: 9,
            symbol: 'MATRIX',
        },
        {
            address: '0x6c05b8141cefb64502b6dfcaae7c77babbac18fa',
            decimals: 18,
            symbol: 'FU',
        },
        {
            address: '0xe39ae72a78ecda1e7dc7052e7f32e78b8c0c769f',
            decimals: 9,
            symbol: 'TITS',
        },
        {
            address: '0x8df723295214ea6f21026eeeb4382d475f146f9f',
            decimals: 6,
            symbol: 'EURQ',
        },
        {
            address: '0xe726bfea08c4846422e4fc44aa859442b74ae571',
            decimals: 9,
            symbol: 'AVA',
        },
        {
            address: '0x7548ee1f9aae88f198c76975fc0e1300a5f917b2',
            decimals: 9,
            symbol: 'EPF',
        },
        {
            address: '0x0138f5e99cfdffbacf36e543800c19ef16fa294b',
            decimals: 18,
            symbol: 'PROPHT',
        },
        {
            address: '0x5f4ab80c2c7755d565371236f090597921d18ee5',
            decimals: 9,
            symbol: 'WAGMI',
        },
        {
            address: '0x7099ab9e42fa7327a6b15e0a0c120c3e50d11bec',
            decimals: 9,
            symbol: 'BTC',
        },
        {
            address: '0x5651fa7a726b9ec0cad00ee140179912b6e73599',
            decimals: 18,
            symbol: 'OORT',
        },
        {
            address: '0xef87f4608e601e8564800265aee1c1ffadf73283',
            decimals: 6,
            symbol: 'fwUSDT',
        },
        {
            address: '0x8a6fe57c08c84e0f4ee97aae68a62e820a37d259',
            decimals: 18,
            symbol: 'fwDAI',
        },
        {
            address: '0x0492560fa7cfd6a85e50d8be3f77318994f8f429',
            decimals: 6,
            symbol: 'fwUSDC',
        },
        {
            address: '0x698e222aaa7082bdae18cb4722bc5aebb31c2002',
            decimals: 9,
            symbol: 'GNOME',
        },
        {
            address: '0x960afa4071724ae99e957e501de95dd962c09817',
            decimals: 14,
            symbol: 'FAST',
        },
        {
            address: '0x1692111df125ba1543f82e77757253234594ea30',
            decimals: 9,
            symbol: 'PURPE',
        },
        {
            address: '0xc83e27f270cce0a3a3a29521173a83f402c1768b',
            decimals: 6,
            symbol: 'USDQ',
        },
        {
            address: '0x3f7db133aff2f012c8534b36ab9731fe9ee7bd43',
            decimals: 18,
            symbol: 'MONEROCHAN',
        },
        {
            address: '0x666612a79602661e3eb8918b21d2a7898334ac66',
            decimals: 9,
            symbol: 'CHILLPURPLEGUY',
        },
        {
            address: '0x109ba5f0230b7b39e4a8ab56e7361db89fa0e108',
            decimals: 18,
            symbol: 'TURBO',
        },
        {
            address: '0xff0d586354556bf34bfaa749b11d6a35f9a44b08',
            decimals: 9,
            symbol: 'GSTD',
        },
        {
            address: '0xa44136dc2e7a1543abbbf1c2a97e57c8d885e0be',
            decimals: 9,
            symbol: 'PFROG',
        },
        {
            address: '0xf74f23b65e15910676877d45ced8ee0556a9c508',
            decimals: 9,
            symbol: 'DOGE',
        },
        {
            address: '0x031b8d752d73d7fe9678acef26e818280d0646b4',
            decimals: 18,
            symbol: 'SOVRN',
        },
        {
            address: '0x425087bf4969f45818c225ae30f8560ce518582e',
            decimals: 18,
            symbol: 'LFDOG',
        },
        {
            address: '0xb0ac2b5a73da0e67a8e5489ba922b3f8d582e058',
            decimals: 18,
            symbol: 'SHIRO',
        },
        {
            address: '0x5c515aa65307a0859486eabb4f338992a38db674',
            decimals: 18,
            symbol: 'FANG',
        },
        {
            address: '0x88c274eef190954b2b2cabb3fc5a6532f7fef285',
            decimals: 9,
            symbol: 'ETH',
        },
        {
            address: '0xeeacc51af745846ddf46012b46c6910ea9b12898',
            decimals: 18,
            symbol: 'DOGC',
        },
        {
            address: '0x4cd1b2874e020c5bf08c4be18ab69ca86ec25fef',
            decimals: 18,
            symbol: 'CRYORAT',
        },
        {
            address: '0x5f4ca0e92226af14024c6b2ec0ef56535b2c94a0',
            decimals: 9,
            symbol: 'GROKAPP',
        },
        {
            address: '0xe344fb85b4fab79e0ef32ce77c00732ce8566244',
            decimals: 8,
            symbol: 'FILM',
        },
        {
            address: '0x768be934ab424b0fe8cdcd1ae3ec03712af0b49f',
            decimals: 9,
            symbol: 'SKI',
        },
        {
            address: '0xd19b72e027cd66bde41d8f60a13740a26c4be8f3',
            decimals: 18,
            symbol: 'SUIAI',
        },
        {
            address: '0x910812c44ed2a3b611e4b051d9d83a88d652e2dd',
            decimals: 18,
            symbol: 'PLEDGE',
        },
        {
            address: '0xce6b17c16df188fa721632b770a2ee5530589716',
            decimals: 18,
            symbol: 'ETFS',
        },
        {
            address: '0x8c41455aaa8d6aba3150058d4964349294bf78a3',
            decimals: 9,
            symbol: 'BULL',
        },
        {
            address: '0x0000000000c5dc95539589fbd24be07c6c14eca4',
            decimals: 18,
            symbol: 'CULT',
        },
        {
            address: '0x2f18e96cc1421a46c2b83ade73d622ae39c87c10',
            decimals: 9,
            symbol: 'TSUKI',
        },
        {
            address: '0x182a6a99ed6267357bec50a2168cfdbd84deb53a',
            decimals: 18,
            symbol: 'GLOOB',
        },
        {
            address: '0xcc629b7dbb37a726a9bb64c58c3a12b484cfe489',
            decimals: 18,
            symbol: 'REMICAT',
        },
        {
            address: '0x3073f7aaa4db83f95e9fff17424f71d4751a3073',
            decimals: 8,
            symbol: 'MOVE',
        },
        {
            address: '0xbb8ecf8d1342e086c9a751ee1b31a8320007379f',
            decimals: 18,
            symbol: 'NXR',
        },
        {
            address: '0x74697d4fd0536c6885334b11d5c6dbf58729369f',
            decimals: 9,
            symbol: 'NEKO',
        },
        {
            address: '0xe0805c80588913c1c2c89ea4a8dcf485d4038a3e',
            decimals: 9,
            symbol: 'CARD',
        },
        {
            address: '0xc0f8a7bc0c4dcf8d68d2f1a8b9ce31d9bf894ec8',
            decimals: 9,
            symbol: 'CHAINSAW',
        },
        {
            address: '0x3bbfb303842dd4a76da4c927be644e9cf3170afd',
            decimals: 18,
            symbol: 'xCREDI',
        },
        {
            address: '0x63b48b8ef46ffc118cd0c6733520ee6615c92883',
            decimals: 9,
            symbol: 'BITDOGE',
        },
        {
            address: '0x2a414884a549ef5716bc1a4e648d3dc03f08b2cf',
            decimals: 18,
            symbol: 'PERQ',
        },
        {
            address: '0xf4338b5bd5c956b3fcde7f5cefd6caa0ab113703',
            decimals: 9,
            symbol: 'DINO',
        },
        {
            address: '0x3333ae5f9a8e27923fa0648617b4c69d59b661f0',
            decimals: 9,
            symbol: 'SPROTO',
        },
        {
            address: '0x0ada457783ccd622cefd56ecb0d7559efede0145',
            decimals: 9,
            symbol: 'DAVID',
        },
        {
            address: '0x42069e96bf0a3a41636414dabe2cb4b9c6e3e0a7',
            decimals: 9,
            symbol: 'JOYCAT',
        },
        {
            address: '0x88888a191bdfdb4783ec509fd11b098007e2357f',
            decimals: 9,
            symbol: 'SkiCat',
        },
        {
            address: '0x7412cd19cd1b0b4b644ce8767ec2fbe81e690ff5',
            decimals: 9,
            symbol: 'phrog',
        },
        {
            address: '0x1ce765842c313050048ce53e6865b89e6c2876cb',
            decimals: 9,
            symbol: 'MONK',
        },
        {
            address: '0xe63b211d095bc7cf9bee028005d5f5604aefc729',
            decimals: 9,
            symbol: 'PoE2',
        },
        {
            address: '0x0e228376e458a66da1ff2428ef2ef8fe4c31783d',
            decimals: 9,
            symbol: 'DOGESON',
        },
        {
            address: '0x8e1ce8013262fadeee1292c814cc8b6a6a336920',
            decimals: 9,
            symbol: 'Minidoge',
        },
        {
            address: '0x614a48c41be6ba6762b63a92cc33cfb5e8149332',
            decimals: 9,
            symbol: 'DUSTY',
        },
        {
            address: '0x3d39e1f320d0468a8baffe77262a3f675f5b3f63',
            decimals: 18,
            symbol: 'PENGU',
        },
        {
            address: '0xf477ac7719e2e659001455cdda0cc8f3ad10b604',
            decimals: 18,
            symbol: 'AUTOS',
        },
        {
            address: '0x946fb08103b400d1c79e07acccdef5cfd26cd374',
            decimals: 18,
            symbol: 'KIP',
        },
        {
            address: '0x1202f5c7b4b9e47a1a484e8b270be34dbbc75055',
            decimals: 18,
            symbol: 'wstUSR',
        },
        {
            address: '0x558e7139800f8bc119f68d23a6126fffd43a66a6',
            decimals: 18,
            symbol: 'U2U',
        },
        {
            address: '0xadd39272e83895e7d3f244f696b7a25635f34234',
            decimals: 18,
            symbol: 'PEPU',
        },
        {
            address: '0x64c5cba9a1bfbd2a5faf601d91beff2dcac2c974',
            decimals: 18,
            symbol: 'MYSTERY',
        },
        {
            address: '0x57926998725cbcf319373550307c67830abf6187',
            decimals: 18,
            symbol: 'YOLK',
        },
        {
            address: '0x65086e9928d297ebae6a7d24d8c3aea6f8f6b5d7',
            decimals: 18,
            symbol: 'TOKI',
        },
        {
            address: '0xba4dc0a3379f0c49e8998766c18af28d7cd744ee',
            decimals: 9,
            symbol: 'HOODRAT',
        },
        {
            address: '0x72fdc31f4a9a1edf6b6132d3c1754f1cdcf5d9b1',
            decimals: 18,
            symbol: 'QBX',
        },
        {
            address: '0x5f531738eb92f34b8550237befdd4247d3525411',
            decimals: 18,
            symbol: 'BUCK',
        },
        {
            address: '0x2282c726f54c93193e6b8e5bf1b82303dc11d36e',
            decimals: 6,
            symbol: 'DAY',
        },
        {
            address: '0x68e2e5c9dff32419a108713f83274a4fb5e194ca',
            decimals: 18,
            symbol: 'GLS',
        },
        {
            address: '0x01dfb5c49b583b1a81da000d1183668606532c7f',
            decimals: 18,
            symbol: 'POND',
        },
        {
            address: '0x26e550ac11b26f78a04489d5f20f24e3559f7dd9',
            decimals: 9,
            symbol: 'KEKIUS',
        },
        {
            address: '0x21cd589a989615a9e901328d3c089bbca16d00b2',
            decimals: 9,
            symbol: 'XMONEY',
        },
        {
            address: '0xb6c0189080a6441caf056b856dd4d795b909c460',
            decimals: 18,
            symbol: 'MOON',
        },
        {
            address: '0x5c162ec1c1679c67728d824defc0b415a97539e5',
            decimals: 18,
            symbol: 'CRAZE',
        },
        {
            address: '0xfe3f988a90dea3ee537bb43ec1aca7337a15d002',
            decimals: 18,
            symbol: 'PHX',
        },
        {
            address: '0xa9a35b13fad96a1168fab9f96b7aec011197912a',
            decimals: 9,
            symbol: 'YUMI',
        },
        {
            address: '0xa9d0726d0188a1e503fb959e5fc57d658d508d2a',
            decimals: 9,
            symbol: 'DOLLY',
        },
        {
            address: '0x283e6a6e27365a7363a8e8011d5bd24735c8ae23',
            decimals: 18,
            symbol: 'BURGERS',
        },
        {
            address: '0x2ac96c5417ce01ac87f4ac01a353605fdceb0ed0',
            decimals: 9,
            symbol: 'XMAIL',
        },
        {
            address: '0x5ee3188a3f8adee1d736edd4ae85000105c88f66',
            decimals: 18,
            symbol: 'PEN',
        },
        {
            address: '0x4206929f30142bcbc39c3aed61bd9d76b4c9203d',
            decimals: 9,
            symbol: 'PEPE',
        },
        {
            address: '0x8e4f1ce473b292d56934c36976356e3e22c35585',
            decimals: 18,
            symbol: 'FIAS',
        },
        {
            address: '0x7296eaa225804451a91616b29d040cab05435f0d',
            decimals: 8,
            symbol: 'WAVES',
        },
        {
            address: '0x7ff7fa94b8b66ef313f7970d4eebd2cb3103a2c0',
            decimals: 18,
            symbol: 'VANA',
        },
        {
            address: '0x157a6df6b74f4e5e45af4e4615fde7b49225a662',
            decimals: 18,
            symbol: 'ISLAND',
        },
        {
            address: '0x3f962f6325e61b90bae9971f110863c4e67036e2',
            decimals: 18,
            symbol: 'SQUARES',
        },
        {
            address: '0x6c93553986f7bbb6aaf6a314e1c077804da950d5',
            decimals: 18,
            symbol: 'GOBS',
        },
        {
            address: '0x69e15ab0fd240de689d09e4851181a6667968008',
            decimals: 9,
            symbol: 'PEPE',
        },
        {
            address: '0x6068b2c3e9a9a30d417854482861f28118a5e12d',
            decimals: 18,
            symbol: 'TOM3',
        },
        {
            address: '0x22a03f3bfc1fab4938685e04afe908ff39509425',
            decimals: 9,
            symbol: 'PENGU',
        },
        {
            address: '0x698d12e68b9770b59edf9c7509b932aa1e921933',
            decimals: 18,
            symbol: 'Sadge',
        },
        {
            address: '0xf2fc894381792ded27a7f08d9f0f246363cbe1ea',
            decimals: 18,
            symbol: 'MATRIX',
        },
        {
            address: '0xc4441c2be5d8fa8126822b9929ca0b81ea0de38e',
            decimals: 18,
            symbol: 'USUAL',
        },
        {
            address: '0x5b63ed76bd668421fe8accf6d2e33f5691b6861d',
            decimals: 9,
            symbol: 'DOG',
        },
        {
            address: '0xf38774a034f5f533d7f9e2ba6b7f3a7542714fa9',
            decimals: 18,
            symbol: 'HSTK',
        },
        {
            address: '0x33be6aecab6b93d6752cab968505ef05d3117cfe',
            decimals: 18,
            symbol: 'IONP',
        },
        {
            address: '0x2a92525fda8d3ab481f8e2a913b64b64bd1c9fdd',
            decimals: 18,
            symbol: '$WELF',
        },
        {
            address: '0xd8dd38ca016f3e0b3bc545d33cce72af274ce075',
            decimals: 18,
            symbol: 'SWING',
        },
        {
            address: '0x675b68aa4d9c2d3bb3f0397048e62e6b7192079c',
            decimals: 9,
            symbol: 'FUEL',
        },
        {
            address: '0xd0e6d04c2f105344860d07912a857ad21204fc97',
            decimals: 18,
            symbol: 'NeoTech',
        },
        {
            address: '0xa9f94f19abf3089d535b1de2cc058a365ea716c7',
            decimals: 18,
            symbol: 'AITA',
        },
        {
            address: '0xfd2cf2202f049064865dc32c6cf81eeb34074b39',
            decimals: 18,
            symbol: 'DGH',
        },
        {
            address: '0xc575bd129848ce06a460a19466c30e1d0328f52c',
            decimals: 18,
            symbol: 'RAI',
        },
        {
            address: '0x2cc7a972ebc1865b346085655f929abfa74cd4dc',
            decimals: 18,
            symbol: 'SHIFU',
        },
        {
            address: '0x06b964d96f5dcf7eae9d7c559b09edce244d4b8e',
            decimals: 18,
            symbol: 'USUALX',
        },
        {
            address: '0xdee6cdd28da9f51e3a8421395973894a884f3b2d',
            decimals: 9,
            symbol: 'HOODRAT',
        },
        {
            address: '0x5e3f09ab25548616b4b97f6163ff19cf6027930d',
            decimals: 9,
            symbol: 'USACOIN',
        },
        {
            address: '0x6965fb688861c004f4f0117980c519b342419941',
            decimals: 18,
            symbol: 'NUMBER',
        },
        {
            address: '0x4bd0f1886010253a18bbb401a788d8972c155b9d',
            decimals: 18,
            symbol: 'STAX',
        },
        {
            address: '0xdb99b0477574ac0b2d9c8cec56b42277da3fdb82',
            decimals: 18,
            symbol: 'DECT',
        },
        {
            address: '0x253ed65f440a5bd3902d7f4c03a2e29a57618914',
            decimals: 9,
            symbol: 'GS',
        },
        {
            address: '0x66f37dfaa00db7fc2239b14e83f566d7be84b838',
            decimals: 18,
            symbol: 'CASINO',
        },
        {
            address: '0xaec613188b1e178d42a05d352044d54854c3196a',
            decimals: 18,
            symbol: 'DESCI',
        },
        {
            address: '0x97ad75064b20fb2b2447fed4fa953bf7f007a706',
            decimals: 18,
            symbol: 'beraSTONE',
        },
        {
            address: '0x04f121600c8c47a754636fc9d75661a9525e05d5',
            decimals: 18,
            symbol: 'STARS',
        },
        {
            address: '0x7d3e4165fd7d8590fb2a415a550f7bdece5c4f52',
            decimals: 18,
            symbol: 'DNA',
        },
        {
            address: '0x2069e1dc5889de355dd2e8e2779093ca8d676e01',
            decimals: 18,
            symbol: 'RAID',
        },
        {
            address: '0x62b6d83d5afbf395ece55136e7161c119a8fd80c',
            decimals: 18,
            symbol: 'HOODRAT',
        },
        {
            address: '0x8f66cf0f1db84f8ee2a46352409370a69ae4e059',
            decimals: 9,
            symbol: 'KHAMOO',
        },
        {
            address: '0x746ba71c33856d2189587930933a73344cf4bd89',
            decimals: 9,
            symbol: 'KIKI',
        },
        {
            address: '0x4fd67c2d9e8c4fdd9c66954bafe124ca50fc1819',
            decimals: 18,
            symbol: 'RMNER',
        },
        {
            address: '0x421b05cf5ce28cb7347e73e2278e84472f0e4a88',
            decimals: 18,
            symbol: 'SEN',
        },
        {
            address: '0x1fe9e6880e62f5298521660cf97274db411c905e',
            decimals: 9,
            symbol: 'AIYANA',
        },
        {
            address: '0xabab3b0db38f2303acbcab672905e41a18e396d8',
            decimals: 9,
            symbol: 'APEMAN',
        },
        {
            address: '0x4eca7761a516f8300711cbf920c0b85555261993',
            decimals: 18,
            symbol: 'GOATX',
        },
        {
            address: '0x6a89228055c7c28430692e342f149f37462b478b',
            decimals: 18,
            symbol: 'SPECTRA',
        },
        {
            address: '0x8abb7c18d713a477d345d92fcfccf26c1d971009',
            decimals: 9,
            symbol: 'MOJO',
        },
        {
            address: '0x3100981254074f478cd4049fc9311e1c12cae0af',
            decimals: 9,
            symbol: '$BLOOP',
        },
        {
            address: '0xf576e1f09e2eb4992d5ffdf68bec4ea489fa417d',
            decimals: 18,
            symbol: 'ULTI',
        },
        {
            address: '0x69695af00b070edf9810d1413d36bdbbf5c0021f',
            decimals: 9,
            symbol: 'KIWI',
        },
        {
            address: '0x1095ae55b62174d9ea3bc6a4136acacad461d7ce',
            decimals: 18,
            symbol: 'ITHACA',
        },
        {
            address: '0xd459eceddafcc1d876a3be7290a2e16e801073a3',
            decimals: 18,
            symbol: 'BB',
        },
        {
            address: '0x2025b2f4c7abe6dcb3843c62c32dfa14990a6269',
            decimals: 9,
            symbol: 'SNEK',
        },
        {
            address: '0xaefec06882915cd292d6f2d5438e3b28bfb63514',
            decimals: 9,
            symbol: 'ZEUS',
        },
        {
            address: '0xaca98ab4e400e932bf4b20032becb7c48bfa781a',
            decimals: 9,
            symbol: 'FEFE',
        },
        {
            address: '0xb44bb60e8ced2b4523eb65d927bca4f4b2252e0b',
            decimals: 9,
            symbol: 'BABYKEKIUS',
        },
        {
            address: '0x04ccd55dfe8de5a356a889571a5a3a416c415334',
            decimals: 9,
            symbol: 'DOGIUS',
        },
        {
            address: '0x2c9095ca2c823f31162a0e01eec0355f58898fd0',
            decimals: 9,
            symbol: 'KMX500',
        },
        {
            address: '0x47000a7b27a75d44ffadfe9d0b97fa04d569b323',
            decimals: 9,
            symbol: 'TRUMPIUS',
        },
        {
            address: '0xd475fd7ae796973c49d28cba2a0b3656e1f27dab',
            decimals: 9,
            symbol: 'TRUMPIUS',
        },
        {
            address: '0x6e8021749df4ee00fbd4613c4dbcf2be61286041',
            decimals: 9,
            symbol: 'MINIKEKIUS',
        },
        {
            address: '0x95c6e4d07f9c06488ada0a18ddba3450cf708d3e',
            decimals: 9,
            symbol: 'EM',
        },
        {
            address: '0x28c9e30eda289ee316231701585f8de1c47f5862',
            decimals: 9,
            symbol: 'DICKUS',
        },
        {
            address: '0xbbbb2d4d765c1e455e4896a64ba3883e914abbbb',
            decimals: 18,
            symbol: 'BMP',
        },
        {
            address: '0x270ca21eb1a37cfe0e9a0e7582d8f897e013cdff',
            decimals: 18,
            symbol: 'DOGIUS',
        },
        {
            address: '0xf75302720787c2a2176c87b1919059c4eaac8b98',
            decimals: 18,
            symbol: 'CFGI',
        },
        {
            address: '0x47000bd34d9a7b7cdbeef4ec2ae452e73280a8b5',
            decimals: 9,
            symbol: 'SHRUBIUS',
        },
        {
            address: '0x83599937c2c9bea0e0e8ac096c6f32e86486b410',
            decimals: 18,
            symbol: 'liquidBeraETH',
        },
        {
            address: '0xc673ef7791724f0dcca38adb47fbb3aef3db6c80',
            decimals: 8,
            symbol: 'liquidBeraBTC',
        },
        {
            address: '0x694208754de9f72abef9b987893d30ad84e59646',
            decimals: 9,
            symbol: 'FOG',
        },
        {
            address: '0x40ba5a4436a5b78183fe6dbea95e0659f51096d7',
            decimals: 18,
            symbol: 'VSDOGE',
        },
        {
            address: '0xb868cca38a8e6348d8d299c9b3c80e63d45abe4c',
            decimals: 9,
            symbol: 'FUSION',
        },
        {
            address: '0x4af1bc87e43ddb22188bb3791ae00341586fe8fc',
            decimals: 18,
            symbol: 'CHAMP',
        },
        {
            address: '0x76887cb94cf29ec539b3219ba62104be04f26a5c',
            decimals: 18,
            symbol: 'NITRO',
        },
        {
            address: '0x4448726b23483927c492f09c1dbfdffd3967b452',
            decimals: 9,
            symbol: 'PERCY',
        },
        {
            address: '0x156994e6cabea296e7a73cf3742355bf71a64cec',
            decimals: 9,
            symbol: 'RANDOM9',
        },
        {
            address: '0xc9089c58c380d3e9ce812ddb878aae9828de8436',
            decimals: 9,
            symbol: 'ADRIAN',
        },
        {
            address: '0x1a5f590a70f3f4be08a1d447a95899086d960ed1',
            decimals: 9,
            symbol: 'XYZ',
        },
        {
            address: '0x2a22137ba758b8dbe6d6ac4e90d8e332d0800371',
            decimals: 9,
            symbol: 'DELBERT',
        },
        {
            address: '0x15cdf971fb7b5074b497add287185ab64cc0c375',
            decimals: 9,
            symbol: 'HOODRAT',
        },
        {
            address: '0xd2dc8ecd7d57c862d8b27361a444bf37c350ac3a',
            decimals: 9,
            symbol: 'VICKY',
        },
        {
            address: '0xca4f53e6117623992126a9a45ce61682fe8678df',
            decimals: 9,
            symbol: 'POPPY',
        },
        {
            address: '0xc620cb64c6c504f417da517048ae2dab7cca75fa',
            decimals: 18,
            symbol: 'beraSBTC',
        },
        {
            address: '0x1a330f41c728c3b9f6b5175cb8dcf324b1e456b4',
            decimals: 18,
            symbol: 'DADDY',
        },
        {
            address: '0x6313d57946a12cbd4401ee1b458e0887622cc2c5',
            decimals: 9,
            symbol: 'SAN',
        },
        {
            address: '0x2c390d16597ae3ece2a67f52ccbe2a10bbeb0d6b',
            decimals: 9,
            symbol: 'GOA',
        },
        {
            address: '0xab4a28211624496afa30138c39aa10f8aaa511ec',
            decimals: 9,
            symbol: 'GOA',
        },
        {
            address: '0x076011c42636cadb0e5f30865649c91071f23c93',
            decimals: 9,
            symbol: 'XMoney',
        },
        {
            address: '0xda3ca58d936ebdc7e8c461bfc27177a3a075d9b4',
            decimals: 9,
            symbol: 'BETTY',
        },
        {
            address: '0x95ad53e32942c0cf9fd60208964782af8bedb709',
            decimals: 9,
            symbol: 'KUMA',
        },
        {
            address: '0xe355de6a6043b0580ff5a26b46051a4809b12793',
            decimals: 18,
            symbol: '4EVER',
        },
        {
            address: '0x4dfd742c6e5e28f11bcbcf6c5e51a965d15ea315',
            decimals: 18,
            symbol: 'AMINO',
        },
        {
            address: '0x95eb576762c137b88034706ce04c58b13cc8fa22',
            decimals: 9,
            symbol: 'TACITUS',
        },
        {
            address: '0x429f0d8233e517f9acf6f0c8293bf35804063a83',
            decimals: 18,
            symbol: 'POWER',
        },
        {
            address: '0xf3fcb171624aad107117a439b8a4fb0febe3dec5',
            decimals: 18,
            symbol: 'CASHNA',
        },
        {
            address: '0xc23d58dbb28c5051a7193d7c2e4e03f8e5dbd1da',
            decimals: 9,
            symbol: 'CWH',
        },
        {
            address: '0x79bbf4508b1391af3a0f4b30bb5fc4aa9ab0e07c',
            decimals: 18,
            symbol: 'Anon',
        },
        {
            address: '0x70001d8306850a0416095482886c9fc7f6eb6f78',
            decimals: 9,
            symbol: 'MEGA',
        },
        {
            address: '0x30bef9b267528d69448875a25dde3916bc341c44',
            decimals: 9,
            symbol: 'WiLLY',
        },
        {
            address: '0x47000c9e31dbcd1e728a0f41892cb6ec79f9c838',
            decimals: 9,
            symbol: 'MVRS',
        },
        {
            address: '0xc6d4abdd9e04f033f35caa78775e801b2d7bb827',
            decimals: 18,
            symbol: 'MUNM',
        },
        {
            address: '0xca76bf98b6e44df7360da8650e701f6d9d94bb58',
            decimals: 18,
            symbol: 'MK',
        },
        {
            address: '0x841a3083074b1a40b644bf2ba2491a731b6da277',
            decimals: 12,
            symbol: 'FATAL',
        },
        {
            address: '0x64c5c3225eaadf935e8807353ae5fdef525b0384',
            decimals: 9,
            symbol: '$RATTY',
        },
        {
            address: '0xb213733539e0f4255bbe663152bebbaff4337e05',
            decimals: 9,
            symbol: 'WEIDEL',
        },
        {
            address: '0x84dbfc16e8c8c237d8a94b5db1850b496c998601',
            decimals: 9,
            symbol: 'NUPEPE',
        },
        {
            address: '0x07c8b9deae988726fd443ea8c3c1367f98a31f9c',
            decimals: 18,
            symbol: 'BIOHACK',
        },
        {
            address: '0xa02c49da76a085e4e1ee60a6b920ddbc8db599f4',
            decimals: 18,
            symbol: 'TREAT',
        },
        {
            address: '0x1d5ae334d760032417691bb1e33601b08e251aee',
            decimals: 18,
            symbol: 'WCAW',
        },
        {
            address: '0xac8a154eb109d05b40cecf10f14205db87e1e1c4',
            decimals: 6,
            symbol: 'fella',
        },
        {
            address: '0xddbcdd8637d5cedd15eeee398108fca05a71b32b',
            decimals: 18,
            symbol: 'CRAI',
        },
        {
            address: '0x81e9e6011036f8ce5a9f693dbf3b31ab98314230',
            decimals: 9,
            symbol: 'ERS',
        },
        {
            address: '0x49de099d090eb8bd31a4c46d2008d0c6e58f7b26',
            decimals: 9,
            symbol: 'FROGGY',
        },
        {
            address: '0x3ebc5e3469ec803370d2847957164e6f728f4afb',
            decimals: 9,
            symbol: 'MBGA',
        },
        {
            address: '0xb1d1eae60eea9525032a6dcb4c1ce336a1de71be',
            decimals: 18,
            symbol: 'DRV',
        },
        {
            address: '0x9d8ff2f47c779bb1e3a2c9885171f71625fb21a1',
            decimals: 9,
            symbol: 'MANEN',
        },
        {
            address: '0x1010107b4757c915bc2f1ecd08c85d1bb0be92e0',
            decimals: 18,
            symbol: 'BRAIN',
        },
        {
            address: '0x32f4768fc4a238a58fc9da408d9a0da4333012e4',
            decimals: 18,
            symbol: 'NAI',
        },
        {
            address: '0xcea39ede56cbd2b6bc1aba6e8333956f704dc7a0',
            decimals: 9,
            symbol: 'URMOM',
        },
        {
            address: '0xc8a834e93a6457add51b61d8361b0537a30672e3',
            decimals: 9,
            symbol: 'TRUMP',
        },
        {
            address: '0xf1bb41f9ed87e6c7e1f70e921b7b4bee1df7ae9c',
            decimals: 18,
            symbol: 'DCOIN',
        },
        {
            address: '0x7ddc68614eb75d958663e479bdd6bb6255add57a',
            decimals: 9,
            symbol: 'VGOD',
        },
        {
            address: '0x3f769596621a51bbce37edfe0cd3c934b8fffcc9',
            decimals: 9,
            symbol: 'STR',
        },
        {
            address: '0x786a6743efe9500011c92c7d8540608a62382b6f',
            decimals: 18,
            symbol: 'ALU',
        },
        {
            address: '0xaf04f0912e793620824f4442b03f4d984af29853',
            decimals: 18,
            symbol: 'HYDRA',
        },
        {
            address: '0x3e6a1b21bd267677fa49be6425aebe2fc0f89bde',
            decimals: 18,
            symbol: 'QBIO',
        },
        {
            address: '0xb0415d55f2c87b7f99285848bd341c367feac1ea',
            decimals: 18,
            symbol: '1R0R',
        },
        {
            address: '0xb76b1d924e9d8f793baa293f1029b8a9580c4026',
            decimals: 9,
            symbol: 'SBR',
        },
        {
            address: '0xd0991aa74e16774735bf71c02d6e804ce4ebed09',
            decimals: 18,
            symbol: 'RAMON',
        },
        {
            address: '0xff04b6030da81eda1abf26aabd42c3c120831c0d',
            decimals: 9,
            symbol: 'TRUMP',
        },
        {
            address: '0xc302d61aa1d7b259857c61078b270098c4430277',
            decimals: 9,
            symbol: 'USDT',
        },
        {
            address: '0xd8da35008f45db845c86ded6febd02c3f4b5801a',
            decimals: 9,
            symbol: 'VITALIK',
        },
        {
            address: '0x78dbe8a761ea452ddc9ee3321394f846967a96f8',
            decimals: 18,
            symbol: 'XENAI',
        },
        {
            address: '0x76fd9febfece13a88377cec82a19429c94ef925b',
            decimals: 9,
            symbol: 'MIL#9286',
        },
        {
            address: '0xa1d5f09aec852a14a9dde9abb8ed62357378e99a',
            decimals: 9,
            symbol: 'MILADY',
        },
        {
            address: '0x05a44929667a9578f2d0dd335a2c2f05061b26f5',
            decimals: 18,
            symbol: 'ALLN',
        },
        {
            address: '0x8fe4cea3835eff16c5f2d6f1daf3b7c684211559',
            decimals: 18,
            symbol: 'PUTIN',
        },
        {
            address: '0xb3a0f70c913aa04404bd177be9e20b47613830b6',
            decimals: 9,
            symbol: 'AIB',
        },
        {
            address: '0x13d074303c95a34d304f29928dc8a16dec797e9e',
            decimals: 18,
            symbol: 'LAK3',
        },
        {
            address: '0x4c1746a800d224393fe2470c70a35717ed4ea5f1',
            decimals: 18,
            symbol: 'PLUME',
        },
        {
            address: '0x65c55f33f9493e8702feea89b4fa357283ed3841',
            decimals: 18,
            symbol: 'BFX',
        },
        {
            address: '0xbd95cf04c53df35c3ab39e1446baed2b3369a3d1',
            decimals: 9,
            symbol: 'TIFFANY',
        },
        {
            address: '0x7ef24f3fc18475f0e874455688b9a11a754a3102',
            decimals: 18,
            symbol: 'RXS',
        },
        {
            address: '0x3fdd34761415082a75e61b8fc5ce333d7e0ef088',
            decimals: 9,
            symbol: 'CAUCUS',
        },
        {
            address: '0x523ca95e311124a6426906f5fd2e9f50930745ed',
            decimals: 9,
            symbol: 'TRUMPETF',
        },
        {
            address: '0x525536d71848f21b66da0d239546c50ee4c1a358',
            decimals: 9,
            symbol: 'CTF',
        },
        {
            address: '0x3e95371532cac5e97a799b0861dfff0ceab4e668',
            decimals: 9,
            symbol: 'STARGATE',
        },
        {
            address: '0x56cfc19d8cbf7d417d370844249be9cb2d2e19a1',
            decimals: 9,
            symbol: 'DOGECAUCUS',
        },
        {
            address: '0xd881a7f17ed2c71fd671afba3a9b30eb914aea5f',
            decimals: 8,
            symbol: 'DOGE',
        },
        {
            address: '0x399ef659fdead53b3e7f97e9491e727925667945',
            decimals: 18,
            symbol: 'L1X',
        },
        {
            address: '0x282a69142bac47855c3fbe1693fcc4ba3b4d5ed6',
            decimals: 18,
            symbol: 'CARROT',
        },
        {
            address: '0xb78c0dfe29f271b53ef44c1bc0b1d1f49b535503',
            decimals: 9,
            symbol: 'MEGA',
        },
        {
            address: '0x53cce6d10e43d1b3d11872ad22ec2acd8d2537b8',
            decimals: 18,
            symbol: 'SMOL',
        },
        {
            address: '0x4dc26fc5854e7648a064a4abd590bbe71724c277',
            decimals: 18,
            symbol: 'ANIME',
        },
        {
            address: '0x4eddb15a0abfa2c349e8065af9214e942d9a6d36',
            decimals: 18,
            symbol: 'XYRO',
        },
        {
            address: '0x99999999999999cc837c997b882957dafdcb1af9',
            decimals: 18,
            symbol: 'WUSDN',
        },
        {
            address: '0xe1cae457420dd95c4adf1db1a7c7872823c23dc7',
            decimals: 18,
            symbol: 'NDAS',
        },
        {
            address: '0x3993d8aa0b389c649909f427d1277df3a895d361',
            decimals: 9,
            symbol: 'NDAS',
        },
        {
            address: '0xe24a3dc889621612422a64e6388927901608b91d',
            decimals: 18,
            symbol: 'sUSN',
        },
        {
            address: '0x76a0e27618462bdac7a29104bdcfff4e6bfcea2d',
            decimals: 18,
            symbol: 'SOSO',
        },
        {
            address: '0xfa1b1f13080857bf373de0de93970c96d2c29fd0',
            decimals: 18,
            symbol: 'ONDOAI',
        },
        {
            address: '0x88171e4fd82c2e83efa13c031056884360aecf96',
            decimals: 18,
            symbol: 'Doge2014',
        },
        {
            address: '0x3da6d19515909ca1c89d257997562f3bceaac88e',
            decimals: 9,
            symbol: 'ETHEREUM',
        },
        {
            address: '0x615647516a44cbc4c5f360935188d654c231af5f',
            decimals: 9,
            symbol: 'VINE',
        },
        {
            address: '0x1c9b158e71bc274ea5519ca57a73e337cac72b3a',
            decimals: 18,
            symbol: 'GrowAI',
        },
        {
            address: '0x464a24058f3d192619d24c348f6f2f0f26cbde13',
            decimals: 0,
            symbol: 'DEI',
        },
        {
            address: '0x0943d06a5ff3b25ddc51642717680c105ad63c01',
            decimals: 18,
            symbol: 'Ascend',
        },
        {
            address: '0x32462ba310e447ef34ff0d15bce8613aa8c4a244',
            decimals: 18,
            symbol: 'DHN',
        },
        {
            address: '0x960fce8724aa127184b6d13af41a711755236c77',
            decimals: 9,
            symbol: 'henlo',
        },
        {
            address: '0x8cd5bb658249c5f62fc4040e2c919d1711b14b5d',
            decimals: 9,
            symbol: 'SEEK',
        },
        {
            address: '0x2e3fb0298a8dde91860ee8d7b1b0a11d7a1101c0',
            decimals: 9,
            symbol: 'FARTCOIN',
        },
        {
            address: '0xb33d999469a7e6b9ebc25a3a05248287b855ed46',
            decimals: 18,
            symbol: 'FLOCK',
        },
        {
            address: '0x5dac0e3e4bc880fab204c243b62cfd828c1f79e2',
            decimals: 9,
            symbol: 'XCHAT',
        },
        {
            address: '0xe410d33fed4593aa075974bc4a351ae7215e0c63',
            decimals: 18,
            symbol: 'HASHS',
        },
        {
            address: '0xd1de603884e6424241caf53efa846e7c6163755c',
            decimals: 18,
            symbol: 'ENERGY',
        },
        {
            address: '0x89ca762f778c82120c13c79a9bfbdf6e8e663ab4',
            decimals: 18,
            symbol: 'RISE',
        },
        {
            address: '0x4308135e3d92eeea3235085a1dd36b7293336938',
            decimals: 18,
            symbol: 'CRADLE',
        },
        {
            address: '0xde6aceaf7f2dceb3d425643c5f85351f2b38fcde',
            decimals: 18,
            symbol: 'HQ',
        },
        {
            address: '0x0d83a6eb9cdb74449ad2263cfee1697b2d03a8b5',
            decimals: 18,
            symbol: 'TRUTHFI',
        },
        {
            address: '0x73728b344499598e96842c2a9094a5c960888888',
            decimals: 18,
            symbol: 'AQL',
        },
        {
            address: '0x781d201db8c837ea2aefea7394554071da45ff0f',
            decimals: 18,
            symbol: 'ATAI',
        },
        {
            address: '0x4274cd7277c7bb0806bd5fe84b9adae466a8da0a',
            decimals: 18,
            symbol: 'YUSD',
        },
        {
            address: '0x74c9772afecb53cec95454400869bf11f34e29b7',
            decimals: 9,
            symbol: 'SPLASH',
        },
        {
            address: '0x34bdba9b3d8e3073eb4470cd4c031c2e39c32da8',
            decimals: 17,
            symbol: 'ctLBTC',
        },
        {
            address: '0x000000c396558ffbab5ea628f39658bdf61345b3',
            decimals: 18,
            symbol: 'BUNNI',
        },
        {
            address: '0xe2976a66e8cef3932cdaeb935e114dcd5ce20f20',
            decimals: 18,
            symbol: 'CFSH',
        },
        {
            address: '0x265db573e09aac0a374a8abbc630c516afe94d8e',
            decimals: 18,
            symbol: '4K',
        },
        {
            address: '0xa250cc729bb3323e7933022a67b52200fe354767',
            decimals: 18,
            symbol: 'fwWETH',
        },
        {
            address: '0xe8e1f50392bd61d0f8f48e8e7af51d3b8a52090a',
            decimals: 18,
            symbol: 'fwUNI',
        },
        {
            address: '0xaf0db65b7296c02ab043f5cb17300c8ee949f247',
            decimals: 18,
            symbol: 'SHAO',
        },
        {
            address: '0x89d9b1cd8a61d0581e22e04f1547b2cc1232b848',
            decimals: 18,
            symbol: 'CTAIO',
        },
        {
            address: '0xa7a43272576c3a4b2bf0f55a3142b620d241ef5a',
            decimals: 18,
            symbol: 'YTP',
        },
        {
            address: '0x9dc37e4a901b1e21bd05e75c3b9a633a17001a39',
            decimals: 27,
            symbol: 'ctUSDe',
        },
        {
            address: '0x2fc00a8c0746c137f505c6ed46e0ec8e8835cf99',
            decimals: 9,
            symbol: 'STRATEGY',
        },
        {
            address: '0x9ea59db651a3c79a8d52a394a49da8e9a214d6ae',
            decimals: 9,
            symbol: 'BALLS',
        },
        {
            address: '0x12bdb935107b646a3c68762f21909c6ea334e68a',
            decimals: 9,
            symbol: '69MINUTES',
        },
        {
            address: '0x8074836637eb9cc73a01a65d5700907fc639c4e9',
            decimals: 18,
            symbol: 'DNOW',
        },
        {
            address: '0x5a3fbc343516cf9afa35f2753259496de5eeeb45',
            decimals: 18,
            symbol: 'pPEAS',
        },
        {
            address: '0x2078f336fdd260f708bec4a20c82b063274e1b23',
            decimals: 8,
            symbol: 'fwWBTC',
        },
        {
            address: '0x7e184e30f311745286c21406123cf5760fd38fc4',
            decimals: 4,
            symbol: 'ALMO',
        },
        {
            address: '0x0f719591e2bcb6fcc3e68b16d2a88c89c6ae0d42',
            decimals: 18,
            symbol: 'EVOLVE',
        },
        {
            address: '0x04c46e830bb56ce22735d5d8fc9cb90309317d0f',
            decimals: 18,
            symbol: 'EKUBO',
        },
        {
            address: '0xb45ffb51984d626ee758b336c61cf20990c6bf13',
            decimals: 18,
            symbol: 'WRBNT',
        },
        {
            address: '0x5c8d0c48810fd37a0a824d074ee290e64f7a8fa2',
            decimals: 18,
            symbol: 'AVL',
        },
        {
            address: '0xc8c913f08c430d4f9dd05631ffc1f9c6b7a84f4f',
            decimals: 6,
            symbol: 'PHPR',
        },
        {
            address: '0xf2c88757f8d03634671208935974b60a2a28bdb3',
            decimals: 18,
            symbol: 'SHELL',
        },
        {
            address: '0xddf73eacb2218377fc38679ad14dfce51b651dd1',
            decimals: 18,
            symbol: 'USDx',
        },
        {
            address: '0x090cf6c87f604deb7367e15bd398444b0a74debb',
            decimals: 18,
            symbol: 'HYPG',
        },
        {
            address: '0x92e83cb99f4d889bf1fb8e5f7e675008756cb3c2',
            decimals: 18,
            symbol: 'MALI',
        },
        {
            address: '0xce0cd513a069e8ec9cb625fcdf6d5f29aa912dbc',
            decimals: 18,
            symbol: 'MMS',
        },
        {
            address: '0xa0b63d38e2383365106de258be854fd267e0286f',
            decimals: 9,
            symbol: 'PI',
        },
        {
            address: '0x56c03b8c4fa80ba37f5a7b60caaaef749bb5b220',
            decimals: 18,
            symbol: 'CANTO',
        },
        {
            address: '0xc24d52e3d3a36e9481af0715180e530cbe4667ca',
            decimals: 9,
            symbol: 'HULEZHI',
        },
        {
            address: '0xccb365d2e11ae4d6d74715c680f56cf58bf4bf10',
            decimals: 18,
            symbol: 'WEPE',
        },
        {
            address: '0x9b390f6fb9b25c39bc93599b02374e299d1cd6b0',
            decimals: 9,
            symbol: 'LELE',
        },
        {
            address: '0x000008511556be7fa3133156df8967c88dc4a6a8',
            decimals: 9,
            symbol: 'XGAMES',
        },
        {
            address: '0x63f718c15f4500326dd5015f95ccbde770ad21af',
            decimals: 18,
            symbol: 'EEFS',
        },
        {
            address: '0x7051a44b86e2cf97e1143f800ed7bc0576aa5bb7',
            decimals: 18,
            symbol: 'WHTS',
        },
        {
            address: '0xd89cc9d79ad3c49e2cd477a8bbc8e63dee53f82e',
            decimals: 18,
            symbol: 'KEE',
        },
        {
            address: '0x18b6b2cdba9cd9b28fe9c2622c2207956d52bafd',
            decimals: 9,
            symbol: 'ERIC',
        },
        {
            address: '0x4e6c7e0a365bbd8e4037ef300203fe3fcb636a73',
            decimals: 9,
            symbol: 'GENIUS',
        },
        {
            address: '0x6a9621f3bf5900ad3a72c32b6514645ea972aeb4',
            decimals: 9,
            symbol: 'TARIFF',
        },
        {
            address: '0x4fa29fe6afdd8142258bcb59917c90649ea68b29',
            decimals: 8,
            symbol: 'JJB',
        },
        {
            address: '0xc43db5ae6810223d32a27373f00e42304f605a62',
            decimals: 18,
            symbol: 'PT',
        },
        {
            address: '0x6871cbfab040d023d942641dbadbc84d86d58f5f',
            decimals: 18,
            symbol: 'PT',
        },
        {
            address: '0x54991328ab43c7d5d31c19d1b9fa048e77b5cd16',
            decimals: 18,
            symbol: 'SOIL',
        },
        {
            address: '0x99ad59301c42a5723a27d0166850d21046ac2416',
            decimals: 9,
            symbol: 'WHOGE',
        },
        {
            address: '0x7636d8722fdf7cd34232a915e48e96aa3eb386bf',
            decimals: 18,
            symbol: 'SFI',
        },
        {
            address: '0x14b5c2a86c2cbc9094dafb9ca2857657d9c5e7ac',
            decimals: 9,
            symbol: 'BITPLUS',
        },
        {
            address: '0x91fde184b93bd66f37aff435f47aa63c20a3b2bf',
            decimals: 18,
            symbol: 'DFDX',
        },
        {
            address: '0xd1538a9d69801e57c937f3c64d8c4f57d2967257',
            decimals: 18,
            symbol: 'pfWETH-2',
        },
        {
            address: '0x79787778b129413160f81b4c598d42489edfb7bf',
            decimals: 18,
            symbol: 'pfWETH-3',
        },
        {
            address: '0x395da89bdb9431621a75df4e2e3b993acc2cab3d',
            decimals: 18,
            symbol: 'pfWETH-4',
        },
        {
            address: '0x2e4cbec7f29cb74a84511119757ff3ce1ef38271',
            decimals: 18,
            symbol: 'pfWETH-9',
        },
        {
            address: '0xbdf43ecadc5cef51b7d1772f722e40596bc1788b',
            decimals: 18,
            symbol: 'SEI',
        },
        {
            address: '0xdae0fafd65385e7775cf75b1398735155ef6acd2',
            decimals: 10,
            symbol: 'TRUU',
        },
        {
            address: '0x8d391106f86f4710bcd0d80ee69f7b06a2f41f72',
            decimals: 18,
            symbol: 'BTCBULL',
        },
        {
            address: '0x70e67023de833b7355e8a396a43c096e199bd1a6',
            decimals: 18,
            symbol: 'pfWETH-10',
        },
        {
            address: '0xc5d4610be6aa150da49335550f20dd2c652119e6',
            decimals: 18,
            symbol: 'RTX',
        },
        {
            address: '0xf144c1c9f643d9516e0d8ee3caa271adf6d51f7c',
            decimals: 18,
            symbol: 'FECAL',
        },
        {
            address: '0x9e27a0096292b62bff759c442ce0f79cd8807d83',
            decimals: 18,
            symbol: 'BDAG',
        },
        {
            address: '0x683177aaf4f1d8edd4fcd2eb222f7ca020e75df5',
            decimals: 18,
            symbol: 'pfWETH-11',
        },
        {
            address: '0x06e4665123ad588e74b9b0eb9d709d90112b5d10',
            decimals: 18,
            symbol: 'NARENDRAMODI',
        },
        {
            address: '0x1421d53b2fe0c75d034f81738f3149b54891741e',
            decimals: 18,
            symbol: 'pfWETH-12',
        },
        {
            address: '0xa7b103d2387eb417e67a7ee565fe378d15061c39',
            decimals: 18,
            symbol: 'pfWETH-13',
        },
        {
            address: '0x3cda89d08d77a3c919c1a40619c8591f65ce1b67',
            decimals: 9,
            symbol: 'MINIDOGE',
        },
        {
            address: '0x107b50c738dbfb323c40baa8d602bd388996af86',
            decimals: 18,
            symbol: 'BPEP',
        },
        {
            address: '0xfd2c2546285eacc795fbad13b53f0d18a3c0f944',
            decimals: 9,
            symbol: 'BROCCOLI',
        },
        {
            address: '0x6967f0974d76d34e140cae27efea32cdf546b58e',
            decimals: 18,
            symbol: 'GMRT',
        },
        {
            address: '0x96706e64a06675828e8706ee9a803d732008751f',
            decimals: 18,
            symbol: 'MUTM',
        },
        {
            address: '0x36f15c5ac19a35e7398418c5bad8ac56a107c756',
            decimals: 9,
            symbol: 'MISHA',
        },
        {
            address: '0x0e6cc64640de0eb4d9d388c7f24a452553289e3f',
            decimals: 18,
            symbol: 'USDF',
        },
        {
            address: '0xca1154bbd62c21868a358f9f782b90d69af600b0',
            decimals: 6,
            symbol: 'pfUSDC-16',
        },
        {
            address: '0x9908b053577df199fcd81ea54da3d53cc9ca1c07',
            decimals: 9,
            symbol: 'DOGESTATE',
        },
        {
            address: '0xaac37daf4aa8048d59e2172b519ec50fce47f8e4',
            decimals: 9,
            symbol: 'ARA',
        },
        {
            address: '0x0cf7356e2d13ae2b57e77286284984a5fc8f88b3',
            decimals: 18,
            symbol: 'SCOT',
        },
        {
            address: '0x3dda210cf17510db0970b3da3dca80ba04f990f3',
            decimals: 9,
            symbol: 'XAIGAMES',
        },
        {
            address: '0x20d81101d254729a6e689418526be31e2c544290',
            decimals: 18,
            symbol: 'mvDEFI',
        },
        {
            address: '0x0fc036cfd300519170f90b21b92a4349d2dabbae',
            decimals: 18,
            symbol: 'TNT',
        },
        {
            address: '0x60c101dadd0dcbd217f2bf4d728f7474360303c5',
            decimals: 9,
            symbol: 'PAIN',
        },
        {
            address: '0x806e98a0f0b433f931f5e27ce9ead1348113e654',
            decimals: 9,
            symbol: 'TAKKI',
        },
        {
            address: '0x9447dd95f576fdf6ed8219fff45bd1362430b787',
            decimals: 5,
            symbol: 'BMB',
        },
        {
            address: '0xfa2b947eec368f42195f24f36d2af29f7c24cec2',
            decimals: 18,
            symbol: 'USDf',
        },
        {
            address: '0xa5cdea03b11042fc10b52af9eca48bb17a2107d2',
            decimals: 18,
            symbol: 'mvRWA',
        },
        {
            address: '0xf91384484f4717314798e8975bcd904a35fc2bf1',
            decimals: 18,
            symbol: 'SMEL',
        },
        {
            address: '0x4e3b170dcbe704b248df5f56d488114ace01b1c5',
            decimals: 18,
            symbol: 'BED',
        },
        {
            address: '0xfc55b12896c090aac7922d447d9b80821b983bdc',
            decimals: 9,
            symbol: 'DISK',
        },
        {
            address: '0x45f5bd656d89ee84b96ace4d161e4021126d03e5',
            decimals: 6,
            symbol: 'BTEC',
        },
        {
            address: '0x9af595c8fc201e82db65faef71d51365d7f11b5f',
            decimals: 9,
            symbol: 'CAPTAIN',
        },
        {
            address: '0xc5f009304154c2bec18596693e51e45452e2b806',
            decimals: 9,
            symbol: 'FAFO',
        },
        {
            address: '0x4ae149fd6059af772b962efac6bf0236872d6940',
            decimals: 18,
            symbol: 'LBAI',
        },
        {
            address: '0x0f9a1a70fea9d32bf46706047651fffccb43fbd0',
            decimals: 9,
            symbol: 'CASPER',
        },
        {
            address: '0xc2c857ba1c522a2cc45cfb2150ef6ee7d32f3b4a',
            decimals: 18,
            symbol: 'GHHS',
        },
        {
            address: '0x47ca34f6499974f6632c99a7004dc9928fa53147',
            decimals: 18,
            symbol: 'KWLO',
        },
        {
            address: '0x58d4e17051e11e7f2e8f9eab97be720fec0f01f4',
            decimals: 9,
            symbol: 'JOANNA',
        },
        {
            address: '0x80ac24aa929eaf5013f6436cda2a7ba190f5cc0b',
            decimals: 6,
            symbol: 'syrupUSDC',
        },
        {
            address: '0xf21a2e258b8dd490d0165fa11bcf2f97bb557c77',
            decimals: 18,
            symbol: 'SOLX',
        },
        {
            address: '0x1a91b61e884ddd93a0aa83cd6908a4bc07e6f3eb',
            decimals: 9,
            symbol: 'ATN',
        },
        {
            address: '0x5be6e0e0bbe7711dd118b9dc3c68ccf9bb9754ea',
            decimals: 18,
            symbol: '$VLN',
        },
        {
            address: '0xe7dee4823ee18f1347f1cf7997f70b94efde2e1f',
            decimals: 18,
            symbol: 'FORM',
        },
        {
            address: '0xbcf59ee0b74312a3fa4a9fd258adca0a1c61a5aa',
            decimals: 9,
            symbol: 'TRUMP',
        },
        {
            address: '0xd152e68e055021fac32818c68601e437eb4105a6',
            decimals: 18,
            symbol: 'BEAN',
        },
        {
            address: '0x968dc061290f76f90b3b939cc9380d47d79a54c5',
            decimals: 9,
            symbol: 'MOONKIN',
        },
        {
            address: '0x26cafcfc1b820a74b0e069c2c65b816d2af241cd',
            decimals: 3,
            symbol: 'NYWNFT',
        },
        {
            address: '0x2a897de60073e13c1f34f672033c1c1d08657fbb',
            decimals: 9,
            symbol: 'DAWAE',
        },
        {
            address: '0x0047768d2e2fc1e091003afc1e79ffe1e78a7316',
            decimals: 9,
            symbol: 'CSR',
        },
        {
            address: '0xa33561b67cc416706b1f8cb33db7b049491e520d',
            decimals: 9,
            symbol: 'CSR',
        },
        {
            address: '0xc2e0835a62188e586e2b3aa7c692781dc13080ec',
            decimals: 8,
            symbol: 'M1C0',
        },
        {
            address: '0xbad6c59d72d44512616f25b3d160c79db5a69ddf',
            decimals: 18,
            symbol: 'VATAN',
        },
        {
            address: '0x1c28f037159be0c1a89ac8dcc5d1feabd6cff207',
            decimals: 18,
            symbol: 'BDAG',
        },
        {
            address: '0xc5a861787f3e173f2b004d5cfa6a717f5dc5484d',
            decimals: 18,
            symbol: 'SNL',
        },
        {
            address: '0x7f2b5fee3a89c97fb3d2335c637bbc670f4ed9ae',
            decimals: 9,
            symbol: 'TORA',
        },
        {
            address: '0x20069fad147d569c0a271b4c0cee2d5c2b9389f1',
            decimals: 9,
            symbol: 'DARKFATHER',
        },
        {
            address: '0x38a273b0551c60d92c94dda8ffb32e10edd63179',
            decimals: 9,
            symbol: 'DREAM',
        },
        {
            address: '0x0f1db594538e893ad802d41a95f4572ba4fa7d67',
            decimals: 9,
            symbol: 'BRS',
        },
        {
            address: '0x0f79dff082b6f4324528f5ded2d6b8aa6d576277',
            decimals: 8,
            symbol: 'USAM',
        },
        {
            address: '0xc214a0b73ce4c30594b4173219e885691254801b',
            decimals: 9,
            symbol: 'TOTO',
        },
        {
            address: '0x33c83c8609618f4b38a0f969a186eba30a46e502',
            decimals: 9,
            symbol: 'SMR',
        },
        {
            address: '0xac6708e83698d34cd5c09d48249b0239008d0ccf',
            decimals: 18,
            symbol: 'FORTKNOX',
        },
        {
            address: '0x4c044f2a85af55461cdee796dbc46fb21595bff9',
            decimals: 9,
            symbol: 'MOONDAO',
        },
        {
            address: '0x32d58dc98341a7f7318b870656cc5514142d0b44',
            decimals: 18,
            symbol: 'pfWETH-19',
        },
        {
            address: '0xd714a9c3836edd56198576ebfbc8d23ea3cb405e',
            decimals: 9,
            symbol: 'CTO',
        },
        {
            address: '0x140009a3c7608eb162c618167418883b0afd10a7',
            decimals: 9,
            symbol: '$MEGA',
        },
        {
            address: '0x69000ef43291ce02a1134933c8fbf3eeb747f3ff',
            decimals: 9,
            symbol: 'SER',
        },
        {
            address: '0xa52142e847d117001ad4e0afa351bf09c47b69cb',
            decimals: 9,
            symbol: 'SISR',
        },
        {
            address: '0x295c37c11488878db41c526c17bfa5dbf12a1b8a',
            decimals: 18,
            symbol: 'MBXAU',
        },
        {
            address: '0x817162975186d4d53dbf5a7377dd45376e2d2fc5',
            decimals: 18,
            symbol: 'REACT',
        },
        {
            address: '0x456c3becfa597031d9b8baeac92466503b861005',
            decimals: 18,
            symbol: 'BEST',
        },
        {
            address: '0x89a8c847f41c0dfa6c8b88638bacca8a0b777da7',
            decimals: 18,
            symbol: 'ELX',
        },
        {
            address: '0x965b64ae2c04cff248e6502c10cf3a4931e1f1d9',
            decimals: 18,
            symbol: 'SEV',
        },
        {
            address: '0x1165ecebfa6693cf64ac5ef49f1b32e8acbffe01',
            decimals: 18,
            symbol: 'CCDOG',
        },
        {
            address: '0xa93d86af16fe83f064e3c0e2f3d129f7b7b002b0',
            decimals: 9,
            symbol: 'COCORO',
        },
        {
            address: '0xf834f9b2bb88357bba3a3bf840de80b4c1f5b570',
            decimals: 9,
            symbol: 'Cocoro',
        },
        {
            address: '0x90d2af7d622ca3141efa4d8f1f24d86e5974cc8f',
            decimals: 18,
            symbol: 'eUSDe',
        },
        {
            address: '0x46c2138fa5b8c8aeb382cf8bd6a6904b81240966',
            decimals: 9,
            symbol: 'pwease',
        },
        {
            address: '0x19fb4e5062f5a67149e60ecfc6ab536d8ea549b5',
            decimals: 9,
            symbol: 'MEM',
        },
        {
            address: '0x67f71ed8b74e662eed7ba2d9c544b253dd227ed8',
            decimals: 18,
            symbol: 'DOUBT',
        },
        {
            address: '0xe8308bcc1fc386a1fc506311d8682f8f89fcfeba',
            decimals: 18,
            symbol: 'TICS',
        },
        {
            address: '0xafc472082b762299285dd945015c72339d143e97',
            decimals: 9,
            symbol: 'ICHIGO',
        },
        {
            address: '0x886f224128b84e59edbb0e5c2a3195b8cf0e9db2',
            decimals: 18,
            symbol: 'BeeARD',
        },
        {
            address: '0x4288b2a44b188c57b17e255a6acf9d05b2f8363e',
            decimals: 9,
            symbol: 'BABYCOCORO',
        },
        {
            address: '0x7d46d666a4faec9b929726bc9e23fa9913be4f3c',
            decimals: 9,
            symbol: 'COCO',
        },
        {
            address: '0x0ed75b3e12b3e78bd8d154061d1725c8d9f0d118',
            decimals: 18,
            symbol: 'EIG',
        },
        {
            address: '0x98fae31948b16b90a2c72cccc10cb61654850b28',
            decimals: 18,
            symbol: 'NIN',
        },
        {
            address: '0x91c65c2a9a3adfe2424ecc4a4890b8334c3a8212',
            decimals: 18,
            symbol: 'ONE',
        },
        {
            address: '0x4d2755ce1a8aa9d9cec0f48011abc138816873df',
            decimals: 18,
            symbol: 'BTCBULL',
        },
        {
            address: '0x8730762cad4a27816a467fac54e3dd1e2e9617a1',
            decimals: 18,
            symbol: 'GX',
        },
        {
            address: '0x26827f7f51769ea21f94ba98ba64f5d0dc8988f9',
            decimals: 18,
            symbol: 'FAME',
        },
        {
            address: '0x94314a14df63779c99c0764a30e0cd22fa78fc0e',
            decimals: 18,
            symbol: 'EPIC',
        },
        {
            address: '0x7332b670d99653e3d0ae62e63ea78a19e8a10c0b',
            decimals: 9,
            symbol: 'TOMO',
        },
        {
            address: '0xea09246ca65d690ff1e6adc2ddf0af12dc5bef96',
            decimals: 18,
            symbol: 'SFC',
        },
        {
            address: '0x459f878908b5d6e8a0f2eb089b0cd29d9766afe5',
            decimals: 18,
            symbol: 'fwUSDe',
        },
        {
            address: '0x13ce3b072e58bc49db03cd8627d8900fdd917f03',
            decimals: 9,
            symbol: 'DUMB',
        },
        {
            address: '0x239fa2f30a1a4ff66f04410b8b9b5e6c1585feaa',
            decimals: 18,
            symbol: 'Hoodi',
        },
        {
            address: '0xd80e7f03e5046c1fdcc44b23196c7fd5ef35bafe',
            decimals: 9,
            symbol: 'WOD',
        },
        {
            address: '0x8ebef9e751d5d88d829e1b22f2c5b1f7d4f78bfe',
            decimals: 18,
            symbol: 'MTAUR',
        },
        {
            address: '0x43c5034469bce262d32f64c5e7f9f359f5b1495f',
            decimals: 9,
            symbol: 'DOPE',
        },
        {
            address: '0x2a9958b04b503176653dbcb613dc72abd16ff036',
            decimals: 18,
            symbol: 'SOLX',
        },
        {
            address: '0xe6b58aa9d657d71d39dd135cc8421a916dca8743',
            decimals: 9,
            symbol: 'BETTY',
        },
        {
            address: '0x6eca633cdc329dccc374545d0f556d31f95f43de',
            decimals: 9,
            symbol: 'OPTI',
        },
        {
            address: '0xddaea3cc572bc86867705a2a6c9daa47c83e66c4',
            decimals: 9,
            symbol: 'SETH',
        },
        {
            address: '0x9df59dcb893038982b43b5f481dbc129ce48162e',
            decimals: 4,
            symbol: 'DDST',
        },
        {
            address: '0x581af89b81b893e1448b2800a5edb9e9e29f73a3',
            decimals: 9,
            symbol: 'HOTSHOT',
        },
        {
            address: '0xb5fa4cc582c4aec0f4004dd082ac5e5515cb8955',
            decimals: 18,
            symbol: 'KTA',
        },
        {
            address: '0x08f112fdf76cb75a91fb334b891c325381416976',
            decimals: 18,
            symbol: 'HELP',
        },
        {
            address: '0x792905a8b7c0a22d56e78e849f95c162018a4e2d',
            decimals: 18,
            symbol: 'RENTA',
        },
        {
            address: '0x655f9ea13722bee68377be3e8f4f65268b35d605',
            decimals: 18,
            symbol: 'QXT',
        },
        {
            address: '0xdbf1703e5d29afefbf1bd958ce7a6023c67f3e5d',
            decimals: 8,
            symbol: 'fwcbBTC',
        },
        {
            address: '0x32456b6c6bfb2ab379f43fd1cde9a46fa5500ca2',
            decimals: 9,
            symbol: 'KUKERUO',
        },
        {
            address: '0xbd8005612124dc30601e22d8b5d188a89767c640',
            decimals: 18,
            symbol: 'EXO',
        },
        {
            address: '0x54c664e9a09311891f1c30ecced27a18b6517609',
            decimals: 9,
            symbol: 'HOODI',
        },
        {
            address: '0xf419c7674536f6b32b9a73929dbf4ff5c2386d5c',
            decimals: 6,
            symbol: 'pfUSDC-21',
        },
        {
            address: '0xd67e18ed798a9667e84595bf88c25ae163af7e0a',
            decimals: 9,
            symbol: 'BEEBEE',
        },
        {
            address: '0xd48067f122afc3a58f0f79611f5f1afae0d7f25b',
            decimals: 18,
            symbol: 'mRED',
        },
        {
            address: '0x3d5f61a4bb385b6d1eb34f47aa790a996f1eba65',
            decimals: 18,
            symbol: 'MYST',
        },
        {
            address: '0x98e12c3185b54e3293cd9dd6b9e059d118d8b1f3',
            decimals: 18,
            symbol: 'KTA',
        },
        {
            address: '0xaa26754dd0c8310cb70f3b66daeab52c8cff3c30',
            decimals: 18,
            symbol: 'H420',
        },
        {
            address: '0xd2a466a64c52c39c2cdef7d27416beca9b43506e',
            decimals: 18,
            symbol: 'doginme',
        },
        {
            address: '0x24d7ad9402717f429a81925fe7643b78918eda8b',
            decimals: 6,
            symbol: 'XION',
        },
        {
            address: '0x138cdee9f69348d4ace4e8aa19f163745a8f3444',
            decimals: 9,
            symbol: 'ANDEE',
        },
        {
            address: '0x34c1726ff3438627f57a8fd0d581b799e90b7dfb',
            decimals: 9,
            symbol: 'BRITT',
        },
        {
            address: '0x2dede6638e24da3d97463183bf2c2d41f1d8f17e',
            decimals: 18,
            symbol: 'CLIZA',
        },
        {
            address: '0xbef7e5cafef65dbe229757ae00c66eb259a2bb2e',
            decimals: 18,
            symbol: 'G21',
        },
        {
            address: '0x75b45b0fd4a33ff3db856b24bf9c2c13f48e8eaf',
            decimals: 18,
            symbol: 'MBXAU',
        },
        {
            address: '0x2500b35817e2a9449a13f4b9498cf58ffa3eba97',
            decimals: 9,
            symbol: 'Downald',
        },
        {
            address: '0x546007c8964d1816d7afca14c8da739f9b8af0d0',
            decimals: 18,
            symbol: 'MUTM',
        },
        {
            address: '0xaed6087ce812dfb7684b713b48e837ce33719b83',
            decimals: 9,
            symbol: 'SORA',
        },
        {
            address: '0x6cbb2f152501bccf6c73f50131eb0e7aead7d881',
            decimals: 18,
            symbol: 'DPN',
        },
        {
            address: '0x85063487eceaa61e5b9f3ea06567577532556c22',
            decimals: 18,
            symbol: 'VVV',
        },
        {
            address: '0xfc150a8f65d95d1a885d3b5ce17145816baa782d',
            decimals: 9,
            symbol: 'HARU',
        },
        {
            address: '0xc25a484bcbd1b15b8f75a558fc32cbe001dbbd44',
            decimals: 9,
            symbol: 'ONI',
        },
        {
            address: '0xb0446f72c7c642dbf64c7b061d6c5342fd9868f4',
            decimals: 18,
            symbol: 'LMB',
        },
        {
            address: '0x8e0b3e3cb4468b6aa07a64e69deb72aea8eddc6f',
            decimals: 18,
            symbol: 'SANJI',
        },
        {
            address: '0xc3d21f79c3120a4ffda7a535f8005a7c297799bf',
            decimals: 18,
            symbol: 'TERM',
        },
        {
            address: '0xfc05e06bb5bb9215cb1bd8d20d11fccbcdba1028',
            decimals: 18,
            symbol: 'MONAD',
        },
        {
            address: '0x0d57436f2d39c0664c6f0f2e349229483f87ea38',
            decimals: 6,
            symbol: 'wA7A5',
        },
        {
            address: '0x34dbb38c29573c5af5149b4f175056fed59ec3b6',
            decimals: 9,
            symbol: 'Ghibli',
        },
        {
            address: '0x7a7b723493781e9c4a96b64705c4f45cfe5ba142',
            decimals: 18,
            symbol: 'VIRTUAL',
        },
        {
            address: '0xfdc005c0cbe409c92651b7022e366c10220a0c1e',
            decimals: 9,
            symbol: 'BUCKAZOIDS',
        },
        {
            address: '0x721562c04324b6751d411fd45e5360bbddaec353',
            decimals: 18,
            symbol: 'CineX',
        },
        {
            address: '0x774b9dd3977a7556bf16cc22b74b2991e4511e13',
            decimals: 18,
            symbol: 'SCAI',
        },
        {
            address: '0xec9a85e46f50ec5434cc072deefef23156b12488',
            decimals: 18,
            symbol: 'EOTW',
        },
        {
            address: '0x1c95519d3fc922fc04fcf5d099be4a1ed8b15240',
            decimals: 9,
            symbol: 'GROK',
        },
        {
            address: '0xb0d45567d12327e0719ecedc53e585bd03c40270',
            decimals: 18,
            symbol: 'DJINN',
        },
        {
            address: '0x6f49ee65d1f7953b8724c0c15e22ad189fecd579',
            decimals: 9,
            symbol: 'MIPRAMI',
        },
        {
            address: '0x8107653b4e230f95e6d69da766bb86b5c47d333b',
            decimals: 18,
            symbol: 'HUGE',
        },
        {
            address: '0xff8c8653d5718b3816336e6198ad1e418905a47e',
            decimals: 9,
            symbol: 'ETHRESEARCHER',
        },
        {
            address: '0x878a7a25965e215550263d1a5f1be1c85a1e8ee8',
            decimals: 6,
            symbol: 'USDTv1',
        },
        {
            address: '0xae18c8fd6a041d6d2aee0d7b95462a493abacdde',
            decimals: 9,
            symbol: 'Superjudge',
        },
        {
            address: '0xf279e9848b647671887352b8b669568c60d5b457',
            decimals: 18,
            symbol: 'GDLR',
        },
        {
            address: '0xc5f333d74424d1fb907507077e3759cc92cff2d1',
            decimals: 8,
            symbol: 'SC',
        },
        {
            address: '0xdcd3ac490513a42ec0bfc09e46244cc8aa283b3e',
            decimals: 18,
            symbol: 'LCAI',
        },
        {
            address: '0x1f385578266496cd4a4c435a6bb2a60b9bd9ceef',
            decimals: 18,
            symbol: 'PLUTO',
        },
        {
            address: '0xdadc079fb4ea453c8d48b258e93066d4b7bbf63a',
            decimals: 9,
            symbol: 'KAGE',
        },
        {
            address: '0x29aa21c650f832041786f661130bd521e05a9ce4',
            decimals: 9,
            symbol: 'AB',
        },
        {
            address: '0x64b3b21ee104f434380270749d8d5bfd481fdcf6',
            decimals: 9,
            symbol: 'ABTC',
        },
        {
            address: '0xc269d681868f454b8c4878238105e117c9c7343a',
            decimals: 18,
            symbol: 'KTA',
        },
        {
            address: '0x6a76a004f3bda1447b7d8bbea8355866420b8cb5',
            decimals: 8,
            symbol: 'CHARLIE',
        },
        {
            address: '0x5f74027d995ba75c9939784ae69f04787baa04d5',
            decimals: 9,
            symbol: 'JUPITER',
        },
        {
            address: '0x61ab27ed01ba81d2e6cd45e2451f5ee50886aa3b',
            decimals: 9,
            symbol: 'SPOT',
        },
        {
            address: '0x468f79177f95f6c6c4d05ce6d2b35186405e6ff3',
            decimals: 9,
            symbol: 'ER',
        },
        {
            address: '0x267c961446c1d47929da4c8b7f090322382dc63b',
            decimals: 9,
            symbol: 'BOOMKIN',
        },
        {
            address: '0x6a34224207d846671b940480e32f1cc15221f1b3',
            decimals: 9,
            symbol: 'COCORITA',
        },
        {
            address: '0xd03703e14b912e8f5bc7dfcde947c3f5fe97f102',
            decimals: 4,
            symbol: 'GLDC',
        },
        {
            address: '0x6282727946325daa05636adec103b385b7c995bf',
            decimals: 18,
            symbol: 'VED',
        },
        {
            address: '0x93d79aabe787d7f6a510664d01854fdc3c7cbd97',
            decimals: 9,
            symbol: 'ALTERYA',
        },
        {
            address: '0xbe96f714bc71779118cf69961bfb3d07b275658b',
            decimals: 9,
            symbol: 'TITCOIN',
        },
        {
            address: '0xeeb3d7f9e419a503ce426469cc0725b5cd638b38',
            decimals: 9,
            symbol: 'KEK',
        },
        {
            address: '0xe06a5300555e375bf1592d30ceb6f5a985c820c9',
            decimals: 9,
            symbol: 'NMAX',
        },
        {
            address: '0x2e6b582ef987134015472d2fc542dae4bb20d646',
            decimals: 9,
            symbol: 'SOLX',
        },
        {
            address: '0xe6d07e1a7c9f8f9826aa82e6faf7feab698dd4fe',
            decimals: 9,
            symbol: 'ROCKET',
        },
        {
            address: '0x7ee089ebb18771caf5bf483a4ee49c4de04295f2',
            decimals: 9,
            symbol: 'Kekiusa',
        },
        {
            address: '0x8bbf486a9f2b535c4ef09c665a807859cfe92d83',
            decimals: 9,
            symbol: 'MAXIMUSA',
        },
        {
            address: '0x90f4088517efbf6dd3a451fb7090a06c1ae326d0',
            decimals: 9,
            symbol: 'FWOG',
        },
        {
            address: '0xc16d4e3b9537e428031942a782c4c47ba56a9508',
            decimals: 18,
            symbol: 'AERO',
        },
        {
            address: '0xb214b79eac9378a56d14d6e6d452150c80d6ad79',
            decimals: 18,
            symbol: 'MEMEX',
        },
        {
            address: '0x957e0fdfbd1c2f97648318b2f057e327996ec367',
            decimals: 18,
            symbol: 'GOLDGR',
        },
        {
            address: '0x1fc122fe8b6fa6b8598799baf687539b5d3b2783',
            decimals: 6,
            symbol: 'QUEST',
        },
        {
            address: '0x0ca7e6e77ab3e54ee5a4e8cadbd684ab9ebc1632',
            decimals: 9,
            symbol: 'PECTRA',
        },
        {
            address: '0x2604ed1a06ab7a4929cb3810117802c489a635f8',
            decimals: 18,
            symbol: 'EDGE',
        },
        {
            address: '0x1d88713b483a8e45cff0e5cd7c2e15e5fab4534d',
            decimals: 18,
            symbol: 'STO',
        },
        {
            address: '0x5dbbd676f70cf9aac23b25a28e841239fa8d2685',
            decimals: 2,
            symbol: 'CZKK',
        },
        {
            address: '0xe384865e7b91208f7ffec94a820d2395de4154b7',
            decimals: 8,
            symbol: 'LOJBAN',
        },
        {
            address: '0xe3f82f9b0869beee0a1f4c010630914a765e6d15',
            decimals: 9,
            symbol: 'JAMANRA',
        },
        {
            address: '0xbbb741050e39cb6acc4197d16f385dbcc526fc79',
            decimals: 18,
            symbol: 'BitBonds',
        },
        {
            address: '0x275387324a0e5a3e8babbf356d554bfd555b30d8',
            decimals: 18,
            symbol: 'SUBBD',
        },
        {
            address: '0xa5e30be6407651185806bab601e2ead7fb985780',
            decimals: 9,
            symbol: 'TSUKA',
        },
        {
            address: '0xee4e2aaceb6ca1d2f0b6182bd30b75bfa462b831',
            decimals: 9,
            symbol: 'House',
        },
        {
            address: '0xf77137705c38ff25b7045de17df1852914713fc5',
            decimals: 9,
            symbol: 'AMAZON',
        },
        {
            address: '0xe42a96c519b93da8a8a5d89408ff730b4965f8f6',
            decimals: 18,
            symbol: 'TOSHI',
        },
        {
            address: '0x9f417f8649ae22a3a9eeeb12416dd2bd5ebd7b3c',
            decimals: 9,
            symbol: 'APE',
        },
        {
            address: '0x72c6ec45873e49338ea37bd969461d877ac000a9',
            decimals: 9,
            symbol: 'DOGA',
        },
        {
            address: '0x6f16dd6667dcf4e5dc8ab802f578ca8a17c4de27',
            decimals: 9,
            symbol: 'CATCOIN',
        },
        {
            address: '0xfd91e87ce1d484ae0dca65bc898de05a965e9a57',
            decimals: 9,
            symbol: 'AETH',
        },
        {
            address: '0xbbda624244e020032c36f4cbc759fce10e788268',
            decimals: 18,
            symbol: 'RFC',
        },
        {
            address: '0xea41b003b0b31b1af689fc31bac2a9eb4854ad7a',
            decimals: 9,
            symbol: 'DMA',
        },
        {
            address: '0x5c8b47d17ec6fc9731f15396824afcd5fa336da1',
            decimals: 9,
            symbol: 'HammeredAgainnnn',
        },
        {
            address: '0x6c5920422760926f3a8bae30926690d397704985',
            decimals: 9,
            symbol: 'AETH',
        },
        {
            address: '0x16a5f7d5e5524a44adc43916e5e1ae627109053d',
            decimals: 18,
            symbol: 'BENJI',
        },
        {
            address: '0x30067b0c90f23930b861266b5e15bcfde9e6e000',
            decimals: 9,
            symbol: 'CRAMER',
        },
        {
            address: '0x047330be3669bb9c4ba12eaf1e0ed923026ff60c',
            decimals: 18,
            symbol: 'JUSDT',
        },
        {
            address: '0x9f9b8661ab4953c5ec177f21ccd1e2a6ac94a344',
            decimals: 9,
            symbol: 'PENGUIN',
        },
        {
            address: '0x391883a5d2438716796336f2e420a92e52b45efe',
            decimals: 18,
            symbol: 'REMUS',
        },
        {
            address: '0x17b51b2e7c5144fa28264999327a850cbb46cc35',
            decimals: 9,
            symbol: 'ROMULUS',
        },
        {
            address: '0x4f2154205b0ce54d378aa297021072a1d2e955fd',
            decimals: 9,
            symbol: 'khaleesi',
        },
        {
            address: '0xae5120bb4239db7c76bd0564a8710f214f950226',
            decimals: 9,
            symbol: 'Wooly',
        },
        {
            address: '0x69000e2b8c944dd8968e59084044b852229b83a9',
            decimals: 9,
            symbol: 'WAGMI',
        },
        {
            address: '0x793b538673366dd04372175838b3fcb1259eea81',
            decimals: 9,
            symbol: 'YEE',
        },
        {
            address: '0xea56a25ce94cb414da4ab8cb2169c0e11392c358',
            decimals: 9,
            symbol: 'ORO',
        },
        {
            address: '0x6a82d839d1b97eaca0b3aa258b131fcfb0b5a88d',
            decimals: 18,
            symbol: 'SKITTEN',
        },
        {
            address: '0x628f7e7dbb3004dd3d276093686346a2966eec5a',
            decimals: 9,
            symbol: 'SHADILAY',
        },
        {
            address: '0xa7320588e832c78e90973ddc44fbf97430fa1258',
            decimals: 18,
            symbol: 'Bitcop',
        },
        {
            address: '0x461dd2e15d2fc9703a41f5ac801eaf8e559e1fe2',
            decimals: 9,
            symbol: 'JOCKEY',
        },
        {
            address: '0x2103e845c5e135493bb6c2a4f0b8651956ea8682',
            decimals: 18,
            symbol: 'XAUM',
        },
        {
            address: '0xf27441230eadeac85b764610325cc9a0d7859689',
            decimals: 18,
            symbol: 'ASTR',
        },
        {
            address: '0x53e797693313d02369a706458d507eaf098d0bd0',
            decimals: 18,
            symbol: 'ASC',
        },
        {
            address: '0x3aa8f9cbc8a5a16c1a4b09d8cab51fe0378abffd',
            decimals: 9,
            symbol: 'TRUST',
        },
        {
            address: '0x57e1a63593c46bbc2ae10aa94da67cff735cfbee',
            decimals: 18,
            symbol: 'GRIFFAIN',
        },
        {
            address: '0x1d99c0ac928f58595b9d060c79f799fa38d171f4',
            decimals: 18,
            symbol: 'RTX',
        },
        {
            address: '0x0e8e7a963e3a1db2651480f54b508607a25c54a9',
            decimals: 9,
            symbol: 'CHEEMUS',
        },
        {
            address: '0x48ab25fa389291ef0f8c839d3963fb56dd688240',
            decimals: 9,
            symbol: 'MONA',
        },
        {
            address: '0x2cc0aac512b0aaf3ee624970a275689925d29b48',
            decimals: 9,
            symbol: 'LHC',
        },
        {
            address: '0x66722a4bd7b34a53921bbd91c2c0d7f27e344794',
            decimals: 9,
            symbol: 'COOK',
        },
        {
            address: '0xbf6bc6782f7eb580312cc09b976e9329f3e027b3',
            decimals: 6,
            symbol: 'ATOM',
        },
        {
            address: '0x0db06428fb714e1c7a46ed1f517269e0efad450a',
            decimals: 9,
            symbol: 'TRUMPCOIN',
        },
        {
            address: '0x4700018f9f4527e395b6613f89a016d2d2b55c87',
            decimals: 9,
            symbol: 'MAGA',
        },
        {
            address: '0x6e8b146af16429b037ece5943f3c0e5f412ddfa7',
            decimals: 6,
            symbol: 'MEX',
        },
        {
            address: '0x7abefba7c60f94310dc17d3bba5ae737ee315d83',
            decimals: 9,
            symbol: 'DESTINY',
        },
        {
            address: '0xd2b69d3518c3820e97ea910a4a22d699a6c39272',
            decimals: 9,
            symbol: 'CHICKENUS',
        },
        {
            address: '0xc179eecdf8faf3917d2ef639e918be428e7ac383',
            decimals: 9,
            symbol: 'CHICKENIUS',
        },
        {
            address: '0x28d38df637db75533bd3f71426f3410a82041544',
            decimals: 18,
            symbol: 'PROMPT',
        },
        {
            address: '0xc1c82fb560ef3684c833689ff4e8752982d87c5c',
            decimals: 9,
            symbol: 'DOGEN',
        },
        {
            address: '0xc3245981099fd476fe288b853226ff8b1720d08c',
            decimals: 18,
            symbol: 'USD.T',
        },
        {
            address: '0x0438cc3753510f1feeaadb9a467a0efa20970e15',
            decimals: 9,
            symbol: 'XDVIDEO',
        },
        {
            address: '0xe062e38d16d949ffb0bd6b62ae2f7a3c930be1c4',
            decimals: 18,
            symbol: 'MATS',
        },
        {
            address: '0x9cbab677b5dae21c2eedf491aa5e3d07eb7b813b',
            decimals: 18,
            symbol: 'TAKO',
        },
        {
            address: '0xc314b0e758d5ff74f63e307a86ebfe183c95767b',
            decimals: 18,
            symbol: 'ADP',
        },
        {
            address: '0x2c899a490902352afa33bafb7fe89c9dd142f9d1',
            decimals: 18,
            symbol: 'DRT',
        },
        {
            address: '0x487d62468282bd04ddf976631c23128a425555ee',
            decimals: 5,
            symbol: 'UPC',
        },
        {
            address: '0x7d5a221a526b67a5fcdefd6a893013cc5ae2e6a3',
            decimals: 18,
            symbol: 'POOBAH',
        },
        {
            address: '0x1262e59523078ba3c84c521e757c9bf094b8b1b9',
            decimals: 9,
            symbol: 'MINIMUS',
        },
        {
            address: '0xd591dc23a6b4ebae298d78ed19ee7a3c5ba44ad2',
            decimals: 9,
            symbol: 'MINIMUS',
        },
        {
            address: '0x2a044b83a1be80dab4708bd76167e10df1bbda89',
            decimals: 9,
            symbol: 'Yee',
        },
        {
            address: '0x9a2bb77e77e9cade412f1211ac9411b64a095dce',
            decimals: 9,
            symbol: 'THYLACINE',
        },
        {
            address: '0x70936e042c57e473d754c0f1d00759645335365f',
            decimals: 9,
            symbol: 'TUCKER',
        },
        {
            address: '0x8d0d000ee44948fc98c9b98a4fa4921476f08b0d',
            decimals: 18,
            symbol: 'USD1',
        },
        {
            address: '0x95e6de2b4cc43bda20af3fd8f78c4853c2182ae1',
            decimals: 9,
            symbol: 'ETHLEPHANT',
        },
        {
            address: '0x99824d47d0e8e653af0de59fe376e1763e2d013f',
            decimals: 9,
            symbol: 'FARTMAN',
        },
        {
            address: '0xdcc805a497719ebb926c422de9e7c128b9757426',
            decimals: 18,
            symbol: 'ENI',
        },
        {
            address: '0xf974b9e2717c7f3e5deb36a14bc36348bdb48bf4',
            decimals: 9,
            symbol: 'MUTUMBO',
        },
        {
            address: '0x52d149ff5c152beb93ea0c1daf4652d44e8593cf',
            decimals: 9,
            symbol: 'MUTUMBO',
        },
        {
            address: '0xeddef956d90406e9d65e4bd02e6f751420c2f31c',
            decimals: 9,
            symbol: 'BROG',
        },
        {
            address: '0xfd9188de9d439c8c543d1ec0094675edc79ed150',
            decimals: 18,
            symbol: 'BLLG',
        },
        {
            address: '0x8f135bcfc4084ce6c8620e87b12c4ee82d165276',
            decimals: 6,
            symbol: 'pfUSDC-22',
        },
        {
            address: '0xee8a704f12f7efba69c094c77d5707542c04cfe5',
            decimals: 9,
            symbol: 'BULLS',
        },
        {
            address: '0x5b2398937dcbdb35ecae986c5d83a8f5c03f6dcc',
            decimals: 9,
            symbol: 'GHIBLON',
        },
        {
            address: '0x9aaec362fa6fad717f9282a6458043930004e042',
            decimals: 9,
            symbol: 'DB',
        },
        {
            address: '0xe2efd216fa0b9c96b70d490dbe8a09e12a005ce5',
            decimals: 9,
            symbol: 'ETH',
        },
        {
            address: '0x3f80b1c54ae920be41a77f8b902259d48cf24ccf',
            decimals: 18,
            symbol: 'KERNEL',
        },
        {
            address: '0xc8ef4398664b2eed5ee560544f659083d98a3888',
            decimals: 18,
            symbol: 'CTM',
        },
        {
            address: '0x7f3824767f938c3f69611e43c6d11ca9740a32cc',
            decimals: 9,
            symbol: 'BUNNIES',
        },
        {
            address: '0x44de1c3ed0119e1b13f7a06befbf746af47ecea6',
            decimals: 9,
            symbol: 'ORO',
        },
        {
            address: '0xb0d10719f4514a6069502925a453754685bcbfd4',
            decimals: 18,
            symbol: 'CORL',
        },
        {
            address: '0xecdbe0bd0d97a7bd1ffd13149c3b40161493dfb9',
            decimals: 18,
            symbol: 'SEKOIA',
        },
        {
            address: '0x87066d092ad3790ac12df9d0375608b90ef15f6b',
            decimals: 9,
            symbol: 'VITALY',
        },
        {
            address: '0xb841f365d5221bed66d60e69094418d8c2aa5a44',
            decimals: 18,
            symbol: 'DSTRX',
        },
        {
            address: '0x8e964e35a76103af4c7d7318e1b1a82c682ae296',
            decimals: 18,
            symbol: 'FLZ',
        },
        {
            address: '0xdc3b29e8c9fd98e5698a0324d711d9f2a986096b',
            decimals: 9,
            symbol: 'DRAWIFY',
        },
        {
            address: '0x86efc496dca70bcfd92d19194290e8457a375773',
            decimals: 0,
            symbol: 'UBSN',
        },
        {
            address: '0x27cf096db452425c51daa356e7d9c574c75e8737',
            decimals: 18,
            symbol: 'PTC',
        },
        {
            address: '0x5902fce8f42de5fab8274742fb101c94acc6eeb6',
            decimals: 18,
            symbol: 'LOST',
        },
        {
            address: '0x5c697fee285b513711a816018dbb34dc0cfc4875',
            decimals: 18,
            symbol: 'MNTx',
        },
        {
            address: '0x769916a66fdac0e3d57363129caac59386ea622b',
            decimals: 12,
            symbol: 'TEER',
        },
        {
            address: '0xfe936728974ec2e16d4b0ca68a57cc9cf3555306',
            decimals: 9,
            symbol: 'BWVC',
        },
        {
            address: '0x7e436ae06d167d06544e81180c6e6e06c4b51bbe',
            decimals: 9,
            symbol: 'PANTS',
        },
        {
            address: '0xf16a19a0071f519b9bcbbeece51aea66420cbbc1',
            decimals: 18,
            symbol: 'KTA',
        },
        {
            address: '0x223342e18166118169bf13dff82ac93d4e00783f',
            decimals: 9,
            symbol: 'PEEK',
        },
        {
            address: '0x8d7cd704e7995477c37b659fa7a3d301933a6800',
            decimals: 9,
            symbol: 'ETH',
        },
        {
            address: '0x51dba61e97c005a8027c66e201e1d2c591f9e67d',
            decimals: 9,
            symbol: 'PEEP',
        },
        {
            address: '0xb4813b68f65fd2d171cc68dc22cb06f038b5543c',
            decimals: 9,
            symbol: 'PUPPETH',
        },
        {
            address: '0x10f5c063fe0c109f095337de8bc6e03d81f64fb3',
            decimals: 18,
            symbol: 'SAHUR',
        },
        {
            address: '0xcfbfdd3aa34babf4ffe911a68103fd18c6e277d4',
            decimals: 9,
            symbol: 'FEDCOIN',
        },
        {
            address: '0xb16a5f4614c90d29a66fab52bc61ad38df2a50a5',
            decimals: 9,
            symbol: 'STABLECOIN',
        },
        {
            address: '0xb90c7aa62cb8940e961ae031047a7767876aa728',
            decimals: 9,
            symbol: 'MR',
        },
        {
            address: '0xfb1bde88923c33feecd2cd3e906506e670401757',
            decimals: 9,
            symbol: 'TSF',
        },
        {
            address: '0xa8c853ee25234a42e2d977d5eb2841fc95c207e1',
            decimals: 18,
            symbol: 'ETF',
        },
        {
            address: '0xaca8dc895e73d2728a4e081aa5170e5af7517821',
            decimals: 9,
            symbol: 'NCM',
        },
        {
            address: '0x1492bf16c9879c928b861ec6f4fed976a3113a0f',
            decimals: 9,
            symbol: 'Peep',
        },
        {
            address: '0x96ac181b8ae9df88ed31d2996c51523eda1d740e',
            decimals: 9,
            symbol: 'DOT',
        },
        {
            address: '0x8dddc1cf5e52c731651be584baa75fe0e7dc97e2',
            decimals: 9,
            symbol: 'FATCAT',
        },
        {
            address: '0x1d678d8ed13932005dd9a5c600091c55da1b9c5a',
            decimals: 9,
            symbol: 'WHC',
        },
        {
            address: '0xaddf205a24c13e2dd3685bff238b2124e17f0613',
            decimals: 9,
            symbol: 'XORIGINALS',
        },
        {
            address: '0x7c5d558cd1af9f234ee11a05549eae7707af711a',
            decimals: 18,
            symbol: 'THE',
        },
        {
            address: '0xc9e48e6454e95d5240f91e763c030f83c6b4f130',
            decimals: 9,
            symbol: 'KIBO',
        },
        {
            address: '0x7f35dee77675854fc7f3ffc9f1dcc4cb527be0fc',
            decimals: 9,
            symbol: 'MutuumPresale',
        },
        {
            address: '0xed2cb6ea1a11b0c62a209b93fda79767424521ad',
            decimals: 9,
            symbol: 'GOPHER',
        },
        {
            address: '0xe1ca1750cf2b9d244d713813fb515fbe1901e288',
            decimals: 9,
            symbol: 'Wizard',
        },
        {
            address: '0x6d322bb6c29c0fcaa070692e7dd080ed55b830c5',
            decimals: 9,
            symbol: 'MIRO',
        },
        {
            address: '0xc0c8f247ff02a582438a42655fc75d67ce8e8327',
            decimals: 9,
            symbol: 'YUMI',
        },
        {
            address: '0x12a62410e24cfc307e1603bf9c6a0c1f4abe5457',
            decimals: 9,
            symbol: 'RISC-V',
        },
        {
            address: '0x8e786a41d41014d5ca846ffe01435c559e5281f3',
            decimals: 9,
            symbol: 'SOLX',
        },
        {
            address: '0xa54215c1331e721536d9bca7918dc6e60ba4e053',
            decimals: 9,
            symbol: 'ZBCN',
        },
        {
            address: '0x5f346dfe72a628c32658135ee11d5bb41b8b8ed6',
            decimals: 9,
            symbol: 'LCAI',
        },
        {
            address: '0xc67b143072c041be3ae2ec0de425c641c3753f96',
            decimals: 9,
            symbol: 'DOGES',
        },
        {
            address: '0x335aa737634fb33dd771bf1391e0365996b34fc3',
            decimals: 9,
            symbol: 'DOGES',
        },
        {
            address: '0xb85bab6570599f6b2a62a36a6cf2c2b60a516465',
            decimals: 9,
            symbol: 'Qubetics',
        },
        {
            address: '0x362eaf2f166b5ded89a83147ed3b75cef5685d3e',
            decimals: 18,
            symbol: 'LFG',
        },
        {
            address: '0xdcf5bf42c3b4140debcf5e457b9a297d214ffacc',
            decimals: 9,
            symbol: 'Dawg',
        },
        {
            address: '0xac184a7f191295eacfeafb28fe50b6cad4673dfd',
            decimals: 9,
            symbol: 'SOLAXY',
        },
        {
            address: '0x6e8c7ea62590a0aa983cfb440e3aea942806fc5c',
            decimals: 9,
            symbol: 'Mutuum',
        },
        {
            address: '0x0feeed45f06379f1dd3d78caa0a70001c911816a',
            decimals: 9,
            symbol: 'KEKIT',
        },
        {
            address: '0x323c03c48660fe31186fa82c289b0766d331ce21',
            decimals: 18,
            symbol: 'OPEN',
        },
        {
            address: '0x2da30ec20c88662632fb71379f5f8119455ae800',
            decimals: 9,
            symbol: 'YOU',
        },
        {
            address: '0x0f81001ef0a83ecce5ccebf63eb302c70a39a654',
            decimals: 18,
            symbol: 'DOLO',
        },
        {
            address: '0x16c197afd7714e1eb74148d79b3c04951ef199bf',
            decimals: 9,
            symbol: 'PEPES',
        },
        {
            address: '0xb645f43266969ff209dd2962fbcb0ad9f54109fe',
            decimals: 18,
            symbol: 'PLG',
        },
        {
            address: '0x602972e451daf00760c5d6cf57287d0dd19aa452',
            decimals: 9,
            symbol: 'POSEIDON',
        },
        {
            address: '0x0b69f109150783ad3d252ad45e35f6b155def356',
            decimals: 18,
            symbol: 'POSEIDON',
        },
        {
            address: '0x2f4b36442687e943e587b45cccc92d60c3c3502f',
            decimals: 18,
            symbol: 'BETT',
        },
        {
            address: '0x9e3b5582b22e3835896368017baff6d942a41cd9',
            decimals: 18,
            symbol: 'H1',
        },
        {
            address: '0xc2eb01637b0b1c740229bffe659e958eaf334955',
            decimals: 18,
            symbol: 'POPE',
        },
        {
            address: '0xef4461891dfb3ac8572ccf7c794664a8dd927945',
            decimals: 18,
            symbol: 'WCT',
        },
        {
            address: '0x93a2db22b7c736b341c32ff666307f4a9ed910f5',
            decimals: 18,
            symbol: 'HYPER',
        },
        {
            address: '0x221f7cd129e590c4aead70b2f807de876535d640',
            decimals: 9,
            symbol: 'MechKenna',
        },
        {
            address: '0x53162ec0adae49f21515bb8ca91534dd3872c8db',
            decimals: 18,
            symbol: 'SIGMA',
        },
        {
            address: '0x44010973375d320be6ec899d1ff5f99871bb1a19',
            decimals: 9,
            symbol: 'TIO',
        },
        {
            address: '0xd85a68faa78b4431dce816c157b66fc9911b3612',
            decimals: 18,
            symbol: 'INF',
        },
        {
            address: '0xd588099529386028455ab8d91dc82552e9e5aaf0',
            decimals: 9,
            symbol: 'ANJU',
        },
        {
            address: '0x0feba1fe98c6a3f8e85e6779012e97ed6d26df35',
            decimals: 18,
            symbol: 'DAGZ',
        },
        {
            address: '0x4151d1f1c774a4ac2fb61cb23e82454e096edfef',
            decimals: 9,
            symbol: 'ETHLLAMA',
        },
        {
            address: '0x64f54456acb3787141d2dd6d0c2df2f56318682c',
            decimals: 18,
            symbol: 'DOGE2',
        },
        {
            address: '0xce8cd116956c09b21578f89c4895f67f1e8d5cdc',
            decimals: 9,
            symbol: 'GROKVISION',
        },
        {
            address: '0x0ae22f6346d4815c7d0c74f1e6e83a43b7d17d78',
            decimals: 9,
            symbol: 'GUANACO',
        },
        {
            address: '0x8bcf2af14ce1a6c2546187049051e65f85d8778a',
            decimals: 9,
            symbol: 'BOOMKIN',
        },
        {
            address: '0xe45dfc26215312edc131e34ea9299fbca53275ca',
            decimals: 18,
            symbol: 'REL',
        },
        {
            address: '0x05c1408de3ea52e051d7019bca21af62bbb3b210',
            decimals: 9,
            symbol: 'KABOCOIN',
        },
        {
            address: '0xbb23ae88d024be2775a4ea7813b0e71d274a5eeb',
            decimals: 9,
            symbol: 'POPE',
        },
        {
            address: '0xc71d01a6ce3fc2d1769586c07b595e339abaf164',
            decimals: 9,
            symbol: 'JOMON',
        },
        {
            address: '0x5d4b7687d7687216f056d856edea75d18a215fe2',
            decimals: 9,
            symbol: 'AGI',
        },
        {
            address: '0x31228541a744f68083d7be409bff3f3a9e8b7371',
            decimals: 18,
            symbol: 'DOGES',
        },
        {
            address: '0x6507a08a3749a7dcf1a3d7b2b28e6a26e3e8d3b5',
            decimals: 18,
            symbol: 'ETH',
        },
        {
            address: '0x8d800f79ab5883135ac839764a27aa87312979fb',
            decimals: 9,
            symbol: 'DELBERT',
        },
        {
            address: '0x26b478c6dfadfd7a5837d19da57f37e759356229',
            decimals: 9,
            symbol: 'GCR',
        },
        {
            address: '0x7c646f67a8892ebc8ac1f88dc80daf1d8090dcf3',
            decimals: 9,
            symbol: 'SX',
        },
        {
            address: '0x737d461917ccf0fa28a52da30672e2ddc214f0bf',
            decimals: 18,
            symbol: 'OZK',
        },
        {
            address: '0xe83240d51de8c18b2ebad50d5489b62b736e6aa2',
            decimals: 9,
            symbol: 'ETHR',
        },
        {
            address: '0xbb96a8996cabacd5079a3d109784380eeaaea76f',
            decimals: 18,
            symbol: 'RABBIT',
        },
        {
            address: '0x551f297a118644201fc10eeffcced82b4e6ff791',
            decimals: 9,
            symbol: 'RTR',
        },
        {
            address: '0x687d8a3bb7041af46c4ecd727e96ecb5c129db44',
            decimals: 9,
            symbol: 'TRUMP2028',
        },
        {
            address: '0xc4fa51e5208b835bc6db3144f25067aa194befba',
            decimals: 9,
            symbol: 'TRUMP28',
        },
        {
            address: '0xe86f8e6061c8a27d235e96e08daec34f12d335f9',
            decimals: 9,
            symbol: 'SOLAXY',
        },
        {
            address: '0x67d9c7daecc5b87c3e68ac89f33ee924fac88c05',
            decimals: 9,
            symbol: 'MOOCOW',
        },
        {
            address: '0x681425469fe7ffbeee513be2db4ef9b7f77320e2',
            decimals: 9,
            symbol: 'MOOCOW',
        },
        {
            address: '0xaaa000e1b72bf8dfa74c958e19e925c0bfae9ded',
            decimals: 18,
            symbol: 'AUT',
        },
        {
            address: '0x51a596bb00dea4ef5dfeee533370a85f73ff782c',
            decimals: 9,
            symbol: 'MMM',
        },
        {
            address: '0x377aee0d43e537f1ad1d88b99fc06481f7527da8',
            decimals: 9,
            symbol: 'MOO',
        },
        {
            address: '0x5614e9c8a40efb2bc9548d4ebf07ac7aa9b7ed70',
            decimals: 9,
            symbol: 'MOOSE',
        },
        {
            address: '0x03dea743453270ad86ce66771829bfb917990ed4',
            decimals: 9,
            symbol: 'TRUMP32',
        },
        {
            address: '0x23e8c1b72b0986148bc2109edabd6794587fa7f0',
            decimals: 18,
            symbol: 'BULLHAT',
        },
        {
            address: '0xe390deba58c8028d5723a1a5e0f8aa3f2a8db78f',
            decimals: 9,
            symbol: 'NABOON',
        },
        {
            address: '0x4c7ebd275d6afc11576cdf6a29718ff006d156ad',
            decimals: 9,
            symbol: 'MOOSE',
        },
        {
            address: '0xab8cfcd98e5b200b720ab870e1ec5f92b881836f',
            decimals: 9,
            symbol: 'EPOD',
        },
        {
            address: '0xc600e1f1f44d1eb659f07a0dfe27696bb8791978',
            decimals: 9,
            symbol: 'EGOD',
        },
        {
            address: '0x85958aa9ad9d4d177a38045f77ba77634f45f5f2',
            decimals: 9,
            symbol: 'SEMI',
        },
        {
            address: '0x80a2196b8e132e73a2b9213d51fe0eb544869bd1',
            decimals: 9,
            symbol: 'BTCBULL',
        },
        {
            address: '0x43d1353c0d9eb28cbb0a64d9965327bc51f40dfe',
            decimals: 9,
            symbol: 'HOSICO',
        },
        {
            address: '0xc6862d12dbdf6962b40db2fe93db2514e7aba59e',
            decimals: 9,
            symbol: 'AREXA',
        },
        {
            address: '0xd033ebdcf7ac69664686f3a3716224beb43cb63c',
            decimals: 9,
            symbol: 'SUBO',
        },
        {
            address: '0xb489f82c2ad9c840b240072e7ec1baf9ad85906a',
            decimals: 18,
            symbol: 'ETH',
        },
        {
            address: '0x6944c787f64152c736d91cad95560f7267639de9',
            decimals: 9,
            symbol: 'GEN',
        },
        {
            address: '0xf1fa5809163c25049c4ee2883e4bc3d6fddd83a7',
            decimals: 18,
            symbol: 'GOV',
        },
        {
            address: '0x8dbccd2114e24c683d9844e86781601f03e38387',
            decimals: 9,
            symbol: 'KEN',
        },
        {
            address: '0x9fe55f10caa8dbaaeb8c6f5f661287fe1cff2a73',
            decimals: 9,
            symbol: 'GUANACO',
        },
        {
            address: '0xe730094b6fe106e90a3e62af07db415b97d8dea5',
            decimals: 18,
            symbol: 'VADER',
        },
        {
            address: '0x6389b02e5242d0b14c85f08b80c5d93af9801bbf',
            decimals: 9,
            symbol: 'PAPERCLIP',
        },
        {
            address: '0x1b76b458334baaee66a49335464552f7237e2394',
            decimals: 6,
            symbol: 'USDT',
        },
        {
            address: '0x9e59a081320ddb046d74a106335ca6b84eadc067',
            decimals: 18,
            symbol: 'BIDEN',
        },
        {
            address: '0x557a76b5295c6fb33c13e3027c80b5d5cf8b118b',
            decimals: 18,
            symbol: 'd150',
        },
        {
            address: '0xc4affeab20032b22718363671c711dc54f3794e8',
            decimals: 9,
            symbol: 'GMC',
        },
        {
            address: '0x8fa68e6bc05506d43568e2f12832b08ab85e14fa',
            decimals: 9,
            symbol: 'CANADA',
        },
        {
            address: '0x0828096494ad6252f0f853abfc5b6ec9dfe9fdad',
            decimals: 18,
            symbol: 'TST',
        },
        {
            address: '0x47f5ba543af1bc8879380855f9b35bc85f38bff0',
            decimals: 9,
            symbol: 'titcoin',
        },
        {
            address: '0x67268b4c0d4dd731a62690024a60ba81edeb583e',
            decimals: 18,
            symbol: 'XMR',
        },
        {
            address: '0xb7dbcd4bb7a6882b3fe4e7c7668449fab38d3c39',
            decimals: 9,
            symbol: 'KABOCHA',
        },
        {
            address: '0xed20ac2936c0308d3a299c28941065f9e30843eb',
            decimals: 9,
            symbol: 'TETSU',
        },
        {
            address: '0xb39ea6bd4591d7e4640fa15e92846aea18bb81c8',
            decimals: 18,
            symbol: 'LCAI',
        },
        {
            address: '0x777b19083f072dafd0a00a50929a1b21bc8a0528',
            decimals: 9,
            symbol: 'HATAKE',
        },
        {
            address: '0xe5e8263bfe0fcf7ca754088910904388b1ead7bb',
            decimals: 9,
            symbol: 'LEMON',
        },
        {
            address: '0x1ead0f29482842fe831030406c0e6603ceb28a30',
            decimals: 9,
            symbol: 'LEMON',
        },
        {
            address: '0x950885a61398a4451cdb17879b58dc6a96e4fd76',
            decimals: 9,
            symbol: 'gnom',
        },
        {
            address: '0xc8ec967914f6ec07cdd2e528ebd010cca4298ce8',
            decimals: 9,
            symbol: 'DOGE69420',
        },
        {
            address: '0x6b34022924d6ccfcc913e92ff66c0c432ca409f0',
            decimals: 9,
            symbol: 'MVG',
        },
        {
            address: '0xa5f60e1f301602b03124e392ae2ec963f2142d59',
            decimals: 9,
            symbol: 'MIKAMI',
        },
        {
            address: '0x281f35f507635d9e8a478afaf01df488978cc638',
            decimals: 18,
            symbol: 'WISE',
        },
        {
            address: '0xe059fddceb0b2d59e310c5ebe2655587322c94e4',
            decimals: 9,
            symbol: 'CORON',
        },
        {
            address: '0xbc0edf74963487c46f3c196f12efb77bf0e28ac0',
            decimals: 9,
            symbol: 'HODLER',
        },
        {
            address: '0x4ed203315a2e607ce7ed1c9e4430604eaa073e13',
            decimals: 9,
            symbol: 'MvG',
        },
        {
            address: '0x32362746ee14e31efcf9435e5c20f9bbead8adf0',
            decimals: 18,
            symbol: 'Aztec',
        },
        {
            address: '0x66055b070ccaa89c8240f36c4a507a409d48a519',
            decimals: 9,
            symbol: 'Onara',
        },
        {
            address: '0xe778fd9a8d074e4a808092896b33fe3d3452c125',
            decimals: 18,
            symbol: 'FROGGER',
        },
        {
            address: '0xda1f4d92ca3748786f71b8f065a95938dc8ab554',
            decimals: 18,
            symbol: 'VANRY',
        },
        {
            address: '0x5efc9e189d2e9749af480986a2db8eeb6d5efcf5',
            decimals: 18,
            symbol: 'BBY',
        },
        {
            address: '0xf4331bc30022754e525a19d2503e991909872387',
            decimals: 9,
            symbol: 'CHACHA',
        },
        {
            address: '0x75360a6ed6a43355ce247def34e1dfd7b772914b',
            decimals: 9,
            symbol: 'CHACHA',
        },
        {
            address: '0x381c5265690858e64fee6ac5122e9535c0ad02cc',
            decimals: 18,
            symbol: '404',
        },
        {
            address: '0xb2e19ebe7f3674285eff1511b9eadffc39cd66b0',
            decimals: 18,
            symbol: 'STA',
        },
        {
            address: '0x4a4907eb5abbde4d845c603eeea4ea57b4fcbc2b',
            decimals: 9,
            symbol: 'SOLX',
        },
        {
            address: '0xec241cc4727e6541ccd06be785edff501d34e5f9',
            decimals: 9,
            symbol: 'GORK',
        },
        {
            address: '0x5bc755f228a4a692516ed7805c60ab1ce3cafb18',
            decimals: 9,
            symbol: 'GORK',
        },
        {
            address: '0x248180495d5ee9e20f5f043c5dac0803506a753a',
            decimals: 9,
            symbol: 'fuckcoin',
        },
        {
            address: '0x5b6805fc3c73f9e86e27ed31d2e5ab6f2976309c',
            decimals: 9,
            symbol: 'STEVE',
        },
        {
            address: '0xc7190d24f0a21afcf70534703cf244c4d8de0170',
            decimals: 9,
            symbol: 'MITSUKI',
        },
        {
            address: '0x92173619b65ee2039a3d30a61b11ee98711fd2f3',
            decimals: 9,
            symbol: 'gork',
        },
        {
            address: '0x7ba73e23205b348d77ee6e44611f47a9f772a588',
            decimals: 9,
            symbol: 'GORK',
        },
        {
            address: '0xc441d0bd70dbcf711f4bba19aea3deff47ce1c48',
            decimals: 6,
            symbol: 'pfUSDC-24',
        },
        {
            address: '0xb988be495064d5593a87aa01b56af0908918ace1',
            decimals: 9,
            symbol: 'ASS',
        },
        {
            address: '0x356d5b19e0cdee89c1a0e239107e5bb2ac495335',
            decimals: 9,
            symbol: 'DOJI',
        },
        {
            address: '0x6900064531bbb97b153990bbf9938c58247db14b',
            decimals: 9,
            symbol: 'ETH6900',
        },
        {
            address: '0x96836d526c9f5a940465b8b3db418927f4e82954',
            decimals: 9,
            symbol: 'JUNO',
        },
        {
            address: '0xde63833b28474d3bc12a095a5355d9f6c92adf9a',
            decimals: 9,
            symbol: 'BOOK',
        },
        {
            address: '0x0eb3032bcac2be1fa95e296442f225edb80fc3cd',
            decimals: 18,
            symbol: 'ATC',
        },
        {
            address: '0xb4495da9e3b24690f7ccd37f2bd4648ff69371d5',
            decimals: 18,
            symbol: 'ROT',
        },
        {
            address: '0xc6eb293fb4938d3e5cef232403025624e0d16bcc',
            decimals: 9,
            symbol: 'SOLX',
        },
        {
            address: '0x4d4c3751f492c35a7a029052aad02cdfc6d5e342',
            decimals: 9,
            symbol: 'KOBUSHI',
        },
        {
            address: '0x3125cccd8862eee9e8f2160113871f50fbd55edd',
            decimals: 9,
            symbol: 'Kobushi',
        },
        {
            address: '0xd86830e9c56785e2b703eb0029ae71a943e4d442',
            decimals: 9,
            symbol: 'KOBUSHI',
        },
        {
            address: '0x392f9f6821e2f70182a166cc8206be11d9a3c5b9',
            decimals: 9,
            symbol: 'PANDA',
        },
        {
            address: '0x900a4a9063d7c123847de9b011bbf9025a23fefd',
            decimals: 9,
            symbol: 'Pandas',
        },
        {
            address: '0x4a974e5956e1044c9fcf4bfd4826857f7f7fe936',
            decimals: 9,
            symbol: '10waz2',
        },
        {
            address: '0x59f31a3e7baa315d798512ef56574734ac495a6f',
            decimals: 9,
            symbol: 'Artemis',
        },
        {
            address: '0x4430d512b620223b2ae9f39d25e2b0260fbc4845',
            decimals: 9,
            symbol: 'Marigold',
        },
        {
            address: '0xbca7fa46062904e2e4500b3b48aa82edf3da1da8',
            decimals: 18,
            symbol: 'DGN',
        },
        {
            address: '0xb08d8291940929e2878a0636fa9f46ab6589c113',
            decimals: 9,
            symbol: 'LOFIMAGA',
        },
        {
            address: '0x5ed3444acc07d198b4c8cbb795dfab24539bac81',
            decimals: 9,
            symbol: 'PAOPAO',
        },
        {
            address: '0xf46ccb9e08fb7e32eed560c87d5e583a59a43420',
            decimals: 18,
            symbol: 'SPDG',
        },
        {
            address: '0xb80c33bc32d2e19fbe4621e1b0d31c1cb3b69f99',
            decimals: 18,
            symbol: 'RSTAR',
        },
        {
            address: '0xe46440c2f2be9efdd88f27648d369edc8b62a8e8',
            decimals: 18,
            symbol: 'PLG',
        },
        {
            address: '0xd878e4dc6060fc189524bb9457adf343c4494844',
            decimals: 18,
            symbol: 'MIND',
        },
        {
            address: '0x8d435a46c143a08bc99af0967a550e580d8ff879',
            decimals: 18,
            symbol: 'VIZSLASWAP',
        },
        {
            address: '0xa952d1204b5e5760efedbb5631d7a9270926d4eb',
            decimals: 18,
            symbol: '$DUP',
        },
        {
            address: '0xd20309de214ff7a0655ffac3d3346b04608d2d34',
            decimals: 9,
            symbol: 'STRAWBERRY',
        },
        {
            address: '0xde10e26e587a7c2f701b7da3870786f07196cf34',
            decimals: 9,
            symbol: 'YAMI',
        },
        {
            address: '0x80b8a59856e435305dbdb8033978aa5ddf096c25',
            decimals: 18,
            symbol: '$DUP',
        },
        {
            address: '0x457a6dade9d30239f4269efbf0531ced0cec44a5',
            decimals: 9,
            symbol: 'RICOWAKO',
        },
        {
            address: '0x6d575040ebdbf2171f2b060ba4439ad348d4712e',
            decimals: 9,
            symbol: 'MAMEJIRO',
        },
        {
            address: '0x17906b1cd88aa8efaefc5e82891b52a22219bd45',
            decimals: 18,
            symbol: 'SUPR',
        },
        {
            address: '0x8aa9d811e4974ecb25a7b615694dc5692ae36505',
            decimals: 9,
            symbol: 'RIKO',
        },
        {
            address: '0x25c2116e158d656ce20837460df9095e42de4a56',
            decimals: 18,
            symbol: 'TIBBIR',
        },
        {
            address: '0x12933a6fbb51705f5e6739ddc45231b232a62e81',
            decimals: 18,
            symbol: 'ROCK',
        },
        {
            address: '0x50747342f5cb627c407b6444489f63ff5fa7aa56',
            decimals: 9,
            symbol: 'YAYA',
        },
        {
            address: '0x4335b03a3c9ac7d56a11cffdf9c37810e35627f8',
            decimals: 9,
            symbol: 'WAKO',
        },
        {
            address: '0x6f609fef7a325b82094f093286e65fee73d0bada',
            decimals: 9,
            symbol: 'kikuchiyo',
        },
        {
            address: '0x69420908d770062bf373d2cd1d4b6cdc4c879f7a',
            decimals: 9,
            symbol: 'STARBASE69420',
        },
        {
            address: '0x38731c2467e4e19ee031d7401466a970f21755e0',
            decimals: 9,
            symbol: 'GORKLON',
        },
        {
            address: '0xfa8197fe0559d3c45862d93df5cf59c7c7f8ebbb',
            decimals: 9,
            symbol: 'gorklon',
        },
        {
            address: '0x5c14d39b0e15d63e0f48678668bfed105c83e4e3',
            decimals: 9,
            symbol: 'GORKLON',
        },
        {
            address: '0x78efedf7357a87891d1b155a4d0a27cd5be24e98',
            decimals: 9,
            symbol: 'GORKLON',
        },
        {
            address: '0xa6289af6e778ced0b09cdda7c6bf8ba39d3a8338',
            decimals: 9,
            symbol: 'GORKOGE',
        },
        {
            address: '0x0afa26dba672e814bc9796f3784b57122e4e6670',
            decimals: 9,
            symbol: 'MORG',
        },
        {
            address: '0x4ea1e3d807488b373acc301480d75e8f87e9c0ed',
            decimals: 9,
            symbol: 'GORKLON',
        },
        {
            address: '0x882689796d43d9ae5179c774504adca09d49d17c',
            decimals: 18,
            symbol: 'AMK',
        },
        {
            address: '0x296c4ca0f447d638d40373d2a3c8779c65f02464',
            decimals: 9,
            symbol: 'MASIKI',
        },
        {
            address: '0x2073f62ec2cde20afc710a3b725976bb06687c02',
            decimals: 18,
            symbol: 'GROK',
        },
        {
            address: '0xf7938c8da3464de0c6b96d5b0c37ea32429d9e37',
            decimals: 18,
            symbol: 'X10FUN',
        },
        {
            address: '0x9b57a88dc0737f88d7db862b28dfc60d41b1a6d8',
            decimals: 9,
            symbol: 'GorkDoge',
        },
        {
            address: '0x0d464ef3f329603034deaff4a18a2bdc719562d7',
            decimals: 9,
            symbol: 'KAZE',
        },
        {
            address: '0xc94aa031521459f8da604f11921310895af2c9e8',
            decimals: 9,
            symbol: 'UNO',
        },
        {
            address: '0x18358c6df271dbc65899264617bb89eb0cb18211',
            decimals: 9,
            symbol: 'MAXI',
        },
        {
            address: '0x8c95d7eeca1777538ef4a427322bb422e2e75c88',
            decimals: 18,
            symbol: 'SAR',
        },
        {
            address: '0xe2ba0f30caeba4b4f86df1bb1737856e4736efae',
            decimals: 18,
            symbol: 'TT56',
        },
        {
            address: '0x76a178c956ae43dab8aa04ccfbf1fd13e31b45e4',
            decimals: 9,
            symbol: 'URMOM',
        },
        {
            address: '0xbee6ded67f486cef15ac12e4cc9041ab3a87e591',
            decimals: 18,
            symbol: 'TICS',
        },
        {
            address: '0x9d17a95c8fc8cfac8f4408f2431838e4e5794938',
            decimals: 9,
            symbol: 'BUTTFART',
        },
        {
            address: '0xd61fb5dd9aae7750fbf52091a0eff44c009edc02',
            decimals: 9,
            symbol: 'PECTRA',
        },
        {
            address: '0x5a35618c152ba1a3b05f96850e80a781596a27d2',
            decimals: 9,
            symbol: 'NATSUME',
        },
        {
            address: '0x8172e2ff7009483ff98c24bd639c8078caced9a3',
            decimals: 18,
            symbol: 'SICKB',
        },
        {
            address: '0xefb05c638bde026a45c2e92eb52a0ec282e194a6',
            decimals: 9,
            symbol: 'DESLA',
        },
        {
            address: '0x89b6c60e4a8b4b465252b7ac393d813c600d201f',
            decimals: 9,
            symbol: 'TAXMAN',
        },
        {
            address: '0xe23225384a3bc8804fef9b84ef9f631fbae1886d',
            decimals: 9,
            symbol: 'PECTRA',
        },
        {
            address: '0x8c42eb4ea74aa859d856364d4fc40b9525ae1f07',
            decimals: 18,
            symbol: 'RAYAA',
        },
        {
            address: '0x75f708cb140b84e771d3acab0c968738603290f5',
            decimals: 9,
            symbol: 'PECTRA',
        },
        {
            address: '0x02120bee92b910917ce34a7f56e470da7ab95bef',
            decimals: 9,
            symbol: 'MON',
        },
        {
            address: '0x354c7b004839009fc87f104fc8914b44fdd6d078',
            decimals: 9,
            symbol: 'LLJEFFY',
        },
        {
            address: '0x1c16ee66da26d068dbf904c617f9cb20d1814286',
            decimals: 9,
            symbol: 'RAIRO',
        },
        {
            address: '0x83928edac60ce2a9cc96a8feeeb99843376100ac',
            decimals: 9,
            symbol: 'GORKCAT',
        },
        {
            address: '0x712f3378cd1a0476b53f0e29b1a9586e00d78683',
            decimals: 9,
            symbol: 'CATE',
        },
        {
            address: '0xc456ebd35ac8a4ba9e92ef6dbe942aad1359fbd2',
            decimals: 9,
            symbol: 'AGI',
        },
        {
            address: '0x101de566b9a50903f680eb3be9f1a3f9f9a84a95',
            decimals: 18,
            symbol: 'MUTM',
        },
        {
            address: '0x5ea4c620533230eeb5419a0c60dd23284e0193fa',
            decimals: 9,
            symbol: 'MASIKI',
        },
        {
            address: '0x286935f5b7f3b8b44739df33e5536b9ef27e88e0',
            decimals: 18,
            symbol: 'BabyKabosu',
        },
        {
            address: '0xd83ee5dc263f60846899da1194c568bcb312af09',
            decimals: 18,
            symbol: 'RVC',
        },
        {
            address: '0x620f2590c47794d919301d9d4faa54efef97c595',
            decimals: 9,
            symbol: 'SATO',
        },
        {
            address: '0xec0c3fae5bfc96926d7581e4e0f7ceb34c0252df',
            decimals: 9,
            symbol: 'NIETZSCHE',
        },
        {
            address: '0x589f43367df642cf91751f0add0e695674cfd529',
            decimals: 9,
            symbol: 'PECTRA',
        },
        {
            address: '0xc9b53ab2679f573e480d01e0f49e2b5cfb7a3eab',
            decimals: 18,
            symbol: 'WXTZ',
        },
        {
            address: '0xc7f380530c789f61dff8b022874e5185076cc1fb',
            decimals: 9,
            symbol: 'GPECTRA',
        },
        {
            address: '0x0bb56abe818de11c5430cfd54e52caeabecb10d5',
            decimals: 9,
            symbol: 'mog/acc',
        },
        {
            address: '0x36c5183e972a46109a97774551328e1948aad64b',
            decimals: 18,
            symbol: 'DRTv2',
        },
        {
            address: '0x42c3de21fc6a9c2f1795c8880a0640e2559c74dd',
            decimals: 18,
            symbol: 'BTCBULL',
        },
        {
            address: '0xd96d7b45f9bf0573d232d3ec1582c00ddfe2da5d',
            decimals: 9,
            symbol: 'G.O.R.K',
        },
        {
            address: '0x58b558fb80f50b92ecda3aa86bf579434db0d691',
            decimals: 9,
            symbol: 'TROLLFACE',
        },
        {
            address: '0x8162ecd602cc61819cf6f5df2965ed56a0146617',
            decimals: 18,
            symbol: 'KB',
        },
        {
            address: '0xea7ba8291efdc52907fb19b36f5f78400c201b0d',
            decimals: 9,
            symbol: 'pitcoin',
        },
        {
            address: '0x76f0966dd37f9068d0ac415b003f8e4e9b686014',
            decimals: 9,
            symbol: 'ELON',
        },
        {
            address: '0x97eaa8d17bc3fcc38aedbc39e6b0468a8bd8cb30',
            decimals: 9,
            symbol: 'HARUKA',
        },
        {
            address: '0x7a0225ea95548ddcd5ed0d1a5ba9e5da2a6ddb47',
            decimals: 18,
            symbol: 'USA',
        },
        {
            address: '0x0fc7261bb26d6b12fdcf056636744fd543a89902',
            decimals: 9,
            symbol: 'SOLX',
        },
        {
            address: '0xee71c6e2865c5eba78ecfb93b5dc4ff6859b90c4',
            decimals: 9,
            symbol: 'ALEX',
        },
        {
            address: '0x0ba6e48d74885b4e135e6420fd19ac0d0c330fd2',
            decimals: 9,
            symbol: 'MOOPOO',
        },
        {
            address: '0xb08d3b641f03cc90c0f05613a85fa651ff8d99c2',
            decimals: 18,
            symbol: 'AQTN',
        },
        {
            address: '0x8b698afcdb7f6a4817715d9ec73b22b3dde8007f',
            decimals: 9,
            symbol: 'NAKAMOTO',
        },
        {
            address: '0x7d10cddbd8c28971f086b03a59e57c0393fb3f9e',
            decimals: 9,
            symbol: 'BFR',
        },
        {
            address: '0x0fb1eedbc85805e075db6d01009ca841aca8d88a',
            decimals: 18,
            symbol: 'EAGLE',
        },
        {
            address: '0xee5e7f6384f85ff55d291d8f8960a9da8cf5e124',
            decimals: 18,
            symbol: 'BLUCHK',
        },
        {
            address: '0x9b784f7fd6c888463666eb2c05aa6e61628e06b2',
            decimals: 18,
            symbol: 'BFT',
        },
        {
            address: '0x4615442538322b776c562765b9b15b4df47e9bca',
            decimals: 9,
            symbol: 'MILORD',
        },
        {
            address: '0x93d2853469ce26d27caff05dbbc03f5681dd874c',
            decimals: 9,
            symbol: 'BRF',
        },
        {
            address: '0xa3eb5cfdf1e2ddba1c8e5305fe9055da6667beaa',
            decimals: 18,
            symbol: 'WCat',
        },
        {
            address: '0x691ce55c6c6744a58205817c18381ad8e1e009ba',
            decimals: 18,
            symbol: 'AUTISMO',
        },
        {
            address: '0x846ad79cc77cfeb565f6b2af2154d5498f7d2f3c',
            decimals: 18,
            symbol: 'KingNeiro',
        },
        {
            address: '0xe6bfd33f52d82ccb5b37e16d3dd81f9ffdabb195',
            decimals: 18,
            symbol: 'SXT',
        },
        {
            address: '0x5063a83ce87e53a2b61d87a50ba151d00992b911',
            decimals: 9,
            symbol: 'gorkfather',
        },
        {
            address: '0x28bf908ac5c44062aade5a07929ce30becccc465',
            decimals: 9,
            symbol: 'gorkfather',
        },
        {
            address: '0xab719b8f6d2183cf6be0ac6a00c374ced32d9e09',
            decimals: 18,
            symbol: '$MMTR',
        },
        {
            address: '0x74b098c3faf4749c2baaac9bdf70cb2abfe3f4a4',
            decimals: 18,
            symbol: 'Kekfather',
        },
        {
            address: '0x5c05e82be66b19476bacb558e62e7d449b98635f',
            decimals: 6,
            symbol: 'tUSDT',
        },
        {
            address: '0xba50ce891807a38374826a906fad9d99580ae037',
            decimals: 6,
            symbol: 'tMVRK',
        },
        {
            address: '0xf2994d162c08c363380fdeaef3fe2daa1ec0fce7',
            decimals: 9,
            symbol: 'PESO',
        },
        {
            address: '0xd8fa9d088ff07eb40c2a61ab3e4a086931636435',
            decimals: 9,
            symbol: 'titcoin',
        },
        {
            address: '0xdc3b563f3596fd7f1dac7c15321583df73fe7c54',
            decimals: 18,
            symbol: 'TAO',
        },
        {
            address: '0x473bcd6ee71d2ca1d18f8e74cdf75beb4999fa7e',
            decimals: 18,
            symbol: 'rust',
        },
        {
            address: '0xc01494d30cb9794389f362807e6054ed3a9e924f',
            decimals: 18,
            symbol: 'PROTEIN',
        },
        {
            address: '0xd5e9dc9eac0a70c93a4bfa167d4a43f0432b7b60',
            decimals: 18,
            symbol: '$ETHERDEFI',
        },
        {
            address: '0xc69b50c07ac526bdf502031c611c6486afb36791',
            decimals: 9,
            symbol: 'TULA',
        },
        {
            address: '0xbfd45697bb5831ea12a4c8d57cd5b4e962dff8d9',
            decimals: 9,
            symbol: 'DINO',
        },
        {
            address: '0x7a8139c79222b331609810f2b6d662cb0c0dedde',
            decimals: 9,
            symbol: 'NAVANN',
        },
        {
            address: '0x0a22f3dcf8d567cbf6e3728894387cf7fbd4d25a',
            decimals: 9,
            symbol: 'NAVAAN',
        },
        {
            address: '0xf816507e690f5aa4e29d164885eb5fa7a5627860',
            decimals: 9,
            symbol: 'RATO',
        },
        {
            address: '0xcb60780640a912244658a636f13880a3eb0c76b0',
            decimals: 9,
            symbol: 'BOETH',
        },
        {
            address: '0xe826da3f5fd5f2f38b1d7905ee8df96b3789ee04',
            decimals: 18,
            symbol: 'BOETH',
        },
        {
            address: '0x190ebefdc8c7ec9c929bf14d07d908fded5d9da8',
            decimals: 18,
            symbol: 'DOOD',
        },
        {
            address: '0x3193f5880b315f181323d93f7afeaeaed684a4c9',
            decimals: 18,
            symbol: 'ETHX',
        },
        {
            address: '0x60a24e3040fe99cd51599b843551105741d23082',
            decimals: 9,
            symbol: 'BABIFY',
        },
        {
            address: '0xb544ab65055d71ac2c731faba8665ca065621077',
            decimals: 9,
            symbol: 'FRANCISII',
        },
        {
            address: '0x8a2f781206f3d4972b84f05eb93313dc1cb93ec7',
            decimals: 18,
            symbol: 'ORB',
        },
        {
            address: '0x979e6e31a8a2933b5858be3012235567abaecdd2',
            decimals: 18,
            symbol: 'FRANCISII',
        },
        {
            address: '0x069e821f0527d2420d3d6c2f1a169b0b3278cd91',
            decimals: 9,
            symbol: 'CHANGENAME',
        },
        {
            address: '0x87c1cfd1b73809b67cb400b4e12b29065df5a556',
            decimals: 9,
            symbol: 'PIETRO',
        },
        {
            address: '0x0a5e011c02a4abb4637edb23f5941afa221d7ae0',
            decimals: 9,
            symbol: 'POPE',
        },
        {
            address: '0x2ce3c934c21e166360b6f484d151cb6a031bbe07',
            decimals: 9,
            symbol: 'POPE',
        },
        {
            address: '0x4259ba0ef737e4783fc7a00b8dd013720c9a439a',
            decimals: 9,
            symbol: 'Prevost',
        },
        {
            address: '0xb70dc560e59ddf0d405ba50cb163baef47e398c4',
            decimals: 9,
            symbol: 'LEOXIV',
        },
        {
            address: '0xf7f3b3e5f961b0ed0ea3abbb26df7d451f8ec801',
            decimals: 9,
            symbol: 'POPE',
        },
        {
            address: '0xada297c63b96a7da72991134bc8b5eab2976ad6b',
            decimals: 18,
            symbol: 'POPE',
        },
        {
            address: '0x86670f2f3903f8861ccc26c0200dc08e25c40676',
            decimals: 9,
            symbol: 'FAP',
        },
        {
            address: '0x5116f19f6e10cb1b30b173775f29cedc2ea260f7',
            decimals: 18,
            symbol: 'PSN',
        },
        {
            address: '0x7d699127096203da792824c732e88d069eecf00f',
            decimals: 18,
            symbol: 'Flaunt',
        },
        {
            address: '0xfb70859efec2ceb84dd4935a0842aa69290020bc',
            decimals: 18,
            symbol: 'PAIRS',
        },
        {
            address: '0x72538c3cd6bab2125dce647ae564e9924581f00f',
            decimals: 18,
            symbol: 'f00f',
        },
        {
            address: '0xc853dae830bb3ecc31767ee3af1395a536cfb52f',
            decimals: 18,
            symbol: 'DIDDY',
        },
        {
            address: '0xdef28e65bc14bd4620209f34787d1dcae8903198',
            decimals: 9,
            symbol: 'BORPA',
        },
        {
            address: '0x68bdc687535031c2e2481a393851356423a3b07b',
            decimals: 18,
            symbol: 'PEPE',
        },
        {
            address: '0x34b5b0f409d12ad9ed2092329654d9143a31781d',
            decimals: 18,
            symbol: 'RUBBLE',
        },
        {
            address: '0x0d5477eb3105aea39f0ee5ea661e8dd90113c55f',
            decimals: 18,
            symbol: 'VECTOR',
        },
        {
            address: '0x713e5e9ef3515051bf94a3e13584fd3e95ef4a50',
            decimals: 9,
            symbol: 'VECTOR',
        },
        {
            address: '0x5cc5ce5fe855a59cdae719c80adf1ae453f70edb',
            decimals: 9,
            symbol: 'GOLDEN',
        },
        {
            address: '0x9c5dc438e3a2ea67c866cf1c25cb63259895d413',
            decimals: 18,
            symbol: 'ORB',
        },
        {
            address: '0x8fdcabb93060a6c248ef534c4bb406f13cd07b13',
            decimals: 18,
            symbol: '$BOBBY',
        },
        {
            address: '0x8dc6a2ea3b7c666070b9d832fbf02ea9b5b64c6c',
            decimals: 18,
            symbol: 'EVOLV',
        },
        {
            address: '0x11238cfaf8d03ddc1e1b56ee47fb9b3415ca9556',
            decimals: 18,
            symbol: 'GROT',
        },
        {
            address: '0x14960fbca589821e1b335ff1eed619b3a3dea4b1',
            decimals: 18,
            symbol: 'X',
        },
        {
            address: '0x8678e976f5f989ac5856bb7e2cc1e266c3d91dcf',
            decimals: 18,
            symbol: 'CLAM',
        },
        {
            address: '0x7d765531dd89853517d824a21f624f3be9d21b19',
            decimals: 9,
            symbol: 'CTHULU',
        },
        {
            address: '0xfd5088152b2bad37d5abee5216bc2115ce5d6b80',
            decimals: 9,
            symbol: 'Popepe',
        },
        {
            address: '0x8fd0bcf56bbcd3a3c276786858d059e91343cae3',
            decimals: 9,
            symbol: 'Debugging',
        },
        {
            address: '0xc2842431fb36d89b7e7c857eda3baf9b36c1b7a3',
            decimals: 9,
            symbol: 'RATIE',
        },
        {
            address: '0x244aa24c73fae4e1d9c33f57ba960926da991452',
            decimals: 9,
            symbol: 'RATIE',
        },
        {
            address: '0x4203fff3b33035b151ae9915c72183c80c3dc9c0',
            decimals: 9,
            symbol: 'RATIE',
        },
        {
            address: '0x98ec64bc015a70a4560d30d0c8f25d9883d3dd1e',
            decimals: 18,
            symbol: 'VISIONAI',
        },
        {
            address: '0x3bca01bcf0fe0e6ad3c3935b9d7db51459a255e5',
            decimals: 18,
            symbol: 'CEA',
        },
        {
            address: '0x03ff70cbb05f1b99e1e56d8c6ef37e0648fd13ef',
            decimals: 18,
            symbol: 'FUSIONAI',
        },
        {
            address: '0xb46a8b0c3c56e9fb3c9340f1ed0767f7888eaffc',
            decimals: 18,
            symbol: 'OPTIAI',
        },
        {
            address: '0x9ccbb77654e0f42adbff948676c715769ccde40b',
            decimals: 18,
            symbol: 'PresaleArbitrum',
        },
        {
            address: '0xedce40b59768a6de7b58cc1c693427edf4bf7c28',
            decimals: 18,
            symbol: 'PresaleMutuum',
        },
        {
            address: '0x0f58f98e2a8025de34d7f10964b3f6f9ebdf2b47',
            decimals: 9,
            symbol: 'MEMECOIN',
        },
        {
            address: '0x48c00b0047068df3cb0a22b8e88fb0d04961be41',
            decimals: 18,
            symbol: 'WR5',
        },
        {
            address: '0xe4be072b2567c0973fd8011a698942fcf20b016e',
            decimals: 18,
            symbol: 'MDLNK',
        },
        {
            address: '0xfabb6a3911fbc4a9d6c4c675546bd61bd264e563',
            decimals: 18,
            symbol: '$LEONDEFI',
        },
        {
            address: '0xd732a7ad6fcac2410dc109e5cbd66315ce50ef13',
            decimals: 18,
            symbol: 'PENGU',
        },
        {
            address: '0x75ffb8430148a80d41c37c80ebc8e4f38ff2f2ad',
            decimals: 6,
            symbol: 'diUSD',
        },
        {
            address: '0xc7f0ef5d611fb26593a925b1f69b13402ce97ff1',
            decimals: 18,
            symbol: '100vs1',
        },
        {
            address: '0xeede18bd8381b6887f9930af847da6fba8f951dc',
            decimals: 18,
            symbol: 'ETHERDEFI',
        },
        {
            address: '0x261d66de71c8c850e1803175541520476a88815d',
            decimals: 18,
            symbol: 'MOOG',
        },
        {
            address: '0x111ce0b427755bafa976b581778e92b6cc7d429e',
            decimals: 9,
            symbol: 'FOMO',
        },
        {
            address: '0x0ec09c467dd1d60fd825171a50e543003527d19e',
            decimals: 18,
            symbol: 'VLM',
        },
        {
            address: '0x45e465e4735b42721fb6fe610bc7e76c89a87000',
            decimals: 18,
            symbol: 'NSAI',
        },
        {
            address: '0xa01c4dcf5536525b6664d1b05f9563e609a54c29',
            decimals: 18,
            symbol: 'USDT',
        },
        {
            address: '0xa96493effe64b5b3d8aff21b4ff998ac1aae9ef8',
            decimals: 18,
            symbol: 'RVC',
        },
        {
            address: '0x5d764501e36d3e46dce359bcc4152300d86c9373',
            decimals: 18,
            symbol: 'ZOINK',
        },
        {
            address: '0xa8b1e10ecffa6dccbeac06af2dc90d417ca0dc30',
            decimals: 18,
            symbol: 'AEL',
        },
        {
            address: '0xcf44b9e7c4394a38ca2a3e4ae15ef562ac99737f',
            decimals: 18,
            symbol: 'PECTALIK',
        },
        {
            address: '0x910b0d05722079e5049aa9e207f191d799bb4307',
            decimals: 6,
            symbol: 'GPSC',
        },
        {
            address: '0x577430e4044f53c64f2c44e61c02c87b0afc5ee6',
            decimals: 18,
            symbol: 'PEKTALIK',
        },
        {
            address: '0x58d8a9146e5a7484c61747eaba14968f70028b98',
            decimals: 18,
            symbol: 'WAITC',
        },
        {
            address: '0x034d6fd92338e6e86029337e1160ec8ca6911af6',
            decimals: 18,
            symbol: 'DAGZ',
        },
        {
            address: '0xc90bcf38e2b1515c03f19dd65079ab6417c9ec1c',
            decimals: 18,
            symbol: 'Molly',
        },
        {
            address: '0xefaf027152ab2938b4c8ddfee81da69f1f76a05f',
            decimals: 18,
            symbol: 'NEX',
        },
        {
            address: '0x40dab2fd68f47089a8c03fe7a7af7d28b11ba3df',
            decimals: 18,
            symbol: 'OMS',
        },
        {
            address: '0xf28367640a7ab4a11849440412e31dfe108b331b',
            decimals: 18,
            symbol: 'Florentis',
        },
        {
            address: '0x36dd9954fb5dcb10ac11a3c5832d0e9a2838c608',
            decimals: 18,
            symbol: 'XLITE',
        },
        {
            address: '0x06af43d54c1df0c98d2265c4acebd3bee6f7b9b2',
            decimals: 18,
            symbol: 'EPUNK',
        },
        {
            address: '0xf170371c448736c74f3d753ea27d30a8402512e4',
            decimals: 18,
            symbol: 'DOOD',
        },
        {
            address: '0xd962d49a939ee6447933d4c16dc264df26351088',
            decimals: 18,
            symbol: 'Zephyra',
        },
        {
            address: '0xe8cd0876adf60e04feb82959b60e7e84fffe7092',
            decimals: 18,
            symbol: 'MSWAP',
        },
        {
            address: '0x7c9994a6e9104b1bca68f4971cfe0dfda216dc92',
            decimals: 18,
            symbol: 'WTN',
        },
        {
            address: '0x7786f1eb2ec198a04d8f5e3fc36fab14da370076',
            decimals: 12,
            symbol: 'kb-KDA',
        },
        {
            address: '0x3729458d47e6fa19a6f16846f353177ab6b6fa2f',
            decimals: 18,
            symbol: 'Draknos',
        },
    ],
    [AppSupportedChainIds.UNICHAIN]: [
        {
            address: '0x078d782b760474a361dda0af3839290b0ef57ad6',
            decimals: 6,
            symbol: 'USDC',
        },
        {
            address: '0x0000000000000000000000000000000000000000',
            decimals: 18,
            symbol: 'ETH',
        },
        {
            address: '0x4200000000000000000000000000000000000006',
            decimals: 18,
            symbol: 'WETH',
        },
        {
            address: '0x20cab320a855b39f724131c69424240519573f81',
            decimals: 18,
            symbol: 'DAI',
        },
        {
            address: '0xec4a56061d86955d0df883efb2e5791d99ea71f2',
            decimals: 18,
            symbol: 'HOONI',
        },
        {
            address: '0x8f187aa05619a017077f5308904739877ce9ea21',
            decimals: 18,
            symbol: 'UNI',
        },
        {
            address: '0xd4390b4a41a1057ae0acdd4b9435a0c7555ab464',
            decimals: 9,
            symbol: 'ABE',
        },
        {
            address: '0xa84a8acc04cd47e18bf5af826ab00d5026552ea5',
            decimals: 18,
            symbol: 'UNIDOGE',
        },
        {
            address: '0x926dc7b96bb2f4a91c2a67e291faf482691a3001',
            decimals: 18,
            symbol: 'UNICORN',
        },
        {
            address: '0x46e751c3c786e04c086ea9191cc5c95e8a91a828',
            decimals: 18,
            symbol: 'UNICORN',
        },
        {
            address: '0xc7436169cfc6ebc03e71dd18c50a43321e87b6c8',
            decimals: 18,
            symbol: 'UCat',
        },
        {
            address: '0x3dd711dba4d22d2857b98ef4a1619904f780634d',
            decimals: 18,
            symbol: 'HAY',
        },
        {
            address: '0xd7c28129baf6e11e4f3516b212c50b44cf4e1d6a',
            decimals: 18,
            symbol: 'TINY',
        },
        {
            address: '0x588ce4f028d8e7b53b687865d6a67b3a54c75518',
            decimals: 18,
            symbol: 'USDT',
        },
        {
            address: '0xae759a14d3b5b5677440df1fcb6e0d30a2454fe7',
            decimals: 18,
            symbol: 'a',
        },
        {
            address: '0x927b51f251480a681271180da4de28d44ec4afb8',
            decimals: 8,
            symbol: 'WBTC',
        },
        {
            address: '0x061d6685bdce287c3f8c49f1124bd695c5b55539',
            decimals: 18,
            symbol: 'UNIPEPE',
        },
        {
            address: '0xde0b22d485ec1c5744d3c7d69a3e00122766387b',
            decimals: 18,
            symbol: 'HAZEL',
        },
        {
            address: '0xe1cbd36fd2ccb091c93a62cf4a7261c3d7817965',
            decimals: 18,
            symbol: 'UNICHAN',
        },
        {
            address: '0x81908bbaad3f6fc74093540ab2e9b749bb62aa0d',
            decimals: 18,
            symbol: 'XVS',
        },
        {
            address: '0x4200000000000000000000000000000000000006',
            decimals: 18,
            symbol: 'WETH',
        },
        {
            address: '0xd87834f35398bd6c56eaede65a68dca0d124fc47',
            decimals: 18,
            symbol: 'AUSTIN',
        },
        {
            address: '0x6472f33948521300a243e5dd50ec260087808aec',
            decimals: 18,
            symbol: 'CTU',
        },
        {
            address: '0x2982de13af148d59d1bfc3ca1e3f975d187d472e',
            decimals: 18,
            symbol: '$Unity',
        },
        {
            address: '0xf425d95081c61b73fbd8ba843ee5488d499c713a',
            decimals: 18,
            symbol: 'PEGAZ',
        },
        {
            address: '0x9a426370a41e9f3ad4334d0ce2ce7ccc89401ff2',
            decimals: 18,
            symbol: 'PEG',
        },
        {
            address: '0x4fbafea0914a3ff4f03436223909414624c2e661',
            decimals: 18,
            symbol: 'BLUSH',
        },
        {
            address: '0x2416092f143378750bb29b79ed961ab195cceea5',
            decimals: 18,
            symbol: 'ezETH',
        },
        {
            address: '0x9ec6ad45ae0f8203d0b31c88e3a00b35c20ee2f3',
            decimals: 9,
            symbol: 'UNISOCKS',
        },
        {
            address: '0x8f39c315a3d744efde1bcddc9e39b05f68b4f44a',
            decimals: 18,
            symbol: 'Hat',
        },
        {
            address: '0xdbf52a9b7cf4e64cde82f2e31a7d75ba61cf6d8a',
            decimals: 18,
            symbol: 'ABEDOG',
        },
        {
            address: '0xdf78e4f0a8279942ca68046476919a90f2288656',
            decimals: 18,
            symbol: 'COMP',
        },
        {
            address: '0x103be9320281404e300d89ff53dc1105496df551',
            decimals: 18,
            symbol: 'CEL',
        },
        {
            address: '0x7edc481366a345d7f9fcecb207408b5f2887ff99',
            decimals: 18,
            symbol: 'UMN',
        },
        {
            address: '0xc02fe7317d4eb8753a02c35fe019786854a92001',
            decimals: 18,
            symbol: 'wstETH',
        },
        {
            address: '0x7dcc39b4d1c53cb31e1abc0e358b43987fef80f7',
            decimals: 18,
            symbol: 'weETH',
        },
        {
            address: '0xc3eacf0612346366db554c991d7858716db09f58',
            decimals: 18,
            symbol: 'rsETH',
        },
        {
            address: '0x63b64e0d7337bf7fa0c76e5787d9ebea58101446',
            decimals: 18,
            symbol: 'USAUR',
        },
        {
            address: '0x41be37be93502f0996bfd08f55fdfa9fc89253a1',
            decimals: 18,
            symbol: 'BIGGER',
        },
        {
            address: '0x27de50629bbe23c54fa09a504ddf18f08cd8c106',
            decimals: 18,
            symbol: 'ASSA',
        },
        {
            address: '0x39538c45f6fd0b0dd3e595ed1c2671875fee9f17',
            decimals: 18,
            symbol: 'HOOF',
        },
        {
            address: '0x16b49e0a89ac0eaf8faeed261d10cc38fd213b90',
            decimals: 18,
            symbol: 'HORKE',
        },
        {
            address: '0x212700c3837bba2c21b7aec0a6752a422eb38ab4',
            decimals: 18,
            symbol: 'UNAEWE',
        },
        {
            address: '0xd73ef8d6598fd6d34ecb75af4fe3174cf4b9db98',
            decimals: 18,
            symbol: 'UND',
        },
        {
            address: '0x4344bf6c421ed2937ea2665067eded8826ee0893',
            decimals: 18,
            symbol: 'UNIK',
        },
        {
            address: '0x0c3da0ba65cbadeba6ed11335ad17e77d42e2e37',
            decimals: 9,
            symbol: 'Zebec',
        },
        {
            address: '0xdb7eafe61c4ace7c6381c6ce6e56a6340ea0c476',
            decimals: 18,
            symbol: 'MSduni',
        },
        {
            address: '0x2b3b83e7c8953810a462e45e13970ca7b5284278',
            decimals: 18,
            symbol: 'RNJ',
        },
        {
            address: '0x8c5ec80ec1e5aa9095fca10714bf007def71b02e',
            decimals: 18,
            symbol: 'MAI',
        },
        {
            address: '0x9e4f33ee4a331a1461ec381cc21182abaa1a6b31',
            decimals: 18,
            symbol: 'UKE',
        },
        {
            address: '0x94025780a1ab58868d9b2dbbb775f44b32e8e6e5',
            decimals: 18,
            symbol: 'BETS',
        },
        {
            address: '0xca7d2a29a4713d5cc4b5eb3a4252e4aa9f8d44eb',
            decimals: 18,
            symbol: 'PINK',
        },
        {
            address: '0x11c864795c3baa9ee0d2121fff8aebb2295c35bd',
            decimals: 18,
            symbol: '100',
        },
        {
            address: '0xb865ccbff6334963415ad14bf93f62aed2ffec8c',
            decimals: 18,
            symbol: 'EURR',
        },
        {
            address: '0x3056ff49e74fedcfd49d9ceceab9f73c7b7e7236',
            decimals: 18,
            symbol: 'send',
        },
        {
            address: '0x275744645a8595c80427775774133035d55e66fb',
            decimals: 18,
            symbol: 'pWING',
        },
        {
            address: '0xe667dfc0bd97602169c613078ca40984856f1b28',
            decimals: 18,
            symbol: 'ESE',
        },
        {
            address: '0x8649722b7cb5fc9838c5453a0f1d3fae9b61e638',
            decimals: 18,
            symbol: 'WAMPL',
        },
        {
            address: '0x53dbbda0e6b0978eb0c3e6a5b1ab55090f060dfc',
            decimals: 18,
            symbol: 'SIX',
        },
        {
            address: '0xefb4a15710dab0e70c4e129da10466cbf8f75694',
            decimals: 18,
            symbol: 'DUEL',
        },
        {
            address: '0x779b11733b0c7358d7f84c7d0353f2c6afd28d78',
            decimals: 18,
            symbol: 'DD',
        },
        {
            address: '0xa32c6289c5f6f7cffedf41ccf50281dbedd1fe90',
            decimals: 18,
            symbol: 'OWN',
        },
        {
            address: '0xa4ddec22fc5d17e62786ef2d9a94abae2d94f70d',
            decimals: 18,
            symbol: 'SPS',
        },
        {
            address: '0x7496ef7a0056cce5e59e2bcdb24129f3fb2c968c',
            decimals: 18,
            symbol: 'RLY',
        },
        {
            address: '0xd2a68fea127dbf64d455f904d1cfd5d98c4a88f5',
            decimals: 18,
            symbol: 'SDAO',
        },
        {
            address: '0x62a121ddfe09877f0c20dd0e7b404a4a0be65713',
            decimals: 18,
            symbol: 'MEV',
        },
        {
            address: '0x0be987f9a67401971cb18e2ee60ee62d5cd0ece5',
            decimals: 18,
            symbol: 'BTM',
        },
        {
            address: '0x4cb8044651f12864fbd841b729d21243976caa10',
            decimals: 18,
            symbol: 'STARL',
        },
        {
            address: '0x10f105b2555cb6f8782a6990bf5f2efff51270cf',
            decimals: 18,
            symbol: 'WHNS',
        },
        {
            address: '0x34db0694d04ba14c91c8e1bac3fb599f4451823e',
            decimals: 18,
            symbol: 'STAT',
        },
        {
            address: '0xa78112acf25056aa7ca81518e00641bb3e3a38b1',
            decimals: 18,
            symbol: 'GBYTE',
        },
        {
            address: '0xc8ac7b8aa43e6e4ce0e95ace76382e9b799db9f6',
            decimals: 18,
            symbol: 'WISE',
        },
        {
            address: '0x6503fb464ecdedcd69093298ecf86cdc56ca6a7b',
            decimals: 18,
            symbol: 'WXT',
        },
        {
            address: '0x95ce622e44048e149626a3e0237f81a8ca0cd01d',
            decimals: 18,
            symbol: 'VSG',
        },
        {
            address: '0xe2f88b547f2c73c6958195cbb7f85a97e8bef2c9',
            decimals: 18,
            symbol: 'CAH',
        },
        {
            address: '0x2408dd91ab6e1feada92ef39fda2f5a12c6306ba',
            decimals: 18,
            symbol: 'KNC',
        },
        {
            address: '0xacc49be741e9dbff2418201d46b68894b5951395',
            decimals: 18,
            symbol: 'SNPAD',
        },
        {
            address: '0x5ab91cb32f08770bd03f8102b5de74ef827632bc',
            decimals: 18,
            symbol: 'DOLZ',
        },
        {
            address: '0x4bcb0e404335e8e1a520ecb20cd3c472afe050a9',
            decimals: 18,
            symbol: 'CFGI',
        },
        {
            address: '0x654248c1980b0445bb5285b3e20ed38a14ff075f',
            decimals: 18,
            symbol: 'SNC',
        },
        {
            address: '0x70e3cb1e87277011fcd5dd62f3b3d9cf30e34f1a',
            decimals: 18,
            symbol: 'FLOOR',
        },
        {
            address: '0x3819d7df4d8297c116f4a116c4786c6f84597910',
            decimals: 18,
            symbol: 'CSIX',
        },
        {
            address: '0xcfa9d4ce61b2411a54a9a2bce811f3046a627ca6',
            decimals: 18,
            symbol: 'WEPE',
        },
        {
            address: '0x7588b1e68075b89f726158890ba8ea4912a1fe66',
            decimals: 18,
            symbol: 'KAN',
        },
        {
            address: '0xb531bd1343813646159dbaad01ae6271013ab416',
            decimals: 18,
            symbol: 'cUNI',
        },
        {
            address: '0x35e8fc496f752475309fcc7454565c3f50427dd5',
            decimals: 18,
            symbol: 'KAI',
        },
        {
            address: '0xdd2b98f00cdad4dea75f36563cc49fb10f921877',
            decimals: 18,
            symbol: 'BOA',
        },
        {
            address: '0xfa112ae55796403155dffe6eb357aea626c2919f',
            decimals: 18,
            symbol: 'BOA',
        },
        {
            address: '0x05f292485ac19f76c87094ecc65bbd622cb331b6',
            decimals: 18,
            symbol: 'NEX',
        },
        {
            address: '0xf1917359a14d504e9e096ea57dc379a5feac484b',
            decimals: 18,
            symbol: 'MAN',
        },
        {
            address: '0x41ac0cfa091a73fbfbfd71c848a512722f8b1cca',
            decimals: 18,
            symbol: 'DERC',
        },
        {
            address: '0xc734d139c6d94c49dfa0850ada30dc6a3f8bd9f1',
            decimals: 18,
            symbol: '00',
        },
        {
            address: '0x24976044cdd0e6931b609e8053794cf7aa45b8aa',
            decimals: 18,
            symbol: 'icETH',
        },
        {
            address: '0x747276a26de58ade75d32d9a95e7a74fb6f58f3e',
            decimals: 18,
            symbol: 'RAI',
        },
        {
            address: '0xe16872c9dc06d785d635e7f5e12556786530039e',
            decimals: 18,
            symbol: 'EURQ',
        },
        {
            address: '0xbd88b2ea0f2affd3edb493545cd4c7a47a47d550',
            decimals: 18,
            symbol: 'HELLO',
        },
        {
            address: '0x76a327b097f4dc6f62edf3c1a838aefd8a31eb6b',
            decimals: 18,
            symbol: 'SHR',
        },
        {
            address: '0x93000c7cf446aa7c40a9da2bfe192aeca6509fac',
            decimals: 18,
            symbol: 'wZNN',
        },
        {
            address: '0x5822b3c43b89542bdd79873a01a6c5d5b65a0b97',
            decimals: 18,
            symbol: 'SWORLD',
        },
        {
            address: '0x01b5c01701c11177e27625968f1092543788290c',
            decimals: 18,
            symbol: 'SHD',
        },
        {
            address: '0x60cbc8fec0347e68aa474418c08ee59e659e6bf0',
            decimals: 18,
            symbol: 'RBX',
        },
        {
            address: '0x8162b2efc02be95cf3e0954df483d845a51492d4',
            decimals: 18,
            symbol: 'BTC2x-FLI',
        },
        {
            address: '0xe2d20a92e4ad16f1118bbbf58c920d56ee6a6124',
            decimals: 18,
            symbol: 'ZYGO',
        },
        {
            address: '0xcda52b394f0a63df8055edacd7a879135f64c090',
            decimals: 18,
            symbol: 'SDN',
        },
        {
            address: '0x240bd12b020810d9d51b5b58220b8123ab16bccd',
            decimals: 18,
            symbol: 'SAN',
        },
        {
            address: '0x6f0448264de5e84060dace87a0c533e4832b1c2d',
            decimals: 18,
            symbol: 'LTX',
        },
        {
            address: '0x55b686cbcc49a23944362bad61fc05422ac2ed65',
            decimals: 18,
            symbol: 'DC',
        },
        {
            address: '0xd0ee93cf946012c379e3243c0f4c9a2c490ef926',
            decimals: 18,
            symbol: 'VEST',
        },
        {
            address: '0x5add384f931fe91ab1d5609bbfe989ef7d0ccdca',
            decimals: 18,
            symbol: 'STARS',
        },
        {
            address: '0x61d1aea26245d2de0469f774c3c640a5f7aacfa9',
            decimals: 18,
            symbol: 'BXX',
        },
        {
            address: '0x5ff6d15298b4a312e7a94eddba64ac6b0a69c06a',
            decimals: 18,
            symbol: 'VCHF',
        },
        {
            address: '0x4effc14317ca07a78dd7e7baa60e98a8d0ee95ee',
            decimals: 18,
            symbol: 'CRAI',
        },
        {
            address: '0x74d97370d6c50812513fe591cb6d048f230043f1',
            decimals: 18,
            symbol: 'RJV',
        },
        {
            address: '0xde728c91f9236ccc27992cd1c5d71dc30350f5a9',
            decimals: 18,
            symbol: 'XAR',
        },
        {
            address: '0xaac96415fc8fc1bbfbbc3033ef7f05bc77484875',
            decimals: 18,
            symbol: 'WOM',
        },
        {
            address: '0xeffa856eb2263d88a8d18e03385cb76515f55d91',
            decimals: 18,
            symbol: '$FORWARD',
        },
        {
            address: '0x9cc7fa6dd1fead519dfae6b4b6c8a112bc5c7419',
            decimals: 18,
            symbol: 'SAI',
        },
        {
            address: '0x347d3a0d6c8b6ca11e8b6b28cad786b461cd862d',
            decimals: 18,
            symbol: 'FUSE',
        },
        {
            address: '0x696182156764bc3a8f2aee49e35a7b3012a01318',
            decimals: 18,
            symbol: 'CREO',
        },
        {
            address: '0xeecd2fc6287d2441304a352d9a9bca5bfe7fba43',
            decimals: 18,
            symbol: 'ETE',
        },
        {
            address: '0x818ea1844501a8c925b6214c632c008c8ec0570d',
            decimals: 18,
            symbol: 'DIVER',
        },
        {
            address: '0x4be7da723ea07cc2be025fdec96bc468acd62bcd',
            decimals: 18,
            symbol: '$NTMPI',
        },
        {
            address: '0xc4b09c318c776f78862266de92517920a103c7a7',
            decimals: 18,
            symbol: 'LBR',
        },
        {
            address: '0x14c0cb0255c5aa71c033792fdd5acc83484b9f0d',
            decimals: 18,
            symbol: 'U',
        },
        {
            address: '0x01f84eaebc377027b855524c1ed05ece4d815d23',
            decimals: 18,
            symbol: 'FLT',
        },
        {
            address: '0xd89b81eb6eb2e7256e462861ae45bf38d87b9f87',
            decimals: 18,
            symbol: 'xNANI',
        },
        {
            address: '0xcaf34250ee863b9cdb9fbf15604848bb2a0e7c24',
            decimals: 18,
            symbol: 'KOIN',
        },
        {
            address: '0xf5ffbd82322d3afbb7dabb4654d85377df5a7dbd',
            decimals: 18,
            symbol: 'KOIN',
        },
        {
            address: '0x9e6a6dffa1358c3838274c6c622f5746cd3294c4',
            decimals: 18,
            symbol: 'BAX',
        },
        {
            address: '0xd81f4b5f145859c55e8c9b38993c530a4742f8f2',
            decimals: 18,
            symbol: 'KYL',
        },
        {
            address: '0x6c7c011a5eb1db92eeea7183fdc2aadf68436964',
            decimals: 18,
            symbol: 'BOB',
        },
        {
            address: '0xab94950a23c59b81f9f540ade13ba95b11857349',
            decimals: 18,
            symbol: 'WECAN',
        },
        {
            address: '0x2e78886eaeef054c79a73c291becc4103cc6321f',
            decimals: 18,
            symbol: 'LCS',
        },
        {
            address: '0xd21afea40f58444896fce2be0b42de66c1e85ab5',
            decimals: 18,
            symbol: 'GMEE',
        },
        {
            address: '0xf46c30ebce31ad4a1d21e7923234962800f579d3',
            decimals: 18,
            symbol: 'RADAR',
        },
        {
            address: '0x22b1ff8c40fa0f78047cb20c214df90a20a8be88',
            decimals: 18,
            symbol: 'YCC',
        },
        {
            address: '0x83ce69eba7b4f4d4c511f7ae1dea14edbd5ff11a',
            decimals: 18,
            symbol: 'GRG',
        },
        {
            address: '0x944b128611632bb45f91bdb9e083cd3fe484d42d',
            decimals: 18,
            symbol: 'SIS',
        },
        {
            address: '0x17cec553fb40ea2f7dee972c50befb0b5d83eb0d',
            decimals: 18,
            symbol: 'ALD',
        },
        {
            address: '0x7326a43ff3c36d1e55623c44e1b0fc19663d9b0c',
            decimals: 18,
            symbol: 'ASIA',
        },
        {
            address: '0x7678a99bed8537fdc7c34a7493be2e2b62018f65',
            decimals: 18,
            symbol: 'LAI',
        },
        {
            address: '0xaf5f30323340bf6b7312b54df288cbc165eb0815',
            decimals: 18,
            symbol: 'IBTC',
        },
        {
            address: '0x06fb7f61140240617da3b3aa5e95284b9055a6a7',
            decimals: 18,
            symbol: 'MAZZE',
        },
        {
            address: '0x551fd84c46cf28ea4430031cfb2a1fb3f5a2fdcc',
            decimals: 18,
            symbol: 'AKITA',
        },
        {
            address: '0xb2a5859e8d6d6693f18dbdb12ff8895d5bfa1804',
            decimals: 18,
            symbol: 'ZARP',
        },
        {
            address: '0xa2f4ac4e42c797772ec6791118491ecfdde2086d',
            decimals: 18,
            symbol: 'KOMPETE',
        },
        {
            address: '0x7a67f9edbbf167be02ba1ecba04553886b460be9',
            decimals: 18,
            symbol: 'NTVRK',
        },
        {
            address: '0x6b24dc917cf48b1da8af2531ed028aaaa876524d',
            decimals: 18,
            symbol: 'NETVR',
        },
        {
            address: '0x88dba0fdb1f02e01f91f17f9e446d354c4770c29',
            decimals: 18,
            symbol: 'YAX',
        },
        {
            address: '0x2a1bd8794c688276199f54951a726c225a97f318',
            decimals: 18,
            symbol: 'YAXIS',
        },
        {
            address: '0x8790429329b4c6cf05bd3523ed7dde0b7601eedb',
            decimals: 18,
            symbol: 'COT',
        },
        {
            address: '0x2255183ef48ca8c60810e5e737af007d34885eb6',
            decimals: 18,
            symbol: 'VIB',
        },
        {
            address: '0x0963a74bcba76e77d58050b12cb830a5febe3a8a',
            decimals: 18,
            symbol: 'wCOMAI',
        },
        {
            address: '0x9c50a6feeb1f6def40ec9830aab9ec9993e5c2b4',
            decimals: 18,
            symbol: 'NYA',
        },
        {
            address: '0x8944ae0553eb3a7e354b63c4bdf4150d155519d0',
            decimals: 18,
            symbol: 'WMC',
        },
        {
            address: '0x154bfa602d2d3261d3759f4d6c0217ee349e5c14',
            decimals: 18,
            symbol: 'PREMIA',
        },
        {
            address: '0x7cd1d69a8f48184bb021de434eef59fc0bc28eab',
            decimals: 18,
            symbol: 'FEI',
        },
        {
            address: '0xeed81f6062c97c702efa435997ff553c63170a82',
            decimals: 18,
            symbol: 'ISLAND',
        },
        {
            address: '0xd090a62c620cb3e07c2701c5503a9b24e7afa164',
            decimals: 18,
            symbol: 'VEUR',
        },
        {
            address: '0x83545d7c4d76c86052625a9cfc9f36f6f1f330dc',
            decimals: 18,
            symbol: 'MCRT',
        },
        {
            address: '0x72ce5966dcce957cb1a951931871c1a7609a383c',
            decimals: 18,
            symbol: 'CEL',
        },
        {
            address: '0x33270b60025784dac28450d42a070d10a2ca1621',
            decimals: 18,
            symbol: 'STIMA',
        },
        {
            address: '0x36f6571c0fe79796ba1397319735a3612f01610c',
            decimals: 18,
            symbol: 'SHIDO',
        },
        {
            address: '0xc8b6a5ec41277fb3f1990375dd9acec33fa2fa05',
            decimals: 18,
            symbol: 'LEDGER',
        },
        {
            address: '0x4265f6c41fd762b25319465eaf07259917c34c47',
            decimals: 18,
            symbol: 'ICHI',
        },
        {
            address: '0x1ce3e645234132c7ae02f25d6ef2ef9636868039',
            decimals: 18,
            symbol: '0xDNX',
        },
        {
            address: '0x123425df047d8dc688ffab1aab09d2b1f9f13637',
            decimals: 18,
            symbol: 'QORPO',
        },
        {
            address: '0x2cea36bca0ac72740588b1b8acc78b4be6fb0c52',
            decimals: 18,
            symbol: 'VITARNA',
        },
        {
            address: '0x979aa6a7fefd70b636d32206f36b7f1ac6383f32',
            decimals: 18,
            symbol: 'PUSH',
        },
        {
            address: '0x9ddba5dd7afc6965d07f832a32203a7ed5f4d89f',
            decimals: 18,
            symbol: 'WSTRM',
        },
        {
            address: '0x042ef5933ef155eadddeaa65b4726ede2940edd8',
            decimals: 18,
            symbol: 'ASTRAFER',
        },
        {
            address: '0xda465cb401f0d5ea5e46f4d2e43c7155a66a0e03',
            decimals: 18,
            symbol: 'USDT',
        },
        {
            address: '0xe483d89279da6343a01c2556230702175db67f6f',
            decimals: 18,
            symbol: 'SYNK',
        },
        {
            address: '0x1b6e55c59aedf53f201d8190b0525212c844729e',
            decimals: 18,
            symbol: 'HXRO',
        },
        {
            address: '0x7af0bc282d1f70d0532072cf04ba4bde28606ea6',
            decimals: 18,
            symbol: 'WTC',
        },
        {
            address: '0x7f563cac192f42a12909d23cc1116635d98be089',
            decimals: 18,
            symbol: 'NLS',
        },
        {
            address: '0xaa66d3c3c9b985fe1021ba83a67d4fdae5961b4f',
            decimals: 18,
            symbol: 'CUBE',
        },
        {
            address: '0x7339a02e85358e9970285f45e0275e870456f3e2',
            decimals: 18,
            symbol: 'ANGLE',
        },
        {
            address: '0x16a9685b2fa323c79a61aca5dc8fa75c2c62c0af',
            decimals: 18,
            symbol: 'SKAI',
        },
        {
            address: '0xe3d3e4258c9ff539dba0789205f4d0637910f49e',
            decimals: 18,
            symbol: 'SOCKS',
        },
        {
            address: '0xa056ef5e4e8a59c312615a0e1d7a879bcdbb4339',
            decimals: 18,
            symbol: 'HERA',
        },
        {
            address: '0x3a88d27c1879a8bb23e929c2837ffd22825992db',
            decimals: 18,
            symbol: 'KOL',
        },
        {
            address: '0xd5c6bc89111ee09844012b080d1422f8afb2e9ba',
            decimals: 18,
            symbol: 'TOP',
        },
        {
            address: '0x95a8c2e54a003c3aeb211674c1dd8ddada0b2589',
            decimals: 18,
            symbol: 'TSUKA',
        },
        {
            address: '0x745aa2c06b3790370aaa5aa188e3f7fba0395000',
            decimals: 18,
            symbol: 'MYT',
        },
        {
            address: '0x0f302acdf5047085d6c20db513302b3bc36b3148',
            decimals: 18,
            symbol: 'mUSD',
        },
        {
            address: '0xa6fb826922f2d31c5e13b50508653c8967b3b59e',
            decimals: 18,
            symbol: 'APES',
        },
        {
            address: '0x14c72826771dcc38398438e94cf33022f3700aba',
            decimals: 18,
            symbol: 'INSP',
        },
        {
            address: '0x730f14c0b26ea0488c78d8508e089f395f5bc3c9',
            decimals: 18,
            symbol: 'SG',
        },
        {
            address: '0x4435570d27a99a88a8263edcb3395be04997005e',
            decimals: 18,
            symbol: 'pSAFEMOON',
        },
        {
            address: '0x553984388e62143fceec4fce103d195a667d6d03',
            decimals: 18,
            symbol: 'CNHT',
        },
        {
            address: '0x00b3ca1f5be60e191799fe1499737e1ea2399864',
            decimals: 18,
            symbol: 'USDN',
        },
        {
            address: '0xf7b98c833632f7939cc7fe18756f8bf5227b6419',
            decimals: 18,
            symbol: 'LOGX',
        },
        {
            address: '0x700ea0ae1a88aaf208ff1f1bc9e9d46991e7cc11',
            decimals: 18,
            symbol: 'AVI',
        },
        {
            address: '0x7597f550105fbd21a339d60b7b7ec90483f5c4ed',
            decimals: 18,
            symbol: 'KAI',
        },
        {
            address: '0x31dae0e78465e67a298ce826251b03eae26f267f',
            decimals: 18,
            symbol: 'SPARKLET',
        },
        {
            address: '0x1c5e4cafc94a7f0493ce9123b26131d026cadf4d',
            decimals: 18,
            symbol: 'PAR',
        },
        {
            address: '0xcd164ccdc04aff3b87510e7d381c3a5080234e43',
            decimals: 18,
            symbol: 'UNIBOT',
        },
        {
            address: '0x84484600638f846141d6939d486f92559df6bbb7',
            decimals: 18,
            symbol: 'XZK',
        },
        {
            address: '0x8eed7b2538eabe9e03714d6eac9e6e129a9354bb',
            decimals: 18,
            symbol: 'RBC',
        },
        {
            address: '0x569099767af7adbb96c87b814fe60ec6075856e4',
            decimals: 18,
            symbol: 'SYLO',
        },
        {
            address: '0xae25a8b1c3c705e85447841e5fd0a266426749ef',
            decimals: 18,
            symbol: 'KP3R',
        },
        {
            address: '0x2c1ee799806f369ad3bac8e028b767cd9f03a209',
            decimals: 18,
            symbol: 'WEB',
        },
        {
            address: '0x65f38b504475f940aa1565d58a846b043cc83d22',
            decimals: 18,
            symbol: 'bbrq',
        },
        {
            address: '0x2ba0a58fbbebe872a0ae0b817853f98e10e9b725',
            decimals: 18,
            symbol: 'CRASH',
        },
        {
            address: '0xc7e5cce3163bcc4b270d063ff0aadf475a63c11d',
            decimals: 18,
            symbol: 'DANCINGBABY',
        },
        {
            address: '0x040814af37b9a729abc1ff38fabeed7fc8821212',
            decimals: 18,
            symbol: 'TOR',
        },
        {
            address: '0x304ef67c455657df751d74be15c125336dbd87fa',
            decimals: 18,
            symbol: 'HJ',
        },
        {
            address: '0x0389cf25bedfffd9f0e9fd6c262bddfe68f2cd57',
            decimals: 18,
            symbol: 'EBTC',
        },
        {
            address: '0x29686b1a69adbba78913885ade1f0c292c8aaa6e',
            decimals: 18,
            symbol: 'PPT',
        },
        {
            address: '0xfffea031d12f2e9c58a6ec32bebb49d524ce12b6',
            decimals: 18,
            symbol: 'VNXAU',
        },
        {
            address: '0x29e2a00738978c45eead2ea0ada77da3a2f53f54',
            decimals: 18,
            symbol: 'MTLX',
        },
        {
            address: '0x9f1a133a617639e2d21f087ee00219b6d46030bb',
            decimals: 18,
            symbol: 'MIR',
        },
        {
            address: '0x04484cf971ecd5de61c0b136995da5e68f0d57de',
            decimals: 18,
            symbol: 'CREAM',
        },
        {
            address: '0x9788ede969d7d0c05d35fe2ba368f22326491398',
            decimals: 18,
            symbol: 'KEY',
        },
        {
            address: '0x40d21de97333d76640e53225126831e247a7bd6f',
            decimals: 18,
            symbol: 'BANANA',
        },
        {
            address: '0x0f6279c39b948fcbcd7ddf8baaeb627775930a12',
            decimals: 18,
            symbol: 'FACTR',
        },
        {
            address: '0x06f3a13f9da237ad7c45b91687fa341e6d5fd692',
            decimals: 18,
            symbol: 'DG',
        },
        {
            address: '0xc6a421057f8369090814b0cbaad1e7267dfae468',
            decimals: 18,
            symbol: '$ROAR',
        },
        {
            address: '0xc97c4029a82b2531b6e036c4f1d100e66f93a9c8',
            decimals: 18,
            symbol: 'DVI',
        },
        {
            address: '0x7310667897af8c08cb67da4706e5c12913164e72',
            decimals: 18,
            symbol: 'DIP',
        },
        {
            address: '0xed0e0c2f75b37ac1460b10415509b4f6e4171d12',
            decimals: 18,
            symbol: 'KIP',
        },
        {
            address: '0xbea9567e578da51702eec521402def90e2c22c72',
            decimals: 18,
            symbol: 'BOND',
        },
        {
            address: '0xb49c6524515d37b686adc22d837cfc0cfe5c6cd8',
            decimals: 18,
            symbol: '$0xGas',
        },
        {
            address: '0x060e833df46629d7af76ae8c2e48b2d74708908a',
            decimals: 18,
            symbol: 'ML',
        },
        {
            address: '0x7f019fa56f34e069291fa06eb87759b00f2c270a',
            decimals: 18,
            symbol: 'ibEUR',
        },
        {
            address: '0x29a0ddcf656113008ced72b583ba4ded268fe51a',
            decimals: 18,
            symbol: 'NSTR',
        },
        {
            address: '0xdafe6007284653f6397ab143d440cd04f665168d',
            decimals: 18,
            symbol: 'BOO',
        },
        {
            address: '0x480a573ad4b7e5595cb7ef767ba08ccce530c077',
            decimals: 18,
            symbol: 'ezEIGEN',
        },
        {
            address: '0x21b8bc2f4e60a7eda694d4d8489de7802952eecc',
            decimals: 18,
            symbol: 'RAI',
        },
        {
            address: '0x45a3e0cc2245f204832160b817338a4514f87a58',
            decimals: 18,
            symbol: 'VOICE',
        },
        {
            address: '0x7248891cf10bad4e5631884519cf1724f6686111',
            decimals: 18,
            symbol: 'NEST',
        },
        {
            address: '0x3e8843c6dec8a8f86e815ea33efc2175e1b9e8f7',
            decimals: 18,
            symbol: 'EDUM',
        },
        {
            address: '0xa1491efd76b09fd6540e82c9de5fc8396c27c4ab',
            decimals: 18,
            symbol: 'TPRO',
        },
        {
            address: '0xfd0ee42c738160452196af806795c7b9aa5e45b1',
            decimals: 18,
            symbol: 'USDN',
        },
        {
            address: '0x3bee5427be66ded468c8457afcb4660ee9466ff5',
            decimals: 18,
            symbol: 'RISE',
        },
        {
            address: '0x0cfaa5a4c5b13ecabbf03aff9526c90fbf9719a1',
            decimals: 18,
            symbol: 'LMR',
        },
        {
            address: '0x0f7ada16adf1404bda0b9605c19479bb231526d6',
            decimals: 18,
            symbol: 'VSP',
        },
        {
            address: '0x8beb0b052d45266234c1a5465da9cbe59b6f9b54',
            decimals: 18,
            symbol: 'AAG',
        },
        {
            address: '0x721cceb0d74e2b0790ed143882e5fd81e654fb2b',
            decimals: 18,
            symbol: 'GRIX',
        },
        {
            address: '0x965b49936e78ba84833cf10fff5ee2796e0c4577',
            decimals: 18,
            symbol: 'WVENOM',
        },
        {
            address: '0xc31a6029daed1bbe8c4e259ac57f068858751d3e',
            decimals: 18,
            symbol: 'CRU',
        },
        {
            address: '0xedcbbe1ee8ae7f077d0d522f68bd6bf5a9953997',
            decimals: 18,
            symbol: 'KNS',
        },
        {
            address: '0xb82f928e7c14cb0b6356ec775cd15086222997f6',
            decimals: 18,
            symbol: 'AIN',
        },
        {
            address: '0x9cc82abb8231e237e337098e83b69f2b509ea5da',
            decimals: 18,
            symbol: 'IRIS',
        },
        {
            address: '0x791bdf98348f4fecbf468ef5c5512c84a5667824',
            decimals: 18,
            symbol: 'RAE',
        },
        {
            address: '0x7e5085200ba054bf09e71ff43c11fdf3a4368595',
            decimals: 18,
            symbol: 'WEVMOS',
        },
        {
            address: '0x82ae2333d58bea4a45a8ca06c36a1f29979560f7',
            decimals: 18,
            symbol: 'CTRL',
        },
        {
            address: '0x88d6b0e46a38d2ac682daba05dfe855a1ccdf851',
            decimals: 18,
            symbol: 'MASQ',
        },
        {
            address: '0x3035ab65728ba3f858e4dd2b742920eefe8fc24e',
            decimals: 18,
            symbol: 'TWIN',
        },
        {
            address: '0xfd6103252264cfe3cd7e89ec4e440e7959f00aef',
            decimals: 18,
            symbol: '$SPEEDY',
        },
        {
            address: '0x8374a7004ac3ea5b13b076f12f91558811778374',
            decimals: 18,
            symbol: 'LNDX',
        },
        {
            address: '0x86fad0efdee9ae5823ef17ff2df684d4f3008730',
            decimals: 18,
            symbol: 'BITROCK',
        },
        {
            address: '0x606a3f378c0a7c79109038e1a288f566a394398c',
            decimals: 18,
            symbol: 'SLAP',
        },
        {
            address: '0x438cd9d5fa54e9f4d69d940eedfaa154aa5eb518',
            decimals: 18,
            symbol: 'UBT',
        },
        {
            address: '0x1c05f30ae1ce2e89561db1d2e33d400774e10841',
            decimals: 18,
            symbol: 'ADO',
        },
        {
            address: '0xb24e92564493250ed6c7c3c2720bd37e92067ccd',
            decimals: 18,
            symbol: 'LLD',
        },
        {
            address: '0x1b59169d187744a49d288337603a46b48f241b0b',
            decimals: 18,
            symbol: 'MARSH',
        },
        {
            address: '0xb47343cb955cda7c3160bf486b957c407d3b0b67',
            decimals: 18,
            symbol: 'UMEE',
        },
        {
            address: '0xf7fd8c1155396e1e9dec831f4a2a02a9b1f4f61a',
            decimals: 18,
            symbol: 'GURU',
        },
        {
            address: '0x1dd425e3e7cf631b0cdb92267b51b3987af3a350',
            decimals: 18,
            symbol: 'BMP',
        },
        {
            address: '0x9c63bf6c7a543776aeb7fa9158c75c46e2716893',
            decimals: 18,
            symbol: 'scUSD',
        },
        {
            address: '0x4181ccc813d5c6b1dff5aca814d644850c41e70b',
            decimals: 18,
            symbol: 'TNT',
        },
        {
            address: '0x94f0c2efa19c23d01fe3c846d52ed60832910385',
            decimals: 18,
            symbol: 'Q*',
        },
        {
            address: '0x20109c50962fce178d4b8b97e1b187ca6905933a',
            decimals: 18,
            symbol: 'BXBT',
        },
        {
            address: '0x772a9dd7d35da898f6d5e30a7182b0558dbfd5ad',
            decimals: 18,
            symbol: '$MUSIC',
        },
        {
            address: '0x695211a2f426f40935e4c0c972225e566d59a27f',
            decimals: 18,
            symbol: 'PROB',
        },
        {
            address: '0xb45f53246d47a5a98f9684d5d9182418d20ccb79',
            decimals: 18,
            symbol: 'OMIRA',
        },
        {
            address: '0xa376ff626c7e888278fc30ad270ef1bd2266ca50',
            decimals: 18,
            symbol: 'OPTIMUS',
        },
        {
            address: '0xaca92e4f04fe67339a432b863ef7d771595328c1',
            decimals: 18,
            symbol: 'SWTH',
        },
        {
            address: '0x69d946f94de3a75cac4be82b681cb2328e255026',
            decimals: 18,
            symbol: 'CATBOY',
        },
        {
            address: '0xaf6642731a3540f509bd87684c61e4aa786dee27',
            decimals: 18,
            symbol: 'SFI',
        },
        {
            address: '0x3d017cc4be6f148a2a90cd67d21819785121e602',
            decimals: 18,
            symbol: 'RING',
        },
        {
            address: '0xe239b4797be799a93f133e1c30ba589f0b0bf167',
            decimals: 18,
            symbol: 'ShibDoge',
        },
        {
            address: '0xba7288003368e526bd0b5993b3dcc3935e1ff6fb',
            decimals: 18,
            symbol: 'VERSE',
        },
        {
            address: '0xfd5eef1e6e93cdccdcd925ef15e01fbb545977fe',
            decimals: 18,
            symbol: 'PBX',
        },
        {
            address: '0x13a79eed392b33a7a554b3db78f629d2f2665547',
            decimals: 18,
            symbol: 'BBF',
        },
        {
            address: '0x408dff5701ff21cae9a5efa513b6e220afdb3b51',
            decimals: 18,
            symbol: 'APEX',
        },
        {
            address: '0xe0bf196176bdcf2b4af3b45d2b1487b19a7ff7ee',
            decimals: 18,
            symbol: 'EURCV',
        },
        {
            address: '0x9f39e4065d7220fe900dca76c785c8a5450f6923',
            decimals: 18,
            symbol: 'KEEP',
        },
        {
            address: '0xb62e889b04b25a032d816dd8d5a03057350c429c',
            decimals: 18,
            symbol: 'SSV',
        },
        {
            address: '0x7be0179d130d94b463c3828d3b4184b14f181695',
            decimals: 18,
            symbol: 'QANX',
        },
        {
            address: '0xb42951168598ecca2a796d82074a1219c2d6aa3f',
            decimals: 18,
            symbol: 'ALICE',
        },
        {
            address: '0x18aff43253faaf566866ab8d78dcd537de42af91',
            decimals: 18,
            symbol: 'COQ',
        },
        {
            address: '0x6e816e67a333c348ae16bdca49be2655b6a76b15',
            decimals: 18,
            symbol: 'RAIL',
        },
        {
            address: '0xf12e9f138c1b975836856cc57ff0cd3426737238',
            decimals: 18,
            symbol: 'AVL',
        },
        {
            address: '0xd2aa2362c9c999b8bce5f2a538173418084f4a7e',
            decimals: 18,
            symbol: 'OXT',
        },
        {
            address: '0x4508cf1d327ff57b4cc835a8a7bdd7be4edce810',
            decimals: 18,
            symbol: 'SYNT',
        },
        {
            address: '0xd9b055d79fbfb62bc83e4e86e11d8cfca05c4566',
            decimals: 18,
            symbol: 'ANVL',
        },
        {
            address: '0xdb0d109cc55080658c407cac3d340f22a369a096',
            decimals: 18,
            symbol: 'FORT',
        },
        {
            address: '0x33d35bfed1b76bc71be7629172ef0ea5c3f67014',
            decimals: 18,
            symbol: 'DUSK',
        },
        {
            address: '0xf8a4a69d8356006692cdda0a9f7f2e88df4f13ef',
            decimals: 18,
            symbol: 'SDEX',
        },
        {
            address: '0x6c9595fe570e411a792655589587b52b39318528',
            decimals: 18,
            symbol: 'BFC',
        },
        {
            address: '0xa73ecbe5fcb30907f91e38d7d58f8b14e30bfa34',
            decimals: 18,
            symbol: 'RAD',
        },
        {
            address: '0x4b2d4890af5e8ece04d4f7ba685e3ed0e8c73a9b',
            decimals: 18,
            symbol: 'META',
        },
        {
            address: '0xf59d05009d725350cabb1419b68ba87446a9ba4b',
            decimals: 18,
            symbol: 'OGN',
        },
        {
            address: '0x363ae379c837a85a238a748e591ac7904232f3a4',
            decimals: 18,
            symbol: 'CAPY',
        },
        {
            address: '0x0d7edfbf523c6e3402b05420e530649c252d597a',
            decimals: 18,
            symbol: 'mw',
        },
        {
            address: '0x2f01005c4cf06e5b8493ca70ea7e405577543260',
            decimals: 18,
            symbol: 'GRO',
        },
        {
            address: '0x143c3fd9cc6251b69220614559fb7ff5cb32f1ea',
            decimals: 18,
            symbol: 'PIXIE',
        },
        {
            address: '0x3ea36feffd9015d4a2f48305e9aeb786ddc171ed',
            decimals: 18,
            symbol: 'BUPOWELL',
        },
        {
            address: '0x216e4a9dfaf6dc1d005d43f3830e13fab468705e',
            decimals: 18,
            symbol: 'PIG',
        },
        {
            address: '0x085974177723fbe2884587de650ee968109d4c51',
            decimals: 18,
            symbol: 'BRAX',
        },
    ],
    [AppSupportedChainIds.BASE]: [
        {
            address: '0x4200000000000000000000000000000000000006',
            decimals: 18,
            symbol: 'WETH',
        },
        {
            address: '0x833589fcd6edb6e08f4c7c32d4f71b54bda02913',
            decimals: 6,
            symbol: 'USDC',
        },
    ],
}
