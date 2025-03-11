import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormHelperText,
  CircularProgress,
  Alert
} from '@mui/material';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { createClient, updateClient } from '../../redux/slices/clientsSlice';
import { closeModal } from '../../redux/slices/uiSlice';

/**
 * Client form validation schema using Yup
 */
const validationSchema = Yup.object({
  name: Yup.string()
    .required('El nombre es obligatorio')
    .max(100, 'El nombre no debe exceder los 100 caracteres'),
  email: Yup.string()
    .email('Correo electrónico inválido')
    .required('El correo electrónico es obligatorio'),
  phone: Yup.string()
    .matches(
      /^(\+?\d{1,3})?[-.\s]?\(?\d{1,4}\)?[-.\s]?\d{1,4}[-.\s]?\d{1,9}$/,
      'Formato de teléfono inválido'
    )
    .required('El teléfono es obligatorio'),
  address: Yup.string()
    .required('La dirección es obligatoria')
    .max(200, 'La dirección no debe exceder los 200 caracteres'),
  type: Yup.string()
    .required('El tipo de cliente es obligatorio')
    .oneOf(['business', 'individual'], 'Seleccione un tipo válido'),
  status: Yup.string()
    .required('El estado es obligatorio')
    .oneOf(['active', 'inactive', 'pending'], 'Seleccione un estado válido'),
  contactPerson: Yup.string()
    .when('type', {
      is: 'business',
      then: () => Yup.string().required('La persona de contacto es obligatoria para empresas'),
      otherwise: () => Yup.string(),
    }),
  notes: Yup.string()
    .max(500, 'Las notas no deben exceder los 500 caracteres'),
});

/**
 * Client form dialog component for creating and editing clients
 * @returns {JSX.Element} Client form dialog
 */
