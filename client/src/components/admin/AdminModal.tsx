import React, { useState, useEffect } from 'react';
import Cropper from 'react-easy-crop';
import { Lock, XCircle, Plus, UploadCloud, Trash2, FileText, CheckCircle2, Heart } from 'lucide-react';
// --- Crop Helper ---
const getCroppedImg = async (imageSrc: string, pixelCrop: any): Promise<string> => {
  return new Promise((resolve, reject) => {
    const image = new Image();
    image.crossOrigin = "anonymous";
    image.src = imageSrc;
    image.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = pixelCrop.width;
      canvas.height = pixelCrop.height;
      const ctx = canvas.getContext('2d');
      if (!ctx) return reject();
      ctx.drawImage(
        image,
        pixelCrop.x,
        pixelCrop.y,
        pixelCrop.width,
        pixelCrop.height,
        0,
        0,
        pixelCrop.width,
        pixelCrop.height
      );
      resolve(canvas.toDataURL('image/jpeg', 0.8));
    };
    image.onerror = reject;
  });
};

// --- Admin Modal Component ---
const AdminModal = ({
  isOpen,
  onClose,
  songUrl,
  setSongUrl,
  galleryImages,
  setGalleryImages,
  setToastMessage,
  setIsToastVisible,
  guestMessages,
  setGuestMessages,
  groomImage,
  setGroomImage,
  brideImage,
  setBrideImage,
  documentUrls,
  setDocumentUrls,
  groomName,
  setGroomName,
  brideName,
  setBrideName,
  weddingDate,
  setWeddingDate,
  weddingVenue,
  setWeddingVenue,
  coverImage,
  setCoverImage
}: {
  isOpen: boolean;
  onClose: () => void;
  songUrl: string;
  setSongUrl: (url: string) => void;
  galleryImages: string[];
  setGalleryImages: (imgs: string[]) => void;
  setToastMessage: (msg: string) => void;
  setIsToastVisible: (v: boolean) => void;
  guestMessages: any[];
  setGuestMessages: (msgs: any[]) => void;
  groomImage: string;
  setGroomImage: (img: string) => void;
  brideImage: string;
  setBrideImage: (img: string) => void;
  documentUrls: string[];
  setDocumentUrls: (docs: string[]) => void;
  groomName: string;
  setGroomName: (n: string) => void;
  brideName: string;
  setBrideName: (n: string) => void;
  weddingDate: string;
  setWeddingDate: (d: string) => void;
  weddingVenue: string;
  setWeddingVenue: (v: string) => void;
  coverImage: string;
  setCoverImage: (img: string) => void;
}) => {
  const [pin, setPin] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [newImage, setNewImage] = useState('');
  const [newSong, setNewSong] = useState(songUrl);
  const [rsvps, setRsvps] = useState<any[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [authError, setAuthError] = useState('');
  const [cloudStatus, setCloudStatus] = useState<any>(null);
  const [editingBlessingId, setEditingBlessingId] = useState<string | null>(null);
  const [editingBlessingName, setEditingBlessingName] = useState('');
  const [editingBlessingMsg, setEditingBlessingMsg] = useState('');

  // Crop states
  const [cropModalOpen, setCropModalOpen] = useState(false);
  const [cropTarget, setCropTarget] = useState<'groom' | 'bride'>('groom');
  const [cropImageRaw, setCropImageRaw] = useState('');
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<any>(null);

  const compressImage = async (file: File): Promise<File> => {
    if (!file.type.startsWith('image/') || file.type === 'image/gif') return file;
    
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = (event) => {
        const img = new Image();
        img.onload = () => {
          const canvas = document.createElement('canvas');
          let width = img.width;
          let height = img.height;
          
          const MAX_SIZE = 1600;
          if (width > height && width > MAX_SIZE) {
            height *= MAX_SIZE / width;
            width = MAX_SIZE;
          } else if (height > MAX_SIZE) {
            width *= MAX_SIZE / height;
            height = MAX_SIZE;
          }
          
          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
          ctx?.drawImage(img, 0, 0, width, height);
          
          canvas.toBlob((blob) => {
            if (blob) {
              resolve(new File([blob], file.name, { type: 'image/jpeg' }));
            } else {
              resolve(file); // fallback if compression fails
            }
          }, 'image/jpeg', 0.85); // 85% quality
        };
        img.src = event.target?.result as string;
      };
      reader.readAsDataURL(file);
    });
  };

  const uploadFile = async (rawFile: File): Promise<string> => {
    setIsUploading(true);
    
    // Compress image to avoid Vercel 4.5MB limits
    const file = await compressImage(rawFile);
    
    const formData = new FormData();
    formData.append('file', file);
    try {
      const response = await fetch('/api/upload', {
        method: 'POST',
        headers: { 'X-Admin-Pin': pin },
        body: formData,
      });
      if (!response.ok) {
        let errMessage = 'Upload failed';
        try {
          const data = await response.json();
          if (data.error) errMessage = data.error;
        } catch (e) {
          // fallback to generic message if parsing fails
        }
        throw new Error(errMessage);
      }
      const data = await response.json();
      return data.url;
    } finally {
      setIsUploading(false);
    }
  };

  const base64ToBlob = (base64: string) => {
    const byteString = atob(base64.split(',')[1]);
    const mimeString = base64.split(',')[0].split(':')[1].split(';')[0];
    const ab = new ArrayBuffer(byteString.length);
    const ia = new Uint8Array(ab);
    for (let i = 0; i < byteString.length; i++) {
      ia[i] = byteString.charCodeAt(i);
    }
    return new Blob([ab], { type: mimeString });
  };

  const updateCloudSettings = async (updates: any) => {
    try {
      const response = await fetch('/api/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'X-Admin-Pin': pin },
        body: JSON.stringify(updates),
      });
      return response.ok;
    } catch (e) {
      console.error('Failed to update cloud settings:', e);
      return false;
    }
  };

  const initCrop = (type: 'groom' | 'bride') => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.onchange = (e: any) => {
      const file = e.target.files?.[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (ev) => {
          setCropImageRaw(ev.target?.result as string);
          setCropTarget(type);
          setCropModalOpen(true);
        };
        reader.readAsDataURL(file);
      }
    };
    input.click();
  };

  const finalizeCrop = async () => {
    try {
      const croppedImgBase64 = await getCroppedImg(cropImageRaw, croppedAreaPixels);
      const blob = base64ToBlob(croppedImgBase64);
      const file = new File([blob], `profile_${cropTarget}.jpg`, { type: 'image/jpeg' });

      const cloudUrl = await uploadFile(file);

      if (cropTarget === 'groom') {
        await updateCloudSettings({ groomImage: cloudUrl });
        setGroomImage(cloudUrl);
      } else {
        await updateCloudSettings({ brideImage: cloudUrl });
        setBrideImage(cloudUrl);
      }

      setToastMessage('Profile photo updated in cloud!');
      setIsToastVisible(true);
      setCropModalOpen(false);
    } catch (e) {
      setToastMessage(e instanceof Error ? e.message : 'Upload failed. Check Cloudinary settings.');
      setIsToastVisible(true);
      setCropModalOpen(false);
    }
  };

