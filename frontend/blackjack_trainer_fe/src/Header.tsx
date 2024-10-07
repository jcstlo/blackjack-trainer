import { Box, Button } from "@mui/material";
import Modal from '@mui/material/Modal';
import { useState } from "react";

export function Header() {
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const modalStyle = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: 'background.paper',
    border: '1px solid #000',
    boxShadow: 8,
    p: 3,
  };

  return (
    <>
      <div className="border-slate-300 border-b pt-3 text-center mb-3 font-bold text-4xl text-blue-700 drop-shadow-sm">
        Blackjack Trainer
        <div className="flex justify-center">
          <div className="px-6">
            <Button onClick={handleOpen}>
              Info
            </Button>
            <Modal
              open={open}
              onClose={handleClose}
            >
              <Box sx={modalStyle}>
                <div className="flex justify-center">
                  <p>Source for blackjack basic strategy charts:</p>
                </div>
                <div className="flex justify-center">
                  <a
                    href="https://www.blackjackapprenticeship.com/blackjack-strategy-charts"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-500 font-bold underline"
                  >
                    Link
                  </a>
                </div>
              </Box>
            </Modal>
          </div>
          <div className="px-6">
            <Button
              href="https://github.com/jcstlo/blackjack-trainer"
              target="_blank"
              rel="noopener noreferrer"
            >
              Github
            </Button>
          </div>
        </div>
      </div>
    </>
  )
}
