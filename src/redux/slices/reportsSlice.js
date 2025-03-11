import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

// Datos de ejemplo para informes
const mockReports = [
  {
    id: 1,
    title: 'Informe Mensual - Restaurante El Sabor',
    type: 'monthly',
    clientId: 1,
    clientName: 'Restaurante El Sabor',
    date: '2025-02-28T10:00:00.000Z',
    technicianName: 'Manuel González',
    findings: ['Rastros de cucarachas en el área de almacenamiento', 'Signos de roedores cerca de la puerta trasera'],
    recommendations: ['Sellar grietas en paredes', 'Mejorar prácticas de almacenamiento de alimentos'],
    treatments: ['Fumigación general', 'Instalación de trampas para roedores'],
    nextVisitDate: '2025-03-28T10:00:00.000Z',
    status: 'completed',
    images: ['report1_img1.jpg', 'report1_img2.jpg'],
    signature: 'signature1.png',
    createdAt: '2025-02-28T11:30:00.000Z',
    updatedAt: '2025-02-28T11:30:00.000Z'
  },
  {
    id: 2,
    title: 'Informe Trimestral - Hotel Continental',
    type: 'quarterly',
    clientId: 2,
    clientName: 'Hotel Continental',
    date: '2025-03-05T11:00:00.000Z',
    technicianName: 'Sara Jiménez',
    findings: ['Sin rastros de plagas en habitaciones', 'Evidencia menor de insectos en cocina'],
    recommendations: ['Continuar con mantenimiento preventivo', 'Revisar sellado de ventanas'],
    treatments: ['Tratamiento preventivo en todas las áreas', 'Aplicación de insecticida en zona de cocina'],
    nextVisitDate: '2025-06-05T11:00:00.000Z',
    status: 'completed',
    images: ['report2_img1.jpg', 'report2_img2.jpg', 'report2_img3.jpg'],
    signature: 'signature2.png',
    createdAt: '2025-03-05T13:15:00.000Z',
    updatedAt: '2025-03-05T13:15:00.000Z'
  },
  {
    id: 3,
    title: 'Informe de Emergencia - Supermercado FreshMart',
    type: 'emergency',
    clientId: 3,
    clientName: 'Supermercado FreshMart',
    date: '2025-03-01T09:00:00.000Z',
    technicianName: 'Carlos Pérez',
    findings: ['Infestación moderada de roedores en el almacén', 'Posibles puntos de entrada identificados'],
    recommendations: ['Reparación inmediata de estructuras dañadas', 'Revisión diaria de trampas'],
    treatments: ['Colocación de trampas y cebos', 'Tratamiento intensivo en áreas afectadas'],
    nextVisitDate: '2025-03-08T09:00:00.000Z',
    status: 'completed',
    images: ['report3_img1.jpg', 'report3_img2.jpg'],
    signature: 'signature3.png',
    createdAt: '2025-03-01T12:45:00.000Z',
    updatedAt: '2025-03-01T12:45:00.000Z'
  },
  {
    id: 4,
    title: 'Informe Bimestral - Colegio San José',
    type: 'bimonthly',
    clientId: 4,
    clientName: 'Colegio San José',
    date: '2025-02-15T16:00:00.000Z',
    technicianName: 'Laura Martínez',
    findings: ['Sin evidencia de plagas', 'Condiciones sanitarias óptimas'],
    recommendations: ['Mantener actuales protocolos de limpieza', 'Revisar jardines periódicamente'],
    treatments: ['Aplicación preventiva en exteriores', 'Tratamiento en alcantarillado'],
    nextVisitDate: '2025-04-15T16:00:00.000Z',
    status: 'completed',
    images: ['report4_img1.jpg'],
    signature: 'signature4.png',
    createdAt: '2025-02-15T18:20:00.000Z',
    updatedAt: '2025-02-15T18:20:00.000Z'
  },
  {
    id: 5,
    title: 'Informe Mensual - Oficinas Centrales Corp',
    type: 'monthly',
    clientId: 5,
    clientName: 'Oficinas Centrales Corp',
    date: '2025-03-07T12:00:00.000Z',
    technicianName: 'Javier Ruiz',
    findings: ['Actividad mínima de insectos en planta baja', 'Resto de instalaciones sin incidencias'],
    recommendations: ['Reforzar control en zonas comunes', 'Revisar accesos exteriores'],
    treatments: ['Tratamiento localizado en planta baja', 'Fumigación preventiva general'],
    nextVisitDate: '2025-04-07T12:00:00.000Z',
    status: 'completed',
    images: ['report5_img1.jpg', 'report5_img2.jpg'],
    signature: 'signature5.png',
    createdAt: '2025-03-07T14:10:00.000Z',
    updatedAt: '2025-03-07T14:10:00.000Z'
  },
  {
    id: 6,
    title: 'Informe Mensual - Centro Comercial Plaza',
    type: 'monthly',
    clientId: 6,
    clientName: 'Centro Comercial Plaza',
    date: '2025-02-20T07:30:00.000Z',
    technicianName: 'Elena Gómez',
    findings: ['Evidencia de roedores en zona de carga', 'Actividad de insectos en food court'],
    recommendations: ['Incrementar frecuencia de limpieza en zona de restauración', 'Mejorar gestión de residuos'],
    treatments: ['Fumigación integral', 'Colocación de trampas adicionales'],
    nextVisitDate: '2025-03-20T07:30:00.000Z',
    status: 'completed',
    images: ['report6_img1.jpg', 'report6_img2.jpg', 'report6_img3.jpg'],
    signature: 'signature6.png',
    createdAt: '2025-02-20T09:45:00.000Z',
    updatedAt: '2025-02-20T09:45:00.000Z'
  },
  {
    id: 7,
    title: 'Informe Mensual - Guardería Pequeños Pasos',
    type: 'monthly',
    clientId: 7,
    clientName: 'Guardería Pequeños Pasos',
    date: '2025-03-02T17:00:00.000Z',
    technicianName: 'Miguel Ángel Sanz',
    findings: ['Sin evidencia de plagas', 'Instalaciones en excelente estado'],
    recommendations: ['Mantener protocolo actual', 'Revisar jardinera exterior regularmente'],
    treatments: ['Aplicación de productos naturales no tóxicos', 'Tratamiento preventivo en exteriores'],
    nextVisitDate: '2025-04-06T17:00:00.000Z',
    status: 'completed',
    images: ['report7_img1.jpg'],
    signature: 'signature7.png',
    createdAt: '2025-03-02T18:30:00.000Z',
    updatedAt: '2025-03-02T18:30:00.000Z'
  },
  {
    id: 8,
    title: 'Informe Mensual - Residencia Tercera Edad',
    type: 'monthly',
    clientId: 8,
    clientName: 'Residencia Tercera Edad',
    date: '2025-03-03T15:00:00.000Z',
    technicianName: 'Ana Hernández',
    findings: ['Actividad mínima de insectos en lavandería', 'Resto de instalaciones sin incidencias'],
    recommendations: ['Reforzar control en zona de lavandería', 'Mantener protocolos actuales en resto de áreas'],
    treatments: ['Aplicación de productos hipoalergénicos', 'Tratamiento focal en lavandería'],
    nextVisitDate: '2025-04-03T15:00:00.000Z',
    status: 'completed',
    images: ['report8_img1.jpg', 'report8_img2.jpg'],
    signature: 'signature8.png',
    createdAt: '2025-03-03T16:45:00.000Z',
    updatedAt: '2025-03-03T16:45:00.000Z'
  },
  {
    id: 9,
    title: 'Informe Mensual - Clínica Salud Total',
    type: 'monthly',
    clientId: 9,
    clientName: 'Clínica Salud Total',
    date: '2025-02-25T20:30:00.000Z',
    technicianName: 'Roberto Santos',
    findings: ['Sin evidencia de plagas en áreas críticas', 'Pequeña actividad de insectos en cafetería'],
    recommendations: ['Reforzar medidas en zona de cafetería', 'Mantener protocolos actuales en áreas médicas'],
    treatments: ['Tratamiento específico en cafetería', 'Aplicación preventiva general'],
    nextVisitDate: '2025-03-25T20:30:00.000Z',
    status: 'completed',
    images: ['report9_img1.jpg'],
    signature: 'signature9.png',
    createdAt: '2025-02-25T22:00:00.000Z',
    updatedAt: '2025-02-25T22:00:00.000Z'
  },
  {
    id: 10,
    title: 'Informe Programado - Centro Deportivo Fitness',
    type: 'scheduled',
    clientId: 10,
    clientName: 'Centro Deportivo Fitness',
    date: '2025-03-15T18:00:00.000Z',
    technicianName: 'Mario García',
    findings: [],
    recommendations: [],
    treatments: ['Inspección general', 'Evaluación de riesgos', 'Tratamiento preventivo si necesario'],
    nextVisitDate: null,
    status: 'scheduled',
    images: [],
    signature: null,
    createdAt: '2025-03-01T10:00:00.000Z',
    updatedAt: '2025-03-01T10:00:00.000Z'
  },
  {
    id: 11,
    title: 'Propuesta de Tratamiento - Hotel Continental',
    type: 'proposal',
    clientId: 2,
    clientName: 'Hotel Continental',
    date: '2025-03-20T09:00:00.000Z',
    technicianName: 'Patricia Navarro',
    findings: [],
    recommendations: ['Tratamiento preventivo trimestral', 'Formación al personal', 'Mejora de protocolos'],
    treatments: ['Plan integral de prevención', 'Control de roedores e insectos', 'Monitoreo continuo'],
    nextVisitDate: null,
    status: 'pending',
    images: [],
    signature: null,
    createdAt: '2025-03-08T11:20:00.000Z',
    updatedAt: '2025-03-08T11:20:00.000Z'
  },
  {
    id: 12,
    title: 'Seguimiento Emergencia - Supermercado FreshMart',
    type: 'follow-up',
    clientId: 3,
    clientName: 'Supermercado FreshMart',
    date: '2025-03-08T09:30:00.000Z',
    technicianName: 'Carlos Pérez',
    findings: ['Reducción significativa de actividad de roedores', 'Puntos de entrada reparados'],
    recommendations: ['Mantener monitoreo diario', 'Continuar con protocolos de higiene reforzados'],
    treatments: ['Revisión y reposición de trampas', 'Tratamiento focal en puntos críticos'],
    nextVisitDate: '2025-03-15T09:30:00.000Z',
    status: 'completed',
    images: ['report12_img1.jpg'],
    signature: 'signature12.png',
    createdAt: '2025-03-08T11:00:00.000Z',
    updatedAt: '2025-03-08T11:00:00.000Z'
  }
];

