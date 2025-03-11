import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {
  Box,
  Grid,
  Paper,
  Typography,
  Button,
  Divider,
  Tabs,
  Tab,
  Card,
  CardContent,
  CardHeader,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Chip,
  Avatar,
  IconButton,
  Alert,
  CircularProgress
} from '@mui/material';
import {
  ArrowBack as ArrowBackIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Phone as PhoneIcon,
  Email as EmailIcon,
  LocationOn as LocationIcon,
  Business as BusinessIcon,
  PersonOutline as PersonIcon,
  Assignment as AssignmentIcon,
  EventNote as EventNoteIcon,
  CalendarToday as CalendarIcon
} from '@mui/icons-material';
import { fetchClientById, clearClientSelection } from '../../redux/slices/clientsSlice';
import { setDeleteDialog, openModal } from '../../redux/slices/uiSlice';
import ClientFormDialog from '../../components/clients/ClientFormDialog';
import DeleteConfirmDialog from '../../components/common/DeleteConfirmDialog';

/**
 * Client detail page component
 * Shows client information and related services, reports and history
 * @returns {JSX.Element} Client detail page
 */
const ClientDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { currentClient, loading, error } = useSelector((state) => state.clients);
  
  // Tab state
  const [tabValue, setTabValue] = useState(0);
  
  // Fetch client data on component mount
  useEffect(() => {
    dispatch(fetchClientById(id));
    
    // Clear selection on unmount
    return () => {
      dispatch(clearClientSelection());
    };
  }, [dispatch, id]);
  
  // Handle tab change
  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };
  
  // Handle back button click
  const handleGoBack = () => {
    navigate('/dashboard/clients');
  };
  
  // Handle edit client
  const handleEditClient = () => {
    dispatch(openModal('editClient'));
  };
  
  // Handle delete client
  const handleDeleteClient = () => {
    if (currentClient) {
      dispatch(setDeleteDialog({
        id: currentClient.id,
        type: 'client'
      }));
    }
  };
  
  // Mock service history data
  const mockServiceHistory = [
    {
      id: 1,
      serviceType: 'Fumigación completa',
      date: '2025-02-15',
      technician: 'Juan Pérez',
      status: 'completed',
      notes: 'Tratamiento preventivo realizado en todas las áreas.',
    },
    {
      id: 2,
      serviceType: 'Inspección de termitas',
      date: '2025-01-20',
      technician: 'María Gómez',
      status: 'completed',
      notes: 'No se detectaron signos de termitas.',
    },
    {
      id: 3,
      serviceType: 'Desratización',
      date: '2024-12-10',
      technician: 'Carlos Rodríguez',
      status: 'completed',
      notes: 'Se colocaron trampas en puntos críticos.',
    }
  ];
  
  // Mock reports data
  const mockReports = [
    {
      id: 1,
      title: 'Informe mensual - Febrero 2025',
      date: '2025-03-01',
      author: 'Juan Pérez',
      status: 'sent',
    },
    {
      id: 2,
      title: 'Informe mensual - Enero 2025',
      date: '2025-02-01',
      author: 'María Gómez',
      status: 'sent',
    },
    {
      id: 3,
      title: 'Informe anual 2024',
      date: '2025-01-15',
      author: 'Admin',
      status: 'sent',
    }
  ];
  
  // Mock upcoming services
  const mockUpcomingServices = [
    {
      id: 101,
      serviceType: 'Fumigación trimestral',
      date: '2025-05-15',
      technician: 'Juan Pérez',
      status: 'scheduled',
    },
    {
      id: 102,
      serviceType: 'Inspección de roedores',
      date: '2025-04-10',
      technician: 'Carlos Rodríguez',
      status: 'scheduled',
    }
  ];
  
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
      <Box>
        <Button
          startIcon={<ArrowBackIcon />}
          onClick={handleGoBack}
          sx={{ mb: 3 }}
        >
          Volver a clientes
        </Button>
        <Alert severity="error">
          {error}
        </Alert>
      </Box>
    );
  }
  
  // Render not found state
  if (!currentClient) {
    return (
      <Box>
        <Button
          startIcon={<ArrowBackIcon />}
          onClick={handleGoBack}
          sx={{ mb: 3 }}
        >
          Volver a clientes
        </Button>
        <Alert severity="warning">
          Cliente no encontrado
        </Alert>
      </Box>
    );
  }
  
  return (
    <Box>
      {/* Header with back button and actions */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Button
          startIcon={<ArrowBackIcon />}
          onClick={handleGoBack}
        >
          Volver a clientes
        </Button>
        
        <Box>
          <Button
            variant="outlined"
            color="primary"
            startIcon={<EditIcon />}
            onClick={handleEditClient}
            sx={{ mr: 1 }}
          >
            Editar
          </Button>
          <Button
            variant="outlined"
            color="error"
            startIcon={<DeleteIcon />}
            onClick={handleDeleteClient}
          >
            Eliminar
          </Button>
        </Box>
      </Box>
      
      {/* Client information card */}
      <Paper elevation={2} sx={{ mb: 3, p: 3, borderRadius: 2 }}>
        <Grid container spacing={3}>
          {/* Client avatar and basic info */}
          <Grid item xs={12} md={4}>
            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <Avatar
                sx={{ width: 100, height: 100, mb: 2, bgcolor: 'primary.main' }}
              >
                {currentClient.type === 'business' ? <BusinessIcon sx={{ fontSize: 60 }} /> : <PersonIcon sx={{ fontSize: 60 }} />}
              </Avatar>
              <Typography variant="h5" component="h1" align="center" gutterBottom>
                {currentClient.name}
              </Typography>
              <Chip 
                label={currentClient.type === 'business' ? 'Empresa' : 'Particular'} 
                color={currentClient.type === 'business' ? 'info' : 'secondary'} 
                sx={{ mb: 1 }}
              />
              <Chip 
                label={
                  currentClient.status === 'active' ? 'Activo' : 
                  currentClient.status === 'inactive' ? 'Inactivo' : 
                  currentClient.status === 'pending' ? 'Pendiente' : 'Otro'
                } 
                color={
                  currentClient.status === 'active' ? 'success' : 
                  currentClient.status === 'inactive' ? 'error' : 
                  currentClient.status === 'pending' ? 'warning' : 'default'
                }
              />
            </Box>
          </Grid>
          
          {/* Client contact details */}
          <Grid item xs={12} md={8}>
            <Typography variant="h6" gutterBottom>
              Información de contacto
            </Typography>
            <Divider sx={{ mb: 2 }} />
            
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <EmailIcon color="action" sx={{ mr: 1 }} />
                  <Typography variant="body1">
                    {currentClient.email}
                  </Typography>
                </Box>
                
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <PhoneIcon color="action" sx={{ mr: 1 }} />
                  <Typography variant="body1">
                    {currentClient.phone}
                  </Typography>
                </Box>
                
                <Box sx={{ display: 'flex', alignItems: 'flex-start', mb: 2 }}>
                  <LocationIcon color="action" sx={{ mr: 1, mt: 0.5 }} />
                  <Typography variant="body1">
                    {currentClient.address}
                  </Typography>
                </Box>
              </Grid>
              
              <Grid item xs={12} sm={6}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <PersonIcon color="action" sx={{ mr: 1 }} />
                  <Typography variant="body1">
                    {currentClient.contactPerson || 'No especificado'}
                  </Typography>
                </Box>
                
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <CalendarIcon color="action" sx={{ mr: 1 }} />
                  <Typography variant="body1">
                    Cliente desde: {new Date(currentClient.createdAt).toLocaleDateString()}
                  </Typography>
                </Box>
                
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <AssignmentIcon color="action" sx={{ mr: 1 }} />
                  <Typography variant="body1">
                    Servicios contratados: {currentClient.services?.length || 0}
                  </Typography>
                </Box>
              </Grid>
            </Grid>
            
            {/* Additional info */}
            <Typography variant="h6" gutterBottom sx={{ mt: 2 }}>
              Información adicional
            </Typography>
            <Divider sx={{ mb: 2 }} />
            <Typography variant="body1">
              {currentClient.notes || 'No hay notas adicionales para este cliente.'}
            </Typography>
          </Grid>
        </Grid>
      </Paper>
      
      {/* Tabs for services, reports, etc. */}
      <Paper elevation={2} sx={{ mb: 3, borderRadius: 2 }}>
        <Tabs
          value={tabValue}
          onChange={handleTabChange}
          variant="scrollable"
          scrollButtons="auto"
          sx={{ borderBottom: 1, borderColor: 'divider' }}
        >
          <Tab label="Historial de Servicios" />
          <Tab label="Servicios Programados" />
          <Tab label="Informes" />
          <Tab label="Pagos" />
        </Tabs>
        
        {/* Services History Tab */}
        <Box hidden={tabValue !== 0} sx={{ p: 3 }}>
          {mockServiceHistory.length === 0 ? (
            <Typography variant="body1" color="text.secondary" align="center">
              No hay historial de servicios para este cliente.
            </Typography>
          ) : (
            <List>
              {mockServiceHistory.map((service) => (
                <Paper key={service.id} elevation={1} sx={{ mb: 2, p: 0 }}>
                  <ListItem
                    secondaryAction={
                      <Chip 
                        label={service.status === 'completed' ? 'Completado' : 'Pendiente'} 
                        color={service.status === 'completed' ? 'success' : 'warning'} 
                        size="small" 
                      />
                    }
                  >
                    <ListItemIcon>
                      <Avatar sx={{ bgcolor: 'primary.main' }}>
                        <AssignmentIcon />
                      </Avatar>
                    </ListItemIcon>
                    <ListItemText
                      primary={service.serviceType}
                      secondary={
                        <>
                          <Typography component="span" variant="body2">
                            Fecha: {new Date(service.date).toLocaleDateString()} • Técnico: {service.technician}
                          </Typography>
                          <br />
                          <Typography component="span" variant="body2" color="text.secondary">
                            {service.notes}
                          </Typography>
                        </>
                      }
                    />
                  </ListItem>
                </Paper>
              ))}
            </List>
          )}
        </Box>
        
        {/* Upcoming Services Tab */}
        <Box hidden={tabValue !== 1} sx={{ p: 3 }}>
          {mockUpcomingServices.length === 0 ? (
            <Typography variant="body1" color="text.secondary" align="center">
              No hay servicios programados para este cliente.
            </Typography>
          ) : (
            <List>
              {mockUpcomingServices.map((service) => (
                <Paper key={service.id} elevation={1} sx={{ mb: 2, p: 0 }}>
                  <ListItem
                    secondaryAction={
                      <Chip 
                        label="Programado" 
                        color="info" 
                        size="small" 
                      />
                    }
                  >
                    <ListItemIcon>
                      <Avatar sx={{ bgcolor: 'info.main' }}>
                        <EventNoteIcon />
                      </Avatar>
                    </ListItemIcon>
                    <ListItemText
                      primary={service.serviceType}
                      secondary={
                        <>
                          <Typography component="span" variant="body2">
                            Fecha: {new Date(service.date).toLocaleDateString()} • Técnico: {service.technician}
                          </Typography>
                        </>
                      }
                    />
                  </ListItem>
                </Paper>
              ))}
            </List>
          )}
          
          <Box sx={{ mt: 2, display: 'flex', justifyContent: 'center' }}>
            <Button
              variant="contained"
              color="primary"
              startIcon={<EventNoteIcon />}
            >
              Programar Nuevo Servicio
            </Button>
          </Box>
        </Box>
        
        {/* Reports Tab */}
        <Box hidden={tabValue !== 2} sx={{ p: 3 }}>
          {mockReports.length === 0 ? (
            <Typography variant="body1" color="text.secondary" align="center">
              No hay informes para este cliente.
            </Typography>
          ) : (
            <List>
              {mockReports.map((report) => (
                <Paper key={report.id} elevation={1} sx={{ mb: 2, p: 0 }}>
                  <ListItem
                    secondaryAction={
                      <Box>
                        <IconButton color="primary">
                          <AssignmentIcon />
                        </IconButton>
                      </Box>
                    }
                  >
                    <ListItemIcon>
                      <Avatar sx={{ bgcolor: 'warning.main' }}>
                        <AssignmentIcon />
                      </Avatar>
                    </ListItemIcon>
                    <ListItemText
                      primary={report.title}
                      secondary={
                        <>
                          <Typography component="span" variant="body2">
                            Fecha: {new Date(report.date).toLocaleDateString()} • Autor: {report.author}
                          </Typography>
                          <br />
                          <Chip 
                            label={report.status === 'sent' ? 'Enviado' : 'Borrador'} 
                            color={report.status === 'sent' ? 'success' : 'warning'} 
                            size="small" 
                            sx={{ mt: 1 }}
                          />
                        </>
                      }
                    />
                  </ListItem>
                </Paper>
              ))}
            </List>
          )}
          
          <Box sx={{ mt: 2, display: 'flex', justifyContent: 'center' }}>
            <Button
              variant="contained"
              color="primary"
              startIcon={<AssignmentIcon />}
            >
              Generar Nuevo Informe
            </Button>
          </Box>
        </Box>
        
        {/* Payments Tab */}
        <Box hidden={tabValue !== 3} sx={{ p: 3 }}>
          <Typography variant="body1" color="text.secondary" align="center">
            Información de pagos no disponible.
          </Typography>
        </Box>
      </Paper>
      
      {/* Client Form Dialog (for edit) */}
      <ClientFormDialog />
      
      {/* Delete Confirmation Dialog */}
      <DeleteConfirmDialog />
    </Box>
  );
};

export default ClientDetail;
