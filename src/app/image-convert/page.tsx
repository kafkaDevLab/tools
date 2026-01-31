'use client';

import React, { useState, useRef } from 'react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { Image as ImageIcon, Upload, Download, X, Archive, Settings, AlertTriangle, Zap } from 'lucide-react';
import JSZip from 'jszip';

interface ConvertedImage {
    originalName: string;
    originalFormat: string;
    blob: Blob;
    previewUrl: string;
    size: number;
    originalSize: number;
    width: number;
    height: number;
}

type ImageFormat = 'jpeg' | 'png' | 'webp' | 'gif' | 'tiff' | 'avif';

interface FormatInfo {
    label: string;
    ext: string;
    description: string;
}

const FORMAT_MAP: Record<ImageFormat, FormatInfo> = {
    jpeg: { label: 'JPG', ext: 'jpg', description: '가장 널리 사용되는 손실 압축 포맷' },
    png: { label: 'PNG', ext: 'png', description: '투명도 지원, 무손실 압축' },
    webp: { label: 'WebP', ext: 'webp', description: '최신 웹 포맷, 우수한 압축률' },
    gif: { label: 'GIF', ext: 'gif', description: '애니메이션 지원, 256색 제한' },
    tiff: { label: 'TIFF', ext: 'tiff', description: '고품질 인쇄용, 대용량' },
    avif: { label: 'AVIF', ext: 'avif', description: '차세대 포맷, 최고 압축률' },
};