const ClientFormDialog = () => {
  const dispatch = useDispatch();
  const { modals } = useSelector((state) => state.ui);
  const { currentClient, loading, error } = useSelector((state) => state.clients);
  
  // Determine if it's an edit operation
  const isEdit = !!currentClient;
  
  // Determine which modal to check
  const isOpen = modals.createClient || modals.editClient;
  
  /**
   * Formik setup for form handling and validation
   */
  const formik = useFormik({
    initialValues: {
      name: '',
      email: '',
      phone: '',
      address: '',
      type: 'business',
      status: 'active',
      contactPerson: '',
      notes: '',
    },
    validationSchema,
    onSubmit: async (values) => {
      if (isEdit) {
        await dispatch(updateClient({ id: currentClient.id, data: values }));
      } else {
        await dispatch(createClient(values));
      }
      
      // Close modal if there's no error
      if (!error) {
        handleClose();
      }
    },
  });
  
  // Update form values when editing an existing client
  useEffect(() => {
    if (isEdit && currentClient) {
      formik.setValues({
        name: currentClient.name || '',
        email: currentClient.email || '',
        phone: currentClient.phone || '',
        address: currentClient.address || '',
        type: currentClient.type || 'business',
        status: currentClient.status || 'active',
        contactPerson: currentClient.contactPerson || '',
        notes: currentClient.notes || '',
      });
    }
  }, [currentClient, isEdit]);
  
  // Reset form when dialog is closed
  const handleClose = () => {
    formik.resetForm();
    dispatch(closeModal(isEdit ? 'editClient' : 'createClient'));
  };
  
  return (
    <Dialog
      open={isOpen}
      onClose={handleClose}
      maxWidth="md"
      fullWidth
    >
      <DialogTitle>
        {isEdit ? 'Editar Cliente' : 'Nuevo Cliente'}
      </DialogTitle>
      
      <form onSubmit={formik.handleSubmit}>
        <DialogContent dividers>
          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}
          
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                id="name"
                name="name"
                label="Nombre"
                variant="outlined"
                margin="normal"
                value={formik.values.name}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.name && Boolean(formik.errors.name)}
                helperText={formik.touched.name && formik.errors.name}
                disabled={loading}
                required
              />
            </Grid>
            
            <Grid item xs={12} sm={6}>
              <FormControl
                fullWidth
                margin="normal"
                error={formik.touched.type && Boolean(formik.errors.type)}
              >
                <InputLabel id="type-label">Tipo de Cliente</InputLabel>
                <Select
                  labelId="type-label"
                  id="type"
                  name="type"
                  value={formik.values.type}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  label="Tipo de Cliente"
                  disabled={loading}
                  required
                >
                  <MenuItem value="business">Empresa</MenuItem>
                  <MenuItem value="individual">Particular</MenuItem>
                </Select>
                {formik.touched.type && formik.errors.type && (
                  <FormHelperText>{formik.errors.type}</FormHelperText>
                )}
              </FormControl>
            </Grid>
            
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                id="email"
                name="email"
                label="Correo Electrónico"
                variant="outlined"
                margin="normal"
                value={formik.values.email}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.email && Boolean(formik.errors.email)}
                helperText={formik.touched.email && formik.errors.email}
                disabled={loading}
                required
              />
            </Grid>
            
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                id="phone"
                name="phone"
                label="Teléfono"
                variant="outlined"
                margin="normal"
                value={formik.values.phone}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.phone && Boolean(formik.errors.phone)}
                helperText={formik.touched.phone && formik.errors.phone}
                disabled={loading}
                required
              />
            </Grid>
            
            <Grid item xs={12}>
              <TextField
                fullWidth
                id="address"
                name="address"
                label="Dirección"
                variant="outlined"
                margin="normal"
                value={formik.values.address}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.address && Boolean(formik.errors.address)}
                helperText={formik.touched.address && formik.errors.address}
                disabled={loading}
                required
              />
            </Grid>
            
            {formik.values.type === 'business' && (
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  id="contactPerson"
                  name="contactPerson"
                  label="Persona de Contacto"
                  variant="outlined"
                  margin="normal"
                  value={formik.values.contactPerson}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={formik.touched.contactPerson && Boolean(formik.errors.contactPerson)}
                  helperText={formik.touched.contactPerson && formik.errors.contactPerson}
                  disabled={loading}
                  required
                />
              </Grid>
            )}
            
            <Grid item xs={12} sm={formik.values.type === 'business' ? 6 : 12}>
              <FormControl
                fullWidth
                margin="normal"
                error={formik.touched.status && Boolean(formik.errors.status)}
              >
                <InputLabel id="status-label">Estado</InputLabel>
                <Select
                  labelId="status-label"
                  id="status"
                  name="status"
                  value={formik.values.status}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  label="Estado"
                  disabled={loading}
                  required
                >
                  <MenuItem value="active">Activo</MenuItem>
                  <MenuItem value="inactive">Inactivo</MenuItem>
                  <MenuItem value="pending">Pendiente</MenuItem>
                </Select>
                {formik.touched.status && formik.errors.status && (
                  <FormHelperText>{formik.errors.status}</FormHelperText>
                )}
              </FormControl>
            </Grid>
            
            <Grid item xs={12}>
              <TextField
                fullWidth
                id="notes"
                name="notes"
                label="Notas"
                variant="outlined"
                margin="normal"
                multiline
                rows={4}
                value={formik.values.notes}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.notes && Boolean(formik.errors.notes)}
                helperText={formik.touched.notes && formik.errors.notes}
                disabled={loading}
              />
            </Grid>
          </Grid>
        </DialogContent>
        
        <DialogActions>
          <Button onClick={handleClose} color="inherit" disabled={loading}>
            Cancelar
          </Button>
          <Button
            type="submit"
            variant="contained"
            color="primary"
            disabled={loading}
            startIcon={loading && <CircularProgress size={20} />}
          >
            {loading ? 'Guardando...' : isEdit ? 'Actualizar' : 'Crear'}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default ClientFormDialog;
