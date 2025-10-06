import React, { useState } from 'react';
import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { GLTFExporter } from 'three/addons/exporters/GLTFExporter.js';
import { Button } from '../ui/Button';
import { Card } from '../ui/Card';
import { Textarea } from '../ui/Textarea';
import { Loader } from '../ui/Loader';
import { generateJerseyImages } from '../../services/geminiService';
import { DownloadIcon } from '../icons/DownloadIcon';

// Base64 encoded simple T-shirt GLB model. This avoids needing an external file.
// FIX: Corrected the corrupted end of the base64 string to fix a syntax error.
const BASE_MANNEQUIN_GLB = 'data:application/octet-stream;base64,Z2xURgIAAACoAgAAYVNDSU4AAAAwzthET413Q7ofjP5XCN3rAQAAAAAAAAC4DQAASYAAAAEAAADNAQAAnAAAAGpTT05fU0NFTkVfT1JHSU5BTF9HTFRGXzAuODIAAABURVhUVVJFUAAsAAEAAgAAABAAAAAYAAAAAQAAAAYAAgAAACAAAADgAwAAYAAAAAMAAAAIAAMAAAAFAAAACAAFAAMBAAEAAAAAAAYABgACAAAAEQAIAAYAAwAAABIAAwAHAAQAAAAMAAkABwAFAAAADAAKAAgAAwAAAA0ACwAJAAQAAAALAAwACgAFAAAADAAJAAkABgAAAAsADAAMAAcAAAAMAA0ADgAJAAAADQAPABAAAAANABEAEQAAAA0AEgATAAAADQAUABUAAAANABYAFwAAAA0AGAAZAAAADQAKABoAAAAJABsAHAANAAAADQAJAB0ADgAAAAwACgAeAAkAAAALAAwACgAfAAgAAAAMAAkAIAANAAAACwAMAAkAQQANAAAACwAMAEEAIgANAAAACwAMAEEAJAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA-g=';

