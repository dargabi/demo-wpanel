import { useDispatch, useSelector } from 'react-redux';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button,
  CircularProgress
} from '@mui/material';
import { deleteClient } from '../../redux/slices/clientsSlice';
import { clearDeleteDialog } from '../../redux/slices/uiSlice';

/**
 * Delete confirmation dialog component
 * Handles confirmation of delete actions for various entity types
 * @returns {JSX.Element} Delete confirmation dialog
 */
const DeleteConfirmDialog = () => {
  const dispatch = useDispatch();
  const { deleteDialog, loading } = useSelector((state) => state.ui);
  const { id, type, open } = deleteDialog || { id: null, type: null, open: false };
  
  // Generate title and content based on entity type
  const getDialogContent = () => {
    switch (type) {
      case 'client':
        return {
          title: 'Eliminar Cliente',
          content: '¿Está seguro que desea eliminar este cliente? Esta acción no se puede deshacer y eliminará todos los datos asociados a este cliente.',
          confirmText: 'Eliminar'
        };
      case 'report':
        return {
          title: 'Eliminar Informe',
          content: '¿Está seguro que desea eliminar este informe? Esta acción no se puede deshacer.',
          confirmText: 'Eliminar'
        };
      case 'service':
        return {
          title: 'Eliminar Servicio',
          content: '¿Está seguro que desea eliminar este servicio? Esta acción no se puede deshacer.',
          confirmText: 'Eliminar'
        };
      default:
        return {
          title: 'Confirmar Eliminación',
          content: '¿Está seguro que desea eliminar este elemento? Esta acción no se puede deshacer.',
          confirmText: 'Eliminar'
        };
    }
  };
  
  const { title, content, confirmText } = getDialogContent();
  
  // Handle close dialog
  const handleClose = () => {
    dispatch(clearDeleteDialog());
  };
  
  // Handle confirm delete
  const handleConfirm = async () => {
    if (!id || !type) return;
    
    switch (type) {
      case 'client':
        await dispatch(deleteClient(id));
        break;
      // Add other entity types here as needed
      default:
        console.error(`Delete handler for type "${type}" not implemented`);
    }
    
    handleClose();
  };
  
  return (
    <Dialog
      open={open}
      onClose={handleClose}
      aria-labelledby="delete-dialog-title"
      aria-describedby="delete-dialog-description"
    >
      <DialogTitle id="delete-dialog-title">
        {title}
      </DialogTitle>
      <DialogContent>
        <DialogContentText id="delete-dialog-description">
          {content}
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} color="inherit" disabled={loading}>
          Cancelar
        </Button>
        <Button
          onClick={handleConfirm}
          color="error"
          variant="contained"
          disabled={loading}
          startIcon={loading && <CircularProgress size={20} color="inherit" />}
        >
          {loading ? 'Eliminando...' : confirmText}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default DeleteConfirmDialog;
