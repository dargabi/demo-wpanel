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
  CircularProgress
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
import { fetchReports } from '../../redux/slices/reportsSlice';
import { openModal, setDeleteDialog } from '../../redux/slices/uiSlice';

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
    // Implementation for viewing a report
    console.log('View report:', selectedReportId);
  };
  
  // Handle download report
  const handleDownloadReport = () => {
    handleMenuClose();
    // Implementation for downloading a report
    console.log('Download report:', selectedReportId);
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
  
  // Filter reports based on search term and tab selection
  const filteredReports = reports.filter(report => {
    const matchesSearch = 
      report.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      report.clientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      report.serviceType.toLowerCase().includes(searchTerm.toLowerCase());
    
    if (tabValue === 0) return matchesSearch; // All
    if (tabValue === 1) return matchesSearch && report.status === 'draft'; // Drafts
    if (tabValue === 2) return matchesSearch && report.status === 'sent'; // Sent
    return matchesSearch;
  });
  
  // Paginate reports
  const paginatedReports = filteredReports.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );
  
  // Mock data for demonstration purposes
  const mockReports = [
    {
      id: 1,
      title: 'Informe mensual - Febrero 2025',
      clientName: 'Supermercados XYZ',
      serviceType: 'Fumigación general',
      date: '2025-03-01',
      status: 'sent',
      technician: 'Juan Pérez'
    },
    {
      id: 2,
      title: 'Informe de inspección - Oficinas ABC',
      clientName: 'Corporación ABC',
      serviceType: 'Inspección de roedores',
      date: '2025-02-25',
      status: 'draft',
      technician: 'María Gómez'
    },
    {
      id: 3,
      title: 'Tratamiento de termitas - Residencial Vista',
      clientName: 'Residencial Vista',
      serviceType: 'Control de termitas',
      date: '2025-02-20',
      status: 'sent',
      technician: 'Carlos Rodríguez'
    },
    {
      id: 4,
      title: 'Informe trimestral - Hotel Esplendor',
      clientName: 'Hotel Esplendor',
      serviceType: 'Servicio trimestral',
      date: '2025-02-15',
      status: 'draft',
      technician: 'Ana Martínez'
    },
    {
      id: 5,
      title: 'Control de plagas - Restaurante El Sabor',
      clientName: 'Restaurante El Sabor',
      serviceType: 'Control general de plagas',
      date: '2025-02-10',
      status: 'sent',
      technician: 'Juan Pérez'
    }
  ];
  
  return (
    <Box>
      {/* Header with title and actions */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" component="h1">
          Informes
        </Typography>
        
        <Button
          variant="contained"
          color="primary"
          startIcon={<AddIcon />}
          onClick={handleCreateReport}
        >
          Nuevo Informe
        </Button>
      </Box>
      
      {/* Search and filters */}
      <Paper elevation={2} sx={{ p: 2, mb: 3, borderRadius: 2 }}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              variant="outlined"
              placeholder="Buscar informes..."
              value={searchTerm}
              onChange={handleSearch}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon />
                  </InputAdornment>
                )
              }}
              size="small"
            />
          </Grid>
          
          <Grid item xs={12} sm={6}>
            <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
              <Button
                variant="outlined"
                startIcon={<FilterListIcon />}
                sx={{ mr: 1 }}
              >
                Filtros
              </Button>
              
              <Button
                variant="outlined"
                startIcon={<PdfIcon />}
              >
                Exportar
              </Button>
            </Box>
          </Grid>
        </Grid>
      </Paper>
      
      {/* Tabs */}
      <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 2 }}>
        <Tabs
          value={tabValue}
          onChange={handleTabChange}
          aria-label="reports tabs"
        >
          <Tab label="Todos" />
          <Tab label="Borradores" />
          <Tab label="Enviados" />
        </Tabs>
      </Box>
      
      {/* Reports table */}
      <Paper elevation={3} sx={{ borderRadius: 2, overflow: 'hidden' }}>
        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
            <CircularProgress />
          </Box>
        ) : error ? (
          <Box sx={{ p: 3 }}>
            <Typography color="error">{error}</Typography>
          </Box>
        ) : (
          <>
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Título</TableCell>
                    <TableCell>Cliente</TableCell>
                    <TableCell>Tipo de Servicio</TableCell>
                    <TableCell>Fecha</TableCell>
                    <TableCell>Técnico</TableCell>
                    <TableCell>Estado</TableCell>
                    <TableCell align="center">Acciones</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {mockReports.map((report) => (
                    <TableRow key={report.id} hover>
                      <TableCell>{report.title}</TableCell>
                      <TableCell>{report.clientName}</TableCell>
                      <TableCell>{report.serviceType}</TableCell>
                      <TableCell>{new Date(report.date).toLocaleDateString()}</TableCell>
                      <TableCell>{report.technician}</TableCell>
                      <TableCell>
                        <Chip
                          label={report.status === 'draft' ? 'Borrador' : 'Enviado'}
                          color={report.status === 'draft' ? 'warning' : 'success'}
                          size="small"
                        />
                      </TableCell>
                      <TableCell align="center">
                        <IconButton
                          size="small"
                          onClick={(e) => handleMenuOpen(e, report.id)}
                        >
                          <MoreVertIcon />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
            
            {/* Pagination */}
            <TablePagination
              rowsPerPageOptions={[5, 10, 25]}
              component="div"
              count={filteredReports.length}
              rowsPerPage={rowsPerPage}
              page={page}
              onPageChange={handleChangePage}
              onRowsPerPageChange={handleChangeRowsPerPage}
            />
          </>
        )}
      </Paper>
      
      {/* Actions menu */}
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
        <MenuItem onClick={handleDownloadReport}>
          <ListItemIcon>
            <DownloadIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>Descargar PDF</ListItemText>
        </MenuItem>
        <MenuItem onClick={handleSendReport}>
          <ListItemIcon>
            <SendIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>Enviar informe</ListItemText>
        </MenuItem>
        <MenuItem onClick={handlePrintReport}>
          <ListItemIcon>
            <PrintIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>Imprimir</ListItemText>
        </MenuItem>
        <MenuItem onClick={handleEditReport}>
          <ListItemIcon>
            <EditIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>Editar</ListItemText>
        </MenuItem>
        <MenuItem onClick={handleDeleteReport}>
          <ListItemIcon>
            <DeleteIcon fontSize="small" color="error" />
          </ListItemIcon>
          <ListItemText sx={{ color: 'error.main' }}>Eliminar</ListItemText>
        </MenuItem>
      </Menu>
    </Box>
  );
};

export default Reports;
