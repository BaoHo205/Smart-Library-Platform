import { Card } from "@/components/ui/card";
import Image from "next/image";
import Link from "next/link";

export default function NavHeader() {
  return (
    <Card className="bg-muted flex items-center justify-center rounded-md p-2 group-data-[collapsible=icon]:p-1">
      <Link href={'/'}>
        <div className="flex group-data-[collapsible=icon]:hidden">
          <div>
            <Image
              src="/images/RMIT_logo.png"
              alt="Logo"
              width={100}
              height={100}
              className="max-w-48 transition-all duration-300 ease-in-out"
            />
          </div>
          <div className="flex max-w-48 flex-col justify-center transition-all duration-300 ease-in-out">
            <p className="text-sm leading-none font-semibold transition-all duration-300 ease-in-out">
              Online Library
            </p>
            <p className="text-muted-foreground text-sm leading-none transition-all duration-300 ease-in-out">
              Team FTech
            </p>
          </div>
        </div>
        <Image
          src="/images/RMIT_logo_collapsed.png"
          alt="Logo"
          width={50}
          height={50}
          className="hidden group-data-[collapsible=icon]:inline"
        />
      </Link>
    </Card>
  );
}