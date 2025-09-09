
'use client'
import React from 'react';
import {
    Box,
    Typography,
    IconButton,
    Paper,
    Pagination,
    Select,
    MenuItem,
    FormControl,
    InputLabel,
    Stack,
    SelectChangeEvent,
    useMediaQuery,
    Theme,
    CardContent,
    Collapse,
    TableSortLabel,
    Button
} from '@mui/material';
import { ArrowBack, Edit, Visibility, Delete, KeyboardArrowDown, KeyboardArrowUp, Add } from '@mui/icons-material';
import { DataGrid, GridColDef, GridSortModel } from '@mui/x-data-grid';
import Link from 'next/link';
import { useFirmsViewModel } from '@/lib/features/firm/useFirmsViewModel';

const FirmList: React.FC = () => {
    const isMobile = useMediaQuery((theme: Theme) => theme.breakpoints.down('sm'));

    // Use the ViewModel
    const {
        firms,
        isLoading,
        error,
        page,
        totalPages,
        searchTerm,
        activeOnly,
        handleSearch,
        handleToggleActive,
        handleResetFilters,
        handlePageChange
    } = useFirmsViewModel();

    // State for UI controls
    const [rowsPerPage, setRowsPerPage] = React.useState(5);
    const [sortModel, setSortModel] = React.useState<GridSortModel>([{ field: 'firmId', sort: 'asc' }]);
    const [expandedRows, setExpandedRows] = React.useState<number[]>([]);

    const handleChangeRowsPerPage = (event: SelectChangeEvent) => {
        setRowsPerPage(Number(event.target.value));
        handlePageChange(1); // Reset to first page when rows per page changes
    };

    const handleSortModelChange = (newModel: GridSortModel) => {
        setSortModel(newModel);
    };

    const toggleRowExpand = (id: number) => {
        setExpandedRows(prev =>
            prev.includes(id) ? prev.filter(rowId => rowId !== id) : [...prev, id]
        );
    };

    // Calculate current page data
    const startIndex = (page - 1) * rowsPerPage;
    const endIndex = startIndex + rowsPerPage;

    // Sort data
    const sortedFirms = [...firms].sort((a, b) => {
        const sortItem = sortModel[0];
        if (!sortItem) return 0;

        const aValue = a[sortItem.field as keyof typeof a];
        const bValue = b[sortItem.field as keyof typeof b];

        if (aValue === undefined && bValue === undefined) return 0;
        if (aValue === undefined) return sortItem.sort === 'asc' ? 1 : -1;
        if (bValue === undefined) return sortItem.sort === 'asc' ? -1 : 1;

        if (typeof aValue === 'boolean' && typeof bValue === 'boolean') {
            return sortItem.sort === 'asc'
                ? (aValue === bValue ? 0 : aValue ? -1 : 1)
                : (aValue === bValue ? 0 : aValue ? 1 : -1);
        }

        const aString = String(aValue);
        const bString = String(bValue);

        return sortItem.sort === 'asc'
            ? aString.localeCompare(bString)
            : bString.localeCompare(aString);
    });

    const currentFirms = sortedFirms.slice(startIndex, endIndex);

    // Columns configuration
    const columns: GridColDef[] = [
        {
            field: 'firmId',
            headerName: 'ID',
            width: 80,
            renderHeader: () => {
                const isActive = sortModel[0]?.field === 'firmId';
                const direction = isActive ? sortModel[0]?.sort as 'asc' | 'desc' : undefined;

                return (
                    <TableSortLabel
                        active={isActive}
                        direction={direction}
                        onClick={() => {
                            setSortModel([{
                                field: 'firmId',
                                sort: isActive
                                    ? sortModel[0]?.sort === 'asc' ? 'desc' : 'asc'
                                    : 'asc'
                            }]);
                        }}
                    >
                        ID
                    </TableSortLabel>
                );
            }
        },
        {
            field: 'firmName',
            headerName: 'Firm Name',
            flex: 1,
            renderHeader: () => {
                const isActive = sortModel[0]?.field === 'firmName';
                const direction = isActive ? sortModel[0]?.sort as 'asc' | 'desc' : undefined;

                return (
                    <TableSortLabel
                        active={isActive}
                        direction={direction}
                        onClick={() => {
                            setSortModel([{
                                field: 'firmName',
                                sort: isActive
                                    ? sortModel[0]?.sort === 'asc' ? 'desc' : 'asc'
                                    : 'asc'
                            }]);
                        }}
                    >
                        Firm Name
                    </TableSortLabel>
                );
            }
        },
        {
            field: 'firmCode',
            headerName: 'Firm Code',
            width: 120,
            renderHeader: () => {
                const isActive = sortModel[0]?.field === 'firmCode';
                const direction = isActive ? sortModel[0]?.sort as 'asc' | 'desc' : undefined;

                return (
                    <TableSortLabel
                        active={isActive}
                        direction={direction}
                        onClick={() => {
                            setSortModel([{
                                field: 'firmCode',
                                sort: isActive
                                    ? sortModel[0]?.sort === 'asc' ? 'desc' : 'asc'
                                    : 'asc'
                            }]);
                        }}
                    >
                        Firm Code
                    </TableSortLabel>
                );
            }
        },
        {
            field: 'isActive',
            headerName: 'Status',
            width: 120,
            renderCell: (params) => (
                <Box
                    sx={{
                        color: params.value ? 'success.main' : 'error.main',
                        fontWeight: 'bold'
                    }}
                >
                    {params.value ? 'Active' : 'Inactive'}
                </Box>
            ),
            renderHeader: () => {
                const isActive = sortModel[0]?.field === 'isActive';
                const direction = isActive ? sortModel[0]?.sort as 'asc' | 'desc' : undefined;

                return (
                    <TableSortLabel
                        active={isActive}
                        direction={direction}
                        onClick={() => {
                            setSortModel([{
                                field: 'isActive',
                                sort: isActive
                                    ? sortModel[0]?.sort === 'asc' ? 'desc' : 'asc'
                                    : 'asc'
                            }]);
                        }}
                    >
                        Status
                    </TableSortLabel>
                );
            }
        },
        {
            field: 'actions',
            headerName: 'Actions',
            sortable: false,
            width: 200,
            renderCell: () => (
                <Stack direction="row" spacing={1}>
                    <IconButton size="small" color="info">
                        <Visibility fontSize="small" />
                    </IconButton>
                    <IconButton size="small" color="primary">
                        <Edit fontSize="small" />
                    </IconButton>
                    <IconButton size="small" color="error">
                        <Delete fontSize="small" />
                    </IconButton>
                </Stack>
            )
        }
    ];

    if (isLoading) return <Box sx={{ p: 3 }}>Loading firms...</Box>;
    if (error) return <Box sx={{ p: 3, color: 'error.main' }}>Error: {error}</Box>;

    return (
        <Box sx={{ p: isMobile ? 1 : 3 }}>
            {/* Header */}
            <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mb: 3 }}>
                <Stack direction="row" alignItems="center" spacing={2}>
                    <IconButton aria-label="back" size={isMobile ? 'small' : 'medium'}>
                        <ArrowBack fontSize={isMobile ? 'small' : 'medium'} />
                    </IconButton>
                    <Typography variant={isMobile ? 'h5' : 'h4'} component="h1">
                        Firm Management
                    </Typography>
                </Stack>
                <Button
                    variant="contained"
                    startIcon={<Add />}
                    size={isMobile ? 'small' : 'medium'}
                    component={Link}
                    href="/firms/create"
                >
                    Add New Firm
                </Button>
            </Stack>

            {/* Search and Filters */}
            <Box sx={{ mb: 3, p: 2, bgcolor: 'background.paper', borderRadius: 1 }}>
                <Stack direction={isMobile ? 'column' : 'row'} spacing={2} alignItems="center">
                    <FormControl fullWidth size="small">
                        <InputLabel>Search</InputLabel>
                        <Select
                            value={searchTerm}
                            onChange={(e) => handleSearch(e.target.value)}
                            label="Search"
                        >
                            <MenuItem value="">
                                <em>All Firms</em>
                            </MenuItem>
                            {/* Add any predefined search terms if needed */}
                        </Select>
                    </FormControl>

                    <Button
                        variant={activeOnly ? 'contained' : 'outlined'}
                        onClick={handleToggleActive}
                        size="small"
                    >
                        {activeOnly ? 'Active Only' : 'Show All'}
                    </Button>

                    <Button
                        variant="outlined"
                        onClick={handleResetFilters}
                        size="small"
                    >
                        Reset Filters
                    </Button>
                </Stack>
            </Box>

            {/* Pagination controls */}
            <Box sx={{
                display: 'flex',
                flexDirection: isMobile ? 'column' : 'row',
                gap: isMobile ? 2 : 0,
                justifyContent: 'space-between',
                alignItems: 'center',
                mb: 2
            }}>
                <FormControl size="small" sx={{ minWidth: 120 }}>
                    <InputLabel>Rows</InputLabel>
                    <Select
                        value={rowsPerPage.toString()}
                        label="Rows"
                        onChange={handleChangeRowsPerPage}
                    >
                        {[5, 10, 25].map((option) => (
                            <MenuItem key={option} value={option}>
                                {option}
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>

                <Typography variant="body2" sx={{ textAlign: isMobile ? 'center' : 'left' }}>
                    Page {page} of {totalPages} | Total: {firms.length} firms
                </Typography>

                <Pagination
                    count={totalPages}
                    page={page}
                    onChange={(_, newPage) => handlePageChange(newPage)}
                    color="primary"
                    shape="rounded"
                    size={isMobile ? 'small' : 'medium'}
                />
            </Box>

            {/* Desktop DataGrid */}
            {!isMobile ? (
                <Box sx={{ height: 500, width: '100%', mb: 2 }}>
                    <DataGrid
                        rows={currentFirms}
                        columns={columns}
                        hideFooter
                        sortingMode="server"
                        sortModel={sortModel}
                        onSortModelChange={handleSortModelChange}
                        disableColumnMenu
                        getRowId={(row) => row.firmId} // ✅ Use firmId as id

                    />
                </Box>
            ) : (
                /* Mobile Collapsible Table */
                <Box component={Paper} elevation={3} sx={{ mb: 2 }}>
                    {currentFirms.map((firm) => (
                        <Box key={firm.firmId}>
                            <Box
                                sx={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'space-between',
                                    p: 2,
                                    borderBottom: '1px solid',
                                    borderColor: 'divider',
                                    cursor: 'pointer',
                                    '&:hover': { backgroundColor: 'action.hover' }
                                }}
                                onClick={() => toggleRowExpand(firm.firmId)}
                            >
                                <Box>
                                    <Typography fontWeight="bold">{firm.firmName}</Typography>
                                    <Typography variant="body2">ID: {firm.firmId}</Typography>
                                </Box>
                                <IconButton size="small">
                                    {expandedRows.includes(firm.firmId) ? <KeyboardArrowUp /> : <KeyboardArrowDown />}
                                </IconButton>
                            </Box>

                            <Collapse in={expandedRows.includes(firm.firmId)}>
                                <CardContent>
                                    <Stack spacing={1}>
                                        <Box>
                                            <Typography variant="caption" color="text.secondary">Firm Code</Typography>
                                            <Typography>{firm.firmCode || '-'}</Typography>
                                        </Box>
                                        <Box>
                                            <Typography variant="caption" color="text.secondary">Status</Typography>
                                            <Typography color={firm.isActive ? 'success.main' : 'error.main'}>
                                                {firm.isActive ? 'Active' : 'Inactive'}
                                            </Typography>
                                        </Box>
                                        <Stack direction="row" spacing={1} sx={{ mt: 1 }}>
                                            <Button
                                                variant="outlined"
                                                size="small"
                                                startIcon={<Visibility />}
                                                fullWidth
                                            >
                                                View
                                            </Button>
                                            <Button
                                                variant="outlined"
                                                size="small"
                                                startIcon={<Edit />}
                                                color="primary"
                                                fullWidth
                                            >
                                                Edit
                                            </Button>
                                            <Button
                                                variant="outlined"
                                                size="small"
                                                startIcon={<Delete />}
                                                color="error"
                                                fullWidth
                                            >
                                                Delete
                                            </Button>
                                        </Stack>
                                    </Stack>
                                </CardContent>
                            </Collapse>
                        </Box>
                    ))}
                </Box>
            )}

            {/* Bottom pagination */}
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3 }}>
                <Pagination
                    count={totalPages}
                    page={page}
                    onChange={(_, newPage) => handlePageChange(newPage)}
                    color="primary"
                    shape="rounded"
                    size={isMobile ? 'small' : 'medium'}
                />
            </Box>
        </Box>
    );
};

export default FirmList;