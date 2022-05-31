import * as React from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
import Button from "@mui/material/Button";
import AppContext, {useAppContext} from "./context";

const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    p: 4,
  };
  

const TransactionModal = () => {
    const {visibility, setVisibility, contextData, setContextData}= useAppContext();
    const handleClose = () => setVisibility(false);

    let contentDiv,title;
    if(contextData.count){
        title = <span> Transaction Successful </span>;
        contentDiv = <span>Current Count is: {contextData.count}</span>

    }else if(contextData.error_message){
        title = <span> Transaction Error </span>;
        contentDiv = <span>Error Code: {contextData.error_code}</span>
    }


    return (
      <div>
        <Modal
          open={visibility}
          onClose={handleClose}
          aria-labelledby="modal-modal-title"
          aria-describedby="modal-modal-description"
        >

          <Box sx={style}>
              <Button className={'close'} onClick={handleClose}> X </Button>
            <Typography id="modal-modal-title" variant="h6" component="h2">
                {title}
            </Typography>
            <Typography id="modal-modal-description" sx={{ mt: 2 }}>
                {contentDiv}
            </Typography>

          </Box>
        </Modal>
      </div>
    );
}



export default TransactionModal;