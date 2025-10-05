# Frontend Testing Documentation

## Overview

Comprehensive test suite for the AndeChain frontend, covering blockchain utilities, UI components, and governance functionality.

## Test Infrastructure

### Dependencies Installed

```bash
npm install --save-dev @testing-library/react @testing-library/jest-dom @testing-library/user-event jest jest-environment-jsdom @types/jest
```

### Configuration Files

- `jest.config.js` - Jest configuration using Next.js preset
- `jest.setup.js` - Test setup with wagmi mocks and global configuration
- `.jestignore` - Excludes node_modules and parent directories

### Running Tests

```bash
# Run all tests
npm test

# Run tests in watch mode
npm test:watch

# Run tests with coverage report
npm test:coverage

# Run specific test file
npm test -- blockscout.test

# Run tests in src/ only (avoiding node_modules)
./node_modules/.bin/jest src/
```

## Test Suite Organization

### 1. Blockchain Utilities (`src/lib/blockchain/__tests__/blockscout.test.ts`)

**Coverage: Blockscout integration utilities**

Tests include:
- ✅ Network configuration (local, testnet, mainnet)
- ✅ URL generation (transactions, addresses, blocks, tokens)
- ✅ Ethereum address validation
- ✅ Transaction hash validation
- ✅ Hash truncation utility
- ✅ Transaction status checking (success, failed, pending, unknown)
- ✅ Network-specific API calls

**Key Test Patterns:**
```typescript
// Testing URL generation
expect(getTransactionUrl(hash)).toContain('/tx/');

// Testing validation
expect(isValidEthereumAddress('0x1234...')).toBe(true);

// Testing async status checks
const status = await checkTransactionStatus(hash);
expect(status).toBe('success');
```

### 2. Blockscout Link Components (`src/components/blockchain/__tests__/BlockscoutLink.test.tsx`)

**Coverage: Reusable link components for blockchain explorer**

Tests include:
- ✅ TransactionLink rendering and props
- ✅ AddressLink with truncation
- ✅ BlockLink (number and hash)
- ✅ TokenLink with optional name
- ✅ Custom labels and className support
- ✅ Icon display toggling
- ✅ Hash truncation display
- ✅ Network switching

**Key Test Patterns:**
```typescript
// Testing component rendering
render(<TransactionLink txHash={hash} />);
expect(screen.getByRole('link')).toBeInTheDocument();

// Testing props
render(<BlockscoutLink showIcon label="Custom" />);
expect(screen.getByText('Custom')).toBeInTheDocument();
```

### 3. Transaction Status Component (`src/components/blockchain/__tests__/TransactionStatus.test.tsx`)

**Coverage: Auto-refreshing transaction status display**

Tests include:
- ✅ Status display (pending, success, failed, unknown)
- ✅ Auto-refresh mechanism with custom intervals
- ✅ Stop refreshing on final status
- ✅ Visual variants (default, badge, alert)
- ✅ Network-specific status checks
- ✅ Icon display for each status
- ✅ Error handling and retry logic

**Key Test Patterns:**
```typescript
// Testing auto-refresh
jest.useFakeTimers();
render(<TransactionStatus txHash={hash} />);
jest.advanceTimersByTime(3000);
expect(checkTransactionStatus).toHaveBeenCalledTimes(2);

// Testing status changes
mockCheckStatus.mockResolvedValue('success');
await waitFor(() => {
  expect(screen.getByText(/Confirmada/i)).toBeInTheDocument();
});
```

### 4. Staking Component (`src/components/sections/__tests__/StakingVeANDE.test.tsx`)

**Coverage: veANDE staking interface**

Tests include:
- ✅ Wallet connection requirement
- ✅ Stats display (balance, locked, voting power, time remaining)
- ✅ Voting power decay visualization
- ✅ Create lock form and validation
- ✅ Approval flow (ERC20 approve before lock)
- ✅ Increase lock functionality
- ✅ Extend lock duration
- ✅ Withdraw after expiration
- ✅ Transaction status display
- ✅ Estimated voting power calculation

**Key Test Patterns:**
```typescript
// Mock wagmi hooks
mockUseReadContract.mockReturnValue({ data: BigInt(1000) });

// Test voting power calculation
fireEvent.change(amountInput, { target: { value: '100' } });
fireEvent.change(daysInput, { target: { value: '730' } }); // 2 years
expect(screen.getByText(/50\.0 veANDE/)).toBeInTheDocument(); // 50% power

// Test approval flow
const approveButton = screen.getByRole('button', { name: /Aprobar/i });
fireEvent.click(approveButton);
expect(mockWriteContract).toHaveBeenCalledWith(
  expect.objectContaining({ functionName: 'approve' })
);
```

### 5. Governance Component (`src/components/sections/__tests__/GovernanceDAO.test.tsx`)

**Coverage: DAO governance interface**

Tests include:
- ✅ Wallet connection requirement
- ✅ User voting power display
- ✅ Proposal statistics (total, active, passed, rejected)
- ✅ Proposal filtering (all, active, passed, rejected)
- ✅ Proposal card rendering (title, description, type, status)
- ✅ Voting results visualization (for, against, quorum)
- ✅ Time remaining for active proposals
- ✅ Vote casting (favor/against)
- ✅ Transaction status after voting
- ✅ Disabled voting for non-active proposals
- ✅ Alert when no voting power
- ✅ Proposal type badges (mint, parameter, upgrade, treasury)

