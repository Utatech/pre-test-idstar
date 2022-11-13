import React, { MouseEvent, useEffect, useState, useRef } from 'react';
import './App.css';
import { useDispatch, useSelector } from 'react-redux';
import { bindActionCreators } from 'redux';
import { actionCreators } from './state';
import { RootState } from './state/reducers';
import { Users, Posts } from './utils/interface'
import { Box, Button, Container, IconButton, Modal, Snackbar, TextField, Typography } from '@mui/material';
import { DataGrid, GridApi, GridCellValue, GridColDef } from '@mui/x-data-grid';
import { Close } from '@mui/icons-material';
import axios from 'axios';

function App() {

  const stateOpen = useSelector((state: RootState) => state.modal)
  const dispatch = useDispatch();
  const { setOpen } = bindActionCreators(actionCreators, dispatch)
  
  const [inputValue, setInputValue] = useState<{id: number | GridCellValue;name: string | GridCellValue;gender: string | GridCellValue;email: string | GridCellValue; status: string;}>({
    id: 0,
    name: "",
    gender: "",
    email: "",
    status: "active"
  })

  const [openSnack, setOpenSnack] = useState(false)
  const [message, setMessage] = useState("")
  const [users, setUsers] = useState<Users[]>([])
  const [isView, setIsView] = useState(false)
  const [isCreate, setIsCreate] = useState(false)
  const [posts, setPosts] = useState<Posts[]>([])
  const [totalRow, setTotalRow] = useState<number>(0)
  const [newPage, setNewPage] = useState<number>(1)
  const [idUser, setIdUser] = useState<number | GridCellValue>(0)
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

  const handleCloseSnack = (event: React.SyntheticEvent | Event, reason?: string) => {
    if (reason === 'clickaway') {
      return;
    }

    setOpenSnack(false);
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

  function ChildModal() {
    const style = {
      position: 'absolute' as 'absolute',
      top: '50%',
      left: '50%',
      transform: 'translate(-50%, -50%)',
      width: 400,
      bgcolor: 'background.paper',
      border: '2px solid #000',
      boxShadow: 24,
      pt: 2,
      px: 4,
      pb: 3,
    };
    const [openPost, setOpenPost] = React.useState(false);

    const handleOpen = () => {
      setOpenPost(true);
    };

    const handleClose = () => {
      setOpenPost(false);
    };

    const titleRef = useRef() as React.MutableRefObject<HTMLInputElement>
    const bodyRef = useRef() as React.MutableRefObject<HTMLInputElement>

    const handlePost = async () => {
      console.log(titleRef.current.value)
      console.log(bodyRef.current.value)

      try {
        await axios.post(`https://gorest.co.in/public/v2/users/${idUser}/posts`, 
          {
            title: titleRef.current.value,
            body: bodyRef.current.value
          },
          {
            headers: {
              'Content-Type': 'application/json',
              'Accept': 'application/json',
              'Authorization': `Bearer ${process.env.REACT_APP_TOKEN}`
            }
          }
        );
        // const data = await res.json()
        // console.log(data)
        // setPosts(data)
        // if (!res.ok) throw res.statusText;
        // return data;
        setOpen(false)
        setOpenPost(false)
        setMessage("Berhasil Tambah User")
        setOpenSnack(true)
        fetchUserData(Number(newPage))
      } catch (error) {
        console.log("error : ", error)
        setMessage("Gagal Tambah User")
        setOpenSnack(true)  
      }
    }
  
    return (
      <>
        <Button variant="outlined" onClick={handleOpen}>Buat Post</Button>
        <Modal
          open={openPost}
          onClose={handleClose}
          aria-labelledby="child-modal-title"
          aria-describedby="child-modal-description"
        >
          <Box sx={{ ...style, width: 400 }}>
            <Box sx={{ display: 'flex', flexDirection: 'column' }}>
              <TextField
                id="child-modal-title"
                fullWidth
                margin="dense"
                label="Title"
                variant="standard"
                inputRef={titleRef}
              />
              <TextField
                id="child-modal-description"
                fullWidth
                margin="dense"
                label="Body"
                variant="standard"
                inputRef={bodyRef}
              />
              <Button variant="outlined" onClick={handlePost}>Simpan</Button>
            </Box>
          </Box>
        </Modal>
      </>
    );
  }

  const action = (
    <>
      <IconButton
        size="small"
        aria-label="close"
        color="inherit"
        onClick={handleCloseSnack}
      >
        <Close fontSize="small" />
      </IconButton>
    </>
  );

  const handlePostUser = async () => {
    // e.stopPropagation(); // don't select this row after clicking

    if(isCreate){
      try {
        await axios.post(`https://gorest.co.in/public/v2/users`, 
          {
            name: inputValue.name,
            gender: inputValue.gender,
            email: inputValue.email,
            status: inputValue.status
          },
          {
            headers: {
              'Content-Type': 'application/json',
              'Accept': 'application/json',
              'Authorization': `Bearer ${process.env.REACT_APP_TOKEN}`
            }
          }
        );
        // const data = await res.json()
        // console.log(data)
        // setPosts(data)
        // if (!res.ok) throw res.statusText;
        // return data;
        setOpen(false)
        setMessage("Berhasil Tambah User")
        setOpenSnack(true)
        fetchUserData(Number(newPage))
      } catch (error) {
        console.log("error : ", error)
        setMessage("Gagal Tambah User")
        setOpenSnack(true)  
      }
    }else{
    console.log(inputValue)

    try {
      await axios.put(`https://gorest.co.in/public/v2/users/${inputValue.id}`, 
        {
          name: inputValue.name,
          gender: inputValue.gender,
          email: inputValue.email,
          status: inputValue.status
        },
        {
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'Authorization': `Bearer ${process.env.REACT_APP_TOKEN}`
          }
        }
      );
      // const data = await res.json()
      // if (!res.ok) throw res.statusText;
      // setOpenSnack(true)
      setOpen(false)
      // return data;

      setMessage("Berhasil Edit User")
      setOpenSnack(true)
      fetchUserData(Number(newPage))
    } catch (error) {
      console.log("error : ", error)
      setMessage("Gagal Edit User")
      setOpenSnack(true)
    }
  }
  }

  const handleOpenCreate = () => {
    console.log("asdasd")
    setBodyModal({
      name: "",
      gender: "",
      email: ""
    })
    setOpen(true)
    setIsView(false)
    setIsCreate(true)
  };

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
          setIsView(true)
          setIsCreate(false)

          setIdUser(thisRow.id)

          try {
            const res = await fetch(`https://gorest.co.in/public/v2/users/${thisRow.id}/posts`, {
              method: 'GET',
              headers: {
                ContentType: 'application/json',
                Accept: 'application/json',
                Authorization: `Bearer ${process.env.REACT_APP_TOKEN}`
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

        const handleDelete = async (e: MouseEvent<HTMLElement>) => {
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
          try {
            const res = await fetch(`https://gorest.co.in/public/v2/users/${thisRow.id}`, {
              method: 'DELETE',
              headers: {
                ContentType: 'application/json',
                Accept: 'application/json',
                Authorization: `Bearer ${process.env.REACT_APP_TOKEN}`
              }
            });
            const data = await res.json()
            if (!res.ok) throw res.statusText;
            setMessage("Berhasil Hapus User")
            setOpenSnack(true)
            return data;
          } catch (error) {
            console.log("error : ", error)
            setOpenSnack(true)
          }
          fetchUserData(Number(newPage))
        }

        const handleEdit = async (e: MouseEvent<HTMLElement>) => {
          e.stopPropagation(); // don't select this row after clicking
  
          const api: GridApi = params.api;
          const thisRow: Record<string, GridCellValue> = {};
  
          api
            .getAllColumns()
            .filter((c) => c.field !== "__check__" && !!c)
            .forEach(
              (c) => (thisRow[c.field] = params.getValue(params.id, c.field))
            );
          setInputValue({
            ...inputValue,
            id: thisRow.id,
            name: thisRow.name,
            gender: thisRow.gender,
            email: thisRow.email
          })
          setBodyModal({
            name: thisRow.name,
            gender: thisRow.gender,
            email: thisRow.email
          })
          setOpen(true)
          setIsView(false)
          setIsCreate(false)
          setIdUser(thisRow.id)
          try {
            const res = await fetch(`https://gorest.co.in/public/v2/users/${thisRow.id}/posts`, {
              method: 'GET',
              headers: {
                ContentType: 'application/json',
                Accept: 'application/json',
                Authorization: `Bearer ${process.env.REACT_APP_TOKEN}`
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
        }
  
        return (
          <>
            <Button onClick={handleOpen}>VIEW</Button>
            <Button onClick={handleEdit}>EDIT</Button>
            <Button onClick={handleDelete}>DELETE</Button>
          </>
        )
      }
    }
  ];

  const columnsDetail: GridColDef[] = [
    { field: 'title', headerName: 'Title', flex: 3},
    { field: 'body', headerName: 'Body', flex: 2}
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
            <Button variant="outlined" onClick={handleOpenCreate}>Buat Pengguna</Button>
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
                <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                  <TextField
                    fullWidth
                    margin="dense"
                    id="standard-helperText"
                    label="Nama"
                    defaultValue={bodyModal.name}
                    variant="standard"
                    InputProps={{
                      readOnly: isView,
                    }}
                    onBlur={(e) => setInputValue({
                      ...inputValue,
                      name: e.target.value
                    })}
                  />
                  <TextField
                    fullWidth
                    margin="dense"
                    id="standard-helperText"
                    label="Gender"
                    defaultValue={bodyModal.gender}
                    variant="standard"
                    InputProps={{
                      readOnly: isView,
                    }}
                    onBlur={(e) => setInputValue({
                      ...inputValue,
                      gender: e.target.value
                    })}
                  />
                  <TextField
                    fullWidth
                    margin="dense"
                    id="standard-helperText"
                    label="Email"
                    defaultValue={bodyModal.email}
                    variant="standard"
                    InputProps={{
                      readOnly: isView,
                    }}
                    onBlur={(e) => setInputValue({
                      ...inputValue,
                      email: e.target.value
                    })}
                  />
                  { !isView && <Button variant="outlined" onClick={handlePostUser}>Simpan</Button>}
                </Box>
                {!isCreate && (
                  <>
                    <Box component="div" sx={{ display: 'flex', justifyContent: 'space-between'}} mt={3}>
                      <Box component="span" sx={{ fontWeight: 700 }}>Daftar Post</Box>
                      <ChildModal />
                    </Box>
                    <Box sx={{ height: '200px' }}>
                      <DataGrid
                        rows={posts}
                        columns={columnsDetail}
                        pageSize={10}
                        rowsPerPageOptions={[10]}
                        />
                    </Box>
                  </>
                )}
              </Typography>
            </Box>
          </Modal>
          </Box>
        </Box>
        <Snackbar
            open={openSnack}
            autoHideDuration={6000}
            onClose={handleCloseSnack}
            message={message}
            action={action}
          />
      </Container>
    </div>
  );
}

export default App;