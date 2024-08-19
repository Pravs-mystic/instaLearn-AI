'use client'
import { Box, Button, Container, Grid, Paper, Typography, Switch, FormControlLabel } from "@mui/material";
import CheckIcon from '@mui/icons-material/Check';
import { useState } from "react";
import getStripe from "@/utils/get-stripe";
import { useRouter } from 'next/navigation';

export default function Pricing() {
  const [yearly, setYearly] = useState(false);
  const router = useRouter();


  const pricingPlans = [
    { 
      name: 'Free', 
      price: 'Free', 
      features: [
        '100 flashcards/month',
        'Basic AI generation',
        'Web access',
        'Multiple choice questions',
        'Key concept questions',
        '1 case scenario'
      ]
    },
    { 
      name: 'Pro', 
      price: yearly ? '$4' : '$9.99', 
      period: yearly ? 'per month' : 'per month',
      features: [
        'Unlimited flashcards',
        'Advanced AI generation',
        'Web & mobile access',
        'Priority support',
        '3x more questions',
        'Case scenarios for all topics'
      ]
    },
    { 
      name: 'Enterprise', 
      price: 'Custom', 
      features: [
        'All Pro features',
        'Custom integrations',
        'Dedicated account manager',
        'On-premise deployment',
        'Unlimited uploads',
        'Diagram and image quizzes'
      ]
    },
  ];

//   const handleSubmit = async () => {
//     const checkoutSession = await fetch('/api/checkout_sessions',{
//       method: 'POST',
//       headers: {
//         origin: 'http://localhost:3000',    
//       }
//     }
//     )
//     const checkoutSessionJson = await checkoutSession.json();
//     if(checkoutSession.statusCode === 200){
//       console.log(checkoutSession.message)
//       return
//     }
//     const stripe = await getStripe();
//     const {error} = await stripe.redirectToCheckout({
//       sessionId: checkoutSessionJson.id
//     })
//     if(error){
//       console.warn(error.message)
//     }
//   }

const handleSubmit = async () => {
    const checkoutSession = await fetch(`/api/checkout_sessions?yearly=${yearly}`, {
      method: 'POST',
      headers: {
        origin: 'http://localhost:3000',    
      }
    });
    const checkoutSessionJson = await checkoutSession.json();
    if (checkoutSession.ok) {
      const stripe = await getStripe();
      const { error } = await stripe.redirectToCheckout({
        sessionId: checkoutSessionJson.id
      });
      if (error) {
        console.warn(error.message);
      }
    } else {
      console.error('Error creating checkout session:', checkoutSessionJson.error);
    }
  };

  const handlePlanAction = (planName) => {
    if (planName === 'Free') {
      router.push('/generate');
    } else if (planName === 'Pro') {
      handleSubmit();
    }
    // For Enterprise, we do nothing as the button is disabled
  };


  return (
    <Container maxWidth="lg" sx={{ mt: 8, mb: 8 }}>
      <Typography variant="h5" align="center" color="text.secondary" paragraph>
        Choose the perfect plan for your flashcard needs
      </Typography>
      
      <Box sx={{ display: 'flex', justifyContent: 'center', mb: 4 }}>
        <FormControlLabel
          control={<Switch checked={yearly} onChange={() => setYearly(!yearly)} />}
          label={yearly ? "Yearly (Save 50%)" : "Monthly"}
        />
      </Box>

      <Grid container spacing={4} justifyContent="center">
        {pricingPlans.map((plan) => (
          <Grid item xs={12} sm={6} md={4} key={plan.name}>
            <Paper elevation={3} sx={{ p: 4, height: '100%', display: 'flex', flexDirection: 'column' }}>
              <Typography variant="h4" component="h2" gutterBottom>
                {plan.name}
              </Typography>
              <Typography variant="h3" component="p" gutterBottom>
                {plan.price}
              </Typography>
              {plan.period && (
                <Typography variant="subtitle1" color="text.secondary" gutterBottom>
                  {plan.period}
                </Typography>
              )}
              <Box sx={{ flexGrow: 1 }}>
                {plan.features.map((feature, index) => (
                  <Box key={index} sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                    <CheckIcon color="primary" sx={{ mr: 1 }} />
                    <Typography>{feature}</Typography>
                  </Box>
                ))}
              </Box>
              <Button 
                variant="contained" 
                color="primary" 
                size="large" 
                fullWidth 
                sx={{ mt: 2 }}
                disabled={plan.name === 'Enterprise'}
                onClick={() => handlePlanAction(plan.name)}
              >
                {plan.name === 'Free' ? 'Get Started' : 
                 plan.name === 'Enterprise' ? 'Contact Sales' : `Upgrade to ${plan.name}`}
              </Button>
            </Paper>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
}