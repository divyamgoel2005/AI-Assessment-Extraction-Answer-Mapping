import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const type = searchParams.get("type");

    let fileName = "qp1.png";
    let contentType = "image/png";

    if (type === "answerkey") {
      if (fs.existsSync(path.join(process.cwd(), "ak1.png"))) {
        fileName = "ak1.png";
        contentType = "image/png";
      } else if (fs.existsSync(path.join(process.cwd(), "Screenshot 2026-08-26 135912.png"))) {
        fileName = "Screenshot 2026-08-26 135912.png";
        contentType = "image/png";
      }
    } else {
      if (fs.existsSync(path.join(process.cwd(), "qp1.png"))) {
        fileName = "qp1.png";
        contentType = "image/png";
      } else if (fs.existsSync(path.join(process.cwd(), "q9_to_17.pdf"))) {
        fileName = "q9_to_17.pdf";
        contentType = "application/pdf";
      }
    }

    const filePath = path.join(process.cwd(), fileName);
    if (!fs.existsSync(filePath)) {
      return NextResponse.json({ error: "File not found" }, { status: 404 });
    }

    const fileBuffer = fs.readFileSync(filePath);

    return new NextResponse(fileBuffer, {
      status: 200,
      headers: {
        "Content-Type": contentType,
        "Content-Disposition": `inline; filename="${fileName}"`,
      },
    });
  } catch (error) {
    console.error("Error serving sample file:", error);
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}
