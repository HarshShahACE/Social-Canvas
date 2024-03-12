import { Card, CardContent, Typography } from "@mui/material";
import ArrowDropUpIcon from '@mui/icons-material/ArrowDropUp';
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";

interface GrowthCardProps {
    title: string;
    currentValue: number;
    previousValue: number;
    backgroundImage: string;
}

const calculateGrowthPercentage = (current: number, previous: number): number => {
    return ((current - previous) / previous) * 100;
};

const GrowthCard: React.FC<GrowthCardProps> = ({ title, currentValue, previousValue, backgroundImage }) => {
    const growthPercentage = calculateGrowthPercentage(currentValue, previousValue);
    const absGrowthPercentage = Math.abs(growthPercentage);

    return (
        <div style={{ display: 'flex' }}>
            <Card sx={{
                minWidth: 200,
                maxWidth: 300,
                position: 'relative',
                overflow: 'hidden',
                borderRadius: 5,
                backgroundImage: `linear-gradient(rgba(25, 28, 36, 0.1), rgba(25, 28, 36, 0.1)), url(${backgroundImage})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                margin: '20px 40px 20px 0px'
            }}>
                <CardContent style={{ position: 'relative', zIndex: 1, color: '#FFF', textAlign: 'center' }}>
                    <Typography variant="h5" component="div" >
                        {title}
                    </Typography>
                    <Typography variant="h6">
                        {currentValue}
                    </Typography>
                    <Typography variant="body2" color={growthPercentage > 0 ? '#00BD52' : 'red'}>
                        {growthPercentage > 0 ? <ArrowDropUpIcon sx={{ fontSize: 16, verticalAlign: 'middle' }} /> : <ArrowDropDownIcon sx={{ fontSize: 16, verticalAlign: 'middle' }}/>}
                        {`${absGrowthPercentage.toFixed(2)}%`}
                    </Typography>
                </CardContent>
            </Card>
        </div>
    );
}

export default GrowthCard;