**Key Test Patterns:**
```typescript
// Test filtering
fireEvent.click(screen.getByRole('tab', { name: /Aprobadas/i }));
expect(screen.getByText(/Implementar Nuevo Oracle/i)).toBeInTheDocument();

// Test voting
mockUseReadContract.mockReturnValue({ data: parseEther('100') });
const favorButton = screen.getByRole('button', { name: /A Favor/i });
fireEvent.click(favorButton);
expect(mockWriteContract).toHaveBeenCalledWith(
  expect.objectContaining({
    functionName: 'voteOnProposal',
    args: [BigInt(1), true]
  })
);

// Test quorum display
expect(screen.getByText(/300\.0%/i)).toBeInTheDocument(); // 300k votes / 100k quorum
```

## Mock Data and Setup

### Wagmi Hooks Mocking

All tests use mocked wagmi hooks to avoid actual blockchain connections:

```typescript
jest.mock('wagmi', () => ({
  useAccount: jest.fn(() => ({
    address: '0x1234...',
    isConnected: true,
  })),
  useReadContract: jest.fn(),
  useWriteContract: jest.fn(() => ({
    writeContract: jest.fn(),
    isPending: false,
  })),
  useWaitForTransactionReceipt: jest.fn(() => ({
    isSuccess: false,
  })),
}));
```

### Global Mocks

- `fetch` - Mocked for Blockscout API calls
- `next/image` - Mocked to return simple `<img>` tags
- `next/navigation` - Mocked for routing hooks

## Testing Best Practices

### 1. Component Testing Strategy

```typescript
// ✅ Good: Test user interactions and outcomes
it('should allow user to vote on proposal', () => {
  render(<GovernanceDAO />);
  fireEvent.click(screen.getByRole('button', { name: /A Favor/i }));
  expect(mockVote).toHaveBeenCalled();
});

// ❌ Bad: Test implementation details
it('should call internal function', () => {
  const component = render(<GovernanceDAO />);
  expect(component.instance.handleVote).toBeDefined();
});
```

### 2. Async Testing

```typescript
// Use waitFor for async updates
await waitFor(() => {
  expect(screen.getByText(/success/i)).toBeInTheDocument();
});

// Use fake timers for auto-refresh
jest.useFakeTimers();
render(<TransactionStatus txHash={hash} />);
jest.advanceTimersByTime(3000);
```

### 3. Mock Data Consistency

```typescript
// Use parseEther for BigInt values
const mockBalance = parseEther('1000');

// Use realistic mock data
const mockProposal = {
  votesFor: parseEther('250000'),
  votesAgainst: parseEther('50000'),
  quorum: parseEther('100000'),
};
```

## Test Coverage Goals

Target coverage for production:

- **Statements**: > 80%
- **Branches**: > 75%
- **Functions**: > 80%
- **Lines**: > 80%

Run `npm test:coverage` to generate detailed coverage report.

## Common Test Commands

```bash
# Run specific test file
npm test -- blockscout

# Run tests matching pattern
npm test -- --testNamePattern="voting"

# Run only changed tests
npm test -- --onlyChanged

# Run tests in verbose mode
npm test -- --verbose

# Update snapshots (if using)
npm test -- --updateSnapshot

# Run with specific timeout
npm test -- --testTimeout=10000
```

## Debugging Tests

### 1. Use screen.debug()

```typescript
render(<Component />);
screen.debug(); // Prints DOM to console
```

### 2. Check test output

```typescript
const { container } = render(<Component />);
console.log(container.innerHTML);
```

### 3. Use --detectOpenHandles

```bash
npm test -- --detectOpenHandles
```

Finds async operations that aren't properly cleaned up.

## CI/CD Integration

Add to `.github/workflows/test.yml`:

```yaml
name: Frontend Tests
on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '20'
      - run: npm ci
      - run: npm test -- --coverage
      - uses: codecov/codecov-action@v3
        with:
          files: ./coverage/lcov.info
```

## Known Issues

### TypeScript in Tests

Current setup uses Next.js's Jest configuration, which may have issues with TypeScript type assertions. If you encounter type errors:

1. Ensure `@types/jest` is installed
2. Use `as any` for complex type assertions
3. Configure `tsconfig.json` to include test files

### Wagmi Mock Complexity

When testing components with multiple `useReadContract` calls:

```typescript
let callCount = 0;
mockUseReadContract.mockImplementation(() => {
  const responses = [
    { data: BigInt(100) },  // First call
    { data: BigInt(200) },  // Second call
    { data: BigInt(300) },  // Third call
  ];
  return responses[callCount++] as any;
});
```

## Future Improvements

- [ ] Add E2E tests with Playwright/Cypress
- [ ] Add visual regression testing
- [ ] Add performance testing for large proposal lists
- [ ] Add accessibility testing (a11y)
- [ ] Add integration tests with local blockchain
- [ ] Add mutation testing for critical paths

## Resources

- [Jest Documentation](https://jestjs.io/)
- [React Testing Library](https://testing-library.com/react)
- [Testing Best Practices](https://kentcdodds.com/blog/common-mistakes-with-react-testing-library)
- [wagmi Testing Guide](https://wagmi.sh/react/guides/testing)
