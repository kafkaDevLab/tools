'use client';

import React, { useState, useRef, useCallback } from 'react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { Image as ImageIcon, Upload, FileImage, Download, X, RefreshCw, Archive } from 'lucide-react';
import JSZip from 'jszip';

interface ConvertedImage {
    originalName: string;
    blob: Blob;
    previewUrl: string;
    size: number;
}

export default function ImageConvertPage() {
    const [isDragOver, setIsDragOver] = useState(false);
    const [isConverting, setIsConverting] = useState(false);
    const [convertedImages, setConvertedImages] = useState<ConvertedImage[]>([]);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragOver(true);
    };

    const handleDragLeave = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragOver(false);
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragOver(false);
        if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
            processFiles(Array.from(e.dataTransfer.files));
        }
    };

    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            processFiles(Array.from(e.target.files));
        }
    };

    const processFiles = async (files: File[]) => {
        setIsConverting(true);
        const newConverted: ConvertedImage[] = [];

        for (const file of files) {
            if (!file.type.startsWith('image/')) continue;

            try {
                const image = await new Promise<HTMLImageElement>((resolve, reject) => {
                    const img = new Image();
                    img.onload = () => resolve(img);
                    img.onerror = reject;
                    img.src = URL.createObjectURL(file);
                });

                const canvas = document.createElement('canvas');
                canvas.width = image.width;
                canvas.height = image.height;
                const ctx = canvas.getContext('2d');
                if (!ctx) continue;

                ctx.drawImage(image, 0, 0);

                const blob = await new Promise<Blob>((resolve) => {
                    canvas.toBlob((b) => resolve(b!), 'image/webp', 0.8);
                });

                newConverted.push({
                    originalName: file.name,
                    blob,
                    previewUrl: URL.createObjectURL(blob),
                    size: blob.size
                });
            } catch (error) {
                console.error('Error converting file:', file.name, error);
            }
        }

        setConvertedImages(prev => [...prev, ...newConverted]);
        setIsConverting(false);

        // Reset input so same files can be selected again if needed
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    const removeImage = (index: number) => {
        setConvertedImages(prev => prev.filter((_, i) => i !== index));
    };

    const downloadImage = (img: ConvertedImage) => {
        const link = document.createElement('a');
        link.href = img.previewUrl;
        // Replace extension with .webp
        const namePart = img.originalName.substring(0, img.originalName.lastIndexOf('.')) || img.originalName;
        link.download = `${namePart}.webp`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const downloadAll = async () => {
        if (convertedImages.length === 0) return;

        setIsConverting(true); // Reuse loading state for zip generation

        try {
            const zip = new JSZip();

            // Add files to zip
            convertedImages.forEach(img => {
                const namePart = img.originalName.substring(0, img.originalName.lastIndexOf('.')) || img.originalName;
                zip.file(`${namePart}.webp`, img.blob);
            });

            // Generate zip
            const content = await zip.generateAsync({ type: "blob" });
            const url = URL.createObjectURL(content);

            const link = document.createElement('a');
            link.href = url;
            link.download = `converted_images_${new Date().getTime()}.zip`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            URL.revokeObjectURL(url);
        } catch (error) {
            console.error('Error generating zip:', error);
        } finally {
            setIsConverting(false);
        }
    };

    const formatSize = (bytes: number) => {
        if (bytes === 0) return '0 B';
        const k = 1024;
        const sizes = ['B', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    };

    return (
        <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900">
            <Header />
            <main className="flex-grow pt-24 pb-12 px-6">
                <div className="max-w-4xl mx-auto">
                    <div className="text-center mb-10">
                        <div className="flex justify-center mb-4">
                            <div className="w-16 h-16 bg-orange-100 rounded-2xl flex items-center justify-center text-orange-600">
                                <ImageIcon size={32} />
                            </div>
                        </div>
                        <h1 className="text-3xl font-bold mb-2 text-slate-900">이미지 WebP 변환기</h1>
                        <p className="text-slate-500">JPG, PNG 등 다양한 이미지를 가볍고 효율적인 WebP 포맷으로 변환하세요.</p>
                    </div>

                    {/* Upload Area */}
                    <div
                        className={`
                relative border-2 border-dashed rounded-2xl p-12 text-center transition-all cursor-pointer mb-8
                ${isDragOver ? 'border-blue-500 bg-blue-50' : 'border-slate-200 bg-white hover:border-blue-400 hover:bg-slate-50'}
            `}
                        onDragOver={handleDragOver}
                        onDragLeave={handleDragLeave}
                        onDrop={handleDrop}
                        onClick={() => fileInputRef.current?.click()}
                    >
                        <input
                            type="file"
                            ref={fileInputRef}
                            className="hidden"
                            multiple
                            accept="image/png, image/jpeg, image/jpg, image/webp"
                            onChange={handleFileSelect}
                        />

                        <div className="pointer-events-none">
                            <div className="flex justify-center mb-4">
                                <div className={`p-4 rounded-full ${isDragOver ? 'bg-blue-200 text-blue-600' : 'bg-slate-100 text-slate-400'}`}>
                                    <Upload size={32} />
                                </div>
                            </div>
                            <h3 className="text-lg font-semibold text-slate-700 mb-2">
                                이미지를 여기로 드래그하거나 클릭하세요
                            </h3>
                            <p className="text-sm text-slate-400">
                                지원 포맷: PNG, JPG, JPEG, GIF
                            </p>
                        </div>

                        {isConverting && (
                            <div className="absolute inset-0 bg-white/80 flex flex-col items-center justify-center rounded-2xl backdrop-blur-sm">
                                <RefreshCw className="w-10 h-10 text-blue-600 animate-spin mb-3" />
                                <p className="font-semibold text-blue-600">변환 중...</p>
                            </div>
                        )}
                    </div>

                    {/* Results Area */}
                    {convertedImages.length > 0 && (
                        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
                            <div className="p-4 border-b border-slate-100 bg-slate-50 flex justify-between items-center">
                                <h3 className="font-semibold text-slate-700 flex items-center gap-2">
                                    <FileImage size={18} /> 변환된 이미지 ({convertedImages.length})
                                </h3>
                                <button
                                    onClick={downloadAll}
                                    className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-bold flex items-center gap-2 transition-colors shadow-sm"
                                >
                                    <Archive size={16} />
                                    전체 다운로드 (ZIP)
                                </button>
                            </div>
                            <div className="divide-y divide-slate-100">
                                {convertedImages.map((img, idx) => (
                                    <div key={idx} className="p-4 flex items-center justify-between hover:bg-slate-50 transition-colors">
                                        <div className="flex items-center gap-4">
                                            <div className="w-16 h-16 bg-slate-100 rounded-lg overflow-hidden border border-slate-200 relative">
                                                {/* eslint-disable-next-line @next/next/no-img-element */}
                                                <img src={img.previewUrl} alt="preview" className="w-full h-full object-cover" />
                                            </div>
                                            <div>
                                                <p className="font-medium text-slate-900 truncate max-w-[200px] sm:max-w-xs">{img.originalName}</p>
                                                <div className="flex items-center gap-2 mt-1">
                                                    <span className="text-xs font-bold text-orange-600 bg-orange-50 px-1.5 py-0.5 rounded">WEBP</span>
                                                    <span className="text-xs text-slate-400">{formatSize(img.size)}</span>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <button
                                                onClick={() => downloadImage(img)}
                                                className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors flex flex-col items-center gap-1"
                                                title="다운로드"
                                            >
                                                <Download size={20} />
                                            </button>
                                            <button
                                                onClick={() => removeImage(idx)}
                                                className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                                                title="삭제"
                                            >
                                                <X size={20} />
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </main>
            <Footer />
        </div>
    );
}
