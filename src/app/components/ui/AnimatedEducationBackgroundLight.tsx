"use client";

import { useLayoutEffect, useRef } from "react";
import { Box, useTheme } from "@mui/material";
import { gsap } from "gsap";

const ICONS = [
    // Core education
    "school",
    "science",
    "functions",
    "psychology",
    "auto_graph",
    "timeline",
    "groups",

    // Learning & growth
    "menu_book",
    "calculate",
    "biotech",
    "emoji_objects",
    "school",
    "science",
    "functions",

    // Analytics & progress
    "query_stats",
    "insights",
    "monitoring",
    "timeline",
    "auto_graph",
    "groups",
    "psychology",
];


export default function AnimatedEducationBackgroundLight() {
    const containerRef = useRef<HTMLDivElement>(null);
    const theme = useTheme();

    useLayoutEffect(() => {
        if (!containerRef.current) return;

        const icons = containerRef.current.querySelectorAll(".edu-icon");

        const ctx = gsap.context(() => {
            icons.forEach((icon, i) => {
                gsap.fromTo(
                    icon,
                    {
                        y: gsap.utils.random(60, 140),
                        x: gsap.utils.random(-100, 100),
                        opacity: 0.2,
                        rotate: gsap.utils.random(-10, 10),
                    },
                    {
                        y: gsap.utils.random(-140, -60),
                        x: gsap.utils.random(-140, 140),
                        opacity: gsap.utils.random(0.25, 0.45),
                        rotate: gsap.utils.random(-20, 20),
                        duration: gsap.utils.random(20, 30),
                        repeat: -1,
                        ease: "none",
                        yoyo: true,
                        delay: i * 0.6,
                    }
                );
            });
        }, containerRef);

        return () => ctx.revert();
    }, []);

    return (
        <Box
            ref={containerRef}
            sx={{
                position: "absolute",
                inset: 0,
                overflow: "hidden",
                zIndex: 0,
                pointerEvents: "none",
                background: "radial-gradient(circle at top, #F9FAFB, #475569,)",
            }}
        >
            {ICONS.map((name, i) => (
                <Box
                    key={i}
                    className="edu-icon"
                    sx={{
                        position: "absolute",
                        top: `${Math.random() * 100}%`,
                        left: `${Math.random() * 100}%`,
                        fontSize: {
                            xs: Math.random() > 0.6 ? 40 : 56,
                            md: Math.random() > 0.6 ? 64 : 88,
                        },
                        color:"rgba(63, 63, 66, 0.304)",
                        filter: "blur(0.1px)",
                    }}
                >

                    <span
                        className="material-symbols-rounded"
                        style={{
                            fontVariationSettings:
                                "'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 48",
                            display: "inline-block",
                            lineHeight: 1,
                        }}
                    >
                        {name}
                    </span>
                </Box>
            ))}
        </Box>
    );
}