useEffect(() => {
  if (isAuthenticated) {
    const fetchAdminData = async () => {
      try {
        const response = await fetch('/api/rsvps');
        if (response.ok) {
          const serverRsvps = await response.json();
          setRsvps(serverRsvps);
        }
      } catch (e) {
        console.error('Failed to fetch RSVPs');
      }
    };
    fetchAdminData();
  }
}, [isAuthenticated]);

if (!isOpen) return null;

const handleLogin = async (e: React.FormEvent) => {
  e.preventDefault();
  setAuthError('');
  try {
    const res = await fetch('/api/auth/verify', {
      headers: { 'X-Admin-Pin': pin },
    });
    if (res.ok) {
      setIsAuthenticated(true);
      setToastMessage('Access Granted âœ“');
      setIsToastVisible(true);
      // Check cloud storage status
      const statusRes = await fetch('/api/cloud-status', {
        headers: { 'X-Admin-Pin': pin },
      });
      if (statusRes.ok) {
        const status = await statusRes.json();
        setCloudStatus(status);
      }
    } else {
      setAuthError('Incorrect password. Please try again.');
      setToastMessage('Incorrect Password');
      setIsToastVisible(true);
    }
  } catch (err) {
    setAuthError('Server error. Make sure the server is running.');
  }
};

