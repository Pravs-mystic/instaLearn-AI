'use client'
import Image from "next/image";
import getStripe from "../utils/get-stripe";
import { SignedIn, SignedOut, UserButton } from "@clerk/nextjs";
import { AppBar, Box, Button, Container, Grid, Paper, Toolbar, Typography } from "@mui/material";
import Head from "next/head";

export default function Home() {

  
  return (
    <>
      <Head>
        <title>Home - InstaLearn AI</title>
        <meta name="description" content="Create flashcards from your text in the easiest way" />
      </Head>

      <Box sx={{ textAlign: 'center', mb: 4 }}>
        <Typography variant="h2" component="h1" gutterBottom>
          Welcome to InstaLearn AI
        </Typography>
        <Typography variant="h5" gutterBottom>
          Create flashcards from your text in the easiest way
        </Typography>
        <Button variant="contained" color="primary" size="large" sx={{ mt: 2 }} href="/generate">
          Get Started
        </Button>
      </Box>

      <Grid container spacing={3}>
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 3, height: '100%' }}>
            <Typography variant="h5" gutterBottom>
              Easy to Use
            </Typography>
            <Typography>
              Our AI-powered system makes creating flashcards a breeze. Just input your text and let our technology do the rest.
            </Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 3, height: '100%' }}>
            <Typography variant="h5" gutterBottom>
              Efficient Learning
            </Typography>
            <Typography>
              Flashcards are proven to enhance memory retention. With InstaLearn AI, boost your study efficiency.
            </Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 3, height: '100%' }}>
            <Typography variant="h5" gutterBottom>
              Customizable <span style={{ color: 'gray', fontSize: '0.8em' }}>(Coming soon...)</span>
            </Typography>
            <Typography>
              Tailor your flashcards to your needs. Edit, organize, and prioritize your learning materials.
            </Typography>
          </Paper>
        </Grid>
      </Grid>
    </>
  );
}
