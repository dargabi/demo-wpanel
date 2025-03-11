import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {
  Box,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  Button,
  Typography,
  TextField,
  InputAdornment,
  IconButton,
  Chip,
  Tooltip,
  Card,
  CardContent,
  Grid,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControl,
  InputLabel,
  Select,
  MenuItem
} from '@mui/material';
import {
  Search as SearchIcon,
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  FilterList as FilterIcon,
  Clear as ClearIcon,
  Visibility as ViewIcon
} from '@mui/icons-material';
import { fetchClients, setSearchTerm, setPageSize, setCurrentPage, setFilters } from '../../redux/slices/clientsSlice';
import { setDeleteDialog, openModal } from '../../redux/slices/uiSlice';
import ClientFormDialog from '../../components/clients/ClientFormDialog';
import DeleteConfirmDialog from '../../components/common/DeleteConfirmDialog';

/**
 * Clients management page component
 * @returns {JSX.Element} Clients list with search, filter and CRUD operations
 */
const Clients = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { 
    clients, 
    totalClients, 
    loading, 
    error, 
    currentPage, 
    pageSize, 
    searchTerm,
    filters
  } = useSelector((state) => state.clients);
  
  // Local state for filter dialog
  const [filterDialogOpen, setFilterDialogOpen] = useState(false);
  const [localFilters, setLocalFilters] = useState({
    status: '',
    type: '',
    location: '',
    serviceDate: ''
  });
  
  // Fetch clients on component mount and when dependencies change
  useEffect(() => {
    dispatch(fetchClients({
      page: currentPage,
      limit: pageSize,
      search: searchTerm,
      filters
    }));
  }, [dispatch, currentPage, pageSize, searchTerm, filters]);
  
  // Handle search change
  const handleSearchChange = (event) => {
    dispatch(setSearchTerm(event.target.value));
  };
  
  // Handle page change
  const handlePageChange = (event, newPage) => {
    dispatch(setCurrentPage(newPage + 1));
  };
  
  // Handle rows per page change
  const handleRowsPerPageChange = (event) => {
    dispatch(setPageSize(parseInt(event.target.value, 10)));
  };
  
  // Handle view client details
  const handleViewClient = (id) => {
    navigate(`/dashboard/clients/${id}`);
  };
  
  // Handle edit client
  const handleEditClient = (client) => {
    // Here you would dispatch an action to set the client to edit
    // and open the edit dialog
    console.log('Edit client:', client);
  };
  
  // Handle delete client
  const handleDeleteClient = (client) => {
    dispatch(setDeleteDialog({
      id: client.id,
      type: 'client'
    }));
  };
  
  // Handle add new client
  const handleAddClient = () => {
    dispatch(openModal('createClient'));
  };
  
  // Handle filter dialog open
  const handleFilterDialogOpen = () => {
    setLocalFilters(filters);
    setFilterDialogOpen(true);
  };
  
  // Handle filter dialog close
  const handleFilterDialogClose = () => {
    setFilterDialogOpen(false);
  };
  
  // Handle filter apply
  const handleFilterApply = () => {
    dispatch(setFilters(localFilters));
    setFilterDialogOpen(false);
  };
  
  // Handle filter reset
  const handleFilterReset = () => {
    setLocalFilters({
      status: '',
      type: '',
      location: '',
      serviceDate: ''
    });
    dispatch(setFilters({}));
    setFilterDialogOpen(false);
  };
  
  // Handle local filter change
  const handleFilterChange = (event) => {
    setLocalFilters({
      ...localFilters,
      [event.target.name]: event.target.value
    });
  };
  
  // Calculate if any filters are active
  const hasActiveFilters = Object.values(filters).some(value => value !== '' && value !== null && value !== undefined);
  
  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Gestión de Clientes
        </Typography>
        
        <Button
          variant="contained"
          color="primary"
          startIcon={<AddIcon />}
          onClick={handleAddClient}
        >
          Nuevo Cliente
        </Button>
      </Box>
      
      {/* Search and Filter Card */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                variant="outlined"
                placeholder="Buscar clientes por nombre, email, teléfono..."
                value={searchTerm}
                onChange={handleSearchChange}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon />
                    </InputAdornment>
                  ),
                  endAdornment: searchTerm && (
                    <InputAdornment position="end">
                      <IconButton
                        size="small"
                        onClick={() => dispatch(setSearchTerm(''))}
                      >
                        <ClearIcon />
                      </IconButton>
                    </InputAdornment>
                  )
                }}
              />
            </Grid>
            <Grid item xs={12} md={6} sx={{ display: 'flex', justifyContent: 'flex-end' }}>
              <Button
                variant={hasActiveFilters ? "contained" : "outlined"}
                color={hasActiveFilters ? "primary" : "inherit"}
                startIcon={<FilterIcon />}
                onClick={handleFilterDialogOpen}
                sx={{ ml: 1 }}
              >
                Filtros
                {hasActiveFilters && (
                  <Chip 
                    label={Object.values(filters).filter(Boolean).length} 
                    size="small" 
                    color="error" 
                    sx={{ ml: 1 }} 
                  />
                )}
              </Button>
            </Grid>
          </Grid>
        </CardContent>
      </Card>
      
      {/* Clients Table */}
      <TableContainer component={Paper} sx={{ mb: 3 }}>
        <Table sx={{ minWidth: 650 }} aria-label="clients table">
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Nombre</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Teléfono</TableCell>
              <TableCell>Dirección</TableCell>
              <TableCell>Tipo</TableCell>
              <TableCell>Estado</TableCell>
              <TableCell align="right">Acciones</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={8} align="center">
                  Cargando clientes...
                </TableCell>
              </TableRow>
            ) : clients.length === 0 ? (
              <TableRow>
                <TableCell colSpan={8} align="center">
                  No se encontraron clientes
                </TableCell>
              </TableRow>
            ) : (
              clients.map((client) => (
                <TableRow key={client.id} hover>
                  <TableCell>{client.id}</TableCell>
                  <TableCell>{client.name}</TableCell>
                  <TableCell>{client.email}</TableCell>
                  <TableCell>{client.phone}</TableCell>
                  <TableCell>{client.address}</TableCell>
                  <TableCell>
                    <Chip 
                      label={client.type === 'business' ? 'Empresa' : 'Particular'} 
                      color={client.type === 'business' ? 'info' : 'secondary'} 
                      size="small" 
                    />
                  </TableCell>
                  <TableCell>
                    <Chip 
                      label={
                        client.status === 'active' ? 'Activo' : 
                        client.status === 'inactive' ? 'Inactivo' : 
                        client.status === 'pending' ? 'Pendiente' : 'Otro'
                      } 
                      color={
                        client.status === 'active' ? 'success' : 
                        client.status === 'inactive' ? 'error' : 
                        client.status === 'pending' ? 'warning' : 'default'
                      } 
                      size="small" 
                    />
                  </TableCell>
                  <TableCell align="right">
                    <Tooltip title="Ver detalles">
                      <IconButton color="info" onClick={() => handleViewClient(client.id)}>
                        <ViewIcon />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Editar">
                      <IconButton color="primary" onClick={() => handleEditClient(client)}>
                        <EditIcon />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Eliminar">
                      <IconButton color="error" onClick={() => handleDeleteClient(client)}>
                        <DeleteIcon />
                      </IconButton>
                    </Tooltip>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
        
        <TablePagination
          rowsPerPageOptions={[5, 10, 25, 50]}
          component="div"
          count={totalClients}
          rowsPerPage={pageSize}
          page={currentPage - 1}
          onPageChange={handlePageChange}
          onRowsPerPageChange={handleRowsPerPageChange}
          labelRowsPerPage="Filas por página:"
          labelDisplayedRows={({ from, to, count }) => `${from}-${to} de ${count}`}
        />
      </TableContainer>
      
      {/* Filter Dialog */}
      <Dialog open={filterDialogOpen} onClose={handleFilterDialogClose}>
        <DialogTitle>Filtrar Clientes</DialogTitle>
        <DialogContent>
          <Box sx={{ p: 1 }}>
            <Grid container spacing={2}>
              <Grid item xs={12} md={6}>
                <FormControl fullWidth sx={{ mt: 2 }}>
                  <InputLabel id="status-filter-label">Estado</InputLabel>
                  <Select
                    labelId="status-filter-label"
                    id="status-filter"
                    name="status"
                    value={localFilters.status}
                    label="Estado"
                    onChange={handleFilterChange}
                  >
                    <MenuItem value="">Todos</MenuItem>
                    <MenuItem value="active">Activo</MenuItem>
                    <MenuItem value="inactive">Inactivo</MenuItem>
                    <MenuItem value="pending">Pendiente</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} md={6}>
                <FormControl fullWidth sx={{ mt: 2 }}>
                  <InputLabel id="type-filter-label">Tipo</InputLabel>
                  <Select
                    labelId="type-filter-label"
                    id="type-filter"
                    name="type"
                    value={localFilters.type}
                    label="Tipo"
                    onChange={handleFilterChange}
                  >
                    <MenuItem value="">Todos</MenuItem>
                    <MenuItem value="business">Empresa</MenuItem>
                    <MenuItem value="individual">Particular</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Ubicación"
                  name="location"
                  value={localFilters.location}
                  onChange={handleFilterChange}
                  sx={{ mt: 1 }}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Fecha de Servicio"
                  name="serviceDate"
                  type="date"
                  value={localFilters.serviceDate}
                  onChange={handleFilterChange}
                  InputLabelProps={{
                    shrink: true,
                  }}
                  sx={{ mt: 1 }}
                />
              </Grid>
            </Grid>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleFilterReset} color="inherit">
            Resetear
          </Button>
          <Button onClick={handleFilterDialogClose} color="inherit">
            Cancelar
          </Button>
          <Button onClick={handleFilterApply} color="primary" variant="contained">
            Aplicar
          </Button>
        </DialogActions>
      </Dialog>
      
      {/* Client Form Dialog (for create/edit) */}
      <ClientFormDialog />
      
      {/* Delete Confirmation Dialog */}
      <DeleteConfirmDialog />
    </Box>
  );
};

export default Clients;
