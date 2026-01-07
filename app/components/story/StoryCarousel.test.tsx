import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';

import { StoryBeat } from '@/types';

import StoryCarousel from './StoryCarousel';

const mockHistory: StoryBeat[] = [
  {
    storyText: 'First scene story text',
    choices: ['Choice A', 'Choice B'],
    imagePrompt: 'first scene image',
    imageData: 'https://example.com/image1.png',
    selected: 'Choice A',
  },
  {
    storyText: 'Second scene',
    choices: ['Choice C', 'Choice D'],
    imagePrompt: 'second scene image',
    imageData: 'https://example.com/image2.png',
    selected: 'Choice C',
  },
  {
    storyText: 'Third scene',
    choices: [],
    imagePrompt: 'third scene image',
    imageData: 'https://example.com/image3.png',
  },
];

describe('StoryCarousel', () => {
  it('renders the first scene by default (startAtEnd=false)', () => {
    render(<StoryCarousel history={mockHistory} language='en' />);

    // Should show Scene 1 of 3
    expect(screen.getByText('Scene 1 / 3')).toBeInTheDocument();
    // Should show the first story text
    expect(screen.getByText('First scene story text')).toBeInTheDocument();
  });

  it('renders the last scene when startAtEnd=true', () => {
    render(<StoryCarousel history={mockHistory} language='en' startAtEnd={true} />);

    // Should show Scene 3 of 3
    expect(screen.getByText('Scene 3 / 3')).toBeInTheDocument();
    // Should show the last story text
    expect(screen.getByText('Third scene')).toBeInTheDocument();
  });

  it('renders Thai text when language is th', () => {
    render(<StoryCarousel history={mockHistory} language='th' startAtEnd={true} />);

    // Should show Thai scene indicator
    expect(screen.getByText('ฉาก 3 / 3')).toBeInTheDocument();
  });

  it('handles empty history', () => {
    render(<StoryCarousel history={[]} language='en' startAtEnd={true} />);

    // Should show "No story yet" message
    expect(screen.getByText('No story yet')).toBeInTheDocument();
  });

  it('shows selected choice for non-final scenes', () => {
    render(<StoryCarousel history={mockHistory} language='en' />);

    // First scene has a selected choice
    expect(screen.getByText(/You chose:/)).toBeInTheDocument();
    expect(screen.getByText(/Choice A/)).toBeInTheDocument();
  });
});
