import { Helmet } from 'react-helmet-async';
import { filter } from 'lodash';
import { sentenceCase } from 'change-case';
import { useState } from 'react';
// @mui
import {
  Card,
  Table,
  Stack,
  Paper,
  Avatar,
  Button,
  Popover,
  Checkbox,
  TableRow,
  MenuItem,
  TableBody,
  TableCell,
  Container,
  Typography,
  IconButton,
  TableContainer,
  TablePagination,
  Modal,
  Box,
  TextField
} from '@mui/material';




// components
import Label from '../components/label';
import Iconify from '../components/iconify';
import Scrollbar from '../components/scrollbar';
// sections
import { ProductListHead, ProductListToolbar } from '../sections/@dashboard/products';
// mock
import PRODUCTLIST from '../_mock/product';

// ----------------------------------------------------------------------

const TABLE_HEAD = [
  { id: 'name', label: 'Наименование', alignRight: false },
  { id: 'articul', label: 'Артикул', alignRight: false },
  { id: 'quantity', label: 'Кол-во', alignRight: false },
  { id: 'price', label: 'Стоимость', alignRight: false },
];

const emptyProduct = {
  name: '',
  articul: '',
  quantity: '',
  price: '',
}

// ----------------------------------------------------------------------

function descendingComparator(a, b, orderBy) {
  if (b[orderBy] < a[orderBy]) {
    return -1;
  }
  if (b[orderBy] > a[orderBy]) {
    return 1;
  }
  return 0;
}

function getComparator(order, orderBy) {
  return order === 'desc'
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy);
}

function applySortFilter(array, comparator, query) {
  const stabilizedThis = array.map((el, index) => [el, index]);
  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });
  if (query) {
    return filter(array, (_user) => _user.name.toLowerCase().indexOf(query.toLowerCase()) !== -1);
  }
  return stabilizedThis.map((el) => el[0]);
}