const saveConfig = async () => {
  const success = await updateCloudSettings({
    songUrl: newSong,
    groomName,
    brideName,
    weddingDate,
    weddingVenue,
    coverImage
  });
  if (success) {
    setSongUrl(newSong);
    setToastMessage('Settings Saved to Cloud!');
  } else {
    setToastMessage('Failed to save settings');
  }
  setIsToastVisible(true);
};

const clearRSVPs = async () => {
  if (window.confirm('Clear all RSVPs? This cannot be undone.')) {
    try {
      const res = await fetch('/api/rsvps', { method: 'DELETE' });
      if (res.ok) {
        setRsvps([]);
        setToastMessage('RSVPs cleared');
        setIsToastVisible(true);
      }
    } catch (e) {
      setToastMessage('Failed to clear RSVPs');
      setIsToastVisible(true);
    }
  }
};

const clearGuestbook = async () => {
  if (window.confirm('Clear all blessings? This cannot be undone.')) {
    try {
      const res = await fetch('/api/guestbook', { method: 'DELETE' });
      if (res.ok) {
        setGuestMessages([]);
        setToastMessage('Blessings cleared');
        setIsToastVisible(true);
      }
    } catch (e) {
      setToastMessage('Failed to clear blessings');
      setIsToastVisible(true);
    }
  }
};

const addImage = async () => {
  if (!newImage) return;
  const updated = [...galleryImages, newImage];
  const success = await updateCloudSettings({ galleryImages: updated });
  if (success) {
    setGalleryImages(updated);
    setNewImage('');
    setToastMessage('Image Added to Cloud Gallery');
  } else {
    setToastMessage('Failed to add image');
  }
  setIsToastVisible(true);
};

const processFiles = async (files: File[]) => {
  if (!files || files.length === 0) return;
  const total = files.length;
  let uploadedUrls: string[] = [];
  let failed = 0;

  for (let i = 0; i < files.length; i++) {
    const file = files[i];
    try {
      setToastMessage(`Uploading ${i + 1} of ${total} image${total > 1 ? 's' : ''}...`);
      setIsToastVisible(true);
      const cloudUrl = await uploadFile(file);
      uploadedUrls.push(cloudUrl);
    } catch (err) {
      failed++;
      console.error(`Failed to upload file ${file.name}:`, err);
    }
  }

  if (uploadedUrls.length > 0) {
    const updated = [...galleryImages, ...uploadedUrls];
    const success = await updateCloudSettings({ galleryImages: updated });
    if (success) {
      setGalleryImages(updated);
      if (failed > 0) {
        setToastMessage(`${uploadedUrls.length} uploaded, ${failed} failed.`);
      } else {
        setToastMessage(`${uploadedUrls.length} image${uploadedUrls.length > 1 ? 's' : ''} uploaded to Cloud! ✓`);
      }
    } else {
      setToastMessage('Uploaded but failed to sync gallery');
    }
  } else {
    setToastMessage('All uploads failed. Please try again.');
  }
  setIsToastVisible(true);
};

// Keep single-file wrapper for backward compatibility
const processFile = async (file: File) => processFiles([file]);

const processAudioFile = async (file: File) => {
  if (!file) return;
  if (!file.type.startsWith('audio/')) {
    setToastMessage('Please upload an audio file');
    setIsToastVisible(true);
    return;
  }

  try {
    setToastMessage('Uploading audio to cloud...');
    setIsToastVisible(true);

    const cloudUrl = await uploadFile(file);
    const success = await updateCloudSettings({ songUrl: cloudUrl });

    if (success) {
      setSongUrl(cloudUrl);
      setNewSong(cloudUrl);
      setToastMessage('Audio Uploaded & Saved to Cloud!');
    } else {
      setToastMessage('Failed to sync audio setting');
    }
    setIsToastVisible(true);
  } catch (err) {
    setToastMessage(err instanceof Error ? err.message : 'Error uploading audio file');
    setIsToastVisible(true);
  }
};

