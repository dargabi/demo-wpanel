import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Grid,
  Paper,
  Typography,
  Card,
  CardContent,
  CardHeader,
  Divider,
  FormControl,
  Select,
  MenuItem,
  InputLabel,
  CircularProgress,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  ListItemAvatar,
  Avatar,
  Tooltip as MuiTooltip
} from '@mui/material';
import {
  Business as BusinessIcon,
  Assignment as AssignmentIcon,
  BugReport as BugIcon,
  Event as EventIcon,
  Restaurant as RestaurantIcon,
  Hotel as HotelIcon,
  ShoppingCart as RetailIcon,
  School as EducationIcon,
  LocalHospital as HealthcareIcon,
  SportsSoccer as SportsIcon,
  Work as OfficeIcon
} from '@mui/icons-material';
import {
  BarChart,
  Bar,
  PieChart,
  Pie,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Cell
} from 'recharts';
import { MapContainer, TileLayer, Marker, Popup, CircleMarker } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { 
  fetchDashboardStats, 
  fetchPestDistribution, 
  fetchRecentActivities,
  fetchGeoDistribution,
  setTimeFrame
} from '../redux/slices/dashboardSlice';

// Mock data for demonstration (will be replaced by actual API calls)
const mockPestDistribution = [
  { name: 'Cucarachas', value: 35 },
  { name: 'Hormigas', value: 25 },
  { name: 'Ratas', value: 15 },
  { name: 'Termitas', value: 10 },
  { name: 'Otros', value: 15 }
];

const mockMonthlyTreatments = [
  { month: 'Ene', tratamientos: 65 },
  { month: 'Feb', tratamientos: 75 },
  { month: 'Mar', tratamientos: 110 },
  { month: 'Abr', tratamientos: 95 },
  { month: 'May', tratamientos: 80 },
  { month: 'Jun', tratamientos: 92 },
  { month: 'Jul', tratamientos: 115 },
  { month: 'Ago', tratamientos: 125 },
  { month: 'Sep', tratamientos: 130 },
  { month: 'Oct', tratamientos: 120 },
  { month: 'Nov', tratamientos: 105 },
  { month: 'Dic', tratamientos: 90 }
];

const mockRecentActivities = [
  {
    id: 1,
    type: 'service',
    client: 'Restaurante El Sabor',
    description: 'Tratamiento de desinsectación completado',
    date: '2025-03-10T12:30:00Z',
    technician: 'Juan Pérez'
  },
  {
    id: 2,
    type: 'report',
    client: 'Hotel Continental',
    description: 'Informe mensual enviado',
    date: '2025-03-09T15:45:00Z',
    technician: 'María Gómez'
  },
  {
    id: 3,
    type: 'client',
    client: 'Supermercado FreshMart',
    description: 'Nuevo cliente registrado',
    date: '2025-03-08T10:15:00Z',
    technician: 'Admin'
  },
  {
    id: 4,
    type: 'service',
    client: 'Colegio San José',
    description: 'Tratamiento de desratización programado',
    date: '2025-03-07T09:00:00Z',
    technician: 'Carlos Rodríguez'
  },
  {
    id: 5,
    type: 'service',
    client: 'Oficinas Centrales Corp',
    description: 'Inspección de termitas completada',
    date: '2025-03-06T14:20:00Z',
    technician: 'Ana Martínez'
  }
];

// Custom colors for charts
const COLORS = ['#2E7D32', '#4CAF50', '#81C784', '#C8E6C9', '#FF9800'];

/**
 * Dashboard component showing KPIs and visualizations for pest control business
 * @returns {JSX.Element} Dashboard with various charts and statistics
 */
