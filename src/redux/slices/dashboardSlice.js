import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

/**
 * Mock data for dashboard statistics
 */
const getMockDashboardStats = (timeFrame) => {
  // Adjust values based on the timeFrame to simulate different data periods
  const multiplier = {
    day: 0.2,
    week: 0.5,
    month: 1,
    quarter: 3,
    year: 12
  }[timeFrame] || 1;
  
  return {
    totalClients: Math.round(145 * (multiplier * 0.8 + 0.2)),
    activeServices: Math.round(42 * multiplier),
    completedServices: Math.round(128 * multiplier),
    pendingReports: Math.round(17 * multiplier),
    revenueThisMonth: Math.round(15800 * multiplier),
    revenueGrowth: 12.4 * (multiplier > 1 ? 0.8 : multiplier)
  };
};

/**
 * Async thunk for fetching dashboard statistics (using mock data)
 */
export const fetchDashboardStats = createAsyncThunk(
  'dashboard/fetchStats',
  async (timeFrame = 'month') => {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 500));
    return getMockDashboardStats(timeFrame);
  }
);

/**
 * Mock data for pest distribution
 */
const getMockPestDistribution = (timeFrame) => {
  // Base pest distribution
  const baseDistribution = [
    { name: 'Cucarachas', value: 35 },
    { name: 'Hormigas', value: 25 },
    { name: 'Ratas', value: 15 },
    { name: 'Termitas', value: 10 },
    { name: 'Otros', value: 15 }
  ];
  
  // Slightly randomize values based on timeFrame to simulate different periods
  return baseDistribution.map(item => ({
    ...item,
    value: Math.max(5, Math.round(item.value * (0.8 + Math.random() * 0.4)))
  }));
};

/**
 * Async thunk for fetching pest type distribution (using mock data)
 */
export const fetchPestDistribution = createAsyncThunk(
  'dashboard/fetchPestDistribution',
  async (timeFrame = 'month') => {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 700));
    return getMockPestDistribution(timeFrame);
  }
);

/**
 * Mock data for recent activities
 */
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
  },
  {
    id: 6,
    type: 'report',
    client: 'Centro Comercial Plaza',
    description: 'Informe de seguimiento generado',
    date: '2025-03-05T11:10:00Z',
    technician: 'Juan Pérez'
  },
  {
    id: 7,
    type: 'client',
    client: 'Guardería Pequeños Pasos',
    description: 'Contrato renovado',
    date: '2025-03-04T16:30:00Z',
    technician: 'Admin'
  },
  {
    id: 8,
    type: 'service',
    client: 'Residencia Tercera Edad',
    description: 'Control preventivo realizado',
    date: '2025-03-03T13:45:00Z',
    technician: 'María Gómez'
  }
];

/**
 * Async thunk for fetching recent activities (using mock data)
 */
export const fetchRecentActivities = createAsyncThunk(
  'dashboard/fetchRecentActivities',
  async (limit = 10) => {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 600));
    return mockRecentActivities.slice(0, limit);
  }
);

/**
 * Mock data for geographic distribution
 */
