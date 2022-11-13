import React, { MouseEvent, useEffect, useState } from 'react';
import './App.css';
import { useDispatch, useSelector } from 'react-redux';
import { bindActionCreators } from 'redux';
import { actionCreators } from './state';
import { RootState } from './state/reducers';
import { Users, Posts } from './utils/interface'
import { Box, Button, Container, Modal, Stack, Typography } from '@mui/material';
import { DataGrid, GridApi, GridCellValue, GridColDef, GridValueGetterParams } from '@mui/x-data-grid';

function App() {

  const stateOpen = useSelector((state: RootState) => state.modal)
  const dispatch = useDispatch();
  const { setOpen } = bindActionCreators(actionCreators, dispatch)
  
  const [users, setUsers] = useState<Users[]>([])
  const [posts, setPosts] = useState<Posts[]>([])
  const [totalRow, setTotalRow] = useState<number>(0)
  const [newPage, setNewPage] = useState<number>(1)
  const [bodyModal, setBodyModal] = useState<{
    name: string | GridCellValue;
    gender: string | GridCellValue;
    email: string | GridCellValue;
}>({
    name: '',
    gender: '',
    email: ''
  })

  const handleClose = () => setOpen(false);

  const style = {
    position: 'absolute' as 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 800,
    bgcolor: 'background.paper',
    boxShadow: 24,
    p: 4,
    borderRadius: '5px'
  };
  
  const fetchUserData = async (paramPage: number = 1) => {
    try {
      const res = await fetch(`https://gorest.co.in/public/v2/users?page=${paramPage}`, {
        method: 'GET',
        headers: {
          ContentType: 'application/json',
          Accept: 'application/json'
        }
      });
      const data = await res.json()
      setUsers(data)
      let getHeaderRowCount = Number(res.headers.get("x-pagination-total"))
      setTotalRow(getHeaderRowCount)
      if (!res.ok) throw res.statusText;
      return data;
    } catch (error) {
      console.log("error : ", error)
      setUsers([])
    }
  }

  const columns: GridColDef[] = [
    { field: 'id', headerName: 'ID', type: 'number', flex: 1},
    { field: 'name', headerName: 'Name', flex: 1},
    { field: 'email', headerName: 'Email', flex: 3},
    { field: 'gender', headerName: 'Gender', flex: 2},
    { field: 'status', headerName: 'Status', flex: 2},
    {
      field: 'action',
      headerName: 'Action',
      description: 'This column has a value getter and is not sortable.',
      sortable: false,
      flex: 3,
      renderCell: (params) => {
        const handleOpen = async (e: MouseEvent<HTMLElement>) => {
          e.stopPropagation(); // don't select this row after clicking
  
          const api: GridApi = params.api;
          const thisRow: Record<string, GridCellValue> = {};
  
          api
            .getAllColumns()
            .filter((c) => c.field !== "__check__" && !!c)
            .forEach(
              (c) => (thisRow[c.field] = params.getValue(params.id, c.field))
            );
            console.log(thisRow)
  
          // return alert(JSON.stringify(thisRow, null, 4));
          setBodyModal({
            name: thisRow.name,
            gender: thisRow.gender,
            email: thisRow.email
          })
          setOpen(true)

          try {
            const res = await fetch(`https://gorest.co.in/public/v2/users/${thisRow.id}/posts`, {
              method: 'GET',
              headers: {
                ContentType: 'application/json',
                Accept: 'application/json'
              }
            });
            const data = await res.json()
            console.log(data)
            setPosts(data)
            if (!res.ok) throw res.statusText;
            return data;
          } catch (error) {
            console.log("error : ", error)
            setUsers([])
          }
        };
  
        return (
          <>
            <Button onClick={handleOpen}>VIEW</Button>
            <Button onClick={handleOpen}>EDIT</Button>
            <Button onClick={handleOpen}>DELETE</Button>
          </>
        )
      }
    }
  ];

  const columnsDetail: GridColDef[] = [
    { field: 'id', headerName: 'id', flex: 1},
    { field: 'user_id', headerName: 'user_id',type: 'number', flex: 1},
    { field: 'title', headerName: 'title', flex: 3},
    { field: 'body', headerName: 'body', flex: 2}
  ];

  useEffect(() => {
      fetchUserData(Number(newPage))
  },[newPage])

  return (
    <div className="App">
      {console.log("ini di jsx", users)}
      <Container maxWidth="xl">
        <Box sx={{ height: '100vh' }} >
          <Box component="h1" pt={2} sx={{ textAlign: 'center', height: '40px', display: 'inline-block' }}>Daftar Pengguna</Box>
          <Box sx={{ display: 'flex', justifyContent: 'end'}}>
            <Button variant="outlined">Buat Pengguna</Button>
          </Box>
          <Box p={2} mt={2} sx={{ bgcolor: '#F8F9FA', height: '100vh', borderRadius: '10px' }}>
          <DataGrid
            rows={users}
            columns={columns}
            pageSize={10}
            rowsPerPageOptions={[10]}
            rowCount={totalRow}
            paginationMode="server"
            onPageChange={(newPage) => setNewPage(newPage+1)}
          />
          <Modal
              open={stateOpen}
              onClose={handleClose}
              aria-labelledby="modal-modal-title"
              aria-describedby="modal-modal-description"
          >
            <Box sx={style}>
              <Typography id="modal-modal-title" variant="h6" component="h2">
                Lihat Pengguna
              </Typography>
              <Typography component="div" id="modal-modal-description" sx={{ mt: 3 }}>
                <Box component="span" sx={{ height: '20px', display: 'block' }} mt={1}>Nama : {bodyModal.name}</Box>
                <Box component="span" sx={{ height: '20px', display: 'block' }} mt={1}>Gender : {bodyModal.gender}</Box>
                <Box component="span" sx={{ height: '20px', display: 'block' }} mt={1}>Email : {bodyModal.email}</Box>

                <Box component="div" sx={{ display: 'flex', justifyContent: 'space-between'}} mt={3}>
                  <Box component="span" sx={{ fontWeight: 700 }}>Daftar Pengguna</Box>
                  <Button variant="outlined">Buat Post</Button>
                </Box>
                <Box sx={{ height: '300px' }}>
                  <DataGrid
                    rows={posts}
                    columns={columnsDetail}
                    pageSize={10}
                    rowsPerPageOptions={[10]}
                    />
                </Box>
              </Typography>
            </Box>
          </Modal>
          </Box>
        </Box>
      </Container>
    </div>
  );
}

export default App;