export default function ImageConvertPage() {
    const [isDragOver, setIsDragOver] = useState(false);
    const [isConverting, setIsConverting] = useState(false);
    const [convertedImages, setConvertedImages] = useState<ConvertedImage[]>([]);
    const [targetFormat, setTargetFormat] = useState<ImageFormat>('webp');
    const [quality, setQuality] = useState<number>(80);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFormatChange = (format: ImageFormat) => {
        setTargetFormat(format);
    };

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

    const getOriginalFormat = (mimeType: string): string => {
        const formatMap: Record<string, string> = {
            'image/jpeg': 'JPG',
            'image/png': 'PNG',
            'image/webp': 'WebP',
            'image/gif': 'GIF',
            'image/tiff': 'TIFF',
            'image/avif': 'AVIF',
            'image/bmp': 'BMP',
            'image/svg+xml': 'SVG',
        };
        return formatMap[mimeType] || 'Unknown';
    };

    const processFiles = async (files: File[]) => {
        setIsConverting(true);
        const newConverted: ConvertedImage[] = [];

        for (const file of files) {
            if (!file.type.startsWith('image/')) continue;

            try {
                // Use server-side Sharp conversion via API
                const formData = new FormData();
                formData.append('file', file);
                formData.append('format', targetFormat);
                formData.append('quality', quality.toString());

                const response = await fetch('/api/convert', {
                    method: 'POST',
                    body: formData,
                });

                if (!response.ok) {
                    throw new Error('Conversion failed');
                }

                const blob = await response.blob();
                const width = parseInt(response.headers.get('X-Original-Width') || '0');
                const height = parseInt(response.headers.get('X-Original-Height') || '0');

                newConverted.push({
                    originalName: file.name,
                    originalFormat: getOriginalFormat(file.type),
                    blob,
                    previewUrl: URL.createObjectURL(blob),
                    size: blob.size,
                    originalSize: file.size,
                    width,
                    height
                });
            } catch (error) {
                console.error('Error converting file:', file.name, error);
            }
        }

        setConvertedImages(prev => [...prev, ...newConverted]);
        setIsConverting(false);

        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    const removeImage = (index: number) => {
        const imageToRemove = convertedImages[index];
        if (imageToRemove) {
            URL.revokeObjectURL(imageToRemove.previewUrl);
        }
        setConvertedImages(prev => prev.filter((_, i) => i !== index));
    };

    const downloadSingle = (img: ConvertedImage) => {
        const link = document.createElement('a');
        link.href = img.previewUrl;
        link.download = img.originalName.replace(/\.[^/.]+$/, `.${FORMAT_MAP[targetFormat].ext}`);
        link.click();
    };

    const downloadAll = async () => {
        if (convertedImages.length === 0) return;

        const zip = new JSZip();
        const ext = FORMAT_MAP[targetFormat].ext;

        convertedImages.forEach((img) => {
            const filename = img.originalName.replace(/\.[^/.]+$/, `.${ext}`);
            zip.file(filename, img.blob);
        });

        const zipBlob = await zip.generateAsync({ type: 'blob' });
        const link = document.createElement('a');
        link.href = URL.createObjectURL(zipBlob);
        link.download = `converted_images_${Date.now()}.zip`;
        link.click();
    };

    const clearAll = () => {
        convertedImages.forEach(img => URL.revokeObjectURL(img.previewUrl));
        setConvertedImages([]);
    };

    const formatBytes = (bytes: number) => {
        if (bytes === 0) return '0 B';
        const k = 1024;
        const sizes = ['B', 'KB', 'MB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
    };

    const getCompressionRate = (original: number, converted: number) => {
        return ((original - converted) / original) * 100;
    };

    const getFormatColor = (format: string) => {
        const colors: Record<string, string> = {
            'JPG': 'bg-red-100 text-red-700',
            'JPEG': 'bg-red-100 text-red-700',
            'PNG': 'bg-blue-100 text-blue-700',
            'WebP': 'bg-green-100 text-green-700',
            'WEBP': 'bg-green-100 text-green-700',
            'GIF': 'bg-purple-100 text-purple-700',
            'TIFF': 'bg-yellow-100 text-yellow-700',
            'AVIF': 'bg-cyan-100 text-cyan-700',
            'BMP': 'bg-orange-100 text-orange-700',
            'SVG': 'bg-pink-100 text-pink-700',
        };
        return colors[format] || 'bg-slate-100 text-slate-700';
    };

    const getTotalSaved = () => {
        const originalTotal = convertedImages.reduce((sum, img) => sum + img.originalSize, 0);
        const convertedTotal = convertedImages.reduce((sum, img) => sum + img.size, 0);
        return {
            saved: originalTotal - convertedTotal,
            percent: originalTotal > 0 ? ((originalTotal - convertedTotal) / originalTotal) * 100 : 0
        };
    };

    const isLossyFormat = targetFormat === 'jpeg' || targetFormat === 'webp' || targetFormat === 'avif';

    return (
        <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900">
            <Header />
            <main className="flex-grow pt-24 pb-12 px-6">
                <div className="max-w-5xl mx-auto">
                    <div className="text-center mb-10">
                        <div className="flex justify-center mb-4">
                            <div className="w-16 h-16 bg-orange-100 rounded-2xl flex items-center justify-center text-orange-600">
                                <ImageIcon size={32} />
                            </div>
                        </div>
                        <h1 className="text-3xl font-bold mb-2 text-slate-900">이미지 확장자 변환</h1>
                        <p className="text-slate-500">다양한 이미지 포맷을 손쉽게 변환하세요</p>
                    </div>

                    {/* Settings Panel */}
                    <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 mb-8">
                        <h2 className="font-semibold text-lg mb-4 flex items-center gap-2">
                            <Settings size={18} className="text-orange-500" />
                            변환 설정
                        </h2>

                        {/* Format Selector */}
                        <div className="mb-6">
                            <label className="block text-sm font-medium text-slate-600 mb-3">대상 포맷</label>
                            <div className="grid grid-cols-3 md:grid-cols-6 gap-2">
                                {(Object.keys(FORMAT_MAP) as ImageFormat[]).map((format) => (
                                    <button
                                        key={format}
                                        onClick={() => handleFormatChange(format)}
                                        className={`py-3 px-2 text-sm rounded-lg border font-medium transition-all flex flex-col items-center gap-1 ${targetFormat === format
                                                ? 'bg-orange-500 text-white border-orange-500 shadow-md'
                                                : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
                                            }`}
                                    >
                                        <span className="font-bold">{FORMAT_MAP[format].label}</span>
                                    </button>
                                ))}
                            </div>
                            <p className="text-xs text-slate-400 mt-2">
                                {FORMAT_MAP[targetFormat].description}
                            </p>
                        </div>

                        {/* Quality Slider - only for lossy formats */}
                        {isLossyFormat && (
                            <div>
                                <label className="block text-sm font-medium text-slate-600 mb-2">
                                    품질 ({quality}%)
                                </label>
                                <input
                                    type="range"
                                    min="10"
                                    max="100"
                                    step="5"
                                    value={quality}
                                    onChange={(e) => setQuality(parseInt(e.target.value))}
                                    className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-orange-500"
                                />
                                <div className="flex justify-between text-xs text-slate-400 mt-1">
                                    <span>작은 용량</span>
                                    <span>높은 품질</span>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Upload Area */}
                    <div
                        onDragOver={handleDragOver}
                        onDragLeave={handleDragLeave}
                        onDrop={handleDrop}
                        onClick={() => fileInputRef.current?.click()}
                        className={`border-2 border-dashed rounded-2xl p-12 text-center cursor-pointer transition-all ${isDragOver
                                ? 'border-orange-500 bg-orange-50'
                                : 'border-slate-200 hover:border-orange-300 hover:bg-orange-50/30'
                            }`}
                    >
                        <Upload className={`mx-auto mb-4 ${isDragOver ? 'text-orange-500' : 'text-slate-400'}`} size={48} />
                        <p className="text-lg font-medium text-slate-700 mb-2">
                            {isDragOver ? '파일을 놓아주세요' : '이미지를 드래그하거나 클릭하여 업로드'}
                        </p>
                        <p className="text-sm text-slate-400">JPG, PNG, WebP, GIF, BMP, TIFF, SVG 지원</p>
                        <input
                            ref={fileInputRef}
                            type="file"
                            accept="image/*"
                            multiple
                            onChange={handleFileSelect}
                            className="hidden"
                        />
                    </div>

                    {/* Converting Indicator */}
                    {isConverting && (
                        <div className="mt-6 text-center">
                            <div className="inline-flex items-center gap-2 bg-orange-50 text-orange-600 px-4 py-2 rounded-full">
                                <div className="w-4 h-4 border-2 border-orange-600 border-t-transparent rounded-full animate-spin"></div>
                                <span className="text-sm font-medium">변환 중...</span>
                            </div>
                        </div>
                    )}

                    {/* Converted Images */}
                    {convertedImages.length > 0 && (
                        <div className="mt-8">
                            {/* Summary */}
                            {(() => {
                                const { saved, percent } = getTotalSaved();
                                const isPositive = saved > 0;
                                return (
                                    <div className={`p-4 rounded-xl mb-4 flex items-center justify-between ${isPositive
                                            ? 'bg-gradient-to-r from-green-500 to-emerald-600 text-white'
                                            : 'bg-gradient-to-r from-orange-500 to-red-500 text-white'
                                        }`}>
                                        <div>
                                            <p className="text-sm opacity-90">
                                                {isPositive ? '총 절약된 용량' : '총 증가된 용량'}
                                            </p>
                                            <p className="text-2xl font-bold">
                                                {formatBytes(Math.abs(saved))} ({Math.abs(percent).toFixed(1)}% {isPositive ? '감소' : '증가'})
                                            </p>
                                        </div>
                                        {isPositive ? <Zap size={32} className="opacity-50" /> : <AlertTriangle size={32} className="opacity-50" />}
                                    </div>
                                );
                            })()}

                            <div className="flex justify-between items-center mb-4">
                                <h3 className="font-semibold text-lg">변환된 이미지 ({convertedImages.length}개)</h3>
                                <div className="flex gap-2">
                                    <button
                                        onClick={downloadAll}
                                        className="flex items-center gap-2 px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-all shadow-sm"
                                    >
                                        <Archive size={16} />
                                        전체 다운로드 (ZIP)
                                    </button>
                                    <button
                                        onClick={clearAll}
                                        className="px-4 py-2 bg-slate-200 text-slate-700 rounded-lg hover:bg-slate-300 transition-all"
                                    >
                                        전체 삭제
                                    </button>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 gap-4">
                                {convertedImages.map((img, index) => {
                                    const compressionRate = getCompressionRate(img.originalSize, img.size);
                                    const isSmaller = compressionRate > 0;

                                    return (
                                        <div key={index} className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden group">
                                            <div className="grid grid-cols-1 md:grid-cols-12 gap-4 p-4">
                                                {/* Preview */}
                                                <div className="md:col-span-3">
                                                    <div className="relative aspect-video bg-slate-100 rounded-lg overflow-hidden">
                                                        <img
                                                            src={img.previewUrl}
                                                            alt={img.originalName}
                                                            className="w-full h-full object-cover"
                                                        />
                                                        <button
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                removeImage(index);
                                                            }}
                                                            className="absolute top-2 right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600"
                                                        >
                                                            <X size={14} />
                                                        </button>
                                                    </div>
                                                </div>

                                                {/* File Info */}
                                                <div className="md:col-span-6 flex flex-col justify-center">
                                                    <p className="text-sm font-medium text-slate-700 truncate mb-2">
                                                        {img.originalName}
                                                    </p>
                                                    <div className="flex flex-wrap gap-2 mb-2">
                                                        <span className={`text-xs px-2 py-1 rounded font-medium ${getFormatColor(img.originalFormat)}`}>
                                                            {img.originalFormat}
                                                        </span>
                                                        <span className="text-xs px-2 py-1 rounded font-medium bg-slate-100 text-slate-600">
                                                            →
                                                        </span>
                                                        <span className={`text-xs px-2 py-1 rounded font-medium ${getFormatColor(FORMAT_MAP[targetFormat].label)}`}>
                                                            {FORMAT_MAP[targetFormat].label}
                                                        </span>
                                                        <span className="text-xs px-2 py-1 rounded font-medium bg-slate-100 text-slate-600">
                                                            {img.width} × {img.height}
                                                        </span>
                                                    </div>
                                                    <div className="grid grid-cols-2 gap-2 text-xs">
                                                        <div>
                                                            <span className="text-slate-400">원본:</span>
                                                            <span className="ml-1 font-medium text-slate-600">{formatBytes(img.originalSize)}</span>
                                                        </div>
                                                        <div>
                                                            <span className="text-slate-400">변환:</span>
                                                            <span className="ml-1 font-medium text-slate-600">{formatBytes(img.size)}</span>
                                                        </div>
                                                    </div>
                                                    <div className="mt-2">
                                                        {isSmaller ? (
                                                            <span className="text-xs font-medium text-green-600">
                                                                ✓ {compressionRate.toFixed(1)}% 감소 ({formatBytes(img.originalSize - img.size)} 절약)
                                                            </span>
                                                        ) : (
                                                            <span className="text-xs font-medium text-orange-600 flex items-center gap-1">
                                                                <AlertTriangle size={12} /> {Math.abs(compressionRate).toFixed(1)}% 증가
                                                            </span>
                                                        )}
                                                    </div>
                                                </div>

                                                {/* Actions */}
                                                <div className="md:col-span-3 flex items-center justify-end">
                                                    <button
                                                        onClick={() => downloadSingle(img)}
                                                        className="w-full md:w-auto flex items-center justify-center gap-2 px-4 py-2 bg-slate-100 text-slate-700 rounded-lg hover:bg-slate-200 transition-all text-sm font-medium"
                                                    >
                                                        <Download size={14} />
                                                        다운로드
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    )}
                </div>
            </main>
            <Footer />
        </div>
    );
}
