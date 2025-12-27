import { PDFDocument } from 'pdf-lib';
import type { Orientation, Quality } from '../components/PDFOptions';

export interface ImageFile {
    id: string;
    file: File;
    preview: string;
    name: string;
    size: number;
    orientation?: Orientation; // Per-image override (undefined = use global)
}

interface GeneratePDFOptions {
    images: ImageFile[];
    globalOrientation?: Orientation;
    quality?: Quality;
    onProgress?: (progress: number) => void;
}

// Quality compression ratios
const qualitySettings: Record<Quality, number> = {
    high: 1.0,
    medium: 0.7,
    low: 0.5,
};

export async function generatePDF({
    images,
    globalOrientation = 'auto',
    quality = 'high',
    onProgress
}: GeneratePDFOptions): Promise<Blob> {
    const pdfDoc = await PDFDocument.create();
    const totalImages = images.length;
    const qualityRatio = qualitySettings[quality];

    for (let i = 0; i < images.length; i++) {
        const imageFile = images[i];

        // Use per-image orientation if set, otherwise use global
        const orientation = imageFile.orientation || globalOrientation;

        // Load and optionally compress the image
        const imageData = await processImage(imageFile, qualityRatio);

        let image;
        const fileType = imageFile.file.type.toLowerCase();

        if (fileType === 'image/jpeg' || fileType === 'image/jpg') {
            image = await pdfDoc.embedJpg(imageData);
        } else if (fileType === 'image/png') {
            image = await pdfDoc.embedPng(imageData);
        } else if (fileType === 'image/webp') {
            // WebP needs to be converted to JPEG
            const jpegData = await convertWebPToJPEG(imageFile.preview, qualityRatio);
            image = await pdfDoc.embedJpg(jpegData);
        } else {
            continue; // Skip unsupported formats
        }

        // Standard page dimensions in points (72 DPI)
        const A4_WIDTH = 595.28;
        const A4_HEIGHT = 841.89;

        // Determine page dimensions based on orientation
        let pageWidth: number;
        let pageHeight: number;

        if (orientation === 'portrait') {
            pageWidth = A4_WIDTH;
            pageHeight = A4_HEIGHT;
        } else if (orientation === 'landscape') {
            pageWidth = A4_HEIGHT;
            pageHeight = A4_WIDTH;
        } else {
            // Auto: choose based on image aspect ratio
            const imgAspect = image.width / image.height;
            if (imgAspect > 1) {
                // Landscape image
                pageWidth = A4_HEIGHT;
                pageHeight = A4_WIDTH;
            } else {
                // Portrait image
                pageWidth = A4_WIDTH;
                pageHeight = A4_HEIGHT;
            }
        }

        // Calculate scaling to fit image within page while maintaining aspect ratio
        const imgWidth = image.width;
        const imgHeight = image.height;

        let scaledWidth = imgWidth;
        let scaledHeight = imgHeight;

        // Add some margin (20 points on each side)
        const maxWidth = pageWidth - 40;
        const maxHeight = pageHeight - 40;

        if (imgWidth > maxWidth || imgHeight > maxHeight) {
            const widthRatio = maxWidth / imgWidth;
            const heightRatio = maxHeight / imgHeight;
            const scale = Math.min(widthRatio, heightRatio);
            scaledWidth = imgWidth * scale;
            scaledHeight = imgHeight * scale;
        }

        // Create page
        const page = pdfDoc.addPage([pageWidth, pageHeight]);

        // Center the image on the page
        const x = (pageWidth - scaledWidth) / 2;
        const y = (pageHeight - scaledHeight) / 2;

        page.drawImage(image, {
            x,
            y,
            width: scaledWidth,
            height: scaledHeight,
        });

        // Report progress
        if (onProgress) {
            onProgress(((i + 1) / totalImages) * 100);
        }
    }

    const pdfBytes = await pdfDoc.save();
    return new Blob([pdfBytes.buffer.slice(pdfBytes.byteOffset, pdfBytes.byteOffset + pdfBytes.byteLength) as ArrayBuffer], { type: 'application/pdf' });
}

async function processImage(imageFile: ImageFile, qualityRatio: number): Promise<Uint8Array> {
    if (qualityRatio >= 1.0) {
        // No compression needed
        const arrayBuffer = await imageFile.file.arrayBuffer();
        return new Uint8Array(arrayBuffer);
    }

    // Compress the image using canvas
    const img = await loadImage(imageFile.preview);
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');

    // Scale down for compression
    const scale = Math.sqrt(qualityRatio);
    canvas.width = img.width * scale;
    canvas.height = img.height * scale;

    ctx?.drawImage(img, 0, 0, canvas.width, canvas.height);

    const fileType = imageFile.file.type.toLowerCase();
    const mimeType = fileType === 'image/png' ? 'image/png' : 'image/jpeg';
    const quality = fileType === 'image/png' ? undefined : qualityRatio;

    const blob = await new Promise<Blob>((resolve) => {
        canvas.toBlob((b) => resolve(b!), mimeType, quality);
    });

    const arrayBuffer = await blob.arrayBuffer();
    return new Uint8Array(arrayBuffer);
}

async function convertWebPToJPEG(src: string, quality: number): Promise<Uint8Array> {
    const img = await loadImage(src);
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');

    canvas.width = img.width;
    canvas.height = img.height;
    ctx?.drawImage(img, 0, 0);

    const blob = await new Promise<Blob>((resolve) => {
        canvas.toBlob((b) => resolve(b!), 'image/jpeg', quality);
    });

    const arrayBuffer = await blob.arrayBuffer();
    return new Uint8Array(arrayBuffer);
}

function loadImage(src: string): Promise<HTMLImageElement> {
    return new Promise((resolve, reject) => {
        const img = new Image();
        img.onload = () => resolve(img);
        img.onerror = reject;
        img.src = src;
    });
}

export function downloadPDF(blob: Blob, filename: string = 'images.pdf') {
    // Ensure the filename ends with .pdf
    const finalFilename = filename.endsWith('.pdf') ? filename : `${filename}.pdf`;

    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = finalFilename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
}
