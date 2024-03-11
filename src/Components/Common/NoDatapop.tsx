import React from 'react';
import { IconButton } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import ButtonComponent from '../Fields/Buttonfield';

interface NoDataPopupProps {
  isOpen: boolean;
  onClose: () => void;
}

const NoDataPopup: React.FC<NoDataPopupProps> = ({ isOpen, onClose }) => {
  return (
    <div className={isOpen ? 'popup-overlay' : 'popup-overlay hidden'}>
      <div className="popup">
        <div className="popup-inner">
          <div className="icon-container">
            <IconButton className="close-icon" color="primary">
              <CloseIcon style={{ color: 'red', fontSize: '80px' , padding:'10px' , border: '2px solid black', borderRadius: '50%' }} />
            </IconButton>
          </div>
          <div className="text-container">
            <h2>No Data Found</h2>
          </div>
          <div className="button-container">
            <ButtonComponent variant="contained" onClick={onClose}>OK</ButtonComponent>
          </div>
        </div>
      </div>

      <style>{`
        .popup-overlay {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background-color: rgba(0, 0, 0, 0.5);
          display: flex;
          justify-content: center;
          align-items: center;
          z-index: 1000;
        }

        .popup-overlay.hidden {
          display: none;
        }

        .popup {
          background-color: white;
          padding: 20px;
          border-radius: 10px;
          box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.1);
        }

        .popup-inner {
          text-align: center;
          padding:20px
        }

        .icon-container {
          margin-bottom: 20px;
        }

        .button-container {
          margin-top: 20px;
        }

        .close-icon {
          border-radius: 50%;
          border:black
          padding: 10px;
        }
      `}</style>
    </div>
  );
}

export default NoDataPopup;