const processDocumentFile = async (file: File) => {
  if (!file) return;
  try {
    setToastMessage('Uploading document to cloud...');
    setIsToastVisible(true);

    const cloudUrl = await uploadFile(file);
    const updated = [...documentUrls, cloudUrl];
    const success = await updateCloudSettings({ documentUrls: updated });

    if (success) {
      setDocumentUrls(updated);
      setToastMessage('Document Uploaded to Cloud!');
    } else {
      setToastMessage('Failed to sync document');
    }
    setIsToastVisible(true);
  } catch (err) {
    setToastMessage(err instanceof Error ? err.message : 'Error uploading document');
    setIsToastVisible(true);
  }
};

const removeDocument = async (index: number) => {
  const updated = documentUrls.filter((_, i) => i !== index);
  const success = await updateCloudSettings({ documentUrls: updated });
  if (success) {
    setDocumentUrls(updated);
    setToastMessage('Document removed from cloud');
    setIsToastVisible(true);
  }
};

const removeImage = async (index: number) => {
  const updated = galleryImages.filter((_, i) => i !== index);
  const success = await updateCloudSettings({ galleryImages: updated });
  if (success) {
    setGalleryImages(updated);
  }
};

// â”€â”€â”€ Individual RSVP delete â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
const deleteRsvp = async (id: string) => {
  if (!window.confirm('Delete this RSVP entry?')) return;
  try {
    const res = await fetch(`/api/rsvps/${id}`, {
      method: 'DELETE',
      headers: { 'X-Admin-Pin': pin },
    });
    if (res.ok) {
      setRsvps(prev => prev.filter((r: any) => r._id !== id));
      setToastMessage('RSVP deleted');
      setIsToastVisible(true);
    }
  } catch (e) {
    setToastMessage('Failed to delete RSVP');
    setIsToastVisible(true);
  }
};

// â”€â”€â”€ Individual Blessing delete â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
const deleteBlessing = async (id: string) => {
  if (!window.confirm('Delete this blessing?')) return;
  try {
    const res = await fetch(`/api/guestbook/${id}`, {
      method: 'DELETE',
      headers: { 'X-Admin-Pin': pin },
    });
    if (res.ok) {
      setGuestMessages(guestMessages.filter((m: any) => m._id !== id));
      setToastMessage('Blessing deleted');
      setIsToastVisible(true);
    }
  } catch (e) {
    setToastMessage('Failed to delete blessing');
    setIsToastVisible(true);
  }
};

// â”€â”€â”€ Individual Blessing edit â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
const startEditBlessing = (msg: any) => {
  setEditingBlessingId(msg._id);
  setEditingBlessingName(msg.name);
  setEditingBlessingMsg(msg.message);
};

