'use client';

import { useState } from 'react';
import { jsPDF } from 'jspdf';
import { StoryBeat, Language } from '@/types';
import Button from '../common/Button';

interface ExportPdfButtonProps {
  history: StoryBeat[];
  playerName: string;
  language: Language;
}

export default function ExportPdfButton({
  history,
  playerName,
  language,
}: ExportPdfButtonProps) {
  const [isExporting, setIsExporting] = useState(false);

  const generatePdf = async () => {
    setIsExporting(true);

    try {
      // Create a new PDF document with A4 size in portrait mode
      const doc = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4',
      });

      const pageWidth = doc.internal.pageSize.getWidth();
      const pageHeight = doc.internal.pageSize.getHeight();
      const margin = 20;
      const contentWidth = pageWidth - 2 * margin;

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

      // Helper function to wrap text
      const wrapText = (text: string, maxWidth: number, fontSize: number): string[] => {
        doc.setFontSize(fontSize);
        const words = text.split(' ');
        const lines: string[] = [];
        let currentLine = '';

        words.forEach((word) => {
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
      const titleText = language === 'th' ? 'การผจญภัยของ' : 'The Adventure of';
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
      const subtitleText = language === 'th' 
        ? 'หนังสือนิทานส่วนตัว' 
        : 'A Personal Story Book';
      const subtitleWidth = doc.getTextWidth(subtitleText);
      doc.text(subtitleText, (pageWidth - subtitleWidth) / 2, 140);

      // Total pages info
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(12);
      doc.setTextColor(150, 150, 150);
      const pagesInfo = language === 'th' 
        ? `${history.length} ฉาก` 
        : `${history.length} Scenes`;
      const pagesInfoWidth = doc.getTextWidth(pagesInfo);
      doc.text(pagesInfo, (pageWidth - pagesInfoWidth) / 2, 155);

      // Story pages
      history.forEach((beat, index) => {
        doc.addPage();
        addPageDecoration();

        let yPosition = 30;

        // Scene number header
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(14);
        doc.setTextColor(180, 100, 180);
        const sceneLabel = language === 'th' 
          ? `ฉากที่ ${index + 1}` 
          : `Scene ${index + 1}`;
        doc.text(sceneLabel, margin, yPosition);
        yPosition += 10;

        // Decorative line under scene number
        doc.setDrawColor(220, 180, 240);
        doc.setLineWidth(0.5);
        doc.line(margin, yPosition, pageWidth - margin, yPosition);
        yPosition += 15;

        // Story text - wrapped nicely
        doc.setFont('helvetica', 'normal');
        doc.setFontSize(14);
        doc.setTextColor(60, 60, 80);
        
        const storyLines = wrapText(beat.storyText, contentWidth, 14);
        const lineHeight = 7;

        storyLines.forEach((line) => {
          // Check if we need a new page
          if (yPosition > pageHeight - 50) {
            doc.addPage();
            addPageDecoration();
            yPosition = 30;
          }
          doc.text(line, margin, yPosition);
          yPosition += lineHeight;
        });

        // If the player made a choice, show it
        if (beat.selected) {
          yPosition += 10;

          // Check if we need a new page
          if (yPosition > pageHeight - 40) {
            doc.addPage();
            addPageDecoration();
            yPosition = 30;
          }

          // Choice box
          doc.setFillColor(245, 240, 250);
          doc.roundedRect(margin, yPosition - 5, contentWidth, 20, 3, 3, 'F');

          doc.setFont('helvetica', 'italic');
          doc.setFontSize(12);
          doc.setTextColor(128, 90, 150);
          const choiceLabel = language === 'th' ? 'คุณเลือก: ' : 'You chose: ';
          doc.text(choiceLabel + beat.selected, margin + 5, yPosition + 7);
        }

        // Page number at bottom
        doc.setFont('helvetica', 'normal');
        doc.setFontSize(10);
        doc.setTextColor(180, 180, 180);
        const pageNum = `${index + 2}`; // +2 because title page is 1
        const pageNumWidth = doc.getTextWidth(pageNum);
        doc.text(pageNum, (pageWidth - pageNumWidth) / 2, pageHeight - 15);
      });

      // End page - "The End"
      doc.addPage();
      addPageDecoration();

      doc.setFont('helvetica', 'bold');
      doc.setFontSize(36);
      doc.setTextColor(200, 100, 150);
      const endText = language === 'th' ? 'จบ' : 'The End';
      const endTextWidth = doc.getTextWidth(endText);
      doc.text(endText, (pageWidth - endTextWidth) / 2, 100);

      // Decorative elements
      doc.setFontSize(28);
      doc.text('🎉 ✨ 🌟 ✨ 🎉', pageWidth / 2 - 35, 120);

      // Congratulations message
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(14);
      doc.setTextColor(100, 100, 120);
      const congratsText = language === 'th'
        ? 'ขอบคุณที่ร่วมผจญภัยไปด้วยกัน!'
        : 'Thank you for joining the adventure!';
      const congratsWidth = doc.getTextWidth(congratsText);
      doc.text(congratsText, (pageWidth - congratsWidth) / 2, 145);

      // Player name credit
      doc.setFont('helvetica', 'italic');
      doc.setFontSize(16);
      doc.setTextColor(180, 100, 180);
      const creditText = language === 'th'
        ? `สร้างสรรค์โดย ${playerName}`
        : `Created by ${playerName}`;
      const creditWidth = doc.getTextWidth(creditText);
      doc.text(creditText, (pageWidth - creditWidth) / 2, 165);

      // Save the PDF
      const fileName = language === 'th'
        ? `การผจญภัยของ-${playerName}.pdf`
        : `${playerName}s-Adventure.pdf`;
      doc.save(fileName);

    } catch (error) {
      console.error('Failed to generate PDF:', error);
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <Button
      onClick={generatePdf}
      disabled={isExporting || history.length === 0}
      variant='gradient'
      gradientColors='from-green-400 to-teal-400 hover:from-green-500 hover:to-teal-500'
      fullWidth
      className='py-4 text-lg'
    >
      {isExporting
        ? (language === 'th' ? '⏳ กำลังสร้าง PDF...' : '⏳ Creating PDF...')
        : (language === 'th' ? '📥 ดาวน์โหลดหนังสือเรื่องราว (PDF)' : '📥 Download Story Book (PDF)')}
    </Button>
  );
}
