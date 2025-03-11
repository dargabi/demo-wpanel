import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Box,
  Typography,
  Grid,
  Paper,
  Button,
  TextField,
  InputAdornment,
  IconButton,
  Tabs,
  Tab,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  Chip,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
  Tooltip,
  CircularProgress,
  Dialog,
  DialogContent
} from '@mui/material';
import {
  Search as SearchIcon,
  FilterList as FilterListIcon,
  Add as AddIcon,
  PictureAsPdf as PdfIcon,
  Send as SendIcon,
  MoreVert as MoreVertIcon,
  Download as DownloadIcon,
  Delete as DeleteIcon,
  Edit as EditIcon,
  Print as PrintIcon,
  Visibility as VisibilityIcon
} from '@mui/icons-material';
import { fetchReports, exportReportPdf } from '../../redux/slices/reportsSlice';
import { openModal, setDeleteDialog } from '../../redux/slices/uiSlice';
import ReportViewer from '../../components/reports/ReportViewer';

/**
 * Reports page component that displays all pest control reports
 * @returns {JSX.Element} Reports page
 */
const Reports = () => {
  const dispatch = useDispatch();
  const { reports, loading, error } = useSelector((state) => state.reports);
  
  // Local state
  const [searchTerm, setSearchTerm] = useState('');
  const [tabValue, setTabValue] = useState(0);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedReportId, setSelectedReportId] = useState(null);
  const [viewReportDialogOpen, setViewReportDialogOpen] = useState(false);
  
  // Fetch reports on component mount
  useEffect(() => {
    dispatch(fetchReports());
  }, [dispatch]);
  
  // Handle tab change
  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };
  
  // Handle search
  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
    setPage(0);
  };
  
  // Handle page change
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };
  
  // Handle rows per page change
  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };
  
  // Handle menu open
  const handleMenuOpen = (event, reportId) => {
    setAnchorEl(event.currentTarget);
    setSelectedReportId(reportId);
  };
  
  // Handle menu close
  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedReportId(null);
  };
  
  // Handle create new report
  const handleCreateReport = () => {
    dispatch(openModal('createReport'));
  };
  
  // Handle edit report
  const handleEditReport = () => {
    handleMenuClose();
    dispatch(openModal('editReport'));
  };
  
  // Handle view report
  const handleViewReport = () => {
    handleMenuClose();
    setViewReportDialogOpen(true);
  };
  
  // Handle download report
  const handleDownloadReport = () => {
    handleMenuClose();
    dispatch(exportReportPdf(selectedReportId));
  };
  
  // Handle send report
  const handleSendReport = () => {
    handleMenuClose();
    // Implementation for sending a report
    console.log('Send report:', selectedReportId);
  };
  
  // Handle print report
  const handlePrintReport = () => {
    handleMenuClose();
    // Implementation for printing a report
    console.log('Print report:', selectedReportId);
  };
  
  // Handle delete report
  const handleDeleteReport = () => {
    handleMenuClose();
    dispatch(setDeleteDialog({
      id: selectedReportId,
      type: 'report',
      open: true
    }));
  };

  // Handle closing report viewer dialog
  const handleCloseReportViewer = () => {
    setViewReportDialogOpen(false);
    setSelectedReportId(null);
  };

  // Handle row click to view report
  const handleRowClick = (reportId) => {
    setSelectedReportId(reportId);
    setViewReportDialogOpen(true);
  };
  
  // Filter reports based on search term and tab selection
  const filteredReports = reports.filter(report => {
    const matchesSearch = 
      report.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      report.clientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (report.type && report.type.toLowerCase().includes(searchTerm.toLowerCase()));
    
    if (tabValue === 0) return matchesSearch; // All
    if (tabValue === 1) return matchesSearch && report.status === 'pending'; // Pending
    if (tabValue === 2) return matchesSearch && report.status === 'scheduled'; // Scheduled
    if (tabValue === 3) return matchesSearch && report.status === 'completed'; // Completed
    return matchesSearch;
  });
  
  // Paginate reports
  const paginatedReports = filteredReports.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  // Format date
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', { 
      day: '2-digit', 
      month: '2-digit', 
      year: 'numeric' 
    });
  };
  
  // Get status chip color
  const getStatusColor = (status) => {
    switch(status) {
      case 'completed':
        return 'success';
      case 'scheduled':
        return 'info';
      case 'pending':
        return 'warning';
      default:
        return 'default';
    }
  };

  // Get status text in Spanish
  const getStatusText = (status) => {
    switch(status) {
      case 'completed':
        return 'Completado';
      case 'scheduled':
        return 'Programado';
      case 'pending':
        return 'Pendiente';
      default:
        return 'Desconocido';
    }
  };

  // Get report type text in Spanish
  const getReportTypeText = (type) => {
    if (!type) return '';
    switch(type) {
      case 'monthly':
        return 'Mensual';
      case 'quarterly':
        return 'Trimestral';
      case 'bimonthly':
        return 'Bimestral';
      case 'emergency':
        return 'Emergencia';
      case 'proposal':
        return 'Propuesta';
      case 'scheduled':
        return 'Programado';
      default:
        return type.charAt(0).toUpperCase() + type.slice(1);
    }
  };
  
  return (
    <Box sx={{ p: 3 }}>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
            <Typography variant="h4" component="h1">
              Informes
            </Typography>
            <Button 
              variant="contained" 
              startIcon={<AddIcon />}
              onClick={handleCreateReport}
            >
              Nuevo Informe
            </Button>
          </Box>
        </Grid>
        
        <Grid item xs={12}>
          <Paper sx={{ p: 2 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <TextField
                variant="outlined"
                size="small"
                placeholder="Buscar informes..."
                value={searchTerm}
                onChange={handleSearch}
                fullWidth
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon />
                    </InputAdornment>
                  ),
                }}
                sx={{ maxWidth: 500, mr: 2 }}
              />
              <IconButton>
                <FilterListIcon />
              </IconButton>
            </Box>
            
            <Tabs 
              value={tabValue} 
              onChange={handleTabChange}
              indicatorColor="primary"
              textColor="primary"
              sx={{ borderBottom: 1, borderColor: 'divider', mb: 2 }}
            >
              <Tab label="Todos" />
              <Tab label="Pendientes" />
              <Tab label="Programados" />
              <Tab label="Completados" />
            </Tabs>
            
            {loading ? (
              <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
                <CircularProgress />
              </Box>
            ) : (
              <>
                <TableContainer>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell>Título</TableCell>
                        <TableCell>Cliente</TableCell>
                        <TableCell>Tipo</TableCell>
                        <TableCell>Fecha</TableCell>
                        <TableCell>Técnico</TableCell>
                        <TableCell>Estado</TableCell>
                        <TableCell align="right">Acciones</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {paginatedReports.map((report) => (
                        <TableRow 
                          key={report.id}
                          hover
                          onClick={() => handleRowClick(report.id)}
                          sx={{ 
                            cursor: 'pointer',
                            '&:last-child td, &:last-child th': { border: 0 }
                          }}
                        >
                          <TableCell component="th" scope="row">
                            {report.title}
                          </TableCell>
                          <TableCell>{report.clientName}</TableCell>
                          <TableCell>{getReportTypeText(report.type)}</TableCell>
                          <TableCell>{formatDate(report.date)}</TableCell>
                          <TableCell>{report.technicianName}</TableCell>
                          <TableCell>
                            <Chip 
                              label={getStatusText(report.status)} 
                              color={getStatusColor(report.status)}
                              size="small"
                            />
                          </TableCell>
                          <TableCell align="right">
                            <IconButton 
                              size="small"
                              onClick={(event) => {
                                event.stopPropagation();
                                handleMenuOpen(event, report.id);
                              }}
                            >
                              <MoreVertIcon />
                            </IconButton>
                          </TableCell>
                        </TableRow>
                      ))}
                      {paginatedReports.length === 0 && (
                        <TableRow>
                          <TableCell colSpan={7} align="center" sx={{ py: 3 }}>
                            <Typography variant="body1" color="text.secondary">
                              No se encontraron informes
                            </Typography>
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </TableContainer>
                
                <TablePagination
                  component="div"
                  count={filteredReports.length}
                  page={page}
                  onPageChange={handleChangePage}
                  rowsPerPage={rowsPerPage}
                  onRowsPerPageChange={handleChangeRowsPerPage}
                  labelRowsPerPage="Filas por página:"
                  labelDisplayedRows={({ from, to, count }) => 
                    `${from}-${to} de ${count}`
                  }
                />
              </>
            )}
          </Paper>
        </Grid>
      </Grid>
      
      {/* Menu de acciones */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
      >
        <MenuItem onClick={handleViewReport}>
          <ListItemIcon>
            <VisibilityIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>Ver informe</ListItemText>
        </MenuItem>
        <MenuItem onClick={handleEditReport}>
          <ListItemIcon>
            <EditIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>Editar</ListItemText>
        </MenuItem>
        <MenuItem onClick={handleDownloadReport}>
          <ListItemIcon>
            <DownloadIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>Descargar</ListItemText>
        </MenuItem>
        <MenuItem onClick={handlePrintReport}>
          <ListItemIcon>
            <PrintIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>Imprimir</ListItemText>
        </MenuItem>
        <MenuItem onClick={handleSendReport}>
          <ListItemIcon>
            <SendIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>Enviar por email</ListItemText>
        </MenuItem>
        <MenuItem onClick={handleDeleteReport}>
          <ListItemIcon>
            <DeleteIcon fontSize="small" color="error" />
          </ListItemIcon>
          <ListItemText>Eliminar</ListItemText>
        </MenuItem>
      </Menu>

      {/* Diálogo para visualizar informe */}
      <Dialog
        open={viewReportDialogOpen}
        onClose={handleCloseReportViewer}
        fullWidth
        maxWidth="lg"
      >
        <DialogContent sx={{ p: 0 }}>
          <ReportViewer reportId={selectedReportId} onClose={handleCloseReportViewer} />
        </DialogContent>
      </Dialog>
    </Box>
  );
};

export default Reports;
