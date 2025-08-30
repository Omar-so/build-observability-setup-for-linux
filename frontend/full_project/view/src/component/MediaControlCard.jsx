import * as React from 'react';
import { useTheme } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import SkipPreviousIcon from '@mui/icons-material/SkipPrevious';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import SkipNextIcon from '@mui/icons-material/SkipNext';

export default function MediaControlCard() {
  const theme = useTheme();

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh', // Full viewport height
        backgroundColor: 'red', // Optional: match theme background
        padding: 2,
      }}
    >
      <Card sx={{ display: 'flex', flexDirection: 'row', boxShadow: theme.shadows[3], width: '100%', maxWidth: 600 }}>
        <CardMedia
          component="img"
          sx={{ width: 151 }}
          image="https://io.lekmanga.net/wp-content/uploads/2020/05/Demonic-Emperor-193x278.jpg"
          alt="Live from space album cover"
        />
        <Box sx={{ display: 'flex', flexDirection: 'column', flex: 1, padding: 2 }}>
          <CardContent sx={{ flex: '1 0 auto' }}>
            <Typography component="div" variant="h5">
              Live From Space
            </Typography>
            <Typography
              variant="subtitle1"
              component="div"
              sx={{ color: 'text.secondary' }}
            >
              Mac Miller
            </Typography>
          </CardContent>
          <Box sx={{ display: 'flex', alignItems: 'center', pl: 1, pb: 1 }}>
            <IconButton aria-label="previous">
              {theme.direction === 'rtl' ? <SkipNextIcon /> : <SkipPreviousIcon />}
            </IconButton>
            <IconButton aria-label="play/pause">
              <PlayArrowIcon sx={{ height: 38, width: 38 }} />
            </IconButton>
            <IconButton aria-label="next">
              {theme.direction === 'rtl' ? <SkipPreviousIcon /> : <SkipNextIcon />}
            </IconButton>
          </Box>
        </Box>
      </Card>

      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          width: '100%',
          maxWidth: 600,
          marginTop: 2,
          padding: 1,
          backgroundColor: theme.palette.background.paper,
          borderRadius: 1,
          boxShadow: theme.shadows[1],
        }}
      >
        <Typography variant="h6" sx={{ color: theme.palette.text.primary }}>
          Chapter: 1
        </Typography>
        <Typography variant="h6" sx={{ color: theme.palette.text.primary }}>
          Updated: {new Date().toLocaleTimeString()}
        </Typography>
      </Box>
    </Box>
  );
}