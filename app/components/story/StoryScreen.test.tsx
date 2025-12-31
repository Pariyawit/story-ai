import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';

import { StoryBeat } from '@/types';

import StoryScreen from './StoryScreen';

// Mock next/navigation
vi.mock('next/navigation', () => ({
  useRouter: () => ({
    push: vi.fn(),
    back: vi.fn(),
  }),
}));

const mockHistory: StoryBeat[] = [
  {
    storyText: 'First scene story text.',
    choices: ['Choice A', 'Choice B'],
    imagePrompt: 'first scene image',
    imageUrl: 'https://example.com/image1.png',
    selected: 'Choice A',
  },
  {
    storyText: 'Second scene story text.',
    choices: ['Choice C', 'Choice D'],
    imagePrompt: 'second scene image',
    imageUrl: 'https://example.com/image2.png',
    selected: 'Choice C',
  },
];

// Current beat with no choices = story ended
const endedCurrentBeat: StoryBeat = {
  storyText: 'The end of the story.',
  choices: [],
  imagePrompt: 'ending scene image',
  imageUrl: 'https://example.com/image3.png',
};

// Current beat with choices = story ongoing
const ongoingCurrentBeat: StoryBeat = {
  storyText: 'The story continues...',
  choices: ['Go left', 'Go right'],
  imagePrompt: 'scene image',
  imageUrl: 'https://example.com/image.png',
};

describe('StoryScreen', () => {
  describe('when story has ended', () => {
    it('shows carousel view by default (Gallery View button is active)', () => {
      render(
        <StoryScreen
          playerName="Test Player"
          currentBeat={endedCurrentBeat}
          currentPage={3}
          history={mockHistory}
          language="en"
          isLoading={false}
          onChoice={vi.fn()}
          onRestart={vi.fn()}
        />
      );

      // Should show the Gallery View button (carousel is default)
      const galleryButton = screen.getByRole('button', { name: /Gallery View/i });
      expect(galleryButton).toBeInTheDocument();

      // Should show the Full Story button
      const fullStoryButton = screen.getByRole('button', { name: /Full Story/i });
      expect(fullStoryButton).toBeInTheDocument();

      // Carousel should be visible with the last scene
      expect(screen.getByText('Scene 3 / 3')).toBeInTheDocument();
      expect(screen.getByText('The end of the story.')).toBeInTheDocument();
    });

    it('switches to full text view when Full Story button is clicked', () => {
      render(
        <StoryScreen
          playerName="Test Player"
          currentBeat={endedCurrentBeat}
          currentPage={3}
          history={mockHistory}
          language="en"
          isLoading={false}
          onChoice={vi.fn()}
          onRestart={vi.fn()}
        />
      );

      // Click the Full Story button
      const fullStoryButton = screen.getByRole('button', { name: /Full Story/i });
      fireEvent.click(fullStoryButton);

      // Should show the full story title
      expect(screen.getByText('📖 The Complete Story')).toBeInTheDocument();

      // Should contain text from all scenes
      expect(screen.getByText(/First scene story text/)).toBeInTheDocument();
    });

    it('can switch back to carousel view from full text view', () => {
      render(
        <StoryScreen
          playerName="Test Player"
          currentBeat={endedCurrentBeat}
          currentPage={3}
          history={mockHistory}
          language="en"
          isLoading={false}
          onChoice={vi.fn()}
          onRestart={vi.fn()}
        />
      );

      // Switch to full text
      const fullStoryButton = screen.getByRole('button', { name: /Full Story/i });
      fireEvent.click(fullStoryButton);

      // Switch back to carousel
      const galleryButton = screen.getByRole('button', { name: /Gallery View/i });
      fireEvent.click(galleryButton);

      // Carousel should be visible again
      expect(screen.getByText('Scene 3 / 3')).toBeInTheDocument();
    });

    it('shows Thai text when language is th', () => {
      render(
        <StoryScreen
          playerName="Test Player"
          currentBeat={endedCurrentBeat}
          currentPage={3}
          history={mockHistory}
          language="th"
          isLoading={false}
          onChoice={vi.fn()}
          onRestart={vi.fn()}
        />
      );

      // Should show Thai toggle buttons (🎠 for gallery, 📖 for full story)
      expect(screen.getByRole('button', { name: /🎠 ดูแกลเลอรี/i })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /📖 อ่านเรื่องทั้งหมด/i })).toBeInTheDocument();
    });

    it('shows PDF export button when story has ended', () => {
      render(
        <StoryScreen
          playerName="Test Player"
          currentBeat={endedCurrentBeat}
          currentPage={3}
          history={mockHistory}
          language="en"
          isLoading={false}
          onChoice={vi.fn()}
          onRestart={vi.fn()}
        />
      );

      // Should show the PDF export button
      const exportButton = screen.getByRole('button', { name: /Download Story Book \(PDF\)/i });
      expect(exportButton).toBeInTheDocument();
    });

    it('shows Thai PDF export button when language is th', () => {
      render(
        <StoryScreen
          playerName="Test Player"
          currentBeat={endedCurrentBeat}
          currentPage={3}
          history={mockHistory}
          language="th"
          isLoading={false}
          onChoice={vi.fn()}
          onRestart={vi.fn()}
        />
      );

      // Should show the Thai PDF export button
      const exportButton = screen.getByRole('button', {
        name: /ดาวน์โหลดหนังสือเรื่องราว \(PDF\)/i,
      });
      expect(exportButton).toBeInTheDocument();
    });
  });

  describe('when story is ongoing', () => {
    it('shows normal story view without toggle buttons', () => {
      render(
        <StoryScreen
          playerName="Test Player"
          currentBeat={ongoingCurrentBeat}
          currentPage={2}
          history={mockHistory}
          language="en"
          isLoading={false}
          onChoice={vi.fn()}
          onRestart={vi.fn()}
        />
      );

      // Should show page indicator
      expect(screen.getByText('Page 2/12')).toBeInTheDocument();

      // Should show current story text
      expect(screen.getByText('The story continues...')).toBeInTheDocument();

      // Should show choice buttons
      expect(screen.getByRole('button', { name: 'Go left' })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: 'Go right' })).toBeInTheDocument();

      // Should NOT show view toggle buttons
      expect(screen.queryByRole('button', { name: /Gallery View/i })).not.toBeInTheDocument();
      expect(screen.queryByRole('button', { name: /Full Story/i })).not.toBeInTheDocument();
    });
  });
});
