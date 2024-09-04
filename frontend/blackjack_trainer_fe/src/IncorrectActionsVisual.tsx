import { List, ListItem, Box, Button, Drawer } from "@mui/material";
import { useState } from "react";

interface IncorrectActionsProps {
    incorrectActions: string[];
}

export function IncorrectActionsSidebar(props: IncorrectActionsProps) {
    const [open, setOpen] = useState(false);

    const toggleDrawer = (newOpen: boolean) => () => {
        setOpen(newOpen);
    }

    const drawerListItems = props.incorrectActions.map((item) => {
        return <ListItem>{item}</ListItem>;
    })

    const drawerList = (
        <Box sx={{ width: 325 }} role="presentation" onClick={toggleDrawer(false)}>
            <List>
                {drawerListItems}
            </List>
        </Box>
    )

    return (
        <div className="flex justify-center mt-6">
            <Button onClick={toggleDrawer(true)}>Show last 10 incorrect actions</Button>
            <Drawer open={open} onClose={toggleDrawer(false)}>
                {drawerList}
            </Drawer>
        </div>
    )
}
