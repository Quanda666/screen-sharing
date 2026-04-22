import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertCircle, Monitor, Users } from "lucide-react";
import Link from "next/link";
import { CustomRoomIdForm } from "./_components/custom-room-id-form";

export default function Home() {
    return (
        <div className="mx-auto flex max-w-7xl flex-col gap-8 px-4 py-12">
            <div className="flex flex-col gap-4 text-center">
                <h1 className="text-5xl font-bold tracking-tight sm:text-7xl">立即共享您的屏幕</h1>
                <p className="text-primary text-2xl">创建房间，分享代码，即可在几秒钟内向观众进行演示。</p>
            </div>
            <div className="grid gap-4 md:grid-cols-2">
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Monitor />
                            开始共享
                        </CardTitle>
                        <CardDescription>创建房间并与他人共享您的屏幕</CardDescription>
                    </CardHeader>
                    <CardContent className="flex flex-col gap-4">
                        <Link href="/host">
                            <Button className="w-full">创建房间</Button>
                        </Link>
                        <CustomRoomIdForm />
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Users />
                            加入房间
                        </CardTitle>
                        <CardDescription>输入房间代码以查看他人的屏幕</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Link href="/join">
                            <Button variant="outline" className="w-full">
                                加入房间
                            </Button>
                        </Link>
                    </CardContent>
                </Card>
            </div>
            <Alert>
                <AlertCircle />
                <AlertTitle className="text-lg">备注</AlertTitle>
                <AlertDescription className="text-base">移动设备不支持屏幕共享。移动用户仍可以加入房间观看他人共享的屏幕。</AlertDescription>
            </Alert>
        </div>
    );
}
