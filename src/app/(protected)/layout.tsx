'use client';

import { useAppSelector } from '@/lib/hooks';
import { useRouter, usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import { AppRoutes } from '@/constants/routes';
import LoadingSpinner from '../components/ui/LoadingSpinner';

import {
    AppBar,
    Toolbar,
    IconButton,
    Typography,
    Drawer,
    List,
    ListItem,
    ListItemIcon,
    ListItemText,
    Divider,
    Box,
    CssBaseline,
    useMediaQuery,
    Badge,
    Menu,
    MenuItem,
    Avatar,
    
} from "@mui/material";

import {
    Menu as MenuIcon,
    Notifications as NotificationsIcon,
    Mail as MailIcon,
    Settings as SettingsIcon,
    Dashboard as DashboardIcon,
    People as PeopleIcon,
    BarChart as BarChartIcon,
    Business,
    BookSharp,
    BookmarkSharp,
    Class,
    Layers,
    School,
    CurrencyRupee,
    LocalOffer,
    ViewModule,
    MenuBook,
    Groups,
    AssignmentInd,
    Assignment,
    EventNote,
} from "@mui/icons-material";

import { useTheme } from "@mui/material/styles";
import { useLogout } from '@/lib/features/auth/useLogout';

const drawerWidth = 240;

interface layoutParams {
    children: React.ReactNode;
}

const ProtectedLayout = ({ children }: layoutParams) => {

    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
    const router = useRouter();
    const pathname = usePathname();

    const { isAuthenticated, initialCheckDone, user } = useAppSelector(state => state.auth);
    const { logout } = useLogout();

    const [open, setOpen] = useState(!isMobile);
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => {
        setIsMounted(true);
    }, []);

    useEffect(() => {
        if (isMounted && initialCheckDone && !isAuthenticated) {
            if (!pathname.startsWith(AppRoutes.LOGIN)) {
                router.push(`${AppRoutes.LOGIN}?redirect=${encodeURIComponent(pathname)}`);
            }
        }
    }, [isMounted, initialCheckDone, isAuthenticated, pathname, router]);

    const handleDrawerToggle = () => setOpen(!open);

    const handleUserMenuOpen = (event: React.MouseEvent<HTMLButtonElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const handleUserMenuClose = () => {
        setAnchorEl(null);
        logout();
    };

    // Menus
    const adminMenu = [
        { text: "Dashboard", icon: <DashboardIcon />, path: AppRoutes.DASHBOARD },
        { text: "Firms", icon: <Business />, path: AppRoutes.FIRMS },
    ];

    const firmAdminMenu = [
        { text: "Dashboard", icon: <DashboardIcon />, path: AppRoutes.DASHBOARD },
        { text: "Staff", icon: <PeopleIcon />, path: AppRoutes.STAFF },

        { text: "Courses", icon: <BookSharp />, path: AppRoutes.COURSES },

        { text: "Modules", icon: <BookSharp />, path: AppRoutes.MODULES },

        // { text: "Courses Fees", icon: <BookSharp />, path: AppRoutes.FEES },
        { text: "Batches", icon: <BookSharp />, path: AppRoutes.BATCHES },
        { text: "Students", icon: <PeopleIcon />, path: AppRoutes.STUDENTS },
        { text: "Exams", icon: <PeopleIcon />, path: AppRoutes.EXAMS },



        // { text: "ClassRooms", icon: <Class/>, path: AppRoutes.CLASSROOM },
        // { text: "Batch", icon: <Layers />, path: AppRoutes.BATCH },

        // { text: "Admissions", icon: <PeopleIcon />, path: AppRoutes.ADMISSIONS },

        // { text: "Courses Category", icon: <BookmarkSharp />, path: AppRoutes.COURSE_CATEGORY },
        // { text: "Discounts", icon: <BookSharp />, path: AppRoutes.DISCOUNTS },

        // { text: "Course Modules", icon: <BookSharp />, path: AppRoutes.COURSE_MODULES },

        // { text: "Batch Assignments", icon: <BookSharp />, path: AppRoutes.STUDENT_BATCH_ASSIGNMENTS },
       
        // { text: "Batch StudyWorks", icon: <BookSharp />, path: AppRoutes.BATCH_STUDYWORK},

        // { text: "Batch Schedules", icon: <BookSharp />, path: AppRoutes.BATCH_SCHEDULES},


        

        // { text: "Reports", icon: <BarChartIcon />, path: "/reports" },
    ];

    const menuItems = user?.roles?.includes("Administrator")
        ? adminMenu
        : firmAdminMenu;

    if (!isMounted) return null;

    if (!initialCheckDone) {
        return (
            <div className="flex justify-center items-center h-screen">
                <LoadingSpinner text="Verifying session..." />
            </div>
        );
    }

    if (!isAuthenticated) {
        return (
            <div className="flex justify-center items-center h-screen">
                <LoadingSpinner text="Redirecting to login..." />
            </div>
        );
    }

    return (
        <Box sx={{ display: "flex" }}>
            <CssBaseline />

            <style jsx global>{`
                @media print {
                    .MuiDrawer-root,
                    .MuiAppBar-root {
                        display: none !important;
                    }
                    main {
                        width: 100% !important;
                        padding: 0 !important;
                    }
                }
            `}</style>

            {/* Top Bar */}
            <AppBar
                position="fixed"
                sx={{
                    zIndex: (theme) => theme.zIndex.drawer + 1,
                    backgroundColor: "background.paper",
                    color: "text.primary",
                    boxShadow: "none",
                    borderBottom: "1px solid",
                    borderColor: "divider",
                }}
            >
                <Toolbar>

                    <Box sx={{ display: "flex", alignItems: "center" }}>
                        <IconButton
                            color="inherit"
                            edge="start"
                            onClick={handleDrawerToggle}
                            sx={{ mr: 2 }}
                        >
                            <MenuIcon />
                        </IconButton>

                        <Typography variant="h6" noWrap>
                            Admin Panel
                        </Typography>
                    </Box>

                    <Box sx={{ flexGrow: 1 }} />

                    <Box sx={{ display: "flex", gap: 1 }}>
                        <IconButton color="inherit">
                            <Badge badgeContent={4} color="error">
                                <MailIcon />
                            </Badge>
                        </IconButton>

                        <IconButton color="inherit">
                            <Badge badgeContent={3} color="error">
                                <NotificationsIcon />
                            </Badge>
                        </IconButton>

                        <IconButton color="inherit">
                            <SettingsIcon />
                        </IconButton>

                        <IconButton onClick={handleUserMenuOpen} sx={{ p: 0, ml: 1 }}>
                            <Avatar alt="User" src="/avatar3.png" />
                        </IconButton>

                        <Menu
                            anchorEl={anchorEl}
                            open={Boolean(anchorEl)}
                            onClose={() => setAnchorEl(null)}
                        >
                            <MenuItem onClick={() => { setAnchorEl(null); router.push(AppRoutes.PROFILE); }}>
                                Profile
                            </MenuItem>

                            <MenuItem onClick={() => setAnchorEl(null)}>
                                Settings
                            </MenuItem>

                            <Divider />

                            <MenuItem onClick={handleUserMenuClose}>
                                Logout
                            </MenuItem>
                        </Menu>
                    </Box>

                </Toolbar>
            </AppBar>

            {/* Sidebar */}
            <Drawer
                variant={isMobile ? "temporary" : "permanent"}
                open={open}
                onClose={handleDrawerToggle}
                sx={{
                    width: open ? drawerWidth : theme.spacing(7),
                    flexShrink: 0,
                    whiteSpace: "nowrap",
                    boxSizing: "border-box",
                    "& .MuiDrawer-paper": {
                        width: open ? drawerWidth : theme.spacing(7),
                        overflowX: "hidden",
                        transition: theme.transitions.create("width", {
                            easing: theme.transitions.easing.sharp,
                            duration: open
                                ? theme.transitions.duration.enteringScreen
                                : theme.transitions.duration.leavingScreen,
                        }),
                    },
                }}
            >
                <Toolbar />
                <List>
                    {menuItems.map((item) => (
                        <ListItem
                            key={item.text}
                            component="a"
                            href={item.path}
                            sx={{
                                "&.Mui-selected": {
                                    backgroundColor: "rgba(0,0,0,0.04)",
                                },
                            }}
                        >
                            <ListItemIcon>{item.icon}</ListItemIcon>
                            {open && <ListItemText primary={item.text} />}
                        </ListItem>
                    ))}
                </List>
            </Drawer>

            {/* Main Content */}
            <Box
                component="main"
                sx={{
                    flexGrow: 1,
                    p: 3,
                    width: `calc(100% - ${open ? drawerWidth : theme.spacing(7)}px)`,
                }}
            >
                <Toolbar />
                {children}
            </Box>
        </Box>
    );
};

export default ProtectedLayout;