const getMockGeoDistribution = () => {
  // Datos de clientes con sus coordenadas geográficas precisas
  return [
    { id: 1, clientId: 1, name: 'Restaurante El Sabor', address: 'Calle Mayor 123, Madrid', lat: 40.416775, lng: -3.703790, category: 'restaurant' },
    { id: 2, clientId: 2, name: 'Hotel Continental', address: 'Paseo de la Castellana 89, Madrid', lat: 40.427852, lng: -3.688344, category: 'hotel' },
    { id: 3, clientId: 3, name: 'Supermercado FreshMart', address: 'Avenida de Europa 45, Alcobendas', lat: 40.533287, lng: -3.629414, category: 'retail' },
    { id: 4, clientId: 4, name: 'Colegio San José', address: 'Calle San José 78, Getafe', lat: 40.305378, lng: -3.736226, category: 'education' },
    { id: 5, clientId: 5, name: 'Oficinas Centrales Corp', address: 'Plaza de la Independencia 5, Madrid', lat: 40.420159, lng: -3.688344, category: 'office' },
    { id: 6, clientId: 6, name: 'Centro Comercial Plaza', address: 'Avenida Principal 100, Leganés', lat: 40.331436, lng: -3.763428, category: 'retail' },
    { id: 7, clientId: 7, name: 'Guardería Pequeños Pasos', address: 'Calle de la Infancia 12, Madrid', lat: 40.451357, lng: -3.677443, category: 'education' },
    { id: 8, clientId: 8, name: 'Residencia Tercera Edad', address: 'Paseo de los Olmos 56, Pozuelo', lat: 40.435698, lng: -3.813738, category: 'healthcare' },
    { id: 9, clientId: 9, name: 'Clínica Salud Total', address: 'Avenida de la Salud 34, Madrid', lat: 40.478525, lng: -3.702339, category: 'healthcare' },
    { id: 10, clientId: 10, name: 'Centro Deportivo Fitness', address: 'Calle del Deporte 78, Majadahonda', lat: 40.473396, lng: -3.872339, category: 'sports' },
    // Añadir más clientes para áreas fuera de Madrid
    { id: 11, clientId: 11, name: 'Restaurante Mar Azul', address: 'Paseo Marítimo 45, Barcelona', lat: 41.385064, lng: 2.173404, category: 'restaurant' },
    { id: 12, clientId: 12, name: 'Hotel Playa Dorada', address: 'Avenida del Mar 67, Valencia', lat: 39.469906, lng: -0.376288, category: 'hotel' },
    { id: 13, clientId: 13, name: 'Hipermercado MaxiCompra', address: 'Polígono Industrial Norte 12, Sevilla', lat: 37.389092, lng: -5.984459, category: 'retail' },
    { id: 14, clientId: 14, name: 'Universidad Nacional', address: 'Campus Universitario, Zaragoza', lat: 41.648823, lng: -0.889085, category: 'education' },
    { id: 15, clientId: 15, name: 'Resort Costa del Sol', address: 'Paseo Marítimo 23, Málaga', lat: 36.721261, lng: -4.421265, category: 'hotel' }
  ];
};

/**
 * Async thunk for fetching geographic distribution data (using mock data)
 */
export const fetchGeoDistribution = createAsyncThunk(
  'dashboard/fetchGeoDistribution',
  async (timeFrame = 'month') => {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 800));
    return getMockGeoDistribution();
  }
);

/**
 * Dashboard slice for managing dashboard state
 */
const dashboardSlice = createSlice({
  name: 'dashboard',
  initialState: {
    stats: {
      totalClients: 0,
      activeServices: 0,
      completedServices: 0,
      pendingReports: 0,
      revenueThisMonth: 0,
      revenueGrowth: 0
    },
    pestDistribution: [],
    recentActivities: [],
    geoDistribution: [],
    timeFrame: 'month',
    loading: false,
    error: null
  },
  reducers: {
    setTimeFrame: (state, action) => {
      state.timeFrame = action.payload;
    }
  },
  extraReducers: (builder) => {
    builder
      // Handle fetchDashboardStats
      .addCase(fetchDashboardStats.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchDashboardStats.fulfilled, (state, action) => {
        state.loading = false;
        state.stats = action.payload;
      })
      .addCase(fetchDashboardStats.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'An unknown error occurred';
        // Provide fallback data even on error for demo purposes
        state.stats = getMockDashboardStats('month');
      })

      // Handle fetchPestDistribution
      .addCase(fetchPestDistribution.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPestDistribution.fulfilled, (state, action) => {
        state.loading = false;
        state.pestDistribution = action.payload;
      })
      .addCase(fetchPestDistribution.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'An unknown error occurred';
        // Provide fallback data even on error for demo purposes
        state.pestDistribution = getMockPestDistribution('month');
      })

      // Handle fetchRecentActivities
      .addCase(fetchRecentActivities.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchRecentActivities.fulfilled, (state, action) => {
        state.loading = false;
        state.recentActivities = action.payload;
      })
      .addCase(fetchRecentActivities.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'An unknown error occurred';
        // Provide fallback data even on error for demo purposes
        state.recentActivities = mockRecentActivities.slice(0, 5);
      })

      // Handle fetchGeoDistribution
      .addCase(fetchGeoDistribution.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchGeoDistribution.fulfilled, (state, action) => {
        state.loading = false;
        state.geoDistribution = action.payload;
      })
      .addCase(fetchGeoDistribution.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'An unknown error occurred';
        // Provide fallback data even on error for demo purposes
        state.geoDistribution = getMockGeoDistribution();
      });
  }
});

export const { setTimeFrame } = dashboardSlice.actions;

export default dashboardSlice.reducer;
