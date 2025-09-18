"use client";

import React from "react";
import {
    Box,
    Grid,
    Typography,
    Chip,
    Button,
    Paper,
} from "@mui/material";
import PrintIcon from "@mui/icons-material/Print";
import "./page.css"; // ✅ must import it


// Updated Sample Data for August 1-21, 2025
const sampleMenu: Record<string, any[]> = {
    "2025-08-01": [
        { name: "Turkey Cheese Sandwich", type: "Egergff", cal: 100, fat: 9, tags: ["H"] },
        { name: "Grilled Chicken Salad", type: "Egergff", cal: 150, fat: 7, tags: ["GF"] },
        { name: "Vegetarian Pasta Primavera", type: "V", cal: 180, fat: 7, tags: ["V"] },
        { name: "Lentil & Vegetable Stew", type: "S", cal: 180, fat: 7, tags: ["S"] },
    ],
    "2025-08-02": [
        { name: "BBQ Pulled Pork Sandwich", type: "Egergff", cal: 350, fat: 18, tags: ["H"] },
        { name: "Greek Yogurt Parfait", type: "Egergff", cal: 120, fat: 3, tags: ["GF"] },
        { name: "Stuffed Bell Peppers", type: "S", cal: 250, fat: 10, tags: ["V"] },
        { name: "Tomato Basil Soup", type: "S", cal: 120, fat: 2, tags: ["V"] },
    ],
    "2025-08-03": [
        { name: "Beef Burger", type: "Egergff", cal: 400, fat: 22, tags: ["H"] },
        { name: "Caesar Salad", type: "Egergff", cal: 180, fat: 12, tags: ["GF"] },
        { name: "Mushroom Risotto", type: "V", cal: 320, fat: 14, tags: ["V"] },
        { name: "Minestrone Soup", type: "S", cal: 150, fat: 5, tags: ["V"] },
    ],
    "2025-08-04": [
        { name: "Chicken Wrap", type: "Egergff", cal: 280, fat: 11, tags: ["H"] },
        { name: "Quinoa Bowl", type: "Egergff", cal: 220, fat: 8, tags: ["GF"] },
        { name: "Eggplant Parmesan", type: "V", cal: 380, fat: 20, tags: ["V"] },
        { name: "Broccoli Cheddar Soup", type: "S", cal: 200, fat: 12, tags: ["V"] },
    ],
    "2025-08-05": [
        { name: "Fish & Chips", type: "Egergff", cal: 450, fat: 25, tags: ["H"] },
        { name: "Tuna Salad", type: "Egergff", cal: 190, fat: 9, tags: ["GF"] },
        { name: "Vegetable Stir Fry", type: "V", cal: 240, fat: 10, tags: ["V"] },
        { name: "Clam Chowder", type: "S", cal: 210, fat: 11, tags: [] },
    ],
    "2025-08-06": [
        { name: "Steak Frites", type: "Egergff", cal: 520, fat: 30, tags: ["H"] },
        { name: "Cobb Salad", type: "Egergff", cal: 280, fat: 18, tags: ["GF"] },
        { name: "Falafel Plate", type: "V", cal: 300, fat: 12, tags: ["V"] },
        { name: "Lentil Soup", type: "S", cal: 180, fat: 5, tags: ["V"] },
    ],
    "2025-08-07": [
        { name: "Chicken Curry", type: "Egergff", cal: 380, fat: 16, tags: ["H"] },
        { name: "Spinach Salad", type: "Egergff", cal: 150, fat: 7, tags: ["GF"] },
        { name: "Vegetable Lasagna", type: "V", cal: 420, fat: 18, tags: ["V"] },
        { name: "Pumpkin Soup", type: "S", cal: 160, fat: 8, tags: ["V"] },
    ],
    "2025-08-08": [
        { name: "Pork Chop", type: "Egergff", cal: 350, fat: 20, tags: ["H"] },
        { name: "Antipasto Plate", type: "Egergff", cal: 240, fat: 15, tags: ["GF"] },
        { name: "Stuffed Portobello", type: "V", cal: 280, fat: 14, tags: ["V"] },
        { name: "French Onion Soup", type: "S", cal: 220, fat: 10, tags: [] },
    ],
    "2025-08-09": [
        { name: "BBQ Ribs", type: "Egergff", cal: 480, fat: 28, tags: ["H"] },
        { name: "Waldorf Salad", type: "Egergff", cal: 210, fat: 12, tags: ["GF"] },
        { name: "Ratatouille", type: "V", cal: 200, fat: 9, tags: ["V"] },
        { name: "Gazpacho", type: "S", cal: 120, fat: 4, tags: ["V", "GF"] },
    ],
    "2025-08-10": [
        { name: "Meatloaf", type: "Egergff", cal: 380, fat: 22, tags: ["H"] },
        { name: "Caprese Salad", type: "Egergff", cal: 180, fat: 11, tags: ["GF"] },
        { name: "Black Bean Burger", type: "V", cal: 320, fat: 13, tags: ["V"] },
        { name: "Corn Chowder", type: "S", cal: 190, fat: 9, tags: ["V"] },
    ],
    // August 11-21 will show "No Menu Available" as they are not in this object
};

