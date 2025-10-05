import '@testing-library/jest-dom'

// Mock wagmi hooks for testing
jest.mock('wagmi', () => ({
  useAccount: jest.fn(() => ({
    address: '0x1234567890123456789012345678901234567890',
    isConnected: true,
  })),
  useReadContract: jest.fn(),
  useWriteContract: jest.fn(() => ({
    writeContract: jest.fn(),
    data: undefined,
    isPending: false,
    isSuccess: false,
    error: null,
  })),
  useWaitForTransactionReceipt: jest.fn(() => ({
    isLoading: false,
    isSuccess: false,
  })),
  useBalance: jest.fn(() => ({
    data: { value: BigInt(1000000000000000000), formatted: '1.0', symbol: 'ETH' },
  })),
}))

// Mock next/navigation
jest.mock('next/navigation', () => ({
  usePathname: jest.fn(() => '/'),
  useRouter: jest.fn(() => ({
    push: jest.fn(),
    replace: jest.fn(),
    prefetch: jest.fn(),
  })),
}))

// Mock next/image
jest.mock('next/image', () => ({
  __esModule: true,
  default: (props) => {
    // eslint-disable-next-line jsx-a11y/alt-text
    return <img {...props} />
  },
}))

// Mock fetch for Blockscout API
global.fetch = jest.fn(() =>
  Promise.resolve({
    ok: true,
    json: () => Promise.resolve({}),
  })
)
