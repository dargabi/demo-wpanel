/**
 * Genera un HTML para un informe de control de plagas basado en la plantilla example.txt
 * 
 * @param {Object} report - El informe a generar
 * @returns {string} - HTML generado para el informe
 */
export const generateReportHTML = (report) => {
  // Formatear la fecha
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', { 
      day: '2-digit', 
      month: '2-digit', 
      year: 'numeric' 
    });
  };

  // Formatear la fecha y hora actuales
  const currentDate = new Date().toLocaleDateString('es-ES', { 
    day: '2-digit', 
    month: '2-digit', 
    year: 'numeric' 
  });

  // Generar elementos de lista para hallazgos, tratamientos y recomendaciones
  const generateListItems = (items = []) => {
    return items.map(item => `<li>${item}</li>`).join('\n                ');
  };

  // Verificar si hay imágenes
  const hasImages = report.images && report.images.length > 0;
  const imageCount = hasImages ? report.images.length : 0;

  // Generar HTML basado en la plantilla example.txt
  return `<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Informe de Control de Plagas</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            line-height: 1.6;
            margin: 0;
            padding: 20px;
            color: #333;
        }
        .container {
            max-width: 800px;
            margin: 0 auto;
            border: 1px solid #ccc;
            padding: 30px;
            box-shadow: 0 0 10px rgba(0,0,0,0.1);
        }
        .header {
            text-align: center;
            margin-bottom: 30px;
            border-bottom: 2px solid #2a7d2e;
            padding-bottom: 10px;
        }
        .header h1 {
            color: #2a7d2e;
            margin-bottom: 5px;
        }
        .header p {
            color: #666;
            font-size: 16px;
        }
        .logo-placeholder {
            width: 150px;
            height: 80px;
            margin: 0 auto;
            background-color: #f5f5f5;
            display: flex;
            align-items: center;
            justify-content: center;
            margin-bottom: 15px;
            border: 1px dashed #ccc;
        }
        .client-info, .service-info {
            margin-bottom: 25px;
        }
        h2 {
            color: #2a7d2e;
            border-bottom: 1px solid #eee;
            padding-bottom: 5px;
        }
        table {
            width: 100%;
            border-collapse: collapse;
            margin-bottom: 20px;
        }
        table, th, td {
            border: 1px solid #ddd;
        }
        th, td {
            padding: 12px;
            text-align: left;
        }
        th {
            background-color: #f2f2f2;
        }
        .signature-section {
            display: flex;
            justify-content: space-between;
            margin-top: 50px;
        }
        .signature {
            width: 45%;
            text-align: center;
        }
        .signature-line {
            border-top: 1px solid #333;
            margin-top: 50px;
            padding-top: 10px;
        }
        .footer {
            margin-top: 50px;
            text-align: center;
            font-size: 12px;
            color: #666;
            border-top: 1px solid #eee;
            padding-top: 20px;
        }
        @media print {
            body {
                padding: 0;
            }
            .container {
                border: none;
                box-shadow: none;
                padding: 0;
            }
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>INFORME DE CONTROL DE PLAGAS</h1>
        </div>

        <div class="client-info">
            <h2>INFORMACIÓN DEL CLIENTE</h2>
            <table>
                <tr>
                    <th>Nombre</th>
                    <td>${report.clientName || 'N/A'}</td>
                </tr>
                <tr>
                    <th>Dirección</th>
                    <td>${report.clientAddress || 'N/A'}</td>
                </tr>
                <tr>
                    <th>Ciudad</th>
                    <td>${report.clientCity || 'N/A'}</td>
                </tr>
                <tr>
                    <th>Código Postal</th>
                    <td>${report.clientPostalCode || 'N/A'}</td>
                </tr>
                <tr>
                    <th>Contacto</th>
                    <td>${report.contactName || report.clientName || 'N/A'}</td>
                </tr>
                <tr>
                    <th>Teléfono</th>
                    <td>${report.clientPhone || 'N/A'}</td>
                </tr>
                <tr>
                    <th>Email</th>
                    <td>${report.clientEmail || 'N/A'}</td>
                </tr>
                <tr>
                    <th>ID Cliente</th>
                    <td>${report.clientId || 'N/A'}</td>
                </tr>
            </table>
        </div>

        <div class="service-info">
            <h2>INFORMACIÓN DEL SERVICIO</h2>
            <table>
                <tr>
                    <th>Tipo de Informe</th>
                    <td>${report.type === 'monthly' ? 'Mensual' : 
                       report.type === 'quarterly' ? 'Trimestral' : 
                       report.type === 'bimonthly' ? 'Bimestral' : 
                       report.type === 'emergency' ? 'Emergencia' : 
                       report.type || 'N/A'}</td>
                </tr>
                <tr>
                    <th>Fecha del Servicio</th>
                    <td>${formatDate(report.date)}</td>
                </tr>
                <tr>
                    <th>Técnico Responsable</th>
                    <td>${report.technicianName || 'N/A'}</td>
                </tr>
                <tr>
                    <th>ID del Informe</th>
                    <td>${report.id || 'N/A'}</td>
                </tr>
            </table>
        </div>

        <div class="pest-control-details">
            <h2>RESULTADOS DE LA INSPECCIÓN</h2>
            <ul>
                ${generateListItems(report.findings)}
                ${!report.findings || report.findings.length === 0 ? '<li>No se encontraron hallazgos significativos</li>' : ''}
            </ul>
        </div>

        <div class="pest-control-details">
            <h2>TRATAMIENTOS APLICADOS</h2>
            <ul>
                ${generateListItems(report.treatments)}
                ${!report.treatments || report.treatments.length === 0 ? '<li>No se aplicaron tratamientos</li>' : ''}
            </ul>
        </div>

        <div class="pest-control-details">
            <h2>RECOMENDACIONES</h2>
            <ul>
                ${generateListItems(report.recommendations)}
                ${!report.recommendations || report.recommendations.length === 0 ? '<li>No hay recomendaciones adicionales</li>' : ''}
            </ul>
        </div>

        <div class="next-visit">
            <h2>PRÓXIMA VISITA</h2>
            <p>Fecha Programada: ${formatDate(report.nextVisitDate)}</p>
        </div>

        <div class="observations">
            <h2>DOCUMENTACIÓN GRÁFICA</h2>
            ${hasImages ? 
              `<p>Se han incluido ${imageCount} imágenes en el registro digital.</p>` : 
              '<p>No se han incluido imágenes en este informe.</p>'}
        </div>

        <div class="observations">
            <h2>OBSERVACIONES ADICIONALES</h2>
            <p>${report.additionalNotes || 'No hay observaciones adicionales para este servicio.'}</p>
        </div>

        <div class="signature-section">
            <div class="signature">
                <div class="signature-line">Técnico</div>
                <p>${report.technicianName || 'N/A'}</p>
            </div>
            <div class="signature">
                <div class="signature-line">Cliente</div>
                <p>${report.clientName || 'N/A'}</p>
            </div>
        </div>

        <div class="footer">
            <p>Fecha: ${currentDate}</p>
            <p>Nota: Este informe ha sido generado automáticamente por el sistema de gestión Daymax Pest Control.</p>
            <p>La información contenida en este documento es confidencial y está destinada únicamente al cliente indicado.</p>
        </div>
    </div>
</body>
</html>`;
};
