'use client';

import React, { useState, useRef } from 'react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { Maximize2, Upload, Download, X, Archive, Lock, Unlock, Crop, Minimize2 } from 'lucide-react';
import JSZip from 'jszip';

interface ResizedImage {
    originalName: string;
    blob: Blob;
    previewUrl: string;
    size: number;
    originalSize: number;
    width: number;
    height: number;
    originalWidth: number;
    originalHeight: number;
}

type ResizeMode = 'pixel' | 'percent' | 'preset';
type PresetSize = 'thumbnail' | 'instagram' | 'facebook' | 'twitter' | 'youtube';
type FitMode = 'contain' | 'cover';
type CropPosition = 'center' | 'top' | 'bottom' | 'left' | 'right';

const PRESETS: Record<PresetSize, { width: number; height: number; label: string }> = {
    thumbnail: { width: 150, height: 150, label: '썸네일 (150x150)' },
    instagram: { width: 1080, height: 1080, label: '인스타그램 (1080x1080)' },
    facebook: { width: 1200, height: 630, label: '페이스북 (1200x630)' },
    twitter: { width: 1200, height: 675, label: '트위터 (1200x675)' },
    youtube: { width: 1280, height: 720, label: '유튜브 (1280x720)' }
};

export default function ImageResizePage() {
    const [isDragOver, setIsDragOver] = useState(false);
    const [isProcessing, setIsProcessing] = useState(false);
    const [resizedImages, setResizedImages] = useState<ResizedImage[]>([]);
    const [resizeMode, setResizeMode] = useState<ResizeMode>('pixel');
    const [width, setWidth] = useState<number>(800);
    const [height, setHeight] = useState<number>(600);
    const [percent, setPercent] = useState<number>(50);
    const [preset, setPreset] = useState<PresetSize>('instagram');
    const [lockAspectRatio, setLockAspectRatio] = useState<boolean>(true);
    const [aspectRatio, setAspectRatio] = useState<number>(1);
    const [fitMode, setFitMode] = useState<FitMode>('contain');
    const [cropPosition, setCropPosition] = useState<CropPosition>('center');
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

    const handleWidthChange = (newWidth: number) => {
        setWidth(newWidth);
        if (lockAspectRatio && aspectRatio) {
            setHeight(Math.round(newWidth / aspectRatio));
        }
    };

    const handleHeightChange = (newHeight: number) => {
        setHeight(newHeight);
        if (lockAspectRatio && aspectRatio) {
            setWidth(Math.round(newHeight * aspectRatio));
        }
    };

    const processFiles = async (files: File[]) => {
        setIsProcessing(true);
        const newResized: ResizedImage[] = [];

        for (const file of files) {
            if (!file.type.startsWith('image/')) continue;

            try {
                const image = await new Promise<HTMLImageElement>((resolve, reject) => {
                    const img = new Image();
                    img.onload = () => resolve(img);
                    img.onerror = reject;
                    img.src = URL.createObjectURL(file);
                });

                // Calculate target dimensions
                let targetWidth: number;
                let targetHeight: number;

                if (resizeMode === 'pixel') {
                    targetWidth = width;
                    targetHeight = height;
                } else if (resizeMode === 'percent') {
                    targetWidth = Math.round(image.width * (percent / 100));
                    targetHeight = Math.round(image.height * (percent / 100));
                } else {
                    const presetSize = PRESETS[preset];
                    targetWidth = presetSize.width;
                    targetHeight = presetSize.height;
                }

                const canvas = document.createElement('canvas');
                canvas.width = targetWidth;
                canvas.height = targetHeight;
                const ctx = canvas.getContext('2d');
                if (!ctx) continue;

                // Calculate source and destination rectangles based on fit mode
                let sx = 0, sy = 0, sw = image.width, sh = image.height;
                let dx = 0, dy = 0, dw = targetWidth, dh = targetHeight;

                const srcAspect = image.width / image.height;
                const dstAspect = targetWidth / targetHeight;

                if (resizeMode === 'percent') {
                    // For percent mode, just scale directly (no aspect ratio handling needed)
                    ctx.drawImage(image, 0, 0, targetWidth, targetHeight);
                } else if (fitMode === 'cover') {
                    // Cover: crop to fill the entire target area
                    if (srcAspect > dstAspect) {
                        // Source is wider - crop horizontally
                        sw = image.height * dstAspect;
                        sh = image.height;

                        // Apply crop position
                        if (cropPosition === 'left') {
                            sx = 0;
                        } else if (cropPosition === 'right') {
                            sx = image.width - sw;
                        } else {
                            sx = (image.width - sw) / 2; // center
                        }
                    } else {
                        // Source is taller - crop vertically
                        sw = image.width;
                        sh = image.width / dstAspect;

                        // Apply crop position
                        if (cropPosition === 'top') {
                            sy = 0;
                        } else if (cropPosition === 'bottom') {
                            sy = image.height - sh;
                        } else {
                            sy = (image.height - sh) / 2; // center
                        }
                    }
                    ctx.drawImage(image, sx, sy, sw, sh, dx, dy, dw, dh);
                } else {
                    // Contain: fit within bounds, may have letterboxing
                    if (srcAspect > dstAspect) {
                        // Source is wider - fit by width
                        dh = targetWidth / srcAspect;
                        dy = (targetHeight - dh) / 2;
                    } else {
                        // Source is taller - fit by height
                        dw = targetHeight * srcAspect;
                        dx = (targetWidth - dw) / 2;
                    }

                    // Fill background with white for contain mode
                    ctx.fillStyle = '#ffffff';
                    ctx.fillRect(0, 0, targetWidth, targetHeight);
                    ctx.drawImage(image, 0, 0, image.width, image.height, dx, dy, dw, dh);
                }

                if (resizeMode !== 'percent' && fitMode !== 'cover') {
                    // Already drawn above
                } else if (resizeMode === 'percent') {
                    // Already drawn above
                }

                const blob = await new Promise<Blob>((resolve) => {
                    canvas.toBlob((b) => resolve(b!), file.type || 'image/png', 0.9);
                });

                newResized.push({
                    originalName: file.name,
                    blob,
                    previewUrl: URL.createObjectURL(blob),
                    size: blob.size,
                    originalSize: file.size,
                    width: targetWidth,
                    height: targetHeight,
                    originalWidth: image.width,
                    originalHeight: image.height
                });
            } catch (error) {
                console.error('Error resizing file:', file.name, error);
            }
        }

        setResizedImages(prev => [...prev, ...newResized]);
        setIsProcessing(false);

        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    const removeImage = (index: number) => {
        const imageToRemove = resizedImages[index];
        if (imageToRemove) {
            URL.revokeObjectURL(imageToRemove.previewUrl);
        }
        setResizedImages(prev => prev.filter((_, i) => i !== index));
    };

    const downloadSingle = (img: ResizedImage) => {
        const link = document.createElement('a');
        link.href = img.previewUrl;
        link.download = img.originalName.replace(/(\.[^.]+)$/, `_resized$1`);
        link.click();
    };

    const downloadAll = async () => {
        if (resizedImages.length === 0) return;

        const zip = new JSZip();

        resizedImages.forEach((img) => {
            const filename = img.originalName.replace(/(\.[^.]+)$/, `_resized$1`);
            zip.file(filename, img.blob);
        });

        const zipBlob = await zip.generateAsync({ type: 'blob' });
        const link = document.createElement('a');
        link.href = URL.createObjectURL(zipBlob);
        link.download = `resized_images_${Date.now()}.zip`;
        link.click();
    };

    const clearAll = () => {
        resizedImages.forEach(img => URL.revokeObjectURL(img.previewUrl));
        setResizedImages([]);
    };

    const formatBytes = (bytes: number) => {
        if (bytes === 0) return '0 B';
        const k = 1024;
        const sizes = ['B', 'KB', 'MB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
    };

    const showFitOptions = resizeMode === 'pixel' || resizeMode === 'preset';

    return (
        <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900">
            <Header />
            <main className="flex-grow pt-24 pb-12 px-6">
                <div className="max-w-6xl mx-auto mb-4 flex justify-center">
                    <div className="flex items-start gap-4">
                        <div className="w-12 h-12 shrink-0 bg-blue-100 rounded-xl flex items-center justify-center text-blue-600">
                            <Maximize2 size={24} />
                        </div>
                        <div className="min-w-0">
                            <h1 className="text-2xl font-bold mb-1 text-slate-900">이미지 크기 조절</h1>
                            <p className="text-slate-500 text-sm">픽셀, 퍼센트, 프리셋 크기로 이미지를 리사이징하세요</p>
                        </div>
                    </div>
                </div>
                <div className="max-w-5xl mx-auto">
                    {/* Settings Panel */}
                    <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 mb-8">
                        <h2 className="font-semibold text-lg mb-4 flex items-center gap-2">
                            <Maximize2 size={18} className="text-blue-500" />
                            크기 설정
                        </h2>

                        {/* Mode Selector */}
                        <div className="mb-6">
                            <label className="block text-sm font-medium text-slate-600 mb-2">조절 방식</label>
                            <div className="flex bg-slate-100 p-1 rounded-lg">
                                <button
                                    onClick={() => setResizeMode('pixel')}
                                    className={`flex-1 py-2 text-sm font-medium rounded-md transition-all ${resizeMode === 'pixel' ? 'bg-white shadow-sm text-blue-600' : 'text-slate-500'
                                        }`}
                                >
                                    픽셀 지정
                                </button>
                                <button
                                    onClick={() => setResizeMode('percent')}
                                    className={`flex-1 py-2 text-sm font-medium rounded-md transition-all ${resizeMode === 'percent' ? 'bg-white shadow-sm text-blue-600' : 'text-slate-500'
                                        }`}
                                >
                                    퍼센트
                                </button>
                                <button
                                    onClick={() => setResizeMode('preset')}
                                    className={`flex-1 py-2 text-sm font-medium rounded-md transition-all ${resizeMode === 'preset' ? 'bg-white shadow-sm text-blue-600' : 'text-slate-500'
                                        }`}
                                >
                                    프리셋
                                </button>
                            </div>
                        </div>

                        {/* Pixel Mode */}
                        {resizeMode === 'pixel' && (
                            <div className="space-y-4">
                                <div className="flex items-center gap-2 mb-3">
                                    <button
                                        onClick={() => setLockAspectRatio(!lockAspectRatio)}
                                        className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${lockAspectRatio
                                            ? 'bg-blue-100 text-blue-700'
                                            : 'bg-slate-100 text-slate-600'
                                            }`}
                                    >
                                        {lockAspectRatio ? <Lock size={14} /> : <Unlock size={14} />}
                                        비율 유지
                                    </button>
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-slate-600 mb-2">가로 (px)</label>
                                        <input
                                            type="number"
                                            value={width}
                                            onChange={(e) => handleWidthChange(parseInt(e.target.value) || 0)}
                                            className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none hide-spinner"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-slate-600 mb-2">세로 (px)</label>
                                        <input
                                            type="number"
                                            value={height}
                                            onChange={(e) => handleHeightChange(parseInt(e.target.value) || 0)}
                                            className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none hide-spinner"
                                        />
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Percent Mode */}
                        {resizeMode === 'percent' && (
                            <div>
                                <label className="block text-sm font-medium text-slate-600 mb-2">
                                    크기 비율 ({percent}%)
                                </label>
                                <input
                                    type="range"
                                    min="10"
                                    max="200"
                                    step="5"
                                    value={percent}
                                    onChange={(e) => setPercent(parseInt(e.target.value))}
                                    className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-500"
                                />
                                <div className="flex justify-between text-xs text-slate-400 mt-1">
                                    <span>10%</span>
                                    <span>200%</span>
                                </div>
                            </div>
                        )}

                        {/* Preset Mode */}
                        {resizeMode === 'preset' && (
                            <div>
                                <label className="block text-sm font-medium text-slate-600 mb-2">프리셋 선택</label>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                                    {(Object.keys(PRESETS) as PresetSize[]).map((key) => (
                                        <button
                                            key={key}
                                            onClick={() => setPreset(key)}
                                            className={`py-3 px-4 text-sm rounded-lg border font-medium transition-all text-left ${preset === key
                                                ? 'bg-blue-500 text-white border-blue-500 shadow-md'
                                                : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
                                                }`}
                                        >
                                            <div className="font-semibold">{PRESETS[key].label}</div>
                                            <div className="text-xs opacity-75 mt-0.5">
                                                {PRESETS[key].width} × {PRESETS[key].height}
                                            </div>
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Fit Mode - only for pixel and preset modes */}
                        {showFitOptions && (
                            <div className="mt-6 pt-6 border-t border-slate-100">
                                <label className="block text-sm font-medium text-slate-600 mb-3">비율이 맞지 않을 때</label>
                                <div className="grid grid-cols-2 gap-3">
                                    <button
                                        onClick={() => setFitMode('cover')}
                                        className={`p-4 rounded-xl border-2 transition-all ${fitMode === 'cover'
                                                ? 'border-blue-500 bg-blue-50'
                                                : 'border-slate-200 hover:border-slate-300'
                                            }`}
                                    >
                                        <Crop size={24} className={`mx-auto mb-2 ${fitMode === 'cover' ? 'text-blue-600' : 'text-slate-400'}`} />
                                        <div className={`text-sm font-medium ${fitMode === 'cover' ? 'text-blue-700' : 'text-slate-600'}`}>
                                            자르기 (Cover)
                                        </div>
                                        <div className="text-xs text-slate-400 mt-1">
                                            영역을 꽉 채우고 넘치는 부분 자름
                                        </div>
                                    </button>
                                    <button
                                        onClick={() => setFitMode('contain')}
                                        className={`p-4 rounded-xl border-2 transition-all ${fitMode === 'contain'
                                                ? 'border-blue-500 bg-blue-50'
                                                : 'border-slate-200 hover:border-slate-300'
                                            }`}
                                    >
                                        <Minimize2 size={24} className={`mx-auto mb-2 ${fitMode === 'contain' ? 'text-blue-600' : 'text-slate-400'}`} />
                                        <div className={`text-sm font-medium ${fitMode === 'contain' ? 'text-blue-700' : 'text-slate-600'}`}>
                                            맞추기 (Contain)
                                        </div>
                                        <div className="text-xs text-slate-400 mt-1">
                                            이미지 전체를 표시, 여백 생김
                                        </div>
                                    </button>
                                </div>

                                {/* Crop Position - only shown when cover mode is selected */}
                                {fitMode === 'cover' && (
                                    <div className="mt-4">
                                        <label className="block text-sm font-medium text-slate-600 mb-2">자를 위치</label>
                                        <div className="flex flex-wrap gap-2">
                                            {[
                                                { value: 'center', label: '중앙' },
                                                { value: 'top', label: '상단' },
                                                { value: 'bottom', label: '하단' },
                                                { value: 'left', label: '좌측' },
                                                { value: 'right', label: '우측' },
                                            ].map((pos) => (
                                                <button
                                                    key={pos.value}
                                                    onClick={() => setCropPosition(pos.value as CropPosition)}
                                                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${cropPosition === pos.value
                                                            ? 'bg-blue-500 text-white'
                                                            : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                                                        }`}
                                                >
                                                    {pos.label}
                                                </button>
                                            ))}
                                        </div>
                                        <p className="text-xs text-slate-400 mt-2">
                                            이미지가 가로로 넘칠 때: 좌측/중앙/우측 적용 | 세로로 넘칠 때: 상단/중앙/하단 적용
                                        </p>
                                    </div>
                                )}
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
                            ? 'border-blue-500 bg-blue-50'
                            : 'border-slate-200 hover:border-blue-300 hover:bg-blue-50/30'
                            }`}
                    >
                        <Upload className={`mx-auto mb-4 ${isDragOver ? 'text-blue-500' : 'text-slate-400'}`} size={48} />
                        <p className="text-lg font-medium text-slate-700 mb-2">
                            {isDragOver ? '파일을 놓아주세요' : '이미지를 드래그하거나 클릭하여 업로드'}
                        </p>
                        <p className="text-sm text-slate-400">JPG, PNG, WebP, GIF 지원 (여러 파일 동시 업로드 가능)</p>
                        <input
                            ref={fileInputRef}
                            type="file"
                            accept="image/*"
                            multiple
                            onChange={handleFileSelect}
                            className="hidden"
                        />
                    </div>

                    {/* Processing Indicator */}
                    {isProcessing && (
                        <div className="mt-6 text-center">
                            <div className="inline-flex items-center gap-2 bg-blue-50 text-blue-600 px-4 py-2 rounded-full">
                                <div className="w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                                <span className="text-sm font-medium">처리 중...</span>
                            </div>
                        </div>
                    )}

                    {/* Resized Images */}
                    {resizedImages.length > 0 && (
                        <div className="mt-8">
                            <div className="flex justify-between items-center mb-4">
                                <h3 className="font-semibold text-lg">리사이징된 이미지 ({resizedImages.length}개)</h3>
                                <div className="flex gap-2">
                                    <button
                                        onClick={downloadAll}
                                        className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-all shadow-sm"
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

                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                {resizedImages.map((img, index) => (
                                    <div key={index} className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden group">
                                        <div className="relative aspect-video bg-slate-100">
                                            <img
                                                src={img.previewUrl}
                                                alt={img.originalName}
                                                className="w-full h-full object-contain"
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
                                        <div className="p-3">
                                            <p className="text-sm font-medium text-slate-700 truncate mb-2">
                                                {img.originalName}
                                            </p>
                                            <div className="flex justify-between items-center text-xs text-slate-500 mb-1">
                                                <span>{img.originalWidth}×{img.originalHeight} → {img.width}×{img.height}</span>
                                                <span>{formatBytes(img.size)}</span>
                                            </div>
                                            <button
                                                onClick={() => downloadSingle(img)}
                                                className="w-full flex items-center justify-center gap-2 px-3 py-2 bg-slate-100 text-slate-700 rounded-lg hover:bg-slate-200 transition-all text-sm font-medium mt-2"
                                            >
                                                <Download size={14} />
                                                다운로드
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