// Helper for tags
const TagChip = ({ tag }: { tag: string }) => {
    const colors: Record<
        string,
        "default" | "success" | "error" | "warning" | "info"
    > = {
        V: "success",
        GF: "info",
        H: "error",
        S: "warning",
    };
    return (
        <Chip
            size="small"
            label={tag}
            color={colors[tag] || "default"}
            sx={{ ml: 0.5 }}
        />
    );
};

const CalendarPage: React.FC = () => {

    const allDays = [
        null, // Monday
        null, // Tuesday
        null, // Wednesday
        null, // Thursday
        { date: "2025-08-01", day: "Friday", number: 1 },
        { date: "2025-08-02", day: "Saturday", number: 2 },
        { date: "2025-08-03", day: "Sunday", number: 3 },
        { date: "2025-08-04", day: "Monday", number: 4 },
        { date: "2025-08-05", day: "Tuesday", number: 5 },
        { date: "2025-08-06", day: "Wednesday", number: 6 },
        { date: "2025-08-07", day: "Thursday", number: 7 },
        { date: "2025-08-08", day: "Friday", number: 8 },
        { date: "2025-08-09", day: "Saturday", number: 9 },
        { date: "2025-08-10", day: "Sunday", number: 10 },
    ];

    const allowedDays = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];
    const filteredDays = allDays;
    const colSize = 12 / allowedDays.length;

    return (
        <Box sx={{ p: 3 }}>
            {/* Header */}
            <Box
                sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    mb: 2,
                }}
            >
                <Typography variant="h5" fontWeight="bold">
                    August 2025
                </Typography>
                <Button
                    variant="contained"
                    color="warning"
                    startIcon={<PrintIcon />}
                    onClick={() => window.print()}
                    className="no-print"
                >
                    Print
                </Button>
            </Box>

            {/* Week Days Header */}
            <Grid container spacing={1}>
                {allowedDays.map((day, index) => {
                
                    if (!day) {
                        // Empty placeholder (before Aug 1)
                        return (
                            <Grid size={{xs:2.4}} key={`empty-${index}`}>
                                <Paper elevation={0} sx={{ minHeight: 200 }} />
                            </Grid>
                        );
                    }                
                
               return (
                    
                    <Grid size={{xs:colSize}} key={day}>
                        <Box
                           className="weekday-header"
                            sx={{
                                textAlign: "center",
                                background: "#000",
                                color: "#fff",
                                borderRadius: "28px",
                                py: 1,
                                mb: 1,
                            }}
                        >
                            <Typography variant="subtitle1">{day}</Typography>
                        </Box>
                    </Grid>
                )})
                
                }
            </Grid>

            {/* Days Grid */}
            <Grid container spacing={1}>
                {filteredDays.map((d, index) => {

                    if (!d) {
                        // Empty placeholder (null days)
                        return (
                            <Grid size={{xs:colSize}} key={`empty-${index}`}>
                                <Paper elevation={0} sx={{ minHeight: 200 }} />
                            </Grid>
                        );
                    }

                    const menu = sampleMenu[d.date] || [];
                    return (
                        <Grid size={{xs:colSize}} key={index}>
                            <Paper
                                elevation={0}
                                sx={{
                                    p: 1.5,
                                    minHeight: 200,
                                    display: "flex",
                                    flexDirection: "column",
                                }}
                            >
                                {/* Date */}
                                <Typography
                                    variant="subtitle2"
                                    fontWeight="bold"
                                    component="span"
                                    className="date-badge"

                                    sx={{
                                        display: "inline-flex",
                                        alignItems: "center",
                                        justifyContent: "center",
                                        width: 28,
                                        height: 28,
                                        borderRadius: "50%",
                                        backgroundColor: "black",
                                        color: "white",
                                        mb: 1,
                                    }}
                                >
                                    {d.number}
                                </Typography>

                                {/* Meals */}
                                {menu.length > 0 ? (
                                    menu.map((item, i) => (
                                        <Box key={i} sx={{ mb: 0.5, pb: 0.5, borderBottom: "1px dotted lightgray" }}>
                                            <Typography variant="body2" sx={{ color: "gray", fontSize: "12px" }}>
                                                {item.type}
                                            </Typography>
                                            <Typography variant="body2">{item.name}</Typography>
                                            <Typography
                                                variant="caption"
                                                color="text.secondary"
                                                sx={{ display: "block" }}
                                            >
                                                {item.cal} Cal, Fat {item.fat}g
                                                {item.tags.map((t: string) => (
                                                    <TagChip key={t} tag={t} />
                                                ))}
                                            </Typography>
                                        </Box>
                                    ))
                                ) : (
                                    <Box
                                        sx={{
                                            flex: 1,
                                            display: "flex",
                                            alignItems: "center",
                                            justifyContent: "center",
                                            color: "text.secondary",
                                        }}
                                    >
                                        <Typography variant="body2">No Menu Available</Typography>
                                    </Box>
                                )}
                            </Paper>
                        </Grid>
                    );
                })}
            </Grid>
        </Box>
    );
};

export default CalendarPage;