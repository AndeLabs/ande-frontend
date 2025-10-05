import {
  getBlockscoutConfig,
  getTransactionUrl,
  getAddressUrl,
  getBlockUrl,
  getTokenUrl,
  isValidEthereumAddress,
  isValidTransactionHash,
  truncateHash,
  checkTransactionStatus,
} from '../blockscout';

describe('Blockscout Utilities', () => {
  describe('getBlockscoutConfig', () => {
    it('should return local network config by default', () => {
      const config = getBlockscoutConfig();
      expect(config.name).toBe('AndeChain Local');
      expect(config.url).toContain('localhost');
      expect(config.chainId).toBe(31337);
    });

    it('should return local network config when specified', () => {
      const config = getBlockscoutConfig('local');
      expect(config.name).toBe('AndeChain Local');
      expect(config.chainId).toBe(31337);
    });

    it('should return testnet config when specified', () => {
      const config = getBlockscoutConfig('testnet');
      expect(config.name).toBe('AndeChain Testnet');
      expect(config.chainId).toBe(31338);
    });

    it('should return mainnet config when specified', () => {
      const config = getBlockscoutConfig('mainnet');
      expect(config.name).toBe('AndeChain Mainnet');
      expect(config.chainId).toBe(31339);
    });
  });

  describe('URL Generation', () => {
    const testHash = '0x1234567890123456789012345678901234567890123456789012345678901234';
    const testAddress = '0x1234567890123456789012345678901234567890';
    const testBlockNumber = 12345;

    it('should generate transaction URL correctly', () => {
      const url = getTransactionUrl(testHash);
      expect(url).toContain('/tx/');
      expect(url).toContain(testHash);
    });

    it('should generate address URL correctly', () => {
      const url = getAddressUrl(testAddress);
      expect(url).toContain('/address/');
      expect(url).toContain(testAddress);
    });

    it('should generate block URL correctly', () => {
      const url = getBlockUrl(testBlockNumber);
      expect(url).toContain('/block/');
      expect(url).toContain('12345');
    });

    it('should generate token URL correctly', () => {
      const url = getTokenUrl(testAddress);
      expect(url).toContain('/token/');
      expect(url).toContain(testAddress);
    });

    it('should use specified network in URLs', () => {
      const url = getTransactionUrl(testHash, 'testnet');
      const config = getBlockscoutConfig('testnet');
      expect(url).toContain(config.url);
    });
  });

  describe('Validation Functions', () => {
    describe('isValidEthereumAddress', () => {
      it('should validate correct Ethereum address', () => {
        expect(isValidEthereumAddress('0x1234567890123456789012345678901234567890')).toBe(true);
        expect(isValidEthereumAddress('0xAbCdEf1234567890123456789012345678901234')).toBe(true);
      });

      it('should reject invalid Ethereum address', () => {
        expect(isValidEthereumAddress('0x123')).toBe(false);
        expect(isValidEthereumAddress('1234567890123456789012345678901234567890')).toBe(false);
        expect(isValidEthereumAddress('0xGGGG567890123456789012345678901234567890')).toBe(false);
        expect(isValidEthereumAddress('')).toBe(false);
      });
    });

    describe('isValidTransactionHash', () => {
      it('should validate correct transaction hash', () => {
        expect(
          isValidTransactionHash('0x1234567890123456789012345678901234567890123456789012345678901234')
        ).toBe(true);
        expect(
          isValidTransactionHash('0xAbCdEf1234567890123456789012345678901234567890123456789012345678')
        ).toBe(true);
      });

      it('should reject invalid transaction hash', () => {
        expect(isValidTransactionHash('0x123')).toBe(false);
        expect(
          isValidTransactionHash('1234567890123456789012345678901234567890123456789012345678901234')
        ).toBe(false);
        expect(
          isValidTransactionHash('0xGGGG567890123456789012345678901234567890123456789012345678901234')
        ).toBe(false);
        expect(isValidTransactionHash('')).toBe(false);
      });
    });
  });

  describe('truncateHash', () => {
    const fullHash = '0x1234567890123456789012345678901234567890123456789012345678901234';

    it('should truncate hash with default lengths', () => {
      const truncated = truncateHash(fullHash);
      expect(truncated).toBe('0x1234...1234');
      expect(truncated.length).toBeLessThan(fullHash.length);
    });

    it('should truncate hash with custom start length', () => {
      const truncated = truncateHash(fullHash, 8, 4);
      expect(truncated).toBe('0x123456...1234');
    });

    it('should truncate hash with custom end length', () => {
      const truncated = truncateHash(fullHash, 6, 6);
      expect(truncated).toBe('0x1234...901234');
    });

    it('should handle short hashes', () => {
      const shortHash = '0x1234';
      const truncated = truncateHash(shortHash);
      expect(truncated).toBe('0x1234...1234');
    });
  });

  describe('checkTransactionStatus', () => {
    beforeEach(() => {
      jest.clearAllMocks();
    });

    it('should return success for confirmed transaction', async () => {
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          status: '1',
          result: { status: '1' },
        }),
      });

      const status = await checkTransactionStatus(
        '0x1234567890123456789012345678901234567890123456789012345678901234'
      );
      expect(status).toBe('success');
    });

    it('should return failed for failed transaction', async () => {
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          status: '0',
          result: { status: '0' },
        }),
      });

      const status = await checkTransactionStatus(
        '0x1234567890123456789012345678901234567890123456789012345678901234'
      );
      expect(status).toBe('failed');
    });

    it('should return pending when transaction not found', async () => {
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: false,
        status: 404,
      });

      const status = await checkTransactionStatus(
        '0x1234567890123456789012345678901234567890123456789012345678901234'
      );
      expect(status).toBe('pending');
    });

    it('should return unknown on API error', async () => {
      (global.fetch as jest.Mock).mockRejectedValueOnce(new Error('API Error'));

      const status = await checkTransactionStatus(
        '0x1234567890123456789012345678901234567890123456789012345678901234'
      );
      expect(status).toBe('unknown');
    });

    it('should use specified network', async () => {
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => ({ status: '1' }),
      });

      await checkTransactionStatus(
        '0x1234567890123456789012345678901234567890123456789012345678901234',
        'testnet'
      );

      expect(global.fetch).toHaveBeenCalledWith(
        expect.stringContaining('testnet'),
        expect.any(Object)
      );
    });
  });
});