/**
 * Async thunk para obtener todos los informes
 */
export const fetchReports = createAsyncThunk(
  'reports/fetchReports',
  async ({ page = 1, limit = 10, search = '', filters = {} }, { rejectWithValue }) => {
    try {
      // Simulamos un retraso para simular la llamada a la API
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Filtramos los informes según los criterios de búsqueda
      let filteredReports = [...mockReports];
      
      // Aplicar búsqueda por texto
      if (search) {
        const searchLower = search.toLowerCase();
        filteredReports = filteredReports.filter(report => 
          report.title.toLowerCase().includes(searchLower) ||
          report.clientName.toLowerCase().includes(searchLower) ||
          report.technicianName.toLowerCase().includes(searchLower) ||
          report.type.toLowerCase().includes(searchLower)
        );
      }
      
      // Aplicar filtros adicionales
      if (Object.keys(filters).length > 0) {
        filteredReports = filteredReports.filter(report => {
          return Object.entries(filters).every(([key, value]) => {
            if (!value) return true; // Si no hay valor de filtro, no filtramos por este campo
            
            switch (key) {
              case 'type':
                return report.type === value;
              case 'status':
                return report.status === value;
              case 'clientId':
                return report.clientId.toString() === value.toString();
              case 'date':
                // Filtrar por rango de fechas si value es un objeto con from y to
                if (value.from && value.to) {
                  const reportDate = new Date(report.date).getTime();
                  return reportDate >= new Date(value.from).getTime() && 
                         reportDate <= new Date(value.to).getTime();
                }
                return true;
              default:
                return true;
            }
          });
        });
      }
      
      // Cálculo de paginación
      const totalCount = filteredReports.length;
      const totalPages = Math.ceil(totalCount / limit);
      
      // Obtener solo los informes de la página actual
      const startIndex = (page - 1) * limit;
      const paginatedReports = filteredReports.slice(startIndex, startIndex + limit);
      
      return {
        reports: paginatedReports,
        totalCount,
        totalPages
      };
    } catch (error) {
      return rejectWithValue({ message: 'Failed to fetch reports' });
    }
  }
);

