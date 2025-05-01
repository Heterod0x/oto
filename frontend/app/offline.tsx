import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function Offline() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4 text-center">
      <div className="space-y-4">
        <h1 className="text-3xl font-bold">オフラインです</h1>
        <p className="text-muted-foreground">
          インターネット接続がないようです。接続が復帰したらページを再読み込みしてください。
        </p>
        <div className="flex justify-center mt-4">
          <Button onClick={() => window.location.reload()} className="mx-auto">
            再読み込み
          </Button>
        </div>
        <div className="mt-8">
          <p className="text-sm text-muted-foreground">一部の機能はオフラインでも利用可能です</p>
          <div className="flex flex-wrap gap-2 mt-2 justify-center">
            <Link href="/record">
              <Button variant="outline" size="sm">
                録音
              </Button>
            </Link>
            <Link href="/history">
              <Button variant="outline" size="sm">
                履歴
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
