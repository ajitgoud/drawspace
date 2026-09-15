"use client";
import React, { useRef } from "react";
import { Image, FileJson, Upload, Download } from "lucide-react";
import { useCanvasEngineContext } from "../context/CanvasEngineContext";

const download = (href: string, filename: string) => {
    const link = document.createElement("a");
    link.href = href;
    link.download = filename;
    link.click();
};

const ExportRow = ({
                       icon: Icon,
                       label,
                       sublabel,
                       onClick,
                   }: {
    icon: any;
    label: string;
    sublabel: string;
    onClick: () => void;
}) => (
    <button
        onClick={onClick}
        className="flex items-center gap-3 rounded-md border border-panel-border bg-white px-3 py-2 text-left transition hover:border-brand hover:bg-brand/5"
    >
        <div className="flex h-8 w-8 items-center justify-center rounded-md bg-zinc-50 text-zinc-500 group-hover:text-brand">
            <Icon size={15} />
        </div>
        <div className="flex flex-col">
            <span className="text-xs font-medium text-zinc-800">{label}</span>
            <span className="text-[11px] text-zinc-400">{sublabel}</span>
        </div>
    </button>
);

const ExportControls = () => {
    const { engine } = useCanvasEngineContext();
    const fileInputRef = useRef<HTMLInputElement>(null);

    const exportPNG = () => engine && download(engine.exportPNG(), "canvas.png");
    const exportJPEG = () => engine && download(engine.exportJPEG(), "canvas.jpg");
    const exportJSON = () => {
        if (!engine) return;
        const json = engine.exportJSON();
        download(`data:application/json;charset=utf-8,${encodeURIComponent(json)}`, "canvas.json");
    };

    const importJSON = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file || !engine) return;
        await engine.importJSON(await file.text());
        e.target.value = "";
    };

    return (
        <div className="flex flex-col gap-3 border-t border-panel-border p-4">
            <p className="text-xs font-semibold text-zinc-800">Export & Import</p>

            <div className="flex flex-col gap-1.5">
                <ExportRow icon={Image} label="PNG" sublabel="Raster image" onClick={exportPNG} />
                <ExportRow icon={Image} label="JPEG" sublabel="Compressed image" onClick={exportJPEG} />
                <ExportRow icon={FileJson} label="JSON" sublabel="Editable canvas file" onClick={exportJSON} />
            </div>

            <button
                onClick={() => fileInputRef.current?.click()}
                className="mt-1 flex items-center justify-center gap-2 rounded-md border border-dashed border-panel-border py-2 text-xs font-medium text-zinc-500 transition hover:border-brand hover:text-brand"
            >
                <Upload size={13} />
                Import JSON
            </button>
            <input ref={fileInputRef} type="file" accept="application/json" className="hidden" onChange={importJSON} />
        </div>
    );
};

export default ExportControls;