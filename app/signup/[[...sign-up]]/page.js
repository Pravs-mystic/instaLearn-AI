import { SignUp } from "@clerk/nextjs";
import {  Box, Container } from "@mui/material";

export default function SignUpPage() {
  return (
    <Container maxWidth="lg">

        <Box display="flex" flexDirection="column" alignItems="center" height="100vh" mt={10}>
            <SignUp />
        </Box>

    </Container>
  )
}