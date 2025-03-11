import { useState, useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import PropTypes from 'prop-types';
import {
  Box,
  Button,
  Typography,
  Paper,
  Divider,
  Grid,
  Chip,
  CircularProgress,
  Alert,
  IconButton,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Avatar,
  Dialog,
  DialogContent,
  DialogActions,
  TextField,
  AppBar,
  Toolbar,
  Tooltip,
  Snackbar
} from '@mui/material';
import {
  Close as CloseIcon,
  PictureAsPdf as PdfIcon,
  Print as PrintIcon,
  Email as EmailIcon,
  Edit as EditIcon,
  Save as SaveIcon,
  Send as SendIcon,
  CheckCircle as CheckCircleIcon,
  Warning as WarningIcon,
  BugReport as BugReportIcon,
  Healing as HealingIcon,
  Recommend as RecommendIcon,
  CalendarMonth as CalendarIcon,
  Image as ImageIcon,
  PhotoCamera as CameraIcon
} from '@mui/icons-material';
import { fetchReportById } from '../../redux/slices/reportsSlice';
import { generateReportPdf, printReport } from '../../utils/pdfUtils';

/**
 * ReportViewer component
 * Displays a detailed view of a pest control report with options to print, export to PDF, and send via email
 * 
 * @param {Object} props - Component props
 * @param {number} props.reportId - ID of the report to view
 * @param {Function} props.onClose - Function to call when closing the report viewer
 * @returns {JSX.Element} ReportViewer component
 */
const ReportViewer = ({ reportId, onClose }) => {
  const dispatch = useDispatch();
  const { reports, selectedReport, loading, error } = useSelector((state) => state.reports);
  const [openEmailDialog, setOpenEmailDialog] = useState(false);
  const [emailData, setEmailData] = useState({
    to: '',
    subject: '',
    message: '',
  });
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'info',
  });
  const reportContentRef = useRef(null);

  // Obtener el informe del estado de Redux
  useEffect(() => {
    if (reportId) {
      dispatch(fetchReportById(reportId));
    }
  }, [dispatch, reportId]);

  // Manejar cierre del Snackbar
  const handleSnackbarClose = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  // Abrir diálogo de email
  const handleOpenEmailDialog = () => {
    setEmailData({
      to: selectedReport?.clientEmail || '',
      subject: `Informe de Control de Plagas - ${selectedReport?.title || 'Informe'}`,
      message: `Estimado/a ${selectedReport?.clientName},\n\nAdjunto encontrará el informe de control de plagas correspondiente a la visita realizada el ${new Date(selectedReport?.date).toLocaleDateString()}.\n\nSaludos cordiales,\nDaymax Pest Control`,
    });
    setOpenEmailDialog(true);
  };

  // Cerrar diálogo de email
  const handleCloseEmailDialog = () => {
    setOpenEmailDialog(false);
  };

  // Generar y descargar PDF
  const handleGeneratePDF = async () => {
    try {
      setSnackbar({
        open: true,
        message: 'Generando PDF...',
        severity: 'info',
      });

      await generateReportPdf(selectedReport);

      setSnackbar({
        open: true,
        message: 'PDF generado correctamente',
        severity: 'success',
      });
    } catch (error) {
      console.error('Error al generar PDF:', error);
      setSnackbar({
        open: true,
        message: `Error al generar PDF: ${error.message}`,
        severity: 'error',
      });
    }
  };

  // Imprimir informe
  const handlePrint = async () => {
    try {
      setSnackbar({
        open: true,
        message: 'Preparando documento para imprimir...',
        severity: 'info',
      });

      await printReport(selectedReport);

      setSnackbar({
        open: true,
        message: 'Documento enviado a la impresora',
        severity: 'success',
      });
    } catch (error) {
      console.error('Error al imprimir:', error);
      setSnackbar({
        open: true,
        message: `Error al imprimir: ${error.message}`,
        severity: 'error',
      });
    }
  };

  // Enviar email con PDF adjunto
  const handleSendEmail = async () => {
    try {
      setSnackbar({
        open: true,
        message: 'Generando PDF y enviando email...',
        severity: 'info',
      });

      // Generar PDF para adjuntar
      const pdfBlob = await generateReportPdf(selectedReport);

      // Aquí iría la lógica para enviar el email con el PDF adjunto
      // Esta es una simulación
      await new Promise(resolve => setTimeout(resolve, 1500));

      setSnackbar({
        open: true,
        message: `Email enviado correctamente a ${emailData.to}`,
        severity: 'success',
      });

      setOpenEmailDialog(false);
    } catch (error) {
      console.error('Error al enviar email:', error);
      setSnackbar({
        open: true,
        message: `Error al enviar email: ${error.message}`,
        severity: 'error',
      });
    }
  };

  // Render loading state
  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '400px' }}>
        <CircularProgress />
      </Box>
    );
  }

  // Render error state
  if (error) {
    return (
      <Box p={3}>
        <Alert severity="error">{error}</Alert>
        <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
          <Button onClick={onClose} variant="outlined">
            Cerrar
          </Button>
        </Box>
      </Box>
    );
  }

  // Render not found state
  if (!selectedReport) {
    return (
      <Box p={3}>
        <Alert severity="warning">No se ha encontrado el informe solicitado.</Alert>
        <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
          <Button onClick={onClose} variant="outlined">
            Cerrar
          </Button>
        </Box>
      </Box>
    );
  }

  return (
    <Box>
      {/* App Bar */}
      <AppBar position="static" color="default" elevation={0} className="non-printable">
        <Toolbar>
          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            {selectedReport.title}
          </Typography>
          <Tooltip title="Exportar a PDF">
            <IconButton 
              color="primary" 
              onClick={handleGeneratePDF}
            >
              <PdfIcon />
            </IconButton>
          </Tooltip>
          <Tooltip title="Imprimir">
            <IconButton color="primary" onClick={handlePrint}>
              <PrintIcon />
            </IconButton>
          </Tooltip>
          <Tooltip title="Enviar por Email">
            <IconButton color="primary" onClick={handleOpenEmailDialog}>
              <EmailIcon />
            </IconButton>
          </Tooltip>
          <IconButton edge="end" color="inherit" onClick={onClose} aria-label="cerrar">
            <CloseIcon />
          </IconButton>
        </Toolbar>
      </AppBar>

      {/* Report Content */}
      <Box p={3} id="report-content" className="printable-content" ref={reportContentRef}>
        {/* Report Header */}
        <Paper elevation={2} sx={{ p: 3, mb: 3 }}>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <Typography variant="h4" gutterBottom>
                {selectedReport.title}
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                <Chip 
                  label={selectedReport.type === 'monthly' ? 'Informe Mensual' : 'Informe Especial'} 
                  color="primary" 
                  size="small" 
                  sx={{ mr: 1 }}
                />
                <Chip 
                  label={
                    selectedReport.status === 'completed' ? 'Completado' : 
                    selectedReport.status === 'draft' ? 'Borrador' : 'En Proceso'
                  } 
                  color={
                    selectedReport.status === 'completed' ? 'success' : 
                    selectedReport.status === 'draft' ? 'default' : 'warning'
                  }
                  size="small" 
                />
              </Box>
              <Typography variant="body1" color="text.secondary" gutterBottom>
                <strong>Cliente:</strong> {selectedReport.clientName}
              </Typography>
              <Typography variant="body1" color="text.secondary" gutterBottom>
                <strong>Fecha:</strong> {new Date(selectedReport.date).toLocaleDateString()}
              </Typography>
              <Typography variant="body1" color="text.secondary" gutterBottom>
                <strong>Técnico:</strong> {selectedReport.technicianName}
              </Typography>
            </Grid>
            <Grid item xs={12} md={6} sx={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center' }}>
              <Box sx={{ textAlign: 'right' }}>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  <strong>Creado:</strong> {new Date(selectedReport.createdAt).toLocaleDateString()}
                </Typography>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  <strong>Última actualización:</strong> {new Date(selectedReport.updatedAt).toLocaleDateString()}
                </Typography>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  <strong>Próxima visita:</strong> {new Date(selectedReport.nextVisitDate).toLocaleDateString()}
                </Typography>
              </Box>
            </Grid>
          </Grid>
        </Paper>

        {/* Findings Section */}
        <Paper elevation={2} sx={{ p: 3, mb: 3 }}>
          <Typography variant="h5" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
            <BugReportIcon sx={{ mr: 1 }} color="warning" />
            Hallazgos
          </Typography>
          <Divider sx={{ mb: 2 }} />
          
          {selectedReport.findings && selectedReport.findings.length > 0 ? (
            <List>
              {selectedReport.findings.map((finding, index) => (
                <ListItem key={index} sx={{ py: 1 }}>
                  <ListItemIcon>
                    <Avatar sx={{ bgcolor: 'warning.main' }}>
                      <WarningIcon />
                    </Avatar>
                  </ListItemIcon>
                  <ListItemText
                    primary={finding}
                  />
                </ListItem>
              ))}
            </List>
          ) : (
            <Typography variant="body1" color="text.secondary">
              No se registraron hallazgos significativos durante la inspección.
            </Typography>
          )}
        </Paper>

        {/* Treatments Section */}
        <Paper elevation={2} sx={{ p: 3, mb: 3 }}>
          <Typography variant="h5" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
            <HealingIcon sx={{ mr: 1 }} color="primary" />
            Tratamientos Aplicados
          </Typography>
          <Divider sx={{ mb: 2 }} />
          
          {selectedReport.treatments && selectedReport.treatments.length > 0 ? (
            <List>
              {selectedReport.treatments.map((treatment, index) => (
                <ListItem key={index} sx={{ py: 1 }}>
                  <ListItemIcon>
                    <Avatar sx={{ bgcolor: 'primary.main' }}>
                      <CheckCircleIcon />
                    </Avatar>
                  </ListItemIcon>
                  <ListItemText
                    primary={treatment}
                  />
                </ListItem>
              ))}
            </List>
          ) : (
            <Typography variant="body1" color="text.secondary">
              No se aplicaron tratamientos durante esta visita.
            </Typography>
          )}
        </Paper>

        {/* Recommendations Section */}
        <Paper elevation={2} sx={{ p: 3, mb: 3 }}>
          <Typography variant="h5" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
            <RecommendIcon sx={{ mr: 1 }} color="success" />
            Recomendaciones
          </Typography>
          <Divider sx={{ mb: 2 }} />
          
          {selectedReport.recommendations && selectedReport.recommendations.length > 0 ? (
            <List>
              {selectedReport.recommendations.map((recommendation, index) => (
                <ListItem key={index} sx={{ py: 1 }}>
                  <ListItemIcon>
                    <Avatar sx={{ bgcolor: 'success.main' }}>
                      <CheckCircleIcon />
                    </Avatar>
                  </ListItemIcon>
                  <ListItemText
                    primary={recommendation}
                  />
                </ListItem>
              ))}
            </List>
          ) : (
            <Typography variant="body1" color="text.secondary">
              No hay recomendaciones adicionales para este período.
            </Typography>
          )}
        </Paper>

        {/* Next Visit Section */}
        <Paper elevation={2} sx={{ p: 3, mb: 3 }}>
          <Typography variant="h5" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
            <CalendarIcon sx={{ mr: 1 }} color="info" />
            Próxima Visita
          </Typography>
          <Divider sx={{ mb: 2 }} />
          
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Typography variant="body1" sx={{ mr: 1 }}>
              <strong>Fecha programada:</strong>
            </Typography>
            <Typography variant="body1">
              {new Date(selectedReport.nextVisitDate).toLocaleDateString()}
            </Typography>
          </Box>
          
          <Typography variant="body1" sx={{ mt: 2 }}>
            <strong>Servicios planificados:</strong>
          </Typography>
          <Typography variant="body1" color="text.secondary">
            {selectedReport.nextVisitPlannedServices || 'Inspección general y seguimiento de los tratamientos aplicados.'}
          </Typography>
        </Paper>

        {/* Images Section */}
        {selectedReport.images && selectedReport.images.length > 0 && (
          <Paper elevation={2} sx={{ p: 3, mb: 3 }}>
            <Typography variant="h5" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
              <ImageIcon sx={{ mr: 1 }} color="secondary" />
              Imágenes
            </Typography>
            <Divider sx={{ mb: 2 }} />
            
            <Grid container spacing={2}>
              {selectedReport.images.map((image, index) => (
                <Grid item xs={12} sm={6} md={4} key={index}>
                  <Paper 
                    elevation={1} 
                    sx={{ 
                      height: 200, 
                      display: 'flex', 
                      justifyContent: 'center', 
                      alignItems: 'center',
                      position: 'relative',
                      overflow: 'hidden'
                    }}
                  >
                    <Box 
                      component="img"
                      src={image.url || `/assets/images/${image}`} 
                      alt={image.description || `Imagen ${index + 1}`}
                      sx={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover',
                      }}
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = '/assets/images/placeholder.jpg';
                      }}
                    />
                    <Box 
                      sx={{ 
                        position: 'absolute', 
                        bottom: 0, 
                        left: 0, 
                        right: 0, 
                        bgcolor: 'rgba(0,0,0,0.6)',
                        color: 'white',
                        p: 1
                      }}
                    >
                      <Typography variant="body2" sx={{ textAlign: 'center' }}>
                        {image.description || `Imagen ${index + 1}`}
                      </Typography>
                    </Box>
                  </Paper>
                </Grid>
              ))}
            </Grid>
          </Paper>
        )}

        {/* Footer Section */}
        <Paper elevation={2} sx={{ p: 3, mb: 3 }}>
          <Box sx={{ textAlign: 'center' }}>
            <Typography variant="body2" color="text.secondary" gutterBottom>
              Daymax Pest Control - {new Date().getFullYear()}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              Este informe contiene información confidencial y está destinado únicamente para uso del cliente y la empresa.
            </Typography>
          </Box>
        </Paper>
      </Box>

      {/* Email Dialog */}
      <Dialog open={openEmailDialog} onClose={handleCloseEmailDialog} maxWidth="sm" fullWidth>
        <AppBar position="static" color="default" elevation={0}>
          <Toolbar>
            <Typography variant="h6" sx={{ flexGrow: 1 }}>
              Enviar Informe por Email
            </Typography>
            <IconButton edge="end" color="inherit" onClick={handleCloseEmailDialog} aria-label="cerrar">
              <CloseIcon />
            </IconButton>
          </Toolbar>
        </AppBar>
        <DialogContent>
          <TextField
            fullWidth
            margin="normal"
            label="Destinatario"
            name="to"
            value={emailData.to}
            onChange={(e) => setEmailData({ ...emailData, to: e.target.value })}
          />
          <TextField
            fullWidth
            margin="normal"
            label="Asunto"
            name="subject"
            value={emailData.subject}
            onChange={(e) => setEmailData({ ...emailData, subject: e.target.value })}
          />
          <TextField
            fullWidth
            multiline
            rows={5}
            margin="normal"
            label="Mensaje"
            name="message"
            value={emailData.message}
            onChange={(e) => setEmailData({ ...emailData, message: e.target.value })}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseEmailDialog} color="inherit">
            Cancelar
          </Button>
          <Button 
            onClick={handleSendEmail} 
            color="primary" 
            variant="contained" 
            startIcon={<SendIcon />}
          >
            Enviar
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar for notifications */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleSnackbarClose}
        message={snackbar.message}
        severity={snackbar.severity}
      />
    </Box>
  );
};

ReportViewer.propTypes = {
  reportId: PropTypes.number.isRequired,
  onClose: PropTypes.func.isRequired
};

export default ReportViewer;
