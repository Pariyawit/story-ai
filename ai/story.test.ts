import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';

// Mock OpenAI to prevent API key requirement during import
vi.mock('openai', () => ({
    default: vi.fn().mockImplementation(() => ({})),
}));

// Mock the ai module that creates OpenAI client
vi.mock('./ai', () => ({
    openai: {},
}));

// Mock the LLM module
vi.mock('./llm', () => ({
    runLLM: vi.fn(),
}));

// Mock image generation
vi.mock('./generateImage', () => ({
    generateImage: vi.fn(),
}));

import {
    PLACEHOLDER_PATTERNS,
    isPlaceholderChoice,
    validateChoices,
    mapHistory,
} from './story';

describe('PLACEHOLDER_PATTERNS', () => {
    it('contains expected number of patterns', () => {
        expect(PLACEHOLDER_PATTERNS.length).toBeGreaterThan(0);
    });

    it('all patterns are RegExp objects', () => {
        PLACEHOLDER_PATTERNS.forEach((pattern) => {
            expect(pattern).toBeInstanceOf(RegExp);
        });
    });
});

describe('isPlaceholderChoice', () => {
    describe('should return true for placeholder patterns', () => {
        const placeholders = [
            'Choice A',
            'choice a',
            'CHOICE A',
            'Choice B',
            'choice c',
            'Option A',
            'option b',
            'Option C',
            'Choice 1',
            'choice 2',
            'choice 3',
            'Option 1',
            'Alternative A',
            'alternative b',
            'pick a',
            'Pick B',
            '1. choice a',
            '2. choice b',
            'a.',
            'b.',
            'c.',
            'a',
            'b',
            'c',
        ];

        it.each(placeholders)('detects placeholder: "%s"', (choice) => {
            expect(isPlaceholderChoice(choice)).toBe(true);
        });
    });

    describe('should return false for valid choices', () => {
        const validChoices = [
            'Follow the butterfly',
            'Open the magic door',
            'Talk to the friendly owl',
            'ตามผีเสื้อไป',
            'เปิดประตูวิเศษ',
            'คุยกับนกฮูกใจดี',
            'Explore the cave',
            'Run away quickly',
            'Pick up the glowing stone',
            'Dance with the fireflies',
            'Climb the rainbow tree',
            'Swim across the river',
            'Ask the wizard for help',
        ];

        it.each(validChoices)('accepts valid choice: "%s"', (choice) => {
            expect(isPlaceholderChoice(choice)).toBe(false);
        });
    });

    it('handles whitespace correctly', () => {
        expect(isPlaceholderChoice('  Choice A  ')).toBe(true);
        expect(isPlaceholderChoice('  Follow the path  ')).toBe(false);
    });

    it('handles empty string', () => {
        expect(isPlaceholderChoice('')).toBe(false);
    });
});

describe('validateChoices', () => {
    let warnSpy: ReturnType<typeof vi.spyOn>;

    beforeEach(() => {
        warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => { });
    });

    afterEach(() => {
        warnSpy.mockRestore();
    });

    it('returns true for undefined choices', () => {
        expect(validateChoices(undefined)).toBe(true);
    });

    it('returns true for empty array', () => {
        expect(validateChoices([])).toBe(true);
    });

    it('returns true for valid choices', () => {
        const validChoices = [
            'Follow the butterfly',
            'Open the door',
            'Talk to the owl',
        ];
        expect(validateChoices(validChoices)).toBe(true);
        expect(warnSpy).not.toHaveBeenCalled();
    });

    it('returns true for Thai choices', () => {
        const thaiChoices = ['ตามผีเสื้อไป', 'เปิดประตู', 'คุยกับนกฮูก'];
        expect(validateChoices(thaiChoices)).toBe(true);
        expect(warnSpy).not.toHaveBeenCalled();
    });

    it('returns false when any choice is a placeholder', () => {
        const mixedChoices = ['Follow the butterfly', 'Choice B', 'Talk to the owl'];
        expect(validateChoices(mixedChoices)).toBe(false);
    });

    it('returns false when all choices are placeholders', () => {
        const placeholders = ['Choice A', 'Choice B', 'Choice C'];
        expect(validateChoices(placeholders)).toBe(false);
    });

    it('logs warning for placeholder choices', () => {
        validateChoices(['Choice A', 'Valid choice', 'Choice C']);
        expect(warnSpy).toHaveBeenCalledWith(
            '[WARN] Detected placeholder choices that may indicate LLM hallucination:',
            ['Choice A', 'Choice C']
        );
    });

    it('does not log warning for valid choices', () => {
        validateChoices(['Valid choice 1', 'Valid choice 2']);
        expect(warnSpy).not.toHaveBeenCalled();
    });
});