const Dashboard = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { 
    stats, 
    pestDistribution, 
    timeFrame, 
    loading,
    recentActivities,
    geoDistribution
  } = useSelector((state) => state.dashboard);
  
  // State for map center
  const [mapCenter, setMapCenter] = useState([40.416775, -3.703790]); // Default to Madrid, Spain
  
  // Fetch dashboard data on component mount
  useEffect(() => {
    dispatch(fetchDashboardStats(timeFrame));
    dispatch(fetchPestDistribution(timeFrame));
    dispatch(fetchRecentActivities(5)); // Limit to 5 recent activities
    dispatch(fetchGeoDistribution(timeFrame));
  }, [dispatch, timeFrame]);
  
  // Handle time frame change
  const handleTimeFrameChange = (event) => {
    dispatch(setTimeFrame(event.target.value));
  };

  // Navegar a la ficha de un cliente
  const handleClientClick = (clientId) => {
    navigate(`/dashboard/clients/${clientId}`);
  };
  
  // Función para obtener el icono según la categoría del cliente
  const getCategoryIcon = (category) => {
    switch(category) {
      case 'restaurant':
        return <RestaurantIcon />;
      case 'hotel':
        return <HotelIcon />;
      case 'retail':
        return <RetailIcon />;
      case 'education':
        return <EducationIcon />;
      case 'healthcare':
        return <HealthcareIcon />;
      case 'sports':
        return <SportsIcon />;
      case 'office':
        return <OfficeIcon />;
      default:
        return <BusinessIcon />;
    }
  };

  // Función para obtener el color según la categoría del cliente
  const getCategoryColor = (category) => {
    const colors = {
      restaurant: '#E91E63', // Rosa
      hotel: '#9C27B0',      // Púrpura
      retail: '#3F51B5',     // Índigo
      education: '#03A9F4',  // Azul claro
      healthcare: '#4CAF50', // Verde
      sports: '#FF9800',     // Naranja
      office: '#795548'      // Marrón
    };
    return colors[category] || '#2E7D32'; // Verde oscuro por defecto
  };
  
  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Panel de Control
        </Typography>
        
        <FormControl sx={{ minWidth: 150 }}>
          <InputLabel id="time-frame-select-label">Período</InputLabel>
          <Select
            labelId="time-frame-select-label"
            id="time-frame-select"
            value={timeFrame}
            label="Período"
            onChange={handleTimeFrameChange}
          >
            <MenuItem value="day">Hoy</MenuItem>
            <MenuItem value="week">Esta Semana</MenuItem>
            <MenuItem value="month">Este Mes</MenuItem>
            <MenuItem value="quarter">Este Trimestre</MenuItem>
            <MenuItem value="year">Este Año</MenuItem>
          </Select>
        </FormControl>
      </Box>
      
      {/* KPI Cards */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={6} md={4}>
          <Paper
            elevation={2}
            sx={{
              p: 2,
              display: 'flex',
              flexDirection: 'column',
              borderRadius: 2,
              height: '100%',
              border: '1px solid rgba(0, 0, 0, 0.05)',
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
              <Avatar sx={{ bgcolor: 'primary.main', mr: 2 }}>
                <BusinessIcon />
              </Avatar>
              <Typography variant="h6" component="div">
                Clientes
              </Typography>
            </Box>
            <Typography variant="h4" component="div" fontWeight="bold">
              {loading ? <CircularProgress size={24} /> : stats.totalClients}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Total de clientes activos
            </Typography>
          </Paper>
        </Grid>
        
        <Grid item xs={12} sm={6} md={4}>
          <Paper
            elevation={2}
            sx={{
              p: 2,
              display: 'flex',
              flexDirection: 'column',
              borderRadius: 2,
              height: '100%',
              border: '1px solid rgba(0, 0, 0, 0.05)',
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
              <Avatar sx={{ bgcolor: 'success.main', mr: 2 }}>
                <AssignmentIcon />
              </Avatar>
              <Typography variant="h6" component="div">
                Servicios
              </Typography>
            </Box>
            <Typography variant="h4" component="div" fontWeight="bold">
              {loading ? <CircularProgress size={24} /> : stats.activeServices}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Servicios activos
            </Typography>
          </Paper>
        </Grid>
        
        <Grid item xs={12} sm={6} md={4}>
          <Paper
            elevation={2}
            sx={{
              p: 2,
              display: 'flex',
              flexDirection: 'column',
              borderRadius: 2,
              height: '100%',
              border: '1px solid rgba(0, 0, 0, 0.05)',
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
              <Avatar sx={{ bgcolor: 'warning.main', mr: 2 }}>
                <AssignmentIcon />
              </Avatar>
              <Typography variant="h6" component="div">
                Informes
              </Typography>
            </Box>
            <Typography variant="h4" component="div" fontWeight="bold">
              {loading ? <CircularProgress size={24} /> : stats.pendingReports}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Informes pendientes
            </Typography>
          </Paper>
        </Grid>
      </Grid>
      
      {/* Charts Row */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        {/* Monthly Treatments Chart */}
        <Grid item xs={12} md={8}>
          <Card elevation={2}>
            <CardHeader 
              title="Tratamientos Mensuales" 
              subheader="Evolución de servicios realizados"
            />
            <Divider />
            <CardContent sx={{ height: 300 }}>
              {loading ? (
                <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
                  <CircularProgress />
                </Box>
              ) : (
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart
                    data={mockMonthlyTreatments}
                    margin={{
                      top: 5,
                      right: 30,
                      left: 20,
                      bottom: 5,
                    }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line
                      type="monotone"
                      dataKey="tratamientos"
                      name="Tratamientos"
                      stroke="#4CAF50"
                      activeDot={{ r: 8 }}
                      strokeWidth={2}
                    />
                  </LineChart>
                </ResponsiveContainer>
              )}
            </CardContent>
          </Card>
        </Grid>
        
        {/* Pest Distribution Chart */}
        <Grid item xs={12} md={4}>
          <Card elevation={2}>
            <CardHeader 
              title="Distribución de Plagas" 
              subheader="Tipos de plagas tratadas"
            />
            <Divider />
            <CardContent sx={{ height: 300 }}>
              {loading ? (
                <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
                  <CircularProgress />
                </Box>
              ) : (
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={pestDistribution.length > 0 ? pestDistribution : mockPestDistribution}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {mockPestDistribution.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value) => `${value} casos`} />
                  </PieChart>
                </ResponsiveContainer>
              )}
            </CardContent>
          </Card>
        </Grid>
      </Grid>
      
      {/* Activity Feed and Map Row */}
      <Grid container spacing={3}>
        {/* Recent Activity Feed */}
        <Grid item xs={12} md={6}>
          <Card elevation={2}>
            <CardHeader 
              title="Actividad Reciente" 
              subheader="Últimas acciones realizadas"
            />
            <Divider />
            <CardContent sx={{ height: 350, overflow: 'auto' }}>
              {loading ? (
                <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
                  <CircularProgress />
                </Box>
              ) : (
                <List>
                  {(recentActivities.length > 0 ? recentActivities : mockRecentActivities).map((activity) => (
                    <ListItem key={activity.id} alignItems="flex-start" sx={{ py: 1.5 }}>
                      <ListItemAvatar>
                        <Avatar sx={{ bgcolor: activity.type === 'service' ? 'primary.main' : activity.type === 'report' ? 'warning.main' : 'info.main' }}>
                          {activity.type === 'service' ? <BugIcon /> : activity.type === 'report' ? <AssignmentIcon /> : <BusinessIcon />}
                        </Avatar>
                      </ListItemAvatar>
                      <ListItemText
                        primary={activity.client}
                        secondary={
                          <>
                            <Typography component="span" variant="body2" color="text.primary">
                              {activity.description}
                            </Typography>
                            {" — "}
                            <Typography component="span" variant="body2" color="text.secondary">
                              {new Date(activity.date).toLocaleString()} • {activity.technician}
                            </Typography>
                          </>
                        }
                      />
                    </ListItem>
                  ))}
                </List>
              )}
            </CardContent>
          </Card>
        </Grid>
        
        {/* Geographic Distribution Map */}
        <Grid item xs={12} md={6}>
          <Card elevation={2}>
            <CardHeader 
              title="Distribución Geográfica" 
              subheader="Ubicación de clientes en España"
            />
            <Divider />
            <CardContent sx={{ height: 350 }}>
              {loading ? (
                <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
                  <CircularProgress />
                </Box>
              ) : (
                <Box sx={{ height: '100%', width: '100%' }}>
                  {/* Mapa de España usando Leaflet */}
                  <div style={{ height: '100%', width: '100%' }}>
                    <MapContainer 
                      center={[40.416775, -3.703790]} 
                      zoom={5} 
                      style={{ height: '100%', width: '100%', borderRadius: '4px' }}
                    >
                      <TileLayer
                        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                      />
                      {geoDistribution.map((client) => (
                        <CircleMarker 
                          key={client.id}
                          center={[client.lat, client.lng]}
                          radius={8}
                          fillColor={getCategoryColor(client.category)}
                          color="#FFFFFF"
                          weight={2}
                          opacity={1}
                          fillOpacity={0.8}
                          eventHandlers={{
                            click: () => handleClientClick(client.clientId)
                          }}
                        >
                          <Popup>
                            <div style={{ padding: '5px' }}>
                              <div style={{ display: 'flex', alignItems: 'center', marginBottom: '8px' }}>
                                <Avatar sx={{ bgcolor: getCategoryColor(client.category), mr: 1, width: 24, height: 24 }}>
                                  {React.cloneElement(getCategoryIcon(client.category), { style: { fontSize: 16 } })}
                                </Avatar>
                                <Typography variant="subtitle2" component="span" sx={{ fontWeight: 'bold' }}>
                                  {client.name}
                                </Typography>
                              </div>
                              <Typography variant="body2" component="p" sx={{ mb: 1 }}>
                                {client.address}
                              </Typography>
                              <Typography 
                                variant="body2" 
                                component="p" 
                                color="primary" 
                                sx={{ 
                                  cursor: 'pointer',
                                  fontWeight: 'bold',
                                  '&:hover': { textDecoration: 'underline' }
                                }}
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleClientClick(client.clientId);
                                }}
                              >
                                Ver ficha completa →
                              </Typography>
                            </div>
                          </Popup>
                        </CircleMarker>
                      ))}
                    </MapContainer>
                  </div>
                </Box>
              )}
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Dashboard;
