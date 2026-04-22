"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ArrowLeft, Users } from "lucide-react";
import Link from "next/link";
import Peer from "peerjs";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";

export default function JoinPage() {
    const [roomId, setRoomId] = useState("");
    const [isConnecting, setIsConnecting] = useState(false);
    const [activeStream, setActiveStream] = useState<MediaStream | null>(null);
    const videoRef = useRef<HTMLVideoElement>(null);
    const peerRef = useRef<Peer | null>(null);

    useEffect(() => {
        const params = new URLSearchParams(window.location.search);
        const roomFromUrl = params.get("room");
        if (roomFromUrl) {
            setRoomId(roomFromUrl);
        }

        return () => {
            if (peerRef.current) {
                peerRef.current.destroy();
                peerRef.current = null;
            }
        };
    }, []);

    useEffect(() => {
        if (videoRef.current && activeStream) {
            videoRef.current.srcObject = activeStream;
            videoRef.current.play().catch(console.error);
        }
    }, [activeStream]);

    function joinRoom(roomIdToJoin: string = roomId) {
        if (!roomIdToJoin.trim()) {
            toast.error("需要房间代码", {
                description: "请输入有效的房间代码。"
            });
            return;
        }

        setIsConnecting(true);

        const peer = new Peer({ debug: 2 });
        peerRef.current = peer;

        peer.on("open", () => {
            const connection = peer.connect(roomIdToJoin);

            connection.on("open", () => {
                toast.success("已连接！", {
                    description: "正在等待房主共享屏幕..."
                });
            });

            peer.on("call", (call) => {
                call.answer();
                call.on("stream", (remoteStream) => {
                    setActiveStream(remoteStream);
                });
            });

            connection.on("close", () => {
                setIsConnecting(false);
                setRoomId("");
                setActiveStream(null);
                toast.error("已断开连接", {
                    description: "会话已结束。"
                });
            });
        });

        peer.on("error", (err) => {
            console.error("Peer error:", err);
            setIsConnecting(false);
            toast.error("连接失败", {
                description: "无法连接到房间。请检查房间代码并重试。"
            });
        });
    }

    return (
        <div className="mx-auto flex w-full max-w-2xl flex-col gap-8 px-4 py-8">
            <Button variant="outline" asChild>
                <Link href="/" className="flex items-center self-start">
                    <ArrowLeft />
                    返回首页
                </Link>
            </Button>

            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Users />
                        加入房间
                    </CardTitle>
                    <CardDescription>输入房间代码以加入并查看共享屏幕</CardDescription>
                </CardHeader>
                <CardContent>
                    {!activeStream ? (
                        <div className="flex flex-col gap-4">
                            <Input placeholder="输入房间代码" value={roomId} onChange={(e) => setRoomId(e.target.value)} disabled={isConnecting} />
                            <Button className="w-full" onClick={() => joinRoom()} disabled={isConnecting || !roomId.trim()}>
                                {isConnecting ? "正在连接..." : "加入房间"}
                            </Button>
                        </div>
                    ) : (
                        <div className="relative overflow-hidden rounded-lg">
                            <video ref={videoRef} className="h-full w-full object-contain" autoPlay playsInline loop controls muted />
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}
