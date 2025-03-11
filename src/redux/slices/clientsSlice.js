import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

// Datos de ejemplo para clientes
const mockClients = [
  {
    id: 1,
    name: 'Restaurante El Sabor',
    contactName: 'Miguel Ángel García',
    email: 'info@elsabor.com',
    phone: '+34 912 456 789',
    address: 'Calle Mayor 123, Madrid',
    postalCode: '28001',
    city: 'Madrid',
    type: 'business',
    category: 'restaurant',
    active: true,
    startDate: '2023-03-15T00:00:00.000Z',
    lastService: '2025-02-28T09:30:00.000Z',
    notes: 'Requiere tratamiento mensual para cocina y almacén',
    contractValue: 2400,
    createdAt: '2023-03-10T00:00:00.000Z',
    updatedAt: '2025-02-28T09:35:00.000Z'
  },
  {
    id: 2,
    name: 'Hotel Continental',
    contactName: 'Laura Martínez',
    email: 'gerencia@hotelcontinental.com',
    phone: '+34 913 789 123',
    address: 'Paseo de la Castellana 89, Madrid',
    postalCode: '28046',
    city: 'Madrid',
    type: 'business',
    category: 'hotel',
    active: true,
    startDate: '2023-05-20T00:00:00.000Z',
    lastService: '2025-03-05T10:15:00.000Z',
    notes: 'Tratamiento trimestral completo. Prioridad alta.',
    contractValue: 5800,
    createdAt: '2023-05-15T00:00:00.000Z',
    updatedAt: '2025-03-05T10:20:00.000Z'
  },
  {
    id: 3,
    name: 'Supermercado FreshMart',
    contactName: 'Carlos Rodríguez',
    email: 'operaciones@freshmart.es',
    phone: '+34 914 567 890',
    address: 'Avenida de Europa 45, Alcobendas',
    postalCode: '28108',
    city: 'Alcobendas',
    type: 'business',
    category: 'retail',
    active: true,
    startDate: '2024-01-10T00:00:00.000Z',
    lastService: '2025-03-01T08:00:00.000Z',
    notes: 'Tiene 3 ubicaciones. Esta es la principal.',
    contractValue: 3600,
    createdAt: '2024-01-05T00:00:00.000Z',
    updatedAt: '2025-03-01T08:10:00.000Z'
  },
  {
    id: 4,
    name: 'Colegio San José',
    contactName: 'Ana Fernández',
    email: 'administracion@colegiosanjose.edu',
    phone: '+34 916 345 678',
    address: 'Calle San José 78, Getafe',
    postalCode: '28901',
    city: 'Getafe',
    type: 'business',
    category: 'education',
    active: true,
    startDate: '2023-09-01T00:00:00.000Z',
    lastService: '2025-02-15T15:30:00.000Z',
    notes: 'Tratamiento bimestral. Solo en periodo no lectivo.',
    contractValue: 2900,
    createdAt: '2023-08-20T00:00:00.000Z',
    updatedAt: '2025-02-15T15:40:00.000Z'
  },
  {
    id: 5,
    name: 'Oficinas Centrales Corp',
    contactName: 'Javier Sánchez',
    email: 'mantenimiento@corp.com',
    phone: '+34 917 890 123',
    address: 'Plaza de la Independencia 5, Madrid',
    postalCode: '28004',
    city: 'Madrid',
    type: 'business',
    category: 'office',
    active: true,
    startDate: '2023-11-15T00:00:00.000Z',
    lastService: '2025-03-07T11:45:00.000Z',
    notes: 'Edificio de 10 plantas. Tratamiento completo mensual.',
    contractValue: 4200,
    createdAt: '2023-11-10T00:00:00.000Z',
    updatedAt: '2025-03-07T12:00:00.000Z'
  },
  {
    id: 6,
    name: 'Centro Comercial Plaza',
    contactName: 'María López',
    email: 'mantenimiento@ccplaza.es',
    phone: '+34 918 901 234',
    address: 'Avenida Principal 100, Leganés',
    postalCode: '28915',
    city: 'Leganés',
    type: 'business',
    category: 'retail',
    active: true,
    startDate: '2023-06-01T00:00:00.000Z',
    lastService: '2025-02-20T07:00:00.000Z',
    notes: 'Tratamiento en horario de cierre (22:00 - 06:00)',
    contractValue: 7500,
    createdAt: '2023-05-25T00:00:00.000Z',
    updatedAt: '2025-02-20T07:15:00.000Z'
  },
  {
    id: 7,
    name: 'Guardería Pequeños Pasos',
    contactName: 'Elena Martín',
    email: 'direccion@pequenospasos.edu',
    phone: '+34 914 789 012',
    address: 'Calle de la Infancia 12, Madrid',
    postalCode: '28016',
    city: 'Madrid',
    type: 'business',
    category: 'education',
    active: true,
    startDate: '2024-02-01T00:00:00.000Z',
    lastService: '2025-03-02T16:00:00.000Z',
    notes: 'Productos especiales no tóxicos. Solo fines de semana.',
    contractValue: 1800,
    createdAt: '2024-01-25T00:00:00.000Z',
    updatedAt: '2025-03-02T16:10:00.000Z'
  },
  {
    id: 8,
    name: 'Residencia Tercera Edad',
    contactName: 'Pedro Gómez',
    email: 'administracion@residenciate.org',
    phone: '+34 916 234 567',
    address: 'Paseo de los Olmos 56, Pozuelo',
    postalCode: '28223',
    city: 'Pozuelo de Alarcón',
    type: 'business',
    category: 'healthcare',
    active: true,
    startDate: '2023-08-10T00:00:00.000Z',
    lastService: '2025-03-03T14:30:00.000Z',
    notes: 'Productos hipoalergénicos. Tratamiento mensual.',
    contractValue: 3100,
    createdAt: '2023-08-05T00:00:00.000Z',
    updatedAt: '2025-03-03T14:40:00.000Z'
  },
  {
    id: 9,
    name: 'Clínica Salud Total',
    contactName: 'Isabel Torres',
    email: 'gerencia@saludtotal.es',
    phone: '+34 913 678 901',
    address: 'Avenida de la Salud 34, Madrid',
    postalCode: '28033',
    city: 'Madrid',
    type: 'business',
    category: 'healthcare',
    active: true,
    startDate: '2023-10-05T00:00:00.000Z',
    lastService: '2025-02-25T20:00:00.000Z',
    notes: 'Atención protocolo especial para áreas quirúrgicas',
    contractValue: 4800,
    createdAt: '2023-10-01T00:00:00.000Z',
    updatedAt: '2025-02-25T20:15:00.000Z'
  },
  {
    id: 10,
    name: 'Centro Deportivo Fitness',
    contactName: 'Daniel Navarro',
    email: 'operaciones@centrofitness.com',
    phone: '+34 917 345 678',
    address: 'Calle del Deporte 78, Majadahonda',
    postalCode: '28220',
    city: 'Majadahonda',
    type: 'business',
    category: 'sports',
    active: false,
    startDate: '2023-07-15T00:00:00.000Z',
    lastService: '2025-01-15T18:00:00.000Z',
    notes: 'Contrato en pausa. Renovación pendiente.',
    contractValue: 2200,
    createdAt: '2023-07-10T00:00:00.000Z',
    updatedAt: '2025-01-15T18:10:00.000Z'
  }
];