/**
 * Async thunk para obtener un informe por ID
 */
export const fetchReportById = createAsyncThunk(
  'reports/fetchReportById',
  async (reportId, { rejectWithValue, getState }) => {
    try {
      // Para fines de demostración, obtenemos el informe de los datos mock
      // En una implementación real, esto sería una llamada a la API
      const { reports } = getState().reports;
      const report = reports.find(r => r.id === reportId);
      
      if (!report) {
        throw new Error(`No se encontró un informe con el ID ${reportId}`);
      }
      
      // Simulamos un retraso para simular la llamada a la API
      await new Promise(resolve => setTimeout(resolve, 500));
      
      return report;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

/**
 * Async thunk para exportar un informe a PDF
 */
export const exportReportPdf = createAsyncThunk(
  'reports/exportReportPdf',
  async (reportId, { rejectWithValue, getState }) => {
    try {
      // Obtener el informe de la store
      const { reports } = getState().reports;
      const report = reports.find(r => r.id === reportId);
      
      if (!report) {
        throw new Error(`No se encontró un informe con el ID ${reportId}`);
      }
      
      // En una implementación real, aquí se generaría el PDF
      // Para fines de demostración, simulamos un retraso
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Aquí se utilizaría la función generateReportPdf de pdfUtils
      // Pero como estamos en el slice, no podemos usarla directamente
      // La función real se llama desde el componente
      
      return { success: true, reportId };
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

/**
 * Async thunk para obtener informes filtrados por cliente
 */
export const fetchReportsByClient = createAsyncThunk(
  'reports/fetchReportsByClient',
  async (clientId, { rejectWithValue, getState }) => {
    try {
      // Para fines de demostración, filtramos los informes de los datos mock
      // En una implementación real, esto sería una llamada a la API
      const { reports } = getState().reports;
      const filteredReports = reports.filter(r => r.clientId === clientId);
      
      // Simulamos un retraso para simular la llamada a la API
      await new Promise(resolve => setTimeout(resolve, 500));
      
      return filteredReports;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

/**
 * Async thunk para crear un nuevo informe
 */
export const createReport = createAsyncThunk(
  'reports/createReport',
  async (reportData, { rejectWithValue }) => {
    try {
      // Simulamos un retraso para simular la llamada a la API
      await new Promise(resolve => setTimeout(resolve, 800));
      
      // Crear un nuevo ID (simulando la generación de ID en el servidor)
      const newId = Math.max(...mockReports.map(report => report.id)) + 1;
      
      // Crear nuevo informe con datos adicionales
      const newReport = {
        ...reportData,
        id: newId,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      
      // Añadir al array de informes mock
      mockReports.unshift(newReport);
      
      return newReport;
    } catch (error) {
      return rejectWithValue({ message: 'Failed to create report' });
    }
  }
);

/**
 * Async thunk para actualizar un informe
 */
export const updateReport = createAsyncThunk(
  'reports/updateReport',
  async ({ id, data }, { rejectWithValue }) => {
    try {
      // Simulamos un retraso para simular la llamada a la API
      await new Promise(resolve => setTimeout(resolve, 600));
      
      // Buscar el informe por ID
      const reportIndex = mockReports.findIndex(report => report.id === Number(id));
      
      if (reportIndex === -1) {
        return rejectWithValue({ message: 'Report not found' });
      }
      
      // Actualizar datos del informe
      const updatedReport = {
        ...mockReports[reportIndex],
        ...data,
        id: Number(id), // Aseguramos que el ID permanece igual
        updatedAt: new Date().toISOString()
      };
      
      // Actualizar en el array mock
      mockReports[reportIndex] = updatedReport;
      
      return updatedReport;
    } catch (error) {
      return rejectWithValue({ message: 'Failed to update report' });
    }
  }
);

/**
 * Async thunk para eliminar un informe
 */
export const deleteReport = createAsyncThunk(
  'reports/deleteReport',
  async (id, { rejectWithValue }) => {
    try {
      // Simulamos un retraso para simular la llamada a la API
      await new Promise(resolve => setTimeout(resolve, 400));
      
      // Buscar el informe por ID
      const reportIndex = mockReports.findIndex(report => report.id === Number(id));
      
      if (reportIndex === -1) {
        return rejectWithValue({ message: 'Report not found' });
      }
      
      // Eliminar del array mock
      mockReports.splice(reportIndex, 1);
      
      return Number(id);
    } catch (error) {
      return rejectWithValue({ message: 'Failed to delete report' });
    }
  }
);

/**
 * Slice de Redux para gestionar los informes
 */
const initialState = {
  reports: mockReports,
  filteredReports: [],
  selectedReport: null,
  loading: false,
  exportLoading: false,
  error: null,
  searchTerm: '',
  pageSize: 10,
  currentPage: 0,
  filters: {
    status: 'all',
    type: 'all',
    dateRange: null
  },
  clientFilter: null
};

export const reportsSlice = createSlice({
  name: 'reports',
  initialState,
  reducers: {
    setSearchTerm: (state, action) => {
      state.searchTerm = action.payload;
      state.currentPage = 0; // Reset to first page on new search
    },
    setPageSize: (state, action) => {
      state.pageSize = action.payload;
      state.currentPage = 0; // Reset to first page on page size change
    },
    setCurrentPage: (state, action) => {
      state.currentPage = action.payload;
    },
    setFilters: (state, action) => {
      state.filters = action.payload;
      state.currentPage = 0; // Reset to first page on filter change
    },
    setClientFilter: (state, action) => {
      state.clientFilter = action.payload;
      state.currentPage = 0; // Reset to first page on filter change
    },
    clearReportSelection: (state) => {
      state.selectedReport = null;
    }
  },
  extraReducers: (builder) => {
    builder
      // Handle fetchReports
      .addCase(fetchReports.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchReports.fulfilled, (state, action) => {
        state.loading = false;
        state.reports = action.payload.reports;
        state.totalReports = action.payload.totalCount;
        state.totalPages = action.payload.totalPages;
      })
      .addCase(fetchReports.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || 'An unknown error occurred';
      })
      
      // Handle fetchReportById
      .addCase(fetchReportById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchReportById.fulfilled, (state, action) => {
        state.loading = false;
        state.selectedReport = action.payload;
      })
      .addCase(fetchReportById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
    
    // Handle exportReportPdf
    builder
      .addCase(exportReportPdf.pending, (state) => {
        state.exportLoading = true;
        state.error = null;
      })
      .addCase(exportReportPdf.fulfilled, (state) => {
        state.exportLoading = false;
      })
      .addCase(exportReportPdf.rejected, (state, action) => {
        state.exportLoading = false;
        state.error = action.payload;
      });
    
    // Handle fetchReportsByClient
    builder
      .addCase(fetchReportsByClient.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchReportsByClient.fulfilled, (state, action) => {
        state.loading = false;
        state.filteredReports = action.payload;
      })
      .addCase(fetchReportsByClient.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
    
    // Handle createReport
    builder
      .addCase(createReport.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createReport.fulfilled, (state, action) => {
        state.loading = false;
        state.reports.unshift(action.payload); // Add to beginning of array
        state.totalReports += 1;
      })
      .addCase(createReport.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || 'An unknown error occurred';
      });
    
    // Handle updateReport
    builder
      .addCase(updateReport.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateReport.fulfilled, (state, action) => {
        state.loading = false;
        // Update in reports array if present
        const index = state.reports.findIndex(report => report.id === action.payload.id);
        if (index !== -1) {
          state.reports[index] = action.payload;
        }
        // Update currentReport if it's the same
        if (state.selectedReport?.id === action.payload.id) {
          state.selectedReport = action.payload;
        }
      })
      .addCase(updateReport.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || 'An unknown error occurred';
      });
    
    // Handle deleteReport
    builder
      .addCase(deleteReport.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteReport.fulfilled, (state, action) => {
        state.loading = false;
        state.reports = state.reports.filter(report => report.id !== action.payload);
        state.totalReports -= 1;
        if (state.selectedReport?.id === action.payload) {
          state.selectedReport = null;
        }
      })
      .addCase(deleteReport.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || 'An unknown error occurred';
      });
  },
});

export const { 
  setSearchTerm, 
  setPageSize, 
  setCurrentPage, 
  setFilters, 
  setClientFilter,
  clearReportSelection 
} = reportsSlice.actions;

export default reportsSlice.reducer;
