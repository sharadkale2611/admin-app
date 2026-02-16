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
    ListItemButton,
   
    Button,
} from "@mui/material";

import {
    Menu as MenuIcon,
    Notifications as NotificationsIcon,
    Mail as MailIcon,
    Settings as SettingsIcon,
    Dashboard as DashboardIcon,
    Business as BusinessIcon,
    People as PeopleIcon,
    School as SchoolIcon,
    MenuBook as MenuBookIcon,
    ViewModule as ViewModuleIcon,
    Groups as GroupsIcon,
    Assignment as AssignmentIcon,
    AssignmentInd as AssignmentIndIcon,
    EventNote as EventNoteIcon,
   
    SupervisedUserCircleSharp,
    Campaign,
    Shield,
    VerifiedUser,
} from "@mui/icons-material";

import { useTheme } from "@mui/material/styles";
import { useLogout } from '@/lib/features/auth/useLogout';
import AnimatedEducationBackgroundLight from '../components/ui/AnimatedEducationBackgroundLight';

const drawerWidth = 240;

interface LayoutParams {
    children: React.ReactNode;
}

const ProtectedLayout = ({ children }: LayoutParams) => {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
    const router = useRouter();
    const pathname = usePathname();

    const { isAuthenticated, initialCheckDone, user } = useAppSelector(
        (state) => state.auth
    );

    const { logout } = useLogout();

    const [open, setOpen] = useState(!isMobile);
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => setIsMounted(true), []);

    useEffect(() => {
        if (isMounted && initialCheckDone && !isAuthenticated) {
            router.push(`${AppRoutes.LOGIN}?redirect=${encodeURIComponent(pathname)}`);
        }
    }, [isMounted, initialCheckDone, isAuthenticated, pathname, router]);

    const handleDrawerToggle = () => setOpen(!open);

    const handleUserMenuOpen = (event: React.MouseEvent<HTMLButtonElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const handleLogout = () => {
        setAnchorEl(null);
        logout();
    };

    /* -------------------- MENUS -------------------- */

    const adminMenu = [
        { text: "Dashboard", icon: <DashboardIcon />, path: AppRoutes.DASHBOARD },
        { text: "Firms", icon: <BusinessIcon />, path: AppRoutes.FIRMS },
        { text: "Permissions", icon: <Shield />, path: AppRoutes.PERMISSIONS },
        { text: "Roles", icon: <VerifiedUser />, path: AppRoutes.ROLES },        
    ];

    const firmAdminMenu = [
        { text: "Dashboard", icon: <DashboardIcon />, path: AppRoutes.DASHBOARD },
        { text: "Staff", icon: <AssignmentIndIcon />, path: AppRoutes.STAFF },
        { text: "Courses", icon: <MenuBookIcon />, path: AppRoutes.COURSES },
        { text: "Modules", icon: <ViewModuleIcon />, path: AppRoutes.MODULES },
        { text: "Batches", icon: <GroupsIcon />, path: AppRoutes.BATCHES },
        { text: "Students", icon: <PeopleIcon />, path: AppRoutes.STUDENTS },
        { text: "Exams", icon: <AssignmentIcon />, path: AppRoutes.EXAMS },
        { text: "Exam Marks", icon: <SchoolIcon />, path: AppRoutes.EXAM_MARKS },
        { text: "Attendance", icon: <EventNoteIcon />, path: AppRoutes.ATTENDANCE },
        { text: "Notifications", icon: <Campaign />, path: AppRoutes.NOTICES },

        {text:"Question Types", icon: <MenuBookIcon />, path: AppRoutes.QUESTION_TYPES},
        {text:"Question Type Rules", icon: <MenuBookIcon />, path: AppRoutes.QUESTION_TYPE_RULES},
        {text : "Questions", icon: <MenuBookIcon />, path: AppRoutes.QUESTIONS},
        {text:"Question Options", icon: <MenuBookIcon />, path: AppRoutes.QUESTION_OPTIONS},
        {text:"Question Attachments", icon: <MenuBookIcon />, path: AppRoutes.QUESTION_ANSWER_ATTACHMENTS},
        {text:"Question Answers", icon: <MenuBookIcon />, path: AppRoutes.QUESTION_ANSWERS},

        {text : "Exam Papers", icon: <MenuBookIcon />, path: AppRoutes.EXAM_PAPERS},
        {text : "Exam Attempts", icon: <MenuBookIcon />, path: AppRoutes.EXAM_ATTEMPTS},
        {text : "Exam Attempt Questions", icon: <MenuBookIcon />, path: AppRoutes.EXAM_ATTEMPT_QUESTIONS},
        {text:"Student Answers", icon: <MenuBookIcon />, path: AppRoutes.STUDENT_ANSWERS},
    ];

    const menuItems = user?.roles?.includes("Administrator")
        ? adminMenu
        : firmAdminMenu;

    const firmName = user?.firmName || "Guest";
    const firmCode = (user?.firmCode || "-").toUpperCase();

    useEffect(()=>{
        console.log('current User: ', user)
    }, [user])

    const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'));

    if (!isMounted) return null;

    if (!initialCheckDone || !isAuthenticated) {
        return (
            <div className="flex justify-center items-center h-screen">
                <LoadingSpinner
                    size="lg"
                    label="Preparing your workspace"
                    subLabel="Please wait a moment"
                />
            </div>
        );
    }

    return (
        <Box sx={{ display: "flex" }}>
            <CssBaseline />

            {/* -------------------- TOP BAR -------------------- */}
            <AppBar
                position="fixed"
                sx={{
                    zIndex: (theme) => theme.zIndex.drawer + 1,
                    backgroundColor: "#e8f0f0",
                    color: "text.primary",
                    borderBottom: "1px solid",
                    borderColor: "divider",
                    boxShadow: "none",
                }}
            > 
                <Toolbar>
                    <IconButton edge="start" onClick={handleDrawerToggle} sx={{ mr: 2 }}>
                        <MenuIcon />
                    </IconButton>

                    <Typography variant="h6" noWrap>
                        {isSmallScreen ? firmCode : firmName}
                    </Typography>

                    <Box sx={{ flexGrow: 1 }} />

                    {/* <IconButton>
                    {/* <IconButton>
                        <Badge badgeContent={4} color="error">
                            <MailIcon />
                        </Badge>
                    </IconButton> */}
                  

                    {/* <IconButton>
                    {/* <IconButton>
                        <Badge badgeContent={3} color="error">
                            <NotificationsIcon />
                        </Badge>
                    </IconButton> */}

                       <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Button
                            variant="outlined"
                            color="primary"
                            onClick={() => router.push(AppRoutes.NEW_ADMISSION)}
                            sx={{
                                minWidth: { xs: 40, sm: "auto" },
                                padding: { xs: "6px", sm: "6px 12px" },
                                fontSize: { xs: "0.75rem", sm: "0.875rem" },
                            }}
                        >
                            <SupervisedUserCircleSharp fontSize="small" />

                            <Typography
                                sx={{
                                    ml: 1,
                                    display: { xs: "none", sm: "block" },
                                }}
                            >
                                New Admission
                            </Typography>
                        </Button>

  <IconButton onClick={() => router.push(AppRoutes.SETTINGS)}>
    <SettingsIcon />
  </IconButton>

  <IconButton onClick={handleUserMenuOpen}>
    <Avatar />
  </IconButton>
</Box>

                    <Menu
                        anchorEl={anchorEl}
                        open={Boolean(anchorEl)}
                        onClose={() => setAnchorEl(null)}
                    >
                        <MenuItem onClick={() => router.push(AppRoutes.PROFILE)}>
                            Profile
                        </MenuItem>
                    <MenuItem
  onClick={() => {
    setAnchorEl(null);
    router.push(AppRoutes.SETTINGS);
  }}
>
  Settings
</MenuItem>
                 <Divider />
                        <MenuItem onClick={handleLogout}>Logout</MenuItem>
                    </Menu>
                </Toolbar>
            </AppBar>

            {/* -------------------- SIDEBAR -------------------- */}
            <Drawer
                variant={isMobile ? "temporary" : "permanent"}
                open={open}
                onClose={handleDrawerToggle}
                sx={{
                    width: open ? drawerWidth : theme.spacing(7),
                    "& .MuiDrawer-paper": {
                        width: open ? drawerWidth : theme.spacing(7),
                        backgroundColor:"#f3f3f3",
                        borderRight: "1px solid rgba(0,0,0,0.08)",
                        overflowX: "hidden",
                        transition: theme.transitions.create("width"),
                    },
                }}
            >
                <AnimatedEducationBackgroundLight />
                <Toolbar />

                <List>
                    {menuItems.map((item) => {
                        const isActive =
                            pathname === item.path ||
                            pathname.startsWith(item.path + "/");

                        return (
                            <ListItemButton
                                key={item.text}
                                component="a"
                                href={item.path}
                                selected={isActive}
                                sx={{
                                    mx: 1,
                                    my: 0.5,
                                    borderRadius: 1,
                                    position: "relative",

                                    "&.Mui-selected": {
                                        backgroundColor:
                                            theme.palette.primary.main + "14",
                                        color: theme.palette.primary.main,
                                        fontWeight: 600,
                                    },

                                    "&.Mui-selected::before": {
                                        content: '""',
                                        position: "absolute",
                                        left: 0,
                                        top: 8,
                                        bottom: 8,
                                        width: 4,
                                        borderRadius: 4,
                                        backgroundColor: theme.palette.primary.main,
                                    },

                                    "& .MuiListItemIcon-root": {
                                        minWidth: 40,
                                        color: isActive
                                            ? theme.palette.primary.main
                                            : "inherit",
                                    },
                                }}
                            >
                                <ListItemIcon>{item.icon}</ListItemIcon>
                                {open && <ListItemText primary={item.text} />}
                            </ListItemButton>
                        );
                    })}
                </List>
            </Drawer>

            {/* -------------------- MAIN CONTENT -------------------- */}
            <Box
                component="main"
                sx={{
                    flexGrow: 1,
                    p: 3,
                    width: `calc(100% - ${open ? drawerWidth : theme.spacing(7)
                        }px)`,
                }}
            >
                <Toolbar />
                {children}
            </Box>
        </Box>
    );
};

export default ProtectedLayout;
