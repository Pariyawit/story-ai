import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import ExportPdfButton from './ExportPdfButton';
import { StoryBeat } from '@/types';

// Mock jsPDF functions that can be referenced in tests
const mockAddImage = vi.fn();
const mockAddPage = vi.fn();
const mockSave = vi.fn();
const mockText = vi.fn();
const mockSetFont = vi.fn();
const mockSetFontSize = vi.fn();
const mockSetTextColor = vi.fn();
const mockSetDrawColor = vi.fn();
const mockSetLineWidth = vi.fn();
const mockSetFillColor = vi.fn();
const mockRoundedRect = vi.fn();
const mockLine = vi.fn();
const mockGetTextWidth = vi.fn().mockReturnValue(50);

vi.mock('jspdf', () => {
  return {
    jsPDF: class MockJsPDF {
      internal = {
        pageSize: {
          getWidth: () => 210,
          getHeight: () => 297,
        },
      };
      addImage(...args: unknown[]) { mockAddImage(...args); }
      addPage(...args: unknown[]) { mockAddPage(...args); }
      save(...args: unknown[]) { mockSave(...args); }
      text(...args: unknown[]) { mockText(...args); }
      setFont(...args: unknown[]) { mockSetFont(...args); }
      setFontSize(...args: unknown[]) { mockSetFontSize(...args); }
      setTextColor(...args: unknown[]) { mockSetTextColor(...args); }
      setDrawColor(...args: unknown[]) { mockSetDrawColor(...args); }
      setLineWidth(...args: unknown[]) { mockSetLineWidth(...args); }
      setFillColor(...args: unknown[]) { mockSetFillColor(...args); }
      roundedRect(...args: unknown[]) { mockRoundedRect(...args); }
      line(...args: unknown[]) { mockLine(...args); }
      getTextWidth(...args: unknown[]) { return mockGetTextWidth(...args); }
    },
  };
});

// Mock fetch for image loading
const mockFetchResponse = (ok: boolean, blobContent?: Blob) => {
  return vi.fn().mockResolvedValue({
    ok,
    blob: () => Promise.resolve(blobContent || new Blob(['image data'], { type: 'image/png' })),
  });
};

// Create a mock FileReader class
class MockFileReader {
  result: string | null = null;
  onloadend: ((ev: ProgressEvent<FileReader>) => unknown) | null = null;
  onerror: ((ev: ProgressEvent<FileReader>) => unknown) | null = null;

  readAsDataURL(): void {
    setTimeout(() => {
      this.result = 'data:image/png;base64,mockBase64Data';
      if (this.onloadend) {
        this.onloadend({} as ProgressEvent<FileReader>);
      }
    }, 0);
  }
}

describe('ExportPdfButton', () => {
  const originalFileReader = global.FileReader;

  beforeEach(() => {
    vi.clearAllMocks();
    // Mock FileReader with a proper class
    global.FileReader = MockFileReader as unknown as typeof FileReader;
  });

  afterEach(() => {
    vi.restoreAllMocks();
    global.FileReader = originalFileReader;
  });

  const mockHistoryWithImages: StoryBeat[] = [
    {
      storyText: 'First scene of the story.',
      choices: ['Choice A', 'Choice B'],
      imagePrompt: 'A magical forest',
      imageUrl: 'https://example.com/image1.png',
      selected: 'Choice A',
    },
    {
      storyText: 'Second scene continues.',
      choices: ['Choice C', 'Choice D'],
      imagePrompt: 'A friendly dragon',
      imageUrl: 'https://example.com/image2.png',
      selected: 'Choice C',
    },
  ];

  const mockHistoryWithoutImages: StoryBeat[] = [
    {
      storyText: 'Scene without image.',
      choices: ['Choice A'],
      imagePrompt: 'No image',
      selected: 'Choice A',
    },
  ];

  it('renders the export button', () => {
    render(
      <ExportPdfButton
        history={mockHistoryWithImages}
        playerName="Test Player"
        language="en"
      />
    );

    const button = screen.getByRole('button', { name: /Download Story Book \(PDF\)/i });
    expect(button).toBeInTheDocument();
  });

  it('shows loading state while exporting', async () => {
    global.fetch = mockFetchResponse(true);

    render(
      <ExportPdfButton
        history={mockHistoryWithImages}
        playerName="Test Player"
        language="en"
      />
    );

    const button = screen.getByRole('button', { name: /Download Story Book \(PDF\)/i });
    fireEvent.click(button);

    // Should show loading text
    expect(screen.getByText(/Creating PDF.../i)).toBeInTheDocument();

    // Wait for export to complete
    await waitFor(() => {
      expect(mockSave).toHaveBeenCalled();
    });
  });

  it('fetches images and adds them to PDF when story beats have image URLs', async () => {
    global.fetch = mockFetchResponse(true);

    render(
      <ExportPdfButton
        history={mockHistoryWithImages}
        playerName="Test Player"
        language="en"
      />
    );

    const button = screen.getByRole('button', { name: /Download Story Book \(PDF\)/i });
    fireEvent.click(button);

    await waitFor(() => {
      expect(mockSave).toHaveBeenCalled();
    });

    // Should have fetched both images
    expect(global.fetch).toHaveBeenCalledTimes(2);
    expect(global.fetch).toHaveBeenCalledWith('https://example.com/image1.png');
    expect(global.fetch).toHaveBeenCalledWith('https://example.com/image2.png');

    // Should have called addImage for each story beat with an image
    expect(mockAddImage).toHaveBeenCalledTimes(2);
  });

  it('handles story beats without images gracefully', async () => {
    global.fetch = mockFetchResponse(true);

    render(
      <ExportPdfButton
        history={mockHistoryWithoutImages}
        playerName="Test Player"
        language="en"
      />
    );

    const button = screen.getByRole('button', { name: /Download Story Book \(PDF\)/i });
    fireEvent.click(button);

    await waitFor(() => {
      expect(mockSave).toHaveBeenCalled();
    });

    // Should not have fetched any images
    expect(global.fetch).not.toHaveBeenCalled();

    // Should not have called addImage
    expect(mockAddImage).not.toHaveBeenCalled();
  });

  it('handles image fetch failures gracefully', async () => {
    global.fetch = mockFetchResponse(false); // Simulate failed fetch

    render(
      <ExportPdfButton
        history={mockHistoryWithImages}
        playerName="Test Player"
        language="en"
      />
    );

    const button = screen.getByRole('button', { name: /Download Story Book \(PDF\)/i });
    fireEvent.click(button);

    await waitFor(() => {
      expect(mockSave).toHaveBeenCalled();
    });

    // PDF should still be generated even if images fail
    expect(mockSave).toHaveBeenCalled();
    // Images should not be added when fetch fails
    expect(mockAddImage).not.toHaveBeenCalled();
  });

  it('shows Thai text when language is th', () => {
    render(
      <ExportPdfButton
        history={mockHistoryWithImages}
        playerName="Test Player"
        language="th"
      />
    );

    const button = screen.getByRole('button', { name: /ดาวน์โหลดหนังสือเรื่องราว \(PDF\)/i });
    expect(button).toBeInTheDocument();
  });

  it('disables button when history is empty', () => {
    render(
      <ExportPdfButton
        history={[]}
        playerName="Test Player"
        language="en"
      />
    );

    const button = screen.getByRole('button', { name: /Download Story Book \(PDF\)/i });
    expect(button).toBeDisabled();
  });
});
