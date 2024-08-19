import { SignIn } from "@clerk/nextjs";
import {  Box, Container } from "@mui/material";

export default function SignInPage() {
  return (
    <Container maxWidth="lg">
        <Box display="flex" flexDirection="column" alignItems="center" height="100vh" mt={10}>
            <SignIn />
        </Box>

    </Container>
  )
}