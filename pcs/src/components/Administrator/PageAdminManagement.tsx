import React, { useEffect, useState } from 'react';
import DataTable from 'react-data-table-component';

import {
    Button, Card, CardContent, CardHeader, CircularProgress, Divider, Grid, IconButton, TextField
} from '@material-ui/core';
import AddIcon from '@material-ui/icons/Add';
import DeleteIcon from '@material-ui/icons/Delete';

import { filterData } from '../../database/DataFilter';
import { deleteAdmin, getAllAdmins, insertAdmin, PCSAdmin } from '../../database/PCSAdminManager';
import { notifyFailure, notifySuccess } from './AdminHelper';
import DialogAdmin from './DialogAdmin';

const PageAdminManagement = () => {
    const [adminList, setAdminList] = useState<PCSAdmin[]>([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [dialogType, setDialogType] = useState('');
    const [selectedAdminInfo, setSelectedAdminInfo] = useState<any>(undefined);
    const [loading, setLoading] = useState(true);

    const init = () => {
        getAllAdmins().then((admins) => {
            if (admins) {
                setAdminList(admins.map((val, i) => ({
                    index: i + 1,
                    email: val.email,
                    name: val.name,
                    reg_date: val.reg_date.split("T")[0]
                })));
                setLoading(false);
            }
        })
    }

    const closeDialog = () => {
        setDialogType("");
    }

    const onAddClick = () => {
        setDialogType("Add");
    }

    const onDeleteClick = (adminInfo) => () => {
        setDialogType("Delete");
        setSelectedAdminInfo(adminInfo);
    }

    const onDeleteSubmit = (adminInfo: PCSAdmin) => {
        const tempName = adminInfo.name;
        deleteAdmin(adminInfo).then((result) => {
            if (result) {
                notifySuccess("You have successfully deleted " + "'" + tempName + "'" + "!");
                closeDialog();
            } else {
                notifyFailure("An unexpected error occured, please try again later.");
            }
            init();
        });
    }

    const onAddSubmit = (adminInfo: PCSAdmin) => {
        insertAdmin(adminInfo).then((result) => {
            if (result) {
                notifySuccess("You have successfully added a new admin!");
                closeDialog();
            } else {
                notifyFailure("An unexpected error occured, please try again later.");
            }
            init();
        });
    }

    const onUpdateSubmit = (adminInfo) => {
    }

    const handleChange = (event: any) => {
        setSearchQuery(event.target.value);
    }

    const columns = [
        {
            name: '#',
            selector: 'index',
            sortable: true,
            grow: 0
        },
        {
            name: 'Name',
            selector: 'name',
            sortable: true,
            grow: 1
        },
        {
            name: 'Email',
            selector: 'email',
            sortable: true,
            grow: 1
        },
        {
            name: 'Registration Date',
            selector: 'reg_date',
            sortable: true,
            grow: 1
        },
        {
            name: 'Action',
            sortable: false,
            cell: (row: any) => <div>
                <Grid container alignItems="center">
                    <IconButton onClick={onDeleteClick(row)} size="small">
                        <DeleteIcon fontSize="inherit" />
                    </IconButton>
                </Grid>
            </div>,
            ignoreRowClick: true,
            selector: 'email',
            grow: 0,
        }
    ];

    useEffect(() => {
        init();
    }, []);

    return !loading ? (
        <Card style={{ width: "100%", padding: 10 }}>
            <Grid container spacing={1} alignItems="center">
                <Grid item xs={8}>
                    <CardHeader title="Admin Management" />
                </Grid>
                <Grid item xs={4}>
                    <Button
                        variant="contained"
                        color="primary"
                        className="float-right"
                        size="medium"
                        startIcon={<AddIcon />}
                        onClick={onAddClick}>Add Admin</Button>
                </Grid>
            </Grid>
            <Divider />
            <CardContent>
                <Grid container spacing={1}>
                    <Grid item xs={12}>
                        <TextField
                            id="outlined-basic"
                            label="Search"
                            placeholder="John Tan..."
                            fullWidth
                            variant="outlined"
                            value={searchQuery}
                            onChange={handleChange}
                            InputLabelProps={{
                                shrink: true,
                            }} />
                    </Grid>
                    <hr />
                    <Grid container item lg={12}>
                        <DataTable
                            className="dataTables_wrapper"
                            columns={columns}
                            data={filterData(adminList, searchQuery)}
                            noHeader
                            defaultSortField="index"
                            pagination={true} 
                            />
                        <DialogAdmin
                            dialogType={dialogType}
                            closeDialog={closeDialog}
                            onAddSubmit={onAddSubmit}
                            onUpdateSubmit={onUpdateSubmit}
                            onDeleteSubmit={onDeleteSubmit}
                            selectedAdminInfo={selectedAdminInfo}
                        />
                    </Grid>
                </Grid>
            </CardContent>
        </Card>) : <CircularProgress />;
}

export default PageAdminManagement;