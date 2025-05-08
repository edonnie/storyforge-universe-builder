
import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';

export const exportAsImage = async (elementId: string, fileName: string): Promise<void> => {
  try {
    const element = document.getElementById(elementId);
    if (!element) {
      throw new Error('Element not found');
    }

    const canvas = await html2canvas(element, {
      scale: 2, // Higher scale for better quality
      backgroundColor: '#0a0a0a', // Dark background
      logging: false,
      useCORS: true, // Enable CORS for images
      allowTaint: true, // Allow cross-origin images
      scrollX: 0,
      scrollY: -window.scrollY, // Account for page scrolling
      windowWidth: document.documentElement.offsetWidth,
      windowHeight: document.documentElement.offsetHeight
    });

    const dataUrl = canvas.toDataURL('image/png');
    
    // Create a download link
    const link = document.createElement('a');
    link.href = dataUrl;
    link.download = `${fileName}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    return Promise.resolve();
  } catch (error) {
    console.error('Error exporting as image:', error);
    return Promise.reject(error);
  }
};

export const exportAsPDF = async (elementId: string, fileName: string): Promise<void> => {
  try {
    const element = document.getElementById(elementId);
    if (!element) {
      throw new Error('Element not found');
    }

    // Get the full height of the element
    const elementHeight = element.scrollHeight;
    const elementWidth = element.scrollWidth;
    
    const canvas = await html2canvas(element, {
      scale: 2,
      backgroundColor: '#0a0a0a',
      logging: false,
      useCORS: true, // Enable CORS for images
      allowTaint: true, // Allow cross-origin images
      height: elementHeight,
      width: elementWidth,
      scrollX: 0,
      scrollY: -window.scrollY, // Account for page scrolling
      windowWidth: document.documentElement.offsetWidth,
      windowHeight: document.documentElement.offsetHeight
    });

    const imgData = canvas.toDataURL('image/png');
    
    // Create PDF with appropriate dimensions
    const pdf = new jsPDF({
      orientation: elementWidth > elementHeight ? 'landscape' : 'portrait',
      unit: 'mm',
      format: 'a4'
    });
    
    // Get PDF dimensions (in mm)
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = pdf.internal.pageSize.getHeight();
    
    // Calculate scaling to fit the element
    const imgWidth = pdfWidth;
    const imgHeight = (canvas.height * imgWidth) / canvas.width;
    
    // Add the image to the PDF - if it's taller than a page, we'll need multiple pages
    let heightLeft = imgHeight;
    let position = 0;
    let pageNumber = 1;
    
    // First page
    pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
    heightLeft -= pdfHeight;
    
    // Add new pages if the content exceeds the height of the first page
    while (heightLeft > 0) {
      pageNumber++;
      position = -pdfHeight * (pageNumber - 1);
      pdf.addPage();
      pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
      heightLeft -= pdfHeight;
    }
    
    pdf.save(`${fileName}.pdf`);
    
    return Promise.resolve();
  } catch (error) {
    console.error('Error exporting as PDF:', error);
    return Promise.reject(error);
  }
};
