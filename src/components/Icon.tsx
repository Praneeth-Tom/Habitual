"use client";

import * as LucideIcons from "lucide-react";

// A helper to render icons by name
export const Icon = ({ name, ...props }: { name: string } & LucideIcons.LucideProps) => {
    const LucideIcon = (LucideIcons as any)[name];
    if (!LucideIcon) return <LucideIcons.Smile {...props} />;
    return <LucideIcon {...props} />;
};
