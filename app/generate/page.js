'use client'
import { useUser } from "@clerk/nextjs";
import { Box, Button, Container, Dialog, DialogActions, DialogContent, DialogTitle, Grid, Paper, TextField, Typography, IconButton, Tooltip, Alert } from "@mui/material";
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import CreateIcon from '@mui/icons-material/Create';
import SaveIcon from '@mui/icons-material/Save';
import FlipIcon from '@mui/icons-material/Flip';
import { useRouter } from "next/navigation"; 
import { useState } from "react";
import { collection, doc, getDoc, writeBatch } from "firebase/firestore";
import { db } from "@/firebase";

export default function Generate() {
    const { isLoaded, isSignedIn, user } = useUser();
    const [flashcards, setFlashcards] = useState([]);
    const [flipped, setFlipped] = useState(false);
    const [text, setText] = useState('');
    const [name, setName] = useState('');
    const [open, setOpen] = useState(false);
    const [currentCardIndex, setCurrentCardIndex] = useState(0);
    const router = useRouter();
    const maxChars = 1200;


    const handleSubmit = async () => {
        fetch('/api/generate', {
            method: 'POST',
            body: text,
        }).then((response) => response.json())
          .then((data) => {
            console.log(`data from api call`, data);
            setFlashcards(data);
            console.log(`flashcards after api call`, data);
        })
        .catch(error => console.error('error', error));
    }

    const handleCardClick = (id) => {
        setFlipped((prev) => ({
            ...prev,
            [id]: !prev[id],
        }));
    }

    const handleNextCard = () => {
        setCurrentCardIndex((prevIndex) => 
            prevIndex < flashcards.length - 1 ? prevIndex + 1 : prevIndex
        );
        setFlipped(false);
    };

    const handlePreviousCard = () => {
        setCurrentCardIndex((prevIndex) => 
            prevIndex > 0 ? prevIndex - 1 : prevIndex
        );
        setFlipped(false);
    };

    const handleOpen = () => {
        setOpen(true);
    }

    const handleClose = () => {
        setOpen(false);
    }

    const saveFlashcards = async () => {
        if(!name){
            alert('Please enter a name');
            return;
        }
        const batch = writeBatch(db);
        const userDocRef = doc(collection(db, 'users'), user.id);
        const docSnap = await getDoc(userDocRef);
        if(docSnap.exists()){
            const collections = docSnap.data().flashcards || [];
            if(collections.find((f) => f.name === name)){
                alert('Flashcards with same name already exist');
                return;
            }else
            {
                collections.push({
                    name
                });
                batch.set(userDocRef, {
                    flashcards: collections,
                }), {merge: true};

            }
        }
       else{
        batch.set(userDocRef, {
            flashcards: [{
                name
            }],
        });
       }

       const colRef = collection(userDocRef, name)
       flashcards.forEach((flashcard) => {
            const cardDocRef = doc(colRef)
            batch.set(cardDocRef, flashcard);
       })
       await batch.commit();
       handleClose();
       router.push(`/flashcards`);
    }

    const handleTextChange = (e) => {
        const newText = e.target.value.slice(0, maxChars);
        setText(newText);
    };


    return(
        <Container maxWidth="lg">
            {!isSignedIn && (
                <Alert severity="warning" sx={{ mt: 2 }}>
                    You must be logged in to be able to save your cards.
                </Alert>
            )}
            <Grid container spacing={4} sx={{ mt: 2 }}>
                {/* Generate Section */}
                <Grid item xs={12} md={6}>
                    <Typography variant="h4" component="h1" gutterBottom>Generate Flashcards</Typography>
                    <Paper elevation={3} sx={{ p: 4 }}>
                        <TextField
                                label="Enter Text"
                                multiline
                                rows={6}
                                value={text}
                                onChange={handleTextChange}
                                variant="outlined"
                                sx={{ width: '100%', mb: 1 }}
                                required
                                inputProps={{
                                    maxLength: maxChars,
                                }}
                            />
                        <Typography variant="caption" align="right" display="block" sx={{ mb: 2 }}>
                            {text.length}/{maxChars} characters
                        </Typography>
                        <Button
                            variant="contained"
                            color="primary"
                            onClick={handleSubmit}
                            startIcon={<CreateIcon />}
                            fullWidth
                        >
                            Generate
                        </Button>
                    </Paper>
                </Grid>

                {/* Preview Section */}
                <Grid item xs={12} md={6}>
                    {flashcards.length > 0 && (
                        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                            <Typography variant="h4" sx={{ mb: 3 }}>Flashcards Preview</Typography>
                            <Box sx={{ width: '350px', height: '400px', perspective: '1000px', mb: 3 }}>
                                <Paper 
                                    onClick={() => setFlipped(!flipped)} 
                                    elevation={6} 
                                    sx={{
                                        width: '100%', 
                                        height: '100%', 
                                        transform: flipped ? 'rotateY(180deg)' : 'rotateY(0deg)', 
                                        transition: 'transform 0.6s',
                                        transformStyle: 'preserve-3d',
                                        position: 'relative',
                                        cursor: 'pointer',
                                        backgroundColor: 'rgb(253 252 254 / 87%)',
                                    }}
                                >
                                    <Box
                                        sx={{ 
                                            backfaceVisibility: 'hidden',
                                            position: 'absolute',
                                            width: '100%',
                                            height: '100%',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            transform: flipped ? 'rotateY(180deg)' : 'rotateY(0deg)',
                                            padding: 3, 
                                        }}
                                    >
                                        <Typography 
                                            align="center"
                                            sx={{ 
                                                width: '100%',
                                                overflowWrap: 'break-word', 
                                                fontFamily: 'sans-serif',
                                                fontSize: '20px',
                                                overflowY: 'auto',
                                                maxHeight: '100%',
                                            }}
                                        >
                                            {flipped ? flashcards[currentCardIndex].back : flashcards[currentCardIndex].front}
                                        </Typography>
                                    </Box>
                                </Paper>
                            </Box>
                            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', mb: 2 }}>
                                <Tooltip title="Previous Card">
                                    <IconButton 
                                        onClick={handlePreviousCard}
                                        disabled={currentCardIndex === 0}
                                    >
                                        <ArrowBackIcon />
                                    </IconButton>
                                </Tooltip>
                                <Typography sx={{ mx: 2 }}>{currentCardIndex + 1} / {flashcards.length}</Typography>
                                <Tooltip title="Next Card">
                                    <IconButton 
                                        onClick={handleNextCard}
                                        disabled={currentCardIndex === flashcards.length - 1}
                                    >
                                        <ArrowForwardIcon />
                                    </IconButton>
                                </Tooltip>
                                <Tooltip title="Flip Card">
                                    <IconButton onClick={() => setFlipped(!flipped)}>
                                        <FlipIcon />
                                    </IconButton>
                            </Tooltip>
                            </Box>
                           
                            <Button 
                                variant="contained" 
                                color="primary" 
                                onClick={handleOpen}
                                startIcon={<SaveIcon />}
                                sx={{ mt: 2 }}
                                disabled={!isSignedIn}
                            >
                                Save Flashcards
                            </Button>
                        </Box>
                    )}
                </Grid>
            </Grid>

            {/* Save Dialog */}
            <Dialog open={open} onClose={handleClose}>
                <DialogTitle>Save Flashcards</DialogTitle>
                <DialogContent>
                    <Typography gutterBottom>Please enter a name for your flashcards collection</Typography>
                    <TextField 
                        variant="outlined" 
                        label="Collection Name" 
                        value={name} 
                        onChange={(e) => setName(e.target.value)} 
                        fullWidth
                        required 
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose}>Cancel</Button>
                    <Button onClick={saveFlashcards} variant="contained" color="primary" startIcon={<SaveIcon />}>
                        Save
                    </Button>
                </DialogActions>
            </Dialog>
        </Container>
    )
}