const saveEditBlessing = async () => {
  if (!editingBlessingId) return;
  try {
    const res = await fetch(`/api/guestbook/${editingBlessingId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', 'X-Admin-Pin': pin },
      body: JSON.stringify({ name: editingBlessingName, message: editingBlessingMsg }),
    });
    if (res.ok) {
      const updated = await res.json();
      setGuestMessages(guestMessages.map((m: any) => m._id === editingBlessingId ? updated : m));
      setEditingBlessingId(null);
      setToastMessage('Blessing updated');
      setIsToastVisible(true);
    }
  } catch (e) {
    setToastMessage('Failed to update blessing');
    setIsToastVisible(true);
  }
};

return (
  <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-purple-dark/90 backdrop-blur-sm">
    <div className="clay-card-gold text-purple-dark w-full max-w-md max-h-[90vh] flex flex-col shadow-2xl overflow-hidden relative">
      {isUploading && (
        <div className="absolute inset-0 z-[210] bg-white/50 backdrop-blur-sm flex items-center justify-center">
          <div className="text-center">
            <div className="w-12 h-12 border-4 border-purple-deep border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
            <p className="font-bold">Uploading to Cloud...</p>
          </div>
        </div>
      )}
      <div className="flex justify-between items-center p-4 md:p-6 border-b border-accent-gold/20">
        <h2 className="text-xl md:text-2xl font-display font-bold flex items-center gap-2">
          <Lock size={20} /> Admin Access
        </h2>
        <button onClick={onClose} className="text-purple-light hover:text-purple-deep">
          <XCircle size={24} />
        </button>
      </div>

      <div className="p-4 md:p-6 overflow-y-auto w-full">
        {!isAuthenticated ? (
          <form onSubmit={handleLogin} className="space-y-4">
            <p className="text-sm font-semibold">Enter Password</p>
            <input
              type="password"
              className="w-full px-4 py-3 rounded-xl bg-cream-gold border-2 border-accent-light/50 focus:border-accent-gold outline-none"
              value={pin}
              onChange={(e) => { setPin(e.target.value); setAuthError(''); }}
              placeholder="Enter password..."
              autoFocus
            />
            {authError && (
              <p className="text-red-600 text-xs font-semibold text-center">{authError}</p>
            )}
            <button type="submit" className="w-full clay-button bg-purple-deep text-cream-gold py-3 font-bold">Login</button>
          </form>
        ) : (
          <div className="space-y-6 w-full">
            <div className="space-y-3 bg-purple-light/5 p-4 rounded-xl border border-accent-gold/10">
              <label className="text-xs font-bold uppercase tracking-widest text-purple-deep">General Info</label>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[10px] font-bold block mb-1">Groom Name</label>
                  <input type="text" value={groomName} onChange={(e) => setGroomName(e.target.value)} className="w-full px-2 py-1.5 text-sm rounded border bg-white" />
                </div>
                <div>
                  <label className="text-[10px] font-bold block mb-1">Bride Name</label>
                  <input type="text" value={brideName} onChange={(e) => setBrideName(e.target.value)} className="w-full px-2 py-1.5 text-sm rounded border bg-white" />
                </div>
              </div>
              <div>
                <label className="text-[10px] font-bold block mb-1">Wedding Date & Time</label>
                <input type="datetime-local" value={weddingDate.substring(0, 16)} onChange={(e) => setWeddingDate(e.target.value)} className="w-full px-2 py-1.5 text-sm rounded border bg-white" />
              </div>
              <div>
                <label className="text-[10px] font-bold block mb-1">Wedding Venue</label>
                <input type="text" value={weddingVenue} onChange={(e) => setWeddingVenue(e.target.value)} className="w-full px-2 py-1.5 text-sm rounded border bg-white" />
              </div>
              <button onClick={saveConfig} className="w-full bg-purple-deep text-cream-gold py-2 rounded-lg text-xs font-bold mt-2 hover:bg-purple-light transition-all">Save General Settings</button>
            </div>

            <div className="space-y-3 bg-purple-light/5 p-4 rounded-xl border border-accent-gold/10">
              <label className="text-xs font-bold uppercase tracking-widest text-purple-deep">Welcome Cover Image</label>
              <div
                className="border-2 border-dashed border-accent-gold/50 rounded-lg p-4 text-center cursor-pointer hover:bg-accent-gold/5 transition-colors relative"
                onClick={() => document.getElementById('cover-upload')?.click()}
              >
                <input
                  type="file"
                  id="cover-upload"
                  accept="image/*"
                  className="hidden"
                  onChange={async (e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      setToastMessage('Uploading cover image...');
                      setIsToastVisible(true);
                      try {
                        const url = await uploadFile(file);
                        const success = await updateCloudSettings({ coverImage: url });
                        if (success) {
                          setCoverImage(url);
                          setToastMessage('Cover image updated in cloud!');
                        } else {
                          throw new Error('Cover image uploaded but failed to sync.');
                        }
                      } catch {
                        setToastMessage('Cover image upload failed');
                      }
                    }
                    if (e.target) e.target.value = '';
                  }}
                />
                <UploadCloud size={24} className="mx-auto text-purple-deep/40 mb-2" />
                <p className="text-xs font-semibold">Upload Welcome Background</p>
              </div>
              {coverImage && (
                <div className="relative aspect-video rounded-md overflow-hidden mt-2 border border-accent-gold/30">
                  <img src={coverImage} className="w-full h-full object-cover" />
                  <button
                    onClick={async () => {
                      const success = await updateCloudSettings({ coverImage: '' });
                      if (success) setCoverImage('');
                    }}
                    className="absolute top-1 right-1 bg-red-600 text-white p-1 rounded-full"
                  >
                    <Trash2 size={12} />
                  </button>
                </div>
              )}
            </div>

            <div className="space-y-3">
              <label className="text-sm font-bold block">Background Music (.mp3)</label>

              <div
                className="border-2 border-dashed border-accent-gold/50 rounded-lg p-4 text-center cursor-pointer hover:bg-accent-gold/5 transition-colors relative"
                onClick={() => document.getElementById('audio-upload')?.click()}
                onDragOver={(e) => { e.preventDefault(); e.stopPropagation(); }}
                onDrop={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  const file = e.dataTransfer.files?.[0];
                  if (file) processAudioFile(file);
                }}
              >
                <input
                  type="file"
                  id="audio-upload"
                  accept="audio/*"
                  className="hidden"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) processAudioFile(file);
                    if (e.target) e.target.value = '';
                  }}
                />
                <UploadCloud size={24} className="mx-auto text-purple-deep/40 mb-2" />
                <p className="text-xs font-semibold text-purple-dark/80">Click to upload or drag & drop MP3</p>
                <p className="text-[10px] text-purple-dark/50">Stored in Cloudinary</p>
              </div>

              <div className="flex items-center gap-2 text-xs text-purple-dark/30 font-bold justify-center py-1">
                <div className="h-[1px] bg-accent-gold/20 flex-1"></div>
                OR URL
                <div className="h-[1px] bg-accent-gold/20 flex-1"></div>
              </div>

              <div className="flex flex-col sm:flex-row gap-2">
                <input
                  type="url"
                  className="flex-1 px-3 py-2 text-sm rounded-lg border-2 border-accent-gold/30 bg-white"
                  value={newSong}
                  onChange={(e) => setNewSong(e.target.value)}
                  placeholder="https://...mp3"
                />
                <button onClick={saveConfig} className="bg-purple-deep text-cream-gold px-4 py-2 rounded-lg text-sm font-bold w-full sm:w-auto">Save URL</button>
              </div>
            </div>

            <div className="space-y-3 border-t border-accent-gold/20 pt-4">
              <label className="text-sm font-bold block">Profile Photos (Hero Section)</label>
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center bg-purple-light/10 p-3 rounded-lg border border-accent-gold/20">
                  <img src={groomImage} className="w-16 h-16 rounded-full mx-auto object-cover mb-2 border-2 border-accent-gold" />
                  <button onClick={() => initCrop('groom')} className="text-xs bg-purple-deep hover:bg-purple-light text-cream-gold px-3 py-2 rounded-lg w-full font-bold transition-colors">Edit Groom</button>
                </div>
                <div className="text-center bg-purple-light/10 p-3 rounded-lg border border-accent-gold/20">
                  <img src={brideImage} className="w-16 h-16 rounded-full mx-auto object-cover mb-2 border-2 border-accent-gold" />
                  <button onClick={() => initCrop('bride')} className="text-xs bg-purple-deep hover:bg-purple-light text-cream-gold px-3 py-2 rounded-lg w-full font-bold transition-colors">Edit Bride</button>
                </div>
              </div>
            </div>

            <div className="space-y-3 border-t border-accent-gold/20 pt-4">
              <label className="text-sm font-bold block">Add Gallery Image</label>

              <div
                className="border-2 border-dashed border-accent-gold/50 rounded-lg p-4 text-center cursor-pointer hover:bg-accent-gold/5 transition-colors relative"
                onClick={() => document.getElementById('gallery-upload')?.click()}
                onDragOver={(e) => { e.preventDefault(); e.stopPropagation(); }}
                onDrop={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  const files = Array.from(e.dataTransfer.files).filter(f => f.type.startsWith('image/'));
                  if (files.length > 0) processFiles(files);
                }}
              >
                <input
                  type="file"
                  id="gallery-upload"
                  accept="image/*"
                  multiple
                  className="hidden"
                  onChange={(e) => {
                    const files = Array.from(e.target.files || []);
                    if (files.length > 0) processFiles(files);
                    if (e.target) e.target.value = '';
                  }}
                />
                <UploadCloud size={24} className="mx-auto text-purple-deep/40 mb-2" />
                <p className="text-xs font-semibold text-purple-dark/80">Click to upload or drag & drop</p>
                <p className="text-[10px] text-purple-dark/50">Select multiple images at once • Stored in Cloudinary</p>
              </div>

              <div className="flex items-center gap-2 text-xs text-purple-dark/30 font-bold justify-center py-1">
                <div className="h-[1px] bg-accent-gold/20 flex-1"></div>
                OR URL
                <div className="h-[1px] bg-accent-gold/20 flex-1"></div>
              </div>

              <div className="flex gap-2">
                <input
                  type="text"
                  className="flex-1 px-3 py-2 text-sm rounded-lg border-2 border-accent-gold/30 bg-white"
                  value={newImage}
                  onChange={(e) => setNewImage(e.target.value)}
                  placeholder="https://... or /image.jpg"
                />
                <button onClick={addImage} className="bg-green-600 text-white px-3 py-2 rounded-lg shrink-0"><Plus size={18} /></button>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-3 gap-2 mt-4 max-h-40 overflow-y-auto pr-2 pb-2">
                {galleryImages.map((img, i) => (
                  <div key={i} className="relative aspect-square rounded-md overflow-hidden group">
                    <img src={img} alt="" className="w-full h-full object-cover bg-gray-200" />
                    <button onClick={() => removeImage(i)} className="absolute inset-0 bg-red-600/50 flex items-center justify-center opacity-100 sm:opacity-0 sm:group-hover:opacity-100 text-white transition-opacity">
                      <Trash2 size={24} />
                    </button>
                  </div>
                ))}
              </div>
            </div>



            <div className="border-t border-accent-gold/20 pt-4 pb-2">
              <div className="flex justify-between items-center mb-3">
                <h3 className="text-sm font-bold flex items-center gap-2"><CheckCircle2 size={16} className="text-green-600" /> RSVP List ({rsvps.length})</h3>
                {rsvps.length > 0 && <button onClick={clearRSVPs} className="text-[10px] text-red-500 font-bold hover:underline">Clear All</button>}
              </div>
              <div className="max-h-60 overflow-y-auto space-y-2 pr-2">
                {rsvps.length === 0 ? (
                  <p className="text-xs text-center text-purple-dark/50 py-4">No RSVPs received yet</p>
                ) : (
                  rsvps.map((rsvp: any) => (
                    <div key={rsvp._id || rsvp.name} className="bg-purple-light/20 p-3 rounded-lg border border-accent-gold/20 text-sm">
                      <div className="flex justify-between items-start font-bold">
                        <div>
                          <span>{rsvp.name} <span className="text-xs font-normal opacity-70">({rsvp.guests} guests)</span></span>
                          <span className={`block text-xs mt-0.5 ${rsvp.attending === true ? 'text-green-600' : 'text-red-500'}`}>
                            {rsvp.attending === true ? 'Attending' : 'Declined'}
                          </span>
                        </div>
                        <button
                          onClick={() => deleteRsvp(rsvp._id)}
                          title="Delete this RSVP"
                          className="text-red-400 hover:text-red-600 p-1 rounded transition-colors shrink-0"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                      {rsvp.mobile && <div className="text-xs text-purple-dark/70 mt-1">{rsvp.mobile}</div>}
                      {rsvp.message && (
                        <div className="text-xs mt-2 italic bg-white/50 p-2 rounded border border-purple-light/30">"{rsvp.message}"</div>
                      )}
                    </div>
                  ))
                )}
              </div>
            </div>

            <div className="border-t border-accent-gold/20 pt-4 pb-2">
              <div className="flex justify-between items-center mb-3">
                <h3 className="text-sm font-bold flex items-center gap-2"><Heart size={16} className="text-purple-deep" /> Blessings ({guestMessages.length})</h3>
                {guestMessages.length > 0 && <button onClick={clearGuestbook} className="text-[10px] text-red-500 font-bold hover:underline">Clear All</button>}
              </div>
              <div className="max-h-72 overflow-y-auto space-y-2 pr-2">
                {guestMessages.length === 0 ? (
                  <p className="text-xs text-center text-purple-dark/50 py-4">No blessings received yet</p>
                ) : (
                  guestMessages.map((msg: any) => (
                    <div key={msg._id || msg.name} className="bg-purple-light/10 p-3 rounded-lg border border-accent-gold/10 text-xs">
                      {editingBlessingId === msg._id ? (
                        <div className="space-y-2">
                          <input
                            className="w-full px-2 py-1 rounded border border-accent-gold/40 bg-white text-xs"
                            value={editingBlessingName}
                            onChange={e => setEditingBlessingName(e.target.value)}
                            placeholder="Name"
                          />
                          <textarea
                            className="w-full px-2 py-1 rounded border border-accent-gold/40 bg-white text-xs resize-none"
                            rows={2}
                            value={editingBlessingMsg}
                            onChange={e => setEditingBlessingMsg(e.target.value)}
                            placeholder="Message"
                          />
                          <div className="flex gap-2">
                            <button onClick={saveEditBlessing} className="flex-1 bg-green-600 text-white py-1 rounded text-xs font-bold">Save</button>
                            <button onClick={() => setEditingBlessingId(null)} className="flex-1 bg-gray-400 text-white py-1 rounded text-xs font-bold">Cancel</button>
                          </div>
                        </div>
                      ) : (
                        <div className="flex justify-between items-start gap-2">
                          <div className="overflow-hidden">
                            <div className="font-bold mb-1 truncate">{msg.name}</div>
                            <div className="italic opacity-80 break-words">"{msg.message}"</div>
                          </div>
                          <div className="flex gap-1 shrink-0">
                            <button
                              onClick={() => startEditBlessing(msg)}
                              title="Edit blessing"
                              className="text-purple-deep/60 hover:text-purple-deep p-1 rounded transition-colors"
                            >
                              âœï¸
                            </button>
                            <button
                              onClick={() => deleteBlessing(msg._id)}
                              title="Delete blessing"
                              className="text-red-400 hover:text-red-600 p-1 rounded transition-colors"
                            >
                              <Trash2 size={12} />
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>

    {cropModalOpen && (
      <div className="fixed inset-0 z-[300] bg-purple-dark/95 flex flex-col justify-center items-center p-4">
        <div className="w-full max-w-sm h-[400px] relative bg-black/50 overflow-hidden mb-4 rounded-xl border border-accent-gold shadow-2xl">
          <Cropper
            image={cropImageRaw}
            crop={crop}
            zoom={zoom}
            aspect={1}
            cropShape="round"
            showGrid={false}
            onCropChange={setCrop}
            onZoomChange={setZoom}
            onCropComplete={(croppedArea, croppedAreaPixels) => setCroppedAreaPixels(croppedAreaPixels)}
          />
        </div>
        <div className="w-full max-w-sm mb-6 bg-purple-light/20 p-4 rounded-xl border border-accent-gold/30">
          <label className="text-cream-gold text-xs mb-2 font-bold block flex justify-between">
            <span>Zoom</span>
            <span>{Math.round(zoom * 100)}%</span>
          </label>
          <input type="range" min="1" max="3" step="0.05" value={zoom} onChange={(e) => setZoom(Number(e.target.value))} className="w-full accent-accent-gold" />
        </div>
        <div className="flex gap-4 w-full max-w-sm">
          <button onClick={() => setCropModalOpen(false)} className="flex-1 py-3 bg-red-600/80 hover:bg-red-600 text-white rounded-lg font-bold transition-colors">Cancel</button>
          <button onClick={finalizeCrop} className="flex-1 py-3 bg-green-600 hover:bg-green-500 text-white rounded-lg font-bold transition-colors">Crop & Save</button>
        </div>
      </div>
    )}
  </div>
);
};


export default AdminModal;




