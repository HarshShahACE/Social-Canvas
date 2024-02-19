import { CssBaseline, useMediaQuery } from "@mui/material";
import SideNav from "../Components/Navbar";

export default function Schedule_Post(){

    
    const isMobile = useMediaQuery('(max-width:600px)');
    const defaultImagePath = process.env.REACT_APP_DEFAULT_APP_IMAGE;

    return(
        <div style={{ display: 'flex' , backgroundImage: `url(${defaultImagePath})`, backgroundSize:'contain',
            backgroundRepeat:'no-repeat',
            backgroundPosition:'bottom right'  , height:'100vh' }}>
            <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
            <CssBaseline />
            {/* Sidebar */}
            <SideNav/>
        {/* Main content */}
        <div style={{ flex: 1  }}>
                <main style={{ flexGrow: 1, padding: 3, marginTop: '70px' , marginLeft: isMobile? '20px' : '240px'  }}>
                {/* Main content */}
                </main>
            </div>
    </div>
    )
}