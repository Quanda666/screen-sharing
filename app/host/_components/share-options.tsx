"use client";

import { Button } from "@/components/ui/button";
import { CopyIcon } from "lucide-react";
import { toast } from "sonner";

interface ShareOptionsProps {
    roomId: string;
}

export function ShareOptions({ roomId }: ShareOptionsProps) {
    function copyRoomId() {
        navigator.clipboard.writeText(roomId);
        toast.success("房间代码已复制！", {
            description: "将此代码分享给他人，让他们加入您的房间。"
        });
    }

    function copyShareableLink() {
        const shareableUrl = `${window.location.origin}/join?room=${roomId}`;
        navigator.clipboard.writeText(shareableUrl);
        toast.success("共享链接已复制！", {
            description: "将此链接分享给他人，让他们直接加入您的房间。"
        });
    }

    return (
        <div className="flex flex-col gap-6">
            <div className="flex flex-col gap-2">
                <p className="text-muted-foreground text-base">房间代码</p>
                <code className="bg-muted flex w-full items-center justify-between gap-2 rounded-lg p-3 font-mono text-base tracking-tight">
                    {roomId || "正在生成房间代码..."}
                    <Button variant="ghost" size="sm" onClick={copyRoomId} disabled={!roomId} className="text-muted-foreground size-4">
                        <CopyIcon />
                    </Button>
                </code>
            </div>

            <div className="relative">
                <div className="absolute inset-0 flex items-center">
                    <span className="w-full border-t" />
                </div>
                <div className="relative flex justify-center text-sm uppercase">
                    <span className="bg-background text-muted-foreground px-2">或</span>
                </div>
            </div>

            <div className="flex flex-col gap-2">
                <p className="text-muted-foreground text-base">共享链接</p>
                <code className="bg-muted flex w-full items-center justify-between gap-2 rounded-lg p-3 font-mono text-base tracking-tight">
                    {roomId ? `${window.location.origin}/join?room=${roomId}` : "正在生成链接..."}
                    <Button variant="ghost" size="sm" onClick={copyShareableLink} disabled={!roomId} className="text-muted-foreground size-4">
                        <CopyIcon />
                    </Button>
                </code>
            </div>
        </div>
    );
}
