'use client';

import { jsPDF } from 'jspdf';
import { useState } from 'react';

import { t } from '@/lib/i18n';
import { StoryBeat, Language } from '@/types';

import Button from '../common/Button';

interface ExportPdfButtonProps {
  history: StoryBeat[];
  playerName: string;
  language: Language;
}

// PDF layout constants
const PDF_MARGIN = 20;
const PAGE_TOP_POSITION = 30;
const BOTTOM_MARGIN_FOR_CONTENT = 50;
const BOTTOM_MARGIN_FOR_CHOICE = 40;
const IMAGE_HEIGHT = 80; // Height in mm for images in PDF
const IMAGE_MARGIN_BOTTOM = 10; // Margin below image

/**
 * Returns the image URL if it's already a base64 data URL.
 * Since images now come as base64 directly from the server, this is just a pass-through.
 * Returns null for non-base64 URLs (legacy/fallback case).
 */
function getImageDataUrl(imageUrl: string): string | null {
  if (imageUrl.startsWith('data:')) {
    return imageUrl;
  }
  // Legacy URLs are no longer supported - images should always be base64
  console.warn('Non-base64 image URL encountered - this should not happen with current API');
  return null;
}

export default function ExportPdfButton({ history, playerName, language }: ExportPdfButtonProps) {
  const [isExporting, setIsExporting] = useState(false);
  const [exportError, setExportError] = useState<string | null>(null);

  const generatePdf = async () => {
    setIsExporting(true);
    setExportError(null);

    try {
      // Create a new PDF document with A4 size in portrait mode
      const doc = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4',
      });

      const pageWidth = doc.internal.pageSize.getWidth();
      const pageHeight = doc.internal.pageSize.getHeight();
      const contentWidth = pageWidth - 2 * PDF_MARGIN;

      // Helper function to add a new page with decorative border
      const addPageDecoration = () => {
        // Soft purple border for children's book feel
        doc.setDrawColor(180, 150, 200);
        doc.setLineWidth(2);
        doc.roundedRect(10, 10, pageWidth - 20, pageHeight - 20, 5, 5, 'S');

        // Inner decorative line
        doc.setDrawColor(220, 200, 240);
        doc.setLineWidth(0.5);
        doc.roundedRect(15, 15, pageWidth - 30, pageHeight - 30, 3, 3, 'S');
      };

      // Helper function to break a long word that exceeds maxWidth
      const breakLongWord = (word: string, maxWidth: number): string[] => {
        const parts: string[] = [];
        let remaining = word;

        while (remaining.length > 0) {
          let end = remaining.length;
          while (end > 1 && doc.getTextWidth(remaining.substring(0, end)) > maxWidth) {
            end--;
          }
          parts.push(remaining.substring(0, end));
          remaining = remaining.substring(end);
        }

        return parts;
      };

      // Helper function to wrap text with support for long words
      const wrapText = (text: string, maxWidth: number, fontSize: number): string[] => {
        doc.setFontSize(fontSize);
        const words = text.split(' ');
        const lines: string[] = [];
        let currentLine = '';

        words.forEach((word) => {
          // Check if the word itself is too long
          if (doc.getTextWidth(word) > maxWidth) {
            // First, push the current line if it exists
            if (currentLine) {
              lines.push(currentLine);
              currentLine = '';
            }
            // Break the long word into parts
            const wordParts = breakLongWord(word, maxWidth);
            wordParts.forEach((part, index) => {
              if (index === wordParts.length - 1) {
                currentLine = part;
              } else {
                lines.push(part);
              }
            });
          } else {
            const testLine = currentLine ? `${currentLine} ${word}` : word;
            const testWidth = doc.getTextWidth(testLine);
            if (testWidth > maxWidth) {
              if (currentLine) {
                lines.push(currentLine);
              }
              currentLine = word;
            } else {
              currentLine = testLine;
            }
          }
        });

        if (currentLine) {
          lines.push(currentLine);
        }

        return lines;
      };

      // Title Page
      addPageDecoration();

      // Title
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(32);
      doc.setTextColor(128, 90, 150);
      const titleText = t('pdf.title', language);
      const titleWidth = doc.getTextWidth(titleText);
      doc.text(titleText, (pageWidth - titleWidth) / 2, 80);

      // Player name with larger, fun font
      doc.setFontSize(40);
      doc.setTextColor(200, 100, 150);
      const nameWidth = doc.getTextWidth(playerName);
      doc.text(playerName, (pageWidth - nameWidth) / 2, 100);

      // Decorative stars
      doc.setFontSize(24);
      doc.setTextColor(255, 200, 100);
      doc.text('✨ 🌟 ✨', pageWidth / 2 - 20, 120);

      // Story book subtitle
      doc.setFont('helvetica', 'italic');
      doc.setFontSize(16);
      doc.setTextColor(100, 100, 100);
      const subtitleText = t('pdf.subtitle', language);
      const subtitleWidth = doc.getTextWidth(subtitleText);
      doc.text(subtitleText, (pageWidth - subtitleWidth) / 2, 140);

      // Total pages info
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(12);
      doc.setTextColor(150, 150, 150);
      const pagesInfo = t('pdf.scenesCount', language, { count: history.length });
      const pagesInfoWidth = doc.getTextWidth(pagesInfo);
      doc.text(pagesInfo, (pageWidth - pagesInfoWidth) / 2, 155);

      // Get image data - images are now base64 data URLs from the server
      const imageDataArray = history.map((beat) => (beat.imageUrl ? getImageDataUrl(beat.imageUrl) : null));

      // Story pages
      for (let index = 0; index < history.length; index++) {
        const beat = history[index];
        const imageData = imageDataArray[index];
        doc.addPage();
        addPageDecoration();

        let yPosition = PAGE_TOP_POSITION;

        // Scene number header
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(14);
        doc.setTextColor(180, 100, 180);
        const sceneLabel = t('pdf.sceneLabel', language, { index: index + 1 });
        doc.text(sceneLabel, PDF_MARGIN, yPosition);
        yPosition += 10;

        // Decorative line under scene number
        doc.setDrawColor(220, 180, 240);
        doc.setLineWidth(0.5);
        doc.line(PDF_MARGIN, yPosition, pageWidth - PDF_MARGIN, yPosition);
        yPosition += 15;

        // Add image if available
        if (imageData) {
          // Calculate image dimensions to fit within content width with a fixed height
          const imageWidth = contentWidth;
          const imageHeight = IMAGE_HEIGHT;

          // Check if we need a new page for the image
          if (yPosition + imageHeight > pageHeight - BOTTOM_MARGIN_FOR_CONTENT) {
            doc.addPage();
            addPageDecoration();
            yPosition = PAGE_TOP_POSITION;
          }

          // Extract image format from data URL (e.g., "data:image/png;base64,..." -> "PNG")
          // Default to JPEG if format cannot be determined
          let imageFormat = 'JPEG';
          const formatMatch = imageData.match(/^data:image\/(\w+);/);
          if (formatMatch) {
            imageFormat = formatMatch[1].toUpperCase();
          }

          doc.addImage(imageData, imageFormat, PDF_MARGIN, yPosition, imageWidth, imageHeight);
          yPosition += imageHeight + IMAGE_MARGIN_BOTTOM;
        }

        // Story text - wrapped nicely
        doc.setFont('helvetica', 'normal');
        doc.setFontSize(14);
        doc.setTextColor(60, 60, 80);

        const storyLines = wrapText(beat.storyText, contentWidth, 14);
        const lineHeight = 7;

        storyLines.forEach((line) => {
          // Check if we need a new page
          if (yPosition > pageHeight - BOTTOM_MARGIN_FOR_CONTENT) {
            doc.addPage();
            addPageDecoration();
            yPosition = PAGE_TOP_POSITION;
          }
          doc.text(line, PDF_MARGIN, yPosition);
          yPosition += lineHeight;
        });

        // If the player made a choice, show it
        if (beat.selected) {
          yPosition += 10;

          // Check if we need a new page
          if (yPosition > pageHeight - BOTTOM_MARGIN_FOR_CHOICE) {
            doc.addPage();
            addPageDecoration();
            yPosition = PAGE_TOP_POSITION;
          }

          // Choice box
          doc.setFillColor(245, 240, 250);
          doc.roundedRect(PDF_MARGIN, yPosition - 5, contentWidth, 20, 3, 3, 'F');

          doc.setFont('helvetica', 'italic');
          doc.setFontSize(12);
          doc.setTextColor(128, 90, 150);
          const choiceLabel = t('pdf.choiceLabel', language);
          doc.text(choiceLabel + beat.selected, PDF_MARGIN + 5, yPosition + 7);
        }

        // Page number at bottom
        doc.setFont('helvetica', 'normal');
        doc.setFontSize(10);
        doc.setTextColor(180, 180, 180);
        const pageNum = `${index + 2}`; // +2 because title page is 1
        const pageNumWidth = doc.getTextWidth(pageNum);
        doc.text(pageNum, (pageWidth - pageNumWidth) / 2, pageHeight - 15);
      }

      // End page - "The End"
      doc.addPage();
      addPageDecoration();

      doc.setFont('helvetica', 'bold');
      doc.setFontSize(36);
      doc.setTextColor(200, 100, 150);
      const endText = t('pdf.endText', language);
      const endTextWidth = doc.getTextWidth(endText);
      doc.text(endText, (pageWidth - endTextWidth) / 2, 100);

      // Decorative elements
      doc.setFontSize(28);
      doc.text('🎉 ✨ 🌟 ✨ 🎉', pageWidth / 2 - 35, 120);

      // Congratulations message
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(14);
      doc.setTextColor(100, 100, 120);
      const congratsText = t('pdf.congratsText', language);
      const congratsWidth = doc.getTextWidth(congratsText);
      doc.text(congratsText, (pageWidth - congratsWidth) / 2, 145);

      // Player name credit
      doc.setFont('helvetica', 'italic');
      doc.setFontSize(16);
      doc.setTextColor(180, 100, 180);
      const creditText = t('pdf.creditText', language, { name: playerName });
      const creditWidth = doc.getTextWidth(creditText);
      doc.text(creditText, (pageWidth - creditWidth) / 2, 165);

      // Save the PDF
      const fileName =
        language === 'th'
          ? `การผจญภัยของ-${playerName}.pdf`
          : language === 'singlish'
            ? `${playerName}s-Shiok-Adventure.pdf`
            : `${playerName}'s-Adventure.pdf`;
      doc.save(fileName);
    } catch (error) {
      console.error('Failed to generate PDF:', error);
      setExportError(t('pdf.errorText', language));
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className='w-full'>
      <Button
        onClick={generatePdf}
        disabled={isExporting || history.length === 0}
        variant='gradient'
        gradientColors='from-green-400 to-teal-400 hover:from-green-500 hover:to-teal-500'
        fullWidth
        className='py-4 text-lg'
      >
        {isExporting ? t('pdf.creatingButton', language) : t('pdf.downloadButton', language)}
      </Button>
      {exportError && <p className='mt-2 text-center text-sm text-red-500'>{exportError}</p>}
    </div>
  );
}
