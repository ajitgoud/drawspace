"use client";
import React from "react";
import { Palette, PenLine, Droplet, Type, AlignLeft, AlignCenter, AlignRight } from "lucide-react";
import { useCanvasEngineContext } from "../context/CanvasEngineContext";
import { useSelectedAttributes } from "../hooks/useSelectedAttributes";

const TEXT_TYPES = new Set(["text"]);

const SectionLabel = ({ icon: Icon, children }: { icon: any; children: React.ReactNode }) => (
    <div className="flex items-center gap-1.5 text-xs font-medium text-zinc-500">
        <Icon size={13} />
        <span>{children}</span>
    </div>
);

const AttributesPanel = () => {
    const { engine } = useCanvasEngineContext();
    const { attributes, update } = useSelectedAttributes(engine);

    if (!attributes) {
        return (
            <div className="flex h-full w-full flex-col items-center justify-center gap-2 p-6 text-center">
                <Palette size={20} className="text-zinc-300" />
                <p className="text-xs text-zinc-400">Select an object on the canvas to edit its properties</p>
            </div>
        );
    }

    const isText = TEXT_TYPES.has(attributes.shapeType);
    const isFreehand = attributes.shapeType === "freehand";
    const label = attributes.shapeType[0].toUpperCase() + attributes.shapeType.slice(1);

    return (
        <div className="flex h-full w-full flex-col overflow-y-auto">
            <div className="border-b border-panel-border px-4 py-3">
                <p className="text-sm font-semibold text-zinc-800">{label}</p>
                <p className="text-[11px] text-zinc-400">Properties</p>
            </div>

            <div className="flex flex-col gap-5 p-4">
                {!isFreehand && (
                    <div className="flex flex-col gap-2">
                        <SectionLabel icon={Palette}>Fill</SectionLabel>
                        <div className="flex items-center gap-2">
                            <input
                                type="color"
                                value={attributes.fill ?? "#000000"}
                                onChange={(e) => update({ fill: e.target.value })}
                                className="h-8 w-8 shrink-0 cursor-pointer rounded-md border border-panel-border p-0.5"
                            />
                            <span className="rounded-md bg-zinc-50 px-2 py-1.5 text-xs font-mono text-zinc-500">
                {attributes.fill ?? "#000000"}
              </span>
                        </div>
                    </div>
                )}

                <div className="flex flex-col gap-2">
                    <SectionLabel icon={PenLine}>Stroke</SectionLabel>
                    <div className="flex items-center gap-2">
                        <input
                            type="color"
                            value={attributes.stroke ?? "#000000"}
                            onChange={(e) => update({ stroke: e.target.value })}
                            className="h-8 w-8 shrink-0 cursor-pointer rounded-md border border-panel-border p-0.5"
                        />
                        <span className="rounded-md bg-zinc-50 px-2 py-1.5 text-xs font-mono text-zinc-500">
              {attributes.stroke ?? "#000000"}
            </span>
                    </div>
                    <div className="flex items-center gap-3">
                        <input
                            type="range"
                            min={0}
                            max={40}
                            value={attributes.strokeWidth ?? 0}
                            onChange={(e) => update({ strokeWidth: Number(e.target.value) })}
                            className="flex-1 accent-brand"
                        />
                        <span className="w-7 text-right text-xs text-zinc-500">{attributes.strokeWidth ?? 0}</span>
                    </div>
                </div>

                <div className="flex flex-col gap-2">
                    <SectionLabel icon={Droplet}>Opacity</SectionLabel>
                    <div className="flex items-center gap-3">
                        <input
                            type="range"
                            min={0}
                            max={1}
                            step={0.01}
                            value={attributes.opacity ?? 1}
                            onChange={(e) => update({ opacity: Number(e.target.value) })}
                            className="flex-1 accent-brand"
                        />
                        <span className="w-10 text-right text-xs text-zinc-500">
              {Math.round((attributes.opacity ?? 1) * 100)}%
            </span>
                    </div>
                </div>

                {isText && (
                    <>
                        <div className="h-px bg-panel-border" />

                        <div className="flex flex-col gap-2">
                            <SectionLabel icon={Type}>Font size</SectionLabel>
                            <div className="flex items-center gap-3">
                                <input
                                    type="range"
                                    min={8}
                                    max={96}
                                    value={attributes.fontSize ?? 16}
                                    onChange={(e) => update({ fontSize: Number(e.target.value) })}
                                    className="flex-1 accent-brand"
                                />
                                <span className="w-8 text-right text-xs text-zinc-500">{attributes.fontSize ?? 16}</span>
                            </div>
                        </div>

                        <div className="flex flex-col gap-2">
                            <SectionLabel icon={AlignLeft}>Text align</SectionLabel>
                            <div className="flex rounded-md border border-panel-border p-0.5">
                                {[
                                    { value: "left", Icon: AlignLeft },
                                    { value: "center", Icon: AlignCenter },
                                    { value: "right", Icon: AlignRight },
                                ].map(({ value, Icon }) => (
                                    <button
                                        key={value}
                                        onClick={() => update({ textAlign: value })}
                                        className={`flex flex-1 items-center justify-center rounded-[5px] py-1.5 transition ${
                                            (attributes.textAlign ?? "left") === value
                                                ? "bg-brand text-white"
                                                : "text-zinc-500 hover:bg-zinc-50"
                                        }`}
                                    >
                                        <Icon size={14} />
                                    </button>
                                ))}
                            </div>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};

export default AttributesPanel;