describe('mapHistory', () => {
    it('returns system prompt as first message for empty history', () => {
        const messages = mapHistory('Alice', [], 'girl', 'en');
        expect(messages).toHaveLength(1);
        expect(messages[0].role).toBe('system');
    });

    it('includes player name in system prompt', () => {
        const messages = mapHistory('Bob', [], 'boy', 'en');
        expect(messages[0].content).toContain('Bob');
    });

    it('adds assistant message for history without selection', () => {
        const history = [
            {
                storyText: 'Once upon a time...',
                choices: ['Go left', 'Go right', 'Stay'],
                imagePrompt: 'A forest path',
            },
        ];
        const messages = mapHistory('Alice', history, 'girl', 'en');
        // system + 1 assistant (no user message since no selection)
        expect(messages).toHaveLength(2);
        expect(messages[0].role).toBe('system');
        expect(messages[1].role).toBe('assistant');
    });

    it('adds assistant and user messages for history with selection', () => {
        const history = [
            {
                storyText: 'Once upon a time...',
                choices: ['Go left', 'Go right', 'Stay'],
                imagePrompt: 'A forest path',
                selected: 'Go left',
            },
        ];
        const messages = mapHistory('Bob', history, 'boy', 'en');
        expect(messages).toHaveLength(3); // system + assistant + user
        expect(messages[0].role).toBe('system');
        expect(messages[1].role).toBe('assistant');
        expect(messages[2].role).toBe('user');
    });

    it('handles multiple history beats correctly', () => {
        const history = [
            {
                storyText: 'Story beat 1',
                choices: ['A', 'B', 'C'],
                imagePrompt: 'Scene 1',
                selected: 'A',
            },
            {
                storyText: 'Story beat 2',
                choices: ['D', 'E', 'F'],
                imagePrompt: 'Scene 2',
                selected: 'E',
            },
        ];
        const messages = mapHistory('Charlie', history, 'boy', 'en');
        // system + (assistant + user) * 2 = 5
        expect(messages).toHaveLength(5);
    });

    it('handles Thai language correctly', () => {
        const messages = mapHistory('สมชาย', [], 'boy', 'th');
        expect(messages[0].role).toBe('system');
        expect(messages[0].content).toContain('สมชาย');
    });

    it('handles girl gender correctly', () => {
        const messages = mapHistory('Alice', [], 'girl', 'en');
        expect(messages[0].content).toContain('girl');
    });

    it('handles boy gender correctly', () => {
        const messages = mapHistory('Bob', [], 'boy', 'en');
        expect(messages[0].content).toContain('boy');
    });

    it('includes beat number in user message', () => {
        const history = [
            {
                storyText: 'Story',
                choices: ['A', 'B'],
                imagePrompt: 'prompt',
                selected: 'A',
            },
        ];
        const messages = mapHistory('Test', history, 'boy', 'en');
        const userMessage = messages.find((m) => m.role === 'user');
        expect(userMessage?.content).toContain('beat');
        expect(userMessage?.content).toContain('1');
    });
});
