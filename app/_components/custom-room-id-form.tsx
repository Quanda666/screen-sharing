"use client";

import { Button } from "@/components/ui/button";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { ChevronRightIcon } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

export function CustomRoomIdForm() {
    const [isOpen, setIsOpen] = useState(false);
    const [customRoomId, setCustomRoomId] = useState("");

    return (
        <Collapsible open={isOpen} onOpenChange={setIsOpen} className="flex flex-col gap-4">
            <CollapsibleTrigger asChild>
                <Button variant="ghost" className="text-muted-foreground text-sm">
                    <ChevronRightIcon className={cn("transition-transform", isOpen && "rotate-90")} />
                    需要自定义房间 ID？
                </Button>
            </CollapsibleTrigger>
            <CollapsibleContent className="flex flex-col gap-4">
                <div className="flex flex-col gap-2">
                    <Label htmlFor="custom-id" className="text-base">
                        自定义房间 ID
                    </Label>
                    <Input id="custom-id" placeholder="my-presentation-room" value={customRoomId} onChange={(e) => setCustomRoomId(e.target.value)} />
                    <span className="text-muted-foreground text-base md:max-w-2xl">必须以字母或数字开头和结尾。中间允许使用连字符、下划线和空格。</span>
                </div>
                <Button variant="outline" disabled={!customRoomId} asChild={!!customRoomId}>
                    <Link href={`/host?room=${customRoomId}`}>使用自定义 ID 创建房间</Link>
                </Button>
            </CollapsibleContent>
        </Collapsible>
    );
}
