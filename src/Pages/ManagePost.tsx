import { useMediaQuery } from "@mui/material";
import {CssBaseline} from "@mui/material";
import SideNav from "../Components/Navbar";

const ManagePost = () => {

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
                <main style={{ flexGrow: 1, padding: 3, marginTop: '70px' , marginLeft: isMobile? '20px' : '240px'  }}>
                
                </main>
            </div>
        </div>
    )
}

export default ManagePost;