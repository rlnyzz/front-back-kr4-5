import React from 'react';
import {
  Snackbar,
  Alert,
  IconButton,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import {
  Close as CloseIcon,
  CheckCircle as SuccessIcon,
  Error as ErrorIcon,
  Warning as WarningIcon,
  Info as InfoIcon,
} from '@mui/icons-material';

const Notification = ({ notification, onClose }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const getSeverityIcon = (severity) => {
    switch (severity) {
      case 'success':
        return <SuccessIcon fontSize="inherit" />;
      case 'error':
        return <ErrorIcon fontSize="inherit" />;
      case 'warning':
        return <WarningIcon fontSize="inherit" />;
      case 'info':
      default:
        return <InfoIcon fontSize="inherit" />;
    }
  };

  const getAlertColor = (severity) => {
    switch (severity) {
      case 'success':
        return { bgcolor: 'success.light', color: 'success.contrastText' };
      case 'error':
        return { bgcolor: 'error.light', color: 'error.contrastText' };
      case 'warning':
        return { bgcolor: 'warning.light', color: 'warning.contrastText' };
      case 'info':
      default:
        return { bgcolor: 'info.light', color: 'info.contrastText' };
    }
  };

  const action = (
    <IconButton
      size="small"
      aria-label="close"
      color="inherit"
      onClick={onClose}
      sx={{
        '&:hover': {
          backgroundColor: 'rgba(255, 255, 255, 0.1)',
        },
      }}
    >
      <CloseIcon fontSize="small" />
    </IconButton>
  );

  return (
    <Snackbar
      open={notification.open}
      autoHideDuration={notification.autoHideDuration}
      onClose={onClose}
      anchorOrigin={{
        vertical: isMobile ? 'bottom' : 'top',
        horizontal: 'right',
      }}
      sx={{
        '& .MuiSnackbar-root': {
          maxWidth: isMobile ? '90vw' : '400px',
        },
      }}
    >
      <Alert
        onClose={onClose}
        severity={notification.severity}
        variant="filled"
        icon={getSeverityIcon(notification.severity)}
        action={action}
        sx={{
          width: '100%',
          maxWidth: isMobile ? '90vw' : '400px',
          alignItems: 'center',
          borderRadius: 2,
          boxShadow: 3,
          ...getAlertColor(notification.severity),
          '& .MuiAlert-icon': {
            fontSize: '1.5rem',
            mr: 1,
          },
          '& .MuiAlert-message': {
            flex: 1,
            py: 0.5,
            fontSize: '0.875rem',
          },
        }}
      >
        {notification.message}
      </Alert>
    </Snackbar>
  );
};

export default Notification;