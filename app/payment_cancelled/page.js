'use client'
import { Box, Container, Typography, Paper, Button } from '@mui/material'
import CancelIcon from '@mui/icons-material/Cancel'
import Link from 'next/link'

export default function PaymentCancelled() {
  return (
    <Container maxWidth="sm" sx={{ mt: 8 }}>
      <Paper elevation={3} sx={{ p: 4, textAlign: 'center' }}>
        <CancelIcon color="error" sx={{ fontSize: 30, mb: 2 }} />
        <Typography variant="h4" gutterBottom>
          Payment Cancelled
        </Typography>
        <Typography variant="body1" paragraph>
          Your payment was cancelled or unsuccessful. Please try again or contact support if you need assistance.
        </Typography>
        <Box sx={{ mt: 4, display: 'flex', justifyContent: 'center', gap: 2 }}>
          <Button
            component={Link}
            href="/pricing"
            variant="contained"
            color="primary"
          >
            Return to Pricing
          </Button>
        </Box>
      </Paper>
    </Container>
  )
}