/**
 * Async thunk for fetching all clients
 * Uses mock data instead of actual API calls
 */
export const fetchClients = createAsyncThunk(
  'clients/fetchClients',
  async ({ page = 1, limit = 10, search = '', filters = {} }, { rejectWithValue }) => {
    try {
      // Simulamos un retraso para simular la llamada a la API
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Filtramos los clientes según los criterios de búsqueda
      let filteredClients = [...mockClients];
      
      // Aplicar búsqueda por texto
      if (search) {
        const searchLower = search.toLowerCase();
        filteredClients = filteredClients.filter(client => 
          client.name.toLowerCase().includes(searchLower) ||
          client.contactName.toLowerCase().includes(searchLower) ||
          client.email.toLowerCase().includes(searchLower) ||
          client.city.toLowerCase().includes(searchLower)
        );
      }
      
      // Aplicar filtros adicionales
      if (Object.keys(filters).length > 0) {
        filteredClients = filteredClients.filter(client => {
          return Object.entries(filters).every(([key, value]) => {
            if (!value) return true; // Si no hay valor de filtro, no filtramos por este campo
            
            switch (key) {
              case 'active':
                return client.active.toString() === value.toString();
              case 'category':
                return client.category === value;
              case 'city':
                return client.city === value;
              default:
                return true;
            }
          });
        });
      }
      
      // Cálculo de paginación
      const totalCount = filteredClients.length;
      const totalPages = Math.ceil(totalCount / limit);
      
      // Obtener solo los clientes de la página actual
      const startIndex = (page - 1) * limit;
      const paginatedClients = filteredClients.slice(startIndex, startIndex + limit);
      
      return {
        clients: paginatedClients,
        totalCount,
        totalPages
      };
    } catch (error) {
      return rejectWithValue({ message: 'Failed to fetch clients' });
    }
  }
);

