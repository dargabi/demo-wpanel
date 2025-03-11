import { Box, Typography, Button, Paper } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { Home as HomeIcon } from '@mui/icons-material';

/**
 * 404 Not Found page
 * Displays when a user attempts to access a non-existent route
 * @returns {JSX.Element} Not found page
 */
const NotFound = () => {
  const navigate = useNavigate();

  // Handle return to dashboard
  const handleReturnHome = () => {
    navigate('/dashboard');
  };

  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '100vh',
        background: (theme) => theme.palette.background.default
      }}
    >
      <Paper
        elevation={3}
        sx={{
          p: 5,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          maxWidth: 500,
          borderRadius: 2
        }}
      >
        <Typography
          variant="h1"
          color="primary"
          sx={{ fontSize: '6rem', fontWeight: 'bold', mb: 2 }}
        >
          404
        </Typography>

        <Typography variant="h4" gutterBottom>
          Página no encontrada
        </Typography>

        <Typography
          variant="body1"
          color="text.secondary"
          align="center"
          sx={{ mb: 4, maxWidth: 400 }}
        >
          Lo sentimos, la página que estás buscando no existe o ha sido movida.
        </Typography>

        <Button
          variant="contained"
          color="primary"
          startIcon={<HomeIcon />}
          onClick={handleReturnHome}
          size="large"
        >
          Volver al inicio
        </Button>
      </Paper>
    </Box>
  );
};

export default NotFound;
