import { NextRequest, NextResponse } from "next/server";
import { formatBytes, getPdfPageCount } from "@/lib/pdfToImages";

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File | null;
    const fileRole = (formData.get("role") as string) || "questionPaper";

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const sizeFormatted = formatBytes(file.size);
    const isPdf = file.type === "application/pdf" || file.name.toLowerCase().endsWith(".pdf");

    let pageCount = 1;
    const pages: string[] = [];

    if (isPdf) {
      pageCount = await getPdfPageCount(arrayBuffer);
      // For PDF preview representation in stateless demo mode, convert to base64
      const base64Data = `data:application/pdf;base64,${buffer.toString("base64")}`;
      pages.push(base64Data);
    } else {
      // Image file
      const base64Data = `data:${file.type || "image/png"};base64,${buffer.toString("base64")}`;
      pages.push(base64Data);
    }

    return NextResponse.json({
      success: true,
      fileInfo: {
        name: file.name,
        sizeFormatted,
        pageCount: Math.max(1, pageCount),
        pages,
        fileType: isPdf ? "pdf" : "image",
      },
    });
  } catch (error) {
    console.error("Upload API error:", error);
    return NextResponse.json(
      { error: "Failed to process file upload" },
      { status: 500 }
    );
  }
}