const Mannequin: React.FC<{ frontImageUrl: string | null; backImageUrl: string | null; }> = ({ frontImageUrl, backImageUrl }) => {
  const jerseyFaceStyle: React.CSSProperties = {
    position: 'absolute',
    width: '100%',
    height: '100%',
    backfaceVisibility: 'hidden',
    clipPath: 'polygon(20% 0, 80% 0, 100% 18%, 92% 100%, 8% 100%, 0 18%)',
  };

  const jerseyTextureStyle: React.CSSProperties = {
    width: '100%',
    height: '100%',
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    backgroundRepeat: 'no-repeat',
  };

  const overlayStyle: React.CSSProperties = {
    width: '100%',
    height: '100%',
    background: 'linear-gradient(45deg, rgba(255,255,255,0.15) 0%, rgba(0,0,0,0.2) 100%)',
    boxShadow: 'inset 0px 10px 25px rgba(0,0,0,0.4), inset 0px -5px 15px rgba(0,0,0,0.2)',
  };

  return (
    <div className="relative w-64 h-96 select-none pointer-events-none group flex items-center justify-center">
      <div className="relative w-48 h-72" style={{ transformStyle: 'preserve-3d', transform: 'translateY(-20px)' }}>
        {/* Head */}
        <div 
          className="absolute top-0 left-1/2 -translate-x-1/2 w-20 h-20 bg-gray-300 dark:bg-gray-600 rounded-full shadow-md"
          style={{ transform: 'translateZ(10px)' }}
        ></div>

        {/* Neck */}
        <div 
          className="absolute top-[72px] left-1/2 -translate-x-1/2 w-10 h-8 bg-gray-400 dark:bg-gray-500"
        ></div>
        
        {/* Torso & Shoulders Container */}
        <div 
          className="absolute top-[96px] left-1/2 -translate-x-1/2 w-full h-[180px]"
          style={{ 
            transformStyle: 'preserve-3d',
            transform: 'translateZ(-15px)',
          }}
        >
          {/* Front Face */}
          <div style={{ ...jerseyFaceStyle, transform: 'rotateY(0deg)' }} className="bg-gray-200 dark:bg-gray-700">
            <div
              style={{
                ...jerseyTextureStyle,
                backgroundImage: frontImageUrl ? `url(${frontImageUrl})` : 'none',
              }}
            >
              <div style={overlayStyle}></div>
            </div>
          </div>
          
          {/* Back Face */}
          <div style={{ ...jerseyFaceStyle, transform: 'rotateY(180deg)' }} className="bg-gray-200 dark:bg-gray-700">
            <div
              style={{
                ...jerseyTextureStyle,
                backgroundImage: backImageUrl ? `url(${backImageUrl})` : 'none',
              }}
            >
              <div style={overlayStyle}></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};


export const JerseyDesignerView: React.FC = () => {
  const [prompt, setPrompt] = useState('');
  const [generatedImages, setGeneratedImages] = useState<{ front: string | null; back: string | null } | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [is3D, setIs3D] = useState(false);
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [isExporting, setIsExporting] = useState(false);


  // State for 3D interaction
  const [rotation, setRotation] = useState({ x: -20, y: 30 });
  const [zoom, setZoom] = useState(1);
  const [isDragging, setIsDragging] = useState(false);
  const [lastMousePos, setLastMousePos] = useState({ x: 0, y: 0 });

  const handleGenerate = async () => {
    if (!prompt.trim()) return;
    setIsLoading(true);
    setGeneratedImages(null);
    const imageUrls = await generateJerseyImages(prompt);
    setGeneratedImages(imageUrls);
    setIsLoading(false);
  };
  
  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setUploadedImage(reader.result as string);
        setPrompt(prev => prev + " Uploaded image should be used as the main logo on the chest.");
      };
      reader.readAsDataURL(file);
    }
  };
  
  const handleDownloadImage = (side: 'front' | 'back') => {
    if (!generatedImages) return;
    const imageUrl = side === 'front' ? generatedImages.front : generatedImages.back;
    if (!imageUrl) return;

    const link = document.createElement('a');
    link.href = imageUrl;
    link.download = `ai-jersey-${side}.jpeg`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleDownloadZip = () => {
    if (!generatedImages?.front || !prompt) return;
    alert(
      "İndirme Simülasyonu:\n\n" +
      "Bu butona tıklandığında, normalde sunucu tarafında veya bir kütüphane yardımıyla bir ZIP dosyası oluşturulur.\n\n" +
      "Oluşturulacak ZIP dosyası şunları içerir:\n" +
      "1. jersey-front.jpeg (ön yüz görseli)\n" +
      "2. jersey-back.jpeg (arka yüz görseli)\n" +
      "3. prompt.txt (tasarımı oluşturmak için kullandığınız metin)\n\n" +
      "Bu geliştirme ortamında dosya sistemi erişimi ve ZIP kütüphaneleri kısıtlı olduğundan bu işlem simüle edilmektedir."
    );
  };

  const handleDownload3DModel = async () => {
     if (!generatedImages?.front) {
        alert("3D model oluşturmak için önce bir forma tasarımı oluşturmalısınız.");
        return;
    }

    setIsExporting(true);

    try {
        const scene = new THREE.Scene();
        
        const loader = new GLTFLoader();
        const textureLoader = new THREE.TextureLoader();

        const texture = await textureLoader.loadAsync(generatedImages.front);
        texture.flipY = false;
        texture.colorSpace = THREE.SRGBColorSpace;
        texture.needsUpdate = true;

        const material = new THREE.MeshStandardMaterial({
            map: texture,
            metalness: 0.1,
            roughness: 0.8,
        });

        const gltf = await loader.loadAsync(BASE_MANNEQUIN_GLB);
        
        gltf.scene.traverse((object) => {
            if (object instanceof THREE.Mesh) {
                object.material = material;
            }
        });

        scene.add(gltf.scene);

        const ambientLight = new THREE.AmbientLight(0xffffff, 2.5);
        scene.add(ambientLight);
        const directionalLight = new THREE.DirectionalLight(0xffffff, 1.5);
        directionalLight.position.set(0, 5, 5);
        scene.add(directionalLight);

        const exporter = new GLTFExporter();
        exporter.parse(
            scene,
            (result) => {
                if (result instanceof ArrayBuffer) {
                    const blob = new Blob([result], { type: 'model/gltf-binary' });
                    const link = document.createElement('a');
                    link.href = URL.createObjectURL(blob);
                    link.download = 'jersey-model.glb';
                    document.body.appendChild(link);
                    link.click();
                    document.body.removeChild(link);
                }
                setIsExporting(false);
            },
            (error) => {
                console.error('An error happened during GLTF export', error);
                alert('3D model oluşturulurken bir hata oluştu.');
                setIsExporting(false);
            },
            { binary: true }
        );

    } catch (error) {
        console.error('Error creating 3D model:', error);
        alert('3D model oluşturulurken bir hata oluştu. Lütfen konsolu kontrol edin.');
        setIsExporting(false);
    }
  };

  // Handlers for 3D model interaction
  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    setIsDragging(true);
    setLastMousePos({ x: e.clientX, y: e.clientY });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isDragging) return;
    const deltaX = e.clientX - lastMousePos.x;
    const deltaY = e.clientY - lastMousePos.y;

    setRotation(prev => ({
        x: Math.max(-90, Math.min(90, prev.x - deltaY * 0.5)), // Clamp vertical rotation
        y: prev.y + deltaX * 0.5,
    }));
    setLastMousePos({ x: e.clientX, y: e.clientY });
  };

  const handleWheel = (e: React.WheelEvent<HTMLDivElement>) => {
    e.preventDefault();
    setZoom(prev => Math.max(0.5, Math.min(2.5, prev + e.deltaY * -0.001)));
  };

  return (
    <div>
      <div className="flex items-center gap-4 mb-6">
        <h1 className="text-3xl font-bold">Forma Tasarımcısı</h1>
        <span className="text-sm font-semibold bg-yellow-400 text-yellow-900 px-3 py-1 rounded-full">Beta Test</span>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Controls */}
        <div className="space-y-6">
            <Card>
                <h2 className="text-xl font-bold mb-4">1. Forma Açıklaması</h2>
                <Textarea 
                    label="AI için forma detaylarını yazın"
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    placeholder="Örn: Ana renk kırmızı, kollarda beyaz şeritler. Göğüste bir kartal logosu ve 10 numara. Modern ve minimalist bir tasarım."
                    rows={5}
                />
            </Card>
            <Card>
                 <h2 className="text-xl font-bold mb-4">2. Logo Yükle (Opsiyonel)</h2>
                 <input type="file" accept="image/png, image/jpeg" onChange={handleImageUpload} className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-brand-secondary file:text-brand-primary hover:file:bg-green-200"/>
                 {uploadedImage && <img src={uploadedImage} alt="Uploaded logo preview" className="mt-4 h-20 w-20 object-contain rounded-md" />}
            </Card>
            <Card>
                <h2 className="text-xl font-bold mb-4">3. Oluştur & İndir</h2>
                 <div className="flex flex-col gap-4">
                    <Button onClick={handleGenerate} disabled={isLoading} className="w-full">
                        {isLoading ? 'Oluşturuluyor...' : 'AI ile Forma Oluştur'}
                    </Button>
                     <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <Button onClick={() => handleDownloadImage('front')} disabled={!generatedImages?.front} variant="secondary">
                            <DownloadIcon />
                            Ön Yüzü İndir
                        </Button>
                        <Button onClick={() => handleDownloadImage('back')} disabled={!generatedImages?.back} variant="secondary">
                            <DownloadIcon />
                            Arka Yüzü İndir
                        </Button>
                        <Button onClick={handleDownloadZip} disabled={!generatedImages?.front || !prompt} variant="secondary" className="sm:col-span-2">
                           <DownloadIcon />
                           Tümünü İndir (ZIP)
                        </Button>
                        <Button onClick={handleDownload3DModel} disabled={!generatedImages?.front || isExporting} variant="secondary" className="sm:col-span-2">
                            <DownloadIcon />
                            {isExporting ? 'Model Oluşturuluyor...' : '3D Modeli İndir (.glb)'}
                        </Button>
                    </div>
                </div>
            </Card>
        </div>

        {/* Preview */}
        <div>
            <Card>
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-bold">Önizleme</h2>
                    <div className="flex items-center space-x-2 p-1 bg-gray-200 dark:bg-gray-700 rounded-lg">
                        <button onClick={() => setIs3D(false)} className={`px-3 py-1 text-sm font-semibold rounded-md transition-colors ${!is3D ? 'bg-white dark:bg-gray-900 shadow' : ''}`}>2D Zemin</button>
                        <button onClick={() => setIs3D(true)} className={`px-3 py-1 text-sm font-semibold rounded-md transition-colors ${is3D ? 'bg-white dark:bg-gray-900 shadow' : ''}`}>3D Manken</button>
                    </div>
                </div>
                <div 
                    className={`relative aspect-square w-full bg-gray-200 dark:bg-gray-800 rounded-lg flex items-center justify-center overflow-hidden ${is3D && generatedImages?.front ? 'cursor-grab active:cursor-grabbing' : ''}`}
                    onMouseDown={is3D && generatedImages?.front ? handleMouseDown : undefined}
                    onMouseMove={is3D && generatedImages?.front ? handleMouseMove : undefined}
                    onMouseUp={is3D && generatedImages?.front ? handleMouseUp : undefined}
                    onMouseLeave={is3D && generatedImages?.front ? handleMouseUp : undefined}
                    onWheel={is3D && generatedImages?.front ? handleWheel : undefined}
                >
                    {isLoading ? <Loader /> :
                     generatedImages && (generatedImages.front || generatedImages.back) ? (
                        <>
                          {is3D ? (
                              generatedImages.front || generatedImages.back ? (
                                <div className="w-full h-full" style={{ perspective: '1000px' }}>
                                    <div 
                                      className="w-full h-full flex items-center justify-center transition-transform duration-100 ease-out"
                                      style={{ transform: `rotateX(${rotation.x}deg) rotateY(${rotation.y}deg) scale(${zoom})`}}
                                    >
                                        <Mannequin frontImageUrl={generatedImages.front} backImageUrl={generatedImages.back} />
                                    </div>
                                    <p className="text-xs text-white absolute bottom-2 left-1/2 -translate-x-1/2 bg-black/50 px-2 py-1 rounded-full pointer-events-none">Döndürmek için sürükleyin, yakınlaştırmak için tekerleği kullanın.</p>
                                </div>
                              ) : (
                                 <p className="text-gray-500 text-center px-4">3D önizleme için en az bir yüz tasarımı gereklidir.</p>
                              )
                          ) : (
                              <div className="flex w-full h-full gap-2 p-2">
                                <div className="flex-1 flex flex-col items-center justify-center bg-gray-300/50 dark:bg-gray-900/50 rounded-lg p-1">
                                    <h4 className="font-semibold mb-2 text-sm">Ön Görünüm</h4>
                                    {generatedImages.front ? <img src={generatedImages.front} alt="Front View" className="w-full h-full object-contain" /> : <p className="text-xs text-gray-500 p-4 text-center">Ön yüz oluşturulamadı.</p>}
                                </div>
                                <div className="flex-1 flex flex-col items-center justify-center bg-gray-300/50 dark:bg-gray-900/50 rounded-lg p-1">
                                    <h4 className="font-semibold mb-2 text-sm">Arka Görünüm</h4>
                                    {generatedImages.back ? <img src={generatedImages.back} alt="Back View" className="w-full h-full object-contain" /> : <p className="text-xs text-gray-500 p-4 text-center">Arka yüz oluşturulamadı.</p>}
                                </div>
                              </div>
                          )}
                        </>
                    ) : (
                        <p className="text-gray-500 text-center px-4">Forma önizlemesi burada görünecek.</p>
                    )}
                </div>
            </Card>
        </div>
      </div>
    </div>
  );
};