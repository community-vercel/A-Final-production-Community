'use client';
import {
    Container,
    Grid,
    Typography,
} from '@mui/material';
import PropertyCard from '@/components/PropertyCard';
import HomeIcon from '@mui/icons-material/Home';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import BusinessIcon from '@mui/icons-material/Business';

const SubProperties=({
    filteredItems
  }) => {
    return (

    <Container maxWidth="lg" sx={{ mt: 2, mb: 4 }}>
        <Typography variant="h5" fontWeight={700} mb={3}>
            Browse Properties
        </Typography>
        <Grid container spacing={4}>
            {filteredItems.map((type) =>
                type.children.length > 0 && (
                    <Grid item xs={12} sm={6} md={4} key={type.id}>
                        <PropertyCard
                                    icon={type.name === 'Home' ? <HomeIcon sx={{ color: 'green' }} /> : type.name === 'Plots' ? <LocationOnIcon sx={{ color: 'green' }} /> : type.name === 'Commercial' ? <BusinessIcon sx={{ color: 'green' }} /> : <HomeIcon sx={{ color: 'green' }} />} // Change icon color based on children
                                    title={type.name}
                            items={type.children}
                        />
                    </Grid>
                )
            )}
        </Grid>
    </Container>
);
  }
  export default SubProperties;

