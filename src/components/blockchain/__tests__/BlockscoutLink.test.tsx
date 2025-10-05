import React from 'react';
import { render, screen } from '@testing-library/react';
import {
  BlockscoutLink,
  TransactionLink,
  AddressLink,
  BlockLink,
  TokenLink,
} from '../BlockscoutLink';

describe('BlockscoutLink Components', () => {
  describe('BlockscoutLink', () => {
    it('should render transaction link correctly', () => {
      const txHash = '0x1234567890123456789012345678901234567890123456789012345678901234';
      render(<BlockscoutLink type="transaction" value={txHash} />);

      const link = screen.getByRole('link');
      expect(link).toBeInTheDocument();
      expect(link).toHaveAttribute('href', expect.stringContaining('/tx/'));
      expect(link).toHaveAttribute('target', '_blank');
      expect(link).toHaveAttribute('rel', 'noopener noreferrer');
    });

    it('should render address link correctly', () => {
      const address = '0x1234567890123456789012345678901234567890';
      render(<BlockscoutLink type="address" value={address} />);

      const link = screen.getByRole('link');
      expect(link).toHaveAttribute('href', expect.stringContaining('/address/'));
    });

    it('should render block link correctly', () => {
      render(<BlockscoutLink type="block" value={12345} />);

      const link = screen.getByRole('link');
      expect(link).toHaveAttribute('href', expect.stringContaining('/block/'));
      expect(link).toHaveTextContent('12345');
    });

    it('should render token link correctly', () => {
      const tokenAddress = '0x1234567890123456789012345678901234567890';
      render(<BlockscoutLink type="token" value={tokenAddress} />);

      const link = screen.getByRole('link');
      expect(link).toHaveAttribute('href', expect.stringContaining('/token/'));
    });

    it('should truncate hash when showTruncated is true', () => {
      const txHash = '0x1234567890123456789012345678901234567890123456789012345678901234';
      render(<BlockscoutLink type="transaction" value={txHash} showTruncated />);

      expect(screen.getByText(/0x1234\.\.\.1234/)).toBeInTheDocument();
    });

    it('should show full hash when showTruncated is false', () => {
      const txHash = '0x1234567890123456789012345678901234567890123456789012345678901234';
      render(<BlockscoutLink type="transaction" value={txHash} showTruncated={false} />);

      expect(screen.getByText(txHash)).toBeInTheDocument();
    });

    it('should use custom label when provided', () => {
      const txHash = '0x1234567890123456789012345678901234567890123456789012345678901234';
      render(<BlockscoutLink type="transaction" value={txHash} label="View Transaction" />);

      expect(screen.getByText('View Transaction')).toBeInTheDocument();
    });

    it('should show icon when showIcon is true', () => {
      const txHash = '0x1234567890123456789012345678901234567890123456789012345678901234';
      const { container } = render(
        <BlockscoutLink type="transaction" value={txHash} showIcon />
      );

      // Check for external link icon
      expect(container.querySelector('svg')).toBeInTheDocument();
    });

    it('should apply custom className', () => {
      const txHash = '0x1234567890123456789012345678901234567890123456789012345678901234';
      render(
        <BlockscoutLink type="transaction" value={txHash} className="custom-class" />
      );

      const link = screen.getByRole('link');
      expect(link).toHaveClass('custom-class');
    });
  });

  describe('TransactionLink', () => {
    it('should render transaction link with default props', () => {
      const txHash = '0x1234567890123456789012345678901234567890123456789012345678901234';
      render(<TransactionLink txHash={txHash} />);

      const link = screen.getByRole('link');
      expect(link).toBeInTheDocument();
      expect(link).toHaveAttribute('href', expect.stringContaining('/tx/'));
    });

    it('should pass through additional props', () => {
      const txHash = '0x1234567890123456789012345678901234567890123456789012345678901234';
      render(<TransactionLink txHash={txHash} label="Custom Label" showIcon />);

      expect(screen.getByText('Custom Label')).toBeInTheDocument();
    });
  });

  describe('AddressLink', () => {
    it('should render address link with default props', () => {
      const address = '0x1234567890123456789012345678901234567890';
      render(<AddressLink address={address} />);

      const link = screen.getByRole('link');
      expect(link).toBeInTheDocument();
      expect(link).toHaveAttribute('href', expect.stringContaining('/address/'));
    });

    it('should truncate address by default', () => {
      const address = '0x1234567890123456789012345678901234567890';
      render(<AddressLink address={address} />);

      expect(screen.getByText(/0x1234\.\.\.7890/)).toBeInTheDocument();
    });
  });

  describe('BlockLink', () => {
    it('should render block link with number', () => {
      render(<BlockLink blockNumber={12345} />);

      const link = screen.getByRole('link');
      expect(link).toBeInTheDocument();
      expect(link).toHaveAttribute('href', expect.stringContaining('/block/'));
      expect(link).toHaveTextContent('12345');
    });

    it('should render block link with hash', () => {
      const blockHash = '0x1234567890123456789012345678901234567890123456789012345678901234';
      render(<BlockLink blockHash={blockHash} />);

      const link = screen.getByRole('link');
      expect(link).toBeInTheDocument();
    });
  });

  describe('TokenLink', () => {
    it('should render token link with default props', () => {
      const tokenAddress = '0x1234567890123456789012345678901234567890';
      render(<TokenLink tokenAddress={tokenAddress} />);

      const link = screen.getByRole('link');
      expect(link).toBeInTheDocument();
      expect(link).toHaveAttribute('href', expect.stringContaining('/token/'));
    });

    it('should use token name as label when provided', () => {
      const tokenAddress = '0x1234567890123456789012345678901234567890';
      render(<TokenLink tokenAddress={tokenAddress} tokenName="ANDE" />);

      expect(screen.getByText('ANDE')).toBeInTheDocument();
    });
  });

  describe('Network Support', () => {
    it('should use specified network for all link types', () => {
      const txHash = '0x1234567890123456789012345678901234567890123456789012345678901234';
      render(<TransactionLink txHash={txHash} network="testnet" />);

      const link = screen.getByRole('link');
      // URL should contain testnet blockscout URL
      expect(link.getAttribute('href')).toContain('testnet');
    });
  });
});
