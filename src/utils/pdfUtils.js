import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { generateReportHTML } from './reportTemplateGenerator';

/**
 * Convierte un elemento HTML a PDF usando html2canvas y jsPDF
 * @param {string} elementId - ID del elemento HTML a convertir
 * @param {string} filename - Nombre del archivo PDF
 * @param {Object} options - Opciones adicionales de configuración
 * @returns {Promise<Blob>} - Promise con el blob del PDF generado
 */
export const generatePdfFromElement = async (elementId, filename, options = {}) => {
  try {
    const element = document.getElementById(elementId);
    if (!element) {
      throw new Error(`No se encontró un elemento con ID: ${elementId}`);
    }

    // Configuración por defecto
    const defaultOptions = {
      scale: 2, // Mayor escala para mejor calidad
      useCORS: true, // Habilitar CORS para imágenes externas
      logging: false,
      letterRendering: true,
      allowTaint: false
    };

    // Mesclar opciones por defecto con las proporcionadas
    const canvasOptions = { ...defaultOptions, ...options };

    // Crear el canvas del elemento
    const canvas = await html2canvas(element, canvasOptions);
    const imgData = canvas.toDataURL('image/png');

    // Determinar la orientación basada en las dimensiones
    const orientation = canvas.width > canvas.height ? 'l' : 'p';
    
    // Crear instancia de PDF
    const pdf = new jsPDF(orientation, 'mm', 'a4');
    
    // Calcular las dimensiones para ajustar la imagen en la página
    const imgWidth = 210; // A4 width en mm
    const imgHeight = (canvas.height * imgWidth) / canvas.width;
    
    // Añadir imagen al PDF
    pdf.addImage(imgData, 'PNG', 0, 0, imgWidth, imgHeight);
    
    // Si la altura de la imagen excede la altura de una página A4,
    // dividir en múltiples páginas
    const pageHeight = orientation === 'p' ? 297 : 210; // A4 height en mm
    let heightLeft = imgHeight;
    let position = 0;
    
    while (heightLeft > pageHeight) {
      position -= pageHeight;
      pdf.addPage();
      pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;
    }
    
    // Generar el PDF como blob
    const pdfBlob = pdf.output('blob');
    return pdfBlob;
  } catch (error) {
    console.error('Error al generar PDF:', error);
    throw error;
  }
};

/**
 * Genera y descarga un PDF a partir de los datos de un informe
 * @param {Object} report - Datos del informe a generar
 * @returns {Promise<Blob>} - Promise con el blob del PDF generado
 */
export const generateReportPdf = async (report) => {
  try {
    // Generar el contenido HTML basado en la plantilla de example.txt
    const reportHtml = generateReportHTML(report);
    
    // Crear un contenedor temporal para el HTML
    const tempContainer = document.createElement('div');
    tempContainer.id = 'temp-pdf-container';
    tempContainer.innerHTML = reportHtml;
    tempContainer.style.position = 'absolute';
    tempContainer.style.left = '-9999px';
    document.body.appendChild(tempContainer);
    
    // Generar el PDF 
    const filename = `informe-${report.id || new Date().getTime()}.pdf`;
    const pdfBlob = await generatePdfFromElement('temp-pdf-container', filename);
    
    // Eliminar el contenedor temporal
    document.body.removeChild(tempContainer);
    
    // Crear un enlace para descargar el PDF
    const downloadLink = document.createElement('a');
    downloadLink.href = URL.createObjectURL(pdfBlob);
    downloadLink.download = filename;
    downloadLink.click();
    
    return pdfBlob;
  } catch (error) {
    console.error('Error al generar PDF del informe:', error);
    throw error;
  }
};

/**
 * Añade estilos para impresión a un elemento antes de imprimirlo
 * @param {HTMLElement} element - Elemento a imprimir
 */
const addPrintStyles = (element) => {
  // Guardar estilos originales
  const originalStyles = element.style.cssText;
  
  // Añadir clase de impresión
  element.classList.add('printable-content');
  
  // Añadir estilos de impresión
  const style = document.createElement('style');
  style.id = 'print-styles';
  style.innerHTML = `
    @media print {
      body * {
        visibility: hidden;
      }
      .printable-content, .printable-content * {
        visibility: visible;
      }
      .printable-content {
        position: absolute;
        left: 0;
        top: 0;
        width: 100%;
      }
    }
  `;
  document.head.appendChild(style);
  
  return () => {
    // Función para restaurar estilos originales
    element.style.cssText = originalStyles;
    element.classList.remove('printable-content');
    const printStyle = document.getElementById('print-styles');
    if (printStyle) {
      document.head.removeChild(printStyle);
    }
  };
};

/**
 * Imprime un informe
 * @param {Object} report - Datos del informe a imprimir
 */
export const printReport = async (report) => {
  try {
    // Generar el contenido HTML basado en la plantilla de example.txt
    const reportHtml = generateReportHTML(report);
    
    // Crear un iframe para imprimir
    const printIframe = document.createElement('iframe');
    printIframe.style.position = 'absolute';
    printIframe.style.left = '-9999px';
    printIframe.style.width = '0';
    printIframe.style.height = '0';
    document.body.appendChild(printIframe);
    
    // Cuando el iframe esté cargado, imprimir su contenido
    printIframe.onload = () => {
      // Escribe el HTML en el iframe
      printIframe.contentDocument.write(reportHtml);
      printIframe.contentDocument.close();
      
      // Esperar un momento para que se carguen los estilos y contenido
      setTimeout(() => {
        printIframe.contentWindow.print();
        
        // Eliminar el iframe después de imprimir
        setTimeout(() => {
          document.body.removeChild(printIframe);
        }, 1000);
      }, 500);
    };
    
  } catch (error) {
    console.error('Error al imprimir informe:', error);
    throw error;
  }
};
