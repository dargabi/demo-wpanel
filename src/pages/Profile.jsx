import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import {
  Box,
  Paper,
  Typography,
  Avatar,
  Grid,
  TextField,
  Button,
  Divider,
  IconButton,
  InputAdornment,
  Alert,
  Snackbar,
  Card,
  CardContent,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Switch
} from '@mui/material';
import {
  Person as PersonIcon,
  Edit as EditIcon,
  Save as SaveIcon,
  Cancel as CancelIcon,
  Visibility as VisibilityIcon,
  VisibilityOff as VisibilityOffIcon,
  Security as SecurityIcon,
  Notifications as NotificationsIcon,
  Language as LanguageIcon,
  DarkMode as DarkModeIcon,
  MobileFriendly as MobileIcon
} from '@mui/icons-material';

/**
 * User profile page component
 * Allows users to view and edit their profile information
 * @returns {JSX.Element} Profile page
 */
const Profile = () => {
  const { user, updateUserProfile, changePassword } = useAuth();
  
  // Local state
  const [editMode, setEditMode] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [notification, setNotification] = useState({
    open: false,
    message: '',
    severity: 'success'
  });
  
  // Form state
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
    position: user?.position || '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  
  // Settings state
  const [settings, setSettings] = useState({
    notifications: true,
    emailAlerts: true,
    darkMode: false,
    language: 'es'
  });
  
  // Handle form input change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));
  };
  
  // Handle settings change
  const handleSettingChange = (setting) => {
    setSettings((prev) => ({
      ...prev,
      [setting]: !prev[setting]
    }));
  };
  
  // Toggle edit mode
  const handleToggleEditMode = () => {
    if (editMode) {
      // If canceling edit, reset form data
      setFormData({
        name: user?.name || '',
        email: user?.email || '',
        phone: user?.phone || '',
        position: user?.position || '',
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      });
    }
    setEditMode(!editMode);
  };
  
  // Handle profile update
  const handleUpdateProfile = async () => {
    try {
      // Mock API call
      // await updateUserProfile(formData);
      
      setNotification({
        open: true,
        message: 'Perfil actualizado correctamente',
        severity: 'success'
      });
      
      setEditMode(false);
    } catch (error) {
      setNotification({
        open: true,
        message: error.message || 'Error al actualizar el perfil',
        severity: 'error'
      });
    }
  };
  
  // Handle password change
  const handleChangePassword = async () => {
    if (formData.newPassword !== formData.confirmPassword) {
      setNotification({
        open: true,
        message: 'Las contraseñas no coinciden',
        severity: 'error'
      });
      return;
    }
    
    try {
      // Mock API call
      // await changePassword(formData.currentPassword, formData.newPassword);
      
      setNotification({
        open: true,
        message: 'Contraseña actualizada correctamente',
        severity: 'success'
      });
      
      // Reset password fields
      setFormData((prev) => ({
        ...prev,
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      }));
    } catch (error) {
      setNotification({
        open: true,
        message: error.message || 'Error al cambiar la contraseña',
        severity: 'error'
      });
    }
  };
  
  // Toggle password visibility
  const handleTogglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };
  
  // Handle notification close
  const handleCloseNotification = () => {
    setNotification((prev) => ({
      ...prev,
      open: false
    }));
  };
  
  return (
    <Box>
      <Typography variant="h4" component="h1" gutterBottom>
        Mi Perfil
      </Typography>
      
      <Grid container spacing={3}>
        {/* Profile Information */}
        <Grid item xs={12} md={8}>
          <Paper elevation={2} sx={{ p: 3, borderRadius: 2 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
              <Typography variant="h5" component="h2">
                Información Personal
              </Typography>
              
              <IconButton
                color={editMode ? 'error' : 'primary'}
                onClick={handleToggleEditMode}
              >
                {editMode ? <CancelIcon /> : <EditIcon />}
              </IconButton>
            </Box>
            
            <Grid container spacing={3}>
              {/* Avatar and name */}
              <Grid item xs={12} sm={4} sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <Avatar
                  sx={{
                    width: 120,
                    height: 120,
                    mb: 2,
                    bgcolor: 'primary.main'
                  }}
                >
                  <PersonIcon sx={{ fontSize: 60 }} />
                </Avatar>
                
                {!editMode ? (
                  <Typography variant="h6" align="center">
                    {user?.name || 'Usuario'}
                  </Typography>
                ) : (
                  <Button
                    variant="outlined"
                    size="small"
                    sx={{ mt: 1 }}
                  >
                    Cambiar foto
                  </Button>
                )}
              </Grid>
              
              {/* Profile fields */}
              <Grid item xs={12} sm={8}>
                <Grid container spacing={2}>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="Nombre completo"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      disabled={!editMode}
                      variant="outlined"
                    />
                  </Grid>
                  
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="Correo electrónico"
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleChange}
                      disabled={!editMode}
                      variant="outlined"
                    />
                  </Grid>
                  
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Teléfono"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      disabled={!editMode}
                      variant="outlined"
                    />
                  </Grid>
                  
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Cargo"
                      name="position"
                      value={formData.position}
                      onChange={handleChange}
                      disabled={!editMode}
                      variant="outlined"
                    />
                  </Grid>
                </Grid>
                
                {editMode && (
                  <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end' }}>
                    <Button
                      variant="contained"
                      color="primary"
                      onClick={handleUpdateProfile}
                      startIcon={<SaveIcon />}
                    >
                      Guardar cambios
                    </Button>
                  </Box>
                )}
              </Grid>
            </Grid>
          </Paper>
          
          {/* Security settings */}
          <Paper elevation={2} sx={{ p: 3, borderRadius: 2, mt: 3 }}>
            <Typography variant="h5" component="h2" gutterBottom>
              Seguridad
            </Typography>
            
            <Divider sx={{ mb: 3 }} />
            
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Contraseña actual"
                  name="currentPassword"
                  type={showPassword ? 'text' : 'password'}
                  value={formData.currentPassword}
                  onChange={handleChange}
                  variant="outlined"
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          onClick={handleTogglePasswordVisibility}
                          edge="end"
                        >
                          {showPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
                        </IconButton>
                      </InputAdornment>
                    )
                  }}
                />
              </Grid>
              
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Nueva contraseña"
                  name="newPassword"
                  type={showPassword ? 'text' : 'password'}
                  value={formData.newPassword}
                  onChange={handleChange}
                  variant="outlined"
                />
              </Grid>
              
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Confirmar nueva contraseña"
                  name="confirmPassword"
                  type={showPassword ? 'text' : 'password'}
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  variant="outlined"
                />
              </Grid>
            </Grid>
            
            <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end' }}>
              <Button
                variant="contained"
                color="primary"
                onClick={handleChangePassword}
                startIcon={<SecurityIcon />}
                disabled={!formData.currentPassword || !formData.newPassword || !formData.confirmPassword}
              >
                Cambiar contraseña
              </Button>
            </Box>
          </Paper>
        </Grid>
        
        {/* Settings */}
        <Grid item xs={12} md={4}>
          <Card elevation={2} sx={{ borderRadius: 2 }}>
            <CardContent>
              <Typography variant="h5" component="h2" gutterBottom>
                Preferencias
              </Typography>
              
              <Divider sx={{ mb: 2 }} />
              
              <List>
                <ListItem>
                  <ListItemIcon>
                    <NotificationsIcon />
                  </ListItemIcon>
                  <ListItemText
                    primary="Notificaciones"
                    secondary="Recibir notificaciones en la aplicación"
                  />
                  <Switch
                    edge="end"
                    checked={settings.notifications}
                    onChange={() => handleSettingChange('notifications')}
                  />
                </ListItem>
                
                <ListItem>
                  <ListItemIcon>
                    <MobileIcon />
                  </ListItemIcon>
                  <ListItemText
                    primary="Alertas por correo"
                    secondary="Recibir alertas por correo electrónico"
                  />
                  <Switch
                    edge="end"
                    checked={settings.emailAlerts}
                    onChange={() => handleSettingChange('emailAlerts')}
                  />
                </ListItem>
                
                <ListItem>
                  <ListItemIcon>
                    <DarkModeIcon />
                  </ListItemIcon>
                  <ListItemText
                    primary="Modo oscuro"
                    secondary="Cambiar a modo oscuro"
                  />
                  <Switch
                    edge="end"
                    checked={settings.darkMode}
                    onChange={() => handleSettingChange('darkMode')}
                  />
                </ListItem>
              </List>
              
              <Divider sx={{ my: 2 }} />
              
              <Typography variant="h6" gutterBottom sx={{ mt: 2 }}>
                Idioma
              </Typography>
              
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <LanguageIcon sx={{ mr: 1, color: 'text.secondary' }} />
                <TextField
                  select
                  fullWidth
                  value="es"
                  variant="outlined"
                  size="small"
                  SelectProps={{
                    native: true
                  }}
                >
                  <option value="es">Español</option>
                  <option value="en">English</option>
                </TextField>
              </Box>
              
              <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end' }}>
                <Button
                  variant="contained"
                  color="primary"
                >
                  Guardar preferencias
                </Button>
              </Box>
            </CardContent>
          </Card>
          
          <Card elevation={2} sx={{ borderRadius: 2, mt: 3 }}>
            <CardContent>
              <Typography variant="h5" component="h2" gutterBottom>
                Información de la Cuenta
              </Typography>
              
              <Divider sx={{ mb: 2 }} />
              
              <Box sx={{ mb: 2 }}>
                <Typography variant="body2" color="text.secondary">
                  Tipo de cuenta
                </Typography>
                <Typography variant="body1">
                  {user?.role === 'admin' ? 'Administrador' : 'Técnico'}
                </Typography>
              </Box>
              
              <Box sx={{ mb: 2 }}>
                <Typography variant="body2" color="text.secondary">
                  Fecha de registro
                </Typography>
                <Typography variant="body1">
                  {new Date(user?.createdAt || Date.now()).toLocaleDateString()}
                </Typography>
              </Box>
              
              <Box>
                <Typography variant="body2" color="text.secondary">
                  Último acceso
                </Typography>
                <Typography variant="body1">
                  {new Date(user?.lastLogin || Date.now()).toLocaleString()}
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
      
      {/* Notification snackbar */}
      <Snackbar
        open={notification.open}
        autoHideDuration={6000}
        onClose={handleCloseNotification}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert
          onClose={handleCloseNotification}
          severity={notification.severity}
          variant="filled"
        >
          {notification.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default Profile;