// ----------------------------------------------------------------------
function ProductModal({ open, onClose, handleAddProduct, style, activeProduct, edit }) {
  if (!activeProduct) {
    activeProduct = emptyProduct;
  }
  return (
    <Modal open={open} onClose={onClose} aria-labelledby="modal-modal-title" aria-describedby="modal-modal-description">
      <Box sx={style} style={{ width: window.innerWidth < 440 ? 300 : 400 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <Typography id="modal-modal-title" variant="h6" component="h2">
            {edit ? 'Изменить товар' : 'Создать товар'}
          </Typography>
          <Button variant="text" sx={{ mt: -3, mr: -3 }} onClick={onClose}>
            <svg focusable="false" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
              <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z" />
            </svg>
          </Button>
        </div>
        <Typography id="modal-modal-description" sx={{ mt: 2, mb: 3 }}>
          {edit ? 'Заполните все поля и нажмите "Изменить".' : 'Заполните все поля и нажмите "Добавить".'}
        </Typography>
        <form onSubmit={handleAddProduct}>
          <Stack spacing={3}>
            {
              edit ?
                <TextField name="name" label="Наименование" required type="text" value={activeProduct.name} InputProps={{ readOnly: true, }} variant="filled" color="success" focused />
                :
                <TextField name="name" label="Наименование" required type="text" />
            }

            <TextField name="articul" label="Артикул" type={'number'} required defaultValue={activeProduct.articul} />
            <TextField
              name="quantity"
              label="Количество"
              type={'number'}
              required
              defaultValue={activeProduct.quantity}
            />
            <TextField name="price" label="Стоимость" type={'number'} required defaultValue={activeProduct.price} />
            <Button variant="contained" type="submit">
              {edit ? 'Изменить' : 'Создать'}
            </Button>
          </Stack>
        </form>
      </Box>
    </Modal>
  );
}

export default function ProductPage() {
  const [productList, setProductList] = useState(PRODUCTLIST);

  const [blockTable, setBlockTable] = useState(window.innerWidth <= 850);

  window.addEventListener('resize', (event) => {
    if (window.innerWidth <= 850) {
      setBlockTable(true);
    } else {
      setBlockTable(false);
    }
  }, true);

  const [open, setOpen] = useState(null);

  const [page, setPage] = useState(0);

  const [order, setOrder] = useState('asc');

  const [selected, setSelected] = useState([]);

  const [orderBy, setOrderBy] = useState('name');

  const [filterName, setFilterName] = useState('');

  const [rowsPerPage, setRowsPerPage] = useState(5);

  const handleOpenMenu = (event, product) => {
    setOpen(event.currentTarget);
    setActiveProduct(product)
  };

  const handleCloseMenu = () => {
    setOpen(null);
  };

  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const handleSelectAllClick = (event) => {
    if (event.target.checked) {
      const newSelecteds = productList.map((n) => n.name);
      setSelected(newSelecteds);
      return;
    }
    setSelected([]);
  };

  const handleClick = (event, name) => {
    const selectedIndex = selected.indexOf(name);
    let newSelected = [];
    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, name);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selected.slice(1));
    } else if (selectedIndex === selected.length - 1) {
      newSelected = newSelected.concat(selected.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(selected.slice(0, selectedIndex), selected.slice(selectedIndex + 1));
    }
    setSelected(newSelected);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setPage(0);
    setRowsPerPage(parseInt(event.target.value, 10));
  };

  const handleFilterByName = (event) => {
    setPage(0);
    setFilterName(event.target.value);
  };

  const emptyRows = page > 0 ? Math.max(0, (1 + page) * rowsPerPage - productList.length) : 0;

  const filteredProducts = applySortFilter(productList, getComparator(order, orderBy), filterName);

  const isNotFound = !filteredProducts.length && !!filterName;

  // ----------------------------------------------------------------------
  const productModalStyle = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: 'background.paper',
    border: '2px solid rgba(145, 158, 171, 0.12)',
    boxShadow: 24,
    p: 4,
  };

  const [openProductModal, setOpenProductModal] = useState(false);
  const handleOpenProductModal = () => setOpenProductModal(true);
  const handleCloseProductModal = () => {
    setActiveProduct(null);
    setOpenProductModal(false)
  };
  const handleAddProduct = (e) => {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    const newProduct = {
      name: data.get('name'),
      price: data.get('price'),
      articul: data.get('articul'),
      quantity: data.get('quantity')
    }
    if (activeProduct) {
      setProductList(productList.map(product => {
        if (product.name === activeProduct.name) {
          return newProduct;
        }
        return product;
      }));

      setActiveProduct(null);
    } else {
      setProductList(prev => [newProduct, ...prev])
    }

    handleCloseProductModal();
  }

  const [activeProduct, setActiveProduct] = useState(null);

  const handleDeleteProduct = () => {
    setProductList(prev => prev.filter(product => product.name !== activeProduct.name));
    handleCloseMenu();
    setActiveProduct(null);
  }

  const handleEditProduct = () => {
    setOpenProductModal(true);
    handleCloseMenu();
  }

  const handleDeleteSelected = () => {
    console.log(selected)
    setProductList(prev => prev.filter(product => selected.every(selectedProductName => selectedProductName !== product.name)));
    setSelected([]);
  }

  return (
    <>
      <Helmet>
        <title> Товары </title>
      </Helmet>

      <Container>
        <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
          <Typography variant="h4" gutterBottom>
            Товары
          </Typography>
          <Button variant="contained" startIcon={<Iconify icon="eva:plus-fill" />} onClick={handleOpenProductModal}>
            Добавить товар
          </Button>
        </Stack>

        <Card>

          <ProductListToolbar numSelected={selected.length} filterName={filterName} onFilterName={handleFilterByName} onDelete={handleDeleteSelected} />



          <Scrollbar>
            <TableContainer>
              <Table>

                {
                  blockTable ?
                    <>
                    </>
                    :
                    <ProductListHead
                      order={order}
                      orderBy={orderBy}
                      headLabel={TABLE_HEAD}
                      rowCount={productList.length}
                      numSelected={selected.length}
                      onRequestSort={handleRequestSort}
                      onSelectAllClick={handleSelectAllClick}
                    />
                }
                <TableBody>
                  {filteredProducts.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row) => {
                    const { id, name, articul, quantity, price } = row;
                    const selectedProduct = selected.indexOf(name) !== -1;

                    return (

                      !blockTable ?
                        (
                          <TableRow hover key={id} tabIndex={-1} role="checkbox" selected={selectedProduct} >
                            <TableCell padding="checkbox">
                              <Checkbox checked={selectedProduct} onChange={(event) => handleClick(event, name)} />
                            </TableCell>

                            <TableCell component="th" scope="row" padding="none">
                              <Stack direction="row" alignItems="center" spacing={2}>
                                <Typography variant="subtitle2" noWrap >
                                  {name}
                                </Typography>
                              </Stack>
                            </TableCell>
                            <TableCell align="left">{articul}</TableCell>
                            <TableCell align="left">{quantity}</TableCell>
                            <TableCell align="left">{price} $</TableCell>
                            <TableCell align="right">
                              <IconButton size="large" color="inherit" onClick={(event) => handleOpenMenu(event, row)}>
                                <Iconify icon={'eva:more-vertical-fill'} />
                              </IconButton>
                            </TableCell>
                          </TableRow>
                        )
                        :
                        (
                          <TableRow hover key={id} tabIndex={-1} role="checkbox" selected={selectedProduct} >


                            {
                              window.innerWidth < 410 ? (
                                <TableCell align="right" styles={{ width: 30 }}>
                                  <Checkbox checked={selectedProduct} onChange={(event) => handleClick(event, name)} />
                                  <IconButton size="large" color="inherit" onClick={(event) => handleOpenMenu(event, row)}>
                                    <Iconify icon={'eva:more-vertical-fill'} />
                                  </IconButton>
                                </TableCell>
                              ) : (
                                <TableCell padding="checkbox">
                                  <Checkbox checked={selectedProduct} onChange={(event) => handleClick(event, name)} />
                                </TableCell>
                              )
                            }
                            <div style={{ display: 'flex', justifyContent: window.innerWidth < 410 ? 'left' : 'space-between' }}>
                              <TableCell align="left" style={{ width: '45%', display: 'flex', marginRight: '14px' }}>Наименование:</TableCell>
                              <TableCell component="th" scope="row" padding="none" style={{
                                width: '45%', display: 'flex', marginLeft: window.innerWidth < 410 ? '20px' : '0'
                              }}>
                                < Stack direction="row" alignItems="center" spacing={2} >
                                  <Typography variant="subtitle2" style={{ whiteSpace: 'preWrap' }} >
                                    {name}
                                  </Typography>
                                </Stack>
                              </TableCell>
                            </div>
                            <div style={{ display: 'flex', justifyContent: window.innerWidth < 410 ? 'left' : 'space-between' }}>
                              <TableCell align="left" style={{ width: '45%', display: 'flex' }}>Артикул:</TableCell>
                              <TableCell align="left" style={{ width: '45%', display: 'flex', marginLeft: window.innerWidth < 410 ? '20px' : '0' }}>{articul}</TableCell>
                            </div>
                            <div style={{ display: 'flex', justifyContent: window.innerWidth < 410 ? 'left' : 'space-between' }}>
                              <TableCell align="left" style={{ width: '45%', display: 'flex' }}>Кол-во</TableCell>
                              <TableCell align="left" style={{ width: '45%', display: 'flex', marginLeft: window.innerWidth < 410 ? '20px' : '0' }}>{quantity}</TableCell>
                            </div>
                            <div style={{ display: 'flex', justifyContent: window.innerWidth < 410 ? 'left' : 'space-between' }}>
                              <TableCell align="left" style={{ width: '45%', display: 'flex' }}>Стоимость:</TableCell>
                              <TableCell align="left" style={{ width: '45%', display: 'flex', marginLeft: window.innerWidth < 410 ? '20px' : '0' }}>{price} $</TableCell>
                            </div>

                            {
                              window.innerWidth < 410 ? <></> : (
                                <TableCell align="right">
                                  <IconButton size="large" color="inherit" onClick={(event) => handleOpenMenu(event, row)}>
                                    <Iconify icon={'eva:more-vertical-fill'} />
                                  </IconButton>
                                </TableCell>
                              )
                            }
                          </TableRow>
                        )


                    );
                  })}
                  {emptyRows > 0 && (
                    <TableRow style={{ height: 53 * emptyRows }}>
                      <TableCell colSpan={6} />
                    </TableRow>
                  )}
                </TableBody>

                {isNotFound && (
                  <TableBody>
                    <TableRow>
                      <TableCell align="center" colSpan={6} sx={{ py: 3 }}>
                        <Paper
                          sx={{
                            textAlign: 'center',
                          }}
                        >
                          <Typography variant="h6" paragraph>
                            Не найдено
                          </Typography>

                          <Typography variant="body2">
                            Нет результатов для &nbsp;
                            <strong>&quot;{filterName}&quot;</strong>.
                            <br /> Проверьте опечатки или используйте законченные слова.
                          </Typography>
                        </Paper>
                      </TableCell>
                    </TableRow>
                  </TableBody>
                )}
              </Table>
            </TableContainer>
          </Scrollbar>

          <TablePagination
            rowsPerPageOptions={[5, 10, 25]}
            component="div"
            count={productList.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </Card>
      </Container >

      <ProductModal open={openProductModal} onClose={handleCloseProductModal} style={productModalStyle} activeProduct={activeProduct} edit={activeProduct} handleAddProduct={handleAddProduct} />

      <Popover
        open={Boolean(open)}
        anchorEl={open}
        onClose={handleCloseMenu}
        anchorOrigin={{ vertical: 'top', horizontal: 'left' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
        PaperProps={{
          sx: {
            p: 1,
            width: 180,
            '& .MuiMenuItem-root': {
              px: 1,
              typography: 'body2',
              borderRadius: 0.75,
            },
          },
        }}
      >
        <MenuItem>
          <button style={{ backgroundColor: "transparent", border: 'none', padding: '0' }} onClick={handleEditProduct}>
            <Iconify icon={'eva:edit-fill'} sx={{ mr: 2 }} />
            Редактировать
          </button>
        </MenuItem>

        <MenuItem sx={{ color: 'error.main' }}>
          <button style={{ backgroundColor: "transparent", border: 'none', padding: '0' }} onClick={handleDeleteProduct}>
            <Iconify icon={'eva:trash-2-outline'} sx={{ mr: 2 }} onClick={handleDeleteProduct} />
            Удалить
          </button>
        </MenuItem>
      </Popover>
    </>
  );
}
