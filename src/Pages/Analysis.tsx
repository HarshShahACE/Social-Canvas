import { useMediaQuery } from "@mui/material";
import { CssBaseline } from "@mui/material"
import SideNav from "../Components/Navbar";
import TableauVisualization from "../Components/tablau";
import PieChart from "../Components/Analysis/PieChart";
import BubbleChart from "../Components/Analysis/BarChart";
import MapChart from "../Components/Analysis/Mapchart";

const Analysis = () => {

    const isMobile = useMediaQuery('(max-width:600px)');
    const defaultImagePath = process.env.REACT_APP_DEFAULT_APP_IMAGE;

    return (
        <div style={{ display: 'flex' , backgroundImage: `url(${defaultImagePath})`, backgroundSize:'contain',
        backgroundRepeat:'no-repeat',
        backgroundPosition:'bottom right'  , height:'100vh' }}>
          <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
          <CssBaseline />
          {/* Sidebar */}
          <SideNav/>
          {/* Main content */}
            <div style={{ flex: 1  }}>
            <main style={{ flexGrow: 1, padding: 3, marginTop: '70px', marginLeft: isMobile ? '20px' : '240px', display: 'flex', flexDirection: 'column' }}>
    {/* First row */}
    <div style={{ display: 'flex', flexDirection: 'row' }}>
        <div style={{ width: '45%', height: '450px', borderRadius:'20px' ,padding: '20px', backgroundColor: 'rgba(250,250,250,0.8)', border: '1px solid #ddd' }} >
            <h2>Connection Details</h2>
            <div>
                <PieChart />
            </div>
        </div>
        <div style={{ width: '50%',marginLeft:'15px', borderRadius:'20px' ,height: '450px', padding: '20px', marginRight:'15px', backgroundColor: 'rgba(250,250,250,0.8)', border: '1px solid #ddd' }} >
            <div>
                <BubbleChart />
            </div>
        </div>
    </div>
</main>

            </div>
        </div>
    )
}

export default Analysis;