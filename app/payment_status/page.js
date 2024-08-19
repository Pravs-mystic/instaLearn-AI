'use client'
import { useState, useEffect } from 'react'
import { Box, Button, CircularProgress, Container, Paper, Typography } from '@mui/material'
import { useSearchParams } from 'next/navigation'
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline'
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline'
import Link from 'next/link'

export default function Result() {
  const searchParams = useSearchParams()
  const session_id = searchParams.get('session_id')
  const [loading, setLoading] = useState(true)
  const [session, setSession] = useState(null)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchCheckoutSession = async () => {
      if (!session_id) {
        setError('No session_id found')
        setLoading(false)
        return
      }
      try {
        const res = await fetch(`/api/checkout_sessions/${session_id}`)
        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`)
        }
        const sessionData = await res.json()
        console.log('Session data:', sessionData) // Add this line for debugging
        setSession(sessionData)
      } catch (error) {
        console.error('Error fetching checkout session:', error)
        setError(error.message || 'An unexpected error occurred')
      } finally {
        setLoading(false)
      }
    }
    fetchCheckoutSession()
  }, [session_id])

  if (loading) {
    return (
      <Container maxWidth="sm" sx={{ mt: 8, textAlign: 'center' }}>
        <CircularProgress size={60} />
        <Typography variant="h6" sx={{ mt: 2 }}>Processing your payment...</Typography>
      </Container>
    )
  }

  if (error) {
    return (
      <Container maxWidth="sm" sx={{ mt: 8 }}>
        <Paper elevation={3} sx={{ p: 4, textAlign: 'center' }}>
          <ErrorOutlineIcon color="error" sx={{ fontSize: 60, mb: 2 }} />
          <Typography variant="h5" color="error" gutterBottom>Error</Typography>
          <Typography>{error}</Typography>
          <Button component={Link} href="/pricing" variant="contained" sx={{ mt: 3 }}>
            Return to Pricing
          </Button>
        </Paper>
      </Container>
    )
  }

  return (
    <Container maxWidth="sm" sx={{ mt: 8 }}>
      <Paper elevation={3} sx={{ p: 4, textAlign: 'center' }}>
        {session?.payment_status === 'paid' ? (
          <>
            <CheckCircleOutlineIcon color="success" sx={{ fontSize: 60, mb: 2 }} />
            <Typography variant="h4" gutterBottom>Thank you for your purchase!</Typography>
            <Typography variant="body1" paragraph>
              We have received your payment. You will receive an email confirmation shortly.
            </Typography>
            <Typography variant="body2" color="text.secondary" paragraph>
              Transaction ID: {session_id}
            </Typography>
            <Button component={Link} href="/generate" variant="contained" sx={{ mt: 2 }}>
              Start Creating Flashcards
            </Button>
          </>
        ) : (
          <>
            <ErrorOutlineIcon color="warning" sx={{ fontSize: 60, mb: 2 }} />
            <Typography variant="h4" gutterBottom>Payment not completed</Typography>
            <Typography variant="body1" paragraph>
              Your payment was not successful or is still pending. Please check your payment status or try again.
            </Typography>
            <Button component={Link} href="/pricing" variant="contained" sx={{ mt: 2 }}>
              Return to Pricing
            </Button>
          </>
        )}
      </Paper>
    </Container>
  )
}