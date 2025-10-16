import React, { useState, useMemo } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  useMediaQuery,
  Collapse,
  IconButton,
  TextField,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  TablePagination,
  Box,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";

const TableComponent = ({ users }) => {
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("sm"));
  const [open, setOpen] = useState({});
  const [filter, setFilter] = useState({
    user: "",
    price: "",
    remainingBalance: "",
    propertyType: "",
  });
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const propertiesUnderPayment = useMemo(
    () =>
      users?.flatMap((user) =>
        user.propertyUnderPayment.map((property) => ({
          propertyId: property.propertyId,
          userEmail: property.userEmail,
          propertyType: property.propertyType,
          propertyPrice: property.paymentHistory[0]?.propertyPrice,
          remainingBalance: property.paymentHistory[0]?.remainingBalance,
          userName: user.name,
        }))
      ),
    [users]
  );

  const handleRowClick = (index) => {
    setOpen((prevState) => ({ ...prevState, [index]: !prevState[index] }));
  };

  const handleFilterChange = (event) => {
    const { name, value } = event.target;
    setFilter((prevState) => ({ ...prevState, [name]: value }));
  };

  const filteredProperties = useMemo(() => {
    return propertiesUnderPayment?.filter((property) => {
      const priceInRange = filter.price
        ? property.propertyPrice >= parseInt(filter.price.split("-")[0], 10) &&
          property.propertyPrice <= parseInt(filter.price.split("-")[1], 10)
        : true;
      const remainingBalanceInRange = filter.remainingBalance
        ? property.remainingBalance >=
            parseInt(filter.remainingBalance.split("-")[0], 10) &&
          property.remainingBalance <=
            parseInt(filter.remainingBalance.split("-")[1], 10)
        : true;
      return (
        (filter.user
          ? property.userName.toLowerCase().includes(filter.user.toLowerCase())
          : true) &&
        priceInRange &&
        remainingBalanceInRange &&
        (filter.propertyType
          ? property.propertyType.toLowerCase() ===
            filter.propertyType.toLowerCase()
          : true)
      );
    });
  }, [propertiesUnderPayment, filter]);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const paginatedProperties = useMemo(() => {
    const startIndex = page * rowsPerPage;
    return filteredProperties?.slice(startIndex, startIndex + rowsPerPage);
  }, [filteredProperties, page, rowsPerPage]);

  return (
    <TableContainer component={Paper} sx={{ overflow: "auto" }}>
      <h1 className="text-4xl font-bold m-4 p-4">PROPERTIES UNDER PAYMENT</h1>

      <Box
        sx={{ padding: "16px", display: "flex", gap: "16px", flexWrap: "wrap" }}
      >
        <TextField
          name="user"
          label="User"
          value={filter.user}
          onChange={handleFilterChange}
          variant="outlined"
          size="small"
        />
        <FormControl variant="outlined" size="small">
          <InputLabel>Price</InputLabel>
          <Select
            name="price"
            value={filter.price}
            onChange={handleFilterChange}
            label="Price"
          >
            <MenuItem value="">
              <em>None</em>
            </MenuItem>
            <MenuItem value="100000-500000">100,000 - 500,000</MenuItem>
            <MenuItem value="500001-1000000">500,001 - 1,000,000</MenuItem>
            <MenuItem value="1000001-5000000">1,000,001 - 5,000,000</MenuItem>
            <MenuItem value="5000001-10000000">5,000,001 - 10,000,000</MenuItem>
          </Select>
        </FormControl>
        <FormControl variant="outlined" size="small">
          <InputLabel>Remaining Balance</InputLabel>
          <Select
            name="remainingBalance"
            value={filter.remainingBalance}
            onChange={handleFilterChange}
            label="Remaining Balance"
          >
            <MenuItem value="">
              <em>None</em>
            </MenuItem>
            <MenuItem value="10000-100000">10,000 - 100,000</MenuItem>
            <MenuItem value="100001-500000">100,001 - 500,000</MenuItem>
            <MenuItem value="500001-1000000">500,001 - 1,000,000</MenuItem>
            <MenuItem value="1000001-5000000">1,000,001 - 5,000,000</MenuItem>
            <MenuItem value="5000001-10000000">5,000,001 - 10,000,000</MenuItem>
          </Select>
        </FormControl>
        <FormControl variant="outlined" size="small">
          <InputLabel>Property Type</InputLabel>
          <Select
            name="propertyType"
            value={filter.propertyType}
            onChange={handleFilterChange}
            label="Property Type"
          >
            <MenuItem value="">
              <em>None</em>
            </MenuItem>
            <MenuItem value="House">House</MenuItem>
            <MenuItem value="Farm">Farm</MenuItem>
            <MenuItem value="Land">Land</MenuItem>
          </Select>
        </FormControl>
      </Box>

      <Table sx={{ minWidth: isSmallScreen ? 300 : 650 }}>
        <TableHead>
          <TableRow>
            {isSmallScreen ? (
              <>
                <TableCell />
                <TableCell>Details</TableCell>
              </>
            ) : (
              <>
                <TableCell>Property Type</TableCell>
                <TableCell>User</TableCell>
                <TableCell>Price</TableCell>
                <TableCell>Remaining Balance</TableCell>
              </>
            )}
          </TableRow>
        </TableHead>
        <TableBody>
          {paginatedProperties?.map((property, index) => (
            <React.Fragment key={index}>
              <TableRow>
                {isSmallScreen && (
                  <TableCell>
                    <IconButton
                      aria-label="expand row"
                      size="small"
                      onClick={() => handleRowClick(index)}
                    >
                      {open[index] ? (
                        <KeyboardArrowUpIcon />
                      ) : (
                        <KeyboardArrowDownIcon />
                      )}
                    </IconButton>
                  </TableCell>
                )}
                <TableCell>{property.propertyType}</TableCell>
                {!isSmallScreen && (
                  <>
                    <TableCell>{property.userName}</TableCell>
                    <TableCell>{property.propertyPrice}</TableCell>
                    <TableCell>{property.remainingBalance}</TableCell>
                  </>
                )}
              </TableRow>
              {isSmallScreen && (
                <TableRow>
                  <TableCell
                    colSpan={2}
                    sx={{ paddingBottom: 0, paddingTop: 0 }}
                  >
                    <Collapse in={open[index]} timeout="auto" unmountOnExit>
                      <div>
                        <p>
                          <strong>User:</strong> {property.userName}
                        </p>
                        <p>
                          <strong>Price:</strong> {property.propertyPrice}
                        </p>
                        <p>
                          <strong>Remaining Balance:</strong>{" "}
                          {property.remainingBalance}
                        </p>
                      </div>
                    </Collapse>
                  </TableCell>
                </TableRow>
              )}
            </React.Fragment>
          ))}
        </TableBody>
      </Table>
      <TablePagination
        rowsPerPageOptions={[5, 10, 25]}
        component="div"
        count={filteredProperties?.length || 0}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
    </TableContainer>
  );
};

export default TableComponent;
