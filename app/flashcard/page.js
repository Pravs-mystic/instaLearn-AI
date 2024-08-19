'use client'

import {useUser} from '@clerk/nextjs'
import {useRouter} from 'next/navigation'
import {useEffect, useState} from 'react'
import {collection, doc, getDocs, getFirestore} from 'firebase/firestore'
import {db} from '@/firebase'
import {useSearchParams} from 'next/navigation'
import { Box, Button, Container, Dialog, DialogActions, DialogContent, DialogTitle, Grid, Paper, TextField, Typography, IconButton, Tooltip, Alert } from "@mui/material";
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import FlipIcon from '@mui/icons-material/Flip';

export default function Flashcard({search}) {
    const {isLoaded, isSignedIn, user} = useUser();
    const [flipped, setFlipped] = useState(false);
    const[currentCardIndex, setCurrentCardIndex] = useState(0);
    const [flashcards, setFlashcards] = useState([]);

    const router = useRouter();
    // const searchParams = useSearchParams();
    // const search = searchParams.get('id');


    useEffect(() => {
        async function getFlashcard() {
            if (!search || !user) {
                return;
            }
            const docRef = collection(doc(collection(db, "users"), user.id), search);
            const docs = await getDocs(docRef);
            const flashcards = [];
            docs.forEach((doc) => {
                flashcards.push({id: doc.id, ...doc.data()});
            });
            setFlashcards(flashcards);
        }
        getFlashcard();
    }, [search, user]);

    // useEffect(() => {
    //     async function getFlashcard() {
    //         if (!flashcard_id || !user) {
    //             console.log('No flashcard_id or user:', { flashcard_id, user });
    //             return;
    //         }
    //         console.log('Fetching flashcard with id:', flashcard_id);
    //         const docRef = collection(doc(collection(db, "users"), user.id), flashcard_id.toString());
    //         const docs = await getDocs(docRef);
    //         const fetchedFlashcards = [];
    //         docs.forEach((doc) => {
    //             fetchedFlashcards.push({id: doc.id, ...doc.data()});
    //         });
    //         console.log('Fetched flashcards:', fetchedFlashcards);
    //         setFlashcards(fetchedFlashcards);
    //     }
    //     getFlashcard();
    // }, [flashcard_id, user]);


    if (flashcards.length === 0) {
        return <Typography>No flashcards available.</Typography>;
    }
    const handleCardClick = (id) => {
        setFlipped((prev) => ({
            ...prev,
            [id]: !prev[id],
        }));
    }

    if(!isLoaded || !isSignedIn) {
        return <div>Loading...</div>;
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

    return(
        <Container maxWidth="lg">
                   {flashcards.length > 0 && (
                        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                            <Typography variant="h4" sx={{ mb: 3 }}>{search}</Typography>
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
                        </Box>
                    )}
        </Container>
    )

}