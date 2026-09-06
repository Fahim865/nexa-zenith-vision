import {
  Image as ImageIcon,
  Scaling,
  Repeat2,
  RotateCw,
  Stamp,
  ShieldOff,
  Pipette,
  QrCode,
  Star,
  FileImage,
  FileStack,
  Scissors,
  RotateCcw,
  LayoutGrid,
} from "lucide-react";
import { def } from "./def";
import type { ToolMeta } from "../types";

const img = { category: "image", provider: "device", credits: 0, inputType: "image", outputType: "image" } as const;
const pdf = { category: "pdf", provider: "device", credits: 0, inputType: "pdf", outputType: "pdf" } as const;

export const IMAGE_TOOLS: ToolMeta[] = [
  def({ ...img, name: "Image Compressor", slug: "image-compressor", description: "Shrink JPG, PNG and WebP files with a quality slider and live preview.", icon: ImageIcon, tags: ["compress", "optimise", "jpg", "png", "webp"], status: "live", featured: true, popular: true, supportedFormats: ["JPG", "PNG", "WebP"],
    about: "Drop an image, choose a quality level and download a smaller file. Compression happens inside your browser using the Canvas API, so your photos are never uploaded to a server." }),
  def({ ...img, name: "Image Resizer", slug: "image-resizer", description: "Resize images to exact pixel dimensions, with aspect ratio lock.", icon: Scaling, tags: ["resize", "dimensions", "scale"], status: "live", popular: true, supportedFormats: ["JPG", "PNG", "WebP"] }),
  def({ ...img, name: "Image Converter", slug: "image-converter", description: "Convert between JPG, PNG and WebP in one click.", icon: Repeat2, tags: ["convert", "jpg to png", "webp"], status: "live", popular: true, supportedFormats: ["JPG", "PNG", "WebP"] }),
  def({ ...img, name: "Image Rotator", slug: "image-rotator", description: "Rotate and flip images, then download the result.", icon: RotateCw, tags: ["rotate", "flip", "mirror"], status: "live", supportedFormats: ["JPG", "PNG", "WebP"] }),
  def({ ...img, name: "Image Watermark", slug: "image-watermark", description: "Add a text watermark with adjustable size, position and opacity.", icon: Stamp, tags: ["watermark", "branding", "copyright"], status: "live", supportedFormats: ["JPG", "PNG", "WebP"] }),
  def({ ...img, name: "Image Metadata Cleaner", slug: "image-metadata-cleaner", description: "Strip EXIF and location data before you share a photo.", icon: ShieldOff, tags: ["exif", "privacy", "metadata"], status: "live", category: "security", supportedFormats: ["JPG", "PNG"] }),
  def({ ...img, name: "Colour Picker", slug: "color-picker", description: "Pick colours from an image and build a palette you can copy.", icon: Pipette, tags: ["color", "palette", "eyedropper"], status: "live", category: "design", outputType: "text" }),
  def({ ...img, name: "QR Code Generator", slug: "qr-code-generator", description: "Turn a link or text into a downloadable QR code.", icon: QrCode, tags: ["qr", "barcode", "link"], status: "live", category: "generators", inputType: "text", popular: true }),
  def({ ...img, name: "Favicon Generator", slug: "favicon-generator", description: "Generate favicon sizes from a single image.", icon: Star, tags: ["favicon", "icon", "website"], status: "live", category: "web" }),
  def({ ...img, name: "Image to PDF", slug: "image-to-pdf", description: "Combine images into a single PDF document.", icon: FileImage, tags: ["image to pdf", "jpg to pdf", "convert"], status: "live", category: "pdf", outputType: "pdf" }),
];

export const PDF_TOOLS: ToolMeta[] = [
  def({ ...pdf, name: "PDF Merge", slug: "pdf-merge", description: "Combine several PDFs into one file, in the order you choose.", icon: FileStack, tags: ["merge", "combine", "pdf"], status: "live", featured: true, popular: true, supportedFormats: ["PDF"],
    about: "Add your PDFs, drag them into the right order and download a single merged document. Merging runs in your browser, so confidential documents never leave your device." }),
  def({ ...pdf, name: "PDF Split", slug: "pdf-split", description: "Extract a page range from a PDF into a new file.", icon: Scissors, tags: ["split", "extract", "pages"], status: "live", popular: true, supportedFormats: ["PDF"] }),
  def({ ...pdf, name: "PDF Rotate", slug: "pdf-rotate", description: "Rotate every page, or a range of pages, in a PDF.", icon: RotateCcw, tags: ["rotate", "pages", "orientation"], status: "live", supportedFormats: ["PDF"] }),
  def({ ...pdf, name: "PDF Page Organiser", slug: "pdf-page-organizer", description: "Reorder or delete pages, then export a rebuilt PDF.", icon: LayoutGrid, tags: ["reorder", "delete pages", "organise"], status: "live", supportedFormats: ["PDF"] }),
];
