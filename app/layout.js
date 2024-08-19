'use client'
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { AppBar, Toolbar, Typography, Button, Box, Container } from '@mui/material';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { SignedIn, SignedOut, UserButton } from "@clerk/nextjs";
import { ClerkProvider } from '@clerk/nextjs';
import Image from 'next/image';

// Create a custom theme
const theme = createTheme({
  palette: {
    primary: {
      main: '#6a1b9a', // Deep purple
    },
    secondary: {
      main: 'rgb(253 252 254 / 87%)', // Lighter purple
    },
    background: {
      default: '#ffffff', // Very light purple for background
    },
  },
  typography: {
    fontFamily: 'Arial, sans-serif',
    h1: {
      fontFamily: 'Lato, serif',
    },
    h2: {
      fontFamily: 'Lato, serif',
    },
    h3: {
      fontFamily: 'Lato, serif',
    },
    h4: {
      fontFamily: 'Lato, serif',
    },
    h5: {
      fontFamily: 'Lato, serif',
    },
    h6: {
      fontFamily: 'Lato, serif',
    },
  },
  components: {
    MuiAppBar: {
      styleOverrides: {
        root: {
          boxShadow: '0 2px 4px rgba(106, 27, 154, 0.2)',
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          boxShadow: '0 1px 3px rgba(106, 27, 154, 0.2)',
          '&:hover': {
            boxShadow: '0 2px 4px rgba(106, 27, 154, 0.4)',
          },
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          boxShadow: '0 1px 3px rgba(106, 27, 154, 0.2)',
        },
      },
    },
  },
});

export default function RootLayout({ children }) {
  const pathname = usePathname();

  return (
    <ClerkProvider>
      <html lang="en">
        <ThemeProvider theme={theme}>
          <CssBaseline />
          <body>
            <AppBar position="static">
              <Toolbar>
                <Box sx={{ display: 'flex', alignItems: 'center', flexGrow: 1 }}>
                  <Image
                    src="/instaLearnLogo.png"
                    alt="InstaLearn AI Logo"
                    width={40}
                    height={40}
                    style={{ marginRight: '16px' }}
                  />
                  <Typography variant="h6" component="div" sx={{ fontFamily: 'Garamond, serif' }}>
                    InstaLearn AI
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <Button color="inherit" component={Link} href="/" 
                          sx={{ color: pathname === '/' ? 'secondary.main' : 'inherit', mr: 1 }}>
                    Home
                  </Button>
                  <Button color="inherit" component={Link} href="/pricing" 
                          sx={{ color: pathname === '/pricing' ? 'secondary.main' : 'inherit', mr: 1 }}>
                    Pricing
                  </Button>
                  <Button color="inherit" component={Link} href="/generate" 
                          sx={{ color: pathname === '/generate' ? 'secondary.main' : 'inherit', mr: 1 }}>
                    Generate
                  </Button>
                  <Button color="inherit" component={Link} href="/flashcards" 
                          sx={{ color: pathname === '/flashcards' ? 'secondary.main' : 'inherit', mr: 1 }}>
                    My Cards
                  </Button>
                  <SignedOut>
                    <Button color="inherit" component={Link} href="/signin" sx={{ mr: 1 }}>Login</Button>
                    <Button color="inherit" component={Link} href="/signup">Sign Up</Button>
                  </SignedOut>
                  <SignedIn>
                    <UserButton afterSignOutUrl="/" />
                  </SignedIn>
                </Box>
              </Toolbar>
            </AppBar>
            <Container maxWidth="lg" sx={{ mt: 10, mb: 4 }}>
              {children}
            </Container>
          </body>
        </ThemeProvider>
      </html>
    </ClerkProvider>
  );
}