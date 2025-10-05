import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { TransactionStatus } from '../TransactionStatus';

// Mock the checkTransactionStatus function
jest.mock('@/lib/blockchain/blockscout', () => ({
  ...jest.requireActual('@/lib/blockchain/blockscout'),
  checkTransactionStatus: jest.fn(),
}));

import { checkTransactionStatus } from '@/lib/blockchain/blockscout';

describe('TransactionStatus', () => {
  const mockTxHash = '0x1234567890123456789012345678901234567890123456789012345678901234';

  beforeEach(() => {
    jest.clearAllMocks();
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.runOnlyPendingTimers();
    jest.useRealTimers();
  });

  describe('Status Display', () => {
    it('should show pending status initially', () => {
      (checkTransactionStatus as jest.Mock).mockResolvedValue('pending');
      render(<TransactionStatus txHash={mockTxHash} />);

      expect(screen.getByText(/Pendiente/i)).toBeInTheDocument();
    });

    it('should show success status when confirmed', async () => {
      (checkTransactionStatus as jest.Mock).mockResolvedValue('success');
      render(<TransactionStatus txHash={mockTxHash} />);

      await waitFor(() => {
        expect(screen.getByText(/Confirmada/i)).toBeInTheDocument();
      });
    });

    it('should show failed status when transaction fails', async () => {
      (checkTransactionStatus as jest.Mock).mockResolvedValue('failed');
      render(<TransactionStatus txHash={mockTxHash} />);

      await waitFor(() => {
        expect(screen.getByText(/Fallida/i)).toBeInTheDocument();
      });
    });

    it('should show unknown status when status cannot be determined', async () => {
      (checkTransactionStatus as jest.Mock).mockResolvedValue('unknown');
      render(<TransactionStatus txHash={mockTxHash} />);

      await waitFor(() => {
        expect(screen.getByText(/Desconocido/i)).toBeInTheDocument();
      });
    });
  });

  describe('Auto-refresh', () => {
    it('should auto-refresh with default interval', async () => {
      (checkTransactionStatus as jest.Mock)
        .mockResolvedValueOnce('pending')
        .mockResolvedValueOnce('pending')
        .mockResolvedValueOnce('success');

      render(<TransactionStatus txHash={mockTxHash} />);

      expect(checkTransactionStatus).toHaveBeenCalledTimes(1);

      // Fast-forward 3 seconds (default interval)
      jest.advanceTimersByTime(3000);
      await waitFor(() => {
        expect(checkTransactionStatus).toHaveBeenCalledTimes(2);
      });

      jest.advanceTimersByTime(3000);
      await waitFor(() => {
        expect(checkTransactionStatus).toHaveBeenCalledTimes(3);
      });
    });

    it('should stop refreshing when status is success', async () => {
      (checkTransactionStatus as jest.Mock).mockResolvedValue('success');

      render(<TransactionStatus txHash={mockTxHash} />);

      await waitFor(() => {
        expect(screen.getByText(/Confirmada/i)).toBeInTheDocument();
      });

      const initialCallCount = (checkTransactionStatus as jest.Mock).mock.calls.length;

      // Advance time and check that no more calls are made
      jest.advanceTimersByTime(10000);
      await waitFor(() => {
        expect(checkTransactionStatus).toHaveBeenCalledTimes(initialCallCount);
      });
    });

    it('should stop refreshing when status is failed', async () => {
      (checkTransactionStatus as jest.Mock).mockResolvedValue('failed');

      render(<TransactionStatus txHash={mockTxHash} />);

      await waitFor(() => {
        expect(screen.getByText(/Fallida/i)).toBeInTheDocument();
      });

      const initialCallCount = (checkTransactionStatus as jest.Mock).mock.calls.length;

      jest.advanceTimersByTime(10000);
      await waitFor(() => {
        expect(checkTransactionStatus).toHaveBeenCalledTimes(initialCallCount);
      });
    });

    it('should use custom refresh interval', async () => {
      (checkTransactionStatus as jest.Mock).mockResolvedValue('pending');

      render(<TransactionStatus txHash={mockTxHash} refreshInterval={5000} />);

      expect(checkTransactionStatus).toHaveBeenCalledTimes(1);

      jest.advanceTimersByTime(5000);
      await waitFor(() => {
        expect(checkTransactionStatus).toHaveBeenCalledTimes(2);
      });
    });
  });

  describe('Variants', () => {
    it('should render default variant', () => {
      (checkTransactionStatus as jest.Mock).mockResolvedValue('pending');
      const { container } = render(<TransactionStatus txHash={mockTxHash} variant="default" />);

      expect(container.querySelector('.inline-flex')).toBeInTheDocument();
    });

    it('should render badge variant', () => {
      (checkTransactionStatus as jest.Mock).mockResolvedValue('pending');
      const { container } = render(<TransactionStatus txHash={mockTxHash} variant="badge" />);

      expect(container.querySelector('.inline-flex')).toBeInTheDocument();
    });

    it('should render alert variant', () => {
      (checkTransactionStatus as jest.Mock).mockResolvedValue('pending');
      const { container } = render(<TransactionStatus txHash={mockTxHash} variant="alert" />);

      expect(container.querySelector('[role="alert"]')).toBeInTheDocument();
    });
  });

  describe('Network Support', () => {
    it('should use specified network', async () => {
      (checkTransactionStatus as jest.Mock).mockResolvedValue('success');

      render(<TransactionStatus txHash={mockTxHash} network="testnet" />);

      await waitFor(() => {
        expect(checkTransactionStatus).toHaveBeenCalledWith(mockTxHash, 'testnet');
      });
    });

    it('should use local network by default', async () => {
      (checkTransactionStatus as jest.Mock).mockResolvedValue('success');

      render(<TransactionStatus txHash={mockTxHash} />);

      await waitFor(() => {
        expect(checkTransactionStatus).toHaveBeenCalledWith(mockTxHash, 'local');
      });
    });
  });

  describe('Visual States', () => {
    it('should show success icon for confirmed transaction', async () => {
      (checkTransactionStatus as jest.Mock).mockResolvedValue('success');
      const { container } = render(<TransactionStatus txHash={mockTxHash} />);

      await waitFor(() => {
        // Check for CheckCircle2 icon
        expect(container.querySelector('svg')).toBeInTheDocument();
      });
    });

    it('should show error icon for failed transaction', async () => {
      (checkTransactionStatus as jest.Mock).mockResolvedValue('failed');
      const { container } = render(<TransactionStatus txHash={mockTxHash} />);

      await waitFor(() => {
        // Check for XCircle icon
        expect(container.querySelector('svg')).toBeInTheDocument();
      });
    });

    it('should show loading icon for pending transaction', async () => {
      (checkTransactionStatus as jest.Mock).mockResolvedValue('pending');
      const { container } = render(<TransactionStatus txHash={mockTxHash} />);

      await waitFor(() => {
        // Check for Loader2 icon with animation
        expect(container.querySelector('svg')).toBeInTheDocument();
      });
    });
  });

  describe('Error Handling', () => {
    it('should handle API errors gracefully', async () => {
      (checkTransactionStatus as jest.Mock).mockRejectedValue(new Error('API Error'));

      render(<TransactionStatus txHash={mockTxHash} />);

      await waitFor(() => {
        expect(screen.getByText(/Desconocido/i)).toBeInTheDocument();
      });
    });

    it('should continue retrying after errors for pending transactions', async () => {
      (checkTransactionStatus as jest.Mock)
        .mockRejectedValueOnce(new Error('API Error'))
        .mockResolvedValueOnce('pending')
        .mockResolvedValueOnce('success');

      render(<TransactionStatus txHash={mockTxHash} />);

      await waitFor(() => {
        expect(screen.getByText(/Desconocido/i)).toBeInTheDocument();
      });

      jest.advanceTimersByTime(3000);
      await waitFor(() => {
        expect(screen.getByText(/Pendiente/i)).toBeInTheDocument();
      });

      jest.advanceTimersByTime(3000);
      await waitFor(() => {
        expect(screen.getByText(/Confirmada/i)).toBeInTheDocument();
      });
    });
  });
});
