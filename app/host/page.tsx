"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Monitor, Users } from "lucide-react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import Peer from "peerjs";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { ShareOptions } from "./_components/share-options";

export default function HostPage() {
    const [roomId, setRoomId] = useState("");
    const [peer, setPeer] = useState<Peer | null>(null);
    const [activeStream, setActiveStream] = useState<MediaStream | null>(null);
    const [connections, setConnections] = useState<string[]>([]);
    const router = useRouter();
    const searchParams = useSearchParams();
    const customRoomId = searchParams.get("room");

    useEffect(() => {
        try {
            const newPeer = customRoomId ? new Peer(customRoomId) : new Peer();
            setPeer(newPeer);

            newPeer.on("open", (id) => {
                setRoomId(id);
            });

            newPeer.on("error", (err) => {
                toast.error("创建房间失败", {
                    description: err.message
                });
                router.push("/");
            });

            newPeer.on("connection", (connection) => {
                setConnections((prev) => [...prev, connection.peer]);
                connection.on("close", () => {
                    setConnections((prev) => prev.filter((peerId) => peerId !== connection.peer));
                });
            });

            return () => {
                newPeer.destroy();
            };
        } catch (error) {
            console.error("Error initializing peer:", error);
            toast.error("创建房间失败", {
                description: "请重试。"
            });
            router.push("/");
        }
    }, [customRoomId]);

    useEffect(() => {
        if (!peer) return;

        if (!activeStream && connections.length > 0) {
            toast.info("新观众已连接", {
                description: "点击开始共享您的屏幕。",
                duration: Infinity,
                action: {
                    label: "开始共享",
                    onClick: async () => {
                        try {
                            const stream = await navigator.mediaDevices.getDisplayMedia({
                                video: true,
                                audio: true
                            });
                            setActiveStream(stream);
                        } catch (err) {
                            console.error("Screen sharing error:", err);
                            toast.error("屏幕共享错误", {
                                description: "启动屏幕共享失败。请重试。"
                            });
                        }
                    }
                }
            });
        } else if (activeStream) {
            connections.forEach((connection) => {
                const call = peer.call(connection, activeStream);
                activeStream.getTracks()[0].onended = () => {
                    call.close();
                    activeStream.getTracks().forEach((track) => track.stop());
                };
            });
        }
    }, [peer, activeStream, connections]);

    function endSession() {
        if (activeStream) {
            activeStream.getTracks().forEach((track) => track.stop());
            setActiveStream(null);
        }
        if (peer) {
            peer.destroy();
            setPeer(null);
        }
        setConnections([]);
        setRoomId("");
        toast.info("会话已结束", {
            description: "您的屏幕共享会话已终止。"
        });
        router.push("/");
    }

    return (
        <div className="px-4 py-8">
            <div className="mx-auto flex w-full max-w-2xl flex-col gap-8">
                <Button variant="outline" asChild>
                    <Link href="/" className="flex items-center self-start">
                        <ArrowLeft />
                        返回首页
                    </Link>
                </Button>

                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Monitor />
                            您的屏幕共享房间
                        </CardTitle>
                        <CardDescription>与他人分享您的房间代码或链接，让他们查看您的屏幕。如需同时共享音频，请确保使用 Chrome 或 Edge 浏览器，并选择“共享标签页”选项。</CardDescription>
                    </CardHeader>
                    <CardContent className="flex flex-col gap-4">
                        <ShareOptions roomId={roomId} />
                        <div className="bg-muted/50 flex items-center justify-between rounded-lg p-4">
                            <div className="text-muted-foreground flex items-center gap-2">
                                <Users className="size-4" />
                                <span className="text-sm">当前观众人数</span>
                            </div>
                            <span className="text-lg font-semibold">{connections.length}</span>
                        </div>
                        {activeStream && (
                            <Button variant="destructive" onClick={endSession} className="self-end">
                                停止共享
                            </Button>
                        )}
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
