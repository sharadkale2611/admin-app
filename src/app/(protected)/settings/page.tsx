'use client';

import { useRouter } from 'next/navigation';
import {
  Container,
  Typography,
  Grid,
  Card,
  CardActionArea,
  CardContent,
  Box,
} from '@mui/material';

import LocalOfferIcon from '@mui/icons-material/LocalOffer';
import CategoryIcon from '@mui/icons-material/Category';
import MeetingRoomIcon from '@mui/icons-material/MeetingRoom';

export default function SettingsPage() {
  const router = useRouter();

  const settingsItems = [
    {
      title: 'Discount Codes',
      description: 'Create and manage discount codes',
      icon: <LocalOfferIcon fontSize="medium" color="primary" />,
      path: '/discountCodes',
    },
    {
      title: 'Course Categories',
      description: 'Manage course categories',
      icon: <CategoryIcon fontSize="medium" color="primary" />,
      path: '/courseCategory',
    },
    {
      title: 'Classrooms',
      description: 'Manage classrooms and capacities',
      icon: <MeetingRoomIcon fontSize="medium" color="primary" />,
      path: '/classRooms',
    },
  ];

  return (
    <Container maxWidth="lg" disableGutters sx={{ px: 2 }}>
      <Typography variant="h5" fontWeight={600} gutterBottom>
        Settings
      </Typography>

      <Typography variant="body2" color="text.secondary" mb={2}>
        Configure master data and system settings
      </Typography>

      <Grid container spacing={2}>
        {settingsItems.map((item) => (
          <Grid key={item.title} size={{ xs: 12, sm: 6, md: 4 }}>
            <Card
              sx={{
                borderRadius: 2,
                transition: '0.2s',
                '&:hover': {
                  boxShadow: 4,
                },
              }}
            >
              <CardActionArea
                sx={{ p: 1.5 }}
                onClick={() => router.push(item.path)}
              >
                <CardContent sx={{ p: 0 }}>
                  <Box mb={1}>{item.icon}</Box>

                  <Typography variant="subtitle1" fontWeight={600}>
                    {item.title}
                  </Typography>

                  <Typography variant="body2" color="text.secondary">
                    {item.description}
                  </Typography>
                </CardContent>
              </CardActionArea>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
}
