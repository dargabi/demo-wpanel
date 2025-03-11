import { Outlet } from 'react-router-dom';
import { Box, Container, Typography, Paper } from '@mui/material';
import BugReportIcon from '@mui/icons-material/BugReport';

/**
 * Authentication layout component for login and other authentication pages
 * @returns {JSX.Element} Authentication layout with branding and content area
 */
const AuthLayout = () => {
  return (
    <Box
      sx={{
        height: '100vh',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'primary.light',
        backgroundImage: 'linear-gradient(45deg, #4CAF50 30%, #2E7D32 90%)',
      }}
    >
      <Container maxWidth="sm">
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            mb: 4,
          }}
        >
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              color: 'white',
              mb: 3,
            }}
          >
            <BugReportIcon sx={{ fontSize: 40, mr: 1 }} />
            <Typography
              variant="h4"
              component="h1"
              fontWeight="bold"
            >
              Control de Plagas
            </Typography>
          </Box>
          <Typography
            variant="h6"
            align="center"
            color="white"
            gutterBottom
          >
            Panel de Administración
          </Typography>
        </Box>

        <Paper
          elevation={8}
          sx={{
            p: 4,
            borderRadius: 2,
          }}
        >
          <Outlet />
        </Paper>
        
        <Box sx={{ mt: 4, textAlign: 'center' }}>
          <Typography variant="body2" color="white">
            © {new Date().getFullYear()} Sistema de Control de Plagas. Todos los derechos reservados.
          </Typography>
        </Box>
      </Container>
    </Box>
  );
};

export default AuthLayout;