/**
 * Async thunk for fetching a single client
 * Uses mock data instead of actual API calls
 */
export const fetchClientById = createAsyncThunk(
  'clients/fetchClientById',
  async (id, { rejectWithValue }) => {
    try {
      // Simulamos un retraso para simular la llamada a la API
      await new Promise(resolve => setTimeout(resolve, 300));
      
      // Buscar el cliente por ID
      const client = mockClients.find(client => client.id === Number(id));
      
      if (!client) {
        return rejectWithValue({ message: 'Client not found' });
      }
      
      return client;
    } catch (error) {
      return rejectWithValue({ message: 'Failed to fetch client details' });
    }
  }
);

/**
 * Async thunk for creating a new client
 * Uses mock data instead of actual API calls
 */
export const createClient = createAsyncThunk(
  'clients/createClient',
  async (clientData, { rejectWithValue }) => {
    try {
      // Simulamos un retraso para simular la llamada a la API
      await new Promise(resolve => setTimeout(resolve, 800));
      
      // Crear un nuevo ID (simulando la generación de ID en el servidor)
      const newId = Math.max(...mockClients.map(client => client.id)) + 1;
      
      // Crear nuevo cliente con datos adicionales
      const newClient = {
        ...clientData,
        id: newId,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      
      // Añadir al array de clientes mock
      mockClients.unshift(newClient);
      
      return newClient;
    } catch (error) {
      return rejectWithValue({ message: 'Failed to create client' });
    }
  }
);

/**
 * Async thunk for updating a client
 * Uses mock data instead of actual API calls
 */
export const updateClient = createAsyncThunk(
  'clients/updateClient',
  async ({ id, data }, { rejectWithValue }) => {
    try {
      // Simulamos un retraso para simular la llamada a la API
      await new Promise(resolve => setTimeout(resolve, 600));
      
      // Buscar el cliente por ID
      const clientIndex = mockClients.findIndex(client => client.id === Number(id));
      
      if (clientIndex === -1) {
        return rejectWithValue({ message: 'Client not found' });
      }
      
      // Actualizar datos del cliente
      const updatedClient = {
        ...mockClients[clientIndex],
        ...data,
        id: Number(id), // Aseguramos que el ID permanece igual
        updatedAt: new Date().toISOString()
      };
      
      // Actualizar en el array mock
      mockClients[clientIndex] = updatedClient;
      
      return updatedClient;
    } catch (error) {
      return rejectWithValue({ message: 'Failed to update client' });
    }
  }
);

/**
 * Async thunk for deleting a client
 * Uses mock data instead of actual API calls
 */
export const deleteClient = createAsyncThunk(
  'clients/deleteClient',
  async (id, { rejectWithValue }) => {
    try {
      // Simulamos un retraso para simular la llamada a la API
      await new Promise(resolve => setTimeout(resolve, 400));
      
      // Buscar el cliente por ID
      const clientIndex = mockClients.findIndex(client => client.id === Number(id));
      
      if (clientIndex === -1) {
        return rejectWithValue({ message: 'Client not found' });
      }
      
      // Eliminar del array mock
      mockClients.splice(clientIndex, 1);
      
      return Number(id);
    } catch (error) {
      return rejectWithValue({ message: 'Failed to delete client' });
    }
  }
);

/**
 * Clients slice for managing client state
 */
const clientsSlice = createSlice({
  name: 'clients',
  initialState: {
    clients: mockClients.slice(0, 10), // Cargar los primeros 10 clientes inicialmente
    currentClient: null,
    totalClients: mockClients.length,
    totalPages: Math.ceil(mockClients.length / 10),
    loading: false,
    error: null,
    currentPage: 1,
    pageSize: 10,
    searchTerm: '',
    filters: {},
  },
  reducers: {
    setSearchTerm: (state, action) => {
      state.searchTerm = action.payload;
      state.currentPage = 1; // Reset to first page on new search
    },
    setPageSize: (state, action) => {
      state.pageSize = action.payload;
      state.currentPage = 1; // Reset to first page on page size change
    },
    setCurrentPage: (state, action) => {
      state.currentPage = action.payload;
    },
    setFilters: (state, action) => {
      state.filters = action.payload;
      state.currentPage = 1; // Reset to first page on filter change
    },
    clearClientSelection: (state) => {
      state.currentClient = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Handle fetchClients
      .addCase(fetchClients.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchClients.fulfilled, (state, action) => {
        state.loading = false;
        state.clients = action.payload.clients;
        state.totalClients = action.payload.totalCount;
        state.totalPages = action.payload.totalPages;
      })
      .addCase(fetchClients.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || 'An unknown error occurred';
      })
      
      // Handle fetchClientById
      .addCase(fetchClientById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchClientById.fulfilled, (state, action) => {
        state.loading = false;
        state.currentClient = action.payload;
      })
      .addCase(fetchClientById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || 'An unknown error occurred';
      })
      
      // Handle createClient
      .addCase(createClient.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createClient.fulfilled, (state, action) => {
        state.loading = false;
        state.clients.unshift(action.payload); // Add to beginning of array
        state.totalClients += 1;
      })
      .addCase(createClient.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || 'An unknown error occurred';
      })
      
      // Handle updateClient
      .addCase(updateClient.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateClient.fulfilled, (state, action) => {
        state.loading = false;
        // Update in clients array if present
        const index = state.clients.findIndex(client => client.id === action.payload.id);
        if (index !== -1) {
          state.clients[index] = action.payload;
        }
        // Update currentClient if it's the same
        if (state.currentClient?.id === action.payload.id) {
          state.currentClient = action.payload;
        }
      })
      .addCase(updateClient.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || 'An unknown error occurred';
      })
      
      // Handle deleteClient
      .addCase(deleteClient.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteClient.fulfilled, (state, action) => {
        state.loading = false;
        state.clients = state.clients.filter(client => client.id !== action.payload);
        state.totalClients -= 1;
        if (state.currentClient?.id === action.payload) {
          state.currentClient = null;
        }
      })
      .addCase(deleteClient.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || 'An unknown error occurred';
      });
  },
});

export const { setSearchTerm, setPageSize, setCurrentPage, setFilters, clearClientSelection } = clientsSlice.actions;

export default clientsSlice.reducer;
